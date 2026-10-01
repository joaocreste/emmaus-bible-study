/**
 * LocalStudyEngine — deterministic intent rules over the curated library and
 * the open datasets, shaped like the future retrieval + LLM pipeline:
 *   intent/slots → retrieval (providers) → ranking → templated synthesis
 *   → EngineResult { reply, study?, focus?, conversation, trace, inspector? }
 * No artificial delays (the session store animates "thinking"); deterministic.
 */
import type { ChatMessage, PassageRef, PipelineStep, Study } from '../domain/models';
import { synthesis } from '../domain/provenance';
import { formatRef, formatVerse, refContains, refsOverlap } from '../domain/reference';
import type { Locale } from '../i18n/locales';
import type { ProviderRegistry } from '../providers/types';
import { StudyAssembler, type TopicMatchLike } from './assemble';
import {
  blocksToPlainText,
  bookName,
  broughtIntoView,
  describeFocus,
  engineT,
  fillSuggestions,
  listJoin,
  lowerFirstIn,
  localeOf,
  mergeCitations,
  para,
  personName,
  startSuggestions,
  type ReplyDraft,
} from './compose';
import { classifyMessage, type ClassifierEnv, type ParsedMessage } from './intent';
import { respondCommentary, studiesWithAuthor } from './respond/commentary';
import { respondConnect, respondCrossReferences } from './respond/crossrefs';
import { respondHistorical, respondLiterary, respondPerspectives, respondTheology } from './respond/context';
import { attempt, step, type ResponderEnv } from './respond/env';
import { respondGreeting, respondHelp, respondSources, respondUnknown } from './respond/misc';
import { curatedForPassage, openById, openCurated, respondOpenPassage, respondOpenTopic } from './respond/open';
import { respondExplainVerse } from './respond/verse';
import { respondWordStudy } from './respond/word';
import { asksNewQuestion } from './question';
import { bestPhraseScore, normalizePhrase, normalizeTopicQuery, restoreSpelling } from './text';
import type { EngineContext, EngineResult, Intent, IntentKind, StudyEngine } from './types';

/** Intents that work on a study (and may open one first when the message names another passage). */
const FOLLOW_UPS: ReadonlySet<IntentKind> = new Set([
  'word-study',
  'cross-references',
  'connect',
  'commentary',
  'historical-context',
  'literary-context',
  'theology',
  'perspectives',
  'explain-verse',
]);

/** The Intent trace line: "word-study · term “condemnation”" (slot names in the reader's language). */
function describeIntent(intent: Intent, locale: Locale): string {
  const t = engineT(locale);
  const s = intent.slots;
  const parts: string[] = [intent.kind];
  if (s.passage) parts.push(formatRef(s.passage, 'long', locale));
  if (s.verse && !s.passage) parts.push(formatVerse(s.verse, 'long', locale));
  if (s.term) parts.push(t('trace.slot.term', { term: s.term }));
  if (s.topic) parts.push(t('trace.slot.topic', { topic: s.topic }));
  if (s.authorName) parts.push(t('trace.slot.author', { name: s.authorName }));
  if (s.traditionalAuthor) parts.push(t('trace.slot.by', { name: personName(s.traditionalAuthor, locale) }));
  if (s.bookFilter) parts.push(t('trace.slot.book', { book: locale === 'en' ? s.bookFilter : bookName(s.bookFilter, locale) }));
  if (s.language) parts.push(locale === 'en' ? s.language : t('language', { language: s.language }));
  return parts.join(' · ');
}

export class LocalStudyEngine implements StudyEngine {
  private readonly assembler: StudyAssembler;
  private seq = 0;
  private readonly topicPhrases = new Map<Locale, Promise<string[]>>();

  constructor(private readonly providers: ProviderRegistry) {
    this.assembler = new StudyAssembler(providers);
  }

  /* ---------------- public API ---------------- */

  async respond(message: string, ctx: EngineContext): Promise<EngineResult> {
    const locale = localeOf(ctx);
    const phrases = await this.knownTopicPhrases(locale);
    const classifierEnv: ClassifierEnv = {
      study: ctx.study,
      conversation: ctx.conversation,
      findAuthor: (t) => {
        try {
          return this.providers.sources.findAuthor(t);
        } catch {
          return undefined;
        }
      },
      isKnownTopic: (p) => bestPhraseScore(p, phrases) >= 0.9,
      ...(ctx.locale ? { locale: ctx.locale } : {}),
    };
    const parsed = classifyMessage(message, classifierEnv);
    if (parsed.lastVerse) await this.resolveLastVerse(parsed, ctx.study);
    try {
      return await this.dispatch(message, parsed, ctx);
    } catch (err) {
      return this.failure(message, parsed.intent, ctx, err);
    }
  }

