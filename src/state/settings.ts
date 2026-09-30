/**
 * Reader settings: defaults, validation, persistence (localStorage) and
 * application to the document (theme + reading scale).
 *
 * Pure helpers (`sanitizeSettings`, `resolveTheme`) are unit-tested; the DOM
 * and storage helpers never throw (private windows, blocked storage, SSR).
 */
import type { TranslationId } from '../domain/models';
import { getBibleVersion, isTranslationId } from '../domain/translations';
import { DEFAULT_LOCALE, isLocale, LOCALES, matchLocale, type Locale } from '../i18n/locales';
import type { ReaderSettings, ThemePreference } from './types';

export const SETTINGS_STORAGE_KEY = 'emmaus.settings.v1';

/** Text-size steps offered by the reader settings popover (multipliers of the base reading size). */
export const FONT_SCALE_STEPS = [0.9, 1, 1.12, 1.25, 1.4] as const;

export const DEFAULT_SETTINGS: ReaderSettings = {
  locale: DEFAULT_LOCALE,
  fontScale: 1,
  theme: 'system',
  translation: 'BSB',
  showVerseNumbers: true,
  scriptureMode: 'reader',
  liveComposition: true,
};

const THEMES: ThemePreference[] = ['system', 'parchment', 'evening'];

/** First-visit defaults follow the browser's language (e.g. pt-BR → Português + Bíblia Livre). */
export function initialSettings(languages: readonly string[] | undefined): ReaderSettings {
  const locale = matchLocale(languages);
  return { ...DEFAULT_SETTINGS, locale, translation: LOCALES[locale].defaultTranslation };
}

/** Settings after the reader picks a language: keep the version if it is in that language, else use its default. */
export function withLocale(settings: ReaderSettings, locale: Locale): ReaderSettings {
  const version = getBibleVersion(settings.translation);
  return { ...settings, locale, translation: version.language === locale ? settings.translation : LOCALES[locale].defaultTranslation };
}

/** Coerce anything (e.g. parsed JSON from storage) into valid settings, falling back to defaults per field. */
export function sanitizeSettings(raw: unknown, base: ReaderSettings = DEFAULT_SETTINGS): ReaderSettings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const scale = typeof r.fontScale === 'number' && Number.isFinite(r.fontScale) ? r.fontScale : base.fontScale;
  return {
    locale: isLocale(r.locale) ? r.locale : base.locale,
    fontScale: Math.min(1.4, Math.max(0.9, Math.round(scale * 100) / 100)),
    theme: THEMES.includes(r.theme as ThemePreference) ? (r.theme as ThemePreference) : base.theme,
    translation: isTranslationId(r.translation) ? (r.translation as TranslationId) : base.translation,
    showVerseNumbers: typeof r.showVerseNumbers === 'boolean' ? r.showVerseNumbers : base.showVerseNumbers,
    scriptureMode: r.scriptureMode === 'reader' || r.scriptureMode === 'interlinear' ? r.scriptureMode : base.scriptureMode,
    liveComposition: typeof r.liveComposition === 'boolean' ? r.liveComposition : base.liveComposition,
  };
}

/** The concrete theme to paint: `system` follows the OS preference. */
export function resolveTheme(pref: ThemePreference, prefersDark: boolean): 'parchment' | 'evening' {
  if (pref === 'system') return prefersDark ? 'evening' : 'parchment';
  return pref;
}

export function loadSettings(): ReaderSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    const first = initialSettings(typeof navigator !== 'undefined' ? navigator.languages : undefined);
    return raw ? sanitizeSettings(JSON.parse(raw), first) : first;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** The settings last saved in this page (kept in memory too, so they apply even when storage is blocked). */
let lastSaved: ReaderSettings | null = null;

/** The reader's current settings, for code outside React (e.g. the engine's "Live composition" check). */
export function currentSettings(): ReaderSettings {
  return lastSaved ?? loadSettings();
}

export function saveSettings(settings: ReaderSettings): void {
  lastSaved = settings;
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable (private mode, quota) — settings simply last for this visit */
  }
}

export function prefersDarkScheme(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

/** Paint theme, reading scale and language onto <html>. Safe to call before React mounts (avoids a theme flash). */
export function applyReaderSettings(settings: ReaderSettings, prefersDark = prefersDarkScheme()): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  // <html lang> follows the interface language (screen readers, hyphenation, spell-check).
  const lang = LOCALES[settings.locale]?.bcp47 ?? LOCALES[DEFAULT_LOCALE].bcp47;
  if (root.lang !== lang) root.lang = lang;
  const theme = resolveTheme(settings.theme, prefersDark);
  root.dataset.theme = theme;
  root.style.setProperty('--reader-scale', String(settings.fontScale));
  // Keep the browser chrome (mobile address bar) in step with the painted theme.
  const bg = getComputedStyle(root).getPropertyValue('--color-bg').trim();
  if (bg) {
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
      m.content = bg;
    });
  }
}
