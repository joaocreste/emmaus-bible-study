/**
 * Curated providers in the reader's language (docs/I18N.md §4): translation
 * overlays applied by list/get/findByPassage/findByTopic and by the topic index,
 * topic queries matched in the reader's language and in English (accents
 * optional), localized sermon topics and author names. Small fake overlays over
 * the engine fixtures — never real content.
 */
import { describe, expect, it } from 'vitest';
import type { CuratedStudy } from '../../../domain/models';
import { parseRefKey } from '../../../domain/reference';
import type { StudyOverlay, TopicOverlay } from '../../../data/curated/i18n/types';
import { collectOverlays, createCuratedProviders, createCuratedProvidersFrom, type CuratedTopicMatch } from '..';
import { FIXTURE_ANXIETY, FIXTURE_GRACE, FIXTURE_ROMANS_8 } from '../../../engine/__tests__/fixtures/studies';

const PT_ROMANS: StudyOverlay = {
  studyId: 'fixture-romans-8',
  locale: 'pt',
  title: 'Romanos 8',
  subtitle: '[fixture] Vida no Espírito',
  matchTopics: ['nenhuma condenação', 'vida no espírito'],
  suggestedQuestions: ['O que significa condenação?'],
  keyWords: { 'kw-katakrima': { english: 'condenação', basicMeaning: '[fixture] condenação' } },
  concepts: { 'concept-condemnation': { label: 'Condenação', aliases: ['condenação', 'nenhuma condenação'], answer: '[fixture] Resposta.' } },
};
const PT_GRACE: StudyOverlay = {
  studyId: 'fixture-grace',
  locale: 'pt',
  title: 'Graça',
  matchTopics: ['graça', 'favor imerecido'],
  topic: { name: 'Graça', definition: '[fixture] Definição.' },
  topicPassages: { 'kp-eph-2': { title: 'Salvos pela graça', note: '[fixture] Nota.' } },
};
const ES_GRACE: StudyOverlay = { studyId: 'fixture-grace', locale: 'es', title: 'Gracia', matchTopics: ['gracia', 'favor inmerecido'], topic: { name: 'Gracia' } };
const FR_GRACE: StudyOverlay = { studyId: 'fixture-grace', locale: 'fr', title: 'Grâce', matchTopics: ['grâce', 'faveur imméritée'], topic: { name: 'Grâce' } };
const PT_ANXIETY: TopicOverlay = { topicId: 'fixture-anxiety', locale: 'pt', name: 'Ansiedade', aliases: ['ansiedade', 'preocupação', 'estar ansioso'] };

const p = createCuratedProvidersFrom({
  studies: [FIXTURE_ROMANS_8, FIXTURE_GRACE],
  topics: [FIXTURE_ANXIETY],
  overlays: { studies: [PT_ROMANS, PT_GRACE, ES_GRACE, FR_GRACE], topics: [PT_ANXIETY] },
});
const ref = (k: string) => parseRefKey(k)!;

describe('CuratedStudyRepository — in the reader’s language', () => {
  it('English stays untouched', () => {
    const en = p.studies.get('fixture-romans-8');
    expect(en).toBe(FIXTURE_ROMANS_8);
    expect(en?.localization).toBeUndefined();
    expect(p.studies.list().map((s) => s.title).sort()).toEqual(['Grace', 'Romans 8']);
    expect(p.studies.get('fixture-grace', 'en')?.title).toBe('Grace');
  });

  it('applies the overlay and marks the study as translated from English', () => {
    const pt = p.studies.get('fixture-romans-8', 'pt')!;
    expect(pt.title).toBe('Romanos 8');
    expect(pt.localization).toEqual({ locale: 'pt', translatedFrom: 'en' });
    expect(pt.keyWords.find((k) => k.id === 'kw-katakrima')?.english).toBe('condenação');
    // the English aliases stay next to the translated ones; references and ids never change
    expect(pt.concepts[0].aliases).toEqual(expect.arrayContaining(['condemnation', 'condenação']));
    expect(pt.match.references).toEqual(FIXTURE_ROMANS_8.match.references);
    expect(pt.id).toBe(FIXTURE_ROMANS_8.id);
  });

  it('a study without an overlay in that language is served in English, and says so', () => {
    const es = p.studies.get('fixture-romans-8', 'es')!;
    expect(es.title).toBe('Romans 8');
    expect(es.localization).toEqual({ locale: 'en' });
  });

  it('keeps one object per study and language', () => {
    expect(p.studies.get('fixture-grace', 'pt')).toBe(p.studies.get('fixture-grace', 'pt'));
    expect(p.studies.list('pt').find((s) => s.id === 'fixture-grace')).toBe(p.studies.get('fixture-grace', 'pt'));
  });

  it('list, findByPassage and findByTopic return the translated study', () => {
    expect(p.studies.list('pt').map((s) => s.title).sort()).toEqual(['Graça', 'Romanos 8']);
    expect(p.studies.list('es').map((s) => s.title).sort()).toEqual(['Gracia', 'Romans 8']);
    expect(p.studies.findByPassage(ref('ROM.8.28'), 'pt')?.title).toBe('Romanos 8');
    expect(p.studies.findByTopic('graça', 'pt')?.title).toBe('Graça');
  });

  it.each([
    ['graça', 'pt', 'Graça'],
    ['graca', 'pt', 'Graça'],
    ['GRAÇA', 'pt', 'Graça'],
    ['Grace', 'pt', 'Graça'],
    ['O que a Bíblia diz sobre a graça?', 'pt', 'Graça'],
    ['favor imerecido', 'pt', 'Graça'],
    ['nenhuma condenação', 'pt', 'Romanos 8'],
    ['Vida no Espírito', 'pt', 'Romanos 8'],
    ['gracia', 'es', 'Gracia'],
    ['¿Qué dice la Biblia sobre la gracia?', 'es', 'Gracia'],
    ['la grâce', 'fr', 'Grâce'],
    ['grace', 'fr', 'Grâce'],
  ] as const)('findByTopic(%s, %s) → %s', (query, locale, title) => {
    expect(p.studies.findByTopic(query, locale)?.title).toBe(title);
  });

  it('a query in another language than the reader’s still finds the study (served in the reader’s language)', () => {
    expect(p.studies.findByTopic('graça')?.title).toBe('Grace');
    expect(p.studies.findByTopic('gracia', 'pt')?.title).toBe('Graça');
  });

  it('unrelated queries still find nothing', () => {
    expect(p.studies.findByTopic('física quântica', 'pt')).toBeUndefined();
    expect(p.studies.findByTopic('', 'pt')).toBeUndefined();
  });
});

