/**
 * FREE scorer (E2 + E7): reads RunLogs (and the page sidecars run.ts writes) and reports, per
 * case and per flow, completion, sections against the expected set, accepted items, first-pass
 * rejections by kind, re-sent sections, warnings, research calls, ledger size, cited evidence,
 * distinct and tradition-tagged sources cited, verified quotations, the decline case, turns,
 * tokens and cost per completed page (failed runs' spend included). Given two directories
 * (baseline first, candidate second) it adds paired per-case deltas and the E7 keep/revert rule.
 *
 *   node scripts/eval/score.ts <label|dir> [<label|dir>] [options]
 *   node scripts/eval/score.ts .kb-cache/logs --since 2026-09-30T10:00:00Z     (the logged baseline)
 *
 *   --since / --until <ISO>   only runs started in this window
 *   --replay <file>           zz-replay report of the candidate's logs (E3: items kept under HEAD's validator)
 *   --cases <file>            case set (default scripts/eval/cases.json)
 *   --json <file>             also write every number as JSON
 *
 * A label is looked up under .kb-cache/eval/. Cached runs (page-cache hits, $0) are skipped.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import {
  costUsd,
  DEFAULT_OUT,
  expectsDecline,
  loadCases,
  localeOfTranslation,
  matchCase,
  MEMORY_RECALL_KINDS,
  readRuns,
  rejectionKind,
  requestOf,
  SCRIPTURE_SOURCE_IDS,
  CASES_FILE,
  turnCounts,
  type CaseSet,
  type LoadedRun,
  type PageKind,
  type RejectionKind,
  type Usage,
} from './lib.ts';

/* ------------------------------------------------------------------ */
/* Per run                                                             */
/* ------------------------------------------------------------------ */

type Counts = Partial<Record<RejectionKind, number>>;

export interface RunMetrics {
  file: string;
  caseId: string;
  trial: number;
  flow: 'compose' | 'answer';
  text: string;
  locale: string;
  startedAt: string;
  end: string;
  error: string | null;
  /** compose: finish_page accepted, no error or interruption; answer: a reply accepted */
  completed: boolean;
  kind: PageKind | null;
  /** page sections with accepted items (compose) */
  sections: string[];
  missingSections: string[];
  /** decisions on calls withdrawn afterwards (their response was declined: a refusal or a fallback), left out of every count below */
  withdrawn: number;
  accepted: number;
  rejected: number;
  /** rejections in the first decision on each tool/section (before any repair) */
  firstPassRejected: number;
  rejectedByKind: Counts;
  firstPassByKind: Counts;
  /** rejections of content recalled from memory (names, dates, quotes, unread verses, claim words) */
  memoryRecall: number;
  /** add_section calls beyond the first per section (repairs and appends) */
  repairs: number;
  finishRetries: number;
  warnings: number;
  researchCalls: number;
  ledger: number;
  /** evidence items cited, from the Synthesis step (null when not reported) */
  cited: number | null;
  /** distinct sources cited, Scripture versions excluded */
  sources: number;
  /** distinct sources cited that carry a tradition (confessions, tradition reference works) */
  traditionSources: number;
  /** distinct traditions among them */
  traditions: number;
  /** 'page': the final study's sourceIds; 'log': evidence ids named in the composition calls (rejected items included) */
  citeBasis: 'page' | 'log';
  quotations: number | null;
  verifiedQuotations: number | null;
  /** final-page problems: an unverified quotation, a quotation without an excerpt, a URL in prose */
  lint: string[] | null;
  /** the expect-decline case: declined, with no quotation marks */
  decline: { ok: boolean; reason: string } | null;
  turns: number;
  /** attempts that failed and were re-issued or ended the run: billed (in usage and cost), not turns */
  failedAttempts: number;
  usage: Usage;
  costUsd: number | null;
}

