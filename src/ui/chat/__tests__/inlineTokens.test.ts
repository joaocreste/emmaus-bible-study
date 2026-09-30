import { describe, expect, it } from 'vitest';
import { inlineToPlainText, parseInline } from '../inlineTokens';

describe('parseInline', () => {
  it('returns plain text untouched', () => {
    expect(parseInline('No condemnation.')).toEqual([{ type: 'text', text: 'No condemnation.' }]);
    expect(parseInline('')).toEqual([]);
  });

  it('parses every token kind', () => {
    const nodes = parseInline('See {{ref:ROM.8.1}} and {{word:katakrima}} in {{section:original-languages}} ({{source:calvin-romans}}).');
    expect(nodes.filter((n) => n.type === 'token')).toEqual([
      { type: 'token', kind: 'ref', value: 'ROM.8.1', raw: '{{ref:ROM.8.1}}' },
      { type: 'token', kind: 'word', value: 'katakrima', raw: '{{word:katakrima}}' },
      { type: 'token', kind: 'section', value: 'original-languages', raw: '{{section:original-languages}}' },
      { type: 'token', kind: 'source', value: 'calvin-romans', raw: '{{source:calvin-romans}}' },
    ]);
    expect(inlineToPlainText(nodes)).toBe('See ROM.8.1 and katakrima in original-languages (calvin-romans).');
  });

  it('accepts an optional label', () => {
    expect(parseInline('{{ref:ROM.8.28|verse 28}}')).toEqual([
      { type: 'token', kind: 'ref', value: 'ROM.8.28', label: 'verse 28', raw: '{{ref:ROM.8.28|verse 28}}' },
    ]);
  });

  it('parses bold and italic, including tokens inside emphasis', () => {
    expect(parseInline('**no condemnation** for *those* in {{ref:ROM.8.1}}')).toEqual([
      { type: 'strong', children: [{ type: 'text', text: 'no condemnation' }] },
      { type: 'text', text: ' for ' },
      { type: 'em', children: [{ type: 'text', text: 'those' }] },
      { type: 'text', text: ' in ' },
      { type: 'token', kind: 'ref', value: 'ROM.8.1', raw: '{{ref:ROM.8.1}}' },
    ]);
    expect(parseInline('**{{word:sarx}}**')).toEqual([
      { type: 'strong', children: [{ type: 'token', kind: 'word', value: 'sarx', raw: '{{word:sarx}}' }] },
    ]);
  });

  it('leaves stray asterisks and malformed tokens as text', () => {
    expect(inlineToPlainText(parseInline('2 * 3 * 4'))).toBe('2 * 3 * 4');
    expect(parseInline('{{ref:}} and {{bogus:x}}')).toEqual([{ type: 'text', text: '{{ref:}} and {{bogus:x}}' }]);
    expect(parseInline('**unclosed')).toEqual([{ type: 'text', text: '**unclosed' }]);
  });
});
