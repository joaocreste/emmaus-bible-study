/**
 * CrossReferenceProvider over OpenBible.info votes (public/data/xrefs).
 */
import { tryGetBook } from '../../domain/books';
import type { DatasetCrossReference, PassageRef } from '../../domain/models';
import { chaptersOf, parseRefKey, refIncludesVerse } from '../../domain/reference';
import type { CrossReferenceProvider } from '../types';
import type { XrefBookFile } from './formats';
import type { DataLoader } from './loader';

export const OPENBIBLE_SOURCE_ID = 'openbible-xrefs';

export class LocalCrossReferenceProvider implements CrossReferenceProvider {
  readonly id = 'local:cross-references';
  private readonly loader: DataLoader;

  constructor(loader: DataLoader) {
    this.loader = loader;
  }

  /**
   * Dataset cross references for every verse in the passage, grouped by verse
   * (canonical order) and best-voted first. The bundle keeps up to 15 per verse
   * with a positive vote score; `limitPerVerse` / `minScore` narrow that further.
   */
  async getCrossReferences(ref: PassageRef, opts: { limitPerVerse?: number; minScore?: number } = {}): Promise<DatasetCrossReference[]> {
    if (!tryGetBook(ref.book)) return [];
    const file = await this.loader.json<XrefBookFile>(`xrefs/${ref.book}.json`);
    if (!file) return [];
    const limit = opts.limitPerVerse ?? Infinity;
    const minScore = opts.minScore ?? -Infinity;
    const out: DatasetCrossReference[] = [];
    for (const c of chaptersOf(ref)) {
      const chapter = file[String(c)];
      if (!chapter) continue;
      const verses = Object.keys(chapter)
        .map(Number)
        .filter((v) => refIncludesVerse(ref, { book: ref.book, chapter: c, verse: v }))
        .sort((a, b) => a - b);
      for (const v of verses) {
        let kept = 0;
        for (const [key, score] of chapter[String(v)]) {
          if (kept >= limit) break;
          if (score < minScore) continue;
          const target = parseRefKey(key);
          if (!target) continue;
          out.push({ from: { book: ref.book, chapter: c, verse: v }, target, score, sourceId: OPENBIBLE_SOURCE_ID });
          kept++;
        }
      }
    }
    return out;
  }
}
