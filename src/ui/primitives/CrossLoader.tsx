import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import styles from './CrossLoader.module.css';

interface CrossLoaderProps {
  size?: number;
  /** screen-reader text; the loader is announced politely (default: "Loading", localized) */
  label?: string;
  className?: string;
}

/** Loading indicator: a cross traced stroke by stroke, then gently fading. */
export function CrossLoader({ size = 22, label, className }: CrossLoaderProps) {
  const t = useT('sources');
  return (
    <span className={cx(styles.wrap, className)} role="status" aria-live="polite">
      <svg width={size * 0.7} height={size} viewBox="0 0 14 20" fill="none" aria-hidden="true" className={styles.svg}>
        <path className={styles.vertical} d="M7 1.5v17" pathLength={1} />
        <path className={styles.horizontal} d="M2 6.5h10" pathLength={1} />
      </svg>
      <span className="visually-hidden">{label ?? t('loader.loading')}</span>
    </span>
  );
}
