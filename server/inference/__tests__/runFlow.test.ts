/**
 * Run-level behaviour behind the review findings: research budget accounting and
 * multi-passage reads, theology sub-lists, a second begin_page, transient API
 * failures (retry, then finalise a partial page), fallback-served turns (usage,
 * caching), the page-cache fingerprint, and mid-conversation system-message placement.
 */
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { afterEach, describe, expect, it } from 'vitest';
import type { ComposeRequest, InferenceEvent } from '../../../src/inference/protocol';
import { generatorVersion, PageCache, pageCacheKey } from '../cache';
import type { RunLog } from '../logs';
import { runToolLoop, turnUsage } from '../loop';
import type { BetaMessage } from '../modelClient';
import { runCompose, type RunDeps } from '../run';
import { createFakeKb, FakeModelClient, fail, message, overloadedError, reply, testConfig, textBlock, toolResults, toolUse, type ScriptedTurn } from './fakes';

const DIVORCE: ComposeRequest = { query: 'divorce', translation: 'BSB' };

async function collect(run: (emit: (e: InferenceEvent) => void) => Promise<void>): Promise<InferenceEvent[]> {
  const events: InferenceEvent[] = [];
  await run((e) => events.push(e));
  return events;
}

function deps(client: FakeModelClient | null, overrides: Partial<RunDeps> = {}): RunDeps {
  return { kb: createFakeKb(), client, config: testConfig(), retryDelaysMs: [0, 0], ...overrides };
}

const errorOf = (events: InferenceEvent[]) => {
  const e = events.find((x) => x.type === 'error');
  return e?.type === 'error' ? e : null;
};
const finalStudy = (events: InferenceEvent[]) => {
  const s = events.filter((e) => e.type === 'study').at(-1);
  return s?.type === 'study' ? s : null;
};

// E1 Nave's · E2 Torrey's · E3 Deuteronomy 24:1–4 (a key passage must have been read)
const research = reply([toolUse('find_topics', { query: 'divorce' }), toolUse('read_passage', { reference: 'Deuteronomy 24:1–4' })]);
const begin = toolUse('begin_page', { title: 'Divorce in the Bible', kind: 'topic', question: 'What does the Bible say about divorce?', summary: { text: 'What the Bible says about divorce.', evidence: ['E1'] } });
const keyPassages = toolUse('add_section', {
  section: 'key-passages',
  items: [{ reference: 'Deuteronomy 24:1–4', title: 'The certificate of divorce', note: 'Moses regulates an existing practice.', group: 'The Law', evidence: ['E1'] }],
});
const finish = toolUse('finish_page', { opening: { text: 'A page on divorce from the passages Nave’s lists.', evidence: ['E1'] }, concepts: [], suggestedQuestions: ['What did Moses permit?'] });

describe('research budget', () => {
  it('read_passage takes several passages in one call, counted once; every result says how many calls are used', async () => {
    const kb = createFakeKb();
    const client = new FakeModelClient([
      reply([toolUse('read_passage', { references: ['Deuteronomy 24:1–4', 'Matthew 19:3–9', 'Malachi 2:14–16'] }), toolUse('original_text', { references: ['Deuteronomy 24:1', 'Matthew 19:9'] })]),
      reply([textBlock('done')], 'end_turn'),
      reply([textBlock('done')], 'end_turn'),
      reply([textBlock('done')], 'end_turn'),
    ]);
    await collect((emit) => runCompose(DIVORCE, deps(client, { kb }), emit, new AbortController().signal));
    expect(kb.calls.filter((c) => c.method === 'passage')).toHaveLength(3);
    expect(kb.calls.filter((c) => c.method === 'originalText')).toHaveLength(2);
    const [passages, greek] = Array.from(toolResults(client.requests[1]).values());
    expect(passages.content).toMatch(/3 items \(E1, E2, E3\)/);
    expect(passages.content).toMatch(/Research calls used: 2 of 16\.$/);
    expect(greek.content).toMatch(/Research calls used: 2 of 16\.$/);
  });

  it('a search in a kind the knowledge base holds nothing of says so, so the model does not retry', async () => {
    const kb = createFakeKb({ overrides: { holdings: () => ({ kinds: { dictionary: 1 }, traditions: [], missing: ['Eastern Orthodox'] }) } });
    const client = new FakeModelClient([
      reply([toolUse('search_knowledge', { query: 'purgatory', kinds: ['confession'] }), toolUse('search_knowledge', { query: 'Orthodox economia second marriage' })]),
      reply([textBlock('done')], 'end_turn'),
      reply([textBlock('done')], 'end_turn'),
      reply([textBlock('done')], 'end_turn'),
    ]);
    await collect((emit) => runCompose(DIVORCE, deps(client, { kb }), emit, new AbortController().signal));
    const [confessions, orthodox] = Array.from(toolResults(client.requests[1]).values());
    expect(confessions.content).toMatch(/holds no creed, confession or catechism texts — do not search for them again/);
    expect(orthodox.content).toMatch(/holds no Eastern Orthodox texts/);
  });
});

