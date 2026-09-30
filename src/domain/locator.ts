/**
 * Citation locators ("note on Rom 8:1", "Homily 15, on Rom 8:28", "sermon, 9 Sept 2001") as
 * readers of Portuguese, Spanish and French see them. The citation data stays in English;
 * only its display is translated: the recurring locator words, Bible book abbreviations
 * (Rom → Rm / Ro / Rm), the French chapter–verse dot (8:28 → 8.28) and English dates.
 * Quoted titles (“…”) and unrecognised words are left exactly as they are — nothing is invented.
 */
import type { Locale } from '../i18n/locales';
import { BOOK_NAMES, type NonEnglishLocale } from './bookNames';
import { BOOKS, type BookInfo } from './books';

type Phrase = readonly [RegExp, Record<NonEnglishLocale, string>];

const MONTHS: Record<NonEnglishLocale, readonly string[]> = {
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
};
const MONTH_RE = '(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sept?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\.?';
const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function monthName(token: string, locale: NonEnglishLocale): string {
  return MONTHS[locale][MONTH_KEYS.indexOf(token.slice(0, 3).toLowerCase())];
}

function dayMonthYear(day: number | undefined, month: string, year: string, locale: NonEnglishLocale): string {
  if (locale === 'fr') return [day == null ? '' : day === 1 ? '1er' : String(day), month, year].filter(Boolean).join(' ');
  return day == null ? `${month} de ${year}` : `${day} de ${month} de ${year}`;
}

/** English dates in free text ("9 Sept 2001", "August 12, 1880", "June 1998", "1997-04-13") in the reader's language. */
export function localizeDates(text: string, locale: Locale): string {
  if (locale === 'en') return text;
  return text
    .replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, (m, y: string, mo: string, d: string) => {
      const month = MONTHS[locale][Number(mo) - 1];
      return month ? dayMonthYear(Number(d), month, y, locale) : m;
    })
    .replace(new RegExp(`\\b(\\d{1,2}) ${MONTH_RE} (\\d{4})\\b`, 'g'), (_m, d: string, mo: string, y: string) => dayMonthYear(Number(d), monthName(mo, locale), y, locale))
    .replace(new RegExp(`\\b${MONTH_RE} (\\d{1,2}), (\\d{4})\\b`, 'g'), (_m, mo: string, d: string, y: string) => dayMonthYear(Number(d), monthName(mo, locale), y, locale))
    .replace(new RegExp(`\\b${MONTH_RE} (\\d{4})\\b`, 'g'), (_m, mo: string, y: string) => dayMonthYear(undefined, monthName(mo, locale), y, locale));
}

