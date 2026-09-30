/**
 * Engine behaviour over the REAL curated library (src/data/curated). Each block
 * skips when its modules are not present, so this file stays green while the
 * content is being written. Dataset providers are empty stand-ins, so only the
 * curated layers are exercised.
 */
import { describe, expect, it } from 'vitest';
import type { ConversationState, Study } from '../../domain/models';
import { createCuratedProviders } from '../../providers/curated';
import type { ProviderRegistry } from '../../providers/types';
import { LocalStudyEngine } from '../LocalStudyEngine';
import type { EngineContext, EngineResult } from '../types';
import { createEmptyDatasetProviders } from './fixtures/providers';

const curated = createCuratedProviders();
const providers: ProviderRegistry = { ...createEmptyDatasetProviders(), ...curated };
const studies = curated.studies.list();
const hasRomans8 = Boolean(curated.studies.get('romans-8'));

function ctx(study: Study | null = null, conversation: ConversationState = {}): EngineContext {
  return { study, history: [], conversation, translation: 'BSB' };
}

async function openRomans8(): Promise<{ engine: LocalStudyEngine; study: Study }> {
  const engine = new LocalStudyEngine(providers);
  const r = await engine.respond('Romans 8', ctx());
  return { engine, study: r.study! };
}

async function followUp(engine: LocalStudyEngine, study: Study, messages: string[]): Promise<EngineResult[]> {
  let conversation: ConversationState = {};
  const out: EngineResult[] = [];
  for (const m of messages) {
    const r = await engine.respond(m, ctx(study, conversation));
    conversation = r.conversation;
    out.push(r);
  }
  return out;
}

const SPEC_FOLLOW_UPS = [
  'What does Paul mean by flesh here?',
  'Show me other passages where this idea appears.',
  'What is the Greek word behind ‘grace’?',
  'What did Tim Keller say about this?',
  'How would the original audience have understood this?',
  'How does this connect with Romans?',
  'Explain verse 12 in more detail.',
  'Are there different theological interpretations of this passage?',
  'What does condemnation mean?',
  'Show me what Tim Keller says about this',
  'Where else does Paul talk about this?',
  'What does grace mean in this verse?',
];

describe.skipIf(!hasRomans8)('Romans 8 over the real curated study (spec §20)', () => {
  it('"Romans 8" loads the curated study', async () => {
    const { study } = await openRomans8();
    expect(study).toMatchObject({ id: 'romans-8', depth: 'curated', kind: 'passage' });
  });

  it('"What does condemnation mean?" updates and highlights the linguistic section', async () => {
    const { engine, study } = await openRomans8();
    const [r] = await followUp(engine, study, ['What does condemnation mean?']);
    expect(r.intent.kind).toBe('word-study');
    expect(r.focus?.section).toBe('original-languages');
    expect(r.focus?.highlightWordIds?.length).toBeGreaterThan(0);
    expect(r.focus?.highlightVerses?.length).toBeGreaterThan(0);
  });

  it('"Show me what Tim Keller says about this" brings commentary into focus — or declines honestly', async () => {
    const { engine, study } = await openRomans8();
    const [, r] = await followUp(engine, study, ['What does condemnation mean?', 'Show me what Tim Keller says about this']);
    expect(r.intent).toMatchObject({ kind: 'commentary', slots: { authorId: 'tim-keller' } });
    expect(r.focus?.section).toBe('commentary');
    const hasKeller = study.commentary.some((c) => c.authorId === 'tim-keller');
    if (hasKeller) expect(r.focus?.commentaryAuthorIds).toEqual(['tim-keller']);
    else expect(r.reply.text).toMatch(/won’t put words in his mouth/);
  });

  it('"Where else does Paul talk about this?" prioritises Pauline cross-references', async () => {
    const { engine, study } = await openRomans8();
    const [, r] = await followUp(engine, study, ['What does condemnation mean?', 'Where else does Paul talk about this?']);
    expect(r.intent).toMatchObject({ kind: 'cross-references', slots: { traditionalAuthor: 'Paul' } });
    expect(r.focus?.section).toBe('cross-references');
    expect(r.focus?.crossReferenceFilter?.author).toBe('Paul');
  });

  it.each(SPEC_FOLLOW_UPS)('"%s" is understood (non-unknown intent)', async (q) => {
    const { engine, study } = await openRomans8();
    const [r] = await followUp(engine, study, [q]);
    expect(r.intent.kind).not.toBe('unknown');
    expect(r.reply.suggestions!.length).toBeGreaterThanOrEqual(2);
  });
});

describe.skipIf(studies.length === 0)('every curated study', () => {
  for (const s of studies) {
    it(`${s.id}: opens by id, resolves its sources, and understands its suggested questions`, async () => {
      const engine = new LocalStudyEngine(providers);
      const opened = await engine.openStudy({ studyId: s.id }, ctx());
      expect(opened.study).toMatchObject({ id: s.id, depth: 'curated' });
      for (const id of opened.study!.sourceIds) expect(curated.sources.getSource(id), `source "${id}"`).toBeDefined();
      for (const q of s.suggestedQuestions) {
        const r = await engine.respond(q, ctx(opened.study!));
        expect(r.intent.kind, q).not.toBe('unknown');
      }
    });

    it(`${s.id}: named-author questions focus commentary or decline honestly`, async () => {
      const engine = new LocalStudyEngine(providers);
      const opened = await engine.openStudy({ studyId: s.id }, ctx());
      const r = await engine.respond('What did Tim Keller say about this?', ctx(opened.study!));
      expect(r.focus?.section).toBe('commentary');
    });
  }
});

const topicsPromise = curated.topics.listTopics();

describe('topic index (real data)', () => {
  it('every topic opens a study by its name', async () => {
    const topics = await topicsPromise;
    const engine = new LocalStudyEngine(providers);
    for (const t of topics) {
      const r = await engine.respond(t.name, ctx());
      expect(r.study, t.name).toBeDefined();
      expect(r.study!.kind === 'topic' || r.study!.depth === 'curated', t.name).toBe(true);
    }
  });
});

describe('topic index suggested questions (real data)', () => {
  it('are answered from grounded content without switching away from the topic', async () => {
    const topics = await topicsPromise;
    if (topics.length === 0) return;
    const engine = new LocalStudyEngine(providers);
    let total = 0;
    let unknown = 0;
    for (const t of topics) {
      const opened = await engine.respond(t.name, ctx());
      const study = opened.study!;
      for (const q of study.suggestedQuestions) {
        const r = await engine.respond(q, ctx(study));
        total++;
        if (r.intent.kind === 'unknown') unknown++;
        expect(r.study?.id ?? study.id, `${t.name}: ${q}`).toBe(study.id);
        expect(r.reply.suggestions!.length, q).toBeGreaterThanOrEqual(2);
      }
    }
    // a handful of open questions may be declined honestly; most must be answered
    expect(unknown / Math.max(1, total)).toBeLessThanOrEqual(0.1);
  });
});
