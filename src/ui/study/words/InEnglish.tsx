import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import styles from './InEnglish.module.css';

/**
 * Quiet "(em inglês)" / "(en inglés)" / "(en anglais)" marker for data that exists only in
 * English (lexicon glosses and definitions, registry descriptions). Renders nothing in English.
 */
export function InEnglish({ className }: { className?: string }) {
  const { locale } = useI18n();
  const tp = useT('provenance');
  if (locale === 'en') return null;
  return <span className={cx(styles.mark, className)}>({tp('inEnglish')})</span>;
}

/** `lang` for English-only content shown in another interface language (undefined in English). */
export function useEnglishLang(): 'en' | undefined {
  return useI18n().locale === 'en' ? undefined : 'en';
}
