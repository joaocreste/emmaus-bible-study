import type { PassageRef, VerseRef } from './models';
import { BOOKS, findBook, getBook, tryGetBook } from './books';
import { BOOK_NAMES } from './bookNames';
import { LOCALES, type Locale } from '../i18n/locales';

/* ------------------------------------------------------------------ */
/* Keys                                                                */
/* ------------------------------------------------------------------ */

/** "ROM.8.1" */
export function verseKey(v: VerseRef): string {
  return `${v.book}.${v.chapter}.${v.verse}`;
}

export function parseVerseKey(key: string): VerseRef | null {
  const m = /^([1-3]?[A-Z]{2,3})\.(\d+)\.(\d+)$/.exec(key.trim());
  if (!m || !tryGetBook(m[1])) return null;
  return { book: m[1], chapter: Number(m[2]), verse: Number(m[3]) };
}

/**
 * Compact, URL-safe key for a passage:
 *   ROM.8        whole chapter
 *   ROM.8.1-4    verse range in one chapter
 *   ROM.8.28     single verse
 *   MAT.5-7      chapter range
 *   JHN.1.1-2.11 cross-chapter verse range
 *   GEN          whole book
 */
export function refKey(ref: PassageRef): string {
  const { book, startChapter: c1, startVerse: v1, endChapter, endVerse: v2 } = ref;
  const c2 = endChapter ?? c1;
  if (isWholeBook(ref)) return book;
  if (v1 == null) return c2 !== c1 ? `${book}.${c1}-${c2}` : `${book}.${c1}`;
  if (c2 !== c1) return `${book}.${c1}.${v1}-${c2}.${v2 ?? 1}`;
  if (v2 == null || v2 === v1) return `${book}.${c1}.${v1}`;
  return `${book}.${c1}.${v1}-${v2}`;
}

