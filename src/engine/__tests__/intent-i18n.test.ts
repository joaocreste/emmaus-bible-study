/**
 * Multilingual intent classification (docs/I18N.md §6): the spec's opening
 * requests and follow-up questions in Portuguese, Spanish and French, with the
 * reader's language given (EngineContext.locale) or detected from the message.
 */
import { describe, expect, it } from 'vitest';
import type { ConversationState, Study } from '../../domain/models';
import { refKey } from '../../domain/reference';
import type { Locale } from '../../i18n/locales';
import type { StudyOverlay } from '../../data/curated/i18n/types';
import { createCuratedProvidersFrom } from '../../providers/curated';
import { StudyAssembler } from '../assemble';
import { classifyMessage, type ClassifierEnv } from '../intent';
import { findConcept, findKeyWord, findTermInStudies, searchStudy } from '../search';
import { detectLocale, normalizeTopicQuery, restoreSpelling } from '../text';
import type { IntentKind } from '../types';
import { createFakeProviders } from './fixtures/providers';
import { FIXTURE_ROMANS_8 } from './fixtures/studies';

const providers = createFakeProviders();
const romans8: Study = new StudyAssembler(providers).fromCurated(FIXTURE_ROMANS_8);
const KNOWN_TOPICS = [
  'grace', 'graça', 'gracia', 'grâce', 'wealth', 'riqueza', 'richesse', 'suffering', 'sofrimento', 'sufrimiento', 'souffrance',
  'forgiveness', 'perdão', 'perdón', 'pardon', 'hope', 'esperança', 'esperanza', 'espérance', 'marriage', 'casamento', 'matrimonio', 'mariage',
].map((t) => normalizeTopicQuery(t));

function env(study: Study | null, conversation: ConversationState = {}, locale?: Locale): ClassifierEnv {
  return {
    study,
    conversation,
    findAuthor: (t) => providers.sources.findAuthor(t),
    isKnownTopic: (p) => KNOWN_TOPICS.includes(p),
    ...(locale ? { locale } : {}),
  };
}

const CONV: ConversationState = { activeConceptId: 'concept-condemnation', activeVerse: { book: 'ROM', chapter: 8, verse: 1 } };

type Row = [message: string, kind: IntentKind, slots: Record<string, unknown>];

/** Expected slots may name a passage/verse by reference key ("ROM.8", "ROM.8.12"). */
function check(msg: string, study: Study | null, locale: Locale | undefined, kind: IntentKind, slots: Record<string, unknown>) {
  const p = classifyMessage(msg, env(study, study ? CONV : {}, locale));
  expect(p.intent.kind, `${msg} → kind`).toBe(kind);
  const { passage, verse, ...rest } = slots;
  if (passage) expect(refKey(p.intent.slots.passage!), `${msg} → passage`).toBe(passage);
  if (verse) {
    const v = p.intent.slots.verse!;
    expect(`${v.book}.${v.chapter}.${v.verse}`, `${msg} → verse`).toBe(verse);
  }
  expect(p.intent.slots, msg).toMatchObject(rest);
  return p;
}

/* ------------------------------------------------------------------ */
/* Português                                                           */
/* ------------------------------------------------------------------ */

const PT_OPEN: Row[] = [
  ['estudar Romanos 8', 'open-passage', { passage: 'ROM.8' }],
  ['Romanos 8', 'open-passage', { passage: 'ROM.8' }],
  ['Vamos estudar João 1', 'open-passage', { passage: 'JHN.1' }],
  ['Quero ler o Salmo 23', 'open-passage', { passage: 'PSA.23' }],
  ['Romanos capítulo 12', 'open-passage', { passage: 'ROM.12' }],
  ['Gênesis', 'open-passage', { passage: 'GEN' }],
  ['Oi, podemos estudar Romanos 8?', 'open-passage', { passage: 'ROM.8' }],
  ['Romanos 17', 'open-passage', { invalidChapter: { book: 'ROM', chapter: 17 } }],
  ['graça', 'open-topic', { topic: 'graça' }],
  ['O que a Bíblia diz sobre riqueza?', 'open-topic', { topic: 'riqueza' }],
  ['Por que Deus permite o sofrimento?', 'open-topic', { topic: 'sofrimento' }],
  ['Fale sobre o perdão', 'open-topic', { topic: 'perdão' }],
  ['o que é a graça?', 'open-topic', { topic: 'graça' }],
  ['Olá', 'greeting', {}],
  ['O que você pode fazer?', 'help', {}],
];

