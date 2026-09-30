import { Fragment, type ReactNode } from 'react';

/**
 * Render a translated sentence in which some words are marked with tags —
 * "Summary of <cite>{work}</cite>", "<strong>3</strong> works behind this study" — mapping
 * each tag to an element, so word order stays the translator's (no concatenated fragments).
 * Tags do not nest; an unknown tag renders its words as plain text.
 */
export function rich(text: string, tags: Record<string, (chunk: string) => ReactNode>): ReactNode {
  const re = /<(\w+)>([\s\S]*?)<\/\1>/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>);
    const render = tags[m[1]];
    out.push(<Fragment key={key++}>{render ? render(m[2]) : m[2]}</Fragment>);
    last = m.index + m[0].length;
  }
  if (last === 0) return text;
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return out;
}
