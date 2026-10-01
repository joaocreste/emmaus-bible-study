import { describe, expect, it } from 'vitest';
import type { ChatMessage, CuratedTopic, MessageBlock, PassageRef, Study } from '../../domain/models';
import { synthesis } from '../../domain/provenance';
import { AVAILABLE, composeEvents, fakeClient, generatedStudy, NO_KEY, step } from '../../inference/__tests__/fakes';
import { InferenceStudyEngine, isNewStudyRequest, needsResearch, stripEvidenceMarkers, wantsNewPage } from '../InferenceStudyEngine';
import type { EngineContext, EngineResult, EngineStreamEvent } from '../types';
import { createFakeProviders } from './fixtures/providers';
import { FIXTURE_ANXIETY } from './fixtures/studies';

/** A topic-index entry that lists "divorce" as an alias — the old silent redirect. */
const MARRIAGE: CuratedTopic = {
  id: 'fixture-marriage',
  name: 'Marriage',
  aliases: ['marriage', 'divorce', 'husband', 'wife'],
  topic: {
    name: 'Marriage',
    definition: { text: '[fixture] Marriage definition.', provenance: synthesis() },
    keyPassages: [
      {
        id: 'kp-gen-2',
        ref: { book: 'GEN', startChapter: 2, startVerse: 18, endChapter: 2, endVerse: 25 },
        title: '[fixture] One flesh',
        note: { text: '[fixture] Note.', provenance: synthesis() },
        group: 'Creation',
        tags: [],
      },
    ],
  },
  suggestedQuestions: [],
};

const providers = createFakeProviders({ topics: [FIXTURE_ANXIETY, MARRIAGE] });

function ctx(study: Study | null = null, extra: Partial<EngineContext> = {}): EngineContext {
  return { study, history: [], conversation: {}, translation: 'BSB', ...extra };
}

function engineWith(client = fakeClient(), enabled = true) {
  const engine = new InferenceStudyEngine(providers, { client, isEnabled: () => enabled });
  return { engine, client };
}

function text(r: EngineResult): string {
  return (r.reply.blocks ?? []).map((b: MessageBlock) => (b.type === 'paragraph' || b.type === 'note' ? b.text : '')).join('\n');
}

function notes(r: EngineResult): string[] {
  return (r.reply.blocks ?? []).flatMap((b) => (b.type === 'note' ? [b.text] : []));
}

describe('InferenceStudyEngine — routing rules', () => {
  it('recognises new-study requests', () => {
    const open = generatedStudy();
    expect(isNewStudyRequest({ kind: 'open-topic', confidence: 0.8, slots: {} }, { study: open })).toBe(true);
    expect(isNewStudyRequest({ kind: 'open-passage', confidence: 0.9, slots: {} }, { study: open })).toBe(true);
    expect(isNewStudyRequest({ kind: 'unknown', confidence: 0.2, slots: {} }, { study: null })).toBe(true);
    expect(isNewStudyRequest({ kind: 'word-study', confidence: 0.9, slots: {} }, { study: null })).toBe(true);
    expect(isNewStudyRequest({ kind: 'greeting', confidence: 0.9, slots: {} }, { study: null })).toBe(false);
    expect(isNewStudyRequest({ kind: 'word-study', confidence: 0.9, slots: {} }, { study: open })).toBe(false);
  });

  it('only composes when the local engine did not handle the request itself', () => {
    const reply = (declined = false): EngineResult => ({
      reply: { id: 'a', role: 'assistant', text: '', createdAt: 0, ...(declined ? { declined: true } : {}) },
      conversation: {},
      intent: { kind: 'open-topic', confidence: 0.5, slots: {} },
      trace: [],
    });
    const open = generatedStudy();
    expect(wantsNewPage({ kind: 'open-passage', confidence: 0.9, slots: { invalidChapter: { book: 'ROM', chapter: 17 } } }, reply(), { study: null })).toBe(false);
    expect(wantsNewPage({ kind: 'open-passage', confidence: 0.9, slots: { passage: { book: 'JHN', startChapter: 3, startVerse: 99 } } }, reply(true), { study: null })).toBe(false);
    expect(wantsNewPage({ kind: 'open-topic', confidence: 0.9, slots: { topic: 'x' } }, reply(false), { study: open })).toBe(false);
    expect(wantsNewPage({ kind: 'open-topic', confidence: 0.9, slots: { topic: 'x' } }, reply(true), { study: open })).toBe(true);
    expect(wantsNewPage({ kind: 'open-topic', confidence: 0.9, slots: { topic: 'x' } }, reply(false), { study: null })).toBe(true);
    expect(needsResearch({ ...reply(true) }, 'q')).toBe(true);
    expect(needsResearch({ ...reply(false), intent: { kind: 'unknown', confidence: 0.2, slots: {} } }, 'q')).toBe(true);
    expect(needsResearch({ ...reply(false), intent: { kind: 'theology', confidence: 0.5, slots: {} } }, 'q')).toBe(false);
  });
});

