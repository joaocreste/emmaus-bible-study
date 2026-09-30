/**
 * Scripted end-to-end runs: a fake Anthropic client replays assistant turns
 * (tool_use blocks) through the real loop, research tools, validator and page builder,
 * against a fake knowledge base backed by the real bundled datasets.
 */
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { afterEach, describe, expect, it } from 'vitest';
import type { Study } from '../../../src/domain/models';
import type { AnswerRequest, ComposeRequest, InferenceEvent } from '../../../src/inference/protocol';
import { PageCache } from '../cache';
import { createRunLogWriter, type RunLog } from '../logs';
import { FALLBACK_BETA } from '../loop';
import { runAnswer, runCompose, type RunDeps } from '../run';
import {
  authError,
  createFakeKb,
  fail,
  FakeModelClient,
  hang,
  message,
  overloadedError,
  rateLimitError,
  reply,
  testConfig,
  textBlock,
  toolResults,
  toolUse,
  type ScriptedTurn,
} from './fakes';

const DIVORCE: ComposeRequest = { query: 'divorce', translation: 'BSB' };

async function collect(run: (emit: (e: InferenceEvent) => void) => Promise<void>): Promise<InferenceEvent[]> {
  const events: InferenceEvent[] = [];
  await run((e) => events.push(e));
  return events;
}

function deps(client: FakeModelClient | null, overrides: Partial<RunDeps> = {}): RunDeps {
  return { kb: createFakeKb(), client, config: testConfig(), ...overrides };
}

/* ------------------------------------------------------------------ */
/* The scripted "divorce" composition                                  */
/* ------------------------------------------------------------------ */

const researchTurn1 = reply([
  textBlock('I will start with the topical indexes, the lexicon and the dictionaries.'),
  toolUse('find_topics', { query: 'divorce' }),
  toolUse('lexicon', { query: 'divorce' }),
  toolUse('search_knowledge', { query: 'divorce', kinds: ['dictionary'] }),
]);
// E1 Nave's · E2 Torrey's · E3 G630 · E4 G647 · E5 H3748 · E6 Easton's

const researchTurn2 = reply([
  toolUse('read_passage', { reference: 'Matthew 19:3–9' }),
  toolUse('read_passage', { reference: 'Deuteronomy 24:1–4' }),
  toolUse('commentary', { reference: 'Matthew 19:3–9' }),
  toolUse('original_text', { reference: 'Matthew 19:3–9' }),
  toolUse('search_knowledge', { query: 'divorce remarriage adultery', kinds: ['confession'] }),
  toolUse('read_passage', { reference: 'Hezekiah 4' }),
  // the other passages the page features (a key passage must have been read)
  toolUse('read_passage', { references: ['Malachi 2:14–16', 'Matthew 5:31–32', '1 Corinthians 7:10–17'] }),
]);
// E7 Matt 19:3–9 · E8 Deut 24:1–4 · E9 Tyndale · E10 Calvin · E11 JFB · E12 Greek text · E13 WCF · E14 Trent · E15–E17 the other passages

