/**
 * License names in the reader's language. The registry writes licenses as their holders do
 * ("Public domain", "Domaine public", "CC BY 4.0", "© 2009 N. T. Wright"); plain public-domain
 * statements (and the few qualified ones in the registry) are phrased in the reader's language,
 * while license identifiers and copyright lines stay exactly as written.
 */
import type { License } from '../../domain/models';
import { translate } from '../../i18n/catalog';
import { LOCALES, type Locale } from '../../i18n/locales';

const PLAIN_PUBLIC_DOMAIN = /^(public domain|domínio público|dominio público|domaine public)$/i;

export function licenseName(license: License, locale: Locale): string {
  const name = license.name.trim();
  if (locale === 'en' && !PLAIN_PUBLIC_DOMAIN.test(name)) return license.name;
  if (PLAIN_PUBLIC_DOMAIN.test(name)) return translate(locale, 'inspector', 'license.publicDomain');
  let m = /^public domain \(dataset: (.+)\)$/i.exec(name);
  if (m) return translate(locale, 'inspector', 'license.publicDomainDataset', { license: m[1] });
  m = /^public domain \((\d{4}) translation\)$/i.exec(name);
  if (m) return translate(locale, 'inspector', 'license.publicDomainTranslation', { year: m[1] });
  if (/^public domain \(outside the united kingdom\)$/i.test(name)) return translate(locale, 'inspector', 'license.publicDomainOutsideUK');
  m = /^public domain \(dedicated (.+)\)$/i.exec(name);
  if (m) {
    const date = new Date(m[1]);
    if (Number.isFinite(date.getTime())) {
      const when = new Intl.DateTimeFormat(LOCALES[locale].bcp47, { dateStyle: 'long' }).format(date);
      return translate(locale, 'inspector', 'license.publicDomainDedicated', { date: when });
    }
  }
  if (/^free to use \(per-resource licenses apply\)$/i.test(name)) return translate(locale, 'inspector', 'license.freePerResource');
  return license.name;
}
