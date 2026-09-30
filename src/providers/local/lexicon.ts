/**
 * LexiconProvider over STEPBible TBESG/TBESH (public/data/lexicon) and the
 * concordance derived from the tagged texts (public/data/concordance).
 * Lookups accept any Strong's spelling; see ./strong.ts for the normalisation rule.
 */
import { BOOKS } from '../../domain/books';
import type { OriginalLanguage, VerseRef } from '../../domain/models';
import type { LexiconProvider } from '../types';
import { decodeVersePoint, type ConcordanceShardFile, type LexiconEntryData, type LexiconShardFile } from './formats';
import type { DataLoader } from './loader';
import { describeLexiconMorph } from './morphology';
import { normalizeStrong, strongShardPath, type NormalizedStrong } from './strong';
import type { LocalLexiconEntry, LocalOccurrences } from './types';

const SOURCE: Record<'G' | 'H', { lexicon: string; text: string }> = {
  G: { lexicon: 'stepbible-tbesg', text: 'stepbible-tagnt' },
  H: { lexicon: 'stepbible-tbesh', text: 'stepbible-tahot' },
};

function languageOf(n: NormalizedStrong, morph: string | undefined): OriginalLanguage {
  if (n.language === 'G') return 'greek';
  return morph?.startsWith('A:') ? 'aramaic' : 'hebrew';
}

function toEntry(n: NormalizedStrong, data: LexiconEntryData, all: LexiconEntryData[]): LocalLexiconEntry {
  const entry: LocalLexiconEntry = {
    strong: n.base,
    extendedStrong: data.e,
    language: languageOf(n, data.m),
    lemma: data.l,
    transliteration: data.t,
    gloss: data.g,
    definition: data.d,
    sourceId: SOURCE[n.language].lexicon,
  };
  const pos = describeLexiconMorph(data.m);
  if (pos) entry.partOfSpeech = pos;
  if (data.m) entry.morph = data.m;
  if (data.n) entry.frequency = data.n;
  const others = all.filter((x) => x.e !== data.e);
  if (others.length) entry.otherSenses = others.map((x) => ({ extendedStrong: x.e, lemma: x.l, gloss: x.g }));
  return entry;
}

function pointToRef(point: number): VerseRef | null {
  const { order, chapter, verse } = decodeVersePoint(point);
  const book = BOOKS[order - 1];
  return book ? { book: book.id, chapter, verse } : null;
}

export class LocalLexiconProvider implements LexiconProvider {
  readonly id = 'local:lexicon';
  private readonly loader: DataLoader;

  constructor(loader: DataLoader) {
    this.loader = loader;
  }

  /**
   * "G2631", "H7462", "H0430G", "h7462b"… An extended tag ("H7462B") returns that
   * exact sense; a classic number ("H7462") returns its most frequent sense in the
   * bundled text (other senses are listed in `otherSenses`). Null when unknown.
   */
  async getEntry(strong: string): Promise<LocalLexiconEntry | null> {
    const n = normalizeStrong(strong);
    if (!n) return null;
    const shard = await this.loader.json<LexiconShardFile>(strongShardPath('lexicon', n));
    const entries = shard?.[n.base];
    if (!entries?.length) return null;
    const exact = n.suffix ? entries.find((e) => e.e === n.extended) : undefined;
    // An unknown suffix falls back to the primary sense of the same Strong's number.
    return toEntry(n, exact ?? entries[0], entries);
  }

  /** Entries keyed by the strings passed in (missing ones are omitted). */
  async getEntries(strongs: string[]): Promise<Map<string, LocalLexiconEntry>> {
    const results = await Promise.all(strongs.map(async (s) => [s, await this.getEntry(s)] as const));
    const map = new Map<string, LocalLexiconEntry>();
    for (const [s, e] of results) if (e) map.set(s, e);
    return map;
  }

  /**
   * Verses where the lemma occurs in the tagged text, canonical order, one per verse.
   * A classic number counts every sense; an extended tag ("H7462B") only that sense.
   * `total` is the number of verses; `wordCount` the number of tagged words.
   */
  async getOccurrences(strong: string, limit?: number): Promise<LocalOccurrences | null> {
    const n = normalizeStrong(strong);
    if (!n) return null;
    const shard = await this.loader.json<ConcordanceShardFile>(strongShardPath('concordance', n));
    const rec = shard?.[n.base];
    if (!rec) return null;
    let points = rec.v;
    let wordCount = rec.w;
    if (n.suffix && rec.x) {
      points = rec.x[n.suffix] ?? [];
      const counts = new Map(rec.v.map((p, i) => [p, rec.k?.[i] ?? 1]));
      wordCount = points.reduce((sum, p) => sum + (counts.get(p) ?? 1), 0);
    }
    const slice = limit != null && limit >= 0 ? points.slice(0, limit) : points;
    return {
      strong: n.suffix && rec.x ? n.extended : n.base,
      total: points.length,
      wordCount,
      refs: slice.map(pointToRef).filter((r): r is VerseRef => r !== null),
      sourceId: SOURCE[n.language].text,
    };
  }
}
