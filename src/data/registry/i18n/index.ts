/**
 * Author names, traditions, descriptions and lifespans in the reader's language
 * (overlay: ./authors.ts). English is the registry itself — every function here returns
 * `undefined` / nothing for 'en', so English output never changes.
 */
import type { NonEnglishLocale } from '../../../domain/bookNames';
import type { Locale } from '../../../i18n/locales';
import { AUTHOR_TRANSLATIONS, type LocalizedAuthor } from './authors';

export { AUTHOR_TRANSLATIONS, type AuthorTranslation, type LocalizedAuthor } from './authors';

const NON_ENGLISH: readonly NonEnglishLocale[] = ['pt', 'es', 'fr'];

/** The author's entry in `locale` (undefined in English or for an author without a translation). */
export function authorTranslation(authorId: string, locale: Locale): LocalizedAuthor | undefined {
  if (locale === 'en') return undefined;
  return AUTHOR_TRANSLATIONS[authorId]?.[locale];
}

/**
 * Every name readers of Portuguese, Spanish and French may use for this author, lowercase:
 * the localized full and short names where the name is localized ("agostinho de hipona",
 * "agostinho", "agustín"), plus each entry's extra aliases ("santo agostinho", "joão wesley").
 * An author whose name stays as in English ("Robert Barclay", "W. Phillip Keller") adds only
 * its extra aliases — never a bare surname the English registry deliberately left out
 * ("barclay", "keller" belong to other authors); nor does a descriptive name ("Continuadores
 * de Matthew Henry"). Duplicates are removed; the caller merges the result with the English aliases.
 */
export function localizedAuthorAliases(authorId: string): string[] {
  const entry = AUTHOR_TRANSLATIONS[authorId];
  if (!entry) return [];
  const out = new Set<string>();
  for (const locale of NON_ENGLISH) {
    const t = entry[locale];
    const names = t.name === entry.en || entry.descriptive ? [] : [t.name, t.shortName];
    for (const alias of [...names, ...(t.aliases ?? [])]) {
      const a = alias.trim().toLowerCase();
      if (a) out.add(a);
    }
  }
  return [...out];
}

let byEnglishName: Map<string, string> | undefined;

/**
 * A registry author's name in `locale`, looked up by the English registry name
 * ("John Calvin" → "João Calvino"); undefined when the name is not a registry author.
 */
export function authorNameByEnglishName(englishName: string, locale: Locale): string | undefined {
  if (locale === 'en') return undefined;
  byEnglishName ??= new Map(Object.entries(AUTHOR_TRANSLATIONS).map(([id, e]) => [e.en, id]));
  const id = byEnglishName.get(englishName.trim());
  return id ? AUTHOR_TRANSLATIONS[id][locale].name : undefined;
}
