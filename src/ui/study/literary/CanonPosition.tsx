import { Info } from 'lucide-react';
import { bookDisplayName } from '../../../domain/books';
import type { BookId } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { BookOutline } from './BookOutline';
import { canonSectionLabel, canonSections, describeCanonPosition } from './canon';
import styles from './CanonPosition.module.css';

interface CanonPositionProps {
  book: BookId;
  /** 'full' adds the canon-section bar and facts (library studies); 'line' is the sentence only */
  variant?: 'full' | 'line';
  className?: string;
}

/**
 * Where a book sits in the canon — computed from the canon table in src/domain/books.ts
 * ("Romans is the 6th book of the New Testament, first of the thirteen Pauline letters.").
 */
export function CanonPosition({ book, variant = 'full', className }: CanonPositionProps) {
  const { locale } = useI18n();
  const t = useT('literary');
  const pos = describeCanonPosition(book, locale);
  const name = bookDisplayName(pos.book.id, locale);
  if (variant === 'line') {
    return <p className={cx(styles.line, className)}>{pos.sentence}</p>;
  }
  const sections = canonSections(pos.book.testament);
  const segments = sections.map((s) => ({
    key: s.section,
    label: canonSectionLabel(s.section, locale),
    detail: t('canon.bookCount', { count: s.books.length }),
    weight: s.books.length,
    current: s.section === pos.book.section,
  }));
  return (
    <div className={cx(styles.wrap, className)}>
      <p className={styles.sentence}>{pos.sentence}</p>
      <ul className={styles.facts} aria-label={t('canon.atAGlance', { book: name })}>
        {pos.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <BookOutline
        className={styles.bar}
        segments={segments}
        label={t('canon.sectionsOf', { testament: pos.book.testament })}
        currentLabel={name}
        currentNote={t('canon.thisBook')}
      />
      <p className={styles.note}>
        <Info aria-hidden="true" className={styles.noteIcon} />
        {t('canon.note')}
      </p>
    </div>
  );
}
