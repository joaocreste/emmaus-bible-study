import { formatRef, parseReference } from '../../domain/reference';
import type { MessageKey } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';
import type { Params } from '../../i18n/translate';

type Translate = (key: MessageKey<'sources'>, params?: Params) => string;

/** "Malachi 2:13–16" and "Mal 2:13-16" compare equal: case, dots, spaces and dash kinds ignored. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[.\s]/g, '').replace(/[‐‑‒–—―-]/g, '-');
}

/** The reference when the text is nothing but an English Bible reference ("Malachi 2:13–16", "Mal 2:16", "Eph. 2:8"). */
function pureReference(text: string): { long: boolean; ref: NonNullable<ReturnType<typeof parseReference>> } | null {
  const ref = parseReference(text, { locale: 'en' });
  if (!ref) return null;
  const t = norm(text);
  if (t === norm(formatRef(ref, 'long', 'en'))) return { long: true, ref };
  if (t === norm(formatRef(ref, 'short', 'en'))) return { long: false, ref };
  return null;
}

function localRef(text: string, locale: Locale): string | null {
  const r = pureReference(text);
  return r ? formatRef(r.ref, r.long ? 'long' : 'short', locale) : null;
}

/**
 * The structural words of a source's locator, in the reader's language: chapter, question,
 * part, session, canon, head, sermon, decree and preface markers, and Bible references
 * ("Sermon 1 (on Eph. 2:8)"). The source's own titles ("Canons on the Sacrament of
 * Matrimony") are its words and stay as it gives them.
 */
const STRUCTURE: [RegExp, (t: Translate, m: RegExpExecArray, locale: Locale) => string][] = [
  [/\bch\. (\d+)/g, (t, m) => t('locator.chapter', { n: m[1] })],
  [/^Q\. (\d+)/g, (t, m) => t('locator.question', { n: m[1] })],
  [/\bpart (\d+) of (\d+)/g, (t, m) => t('locator.partOf', { n: m[1], total: m[2] })],
  [/^Session (\d+)/g, (t, m) => t('locator.session', { n: m[1] })],
  [/\bcan\. (\d+)/g, (t, m) => t('locator.canon', { n: m[1] })],
  [/^Head ([IVX]+(?:[–-][IVX]+)?)/g, (t, m) => t('locator.head', { n: m[1] })],
  [/^Part ([IVX]+)\b/g, (t, m) => t('locator.part', { n: m[1] })],
  [/^Sermon (\d+)/g, (t, m) => t('locator.sermon', { n: m[1] })],
  [/^Decree ([IVX]+)\b/g, (t, m) => t('locator.decree', { n: m[1] })],
  [/^Preface\b/g, (t) => t('locator.preface')],
  [/\(on ([^()]+)\)/g, (t, m, locale) => {
    const ref = localRef(m[1], locale);
    return ref ? `(${t('chip.onRef', { ref })})` : m[0];
  }],
];

/**
 * A citation's locator in the reader's language. Bible references ("Malachi 2:13–16",
 * "on Mal 2:16") are translated whole; other locators get their structural words translated
 * ("ch. 24 §5" → "cap. 24 §5"). English readers see the locator as the source gives it.
 */
export function localizeLocator(locator: string, locale: Locale, t: Translate): string {
  if (locale === 'en') return locator;
  const text = locator.trim();
  const whole = localRef(text, locale);
  if (whole) return whole;
  const m = /^on (.+)$/.exec(text);
  const after = m ? localRef(m[1], locale) : null;
  if (after) return t('chip.onRef', { ref: after });
  let out = text;
  for (const [re, render] of STRUCTURE) out = out.replace(re, (...args) => render(t, args as unknown as RegExpExecArray, locale));
  return out;
}

/** A lexicon entry's Strong's number ("G5563"). */
const STRONG = /^[GH]\d{1,5}[A-Za-z]?$/;

/**
 * What a lexicon citation shows instead of its Strong's number: the word itself and its
 * transliteration, taken from the citation note ("χωρίζω (chōrizō, G5563) — “to separate”"
 * → "χωρίζω (chōrizō)"); nothing when the note does not give them. Other locators are returned as given.
 */
export function readerLocator(locator: string | undefined, note: string | undefined): string | undefined {
  if (!locator || !STRONG.test(locator.trim())) return locator;
  const m = note ? /^(\S+) \(([^,()]+), [GH]\d{1,5}[A-Za-z]?\)/.exec(note.trim()) : null;
  return m ? `${m[1]} (${m[2]})` : undefined;
}

/** A locator piece that names a place, not a title: numbers, structural markers, Bible references, volume/year. */
const STRUCTURAL_PIECE =
  /^(?:ch\. \d+(?: §\d+)?|§\d+|Q\. \d+|Art\. \d+|can\. \d+|Session \d+|Head [IVX]+(?:[–-][IVX]+)?|Part [IVX]+|Sermon \d+|Decree [IVX]+|Preface|part \d+ of \d+|vol\. \d+(?: \(\d{4}\))?|pp?\. \d+(?:[–-]\d+)?)$/;

/**
 * The short locator a source chip shows to a reader of another language: the places named in it
 * (chapter, question, session, canon, part…) and its Bible references, in the reader's language;
 * the source's own English titles and headwords ("Canons on the Sacrament of Matrimony",
 * "s.v. Atonement, Day of") are left out — the chip already names the source, and the inspector
 * shows the full locator beside the cited text. Undefined when nothing but titles remains.
 */
export function chipLocator(locator: string, locale: Locale, t: Translate): string | undefined {
  if (locale === 'en') return locator;
  const text = locator.trim();
  if (localRef(text, locale)) return localizeLocator(text, locale, t);
  const on = /^on (.+)$/.exec(text);
  if (on && localRef(on[1], locale)) return localizeLocator(text, locale, t);
  // pieces: the comma-separated parts, each with its parenthetical groups split off
  const kept: string[] = [];
  for (const part of splitTop(text, ',')) {
    const head = part.replace(/\s*\([^()]*\)/g, '').trim().replace(/^(Part [IVX]+):.*$/, '$1');
    const groups = [...part.matchAll(/\(([^()]*)\)/g)].map((m) => m[1].trim());
    const place = piece(head, locale, t);
    if (!place) continue;
    const extras = groups.map((g) => piece(g, locale, t)).filter((g): g is string => Boolean(g)).map((g) => `(${g})`);
    kept.push([place, ...extras].join(' '));
  }
  return kept.length ? kept.join(', ') : undefined;
}

/** One locator piece in the reader's language, or undefined when it is a title or headword. */
function piece(text: string, locale: Locale, t: Translate): string | undefined {
  const ref = localRef(text, locale);
  if (ref) return ref;
  const on = /^on (.+)$/.exec(text);
  const onRef = on ? localRef(on[1], locale) : null;
  if (onRef) return t('chip.onRef', { ref: onRef });
  const same = /^= (.+)$/.exec(text);
  const sameRef = same ? localRef(same[1], locale) : null;
  if (sameRef) return `= ${sameRef}`;
  return STRUCTURAL_PIECE.test(text) ? localizeLocator(text, locale, t) : undefined;
}

/** Split on a separator outside parentheses. */
function splitTop(text: string, sep: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of text) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === sep && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}
