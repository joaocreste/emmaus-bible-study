import { Fragment, type ReactNode } from 'react';

/**
 * Put elements into a translated sentence at its `{name}` placeholders, so the word order stays the
 * translator's: `withElements(t('palette.hint'), { ref: <em>Jean 3.16</em>, … })`. Translate the
 * sentence without those params (the translator leaves `{name}` in place), then call this.
 * A placeholder with no element stays visible as `{name}` (easy to spot in QA).
 */
export function withElements(text: string, elements: Record<string, ReactNode>): ReactNode {
  return text.split(/\{(\w+)\}/).map((part, i) => (i % 2 ? <Fragment key={i}>{elements[part] ?? `{${part}}`}</Fragment> : part));
}
