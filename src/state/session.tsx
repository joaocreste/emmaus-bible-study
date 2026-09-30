/**
 * Session store — the single source of truth shared by the shell, chat, study
 * workspace and inspector (contract: src/state/types.ts).
 *
 *   <SessionProvider engine={engine}> … </SessionProvider>
 *
 * - `send(text)` appends the user's message, shows the thinking state for a
 *   minimum visible time, asks the StudyEngine, then applies the result:
 *   study, reply, dashboard focus (focusSeq++), conversation, inspector.
 * - Requests are serialised: a message or study-open that arrives while another
 *   request is being answered waits its turn (identical waiting requests are
 *   merged), so no question is ever left without a reply. "New study" drops
 *   whatever is in flight or waiting.
 * - Live composition (docs/INFERENCE.md): the engine streams progress steps and
 *   page snapshots through `ctx.onEvent`. The first snapshot opens the page at
 *   once (phase 'study', chat divider); later snapshots update it in place while
 *   the chat shows the live steps. A new request stops a composition in flight
 *   (`ctx.signal`) — the engine then replies with the sections that were finished.
 * - Reader settings persist to localStorage and are painted onto <html>
 *   (`data-theme`, `--reader-scale`, `lang`); `system` follows the OS theme live.
 * - Language (docs/I18N.md): every engine call carries the reader's locale, so new
 *   studies and replies follow it. When the locale changes while a curated or library
 *   study is open, that study is re-opened in the new language (same id) and swapped in
 *   place — no new reply, just one short localized notice line in the chat.
 * - `?q=<text>` in the URL starts a study on load and is kept in sync.
 * Engine errors never crash the app: they become a gentle assistant message.
 *
 * Components that only need actions should use `useSessionActions()`: its value
 * never changes, so they do not re-render on every session update.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import type { ChatMessage, DashboardFocus, PassageRef, PipelineStep, SectionId, Study } from '../domain/models';
import type { StudyRegenerator } from '../engine/InferenceStudyEngine';
import type { EngineContext, EngineResult, EngineStreamEvent, StudyEngine } from '../engine/types';
import { formatRef, refKey } from '../domain/reference';
import { translator } from '../i18n/catalog';
import type { Locale } from '../i18n/locales';
import { readDeepLink, syncDeepLink } from './deepLink';
import { createRequestQueue, type RequestQueue } from './requestQueue';
import {
  createInitialState,
  isComposing,
  RELOCALIZE_NOTICE_PREFIX,
  sessionReducer,
  type InternalSessionState,
  type SessionAction,
} from './sessionReducer';
import { applyReaderSettings, loadSettings, saveSettings } from './settings';
import type { InspectorTarget, MobilePane, ReaderSettings, Session, SessionActions } from './types';

/** Minimum time the thinking state stays visible, so replies never "pop" in jarringly. */
export const MIN_THINKING_MS = 650;
export const MIN_THINKING_MS_REDUCED = 150;
/** How long the gentle error state lasts before the session settles back to idle. */
const ERROR_SETTLE_MS = 2400;

/** Chat-only extras on top of the shared `Session` contract. */
export interface SessionInternals {
  /** text of the request in flight (context-aware thinking steps) */
  pendingText: string | null;
  /** study id → title, for every study opened this session */
  studyTitles: Record<string, string>;
  /** study id → study, for every study opened this session (older messages resolve their own study) */
  studyCache: Record<string, Study>;
  /** assistant message id → the dashboard focus it produced */
  focusByMessage: Record<string, DashboardFocus>;
  /** error message id → the request that failed */
  retryByMessage: Record<string, string>;
  /** live pipeline steps of the request in flight (streamed by the inference layer), oldest first */
  liveSteps: PipelineStep[];
  /** the open study is still being composed (sections are still arriving) */
  composing: boolean;
  /** the engine can recompose a generated page afresh */
  canRegenerate: boolean;
  /** Recompose the open generated page, bypassing the page cache. */
  regenerate(): Promise<void>;
  /**
   * Re-apply the focus a message produced, scrolled to `section` (switches to the study pane on phone).
   * A message from an earlier study first reopens that study; nothing is applied if it cannot be reopened.
   */
  revisit(messageId: string, section: SectionId): Promise<void>;
  /** Re-send the request behind an error message. */
  retry(messageId: string): void;
}

export type SessionContextValue = Session & SessionInternals;

/** Every session action (stable for the lifetime of the provider). */
export type SessionActionsValue = SessionActions & Pick<SessionInternals, 'revisit' | 'retry' | 'regenerate'>;

const SessionContext = createContext<SessionContextValue | null>(null);
const SessionActionsContext = createContext<SessionActionsValue | null>(null);

