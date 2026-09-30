/**
 * Browser client for the local inference API (docs/INFERENCE.md §5).
 *
 *   getStatus()          GET  /api/inference/status   → InferenceStatus (cached briefly)
 *   compose(req, opts)   POST /api/inference/compose  → text/event-stream of InferenceEvents
 *   answer(req, opts)    POST /api/inference/answer   → text/event-stream of InferenceEvents
 *
 * Streams are read incrementally (createEventDecoder) and every event is handed to
 * `onEvent` as it arrives; the promise resolves with what the stream produced in the
 * end. It never rejects: a network failure, an HTML page instead of the API, an HTTP
 * error or an abort all resolve with an `error` (plus whatever arrived before it), so
 * the engine can fall back honestly. Framework-free — no React.
 */
import type { ChatMessage, ConversationState, DashboardFocus, PipelineStep, Study } from '../domain/models';
import {
  INFERENCE_API,
  createEventDecoder,
  type AnswerRequest,
  type ComposeRequest,
  type InferenceErrorCode,
  type InferenceUnavailableCode,
  type InferenceEvent,
  type InferenceStatus,
} from './protocol';

export interface InferenceStreamOptions {
  signal?: AbortSignal;
  /** every decoded event, in order, as it arrives */
  onEvent?: (event: InferenceEvent) => void;
}

export interface InferenceError {
  code: InferenceErrorCode;
  message: string;
}

/** What a compose/answer stream produced. */
export interface InferenceOutcome {
  /** the latest study snapshot (final when `complete`) */
  study?: Study;
  /** the latest snapshot was the final one */
  complete: boolean;
  reply?: ChatMessage;
  focus?: DashboardFocus;
  conversation?: ConversationState;
  error?: InferenceError;
  /** progress steps, in order */
  steps: PipelineStep[];
}

export interface InferenceClient {
  /** current status; cached briefly (`force` bypasses the cache) — never rejects */
  getStatus(options?: { force?: boolean }): Promise<InferenceStatus>;
  /** the cached status, if any (no request) */
  peekStatus(): InferenceStatus | undefined;
  /** called whenever a fresh status is fetched; returns an unsubscribe function */
  subscribe(listener: (status: InferenceStatus) => void): () => void;
  /** forget the cached status (e.g. after a no-credentials error) */
  invalidateStatus(): void;
  compose(request: ComposeRequest, options?: InferenceStreamOptions): Promise<InferenceOutcome>;
  answer(request: AnswerRequest, options?: InferenceStreamOptions): Promise<InferenceOutcome>;
}

export interface InferenceClientOptions {
  /** fetch implementation (default: the global fetch, resolved at call time) */
  fetch?: typeof fetch;
  /** prefix for the API paths (default '') */
  baseUrl?: string;
  /** how long an available status is reused (default 20 s) */
  statusTtlMs?: number;
  /** how long an unavailable status is reused (default 6 s) */
  unavailableTtlMs?: number;
  /** give up on the status request after this long (default 5 s) */
  statusTimeoutMs?: number;
  now?: () => number;
  /**
   * Static deployment (e.g. GitHub Pages): there is no inference server, so never call
   * the API — report this reason as the (permanent) unavailable status instead.
   */
  staticSiteReason?: string;
}

const ERROR_CODES: readonly InferenceErrorCode[] = ['no-credentials', 'no-credit', 'refusal', 'rate-limited', 'overloaded', 'invalid-output', 'aborted', 'internal'];
const UNAVAILABLE_CODES: readonly InferenceUnavailableCode[] = ['no-credentials', 'no-credit', 'loading', 'kb-error', 'rejected'];

export const STATIC_SITE_REASON =
  'Live composition runs when you install Emmaus locally with your own Anthropic API key. This public edition shows the curated and library studies.';
export const SERVER_NOT_RUNNING = 'The inference server isn’t running here — start the app with “npm run dev”.';
export const SERVER_UNREACHABLE = 'Could not reach the inference server.';
export const STATUS_TIMEOUT = 'The inference server did not answer in time.';
export const STREAM_INTERRUPTED = 'The connection to the inference server was interrupted.';
export const STREAM_EMPTY = 'The inference stream ended without a page or a reply.';
export const STOPPED_EARLY = 'Stopped before the page was finished.';
export const EVENT_ERROR = 'The inference layer reported an error.';

/**
 * The client's own status / error messages are written in English (they are also logged and
 * shown in developer tooling). `clientMessageId` names them so a UI or the engine can show them
 * in the reader's language; server-provided reasons return undefined and are shown as sent.
 */
export type ClientMessageId = 'static-site' | 'not-running' | 'unreachable' | 'timeout' | 'interrupted' | 'empty-stream' | 'stopped' | 'no-event-message';

const CLIENT_MESSAGES: Record<string, ClientMessageId> = {
  [STATIC_SITE_REASON]: 'static-site',
  [SERVER_NOT_RUNNING]: 'not-running',
  [SERVER_UNREACHABLE]: 'unreachable',
  [STATUS_TIMEOUT]: 'timeout',
  [STREAM_INTERRUPTED]: 'interrupted',
  [STREAM_EMPTY]: 'empty-stream',
  [STOPPED_EARLY]: 'stopped',
  [EVENT_ERROR]: 'no-event-message',
};

