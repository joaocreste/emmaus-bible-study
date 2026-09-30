/** sources, greeting, help and unknown. */
import type { Source, SourceType } from '../../domain/models';
import { formatRef } from '../../domain/reference';
import { getBibleVersion, versionsFor } from '../../domain/translations';
import type { Locale } from '../../i18n/locales';
import { topicInProse } from '../assemble';
import { list, listJoin, lowerFirstIn, para, quoted, startSuggestions, type ReplyDraft } from '../compose';
import { findConceptInText, searchStudy } from '../search';
import { excerpt } from '../text';
import type { Intent } from '../types';
import { activeConcept, curatedPid, loc, step, studyName, tr, type ResponderEnv } from './env';
import { respondTheology } from './context';
import { respondFromHit } from './hits';
import { respondFromKeyPassages, topicDefinitionDraft } from './topic';
import { respondWordStudy } from './word';

const SOURCE_GROUPS: { label: 'scripture' | 'lexicons' | 'commentaries' | 'books' | 'sermons' | 'creeds'; types: SourceType[] }[] = [
  { label: 'scripture', types: ['bible-translation', 'original-text'] },
  { label: 'lexicons', types: ['lexicon', 'dataset', 'study-notes'] },
  { label: 'commentaries', types: ['commentary'] },
  { label: 'books', types: ['book', 'article', 'lecture', 'website', 'dictionary', 'encyclopedia'] },
  { label: 'sermons', types: ['sermon'] },
  { label: 'creeds', types: ['creed', 'confession', 'catechism'] },
];

/** A topic title inside a sentence ("such as grace, suffering and the Holy Spirit"). */
function topicWord(title: string, locale: Locale): string {
  return locale === 'en' ? title.toLowerCase() : topicInProse(title, locale);
}

/** The reader's Bible versions ("the Bíblia Livre (with NBV and BPM)") for the no-study sources reply. */
function versionNames(locale: Locale, translation: string): { main: string; others: string } {
  const all = versionsFor(locale);
  let main = all[0];
  try {
    const v = getBibleVersion(translation as Parameters<typeof getBibleVersion>[0]);
    if (v.language === locale) main = v;
  } catch {
    /* unknown translation */
  }
  const others = all.filter((v) => v.id !== main?.id).map((v) => v.shortName);
  return { main: main?.name ?? '', others: listJoin(others, locale) };
}

function curatedTitles(env: ResponderEnv): { passages: string[]; topics: string[] } {
  try {
    const all = env.providers.studies.list(loc(env));
    return { passages: all.filter((s) => s.kind === 'passage').map((s) => s.title), topics: all.filter((s) => s.kind === 'topic').map((s) => s.title) };
  } catch {
    return { passages: [], topics: [] };
  }
}

export async function respondSources(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study;
  const principle = t('sources.principle');
  const [romans8, , , grace] = startSuggestions(locale);
  if (!study) {
    return {
      blocks: [para(locale === 'en' ? t('sources.base') : t('sources.base', versionNames(locale, env.ctx.translation))), para(principle)],
      suggestions: [romans8, grace],
      steps: [step('Sources', t('trace.baseRegistry'), 'curated:sources')],
    };
  }
  const sources = study.sourceIds.map((id) => env.providers.sources.getSource(id)).filter((s): s is Source => Boolean(s));
  const items = SOURCE_GROUPS.map((g) => ({ g, s: sources.filter((x) => g.types.includes(x.type)) }))
    .filter((x) => x.s.length)
    .map(({ g, s }) => {
      const titles = s.slice(0, 3).map((x) => `*${x.title}*`);
      return t(s.length > 3 ? 'sources.groupMore' : 'sources.group', {
        label: t(`sources.label.${g.label}`),
        titles: listJoin(titles, locale),
        more: s.length - 3,
      });
    });
  return {
    blocks: [
      para(t('sources.intro', { name: studyName(study, locale), kind: study.kind, title: study.title, count: sources.length })),
      ...(items.length ? [list(items)] : []),
      para(principle),
    ],
    focus: { section: 'sources', reason: t('reason.fromQuestion', { what: t('reason.sources') }) },
    steps: [step('Sources', t('trace.sourcesResolved', { count: sources.length, id: study.id }), 'curated:sources')],
  };
}

const THANKS_RE = /\b(thanks|thank you|thx|cheers|obrigad[oa]s?|valeu|gracias|muchas gracias|merci)\b/;
/** A message that opens with thanks in any of the four languages (the classifier strips it from `parsed.lower`). */
const THANKS_START_RE = /^\s*[¡!]?\s*(?:thanks|thank you|thx|cheers|(?:muito )?obrigad[oa]s?|valeu|(?:muchas |mil )?gracias|te lo agradezco|se (?:lo )?agradece|merci|je vous remercie)(?![\p{L}\d])/iu;