  async openStudy(query: { studyId?: string; passage?: PassageRef; topic?: string }, ctx: EngineContext): Promise<EngineResult> {
    const kind: IntentKind = query.passage ? 'open-passage' : 'open-topic';
    const intent: Intent = {
      kind,
      confidence: 1,
      slots: { ...(query.passage ? { passage: query.passage } : {}), ...(query.topic ? { topic: normalizeTopicQuery(query.topic) || query.topic } : {}) },
    };
    const parsed: ParsedMessage = { intent, text: '', lower: '', references: [], relationships: [], refersToContext: false };
    const env = this.env('', parsed, ctx, ctx.study);
    try {
      let draft: ReplyDraft | undefined;
      if (query.studyId) draft = await openById(env, query.studyId);
      else if (query.passage) draft = await respondOpenPassage(env);
      else if (query.topic) draft = await respondOpenTopic(env);
      if (!draft) {
        const t = engineT(localeOf(ctx));
        draft = {
          blocks: [para(t('engine.unknownStudy', { id: query.studyId ?? '' }))],
          suggestions: startSuggestions(localeOf(ctx)),
          steps: [step('Library', t('trace.unknownStudy', { id: query.studyId ?? '' }), this.providers.studies.id)],
          declined: true,
        };
      }
      return this.finalize('', intent, ctx, draft);
    } catch (err) {
      return this.failure('', intent, ctx, err);
    }
  }

  /* ---------------- pipeline ---------------- */

  private env(message: string, parsed: ParsedMessage, ctx: EngineContext, study: Study | null): ResponderEnv {
    return { providers: this.providers, assembler: this.assembler, ctx, study, parsed, intent: parsed.intent, message };
  }

  private async dispatch(message: string, parsed: ParsedMessage, ctx: EngineContext): Promise<EngineResult> {
    const intent = parsed.intent;
    let env = this.env(message, parsed, ctx, ctx.study);

    if (FOLLOW_UPS.has(intent.kind)) {
      // A follow-up about another passage (or with no study open): open that passage first.
      const target = this.followUpTarget(parsed, ctx.study);
      if (target) {
        const opened = await respondOpenPassage(this.env(message, { ...parsed, intent: { kind: 'open-passage', confidence: intent.confidence, slots: { passage: target } } }, ctx, ctx.study), target);
        if (!opened.study) return this.finalize(message, intent, ctx, opened);
        const openedCtx: EngineContext = { ...ctx, study: opened.study, conversation: opened.conversation ?? {} };
        const inner = await this.run({ ...env, ctx: openedCtx, study: opened.study });
        if (!inner) return this.finalize(message, intent, ctx, opened);
        return this.finalize(message, intent, ctx, this.combine(opened, inner, localeOf(ctx)));
      }
      if (!ctx.study) return this.withoutStudy(message, parsed, ctx);
    }
    // A complex question with no study of its own: the library topic that covers most of it, saying what it raises
    // (with a study open, only when the study cannot answer it).
    const question = asksNewQuestion(message, intent, ctx.study);
    if (question && !ctx.study) {
      const keyed = await this.questionTopic(message, parsed, ctx);
      if (keyed) return this.finalize(message, keyed.intent ?? intent, ctx, keyed);
    }
    const draft = await this.run(env);
    if (question && ctx.study && (!draft || draft.declined)) {
      const keyed = await this.questionTopic(message, parsed, ctx);
      if (keyed) return this.finalize(message, keyed.intent ?? intent, ctx, keyed);
    }
    // "What is the fruit of the Spirit?" inside the Holy Spirit study resolves to the open study:
    // answer from inside it rather than saying "we're already here".
    if (draft?.alreadyOpen && intent.kind === 'open-topic' && ctx.study && intent.slots.topic) {
      const own = [ctx.study.title, ctx.study.topic?.name ?? ''].filter(Boolean);
      if (bestPhraseScore(intent.slots.topic, own) < 0.9) {
        const inside = await respondUnknown(env);
        if (!inside.declined) return this.finalize(message, intent, ctx, inside);
      }
    }
    if (draft) return this.finalize(message, intent, ctx, draft);
    // word-study with nothing curated to anchor it → treat the term as a topic
    env = this.env(message, { ...parsed, intent: { kind: 'open-topic', confidence: 0.5, slots: { topic: intent.slots.term ?? normalizeTopicQuery(message) } } }, ctx, ctx.study);
    const topicDraft = await respondOpenTopic(env);
    return this.finalize(message, env.intent, ctx, { ...topicDraft, intent: env.intent });
  }

