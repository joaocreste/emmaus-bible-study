/**
 * InferenceStudyEngine — the knowledge base + inference layer in front of the
 * deterministic LocalStudyEngine (docs/INFERENCE.md §6).
 *
 *   new study request ── curated study matches? ──yes──► LocalStudyEngine (instant, reviewed)
 *                        │ no
 *                        ├─ live composition enabled & available ─► POST /compose (streams the page)
 *                        └─ otherwise ─► LocalStudyEngine's library study + an honest note
 *   follow-up ─► LocalStudyEngine first; declined / not understood ─► POST /answer
 *
 * The model never supplies evidence: the server retrieves it from the knowledge base
 * and validates every generated claim against it. This engine only routes, forwards
 * the live events (progress steps, page snapshots) to the session, and turns the
 * outcome into an EngineResult — falling back to the local result, with a plain
 * explanation, whenever composition is off, unavailable or fails.
 */
import type { ChatMessage, DashboardUpdate, MessageBlock, PassageRef, PipelineStep, Provenance, SectionId, Study } from '../domain/models';
import { formatRef, formatVerse } from '../domain/reference';
import type { Locale } from '../i18n/locales';
import { clientMessageId, inferenceClient, SERVER_UNREACHABLE, type ClientMessageId, type InferenceClient, type InferenceError, type InferenceOutcome } from '../inference/client';
import { errorText as serverErrorText, statusReasonText } from '../inference/localize';
import type { AnswerRequest, ComposeRequest, InferenceEvent, InferenceStatus } from '../inference/protocol';
import type { ProviderRegistry } from '../providers/types';
import type { TopicMatchLike } from './assemble';
import { blocksToPlainText, engineT, localeOf, note, para } from './compose';
import { classifyMessage, type ClassifierEnv, type ParsedMessage } from './intent';
import { LocalStudyEngine } from './LocalStudyEngine';
import { asksNewQuestion } from './question';
import { attempt, step } from './respond/env';
import { bestPhraseScore, normalizePhrase, normalizeTopicQuery } from './text';
import type { EngineContext, EngineResult, Intent, IntentKind, StudyEngine } from './types';

export interface InferenceEngineOptions {
  /** the inference API client (default: the app-wide client) */
  client?: InferenceClient;
  /** reader setting "Live composition" (default: always on) */
  isEnabled?: () => boolean;
  /** the wrapped local engine (default: a LocalStudyEngine over the same providers) */
  local?: StudyEngine;
}

/** Engines that can recompose a generated page afresh (the study header's "Regenerate"). */
export interface StudyRegenerator {
  regenerate(study: Study, ctx: EngineContext): Promise<EngineResult>;
}

const PROVIDER = 'engine:inference';
const NOT_NEW_STUDY: ReadonlySet<IntentKind> = new Set(['greeting', 'help', 'sources']);
const HISTORY_TURNS = 8;
const HISTORY_CHARS = 1200;
/** The engine's own error message when a stream produced neither a page nor a reply nor an error. */
const RETURNED_NOTHING = 'The inference layer returned nothing.';

type Live = { state: 'on'; status: InferenceStatus } | { state: 'off' } | { state: 'unavailable'; status: InferenceStatus };

export class InferenceStudyEngine implements StudyEngine, StudyRegenerator {
  private readonly local: StudyEngine;
  private readonly client: InferenceClient;
  private readonly isEnabled: () => boolean;
  /** generated studies seen this session, by id (so earlier chat messages can reopen them) */
  private readonly generated = new Map<string, Study>();
  /** the hint each generated study was composed under, by id (Regenerate resends it, so the fresh page replaces the same cache entry) */
  private readonly hints = new Map<string, ComposeRequest['hint']>();
  /** unavailability reasons already explained in chat (explained once, then only traced) */
  private readonly explained = new Set<string>();
  private readonly topicPhrases = new Map<Locale, Promise<string[]>>();
  private seq = 0;

  constructor(
    private readonly providers: ProviderRegistry,
    options: InferenceEngineOptions = {},
  ) {
    this.local = options.local ?? new LocalStudyEngine(providers);
    this.client = options.client ?? inferenceClient;
    this.isEnabled = options.isEnabled ?? (() => true);
  }

  /* ---------------- public API ---------------- */

