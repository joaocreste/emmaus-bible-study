import { describe, expect, it } from 'vitest';
import type { ChatMessage, ConversationState, MessageBlock, Study } from '../../domain/models';
import { PAULINE_BOOKS } from '../../domain/books';
import { refKey } from '../../domain/reference';
import { LocalStudyEngine } from '../LocalStudyEngine';
import type { EngineContext, EngineResult } from '../types';
import { wordCount } from '../text';
import { createFakeProviders } from './fixtures/providers';
import { FIXTURE_GRACE, FIXTURE_ROMANS_8 } from './fixtures/studies';

const providers = createFakeProviders();

function ctx(study: Study | null = null, conversation: ConversationState = {}, history: ChatMessage[] = []): EngineContext {
  return { study, history, conversation, translation: 'BSB' };
}

/** Run a conversation, carrying study + conversation state like the session store does. */
async function converse(engine: LocalStudyEngine, messages: string[], start: EngineContext = ctx()): Promise<EngineResult[]> {
  let c = start;
  const out: EngineResult[] = [];
  for (const m of messages) {
    const r = await engine.respond(m, c);
    out.push(r);
    c = { ...c, study: r.study ?? c.study, conversation: r.conversation, history: [...c.history, { id: `u${out.length}`, role: 'user', text: m, createdAt: 0 }, r.reply] };
  }
  return out;
}

async function inRomans8(messages: string[], conversation: ConversationState = {}): Promise<EngineResult[]> {
  const engine = new LocalStudyEngine(providers);
  const opened = await engine.respond('Romans 8', ctx());
  expect(opened.study?.id).toBe('fixture-romans-8');
  return converse(engine, messages, ctx(opened.study!, conversation));
}

function allText(blocks: MessageBlock[] = []): string {
  return blocks.map((b) => (b.type === 'paragraph' || b.type === 'note' ? b.text : b.type === 'list' ? b.items.join('\n') : b.type === 'scripture' ? b.text : '')).join('\n');
}

/** Contract checks every reply must satisfy. */
function checkReply(r: EngineResult, study: Study | null) {
  const s = r.study ?? study ?? (r.reply.studyId ? providers.studies.get(r.reply.studyId) : undefined);
  expect(r.reply.role).toBe('assistant');
  expect(r.reply.suggestions!.length).toBeGreaterThanOrEqual(2);
  expect(r.reply.suggestions!.length).toBeLessThanOrEqual(4);
  expect(r.trace[0].stage).toBe('Intent');
  expect(r.trace[r.trace.length - 1].stage).toBe('Synthesis');
  expect(r.trace.every((t) => t.stage && t.detail)).toBe(true);
  expect(r.reply.provenance).toBeDefined();
  expect(Array.isArray(r.reply.updates)).toBe(true);
  if (r.focus || r.study) expect(r.reply.updates!.length).toBeGreaterThan(0);
  const text = allText(r.reply.blocks);
  for (const m of text.matchAll(/\{\{word:([^}|]+)\}\}/g)) expect(s?.keyWords.some((k) => k.id === m[1])).toBe(true);
  for (const m of text.matchAll(/\{\{source:([^}|]+)\}\}/g)) expect(providers.sources.getSource(m[1])).toBeDefined();
  expect(wordCount(r.reply.text)).toBeLessThanOrEqual(160);
}