describe('composition tools', () => {
  it('theology: themes and perspectives sent in separate calls are both kept', async () => {
    const client = new FakeModelClient([
      reply([toolUse('search_knowledge', { query: 'divorce', kinds: ['confession', 'dictionary'] })]),
      // E1 Easton's · E2 WCF · E3 Trent
      reply([
        begin,
        toolUse('add_section', { section: 'theology', themes: [{ category: 'ethics', title: 'Christ limits divorce', summary: 'Easton’s says Christ limited divorce to adultery.', keyVerses: [], evidence: ['E1'] }] }),
        toolUse('add_section', {
          section: 'theology',
          perspectives: [
            {
              question: 'May the innocent party remarry?',
              consensus: 'denominational',
              intro: 'Churches read the exception differently.',
              evidence: ['E2', 'E3'],
              positions: [
                { tradition: 'Reformed', label: 'Permitted', summary: 'The Westminster Confession allows the innocent party to remarry.', evidence: ['E2'] },
                { tradition: 'Catholic', label: 'Not permitted', summary: 'Trent teaches that adultery does not dissolve the bond.', evidence: ['E3'] },
              ],
            },
          ],
        }),
        toolUse('finish_page', { opening: { text: 'A page on divorce.', evidence: ['E1'] }, concepts: [], suggestedQuestions: [] }),
      ]),
    ]);
    const events = await collect((emit) => runCompose(DIVORCE, deps(client), emit, new AbortController().signal));
    // begin_page first needs an E1 that names the topic: the summary cites Easton's (E1)
    expect(errorOf(events)).toBeNull();
    const study = finalStudy(events)!.study;
    expect(study.theology.map((t) => t.title)).toEqual(['Christ limits divorce']);
    expect(study.perspectives[0].perspectives.map((p) => p.tradition)).toEqual(['Reformed', 'Catholic']);
    expect(study.perspectives[0].perspectives[0].representatives).toEqual(['westminster-assembly']);
  });

  it('a second begin_page cannot change kind or passage once sections exist; it may update the title', async () => {
    const client = new FakeModelClient([
      research,
      reply([
        begin,
        keyPassages,
        toolUse('begin_page', { title: 'Matthew 19', kind: 'passage', passage: 'Matthew 19:3–9', summary: { text: 'Jesus on divorce.', evidence: ['E1'] } }),
        toolUse('begin_page', { title: 'Divorce and remarriage', kind: 'topic', summary: { text: 'What the Bible says about divorce and remarriage.', evidence: ['E1'] } }),
        finish,
      ]),
    ]);
    const logs: RunLog[] = [];
    const events = await collect((emit) => runCompose(DIVORCE, deps(client, { writeLog: async (l) => (logs.push(l), null) }), emit, new AbortController().signal));
    const study = finalStudy(events)!.study;
    expect(study).toMatchObject({ kind: 'topic', title: 'Divorce and remarriage' });
    expect(study.topic?.keyPassages).toHaveLength(1);
    expect(study.passage).toBeUndefined();
    const begins = logs[0].toolCalls.filter((t) => t.name === 'begin_page');
    expect(begins.map((b) => b.isError)).toEqual([false, true, false]);
    expect(begins[1].result).toMatch(/already begun as a topic page and has sections; a second begin_page may only update title/);
  });
});

