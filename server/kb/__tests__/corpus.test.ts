/**
 * Integrity of the KB corpora built by `npm run kb:build` (kb/corpus/{naves,torrey,easton,smith}.json),
 * their registry records, and generic loading of any corpus file (the confession corpora
 * are produced by another pipeline in the same format).
 */
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { KB_AUTHORS, KB_SOURCES } from '../../../src/data/registry/kb-sources';
import { parseRefKey } from '../../../src/domain/reference';
import { createCuratedProviders } from '../../../src/providers/curated';
import type { CorpusFile } from '../corpus';
import { createKnowledgeBase } from '../index';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const sources = createCuratedProviders().sources;

/** Last verse of each chapter in the bundled BSB ("ROM.8" → 39). */
const VERSES = (() => {
  const dir = join(ROOT, 'public', 'data', 'bible', 'bsb');
  const map = new Map<string, number>();
  for (const f of readdirSync(dir)) {
    const file = JSON.parse(readFileSync(join(dir, f), 'utf8')) as { book: string; chapters: { c: number; v: [number, string][] }[] };
    for (const ch of file.chapters) map.set(`${file.book}.${ch.c}`, ch.v[ch.v.length - 1][0]);
  }
  return map;
})();

function refExists(key: string): boolean {
  const r = parseRefKey(key);
  if (!r) return false;
  const endC = r.endChapter ?? r.startChapter;
  const first = VERSES.get(`${r.book}.${r.startChapter}`);
  const last = VERSES.get(`${r.book}.${endC}`);
  if (!first || !last) return false;
  if (r.startVerse != null && (r.startVerse < 1 || r.startVerse > first)) return false;
  if (r.endVerse != null && r.endVerse > last) return false;
  return true;
}

const load = async (id: string) => JSON.parse(await readFile(join(ROOT, 'kb', 'corpus', `${id}.json`), 'utf8')) as CorpusFile;

