/**
 * Debug log per run (.kb-cache/logs/<iso>-<slug>.json): the request, the evidence
 * ledger, every tool call with its input, the validator's decisions, usage per model
 * turn (incl. cache reads), timings and stop reasons. Never contains credentials.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Evidence, InferenceErrorCode } from '../../src/inference/protocol';
import type { TurnRecord } from './loop';
import { slugify } from './text';
import type { Rejection } from './validate';

export interface ToolCallLog {
  turn: number;
  id: string;
  name: string;
  input: unknown;
  isError: boolean;
  /** evidence ids the call added or returned */
  evidence: string[];
  /** first part of the tool result the model saw */
  result: string;
  ms: number;
}

export interface DecisionLog {
  turn: number;
  tool: string;
  section?: string;
  mode?: string;
  accepted: number;
  rejected: Rejection[];
  warnings: string[];
  notes: string[];
}

export interface RunLog {
  flow: 'compose' | 'answer';
  /** request as received (answer: the open study is reduced to its id and title) */
  request: unknown;
  studyId: string;
  model: string;
  /** the model that answered the last turn (differs from `model` after a server-side fallback) */
  modelUsed?: string;
  /** turns served by a fallback model */
  fallbackTurns?: number;
  /** knowledge-base and generator versions (the page-cache fingerprint) */
  versions?: { kb: string; generator: string };
  effort: string;
  budgets: { maxResearchCalls: number; researchMs: number; totalMs: number; maxTurns: number };
  startedAt: string;
  durationMs: number;
  cached: boolean;
  outcome: {
    end: string;
    /** `upstream`: the provider's own error text (with its request id) — kept here, never sent to the reader */
    error?: { code: InferenceErrorCode; message: string; upstream?: string };
    /** an API error after which the checked sections were kept (the page was finalised with a caution note) */
    interruption?: { code: InferenceErrorCode; message: string; upstream?: string };
  };
  researchCalls: number;
  ledger: Evidence[];
  toolCalls: ToolCallLog[];
  decisions: DecisionLog[];
  turns: TurnRecord[];
  /** summed over every turn (and, per turn, over usage.iterations: declined and fallback attempts included) */
  usage: { input: number; output: number; cacheRead: number; cacheCreation: number };
  /** progress steps as the reader saw them */
  steps: { stage: string; detail: string; provider?: string; atMs: number }[];
}

export type RunLogWriter = (log: RunLog) => Promise<string | null>;

/** Writes one JSON file per run into `dir`; returns its path (null on failure — logging never breaks a run). */
export function createRunLogWriter(dir: string): RunLogWriter {
  return async (log) => {
    try {
      await mkdir(dir, { recursive: true });
      const iso = log.startedAt.replace(/[:.]/g, '-');
      const label = log.flow === 'answer' ? `answer-${String((log.request as { question?: string })?.question ?? '')}` : String((log.request as { query?: string })?.query ?? '');
      const file = join(dir, `${iso}-${slugify(label, 48)}.json`);
      await writeFile(file, JSON.stringify(log, null, 2), 'utf8');
      return file;
    } catch {
      return null;
    }
  };
}
