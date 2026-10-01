/**
 * Page cache (.kb-cache/pages): a composed page is stored under a key made of the
 * normalised reader input + translation + model (+ the client's passage/topic hint,
 * which can change the kind of page), so asking the same thing again opens the page
 * instantly without a model call. "Regenerate" bypasses it (and overwrites the entry
 * when the new page is finished). Only complete pages are stored.
 *
 * A cached page also records what produced it — the knowledge-base version, the
 * generator version (prompt, tools, validator code), the effort and the research
 * budget. A page whose fingerprint differs from the running server's is a miss (and is
 * overwritten by the fresh page), so pages composed from an older knowledge base or
 * before a validator fix are never served as current.
 */
import { readFileSync, statSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ChatMessage, PassageRef, Study, TranslationId } from '../../src/domain/models';
import { refKey } from '../../src/domain/reference';
import type { Locale } from '../../src/i18n/locales';
import { normalizeQuery, shortHash, slugify } from './text';

/** Bump to invalidate every cached page when generation changes in a way the file hash cannot see. */
export const GENERATOR_REVISION = 3;

/** Code that shapes a composed page: its hash is part of every cached page's fingerprint. */
const GENERATOR_FILES = [
  'server/inference/prompt.ts',
  'server/inference/composeTools.ts',
  'server/inference/research.ts',
  'server/inference/validate.ts',
  'server/inference/grounding.ts',
  'server/inference/refs.ts',
  'server/inference/text.ts',
  'server/inference/page.ts',
  'server/inference/run.ts',
  'server/inference/ledger.ts',
  'server/kb/traditions.ts',
];

/** Per root: the generator files' size + mtime when their hash was taken, and the hash. */
const generatorVersions = new Map<string, { stamp: string; version: string }>();

/** Size and mtime of every generator file — a cheap check that none changed since the last hash (the dev server hot-reloads them). */
function generatorStamp(root: string): string {
  return GENERATOR_FILES.map((f) => {
    try {
      const s = statSync(join(root, f));
      return `${s.size}:${s.mtimeMs}`;
    } catch {
      return 'missing';
    }
  }).join('|');
}

/** Hash of GENERATOR_REVISION and the generator's source files under `root` (memoised per root until a file's size or mtime changes). */
export function generatorVersion(root: string): string {
  const stamp = generatorStamp(root);
  const memo = generatorVersions.get(root);
  if (memo?.stamp === stamp) return memo.version;
  const parts = [`rev ${GENERATOR_REVISION}`];
  for (const f of GENERATOR_FILES) {
    try {
      parts.push(`${f}\n${readFileSync(join(root, f), 'utf8')}`);
    } catch {
      parts.push(`${f}: missing`);
    }
  }
  const version = shortHash(parts.join('\n\n'), 12);
  generatorVersions.set(root, { stamp, version });
  return version;
}

/** What produced a cached page; a page is served only while all of it still holds. */
export interface PageFingerprint {
  /** knowledge-base version (KnowledgeBase.stats().version) */
  kb: string;
  /** generatorVersion(root) */
  generator: string;
  effort: string;
  maxResearchCalls: number;
}

export interface CachedPage {
  version: 2;
  key: string;
  fingerprint: PageFingerprint;
  query: string;
  translation: TranslationId;
  /** language the page is written in (part of the key; absent on pages cached before localisation = 'en') */
  locale?: Locale;
  /** the configured model (part of the key) */
  model: string;
  /** the model that served the page (a page served by a fallback model is not cached) */
  modelUsed: string;
  createdAt: number;
  study: Study;
  reply: ChatMessage;
}

export interface CacheHint {
  passage?: PassageRef;
  topic?: string;
}

/** English keeps the pre-localisation key shape (stable ids for pages readers already saved); other languages add `|<locale>`. */
function baseKey(query: string, translation: TranslationId, model: string, locale: Locale): string {
  const key = `${normalizeQuery(query)}|${translation}|${model}`;
  return locale === 'en' ? key : `${key}|${locale}`;
}

/** Cache key: normalised input + translation + model + page language, plus the client's hint when it sent one. */
export function pageCacheKey(query: string, translation: TranslationId, model: string, hint?: CacheHint, locale: Locale = 'en'): string {
  const h = hint?.passage ? `passage:${refKey(hint.passage)}` : hint?.topic ? `topic:${normalizeQuery(hint.topic)}` : '';
  const base = baseKey(query, translation, model, locale);
  return h ? `${base}|${h}` : base;
}

/** Study id of a generated page: "gen-<slug>-<hash>" — stable for the same input, translation, model and language. */
export function generatedStudyId(query: string, translation: TranslationId, model: string, locale: Locale = 'en'): string {
  return `gen-${slugify(normalizeQuery(query), 40)}-${shortHash(baseKey(query, translation, model, locale), 8)}`;
}

/** The one key a compose request is cached, deduplicated (app.ts in-flight map) and identified under — never derive it by hand. */
export function composeCacheKey(req: { query: string; translation: TranslationId; hint?: CacheHint; locale?: Locale }, model: string): { key: string; studyId: string } {
  const locale = req.locale ?? 'en';
  return { key: pageCacheKey(req.query, req.translation, model, req.hint, locale), studyId: generatedStudyId(req.query, req.translation, model, locale) };
}

export function sameFingerprint(a: PageFingerprint | undefined, b: PageFingerprint): boolean {
  return Boolean(a) && a!.kb === b.kb && a!.generator === b.generator && a!.effort === b.effort && a!.maxResearchCalls === b.maxResearchCalls;
}

export class PageCache {
  constructor(readonly dir: string) {}

  private file(key: string): string {
    const slug = slugify(key.split('|')[0] ?? 'page', 40);
    return join(this.dir, `${slug}-${shortHash(key, 16)}.json`);
  }

  /** The page cached under `key`, or null — also when it was produced by another knowledge base, generator, effort or budget. */
  async get(key: string, fingerprint: PageFingerprint): Promise<CachedPage | null> {
    try {
      const page = JSON.parse(await readFile(this.file(key), 'utf8')) as CachedPage;
      if (page?.version !== 2 || page.key !== key || !page.study || !page.reply) return null;
      return sameFingerprint(page.fingerprint, fingerprint) ? page : null;
    } catch {
      return null;
    }
  }

  async put(page: CachedPage): Promise<void> {
    const file = this.file(page.key);
    await mkdir(this.dir, { recursive: true });
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tmp, JSON.stringify(page), 'utf8');
    await rename(tmp, file);
  }
}
