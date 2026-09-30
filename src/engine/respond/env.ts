/** Shared context and helpers for the per-intent responders. */
import type { ConversationState, CuratedStudy, PassageRef, PipelineStep, Study, VerseRef } from '../../domain/models';
import { chaptersOf, refContains, refIncludesVerse, refsOverlap } from '../../domain/reference';
import type { Locale } from '../../i18n/locales';
import type { ProviderRegistry } from '../../providers/types';
import type { StudyAssembler } from '../assemble';
import { engineT, type Translate } from '../compose';
import type { ParsedMessage } from '../intent';
import { conceptById } from '../search';
import type { EngineContext, Intent } from '../types';

export interface ResponderEnv {
  providers: ProviderRegistry;
  assembler: StudyAssembler;
  ctx: EngineContext;
  /** the study the responder works on (the current one, or one just opened for this message) */
  study: Study | null;
  parsed: ParsedMessage;
  intent: Intent;
  /** the original user message */
  message: string;
}

/** The reader's language (English by default). */
export function loc(env: { ctx?: Pick<EngineContext, 'locale'> }): Locale {
  return env.ctx?.locale ?? 'en';
}

/** The engine catalog in the reader's language. */
export function tr(env: { ctx?: Pick<EngineContext, 'locale'> }): Translate {
  return engineT(loc(env));
}

/** Run a provider call; on failure (missing dataset, network) return the fallback. */
export async function attempt<T>(fn: () => Promise<T> | T, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export function step(stage: string, detail: string, provider?: string): PipelineStep {
  return provider ? { stage, detail, provider } : { stage, detail };
}

/** Provider id for trace lines — tolerant of partially implemented registries. */
export function pid(p: { id?: string } | undefined, fallback: string): string {
  try {
    return p?.id ?? fallback;
  } catch {
    return fallback;
  }
}

export function curatedPid(study: Study): string {
  return study.depth === 'curated' ? `curated:${study.id}` : `library:${study.id}`;
}

/** The concept the conversation is about ("this"), if any. */
export function activeConcept(env: ResponderEnv) {
  return env.study ? conceptById(env.study, env.ctx.conversation.activeConceptId) : undefined;
}

/** Keep the conversation state, overriding some fields (undefined values clear them). */
export function nextConversation(prev: ConversationState, patch: Partial<Record<keyof ConversationState, unknown>>): ConversationState {
  const out: ConversationState = { ...prev };
  for (const [k, v] of Object.entries(patch) as [keyof ConversationState, unknown][]) {
    if (v === undefined) delete out[k];
    else (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

/**
 * The part of a study passage to scan for a word or dataset references: a
 * single verse when given, else the active chapter of multi-chapter passages.
 */
export function scanScope(study: Study, verse?: VerseRef, activeVerse?: VerseRef): PassageRef | undefined {
  if (verse) return { book: verse.book, startChapter: verse.chapter, startVerse: verse.verse, endChapter: verse.chapter, endVerse: verse.verse };
  const p = study.passage;
  if (!p) return undefined;
  const chapters = chaptersOf(p);
  if (chapters.length <= 1) return p;
  const chapter = activeVerse && refIncludesVerse(p, activeVerse) ? activeVerse.chapter : p.startChapter;
  return { book: p.book, startChapter: chapter };
}

/** Every curated study (in the reader's language), or none when the repository is unavailable. */
export function curatedList(env: Pick<ResponderEnv, 'providers'> & { ctx?: Pick<EngineContext, 'locale'> }): CuratedStudy[] {
  try {
    return env.providers.studies.list(loc(env));
  } catch {
    return [];
  }
}

/**
 * Curated studies (passage or topic) whose anchor references overlap a passage —
 * those that contain it first, then the smallest anchor. A topic study such as
 * Suffering is anchored in 2 Corinthians 4:7–18, so it speaks to 2 Corinthians 4.
 */
export function curatedAnchoredIn(env: Pick<ResponderEnv, 'providers'> & { ctx?: Pick<EngineContext, 'locale'> }, ref: PassageRef, exceptId?: string): { study: CuratedStudy; anchor: PassageRef; contains: boolean }[] {
  const out: { study: CuratedStudy; anchor: PassageRef; contains: boolean }[] = [];
  for (const s of curatedList(env)) {
    if (s.id === exceptId) continue;
    const anchors = s.match.references.filter((m) => refsOverlap(m, ref));
    if (!anchors.length) continue;
    const containing = anchors.find((m) => refContains(m, ref));
    out.push({ study: s, anchor: containing ?? anchors[0], contains: Boolean(containing) });
  }
  return out.sort((a, b) => Number(b.contains) - Number(a.contains));
}

/** A study title for prose: "Romans 8", "the Grace study" ("o estudo Graça", "el estudio Gracia", "l’étude Grâce"). */
export function studyName(study: Study, locale: Locale = 'en'): string {
  if (locale === 'en') return study.kind === 'topic' ? `the ${study.title} study` : study.title;
  return engineT(locale)('studyName', { kind: study.kind, title: study.title });
}
