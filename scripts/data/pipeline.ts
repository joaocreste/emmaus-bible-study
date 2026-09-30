/**
 * Emmaus data pipeline — downloads openly licensed datasets (cached in .data-cache/)
 * and writes compact, lazily-loaded JSON under public/data/. Run through build-all.ts.
 *
 *   npm run data:build                         # everything
 *   npm run data:build -- --only=xrefs,tyndale # selected steps (manifest is merged)
 *   npm run data:build -- --only=scripture --versions=LSG,NCL  # selected Bible versions
 *   npm run data:build -- --offline            # use the cache only
 *   npm run data:build -- --xrefs-per-verse=10 --concurrency=4
 *
 * Steps: scripture · stepbible (original text, lexicon, concordance) · xrefs ·
 * tyndale (study notes + book intros) · commentaries (Calvin, Henry, JFB, K&D) · manifest.
 * Requires Node ≥ 22.18 (native TypeScript type-stripping + global fetch). See scripts/data/README.md.
 */
import { existsSync } from 'node:fs';
import { readdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { BibleBookFile } from '../../src/providers/local/formats.ts';
import { COMMENTARY_API_IDS } from '../../src/providers/local/cleaners.ts';
import { DATA_DIR, dirSize, mb, writeJson } from './lib/io.ts';
import { log, net, warn } from './lib/net.ts';
import type { TranslationId } from '../../src/domain/models.ts';
import { BOOKS, BUNDLED_COMMENTARY_BOOKS, HELLOAO, TRANSLATIONS } from './lib/sources.ts';
import { buildCommentaries } from './steps/commentaries.ts';
import { buildScripture } from './steps/scripture.ts';
import { buildStepBible } from './steps/stepbible.ts';
import { buildTyndale } from './steps/tyndale.ts';
import type { DatasetReport, StepContext, StepReport } from './steps/types.ts';
import { buildXrefs } from './steps/xrefs.ts';

const STEPS = ['scripture', 'stepbible', 'xrefs', 'tyndale', 'commentaries'] as const;
type StepName = (typeof STEPS)[number];

/** Output directories owned by each step (cleaned before it runs). */
const STEP_OUTPUTS: Record<StepName, string[]> = {
  scripture: ['bible'],
  stepbible: ['original', 'lexicon', 'concordance'],
  xrefs: ['xrefs'],
  tyndale: ['commentary/tyndale', 'intros'],
  commentaries: ['commentary/calvin', 'commentary/matthew-henry', 'commentary/jfb', 'commentary/keil-delitzsch'],
};

function parseArgs(argv: string[]) {
  const opts = { only: [...STEPS] as StepName[], xrefsPerVerse: 15, versions: undefined as TranslationId[] | undefined };
  for (const arg of argv) {
    const [k, v] = arg.replace(/^--/, '').split('=');
    if (k === 'only' && v) {
      const names = v.split(',').map((s) => s.trim()) as StepName[];
      for (const n of names) if (!STEPS.includes(n)) throw new Error(`unknown step "${n}" (steps: ${STEPS.join(', ')})`);
      opts.only = names;
    } else if (k === 'versions' && v) {
      const ids = v.split(',').map((x) => x.trim().toUpperCase());
      for (const id of ids) if (!TRANSLATIONS.some((t) => t.id === id)) throw new Error(`unknown version "${id}" (versions: ${TRANSLATIONS.map((t) => t.id).join(', ')})`);
      opts.versions = ids as TranslationId[];
    } else if (k === 'offline') net.offline = true;
    else if (k === 'concurrency' && v) net.concurrency = Math.max(1, Number(v));
    else if (k === 'retries' && v) net.retries = Math.max(0, Number(v));
    else if (k === 'xrefs-per-verse' && v) opts.xrefsPerVerse = Math.max(1, Number(v));
    else if (k === 'help' || k === 'h') {
      console.log('usage: node scripts/data/build-all.ts [--only=step,…] [--versions=BSB,LSG,…] [--offline] [--concurrency=8] [--xrefs-per-verse=15]');
      console.log(`steps: ${STEPS.join(', ')}`);
      process.exit(0);
    } else throw new Error(`unknown option ${arg}`);
  }
  return opts;
}

/** Last verse number of every BSB chapter, read back from the generated Scripture files. */
async function loadVerseCounts(): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  const dir = join(DATA_DIR, 'bible', 'bsb');
  if (!existsSync(dir)) return map;
  for (const f of await readdir(dir)) {
    if (!f.endsWith('.json')) continue;
    const file = JSON.parse(await readFile(join(dir, f), 'utf8')) as BibleBookFile;
    for (const ch of file.chapters) map.set(`${file.book}.${ch.c}`, ch.v[ch.v.length - 1]?.[0] ?? 0);
  }
  return map;
}

interface Manifest {
  schema: 1;
  generatedAt: string;
  generator: string;
  options: { xrefsPerVerse: number };
  datasets: (DatasetReport & { step: string })[];
  bundledCommentaryBooks: Record<string, string[]>;
  /** live fallback for non-bundled chapters; `availableBooks` = books the source covers at all */
  remoteCommentary: { urlTemplate: string; apiIds: Record<string, string>; availableBooks: Record<string, string[]> };
  sizes: Record<string, number>;
  totals: { files: number; bytes: number };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  log('build', `steps: ${opts.only.join(', ')}${net.offline ? ' (offline)' : ''}; concurrency ${net.concurrency}`);