describe('transient API failures', () => {
  it('an overloaded error inside the stream is retried and the run completes', async () => {
    const streamed = new Anthropic.APIError(undefined, { type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } }, 'Overloaded', undefined);
    const logs: RunLog[] = [];
    const client = new FakeModelClient([research, fail(streamed), reply([begin, keyPassages, finish])]);
    const events = await collect((emit) => runCompose(DIVORCE, deps(client, { writeLog: async (l) => (logs.push(l), null) }), emit, new AbortController().signal));
    expect(errorOf(events)).toBeNull();
    expect(finalStudy(events)?.complete).toBe(true);
    expect(logs[0].turns.map((t) => t.retries)).toEqual([0, 1]);
  });

  it('when retries are exhausted after sections were accepted, the checked sections are finalised (with a caution) and not cached', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'emmaus-cache-'));
    try {
      const cache = new PageCache(dir);
      const client = new FakeModelClient([research, reply([begin, keyPassages]), fail(overloadedError()), fail(overloadedError()), fail(overloadedError())]);
      const events = await collect((emit) => runCompose(DIVORCE, deps(client, { cache }), emit, new AbortController().signal));
      expect(errorOf(events)).toBeNull();
      const final = finalStudy(events)!;
      expect(final.complete).toBe(true);
      expect(final.study.topic?.keyPassages).toHaveLength(1);
      const r = events.find((e) => e.type === 'reply');
      expect(r?.type === 'reply' && r.reply.blocks?.some((b) => b.type === 'note' && /interrupted by a temporary Claude API error/.test(b.text))).toBe(true);
      expect(await readdir(dir)).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('an account rejection (400, no credit) after sections were accepted keeps the checked sections with a caution; the reader never sees the provider JSON', async () => {
    const body = { type: 'error', error: { type: 'invalid_request_error', message: 'Your credit balance is too low to access the Anthropic API.' }, request_id: 'req_test' };
    const billing = new Anthropic.BadRequestError(400, body, JSON.stringify(body), new Headers());
    const outcomes: unknown[] = [];
    const logs: RunLog[] = [];
    const client = new FakeModelClient([research, reply([begin, keyPassages]), fail(billing)]);
    const events = await collect((emit) =>
      runCompose(DIVORCE, deps(client, { onOutcome: (e) => outcomes.push(e), writeLog: async (l) => (logs.push(l), null) }), emit, new AbortController().signal),
    );
    expect(errorOf(events)).toBeNull();
    expect(client.calls).toBe(3); // not retried
    expect(finalStudy(events)?.complete).toBe(true);
    const r = events.find((e) => e.type === 'reply');
    const noteText = r?.type === 'reply' ? (r.reply.blocks ?? []).map((b) => ('text' in b ? b.text : '')).join(' ') : '';
    expect(noteText).toMatch(/interrupted by a Claude API error, so this page is incomplete/);
    expect(JSON.stringify(events)).not.toMatch(/req_test|credit balance is too low/);
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0]).toMatchObject({ persistent: true });
    expect(logs[0].outcome.interruption?.upstream).toMatch(/credit balance is too low.*req_test/);
  });

  it('the same rejection before any section: a plain error message, the provider text only in the log', async () => {
    const body = { type: 'error', error: { type: 'invalid_request_error', message: 'Your credit balance is too low to access the Anthropic API.' }, request_id: 'req_test' };
    const logs: RunLog[] = [];
    const events = await collect((emit) =>
      runCompose(DIVORCE, deps(new FakeModelClient([fail(new Anthropic.BadRequestError(400, body, JSON.stringify(body), new Headers()))]), { writeLog: async (l) => (logs.push(l), null) }), emit, new AbortController().signal),
    );
    expect(errorOf(events)).toMatchObject({ code: 'no-credit', message: expect.stringMatching(/no remaining credit/) });
    expect(JSON.stringify(events)).not.toMatch(/req_test|\{\\"type/);
    expect(logs[0].outcome.error?.upstream).toMatch(/req_test/);
  });

  it('a refusal after the page began says the shown sections passed the checks (not “nothing was generated”)', async () => {
    const client = new FakeModelClient([research, reply([begin, keyPassages]), reply([toolUse('finish_page', {})], 'refusal')]);
    const events = await collect((emit) => runCompose(DIVORCE, deps(client), emit, new AbortController().signal));
    expect(errorOf(events)).toMatchObject({ code: 'refusal', message: expect.stringMatching(/declined to continue composing this page\. The sections shown so far passed the source checks/) });
  });
});

