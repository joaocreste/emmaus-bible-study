/**
 * Local inference API (mounted by server/vitePlugin.ts on the Vite dev server):
 *
 *   GET  /api/inference/status    → InferenceStatus (credential found? knowledge base loaded? KB stats)
 *   POST /api/inference/compose   ComposeRequest → text/event-stream of InferenceEvents
 *   POST /api/inference/answer    AnswerRequest  → text/event-stream of InferenceEvents
 *
 * The API key stays on the server (ctx.env merges process env with .env.local). The
 * knowledge base loads once per project root and is rebuilt when kb/corpus changes
 * (checked by file size/mtime between requests); composed pages are cached in
 * .kb-cache/pages and every run writes a debug log to .kb-cache/logs.
 *
 * Requests: POST bodies must be application/json, and cross-site requests (an Origin
 * that is not this server, or Sec-Fetch-Site: cross-site) are refused — a web page
 * elsewhere cannot start paid compositions. At most MAX_CONCURRENT_RUNS compositions
 * and answers run at once; an identical compose request waits for the one in flight
 * and is then served from the page cache.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join } from 'node:path';
import { z } from 'zod';
import type { Study, TranslationId } from '../src/domain/models';
import { BIBLE_VERSIONS } from '../src/domain/translations';
import { isLocale, matchLocale, type Locale } from '../src/i18n/locales';
import type { AnswerRequest, ComposeRequest, EvidenceDraft, InferenceStatus, InferenceUnavailableCode } from '../src/inference/protocol';
import { composeCacheKey, PageCache } from './inference/cache';
import { loadInferenceConfig, NO_CREDENTIAL_REASON, type InferenceConfig } from './inference/config';
import type { InferenceError } from './inference/errors';
import { createRunLogWriter } from './inference/logs';
import { createAnthropicModelClient, type ModelClient } from './inference/modelClient';
import { runAnswer, runCompose, type RunDeps } from './inference/run';
import { openSse } from './inference/sse';
import { shortHash } from './inference/text';
import { corpusFingerprint, evidenceFullText, getKnowledgeBase, resetKnowledgeBase } from './kb';
import type { KnowledgeBase } from './kb/types';
import type { InferenceServerEnv } from './vitePlugin';

type Handler = (req: IncomingMessage, res: ServerResponse, ctx: InferenceServerEnv) => Promise<void>;

export interface InferenceAppOptions {
  /** the knowledge base for a project root (default: server/kb getKnowledgeBase) */
  knowledgeBase?: (root: string) => KnowledgeBase | Promise<KnowledgeBase>;
  /** model client factory (default: the Anthropic SDK); tests inject a scripted fake */
  createModelClient?: (config: InferenceConfig) => ModelClient;
  now?: () => number;
  /** complete text behind excerpted evidence (default: server/kb evidenceFullText) */
  fullText?: (draft: EvidenceDraft) => string;
  /** SSE heartbeat interval (default 15 s) */
  heartbeatMs?: number;
  /** how long GET /status waits for a loading knowledge base before reporting "still loading" (default 3 s) */
  statusWaitMs?: number;
  /** compositions + answers running at once (default MAX_CONCURRENT_RUNS) */
  maxConcurrentRuns?: number;
  /** the kb/corpus fingerprint of a root (default: file names, sizes and mtimes); a change rebuilds the knowledge base */
  corpusFingerprint?: (root: string) => Promise<string>;
}

const COMPOSE_BODY_LIMIT = 64 * 1024;
const ANSWER_BODY_LIMIT = 8 * 1024 * 1024;
/** Paid model runs at once (compose + answer). */
export const MAX_CONCURRENT_RUNS = 2;
/** How often (at most) kb/corpus is checked for changes. */
const CORPUS_CHECK_MS = 1000;
/** After a run fails in a way retrying will not fix (the account or the request was rejected), /status reports composition unavailable this long — or until a later run succeeds. */
export const ACCOUNT_FAILURE_MS = 5 * 60 * 1000;

/* ------------------------------------------------------------------ */
/* Request schemas                                                     */
/* ------------------------------------------------------------------ */