describe('InferenceStudyEngine — new studies', () => {
  it('composes a page for “divorce” instead of silently opening the Marriage topic', async () => {
    const { engine, client } = engineWith();
    const events: EngineStreamEvent[] = [];
    const r = await engine.respond('divorce', ctx(null, { onEvent: (e) => events.push(e) }));
    expect(client.composeCalls).toHaveLength(1);
    expect(client.composeCalls[0]).toEqual({ query: 'divorce', translation: 'BSB', hint: { topic: 'divorce' } });
    expect(r.study?.id).toBe('generated-divorce-1');
    expect(r.study?.depth).toBe('generated');
    expect(r.study?.title).not.toBe('Marriage');
    // live events reach the session in order
    expect(events.map((e) => (e.type === 'study' ? `study:${e.complete}` : e.type === 'phase' ? `phase:${e.phase}` : e.type))).toEqual([
      'phase:compose',
      'progress',
      'study:false',
      'progress',
      'study:true',
    ]);
    // the reply is shaped for the chat
    expect(r.reply.role).toBe('assistant');
    expect(r.reply.studyId).toBe('generated-divorce-1');
    expect(r.reply.text).toBe('Opening of the generated page.');
    expect(r.reply.provenance?.verification).toBe('generated');
    expect(r.reply.suggestions).toEqual(generatedStudy().suggestedQuestions);
    expect(r.reply.updates?.[0]).toEqual({ section: 'key-passages', label: 'Composed Divorce — generated study' });
    expect(r.focus).toEqual({ section: 'key-passages' });
    expect(r.intent.kind).toBe('open-topic');
    // the trace lists the live steps
    const stages = r.trace.map((s) => s.stage);
    expect(stages.slice(0, 2)).toEqual(['Intent', 'Routing']);
    expect(stages).toContain('Research');
    expect(stages).toContain('Compose');
    expect(r.trace.find((s) => s.stage === 'Routing')?.detail).toMatch(/instead of the library topic “Marriage”/);
    expect(r.reply.trace).toEqual(r.trace);
  });

  it('opens curated studies locally, without asking the server anything', async () => {
    const { engine, client } = engineWith();
    const romans = await engine.respond('Romans 8', ctx());
    expect(romans.study).toMatchObject({ id: 'fixture-romans-8', depth: 'curated' });
    const grace = await engine.respond('Grace', ctx());
    expect(grace.study).toMatchObject({ id: 'fixture-grace', depth: 'curated' });
    expect(client.composeCalls).toHaveLength(0);
    expect(client.statusCalls).toBe(0);
    expect(romans.trace[1]).toMatchObject({ stage: 'Routing' });
    expect(romans.trace[0].stage).toBe('Intent');
    expect(romans.trace[romans.trace.length - 1].stage).toBe('Synthesis');
  });

  it('composes a page for an uncurated passage, hinting the reference', async () => {
    const { engine, client } = engineWith();
    await engine.respond('Matthew 5–7', ctx());
    expect(client.composeCalls[0].hint).toEqual({ passage: { book: 'MAT', startChapter: 5, endChapter: 7 } });
  });

  it('leaves references the local engine answered alone (chapter out of range)', async () => {
    const { engine, client } = engineWith();
    const r = await engine.respond('Romans 17', ctx());
    expect(r.reply.text).toMatch(/16 chapters/);
    expect(client.composeCalls).toHaveLength(0);
  });

  it('greetings stay local', async () => {
    const { engine, client } = engineWith();
    await engine.respond('Hello', ctx());
    expect(client.composeCalls).toHaveLength(0);
  });

  it('falls back to the library study with a one-time note when live composition is unavailable', async () => {
    const { engine, client } = engineWith(fakeClient(NO_KEY));
    const first = await engine.respond('divorce', ctx());
    expect(client.composeCalls).toHaveLength(0);
    expect(first.study).toMatchObject({ title: 'Marriage', depth: 'library' });
    // in the reader's words — the server's setup details stay out of the chat
    expect(notes(first)).toEqual([
      'Live composition: new studies cannot be composed right now. Studies from the library still open as usual. Showing the library topic study instead.',
    ]);
    expect(first.reply.text).not.toMatch(/ANTHROPIC|\.env/);
    expect(first.trace[1]).toMatchObject({ stage: 'Routing', provider: 'engine:inference' });

    const second = await engine.respond('Matthew 5–7', ctx());
    expect(second.study?.depth).toBe('library');
    expect(notes(second)).toEqual([]);
    expect(second.trace[1].detail).toMatch(/unavailable/);
  });

  it('explains an unavailable server in the reader’s language when the server sends a reason code', async () => {
    const { engine } = engineWith(fakeClient({ ...NO_KEY, reasonCode: 'no-credit' }));
    const r = await engine.respond('divorce', ctx(null, { locale: 'pt', translation: 'BLIVRE' }));
    expect(notes(r).join(' ')).toContain('Composição ao vivo: a geração de novos estudos está pausada no momento.');
    expect(notes(r).join(' ')).not.toMatch(/ANTHROPIC|\.env|Claude|API/);
  });

  it('does not ask for the status when the reader turned live composition off', async () => {
    const { engine, client } = engineWith(fakeClient(), false);
    const r = await engine.respond('divorce', ctx());
    expect(client.statusCalls).toBe(0);
    expect(client.composeCalls).toHaveLength(0);
    expect(r.study?.title).toBe('Marriage');
    expect(notes(r)).toEqual([]);
    expect(r.trace[1].detail).toMatch(/off in Reader settings/);
  });

  it('explains a missing API key and falls back to the library study', async () => {
    const client = fakeClient();
    client.composeScript = [{ type: 'error', code: 'no-credentials', message: 'No API key' }, { type: 'done' }];
    const { engine } = engineWith(client);
    const r = await engine.respond('divorce', ctx());
    expect(r.study?.title).toBe('Marriage');
    expect(notes(r)[0]).toBe('Composing new studies is not set up here yet. Showing the library topic study instead.');
    expect(client.invalidated).toBe(1);
    expect(r.trace.some((s) => s.stage === 'Inference' && /no-credentials/.test(s.detail))).toBe(true);
  });

  it.each([
    ['refusal', /^A study could not be composed for this question/],
    ['rate-limited', /^Many studies are being composed right now — try again in a minute/],
    ['overloaded', /^Composing studies is busy right now/],
    ['invalid-output', /every statement rests on a cited source/],
    ['internal', /^The study could not be composed — something went wrong while composing the study\./],
  ] as const)('explains a %s error honestly', async (code, pattern) => {
    const client = fakeClient();
    client.composeScript = [{ type: 'error', code, message: 'The server broke.' }, { type: 'done' }];
    const { engine } = engineWith(client);
    const r = await engine.respond('divorce', ctx());
    expect(notes(r)[0]).toMatch(pattern);
    expect(r.study?.depth).toBe('library');
  });

  it('keeps a partial page (checked sections only) when composition fails midway', async () => {
    const client = fakeClient();
    const [p1, partial] = composeEvents();
    client.composeScript = [p1, partial, { type: 'error', code: 'invalid-output', message: 'The theology section failed validation twice.' }, { type: 'done' }];
    const { engine } = engineWith(client);
    const r = await engine.respond('divorce', ctx());
    expect(r.study?.id).toBe('generated-divorce-1');
    expect(r.reply.studyId).toBe('generated-divorce-1');
    expect(notes(r)[0]).toBe(
      'The study stopped before it was finished — the remaining sections could not be backed by cited sources. The sections shown are complete and checked against their sources; ask again to try for the rest.',
    );
    expect(notes(r)[0]).not.toMatch(/validation/);
  });

  it('stops honestly when the reader starts something else mid-stream', async () => {
    const client = fakeClient();
    client.abortAfter = 2;
    const { engine } = engineWith(client);
    const r = await engine.respond('divorce', ctx());
    expect(r.study?.id).toBe('generated-divorce-1');
    expect(text(r)).toMatch(/I stopped composing \*\*Divorce\*\* to turn to your next request/);

    client.abortAfter = 0;
    const early = await engine.respond('What does the Bible say about tattoos?', ctx());
    expect(early.study).toBeUndefined();
    expect(text(early)).toMatch(/I stopped composing a page for/);
  });

  it('opens a topic from the palette by composing, and reopens a composed page from memory', async () => {
    const { engine, client } = engineWith();
    const composed = await engine.openStudy({ topic: 'divorce' }, ctx());
    expect(client.composeCalls[0]).toMatchObject({ query: 'divorce', hint: { topic: 'divorce' } });
    expect(composed.study?.id).toBe('generated-divorce-1');

    const reopened = await engine.openStudy({ studyId: 'generated-divorce-1' }, ctx());
    expect(client.composeCalls).toHaveLength(1);
    expect(reopened.study?.id).toBe('generated-divorce-1');
    expect(reopened.reply.updates?.[0].label).toBe('Reopened Divorce — generated study');

    const curated = await engine.openStudy({ studyId: 'fixture-grace' }, ctx());
    expect(curated.study?.depth).toBe('curated');
  });

  it('stays on the open generated page when the reader repeats its question', async () => {
    const { engine, client } = engineWith();
    const r = await engine.respond('Divorce?', ctx(generatedStudy()));
    expect(client.composeCalls).toHaveLength(0);
    expect(r.study).toBeUndefined();
    expect(text(r)).toMatch(/already in \*\*Divorce\*\*/);
  });

  it('regenerates a page afresh, bypassing the cache', async () => {
    const { engine, client } = engineWith();
    const study = generatedStudy();
    const r = await engine.regenerate(study, ctx(study));
    expect(client.composeCalls[0]).toMatchObject({ query: 'divorce', regenerate: true });
    expect(r.study?.id).toBe(study.id);
    expect(r.reply.updates?.[0].label).toBe('Regenerated Divorce — generated study');
  });

  it('regenerates a topic page as a topic, not as its anchor passage', async () => {
    const { engine, client } = engineWith();
    const study = generatedStudy();
    expect(study.passage).toBeDefined();
    await engine.regenerate(study, ctx(study));
    expect(client.composeCalls[0].hint).toEqual({ topic: 'Divorce' });
  });

  it('regenerates a passage page with its passage as the hint', async () => {
    const passage: PassageRef = { book: 'MAT', startChapter: 5, endChapter: 7 };
    const study = generatedStudy({ kind: 'passage', title: 'Matthew 5–7', passage, topic: undefined, generation: { model: 'claude-opus-5', query: 'Matthew 5-7', createdAt: 0, evidenceCount: 3, retrievalCalls: 2 } });
    const client = fakeClient();
    client.composeScript = composeEvents(study);
    const { engine } = engineWith(client);
    await engine.regenerate(study, ctx(study));
    expect(client.composeCalls[0]).toMatchObject({ query: 'Matthew 5-7', regenerate: true, hint: { passage } });
  });

  it('regenerates a page composed this session under the hint it was composed with', async () => {
    const { engine, client } = engineWith();
    const r = await engine.respond('divorce', ctx());
    await engine.regenerate(r.study!, ctx(r.study!));
    expect(client.composeCalls).toHaveLength(2);
    expect(client.composeCalls[1]).toMatchObject({ query: 'divorce', regenerate: true });
    expect(client.composeCalls[1].hint).toEqual(client.composeCalls[0].hint);
    expect(client.composeCalls[1].hint).toEqual({ topic: 'divorce' });
  });

  it('keeps the page when regenerating fails', async () => {
    const client = fakeClient();
    client.composeScript = [{ type: 'error', code: 'overloaded', message: 'busy' }, { type: 'done' }];
    const { engine } = engineWith(client);
    const study = generatedStudy();
    const r = await engine.regenerate(study, ctx(study));
    expect(r.study).toBeUndefined();
    expect(text(r)).toMatch(/stays as it was/);
    expect(notes(r)[0]).toMatch(/^Composing studies is busy right now/);
  });
});

