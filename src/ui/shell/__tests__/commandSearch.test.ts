import { describe, expect, it } from 'vitest';
import type { Author, CuratedStudy, KeyWord } from '../../../domain/models';
import type { TopicMatch } from '../../../providers/types';
import { normalizeSearch, searchPalette, type PaletteData } from '../commandSearch';

const prov = { kind: 'synthesis' as const, verification: 'editorial' as const, citations: [] };

const word: KeyWord = {
  id: 'katakrima',
  strong: 'G2631',
  language: 'greek',
  lemma: 'κατάκριμα',
  transliteration: 'katakrima',
  english: 'condemnation',
  anchors: [],
  basicMeaning: 'condemnation',
  semanticRange: [],
  notableOccurrences: [],
  significance: { text: 'x', provenance: prov },
  provenance: prov,
};

const romans = {
  id: 'romans-8',
  kind: 'passage',
  title: 'Romans 8',
  subtitle: 'Life in the Spirit',
  keyWords: [word],
  match: { references: [], topics: ['adoption'] },
} as unknown as CuratedStudy;

const topic: TopicMatch = {
  id: 'grace',
  name: 'Grace',
  aliases: ['grace', 'unmerited favor'],
  topic: { name: 'Grace', definition: { text: 'x', provenance: prov }, keyPassages: [] },
  score: 1,
};

const calvin: Author = { id: 'calvin', name: 'John Calvin', era: 'reformation', tradition: 'Reformed', description: 'x', lifespan: '1509–1564' };

const data: PaletteData = { studies: [romans], topics: [topic], authors: [calvin] };

const ids = (q: string) => searchPalette(q, data).flatMap((g) => g.items.map((i) => i.id));

describe('searchPalette', () => {
  it('suggests studies and topics for an empty query', () => {
    expect(searchPalette('', data).map((g) => g.id)).toEqual(['studies', 'topics']);
  });

  it('offers to open a typed reference first', () => {
    const groups = searchPalette('John 3:16', data);
    expect(groups[0].id).toBe('passage');
    expect(groups[0].items[0].title).toBe('Open John 3:16');
    expect(groups[0].items[0].action).toEqual({
      kind: 'open-passage',
      passage: { book: 'JHN', startChapter: 3, startVerse: 16, endChapter: 3, endVerse: 16 },
    });
  });

  it('finds key words by English, transliteration or original script (accents ignored)', () => {
    expect(ids('condemn')).toContain('word:romans-8:katakrima');
    expect(ids('katakr')).toContain('word:romans-8:katakrima');
    expect(ids('κατακριμα')).toContain('word:romans-8:katakrima');
  });

  it('finds topics by alias, studies by match topic, authors by name', () => {
    expect(ids('unmerited')).toContain('topic:grace');
    expect(ids('adoption')).toContain('study:romans-8');
    expect(ids('calvin')).toContain('author:calvin');
  });

  it('always ends with an Ask row', () => {
    const groups = searchPalette('why suffering', data);
    expect(groups.at(-1)?.items[0].action).toEqual({ kind: 'ask', text: 'why suffering' });
  });

  it('normalises case, accents and quotes', () => {
    expect(normalizeSearch('  “Lógos”  ')).toBe('logos');
  });
});

describe('searchPalette de-duplication', () => {
  it('hides a topic whose curated study is already listed, but still finds the study by the topic alias', () => {
    const withLink: PaletteData = { ...data, topics: [{ ...topic, studyId: 'romans-8' }] };
    expect(searchPalette('', withLink).find((g) => g.id === 'topics')).toBeUndefined();
    const found = searchPalette('unmerited', withLink).flatMap((g) => g.items.map((i) => i.id));
    expect(found).toContain('study:romans-8');
    expect(found).not.toContain('topic:grace');
  });
});