/** Every bundled Bible version (src/domain/translations.ts) — the reader's version in any language. */
const Translation = z.enum(BIBLE_VERSIONS.map((v) => v.id) as [TranslationId, ...TranslationId[]]);
/** Page language: validated with isLocale; absent → the Accept-Language header → 'en'. */
const LocaleField = z
  .unknown()
  .optional()
  .transform((v) => (isLocale(v) ? v : undefined));
const PassageRefSchema = z.object({
  book: z.string().min(2).max(4),
  startChapter: z.number().int().positive(),
  startVerse: z.number().int().positive().optional(),
  endChapter: z.number().int().positive().optional(),
  endVerse: z.number().int().positive().optional(),
});

export const ComposeRequestSchema = z.object({
  query: z.string().trim().min(1).max(500),
  translation: Translation.default('BSB'),
  locale: LocaleField,
  hint: z.object({ passage: PassageRefSchema.optional(), topic: z.string().trim().max(200).optional() }).optional(),
  regenerate: z.boolean().optional(),
});

export const AnswerRequestSchema = z.object({
  question: z.string().trim().min(1).max(2000),
  study: z.looseObject({
    id: z.string().min(1).max(200),
    kind: z.enum(['passage', 'topic']),
    depth: z.enum(['curated', 'library', 'generated']),
    title: z.string(),
  }),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().max(20000) }))
    .max(100)
    .default([]),
  conversation: z.looseObject({}).default({}),
  translation: Translation.default('BSB'),
  locale: LocaleField,
});

/** The /status code for a persistent run failure (the client localises it; `reason` stays the English fallback). */
function unavailableCode(error: InferenceError): InferenceUnavailableCode {
  return error.code === 'no-credentials' ? 'no-credentials' : error.code === 'no-credit' ? 'no-credit' : 'rejected';
}

/** The request's language: the body's `locale` when valid, else the browser's Accept-Language, else English. */
export function requestLocale(bodyLocale: Locale | undefined, acceptLanguage: string | string[] | undefined): Locale {
  if (bodyLocale) return bodyLocale;
  const header = Array.isArray(acceptLanguage) ? acceptLanguage.join(',') : (acceptLanguage ?? '');
  const prefs = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map((p) => /^\s*q=([\d.]+)/.exec(p)?.[1]).find(Boolean);
      return { tag: (tag ?? '').trim(), q: q ? Number(q) : 1 };
    })
    .filter((p) => p.tag && p.tag !== '*' && p.q > 0)
    .sort((a, b) => b.q - a.q)
    .map((p) => p.tag);
  return matchLocale(prefs);
}

const STUDY_ARRAYS = ['keyWords', 'crossReferences', 'context', 'theology', 'perspectives', 'commentary', 'sermons', 'verseNotes', 'concepts', 'suggestedQuestions', 'sourceIds'] as const;

