/**
 * PAID eval runner (E5): runs the frozen case set (scripts/eval/cases.json) through
 * runCompose / runAnswer for one configuration, one case at a time, and writes each run's
 * RunLog and emitted page to .kb-cache/eval/<label>/t<trial>/<case>.{log,page}.json plus a
 * manifest.json (git SHA + working-tree diff hash of the runner and of the tree that ran,
 * model, effort, budgets, spend).
 *
 *   EMMAUS_EVAL_RUN=1 node scripts/eval/run.ts --label cand --max-usd 20
 *   EMMAUS_EVAL_RUN=1 node scripts/eval/run.ts --label base --max-usd 20 --root ../bible-app-eval-base
 *   node scripts/eval/run.ts --dry-run --label dry --max-usd 5        (scripted model: free)
 *
 * Guards: a real run needs EMMAUS_EVAL_RUN=1 and --max-usd; before each case it stops if the
 * spend so far plus that case's estimate (the costliest run of its flow seen so far, at least
 * the costliest logged Opus 5 high run) would pass the cap. Every run regenerates (the page
 * cache is neither read nor written). The model, effort and budgets come from the environment
 * and .env/.env.local exactly as the dev server reads them (EMMAUS_MODEL, EMMAUS_EFFORT, …).
 *
 * --root loads server/inference and server/kb from another checkout (e.g. a baseline
 * worktree of main, see baseline-worktree.sh) through Vite's SSR loader — the same way the
 * dev server loads server/app.ts — so both trees run under identical harness code.
 */
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import type { Study, TranslationId } from '../../src/domain/models.ts';
import type { Locale } from '../../src/i18n/locales.ts';
import type { AnswerRequest, ComposeRequest, InferenceEvent } from '../../src/inference/protocol.ts';
import type { InferenceConfig } from '../../server/inference/config.ts';
import type { RunLog } from '../../server/inference/logs.ts';
import type { ModelClient } from '../../server/inference/modelClient.ts';
import { DryRunModelClient } from './fakeClient.ts';
import {
  CASES_FILE,
  caseText,
  costUsd,
  DEFAULT_OUT,
  loadCases,
  PRICES,
  REPO_ROOT,
  stampTree,
  turnCounts,
  type EvalCase,
  type EvalMeta,
  type EvalRunLog,
  type PageSidecar,
  type Rates,
  type TreeStamp,
} from './lib.ts';

const USAGE = `Usage: EMMAUS_EVAL_RUN=1 node scripts/eval/run.ts --label <name> --max-usd <n> [options]
       node scripts/eval/run.ts --dry-run --label <name> --max-usd <n> [options]

  --label <name>     results go to <out>/<name>/ (letters, digits, . _ -)
  --max-usd <n>      stop before the next case once the spend would pass n dollars (required)
  --trials <n>       repeat the case set n times (default 1)
  --root <dir>       checkout whose server code runs (default: this repository)
  --root-id <id>     name for that checkout in the manifest (default: <dir name>@<sha>)
  --cases <a,b,…>    only these case ids
  --cases-file <f>   case set (default scripts/eval/cases.json)
  --out <dir>        results root (default .kb-cache/eval)
  --resume           continue an interrupted label: skip the runs its manifest already has
  --dry-run          scripted model (no network, no cost); EMMAUS_EVAL_RUN not needed`;

/** Spend assumed for the next run of a flow: the costliest logged Opus 5 high run (2026-09-30), or the costliest seen in this invocation if higher. */
const PRIOR_USD = { compose: 1.41, answer: 0.38 } as const;

interface Options {
  label: string;
  maxUsd: number;
  trials: number;
  root: string;
  rootId: string | null;
  caseIds: string[] | null;
  casesFile: string;
  out: string;
  resume: boolean;
  dryRun: boolean;
}

interface RunEntry {
  caseId: string;
  trial: number;
  flow: 'compose' | 'answer';
  /** relative to the label directory */
  log: string;
  page: string;
  end: string;
  error: string | null;
  costUsd: number | null;
  durationMs: number;
  turns: number;
  /** failed attempts (billed, in costUsd; not turns) */
  failedAttempts: number;
}

interface Caps {
  maxTokens: number;
  maxResearchCalls: number;
  maxAnswerResearchCalls: number;
  researchMs: number;
  totalMs: number;
  maxTurns: number;
  fallbacks: boolean;
}