  async respond(message: string, ctx: EngineContext): Promise<EngineResult> {
    const parsed = await this.classify(message, ctx);
    const intent = parsed.intent;

    // The reader repeats the question the open generated page answers: stay on it.
    const open = ctx.study;
    if (open?.depth === 'generated' && sameQuery(open.generation?.query ?? open.title, message)) {
      return this.alreadyHere(open, intent, ctx);
    }

    const local = await this.local.respond(message, ctx);
    // A complex question of its own ("in an abusive marriage, may I divorce and remarry?") gets its own page.
    const question = asksNewQuestion(message, intent, open ?? null);

    // The local engine opened a different study: curated → keep it (unless it only covers part of a question);
    // library → compose instead when live.
    if (local.study && local.study.id !== open?.id) {
      if (local.study.depth === 'curated' && !question) return addSteps(local, [step('Routing', engineT(localeOf(ctx))('inference.curatedRoute'), PROVIDER)]);
      return this.composeOrFallback(message, intent, local, ctx, question);
    }

    if (question || (isNewStudyRequest(intent, ctx) && wantsNewPage(intent, local, ctx))) {
      return this.composeOrFallback(message, intent, local, ctx, question);
    }

    // A follow-up the page could not answer: research it in the knowledge base.
    if (open && needsResearch(local, message)) return this.answerOrFallback(message, local, ctx);
    return fromGeneratedPage(local, ctx);
  }

  async openStudy(query: { studyId?: string; passage?: PassageRef; topic?: string }, ctx: EngineContext): Promise<EngineResult> {
    if (query.studyId) {
      const generated = this.generated.get(query.studyId);
      if (generated) return this.reopen(generated, ctx);
      return this.local.openStudy(query, ctx);
    }
    const text = query.topic?.trim() || (query.passage ? safeFormatRef(query.passage, localeOf(ctx)) : '');
    const open = ctx.study;
    if (text && open?.depth === 'generated' && sameQuery(open.generation?.query ?? open.title, text)) {
      return this.alreadyHere(open, openIntent(query), ctx);
    }
    const local = await this.local.openStudy(query, ctx);
    if (local.study?.depth === 'curated') return addSteps(local, [step('Routing', engineT(localeOf(ctx))('inference.curatedRoute'), PROVIDER)]);
    if (!text || (!local.study && !local.reply.declined)) return local;
    return this.composeOrFallback(text, local.intent.kind === 'open-passage' || local.intent.kind === 'open-topic' ? local.intent : openIntent(query), local, ctx);
  }

  /** Compose the open generated page again, bypassing the server's page cache. */
  async regenerate(study: Study, ctx: EngineContext): Promise<EngineResult> {
    const query = study.generation?.query ?? study.topic?.name ?? study.title;
    const intent: Intent =
      study.kind === 'passage' && study.passage
        ? { kind: 'open-passage', confidence: 1, slots: { passage: study.passage } }
        : { kind: 'open-topic', confidence: 1, slots: { topic: study.topic?.name ?? query } };
    const live = await this.live(true);
    if (live.state !== 'on') {
      const t = engineT(localeOf(ctx));
      const why = live.state === 'off' ? t('inference.whyOff') : t('inference.whyUnavailable', { reason: statusPhrase(live.status, localeOf(ctx)) });
      return this.plain(ctx, intent, [para(t('inference.cantRegenerate', { title: study.title, why }))], [step('Routing', t('inference.regenerateSkipped', { why }), PROVIDER)], {
        declined: true,
      });
    }
    // Resend the hint the page was composed under; a topic page's anchor passage is not a passage hint.
    const hint = this.hints.has(study.id) ? this.hints.get(study.id) : hintFor(intent, study);
    return this.compose(query, intent, null, ctx, { regenerate: true, ...(hint ? { hint } : {}) });
  }

  /* ---------------- routing ---------------- */

  private async composeOrFallback(query: string, intent: Intent, local: EngineResult, ctx: EngineContext, question = false): Promise<EngineResult> {
    const live = await this.live();
    if (live.state !== 'on' && question) return this.questionWithoutLive(local, live, localeOf(ctx));
    if (live.state === 'off') return addSteps(local, [step('Routing', engineT(localeOf(ctx))('inference.offRoute'), PROVIDER)]);
    if (live.state === 'unavailable') return this.unavailable(local, live.status, localeOf(ctx));
    // A question is composed from its own words: neither the library entry the local engine fell back on
    // nor the classifier's topic reading of the whole sentence is a hint.
    return this.compose(query, intent, local, ctx, { hint: question ? {} : hintFor(intent, local.study) });
  }

