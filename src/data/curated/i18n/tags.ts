/**
 * Search tags in the reader's language. Curated items carry English `tags` that the chat engine
 * matches against questions ("Is it wrong to have doubts?" → the passage tagged "doubt"). Readers
 * of pt/es/fr type their own words, so each translated study or topic gets the translations
 * appended to every `tags` array (the English tags stay, so nothing that matched before stops matching).
 * Cross-references are the exception: they are ranked by the active concept against their English tags, and
 * translated tags would reorder them away from the English dashboard (the same question pins the same cards).
 * Glossaries: `tags.<locale>.ts` — English tag → words a reader would type (docs/I18N.md §4).
 */
import type { Locale } from '../../../i18n/locales';
import es from './tags.es';
import fr from './tags.fr';
import pt from './tags.pt';

export type TagGlossary = Readonly<Record<string, readonly string[]>>;

export const TAG_GLOSSARIES: Readonly<Record<Exclude<Locale, 'en'>, TagGlossary>> = { pt, es, fr };

/** The English tags followed by their translations, without duplicates. */
export function localTags(tags: readonly string[], locale: Locale): string[] {
  if (locale === 'en') return [...tags];
  const glossary = TAG_GLOSSARIES[locale];
  return Array.from(new Set([...tags, ...tags.flatMap((tag) => glossary[tag] ?? [])]));
}

const isTagList = (value: unknown): value is string[] => Array.isArray(value) && value.every((x) => typeof x === 'string');

/** A copy of `value` in which every `tags` string array also carries its translations. */
export function withLocalTags<T>(value: T, locale: Locale): T {
  if (locale === 'en') return value;
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(node)) {
      if (key === 'crossReferences') out[key] = child;
      else out[key] = key === 'tags' && isTagList(child) ? localTags(child, locale) : walk(child);
    }
    return out;
  };
  return walk(value) as T;
}
