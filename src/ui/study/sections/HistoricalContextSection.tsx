import { bookDisplayName, tryGetBook } from '../../../domain/books';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { BookIntroductionCard } from '../context/BookIntroductionCard';
import { sortContextItems } from '../context/categories';
import { ContextCard } from '../context/ContextCard';
import { EmptyState } from '../context/EmptyState';
import { useStudyUI } from '../StudyUIContext';
import { StudySection } from '../StudySection';
import type { SectionProps } from '../types';
import styles from './HistoricalContextSection.module.css';

/**
 * Historical & cultural context — curated context items grouped by category
 * (authorship → period → occasion → audience → world → customs → genre), then the
 * book introduction from the HistoricalContextProvider. Library studies lead with
 * the introduction and say plainly that curated context is not yet available.
 */
export function HistoricalContextSection({ study, index }: SectionProps) {
  const { pinnedIds } = useStudyUI();
  const { locale } = useI18n();
  const t = useT('context');
  const book = study.passage?.book;
  const bookName = book ? (tryGetBook(book) ? bookDisplayName(book, locale) : book) : undefined;
  const hasCurated = study.context.length > 0;

  const pinned = study.context.filter((c) => pinnedIds.has(c.id));
  const ordered = [...pinned, ...sortContextItems(study.context.filter((c) => !pinnedIds.has(c.id)))];

  return (
    <StudySection id="historical-context" index={index}>
      {hasCurated ? (
        <ul className={styles.grid} aria-label={t('section.list')}>
          {ordered.map((item) => (
            <ContextCard key={item.id} item={item} />
          ))}
        </ul>
      ) : book ? (
        <EmptyState size="sm" title={t('empty.noCurated.title')} className={styles.note}>
          <p>{t('empty.noCurated.text', { book: bookName })}</p>
        </EmptyState>
      ) : (
        <EmptyState size="sm" title={t('empty.noPassage.title')}>
          <p>{t('empty.noPassage.text')}</p>
        </EmptyState>
      )}

      {book && (
        <div className={hasCurated ? styles.intro : undefined}>
          <BookIntroductionCard book={book} defaultOpen={!hasCurated} />
        </div>
      )}
    </StudySection>
  );
}