  /**
   * A complex question needs a composed page; the library can cover only part of it. Say so every time,
   * with what would answer it — not only in the trace (off) or once per session (unavailable).
   */
  private questionWithoutLive(local: EngineResult, live: Exclude<Live, { state: 'on' }>, locale: Locale): EngineResult {
    const t = engineT(locale);
    const reason = live.state === 'off' ? undefined : statusPhrase(live.status, locale);
    const route = reason ? t('inference.unavailableRoute', { reason }) : t('inference.offRoute');
    const text = reason ? t('inference.questionUnavailable', { reason }) : t('inference.questionOff');
    return withNote(addSteps(local, [step('Routing', route, PROVIDER)]), 'caution', text);
  }

  private unavailable(local: EngineResult, status: InferenceStatus, locale: Locale): EngineResult {
    const t = engineT(locale);
    const reason = statusPhrase(status, locale);
    const traced = addSteps(local, [step('Routing', t('inference.unavailableRoute', { reason }), PROVIDER)]);
    if (this.explained.has(reason)) return traced;
    this.explained.add(reason);
    const instead = local.study ? ` ${t('inference.showingLibrary', { kind: local.study.kind })}` : '';
    return withNote(traced, 'info', `${t('inference.unavailable', { reason })}${instead}`);
  }

  private async compose(
    query: string,
    intent: Intent,
    fallback: EngineResult | null,
    ctx: EngineContext,
    options: { hint?: ComposeRequest['hint']; regenerate?: boolean },
  ): Promise<EngineResult> {
    const locale = localeOf(ctx);
    const t = engineT(locale);
    const routing = [
      step('Intent', describeIntent(intent, locale), PROVIDER),
      step(
        'Routing',
        options.regenerate
          ? t('inference.regenerateRoute')
          : fallback?.study
            ? t('inference.composeInstead', { query, kind: fallback.study.kind, title: fallback.study.title })
            : t('inference.compose', { query }),
        PROVIDER,
      ),
    ];
    const request: ComposeRequest = {
      query,
      translation: ctx.translation,
      ...(ctx.locale ? { locale: ctx.locale } : {}),
      ...(options.hint && (options.hint.passage || options.hint.topic) ? { hint: options.hint } : {}),
      ...(options.regenerate ? { regenerate: true } : {}),
    };
    ctx.onEvent?.({ type: 'phase', phase: 'compose' });
    let outcome: InferenceOutcome;
    try {
      outcome = await this.client.compose(request, { signal: ctx.signal, onEvent: (e) => this.forward(e, ctx) });
    } catch (error) {
      outcome = { complete: false, steps: [], error: { code: 'internal', message: error instanceof Error ? error.message : String(error) } };
    }

    if (outcome.study) this.hints.set(outcome.study.id, request.hint);
    if (outcome.error?.code === 'aborted') return this.stopped(query, intent, outcome, ctx, routing);
    if (outcome.study) {
      const study = outcome.study;
      this.generated.set(study.id, study);
      const trace = [...routing, ...outcome.steps, summaryStep(study, outcome, locale)];
      let reply = this.adoptReply(outcome.reply, study, trace, options.regenerate ? 'Regenerated' : 'Composed', locale);
      if (outcome.error || !outcome.complete) {
        const why = !outcome.error
          ? t('inference.streamEnded')
          : outcome.error.code === 'invalid-output'
            ? t('inference.partialUnverified')
            : errorPhrase(outcome.error, locale);
        reply = appendNote(reply, 'caution', t('inference.stoppedEarly', { why }));
      }
      return {
        reply,
        study,
        ...(outcome.focus ? { focus: outcome.focus } : {}),
        conversation: outcome.conversation ?? {},
        intent: pageIntent(intent, study, query),
        trace: reply.trace ?? trace,
      };
    }
    if (outcome.reply && !outcome.error) {
      // The server answered in chat without composing a page (e.g. nothing in the knowledge base fits).
      const trace = [...routing, ...outcome.steps];
      const reply = this.adoptReply(outcome.reply, ctx.study, trace, 'Composed', locale);
      return { reply, ...(outcome.focus ? { focus: outcome.focus } : {}), conversation: outcome.conversation ?? ctx.conversation, intent, trace };
    }

    const error = outcome.error ?? { code: 'internal', message: RETURNED_NOTHING };
    if (error.code === 'no-credentials') this.client.invalidateStatus();
    const failed = [...routing, ...outcome.steps, step('Inference', t('inference.composeFailed', { code: error.code, message: error.message }), 'inference:compose')];
    if (!fallback) {
      return this.plain(ctx, intent, [para(t('inference.couldNotRecompose')), note(errorTone(error), errorText(error, locale))], failed, { declined: true });
    }
    const instead = fallback.study ? ` ${t('inference.showingLibrary', { kind: fallback.study.kind })}` : '';
    return withNote(addSteps(fallback, failed.slice(1)), errorTone(error), `${errorText(error, locale)}${instead}`);
  }

