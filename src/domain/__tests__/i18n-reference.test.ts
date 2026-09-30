/**
 * Scripture references in four languages: book names (src/domain/bookNames.ts), parsing,
 * formatting and scanning (src/domain/reference.ts), book lookup (src/domain/books.ts).
 *
 * Reference styles: English "Romans 8:28"; Portuguese and Spanish "Romanos 8:28"; French
 * "Romains 8.28" (a dot between chapter and verse). French writers also use a comma
 * ("Rm 8,28"); that form is not parsed yet — see the todo at the end.
 */
import { describe, expect, it } from 'vitest';
import type { PassageRef } from '../models';
import { BOOK_NAMES, localizedBookName, type NonEnglishLocale } from '../bookNames';
import { BOOKS, bookDisplayName, exactBookToken, findBook, normalizeBookToken } from '../books';
import { findBookMention, findReferences, formatRef, parseReference, refKey } from '../reference';

const LOCALES: NonEnglishLocale[] = ['pt', 'es', 'fr'];
const key = (text: string, locale?: 'en' | NonEnglishLocale) => {
  const r = parseReference(text, { locale });
  return r ? refKey(r) : null;
};
const verse = (book: string, c: number, v: number, v2 = v): PassageRef => ({ book, startChapter: c, startVerse: v, endChapter: c, endVerse: v2 });

