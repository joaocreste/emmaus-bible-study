import { describe, expect, it } from 'vitest';
import type { CrossReference, PassageRef, RelationshipType } from '../../../../domain/models';
import { synthesis } from '../../../../domain/provenance';
import {
  authorsPresent,
  facetCounts,
  filterCrossReferences,
  isFilterActive,
  relationshipsPresent,
  toggleAuthor,
  toggleRelationship,
  traditionalAuthorOf,
} from '../filter';

function xref(id: string, target: PassageRef, relationship: RelationshipType, tags: string[] = []): CrossReference {
  return {
    id,
    from: { book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 1 },
    target,
    relationship,
    title: id,
    explanation: { text: '', provenance: synthesis() },
    tags,
  };
}

const refs = [
  xref('gal', { book: 'GAL', startChapter: 4, startVerse: 6 }, 'parallel', ['adoption']),
  xref('jhn', { book: 'JHN', startChapter: 3, startVerse: 18 }, 'same-concept', ['condemnation']),
  xref('eph', { book: 'EPH', startChapter: 1, startVerse: 5 }, 'thematic', ['Adoption']),
  xref('psa', { book: 'PSA', startChapter: 23 }, 'allusion'),
];

describe('cross-reference filters', () => {
  it('resolves the traditional author of the target book', () => {
    expect(traditionalAuthorOf({ book: 'GAL', startChapter: 1 })).toBe('Paul');
  });

  it('filters by author, book, relationship and tags', () => {
    expect(filterCrossReferences(refs, { author: 'paul' }).map((x) => x.id)).toEqual(['gal', 'eph']);
    expect(filterCrossReferences(refs, { book: 'JHN' }).map((x) => x.id)).toEqual(['jhn']);
    expect(filterCrossReferences(refs, { relationships: ['parallel', 'thematic'] }).map((x) => x.id)).toEqual(['gal', 'eph']);
    expect(filterCrossReferences(refs, { tags: ['adoption'] }).map((x) => x.id)).toEqual(['gal', 'eph']);
    expect(filterCrossReferences(refs, { author: 'Paul', relationships: ['thematic'] }).map((x) => x.id)).toEqual(['eph']);
    expect(filterCrossReferences(refs, {})).toHaveLength(4);
  });

  it('reports whether any criterion is active', () => {
    expect(isFilterActive({})).toBe(false);
    expect(isFilterActive({ relationships: [] })).toBe(false);
    expect(isFilterActive({ author: 'Paul' })).toBe(true);
  });

  it('lists relationships in display order and authors by frequency', () => {
    expect(relationshipsPresent(refs).map((r) => r.type)).toEqual(['parallel', 'allusion', 'thematic', 'same-concept']);
    expect(authorsPresent(refs)).toEqual([
      { author: 'Paul', count: 2 },
      { author: 'John', count: 1 },
    ]);
  });

  it('toggles relationship and author criteria', () => {
    const a = toggleRelationship({}, 'thematic');
    expect(a.relationships).toEqual(['thematic']);
    expect(toggleRelationship(a, 'thematic').relationships).toBeUndefined();
    expect(toggleAuthor({ author: 'Paul' }, 'paul').author).toBeUndefined();
    expect(toggleAuthor({}, 'John').author).toBe('John');
  });

  it('counts each chip against the other active criteria', () => {
    const none = facetCounts(refs, {});
    expect(Object.fromEntries(none.relationships)).toEqual({ parallel: 1, 'same-concept': 1, thematic: 1, allusion: 1 });
    expect(none.authors.get('paul')).toBe(2);

    // With "Paul" pressed, only relationships among Paul's references can be picked…
    const paul = facetCounts(refs, { author: 'Paul' });
    expect(paul.relationships.get('parallel')).toBe(1);
    expect(paul.relationships.get('thematic')).toBe(1);
    expect(paul.relationships.get('same-concept') ?? 0).toBe(0);
    // …and the author chips ignore the author criterion itself.
    expect(paul.authors.get('john')).toBe(1);

    // With a relationship pressed, author counts follow it.
    const thematic = facetCounts(refs, { relationships: ['thematic'] });
    expect(thematic.authors.get('paul')).toBe(1);
    expect(thematic.authors.get('john') ?? 0).toBe(0);
  });
});
