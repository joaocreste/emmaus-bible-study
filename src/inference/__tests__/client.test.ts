import { describe, expect, it, vi } from 'vitest';
import type { Study } from '../../domain/models';
import { createInferenceClient, httpError, normalizeStatus } from '../client';
import { encodeEvent, type InferenceEvent } from '../protocol';

function study(id = 'generated-divorce', extra: Partial<Study> = {}): Study {
  return {
    id,
    kind: 'topic',
    depth: 'generated',
    title: 'Divorce',
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
    ...extra,
  };
}

/** A streaming Response whose body yields the given chunks (strings) one by one. */
function sse(chunks: string[], init: { status?: number; delayMs?: number } = {}): Response {
  const encoder = new TextEncoder();
  let i = 0;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (init.delayMs) await new Promise((r) => setTimeout(r, init.delayMs));
      if (i >= chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(chunks[i++]));
    },
  });
  return new Response(body, { status: init.status ?? 200, headers: { 'content-type': 'text/event-stream; charset=utf-8' } });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

/** Split a string into chunks of `n` characters (boundaries fall mid-event, mid-JSON, mid-UTF-8 char after encoding). */
function chunked(text: string, n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += n) out.push(text.slice(i, i + n));
  return out;
}

const EVENTS: InferenceEvent[] = [
  { type: 'progress', step: { stage: 'Research', detail: 'Searching Nave’s Topical Bible for “divorce”', provider: 'kb:topics' } },
  { type: 'study', study: study(), complete: false },
  { type: 'progress', step: { stage: 'Compose', detail: 'Key passages accepted (4)', provider: 'inference:validator' } },
  { type: 'study', study: study('generated-divorce', { subtitle: 'What does the Bible say about divorce?' }), complete: true },
  {
    type: 'reply',
    reply: { id: 'r1', role: 'assistant', text: 'Opening.', createdAt: 1 },
    focus: { section: 'key-passages' },
    conversation: { activeConceptId: 'c1' },
  },
  { type: 'done' },
];

describe('inference client — status', () => {
  it('normalises a status body and tolerates missing fields', () => {
    expect(normalizeStatus({ available: false, reason: 'Inference layer not built yet' })).toEqual({
      available: false,
      model: '',
      reason: 'Inference layer not built yet',
      knowledgeBase: { documents: 0, corpora: [] },
    });
    expect(normalizeStatus({ available: true, model: 'claude-opus-5', knowledgeBase: { documents: 24512, corpora: [{ id: 'naves', label: 'Nave’s', documents: 5000 }, 'junk'] } })).toEqual({
      available: true,
      model: 'claude-opus-5',
      knowledgeBase: { documents: 24512, corpora: [{ id: 'naves', label: 'Nave’s', documents: 5000 }] },
    });
    expect(normalizeStatus('<html>')).toBeNull();
    expect(normalizeStatus({ ok: true })).toBeNull();
  });

  it('reads the status and caches it briefly', async () => {
    let t = 0;
    const fetch = vi.fn(async () => json({ available: true, model: 'claude-opus-5', knowledgeBase: { documents: 10, corpora: [] } }));
    const client = createInferenceClient({ fetch, now: () => t, statusTtlMs: 1000 });
    const a = await client.getStatus();
    const b = await client.getStatus();
    expect(a).toEqual(b);
    expect(a.available).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
    t = 2000;
    await client.getStatus();
    expect(fetch).toHaveBeenCalledTimes(2);
    await client.getStatus({ force: true });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(client.peekStatus()?.model).toBe('claude-opus-5');
  });

  it('dedupes concurrent status requests and notifies subscribers', async () => {
    const fetch = vi.fn(async () => json({ available: false, reason: 'Add ANTHROPIC_API_KEY to .env.local' }));
    const client = createInferenceClient({ fetch });
    const seen: string[] = [];
    const off = client.subscribe((s) => seen.push(s.reason ?? ''));
    const [a, b] = await Promise.all([client.getStatus(), client.getStatus()]);
    expect(a).toBe(b);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(seen).toEqual(['Add ANTHROPIC_API_KEY to .env.local']);
    off();
    client.invalidateStatus();
    await client.getStatus();
    expect(seen).toHaveLength(1);
  });

  it('treats an HTML page (no server mounted) or a 404 as unavailable', async () => {
    const html = createInferenceClient({ fetch: async () => new Response('<!doctype html><title>Emmaus</title>', { headers: { 'content-type': 'text/html' } }) });
    const s1 = await html.getStatus();
    expect(s1.available).toBe(false);
    expect(s1.reason).toMatch(/isn’t running/);

    const notFound = createInferenceClient({ fetch: async () => new Response('Not found', { status: 404 }) });
    expect((await notFound.getStatus()).available).toBe(false);

    const down = createInferenceClient({
      fetch: async () => {
        throw new TypeError('Failed to fetch');
      },
    });
    const s3 = await down.getStatus();
    expect(s3).toMatchObject({ available: false, reason: 'Could not reach the inference server.' });
  });

  it('uses the JSON body of a non-2xx status response (e.g. 503 with a reason)', async () => {
    const client = createInferenceClient({ fetch: async () => json({ available: false, reason: 'Inference layer not built yet' }, 503) });
    expect(await client.getStatus()).toMatchObject({ available: false, reason: 'Inference layer not built yet' });
  });

  it('gives up on a status request that hangs', async () => {
    const client = createInferenceClient({
      statusTimeoutMs: 20,
      fetch: (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
        }),
    });
    expect(await client.getStatus()).toMatchObject({ available: false, reason: 'The inference server did not answer in time.' });
  });
});