/** The client sends the open study back; fill any missing list so the server code can rely on the shape. */
function normalizeStudy(raw: Record<string, unknown>): Study {
  const s = { ...raw } as Record<string, unknown>;
  for (const k of STUDY_ARRAYS) if (!Array.isArray(s[k])) s[k] = [];
  return s as unknown as Study;
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */

interface KbState {
  promise: Promise<KnowledgeBase>;
  kb?: KnowledgeBase;
  error?: string;
  /** kb/corpus fingerprint the knowledge base was loaded from */
  fingerprint: string;
}

export function createInferenceHandler(options: InferenceAppOptions = {}): Handler {
  const kbStates = new Map<string, KbState>();
  const clients = new Map<string, ModelClient>();
  const now = options.now ?? Date.now;
  const fingerprintOf = options.corpusFingerprint ?? ((root: string) => corpusFingerprint(root));
  const lastCheck = new Map<string, { at: number; fingerprint: Promise<string> }>();
  const maxRuns = options.maxConcurrentRuns ?? MAX_CONCURRENT_RUNS;
  let running = 0;
  /** compose requests in flight, by page-cache key: an identical request waits, then opens the cached page */
  const inFlight = new Map<string, Promise<void>>();
  /** the last run that failed persistently (billing, a rejected credential or request): /status reports it for a while */
  let accountFailure: { at: number; message: string; code: InferenceUnavailableCode } | null = null;
  const onOutcome = (error: InferenceError | null) => {
    if (error?.persistent) accountFailure = { at: now(), message: error.message, code: unavailableCode(error) };
    // the model answered (a page, or output that did not pass the checks, or a refusal): the account works
    else if (!error || error.code === 'invalid-output' || error.code === 'refusal') accountFailure = null;
  };

  /** The current kb/corpus fingerprint (checked at most once per CORPUS_CHECK_MS). */
  function currentFingerprint(root: string): Promise<string> {
    const hit = lastCheck.get(root);
    if (hit && Date.now() - hit.at < CORPUS_CHECK_MS) return hit.fingerprint;
    const fingerprint = fingerprintOf(root).catch(() => 'unknown');
    lastCheck.set(root, { at: Date.now(), fingerprint });
    return fingerprint;
  }

  /**
   * The knowledge base for a root, loaded once and rebuilt when kb/corpus changed since
   * it was loaded (a corpus added or regenerated while the server runs); a failed load
   * is retried on the next request.
   */
  async function knowledgeBase(root: string): Promise<KbState> {
    const fingerprint = await currentFingerprint(root);
    const existing = kbStates.get(root);
    if (existing && !existing.error && existing.fingerprint === fingerprint) return existing;
    if (existing && !existing.error && existing.fingerprint !== fingerprint && !options.knowledgeBase) resetKnowledgeBase(root);
    const load = async (): Promise<KnowledgeBase> => {
      const kb = await (options.knowledgeBase ?? getKnowledgeBase)(root);
      await kb.ready();
      return kb;
    };
    const state: KbState = { promise: load(), fingerprint };
    state.promise.then(
      (kb) => {
        state.kb = kb;
      },
      (err: unknown) => {
        state.error = err instanceof Error ? err.message : String(err);
      },
    );
    kbStates.set(root, state);
    return state;
  }

  function modelClient(config: InferenceConfig): ModelClient | null {
    const { credential } = config;
    if (!credential.source) return null;
    const key = `${credential.source}|${shortHash(credential.apiKey ?? credential.authToken ?? 'profile', 12)}`;
    let client = clients.get(key);
    if (!client) {
      client = (options.createModelClient ?? createAnthropicModelClient)(config);
      clients.set(key, client);
    }
    return client;
  }

  async function status(res: ServerResponse, ctx: InferenceServerEnv): Promise<void> {
    const config = loadInferenceConfig(ctx.env, ctx.root);
    const state = await knowledgeBase(ctx.root);
    await Promise.race([state.promise.then(() => undefined, () => undefined), delay(options.statusWaitMs ?? 3000)]);
    let knowledge: InferenceStatus['knowledgeBase'] = { documents: 0, corpora: [] };
    if (state.kb) {
      try {
        knowledge = state.kb.stats();
      } catch {
        /* stats are informational */
      }
    }
    const recentFailure = accountFailure && now() - accountFailure.at < ACCOUNT_FAILURE_MS ? accountFailure : null;
    const [reason, reasonCode]: [string | undefined, InferenceUnavailableCode | undefined] = !config.credential.source
      ? [NO_CREDENTIAL_REASON, 'no-credentials']
      : state.error
        ? [`The knowledge base failed to load (${state.error}). Check the server log and restart npm run dev.`, 'kb-error']
        : !state.kb
          ? ['The knowledge base is still loading (building the search index) — try again in a moment.', 'loading']
          : recentFailure
            ? [recentFailure.message, recentFailure.code]
            : [undefined, undefined];
    const body: InferenceStatus = { available: !reason, model: config.model, ...(reason ? { reason, reasonCode } : {}), knowledgeBase: knowledge };
    sendJson(res, 200, body);
  }

  async function stream(kind: 'compose' | 'answer', req: IncomingMessage, res: ServerResponse, ctx: InferenceServerEnv): Promise<void> {
    const refused = crossSiteReason(req);
    if (refused) {
      sendJson(res, 403, { error: 'forbidden', code: 'internal', message: refused });
      return;
    }
    if (!/^application\/json\b/i.test(req.headers['content-type'] ?? '')) {
      sendJson(res, 415, { error: 'unsupported-media-type', code: 'internal', message: 'Send the request body as JSON (content-type: application/json).' });
      return;
    }
    let raw: unknown;
    try {
      raw = await readJson(req, kind === 'compose' ? COMPOSE_BODY_LIMIT : ANSWER_BODY_LIMIT);
    } catch (err) {
      const tooLarge = err instanceof BodyError && err.tooLarge;
      sendJson(res, tooLarge ? 413 : 400, { error: 'bad-request', code: 'internal', message: err instanceof Error ? err.message : 'Invalid request body.' });
      return;
    }
    const parsed = kind === 'compose' ? ComposeRequestSchema.safeParse(raw) : AnswerRequestSchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.issues.slice(0, 4).map((i) => `${i.path.join('.') || 'body'}: ${i.message}`).join('; ');
      sendJson(res, 400, { error: 'bad-request', code: 'internal', message: `Invalid ${kind} request (${issues}).` });
      return;
    }

    const config = loadInferenceConfig(ctx.env, ctx.root);
    if (running >= maxRuns) {
      sendJson(res, 429, {
        error: 'busy',
        code: 'rate-limited',
        message: `${running} requests are already being composed or answered on this server; please wait for one to finish and try again.`,
      });
      return;
    }
    running++;
    let releaseFlight: (() => void) | null = null;
    const sse = openSse(res, options.heartbeatMs ? { heartbeatMs: options.heartbeatMs } : {});
    // Client disconnect → abort the model stream. (`res` 'close' before the response
    // finished is the reliable signal: `req` 'close' also fires once the body is read.)
    const controller = new AbortController();
    const onClose = () => {
      if (!res.writableFinished) controller.abort(new Error('client disconnected'));
    };
    res.on('close', onClose);
    req.on('close', () => {
      if (req.destroyed && res.destroyed && !res.writableFinished) controller.abort(new Error('client disconnected'));
    });
    try {
      const state = await knowledgeBase(ctx.root);
      if (!state.kb) sse.send({ type: 'progress', step: { stage: 'Knowledge base', detail: 'Loading the knowledge base (first request after start-up or after the corpora changed)', provider: 'kb:load' } });
      let kb: KnowledgeBase;
      try {
        kb = await state.promise;
      } catch (err) {
        sse.send({ type: 'error', code: 'internal', message: `The knowledge base failed to load (${err instanceof Error ? err.message : String(err)}).` });
        sse.send({ type: 'done' });
        return;
      }
      const deps: RunDeps = {
        kb,
        client: modelClient(config),
        config,
        cache: new PageCache(join(config.cacheDir, 'pages')),
        writeLog: config.debugLogs ? createRunLogWriter(join(config.cacheDir, 'logs')) : null,
        now,
        fullText: options.fullText ?? evidenceFullText,
        onOutcome,
      };
      if (kind === 'compose') {
        const body = parsed.data as z.infer<typeof ComposeRequestSchema>;
        const request: ComposeRequest = {
          query: body.query,
          translation: body.translation,
          locale: requestLocale(body.locale, req.headers['accept-language']),
          ...(body.hint ? { hint: body.hint } : {}),
          ...(body.regenerate ? { regenerate: true } : {}),
        };
        // the same page already being composed: wait for it, then open it from the cache
        const flightKey = composeCacheKey(request, config.model).key;
        const pending = inFlight.get(flightKey);
        if (pending && !request.regenerate) {
          sse.send({ type: 'progress', step: { stage: 'Cache', detail: 'The same page is being composed for another request — waiting for it', provider: 'inference:cache' } });
          await Promise.race([pending, new Promise<void>((resolve) => controller.signal.addEventListener('abort', () => resolve(), { once: true }))]);
        }
        if (!inFlight.has(flightKey)) {
          const flight = new Promise<void>((resolve) => (releaseFlight = resolve));
          inFlight.set(flightKey, flight);
          const release = releaseFlight!;
          releaseFlight = () => {
            if (inFlight.get(flightKey) === flight) inFlight.delete(flightKey);
            release();
          };
        }
        await runCompose(request, deps, (e) => sse.send(e), controller.signal);
      } else {
        const body = parsed.data as z.infer<typeof AnswerRequestSchema>;
        const request: AnswerRequest = {
          question: body.question,
          study: normalizeStudy(body.study),
          history: body.history,
          conversation: body.conversation as AnswerRequest['conversation'],
          translation: body.translation,
          locale: requestLocale(body.locale, req.headers['accept-language']),
        };
        await runAnswer(request, deps, (e) => sse.send(e), controller.signal);
      }
    } catch (err) {
      sse.send({ type: 'error', code: 'internal', message: `The inference server failed (${err instanceof Error ? err.message : String(err)}).` });
      sse.send({ type: 'done' });
    } finally {
      running--;
      (releaseFlight as (() => void) | null)?.();
      res.off('close', onClose);
      sse.close();
    }
  }

  return async (req, res, ctx) => {
    const path = new URL(req.url ?? '/', 'http://localhost').pathname.replace(/\/+$/, '');
    const route = path.startsWith('/api/inference/') ? path.slice('/api/inference/'.length) : '';
    switch (route) {
      case 'status':
        if (req.method !== 'GET' && req.method !== 'HEAD') return methodNotAllowed(res, 'GET');
        return status(res, ctx);
      case 'compose':
      case 'answer':
        if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
        return stream(route, req, res, ctx);
      default:
        sendJson(res, 404, { error: 'not-found', code: 'internal', message: `No inference endpoint at ${path}.` });
    }
  };
}