  private async run(env: ResponderEnv): Promise<ReplyDraft | undefined> {
    switch (env.intent.kind) {
      case 'open-passage':
        return respondOpenPassage(env);
      case 'open-topic':
        return respondOpenTopic(env);
      case 'word-study':
        return respondWordStudy(env);
      case 'cross-references':
        return respondCrossReferences(env);
      case 'connect':
        return respondConnect(env);
      case 'commentary':
        return respondCommentary(env);
      case 'historical-context':
        return respondHistorical(env);
      case 'literary-context':
        return respondLiterary(env);
      case 'theology':
        return respondTheology(env);
      case 'perspectives':
        return respondPerspectives(env);
      case 'explain-verse':
        return respondExplainVerse(env);
      case 'sources':
        return respondSources(env);
      case 'greeting':
        return respondGreeting(env);
      case 'help':
        return respondHelp(env);
      default:
        return respondUnknown(env);
    }
  }

  /** Passage to open before answering a follow-up: an explicit reference outside the current study. */
  private followUpTarget(parsed: ParsedMessage, study: Study | null): PassageRef | undefined {
    if (parsed.intent.kind === 'connect' || parsed.references.length === 0) return undefined;
    const ref = parsed.intent.slots.passage ?? parsed.references[0];
    if (!ref) return undefined;
    if (study?.passage && refContains(study.passage, ref)) return undefined;
    // A topic study covers its anchor and key passages; any study covers the key texts of its perspectives.
    if (study?.kind === 'topic' && study.passage && refsOverlap(study.passage, ref)) return undefined;
    if (study?.topic?.keyPassages.some((k) => refsOverlap(k.ref, ref))) return undefined;
    if (parsed.intent.kind === 'perspectives' && study?.perspectives.some((ps) => ps.perspectives.some((p) => p.keyTexts?.some((k) => refsOverlap(k, ref))))) {
      return undefined;
    }
    if (ref.startVerse == null) return ref;
    // A verse inside a curated study (a passage study, or a topic study's anchor) opens that study at the verse;
    // otherwise a single verse opens its chapter, so the verse is read in context.
    const curated = Boolean(curatedForPassage({ providers: this.providers, ctx: {} }, ref));
    return curated ? ref : { book: ref.book, startChapter: ref.startChapter };
  }

  /** Follow-ups with no study open and no passage named. */
  private async withoutStudy(message: string, parsed: ParsedMessage, ctx: EngineContext): Promise<EngineResult> {
    const locale = localeOf(ctx);
    const t = engineT(locale);
    const intent = parsed.intent;
    const env = this.env(message, parsed, ctx, null);
    if (intent.kind === 'word-study') {
      const draft = await respondWordStudy(env);
      if (draft) return this.finalize(message, intent, ctx, draft);
      const topicIntent: Intent = { kind: 'open-topic', confidence: 0.5, slots: { topic: intent.slots.term ?? normalizeTopicQuery(message) } };
      const topicDraft = await respondOpenTopic(this.env(message, { ...parsed, intent: topicIntent }, ctx, null));
      return this.finalize(message, topicIntent, ctx, { ...topicDraft, intent: topicIntent });
    }
    if (intent.kind === 'commentary' && intent.slots.authorId) {
      const candidates = studiesWithAuthor(env, intent.slots.authorId);
      const query = normalizePhrase(message);
      const best = [...candidates].sort((a, b) => bestPhraseScore(query, b.match.topics) - bestPhraseScore(query, a.match.topics))[0];
      if (best) {
        const opened = openCurated(env, best);
        const study = opened.study!;
        const inner = await respondCommentary({ ...env, study, ctx: { ...ctx, study, conversation: {} } });
        return this.finalize(message, intent, ctx, this.combine(opened, inner, locale));
      }
      const name = intent.slots.authorName ?? intent.slots.authorId;
      return this.finalize(message, intent, ctx, {
        blocks: [para(t('engine.noAuthorSource', { name }))],
        suggestions: startSuggestions(locale),
        steps: [step('Commentary', t('trace.noStudyIncludes', { name }), this.providers.studies.id)],
        declined: true,
      });
    }
    return this.finalize(message, intent, ctx, {
      blocks: [para(t('engine.openFirst'))],
      suggestions: startSuggestions(locale),
      steps: [step('Study', t('trace.noStudyOpen'), 'engine:local-rules')],
    });
  }

