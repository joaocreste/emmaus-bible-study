/**
 * Complex questions — "In an abusive relationship, with no partnership, is divorce possible,
 * and may I think of marrying again?" — are studies in their own right, not follow-ups:
 * the reader gets a page composed for the question (key passages, words, context, theology,
 * voices), with its key points (the study's concepts) answered one by one.
 *
 * Shared by the client engines (routing, the library fallback) and the server (the compose
 * prompt), so both sides agree on what counts as one. Plain text heuristics, no providers.
 */
import type { Study } from '../domain/models';
import { contentTokens, fold, normalizePhrase, normalizeTopicQuery, stem } from './text';
import type { Intent, IntentKind } from './types';

/** Opening words of a question, folded (en, pt, es, fr). */
const INTERROGATIVE =
  /^(what|whats|why|how|when|where|who|whom|which|is|are|was|were|can|could|may|might|must|should|shall|will|would|do|does|did|has|have|if|o que|que|qual|quais|quem|como|quando|onde|por que|porque|pode|podem|posso|devo|deve|existe|ha|e possivel|seria|se|cual|cuales|quien|cuando|donde|puede|pueden|puedo|debo|debe|es posible|hay|est ce que|est ce|qu est ce|quel|quelle|quels|quelles|qui|comment|quand|ou|pourquoi|peut on|puis je|dois je|faut il|y a t il|est il)\b/;

/** The message points at the open page ("this verse", "esse texto", "ici") — a follow-up, whatever its length. */
const DEICTIC =
  /\b((this|these|that|those) (passage|verse|verses|chapter|text|page|study|word|section|story)|here|above|(esse|essa|este|esta|nesse|nessa|neste|nesta|desse|dessa|deste|desta|aquele|aquela) (passagem|versiculo|versiculos|capitulo|texto|pagina|estudo|palavra|trecho|secao|historia)|aqui|(ese|esa|este|esta|estos|estas) (pasaje|versiculo|versiculos|capitulo|texto|pagina|estudio|palabra|seccion|historia)|(ce|cet|cette|ces) (passage|verset|versets|chapitre|texte|page|etude|mot|section|recit)|ici|ci dessus)\b/;

/**
 * Clause joiners that make one question several ("…, and…", "e", "y", "et", "ou"). Tested on
 * the unfolded text, so Portuguese "é" (is) is not taken for "e" (and); Spanish "o" (or) is
 * left out because it is also the Portuguese article.
 */
const JOINER = /,|;|\b(and|or|but|e|ou|mas|y|pero|et|mais)\b/;

/** Content words of the question once its frame ("what does the Bible say about") is dropped. */
export function questionSubstance(message: string): string[] {
  const core = normalizeTopicQuery(message) || message;
  return Array.from(new Set(contentTokens(core)));
}

/** A second question inside the first: "…, and can I remarry?", "e posso…", "y puedo…", "et puis-je…". */
const SECOND_QUESTION =
  /\b(and|or|but|e|ou|mas|y|pero|et|mais) (\S+ )?(can|could|may|might|should|must|is|are|do|does|what|how|why|when|posso|pode|podem|devo|deve|como|quando|puedo|puede|pueden|debo|debe|es|cuando|puis|peut|peuvent|dois|doit|est|comment|pourquoi|quand)\b/;

/**
 * Several questions in one: clauses set off by commas or semicolons, or a second question
 * joined to the first. With a page open, only such questions leave it for a page of their
 * own — a single detailed question ("Why did Ezra make the exiles send their wives away?")
 * is a follow-up.
 */
export function isMultiPartQuestion(message: string): boolean {
  if (!isComplexQuestion(message)) return false;
  const text = message.trim().replace(/\?\s*$/, '');
  return /[,;]/.test(text) || SECOND_QUESTION.test(fold(text).replace(/[‘’'`-]/g, ' ').replace(/\s+/g, ' '));
}

/**
 * A self-contained question with several parts: phrased as a question, not pointing at the
 * open page, and carrying at least five content words (four when its clauses are joined).
 * "Is it wrong to be rich?" or "What did Keller say about divorce?" are not; the abusive-
 * relationship question above is.
 */
export function isComplexQuestion(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  const folded = fold(text).replace(/[‘’'`-]/g, ' ').replace(/\s+/g, ' ');
  const asked = text.includes('?') || INTERROGATIVE.test(folded.replace(/^[¿¡"“«\s]+/, ''));
  if (!asked || DEICTIC.test(folded)) return false;
  const words = questionSubstance(text).length;
  return words >= 5 || (words >= 4 && JOINER.test(text.normalize('NFC').toLowerCase()));
}

/**
 * Share of the question's content words the open page already names (title, subtitle,
 * question, topic, key passage titles, suggested questions, concept labels and aliases,
 * theme and perspective headings). A
 * question the page mostly covers is a follow-up about it; one that it does not is a
 * new study.
 */
export function pageCoverage(
  message: string,
  study: {
    title: string;
    subtitle?: string;
    topic?: { name: string; question?: string; keyPassages: { title: string }[] };
    concepts: { label: string; aliases: string[] }[];
    suggestedQuestions: string[];
    theology: { title: string }[];
    perspectives: { question: string }[];
    generation?: { query: string };
  },
): number {
  const words = questionSubstance(message).map(stem);
  if (!words.length) return 1;
  const page = new Set(
    [
      study.title,
      study.subtitle ?? '',
      study.topic?.name ?? '',
      study.topic?.question ?? '',
      study.generation?.query ?? '',
      ...(study.topic?.keyPassages ?? []).map((k) => k.title),
      ...study.suggestedQuestions,
      ...study.concepts.flatMap((c) => [c.label, ...c.aliases]),
      ...study.theology.map((t) => t.title),
      ...study.perspectives.map((p) => p.question),
    ].flatMap((s) => contentTokens(s).map(stem)),
  );
  return words.filter((w) => page.has(w)).length / words.length;
}

/**
 * Intents a complex question may come in as (the rest name a passage, a word or the page itself).
 * "What do theologians say about…" reads as a commentary request; it is a question of its own unless it names an author.
 */
const QUESTION_KINDS: ReadonlySet<IntentKind> = new Set(['unknown', 'open-topic', 'theology', 'perspectives', 'historical-context', 'commentary', 'help']);

/**
 * The reader asked a complex question of its own: it deserves its own page rather than a
 * chat answer from the open one. Not when it names a passage, verse, word or author (the
 * other routes handle those); with a page open, only a question in several parts that the
 * page does not already cover (nor suggest).
 */
export function asksNewQuestion(message: string, intent: Intent, open: Study | null): boolean {
  const s = intent.slots;
  if (s.passage || s.verse || s.term || s.authorId || s.authorName || s.invalidChapter) return false;
  if (!QUESTION_KINDS.has(intent.kind) || !isComplexQuestion(message)) return false;
  if (!open) return true;
  if (!isMultiPartQuestion(message)) return false;
  // a question the page itself suggests is a follow-up on it
  const asked = normalizePhrase(message);
  if (open.suggestedQuestions.some((q) => normalizePhrase(q) === asked)) return false;
  return pageCoverage(message, open) < COVERED;
}

/** Share of a question's content words an open page must name for the question to count as a follow-up. */
const COVERED = 0.6;
