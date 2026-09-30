import { describe, expect, it } from 'vitest';
import { cardSpans } from '../featuredLayout';

/** Rows of a 6-column grid filled in order by the given spans. */
function rows(spans: number[]): number[][] {
  const out: number[][] = [];
  let row: number[] = [];
  let used = 0;
  for (const s of spans) {
    if (used + s > 6) {
      out.push(row);
      row = [];
      used = 0;
    }
    row.push(s);
    used += s;
  }
  if (row.length) out.push(row);
  return out;
}

describe('cardSpans', () => {
  it('lays five featured studies out as two wide cards, then three', () => {
    expect(cardSpans(5)).toEqual([3, 3, 2, 2, 2]);
  });

  it('fills every row completely, so no card is left alone', () => {
    for (let n = 2; n <= 12; n++) {
      const r = rows(cardSpans(n));
      expect(r.every((row) => row.reduce((a, b) => a + b, 0) === 6), `count ${n}: ${JSON.stringify(r)}`).toBe(true);
    }
  });

  it('handles the degenerate counts', () => {
    expect(cardSpans(0)).toEqual([]);
    expect(cardSpans(1)).toEqual([6]);
  });
});
