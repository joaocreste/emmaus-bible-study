/**
 * The streaming manual tool loop (claude-api skill → tool-use "Streaming Manual Loop"):
 * stream each turn, take finalMessage(), stop on refusal and on max_tokens with a
 * tool_use (never run truncated input), resume pause_turn, validate every tool input
 * (the handlers do, with zod), return all tool results in one user message, and inject
 * the "compose now" instruction as a mid-conversation system message once the research
 * budget is spent.
 *
 * Transient API failures (overloaded / api_error events inside an open stream, which
 * the SDK does not retry, and dropped connections) re-issue the same turn — the
 * conversation is unchanged, so this is safe — up to RETRY_DELAYS_MS.length times.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { InferenceConfig } from './config';
import { InferenceError } from './errors';
import type {
  BetaContentBlock,
  BetaContentBlockParam,
  BetaMessage,
  BetaMessageParam,
  BetaTextBlockParam,
  BetaTool,
  BetaToolResultBlockParam,
  BetaToolUseBlock,
  ModelClient,
  StreamParams,
} from './modelClient';

export interface ToolExecution {
  content: string;
  isError: boolean;
}

export interface TurnRecord {
  turn: number;
  stopReason: string | null;
  model: string;
  durationMs: number;
  usage: {
    input: number;
    output: number;
    cacheRead: number;
    cacheCreation: number;
  };
  toolUses: { id: string; name: string; input: unknown }[];
  text: string;
  /** a fallback model served this turn (usage.iterations has a fallback_message entry, or content a fallback block) */
  fallback: boolean;
  /** transient failures re-issued before this turn succeeded */
  retries: number;
}

export interface LoopHooks {
  /** run one turn's tool calls; results in the same order as `blocks` */
  executeTools(blocks: BetaToolUseBlock[]): Promise<ToolExecution[]>;
  /** the task is complete (finish_page / reply accepted): stop without another model turn */
  isDone(): boolean;
  /** a newly due budget instruction ("compose now"), or null */
  budgetMessage(): string | null;
  /** what to tell the model when it ends its turn before finishing (null → stop) */
  nudge(attempt: number): string | null;
  onTurn(record: TurnRecord): void;
}

export interface LoopOptions {
  client: ModelClient;
  config: InferenceConfig;
  system: BetaTextBlockParam[];
  tools: BetaTool[];
  messages: BetaMessageParam[];
  /** aborted on client disconnect or when the request deadline passes */
  signal: AbortSignal;
  /** true when `signal` fired because of the deadline (→ finish with what exists) */
  deadlineReached: () => boolean;
  /** waits before re-issuing a turn after a transient API failure (default RETRY_DELAYS_MS) */
  retryDelaysMs?: readonly number[];
}

/** Backoff before each re-issue of a turn that failed transiently. */
export const RETRY_DELAYS_MS: readonly number[] = [1500, 4000];

export type LoopEnd = 'done' | 'end_turn' | 'max_tokens' | 'max_turns' | 'deadline';

export const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

/** Request parameters for one turn (stable prefix: tools → system; automatic caching for the growing tail). */
export function buildParams(config: InferenceConfig, system: BetaTextBlockParam[], tools: BetaTool[], messages: BetaMessageParam[]): StreamParams {
  return {
    model: config.model,
    max_tokens: config.maxTokens,
    thinking: { type: 'adaptive' },
    output_config: { effort: config.effort },
    system,
    tools,
    messages: [...messages],
    cache_control: { type: 'ephemeral' },
    ...(config.fallbacks ? { betas: [FALLBACK_BETA], fallbacks: 'default' as const } : {}),
  };
}

const DROP_BEFORE_FALLBACK = new Set(['thinking', 'redacted_thinking', 'tool_use', 'server_tool_use']);

/**
 * Assistant content to echo back. After a mid-output server-side fallback, blocks of the
 * declined attempt before the last `fallback` boundary (thinking, tool calls) are omitted;
 * text blocks and everything after the boundary echo normally. Empty text blocks are dropped.
 */
export function sanitizeAssistantContent(content: readonly BetaContentBlock[]): BetaContentBlockParam[] {
  let last = -1;
  content.forEach((b, i) => {
    if (b.type === 'fallback') last = i;
  });
  return content
    .filter((b, i) => !(i < last && DROP_BEFORE_FALLBACK.has(b.type)))
    .filter((b) => !(b.type === 'text' && !b.text.trim())) as unknown as BetaContentBlockParam[];
}

function hasSystemMessages(messages: readonly BetaMessageParam[]): boolean {
  return messages.some((m) => m.role === 'system');
}