describe('TopicProvider — in the reader’s language', () => {
  it('lists translated names', async () => {
    const all = await p.topics.listTopics('pt');
    expect(all.map((t) => t.name).sort()).toEqual(['Ansiedade', 'Graça']);
    const en = await p.topics.listTopics();
    expect(en.map((t) => t.name).sort()).toEqual(['Anxiety', 'Grace']);
  });

  it('matches translated aliases and English ones, accents optional', async () => {
    for (const q of ['preocupação', 'preocupacao', 'ansiedade', 'worry']) {
      const [top] = (await p.topics.findTopics(q, 'pt')) as CuratedTopicMatch[];
      expect(top?.id, q).toBe('fixture-anxiety');
      expect(top.name).toBe('Ansiedade');
      expect(top.entry?.name).toBe('Ansiedade');
    }
    const [grace] = await p.topics.findTopics('O que a Bíblia diz sobre a graça?', 'pt');
    expect(grace).toMatchObject({ id: 'fixture-grace', name: 'Graça', studyId: 'fixture-grace' });
    expect(grace.topic.keyPassages[0].title).toBe('Salvos pela graça');
  });

  it('falls back to every language’s aliases', async () => {
    const [top] = await p.topics.findTopics('ansiedade');
    expect(top).toMatchObject({ id: 'fixture-anxiety', name: 'Anxiety' });
    expect(await p.topics.findTopics('física quântica', 'pt')).toEqual([]);
  });
});

describe('SermonProvider — localized topics', () => {
  it('a topic named in Portuguese, Spanish or French finds the English-catalogued sermon', async () => {
    for (const topic of ['graça', 'gracia', 'grâce', 'grace']) {
      expect((await p.sermons.findSermons({ topic })).map((s) => s.id), topic).toEqual(['sermon-fixture']);
    }
    expect(await p.sermons.findSermons({ topic: 'ansiedade' })).toEqual([]);
  });
});

describe('SourceRegistry — authors as readers write them in pt/es/fr', () => {
  it.each([
    ['O que Agostinho disse sobre isso?', 'augustine'],
    ['¿Qué dijo Agustín?', 'augustine'],
    ['¿Qué dijo san Agustin?', 'augustine'],
    ["Qu'a dit saint Augustin ?", 'augustine'],
    ['E Calvino?', 'calvin'],
    ['Que dit Jean Calvin ?', 'calvin'],
    ['O que Lutero pensava?', 'luther'],
    ['Crisóstomo', 'chrysostom'],
    ['Jean Chrysostome', 'chrysostom'],
    ['Tomás de Aquino', 'aquinas'],
    ["Thomas d'Aquin", 'aquinas'],
    ['Wesley', 'wesley'],
  ])('findAuthor(%s) → %s', (text, id) => {
    expect(p.sources.findAuthor(text)?.id).toBe(id);
  });
  it('the localized names are aliases of the same author', () => {
    const a = p.sources.getAuthor('augustine')!;
    expect(a.name).toBe('Augustine of Hippo');
    expect(a.aliases).toEqual(expect.arrayContaining(['augustine', 'agostinho', 'agustín', 'augustin']));
  });
});

describe('overlay modules', () => {
  it('collectOverlays sorts study and topic overlays and skips malformed modules', () => {
    const got = collectOverlays({
      'a.ts': PT_ROMANS,
      'b.ts': PT_ANXIETY,
      'c.ts': { studyId: 'x' },
      'd.ts': { topicId: 'y', locale: 'de' },
      'e.ts': undefined,
      'f.ts': { ...PT_ROMANS, title: 'duplicate' },
    });
    expect(got.studies).toEqual([PT_ROMANS]);
    expect(got.topics).toEqual([PT_ANXIETY]);
  });

  it('the bundled library serves every study in every language (translated, or English marked as such)', () => {
    const bundled = createCuratedProviders();
    const en = bundled.studies.list();
    for (const locale of ['pt', 'es', 'fr'] as const) {
      const list = bundled.studies.list(locale);
      expect(list.map((s) => s.id)).toEqual(en.map((s) => s.id));
      for (const s of list as CuratedStudy[]) {
        expect(['en', locale], `${s.id} (${locale})`).toContain(s.localization?.locale);
        if (s.localization?.locale === locale) expect(s.localization.translatedFrom).toBe('en');
        const original = en.find((e) => e.id === s.id)!;
        expect(s.match.references).toEqual(original.match.references);
      }
    }
  });
});
