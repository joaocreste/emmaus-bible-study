/**
 * The knowledge base's full-text index: MiniSearch (BM25+) over every KbIndexDoc,
 * persisted in .kb-cache/index-<hash>.json together with the documents, so a warm
 * start is one JSON parse plus MiniSearch.loadJS instead of re-reading ~60 k
 * documents and re-indexing them.
 *
 * Cache key = hash of: this module's format version, the knowledge-base code that
 * shapes documents and terms (server/kb/*.ts, src/engine/text.ts), every
 * kb/corpus/*.json, public/data/manifest.json (changes whenever `npm run data:build`
 * regenerates the bundled data) and the curated documents (built in memory from
 * src/data/curated, so editing a curated study invalidates the index).
 *
 * Fields and boosts: title (the bare heading) ×3 > keywords ×1.6 > text ×1.
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import MiniSearch, { type AsPlainObject, type Options, type SearchOptions } from 'minisearch';
import type { KbIndexDoc } from './documents';
import { processTerm, tokenizeForSearch } from './text';

/** Bump when the cache layout (not the documents) changes. */
const CACHE_FORMAT = 3;

export const FIELD_BOOST = { title: 3, keywords: 1.6, text: 1 } as const;
const FIELDS = Object.keys(FIELD_BOOST) as (keyof typeof FIELD_BOOST)[];

/** Default search behaviour: BM25+ over all fields; prefix only for longer words, one typo allowed in long words. */
export const SEARCH_DEFAULTS: SearchOptions = {
  boost: { ...FIELD_BOOST },
  combineWith: 'OR',
  // "baptiz" → "baptize"; short words ("sin", "law") must match exactly or they explode into prefixes
  prefix: (term) => term.length >= 5,
  // one edit in words of 6+ characters ("divorse" → "divorce"); none for short words
  fuzzy: (term) => (term.length >= 6 ? 1 : false),
  maxFuzzy: 1,
  weights: { prefix: 0.35, fuzzy: 0.25 },
};

type Field = (typeof FIELDS)[number];

function fieldOf(doc: KbIndexDoc, field: Field): string {
  if (field === 'title') return doc.heading ?? doc.title;
  if (field === 'keywords') return doc.keywords?.join(' ; ') ?? '';
  return doc.searchText ?? doc.text;
}

/**
 * MiniSearch options. Documents are indexed by their position in the docs array
 * (MiniSearch<number>): the id IS the array index, so the cache stores the array as is.
 */
function options(docs: readonly KbIndexDoc[]): Options<number> {
  return {
    fields: [...FIELDS],
    idField: 'id',
    extractField: (i, field) => (field === 'id' ? i : fieldOf(docs[i], field as Field)),
    tokenize: tokenizeForSearch,
    processTerm,
    searchOptions: SEARCH_DEFAULTS,
  };
}

export interface CorpusStat {
  id: string;
  label: string;
  documents: number;
}

export interface LoadedIndex {
  docs: KbIndexDoc[];
  index: MiniSearch<number>;
  corpora: CorpusStat[];
  source: 'cache' | 'built';
  cacheFile?: string;
  cacheBytes?: number;
}

interface CacheFile {
  format: number;
  hash: string;
  builtAt: string;
  corpora: CorpusStat[];
  docs: KbIndexDoc[];
  index: AsPlainObject;
}

/** Hash of everything the index depends on (see the module comment). */
export async function indexHash(parts: { codeFiles: string[]; corpusFiles: { file: string; raw: string }[]; manifest: string | null; curated: readonly KbIndexDoc[] }): Promise<string> {
  const h = createHash('sha256');
  h.update(`format:${CACHE_FORMAT}\n`);
  for (const f of parts.codeFiles) {
    h.update(`code:${f}\n`);
    h.update(await readFile(f, 'utf8').catch(() => ''));
  }
  for (const c of parts.corpusFiles) {
    h.update(`corpus:${c.file}\n`);
    h.update(c.raw);
  }
  h.update(`manifest\n${parts.manifest ?? ''}`);
  h.update(`curated\n${JSON.stringify(parts.curated)}`);
  return h.digest('hex').slice(0, 20);
}

export function cacheFileFor(cacheDir: string, hash: string): string {
  return join(cacheDir, `index-${hash}.json`);
}

/** Load a cached index; null when absent, stale or unreadable. */
export async function loadCachedIndex(file: string, hash: string): Promise<LoadedIndex | null> {
  let raw: string;
  try {
    raw = await readFile(file, 'utf8');
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(raw) as CacheFile;
    if (data.format !== CACHE_FORMAT || data.hash !== hash || !Array.isArray(data.docs)) return null;
    const index = MiniSearch.loadJS<number>(data.index, options(data.docs));
    return { docs: data.docs, index, corpora: data.corpora, source: 'cache', cacheFile: file, cacheBytes: raw.length };
  } catch {
    return null;
  }
}

/** Index the documents (yielding to the event loop between chunks, so a dev server stays responsive). */
export async function buildIndex(docs: KbIndexDoc[], corpora: CorpusStat[]): Promise<LoadedIndex> {
  const index = new MiniSearch<number>(options(docs));
  await index.addAllAsync(
    docs.map((_, i) => i),
    { chunkSize: 2000 },
  );
  // searchText is only needed for indexing; drop it so memory and the cache hold one copy of each text
  for (const d of docs) delete d.searchText;
  return { docs, index, corpora, source: 'built' };
}

/** Write the cache atomically (tmp + rename) and remove older index files. */
export async function writeCachedIndex(cacheDir: string, hash: string, loaded: LoadedIndex): Promise<{ file: string; bytes: number }> {
  await mkdir(cacheDir, { recursive: true });
  const file = cacheFileFor(cacheDir, hash);
  const data: CacheFile = { format: CACHE_FORMAT, hash, builtAt: new Date().toISOString(), corpora: loaded.corpora, docs: loaded.docs, index: loaded.index.toJSON() };
  const body = JSON.stringify(data);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, body);
  await rename(tmp, file);
  for (const name of await readdir(cacheDir).catch(() => [] as string[])) {
    if (/^index-[0-9a-f]+\.json$/.test(name) && join(cacheDir, name) !== file) {
      // keep caches written in the last minute: another process (a parallel test run) may be using them
      const s = await stat(join(cacheDir, name)).catch(() => null);
      if (s && Date.now() - s.mtimeMs > 60_000) await rm(join(cacheDir, name), { force: true }).catch(() => {});
    }
  }
  return { file, bytes: Buffer.byteLength(body) };
}
