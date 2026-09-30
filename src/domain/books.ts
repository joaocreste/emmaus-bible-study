import type { BookId, Testament } from './models';
import type { Locale } from '../i18n/locales';
import { BOOK_NAMES, type NonEnglishLocale } from './bookNames';

export type CanonSection =
  | 'Pentateuch'
  | 'Historical Books'
  | 'Wisdom & Poetry'
  | 'Major Prophets'
  | 'Minor Prophets'
  | 'Gospels'
  | 'Acts'
  | 'Pauline Letters'
  | 'General Letters'
  | 'Apocalyptic';

export type BookGenre =
  | 'law'
  | 'narrative'
  | 'poetry'
  | 'wisdom'
  | 'prophecy'
  | 'gospel'
  | 'letter'
  | 'apocalyptic';

export interface BookInfo {
  id: BookId;
  /** canonical order 1–66 (Protestant canon) */
  order: number;
  name: string;
  /** short display form, e.g. "Rom", "1 Cor" */
  abbrev: string;
  testament: Testament;
  section: CanonSection;
  genre: BookGenre;
  chapters: number;
  /**
   * Traditional attribution — used for filters such as "where else does Paul…".
   * Not a claim about critical scholarship; the study context sections discuss authorship.
   */
  traditionalAuthor: string;
  /** normalized aliases (see normalizeBookToken) */
  aliases: string[];
  /** original language of the book (Daniel/Ezra contain Aramaic sections) */
  language: 'hebrew' | 'greek';
}

type Row = [BookId, string, string, Testament, CanonSection, BookGenre, number, string, string[]];

