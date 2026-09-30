/**
 * Answer from a single study item found by search (a theme, a context note, a
 * key passage, a perspective set…): quote its own summary, focus its section.
 * Used when a question matches no rule but clearly points at something the
 * study already contains.
 */
import { formatRef } from '../../domain/reference';
import { mergeCitations, para, tok, type ReplyDraft } from '../compose';
import type { StudyHit, StudyHitType } from '../search';
import { asSentence, excerpt } from '../text';
import type { IntentKind } from '../types';
import { respondPerspectives } from './context';
import { curatedPid, loc, step, tr, type ResponderEnv } from './env';
import { respondFromKeyPassages } from './topic';

export const HIT_INTENT: Record<StudyHitType, IntentKind> = {
  concept: 'word-study',
  'key-word': 'word-study',
  'cross-reference': 'cross-references',
  context: 'historical-context',
  literary: 'literary-context',
  theme: 'theology',
  perspective: 'perspectives',
  commentary: 'commentary',
  'key-passage': 'explain-verse',
  topic: 'theology',
};

/** Answer about one study item (not concepts/key words — those go through the word study). */
export async function respondFromHit(env: ResponderEnv, hit: StudyHit): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study!;
  const kind = HIT_INTENT[hit.type];
  if (hit.type === 'perspective') {
    const intent = { kind, confidence: 0.5, slots: { term: hit.title } };
    const draft = await respondPerspectives({ ...env, intent });
    return { ...draft, intent };
  }
  const title = asSentence(hit.title);
  const lead = hit.ref ? `**${tok.ref(hit.ref)} — ${title}**` : `**${title}**`;
  const intent = { kind, confidence: 0.5, slots: hit.ref ? { passage: hit.ref } : { term: hit.title } };
  // The topic's definition answers "the topic as a whole"; the key passages that fit the question follow it.
  if (hit.type === 'topic') {
    const withPassages = respondFromKeyPassages(env, env.message, [para(`${lead} ${excerpt(hit.summary, 45)}`)]);
    if (withPassages) {
      return {
        ...withPassages,
        citations: mergeCitations(hit.citations, withPassages.citations),
        steps: [step('Study search', t('trace.bestTopic', { score: hit.score.toFixed(2) }), curatedPid(study)), ...withPassages.steps],
        intent,
      };
    }
  }
  const itemIds = hit.type === 'topic' ? {} : { expandIds: [hit.id], pinIds: [hit.id] };
  return {
    blocks: [para(`${lead} ${excerpt(hit.summary, 70)}`)],
    focus: { section: hit.section, ...itemIds, reason: t('reason.fromQuestion', { what: hit.title.replace(/^[¿¡]\s*/, '').replace(/\s*[.?!]+$/, '') }) },
    citations: mergeCitations(hit.citations),
    suggestions: hit.ref && hit.type === 'key-passage' ? [t('suggest.study', { ref: formatRef(hit.ref, 'long', locale) })] : [],
    steps: [step('Study search', t('trace.bestMatch', { type: hit.type, id: hit.id, score: hit.score.toFixed(2) }), curatedPid(study))],
    intent,
  };
}
