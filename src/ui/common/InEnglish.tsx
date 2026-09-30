import { useI18n, useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import styles from './InEnglish.module.css';

/**
 * "(em inglês)" / "(en inglés)" / "(en anglais)" — marks text from an open dataset that exists
 * only in English (Tyndale notes and introductions, classic commentaries, dictionaries,
 * lexicon definitions) when the interface is in another language. Renders nothing in English.
 */
export function InEnglishMark({ className }: { className?: string }) {
  const { locale } = useI18n();
  const t = useT('provenance');
  if (locale === 'en') return null;
  return <span className={cx(styles.mark, className)}>({t('inEnglish')})</span>;
}

/** `lang="en"` for English-only text inside a non-English page (so screen readers switch voice). */
export function useEnglishLang(): { lang?: 'en' } {
  const { locale } = useI18n();
  return locale === 'en' ? {} : { lang: 'en' };
}
