/**
 * HTTP layer (server/app.ts) over a real Node server on an ephemeral port: status,
 * SSE framing + heartbeat, request validation, routing, page cache on disk, and
 * client-disconnect → model stream abort.
 */
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createEventDecoder, encodeEvent, type InferenceEvent, type InferenceStatus } from '../../../src/inference/protocol';
import { createInferenceHandler, type InferenceAppOptions } from '../../app';
import { NO_CREDENTIAL_REASON } from '../config';
import { createFakeKb, FakeModelClient, message, reply, textBlock, toolUse, type ScriptedTurn } from './fakes';

let root = '';
const servers: Server[] = [];

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), 'emmaus-app-'));
});
afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});
afterEach(async () => {
  await Promise.all(servers.splice(0).map((s) => new Promise<void>((resolve) => s.close(() => resolve()))));
});

async function serve(env: Record<string, string>, options: InferenceAppOptions): Promise<string> {
  const handler = createInferenceHandler({ knowledgeBase: () => createFakeKb(), statusWaitMs: 500, ...options });
  const server = createServer((req, res) => {
    handler(req, res, { env, root }).catch((err: unknown) => {
      res.statusCode = 500;
      res.end(String(err));
    });
  });
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

const KEY_ENV = { ANTHROPIC_API_KEY: 'sk-test-not-real', EMMAUS_MODEL: 'claude-opus-5' };
const JSON_HEADERS = { 'content-type': 'application/json' };

async function readSse(res: Response): Promise<{ events: InferenceEvent[]; raw: string }> {
  const decode = createEventDecoder();
  const events: InferenceEvent[] = [];
  let raw = '';
  const reader = res.body!.getReader();
  const text = new TextDecoder();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = text.decode(value, { stream: true });
    raw += chunk;
    events.push(...decode(chunk));
  }
  return { events, raw };
}

describe('GET /api/inference/status', () => {
  it('reports unavailable with the .env.local instruction when no credential is configured (no model call)', async () => {
    let created = 0;
    const base = await serve({}, { createModelClient: () => (created++, new FakeModelClient([])) });
    const res = await fetch(`${base}/api/inference/status`);
    expect(res.headers.get('content-type')).toMatch(/application\/json/);
    const status = (await res.json()) as InferenceStatus;
    expect(status).toEqual({
      available: false,
      model: 'claude-opus-5',
      reason: NO_CREDENTIAL_REASON,
      reasonCode: 'no-credentials',
      knowledgeBase: { documents: 4, corpora: [expect.objectContaining({ id: 'naves' }), expect.objectContaining({ id: 'easton' })] },
    });
    expect(created).toBe(0);
  });

  it('is available with a key and a loaded knowledge base; EMMAUS_MODEL is reported', async () => {
    const base = await serve({ ...KEY_ENV, EMMAUS_MODEL: 'claude-opus-5-test' }, { createModelClient: () => new FakeModelClient([]) });
    const status = (await (await fetch(`${base}/api/inference/status`)).json()) as InferenceStatus;
    expect(status.available).toBe(true);
    expect(status.model).toBe('claude-opus-5-test');
    expect(status.reason).toBeUndefined();
    expect(status.reasonCode).toBeUndefined();
    expect(JSON.stringify(status)).not.toContain('sk-test');
  });

  it('after a run the account rejected (400, no credit), reports composition unavailable with a plain reason until a run succeeds', async () => {
    const body = { type: 'error', error: { type: 'invalid_request_error', message: 'Your credit balance is too low to access the Anthropic API.' }, request_id: 'req_status' };
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const turns: ScriptedTurn[] = [
      () => {
        throw new Anthropic.BadRequestError(400, body, JSON.stringify(body), new Headers());
      },
      reply([textBlock('Nothing to compose.')], 'end_turn'),
      reply([textBlock('Nothing to compose.')], 'end_turn'),
      reply([textBlock('Nothing to compose.')], 'end_turn'),
    ];
    const base = await serve({ ...KEY_ENV, EMMAUS_DEBUG_LOGS: 'off' }, { createModelClient: () => new FakeModelClient(turns) });
    const failed = await readSse(await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ query: 'divorce', regenerate: true }) }));
    expect(failed.raw).not.toMatch(/req_status|credit balance is too low/);
    const down = (await (await fetch(`${base}/api/inference/status`)).json()) as InferenceStatus;
    expect(down.available).toBe(false);
    expect(down.reason).toMatch(/no remaining credit/);
    expect(down.reasonCode).toBe('no-credit');
    // the next run reaches the model (it ends without a page, but the API served it): available again
    await readSse(await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ query: 'grace', regenerate: true }) }));
    const up = (await (await fetch(`${base}/api/inference/status`)).json()) as InferenceStatus;
    expect(up.available).toBe(true);
  });

  it('reports a knowledge base that failed to load', async () => {
    const base = await serve(KEY_ENV, { knowledgeBase: () => createFakeKb({ failReady: new Error('index corrupt') }) });
    const status = (await (await fetch(`${base}/api/inference/status`)).json()) as InferenceStatus;
    expect(status.available).toBe(false);
    expect(status.reason).toMatch(/failed to load \(index corrupt\)/);
    expect(status.reasonCode).toBe('kb-error');
  });
});