// prettier-ignore
const ROWS: Row[] = [
  ['GEN', 'Genesis', 'Gen', 'OT', 'Pentateuch', 'narrative', 50, 'Moses', ['gen', 'ge', 'gn']],
  ['EXO', 'Exodus', 'Exod', 'OT', 'Pentateuch', 'narrative', 40, 'Moses', ['exod', 'exo', 'ex']],
  ['LEV', 'Leviticus', 'Lev', 'OT', 'Pentateuch', 'law', 27, 'Moses', ['lev', 'le', 'lv']],
  ['NUM', 'Numbers', 'Num', 'OT', 'Pentateuch', 'narrative', 36, 'Moses', ['num', 'nu', 'nm', 'nb']],
  ['DEU', 'Deuteronomy', 'Deut', 'OT', 'Pentateuch', 'law', 34, 'Moses', ['deut', 'deu', 'de', 'dt']],
  ['JOS', 'Joshua', 'Josh', 'OT', 'Historical Books', 'narrative', 24, 'Joshua', ['josh', 'jos', 'jsh']],
  ['JDG', 'Judges', 'Judg', 'OT', 'Historical Books', 'narrative', 21, 'Anonymous', ['judg', 'jdg', 'jg', 'jdgs']],
  ['RUT', 'Ruth', 'Ruth', 'OT', 'Historical Books', 'narrative', 4, 'Anonymous', ['rut', 'rth', 'ru']],
  ['1SA', '1 Samuel', '1 Sam', 'OT', 'Historical Books', 'narrative', 31, 'Anonymous', ['1sam', '1sa', '1sm', '1s', '1kingdoms']],
  ['2SA', '2 Samuel', '2 Sam', 'OT', 'Historical Books', 'narrative', 24, 'Anonymous', ['2sam', '2sa', '2sm', '2s', '2kingdoms']],
  ['1KI', '1 Kings', '1 Kgs', 'OT', 'Historical Books', 'narrative', 22, 'Anonymous', ['1kgs', '1ki', '1kin', '1k']],
  ['2KI', '2 Kings', '2 Kgs', 'OT', 'Historical Books', 'narrative', 25, 'Anonymous', ['2kgs', '2ki', '2kin', '2k']],
  ['1CH', '1 Chronicles', '1 Chr', 'OT', 'Historical Books', 'narrative', 29, 'Anonymous (the Chronicler)', ['1chr', '1ch', '1chron']],
  ['2CH', '2 Chronicles', '2 Chr', 'OT', 'Historical Books', 'narrative', 36, 'Anonymous (the Chronicler)', ['2chr', '2ch', '2chron']],
  ['EZR', 'Ezra', 'Ezra', 'OT', 'Historical Books', 'narrative', 10, 'Ezra', ['ezr', 'ez']],
  ['NEH', 'Nehemiah', 'Neh', 'OT', 'Historical Books', 'narrative', 13, 'Nehemiah', ['neh', 'ne']],
  ['EST', 'Esther', 'Esth', 'OT', 'Historical Books', 'narrative', 10, 'Anonymous', ['esth', 'est', 'es']],
  ['JOB', 'Job', 'Job', 'OT', 'Wisdom & Poetry', 'wisdom', 42, 'Anonymous', ['jb']],
  ['PSA', 'Psalms', 'Ps', 'OT', 'Wisdom & Poetry', 'poetry', 150, 'David and others', ['psalm', 'ps', 'psa', 'pss', 'psm', 'pslm']],
  ['PRO', 'Proverbs', 'Prov', 'OT', 'Wisdom & Poetry', 'wisdom', 31, 'Solomon and others', ['prov', 'pro', 'prv', 'pr']],
  ['ECC', 'Ecclesiastes', 'Eccl', 'OT', 'Wisdom & Poetry', 'wisdom', 12, 'Qoheleth (the Teacher)', ['eccles', 'eccl', 'ecc', 'ec', 'qoh', 'qoheleth']],
  ['SNG', 'Song of Songs', 'Song', 'OT', 'Wisdom & Poetry', 'poetry', 8, 'Solomon (traditional)', ['songofsolomon', 'song', 'sos', 'sng', 'canticles', 'canticleofcanticles', 'sg']],
  ['ISA', 'Isaiah', 'Isa', 'OT', 'Major Prophets', 'prophecy', 66, 'Isaiah', ['isa', 'is']],
  ['JER', 'Jeremiah', 'Jer', 'OT', 'Major Prophets', 'prophecy', 52, 'Jeremiah', ['jer', 'je', 'jr']],
  ['LAM', 'Lamentations', 'Lam', 'OT', 'Major Prophets', 'poetry', 5, 'Jeremiah (traditional)', ['lam', 'la']],
  ['EZK', 'Ezekiel', 'Ezek', 'OT', 'Major Prophets', 'prophecy', 48, 'Ezekiel', ['ezek', 'eze', 'ezk']],
  ['DAN', 'Daniel', 'Dan', 'OT', 'Major Prophets', 'prophecy', 12, 'Daniel', ['dan', 'da', 'dn']],
  ['HOS', 'Hosea', 'Hos', 'OT', 'Minor Prophets', 'prophecy', 14, 'Hosea', ['hos', 'ho']],
  ['JOL', 'Joel', 'Joel', 'OT', 'Minor Prophets', 'prophecy', 3, 'Joel', ['jol', 'jl', 'joe']],
  ['AMO', 'Amos', 'Amos', 'OT', 'Minor Prophets', 'prophecy', 9, 'Amos', ['amo', 'am']],
  ['OBA', 'Obadiah', 'Obad', 'OT', 'Minor Prophets', 'prophecy', 1, 'Obadiah', ['obad', 'oba', 'ob']],
  ['JON', 'Jonah', 'Jonah', 'OT', 'Minor Prophets', 'narrative', 4, 'Jonah', ['jon', 'jnh']],
  ['MIC', 'Micah', 'Mic', 'OT', 'Minor Prophets', 'prophecy', 7, 'Micah', ['mic', 'mc']],
  ['NAM', 'Nahum', 'Nah', 'OT', 'Minor Prophets', 'prophecy', 3, 'Nahum', ['nah', 'nam', 'na']],
  ['HAB', 'Habakkuk', 'Hab', 'OT', 'Minor Prophets', 'prophecy', 3, 'Habakkuk', ['hab', 'hb']],
  ['ZEP', 'Zephaniah', 'Zeph', 'OT', 'Minor Prophets', 'prophecy', 3, 'Zephaniah', ['zeph', 'zep', 'zp']],
  ['HAG', 'Haggai', 'Hag', 'OT', 'Minor Prophets', 'prophecy', 2, 'Haggai', ['hag', 'hg']],
  ['ZEC', 'Zechariah', 'Zech', 'OT', 'Minor Prophets', 'prophecy', 14, 'Zechariah', ['zech', 'zec', 'zc']],
  ['MAL', 'Malachi', 'Mal', 'OT', 'Minor Prophets', 'prophecy', 4, 'Malachi', ['mal', 'ml']],
  ['MAT', 'Matthew', 'Matt', 'NT', 'Gospels', 'gospel', 28, 'Matthew', ['matt', 'mat', 'mt']],
  ['MRK', 'Mark', 'Mark', 'NT', 'Gospels', 'gospel', 16, 'Mark', ['mrk', 'mk', 'mr', 'mar']],
  ['LUK', 'Luke', 'Luke', 'NT', 'Gospels', 'gospel', 24, 'Luke', ['luk', 'lk', 'lu']],
  ['JHN', 'John', 'John', 'NT', 'Gospels', 'gospel', 21, 'John', ['jhn', 'jn', 'joh']],
  ['ACT', 'Acts', 'Acts', 'NT', 'Acts', 'narrative', 28, 'Luke', ['act', 'ac', 'actsoftheapostles']],
  ['ROM', 'Romans', 'Rom', 'NT', 'Pauline Letters', 'letter', 16, 'Paul', ['rom', 'ro', 'rm']],
  ['1CO', '1 Corinthians', '1 Cor', 'NT', 'Pauline Letters', 'letter', 16, 'Paul', ['1cor', '1co']],
  ['2CO', '2 Corinthians', '2 Cor', 'NT', 'Pauline Letters', 'letter', 13, 'Paul', ['2cor', '2co']],
  ['GAL', 'Galatians', 'Gal', 'NT', 'Pauline Letters', 'letter', 6, 'Paul', ['gal', 'ga']],
  ['EPH', 'Ephesians', 'Eph', 'NT', 'Pauline Letters', 'letter', 6, 'Paul', ['eph', 'ephes']],
  ['PHP', 'Philippians', 'Phil', 'NT', 'Pauline Letters', 'letter', 4, 'Paul', ['phil', 'php', 'pp']],
  ['COL', 'Colossians', 'Col', 'NT', 'Pauline Letters', 'letter', 4, 'Paul', ['col']],
  ['1TH', '1 Thessalonians', '1 Thess', 'NT', 'Pauline Letters', 'letter', 5, 'Paul', ['1thess', '1thes', '1th']],
  ['2TH', '2 Thessalonians', '2 Thess', 'NT', 'Pauline Letters', 'letter', 3, 'Paul', ['2thess', '2thes', '2th']],
  ['1TI', '1 Timothy', '1 Tim', 'NT', 'Pauline Letters', 'letter', 6, 'Paul', ['1tim', '1ti', '1tm']],
  ['2TI', '2 Timothy', '2 Tim', 'NT', 'Pauline Letters', 'letter', 4, 'Paul', ['2tim', '2ti', '2tm']],
  ['TIT', 'Titus', 'Titus', 'NT', 'Pauline Letters', 'letter', 3, 'Paul', ['tit']],
  ['PHM', 'Philemon', 'Phlm', 'NT', 'Pauline Letters', 'letter', 1, 'Paul', ['philem', 'phlm', 'phm', 'pm']],
  ['HEB', 'Hebrews', 'Heb', 'NT', 'General Letters', 'letter', 13, 'Anonymous', ['heb']],
  ['JAS', 'James', 'Jas', 'NT', 'General Letters', 'letter', 5, 'James', ['jas', 'jm']],
  ['1PE', '1 Peter', '1 Pet', 'NT', 'General Letters', 'letter', 5, 'Peter', ['1pet', '1pe', '1pt', '1p']],
  ['2PE', '2 Peter', '2 Pet', 'NT', 'General Letters', 'letter', 3, 'Peter', ['2pet', '2pe', '2pt', '2p']],
  ['1JN', '1 John', '1 John', 'NT', 'General Letters', 'letter', 5, 'John', ['1jn', '1jhn', '1joh', '1j']],
  ['2JN', '2 John', '2 John', 'NT', 'General Letters', 'letter', 1, 'John', ['2jn', '2jhn', '2joh', '2j']],
  ['3JN', '3 John', '3 John', 'NT', 'General Letters', 'letter', 1, 'John', ['3jn', '3jhn', '3joh', '3j']],
  ['JUD', 'Jude', 'Jude', 'NT', 'General Letters', 'letter', 1, 'Jude', ['jud', 'jd']],
  ['REV', 'Revelation', 'Rev', 'NT', 'Apocalyptic', 'apocalyptic', 22, 'John', ['rev', 're', 'revelations', 'apocalypse', 'therevelation', 'revelationofjohn']],
];

