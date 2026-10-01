/**
 * Shared pieces of the eval harness (scripts/eval): the frozen case set, the price table,
 * reading RunLogs with their page sidecars, rejection kinds, and version stamps.
 *
 * Runs under Node's type stripping (`node scripts/eval/<script>.ts`): apart from the Bible
 * version table (a data module with type-only imports), nothing here imports src/ or server/
 * at runtime, so the scorer reads any checkout's logs without Vite.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ChatMessage, PassageRef, Study } from '../../src/domain/models.ts';
import { BIBLE_VERSIONS } from '../../src/domain/translations.ts';
import type { RunLog } from '../../server/inference/logs.ts';

export const EVAL_DIR = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(EVAL_DIR, '..', '..');
export const CASES_FILE = join(EVAL_DIR, 'cases.json');
/** where run.ts writes, one directory per label */
export const DEFAULT_OUT = join(REPO_ROOT, '.kb-cache', 'eval');

/* ------------------------------------------------------------------ */
/* Cases                                                               */
/* ------------------------------------------------------------------ */

export type PageKind = 'topic' | 'passage';

export interface ComposeCase {
  id: string;
  flow: 'compose';
  query: string;
  locale: string;
  translation: string;
  /** what the UI sends with this query (InferenceStudyEngine hintFor) */
  hint?: { passage?: PassageRef; topic?: string };
  /** the page kind the query should produce (selects the expected sections) */
  kind: PageKind;
  tags: string[];
}

export interface AnswerCase {
  id: string;
  flow: 'answer';
  question: string;
  locale: string;
  translation: string;
  /** a cached page (PageCache entry: { query, study, reply, … }), relative to scripts/eval */
  study: string;
  /** the chat the UI holds when the question is asked, oldest first */
  history: { role: 'user' | 'assistant'; text: string }[];
  tags: string[];
}

export type EvalCase = ComposeCase | AnswerCase;

export interface CaseSet {
  version: number;
  description: string;
  expectedSections: Record<PageKind, string[]>;
  cases: EvalCase[];
  /** absolute path of the file read */
  file: string;
  /** sha256 of the file's bytes (stamped into each manifest) */
  sha256: string;
}

export function loadCases(file: string = CASES_FILE): CaseSet {
  const raw = readFileSync(file);
  const set = JSON.parse(raw.toString('utf8')) as Omit<CaseSet, 'file' | 'sha256'>;
  const ids = new Set<string>();
  for (const c of set.cases) {
    if (ids.has(c.id)) throw new Error(`${file}: duplicate case id "${c.id}"`);
    ids.add(c.id);
  }
  return { ...set, file: resolve(file), sha256: sha256(raw) };
}

export function caseText(c: EvalCase): string {
  return c.flow === 'compose' ? c.query : c.question;
}

export function expectsDecline(c: EvalCase | undefined): boolean {
  return Boolean(c?.tags.includes('expect-decline'));
}

/* ------------------------------------------------------------------ */
/* Prices                                                              */
/* ------------------------------------------------------------------ */

