/**
 * Curated providers: the curated study library, the merged source/author
 * registry, the sermon catalogue and the topic index — all backed by the
 * modules under src/data/curated (loaded with import.meta.glob), in four
 * languages through the translation overlays under src/data/curated/i18n.
 */
import type { CuratedStudy, CuratedTopic } from '../../domain/models';
import type { ProviderRegistry } from '../types';
import { createLocalizer } from './localization';
import { loadCuratedOverlays, loadCuratedStudies, loadCuratedTopics, sortStudies, type CuratedOverlays } from './modules';
import { createSermonProvider } from './sermons';
import { createSourceRegistry } from './sources';
import { createStudyRepository } from './studies';
import { createTopicProvider } from './topics';

export type CuratedProviders = Pick<ProviderRegistry, 'studies' | 'sources' | 'sermons' | 'topics'>;

export type { CuratedTopicMatch } from './topics';
export type { CuratedOverlays } from './modules';
export { collectOverlays } from './modules';

/** Curated providers over explicit modules (tests, previews, future remote content). Overlays are optional. */
export function createCuratedProvidersFrom(input: { studies: CuratedStudy[]; topics: CuratedTopic[]; overlays?: CuratedOverlays }): CuratedProviders {
  const studies = sortStudies(input.studies);
  const topics = [...input.topics].sort((a, b) => a.name.localeCompare(b.name));
  const localizer = createLocalizer(input.overlays);
  return {
    studies: createStudyRepository(studies, localizer),
    sources: createSourceRegistry({ studies, topics }),
    sermons: createSermonProvider(studies, localizer, topics),
    topics: createTopicProvider(topics, studies, undefined, localizer),
  };
}

/** Curated providers over the bundled library in src/data/curated (with its translation overlays). */
export function createCuratedProviders(): CuratedProviders {
  return createCuratedProvidersFrom({ studies: loadCuratedStudies(), topics: loadCuratedTopics(), overlays: loadCuratedOverlays() });
}
