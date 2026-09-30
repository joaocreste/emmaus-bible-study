import { describe, expect, it } from 'vitest';
import { excerpt } from '../text';

describe('excerpt', () => {
  it('does not end a sentence at a name’s initials', () => {
    const text =
      'Escrito tras la muerte de su esposa y publicado primero bajo el seudónimo de N. W. Clerk, A Grief Observed registra el duelo. Luego sigue otra frase larga con muchas palabras para superar el límite.';
    expect(excerpt(text, 30)).toBe('Escrito tras la muerte de su esposa y publicado primero bajo el seudónimo de N. W. Clerk, A Grief Observed registra el duelo.');
  });
});