describe('inference client — compose stream', () => {
  it('decodes events split at arbitrary chunk boundaries and resolves with the final state', async () => {
    const text = EVENTS.map(encodeEvent).join('');
    for (const n of [1, 3, 7, 64, text.length]) {
      const seen: InferenceEvent['type'][] = [];
      const client = createInferenceClient({ fetch: async () => sse(chunked(text, n)) });
      const out = await client.compose({ query: 'divorce', translation: 'BSB' }, { onEvent: (e) => seen.push(e.type) });
      expect(seen).toEqual(['progress', 'study', 'progress', 'study', 'reply', 'done']);
      expect(out.error).toBeUndefined();
      expect(out.complete).toBe(true);
      expect(out.study?.subtitle).toBe('What does the Bible say about divorce?');
      expect(out.reply?.text).toBe('Opening.');
      expect(out.focus).toEqual({ section: 'key-passages' });
      expect(out.conversation).toEqual({ activeConceptId: 'c1' });
      expect(out.steps.map((s) => s.stage)).toEqual(['Research', 'Compose']);
    }
  });

  it('posts the request as JSON to the compose endpoint', async () => {
    const fetch = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => sse([EVENTS.map(encodeEvent).join('')]));
    const client = createInferenceClient({ fetch });
    await client.compose({ query: 'divorce', translation: 'KJV', hint: { topic: 'divorce' }, regenerate: true });
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('/api/inference/compose');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual({ query: 'divorce', translation: 'KJV', hint: { topic: 'divorce' }, regenerate: true });
  });

  it('tolerates CRLF line endings, heartbeats and a final event without a blank line', async () => {
    const body = `: heartbeat\r\n\r\n${encodeEvent(EVENTS[0]).replace(/\n/g, '\r\n')}${encodeEvent(EVENTS[3])}event: done\ndata: {"type":"done"}`;
    const client = createInferenceClient({ fetch: async () => sse(chunked(body, 5)) });
    const out = await client.compose({ query: 'divorce', translation: 'BSB' });
    expect(out.steps).toHaveLength(1);
    expect(out.complete).toBe(true);
    expect(out.error).toBeUndefined();
  });

  it('reports error events (and keeps what arrived before them)', async () => {
    const body = [EVENTS[0], EVENTS[1], { type: 'error', code: 'invalid-output', message: 'No section passed validation.' } as InferenceEvent, { type: 'done' } as InferenceEvent]
      .map(encodeEvent)
      .join('');
    const client = createInferenceClient({ fetch: async () => sse(chunked(body, 11)) });
    const out = await client.compose({ query: 'divorce', translation: 'BSB' });
    expect(out.error).toEqual({ code: 'invalid-output', message: 'No section passed validation.' });
    expect(out.study?.id).toBe('generated-divorce');
    expect(out.complete).toBe(false);
  });

  it('maps HTTP errors with a JSON body to error codes', async () => {
    const noKey = createInferenceClient({ fetch: async () => json({ error: 'no-credentials', message: 'Add ANTHROPIC_API_KEY to .env.local' }, 503) });
    expect((await noKey.compose({ query: 'x', translation: 'BSB' })).error).toEqual({ code: 'no-credentials', message: 'Add ANTHROPIC_API_KEY to .env.local' });
    const limited = createInferenceClient({ fetch: async () => new Response('slow down', { status: 429 }) });
    expect((await limited.compose({ query: 'x', translation: 'BSB' })).error?.code).toBe('rate-limited');
    expect(httpError(500, { available: false, reason: 'Inference layer not built yet' })).toEqual({ code: 'internal', message: 'Inference layer not built yet' });
  });

  it('reports an HTML page instead of the API as "server not running"', async () => {
    const client = createInferenceClient({ fetch: async () => new Response('<!doctype html>', { headers: { 'content-type': 'text/html' } }) });
    const out = await client.answer({ question: 'q', study: study(), history: [], conversation: {}, translation: 'BSB' });
    expect(out.error?.code).toBe('internal');
    expect(out.error?.message).toMatch(/isn’t running/);
  });

  it('reports a network failure without rejecting', async () => {
    const client = createInferenceClient({
      fetch: async () => {
        throw new TypeError('Failed to fetch');
      },
    });
    expect((await client.compose({ query: 'x', translation: 'BSB' })).error).toEqual({ code: 'internal', message: 'Could not reach the inference server.' });
  });

  it('reports a stream that ends without a page or reply', async () => {
    const client = createInferenceClient({ fetch: async () => sse([encodeEvent(EVENTS[0])]) });
    const out = await client.compose({ query: 'x', translation: 'BSB' });
    expect(out.error?.code).toBe('internal');
    expect(out.steps).toHaveLength(1);
  });

  it('stops reading at "done" even if the connection stays open', async () => {
    const text = EVENTS.map(encodeEvent).join('');
    let pulls = 0;
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls++;
        if (pulls === 1) controller.enqueue(encoder.encode(text));
        // afterwards: never resolves more data (a kept-alive connection)
        return new Promise(() => {});
      },
    });
    const client = createInferenceClient({ fetch: async () => new Response(body, { headers: { 'content-type': 'text/event-stream' } }) });
    const out = await client.compose({ query: 'x', translation: 'BSB' });
    expect(out.complete).toBe(true);
  });

  it('resolves with an "aborted" error and the partial page when the signal aborts mid-stream', async () => {
    const controller = new AbortController();
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(encoder.encode(encodeEvent(EVENTS[0]) + encodeEvent(EVENTS[1])));
        controller.signal.addEventListener('abort', () => c.error(Object.assign(new Error('The operation was aborted.'), { name: 'AbortError' })));
      },
    });
    const client = createInferenceClient({ fetch: async () => new Response(body, { headers: { 'content-type': 'text/event-stream' } }) });
    const seen: string[] = [];
    const pending = client.compose(
      { query: 'divorce', translation: 'BSB' },
      {
        signal: controller.signal,
        onEvent: (e) => {
          seen.push(e.type);
          if (e.type === 'study') controller.abort();
        },
      },
    );
    const out = await pending;
    expect(seen).toEqual(['progress', 'study']);
    expect(out.error?.code).toBe('aborted');
    expect(out.study?.id).toBe('generated-divorce');
  });

  it('does not even call fetch when the signal is already aborted', async () => {
    const fetch = vi.fn();
    const controller = new AbortController();
    controller.abort();
    const client = createInferenceClient({ fetch });
    const out = await client.compose({ query: 'x', translation: 'BSB' }, { signal: controller.signal });
    expect(out.error?.code).toBe('aborted');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('a throwing event handler does not break the stream', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const client = createInferenceClient({ fetch: async () => sse([EVENTS.map(encodeEvent).join('')]) });
    const out = await client.compose(
      { query: 'x', translation: 'BSB' },
      {
        onEvent: () => {
          throw new Error('boom');
        },
      },
    );
    expect(out.complete).toBe(true);
    spy.mockRestore();
  });
});

describe('static site mode (GitHub Pages)', () => {
  it('never calls the API and reports the static-site reason', async () => {
    const { createInferenceClient, STATIC_SITE_REASON } = await import('../client');
    const fetchSpy = vi.fn();
    const client = createInferenceClient({ fetch: fetchSpy as unknown as typeof fetch, staticSiteReason: STATIC_SITE_REASON });
    const status = await client.getStatus({ force: true });
    expect(status.available).toBe(false);
    expect(status.reason).toBe(STATIC_SITE_REASON);
    const outcome = await client.compose({ query: 'divorce', translation: 'BSB' });
    expect(outcome.error?.message).toBe(STATIC_SITE_REASON);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