describe('book names (pt, es, fr)', () => {
  it.each(LOCALES)('%s: all 66 books have a name and an abbreviation', (locale) => {
    for (const b of BOOKS) {
      const n = BOOK_NAMES[locale][b.id];
      expect(n, `${locale} ${b.id}`).toBeDefined();
      expect(n!.name.length).toBeGreaterThan(1);
      expect(n!.abbrev.length).toBeGreaterThan(0);
      expect(localizedBookName(b.id, locale)).toBe(n);
      if (b.id !== 'PSA') expect(n!.singular).toBeUndefined();
    }
    expect(Object.keys(BOOK_NAMES[locale])).toHaveLength(66);
    expect(BOOK_NAMES[locale].PSA?.singular).toBeTruthy();
  });

  it('uses the names printed by each language’s default version (BLIVRE, RVR1909, LSG)', () => {
    const pick = (locale: NonEnglishLocale, ids: string[]) => ids.map((id) => BOOK_NAMES[locale][id]!.name);
    expect(pick('pt', ['GEN', 'EXO', 'JOB', 'PSA', 'SNG', 'ACT', 'ROM', '1CO', 'PHM', 'REV'])).toEqual([
      'Gênesis', 'Êxodo', 'Jó', 'Salmos', 'Cantares', 'Atos', 'Romanos', '1 Coríntios', 'Filemom', 'Apocalipse',
    ]);
    expect(pick('es', ['GEN', 'EXO', 'PSA', 'SNG', 'JHN', 'ACT', 'ROM', '1CO', 'JAS', 'REV'])).toEqual([
      'Génesis', 'Éxodo', 'Salmos', 'Cantar de los Cantares', 'Juan', 'Hechos', 'Romanos', '1 Corintios', 'Santiago', 'Apocalipsis',
    ]);
    expect(pick('fr', ['GEN', 'PSA', 'ECC', 'SNG', 'ISA', 'JHN', 'ACT', 'ROM', '1CO', 'REV'])).toEqual([
      'Genèse', 'Psaumes', 'Ecclésiaste', 'Cantique des Cantiques', 'Ésaïe', 'Jean', 'Actes', 'Romains', '1 Corinthiens', 'Apocalypse',
    ]);
    expect([BOOK_NAMES.pt.PSA!.singular, BOOK_NAMES.es.PSA!.singular, BOOK_NAMES.fr.PSA!.singular]).toEqual(['Salmo', 'Salmo', 'Psaume']);
  });

  it('abbreviations follow each language’s usual style', () => {
    const abbrevs = (locale: NonEnglishLocale, ids: string[]) => ids.map((id) => BOOK_NAMES[locale][id]!.abbrev).join(' ');
    const ids = ['GEN', 'EXO', '1SA', 'JOB', 'PSA', 'ISA', 'JON', 'MRK', 'JHN', 'ACT', 'ROM', '1CO', 'HEB', 'JAS', '1JN', 'REV'];
    expect(abbrevs('pt', ids)).toBe('Gn Êx 1Sm Jó Sl Is Jn Mc Jo At Rm 1Co Hb Tg 1Jo Ap');
    expect(abbrevs('es', ids)).toBe('Gn Éx 1 S Job Sal Is Jon Mc Jn Hch Ro 1 Co Heb Stg 1 Jn Ap');
    expect(abbrevs('fr', ids)).toBe('Gn Ex 1 S Jb Ps Es Jon Mc Jn Ac Rm 1 Co He Jc 1 Jn Ap');
  });

  it.each(LOCALES)('%s: no typed form points to two books (except accent-distinguished pairs)', (locale) => {
    const exact = new Map<string, Set<string>>();
    const folded = new Map<string, Set<string>>();
    for (const b of BOOKS) {
      const n = BOOK_NAMES[locale][b.id]!;
      for (const form of [n.name, n.abbrev, ...(n.singular ? [n.singular] : []), ...n.aliases]) {
        (exact.get(exactBookToken(form)) ?? exact.set(exactBookToken(form), new Set()).get(exactBookToken(form))!).add(b.id);
        (folded.get(normalizeBookToken(form)) ?? folded.set(normalizeBookToken(form), new Set()).get(normalizeBookToken(form))!).add(b.id);
      }
    }
    const clashes = (m: Map<string, Set<string>>) => [...m].filter(([, ids]) => ids.size > 1).map(([k, ids]) => `${k}:${[...ids].join('/')}`);
    expect(clashes(exact)).toEqual([]);
    // "Is"/"Isa" (Isaiah) fold like "1 S"/"1Sa" (normalizeBookToken reads a leading "i" as the ordinal I);
    // Portuguese "Jó"/"Jo" differ only by the accent. Accent-exact matches decide both (tested below).
    const allowed = new Set(['1s:1SA/ISA', '1sa:1SA/ISA', 'jo:JOB/JHN']);
    expect(clashes(folded).filter((c) => !allowed.has(c))).toEqual([]);
  });

  it('findBook resolves localized names, abbreviations and accent-less forms', () => {
    expect(findBook('Romanos', 'pt')?.id).toBe('ROM');
    expect(findBook('Gênesis', 'pt')?.id).toBe('GEN');
    expect(findBook('genesis', 'pt')?.id).toBe('GEN');
    expect(findBook('Êx', 'pt')?.id).toBe('EXO');
    expect(findBook('Deuteronomio', 'pt')?.id).toBe('DEU');
    expect(findBook('Cântico dos Cânticos', 'pt')?.id).toBe('SNG');
    expect(findBook('Canção de Salomão', 'pt')?.id).toBe('SNG');
    expect(findBook('Hechos', 'es')?.id).toBe('ACT');
    expect(findBook('San Mateo', 'es')?.id).toBe('MAT');
    expect(findBook('Stg', 'es')?.id).toBe('JAS');
    expect(findBook('Apocalipsis', 'es')?.id).toBe('REV');
    expect(findBook('Ésaïe', 'fr')?.id).toBe('ISA');
    expect(findBook('Isaïe', 'fr')?.id).toBe('ISA');
    expect(findBook('Qohélet', 'fr')?.id).toBe('ECC');
    expect(findBook('Épître aux Romains', 'fr')?.id).toBe('ROM');
    expect(findBook('Evangile selon Jean', 'fr')?.id).toBe('JHN');
  });

  it('the same short form means different books in different languages', () => {
    // pt "Jn" = Jonas; es/fr "Jn" = Juan/Jean; English "Jn" = John
    expect(findBook('Jn', 'pt')?.id).toBe('JON');
    expect(findBook('Jn', 'es')?.id).toBe('JHN');
    expect(findBook('Jn', 'fr')?.id).toBe('JHN');
    expect(findBook('Jn')?.id).toBe('JHN');
    expect(findBook('Jon', 'es')?.id).toBe('JON');
    // fr "Es" = Ésaïe; English "Es" = Esther
    expect(findBook('Es', 'fr')?.id).toBe('ISA');
    expect(findBook('Est', 'fr')?.id).toBe('EST');
    expect(findBook('Es')?.id).toBe('EST');
    // pt/es/fr "Ez" = Ezequiel/Ézéchiel; English "Ez" = Ezra
    expect(findBook('Ez', 'pt')?.id).toBe('EZK');
    expect(findBook('Ez')?.id).toBe('EZR');
    // "Mc" = Marcos/Marc; English "Mc" = Micah
    expect(findBook('Mc', 'es')?.id).toBe('MRK');
    expect(findBook('Mc', 'fr')?.id).toBe('MRK');
    expect(findBook('Mc')?.id).toBe('MIC');
    // Portuguese: "Jó" (Job) vs "Jo" (João), by the accent
    expect(findBook('Jó', 'pt')?.id).toBe('JOB');
    expect(findBook('JÓ', 'pt')?.id).toBe('JOB');
    expect(findBook('Jo', 'pt')?.id).toBe('JHN');
    expect(findBook('jo', 'pt')?.id).toBe('JHN');
    expect(findBook('Is', 'pt')?.id).toBe('ISA');
    expect(findBook('1 S', 'es')?.id).toBe('1SA');
  });

  it('bookDisplayName', () => {
    expect(bookDisplayName('ROM', 'pt')).toBe('Romanos');
    expect(bookDisplayName('ROM', 'fr', 'short')).toBe('Rm');
    expect(bookDisplayName('ROM', 'es', 'short')).toBe('Ro');
    expect(bookDisplayName('1CO', 'pt', 'short')).toBe('1Co');
    expect(bookDisplayName('JHN', 'fr')).toBe('Jean');
    expect(bookDisplayName('ROM')).toBe('Romans');
    expect(bookDisplayName('ROM', 'en', 'short')).toBe('Rom');
  });
});

