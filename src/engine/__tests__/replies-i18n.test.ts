/**
 * Replies in the reader's language (docs/I18N.md §6). The spec conversations are asked in
 * Portuguese, Spanish and French over the REAL curated library (with its translation
 * overlays) and the bundled datasets: the answers come back in that language, the dashboard
 * directives are the ones the English conversation produces, suggested follow-ups are
 * phrased so the classifier of that language understands them, and honest declines are
 * declined in the reader's language. English output is unchanged.
 */
import { describe, expect, it } from 'vitest';
import type { ChatMessage, ConversationState, Study } from '../../domain/models';
import { formatRef } from '../../domain/reference';
import { LOCALES, type Locale } from '../../i18n/locales';
import { messages } from '../../i18n/messages/engine';
import { formatMessage, type Params } from '../../i18n/translate';
import { fakeClient, NO_KEY } from '../../inference/__tests__/fakes';
import { STATIC_SITE_REASON } from '../../inference/client';
import { createCuratedProviders } from '../../providers/curated';
import { createLocalDatasetProviders } from '../../providers/local';
import { createFsLoader } from '../../providers/local/__tests__/fsLoader';
import type { ProviderRegistry } from '../../providers/types';
import { InferenceStudyEngine } from '../InferenceStudyEngine';
import { classifyMessage } from '../intent';
import { LocalStudyEngine } from '../LocalStudyEngine';
import type { EngineResult } from '../types';
import { createFakeProviders } from './fixtures/providers';

const curated = createCuratedProviders();
const providers: ProviderRegistry = { ...createLocalDatasetProviders({ loader: createFsLoader(), allowRemoteFallback: false }), ...curated };
const has = (id: string) => Boolean(curated.studies.get(id));

type Foreign = Exclude<Locale, 'en'>;
const FOREIGN: Foreign[] = ['pt', 'es', 'fr'];
const NBSP = '\u00a0';

const catalog = messages as unknown as Record<Locale, Record<string, string>>;
/** A catalog message in one language (what the engine should have written). */
const msg = (locale: Locale, key: string, params: Params = {}) => formatMessage(locale, catalog[locale][key], params);

/** Ask the messages in turn, carrying study, conversation and history like the session store. */
async function converse(locale: Locale | undefined, messagesToAsk: string[]): Promise<EngineResult[]> {
  const engine = new LocalStudyEngine(providers);
  let study: Study | null = null;
  let conversation: ConversationState = {};
  const history: ChatMessage[] = [];
  const out: EngineResult[] = [];
  for (const m of messagesToAsk) {
    const r = await engine.respond(m, {
      study,
      history: [...history],
      conversation,
      translation: LOCALES[locale ?? 'en'].defaultTranslation,
      ...(locale ? { locale } : {}),
    });
    out.push(r);
    study = r.study ?? study;
    conversation = r.conversation;
    history.push({ id: `u${out.length}`, role: 'user', text: m, createdAt: 0 }, r.reply);
  }
  return out;
}

/** The dashboard directive without its (localized) banner text. */
function directive(r: EngineResult) {
  const { reason: _reason, ...focus } = r.focus ?? {};
  void _reason;
  return { kind: r.intent.kind, study: r.study?.id ?? r.reply.studyId, focus };
}

function paragraphs(r: EngineResult): string {
  return (r.reply.blocks ?? []).map((b) => (b.type === 'paragraph' || b.type === 'note' ? b.text : b.type === 'list' ? b.items.join('\n') : '')).join('\n');
}

/** Engine wording that must never leak into another language's reply chrome. */
const ENGLISH_CHROME = /^(Opened|Highlighted|Prioritised|Brought|Filtered|Showing|Marked|Showed)\b|from your question|Different interpretations:|opened beside the study/;

/* ------------------------------------------------------------------ */
/* The spec conversation (Romans 8), asked in four languages           */
/* ------------------------------------------------------------------ */

interface Turn {
  en: string;
  pt: string;
  es: string;
  fr: string;
  /** the dashboard directive must equal the English one (false where the reader's Bible wording legitimately differs) */
  sameFocus: boolean;
}

