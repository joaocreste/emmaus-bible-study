import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { CrossMark } from '../../primitives';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  children?: ReactNode;
  /** optional action row (buttons/links) */
  actions?: ReactNode;
  size?: 'md' | 'sm';
  className?: string;
}

/** Honest empty state: the Mediterranean arch with a small cross, a title and a plain explanation. */
export function EmptyState({ title, children, actions, size = 'md', className }: EmptyStateProps) {
  return (
    <div className={cx(styles.empty, styles[size], className)}>
      <span className={styles.emblem}>
        <CrossMark size={size === 'sm' ? 28 : 40} />
      </span>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {children && <div className={styles.text}>{children}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}
