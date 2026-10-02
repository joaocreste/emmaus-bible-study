import { describe, expect, it } from 'vitest';
import { translate } from '../../../i18n/catalog';
import type { Locale } from '../../../i18n/locales';
import { chipLocator, localizeLocator, readerLocator } from '../locator';

const chip = (locator: string, locale: Locale = 'pt') => chipLocator(locator, locale, (key, params) => translate(locale, 'sources', key, params));
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

describe('source chips for readers of other languages: places, not English titles', () => {
  it('keeps chapters, questions, sessions, canons, parts and Bible references, translated', () => {
    expect(chip('Session 24, Canons on the Sacrament of Matrimony, can. 5')).toBe('Sessão 24, cân. 5');
    expect(chip('Session 6, Decree on Justification, ch. 1', 'es')).toBe('Sesión 6, cap. 1');
    expect(chip('ch. 24 §5')).toBe('cap. 24 §5');
    expect(chip('Q. 74 (Part I: On Faith, On the Articles of the Creed)')).toBe('P. 74');
    expect(chip('Head III–IV, Art. 1')).toBe('Capítulo III–IV, Art. 1');
    expect(chip('Part II: The Sacraments, Baptism, §§ Infants Receive the Graces of Baptism')).toBe('Parte II');
    expect(chip('Sermon 1 (on Eph. 2:8), part 1 of 13')).toBe('Sermão 1 (sobre Ef 2:8), parte 1 de 13');
    expect(chip('Decree III (part 1 of 2) (Robertson, pp. 114–116)')).toBe('Decreto III (parte 1 de 2)');
    expect(chip('vol. 9 (1910), s.v. “Sacrament of Marriage”, § Proof of sacramental character')).toBe('vol. 9');
    expect(chip('Harmony of the Evangelists, on Matt 19:3')).toBe('sobre Mt 19:3');
    expect(chip('Ps 22:6 (= Ps 23:6)')).toBe('Sl 22:6 (= Sl 23:6)');
    expect(chip('Malachi 2:13–16')).toBe('Malaquias 2:13–16');
  });

  it('shows nothing when only a title or headword is left, and everything to English readers', () => {
    expect(chip('s.v. Atonement, Day of')).toBeUndefined();
    expect(chip('Opening address (Robertson, pp. 110–111)')).toBeUndefined();
    expect(chip('Session 24, Canons on the Sacrament of Matrimony, can. 5', 'en')).toBe('Session 24, Canons on the Sacrament of Matrimony, can. 5');
  });
});