/** Recurring locator words, most specific first. Replacements keep the matched capitalisation. */
const PHRASES: readonly Phrase[] = [
  [/\bBrenton’s English translation\b/g, { pt: 'tradução inglesa de Brenton', es: 'traducción inglesa de Brenton', fr: 'traduction anglaise de Brenton' }],
  [/\beditor’s note\b/gi, { pt: 'nota do editor', es: 'nota del editor', fr: 'note de l’éditeur' }],
  [/\bas quoted in\b/gi, { pt: 'citado em', es: 'citado en', fr: 'cité dans' }],
  [/\bas summari[sz]ed by\b/gi, { pt: 'conforme resumido por', es: 'según el resumen de', fr: 'résumé par' }],
  [/\bas reviewed by\b/gi, { pt: 'conforme resenha de', es: 'según la reseña de', fr: 'selon la recension de' }],
  [/\bas described in\b/gi, { pt: 'conforme descrito em', es: 'según se describe en', fr: 'tel que décrit dans' }],
  [/\bsermon overview\b/gi, { pt: 'visão geral do sermão', es: 'panorama del sermón', fr: 'aperçu du sermon' }],
  [/\bsermon transcript\b/gi, { pt: 'transcrição do sermão', es: 'transcripción del sermón', fr: 'transcription du sermon' }],
  [/\bepisode description\b/gi, { pt: 'descrição do episódio', es: 'descripción del episodio', fr: 'description de l’épisode' }],
  [/\bfront matter\b/gi, { pt: 'páginas iniciais', es: 'páginas preliminares', fr: 'pages liminaires' }],
  [/\bintroduction to the sermon\b/gi, { pt: 'introdução ao sermão', es: 'introducción al sermón', fr: 'introduction du sermon' }],
  [/\bfootnote on\b/gi, { pt: 'nota de rodapé sobre', es: 'nota al pie sobre', fr: 'note de bas de page sur' }],
  [/\bon chapter(?= \d)/gi, { pt: 'sobre o capítulo', es: 'sobre el capítulo', fr: 'sur le chapitre' }],
  [/\bnotes on\b/gi, { pt: 'notas sobre', es: 'notas sobre', fr: 'notes sur' }],
  [/\bnote on\b/gi, { pt: 'nota sobre', es: 'nota sobre', fr: 'note sur' }],
  [/\bsermon on\b/gi, { pt: 'sermão sobre', es: 'sermón sobre', fr: 'sermon sur' }],
  // "on Rom 8:28", "on 8:34", "on pp. 73–74", "on chapter 8" — never "on" inside a title
  [/\bon (?=\d|pp?\.|chapter\b|ch\.|(?:[1-3] )?[A-Z][a-z]+\.? \d)/g, { pt: 'sobre ', es: 'sobre ', fr: 'sur ' }],
  [/\bExposition on\b/gi, { pt: 'Exposição sobre', es: 'Exposición sobre', fr: 'Exposition sur' }],
  [/\bExposition\b/gi, { pt: 'Exposição', es: 'Exposición', fr: 'Exposition' }],
  [/\bsermons\b/gi, { pt: 'sermões', es: 'sermones', fr: 'sermons' }],
  [/\bsermon\b/gi, { pt: 'sermão', es: 'sermón', fr: 'sermon' }],
  [/\bseries\b/gi, { pt: 'série', es: 'serie', fr: 'série' }],
  [/\bHomilies\b/gi, { pt: 'Homilias', es: 'Homilías', fr: 'Homélies' }],
  [/\bHomily\b/gi, { pt: 'Homilia', es: 'Homilía', fr: 'Homélie' }],
  [/\b(?:Catechetical )?Lecture\b/gi, { pt: 'Catequese', es: 'Catequesis', fr: 'Catéchèse' }],
  [/\bMystagogic Catechesis\b/gi, { pt: 'Catequese mistagógica', es: 'Catequesis mistagógica', fr: 'Catéchèse mystagogique' }],
  [/\bMystagogic\b/gi, { pt: 'Mistagógica', es: 'Mistagógica', fr: 'Mystagogique' }],
  [/\bBook(?= (?:\d|[IVXL]+\b))/g, { pt: 'Livro', es: 'Libro', fr: 'Livre' }],
  [/\bintroduction\b/gi, { pt: 'introdução', es: 'introducción', fr: 'introduction' }],
  [/\bcites(?= )/g, { pt: 'cita', es: 'cita', fr: 'cite' }],
  [/\bchapters(?= \d)/gi, { pt: 'capítulos', es: 'capítulos', fr: 'chapitres' }],
  [/\bchapter(?= \d)/gi, { pt: 'capítulo', es: 'capítulo', fr: 'chapitre' }],
  [/\bchs\.(?= )/gi, { pt: 'caps.', es: 'caps.', fr: 'chap.' }],
  [/\bch\.(?= )/gi, { pt: 'cap.', es: 'cap.', fr: 'chap.' }],
  [/\btrans\.(?= )/gi, { pt: 'trad.', es: 'trad.', fr: 'trad.' }],
  [/\bpp\.(?= )/g, { pt: 'pp.', es: 'pp.', fr: 'p.' }],
  [/\bstanza\b/gi, { pt: 'estrofe', es: 'estrofa', fr: 'strophe' }],
  [/\bHymn\b/gi, { pt: 'Hino', es: 'Himno', fr: 'Hymne' }],
  [/\btheses\b/gi, { pt: 'teses', es: 'tesis', fr: 'thèses' }],
  [/\bthesis\b/gi, { pt: 'tese', es: 'tesis', fr: 'thèse' }],
  [/\barguments\b/gi, { pt: 'argumentos', es: 'argumentos', fr: 'arguments' }],
  [/\bPropositions\b/gi, { pt: 'Proposições', es: 'Proposiciones', fr: 'Propositions' }],
  [/\bSession\b/gi, { pt: 'Sessão', es: 'Sesión', fr: 'Session' }],
  [/\bcanons\b/gi, { pt: 'cânones', es: 'cánones', fr: 'canons' }],
  [/\bcanon(?= \d)/gi, { pt: 'cânon', es: 'canon', fr: 'canon' }],
  [/\bDecree\b/gi, { pt: 'Decreto', es: 'Decreto', fr: 'Décret' }],
  [/\bTractate\b/gi, { pt: 'Tratado', es: 'Tratado', fr: 'Traité' }],
  [/\bDiscourse\b/gi, { pt: 'Discurso', es: 'Discurso', fr: 'Discours' }],
  [/\bEpilogue\b/gi, { pt: 'Epílogo', es: 'Epílogo', fr: 'Épilogue' }],
  [/\bconclusion\b/gi, { pt: 'conclusão', es: 'conclusión', fr: 'conclusion' }],
  [/\(Greek\)/g, { pt: '(grego)', es: '(griego)', fr: '(grec)' }],
  [/\bQ\.(?= \d)/g, { pt: 'P.', es: 'P.', fr: 'Q.' }],
  [/\bv(?=\d)/g, { pt: 'v. ', es: 'v. ', fr: 'v. ' }],
];

