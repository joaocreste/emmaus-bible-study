import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import styles from './ScriptureSkeleton.module.css';

const WIDTHS = [96, 100, 88, 94, 72, 0, 98, 91, 100, 64];

/** Quiet placeholder lines while a passage loads (announced once as "Loading …"). */
export function ScriptureSkeleton({ label, lines = WIDTHS.length, className }: { label?: string; lines?: number; className?: string }) {
  const t = useT('scripture');
  return (
    <div className={cx(styles.skeleton, className)} role="status" aria-live="polite">
      <span className="visually-hidden">{label ?? t('loading.passage')}…</span>
      {WIDTHS.slice(0, lines).map((w, i) =>
        w === 0 ? (
          <span key={i} className={styles.gap} aria-hidden="true" />
        ) : (
          <span key={i} className={styles.line} style={{ width: `${w}%`, animationDelay: `${i * 60}ms` }} aria-hidden="true" />
        ),
      )}
    </div>
  );
}