const COMPOSE_TOOLS = new Set(['begin_page', 'add_section', 'finish_page', 'reply']);
const NON_SECTIONS = new Set(['overview', 'scripture', 'sources']);
const QUOTE_MARKS = /[“”„"«»]/;

interface ToolCall {
  turn: number;
  id: string;
  name: string;
  input: unknown;
  isError: boolean;
  result?: string;
}

/** A call whose response was declined after it ran (a refusal, or a fallback model took over): run.ts took back what it did and marked its logged result. */
const isWithdrawn = (call: ToolCall | null): boolean => Boolean(call?.result?.startsWith('[withdrawn:'));

/** Decisions paired with the tool call each one judged (same turn and tool, in order); `withdrawn`: how many judged a call taken back since, left out of `pairs`. */
function decidedCalls(run: LoadedRun): { pairs: { call: ToolCall | null; d: LoadedRun['log']['decisions'][number] }[]; withdrawn: number } {
  const byId = new Map<string, ToolCall>();
  const queues = new Map<string, ToolCall[]>();
  for (const c of run.log.toolCalls as ToolCall[]) {
    if (!COMPOSE_TOOLS.has(c.name)) continue;
    byId.set(c.id, c);
    const k = `${c.turn}|${c.name}`;
    queues.set(k, [...(queues.get(k) ?? []), c]);
  }
  // decisions carry their call's id since it was recorded; older logs pair by position within turn and tool
  const all = run.log.decisions.map((d) => ({ d, call: (d.callId ? byId.get(d.callId) : queues.get(`${d.turn}|${d.tool}`)?.shift()) ?? null }));
  const pairs = all.filter(({ call }) => !isWithdrawn(call));
  return { pairs, withdrawn: all.length - pairs.length };
}

function add(counts: Counts, kind: RejectionKind, n = 1): void {
  counts[kind] = (counts[kind] ?? 0) + n;
}

function citedFromSteps(run: LoadedRun): number | null {
  for (const s of run.log.steps ?? []) {
    if (s.stage !== 'Synthesis') continue;
    const m = /citing (\d+) of \d+/.exec(s.detail) ?? /cites the (\d+) item/.exec(s.detail);
    if (m) return Number(m[1]);
    if (/^Declined/.test(s.detail)) return 0;
  }
  return null;
}

/** Quotations and prose URLs anywhere in the final study. */
function lintStudy(study: unknown): { quotations: number; verified: number; lint: string[] } {
  let quotations = 0;
  let verified = 0;
  const lint: string[] = [];
  const visit = (v: unknown, key: string, path: string): void => {
    if (typeof v === 'string') {
      if (key !== 'url' && /https?:\/\//.test(v)) lint.push(`URL in ${path}`);
      return;
    }
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) return v.forEach((x, i) => visit(x, key, `${path}[${i}]`));
    const o = v as Record<string, unknown>;
    const p = o.provenance as { kind?: string; verification?: string; citations?: { excerpt?: string }[] } | undefined;
    if (p?.kind === 'quotation') {
      quotations++;
      const hasExcerpt = (p.citations ?? []).some((c) => Boolean(c.excerpt));
      if (p.verification === 'verified' && hasExcerpt) verified++;
      if (p.verification !== 'verified') lint.push(`unverified quotation at ${path}`);
      if (!hasExcerpt) lint.push(`quotation without an excerpt at ${path}`);
    }
    for (const [k, x] of Object.entries(o)) if (k !== 'generation') visit(x, k, path ? `${path}.${k}` : k);
  };
  visit(study, '', '');
  return { quotations, verified, lint };
}

export function scoreRun(run: LoadedRun, set: CaseSet, trial: number): RunMetrics {
  const { log, page } = run;
  const c = matchCase(log, set.cases);
  const r = requestOf(log);
  const text = (log.flow === 'compose' ? r.query : r.question) ?? '';
  const { pairs, withdrawn } = decidedCalls(run);

  // decisions: accepted, rejected (all and first pass, by kind), re-sent sections
  const rejectedByKind: Counts = {};
  const firstPassByKind: Counts = {};
  const firstSeen = new Set<string>();
  const sectionCalls = new Map<string, number>();
  let accepted = 0;
  let rejected = 0;
  let firstPassRejected = 0;
  let warnings = 0;
  let finishes = 0;
  const acceptedSections = new Set<string>();
  for (const { d } of pairs) {
    accepted += d.accepted;
    rejected += d.rejected.length;
    warnings += d.warnings.length;
    const key = `${d.tool}|${d.section ?? ''}`;
    const first = !firstSeen.has(key);
    firstSeen.add(key);
    for (const x of d.rejected) {
      const kind = rejectionKind(x.reason);
      add(rejectedByKind, kind);
      if (first) add(firstPassByKind, kind);
    }
    if (first) firstPassRejected += d.rejected.length;
    if (d.tool === 'add_section' && d.section) {
      sectionCalls.set(d.section, (sectionCalls.get(d.section) ?? 0) + 1);
      if (d.accepted > 0) acceptedSections.add(d.section);
    }
    if (d.tool === 'finish_page') finishes++;
  }
  const repairs = [...sectionCalls.values()].reduce((n, calls) => n + Math.max(0, calls - 1), 0);
  let memoryRecall = 0;
  for (const [k, n] of Object.entries(rejectedByKind)) if (MEMORY_RECALL_KINDS.has(k as RejectionKind)) memoryRecall += n ?? 0;

  // completion
  const accepts = (tool: string) => pairs.some(({ d }) => d.tool === tool && d.accepted > 0);
  const clean = log.outcome.end === 'done' && !log.outcome.error && !log.outcome.interruption;
  const completed = clean && (log.flow === 'compose' ? accepts('finish_page') : accepts('reply'));

  // sections against the expected set: the case's page kind, else the kind the model began
  const begun = pairs.filter(({ d, call }) => d.tool === 'begin_page' && d.accepted > 0 && call).at(-1);
  const begunKind = (begun?.call?.input as { kind?: PageKind } | undefined)?.kind ?? null;
  const kind: PageKind | null = log.flow !== 'compose' ? null : c?.flow === 'compose' ? c.kind : begunKind;
  const layout = page?.study?.layout?.sections.map((s) => s.id).filter((id) => !NON_SECTIONS.has(id));
  const sections = log.flow === 'compose' ? (layout ?? [...acceptedSections]) : [];
  const missingSections = kind ? set.expectedSections[kind].filter((s) => !sections.includes(s)) : [];

  // sources and traditions cited
  const ledger = log.ledger ?? [];
  const byId = new Map(ledger.map((e) => [e.id, e]));
  const scripture = new Set<string>(SCRIPTURE_SOURCE_IDS);
  for (const e of ledger) if (e.kind === 'scripture') scripture.add(e.sourceId);
  const traditionsOf = new Map<string, Set<string>>();
  for (const e of ledger) if (e.tradition) traditionsOf.set(e.sourceId, (traditionsOf.get(e.sourceId) ?? new Set()).add(e.tradition));
  const citeBasis: 'page' | 'log' = log.flow === 'compose' && page?.study ? 'page' : 'log';
  let citedSources: Set<string>;
  const citedTraditions = new Set<string>();
  if (citeBasis === 'page') {
    citedSources = new Set(page!.study!.sourceIds.filter((s) => !scripture.has(s)));
    for (const s of citedSources) for (const t of traditionsOf.get(s) ?? []) citedTraditions.add(t);
  } else {
    citedSources = new Set();
    for (const { call } of pairs) {
      for (const id of JSON.stringify(call?.input ?? '').match(/\bE\d+\b/g) ?? []) {
        const e = byId.get(id);
        if (!e || e.kind === 'scripture') continue;
        citedSources.add(e.sourceId);
        if (e.tradition) citedTraditions.add(e.tradition);
      }
    }
  }
  const traditionSources = [...citedSources].filter((s) => traditionsOf.has(s)).length;

  // the final page
  const studyLint = log.flow === 'compose' && page?.study ? lintStudy(page.study) : null;

  // the decline case
  let decline: RunMetrics['decline'] = null;
  if (expectsDecline(c)) {
    const last = pairs.filter(({ d, call }) => d.tool === 'reply' && d.accepted > 0 && call).at(-1)?.call?.input as { declined?: boolean; text?: string } | undefined;
    decline = !completed
      ? { ok: false, reason: 'no accepted reply' }
      : last?.declined !== true
        ? { ok: false, reason: 'the reply did not decline' }
        : QUOTE_MARKS.test(last.text ?? '')
          ? { ok: false, reason: 'the declined reply uses quotation marks' }
          : { ok: true, reason: 'declined without quotation marks' };
  }

  const usage: Usage = log.usage ?? { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 };
  return {
    file: run.file,
    caseId: c?.id ?? `${log.flow}:${text.trim().toLowerCase()}`,
    trial,
    flow: log.flow,
    text,
    locale: log.eval?.locale ?? r.locale ?? localeOfTranslation(r.translation),
    startedAt: log.startedAt,
    end: log.outcome.end,
    error: log.outcome.error?.code ?? null,
    completed,
    kind,
    sections,
    missingSections,
    withdrawn,
    accepted,
    rejected,
    firstPassRejected,
    rejectedByKind,
    firstPassByKind,
    memoryRecall,
    repairs,
    finishRetries: Math.max(0, finishes - 1),
    warnings,
    researchCalls: log.researchCalls,
    ledger: ledger.length,
    cited: citedFromSteps(run),
    sources: citedSources.size,
    traditionSources,
    traditions: citedTraditions.size,
    citeBasis,
    quotations: studyLint?.quotations ?? null,
    verifiedQuotations: studyLint?.verified ?? null,
    lint: studyLint?.lint ?? null,
    decline,
    ...turnCounts(log),
    usage,
    costUsd: costUsd(log.model, log.usage),
  };
}

/* ------------------------------------------------------------------ */
/* Per directory, per case, per flow                                   */
/* ------------------------------------------------------------------ */

export interface Scored {
  dir: string;
  runs: RunMetrics[];
  /** page-cache hits (no model work, $0) left out */
  skippedCached: number;
}

export interface Window {
  since?: string;
  until?: string;
}

export function scoreDir(dir: string, set: CaseSet, window: Window = {}): Scored {
  const since = window.since ? Date.parse(window.since) : -Infinity;
  const until = window.until ? Date.parse(window.until) : Infinity;
  const trials = new Map<string, number>();
  const runs: RunMetrics[] = [];
  let skippedCached = 0;
  for (const run of readRuns(dir)) {
    const at = Date.parse(run.log.startedAt);
    if (!(at >= since && at <= until)) continue;
    if (run.log.cached) {
      skippedCached++;
      continue;
    }
    const id = matchCase(run.log, set.cases)?.id ?? `${run.log.flow}:${(caseTextOf(run) ?? '').trim().toLowerCase()}`;
    const trial = run.log.eval?.trial ?? (trials.get(id) ?? 0) + 1;
    trials.set(id, trial);
    runs.push(scoreRun(run, set, trial));
  }
  return { dir, runs, skippedCached };
}

function caseTextOf(run: LoadedRun): string | undefined {
  const r = requestOf(run.log);
  return run.log.flow === 'compose' ? r.query : r.question;
}

type Metric = (r: RunMetrics) => number | null;

/** Means are taken over completed runs (what a reader would get); cost also per completed page with every run's spend. */
export const METRICS: Readonly<Record<string, Metric>> = {
  turns: (r) => r.turns,
  failedAttempts: (r) => r.failedAttempts,
  researchCalls: (r) => r.researchCalls,
  ledger: (r) => r.ledger,
  cited: (r) => r.cited,
  sources: (r) => r.sources,
  traditionSources: (r) => r.traditionSources,
  traditions: (r) => r.traditions,
  accepted: (r) => r.accepted,
  rejected: (r) => r.rejected,
  firstPassRejected: (r) => r.firstPassRejected,
  memoryRecall: (r) => r.memoryRecall,
  repairs: (r) => r.repairs,
  finishRetries: (r) => r.finishRetries,
  warnings: (r) => r.warnings,
  verifiedQuotations: (r) => r.verifiedQuotations,
  output: (r) => r.usage.output,
  cacheRead: (r) => r.usage.cacheRead,
  cacheCreation: (r) => r.usage.cacheCreation,
  costUsd: (r) => r.costUsd,
};

export interface Summary {
  runs: number;
  completed: number;
  /** completed compose runs whose page has every expected section */
  sectionsComplete: number;
  mean: Record<string, number | null>;
  sd: Record<string, number | null>;
  rejectedByKind: Counts;
  firstPassByKind: Counts;
  decline: { ok: number; of: number };
  /** over every run: failed attempts (billed, not turns) and decisions on withdrawn calls (not counted) */
  failedAttempts: number;
  withdrawn: number;
  /** spend of every run (failed ones too) */
  totalCostUsd: number;
  /** totalCostUsd / completed runs */
  costPerCompletedUsd: number | null;
}

function stats(values: number[]): { mean: number | null; sd: number | null } {
  if (!values.length) return { mean: null, sd: null };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sd = values.length > 1 ? Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / (values.length - 1)) : null;
  return { mean, sd };
}