describe('LocalStudyEngine — opening studies', () => {
  it('opens a curated passage study with its opening message', async () => {
    const r = await new LocalStudyEngine(providers).respond('Romans 8', ctx());
    expect(r.intent.kind).toBe('open-passage');
    expect(r.study).toMatchObject({ id: 'fixture-romans-8', depth: 'curated', kind: 'passage' });
    expect(r.study!.sourceIds).toEqual(expect.arrayContaining(['bsb', 'stepbible-tbesg', 'tyndale-open-study-notes', 'calvin-commentaries']));
    expect(r.reply.text).toContain('Opening message of the fixture study');
    expect(r.reply.studyId).toBe('fixture-romans-8');
    checkReply(r, null);
  });

  it('opens a curated study at a narrower reference and highlights it', async () => {
    const r = await new LocalStudyEngine(providers).respond('Romans 8:28', ctx());
    expect(r.study?.id).toBe('fixture-romans-8');
    expect(r.focus?.highlightVerses).toEqual([{ book: 'ROM', chapter: 8, verse: 28 }]);
    expect(r.conversation.activeVerse).toEqual({ book: 'ROM', chapter: 8, verse: 28 });
  });

  it('assembles a library study for an uncurated passage', async () => {
    const r = await new LocalStudyEngine(providers).respond('Matthew 5–7', ctx());
    expect(r.study).toMatchObject({ id: 'library-MAT.5-7', depth: 'library', kind: 'passage', title: 'Matthew 5–7', subtitle: 'Matthew · Gospels' });
    expect(r.study!.keyWords).toEqual([]);
    expect(r.study!.sourceIds).toEqual(expect.arrayContaining(['bsb', 'stepbible-tagnt', 'stepbible-tbesg', 'openbible-xrefs', 'tyndale-open-study-notes', 'calvin-commentaries']));
    expect(r.study!.suggestedQuestions).toContain('Show cross-references');
    expect(r.reply.text).toMatch(/library study/);
    expect(r.reply.text).toContain('Romans 8'); // mentions the curated studies available
    checkReply(r, null);
  });

  it('whole-book references are allowed', async () => {
    const r = await new LocalStudyEngine(providers).respond('Genesis', ctx());
    expect(refKey(r.study!.passage!)).toBe('GEN');
    expect(r.study!.sourceIds).toEqual(expect.arrayContaining(['stepbible-tahot', 'stepbible-tbesh']));
  });

  it('opens a curated topic study', async () => {
    const r = await new LocalStudyEngine(providers).respond('Grace', ctx());
    expect(r.intent.kind).toBe('open-topic');
    expect(r.study).toMatchObject({ id: 'fixture-grace', kind: 'topic', depth: 'curated' });
  });

  it('opens a library topic study from the topic index', async () => {
    const r = await new LocalStudyEngine(providers).respond('What does the Bible say about anxiety?', ctx());
    expect(r.study).toMatchObject({ id: 'topic-fixture-anxiety', kind: 'topic', depth: 'library', title: 'Anxiety' });
    expect(refKey(r.study!.passage!)).toBe('PHP.4.4-9');
    expect(r.study!.topic?.keyPassages).toHaveLength(2);
    expect(r.study!.suggestedQuestions[0]).toMatch(/anxious/);
    checkReply(r, null);
  });

  it('declines honestly for a topic that is not in the library', async () => {
    const r = await new LocalStudyEngine(providers).respond('Tell me about quantum physics', ctx());
    expect(r.study).toBeUndefined();
    expect(r.reply.text).toMatch(/don’t have a study on/);
    expect(r.reply.text).toContain('Anxiety');
    expect(r.trace.at(-1)!.detail).toMatch(/nothing invented/);
  });

  it('openStudy works by id, passage and topic', async () => {
    const engine = new LocalStudyEngine(providers);
    expect((await engine.openStudy({ studyId: 'fixture-grace' }, ctx())).study?.id).toBe('fixture-grace');
    expect((await engine.openStudy({ studyId: 'library-MAT.5' }, ctx())).study?.id).toBe('library-MAT.5');
    expect((await engine.openStudy({ studyId: 'fixture-anxiety' }, ctx())).study?.id).toBe('topic-fixture-anxiety');
    expect((await engine.openStudy({ passage: { book: 'ROM', startChapter: 8 } }, ctx())).study?.id).toBe('fixture-romans-8');
    expect((await engine.openStudy({ topic: 'worry' }, ctx())).study?.id).toBe('topic-fixture-anxiety');
    const missing = await engine.openStudy({ studyId: 'nope' }, ctx());
    expect(missing.study).toBeUndefined();
  });
});

