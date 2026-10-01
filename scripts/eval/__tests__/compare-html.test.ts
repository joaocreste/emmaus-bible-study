import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EVAL_DIR, loadCases } from '../lib.ts';
import { pairPages, reviewHtml, unblind } from '../compare-html.ts';

/** A label directory holding one trial's page per case, as run.ts writes it. */
function label(root: string, name: string, pages: Record<string, { fixture: string; title: string }>): string {
  const dir = join(root, name, 't1');
  mkdirSync(dir, { recursive: true });
  for (const [caseId, { fixture, title }] of Object.entries(pages)) {
    const page = JSON.parse(readFileSync(join(EVAL_DIR, 'fixtures', fixture), 'utf8'));
    const log = { flow: 'compose', request: {}, decisions: [], toolCalls: [], ledger: [], turns: [], startedAt: '2026-09-30T12:00:00.000Z', outcome: { end: 'done' }, eval: { caseId, trial: 1 } };
    writeFileSync(join(dir, `${caseId}.log.json`), JSON.stringify(log));
    writeFileSync(join(dir, `${caseId}.page.json`), JSON.stringify({ study: { ...page.study, title }, reply: page.reply, error: null }));
  }
  return join(root, name);
}

describe('compare-html (E6 blind review)', () => {
  const root = mkdtempSync(join(tmpdir(), 'emmaus-review-'));
  const base = label(root, 'base', { divorce: { fixture: 'divorce.json', title: 'Baseline divorce' }, 'genese-1-fr': { fixture: 'genese-1.json', title: 'Baseline Genèse' } });
  const cand = label(root, 'cand', { divorce: { fixture: 'divorce.json', title: 'Candidate <divorce>' }, 'genese-1-fr': { fixture: 'genese-1.json', title: 'Candidate Genèse' } });
  const cases = loadCases().cases;

  it('pairs pages by case and shuffles sides reproducibly from the seed', () => {
    const pairs = pairPages(base, cand, 1, 7, cases.map((c) => c.id));
    expect(pairs.map((p) => p.caseId)).toEqual(['divorce', 'genese-1-fr']);
    expect(pairPages(base, cand, 1, 7, []).map((p) => p.leftIs)).toEqual(pairs.map((p) => p.leftIs));
    for (const p of pairs) expect(p.left.study!.title.startsWith(p.leftIs === 'baseline' ? 'Baseline' : 'Candidate')).toBe(true);
    const sides = new Set(Array.from({ length: 16 }, (_, seed) => pairPages(base, cand, 1, seed, [])[0].leftIs));
    expect(sides).toEqual(new Set(['baseline', 'candidate']));
  });

  it('renders both pages escaped, without saying which run is which', () => {
    const html = reviewHtml(pairPages(base, cand, 1, 7, []), cases, 'base-vs-cand');
    expect(html).toContain('Candidate &lt;divorce&gt;');
    expect(html).not.toContain('Candidate <divorce>');
    expect(html).toContain('Baseline Genèse');
    expect(html).toContain('name="divorce|faithfulness"');
    expect(html).not.toMatch(/claude-opus|generation|"baseline"|"candidate"/);
  });

  it('unblinds exported scores with the key', () => {
    const key = {
      reviewId: 'r',
      seed: 7,
      trial: 1,
      baseline: base,
      candidate: cand,
      cases: { divorce: { left: 'candidate' as const, right: 'baseline' as const }, 'genese-1-fr': { left: 'baseline' as const, right: 'candidate' as const } },
    };
    const r = unblind({ reviewId: 'r', answers: { 'divorce|faithfulness': 'L', 'genese-1-fr|faithfulness': 'L', 'divorce|balance': 'T', 'genese-1-fr|vetoR|invented': true, 'divorce|notes': 'fine' } }, key);
    expect(r.criteria.faithfulness).toEqual({ candidate: 1, baseline: 1, tie: 0 });
    expect(r.criteria.balance).toEqual({ candidate: 0, baseline: 0, tie: 1 });
    expect(r.vetoes).toEqual(['genese-1-fr: candidate — invented']);
    expect(() => unblind({ reviewId: 'other', answers: {} }, key)).toThrow(/review other/);
  });
});
