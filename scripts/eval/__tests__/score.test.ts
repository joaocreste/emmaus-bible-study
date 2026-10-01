import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { TurnRecord } from '../../../server/inference/loop.ts';
import { costUsd, loadCases, REPO_ROOT, rejectionKind, type EvalRunLog, type LoadedRun } from '../lib.ts';
import { byFlow, compare, scoreDir, scoreRun, summarize, type Scored } from '../score.ts';

const LOGS = join(REPO_ROOT, '.kb-cache', 'logs');
/** the fourteen Opus 5 high composes of the second live evaluation (2026-09-30 10:56–11:45Z) */
const BASELINE_LOG = join(LOGS, '2026-09-30T11-45-10-901Z-genesis-1.json');
const set = loadCases();

describe('rejection kinds and prices', () => {
  it('sorts validator reasons into the E2 kinds', () => {
    expect(rejectionKind('significance mentions “Mateus 19:9”, “Marcos 10:11”, which are not a Bible reference')).toBe('book-name');
    expect(rejectionKind('text names Calvin, Henry, which none of the cited evidence names')).toBe('name/tradition');
    expect(rejectionKind('none of the cited texts is a Evangelical text — “Evangelical” must rest on that tradition’s own texts (its confession or catechism, a reference work of that tradition)')).toBe('perspective/voice');
    expect(rejectionKind('explanation mentions Genesis 2, which none of the cited evidence gives')).toBe('reference');
    expect(rejectionKind('something new')).toBe('other');
  });

  it('prices usage at the model’s rates and refuses unknown models', () => {
    expect(costUsd('claude-opus-5', { input: 1e6, output: 1e6, cacheRead: 1e6, cacheCreation: 1e6 })).toBeCloseTo(5 + 25 + 0.5 + 6.25, 6);
    expect(costUsd('claude-unknown', { input: 1, output: 1, cacheRead: 1, cacheCreation: 1 })).toBeNull();
  });
});

describe('failed attempts and withdrawn calls', () => {
  const usage = (input: number, output: number, cacheRead: number) => ({ input, output, cacheRead, cacheCreation: 0 });
  const turn = (n: number, u: TurnRecord['usage'], failed = false): TurnRecord => ({ turn: n, stopReason: failed ? null : 'tool_use', model: 'claude-opus-5', durationMs: 1, usage: u, toolUses: [], text: '', fallback: false, retries: 0, ...(failed ? { failed: true as const } : {}) });
  const call = (t: number, name: string, result = 'ok') => ({ turn: t, id: `${name}-${t}`, name, input: {}, isError: false, evidence: [], result, ms: 1 });
  const decision = (t: number, tool: string, accepted: number, rejected: string[] = [], section?: string) => ({ turn: t, tool, ...(section ? { section } : {}), accepted, rejected: rejected.map((reason) => ({ item: 'x', reason })), warnings: [], notes: [] });
  const log = {
    flow: 'compose',
    request: { query: 'a synthetic question', translation: 'BSB' },
    studyId: 's',
    model: 'claude-opus-5',
    effort: 'high',
    budgets: { maxResearchCalls: 16, researchMs: 1, totalMs: 1, maxTurns: 40 },
    startedAt: '2026-09-30T12:00:00Z',
    durationMs: 1,
    cached: false,
    outcome: { end: 'done' },
    researchCalls: 0,
    ledger: [],
    // turn 2: a response declined partway (its theology section was taken back), then the turn re-issued after a failed attempt
    toolCalls: [call(1, 'begin_page'), call(2, 'add_section', '[withdrawn: the response was declined] Added 3 items.'), call(2, 'add_section'), call(2, 'finish_page')],
    decisions: [decision(1, 'begin_page', 1), decision(2, 'add_section', 3, ['text names Calvin, which none of the cited evidence names'], 'theology'), decision(2, 'add_section', 2, [], 'theology'), decision(2, 'finish_page', 1)],
    turns: [turn(1, usage(1000, 200, 5000)), turn(2, usage(1000, 0, 6000), true), turn(2, usage(1000, 300, 6000))],
    usage: usage(3000, 500, 17000),
    steps: [],
  } as unknown as EvalRunLog;
  const run: LoadedRun = { file: 'synthetic.log.json', log, page: null };

  it('counts a failed attempt’s cost but not as a turn, and reports it apart', () => {
    const r = scoreRun(run, set, 1);
    expect(r.turns).toBe(2);
    expect(r.failedAttempts).toBe(1);
    expect(r.costUsd).toBeCloseTo(costUsd('claude-opus-5', usage(3000, 500, 17000))!, 9);
    expect(summarize([r, { ...r, failedAttempts: 2 }]).failedAttempts).toBe(3);
  });

  it('leaves decisions on withdrawn calls out of the accepted, rejected and repair counts, and reports how many', () => {
    const r = scoreRun(run, set, 1);
    expect(r.withdrawn).toBe(1);
    expect(r.accepted).toBe(4);
    expect(r.rejected).toBe(0);
    expect(r.firstPassRejected).toBe(0);
    expect(r.repairs).toBe(0);
    expect(r.completed).toBe(true);
    expect(summarize([r]).withdrawn).toBe(1);
  });

  it('pairs decisions with their calls by id, so a call that recorded no decision cannot shift the pairing', () => {
    // turn 2: withdrawn A (invalid input, no decision) and withdrawn B, then the fallback model's C
    const a = { ...call(2, 'add_section', '[withdrawn: the response was declined] The input is invalid.'), id: 'A' };
    const b = { ...call(2, 'add_section', '[withdrawn: the response was declined] Added 2 items.'), id: 'B' };
    const c = { ...call(2, 'add_section'), id: 'C' };
    const withIds = {
      ...log,
      toolCalls: [call(1, 'begin_page'), a, b, c, call(3, 'finish_page')],
      decisions: [
        { ...decision(1, 'begin_page', 1), callId: 'begin_page-1' },
        { ...decision(2, 'add_section', 2, [], 'theology'), callId: 'B' },
        { ...decision(2, 'add_section', 3, [], 'commentary'), callId: 'C' },
        { ...decision(3, 'finish_page', 1), callId: 'finish_page-3' },
      ],
    } as unknown as EvalRunLog;
    const r = scoreRun({ file: 'ids.log.json', log: withIds, page: null }, set, 1);
    expect(r.withdrawn).toBe(1);
    expect(r.accepted).toBe(5);
  });
});