/** A failure worth re-issuing the same turn for: overloaded / server errors (also inside an open stream) and dropped connections. */
export function isTransientError(err: unknown): boolean {
  if (err instanceof Anthropic.APIUserAbortError) return false;
  if (err instanceof Anthropic.APIConnectionError) return true; // includes APIConnectionTimeoutError
  if (err instanceof Anthropic.InternalServerError) return true;
  if (err instanceof Anthropic.APIError && err.status == null) {
    const type = errorType(err);
    return type === 'overloaded_error' || type === 'api_error';
  }
  return false;
}

function errorType(err: InstanceType<typeof Anthropic.APIError>): string | undefined {
  if (typeof err.type === 'string') return err.type;
  const body = err.error as { error?: { type?: unknown }; type?: unknown } | undefined;
  const t = body?.error?.type ?? body?.type;
  return typeof t === 'string' ? t : undefined;
}

/** Was this 400 the model rejecting mid-conversation system messages (role "system" unsupported)? Read from the typed error body. */
function rejectsSystemRole(err: InstanceType<typeof Anthropic.BadRequestError>): boolean {
  const body = err.error as { error?: { message?: unknown }; message?: unknown } | undefined;
  const message = body?.error?.message ?? body?.message;
  return typeof message === 'string' && /\bsystem\b/i.test(message) && /\brole\b/i.test(message);
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (ms <= 0 || signal.aborted) return resolve();
    const t = setTimeout(done, ms);
    function done() {
      clearTimeout(t);
      signal.removeEventListener('abort', done);
      resolve();
    }
    signal.addEventListener('abort', done, { once: true });
  });
}

/** Token usage of a turn: the sum over usage.iterations (every attempt, including declined and fallback hops) when present, else the top-level usage. */
export function turnUsage(message: BetaMessage): TurnRecord['usage'] {
  const iterations = message.usage.iterations ?? [];
  if (iterations.length) {
    const u = { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 };
    for (const it of iterations) {
      u.input += it.input_tokens ?? 0;
      u.output += it.output_tokens ?? 0;
      u.cacheRead += it.cache_read_input_tokens ?? 0;
      u.cacheCreation += it.cache_creation_input_tokens ?? 0;
    }
    return u;
  }
  return {
    input: message.usage.input_tokens,
    output: message.usage.output_tokens,
    cacheRead: message.usage.cache_read_input_tokens ?? 0,
    cacheCreation: message.usage.cache_creation_input_tokens ?? 0,
  };
}

/** Served by a fallback model? The served-by signal is a fallback_message iteration (sticky-routed turns carry no fallback block). */
export function servedByFallback(message: BetaMessage): boolean {
  return (message.usage.iterations ?? []).some((i) => i.type === 'fallback_message') || message.content.some((b) => b.type === 'fallback');
}

/**
 * Append a user turn. A pending mid-conversation system message must be last or be
 * followed by an assistant turn, so one left at the end (the model answered with no
 * content) is folded into the new user turn as a reminder instead.
 */
function pushUser(messages: BetaMessageParam[], content: string | BetaContentBlockParam[]): void {
  const last = messages[messages.length - 1];
  if (last?.role !== 'system') {
    messages.push({ role: 'user', content });
    return;
  }
  messages.pop();
  const note = typeof last.content === 'string' ? last.content : last.content.map((b) => ('text' in b && typeof b.text === 'string' ? b.text : '')).join('\n');
  const blocks: BetaContentBlockParam[] = typeof content === 'string' ? [{ type: 'text', text: content }] : [...content];
  const prev = messages[messages.length - 1];
  if (prev?.role === 'user') {
    // the system note followed a user turn: keep it with that turn, then the new user content
    const before: BetaContentBlockParam[] = typeof prev.content === 'string' ? [{ type: 'text', text: prev.content }] : [...prev.content];
    messages[messages.length - 1] = { role: 'user', content: [...before, { type: 'text', text: `<system-reminder>${note}</system-reminder>` }, ...blocks] };
    return;
  }
  messages.push({ role: 'user', content: [{ type: 'text', text: `<system-reminder>${note}</system-reminder>` }, ...blocks] });
}

/** Fallback for models without mid-conversation system messages: fold them into the preceding user turn. */
export function foldSystemMessages(messages: readonly BetaMessageParam[]): BetaMessageParam[] {
  const out: BetaMessageParam[] = [];
  for (const m of messages) {
    if (m.role !== 'system') {
      out.push(m);
      continue;
    }
    const prev = out[out.length - 1];
    const text = typeof m.content === 'string' ? m.content : m.content.map((b) => ('text' in b && typeof b.text === 'string' ? b.text : '')).join('\n');
    const block: BetaTextBlockParam = { type: 'text', text: `<system-reminder>${text}</system-reminder>` };
    if (prev && prev.role === 'user') {
      const content: BetaContentBlockParam[] = typeof prev.content === 'string' ? [{ type: 'text', text: prev.content }] : [...prev.content];
      out[out.length - 1] = { role: 'user', content: [...content, block] };
    } else out.push({ role: 'user', content: [block] });
  }
  return out;
}

