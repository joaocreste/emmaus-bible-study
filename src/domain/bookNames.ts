/**
 * Book names and abbreviations in Portuguese (Brazil), Spanish and French.
 * English names live in books.ts. Framework-free.
 *
 * All 66 books for each locale: the conventional name printed by the language's default
 * version (pt BLIVRE "Gênesis", "1 Coríntios"; es RVR1909 "Génesis", "1 Corintios"; fr LSG
 * "Genèse", "1 Corinthiens"), the short form used in compact references (pt "Gn", "Rm", "1Co";
 * es "Gn", "Ro", "1 Co"; fr "Gn", "Rm", "1 Co"), and the forms a reader might type — the other
 * versions' names and abbreviation variants. Matching is case-insensitive; accents are optional
 * (an accent-exact match wins: pt "Jó" = Job, "Jo" = João); dots and spaces are ignored; ordinal
 * spellings ("Primeira", "1ª", "Primera de", "1re", "I") are normalised by normalizeBookToken.
 * Names typed in any of these languages resolve regardless of the interface language.
 */
import type { BookId } from './models';
import type { Locale } from '../i18n/locales';

export interface LocalizedBookName {
  /** full name, e.g. "Romanos", "Romains" */
  name: string;
  /** short form used in compact references, e.g. "Rm", "Ro" */
  abbrev: string;
  /** name for a single chapter of Psalms ("Salmo 23", "Psaume 23"); only for PSA */
  singular?: string;
  /** extra typed forms ("romanos", "rom", "rm"); matching is case- and accent-insensitive */
  aliases: string[];
}

export type NonEnglishLocale = Exclude<Locale, 'en'>;

type Row = [BookId, string, string, string[], string?];

function table(rows: Row[]): Partial<Record<BookId, LocalizedBookName>> {
  const out: Partial<Record<BookId, LocalizedBookName>> = {};
  for (const [id, name, abbrev, aliases, singular] of rows) out[id] = singular ? { name, abbrev, singular, aliases } : { name, abbrev, aliases };
  return out;
}

/*
 * Portuguese (Brazil). Names as printed by the Bíblia Livre (BLIVRE, the default version); the
 * Nova Bíblia Viva's and Bíblia Portuguesa Mundial's names are aliases. Abbreviations follow the
 * usual Brazilian style (Gn, Êx, 1Sm, Sl, Jo, At, Rm, 1Co, Ap). "Jó" (Job) and "Jo" (João) are told
 * apart by their accent: "jó" is only on JOB and "jo" only on JHN.
 */
