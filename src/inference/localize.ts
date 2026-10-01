/**
 * The reader's text for the server's codes (catalog namespace 'inference'), in every language. The
 * server's own wording carries setup and model details meant for the developer (it is in the server
 * log and the status response), never for the reader.
 */
import { translate } from '../i18n/catalog';
import type { Locale } from '../i18n/locales';
import type { InferenceErrorCode, InferenceStatus } from './protocol';

/** Why live composition is unavailable, in the reader's language (undefined when it is available). */
export function statusReasonText(status: InferenceStatus, locale: Locale): string | undefined {
  if (status.available) return undefined;
  return translate(locale, 'inference', status.reasonCode ? `status.${status.reasonCode}` : 'status.unavailable');
}

/** A failed run's message, in the reader's language. */
export function errorText(error: { code: InferenceErrorCode; message: string }, locale: Locale): string {
  return translate(locale, 'inference', `error.${error.code}`);
}
