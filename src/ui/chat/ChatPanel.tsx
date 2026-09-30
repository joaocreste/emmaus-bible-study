import { ArrowDown, BookOpenText } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ChatMessage as ChatMessageModel, Study } from '../../domain/models';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { useSessionInternals } from '../../state/session';
import { focusIsLost, moveFocusToStudyIfLost } from '../shell/paneFocus';
import { ChatFocusContext, dividerDomId, messageDomId, type RestoreChatFocus } from './chatContext';
import { withDividers } from './chatLog';
import { ChatMessage } from './ChatMessage';
import styles from './ChatPanel.module.css';
import { Composer, type ComposerHandle } from './Composer';
import { ThinkingIndicator } from './ThinkingIndicator';

const STICKY_THRESHOLD = 96;

interface ChatPanelProps {
  /** focus the composer on mount (fine pointer, split layout — avoids popping soft keyboards) */
  autoFocusComposer?: boolean;
  /** 1 when the conversation is the page's main content (phone pane), else 2 */
  headingLevel?: 1 | 2;
  /** transient notices shown just above the composer, in flow (e.g. the phone "Study updated" toast) */
  dock?: ReactNode;
}

/**
 * The conversation column: header with the current study, an auto-scrolling
 * message log (`role="log"`), the thinking state, and the pinned composer.
 */