describe.skipIf(!existsSync(BASELINE_LOG))('scoring the logged baseline (.kb-cache/logs)', () => {
  it('reproduces the 2026-09-30 quality table of the fourteen completed composes', () => {
    const s = scoreDir(LOGS, set, { since: '2026-09-30T10:00:00Z' });
    const compose = byFlow(s.runs).compose;
    expect(compose.runs).toBe(15); // the fourteen pages plus the aborted "Genesis" run
    expect(compose.completed).toBe(14);
    expect(compose.sectionsComplete).toBe(14);
    expect(compose.mean.accepted).toBeCloseTo(42.5, 6);
    expect(compose.mean.rejected).toBeCloseTo(57 / 14, 6);
    expect(compose.mean.repairs).toBeCloseTo(32 / 14, 6);
    expect(compose.mean.costUsd).toBeCloseTo(1.098, 3);
    expect(compose.mean.turns).toBeCloseTo(12.14, 2);
    expect(compose.mean.researchCalls).toBeCloseTo(15.36, 2);
    expect(compose.mean.ledger).toBeCloseTo(83, 6);
    expect(compose.mean.memoryRecall).toBeCloseTo(36 / 14, 6);
    expect(compose.rejectedByKind).toMatchObject({ 'name/tradition': 19, date: 6, quote: 4, 'lexical/unread': 6, 'claim-word': 1, schema: 1, 'book-name': 11 });
    // failed runs' spend counts against the completed pages
    expect(compose.costPerCompletedUsd!).toBeGreaterThan(compose.mean.costUsd!);
    const genesis = s.runs.filter((r) => r.caseId === 'genesis-1');
    expect(genesis.map((r) => r.trial)).toEqual([1, 2]);
  });

  it('checks the copyrighted-author answer: declined, no quotation marks', () => {
    const s = scoreDir(LOGS, set, { since: '2026-09-29T23:38:00Z', until: '2026-09-29T23:39:00Z' });
    const keller = s.runs.find((r) => r.caseId === 'a-keller');
    expect(keller?.completed).toBe(true);
    expect(keller?.decline).toEqual({ ok: true, reason: 'declined without quotation marks' });
  });

  it('applies the E7 rule to paired runs', () => {
    const scored = scoreDir(LOGS, set, { since: '2026-09-29T23:30:00Z' });
    const completed: Scored = { ...scored, runs: scored.runs.filter((r) => r.completed) };
    const replay = join(mkdtempSync(join(tmpdir(), 'emmaus-score-')), 'replay.json');
    writeFileSync(replay, JSON.stringify([{ file: 'x', rows: [{ oldAccepted: 40, newAccepted: 39 }, { newAccepted: 3 }] }]));

    const same = compare(completed, completed, set, replay);
    expect(same.checks.filter((c) => c.pass === false)).toEqual([]);
    expect(same.verdict).toBe('KEEP');
    expect(compare(completed, completed, set).verdict).toBe('INCOMPLETE'); // no E3 replay given

    const thinner: Scored = { ...completed, runs: completed.runs.map((r) => (r.caseId === 'baptism' ? { ...r, accepted: Math.floor(r.accepted * 0.8) } : r)) };
    const worse = compare(completed, thinner, set, replay);
    expect(worse.verdict).toBe('REVERT');
    expect(worse.checks.find((c) => c.name.startsWith('accepted items'))?.detail).toContain('baptism');

    const failing = compare(completed, scored, set, replay); // the candidate includes errored runs
    expect(failing.checks[0]).toMatchObject({ name: 'completion 100%', pass: false });
  });
});