/** A turn served by a fallback model after a sticky route: no fallback block, a fallback_message iteration. */
function fallbackServed(content: ReturnType<typeof toolUse>[]): ScriptedTurn {
  return () => {
    const m = message(content, 'tool_use', { model: 'claude-opus-4-8' });
    (m.usage as { iterations?: unknown }).iterations = [
      { type: 'message', model: 'claude-opus-5', input_tokens: 100, output_tokens: 10, cache_read_input_tokens: 1000, cache_creation_input_tokens: 0, cache_creation: null },
      { type: 'fallback_message', model: 'claude-opus-4-8', input_tokens: 200, output_tokens: 300, cache_read_input_tokens: 0, cache_creation_input_tokens: 50, cache_creation: null },
    ];
    return m;
  };
}

describe('server-side fallbacks', () => {
  it('detects a fallback-served turn from usage.iterations, sums usage over iterations, and does not cache the page', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'emmaus-cache-'));
    try {
      const cache = new PageCache(dir);
      const logs: RunLog[] = [];
      const client = new FakeModelClient([research, fallbackServed([begin, keyPassages, finish])]);
      const events = await collect((emit) => runCompose(DIVORCE, deps(client, { cache, writeLog: async (l) => (logs.push(l), null) }), emit, new AbortController().signal));
      expect(finalStudy(events)?.complete).toBe(true);
      expect(logs[0].turns[1]).toMatchObject({ fallback: true, model: 'claude-opus-4-8', usage: { input: 300, output: 310, cacheRead: 1000, cacheCreation: 50 } });
      expect(logs[0]).toMatchObject({ modelUsed: 'claude-opus-4-8', fallbackTurns: 1 });
      expect(events.some((e) => e.type === 'progress' && /served by the fallback model/.test(e.step.detail))).toBe(true);
      expect(await readdir(dir)).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('turnUsage falls back to top-level usage when there are no iterations', () => {
    const m = message([], 'end_turn') as BetaMessage;
    expect(turnUsage(m)).toEqual({ input: 1200, output: 300, cacheRead: 5000, cacheCreation: 0 });
  });
});

describe('page cache fingerprint', () => {
  let dir = '';
  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = '';
  });

  const script = () => new FakeModelClient([research, reply([begin, keyPassages, finish])]);

  it('a page composed from another knowledge-base version, effort or budget is recomposed, not served', async () => {
    dir = await mkdtemp(join(tmpdir(), 'emmaus-cache-'));
    const cache = new PageCache(dir);
    await collect((emit) => runCompose(DIVORCE, deps(script(), { cache, kb: createFakeKb({ version: 'kb-1' }) }), emit, new AbortController().signal));
    const same = new FakeModelClient([]);
    const hit = await collect((emit) => runCompose(DIVORCE, deps(same, { cache, kb: createFakeKb({ version: 'kb-1' }) }), emit, new AbortController().signal));
    expect(same.calls).toBe(0);
    expect(hit[0].type === 'progress' && hit[0].step.stage).toBe('Cache');
    for (const [label, d] of [
      ['kb', deps(script(), { cache, kb: createFakeKb({ version: 'kb-2' }) })],
      ['effort', deps(script(), { cache, kb: createFakeKb({ version: 'kb-2' }), config: testConfig({ effort: 'medium' }) })],
      ['budget', deps(script(), { cache, kb: createFakeKb({ version: 'kb-2' }), config: testConfig({ effort: 'medium', maxResearchCalls: 8 }) })],
    ] as const) {
      const client = d.client as FakeModelClient;
      await collect((emit) => runCompose(DIVORCE, d, emit, new AbortController().signal));
      expect(client.calls, label).toBe(2);
    }
    // the entry was overwritten in place (one file per key)
    expect((await readdir(dir)).filter((f) => f.endsWith('.json'))).toHaveLength(1);
  });

  it('never serves a page composed in one language to a request in another', async () => {
    dir = await mkdtemp(join(tmpdir(), 'emmaus-cache-'));
    const cache = new PageCache(dir);
    const kb = createFakeKb({ version: 'kb-1' });
    const en = await collect((emit) => runCompose(DIVORCE, deps(script(), { cache, kb }), emit, new AbortController().signal));
    const ptClient = script();
    const pt = await collect((emit) => runCompose({ ...DIVORCE, locale: 'pt' }, deps(ptClient, { cache, kb }), emit, new AbortController().signal));
    expect(ptClient.calls).toBe(2);
    expect(finalStudy(pt)?.study.id).not.toBe(finalStudy(en)?.study.id);
    const again = new FakeModelClient([]);
    const hit = await collect((emit) => runCompose({ ...DIVORCE, locale: 'pt' }, deps(again, { cache, kb }), emit, new AbortController().signal));
    expect(again.calls).toBe(0);
    expect(finalStudy(hit)?.study.id).toBe(finalStudy(pt)?.study.id);
    expect((await readdir(dir)).filter((f) => f.endsWith('.json'))).toHaveLength(2);
  });

  it('the client hint is part of the key; the generator version hashes the generator code', () => {
    const plain = pageCacheKey('Matthew 19', 'BSB', 'claude-opus-5');
    const hinted = pageCacheKey('Matthew 19', 'BSB', 'claude-opus-5', { passage: { book: 'MAT', startChapter: 19 } });
    expect(hinted).not.toBe(plain);
    expect(pageCacheKey('grace', 'BSB', 'm', { topic: 'Grace' })).toBe('grace|BSB|m|topic:grace');
    const root = fileURLToPath(new URL('../../../', import.meta.url));
    expect(generatorVersion(root)).toMatch(/^[0-9a-f]{12}$/);
    expect(generatorVersion(root)).not.toBe(generatorVersion('/nonexistent'));
  });
});

