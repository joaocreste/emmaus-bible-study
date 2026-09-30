/**
 * Language layer of the curated providers (docs/I18N.md §4): translation overlays
 * indexed by locale and id, localized studies and topics (cached, so a study keeps
 * its identity across calls), and the phrases of every language used to match a
 * query typed in a language other than the reader's.
 *
 * A study served in pt/es/fr carries `localization: { locale, translatedFrom: 'en' }`
 * when an overlay translated it, or `{ locale: 'en' }` while it has no overlay yet
 * (its prose is still English). English studies are returned untouched.
 */
import type { CuratedStudy, CuratedTopic } from '../../domain/models';
import type { NonEnglishLocale } from '../../domain/bookNames';
import type { Locale } from '../../i18n/locales';
import { localizeStudy, localizeTopic } from '../../data/curated/i18n/localize';
import type { StudyOverlay, TopicOverlay } from '../../data/curated/i18n/types';
import type { CuratedOverlays } from './modules';

export const OVERLAY_LOCALES: readonly NonEnglishLocale[] = ['pt', 'es', 'fr'];

export interface CuratedLocalizer {
  /** true when at least one overlay is loaded */
  readonly hasOverlays: boolean;
  /** the study in the reader's language (the same object for the same study and locale) */
  study(study: CuratedStudy, locale?: Locale): CuratedStudy;
  /** the topic-index entry in the reader's language */
  topic(topic: CuratedTopic, locale?: Locale): CuratedTopic;
  studyOverlay(id: string, locale: NonEnglishLocale): StudyOverlay | undefined;
  topicOverlay(id: string, locale: NonEnglishLocale): TopicOverlay | undefined;
  /** topic phrases every overlay adds to a study (matchTopics + topic name), all languages */
  studyPhrases(id: string): string[];
  /** aliases (and names) every overlay adds to a topic-index entry, all languages */
  topicPhrases(id: string): string[];
}

const isForeign = (locale: Locale | undefined): locale is NonEnglishLocale => Boolean(locale && locale !== 'en');

export function createLocalizer(overlays: CuratedOverlays = { studies: [], topics: [] }): CuratedLocalizer {
  const studyOverlays = new Map<string, StudyOverlay>();
  const topicOverlays = new Map<string, TopicOverlay>();
  for (const o of overlays.studies) if (!studyOverlays.has(`${o.locale}:${o.studyId}`)) studyOverlays.set(`${o.locale}:${o.studyId}`, o);
  for (const o of overlays.topics) if (!topicOverlays.has(`${o.locale}:${o.topicId}`)) topicOverlays.set(`${o.locale}:${o.topicId}`, o);

  const studyCache = new WeakMap<CuratedStudy, Map<NonEnglishLocale, CuratedStudy>>();
  const topicCache = new WeakMap<CuratedTopic, Map<NonEnglishLocale, CuratedTopic>>();

  const studyPhrases = new Map<string, string[]>();
  for (const o of overlays.studies) {
    const list = studyPhrases.get(o.studyId) ?? [];
    list.push(...(o.matchTopics ?? []), ...(o.topic?.name ? [o.topic.name] : []));
    studyPhrases.set(o.studyId, list);
  }
  const topicPhrases = new Map<string, string[]>();
  for (const o of overlays.topics) {
    const list = topicPhrases.get(o.topicId) ?? [];
    list.push(...(o.aliases ?? []), ...(o.name ? [o.name] : []));
    topicPhrases.set(o.topicId, list);
  }

  return {
    hasOverlays: studyOverlays.size + topicOverlays.size > 0,
    study(study, locale) {
      if (!isForeign(locale)) return study;
      let byLocale = studyCache.get(study);
      if (!byLocale) studyCache.set(study, (byLocale = new Map()));
      let out = byLocale.get(locale);
      if (!out) {
        const overlay = studyOverlays.get(`${locale}:${study.id}`);
        out = overlay
          ? { ...localizeStudy(study, overlay, locale), localization: { locale, translatedFrom: 'en' } }
          : { ...study, localization: { locale: 'en' } };
        byLocale.set(locale, out);
      }
      return out;
    },
    topic(topic, locale) {
      if (!isForeign(locale)) return topic;
      let byLocale = topicCache.get(topic);
      if (!byLocale) topicCache.set(topic, (byLocale = new Map()));
      let out = byLocale.get(locale);
      if (!out) {
        out = localizeTopic(topic, topicOverlays.get(`${locale}:${topic.id}`), locale);
        byLocale.set(locale, out);
      }
      return out;
    },
    studyOverlay: (id, locale) => studyOverlays.get(`${locale}:${id}`),
    topicOverlay: (id, locale) => topicOverlays.get(`${locale}:${id}`),
    studyPhrases: (id) => studyPhrases.get(id) ?? [],
    topicPhrases: (id) => topicPhrases.get(id) ?? [],
  };
}