const PT_FOLLOW_UPS: Row[] = [
  ['O que significa condenação?', 'word-study', { term: 'condenação' }],
  ["Qual é a palavra grega por trás de 'graça'?", 'word-study', { term: 'graça', language: 'greek' }],
  ['Qual é a palavra grega por trás de “graça”?', 'word-study', { term: 'graça', language: 'greek' }],
  ['O que Paulo quer dizer com carne aqui?', 'word-study', { term: 'carne' }],
  ['O que significa graça neste versículo?', 'word-study', { term: 'graça', verse: 'ROM.8.1' }],
  ['Onde mais Paulo fala disso?', 'cross-references', { traditionalAuthor: 'Paul' }],
  ['Mostre outras passagens onde essa ideia aparece.', 'cross-references', {}],
  ['Mostre as referências cruzadas', 'cross-references', {}],
  ['Como isso se relaciona com Romanos?', 'connect', { bookFilter: 'ROM' }],
  ['Qual é a relação disso com Gênesis?', 'connect', { bookFilter: 'GEN' }],
  ['Como isso se relaciona com Gênesis 1?', 'connect', { passage: 'GEN.1' }],
  ['O que Tim Keller disse sobre isso?', 'commentary', { authorId: 'tim-keller' }],
  ['O que Agostinho disse sobre isso?', 'commentary', { authorId: 'augustine' }],
  ['E Calvino?', 'commentary', { authorId: 'calvin' }],
  ['O que os comentaristas clássicos dizem?', 'commentary', {}],
  ['Como os leitores originais entenderiam isso?', 'historical-context', {}],
  ['Qual é o contexto histórico?', 'historical-context', {}],
  ['Quem escreveu isso?', 'historical-context', {}],
  ['Qual é a estrutura desta passagem?', 'literary-context', {}],
  ['O que esta passagem ensina sobre o Espírito?', 'theology', { term: 'espírito' }],
  ['Existem interpretações teológicas diferentes?', 'perspectives', {}],
  ['Explique o versículo 12', 'explain-verse', { verse: 'ROM.8.12' }],
  ['Explique os versículos 12 a 14', 'explain-verse', { passage: 'ROM.8.12-14' }],
  ['O que significa 8:28?', 'explain-verse', { verse: 'ROM.8.28' }],
  ['Romanos 8:28', 'explain-verse', { verse: 'ROM.8.28' }],
  ['Quais são as palavras-chave desta passagem?', 'word-study', {}],
  ['De onde vem isso?', 'sources', {}],
];

describe('classifyMessage — Português (no study open)', () => {
  it.each(PT_OPEN)('%s → %s', (msg, kind, slots) => {
    check(msg, null, 'pt', kind, slots);
  });
});

describe('classifyMessage — Português, follow-ups inside Romans 8', () => {
  it.each(PT_FOLLOW_UPS)('%s → %s', (msg, kind, slots) => {
    check(msg, romans8, 'pt', kind, slots);
  });
  it('"o último versículo" is flagged for the engine to resolve', () => {
    expect(classifyMessage('Explique o último versículo', env(romans8, {}, 'pt')).lastVerse).toBe(true);
  });
  it('the cue form keeps English cue words for the responders', () => {
    const p = classifyMessage('Como os leitores originais entenderiam isso?', env(romans8, CONV, 'pt'));
    expect(p.lower).toMatch(/\boriginal readers\b/);
    expect(p.locale).toBe('pt');
  });
});

