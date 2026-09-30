import type { Author, CommentaryEntry, Era } from '../../../domain/models';

export const ERA_ORDER: Era[] = ['early-church', 'medieval', 'reformation', 'post-reformation', 'modern', 'contemporary', 'ancient'];

/** English labels (non-UI fallback); the UI shows the 'commentary' namespace's `era.<era>.label` / `.span`. */
export const ERA_LABEL: Record<Era, string> = {
  'early-church': 'Early church',
  medieval: 'Medieval',
  reformation: 'Reformation',
  'post-reformation': 'Post-Reformation',
  modern: 'Modern',
  contemporary: 'Contemporary',
  ancient: 'Ancient sources',
};

/** Approximate span of each era, for tooltips. */
export const ERA_SPAN: Record<Era, string> = {
  'early-church': 'to c. 600',
  medieval: 'c. 600–1500',
  reformation: 'c. 1500–1650',
  'post-reformation': 'c. 1650–1800',
  modern: 'c. 1800–1950',
  contemporary: 'c. 1950 to today',
  ancient: 'Jewish and Greco-Roman writers cited for background',
};

/** Eras present among the entries' authors, in chronological order. */
export function presentEras(entries: CommentaryEntry[], getAuthor: (id: string) => Author | undefined): Era[] {
  const found = new Set<Era>();
  for (const e of entries) {
    const a = getAuthor(e.authorId);
    if (a) found.add(a.era);
  }
  return ERA_ORDER.filter((e) => found.has(e));
}

/** Distinct authors of the entries, chronologically (by era, then first appearance). */
export function presentAuthors(entries: CommentaryEntry[], getAuthor: (id: string) => Author | undefined): Author[] {
  const seen = new Map<string, Author>();
  for (const e of entries) {
    const a = getAuthor(e.authorId);
    if (a && !seen.has(a.id)) seen.set(a.id, a);
  }
  const order = [...seen.values()];
  return order
    .map((a, i) => ({ a, i }))
    .sort((x, y) => ERA_ORDER.indexOf(x.a.era) - ERA_ORDER.indexOf(y.a.era) || x.i - y.i)
    .map((x) => x.a);
}

/** Apply the era and author filters (an empty author list means "all authors"). */
export function filterEntries(
  entries: CommentaryEntry[],
  getAuthor: (id: string) => Author | undefined,
  era: Era | 'all',
  authorIds: readonly string[],
): CommentaryEntry[] {
  return entries.filter((e) => {
    if (authorIds.length > 0 && !authorIds.includes(e.authorId)) return false;
    if (era === 'all') return true;
    return getAuthor(e.authorId)?.era === era;
  });
}
