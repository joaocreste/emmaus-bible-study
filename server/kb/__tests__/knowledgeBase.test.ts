/**
 * Knowledge base against the real data (kb/corpus, public/data, src/data/curated).
 * No network: remote commentary is disabled, or served by a fake fetch.
 */
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { formatRef, parseReference, refsOverlap } from '../../../src/domain/reference';
import type { PassageRef } from '../../../src/domain/models';
import type { EvidenceDraft } from '../../../src/inference/protocol';
import { corpusFingerprint, createKnowledgeBase, evidenceFullText, getKnowledgeBase, resetKnowledgeBase, searchQuery, type EmmausKnowledgeBase } from '../index';
import { familiesOf, requiredFamilies } from '../traditions';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const quiet = () => {};
const ref = (s: string): PassageRef => {
  const r = parseReference(s);
  if (!r) throw new Error(`bad reference ${s}`);
  return r;
};
const titles = (xs: EvidenceDraft[]) => xs.map((x) => x.title);
const mentions = (e: EvidenceDraft, r: PassageRef) => (e.refs ?? []).some((x) => x.book === r.book && refsOverlap(x, r));

let kb: EmmausKnowledgeBase;
const timings: Record<string, number> = {};

beforeAll(async () => {
  kb = createKnowledgeBase({ root: ROOT, allowRemote: false, log: quiet });
  const t = performance.now();
  await kb.ready();
  timings.readyShared = performance.now() - t;
}, 180_000);

afterAll(() => {
  // reported numbers (visible with --silent=false)
  console.log(`[kb test timings] ${JSON.stringify(Object.fromEntries(Object.entries(timings).map(([k, v]) => [k, Math.round(v * 10) / 10])))}`);
});

describe('corpora and stats', () => {
  it('indexes every corpus', () => {
    const { documents, corpora } = kb.stats();
    const ids = corpora.map((c) => c.id);
    for (const id of ['naves', 'torrey', 'easton', 'smith', 'tyndale-notes', 'tyndale-intros', 'lexicon', 'curated']) expect(ids).toContain(id);
    expect(corpora.find((c) => c.id === 'tyndale-notes')?.documents).toBe(16923);
    expect(corpora.find((c) => c.id === 'naves')!.documents).toBeGreaterThan(4000);
    expect(documents).toBe(corpora.reduce((n, c) => n + c.documents, 0));
  });

  it('exposes the documents by key', () => {
    expect(kb.document('naves:divorce')?.title).toBe('Nave’s Topical Bible (1896) — DIVORCE');
    expect(kb.document('easton:divorce')?.sourceId).toBe('eastons-bible-dictionary');
  });
});

