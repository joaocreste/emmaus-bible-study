/**
 * Source-grounding integrity checks for the curated library (docs/CONTENT-GUIDELINES.md).
 *
 * These tests make the app's promises mechanical:
 *  - every citation, author and source resolves; shared works are defined once
 *  - quotations are verified, located, linked, and only from sources whose license allows it
 *  - copyrighted works are summarised, never quoted
 *  - every Scripture reference exists (checked against the bundled BSB)
 *  - key-word anchors really occur in the translation text, and lemmas agree with the lexicon
 *  - concept links point at real items
 */
import { beforeAll, describe, expect, it } from 'vitest';
import type {
  Author,
  CommentaryEntry,
  CuratedStudy,
  CuratedTopic,
  PassageRef,
  Source,
  TranslationId,
  VerseRef,
} from '../../domain/models';
import { getBook, tryGetBook } from '../../domain/books';
import { formatRef, refKey } from '../../domain/reference';
import { BASE_AUTHORS } from '../registry/base-authors';
import { BASE_SOURCES } from '../registry/base-sources';
import { SHARED_AUTHORS } from '../registry/shared-authors';
import { SHARED_SOURCES } from '../registry/shared-sources';
import { CONFESSION_AUTHORS, CONFESSION_SOURCES } from '../registry/confession-sources';
import { KB_AUTHORS, KB_SOURCES } from '../registry/kb-sources';
import { createLocalDatasetProviders } from '../../providers/local';
import { createFsLoader } from '../../providers/local/__tests__/fsLoader';

const studyModules = import.meta.glob<CuratedStudy>('../curated/studies/*.ts', { eager: true, import: 'default' });
const topicModules = import.meta.glob<CuratedTopic>('../curated/topics/*.ts', { eager: true, import: 'default' });

const studies = Object.values(studyModules);
const topics = Object.values(topicModules);
type Module = { kind: 'study' | 'topic'; id: string; value: CuratedStudy | CuratedTopic };
const modules: Module[] = [
  ...studies.map((s) => ({ kind: 'study' as const, id: s.id, value: s })),
  ...topics.map((t) => ({ kind: 'topic' as const, id: t.id, value: t })),
];

const providers = createLocalDatasetProviders({ loader: createFsLoader(), allowRemoteFallback: false });

/* ---------------- registry ---------------- */

const sourceDefs = new Map<string, { from: string; def: Source }[]>();
const authorDefs = new Map<string, { from: string; def: Author }[]>();
for (const s of BASE_SOURCES) sourceDefs.set(s.id, [{ from: 'base', def: s }]);
for (const a of BASE_AUTHORS) authorDefs.set(a.id, [{ from: 'base', def: a }]);
for (const s of SHARED_SOURCES) sourceDefs.set(s.id, [...(sourceDefs.get(s.id) ?? []), { from: 'shared', def: s }]);
for (const a of SHARED_AUTHORS) authorDefs.set(a.id, [...(authorDefs.get(a.id) ?? []), { from: 'shared', def: a }]);
for (const s of [...KB_SOURCES, ...CONFESSION_SOURCES]) sourceDefs.set(s.id, [...(sourceDefs.get(s.id) ?? []), { from: 'kb', def: s }]);
for (const a of [...KB_AUTHORS, ...CONFESSION_AUTHORS]) authorDefs.set(a.id, [...(authorDefs.get(a.id) ?? []), { from: 'kb', def: a }]);
for (const m of modules) {
  const v = m.value as CuratedStudy & CuratedTopic;
  for (const s of v.sources ?? []) {
    const list = sourceDefs.get(s.id) ?? [];
    list.push({ from: `${m.kind}:${m.id}`, def: s });
    sourceDefs.set(s.id, list);
  }
  for (const a of v.authors ?? []) {
    const list = authorDefs.get(a.id) ?? [];
    list.push({ from: `${m.kind}:${m.id}`, def: a });
    authorDefs.set(a.id, list);
  }
}
const sourceById = (id: string) => sourceDefs.get(id)?.[0].def;
const authorById = (id: string) => authorDefs.get(id)?.[0].def;

/* ---------------- deep walkers ---------------- */

interface Found<T> {
  path: string;
  value: T;
}