export function summarize(runs: RunMetrics[]): Summary {
  const done = runs.filter((r) => r.completed);
  const mean: Record<string, number | null> = {};
  const sd: Record<string, number | null> = {};
  for (const [k, f] of Object.entries(METRICS)) {
    const s = stats(done.map(f).filter((v): v is number => v != null));
    mean[k] = s.mean;
    sd[k] = s.sd;
  }
  const rejectedByKind: Counts = {};
  const firstPassByKind: Counts = {};
  for (const r of done) {
    for (const [k, n] of Object.entries(r.rejectedByKind)) add(rejectedByKind, k as RejectionKind, n);
    for (const [k, n] of Object.entries(r.firstPassByKind)) add(firstPassByKind, k as RejectionKind, n);
  }
  const totalCostUsd = runs.reduce((a, r) => a + (r.costUsd ?? 0), 0);
  const declines = runs.filter((r) => r.decline);
  return {
    runs: runs.length,
    completed: done.length,
    sectionsComplete: done.filter((r) => r.flow === 'compose' && r.kind && r.missingSections.length === 0).length,
    mean,
    sd,
    rejectedByKind,
    firstPassByKind,
    decline: { ok: declines.filter((r) => r.decline!.ok).length, of: declines.length },
    failedAttempts: runs.reduce((a, r) => a + r.failedAttempts, 0),
    withdrawn: runs.reduce((a, r) => a + r.withdrawn, 0),
    totalCostUsd,
    costPerCompletedUsd: done.length ? totalCostUsd / done.length : null,
  };
}

