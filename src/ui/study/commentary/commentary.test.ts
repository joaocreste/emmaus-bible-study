import { describe, expect, it } from 'vitest';
import type { Author, CommentaryEntry, Passage, Source } from '../../../domain/models';
import { filterEntries, presentAuthors, presentEras } from './eras';
import { displayProvenance, entryLink, entryLocator, presentEntry, stripOuterQuotes } from './presentation';
import { defaultScope, isLargePassage, scopeGroups } from './scope';

const source = (usage: Source['license']['usage'], url?: string): Source => ({
  id: 'src',
  type: 'commentary',
  title: 'A Work',
  authorIds: ['a'],
  ...(url ? { url } : {}),
  license: { status: usage === 'summary-only' ? 'copyrighted' : 'public-domain', name: 'x', usage },
});

const entry = (patch: Partial<CommentaryEntry>): CommentaryEntry => ({
  id: 'e',
  authorId: 'a',
  sourceId: 'src',
  kind: 'quotation',
  text: 'words',
  tags: [],
  provenance: { kind: 'quotation', verification: 'verified', citations: [{ sourceId: 'src', locator: 'ch. 1' }] },
  ...patch,
});

describe('commentary presentation rules', () => {
  it('quotes only verified words from a source that allows quotation', () => {
    expect(presentEntry(entry({}), source('full-text'))).toEqual({ mode: 'quotation' });
    expect(presentEntry(entry({}), source('excerpt'))).toEqual({ mode: 'quotation' });
  });

  it('never quotes summaries', () => {
    const e = entry({ kind: 'summary', provenance: { kind: 'summary', verification: 'editorial', citations: [] } });
    expect(presentEntry(e, source('summary-only'))).toEqual({ mode: 'summary' });
  });

  it('demotes unverified quotations to a flagged summary', () => {
    const e = entry({ provenance: { kind: 'quotation', verification: 'unverified', citations: [] } });
    const p = presentEntry(e, source('full-text'));
    expect(p).toEqual({ mode: 'unverified-summary' });
    expect(displayProvenance(e, p)).toMatchObject({ kind: 'summary', verification: 'unverified' });
  });

  it('withholds verbatim wording from summary-only sources or unknown sources', () => {
    expect(presentEntry(entry({}), source('summary-only'))).toEqual({ mode: 'withheld', reason: 'license' });
    expect(presentEntry(entry({}), source('metadata-only'))).toEqual({ mode: 'withheld', reason: 'license' });
    expect(presentEntry(entry({}), undefined)).toEqual({ mode: 'withheld', reason: 'missing-source' });
  });

  it('prefers the most specific link and locator', () => {
    expect(entryLink(entry({ url: 'https://deep' }), source('full-text', 'https://base'))).toBe('https://deep');
    expect(entryLink(entry({}), source('full-text', 'https://base'))).toBe('https://base');
    expect(entryLocator(entry({}))).toBe('ch. 1');
    expect(entryLocator(entry({ locator: 'on 8:1' }))).toBe('on 8:1');
  });

  it('adds exactly one pair of quotation marks', () => {
    expect(stripOuterQuotes('“Grace.”')).toBe('Grace.');
    expect(stripOuterQuotes('"Grace."')).toBe('Grace.');
    expect(stripOuterQuotes('the saints’')).toBe('the saints’');
  });
});

describe('commentary filters', () => {
  const authors: Record<string, Author> = {
    aug: { id: 'aug', name: 'Augustine', era: 'early-church', tradition: '', description: '' },
    cal: { id: 'cal', name: 'Calvin', era: 'reformation', tradition: '', description: '' },
    kel: { id: 'kel', name: 'Keller', era: 'contemporary', tradition: '', description: '' },
  };
  const get = (id: string) => authors[id];
  const entries = [entry({ id: '1', authorId: 'kel' }), entry({ id: '2', authorId: 'aug' }), entry({ id: '3', authorId: 'cal' })];

  it('lists present eras and authors chronologically', () => {
    expect(presentEras(entries, get)).toEqual(['early-church', 'reformation', 'contemporary']);
    expect(presentAuthors(entries, get).map((a) => a.id)).toEqual(['aug', 'cal', 'kel']);
  });

  it('filters by era and by author', () => {
    expect(filterEntries(entries, get, 'all', []).map((e) => e.id)).toEqual(['1', '2', '3']);
    expect(filterEntries(entries, get, 'reformation', []).map((e) => e.id)).toEqual(['3']);
    expect(filterEntries(entries, get, 'all', ['kel']).map((e) => e.id)).toEqual(['1']);
    expect(filterEntries(entries, get, 'reformation', ['kel'])).toEqual([]);
  });
});

describe('classic commentary scope', () => {
  const rom8 = { book: 'ROM', startChapter: 8 };
  const text: Passage = {
    ref: rom8,
    label: 'Romans 8',
    translation: 'BSB',
    sourceId: 'bsb',
    chapters: [{ chapter: 8, verses: [1, 2, 3].map((verse) => ({ ref: { book: 'ROM', chapter: 8, verse }, text: '' })) }],
  };

  it('defaults to the active verse, else the passage, else its first chapter', () => {
    expect(defaultScope(rom8, { book: 'ROM', chapter: 8, verse: 28 })).toMatchObject({ startVerse: 28, endVerse: 28 });
    expect(defaultScope(rom8)).toBe(rom8);
    const genesis = { book: 'GEN', startChapter: 1, endChapter: 50 };
    expect(isLargePassage(genesis)).toBe(true);
    expect(defaultScope(genesis)).toEqual({ book: 'GEN', startChapter: 1 });
  });

  it('offers the whole passage and each verse, always including the current scope', () => {
    const groups = scopeGroups(rom8, text, rom8);
    expect(groups[0].options[0].label).toBe('Whole passage (Romans 8)');
    expect(groups[1].options.map((o) => o.label)).toEqual(['Verse 1', 'Verse 2', 'Verse 3']);
    const withOutside = scopeGroups(rom8, text, { book: 'ROM', startChapter: 5, startVerse: 1, endChapter: 5, endVerse: 1 });
    expect(withOutside[0].options[0].label).toBe('Romans 5:1 (selected verse)');
  });

  it('offers chapters (not verses) for long passages', () => {
    const genesis = { book: 'GEN', startChapter: 1, endChapter: 50 };
    const groups = scopeGroups(genesis, undefined, { book: 'GEN', startChapter: 1 });
    expect(groups).toHaveLength(1);
    expect(groups[0].options).toHaveLength(50);
    expect(groups[0].options[0].label).toBe('Chapter 1');
  });
});

describe('verse scope in other languages', () => {
  it('labels the scope options in the reader’s language', () => {
    const rom89 = { book: 'ROM', startChapter: 8, endChapter: 9 };
    const outside = { book: 'ROM', startChapter: 5, startVerse: 1, endChapter: 5, endVerse: 1 };
    const fr = scopeGroups(rom89, undefined, outside, 'fr');
    expect(fr[0].options.map((o) => o.label).slice(1)).toEqual([expect.stringMatching(/^Passage entier \(.+ 8–9\)$/), 'Chapitre 8', 'Chapitre 9']);
    expect(fr[0].options[0].label).toMatch(/ 5\.1 \(verset sélectionné\)$/);
    expect(scopeGroups(rom89, undefined, rom89, 'es')[0].options[1].label).toBe('Capítulo 8');
  });
});