// prettier-ignore
const PT: Row[] = [
  ['GEN', 'Gênesis', 'Gn', ['Gên', 'Gen', 'Ge']],
  ['EXO', 'Êxodo', 'Êx', ['Ex', 'Êxo', 'Exo', 'Exod']],
  ['LEV', 'Levítico', 'Lv', ['Lev', 'Levit']],
  ['NUM', 'Números', 'Nm', ['Núm', 'Num', 'Nu']],
  ['DEU', 'Deuteronômio', 'Dt', ['Deut', 'Deu', 'Deuteronómio']],
  ['JOS', 'Josué', 'Js', ['Jos', 'Josu']],
  ['JDG', 'Juízes', 'Jz', ['Juí', 'Jui', 'Juiz']],
  ['RUT', 'Rute', 'Rt', ['Rut', 'Ruth']],
  ['1SA', '1 Samuel', '1Sm', ['1 Sm', '1 Sam', '1Sa', '1 S']],
  ['2SA', '2 Samuel', '2Sm', ['2 Sm', '2 Sam', '2Sa', '2 S']],
  ['1KI', '1 Reis', '1Rs', ['1 Rs', '1Reis', '1 R']],
  ['2KI', '2 Reis', '2Rs', ['2 Rs', '2Reis', '2 R']],
  ['1CH', '1 Crônicas', '1Cr', ['1 Cr', '1 Crôn', '1 Cron', '1 Crónicas']],
  ['2CH', '2 Crônicas', '2Cr', ['2 Cr', '2 Crôn', '2 Cron', '2 Crónicas']],
  ['EZR', 'Esdras', 'Ed', ['Esd']],
  ['NEH', 'Neemias', 'Ne', ['Nee', 'Neem']],
  ['EST', 'Ester', 'Et', ['Est', 'Esther']],
  ['JOB', 'Jó', 'Jó', []],
  ['PSA', 'Salmos', 'Sl', ['Sal', 'Slm'], 'Salmo'],
  ['PRO', 'Provérbios', 'Pv', ['Prov', 'Pr']],
  ['ECC', 'Eclesiastes', 'Ec', ['Ecl', 'Ecle']],
  ['SNG', 'Cantares', 'Ct', ['Cântico dos Cânticos', 'Cânticos', 'Cântico', 'Cantares de Salomão', 'Canção de Salomão', 'Cânt', 'Cant']],
  ['ISA', 'Isaías', 'Is', ['Isa']],
  ['JER', 'Jeremias', 'Jr', ['Jer']],
  ['LAM', 'Lamentações', 'Lm', ['Lamentações de Jeremias', 'Lam']],
  ['EZK', 'Ezequiel', 'Ez', ['Eze', 'Ezeq']],
  ['DAN', 'Daniel', 'Dn', ['Dan']],
  ['HOS', 'Oseias', 'Os', ['Oséias', 'Ose']],
  ['JOL', 'Joel', 'Jl', []],
  ['AMO', 'Amós', 'Am', []],
  ['OBA', 'Obadias', 'Ob', ['Obd', 'Abdias']],
  ['JON', 'Jonas', 'Jn', ['Jon']],
  ['MIC', 'Miqueias', 'Mq', ['Miquéias', 'Miq']],
  ['NAM', 'Naum', 'Na', []],
  ['HAB', 'Habacuque', 'Hc', ['Hab']],
  ['ZEP', 'Sofonias', 'Sf', ['Sof']],
  ['HAG', 'Ageu', 'Ag', []],
  ['ZEC', 'Zacarias', 'Zc', ['Zac']],
  ['MAL', 'Malaquias', 'Ml', ['Mal']],
  ['MAT', 'Mateus', 'Mt', ['Mat']],
  ['MRK', 'Marcos', 'Mc', ['Mar', 'Mrc']],
  ['LUK', 'Lucas', 'Lc', ['Luc']],
  ['JHN', 'João', 'Jo', []],
  ['ACT', 'Atos', 'At', ['Atos dos Apóstolos']],
  ['ROM', 'Romanos', 'Rm', ['Rom']],
  ['1CO', '1 Coríntios', '1Co', ['1 Co', '1 Cor', '1Cor']],
  ['2CO', '2 Coríntios', '2Co', ['2 Co', '2 Cor', '2Cor']],
  ['GAL', 'Gálatas', 'Gl', ['Gál', 'Gal']],
  ['EPH', 'Efésios', 'Ef', ['Efé', 'Efes']],
  ['PHP', 'Filipenses', 'Fp', ['Fil', 'Filip']],
  ['COL', 'Colossenses', 'Cl', ['Col']],
  ['1TH', '1 Tessalonicenses', '1Ts', ['1 Ts', '1 Tess', '1 Tes']],
  ['2TH', '2 Tessalonicenses', '2Ts', ['2 Ts', '2 Tess', '2 Tes']],
  ['1TI', '1 Timóteo', '1Tm', ['1 Tm', '1 Tim']],
  ['2TI', '2 Timóteo', '2Tm', ['2 Tm', '2 Tim']],
  ['TIT', 'Tito', 'Tt', ['Tit']],
  ['PHM', 'Filemom', 'Fm', ['Filêmon', 'Filemon', 'Flm']],
  ['HEB', 'Hebreus', 'Hb', ['Heb']],
  ['JAS', 'Tiago', 'Tg', ['Tia']],
  ['1PE', '1 Pedro', '1Pe', ['1 Pe', '1 Ped']],
  ['2PE', '2 Pedro', '2Pe', ['2 Pe', '2 Ped']],
  ['1JN', '1 João', '1Jo', ['1 Jo']],
  ['2JN', '2 João', '2Jo', ['2 Jo']],
  ['3JN', '3 João', '3Jo', ['3 Jo']],
  ['JUD', 'Judas', 'Jd', ['Jud']],
  ['REV', 'Apocalipse', 'Ap', ['Apoc', 'Apocalipse de João']],
];

/*
 * Spanish. Names as printed by the Reina-Valera 1909 (RVR1909, the default version) — with the
 * Gospels by their conventional names ("Mateo", "Lucas"; the RVR1909's "San Mateo", "San Lucas"
 * are aliases) — plus the Biblia Libre para el Mundo's and Versión Biblia Libre's names.
 * Abbreviations follow the Sociedades Bíblicas style (Gn, Éx, 1 S, Sal, Jn = Juan, Jon = Jonás,
 * Hch, Ro, 1 Co, Stg, Ap).
 */