export function byCase(runs: RunMetrics[]): Map<string, RunMetrics[]> {
  const out = new Map<string, RunMetrics[]>();
  for (const r of runs) out.set(r.caseId, [...(out.get(r.caseId) ?? []), r]);
  return out;
}

export function byFlow(runs: RunMetrics[]): Record<'compose' | 'answer', Summary> {
  return { compose: summarize(runs.filter((r) => r.flow === 'compose')), answer: summarize(runs.filter((r) => r.flow === 'answer')) };
}

/* ------------------------------------------------------------------ */
/* Baseline vs candidate: paired deltas and the E7 keep/revert rule    */
/* ------------------------------------------------------------------ */

/** E7 thresholds (understand.txt, from one baseline run per case: recalibrate after a fresh baseline). */
export const E7 = {
  /** candidate accepted items ≥ this share of the baseline's, per compose case */
  acceptedShare: 0.9,
  /** memory-recall rejections per compose page ≤ this multiple of the baseline's (2.6 per page on 2026-09-30) */
  memoryRecallRatio: 1.5,
  /** tradition-tagged sources cited ≥ the baseline's minus this, per compose case */
  traditionSlack: 1,
  /** distinct sources cited ≥ this share of the baseline's, per compose case */
  sourcesShare: 0.8,
  /** E3: share of accepted items the candidate's logs keep when replayed under HEAD's validator */
  replayKept: 0.95,
} as const;