const composeTurn = reply([
  toolUse('begin_page', {
    title: 'Divorce in the Bible',
    kind: 'topic',
    passage: 'Matthew 19:3–9',
    question: 'What does the Bible say about divorce?',
    summary: {
      text: 'The Law regulates divorce (Deuteronomy 24:1–4); Jesus answers the Pharisees’ test by returning to the Creator’s design (Matthew 19:3–9), and the churches read his exception differently.',
      evidence: ['E1', 'E7', 'E8'],
    },
  }),
  toolUse('add_section', {
    section: 'key-passages',
    title: 'Where Scripture speaks of divorce',
    intro: 'The passages the topical indexes list, grouped by where they stand in the Bible.',
    items: [
      { reference: 'Deuteronomy 24:1–4', title: 'The certificate of divorce', note: 'Moses regulates an existing practice with a written certificate.', group: 'The Law and the Prophets', evidence: ['E1', 'E8'] },
      { reference: 'Malachi 2:14–16', title: 'Faithfulness to the wife of one’s youth', note: 'The prophet rebukes men who break faith with their wives.', group: 'The Law and the Prophets', evidence: ['E1'] },
      { reference: 'Matthew 19:3–9', title: 'Jesus and the Pharisees’ test', note: 'Jesus answers from Genesis and names one exception.', group: 'Jesus’ teaching', evidence: ['E1', 'E7'] },
      { reference: 'Matthew 5:31–32', title: 'Jesus on the certificate', note: 'Jesus sets his word against the certificate practice.', group: 'Jesus’ teaching', evidence: ['E1'] },
      { reference: '1 Corinthians 7:10–17', title: 'Paul’s counsel to the married', note: 'Paul passes on the Lord’s command and addresses mixed marriages.', group: 'Paul’s counsel', evidence: ['E1'] },
      { reference: 'Hebrews 13:4', title: 'Honour marriage', note: 'Marriage should be held in honour.', group: 'Paul’s counsel', evidence: ['E1'] },
      { reference: 'Luke 16:18', title: 'Uncited', note: 'No evidence given.', group: 'Jesus’ teaching', evidence: [] },
    ],
  }),
  toolUse('add_section', {
    section: 'original-languages',
    items: [
      { strong: 'G630', english: 'divorce', anchor: { reference: 'Matthew 19:3', phrase: 'divorce' }, significance: 'The ordinary verb for releasing or dismissing, used of sending a wife away.', evidence: ['E3'] },
      { strong: 'H3748', english: 'certificate of divorce', anchor: { reference: 'Deuteronomy 24:1', phrase: 'certificate of divorce' }, significance: 'The written document of dismissal the Law required.', evidence: ['E5'] },
      { strong: 'G4202', english: 'sexual immorality', anchor: { reference: 'Matthew 19:9', phrase: 'sexual immorality' }, significance: 'The term of the exception clause.', evidence: ['E12'] },
    ],
  }),
  toolUse('add_section', {
    section: 'historical-context',
    items: [
      {
        category: 'jewish-tradition',
        title: 'Hillel and Shammai',
        summary: 'Tyndale’s note describes two Pharisaic schools: Shammai allowed divorce only for grave sin, Hillel for any reason.',
        relatedVerses: ['Matthew 19:3'],
        evidence: ['E9'],
      },
    ],
  }),
  toolUse('add_section', {
    section: 'theology',
    themes: [{ category: 'ethics', title: 'Marriage as the Creator’s design', summary: 'Jesus grounds marriage in creation: the two become one flesh.', keyVerses: ['Matthew 19:6'], evidence: ['E7', 'E2'] }],
    perspectives: [
      {
        question: 'May the innocent party remarry after divorce for adultery?',
        consensus: 'denominational',
        intro: 'Churches read the exception in Matthew 19:9 differently.',
        commonGround: 'All treat marriage as a lifelong covenant.',
        evidence: ['E13', 'E14'],
        positions: [
          { tradition: 'Reformed', label: 'Remarriage permitted to the innocent party', summary: 'The Westminster Confession allows the innocent party to divorce and marry another.', keyTexts: ['Matthew 19:9'], evidence: ['E13'] },
          { tradition: 'Catholic', label: 'The bond is not dissolved', summary: 'The Council of Trent teaches that adultery does not dissolve the bond of marriage.', evidence: ['E14'] },
        ],
      },
    ],
  }),
  toolUse('add_section', {
    section: 'commentary',
    voices: [
      { evidence: 'E10', mode: 'quote', quote: 'a fixed law was laid down as to the sacred and indissoluble bond of marriage', lead: 'On the Pharisees’ test (19:3)' },
      { evidence: 'E11', mode: 'summary', summary: 'JFB reads Moses as a civil lawgiver who tolerated divorce to prevent greater evils.' },
      { evidence: 'E9', mode: 'summary', summary: 'Tyndale describes the two schools.' },
    ],
  }),
]);

const finishTurn = reply([
  toolUse('finish_page', {
    opening: {
      text: 'Here is a page on divorce, built from the passages the topical indexes list.\n\nIt starts with the Law in Deuteronomy 24:1–4 and Jesus’ answer in Matthew 19:3–9, then the key Hebrew and Greek terms, the debate between two Pharisaic schools and where the churches stand.',
      evidence: ['E1', 'E7', 'E9'],
    },
    concepts: [
      {
        label: 'The exception clause',
        aliases: ['exception clause', 'except for sexual immorality', 'porneia'],
        answer: 'Matthew 19:9 names sexual immorality as the one exception; churches differ on what it permits.',
        section: 'original-languages',
        verses: ['Matthew 19:9'],
        evidence: ['E12', 'E13', 'E14'],
      },
    ],
    suggestedQuestions: ['What did Moses permit in Deuteronomy 24?', 'What does porneia mean?', 'How do churches differ on remarriage?'],
  }),
]);

const DIVORCE_SCRIPT: ScriptedTurn[] = [researchTurn1, researchTurn2, composeTurn, finishTurn];