  /** "I’ve opened X" + the follow-up answer, in one reply. */
  private combine(opened: ReplyDraft, inner: ReplyDraft, locale: Locale = 'en'): ReplyDraft {
    const study = opened.study!;
    const already = inner.announcesOpen || (inner.blocks[0]?.type === 'paragraph' && inner.blocks[0].text.startsWith(engineT(locale)('engine.openedPrefix')));
    return {
      ...inner,
      blocks: already ? inner.blocks : [para(engineT(locale)('engine.opened', { title: study.title, depth: study.depth })), ...inner.blocks],
      study,
      updates: [...(opened.updates ?? []).slice(0, 1), ...(inner.updates ?? [])],
      citations: mergeCitations(inner.citations),
      conversation: inner.conversation ?? {},
      steps: [...opened.steps, ...inner.steps],
      customUpdatesOnly: false,
    };
  }

  /**
   * The library topic a complex question turns on most ("…abusive relationship… divorce… a new marriage?"
   * → Marriage, by "divórcio" and "casamento"), opened with a note naming the points the question raises —
   * the library has no study of the question itself. Undefined when no topic phrase occurs in it.
   */
  private async questionTopic(message: string, parsed: ParsedMessage, ctx: EngineContext): Promise<ReplyDraft | undefined> {
    const locale = localeOf(ctx);
    const text = ` ${normalizePhrase(message)} `;
    const found = (await this.knownTopicPhrases(locale)).filter((p) => p.length > 2 && text.includes(` ${p} `));
    if (!found.length) return undefined;
    // Phrases inside a longer phrase found too ("marriage" in "christian marriage") are one point, not two.
    const phrases = found.filter((p) => !found.some((q) => q !== p && ` ${q} `.includes(` ${p} `))).sort((a, b) => text.indexOf(` ${a} `) - text.indexOf(` ${b} `));
    const byTopic = new Map<string, { phrases: string[]; weight: number }>();
    const points: string[] = [];
    for (const phrase of phrases) {
      const match = ((await attempt(() => this.providers.topics.findTopics(phrase, locale), [])) as TopicMatchLike[])[0];
      const id = match && match.score >= 0.9 ? match.id : `phrase:${phrase}`;
      const entry = byTopic.get(id) ?? { phrases: [], weight: 0 };
      entry.phrases.push(phrase);
      entry.weight += phrase.split(' ').length;
      byTopic.set(id, entry);
      // a word or two as the reader wrote it ("divórcio"); a longer index phrase ("how should i pray") by its topic's name
      const label = phrase.split(' ').length <= 2 || !match || match.score < 0.9 ? restoreSpelling(phrase, message) : lowerFirstIn(match.name, locale);
      if (!points.includes(label)) points.push(label);
    }
    const best = [...byTopic.values()].sort((a, b) => b.weight - a.weight || b.phrases[0].length - a.phrases[0].length)[0];
    const topic = [...best.phrases].sort((a, b) => b.length - a.length)[0];
    const intent: Intent = { kind: 'open-topic', confidence: 0.5, slots: { topic } };
    const draft = await respondOpenTopic(this.env(message, { ...parsed, intent }, ctx, ctx.study));
    if (!draft.study || draft.declined) return undefined;
    const t = engineT(locale);
    const named = points.map((p) => `**${p}**`);
    const study = t('studyName', { kind: draft.study.kind, title: draft.study.title });
    return {
      ...draft,
      intent,
      blocks: [para(t('question.keyPoints', { points: listJoin(named, locale), study })), ...draft.blocks],
      steps: [step('Question', t('trace.questionTopics', { points: phrases.join(', '), topic }), 'engine:local-rules'), ...draft.steps],
    };
  }