describe('parseReference in four languages', () => {
  it('Portuguese', () => {
    expect(key('Romanos 8:28', 'pt')).toBe('ROM.8.28');
    expect(key('1 Coríntios 13:4-7', 'pt')).toBe('1CO.13.4-7');
    expect(key('1 Coríntios 13:4–7', 'pt')).toBe('1CO.13.4-7');
    expect(key('1ª Coríntios 13', 'pt')).toBe('1CO.13');
    expect(key('Primeira Coríntios 13', 'pt')).toBe('1CO.13');
    expect(key('1Co 13:4', 'pt')).toBe('1CO.13.4');
    expect(key('Jó 1', 'pt')).toBe('JOB.1');
    expect(key('Jo 3:16', 'pt')).toBe('JHN.3.16');
    expect(key('1 Jo 4:8', 'pt')).toBe('1JN.4.8');
    expect(key('Salmo 23', 'pt')).toBe('PSA.23');
    expect(key('Salmos 23', 'pt')).toBe('PSA.23');
    expect(key('Sl 23:1', 'pt')).toBe('PSA.23.1');
    expect(key('Cântico dos Cânticos 2', 'pt')).toBe('SNG.2');
    expect(key('Apocalipse 21', 'pt')).toBe('REV.21');
    expect(key('Atos 2', 'pt')).toBe('ACT.2');
    expect(key('Gênesis', 'pt')).toBe('GEN');
    expect(key('Genesis 1', 'pt')).toBe('GEN.1');
    expect(key('2 Reis 5', 'pt')).toBe('2KI.5');
    expect(key('1Rs 3', 'pt')).toBe('1KI.3');
    expect(key('Judas 3', 'pt')).toBe('JUD.1.3');
    expect(key('estudar Romanos 8', 'pt')).toBe('ROM.8');
    expect(key('Quero estudar João 1', 'pt')).toBe('JHN.1');
    expect(key('o livro de Romanos', 'pt')).toBe('ROM');
    expect(key('Mateus 5–7', 'pt')).toBe('MAT.5-7');
    expect(key('João 1:1–2:11', 'pt')).toBe('JHN.1.1-2.11');
  });

  it('Spanish', () => {
    expect(key('Romanos 8:28', 'es')).toBe('ROM.8.28');
    expect(key('Primera de Corintios 13', 'es')).toBe('1CO.13');
    expect(key('1 Corintios 13:4-7', 'es')).toBe('1CO.13.4-7');
    expect(key('I Corintios 13', 'es')).toBe('1CO.13');
    expect(key('Salmo 23', 'es')).toBe('PSA.23');
    expect(key('Salmos 23', 'es')).toBe('PSA.23');
    expect(key('Sal 23', 'es')).toBe('PSA.23');
    expect(key('Cantares 2', 'es')).toBe('SNG.2');
    expect(key('Cantar de los Cantares 2', 'es')).toBe('SNG.2');
    expect(key('Hechos 2', 'es')).toBe('ACT.2');
    expect(key('Juan 3:16', 'es')).toBe('JHN.3.16');
    expect(key('Jn 3:16', 'es')).toBe('JHN.3.16');
    expect(key('Jon 1', 'es')).toBe('JON.1');
    expect(key('Santiago 2', 'es')).toBe('JAS.2');
    expect(key('Apocalipsis 21', 'es')).toBe('REV.21');
    expect(key('Génesis', 'es')).toBe('GEN');
    expect(key('estudiar Juan 3:16', 'es')).toBe('JHN.3.16');
    expect(key('el libro de Job', 'es')).toBe('JOB');
  });

  it('French', () => {
    expect(key('Romains 8.28', 'fr')).toBe('ROM.8.28');
    expect(key('Romains 8:28', 'fr')).toBe('ROM.8.28');
    expect(key('Rm 8.28', 'fr')).toBe('ROM.8.28');
    expect(key('1re épître aux Corinthiens 13', 'fr')).toBe('1CO.13');
    expect(key('Première épître aux Corinthiens 13', 'fr')).toBe('1CO.13');
    expect(key('1 Co 13.4-7', 'fr')).toBe('1CO.13.4-7');
    expect(key('Psaume 23', 'fr')).toBe('PSA.23');
    expect(key('Psaumes 23', 'fr')).toBe('PSA.23');
    expect(key('Cantique des Cantiques 2', 'fr')).toBe('SNG.2');
    expect(key('Actes 2', 'fr')).toBe('ACT.2');
    expect(key('Jean 3.16', 'fr')).toBe('JHN.3.16');
    expect(key('Jn 3.16', 'fr')).toBe('JHN.3.16');
    expect(key('Ésaïe 53', 'fr')).toBe('ISA.53');
    expect(key('Esaie 53', 'fr')).toBe('ISA.53');
    expect(key('Es 53', 'fr')).toBe('ISA.53');
    expect(key('Genèse', 'fr')).toBe('GEN');
    expect(key('Apocalypse 21', 'fr')).toBe('REV.21');
    expect(key('étudier Jean 1', 'fr')).toBe('JHN.1');
    expect(key('le livre de Job', 'fr')).toBe('JOB');
  });

  it('names typed in another language still resolve (no locale, or a different one)', () => {
    expect(key('Cantares 2')).toBe('SNG.2');
    expect(key('Apocalipse 21')).toBe('REV.21');
    expect(key('Hechos 2')).toBe('ACT.2');
    expect(key('Actes 2')).toBe('ACT.2');
    expect(key('Atos 2')).toBe('ACT.2');
    expect(key('Gênesis')).toBe('GEN');
    expect(key('Jó 1')).toBe('JOB.1');
    expect(key('Romains 8.28', 'es')).toBe('ROM.8.28');
    expect(key('Romanos 8:28', 'fr')).toBe('ROM.8.28');
  });

  it('English behaviour is unchanged', () => {
    expect(key('Romans 8:28')).toBe('ROM.8.28');
    expect(key('Romans 8:28', 'en')).toBe('ROM.8.28');
    expect(key('John 3:16')).toBe('JHN.3.16');
    expect(key('Jn 3:16')).toBe('JHN.3.16');
    expect(key('Psalm 23')).toBe('PSA.23');
    expect(key('1 Cor 13:4-7')).toBe('1CO.13.4-7');
    expect(key('Song of Songs 2')).toBe('SNG.2');
    expect(key('study Romans 8')).toBe('ROM.8');
    expect(key('Genesis')).toBe('GEN');
    expect(key('Rom 8.28')).toBe('ROM.8.28');
  });
});

