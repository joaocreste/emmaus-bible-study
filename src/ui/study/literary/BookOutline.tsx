import type { CSSProperties } from 'react';
import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import styles from './BookOutline.module.css';

export interface OutlineBarSegment {
  key: string;
  label: string;
  /** secondary text, e.g. "1:18–3:20" or "13 books" */
  detail?: string;
  /** relative size (chapters, books…) */
  weight: number;
  current?: boolean;
}

interface BookOutlineProps {
  segments: OutlineBarSegment[];
  /** accessible name of the list, e.g. "Outline of Romans" */
  label: string;
  /** text of the marker above the current segment, e.g. "Romans 8" */
  currentLabel?: string;
  /** what "current" means in the legend ("This passage", "This book"); default "This passage" (localized) */
  currentNote?: string;
  className?: string;
}

/**
 * "Where this sits": a proportional bar of a book's (or the canon's) movements with
 * the current one in terracotta, plus a numbered legend. The legend is the accessible
 * ordered list (aria-current on the current item); the bar is its visual summary.
 * On phones the legend becomes a vertical list.
 */
export function BookOutline({ segments, label, currentLabel, currentNote, className }: BookOutlineProps) {
  const t = useT('literary');
  const total = segments.reduce((n, s) => n + s.weight, 0) || 1;
  const currentIndex = segments.findIndex((s) => s.current);
  let markerPct = 0;
  if (currentIndex >= 0) {
    const before = segments.slice(0, currentIndex).reduce((n, s) => n + s.weight, 0);
    markerPct = ((before + segments[currentIndex].weight / 2) / total) * 100;
  }
  const markerAlign = markerPct < 14 ? 'start' : markerPct > 86 ? 'end' : 'center';

  return (
    <div className={cx(styles.outline, className)}>
      <div className={styles.barWrap} aria-hidden="true">
        {currentIndex >= 0 && currentLabel && (
          <>
            <span className={styles.marker} data-align={markerAlign} style={{ '--at': `${markerPct}%` } as CSSProperties}>
              {currentLabel}
            </span>
            <span className={styles.caret} style={{ '--at': `${markerPct}%` } as CSSProperties} />
          </>
        )}
        <div className={styles.bar}>
          {segments.map((s, i) => (
            <span
              key={s.key}
              className={cx(styles.segment, s.current && styles.segmentCurrent)}
              style={{ flexGrow: s.weight }}
              title={s.detail ? `${s.label} (${s.detail})` : s.label}
            >
              <span className={styles.segmentNum}>{i + 1}</span>
            </span>
          ))}
        </div>
      </div>
      <ol className={styles.legend} aria-label={label}>
        {segments.map((s, i) => (
          <li key={s.key} className={cx(styles.item, s.current && styles.itemCurrent)} aria-current={s.current ? 'true' : undefined}>
            <span className={styles.num} aria-hidden="true">
              {i + 1}
            </span>
            <span className={styles.itemText}>
              <span className={styles.itemLabel}>{s.label}</span>
              {s.detail && <span className={styles.itemDetail}>{s.detail}</span>}
              {s.current && <span className={styles.here}>{currentNote ?? t('outline.thisPassage')}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