export interface Check {
  name: string;
  /** null: not measurable from what was given */
  pass: boolean | null;
  detail: string;
}

export interface PairRow {
  caseId: string;
  flow: 'compose' | 'answer';
  a: Summary | null;
  b: Summary | null;
}

export interface Comparison {
  rows: PairRow[];
  checks: Check[];
  verdict: 'KEEP' | 'REVERT' | 'INCOMPLETE';
  cost: Record<'compose' | 'answer', { a: number | null; b: number | null }>;
}

/** Share of accepted items kept in a zz-replay report (rows carry oldAccepted / newAccepted per decision). */
export function replayKept(file: string): { kept: number | null; oldAccepted: number; newAccepted: number } {
  const report = JSON.parse(readFileSync(file, 'utf8')) as { rows: { oldAccepted?: number; newAccepted: number }[] }[];
  let oldAccepted = 0;
  let newAccepted = 0;
  for (const f of report) {
    for (const row of f.rows) {
      if (typeof row.oldAccepted !== 'number') continue;
      oldAccepted += row.oldAccepted;
      newAccepted += Math.min(row.newAccepted, row.oldAccepted);
    }
  }
  return { kept: oldAccepted ? newAccepted / oldAccepted : null, oldAccepted, newAccepted };
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function compare(a: Scored, b: Scored, set: CaseSet, replayFile?: string): Comparison {
  const ca = byCase(a.runs);
  const cb = byCase(b.runs);
  const order = [...set.cases.map((c) => c.id), ...[...ca.keys(), ...cb.keys()].sort()];
  const ids = [...new Set(order)].filter((id) => ca.has(id) || cb.has(id));
  const rows: PairRow[] = ids.map((caseId) => {
    const ra = ca.get(caseId);
    const rb = cb.get(caseId);
    return { caseId, flow: (ra ?? rb)![0].flow, a: ra ? summarize(ra) : null, b: rb ? summarize(rb) : null };
  });
  const paired = rows.filter((r) => r.flow === 'compose' && r.a?.completed && r.b?.completed);
  const checks: Check[] = [];

  const failed = b.runs.filter((r) => !r.completed);
  checks.push({
    name: 'completion 100%',
    pass: b.runs.length > 0 && failed.length === 0,
    detail: failed.length
      ? failed.map((r) => `${r.caseId} t${r.trial} ${r.end}${r.error ? `/${r.error}` : ''}${ca.get(r.caseId)?.some((x) => !x.completed) ? ' (baseline failed too)' : ''}`).join('; ')
      : `${b.runs.length} of ${b.runs.length} runs completed`,
  });

  const short = b.runs.filter((r) => r.completed && r.flow === 'compose' && r.missingSections.length);
  checks.push({ name: 'expected sections', pass: short.length === 0, detail: short.length ? short.map((r) => `${r.caseId} t${r.trial} lacks ${r.missingSections.join(', ')}`).join('; ') : 'every completed page has its expected sections' });

  const thin = paired.filter((r) => (r.b!.mean.accepted ?? 0) < E7.acceptedShare * (r.a!.mean.accepted ?? 0));
  checks.push({
    name: `accepted items ≥ ${pct(E7.acceptedShare)} of baseline per case`,
    pass: paired.length ? thin.length === 0 : null,
    detail: paired.length ? (thin.length ? thin.map((r) => `${r.caseId} ${r.b!.mean.accepted!.toFixed(1)} vs ${r.a!.mean.accepted!.toFixed(1)}`).join('; ') : `${paired.length} paired compose cases`) : 'no paired completed compose cases',
  });

  const fa = byFlow(a.runs).compose;
  const fb = byFlow(b.runs).compose;
  const ma = fa.mean.memoryRecall;
  const mb = fb.mean.memoryRecall;
  const limit = ma == null ? null : Math.max(E7.memoryRecallRatio * ma, 0.5);
  checks.push({
    name: `memory-recall rejections ≤ ${E7.memoryRecallRatio}× baseline`,
    pass: limit == null || mb == null ? null : mb <= limit,
    detail: ma == null || mb == null ? 'no completed compose runs on one side' : `${mb.toFixed(2)} vs ${ma.toFixed(2)} per page (limit ${limit!.toFixed(2)})`,
  });

  const fewTraditions = paired.filter((r) => (r.b!.mean.traditionSources ?? 0) < (r.a!.mean.traditionSources ?? 0) - E7.traditionSlack);
  checks.push({
    name: `tradition-tagged sources ≥ baseline − ${E7.traditionSlack} per case`,
    pass: paired.length ? fewTraditions.length === 0 : null,
    detail: fewTraditions.length ? fewTraditions.map((r) => `${r.caseId} ${r.b!.mean.traditionSources!.toFixed(1)} vs ${r.a!.mean.traditionSources!.toFixed(1)}`).join('; ') : `${paired.length} paired compose cases`,
  });

  const fewSources = paired.filter((r) => (r.b!.mean.sources ?? 0) < E7.sourcesShare * (r.a!.mean.sources ?? 0));
  checks.push({
    name: `distinct sources ≥ ${pct(E7.sourcesShare)} of baseline per case`,
    pass: paired.length ? fewSources.length === 0 : null,
    detail: fewSources.length ? fewSources.map((r) => `${r.caseId} ${r.b!.mean.sources!.toFixed(1)} vs ${r.a!.mean.sources!.toFixed(1)}`).join('; ') : `${paired.length} paired compose cases`,
  });

  const replay = replayFile ? replayKept(replayFile) : null;
  checks.push({
    name: `E3 replay keeps ≥ ${pct(E7.replayKept)} of items`,
    pass: replay?.kept == null ? null : replay.kept >= E7.replayKept,
    detail: replay ? `${replay.newAccepted} of ${replay.oldAccepted} items kept${replay.kept == null ? '' : ` (${(replay.kept * 100).toFixed(1)}%)`}` : 'not given: run zz-replay on the candidate logs and pass --replay <report>',
  });

  const declines = b.runs.filter((r) => r.decline);
  checks.push({
    name: 'copyrighted-author case declines correctly',
    pass: declines.length ? declines.every((r) => r.decline!.ok) : null,
    detail: declines.length ? declines.map((r) => `${r.caseId} t${r.trial}: ${r.decline!.reason}`).join('; ') : 'no expect-decline case in the candidate runs',
  });

  checks.push({ name: 'E6 blind review', pass: null, detail: 'pending: no veto, and faithfulness/balance preference no worse than 40/60 (compare-html.ts)' });

  const automatic = checks.slice(0, -1);
  const verdict = automatic.some((c) => c.pass === false) ? 'REVERT' : automatic.some((c) => c.pass == null) ? 'INCOMPLETE' : 'KEEP';
  const ab = { a: byFlow(a.runs), b: byFlow(b.runs) };
  return {
    rows,
    checks,
    verdict,
    cost: {
      compose: { a: ab.a.compose.costPerCompletedUsd, b: ab.b.compose.costPerCompletedUsd },
      answer: { a: ab.a.answer.costPerCompletedUsd, b: ab.b.answer.costPerCompletedUsd },
    },
  };
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

function table(headers: string[], rows: string[][]): string {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)));
  const line = (cells: string[]) => cells.map((c, i) => (i === 0 ? c.padEnd(widths[i]) : c.padStart(widths[i]))).join('  ').trimEnd();
  return [line(headers), line(widths.map((w) => '-'.repeat(w))), ...rows.map(line)].join('\n');
}