describe('InferenceStudyEngine — complex questions', () => {
  const ABUSE = 'Is divorce allowed in an abusive marriage, and can I remarry?';
  const ABUSE_PT = 'Em um relacionamento abusivo, sem parceria, é possível o divórcio e pensar em um novo casamento?';

  it('composes a page for the question itself, not the library topic it mentions', async () => {
    const { engine, client } = engineWith();
    const r = await engine.respond(ABUSE, ctx());
    // the question is the query; neither "marriage" nor the whole sentence goes as a topic hint
    expect(client.composeCalls).toEqual([{ query: ABUSE, translation: 'BSB' }]);
    expect(r.study?.depth).toBe('generated');
  });

  it('composes a new page for a complex question asked while another page is open', async () => {
    const { engine, client } = engineWith();
    const r = await engine.respond(ABUSE_PT, ctx(generatedStudy(), { locale: 'pt' }));
    expect(client.answerCalls).toHaveLength(0);
    expect(client.composeCalls).toEqual([{ query: ABUSE_PT, translation: 'BSB', locale: 'pt' }]);
    expect(r.study?.depth).toBe('generated');
  });

  it('composes a new page for “what do theologians say…” with several parts, even on a curated page', async () => {
    const { engine, client } = engineWith();
    const romans = (await engine.respond('Romans 8', ctx())).study!;
    const q = 'O que a bíblia e os teólogos falam no caso de uma separação, um divórcio quando há um relacionamento abusivo e sem parceria entre o casal, irresolvível mesmo tentando com conselheiros?';
    const r = await engine.respond(q, ctx(romans, { locale: 'pt' }));
    expect(client.composeCalls).toEqual([{ query: q, translation: 'BSB', locale: 'pt' }]);
    expect(r.study?.depth).toBe('generated');
  });

  it('keeps short follow-ups on the open page', async () => {
    const { engine, client } = engineWith();
    await engine.respond('What about tattoos?', ctx(generatedStudy()));
    expect(client.composeCalls).toHaveLength(0);
    expect(client.answerCalls).toHaveLength(1);
  });

  it('without live composition, opens the library topic the question turns on and names its key points', async () => {
    const { engine, client } = engineWith(fakeClient(), false);
    const r = await engine.respond(ABUSE, ctx());
    expect(client.composeCalls).toHaveLength(0);
    expect(r.study).toMatchObject({ title: 'Marriage', depth: 'library' });
    expect(text(r)).toMatch(/^Your question turns on \*\*divorce\*\* and \*\*marriage\*\*\. The library has no study of the question as a whole, so I’ve opened the Marriage study/);
    expect(r.trace.some((s) => s.stage === 'Question')).toBe(true);
    // …and says plainly what would answer the question itself
    expect(notes(r)).toEqual(['This question needs a study composed for it, and **Live composition** is turned off. Turn it on in Reader settings (Aa) and ask again.']);
  });

  it('says every time that an unavailable server leaves a complex question unanswered', async () => {
    const { engine, client } = engineWith(fakeClient(NO_KEY));
    for (let i = 0; i < 2; i++) {
      const r = await engine.respond(ABUSE_PT, ctx(null, { locale: 'pt' }));
      expect(client.composeCalls).toHaveLength(0);
      expect(notes(r)).toHaveLength(1);
      expect(notes(r)[0]).toBe('Esta pergunta precisa de um estudo gerado para ela, mas não é possível gerar novos estudos agora. Os estudos da biblioteca continuam abrindo normalmente. Quando voltar, pergunte de novo.');
    }
  });
});

