import { ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { hasAuthorTranslation, localizeAuthor } from '../../domain/attribution';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { useProviders } from '../../providers/ProvidersContext';
import { useSession } from '../../state/session';
import { AuthorMonogram } from '../common/AuthorMonogram';
import { ScriptText } from '../common/ScriptText';
import { SourceChip } from '../common/SourceChip';
import { InEnglish, useEnglishLang } from '../study/words/InEnglish';
import { findAuthorAppearances } from './citations';
import styles from './InspectorViews.module.css';

interface AuthorViewProps {
  authorId: string;
  titleId: string;
  onDone(): void;
}

/** Author view: who they were, and where they appear in this study. */
export function AuthorView({ authorId, titleId, onDone }: AuthorViewProps) {
  const { study, focusDashboard } = useSession();
  const { sources } = useProviders();
  const t = useT('inspector');
  const tc = useT('common');
  const tp = useT('provenance');
  const { locale } = useI18n();
  const englishLang = useEnglishLang();
  const author = localizeAuthor(sources.getAuthor(authorId), locale);
  // Tradition and description are in the reader's language when the author registry has them; otherwise English, marked as such.
  const english = author && hasAuthorTranslation(author, locale) ? undefined : englishLang;
  const appearances = useMemo(() => (study ? findAuthorAppearances(study, authorId) : null), [study, authorId]);

  if (!author) {
    return (
      <div className={styles.view}>
        <h2 id={titleId} className={styles.title}>
          {t('author.unknown.title')}
        </h2>
        <p className={styles.reading}>{t('author.unknown.text', { id: authorId })}</p>
      </div>
    );
  }

  const entries = study && appearances ? study.commentary.filter((e) => appearances.commentaryIds.includes(e.id)) : [];
  const sermons = study && appearances ? study.sermons.filter((s) => appearances.sermonIds.includes(s.id)) : [];
  const perspectiveSets = study && appearances ? study.perspectives.filter((p) => appearances.perspectiveSetIds.includes(p.id)) : [];
  const works = study ? sources.allSources().filter((s) => s.authorIds.includes(authorId) && study.sourceIds.includes(s.id)) : [];

  const showEntry = (id: string) => {
    focusDashboard({ section: 'commentary', expandIds: [id], commentaryAuthorIds: [authorId] });
    onDone();
  };
  const showPerspective = (id: string) => {
    focusDashboard({ section: 'theology', expandIds: [id] });
    onDone();
  };

  return (
    <div className={styles.view}>
      <div className={styles.authorHead}>
        <AuthorMonogram author={author} size="lg" />
        <div className={styles.titleBlock}>
          <h2 id={titleId} className={styles.title}>
            {author.name}
          </h2>
          <p className={styles.meta}>
            {author.lifespan && <span>{author.lifespan}</span>}
            <span lang={english}>{author.tradition}</span>
            <span>{t(`era.${author.era}`)}</span>
          </p>
        </div>
      </div>

      <p className={styles.reading}>
        <span lang={english}>
          <ScriptText text={author.description} />
        </span>
        {english && (
          <>
            {' '}
            <InEnglish />
          </>
        )}
      </p>

      {author.url && (
        <a className={styles.externalLink} href={author.url} target="_blank" rel="noopener noreferrer">
          {t('author.learnMore')}
          <ArrowUpRight aria-hidden="true" />
          <span className="visually-hidden"> {tc('opensInNewTab')}</span>
        </a>
      )}

      <div className={styles.block}>
        <p className={styles.eyebrow}>{t('author.inStudy')}</p>
        {entries.length + sermons.length + perspectiveSets.length === 0 ? (
          <p className={styles.muted}>{t('author.absent', { name: author.name })}</p>
        ) : (
          <ul className={styles.sites}>
            {entries.map((e) => {
              const source = sources.getSource(e.sourceId);
              return (
                <li key={e.id}>
                  <button type="button" className={styles.site} onClick={() => showEntry(e.id)}>
                    <span className={styles.siteText}>
                      <span className={styles.siteSection}>{tp(e.kind === 'quotation' ? 'kind.quotation.label' : 'kind.summary.label')}</span>
                      <span>{e.lead ?? source?.title ?? t('author.commentaryEntry')}</span>
                      {e.lead && source && <span className={styles.muted}>{source.title}</span>}
                    </span>
                    {e.locator && <span className={styles.siteLocator}>{e.locator}</span>}
                  </button>
                </li>
              );
            })}
            {sermons.map((s) => (
              <li key={s.id}>
                <button type="button" className={styles.site} onClick={() => showEntry(s.id)}>
                  <span className={styles.siteText}>
                    <span className={styles.siteSection}>{t('author.sermon')}</span>
                    <span>{s.title}</span>
                  </span>
                  {s.date && <span className={styles.siteLocator}>{s.date}</span>}
                </button>
              </li>
            ))}
            {perspectiveSets.map((p) => (
              <li key={p.id}>
                <button type="button" className={styles.site} onClick={() => showPerspective(p.id)}>
                  <span className={styles.siteText}>
                    <span className={styles.siteSection}>{t('author.representative')}</span>
                    <span>{p.question}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {works.length > 0 && (
        <div className={styles.block}>
          <p className={styles.eyebrow}>{t('author.worksCited')}</p>
          <div className={styles.chips}>
            {works.map((w) => (
              <SourceChip key={w.id} citation={{ sourceId: w.id }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
