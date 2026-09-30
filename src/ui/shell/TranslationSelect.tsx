import { ChevronDown } from 'lucide-react';
import { useId, useMemo } from 'react';
import type { TranslationId } from '../../domain/models';
import { BIBLE_VERSIONS } from '../../domain/translations';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { LOCALES } from '../../i18n/locales';
import { cx } from '../../lib/cx';
import { useProviders } from '../../providers/ProvidersContext';
import { useSession } from '../../state/session';
import styles from './TranslationSelect.module.css';
import { groupTranslations, languageOf, type TranslationOption } from './translationGroups';

/** Used when the scripture provider cannot list its translations: the bundled registry. */
const FALLBACK_TRANSLATIONS: TranslationOption[] = BIBLE_VERSIONS.map((v) => ({ id: v.id, name: v.name, shortName: v.shortName }));

/** Translations offered by the scripture provider (the bundled registry if it throws). */
export function useTranslations(): TranslationOption[] {
  const { scripture } = useProviders();
  return useMemo(() => {
    try {
      const list = scripture.listTranslations();
      return list.length ? list : FALLBACK_TRANSLATIONS;
    } catch {
      return FALLBACK_TRANSLATIONS;
    }
  }, [scripture]);
}

interface TranslationSelectProps {
  /** 'compact' = pill in the top bar (label visually hidden); 'field' = full-width with a visible label */
  variant?: 'compact' | 'field';
  className?: string;
}

/**
 * Native <select> for the reading translation — the most robust control on every device.
 * Options read "BLIVRE — Bíblia Livre": the reader's language first, then "Other languages".
 * The compact pill shows only the abbreviation: the (transparent) select lies over it, so the
 * native list still opens with the full names.
 */
export function TranslationSelect({ variant = 'compact', className }: TranslationSelectProps) {
  const { settings, updateSettings } = useSession();
  const { locale } = useI18n();
  const t = useT('shell');
  const translations = useTranslations();
  const id = useId();
  const current = translations.find((tr) => tr.id === settings.translation);
  const { own, other } = useMemo(() => groupTranslations(translations, locale), [translations, locale]);
  const compact = variant === 'compact';

  const option = (tr: TranslationOption, withLanguage: boolean) => {
    const lang = LOCALES[languageOf(tr.id)];
    return (
      <option key={tr.id} value={tr.id} lang={lang.bcp47}>
        {withLanguage ? `${tr.shortName} — ${tr.name} (${lang.endonym})` : `${tr.shortName} — ${tr.name}`}
      </option>
    );
  };

  return (
    <div className={cx(styles.wrap, styles[variant], className)}>
      <label htmlFor={id} className={compact ? 'visually-hidden' : styles.label}>
        {t('translation.label')}
      </label>
      <div className={styles.control}>
        <select
          id={id}
          className={styles.select}
          value={settings.translation}
          onChange={(e) => updateSettings({ translation: e.target.value as TranslationId })}
          title={current ? t('translation.title', { name: current.name }) : undefined}
        >
          {other.length ? (
            <>
              <optgroup label={LOCALES[locale].endonym}>{own.map((tr) => option(tr, false))}</optgroup>
              <optgroup label={t('translation.group.other')}>{other.map((tr) => option(tr, true))}</optgroup>
            </>
          ) : (
            own.map((tr) => option(tr, false))
          )}
        </select>
        {compact && (
          <span className={styles.value} aria-hidden="true">
            {current?.shortName ?? settings.translation}
          </span>
        )}
        <ChevronDown aria-hidden="true" className={styles.chevron} />
      </div>
    </div>
  );
}
