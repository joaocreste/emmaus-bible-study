import { describe, expect, it } from 'vitest';
import type { Passage } from '../../../domain/models';
import { canonSections, describeCanonPosition, formatWithinBook, ordinal } from './canon';
import { buildChiasmTree, buildOutlineTree, chiasmLabel, drawAsChiasm, isChiastic, treeDepth, type StructureLine } from './chiasm';
import { headingOutline, segmentWeight } from './outline';

describe('canon position', () => {
  it('describes Romans from the canon table', () => {
    const pos = describeCanonPosition('ROM');
    expect(pos.sentence).toBe('Romans is the 6th book of the New Testament, first of the thirteen Pauline letters.');
    expect(pos.facts[0]).toBe('Book 45 of 66 (Protestant order)');
    expect(pos.facts).toContain('Traditionally attributed to Paul');
  });

  it('handles first, last and single-book sections', () => {
    expect(describeCanonPosition('GEN').sentence).toBe(
      'Genesis is the 1st book of the Old Testament, first of the five books of the Pentateuch.',
    );
    expect(describeCanonPosition('MAL').sentence).toBe(
      'Malachi is the 39th and final book of the Old Testament, last of the twelve Minor Prophets.',
    );
    expect(describeCanonPosition('ACT').sentence).toBe(
      'Acts is the 5th book of the New Testament, standing between the Gospels and the Pauline letters.',
    );
    expect(describeCanonPosition('REV').sentence).toBe(
      'Revelation is the 27th and final book of the New Testament, following the General Letters.',
    );
    expect(describeCanonPosition('HEB').facts).toContain('Traditional attribution: Anonymous');
  });

  it('groups each testament into sections covering every book', () => {
    expect(canonSections('NT').reduce((n, s) => n + s.books.length, 0)).toBe(27);
    expect(canonSections('OT').reduce((n, s) => n + s.books.length, 0)).toBe(39);
  });

  it('formats ordinals and in-book references', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23].map(ordinal)).toEqual([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '11th',
      '12th',
      '13th',
      '21st',
      '22nd',
      '23rd',
    ]);
    expect(formatWithinBook({ book: 'ROM', startChapter: 8 })).toBe('Ch. 8');
    expect(formatWithinBook({ book: 'ROM', startChapter: 9, endChapter: 11 })).toBe('Chs. 9–11');
    expect(formatWithinBook({ book: 'ROM', startChapter: 1, startVerse: 18, endChapter: 3, endVerse: 20 })).toBe('1:18–3:20');
    expect(formatWithinBook({ book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 17 })).toBe('8:1–17');
  });
});

describe('outline weights', () => {
  it('sizes whole chapters by chapter count and partial chapters approximately', () => {
    expect(segmentWeight({ book: 'ROM', startChapter: 9, endChapter: 11 })).toBe(3);
    expect(segmentWeight({ book: 'ROM', startChapter: 8 })).toBe(1);
    const partial = segmentWeight({ book: 'ROM', startChapter: 1, startVerse: 18, endChapter: 3, endVerse: 20 });
    expect(partial).toBeGreaterThan(1.5);
    expect(partial).toBeLessThan(3);
    // never vanishingly small
    expect(segmentWeight({ book: 'ROM', startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 1 })).toBeGreaterThanOrEqual(0.4);
  });

  it('builds an outline from section headings', () => {
    const v = (chapter: number, verse: number, heading?: string) => ({
      ref: { book: 'PSA', chapter, verse },
      text: `v${verse}`,
      ...(heading ? { heading } : {}),
    });
    const passage: Passage = {
      ref: { book: 'ROM', startChapter: 8 },
      label: 'Romans 8',
      translation: 'BSB',
      sourceId: 'bsb',
      chapters: [{ chapter: 8, verses: [v(8, 1), v(8, 2, 'Life in the Spirit'), v(8, 3), v(8, 4, 'Future Glory'), v(8, 5)] }],
    };
    const out = headingOutline(passage);
    expect(out.map((s) => s.label)).toEqual(['Opening verses', 'Life in the Spirit', 'Future Glory']);
    expect(out[1].ref).toMatchObject({ startChapter: 8, startVerse: 2, endChapter: 8, endVerse: 3 });
    expect(out[2].verseCount).toBe(2);
  });
});