const f1 = (x: number | null | undefined) => (x == null ? '–' : x.toFixed(1));
const money = (x: number | null | undefined) => (x == null ? '–' : `$${x.toFixed(3)}`);
const withSd = (s: Summary, k: string, digits = 1) => (s.mean[k] == null ? '–' : `${s.mean[k]!.toFixed(digits)}${s.sd[k] == null ? '' : ` ±${s.sd[k]!.toFixed(digits)}`}`);
const kinds = (c: Counts) =>
  Object.entries(c)
    .sort((x, y) => (y[1] ?? 0) - (x[1] ?? 0))
    .map(([k, n]) => `${k} ${n}`)
    .join(', ');

export function reportScored(s: Scored): string {
  const out: string[] = [`${s.dir} — ${s.runs.length} run(s)${s.skippedCached ? `, ${s.skippedCached} cache hit(s) skipped` : ''}`];
  const cases = byCase(s.runs);
  const composeRows: string[][] = [];
  const answerRows: string[][] = [];
  for (const [id, runs] of cases) {
    const m = summarize(runs);
    const done = `${m.completed}/${m.runs}`;
    if (runs[0].flow === 'compose') {
      const missing = [...new Set(runs.filter((r) => r.completed).flatMap((r) => r.missingSections))];
      composeRows.push([
        id,
        done,
        f1(m.mean.turns),
        f1(m.mean.researchCalls),
        f1(m.mean.ledger),
        f1(m.mean.cited),
        f1(m.mean.sources),
        f1(m.mean.traditionSources),
        missing.length ? `-${missing.join(',-')}` : m.completed ? 'all' : '–',
        f1(m.mean.accepted),
        `${f1(m.mean.rejected)}/${f1(m.mean.firstPassRejected)}`,
        f1(m.mean.memoryRecall),
        f1(m.mean.repairs),
        f1(m.mean.warnings),
        f1(m.mean.verifiedQuotations),
        money(m.totalCostUsd / m.runs),
      ]);
    } else {
      const decline = runs.some((r) => r.decline) ? `${m.decline.ok}/${m.decline.of}` : '';
      answerRows.push([id, done, f1(m.mean.turns), f1(m.mean.researchCalls), f1(m.mean.cited), f1(m.mean.accepted), `${f1(m.mean.rejected)}/${f1(m.mean.firstPassRejected)}`, decline, money(m.totalCostUsd / m.runs)]);
    }
  }
  if (composeRows.length) {
    out.push('', 'Compose (means over completed runs; cost over every run):');
    out.push(table(['case', 'done', 'turns', 'research', 'evidence', 'cited', 'sources', 'trad.src', 'sections', 'accepted', 'rej/1st', 'recall', 'resent', 'warn', 'vquotes', 'cost'], composeRows));
  }
  if (answerRows.length) {
    out.push('', 'Answers:');
    out.push(table(['case', 'done', 'turns', 'research', 'cited', 'accepted', 'rej/1st', 'decline', 'cost'], answerRows));
  }
  const flows = byFlow(s.runs);
  for (const flow of ['compose', 'answer'] as const) {
    const m = flows[flow];
    if (!m.runs) continue;
    out.push('', `${flow}: ${m.completed}/${m.runs} completed${flow === 'compose' ? `, ${m.sectionsComplete} with every expected section` : ''}${m.decline.of ? `, decline ${m.decline.ok}/${m.decline.of}` : ''}`);
    out.push(`  accepted ${withSd(m, 'accepted')} · rejected ${withSd(m, 'rejected')} (first pass ${f1(m.mean.firstPassRejected)}) · memory-recall ${f1(m.mean.memoryRecall)} · re-sent sections ${withSd(m, 'repairs')} · warnings ${withSd(m, 'warnings')}${m.withdrawn ? ` · ${m.withdrawn} decision(s) on withdrawn calls left out` : ''}`);
    out.push(`  turns ${withSd(m, 'turns')}${m.failedAttempts ? ` (+${m.failedAttempts} failed attempt(s) in all, billed)` : ''} · research calls ${f1(m.mean.researchCalls)} · evidence ${f1(m.mean.ledger)} · cited ${f1(m.mean.cited)} · sources ${f1(m.mean.sources)} · tradition sources ${f1(m.mean.traditionSources)} (${f1(m.mean.traditions)} traditions) · verified quotations ${f1(m.mean.verifiedQuotations)}`);
    out.push(`  output ${f1((m.mean.output ?? 0) / 1000)}k · cache read ${f1((m.mean.cacheRead ?? 0) / 1000)}k · cache write ${f1((m.mean.cacheCreation ?? 0) / 1000)}k tokens`);
    out.push(`  cost ${withSd(m, 'costUsd', 3)} per completed run · ${money(m.costPerCompletedUsd)} per completed page with failed runs' spend · $${m.totalCostUsd.toFixed(2)} in all`);
    if (Object.keys(m.rejectedByKind).length) out.push(`  rejections: ${kinds(m.rejectedByKind)} | first pass: ${kinds(m.firstPassByKind)}`);
  }
  const lint = s.runs.filter((r) => r.lint?.length);
  if (lint.length) out.push('', 'Final-page lint:', ...lint.map((r) => `  ${r.caseId} t${r.trial}: ${r.lint!.slice(0, 5).join('; ')}${r.lint!.length > 5 ? ` (+${r.lint!.length - 5})` : ''}`));
  return out.join('\n');
}