describe('InferenceStudyEngine — follow-ups', () => {
  const history: ChatMessage[] = [
    { id: 'u1', role: 'user', text: 'divorce', createdAt: 1 },
    { id: 'a1', role: 'assistant', text: 'Opening of the generated page.', createdAt: 2 },
  ];

  it('answers from the page locally when it can (no server call)', async () => {
    const { engine, client } = engineWith();
    const r = await engine.respond('What is hardness of heart?', ctx(generatedStudy(), { history }));
    expect(client.answerCalls).toHaveLength(0);
    expect(r.reply.declined).toBeUndefined();
    // drawn from the generated page, so labelled as generated (not "editorial, from the library")
    expect(r.reply.provenance).toMatchObject({ kind: 'synthesis', verification: 'generated' });
    expect(r.reply.provenance?.citations.length).toBeGreaterThan(0);
  });

  it('keeps the library label for local answers on curated pages', async () => {
    const { engine } = engineWith();
    const romans = (await engine.respond('Romans 8', ctx())).study!;
    const r = await engine.respond('What does condemnation mean?', ctx(romans));
    expect(r.reply.provenance?.verification).not.toBe('generated');
  });

  it('removes evidence ledger ids from the server’s reply text', async () => {
    const client = fakeClient();
    const text = 'Easton notes the case of adultery [E1]; Mark records no exception [E8, E9].\n\nSee the note [E2][E3].';
    client.answerScript = [
      { type: 'reply', reply: { id: 'srv', role: 'assistant', text, blocks: [{ type: 'paragraph', text }, { type: 'list', items: ['One [E4]', 'Two'] }], createdAt: 3 } },
      { type: 'done' },
    ];
    const { engine } = engineWith(client);
    const r = await engine.respond('What about tattoos?', ctx(generatedStudy(), { history }));
    expect(r.reply.text).toBe('Easton notes the case of adultery; Mark records no exception.\n\nSee the note.');
    expect(r.reply.blocks).toEqual([
      { type: 'paragraph', text: 'Easton notes the case of adultery; Mark records no exception.\n\nSee the note.' },
      { type: 'list', items: ['One', 'Two'] },
    ]);
  });

  it('strips only evidence markers', () => {
    expect(stripEvidenceMarkers('a [E1] b [E12, E3] c [E4–E6].')).toBe('a b c.');
    expect(stripEvidenceMarkers('Romans 8:1 [ESV] and [Editor’s note] {{ref:ROM.8.1}}')).toBe('Romans 8:1 [ESV] and [Editor’s note] {{ref:ROM.8.1}}');
  });

  it('researches a question the page cannot answer, and applies the page patch', async () => {
    const client = fakeClient();
    const study = generatedStudy();
    const patched: Study = { ...study, suggestedQuestions: [...study.suggestedQuestions, 'What did the early church teach about remarriage?'] };
    client.answerScript = [
      { type: 'progress', step: step('Research', 'Searching the confessions for “remarriage”') },
      { type: 'study', study: patched, complete: true },
      {
        type: 'reply',
        reply: { id: 'srv', role: 'assistant', text: 'An answer from the knowledge base.', createdAt: 3 },
        focus: { section: 'theology' },
        conversation: { activeConceptId: 'concept-hardness' },
      },
      { type: 'done' },
    ];
    const { engine } = engineWith(client);
    const local = await engineWith(fakeClient(), false).engine.respond('What about tattoos?', ctx(study, { history }));
    expect(local.reply.declined).toBe(true); // the page cannot answer this

    const events: EngineStreamEvent[] = [];
    const r = await engine.respond('What about tattoos?', ctx(study, { history, onEvent: (e) => events.push(e) }));
    expect(client.answerCalls).toHaveLength(1);
    expect(client.answerCalls[0]).toMatchObject({ question: 'What about tattoos?', translation: 'BSB', history: [{ role: 'user', text: 'divorce' }, { role: 'assistant', text: 'Opening of the generated page.' }] });
    expect(client.answerCalls[0].study.id).toBe(study.id);
    expect(r.reply.text).toBe('An answer from the knowledge base.');
    expect(r.reply.studyId).toBe(study.id);
    expect(r.study).toBe(patched);
    expect(r.focus).toEqual({ section: 'theology' });
    expect(r.conversation).toEqual({ activeConceptId: 'concept-hardness' });
    expect(events.map((e) => (e.type === 'phase' ? `phase:${e.phase}` : e.type))).toEqual(['phase:answer', 'progress', 'study']);
    expect(r.trace.map((s) => s.stage)).toEqual(['Intent', 'Routing', 'Research']);
  });

  it('keeps the local reply (with a plain note) when research fails', async () => {
    const client = fakeClient();
    client.answerScript = [{ type: 'error', code: 'rate-limited', message: '429' }, { type: 'done' }];
    const { engine } = engineWith(client);
    const r = await engine.respond('What about tattoos?', ctx(generatedStudy(), { history }));
    expect(r.reply.declined).toBe(true);
    expect(notes(r)[0]).toMatch(/^I also tried to look this up in the research library, but many studies are being composed right now/);
  });

  it('does not research when live composition is unavailable', async () => {
    const client = fakeClient(NO_KEY);
    const { engine } = engineWith(client);
    const r = await engine.respond('What about tattoos?', ctx(generatedStudy(), { history }));
    expect(client.answerCalls).toHaveLength(0);
    expect(r.reply.declined).toBe(true);
  });

  it('asks the status only once it is needed, and uses the given client', async () => {
    const client = fakeClient(AVAILABLE);
    const { engine } = engineWith(client);
    await engine.respond('Romans 8', ctx());
    expect(client.statusCalls).toBe(0);
    await engine.respond('divorce', ctx());
    expect(client.statusCalls).toBe(1);
  });
});
