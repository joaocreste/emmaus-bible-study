import { BookOpenText } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { BookId, Provenance } from '../../../domain/models';
import { bookDisplayName, tryGetBook } from '../../../domain/books';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { useProviders } from '../../../providers/ProvidersContext';
import { InEnglishMark, useEnglishLang } from '../../common/InEnglish';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { RetryButton } from '../../common/RetryButton';
import { useBookIntroduction } from '../../hooks/data';
import { CrossLoader } from '../../primitives';
import { useStudyUI } from '../StudyUIContext';
import styles from './BookIntroductionCard.module.css';
import { parseIntroduction, splitIntroLead, type IntroBlock } from './introText';
import { LicenseLine } from './LicenseLine';
import { StudyItemCard } from './StudyItemCard';

interface BookIntroductionCardProps {
  book: BookId;
  /** library studies: the introduction is the main content and starts open */
  defaultOpen?: boolean;
}

/** Id a DashboardFocus can use (`expandIds`) to open a book introduction. */
export function bookIntroItemId(book: BookId): string {
  return `book-intro-${book}`;
}

/**
 * "Introduction to Romans" — the book introduction from the HistoricalContextProvider
 * (Tyndale Open Study Notes, CC BY-SA 4.0). First paragraph visible; the rest on expand.
 */
export function BookIntroductionCard({ book, defaultOpen = false }: BookIntroductionCardProps) {
  const intro = useBookIntroduction(book);
  const { sources } = useProviders();
  const { isExpanded, setExpanded } = useStudyUI();
  const itemId = bookIntroItemId(book);
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = localOpen || isExpanded(itemId);
  const panelId = useId();
  const titleId = `${itemId}-title`;
  const { locale } = useI18n();
  const t = useT('context');
  const englishLang = useEnglishLang();
  const name = tryGetBook(book) ? bookDisplayName(book, locale) : book;

  const blocks = useMemo(() => (intro.data ? parseIntroduction(intro.data.text) : []), [intro.data]);
  const { lead, rest } = useMemo(() => splitIntroLead(blocks), [blocks]);
  const restHeadings = rest.filter((b) => b.type === 'heading').map((b) => b.text);
  const minutes = Math.max(1, Math.round(wordCount(rest) / 220));

  const toggle = () => {
    if (open) {
      setLocalOpen(false);
      setExpanded(itemId, false);
    } else setLocalOpen(true);
  };

  const source = intro.data ? sources.getSource(intro.data.sourceId) : undefined;
  const provenance: Provenance | undefined = intro.data
    ? { kind: 'historical', verification: 'source-derived', citations: [{ sourceId: intro.data.sourceId }] }
    : undefined;

  return (
    <StudyItemCard itemId={itemId} labelledBy={titleId} className={styles.card}>
      <p className={styles.eyebrow}>
        <BookOpenText aria-hidden="true" className={styles.eyebrowIcon} />
        {t('intro.eyebrow')}
        <InEnglishMark />
      </p>
      <h3 id={titleId} className={styles.title}>
        {t('intro.title', { book: name })}
      </h3>

      {(intro.status === 'loading' || intro.status === 'idle') && (
        <div className={styles.status}>
          <CrossLoader size={20} label={t('intro.loadingLabel', { book: name })} />
          <span aria-hidden="true">{t('intro.loading')}</span>
        </div>
      )}

      {intro.status === 'error' && (
        <p className={styles.unavailable}>
          {t('intro.error', { book: name })}{' '}
          <RetryButton onRetry={intro.retry} />
        </p>
      )}

      {intro.status === 'success' && !intro.data && (
        <p className={styles.unavailable}>{t('intro.none', { book: name })}</p>
      )}

      {intro.status === 'success' && intro.data && (
        <>
          <div className={styles.prose} {...englishLang}>
            <IntroBlocks blocks={lead} dropCap />
            {rest.length > 0 && (
              <div id={panelId} hidden={!open} className={styles.rest}>
                {open && <IntroBlocks blocks={rest} />}
              </div>
            )}
          </div>

          {rest.length > 0 && (
            <div className={styles.more}>
              <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={panelId} onClick={toggle}>
                {open ? t('intro.showLess') : t('intro.continue')}
                {!open && <span className={styles.toggleMeta}> {t('intro.minutes', { minutes })}</span>}
              </button>
              {!open && restHeadings.length > 0 && (
                <p className={styles.toc}>
                  <span className={styles.tocLabel}>{t('intro.alsoCovers')}</span>{' '}
                  <span {...englishLang}>{restHeadings.slice(0, 6).join(' · ')}</span>
                  {restHeadings.length > 6 ? ' …' : ''}
                </p>
              )}
            </div>
          )}

          {provenance && <ProvenanceLine provenance={provenance} />}
          {source && <LicenseLine source={source} />}
        </>
      )}
    </StudyItemCard>
  );
}

function IntroBlocks({ blocks, dropCap = false }: { blocks: IntroBlock[]; dropCap?: boolean }) {
  let firstParagraph = dropCap;
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          return (
            <h4 key={i} className={styles.heading}>
              <ScriptText text={b.text} />
            </h4>
          );
        }
        const cls = cx(styles.paragraph, firstParagraph && styles.dropCap);
        firstParagraph = false;
        return (
          <p key={i} className={cls}>
            <ScriptText text={b.text} />
          </p>
        );
      })}
    </>
  );
}

function wordCount(blocks: IntroBlock[]): number {
  return blocks.reduce((n, b) => n + b.text.split(/\s+/).filter(Boolean).length, 0);
}
