/**
 * Small, framework-free helpers for presenting original-language data:
 * Strong's number normalisation, BCP-47 language tags and Hebrew display text.
 */
import type { OriginalLanguage } from '../../../domain/models';
import { translate } from '../../../i18n/catalog';
import type { Locale } from '../../../i18n/locales';

/**
 * Canonical Strong's key for comparisons: "G02631" → "G2631", "H0430G" → "H430", "g26" → "G26".
 * Returns the input upper-cased when it does not look like a Strong's number.
 */
export function normalizeStrong(strong: string): string {
  const m = /^\s*([GHgh])0*(\d+)/.exec(strong);
  if (!m) return strong.trim().toUpperCase();
  return `${m[1].toUpperCase()}${m[2]}`;
}

export function sameStrong(a: string, b: string): boolean {
  return normalizeStrong(a) === normalizeStrong(b);
}

/** English language names (interface code uses `languageName(language, locale)`). */
export const LANGUAGE_LABEL: Record<OriginalLanguage, string> = {
  greek: 'Greek',
  hebrew: 'Hebrew',
  aramaic: 'Aramaic',
};

/** "Greek" / "Grego" / "Griego" / "Grec". */
export function languageName(language: OriginalLanguage, locale: Locale = 'en'): string {
  return translate(locale, 'words', `language.${language}`);
}

/** BCP-47 tag for the `lang` attribute (styles in base.css key off these). */
export function langTag(language: OriginalLanguage): 'grc' | 'hbo' | 'arc' {
  return language === 'greek' ? 'grc' : language === 'hebrew' ? 'hbo' : 'arc';
}

export function isRtl(language: OriginalLanguage): boolean {
  return language !== 'greek';
}

/** Where a lexeme's occurrences are counted, in plain English words (the interface uses the 'words' namespace, `corpus.*`). */
export function corpusLabel(language: OriginalLanguage): string {
  if (language === 'greek') return 'the Greek New Testament';
  if (language === 'aramaic') return 'the Aramaic portions of the Old Testament';
  return 'the Hebrew Old Testament';
}

/** Short testament label for compact UI. */
export function testamentShort(language: OriginalLanguage): 'NT' | 'OT' {
  return language === 'greek' ? 'NT' : 'OT';
}

/**
 * Hebrew for reading: keep consonants and vowel points, drop cantillation accents
 * (U+0591–U+05AF), which clutter the text at display sizes (docs/DESIGN.md §2).
 */
export function displayOriginal(text: string, language: OriginalLanguage): string {
  if (language === 'greek') return text;
  return text.replace(/[֑-֯]/g, '');
}

/**
 * Lexicon definitions may arrive with light markup from the source edition.
 * Convert line breaks to newlines and strip any remaining tags, keeping the text verbatim.
 */
export function plainDefinition(definition: string): string[] {
  return definition
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .split(/\n+/)
    .map((p) => p.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);
}