/* ------------------------------------------------------------------ */
/* Español                                                             */
/* ------------------------------------------------------------------ */

const ES_OPEN: Row[] = [
  ['abre Juan 1', 'open-passage', { passage: 'JHN.1' }],
  ['Estudiar Romanos 8', 'open-passage', { passage: 'ROM.8' }],
  ['Quiero estudiar el Salmo 23', 'open-passage', { passage: 'PSA.23' }],
  ['¿Qué dice la Biblia sobre la riqueza?', 'open-topic', { topic: 'riqueza' }],
  ['¿Por qué Dios permite el sufrimiento?', 'open-topic', { topic: 'sufrimiento' }],
  ['gracia', 'open-topic', { topic: 'gracia' }],
  ['Háblame del perdón', 'open-topic', { topic: 'perdón' }],
  ['¿Qué es la gracia?', 'open-topic', { topic: 'gracia' }],
  ['¡Hola!', 'greeting', {}],
  ['¿Qué puedes hacer?', 'help', {}],
];

const ES_FOLLOW_UPS: Row[] = [
  ['¿Qué significa condenación?', 'word-study', { term: 'condenación' }],
  ["¿Cuál es la palabra griega detrás de 'gracia'?", 'word-study', { term: 'gracia', language: 'greek' }],
  ['¿Qué quiere decir Pablo con carne aquí?', 'word-study', { term: 'carne' }],
  ['¿Dónde más habla Pablo de esto?', 'cross-references', { traditionalAuthor: 'Paul' }],
  ['Muéstrame otros pasajes donde aparece esta idea', 'cross-references', {}],
  ['¿Cómo se conecta con Génesis?', 'connect', { bookFilter: 'GEN' }],
  ['¿Qué relación tiene esto con Génesis?', 'connect', { bookFilter: 'GEN' }],
  ['¿Qué dijo Agustín?', 'commentary', { authorId: 'augustine' }],
  ['¿Qué dice Calvino sobre esto?', 'commentary', { authorId: 'calvin' }],
  ['¿Qué dijo Tim Keller sobre esto?', 'commentary', { authorId: 'tim-keller' }],
  ['¿Cómo lo habría entendido la audiencia original?', 'historical-context', {}],
  ['¿Quién escribió esto?', 'historical-context', {}],
  ['¿Cuál es la estructura?', 'literary-context', {}],
  ['¿Qué enseña este pasaje sobre el Espíritu?', 'theology', { term: 'espíritu' }],
  ['¿Hay diferentes interpretaciones?', 'perspectives', {}],
  ['Explica el versículo 12', 'explain-verse', { verse: 'ROM.8.12' }],
  ['¿Qué significa 8:28?', 'explain-verse', { verse: 'ROM.8.28' }],
  ['¿Cuáles son las palabras clave de este pasaje?', 'word-study', {}],
  ['¿De dónde viene esto?', 'sources', {}],
];

describe('classifyMessage — Español (no study open)', () => {
  it.each(ES_OPEN)('%s → %s', (msg, kind, slots) => {
    check(msg, null, 'es', kind, slots);
  });
});

describe('classifyMessage — Español, follow-ups inside Romans 8', () => {
  it.each(ES_FOLLOW_UPS)('%s → %s', (msg, kind, slots) => {
    check(msg, romans8, 'es', kind, slots);
  });
});

/* ------------------------------------------------------------------ */
/* Français                                                            */
/* ------------------------------------------------------------------ */