  private async answerOrFallback(question: string, local: EngineResult, ctx: EngineContext): Promise<EngineResult> {
    const locale = localeOf(ctx);
    const t = engineT(locale);
    const study = ctx.study!;
    const live = await this.live();
    if (live.state !== 'on') return fromGeneratedPage(local, ctx);
    const routing = [step('Routing', t('inference.researchRoute'), PROVIDER)];
    const request: AnswerRequest = {
      question,
      study,
      history: historyOf(ctx.history),
      conversation: ctx.conversation,
      translation: ctx.translation,
      ...(ctx.locale ? { locale: ctx.locale } : {}),
    };
    ctx.onEvent?.({ type: 'phase', phase: 'answer' });
    let outcome: InferenceOutcome;
    try {
      outcome = await this.client.answer(request, { signal: ctx.signal, onEvent: (e) => this.forward(e, ctx) });
    } catch (error) {
      outcome = { complete: false, steps: [], error: { code: 'internal', message: error instanceof Error ? error.message : String(error) } };
    }
    if (outcome.error?.code === 'aborted') return fromGeneratedPage(local, ctx);
    if (outcome.reply) {
      const patched = outcome.study && outcome.study.id === study.id ? outcome.study : undefined;
      if (patched) this.generated.set(patched.id, patched);
      const trace = [...local.trace.slice(0, 1), ...routing, ...outcome.steps];
      let reply = this.adoptReply(outcome.reply, patched ?? study, trace, null, locale);
      if (outcome.error) reply = appendNote(reply, errorTone(outcome.error), t('inference.researchStopped', { why: errorPhrase(outcome.error, locale) }));
      return {
        reply,
        ...(patched ? { study: patched } : {}),
        ...(outcome.focus ? { focus: outcome.focus } : {}),
        conversation: outcome.conversation ?? ctx.conversation,
        intent: local.intent,
        trace,
      };
    }
    const error = outcome.error ?? { code: 'internal', message: RETURNED_NOTHING };
    if (error.code === 'no-credentials') this.client.invalidateStatus();
    return withNote(
      addSteps(local, [...routing, step('Inference', t('inference.researchFailed', { code: error.code, message: error.message }), 'inference:answer')]),
      'info',
      t('inference.alsoTried', { why: lowerFirst(errorText(error, locale)).replace(/\.$/, '') }),
    );
  }

  /** The reader started something else while the page was being composed. */
  private stopped(query: string, intent: Intent, outcome: InferenceOutcome, ctx: EngineContext, routing: PipelineStep[]): EngineResult {
    const locale = localeOf(ctx);
    const t = engineT(locale);
    const trace = [...routing, ...outcome.steps, step('Inference', t('inference.stoppedTrace'), 'inference:compose')];
    if (outcome.study) {
      const study = outcome.study;
      this.generated.set(study.id, study);
      const reply = this.message([para(t('inference.stoppedPage', { title: study.title }))], study, trace, {}, locale);
      return { reply, study, conversation: {}, intent: pageIntent(intent, study, query), trace };
    }
    return { reply: this.message([para(t('inference.stoppedQuery', { query }))], ctx.study, trace, {}, locale), conversation: ctx.conversation, intent, trace };
  }