function matchCase(source: string, replacement: string): string {
  const first = source.charAt(0);
  if (first && first === first.toUpperCase() && first !== first.toLowerCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  if (first && first === first.toLowerCase() && first !== first.toUpperCase()) return replacement.charAt(0).toLowerCase() + replacement.slice(1);
  return replacement;
}

let englishBooks: Map<string, { book: BookInfo; long: boolean }> | undefined;

/** English book names and abbreviations as the curated data writes them ("Rom", "2 Cor", "Psalm", "John"). */
function englishBook(token: string): { book: BookInfo; long: boolean } | undefined {
  if (!englishBooks) {
    englishBooks = new Map();
    for (const b of BOOKS) {
      englishBooks.set(b.abbrev, { book: b, long: b.abbrev === b.name });
      if (!englishBooks.has(b.name)) englishBooks.set(b.name, { book: b, long: true });
    }
    const psalms = BOOKS.find((b) => b.id === 'PSA');
    if (psalms) englishBooks.set('Psalm', { book: psalms, long: true });
  }
  return englishBooks.get(token);
}

function bookName(hit: { book: BookInfo; long: boolean }, token: string, locale: NonEnglishLocale): string {
  const names = BOOK_NAMES[locale][hit.book.id];
  if (!names) return token;
  if (token === 'Psalm') return names.singular ?? names.name;
  return hit.long ? names.name : names.abbrev;
}

const BOOK_TOKEN = '((?:[1-3] )?[A-Z][a-z]+)';
const BOOK_WORKS: Record<'commentary' | 'preface' | 'intro' | 'bookIntro' | 'introTo' | 'on', Record<NonEnglishLocale, string>> = {
  introTo: { pt: 'Introdução a {the}{book}', es: 'Introducción a {the}{book}', fr: '{book}, introduction' },
  on: { pt: 'sobre {the}{book}', es: 'sobre {the}{book}', fr: 'sur {the}{book}' },
  commentary: { pt: 'Comentário sobre {the}{book}', es: 'Comentario sobre {the}{book}', fr: 'Commentaire sur {the}{book}' },
  preface: { pt: 'Prefácio a {book}', es: 'Prefacio a {book}', fr: 'Préface à {book}' },
  intro: { pt: '{book}, introdução', es: '{book}, introducción', fr: '{book}, introduction' },
  bookIntro: { pt: '{book}, introdução ao livro', es: '{book}, introducción al libro', fr: '{book}, introduction au livre' },
};
const PLURAL_THE: Record<NonEnglishLocale, string> = { pt: 'os ', es: 'los ', fr: 'les ' };

function localizeBookWorks(text: string, locale: NonEnglishLocale): string {
  const work = (key: keyof typeof BOOK_WORKS, token: string, the: boolean, m: string) => {
    const hit = englishBook(token);
    if (!hit) return m;
    const names = BOOK_NAMES[locale][hit.book.id];
    return BOOK_WORKS[key][locale].replace('{the}', the ? PLURAL_THE[locale] : '').replace('{book}', names?.name ?? token);
  };
  return text
    .replace(new RegExp(`\\bCommentary on (the )?${BOOK_TOKEN}\\b(?! [A-Z])`, 'g'), (m, the: string | undefined, token: string) => work('commentary', token, Boolean(the), m))
    .replace(new RegExp(`\\bPreface to (?:the )?${BOOK_TOKEN}\\b`, 'g'), (m, token: string) => work('preface', token, false, m))
    .replace(new RegExp(`(?<![\\p{L}\\d] ?)${BOOK_TOKEN},? Book Introduction\\b`, 'gu'), (m, token: string) => work('bookIntro', token, false, m))
    .replace(new RegExp(`(?<![\\p{L}\\d] ?)${BOOK_TOKEN},? [Ii]ntroduction\\b`, 'gu'), (m, token: string) => work('intro', token, false, m))
    .replace(new RegExp(`\\bIntroduction to (the )?${BOOK_TOKEN}\\b`, 'g'), (m, the: string | undefined, token: string) => work('introTo', token, Boolean(the), m))
    // "Homilies on 2 Corinthians" — a whole book, never "on Rom 8:28"
    .replace(new RegExp(`\\bon (the )?${BOOK_TOKEN}\\b(?!\\.? \\d)`, 'g'), (m, the: string | undefined, token: string) =>
      englishBook(token)?.long ? work('on', token, Boolean(the), m) : m,
    );
}

function localizeBookTokens(text: string, locale: NonEnglishLocale): string {
  return text.replace(new RegExp(`(?<![\\p{L}\\d])${BOOK_TOKEN}(?=\\.? \\d)`, 'gu'), (m, token: string) => {
      const hit = englishBook(token);
      return hit ? bookName(hit, token, locale) : m;
    });
}

/** Translate the unquoted parts of `text`; “quoted titles” and *emphasised titles* stay as they are. */
function outsideQuotes(text: string, fn: (part: string) => string): string {
  return text
    .split(/(“[^”]*”|\*[^*]+\*)/)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join('');
}

/**
 * A citation locator in the reader's language: "note on Rom 8:1" → "nota sobre Rm 8:1" (pt),
 * "Homily 15, on Rom 8:28" → "Homélie 15, sur Rm 8.28" (fr), "sermon, 9 Sept 2001" →
 * "sermão, 9 de setembro de 2001" (pt). English comes back unchanged.
 */
export function localizeLocator(locator: string, locale: Locale): string;
export function localizeLocator(locator: string | undefined, locale: Locale): string | undefined;
export function localizeLocator(locator: string | undefined, locale: Locale): string | undefined {
  if (!locator || locale === 'en') return locator;
  return outsideQuotes(locator, (part) => {
    let out = localizeBookWorks(localizeDates(part, locale), locale);
    for (const [re, to] of PHRASES) out = out.replace(re, (m) => (re.flags.includes('i') ? matchCase(m, to[locale]) : to[locale]));
    out = localizeBookTokens(out, locale);
    if (locale === 'fr') out = out.replace(/(\d):(\d)/g, '$1.$2');
    return out;
  });
}