describe('search', () => {
  it('“divorce” surfaces Nave’s DIVORCE, Easton’s Divorce and a Tyndale note on Matthew 19 / Mark 10', async () => {
    const t = performance.now();
    const hits = await kb.search('divorce');
    timings.searchDivorce = performance.now() - t;
    expect(hits.length).toBe(8);
    expect(titles(hits)).toContain('Nave’s Topical Bible (1896) — DIVORCE');
    expect(titles(hits)).toContain('Easton’s Bible Dictionary (1897) — Divorce');
    const notes = hits.filter((h) => h.kind === 'study-note');
    expect(notes.length).toBeGreaterThan(0);
    const central = [ref('Matthew 19:3-12'), ref('Mark 10:2-12')];
    const all = await kb.search('divorce', { kinds: ['study-note'], limit: 5 });
    expect([...notes, ...all].some((n) => central.some((c) => mentions(n, c)))).toBe(true);
    // evidence shape
    const nave = hits.find((h) => h.title.endsWith('DIVORCE'))!;
    expect(nave).toMatchObject({ kind: 'topical-index', sourceId: 'naves-topical-bible', authorId: 'orville-nave', quotable: true, locator: 's.v. DIVORCE' });
    expect(nave.url).toMatch(/^https:\/\/www\.ccel\.org\/ccel\/nave\//);
    expect(nave.text).toContain('Matthew 19:3–12');
    expect(mentions(nave, ref('Matthew 19:3-12'))).toBe(true);
  });

  it('keeps results diverse (no corpus takes more than a third, no near-duplicate notes)', async () => {
    const hits = await kb.search('forgiveness of sins', { limit: 9 });
    const bySource = new Map<string, number>();
    for (const h of hits) bySource.set(h.sourceId, (bySource.get(h.sourceId) ?? 0) + 1);
    expect(new Set(hits.map((h) => h.kind)).size).toBeGreaterThanOrEqual(4);
    expect(Math.max(...bySource.values())).toBeLessThanOrEqual(3);
  });

  it('filters by kind and by passage', async () => {
    const dict = await kb.search('baptism', { kinds: ['dictionary'], limit: 5 });
    expect(dict.length).toBe(5);
    expect(dict.every((d) => d.kind === 'dictionary')).toBe(true);

    const within = ref('Romans 8:1-4');
    const onPassage = await kb.search('law spirit', { within, limit: 8 });
    expect(onPassage.length).toBeGreaterThan(3);
    expect(onPassage.every((e) => mentions(e, within))).toBe(true);
    expect(onPassage.some((e) => e.kind === 'study-note')).toBe(true);

    const noWords = await kb.search('the', { within: ref('John 3:16'), limit: 4 });
    expect(noWords.length).toBeGreaterThan(0);
    expect(noWords[0].kind).toBe('study-note');
  });

  it('searches classic commentary on a passage when asked for kind “commentary”', async () => {
    const hits = await kb.search('condemnation flesh', { kinds: ['commentary'], within: ref('Romans 8:1-4'), limit: 4 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => h.kind === 'commentary' && mentions(h, ref('Romans 8:1-4')))).toBe(true);
    expect(hits.map((h) => h.sourceId)).toEqual(expect.arrayContaining(['calvin-commentaries']));
    for (const h of hits) expect(evidenceFullText(h)).toContain(h.text.replace(/^\[…\] /, '').replace(/ \[…\]$/, ''));
    const mixed = await kb.search('condemnation', { kinds: ['commentary', 'study-note'], within: ref('Romans 8:1'), limit: 6 });
    expect(new Set(mixed.map((h) => h.kind))).toEqual(new Set(['commentary', 'study-note']));
  });

  it('tolerates a typo and finds Strong’s numbers', async () => {
    expect(titles(await kb.search('divorse'))).toContain('Nave’s Topical Bible (1896) — DIVORCE');
    const g630 = await kb.search('G630');
    expect(g630[0]).toMatchObject({ kind: 'lexicon', strong: 'G630' });
  });

  it('excerpts long documents around the query and keeps the full text available', async () => {
    const [hit] = await kb.search('infant baptism children household', { kinds: ['dictionary'], limit: 1 });
    expect(hit.text.length).toBeLessThanOrEqual(1700);
    const full = evidenceFullText(hit);
    expect(full.length).toBeGreaterThanOrEqual(hit.text.length);
    // every excerpted sentence is a verbatim span of the full text
    const body = hit.text.replace(/^\[…\] /, '').replace(/ \[…\]$/, '');
    expect(full).toContain(body);
  });

  it('marks curated synthesis as not quotable and public-domain works as quotable', async () => {
    const hits = await kb.search('anxiety worry', { limit: 12 });
    const curated = hits.find((h) => h.kind === 'curated');
    expect(curated).toBeDefined();
    expect(curated!.quotable).toBe(false);
    expect(curated!.sourceId).toBe('emmaus-curated-library');
    const pd = hits.find((h) => h.kind === 'topical-index' || h.kind === 'dictionary' || h.kind === 'study-note');
    expect(pd?.quotable).toBe(true);
  });

  it('answers in well under 50 ms', async () => {
    const queries = ['divorce', 'anxiety', 'justification by faith', 'kingdom of god parables', 'Abraham covenant circumcision', 'love', 'baptism of infants', 'resurrection body'];
    const t = performance.now();
    for (const q of queries) await kb.search(q);
    timings.searchAvg = (performance.now() - t) / queries.length;
    const t2 = performance.now();
    await kb.search('law', { within: ref('Romans 8') });
    timings.searchWithin = performance.now() - t2;
    expect(timings.searchAvg).toBeLessThan(50);
  });
});

describe('topics', () => {
  it('“anxiety” finds Nave’s CARE (alias) and the curated anxiety topic', async () => {
    const t = performance.now();
    const hits = await kb.topics('anxiety');
    timings.topicsAnxiety = performance.now() - t;
    expect(titles(hits)).toContain('Nave’s Topical Bible (1896) — CARE');
    const curated = hits.find((h) => h.kind === 'curated');
    expect(curated?.title).toMatch(/Anxiety/);
    expect(curated?.text).toMatch(/Matthew 6:25/);
    expect(titles(hits)).not.toContain('Nave’s Topical Bible (1896) — BETH-CAR');
  });

  it('“divorce” opens Nave’s DIVORCE, not the Marriage topic', async () => {
    const [first, ...rest] = await kb.topics('divorce');
    expect(first.title).toBe('Nave’s Topical Bible (1896) — DIVORCE');
    expect(titles(rest)).toContain('Torrey’s New Topical Textbook (1897) — Divorce');
    expect(first.text).toMatch(/^General scriptures concerning: Exodus 21:7–11/);
  });

  it('maps reader vocabulary to the indexes’ headings (money/wealth → RICHES)', async () => {
    expect(titles(await kb.topics('wealth'))).toContain('Nave’s Topical Bible (1896) — RICHES');
    expect(titles(await kb.topics('money'))).toContain('Nave’s Topical Bible (1896) — RICHES');
    expect(titles(await kb.topics('What does the Bible say about divorce and remarriage?'))[0]).toBe('Nave’s Topical Bible (1896) — DIVORCE');
  });

  it('shows the matching groups of a very long entry first and lists only the references shown', async () => {
    const hits = await kb.topics('jesus resurrection');
    const jesus = hits.find((h) => h.title.includes('JESUS'));
    if (jesus) {
      expect(jesus.text.length).toBeLessThan(2600);
      expect(jesus.text.toLowerCase()).toContain('resurrection');
      expect(evidenceFullText(jesus).length).toBeGreaterThan(50_000);
    }
    const hits2 = await kb.topics('the resurrection');
    expect(hits2.length).toBeGreaterThan(0);
  });
});

describe('scripture and original text', () => {
  it('passage("Matthew 19:3-12") is verse-numbered BSB text', async () => {
    const p = await kb.passage(ref('Matthew 19:3-12'), 'BSB');
    expect(p).not.toBeNull();
    expect(p!.kind).toBe('scripture');
    expect(p!.sourceId).toBe('bsb');
    expect(p!.text.startsWith('19:3 Then some Pharisees came and tested Him by asking, “Is it lawful for a man to divorce his wife for any reason?”')).toBe(true);
    expect(p!.text).toMatch(/\n19:12 [^\n]+$/);
    expect(p!.title).toBe('Matthew 19:3–12 (BSB)');
    expect(p!.quotable).toBe(true);
  });

  it('caps long passages at 60 verses and says so', async () => {
    const p = await kb.passage(ref('Matthew 5-7'), 'KJV');
    expect(p!.text.split('\n').filter((l) => /^\d+:\d+ /.test(l)).length).toBe(60);
    expect(p!.text).toMatch(/Only the first 60 of 111 verses are shown/);
    expect(formatRef(p!.refs![0])).toBe('Matthew 5:1–6:12');
  });

  it('originalText gives Strong’s, transliteration, gloss and parsing', async () => {
    const o = await kb.originalText(ref('Matthew 19:9'));
    expect(o!.kind).toBe('original-text');
    expect(o!.sourceId).toBe('stepbible-tagnt');
    expect(o!.text).toContain('ἀπολύσῃ (apolusē G630 “may divorce” V-AAS-3S)');
    const heb = await kb.originalText(ref('Deuteronomy 24:1'));
    expect(heb!.text).toContain('H3748');
  });
});

describe('lexicon and concordance', () => {
  it('lexicon("divorce") ranks the words glossed “divorce” (G630, G647, H3748) with their frequency', async () => {
    const hits = await kb.lexicon('divorce', 6);
    const strongs = hits.map((h) => h.strong);
    expect(strongs).toEqual(expect.arrayContaining(['G630', 'G647', 'H3748']));
    for (const h of hits) expect(h.text).toMatch(/Occurs in \d+ verses?/);
    const apoluo = hits.find((h) => h.strong === 'G630')!;
    expect(apoluo.title).toBe('ἀπολύω (apoluō, G630) — “divorce”');
    expect(apoluo.sourceId).toBe('stepbible-tbesg');
    expect(apoluo.text).toContain('sense G630H');
  });

  it('lexicon by Strong’s number and by an English phrase', async () => {
    const [e] = await kb.lexicon('G0630');
    expect(e).toMatchObject({ kind: 'lexicon', strong: 'G630', sourceId: 'stepbible-tbesg' });
    expect((await kb.lexicon('H3748'))[0].title).toContain('ke.ri.tut');
    expect((await kb.lexicon('love')).slice(0, 4).map((h) => h.strong)).toEqual(expect.arrayContaining(['G25', 'G26']));
    expect((await kb.lexicon('put away'))[0].title).toContain('“to put away”');
  });

  it('occurrences lists counts, spread by book and per-sense verses', async () => {
    const o = await kb.occurrences('G630', 40);
    expect(o).toMatchObject({ kind: 'occurrences', strong: 'G630', sourceId: 'stepbible-tagnt' });
    expect(o!.text).toMatch(/occurs in \d+ verses \(\d+ words\)/);
    expect(o!.text).toMatch(/Sense G630H “to release: divorce” \(\d+ verses\): Matt 1:19; Matt 5:31/);
    expect(o!.refs!.length).toBe(40);
    expect(await kb.occurrences('not-a-number')).toBeNull();
  });
});

describe('cross-references, commentary, introductions', () => {
  it('crossReferences(John 3:16): best-voted first, deduplicated, never the verse itself', async () => {
    const [x] = await kb.crossReferences(ref('John 3:16'), 20);
    expect(x).toMatchObject({ kind: 'cross-references', sourceId: 'openbible-xrefs', title: 'Cross-references for John 3:16 (OpenBible.info)' });
    const listed = x.text.split('\n')[1].split('; ');
    // the bundle keeps the 15 best-voted per verse
    expect(listed.length).toBe(15);
    expect(listed[0]).toMatch(/^Romans 5:8 \(\d+ votes\)$/);
    const votes = listed.map((l) => Number(/\((\d+) votes?\)/.exec(l)![1]));
    expect([...votes].sort((a, b) => b - a)).toEqual(votes);
    expect(new Set(listed.map((l) => l.replace(/ \(.*/, ''))).size).toBe(listed.length);
    expect(x.refs!.slice(1).some((r) => r.book === 'JHN' && refsOverlap(r, ref('John 3:16')))).toBe(false);
    // several verses: one item per source verse
    const many = await kb.crossReferences(ref('Matthew 19:3-6'));
    expect(many.length).toBeGreaterThan(1);
    expect(many.every((m) => /^Cross-references for Matthew 19:\d+ /.test(m.title))).toBe(true);
  });

  it('commentary on Romans 8:1 includes Tyndale and Calvin (and Henry’s continuator John Evans)', async () => {
    const c = await kb.commentary(ref('Romans 8:1'));
    const tyndale = c.find((e) => e.sourceId === 'tyndale-open-study-notes');
    const calvin = c.find((e) => e.sourceId === 'calvin-commentaries');
    expect(tyndale).toMatchObject({ kind: 'study-note', authorId: 'tyndale-house-publishers', quotable: true });
    expect(tyndale!.text).toMatch(/no condemnation/);
    expect(calvin).toMatchObject({ kind: 'commentary', authorId: 'calvin', quotable: true });
    expect(calvin!.text.length).toBeLessThanOrEqual(1650);
    expect(evidenceFullText(calvin!).length).toBeGreaterThan(calvin!.text.length);
    const henry = c.filter((e) => e.sourceId === 'matthew-henry-commentary');
    expect(henry.length).toBeGreaterThan(0);
    expect(henry.every((h) => h.authorId === 'john-evans')).toBe(true);
    // Henry himself wrote the Gospels
    const matt = await kb.commentary(ref('Matthew 19:3'), ['matthew-henry']);
    expect(matt.every((h) => h.authorId === 'matthew-henry')).toBe(true);
    // a filter by commentary id
    const onlyCalvin = await kb.commentary(ref('Romans 8:3'), ['calvin']);
    expect(onlyCalvin.every((e) => e.sourceId === 'calvin-commentaries')).toBe(true);
    expect(onlyCalvin[0].text.startsWith('[…] 3.')).toBe(true);
  });

  it('bookIntroduction splits Tyndale’s introduction into sections', async () => {
    const intro = await kb.bookIntroduction('ROM');
    expect(intro.length).toBeGreaterThan(4);
    expect(intro.every((s) => s.kind === 'book-introduction' && s.sourceId === 'tyndale-open-study-notes')).toBe(true);
    expect(titles(intro)).toContain('Tyndale introduction to Romans — Setting');
  });
});

describe('index cache', () => {
  let dir: string;
  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'emmaus-kb-'));
  });
  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('builds once, then later instances load the serialised index (warm ready() < 3 s)', async () => {
    const cold = createKnowledgeBase({ root: ROOT, allowRemote: false, cacheDir: dir, log: quiet });
    let t = performance.now();
    await cold.ready();
    timings.readyCold = performance.now() - t;
    expect(cold.readyInfo?.source).toBe('built');
    const files = (await readdir(dir)).filter((f) => /^index-[0-9a-f]+\.json$/.test(f));
    expect(files.length).toBe(1);
    timings.cacheMB = (cold.readyInfo?.cacheBytes ?? 0) / 1e6;

    const warm = createKnowledgeBase({ root: ROOT, allowRemote: false, cacheDir: dir, log: quiet });
    t = performance.now();
    await warm.ready();
    timings.readyWarm = performance.now() - t;
    expect(warm.readyInfo?.source).toBe('cache');
    expect(warm.stats()).toEqual(cold.stats());
    expect(timings.readyWarm).toBeLessThan(3000);
    // same answers from the cached index
    expect(titles(await warm.search('divorce'))).toEqual(titles(await cold.search('divorce')));
  }, 180_000);

  it('ready() is idempotent and getKnowledgeBase is a per-root singleton', async () => {
    const a = getKnowledgeBase(ROOT, { log: quiet, allowRemote: false });
    expect(getKnowledgeBase(ROOT)).toBe(a);
    await Promise.all([a.ready(), a.ready()]);
    expect(a.stats().documents).toBe(kb.stats().documents);
  }, 180_000);
});

