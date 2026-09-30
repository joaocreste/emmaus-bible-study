import { describe, expect, it } from 'vitest';
import { findReferences, formatRef, parseRefKey, parseReference, refKey, refIncludesVerse, findBookMention } from '../reference';

describe('parseReference', () => {
  const cases: [string, string | null][] = [
    ['John 1:1', 'JHN.1.1'],
    ['Romans 8', 'ROM.8'],
    ['Matthew 5–7', 'MAT.5-7'],
    ['Genesis', 'GEN'],
    ['Psalm 23', 'PSA.23'],
    ['Ps 23:1-6', 'PSA.23.1-6'],
    ['1 Cor 13:4-7', '1CO.13.4-7'],
    ['First John 4', '1JN.4'],
    ['II Samuel 7', '2SA.7'],
    ['Rom 8.28', 'ROM.8.28'],
    ['John 1:1–2:11', 'JHN.1.1-2.11'],
    ['Song of Songs 2', 'SNG.2'],
    ['song of solomon 2:4', 'SNG.2.4'],
    ['study Romans 8', 'ROM.8'],
    ['Jude 3', 'JUD.1.3'],
    ['Jude', 'JUD'],
    ['Revelation 21', 'REV.21'],
    ['Romans 17', null],
    ['grace', null],
    ['What does the Bible say about wealth?', null],
  ];
  for (const [input, key] of cases) {
    it(input, () => {
      const r = parseReference(input);
      expect(r ? refKey(r) : null).toBe(key);
    });
  }
});

describe('formatRef / keys', () => {
  it('round-trips keys', () => {
    for (const k of ['ROM.8', 'ROM.8.1-4', 'ROM.8.28', 'MAT.5-7', 'JHN.1.1-2.11', 'GEN']) {
      expect(refKey(parseRefKey(k)!)).toBe(k);
    }
  });
  it('formats', () => {
    expect(formatRef(parseRefKey('ROM.8.1-4')!)).toBe('Romans 8:1–4');
    expect(formatRef(parseRefKey('PSA.23')!)).toBe('Psalm 23');
    expect(formatRef(parseRefKey('MAT.5-7')!)).toBe('Matthew 5–7');
    expect(formatRef(parseRefKey('GEN')!)).toBe('Genesis');
    expect(formatRef(parseRefKey('1CO.13.4-7')!, 'short')).toBe('1 Cor 13:4–7');
  });
  it('includes verses', () => {
    expect(refIncludesVerse(parseRefKey('ROM.8')!, { book: 'ROM', chapter: 8, verse: 39 })).toBe(true);
    expect(refIncludesVerse(parseRefKey('ROM.8.1-4')!, { book: 'ROM', chapter: 8, verse: 5 })).toBe(false);
    expect(refIncludesVerse(parseRefKey('ROM.8.28')!, { book: 'ROM', chapter: 8, verse: 28 })).toBe(true);
  });
});

describe('findReferences', () => {
  it('finds refs in prose without false positives', () => {
    expect(findReferences('How does this connect with Romans 5:1?').map((f) => refKey(f.ref))).toEqual(['ROM.5.1']);
    expect(findReferences('what is 3 plus am 2').length).toBe(0);
    expect(findReferences('compare Eph 2:8-9 and 1 John 4').map((f) => refKey(f.ref))).toEqual(['EPH.2.8-9', '1JN.4']);
  });
  it('finds book mentions', () => {
    expect(findBookMention('How does this connect with Romans?')?.book).toBe('ROM');
  });
});