describe('compose — scripted “divorce” run', () => {
  it('streams progress, study snapshots after begin_page and each accepted section, the final page, the reply, then done', async () => {
    const client = new FakeModelClient(DIVORCE_SCRIPT);
    const logs: RunLog[] = [];
    const events = await collect((emit) => runCompose(DIVORCE, deps(client, { writeLog: async (l) => (logs.push(l), null) }), emit, new AbortController().signal));

    expect(events.at(-1)).toEqual({ type: 'done' });
    expect(events.filter((e) => e.type === 'error')).toEqual([]);
    const types = events.map((e) => e.type);
    expect(types.indexOf('reply')).toBe(types.length - 2);

    // progress: one step per valid research call, with reader-friendly details and provider ids
    const steps = events.flatMap((e) => (e.type === 'progress' ? [e.step] : []));
    expect(steps[0]).toMatchObject({ stage: 'Model', provider: 'anthropic:claude-opus-5' });
    expect(steps.map((s) => s.detail)).toEqual(
      expect.arrayContaining([
        'Looking up “divorce” in Nave’s Topical Bible and Torrey’s',
        'Looking up “divorce” in the Hebrew and Greek lexicons',
        'Searching the Bible dictionaries and encyclopedias for “divorce”',
        'Reading Matthew 19:3–9 (BSB)',
        'Reading Tyndale’s notes and the classic commentaries on Matthew 19:3–9',
        'Reading the Greek text of Matthew 19:3–9',
        'Searching the creeds and confessions for “divorce remarriage adultery”',
      ]),
    );
    expect(steps.filter((s) => s.provider?.startsWith('kb:') || s.provider?.startsWith('local')).length).toBeGreaterThan(0);
    expect(steps.some((s) => /Hezekiah/.test(s.detail))).toBe(false);

    // study snapshots: begin + 5 sections (all partially accepted) + final
    const snapshots = events.flatMap((e) => (e.type === 'study' ? [e] : []));
    expect(snapshots.map((s) => s.complete)).toEqual([false, false, false, false, false, false, true]);
    expect(snapshots[0].study.title).toBe('Divorce in the Bible');
    expect(new Set(snapshots.map((s) => s.study.id)).size).toBe(1);

    const study = snapshots.at(-1)!.study;
    expect(study.id).toMatch(/^gen-divorce-[0-9a-f]{8}$/);
    expect(study).toMatchObject({ kind: 'topic', depth: 'generated', title: 'Divorce in the Bible', passage: { book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 9 } });
    expect(study.topic?.question).toBe('What does the Bible say about divorce?');
    expect(study.topic?.keyPassages.map((p) => p.title)).toEqual([
      'The certificate of divorce',
      'Faithfulness to the wife of one’s youth',
      'Jesus and the Pharisees’ test',
      'Jesus on the certificate',
      'Paul’s counsel to the married',
    ]);
    // key words hydrated from the lexicon
    expect(study.keyWords.map((k) => [k.strong, k.lemma, k.transliteration])).toEqual([
      ['G630', 'ἀπολύω', 'apoluō'],
      ['H3748', 'כְּרִיתוּת', 'ke.ri.tut'],
      ['G4202', 'πορνεία', 'porneia'],
    ]);
    // “certificate” translates סֵפֶר (H5612), the word before כְּרִיתֻת: label and anchor name this word only
    expect(study.keyWords[1].english).toBe('divorce');
    expect(study.keyWords[1].anchors[0].phrases.BSB).toBe('divorce');
    expect(study.context).toHaveLength(1);
    expect(study.theology).toHaveLength(1);
    expect(study.perspectives[0].perspectives.map((p) => p.tradition)).toEqual(['Reformed', 'Catholic']);
    // author from the evidence, else the source's first registered author; Tyndale's fixture has neither → rejected
    expect(study.commentary.map((c) => [c.authorId, c.sourceId, c.kind, c.provenance.verification])).toEqual([
      ['calvin', 'calvin-commentaries', 'quotation', 'verified'],
      ['jamieson-fausset-brown', 'jfb-commentary', 'summary', 'generated'],
    ]);
    expect(study.commentary[0]).toMatchObject({ lead: 'On the Pharisees’ test (19:3)', locator: 'Harmony of the Evangelists, on Matt 19:3' });
    expect(study.commentary[0].text).toBe('a fixed law was laid down as to the sacred and indissoluble bond of marriage');
    // provenance of generated prose: synthesis / generated with excerpts
    expect(study.summary?.provenance).toMatchObject({ kind: 'synthesis', verification: 'generated' });
    expect(study.summary?.provenance.citations.map((c) => c.sourceId)).toEqual(['naves-topical-bible', 'bsb', 'bsb']);
    expect(study.summary?.provenance.citations.every((c) => typeof c.excerpt === 'string' && c.excerpt.length > 0)).toBe(true);
    // layout from section order, titles and intros
    expect(study.layout?.sections.map((s) => s.id)).toEqual(['key-passages', 'scripture', 'original-languages', 'historical-context', 'theology', 'commentary', 'sources']);
    expect(study.layout?.sections[0]).toMatchObject({ title: 'Where Scripture speaks of divorce', intro: expect.stringMatching(/topical indexes/) });
    // opening, concepts linked to items, suggested questions
    expect(study.opening?.text).toMatch(/^Here is a page on divorce/);
    expect(study.concepts[0].primarySection).toBe('original-languages');
    expect(study.concepts[0].keyWordIds).toEqual([study.keyWords[2].id]);
    expect(study.suggestedQuestions).toHaveLength(3);
    // generation info + sources
    expect(study.generation).toMatchObject({ model: 'claude-opus-5', query: 'divorce', evidenceCount: 17, retrievalCalls: 9 });
    expect(study.generation?.rejectedItems).toBeGreaterThanOrEqual(3);
    expect(study.generation?.cached).toBeUndefined();
    expect(study.sourceIds).toEqual(
      expect.arrayContaining(['naves-topical-bible', 'torreys-topical-textbook', 'bsb', 'stepbible-tbesg', 'stepbible-tbesh', 'calvin-commentaries', 'jfb-commentary', 'westminster-confession', 'tyndale-open-study-notes']),
    );
    expect(study.sourceIds).not.toContain('council-of-trent-session-24'); // not in the source registry

    // the reply
    const r = events.find((e) => e.type === 'reply');
    if (r?.type !== 'reply') throw new Error('no reply');
    expect(r.focus).toEqual({ section: 'overview' });
    expect(r.reply).toMatchObject({ role: 'assistant', studyId: study.id });
    expect(r.reply.blocks?.map((b) => b.type)).toEqual(['paragraph', 'paragraph']);
    expect((r.reply.blocks?.[1] as { text: string }).text).toContain('{{ref:DEU.24.1-4|Deuteronomy 24:1–4}}');
    expect(r.reply.updates?.map((u) => u.section)).toEqual(['key-passages', 'original-languages', 'historical-context', 'theology', 'commentary']);
    expect(r.reply.updates?.[0].label).toBe('Where Scripture speaks of divorce — 5 passages');
    expect(r.reply.trace?.at(-1)).toMatchObject({ stage: 'Synthesis' });
    expect(r.reply.suggestions).toHaveLength(3);
    expect(r.reply.citations?.map((c) => c.sourceId)).toEqual(['naves-topical-bible', 'bsb', 'tyndale-open-study-notes']);

    // what the model was told: rejections with reasons, so it can repair
    const results = toolResults(client.requests[3]);
    const kp = Array.from(results.values()).find((x) => x.content.includes('in key-passages'))!;
    expect(kp.isError).toBe(false);
    expect(kp.content).toMatch(/Accepted 5 items in key-passages; rejected 2/);
    expect(kp.content).toMatch(/Hebrews 13:4.*none of the cited evidence contains Hebrews 13:4/);
    expect(kp.content).toMatch(/Luke 16:18.*cites no evidence/);
    const kw = Array.from(results.values()).find((x) => x.content.includes('in original-languages'))!;
    expect(kw.content).toMatch(/Filled in from the lexicon/);
    const turn2 = toolResults(client.requests[2]);
    expect(Array.from(turn2.values()).find((x) => x.isError)?.content).toMatch(/could not read “Hezekiah 4”/);

    // the debug log
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ flow: 'compose', studyId: study.id, researchCalls: 9, outcome: { end: 'done' } });
    expect(logs[0].ledger).toHaveLength(17);
    expect(logs[0].turns).toHaveLength(4);
    expect(logs[0].usage.cacheRead).toBe(20000);
    expect(logs[0].decisions.map((d) => d.section ?? d.tool)).toEqual(['begin_page', 'key-passages', 'original-languages', 'historical-context', 'theology', 'commentary', 'finish_page']);
    expect(logs[0].toolCalls.find((t) => t.name === 'read_passage' && t.isError)?.input).toEqual({ reference: 'Hezekiah 4' });
  });

  it('sends the documented request shape: adaptive thinking, effort, fallbacks, caching, one fixed tool list', async () => {
    const client = new FakeModelClient(DIVORCE_SCRIPT);
    await collect((emit) => runCompose(DIVORCE, deps(client), emit, new AbortController().signal));
    const p = client.requests[0];
    expect(p).toMatchObject({
      model: 'claude-opus-5',
      max_tokens: 64000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' },
      betas: [FALLBACK_BETA],
      fallbacks: 'default',
      cache_control: { type: 'ephemeral' },
    });
    const system = p.system as { text: string; cache_control?: unknown }[];
    expect(system).toHaveLength(3);
    expect(system.slice(0, 2).every((b) => b.cache_control)).toBe(true);
    expect(system[0].text).not.toMatch(/\d{4}-\d{2}-\d{2}/); // no dates: stable for caching
    expect(system[0].text).not.toMatch(/Catholic Encyclopedia/);
    // the knowledge base's holdings: which traditions have texts and which have none
    expect(system[2].text).toMatch(/Reformed: Westminster Confession of Faith/);
    expect(system[2].text).toMatch(/No texts at all for: Eastern Orthodox/);
    const tools = p.tools as { name: string; eager_input_streaming?: boolean }[];
    expect(tools.map((t) => t.name)).toEqual([
      'search_knowledge',
      'find_topics',
      'read_passage',
      'original_text',
      'lexicon',
      'word_occurrences',
      'cross_references',
      'commentary',
      'book_introduction',
      'read_document',
      'begin_page',
      'add_section',
      'finish_page',
      'reply',
    ]);
    expect(tools.every((t) => t.eager_input_streaming === true)).toBe(true);
    // the prefix is byte-identical across turns and requests
    expect(JSON.stringify(client.requests[3].tools)).toBe(JSON.stringify(p.tools));
    expect(JSON.stringify(client.requests[3].system)).toBe(JSON.stringify(p.system));
    const first = p.messages[0];
    expect(first.role).toBe('user');
    expect(String(first.content)).toContain('<reader_input>divorce</reader_input>');
  });
});

