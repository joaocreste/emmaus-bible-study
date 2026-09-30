import type { Occurrences as OccurrencesData, OriginalLanguage } from '../../../domain/models';
import { verseToPassage } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { RefChip } from '../../common/RefChip';
import { RetryButton } from '../../common/RetryButton';
import { SourceChip } from '../../common/SourceChip';
import { useOccurrences } from '../../hooks/data';
import { fillSlots, slot } from '../types';
import styles from './Occurrences.module.css';

interface OccurrencesProps {
  strong: string;
  language: OriginalLanguage;
  /** how many references to show as chips */
  limit?: number;
  /** offered when there are more references than shown (e.g. open the Inspector) */
  onMore?(): void;
}

/** "Occurs N times in M verses of the Greek New Testament" + the first references, from the tagged-text concordance. */
export function Occurrences({ strong, language, limit = 8, onMore }: OccurrencesProps) {
  const state = useOccurrences(strong, 60);
  const t = useT('words');
  const { number } = useI18n();

  if (state.status === 'loading' || state.status === 'idle') {
    return <p className={styles.muted}>{t('occ.counting')}</p>;
  }
  if (state.status === 'error') {
    return (
      <p className={styles.muted}>
        {t('occ.error', { strong })} <RetryButton onRetry={state.retry} />
      </p>
    );
  }
  if (!state.data) {
    return <p className={styles.muted}>{t('occ.unavailable', { strong })}</p>;
  }

  const { total, refs, sourceId } = state.data;
  // `total` counts verses; providers may also report tagged words (a verse can use a word twice).
  const words = (state.data as OccurrencesData & { wordCount?: number }).wordCount;
  const shown = refs.slice(0, limit);
  const remaining = total - shown.length;
  const corpus = t(`corpus.${language}`);

  return (
    <div className={styles.occurrences}>
      <p className={styles.count}>
        {words != null && words > 0
          ? fillSlots(t('occ.occurs', { words, n: slot('n'), verses: total, corpus }), { n: <strong>{number(words)}</strong> })
          : fillSlots(t('occ.found', { n: slot('n'), corpus }), { n: <strong>{t('occ.verses', { count: total })}</strong> })}
      </p>
      {shown.length > 0 && (
        <ul className={styles.refs} aria-label={t('occ.first', { count: shown.length })}>
          {shown.map((v) => (
            <li key={`${v.book}.${v.chapter}.${v.verse}`}>
              <RefChip passage={verseToPassage(v)} />
            </li>
          ))}
          {remaining > 0 && (
            <li>
              {onMore ? (
                <button type="button" className={styles.more} onClick={onMore}>
                  {t('occ.more', { count: remaining })}
                </button>
              ) : (
                <span className={styles.moreText}>{t('occ.more', { count: remaining })}</span>
              )}
            </li>
          )}
        </ul>
      )}
      <div className={styles.source}>
        <span className={styles.sourceLabel}>{t('occ.concordance')}</span>
        <SourceChip citation={{ sourceId }} />
      </div>
    </div>
  );
}
