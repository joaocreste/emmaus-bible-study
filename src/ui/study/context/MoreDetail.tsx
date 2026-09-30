import type { ReactNode } from 'react';
import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { Disclosure } from '../../primitives';
import { useStudyUI } from '../StudyUIContext';
import styles from './MoreDetail.module.css';

interface MoreDetailProps {
  /** study item id — the expanded state lives in StudyUI so the conversation can open it */
  itemId: string;
  /** what the detail is about, for screen readers ("Read more — …") */
  about: string;
  /** content, or a render function that only runs while open (for panels that load data) */
  children: ReactNode | (() => ReactNode);
  /** defaults: "Read more" / "Show less" (localized) */
  moreLabel?: string;
  lessLabel?: string;
  className?: string;
}

/**
 * Progressive disclosure for an item's longer explanation, controlled by the
 * shared StudyUI expanded set (so `focus.expandIds` opens it). The panel id is the item id.
 */
export function MoreDetail({ itemId, about, children, moreLabel, lessLabel, className }: MoreDetailProps) {
  const t = useT('context');
  const { isExpanded, setExpanded } = useStudyUI();
  const open = isExpanded(itemId);
  const content = typeof children === 'function' ? (open ? children() : null) : children;
  return (
    <Disclosure
      id={itemId}
      open={open}
      onOpenChange={(o) => setExpanded(itemId, o)}
      className={cx(styles.more, className)}
      summary={
        <span className={styles.summary}>
          {open ? (lessLabel ?? t('more.showLess')) : (moreLabel ?? t('more.readMore'))}
          <span className="visually-hidden"> — {about}</span>
        </span>
      }
    >
      <div className={styles.panel}>{content}</div>
    </Disclosure>
  );
}
