import type { PassageRef, PipelineStep } from '../../domain/models';
import { refKey } from '../../domain/reference';

/** What an answer drew on, in the reader's terms (one line each, in this order). */
export type TraceSource =
  | 'scripture'
  | 'original'
  | 'cross-references'
  | 'commentary'
  | 'context'
  | 'literary'
  | 'theology'
  | 'topics'
  | 'research'
  | 'sermons'
  | 'library';

const ORDER: TraceSource[] = ['scripture', 'original', 'cross-references', 'commentary', 'context', 'literary', 'theology', 'topics', 'research', 'sermons', 'library'];

/**
 * Pipeline stage → what it consulted. Stages that only route, check, budget or name the model
 * (Intent, Routing, Model, Check, Budget, Cache, Synthesis, Compose…) are not sources.
 */
const BY_STAGE: Record<string, TraceSource> = {
  Scripture: 'scripture',
  Verse: 'scripture',
  'Original text': 'original',
  Lexicon: 'original',
  'Key words': 'original',
  'Cross-references': 'cross-references',
  Dataset: 'cross-references',
  Commentary: 'commentary',
  'Classic commentary': 'commentary',
  'Study notes': 'commentary',
  'Verse notes': 'commentary',
  Author: 'commentary',
  'Historical context': 'context',
  Introduction: 'context',
  'Literary context': 'literary',
  Theology: 'theology',
  Perspectives: 'theology',
  Topic: 'topics',
  'Topic index': 'topics',
  Topics: 'topics',
  Search: 'research',
  Research: 'research',
  Sermons: 'sermons',
  Library: 'library',
  Study: 'library',
  'Key passages': 'library',
  'Concept index': 'library',
  'Study search': 'library',
  Assembly: 'library',
};

/** Passages named before "and N more". */
const MAX_PASSAGES = 6;

export interface ReaderTrace {
  sources: TraceSource[];
  /** Bible passages the composition read (live answers), in order, at most MAX_PASSAGES */
  passages: PassageRef[];
  morePassages: number;
  /** written by the inference layer from those sources (otherwise assembled without a generative model) */
  generated: boolean;
}

/** An answer's pipeline as the reader sees it: what it drew on — never providers, scores, models or checks. */
export function readerTrace(trace: readonly PipelineStep[]): ReaderTrace {
  const found = new Set<TraceSource>();
  const passages = new Map<string, PassageRef>();
  let generated = false;
  for (const step of trace) {
    if (step.provider === 'inference:compose' || step.provider === 'inference:answer' || step.stage === 'Compose') generated = true;
    const source = BY_STAGE[step.stage];
    if (source) found.add(source);
    const r = step.reader;
    if (r && (r.kind === 'scripture' || r.kind === 'original' || r.kind === 'commentary' || r.kind === 'cross-references')) {
      for (const p of r.refs) passages.set(refKey(p), p);
    }
  }
  const all = [...passages.values()];
  return {
    sources: ORDER.filter((s) => found.has(s)),
    passages: all.slice(0, MAX_PASSAGES),
    morePassages: Math.max(0, all.length - MAX_PASSAGES),
    generated,
  };
}
