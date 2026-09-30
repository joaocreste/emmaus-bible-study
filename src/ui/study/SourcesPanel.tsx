import { useT } from '../../i18n/I18nProvider';
import { useSession } from '../../state/session';
import { EmptyState } from './context/EmptyState';
import { SourcesContent } from './sources/SourcesContent';
import styles from './SourcesPanel.module.css';

/**
 * Sources for the current study as a standalone page — the iPhone "Sources" tab.
 * Same content as the dashboard's Sources section, with its own heading; it reads
 * the study from the session and does not need the study workspace around it.
 */
export function SourcesPanel() {
  const { study } = useSession();
  const t = useT('sources');
  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        {study && <p className={styles.eyebrow}>{study.title}</p>}
        <h2 className={`t-display ${styles.title}`}>{t('panel.title')}</h2>
        <p className={styles.description}>{t('panel.description')}</p>
      </header>
      {study ? (
        <SourcesContent study={study} />
      ) : (
        <EmptyState title={t('panel.empty.title')}>
          <p>{t('panel.empty.text')}</p>
        </EmptyState>
      )}
    </div>
  );
}
