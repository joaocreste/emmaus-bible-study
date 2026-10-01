/**
 * The tool loop's streamed calls: the block-end watcher (strict tool input) and composition
 * calls run while a turn streams — in block order, results paired by tool_use id, a note when
 * a turn that ran calls is re-issued, what they did taken back when the response is declined
 * (a fallback boundary or a refusal), and nothing started after an abort.
 */
import Anthropic from '@anthropic-ai/sdk';
import { describe, expect, it } from 'vitest';
import { runToolLoop, type LoopHooks, type ToolExecution, type TurnRecord } from '../loop';
import { blockEndWatcher, type BetaRawMessageStreamEvent, type BetaToolUseBlock, type EndedBlock } from '../modelClient';
import { fail, fallbackBlock, FakeModelClient, hang, message, overloadedError, reply, testConfig, textBlock, toolResults, toolUse, type ScriptedTurn } from './fakes';

const COMPOSE = new Set(['begin_page', 'add_section', 'finish_page', 'reply']);
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('blockEndWatcher', () => {
  const run = (events: BetaRawMessageStreamEvent[]): EndedBlock[] => {
    const out: EndedBlock[] = [];
    const watch = blockEndWatcher((b) => out.push(b));
    for (const e of events) watch(e);
    return out;
  };
  const start = (index: number, content_block: unknown) => ({ type: 'content_block_start', index, content_block }) as BetaRawMessageStreamEvent;
  const json = (index: number, partial_json: string) => ({ type: 'content_block_delta', index, delta: { type: 'input_json_delta', partial_json } }) as BetaRawMessageStreamEvent;
  const stop = (index: number) => ({ type: 'content_block_stop', index }) as BetaRawMessageStreamEvent;
  const tool = (index: number, id: string) => start(index, { type: 'tool_use', id, name: 'add_section', input: {} });

  it('passes a tool call whose streamed input is one complete JSON object, parsed from all its deltas', () => {
    expect(run([start(0, { type: 'thinking', thinking: '', signature: '' }), stop(0), tool(1, 't1'), json(1, '{"section":"theo'), json(1, 'logy","themes":[]}'), stop(1)])).toEqual([
      { type: 'thinking' },
      { type: 'tool_use', toolUse: { type: 'tool_use', id: 't1', name: 'add_section', input: { section: 'theology', themes: [] } } },
    ]);
  });

  it('input cut off (which a partial-JSON parse would accept), malformed, empty or not an object → null: never run early', () => {
    const ended = run([tool(0, 'a'), json(0, '{"section":"theology","themes":[{"title":"x"}]'), stop(0), tool(1, 'b'), json(1, '{"section": theology}'), stop(1), tool(2, 'c'), stop(2), tool(3, 'd'), json(3, '"not json"'), stop(3)]);
    expect(ended).toEqual([
      { type: 'tool_use', toolUse: null },
      { type: 'tool_use', toolUse: null },
      { type: 'tool_use', toolUse: null },
      { type: 'tool_use', toolUse: null },
    ]);
  });

  it('reports other blocks by type only, fallback boundaries included', () => {
    expect(run([start(0, { type: 'text', text: '' }), stop(0), start(1, { type: 'fallback', from: { model: 'a' }, to: { model: 'b' } }), stop(1)])).toEqual([{ type: 'text' }, { type: 'fallback' }]);
  });
});

/* ------------------------------------------------------------------ */
/* The loop                                                            */
/* ------------------------------------------------------------------ */

interface Recorder {
  early: string[];
  executed: { ids: string[]; early: string[] }[];
  /** the ids of each set of early calls taken back */
  discarded: string[][];
}

function hooks(rec: Recorder, overrides: Partial<LoopHooks> = {}): LoopHooks {
  const ok = (id: string, how: string): ToolExecution => ({ content: `${how} ${id}`, isError: false });
  return {
    runsEarly: (name) => COMPOSE.has(name),
    executeEarly: async (b) => {
      rec.early.push(b.id);
      return ok(b.id, 'early');
    },
    executeTools: async (blocks, _turn, early) => {
      rec.executed.push({ ids: blocks.map((b) => b.id), early: blocks.filter((b) => early.has(b.id)).map((b) => b.id) });
      return blocks.map((b) => early.get(b.id) ?? ok(b.id, 'after'));
    },
    discardEarly: (calls) => rec.discarded.push(calls.map((c) => c.block.id)),
    retryNote: (calls) => `Already checked: ${calls.map((c) => c.block.id).join(', ')}.`,
    isDone: () => false,
    budgetMessage: () => null,
    nudge: () => null,
    onTurn: () => {},
    ...overrides,
  };
}

function loop(client: FakeModelClient, h: LoopHooks, signal = new AbortController().signal, deadlineReached = () => false) {
  return runToolLoop({ client, config: testConfig({ maxTurns: 6 }), system: [], tools: [], messages: [{ role: 'user', content: 'go' }], signal, deadlineReached, retryDelaysMs: [0, 0] }, h);
}

