/**
 * Order of the Bible versions in the translation select (pure): the reader's language's versions
 * first (registry order, so its default leads), then every other language's, grouped by language
 * in the language-menu order (English · Português · Español · Français).
 */
import type { TranslationId, TranslationInfo } from '../../domain/models';
import { BIBLE_VERSIONS, getBibleVersion, isTranslationId } from '../../domain/translations';
import { LOCALE_ORDER, type Locale } from '../../i18n/locales';

export type TranslationOption = Pick<TranslationInfo, 'id' | 'name' | 'shortName'>;

/** Language of a translation (registry first; versions unknown to it count as English). */
export function languageOf(id: TranslationId): Locale {
  return isTranslationId(id) ? getBibleVersion(id).language : 'en';
}

export function groupTranslations(list: TranslationOption[], locale: Locale): { own: TranslationOption[]; other: TranslationOption[] } {
  const rank = (t: TranslationOption) => {
    const i = BIBLE_VERSIONS.findIndex((v) => v.id === t.id);
    return i < 0 ? BIBLE_VERSIONS.length : i;
  };
  const byRank = [...list].sort((a, b) => rank(a) - rank(b));
  const own = byRank.filter((t) => languageOf(t.id) === locale);
  const other = LOCALE_ORDER.filter((l) => l !== locale).flatMap((l) => byRank.filter((t) => languageOf(t.id) === l));
  return { own, other };
}