describe('LocalStudyEngine — word study', () => {
  it('"What does condemnation mean?" focuses Original languages and highlights the word (spec §20)', async () => {
    const [r] = await inRomans8(['What does condemnation mean?']);
    expect(r.intent.kind).toBe('word-study');
    expect(r.focus).toMatchObject({ section: 'original-languages', highlightWordIds: ['kw-katakrima'] });
    expect(r.focus!.highlightVerses).toEqual([{ book: 'ROM', chapter: 8, verse: 1 }]);
    expect(r.focus!.expandIds).toEqual(expect.arrayContaining(['kw-katakrima', 'theme-justification', 'ctx-courtroom']));
    expect(r.focus!.pinIds).toEqual(expect.arrayContaining(['xref-rom-5-18', 'xref-jhn-3-17', 'cm-calvin-8-1']));
    expect(r.focus!.reason).toBe('Focused on κατάκριμα (condemnation) — from your question');
    expect(r.reply.text).toContain('Concept answer on condemnation');
    expect(r.reply.text).toContain('κατάκριμα occurs 3 times in 3 verses of the Greek New Testament');
    expect(allText(r.reply.blocks)).toContain('{{word:kw-katakrima}}');
    expect(r.conversation).toMatchObject({ activeConceptId: 'concept-condemnation', activeWordId: 'kw-katakrima' });
    expect(r.reply.updates!.map((u) => u.section)).toEqual(expect.arrayContaining(['original-languages', 'scripture', 'cross-references', 'commentary']));
    expect(r.trace.map((t) => t.provider)).toEqual(expect.arrayContaining(['curated:fixture-romans-8', 'fake:lexicon']));
    checkReply(r, null);
  });

  it('"What does Paul mean by flesh here?" matches the flesh concept', async () => {
    const [r] = await inRomans8(['What does Paul mean by flesh here?']);
    expect(r.focus?.highlightWordIds).toEqual(['kw-sarx']);
    expect(r.conversation.activeConceptId).toBe('concept-flesh');
  });

  it('matches key words by transliteration and lemma', async () => {
    const [a, b] = await inRomans8(['What does huiothesia mean?', 'What does κατάκριμα mean?']);
    expect(a.focus?.highlightWordIds).toEqual(['kw-huiothesia']);
    expect(b.focus?.highlightWordIds).toEqual(['kw-katakrima']);
  });

  it('an uncurated word in the passage is looked up in the tagged text and the lexicon', async () => {
    const [r] = await inRomans8(['What does law mean?']);
    expect(r.intent.kind).toBe('word-study');
    expect(r.inspector).toEqual({ type: 'word', strong: 'G3551', verse: { book: 'ROM', chapter: 8, verse: 2 }, surface: 'νόμος', gloss: 'law' });
    expect(r.reply.provenance?.kind).toBe('lexical');
    expect(r.reply.text).toContain('νόμος');
    expect(r.reply.text).toContain('law, custom'); // markup stripped from the lexicon definition
    expect(r.focus?.section).toBe('scripture');
    checkReply(r, null);
  });

  it('a word from another curated study is offered, not invented', async () => {
    const [r] = await inRomans8(["What is the Greek word behind 'grace'?"]);
    expect(r.reply.text).toMatch(/doesn’t appear in Romans 8/);
    expect(r.reply.text).toContain('χάρις');
    expect(r.reply.suggestions).toContain('Explore grace');
  });

  it('an unknown word is declined honestly', async () => {
    const [r] = await inRomans8(['What does zyzzyva mean?']);
    expect(r.reply.text).toMatch(/won’t guess/);
    expect(r.focus).toBeUndefined();
  });

  it('with no study open, a curated word opens the study that explains it', async () => {
    const r = await new LocalStudyEngine(providers).respond('What does condemnation mean?', ctx());
    expect(r.study?.id).toBe('fixture-romans-8');
    expect(r.focus?.highlightWordIds).toEqual(['kw-katakrima']);
  });

  it('"What are the key words in this passage?" lists curated key words', async () => {
    const [r] = await inRomans8(['What are the key words in this passage?']);
    expect(r.focus?.section).toBe('original-languages');
    expect(r.focus?.highlightWordIds).toHaveLength(3);
  });
});

