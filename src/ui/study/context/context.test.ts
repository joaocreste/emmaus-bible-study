import { describe, expect, it } from 'vitest';
import type { ContextItem } from '../../../domain/models';
import { CONTEXT_CATEGORY_ORDER, groupContextItems, sortContextItems } from './categories';
import { looksLikeHeading, parseIntroduction, splitIntroLead } from './introText';
import { splitParagraphs } from './SynthesisBlock';
import { compressVerses } from './verses';

const item = (id: string, category: ContextItem['category']): ContextItem => ({
  id,
  category,
  title: id,
  summary: '',
  tags: [],
  provenance: { kind: 'historical', verification: 'editorial', citations: [] },
});

describe('context categories', () => {
  it('covers every category exactly once', () => {
    expect(new Set(CONTEXT_CATEGORY_ORDER).size).toBe(14);
  });

  it('sorts by category order, stable within a category', () => {
    const sorted = sortContextItems([item('g', 'genre'), item('a1', 'authorship'), item('p', 'political'), item('a2', 'authorship')]);
    expect(sorted.map((i) => i.id)).toEqual(['a1', 'a2', 'p', 'g']);
    expect(groupContextItems(sorted).map((g) => [g.category, g.items.length])).toEqual([
      ['authorship', 2],
      ['political', 1],
      ['genre', 1],
    ]);
  });
});

describe('book introduction parsing', () => {
  it('detects short title-like lines as headings', () => {
    expect(looksLikeHeading('Setting')).toBe(true);
    expect(looksLikeHeading('Date and Occasion')).toBe(true);
    expect(looksLikeHeading('## Meaning and Message')).toBe(true);
    expect(looksLikeHeading('Paul wrote this letter from Corinth.')).toBe(false);
    expect(looksLikeHeading('who wrote it')).toBe(false);
  });

  it('splits paragraphs and headings, including a heading glued to its paragraph', () => {
    const blocks = parseIntroduction('Paul wrote to Rome.\n\nSetting\nThe church met in homes.\n\nSummary\n\nThe letter unfolds.');
    expect(blocks).toEqual([
      { type: 'paragraph', text: 'Paul wrote to Rome.' },
      { type: 'heading', text: 'Setting' },
      { type: 'paragraph', text: 'The church met in homes.' },
      { type: 'heading', text: 'Summary' },
      { type: 'paragraph', text: 'The letter unfolds.' },
    ]);
    const { lead, rest } = splitIntroLead(blocks);
    expect(lead).toHaveLength(1);
    expect(rest).toHaveLength(4);
  });

  it('keeps a leading heading with the first paragraph', () => {
    const { lead, rest } = splitIntroLead(parseIntroduction('Setting\n\nFirst.\n\nSecond.'));
    expect(lead.map((b) => b.type)).toEqual(['heading', 'paragraph']);
    expect(rest).toHaveLength(1);
  });
});

describe('verse helpers', () => {
  it('compresses consecutive verses into ranges', () => {
    const v = (chapter: number, verse: number) => ({ book: 'ROM', chapter, verse });
    const out = compressVerses([v(8, 3), v(8, 1), v(8, 2), v(8, 15), v(8, 15), v(9, 1)]);
    expect(out).toEqual([
      { book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 3 },
      { book: 'ROM', startChapter: 8, startVerse: 15, endChapter: 8, endVerse: 15 },
      { book: 'ROM', startChapter: 9, startVerse: 1, endChapter: 9, endVerse: 1 },
    ]);
  });

  it('splits paragraphs on blank lines only', () => {
    expect(splitParagraphs('One\nstill one.\n\n Two ')).toEqual(['One still one.', 'Two']);
  });
});
