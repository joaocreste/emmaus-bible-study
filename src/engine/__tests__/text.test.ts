import { describe, expect, it } from 'vitest';
import { cleanMarkup, excerpt, phraseScore, stem } from '../text';

describe('stem — both sides of a comparison meet', () => {
  const pairs: [string, string][] = [
    ['love', 'loved'],
    ['love', 'loving'],
    ['create', 'created'],
    ['predestine', 'predestined'],
    ['sin', 'sinned'],
    ['sin', 'sinning'],
    ['hope', 'hoped'],
    ['cry', 'cried'],
    ['prayer', 'prayers'],
    ['condemn', 'condemned'],
    ['neighbour', 'neighbor'],
    ['honour', 'honored'],
  ];
  for (const [a, b] of pairs) it(`${a} ~ ${b}`, () => expect(stem(a)).toBe(stem(b)));

  it('keeps double letters that belong to the word and short words', () => {
    expect(stem('called')).toBe('call');
    expect(stem('blessed')).toBe('bless');
    expect(stem('free')).toBe('free');
    expect(stem('three')).toBe('three');
    expect(stem('the')).toBe('the');
    expect(stem('one')).toBe('one');
  });

  it('makes inflections score as the same phrase', () => {
    expect(phraseScore('predestine', 'predestined')).toBeGreaterThanOrEqual(0.95);
  });
});

describe('excerpt', () => {
  it('does not end a sentence at an abbreviation', () => {
    const text =
      'Weaving together lines from the Psalms and Isaiah (e.g. Ps 14:1–3; Isa 59:7–8), Paul concludes that all are under sin. A second sentence that pushes the text past the limit of words allowed here.';
    expect(excerpt(text, 25)).toBe('Weaving together lines from the Psalms and Isaiah (e.g. Ps 14:1–3; Isa 59:7–8), Paul concludes that all are under sin.');
  });
});

describe('cleanMarkup', () => {
  it('decodes &amp; last, so an escaped entity stays text', () => {
    expect(cleanMarkup('a &amp;lt; b')).toBe('a &lt; b');
    expect(cleanMarkup('<b>law</b>, custom<br/>the Mosaic law')).toBe('law, custom the Mosaic law');
  });
});

describe('excerpt in other languages', () => {
  it('does not cut at chapter.verse or common abbreviations', async () => {
    const { excerpt } = await import('../text');
    expect(excerpt('Paul écrit en Romains 8.28 que tout concourt au bien. Deuxième phrase très longue ici pour dépasser la limite.', 12)).toBe(
      'Paul écrit en Romains 8.28 que tout concourt au bien.',
    );
    expect(excerpt('Escrita por volta de 57 d.C. em Corinto, a carta chega a Roma. Outra frase longa para ultrapassar o limite de palavras.', 14)).toBe(
      'Escrita por volta de 57 d.C. em Corinto, a carta chega a Roma.',
    );
    expect(excerpt('Vers 57 apr. J.-C., Paul écrit depuis Corinthe. Une autre phrase assez longue pour dépasser la limite.', 9)).toBe(
      'Vers 57 apr. J.-C., Paul écrit depuis Corinthe.',
    );
  });
});
