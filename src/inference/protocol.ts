/**
 * Inference-layer protocol — shared by the local server (server/) and the browser client.
 *
 * Knowledge base  →  retrieval tools  →  Claude composes a page from the retrieved EVIDENCE
 *                 →  validator (every claim cites evidence; refs exist; quotes match)  →  Study
 *
 * The model never supplies evidence: it only arranges and explains what the knowledge
 * base returned. Framework-free — no React, no DOM, no Node APIs.
 */
import type {
  ChatMessage,
  ConversationState,
  DashboardFocus,
  PassageRef,
  PipelineStep,
  Study,
  TranslationId,
} from '../domain/models';
import type { Locale } from '../i18n/locales';

export const INFERENCE_API = {
  status: '/api/inference/status',
  compose: '/api/inference/compose',
  answer: '/api/inference/answer',
} as const;

/* ------------------------------------------------------------------ */
/* Status                                                              */
/* ------------------------------------------------------------------ */

export interface InferenceStatus {
  /** true when an API credential is configured and the knowledge base loaded */
  available: boolean;
  /** model id used for composition, e.g. "claude-opus-5" */
  model: string;
  /** why it is unavailable, in plain English (e.g. "Add ANTHROPIC_API_KEY to .env.local") — the fallback text */
  reason?: string;
  /** why it is unavailable, as a code the client localises (catalog namespace 'inference', key `status.<code>`) */
  reasonCode?: InferenceUnavailableCode;
  knowledgeBase: {
    documents: number;
    corpora: { id: string; label: string; documents: number }[];
    /** changes whenever the corpora or the indexing code change (cached pages from another version are recomposed) */
    version?: string;
  };
}

export type InferenceUnavailableCode =
  | 'no-credentials' // no API key / profile configured, or the credential was rejected
  | 'no-credit' // the API account has no remaining credit
  | 'loading' // the knowledge base is still loading
  | 'kb-error' // the knowledge base failed to load
  | 'rejected'; // the Claude API persistently rejects the server's requests (e.g. the configured model is unavailable)

/* ------------------------------------------------------------------ */
/* Requests                                                            */
/* ------------------------------------------------------------------ */

export interface ComposeRequest {
  /** the reader's input, verbatim ("divorce", "Why does God allow suffering?", "Genesis 1") */
  query: string;
  translation: TranslationId;
  /** language the page must be written in (default: the Accept-Language header, then 'en') */
  locale?: Locale;
  /** what the client-side classifier recognised, as a hint (the server re-checks) */
  hint?: { passage?: PassageRef; topic?: string };
  /** bypass the page cache */
  regenerate?: boolean;
}

export interface AnswerRequest {
  /** follow-up question about the open study */
  question: string;
  study: Study;
  /** recent turns, oldest first (plain text) */
  history: { role: 'user' | 'assistant'; text: string }[];
  conversation: ConversationState;
  translation: TranslationId;
  /** language of the answer (default: the Accept-Language header, then 'en') */
  locale?: Locale;
}

/* ------------------------------------------------------------------ */
/* Evidence                                                            */
/* ------------------------------------------------------------------ */

export type EvidenceKind =
  | 'scripture' // Bible text (any bundled version: BSB, KJV, WEB, BLIVRE, RVR1909, LSG…)
  | 'original-text' // tagged Hebrew/Aramaic/Greek words
  | 'lexicon' // lexicon entry (TBESG/TBESH)
  | 'occurrences' // concordance counts / verse lists
  | 'cross-references' // OpenBible dataset references
  | 'study-note' // Tyndale Open Study Notes (verse notes)
  | 'book-introduction' // Tyndale book introductions
  | 'commentary' // public-domain commentary (Calvin, Henry, JFB, K&D, Gill, Clarke)
  | 'topical-index' // Nave's / Torrey's topical references
  | 'dictionary' // Easton's / Smith's Bible dictionaries
  | 'confession' // creeds, confessions, catechisms (public-domain texts)
  | 'curated'; // reviewed Emmaus curated study / topic content

/**
 * One retrieved item. The inference layer assigns `id` ("E1", "E2"…) in a per-request
 * ledger; generated claims must cite these ids, which the server resolves into Citations.
 */
export interface Evidence {
  id: string;
  kind: EvidenceKind;
  /** short human title, e.g. "Tyndale note on Matthew 19:3–9", "Nave’s: DIVORCE" */
  title: string;
  /** the retrieved text (what the model reads; the basis for quotation checks) */
  text: string;
  /** SourceRegistry id of the work (e.g. 'tyndale-open-study-notes', 'eastons-bible-dictionary') */
  sourceId: string;
  locator?: string;
  url?: string;
  /** Scripture the item is about / lists */
  refs?: PassageRef[];
  /** lexicon / occurrence items */
  strong?: string;
  /** author of this specific item when the source has several (e.g. Henry's continuators) */
  authorId?: string;
  /** the Christian tradition whose text this is (confessions, tradition-specific reference works), e.g. "Reformed", "Catholic" */
  tradition?: string;
  /** the license allows reproducing its wording (public domain / open license) */
  quotable: boolean;
}

export type EvidenceDraft = Omit<Evidence, 'id'>;

/* ------------------------------------------------------------------ */
/* Streamed events (Server-Sent Events)                                */
/* ------------------------------------------------------------------ */

/**
 * Wire format: `text/event-stream`; each event is
 *   event: <type>\n
 *   data: <JSON of the event object>\n\n
 * The stream always ends with `done` (after `error` too).
 */
export type InferenceEvent =
  /** a retrieval or composition step, as it happens ("Searching Nave’s Topical Bible for “divorce”") */
  | { type: 'progress'; step: PipelineStep }
  /** full snapshot of the page being composed; sent after every accepted section and at the end */
  | { type: 'study'; study: Study; complete: boolean }
  /** the chat reply (compose: the page's opening message; answer: the answer) */
  | { type: 'reply'; reply: ChatMessage; focus?: DashboardFocus; conversation?: ConversationState }
  | { type: 'error'; code: InferenceErrorCode; message: string }
  | { type: 'done' };

export type InferenceErrorCode =
  | 'no-credentials' // no API key / profile configured
  | 'no-credit' // the API account behind the server has no remaining credit
  | 'refusal' // the model (and its fallback) declined
  | 'rate-limited'
  | 'overloaded'
  | 'invalid-output' // the model could not produce a page that passes validation
  | 'aborted'
  | 'internal';

/** Serialise one event for the SSE stream (server side). */
export function encodeEvent(event: InferenceEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

/**
 * Incremental SSE decoder (client side): feed text chunks, get complete events.
 * Tolerates chunk boundaries anywhere, CRLF line endings and comment/heartbeat lines.
 */
export function createEventDecoder(): (chunk: string) => InferenceEvent[] {
  let buffer = '';
  return (chunk: string) => {
    buffer += chunk.replace(/\r\n/g, '\n');
    const out: InferenceEvent[] = [];
    let sep: number;
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const data = block
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).replace(/^ /, ''))
        .join('\n');
      if (!data) continue;
      try {
        out.push(JSON.parse(data) as InferenceEvent);
      } catch {
        /* malformed event: skip */
      }
    }
    return out;
  };
}
