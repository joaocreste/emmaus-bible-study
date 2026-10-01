/**
 * The runner end to end, for free: the real CLI in a child process, either refusing (no paid
 * opt-in, no cap) or with --dry-run (scripted model). The child never sees an opt-in or a
 * credential: EMMAUS_EVAL_RUN is removed, the API key and token are blanked, and the SDK's
 * profile directory points at an empty folder.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EVAL_DIR, loadCases, REPO_ROOT } from '../lib.ts';
import { byFlow, scoreDir } from '../score.ts';

const RUNNER = join(EVAL_DIR, 'run.ts');

function runner(args: string[]): { status: number | null; stdout: string; stderr: string } {
  const env: NodeJS.ProcessEnv = { ...process.env, ANTHROPIC_API_KEY: '', ANTHROPIC_AUTH_TOKEN: '', ANTHROPIC_CONFIG_DIR: mkdtempSync(join(tmpdir(), 'emmaus-noauth-')) };
  delete env.EMMAUS_EVAL_RUN;
  delete env.EMMAUS_LIVE;
  const r = spawnSync(process.execPath, [RUNNER, ...args], { cwd: REPO_ROOT, env, encoding: 'utf8', timeout: 200_000 });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}

describe('scripts/eval/run.ts', () => {
  it('refuses a paid run without EMMAUS_EVAL_RUN=1, before loading anything', () => {
    const out = mkdtempSync(join(tmpdir(), 'emmaus-eval-'));
    const r = runner(['--label', 'paid', '--max-usd', '5', '--out', out]);
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('Refusing to run: this bills the Claude API');
    expect(readdirSync(out)).toEqual([]);
  });

  it('refuses to run without a spending cap', () => {
    const out = mkdtempSync(join(tmpdir(), 'emmaus-eval-'));
    const r = runner(['--dry-run', '--label', 'nocap', '--out', out]);
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('--max-usd');
    expect(readdirSync(out)).toEqual([]);
  });

  it('dry run: logs, pages and manifest; stops before the case that would pass --max-usd; --resume continues', () => {
    const out = mkdtempSync(join(tmpdir(), 'emmaus-eval-'));
    // two composes cost about $1.12 each on paper; the third would need $1.41 more than the $3 cap allows
    const first = runner(['--dry-run', '--label', 'dry', '--max-usd', '3', '--cases', 'divorce,genesis-1,mark-7', '--out', out]);
    expect(first.stderr).toBe('');
    expect(first.status).toBe(0);
    expect(first.stdout).toContain('Stopped before mark-7');
    const dir = join(out, 'dry');
    let manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
    expect(manifest).toMatchObject({ label: 'dry', dryRun: true, model: 'claude-opus-5', effort: 'high', invocations: 1 });
    expect(manifest.stopped).toMatchObject({ reason: 'max-usd', caseId: 'mark-7', trial: 1 });
    expect(manifest.runs.map((r: { caseId: string }) => r.caseId)).toEqual(['divorce', 'genesis-1']);
    expect(manifest.spendUsd).toBeLessThanOrEqual(3);
    expect(manifest.runner.gitSha).toMatch(/^[0-9a-f]{40}$/);
    expect(manifest.caps).toMatchObject({ maxResearchCalls: expect.any(Number), maxTurns: expect.any(Number) });
    expect(manifest.cases.sha256).toBe(loadCases().sha256);

    const log = JSON.parse(readFileSync(join(dir, 't1', 'divorce.log.json'), 'utf8'));
    expect(log.eval).toMatchObject({ caseId: 'divorce', trial: 1, locale: 'en', translation: 'BSB', dryRun: true });
    expect(log.request).toMatchObject({ query: 'divorce', hint: { topic: 'divorce' }, regenerate: true, locale: 'en' });
    expect(log.researchCalls).toBe(1); // the scripted search ran against the real knowledge base
    expect(existsSync(join(dir, 't1', 'divorce.page.json'))).toBe(true);

    // an existing label is never overwritten
    expect(runner(['--dry-run', '--label', 'dry', '--max-usd', '3', '--out', out]).status).toBe(2);

    const second = runner(['--dry-run', '--label', 'dry', '--max-usd', '1', '--resume', '--cases', 'divorce,a-keller,a-genese-readers-fr', '--out', out]);
    expect(second.status).toBe(0);
    manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
    expect(manifest.invocations).toBe(2);
    expect(manifest.stopped).toBeNull();
    expect(manifest.runs.map((r: { caseId: string }) => r.caseId)).toEqual(['divorce', 'genesis-1', 'a-keller', 'a-genese-readers-fr']);

    // and the free scorer reads what the runner wrote
    const s = scoreDir(dir, loadCases());
    const flows = byFlow(s.runs);
    expect(flows.compose).toMatchObject({ runs: 2, completed: 0 });
    expect(flows.answer).toMatchObject({ runs: 2, completed: 2, decline: { ok: 1, of: 1 } });
    expect(flows.compose.totalCostUsd).toBeCloseTo(manifest.runs.slice(0, 2).reduce((n: number, r: { costUsd: number }) => n + r.costUsd, 0), 6);
  });
});
