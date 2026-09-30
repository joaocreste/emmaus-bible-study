/**
 * CommentaryProvider over Tyndale Open Study Notes (all 66 books, bundled) and the
 * public-domain classics (Calvin, Matthew Henry, JFB, Keil & Delitzsch). Classic
 * commentaries are bundled for the curated books; other books are fetched live
 * from the Free Use Bible API (CORS-enabled) and cleaned with the same functions
 * the pipeline uses (./cleaners.ts), unless `allowRemoteFallback` is false.
 */
import { tryGetBook } from '../../domain/books';
import type { BookId, CommentaryInfo, CommentarySection, PassageRef } from '../../domain/models';
import { chaptersOf, refsOverlap } from '../../domain/reference';
import type { CommentaryProvider } from '../types';
import {
  COMMENTARY_API_IDS,
  commentaryChapterToSections,
  type ApiCommentaryChapter,
  type ClassicCommentaryId,
  type CleanSection,
} from './cleaners';
import type { CommentaryBookFile } from './formats';
import type { DataLoader } from './loader';

export const LOCAL_COMMENTARIES: CommentaryInfo[] = [
  { id: 'tyndale', name: 'Tyndale Open Study Notes', sourceId: 'tyndale-open-study-notes', style: 'notes', testaments: ['OT', 'NT'] },
  { id: 'calvin', name: 'Calvin’s Commentaries', sourceId: 'calvin-commentaries', style: 'classic', testaments: ['OT', 'NT'] },
  { id: 'matthew-henry', name: 'Matthew Henry’s Commentary', sourceId: 'matthew-henry-commentary', style: 'classic', testaments: ['OT', 'NT'] },
  { id: 'jfb', name: 'Jamieson-Fausset-Brown Commentary', sourceId: 'jfb-commentary', style: 'classic', testaments: ['OT', 'NT'] },
  { id: 'keil-delitzsch', name: 'Keil & Delitzsch Commentary on the Old Testament', sourceId: 'keil-delitzsch-commentary', style: 'classic', testaments: ['OT'] },
];

const REMOTE_URL = 'https://bible.helloao.org/api/c/{apiId}/{BOOK}/{chapter}.json';

/** The part of public/data/manifest.json this provider reads. */
interface ManifestSubset {
  bundledCommentaryBooks?: Record<string, string[]>;
  remoteCommentary?: { urlTemplate?: string; availableBooks?: Record<string, string[]> };
}

export interface CommentaryProviderDeps {
  loader: DataLoader;
  /** last verse number of a chapter (English versification) — used to close the final section of a fetched chapter */
  verseCount: (book: BookId, chapter: number) => Promise<number>;
  allowRemoteFallback: boolean;
  remoteFetch?: typeof fetch;
}

function toSection(book: BookId, info: CommentaryInfo, s: CleanSection): CommentarySection {
  return {
    commentaryId: info.id,
    ref: { book, startChapter: s[0], startVerse: s[1], endChapter: s[2], endVerse: s[3] },
    text: s[4],
    sourceId: info.sourceId,
  };
}

export class LocalCommentaryProvider implements CommentaryProvider {
  readonly id = 'local:commentary';
  private readonly deps: CommentaryProviderDeps;
  private manifest: Promise<ManifestSubset | null> | null = null;
  private readonly remoteCache = new Map<string, Promise<CleanSection[]>>();

  constructor(deps: CommentaryProviderDeps) {
    this.deps = deps;
  }

  listCommentaries(): CommentaryInfo[] {
    return LOCAL_COMMENTARIES.map((c) => ({ ...c, testaments: [...c.testaments] }));
  }

  private loadManifest(): Promise<ManifestSubset | null> {
    this.manifest ??= this.deps.loader.json<ManifestSubset>('manifest.json').catch(() => null);
    return this.manifest;
  }

  /** Sections of the commentary overlapping the passage, in canonical order ([] when none). */
  async getCommentary(commentaryId: string, ref: PassageRef): Promise<CommentarySection[]> {
    const info = LOCAL_COMMENTARIES.find((c) => c.id === commentaryId);
    const book = tryGetBook(ref.book);
    if (!info || !book || !info.testaments.includes(book.testament)) return [];

    const manifest = await this.loadManifest();
    const bundled = commentaryId === 'tyndale' || (manifest?.bundledCommentaryBooks?.[commentaryId] ?? []).includes(ref.book);
    let sections: CleanSection[];
    if (bundled) {
      const file = await this.deps.loader.json<CommentaryBookFile>(`commentary/${commentaryId}/${ref.book}.json`);
      sections = file?.s ?? [];
    } else {
      sections = await this.remoteSections(commentaryId as ClassicCommentaryId, ref, manifest);
    }
    return sections
      .map((s) => toSection(ref.book, info, s))
      .filter((s) => refsOverlap(s.ref, ref));
  }

  /** Live fallback for a non-bundled book: one request per chapter, cleaned like the bundle. */
  private async remoteSections(id: ClassicCommentaryId, ref: PassageRef, manifest: ManifestSubset | null): Promise<CleanSection[]> {
    if (!this.deps.allowRemoteFallback) return [];
    const apiId = COMMENTARY_API_IDS[id];
    if (!apiId) return [];
    const available = manifest?.remoteCommentary?.availableBooks?.[id];
    if (available && !available.includes(ref.book)) return [];
    const template = manifest?.remoteCommentary?.urlTemplate ?? REMOTE_URL;
    const book = tryGetBook(ref.book)!;
    const chapters = chaptersOf(ref).filter((c) => c >= 1 && c <= book.chapters);
    const settled = await Promise.allSettled(
      chapters.map((chapter) => {
        const key = `${id}:${ref.book}:${chapter}`;
        let pending = this.remoteCache.get(key);
        if (!pending) {
          const url = template.replace('{apiId}', apiId).replace('{BOOK}', ref.book).replace('{chapter}', String(chapter));
          pending = this.fetchChapter(url, id, ref.book, chapter, book.name);
          this.remoteCache.set(key, pending);
          pending.catch(() => this.remoteCache.delete(key));
        }
        return pending;
      }),
    );
    const failures = settled.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
    // Every request failed (e.g. offline): reject, so callers can say "could not be loaded"
    // instead of wrongly claiming the commentary has nothing on this passage.
    if (chapters.length > 0 && failures.length === settled.length) {
      const reason = failures[0].reason;
      throw reason instanceof Error ? reason : new Error(String(reason));
    }
    // Partial failure: show what arrived.
    return settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  }

  private async fetchChapter(url: string, id: ClassicCommentaryId, book: BookId, chapter: number, bookName: string): Promise<CleanSection[]> {
    const doFetch = this.deps.remoteFetch ?? globalThis.fetch.bind(globalThis);
    const res = await doFetch(url);
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`Commentary request failed: HTTP ${res.status} for ${url}`);
    const json = (await res.json()) as ApiCommentaryChapter;
    const lastVerse = await this.deps.verseCount(book, chapter).catch(() => 0);
    return commentaryChapterToSections(id, json, lastVerse, bookName);
  }
}
