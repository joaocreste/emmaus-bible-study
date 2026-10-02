import { describe, expect, it } from 'vitest';
import { translate } from '../../../i18n/catalog';
import type { Locale } from '../../../i18n/locales';
import { localizeLocator, readerLocator } from '../locator';

const loc = (locator: string, locale: Locale = 'pt') => localizeLocator(locator, locale, (key, params) => translate(locale, 'sources', key, params));

describe('citation locators in the reader’s language', () => {
  it('translates a locator that is only a Bible reference, long or short', () => {
    expect(loc('Malachi 2:13–16')).toBe('Malaquias 2:13–16');
    expect(loc('1 Corinthians 7:10–16')).toBe('1 Coríntios 7:10–16');
    expect(loc('Psalm 11:5', 'es')).toMatch(/^Salmo(s)? 11:5$/);
    expect(loc('on Mal 2:16')).toBe('sobre Ml 2:16');
  });

  it('translates the structural words of confession, catechism and dictionary locators, not the source’s own titles', () => {
    expect(loc('ch. 24 §5')).toBe('cap. 24 §5');
    expect(loc('ch. 24 §5', 'fr')).toBe('chap. 24 §5');
    expect(loc('Q. 74 (Part I: On Faith, On the Articles of the Creed)')).toBe('P. 74 (Part I: On Faith, On the Articles of the Creed)');
    expect(loc('Session 24, Canons on the Sacrament of Matrimony, can. 5')).toBe('Sessão 24, Canons on the Sacrament of Matrimony, cân. 5');
    expect(loc('Session 6, Decree on Justification, ch. 1', 'es')).toBe('Sesión 6, Decree on Justification, cap. 1');
    expect(loc('s.v. Aaron, part 1 of 3')).toBe('s.v. Aaron, parte 1 de 3');
    expect(loc('Head III–IV, Art. 1')).toBe('Capítulo III–IV, Art. 1');
    expect(loc('Part II: The Sacraments, Baptism')).toBe('Parte II: The Sacraments, Baptism');
    expect(loc('Sermon 1 (on Eph. 2:8), part 1 of 13')).toBe('Sermão 1 (sobre Ef 2:8), parte 1 de 13');
    expect(loc('Decree III (part 1 of 2) (Robertson, pp. 114–116)')).toBe('Decreto III (parte 1 de 2) (Robertson, pp. 114–116)');
    expect(loc('Preface (part 1 of 5)', 'fr')).toBe('Préface (partie 1 sur 5)');
  });

  it('leaves English readers and unknown shapes as the source gives them', () => {
    expect(loc('Malachi 2:13–16', 'en')).toBe('Malachi 2:13–16');
    expect(loc('ch. 24 §5', 'en')).toBe('ch. 24 §5');
    for (const l of ['s.v. Divorce', 'Ps 22:6 (= Ps 23:6)', 'on the whole book', 'Opening address (Robertson, pp. 110–111)']) expect(loc(l)).toBe(l);
  });
});

describe('lexicon citations by their word, not their Strong’s number', () => {
  it('shows the lemma and transliteration from the citation note', () => {
    expect(readerLocator('G5563', 'χωρίζω (chōrizō, G5563) — “to separate/leave”')).toBe('χωρίζω (chōrizō)');
    expect(readerLocator('H2555', 'חָמָס (cha.mas, H2555) — “violence”')).toBe('חָמָס (cha.mas)');
  });

  it('drops the number when the note does not name the word, and leaves other locators alone', () => {
    expect(readerLocator('G4641', undefined)).toBeUndefined();
    expect(readerLocator('G4641', 'Lexicon entry')).toBeUndefined();
    expect(readerLocator('ch. 24 §5', undefined)).toBe('ch. 24 §5');
    expect(readerLocator(undefined, 'x')).toBeUndefined();
  });
});
