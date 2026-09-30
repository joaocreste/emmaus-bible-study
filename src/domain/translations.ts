/**
 * Bible versions bundled with Emmaus (public domain or openly licensed), by language.
 * Framework-free registry shared by the scripture provider, settings, engine and UI.
 */
import type { TranslationId } from './models';
import type { Locale } from '../i18n/locales';

export interface BibleVersion {
  id: TranslationId;
  language: Locale;
  /** abbreviation shown in the selector ("BSB", "LSG", "RVR1909") */
  shortName: string;
  /** full name in its own language */
  name: string;
  year?: string;
  /** SourceRegistry id */
  sourceId: string;
  /** Free Use Bible API translation id used by the data pipeline */
  apiId: string;
  /** one line, in English (Sources/Inspector may localise around it) */
  description: string;
}

export const BIBLE_VERSIONS: BibleVersion[] = [
  { id: 'BSB', language: 'en', shortName: 'BSB', name: 'Berean Standard Bible', year: '2016–2022', sourceId: 'bsb', apiId: 'BSB', description: 'Modern, readable translation from the Hebrew, Aramaic and Greek; public domain since 2023.' },
  { id: 'KJV', language: 'en', shortName: 'KJV', name: 'King James Version', year: '1611/1769', sourceId: 'kjv', apiId: 'eng_kjv', description: 'The Authorized Version, in the standardised 1769 text.' },
  { id: 'WEB', language: 'en', shortName: 'WEB', name: 'World English Bible', year: '2000–2020', sourceId: 'web', apiId: 'ENGWEBP', description: 'Public-domain modern update of the American Standard Version (1901).' },

  { id: 'BLIVRE', language: 'pt', shortName: 'BLIVRE', name: 'Bíblia Livre', year: '2018', sourceId: 'biblia-livre', apiId: 'por_blj', description: 'Free Portuguese translation in the Almeida tradition (Diego Santos, Mario Sérgio, Marco Teles); CC BY 4.0.' },
  { id: 'NBV', language: 'pt', shortName: 'NBV', name: 'Nova Bíblia Viva', year: '2007–2010', sourceId: 'nova-biblia-viva', apiId: 'por_onbv', description: 'Biblica® Open Nova Bíblia Viva, a contemporary Brazilian Portuguese rendering; CC BY-SA 4.0.' },
  { id: 'BPM', language: 'pt', shortName: 'BPM', name: 'Bíblia Portuguesa Mundial', year: '2022 (draft)', sourceId: 'biblia-portuguesa-mundial', apiId: 'por_bsl', description: 'Public-domain Portuguese translation based on the World English Bible; published as a draft still under revision.' },

  { id: 'RVR1909', language: 'es', shortName: 'RVR1909', name: 'Reina-Valera 1909', year: '1909', sourceId: 'reina-valera-1909', apiId: 'spa_r09', description: 'The classic Reina-Valera revision of 1909; public domain.' },
  { id: 'BLM', language: 'es', shortName: 'BLM', name: 'Santa Biblia libre para el mundo', year: '2022', sourceId: 'biblia-libre-para-el-mundo', apiId: 'spa_blm', description: 'Public-domain modern Spanish translation (Spain).' },
  { id: 'VBL', language: 'es', shortName: 'VBL', name: 'Versión Biblia Libre', year: '2018–2020', sourceId: 'version-biblia-libre', apiId: 'spa_vbl', description: 'Contemporary Spanish translation (Jonathan Gallagher, Shelly Barrios de Ávila); CC BY-SA 4.0.' },

  { id: 'LSG', language: 'fr', shortName: 'LSG', name: 'Louis Segond 1910', year: '1910', sourceId: 'louis-segond-1910', apiId: 'fra_lsg', description: 'The classic French Protestant translation; public domain.' },
  { id: 'DARBY', language: 'fr', shortName: 'Darby', name: 'Bible J.N. Darby', year: '1885', sourceId: 'darby-francais', apiId: 'fra_jnd', description: 'J. N. Darby’s literal French translation; public domain.' },
  { id: 'NCL', language: 'fr', shortName: 'NCL', name: 'Sainte Bible néo-Crampon Libre', year: '2022', sourceId: 'neo-crampon-libre', apiId: 'fra_ncl', description: 'Free modernisation of the Catholic Crampon Bible (1923) by the Fraternité de Tibériade; CC BY-SA 4.0.' },
  { id: 'OST', language: 'fr', shortName: 'Ostervald', name: 'Bible Ostervald', year: '1744/1877', sourceId: 'ostervald', apiId: 'fra_ost', description: 'The Ostervald revision of the Geneva tradition; public domain.' },
];

const BY_ID = new Map(BIBLE_VERSIONS.map((v) => [v.id, v]));

export function getBibleVersion(id: TranslationId): BibleVersion {
  const v = BY_ID.get(id);
  if (!v) throw new Error(`Unknown translation: ${id}`);
  return v;
}

export function versionsFor(locale: Locale): BibleVersion[] {
  return BIBLE_VERSIONS.filter((v) => v.language === locale);
}

export function isTranslationId(value: unknown): value is TranslationId {
  return typeof value === 'string' && BY_ID.has(value as TranslationId);
}
