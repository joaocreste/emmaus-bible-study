/**
 * Text helpers for the knowledge base: search-term processing (shared by indexing
 * and querying) and excerpting long documents at sentence boundaries.
 */
import { fold, stem } from '../../src/engine/text';

/** Function words dropped from the index and from queries (plain English; no domain words). */
const STOPWORDS = new Set(
  (
    'a an the of in on at to for from by with about and or but nor is are was were be been being am do does did ' +
    'this that these those it its as if then than so such into upon unto also not no yet which who whom whose ' +
    'what when where why how i me my we us our you your he him his she her they them their there here thee thou thy ' +
    'shall will would should could may might must can hath doth unto ye'
  ).split(/\s+/),
);

/** Tokens of a string: letters/digits of any script, folded (accents, Greek breathings, Hebrew points removed). */
export function tokenizeForSearch(text: string): string[] {
  return fold(text)
    .replace(/'s\b/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/**
 * Term normalisation for MiniSearch (index + query): folded, stopwords and one-letter
 * tokens dropped, English words lightly stemmed ("divorced" = "divorce" = "divorc").
 * Strong's numbers keep their canonical form ("g0630" → "g630").
 */
export function processTerm(term: string): string | null {
  const t = term.toLowerCase();
  if (t.length < 2 || STOPWORDS.has(t)) return null;
  const strong = /^([gh])0*(\d{1,5})[a-z]?$/.exec(t);
  if (strong) return `${strong[1]}${strong[2]}`;
  if (/^\d+$/.test(t)) return t.length <= 3 ? t : null;
  return /^[a-z]+$/.test(t) ? stem(t) : t;
}

/** Content terms of a query (processed). */
export function queryTerms(query: string): string[] {
  return tokenizeForSearch(query)
    .map(processTerm)
    .filter((t): t is string => Boolean(t));
}

/** Normalised phrase for exact comparisons ("RICH, THE" → "rich the"). */
export function normPhrase(s: string): string {
  return tokenizeForSearch(s).join(' ');
}

/** Normalised, stemmed phrase ("Divorces" ≈ "divorce"); stopwords kept so phrases stay distinct. */
export function stemPhrase(s: string): string {
  return tokenizeForSearch(s)
    .map((t) => (/^[a-z]+$/.test(t) ? stem(t) : t))
    .join(' ');
}

/**
 * Cut `text` to at most `max` characters at a sentence (or, failing that, word)
 * boundary. Returns the text unchanged when it fits.
 */
export function trimAtSentence(text: string, max: number): { text: string; trimmed: boolean } {
  if (text.length <= max) return { text, trimmed: false };
  const window = text.slice(0, max);
  let cut = -1;
  const re = /[.!?]["”’)\]]*(?=\s)|\n\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(window))) cut = m.index + m[0].length;
  if (cut < max * 0.5) {
    const space = window.lastIndexOf(' ');
    cut = space > max * 0.5 ? space : max;
  }
  return { text: `${text.slice(0, cut).trimEnd()} […]`, trimmed: true };
}

/** Word tokens of `text` with their offsets and processed search terms (null for stopwords). */
function wordTerms(text: string): { index: number; term: string | null }[] {
  const out: { index: number; term: string | null }[] = [];
  for (const m of text.matchAll(/[\p{L}\p{N}]+/gu)) {
    const folded = tokenizeForSearch(m[0])[0];
    out.push({ index: m.index ?? 0, term: folded ? processTerm(folded) : null });
  }
  return out;
}

/** Offsets where sentences / paragraphs start (0 included). */
function sentenceStarts(text: string): number[] {
  const starts = [0];
  for (const m of text.matchAll(/[.!?]["”’)\]]*\s+|\n+/g)) {
    const at = (m.index ?? 0) + m[0].length;
    if (at < text.length && at !== starts[starts.length - 1]) starts.push(at);
  }
  return starts;
}

/**
 * Excerpt of at most ~`max` characters from the part of `text` where the processed
 * query `terms` cluster, starting at a sentence boundary ("[…] " marks a cut at the
 * start, " […]" at the end). The start of the text wins ties, so short entries and
 * entries that answer the query up front are excerpted from the top.
 */
export function excerptAround(text: string, terms: ReadonlySet<string>, max: number): { text: string; trimmed: boolean } {
  if (text.length <= max) return { text, trimmed: false };
  if (!terms.size) return trimAtSentence(text, max);
  const hits = wordTerms(text)
    .filter((w) => w.term != null && terms.has(w.term))
    .map((w) => w.index);
  if (!hits.length) return trimAtSentence(text, max);
  const span = max * 0.85;
  const count = (start: number) => {
    let n = 0;
    for (const h of hits) if (h >= start && h < start + span) n++;
    return n;
  };
  let best = 0;
  let bestCount = count(0);
  for (const s of sentenceStarts(text)) {
    if (s === 0 || s > hits[hits.length - 1]) continue;
    const n = count(s);
    if (n > bestCount) {
      best = s;
      bestCount = n;
    }
  }
  if (best === 0) return trimAtSentence(text, max);
  const rest = trimAtSentence(text.slice(best), max - 4);
  return { text: `[…] ${rest.text}`, trimmed: true };
}

/** Processed terms of several strings (query + matched index terms), as a set. */
export function termSet(...parts: (string | readonly string[] | undefined)[]): Set<string> {
  const out = new Set<string>();
  for (const p of parts) {
    if (!p) continue;
    for (const s of typeof p === 'string' ? [p] : p) for (const t of queryTerms(s)) out.add(t);
  }
  return out;
}
