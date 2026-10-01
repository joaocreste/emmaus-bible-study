/**
 * Pure session reducer. `SessionProvider` (session.tsx) wires it to the
 * StudyEngine, the DOM and storage; everything here is deterministic and
 * serialisable so it can be unit-tested and, later, persisted or synced.
 */
import type { ChatMessage, DashboardFocus, PassageRef, PipelineStep, SectionId, Study } from '../domain/models';
import { refContains, refKey } from '../domain/reference';
import type { EngineResult, LivePhase } from '../engine/types';
import { sanitizeSettings } from './settings';
import type { InspectorTarget, MobilePane, ReaderSettings, SessionState } from './types';

/**
 * Session state plus bookkeeping the chat needs (not part of the shared
 * `Session` contract, exposed through `useSessionInternals()`).
 */
export interface InternalSessionState extends SessionState {
  /** text of the request in flight — drives the context-aware thinking steps */
  pendingText: string | null;
  /** user message awaiting a reply (re-tagged with the new study id when a study opens) */
  pendingMessageId: string | null;
  /** titles of every study opened this session (for "New study · …" dividers) */
  studyTitles: Record<string, string>;
  /** the dashboard focus each assistant message produced — lets its chips re-apply it */
  focusByMessage: Record<string, DashboardFocus>;
  /** failed requests that can be retried from their error message */
  retryByMessage: Record<string, string>;
  /**
   * Every study opened this session, by id — so older messages keep resolving their own
   * study (quotations, key words) and can reopen it, after the conversation moves on.
   */
  studyCache: Record<string, Study>;
  /**
   * The verse (range) the last opening query asked for inside the open passage study
   * ("Romans 8:28" while the study is Romans 8) — kept in the `?q=` deep link.
   */
  studyAnchor: PassageRef | null;
  /** live pipeline steps of the request in flight (the inference layer streams them), oldest first */
  liveSteps: PipelineStep[];
  /** id of the study whose sections are still arriving (a generated page being composed), if any */
  composingStudyId: string | null;
  /** what the inference layer is doing for the request in flight (a new page, or a follow-up answer), if anything */
  livePhase: LivePhase | null;
}

/** Live steps kept per request (the thinking indicator shows the last few). */
const MAX_LIVE_STEPS = 60;

export type SessionAction =
  /** A request to the engine begins; `message` is the user's chat message (absent for direct opens). */
  | { type: 'request/start'; message?: ChatMessage; text?: string }
  | { type: 'request/success'; result: EngineResult; isPhone: boolean }
  | { type: 'request/failure'; message: ChatMessage; retryText?: string }
  /** the inference layer took the request in flight: composing a new page, or researching a follow-up */
  | { type: 'stream/phase'; phase: LivePhase }
  /** a live pipeline step of the request in flight */
  | { type: 'stream/progress'; step: PipelineStep }
  /** a snapshot of the study being composed; `complete: false` while sections are still arriving */
  | { type: 'stream/study'; study: Study; complete: boolean; isPhone: boolean }
  /**
   * The open study, re-opened in the reader's new language (same id). Replaces the study in place —
   * focus, scroll, inspector and conversation stay — and adds at most one short `notice`
   * (a system line; consecutive notices collapse into the latest).
   */
  | { type: 'study/relocalize'; study: Study; notice?: ChatMessage }
  /** error → idle once the gentle error state has been shown */
  | { type: 'status/settle' }
  | { type: 'focus'; focus: DashboardFocus; showStudy?: boolean }
  | { type: 'inspector/open'; target: InspectorTarget }
  | { type: 'inspector/close' }
  | { type: 'settings/update'; patch: Partial<ReaderSettings> }
  | { type: 'pane/set'; pane: MobilePane }
  | { type: 'chat/toggle'; collapsed?: boolean }
  | { type: 'reset' };

export function createInitialState(settings: ReaderSettings): InternalSessionState {
  return {
    phase: 'welcome',
    status: 'idle',
    study: null,
    messages: [],
    focus: null,
    focusSeq: 0,
    conversation: {},
    inspector: null,
    settings,
    mobilePane: 'chat',
    chatCollapsed: false,
    studyUpdatedWhileAway: false,
    pendingText: null,
    pendingMessageId: null,
    studyTitles: {},
    focusByMessage: {},
    retryByMessage: {},
    studyCache: {},
    studyAnchor: null,
    liveSteps: [],
    composingStudyId: null,
    livePhase: null,
  };
}

