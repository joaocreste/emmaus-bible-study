/**
 * Translation overlays for the curated library.
 *
 * The English study modules stay the single source of truth (ids, references, citations,
 * provenance). An overlay supplies the translated prose for one study (or topic) in one
 * language, keyed by item id; `localizeStudy()` merges it. Verified quotations are NOT
 * translated in place — their exact words stay as verified; an overlay may add a clearly
 * labelled free translation (`quoteTranslation`).
 *
 * Files: src/data/curated/i18n/<locale>/<study-or-topic-id>.ts (default export).
 */
import type { PassageRef, WordAnchor } from '../../../domain/models';
import type { NonEnglishLocale } from '../../../domain/bookNames';

export interface StudyOverlay {
  studyId: string;
  locale: NonEnglishLocale;
  title?: string;
  subtitle?: string;
  summary?: string;
  opening?: string;
  /** extra phrases (lowercase, in this language) that open this study, e.g. "romanos 8", "graça" */
  matchTopics?: string[];
  suggestedQuestions?: string[];
  topic?: { name?: string; question?: string; definition?: string };
  keyWords?: Record<
    string,
    {
      english?: string;
      basicMeaning?: string;
      semanticRange?: string[];
      grammar?: string;
      significance?: string;
      caution?: string;
      /** notes of notableOccurrences, same order */
      notableNotes?: string[];
      /** where to underline the word in THIS language's Bible versions (phrases verified against their text) */
      anchors?: WordAnchor[];
    }
  >;
  crossReferences?: Record<string, { title?: string; explanation?: string }>;
  context?: Record<string, { title?: string; summary?: string; detail?: string }>;
  literary?: {
    placeInBook?: string;
    argument?: string;
    placeInCanon?: string;
    /** labels of bookOutline / passageOutline, same order */
    bookOutline?: string[];
    passageOutline?: string[];
    features?: Record<string, { title?: string; description?: string; structure?: { label?: string; text?: string }[] }>;
  };
  theology?: Record<string, { title?: string; summary?: string; detail?: string }>;
  perspectives?: Record<
    string,
    {
      question?: string;
      intro?: string;
      commonGround?: string;
      perspectives?: Record<string, { tradition?: string; label?: string; summary?: string }>;
    }
  >;
  commentary?: Record<string, { lead?: string; /** summaries only */ text?: string; /** verified quotations only */ quoteTranslation?: string }>;
  sermons?: Record<string, { summary?: string }>;
  /** keyed by verseKey (e.g. "ROM.8.28"); explanations in the same order as the English notes for that verse */
  verseNotes?: Record<string, string[]>;
  concepts?: Record<string, { label?: string; /** lowercase aliases in this language (added to the English ones) */ aliases?: string[]; answer?: string }>;
  topicPassages?: Record<string, { title?: string; note?: string; group?: string }>;
}

export interface TopicOverlay {
  topicId: string;
  locale: NonEnglishLocale;
  name?: string;
  /** lowercase phrases in this language that select the topic ("ansiedade", "preocupação") */
  aliases?: string[];
  question?: string;
  definition?: string;
  keyPassages?: Record<string, { title?: string; note?: string; group?: string }>;
  perspectives?: StudyOverlay['perspectives'];
  suggestedQuestions?: string[];
}

/** Helper type for authoring: a passage written as a reference key is not allowed — overlays never change references. */
export type NoReferences<T> = T extends PassageRef ? never : T;