interface SessionProviderProps {
  /** the study engine; one that can also regenerate (InferenceStudyEngine) enables "Regenerate" */
  engine: StudyEngine & Partial<StudyRegenerator>;
  children: ReactNode;
  /** override persisted settings (tests, previews) */
  initialSettings?: ReaderSettings;
  /** start `?q=` / `?study=` deep links on mount (default true) */
  deepLinks?: boolean;
}

type OpenQuery = { studyId?: string; passage?: PassageRef; topic?: string };

export function SessionProvider({ engine, children, initialSettings, deepLinks = true }: SessionProviderProps) {
  const [state, dispatch] = useReducer(sessionReducer, initialSettings, (s?: ReaderSettings) =>
    createInitialState(s ?? loadSettings()),
  );

  /**
   * The latest state, updated synchronously with every action (the reducer is pure), so a request
   * that starts right after another settles — before React re-renders — sees the new study and history.
   */
  const stateRef = useRef<InternalSessionState>(state);
  const act = useCallback((action: SessionAction) => {
    stateRef.current = sessionReducer(stateRef.current, action);
    dispatch(action);
  }, []);

  /** Requests run one at a time; "New study" clears the queue (see requestQueue.ts). */
  const queue = useRef<RequestQueue | null>(null);
  queue.current ??= createRequestQueue();
  const settleTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(settleTimer.current), []);
  /** the request being answered, so a new request (or "New study") can stop its live stream */
  const running = useRef<{ key: string; controller: AbortController } | null>(null);
  useEffect(() => () => running.current?.controller.abort(), []);

  /**
   * Queue a request to the engine. `prepare` runs when the request's turn comes (so the user's
   * message is stamped with the study open at that moment). Resolves to the id of the study open
   * once the reply has been applied, or undefined if the request failed or was dropped by "New study".
   * A different request arriving while one is being answered stops that one's live stream (a page
   * being composed keeps the sections already finished; the engine says so in its reply).
   */
  const enqueue = useCallback(
    (
      key: string,
      prepare: () => { call: (ctx: EngineContext) => Promise<EngineResult>; message?: ChatMessage; text?: string },
    ): Promise<string | undefined> => {
      if (running.current && running.current.key !== key) running.current.controller.abort();
      return queue.current!.enqueue<string>(key, async (isCurrent) => {
        const { call, message, text } = prepare();
        const s = stateRef.current;
        const controller = new AbortController();
        running.current = { key, controller };
        let streamed = false;
        const onEvent = (event: EngineStreamEvent) => {
          if (!isCurrent() || controller.signal.aborted) return;
          streamed = true;
          if (event.type === 'progress') act({ type: 'stream/progress', step: event.step });
          else act({ type: 'stream/study', study: event.study, complete: event.complete, isPhone: isPhoneViewport() });
        };
        const ctx: EngineContext = {
          study: s.study,
          history: s.messages,
          conversation: s.conversation,
          translation: s.settings.translation,
          locale: s.settings.locale,
          onEvent,
          signal: controller.signal,
        };
        window.clearTimeout(settleTimer.current);
        act({ type: 'request/start', message, text });
        const started = now();
        try {
          const result = await call(ctx);
          // Streamed replies have been visibly working all along; only instant ones get the minimum thinking time.
          if (!streamed) await holdAtLeast(started);
          if (!isCurrent()) return undefined;
          act({ type: 'request/success', result, isPhone: isPhoneViewport() });
          return stateRef.current.study?.id;
        } catch (error) {
          console.error('[Emmaus] The study engine failed:', error);
          if (!streamed) await holdAtLeast(started);
          if (!isCurrent()) return undefined;
          act({
            type: 'request/failure',
            message: errorReply(stateRef.current.study?.id ?? s.study?.id, stateRef.current.settings.locale),
            retryText: text,
          });
          settleTimer.current = window.setTimeout(() => act({ type: 'status/settle' }), ERROR_SETTLE_MS);
          return undefined;
        } finally {
          if (running.current?.controller === controller) running.current = null;
        }
      });
    },
    [act],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      await enqueue(`send:${trimmed.toLowerCase()}`, () => {
        const study = stateRef.current.study;
        const message: ChatMessage = {
          id: newId('u'),
          role: 'user',
          text: trimmed,
          createdAt: Date.now(),
          ...(study ? { studyId: study.id } : {}),
        };
        return { call: (ctx) => engine.respond(trimmed, ctx), message, text: trimmed };
      });
    },
    [engine, enqueue],
  );

  const openStudy = useCallback(
    (query: OpenQuery): Promise<string | undefined> => {
      const text = query.topic ?? (query.passage ? safeFormatRef(query.passage, stateRef.current.settings.locale) : undefined);
      return enqueue(openKey(query), () => ({ call: (ctx) => engine.openStudy(query, ctx), text }));
    },
    [engine, enqueue],
  );

  const focusDashboard = useCallback((focus: DashboardFocus) => act({ type: 'focus', focus }), [act]);

  const goToSection = useCallback(
    (section: SectionId) => act({ type: 'focus', focus: { section }, showStudy: isPhoneViewport() }),
    [act],
  );

  const revisit = useCallback(
    async (messageId: string, section: SectionId) => {
      const s = stateRef.current;
      const messageStudy = s.messages.find((m) => m.id === messageId)?.studyId;
      if (messageStudy && messageStudy !== s.study?.id) {
        // The message belongs to an earlier study: reopen it before replaying its focus.
        const opened = await openStudy({ studyId: messageStudy });
        if (opened !== messageStudy) return;
      }
      const previous = stateRef.current.focusByMessage[messageId];
      act({ type: 'focus', focus: previous ? { ...previous, section } : { section }, showStudy: isPhoneViewport() });
    },
    [act, openStudy],
  );

  const regenerate = useCallback(async () => {
    const study = stateRef.current.study;
    if (!study || study.depth !== 'generated' || typeof engine.regenerate !== 'function') return;
    const query = study.generation?.query ?? study.title;
    await enqueue(`regenerate:${study.id}`, () => ({ call: (ctx) => engine.regenerate!(study, ctx), text: query }));
  }, [engine, enqueue]);

  const retry = useCallback(
    (messageId: string) => {
      const text = stateRef.current.retryByMessage[messageId];
      if (text) void send(text);
    },
    [send],
  );

  const openInspector = useCallback((target: InspectorTarget) => act({ type: 'inspector/open', target }), [act]);
  const closeInspector = useCallback(() => act({ type: 'inspector/close' }), [act]);
  const updateSettings = useCallback((patch: Partial<ReaderSettings>) => act({ type: 'settings/update', patch }), [act]);
  const setMobilePane = useCallback((pane: MobilePane) => act({ type: 'pane/set', pane }), [act]);
  const toggleChat = useCallback((collapsed?: boolean) => act({ type: 'chat/toggle', collapsed }), [act]);
  const reset = useCallback(() => {
    running.current?.controller.abort(); // stop a live composition
    queue.current!.clear(); // drop the reply in flight and everything waiting
    window.clearTimeout(settleTimer.current);
    act({ type: 'reset' });
    syncDeepLink(null);
  }, [act]);

  /**
   * Re-open the open study in `locale` (same study id) and swap it in place. Waits its turn in the
   * queue; skipped when the study was composed live (re-asking would recompose it), is already in
   * that language, or changed / the language changed again before its turn came.
   */
  const relocalize = useCallback(
    (locale: Locale) => {
      const open = stateRef.current.study;
      if (!open || open.depth === 'generated' || studyLocale(open) === locale) return;
      void queue.current!.enqueue<string>(`relocalize:${locale}:${open.id}`, async (isCurrent) => {
        const s = stateRef.current;
        const study = s.study;
        if (!study || study.id !== open.id || s.settings.locale !== locale || studyLocale(study) === locale) return undefined;
        // A fresh context (no open study, no history), so the engine opens it rather than answering "we're already here".
        const ctx: EngineContext = { study: null, history: [], conversation: {}, translation: s.settings.translation, locale };
        const queries: OpenQuery[] = [{ studyId: study.id }];
        if (study.kind === 'passage' && study.passage) queries.push({ passage: study.passage });
        for (const query of queries) {
          try {
            const result = await engine.openStudy(query, ctx);
            if (!isCurrent()) return undefined;
            if (result.study?.id !== study.id) continue;
            act({ type: 'study/relocalize', study: result.study, notice: relocalizeNotice(locale) });
            return study.id;
          } catch (error) {
            console.warn('[Emmaus] Could not re-open the study in the new language:', error);
          }
        }
        return undefined;
      });
    },
    [act, engine],
  );

  // The reader switched language: the open study follows (the first render only records the locale).
  const { locale } = state.settings;
  const lastLocale = useRef(locale);
  useEffect(() => {
    if (lastLocale.current === locale) return;
    lastLocale.current = locale;
    relocalize(locale);
  }, [locale, relocalize]);

  // Reader settings → <html> + storage; `system` theme follows the OS live.
  const { settings } = state;
  useEffect(() => {
    applyReaderSettings(settings);
    saveSettings(settings);
    if (settings.theme !== 'system' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyReaderSettings(stateRef.current.settings, mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [settings]);

  // Keep ?q= in step with the open study, including the verse it was opened at (bookmarkable / shareable).
  const { study, studyAnchor } = state;
  useEffect(() => {
    if (study) syncDeepLink(study, studyAnchor);
  }, [study, studyAnchor]);

  // Deep link on first load: ?study=<id> or ?q=<text>.
  const booted = useRef(false);
  useEffect(() => {
    if (booted.current || !deepLinks) return;
    booted.current = true;
    const link = readDeepLink(window.location.search);
    if (link.studyId) {
      // An unknown id opens nothing (the engine says so in chat): drop it from the URL.
      void openStudy({ studyId: link.studyId }).then(() => {
        if (!stateRef.current.study) syncDeepLink(null);
      });
    } else if (link.q) void send(link.q);
  }, [deepLinks, openStudy, send]);

  const actions = useMemo<SessionActionsValue>(
    () => ({
      send,
      openStudy,
      focusDashboard,
      goToSection,
      openInspector,
      closeInspector,
      updateSettings,
      setMobilePane,
      toggleChat,
      reset,
      revisit,
      retry,
      regenerate,
    }),
    [send, openStudy, focusDashboard, goToSection, openInspector, closeInspector, updateSettings, setMobilePane, toggleChat, reset, revisit, retry, regenerate],
  );

  const canRegenerate = typeof engine.regenerate === 'function';

  const value = useMemo<SessionContextValue>(
    () => ({
      phase: state.phase,
      status: state.status,
      study: state.study,
      messages: state.messages,
      focus: state.focus,
      focusSeq: state.focusSeq,
      conversation: state.conversation,
      inspector: state.inspector,
      settings: state.settings,
      mobilePane: state.mobilePane,
      chatCollapsed: state.chatCollapsed,
      studyUpdatedWhileAway: state.studyUpdatedWhileAway,
      pendingText: state.pendingText,
      studyTitles: state.studyTitles,
      studyCache: state.studyCache,
      focusByMessage: state.focusByMessage,
      retryByMessage: state.retryByMessage,
      liveSteps: state.liveSteps,
      composing: isComposing(state),
      canRegenerate,
      ...actions,
    }),
    [state, actions, canRegenerate],
  );

  return (
    <SessionActionsContext.Provider value={actions}>
      <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
    </SessionActionsContext.Provider>
  );
}

/** The session (state + actions). Must be used inside <SessionProvider>. Re-renders on every session change. */
export function useSession(): Session {
  return useSessionInternals();
}

/** Session plus chat bookkeeping (dividers, per-message focus, retry). For the shell and chat. */
export function useSessionInternals(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}

/**
 * Session actions only. The value is stable, so components that only trigger actions
 * (chips, buttons) do not re-render when the session changes.
 */
export function useSessionActions(): SessionActionsValue {
  const ctx = useContext(SessionActionsContext);
  if (!ctx) throw new Error('useSessionActions must be used inside <SessionProvider>');
  return ctx;
}

/* ------------------------------------------------------------------ */

/** Phone layout (< 760px, docs/DESIGN.md §4). */
export const PHONE_QUERY = '(max-width: 759.98px)';

function isPhoneViewport(): boolean {
  try {
    return window.matchMedia(PHONE_QUERY).matches;
  } catch {
    return false;
  }
}

/** Queue key for a study-open request (identical waiting opens are merged). */
function openKey(query: OpenQuery): string {
  let passage = '';
  if (query.passage) {
    try {
      passage = refKey(query.passage);
    } catch {
      passage = JSON.stringify(query.passage);
    }
  }
  return `open:${query.studyId ?? ''}|${passage}|${query.topic?.toLowerCase() ?? ''}`;
}

function safeFormatRef(ref: PassageRef, locale: Locale): string | undefined {
  try {
    return formatRef(ref, 'long', locale);
  } catch {
    return undefined;
  }
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

async function holdAtLeast(started: number): Promise<void> {
  const min = prefersReducedMotion() ? MIN_THINKING_MS_REDUCED : MIN_THINKING_MS;
  const rest = min - (now() - started);
  if (rest > 0) await new Promise((resolve) => window.setTimeout(resolve, rest));
}

let idCounter = 0;
function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

/** A calm, honest failure message in the reader's language — nothing is invented to fill the gap. */
function errorReply(studyId: string | undefined, locale: Locale): ChatMessage {
  const t = translator(locale, 'chat');
  return {
    id: newId('err'),
    role: 'assistant',
    text: t('error.text'),
    blocks: [
      { type: 'paragraph', text: t('error.paragraph') },
      { type: 'note', tone: 'caution', text: t('error.note') },
    ],
    createdAt: Date.now(),
    ...(studyId ? { studyId } : {}),
  };
}

/** The one short line the chat shows when the open study switches language. */
function relocalizeNotice(locale: Locale): ChatMessage {
  return { id: newId(RELOCALIZE_NOTICE_PREFIX.slice(0, -1)), role: 'system', text: translator(locale, 'chat')('notice.relocalized'), createdAt: Date.now() };
}

/** Language of a study's prose (studies without a marker are English). */
function studyLocale(study: Study): Locale {
  return study.localization?.locale ?? 'en';
}
