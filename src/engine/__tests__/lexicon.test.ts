/**
 * Lexicon helpers. The definitions below are shaped like the bundled STEPBible
 * entries (TBESG from Abbott-Smith; TBESH in BDB-style outline) — the parser
 * must keep the senses and drop the apparatus.
 */
import { describe, expect, it } from 'vitest';
import { displayGloss, entryMatches, glossMatches, isContentWord, isProperName, lexiconSenses, senseSummary } from '../lexicon';

const KOSMOS =
  'κόσμος, -ου, ὁ\n[in LXX: Gen 2:1, Deu 4:19; 17:3, Isa 24:21; 40:26 (צבא), al;]\n1. order (Hom., Plat., al.).\n2. ornament, adornment, esp. of women (Hom., al.): 1Pe 3:3.\n3. Later, the world or universe, as an ordered system (Plat., al.): Act 17:24, Rom 4:13, 1Co 3:22.';
const OUDEIS =
  'οὐδείς, -δεμία, -δέν (also in WH, txt., the Hellenistic forms -θείς, -θέν, Luk 22:35; cf. BL, §6, 7; M, Pr., 56n, Thackeray, Gr., 58), related to μηδείς as οὐ to μή,\nno, no one, none: with nouns, Luk 4:24, Jhn 10:41, Rom 8:1, al.';
const MERIMNAO = 'μεριμνάω, -ῶ\n(μέριμνα), [in LXX: Psa 38:18 (דָּאַג), etc.;]\n1. to be anxious: absol., Mat 6:27, 31, Luk 12:25.\n2. to care for: with accusative, τὰ τ. κυριου, 1Co 7:32-34.';
const SARX = 'σάρξ, σαρκός, ἡ\n[in LXX chiefly for בָּשָׂר;]\nflesh;\n1. as in cl. generally,\n(a) prop., of the soft substance of the animal body: 1Co 15:39, 2Co 12:7, al.;\n(b) Of the whole substance of the body, = σῶμα: Act 2:26.';
const ECHAD = '1) one (number)\n1a) one (number)\n1b) each, every\n1c) a certain\n1d) an (indefinite article)';
const SKEUOS = 'σκεῦος, -ους, τό\n[in LXX chiefly for כְּלִי;]\na vessel, implement (for exx. in various senses, see MM, xxii): Mrk 11:16, Luk 8:16.†\nκτάομαι, -ῶμαι\n[in LXX chiefly for קנה;]\nin pres., impf., fut. and aor., to procure for oneself, get, gain, acquire: Luk 18:12.';

describe('lexiconSenses — readable senses, no apparatus', () => {
  it('keeps the numbered senses of an Abbott-Smith entry without references or abbreviations', () => {
    expect(lexiconSenses(KOSMOS)).toEqual(['order', 'ornament, adornment, of women', 'later, the world or universe, as an ordered system']);
  });

  it('drops the headword line and its bracketed apparatus', () => {
    expect(lexiconSenses(OUDEIS)).toEqual(['no, no one, none']);
    expect(lexiconSenses(MERIMNAO)).toEqual(['to be anxious', 'to care for']);
  });

  it('uses the lead gloss and the first sub-sense when a numbered sense only introduces them', () => {
    expect(lexiconSenses(SARX)).toEqual(['flesh', 'of the soft substance of the animal body']);
  });

  it('fills a one-word Hebrew sense with its sub-senses, skipping repeats', () => {
    expect(lexiconSenses(ECHAD)).toEqual(['one', 'each, every', 'a certain']);
  });

  it('stops at a second headword appended to the entry', () => {
    expect(lexiconSenses(SKEUOS)).toEqual(['a vessel, implement']);
  });

  it('never cuts a word in half and never leaves a reference behind', () => {
    for (const d of [KOSMOS, OUDEIS, MERIMNAO, SARX, SKEUOS]) {
      for (const s of lexiconSenses(d)) {
        expect(s).not.toMatch(/\d+:\d+/);
        expect(s).not.toMatch(/[([]|\bcf\b|\bal\.|\bLXX\b/);
      }
    }
  });

  it('summaries leave out a sense that only repeats the gloss', () => {
    expect(senseSummary({ gloss: 'flesh', definition: SARX })).toBe('of the soft substance of the animal body');
  });
});

describe('glosses', () => {
  it('shows the general part of a STEPBible gloss', () => {
    expect(displayGloss('spirit/breath: spirit')).toBe('spirit/breath');
    expect(displayGloss('to release: leave')).toBe('to release');
    expect(displayGloss('grace')).toBe('grace');
  });

  it('matches an English term to a contextual gloss, stemmed on both sides', () => {
    expect(glossMatches('loved', 'love')).toBe(true);
    expect(glossMatches('he created', 'create')).toBe(true);
    expect(glossMatches('having predestined', 'predestine')).toBe(true);
    expect(glossMatches('Blessed [are]', 'blessed')).toBe(true);
    expect(glossMatches('only begotten', 'only begotten')).toBe(true);
    expect(glossMatches('world,', 'word')).toBe(false);
  });

  it('matches a term to a lexicon entry by its gloss, then by its first senses', () => {
    expect(entryMatches({ gloss: 'to worry', definition: MERIMNAO }, 'worry')).toBe('gloss');
    expect(entryMatches({ gloss: 'to worry', definition: MERIMNAO }, 'anxious')).toBe('sense');
    expect(entryMatches({ gloss: 'to worry', definition: MERIMNAO }, 'fear')).toBeUndefined();
  });
});

describe('morphology', () => {
  it('reads the head of a TAHOT compound code', () => {
    expect(isContentWord({ morph: 'HTd/Ncmpa' })).toBe(true); // the/ heavens
    expect(isContentWord({ morph: 'HVqp3ms' })).toBe(true);
    expect(isContentWord({ morph: 'HTo' })).toBe(false); // object marker
    expect(isContentWord({ morph: 'HC/To' })).toBe(false);
    expect(isProperName({ morph: 'HNpm' })).toBe(true);
  });

  it('reads TAGNT codes', () => {
    expect(isContentWord({ morph: 'N-GSF' })).toBe(true);
    expect(isContentWord({ morph: 'V-AAI-3S' })).toBe(true);
    expect(isContentWord({ morph: 'T-NSM' })).toBe(false);
    expect(isContentWord({ morph: 'CONJ' })).toBe(false);
    expect(isContentWord({ morph: 'P-GSM' })).toBe(false);
    expect(isProperName({ morph: 'N-GSM-P' })).toBe(true);
    expect(isProperName({ morph: 'N-NSF' })).toBe(false);
  });
});