/**
 * Normalize a user-typed book token for alias lookup:
 * lowercase, strip punctuation/spaces, convert "i/ii/iii", "first/second/third" prefixes to digits.
 * "1 Cor." → "1cor", "II Samuel" → "2samuel", "First John" → "1john", "Song of Songs" → "songofsongs"
 */
export function normalizeBookToken(token: string): string {
  let t = token
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents: "gênesis" → "genesis", "jó" → "jo"
    .trim()
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ');
  // ordinals in English, Portuguese, Spanish and French: "II Samuel", "Primeira Coríntios", "1ª Coríntios",
  // "Primera de Corintios", "1re Corinthiens", "Deuxième Rois" → "2 …"
  // word and roman-numeral ordinals must be followed by a space ("i samuel", never the "i" of "is 53");
  // digit ordinals may carry a suffix attached to the digit ("1ª", "1re", "2e").
  t = t
    .replace(/^(?:(?:iii|third|3rd|terceir[oa]|tercer[oa]?|troisieme)\s+|3(?:[ªºao]|re|ere|er|e|eme)\s*)(?:de\s+|a\s+)?/, '3 ')
    .replace(/^(?:(?:ii|second|2nd|segund[oa]|deuxieme|seconde?)\s+|2(?:[ªºao]|re|ere|er|e|eme)\s*)(?:de\s+|a\s+)?/, '2 ')
    .replace(/^(?:(?:i|first|1st|primeir[oa]|primer[oa]?|premiere?)\s+|1(?:[ªºao]|re|ere|er|e|eme)\s*)(?:de\s+|a\s+)?/, '1 ');
  return t.replace(/\s+/g, '');
}