  let verseCounts = await loadVerseCounts();
  const ctx: StepContext = {
    xrefsPerVerse: opts.xrefsPerVerse,
    lastVerse: (book, chapter) => verseCounts.get(`${book}.${chapter}`) ?? 0,
  };

  const reports: StepReport[] = [];
  const run: Record<StepName, () => Promise<StepReport>> = {
    scripture: () => buildScripture(ctx, { versions: opts.versions }),
    stepbible: () => buildStepBible(ctx),
    xrefs: () => buildXrefs(ctx),
    tyndale: () => buildTyndale(ctx),
    commentaries: () => buildCommentaries(ctx),
  };
  for (const step of STEPS) {
    if (!opts.only.includes(step)) continue;
    if (step === 'commentaries' && verseCounts.size === 0) throw new Error('commentaries need the BSB files: run the scripture step first');
    const t = Date.now();
    log(step, 'start');
    // a scripture run limited to some versions only replaces those versions' directories
    const outputs = step === 'scripture' && opts.versions ? opts.versions.map((id) => `bible/${id.toLowerCase()}`) : STEP_OUTPUTS[step];
    for (const dir of outputs) await rm(join(DATA_DIR, dir), { recursive: true, force: true });
    reports.push(await run[step]());
    log(step, `done in ${((Date.now() - t) / 1000).toFixed(1)}s`);
    if (step === 'scripture') verseCounts = await loadVerseCounts();
  }

  /* ---- manifest (merged with the previous one when only some steps ran) ---- */
  const manifestPath = join(DATA_DIR, 'manifest.json');
  let previous: Manifest | null = null;
  if (existsSync(manifestPath)) {
    try {
      previous = JSON.parse(await readFile(manifestPath, 'utf8')) as Manifest;
    } catch {
      warn('manifest', 'previous manifest unreadable; rebuilding from this run only');
    }
  }
  // steps that ran in full replace all their previous datasets; a partial scripture run replaces only its versions
  const ranFully = new Set(reports.map((r) => r.step).filter((step) => !(step === 'scripture' && opts.versions)));
  const rebuilt = new Set(reports.flatMap((r) => r.datasets.map((d) => `${r.step}:${d.id}`)));
  const scriptureOrder = (id: string) => TRANSLATIONS.findIndex((t) => t.sourceId === id);
  const datasets = [
    ...(previous?.datasets.filter((d) => !ranFully.has(d.step) && !rebuilt.has(`${d.step}:${d.id}`)) ?? []),
    ...reports.flatMap((r) => r.datasets.map((d) => ({ step: r.step, ...d }))),
  ].sort(
    (a, b) =>
      STEPS.indexOf(a.step as StepName) - STEPS.indexOf(b.step as StepName) ||
      (a.step === 'scripture' && b.step === 'scripture' ? scriptureOrder(a.id) - scriptureOrder(b.id) : 0),
  );

  const commentaryReport = reports.find((r) => r.step === 'commentaries');
  const classicBundled = (commentaryReport?.extra?.bundledCommentaryBooks as Record<string, string[]> | undefined) ?? previous?.bundledCommentaryBooks ?? {};
  const bundledCommentaryBooks: Record<string, string[]> = { tyndale: BOOKS.map((b) => b.id) };
  for (const [id, books] of Object.entries(classicBundled)) if (id !== 'tyndale') bundledCommentaryBooks[id] = books;

  const sizes: Record<string, number> = {};
  for (const dir of ['bible', 'original', 'lexicon', 'concordance', 'xrefs', 'commentary', 'intros']) sizes[dir] = (await dirSize(join(DATA_DIR, dir))).bytes;

  const manifest: Manifest = {
    schema: 1,
    generatedAt: new Date().toISOString(),
    generator: 'scripts/data/build-all.ts',
    options: { xrefsPerVerse: opts.xrefsPerVerse },
    datasets,
    bundledCommentaryBooks,
    remoteCommentary: {
      urlTemplate: `${HELLOAO}/c/{apiId}/{BOOK}/{chapter}.json`,
      apiIds: { ...COMMENTARY_API_IDS },
      availableBooks:
        (commentaryReport?.extra?.availableBooks as Record<string, string[]> | undefined) ?? previous?.remoteCommentary?.availableBooks ?? {},
    },
    sizes,
    totals: { files: 0, bytes: 0 },
  };
  await writeJson('manifest.json', manifest);
  const total = await dirSize(DATA_DIR);
  manifest.totals = total;
  await writeJson('manifest.json', manifest);

  log('build', `public/data: ${total.files} files, ${mb(total.bytes)}`);
  for (const [dir, bytes] of Object.entries(sizes)) log('build', `  ${dir.padEnd(12)} ${mb(bytes)}`);
  log('build', `classic commentaries bundled for: ${BUNDLED_COMMENTARY_BOOKS.join(' ')}`);
}

main().catch((err) => {
  console.error(`\n[build] FAILED: ${(err as Error).stack ?? err}`);
  process.exit(1);
});