export function sessionReducer(state: InternalSessionState, action: SessionAction): InternalSessionState {
  switch (action.type) {
    case 'request/start': {
      const { message } = action;
      return {
        ...state,
        status: 'thinking',
        messages: message ? [...state.messages, message] : state.messages,
        pendingText: action.text ?? message?.text ?? null,
        pendingMessageId: message?.id ?? null,
        liveSteps: [],
        livePhase: null,
      };
    }

    case 'stream/phase':
      return state.status === 'thinking' ? { ...state, livePhase: action.phase } : state;

    case 'stream/progress': {
      if (state.status !== 'thinking') return state;
      const liveSteps = [...state.liveSteps, action.step];
      return { ...state, liveSteps: liveSteps.length > MAX_LIVE_STEPS ? liveSteps.slice(-MAX_LIVE_STEPS) : liveSteps };
    }

    case 'stream/study': {
      // Snapshots only belong to the request in flight (a late event after "New study" is ignored).
      if (state.status !== 'thinking') return state;
      const { study, complete, isPhone } = action;
      const changed = study.id !== state.study?.id;
      // The first snapshot opens the page at once: the question moves under its "New study" divider,
      // and the dashboard starts fresh. Later snapshots only replace the study (focus, inspector and
      // scroll position stay where the reader left them).
      const messages =
        changed && state.pendingMessageId
          ? state.messages.map((m) => (m.id === state.pendingMessageId ? { ...m, studyId: study.id } : m))
          : state.messages;
      return {
        ...state,
        phase: 'study',
        study,
        messages,
        focus: changed ? null : state.focus,
        inspector: changed ? null : state.inspector,
        conversation: changed ? {} : state.conversation,
        studyAnchor: changed ? null : state.studyAnchor,
        composingStudyId: complete ? null : study.id,
        studyTitles: state.studyTitles[study.id] === study.title ? state.studyTitles : { ...state.studyTitles, [study.id]: study.title },
        studyCache: { ...state.studyCache, [study.id]: study },
        studyUpdatedWhileAway: state.studyUpdatedWhileAway || (isPhone && state.mobilePane === 'chat'),
      };
    }

    case 'request/success': {
      const { result, isPhone } = action;
      const prevStudyId = state.study?.id;
      const study = result.study ?? state.study;
      const studyChanged = !!result.study && result.study.id !== prevStudyId;

      let messages = state.messages;
      // A message that opened a new study belongs to it: the chat divider then sits above the question.
      if (studyChanged && state.pendingMessageId) {
        messages = messages.map((m) => (m.id === state.pendingMessageId ? { ...m, studyId: result.study!.id } : m));
      }
      const reply: ChatMessage = {
        ...result.reply,
        role: 'assistant',
        id: uniqueId(result.reply.id, messages),
        studyId: result.reply.studyId ?? study?.id,
        trace: result.reply.trace ?? result.trace,
      };
      messages = [...messages, reply];

      const focus = result.focus ?? (studyChanged ? null : state.focus);
      const dashboardChanged = !!result.study || !!result.focus;

      return {
        ...state,
        phase: 'study',
        status: 'idle',
        study,
        messages,
        focus,
        focusSeq: result.focus ? state.focusSeq + 1 : state.focusSeq,
        conversation: result.conversation ?? state.conversation,
        inspector: result.inspector ?? (studyChanged ? null : state.inspector),
        studyUpdatedWhileAway:
          state.studyUpdatedWhileAway || (isPhone && state.mobilePane === 'chat' && dashboardChanged),
        pendingText: null,
        pendingMessageId: null,
        studyTitles: result.study ? { ...state.studyTitles, [result.study.id]: result.study.title } : state.studyTitles,
        focusByMessage: result.focus ? { ...state.focusByMessage, [reply.id]: result.focus } : state.focusByMessage,
        studyCache: result.study ? { ...state.studyCache, [result.study.id]: result.study } : state.studyCache,
        studyAnchor: nextAnchor(state.studyAnchor, result, study, studyChanged),
        liveSteps: [],
        composingStudyId: null,
        livePhase: null,
      };
    }

    case 'request/failure':
      return {
        ...state,
        status: 'error',
        messages: [...state.messages, action.message],
        pendingText: null,
        pendingMessageId: null,
        liveSteps: [],
        composingStudyId: null,
        livePhase: null,
        retryByMessage: action.retryText
          ? { ...state.retryByMessage, [action.message.id]: action.retryText }
          : state.retryByMessage,
      };

    case 'study/relocalize': {
      const { study, notice } = action;
      // Only the study it was asked for: after "New study" or a different study, the result is stale.
      if (!state.study || state.study.id !== study.id) return state;
      let messages = state.messages;
      if (notice) {
        const last = messages[messages.length - 1];
        const base = last && isRelocalizeNotice(last) ? messages.slice(0, -1) : messages;
        messages = [...base, { ...notice, studyId: study.id }];
      }
      return {
        ...state,
        study,
        messages,
        studyTitles: state.studyTitles[study.id] === study.title ? state.studyTitles : { ...state.studyTitles, [study.id]: study.title },
        studyCache: { ...state.studyCache, [study.id]: study },
      };
    }

    case 'status/settle':
      return state.status === 'error' ? { ...state, status: 'idle' } : state;

    case 'focus': {
      const toStudy = !!action.showStudy;
      return {
        ...state,
        focus: action.focus,
        focusSeq: state.focusSeq + 1,
        mobilePane: toStudy ? 'study' : state.mobilePane,
        studyUpdatedWhileAway: toStudy ? false : state.studyUpdatedWhileAway,
      };
    }

    case 'inspector/open':
      return { ...state, inspector: action.target };

    case 'inspector/close':
      return state.inspector ? { ...state, inspector: null } : state;

    case 'settings/update':
      return { ...state, settings: sanitizeSettings({ ...state.settings, ...action.patch }, state.settings) };

    case 'pane/set': {
      if (action.pane === state.mobilePane) return state;
      const arrivingAtUpdatedStudy = action.pane === 'study' && state.studyUpdatedWhileAway;
      return {
        ...state,
        mobilePane: action.pane,
        studyUpdatedWhileAway: action.pane === 'study' ? false : state.studyUpdatedWhileAway,
        // Re-issue the pending focus so the now-visible dashboard scrolls to and pulses what changed.
        focusSeq: arrivingAtUpdatedStudy && state.focus ? state.focusSeq + 1 : state.focusSeq,
      };
    }

    case 'chat/toggle':
      return { ...state, chatCollapsed: action.collapsed ?? !state.chatCollapsed };

    case 'reset':
      return { ...createInitialState(state.settings), focusSeq: state.focusSeq };

    default:
      return state;
  }
}

