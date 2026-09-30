/**
 * I/O for the knowledge-base build: cached downloads (.kb-cache/downloads),
 * BSB verse counts for reference validation, and the corpus writer.
 */
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { PassageRef } from '../../../src/domain/models.ts';
import type { CorpusFile } from '../../../server/kb/corpus.ts';

export const ROOT = new URL('../../../', import.meta.url).pathname.replace(/\/$/, '');
export const DOWNLOADS = join(ROOT, '.kb-cache', 'downloads');
export const CORPUS_DIR = join(ROOT, 'kb', 'corpus');

export const opts = { offline: false, refresh: false };

export function log(msg: string): void {
  console.log(`[kb] ${msg}`);
}

/** Download `url` once into .kb-cache/downloads/<name> (reused on later runs unless --refresh). */
export async function download(url: string, name: string): Promise<Buffer> {
  const file = join(DOWNLOADS, name);
  if (existsSync(file) && !opts.refresh) return readFile(file);
  if (opts.offline) throw new Error(`offline and not cached: ${name} (${url})`);
  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    try {
      log(`downloading ${url}`);
      const res = await fetch(url, { headers: { 'user-agent': 'emmaus-kb-build/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const body = Buffer.from(await res.arrayBuffer());
      await mkdir(dirname(file), { recursive: true });
      await writeFile(`${file}.tmp`, body);
      await rename(`${file}.tmp`, file);
      return body;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/** Last verse number of every chapter in the bundled BSB ("ROM.8" → 39). */
export async function loadVerseCounts(): Promise<Map<string, number>> {
  const dir = join(ROOT, 'public', 'data', 'bible', 'bsb');
  const map = new Map<string, number>();
  if (!existsSync(dir)) throw new Error('public/data/bible/bsb is missing — run `npm run data:build` first');
  for (const f of await readdir(dir)) {
    if (!f.endsWith('.json')) continue;
    const file = JSON.parse(await readFile(join(dir, f), 'utf8')) as { book: string; chapters: { c: number; v: [number, string][] }[] };
    for (const ch of file.chapters) map.set(`${file.book}.${ch.c}`, ch.v[ch.v.length - 1]?.[0] ?? 0);
  }
  return map;
}

export interface RefStats {
  kept: number;
  apocrypha: number;
  malformed: number;
  outOfRange: number;
  clamped: number;
}

export const newRefStats = (): RefStats => ({ kept: 0, apocrypha: 0, malformed: 0, outOfRange: 0, clamped: 0 });

/**
 * Check a reference against the BSB versification: the chapter and start verse must
 * exist; an end verse past the chapter's end is clamped. Returns null when invalid.
 */
export function validateRef(ref: PassageRef, counts: Map<string, number>, stats: RefStats): PassageRef | null {
  const endC = ref.endChapter ?? ref.startChapter;
  const first = counts.get(`${ref.book}.${ref.startChapter}`);
  const last = counts.get(`${ref.book}.${endC}`);
  if (!first || !last || endC < ref.startChapter) {
    stats.outOfRange++;
    return null;
  }
  if (ref.startVerse == null) {
    stats.kept++;
    return ref;
  }
  if (ref.startVerse < 1 || ref.startVerse > first) {
    stats.outOfRange++;
    return null;
  }
  let endVerse = ref.endVerse ?? ref.startVerse;
  if (endVerse > last) {
    endVerse = last;
    stats.clamped++;
  }
  if (endC === ref.startChapter && endVerse < ref.startVerse) {
    stats.outOfRange++;
    return null;
  }
  stats.kept++;
  return { ...ref, endChapter: endC, endVerse };
}

/** Write a corpus file with one document per line (reviewable diffs, compact size). */
export async function writeCorpus(file: string, corpus: CorpusFile): Promise<number> {
  const lines = corpus.documents.map((d) => JSON.stringify(d));
  const body = `{"corpus":${JSON.stringify(corpus.corpus)},\n"documents":[\n${lines.join(',\n')}\n]}\n`;
  const path = join(CORPUS_DIR, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body);
  return Buffer.byteLength(body);
}

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "WORLDLY" → "Worldly"; mixed-case strings are left alone. */
export function sentenceCase(s: string): string {
  if (!/[A-Z]/.test(s) || s !== s.toUpperCase()) return s;
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** Merge "Matt 5:31" + "Matt 5:32" into "Matt 5:31–32" when adjacent (source order kept). */
export function mergeAdjacent(refs: PassageRef[]): PassageRef[] {
  const out: PassageRef[] = [];
  for (const r of refs) {
    const prev = out[out.length - 1];
    if (
      prev &&
      prev.book === r.book &&
      prev.startVerse != null &&
      r.startVerse != null &&
      (prev.endChapter ?? prev.startChapter) === prev.startChapter &&
      prev.startChapter === r.startChapter &&
      (r.endChapter ?? r.startChapter) === r.startChapter &&
      r.startVerse === (prev.endVerse ?? prev.startVerse) + 1
    ) {
      prev.endVerse = r.endVerse ?? r.startVerse;
      continue;
    }
    out.push({ ...r });
  }
  return out;
}
