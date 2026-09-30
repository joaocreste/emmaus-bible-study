/**
 * Locating curated key words inside a verse's text.
 *
 * A `KeyWord` carries per-translation anchor phrases (`WordAnchor.phrases`). These
 * helpers find each phrase in the displayed verse (case-insensitive, on word
 * boundaries, without overlaps) and split the text into plain and key-word segments.
 */
import type { KeyWord, TranslationId, VerseRef } from '../../../domain/models';
import { sameVerse } from '../../../domain/reference';

export interface PhraseCandidate {
  /** key word id */
  id: string;
  phrase: string;
}

export interface MatchRange {
  start: number;
  end: number;
  /** key word id */
  id: string;
}

export interface TextSegment {
  text: string;
  /** set when the segment is a key-word phrase */
  keyWordId?: string;
}

/** Key-word phrases anchored in this verse for the given translation (translations without a phrase are skipped). */
export function anchoredPhrases(keyWords: readonly KeyWord[], verse: VerseRef, translation: TranslationId): PhraseCandidate[] {
  const out: PhraseCandidate[] = [];
  for (const kw of keyWords) {
    for (const anchor of kw.anchors) {
      if (!sameVerse(anchor.verse, verse)) continue;
      const phrase = anchor.phrases[translation]?.trim();
      if (phrase) out.push({ id: kw.id, phrase });
    }
  }
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Regex for a phrase: case-insensitive, whole words only, flexible whitespace,
 * straight and curly apostrophes treated alike.
 */
export function phrasePattern(phrase: string, flags = 'giu'): RegExp {
  const body = phrase
    .trim()
    .split(/\s+/)
    .map((w) => escapeRegExp(w).replace(/['’‘]/g, "['’‘]"))
    .join('\\s+');
  return new RegExp(`(?<![\\p{L}\\p{N}\\p{M}])${body}(?![\\p{L}\\p{N}\\p{M}])`, flags);
}

/**
 * Find non-overlapping ranges for the candidates in `text`.
 * Longer phrases win ties; each key word id is used at most once (ids already in
 * `taken` are skipped, and matched ids are added to it — handy across poetry lines).
 */
export function findPhraseRanges(text: string, candidates: readonly PhraseCandidate[], taken: Set<string> = new Set()): MatchRange[] {
  const chosen: MatchRange[] = [];
  const ordered = [...candidates].sort((a, b) => b.phrase.length - a.phrase.length);
  for (const c of ordered) {
    if (taken.has(c.id)) continue;
    const re = phrasePattern(c.phrase);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const start = m.index;
      const end = start + m[0].length;
      if (m[0].length === 0) {
        re.lastIndex++;
        continue;
      }
      if (chosen.some((r) => start < r.end && r.start < end)) continue;
      chosen.push({ start, end, id: c.id });
      taken.add(c.id);
      break;
    }
  }
  return chosen.sort((a, b) => a.start - b.start);
}

/** Split text into plain and key-word segments using sorted, non-overlapping ranges. */
export function segmentText(text: string, ranges: readonly MatchRange[]): TextSegment[] {
  const out: TextSegment[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor) out.push({ text: text.slice(cursor, r.start) });
    out.push({ text: text.slice(r.start, r.end), keyWordId: r.id });
    cursor = r.end;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor) });
  return out;
}

/** Convenience: segments for one line of a verse. */
export function segmentVerseText(
  text: string,
  candidates: readonly PhraseCandidate[],
  taken: Set<string> = new Set(),
): TextSegment[] {
  if (candidates.length === 0) return [{ text }];
  return segmentText(text, findPhraseRanges(text, candidates, taken));
}

/** Key-word phrases longer than this at the start of a verse are allowed to wrap away from the verse number. */
const MAX_UNBROKEN_LEAD = 24;

/**
 * Split a verse's segments into the part that must stay on the verse number's line
 * (its first word, or a short key-word phrase) and the rest. Rendering the lead inside
 * a `white-space: nowrap` span keeps a verse number from being stranded at a line end.
 */
export function splitLeadingWord(segments: readonly TextSegment[]): { lead: TextSegment[]; rest: TextSegment[] } {
  const [first, ...others] = segments;
  if (!first) return { lead: [], rest: [] };
  if (first.keyWordId) {
    return first.text.length <= MAX_UNBROKEN_LEAD ? { lead: [first], rest: others } : { lead: [], rest: [...segments] };
  }
  const m = /^(\s*\S+)([\s\S]*)$/.exec(first.text);
  if (!m) return { lead: [], rest: [...segments] };
  const [, head, tail] = m;
  return { lead: [{ text: head }], rest: tail ? [{ text: tail }, ...others] : others };
}
