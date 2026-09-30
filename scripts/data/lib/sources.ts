/**
 * Source catalogue for the data pipeline: every dataset URL, license and the
 * list of books whose classic commentaries are bundled.
 */
import type { TranslationId } from '../../../src/domain/models.ts';
import { BOOKS } from '../../../src/domain/books.ts';
import { BIBLE_VERSIONS } from '../../../src/domain/translations.ts';
import type { Locale } from '../../../src/i18n/locales.ts';
import { fetchJson, log, warn } from './net.ts';

export const HELLOAO = 'https://bible.helloao.org/api';
export const STEP_RAW = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master';
export const STEP_API = 'https://api.github.com/repos/STEPBible/STEPBible-Data/contents';
export const TYNDALE_ZIP = 'https://tyndaleopenresources.com/wp-content/themes/tyndale-openresources/files/tyndale_open-studynotes.zip';

/**
 * License and attribution of every bundled Bible version, as stated on the version's
 * eBible.org details page (linked from the Free Use Bible API `licenseUrl`), checked 2026-09.
 */
const VERSION_LICENSES: Record<TranslationId, { license: string; attribution?: string }> = {
  BSB: { license: 'Public domain (BSB dedicated 2023)' },
  KJV: { license: 'Public domain (outside the UK)' },
  WEB: { license: 'Public domain' },
  BLIVRE: {
    license: 'CC BY 4.0 (Creative Commons Atribuição 4.0 Brasil)',
    attribution: 'Bíblia Livre (BLIVRE), Copyright © 2018 Diego Santos, Mario Sérgio e Marco Teles — Licença Creative Commons Atribuição 4.0 Brasil',
  },
  NBV: {
    license: 'CC BY-SA 4.0',
    attribution: 'Biblica® Open Nova Bíblia Viva, Copyright © 2007, 2010 Biblica, Inc. The original work is available for free at www.biblica.com and open.bible.',
  },
  BPM: { license: 'Public domain' },
  RVR1909: { license: 'Public domain' },
  BLM: { license: 'Public domain' },
  VBL: { license: 'CC BY-SA 4.0', attribution: 'Versión Biblia Libre, Copyright © 2018–2020 Jonathan Gallagher y Shelly Barrios de Ávila' },
  LSG: { license: 'Public domain' },
  DARBY: { license: 'Public domain' },
  NCL: { license: 'CC BY-SA 4.0', attribution: 'Sainte Bible néo-Crampon Libre, Copyright © 2022 Fraternité de Tibériade' },
  OST: { license: 'Public domain' },
};

export interface TranslationSource {
  id: TranslationId;
  /** output directory under public/data/bible/ (the id, lowercased) */
  dir: string;
  /** Free Use Bible API translation id */
  apiId: string;
  sourceId: string;
  language: Locale;
  license: string;
  attribution?: string;
}

/** Every version of src/domain/translations.ts, English first (KJV must precede the others: it is their versification reference). */
export const TRANSLATIONS: TranslationSource[] = BIBLE_VERSIONS.map((v) => ({
  id: v.id,
  dir: v.id.toLowerCase(),
  apiId: v.apiId,
  sourceId: v.sourceId,
  language: v.language,
  ...VERSION_LICENSES[v.id],
}));

/** Books whose public-domain classic commentaries are bundled whole (curated studies live here). */
export const BUNDLED_COMMENTARY_BOOKS = ['GEN', 'JOB', 'PSA', 'ISA', 'MAT', 'LUK', 'JHN', 'ROM', '2CO', 'EPH', 'TIT', '1PE'];

/** Classic commentaries: local id (= output dir), Free Use Bible API id, SourceRegistry id. */
export const CLASSIC_COMMENTARIES = [
  { id: 'calvin', apiId: 'john-calvin', sourceId: 'calvin-commentaries', name: 'Calvin’s Commentaries', otOnly: false },
  { id: 'matthew-henry', apiId: 'matthew-henry', sourceId: 'matthew-henry-commentary', name: 'Matthew Henry’s Commentary on the Whole Bible', otOnly: false },
  { id: 'jfb', apiId: 'jamieson-fausset-brown', sourceId: 'jfb-commentary', name: 'Jamieson-Fausset-Brown Commentary', otOnly: false },
  { id: 'keil-delitzsch', apiId: 'keil-delitzsch', sourceId: 'keil-delitzsch-commentary', name: 'Keil & Delitzsch Commentary on the Old Testament', otOnly: true },
] as const;

export const BOOK_IDS = BOOKS.map((b) => b.id);
export const BOOK_BY_ID = new Map(BOOKS.map((b) => [b.id, b]));
export { BOOKS };

