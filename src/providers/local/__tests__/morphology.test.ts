import { describe, expect, it } from 'vitest';
import { describeGreekMorph, describeHebrewMorph, describeLexiconMorph, describeMorph } from '../morphology';

describe('describeGreekMorph (TAGNT)', () => {
  it.each([
    ['N-NSF', 'Noun, nominative singular feminine'],
    ['N-DSF', 'Noun, dative singular feminine'],
    ['A-NSN', 'Adjective, nominative singular neuter'],
    ['T-NSM', 'Article, nominative singular masculine'],
    ['V-AAI-3S', 'Verb, aorist active indicative, 3rd person singular'],
    ['V-IAI-3S', 'Verb, imperfect active indicative, 3rd person singular'],
    ['V-PAP-NSM', 'Verb, present active participle, nominative singular masculine'],
    ['V-2AAI-3P', 'Verb, second aorist active indicative, 3rd person plural'],
    ['V-AAN', 'Verb, aorist active infinitive'],
    ['V-RPP-NPM', 'Verb, perfect passive participle, nominative plural masculine'],
    ['V-PNI-3S', 'Verb, present middle or passive deponent indicative, 3rd person singular'],
    ['P-1AS', 'Personal pronoun, 1st person accusative singular'],
    ['P-GSM', 'Personal pronoun, genitive singular masculine'],
    ['S-1SASF', 'Possessive pronoun, 1st person singular possessor, accusative singular feminine'],
    ['PREP', 'Preposition'],
    ['CONJ', 'Conjunction'],
    ['PRT-N', 'Particle (negative)'],
    ['ADV-I', 'Adverb (interrogative)'],
  ])('%s → %s', (code, expected) => {
    expect(describeGreekMorph(code)).toBe(expected);
  });

  it('describes name qualifiers', () => {
    expect(describeGreekMorph('N-GSM-P')).toBe('Noun, genitive singular masculine (personal name)');
    expect(describeGreekMorph('N-GSM-T')).toBe('Noun, genitive singular masculine (title)');
    expect(describeGreekMorph('A-NSM-C')).toBe('Adjective, nominative singular masculine (comparative)');
    expect(describeGreekMorph('N-PRI')).toBe('Noun (indeclinable proper noun)');
  });

  it('returns undefined for unknown codes', () => {
    expect(describeGreekMorph('')).toBeUndefined();
    expect(describeGreekMorph('ZZZ')).toBeUndefined();
  });
});

describe('describeHebrewMorph (TAHOT)', () => {
  it.each([
    ['HNcmsa', 'Noun, masculine singular absolute'],
    ['HNcfsc', 'Noun, feminine singular construct'],
    ['HVqp3ms', 'Verb, Qal perfect, 3rd person masculine singular'],
    ['HVqi1cs', 'Verb, Qal imperfect, 1st person common singular'],
    ['HVqw3ms', 'Verb, Qal consecutive imperfect (wayyiqtol), 3rd person masculine singular'],
    ['HVhi3ms', 'Verb, Hiphil imperfect, 3rd person masculine singular'],
    ['HVNp3ms', 'Verb, Niphal perfect, 3rd person masculine singular'],
    ['HVpi3ms', 'Verb, Piel imperfect, 3rd person masculine singular'],
    ['HVqaa', 'Verb, Qal infinitive absolute'],
    ['HVqcc', 'Verb, Qal infinitive construct'],
    ['HNpt', 'Proper noun (title)'],
    ['HNpm', 'Proper noun (masculine)'],
    ['HTn', 'Negative particle'],
    ['HTo', 'Direct object marker'],
  ])('%s → %s', (code, expected) => {
    expect(describeHebrewMorph(code)).toBe(expected);
  });

  it('joins prefixes and suffixes with "+"', () => {
    expect(describeHebrewMorph('HR/Ncmsa')).toBe('Preposition + noun, masculine singular absolute');
    expect(describeHebrewMorph('HC/Vqw3ms')).toBe('Conjunction + verb, Qal consecutive imperfect (wayyiqtol), 3rd person masculine singular');
    expect(describeHebrewMorph('HVqrmsc/Sp1bs')).toBe(
      'Verb, Qal participle, masculine singular construct + pronominal suffix, 1st person common singular',
    );
    expect(describeHebrewMorph('HTd/Ncmsa')).toBe('Definite article + noun, masculine singular absolute');
  });

  it('uses Aramaic stem names for Aramaic codes', () => {
    expect(describeHebrewMorph('AVqv2ms')).toBe('Verb, Peal imperative, 2nd person masculine singular');
    expect(describeHebrewMorph('ANcbsd/Ta')).toBe('Noun, common singular determined + definite article');
  });

  it('dispatches by language', () => {
    expect(describeMorph('N-NSF', 'greek')).toBe('Noun, nominative singular feminine');
    expect(describeMorph('HNcmsa', 'hebrew')).toBe('Noun, masculine singular absolute');
    expect(describeMorph(undefined, 'hebrew')).toBeUndefined();
    expect(describeHebrewMorph('N-NSF')).toBeUndefined();
  });
});

describe('describeLexiconMorph', () => {
  it('reads the brief lexicon codes', () => {
    expect(describeLexiconMorph('G:N-N')).toBe('Noun (neuter)');
    expect(describeLexiconMorph('H:V')).toBe('Verb');
    expect(describeLexiconMorph('N:N-M-P')).toBe('Proper noun (masculine, person)');
    expect(describeLexiconMorph('A:N')).toBe('Aramaic noun');
    expect(describeLexiconMorph('G:N-F / N:N--T')).toBe('Noun (feminine) or Proper noun (title)');
  });
});

describe('crasis', () => {
  it('describes merged words part by part', () => {
    expect(describeGreekMorph('CONJ + COND')).toBe('Conjunction + Conditional conjunction');
    expect(describeGreekMorph('CONJ + G1565=D-NSM')).toBe('Conjunction + Demonstrative pronoun, nominative singular masculine');
  });
});
