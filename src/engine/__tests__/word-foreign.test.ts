/**
 * "The Greek word behind X" asked with a word of the reader's language: the tagged word every
 * verse containing it shares, checked across the chapter (engine/respond/word.ts, alignByVerses).
 */
import { describe, expect, it } from 'vitest';
import { LOCALES, type Locale } from '../../i18n/locales';
import { createCuratedProviders } from '../../providers/curated';
import { createLocalDatasetProviders } from '../../providers/local';
import { createFsLoader } from '../../providers/local/__tests__/fsLoader';
import type { ProviderRegistry } from '../../providers/types';
import { StudyAssembler, type TopicMatchLike } from '../assemble';
import { LocalStudyEngine } from '../LocalStudyEngine';

const curated = createCuratedProviders();
const providers: ProviderRegistry = { ...createLocalDatasetProviders({ loader: createFsLoader(), allowRemoteFallback: false }), ...curated };
const assembler = new StudyAssembler(providers);

async function askInTopic(locale: Locale, topicId: string, question: string) {
  const topics = (await providers.topics.listTopics(locale)) as TopicMatchLike[];
  const match = topics.find((t) => t.id === topicId);
  if (!match) throw new Error(`no topic ${topicId}`);
  const study = assembler.libraryTopic(match, { locale, translation: LOCALES[locale].defaultTranslation });
  const engine = new LocalStudyEngine(providers);
  return engine.respond(question, { study, history: [], conversation: {}, translation: LOCALES[locale].defaultTranslation, locale });
}

describe('word behind a term in the reader’s language', () => {
  it.each([
    ['pt', 'Qual é a palavra grega por trás de “orar”?', 'identificada pelos versículos'],
    ['es', '¿Qué palabra griega hay detrás de “orar”?', 'identificada por los versículos'],
    ['fr', 'Quel est le mot grec derrière « prier » ?', 'identifié par les versets'],
  ] as const)('%s: the prayer topic’s “pray” is προσεύχομαι (G4336), matched by its verses', async (locale, question, matchedBy) => {
    const r = await askInTopic(locale, 'prayer', question);
    expect(r.intent.kind).toBe('word-study');
    expect(r.reply.declined).toBeFalsy();
    expect(r.reply.text).toContain('προσεύχομαι');
    expect(r.reply.text).toContain('G4336');
    expect(r.reply.text).toContain(matchedBy);
    expect(r.inspector).toMatchObject({ type: 'word', strong: expect.stringMatching(/^G4336/) });
    expect(r.reply.citations?.map((c) => c.sourceId)).toEqual(expect.arrayContaining([expect.stringMatching(/tbesg|lexicon|stepbible/i)]));
  });

  it('matches the forms the Bible uses (Spanish “predestinar” → predestinado, προορίζω)', async () => {
    const r = await askInTopic('es', 'predestination', '¿Cuál es la palabra griega para “predestinar”?');
    expect(r.reply.text).toContain('G4309');
  });

  it('stays honest when the verses do not single out one word (Reina-Valera’s “reino” in Mark 1:14 follows another Greek text)', async () => {
    const r = await askInTopic('es', 'kingdom-of-god', '¿Cuál es la palabra griega para “reino”?');
    expect(r.reply.text).not.toContain('εὐαγγέλιον');
  });
});