interface Manifest {
  label: string;
  createdAt: string;
  updatedAt: string;
  dryRun: boolean;
  /** --max-usd of the latest invocation (the cap applies per invocation) */
  maxUsd: number;
  invocations: number;
  /** this harness's checkout */
  runner: TreeStamp;
  /** the checkout whose server code ran */
  tree: TreeStamp & { id: string };
  model: string;
  effort: string;
  caps: Caps;
  rates: Rates;
  /** knowledge-base and generator versions the first run reported (RunLog.versions) */
  versions: { kb: string; generator: string } | null;
  cases: { file: string; sha256: string; ids: string[] };
  trials: number;
  spendUsd: number;
  stopped: { reason: string; caseId: string; trial: number; spentUsd: number; nextEstimateUsd: number } | null;
  runs: RunEntry[];
}

/** The tree's own modules, loaded through Vite (types from this checkout; the runtime from --root). */
interface Tree {
  run: typeof import('../../server/inference/run.ts');
  config: typeof import('../../server/inference/config.ts');
  kb: typeof import('../../server/kb/index.ts');
  modelClient: typeof import('../../server/inference/modelClient.ts');
  close(): Promise<void>;
}

class Refusal extends Error {}

function parseOptions(argv: string[]): Options | 'help' {
  const { values } = parseArgs({
    args: argv,
    strict: true,
    options: {
      label: { type: 'string' },
      'max-usd': { type: 'string' },
      trials: { type: 'string' },
      root: { type: 'string' },
      'root-id': { type: 'string' },
      cases: { type: 'string' },
      'cases-file': { type: 'string' },
      out: { type: 'string' },
      resume: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean' },
    },
  });
  if (values.help) return 'help';
  const dryRun = values['dry-run'] === true;
  // the paid guard comes first: nothing else is read or loaded without it
  if (!dryRun && process.env.EMMAUS_EVAL_RUN !== '1') {
    throw new Refusal('Refusing to run: this bills the Claude API. Set EMMAUS_EVAL_RUN=1 (and pass --max-usd) to run for real, or pass --dry-run.');
  }
  const maxUsd = Number(values['max-usd']);
  if (values['max-usd'] === undefined || !Number.isFinite(maxUsd) || maxUsd <= 0) throw new Refusal('Refusing to run: --max-usd <dollars> (a positive number) is required.');
  const label = values.label ?? '';
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(label) || label.startsWith('.')) throw new Refusal('Refusing to run: --label <name> is required (letters, digits, . _ -).');
  const trials = values.trials === undefined ? 1 : Number(values.trials);
  if (!Number.isInteger(trials) || trials < 1 || trials > 10) throw new Refusal('--trials must be an integer from 1 to 10.');
  return {
    label,
    maxUsd,
    trials,
    root: resolve(values.root ?? REPO_ROOT),
    rootId: values['root-id'] ?? null,
    caseIds: values.cases ? values.cases.split(',').map((s) => s.trim()).filter(Boolean) : null,
    casesFile: resolve(values['cases-file'] ?? CASES_FILE),
    out: resolve(values.out ?? DEFAULT_OUT),
    resume: values.resume === true,
    dryRun,
  };
}

async function loadTree(root: string): Promise<Tree> {
  const { createServer } = await import('vite');
  const vite = await createServer({
    root,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true },
  });
  const load = async <T>(path: string): Promise<T> => (await vite.ssrLoadModule(path)) as T;
  return {
    run: await load('/server/inference/run.ts'),
    config: await load('/server/inference/config.ts'),
    kb: await load('/server/kb/index.ts'),
    modelClient: await load('/server/inference/modelClient.ts'),
    close: () => vite.close(),
  };
}

/** process env merged over .env / .env.local of this checkout, as server/vitePlugin.ts does */
async function serverEnv(): Promise<Record<string, string>> {
  const { loadEnv } = await import('vite');
  const env: Record<string, string> = { ...loadEnv('development', REPO_ROOT, '') };
  for (const [k, v] of Object.entries(process.env)) if (typeof v === 'string') env[k] = v;
  return env;
}