describe('mid-conversation system messages', () => {
  const loopDeps = (client: FakeModelClient, hooks: Partial<Parameters<typeof runToolLoop>[1]> = {}) => {
    let budget = true;
    return runToolLoop(
      { client, config: testConfig({ maxTurns: 6 }), system: [], tools: [], messages: [{ role: 'user', content: 'go' }], signal: new AbortController().signal, deadlineReached: () => false, retryDelaysMs: [0, 0] },
      {
        executeTools: async (blocks) => blocks.map(() => ({ content: 'ok', isError: false })),
        isDone: () => false,
        budgetMessage: () => (budget ? ((budget = false), 'Compose now.') : null),
        nudge: (n) => (n <= 1 ? 'Finish the page.' : null),
        onTurn: () => {},
        ...hooks,
      },
    );
  };

  it('an empty turn after the budget note folds the note into the nudge (never [system, user])', async () => {
    const client = new FakeModelClient([reply([toolUse('find_topics', { query: 'x' })]), reply([], 'end_turn'), reply([textBlock('ok')], 'end_turn')]);
    await loopDeps(client);
    const third = client.requests[2].messages;
    for (let i = 0; i < third.length - 1; i++) {
      if (third[i].role === 'system') expect(third[i + 1].role).toBe('assistant');
    }
    expect(JSON.stringify(third.at(-1))).toMatch(/<system-reminder>Compose now\.<\/system-reminder>.*Finish the page/);
  });

  it('only a 400 about the system role folds system messages; any other 400 is raised', async () => {
    const badRequest = (msg: string) => new Anthropic.BadRequestError(400, { type: 'error', error: { type: 'invalid_request_error', message: msg } }, msg, new Headers());
    const other = new FakeModelClient([reply([toolUse('find_topics', { query: 'x' })]), fail(badRequest('prompt is too long: 1200000 tokens > 1000000 maximum'))]);
    await expect(loopDeps(other)).rejects.toBeInstanceOf(Anthropic.BadRequestError);
    const role = new FakeModelClient([reply([toolUse('find_topics', { query: 'x' })]), fail(badRequest("role 'system' is not supported on this model")), reply([textBlock('ok')], 'end_turn'), reply([textBlock('ok')], 'end_turn')]);
    await loopDeps(role);
    expect(role.requests[2].messages.some((m) => m.role === 'system')).toBe(false);
    expect(JSON.stringify(role.requests[2].messages)).toMatch(/<system-reminder>Compose now\.<\/system-reminder>/);
  });
});
