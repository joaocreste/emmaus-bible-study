import { ArrowUpRight, TriangleAlert } from 'lucide-react';
import { localizeAuthor } from '../../../domain/attribution';
import type { CommentaryEntry } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useProviders } from '../../../providers/ProvidersContext';
import { useSession } from '../../../state/session';
import { displayYear, localizeYear } from '../../common/attribution';
import { AuthorMonogram } from '../../common/AuthorMonogram';
import { useEnglishLang } from '../../common/InEnglish';
import { rich } from '../../common/rich';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { RefChipRow } from '../context/RefChipRow';
import { StudyItemCard } from '../context/StudyItemCard';
import { Paragraphs } from '../context/SynthesisBlock';
import styles from './CommentaryCard.module.css';
import { displayProvenance, entryLink, entryLocator, presentEntry, stripOuterQuotes } from './presentation';

/**
 * A voice from the Christian tradition. Verified quotations are set in serif italic
 * inside quotation marks with "— Author, Work, locator"; summaries are introduced as
 * "Summary of Work (year)" and never quoted; anything unverified is flagged. A verified quotation
 * keeps its original words; a localized edition's free translation (`translatedText`) is shown
 * beneath it, smaller and labelled "Free translation — not verified".
 */
export function CommentaryCard({ entry }: { entry: CommentaryEntry }) {
  const { sources } = useProviders();
  const { openInspector } = useSession();
  const { locale } = useI18n();
  const t = useT('commentary');
  const tp = useT('provenance');
  const englishLang = useEnglishLang();
  const author = localizeAuthor(sources.getAuthor(entry.authorId), locale);
  const source = sources.getSource(entry.sourceId);
  const presentation = presentEntry(entry, source);
  const provenance = displayProvenance(entry, presentation);
  const link = entryLink(entry, source);
  const locator = entryLocator(entry, source);
  const year = displayYear(source?.year, locale);
  const work = source?.title ?? t('card.unlistedWork');
  const nameId = `cm-name-${entry.id}`;
  const meta = author
    ? [author.lifespan && localizeYear(author.lifespan, locale), author.tradition, t(`era.${author.era}.label`)].filter(Boolean).join(' · ')
    : undefined;

  return (
    <StudyItemCard itemId={entry.id} as="li" labelledBy={nameId} className={styles.card}>
      <header className={styles.header}>
        {author && <AuthorMonogram author={author} size="md" />}
        <div className={styles.who}>
          <h4 id={nameId} className={styles.name}>
            {author ? (
              <button
                type="button"
                className={styles.nameButton}
                onClick={() => openInspector({ type: 'author', authorId: author.id })}
              >
                {author.name}
              </button>
            ) : (
              <span className={styles.unknown}>{t('card.unknownAuthor', { id: entry.authorId })}</span>
            )}
          </h4>
          {meta && <p className={styles.meta}>{meta}</p>}
        </div>
      </header>

      {entry.lead && (
        <p className={styles.lead}>
          <ScriptText text={entry.lead} />
        </p>
      )}

      {presentation.mode === 'quotation' && (
        <figure className={styles.quote}>
          <blockquote cite={link} className={styles.blockquote} {...englishLang}>
            <p className={`t-quote ${styles.quoteText}`}>
              “<ScriptText text={stripOuterQuotes(entry.text)} />”
            </p>
          </blockquote>
          <figcaption className={styles.attribution}>
            — {author?.name ?? t('card.unknownAuthorShort')}, <cite>{work}</cite>
            {locator && (
              <>
                , <ScriptText text={locator} />
              </>
            )}
          </figcaption>
        </figure>
      )}

      {presentation.mode === 'quotation' && entry.translatedText && (
        <div className={styles.freeTranslation}>
          <p className={styles.freeTranslationLabel}>{tp('freeTranslation')}</p>
          <p className={styles.freeTranslationText}>
            <ScriptText text={entry.translatedText} />
          </p>
        </div>
      )}

      {(presentation.mode === 'summary' || presentation.mode === 'unverified-summary') && (
        <div className={styles.summary}>
          <p className={styles.summaryLabel}>
            {rich(t('card.summaryOf', { work }), { cite: (w) => <cite>{w}</cite> })}
            {year && <> ({year})</>}
            {locator && (
              <span className={styles.locator}>
                {' '}
                · <ScriptText text={locator} />
              </span>
            )}
          </p>
          {presentation.mode === 'unverified-summary' && (
            <p className={styles.warning}>
              <TriangleAlert aria-hidden="true" className={styles.warningIcon} />
              <span>{rich(t('card.unverified'), { strong: (w) => <strong>{w}</strong> })}</span>
            </p>
          )}
          <Paragraphs text={entry.text} className={styles.summaryText} />
        </div>
      )}

      {presentation.mode === 'withheld' && (
        <p className={styles.warning}>
          <TriangleAlert aria-hidden="true" className={styles.warningIcon} />
          <span>{presentation.reason === 'license' ? t('card.withheld.license', { work }) : t('card.withheld.missing')}</span>
        </p>
      )}

      {link && (
        <p className={styles.links}>
          <a href={link} target="_blank" rel="noopener noreferrer" className={styles.readSource}>
            {t('card.readSource')}
            <ArrowUpRight aria-hidden="true" className={styles.linkIcon} />
            <span className="visually-hidden">{t('card.readSourceHidden', { work })}</span>
          </a>
        </p>
      )}

      <RefChipRow verses={entry.relatedVerses} label={t('card.on')} />
      <ProvenanceLine provenance={provenance} />
    </StudyItemCard>
  );
}