const ROMANS_8: Turn[] = [
  { en: 'Romans 8', pt: 'Romanos 8', es: 'Romanos 8', fr: 'Romains 8', sameFocus: true },
  { en: 'What does Paul mean by flesh here?', pt: 'O que Paulo quer dizer com carne aqui?', es: '¿Qué quiere decir Pablo con carne aquí?', fr: 'Que veut dire Paul par « chair » ici ?', sameFocus: true },
  { en: 'Show me other passages where this idea appears.', pt: 'Mostre outras passagens onde essa ideia aparece.', es: 'Muéstrame otros pasajes donde aparece esta idea.', fr: 'Montrez-moi d’autres passages où cette idée apparaît.', sameFocus: true },
  // the word is looked up in the reader's own Bible, whose wording differs from the BSB's
  { en: 'What is the Greek word behind ‘grace’?', pt: 'Qual é a palavra grega por trás de “graça”?', es: '¿Cuál es la palabra griega detrás de «gracia»?', fr: 'Quel est le mot grec derrière « grâce » ?', sameFocus: false },
  { en: 'What did Tim Keller say about this?', pt: 'O que Tim Keller disse sobre isso?', es: '¿Qué dijo Tim Keller sobre esto?', fr: 'Qu’a dit Tim Keller à ce sujet ?', sameFocus: true },
  { en: 'How would the original audience have understood this?', pt: 'Como os leitores originais entenderiam isso?', es: '¿Cómo lo habría entendido la audiencia original?', fr: 'Comment les premiers lecteurs l’auraient-ils compris ?', sameFocus: true },
  { en: 'How does this connect with Romans?', pt: 'Como isso se relaciona com Romanos?', es: '¿Cómo se relaciona esto con Romanos?', fr: 'Quel lien avec Romains ?', sameFocus: true },
  { en: 'Explain verse 12 in more detail.', pt: 'Explique o versículo 12 em mais detalhes.', es: 'Explica el versículo 12 con más detalle.', fr: 'Expliquez le verset 12 plus en détail.', sameFocus: true },
  { en: 'Are there different theological interpretations of this passage?', pt: 'Existem interpretações teológicas diferentes desta passagem?', es: '¿Hay diferentes interpretaciones teológicas de este pasaje?', fr: 'Y a-t-il des interprétations théologiques différentes de ce passage ?', sameFocus: true },
  { en: 'What does condemnation mean?', pt: 'O que significa condenação?', es: '¿Qué significa condenación?', fr: 'Que signifie condamnation ?', sameFocus: true },
  { en: 'Where else does Paul talk about this?', pt: 'Onde mais Paulo fala disso?', es: '¿Dónde más habla Pablo de esto?', fr: 'Où ailleurs Paul en parle-t-il ?', sameFocus: true },
];

/** The occurrence line, written in the language ("aparece 3 vezes em 3 versículos do Novo Testamento grego"). */
const OCCURRENCES: Record<Foreign, RegExp> = {
  pt: /aparece (uma vez|\d+ vezes) em \d+ versículos? do Novo Testamento grego/,
  es: /aparece (una vez|\d+ veces) en \d+ versículos? del Nuevo Testamento griego/,
  fr: /apparaît (une fois|\d+ fois) dans \d+ versets? du Nouveau Testament grec/,
};

