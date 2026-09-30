/**
 * Human-readable parsing for the morphology codes of the STEPBible tagged texts.
 *
 * Greek (TAGNT) codes follow the Robinson-style scheme documented in STEPBible's
 * "TEGMC – Translators Expansion of Greek Morphology Codes":
 *   N-NSF      → "Noun, nominative singular feminine"
 *   V-AAI-3S   → "Verb, aorist active indicative, 3rd person singular"
 *   V-PAP-NSM  → "Verb, present active participle, nominative singular masculine"
 *
 * Hebrew/Aramaic (TAHOT) codes follow the OpenScriptures/ETCBC scheme documented in
 * "TEHMC – Translators Expansion of Hebrew Morphology Codes". The first letter is
 * the language (H Hebrew, A Aramaic); morphemes of one word are joined with "/":
 *   HNcmsa         → "Noun, masculine singular absolute"
 *   HVqp3ms        → "Verb, Qal perfect, 3rd person masculine singular"
 *   HR/Ncmsa       → "Preposition + noun, masculine singular absolute"
 *   HVqrmsc/Sp1bs  → "Verb, Qal participle, masculine singular construct + pronominal suffix, 1st person common singular"
 *
 * The decoder is total: unknown elements are skipped rather than guessed, and a code
 * that cannot be read at all yields `undefined`.
 */

/* ------------------------------------------------------------------ */
/* Greek                                                               */
/* ------------------------------------------------------------------ */

const G_CASE: Record<string, string> = { N: 'nominative', G: 'genitive', D: 'dative', A: 'accusative', V: 'vocative' };
const G_NUMBER: Record<string, string> = { S: 'singular', P: 'plural' };
const G_GENDER: Record<string, string> = { M: 'masculine', F: 'feminine', N: 'neuter' };
const G_PERSON: Record<string, string> = { '1': '1st person', '2': '2nd person', '3': '3rd person' };

const G_TENSE: Record<string, string> = {
  P: 'present',
  I: 'imperfect',
  F: 'future',
  A: 'aorist',
  R: 'perfect',
  L: 'pluperfect',
  X: 'indefinite tense',
  '2P': 'present',
  '2F': 'second future',
  '2A': 'second aorist',
  '2R': 'second perfect',
  '2L': 'second pluperfect',
};

const G_VOICE: Record<string, string> = {
  A: 'active',
  M: 'middle',
  P: 'passive',
  E: 'middle or passive',
  D: 'middle deponent',
  O: 'passive deponent',
  N: 'middle or passive deponent',
  Q: 'impersonal active',
  X: 'indefinite voice',
};

const G_MOOD: Record<string, string> = {
  I: 'indicative',
  S: 'subjunctive',
  O: 'optative',
  M: 'imperative',
  N: 'infinitive',
  P: 'participle',
};

/** Declinable parts of speech with a case-number-gender block. */
const G_DECLINABLE: Record<string, string> = {
  N: 'Noun',
  A: 'Adjective',
  T: 'Article',
  R: 'Relative pronoun',
  C: 'Reciprocal pronoun',
  D: 'Demonstrative pronoun',
  K: 'Correlative pronoun',
  I: 'Interrogative pronoun',
  X: 'Indefinite pronoun',
  Q: 'Correlative or interrogative pronoun',
  F: 'Reflexive pronoun',
  P: 'Personal pronoun',
  S: 'Possessive pronoun',
};

const G_INDECLINABLE: Record<string, string> = {
  ADV: 'Adverb',
  CONJ: 'Conjunction',
  COND: 'Conditional conjunction',
  PRT: 'Particle',
  PREP: 'Preposition',
  INJ: 'Interjection',
  ARAM: 'Aramaic transliterated word',
  HEB: 'Hebrew transliterated word',
};

