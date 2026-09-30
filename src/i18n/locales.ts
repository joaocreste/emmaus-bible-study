/**
 * Supported interface & study languages. Framework-free (shared by UI, engine and server).
 */
import type { TranslationId } from '../domain/models';

export type Locale = 'en' | 'pt' | 'fr' | 'es';

export interface LocaleInfo {
  id: Locale;
  /** name of the language in itself — what the language menu shows */
  endonym: string;
  /** English name */
  englishName: string;
  /** BCP 47 tag used for Intl formatting and the <html lang> attribute */
  bcp47: string;
  /** Bible version selected when the reader switches to this language */
  defaultTranslation: TranslationId;
  /** chapter–verse separator used in this language's references ("Jean 3.16" in French) */
  verseSeparator: ':' | '.';
}

export const LOCALES: Record<Locale, LocaleInfo> = {
  en: { id: 'en', endonym: 'English', englishName: 'English', bcp47: 'en', defaultTranslation: 'BSB', verseSeparator: ':' },
  pt: { id: 'pt', endonym: 'Português', englishName: 'Portuguese (Brazil)', bcp47: 'pt-BR', defaultTranslation: 'BLIVRE', verseSeparator: ':' },
  fr: { id: 'fr', endonym: 'Français', englishName: 'French', bcp47: 'fr', defaultTranslation: 'LSG', verseSeparator: '.' },
  es: { id: 'es', endonym: 'Español', englishName: 'Spanish', bcp47: 'es', defaultTranslation: 'RVR1909', verseSeparator: ':' },
};

export const LOCALE_ORDER: Locale[] = ['en', 'pt', 'es', 'fr'];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'pt' || value === 'fr' || value === 'es';
}

/** Best supported locale for a list of BCP 47 preferences (e.g. navigator.languages). */
export function matchLocale(preferences: readonly string[] | undefined): Locale {
  for (const pref of preferences ?? []) {
    const base = pref.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}
