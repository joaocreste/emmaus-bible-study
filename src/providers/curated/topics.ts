/**
 * TopicProvider over the curated topic index (src/data/curated/topics) plus a
 * synthesized entry for every curated topic study (id = study id).
 *
 * Returned matches are `CuratedTopicMatch` — a TopicMatch that also carries the
 * index entry's anchor passage, perspectives and suggested questions, which the
 * engine needs to assemble a library topic study.
 *
 * With a locale, entries come back translated (overlays applied) and queries match
 * the reader's language and English alike, accents optional; a query that matches
 * nothing there is tried against every language's aliases.
 */
import type { CuratedStudy, CuratedTopic, PassageRef, PerspectiveSet, TopicDefinition } from '../../domain/models';
import type { Locale } from '../../i18n/locales';
import { normalizePhrase, normalizeTopicQuery, phraseScore } from '../../engine/text';
import type { TopicMatch, TopicProvider } from '../types';
import { createLocalizer, type CuratedLocalizer } from './localization';

export interface CuratedTopicMatch extends TopicMatch {
  /** passage shown in the Scripture section when the topic opens */
  anchor?: PassageRef;
  perspectives?: PerspectiveSet[];
  suggestedQuestions?: string[];
  /** the topic-index entry (absent for entries synthesized from a curated topic study) */
  entry?: CuratedTopic;
}

type IndexEntry = Omit<CuratedTopicMatch, 'score'>;

function fromTopic(t: CuratedTopic): IndexEntry {
  return {
    id: t.id,
    name: t.name,
    aliases: t.aliases,
    topic: t.topic,
    ...(t.studyId ? { studyId: t.studyId } : {}),
    ...(t.anchor ? { anchor: t.anchor } : {}),
    ...(t.perspectives ? { perspectives: t.perspectives } : {}),
    ...(t.suggestedQuestions ? { suggestedQuestions: t.suggestedQuestions } : {}),
    entry: t,
  };
}

function studyTopic(study: CuratedStudy): TopicDefinition {
  return (
    study.topic ?? {
      name: study.title,
      definition: study.summary ?? { text: study.subtitle ?? study.title, provenance: { kind: 'synthesis', verification: 'editorial', citations: [] } },
      keyPassages: [],
    }
  );
}

/** Build the merged index: topic modules, then curated topic studies (merged into an entry that links to them). */
export function buildTopicIndex(topics: readonly CuratedTopic[], studies: readonly CuratedStudy[]): IndexEntry[] {
  const entries = topics.map(fromTopic);
  for (const study of studies) {
    if (study.kind !== 'topic') continue;
    const linked = entries.find((e) => e.id === study.id || e.studyId === study.id);
    if (linked) {
      linked.studyId = study.id;
      linked.aliases = Array.from(new Set([...linked.aliases, ...study.match.topics]));
      continue;
    }
    entries.push({
      id: study.id,
      name: study.topic?.name ?? study.title,
      aliases: [...study.match.topics],
      topic: studyTopic(study),
      studyId: study.id,
      ...(study.passage ? { anchor: study.passage } : {}),
      ...(study.perspectives.length ? { perspectives: study.perspectives } : {}),
      suggestedQuestions: study.suggestedQuestions,
    });
  }
  return entries;
}

/** Score a query against a topic: its aliases and name (0–1). */
export function scoreTopic(entry: Pick<TopicMatch, 'name' | 'aliases'>, query: string): number {
  const q = normalizeTopicQuery(query) || normalizePhrase(query);
  if (!q) return 0;
  let best = 0;
  for (const phrase of [entry.name, ...entry.aliases]) {
    const p = normalizeTopicQuery(phrase) || normalizePhrase(phrase);
    if (p) best = Math.max(best, phraseScore(q, p));
  }
  return best;
}

interface LocalizedIndexItem {
  entry: IndexEntry;
  /** also matched in this language: the English names */
  extra: string[];
  /** fallback: the aliases of every language */
  everyLanguage: string[];
}

export function createTopicProvider(
  topics: readonly CuratedTopic[],
  studies: readonly CuratedStudy[],
  minScore = 0.3,
  localizer: CuratedLocalizer = createLocalizer(),
): TopicProvider {
  // English names and every language's phrases, by entry id (from the English index)
  const english = new Map<string, { names: string[]; everyLanguage: string[] }>();
  for (const e of buildTopicIndex(topics, studies)) {
    const phrases = [...localizer.topicPhrases(e.id), ...(e.studyId ? localizer.studyPhrases(e.studyId) : [])];
    english.set(e.id, { names: [e.name, e.topic.name], everyLanguage: [...e.aliases, ...phrases] });
  }
  const indexes = new Map<Locale, LocalizedIndexItem[]>();
  const indexFor = (locale?: Locale): LocalizedIndexItem[] => {
    const key: Locale = locale ?? 'en';
    let idx = indexes.get(key);
    if (!idx) {
      const entries = buildTopicIndex(
        topics.map((t) => localizer.topic(t, key)),
        studies.map((s) => localizer.study(s, key)),
      );
      idx = entries.map((entry) => ({
        entry,
        extra: key === 'en' ? [] : (english.get(entry.id)?.names ?? []),
        everyLanguage: english.get(entry.id)?.everyLanguage ?? [],
      }));
      indexes.set(key, idx);
    }
    return idx;
  };
  const rank = (items: LocalizedIndexItem[], query: string, phrases: (i: LocalizedIndexItem) => string[]) =>
    items
      .map((i): CuratedTopicMatch => ({ ...i.entry, score: scoreTopic({ name: i.entry.name, aliases: phrases(i) }, query) }))
      .filter((m) => m.score >= minScore)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return {
    id: 'curated:topics',
    async findTopics(query, locale) {
      const idx = indexFor(locale);
      const found = rank(idx, query, (i) => [...i.entry.aliases, ...i.extra]);
      if (found.length || !localizer.hasOverlays) return found;
      return rank(idx, query, (i) => [...i.entry.aliases, ...i.extra, ...i.everyLanguage]);
    },
    async listTopics(locale) {
      return indexFor(locale)
        .map((i): CuratedTopicMatch => ({ ...i.entry, score: 1 }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  };
}