/** Trailing qualifiers ("-P", "-ATT" …). Adjective/adverb C/S mean comparative/superlative. */
function greekExtra(extra: string, pos: string): string | undefined {
  switch (extra) {
    case 'P':
      return 'personal name';
    case 'L':
      return 'location';
    case 'T':
      return 'title';
    case 'G':
      return 'gentilic';
    case 'LG':
      return 'gentilic (of a place)';
    case 'PG':
      return 'gentilic (of a person)';
    case 'TG':
      return 'gentilic (of a group)';
    case 'C':
      return pos === 'A' || pos === 'ADV' ? 'comparative' : 'contracted form';
    case 'S':
      return 'superlative';
    case 'K':
      return 'crasis';
    case 'N':
      return 'negative';
    case 'I':
      return 'interrogative';
    case 'NUI':
      return 'indeclinable numeral';
    case 'ABB':
      return 'abbreviated';
    case 'ATT':
      return 'Attic form';
    case 'AP':
      return 'apocopated form';
    case 'IRR':
      return 'irregular form';
    case 'ARAM':
      return 'transcribed from Aramaic';
    case 'HEB':
      return 'transcribed from Hebrew';
    case 'PRI':
      return 'indeclinable proper noun';
    case 'OI':
      return 'indeclinable';
    case 'LI':
      return 'indeclinable letter';
    default:
      return undefined;
  }
}

function caseNumberGender(block: string): string | undefined {
  const m = /^([NGDAV])([SP])([MFN])?$/.exec(block);
  if (!m) return undefined;
  return [G_CASE[m[1]], G_NUMBER[m[2]], m[3] ? G_GENDER[m[3]] : undefined].filter(Boolean).join(' ');
}

function withExtras(base: string, extras: string[], pos: string): string {
  const words = extras.map((e) => greekExtra(e, pos)).filter((e): e is string => !!e);
  return words.length ? `${base} (${words.join(', ')})` : base;
}

/** Decode a TAGNT Greek morphology code, e.g. "V-AAI-3S". */
export function describeGreekMorph(code: string): string | undefined {
  // crasis: two words merged ("CONJ + COND" for κἄν)
  if (code.includes('+')) {
    const parts = code.split('+').map((p) => describeGreekMorph(p.replace(/^\s*[GH]\d+[A-Za-z]?=/, '')));
    return parts.every(Boolean) ? parts.join(' + ') : undefined;
  }
  const c = code.trim().toUpperCase();
  if (!c) return undefined;
  const parts = c.split('-');
  const pos = parts[0];

  if (pos in G_INDECLINABLE) {
    const label = G_INDECLINABLE[pos];
    return withExtras(label, parts.slice(1), pos);
  }

  if (pos === 'V') {
    const tvm = /^(2?[PIFARLX])([AMPEDONQX])([ISOMNP])$/.exec(parts[1] ?? '');
    if (!tvm) return 'Verb';
    const [, t, v, mood] = tvm;
    let out = `Verb, ${G_TENSE[t]} ${G_VOICE[v]} ${G_MOOD[mood]}`;
    let rest = parts.slice(2);
    if (rest[0]) {
      const pn = /^([123])([SP])$/.exec(rest[0]);
      const cng = caseNumberGender(rest[0]);
      if (pn) {
        out += `, ${G_PERSON[pn[1]]} ${G_NUMBER[pn[2]]}`;
        rest = rest.slice(1);
      } else if (cng) {
        out += `, ${cng}`;
        rest = rest.slice(1);
      }
    }
    return withExtras(out, rest, pos);
  }

  if (pos in G_DECLINABLE) {
    const label = G_DECLINABLE[pos];
    const block = parts[1] ?? '';
    let rest = parts.slice(2);
    // Special indeclinable forms written in the first block: N-PRI, N-OI, N-LI, A-NUI
    if (!caseNumberGender(block) && greekExtra(block, pos) && !/^[123]/.test(block)) {
      return withExtras(label, [block, ...rest], pos);
    }
    let desc: string | undefined;
    if (pos === 'S') {
      // S-1SASF: possessor person+number, then case-number-gender of the possessed noun
      const m = /^([123])([SP])([NGDAV][SP][MFN]?)$/.exec(block);
      if (m) desc = `${G_PERSON[m[1]]} ${G_NUMBER[m[2]]} possessor, ${caseNumberGender(m[3])}`;
    } else {
      const m = /^([123])?([NGDAV][SP][MFN]?)$/.exec(block);
      if (m) desc = [m[1] ? G_PERSON[m[1]] : undefined, caseNumberGender(m[2])].filter(Boolean).join(' ');
    }
    if (!desc) {
      if (!block) return label;
      rest = [block, ...rest];
      return withExtras(label, rest, pos);
    }
    return withExtras(`${label}, ${desc}`, rest, pos);
  }

  return undefined;
}

