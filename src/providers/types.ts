/**
 * Provider abstraction (spec §8).
 *
 * The UI and the StudyEngine only ever talk to these interfaces. Today they are
 * backed by (a) open datasets bundled under /public/data and (b) a curated local
 * library under src/data/curated. Tomorrow any of them can be swapped for a
 * remote API, a database, or a retrieval service without touching components.
 *
 * Every returned object carries a `sourceId` resolvable through `SourceRegistry`.
 */
import type {
  Author,
  BookId,
  BookIntroduction,
  CommentaryInfo,
  CommentarySection,
  CuratedStudy,
  DatasetCrossReference,
  LexiconEntry,
  Occurrences,
  OriginalVerse,
  Passage,
  PassageRef,
  PerspectiveSet,
  SermonRecord,
  Source,
  TranslationId,
  TopicDefinition,
  TranslationInfo,
} from '../domain/models';
import type { Locale } from '../i18n/locales';

export interface ScriptureProvider {
  readonly id: string;
  listTranslations(): TranslationInfo[];
  /** Resolve a passage in a translation. Rejects if the book/translation is unavailable. */
  getPassage(ref: PassageRef, translation: TranslationId): Promise<Passage>;
  /** Number of verses in a chapter (for range validation / "whole chapter" rendering). */
  getVerseCount(book: BookId, chapter: number): Promise<number>;
}

/** Word-level Hebrew/Aramaic/Greek text (tagged with Strong's + morphology). */
export interface OriginalTextProvider {
  readonly id: string;
  getOriginalText(ref: PassageRef): Promise<OriginalVerse[]>;
}

export interface LexiconProvider {
  readonly id: string;
  /** "G2631", "H7462" (extended Strong's suffixes like "H0430G" are accepted and normalised) */
  getEntry(strong: string): Promise<LexiconEntry | null>;
  getEntries(strongs: string[]): Promise<Map<string, LexiconEntry>>;
  /** Canonical occurrences of a lemma across the tagged text. */
  getOccurrences(strong: string, limit?: number): Promise<Occurrences | null>;
}

/** Uncurated, dataset-backed cross-references (curated ones live in Study.crossReferences). */
export interface CrossReferenceProvider {
  readonly id: string;
  getCrossReferences(ref: PassageRef, opts?: { limitPerVerse?: number; minScore?: number }): Promise<DatasetCrossReference[]>;
}

/** Public-domain commentaries and open study notes. */
export interface CommentaryProvider {
  readonly id: string;
  listCommentaries(): CommentaryInfo[];
  /** Sections of the given commentary overlapping the passage (empty array when none). */
  getCommentary(commentaryId: string, ref: PassageRef): Promise<CommentarySection[]>;
}

/** Book-level historical & literary background (e.g. Tyndale Open Study Notes introductions). */
export interface HistoricalContextProvider {
  readonly id: string;
  getBookIntroduction(book: BookId): Promise<BookIntroduction | null>;
}

/** Catalogue of sermons (curated metadata + links; transcripts only when licensing allows). */
export interface SermonProvider {
  readonly id: string;
  findSermons(query: { ref?: PassageRef; topic?: string; authorId?: string }): Promise<SermonRecord[]>;
}

export interface TopicMatch {
  id: string;
  name: string;
  /** lowercase phrases that select this topic ("anxiety", "worry", "fear") */
  aliases: string[];
  /** orientation + key passages (synthesis grounded in Scripture) */
  topic: TopicDefinition;
  /** curated deep study for this topic, if one exists */
  studyId?: string;
  /** passage shown in the Scripture section when the topic opens */
  anchor?: PassageRef;
  perspectives?: PerspectiveSet[];
  suggestedQuestions?: string[];
  /** match strength 0–1 */
  score: number;
}

/** Topical index — maps topic words ("anxiety", "wealth") to key passages. */
export interface TopicProvider {
  readonly id: string;
  findTopics(query: string, locale?: Locale): Promise<TopicMatch[]>;
  listTopics(locale?: Locale): Promise<TopicMatch[]>;
}

/** The curated local library (MVP stand-in for retrieval + LLM synthesis). */
export interface CuratedStudyRepository {
  readonly id: string;
  /** studies in the given language (translated overlays applied; English when omitted) */
  list(locale?: Locale): CuratedStudy[];
  get(id: string, locale?: Locale): CuratedStudy | undefined;
  /** Best curated study for a passage (overlapping match.references) */
  findByPassage(ref: PassageRef, locale?: Locale): CuratedStudy | undefined;
  /** Best curated study for a free-text topic query (matches aliases in the locale and in English) */
  findByTopic(query: string, locale?: Locale): CuratedStudy | undefined;
}

export interface SourceRegistry {
  getSource(id: string): Source | undefined;
  getAuthor(id: string): Author | undefined;
  allSources(): Source[];
  allAuthors(): Author[];
  /** find an author by chat alias ("keller", "spurgeon", "c. s. lewis") */
  findAuthor(text: string): Author | undefined;
}

/** Composition root handed to the engine and (via React context) to the UI. */
export interface ProviderRegistry {
  scripture: ScriptureProvider;
  originalText: OriginalTextProvider;
  lexicon: LexiconProvider;
  crossReferences: CrossReferenceProvider;
  commentary: CommentaryProvider;
  historicalContext: HistoricalContextProvider;
  sermons: SermonProvider;
  topics: TopicProvider;
  studies: CuratedStudyRepository;
  sources: SourceRegistry;
}
