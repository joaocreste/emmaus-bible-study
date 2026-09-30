import { describe, expect, it } from 'vitest';
import type { KeyWord, Verse } from '../../../../domain/models';
import { synthesis } from '../../../../domain/provenance';
import { buildBlocks, isPsalmSuperscription, poetryLayout, versePoetryLayout, verseText } from '../blocks';
import { anchoredPhrases, findPhraseRanges, phrasePattern, segmentText, segmentVerseText, splitLeadingWord } from '../keyWords';

const v = (verse: number) => ({ book: 'ROM', chapter: 8, verse });

function keyWord(id: string, phrases: KeyWord['anchors'][number]['phrases'], verse = 1): KeyWord {
  return {
    id,
    strong: 'G0000',
    language: 'greek',
    lemma: 'x',
    transliteration: 'x',
    english: id,
    anchors: [{ verse: v(verse), phrases }],
    basicMeaning: '',
    semanticRange: [],
    notableOccurrences: [],
    significance: { text: '', provenance: synthesis() },
    provenance: synthesis(),
  };
}

describe('anchoredPhrases', () => {
  it('returns phrases for the verse and translation only', () => {
    const kws = [keyWord('a', { BSB: 'condemnation', KJV: 'condemnation' }), keyWord('b', { BSB: 'Spirit' }, 2)];
    expect(anchoredPhrases(kws, v(1), 'BSB')).toEqual([{ id: 'a', phrase: 'condemnation' }]);
    expect(anchoredPhrases(kws, v(2), 'KJV')).toEqual([]);
  });
});

describe('phrasePattern', () => {
  it('matches case-insensitively on word boundaries', () => {
    expect(phrasePattern('law').test('the Law of the Spirit')).toBe(true);
    expect(phrasePattern('law', 'iu').test('lawless deeds')).toBe(false);
    expect(phrasePattern('law', 'iu').test('outlaw')).toBe(false);
  });

  it('treats straight and curly apostrophes alike and allows flexible spaces', () => {
    expect(phrasePattern("God's", 'iu').test('the Spirit of God’s Son')).toBe(true);
    expect(phrasePattern('in  Christ', 'iu').test('those who are in\nChrist Jesus')).toBe(true);
  });

  it('escapes regex metacharacters', () => {
    expect(phrasePattern('Abba (Father)', 'iu').test('we cry, “Abba (Father)!”')).toBe(true);
  });
});

describe('findPhraseRanges / segmentText', () => {
  const text = 'Therefore, there is now no condemnation for those who are in Christ Jesus.';

  it('segments the text around matches', () => {
    const segs = segmentVerseText(text, [{ id: 'k', phrase: 'condemnation' }]);
    expect(segs.map((s) => s.text).join('')).toBe(text);
    expect(segs.find((s) => s.keyWordId)).toEqual({ text: 'condemnation', keyWordId: 'k' });
  });

  it('prefers longer phrases and avoids overlaps', () => {
    const ranges = findPhraseRanges(text, [
      { id: 'christ', phrase: 'Christ' },
      { id: 'in-christ', phrase: 'in Christ Jesus' },
    ]);
    expect(ranges).toHaveLength(1);
    expect(text.slice(ranges[0].start, ranges[0].end)).toBe('in Christ Jesus');
  });

  it('falls through to a later occurrence when the first overlaps', () => {
    const t = 'the law of the Spirit and the law of sin';
    const ranges = findPhraseRanges(t, [
      { id: 'spirit-law', phrase: 'law of the Spirit' },
      { id: 'law', phrase: 'law' },
    ]);
    expect(ranges.map((r) => [r.id, t.slice(r.start, r.end), r.start])).toEqual([
      ['spirit-law', 'law of the Spirit', 4],
      ['law', 'law', 30],
    ]);
  });

  it('uses each key word once across lines via the shared taken set', () => {
    const taken = new Set<string>();
    const first = findPhraseRanges('The LORD is my shepherd', [{ id: 'shepherd', phrase: 'shepherd' }], taken);
    const second = findPhraseRanges('my shepherd again', [{ id: 'shepherd', phrase: 'shepherd' }], taken);
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(0);
  });

  it('returns the text untouched when nothing matches', () => {
    expect(segmentText('abc', [])).toEqual([{ text: 'abc' }]);
    expect(segmentVerseText('abc', [{ id: 'x', phrase: 'zzz' }])).toEqual([{ text: 'abc' }]);
  });
});