/** USD per million tokens; cache writes at the 5-minute TTL (1.25× input), which is all the loop uses. */
export interface Rates {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

/** Claude API first-party rates by model id. A model missing here cannot be run: its spend could not be capped. */
export const PRICES: Readonly<Record<string, Rates>> = {
  'claude-opus-5': { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
  'claude-opus-5-5': { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 },
  'claude-sonnet-5': { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  'claude-haiku-4-5': { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 1.25 },
};

export interface Usage {
  input: number;
  output: number;
  cacheRead: number;
  cacheCreation: number;
}

/** Cost of a run's summed usage at its model's rates (null for a model with no rates). */
export function costUsd(model: string, usage: Usage | null | undefined): number | null {
  const r = PRICES[model];
  if (!r || !usage) return null;
  return (usage.input * r.input + usage.output * r.output + usage.cacheRead * r.cacheRead + usage.cacheCreation * r.cacheWrite) / 1e6;
}

/* ------------------------------------------------------------------ */
/* Run logs                                                            */
/* ------------------------------------------------------------------ */

/**
 * A run's model turns and its failed attempts (an API error, a dropped stream, unparseable tool
 * input: `failed: true`, re-issued or ending the run). A failed attempt is billed — its usage is
 * in the log's `usage`, so in the run's cost — but is not a turn.
 */
export function turnCounts(log: Pick<RunLog, 'turns'>): { turns: number; failedAttempts: number } {
  const failedAttempts = log.turns.filter((t) => t.failed).length;
  return { turns: log.turns.length - failedAttempts, failedAttempts };
}

/** What run.ts adds to each RunLog it writes (logs from the app's .kb-cache/logs have none). */
export interface EvalMeta {
  caseId: string;
  label: string;
  trial: number;
  locale: string;
  translation: string;
  /** the checkout whose server code ran */
  root: string;
  dryRun: boolean;
}

export type EvalRunLog = RunLog & { eval?: EvalMeta };

/** The page and reply a run emitted (`<case>.page.json` next to `<case>.log.json`). */
export interface PageSidecar {
  study: Study | null;
  reply: ChatMessage | null;
  error: { code: string; message: string } | null;
}

export interface LoadedRun {
  file: string;
  log: EvalRunLog;
  page: PageSidecar | null;
}

/** Every RunLog under `dir` (recursively), oldest first; manifests and page sidecars are skipped. */
export function readRuns(dir: string): LoadedRun[] {
  const out: LoadedRun[] = [];
  const walk = (d: string): void => {
    for (const name of readdirSync(d).sort()) {
      const path = join(d, name);
      if (lstatSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      if (!name.endsWith('.json') || name === 'manifest.json' || name.endsWith('.page.json')) continue;
      let log: EvalRunLog;
      try {
        log = JSON.parse(readFileSync(path, 'utf8')) as EvalRunLog;
      } catch {
        continue;
      }
      if (!log || (log.flow !== 'compose' && log.flow !== 'answer') || !Array.isArray(log.decisions)) continue;
      const sidecar = path.replace(/\.log\.json$/, '.page.json');
      const page = sidecar !== path && existsSync(sidecar) ? (JSON.parse(readFileSync(sidecar, 'utf8')) as PageSidecar) : null;
      out.push({ file: path, log, page });
    }
  };
  walk(dir);
  return out.sort((a, b) => (a.log.startedAt ?? '').localeCompare(b.log.startedAt ?? ''));
}

/** SourceRegistry ids of the Bible versions (Scripture is not counted among a page's sources). */
export const SCRIPTURE_SOURCE_IDS: ReadonlySet<string> = new Set(BIBLE_VERSIONS.map((v) => v.sourceId));

/** The language of a Bible version (older answer logs carry the translation but not the locale). */
export function localeOfTranslation(id: string | undefined): string {
  return BIBLE_VERSIONS.find((v) => v.id === id)?.language ?? 'en';
}

export function requestOf(log: RunLog): { query?: string; question?: string; translation?: string; locale?: string } {
  return (log.request ?? {}) as { query?: string; question?: string; translation?: string; locale?: string };
}

const norm = (s: string | undefined) => (s ?? '').normalize('NFC').trim().toLowerCase();

/** The case a log belongs to: its eval stamp, else the case with the same flow, words and translation. */
export function matchCase(log: EvalRunLog, cases: readonly EvalCase[]): EvalCase | undefined {
  if (log.eval?.caseId) return cases.find((c) => c.id === log.eval!.caseId);
  const r = requestOf(log);
  const text = norm(log.flow === 'compose' ? r.query : r.question);
  return cases.find((c) => c.flow === log.flow && norm(caseText(c)) === text && (!r.translation || c.translation === r.translation));
}

/* ------------------------------------------------------------------ */
/* Rejection kinds                                                     */
/* ------------------------------------------------------------------ */

export const REJECTION_KINDS = ['book-name', 'name/tradition', 'date', 'quote', 'lexical/unread', 'perspective/voice', 'reference', 'claim-word', 'schema', 'other'] as const;
export type RejectionKind = (typeof REJECTION_KINDS)[number];

/** Content recalled from memory rather than read (E7 caps these at 1.5× the baseline). */
export const MEMORY_RECALL_KINDS: ReadonlySet<RejectionKind> = new Set<RejectionKind>(['name/tradition', 'date', 'quote', 'lexical/unread', 'claim-word']);

/**
 * The kind of a validator rejection, from its reason text (validate.ts wording as of
 * 2026-09-30). 'book-name' is the localized book-name false positive ("Mateus 19:9 is not a
 * Bible reference"), a validator bug rather than a model error.
 */
export function rejectionKind(reason: string): RejectionKind {
  if (/(is|are) not a Bible reference/.test(reason)) return 'book-name';
  if (/names “|names [A-Z]|speaks of|represents th/.test(reason)) return 'name/tradition';
  if (/gives the date/.test(reason)) return 'date';
  if (/quotation marks|exact span/.test(reason)) return 'quote';
  if (/does not occur there|describes other uses|renderings|not read|have not read/.test(reason)) return 'lexical/unread';
  if (/publisher|joint work|positions that pass|tradition’s own|no recorded author|cannot be a voice/.test(reason)) return 'perspective/voice';
  if (/mentions .* which none of the cited|must lie inside|reference/.test(reason)) return 'reference';
  if (/generalises|debate|era/.test(reason)) return 'claim-word';
  if (/malformed/.test(reason)) return 'schema';
  return 'other';
}

/* ------------------------------------------------------------------ */
/* Version stamps (E8)                                                 */
/* ------------------------------------------------------------------ */

export interface TreeStamp {
  root: string;
  gitSha: string | null;
  branch: string | null;
  /** uncommitted changes (tracked or untracked) */
  dirty: boolean;
  /** sha256 over `git diff HEAD` and the untracked files' paths and bytes (symlinks ignored); null when clean */
  diffHash: string | null;
  untrackedFiles: number;
}

function git(root: string, args: string[]): Buffer | null {
  try {
    return execFileSync('git', ['-C', root, ...args], { maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

/**
 * Git SHA plus a hash of the working-tree diff: RunLog's versions.generator is memoised per
 * process and goes stale inside a dev session, so an eval stamps the tree it ran itself.
 */
export function stampTree(root: string): TreeStamp {
  const sha = git(root, ['rev-parse', 'HEAD'])?.toString('utf8').trim() || null;
  const branch = git(root, ['rev-parse', '--abbrev-ref', 'HEAD'])?.toString('utf8').trim() || null;
  const diff = git(root, ['diff', 'HEAD', '--binary']) ?? Buffer.alloc(0);
  // untracked files, minus symlinks: the shared-data links of a baseline worktree are not code
  const untracked = (git(root, ['ls-files', '--others', '--exclude-standard', '-z'])?.toString('utf8') ?? '')
    .split('\0')
    .filter((rel) => rel && !isSymlink(join(root, rel)))
    .sort();
  const h = createHash('sha256').update(diff);
  for (const rel of untracked) {
    h.update(`\0${rel}\0`);
    try {
      h.update(readFileSync(join(root, rel)));
    } catch {
      /* removed while hashing */
    }
  }
  const dirty = diff.length > 0 || untracked.length > 0;
  return { root, gitSha: sha, branch, dirty, diffHash: dirty ? h.digest('hex').slice(0, 16) : null, untrackedFiles: untracked.length };
}

function isSymlink(path: string): boolean {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}

export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}
