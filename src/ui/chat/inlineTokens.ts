/**
 * Parser for the inline markup allowed in assistant chat text (see
 * `MessageBlock` in src/domain/models.ts):
 *
 *   {{ref:ROM.8.1-4}}  {{word:<keyWordId>}}  {{section:<SectionId>}}  {{source:<sourceId>}}
 *   **bold**  *italic*
 *
 * Tokens may appear inside emphasis. An optional `|label` suffix is tolerated
 * on tokens (`{{ref:ROM.8.28|verse 28}}`). Anything malformed stays plain text.
 */

export type InlineTokenKind = 'ref' | 'word' | 'section' | 'source';

export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'em'; children: InlineNode[] }
  | { type: 'token'; kind: InlineTokenKind; value: string; label?: string; raw: string };

const INLINE_RE = /\{\{(ref|word|section|source):([^}|]+)(?:\|([^}]*))?\}\}|\*\*(?=\S)([\s\S]+?)\*\*|\*(?=[^\s*])([^*]+?)\*/g;

/** Parse chat text into a small inline tree. Never throws. */
export function parseInline(input: string): InlineNode[] {
  const out: InlineNode[] = [];
  let last = 0;
  // matchAll iterates a clone of the regex, so recursing into emphasis is safe.
  for (const m of input.matchAll(INLINE_RE)) {
    const index = m.index ?? 0;
    const [raw, kind, value, label, bold, italic] = m;
    if (italic != null && /\s$/.test(italic)) continue; // "a * b *" is not emphasis
    if (index > last) pushText(out, input.slice(last, index));
    if (kind) {
      out.push({
        type: 'token',
        kind: kind as InlineTokenKind,
        value: value.trim(),
        ...(label?.trim() ? { label: label.trim() } : {}),
        raw,
      });
    } else if (bold != null) {
      out.push({ type: 'strong', children: parseInline(bold) });
    } else if (italic != null) {
      out.push({ type: 'em', children: parseInline(italic) });
    }
    last = index + raw.length;
  }
  if (last < input.length) pushText(out, input.slice(last));
  return out;
}

/** Plain-text rendering (e.g. for aria labels or previews): tokens become their label or value. */
export function inlineToPlainText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'text') return n.text;
      if (n.type === 'token') return n.label ?? n.value;
      return inlineToPlainText(n.children);
    })
    .join('');
}

function pushText(out: InlineNode[], text: string) {
  if (!text) return;
  const prev = out[out.length - 1];
  if (prev?.type === 'text') prev.text += text;
  else out.push({ type: 'text', text });
}
