/**
 * Loads the curated library modules bundled with the app:
 *   src/data/curated/studies/<id>.ts       (default export: CuratedStudy)
 *   src/data/curated/topics/<id>.ts        (default export: CuratedTopic)
 *   src/data/curated/i18n/<locale>/<id>.ts (default export: StudyOverlay | TopicOverlay)
 * Robust to an empty library and to malformed modules (skipped with a dev warning).
 */
import type { CuratedStudy, CuratedTopic } from '../../domain/models';
import type { StudyOverlay, TopicOverlay } from '../../data/curated/i18n/types';

const studyModules = import.meta.glob<CuratedStudy>('../../data/curated/studies/*.ts', { eager: true, import: 'default' });
const topicModules = import.meta.glob<CuratedTopic>('../../data/curated/topics/*.ts', { eager: true, import: 'default' });
const overlayModules = import.meta.glob<StudyOverlay | TopicOverlay>(['../../data/curated/i18n/*/*.ts', '!../../data/curated/i18n/__tests__/**'], {
  eager: true,
  import: 'default',
});

/** Featured studies first (the spec's MVP scenarios), then alphabetical by id. */
const PREFERRED_ORDER = ['romans-8', 'john-1', 'psalm-23', 'grace', 'suffering'];

function orderIndex(id: string): number {
  const i = PREFERRED_ORDER.indexOf(id);
  return i === -1 ? PREFERRED_ORDER.length : i;
}

function isDev(): boolean {
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return false;
  }
}

/** Dev-only warning (silent in production builds). */
export function devWarn(message: string): void {
  if (isDev()) console.warn(`[curated] ${message}`);
}

function isStudy(value: unknown): value is CuratedStudy {
  const v = value as Partial<CuratedStudy> | undefined;
  return Boolean(v && typeof v.id === 'string' && (v.kind === 'passage' || v.kind === 'topic') && v.match && Array.isArray(v.match.references));
}

function isTopic(value: unknown): value is CuratedTopic {
  const v = value as Partial<CuratedTopic> | undefined;
  return Boolean(v && typeof v.id === 'string' && typeof v.name === 'string' && v.topic && Array.isArray(v.aliases));
}

/** Sort curated studies: featured order, then id. Pure — used for injected fixtures too. */
export function sortStudies(studies: CuratedStudy[]): CuratedStudy[] {
  return [...studies].sort((a, b) => orderIndex(a.id) - orderIndex(b.id) || a.id.localeCompare(b.id));
}

/** Every valid curated study module, deduplicated by id (first wins). */
export function loadCuratedStudies(): CuratedStudy[] {
  const out: CuratedStudy[] = [];
  const seen = new Set<string>();
  for (const [path, mod] of Object.entries(studyModules)) {
    if (!isStudy(mod)) {
      devWarn(`skipped study module ${path}: missing id/kind/match`);
      continue;
    }
    if (seen.has(mod.id)) {
      devWarn(`duplicate study id "${mod.id}" in ${path} — keeping the first`);
      continue;
    }
    seen.add(mod.id);
    out.push(mod);
  }
  return sortStudies(out);
}

/** Every valid topic-index module, alphabetical by name. */
export function loadCuratedTopics(): CuratedTopic[] {
  const out: CuratedTopic[] = [];
  const seen = new Set<string>();
  for (const [path, mod] of Object.entries(topicModules)) {
    if (!isTopic(mod)) {
      devWarn(`skipped topic module ${path}: missing id/name/aliases/topic`);
      continue;
    }
    if (seen.has(mod.id)) {
      devWarn(`duplicate topic id "${mod.id}" in ${path} — keeping the first`);
      continue;
    }
    seen.add(mod.id);
    out.push(mod);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** Translation overlays of the curated library, by kind. */
export interface CuratedOverlays {
  studies: StudyOverlay[];
  topics: TopicOverlay[];
}

const OVERLAY_LOCALES = new Set(['pt', 'es', 'fr']);

function isStudyOverlay(value: unknown): value is StudyOverlay {
  const v = value as Partial<StudyOverlay> | undefined;
  return Boolean(v && typeof v.studyId === 'string' && OVERLAY_LOCALES.has(String(v.locale)));
}

function isTopicOverlay(value: unknown): value is TopicOverlay {
  const v = value as Partial<TopicOverlay> | undefined;
  return Boolean(v && typeof v.topicId === 'string' && OVERLAY_LOCALES.has(String(v.locale)));
}

/** Split and validate overlay modules (pure — used for injected fixtures too). */
export function collectOverlays(modules: Record<string, unknown>): CuratedOverlays {
  const out: CuratedOverlays = { studies: [], topics: [] };
  const seen = new Set<string>();
  for (const [path, mod] of Object.entries(modules)) {
    if (isStudyOverlay(mod)) {
      const key = `${mod.locale}:study:${mod.studyId}`;
      if (seen.has(key)) devWarn(`duplicate overlay for study "${mod.studyId}" (${mod.locale}) in ${path} — keeping the first`);
      else out.studies.push(mod);
      seen.add(key);
    } else if (isTopicOverlay(mod)) {
      const key = `${mod.locale}:topic:${mod.topicId}`;
      if (seen.has(key)) devWarn(`duplicate overlay for topic "${mod.topicId}" (${mod.locale}) in ${path} — keeping the first`);
      else out.topics.push(mod);
      seen.add(key);
    } else {
      devWarn(`skipped overlay module ${path}: missing studyId/topicId or locale`);
    }
  }
  return out;
}

/** Every valid translation overlay bundled under src/data/curated/i18n. */
export function loadCuratedOverlays(): CuratedOverlays {
  return collectOverlays(overlayModules);
}
