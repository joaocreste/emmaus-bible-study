import { cx } from '../../lib/cx';
import styles from './CrossDivider.module.css';

/** A hairline rule with a small cross at its centre — used sparingly between major sections. */
export function CrossDivider({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cx(styles.divider, compact && styles.compact, className)} role="separator" aria-hidden="true">
      <span className={styles.line} />
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className={styles.cross}>
        <path d="M5 1v12M1.5 4.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span className={styles.line} />
    </div>
  );
}