describe('LocalStudyEngine — commentary', () => {
  it('"Show me what Tim Keller says about this" declines honestly when no verified source exists (spec §20)', async () => {
    const [, r] = await inRomans8(['What does condemnation mean?', 'Show me what Tim Keller says about this']);
    expect(r.intent).toMatchObject({ kind: 'commentary', slots: { authorId: 'tim-keller' } });
    expect(r.reply.text).toContain('I don’t have a verified Timothy Keller source on Romans 8 in the local library, so I won’t put words in his mouth.');
    expect(r.reply.text).toMatch(/Keller does appear in the curated Grace study/);
    expect(r.reply.text).toMatch(/John Calvin/); // voices available in this study
    expect(r.reply.blocks!.some((b) => b.type === 'note')).toBe(true);
    expect(r.reply.text).not.toMatch(/[“"][^”"]*Keller/);
    expect(r.focus).toMatchObject({ section: 'commentary', commentaryAuthorIds: [] });
    expect(r.reply.citations).toEqual([]);
    expect(r.reply.suggestions).toContain('Explore grace');
    checkReply(r, null);
  });

  it('summarises an author the study does include, introduced as a summary', async () => {
    const [r] = await inRomans8(['What does Calvin say about this?']);
    expect(r.focus).toMatchObject({ section: 'commentary', commentaryAuthorIds: ['calvin'], expandIds: ['cm-calvin-8-1'] });
    expect(r.reply.text).toMatch(/A summary of Calvin’s argument in Calvin’s Commentaries/);
    expect(r.reply.text).not.toMatch(/“\[fixture\]/);
  });

  it('falls back to a public-domain commentary by that author', async () => {
    const [r] = await inRomans8(['What does Matthew Henry say about this?']);
    expect(r.reply.text).toContain('Matthew Henry on Romans 8:1–4');
    expect(r.reply.provenance).toMatchObject({ kind: 'commentary', verification: 'source-derived' });
  });

  it('no author named → voices by era', async () => {
    const [r] = await inRomans8(['What do commentators say?']);
    expect(r.reply.text).toMatch(/Reformation — John Calvin/);
    expect(r.focus?.section).toBe('commentary');
  });
});

describe('LocalStudyEngine — cross-references & connect', () => {
  it('"Where else does Paul talk about this?" prioritises Pauline cross-references (spec §20)', async () => {
    const [, r] = await inRomans8(['What does condemnation mean?', 'Where else does Paul talk about this?']);
    expect(r.intent).toMatchObject({ kind: 'cross-references', slots: { traditionalAuthor: 'Paul' } });
    expect(r.focus).toMatchObject({ section: 'cross-references', crossReferenceFilter: { author: 'Paul' } });
    expect(r.focus!.pinIds![0]).toBe('xref-rom-5-18'); // the concept's Pauline reference first
    expect(r.focus!.pinIds).not.toContain('xref-jhn-3-17');
    for (const id of r.focus!.pinIds!) {
      const x = r.study ?? null;
      void x;
      expect(['xref-rom-5-18', 'xref-gal-5-17', 'xref-gal-4-6']).toContain(id);
    }
    expect(PAULINE_BOOKS).toContain('GAL');
    expect(r.reply.text).toMatch(/Paul’s letters/);
    checkReply(r, null);
  });

  it('"Show me other passages where this idea appears" ranks by the active concept', async () => {
    const [, r] = await inRomans8(['What does Paul mean by flesh here?', 'Show me other passages where this idea appears.']);
    expect(r.focus?.pinIds?.[0]).toBe('xref-gal-5-17');
    expect(r.focus?.crossReferenceFilter).toEqual({});
  });

  it('falls back to labelled dataset references when nothing curated matches', async () => {
    const engine = new LocalStudyEngine(providers);
    const opened = await engine.respond('Matthew 5', ctx());
    const r = await engine.respond('Show cross-references', ctx(opened.study!));
    expect(r.reply.provenance?.kind).toBe('dataset');
    expect(r.reply.text).toMatch(/OpenBible\.info/);
    expect(r.reply.text).toMatch(/not individually explained/);
    expect(allText(r.reply.blocks)).toContain('{{ref:LUK.6.20}}');
  });

  it('"How does this connect with Romans?" inside Romans 8 means the rest of the letter', async () => {
    const [r] = await inRomans8(['How does this connect with Romans?']);
    expect(r.intent.kind).toBe('connect');
    expect(r.study).toBeUndefined();
    expect(r.focus).toMatchObject({ section: 'literary-context', crossReferenceFilter: { book: 'ROM' }, pinIds: ['xref-rom-5-18'] });
    expect(r.reply.text).toMatch(/Life in Christ/);
    expect(r.reply.updates!.some((u) => /outline of Romans/.test(u.label))).toBe(true);
  });

  it('connect with a specific passage opens it beside the study, never switching', async () => {
    const [r] = await inRomans8(['How does this relate to Genesis 3?']);
    expect(r.study).toBeUndefined();
    expect(r.focus?.pinIds).toEqual(['xref-gen-3']);
    expect(r.inspector).toMatchObject({ type: 'passage', ref: { book: 'GEN', startChapter: 3 } });
    expect(r.reply.suggestions).toContain('Study Genesis 3');
  });
});