/* ------------------------------------------------------------------ */
/* Errors, abort, budgets                                              */
/* ------------------------------------------------------------------ */

function errorOf(events: InferenceEvent[]) {
  const e = events.find((x) => x.type === 'error');
  return e?.type === 'error' ? e : null;
}

describe('compose — failures', () => {
  it('refusal → error event (code refusal) then done; the refused turn’s tools never run', async () => {
    const kb = createFakeKb();
    const client = new FakeModelClient([reply([toolUse('find_topics', { query: 'divorce' })], 'refusal')]);
    const events = await collect((emit) => runCompose(DIVORCE, { kb, client, config: testConfig() }, emit, new AbortController().signal));
    expect(errorOf(events)).toMatchObject({ code: 'refusal' });
    expect(events.at(-1)).toEqual({ type: 'done' });
    expect(kb.calls).toEqual([]);
    expect(events.some((e) => e.type === 'study')).toBe(false);
  });

  it('rate limit → error event (code rate-limited)', async () => {
    const events = await collect((emit) => runCompose(DIVORCE, deps(new FakeModelClient([fail(rateLimitError())])), emit, new AbortController().signal));
    expect(errorOf(events)).toMatchObject({ code: 'rate-limited' });
    expect(events.at(-1)).toEqual({ type: 'done' });
  });

  it('overloaded (529) → retried, then overloaded; bad credential → no-credentials', async () => {
    const client = new FakeModelClient([fail(overloadedError()), fail(overloadedError()), fail(overloadedError())]);
    const a = await collect((emit) => runCompose(DIVORCE, deps(client, { retryDelaysMs: [0, 0] }), emit, new AbortController().signal));
    expect(errorOf(a)?.code).toBe('overloaded');
    expect(client.calls).toBe(3);
    const b = await collect((emit) => runCompose(DIVORCE, deps(new FakeModelClient([fail(authError())])), emit, new AbortController().signal));
    expect(errorOf(b)?.code).toBe('no-credentials');
  });

  it('errors delivered inside an open stream (no HTTP status) are classified by their type', async () => {
    const streamed = new Anthropic.APIError(undefined, { type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } }, 'Overloaded', undefined);
    const events = await collect((emit) => runCompose(DIVORCE, deps(new FakeModelClient([fail(streamed), fail(streamed), fail(streamed)]), { retryDelaysMs: [0, 0] }), emit, new AbortController().signal));
    expect(errorOf(events)?.code).toBe('overloaded');
  });

  it('no credential → no-credentials without calling the model', async () => {
    const events = await collect((emit) => runCompose(DIVORCE, deps(null), emit, new AbortController().signal));
    expect(errorOf(events)).toMatchObject({ code: 'no-credentials', message: expect.stringMatching(/ANTHROPIC_API_KEY/) });
    expect(events.map((e) => e.type)).toEqual(['error', 'done']);
  });

  it('client abort → stops the model stream, emits aborted, runs no further turns', async () => {
    const controller = new AbortController();
    const client = new FakeModelClient([researchTurn1, hang, finishTurn]);
    const events: InferenceEvent[] = [];
    const done = runCompose(DIVORCE, deps(client), (e) => {
      events.push(e);
      // abort once the first research results are in and the second turn is streaming
      if (e.type === 'progress' && /Searching the Bible dictionaries/.test(e.step.detail)) setTimeout(() => controller.abort(), 20);
    }, controller.signal);
    await done;
    expect(errorOf(events)?.code).toBe('aborted');
    expect(events.at(-1)).toEqual({ type: 'done' });
    expect(client.calls).toBe(2);
  });

  it('a model that never starts the page → invalid-output after nudges', async () => {
    const client = new FakeModelClient([reply([textBlock('Divorce is a hard topic.')], 'end_turn'), reply([textBlock('Still thinking.')], 'end_turn'), reply([textBlock('Done.')], 'end_turn')]);
    const events = await collect((emit) => runCompose(DIVORCE, deps(client), emit, new AbortController().signal));
    expect(errorOf(events)?.code).toBe('invalid-output');
    expect(client.calls).toBe(3);
    // the nudge is a user turn after the model's text
    const nudged = client.requests[1].messages.at(-1)!;
    expect(nudged.role).toBe('user');
    expect(String(nudged.content)).toMatch(/Call begin_page now/);
  });

  it('max_tokens with a tool_use → the truncated call is not run', async () => {
    const kb = createFakeKb();
    const client = new FakeModelClient([reply([toolUse('find_topics', { query: 'divor' })], 'max_tokens')]);
    const events = await collect((emit) => runCompose(DIVORCE, { kb, client, config: testConfig() }, emit, new AbortController().signal));
    expect(kb.calls).toEqual([]);
    expect(errorOf(events)).toMatchObject({ code: 'invalid-output', message: expect.stringMatching(/cut off/) });
  });

  it('invalid tool input (eager streaming, no server-side validation) → is_error tool result, loop continues', async () => {
    const client = new FakeModelClient([
      reply([toolUse('read_passage', { ref: 'Matthew 19' }), toolUse('add_section', 'not json')]),
      reply([textBlock('ok')], 'end_turn'),
      reply([textBlock('ok')], 'end_turn'),
      reply([textBlock('ok')], 'end_turn'),
    ]);
    await collect((emit) => runCompose(DIVORCE, deps(client), emit, new AbortController().signal));
    const results = Array.from(toolResults(client.requests[1]).values());
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.isError)).toBe(true);
    expect(results[0].content).toMatch(/Invalid input for read_passage \(references: /);
    expect(results[1].content).toMatch(/Call begin_page first/);
  });
});

