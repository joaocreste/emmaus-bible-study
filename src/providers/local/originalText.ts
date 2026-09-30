/**
 * OriginalTextProvider over STEPBible TAGNT/TAHOT (public/data/original).
 */
import { tryGetBook } from '../../domain/books';
import type { BookId, OriginalLanguage, PassageRef } from '../../domain/models';
import { chaptersOf, refIncludesVerse } from '../../domain/reference';
import type { OriginalTextProvider } from '../types';
import type { OriginalBookFile, OriginalWordData } from './formats';
import type { DataLoader } from './loader';
import { describeMorph } from './morphology';
import { normalizeStrong } from './strong';
import type { LocalOriginalVerse, LocalOriginalWord } from './types';

function toWord(data: OriginalWordData, index: number, bookLanguage: 'greek' | 'hebrew'): LocalOriginalWord {
  const [surface, transliteration, strongTag, morph, gloss, flag] = data;
  const language: OriginalLanguage = bookLanguage === 'greek' ? 'greek' : flag === 'A' ? 'aramaic' : 'hebrew';
  const n = normalizeStrong(strongTag);
  const word: LocalOriginalWord = {
    index,
    surface,
    strong: n?.base ?? strongTag,
    extendedStrong: n?.extended ?? strongTag,
    gloss,
    language,
  };
  if (transliteration) word.transliteration = transliteration;
  if (morph) {
    word.morph = morph;
    const d = describeMorph(morph, language);
    if (d) word.morphDescription = d;
  }
  return word;
}

function verseLanguage(words: LocalOriginalWord[], fallback: OriginalLanguage): OriginalLanguage {
  if (!words.length) return fallback;
  const aramaic = words.filter((w) => w.language === 'aramaic').length;
  return aramaic * 2 > words.length ? 'aramaic' : fallback;
}

export class LocalOriginalTextProvider implements OriginalTextProvider {
  readonly id = 'local:original-text';
  private readonly loader: DataLoader;

  constructor(loader: DataLoader) {
    this.loader = loader;
  }

  private async load(book: BookId): Promise<OriginalBookFile | null> {
    if (!tryGetBook(book)) throw new Error(`Unknown book id "${book}"`);
    return this.loader.json<OriginalBookFile>(`original/${book}.json`);
  }

  private toVerse(file: OriginalBookFile, chapter: number, verse: number, words: OriginalWordData[]): LocalOriginalVerse {
    const mapped = words.map((w, i) => toWord(w, i, file.language));
    return {
      ref: { book: file.book, chapter, verse },
      language: verseLanguage(mapped, file.language),
      words: mapped,
      sourceId: file.sourceId,
    };
  }

  /** Tagged words of every verse in the passage (English/KJV verse numbering; Psalm titles excluded). */
  async getOriginalText(ref: PassageRef): Promise<LocalOriginalVerse[]> {
    const file = await this.load(ref.book);
    if (!file) return [];
    const out: LocalOriginalVerse[] = [];
    for (const c of chaptersOf(ref)) {
      const chapter = file.c[String(c)];
      if (!chapter) continue;
      const verses = Object.keys(chapter)
        .map(Number)
        .filter((v) => v > 0 && refIncludesVerse(ref, { book: ref.book, chapter: c, verse: v }))
        .sort((a, b) => a - b);
      for (const v of verses) out.push(this.toVerse(file, c, v, chapter[String(v)]));
    }
    return out;
  }

  /**
   * Hebrew words of a Psalm title that the Hebrew Bible numbers as part of verse 1
   * (English verse 0, e.g. Psalm 23 "מִזְמוֹר לְדָוִד"), or null when there is none.
   */
  async getSuperscription(book: BookId, chapter: number): Promise<LocalOriginalVerse | null> {
    const file = await this.load(book);
    const words = file?.c[String(chapter)]?.['0'];
    return file && words?.length ? this.toVerse(file, chapter, 0, words) : null;
  }
}
