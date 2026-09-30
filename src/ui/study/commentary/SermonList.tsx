import { ArrowUpRight, Mic } from 'lucide-react';
import type { SermonRecord } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useProviders } from '../../../providers/ProvidersContext';
import { ProvenanceLine, SourceChip } from '../../common/SourceChip';
import { RefChipRow } from '../context/RefChipRow';
import { StudyItemCard } from '../context/StudyItemCard';
import { Paragraphs } from '../context/SynthesisBlock';
import { AuthorChip } from './AuthorChip';
import styles from './SermonList.module.css';

/** Sermons on the passage/topic: title, preacher, date, series, link, and a labelled summary when curated. */
export function SermonList({ sermons, priorityAuthorIds = [] }: { sermons: SermonRecord[]; priorityAuthorIds?: readonly string[] }) {
  const ordered =
    priorityAuthorIds.length > 0
      ? [...sermons].sort((a, b) => Number(priorityAuthorIds.includes(b.authorId)) - Number(priorityAuthorIds.includes(a.authorId)))
      : sermons;
  const t = useT('commentary');
  return (
    <ul className={styles.list} aria-label={t('sermons.list')}>
      {ordered.map((s) => (
        <SermonItem key={s.id} sermon={s} />
      ))}
    </ul>
  );
}

function SermonItem({ sermon: s }: { sermon: SermonRecord }) {
  const { sources } = useProviders();
  const i18n = useI18n();
  const t = useT('commentary');
  const source = sources.getSource(s.sourceId);
  const titleId = `sermon-title-${s.id}`;
  const link = s.url ?? source?.url;
  const facts = [s.date && formatSermonDate(s.date, i18n), s.series].filter(Boolean);
  return (
    <StudyItemCard itemId={s.id} as="li" labelledBy={titleId} className={styles.item}>
      <span className={styles.icon} aria-hidden="true">
        <Mic />
      </span>
      <div className={styles.body}>
        <h4 id={titleId} className={styles.title}>
          {s.title}
        </h4>
        <div className={styles.meta}>
          <AuthorChip authorId={s.authorId} />
          {facts.length > 0 && <span className={styles.facts}>{facts.join(' · ')}</span>}
        </div>
        {s.summary && (
          <div className={styles.summary}>
            <p className={styles.summaryLabel}>
              {s.summary.provenance.kind === 'summary' ? t('sermons.summaryOf') : t('sermons.about')}
            </p>
            <Paragraphs text={s.summary.text} className={styles.summaryText} />
            <ProvenanceLine provenance={s.summary.provenance} />
          </div>
        )}
        <div className={styles.actions}>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {t('sermons.listen')}
              <ArrowUpRight aria-hidden="true" className={styles.linkIcon} />
              <span className="visually-hidden">{t('sermons.listenHidden', { title: s.title })}</span>
            </a>
          )}
          <SourceChip citation={{ sourceId: s.sourceId }} />
        </div>
        <RefChipRow refs={s.refs} label={t('sermons.text')} />
      </div>
    </StudyItemCard>
  );
}

/**
 * A sermon's ISO date ("1872-08-04") in the reader's language ("4 de ago. de 1872"). English keeps
 * the date as recorded; anything that is not a full ISO date is shown unchanged.
 */
function formatSermonDate(date: string, i18n: ReturnType<typeof useI18n>): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (i18n.locale === 'en' || !m) return date;
  return i18n.date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])), { dateStyle: 'medium', timeZone: 'UTC' });
}
