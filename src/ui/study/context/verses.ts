import type { PassageRef, VerseRef } from '../../../domain/models';
import { compareRefs, verseToPassage } from '../../../domain/reference';

/**
 * Collapse a list of verses into passage ranges for compact chips:
 * [8:1, 8:2, 8:3, 8:15] → [8:1–3, 8:15]. Order is canonical; duplicates are removed.
 */
export function compressVerses(verses: VerseRef[]): PassageRef[] {
  const sorted = verses
    .map(verseToPassage)
    .sort(compareRefs)
    .filter((r, i, all) => i === 0 || compareRefs(all[i - 1], r) !== 0);
  const out: PassageRef[] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (
      last &&
      last.book === r.book &&
      last.startChapter === r.startChapter &&
      last.endVerse != null &&
      r.startVerse != null &&
      (r.startVerse === last.endVerse + 1 || r.startVerse === last.endVerse)
    ) {
      last.endVerse = Math.max(last.endVerse, r.endVerse ?? r.startVerse);
      continue;
    }
    out.push({ ...r });
  }
  return out;
}
