/**
 * Error codes of the inference layer (protocol `InferenceErrorCode`) and the mapping
 * from the SDK's typed errors. Codes are chosen from the typed error class, the HTTP
 * status and the error body's `type` only — never by string-matching messages. The
 * provider's own message (a JSON body with a request id) is never shown to the reader:
 * it is kept in `upstream` for the debug log, and the reader gets a plain sentence.
 */
import Anthropic, { type APIError } from '@anthropic-ai/sdk';
import type { InferenceErrorCode } from '../../src/inference/protocol';
import { NO_CREDENTIAL_REASON } from './config';

export class InferenceError extends Error {
  readonly code: InferenceErrorCode;
  /** the provider's own error text (debug log only) */
  readonly upstream?: string;
  /** retrying will not help: the account or the request itself was rejected (400/401/403) */
  readonly persistent: boolean;
  constructor(code: InferenceErrorCode, message: string, extra: { upstream?: string; persistent?: boolean } = {}) {
    super(message);
    this.name = 'InferenceError';
    this.code = code;
    if (extra.upstream) this.upstream = extra.upstream;
    this.persistent = extra.persistent ?? false;
  }
}

/** What the reader is told when the Claude API rejects the request itself (HTTP 400) — e.g. an account without credit. */
export const REJECTED_REQUEST_MESSAGE =
  'The Claude API rejected the request (400 invalid request), so live composition is unavailable right now. This is usually the API account behind this server (for example, no remaining credit) — the server log has the details. Curated and library pages still work.';

/** The account behind this server has no credit left (the error body's own message says so; wording only — the code does not depend on it). */
const NO_CREDIT_MESSAGE =
  'The Claude API account behind this server has no remaining credit, so live composition is unavailable until it is topped up. Curated and library pages still work.';

function errorBody(err: APIError): { type?: string; message?: string; requestId?: string } {
  const body = err.error as { error?: { type?: unknown; message?: unknown }; type?: unknown; message?: unknown; request_id?: unknown } | undefined;
  const type = body?.error?.type ?? body?.type;
  const message = body?.error?.message ?? body?.message;
  const requestId = body?.request_id ?? (err as { requestID?: unknown }).requestID;
  return {
    ...(typeof type === 'string' ? { type } : {}),
    ...(typeof message === 'string' ? { message } : {}),
    ...(typeof requestId === 'string' ? { requestId } : {}),
  };
}

function upstreamText(err: APIError): string {
  const b = errorBody(err);
  return [err.status ? `HTTP ${err.status}` : 'stream error', b.type, b.message ?? err.message, b.requestId ? `request_id ${b.requestId}` : ''].filter(Boolean).join(' · ');
}

export const ERROR_MESSAGES: Record<InferenceErrorCode, string> = {
  'no-credentials': `Live composition needs an Anthropic API key. ${NO_CREDENTIAL_REASON}.`,
  'no-credit': NO_CREDIT_MESSAGE,
  refusal: 'The model declined to compose this page, so nothing was generated.',
  'rate-limited': 'The Claude API rate limit was reached. Please wait a minute and try again.',
  overloaded: 'The Claude API is temporarily unavailable or overloaded. Please try again shortly.',
  'invalid-output': 'The model could not produce a page that passes the source-grounding checks.',
  aborted: 'Stopped.',
  internal: 'Something went wrong while composing the page.',
};

function errorType(err: APIError): string | undefined {
  if (typeof err.type === 'string') return err.type;
  const body = err.error as { error?: { type?: unknown }; type?: unknown } | undefined;
  const t = body?.error?.type ?? body?.type;
  return typeof t === 'string' ? t : undefined;
}

/** Map anything thrown during a run to an InferenceError (most specific class first). */
export function classifyError(err: unknown, signal?: AbortSignal): InferenceError {
  if (err instanceof InferenceError) return err;
  if (err instanceof Anthropic.APIUserAbortError || signal?.aborted) return new InferenceError('aborted', ERROR_MESSAGES.aborted);
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    return new InferenceError('no-credentials', `The Anthropic API rejected the credential (${err.status}). ${NO_CREDENTIAL_REASON}.`, { upstream: upstreamText(err), persistent: true });
  }
  if (err instanceof Anthropic.RateLimitError) return new InferenceError('rate-limited', ERROR_MESSAGES['rate-limited'], { upstream: upstreamText(err) });
  if (err instanceof Anthropic.InternalServerError) return new InferenceError('overloaded', ERROR_MESSAGES.overloaded, { upstream: upstreamText(err) });
  if (err instanceof Anthropic.APIConnectionError) {
    return new InferenceError('overloaded', 'Could not reach the Claude API. Check the network connection and try again.', { upstream: err.message });
  }
  if (err instanceof Anthropic.NotFoundError) {
    return new InferenceError('internal', 'The configured model is not available to this API key. Check EMMAUS_MODEL.', { upstream: upstreamText(err), persistent: true });
  }
  if (err instanceof Anthropic.APIError) {
    // Errors delivered inside an open stream carry no HTTP status; use the error body's type.
    const type = errorType(err);
    const upstream = upstreamText(err);
    if (type === 'overloaded_error' || type === 'api_error') return new InferenceError('overloaded', ERROR_MESSAGES.overloaded, { upstream });
    if (type === 'rate_limit_error') return new InferenceError('rate-limited', ERROR_MESSAGES['rate-limited'], { upstream });
    if (type === 'authentication_error' || type === 'permission_error') {
      return new InferenceError('no-credentials', `The Anthropic API rejected the credential. ${NO_CREDENTIAL_REASON}.`, { upstream, persistent: true });
    }
    if (err.status === 400 || type === 'invalid_request_error' || type === 'billing_error') {
      // the account (e.g. no credit) or the request itself: retrying will not help
      const noCredit = type === 'billing_error' || /credit balance|billing/i.test(errorBody(err).message ?? '');
      return noCredit
        ? new InferenceError('no-credit', NO_CREDIT_MESSAGE, { upstream, persistent: true })
        : new InferenceError('internal', REJECTED_REQUEST_MESSAGE, { upstream, persistent: true });
    }
    return new InferenceError('internal', `The Claude API returned an error${err.status ? ` (HTTP ${err.status})` : ''}; the server log has the details.`, { upstream });
  }
  const message = err instanceof Error ? err.message : String(err);
  return new InferenceError('internal', `${ERROR_MESSAGES.internal} (${message})`);
}