  private async resolveLastVerse(parsed: ParsedMessage, study: Study | null): Promise<void> {
    const p = study?.passage;
    if (!p) return;
    const chapter = p.endChapter ?? p.startChapter;
    const count = await attempt(() => this.providers.scripture.getVerseCount(p.book, chapter), 0);
    if (count > 0) {
      parsed.intent = { ...parsed.intent, slots: { ...parsed.intent.slots, verse: { book: p.book, chapter, verse: count } } };
      if (parsed.intent.kind === 'unknown') parsed.intent = { ...parsed.intent, kind: 'explain-verse' };
    }
  }

  /** Topic phrases the classifier treats as known topics: English plus the reader's language (overlay aliases). */
  private knownTopicPhrases(locale: Locale): Promise<string[]> {
    let phrases = this.topicPhrases.get(locale);
    if (!phrases) {
      phrases = (async () => {
        const topics = (await attempt(() => this.providers.topics.listTopics(locale), [])) as TopicMatchLike[];
        let studyTopics: string[] = [];
        try {
          studyTopics = this.providers.studies.list(locale).flatMap((s) => (s.kind === 'topic' ? [s.title, ...s.match.topics] : []));
        } catch {
          studyTopics = [];
        }
        return Array.from(new Set([...topics.flatMap((t) => [t.name, ...t.aliases]), ...studyTopics].map((p) => normalizeTopicQuery(p) || normalizePhrase(p)).filter(Boolean)));
      })();
      this.topicPhrases.set(locale, phrases);
    }
    return phrases;
  }

  /* ---------------- result ---------------- */

  private finalize(message: string, intent: Intent, ctx: EngineContext, draft: ReplyDraft): EngineResult {
    const locale = localeOf(ctx);
    const t = engineT(locale);
    const finalIntent = draft.intent ?? intent;
    const study = draft.study ?? ctx.study;
    const custom = draft.updates ?? [];
    const focusUpdates = (draft.customUpdatesOnly ? [] : describeFocus(draft.focus, study, this.providers.sources, ctx.translation, locale)).filter(
      (u) => !(u.label === broughtIntoView(u.section, locale) && custom.some((c) => c.section === u.section)),
    );
    const seen = new Set<string>();
    const updates = [...custom, ...focusUpdates].filter((u) => {
      const k = `${u.section}|${u.label}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const citations = mergeCitations(draft.citations);
    const provenance = draft.provenance ?? synthesis(...citations);
    const synthesisStep: PipelineStep = draft.declined
      ? step('Synthesis', t('trace.declined'), 'engine:local-rules')
      : step(
          'Synthesis',
          provenance.kind === 'synthesis'
            ? t('trace.templated', { count: citations.length })
            : t('trace.presented', { kind: provenance.kind, verification: provenance.verification }),
          'engine:local-rules',
        );
    const trace: PipelineStep[] = [step('Intent', describeIntent(finalIntent, locale), 'engine:local-rules'), ...draft.steps, synthesisStep];
    const suggestions = fillSuggestions(draft.suggestions, study, ctx.history, message, startSuggestions(locale), locale);
    const reply: ChatMessage = {
      id: `a-${study?.id ?? 'welcome'}-${++this.seq}`,
      role: 'assistant',
      text: blocksToPlainText(draft.blocks, study, this.providers.sources, locale),
      blocks: draft.blocks,
      citations,
      updates,
      suggestions,
      trace,
      ...(draft.declined ? { declined: true } : {}),
      provenance,
      ...(study ? { studyId: study.id } : {}),
      createdAt: Date.now(),
    };
    return {
      reply,
      ...(draft.study ? { study: draft.study } : {}),
      ...(draft.focus ? { focus: draft.focus } : {}),
      conversation: draft.conversation ?? ctx.conversation,
      intent: finalIntent,
      trace,
      ...(draft.inspector ? { inspector: draft.inspector } : {}),
    };
  }

  private failure(message: string, intent: Intent, ctx: EngineContext, err: unknown): EngineResult {
    const detail = err instanceof Error ? err.message : String(err);
    return this.finalize(message, intent, ctx, {
      blocks: [para(engineT(localeOf(ctx))('engine.failure'))],
      steps: [step('Error', detail.slice(0, 160), 'engine:local-rules')],
      declined: true,
    });
  }
}
