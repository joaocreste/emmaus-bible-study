/**
 * Canon position computed from src/domain/books.ts (Protestant order, 66 books).
 * Nothing here is curated prose: every statement is derived from the canon table and
 * phrased with the 'literary' namespace templates (canon.*) in the reader's language.
 */
import type { BookId, PassageRef, Testament } from '../../../domain/models';
import { bookDisplayName, BOOKS, getBook, type BookInfo, type CanonSection } from '../../../domain/books';
import { translator, type MessageKey } from '../../../i18n/catalog';
import { LOCALES, type Locale } from '../../../i18n/locales';

/** Message-key slug of each canon section (labels, nouns and phrases live in the 'literary' namespace). */
export const SECTION_SLUG: Record<CanonSection, 'pentateuch' | 'historical' | 'wisdom' | 'majorProphets' | 'minorProphets' | 'gospels' | 'acts' | 'pauline' | 'general' | 'apocalyptic'> = {
  Pentateuch: 'pentateuch',
  'Historical Books': 'historical',
  'Wisdom & Poetry': 'wisdom',
  'Major Prophets': 'majorProphets',
  'Minor Prophets': 'minorProphets',
  Gospels: 'gospels',
  Acts: 'acts',
  'Pauline Letters': 'pauline',
  'General Letters': 'general',
  Apocalyptic: 'apocalyptic',
};

/** Traditional attributions of src/domain/books.ts → their translated names (the attribution itself never changes). */
const AUTHOR_KEY: Record<string, MessageKey<'literary'>> = {
  Moses: 'canon.author.moses',
  Joshua: 'canon.author.joshua',
  Anonymous: 'canon.author.anonymous',
  'Anonymous (the Chronicler)': 'canon.author.anonymousChronicler',
  Ezra: 'canon.author.ezra',
  Nehemiah: 'canon.author.nehemiah',
  'David and others': 'canon.author.davidAndOthers',
  'Solomon and others': 'canon.author.solomonAndOthers',
  'Qoheleth (the Teacher)': 'canon.author.qoheleth',
  'Solomon (traditional)': 'canon.author.solomonTraditional',
  Isaiah: 'canon.author.isaiah',
  Jeremiah: 'canon.author.jeremiah',
  'Jeremiah (traditional)': 'canon.author.jeremiahTraditional',
  Ezekiel: 'canon.author.ezekiel',
  Daniel: 'canon.author.daniel',
  Hosea: 'canon.author.hosea',
  Joel: 'canon.author.joel',
  Amos: 'canon.author.amos',
  Obadiah: 'canon.author.obadiah',
  Jonah: 'canon.author.jonah',
  Micah: 'canon.author.micah',
  Nahum: 'canon.author.nahum',
  Habakkuk: 'canon.author.habakkuk',
  Zephaniah: 'canon.author.zephaniah',
  Haggai: 'canon.author.haggai',
  Zechariah: 'canon.author.zechariah',
  Malachi: 'canon.author.malachi',
  Matthew: 'canon.author.matthew',
  Mark: 'canon.author.mark',
  Luke: 'canon.author.luke',
  John: 'canon.author.john',
  Paul: 'canon.author.paul',
  James: 'canon.author.james',
  Peter: 'canon.author.peter',
  Jude: 'canon.author.jude',
};

/** 1 → "1st", 2 → "2nd", 11 → "11th", 23 → "23rd". */
export function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function testamentBooks(testament: Testament): BookInfo[] {
  return BOOKS.filter((b) => b.testament === testament);
}

/** English name of a testament (non-UI fallback; the UI uses the 'literary' canon templates). */
export function testamentName(testament: Testament): string {
  return testament === 'OT' ? 'Old Testament' : 'New Testament';
}

/** Display label of a canon section in the reader's language ("Pauline Letters", "Cartas Paulinas"). */
export function canonSectionLabel(section: CanonSection, locale: Locale = 'en'): string {
  return translator(locale, 'literary')(`canon.label.${SECTION_SLUG[section]}`);
}

/** Sections of a testament in canonical order, with their books. */
export function canonSections(testament: Testament): { section: CanonSection; books: BookInfo[] }[] {
  const out: { section: CanonSection; books: BookInfo[] }[] = [];
  for (const b of testamentBooks(testament)) {
    const last = out[out.length - 1];
    if (last && last.section === b.section) last.books.push(b);
    else out.push({ section: b.section, books: [b] });
  }
  return out;
}