describe('buildBlocks', () => {
  const verse = (n: number, extra: Partial<Verse> = {}): Verse => ({ ref: { book: 'PSA', chapter: 23, verse: n }, text: `v${n}`, ...extra });

  it('groups prose into paragraphs and poetry into stanzas', () => {
    const blocks = buildBlocks(
      [
        verse(1, { heading: 'The LORD Is My Shepherd', paragraphStart: true }),
        verse(2),
        verse(3, { paragraphStart: true }),
        verse(4, { poetryLines: ['a', 'b'] }),
        verse(5, { poetryLines: ['c'] }),
        verse(6, { poetryLines: ['d'], paragraphStart: true }),
      ],
      'ROM',
    );
    expect(blocks.map((b) => b.type)).toEqual(['heading', 'prose', 'prose', 'poetry', 'poetry']);
    expect(blocks[1].type === 'prose' && blocks[1].verses.length).toBe(2);
    expect(blocks[3].type === 'poetry' && blocks[3].verses.length).toBe(2);
  });

  it('lays out poetry lines, honouring encoded indentation', () => {
    expect(poetryLayout(['The LORD is my shepherd;', 'I shall not want.'])).toEqual([
      { text: 'The LORD is my shepherd;', indent: 0 },
      { text: 'I shall not want.', indent: 1 },
    ]);
    expect(poetryLayout(['a,', '\tb,', 'c;', '\td.']).map((l) => l.indent)).toEqual([0, 1, 0, 1]);
    // passage-level encoding: a verse whose lines are all flush stays flush
    expect(poetryLayout(['Have mercy on me,', 'O God,'], true).map((l) => l.indent)).toEqual([0, 0]);
    // provider indent levels (1 = first level, 2 = indented, 0 = prose part)
    expect(poetryLayout(['As it is written:', 'For Your sake', 'we are considered'], false, [0, 1, 2]).map((l) => l.indent)).toEqual([0, 0, 1]);
    expect(versePoetryLayout({ ...verse(4), poetryLines: ['a,', 'b,', 'c;', 'd.'], poetryIndents: [1, 2, 1, 2] } as Verse, true).map((l) => l.indent)).toEqual([0, 1, 0, 1]);
    expect(verseText(verse(1, { text: 'x', poetryLines: ['a,', '\tb'] }))).toBe('a, b');
  });

  it('recognises psalm superscriptions', () => {
    const v1 = verse(1);
    expect(isPsalmSuperscription('PSA', v1, 'A Psalm of David.')).toBe(true);
    expect(isPsalmSuperscription('PSA', v1, 'For the choirmaster. Of David.')).toBe(true);
    expect(isPsalmSuperscription('PSA', v1, 'The LORD Is My Shepherd')).toBe(false);
    expect(isPsalmSuperscription('ROM', v1, 'A Psalm of David.')).toBe(false);
    const blocks = buildBlocks([verse(1, { heading: 'The LORD Is My Shepherd\nA Psalm of David.' })], 'PSA');
    expect(blocks.map((b) => b.type)).toEqual(['heading', 'superscription', 'prose']);
  });
});

describe('splitLeadingWord', () => {
  it('keeps the first word with the verse number', () => {
    expect(splitLeadingWord([{ text: 'For what the law was powerless to do' }])).toEqual({
      lead: [{ text: 'For' }],
      rest: [{ text: ' what the law was powerless to do' }],
    });
    expect(splitLeadingWord([{ text: 'Therefore, ' }, { text: 'condemnation', keyWordId: 'k' }])).toEqual({
      lead: [{ text: 'Therefore,' }],
      rest: [{ text: ' ' }, { text: 'condemnation', keyWordId: 'k' }],
    });
  });

  it('keeps a short key word that opens the verse whole, but lets a long phrase wrap', () => {
    const kw = { text: 'Abba', keyWordId: 'abba' };
    expect(splitLeadingWord([kw, { text: ', Father' }])).toEqual({ lead: [kw], rest: [{ text: ', Father' }] });
    const long = { text: 'the Spirit of him who raised Jesus from the dead', keyWordId: 'x' };
    expect(splitLeadingWord([long])).toEqual({ lead: [], rest: [long] });
  });

  it('handles single words and empty verses', () => {
    expect(splitLeadingWord([{ text: 'Amen.' }])).toEqual({ lead: [{ text: 'Amen.' }], rest: [] });
    expect(splitLeadingWord([])).toEqual({ lead: [], rest: [] });
  });

  it('never loses text', () => {
    const segs = [{ text: '  And we know ' }, { text: 'all things', keyWordId: 'a' }, { text: ' work together' }];
    const { lead, rest } = splitLeadingWord(segs);
    expect([...lead, ...rest].map((s) => s.text).join('')).toBe(segs.map((s) => s.text).join(''));
  });
});