// prettier-ignore
const ES: Row[] = [
  ['GEN', 'Génesis', 'Gn', ['Gén', 'Gen', 'Ge']],
  ['EXO', 'Éxodo', 'Éx', ['Ex', 'Éxo', 'Exo', 'Exod']],
  ['LEV', 'Levítico', 'Lv', ['Lev']],
  ['NUM', 'Números', 'Nm', ['Núm', 'Num', 'Nu']],
  ['DEU', 'Deuteronomio', 'Dt', ['Deut', 'Deu']],
  ['JOS', 'Josué', 'Jos', []],
  ['JDG', 'Jueces', 'Jue', ['Juec']],
  ['RUT', 'Rut', 'Rt', ['Ruth']],
  ['1SA', '1 Samuel', '1 S', ['1 Sam', '1 Sm', '1Sa']],
  ['2SA', '2 Samuel', '2 S', ['2 Sam', '2 Sm', '2Sa']],
  ['1KI', '1 Reyes', '1 R', ['1 Re', '1 Rey', '1Reyes']],
  ['2KI', '2 Reyes', '2 R', ['2 Re', '2 Rey', '2Reyes']],
  ['1CH', '1 Crónicas', '1 Cr', ['1 Crón', '1 Cron']],
  ['2CH', '2 Crónicas', '2 Cr', ['2 Crón', '2 Cron']],
  ['EZR', 'Esdras', 'Esd', []],
  ['NEH', 'Nehemías', 'Neh', ['Ne']],
  ['EST', 'Ester', 'Est', []],
  ['JOB', 'Job', 'Job', ['Jb']],
  ['PSA', 'Salmos', 'Sal', ['Sl'], 'Salmo'],
  ['PRO', 'Proverbios', 'Pr', ['Prov']],
  ['ECC', 'Eclesiastés', 'Ec', ['Ecl', 'Ecles']],
  ['SNG', 'Cantar de los Cantares', 'Cnt', ['Cantares', 'Cantar', 'Cant']],
  ['ISA', 'Isaías', 'Is', ['Isa']],
  ['JER', 'Jeremías', 'Jer', ['Jr']],
  ['LAM', 'Lamentaciones', 'Lm', ['Lam']],
  ['EZK', 'Ezequiel', 'Ez', ['Eze', 'Ezeq']],
  ['DAN', 'Daniel', 'Dn', ['Dan']],
  ['HOS', 'Oseas', 'Os', ['Ose']],
  ['JOL', 'Joel', 'Jl', []],
  ['AMO', 'Amós', 'Am', []],
  ['OBA', 'Abdías', 'Abd', []],
  ['JON', 'Jonás', 'Jon', []],
  ['MIC', 'Miqueas', 'Miq', []],
  ['NAM', 'Nahum', 'Nah', ['Nahúm']],
  ['HAB', 'Habacuc', 'Hab', []],
  ['ZEP', 'Sofonías', 'Sof', []],
  ['HAG', 'Hageo', 'Hag', ['Ageo']],
  ['ZEC', 'Zacarías', 'Zac', []],
  ['MAL', 'Malaquías', 'Mal', []],
  ['MAT', 'Mateo', 'Mt', ['San Mateo', 'Mat']],
  ['MRK', 'Marcos', 'Mc', ['San Marcos', 'Mr', 'Mar']],
  ['LUK', 'Lucas', 'Lc', ['San Lucas', 'Luc']],
  ['JHN', 'Juan', 'Jn', ['San Juan']],
  ['ACT', 'Hechos', 'Hch', ['Hechos de los Apóstoles', 'Hech', 'Hec']],
  ['ROM', 'Romanos', 'Ro', ['Rom', 'Rm']],
  ['1CO', '1 Corintios', '1 Co', ['1 Cor', '1Co']],
  ['2CO', '2 Corintios', '2 Co', ['2 Cor', '2Co']],
  ['GAL', 'Gálatas', 'Gá', ['Gál', 'Gal', 'Ga']],
  ['EPH', 'Efesios', 'Ef', ['Efe', 'Efes']],
  ['PHP', 'Filipenses', 'Flp', ['Fil', 'Filip']],
  ['COL', 'Colosenses', 'Col', []],
  ['1TH', '1 Tesalonicenses', '1 Ts', ['1 Tes', '1 Tesal']],
  ['2TH', '2 Tesalonicenses', '2 Ts', ['2 Tes', '2 Tesal']],
  ['1TI', '1 Timoteo', '1 Ti', ['1 Tim', '1 Tm']],
  ['2TI', '2 Timoteo', '2 Ti', ['2 Tim', '2 Tm']],
  ['TIT', 'Tito', 'Tit', ['Tt']],
  ['PHM', 'Filemón', 'Flm', ['Filem']],
  ['HEB', 'Hebreos', 'Heb', ['He', 'Hebr']],
  ['JAS', 'Santiago', 'Stg', ['Sant', 'Stgo']],
  ['1PE', '1 Pedro', '1 P', ['1 Pe', '1 Ped']],
  ['2PE', '2 Pedro', '2 P', ['2 Pe', '2 Ped']],
  ['1JN', '1 Juan', '1 Jn', []],
  ['2JN', '2 Juan', '2 Jn', []],
  ['3JN', '3 Juan', '3 Jn', []],
  ['JUD', 'Judas', 'Jud', ['San Judas', 'Jds']],
  ['REV', 'Apocalipsis', 'Ap', ['Apoc', 'El Apocalipsis']],
];