  private reopen(study: Study, ctx: EngineContext): EngineResult {
    const locale = localeOf(ctx);
    const intent = pageIntent({ kind: 'open-topic', confidence: 1, slots: {} }, study, study.generation?.query ?? study.title);
    if (ctx.study?.id === study.id) return this.alreadyHere(study, intent, ctx);
    const trace = [
      step('Intent', describeIntent(intent, locale), PROVIDER),
      step('Routing', engineT(locale)('inference.reopenedRoute', { query: study.generation?.query ?? study.title }), PROVIDER),
    ];
    const reply = this.adoptReply(undefined, study, trace, 'Reopened', locale);
    return { reply, study, conversation: {}, intent, trace };
  }

  private alreadyHere(study: Study, intent: Intent, ctx: EngineContext): EngineResult {
    const locale = localeOf(ctx);
    const t = engineT(locale);
    const trace = [step('Intent', describeIntent(intent, locale), PROVIDER), step('Routing', t('inference.alreadyRoute', { query: study.generation?.query ?? study.title }), PROVIDER)];
    return this.plain(ctx, intent, [para(t('inference.alreadyHere', { title: study.title }))], trace, { focus: { section: 'overview' }, suggestions: study.suggestedQuestions });
  }

  /* ---------------- helpers ---------------- */

  private async live(force = false): Promise<Live> {
    if (!this.isEnabled()) return { state: 'off' };
    let status: InferenceStatus;
    try {
      status = await this.client.getStatus(force ? { force: true } : undefined);
    } catch {
      status = { available: false, model: '', reason: SERVER_UNREACHABLE, knowledgeBase: { documents: 0, corpora: [] } };
    }
    return status.available ? { state: 'on', status } : { state: 'unavailable', status };
  }

  /** Forward live events to the session (and remember partial pages so chat links can reopen them). */
  private forward(event: InferenceEvent, ctx: EngineContext): void {
    if (event.type === 'progress') ctx.onEvent?.({ type: 'progress', step: event.step });
    else if (event.type === 'study') {
      this.generated.set(event.study.id, event.study);
      ctx.onEvent?.({ type: 'study', study: event.study, complete: event.complete });
    }
  }

  /** The server's chat reply (or one built from the page), shaped for the chat panel. */
  private adoptReply(
    server: ChatMessage | undefined,
    study: Study | null,
    trace: PipelineStep[],
    opened: 'Composed' | 'Regenerated' | 'Reopened' | null,
    locale: Locale = 'en',
  ): ChatMessage {
    const blocks: MessageBlock[] = (server?.blocks?.length ? server.blocks : server?.text ? paragraphs(server.text) : study ? openingBlocks(study, locale) : []).map(
      stripBlockMarkers,
    );
    const citations = server?.citations ?? (server ? [] : (study?.opening?.provenance.citations ?? study?.summary?.provenance.citations ?? []));
    const provenance: Provenance = server?.provenance ?? (!server && study?.opening ? study.opening.provenance : { kind: 'synthesis', verification: 'generated', citations });
    const updates = server?.updates?.length ? server.updates : study && opened ? pageUpdates(study, opened, locale) : [];
    const suggestions = (server?.suggestions?.length ? server.suggestions : (study?.suggestedQuestions ?? [])).slice(0, 4);
    return {
      ...(server ?? {}),
      id: `a-${study?.id ?? 'inference'}-g${++this.seq}`,
      role: 'assistant',
      text: server?.text?.trim() ? stripEvidenceMarkers(server.text) : blocksToPlainText(blocks, study, this.providers.sources, locale),
      blocks,
      citations,
      updates,
      suggestions,
      provenance,
      trace,
      ...(study ? { studyId: study.id } : {}),
      createdAt: Date.now(),
    };
  }

  /** A plain assistant message (no page change). */
  private message(blocks: MessageBlock[], study: Study | null, trace: PipelineStep[], extra: Partial<ChatMessage> = {}, locale: Locale = 'en'): ChatMessage {
    return {
      id: `a-${study?.id ?? 'inference'}-g${++this.seq}`,
      role: 'assistant',
      text: blocksToPlainText(blocks, study, this.providers.sources, locale),
      blocks,
      citations: [],
      updates: [],
      trace,
      provenance: { kind: 'synthesis', verification: 'editorial', citations: [] },
      ...(study ? { studyId: study.id } : {}),
      createdAt: Date.now(),
      ...extra,
    };
  }