describe('remote commentary disk cache', () => {
  let dir: string;
  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'emmaus-kb-remote-'));
  });
  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  const FIXTURE = { chapter: { number: 7, content: [{ type: 'verse', number: 10, content: ['FIXTURE — test text standing in for a JFB note on 1 Corinthians 7:10.'] }, { type: 'verse', number: 12, content: ['FIXTURE — second note.'] }] } };

  it('fetches a non-bundled chapter once and serves it from .kb-cache/commentary afterwards', async () => {
    const urls: string[] = [];
    const fakeFetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      urls.push(url);
      if (url.endsWith('/jamieson-fausset-brown/1CO/7.json')) return new Response(JSON.stringify(FIXTURE), { status: 200, headers: { 'content-type': 'application/json' } });
      return new Response('not found', { status: 404 });
    }) as typeof fetch;
    // index cache in the shared default dir (already warm); commentary cache in a temp dir via cacheDir
    const first = createKnowledgeBase({ root: ROOT, allowRemote: true, cacheDir: dir, indexCache: false, remoteFetch: fakeFetch, log: quiet });
    const a = await first.commentary(ref('1 Corinthians 7:10'), ['jfb']);
    expect(urls).toEqual(['https://bible.helloao.org/api/c/jamieson-fausset-brown/1CO/7.json']);
    expect(a).toHaveLength(1);
    expect(a[0]).toMatchObject({ kind: 'commentary', sourceId: 'jfb-commentary', authorId: 'jamieson-fausset-brown', title: 'Jamieson-Fausset-Brown Commentary on 1 Corinthians 7:10–11' });

    const offline = (async () => {
      throw new Error('network down');
    }) as typeof fetch;
    const second = createKnowledgeBase({ root: ROOT, allowRemote: true, cacheDir: dir, indexCache: false, remoteFetch: offline, log: quiet });
    const b = await second.commentary(ref('1 Corinthians 7:10'), ['jfb']);
    expect(b.map((e) => e.text)).toEqual(a.map((e) => e.text));
  });

  it('never goes to the network when remote fallback is off', async () => {
    const c = await kb.commentary(ref('1 Corinthians 7:10'));
    expect(c.every((e) => e.sourceId === 'tyndale-open-study-notes')).toBe(true);
    expect(c.length).toBeGreaterThan(0);
  });
});