describe('POST /api/inference/compose (SSE)', () => {
  const slowFinish: ScriptedTurn = async () => {
    await new Promise((r) => setTimeout(r, 120));
    return message([textBlock('Nothing found.')], 'end_turn');
  };

  it('streams InferenceEvents as text/event-stream with heartbeats, ending with done', async () => {
    const client = new FakeModelClient([reply([toolUse('find_topics', { query: 'divorce' })]), slowFinish, slowFinish, slowFinish]);
    const base = await serve(KEY_ENV, { createModelClient: () => client, heartbeatMs: 25 });
    const res = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query: 'divorce', translation: 'BSB' }) });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('text/event-stream; charset=utf-8');
    expect(res.headers.get('cache-control')).toBe('no-cache, no-transform');
    expect(res.headers.get('x-accel-buffering')).toBe('no');
    const { events, raw } = await readSse(res);
    expect(raw.startsWith(': stream open\n\n')).toBe(true);
    expect(raw).toMatch(/\n: heartbeat \d+\n\n/);
    expect(raw).toContain(encodeEvent({ type: 'done' }));
    expect(events.at(-1)).toEqual({ type: 'done' });
    expect(events.filter((e) => e.type === 'progress').map((e) => (e.type === 'progress' ? e.step.detail : ''))).toContain('Looking up “divorce” in Nave’s Topical Bible and Torrey’s');
    const error = events.find((e) => e.type === 'error');
    expect(error).toMatchObject({ type: 'error', code: 'invalid-output' });
    // every event block is `event: <type>\ndata: <json>\n\n`
    for (const block of raw.split('\n\n').filter((b) => b.startsWith('event:'))) {
      const [ev, data] = block.split('\n');
      expect(JSON.parse(data.slice('data: '.length)).type).toBe(ev.slice('event: '.length));
    }
    // a debug log was written for the run
    expect((await readdir(join(root, '.kb-cache', 'logs'))).some((f) => f.endsWith('-divorce.json'))).toBe(true);
  });

  it('without a credential the stream carries a no-credentials error', async () => {
    const base = await serve({}, {});
    const res = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ query: 'grace', translation: 'BSB' }) });
    const { events } = await readSse(res);
    expect(events.filter((e) => e.type !== 'progress')).toEqual([expect.objectContaining({ type: 'error', code: 'no-credentials' }), { type: 'done' }]);
  });

  it('rejects invalid requests with JSON errors; routes and methods are checked', async () => {
    const base = await serve(KEY_ENV, { createModelClient: () => new FakeModelClient([]) });
    const empty = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ query: '   ', translation: 'BSB' }) });
    expect(empty.status).toBe(400);
    expect(await empty.json()).toMatchObject({ error: 'bad-request', message: expect.stringMatching(/query/) });
    const notJson = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: '{nope' });
    expect(notJson.status).toBe(400);
    const badTranslation = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ query: 'grace', translation: 'NIV' }) });
    expect(badTranslation.status).toBe(400);
    const get = await fetch(`${base}/api/inference/compose`);
    expect(get.status).toBe(405);
    expect(get.headers.get('allow')).toBe('POST');
    const missing = await fetch(`${base}/api/inference/nothing`);
    expect(missing.status).toBe(404);
    const answer = await fetch(`${base}/api/inference/answer`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ question: 'why?', study: { id: 'x' } }) });
    expect(answer.status).toBe(400);
  });

  it('a client disconnect aborts the model stream', async () => {
    let sawAbort: () => void = () => {};
    const aborted = new Promise<void>((resolve) => (sawAbort = resolve));
    const hanging: ScriptedTurn = (_p, { signal }) =>
      new Promise((_resolve, reject) => {
        signal?.addEventListener(
          'abort',
          () => {
            sawAbort();
            reject(new Error('aborted'));
          },
          { once: true },
        );
      });
    const base = await serve(KEY_ENV, { createModelClient: () => new FakeModelClient([hanging]) });
    const controller = new AbortController();
    const res = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ query: 'divorce', translation: 'BSB', regenerate: true }), signal: controller.signal });
    const reader = res.body!.getReader();
    await reader.read(); // stream open
    controller.abort();
    await expect(Promise.race([aborted.then(() => 'aborted'), new Promise((r) => setTimeout(() => r('timeout'), 3000))])).resolves.toBe('aborted');
  });
});

