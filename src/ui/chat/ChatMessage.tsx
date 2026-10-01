import { ArrowRight, ListTree, RotateCcw } from 'lucide-react';
import { memo, useId, useMemo, type MouseEvent } from 'react';
import type { ChatMessage as ChatMessageModel, Citation, SectionId } from '../../domain/models';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { useSessionActions } from '../../state/session';
import { CitationList } from '../common/SourceChip';
import { Button, Chip, CrossMark, Disclosure, ProvenanceTag } from '../primitives';
import { moveFocusToStudyIfLost } from '../shell/paneFocus';
import { MessageScopeContext, messageDomId, useRestoreChatFocus } from './chatContext';
import styles from './ChatMessage.module.css';
import { InlineText, MessageBlocks } from './MessageContent';
import { ScriptText } from '../common/ScriptText';
import { readerTrace } from './readerTrace';

interface ChatMessageProps {
  message: ChatMessageModel;
  /** the newest assistant message shows follow-up suggestions */
  isLatest?: boolean;
  /** fallback suggestions when the message has none (e.g. the study's suggested questions) */
  fallbackSuggestions?: string[];
  /** the engine is answering (suggestions and retry are disabled) */
  thinking?: boolean;
  /** this error message can be retried */
  canRetry?: boolean;
  /** title of the message's study when it is not the one open now (its study links reopen it) */
  earlierStudyTitle?: string;
}

/**
 * One turn of the conversation: user bubble (right) or assistant reply (left, with study updates and provenance).
 * Everything it needs arrives as props or stable actions, so older messages do not re-render on every session change.
 */
export const ChatMessage = memo(function ChatMessage({
  message,
  isLatest = false,
  fallbackSuggestions,
  thinking = false,
  canRetry = false,
  earlierStudyTitle,
}: ChatMessageProps) {
  const scope = useMemo(() => ({ messageId: message.id, studyId: message.studyId }), [message.id, message.studyId]);
  const t = useT('chat');

  if (message.role === 'user') {
    return (
      <article className={cx(styles.message, styles.user)} aria-label={t('you')} id={messageDomId(message.id)}>
        <p className={styles.bubble}>
          <ScriptText text={message.text} />
        </p>
      </article>
    );
  }

  if (message.role === 'system') {
    return (
      <p className={styles.system} role="note">
        {message.text}
      </p>
    );
  }

  return (
    <MessageScopeContext.Provider value={scope}>
      <AssistantMessage
        message={message}
        isLatest={isLatest}
        fallbackSuggestions={fallbackSuggestions}
        thinking={thinking}
        canRetry={canRetry}
        earlierStudyTitle={earlierStudyTitle}
      />
    </MessageScopeContext.Provider>
  );
});