/** Lowercased, accent-PRESERVING form (to tell "jó" (Job) from "jo" (João) in Portuguese). */
export function exactBookToken(token: string): string {
  return token.toLowerCase().normalize('NFC').trim().replace(/[.,]/g, ' ').replace(/\s+/g, '');
}

export const BOOKS: BookInfo[] = ROWS.map(([id, name, abbrev, testament, section, genre, chapters, traditionalAuthor, aliases], i) => ({
  id,
  order: i + 1,
  name,
  abbrev,
  testament,
  section,
  genre,
  chapters,
  traditionalAuthor,
  aliases: Array.from(new Set([normalizeBookToken(name), id.toLowerCase(), ...aliases])),
  language: testament === 'NT' ? 'greek' : 'hebrew',
}));

const BY_ID = new Map(BOOKS.map((b) => [b.id, b]));
const BY_ALIAS = new Map<string, BookInfo>();
for (const b of BOOKS) for (const a of b.aliases) if (!BY_ALIAS.has(a)) BY_ALIAS.set(a, b);

export function getBook(id: BookId): BookInfo {
  const b = BY_ID.get(id);
  if (!b) throw new Error(`Unknown book id: ${id}`);
  return b;
}

export function tryGetBook(id: BookId): BookInfo | undefined {
  return BY_ID.get(id);
}

