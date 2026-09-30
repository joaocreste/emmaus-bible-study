/**
 * The seam between the inference loop and the Anthropic SDK: one method around
 * `client.beta.messages.stream(...)`. Tests inject a scripted fake with the same shape.
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

export interface ModelStream {
  /** the complete assistant message (rejects on API errors, aborts and unparseable tool input) */
  finalMessage(): Promise<BetaMessage>;
  abort(): void;
}

export interface ModelClient {
  stream(params: StreamParams, options: { signal?: AbortSignal }): ModelStream;
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
      return client.beta.messages.stream(params, { signal: options.signal });
    },
  };
}