describe('formatRef in four languages', () => {
  it('long and short forms', () => {
    const r = verse('ROM', 8, 28);
    expect(formatRef(r, 'long', 'pt')).toBe('Romanos 8:28');
    expect(formatRef(r, 'long', 'es')).toBe('Romanos 8:28');
    expect(formatRef(r, 'long', 'fr')).toBe('Romains 8.28');
    expect(formatRef(r, 'long', 'en')).toBe('Romans 8:28');
    expect(formatRef(r, 'short', 'pt')).toBe('Rm 8:28');
    expect(formatRef(r, 'short', 'es')).toBe('Ro 8:28');
    expect(formatRef(r, 'short', 'fr')).toBe('Rm 8.28');
    expect(formatRef(verse('JHN', 3, 16), 'long', 'fr')).toBe('Jean 3.16');
    expect(formatRef(verse('JHN', 3, 16), 'long', 'pt')).toBe('João 3:16');
    expect(formatRef(verse('JHN', 3, 16), 'long', 'es')).toBe('Juan 3:16');
  });

  it('ranges, chapters, whole books and single-chapter books', () => {
    expect(formatRef(verse('1CO', 13, 4, 7), 'long', 'pt')).toBe('1 Coríntios 13:4–7');
    expect(formatRef(verse('1CO', 13, 4, 7), 'short', 'pt')).toBe('1Co 13:4–7');
    expect(formatRef(verse('1CO', 13, 4, 7), 'long', 'fr')).toBe('1 Corinthiens 13.4–7');
    expect(formatRef({ book: 'JHN', startChapter: 1, startVerse: 1, endChapter: 2, endVerse: 11 }, 'long', 'fr')).toBe('Jean 1.1–2.11');
    expect(formatRef({ book: 'MAT', startChapter: 5, endChapter: 7 }, 'long', 'es')).toBe('Mateo 5–7');
    expect(formatRef({ book: 'ROM', startChapter: 8 }, 'long', 'pt')).toBe('Romanos 8');
    expect(formatRef({ book: 'GEN', startChapter: 1, endChapter: 50 }, 'long', 'pt')).toBe('Gênesis');
    expect(formatRef({ book: 'GEN', startChapter: 1, endChapter: 50 }, 'long', 'fr')).toBe('Genèse');
    expect(formatRef(verse('JUD', 1, 3), 'long', 'pt')).toBe('Judas 3');
    expect(formatRef(verse('PHM', 1, 4, 6), 'long', 'fr')).toBe('Philémon 4–6');
  });

  it('one psalm takes the singular; several keep the plural', () => {
    expect(formatRef({ book: 'PSA', startChapter: 23 }, 'long', 'pt')).toBe('Salmo 23');
    expect(formatRef({ book: 'PSA', startChapter: 23 }, 'long', 'es')).toBe('Salmo 23');
    expect(formatRef({ book: 'PSA', startChapter: 23 }, 'long', 'fr')).toBe('Psaume 23');
    expect(formatRef(verse('PSA', 23, 1), 'long', 'fr')).toBe('Psaume 23.1');
    expect(formatRef({ book: 'PSA', startChapter: 1, endChapter: 2 }, 'long', 'pt')).toBe('Salmos 1–2');
    expect(formatRef({ book: 'PSA', startChapter: 23 }, 'short', 'pt')).toBe('Sl 23');
    expect(formatRef({ book: 'PSA', startChapter: 23 }, 'long', 'en')).toBe('Psalm 23');
  });

  it('formatted references parse back in the same language', () => {
    const refs: PassageRef[] = [verse('ROM', 8, 28), verse('1CO', 13, 4, 7), { book: 'PSA', startChapter: 23 }, verse('JOB', 19, 25), verse('JHN', 3, 16), verse('JON', 2, 1), verse('SNG', 2, 4), verse('REV', 21, 1, 4)];
    for (const locale of LOCALES) {
      for (const r of refs) {
        for (const style of ['long', 'short'] as const) {
          const text = formatRef(r, style, locale);
          expect(key(text, locale), `${locale} ${style} "${text}"`).toBe(refKey(r));
        }
      }
    }
  });
});

