import { describe, expect, it } from 'vitest';
import { displayOriginal, langTag, normalizeStrong, plainDefinition, sameStrong } from '../language';

describe('original-language helpers', () => {
  it('normalises Strong’s numbers', () => {
    expect(normalizeStrong('G02631')).toBe('G2631');
    expect(normalizeStrong('H0430G')).toBe('H430');
    expect(normalizeStrong('g26')).toBe('G26');
    expect(sameStrong('H7462', 'H07462')).toBe(true);
  });

  it('maps languages to lang tags', () => {
    expect(langTag('greek')).toBe('grc');
    expect(langTag('hebrew')).toBe('hbo');
    expect(langTag('aramaic')).toBe('arc');
  });

  it('strips Hebrew cantillation but keeps vowel points', () => {
    // רֹעִ֔י with a zaqef qatan accent (U+0594)
    expect(displayOriginal('רֹעִ֔י', 'hebrew')).toBe('רֹעִי');
    expect(displayOriginal('λόγος', 'greek')).toBe('λόγος');
  });

  it('turns lexicon markup into plain paragraphs', () => {
    expect(plainDefinition('<b>condemnation</b><br>a verdict &amp; sentence')).toEqual(['condemnation', 'a verdict & sentence']);
  });
});
