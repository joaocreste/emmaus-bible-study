import { describe, expect, it } from 'vitest';
import type { Provenance, Source, SourceType, Study } from '../../../domain/models';
import { groupKeyPassages } from '../topic/grouping';
import { collectSourceUsage, studySourceIds } from './citations';
import { citationPlaceLabel } from './citations';
import { groupSources, licenseBadge, localizeLicenseName, SOURCE_GROUPS, usagePolicyText, USAGE_TEXT } from './grouping';

const prov = (...ids: string[]): Provenance => ({
  kind: 'synthesis',
  verification: 'editorial',
  citations: ids.map((sourceId) => ({ sourceId })),
});

const emptyStudy: Study = {
  id: 's',
  kind: 'passage',
  depth: 'curated',
  title: 'T',
  keyWords: [],
  crossReferences: [],
  context: [],
  theology: [],
  perspectives: [],
  commentary: [],
  sermons: [],
  verseNotes: [],
  concepts: [],
  suggestedQuestions: [],
  sourceIds: ['bsb'],
};

describe('source usage', () => {
  it('counts items (not raw citations) and records where they are', () => {
    const study: Study = {
      ...emptyStudy,
      summary: { text: '', provenance: prov('tyndale', 'tyndale') },
      context: [
        { id: 'c', category: 'occasion', title: '', summary: '', tags: [], provenance: prov('tyndale') },
      ],
      theology: [{ id: 't', category: 'grace', title: '', summary: '', keyVerses: [], tags: [], provenance: prov('calvin') }],
      commentary: [
        { id: 'e', authorId: 'calvin', sourceId: 'calvin', kind: 'summary', text: '', tags: [], provenance: prov('calvin') },
      ],
      sermons: [{ id: 'sm', authorId: 'spurgeon', title: '', refs: [], topics: [], sourceId: 'spurgeon-sermons' }],
    };
    const usage = collectSourceUsage(study);
    expect(usage.get('tyndale')).toEqual({ count: 2, places: ['Overview', 'Context'] });
    expect(usage.get('calvin')).toEqual({ count: 2, places: ['Theology', 'Commentary'] });
    expect(usage.get('spurgeon-sermons')).toEqual({ count: 1, places: ['Sermons'] });
    expect(usage.has('bsb')).toBe(false);
    expect(studySourceIds(study, usage)).toEqual(['bsb', 'tyndale', 'calvin', 'spurgeon-sermons']);
  });
});

describe('source grouping and labels', () => {
  it('assigns every source type to exactly one group', () => {
    const all: SourceType[] = [
      'bible-translation',
      'original-text',
      'lexicon',
      'dataset',
      'commentary',
      'study-notes',
      'book',
      'sermon',
      'article',
      'lecture',
      'creed',
      'confession',
      'catechism',
      'dictionary',
      'encyclopedia',
      'website',
    ];
    for (const t of all) expect(SOURCE_GROUPS.filter((g) => g.types.includes(t))).toHaveLength(1);
  });

  it('returns only non-empty groups in reading order', () => {
    const src = (id: string, type: SourceType) => ({
      id,
      type,
      title: id,
      authorIds: [],
      license: { status: 'public-domain' as const, name: 'Public domain', usage: 'full-text' as const },
    });
    const groups = groupSources([src('b', 'book'), src('bsb', 'bible-translation'), src('wcf', 'confession')]);
    expect(groups.map((g) => g.label)).toEqual(['Scripture & original text', 'Books', 'Creeds, confessions & catechisms']);
  });

  it('explains licenses in plain words', () => {
    expect(licenseBadge({ status: 'open-license', name: 'CC BY-SA 4.0', usage: 'full-text' }).label).toBe('Open license · CC BY-SA 4.0');
    expect(licenseBadge({ status: 'copyrighted', name: '© 2012', usage: 'summary-only' }).label).toBe('Copyrighted');
    expect(USAGE_TEXT['summary-only']).toBe('Summarised only — wording not reproduced');
    expect(USAGE_TEXT['metadata-only']).toBe('Cited only');
  });
});

describe('key passage grouping', () => {
  it('groups by first appearance and floats pinned passages out', () => {
    const p = (id: string, group: string) => ({
      id,
      group,
      title: id,
      ref: { book: 'ROM', startChapter: 3 },
      note: { text: '', provenance: prov() },
      tags: [],
    });
    const { pinned, groups } = groupKeyPassages([p('1', 'OT'), p('2', 'NT'), p('3', 'OT')], new Set(['2']));
    expect(pinned.map((x) => x.id)).toEqual(['2']);
    expect(groups.map((g) => [g.name, g.items.map((x) => x.id)])).toEqual([['OT', ['1', '3']]]);
  });
});

describe('sources in other languages', () => {
  it('translates group labels, badges, usage policies and places', () => {
    const src = (id: string, type: SourceType): Source => ({
      id,
      type,
      title: id,
      authorIds: [],
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    });
    expect(groupSources([src('a', 'book')], 'es').map((g) => g.label)).toEqual(['Libros']);
    expect(licenseBadge({ status: 'open-license', name: 'CC BY-SA 4.0', usage: 'full-text' }, 'fr').label).toBe('Licence libre · CC BY-SA 4.0');
    expect(licenseBadge({ status: 'public-domain', name: 'Public domain', usage: 'full-text' }, 'pt').label).toBe('Domínio público');
    expect(usagePolicyText('summary-only', 'pt')).toBe('Apenas resumida — o texto não é reproduzido');
    expect(citationPlaceLabel('Key passages', 'fr')).toBe('Passages clés');
  });

  it('translates only the generic wording of license names', () => {
    expect(localizeLicenseName('Public domain', 'es')).toBe('Dominio público');
    expect(localizeLicenseName('Public domain (1887 translation)', 'pt')).toBe('Domínio público (tradução de 1887)');
    expect(localizeLicenseName('Public domain (dataset: CC BY 4.0)', 'fr')).toBe('Domaine public (jeu de données : CC BY 4.0)');
    expect(localizeLicenseName('Public domain (dedicated April 30, 2023)', 'pt')).toBe('Domínio público (dedicado em 30 de abril de 2023)');
    // identifiers, copyright notices and names already in another language are kept as recorded
    expect(localizeLicenseName('CC BY-SA 4.0', 'pt')).toBe('CC BY-SA 4.0');
    expect(localizeLicenseName('© 1973 J. I. Packer', 'fr')).toBe('© 1973 J. I. Packer');
    expect(localizeLicenseName('Domaine public', 'es')).toBe('Domaine public');
    expect(localizeLicenseName('Public domain', 'en')).toBe('Public domain');
  });
});

