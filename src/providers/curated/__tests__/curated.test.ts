import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CuratedStudy, CuratedTopic, PassageRef } from '../../../domain/models';
import { parseRefKey } from '../../../domain/reference';
import { synthesis, text } from '../../../domain/provenance';
import { createCuratedProviders, createCuratedProvidersFrom, type CuratedTopicMatch } from '..';
import { FIXTURE_ANXIETY, FIXTURE_GRACE, FIXTURE_ROMANS_8 } from '../../../engine/__tests__/fixtures/studies';

const ref = (k: string): PassageRef => parseRefKey(k)!;

/** Minimal study shell for repository ranking tests. */
function shell(id: string, kind: 'passage' | 'topic', refs: string[], topics: string[] = []): CuratedStudy {
  return {
    id,
    kind,
    title: id,
    match: { references: refs.map(ref), topics },
    keyWords: [],
    crossReferences: [],
    context: [],
    theology: [],
    perspectives: [],
    commentary: [],
    sermons: [],
    verseNotes: [],
    concepts: [],
    suggestedQuestions: [],
    sources: [],
    authors: [],
  };
}

afterEach(() => vi.restoreAllMocks());

describe('createCuratedProviders', () => {
  it('loads the bundled library without throwing (robust to an empty library)', () => {
    const p = createCuratedProviders();
    expect(Array.isArray(p.studies.list())).toBe(true);
    expect(p.sources.getSource('bsb')?.title).toBe('Berean Standard Bible');
    expect(p.sources.getAuthor('calvin')?.name).toBe('John Calvin');
  });
  it('works with zero modules', async () => {
    const p = createCuratedProvidersFrom({ studies: [], topics: [] });
    expect(p.studies.findByPassage(ref('ROM.8'))).toBeUndefined();
    expect(p.studies.findByTopic('grace')).toBeUndefined();
    expect(await p.topics.listTopics()).toEqual([]);
    expect(await p.sermons.findSermons({ topic: 'grace' })).toEqual([]);
  });
});

describe('CuratedStudyRepository.findByPassage', () => {
  const studies = [
    shell('rom-8', 'passage', ['ROM.8']),
    shell('rom-8-28', 'passage', ['ROM.8.28-39']),
    shell('topic-with-ref', 'topic', ['ROM.8.28']),
    shell('john-1', 'passage', ['JHN.1', 'JHN.20.31']),
  ];
  const repo = createCuratedProvidersFrom({ studies, topics: [] }).studies;
  it.each([
    ['ROM.8.28', 'rom-8-28'],
    ['ROM.8.1', 'rom-8'],
    ['ROM.8', 'rom-8'],
    ['ROM.8.30-31', 'rom-8-28'],
    ['ROM.8-9', 'rom-8'],
    ['JHN.1.1', 'john-1'],
    ['JHN.20.31', 'john-1'],
  ])('%s → %s', (k, id) => {
    expect(repo.findByPassage(ref(k))?.id).toBe(id);
  });
  it('never returns topic studies, unrelated passages, or a chapter study for a whole book', () => {
    expect(repo.findByPassage(ref('GEN.1'))).toBeUndefined();
    expect(repo.findByPassage(ref('ROM'))).toBeUndefined();
    expect(createCuratedProvidersFrom({ studies: [shell('t', 'topic', ['ROM.8'])], topics: [] }).studies.findByPassage(ref('ROM.8'))).toBeUndefined();
  });
});

describe('CuratedStudyRepository.findByTopic', () => {
  const studies = [
    shell('romans-8', 'passage', ['ROM.8'], ['no condemnation', 'life in the spirit', 'suffering']),
    shell('grace', 'topic', [], ['grace', 'unmerited favor', 'amazing grace']),
    shell('suffering', 'topic', [], ['suffering', 'why does god allow suffering', 'problem of evil']),
  ];
  const repo = createCuratedProvidersFrom({ studies, topics: [] }).studies;
  it.each([
    ['Grace', 'grace'],
    ['What does the Bible say about grace?', 'grace'],
    ['Tell me about unmerited favor', 'grace'],
    ['Why does God allow suffering?', 'suffering'],
    ['suffering', 'suffering'], // topic study wins the tie with a passage study
    ['the problem of evil', 'suffering'],
    ['Life in the Spirit', 'romans-8'],
    ['study no condemnation', 'romans-8'],
  ])('%s → %s', (q, id) => {
    expect(repo.findByTopic(q)?.id).toBe(id);
  });
  it('returns nothing for unrelated queries', () => {
    expect(repo.findByTopic('quantum physics')).toBeUndefined();
    expect(repo.findByTopic('')).toBeUndefined();
  });
});

