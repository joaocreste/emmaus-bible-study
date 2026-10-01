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
 * conversation is unchanged (but for a note on calls that already ran, below), so this is
 * safe — up to RETRY_DELAYS_MS.length times.
 *
 * Every attempt that fails (re-issued or not, finished early or not) is still billed for what
 * it streamed: onTurn records it as a failed TurnRecord with that usage, so a run's usage and
 * cost count it, and its turns are counted apart.
 *
 * Composition calls run while the turn streams (EarlyCalls): each as soon as its block has
 * finished with complete input, one at a time in block order, so the reader sees the page
 * shell and then each section appear. Only a leading run of the turn's tool calls runs this
 * way: the first research call, the first block whose input was cut off or is malformed, or a
 * fallback boundary ends it, and the rest runs after the turn as always. Their results are kept by
 * tool_use id and sent back with the turn's other results, in block order. What an early
 * call put on the page stands unless the response it came from is declined:
 *  - the turn fails and is re-issued: the model is told which calls the server already
 *    checked and what the page holds (a section sent again replaces its earlier version;
 *    appended items already on the page are skipped);
 *  - finish_page / reply was accepted before the failure: the task is complete;
 *  - abort or deadline: the page keeps those sections (the deadline finishes with them);
 *  - max_tokens: nothing more runs (the cut call never does); the complete calls before the
 *    cut stand, so the page is finished without an opening, like at the deadline;
 *  - refusal: nothing more runs, what the turn's calls did is taken back (discardEarly: the
 *    page is as it was before the turn) and the run ends as a refusal;
 *  - a mid-output fallback: what the declined attempt's calls did is taken back as soon as the
 *    fallback boundary arrives — the turn echoed back no longer contains them, as when nothing
 *    runs early; the fallback model's calls run after the turn.
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
  EndedBlock,
  ModelClient,
  ModelStream,
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
  /**
   * the attempt failed (an API error, a dropped stream, unparseable tool input, an abort) and was
   * re-issued or ended the run: not a turn, but billed — `usage` is what had streamed
   * (message_start and the last message_delta), `toolUses` the calls that ran while it streamed
   */
  failed?: true;
}

/** A call that ran while its turn streamed, with its result. */
export interface EarlyCall {
  block: BetaToolUseBlock;
  result: ToolExecution;
}

export interface LoopHooks {
  /** run one turn's tool calls; results in the same order as `blocks`. `early` holds, by tool_use id, the results of calls that already ran while the turn streamed: reuse them, never run those again */
  executeTools(blocks: BetaToolUseBlock[], turn: number, early: ReadonlyMap<string, ToolExecution>): Promise<ToolExecution[]>;
  /** may this call run as soon as its block has streamed (a composition call, whose effect the reader sees at once)? */
  runsEarly(name: string): boolean;
  /** run one call while its turn is still streaming; called one at a time, in block order. `before`: the calls of this turn that ran before it (always every earlier call of the turn) */
  executeEarly(block: BetaToolUseBlock, turn: number, before: readonly EarlyCall[]): Promise<ToolExecution>;
  /** the response these early calls came from was declined (a refusal, or a fallback model took over partway): take back what they did */
  discardEarly(calls: readonly EarlyCall[]): void;
  /** a turn failed after some of its calls ran and is re-issued: what to tell the model about them (null → nothing) */
  retryNote(calls: readonly EarlyCall[]): string | null;
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

/** The record of an attempt that failed: what it had streamed (`partial`, null when nothing did) and the calls that ran meanwhile. */
function failedAttempt(turn: number, partial: BetaMessage | null, model: string, started: number, ran: readonly EarlyCall[]): TurnRecord {
  return {
    turn,
    stopReason: null,
    model: partial?.model || model,
    durationMs: Date.now() - started,
    usage: partial ? turnUsage(partial) : { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 },
    toolUses: ran.map(({ block }) => ({ id: block.id, name: block.name, input: block.input })),
    text: '',
    fallback: partial ? servedByFallback(partial) : false,
    retries: 0,
    failed: true,
  };
}

/** Served by a fallback model? The served-by signal is a fallback_message iteration (sticky-routed turns carry no fallback block). */
export function servedByFallback(message: BetaMessage): boolean {
  return (message.usage.iterations ?? []).some((i) => i.type === 'fallback_message') || message.content.some((b) => b.type === 'fallback');
}

/** The text of a message (a mid-conversation system message is text only). */
function messageText(m: BetaMessageParam): string {
  return typeof m.content === 'string' ? m.content : m.content.map((b) => ('text' in b && typeof b.text === 'string' ? b.text : '')).join('\n');
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
  const note = messageText(last);
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
    const text = messageText(m);
    const block: BetaTextBlockParam = { type: 'text', text: `<system-reminder>${text}</system-reminder>` };
    if (prev && prev.role === 'user') {
      const content: BetaContentBlockParam[] = typeof prev.content === 'string' ? [{ type: 'text', text: prev.content }] : [...prev.content];
      out[out.length - 1] = { role: 'user', content: [...content, block] };
    } else out.push({ role: 'user', content: [block] });
  }
  return out;
}

/**
 * Add a server note to the conversation before the next request: as a mid-conversation system
 * message (merged into one already pending at the end), or folded into the last user turn for
 * models without them.
 */
