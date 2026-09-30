/**
 * On-disk formats of the bundled open datasets under `public/data/`.
 *
 * Written by the pipeline (scripts/data/build-all.ts) and read lazily by the
 * local providers. Files are compact JSON (short keys, tuples) because they are
 * fetched per book / per shard at runtime. Keep this module dependency-free: the
 * Node build script imports it through native TypeScript type-stripping.
 *
 * Verse "points" encode a verse as a single integer:
 *   bookOrder * 1_000_000 + chapter * 1_000 + verse   (e.g. ROM 8:1 → 45_008_001)
 * using the canonical order of src/domain/books.ts (GEN = 1 … REV = 66).
 */
import type { TranslationId } from '../../domain/models';

/* ------------------------------------------------------------------ */
/* Scripture: bible/{version id, lowercased}/{BOOK}.json               */
/*   (bsb, kjv, web, blivre, nbv, bpm, rvr1909, blm, vbl, lsg, darby,  */
/*    ncl, ost — see src/domain/translations.ts)                       */
/* ------------------------------------------------------------------ */

export interface BibleVerseExtra {
  /** section heading(s) preceding the verse (several joined with " — ") */
  h?: string;
  /** 1 = the verse starts a paragraph / stanza */
  p?: 1;
  /** poetry: [line text, indent level] — prose parts of mixed verses have indent 0 */
  l?: [string, number][];
  /** translator footnotes attached to the verse */
  f?: string[];
}

/** [verse number, plain text] or [verse number, plain text, extras] */
export type BibleVerseData = [number, string] | [number, string, BibleVerseExtra];

export interface BibleChapterData {
  /** chapter number */
  c: number;
  /** Psalm superscription / Hebrew title ("A Psalm of David.") */
  sup?: string;
  v: BibleVerseData[];
  /**
   * Versification gaps (non-English versions only). Every version is stored with English
   * (KJV/BSB) chapter and verse numbers; English verse numbers of this chapter that have no
   * text of their own in the version are listed here: verse → the verse whose text contains
   * it ("combined", e.g. French Acts 19:40 also holds 19:41 → { "41": 40 }), or 0 when the
   * version does not have the verse at all.
   */
  x?: Record<string, number>;
}

export interface BibleBookFile {
  book: string;
  translation: TranslationId;
  /** chapters in order; `chapters[i].c === i + 1` */
  chapters: BibleChapterData[];
}

/* ------------------------------------------------------------------ */
/* Original text: original/{BOOK}.json                                 */
/* ------------------------------------------------------------------ */

/**
 * One tagged word:
 *   [surface, transliteration, extended Strong's (normalised, e.g. "H3068G"), morphology code, English gloss, flags?]
 * flags: "A" = Aramaic word (TAHOT grammar codes starting with "A").
 */
export type OriginalWordData = [string, string, string, string, string] | [string, string, string, string, string, 'A'];

export interface OriginalBookFile {
  book: string;
  /** default language of the book's words */
  language: 'greek' | 'hebrew';
  sourceId: 'stepbible-tagnt' | 'stepbible-tahot';
  /**
   * chapter → verse → words. Verse keys follow English (KJV/BSB) versification.
   * Verse "0" holds a Psalm title where the Hebrew numbers it as part of verse 1.
   */
  c: Record<string, Record<string, OriginalWordData[]>>;
}

/* ------------------------------------------------------------------ */
/* Lexicon: lexicon/{G|H}/{shard}.json                                 */
/* ------------------------------------------------------------------ */

export interface LexiconEntryData {
  /** extended (disambiguated) Strong's, normalised: "H7462B", "G2631" */
  e: string;
  /** lemma in original script */
  l: string;
  /** transliteration */
  t: string;
  /** STEPBible brief morph, e.g. "G:N-N", "H:V", "N:N-M-P" */
  m?: string;
  /** short gloss */
  g: string;
  /** definition as plain text; lines separated by "\n" */
  d: string;
  /** number of tagged words using this extended tag in the bundled text (sorting aid) */
  n?: number;
}

/** base Strong's ("H7462") → entries, most frequent sense first */
export type LexiconShardFile = Record<string, LexiconEntryData[]>;

/* ------------------------------------------------------------------ */
/* Concordance: concordance/{G|H}/{shard}.json                         */
/* ------------------------------------------------------------------ */

export interface ConcordanceRecord {
  /** verse points in canonical order, one per verse (deduplicated) */
  v: number[];
  /** total tagged words (≥ v.length) */
  w: number;
  /** per-verse word counts, only present when some verse has more than one occurrence */
  k?: number[];
  /** extended suffix → verse points, only present when more than one suffix occurs */
  x?: Record<string, number[]>;
}

/** base Strong's → record */
export type ConcordanceShardFile = Record<string, ConcordanceRecord>;

/* ------------------------------------------------------------------ */
/* Cross references: xrefs/{BOOK}.json                                 */
/* ------------------------------------------------------------------ */

/** chapter → verse → [target refKey ("JHN.3.18-19"), votes][] (best first) */
export type XrefBookFile = Record<string, Record<string, [string, number][]>>;

/* ------------------------------------------------------------------ */
/* Commentary: commentary/{id}/{BOOK}.json                             */
/* ------------------------------------------------------------------ */

/** [startChapter, startVerse, endChapter, endVerse, text] — text uses "\n\n" between paragraphs */
export type CommentarySectionData = [number, number, number, number, string];

export interface CommentaryBookFile {
  book: string;
  commentaryId: string;
  /** sorted by start */
  s: CommentarySectionData[];
}

/* ------------------------------------------------------------------ */
/* Book introductions: intros/{BOOK}.json                              */
/* ------------------------------------------------------------------ */

export interface IntroFile {
  book: string;
  title: string;
  /** full introduction, paragraphs separated by "\n\n" (headings such as "Setting" are their own paragraph) */
  text: string;
  /** "Purpose / Author / Date / Setting" summary, paragraphs separated by "\n\n" */
  summary?: string;
}

/* ------------------------------------------------------------------ */
/* Verse points                                                        */
/* ------------------------------------------------------------------ */

export function encodeVersePoint(bookOrder: number, chapter: number, verse: number): number {
  return bookOrder * 1_000_000 + chapter * 1_000 + verse;
}

export function decodeVersePoint(point: number): { order: number; chapter: number; verse: number } {
  return { order: Math.floor(point / 1_000_000), chapter: Math.floor(point / 1_000) % 1_000, verse: point % 1_000 };
}