describe('holdings, versions and freshness', () => {
  it('reports which traditions its texts represent (and which it lacks) and a version', () => {
    const h = kb.holdings();
    const families = h.traditions.map((t) => t.family);
    for (const f of ['reformed', 'lutheran', 'anglican']) expect(families).toContain(f);
    expect(h.traditions.find((t) => t.family === 'reformed')!.works).toEqual(expect.arrayContaining(['Westminster Confession of Faith (1646)']));
    expect(h.traditions.every((t) => t.works.length > 0)).toBe(true);
    for (const m of h.missing) expect(h.traditions.map((t) => t.label)).not.toContain(m);
    expect(h.kinds.confession).toBeGreaterThan(0);
    expect(h.kinds.commentary).toBeUndefined(); // served per passage, not indexed
    expect(kb.stats().version).toMatch(/^[0-9a-f]{8,}$/);
  });

  it('confession evidence carries its tradition', async () => {
    const hits = await kb.search('divorce adultery marriage', { kinds: ['confession'], limit: 6 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => typeof h.tradition === 'string' && h.tradition.length > 0)).toBe(true);
  });

  it('commentary with a query excerpts a long section where it discusses the point (Calvin on Gen 1:26 → “plurality of Persons”)', async () => {
    const ref = { book: 'GEN', startChapter: 1, startVerse: 26, endChapter: 1, endVerse: 26 } as const;
    const [top] = await kb.commentary(ref, ['calvin']);
    const [focused] = await kb.commentary(ref, ['calvin'], 'plurality of Persons in the Godhead');
    expect(top.text).not.toMatch(/plurality of Persons/);
    expect(focused.text).toMatch(/plurality of Persons/);
    const { excerptedCommentaryNote } = await import('../../inference/research');
    expect(excerptedCommentaryNote([top], undefined)).toMatch(/call commentary again .* with `query`/);
  });

  it('a search restricted to one tradition returns only that tradition’s texts (eval2: Lutheran/Orthodox texts missed)', async () => {
    const { familiesOf } = await import('../traditions');
    for (const family of ['lutheran', 'orthodox', 'baptist']) {
      const hits = await kb.search('marriage divorce', { kinds: ['confession'], limit: 6, traditions: [family] });
      if (!kb.holdings().traditions.some((t) => t.family === family)) continue;
      expect(hits.length, family).toBeGreaterThan(0);
      for (const h of hits) {
        const author = h.authorId ?? kb.providers.sources.getSource(h.sourceId)?.authorIds[0];
        const fams = [...familiesOf(h.tradition), ...familiesOf(author ? kb.providers.sources.getAuthor(author)?.tradition : '')];
        expect(fams, `${family}: ${h.title}`).toContain(family);
      }
    }
  });

  it('the full text travels with the draft object, never with a copy or a same-titled sibling', async () => {
    const [hit] = await kb.search('infant baptism children household', { kinds: ['dictionary'], limit: 1 });
    expect(evidenceFullText(hit).length).toBeGreaterThan(hit.text.length);
    expect(evidenceFullText({ ...hit })).toBe(hit.text);
  });

  it('notices corpus files added or changed (size / mtime fingerprint)', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'emmaus-corpus-'));
    try {
      const corpus = join(dir, 'kb', 'corpus');
      expect(await corpusFingerprint(dir)).toBe('none');
      await mkdir(corpus, { recursive: true });
      await writeFile(join(corpus, 'a.json'), '{}');
      const one = await corpusFingerprint(dir);
      await writeFile(join(corpus, 'b.json'), '{"x":1}');
      const two = await corpusFingerprint(dir);
      expect(two).not.toBe(one);
      expect(await corpusFingerprint(dir)).toBe(two);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('resetKnowledgeBase makes the next getKnowledgeBase a fresh instance', () => {
    const a = getKnowledgeBase(ROOT, { log: quiet, allowRemote: false });
    resetKnowledgeBase(ROOT);
    const b = getKnowledgeBase(ROOT, { log: quiet, allowRemote: false });
    expect(b).not.toBe(a);
    expect(getKnowledgeBase(ROOT)).toBe(b);
  });
});