describe('findReferences and findBookMention in four languages', () => {
  const found = (text: string, locale?: NonEnglishLocale) => findReferences(text, { locale }).map((f) => `${refKey(f.ref)}|${f.match}`);

  it('finds references inside sentences', () => {
    expect(found('Como isso se relaciona com Romanos 5:1?', 'pt')).toEqual(['ROM.5.1|Romanos 5:1']);
    expect(found('¿Cómo se conecta con Romanos 5:1?', 'es')).toEqual(['ROM.5.1|Romanos 5:1']);
    expect(found('Quel lien avec Romains 5.1 ?', 'fr')).toEqual(['ROM.5.1|Romains 5.1']);
    expect(found('Compare Jo 3:16 com 1 Jo 4:8 e Jó 19:25', 'pt')).toEqual(['JHN.3.16|Jo 3:16', '1JN.4.8|1 Jo 4:8', 'JOB.19.25|Jó 19:25']);
    expect(found('Lisez 1 Jn 4.8 et Jn 3.16', 'fr')).toEqual(['1JN.4.8|1 Jn 4.8', 'JHN.3.16|Jn 3.16']);
    expect(found('Compara Jn 3:16 con Jon 2', 'es')).toEqual(['JHN.3.16|Jn 3:16', 'JON.2|Jon 2']);
    expect(found('Veja também Cântico dos Cânticos 2:4', 'pt')).toEqual(['SNG.2.4|Cântico dos Cânticos 2:4']);
    expect(findReferences('How does this connect with Romans 5:1?').map((f) => refKey(f.ref))).toEqual(['ROM.5.1']);
  });

  it('short lowercase words in prose are not taken for books', () => {
    // pt "os" (Oseias: Os), "na" (Naum: Na) — articles/prepositions before a number
    expect(found('Leia os 3 primeiros versículos', 'pt')).toEqual([]);
    expect(found('Está na 2 parte', 'pt')).toEqual([]);
  });

  it('detects whole-book mentions by full name', () => {
    expect(findBookMention('Quero estudar Gênesis', 'pt')?.book).toBe('GEN');
    expect(findBookMention('Háblame de Hechos', 'es')?.book).toBe('ACT');
    expect(findBookMention('Parlez-moi de l’Apocalypse', 'fr')?.book).toBe('REV');
    expect(findBookMention('Vamos ler os Salmos', 'pt')?.book).toBe('PSA');
    expect(findBookMention('Tell me about Genesis')?.book).toBe('GEN');
  });
});

describe('integration regressions', () => {
  it('reads comma-separated chapter,verse outside English', () => {
    expect(refKey(parseReference('Rm 8,28', { locale: 'fr' })!)).toBe('ROM.8.28');
    expect(refKey(parseReference('Rm 8,28-30', { locale: 'pt' })!)).toBe('ROM.8.28-30');
    expect(findReferences('Voir Romains 8,28 et Jean 3,16.', { locale: 'fr' }).map((f) => refKey(f.ref))).toEqual(['ROM.8.28', 'JHN.3.16']);
  });
  it('keeps English lookups English (no cross-language false positives)', () => {
    expect(refKey(parseReference('Is 53')!)).toBe('ISA.53');
    expect(refKey(parseReference('I Samuel 3')!)).toBe('1SA.3');
    expect(findBookMention('I asked Lucas and Tito about Judas Priest', 'en')).toBeNull();
    expect(findReferences('At 2 we met; So 3 people came; He 4').length).toBe(0);
    // a full name in another language still works when typed on its own
    expect(refKey(parseReference('Romanos 8')!)).toBe('ROM.8');
  });
});
