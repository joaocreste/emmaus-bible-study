import type { LiteraryContext, SectionId, Study } from '../../domain/models';

export type DashboardSectionId = Exclude<SectionId, 'overview'>;

/** Default dashboard order. */
export const DEFAULT_SECTION_ORDER: readonly DashboardSectionId[] = [
  'scripture',
  'key-passages',
  'cross-references',
  'original-languages',
  'historical-context',
  'literary-context',
  'theology',
  'commentary',
  'sources',
];

/**
 * Which sections a study shows, in dashboard order. Curated and library studies show the
 * sections relevant to their kind (a library section offers the open datasets even without
 * curated items). A generated page shows only sections that have content — nothing is
 * left as an empty "not curated yet" placeholder — in the order its layout chose.
 */
export function visibleSections(study: Study): DashboardSectionId[] {
  if (study.depth === 'generated') return generatedSections(study);
  const ids: DashboardSectionId[] = [];
  if (study.passage) ids.push('scripture');
  if (study.kind === 'topic') ids.push('key-passages');
  if (study.crossReferences.length > 0 || study.passage) ids.push('cross-references');
  if (study.keyWords.length > 0 || study.passage) ids.push('original-languages');
  ids.push('historical-context');
  if (study.literary || study.passage) ids.push('literary-context');
  if (study.theology.length > 0 || study.perspectives.length > 0) ids.push('theology');
  ids.push('commentary', 'sources');
  return ids;
}

/** A generated page: sections with content, layout order first, the rest in default order, Sources last. */
export function generatedSections(study: Study): DashboardSectionId[] {
  const has: Record<DashboardSectionId, boolean> = {
    scripture: !!study.passage,
    'key-passages': (study.topic?.keyPassages.length ?? 0) > 0,
    'cross-references': study.crossReferences.length > 0,
    'original-languages': study.keyWords.length > 0,
    'historical-context': study.context.length > 0,
    'literary-context': hasLiteraryContent(study.literary),
    theology: study.theology.length > 0 || study.perspectives.length > 0,
    commentary: study.commentary.length > 0,
    sources: true,
  };
  const ordered: DashboardSectionId[] = [];
  for (const s of study.layout?.sections ?? []) {
    const id = s.id;
    if (id === 'overview' || id === 'sources' || !(id in has) || !has[id as DashboardSectionId]) continue;
    if (!ordered.includes(id as DashboardSectionId)) ordered.push(id as DashboardSectionId);
  }
  for (const id of DEFAULT_SECTION_ORDER) {
    if (id !== 'sources' && has[id] && !ordered.includes(id)) ordered.push(id);
  }
  return [...ordered, 'sources'];
}

function hasLiteraryContent(lit: LiteraryContext | undefined): boolean {
  if (!lit) return false;
  return Boolean(
    lit.placeInBook?.text?.trim() ||
      lit.argument?.text?.trim() ||
      lit.placeInCanon?.text?.trim() ||
      (lit.features?.length ?? 0) > 0 ||
      (lit.passageOutline?.length ?? 0) > 0,
  );
}
