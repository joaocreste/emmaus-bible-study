/**
 * Text helpers for the inference layer: exact-span quotation matching (whitespace /
 * quote-mark normalised), quoted-segment detection inside prose, URL detection,
 * citation excerpts, query normalisation and stable ids. Pure functions.
 */
import { createHash } from 'node:crypto';
import { fold, STOPWORDS, stem, tokenize, wordCount } from '../../src/engine/text';

/* ------------------------------------------------------------------ */
/* Normalisation with an index map back to the original string         */
/* ------------------------------------------------------------------ */

export interface NormalizedText {
  text: string;
  /** map[i] = index in the original string of normalised character i */
  map: number[];
}

const SINGLE_QUOTES = new Set(['‘', '’', '‚', '‛', '′', '`', '´']);
const DOUBLE_QUOTES = new Set(['“', '”', '„', '‟', '″', '«', '»']);
const DASHES = new Set(['‐', '‑', '‒', '–', '—', '―', '−']);
const INVISIBLE = new Set(['­', '​', '‌', '‍', '﻿']);

/**
 * Lower-cased, quote marks and dashes unified, "…" spelled "...", whitespace runs
 * collapsed to one space, invisible characters dropped — with a map to the original
 * indices so a match can be cut out of the source verbatim.
 */
export function normalizeForMatch(input: string): NormalizedText {
  const src = input.normalize('NFC');
  const out: string[] = [];
  const map: number[] = [];
  let pendingSpace = -1;
  // spacing around dashes varies between editions and writers ("word—word", "word — word")
  let afterDash = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (INVISIBLE.has(ch)) continue;
    if (/\s/.test(ch)) {
      if (pendingSpace < 0 && !afterDash) pendingSpace = i;
      continue;
    }
    const dash = ch === '-' || DASHES.has(ch);
    if (dash) pendingSpace = -1;
    afterDash = dash;
    if (pendingSpace >= 0) {
      if (out.length) {
        out.push(' ');
        map.push(pendingSpace);
      }
      pendingSpace = -1;
    }
    let rep: string;
    if (SINGLE_QUOTES.has(ch)) rep = "'";
    else if (DOUBLE_QUOTES.has(ch)) rep = '"';
    else if (DASHES.has(ch)) rep = '-';
    else if (ch === '…') rep = '...';
    else rep = ch.toLowerCase();
    for (const r of rep) {
      out.push(r);
      map.push(i);
    }
  }
  return { text: out.join(''), map };
}

