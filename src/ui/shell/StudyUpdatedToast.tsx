import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useT } from '../../i18n/I18nProvider';
import { latestUpdatedSection } from '../../state/sessionReducer';
import { useSession } from '../../state/session';
import { moveFocusToStudyIfLost } from './paneFocus';
import styles from './StudyUpdatedToast.module.css';

const VISIBLE_MS = 6500;

/**
 * Phone only: when the conversation changes the dashboard while the reader is
 * on the Chat pane, a quiet notice names what changed ("Study updated ·
 * Original languages — View"). The Study tab keeps its gold dot until visited.
 *
 * It sits in the chat's dock, just above the composer (ChatPanel `dock`), so it
 * never covers the header or the question the reader is looking at. It is not
 * shown for the conversation's first reply: the chat then already shows the
 * study's opening, and the Study tab's dot is enough.
 */
export function StudyUpdatedToast() {
  const session = useSession();
  const t = useT('shell');
  const tc = useT('common');
  const { studyUpdatedWhileAway, mobilePane, inspector, study, messages, setMobilePane } = session;
  /** the notice on screen (`key` re-arms the timer for each new reply) */
  const [shown, setShown] = useState<{ key: number; newStudy: boolean } | null>(null);
  const lastSeenCount = useRef(0);
  const announcedStudyId = useRef<string | undefined>(undefined);

  // Detect a reply that updated the dashboard while the reader was away.
  useEffect(() => {
    if (!studyUpdatedWhileAway || mobilePane !== 'chat') {
      setShown(null);
      return;
    }
    if (messages.length === lastSeenCount.current) return;
    lastSeenCount.current = messages.length;
    const newStudy = !!study && study.id !== announcedStudyId.current;
    announcedStudyId.current = study?.id;
    const replies = messages.reduce((n, m) => (m.role === 'assistant' ? n + 1 : n), 0);
    if (replies <= 1) return;
    setShown({ key: messages.length, newStudy });
  }, [studyUpdatedWhileAway, mobilePane, messages, study]);

  // Hide after a while — a separate effect, so re-running the detection (StrictMode, unrelated
  // dependency changes) can never leave the notice up without its timer.
  useEffect(() => {
    if (!shown) return;
    const t = window.setTimeout(() => setShown(null), VISIBLE_MS);
    return () => window.clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    if (mobilePane === 'study') announcedStudyId.current = study?.id;
  }, [mobilePane, study]);

  const section = latestUpdatedSection(session);
  const isNewStudy = !!shown?.newStudy;
  const what = isNewStudy && study ? study.title : section ? tc(`section.${section}`) : study?.title;

  const view = () => {
    setShown(null);
    setMobilePane('study');
    // "View" sits in the chat pane, which is about to become inert: follow the reader to the study.
    moveFocusToStudyIfLost(isNewStudy ? undefined : section);
  };

  return (
    <div className={styles.region} role="status">
      {shown && !inspector && (
        <div className={styles.toast}>
          <svg className={styles.cross} width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
            <path d="M5 1v12M1.5 4.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className={styles.text}>
            <span className={styles.lead}>{isNewStudy ? t('toast.newStudy') : t('toast.updated')}</span>
            {what && <span className={styles.what}> · {what}</span>}
          </p>
          <button type="button" className={styles.view} onClick={view}>
            {t('toast.view')}
          </button>
          <button type="button" className={styles.dismiss} aria-label={t('toast.dismiss')} onClick={() => setShown(null)}>
            <X aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
