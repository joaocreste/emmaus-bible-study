/**
 * Deep links: `?q=<text>` starts a study on load (e.g. `?q=Romans+8`, `?q=Grace`)
 * and is kept in sync with the open study via history.replaceState, so a study
 * can be bookmarked or shared. `?study=<curated id>` is also accepted on load.
 */
import type { PassageRef, Study } from '../domain/models';
import { formatRef, refContains } from '../domain/reference';

export interface DeepLink {
  q?: string;
  studyId?: string;
}

/** Parse the query string of the current URL. */
export function readDeepLink(search: string): DeepLink {
  const params = new URLSearchParams(search);
  const q = params.get('q')?.trim();
  const studyId = params.get('study')?.trim();
  return { ...(q ? { q: q.slice(0, 200) } : {}), ...(studyId ? { studyId } : {}) };
}

/**
 * The text that re-opens a study when sent to the engine: the passage reference
 * for passage studies ("Romans 8"), the topic name or title otherwise ("Grace").
 * With an `anchor` inside the passage (the verse the opening query asked for),
 * that narrower reference is used instead ("Romans 8:28"), which re-opens the
 * same study at the same verse. A generated page keeps the reader's question.
 */
export function studyQuery(study: Study, anchor?: PassageRef | null): string {
  // A generated page answers the reader's own words: re-asking them recomposes it (or serves the page cache).
  if (study.depth === 'generated' && study.generation?.query.trim()) return study.generation.query.trim();
  if (study.kind === 'passage' && study.passage) {
    try {
      if (anchor && refContains(study.passage, anchor)) return formatRef(anchor);
      return formatRef(study.passage);
    } catch {
      /* unknown book id — fall through to the title */
    }
  }
  return study.topic?.name ?? study.title;
}

/** Build the URL search string for a study (or none), preserving unrelated params. */
export function buildSearch(currentSearch: string, study: Study | null, anchor?: PassageRef | null): string {
  const params = new URLSearchParams(currentSearch);
  params.delete('study');
  if (study) params.set('q', studyQuery(study, anchor));
  else params.delete('q');
  const s = params.toString();
  return s ? `?${s}` : '';
}

/**
 * Replace the current history entry's query string (no navigation, no new entry).
 * `null` removes `q` and `study` (e.g. after "New study", or a deep link that opened nothing).
 */
export function syncDeepLink(study: Study | null, anchor?: PassageRef | null): void {
  try {
    const { pathname, search, hash } = window.location;
    const next = buildSearch(search, study, anchor);
    if (next !== search) window.history.replaceState(window.history.state, '', `${pathname}${next}${hash}`);
  } catch {
    /* sandboxed iframes may forbid replaceState */
  }
}
