import type { ReactNode } from 'react';
import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { useStudyUI } from '../StudyUIContext';
import styles from './StudyItemCard.module.css';

interface StudyItemCardProps {
  /** id of the study item (context, theme, commentary…) — matched against focus pins/updates */
  itemId: string;
  as?: 'article' | 'li' | 'div';
  /** 'card' = leaf surface with hairline border; 'plain' = no box, focus states only */
  variant?: 'card' | 'plain';
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Shared chrome for dashboard items: surface, and the visible reaction to the
 * conversation — a one-time gold pulse plus an "Updated from your question" /
 * "Prioritised for your question" micro-label (text, never colour alone).
 */
export function StudyItemCard({ itemId, as: Tag = 'article', variant = 'card', labelledBy, className, children }: StudyItemCardProps) {
  const { pinnedIds, updatedIds, focusSeq } = useStudyUI();
  const updated = updatedIds.has(itemId);
  const pinned = pinnedIds.has(itemId);
  return (
    <Tag
      className={cx(styles.item, styles[variant], updated && styles.updated, pinned && styles.pinned, className)}
      data-item-id={itemId}
      aria-labelledby={labelledBy}
    >
      {/* re-keyed on every focus so the pulse replays when the same item is updated again */}
      {updated && <span key={focusSeq} className={styles.pulse} aria-hidden="true" />}
      {(updated || pinned) && <FocusMark updated={updated} />}
      {children}
    </Tag>
  );
}

/** Small gold cross + label marking an item the conversation just touched. */
export function FocusMark({ updated = true, className }: { updated?: boolean; className?: string }) {
  const t = useT('context');
  return (
    <p className={cx(styles.mark, className)}>
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true" className={styles.markCross}>
        <path d="M4 1v10M1.2 3.8h5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {updated ? t('focus.updated') : t('focus.prioritised')}
    </p>
  );
}