describe.skipIf(!has('romans-8'))('the Romans 8 spec conversation in pt / es / fr', () => {
  let english: EngineResult[] = [];
  const englishRun = async () => (english.length ? english : (english = await converse(undefined, ROMANS_8.map((t) => t.en))));

  it.each(FOREIGN)('%s: every follow-up is classified as in English, with the same dashboard directive', async (locale) => {
    const en = await englishRun();
    const replies = await converse(locale, ROMANS_8.map((t) => t[locale]));
    ROMANS_8.forEach((turn, i) => {
      expect(replies[i].intent.kind, turn[locale]).toBe(en[i].intent.kind);
      if (turn.sameFocus) expect(directive(replies[i]), turn[locale]).toEqual(directive(en[i]));
    });
  });

  it.each(FOREIGN)('%s: replies, "Study updated" lines and banners are in the reader’s language', async (locale) => {
    const replies = await converse(locale, ROMANS_8.map((t) => t[locale]));
    const [opened, flesh] = replies;
    expect(opened.study).toMatchObject({ id: 'romans-8', localization: { locale, translatedFrom: 'en' } });
    expect(opened.study!.title).toBe(formatRef({ book: 'ROM', startChapter: 8 }, 'long', locale));
    expect(opened.reply.updates?.[0].label).toBe(msg(locale, 'open.update.opened', { title: opened.study!.title, depth: 'curated' }));
    // "I’ve opened σάρξ (sarx, G4561) in Original languages. σάρξ occurs 147 times…" — in the reader's language
    expect(paragraphs(flesh)).toContain('σάρξ');
    expect(paragraphs(flesh)).toMatch(OCCURRENCES[locale]);
    const condemnation = replies[ROMANS_8.findIndex((t) => t.en === 'What does condemnation mean?')];
    expect(paragraphs(condemnation)).toMatch(OCCURRENCES[locale]);
    expect(condemnation.focus?.reason).toContain(msg(locale, 'reason.fromQuestion', { what: '' }).trim());
    for (const r of replies) {
      for (const u of r.reply.updates ?? []) expect(u.label).not.toMatch(ENGLISH_CHROME);
      if (r.focus?.reason) expect(r.focus.reason).not.toMatch(ENGLISH_CHROME);
      expect(paragraphs(r)).not.toMatch(/\b(I’ve opened|We’re already|I don’t have|Here are)\b/);
      for (const step of r.trace.slice(1)) expect(step.detail).not.toMatch(/^(Curated study|Templated reply|Parsed “|No curated)/);
    }
  });

  it.each(FOREIGN)('%s: the engine’s own suggested follow-ups are in the reader’s language and understood', async (locale) => {
    const replies = await converse(locale, ROMANS_8.map((t) => t[locale]));
    const study = replies[0].study!;
    for (const r of replies) {
      // the study's own suggested questions come from its translation overlay
      for (const s of (r.reply.suggestions ?? []).filter((x) => !study.suggestedQuestions.includes(x))) {
        expect(s).not.toMatch(/^(Show|What|Where|How|Explain|Study|Explore|Are there)\b/);
        const parsed = classifyMessage(s, { study, conversation: {}, findAuthor: (t) => curated.sources.findAuthor(t), locale });
        expect(parsed.intent.kind, s).not.toBe('unknown');
      }
    }
  });
});

/* ------------------------------------------------------------------ */
/* Every suggestion template, in every language                         */
/* ------------------------------------------------------------------ */

describe.skipIf(!has('romans-8'))('suggestion templates are phrased for the classifier of each language', () => {
  const PARAMS: Record<string, Params> = {
    'suggest.explainVerse': { n: 12 },
    'suggest.study': { ref: '{ref}' },
    'suggest.explore': { topic: 'grace', title: '{title}' },
    'suggest.explain': { ref: '{ref}' },
    'suggest.meaning': { word: '{word}' },
    'suggest.authorSays': { name: 'Calvin' },
    'suggest.whereElse': { word: '{word}' },
    'suggest.wordBehind': { language: 'greek', word: '{word}' },
  };
  const FILL: Record<Locale, Record<string, string>> = {
    en: { '{ref}': 'Romans 5', '{title}': 'Grace', '{word}': 'grace' },
    pt: { '{ref}': 'Romanos 5', '{title}': 'Graça', '{word}': 'graça' },
    es: { '{ref}': 'Romanos 5', '{title}': 'Gracia', '{word}': 'gracia' },
    fr: { '{ref}': 'Romains 5', '{title}': 'Grâce', '{word}': 'grâce' },
  };
  const text = (locale: Locale, key: string) => Object.entries(FILL[locale]).reduce((s, [a, b]) => s.replace(a, b), msg(locale, key, PARAMS[key]));
  const kind = (locale: Locale, key: string) => {
    const romans = curated.studies.get('romans-8')!;
    const study: Study = { ...romans, depth: 'curated', sourceIds: [] };
    return classifyMessage(text(locale, key), {
      study,
      conversation: { activeVerse: { book: 'ROM', chapter: 8, verse: 1 } },
      findAuthor: (t) => curated.sources.findAuthor(t),
      locale,
    }).intent.kind;
  };

  it.each(FOREIGN)('%s', (locale) => {
    const keys = Object.keys(catalog.en).filter((k) => k.startsWith('suggest.'));
    for (const key of keys) expect(`${key}: ${kind(locale, key)}`, text(locale, key)).toBe(`${key}: ${kind('en', key)}`);
  });
});