export async function runToolLoop(opts: LoopOptions, hooks: LoopHooks): Promise<{ end: LoopEnd; turns: number }> {
  const { client, config, system, tools, signal, messages } = opts;
  const retryDelays = opts.retryDelaysMs ?? RETRY_DELAYS_MS;
  let systemMessages = true;
  let foldRetried = false;
  let jsonRetries = 0;
  let transientRetries = 0;
  let nudges = 0;
  let turn = 0;

  const aborted = (): { end: LoopEnd; turns: number } => {
    if (opts.deadlineReached()) return { end: 'deadline', turns: turn };
    throw new InferenceError('aborted', 'Stopped.');
  };

  while (turn < config.maxTurns) {
    if (signal.aborted) return aborted();
    turn++;
    const started = Date.now();
    let message: BetaMessage;
    try {
      message = await client.stream(buildParams(config, system, tools, messages), { signal }).finalMessage();
      jsonRetries = 0;
    } catch (err) {
      if (signal.aborted) return aborted();
      if (err instanceof Anthropic.BadRequestError && systemMessages && hasSystemMessages(messages) && !foldRetried && rejectsSystemRole(err)) {
        // The model rejected mid-conversation system messages: fold them into user turns and retry once.
        foldRetried = true;
        systemMessages = false;
        messages.splice(0, messages.length, ...foldSystemMessages(messages));
        turn--;
        continue;
      }
      if (isTransientError(err) && transientRetries < retryDelays.length) {
        // overloaded / api_error inside the stream, or a dropped connection: the conversation is unchanged, re-issue the turn
        await delay(retryDelays[transientRetries++], signal);
        if (signal.aborted) return aborted();
        turn--;
        continue;
      }
      if (err instanceof Anthropic.APIError) throw err;
      // Unparseable streamed tool input (eager input streaming): re-issue the turn, capped.
      if (jsonRetries++ < 2) {
        turn--;
        continue;
      }
      throw err;
    }
    const retries = transientRetries;
    transientRetries = 0;

    const content = sanitizeAssistantContent(message.content);
    const toolUses = content.filter((b): b is BetaToolUseBlock => b.type === 'tool_use');
    hooks.onTurn({
      turn,
      stopReason: message.stop_reason,
      model: message.model,
      durationMs: Date.now() - started,
      usage: turnUsage(message),
      toolUses: toolUses.map((b) => ({ id: b.id, name: b.name, input: b.input })),
      text: content.map((b) => (b.type === 'text' ? b.text : '')).join(''),
      fallback: servedByFallback(message),
      retries,
    });

    // A refusal can cut a tool_use off mid-input: never run that turn's tools.
    if (message.stop_reason === 'refusal') throw new InferenceError('refusal', 'The model declined to compose this page, so nothing was generated.');

    if (message.stop_reason === 'pause_turn') {
      if (content.length) messages.push({ role: 'assistant', content });
      continue;
    }

    if (toolUses.length === 0) {
      if (hooks.isDone()) return { end: 'done', turns: turn };
      if (message.stop_reason === 'max_tokens') return { end: 'max_tokens', turns: turn };
      const nudge = hooks.nudge(++nudges);
      if (!nudge) return { end: 'end_turn', turns: turn };
      if (content.length) messages.push({ role: 'assistant', content });
      pushUser(messages, nudge);
      continue;
    }

    // A tool input cut off at max_tokens usually still parses: do not run it.
    if (message.stop_reason === 'max_tokens') return { end: 'max_tokens', turns: turn };

    messages.push({ role: 'assistant', content });
    const results = await hooks.executeTools(toolUses);
    if (hooks.isDone()) return { end: 'done', turns: turn };
    const toolResults: BetaToolResultBlockParam[] = toolUses.map((b, i) => ({
      type: 'tool_result',
      tool_use_id: b.id,
      content: results[i]?.content ?? 'No result.',
      ...(results[i]?.isError ? { is_error: true } : {}),
    }));
    const note = hooks.budgetMessage();
    if (note && !systemMessages) {
      messages.push({ role: 'user', content: [...toolResults, { type: 'text', text: `<system-reminder>${note}</system-reminder>` }] });
    } else {
      messages.push({ role: 'user', content: toolResults });
      if (note) messages.push({ role: 'system', content: note });
    }
    if (signal.aborted) return aborted();
  }
  return { end: 'max_turns', turns: turn };
}
