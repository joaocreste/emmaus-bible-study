/**
 * Lexicon helpers for chat replies: a short, readable summary of a lexicon
 * entry's senses (the scholarly apparatus stays in the Inspector), content-word
 * detection over STEPBible morphology codes, and English → original alignment
 * by gloss (stemmed on both sides).
 */
import type { LexiconEntry, OriginalWord } from '../domain/models';
import { STOPWORDS, stem, tokenize } from './text';

/* ------------------------------------------------------------------ */
/* Sense summary                                                       */
/* ------------------------------------------------------------------ */

const GREEK_OR_HEBREW = /[Ͱ-Ͽἀ-῿֐-׿]/;
// Abbott-Smith abbreviations that carry no meaning in a chat sentence.
const APPARATUS_WORDS = /\b(?:as in cl\. generally|as in cl\.|in cl\.|prop\.|absol\.|metaph\.|pass\.|esp\.|ib\.|id\.|al\.|cl\.|pl\.|sc\.|ptcp\.|By meton\.|meton\.)(?=[\s,;:]|$)/g;
const GRAMMAR_PREFIX = /^(?:with (?:acc|accusative|gen|genitive|dat|dative|inf|infinitive)\.?(?: of [a-z()]+)?[^,;]*,\s*)+/i;
const REFERENCE = /\s(?:[1-3]?[A-Z][a-z]{1,3}\.?)\s\d+(?::\d+)?\b.*$/;
const SKIP_LINE = /^(?:Also means|Aramaic equivalent|Hebrew equivalent|Greek equivalent|SYN\.|See also|cf\.)/i;

interface SenseLine {
  /** 0 = unnumbered lead, 1 = top-level ("1.", "1)", "I."), 2 = sub-sense ("(a)", "(1)", "1a)") */
  level: number;
  roman: boolean;
  raw: string;
}

function toLines(definition: string): string[] {
  return definition
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function classify(line: string): SenseLine | undefined {
  let m = /^([IVX]+)\.\s*(.*)$/.exec(line);
  if (m) return { level: 1, roman: true, raw: m[2] };
  m = /^(\d+)[.)]\s*(.*)$/.exec(line);
  if (m) return { level: 1, roman: false, raw: m[2] };
  m = /^(?:\([a-z0-9]+\)|\d+[a-z]+\d*[a-z]*\))\s*(.*)$/.exec(line);
  if (m) return { level: /^\d+[a-z]\d/.test(line) ? 3 : 2, roman: false, raw: m[1] };
  return { level: 0, roman: false, raw: line };
}

/** One sense line → plain words: no brackets, parentheses, references or abbreviations. */
export function cleanSense(raw: string, maxWords = 14): string {
  let s = raw.replace(/^\d+\.\s+/, '');
  // nested parentheses / brackets (repeat until stable)
  for (let i = 0; i < 3; i++) s = s.replace(/\[[^[\]]*\]/g, ' ').replace(/\([^()]*\)/g, ' ');
  s = s.replace(/[[\]()]/g, ' ');
  // Abbott-Smith introduces its references with a colon: keep the gloss before it.
  const colon = s.search(/:\s/);
  if (colon >= 0) s = s.slice(0, colon);
  s = s.replace(REFERENCE, '');
  s = s.replace(APPARATUS_WORDS, ' ');
  s = s.replace(/\s+([,;.])/g, '$1').replace(/\s+/g, ' ').trim();
  s = s.replace(GRAMMAR_PREFIX, '');
  s = s.replace(/^[\s,;:.–—-]+|[\s,;:.–—†*-]+$/g, '').trim();
  // usage notes follow a semicolon ("to do one justice; pass., …")
  const semi = s.indexOf(';');
  if (semi > 0 && s.slice(0, semi).trim().split(/\s+/).length >= 2) s = s.slice(0, semi);
  // one sentence: "love, goodwill, esteem. Outside of bibl. …" → "love, goodwill, esteem"
  const sentences = s.split(/\.\s+(?=[A-Z])/);
  s = sentences[0];
  if (s.split(/\s+/).length <= 1 && sentences[1]) s = `${s}; ${sentences[1].replace(/^[A-Z](?=[a-z ])/, (c) => c.toLowerCase())}`;
  s = s.replace(/[\s,;:.–—†*-]+$/g, '').trim();
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length > maxWords) {
    // cut at the last comma/semicolon that keeps it within bounds, never mid-word
    const head = words.slice(0, maxWords).join(' ');
    const cut = Math.max(head.lastIndexOf(','), head.lastIndexOf(';'));
    s = cut > 10 ? head.slice(0, cut) : `${head}…`;
  }
  if (!/[a-z]/i.test(s.replace(GREEK_OR_HEBREW, ''))) return '';
  return s.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase());
}

