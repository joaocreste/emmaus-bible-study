/**
 * Blind side-by-side review (E6): for each case, the baseline's and the candidate's page (or
 * answer) next to each other, left/right shuffled per case with a seed. The key — which side
 * is which — is written to a separate file, so the reviewer can score without seeing it.
 *
 *   node scripts/eval/compare-html.ts <baseline label|dir> <candidate label|dir> [--trial 1] [--seed 1] [--out dir]
 *   node scripts/eval/compare-html.ts --unblind <exported scores.json> --key <review-key.json>
 *
 * Writes <out>/review.html (self-contained: open it from disk, nothing is fetched) and
 * <out>/review-key.json. The page keeps the reviewer's choices in the browser and exports them
 * as JSON; --unblind joins that export with the key and prints the candidate's preference share
 * per criterion (E7: no worse than 40/60 on faithfulness and balance) and every veto.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import type { Citation, PassageRef, Provenance, Study, VerseRef } from '../../src/domain/models.ts';
import { caseText, DEFAULT_OUT, loadCases, readRuns, type EvalCase, type PageSidecar } from './lib.ts';

/** E6 rubric: the reviewer picks the better side (or a tie) per criterion. */
export const CRITERIA = [
  ['faithfulness', 'Faithfulness — pick 5 items; does each claim say what its cited excerpt says (no inverted attribution, nothing added inside “X notes that”)?'],
  ['balance', 'Balance — traditions steel-manned, consensus level right, no forced perspectives block'],
  ['coverage', 'Scope and coverage — the passages a reader expects are there; the question asked is answered'],
  ['tone', 'Pastoral tone — no moralising or verdicts on the reader; the hardest question included on painful subjects'],
  ['words', 'Word studies — meaning in this verse, root-fallacy cautions, no theology from etymology'],
  ['clarity', 'Clarity — concise, no repetition'],
] as const;

/** Findings that veto a candidate whatever else it scores. */
export const VETOES = [
  ['invented', 'invented quote, source, date or reference'],
  ['copyright', 'copyrighted wording reproduced'],
  ['verdict', 'moral verdict on the reader'],
] as const;

/* ------------------------------------------------------------------ */
/* Pairing and shuffling                                               */
/* ------------------------------------------------------------------ */

export interface ReviewPair {
  caseId: string;
  left: PageSidecar;
  right: PageSidecar;
  /** which run each side shows (written to the key file only) */
  leftIs: 'baseline' | 'candidate';
}

/** mulberry32: a small seeded generator, so a seed reproduces the same shuffle */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** The page sidecars of one trial, by case id. */
function pagesOf(dir: string, trial: number): Map<string, PageSidecar> {
  const out = new Map<string, PageSidecar>();
  for (const run of readRuns(dir)) {
    const id = run.log.eval?.caseId;
    if (id && run.page && (run.log.eval?.trial ?? 1) === trial) out.set(id, run.page);
  }
  return out;
}