/* ------------------------------------------------------------------ */
/* The other spec studies                                               */
/* ------------------------------------------------------------------ */

const OPENINGS: Record<string, Record<Locale, string>> = {
  'john-1': { en: 'John 1', pt: 'João 1', es: 'Juan 1', fr: 'Jean 1' },
  'psalm-23': { en: 'Psalm 23', pt: 'Salmo 23', es: 'Salmo 23', fr: 'Psaume 23' },
  grace: { en: 'Grace', pt: 'Graça', es: 'Gracia', fr: 'Grâce' },
};

const FOLLOW_UPS: Record<string, Record<Locale, string>[]> = {
  'john-1': [
    { en: 'What does the Greek word for flesh mean?', pt: 'O que significa a palavra grega para carne?', es: '¿Qué significa la palabra griega para carne?', fr: 'Que signifie le mot grec pour chair ?' },
    { en: 'Explain verse 14', pt: 'Explique o versículo 14', es: 'Explica el versículo 14', fr: 'Explique le verset 14' },
    { en: 'What did Augustine say about this?', pt: 'O que Agostinho disse sobre isso?', es: '¿Qué dijo Agustín sobre esto?', fr: 'Qu’a dit Augustin à ce sujet ?' },
  ],
  'psalm-23': [
    { en: 'What does shepherd mean?', pt: 'O que significa pastor?', es: '¿Qué significa pastor?', fr: 'Que signifie berger ?' },
    { en: 'Who wrote this?', pt: 'Quem escreveu isso?', es: '¿Quién escribió esto?', fr: 'Qui a écrit cela ?' },
  ],
  grace: [
    { en: 'What does grace mean?', pt: 'O que significa graça?', es: '¿Qué significa gracia?', fr: 'Que signifie grâce ?' },
    { en: 'Show cross-references', pt: 'Mostre as referências cruzadas', es: 'Mostrar las referencias cruzadas', fr: 'Afficher les références croisées' },
  ],
};

