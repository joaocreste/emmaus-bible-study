import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PassageRef, VerseRef } from '../domain/models';
import { formatRef, formatVerse } from '../domain/reference';
import { translator, type MessageKey, type Namespace } from './catalog';
import { LOCALES, type Locale, type LocaleInfo } from './locales';
import { formatNumber, type Params } from './translate';

export interface I18nValue {
  locale: Locale;
  info: LocaleInfo;
  /** localized Scripture reference ("Romanos 8:1–4", "Romains 8.1–4") */
  ref(passage: PassageRef, style?: 'long' | 'short'): string;
  verse(v: VerseRef, style?: 'long' | 'short'): string;
  number(n: number): string;
  list(items: string[], type?: 'conjunction' | 'disjunction'): string;
  date(value: number | Date, options?: Intl.DateTimeFormatOptions): string;
}

const Ctx = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<I18nValue>(() => {
    const info = LOCALES[locale];
    return {
      locale,
      info,
      ref: (p, style = 'long') => formatRef(p, style, locale),
      verse: (v, style = 'long') => formatVerse(v, style, locale),
      number: (n) => formatNumber(locale, n),
      list: (items, type = 'conjunction') => new Intl.ListFormat(info.bcp47, { style: 'long', type }).format(items),
      date: (value, options) => new Intl.DateTimeFormat(info.bcp47, options ?? { dateStyle: 'medium' }).format(value),
    };
  }, [locale]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Locale + formatting helpers. Outside a provider (tests, server render) falls back to English. */
export function useI18n(): I18nValue {
  return useContext(Ctx) ?? FALLBACK;
}

/** Typed translator for one namespace: `const t = useT('welcome'); t('headline')`. */
export function useT<N extends Namespace>(ns: N): (key: MessageKey<N>, params?: Params) => string {
  const { locale } = useI18n();
  return useMemo(() => translator(locale, ns), [locale, ns]);
}

const FALLBACK: I18nValue = {
  locale: 'en',
  info: LOCALES.en,
  ref: (p, style = 'long') => formatRef(p, style, 'en'),
  verse: (v, style = 'long') => formatVerse(v, style, 'en'),
  number: (n) => formatNumber('en', n),
  list: (items) => new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(items),
  date: (value, options) => new Intl.DateTimeFormat('en', options ?? { dateStyle: 'medium' }).format(value),
};
