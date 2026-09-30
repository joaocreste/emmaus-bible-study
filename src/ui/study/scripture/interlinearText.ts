/**
 * Display formatting for the tagged text's English glosses and transliterations
 * (STEPBible TAGNT/TAHOT). Only the presentation changes — every word of the gloss is
 * kept, and nothing is added:
 *
 * - `<the>`, `rest<s>`: in the original but usually left untranslated in English → shown
 *   greyed, without the angle brackets;
 * - `[is] shepherd`: supplied in English for sense → kept in brackets, de-emphasised;
 * - `he leads/ me`: `/` joins the parts of one Hebrew word (prefixes, suffixes) → a quiet
 *   separator;
 * - Hebrew transliterations drop the syllable dots and capitals ("ye.na.ha.Le.ni" →
 *   "yenahaleni"); where the dataset's capital unambiguously marks the stressed syllable
 *   (any syllable but the first), that syllable is flagged so it can be underlined.
 */
import type { OriginalLanguage } from '../../../domain/models';

export type GlossPart =
  | { kind: 'text'; text: string }
  /** in the original, usually untranslated in English */
  | { kind: 'implied'; text: string }
  /** supplied in English for sense (brackets kept) */
  | { kind: 'added'; text: string }
  /** boundary between the parts of one word */
  | { kind: 'join' };

const TOKENS = /<([^<>]*)>|(\[[^[\]]*\])|\s*\/\s*/g;

export function glossParts(gloss: string): GlossPart[] {
  const parts: GlossPart[] = [];
  let last = 0;
  for (const m of gloss.matchAll(TOKENS)) {
    const at = m.index ?? 0;
    if (at > last) parts.push({ kind: 'text', text: gloss.slice(last, at) });
    if (m[1] !== undefined) parts.push({ kind: 'implied', text: m[1] });
    else if (m[2] !== undefined) parts.push({ kind: 'added', text: m[2] });
    else if (at > 0 && at + m[0].length < gloss.length) parts.push({ kind: 'join' });
    last = at + m[0].length;
  }
  if (last < gloss.length) parts.push({ kind: 'text', text: gloss.slice(last) });
  return parts.filter((p) => p.kind === 'join' || p.text.length > 0);
}

/** Does the gloss use any of the dataset's markup (for showing the legend)? */
export function glossHasMarkup(gloss: string): boolean {
  return /[<>[\]/]/.test(gloss);
}

export interface TransliterationDisplay {
  before: string;
  /** stressed syllable, when the dataset marks it unambiguously */
  stressed?: string;
  after: string;
}

export function displayTransliteration(t: string, language: OriginalLanguage): TransliterationDisplay {
  if (language === 'greek' || !t.includes('.')) {
    return language === 'greek' ? { before: t, after: '' } : { before: t.toLowerCase(), after: '' };
  }
  const syllables = t.split('.');
  let stress = -1;
  for (let i = syllables.length - 1; i > 0; i--) {
    if (/\p{Lu}/u.test(syllables[i])) {
      stress = i;
      break;
    }
  }
  const lower = syllables.map((s) => s.toLowerCase());
  if (stress < 0) return { before: lower.join(''), after: '' };
  return { before: lower.slice(0, stress).join(''), stressed: lower[stress], after: lower.slice(stress + 1).join('') };
}
