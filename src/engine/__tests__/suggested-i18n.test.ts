/**
 * Every suggested question of every curated study and topic, asked in Portuguese, Spanish
 * and French inside that study, is understood: it never classifies as "unknown", and it is
 * never declined unless its English counterpart is declined too (docs/I18N.md §6).
 */
import { describe, expect, it } from 'vitest';
import type { Study } from '../../domain/models';
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

type Foreign = Exclude<Locale, 'en'>;
const FOREIGN: Foreign[] = ['pt', 'es', 'fr'];

/** The curated study, or the assembled topic study, in one language. */
async function studiesIn(locale: Locale): Promise<Map<string, Study>> {
  const out = new Map<string, Study>();
  for (const s of curated.studies.list(locale)) out.set(s.id, assembler.fromCurated(s, locale));
  const topics = (await providers.topics.listTopics(locale)) as TopicMatchLike[];
  for (const m of topics) {
    const study = assembler.libraryTopic(m, { locale, translation: LOCALES[locale].defaultTranslation });
    out.set(`topic:${m.id}`, study);
  }
  return out;
}

async function ask(locale: Locale, study: Study, question: string) {
  const engine = new LocalStudyEngine(providers);
  return engine.respond(question, { study, history: [], conversation: {}, translation: LOCALES[locale].defaultTranslation, locale });
}

describe('suggested questions are understood in every language', () => {
  it('no suggested question is "unknown" or declined where English is not', async () => {
    const english = await studiesIn('en');
    const failures: string[] = [];
    for (const locale of FOREIGN) {
      const foreign = await studiesIn(locale);
      for (const [id, study] of foreign) {
        const en = english.get(id);
        const questions = study.suggestedQuestions ?? [];
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const r = await ask(locale, study, q);
          if (r.intent.kind === 'unknown') {
            failures.push(`${locale} ${id} [unknown] ${q}`);
            continue;
          }
          const enQ = en && en.suggestedQuestions.length === questions.length ? en.suggestedQuestions[i] : undefined;
          const enR = en && enQ ? await ask('en', en, enQ) : undefined;
          // "the Greek word behind X" keeps its term in every language
          if (enR?.intent.kind === 'word-study' && enR.intent.slots.term && r.intent.kind === 'word-study' && !r.intent.slots.term) {
            failures.push(`${locale} ${id} [word-study without term] ${q}`);
          }
          if (r.reply.declined && !enR?.reply.declined) failures.push(`${locale} ${id} [declined ${r.intent.kind}] ${q}`);
        }
      }
    }
    expect(failures).toEqual([]);
  }, 300_000);
});
