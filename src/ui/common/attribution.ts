/**
 * Presentation helpers for attribution lines and citation chips — shared by the
 * study (commentary cards, source chips) and the chat (quote captions).
 * Framework-free and unit-tested: they only reformat metadata, never invent it.
 */

import { displayYear as displayYearEn } from '../../domain/attribution';
import { translator } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';

export { authorDisplayName, citationAuthorName, hasAuthorTranslation, localizeAuthor } from '../../domain/attribution';

/**
 * A work's display year without nested parentheses, for use inside "( … )"
 * ("c. 421 (English trans. 1887)" → "c. 421; English trans. 1887"), with its English
 * metadata words in the reader's language ("c. 421; trad. inglesa 1887").
 */
export function displayYear(year: string | undefined, locale: Locale = 'en'): string | undefined {
  const y = displayYearEn(year);
  return y && localizeYear(y, locale);
}

/**
 * The few English words that source years carry — "c.", "English trans.", "4th century" —
 * in the reader's language. Digits, names and everything else are left exactly as recorded.
 */
export function localizeYear(year: string, locale: Locale = 'en'): string {
  if (locale === 'en') return year;
  const t = translator(locale, 'sources');
  return year
    .replace(/\bEnglish trans\./g, t('year.englishTrans'))
    .replace(/(^|[\s(;])c\.(?=\s*\d)/g, (_m, pre: string) => `${pre}${t('year.circa')}`)
    .replace(/\b(\d{1,2})(?:st|nd|rd|th) century\b/g, (_m, n: string) => t('year.century', { n: Number(n), roman: roman(Number(n)) }));
}

function roman(n: number): string {
  const table: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let out = '';
  let rest = n;
  for (const [v, sym] of table) {
    while (rest >= v) {
      out += sym;
      rest -= v;
    }
  }
  return out;
}

/**
 * A citation locator without the work's title or year repeated at its start
 * ("The Treasury of David, Psalm 23, Exposition, v1" → "Psalm 23, Exposition, v1";
 * "Enchiridion, ch. 11" with the title "Enchiridion (Handbook on Faith, Hope and Love)"
 * → "ch. 11"). Returns undefined when nothing is left.
 */
export function cleanLocator(locator: string | undefined, work?: { title?: string; year?: string }): string | undefined {
  let l = locator?.trim();
  if (!l) return undefined;
  const title = work?.title?.trim();
  if (title) {
    const short = title.split(/\s*[(:—–]/)[0].trim();
    for (const t of short !== title && short.length >= 6 ? [title, short] : [title]) {
      const re = new RegExp(`^[“"‘']?${escapeRegExp(t)}[,.;:]?[”"’']?(?=$|[\\s,;:·–—-])`, 'i');
      if (re.test(l)) {
        l = l.replace(re, '');
        break;
      }
    }
  }
  const year = work?.year?.trim();
  if (year) {
    l = l.replace(`(${year})`, '');
    const plain = year.replace(/\s*\(.*\)\s*/g, '').trim();
    if (plain && plain !== year) l = l.replace(`(${plain})`, '');
  }
  l = l.replace(/^[\s,;:·–—-]+|[\s,;:·–—-]+$/g, '').trim();
  return l || undefined;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