export function parseRefKey(key: string): PassageRef | null {
  const k = key.trim();
  let m = /^([1-3]?[A-Z]{2,3})$/.exec(k);
  if (m && tryGetBook(m[1])) return wholeBook(m[1]);
  m = /^([1-3]?[A-Z]{2,3})\.(\d+)(?:-(\d+))?$/.exec(k);
  if (m && tryGetBook(m[1])) {
    return { book: m[1], startChapter: +m[2], ...(m[3] ? { endChapter: +m[3] } : {}) };
  }
  m = /^([1-3]?[A-Z]{2,3})\.(\d+)\.(\d+)(?:-(\d+)(?:\.(\d+))?)?$/.exec(k);
  if (m && tryGetBook(m[1])) {
    const [, book, c1, v1, a, b] = m;
    if (a && b) return { book, startChapter: +c1, startVerse: +v1, endChapter: +a, endVerse: +b };
    return { book, startChapter: +c1, startVerse: +v1, endChapter: +c1, endVerse: a ? +a : +v1 };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Constructors & predicates                                           */
/* ------------------------------------------------------------------ */

export function wholeBook(book: string): PassageRef {
  const info = getBook(book);
  return { book, startChapter: 1, endChapter: info.chapters };
}

export function chapterRef(book: string, chapter: number): PassageRef {
  return { book, startChapter: chapter };
}

export function verseRef(book: string, chapter: number, verse: number): VerseRef {
  return { book, chapter, verse };
}

export function verseToPassage(v: VerseRef): PassageRef {
  return { book: v.book, startChapter: v.chapter, startVerse: v.verse, endChapter: v.chapter, endVerse: v.verse };
}

export function isWholeBook(ref: PassageRef): boolean {
  const info = tryGetBook(ref.book);
  if (!info) return false;
  return ref.startChapter === 1 && ref.startVerse == null && ref.endVerse == null && (ref.endChapter ?? 1) === info.chapters;
}

/** Chapters spanned by the reference, inclusive. */
export function chaptersOf(ref: PassageRef): number[] {
  const end = ref.endChapter ?? ref.startChapter;
  const out: number[] = [];
  for (let c = ref.startChapter; c <= end; c++) out.push(c);
  return out;
}

/** Does the passage include this verse? (Open-ended chapter refs include every verse of the chapter.) */
export function refIncludesVerse(ref: PassageRef, v: VerseRef): boolean {
  if (ref.book !== v.book) return false;
  const endC = ref.endChapter ?? ref.startChapter;
  if (v.chapter < ref.startChapter || v.chapter > endC) return false;
  if (v.chapter === ref.startChapter && ref.startVerse != null && v.verse < ref.startVerse) return false;
  if (v.chapter === endC && ref.endVerse != null && v.verse > ref.endVerse) return false;
  // single-chapter ref with startVerse but no endVerse == single verse
  if (ref.startVerse != null && ref.endVerse == null && ref.endChapter == null) return v.verse === ref.startVerse;
  return true;
}

function toPoint(book: string, c: number, v: number): number {
  return getBook(book).order * 1_000_000 + c * 1000 + v;
}

function bounds(ref: PassageRef): [number, number] {
  const endC = ref.endChapter ?? ref.startChapter;
  const startV = ref.startVerse ?? 0;
  let endV = ref.endVerse ?? 999;
  if (ref.startVerse != null && ref.endVerse == null && ref.endChapter == null) endV = ref.startVerse;
  return [toPoint(ref.book, ref.startChapter, startV), toPoint(ref.book, endC, endV)];
}

export function refsOverlap(a: PassageRef, b: PassageRef): boolean {
  if (a.book !== b.book) return false;
  const [a1, a2] = bounds(a);
  const [b1, b2] = bounds(b);
  return a1 <= b2 && b1 <= a2;
}

/** Is `inner` entirely inside `outer`? */
export function refContains(outer: PassageRef, inner: PassageRef): boolean {
  if (outer.book !== inner.book) return false;
  const [o1, o2] = bounds(outer);
  const [i1, i2] = bounds(inner);
  return o1 <= i1 && i2 <= o2;
}

/** Canonical sort comparator. */
export function compareRefs(a: PassageRef, b: PassageRef): number {
  return bounds(a)[0] - bounds(b)[0];
}

export function sameVerse(a: VerseRef, b: VerseRef): boolean {
  return a.book === b.book && a.chapter === b.chapter && a.verse === b.verse;
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

const DASH = '–'; // en dash

/**
 * "Romans 8:1–4", "Matthew 5–7", "John 1:1–2:11", "Genesis", "Psalm 23" (singular for one psalm).
 * Localized: "Romanos 8:1–4" (pt/es), "Romains 8.1–4" (fr uses a dot between chapter and verse).
 */
export function formatRef(ref: PassageRef, style: 'long' | 'short' = 'long', locale: Locale = 'en'): string {
  const info = getBook(ref.book);
  const loc = locale === 'en' ? undefined : BOOK_NAMES[locale][ref.book];
  let name = style === 'short' ? (loc?.abbrev ?? info.abbrev) : (loc?.name ?? info.name);
  if (ref.book === 'PSA' && style === 'long' && (ref.endChapter ?? ref.startChapter) === ref.startChapter) name = loc?.singular ?? (loc ? name : 'Psalm');
  if (isWholeBook(ref)) return loc?.name ?? info.name;
  const sep = LOCALES[locale].verseSeparator;
  if (info.chapters === 1 && ref.startChapter === 1) {
    // Single-chapter books are cited by verse: "Jude 3", "Philemon 4–6"
    if (ref.startVerse == null) return name;
    if (ref.endVerse == null || ref.endVerse === ref.startVerse) return `${name} ${ref.startVerse}`;
    return `${name} ${ref.startVerse}${DASH}${ref.endVerse}`;
  }
  const c1 = ref.startChapter;
  const c2 = ref.endChapter ?? c1;
  if (ref.startVerse == null) return c2 !== c1 ? `${name} ${c1}${DASH}${c2}` : `${name} ${c1}`;
  if (c2 !== c1) return `${name} ${c1}${sep}${ref.startVerse}${DASH}${c2}${sep}${ref.endVerse ?? 1}`;
  if (ref.endVerse == null || ref.endVerse === ref.startVerse) return `${name} ${c1}${sep}${ref.startVerse}`;
  return `${name} ${c1}${sep}${ref.startVerse}${DASH}${ref.endVerse}`;
}

export function formatVerse(v: VerseRef, style: 'long' | 'short' = 'long', locale: Locale = 'en'): string {
  return formatRef(verseToPassage(v), style, locale);
}

/* ------------------------------------------------------------------ */
/* Parsing user input                                                  */
/* ------------------------------------------------------------------ */

function normalizeInput(s: string): string {
  return s
    .replace(/[‐-―−]/g, '-') // dashes → hyphen
    .replace(/\s+/g, ' ')
    .trim();
}

function buildRef(
  book: string,
  c1s: string | undefined,
  v1s: string | undefined,
  c2s: string | undefined,
  v2s: string | undefined,
): PassageRef | null {
  const info = getBook(book);
  if (!c1s) return wholeBook(book);
  let c1 = Number(c1s);
  let v1 = v1s != null ? Number(v1s) : undefined;
  // Single-chapter books: "Jude 3" means verse 3
  if (info.chapters === 1 && v1 == null && c1 > 1) {
    v1 = c1;
    c1 = 1;
    const v2 = c2s ? Number(c2s) : v1;
    return { book, startChapter: 1, startVerse: v1, endChapter: 1, endVerse: Math.max(v1, v2) };
  }
  if (c1 < 1 || c1 > info.chapters) return null;
  if (v1 == null) {
    if (c2s) {
      const c2 = Math.min(Number(c2s), info.chapters);
      if (c2 < c1) return null;
      return c2 === c1 ? { book, startChapter: c1 } : { book, startChapter: c1, endChapter: c2 };
    }
    return { book, startChapter: c1 };
  }
  if (v1 < 1) return null;
  if (c2s != null && v2s != null) {
    const c2 = Number(c2s);
    const v2 = Number(v2s);
    if (c2 < c1 || c2 > info.chapters) return null;
    return { book, startChapter: c1, startVerse: v1, endChapter: c2, endVerse: v2 };
  }
  if (v2s != null) {
    const v2 = Number(v2s);
    if (v2 < v1) return null;
    return { book, startChapter: c1, startVerse: v1, endChapter: c1, endVerse: v2 };
  }
  return { book, startChapter: c1, startVerse: v1, endChapter: c1, endVerse: v1 };
}

// book part: optional numeric/ordinal prefix + one to four words
/** ordinal prefix in English, Portuguese, Spanish, French ("1", "II", "First", "1ª", "Primera de", "1re", "Deuxième") */
const ORDINAL = String.raw`(?:[1-3](?:\s*(?:[ªºa]|re|er|ère|e|ème|eme))?|i{1,3}|first|second|third|primeir[oa]|segund[oa]|terceir[oa]|primer[oa]?|tercer[oa]?|premi[eè]re?|deuxi[eè]me|troisi[eè]me|seconde?)(?:\s+de)?`;
const BOOK_PART = String.raw`(${ORDINAL}\s*)?(\p{L}[\p{L}.'’]*(?:\s+\p{L}[\p{L}.'’]*){0,4}?)`;
const NUM_PART = String.raw`\s*(\d{1,3})(?:\s*[:.]\s*(\d{1,3}))?(?:\s*-\s*(\d{1,3})(?:\s*[:.]\s*(\d{1,3}))?)?`;

const STRICT_RE = new RegExp(`^${BOOK_PART}(?:${NUM_PART})?$`, 'iu');

/** leading request verbs in the four languages ("study Romans 8", "estudar Romanos 8", "étudier Romains 8") */
const LEADING_VERBS =
  /^(let'?s\s+)?(study|open|read|show(\s+me)?|go\s+to|look\s+at|explore|quero\s+estudar|estudar|abrir|abra|ler|leia|mostre(-me)?|mostrar|ver|estudiar|estudia|leer|lee|abre|mu[eé]strame|mostrar|[eé]tudier|[eé]tudie|ouvrir|ouvre|lire|lis|montre(-moi)?|voir)\s+/iu;
const LEADING_ARTICLES = /^(the\s+(book\s+of\s+)?|o\s+livro\s+de\s+|livro\s+de\s+|el\s+libro\s+de\s+|libro\s+de\s+|le\s+livre\s+(de|d['’])\s*|livre\s+(de|d['’])\s*)/iu;

/**
 * Parse a string that IS a reference: "John 1:1", "Romans 8", "Matthew 5–7",
 * "Genesis", "Psalm 23", "1 Cor 13:4-7", "Rom 8.28", "John 1:1–2:11".
 * Leading study verbs ("study", "open", "read", "show me") are ignored.
 */
/**
 * Many French, Portuguese and Spanish Bibles write chapter and verse with a comma ("Rm 8,28").
 * Outside English, "8,28" between two small numbers is read as chapter 8, verse 28.
 */
function commaVerses(input: string, locale: Locale | undefined): string {
  return locale && locale !== 'en' ? input.replace(/(\d{1,3}),(\d{1,3})(?!\d)/g, '$1:$2') : input;
}

export function parseReference(input: string, options: { locale?: Locale } = {}): PassageRef | null {
  let s = normalizeInput(commaVerses(input, options.locale)).replace(LEADING_VERBS, '').replace(/[?!¿¡]+/g, '').trim();
  s = s.replace(LEADING_ARTICLES, '');
  const m = STRICT_RE.exec(s);
  if (!m) return null;
  const [, prefix, name, c1, v1, x, y] = m;
  const book = findBook(`${prefix ?? ''}${name}`, options.locale);
  if (!book) return null;
  // Disambiguate "c1-x" (chapter range) vs "c1:v1-x" (verse range) vs "c1:v1-x:y" (cross-chapter)
  if (v1 == null) return buildRef(book.id, c1, undefined, x, undefined);
  if (x != null && y != null) return buildRef(book.id, c1, v1, x, y);
  return buildRef(book.id, c1, v1, undefined, x);
}

export interface FoundReference {
  ref: PassageRef;
  /** the substring that matched */
  match: string;
  index: number;
}

const SCAN_RE = new RegExp(
  String.raw`(?<![\p{L}\d])(${ORDINAL}\s*)?(\p{L}[\p{L}.'’]*(?:\s+(?:of\s+|de\s+|des\s+|dos\s+|los\s+)?\p{L}+){0,2})` + NUM_PART + String.raw`(?![\p{L}\d])`,
  'giu',
);

/**
 * Find references embedded in free text, e.g. "How does this connect with Romans 5:1?".
 * Requires a chapter number (so "is", "am", "acts" in prose do not match). Whole-book
 * mentions without numbers are handled by `findBookMention`.
 */
export function findReferences(text: string, options: { locale?: Locale } = {}): FoundReference[] {
  const s = normalizeInput(commaVerses(text, options.locale));
  const out: FoundReference[] = [];
  SCAN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = SCAN_RE.exec(s))) {
    const [full, prefix, namePart, c1, v1, x, y] = m;
    const words = namePart.trim().split(/\s+/);
    let resolved = false;
    // try longest suffix of words that resolves to a book ("study romans" → "romans")
    for (let i = 0; i < words.length; i++) {
      const candidate = words.slice(i).join(' ');
      const withPrefix = i === 0 && prefix ? `${prefix}${candidate}` : candidate;
      const book = findBook(withPrefix, options.locale);
      if (!book) continue;
      // avoid short-alias false positives in prose ("is 3", "am 2") unless capitalised or it is a full name
      const raw = withPrefix.replace(/\s+/g, '');
      const isShort = raw.length <= 2 && !/^[1-3]/.test(raw);
      if (isShort && !/^\p{Lu}/u.test(words[i])) continue;
      let ref: PassageRef | null;
      if (v1 == null) ref = buildRef(book.id, c1, undefined, x, undefined);
      else if (x != null && y != null) ref = buildRef(book.id, c1, v1, x, y);
      else ref = buildRef(book.id, c1, v1, undefined, x);
      if (ref) {
        const offset = full.indexOf(words[i]);
        const start = i === 0 && prefix ? m.index : m.index + offset;
        out.push({ ref, match: s.slice(start, m.index + full.length).trim(), index: start });
        resolved = true;
      }
      break;
    }
    // Nothing resolved: rescan from the next word so a consumed number prefix ("and 1 John") is not lost.
    if (!resolved) {
      const firstSpace = full.search(/\s/);
      SCAN_RE.lastIndex = m.index + (firstSpace > 0 ? firstSpace : 1);
    }
  }
  return out;
}

/**
 * Detect a whole-book mention using the book's full name only ("Genesis", "the book of Romans").
 * Returns the first match. Used when a message is essentially a request to study a book.
 */
export function findBookMention(text: string, locale?: Locale): { book: string; index: number } | null {
  const s = ` ${fold(normalizeInput(text))} `;
  let best: { book: string; index: number } | null = null;
  // English (or unknown) text: English names only — "Lucas", "Judas", "Tito" are first names in English prose.
  const locales: Exclude<Locale, 'en'>[] = locale && locale !== 'en' ? [locale] : [];
  for (const b of BOOKS) {
    const names = [b.name];
    if (b.id === 'PSA') names.push('psalm');
    if (b.id === 'SNG') names.push('song of solomon');
    for (const l of locales) {
      const n = BOOK_NAMES[l][b.id];
      if (n) names.push(n.name, ...(n.singular ? [n.singular] : []));
    }
    for (const raw of names) {
      const n = fold(raw);
      if (n.length < 3) continue;
      const i = s.search(new RegExp(`[^\\p{L}\\d]${escapeRe(n).replace(/ /g, '\\s+')}[^\\p{L}]`, 'u'));
      if (i >= 0 && (!best || i < best.index)) best = { book: b.id, index: i };
    }
  }
  return best;
}

/** lowercase + strip accents, keeping spaces (for whole-name matching) */
function fold(t: string): string {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeRe(t: string): string {
  return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
