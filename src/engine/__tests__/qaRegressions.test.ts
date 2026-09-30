/**
 * Engine regressions from the QA flows, over fixture providers (prose marked
 * "[fixture]"; lexical facts real). Each block names the finding it guards.
 */
import { describe, expect, it } from 'vitest';
import type { CuratedStudy, KeyWord, Study } from '../../domain/models';
import { cite, summaryOf } from '../../domain/provenance';
import { StudyAssembler, topicInProse } from '../assemble';
import { describeFocus } from '../compose';
import { LocalStudyEngine } from '../LocalStudyEngine';
import type { EngineContext, EngineResult } from '../types';
import { createFakeProviders } from './fixtures/providers';
import { FIXTURE_GRACE, FIXTURE_ROMANS_8, FIXTURE_STUDIES } from './fixtures/studies';

function ctx(study: Study | null = null): EngineContext {
  return { study, history: [], conversation: {}, translation: 'BSB' };
}

async function ask(studies: CuratedStudy[], studyId: string, message: string): Promise<EngineResult> {
  const providers = createFakeProviders({ studies });
  const engine = new LocalStudyEngine(providers);
  const opened = await engine.openStudy({ studyId }, ctx());
  return engine.respond(message, ctx(opened.study!));
}

// Romans 8 whose "flesh" concept links only an unrelated key word, and whose study has no σάρξ key word.
const WITHOUT_SARX: CuratedStudy = {
  ...FIXTURE_ROMANS_8,
  keyWords: FIXTURE_ROMANS_8.keyWords.filter((k) => k.id !== 'kw-sarx'),
  concepts: FIXTURE_ROMANS_8.concepts.map((c) => (c.id === 'concept-flesh' ? { ...c, keyWordIds: ['kw-huiothesia'], verses: [{ book: 'ROM', chapter: 8, verse: 3 }] } : c)),
};

describe('QA: “flesh” must never name an unrelated Greek word', () => {
  it('a concept whose key words are other words names the word aligned in the text, not its first key word', async () => {
    const r = await ask([WITHOUT_SARX, FIXTURE_GRACE], 'fixture-romans-8', 'What does Paul mean by flesh here?');
    expect(r.intent.kind).toBe('word-study');
    expect(r.reply.text).not.toMatch(/word behind/);
    expect(r.reply.text).not.toContain('υἱοθεσία');
    expect(r.focus?.highlightWordIds).toBeUndefined();
    expect(r.inspector).toMatchObject({ type: 'word', strong: 'G4561', verse: { book: 'ROM', chapter: 8, verse: 3 } });
    expect(r.reply.text).toContain('σάρξ');
  });

  it('a key word that stands for the term is named', async () => {
    const r = await ask(FIXTURE_STUDIES, 'fixture-romans-8', 'What does Paul mean by flesh here?');
    expect(r.focus?.highlightWordIds?.[0]).toBe('kw-sarx');
    expect(r.reply.text).toContain('σάρξ occurs 147 times in 147 verses of the Greek New Testament');
  });

  it('another study is offered with a lemma only when its key word is the term', async () => {
    const r = await ask(FIXTURE_STUDIES, 'fixture-grace', 'What is the Greek word for flesh?');
    expect(r.reply.text).toMatch(/key word in the curated study of Romans 8 — σάρξ/);
  });

  it('names the author of the passage when the question names another', async () => {
    const r = await ask(FIXTURE_STUDIES, 'fixture-romans-8', 'What does John mean by flesh here?');
    expect(r.reply.text).toContain('in Romans 8 it is Paul, not John, who is writing');
    const same = await ask(FIXTURE_STUDIES, 'fixture-romans-8', 'What does Paul mean by flesh here?');
    expect(same.reply.text).not.toContain('correction');
  });

  it('a verse asked about that lacks the word says where the word is', async () => {
    const providers = createFakeProviders();
    const engine = new LocalStudyEngine(providers);
    const study = (await engine.openStudy({ studyId: 'fixture-romans-8' }, ctx())).study!;
    const r = await engine.respond('What does flesh mean in verse 1?', ctx(study));
    expect(r.reply.text).toContain('“Flesh” isn’t in 8:1 — it is in 8:3 and 8:4.');
    expect(r.focus?.highlightVerses?.[0]).toEqual({ book: 'ROM', chapter: 8, verse: 3 });
  });
});