/** Is the open study still being composed (sections still arriving)? */
export function isComposing(state: Pick<InternalSessionState, 'study' | 'composingStudyId'>): boolean {
  return state.composingStudyId != null && state.composingStudyId === state.study?.id;
}

/** The section a toast / label should name for the latest dashboard change. */
export function latestUpdatedSection(state: SessionState): SectionId | undefined {
  for (let i = state.messages.length - 1; i >= 0; i--) {
    const m = state.messages[i];
    if (m.role !== 'assistant') continue;
    return m.updates?.[0]?.section ?? state.focus?.section;
  }
  return state.focus?.section;
}

/**
 * The verse anchor after a reply: an opening query ("Romans 8:28", or opening a passage from the
 * dashboard) sets it to the verse it named inside the open passage study, or clears it when it named
 * the whole passage; any other reply keeps it, unless the study changed.
 */
export function nextAnchor(
  previous: PassageRef | null,
  result: Pick<EngineResult, 'intent'>,
  study: Study | null,
  studyChanged: boolean,
): PassageRef | null {
  if (result.intent.kind !== 'open-passage') return studyChanged ? null : previous;
  const asked = result.intent.slots.passage;
  const outer = study?.kind === 'passage' ? study.passage : undefined;
  if (!asked || asked.startVerse == null || !outer) return null;
  try {
    return refContains(outer, asked) && refKey(outer) !== refKey(asked) ? asked : null;
  } catch {
    return null;
  }
}

/** Id prefix of the short system line added when the open study switches language. */
export const RELOCALIZE_NOTICE_PREFIX = 'locale-';

function isRelocalizeNotice(m: ChatMessage): boolean {
  return m.role === 'system' && m.id.startsWith(RELOCALIZE_NOTICE_PREFIX);
}

function uniqueId(id: string, messages: ChatMessage[]): string {
  if (!messages.some((m) => m.id === id)) return id;
  let n = 2;
  while (messages.some((m) => m.id === `${id}-${n}`)) n++;
  return `${id}-${n}`;
}
