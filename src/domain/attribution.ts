/**
 * Attribution helpers shared by the engine (chat prose) and the UI (citation chips,
 * captions). Pure string formatting over source metadata — they never invent data.
 *
 * Localized authors (docs/I18N.md): names, traditions, descriptions and lifespans in
 * Portuguese, Spanish and French come from the overlay in src/data/registry/i18n; English
 * is the registry itself, so every helper returns its English result unchanged for 'en'.
 */
import { authorTranslation } from '../data/registry/i18n';
import type { Locale } from '../i18n/locales';
import type { Author } from './models';

const localizedCache: Partial<Record<Locale, WeakMap<Author, Author>>> = {};

/**
 * The author as readers of `locale` see it: conventional name ("Agostinho de Hipona"), short
 * citation form, tradition, description and lifespan in that language. English, and authors
 * without a translation, come back as the same object. Results are cached per author object,
 * so a localized author keeps its identity across renders.
 */
export function localizeAuthor(author: Author, locale?: Locale): Author;
export function localizeAuthor(author: Author | undefined, locale?: Locale): Author | undefined;
export function localizeAuthor(author: Author | undefined, locale: Locale = 'en'): Author | undefined {
  if (!author || locale === 'en') return author;
  const t = authorTranslation(author.id, locale);
  if (!t) return author;
  const cache = (localizedCache[locale] ??= new WeakMap());
  let out = cache.get(author);
  if (!out) {
    out = {
      ...author,
      name: t.name,
      shortName: t.shortName,
      tradition: t.tradition,
      description: t.description,
      ...(t.lifespan ? { lifespan: t.lifespan } : {}),
    };
    cache.set(author, out);
  }
  return out;
}

/** Whether the author's tradition and description exist in `locale` (false in English: nothing to translate). */
export function hasAuthorTranslation(author: { id: string }, locale: Locale): boolean {
  return Boolean(authorTranslation(author.id, locale));
}

/** The author's display name in `locale` ("João Calvino", "Juan Calvino", "Jean Calvin"). */
export function authorDisplayName(author: { id?: string; name: string }, locale: Locale = 'en'): string {
  return (author.id && authorTranslation(author.id, locale)?.name) || author.name;
}

/**
 * Author name for compact citations.
 * - an explicit `shortName` wins (curated data can say "Augustine", "Irenaeus");
 * - names with a place or epithet keep their full form, since the last word is not a
 *   surname ("Augustine of Hippo", "John of Damascus", "Gregory the Great", "Justin Martyr");
 * - teams list each surname ("C. F. Keil & Franz Delitzsch" → "Keil & Delitzsch");
 * - otherwise the surname ("Charles H. Spurgeon" → "Spurgeon", "David A. deSilva" → "deSilva").
 * In Portuguese, Spanish and French the overlay's short form wins ("Agostinho", "Calvino", "Luther").
 */
export function citationAuthorName(author: { id?: string; name: string; shortName?: string }, locale: Locale = 'en'): string {
  const localized = author.id ? authorTranslation(author.id, locale)?.shortName : undefined;
  if (localized) return localized;
  if (author.shortName?.trim()) return author.shortName.trim();
  const name = author.name.trim().replace(/\s+/g, ' ');
  const members = name.split(/\s*(?:,|&|\band\b)\s*/).filter(Boolean);
  if (members.length > 1) {
    const surnames = members.map(surname);
    return surnames.length === 2 ? surnames.join(' & ') : `${surnames.slice(0, -1).join(', ')} & ${surnames[surnames.length - 1]}`;
  }
  return surname(name);
}

const KEEP_WHOLE = /\s(?:of|the)\s|\s(?:Martyr|Confessor)$/;
const SUFFIX = /^(?:Jr\.?|Sr\.?|II|III|IV)$/;
const PARTICLE = /^(?:de|da|del|della|di|du|la|le|van|von|der|den|ter|ten)$/;

function surname(name: string): string {
  if (KEEP_WHOLE.test(name)) return name;
  const parts = name.split(' ');
  while (parts.length > 1 && SUFFIX.test(parts[parts.length - 1])) parts.pop();
  if (parts.length === 1) return parts[0];
  let i = parts.length - 1;
  while (i > 1 && PARTICLE.test(parts[i - 1])) i--;
  return parts.slice(i).join(' ');
}

/**
 * A work's display year without nested parentheses, for use inside "( … )":
 * "c. 421 (English trans. 1887)" → "c. 421; English trans. 1887".
 */
export function displayYear(year: string | undefined): string | undefined {
  const y = year?.trim();
  if (!y) return undefined;
  return y
    .replace(/\s*\(\s*([^()]*?)\s*\)/g, (_m, inner: string) => (inner ? `; ${inner}` : ''))
    .replace(/^;\s*/, '')
    .trim();
}