export function reportComparison(c: Comparison): string {
  const out: string[] = ['', 'Paired per case (baseline → candidate):'];
  const d = (a: number | null | undefined, b: number | null | undefined, fmt: (x: number | null | undefined) => string) => `${fmt(a)} → ${fmt(b)}`;
  out.push(
    table(
      ['case', 'done', 'accepted', 'rejected', 'recall', 'resent', 'sources', 'trad.src', 'turns', 'out k', 'cost'],
      c.rows.map((r) => [
        r.caseId,
        `${r.a ? `${r.a.completed}/${r.a.runs}` : '–'} → ${r.b ? `${r.b.completed}/${r.b.runs}` : '–'}`,
        d(r.a?.mean.accepted, r.b?.mean.accepted, f1),
        d(r.a?.mean.rejected, r.b?.mean.rejected, f1),
        d(r.a?.mean.memoryRecall, r.b?.mean.memoryRecall, f1),
        d(r.a?.mean.repairs, r.b?.mean.repairs, f1),
        d(r.a?.mean.sources, r.b?.mean.sources, f1),
        d(r.a?.mean.traditionSources, r.b?.mean.traditionSources, f1),
        d(r.a?.mean.turns, r.b?.mean.turns, f1),
        d(r.a?.mean.output == null ? null : r.a.mean.output / 1000, r.b?.mean.output == null ? null : r.b.mean.output / 1000, f1),
        d(r.a ? r.a.totalCostUsd / r.a.runs : null, r.b ? r.b.totalCostUsd / r.b.runs : null, money),
      ]),
    ),
  );
  out.push('', 'Cost per completed page (failed runs included):');
  for (const flow of ['compose', 'answer'] as const) {
    const { a, b } = c.cost[flow];
    out.push(`  ${flow}: ${money(a)} → ${money(b)}${a && b ? ` (${b >= a ? '+' : ''}${(((b - a) / a) * 100).toFixed(1)}%)` : ''}`);
  }
  out.push('', 'E7 keep/revert:');
  for (const ch of c.checks) out.push(`  [${ch.pass === true ? 'pass' : ch.pass === false ? 'FAIL' : ' ?? '}] ${ch.name} — ${ch.detail}`);
  out.push('', `Verdict: ${c.verdict}${c.verdict === 'KEEP' ? ' on the automatic checks — keep only if the E6 blind review shows no veto' : c.verdict === 'INCOMPLETE' ? ' — supply the missing measurements above' : ''}`);
  return out.join('\n');
}

