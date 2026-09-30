/**
 * SourceRegistry: the base registry (translations, editions, lexicons, datasets,
 * public-domain commentaries, well-known authors), then the shared registry
 * (works and authors cited by more than one curated module, defined once), then
 * every source and author declared by curated studies and topic-index entries.
 * Merge order is base → shared → curated; the first definition of an id wins.
 */
import type { Author, CuratedStudy, CuratedTopic, Source } from '../../domain/models';
import { BASE_AUTHORS } from '../../data/registry/base-authors';
import { BASE_SOURCES } from '../../data/registry/base-sources';
import { SHARED_AUTHORS } from '../../data/registry/shared-authors';
import { SHARED_SOURCES } from '../../data/registry/shared-sources';
import { CONFESSION_AUTHORS, CONFESSION_SOURCES } from '../../data/registry/confession-sources';
import { KB_AUTHORS, KB_SOURCES } from '../../data/registry/kb-sources';
import { localizedAuthorAliases } from '../../data/registry/i18n';
import { normalizePhrase } from '../../engine/text';
import type { SourceRegistry } from '../types';
import { devWarn } from './modules';

/** JSON with sorted keys, so equal definitions written in a different key order compare equal. */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/** A second, different definition of an id already registered (the first one is kept). */
export interface DefinitionConflict {
  kind: 'source' | 'author';
  id: string;
  kept: string;
  ignored: string;
}

function mergeById<T extends { id: string }>(kind: DefinitionConflict['kind'], groups: { origin: string; items: readonly T[] }[], conflicts: DefinitionConflict[]): T[] {
  const out = new Map<string, { item: T; origin: string; fingerprint: string }>();
  for (const { origin, items } of groups) {
    for (const item of items) {
      if (!item || typeof item.id !== 'string') continue;
      const existing = out.get(item.id);
      if (!existing) {
        out.set(item.id, { item, origin, fingerprint: stableStringify(item) });
        continue;
      }
      if (existing.fingerprint !== stableStringify(item)) conflicts.push({ kind, id: item.id, kept: existing.origin, ignored: origin });
    }
  }
  return [...out.values()].map((v) => v.item);
}

interface AliasEntry {
  alias: string;
  author: Author;
  /** explicit aliases and full names outrank derived surnames */
  explicit: boolean;
}

/**
 * The author with the names readers of Portuguese, Spanish and French use for them
 * ("Agostinho", "Agustín de Hipona", "Augustin", "João Calvino", "santo agostinho") among the
 * aliases — from the localized author registry (src/data/registry/i18n). Names that only
 * repeat an English alias are left out. Accents are optional when matching.
 */
function withLocalizedAliases(author: Author): Author {
  const known = new Set([author.name, ...(author.aliases ?? [])].map(normalizePhrase));
  const extra = localizedAuthorAliases(author.id).filter((alias) => {
    const key = normalizePhrase(alias);
    if (!key || known.has(key)) return false;
    known.add(key);
    return true;
  });
  if (!extra.length) return author;
  return { ...author, aliases: [...(author.aliases ?? []), ...extra] };
}

// Surnames that are also everyday English words — never derived automatically.
const COMMON_WORDS = new Set(['strong', 'young', 'long', 'white', 'black', 'brown', 'green', 'king', 'bishop', 'church', 'law', 'love', 'hope', 'grace', 'faith', 'rich', 'good']);