describe('request hardening and knowledge-base freshness', () => {
  // E1 Nave's · E2 Torrey's · E3 Deuteronomy 24:1–4 (a key passage must have been read)
  const research = reply([toolUse('find_topics', { query: 'divorce' }), toolUse('read_passage', { reference: 'Deuteronomy 24:1–4' })]);
  const composeAll = reply([
    toolUse('begin_page', { title: 'Divorce in the Bible', kind: 'topic', summary: { text: 'What the Bible says about divorce.', evidence: ['E1'] } }),
    toolUse('add_section', { section: 'key-passages', items: [{ reference: 'Deuteronomy 24:1–4', title: 'The certificate', note: 'Moses regulates divorce.', group: 'The Law', evidence: ['E1'] }] }),
    toolUse('finish_page', { opening: { text: 'A page on divorce from the passages Nave’s lists.', evidence: ['E1'] }, concepts: [], suggestedQuestions: [] }),
  ]);

  it('refuses non-JSON bodies (a cross-site “simple” POST) and cross-site origins before any model call', async () => {
    let created = 0;
    const base = await serve(KEY_ENV, { createModelClient: () => (created++, new FakeModelClient([])) });
    const body = JSON.stringify({ query: 'divorce', translation: 'BSB' });
    const plain = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body });
    expect(plain.status).toBe(415);
    const crossOrigin = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: { ...JSON_HEADERS, origin: 'https://evil.example' }, body });
    expect(crossOrigin.status).toBe(403);
    expect(((await crossOrigin.json()) as { message: string }).message).toMatch(/evil\.example/);
    const crossSite = await fetch(`${base}/api/inference/answer`, { method: 'POST', headers: { ...JSON_HEADERS, 'sec-fetch-site': 'cross-site' }, body });
    expect(crossSite.status).toBe(403);
    expect(created).toBe(0);
    // the app's own origin is fine
    const own = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: { ...JSON_HEADERS, origin: base, 'sec-fetch-site': 'same-origin' }, body: JSON.stringify({ query: 'grace', translation: 'BSB' }) });
    expect(own.headers.get('content-type')).toMatch(/event-stream/);
    await readSse(own);
  });

  it('limits concurrent runs (429 with a rate-limited code)', async () => {
    let release: () => void = () => {};
    const gate = new Promise<void>((r) => (release = r));
    const slow: ScriptedTurn = async () => {
      await gate;
      return message([textBlock('…')], 'end_turn');
    };
    const base = await serve(KEY_ENV, { createModelClient: () => new FakeModelClient([slow, slow, slow, slow, slow, slow, slow, slow]), maxConcurrentRuns: 1 });
    const first = fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ query: 'divorce', translation: 'BSB', regenerate: true }) });
    const firstRes = await first;
    const busy = await fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ query: 'grace', translation: 'BSB' }) });
    expect(busy.status).toBe(429);
    expect(await busy.json()).toMatchObject({ code: 'rate-limited' });
    release();
    await readSse(firstRes);
  });

  it('an identical compose request waits for the one in flight and opens its page from the cache', async () => {
    const delayed: ScriptedTurn = async (p, i) => {
      await new Promise((r) => setTimeout(r, 150));
      return research(p, i);
    };
    const client = new FakeModelClient([delayed, composeAll]);
    const base = await serve(KEY_ENV, { createModelClient: () => client });
    const body = JSON.stringify({ query: 'divorce in the bible', translation: 'BSB' });
    const [a, b] = await Promise.all([
      fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body }),
      new Promise((r) => setTimeout(r, 40)).then(() => fetch(`${base}/api/inference/compose`, { method: 'POST', headers: JSON_HEADERS, body })),
    ]);
    const [ea, eb] = await Promise.all([readSse(a), readSse(b)]);
    expect(ea.events.some((e) => e.type === 'study' && e.complete)).toBe(true);
    expect(eb.events.some((e) => e.type === 'progress' && /waiting for it/.test(e.step.detail))).toBe(true);
    expect(eb.events.some((e) => e.type === 'study' && e.complete && e.study.generation?.cached)).toBe(true);
    expect(client.calls).toBe(2);
  });

  it('rebuilds the knowledge base when kb/corpus changes, and reports its version', async () => {
    let fingerprint = 'corpus-1';
    let built = 0;
    const base = await serve(KEY_ENV, {
      corpusFingerprint: async () => fingerprint,
      knowledgeBase: () => (built++, createFakeKb({ version: `v${built}` })),
      createModelClient: () => new FakeModelClient([]),
    });
    const status = async () => ((await (await fetch(`${base}/api/inference/status`)).json()) as InferenceStatus).knowledgeBase.version;
    expect(await status()).toBe('v1');
    expect(await status()).toBe('v1');
    fingerprint = 'corpus-2';
    await new Promise((r) => setTimeout(r, 1100)); // the corpus is checked at most once a second
    expect(await status()).toBe('v2');
    expect(built).toBe(2);
  });
});