export interface CanonPosition {
  book: BookInfo;
  /** 1-based position within its testament */
  testamentIndex: number;
  testamentCount: number;
  /** 1-based position within its canon section */
  sectionIndex: number;
  sectionCount: number;
  /** e.g. "Romans is the 6th book of the New Testament, first of the thirteen Pauline letters." */
  sentence: string;
  /** e.g. ["Book 45 of 66 (Protestant order)", "16 chapters", "Traditionally attributed to Paul", "Letter"] */
  facts: string[];
}

/** Describe where a book sits in the canon, computed from the canon table, in the reader's language. */
export function describeCanonPosition(bookId: BookId, locale: Locale = 'en'): CanonPosition {
  const t = translator(locale, 'literary');
  const book = getBook(bookId);
  const inTestament = testamentBooks(book.testament);
  const testamentIndex = inTestament.findIndex((b) => b.id === book.id) + 1;
  const sections = canonSections(book.testament);
  const si = sections.findIndex((s) => s.section === book.section);
  const section = sections[si];
  const sectionIndex = section.books.findIndex((b) => b.id === book.id) + 1;
  const sectionCount = section.books.length;
  const isLastOfTestament = testamentIndex === inTestament.length;
  const phrase = (s: CanonSection) => t(`canon.phrase.${SECTION_SLUG[s]}`);

  const base = {
    book: bookDisplayName(book.id, locale),
    n: testamentIndex,
    ordinal: ordinal(testamentIndex),
    final: isLastOfTestament ? 'yes' : 'no',
    testament: book.testament,
  };
  let sentence: string;
  if (sectionCount > 1) {
    const slug = SECTION_SLUG[book.section];
    const gender = t(`canon.gender.${slug}`);
    const position = t(gender === 'f' ? 'canon.ordinal.f' : 'canon.ordinal.m', {
      n: sectionIndex === sectionCount ? 'last' : sectionIndex,
    });
    sentence = t('canon.sentence.inSection', {
      ...base,
      gender,
      position,
      count: t('canon.count', { n: sectionCount }),
      noun: t(`canon.noun.${slug}`),
    });
  } else {
    const prev = sections[si - 1];
    const next = sections[si + 1];
    if (prev && next) sentence = t('canon.sentence.between', { ...base, prev: phrase(prev.section), next: phrase(next.section) });
    else if (prev && !next) sentence = t('canon.sentence.following', { ...base, prev: phrase(prev.section) });
    else sentence = t('canon.sentence.alone', base);
  }

  const author = book.traditionalAuthor;
  const authorKey = AUTHOR_KEY[author];
  const authorName = authorKey ? t(authorKey) : author;
  const facts = [
    t('canon.fact.order', { order: book.order, total: BOOKS.length }),
    t('canon.fact.chapters', { count: book.chapters }),
    /^anonymous/i.test(author) ? t('canon.fact.attribution', { author: authorName }) : t('canon.fact.attributedTo', { author: authorName }),
    t(`canon.genre.${book.genre}`),
  ];

  return { book, testamentIndex, testamentCount: inTestament.length, sectionIndex, sectionCount, sentence, facts };
}

/**
 * A passage reference relative to its own book, for outlines:
 * whole chapter → "Ch. 8", chapter range → "Chs. 9–11", verses → "8:1–17", "1:18–3:20".
 */
export function formatWithinBook(ref: PassageRef, locale: Locale = 'en'): string {
  const t = translator(locale, 'literary');
  const sep = LOCALES[locale].verseSeparator;
  const c1 = ref.startChapter;
  const c2 = ref.endChapter ?? c1;
  if (ref.startVerse == null) return c2 !== c1 ? t('within.chapters', { from: c1, to: c2 }) : t('within.chapter', { c: c1 });
  const v2 = ref.endVerse;
  if (c2 !== c1) return `${c1}${sep}${ref.startVerse}–${c2}${sep}${v2 ?? 1}`;
  if (v2 == null || v2 === ref.startVerse) return `${c1}${sep}${ref.startVerse}`;
  return `${c1}${sep}${ref.startVerse}–${v2}`;
}