function buildAliasIndex(authors: readonly Author[]): AliasEntry[] {
  const entries: AliasEntry[] = [];
  const surnameCount = new Map<string, number>();
  for (const a of authors) {
    const parts = normalizePhrase(a.name).split(' ');
    const surname = parts[parts.length - 1];
    if (surname) surnameCount.set(surname, (surnameCount.get(surname) ?? 0) + 1);
  }
  for (const author of authors) {
    const explicit = new Set<string>([normalizePhrase(author.name), ...(author.aliases ?? []).map(normalizePhrase)]);
    for (const alias of explicit) if (alias) entries.push({ alias, author, explicit: true });
    // Derived surname alias for authors without one ("elliot" for "Elisabeth Elliot").
    const parts = normalizePhrase(author.name).split(' ');
    const surname = parts[parts.length - 1];
    if (
      parts.length > 1 &&
      surname.length >= 4 &&
      !explicit.has(surname) &&
      !COMMON_WORDS.has(surname) &&
      surnameCount.get(surname) === 1
    ) {
      entries.push({ alias: surname, author, explicit: false });
    }
  }
  // Longest alias first; explicit before derived at equal length.
  return entries.sort((a, b) => b.alias.length - a.alias.length || Number(b.explicit) - Number(a.explicit));
}

/**
 * Find an author named inside free text. Matching is whole-word on normalised
 * text, longest alias first ("tim keller" before "keller", "matthew henry"
 * before "henry"); explicit aliases outrank derived surnames.
 */
export function findAuthorIn(index: readonly AliasEntry[], text: string): Author | undefined {
  const hay = ` ${normalizePhrase(text)} `;
  if (hay.trim() === '') return undefined;
  for (const pass of [true, false]) {
    for (const e of index) {
      if (e.explicit !== pass) continue;
      if (hay.includes(` ${e.alias} `)) return e.author;
    }
  }
  return undefined;
}

export interface SourceRegistryInput {
  studies: readonly CuratedStudy[];
  topics: readonly CuratedTopic[];
  baseSources?: readonly Source[];
  baseAuthors?: readonly Author[];
  /** works/authors cited by several curated modules (default: src/data/registry/shared-*.ts) */
  sharedSources?: readonly Source[];
  sharedAuthors?: readonly Author[];
}

export function createSourceRegistry(input: SourceRegistryInput): SourceRegistry {
  const conflicts: DefinitionConflict[] = [];
  const sources = mergeById<Source>('source', [
    { origin: 'base registry', items: input.baseSources ?? BASE_SOURCES },
    { origin: 'shared registry', items: input.sharedSources ?? SHARED_SOURCES },
    { origin: 'knowledge-base registry', items: [...KB_SOURCES, ...CONFESSION_SOURCES] },
    ...input.studies.map((s) => ({ origin: `study "${s.id}"`, items: s.sources ?? [] })),
    ...input.topics.map((t) => ({ origin: `topic "${t.id}"`, items: t.sources ?? [] })),
  ], conflicts);
  const merged = mergeById<Author>('author', [
    { origin: 'base registry', items: input.baseAuthors ?? BASE_AUTHORS },
    { origin: 'shared registry', items: input.sharedAuthors ?? SHARED_AUTHORS },
    { origin: 'knowledge-base registry', items: [...KB_AUTHORS, ...CONFESSION_AUTHORS] },
    ...input.studies.map((s) => ({ origin: `study "${s.id}"`, items: s.authors ?? [] })),
    ...input.topics.map((t) => ({ origin: `topic "${t.id}"`, items: t.authors ?? [] })),
  ], conflicts);
  const authors = merged.map(withLocalizedAliases);
  if (conflicts.length) {
    const lines = conflicts.map((c) => `  ${c.kind} "${c.id}": kept ${c.kept}, ignored ${c.ignored}`);
    devWarn(`${conflicts.length} source/author definition${conflicts.length === 1 ? '' : 's'} differ between modules (the first is kept):\n${lines.join('\n')}`);
  }
  const sourceById = new Map(sources.map((s) => [s.id, s]));
  const authorById = new Map(authors.map((a) => [a.id, a]));
  const aliasIndex = buildAliasIndex(authors);

  return {
    getSource: (id) => sourceById.get(id),
    getAuthor: (id) => authorById.get(id),
    allSources: () => [...sources],
    allAuthors: () => [...authors],
    findAuthor: (text) => findAuthorIn(aliasIndex, text),
  };
}