export async function respondGreeting(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const thanks = THANKS_RE.test(env.parsed.lower) || THANKS_START_RE.test(env.message);
  const study = env.study;
  const { passages, topics } = curatedTitles(env);
  const traced = step('Conversation', t(thanks ? 'trace.thanks' : 'trace.greeting'), 'engine:local-rules');
  if (study) {
    return {
      blocks: [para(t(thanks ? 'greet.thanksInStudy' : 'greet.peaceInStudy', { title: study.title }))],
      steps: [traced],
    };
  }
  const examples = [...passages.slice(0, 3), ...topics.slice(0, 1)];
  const [romans8, john11, , grace] = startSuggestions(locale);
  return {
    blocks: [
      para(
        t('greet.ask', {
          opening: t(thanks ? 'greet.thanks' : 'greet.peace'),
          passages: passages.length ? listJoin(passages.slice(0, 3), locale) : 'none',
          topics: topics.length ? listJoin(topics.map((x) => topicWord(x, locale)), locale) : 'none',
        }),
      ),
    ],
    suggestions: examples.length >= 2 ? examples : [romans8, john11, grace],
    steps: [traced],
  };
}

export async function respondHelp(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study;
  const [romans8, john11, psalm23, grace] = startSuggestions(locale);
  const q = (s: string) => quoted(s, locale);
  const matthew = formatRef({ book: 'MAT', startChapter: 5, endChapter: 7 }, 'long', locale);
  return {
    blocks: [
      para(t('help.intro')),
      list([
        t('help.passage', { examples: [romans8, john11, matthew].map(q).join(', ') }),
        t('help.topic', { grace: q(lowerFirstIn(grace, locale)), question: q(t('help.topicExample')) }),
        t('help.word', { example: q(t('help.wordExample')) }),
        t('help.threads'),
      ]),
      para(t('help.quotes')),
    ],
    suggestions: study ? study.suggestedQuestions : [romans8, grace, psalm23],
    steps: [step('Conversation', t('trace.help'), 'engine:local-rules')],
  };
}

/** "Tell me more", "go on" — in the four languages (folded text). */
const MORE_RE = /\b(more|deeper|go on|continue|elaborate|expand|mais|aprofund\w*|continu\w*|desenvolv\w*|(?:dime|cuentame|explicame|algo) mas|profundiz\w*|sigue|seguir|amplia\w*|en plus|dites m'en plus|approfond\w*|developp\w*)\b/;

export async function respondUnknown(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study;
  if (!study) {
    const { passages, topics } = curatedTitles(env);
    const example = formatRef({ book: 'JHN', startChapter: 3, startVerse: 16, endChapter: 3, endVerse: 16 }, 'long', locale);
    return {
      blocks: [
        para(
          t('unknown.noStudy', {
            example: quoted(example, locale),
            topics: topics.length ? listJoin(topics.map((x) => topicWord(x, locale)), locale) : 'none',
          }),
        ),
      ],
      suggestions: [...passages.slice(0, 2), ...topics.slice(0, 1)],
      steps: [step('Conversation', t('trace.nothingRecognised'), 'engine:local-rules')],
    };
  }

  // "Tell me more" about the concept under discussion → its theology.
  const concept = activeConcept(env);
  if (concept && (locale === 'en' ? /\b(more|deeper|go on|continue|elaborate|expand)\b/ : MORE_RE).test(env.parsed.lower)) {
    const draft = await respondTheology({ ...env, parsed: { ...env.parsed, refersToContext: true } });
    return { ...draft, intent: { kind: 'theology', confidence: 0.5, slots: {} } };
  }

  // A concept named in the question ("Why is Jesus called *the Lamb of God*?") → its word study.
  const named = findConceptInText(study, env.message);
  if (named) {
    const intent: Intent = { kind: 'word-study', confidence: 0.55, slots: { term: named.alias } };
    const draft = await respondWordStudy({ ...env, intent });
    if (draft) return { ...draft, intent };
  }

  const hits = searchStudy(study, env.message);
  const best = hits[0];
  // A topic study answers from the key passages that fit the question, unless search found one item squarely
  // (the topic's own definition adds its passages in respondFromHit).
  if (study.kind === 'topic' && best?.type !== 'topic' && (!best || best.score < (best.type === 'key-passage' ? 0.8 : 0.6))) {
    const fromPassages = respondFromKeyPassages(env);
    if (fromPassages) return { ...fromPassages, intent: { kind: 'theology', confidence: 0.5, slots: {} } };
    // nothing specific fits well: the topic's orientation, when the question is about it at all
    if (!best || best.score < 0.5) {
      const definition = topicDefinitionDraft(study, env.message, locale);
      if (definition) return { ...definition, intent: { kind: 'theology', confidence: 0.45, slots: {} } };
    }
  }
  if (best && best.score >= 0.4) {
    if (best.type === 'concept' || best.type === 'key-word') {
      const term = best.type === 'concept' ? (study.concepts.find((c) => c.id === best.id)?.label ?? best.title) : (study.keyWords.find((k) => k.id === best.id)?.english ?? best.title);
      const intent: Intent = { kind: 'word-study', confidence: 0.5, slots: { term } };
      const draft = await respondWordStudy({ ...env, intent });
      if (draft) return { ...draft, intent };
    }
    return respondFromHit(env, best);
  }

  const topics = [
    ...study.keyWords.slice(0, 3).map((k) => k.english),
    ...study.theology.slice(0, 2).map((th) => lowerFirstIn(th.title, locale)),
  ];
  return {
    blocks: [
      para(topics.length ? t('unknown.covers', { title: study.title, kind: study.kind, topics: listJoin(topics, locale) }) : t('unknown.ask', { title: study.title, kind: study.kind })),
    ],
    steps: [step('Study search', hits.length ? t('trace.weakMatches', { best: excerpt(hits[0].title, 8) }) : t('trace.noMatchingItem'), curatedPid(study))],
    declined: true,
  };
}
