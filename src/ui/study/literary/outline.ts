import type { OutlineSegment, Passage, PassageRef } from '../../../domain/models';

/** Rough verses-per-chapter used only to size partial-chapter segments in the outline bar. */
const TYPICAL_CHAPTER_VERSES = 30;

/**
 * Relative size of an outline segment in chapters (partial chapters are
 * approximated). Purely visual: it sizes the bar, it is never shown as a number.
 */
export function segmentWeight(ref: PassageRef): number {
  const endC = ref.endChapter ?? ref.startChapter;
  const frac = (v: number) => Math.min(Math.max(v / TYPICAL_CHAPTER_VERSES, 0), 0.97);
  const start = ref.startChapter - 1 + (ref.startVerse != null ? frac(ref.startVerse - 1) : 0);
  let end: number;
  if (ref.endVerse != null) end = endC - 1 + frac(ref.endVerse);
  else if (ref.startVerse != null && ref.endChapter == null) end = start + 1 / TYPICAL_CHAPTER_VERSES;
  else end = endC;
  return Math.max(0.4, end - start);
}

export interface HeadingSegment extends OutlineSegment {
  /** number of verses under this heading (inside the passage) */
  verseCount: number;
}

/**
 * Outline of a passage from its translation's section headings (e.g. BSB).
 * Verses before the first heading become an "Opening verses" segment (label passed in the
 * reader's language) so nothing is lost.
 */
export function headingOutline(passage: Passage, openingLabel = 'Opening verses'): HeadingSegment[] {
  const verses = passage.chapters.flatMap((c) => c.verses);
  if (verses.length === 0) return [];
  const starts: { index: number; label: string }[] = [];
  verses.forEach((v, i) => {
    if (v.heading && v.heading.trim()) starts.push({ index: i, label: v.heading.trim() });
  });
  if (starts.length === 0) return [];
  if (starts[0].index > 0) starts.unshift({ index: 0, label: openingLabel });
  return starts.map((s, k) => {
    const endIndex = (starts[k + 1]?.index ?? verses.length) - 1;
    const a = verses[s.index].ref;
    const b = verses[endIndex].ref;
    return {
      label: s.label,
      ref: { book: a.book, startChapter: a.chapter, startVerse: a.verse, endChapter: b.chapter, endVerse: b.verse },
      verseCount: endIndex - s.index + 1,
    };
  });
}