const FR_OPEN: Row[] = [
  ['étudier Jean 1', 'open-passage', { passage: 'JHN.1' }],
  ['Romains 8', 'open-passage', { passage: 'ROM.8' }],
  ['Ouvre le Psaume 23', 'open-passage', { passage: 'PSA.23' }],
  ['que dit la Bible sur la richesse ?', 'open-topic', { topic: 'richesse' }],
  ['pourquoi Dieu permet-il la souffrance ?', 'open-topic', { topic: 'souffrance' }],
  ['la grâce', 'open-topic', { topic: 'grâce' }],
  ["Parle-moi de l'espérance", 'open-topic', { topic: 'espérance' }],
  ["Qu'est-ce que la grâce ?", 'open-topic', { topic: 'grâce' }],
  ['Bonjour', 'greeting', {}],
  ['que peux-tu faire ?', 'help', {}],
];

const FR_FOLLOW_UPS: Row[] = [
  ['que signifie condamnation ?', 'word-study', { term: 'condamnation' }],
  ['quel est le mot grec derrière « grâce » ?', 'word-study', { term: 'grâce', language: 'greek' }],
  ['Que veut dire Paul par « chair » ici ?', 'word-study', { term: 'chair' }],
  ['où ailleurs Paul en parle-t-il ?', 'cross-references', { traditionalAuthor: 'Paul' }],
  ["Montre-moi d'autres passages où cette idée apparaît", 'cross-references', {}],
  ['quel lien avec la Genèse ?', 'connect', { bookFilter: 'GEN' }],
  ["Qu'a dit Augustin ?", 'commentary', { authorId: 'augustine' }],
  ['Que dit Calvin à ce sujet ?', 'commentary', { authorId: 'calvin' }],
  ["comment les premiers lecteurs l'auraient-ils compris ?", 'historical-context', {}],
  ['quelle est la structure ?', 'literary-context', {}],
  ["Qu'enseigne ce passage sur l'Esprit ?", 'theology', { term: 'esprit' }],
  ['y a-t-il des interprétations différentes ?', 'perspectives', {}],
  ['explique le verset 12', 'explain-verse', { verse: 'ROM.8.12' }],
  ['8.28', 'explain-verse', { verse: 'ROM.8.28' }],
  ['Romains 8.28', 'explain-verse', { verse: 'ROM.8.28' }],
  ['Quels sont les mots clés de ce passage ?', 'word-study', {}],
  ["D'où vient cette information ?", 'sources', {}],
];

describe('classifyMessage — Français (no study open)', () => {
  it.each(FR_OPEN)('%s → %s', (msg, kind, slots) => {
    check(msg, null, 'fr', kind, slots);
  });
});

describe('classifyMessage — Français, follow-ups inside Romans 8', () => {
  it.each(FR_FOLLOW_UPS)('%s → %s', (msg, kind, slots) => {
    check(msg, romans8, 'fr', kind, slots);
  });
});

/* ------------------------------------------------------------------ */
/* Language detection                                                  */
/* ------------------------------------------------------------------ */

describe('classifyMessage — without a reader locale the language is detected', () => {
  const rows: [string, IntentKind, Record<string, unknown>, Locale, Study | null][] = [
    ['O que significa condenação?', 'word-study', { term: 'condenação' }, 'pt', romans8],
    ['¿Qué significa condenación?', 'word-study', { term: 'condenación' }, 'es', romans8],
    ['que signifie condamnation ?', 'word-study', { term: 'condamnation' }, 'fr', romans8],
    ['Onde mais Paulo fala disso?', 'cross-references', { traditionalAuthor: 'Paul' }, 'pt', romans8],
    ['¿Dónde más habla Pablo de esto?', 'cross-references', { traditionalAuthor: 'Paul' }, 'es', romans8],
    ['où ailleurs Paul en parle-t-il ?', 'cross-references', { traditionalAuthor: 'Paul' }, 'fr', romans8],
    ['¿Qué dice la Biblia sobre la riqueza?', 'open-topic', { topic: 'riqueza' }, 'es', null],
    ['pourquoi Dieu permet-il la souffrance ?', 'open-topic', { topic: 'souffrance' }, 'fr', null],
    ['olá', 'greeting', {}, 'pt', null],
  ];
  it.each(rows)('%s → %s', (msg, kind, slots, lang, study) => {
    const p = check(msg, study, undefined, kind, slots);
    expect(p.messageLocale).toBe(lang);
    expect(p.locale).toBe(lang);
  });
  it('an English message is read as English even when the reader chose Portuguese', () => {
    const p = check('What does condemnation mean?', romans8, 'pt', 'word-study', { term: 'condemnation' });
    expect(p.messageLocale).toBe('en');
    expect(p.locale).toBe('pt');
  });
  it('a message with no language cues follows the reader’s language', () => {
    expect(classifyMessage('Romanos 8', env(null, {}, 'es')).messageLocale).toBe('es');
    expect(classifyMessage('8:28', env(romans8, {}, 'fr')).messageLocale).toBe('fr');
  });
});