/** STEPBible three-letter book codes (as used in TAGNT/TAHOT references) → USFM ids. */
export const STEP_BOOK: Record<string, string> = {
  Gen: 'GEN', Exo: 'EXO', Lev: 'LEV', Num: 'NUM', Deu: 'DEU', Jos: 'JOS', Jdg: 'JDG', Rut: 'RUT', '1Sa': '1SA', '2Sa': '2SA',
  '1Ki': '1KI', '2Ki': '2KI', '1Ch': '1CH', '2Ch': '2CH', Ezr: 'EZR', Neh: 'NEH', Est: 'EST', Job: 'JOB', Psa: 'PSA', Pro: 'PRO',
  Ecc: 'ECC', Sng: 'SNG', Isa: 'ISA', Jer: 'JER', Lam: 'LAM', Ezk: 'EZK', Dan: 'DAN', Hos: 'HOS', Jol: 'JOL', Amo: 'AMO',
  Oba: 'OBA', Jon: 'JON', Mic: 'MIC', Nam: 'NAM', Hab: 'HAB', Zep: 'ZEP', Hag: 'HAG', Zec: 'ZEC', Mal: 'MAL',
  Mat: 'MAT', Mrk: 'MRK', Luk: 'LUK', Jhn: 'JHN', Act: 'ACT', Rom: 'ROM', '1Co': '1CO', '2Co': '2CO', Gal: 'GAL', Eph: 'EPH',
  Php: 'PHP', Col: 'COL', '1Th': '1TH', '2Th': '2TH', '1Ti': '1TI', '2Ti': '2TI', Tit: 'TIT', Phm: 'PHM', Heb: 'HEB', Jas: 'JAS',
  '1Pe': '1PE', '2Pe': '2PE', '1Jn': '1JN', '2Jn': '2JN', '3Jn': '3JN', Jud: 'JUD', Rev: 'REV',
};

/** Tyndale Open Study Notes XML book codes → USFM ids. */
export const TYNDALE_BOOK: Record<string, string> = {
  Gen: 'GEN', Exod: 'EXO', Lev: 'LEV', Num: 'NUM', Deut: 'DEU', Josh: 'JOS', Judg: 'JDG', Ruth: 'RUT', '1Sam': '1SA', '2Sam': '2SA',
  '1Kgs': '1KI', '2Kgs': '2KI', '1Chr': '1CH', '2Chr': '2CH', Ezra: 'EZR', Neh: 'NEH', Esth: 'EST', Job: 'JOB', Ps: 'PSA', Pr: 'PRO',
  Eccl: 'ECC', Song: 'SNG', Isa: 'ISA', Jer: 'JER', Lam: 'LAM', Ezek: 'EZK', Dan: 'DAN', Hos: 'HOS', Joel: 'JOL', Amos: 'AMO',
  Obad: 'OBA', Jon: 'JON', Mic: 'MIC', Nah: 'NAM', Hab: 'HAB', Zeph: 'ZEP', Hagg: 'HAG', Zech: 'ZEC', Mal: 'MAL',
  Matt: 'MAT', Mark: 'MRK', Luke: 'LUK', John: 'JHN', Acts: 'ACT', Rom: 'ROM', '1Cor': '1CO', '2Cor': '2CO', Gal: 'GAL', Eph: 'EPH',
  Phil: 'PHP', Col: 'COL', '1Thes': '1TH', '2Thes': '2TH', '1Tim': '1TI', '2Tim': '2TI', Titus: 'TIT', Phlm: 'PHM', Heb: 'HEB',
  Jas: 'JAS', '1Pet': '1PE', '2Pet': '2PE', '1Jn': '1JN', '2Jn': '2JN', '3Jn': '3JN', Jude: 'JUD', Rev: 'REV',
};

export interface GithubFile {
  name: string;
  sha: string;
  size: number;
  download_url: string | null;
}

/** Fallback file names (used when the GitHub contents API is unavailable / rate-limited). */
const STEP_FALLBACK: Record<string, string[]> = {
  'Translators Amalgamated OT+NT': [
    'TAGNT Mat-Jhn - Translators Amalgamated Greek NT - STEPBible.org CC-BY.txt',
    'TAGNT Act-Rev - Translators Amalgamated Greek NT - STEPBible.org CC-BY.txt',
    'TAHOT Gen-Deu - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt',
    'TAHOT Jos-Est - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt',
    'TAHOT Job-Sng - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt',
    'TAHOT Isa-Mal - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt',
  ],
  Lexicons: [
    'TBESG - Translators Brief lexicon of Extended Strongs for Greek - STEPBible.org CC BY.txt',
    'TBESH - Translators Brief lexicon of Extended Strongs for Hebrew - STEPBible.org CC BY.txt',
  ],
};

/** List a STEPBible-Data directory through the GitHub contents API (cached), falling back to known names. */
export async function listStepDir(dir: string): Promise<GithubFile[]> {
  try {
    const files = await fetchJson<GithubFile[]>(`${STEP_API}/${encodeURIComponent(dir)}`, { accept: 'application/vnd.github+json' });
    if (files && Array.isArray(files)) return files;
  } catch (err) {
    warn('sources', `GitHub contents API failed for ${dir} (${(err as Error).message}); using known file names`);
  }
  log('sources', `using fallback file names for ${dir}`);
  return (STEP_FALLBACK[dir] ?? []).map((name) => ({ name, sha: '', size: 0, download_url: null }));
}

export function stepRawUrl(dir: string, name: string): string {
  return `${STEP_RAW}/${encodeURIComponent(dir)}/${encodeURIComponent(name)}`;
}
