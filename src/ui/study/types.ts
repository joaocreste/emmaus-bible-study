import { createElement, Fragment, type ReactNode } from 'react';
import type { CanonSection, BookGenre } from '../../domain/books';
import type { SectionId, Study } from '../../domain/models';
import { translate, type MessageKey } from '../../i18n/catalog';
import { useI18n } from '../../i18n/I18nProvider';
import type { Locale } from '../../i18n/locales';

/** Props every dashboard section component receives from StudyWorkspace. */
export interface SectionProps {
  study: Study;
  /** 1-based position among the visible sections (rendered as a roman numeral) */
  index: number;
}

export interface SectionMeta {
  id: SectionId;
  title: string;
  /** short label for the navigation pills */
  navLabel: string;
  description: string;
}

/** Every dashboard section id, in default order. */
export const SECTION_IDS: readonly SectionId[] = [
  'overview',
  'scripture',
  'key-passages',
  'cross-references',
  'original-languages',
  'historical-context',
  'literary-context',
  'theology',
  'commentary',
  'sources',
];

/**
 * A section's title, navigation label and description in a language. Titles and descriptions
 * live in the 'study' namespace (`section.<id>.title|description`); navigation labels are the
 * shared short labels of the 'common' namespace (`section.<id>`).
 */
export function sectionMeta(id: SectionId, locale: Locale = 'en'): SectionMeta {
  return {
    id,
    title: translate(locale, 'study', `section.${id}.title`),
    navLabel: translate(locale, 'common', `section.${id}`),
    description: translate(locale, 'study', `section.${id}.description`),
  };
}

/** Section metadata in the reader's language. */
export function useSectionMeta(): (id: SectionId) => SectionMeta {
  const { locale } = useI18n();
  return (id) => sectionMeta(id, locale);
}

/**
 * English section metadata — for code outside React that has no locale. Interface code should
 * use `useSectionMeta()` / `sectionMeta(id, locale)` (or `t('section.<id>')` from 'common').
 */
export const SECTION_META: Record<SectionId, SectionMeta> = Object.fromEntries(
  SECTION_IDS.map((id) => [id, sectionMeta(id, 'en')]),
) as Record<SectionId, SectionMeta>;

export function sectionDomId(id: SectionId): string {
  return `section-${id}`;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

/* ---------- canon sections, genres and traditional authors in the reader's language ---------- */

const CANON_KEY: Record<CanonSection, MessageKey<'study'>> = {
  Pentateuch: 'canon.pentateuch',
  'Historical Books': 'canon.historical',
  'Wisdom & Poetry': 'canon.wisdom',
  'Major Prophets': 'canon.majorProphets',
  'Minor Prophets': 'canon.minorProphets',
  Gospels: 'canon.gospels',
  Acts: 'canon.acts',
  'Pauline Letters': 'canon.pauline',
  'General Letters': 'canon.general',
  Apocalyptic: 'canon.apocalyptic',
};

/** "Pauline Letters" → "Cartas paulinas" / "Épîtres pauliniennes". */
export function canonSectionName(section: CanonSection, locale: Locale): string {
  return translate(locale, 'study', CANON_KEY[section]);
}

/** "letter" → "Letter" / "Carta" / "Épître". */
export function genreName(genre: BookGenre, locale: Locale): string {
  return translate(locale, 'study', `genre.${genre}`);
}

/** Traditional attributions as written in books.ts → message keys. */
const AUTHOR_KEY: Record<string, MessageKey<'study'>> = {
  moses: 'author.moses',
  joshua: 'author.joshua',
  anonymous: 'author.anonymous',
  'anonymous (the chronicler)': 'author.chronicler',
  ezra: 'author.ezra',
  nehemiah: 'author.nehemiah',
  'david and others': 'author.davidOthers',
  'solomon and others': 'author.solomonOthers',
  'qoheleth (the teacher)': 'author.qoheleth',
  'solomon (traditional)': 'author.solomonTraditional',
  isaiah: 'author.isaiah',
  jeremiah: 'author.jeremiah',
  'jeremiah (traditional)': 'author.jeremiahTraditional',
  ezekiel: 'author.ezekiel',
  daniel: 'author.daniel',
  hosea: 'author.hosea',
  joel: 'author.joel',
  amos: 'author.amos',
  obadiah: 'author.obadiah',
  jonah: 'author.jonah',
  micah: 'author.micah',
  nahum: 'author.nahum',
  habakkuk: 'author.habakkuk',
  zephaniah: 'author.zephaniah',
  haggai: 'author.haggai',
  zechariah: 'author.zechariah',
  malachi: 'author.malachi',
  matthew: 'author.matthew',
  mark: 'author.mark',
  luke: 'author.luke',
  john: 'author.john',
  paul: 'author.paul',
  james: 'author.james',
  peter: 'author.peter',
  jude: 'author.jude',
};

/**
 * A book's traditional author (books.ts, English — also the cross-reference filter value)
 * in the reader's language: "Paul" → "Paulo" / "Pablo". Unknown names are shown as given.
 */
export function traditionalAuthorName(author: string, locale: Locale): string {
  const key = AUTHOR_KEY[author.trim().toLowerCase()];
  return key ? translate(locale, 'study', key) : author;
}

/* ---------- sentences with markup inside them ---------- */

const SLOT_MARK = '\u0000';

/** Placeholder value for a translated sentence that wraps part of it in markup (see fillSlots). */
export function slot(name: string): string {
  return `${SLOT_MARK}${name}${SLOT_MARK}`;
}

/**
 * Render a whole translated sentence whose placeholders were filled with `slot(name)`, putting
 * each slot's node in its place: `fillSlots(t('filter.filtered', { label: slot('l') }), { l: <strong>…</strong> })`.
 * Word order stays with the translation.
 */
export function fillSlots(text: string, nodes: Record<string, ReactNode>): ReactNode[] {
  return text.split(SLOT_MARK).map((part, i) => (i % 2 === 1 ? createElement(Fragment, { key: i }, nodes[part]) : part));
}
