import { describe, expect, it } from 'vitest';
import type { CuratedStudy } from '../../../domain/models';
import { BIBLE_VERSIONS } from '../../../domain/translations';
import type { TopicMatch } from '../../../providers/types';
import { searchPalette, type PaletteData } from '../commandSearch';
import { groupTranslations } from '../translationGroups';

const prov = { kind: 'synthesis' as const, verification: 'editorial' as const, citations: [] };

// What the providers hand the palette in Portuguese: localized names, aliases in both languages.
const graca: TopicMatch = {
  id: 'grace',
  name: 'Graça',
  aliases: ['graça', 'favor imerecido', 'grace'],
  topic: { name: 'Graça', definition: { text: 'x', provenance: prov }, keyPassages: [] },
  score: 1,
};
const romanos = {
  id: 'romans-8',
  kind: 'passage',
  title: 'Romanos 8',
  subtitle: 'A vida no Espírito',
  keyWords: [],
  match: { references: [], topics: ['adoção'] },
} as unknown as CuratedStudy;

const data: PaletteData = { studies: [romanos], topics: [graca], authors: [] };
const ids = (q: string) => searchPalette(q, data, 'pt').flatMap((g) => g.items.map((i) => i.id));

describe('searchPalette — Portuguese', () => {
  it('writes group labels and rows in the reader’s language', () => {
    const empty = searchPalette('', data, 'pt');
    expect(empty.map((g) => g.id)).toEqual(['studies', 'topics']);
    expect(empty[0].items[0].subtitle).toBe('Estudo de passagem · A vida no Espírito');
    const groups = searchPalette('por que sofremos', data, 'pt');
    expect(groups.at(-1)).toMatchObject({ label: 'Perguntar', items: [{ title: 'Perguntar ao Emmaus: por que sofremos', subtitle: 'Enviar para a conversa' }] });
  });

  it('finds localized topic names and aliases (accents optional)', () => {
    expect(ids('graca')).toContain('topic:grace');
    expect(ids('imerecido')).toContain('topic:grace');
    expect(ids('adocao')).toContain('study:romans-8');
  });

  it('opens a reference typed in the reader’s language, named in it', () => {
    const groups = searchPalette('Romanos 8:28', data, 'pt');
    expect(groups[0].id).toBe('passage');
    expect(groups[0].items[0].action).toEqual({
      kind: 'open-passage',
      passage: { book: 'ROM', startChapter: 8, startVerse: 28, endChapter: 8, endVerse: 28 },
    });
    expect(groups[0].items[0].title).toBe('Abrir Romanos 8:28');
  });

  it('opens a French reference with the French verse separator', () => {
    const groups = searchPalette('Romains 8.28', data, 'fr');
    expect(groups[0].items[0].title).toBe('Ouvrir Romains 8.28');
  });

  it('still understands an English reference in another language', () => {
    expect(searchPalette('John 3:16', data, 'es')[0].items[0].action).toMatchObject({ kind: 'open-passage', passage: { book: 'JHN' } });
  });
});

describe('translation select order', () => {
  const all = BIBLE_VERSIONS.map((v) => ({ id: v.id, name: v.name, shortName: v.shortName }));

  it('lists the reader’s language first (its default leading), then the others by language', () => {
    const { own, other } = groupTranslations(all, 'pt');
    expect(own.map((v) => v.id)).toEqual(['BLIVRE', 'NBV', 'BPM']);
    expect(other.map((v) => v.id)).toEqual(['BSB', 'KJV', 'WEB', 'RVR1909', 'BLM', 'VBL', 'LSG', 'DARBY', 'NCL', 'OST']);
  });

  it('offers at least three versions in every language', () => {
    for (const locale of ['en', 'pt', 'es', 'fr'] as const) expect(groupTranslations(all, locale).own.length).toBeGreaterThanOrEqual(3);
  });
});
