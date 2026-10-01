/**
 * The seam between the inference loop and the Anthropic SDK: one method around
 * `client.beta.messages.stream(...)` — the final message, and each content block as it
 * finishes streaming (so composition calls can run before the turn ends). Tests inject a
 * scripted fake with the same shape.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { InferenceConfig } from './config';

export type StreamParams = Parameters<Anthropic['beta']['messages']['stream']>[0];
export type BetaMessage = Anthropic.Beta.BetaMessage;
export type BetaMessageParam = Anthropic.Beta.BetaMessageParam;
export type BetaContentBlock = Anthropic.Beta.BetaContentBlock;
export type BetaContentBlockParam = Anthropic.Beta.BetaContentBlockParam;
export type BetaTool = Anthropic.Beta.BetaTool;
export type BetaToolUseBlock = Anthropic.Beta.BetaToolUseBlock;
export type BetaToolResultBlockParam = Anthropic.Beta.BetaToolResultBlockParam;
export type BetaTextBlockParam = Anthropic.Beta.BetaTextBlockParam;
export type BetaRawMessageStreamEvent = Anthropic.Beta.BetaRawMessageStreamEvent;

/** A content block that has finished streaming (its content_block_stop). */
export interface EndedBlock {
  /** the block's type: 'tool_use', 'thinking', 'text', 'fallback', … */
  type: string;
  /** tool_use only: the call, when its streamed input is complete JSON; null when it was cut off or is malformed */
  toolUse?: BetaToolUseBlock | null;
}

export interface ModelStream {
  /** the complete assistant message (rejects on API errors, aborts and unparseable tool input) */
  finalMessage(): Promise<BetaMessage>;
  abort(): void;
  /** told of each content block as it finishes streaming, in order (optional: without it every tool runs after the turn) */
  onBlockEnd?(listener: (block: EndedBlock) => void): void;
  /**
   * The message as streamed so far — message_start's usage, updated by the last message_delta —
   * or null before message_start: what an attempt that then failed was billed (optional).
   */
  partialMessage?(): BetaMessage | null;
}

export interface ModelClient {
  stream(params: StreamParams, options: { signal?: AbortSignal }): ModelStream;
}

/**
 * Turns raw stream events into EndedBlock notifications. A tool's input is parsed strictly from
 * its streamed JSON: the SDK's snapshot uses a partial-JSON parser, which also accepts input cut
 * off at max_tokens or by a refusal, and such a call must never run.
 */
export function blockEndWatcher(listener: (block: EndedBlock) => void): (event: BetaRawMessageStreamEvent) => void {
  const open = new Map<number, { type: string; id: string; name: string; json: string }>();
  return (event) => {
    switch (event.type) {
      case 'content_block_start': {
        const b = event.content_block;
        open.set(event.index, b.type === 'tool_use' ? { type: b.type, id: b.id, name: b.name, json: '' } : { type: b.type, id: '', name: '', json: '' });
        break;
      }
      case 'content_block_delta': {
        const b = open.get(event.index);
        if (b && event.delta.type === 'input_json_delta') b.json += event.delta.partial_json;
        break;
      }
      case 'content_block_stop': {
        const b = open.get(event.index);
        if (!b) break;
        open.delete(event.index);
        if (b.type !== 'tool_use') {
          listener({ type: b.type });
          break;
        }
        const input = completeInput(b.json);
        listener({ type: 'tool_use', toolUse: input === undefined ? null : { type: 'tool_use', id: b.id, name: b.name, input } });
        break;
      }
    }
  };
}

/** The tool input when `json` is one complete JSON object (it ends with its closing brace), else undefined. */
function completeInput(json: string): Record<string, unknown> | undefined {
  try {
    const value: unknown = JSON.parse(json);
    return value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

/** Real client. The key is passed explicitly when it came from .env.local (the SDK only reads process.env). */
export function createAnthropicModelClient(config: InferenceConfig): ModelClient {
  const { credential } = config;
  const client =
    credential.source === 'api-key'
      ? new Anthropic({ apiKey: credential.apiKey, authToken: null })
      : credential.source === 'auth-token'
        ? new Anthropic({ authToken: credential.authToken, apiKey: null })
        : new Anthropic();
  return {
    stream(params, options) {
      const stream = client.beta.messages.stream(params, { signal: options.signal });
      return {
        finalMessage: () => stream.finalMessage(),
        abort: () => stream.abort(),
        onBlockEnd: (listener) => {
          stream.on('streamEvent', blockEndWatcher(listener));
        },
        partialMessage: () => stream.currentMessage ?? null,
      };
    },
  };
}