describe('LocalStudyEngine — verses, context, perspectives', () => {
  it('"Explain verse 12 in more detail." falls back to the Tyndale Open Study Notes', async () => {
    const [r] = await inRomans8(['Explain verse 12 in more detail.']);
    expect(r.intent.kind).toBe('explain-verse');
    expect(r.reply.blocks![0]).toMatchObject({ type: 'scripture', translation: 'BSB' });
    expect(allText(r.reply.blocks)).toContain('{{source:tyndale-open-study-notes}}');
    expect(r.reply.text).toContain('Tyndale note on Romans 8:12–13');
    expect(r.reply.provenance).toMatchObject({ kind: 'commentary', verification: 'source-derived' });
    expect(r.focus).toMatchObject({ section: 'scripture', highlightVerses: [{ book: 'ROM', chapter: 8, verse: 12 }] });
    expect(r.conversation.activeVerse).toEqual({ book: 'ROM', chapter: 8, verse: 12 });
    checkReply(r, null);
  });

  it('uses the curated verse note, key words and cross-references when present', async () => {
    const [r] = await inRomans8(['8:1']);
    expect(r.reply.text).toContain('Verse note on 8:1');
    expect(r.focus).toMatchObject({ highlightWordIds: ['kw-katakrima'], pinIds: ['xref-rom-5-18', 'xref-jhn-3-17'] });
  });

  it('rejects verse numbers beyond the chapter', async () => {
    const [r] = await inRomans8(['Explain verse 50']);
    expect(r.reply.text).toMatch(/has 39 verses/);
  });

  it('resolves "the last verse"', async () => {
    const [r] = await inRomans8(['Explain the last verse']);
    expect(r.intent.slots.verse).toEqual({ book: 'ROM', chapter: 8, verse: 39 });
  });

  it('historical context ranks the audience note for "original audience"', async () => {
    const [r] = await inRomans8(['How would the original audience have understood this?']);
    expect(r.focus?.section).toBe('historical-context');
    expect(r.focus?.expandIds?.[0]).toBe('ctx-audience');
  });

  it('historical context in a library study uses the Tyndale book introduction', async () => {
    const engine = new LocalStudyEngine(providers);
    const opened = await engine.respond('Matthew 5', ctx());
    const r = await engine.respond('What is the historical background?', ctx(opened.study!));
    expect(r.reply.text).toContain('introduction to Matthew');
    expect(r.focus).toMatchObject({ section: 'historical-context', expandIds: ['book-intro-MAT'] });
  });

  it('perspectives name the question, consensus level and each tradition', async () => {
    const [r] = await inRomans8(['Are there different theological interpretations of this passage?']);
    expect(r.focus).toMatchObject({ section: 'theology', expandIds: ['ps-assurance'] });
    expect(r.reply.text).toMatch(/genuine difference between Christian traditions/);
    expect(r.reply.text).toMatch(/Reformed/);
    expect(r.reply.text).toMatch(/Arminian/);
  });

  it('a follow-up about another passage opens it first', async () => {
    const [r] = await inRomans8(['What is the historical background of Matthew 5:3?']);
    expect(r.study?.id).toBe('library-MAT.5');
    expect(r.reply.text).toMatch(/I’ve opened \*?\*?Matthew 5/);
  });
});