  private plain(
    ctx: EngineContext,
    intent: Intent,
    blocks: MessageBlock[],
    trace: PipelineStep[],
    extra: { declined?: boolean; focus?: EngineResult['focus']; suggestions?: string[] } = {},
  ): EngineResult {
    const reply = this.message(
      blocks,
      ctx.study,
      trace,
      {
        ...(extra.declined ? { declined: true } : {}),
        ...(extra.suggestions?.length ? { suggestions: extra.suggestions.slice(0, 4) } : {}),
      },
      localeOf(ctx),
    );
    return { reply, ...(extra.focus ? { focus: extra.focus } : {}), conversation: ctx.conversation, intent, trace };
  }

  private async classify(message: string, ctx: EngineContext): Promise<ParsedMessage> {
    const phrases = await this.knownTopicPhrases(localeOf(ctx));
    const env: ClassifierEnv = {
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
    return classifyMessage(message, env);
  }

  /** Same phrase list the local engine classifies with (topic index + curated topic studies, in the reader's language too). */
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
}

/* ------------------------------------------------------------------ */
/* Routing rules (pure)                                                */
/* ------------------------------------------------------------------ */

/** Does the message ask for a (new) study page: a passage or topic, or anything at all with no study open? */
export function isNewStudyRequest(intent: Intent, ctx: Pick<EngineContext, 'study'>): boolean {
  if (intent.kind === 'open-passage' || intent.kind === 'open-topic') return true;
  return !ctx.study && !NOT_NEW_STUDY.has(intent.kind);
}

/**
 * The local engine did not open a study for a new-study request: should a page be composed?
 * Not for a reference it already handled (a chapter a book does not have, a verse past the end,
 * a place inside the open study), nor when it answered from the open study; yes when it declined
 * or when no study is open.
 */
export function wantsNewPage(intent: Intent, local: EngineResult, ctx: Pick<EngineContext, 'study'>): boolean {
  if (intent.slots.invalidChapter) return false;
  if (intent.kind === 'open-passage' && intent.slots.passage) return false;
  if (ctx.study && !local.reply.declined) return false;
  return true;
}

/** A follow-up the local engine could not answer from the page. */
export function needsResearch(local: EngineResult, message: string): boolean {
  if (local.reply.declined) return true;
  if (local.intent.kind === 'unknown' && local.intent.confidence < 0.5) return true;
  return local.intent.kind === 'help' && local.intent.confidence < 0.7 && /[a-z]{3}/i.test(message);
}

/** What the reader's words named (never the library entry the local engine redirected to). */
function hintFor(intent: Intent, study: Study | undefined): ComposeRequest['hint'] {
  const passage = intent.slots.passage ?? (study?.kind === 'passage' ? study.passage : undefined);
  const topic = intent.slots.topic;
  return { ...(passage ? { passage } : {}), ...(topic ? { topic } : {}) };
}

function openIntent(query: { passage?: PassageRef; topic?: string }): Intent {
  return query.passage
    ? { kind: 'open-passage', confidence: 1, slots: { passage: query.passage } }
    : { kind: 'open-topic', confidence: 1, slots: query.topic ? { topic: normalizeTopicQuery(query.topic) || query.topic } : {} };
}

/** The intent recorded for a composed page (the session uses it for the ?q= verse anchor). */
function pageIntent(intent: Intent, study: Study, query: string): Intent {
  if (intent.kind === 'open-passage' || intent.kind === 'open-topic') return intent;
  if (study.kind === 'passage' && study.passage) return { kind: 'open-passage', confidence: intent.confidence, slots: { passage: study.passage } };
  return { kind: 'open-topic', confidence: intent.confidence, slots: { topic: normalizeTopicQuery(query) || query } };
}

function describeIntent(intent: Intent, locale: Locale = 'en'): string {
  const t = engineT(locale);
  const s = intent.slots;
  const parts: string[] = [intent.kind];
  if (s.passage) parts.push(safeFormatRef(s.passage, locale) || '');
  if (s.verse && !s.passage) parts.push(formatVerse(s.verse, 'long', locale));
  if (s.topic) parts.push(t('trace.slot.topic', { topic: s.topic }));
  if (s.term) parts.push(t('trace.slot.term', { term: s.term }));
  return parts.filter(Boolean).join(' · ');
}

function sameQuery(a: string, b: string): boolean {
  const norm = (s: string) => normalizePhrase(s).replace(/[?.!]+$/, '');
  const x = norm(a);
  return x.length > 0 && x === norm(b);
}

function safeFormatRef(ref: PassageRef, locale: Locale = 'en'): string {
  try {
    return formatRef(ref, 'long', locale);
  } catch {
    return '';
  }
}

function historyOf(messages: ChatMessage[]): AnswerRequest['history'] {
  return messages
    .filter((m): m is ChatMessage & { role: 'user' | 'assistant' } => (m.role === 'user' || m.role === 'assistant') && m.text.trim().length > 0)
    .slice(-HISTORY_TURNS)
    .map((m) => ({ role: m.role, text: m.text.length > HISTORY_CHARS ? `${m.text.slice(0, HISTORY_CHARS - 1)}…` : m.text }));
}

/* ------------------------------------------------------------------ */
/* Replies                                                             */
/* ------------------------------------------------------------------ */

function paragraphs(text: string): MessageBlock[] {
  return text
    .split(/\n{2,}/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(para);
}

function openingBlocks(study: Study, locale: Locale): MessageBlock[] {
  const blocks = paragraphs(study.opening?.text ?? study.summary?.text ?? '');
  return blocks.length ? blocks : [para(engineT(locale)('inference.openingFallback', { title: study.title }))];
}

/** "Study updated" lines for a composed page. */
function pageUpdates(study: Study, verb: 'Composed' | 'Regenerated' | 'Reopened', locale: Locale): DashboardUpdate[] {
  const t = engineT(locale);
  const first: SectionId = study.passage && study.kind === 'passage' ? 'scripture' : study.topic ? 'key-passages' : 'overview';
  const u: DashboardUpdate[] = [{ section: first, label: t('inference.update.page', { verb: verb.toLowerCase(), title: study.title }) }];
  const n = study.topic?.keyPassages.length ?? 0;
  if (n) u.push({ section: 'key-passages', label: t('inference.update.keyPassages', { count: n }) });
  if (study.crossReferences.length) u.push({ section: 'cross-references', label: t('inference.update.crossRefs', { count: study.crossReferences.length }) });
  if (study.keyWords.length) u.push({ section: 'original-languages', label: t('inference.update.keyWords', { count: study.keyWords.length }) });
  if (study.perspectives.length) u.push({ section: 'theology', label: t('open.update.questions', { count: study.perspectives.length }) });
  const voices = new Set(study.commentary.map((c) => c.authorId)).size;
  if (voices) u.push({ section: 'commentary', label: t('inference.update.voices', { count: voices }) });
  return u.slice(0, 4);
}

function summaryStep(study: Study, outcome: InferenceOutcome, locale: Locale = 'en'): PipelineStep {
  const t = engineT(locale);
  const g = study.generation;
  if (!g) return step('Page', t('inference.pageSummary', { complete: outcome.complete ? 'yes' : 'no', count: study.sourceIds.length }), 'inference:compose');
  const parts = [
    g.cached ? t('inference.fromCache') : t('inference.composedBy', { model: g.model }),
    t('inference.evidence', { evidence: g.evidenceCount, calls: g.retrievalCalls }),
    ...(g.rejectedItems ? [t('inference.rejected', { count: g.rejectedItems })] : []),
  ];
  return step('Page', parts.join(' · '), 'inference:compose');
}

/**
 * The request-local evidence ids the model cites ("[E3]", "[E1, E4]") mean nothing to the reader —
 * the reply's citations carry the sources — so they are removed from any text that reaches the chat.
 */
export function stripEvidenceMarkers(text: string): string {
  // The space before a marker goes with it: "text [E1]." → "text.", "a [E1, E4] b" → "a b".
  return text.replace(/[ \t]*\[E\d+(?:\s*[,;–-]\s*E?\d+)*\]/g, '');
}

function stripBlockMarkers(block: MessageBlock): MessageBlock {
  switch (block.type) {
    case 'paragraph':
    case 'note':
      return { ...block, text: stripEvidenceMarkers(block.text) };
    case 'list':
      return { ...block, items: block.items.map(stripEvidenceMarkers) };
    default:
      return block;
  }
}

/**
 * A local answer on a generated page that cites the page's content is drawn from generated,
 * unreviewed material: label it so, instead of as editorial synthesis from the reviewed library.
 * (Replies without citations — help, greetings, "I couldn't find…" — keep their own label.)
 */
function fromGeneratedPage(result: EngineResult, ctx: Pick<EngineContext, 'study'>): EngineResult {
  const p = result.reply.provenance;
  if (ctx.study?.depth !== 'generated' || result.study || !p || p.kind !== 'synthesis' || p.verification !== 'editorial') return result;
  if (p.citations.length === 0 && !(result.reply.citations?.length ?? 0)) return result;
  return { ...result, reply: { ...result.reply, provenance: { ...p, verification: 'generated' } } };
}

function withNote(result: EngineResult, tone: 'info' | 'caution', text: string): EngineResult {
  return { ...result, reply: appendNote(result.reply, tone, text) };
}

function appendNote(reply: ChatMessage, tone: 'info' | 'caution', text: string): ChatMessage {
  const blocks = [...(reply.blocks?.length ? reply.blocks : [para(reply.text)]), note(tone, text)];
  return { ...reply, blocks, text: `${reply.text}\n\n${text}` };
}

/** Add routing/inference steps right after the Intent step (reply trace and result trace alike). */
function addSteps(result: EngineResult, steps: PipelineStep[]): EngineResult {
  const insert = (t: PipelineStep[]) => (t.length ? [t[0], ...steps, ...t.slice(1)] : steps);
  const trace = insert(result.trace);
  return { ...result, trace, reply: { ...result.reply, trace: result.reply.trace ? insert(result.reply.trace) : trace } };
}

function errorTone(error: InferenceError): 'info' | 'caution' {
  return error.code === 'refusal' || error.code === 'invalid-output' ? 'caution' : 'info';
}

/** Plain words for a failed composition — what happened and what the reader can do. */
export function errorText(error: InferenceError, locale: Locale = 'en'): string {
  const t = engineT(locale);
  switch (error.code) {
    case 'no-credentials':
      return t('inference.error.no-credentials');
    case 'refusal':
      return t('inference.error.refusal');
    case 'rate-limited':
      return t('inference.error.rate-limited');
    case 'overloaded':
      return t('inference.error.overloaded');
    case 'invalid-output':
      return t('inference.error.invalid-output');
    case 'aborted':
      return t('inference.error.aborted');
    default:
      return t('inference.error.failed', { why: errorPhrase(error, locale) });
  }
}

/**
 * Why composition is unavailable, as a clause in the reader's words: the client's own messages and the
 * server's codes come from the catalog; a server's free text (setup details, model ids) is never shown.
 */
function statusPhrase(status: InferenceStatus, locale: Locale): string {
  if (clientMessageId(status.reason)) return phrase(status.reason, locale);
  return phrase(statusReasonText(status, locale), locale);
}

/** A failed run's message as a clause, in the reader's words (see statusPhrase). */
function errorPhrase(error: InferenceError, locale: Locale): string {
  if (clientMessageId(error.message) || error.message.trim() === RETURNED_NOTHING) return phrase(error.message, locale);
  return phrase(serverErrorText(error, locale), locale);
}

/**
 * A reason/message as a clause: trimmed, no final full stop, first letter lowered unless it is an acronym.
 * The client's own messages are shown in the reader's words, from the catalog.
 */
function phrase(text: string | undefined, locale: Locale = 'en'): string {
  const known: ClientMessageId | undefined = clientMessageId(text);
  const raw = known
    ? engineT(locale)(`inference.client.${known}`)
    : text?.trim() === RETURNED_NOTHING
      ? engineT(locale)('inference.returnedNothing')
      : text;
  const t = (raw ?? '').trim().replace(/[.\s]+$/, '');
  if (!t) return engineT(locale)('inference.noServer');
  return lowerFirst(t);
}

/** "The study…" → "the study…", "A geração…" → "a geração…"; acronyms ("API") stay. */
function lowerFirst(s: string): string {
  return /^\p{Lu}(\p{Ll}|\s)/u.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
}
