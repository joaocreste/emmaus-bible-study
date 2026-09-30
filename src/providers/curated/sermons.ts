/**
 * SermonProvider over the sermon records declared by curated studies.
 *
 * Sermon records are catalogued in English ("grace"). A topic asked in another
 * language ("graça", "gracia", "grâce") also matches the English phrases of the
 * study or topic whose translated phrases it names.
 */
import type { CuratedStudy, CuratedTopic, SermonRecord } from '../../domain/models';
import { refsOverlap } from '../../domain/reference';
import { normalizeTopicQuery, phraseScore } from '../../engine/text';
import type { SermonProvider } from '../types';
import { createLocalizer, type CuratedLocalizer } from './localization';

export function createSermonProvider(
  studies: readonly CuratedStudy[],
  localizer: CuratedLocalizer = createLocalizer(),
  topics: readonly CuratedTopic[] = [],
): SermonProvider {
  const sermons: SermonRecord[] = [];
  const seen = new Set<string>();
  for (const study of studies) {
    for (const s of study.sermons ?? []) {
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      sermons.push(s);
    }
  }

  // [translated phrases, English phrases] of every study and topic-index entry that has an overlay
  const groups: { translated: string[]; english: string[] }[] = [
    ...studies.map((s) => ({ translated: localizer.studyPhrases(s.id), english: s.match.topics })),
    ...topics.map((t) => ({ translated: localizer.topicPhrases(t.id), english: [t.name, ...t.aliases] })),
  ]
    .filter((g) => g.translated.length > 0)
    .map((g) => ({ translated: g.translated.map((p) => normalizeTopicQuery(p)).filter(Boolean), english: g.english.map((p) => normalizeTopicQuery(p)).filter(Boolean) }));

  /** The query plus the English phrases it stands for. */
  const equivalents = (topic: string): string[] => {
    const out = [topic];
    for (const g of groups) if (g.translated.some((p) => phraseScore(topic, p) >= 0.9)) out.push(...g.english);
    return Array.from(new Set(out));
  };

  return {
    id: 'curated:sermons',
    async findSermons(query) {
      const topic = query.topic ? normalizeTopicQuery(query.topic) : '';
      const wanted = topic ? equivalents(topic) : [];
      return sermons.filter((s) => {
        if (query.authorId && s.authorId !== query.authorId) return false;
        if (query.ref && !s.refs.some((r) => refsOverlap(r, query.ref!))) return false;
        if (topic && !s.topics.some((t) => wanted.some((w) => phraseScore(w, normalizeTopicQuery(t)) >= 0.5))) return false;
        return true;
      });
    },
  };
}