export function clientMessageId(message: string | undefined): ClientMessageId | undefined {
  return message ? CLIENT_MESSAGES[message.trim()] : undefined;
}

/** The status reported when the API cannot be reached or does not answer as expected. */
export function unavailableStatus(reason: string): InferenceStatus {
  return { available: false, model: '', reason, knowledgeBase: { documents: 0, corpora: [] } };
}

/** Coerce a parsed JSON body into an InferenceStatus (tolerating missing fields), or null if it is not one. */
export function normalizeStatus(raw: unknown): InferenceStatus | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.available !== 'boolean') return null;
  const kb = (r.knowledgeBase && typeof r.knowledgeBase === 'object' ? r.knowledgeBase : {}) as Record<string, unknown>;
  const corpora = Array.isArray(kb.corpora)
    ? kb.corpora.flatMap((c) => {
        if (!c || typeof c !== 'object') return [];
        const o = c as Record<string, unknown>;
        return typeof o.id === 'string' ? [{ id: o.id, label: typeof o.label === 'string' ? o.label : o.id, documents: count(o.documents) }] : [];
      })
    : [];
  const reason = typeof r.reason === 'string' && r.reason.trim() ? r.reason.trim() : typeof r.message === 'string' && r.message.trim() ? r.message.trim() : undefined;
  return {
    available: r.available,
    model: typeof r.model === 'string' ? r.model : '',
    ...(reason ? { reason } : {}),
    ...(typeof r.reasonCode === 'string' && (UNAVAILABLE_CODES as readonly string[]).includes(r.reasonCode) ? { reasonCode: r.reasonCode as InferenceUnavailableCode } : {}),
    knowledgeBase: { documents: count(kb.documents), corpora },
  };
}

function count(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
}

function isErrorCode(v: unknown): v is InferenceErrorCode {
  return typeof v === 'string' && (ERROR_CODES as readonly string[]).includes(v);
}

/** Map a non-stream HTTP response (status + parsed body, if JSON) to an error. */
export function httpError(status: number, body: unknown): InferenceError {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const code: InferenceErrorCode = isErrorCode(b.code)
    ? b.code
    : isErrorCode(b.error)
      ? b.error
      : status === 429
        ? 'rate-limited'
        : status === 529
          ? 'overloaded'
          : 'internal';
  const text = [b.message, b.reason, typeof b.error === 'string' && !isErrorCode(b.error) ? b.error : undefined].find(
    (m): m is string => typeof m === 'string' && m.trim().length > 0,
  );
  return { code, message: text?.trim() ?? `The inference server answered with HTTP ${status}.` };
}

/** `Accept-Language` for a request that names the reader's language (ComposeRequest/AnswerRequest `locale`). */
function languageHeader(payload: unknown): Record<string, string> {
  const locale = payload && typeof payload === 'object' ? (payload as { locale?: unknown }).locale : undefined;
  const tags: Record<string, string> = { en: 'en', pt: 'pt-BR', fr: 'fr', es: 'es' };
  return typeof locale === 'string' && tags[locale] ? { 'accept-language': tags[locale] } : {};
}

