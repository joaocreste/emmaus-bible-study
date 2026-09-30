/**
 * Cross-reference filtering (relationship · traditional author · book · tags).
 * Framework-free so the same rules can back a future server-side query.
 */
import type { CrossReference, CrossReferenceFilter, PassageRef, RelationshipType } from '../../../domain/models';
import { tryGetBook } from '../../../domain/books';

/** Display order of relationship types (also the filter chip order). */
export const RELATIONSHIP_ORDER: RelationshipType[] = [
  'parallel',
  'quotation',
  'allusion',
  'prophecy-fulfillment',
  'thematic',
  'same-concept',
  'contrast',
  'historical',
];

/** Traditional author of the book a reference points to ("Paul", "John", "Moses"). */
export function traditionalAuthorOf(ref: PassageRef): string | undefined {
  return tryGetBook(ref.book)?.traditionalAuthor;
}

export function isFilterActive(f: CrossReferenceFilter): boolean {
  return Boolean(f.relationships?.length || f.author || f.book || f.tags?.length);
}

/** Apply every criterion that is set (logical AND); tags match if any tag overlaps. */
export function filterCrossReferences(refs: readonly CrossReference[], f: CrossReferenceFilter): CrossReference[] {
  const rels = f.relationships?.length ? new Set(f.relationships) : null;
  const author = f.author?.trim().toLowerCase();
  const tags = f.tags?.length ? new Set(f.tags.map((t) => t.toLowerCase())) : null;
  return refs.filter((x) => {
    if (rels && !rels.has(x.relationship)) return false;
    if (author && traditionalAuthorOf(x.target)?.toLowerCase() !== author) return false;
    if (f.book && x.target.book !== f.book) return false;
    if (tags && !x.tags.some((t) => tags.has(t.toLowerCase()))) return false;
    return true;
  });
}

/** Relationship types present, in display order, with counts. */
export function relationshipsPresent(refs: readonly CrossReference[]): { type: RelationshipType; count: number }[] {
  const counts = new Map<RelationshipType, number>();
  for (const x of refs) counts.set(x.relationship, (counts.get(x.relationship) ?? 0) + 1);
  return RELATIONSHIP_ORDER.filter((t) => counts.has(t)).map((type) => ({ type, count: counts.get(type)! }));
}

/**
 * Traditional authors among the targets, most frequent first. Anonymous and
 * composite attributions ("David and others") are left out — they make poor filters.
 */
export function authorsPresent(refs: readonly CrossReference[], max = 6): { author: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const x of refs) {
    const a = traditionalAuthorOf(x.target);
    if (!a || /anonymous|others|traditional|\(/i.test(a)) continue;
    counts.set(a, (counts.get(a) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count || a.author.localeCompare(b.author))
    .slice(0, max);
}

/** Toggle one relationship in a filter, leaving the other criteria untouched. */
export function toggleRelationship(f: CrossReferenceFilter, type: RelationshipType): CrossReferenceFilter {
  const current = new Set(f.relationships ?? []);
  if (current.has(type)) current.delete(type);
  else current.add(type);
  const relationships = RELATIONSHIP_ORDER.filter((t) => current.has(t));
  return { ...f, relationships: relationships.length ? relationships : undefined };
}

/** Select or clear a traditional-author filter. */
export function toggleAuthor(f: CrossReferenceFilter, author: string): CrossReferenceFilter {
  const same = f.author?.toLowerCase() === author.toLowerCase();
  return { ...f, author: same ? undefined : author };
}

/**
 * Faceted counts: how many references each relationship chip and each author chip would
 * show if pressed, given the other active criteria. (Relationships combine with OR among
 * themselves and with AND against author, book and tags.) A chip whose count is 0 would
 * lead to an empty list.
 */
export function facetCounts(
  refs: readonly CrossReference[],
  f: CrossReferenceFilter,
): { relationships: Map<RelationshipType, number>; authors: Map<string, number> } {
  const relationships = new Map<RelationshipType, number>();
  for (const x of filterCrossReferences(refs, { ...f, relationships: undefined })) {
    relationships.set(x.relationship, (relationships.get(x.relationship) ?? 0) + 1);
  }
  const authors = new Map<string, number>();
  for (const x of filterCrossReferences(refs, { ...f, author: undefined })) {
    const a = traditionalAuthorOf(x.target)?.toLowerCase();
    if (a) authors.set(a, (authors.get(a) ?? 0) + 1);
  }
  return { relationships, authors };
}