describe('QA: cross-reference replies count what was pinned', () => {
  it('says how many more are pinned, never that all are prioritised', async () => {
    const r = await ask(FIXTURE_STUDIES, 'fixture-romans-8', 'Show me other passages where this idea appears.');
    expect(r.reply.text).not.toMatch(/prioritised in/);
    const pinned = r.focus?.pinIds?.length ?? 0;
    expect(r.reply.text).toContain(`${pinned - 3} more are pinned at the top of`);
  });
});

describe('QA: “Study updated” rows describe what the dashboard shows', () => {
  const assembler = new StudyAssembler(createFakeProviders());
  const base = assembler.fromCurated(FIXTURE_ROMANS_8);
  const word = (id: string, english: string, lemma: string, anchors: KeyWord['anchors']): KeyWord => ({ ...base.keyWords[0], id, english, lemma, anchors });
  const study: Study = {
    ...base,
    keyWords: [
      word('kw-a', 'affliction', 'θλῖψις', [{ verse: { book: 'ROM', chapter: 8, verse: 18 }, phrases: { BSB: 'sufferings' } }]),
      word('kw-b', 'affliction', 'עֳנִי', [{ verse: { book: 'LAM', chapter: 3, verse: 19 }, phrases: { BSB: 'affliction' } }]),
      word('kw-c', 'mind (mind-set)', 'φρόνημα', [{ verse: { book: 'ROM', chapter: 8, verse: 6 }, phrases: { BSB: 'mind of the flesh' } }]),
      word('kw-d', 'condemned', 'κατακρίνω', [
        { verse: { book: 'ROM', chapter: 8, verse: 3 }, phrases: { BSB: 'condemned sin' } },
        { verse: { book: 'ROM', chapter: 8, verse: 34 }, phrases: { BSB: 'condemn' } },
      ]),
    ],
  };

  it('uses the phrases underlined in the passage, in every verse they are anchored in', () => {
    const labels = describeFocus({ section: 'original-languages', highlightWordIds: ['kw-d'], highlightVerses: [{ book: 'ROM', chapter: 8, verse: 1 }] }, study).map((u) => u.label);
    expect(labels).toContain('Highlighted “condemned sin” and “condemn” in 8:3 and 8:34');
  });

  it('does not repeat a label, claim a highlight outside the passage, or double parentheses', () => {
    const labels = describeFocus({ highlightWordIds: ['kw-a', 'kw-b', 'kw-c'] }, study).map((u) => u.label);
    expect(labels).toContain('Highlighted “sufferings” in 8:18');
    expect(labels).toContain('Highlighted “mind of the flesh” in 8:6');
    expect(labels.join(' ')).not.toContain('Lam');
    expect(labels).toContain('Opened θλῖψις, עֳנִי and φρόνημα');
    const one = describeFocus({ highlightWordIds: ['kw-c'] }, study).map((u) => u.label);
    expect(one).toContain('Opened φρόνημα (mind)');
  });
});

describe('QA: commentary locators and topic prose', () => {
  it('drops the quotation marks of a removed title from a locator', async () => {
    const study: CuratedStudy = {
      ...FIXTURE_GRACE,
      commentary: [
        {
          id: 'cm-fixture-keller',
          authorId: 'tim-keller',
          sourceId: 'fixture-sermon-title',
          kind: 'summary',
          text: '[fixture] A summary.',
          locator: '“The Glory of the Incarnation,” 11 December 2016 (John 1:14–18)',
          tags: [],
          provenance: summaryOf(cite('fixture-sermon-title')),
        },
      ],
      sources: [
        ...FIXTURE_GRACE.sources,
        { id: 'fixture-sermon-title', type: 'sermon', title: 'The Glory of the Incarnation', authorIds: ['tim-keller'], year: '2016', license: { status: 'copyrighted', name: '© fixture', usage: 'summary-only' } },
      ],
    };
    const r = await ask([FIXTURE_ROMANS_8, study], 'fixture-grace', 'What did Tim Keller say about this?');
    expect(r.reply.text).toContain('The Glory of the Incarnation (2016), 11 December 2016 (John 1:14–18):');
    expect(r.reply.text).not.toMatch(/“\s*,?\s*”/);
  });

  it('keeps proper nouns capitalised in topic names inside sentences', () => {
    expect(topicInProse('The Trinity')).toBe('the Trinity');
    expect(topicInProse('The Holy Spirit')).toBe('the Holy Spirit');
    expect(topicInProse('The Kingdom of God')).toBe('the Kingdom of God');
    expect(topicInProse('Anxiety & Worry')).toBe('anxiety & worry');
  });
});