/* ------------------------------------------------------------------ */
/* Hebrew / Aramaic                                                    */
/* ------------------------------------------------------------------ */

const H_GENDER: Record<string, string> = { m: 'masculine', f: 'feminine', b: 'common', c: 'common' };
const H_NUMBER: Record<string, string> = { s: 'singular', p: 'plural', d: 'dual' };
const H_STATE: Record<string, string> = { a: 'absolute', c: 'construct', d: 'determined' };
const H_PERSON: Record<string, string> = { '1': '1st person', '2': '2nd person', '3': '3rd person' };

/** Hebrew verb stems (STEPBible letters, completed with OpenScriptures minor stems). */
const HEB_STEM: Record<string, string> = {
  q: 'Qal',
  N: 'Niphal',
  p: 'Piel',
  P: 'Pual',
  h: 'Hiphil',
  H: 'Hophal',
  t: 'Hithpael',
  o: 'Polel',
  O: 'Polal',
  r: 'Hithpolel',
  m: 'Poel',
  M: 'Poal',
  k: 'Palel',
  K: 'Pulal',
  Q: 'Qal passive',
  l: 'Pilpel',
  L: 'Polpal',
  f: 'Hithpalpel',
  D: 'Nithpael',
  j: 'Pealal',
  i: 'Pilel',
  u: 'Hothpaal',
  c: 'Tiphil',
  v: 'Hishtaphel',
  w: 'Nithpalel',
  y: 'Nithpoel',
  z: 'Hithpoel',
};

/** Aramaic verb stems (STEPBible letters, completed with OpenScriptures minor stems). */
const ARC_STEM: Record<string, string> = {
  q: 'Peal',
  Q: 'Peil',
  u: 'Hithpeel',
  p: 'Pael',
  P: 'Ithpaal',
  M: 'Hithpaal',
  a: 'Aphel',
  h: 'Haphel',
  s: 'Saphel',
  e: 'Shaphel',
  H: 'Hophal',
  i: 'Ithpeel',
  t: 'Hishtaphel',
  v: 'Ishtaphel',
  w: 'Hithaphel',
  o: 'Polel',
  z: 'Ithpoel',
  r: 'Hithpolel',
  f: 'Hithpalpel',
  b: 'Hephal',
  c: 'Tiphel',
  m: 'Poel',
  l: 'Palpel',
  L: 'Ithpalpel',
  O: 'Ithpolel',
  G: 'Ittaphal',
};

/** Verb forms. "c" is cohortative when a person follows, infinitive construct otherwise. */
const H_VERB_FORM: Record<string, string> = {
  p: 'perfect',
  q: 'consecutive perfect (weqatal)',
  i: 'imperfect',
  n: 'imperfect',
  j: 'jussive',
  h: 'cohortative',
  u: 'conjunctive imperfect',
  w: 'consecutive imperfect (wayyiqtol)',
  v: 'imperative',
  r: 'participle',
  s: 'passive participle',
  a: 'infinitive absolute',
};

function pgn(s: string): string {
  // person? gender? number? (e.g. "3ms", "1cs", "ms", "bp")
  const m = /^([123])?([mfbc])?([spd])?/.exec(s);
  if (!m) return '';
  return [m[1] ? H_PERSON[m[1]] : undefined, m[2] ? H_GENDER[m[2]] : undefined, m[3] ? H_NUMBER[m[3]] : undefined]
    .filter(Boolean)
    .join(' ');
}