const OUTER_JUNK = /^[\s"'“”‘’«»…]+|[\s"'“”‘’«»…]+$/g;

/** The quotation without surrounding quote marks, ellipses or whitespace. */
export function stripQuoteMarks(quote: string): string {
  let s = quote.trim();
  for (let i = 0; i < 3; i++) s = s.replace(OUTER_JUNK, '').replace(/^\.\.\.|\.\.\.$/g, '').trim();
  return s;
}

/**
 * Find `quote` as an exact span of `source` (whitespace, quote marks, dashes and case
 * normalised). Returns the span as it appears in the source — so what the reader sees
 * inside quotation marks is the source's own wording — or null.
 */
export function findExactSpan(quote: string, source: string): string | null {
  const q = stripQuoteMarks(quote);
  if (!q) return null;
  const src = normalizeForMatch(source);
  const tryFind = (needle: string): string | null => {
    const n = normalizeForMatch(needle).text;
    if (n.length < 2) return null;
    const at = src.text.indexOf(n);
    if (at < 0) return null;
    const start = src.map[at];
    const end = src.map[at + n.length - 1] + 1;
    return source.normalize('NFC').slice(start, end);
  };
  return tryFind(q) ?? tryFind(q.replace(/[.,;:!?]+$/, ''));
}

/** Does `needle` occur in `haystack` (normalised as for quotations)? */
export function containsNormalized(haystack: string, needle: string): boolean {
  const n = normalizeForMatch(needle).text;
  return n.length > 0 && normalizeForMatch(haystack).text.includes(n);
}

/**
 * Quoted runs of prose with at least `minWords` words, in any quotation style readers
 * see as a quotation: “…”, "…", „…“, «…», ‹…›, ‘…’ and '…'. Single quotes only count
 * at word boundaries (an opening mark before a word, a closing mark after one and not
 * followed by a letter), so apostrophes — don’t, Easton’s, the Pharisees’ test — are
 * never taken for quotations.
 */
export function quotedSegments(text: string, minWords = 4): string[] {
  const out: string[] = [];
  const push = (seg: string) => {
    const t = seg.trim();
    if (t && wordCount(t) >= minWords) out.push(t);
  };
  // double-quote styles (these marks are never apostrophes)
  const DOUBLE = /“([^“”„]+)[”“]|„([^“”„]+)[“”]|«([^«»]+)»|‹([^‹›]+)›|"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = DOUBLE.exec(text))) push(m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? '');
  // single-quote styles: opening mark at the start of a word, closing mark at the end of one
  for (const [open, close] of [
    ['‘', '’'],
    ["'", "'"],
  ] as const) {
    const re = new RegExp(`(?:^|(?<=[\\s(\\[{—–\\-:;,“"]))${open}(?=[\\p{L}\\p{N}])([^\\n]*?[\\p{L}\\p{N}.,;:!?…)])${close}(?![\\p{L}\\p{N}])`, 'gu');
    while ((m = re.exec(text))) push(m[1]);
  }
  return out;
}

/** Top-level domains a guessed link would use (bare "name.tld/path" without http or www). */
const BARE_DOMAIN = /(?<![\w@.])[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.(?:com|org|net|edu|gov|info|io|uk|de|fr|nl|ca|au|bible|church|app|dev)(?![a-z0-9-])(?:\/\S*)?/i;

/** A link of any form: http(s)://…, www.…, or a bare domain ("ccel.org/ccel/calvin", "desiringgod.org"). */
export function containsUrl(text: string): boolean {
  return /\bhttps?:\/\/|\bwww\.[a-z0-9-]+\.[a-z]/i.test(text) || BARE_DOMAIN.test(text);
}

/* ------------------------------------------------------------------ */
/* Citation excerpts                                                   */
/* ------------------------------------------------------------------ */

function contentStems(text: string): Set<string> {
  return new Set(
    tokenize(text)
      .filter((t) => !STOPWORDS.has(t) && t.length > 2)
      .map(stem),
  );
}

/** Adjacent content-stem pairs ("pauline privilege"): a phrase the claim shares says more than two loose words. */
function stemPairs(text: string): Set<string> {
  const stems = tokenize(text)
    .filter((t) => !STOPWORDS.has(t) && t.length > 2)
    .map(stem);
  const out = new Set<string>();
  for (let i = 1; i < stems.length; i++) out.add(`${stems[i - 1]} ${stems[i]}`);
  return out;
}

/**
 * The part of a retrieved text a claim rests on: the window of sentences (≤ maxWords)
 * that best matches the claim. Shared words count by rarity (a word in one sentence of
 * the text says more than one in every sentence), a shared two-word phrase ("Pauline
 * privilege") counts extra, and a sentence too long for the window (tagged text, a
 * list) is cut around its best-matching word rather than from its start. The whole
 * text when it is short.
 */
export function bestExcerpt(text: string, claim: string, maxWords = 60): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (wordCount(clean) <= maxWords) return clean;
  const sentences = clean.match(/[^.!?;\n]+[.!?;]*["”’)]*\s*/g) ?? [clean];
  const claimStems = contentStems(claim);
  const claimPairs = stemPairs(claim);
  const sentenceStems = sentences.map(contentStems);
  const df = new Map<string, number>();
  for (const st of sentenceStems) for (const x of st) if (claimStems.has(x)) df.set(x, (df.get(x) ?? 0) + 1);
  const weight = (x: string) => 1 + Math.log(sentences.length / (df.get(x) ?? sentences.length));
  let best = 0;
  let bestScore = -1;
  for (let i = 0; i < sentences.length; i++) {
    let score = 0;
    for (const x of sentenceStems[i]) if (claimStems.has(x)) score += weight(x);
    for (const pair of stemPairs(sentences[i])) if (claimPairs.has(pair)) score += 2;
    if (score > bestScore + 1e-9) {
      bestScore = score;
      best = i;
    }
  }
  let out = '';
  for (let i = best; i < sentences.length; i++) {
    const next = out + sentences[i];
    if (wordCount(next) > maxWords) break;
    out = next;
  }
  if (!out.trim()) {
    // one sentence longer than the window: centre the window on its best-matching word
    const words = sentences[best].trim().split(/\s+/);
    let at = 0;
    let atWeight = 0;
    words.forEach((w, i) => {
      const x = tokenize(w)
        .filter((t) => !STOPWORDS.has(t) && t.length > 2)
        .map(stem)
        .find((t) => claimStems.has(t));
      if (x && weight(x) > atWeight + 1e-9) {
        atWeight = weight(x);
        at = i;
      }
    });
    const from = Math.max(0, Math.min(at - Math.floor(maxWords / 3), words.length - maxWords));
    const lead = best > 0 || from > 0 ? '…' : '';
    const tail = from + maxWords < words.length ? '…' : '';
    return `${lead}${words.slice(from, from + maxWords).join(' ')}${tail}`;
  }
  const trimmed = out.trim();
  return best > 0 ? `…${trimmed}` : trimmed;
}

/* ------------------------------------------------------------------ */
/* Queries, slugs, hashes                                              */
/* ------------------------------------------------------------------ */

/** Reader input as a cache key: folded, whitespace collapsed, trailing punctuation dropped. */
export function normalizeQuery(query: string): string {
  return fold(query)
    .replace(/\s+/g, ' ')
    .replace(/[\s?!.。]+$/g, '')
    .trim();
}

export function slugify(input: string, max = 40): string {
  const s = fold(input)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/g, '');
  return s || 'page';
}

export function shortHash(input: string, length = 8): string {
  return createHash('sha256').update(input).digest('hex').slice(0, length);
}

/** Clip long text for display in a tool result. */
export function clip(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const at = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('\n'));
  const head = at > maxChars * 0.6 ? cut.slice(0, at + 1) : cut;
  return `${head.trimEnd()} […${text.length - head.length} more characters not shown]`;
}

export { wordCount };