function capsOf(c: InferenceConfig): Caps {
  return {
    maxTokens: c.maxTokens,
    maxResearchCalls: c.maxResearchCalls,
    maxAnswerResearchCalls: c.maxAnswerResearchCalls,
    researchMs: c.researchMs,
    totalMs: c.totalMs,
    maxTurns: c.maxTurns,
    fallbacks: c.fallbacks,
  };
}

function usd(n: number | null): string {
  return n == null ? '$?' : `$${n.toFixed(2)}`;
}

async function writeJson(path: string, data: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

interface CaseContext {
  tree: Tree;
  kb: Awaited<ReturnType<Tree['kb']['getKnowledgeBase']>>;
  config: InferenceConfig;
  client: ModelClient | null;
  opts: Options;
  casesDir: string;
  labelDir: string;
  signal: AbortSignal;
}

/** One case: the request the app would send, run to its end; returns the manifest entry and the priced run. */
async function runCase(c: EvalCase, trial: number, ctx: CaseContext): Promise<{ entry: RunEntry; log: RunLog | null }> {
  const { tree, config, opts } = ctx;
  let log: RunLog | null = null;
  let study: Study | null = null;
  const sidecar: PageSidecar = { study: null, reply: null, error: null };
  const emit = (e: InferenceEvent): void => {
    if (e.type === 'study') study = e.study;
    else if (e.type === 'reply') sidecar.reply = e.reply;
    else if (e.type === 'error') sidecar.error = { code: e.code, message: e.message };
  };
  const client = ctx.client ?? new DryRunModelClient(c.flow, caseText(c), config.model);
  const deps = {
    kb: ctx.kb,
    client,
    config,
    cache: null,
    writeLog: async (l: RunLog) => {
      log = l;
      return null;
    },
    fullText: tree.kb.evidenceFullText,
  };
  const translation = c.translation as TranslationId;
  const locale = c.locale as Locale;
  const t0 = Date.now();
  if (c.flow === 'compose') {
    const req: ComposeRequest = { query: c.query, translation, locale, ...(c.hint ? { hint: c.hint } : {}), regenerate: true };
    await tree.run.runCompose(req, deps, emit, ctx.signal);
  } else {
    // the open page as the client holds it (the app posts it back as JSON)
    const page = JSON.parse(await readFile(resolve(ctx.casesDir, c.study), 'utf8')) as { study: Study };
    const req: AnswerRequest = { question: c.question, study: page.study, history: c.history, conversation: {}, translation, locale };
    await tree.run.runAnswer(req, deps, emit, ctx.signal);
  }
  sidecar.study = study;
  const dir = join(ctx.labelDir, `t${trial}`);
  const logFile = join(dir, `${c.id}.log.json`);
  const pageFile = join(dir, `${c.id}.page.json`);
  const finished = log as RunLog | null;
  if (finished) {
    const meta: EvalMeta = { caseId: c.id, label: opts.label, trial, locale: c.locale, translation: c.translation, root: opts.root, dryRun: opts.dryRun };
    const stamped: EvalRunLog = { ...finished, eval: meta };
    await writeJson(logFile, stamped);
  }
  await writeJson(pageFile, sidecar);
  return {
    log: finished,
    entry: {
      caseId: c.id,
      trial,
      flow: c.flow,
      log: relative(ctx.labelDir, logFile),
      page: relative(ctx.labelDir, pageFile),
      end: finished?.outcome.end ?? 'no-log',
      error: finished?.outcome.error?.code ?? sidecar.error?.code ?? null,
      costUsd: finished ? costUsd(finished.model, finished.usage) : null,
      durationMs: Date.now() - t0,
      ...(finished ? turnCounts(finished) : { turns: 0, failedAttempts: 0 }),
    },
  };
}

async function main(argv: string[]): Promise<number> {
  let opts: Options | 'help';
  try {
    opts = parseOptions(argv);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    console.error(`\n${USAGE}`);
    return 2;
  }
  if (opts === 'help') {
    console.log(USAGE);
    return 0;
  }

  // 1. The case set and the label directory
  const set = loadCases(opts.casesFile);
  const casesDir = dirname(set.file);
  const cases = opts.caseIds ? set.cases.filter((c) => opts.caseIds!.includes(c.id)) : set.cases;
  const unknown = (opts.caseIds ?? []).filter((id) => !set.cases.some((c) => c.id === id));
  if (unknown.length) throw new Refusal(`Unknown case ids: ${unknown.join(', ')}`);
  for (const c of cases) if (c.flow === 'answer' && !existsSync(resolve(casesDir, c.study))) throw new Refusal(`${c.id}: missing fixture ${c.study}`);
  if (!existsSync(join(opts.root, 'server', 'inference', 'run.ts'))) throw new Refusal(`--root ${opts.root} is not an Emmaus checkout (no server/inference/run.ts).`);
  const labelDir = join(opts.out, opts.label);
  const manifestFile = join(labelDir, 'manifest.json');
  const previous = existsSync(manifestFile) ? (JSON.parse(await readFile(manifestFile, 'utf8')) as Manifest) : null;
  if (previous && !opts.resume) throw new Refusal(`${labelDir} already holds a run. Use another --label, --resume to continue it, or delete the directory.`);

  // 2. The tree's server code and configuration
  const tree = await loadTree(opts.root);
  const cacheDir = await mkdtemp(join(tmpdir(), 'emmaus-eval-'));
  try {
    const config: InferenceConfig = { ...tree.config.loadInferenceConfig(await serverEnv(), opts.root), cacheDir, debugLogs: false };
    const rates = PRICES[config.model];
    if (!rates) throw new Refusal(`No prices for model ${config.model} in scripts/eval/lib.ts PRICES: its spend could not be capped.`);
    if (!opts.dryRun && !config.credential.source) throw new Refusal(`No Claude API credential found (${tree.config.NO_CREDENTIAL_REASON}).`);
    const caps = capsOf(config);
    if (previous && (previous.model !== config.model || previous.effort !== config.effort || JSON.stringify(previous.caps) !== JSON.stringify(caps) || previous.dryRun !== opts.dryRun)) {
      throw new Refusal(`--resume: ${labelDir} was run with ${previous.model}/${previous.effort} ${JSON.stringify(previous.caps)}; this configuration differs.`);
    }
    if (previous && previous.cases.sha256 !== set.sha256) throw new Refusal(`--resume: ${labelDir} was run with another version of ${relative(REPO_ROOT, set.file)}.`);
    const runner = stampTree(REPO_ROOT);
    const treeStamp = opts.root === REPO_ROOT ? runner : stampTree(opts.root);
    const treeId = opts.rootId ?? `${basename(opts.root)}@${(treeStamp.gitSha ?? 'nogit').slice(0, 7)}${treeStamp.diffHash ? `+${treeStamp.diffHash.slice(0, 8)}` : ''}`;
    const now = new Date().toISOString();
    const manifest: Manifest = previous
      ? { ...previous, updatedAt: now, maxUsd: opts.maxUsd, invocations: previous.invocations + 1, runner, tree: { ...treeStamp, id: treeId }, trials: Math.max(previous.trials, opts.trials), stopped: null }
      : {
          label: opts.label,
          createdAt: now,
          updatedAt: now,
          dryRun: opts.dryRun,
          maxUsd: opts.maxUsd,
          invocations: 1,
          runner,
          tree: { ...treeStamp, id: treeId },
          model: config.model,
          effort: config.effort,
          caps,
          rates,
          versions: null,
          cases: { file: relative(REPO_ROOT, set.file), sha256: set.sha256, ids: cases.map((c) => c.id) },
          trials: opts.trials,
          spendUsd: 0,
          stopped: null,
          runs: [],
        };
    // runs to keep on --resume: an aborted or unlogged run is run again (its spend stays counted)
    const done = new Set(manifest.runs.filter((r) => r.end !== 'no-log' && r.end !== 'aborted').map((r) => `${r.trial}:${r.caseId}`));
    manifest.runs = manifest.runs.filter((r) => done.has(`${r.trial}:${r.caseId}`));
    manifest.cases.ids = [...new Set([...manifest.cases.ids, ...cases.map((c) => c.id)])];

    let planned = 0;
    for (let trial = 1; trial <= opts.trials; trial++) for (const c of cases) if (!done.has(`${trial}:${c.id}`)) planned++;
    console.log(`${opts.dryRun ? 'DRY RUN (scripted model, no cost)' : 'PAID RUN'} — label ${opts.label}, tree ${treeId}${treeStamp.dirty ? ' (uncommitted changes)' : ''}`);
    console.log(`model ${config.model}, effort ${config.effort}, research ${caps.maxResearchCalls}/${caps.maxAnswerResearchCalls} calls, ${caps.researchMs / 1000}s research, ${caps.totalMs / 1000}s total, ${caps.maxTurns} turns, fallbacks ${caps.fallbacks ? 'on' : 'off'}`);
    console.log(`${planned} run(s): ${cases.length} case(s) × ${opts.trials} trial(s); cap $${opts.maxUsd.toFixed(2)} → ${labelDir}`);

    // 3. The knowledge base and the model client (a real one only past every guard above)
    // as the server loads it; a dry run also skips the live commentary fallback, so it never touches the network
    const kb = tree.kb.getKnowledgeBase(opts.root, { log: () => {}, ...(opts.dryRun ? { allowRemote: false } : {}) });
    await kb.ready();
    const client: ModelClient | null = opts.dryRun ? null : tree.modelClient.createAnthropicModelClient(config);
    await writeJson(manifestFile, manifest);

    // 4. Cases, one at a time (cache reads then compare fairly between configurations)
    const controller = new AbortController();
    let interrupted = false;
    const onSigint = (): void => {
      if (interrupted) process.exit(130);
      interrupted = true;
      console.error('\nInterrupted: aborting the current run (Ctrl-C again to quit at once)…');
      controller.abort();
    };
    process.on('SIGINT', onSigint);
    const ctx: CaseContext = { tree, kb, config, client, opts, casesDir, labelDir, signal: controller.signal };
    let spent = 0;
    const seen = { compose: 0, answer: 0 };
    let n = 0;
    outer: for (let trial = 1; trial <= opts.trials; trial++) {
      for (const c of cases) {
        if (done.has(`${trial}:${c.id}`)) continue;
        if (interrupted) break outer;
        const estimate = Math.max(PRIOR_USD[c.flow], seen[c.flow]);
        if (spent + estimate > opts.maxUsd) {
          manifest.stopped = { reason: 'max-usd', caseId: c.id, trial, spentUsd: spent, nextEstimateUsd: estimate };
          console.log(`Stopped before ${c.id} (trial ${trial}): ${usd(spent)} spent + ${usd(estimate)} estimated would pass the $${opts.maxUsd.toFixed(2)} cap.`);
          break outer;
        }
        const { entry, log } = await runCase(c, trial, ctx);
        const cost = entry.costUsd ?? estimate; // an unpriced run counts at its estimate
        spent += cost;
        seen[c.flow] = Math.max(seen[c.flow], cost);
        manifest.versions ??= log?.versions ?? null;
        manifest.runs.push(entry);
        manifest.spendUsd = (previous?.spendUsd ?? 0) + spent;
        manifest.updatedAt = new Date().toISOString();
        await writeJson(manifestFile, manifest);
        console.log(`[t${trial} ${++n}/${planned}] ${c.id} ${c.flow} ${entry.end}${entry.error ? ` (${entry.error})` : ''}, ${entry.turns} turns${entry.failedAttempts ? ` (+${entry.failedAttempts} failed)` : ''}, ${usd(entry.costUsd)} — spent ${usd(spent)} of $${opts.maxUsd.toFixed(2)}`);
      }
    }
    if (interrupted) manifest.stopped = { reason: 'interrupted', caseId: '', trial: 0, spentUsd: spent, nextEstimateUsd: 0 };
    await writeJson(manifestFile, manifest);
    process.off('SIGINT', onSigint);
    console.log(`Done: ${manifest.runs.length} run(s) recorded, ${usd(spent)} this invocation (${usd(manifest.spendUsd)} in all).`);
    const shown = relative(process.cwd(), labelDir);
    console.log(`Score it: node scripts/eval/score.ts ${shown && !shown.startsWith('..') ? shown : labelDir}`);
    return 0;
  } finally {
    await tree.close().catch(() => {});
    await rm(cacheDir, { recursive: true, force: true }).catch(() => {});
  }
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (err: unknown) => {
    if (err instanceof Refusal) {
      console.error(err.message);
      process.exit(2);
    }
    console.error(err instanceof Error ? (err.stack ?? err.message) : err);
    process.exit(1);
  },
);
