import type { Concept, DashboardFocus, Study } from '../../domain/models';

/**
 * Key points shown under the header of a generated page: its concepts — for a question
 * page, one per point the question turns on (server/inference/prompt.ts QUESTION_INSTRUCTION).
 * Curated and library studies keep their concepts for chat follow-ups only.
 */
export function keyPointsOf(study: Study): Concept[] {
  return study.depth === 'generated' ? study.concepts.filter((c) => c.answer.text.trim()) : [];
}

/** Dashboard focus for a key point: its section, the items it links (expanded or pinned) and its verses. */
export function keyPointFocus(concept: Concept, reason: string): DashboardFocus {
  const expandIds = [...concept.themeIds, ...concept.contextIds, ...concept.perspectiveSetIds, ...(concept.literaryFeatureIds ?? [])];
  const pinIds = [...concept.crossReferenceIds, ...concept.commentaryIds];
  return {
    ...(concept.primarySection !== 'overview' ? { section: concept.primarySection } : {}),
    ...(concept.keyWordIds.length ? { highlightWordIds: concept.keyWordIds } : {}),
    ...(concept.verses.length ? { highlightVerses: concept.verses.slice(0, 8) } : {}),
    ...(expandIds.length ? { expandIds } : {}),
    ...(pinIds.length ? { pinIds } : {}),
    ...(concept.crossReferenceIds.length ? { crossReferenceFilter: {} } : {}),
    ...(concept.commentaryIds.length ? { commentaryAuthorIds: [] } : {}),
    reason,
  };
}