describe('LocalStudyEngine — robustness & determinism', () => {
  it('is deterministic', async () => {
    const run = async () => {
      const results = await converse(new LocalStudyEngine(providers), ['Romans 8', 'What does condemnation mean?', 'Where else does Paul talk about this?']);
      return results.map((r) => ({ id: r.reply.id, text: r.reply.text, focus: r.focus, suggestions: r.reply.suggestions }));
    };
    expect(await run()).toEqual(await run());
  });

  it('survives failing dataset providers without inventing anything', async () => {
    const failing = createFakeProviders({ failing: true });
    const results = await converse(new LocalStudyEngine(failing), ['Romans 8', 'Explain verse 12', 'What does law mean?', 'Show cross-references']);
    for (const r of results) {
      expect(r.reply.text.length).toBeGreaterThan(0);
      expect(r.trace.at(-1)!.stage).toBe('Synthesis');
    }
    expect(results[1].reply.text).toMatch(/don’t have a note/);
  });

  it('works with an empty curated library', async () => {
    const empty = createFakeProviders({ studies: [], topics: [] });
    const engine = new LocalStudyEngine(empty);
    const a = await engine.respond('Romans 8', ctx());
    expect(a.study?.depth).toBe('library');
    const b = await engine.respond('Grace', ctx());
    expect(b.study).toBeUndefined();
    expect(b.reply.text).toMatch(/don’t have a study on/);
  });

  it('greets, helps and lists sources', async () => {
    const engine = new LocalStudyEngine(providers);
    const hi = await engine.respond('Hello', ctx());
    expect(hi.intent.kind).toBe('greeting');
    expect(hi.reply.suggestions!.length).toBeGreaterThanOrEqual(2);
    const [src] = await inRomans8(['Where does this come from?']);
    expect(src.focus?.section).toBe('sources');
    expect(src.reply.text).toMatch(/traceable/);
  });
});

describe('LocalStudyEngine — questions that name another passage', () => {
  it('"Who wrote Romans?" with no study opens Romans and answers from the book introduction', async () => {
    const r = await new LocalStudyEngine(providers).respond('Who wrote Romans?', ctx());
    expect(r.intent.kind).toBe('historical-context');
    expect(r.study?.id).toBe('library-ROM');
    expect(r.reply.text).toContain('introduction to Romans');
  });
  it('"What does John 3:16 mean?" opens John 3 and explains the verse honestly', async () => {
    const r = await new LocalStudyEngine(providers).respond('What does John 3:16 mean?', ctx());
    expect(r.intent.kind).toBe('explain-verse');
    expect(r.study?.id).toBe('library-JHN.3');
    expect(r.focus?.highlightVerses).toEqual([{ book: 'JHN', chapter: 3, verse: 16 }]);
    expect(r.reply.text).toMatch(/don’t have a note on John 3:16/);
  });
});

describe('LocalStudyEngine — topic resolution', () => {
  it('an exact topic-index alias beats a loose curated match', async () => {
    const loose = { ...FIXTURE_GRACE, id: 'loose', match: { references: [], topics: ['worry and grace together'] } };
    const p = createFakeProviders({ studies: [FIXTURE_ROMANS_8, loose] });
    const r = await new LocalStudyEngine(p).respond('Worry', ctx());
    expect(r.study?.id).toBe('topic-fixture-anxiety');
  });
  it('an exact curated match beats a library topic entry', async () => {
    const r = await new LocalStudyEngine(providers).respond('Life in the Spirit', ctx());
    expect(r.study?.id).toBe('fixture-romans-8');
  });
});
