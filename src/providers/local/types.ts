/**
 * Extra, optional fields the local dataset providers add on top of the domain
 * contract (src/domain/models.ts). They are structural supersets, so consumers
 * typed against the contract keep working; UI code that wants the extras can
 * narrow to these types.
 */
import type {
  BookIntroduction,
  LexiconEntry,
  Occurrences,
  OriginalVerse,
  OriginalWord,
  Passage,
  PassageChapter,
  Verse,
} from '../../domain/models';
import type { ProviderRegistryOptions } from '../registry';
import type { DataLoader } from './loader';

export interface LocalVerse extends Verse {
  /** indent level of each entry of `poetryLines` (0 = prose part of a mixed verse, 1 = first level, 2 = indented) */
  poetryIndents?: number[];
  /**
   * Versification: English (BSB) verse numbers whose words this verse also holds in this version
   * (e.g. Acts 19:40 in the Louis Segond also covers 19:41 → [41]). Display as "40–41".
   */
  alsoCovers?: number[];
}

export interface LocalPassageChapter extends PassageChapter {
  /** Psalm title / Hebrew superscription printed before verse 1 (e.g. "A Psalm of David.") */
  superscription?: string;
  verses: LocalVerse[];
  /**
   * Versification: English (BSB/KJV) verse numbers inside the requested range that this version
   * does not have at all (textual variants such as Matt 17:21, or verses its source text lacks).
   */
  missingVerses?: number[];
}

export interface LocalPassage extends Passage {
  chapters: LocalPassageChapter[];
}

export interface LocalOriginalWord extends OriginalWord {
  /** STEPBible disambiguated tag, normalised ("H7462B", "G2424G"); `strong` holds the classic number ("H7462") */
  extendedStrong: string;
}

export interface LocalOriginalVerse extends OriginalVerse {
  words: LocalOriginalWord[];
}

export interface LocalLexiconEntry extends LexiconEntry {
  /** disambiguated tag of this sense, e.g. "H7462B" (`strong` is the classic number "H7462") */
  extendedStrong: string;
  /** STEPBible brief morphology, e.g. "G:N-N" */
  morph?: string;
  /** number of tagged words in the bundled text using this exact tag */
  frequency?: number;
  /** other senses/entities sharing the classic Strong's number, most frequent first */
  otherSenses?: { extendedStrong: string; lemma: string; gloss: string }[];
}

export interface LocalOccurrences extends Occurrences {
  /** tagged words (a verse can contain the lemma more than once) */
  wordCount: number;
}

export interface LocalBookIntroduction extends BookIntroduction {
  title: string;
  /** "Purpose / Author / Date / Setting" summary (paragraphs separated by "\n\n") */
  summary?: string;
}

/** Options for createLocalDatasetProviders. */
export interface LocalProviderOptions extends ProviderRegistryOptions {
  /** how to read public/data (default: fetch from `dataBaseUrl`) — tests inject a Node fs loader */
  loader?: DataLoader;
  /** fetch used for the live commentary fallback (default: global fetch) */
  remoteFetch?: typeof fetch;
}