function AssistantMessage({ message, isLatest, fallbackSuggestions, thinking, canRetry, earlierStudyTitle }: Required<Pick<ChatMessageProps, 'message' | 'isLatest' | 'thinking' | 'canRetry'>> & Pick<ChatMessageProps, 'fallbackSuggestions' | 'earlierStudyTitle'>) {
  const { send, revisit, retry } = useSessionActions();
  const t = useT('chat');
  const tc = useT('common');
  const { ref } = useI18n();
  const restoreFocus = useRestoreChatFocus();
  const updatesTitleId = useId();
  const citations = useMemo<Citation[]>(
    () => [...(message.citations ?? []), ...(message.provenance?.citations ?? [])],
    [message.citations, message.provenance],
  );
  const suggestions = (message.suggestions?.length ? message.suggestions : (fallbackSuggestions ?? [])).slice(0, 4);
  const declined = isDeclined(message);
  const readerSteps = useMemo(() => {
    const r = message.trace?.length ? readerTrace(message.trace) : null;
    return r && r.sources.length ? r : null;
  }, [message.trace]);

  const openUpdate = async (section: SectionId) => {
    await revisit(message.id, section);
    moveFocusToStudyIfLost(section);
  };

  // The chips and "Try again" unmount once the request starts: keep focus in the conversation.
  const ask = (e: MouseEvent, text: string) => {
    restoreFocus(e.detail === 0);
    void send(text);
  };
  const tryAgain = (e: MouseEvent) => {
    restoreFocus(e.detail === 0);
    retry(message.id);
  };

  return (
    <article className={cx(styles.message, styles.assistant)} aria-label="Emmaus" id={messageDomId(message.id)}>
      <span className={styles.avatar} aria-hidden="true">
        <CrossMark variant="glyph" size={18} />
      </span>

      <div className={styles.body}>
        {message.blocks?.length ? (
          <MessageBlocks blocks={message.blocks} />
        ) : (
          <p className={styles.plain}>
            <InlineText text={message.text} />
          </p>
        )}

        {!!message.updates?.length && (
          <div className={styles.updates} role="group" aria-labelledby={updatesTitleId}>
            <p id={updatesTitleId} className={styles.updatesTitle}>
              <svg className={styles.updatesCross} width="9" height="13" viewBox="0 0 10 14" fill="none" aria-hidden="true">
                <path d="M5 1v12M1.5 4.5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {t('updates.title')}
              {earlierStudyTitle && <span className={styles.updatesOrigin}> · {t('updates.origin', { title: earlierStudyTitle })}</span>}
            </p>
            <ul className={styles.updateList}>
              {message.updates.map((u, i) => (
                <li key={`${u.section}-${i}`}>
                  <button
                    type="button"
                    className={styles.update}
                    onClick={() => void openUpdate(u.section)}
                    title={earlierStudyTitle ? t('updates.reopen', { title: earlierStudyTitle }) : undefined}
                  >
                    <span className={styles.updateMark} aria-hidden="true" />
                    <span className={styles.updateLabel}>
                      <ScriptText text={u.label} />
                    </span>
                    <span className={styles.updateSection}>{sectionLabel(u.section, tc)}</span>
                    <ArrowRight aria-hidden="true" className={styles.updateArrow} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(message.provenance || citations.length > 0) && (
          <div className={styles.provenance}>
            {message.provenance && (
              <p className={styles.provenanceLine}>
                <ProvenanceTag provenance={message.provenance} showVerification={declined} />
                <span className={styles.provenanceNote}>
                  {declined
                    ? t('provenance.declined')
                    : message.provenance.verification === 'generated'
                      ? t('provenance.generated')
                      : message.provenance.kind === 'synthesis'
                        ? t('provenance.library')
                        : null}
                </span>
              </p>
            )}
            <CitationList citations={citations} label={t('sources')} />
          </div>
        )}

        {readerSteps && (
          <Disclosure
            className={styles.trace}
            summary={
              <span className={styles.traceSummary}>
                <ListTree aria-hidden="true" className={styles.traceIcon} />
                {t('trace.summary')}
                <span className={styles.traceCount}>{t('trace.count', { count: readerSteps.sources.length })}</span>
              </span>
            }
          >
            <ul className={styles.traceList}>
              {readerSteps.sources.map((source) => (
                <li key={source} className={styles.traceStep}>
                  <span className={styles.traceDetail}>
                    {source === 'scripture' && readerSteps.passages.length
                      ? t('trace.source.scripturePassages', {
                          refs: readerSteps.passages.map((p) => ref(p)).join('; '),
                          more: readerSteps.morePassages,
                        })
                      : t(`trace.source.${source}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className={styles.traceNote}>{readerSteps.generated ? t('trace.noteLive') : t('trace.note')}</p>
          </Disclosure>
        )}

        {canRetry && (
          <div>
            <Button variant="quiet" size="sm" icon={<RotateCcw />} onClick={tryAgain} disabled={thinking}>
              {t('retry')}
            </Button>
          </div>
        )}

        {isLatest && suggestions.length > 0 && !canRetry && (
          <div className={styles.suggestions} role="group" aria-label={t('suggestions.label')}>
            {suggestions.map((s) => (
              <Chip key={s} className={styles.suggestion} onClick={(e) => ask(e, s)} disabled={thinking}>
                <ScriptText text={s} />
              </Chip>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/** A dashboard section's short label in the reader's language. */
function sectionLabel(section: SectionId, tc: (key: `section.${SectionId}`) => string): string {
  return tc(`section.${section}`);
}

/**
 * A reply that declined for lack of a verified source. Signalled either by an
 * unverified provenance or by the engine's Synthesis trace step ("Declined …").
 */
function isDeclined(message: ChatMessageModel): boolean {
  if (message.declined) return true;
  if (message.provenance?.verification === 'unverified') return true;
  return !!message.trace?.some((s) => s.stage === 'Synthesis' && /^declined\b/i.test(s.detail));
}
