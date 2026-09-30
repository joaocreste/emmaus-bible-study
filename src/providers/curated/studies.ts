/**
 * CuratedStudyRepository over the curated study modules, in the reader's language:
 * every method takes an optional locale and returns studies with their translation
 * overlay applied (English when the study has no overlay in that language yet).
 * Topic queries match the English phrases and the reader's language — accents
 * optional ("graça" = "graca") — and, failing those, the phrases of any language.
 */
import type { CuratedStudy, PassageRef } from '../../domain/models';
import { chaptersOf, refContains, refsOverlap } from '../../domain/reference';
import type { Locale } from '../../i18n/locales';
import { normalizeTopicQuery, phraseScore } from '../../engine/text';
import type { CuratedStudyRepository } from '../types';
import { createLocalizer, type CuratedLocalizer } from './localization';

/** Rough size of a reference in verses (chapters without verse bounds count ~30 verses each). */
function approxSize(ref: PassageRef): number {
  const chapters = chaptersOf(ref).length;
  if (ref.startVerse == null) return chapters * 30;
  if (chapters === 1) return Math.max(1, (ref.endVerse ?? ref.startVerse) - ref.startVerse + 1);
  return (chapters - 1) * 30 + (ref.endVerse ?? 30);
}

/** Fraction of the requested reference's chapters touched by the study reference. */
function chapterCoverage(requested: PassageRef, studyRef: PassageRef): number {
  if (requested.book !== studyRef.book) return 0;
  const want = chaptersOf(requested);
  const have = new Set(chaptersOf(studyRef));
  return want.filter((c) => have.has(c)).length / want.length;
}

interface PassageCandidate {
  study: CuratedStudy;
  contains: boolean;
  size: number;
  coverage: number;
}

/**
 * Best passage study for a reference. Only studies of kind 'passage' whose
 * match.references overlap the reference qualify; a study that contains the
 * whole reference wins (the most specific — smallest — first); otherwise a
 * partial overlap must cover at least half of the requested chapters (so the
 * whole book of Romans does not open the Romans 8 study).
 */
export function findPassageStudy(studies: readonly CuratedStudy[], ref: PassageRef): CuratedStudy | undefined {
  const candidates: PassageCandidate[] = [];
  for (const study of studies) {
    if (study.kind !== 'passage') continue;
    let best: PassageCandidate | undefined;
    for (const m of study.match.references) {
      if (!refsOverlap(m, ref)) continue;
      const cand: PassageCandidate = { study, contains: refContains(m, ref), size: approxSize(m), coverage: chapterCoverage(ref, m) };
      if (!cand.contains && cand.coverage < 0.5) continue;
      if (!best || rank(cand, best) < 0) best = cand;
    }
    if (best) candidates.push(best);
  }
  candidates.sort(rank);
  return candidates[0]?.study;
}

function rank(a: PassageCandidate, b: PassageCandidate): number {
  if (a.contains !== b.contains) return a.contains ? -1 : 1;
  if (a.contains) return a.size - b.size;
  // partial overlaps: the study covering more of the request first
  return b.coverage - a.coverage || b.size - a.size;
}

/** Score a free-text topic query against a study's match.topics (0 when unrelated). */
export function topicScore(study: CuratedStudy, query: string): number {
  const q = normalizeTopicQuery(query);
  if (!q) return 0;
  let best = 0;
  for (const phrase of study.match.topics) {
    const p = normalizeTopicQuery(phrase);
    if (!p) continue;
    best = Math.max(best, phraseScore(q, p));
  }
  return best;
}

/**
 * Best study for a topic query: exact match, then phrase containment, then
 * token overlap (the thresholds live in `phraseScore`). Topic studies win ties.
 */
export function findTopicStudy(studies: readonly CuratedStudy[], query: string, minScore = 0.25): CuratedStudy | undefined {
  let best: { study: CuratedStudy; score: number } | undefined;
  for (const study of studies) {
    const score = topicScore(study, query);
    if (score < minScore) continue;
    if (!best || score > best.score || (score === best.score && study.kind === 'topic' && best.study.kind !== 'topic')) {
      best = { study, score };
    }
  }
  return best?.study;
}

export function createStudyRepository(studies: readonly CuratedStudy[], localizer: CuratedLocalizer = createLocalizer()): CuratedStudyRepository {
  const byId = new Map(studies.map((s) => [s.id, s]));
  const lists = new Map<Locale, readonly CuratedStudy[]>();
  const listFor = (locale?: Locale): readonly CuratedStudy[] => {
    if (!locale || locale === 'en') return studies;
    let list = lists.get(locale);
    if (!list) lists.set(locale, (list = studies.map((s) => localizer.study(s, locale))));
    return list;
  };
  // Every study with the topic phrases of every language (a reader typing in a language other than theirs).
  let everyLanguage: CuratedStudy[] | undefined;
  const multilingual = () =>
    (everyLanguage ??= studies.map((s) => ({ ...s, match: { ...s.match, topics: [...s.match.topics, ...localizer.studyPhrases(s.id)] } })));
  const inLocale = (study: CuratedStudy | undefined, locale?: Locale) => {
    const base = study && byId.get(study.id);
    return base ? localizer.study(base, locale) : undefined;
  };
  return {
    id: 'curated:studies',
    list: (locale) => [...listFor(locale)],
    get: (id, locale) => inLocale(byId.get(id), locale),
    findByPassage: (ref, locale) => inLocale(findPassageStudy(studies, ref), locale),
    findByTopic: (query, locale) => {
      const hit = findTopicStudy(listFor(locale), query) ?? (localizer.hasOverlays ? findTopicStudy(multilingual(), query) : undefined);
      return inLocale(hit, locale);
    },
  };
}
