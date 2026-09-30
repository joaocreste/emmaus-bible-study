/**
 * Where a source or an author appears inside a study — computed by walking every
 * provenance in the Study (the "claim → source" trail read in reverse).
 */
import type { Citation, Provenance, SectionId, Study } from '../../domain/models';
import { formatRef, formatVerse } from '../../domain/reference';
import { translator } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';

export interface CitationSite {
  section: SectionId;
  /** what cites the source, e.g. "Romans 5:1 — Peace with God" */
  label: string;
  locator?: string;
  /** id of the dashboard item, so the UI can expand/pulse it */
  itemId?: string;
}

function citationsFor(p: Provenance | undefined, sourceId: string): Citation[] {
  return p ? p.citations.filter((c) => c.sourceId === sourceId) : [];
}

/**
 * Every place in the study that cites `sourceId`, in dashboard order, de-duplicated.
 * `authorName` (optional) resolves author ids for commentary/sermon labels; labels and
 * references are written in `locale` (English by default).
 */
export function findCitationSites(
  study: Study,
  sourceId: string,
  authorName: (authorId: string) => string | undefined = () => undefined,
  locale: Locale = 'en',
): CitationSite[] {
  const t = translator(locale, 'inspector');
  const ref = (r: Parameters<typeof formatRef>[0]) => formatRef(r, 'long', locale);
  const sites: CitationSite[] = [];
  const add = (section: SectionId, label: string, p: Provenance | undefined, itemId?: string) => {
    for (const c of citationsFor(p, sourceId)) sites.push({ section, label, itemId, locator: c.locator });
  };

  add('overview', t('site.summary'), study.summary?.provenance);

  if (study.topic) {
    add('key-passages', t('site.definition', { topic: study.topic.name }), study.topic.definition.provenance);
    for (const kp of study.topic.keyPassages) add('key-passages', `${ref(kp.ref)} — ${kp.title}`, kp.note.provenance, kp.id);
  }

  for (const vn of study.verseNotes) add('scripture', t('site.verseNote', { ref: formatVerse(vn.verse, 'long', locale) }), vn.explanation.provenance);

  for (const x of study.crossReferences) {
    add('cross-references', `${ref(x.target)} — ${x.title}`, x.explanation.provenance, x.id);
  }

  for (const kw of study.keyWords) {
    const label = `${kw.english} (${kw.transliteration})`;
    add('original-languages', label, kw.provenance, kw.id);
    add('original-languages', t('site.keyWordWhy', { word: label }), kw.significance.provenance, kw.id);
  }

  for (const c of study.context) add('historical-context', c.title, c.provenance, c.id);

  if (study.literary) {
    const lit = study.literary;
    add('literary-context', t('site.placeInBook'), lit.placeInBook.provenance);
    add('literary-context', t('site.argument'), lit.argument?.provenance);
    add('literary-context', t('site.placeInCanon'), lit.placeInCanon?.provenance);
    for (const f of lit.features) add('literary-context', f.title, f.provenance, f.id);
  }

  for (const t of study.theology) add('theology', t.title, t.provenance, t.id);
  for (const ps of study.perspectives) {
    add('theology', ps.question, ps.provenance, ps.id);
    for (const p of ps.perspectives) add('theology', `${p.tradition}: ${p.label}`, p.provenance, ps.id);
  }

  for (const e of study.commentary) {
    const who = authorName(e.authorId);
    const label = [who, e.lead].filter(Boolean).join(' — ') || t('site.commentaryEntry');
    // Prefer the (usually more precise) provenance citation; fall back to the entry's own source.
    if (citationsFor(e.provenance, sourceId).length > 0) add('commentary', label, e.provenance, e.id);
    else if (e.sourceId === sourceId) sites.push({ section: 'commentary', label, itemId: e.id, locator: e.locator });
  }

  for (const s of study.sermons) {
    const label = t('site.sermon', { title: s.title });
    if (citationsFor(s.summary?.provenance, sourceId).length > 0) add('commentary', label, s.summary?.provenance, s.id);
    else if (s.sourceId === sourceId) sites.push({ section: 'commentary', label, itemId: s.id, locator: s.series });
  }

  const seen = new Set<string>();
  return sites.filter((s) => {
    const k = `${s.section}|${s.label}|${s.locator ?? ''}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export interface AuthorAppearances {
  commentaryIds: string[];
  sermonIds: string[];
  /** perspective sets naming the author as a representative voice */
  perspectiveSetIds: string[];
}

/** Items in the study attributed to an author. */
export function findAuthorAppearances(study: Study, authorId: string): AuthorAppearances {
  return {
    commentaryIds: study.commentary.filter((e) => e.authorId === authorId).map((e) => e.id),
    sermonIds: study.sermons.filter((s) => s.authorId === authorId).map((s) => s.id),
    perspectiveSetIds: study.perspectives
      .filter((ps) => ps.perspectives.some((p) => p.representatives?.includes(authorId)))
      .map((ps) => ps.id),
  };
}
