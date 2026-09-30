/**
 * TEST FIXTURES for the inference client/engine/session tests. The study below is
 * test data shaped like a generated page; its excerpts are placeholders marked
 * "[fixture]" — it is not content and is never shown in the app.
 */
import type { PipelineStep, ProvenancedText, Study } from '../../domain/models';
import type { InferenceClient, InferenceOutcome, InferenceStreamOptions } from '../client';
import type { AnswerRequest, ComposeRequest, InferenceEvent, InferenceStatus } from '../protocol';

const gen = (text: string, locator = 'on Matt 19:3–9'): ProvenancedText => ({
  text,
  provenance: {
    kind: 'synthesis',
    verification: 'generated',
    citations: [{ sourceId: 'tyndale-open-study-notes', locator, excerpt: '[fixture] retrieved note text' }],
  },
});

/** A generated topic page ("divorce") with one concept the local engine can answer from. */
export function generatedStudy(extra: Partial<Study> = {}): Study {
  return {
    id: 'generated-divorce-1',
    kind: 'topic',
    depth: 'generated',
    title: 'Divorce',
    subtitle: 'What does the Bible say about divorce?',
    passage: { book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 9 },
    topic: {
      name: 'Divorce',
      question: 'What does the Bible say about divorce?',
      definition: gen('[fixture] Definition of the topic.'),
      keyPassages: [
        {
          id: 'kp-mat-19',
          ref: { book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 9 },
          title: '[fixture] Jesus answers the Pharisees',
          note: gen('[fixture] Note on the passage.'),
          group: 'The teaching of Jesus',
          tags: ['divorce'],
        },
      ],
    },
    summary: gen('[fixture] Summary.'),
    opening: gen('[fixture] Opening message of the generated page.'),
    keyWords: [],
    crossReferences: [],
    context: [],
    theology: [],
    perspectives: [],
    commentary: [],
    sermons: [],
    verseNotes: [],
    concepts: [
      {
        id: 'concept-hardness',
        label: 'hardness of heart',
        aliases: ['hardness of heart', 'hard hearts'],
        answer: gen('[fixture] Answer about hardness of heart.'),
        primarySection: 'key-passages',
        verses: [{ book: 'MAT', chapter: 19, verse: 8 }],
        keyWordIds: [],
        crossReferenceIds: [],
        contextIds: [],
        themeIds: [],
        perspectiveSetIds: [],
        commentaryIds: [],
      },
    ],
    suggestedQuestions: ['What did Jesus mean by hardness of heart?', 'How does Malachi 2 speak about divorce?'],
    sourceIds: ['bsb', 'tyndale-open-study-notes'],
    layout: { sections: [{ id: 'key-passages', title: '[fixture] What Scripture says' }] },
    generation: { model: 'claude-opus-5', query: 'divorce', createdAt: 0, evidenceCount: 14, retrievalCalls: 6 },
    ...extra,
  };
}

export const AVAILABLE: InferenceStatus = {
  available: true,
  model: 'claude-opus-5',
  knowledgeBase: { documents: 24512, corpora: [] },
};

export const NO_KEY: InferenceStatus = {
  available: false,
  model: 'claude-opus-5',
  reason: 'Add ANTHROPIC_API_KEY to .env.local',
  knowledgeBase: { documents: 24512, corpora: [] },
};

export const step = (stage: string, detail: string): PipelineStep => ({ stage, detail, provider: 'kb:test' });

/** The events of a successful compose: progress, a partial snapshot, progress, the final page, the reply. */
export function composeEvents(study: Study = generatedStudy()): InferenceEvent[] {
  const partial: Study = { ...study, topic: study.topic ? { ...study.topic, keyPassages: [] } : undefined };
  return [
    { type: 'progress', step: step('Research', 'Searching the topical index for “divorce”') },
    { type: 'study', study: partial, complete: false },
    { type: 'progress', step: step('Compose', 'Key passages accepted') },
    { type: 'study', study, complete: true },
    {
      type: 'reply',
      reply: {
        id: 'server-reply',
        role: 'assistant',
        text: 'Opening of the generated page.',
        blocks: [{ type: 'paragraph', text: 'Opening of the generated page.' }],
        provenance: { kind: 'synthesis', verification: 'generated', citations: [] },
        createdAt: 1,
      },
      focus: { section: 'key-passages' },
    },
    { type: 'done' },
  ];
}

function outcomeOf(events: InferenceEvent[]): InferenceOutcome {
  const o: InferenceOutcome = { complete: false, steps: [] };
  for (const e of events) {
    if (e.type === 'progress') o.steps.push(e.step);
    else if (e.type === 'study') {
      o.study = e.study;
      o.complete = e.complete;
    } else if (e.type === 'reply') {
      o.reply = e.reply;
      if (e.focus) o.focus = e.focus;
      if (e.conversation) o.conversation = e.conversation;
    } else if (e.type === 'error') o.error = { code: e.code, message: e.message };
  }
  return o;
}

export interface FakeClient extends InferenceClient {
  statusCalls: number;
  composeCalls: ComposeRequest[];
  answerCalls: AnswerRequest[];
  invalidated: number;
  status: InferenceStatus;
  /** scripted events for the next compose / answer calls */
  composeScript: InferenceEvent[];
  answerScript: InferenceEvent[];
  /** abort the stream after this many events (simulates the reader starting something else) */
  abortAfter?: number;
}

/** A scripted in-memory InferenceClient: replays events through onEvent, like the real one. */
export function fakeClient(status: InferenceStatus = AVAILABLE): FakeClient {
  const client: FakeClient = {
    statusCalls: 0,
    composeCalls: [],
    answerCalls: [],
    invalidated: 0,
    status,
    composeScript: composeEvents(),
    answerScript: [],
    async getStatus() {
      client.statusCalls++;
      return client.status;
    },
    peekStatus: () => client.status,
    subscribe: () => () => {},
    invalidateStatus() {
      client.invalidated++;
    },
    async compose(request: ComposeRequest, options?: InferenceStreamOptions) {
      client.composeCalls.push(request);
      return replay(client.composeScript, options, client.abortAfter);
    },
    async answer(request: AnswerRequest, options?: InferenceStreamOptions) {
      client.answerCalls.push(request);
      return replay(client.answerScript, options, client.abortAfter);
    },
  };
  return client;
}

function replay(events: InferenceEvent[], options: InferenceStreamOptions | undefined, abortAfter?: number): InferenceOutcome {
  const seen: InferenceEvent[] = [];
  for (const e of events) {
    if (abortAfter != null && seen.length >= abortAfter) {
      return { ...outcomeOf(seen), error: { code: 'aborted', message: 'Stopped before the page was finished.' } };
    }
    seen.push(e);
    options?.onEvent?.(e);
  }
  return outcomeOf(seen);
}