describe('detectLocale', () => {
  it.each([
    ['What does the Bible say about grace?', 'en'],
    ['O que a Bíblia diz sobre a graça?', 'pt'],
    ['Não entendi, pode explicar de novo?', 'pt'],
    ['¿Qué dice la Biblia sobre la gracia?', 'es'],
    ['Muéstrame otros pasajes', 'es'],
    ['Que dit la Bible sur la grâce ?', 'fr'],
    ["Qu'est-ce que l'Évangile ?", 'fr'],
  ] as [string, Locale][])('%s → %s', (text, locale) => {
    expect(detectLocale(text)).toBe(locale);
  });
  it('falls back to the reader’s language when nothing decides', () => {
    expect(detectLocale('Romanos 8', 'pt')).toBe('pt');
    expect(detectLocale('8:28', 'fr')).toBe('fr');
    expect(detectLocale('Romans 8')).toBe('en');
  });
});

/* ------------------------------------------------------------------ */
/* Topic normalisation & spelling                                      */
/* ------------------------------------------------------------------ */

describe('normalizeTopicQuery — pt/es/fr question framing', () => {
  it.each([
    ['O que a Bíblia diz sobre riqueza?', 'riqueza'],
    ['o que as Escrituras ensinam a respeito do casamento', 'casamento'],
    ['Por que Deus permite o sofrimento?', 'sofrimento'],
    ['Fale-me sobre a graça', 'graca'],
    ['Quero estudar o Reino de Deus', 'reino de deus'],
    ['o que é justificação?', 'justificacao'],
    ['¿Qué dice la Biblia sobre la riqueza?', 'riqueza'],
    ['¿Por qué Dios permite el sufrimiento?', 'sufrimiento'],
    ['Háblame de la esperanza', 'esperanza'],
    ['¿Qué es la gracia?', 'gracia'],
    ['que dit la Bible sur la richesse ?', 'richesse'],
    ["Qu'est-ce que la Bible dit au sujet de l'argent ?", 'argent'],
    ['pourquoi Dieu permet-il la souffrance ?', 'souffrance'],
    ["Parle-moi de l'espérance", 'esperance'],
    ["Qu'est-ce que la grâce ?", 'grace'],
    ['la grâce selon la Bible', 'grace'],
  ])('%s → %s', (q, out) => {
    expect(normalizeTopicQuery(q)).toBe(out);
  });
  it('English framing is unchanged', () => {
    expect(normalizeTopicQuery('What does the Bible say about wealth?')).toBe('wealth');
    expect(normalizeTopicQuery('Tell me about the Kingdom of God')).toBe('kingdom of god');
  });
});