export function pairPages(baselineDir: string, candidateDir: string, trial: number, seed: number, order: string[]): ReviewPair[] {
  const a = pagesOf(baselineDir, trial);
  const b = pagesOf(candidateDir, trial);
  const ids = [...new Set([...order, ...a.keys(), ...b.keys()])].filter((id) => a.has(id) && b.has(id));
  return ids.map((caseId) => {
    const leftIs = random(seed ^ hash(caseId))() < 0.5 ? 'baseline' : 'candidate';
    const [left, right] = leftIs === 'baseline' ? [a.get(caseId)!, b.get(caseId)!] : [b.get(caseId)!, a.get(caseId)!];
    return { caseId, left, right, leftIs };
  });
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function ref(r: PassageRef | undefined): string {
  if (!r) return '';
  const start = `${r.book} ${r.startChapter}${r.startVerse ? `:${r.startVerse}` : ''}`;
  if (r.endChapter == null && r.endVerse == null) return start;
  const endChapter = r.endChapter ?? r.startChapter;
  if (endChapter === r.startChapter && r.endVerse != null) return r.endVerse === r.startVerse ? start : `${start}–${r.endVerse}`;
  return `${start}–${endChapter}${r.endVerse ? `:${r.endVerse}` : ''}`;
}

const verse = (v: VerseRef) => `${v.book} ${v.chapter}:${v.verse}`;

function cites(p: Provenance | undefined): string {
  if (!p) return '';
  const tag = `<span class="tag ${p.kind === 'quotation' ? 'quote' : ''}">${esc(p.kind)}${p.verification === 'verified' ? ' · verified' : ''}</span>`;
  const list = (p.citations ?? []).map((c: Citation) => `<li><b>${esc(c.sourceId)}</b>${c.locator ? ` ${esc(c.locator)}` : ''}${c.excerpt ? `<blockquote>${esc(c.excerpt)}</blockquote>` : ''}</li>`).join('');
  return list ? `${tag}<details><summary>${p.citations.length} citation${p.citations.length === 1 ? '' : 's'}</summary><ul>${list}</ul></details>` : tag;
}

const para = (text: unknown, p?: Provenance) => (text ? `<p>${esc(text)} ${cites(p)}</p>` : '');
const item = (title: string, body: string) => `<div class="item"><h4>${title}</h4>${body}</div>`;

function studyHtml(s: Study): string {
  const parts: string[] = [`<h3>${esc(s.title)}</h3>`, s.subtitle ? `<p class="sub">${esc(s.subtitle)}</p>` : ''];
  parts.push(para(s.opening?.text, s.opening?.provenance), para(s.summary?.text, s.summary?.provenance));
  if (s.topic?.definition) parts.push(para(s.topic.definition.text, s.topic.definition.provenance));
  const section = (title: string, body: string) => (body ? `<section><h3 class="sec">${esc(title)}</h3>${body}</section>` : '');
  const order = (s.layout?.sections ?? []).map((x) => x.id);
  const render: Record<string, () => string> = {
    'key-passages': () => (s.topic?.keyPassages ?? []).map((k) => item(`${esc(ref(k.ref))} — ${esc(k.title)}`, para(k.note?.text, k.note?.provenance))).join(''),
    'cross-references': () => s.crossReferences.map((x) => item(`${esc(ref(x.target))} (${esc(x.relationship)}) — ${esc(x.title)}`, para(x.explanation?.text, x.explanation?.provenance))).join(''),
    'original-languages': () =>
      s.keyWords
        .map((k) => item(`<span lang="${k.language === 'greek' ? 'grc' : 'hbo'}">${esc(k.lemma)}</span> ${esc(k.transliteration)} (${esc(k.strong)}) — ${esc(k.basicMeaning)}`, `<p class="meta">${esc(k.anchors.map((a) => verse(a.verse)).join(', '))}</p>${para(k.significance?.text, k.significance?.provenance)}`))
        .join(''),
    'historical-context': () => s.context.map((c) => item(esc(c.title), `${para(c.summary)}${para(c.detail)}${cites(c.provenance)}`)).join(''),
    'literary-context': () =>
      s.literary
        ? `${para(s.literary.placeInBook?.text, s.literary.placeInBook?.provenance)}${para(s.literary.argument?.text, s.literary.argument?.provenance)}${(s.literary.features ?? []).map((f) => item(esc(f.title), para(f.description))).join('')}`
        : '',
    theology: () =>
      [
        ...s.theology.map((t) => item(esc(t.title), `${para(t.summary)}${para(t.detail)}${cites(t.provenance)}`)),
        ...s.perspectives.map((ps) =>
          item(`${esc(ps.question)} <span class="tag">${esc(ps.consensus)}</span>`, `${para(ps.intro)}${ps.perspectives.map((p) => `<div class="pos"><b>${esc(p.tradition)}</b> — ${esc(p.label)}${para(p.summary, p.provenance)}</div>`).join('')}`),
        ),
      ].join(''),
    commentary: () => s.commentary.map((c) => item(`${esc(c.authorId ?? c.sourceId)}${c.locator ? `, ${esc(c.locator)}` : ''}${c.lead ? ` — ${esc(c.lead)}` : ''}`, para(c.kind === 'quotation' ? `“${c.text}”` : c.text, c.provenance))).join(''),
  };
  for (const id of order.length ? order : Object.keys(render)) {
    const f = render[id];
    if (f) parts.push(section(id, f()));
  }
  return parts.join('');
}

function sideHtml(p: PageSidecar, flow: EvalCase['flow'] | undefined): string {
  if (p.error && !p.study && !p.reply) return `<p class="error">No output: ${esc(p.error.message)}</p>`;
  const reply = p.reply ? `<div class="reply">${(p.reply.blocks ?? []).map((b) => ('text' in b ? `<p>${esc(b.text)}</p>` : '')).join('') || `<p>${esc(p.reply.text)}</p>`}${cites(p.reply.provenance)}</div>` : '';
  if (flow === 'answer') return `${reply}${p.error ? `<p class="error">${esc(p.error.message)}</p>` : ''}`;
  return `${p.study ? studyHtml(p.study) : ''}${p.error ? `<p class="error">${esc(p.error.message)}</p>` : ''}`;
}

export function reviewHtml(pairs: ReviewPair[], cases: EvalCase[], reviewId: string): string {
  const byId = new Map(cases.map((c) => [c.id, c]));
  const radios = (caseId: string) =>
    CRITERIA.map(
      ([k, label]) =>
        `<fieldset><legend>${esc(label)}</legend>${['L', 'T', 'R'].map((v) => `<label><input type="radio" name="${esc(caseId)}|${k}" value="${v}"> ${v === 'L' ? 'Left better' : v === 'R' ? 'Right better' : 'Tie'}</label>`).join('')}</fieldset>`,
    ).join('');
  const vetoes = (caseId: string, side: 'L' | 'R') => VETOES.map(([k, label]) => `<label><input type="checkbox" name="${esc(caseId)}|veto${side}|${k}"> ${esc(label)}</label>`).join('');
  const body = pairs
    .map((p) => {
      const c = byId.get(p.caseId);
      return `<article id="${esc(p.caseId)}"><h2>${esc(p.caseId)}: ${esc(c ? caseText(c) : '')} <span class="tag">${esc(c?.locale ?? '')}</span></h2>
<div class="sides"><div class="side"><h3 class="label">Left</h3>${sideHtml(p.left, c?.flow)}</div><div class="side"><h3 class="label">Right</h3>${sideHtml(p.right, c?.flow)}</div></div>
<form class="rubric">${radios(p.caseId)}<fieldset><legend>Vetoes — left</legend>${vetoes(p.caseId, 'L')}</fieldset><fieldset><legend>Vetoes — right</legend>${vetoes(p.caseId, 'R')}</fieldset><label class="notes">Notes <textarea name="${esc(p.caseId)}|notes" rows="2"></textarea></label></form></article>`;
    })
    .join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Emmaus blind review</title>
<style>
:root{--bg:#fbfaf7;--fg:#1f1d1a;--muted:#6b665e;--line:#ddd8cf;--card:#fff;--accent:#8a6d1f}
@media (prefers-color-scheme:dark){:root{--bg:#171614;--fg:#ece8e0;--muted:#a39d92;--line:#3a3732;--card:#201f1c;--accent:#d8b75a}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
header,article{max-width:1400px;margin:0 auto;padding:16px}
article{border-top:1px solid var(--line)}
.sides{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:800px){.sides{grid-template-columns:1fr}}
.side{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px;font-family:Georgia,serif;overflow-wrap:anywhere}
.side h3.label{font-family:system-ui,sans-serif;color:var(--accent);margin:0 0 8px}
.sec{font-family:system-ui,sans-serif;text-transform:uppercase;font-size:12px;letter-spacing:.06em;color:var(--muted);border-bottom:1px solid var(--line)}
.item h4{margin:10px 0 2px;font-size:15px}.meta,.sub{color:var(--muted)}
.tag{font:12px system-ui,sans-serif;border:1px solid var(--line);border-radius:4px;padding:0 4px;color:var(--muted)}.tag.quote{color:var(--accent);border-color:var(--accent)}
details{font:13px system-ui,sans-serif;color:var(--muted)}blockquote{margin:4px 0 4px 12px;font-style:italic}
.error{color:#b3261e}.pos{margin-left:12px}
.rubric{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:8px;margin-top:12px}
fieldset{border:1px solid var(--line);border-radius:6px}legend{font-size:13px}label{margin-right:12px;white-space:nowrap}
.notes{grid-column:1/-1;white-space:normal}textarea{width:100%}
button{font:inherit;padding:6px 12px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
</style></head><body>
<header><h1>Blind review — ${pairs.length} case${pairs.length === 1 ? '' : 's'}</h1>
<p>Each case shows two pages in random order. Pick the better side per criterion (or a tie), tick any veto, then export. Choices are kept in this browser only.</p>
<button type="button" id="export">Export scores (JSON)</button></header>
${body}
<script>
const KEY = ${JSON.stringify(`emmaus-review:${reviewId}`)};
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const state = load();
for (const el of document.querySelectorAll('input, textarea')) {
  const v = state[el.name];
  if (el.type === 'radio') el.checked = v === el.value;
  else if (el.type === 'checkbox') el.checked = v === true;
  else if (typeof v === 'string') el.value = v;
  el.addEventListener('change', () => {
    state[el.name] = el.type === 'checkbox' ? el.checked : el.value;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  });
}
document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ reviewId: ${JSON.stringify(reviewId)}, answers: state }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'review-scores.json';
  a.click();
});
</script></body></html>
`;
}

/* ------------------------------------------------------------------ */
/* Unblinding                                                          */
/* ------------------------------------------------------------------ */

interface Key {
  reviewId: string;
  seed: number;
  trial: number;
  baseline: string;
  candidate: string;
  cases: Record<string, { left: 'baseline' | 'candidate'; right: 'baseline' | 'candidate' }>;
}

/** The candidate's share of non-tie preferences per criterion, and the vetoes by run. */
export function unblind(scores: { reviewId: string; answers: Record<string, string | boolean> }, key: Key): { criteria: Record<string, { candidate: number; baseline: number; tie: number }>; vetoes: string[] } {
  if (scores.reviewId !== key.reviewId) throw new Error(`scores are for review ${scores.reviewId}, the key for ${key.reviewId}`);
  const criteria: Record<string, { candidate: number; baseline: number; tie: number }> = {};
  for (const [k] of CRITERIA) criteria[k] = { candidate: 0, baseline: 0, tie: 0 };
  const vetoes: string[] = [];
  for (const [name, value] of Object.entries(scores.answers)) {
    const [caseId, field, veto] = name.split('|');
    const sides = key.cases[caseId];
    if (!sides) continue;
    if (field in criteria && typeof value === 'string') {
      if (value === 'T') criteria[field].tie++;
      else criteria[field][value === 'L' ? sides.left : sides.right]++;
    } else if ((field === 'vetoL' || field === 'vetoR') && value === true) {
      vetoes.push(`${caseId}: ${field === 'vetoL' ? sides.left : sides.right} — ${veto}`);
    }
  }
  return { criteria, vetoes };
}

/* ------------------------------------------------------------------ */
/* CLI                                                                 */
/* ------------------------------------------------------------------ */

function resolveDir(arg: string): string {
  if (existsSync(arg)) return resolve(arg);
  if (existsSync(join(DEFAULT_OUT, arg))) return join(DEFAULT_OUT, arg);
  throw new Error(`No such directory or label: ${arg}`);
}

function main(argv: string[]): number {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: { trial: { type: 'string' }, seed: { type: 'string' }, out: { type: 'string' }, unblind: { type: 'string' }, key: { type: 'string' } },
  });
  if (values.unblind) {
    if (!values.key) throw new Error('--unblind needs --key <review-key.json>');
    const r = unblind(JSON.parse(readFileSync(values.unblind, 'utf8')), JSON.parse(readFileSync(values.key, 'utf8')) as Key);
    for (const [k, v] of Object.entries(r.criteria)) {
      const decided = v.candidate + v.baseline;
      console.log(`${k.padEnd(13)} candidate ${v.candidate}, baseline ${v.baseline}, tie ${v.tie}${decided ? ` — candidate share ${Math.round((v.candidate / decided) * 100)}%` : ''}`);
    }
    console.log(r.vetoes.length ? `Vetoes:\n  ${r.vetoes.join('\n  ')}` : 'No vetoes.');
    return 0;
  }
  if (positionals.length !== 2) {
    console.log('Usage: node scripts/eval/compare-html.ts <baseline label|dir> <candidate label|dir> [--trial 1] [--seed 1] [--out dir]\n       node scripts/eval/compare-html.ts --unblind <scores.json> --key <review-key.json>');
    return 2;
  }
  const [baseline, candidate] = positionals.map(resolveDir);
  const trial = Number(values.trial ?? 1);
  const seed = Number(values.seed ?? 1);
  const set = loadCases();
  const pairs = pairPages(baseline, candidate, trial, seed, set.cases.map((c) => c.id));
  if (!pairs.length) throw new Error('No case has a page on both sides for that trial.');
  const reviewId = `${basename(baseline)}-vs-${basename(candidate)}-t${trial}-s${seed}`;
  const out = resolve(values.out ?? join(DEFAULT_OUT, `review-${reviewId}`));
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'review.html'), reviewHtml(pairs, set.cases, reviewId), 'utf8');
  const key: Key = { reviewId, seed, trial, baseline, candidate, cases: Object.fromEntries(pairs.map((p) => [p.caseId, { left: p.leftIs, right: p.leftIs === 'baseline' ? 'candidate' : 'baseline' }])) };
  writeFileSync(join(out, 'review-key.json'), `${JSON.stringify(key, null, 2)}\n`, 'utf8');
  console.log(`${pairs.length} case(s) → ${join(out, 'review.html')}\nKey (keep it from the reviewer): ${join(out, 'review-key.json')}`);
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
