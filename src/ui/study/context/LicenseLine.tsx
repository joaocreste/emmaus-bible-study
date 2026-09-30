import { Scale } from 'lucide-react';
import type { Source } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { localizeLicenseName } from '../sources/grouping';
import styles from './LicenseLine.module.css';

/**
 * The license footer shown wherever openly licensed or public-domain text is displayed:
 * license name (linked when a URL exists) and the attribution the license requires.
 */
export function LicenseLine({ source, className }: { source: Source; className?: string }) {
  const { license } = source;
  const { locale } = useI18n();
  const t = useT('context');
  const tc = useT('common');
  const licenseName = localizeLicenseName(license.name, locale);
  const name = license.url ? (
    <a href={license.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
      {licenseName}
      <span className="visually-hidden"> {tc('opensInNewTab')}</span>
    </a>
  ) : (
    licenseName
  );
  return (
    <p className={cx(styles.line, className)}>
      <Scale aria-hidden="true" className={styles.icon} />
      <span>
        <span className={styles.label}>{t('license.label')}</span> {name}
        {license.attribution && <span className={styles.attribution}> · {license.attribution}</span>}
      </span>
    </p>
  );
}
