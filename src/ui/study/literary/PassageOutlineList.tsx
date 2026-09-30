import type { OutlineSegment } from '../../../domain/models';
import { refKey } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { RefChip } from '../../common/RefChip';
import { ScriptText } from '../../common/ScriptText';
import { formatWithinBook } from './canon';
import styles from './PassageOutlineList.module.css';

interface PassageOutlineListProps {
  segments: OutlineSegment[];
  /** accessible name of the list */
  label: string;
  className?: string;
}

/** Numbered outline of a passage (label + reference chip); `current` segments are marked. */
export function PassageOutlineList({ segments, label, className }: PassageOutlineListProps) {
  const { locale } = useI18n();
  const t = useT('literary');
  return (
    <ol className={cx(styles.list, className)} aria-label={label}>
      {segments.map((s, i) => (
        <li
          key={`${refKey(s.ref)}-${i}`}
          className={cx(styles.item, s.current && styles.current)}
          aria-current={s.current ? 'true' : undefined}
        >
          <span className={styles.num} aria-hidden="true">
            {i + 1}
          </span>
          <span className={styles.label}>
            <ScriptText text={s.label} />
          </span>
          <span className={styles.ref}>
            <RefChip passage={s.ref} label={formatWithinBook(s.ref, locale)} />
          </span>
          {s.current && <span className={styles.here}>{t('outline.focus')}</span>}
        </li>
      ))}
    </ol>
  );
}