describe('chiasm structures', () => {
  const line = (label: string, level: number): StructureLine => ({ label, text: `text ${label}`, level });
  const chiasm = [line('A', 0), line('B', 1), line('C', 2), line('B′', 1), line('A′', 0)];

  it('recognises mirrored level patterns only', () => {
    expect(isChiastic(chiasm)).toBe(true);
    expect(isChiastic([line('A', 0), line('B', 1), line('B′', 1), line('A′', 0)])).toBe(true);
    expect(isChiastic([line('1', 0), line('2', 0), line('3', 0)])).toBe(false);
    expect(isChiastic([line('A', 0), line('B', 1), line('A′', 0), line('B′', 1)])).toBe(false);
    expect(isChiastic([line('A', 0), line('B', 1)])).toBe(false);
  });

  it('draws a ladder only for chiasms, never for a plain outline with symmetric levels', () => {
    const outline = [line('I.', 0), line('a.', 1), line('b.', 1), line('II.', 0)];
    expect(drawAsChiasm('argument-structure', outline)).toBe(false);
    expect(drawAsChiasm('chiasm', chiasm)).toBe(true);
    expect(drawAsChiasm('parallelism', chiasm)).toBe(true);
    expect(drawAsChiasm('chiasm', outline.slice(0, 2))).toBe(false);
  });

  it('pairs mirrored members into a nested tree with the centre deepest', () => {
    const tree = buildChiasmTree(chiasm);
    expect(tree).toHaveLength(1);
    expect(tree[0].open.label).toBe('A');
    expect(tree[0].close?.label).toBe('A′');
    expect(tree[0].children[0].open.label).toBe('B');
    expect(tree[0].children[0].close?.label).toBe('B′');
    const centre = tree[0].children[0].children[0];
    expect(centre.open.label).toBe('C');
    expect(centre.close).toBeUndefined();
    expect(treeDepth(tree)).toBe(2);
  });

  it('pairs a doubled centre (C, C′)', () => {
    const tree = buildChiasmTree([line('A', 0), line('B', 1), line('B′', 1), line('A′', 0)]);
    expect(tree[0].children[0].close?.label).toBe('B′');
  });

  it('nests plain outlines by level', () => {
    const tree = buildOutlineTree([line('I', 0), line('a', 1), line('b', 1), line('II', 0)]);
    expect(tree.map((n) => n.open.label)).toEqual(['I', 'II']);
    expect(tree[0].children.map((n) => n.open.label)).toEqual(['a', 'b']);
  });

  it('derives labels when missing', () => {
    expect(chiasmLabel({ label: '', text: '', level: 1 }, false)).toBe('B');
    expect(chiasmLabel({ label: '', text: '', level: 1 }, true)).toBe('B′');
    expect(chiasmLabel({ label: 'X', text: '', level: 1 }, true)).toBe('X');
  });
});

describe('canon position in other languages', () => {
  it('phrases the canon sentence with gender and ordinal agreement', () => {
    expect(describeCanonPosition('ROM', 'pt').sentence).toMatch(/ é o 6º livro do Novo Testamento, a primeira das treze cartas paulinas\.$/);
    expect(describeCanonPosition('GEN', 'pt').sentence).toMatch(/ é o 1º livro do Antigo Testamento, o primeiro dos cinco livros do Pentateuco\.$/);
    expect(describeCanonPosition('MAL', 'es').sentence).toMatch(/ es el 39\.º y último libro del Antiguo Testamento, el último de los doce profetas menores\.$/);
    expect(describeCanonPosition('GEN', 'es').sentence).toMatch(/ es el primer libro del Antiguo Testamento, el primero de los cinco libros del Pentateuco\.$/);
    expect(describeCanonPosition('ACT', 'fr').sentence).toMatch(/ est le 5e livre du Nouveau Testament, entre les Évangiles et les épîtres pauliniennes\.$/);
    expect(describeCanonPosition('REV', 'fr').sentence).toMatch(/ est le 27e et dernier livre du Nouveau Testament, après les épîtres générales\.$/);
  });

  it('translates the facts, including the traditional attribution', () => {
    expect(describeCanonPosition('ROM', 'es').facts).toEqual(['Libro 45 de 66 (orden protestante)', '16 capítulos', 'Tradicionalmente atribuido a Pablo', 'Carta']);
    expect(describeCanonPosition('HEB', 'fr').facts).toContain('Attribution traditionnelle : anonyme');
    expect(describeCanonPosition('OBA', 'pt').facts).toContain('1 capítulo');
  });

  it('formats in-book references with the language’s separator', () => {
    expect(formatWithinBook({ book: 'ROM', startChapter: 8 }, 'pt')).toBe('Cap. 8');
    expect(formatWithinBook({ book: 'ROM', startChapter: 9, endChapter: 11 }, 'fr')).toBe('Chap. 9–11');
    expect(formatWithinBook({ book: 'ROM', startChapter: 1, startVerse: 18, endChapter: 3, endVerse: 20 }, 'fr')).toBe('1.18–3.20');
    expect(formatWithinBook({ book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 17 }, 'es')).toBe('8:1–17');
  });
});
