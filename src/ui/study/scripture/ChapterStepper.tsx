import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useId } from 'react';
import { useT } from '../../../i18n/I18nProvider';
import { IconButton } from '../../primitives';
import { cx } from '../../../lib/cx';
import styles from './ChapterStepper.module.css';

interface ChapterStepperProps {
  /** e.g. "Genesis" or "Psalm", in the reader's language */
  bookName: string;
  chapters: number[];
  value: number;
  onChange(chapter: number): void;
  className?: string;
  /** compact footer variant ("Next: Genesis 2 →") */
  variant?: 'bar' | 'footer';
}

/** Previous / chapter select / next — for whole-book studies shown one chapter at a time. */
export function ChapterStepper({ bookName, chapters, value, onChange, className, variant = 'bar' }: ChapterStepperProps) {
  const selectId = useId();
  const t = useT('scripture');
  const i = chapters.indexOf(value);
  const prev = i > 0 ? chapters[i - 1] : undefined;
  const next = i >= 0 && i < chapters.length - 1 ? chapters[i + 1] : undefined;

  if (variant === 'footer') {
    return (
      <nav className={cx(styles.footer, className)} aria-label={t('chapter.navigation')}>
        {prev != null ? (
          <button type="button" className={styles.footerLink} onClick={() => onChange(prev)}>
            <ChevronLeft aria-hidden="true" />
            <span>
              {bookName} {prev}
            </span>
          </button>
        ) : (
          <span />
        )}
        {next != null && (
          <button type="button" className={cx(styles.footerLink, styles.footerNext)} onClick={() => onChange(next)}>
            <span>
              {bookName} {next}
            </span>
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </nav>
    );
  }

  return (
    <div className={cx(styles.stepper, className)} role="group" aria-label={t('chapter.label')}>
      <IconButton
        label={prev != null ? t('chapter.previousTo', { chapter: `${bookName} ${prev}` }) : t('chapter.previous')}
        icon={<ChevronLeft />}
        size="sm"
        variant="secondary"
        disabled={prev == null}
        onClick={() => prev != null && onChange(prev)}
      />
      <label htmlFor={selectId} className="visually-hidden">
        {t('chapter.label')}
      </label>
      <select id={selectId} className={styles.select} value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {chapters.map((c) => (
          <option key={c} value={c}>
            {bookName} {c}
          </option>
        ))}
      </select>
      <IconButton
        label={next != null ? t('chapter.nextTo', { chapter: `${bookName} ${next}` }) : t('chapter.next')}
        icon={<ChevronRight />}
        size="sm"
        variant="secondary"
        disabled={next == null}
        onClick={() => next != null && onChange(next)}
      />
      <span className={styles.count} aria-hidden="true">
        {i + 1} / {chapters.length}
      </span>
    </div>
  );
}
