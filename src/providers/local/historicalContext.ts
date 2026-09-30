/**
 * HistoricalContextProvider over the Tyndale Open Study Notes book introductions
 * (public/data/intros).
 */
import { tryGetBook } from '../../domain/books';
import type { BookId } from '../../domain/models';
import type { HistoricalContextProvider } from '../types';
import type { IntroFile } from './formats';
import type { DataLoader } from './loader';
import type { LocalBookIntroduction } from './types';

export class LocalHistoricalContextProvider implements HistoricalContextProvider {
  readonly id = 'local:historical-context';
  private readonly loader: DataLoader;

  constructor(loader: DataLoader) {
    this.loader = loader;
  }

  /** The book's introduction (paragraphs separated by "\n\n"), or null. */
  async getBookIntroduction(book: BookId): Promise<LocalBookIntroduction | null> {
    if (!tryGetBook(book)) return null;
    const file = await this.loader.json<IntroFile>(`intros/${book}.json`);
    if (!file) return null;
    const intro: LocalBookIntroduction = { book: file.book, title: file.title, text: file.text, sourceId: 'tyndale-open-study-notes' };
    if (file.summary) intro.summary = file.summary;
    return intro;
  }
}
