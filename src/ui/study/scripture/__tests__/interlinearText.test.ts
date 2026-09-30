import { describe, expect, it } from 'vitest';
import { displayTransliteration, glossParts } from '../interlinearText';

const text = (gloss: string) =>
  glossParts(gloss)
    .map((p) => (p.kind === 'join' ? '/' : p.kind === 'implied' ? `<${p.text}>` : p.text))
    .join('');

describe('glossParts', () => {
  it('reads the dataset markup without losing a word', () => {
    expect(glossParts('<the>')).toEqual([{ kind: 'implied', text: 'the' }]);
    expect(glossParts('rest<s>')).toEqual([
      { kind: 'text', text: 'rest' },
      { kind: 'implied', text: 's' },
    ]);
    expect(glossParts('[is] shepherd/ my')).toEqual([
      { kind: 'added', text: '[is]' },
      { kind: 'text', text: ' shepherd' },
      { kind: 'join' },
      { kind: 'text', text: 'my' },
    ]);
    expect(glossParts('in/ pastures of')).toEqual([{ kind: 'text', text: 'in' }, { kind: 'join' }, { kind: 'text', text: 'pastures of' }]);
    expect(glossParts('for [the] sake of')).toEqual([
      { kind: 'text', text: 'for ' },
      { kind: 'added', text: '[the]' },
      { kind: 'text', text: ' sake of' },
    ]);
    expect(glossParts('Word,')).toEqual([{ kind: 'text', text: 'Word,' }]);
  });

  it('round-trips every word', () => {
    for (const g of ['he makes lie down/ me', 'In [the]', 'of/ David', 'the', '<the> God']) {
      expect(text(g).replace(/\s+/g, ' ').replace(/\/ ?/g, '/ ')).toBe(g.replace(/\/ ?/g, '/ '));
    }
  });
});

describe('displayTransliteration', () => {
  it('drops syllable dots and capitals, marking an unambiguous stress', () => {
    expect(displayTransliteration('ye.na.ha.Le.ni', 'hebrew')).toEqual({ before: 'yenaha', stressed: 'le', after: 'ni' });
    expect(displayTransliteration("'ech.Sar", 'hebrew')).toEqual({ before: "'ech", stressed: 'sar', after: '' });
    expect(displayTransliteration("'E.lo.Him", 'hebrew')).toEqual({ before: "'elo", stressed: 'him', after: '' });
  });

  it('does not guess when only the first syllable is capitalised', () => {
    expect(displayTransliteration('Yah.weh', 'hebrew')).toEqual({ before: 'yahweh', after: '' });
    expect(displayTransliteration("De.she'", 'hebrew')).toEqual({ before: "deshe'", after: '' });
    expect(displayTransliteration('gam', 'hebrew')).toEqual({ before: 'gam', after: '' });
  });

  it('leaves Greek transliteration as the dataset gives it', () => {
    expect(displayTransliteration('Christō', 'greek')).toEqual({ before: 'Christō', after: '' });
  });
});
