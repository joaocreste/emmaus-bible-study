/**
 * The --dry-run model: a scripted stand-in for the Claude API (the FakeModelClient pattern of
 * server/inference/__tests__/fakes.ts), so the runner, its spend cap, its logs and the scorer
 * run end to end for free. No network, no credential, no SDK client.
 *
 * - compose: one real research call (search_knowledge for the query), then it ends its turns
 *   without a page, so the run fails as 'invalid-output' once the loop's nudges run out;
 * - answer: one search, then a declined reply that only says what is missing (it passes the checks).
 *
 * Each turn reports a share of a logged Opus 5 high run's usage, so a dry run costs (on
 * paper) about what the real one did and the --max-usd stop can be exercised.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { BetaContentBlock, BetaMessage, ModelClient, ModelStream, StreamParams } from '../../server/inference/modelClient.ts';

/** Summed usage of one run, spread evenly over its usual number of model turns. */
export const DRY_RUN_PROFILE = {
  // search + 3 ended turns ≈ $1.12 at Opus 5 rates (the 14 logged composes averaged $1.10)
  compose: { turns: 4, input: 1_200, output: 18_000, cacheRead: 570_000, cacheCreation: 60_000 },
  // search + reply ≈ $0.24 (the logged answers averaged $0.21)
  answer: { turns: 2, input: 600, output: 3_000, cacheRead: 120_000, cacheCreation: 16_000 },
} as const;

let seq = 0;

export class DryRunModelClient implements ModelClient {
  /** requests seen, in order (model turns of this run) */
  readonly requests: StreamParams[] = [];
  private readonly flow: 'compose' | 'answer';
  private readonly text: string;
  private readonly model: string;

  constructor(flow: 'compose' | 'answer', text: string, model: string) {
    this.flow = flow;
    this.text = text;
    this.model = model;
  }

  stream(params: StreamParams, options: { signal?: AbortSignal }): ModelStream {
    this.requests.push(params);
    const index = this.requests.length - 1;
    const signal = options.signal;
    const promise = (async (): Promise<BetaMessage> => {
      if (signal?.aborted) throw new Anthropic.APIUserAbortError();
      return this.turn(index);
    })();
    promise.catch(() => {});
    return { finalMessage: () => promise, abort: () => {} };
  }

  private turn(index: number): BetaMessage {
    if (index === 0) return this.message([toolUse('search_knowledge', { query: this.text })], 'tool_use');
    if (this.flow === 'answer') {
      return this.message([toolUse('reply', { text: 'The knowledge base holds nothing that answers this question.', evidence: [], declined: true })], 'tool_use');
    }
    return this.message([{ type: 'text', text: 'Dry run: no page is composed.', citations: null } as unknown as BetaContentBlock], 'end_turn');
  }

  private message(content: BetaContentBlock[], stop: BetaMessage['stop_reason']): BetaMessage {
    const p = DRY_RUN_PROFILE[this.flow];
    return {
      id: `msg_dry_${++seq}`,
      type: 'message',
      role: 'assistant',
      model: this.model,
      content,
      stop_reason: stop,
      stop_sequence: null,
      usage: {
        input_tokens: Math.round(p.input / p.turns),
        output_tokens: Math.round(p.output / p.turns),
        cache_read_input_tokens: Math.round(p.cacheRead / p.turns),
        cache_creation_input_tokens: Math.round(p.cacheCreation / p.turns),
      },
    } as unknown as BetaMessage;
  }
}

function toolUse(name: string, input: unknown): BetaContentBlock {
  return { type: 'tool_use', id: `toolu_dry_${++seq}`, name, input } as unknown as BetaContentBlock;
}