function pushNote(messages: BetaMessageParam[], note: string, systemMessages: boolean): void {
  const last = messages[messages.length - 1];
  if (systemMessages) {
    if (last?.role !== 'system') messages.push({ role: 'system', content: note });
    else messages[messages.length - 1] = { role: 'system', content: `${messageText(last)}\n\n${note}` };
    return;
  }
  const block: BetaTextBlockParam = { type: 'text', text: `<system-reminder>${note}</system-reminder>` };
  if (last?.role !== 'user') {
    messages.push({ role: 'user', content: [block] });
    return;
  }
  const content: BetaContentBlockParam[] = typeof last.content === 'string' ? [{ type: 'text', text: last.content }] : [...last.content];
  messages[messages.length - 1] = { role: 'user', content: [...content, block] };
}

/**
 * One turn's composition calls, run while the turn streams: each as soon as its block has
 * finished with complete input, one at a time in block order, and only while every earlier
 * tool call of the turn ran this way too — so early results are always a leading run of the
 * turn's calls and nothing runs out of order.
 */
class EarlyCalls {
  /** results by tool_use id */
  readonly results = new Map<string, ToolExecution>();
  readonly done: EarlyCall[] = [];
  private open = true;
  private queue: Promise<void> = Promise.resolve();

  constructor(
    private readonly hooks: LoopHooks,
    private readonly turn: number,
    private readonly signal: AbortSignal,
  ) {}

  blockEnded(b: EndedBlock): void {
    if (!this.open) return;
    // before a fallback boundary, the declined attempt's calls are dropped from the turn: take back those that ran, and run nothing more until it ends
    if (b.type === 'fallback') {
      void this.discard();
      return;
    }
    if (b.type !== 'tool_use') return;
    const block = b.toolUse;
    if (!block || !this.hooks.runsEarly(block.name)) {
      // a research call, or input cut off / malformed: this block and every later one run after the turn
      this.open = false;
      return;
    }
    this.queue = this.queue.then(async () => {
      if (this.signal.aborted) return;
      const result = await this.hooks.executeEarly(block, this.turn, [...this.done]);
      this.results.set(block.id, result);
      this.done.push({ block, result });
    });
    this.queue.catch(() => {}); // observed by settle()
  }

  /** The response was declined (a fallback boundary, or a refusal): take no more blocks and, once the calls already started have run, take back what they did. */
  discard(): Promise<void> {
    this.open = false;
    this.queue = this.queue.then(() => {
      if (this.done.length) this.hooks.discardEarly(this.done.splice(0));
      this.results.clear();
    });
    this.queue.catch(() => {}); // observed by settle()
    return this.queue;
  }

  /** Take no more blocks; resolves once the calls already started have run (rejects if one threw). */
  settle(): Promise<void> {
    this.open = false;
    return this.queue;
  }
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
    const early = new EarlyCalls(hooks, turn, signal);
    // before a turn is re-issued: tell the model which of its calls already ran (the page keeps them)
    const noteEarlyCalls = () => {
      const note = early.done.length ? hooks.retryNote(early.done) : null;
      if (note) pushNote(messages, note, systemMessages);
    };
    let message: BetaMessage;
    let stream: ModelStream | undefined;
    try {
      stream = client.stream(buildParams(config, system, tools, messages), { signal });
      stream.onBlockEnd?.((block) => early.blockEnded(block));
      message = await stream.finalMessage();
      jsonRetries = 0;
    } catch (err) {
      await early.settle();
      // billed for what it streamed, whatever happens next
      hooks.onTurn(failedAttempt(turn, stream?.partialMessage?.() ?? null, config.model, started, early.done));
      if (signal.aborted) return aborted();
      // finish_page / reply was accepted while the turn streamed: the task is complete
      if (hooks.isDone()) return { end: 'done', turns: turn };
      if (err instanceof Anthropic.BadRequestError && systemMessages && hasSystemMessages(messages) && !foldRetried && rejectsSystemRole(err)) {
        // The model rejected mid-conversation system messages: fold them into user turns and retry once.
        foldRetried = true;
        systemMessages = false;
        messages.splice(0, messages.length, ...foldSystemMessages(messages));
        noteEarlyCalls();
        turn--;
        continue;
      }
      if (isTransientError(err) && transientRetries < retryDelays.length) {
        // overloaded / api_error inside the stream, or a dropped connection: the conversation is unchanged (but for the note), re-issue the turn
        noteEarlyCalls();
        await delay(retryDelays[transientRetries++], signal);
        if (signal.aborted) return aborted();
        turn--;
        continue;
      }
      if (err instanceof Anthropic.APIError) throw err;
      // Unparseable streamed tool input (eager input streaming): re-issue the turn, capped.
      if (jsonRetries++ < 2) {
        noteEarlyCalls();
        turn--;
        continue;
      }
      throw err;
    }
    await early.settle();
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

    // A refusal can cut a tool_use off mid-input: run nothing more of that turn, and take back what its
    // composition calls that had streamed completely already did — nothing of a declined response stays.
    if (message.stop_reason === 'refusal') {
      await early.discard();
      throw new InferenceError('refusal', 'The model declined to compose this page, so nothing was generated.');
    }

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

    // A tool input cut off at max_tokens usually still parses: run nothing more of that turn. Composition
    // calls that had streamed completely before the cut already ran, and what they did stands.
    if (message.stop_reason === 'max_tokens') return { end: hooks.isDone() ? 'done' : 'max_tokens', turns: turn };

    messages.push({ role: 'assistant', content });
    const results = await hooks.executeTools(toolUses, turn, early.results);
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
