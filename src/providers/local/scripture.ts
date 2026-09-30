/**
 * ScriptureProvider over the bundled Bible versions (public/data/bible/{id lowercased}/{BOOK}.json):
 * English BSB (default), KJV, WEB; Portuguese BLIVRE, NBV, BPM; Spanish RVR1909, BLM, VBL;
 * French LSG, DARBY, NCL, OST — see src/domain/translations.ts.
 *
 * Every version is stored with English (BSB/KJV) chapter and verse numbers (the data pipeline
 * aligns French/Hebrew-style numbering), so a verse key means the same words in every version.
 * Where a version prints two English verses as one, or lacks one, the chapter's `x` map says so;
 * the provider then marks the host verse (`alsoCovers`) and the missing ones (`missingVerses`).
 */
import { tryGetBook } from '../../domain/books';
import type { BookId, PassageRef, TranslationId, TranslationInfo } from '../../domain/models';
import { chaptersOf, formatRef, refIncludesVerse } from '../../domain/reference';
import { BIBLE_VERSIONS } from '../../domain/translations';
import type { ScriptureProvider } from '../types';
import type { BibleBookFile, BibleChapterData, BibleVerseData } from './formats';
import type { DataLoader } from './loader';
import type { LocalPassage, LocalPassageChapter, LocalVerse } from './types';

/** Translations bundled locally, in BIBLE_VERSIONS order (BSB, the default, first); `dir` = data directory. */
export const LOCAL_TRANSLATIONS: (TranslationInfo & { dir: string; language: NonNullable<TranslationInfo['language']> })[] = BIBLE_VERSIONS.map((v) => ({
  id: v.id,
  language: v.language,
  name: v.name,
  shortName: v.shortName,
  sourceId: v.sourceId,
  ...(v.year ? { year: v.year } : {}),
  description: v.description,
  dir: v.id.toLowerCase(),
}));

const BY_ID = new Map(LOCAL_TRANSLATIONS.map((t) => [t.id, t]));

function toVerse(book: BookId, chapter: number, data: BibleVerseData, alsoCovers?: number[]): LocalVerse {
  const [verse, text, extra] = data;
  const v: LocalVerse = { ref: { book, chapter, verse }, text };
  if (extra?.h) v.heading = extra.h;
  if (extra?.p) v.paragraphStart = true;
  if (extra?.l) {
    v.poetryLines = extra.l.map(([line]) => line);
    v.poetryIndents = extra.l.map(([, indent]) => indent);
  }
  if (extra?.f) v.footnotes = extra.f;
  if (alsoCovers?.length) v.alsoCovers = alsoCovers;
  return v;
}

/** English verses held by each host verse of a chapter (from the chapter's `x` map). */
function coveredBy(data: BibleChapterData): Map<number, number[]> {
  const out = new Map<number, number[]>();
  for (const [ev, host] of Object.entries(data.x ?? {})) {
    if (!host) continue;
    out.set(host, [...(out.get(host) ?? []), Number(ev)].sort((a, b) => a - b));
  }
  return out;
}

export class LocalScriptureProvider implements ScriptureProvider {
  readonly id = 'local:scripture';
  private readonly loader: DataLoader;

  constructor(loader: DataLoader) {
    this.loader = loader;
  }

  listTranslations(): TranslationInfo[] {
    return LOCAL_TRANSLATIONS.map(({ dir: _dir, ...t }) => ({ ...t }));
  }

  private async loadBook(book: BookId, translation: TranslationId): Promise<BibleBookFile> {
    const info = BY_ID.get(translation);
    if (!info) throw new Error(`Unknown translation "${translation}" (available: ${LOCAL_TRANSLATIONS.map((t) => t.id).join(', ')})`);
    if (!tryGetBook(book)) throw new Error(`Unknown book id "${book}"`);
    const file = await this.loader.json<BibleBookFile>(`bible/${info.dir}/${book}.json`);
    if (!file) throw new Error(`Scripture for ${book} (${translation}) is not available in the local library`);
    return file;
  }

  /**
   * Resolve any PassageRef: single verse, verse range, whole chapter, chapter range,
   * cross-chapter range or whole book. Verses the translation does not contain
   * (e.g. Matt 17:21 in the BSB) are simply absent (listed in `missingVerses` for non-English
   * versions). When the version prints a requested verse inside a neighbouring one (Acts 19:41
   * inside 19:40 in French Bibles), that neighbouring verse is returned with `alsoCovers`.
   * `label` is written in the version's language ("Romains 8.1" for the LSG).
   */
  async getPassage(ref: PassageRef, translation: TranslationId): Promise<LocalPassage> {
    const file = await this.loadBook(ref.book, translation);
    const info = BY_ID.get(translation)!;
    const last = file.chapters.length;
    if (ref.startChapter < 1 || ref.startChapter > last) {
      throw new Error(`${tryGetBook(ref.book)?.name ?? ref.book} has no chapter ${ref.startChapter}`);
    }
    const chapters: LocalPassageChapter[] = [];
    for (const c of chaptersOf(ref)) {
      if (c > last) break;
      const data = file.chapters[c - 1];
      const inRef = (n: number) => refIncludesVerse(ref, { book: ref.book, chapter: c, verse: n });
      const covers = coveredBy(data);
      // hosts of requested verses that the version prints inside a neighbouring verse
      const hosts = new Set<number>();
      const missing: number[] = [];
      for (const [ev, host] of Object.entries(data.x ?? {})) {
        if (!inRef(Number(ev))) continue;
        if (host) hosts.add(host);
        else missing.push(Number(ev));
      }
      const verses = data.v.filter(([n]) => inRef(n) || hosts.has(n)).map((v) => toVerse(ref.book, c, v, covers.get(v[0])));
      const chapter: LocalPassageChapter = { chapter: c, verses };
      // the superscription belongs with the chapter when the passage includes its first verse
      if (data.sup && (verses.some((v) => v.ref.verse === 1) || (ref.startVerse == null && inRef(1)))) chapter.superscription = data.sup;
      if (missing.length) chapter.missingVerses = missing.sort((a, b) => a - b);
      chapters.push(chapter);
    }
    return { ref, label: formatRef(ref, 'long', info.language), translation, chapters, sourceId: info.sourceId };
  }

  /** Highest verse number of the chapter in the BSB (0 when the chapter does not exist). */
  async getVerseCount(book: BookId, chapter: number): Promise<number> {
    const file = await this.loadBook(book, 'BSB');
    const data = file.chapters[chapter - 1];
    return data ? data.v[data.v.length - 1][0] : 0;
  }
}