function walk(node: unknown, path: string, visit: (value: Record<string, unknown>, path: string) => void, seen = new Set<unknown>()): void {
  if (!node || typeof node !== 'object' || seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) {
    node.forEach((child, i) => walk(child, `${path}[${i}]`, visit, seen));
    return;
  }
  const obj = node as Record<string, unknown>;
  visit(obj, path);
  for (const [k, v] of Object.entries(obj)) walk(v, `${path}.${k}`, visit, seen);
}

function collect<T>(root: unknown, rootPath: string, pick: (o: Record<string, unknown>) => boolean): Found<T>[] {
  const out: Found<T>[] = [];
  walk(root, rootPath, (o, p) => {
    if (pick(o)) out.push({ path: p, value: o as T });
  });
  return out;
}

const isPassageRef = (o: Record<string, unknown>) => typeof o.book === 'string' && typeof o.startChapter === 'number';
const isVerseRef = (o: Record<string, unknown>) =>
  typeof o.book === 'string' && typeof o.chapter === 'number' && typeof o.verse === 'number';
const isCitation = (o: Record<string, unknown>) => typeof o.sourceId === 'string' && !('authorId' in o) && !('title' in o);
const hasUrl = (o: Record<string, unknown>) => typeof o.url === 'string';

/** Every item id declared in a module (for uniqueness and link checks). */
function itemIds(m: Module): Map<string, string> {
  const ids = new Map<string, string>();
  const v = m.value as Partial<CuratedStudy> & Partial<CuratedTopic>;
  const add = (kind: string, list: { id: string }[] | undefined) => list?.forEach((x) => ids.set(x.id, kind));
  add('keyWord', v.keyWords);
  add('crossReference', v.crossReferences);
  add('context', v.context);
  add('literary', v.literary?.features);
  add('theme', v.theology);
  add('perspectiveSet', v.perspectives);
  v.perspectives?.forEach((ps) => add('perspective', ps.perspectives));
  add('commentary', v.commentary);
  add('sermon', v.sermons);
  add('concept', v.concepts);
  add('topicPassage', v.topic?.keyPassages);
  return ids;
}

