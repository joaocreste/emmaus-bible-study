/**
 * The reader's-language text for the server's codes (catalog namespace 'inference'). English keeps
 * the server's own wording, which carries details the codes do not (the failed file, the model id).
 */
import { translate } from '../i18n/catalog';
import type { Locale } from '../i18n/locales';
import type { InferenceErrorCode, InferenceStatus } from './protocol';

/** Why live composition is unavailable, in the reader's language (undefined when it is available). */
export function statusReasonText(status: InferenceStatus, locale: Locale): string | undefined {
  if (status.available) return undefined;
  if (locale !== 'en' && status.reasonCode) return translate(locale, 'inference', `status.${status.reasonCode}`);
  return status.reason;
}

/** A failed run's message, in the reader's language. */
export function errorText(error: { code: InferenceErrorCode; message: string }, locale: Locale): string {
  return locale === 'en' ? error.message : translate(locale, 'inference', `error.${error.code}`);
}