function isAbort(error: unknown, signal?: AbortSignal): boolean {
  return !!signal?.aborted || (error instanceof Error && error.name === 'AbortError') || (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError');
}

export function createInferenceClient(options: InferenceClientOptions = {}): InferenceClient {
  const base = options.baseUrl ?? '';
  const now = options.now ?? (() => Date.now());
  const ttl = options.statusTtlMs ?? 20_000;
  const unavailableTtl = options.unavailableTtlMs ?? 6_000;
  const timeoutMs = options.statusTimeoutMs ?? 5_000;
  const doFetch: typeof fetch = (input, init) => {
    const f = options.fetch ?? (typeof fetch === 'function' ? fetch : undefined);
    if (!f) return Promise.reject(new TypeError('fetch is not available'));
    return f(input, init);
  };

  let cached: { status: InferenceStatus; at: number } | undefined;
  let inFlight: Promise<InferenceStatus> | undefined;
  const listeners = new Set<(s: InferenceStatus) => void>();

  const fresh = () => {
    if (!cached) return undefined;
    const age = now() - cached.at;
    return age < (cached.status.available ? ttl : unavailableTtl) ? cached.status : undefined;
  };

  async function fetchStatus(): Promise<InferenceStatus> {
    if (options.staticSiteReason) return unavailableStatus(options.staticSiteReason);
    const controller = typeof AbortController === 'function' ? new AbortController() : undefined;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
      const res = await doFetch(`${base}${INFERENCE_API.status}`, {
        method: 'GET',
        headers: { accept: 'application/json' },
        cache: 'no-store',
        ...(controller ? { signal: controller.signal } : {}),
      });
      const type = res.headers.get('content-type') ?? '';
      if (!/json/i.test(type)) return unavailableStatus(SERVER_NOT_RUNNING);
      const body = normalizeStatus(await res.json().catch(() => null));
      if (body) return body;
      return unavailableStatus(res.ok ? SERVER_NOT_RUNNING : httpError(res.status, null).message);
    } catch (error) {
      return unavailableStatus(controller?.signal.aborted ? STATUS_TIMEOUT : error instanceof Error && error.name === 'AbortError' ? STATUS_TIMEOUT : SERVER_UNREACHABLE);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async function stream(path: string, payload: unknown, opts: InferenceStreamOptions = {}): Promise<InferenceOutcome> {
    const { signal, onEvent } = opts;
    const outcome: InferenceOutcome = { complete: false, steps: [] };
    if (options.staticSiteReason) return { ...outcome, error: { code: 'internal', message: options.staticSiteReason } };
    let done = false;
    const apply = (event: InferenceEvent) => {
      switch (event.type) {
        case 'progress':
          if (event.step) outcome.steps.push(event.step);
          break;
        case 'study':
          if (event.study) {
            outcome.study = event.study;
            outcome.complete = event.complete === true;
          }
          break;
        case 'reply':
          if (event.reply) {
            outcome.reply = event.reply;
            if (event.focus) outcome.focus = event.focus;
            if (event.conversation) outcome.conversation = event.conversation;
          }
          break;
        case 'error':
          outcome.error = { code: isErrorCode(event.code) ? event.code : 'internal', message: event.message || EVENT_ERROR };
          break;
        case 'done':
          done = true;
          break;
      }
      if (onEvent) {
        try {
          onEvent(event);
        } catch (error) {
          console.error('[Emmaus] inference event handler failed:', error);
        }
      }
    };
    const aborted = (): InferenceOutcome => ({ ...outcome, error: { code: 'aborted', message: STOPPED_EARLY } });

    if (signal?.aborted) return aborted();
    let res: Response;
    try {
      res = await doFetch(`${base}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'text/event-stream', ...languageHeader(payload) },
        body: JSON.stringify(payload),
        cache: 'no-store',
        ...(signal ? { signal } : {}),
      });
    } catch (error) {
      if (isAbort(error, signal)) return aborted();
      return { ...outcome, error: { code: 'internal', message: SERVER_UNREACHABLE } };
    }

    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !/event-stream/i.test(type)) {
      let body: unknown = null;
      if (/json/i.test(type)) body = await res.json().catch(() => null);
      else await res.text().catch(() => '');
      if (res.ok) return { ...outcome, error: { code: 'internal', message: SERVER_NOT_RUNNING } };
      return { ...outcome, error: httpError(res.status, body) };
    }

    const decode = createEventDecoder();
    try {
      if (res.body && typeof res.body.getReader === 'function') {
        const reader = res.body.getReader();
        const text = new TextDecoder();
        try {
          while (!done) {
            const { value, done: ended } = await reader.read();
            if (ended) {
              for (const e of decode(text.decode() + '\n\n')) apply(e);
              break;
            }
            for (const e of decode(text.decode(value, { stream: true }))) {
              apply(e);
              if (done) break;
            }
          }
        } finally {
          if (done) reader.cancel().catch(() => {});
          reader.releaseLock?.();
        }
      } else {
        for (const e of decode(`${await res.text()}\n\n`)) apply(e);
      }
    } catch (error) {
      if (isAbort(error, signal)) return aborted();
      if (!outcome.error) outcome.error = { code: 'internal', message: STREAM_INTERRUPTED };
      return outcome;
    }
    if (signal?.aborted && !done) return aborted();
    if (!outcome.error && !outcome.study && !outcome.reply) {
      outcome.error = { code: 'internal', message: STREAM_EMPTY };
    }
    return outcome;
  }

  return {
    getStatus(opts = {}) {
      if (!opts.force) {
        const hit = fresh();
        if (hit) return Promise.resolve(hit);
        if (inFlight) return inFlight;
      }
      const request = fetchStatus().then((status) => {
        cached = { status, at: now() };
        if (inFlight === request) inFlight = undefined;
        for (const l of listeners) {
          try {
            l(status);
          } catch {
            /* a listener must not break the others */
          }
        }
        return status;
      });
      inFlight = request;
      return request;
    },
    peekStatus: () => cached?.status,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    invalidateStatus() {
      cached = undefined;
      inFlight = undefined;
    },
    compose: (request, opts) => stream(INFERENCE_API.compose, request, opts),
    answer: (request, opts) => stream(INFERENCE_API.answer, request, opts),
  };
}

/** The app-wide client (engine + status displays share its cached status). */
export const inferenceClient: InferenceClient = createInferenceClient(
  isStaticSite() ? { staticSiteReason: STATIC_SITE_REASON } : {},
);

/** Built for a static host (VITE_STATIC_SITE=1, set by the GitHub Pages workflow). */
function isStaticSite(): boolean {
  try {
    return (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_STATIC_SITE === '1';
  } catch {
    return false;
  }
}