describe('compose — budgets', () => {
  it('research-call budget: extra calls get an error result and a mid-conversation system message says “compose now”', async () => {
    const client = new FakeModelClient([
      reply([toolUse('find_topics', { query: 'divorce' }), toolUse('lexicon', { query: 'divorce' }), toolUse('search_knowledge', { query: 'divorce', kinds: ['dictionary'] })]),
      composeTurn,
      finishTurn,
    ]);
    const events = await collect((emit) => runCompose(DIVORCE, deps(client, { config: testConfig({ maxResearchCalls: 2 }) }), emit, new AbortController().signal));
    const second = client.requests[1];
    const results = Array.from(toolResults(second).values());
    expect(results.map((r) => r.isError)).toEqual([false, false, true]);
    expect(results[2].content).toMatch(/Research budget reached \(2 of 2 calls used\)/);
    const last = second.messages.at(-1)!;
    expect(last.role).toBe('system');
    expect(String(last.content)).toMatch(/Research budget reached.*Compose the page now/);
    const steps = events.flatMap((e) => (e.type === 'progress' ? [e.step] : []));
    expect(steps.some((s) => s.stage === 'Budget')).toBe(true);
    // the page is composed from what the two calls returned (items citing missing evidence are dropped)
    expect(events.some((e) => e.type === 'study' && e.complete)).toBe(true);
  });

  it('wall-clock deadline: a page with accepted sections is finalised (complete) with a caution; nothing is cached', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'emmaus-cache-'));
    try {
      const cache = new PageCache(dir);
      const client = new FakeModelClient([researchTurn1, researchTurn2, reply(composeTurnWithout('commentary')), hang]);
      const events = await collect((emit) => runCompose(DIVORCE, deps(client, { cache, config: testConfig({ totalMs: 400 }) }), emit, new AbortController().signal));
      expect(errorOf(events)).toBeNull();
      const final = events.filter((e) => e.type === 'study').at(-1);
      expect(final).toMatchObject({ complete: true });
      const r = events.find((e) => e.type === 'reply');
      expect(r?.type === 'reply' && r.reply.blocks?.some((b) => b.type === 'note' && b.tone === 'caution')).toBe(true);
      if (final?.type === 'study') expect(final.study.opening?.text).toBe(final.study.summary?.text);
      expect(await readdir(dir)).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

function composeTurnWithout(section: string) {
  const turn = composeTurn({} as never, { index: 0 }) as ReturnType<typeof message>;
  return turn.content.filter((b) => !(b.type === 'tool_use' && (b.input as { section?: string }).section === section));
}

/* ------------------------------------------------------------------ */
/* Page cache & logs                                                   */
/* ------------------------------------------------------------------ */

describe('page cache', () => {
  let dir = '';
  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = '';
  });

  it('serves an identical query from the cache (marked cached) without a model call; regenerate bypasses it', async () => {
    dir = await mkdtemp(join(tmpdir(), 'emmaus-cache-'));
    const cache = new PageCache(join(dir, 'pages'));
    const writeLog = createRunLogWriter(join(dir, 'logs'));
    const first = new FakeModelClient(DIVORCE_SCRIPT);
    const composed = await collect((emit) => runCompose(DIVORCE, deps(first, { cache, writeLog }), emit, new AbortController().signal));
    const original = composed.filter((e) => e.type === 'study').at(-1) as { study: Study };

    const second = new FakeModelClient([]);
    const hit = await collect((emit) => runCompose({ query: '  Divorce? ', translation: 'BSB' }, deps(second, { cache, writeLog }), emit, new AbortController().signal));
    expect(second.calls).toBe(0);
    expect(hit.map((e) => e.type)).toEqual(['progress', 'study', 'reply', 'done']);
    const cachedStudy = hit[1].type === 'study' ? hit[1] : null;
    expect(cachedStudy).toMatchObject({ complete: true, study: { id: original.study.id, generation: { cached: true } } });
    expect(hit[0].type === 'progress' && hit[0].step.stage).toBe('Cache');

    // another translation is another page
    const kjv = new FakeModelClient([fail(rateLimitError())]);
    await collect((emit) => runCompose({ query: 'divorce', translation: 'KJV' }, deps(kjv, { cache }), emit, new AbortController().signal));
    expect(kjv.calls).toBe(1);

    const again = new FakeModelClient(DIVORCE_SCRIPT);
    const regenerated = await collect((emit) => runCompose({ ...DIVORCE, regenerate: true }, deps(again, { cache }), emit, new AbortController().signal));
    expect(again.calls).toBe(4);
    const fresh = regenerated.filter((e) => e.type === 'study').at(-1) as { study: Study };
    expect(fresh.study.id).toBe(original.study.id);
    expect(fresh.study.generation?.cached).toBeUndefined();

    const logs = await readdir(join(dir, 'logs'));
    expect(logs.length).toBe(2);
    expect(logs.every((f) => /^\d{4}-\d{2}-\d{2}T.*-divorce\.json$/.test(f))).toBe(true);
    const log = JSON.parse(await readFile(join(dir, 'logs', logs.sort()[0]), 'utf8')) as RunLog;
    expect(JSON.stringify(log)).not.toContain('test-key-not-real');
  });
});