/* ------------------------------------------------------------------ */
/* CLI                                                                 */
/* ------------------------------------------------------------------ */

function resolveDir(arg: string): string {
  if (existsSync(arg)) return resolve(arg);
  const labelled = join(DEFAULT_OUT, arg);
  if (existsSync(labelled)) return labelled;
  throw new Error(`No such directory or label: ${arg}`);
}

function main(argv: string[]): number {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: { since: { type: 'string' }, until: { type: 'string' }, replay: { type: 'string' }, cases: { type: 'string' }, json: { type: 'string' }, help: { type: 'boolean' } },
  });
  if (values.help || positionals.length < 1 || positionals.length > 2) {
    console.log('Usage: node scripts/eval/score.ts <baseline label|dir> [<candidate label|dir>] [--since ISO] [--until ISO] [--replay report.json] [--cases file] [--json out.json]');
    return values.help ? 0 : 2;
  }
  const set = loadCases(values.cases ?? CASES_FILE);
  const window: Window = { ...(values.since ? { since: values.since } : {}), ...(values.until ? { until: values.until } : {}) };
  const scored = positionals.map((p) => scoreDir(resolveDir(p), set, window));
  for (const s of scored) console.log(`${reportScored(s)}\n`);
  const comparison = scored.length === 2 ? compare(scored[0], scored[1], set, values.replay) : null;
  if (comparison) console.log(reportComparison(comparison));
  if (values.json) {
    const flows = scored.map((s) => ({ dir: s.dir, skippedCached: s.skippedCached, flows: byFlow(s.runs), cases: Object.fromEntries([...byCase(s.runs)].map(([id, runs]) => [id, summarize(runs)])), runs: s.runs }));
    writeFileSync(values.json, `${JSON.stringify({ scored: flows, comparison }, null, 2)}\n`, 'utf8');
  }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}