describe('runToolLoop — calls run as their blocks stream', () => {
  it('runs the leading composition calls before the turn ends, in block order; the rest after it; one result per tool_use, in order', async () => {
    const rec: Recorder = { early: [], executed: [], discarded: [] };
    const blocks = [toolUse('begin_page', {}, 'a'), textBlock('…'), toolUse('add_section', {}, 'b'), toolUse('search_knowledge', {}, 'c'), toolUse('add_section', {}, 'd')];
    let atEnd: string[] = [];
    const turn: ScriptedTurn = async (_p, { stream }) => {
      for (const b of blocks) await stream(b);
      await sleep(20);
      atEnd = [...rec.early];
      return message(blocks);
    };
    const client = new FakeModelClient([turn, reply([textBlock('done')], 'end_turn')]);
    await loop(client, hooks(rec));
    expect(atEnd).toEqual(['a', 'b']); // before the turn ended; d follows the research call, so it waits
    expect(rec.executed).toEqual([{ ids: ['a', 'b', 'c', 'd'], early: ['a', 'b'] }]);
    const results = toolResults(client.requests[1]);
    expect(Array.from(results.entries())).toEqual([
      ['a', { content: 'early a', isError: false }],
      ['b', { content: 'early b', isError: false }],
      ['c', { content: 'after c', isError: false }],
      ['d', { content: 'after d', isError: false }],
    ]);
  });

  it('a turn re-issued after some calls ran: the note is merged into the pending system message (or folded into the user turn)', async () => {
    const partway: ScriptedTurn = async (_p, { stream }) => {
      await stream(toolUse('add_section', {}, 'x'));
      throw overloadedError();
    };
    const rec: Recorder = { early: [], executed: [], discarded: [] };
    let budget = true;
    const h = hooks(rec, { budgetMessage: () => (budget ? ((budget = false), 'Compose now.') : null) });
    const client = new FakeModelClient([reply([toolUse('find_topics', {}, 'r')]), partway, reply([textBlock('ok')], 'end_turn')]);
    await loop(client, h);
    const retry = client.requests[2].messages;
    expect(retry.slice(0, -1)).toEqual(client.requests[1].messages.slice(0, -1));
    expect(retry.at(-1)).toEqual({ role: 'system', content: 'Compose now.\n\nAlready checked: x.' });

    // a model without mid-conversation system messages: the note joins the last user turn as a reminder
    const badRequest = new Anthropic.BadRequestError(400, { type: 'error', error: { type: 'invalid_request_error', message: "role 'system' is not supported" } }, 'bad', new Headers());
    budget = true;
    const folded = new FakeModelClient([reply([toolUse('find_topics', {}, 'r')]), fail(badRequest), partway, reply([textBlock('ok')], 'end_turn')]);
    await loop(folded, h);
    const last = folded.requests[3].messages;
    expect(last.some((m) => m.role === 'system')).toBe(false);
    expect(JSON.stringify(last.at(-1))).toMatch(/<system-reminder>Compose now\.<\/system-reminder>.*<system-reminder>Already checked: x\.<\/system-reminder>/);
  });

  it('a turn whose later tool input is unparseable (the SDK rejects it) is re-issued with the note', async () => {
    const partway: ScriptedTurn = async (_p, { stream }) => {
      await stream(toolUse('begin_page', {}, 'p'));
      await stream(toolUse('add_section', {}, 'q'), { cut: true });
      throw new Anthropic.AnthropicError('Unable to parse tool parameter JSON from model.');
    };
    const rec: Recorder = { early: [], executed: [], discarded: [] };
    const client = new FakeModelClient([partway, reply([textBlock('ok')], 'end_turn')]);
    await loop(client, hooks(rec));
    expect(rec.early).toEqual(['p']); // the cut block never ran
    expect(client.requests[1].messages.at(-1)).toEqual({ role: 'system', content: 'Already checked: p.' });
  });

  it('the task finished by a call that ran early ends the loop even when the stream then fails', async () => {
    let done = false;
    const rec: Recorder = { early: [], executed: [], discarded: [] };
    const partway: ScriptedTurn = async (_p, { stream, start }) => {
      start({ input: 900, cacheRead: 7000 });
      await stream(toolUse('finish_page', {}, 'f'));
      throw overloadedError();
    };
    const client = new FakeModelClient([partway]);
    const turns: TurnRecord[] = [];
    const h = hooks(rec, {
      executeEarly: async (b) => ((done = b.name === 'finish_page'), { content: 'finished', isError: false }),
      isDone: () => done,
      onTurn: (t) => turns.push(t),
    });
    await expect(loop(client, h)).resolves.toEqual({ end: 'done', turns: 1 });
    expect(client.calls).toBe(1);
    // the failed attempt was billed: it is recorded, with what it streamed
    expect(turns).toMatchObject([{ turn: 1, failed: true, stopReason: null, usage: { input: 900, output: 0, cacheRead: 7000, cacheCreation: 0 }, toolUses: [{ id: 'f', name: 'finish_page' }] }]);
  });

  it('every failed attempt is recorded with the usage it streamed (transient, unparseable input, a stream that fails before message_start), apart from the turn that succeeds', async () => {
    const unparseable = new Anthropic.AnthropicError('Unable to parse tool parameter JSON from model.');
    const client = new FakeModelClient([fail(overloadedError(), { input: 1000, cacheRead: 4000 }), fail(unparseable, { input: 1000, output: 250, cacheRead: 4000 }), fail(overloadedError()), reply([textBlock('ok')], 'end_turn')]);
    const turns: TurnRecord[] = [];
    await expect(loop(client, hooks({ early: [], executed: [], discarded: [] }, { onTurn: (t) => turns.push(t) }))).resolves.toEqual({ end: 'end_turn', turns: 1 });
    expect(turns.map((t) => [t.turn, t.failed ?? false, t.stopReason, t.usage.input, t.usage.output, t.usage.cacheRead])).toEqual([
      [1, true, null, 1000, 0, 4000],
      [1, true, null, 1000, 250, 4000],
      [1, true, null, 0, 0, 0],
      [1, false, 'end_turn', 1200, 300, 5000],
    ]);
    expect(turns[3].retries).toBe(2);
  });

  it('an abort mid-turn waits for the call under way and starts no other', async () => {
    const controller = new AbortController();
    const started: string[] = [];
    let finished = false;
    const turn: ScriptedTurn = async (params, info) => {
      await info.stream(toolUse('add_section', {}, 'a'));
      await info.stream(toolUse('add_section', {}, 'b'));
      return hang(params, info);
    };
    const h = hooks({ early: [], executed: [], discarded: [] }, {
      executeEarly: async (b: BetaToolUseBlock) => {
        started.push(b.id);
        if (b.id === 'a') {
          controller.abort();
          await sleep(20);
          finished = true;
        }
        return { content: 'ok', isError: false };
      },
    });
    const out = await loop(new FakeModelClient([turn]), h, controller.signal, () => true);
    expect(out.end).toBe('deadline');
    expect(started).toEqual(['a']);
    expect(finished).toBe(true);
  });

  it('a call that throws while the turn streams fails the run, like a throwing executeTools; later calls do not run', async () => {
    const started: string[] = [];
    const blocks = [toolUse('add_section', {}, 'a'), toolUse('add_section', {}, 'b')];
    const h = hooks({ early: [], executed: [], discarded: [] }, {
      executeEarly: async (b) => {
        started.push(b.id);
        throw new Error('boom');
      },
    });
    await expect(loop(new FakeModelClient([reply(blocks)]), h)).rejects.toThrow('boom');
    expect(started).toEqual(['a']);
  });

  it('each early call is told which calls of its turn ran before it', async () => {
    const seen: [string, string[]][] = [];
    const h = hooks({ early: [], executed: [], discarded: [] }, {
      executeEarly: async (b, _turn, before) => (seen.push([b.id, before.map((c) => c.block.id)]), { content: 'ok', isError: false }),
    });
    await loop(new FakeModelClient([reply([toolUse('begin_page', {}, 'a'), toolUse('add_section', {}, 'b'), toolUse('finish_page', {}, 'c')]), reply([textBlock('ok')], 'end_turn')]), h);
    expect(seen).toEqual([
      ['a', []],
      ['b', ['a']],
      ['c', ['a', 'b']],
    ]);
  });

  it('a fallback boundary takes back what the declined attempt’s early calls did; the fallback model’s calls run after the turn', async () => {
    const rec: Recorder = { early: [], executed: [], discarded: [] };
    const blocks = [toolUse('begin_page', {}, 'a'), toolUse('add_section', {}, 'b'), fallbackBlock(), toolUse('begin_page', {}, 'c')];
    await loop(new FakeModelClient([reply(blocks), reply([textBlock('ok')], 'end_turn')]), hooks(rec));
    expect(rec.early).toEqual(['a', 'b']);
    expect(rec.discarded).toEqual([['a', 'b']]);
    expect(rec.executed).toEqual([{ ids: ['c'], early: [] }]);
  });

  it('a refusal takes back what the turn’s early calls did and runs nothing more', async () => {
    const rec: Recorder = { early: [], executed: [], discarded: [] };
    const client = new FakeModelClient([reply([toolUse('begin_page', {}, 'a'), toolUse('add_section', {}, 'b')], 'refusal')]);
    await expect(loop(client, hooks(rec))).rejects.toMatchObject({ code: 'refusal' });
    expect(rec.early).toEqual(['a']); // b was cut off
    expect(rec.discarded).toEqual([['a']]);
    expect(rec.executed).toEqual([]);
  });

  it('without the block-end signal every call runs after the turn', async () => {
    const rec: Recorder = { early: [], executed: [], discarded: [] };
    const client = new FakeModelClient([reply([toolUse('begin_page', {}, 'a'), toolUse('add_section', {}, 'b')]), reply([textBlock('ok')], 'end_turn')], { streaming: false });
    await loop(client, hooks(rec));
    expect(rec.early).toEqual([]);
    expect(rec.executed).toEqual([{ ids: ['a', 'b'], early: [] }]);
  });
});
