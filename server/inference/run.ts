/**
 * One inference run — a compose (new study page) or an answer (follow-up about the open
 * page). Wires the pieces together:
 *
 *   model turn (loop.ts) → tool calls → research (research.ts → ledger.ts)
 *                                     → composition (validate.ts → page.ts)
 *                        → tool results (what was accepted / rejected and why) → next turn
 *
 * and streams InferenceEvents as it goes: `progress` per tool call, a `study` snapshot
 * after begin_page and after every accepted add_section (complete:false; composition calls
 * run as soon as their block has streamed, so these arrive while the turn is still being
 * written), the final snapshot (complete:true), the chat `reply`, then `done` (always last,
 * after `error` too).
 */
import type {
  ChatMessage,
  Citation,
  ConversationState,
  DashboardFocus,
  DashboardUpdate,
  GenerationInfo,
  MessageBlock,
  PassageRef,
  PipelineStep,
  Provenance,
  SectionId,
  Study,
  TranslationId,
  VerseRef,
} from '../../src/domain/models';
import { findReferences, formatRef, parseReference, refKey } from '../../src/domain/reference';
import type { Locale } from '../../src/i18n/locales';
import { messages as inferenceMessages } from '../../src/i18n/messages/inference';
import { messages as studyMessages } from '../../src/i18n/messages/study';
import { formatMessage, type Params } from '../../src/i18n/translate';
import type { AnswerRequest, ComposeRequest, EvidenceDraft, InferenceEvent } from '../../src/inference/protocol';
import type { KbHoldings, KnowledgeBase } from '../kb/types';
import { composeCacheKey, generatorVersion, type PageCache, type PageFingerprint } from './cache';
import { AddSectionInput, COMPOSE_TOOLS, isComposeTool, zodIssues, type PageSection } from './composeTools';
import type { InferenceConfig } from './config';
import { classifyError, ERROR_MESSAGES, InferenceError } from './errors';
import { EvidenceLedger } from './ledger';
import type { DecisionLog, RunLog, RunLogWriter, ToolCallLog } from './logs';
import { runToolLoop, type EarlyCall, type LoopEnd, type ToolExecution, type TurnRecord } from './loop';
import type { BetaMessageParam, BetaTextBlockParam, BetaTool, BetaToolUseBlock, ModelClient } from './modelClient';
import { DEFAULT_SECTION_TITLE, PageBuilder } from './page';
import { answerUserMessage, ANSWER_SYSTEM_PROMPT, COMPOSE_SYSTEM_PROMPT, composeNowMessage, composeUserMessage, CORE_SYSTEM_PROMPT, knowledgeBaseNote } from './prompt';
import { RefChecker } from './refs';
import { isResearchTool, prepareResearchCall, RESEARCH_TOOLS, type PreparedCall } from './research';
import { shortHash } from './text';
import { authorOf, Validator, type Decision } from './validate';

/* ------------------------------------------------------------------ */
/* Stable request prefix (tools → system): identical for every request */
/* ------------------------------------------------------------------ */

/** Research tools then composition tools — one fixed list for compose and answer (shared cache). */
export const ALL_TOOLS: BetaTool[] = [...RESEARCH_TOOLS, ...COMPOSE_TOOLS];