describe('restoreSpelling', () => {
  it('returns the reader’s accents', () => {
    expect(restoreSpelling('condenacao', 'O que significa condenação?')).toBe('condenação');
    expect(restoreSpelling('agneau de dieu', "Pourquoi Jésus est-il appelé l'Agneau de Dieu ?")).toBe('agneau de dieu');
    expect(restoreSpelling('bem aventurancas', 'o que são as bem-aventuranças?')).toBe('bem-aventuranças');
    expect(restoreSpelling('esperance', "Parle-moi de l'espérance")).toBe('espérance');
  });
  it('leaves values it cannot find, and plain ASCII messages, alone', () => {
    expect(restoreSpelling('grace', 'What is grace?')).toBe('grace');
    expect(restoreSpelling('flesh', 'O que é isso?')).toBe('flesh');
  });
});

/* ------------------------------------------------------------------ */
/* A study translated by an overlay is understood in its language      */
/* ------------------------------------------------------------------ */

describe('a translated study (fake Portuguese overlay over the Romans 8 fixture)', () => {
  const overlay: StudyOverlay = {
    studyId: 'fixture-romans-8',
    locale: 'pt',
    title: 'Romanos 8',
    matchTopics: ['nenhuma condenação', 'vida no espírito'],
    keyWords: {
      'kw-katakrima': { english: 'condenação', anchors: [{ verse: { book: 'ROM', chapter: 8, verse: 1 }, phrases: { BLIVRE: 'condenação' } }] },
      'kw-sarx': { english: 'carne' },
      'kw-huiothesia': { english: 'adoção' },
    },
    concepts: {
      'concept-condemnation': { label: 'Condenação', aliases: ['condenação', 'nenhuma condenação'], answer: '[fixture] Resposta.' },
      'concept-flesh': { label: 'Carne', aliases: ['carne', 'natureza pecaminosa'], answer: '[fixture] Resposta.' },
    },
  };
  const curated = createCuratedProvidersFrom({ studies: [FIXTURE_ROMANS_8], topics: [], overlays: { studies: [overlay], topics: [] } });
  const ptCurated = curated.studies.get('fixture-romans-8', 'pt')!;
  const pt: Study = new StudyAssembler(providers).fromCurated(ptCurated);

  it('the assembled study carries its language', () => {
    expect(pt.localization).toEqual({ locale: 'pt', translatedFrom: 'en' });
  });

  it.each([
    ['carne', 'word-study', { term: 'carne' }],
    ['Carne', 'word-study', { term: 'carne' }],
    ['natureza pecaminosa', 'word-study', { term: 'natureza pecaminosa' }],
    ['Onde mais a Bíblia fala sobre adoção?', 'cross-references', { term: 'adoção' }],
    ['O que significa condenação?', 'word-study', { term: 'condenação' }],
  ] as Row[])('%s → %s', (msg, kind, slots) => {
    check(msg, pt, 'pt', kind, slots);
  });

  it('"esta palavra" resolves to the active key word in the reader’s language', () => {
    const p = classifyMessage('O que significa esta palavra?', env(pt, { activeWordId: 'kw-sarx' }, 'pt'));
    expect(p.intent).toMatchObject({ kind: 'word-study', slots: { term: 'carne' } });
  });

  it('search finds concepts and key words by the translated, the English and the original words', () => {
    for (const term of ['condenação', 'condenacao', 'Condenação', 'condemnation', 'nenhuma condenação']) {
      expect(findConcept(pt, term)?.item.id, term).toBe('concept-condemnation');
    }
    for (const term of ['condenação', 'condenações', 'condemnation', 'katakrima', 'κατάκριμα', 'G2631']) {
      expect(findKeyWord(pt, term)?.item.id, term).toBe('kw-katakrima');
    }
    expect(findKeyWord(pt, 'adoção')?.item.id).toBe('kw-huiothesia');
    expect(findTermInStudies([ptCurated], 'carne')).toMatchObject({ keyWord: { id: 'kw-sarx' } });
    expect(searchStudy(pt, 'o que significa condenação')[0]).toMatchObject({ type: 'concept', id: 'concept-condemnation' });
  });
});
