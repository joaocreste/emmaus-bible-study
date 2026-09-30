import { describe, expect, it } from 'vitest';
import type { Study } from '../../../domain/models';
import { cite, summaryOf, synthesis } from '../../../domain/provenance';
import { findAuthorAppearances, findCitationSites } from '../citations';

const study: Study = {
  id: 's',
  kind: 'passage',
  depth: 'curated',
  title: 'Romans 8',
  passage: { book: 'ROM', startChapter: 8 },
  summary: { text: '', provenance: synthesis(cite('bsb', 'Rom 8:1')) },
  keyWords: [],
  crossReferences: [
    {
      id: 'x1',
      from: { book: 'ROM', startChapter: 8, startVerse: 15, endChapter: 8, endVerse: 15 },
      target: { book: 'GAL', startChapter: 4, startVerse: 6, endChapter: 4, endVerse: 6 },
      relationship: 'parallel',
      title: 'Abba, Father',
      explanation: { text: '', provenance: synthesis(cite('bsb', 'Gal 4:6'), cite('calvin-romans', 'on 8:15')) },
      tags: [],
    },
  ],
  context: [],
  theology: [],
  perspectives: [],
  commentary: [
    {
      id: 'c1',
      authorId: 'calvin',
      sourceId: 'calvin-romans',
      kind: 'summary',
      text: '',
      lead: 'On adoption',
      locator: 'on 8:15',
      tags: [],
      provenance: summaryOf(cite('calvin-romans', 'on 8:15')),
    },
  ],
  sermons: [],
  verseNotes: [],
  concepts: [],
  suggestedQuestions: [],
  sourceIds: [],
};

describe('findCitationSites', () => {
  it('finds every provenance citing the source, de-duplicated', () => {
    const sites = findCitationSites(study, 'calvin-romans', (id) => (id === 'calvin' ? 'John Calvin' : undefined));
    expect(sites).toEqual([
      { section: 'cross-references', label: 'Galatians 4:6 — Abba, Father', itemId: 'x1', locator: 'on 8:15' },
      { section: 'commentary', label: 'John Calvin — On adoption', itemId: 'c1', locator: 'on 8:15' },
    ]);
  });

  it('lists a commentary entry once, preferring its provenance locator', () => {
    const withEntryLocator: Study = { ...study, commentary: [{ ...study.commentary[0], locator: 'ch. 8' }] };
    const sites = findCitationSites(withEntryLocator, 'calvin-romans').filter((s) => s.section === 'commentary');
    expect(sites).toEqual([{ section: 'commentary', label: 'On adoption', itemId: 'c1', locator: 'on 8:15' }]);
  });

  it('includes the summary for Scripture citations', () => {
    expect(findCitationSites(study, 'bsb').map((s) => s.section)).toEqual(['overview', 'cross-references']);
  });
});

describe('findAuthorAppearances', () => {
  it('lists commentary attributed to the author', () => {
    expect(findAuthorAppearances(study, 'calvin').commentaryIds).toEqual(['c1']);
    expect(findAuthorAppearances(study, 'luther').commentaryIds).toEqual([]);
  });
});