export function systemBlocks(flow: 'compose' | 'answer', holdings?: KbHoldings | null): BetaTextBlockParam[] {
  const note = knowledgeBaseNote(holdings);
  return [
    // breakpoint 1: tools + core prompt, shared by compose and answer
    { type: 'text', text: CORE_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    // breakpoint 2: + the flow's task prompt
    { type: 'text', text: flow === 'compose' ? COMPOSE_SYSTEM_PROMPT : ANSWER_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    // what the knowledge base holds: stable while the knowledge base is unchanged (cached by the automatic breakpoint)
    ...(note ? [{ type: 'text' as const, text: note }] : []),
  ];
}

/* ------------------------------------------------------------------ */
/* Dependencies                                                        */
/* ------------------------------------------------------------------ */

export interface RunDeps {
  kb: KnowledgeBase;
  /** null when no credential is configured (→ 'no-credentials', but cached pages are still served) */
  client: ModelClient | null;
  config: InferenceConfig;
  cache?: PageCache | null;
  writeLog?: RunLogWriter | null;
  now?: () => number;
  /** complete text behind excerpted evidence (server/kb `evidenceFullText`) for quotation checks */
  fullText?: (draft: EvidenceDraft) => string;
  /** waits before re-issuing a turn after a transient API failure (default loop RETRY_DELAYS_MS) */
  retryDelaysMs?: readonly number[];
  /** told how each model run ended (null: the Claude API served it; an error: it did not) — the server's /status uses it */
  onOutcome?: (error: InferenceError | null) => void;
}

export type Emit = (event: InferenceEvent) => void;

const PROVIDER_COMPOSE = 'inference:compose';
const PROVIDER_VALIDATOR = 'inference:validator';
const PROVIDER_CACHE = 'inference:cache';

const SECTION_LABEL: Record<SectionId, string> = {
  overview: 'Overview',
  scripture: 'Scripture',
  sources: 'Sources',
  ...DEFAULT_SECTION_TITLE,
};

/* ------------------------------------------------------------------ */
/* Shared run state                                                    */
/* ------------------------------------------------------------------ */

class Run {
  readonly ledger: EvidenceLedger;
  readonly refs: RefChecker;
  readonly validator: Validator;
  readonly steps: PipelineStep[] = [];
  readonly stepTimes: number[] = [];
  readonly toolCalls: ToolCallLog[] = [];
  readonly decisions: DecisionLog[] = [];
  readonly turns: TurnRecord[] = [];
  /** section → items the validator removed (latest decision for replaced sections) */
  private readonly rejectedBy = new Map<string, number>();
  /** sections (and item ids) added by this run */
  readonly added = new Map<PageSection, string[]>();
  researchCalls = 0;
  /** logs of composition calls that ran while their turn streamed, by tool_use id */
  private readonly earlyLogs = new Map<string, ToolCallLog>();
  /** composition calls (by tool_use id) that were rejected, wholly or in part */
  private readonly rejectedCalls = new Set<string>();
  /** takes the run back to where it was before the current turn's first early call (discardEarly) */
  private undoEarly: (() => void) | null = null;
  /** the API error that interrupted a composition whose checked sections were kept */
  interruption: InferenceError | null = null;
  private budgetSent = false;
  finished = false;
  replyResult: NonNullable<Awaited<ReturnType<Validator['reply']>>['reply']> | null = null;
  readonly startedAt: number;
  readonly holdings: KbHoldings | null;

  constructor(
    readonly flow: 'compose' | 'answer',
    readonly deps: RunDeps,
    readonly emit: Emit,
    readonly builder: PageBuilder,
    readonly translation: TranslationId,
    /** answer flow: may this page be extended? (generated pages only) */
    readonly extendable: boolean,
    /** the reader's own words (their question), for checks that may echo what the reader named */
    readonly readerText = '',
    /** the page language */
    readonly locale: Locale = 'en',
  ) {
    const providers = deps.kb.providers;
    const authorName = (e: Parameters<typeof authorOf>[0]) => {
      const id = authorOf(e, providers);
      try {
        return id ? providers.sources.getAuthor(id)?.name : undefined;
      } catch {
        return undefined;
      }
    };
    this.ledger = new EvidenceLedger({ ...(deps.fullText ? { fullText: deps.fullText } : {}), authorName });
    this.refs = new RefChecker(providers.scripture, locale);
    this.holdings = kbHoldings(deps.kb);
    this.validator = new Validator(
      { ledger: this.ledger, refs: this.refs, providers, ...(this.holdings ? { holdings: this.holdings } : {}), ...(readerText ? { readerText } : {}), translation, locale },
      builder.nextId,
    );
    this.startedAt = this.now();
  }

  /** turns a model completed (failed attempts are recorded for their usage only) */
  get servedTurns(): TurnRecord[] {
    return this.turns.filter((t) => !t.failed);
  }

  /** a fallback model served at least one turn */
  get usedFallback(): boolean {
    return this.servedTurns.some((t) => t.fallback);
  }

  now(): number {
    return (this.deps.now ?? Date.now)();
  }

  get config(): InferenceConfig {
    return this.deps.config;
  }

  get maxResearchCalls(): number {
    return this.flow === 'compose' ? this.config.maxResearchCalls : this.config.maxAnswerResearchCalls;
  }

  get rejectedItems(): number {
    let n = 0;
    for (const v of this.rejectedBy.values()) n += v;
    return n;
  }

  /** the model that answered the latest turn (differs from the configured one after a server-side fallback) */
  get modelUsed(): string {
    const served = this.servedTurns;
    return served[served.length - 1]?.model || this.config.model;
  }

  progress(step: PipelineStep): void {
    this.steps.push(step);
    this.stepTimes.push(this.now() - this.startedAt);
    this.emit({ type: 'progress', step });
  }

  generation(): Partial<GenerationInfo> {
    const rejected = this.rejectedItems;
    return {
      model: this.modelUsed,
      evidenceCount: this.ledger.size,
      retrievalCalls: this.researchCalls,
      ...(rejected ? { rejectedItems: rejected } : {}),
    };
  }

  snapshot(): Study {
    return this.flow === 'compose' ? this.builder.snapshot(this.generation()) : this.builder.snapshot();
  }

  /* ---------------- loop hooks ---------------- */

  budgetMessage(): string | null {
    if (this.budgetSent || this.finished || this.replyResult) return null;
    const max = this.maxResearchCalls;
    const elapsed = this.now() - this.startedAt;
    const reason = this.researchCalls >= max ? 'calls' : elapsed >= this.config.researchMs ? 'time' : null;
    if (!reason) return null;
    this.budgetSent = true;
    this.progress({
      stage: 'Budget',
      detail: reason === 'calls' ? `Research budget reached (${this.researchCalls} lookups) — composing from what was found` : 'Research time limit reached — composing from what was found',
      provider: PROVIDER_COMPOSE,
      ...(this.flow === 'compose' ? { reader: { kind: 'writing' } as const } : {}),
    });
    return composeNowMessage(reason, this.researchCalls, max, this.flow);
  }

  nudge(attempt: number): string | null {
    if (attempt > 2) return null;
    if (this.flow === 'answer') {
      return 'You ended your turn without answering. Call the reply tool now with your answer and its evidence ids (or declined: true, saying plainly what the knowledge base lacks).';
    }
    if (!this.builder.hasBegun) {
      return 'You ended your turn without starting the page. Call begin_page now with add_section for each section the evidence supports, all in one turn; finish_page comes in the turn after. Write nothing outside the tools.';
    }
    return 'The page is not finished. Call finish_page now, after add_section for any remaining section the evidence supports, all in one turn. Write nothing outside the tools.';
  }

  onTurn(record: TurnRecord): void {
    this.turns.push(record);
    if (record.fallback && !record.failed) {
      this.progress({ stage: 'Model', detail: `The request was served by the fallback model (${record.model})`, provider: `anthropic:${record.model}` });
    }
  }

  /** loop hook: composition calls run as soon as their block has streamed (the reader sees each section appear) */
  runsEarly(name: string): boolean {
    return isComposeTool(name);
  }

  /** A composition call run while its turn streams. Logged now (it changed the page even if the turn then fails); its result goes back with the turn's other results. */
  async executeEarly(b: BetaToolUseBlock, turn: number, before: readonly EarlyCall[]): Promise<ToolExecution> {
    // the turn's first early call: what a declined response must be able to take back
    if (!before.length) this.undoEarly = this.saveState();
    const started = this.now();
    const exec = await this.composeCall(b, turn, this.sectionRejectedIn(before.map((c) => c.block)));
    const log: ToolCallLog = { turn, id: b.id, name: b.name, input: b.input, isError: exec.isError, evidence: [], result: exec.content.slice(0, 1200), ms: this.now() - started };
    this.toolCalls.push(log);
    this.earlyLogs.set(b.id, log);
    return exec;
  }

  /**
   * The response these early calls came from was declined (a refusal, or a fallback model took over
   * partway): nothing it wrote may stay on the page. The run goes back to where it was before them
   * and the reader is sent the page as it was (the log keeps the calls, marked withdrawn).
   */
  discardEarly(calls: readonly EarlyCall[]): void {
    const undo = this.undoEarly;
    this.undoEarly = null;
    if (!undo || !calls.length) return;
    undo();
    for (const { block } of calls) {
      const log = this.earlyLogs.get(block.id);
      if (log) log.result = `[withdrawn: the response was declined] ${log.result}`;
    }
    // an accepted begin_page or add_section sent the reader a snapshot: send the page as it is again
    if (!calls.some(({ block, result }) => !result.isError && (block.name === 'begin_page' || block.name === 'add_section'))) return;
    this.progress({ stage: 'Check', detail: 'The model declined partway through its response — what that response had added to the page was withdrawn', provider: PROVIDER_VALIDATOR });
    this.emit({ type: 'study', study: this.snapshot(), complete: this.flow === 'answer' });
  }

  /** The run's page state (page, accepted items, outcome flags), restored by the function returned. */
  private saveState(): () => void {
    const page = this.builder.save();
    const itemEvidence = new Map(this.validator.itemEvidence);
    const added = new Map(this.added);
    const rejectedBy = new Map(this.rejectedBy);
    const { finished, replyResult } = this;
    return () => {
      this.builder.restore(page);
      refill(this.validator.itemEvidence, itemEvidence);
      refill(this.added, added);
      refill(this.rejectedBy, rejectedBy);
      this.finished = finished;
      this.replyResult = replyResult;
    };
  }

  /** Was an add_section among these calls (earlier in the same turn) rejected, wholly or in part? A finish_page or reply after it was written before the model saw what the page lost. */
  private sectionRejectedIn(blocks: readonly BetaToolUseBlock[]): boolean {
    return blocks.some((b) => b.name === 'add_section' && this.rejectedCalls.has(b.id));
  }

  /** A turn failed after some of its calls ran and is sent again: what the server already did with them, and the page as it stands. */
  retryNote(calls: readonly EarlyCall[]): string | null {
    if (!calls.length) return null;
    const lines = calls.map(({ block, result }) => `${block.name}${sectionOf(block.input)}: ${result.content}`);
    const next =
      this.flow !== 'compose'
        ? 'What they added stays on the page (items sent again are skipped). Continue with the calls that did not arrive.'
        : `${this.builder.hasBegun ? `Page so far: ${this.builder.sections.map((s) => this.builder.describe(s)).join('; ') || 'no sections'}.` : 'Nothing is on the page yet.'} ` +
          'Do not send those calls again unless you are correcting one (a section sent again replaces its earlier version); continue with the calls that did not arrive.';
    return ['Your previous response was cut off before it ended. The server had already checked the calls it completed:', ...lines, next].join('\n\n');
  }

  async executeTools(blocks: BetaToolUseBlock[], turn: number, early: ReadonlyMap<string, ToolExecution>): Promise<ToolExecution[]> {
    const results: ToolExecution[] = new Array(blocks.length);
    const logs: ToolCallLog[] = new Array(blocks.length);
    // calls that ran while the turn streamed (logged then): their results only
    blocks.forEach((b, i) => {
      const exec = early.get(b.id);
      if (exec) results[i] = exec;
    });
    const done = (i: number, started: number, exec: ToolExecution, evidence: string[] = []): ToolExecution => {
      const b = blocks[i];
      logs[i] = { turn, id: b.id, name: b.name, input: b.input, isError: exec.isError, evidence, result: exec.content.slice(0, 1200), ms: this.now() - started };
      return exec;
    };
    const research = blocks.filter((b) => isResearchTool(b.name)).length;
    // result text shared by the turn's research calls; an item that does not fit is listed without its text (read_document opens it)
    const budgetChars = Math.max(6000, Math.min(16000, Math.floor(50000 / Math.max(1, research))));

    // Phase 1 — validate research calls and start their lookups concurrently (progress as they start).
    const pending = new Map<number, { call: PreparedCall; drafts: Promise<Awaited<ReturnType<PreparedCall['fetch']>>>; started: number }>();
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (!isResearchTool(b.name)) continue;
      const started = this.now();
      if (this.researchCalls >= this.maxResearchCalls) {
        results[i] = done(i, started, {
          content: `Research budget reached (${this.researchCalls} of ${this.maxResearchCalls} calls used). Do not call research tools again; ${this.flow === 'compose' ? 'compose the page from the evidence already retrieved' : 'answer with reply from the evidence already retrieved'}.`,
          isError: true,
        });
        continue;
      }
      const prepared = await prepareResearchCall(b.name, b.input, { kb: this.deps.kb, ledger: this.ledger, refs: this.refs, translation: this.translation });
      if (!prepared.ok) {
        results[i] = done(i, started, { content: `Error: ${prepared.error}\n(Not counted against the research budget.)`, isError: true });
        continue;
      }
      this.researchCalls++;
      this.progress(prepared.call.step);
      const drafts = prepared.call.fetch();
      drafts.catch(() => {}); // observed below, in order
      pending.set(i, { call: prepared.call, drafts, started });
    }

    // Phase 2 — in block order: add research results to the ledger (deterministic ids), run composition calls.
    // Evidence first shown by this turn's results cannot be cited by its composition calls, written before the model read it.
    this.ledger.beginTurn();
    for (let i = 0; i < blocks.length; i++) {
      if (results[i]) continue;
      const b = blocks[i];
      const p = pending.get(i);
      if (p) {
        try {
          const drafts = await p.drafts;
          const entries = this.ledger.addAll(drafts);
          const extra = p.call.after?.(drafts) ?? null;
          const body = entries.length ? this.ledger.render(entries, budgetChars) : extra ? '' : p.call.empty;
          const content = [body, extra ?? '', entries.length && p.call.note ? p.call.note : ''].filter(Boolean).join('\n\n');
          results[i] = done(i, p.started, { content, isError: false }, entries.map((e) => e.evidence.id));
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          results[i] = done(i, p.started, { content: `The knowledge base could not complete this lookup (${message}). Try a different request.`, isError: true });
        }
        continue;
      }
      const started = this.now();
      if (isComposeTool(b.name)) {
        results[i] = done(i, started, await this.composeCall(b, turn, this.sectionRejectedIn(blocks.slice(0, i))));
        continue;
      }
      results[i] = done(i, started, { content: `Unknown tool “${b.name}”.`, isError: true });
    }
    this.ledger.endTurn();
    const last = blocks.findLastIndex((b) => isComposeTool(b.name));
    const summary = last >= 0 ? this.turnSummary(blocks) : null;
    if (summary) {
      results[last] = { ...results[last], content: `${results[last].content}\n\n${summary}` };
      const result = results[last].content.slice(0, 1200);
      // a call that ran while the turn streamed was logged then
      const earlyLog = this.earlyLogs.get(blocks[last].id);
      const at = earlyLog ? this.toolCalls.indexOf(earlyLog) : -1;
      if (at >= 0) this.toolCalls[at] = { ...this.toolCalls[at], result };
      else logs[last] = { ...logs[last], result };
    }
    this.toolCalls.push(...logs.filter(Boolean));
    return results;
  }

  /**
   * One composition call, validated and applied the same way whether it runs while the turn streams or
   * after it. `afterRejection`: an add_section earlier in the same turn was rejected, wholly or in part.
   */
  private async composeCall(b: BetaToolUseBlock, turn: number, afterRejection: boolean): Promise<ToolExecution> {
    const decided = this.decisions.length;
    let exec: ToolExecution;
    try {
      exec = await this.compose(b, turn, afterRejection);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      exec = { content: `The server could not check this call (${message}). Try again.`, isError: true };
    }
    for (const d of this.decisions.slice(decided)) d.callId = b.id;
    if (exec.isError || this.decisions.slice(decided).some((d) => d.rejected.length > 0)) this.rejectedCalls.add(b.id);
    return exec;
  }

  /**
   * Said once per turn, after the turn's last composition call (so each add_section result stays
   * short): the page so far and the next step — sections and repairs go in one turn, finish_page
   * with any repairs in the next. Compose flow only; nothing once the page is finished.
   */
  private turnSummary(blocks: readonly BetaToolUseBlock[]): string | null {
    if (this.flow !== 'compose' || this.finished) return null;
    if (!this.builder.hasBegun) return 'Nothing is on the page yet: send begin_page again, with every add_section after it, in one turn.';
    if (this.builder.sectionCount === 0) return 'Page so far: no sections. Next, send add_section for every section the evidence supports, in page order, in one turn; finish_page comes in the turn after.';
    // this turn's calls only (not those of an attempt at it that failed and was sent again)
    const problems = this.sectionRejectedIn(blocks);
    return (
      `Page so far: ${this.builder.sections.map((s) => this.builder.describe(s)).join('; ')}.` +
      (problems
        ? ' If a rejected item matters, call add_section again for its section with the complete corrected list; otherwise leave it out. Send any repairs, any missing section and finish_page together in your next turn.'
        : ' Next, send finish_page (after any missing section) in one turn.')
    );
  }

  /* ---------------- composition tools ---------------- */

  private async compose(b: BetaToolUseBlock, turn: number, afterRejection: boolean): Promise<ToolExecution> {
    switch (b.name) {
      case 'begin_page':
        return this.flow === 'compose' ? this.beginPage(b.input, turn) : error('begin_page is not available for follow-up answers. Research if needed, optionally add_section, then call reply.');
      case 'add_section':
        return this.addSection(b.input, turn);
      case 'finish_page':
        return this.flow === 'compose' ? this.finishPage(b.input, turn, afterRejection) : error('finish_page is not available for follow-up answers. Call reply with your answer.');
      case 'reply':
        return this.flow === 'answer' ? this.reply(b.input, turn, afterRejection) : error('reply is only for follow-up answers. Compose the page with begin_page, add_section and finish_page.');
      default:
        return error(`Unknown tool “${b.name}”.`);
    }
  }

  private record(turn: number, tool: string, d: Decision, extra: { section?: string; mode?: string } = {}): void {
    this.decisions.push({ turn, tool, ...extra, accepted: d.accepted, rejected: d.rejected, warnings: d.warnings, notes: d.notes });
    if (process.env.DEBUG_REJECTIONS) for (const r of [...d.rejected.map((x) => `REJ ${x.item}: ${x.reason}`), ...d.warnings.map((w) => `WARN ${w}`)]) console.error(`[${tool}] ${r}`);
  }

  private async beginPage(input: unknown, turn: number): Promise<ToolExecution> {
    const r = await this.validator.beginPage(input);
    const again = this.builder.hasBegun && this.builder.sectionCount > 0;
    if (r.page && again) {
      // sections were validated against this page's kind and passage: those cannot change any more
      const same = r.page.kind === this.builder.kind && (r.page.passage ? refKey(r.page.passage) : '') === (this.builder.passage ? refKey(this.builder.passage) : '');
      if (!same) {
        const where = this.builder.passage ? ` on ${formatRef(this.builder.passage)}` : '';
        r.rejected.push({ item: 'begin_page', reason: `the page has already begun as a ${this.builder.kind} page${where} and has sections; a second begin_page may only update title, subtitle, question and summary — keep kind and passage as they are` });
        r.accepted = 0;
        this.record(turn, 'begin_page', r);
        return { content: report('begin_page was rejected; the page is unchanged.', r), isError: true };
      }
    }
    this.record(turn, 'begin_page', r);
    if (!r.page) {
      this.progress({ stage: 'Check', detail: 'The page header did not pass the source checks — the model is repairing it', provider: PROVIDER_VALIDATOR });
      return {
        content: report(again ? 'begin_page was rejected; the page is unchanged.' : 'begin_page was rejected; nothing is on the page yet. Fix the problems below and call begin_page again.', r),
        isError: true,
      };
    }
    this.builder.begin(r.page);
    this.rejectedBy.set('begin', 0);
    this.progress({ stage: 'Compose', detail: `Started the page “${r.page.title}”`, provider: PROVIDER_COMPOSE, reader: { kind: 'writing', title: r.page.title } });
    this.emit({ type: 'study', study: this.snapshot(), complete: false });
    const where = r.page.passage ? `${r.page.kind === 'passage' ? 'page passage' : 'anchor passage'} ${formatRef(r.page.passage)}` : 'no Scripture section';
    // what comes next is said once per turn, in turnSummary
    return { content: report(`Page started: “${r.page.title}” (${r.page.kind} page, ${where}).`, r), isError: false };
  }

  private async addSection(input: unknown, turn: number): Promise<ToolExecution> {
    if (this.flow === 'compose' && !this.builder.hasBegun) return error('Call begin_page first; add_section extends a page that has been started.');
    if (this.flow === 'answer' && !this.extendable) {
      return error('This page is an editor-reviewed or library study and cannot be extended here. Answer with reply only.');
    }
    const parsed = AddSectionInput.safeParse(input);
    if (!parsed.success) return error(`Invalid add_section input (${zodIssues(parsed.error)}). Send one section per call with its fields.`);
    const data = parsed.data;
    const mode: 'replace' | 'append' = this.flow === 'answer' ? 'append' : (data.mode ?? 'replace');
    const result = await this.validator.section(data, this.builder.info(), mode);
    const meta = await this.sectionMeta(data.title, data.intro, result);
    const theologyNote =
      result.payload?.section === 'theology' && mode === 'replace'
        ? ` Replaced ${[result.payload.themes.length ? 'themes' : '', result.payload.perspectives.length ? 'perspectives' : ''].filter(Boolean).join(' and ')}; the other list is unchanged.`
        : '';
    this.record(turn, 'add_section', result, { section: data.section, mode });
    const key = `section:${data.section}`;
    this.rejectedBy.set(key, mode === 'replace' ? result.rejected.length : (this.rejectedBy.get(key) ?? 0) + result.rejected.length);
    const title = meta.title || this.builder.sectionTitle(data.section);

    if (!result.payload) {
      this.progress({
        stage: 'Check',
        detail: `${title}: nothing passed the source checks${result.rejected.length ? ` (${result.rejected.length} item${result.rejected.length === 1 ? '' : 's'} removed)` : ''}`,
        provider: PROVIDER_VALIDATOR,
      });
      return {
        content: report(`add_section ${data.section} was rejected — nothing was added to the page.`, result),
        isError: true,
      };
    }
    // only what is now on the page: an append skips items already there (e.g. sent again by a re-issued turn)
    const ids = this.builder.apply(result.payload, meta, mode);
    if (ids.length) this.added.set(data.section, [...(this.added.get(data.section) ?? []), ...ids]);
    const removed = result.rejected.length;
    this.progress({
      stage: 'Compose',
      detail: `${this.flow === 'answer' ? 'Extended' : 'Added'} ${this.builder.describe(data.section)}${removed ? ` (${removed} item${removed === 1 ? '' : 's'} removed by the source checks)` : ''}`,
      provider: PROVIDER_COMPOSE,
      reader: { kind: 'section', section: data.section },
    });
    this.emit({ type: 'study', study: this.snapshot(), complete: this.flow === 'answer' });
    // kept short: the page so far and how to repair are said once per turn, in turnSummary
    const head =
      `Accepted ${result.accepted} item${result.accepted === 1 ? '' : 's'} in ${data.section}${removed ? `; rejected ${removed}` : ''}` +
      (this.flow === 'answer' ? ' (follow-ups append to the page; items already on it are skipped).' : ` (mode ${mode}).${theologyNote}`);
    return { content: report(head, result), isError: false };
  }

  /** Section heading and intro are uncited framing text: short, and nothing that would need evidence (references outside the page passage, names, traditions, dates, quotations, URLs). */
  private async sectionMeta(title: string | undefined, intro: string | undefined, d: Decision): Promise<{ title?: string; intro?: string }> {
    const out: { title?: string; intro?: string } = {};
    const page = this.builder.info();
    if (title) {
      const problem = await this.validator.framingProblem(title, 'title', page);
      if (problem) d.warnings.push(`section title dropped: ${problem}`);
      else out.title = title;
    }
    if (intro) {
      const problem = await this.validator.framingProblem(intro, 'intro', page);
      if (problem) d.warnings.push(`section intro dropped: ${problem}`);
      else out.intro = intro;
    }
    return out;
  }

  private async finishPage(input: unknown, turn: number, afterRejection: boolean): Promise<ToolExecution> {
    if (!this.builder.hasBegun) return error('Call begin_page first.');
    if (this.builder.sectionCount === 0) return error('Add at least one section with add_section before finish_page.');
    // the opening and concepts describe the page: they cannot be written before the model has seen what a rejection took off it
    if (afterRejection) {
      return error(
        'finish_page was not accepted: an add_section earlier in this turn was rejected (wholly or in part), and this opening was written before you saw what the page lost. Read the results above, then send finish_page in your next turn, describing only what is on the page.',
      );
    }
    const r = await this.validator.finish(input, this.builder.info());
    this.record(turn, 'finish_page', r);
    this.rejectedBy.set('finish', r.rejected.length);
    if (!r.opening) {
      this.progress({ stage: 'Check', detail: 'The opening message did not pass the source checks — the model is repairing it', provider: PROVIDER_VALIDATOR });
      return { content: report('finish_page was rejected: the opening message must cite evidence and pass the checks. Fix it and call finish_page again.', r), isError: true };
    }
    this.builder.finish(r, this.validator.itemEvidence);
    this.finished = true;
    this.progress({
      stage: 'Compose',
      detail: `Finished the page — opening message, ${r.concepts.length} follow-up concept${r.concepts.length === 1 ? '' : 's'}, ${r.suggestedQuestions.length} suggested question${r.suggestedQuestions.length === 1 ? '' : 's'}`,
      provider: PROVIDER_COMPOSE,
    });
    return { content: report('The page is finished. Do not call any more tools.', r), isError: false };
  }

  private async reply(input: unknown, turn: number, afterRejection: boolean): Promise<ToolExecution> {
    // like finish_page: an answer written alongside a page extension may speak of items that did not land
    if (afterRejection) {
      return error(
        'reply was not accepted: an add_section earlier in this turn was rejected (wholly or in part), and this answer was written before you saw what the page lost. Read the results above, then call reply in your next turn, referring only to what is on the page.',
      );
    }
    const r = await this.validator.reply(input, { page: this.builder.info(), readerText: this.readerText });
    this.record(turn, 'reply', r);
    if (!r.reply) {
      this.progress({ stage: 'Check', detail: 'The answer did not pass the source checks — the model is repairing it', provider: PROVIDER_VALIDATOR });
      return { content: report('reply was rejected. Fix the problems below and call reply again.', r), isError: true };
    }
    this.replyResult = r.reply;
    this.progress({
      stage: 'Answer',
      detail: r.reply.declined ? 'Declined — the knowledge base does not hold what this needs (nothing invented)' : `Answer written from ${r.reply.evidenceIds.length} evidence item${r.reply.evidenceIds.length === 1 ? '' : 's'}`,
      provider: PROVIDER_COMPOSE,
    });
    return { content: report('Answer accepted. Do not call any more tools.', r), isError: false };
  }

  /* ---------------- reply building ---------------- */

  synthesisStep(): PipelineStep {
    const removed = this.rejectedItems;
    const lookups = `${this.researchCalls} knowledge-base lookup${this.researchCalls === 1 ? '' : 's'}`;
    const tail = removed ? `; ${removed} item${removed === 1 ? '' : 's'} removed by the source checks` : '';
    if (this.flow === 'answer' && this.replyResult) {
      const cited = this.citedIds().size;
      const detail = this.replyResult.declined
        ? `Declined by ${this.modelUsed} after ${lookups}: the knowledge base does not hold what this needs${cited ? ` (the answer cites the ${cited} item${cited === 1 ? '' : 's'} it does hold)` : ''}; nothing was supplied from memory`
        : `Answered by ${this.modelUsed}, citing ${cited} of ${this.ledger.size} retrieved evidence item${this.ledger.size === 1 ? '' : 's'} (${lookups}); every statement cites its evidence`;
      return { stage: 'Synthesis', detail: detail + tail, provider: PROVIDER_VALIDATOR };
    }
    const cited = this.citedIds().size;
    return {
      stage: 'Synthesis',
      detail: `Composed by ${this.modelUsed}, citing ${cited} of ${this.ledger.size} retrieved evidence item${this.ledger.size === 1 ? '' : 's'} (${lookups}); every statement cites its evidence${tail}`,
      provider: PROVIDER_VALIDATOR,
    };
  }

  /** Ledger ids cited by accepted items and the reply. */
  citedIds(): Set<string> {
    const out = new Set<string>();
    for (const ids of this.validator.itemEvidence.values()) for (const id of ids) out.add(id);
    for (const id of this.replyResult?.evidenceIds ?? []) out.add(id);
    return out;
  }

  log(request: unknown, studyId: string, end: string, err: InferenceError | null, cached: boolean): RunLog {
    const usage = { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 };
    for (const t of this.turns) {
      usage.input += t.usage.input;
      usage.output += t.usage.output;
      usage.cacheRead += t.usage.cacheRead;
      usage.cacheCreation += t.usage.cacheCreation;
    }
    const fp = pageFingerprint(this.deps);
    return {
      flow: this.flow,
      request,
      studyId,
      model: this.config.model,
      modelUsed: this.modelUsed,
      fallbackTurns: this.servedTurns.filter((t) => t.fallback).length,
      versions: { kb: fp.kb, generator: fp.generator },
      effort: this.config.effort,
      budgets: { maxResearchCalls: this.maxResearchCalls, researchMs: this.config.researchMs, totalMs: this.config.totalMs, maxTurns: this.config.maxTurns },
      startedAt: new Date(this.startedAt).toISOString(),
      durationMs: this.now() - this.startedAt,
      cached,
      outcome: {
        end,
        ...(err ? { error: { code: err.code, message: err.message, ...(err.upstream ? { upstream: err.upstream } : {}) } } : {}),
        ...(!err && this.interruption ? { interruption: { code: this.interruption.code, message: this.interruption.message, ...(this.interruption.upstream ? { upstream: this.interruption.upstream } : {}) } } : {}),
      },
      researchCalls: this.researchCalls,
      ledger: this.ledger.all(),
      toolCalls: this.toolCalls,
      decisions: this.decisions,
      turns: this.turns,
      usage,
      steps: this.steps.map((s, i) => ({ ...s, atMs: this.stepTimes[i] ?? 0 })),
    };
  }
}

/* ------------------------------------------------------------------ */
/* Compose                                                             */
/* ------------------------------------------------------------------ */

export async function runCompose(req: ComposeRequest, deps: RunDeps, emit: Emit, signal: AbortSignal): Promise<void> {
  const { config } = deps;
  const now = deps.now ?? Date.now;
  const { key, studyId } = composeCacheKey(req, config.model);
  let run: Run | null = null;
  let end = 'error';
  let failure: InferenceError | null = null;
  let cached = false;
  try {
    await deps.kb.ready();
    const fingerprint = pageFingerprint(deps);
    // 1. Page cache (a page from another knowledge base, generator, effort or budget is a miss)
    if (deps.cache && !req.regenerate) {
      const hit = await deps.cache.get(key, fingerprint).catch(() => null);
      if (hit) {
        cached = true;
        end = 'cache';
        const step: PipelineStep = { stage: 'Cache', detail: `Opened the page composed earlier for “${req.query}” (use Regenerate to compose it afresh)`, provider: PROVIDER_CACHE };
        emit({ type: 'progress', step });
        const study: Study = { ...hit.study, generation: { ...(hit.study.generation as GenerationInfo), cached: true } };
        emit({ type: 'study', study, complete: true });
        const reply: ChatMessage = { ...hit.reply, id: `a-${study.id}-${shortHash(`${now()}`, 6)}`, trace: [step, ...(hit.reply.trace ?? [])], studyId: study.id, createdAt: now() };
        emit({ type: 'reply', reply, focus: { section: 'overview' }, conversation: {} });
        return;
      }
    }
    if (!deps.client) throw new InferenceError('no-credentials', ERROR_MESSAGES['no-credentials']);

    // 2. Run state
    const builder = new PageBuilder(
      deps.kb.providers,
      PageBuilder.shell(studyId, { model: config.model, query: req.query.trim(), createdAt: now(), evidenceCount: 0, retrievalCalls: 0 }),
      { begun: false },
    );
    run = new Run('compose', deps, emit, builder, req.translation, true, req.query, req.locale ?? 'en');
    const recognised = await recognisePassage(req, run.refs);
    run.progress({
      stage: 'Model',
      detail: `${config.model} is planning the research for “${req.query.trim()}”`,
      provider: `anthropic:${config.model}`,
      reader: { kind: 'planning' },
    });

    // 3. Model loop
    const messages: BetaMessageParam[] = [
      {
        role: 'user',
        content: composeUserMessage({
          query: req.query.trim(),
          translation: req.translation,
          ...(recognised ? { recognisedPassage: recognised } : {}),
          ...(req.hint?.topic ? { topicHint: req.hint.topic } : {}),
          maxResearchCalls: config.maxResearchCalls,
          ...(req.locale ? { locale: req.locale } : {}),
        }),
      },
    ];
    let stop: ComposeEnd;
    try {
      stop = (await loopWithDeadline(run, deps.client, messages, signal)).end;
    } catch (err) {
      // An API failure after sections were accepted (a transient one whose retries ran out, or
      // one that will not go away, such as an account problem): keep the checked sections, like
      // the deadline does. Refusals, aborts and our own errors are not salvaged.
      const e = classifyError(err, signal);
      const apiFailure = e.code === 'overloaded' || e.code === 'rate-limited' || e.code === 'no-credit' || (e.code === 'internal' && e.upstream);
      if (signal.aborted || !apiFailure || !(builder.hasBegun && builder.sectionCount > 0)) throw err;
      run.progress({ stage: 'Model', detail: `The Claude API failed while composing (${e.message}) — finishing the page with the sections already checked`, provider: `anthropic:${config.model}` });
      stop = 'interrupted';
      run.interruption = e;
    }
    end = stop;

    // 4. Final page + reply
    const r = run;
    if (!builder.finished && !(builder.hasBegun && builder.sectionCount > 0)) {
      throw new InferenceError('invalid-output', incompleteMessage(stop));
    }
    const partial = !r.finished;
    if (partial) builder.finishWithoutOpening();
    r.progress(r.synthesisStep());
    const study = r.snapshot();
    emit({ type: 'study', study, complete: true });
    const reply = await composeReply(r, study, partial ? stop : null);
    emit({ type: 'reply', reply, focus: { section: 'overview' }, conversation: {} });
    // only complete pages, composed by the configured model, are cached
    if (!partial && !r.usedFallback && deps.cache) {
      await deps.cache
        .put({ version: 2, key, fingerprint, query: req.query.trim(), translation: req.translation, locale: req.locale ?? 'en', model: config.model, modelUsed: r.modelUsed, createdAt: now(), study, reply })
        .catch(() => {});
    }
  } catch (err) {
    failure = classifyError(err, signal);
    if (failure.code === 'aborted') end = 'aborted';
    if (failure.code === 'refusal' && run?.builder.hasBegun) {
      failure = new InferenceError('refusal', 'The model declined to continue composing this page. The sections shown so far passed the source checks, but the page is incomplete and was not saved.');
    }
    emit({ type: 'error', code: failure.code, message: failure.message });
  } finally {
    emit({ type: 'done' });
    if (run || failure) deps.onOutcome?.(failure ?? run?.interruption ?? null);
    if (deps.writeLog && (run || failure || cached)) {
      const log = run
        ? run.log(req, studyId, end, failure, cached)
        : minimalLog('compose', req, studyId, deps, end, failure, cached);
      await deps.writeLog(log).catch(() => null);
    }
  }
}

/** How a composition ended: the loop's end, or a transient API failure after sections were accepted. */
type ComposeEnd = LoopEnd | 'interrupted';

/** What produced a page: knowledge-base version, generator version, effort, research budget. */
export function pageFingerprint(deps: Pick<RunDeps, 'kb' | 'config'>): PageFingerprint {
  let kb = 'unknown';
  try {
    kb = deps.kb.stats().version ?? 'unknown';
  } catch {
    /* informational */
  }
  return { kb, generator: generatorVersion(deps.config.root), effort: deps.config.effort, maxResearchCalls: deps.config.maxResearchCalls };
}

function kbHoldings(kb: KnowledgeBase): KbHoldings | null {
  try {
    return kb.holdings();
  } catch {
    return null;
  }
}

async function recognisePassage(req: ComposeRequest, refs: RefChecker): Promise<PassageRef | undefined> {
  const parsed = parseReference(req.query);
  if (parsed && !(await refs.problem(parsed))) return parsed;
  if (req.hint?.passage && !(await refs.problem(req.hint.passage))) return req.hint.passage;
  return undefined;
}

function incompleteMessage(end: ComposeEnd): string {
  switch (end) {
    case 'deadline':
      return 'The page could not be composed within the time limit. Please try again.';
    case 'max_tokens':
      return 'The model’s output was cut off before the page could be composed.';
    default:
      return `${ERROR_MESSAGES['invalid-output']} Nothing was published.`;
  }
}

async function composeReply(run: Run, study: Study, stoppedEarly: ComposeEnd | null): Promise<ChatMessage> {
  const opening = study.opening ?? study.summary;
  const text = opening?.text ?? study.title;
  const blocks: MessageBlock[] = await toBlocks(text, run.refs);
  if (stoppedEarly) {
    blocks.push({
      type: 'note',
      tone: 'caution',
      // in the reader's words and language: what the page lacks, never the API error behind it (that is in the log)
      text:
        stoppedEarly === 'deadline'
          ? answerText(run.locale, 'compose.stopped.deadline', {})
          : stoppedEarly === 'interrupted'
            ? answerText(run.locale, 'compose.stopped.interrupted', {
                sections: run.builder.sections.map((s) => localSectionTitle(run, s)).join(', ') || answerText(run.locale, 'compose.noSections', {}),
                theology: run.builder.sections.includes('theology') ? 'yes' : 'no',
              })
            : answerText(run.locale, 'compose.stopped.other', {}),
    });
  }
  const updates: DashboardUpdate[] = (study.layout?.sections ?? [])
    .filter((s): s is { id: PageSection } => s.id !== 'scripture' && s.id !== 'sources' && s.id !== 'overview')
    .map((s) => ({ section: s.id, label: answerText(run.locale, `compose.count.${s.id}`, { count: run.builder.itemCount(s.id), section: localSectionTitle(run, s.id) }) }));
  const provenance: Provenance = opening?.provenance ?? { kind: 'synthesis', verification: 'generated', citations: [] };
  return {
    id: `a-${study.id}-${shortHash(`${run.now()}`, 6)}`,
    role: 'assistant',
    text: stoppedEarly ? `${text}\n\n${(blocks[blocks.length - 1] as { text: string }).text}` : text,
    blocks,
    citations: dedupeCitations(provenance.citations),
    updates,
    suggestions: study.suggestedQuestions.slice(0, 4),
    trace: [...run.steps],
    provenance,
    studyId: study.id,
    createdAt: run.now(),
  };
}

/* ------------------------------------------------------------------ */
/* Answer                                                              */
/* ------------------------------------------------------------------ */

export async function runAnswer(req: AnswerRequest, deps: RunDeps, emit: Emit, signal: AbortSignal): Promise<void> {
  const { config } = deps;
  const now = deps.now ?? Date.now;
  const study = req.study;
  let run: Run | null = null;
  let end = 'error';
  let failure: InferenceError | null = null;
  const logRequest = { question: req.question, studyId: study.id, studyTitle: study.title, depth: study.depth, historyTurns: req.history.length, translation: req.translation };
  try {
    if (!deps.client) throw new InferenceError('no-credentials', ERROR_MESSAGES['no-credentials']);
    await deps.kb.ready();
    const builder = new PageBuilder(deps.kb.providers, study, { begun: true, idPrefix: `${study.id}:f${shortHash(`${req.question}|${now()}`, 6)}` });
    run = new Run('answer', deps, emit, builder, req.translation, study.depth === 'generated', req.question, req.locale ?? 'en');
    run.progress({ stage: 'Model', detail: `${config.model} is researching your question`, provider: `anthropic:${config.model}`, reader: { kind: 'planning' } });
    const messages: BetaMessageParam[] = [{ role: 'user', content: answerUserMessage(req, config.maxAnswerResearchCalls) }];
    const outcome = await loopWithDeadline(run, deps.client, messages, signal);
    end = outcome.end;
    const r = run;
    if (!r.replyResult) throw new InferenceError('invalid-output', 'The model did not produce an answer that passes the source checks.');
    r.progress(r.synthesisStep());
    const patched = r.added.size > 0 ? r.snapshot() : study;
    const { reply, focus } = await answerReply(r, req, patched);
    const verse = focus.highlightVerses?.[0];
    const conversation: ConversationState = { ...req.conversation, ...(verse ? { activeVerse: verse } : {}) };
    emit({ type: 'reply', reply, focus, conversation });
  } catch (err) {
    failure = classifyError(err, signal);
    if (failure.code === 'aborted') end = 'aborted';
    if (failure.code === 'refusal') {
      failure = new InferenceError(
        'refusal',
        run && run.added.size > 0
          ? 'The model declined to finish this answer. The items it added to the page passed the source checks.'
          : 'The model declined to answer this follow-up, so no answer was generated.',
      );
    }
    emit({ type: 'error', code: failure.code, message: failure.message });
  } finally {
    emit({ type: 'done' });
    deps.onOutcome?.(failure);
    if (deps.writeLog) {
      const log = run ? run.log(logRequest, study.id, end, failure, false) : minimalLog('answer', logRequest, study.id, deps, end, failure, false);
      await deps.writeLog(log).catch(() => null);
    }
  }
}

async function answerReply(run: Run, req: AnswerRequest, study: Study): Promise<{ reply: ChatMessage; focus: DashboardFocus }> {
  const r = run.replyResult!;
  const present = run.builder.info().sections;
  const sectionOk = (s: SectionId) => s === 'overview' || s === 'sources' || present.has(s);
  const addedIds = Array.from(run.added.values()).flat();
  const addedSections = Array.from(run.added.keys());
  const focusSection: SectionId = r.focus && sectionOk(r.focus.section) ? r.focus.section : (addedSections[0] ?? 'overview');
  const highlightVerses: VerseRef[] = r.focus?.verses ?? [];
  const wordIds = run.added.get('original-languages') ?? [];
  const focus: DashboardFocus = {
    section: focusSection,
    ...(highlightVerses.length ? { highlightVerses } : {}),
    ...(wordIds.length ? { highlightWordIds: wordIds } : {}),
    ...(addedIds.length ? { expandIds: addedIds, pinIds: addedIds } : {}),
    ...(addedSections.length ? { reason: answerText(run.locale, 'answer.reason', { list: addedSections.map((s) => addedLabel(run, s)).join('; ') }) } : {}),
  };
  const updates: DashboardUpdate[] = addedSections.map((s) => ({ section: s, label: answerText(run.locale, 'answer.added', { what: addedLabel(run, s) }) }));
  if (!addedSections.includes(focusSection as PageSection) && focusSection !== 'overview') updates.push({ section: focusSection, label: answerText(run.locale, 'answer.opened', { section: localSectionTitle(run, focusSection) }) });
  const blocks = await toBlocks(r.text, run.refs);
  const reply: ChatMessage = {
    id: `a-${study.id}-${shortHash(`${req.question}|${run.now()}`, 6)}`,
    role: 'assistant',
    text: r.text,
    blocks,
    citations: dedupeCitations(r.citations),
    updates,
    suggestions: r.suggestions,
    trace: [...run.steps],
    provenance: r.provenance,
    ...(r.declined ? { declined: true } : {}),
    studyId: study.id,
    createdAt: run.now(),
  };
  return { reply, focus };
}

/** "2 voices to Voices from the tradition": what this answer added to a section (not the section's total), in the page language. */
function addedLabel(run: Run, section: PageSection): string {
  const count = run.added.get(section)?.length ?? 0;
  return answerText(run.locale, `answer.count.${section}`, { count, section: localSectionTitle(run, section) });
}

/** A section's title as the reader sees it: the model's own title for it, else the app's title in the page language. */
function localSectionTitle(run: Run, section: SectionId): string {
  const custom = section === 'overview' || section === 'scripture' || section === 'sources' ? undefined : run.builder.customTitle(section);
  if (custom) return custom;
  const key = `section.${section}.title` as keyof (typeof studyMessages)['en'];
  return studyMessages[run.locale]?.[key] ?? SECTION_LABEL[section];
}

function answerText(locale: Locale, key: string, params: Params): string {
  const catalog = (inferenceMessages[locale] ?? inferenceMessages.en) as Record<string, string>;
  return formatMessage(locale, catalog[key] ?? (inferenceMessages.en as Record<string, string>)[key] ?? key, params);
}

/* ------------------------------------------------------------------ */
/* Loop with deadline                                                  */
/* ------------------------------------------------------------------ */

async function loopWithDeadline(run: Run, client: ModelClient, messages: BetaMessageParam[], parent: AbortSignal): Promise<{ end: LoopEnd; turns: number }> {
  const controller = new AbortController();
  let deadline = false;
  const onAbort = () => controller.abort(parent.reason);
  if (parent.aborted) controller.abort(parent.reason);
  else parent.addEventListener('abort', onAbort, { once: true });
  const timer = setTimeout(() => {
    deadline = true;
    controller.abort(new Error('deadline'));
  }, run.config.totalMs);
  timer.unref?.();
  try {
    return await runToolLoop(
      {
        client,
        config: run.config,
        system: systemBlocks(run.flow, run.holdings),
        tools: ALL_TOOLS,
        messages,
        signal: controller.signal,
        deadlineReached: () => deadline && !parent.aborted,
        ...(run.deps.retryDelaysMs ? { retryDelaysMs: run.deps.retryDelaysMs } : {}),
      },
      {
        executeTools: (blocks, turn, early) => run.executeTools(blocks, turn, early),
        runsEarly: (name) => run.runsEarly(name),
        executeEarly: (block, turn, before) => run.executeEarly(block, turn, before),
        discardEarly: (calls) => run.discardEarly(calls),
        retryNote: (calls) => run.retryNote(calls),
        isDone: () => (run.flow === 'compose' ? run.finished : run.replyResult != null),
        budgetMessage: () => run.budgetMessage(),
        nudge: (attempt) => run.nudge(attempt),
        onTurn: (record) => run.onTurn(record),
      },
    );
  } finally {
    clearTimeout(timer);
    parent.removeEventListener('abort', onAbort);
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function error(content: string): ToolExecution {
  return { content: `Error: ${content}`, isError: true };
}

/** Make `map` hold exactly the entries of `from`. */
function refill<K, V>(map: Map<K, V>, from: ReadonlyMap<K, V>): void {
  map.clear();
  for (const [k, v] of from) map.set(k, v);
}

/** " key-passages" for an add_section input naming its section, else "". */
function sectionOf(input: unknown): string {
  const section = input && typeof input === 'object' ? (input as { section?: unknown }).section : undefined;
  return typeof section === 'string' ? ` ${section}` : '';
}

/** Tool-result text for a validator decision: what was accepted, rejected (and why), adjusted, hydrated. */
export function report(head: string, d: Decision): string {
  const lines = [head];
  if (d.rejected.length) {
    lines.push(`Rejected (${d.rejected.length}):`);
    for (const r of d.rejected.slice(0, 40)) lines.push(`- ${r.item}: ${r.reason}`);
  }
  if (d.warnings.length) {
    lines.push('Adjusted:');
    for (const w of d.warnings.slice(0, 40)) lines.push(`- ${w}`);
  }
  if (d.notes.length) {
    lines.push('Filled in from the lexicon (shown to the reader):');
    for (const n of d.notes) lines.push(`- ${n}`);
  }
  return lines.join('\n');
}

function dedupeCitations(citations: readonly Citation[]): Citation[] {
  const seen = new Set<string>();
  return citations.filter((c) => {
    const k = `${c.sourceId}|${c.locator ?? ''}|${c.note ?? ''}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * Chat paragraphs from model prose: blank-line separated paragraphs; references that
 * exist become {{ref:KEY|as written}} chips; stray token braces are removed.
 */
export async function toBlocks(text: string, refs: RefChecker): Promise<MessageBlock[]> {
  const out: MessageBlock[] = [];
  for (const raw of text.split(/\n\s*\n/)) {
    const p = raw.replace(/\{\{|\}\}/g, '').replace(/\s+/g, ' ').trim();
    if (!p) continue;
    let result = '';
    let at = 0;
    for (const f of findReferences(p)) {
      if (f.index < at) continue;
      if (await refs.problem(f.ref)) continue;
      const original = p.slice(f.index, f.index + f.match.length).replace(/[|{}]/g, '');
      result += `${p.slice(at, f.index)}{{ref:${refKey(f.ref)}|${original}}}`;
      at = f.index + f.match.length;
    }
    result += p.slice(at);
    out.push({ type: 'paragraph', text: result });
  }
  return out;
}

function minimalLog(flow: 'compose' | 'answer', request: unknown, studyId: string, deps: RunDeps, end: string, err: InferenceError | null, cached: boolean): RunLog {
  const { config } = deps;
  const at = (deps.now ?? Date.now)();
  return {
    flow,
    request,
    studyId,
    model: config.model,
    effort: config.effort,
    budgets: { maxResearchCalls: flow === 'compose' ? config.maxResearchCalls : config.maxAnswerResearchCalls, researchMs: config.researchMs, totalMs: config.totalMs, maxTurns: config.maxTurns },
    startedAt: new Date(at).toISOString(),
    durationMs: 0,
    cached,
    outcome: { end, ...(err ? { error: { code: err.code, message: err.message, ...(err.upstream ? { upstream: err.upstream } : {}) } } : {}) },
    researchCalls: 0,
    ledger: [],
    toolCalls: [],
    decisions: [],
    turns: [],
    usage: { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 },
    steps: [],
  };
}