describe('search quality for reader questions', () => {
  it('question phrasing and Bible-filler words do not outrank the subject', async () => {
    expect(searchQuery('What does the Bible say about suicide?')).toBe('suicide');
    expect(searchQuery('Bible')).toBe('Bible');
    const hits = await kb.search('what does the bible say about suicide', { limit: 5 });
    expect(titles(hits).slice(0, 2)).toContain('Nave’s Topical Bible (1896) — SUICIDE');
  });

  it('maps reader vocabulary to the heading Nave’s files it under', async () => {
    expect(titles(await kb.topics('homosexuality'))[0]).toBe('Nave’s Topical Bible (1896) — SODOMY');
  });

  it('English lexicon lookups put common words before names', async () => {
    const glosses = (await kb.lexicon('grace')).map((d) => /— “(.*)”$/.exec(d.title)?.[1] ?? '');
    expect(glosses.slice(0, 3).every((g) => !/^\p{Lu}/u.test(g))).toBe(true);
  });
});

describe('tradition families', () => {
  it('matches labels, including registry author traditions, without apostrophes or adjectives confusing them', () => {
    expect(familiesOf('Reformed (Presbyterian, PCA)')).toEqual(['reformed']);
    expect(familiesOf('Dutch Reformed (Remonstrant)')).toEqual(['arminian']);
    expect(familiesOf('Greek Church Father (Eastern Orthodox)')).toEqual(expect.arrayContaining(['orthodox', 'patristic']));
    expect(familiesOf('Orthodox Presbyterian')).toEqual(['reformed']);
    expect(familiesOf('Methodist Episcopal Church')).toEqual(['arminian']);
    expect(familiesOf('Roman Catholic')).toEqual(['catholic']);
    expect(familiesOf('Anabaptist')).toEqual(['anabaptist']);
    expect(requiredFamilies('Protestant')).toMatchObject({ required: [], accepted: expect.arrayContaining(['protestant', 'reformed', 'lutheran']) });
    expect(requiredFamilies('Reformed Baptist')).toMatchObject({ required: ['reformed', 'baptist'] });
  });
});