function gns(s: string): string {
  // gender number state (e.g. "msa", "fpc", "bsd")
  const m = /^([mfbc])?([spd])?([acd])?$/.exec(s);
  if (!m) return '';
  return [m[1] ? H_GENDER[m[1]] : undefined, m[2] ? H_NUMBER[m[2]] : undefined, m[3] ? H_STATE[m[3]] : undefined]
    .filter(Boolean)
    .join(' ');
}

function join(label: string, detail: string): string {
  return detail ? `${label}, ${detail}` : label;
}

/** Decode one morpheme (without the language letter), e.g. "Vqp3ms", "Ncmsa", "Sp1bs". */
function describeHebrewPart(part: string, aramaic: boolean): string | undefined {
  const f = part[0];
  const rest = part.slice(1);
  switch (f) {
    case 'V': {
      const stem = (aramaic ? ARC_STEM : HEB_STEM)[rest[0]] ?? HEB_STEM[rest[0]];
      const formLetter = rest[1];
      const tail = rest.slice(2);
      let form = H_VERB_FORM[formLetter];
      if (formLetter === 'c') form = /^[123]/.test(tail) ? 'cohortative' : 'infinitive construct';
      if (formLetter === 'a' && tail.length === 1) form = 'infinitive absolute';
      const head = ['Verb', [stem, form].filter(Boolean).join(' ')].filter(Boolean).join(', ');
      const isInfinitive = form?.startsWith('infinitive');
      const detail = isInfinitive ? '' : /^[123]/.test(tail) ? pgn(tail) : gns(tail);
      return join(head, detail);
    }
    case 'N': {
      const type = rest[0];
      if (type === 'p') {
        const kind: Record<string, string> = { m: 'masculine', f: 'feminine', l: 'location', t: 'title' };
        return kind[rest[1]] ? `Proper noun (${kind[rest[1]]})` : 'Proper noun';
      }
      const label = type === 'g' ? 'Gentilic noun' : type === 't' ? 'Noun (title)' : 'Noun';
      return join(label, gns(rest.slice(1)));
    }
    case 'A': {
      const kind: Record<string, string> = { a: 'Adjective', c: 'Cardinal number', o: 'Ordinal number', g: 'Gentilic adjective' };
      return join(kind[rest[0]] ?? 'Adjective', gns(rest.slice(1)));
    }
    case 'P': {
      const kind: Record<string, string> = {
        d: 'Demonstrative pronoun',
        f: 'Indefinite pronoun',
        i: 'Interrogative pronoun',
        p: 'Personal pronoun',
        r: 'Relative pronoun',
      };
      return join(kind[rest[0]] ?? 'Pronoun', pgn(rest.slice(1)));
    }
    case 'S': {
      if (rest[0] === 'p') return join('pronominal suffix', pgn(rest.slice(1)));
      if (rest[0] === 'd') return 'directional he';
      if (rest[0] === 'h') return 'paragogic he';
      if (rest[0] === 'n') return 'paragogic nun';
      return 'suffix';
    }
    case 'T': {
      const kind: Record<string, string> = {
        a: aramaic ? 'Definite article' : 'Particle of affirmation',
        c: 'Conditional particle',
        d: 'Definite article',
        e: 'Particle of exhortation',
        i: 'Interrogative particle',
        j: 'Interjection',
        m: 'Demonstrative particle',
        n: 'Negative particle',
        o: 'Direct object marker',
        r: 'Relative particle',
      };
      return kind[rest[0]] ?? 'Particle';
    }
    case 'R':
      return rest[0] === 'd' ? 'Preposition with article' : 'Preposition';
    case 'C':
      return 'Conjunction';
    case 'c':
      return 'Consecutive conjunction';
    case 'D':
      return 'Adverb';
    default:
      return undefined;
  }
}

