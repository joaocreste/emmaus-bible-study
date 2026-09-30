import { useMemo } from 'react';
import type { PassageRef } from '../../domain/models';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { useSession } from '../../state/session';
import { Chip, CrossMark } from '../primitives';
import styles from './StudyEmptyState.module.css';

/** Starter passages (rendered in the reader's language: "Romanos 8", "Salmo 23", "João 1"), then a topic. */
const STARTER_PASSAGES: PassageRef[] = [
  { book: 'ROM', startChapter: 8 },
  { book: 'PSA', startChapter: 23 },
  { book: 'JHN', startChapter: 1 },
];

/**
 * Shown in the study pane when the conversation has begun but no study is
 * open yet (e.g. after a greeting), and in the phone Sources pane.
 */
export function StudyEmptyState({ variant = 'study' }: { variant?: 'study' | 'sources' }) {
  const { send, status } = useSession();
  const t = useT('shell');
  const tw = useT('welcome');
  const { ref } = useI18n();
  const starters = useMemo(() => [...STARTER_PASSAGES.map((p) => ref(p)), tw('topic.grace')], [ref, tw]);
  const sources = variant === 'sources';
  return (
    <div className={styles.empty}>
      <div className={styles.arch} aria-hidden="true">
        <CrossMark size={44} />
      </div>
      <h2 className={styles.title}>{sources ? t('empty.sources.title') : t('empty.study.title')}</h2>
      <p className={styles.text}>{sources ? t('empty.sources.text') : t('empty.study.text')}</p>
      {!sources && (
        <div className={styles.chips} role="group" aria-label={t('empty.startWith')}>
          {starters.map((s) => (
            <Chip key={s} onClick={() => void send(s)} disabled={status === 'thinking'}>
              {s}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
