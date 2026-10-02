import { ArrowUpRight } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { LicenseStatus } from '../../domain/models';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { useProviders } from '../../providers/ProvidersContext';
import { useSession } from '../../state/session';
import { localizeLocator } from '../common/locator';
import { renderWithScripts, ScriptText } from '../common/ScriptText';
import { Badge, type BadgeProps } from '../primitives';
import { useSectionMeta } from '../study/types';
import { InEnglish, useEnglishLang } from '../study/words/InEnglish';
import { findCitationSites, type CitationSite } from './citations';
import { licenseName } from './licenseText';
import styles from './InspectorViews.module.css';

/** Source types, license statuses and usage policies are phrased by the 'inspector' namespace (`type.*`, `status.*`, `usage.*`). */
const LICENSE_TONE: Record<LicenseStatus, NonNullable<BadgeProps['tone']>> = {
  'public-domain': 'olive',
  'open-license': 'sage',
  copyrighted: 'terracotta',
};

interface SourceViewProps {
  sourceId: string;
  /** the retrieved text the selected statement rests on (generated studies) */
  excerpt?: string;
  /** where in the work the excerpt comes from */
  locator?: string;
  titleId: string;
  onDone(): void;
}

/** Excerpts longer than this start collapsed. */
const EXCERPT_PREVIEW = 900;

/**
 * "Cited passage": the retrieved text a generated statement rests on, verbatim from the
 * knowledge base, with its locator — so the reader can check the claim against its source.
 */
function CitedPassage({ excerpt, locator }: { excerpt: string; locator?: string }) {
  const id = useId();
  const t = useT('inspector');
  const ts = useT('sources');
  const { locale } = useI18n();
  const shown = locator ? localizeLocator(locator, locale, ts) : undefined;
  const [whole, setWhole] = useState(false);
  const long = excerpt.length > EXCERPT_PREVIEW;
  const text = !long || whole ? excerpt : `${excerpt.slice(0, EXCERPT_PREVIEW - 20).replace(/\s+\S*$/, '')} …`;
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <section className={styles.cited} aria-labelledby={id}>
      <p id={id} className={styles.eyebrow}>
        {t('cited.title')}
        {shown && (
          <span className={styles.citedLocator}>
            {' · '}
            <ScriptText text={shown} />
          </span>
        )}
      </p>
      <div className={styles.citedText}>
        {paragraphs.map((p, i) => (
          <p key={i}>{renderWithScripts(p)}</p>
        ))}
      </div>
      {long && (
        <button type="button" className={styles.citedToggle} aria-expanded={whole} onClick={() => setWhole((w) => !w)}>
          {whole ? t('cited.showLess') : t('cited.showAll')}
        </button>
      )}
      <p className={styles.muted}>{t('cited.note')}</p>
    </section>
  );
}

/** Source view: bibliographic record, license and usage policy, and where the study relies on it. */
export function SourceView({ sourceId, excerpt, locator, titleId, onDone }: SourceViewProps) {
  const { study, openInspector, focusDashboard } = useSession();
  const { sources } = useProviders();
  const t = useT('inspector');
  const tc = useT('common');
  const sectionMeta = useSectionMeta();
  const { locale } = useI18n();
  const english = useEnglishLang();
  const source = sources.getSource(sourceId);

  const sites = useMemo(
    () => (study ? findCitationSites(study, sourceId, (id) => sources.getAuthor(id)?.name, locale) : []),
    [study, sourceId, sources, locale],
  );

  if (!source) {
    return (
      <div className={styles.view}>
        <h2 id={titleId} className={styles.title}>
          {t('source.unknown.title')}
        </h2>
        <p className={styles.reading}>{t('source.unknown.text', { id: sourceId })}</p>
        {excerpt && <CitedPassage excerpt={excerpt} locator={locator} />}
      </div>
    );
  }

  const authors = source.authorIds.map((id) => sources.getAuthor(id)).filter((a) => a != null);
  const licenseTone = LICENSE_TONE[source.license.status];
  const license = licenseName(source.license, locale);

  const goTo = (site: CitationSite) => {
    focusDashboard({ section: site.section, expandIds: site.itemId ? [site.itemId] : undefined });
    onDone();
  };

  return (
    <div className={styles.view}>
      <div className={styles.titleBlock}>
        <p className={styles.eyebrow}>{t(`type.${source.type}`)}</p>
        <h2 id={titleId} className={styles.title}>
          <ScriptText text={source.title} />
        </h2>
        {(authors.length > 0 || source.year) && (
          <p className={styles.byline}>
            {authors.map((a, i) => (
              <span key={a.id}>
                <button type="button" className={styles.authorLink} onClick={() => openInspector({ type: 'author', authorId: a.id })}>
                  {a.name}
                </button>
                {i < authors.length - 1 ? ',' : ''}
              </span>
            ))}
            {source.year && <span>{authors.length > 0 ? '· ' : ''}{source.year}</span>}
          </p>
        )}
      </div>

      {excerpt && <CitedPassage excerpt={excerpt} locator={locator} />}

      {(source.publisher || source.edition) && (
        <dl className={styles.facts}>
          {source.publisher && (
            <>
              <dt>{t('source.publisher')}</dt>
              <dd>{source.publisher}</dd>
            </>
          )}
          {source.edition && (
            <>
              <dt>{t('source.edition')}</dt>
              <dd>{source.edition}</dd>
            </>
          )}
        </dl>
      )}

      {source.description && (
        <p className={styles.reading}>
          <span lang={english}>
            <ScriptText text={source.description} />
          </span>{' '}
          <InEnglish />
        </p>
      )}

      <div className={styles.license}>
        <div className={styles.licenseRow}>
          <Badge tone={licenseTone}>{t(`status.${source.license.status}`)}</Badge>
          {source.license.url ? (
            <a href={source.license.url} target="_blank" rel="noopener noreferrer">
              {license}
            </a>
          ) : (
            <span>{license}</span>
          )}
        </div>
        <p className={styles.usage}>{t(`usage.${source.license.usage}`)}</p>
        {source.license.attribution && <p className={styles.muted}>{source.license.attribution}</p>}
      </div>

      {source.url && (
        <a className={styles.externalLink} href={source.url} target="_blank" rel="noopener noreferrer">
          {t('source.read')}
          <ArrowUpRight aria-hidden="true" />
          <span className="visually-hidden"> {tc('opensInNewTab')}</span>
        </a>
      )}

      <div className={styles.block}>
        <p className={styles.eyebrow}>{t('source.citedIn')}</p>
        {sites.length > 0 ? (
          <ul className={styles.sites}>
            {sites.map((site, i) => (
              <li key={`${site.section}-${site.label}-${site.locator ?? ''}-${i}`}>
                <button type="button" className={styles.site} onClick={() => goTo(site)}>
                  <span className={styles.siteText}>
                    <span className={styles.siteSection}>
                      {sectionMeta(site.section).navLabel}
                    </span>
                    <span>{site.label}</span>
                  </span>
                  {site.locator && <span className={styles.siteLocator}>{site.locator}</span>}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>
            {study?.sourceIds.includes(sourceId) ? t('source.dataOnly') : t('source.notCited')}
          </p>
        )}
      </div>
    </div>
  );
}