describe('SourceRegistry', () => {
  it('merges base and curated sources/authors, deduplicated by id', () => {
    const p = createCuratedProvidersFrom({ studies: [FIXTURE_ROMANS_8, FIXTURE_GRACE], topics: [] });
    expect(p.sources.getSource('fixture-keller-book')?.type).toBe('book');
    const ids = p.sources.allSources().map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('keeps the first definition and warns when two definitions of an id differ', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const a = { ...shell('a', 'passage', ['ROM.8']), sources: [{ id: 'dup', type: 'book' as const, title: 'First', authorIds: [], license: { status: 'copyrighted' as const, name: 'x', usage: 'summary-only' as const } }] };
    const b = { ...shell('b', 'passage', ['JHN.1']), sources: [{ id: 'dup', type: 'book' as const, title: 'Second', authorIds: [], license: { status: 'copyrighted' as const, name: 'x', usage: 'summary-only' as const } }] };
    const same = { ...shell('c', 'passage', ['PSA.23']), sources: [{ license: { usage: 'summary-only' as const, name: 'x', status: 'copyrighted' as const }, authorIds: [], title: 'First', type: 'book' as const, id: 'dup' }] };
    const p = createCuratedProvidersFrom({ studies: [a, b, same], topics: [] });
    expect(p.sources.getSource('dup')?.title).toBe('First');
    expect(warn).toHaveBeenCalledTimes(1); // key order differences are not conflicts
    expect(String(warn.mock.calls[0][0])).toMatch(/dup/);
  });

  const withAuthor: CuratedStudy = {
    ...shell('x', 'passage', ['ROM.8']),
    authors: [{ id: 'elisabeth-elliot', name: 'Elisabeth Elliot', era: 'contemporary', tradition: 'Evangelical', description: 'Test author.' }],
  };
  const registry = createCuratedProvidersFrom({ studies: [withAuthor], topics: [] }).sources;
  it.each([
    ['What did Tim Keller say about this?', 'tim-keller'],
    ['keller', 'tim-keller'],
    ['Show me what Timothy Keller says', 'tim-keller'],
    ['What did Matthew Henry write here?', 'matthew-henry'],
    ['C.S. Lewis on pain', 'cs-lewis'],
    ['what does c. s. lewis say', 'cs-lewis'],
    ['Augustine of Hippo', 'augustine'],
    ["Spurgeon's sermon", 'spurgeon'],
    ['N.T. Wright on justification', 'nt-wright'],
    ['What did Elliot write about suffering?', 'elisabeth-elliot'],
  ])('findAuthor(%s) → %s', (t, id) => {
    expect(registry.findAuthor(t)?.id).toBe(id);
  });
  it('matches whole words only', () => {
    expect(registry.findAuthor('Henryk Sienkiewicz wrote novels')).toBeUndefined();
    expect(registry.findAuthor('Calvinism and Arminianism')).toBeUndefined();
    expect(registry.findAuthor('')).toBeUndefined();
  });
});

describe('SermonProvider', () => {
  const p = createCuratedProvidersFrom({ studies: [FIXTURE_ROMANS_8, FIXTURE_GRACE], topics: [] });
  it('filters by topic, author and passage overlap', async () => {
    expect((await p.sermons.findSermons({ topic: 'grace' })).map((s) => s.id)).toEqual(['sermon-fixture']);
    expect((await p.sermons.findSermons({ authorId: 'spurgeon' })).map((s) => s.id)).toEqual(['sermon-fixture']);
    expect((await p.sermons.findSermons({ ref: ref('EPH.2') })).map((s) => s.id)).toEqual(['sermon-fixture']);
    expect(await p.sermons.findSermons({ ref: ref('ROM.8') })).toEqual([]);
    expect(await p.sermons.findSermons({ authorId: 'spurgeon', topic: 'anxiety' })).toEqual([]);
  });
});

describe('TopicProvider', () => {
  const p = createCuratedProvidersFrom({ studies: [FIXTURE_ROMANS_8, FIXTURE_GRACE], topics: [FIXTURE_ANXIETY] });
  it('lists index entries plus a synthesized entry per curated topic study', async () => {
    const all = await p.topics.listTopics();
    expect(all.map((t) => t.id).sort()).toEqual(['fixture-anxiety', 'fixture-grace']);
    const grace = all.find((t) => t.id === 'fixture-grace')!;
    expect(grace).toMatchObject({ studyId: 'fixture-grace', name: 'Grace', aliases: ['grace', 'unmerited favor', 'amazing grace'] });
  });
  it('scores alias matches and carries the entry extras', async () => {
    const [top] = (await p.topics.findTopics('I worry a lot')) as CuratedTopicMatch[];
    expect(top.id).toBe('fixture-anxiety');
    const [exact] = (await p.topics.findTopics('worry')) as CuratedTopicMatch[];
    expect(exact.score).toBe(1);
    expect(exact.anchor).toEqual(ref('PHP.4.4-9'));
    expect(exact.entry?.id).toBe('fixture-anxiety');
    expect(await p.topics.findTopics('quantum physics')).toEqual([]);
  });
  it('merges an index entry that links to a curated topic study instead of duplicating it', async () => {
    const linked: CuratedTopic = {
      id: 'grace-index',
      name: 'Grace',
      aliases: ['grace', 'favour'],
      topic: { name: 'Grace', definition: text('[fixture]', synthesis()), keyPassages: [] },
      studyId: 'fixture-grace',
    };
    const q = createCuratedProvidersFrom({ studies: [FIXTURE_GRACE], topics: [linked] });
    const all = await q.topics.listTopics();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ id: 'grace-index', studyId: 'fixture-grace' });
    expect(all[0].aliases).toEqual(expect.arrayContaining(['favour', 'unmerited favor']));
  });
});
