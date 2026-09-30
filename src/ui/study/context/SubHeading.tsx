import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import styles from './SubHeading.module.css';

interface SubHeadingProps {
  children: ReactNode;
  /** short explanatory line under the heading */
  note?: ReactNode;
  level?: 3 | 4;
  id?: string;
  className?: string;
}

/** Heading for a group inside a dashboard section ("Where Christians differ", "Classic commentaries"). */
export function SubHeading({ children, note, level = 3, id, className }: SubHeadingProps) {
  const H = level === 3 ? 'h3' : 'h4';
  return (
    <div className={cx(styles.wrap, className)}>
      <H id={id} className={cx('t-display', styles.heading)}>
        {children}
      </H>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