describe('texts held in parts (read_document)', () => {
  const CE_DIVORCE = 'The Catholic Encyclopedia (1907–1914) — Divorce (in Moral Theology), 1909';

  it('partsOf says which part of how many a search result is', async () => {
    const hits = await kb.search('Pauline privilege dissolved in favour of the faith', { kinds: ['dictionary'], limit: 8 });
    const part = hits.map((h) => kb.partsOf!(h.title)).find((p) => p && /Divorce \(in Moral Theology\)/.test(p.title));
    expect(part).toBeTruthy();
    expect(part!.total).toBeGreaterThan(20);
    expect(kb.partsOf!('Easton’s Bible Dictionary (1897) — Divorce')).toBeNull();
  });

  it('opens parts by number, by query and by the bare heading, and lists every part', async () => {
    const byNumber = await kb.documentParts!(CE_DIVORCE, { parts: [1, 999] });
    if (!byNumber.found) throw new Error('not found');
    expect(byNumber.drafts).toHaveLength(1);
    expect(byNumber.drafts[0].title).toMatch(/\(part 1\)/);
    expect(byNumber.drafts[0].text).toMatch(/in favour of the Faith/); // the full list of propositions
    expect(byNumber.unknownParts).toEqual([999]);
    expect(byNumber.contents).toHaveLength(byNumber.total);
    expect(byNumber.contents[0]).toMatch(/^part 1: /);

    const byQuery = await kb.documentParts!('Divorce (in Moral Theology), 1909', { query: 'Pauline Privilege' });
    if (!byQuery.found) throw new Error('not found');
    expect(byQuery.drafts.length).toBeGreaterThan(0);
    expect(byQuery.drafts.some((d) => /Pauline Privilege/i.test(d.text))).toBe(true);
    expect(byQuery.drafts.every((d) => d.tradition === 'Catholic')).toBe(true);
  });

  it('an unknown or ambiguous title opens nothing (and lists candidates when there are some)', async () => {
    expect(await kb.documentParts!('No Such Article Anywhere')).toMatchObject({ found: false, candidates: [] });
    const vague = await kb.documentParts!('Catholic Encyclopedia');
    expect(vague.found).toBe(false);
    if (!vague.found) expect(vague.candidates.length).toBeGreaterThan(1);
  });
});
