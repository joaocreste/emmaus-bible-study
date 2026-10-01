import { describe, expect, it } from 'vitest';
import type { PipelineStep } from '../../../domain/models';
import { readerTrace } from '../readerTrace';

const MAT19 = { book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 9 };

describe('what an answer drew on (reader view of the trace)', () => {
  it('lists the kinds of sources consulted, in a fixed order, without routing, models, budgets or checks', () => {
    const trace: PipelineStep[] = [
      { stage: 'Intent', detail: 'open-topic · topic “divorce”', provider: 'engine:inference' },
      { stage: 'Routing', detail: 'No curated study — composing', provider: 'engine:inference' },
      { stage: 'Model', detail: 'claude-opus-5 is planning', provider: 'anthropic:claude-opus-5', reader: { kind: 'planning' } },
      { stage: 'Commentary', detail: 'Reading Tyndale on Matthew 19:3–9', reader: { kind: 'commentary', refs: [MAT19] } },
      { stage: 'Scripture', detail: 'Reading Matthew 19:3–9 (BSB)', reader: { kind: 'scripture', refs: [MAT19] } },
      { stage: 'Lexicon', detail: 'Looking up G630', reader: { kind: 'words' } },
      { stage: 'Search', detail: 'Searching Baptist texts', reader: { kind: 'search' } },
      { stage: 'Budget', detail: 'Research budget reached (16 lookups)' },
      { stage: 'Check', detail: 'The page header did not pass the source checks' },
      { stage: 'Compose', detail: 'Started the page “Divorce”', provider: 'inference:compose', reader: { kind: 'writing', title: 'Divorce' } },
    ];
    expect(readerTrace(trace)).toEqual({ sources: ['scripture', 'original', 'commentary', 'research'], passages: [MAT19], morePassages: 0, generated: true });
  });

  it('marks library answers as assembled without generative AI', () => {
    const r = readerTrace([
      { stage: 'Intent', detail: 'open-passage', provider: 'engine:intent' },
      { stage: 'Library', detail: 'romans-8', provider: 'curated:studies' },
      { stage: 'Cross-references', detail: '18 explained', provider: 'curated:romans-8' },
      { stage: 'Synthesis', detail: 'Templated reply over 7 cited sources (no generative model)', provider: 'engine:templates' },
    ]);
    expect(r).toEqual({ sources: ['cross-references', 'library'], passages: [], morePassages: 0, generated: false });
  });

  it('names at most six passages', () => {
    const refs = Array.from({ length: 8 }, (_, i) => ({ book: 'PSA', startChapter: i + 1 }));
    const r = readerTrace([{ stage: 'Scripture', detail: 'x', reader: { kind: 'scripture', refs } }]);
    expect(r.passages).toHaveLength(6);
    expect(r.morePassages).toBe(2);
  });
});
