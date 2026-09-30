import type { Provenance, Study } from '../../../domain/models';
import { translator, type MessageKey } from '../../../i18n/catalog';
import type { Locale } from '../../../i18n/locales';

/** Where in the study a source is cited (dashboard order). */
export type CitationPlace =
  | 'Overview'
  | 'Key passages'
  | 'Original languages'
  | 'Cross-references'
  | 'Context'
  | 'Literary'
  | 'Theology'
  | 'Commentary'
  | 'Sermons'
  | 'Conversation';

export const CITATION_PLACE_ORDER: CitationPlace[] = [
  'Overview',
  'Key passages',
  'Original languages',
  'Cross-references',
  'Context',
  'Literary',
  'Theology',
  'Commentary',
  'Sermons',
  'Conversation',
];

const PLACE_KEY: Record<CitationPlace, MessageKey<'sources'>> = {
  Overview: 'place.overview',
  'Key passages': 'place.keyPassages',
  'Original languages': 'place.originalLanguages',
  'Cross-references': 'place.crossReferences',
  Context: 'place.context',
  Literary: 'place.literary',
  Theology: 'place.theology',
  Commentary: 'place.commentary',
  Sermons: 'place.sermons',
  Conversation: 'place.conversation',
};

/** Name of a place in the study, in the reader's language (the place ids themselves stay English). */
export function citationPlaceLabel(place: CitationPlace, locale: Locale = 'en'): string {
  return translator(locale, 'sources')(PLACE_KEY[place]);
}

export interface SourceUsage {
  /** number of study items (cards, notes, entries) citing the source */
  count: number;
  /** places it is cited, in dashboard order */
  places: CitationPlace[];
}

type Item = { place: CitationPlace; provenances: (Provenance | undefined)[]; sourceIds?: string[] };

/**
 * Scan every provenance in a study (plus commentary/sermon source ids) and count,
 * per source, how many items cite it and where. A source cited twice inside one
 * item counts once.
 */
export function collectSourceUsage(study: Study): Map<string, SourceUsage> {
  const items: Item[] = [];
  const add = (place: CitationPlace, provenances: (Provenance | undefined)[], sourceIds?: string[]) =>
    items.push({ place, provenances, sourceIds });

  add('Overview', [study.summary?.provenance]);
  if (study.topic) {
    add('Key passages', [study.topic.definition.provenance]);
    for (const p of study.topic.keyPassages) add('Key passages', [p.note.provenance]);
  }
  for (const k of study.keyWords) add('Original languages', [k.provenance, k.significance.provenance]);
  for (const x of study.crossReferences) add('Cross-references', [x.explanation.provenance]);
  for (const c of study.context) add('Context', [c.provenance]);
  if (study.literary) {
    const l = study.literary;
    add('Literary', [l.placeInBook.provenance]);
    if (l.argument) add('Literary', [l.argument.provenance]);
    if (l.placeInCanon) add('Literary', [l.placeInCanon.provenance]);
    for (const f of l.features) add('Literary', [f.provenance]);
  }
  for (const t of study.theology) add('Theology', [t.provenance]);
  for (const set of study.perspectives) {
    add('Theology', [set.provenance]);
    for (const p of set.perspectives) add('Theology', [p.provenance]);
  }
  for (const e of study.commentary) add('Commentary', [e.provenance], [e.sourceId]);
  for (const s of study.sermons) add('Sermons', [s.summary?.provenance], [s.sourceId]);
  add('Conversation', [study.opening?.provenance]);
  for (const n of study.verseNotes) add('Conversation', [n.explanation.provenance]);
  for (const c of study.concepts) add('Conversation', [c.answer.provenance]);

  const usage = new Map<string, { count: number; places: Set<CitationPlace> }>();
  for (const item of items) {
    const ids = new Set<string>(item.sourceIds ?? []);
    for (const p of item.provenances) for (const c of p?.citations ?? []) ids.add(c.sourceId);
    for (const id of ids) {
      const u = usage.get(id) ?? { count: 0, places: new Set<CitationPlace>() };
      u.count += 1;
      u.places.add(item.place);
      usage.set(id, u);
    }
  }

  const out = new Map<string, SourceUsage>();
  for (const [id, u] of usage) {
    out.set(id, { count: u.count, places: CITATION_PLACE_ORDER.filter((p) => u.places.has(p)) });
  }
  return out;
}

/** Every source id relevant to the study: the declared list plus anything cited (declared order first). */
export function studySourceIds(study: Study, usage: Map<string, SourceUsage>): string[] {
  const ids = [...study.sourceIds];
  const seen = new Set(ids);
  for (const id of usage.keys()) if (!seen.has(id)) ids.push(id);
  return ids;
}
