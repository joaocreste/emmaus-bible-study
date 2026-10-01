import { formatRef, parseReference } from '../../domain/reference';
import type { Locale } from '../../i18n/locales';

/** "Malachi 2:13–16" and "Mal 2:13-16" compare equal: case, dots, spaces and dash kinds ignored. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[.\s]/g, '').replace(/[‐‑‒–—―-]/g, '-');
}

/** The reference when the text is nothing but an English Bible reference ("Malachi 2:13–16", "Mal 2:16"). */
function pureReference(text: string): { long: boolean; ref: NonNullable<ReturnType<typeof parseReference>> } | null {
  const ref = parseReference(text, { locale: 'en' });
  if (!ref) return null;
  const t = norm(text);
  if (t === norm(formatRef(ref, 'long', 'en'))) return { long: true, ref };
  if (t === norm(formatRef(ref, 'short', 'en'))) return { long: false, ref };
  return null;
}

/**
 * A citation's locator in the reader's language when it is a Bible reference: sources and the
 * knowledge base write them in English ("Malachi 2:13–16", "on Mal 2:16"); anything else
 * ("ch. 24 §5", "Session 24, can. 5", "s.v. Divorce") is shown as the source gives it.
 */
export function localizeLocator(locator: string, locale: Locale, on: (ref: string) => string): string {
  if (locale === 'en') return locator;
  const text = locator.trim();
  const whole = pureReference(text);
  if (whole) return formatRef(whole.ref, whole.long ? 'long' : 'short', locale);
  const m = /^on (.+)$/.exec(text);
  const after = m ? pureReference(m[1]) : null;
  if (after) return on(formatRef(after.ref, after.long ? 'long' : 'short', locale));
  return locator;
}
