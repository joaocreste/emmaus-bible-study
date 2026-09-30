import { ArrowUpRight } from 'lucide-react';
import type { Source } from '../../../domain/models';
import type { Locale } from '../../../i18n/locales';
import { translator } from '../../../i18n/catalog';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useProviders } from '../../../providers/ProvidersContext';
import { useSession } from '../../../state/session';
import { localizeYear } from '../../common/attribution';
import { ScriptText } from '../../common/ScriptText';
import { Badge } from '../../primitives';
import { InEnglish, useEnglishLang } from '../words/InEnglish';
import { citationPlaceLabel, type SourceUsage } from './citations';
import { licenseBadge, localizeLicenseName, usagePolicyText } from './grouping';
import styles from './SourceCard.module.css';

interface SourceCardProps {
  source: Source;
  usage?: SourceUsage;
  headingLevel?: 3 | 4;
}

/**
 * Bibliography entry: title (opens the source in the Inspector), authors, year,
 * publisher/edition, license badge, what the license allows in plain words, the
 * required attribution, a description, a reading link, and where the study cites it.
 */
export function SourceCard({ source, usage, headingLevel = 4 }: SourceCardProps) {
  const { sources } = useProviders();
  const { openInspector } = useSession();
  const { locale } = useI18n();
  const t = useT('sources');
  // source descriptions exist only in English (registry data): marked as such, as in the Inspector
  const english = useEnglishLang();
  const H = headingLevel === 3 ? 'h3' : 'h4';
  const badge = licenseBadge(source.license, locale);
  const BadgeIcon = badge.icon;
  const authors = source.authorIds.map((id) => sources.getAuthor(id)?.name).filter((n): n is string => Boolean(n));
  const byline = [authors.join(', '), source.year && localizeYear(source.year, locale), source.edition, source.publisher].filter(Boolean);

  return (
    <li className={styles.card}>
      <div className={styles.head}>
        <H className={styles.title}>
          <button type="button" className={styles.titleButton} onClick={() => openInspector({ type: 'source', sourceId: source.id })}>
            <ScriptText text={source.title} />
          </button>
        </H>
        <Badge tone={badge.tone} icon={<BadgeIcon aria-hidden="true" />} title={localizeLicenseName(source.license.name, locale)}>
          {badge.label}
        </Badge>
      </div>
      {byline.length > 0 && <p className={styles.byline}>{byline.join(' · ')}</p>}
      {source.description && (
        <p className={styles.description}>
          <span lang={english}>
            <ScriptText text={source.description} />
          </span>
          {english && (
            <>
              {' '}
              <InEnglish />
            </>
          )}
        </p>
      )}

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>{t('card.useInEmmaus')}</dt>
          <dd>{usagePolicyText(source.license.usage, locale)}</dd>
        </div>
        {source.license.attribution && (
          <div className={styles.fact}>
            <dt>{t('card.attribution')}</dt>
            <dd>{source.license.attribution}</dd>
          </div>
        )}
        <div className={styles.fact}>
          <dt>{t('card.inThisStudy')}</dt>
          <dd>{usageText(source, usage, locale)}</dd>
        </div>
      </dl>

      {source.url && (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {t('card.readSource')}
          <ArrowUpRight aria-hidden="true" className={styles.linkIcon} />
          <span className="visually-hidden">{t('card.readSourceHidden', { title: source.title })}</span>
        </a>
      )}
    </li>
  );
}

function usageText(source: Source, usage: SourceUsage | undefined, locale: Locale): string {
  const t = translator(locale, 'sources');
  if (usage && usage.count > 0) {
    return t('usage.cited', { count: usage.count, places: usage.places.map((p) => citationPlaceLabel(p, locale)).join(', ') });
  }
  switch (source.type) {
    case 'bible-translation':
      return t('usage.bible-translation');
    case 'original-text':
      return t('usage.original-text');
    case 'lexicon':
      return t('usage.lexicon');
    case 'dataset':
      return t('usage.dataset');
    case 'study-notes':
    case 'commentary':
      return t('usage.commentary');
    default:
      return t('usage.other');
  }
}
