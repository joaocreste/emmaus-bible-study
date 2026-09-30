import type { PassageRef, VerseRef } from '../../../domain/models';
import { refKey } from '../../../domain/reference';
import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { RefChip } from '../../common/RefChip';
import styles from './RefChipRow.module.css';
import { compressVerses } from './verses';

interface RefChipRowProps {
  /** passages to show as chips */
  refs?: PassageRef[];
  /** or verses, compressed into ranges */
  verses?: VerseRef[];
  /** small caps label before the chips ("Verses", "Key texts"); default "Verses" (localized) */
  label?: string;
  className?: string;
}

/** A labelled, wrapping row of Scripture reference chips (each opens the passage in the Inspector). */
export function RefChipRow({ refs, verses, label: labelProp, className }: RefChipRowProps) {
  const t = useT('context');
  const label = labelProp ?? t('refs.verses');
  const list = refs ?? (verses ? compressVerses(verses) : []);
  if (list.length === 0) return null;
  return (
    <div className={cx(styles.row, className)}>
      <span className={styles.label}>{label}</span>
      <ul className={styles.list} aria-label={label}>
        {list.map((r, i) => (
          <li key={`${refKey(r)}-${i}`}>
            <RefChip passage={r} />
          </li>
        ))}
      </ul>
    </div>
  );
}
