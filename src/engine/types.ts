/**
 * StudyEngine contract (spec §20–21).
 *
 * The engine turns a user message into (1) a chat reply and (2) a directive for
 * the dashboard, optionally (3) a new Study. Today `LocalStudyEngine` does this
 * with deterministic intent rules over the curated library + open datasets.
 * Tomorrow a `RetrievalStudyEngine` can implement the same interface with
 *   intent extraction → retrieval (scripture, lexicon, xrefs, commentary) →
 *   ranking → LLM synthesis → structured Study + reply
 * without any change to the UI.
 */
import type {
  ChatMessage,
  ConversationState,
  DashboardFocus,
  PipelineStep,
  Study,
  TranslationId,
} from '../domain/models';
import type { InspectorTarget } from '../state/types';

export type IntentKind =
  | 'open-passage' // "Romans 8", "study John 1"
  | 'open-topic' // "grace", "what does the Bible say about wealth?"
  | 'word-study' // "what does condemnation mean?", "Greek word behind grace"
  | 'cross-references' // "show me other passages", "where else does Paul…"
  | 'connect' // "how does this connect with Romans?"
  | 'commentary' // "what did Tim Keller say about this?"
  | 'historical-context' // "how would the original audience have understood this?"
  | 'literary-context' // "what's the structure?", "where does this fit in the book?"
  | 'theology' // "what does this teach about the Spirit?"
  | 'perspectives' // "are there different interpretations?"
  | 'explain-verse' // "explain verse 12", "what does 8:28 mean?"
  | 'sources' // "where does this come from?", "show sources"
  | 'greeting'
  | 'help'
  | 'unknown';

export interface Intent {
  kind: IntentKind;
  /** 0–1 heuristic confidence */
  confidence: number;
  /** extracted slots */
  slots: {
    passage?: import('../domain/models').PassageRef;
    verse?: import('../domain/models').VerseRef;
    term?: string;
    topic?: string;
    authorId?: string;
    authorName?: string;
    bookFilter?: string;
    traditionalAuthor?: string;
    language?: 'greek' | 'hebrew' | 'aramaic';
    /** a book was named with a chapter it does not have ("Romans 17") */
    invalidChapter?: { book: string; chapter: number };
  };
}

/** Live events an engine may emit while it works (the inference layer streams its pipeline). */
export type EngineStreamEvent =
  /** a retrieval / composition step, as it happens */
  | { type: 'progress'; step: PipelineStep }
  /** the study being composed; `complete: false` while sections are still arriving */
  | { type: 'study'; study: Study; complete: boolean }
  /** the engine handed the request to the inference layer: a new page is being composed, or a follow-up researched */
  | { type: 'phase'; phase: LivePhase };

export type LivePhase = 'compose' | 'answer';

export interface EngineContext {
  study: Study | null;
  history: ChatMessage[];
  conversation: ConversationState;
  translation: TranslationId;
  /** reader's language for replies and study content (default 'en') */
  locale?: import('../i18n/locales').Locale;
  /** optional live-event sink (the session store renders progress and partial pages) */
  onEvent?: (event: EngineStreamEvent) => void;
  /** aborts in-flight work when the reader starts something else */
  signal?: AbortSignal;
}

export interface EngineResult {
  /** assistant reply (role 'assistant') */
  reply: ChatMessage;
  /** present when the message opened a different study */
  study?: Study;
  /** dashboard directive to apply */
  focus?: DashboardFocus;
  conversation: ConversationState;
  intent: Intent;
  trace: PipelineStep[];
  /** optionally open the inspector (e.g. a lexicon entry for a word that is not a curated key word) */
  inspector?: InspectorTarget;
}

export interface StudyEngine {
  /** Handle any user message, including the first one from the welcome screen. */
  respond(message: string, ctx: EngineContext): Promise<EngineResult>;
  /** Open a study directly (landing cards, search palette, "Study this passage" buttons). */
  openStudy(query: { studyId?: string; passage?: import('../domain/models').PassageRef; topic?: string }, ctx: EngineContext): Promise<EngineResult>;
}
