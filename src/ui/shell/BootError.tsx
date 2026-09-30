import { useT } from '../../i18n/I18nProvider';
import { CrossMark } from '../primitives';
import styles from './BootError.module.css';

/** Rendered by main.tsx (inside an <I18nProvider> for the saved language) if the provider registry or engine cannot be created. */
export function BootError({ error }: { error: unknown }) {
  const t = useT('shell');
  const detail = error instanceof Error ? error.message : String(error);
  return (
    <main className={styles.boot}>
      <CrossMark size={48} className={styles.mark} />
      <h1 className={styles.title}>{t('boot.title')}</h1>
      <p className={styles.text}>{t('boot.text')}</p>
      <pre className={styles.detail}>{detail}</pre>
      <button type="button" className={styles.reload} onClick={() => window.location.reload()}>
        {t('boot.reload')}
      </button>
    </main>
  );
}
