/**
 * All message namespaces. Each namespace file (src/i18n/messages/<ns>.ts) is owned by one
 * area of the app; TypeScript guarantees every locale defines every key.
 */
import { DEFAULT_LOCALE, type Locale } from './locales';
import { formatMessage, type Params } from './translate';
import { messages as chat } from './messages/chat';
import { messages as commentary } from './messages/commentary';
import { messages as common } from './messages/common';
import { messages as context } from './messages/context';
import { messages as crossrefs } from './messages/crossrefs';
import { messages as engine } from './messages/engine';
import { messages as inference } from './messages/inference';
import { messages as inspector } from './messages/inspector';
import { messages as literary } from './messages/literary';
import { messages as provenance } from './messages/provenance';
import { messages as scripture } from './messages/scripture';
import { messages as shell } from './messages/shell';
import { messages as sources } from './messages/sources';
import { messages as study } from './messages/study';
import { messages as theology } from './messages/theology';
import { messages as topic } from './messages/topic';
import { messages as welcome } from './messages/welcome';
import { messages as words } from './messages/words';

export const CATALOG = {
  common,
  shell,
  welcome,
  chat,
  study,
  scripture,
  crossrefs,
  words,
  inspector,
  context,
  literary,
  theology,
  commentary,
  sources,
  topic,
  provenance,
  engine,
  inference,
} as const;

export type Namespace = keyof typeof CATALOG;
export type MessageKey<N extends Namespace> = keyof (typeof CATALOG)[N]['en'] & string;

/** Translate one key (falls back to English, then to the key itself). */
export function translate<N extends Namespace>(locale: Locale, ns: N, key: MessageKey<N>, params?: Params): string {
  const table = CATALOG[ns] as unknown as Record<Locale, Record<string, string>>;
  const template = table[locale]?.[key] ?? table[DEFAULT_LOCALE]?.[key] ?? key;
  return formatMessage(locale, template, params);
}

/** A translator bound to one locale and namespace — `const t = translator('pt', 'engine'); t('reply.noSource', {...})`. */
export function translator<N extends Namespace>(locale: Locale, ns: N): (key: MessageKey<N>, params?: Params) => string {
  return (key, params) => translate(locale, ns, key, params);
}
