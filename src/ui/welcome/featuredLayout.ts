/**
 * Column span of each featured-study card in the 6-column grid (≥ 760px): first
 * rows of two wide cards, then rows of three, so no card is ever left alone on a
 * row (5 → 2 + 3, 4 → 2 + 2, 7 → 2 + 2 + 3, 8 → 2 + 3 + 3).
 */
export function cardSpans(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [6];
  const wide = count % 3 === 0 ? 0 : count % 3 === 2 ? 2 : 4;
  return Array.from({ length: count }, (_, i) => (i < wide ? 3 : 2));
}
