import { describe, expect, it } from 'vitest';
import {
  basicClean,
  cleanCalvinSection,
  commentaryChapterToSections,
  findTextDefects,
  fixMojibake,
  fixNumberedBookRefs,
  isLatinParagraph,
  removeMangledGreek,
  repairCalvinEncoding,
} from '../cleaners';

const CALVIN_ROMANS = [
  'Romans 8:1-4',
  ' 1. There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit. [237]',
  '1. Nulla igitur condemnatio est iis qui sunt in Christo Iesu, qui non secumdum carnem ambulant, sed secundum Spiritum.',
  '2. For the law of the Spirit of life in Christ Jesus hath made me free from the law of sin and death.',
  '2. Lex enim Spiritus vit? in Christo Iesu, liberum me reddidit a lege peccati et mortis.',
  '1. There is then, etc. After having described the contest which the godly have perpetually with their own flesh, he returns to the consolation [238] -- That though they were beset by sin.',
  'The words of Rosenm?ller and the h?redes of God.',
  'Footnotes:',
  '[237] This clause is regarded as spurious by Griesbach.',
].join('\n\n');

describe('Calvin cleaner', () => {
  it('drops the heading, the English/Latin verse block and footnotes', () => {
    const { paragraphs, headings } = cleanCalvinSection(CALVIN_ROMANS);
    expect(headings[0]).toMatchObject({ bookName: 'Romans', chapter: 8, startVerse: 1, endVerse: 4 });
    expect(paragraphs[0]).toMatch(/^1\. There is then, etc\. After having described/);
    const text = paragraphs.join('\n\n');
    expect(text).not.toMatch(/Nulla igitur|Lex enim|\[23\d\]|Footnotes|Griesbach/);
    expect(text).toContain('consolation — That though');
    expect(text).toContain('Rosenmüller');
    expect(text).toContain('hæredes');
  });

  it('keeps a single translation paragraph out and the commentary in (Psalms layout)', () => {
    const raw = [
      'Psalm 23:1-4',
      'A Psalm of David.',
      '1. Jehovah is my shepherd, I shall not want. [529] 2. He maketh me to lie down in pastures of grass.',
      '1. Jehovah is my shepherd. Although God, by his benefits, gently allures us to himself.',
    ].join('\n\n');
    expect(cleanCalvinSection(raw).paragraphs).toEqual(['1. Jehovah is my shepherd. Although God, by his benefits, gently allures us to himself.']);
  });

  it('keeps commentary that starts with a verse number when no translation precedes it', () => {
    const raw = ['2 Corinthians 2:1-2', '1 But I had determined Whoever it was that divided the chapters.', '2. For if I make you sorry Here we have the proof.'].join('\n\n');
    expect(cleanCalvinSection(raw).paragraphs).toHaveLength(2);
  });

  it('recognises Latin', () => {
    expect(isLatinParagraph('2. Lex enim Spiritus vit? in Christo Iesu, liberum me reddidit a lege peccati et mortis.')).toBe(true);
    expect(isLatinParagraph('For the law of the Spirit of life in Christ Jesus hath made me free from the law of sin and death.')).toBe(false);
  });

  it('repairs encoding damage without touching real question marks', () => {
    expect(repairCalvinEncoding('Lex enim Spiritus vit? in Christo')).toBe('Lex enim Spiritus vitæ in Christo');
    expect(repairCalvinEncoding('the ?thiopic version')).toBe('the Æthiopic version');
    expect(repairCalvinEncoding('Who shall separate us? Nothing.')).toBe('Who shall separate us? Nothing.');
    expect(repairCalvinEncoding('the word ba?lil')).toBe('the word ba’lil');
  });

  it('replaces mangled SPIonic Greek with a visible marker', () => {
    expect(removeMangledGreek('as it is said, Ti>v su< pe>leiv kai< Cristo<v, and so on')).toBe('as it is said, [Greek], and so on');
    expect(removeMangledGreek('plain text <with> no Greek')).toBe('plain text <with> no Greek');
  });
});

describe('generic cleaners', () => {
  it('repairs UTF-8/Windows-1252 mojibake', () => {
    expect(fixMojibake('IRENÃ†US and PhÅ“nicia, Â£50, HorÃ&brvbr PaulinÃ&brvbr')).toBe('IRENÆUS and Phœnicia, £50, Horæ Paulinæ');
  });

  it('normalises numbered-book references and dashes', () => {
    expect(fixNumberedBookRefs('see Kg2 21:16 and Jo1 1:6-7')).toBe('see 2Kg 21:16 and 1Jo 1:6-7');
    expect(basicClean('free--rather, "freed me"\n\nsecond')).toEqual(['free—rather, "freed me"', 'second']);
  });

  it('flags residual defects', () => {
    expect(findTextDefects('clean text')).toEqual([]);
    expect(findTextDefects('vit?e')).toContain('question mark inside a word (encoding damage)');
    expect(findTextDefects('see [237]', { footnoteMarkers: true })).toContain('footnote marker');
    expect(findTextDefects('Isa 9:9 [10]')).toEqual([]);
  });
});

describe('commentaryChapterToSections', () => {
  it('anchors sections at their start verse and closes them before the next one', () => {
    const chapter = {
      chapter: {
        number: 8,
        content: [
          { type: 'verse', number: 1, content: ['I. The apostle here begins.\nII. Second point.'] },
          { type: 'verse', number: 10, content: ['In these verses more.'] },
        ],
      },
    };
    expect(commentaryChapterToSections('matthew-henry', chapter, 39)).toEqual([
      [8, 1, 8, 9, 'I. The apostle here begins.\n\nII. Second point.'],
      [8, 10, 8, 39, 'In these verses more.'],
    ]);
  });

  it('uses Calvin headings for the exact range', () => {
    const chapter = { chapter: { number: 8, content: [{ type: 'verse', number: 1, content: [CALVIN_ROMANS] }] } };
    const [section] = commentaryChapterToSections('calvin', chapter, 39, 'Romans');
    expect(section.slice(0, 4)).toEqual([8, 1, 8, 4]);
  });
});