/* ------------------------------------------------------------------ */
/* Follow-up answers                                                   */
/* ------------------------------------------------------------------ */

async function composedStudy(): Promise<Study> {
  const events = await collect((emit) => runCompose(DIVORCE, deps(new FakeModelClient(DIVORCE_SCRIPT)), emit, new AbortController().signal));
  return (events.filter((e) => e.type === 'study').at(-1) as { study: Study }).study;
}

describe('answer', () => {
  it('researches, extends a generated page (same id, snapshot), then replies with focus', async () => {
    const study = await composedStudy();
    const client = new FakeModelClient([
      reply([toolUse('lexicon', { query: 'G647' })]),
      reply([
        toolUse('add_section', { section: 'original-languages', items: [{ strong: 'G647', english: 'certificate of divorce', anchor: { reference: 'Matthew 19:7', phrase: 'certificate of divorce' }, significance: 'The Greek term for the bill of divorce Moses required.', evidence: ['E1'] }] }),
        toolUse('reply', { text: 'Matthew 19:7 uses apostasion, the bill of divorce of Deuteronomy 24:1.', evidence: ['E1'], focus: { section: 'original-languages', verses: ['Matthew 19:7'] }, suggestions: ['What did Moses permit?'] }),
      ]),
    ]);
    const req: AnswerRequest = { question: 'What is the Greek word for the certificate?', study, history: [], conversation: {}, translation: 'BSB' };
    const events = await collect((emit) => runAnswer(req, deps(client), emit, new AbortController().signal));
    expect(events.map((e) => e.type).filter((t) => t !== 'progress')).toEqual(['study', 'reply', 'done']);
    const snap = events.find((e) => e.type === 'study');
    if (snap?.type !== 'study') throw new Error('no snapshot');
    expect(snap.study.id).toBe(study.id);
    expect(snap.study.keyWords.map((k) => k.strong)).toEqual(['G630', 'H3748', 'G4202', 'G647']);
    const added = snap.study.keyWords[3];
    expect(added.id.startsWith(`${study.id}:f`)).toBe(true);
    expect(new Set(snap.study.keyWords.map((k) => k.id)).size).toBe(4);
    const r = events.find((e) => e.type === 'reply');
    if (r?.type !== 'reply') throw new Error('no reply');
    expect(r.focus).toMatchObject({ section: 'original-languages', highlightVerses: [{ book: 'MAT', chapter: 19, verse: 7 }], highlightWordIds: [added.id], expandIds: [added.id] });
    expect(r.conversation).toEqual({ activeVerse: { book: 'MAT', chapter: 19, verse: 7 } });
    expect(r.reply).toMatchObject({ studyId: study.id, suggestions: ['What did Moses permit?'] });
    expect(r.reply.updates?.[0]).toEqual({ section: 'original-languages', label: 'Added 1 key word to Original languages' });
    expect((r.reply.blocks?.[0] as { text: string }).text).toContain('{{ref:MAT.19.7|Matthew 19:7}}');
  });

  it('does not extend a curated page, and a declined answer is passed through', async () => {
    const study = { ...(await composedStudy()), depth: 'curated' as const };
    const client = new FakeModelClient([
      reply([toolUse('add_section', { section: 'commentary', voices: [] })]),
      reply([toolUse('reply', { text: 'The knowledge base has no Eastern Orthodox text on remarriage, so I cannot describe that view.', evidence: [], declined: true, focus: { section: 'theology' } })]),
    ]);
    const req: AnswerRequest = { question: 'What do the Orthodox say?', study, history: [{ role: 'user', text: 'divorce' }], conversation: {}, translation: 'BSB' };
    const events = await collect((emit) => runAnswer(req, deps(client), emit, new AbortController().signal));
    expect(Array.from(toolResults(client.requests[1]).values())[0]).toMatchObject({ isError: true, content: expect.stringMatching(/cannot be extended/) });
    expect(events.some((e) => e.type === 'study')).toBe(false);
    const r = events.find((e) => e.type === 'reply');
    if (r?.type !== 'reply') throw new Error('no reply');
    expect(r.reply.declined).toBe(true);
    expect(r.focus?.section).toBe('theology');
  });

  it('begin_page is refused in the answer flow; no reply → invalid-output', async () => {
    const study = await composedStudy();
    const client = new FakeModelClient([
      reply([toolUse('begin_page', { title: 'x', kind: 'topic', summary: { text: 'x', evidence: ['E1'] } })]),
      reply([textBlock('…')], 'end_turn'),
      reply([textBlock('…')], 'end_turn'),
      reply([textBlock('…')], 'end_turn'),
    ]);
    const req: AnswerRequest = { question: 'q', study, history: [], conversation: {}, translation: 'BSB' };
    const events = await collect((emit) => runAnswer(req, deps(client), emit, new AbortController().signal));
    expect(Array.from(toolResults(client.requests[1]).values())[0].content).toMatch(/not available for follow-up answers/);
    expect(errorOf(events)?.code).toBe('invalid-output');
  });
});
