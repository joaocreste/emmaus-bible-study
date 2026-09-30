/**
 * Retrieval rules behind the QA fixes: a key word outranks a concept alias,
 * "the word behind" is only a key word that stands for the term, and topic
 * questions rank key passages by what they are about.
 */
import { describe, expect, it } from 'vitest';
import type { Concept, CuratedStudy, KeyWord, Study, TopicPassage } from '../../domain/models';
import { cite, lexical, synthesis, text } from '../../domain/provenance';
import { findTermInStudies, keyWordsForTerm, rankKeyPassages, searchStudy } from '../search';
import { FIXTURE_GRACE, FIXTURE_ROMANS_8 } from './fixtures/studies';

const fx = (s: string) => text(`[fixture] ${s}`, synthesis(cite('bsb', 'fixture')));

function kw(id: string, english: string, lemma: string, strong: string): KeyWord {
  return {
    id,
    strong,
    language: 'greek',
    lemma,
    transliteration: id,
    english,
    anchors: [],
    basicMeaning: '[fixture]',
    semanticRange: [],
    notableOccurrences: [],
    significance: fx('significance'),
    provenance: lexical(cite('stepbible-tbesg', strong)),
  };
}

function concept(id: string, aliases: string[], keyWordIds: string[]): Concept {
  return {
    id,
    label: id,
    aliases,
    answer: fx('answer'),
    primarySection: 'theology',
    verses: [],
    keyWordIds,
    crossReferenceIds: [],
    contextIds: [],
    themeIds: [],
    perspectiveSetIds: [],
    commentaryIds: [],
  };
}

// A topic study whose "But God" concept lists "flesh" as an alias, with unrelated key words (QA: Grace named σῴζω for "flesh").
const TOPIC_WITH_ALIAS: CuratedStudy = {
  ...FIXTURE_GRACE,
  id: 'fixture-topic-alias',
  keyWords: [kw('sozo', 'saved', 'σῴζω', 'G4982'), kw('eleos', 'mercy', 'ἔλεος', 'G1656')],
  concepts: [concept('but-god', ['flesh', 'but god', 'dead in trespasses'], ['sozo', 'eleos'])],
};

describe('findTermInStudies', () => {
  it('prefers a key word whose English is the term over a concept that only lists it (and ignores study kind)', () => {
    const hit = findTermInStudies([TOPIC_WITH_ALIAS, FIXTURE_ROMANS_8], 'flesh');
    expect(hit?.study.id).toBe('fixture-romans-8');
    expect(hit?.keyWord?.id).toBe('kw-sarx');
  });
  it('still finds a concept when no study has the key word', () => {
    const hit = findTermInStudies([TOPIC_WITH_ALIAS], 'flesh');
    expect(hit?.study.id).toBe('fixture-topic-alias');
    expect(hit?.keyWord).toBeUndefined();
  });
});

describe('keyWordsForTerm — "the word behind" must stand for the term', () => {
  const study = { keyWords: [...TOPIC_WITH_ALIAS.keyWords, kw('amnos', 'Lamb', 'ἀμνός', 'G286'), kw('theos', 'God', 'θεός', 'G2316')] };
  it('never falls back to the concept’s first key word', () => {
    expect(keyWordsForTerm(study, ['sozo', 'eleos'], 'flesh')).toEqual([]);
  });
  it('matches the term itself', () => {
    expect(keyWordsForTerm(study, ['sozo', 'eleos'], 'saved').map((k) => k.id)).toEqual(['sozo']);
  });
  it('matches a key word whose English is part of a longer phrase — but not "God" alone', () => {
    expect(keyWordsForTerm(study, ['theos', 'amnos'], 'lamb of god').map((k) => k.id)).toEqual(['amnos']);
    expect(keyWordsForTerm(study, ['theos'], 'kingdom of god')).toEqual([]);
  });
});

function kp(id: string, title: string, tags: string[], note: string, book = 'LUK'): TopicPassage {
  return { id, ref: { book, startChapter: 12, startVerse: 13, endChapter: 12, endVerse: 21 }, title, tags, group: 'g', note: fx(note) };
}

const WEALTH: Study = {
  id: 'fixture-wealth',
  kind: 'topic',
  depth: 'library',
  title: 'Wealth',
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
  sourceIds: [],
  topic: {
    name: 'Wealth',
    definition: fx('Wealth is a gift and a danger.'),
    keyPassages: [
      kp('kp-deut', 'Remember the LORD your God', ['pride', 'gratitude'], 'Wealth can lead to pride; is it a sin to forget God.', 'DEU'),
      kp('kp-fool', 'The rich fool', ['greed', 'parable'], 'A rich man builds bigger barns.'),
      kp('kp-adam', 'Adam and Christ', ['sin', 'death'], 'Paul contrasts Adam and Christ.', 'ROM'),
      kp('kp-james', 'Faith without works', ['works'], 'Faith shown by deeds.', 'JAS'),
    ],
  },
};

describe('rankKeyPassages', () => {
  it('ranks by what a passage is about (title and tags) over words its note mentions', () => {
    const [best] = rankKeyPassages(WEALTH, 'Is it wrong to be rich?');
    expect(best.item.id).toBe('kp-fool');
    expect(best.labelHits).toBe(1);
  });
  it('a note alone never reaches a full score', () => {
    const ranked = rankKeyPassages(WEALTH, 'Is forgetting God a sin of pride?');
    expect(ranked.find((r) => r.item.id === 'kp-deut')!.score).toBeLessThanOrEqual(1);
    const noteOnly = rankKeyPassages(WEALTH, 'barns');
    expect(noteOnly[0].score).toBeLessThan(0.5);
  });
  it('counts a book’s traditional author ("Paul and James")', () => {
    const ids = rankKeyPassages(WEALTH, 'How do Paul and James fit together?').map((r) => r.item.id);
    expect(ids.slice(0, 2).sort()).toEqual(['kp-adam', 'kp-james']);
  });
  it('a passage the question names scores at least 0.9', () => {
    const named = { book: 'LUK', startChapter: 12, startVerse: 16, endChapter: 12, endVerse: 16 };
    expect(rankKeyPassages(WEALTH, 'explain this', named)[0].score).toBeGreaterThanOrEqual(0.9);
  });
});

describe('searchStudy — a debate is the answer only when the question touches it', () => {
  it('words of a perspective set’s introduction alone do not select it', () => {
    const study: Study = { ...WEALTH, perspectives: [{ ...FIXTURE_ROMANS_8.perspectives[0], id: 'ps-filioque', question: 'Does the Spirit proceed from the Father alone?', tags: ['filioque'], intro: 'One God in three persons: how can God be one and three?' }] };
    expect(searchStudy(study, 'How can God be one and three?').some((h) => h.type === 'perspective')).toBe(false);
    expect(searchStudy(study, 'What is the filioque?').some((h) => h.type === 'perspective')).toBe(true);
  });
});