/** The handler server/vitePlugin.ts mounts. */
export const handleInferenceRequest: Handler = createInferenceHandler();

/* ------------------------------------------------------------------ */
/* HTTP helpers                                                        */
/* ------------------------------------------------------------------ */

/**
 * Why a request is refused as cross-site, or null: the browser marks it
 * Sec-Fetch-Site: cross-site, or its Origin is not this server (the Host it was sent to).
 * Requests without an Origin (curl, server-side tests) are allowed — only browsers
 * send one, and a browser always does on a cross-origin POST.
 */
export function crossSiteReason(req: IncomingMessage): string | null {
  const site = String(req.headers['sec-fetch-site'] ?? '').toLowerCase();
  if (site === 'cross-site') return 'Cross-site requests to the inference API are not allowed.';
  const origin = req.headers.origin;
  if (!origin || origin === 'null') return origin === 'null' ? 'Requests from an opaque origin are not allowed.' : null;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return 'The request has an invalid Origin header.';
  }
  return host === req.headers.host ? null : `Requests from ${origin} are not allowed; use the app served by this server.`;
}

class BodyError extends Error {
  constructor(
    message: string,
    readonly tooLarge = false,
  ) {
    super(message);
  }
}

function readJson(req: IncomingMessage, limit: number): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let failed = false;
    req.on('data', (chunk: Buffer) => {
      if (failed) return;
      size += chunk.length;
      if (size > limit) {
        failed = true;
        reject(new BodyError(`Request body is larger than ${Math.round(limit / 1024)} KB.`, true));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (failed) return;
      const text = Buffer.concat(chunks).toString('utf8');
      if (!text.trim()) return reject(new BodyError('Request body is empty; send JSON.'));
      try {
        resolve(JSON.parse(text));
      } catch {
        reject(new BodyError('Request body is not valid JSON.'));
      }
    });
    req.on('error', (err) => {
      if (!failed) reject(err);
    });
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  if (res.headersSent) {
    res.end();
    return;
  }
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
}

function methodNotAllowed(res: ServerResponse, allow: string): void {
  res.setHeader('allow', allow);
  sendJson(res, 405, { error: 'method-not-allowed', code: 'internal', message: `Use ${allow}.` });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    t.unref?.();
  });
}