for (const id of Object.keys(OPENINGS)) {
  describe.skipIf(!has(id))(`${id} in pt / es / fr`, () => {
    it.each(FOREIGN)('%s: opens the study in the reader’s language; follow-ups match English where the study is translated', async (locale) => {
      const turns = [OPENINGS[id], ...FOLLOW_UPS[id]];
      const en = await converse(undefined, turns.map((t) => t.en));
      const replies = await converse(locale, turns.map((t) => t[locale]));
      const study = replies[0].study!;
      expect(study.id).toBe(id);
      expect(replies[0].reply.updates?.[0].label).toBe(msg(locale, 'open.update.opened', { title: study.title, depth: 'curated' }));
      turns.forEach((turn, i) => {
        expect(replies[i].intent.kind, turn[locale]).toBe(en[i].intent.kind);
        // the reader's own words for the study's key words and concepts arrive with its translation
        if (study.localization?.translatedFrom === 'en') expect(directive(replies[i]), turn[locale]).toEqual(directive(en[i]));
        for (const u of replies[i].reply.updates ?? []) expect(u.label).not.toMatch(ENGLISH_CHROME);
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Honest declines and out-of-range references                          */
/* ------------------------------------------------------------------ */

const GENESIS_1: Record<Foreign, string> = { pt: 'Gênesis 1', es: 'Génesis 1', fr: 'Genèse 1' };

const NO_KELLER: Record<Foreign, RegExp> = {
  pt: /^Não tenho uma fonte verificada de (Tim|Timothy) Keller sobre Gênesis 1 na biblioteca local/,
  es: /^No tengo una fuente verificada de (Tim|Timothy) Keller sobre Génesis 1 en la biblioteca local/,
  fr: /^Je n’ai pas, dans la bibliothèque locale, de source vérifiée pour (Tim|Timothy) Keller sur Genèse 1/,
};

describe('honest declines, in the reader’s language', () => {
  it.each(FOREIGN)('%s: no verified Tim Keller source for a library passage — declined, nothing invented', async (locale) => {
    const ask = { pt: 'O que Tim Keller disse sobre isso?', es: '¿Qué dijo Tim Keller sobre esto?', fr: 'Qu’a dit Tim Keller à ce sujet ?' }[locale];
    const [, r] = await converse(locale, [GENESIS_1[locale], ask]);
    expect(r.intent).toMatchObject({ kind: 'commentary', slots: { authorId: 'tim-keller' } });
    expect(r.reply.declined).toBe(true);
    expect(paragraphs(r)).toMatch(NO_KELLER[locale]);
    expect(r.reply.blocks?.some((b) => b.type === 'note' && b.text === msg(locale, 'comm.nothingInvented'))).toBe(true);
    expect(r.focus?.section).toBe('commentary');
  });

  it.each([
    ['pt', 'Romanos 17', 'Romanos tem 16 capítulos, então não existe Romanos 17.', ['Estudar Romanos 16', 'Estudar Romanos']],
    ['es', 'Romanos 17', 'Romanos tiene 16 capítulos, así que no existe Romanos 17.', ['Estudiar Romanos 16', 'Estudiar Romanos']],
    ['fr', 'Romains 17', 'Romains compte 16 chapitres : il n’y a donc pas de Romains 17.', ['Étudier Romains 16', 'Étudier Romains']],
  ] as const)('%s: a chapter the book does not have (%s)', async (locale, message, text, suggestions) => {
    const [r] = await converse(locale, [message]);
    expect(r.study).toBeUndefined();
    expect(paragraphs(r).replaceAll(NBSP, ' ')).toContain(text);
    expect(r.reply.suggestions?.slice(0, 2)).toEqual(suggestions);
  });

  it.each([
    ['pt', 'João 3:40', 'João 3 tem 36 versículos, então não encontro João 3:40.'],
    ['es', 'Juan 3:40', 'Juan 3 tiene 36 versículos, así que no encuentro Juan 3:40.'],
    ['fr', 'Jean 3.40', 'Jean 3 compte 36 versets : je ne trouve donc pas Jean 3.40.'],
  ] as const)('%s: a verse past the end of the chapter (%s)', async (locale, message, text) => {
    const [r] = await converse(locale, [message]);
    expect(r.reply.declined).toBe(true);
    expect(paragraphs(r).replaceAll(NBSP, ' ')).toContain(text);
  });
});

/* ------------------------------------------------------------------ */
/* Library studies are written in the reader's language                 */
/* ------------------------------------------------------------------ */

describe('library studies in the reader’s language', () => {
  it.each([
    ['pt', 'Gênesis · Pentateuco', 'Um estudo da biblioteca sobre Gênesis 1'],
    ['es', 'Génesis · Pentateuco', 'Un estudio de la biblioteca sobre Génesis 1'],
    ['fr', 'Genèse · Pentateuque', 'Une étude de la bibliothèque sur Genèse 1'],
  ] as const)('%s: a passage with no curated study', async (locale, subtitle, summary) => {
    const title = GENESIS_1[locale];
    const [r] = await converse(locale, [title]);
    expect(r.study).toMatchObject({ id: 'library-GEN.1', depth: 'library', title, subtitle, localization: { locale } });
    expect(r.study!.summary?.text.startsWith(summary)).toBe(true);
    expect(r.reply.updates?.[0].label).toBe(msg(locale, 'open.update.opened', { title, depth: 'library' }));
    expect(r.study!.suggestedQuestions[0]).toBe(msg(locale, 'suggest.explainVerse', { n: 1 }));
  });

  it.each([
    ['pt', 'Quais são as palavras-chave desta passagem?', 'glosas em inglês'],
    ['es', '¿Cuáles son las palabras clave de este pasaje?', 'glosas en inglés'],
    ['fr', 'Quels sont les mots clés de ce passage ?', 'gloses en anglais'],
  ] as const)('%s: English-only data (lexicon glosses) is marked as such', async (locale, ask, marker) => {
    const [, r] = await converse(locale, [GENESIS_1[locale], ask]);
    expect(r.intent.kind).toBe('word-study');
    if (!r.reply.declined) expect(paragraphs(r)).toContain(marker);
  });

  it.each([
    ['pt', 'O que a Bíblia diz sobre a esperança?', /^Estudo temático/],
    ['es', '¿Qué dice la Biblia sobre la esperanza?', /^Estudio temático/],
    ['fr', 'Que dit la Bible sur l’espérance ?', /^Étude thématique/],
  ] as const)('%s: a library topic study (%s)', async (locale, ask, subtitle) => {
    const [r] = await converse(locale, [ask]);
    expect(r.study?.id).toBe('topic-hope');
    expect(r.study!.subtitle).toMatch(subtitle);
    // assembled for the reader's language (so the session re-opens it when the language changes)
    expect(r.study!.localization?.locale).toBe(locale);
  });
});

/* ------------------------------------------------------------------ */
/* English is unchanged                                                 */
/* ------------------------------------------------------------------ */

describe('English', () => {
  it('locale "en" and no locale produce the same replies', async () => {
    const strip = (rs: EngineResult[]) => rs.map((r) => ({ ...r, reply: { ...r.reply, createdAt: 0 } }));
    const turns = ['Romans 8', 'What does condemnation mean?', 'Where else does Paul talk about this?', 'Genesis 1', 'What did Tim Keller say about this?', 'Romans 17'];
    expect(strip(await converse('en', turns))).toEqual(strip(await converse(undefined, turns)));
  });
});

/* ------------------------------------------------------------------ */
/* Live composition (inference layer)                                   */
/* ------------------------------------------------------------------ */

describe('InferenceStudyEngine in the reader’s language', () => {
  const fixtures = createFakeProviders();
  const notes = (r: EngineResult) => (r.reply.blocks ?? []).flatMap((b) => (b.type === 'note' ? [b.text] : []));

  it('sends the reader’s language with the compose request', async () => {
    const client = fakeClient();
    const engine = new InferenceStudyEngine(fixtures, { client });
    await engine.respond('divorce', { study: null, history: [], conversation: {}, translation: 'BLIVRE', locale: 'pt' });
    expect(client.composeCalls[0]).toMatchObject({ query: 'divorce', translation: 'BLIVRE', locale: 'pt' });
  });

  it.each([
    ['pt', /^Composição ao vivo: não é possível gerar novos estudos agora\./],
    ['es', /^Composición en vivo: no es posible generar estudios nuevos ahora\./],
    ['fr', /^Composition en direct : impossible de composer de nouvelles études pour le moment\./],
  ] as const)('%s: explains unavailability in the reader’s language', async (locale, text) => {
    const engine = new InferenceStudyEngine(fixtures, { client: fakeClient(NO_KEY) });
    const r = await engine.respond('Matthew 5–7', { study: null, history: [], conversation: {}, translation: LOCALES[locale].defaultTranslation, locale });
    expect(notes(r)[0]).toMatch(text);
    expect(notes(r)[0]).not.toMatch(/ANTHROPIC|\.env|add /); // the server's setup details stay out of the chat
  });

  it('shows the static edition’s own reason in the reader’s language', async () => {
    const engine = new InferenceStudyEngine(fixtures, { client: fakeClient({ ...NO_KEY, reason: STATIC_SITE_REASON }) });
    const r = await engine.respond('Matthew 5–7', { study: null, history: [], conversation: {}, translation: 'LSG', locale: 'fr' });
    expect(notes(r)[0]).toContain('dans cette édition publique, les questions ouvrent les études de la bibliothèque');
    expect(notes(r)[0]).not.toMatch(/API|Anthropic/);
  });
});