export function ChatPanel({ autoFocusComposer = false, headingLevel = 2, dock }: ChatPanelProps) {
  const session = useSessionInternals();
  const { messages, study, status, pendingText, liveSteps, studyTitles, retryByMessage, send, setMobilePane } = session;
  const [draft, setDraft] = useState('');
  const thinking = status === 'thinking';
  const t = useT('chat');
  const { ref } = useI18n();

  const scrollerRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stickToBottom = useRef(true);
  const [showJump, setShowJump] = useState(false);

  const untitled = t('divider.label');
  const items = useMemo(() => withDividers(messages, studyTitles, untitled), [messages, studyTitles, untitled]);
  const lastAssistantId = useMemo(() => [...messages].reverse().find((m) => m.role === 'assistant')?.id, [messages]);
  const askedBefore = useMemo(() => new Set(messages.filter((m) => m.role === 'user').map((m) => m.text.toLowerCase())), [messages]);
  const fallbackSuggestions = useMemo(
    () => (study?.suggestedQuestions ?? []).filter((q) => !askedBefore.has(q.toLowerCase())).slice(0, 3),
    [study, askedBefore],
  );

  const scrollToBottom = useCallback((smooth: boolean) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
  }, []);

  // Follow the conversation: always after the reader sends, and to the "New study" divider whenever the
  // study changes (also when it was opened from the dashboard or the palette); otherwise only if the
  // reader has not scrolled up.
  const lastCount = useRef(0);
  const wasThinking = useRef(false);
  const seenDividers = useRef<Set<string> | null>(null);
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const initial = lastCount.current === 0;
    const added = messages.length > lastCount.current;
    const startedThinking = thinking && !wasThinking.current;
    lastCount.current = messages.length;
    wasThinking.current = thinking;
    const dividerKeys = items.flatMap((item) => (item.type === 'divider' ? [item.key] : []));
    const seen = seenDividers.current;
    const freshDivider = seen ? dividerKeys.filter((k) => !seen.has(k)).at(-1) : undefined;
    seenDividers.current = new Set(dividerKeys);
    // Only react to new content (effects may re-run without any, e.g. under StrictMode).
    if (!added && !startedThinking) return;
    const last = messages[messages.length - 1];

    if (last?.role === 'user' && added) {
      stickToBottom.current = true;
      scrollToBottom(!initial);
      return;
    }
    if (added && freshDivider) {
      const divider = document.getElementById(dividerDomId(freshDivider));
      if (divider) {
        setShowJump(false);
        el.scrollTo({ top: Math.max(0, divider.offsetTop - 12), behavior: reducedMotion() ? 'auto' : 'smooth' });
        return;
      }
    }
    if (!stickToBottom.current) {
      if (added) setShowJump(true);
      return;
    }
    if (added && last?.role === 'assistant') {
      // A long reply: show the question and the beginning of the answer rather than jumping past them.
      const question = [...messages].reverse().find((m) => m.role === 'user');
      const anchor =
        (question && document.getElementById(messageDomId(question.id))) || document.getElementById(messageDomId(last.id));
      if (anchor && el.scrollHeight - anchor.offsetTop > el.clientHeight) {
        el.scrollTo({ top: Math.max(0, anchor.offsetTop - 16), behavior: initial || reducedMotion() ? 'auto' : 'smooth' });
        return;
      }
    }
    scrollToBottom(!initial);
  }, [messages, items, thinking, scrollToBottom]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < STICKY_THRESHOLD;
    stickToBottom.current = atBottom;
    if (atBottom && showJump) setShowJump(false);
  };

  // Focus on arrival: the composer on desktop; on touch / phone layouts, where the control that started
  // the study (welcome input or chip) has just unmounted, the conversation heading — no soft keyboard.
  useEffect(() => {
    if (autoFocusComposer) composerRef.current?.focus();
    else if (focusIsLost()) headingRef.current?.focus({ preventScroll: true });
  }, [autoFocusComposer]);

  // A suggestion chip or "Try again" is about to unmount: keep keyboard users in the conversation.
  const restoreFocus = useCallback<RestoreChatFocus>((fromKeyboard) => {
    if (fromKeyboard || finePointer()) composerRef.current?.focus();
  }, []);

  const submit = (text: string) => {
    setDraft('');
    void send(text);
  };

  const studyLabel = study ? studyShortLabel(study, ref) : null;

  const openStudyTop = () => {
    setMobilePane('study');
    const main = document.getElementById('study');
    main?.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    moveFocusToStudyIfLost();
  };

  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  return (
    <ChatFocusContext.Provider value={restoreFocus}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <Heading ref={headingRef} tabIndex={-1} className={styles.heading}>
            {t('heading')}
          </Heading>
          {study && (
            <button type="button" className={styles.studyChip} onClick={openStudyTop} title={t('studyChip.title', { title: study.title })}>
              <BookOpenText aria-hidden="true" className={styles.studyChipIcon} />
              <span className={styles.studyChipText}>{study.title}</span>
            </button>
          )}
        </header>

        <div className={styles.scroller} ref={scrollerRef} onScroll={onScroll}>
          <div className={styles.log} role="log" aria-live="polite" aria-relevant="additions" aria-label={t('log.label')} aria-busy={thinking}>
            {items.map((item) =>
              item.type === 'divider' ? (
                <NewStudyDivider key={item.key} id={dividerDomId(item.key)} title={item.title} />
              ) : (
                <LogMessage
                  key={item.message.id}
                  message={item.message}
                  latest={item.message.id === lastAssistantId}
                  thinking={thinking}
                  canRetry={!!retryByMessage[item.message.id]}
                  fallbackSuggestions={fallbackSuggestions}
                  earlierStudyTitle={
                    item.message.studyId && item.message.studyId !== study?.id ? studyTitles[item.message.studyId] : undefined
                  }
                />
              ),
            )}
          </div>
          {thinking && (
            <div className={styles.thinking}>
              <ThinkingIndicator text={pendingText} steps={liveSteps} />
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {/* In flow above the composer, so it never covers a message, a divider or a disclosure. */}
          <div className={styles.dock}>
            {dock}
            {showJump && (
              <div className={styles.jumpRow}>
                <button
                  type="button"
                  className={styles.jump}
                  onClick={() => {
                    stickToBottom.current = true;
                    setShowJump(false);
                    scrollToBottom(true);
                  }}
                >
                  <ArrowDown aria-hidden="true" />
                  {t('jump')}
                </button>
              </div>
            )}
          </div>
          <Composer
            ref={composerRef}
            value={draft}
            onChange={setDraft}
            onSubmit={submit}
            busy={thinking}
            placeholder={studyLabel ? t('composer.placeholderStudy', { study: studyLabel }) : t('composer.placeholder')}
            showHint={autoFocusComposer}
          />
        </div>
      </div>
    </ChatFocusContext.Provider>
  );
}

/**
 * Only the newest reply (suggestions) and retryable errors depend on the thinking state and the fallback
 * suggestions; every other message gets constant props, so its memoised ChatMessage does not re-render.
 */
function LogMessage({
  message,
  latest,
  thinking,
  canRetry,
  fallbackSuggestions,
  earlierStudyTitle,
}: {
  message: ChatMessageModel;
  latest: boolean;
  thinking: boolean;
  canRetry: boolean;
  fallbackSuggestions: string[];
  earlierStudyTitle?: string;
}) {
  const live = latest || canRetry;
  return (
    <ChatMessage
      message={message}
      isLatest={latest && !thinking}
      fallbackSuggestions={latest ? fallbackSuggestions : undefined}
      thinking={live ? thinking : false}
      canRetry={canRetry}
      earlierStudyTitle={earlierStudyTitle}
    />
  );
}

/** Centred marker between conversations about different studies. */
function NewStudyDivider({ id, title }: { id: string; title: string }) {
  const t = useT('chat');
  return (
    <div id={id} className={styles.divider} role="separator" aria-label={t('divider.aria', { title })}>
      <span className={styles.dividerLine} aria-hidden="true" />
      <span className={styles.dividerLabel} aria-hidden="true">
        <svg width="9" height="13" viewBox="0 0 10 14" fill="none" className={styles.dividerCross}>
          <path d="M5 1v12M1.5 4.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {t('divider.label')} · <span className={styles.dividerTitle}>{title}</span>
      </span>
      <span className={styles.dividerLine} aria-hidden="true" />
    </div>
  );
}

/** "Romans 8" / "Romanos 8" for passage studies, the title otherwise — used in the composer placeholder. */
function studyShortLabel(study: Study, ref: (passage: NonNullable<Study['passage']>) => string): string {
  if (study.kind === 'passage' && study.passage) {
    try {
      return ref(study.passage);
    } catch {
      /* fall back to the title */
    }
  }
  return study.title;
}

function finePointer(): boolean {
  try {
    return window.matchMedia('(pointer: fine)').matches;
  } catch {
    return false;
  }
}

function reducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