/*
 * French. Names as printed by the Louis Segond 1910 (LSG, the default version); Darby's full
 * titles ("Épître aux Romains", "Le premier livre des Rois"), the néo-Crampon's ("Isaïe",
 * "Qohélet") and Ostervald's names are aliases. Abbreviations follow the usual French style
 * (Gn, Ex, Nb, 1 S, Ps, Es, Jn = Jean, Jon = Jonas, Ac, Rm, 1 Co, He, Jc, Ap).
 */
// prettier-ignore
const FR: Row[] = [
  ['GEN', 'Genèse', 'Gn', ['Gen', 'Ge', 'Le premier livre de Moïse dit la Genèse']],
  ['EXO', 'Exode', 'Ex', ['Exo', 'Exod', 'Le second livre de Moïse dit l’Exode']],
  ['LEV', 'Lévitique', 'Lv', ['Lév', 'Lev', 'Le troisième livre de Moïse dit le Lévitique']],
  ['NUM', 'Nombres', 'Nb', ['Nomb', 'Nom', 'Le quatrième livre de Moïse dit les Nombres']],
  ['DEU', 'Deutéronome', 'Dt', ['Deut', 'Deu', 'Le cinquième livre de Moïse dit le Deutéronome']],
  ['JOS', 'Josué', 'Jos', ['Le livre de Josué']],
  ['JDG', 'Juges', 'Jg', ['Jug', 'Le livre des Juges']],
  ['RUT', 'Ruth', 'Rt', ['Ru']],
  ['1SA', '1 Samuel', '1 S', ['1 Sam', '1 Sm', '1Sa', 'Le premier livre de Samuel']],
  ['2SA', '2 Samuel', '2 S', ['2 Sam', '2 Sm', '2Sa', 'Le second livre de Samuel']],
  ['1KI', '1 Rois', '1 R', ['1 Ro', 'Le premier livre des Rois']],
  ['2KI', '2 Rois', '2 R', ['2 Ro', 'Le second livre des Rois']],
  ['1CH', '1 Chroniques', '1 Ch', ['1 Chr', '1 Chron', 'Le premier livre des Chroniques']],
  ['2CH', '2 Chroniques', '2 Ch', ['2 Chr', '2 Chron', 'Le second livre des Chroniques']],
  ['EZR', 'Esdras', 'Esd', []],
  ['NEH', 'Néhémie', 'Né', ['Néh', 'Neh']],
  ['EST', 'Esther', 'Est', []],
  ['JOB', 'Job', 'Jb', ['Le livre de Job']],
  ['PSA', 'Psaumes', 'Ps', ['Psa', 'Les Psaumes'], 'Psaume'],
  ['PRO', 'Proverbes', 'Pr', ['Prov', 'Les Proverbes']],
  ['ECC', 'Ecclésiaste', 'Ec', ['Eccl', 'Ecc', 'Qohélet', 'Qo', 'L’Ecclésiaste']],
  ['SNG', 'Cantique des Cantiques', 'Ct', ['Cantique', 'Cant', 'Le Cantique des cantiques']],
  ['ISA', 'Ésaïe', 'Es', ['Esaïe', 'Isaïe', 'Esa', 'És', 'Is', 'Le livre du prophète Ésaïe']],
  ['JER', 'Jérémie', 'Jr', ['Jér', 'Jer', 'Le livre du prophète Jérémie']],
  ['LAM', 'Lamentations', 'Lm', ['Lam', 'Les lamentations de Jérémie']],
  ['EZK', 'Ézéchiel', 'Ez', ['Éz', 'Ézé', 'Ezé', 'Le livre du prophète Ézéchiel']],
  ['DAN', 'Daniel', 'Dn', ['Dan', 'Le livre du prophète Daniel']],
  ['HOS', 'Osée', 'Os', ['Le livre du prophète Osée']],
  ['JOL', 'Joël', 'Jl', ['Le livre du prophète Joël']],
  ['AMO', 'Amos', 'Am', ['Le livre du prophète Amos']],
  ['OBA', 'Abdias', 'Ab', ['Abd', 'Le livre du prophète Abdias']],
  ['JON', 'Jonas', 'Jon', ['Le livre du prophète Jonas']],
  ['MIC', 'Michée', 'Mi', ['Mic', 'Le livre du prophète Michée']],
  ['NAM', 'Nahum', 'Na', ['Nah', 'Le livre du prophète Nahum']],
  ['HAB', 'Habacuc', 'Ha', ['Hab', 'Habakuk', 'Habaquq', 'Le livre du prophète Habakuk']],
  ['ZEP', 'Sophonie', 'So', ['Soph', 'Le livre du prophète Sophonie']],
  ['HAG', 'Aggée', 'Ag', ['Agg', 'Le livre du prophète Aggée']],
  ['ZEC', 'Zacharie', 'Za', ['Zach', 'Le livre du prophète Zacharie']],
  ['MAL', 'Malachie', 'Ml', ['Mal', 'Le livre du prophète Malachie']],
  ['MAT', 'Matthieu', 'Mt', ['Matt', 'Évangile selon Matthieu']],
  ['MRK', 'Marc', 'Mc', ['Mr', 'Évangile selon Marc']],
  ['LUK', 'Luc', 'Lc', ['Lu', 'Évangile selon Luc']],
  ['JHN', 'Jean', 'Jn', ['Évangile selon Jean']],
  ['ACT', 'Actes', 'Ac', ['Act', 'Actes des Apôtres']],
  ['ROM', 'Romains', 'Rm', ['Rom', 'Ro', 'Épître aux Romains']],
  ['1CO', '1 Corinthiens', '1 Co', ['1 Cor', '1Co', '1 épître aux Corinthiens']],
  ['2CO', '2 Corinthiens', '2 Co', ['2 Cor', '2Co', '2 épître aux Corinthiens', 'Seconde épître aux Corinthiens']],
  ['GAL', 'Galates', 'Ga', ['Gal', 'Épître aux Galates']],
  ['EPH', 'Éphésiens', 'Ep', ['Éph', 'Eph', 'Épître aux Éphésiens']],
  ['PHP', 'Philippiens', 'Ph', ['Phil', 'Php', 'Épître aux Philippiens']],
  ['COL', 'Colossiens', 'Col', ['Épître aux Colossiens']],
  ['1TH', '1 Thessaloniciens', '1 Th', ['1 Thess', '1 Thes', '1 épître aux Thessaloniciens']],
  ['2TH', '2 Thessaloniciens', '2 Th', ['2 Thess', '2 Thes', '2 épître aux Thessaloniciens', 'Seconde épître aux Thessaloniciens']],
  ['1TI', '1 Timothée', '1 Tm', ['1 Tim', '1 Ti', '1 épître à Timothée']],
  ['2TI', '2 Timothée', '2 Tm', ['2 Tim', '2 Ti', '2 épître à Timothée', 'Seconde épître à Timothée']],
  ['TIT', 'Tite', 'Tt', ['Tit', 'Épître à Tite']],
  ['PHM', 'Philémon', 'Phm', ['Philém', 'Phlm', 'Épître à Philémon']],
  ['HEB', 'Hébreux', 'He', ['Héb', 'Heb', 'Hé', 'Épître aux Hébreux']],
  ['JAS', 'Jacques', 'Jc', ['Jacq', 'Ja', 'Épître de Jacques']],
  ['1PE', '1 Pierre', '1 P', ['1 Pi', '1 Pie', '1 épître de Pierre']],
  ['2PE', '2 Pierre', '2 P', ['2 Pi', '2 Pie', '2 épître de Pierre', 'Seconde épître de Pierre']],
  ['1JN', '1 Jean', '1 Jn', ['1 épître de Jean']],
  ['2JN', '2 Jean', '2 Jn', ['2 épître de Jean', 'Deuxième épître de Jean']],
  ['3JN', '3 Jean', '3 Jn', ['3 épître de Jean', 'Troisième épître de Jean']],
  ['JUD', 'Jude', 'Jude', ['Jud', 'Épître de Jude']],
  ['REV', 'Apocalypse', 'Ap', ['Apoc']],
];

export const BOOK_NAMES: Record<NonEnglishLocale, Partial<Record<BookId, LocalizedBookName>>> = {
  pt: table(PT),
  es: table(ES),
  fr: table(FR),
};

export function localizedBookName(book: BookId, locale: NonEnglishLocale): LocalizedBookName | undefined {
  return BOOK_NAMES[locale][book];
}