describe.each([
  { id: 'naves', kind: 'topical-index', sourceId: 'naves-topical-bible', authorId: 'orville-nave', min: 4500 },
  { id: 'torrey', kind: 'topical-index', sourceId: 'torreys-topical-textbook', authorId: 'ra-torrey', min: 600 },
  { id: 'easton', kind: 'dictionary', sourceId: 'eastons-bible-dictionary', authorId: 'mg-easton', min: 3900 },
  { id: 'smith', kind: 'dictionary', sourceId: 'smiths-bible-dictionary', authorId: 'william-smith-lexicographer', min: 4500 },
])('kb/corpus/$id.json', ({ id, kind, sourceId, authorId, min }) => {
  it('is a well-formed CorpusFile attributed to a registered public-domain source', async () => {
    const c = await load(id);
    expect(c.corpus).toMatchObject({ id, kind, sourceId });
    expect(c.corpus.origin.url).toMatch(/^https:\/\/github\.com\/neuu-org\//);
    expect(c.corpus.origin.license).toMatch(/CC BY 4\.0/);
    const source = sources.getSource(sourceId)!;
    expect(source.license).toMatchObject({ status: 'public-domain', usage: 'full-text' });
    expect(source.license.attribution).toMatch(/NEUU/);
    expect(sources.getAuthor(authorId)).toBeDefined();
    expect(c.documents.length).toBeGreaterThanOrEqual(min);
    expect(new Set(c.documents.map((d) => d.id)).size).toBe(c.documents.length);
    for (const d of c.documents) {
      expect(d.id.startsWith(`${id}:`)).toBe(true);
      expect(d.title.trim()).not.toBe('');
      expect(d.text.trim()).not.toBe('');
      expect(d.authorId).toBe(authorId);
      expect(d.url).toMatch(/^https:\/\/www\.ccel\.org\/ccel\//);
    }
  });

  it('has only references that exist in the BSB versification', async () => {
    const c = await load(id);
    const bad: string[] = [];
    for (const d of c.documents) for (const k of d.refs ?? []) if (!refExists(k)) bad.push(`${d.id}: ${k}`);
    expect(bad).toEqual([]);
  });

  if (kind === 'topical-index') {
    it('has clean reference groups: no junk labels, see-also as keywords, groups within the refs', async () => {
      const c = await load(id);
      for (const d of c.documents) {
        const all = new Set(d.refs);
        for (const a of d.aspects ?? []) {
          expect(a.refs.length).toBeGreaterThan(0);
          expect(a.label).not.toMatch(/^See\s*[A-Z]|^(And|By|\(|Di)$/);
          for (const r of a.refs) expect(all.has(r)).toBe(true);
        }
        for (const k of d.keywords ?? []) expect(k).not.toMatch(/\b(above|below)\b/);
      }
    });
  }

  if (kind === 'dictionary') {
    it('chunks long entries into parts of ≤ ~2,500 characters', async () => {
      const c = await load(id);
      const parts = c.documents.filter((d) => /\(part \d+\)$/.test(d.title));
      expect(parts.length).toBeGreaterThan(50);
      for (const d of c.documents) expect(d.text.length).toBeLessThanOrEqual(4000);
      const big = c.documents.filter((d) => d.text.length > 2700);
      expect(big.length / c.documents.length).toBeLessThan(0.01);
    });
  }
});

describe('known entries', () => {
  it('Nave’s DIVORCE keeps its groups and folds “See MARRIAGE” into keywords', async () => {
    const d = (await load('naves')).documents.find((x) => x.id === 'naves:divorce')!;
    expect(d.aspects!.map((a) => a.label)).toEqual([
      'General scriptures concerning',
      'Disobedience of the wife to the husband, a sufficient cause for, in the Persian empire',
      'Figurative',
    ]);
    expect(d.aspects![0].refs).toEqual(expect.arrayContaining(['MAT.5.31-32', 'MAT.19.3-12', 'MRK.10.2', 'LUK.16.18', '1CO.7.10-17']));
    expect(d.keywords).toContain('marriage');
  });

  it('redirect-only topics become aliases of their target (WEALTH → RICHES, ANXIETY → CARE)', async () => {
    const docs = (await load('naves')).documents;
    expect(docs.find((x) => x.id === 'naves:riches')!.keywords).toContain('wealth');
    expect(docs.find((x) => x.id === 'naves:care')!.keywords).toContain('anxiety');
    expect(docs.some((x) => x.title === 'WEALTH')).toBe(false);
  });

  it('Easton’s Divorce cites Deuteronomy 24 and the Gospel texts', async () => {
    const d = (await load('easton')).documents.find((x) => x.id === 'easton:divorce')!;
    expect(d.refs).toEqual(expect.arrayContaining(['DEU.24.1-4', 'MAT.19.1-9', 'MRK.10.2-12', 'LUK.16.18']));
    expect(d.text).toMatch(/^The dissolution of the marriage tie was regulated by the Mosaic law/);
  });
});

describe('registry (src/data/registry/kb-sources.ts)', () => {
  it('declares the four works and their compilers with verified lifespans', () => {
    const years = Object.fromEntries(KB_SOURCES.map((s) => [s.id, s.year]));
    expect(years).toMatchObject({ 'naves-topical-bible': '1896', 'torreys-topical-textbook': '1897', 'eastons-bible-dictionary': '1897', 'smiths-bible-dictionary': '1863' });
    const life = Object.fromEntries(KB_AUTHORS.map((a) => [a.id, a.lifespan]));
    expect(life).toMatchObject({ 'orville-nave': '1841–1917', 'ra-torrey': '1856–1928', 'mg-easton': '1823–1894', 'william-smith-lexicographer': '1813–1893' });
    for (const s of KB_SOURCES.filter((x) => x.license.status === 'public-domain')) expect(s.description).toMatch(/19th-century|Nineteenth-century|Victorian/);
  });

  it('are merged into the app’s SourceRegistry without conflicts', () => {
    for (const s of KB_SOURCES) expect(sources.getSource(s.id)).toBe(s);
    for (const a of KB_AUTHORS) expect(sources.getAuthor(a.id)).toBe(a);
  });
});

describe('generic corpus loading', () => {
  it('indexes any kb/corpus/*.json in the CorpusFile format and skips malformed files', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'emmaus-kb-corpus-'));
    try {
      const fixture: CorpusFile = {
        corpus: { id: 'fixture-confession', label: 'Fixture Confession (test)', kind: 'confession', sourceId: 'fixture-source-not-registered', origin: { url: 'https://example.org/fixture', license: 'test fixture', retrieved: '2026-09-28' } },
        documents: [
          { id: 'fixture:1', title: 'Fixture Confession 1 — Of Zebulunite Quokkas', text: 'FIXTURE text about zebulunite quokkas, used only by this test.', tradition: 'Testing', refs: ['GEN.1.1'], keywords: ['quokka'] },
          { id: 'fixture:2', title: 'Fixture Confession 2', text: '' },
        ],
      };
      await writeFile(join(dir, 'fixture-confession.json'), JSON.stringify(fixture));
      await writeFile(join(dir, 'broken.json'), '{"corpus": {"id": "broken"'); // e.g. half-written by a concurrent build
      await writeFile(join(dir, 'naves.json'), await readFile(join(ROOT, 'kb', 'corpus', 'naves.json'), 'utf8'));
      const warnings: string[] = [];
      const kb = createKnowledgeBase({ root: ROOT, corpusDir: dir, indexCache: false, allowRemote: false, log: (m) => warnings.push(m) });
      await kb.ready();
      const corpora = kb.stats().corpora.map((c) => c.id);
      expect(corpora).toEqual(expect.arrayContaining(['fixture-confession', 'naves', 'tyndale-notes']));
      expect(corpora).not.toContain('broken');
      expect(warnings.some((w) => w.includes('broken.json'))).toBe(true);
      expect(warnings.some((w) => w.includes('fixture-source-not-registered'))).toBe(true);
      const [hit] = await kb.search('zebulunite quokkas');
      expect(hit).toMatchObject({ kind: 'confession', title: 'Fixture Confession 1 — Of Zebulunite Quokkas [Testing]', quotable: false });
      expect(kb.stats().corpora.find((c) => c.id === 'fixture-confession')!.documents).toBe(1);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }, 120_000);
});