/** Decode a TAHOT Hebrew/Aramaic morphology code, e.g. "HVqp3ms" or "HR/Ncmsa". */
export function describeHebrewMorph(code: string): string | undefined {
  const c = code.trim();
  const lang = c[0];
  if (lang !== 'H' && lang !== 'A') return undefined;
  const aramaic = lang === 'A';
  const parts = c
    .slice(1)
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean);
  const described = parts.map((p) => describeHebrewPart(p, aramaic));
  if (described.every((d) => !d)) return undefined;
  // Lower-case every morpheme after the first so the whole reads as one phrase.
  return described
    .filter((d): d is string => !!d)
    .map((d, i) => (i === 0 ? d : d.charAt(0).toLowerCase() + d.slice(1)))
    .join(' + ');
}

/** Decode any STEPBible word-level morphology code (Greek or Hebrew/Aramaic). */
export function describeMorph(code: string | undefined, language: 'greek' | 'hebrew' | 'aramaic'): string | undefined {
  if (!code) return undefined;
  return language === 'greek' ? describeGreekMorph(code) : describeHebrewMorph(code);
}

/* ------------------------------------------------------------------ */
/* Lexicon brief morphology ("G:N-F", "H:V", "N:N-M-P")                */
/* ------------------------------------------------------------------ */

const LEX_TYPE: Record<string, string> = {
  A: 'adjective',
  ADV: 'adverb',
  Adv: 'adverb',
  ART: 'article',
  Art: 'article',
  T: 'article',
  COND: 'conditional',
  Cond: 'conditional',
  CONJ: 'conjunction',
  Conj: 'conjunction',
  K: 'correlative pronoun',
  Cor: 'correlative',
  C: 'reciprocal pronoun',
  D: 'demonstrative pronoun',
  DemP: 'demonstrative pronoun',
  ImpP: 'impersonal pronoun',
  IndP: 'indefinite pronoun',
  I: 'interrogative',
  Intg: 'interrogative',
  INJ: 'interjection',
  Intj: 'interjection',
  N: 'noun',
  Neg: 'negative particle',
  PRT: 'particle',
  Part: 'particle',
  PREP: 'preposition',
  Prep: 'preposition',
  P: 'personal pronoun',
  PerP: 'personal pronoun',
  PosP: 'possessive pronoun',
  F: 'reflexive pronoun',
  RefP: 'reflexive pronoun',
  R: 'relative pronoun',
  RelP: 'relative pronoun',
  V: 'verb',
  X: 'indefinite pronoun',
};

const LEX_GENDER: Record<string, string> = { F: 'feminine', M: 'masculine', N: 'neuter', C: 'common' };
const LEX_NAME: Record<string, string> = {
  L: 'place',
  P: 'person',
  LG: 'people group (from a place)',
  PG: 'people group (from a person)',
  G: 'people group',
  T: 'title',
};

function describeLexPart(part: string): string | undefined {
  const m = /^([AGHN]):([A-Za-z]+)(?:-([A-Z/]*))?(?:-([A-Z]+))?/.exec(part.trim());
  if (!m) return undefined;
  const [, lang, type, gender, extra] = m;
  let label = LEX_TYPE[type] ?? LEX_TYPE[type.toUpperCase()];
  if (!label) return undefined;
  if (lang === 'N') label = type === 'N' ? 'proper noun' : `proper ${label}`;
  const bits: string[] = [];
  if (gender) {
    const g = gender
      .split('/')
      .map((x) => LEX_GENDER[x])
      .filter(Boolean);
    if (g.length) bits.push(g.join(' or '));
  }
  if (extra && lang === 'N' && LEX_NAME[extra]) bits.push(LEX_NAME[extra]);
  if (lang === 'A') label = `Aramaic ${label}`;
  const text = bits.length ? `${label} (${bits.join(', ')})` : label;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Part of speech from a STEPBible lexicon brief morph ("G:N-F" → "Noun (feminine)"). */
export function describeLexiconMorph(code: string | undefined): string | undefined {
  if (!code) return undefined;
  const alternatives = code
    .split(' / ')
    .map((alt) =>
      alt
        .split(/\s*\+\s*/)
        .map(describeLexPart)
        .filter(Boolean)
        .join(' + '),
    )
    .filter(Boolean);
  return alternatives.length ? alternatives.join(' or ') : undefined;
}