/** Resolve a user-typed book name/abbreviation ("1 Cor", "Psalm", "jn") to a book, or undefined. */
export function findBook(token: string, locale?: Locale): BookInfo | undefined {
  // 1. the reader's language, accent-exact then accent-folded; 2. English; 3. any language
  if (locale && locale !== 'en') {
    const loc = localeAliases(locale);
    const hit = loc.exact.get(exactBookToken(token)) ?? loc.folded.get(normalizeBookToken(token));
    if (hit) return hit;
  }
  const en = BY_ALIAS.get(normalizeBookToken(token));
  if (en) return en;
  // Other languages: only full names and long aliases, so short forms ("At", "So", "He") and
  // common first names ("Lucas", "Tito") written in another language never hijack a lookup.
  for (const l of NON_EN) {
    if (l === locale) continue;
    const hit = localeAliases(l).long.get(normalizeBookToken(token));
    if (hit) return hit;
  }
  return undefined;
}

const NON_EN: NonEnglishLocale[] = ['pt', 'es', 'fr'];

/** Book names that are also common first names — never matched across languages (only in their own). */
const COMMON_FIRST_NAMES = new Set(['lucas', 'marcos', 'mateo', 'mateus', 'tito', 'judas', 'jonas', 'santiago', 'tiago', 'daniel', 'samuel', 'miqueias', 'ester', 'rute', 'rut', 'joao', 'juan', 'jean', 'luc', 'marc', 'jacques', 'jude']);
const LOCALE_ALIAS_CACHE = new Map<NonEnglishLocale, { exact: Map<string, BookInfo>; folded: Map<string, BookInfo>; long: Map<string, BookInfo> }>();

/** Alias maps for one language (built lazily from bookNames.ts). */
export function localeAliases(locale: NonEnglishLocale): { exact: Map<string, BookInfo>; folded: Map<string, BookInfo>; long: Map<string, BookInfo> } {
  let maps = LOCALE_ALIAS_CACHE.get(locale);
  if (maps) return maps;
  maps = { exact: new Map(), folded: new Map(), long: new Map() };
  for (const b of BOOKS) {
    const names = BOOK_NAMES[locale][b.id];
    if (!names) continue;
    for (const form of [names.name, names.abbrev, ...(names.singular ? [names.singular] : []), ...names.aliases]) {
      const exact = exactBookToken(form);
      if (!maps.exact.has(exact)) maps.exact.set(exact, b);
      const folded = normalizeBookToken(form);
      if (!maps.folded.has(folded)) maps.folded.set(folded, b);
      // cross-language lookups: the full name, or an alias long enough not to be a common word
      const isFull = form === names.name || form === names.singular;
      if ((isFull || folded.replace(/^\d/, '').length >= 5) && !maps.long.has(folded) && !COMMON_FIRST_NAMES.has(folded)) maps.long.set(folded, b);
    }
  }
  LOCALE_ALIAS_CACHE.set(locale, maps);
  return maps;
}

/** Display name of a book in a language (English falls back to books.ts). */
export function bookDisplayName(book: BookId, locale: Locale = 'en', style: 'long' | 'short' = 'long'): string {
  const info = getBook(book);
  if (locale !== 'en') {
    const n = BOOK_NAMES[locale][book];
    if (n) return style === 'short' ? n.abbrev : n.name;
  }
  return style === 'short' ? info.abbrev : info.name;
}

/** All normalized aliases, longest first (useful for scanning free text). */
export const BOOK_ALIASES_LONGEST_FIRST: { alias: string; book: BookInfo }[] = Array.from(BY_ALIAS.entries())
  .map(([alias, book]) => ({ alias, book }))
  .sort((a, b) => b.alias.length - a.alias.length);

/** Books by traditional author key (lowercase), e.g. "paul" → ROM…PHM. */
export function booksByAuthor(author: string): BookInfo[] {
  const key = author.toLowerCase();
  return BOOKS.filter((b) => b.traditionalAuthor.toLowerCase() === key);
}

export const PAULINE_BOOKS: BookId[] = booksByAuthor('paul').map((b) => b.id);
