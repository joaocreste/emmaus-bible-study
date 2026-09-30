/**
 * Regressions found during integration, run over the real curated library and bundled datasets.
 */
import { describe, expect, it } from 'vitest';
import type { Study } from '../../domain/models';
import { createCuratedProviders } from '../../providers/curated';
import { createLocalDatasetProviders } from '../../providers/local';
import { createFsLoader } from '../../providers/local/__tests__/fsLoader';
import type { ProviderRegistry } from '../../providers/types';
import { LocalStudyEngine } from '../LocalStudyEngine';

const providers: ProviderRegistry = {
  ...createLocalDatasetProviders({ loader: createFsLoader(), allowRemoteFallback: false }),
  ...createCuratedProviders(),
};

async function ask(engine: LocalStudyEngine, message: string, study: Study | null = null) {
  return engine.respond(message, { study, history: [], conversation: {}, translation: 'BSB' });
}

describe('integration regressions', () => {
  it('an out-of-range chapter is named, not silently widened to the whole book', async () => {
    const engine = new LocalStudyEngine(providers);
    const r = await ask(engine, 'Romans 17');
    expect(r.study).toBeUndefined();
    expect(r.reply.text).toContain('Romans has 16 chapters');
    const gen = (await ask(engine, 'Genesis')).study!;
    expect((await ask(engine, 'Genesis 51', gen)).reply.text).toContain('Genesis has 50 chapters');
  });

  it('a relationship with no curated card offers the nearest explained connections, labelled honestly', async () => {
    const engine = new LocalStudyEngine(providers);
    const psalm = (await ask(engine, 'Psalm 23')).study!;
    const r = await ask(engine, 'Is Psalm 23 a prophecy about Jesus?', psalm);
    expect(r.reply.text).toMatch(/None of this study’s explained cross-references is classified as “prophecy → fulfilment”/);
    expect(r.focus?.section).toBe('cross-references');
    expect(r.focus?.pinIds?.length).toBeGreaterThan(0);
  });

  it('"What does the Greek word for flesh mean?" is a word study on σάρξ', async () => {
    const engine = new LocalStudyEngine(providers);
    const rom = (await ask(engine, 'Romans 8')).study!;
    const r = await ask(engine, 'What does the Greek word for flesh mean?', rom);
    expect(r.intent.kind).toBe('word-study');
    expect(r.focus?.section).toBe('original-languages');
    expect(r.reply.text).toContain('σάρξ');
  });

  it('declines, and flags the decline, when no verified source exists', async () => {
    const engine = new LocalStudyEngine(providers);
    const trinity = (await ask(engine, 'The Trinity')).study!;
    const r = await ask(engine, 'What did Augustine say?', trinity);
    expect(r.reply.declined).toBe(true);
    expect(r.reply.text).toMatch(/won’t put words in/);
  });

  it('compact author names keep epithets ("John of Damascus", not "John")', async () => {
    const { shortName } = await import('../respond/commentary');
    expect(shortName({ id: 'x', name: 'John of Damascus', era: 'medieval', tradition: '', description: '' })).toBe('John of Damascus');
    expect(shortName({ id: 'y', name: 'Justin Martyr', era: 'early-church', tradition: '', description: '' })).toBe('Justin Martyr');
    expect(shortName({ id: 'z', name: 'Charles H. Spurgeon', era: 'modern', tradition: '', description: '' })).toBe('Spurgeon');
  });
});
