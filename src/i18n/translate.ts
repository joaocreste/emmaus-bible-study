/**
 * Minimal, dependency-free message formatting (framework-free: UI, engine and server).
 *
 * Message syntax (a small ICU subset):
 *   "Hello {name}"                                   — interpolation
 *   "{count, plural, =0 {No verses} one {# verse} other {# verses}}"  — plurals (# = formatted count)
 *   "{tradition, select, catholic {…} other {…}}"    — select
 * Branches may nest. Unknown params render as "{name}" so gaps are visible in QA.
 */
import { LOCALES, type Locale } from './locales';

/** A namespace's English messages define its keys; every other locale must supply all of them. */
export type MessageCatalog = Record<string, string>;
export type Messages<T extends MessageCatalog> = { [K in keyof T]: string };
export interface NamespaceMessages<T extends MessageCatalog> {
  en: T;
  pt: Messages<T>;
  fr: Messages<T>;
  es: Messages<T>;
}

/** Declare a namespace. TypeScript rejects a locale that misses (or adds) a key. */
export function defineMessages<T extends MessageCatalog>(messages: NamespaceMessages<T>): NamespaceMessages<T> {
  return messages;
}

export type Params = Record<string, string | number | undefined | null>;

const pluralRules = new Map<string, Intl.PluralRules>();
const numberFormats = new Map<string, Intl.NumberFormat>();

function plural(locale: Locale, n: number): Intl.LDMLPluralRule {
  const tag = LOCALES[locale].bcp47;
  let rules = pluralRules.get(tag);
  if (!rules) pluralRules.set(tag, (rules = new Intl.PluralRules(tag)));
  return rules.select(n);
}

export function formatNumber(locale: Locale, n: number): string {
  const tag = LOCALES[locale].bcp47;
  let f = numberFormats.get(tag);
  if (!f) numberFormats.set(tag, (f = new Intl.NumberFormat(tag)));
  return f.format(n);
}

/** Format one message template. */
export function formatMessage(locale: Locale, template: string, params: Params = {}): string {
  let out = '';
  let i = 0;
  while (i < template.length) {
    const ch = template[i];
    if (ch !== '{') {
      out += ch;
      i++;
      continue;
    }
    const end = matchBrace(template, i);
    if (end < 0) {
      out += template.slice(i);
      break;
    }
    out += formatPlaceholder(locale, template.slice(i + 1, end), params);
    i = end + 1;
  }
  return out;
}

function matchBrace(s: string, open: number): number {
  let depth = 0;
  for (let j = open; j < s.length; j++) {
    if (s[j] === '{') depth++;
    else if (s[j] === '}' && --depth === 0) return j;
  }
  return -1;
}

function formatPlaceholder(locale: Locale, body: string, params: Params): string {
  const firstComma = body.indexOf(',');
  if (firstComma < 0) {
    const name = body.trim();
    const v = params[name];
    if (v == null) return `{${name}}`;
    return typeof v === 'number' ? formatNumber(locale, v) : String(v);
  }
  const name = body.slice(0, firstComma).trim();
  const rest = body.slice(firstComma + 1);
  const secondComma = rest.indexOf(',');
  const kind = rest.slice(0, secondComma).trim();
  const branches = parseBranches(rest.slice(secondComma + 1));
  const value = params[name];
  if (kind === 'plural') {
    const n = typeof value === 'number' ? value : Number(value ?? 0);
    const exact = branches.get(`=${n}`);
    const chosen = exact ?? branches.get(plural(locale, n)) ?? branches.get('other') ?? '';
    return formatMessage(locale, chosen.replace(/#/g, formatNumber(locale, n)), params);
  }
  if (kind === 'select') {
    const chosen = branches.get(String(value)) ?? branches.get('other') ?? '';
    return formatMessage(locale, chosen, params);
  }
  return `{${body}}`;
}

function parseBranches(s: string): Map<string, string> {
  const out = new Map<string, string>();
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++;
    const keyStart = i;
    while (i < s.length && s[i] !== '{' && !/\s/.test(s[i])) i++;
    const key = s.slice(keyStart, i);
    while (i < s.length && /\s/.test(s[i])) i++;
    if (s[i] !== '{') break;
    const end = matchBrace(s, i);
    if (end < 0) break;
    out.set(key, s.slice(i + 1, end));
    i = end + 1;
  }
  return out;
}