/**
 * The first senses of a lexicon definition (Abbott-Smith for Greek, BDB-style
 * outlines for Hebrew), cleaned for a chat sentence: at most `maxSenses`, and
 * stopping once they say enough (~8 words). Headword lines, LXX notes,
 * references and abbreviations are dropped; the full entry stays in the Inspector.
 */
export function lexiconSenses(definition: string, maxSenses = 3): string[] {
  const lines = toLines(definition).filter((l) => !SKIP_LINE.test(l));
  const parsed: SenseLine[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // headword line ("χάρις, -ιτος, ἡ …"); a later headword is another entry appended by the dataset
    if (GREEK_OR_HEBREW.test(line.slice(0, 2))) {
      if (i === 0) continue;
      if (/^\S+,\s*-/.test(line) || /^\S+$/.test(line)) break;
    }
    // "(λέγω), [in LXX …]" lines clean to nothing and are dropped below
    const c = classify(line.replace(/^:\s*/, ''));
    if (c) parsed.push(c);
  }
  const hasArabic = parsed.some((p) => p.level === 1 && !p.roman);
  const numbered = parsed.some((p) => p.level === 1);
  const out: string[] = [];
  const said = new Set<string>();
  let words = 0;
  const push = (text: string): boolean => {
    if (!text) return false;
    const stems = glossStems(text);
    if (stems.length && stems.every((s) => said.has(s))) return false; // nothing new ("images" after "image")
    stems.forEach((s) => said.add(s));
    out.push(text);
    words += text.split(/\s+/).length;
    return true;
  };
  for (let i = 0; i < parsed.length && out.length < maxSenses && words < 8; i++) {
    const p = parsed[i];
    if (p.level === 0) {
      // an unnumbered lead gloss ("flesh;", "goodness, kindness, faithfulness"), not an etymology ("Jehovah = …")
      if ((!numbered || out.length === 0) && !/[="]/.test(p.raw)) push(cleanSense(p.raw));
      continue;
    }
    if (p.level !== 1) continue;
    if (p.roman && hasArabic) continue; // Roman numerals group the Arabic senses
    const text = cleanSense(p.raw);
    const full = cleanSense(p.raw, 200);
    // "1. in cl.,", "2. By meton., concrete (…)," and "2. In NT, as usual with verbs in -όω…;" introduce sub-senses
    const introduces = /[,;:]$/.test(p.raw.replace(/\s*\([^)]*\)\s*$/, '').trim());
    const header = !text || (introduces && (full.split(/\s+/).length <= 1 || GREEK_OR_HEBREW.test(full)));
    const subs: string[] = [];
    for (let j = i + 1; j < parsed.length && parsed[j].level >= 2; j++) if (parsed[j].level === 2) subs.push(parsed[j].raw);
    if (header) {
      const first = subs.map((s) => cleanSense(s)).find(Boolean);
      if (first) push(first);
      continue;
    }
    if (!push(text)) continue;
    // a one-word sense ("one", "flesh") is filled out by its first sub-senses ("each, every", "a certain")
    if (text.split(/\s+/).length <= 1) {
      for (const s of subs) {
        if (out.length >= maxSenses || words >= 8) break;
        push(cleanSense(s));
      }
    }
  }
  return out;
}

/**
 * A STEPBible gloss for display: its general part ("spirit/breath: spirit" →
 * "spirit/breath", "to release: leave" → "to release").
 */
export function displayGloss(gloss: string): string {
  return gloss.split(':')[0].trim() || gloss.trim();
}

/** "of the soft substance of the animal body" — the senses beyond the gloss itself; '' when nothing readable remains. */
export function senseSummary(entry: Pick<LexiconEntry, 'definition' | 'gloss'>): string {
  const glosses = new Set(entry.gloss.split(/[:/]/).map((g) => g.trim().toLowerCase()));
  return lexiconSenses(entry.definition)
    .filter((s) => !glosses.has(s.toLowerCase()))
    .join('; ');
}

/* ------------------------------------------------------------------ */
/* Morphology                                                          */
/* ------------------------------------------------------------------ */

/** Head segment of a TAGNT/TAHOT morph code ("HTd/Ncmpa" → "Ncmpa", "HVqp3ms" → "Vqp3ms", "N-GSF" → "N-GSF"). */
function morphHead(morph: string): { hebrew: boolean; head: string } {
  if (/^[HA][A-Z]/.test(morph) && !/^[A-Z]-/.test(morph)) {
    const parts = morph.split('/');
    const last = parts[parts.length - 1];
    return { hebrew: true, head: parts.length === 1 ? last.slice(1) : last };
  }
  return { hebrew: false, head: morph };
}

/** Nouns, verbs and adjectives (not articles, particles, pronouns, prepositions or conjunctions). */
export function isContentWord(word: Pick<OriginalWord, 'morph'>): boolean {
  const morph = word.morph ?? '';
  if (!morph) return true;
  const { hebrew, head } = morphHead(morph);
  if (hebrew) return /^(N[cg]|V|A[aco])/.test(head);
  return /^[NVA]-/.test(head) || head === 'ADV';
}

/** A proper name (TAGNT "N-…-P", "N-PRI"; TAHOT "Np"). */
export function isProperName(word: Pick<OriginalWord, 'morph'>): boolean {
  const morph = word.morph ?? '';
  const { hebrew, head } = morphHead(morph);
  if (hebrew) return /^Np/.test(head);
  return /PRI|-[A-Z]{3}-P\b/.test(head);
}

/* ------------------------------------------------------------------ */
/* Gloss matching                                                      */
/* ------------------------------------------------------------------ */

/** Stemmed content words of an English term ("the Greek word for love" callers pass "love"). */
export function termStems(term: string): string[] {
  return tokenize(term).filter((t) => !STOPWORDS.has(t)).map(stem);
}

/** Stemmed words of a gloss, without editorial brackets ("Blessed [are]", "<the>"). */
export function glossStems(gloss: string): string[] {
  return tokenize(gloss.replace(/\[[^\]]*\]|<[^>]*>/g, ' ')).map(stem);
}

/** Does every content word of the term occur in the gloss ("loved" ⊇ "love", "having predestined" ⊇ "predestine")? */
export function glossMatches(gloss: string, term: string): boolean {
  const t = termStems(term);
  if (t.length === 0) return false;
  const g = new Set(glossStems(gloss));
  return t.every((x) => g.has(x));
}

/** Does the term match a lexicon entry's short gloss or its first senses ("anxious" ⊂ "to be anxious; to care for")? */
export function entryMatches(entry: Pick<LexiconEntry, 'gloss' | 'definition'>, term: string): 'gloss' | 'sense' | undefined {
  if (glossMatches(entry.gloss, term)) return 'gloss';
  const senses = lexiconSenses(entry.definition, 2).join(' ');
  return senses && glossMatches(senses, term) ? 'sense' : undefined;
}
