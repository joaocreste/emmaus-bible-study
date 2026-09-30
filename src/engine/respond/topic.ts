/**
 * Topic studies answer from their key passages: the passages whose title, tags
 * and note best match the question ("Is it wrong to be rich?" → the rich fool,
 * the rich young man, 1 Timothy 6), each quoted from its own curated note.
 */
import type { MessageBlock, PassageRef, Study } from '../../domain/models';
import { formatRef } from '../../domain/reference';
import type { Locale } from '../../i18n/locales';
import { colon, engineT, list, mergeCitations, para, tok, type ReplyDraft } from '../compose';
import { distinctiveStems, rankKeyPassages } from '../search';
import { asSentence, contentTokens, excerpt, stem } from '../text';
import { curatedPid, loc, step, type ResponderEnv } from './env';

export type RankedPassages = ReturnType<typeof rankKeyPassages>;

/** Key passages that answer the question well enough to lead with (empty when none does). */
export function answeringPassages(study: Study, text: string, named?: PassageRef, keep: (ref: PassageRef) => boolean = () => true): RankedPassages {
  const ranked = rankKeyPassages(study, text, named).filter((r) => keep(r.item.ref));
  const best = ranked[0];
  if (!best || !(best.score >= 0.9 || (best.score >= 0.5 && best.labelHits >= 1))) return [];
  return ranked.filter((r, i) => i === 0 || (r.score >= best.score * 0.75 && r.labelHits >= 1)).slice(0, 3);
}

/**
 * Reply from the best key passages; `lead` (e.g. the topic's definition) comes
 * first when the question asks about the topic as a whole.
 */
export function keyPassagesDraft(study: Study, top: RankedPassages, lead: MessageBlock[] = [], intro?: string, locale: Locale = 'en'): ReplyDraft {
  const t = engineT(locale);
  const first = top[0].item;
  const blocks: MessageBlock[] = [...lead];
  if (top.length === 1) {
    if (intro) blocks.push(para(intro));
    blocks.push(para(`**${tok.ref(first.ref)} — ${asSentence(first.title)}** ${excerpt(first.note.text, lead.length ? 45 : 70)}`));
  } else {
    blocks.push(para(intro ?? t(lead.length ? 'topic.keyPassagesBehind' : 'topic.severalPlaces')));
    blocks.push(list(top.map((r) => `${tok.ref(r.item.ref)} — **${r.item.title}**${colon(locale)} ${excerpt(r.item.note.text, 26)}`)));
  }
  return {
    blocks,
    focus: {
      section: 'key-passages',
      expandIds: [first.id],
      pinIds: top.map((r) => r.item.id),
      reason: t('reason.fromQuestion', { what: first.title.replace(/^[¿¡]\s*/, '').replace(/\s*[?!]+$/, '') }),
    },
    citations: mergeCitations(...top.map((r) => r.item.note.provenance.citations)),
    suggestions: [
      t('suggest.study', { ref: formatRef(first.ref, 'long', locale) }),
      ...(top[1] ? [t('suggest.explain', { ref: formatRef(top[1].item.ref, 'long', locale) })] : []),
    ],
    steps: [step('Key passages', t('trace.rankedPassages', { top: top.map((r) => `${r.item.id} (${r.score.toFixed(2)})`).join(', ') }), curatedPid(study))],
  };
}

/** Answer a question in a topic study from its key passages, or undefined when none fits. */
export function respondFromKeyPassages(env: ResponderEnv, text: string = env.message, lead: MessageBlock[] = []): ReplyDraft | undefined {
  const study = env.study;
  if (!study?.topic?.keyPassages.length) return undefined;
  const top = answeringPassages(study, text, env.intent.slots.passage);
  return top.length ? keyPassagesDraft(study, top, lead, undefined, loc(env)) : undefined;
}

/**
 * The topic's own orientation, when the question is about the topic as a whole
 * ("How can God be one and three?" in the Trinity) — only if the question shares
 * a distinctive word with it, so an unrelated question is not "answered".
 */
export function topicDefinitionDraft(study: Study, text: string, locale: Locale = 'en'): ReplyDraft | undefined {
  const t = engineT(locale);
  const topic = study.topic;
  if (!topic) return undefined;
  const words = new Set(contentTokens(`${topic.name} ${topic.question ?? ''} ${topic.definition.text}`).map(stem));
  if (!distinctiveStems(text).some((w) => words.has(w))) return undefined;
  // passages that touch the question by title or tag, even if none answers it alone
  const related = rankKeyPassages(study, text).filter((r) => r.labelHits > 0).slice(0, 3);
  const pointer = related.length
    ? t('topic.seeEspecially', { passages: related.map((r) => `${tok.ref(r.item.ref)} (${r.item.title})`).join(', '), section: tok.section('key-passages') })
    : t('open.topicPassages', { section: tok.section('key-passages') });
  return {
    blocks: [para(excerpt(topic.definition.text, 80)), para(pointer)],
    focus: {
      section: 'key-passages',
      ...(related.length ? { pinIds: related.map((r) => r.item.id) } : {}),
      reason: t('reason.fromQuestion', { what: topic.question ?? study.title }),
    },
    citations: mergeCitations(topic.definition.provenance.citations, ...related.map((r) => r.item.note.provenance.citations)),
    suggestions: study.suggestedQuestions.slice(0, 2),
    steps: [step('Topic', t('trace.topicOrientation'), curatedPid(study))],
  };
}