function stripMarks(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-֑ͯ-ׇ]/g, '')
    .replace(/[־’'ʼ]/g, '')
    .normalize('NFC')
    .toLowerCase();
}

function verseText(v: { text: string; poetryLines?: string[] }): string {
  return v.poetryLines?.length ? v.poetryLines.join(' ') : v.text;
}

/* ---------------- verse-count cache ---------------- */

const verseCounts = new Map<string, number>();
async function verseCount(book: string, chapter: number): Promise<number> {
  const k = `${book}.${chapter}`;
  if (!verseCounts.has(k)) verseCounts.set(k, await providers.scripture.getVerseCount(book, chapter));
  return verseCounts.get(k)!;
}

async function passageProblems(ref: PassageRef): Promise<string | null> {
  const info = tryGetBook(ref.book);
  if (!info) return `unknown book ${ref.book}`;
  const endC = ref.endChapter ?? ref.startChapter;
  if (ref.startChapter < 1 || endC > info.chapters || endC < ref.startChapter) return `chapter out of range (${info.name} has ${info.chapters})`;
  if (ref.startVerse != null) {
    const n = await verseCount(ref.book, ref.startChapter);
    if (ref.startVerse < 1 || ref.startVerse > n) return `start verse ${ref.startVerse} > ${n}`;
  }
  if (ref.endVerse != null) {
    const n = await verseCount(ref.book, endC);
    if (ref.endVerse < 1 || ref.endVerse > n) return `end verse ${ref.endVerse} > ${n}`;
    if (endC === ref.startChapter && ref.startVerse != null && ref.endVerse < ref.startVerse) return 'end verse before start verse';
  }
  return null;
}

/* ================================================================== */

describe('curated library — structure', () => {
  it('has the five featured studies and a topic index', () => {
    expect(studies.map((s) => s.id).sort()).toEqual(expect.arrayContaining(['grace', 'john-1', 'psalm-23', 'romans-8', 'suffering']));
    expect(topics.length).toBeGreaterThanOrEqual(12);
  });

  it('item ids are unique across the whole library and prefixed by their module id', () => {
    const owner = new Map<string, string>();
    const problems: string[] = [];
    for (const m of modules) {
      for (const id of itemIds(m).keys()) {
        if (owner.has(id)) problems.push(`${id} in ${m.id} and ${owner.get(id)}`);
        owner.set(id, m.id);
        if (!id.startsWith(`${m.id}:`)) problems.push(`${id} (in ${m.id}) is not prefixed "${m.id}:"`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('concept links, focus ids and key-passage groups point at real items', () => {
    const problems: string[] = [];
    for (const s of studies) {
      const ids = itemIds({ kind: 'study', id: s.id, value: s });
      const expectKind = (id: string, kind: string, where: string) => {
        if (ids.get(id) !== kind) problems.push(`${s.id} ${where}: ${id} is not a ${kind}`);
      };
      for (const c of s.concepts) {
        c.keyWordIds.forEach((id) => expectKind(id, 'keyWord', c.id));
        c.crossReferenceIds.forEach((id) => expectKind(id, 'crossReference', c.id));
        c.contextIds.forEach((id) => expectKind(id, 'context', c.id));
        c.themeIds.forEach((id) => expectKind(id, 'theme', c.id));
        c.perspectiveSetIds.forEach((id) => expectKind(id, 'perspectiveSet', c.id));
        c.commentaryIds.forEach((id) => expectKind(id, 'commentary', c.id));
        c.literaryFeatureIds?.forEach((id) => expectKind(id, 'literary', c.id));
        if (c.aliases.some((a) => a !== a.toLowerCase())) problems.push(`${s.id} ${c.id}: aliases must be lowercase`);
      }
      if (s.suggestedQuestions.length === 0) problems.push(`${s.id}: no suggestedQuestions`);
    }
    for (const t of topics) if (t.aliases.some((a) => a !== a.toLowerCase())) problems.push(`topic ${t.id}: aliases must be lowercase`);
    expect(problems).toEqual([]);
  });

  it('curated passage studies expose the core modules', () => {
    for (const s of studies.filter((x) => x.kind === 'passage')) {
      expect(s.keyWords.length, `${s.id} keyWords`).toBeGreaterThanOrEqual(5);
      expect(s.crossReferences.length, `${s.id} crossReferences`).toBeGreaterThanOrEqual(10);
      expect(s.context.length, `${s.id} context`).toBeGreaterThanOrEqual(4);
      expect(s.theology.length, `${s.id} theology`).toBeGreaterThanOrEqual(3);
      expect(s.commentary.length, `${s.id} commentary`).toBeGreaterThanOrEqual(6);
      expect(s.concepts.length, `${s.id} concepts`).toBeGreaterThanOrEqual(6);
      expect(s.literary, `${s.id} literary`).toBeTruthy();
    }
    for (const s of studies.filter((x) => x.kind === 'topic')) {
      expect(s.topic?.keyPassages.length, `${s.id} key passages`).toBeGreaterThanOrEqual(10);
      expect(s.passage, `${s.id} anchor`).toBeTruthy();
    }
  });
});

describe('sources & authors', () => {
  it('each shared source/author id has exactly one definition (no conflicting duplicates)', () => {
    const problems: string[] = [];
    for (const [id, defs] of sourceDefs)
      if (defs.length > 1) problems.push(`source ${id}: defined in ${defs.map((d) => d.from).join(', ')}`);
    for (const [id, defs] of authorDefs)
      if (defs.length > 1) problems.push(`author ${id}: defined in ${defs.map((d) => d.from).join(', ')}`);
    expect(problems).toEqual([]);
  });

  it('every citation, commentary, sermon, representative and source author resolves', () => {
    const problems: string[] = [];
    for (const m of modules) {
      for (const c of collect<{ sourceId: string }>(m.value, m.id, isCitation))
        if (!sourceById(c.value.sourceId)) problems.push(`${c.path}: unknown source "${c.value.sourceId}"`);
      const v = m.value as Partial<CuratedStudy> & Partial<CuratedTopic>;
      for (const e of v.commentary ?? []) {
        if (!authorById(e.authorId)) problems.push(`${e.id}: unknown author ${e.authorId}`);
        if (!sourceById(e.sourceId)) problems.push(`${e.id}: unknown source ${e.sourceId}`);
      }
      for (const s of v.sermons ?? []) {
        if (!authorById(s.authorId)) problems.push(`${s.id}: unknown author ${s.authorId}`);
        if (!sourceById(s.sourceId)) problems.push(`${s.id}: unknown source ${s.sourceId}`);
      }
      for (const ps of v.perspectives ?? [])
        for (const p of ps.perspectives)
          for (const r of p.representatives ?? []) if (!authorById(r)) problems.push(`${p.id}: unknown representative ${r}`);
    }
    for (const [id, defs] of sourceDefs)
      for (const a of defs[0].def.authorIds) if (!authorById(a)) problems.push(`source ${id}: unknown author ${a}`);
    expect(problems).toEqual([]);
  });

  it('licenses are coherent: copyrighted works are never full-text', () => {
    const problems: string[] = [];
    for (const [id, defs] of sourceDefs) {
      const l = defs[0].def.license;
      if (l.status === 'copyrighted' && l.usage === 'full-text') problems.push(`${id}: copyrighted but full-text`);
    }
    expect(problems).toEqual([]);
  });

  it('all URLs are absolute https links without whitespace', () => {
    const problems: string[] = [];
    for (const m of modules)
      for (const f of collect<{ url: string }>(m.value, m.id, hasUrl))
        if (!/^https:\/\/[^\s]+$/.test(f.value.url)) problems.push(`${f.path}: ${f.value.url}`);
    for (const s of BASE_SOURCES) if (s.url && !/^https:\/\/[^\s]+$/.test(s.url)) problems.push(`base ${s.id}: ${s.url}`);
    for (const x of [...SHARED_SOURCES, ...SHARED_AUTHORS, ...SHARED_SOURCES.map((s) => s.license)])
      if (x.url && !/^https:\/\/[^\s]+$/.test(x.url)) problems.push(`shared ${'id' in x ? x.id : 'license'}: ${x.url}`);
    expect(problems).toEqual([]);
  });
});

describe('quotations & summaries (spec §5–6)', () => {
  const entries: { module: string; entry: CommentaryEntry }[] = modules.flatMap((m) =>
    ((m.value as Partial<CuratedStudy>).commentary ?? []).map((entry) => ({ module: m.id, entry })),
  );

  it('every quotation is verified, located, linked and from a quotable source', () => {
    const problems: string[] = [];
    for (const { entry: e } of entries.filter((x) => x.entry.kind === 'quotation')) {
      const src = sourceById(e.sourceId);
      const url = e.url ?? e.provenance.citations.find((c) => c.url)?.url ?? src?.url;
      const locator = e.locator ?? e.provenance.citations.find((c) => c.locator)?.locator;
      if (e.provenance.kind !== 'quotation') problems.push(`${e.id}: provenance.kind must be 'quotation'`);
      if (e.provenance.verification !== 'verified') problems.push(`${e.id}: quotation not verified`);
      if (!locator) problems.push(`${e.id}: quotation has no locator`);
      if (!url) problems.push(`${e.id}: quotation has no URL`);
      if (src && !['full-text', 'excerpt'].includes(src.license.usage)) problems.push(`${e.id}: source ${src.id} does not permit quotation (${src.license.usage})`);
      if (e.text.split(/\s+/).length > 120) problems.push(`${e.id}: quotation longer than 120 words`);
    }
    expect(problems).toEqual([]);
  });

  it('summaries are labelled as summaries/synthesis and never presented as quotations', () => {
    const problems: string[] = [];
    for (const { entry: e } of entries.filter((x) => x.entry.kind === 'summary')) {
      if (!['summary', 'synthesis'].includes(e.provenance.kind)) problems.push(`${e.id}: summary with provenance.kind ${e.provenance.kind}`);
      if (/^\s*["“‘']/.test(e.text) && /["”’']\s*$/.test(e.text)) problems.push(`${e.id}: summary text is wrapped in quotation marks`);
    }
    expect(problems).toEqual([]);
  });

  it('no verified quotation anywhere cites a summary-only or metadata-only source', () => {
    const problems: string[] = [];
    for (const m of modules)
      walk(m.value, m.id, (o, p) => {
        const prov = o as { kind?: string; verification?: string; citations?: { sourceId: string }[] };
        if (prov.kind === 'quotation' && Array.isArray(prov.citations))
          for (const c of prov.citations) {
            const src = sourceById(c.sourceId);
            if (src && ['summary-only', 'metadata-only'].includes(src.license.usage)) problems.push(`${p}: quotes ${src.id} (${src.license.usage})`);
          }
      });
    expect(problems).toEqual([]);
  });
});

describe('Scripture references (checked against the bundled BSB)', () => {
  it('every PassageRef and VerseRef in the library exists', async () => {
    const problems: string[] = [];
    for (const m of modules) {
      for (const f of collect<PassageRef>(m.value, m.id, isPassageRef)) {
        const why = await passageProblems(f.value);
        if (why) problems.push(`${f.path} ${refKey(f.value)}: ${why}`);
      }
      for (const f of collect<VerseRef>(m.value, m.id, isVerseRef)) {
        const info = tryGetBook(f.value.book);
        if (!info || f.value.chapter < 1 || f.value.chapter > info.chapters) {
          problems.push(`${f.path}: invalid ${f.value.book} ${f.value.chapter}`);
          continue;
        }
        const n = await verseCount(f.value.book, f.value.chapter);
        if (f.value.verse < 1 || f.value.verse > n) problems.push(`${f.path}: ${f.value.book} ${f.value.chapter}:${f.value.verse} (chapter has ${n})`);
      }
    }
    expect(problems).toEqual([]);
  }, 60_000);
});

describe('key words (checked against the bundled translations and lexicon)', () => {
  const passageCache = new Map<string, Map<string, string>>();
  async function textOf(v: VerseRef, t: TranslationId): Promise<string | undefined> {
    const key = `${t}:${v.book}.${v.chapter}`;
    if (!passageCache.has(key)) {
      const p = await providers.scripture.getPassage({ book: v.book, startChapter: v.chapter }, t);
      const map = new Map<string, string>();
      for (const ch of p.chapters) for (const verse of ch.verses) map.set(String(verse.ref.verse), verseText(verse));
      passageCache.set(key, map);
    }
    return passageCache.get(key)!.get(String(v.verse));
  }

  let keyWords: { module: string; kw: CuratedStudy['keyWords'][number] }[] = [];
  beforeAll(() => {
    keyWords = studies.flatMap((s) => s.keyWords.map((kw) => ({ module: s.id, kw })));
  });

  it('anchor phrases occur verbatim (case-insensitive) in each listed translation', async () => {
    const problems: string[] = [];
    for (const { module, kw } of keyWords)
      for (const a of kw.anchors)
        for (const [t, phrase] of Object.entries(a.phrases) as [TranslationId, string][]) {
          const text = await textOf(a.verse, t);
          const ref = formatRef({ book: a.verse.book, startChapter: a.verse.chapter, startVerse: a.verse.verse, endVerse: a.verse.verse, endChapter: a.verse.chapter });
          if (!text) problems.push(`${module} ${kw.id}: ${ref} missing in ${t}`);
          else if (!text.toLowerCase().includes(phrase.toLowerCase())) problems.push(`${module} ${kw.id}: "${phrase}" not in ${t} ${ref}`);
        }
    expect(problems).toEqual([]);
  }, 60_000);

  it('Strong’s numbers exist in the lexicon and lemmas agree with it', async () => {
    const problems: string[] = [];
    for (const { module, kw } of keyWords) {
      const entry = await providers.lexicon.getEntry(kw.strong);
      if (!entry) {
        problems.push(`${module} ${kw.id}: no lexicon entry for ${kw.strong}`);
        continue;
      }
      if (stripMarks(entry.lemma) !== stripMarks(kw.lemma)) problems.push(`${module} ${kw.id}: lemma ${kw.lemma} ≠ lexicon ${entry.lemma} (${kw.strong})`);
      const expected = getBook(kw.anchors[0]?.verse.book ?? 'GEN').testament === 'NT' ? 'greek' : undefined;
      if (expected && kw.language !== 'greek' && kw.language !== 'aramaic') problems.push(`${module} ${kw.id}: NT anchor but language ${kw.language}`);
    }
    expect(problems).toEqual([]);
  }, 60_000);
});
