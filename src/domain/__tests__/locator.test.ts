import { describe, expect, it } from 'vitest';
import { localizeDates, localizeLocator } from '../locator';

describe('localizeLocator', () => {
  it('leaves English unchanged', () => {
    expect(localizeLocator('sermon on Rom 8:1–4, series “Lessons in Drawing Near”', 'en')).toBe('sermon on Rom 8:1–4, series “Lessons in Drawing Near”');
  });

  it('translates locator words and book abbreviations, keeping quoted titles', () => {
    expect(localizeLocator('sermon on Rom 8:1–4, series “Lessons in Drawing Near”', 'pt')).toBe('sermão sobre Rm 8:1–4, série “Lessons in Drawing Near”');
    expect(localizeLocator('Homily 15, on Rom 8:28', 'es')).toBe('Homilía 15, sobre Ro 8:28');
    expect(localizeLocator('Homily 15, on Rom 8:28', 'fr')).toBe('Homélie 15, sur Rm 8.28');
    expect(localizeLocator('note on Rom 8:14', 'es')).toBe('nota sobre Ro 8:14');
    expect(localizeLocator('Preface to Romans, on chapter 8', 'es')).toBe('Prefacio a Romanos, sobre el capítulo 8');
    expect(localizeLocator('Commentary on Romans, on 8:34', 'pt')).toBe('Comentário sobre Romanos, sobre 8:34');
    expect(localizeLocator('Isa 50:8 (Brenton’s English translation)', 'es')).toBe('Is 50:8 (traducción inglesa de Brenton)');
    expect(localizeLocator('Book 3, ch. 11, §1', 'fr')).toBe('Livre 3, chap. 11, §1');
    expect(localizeLocator('Romans introduction, “Summary”', 'pt')).toBe('Romanos, introdução, “Summary”');
  });

  it('never translates words inside unquoted work titles', () => {
    expect(localizeLocator('Commentary on the Whole Bible, on 2 Cor 4:8–12', 'fr')).toBe('Commentary on the Whole Bible, sur 2 Co 4.8–12');
  });

  it('writes dates in the reader’s language', () => {
    expect(localizeLocator('sermon, 9 Sept 2001', 'pt')).toBe('sermão, 9 de setembro de 2001');
    expect(localizeDates('August 12, 1880', 'es')).toBe('12 de agosto de 1880');
    expect(localizeDates('1997-04-13', 'es')).toBe('13 de abril de 1997');
    expect(localizeDates('June 1998', 'fr')).toBe('juin 1998');
    expect(localizeDates('1 May 1990', 'fr')).toBe('1er mai 1990');
  });
});
