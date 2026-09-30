/**
 * Apply translation overlays to curated studies/topics. Pure functions (framework-free).
 * Anything an overlay does not translate stays in English, so a partial overlay degrades
 * gracefully; the i18n completeness test keeps overlays complete.
 */
import type { CuratedStudy, CuratedTopic, ProvenancedText } from '../../../domain/models';
import type { Locale } from '../../../i18n/locales';
import type { StudyOverlay, TopicOverlay } from './types';
import { withLocalTags } from './tags';
import { verseKey } from '../../../domain/reference';
import { getBibleVersion } from '../../../domain/translations';
import { LOCALES } from '../../../i18n/locales';
import { localizeLocator } from '../../../domain/locator';

const pt = (t: ProvenancedText | undefined, text: string | undefined): ProvenancedText | undefined =>
  t && text ? { ...t, text } : t;

export function localizeStudy(study: CuratedStudy, overlay: StudyOverlay | undefined, locale: Locale): CuratedStudy {
  if (!overlay || locale === 'en') return study;
  const o = overlay;
  const noteCounters = new Map<string, number>();
  return withLocalTags(retargetScriptureCitations(localizedStudy(study, o, noteCounters), locale), locale);
}

/**
 * Translated prose quotes the language's default Bible (docs/I18N.md §4), so citations of the
 * English default (BSB) must name that version instead — otherwise a chip would credit the BSB
 * for Louis Segond's words. KJV/WEB citations stay: translated prose that discusses their
 * wording still quotes them. Locators ("note on Rom 8:1", "sermon, 9 Sept 2001") are shown in
 * the reader's language too ("nota sobre Rm 8:1"); the English data is unchanged.
 */
function retargetScriptureCitations<T>(value: T, locale: Locale): T {
  const target = getBibleVersion(LOCALES[locale].defaultTranslation).sourceId;
  const visit = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(visit);
    if (!node || typeof node !== 'object') return node;
    const obj = node as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = k === 'locator' && typeof v === 'string' ? localizeLocator(v, locale) : visit(v);
    if (typeof obj.sourceId === 'string' && obj.sourceId === 'bsb' && !('authorId' in obj) && !('title' in obj)) out.sourceId = target;
    return out;
  };
  return visit(value) as T;
}

function localizedStudy(study: CuratedStudy, o: StudyOverlay, noteCounters: Map<string, number>): CuratedStudy {
  return {
    ...study,
    title: o.title ?? study.title,
    subtitle: o.subtitle ?? study.subtitle,
    summary: pt(study.summary, o.summary),
    opening: pt(study.opening, o.opening),
    match: { ...study.match, topics: [...study.match.topics, ...(o.matchTopics ?? [])] },
    suggestedQuestions: o.suggestedQuestions ?? study.suggestedQuestions,
    topic: study.topic && {
      ...study.topic,
      name: o.topic?.name ?? study.topic.name,
      question: o.topic?.question ?? study.topic.question,
      definition: pt(study.topic.definition, o.topic?.definition)!,
      keyPassages: study.topic.keyPassages.map((p) => {
        const t = o.topicPassages?.[p.id];
        return t ? { ...p, title: t.title ?? p.title, group: t.group ?? p.group, note: pt(p.note, t.note)! } : p;
      }),
    },
    keyWords: study.keyWords.map((k) => {
      const t = o.keyWords?.[k.id];
      if (!t) return k;
      return {
        ...k,
        english: t.english ?? k.english,
        basicMeaning: t.basicMeaning ?? k.basicMeaning,
        semanticRange: t.semanticRange ?? k.semanticRange,
        grammar: t.grammar ?? k.grammar,
        caution: t.caution ?? k.caution,
        significance: pt(k.significance, t.significance)!,
        notableOccurrences: k.notableOccurrences.map((n, i) => ({ ...n, note: t.notableNotes?.[i] ?? n.note })),
        anchors: mergeAnchors(k.anchors, t.anchors),
      };
    }),
    crossReferences: study.crossReferences.map((x) => {
      const t = o.crossReferences?.[x.id];
      return t ? { ...x, title: t.title ?? x.title, explanation: pt(x.explanation, t.explanation)! } : x;
    }),
    context: study.context.map((c) => {
      const t = o.context?.[c.id];
      return t ? { ...c, title: t.title ?? c.title, summary: t.summary ?? c.summary, detail: t.detail ?? c.detail } : c;
    }),
    literary: study.literary && {
      ...study.literary,
      placeInBook: pt(study.literary.placeInBook, o.literary?.placeInBook)!,
      argument: pt(study.literary.argument, o.literary?.argument),
      placeInCanon: pt(study.literary.placeInCanon, o.literary?.placeInCanon),
      bookOutline: study.literary.bookOutline.map((s, i) => ({ ...s, label: o.literary?.bookOutline?.[i] ?? s.label })),
      passageOutline: study.literary.passageOutline?.map((s, i) => ({ ...s, label: o.literary?.passageOutline?.[i] ?? s.label })),
      features: study.literary.features.map((f) => {
        const t = o.literary?.features?.[f.id];
        if (!t) return f;
        return {
          ...f,
          title: t.title ?? f.title,
          description: t.description ?? f.description,
          structure: f.structure?.map((line, i) => ({ ...line, label: t.structure?.[i]?.label ?? line.label, text: t.structure?.[i]?.text ?? line.text })),
        };
      }),
    },
    theology: study.theology.map((th) => {
      const t = o.theology?.[th.id];
      return t ? { ...th, title: t.title ?? th.title, summary: t.summary ?? th.summary, detail: t.detail ?? th.detail } : th;
    }),
    perspectives: study.perspectives.map((ps) => {
      const t = o.perspectives?.[ps.id];
      if (!t) return ps;
      return {
        ...ps,
        question: t.question ?? ps.question,
        intro: t.intro ?? ps.intro,
        commonGround: t.commonGround ?? ps.commonGround,
        perspectives: ps.perspectives.map((p) => {
          const tp = t.perspectives?.[p.id];
          return tp ? { ...p, tradition: tp.tradition ?? p.tradition, label: tp.label ?? p.label, summary: tp.summary ?? p.summary } : p;
        }),
      };
    }),
    commentary: study.commentary.map((e) => {
      const t = o.commentary?.[e.id];
      if (!t) return e;
      if (e.kind === 'quotation') return { ...e, lead: t.lead ?? e.lead, translatedText: t.quoteTranslation };
      return { ...e, lead: t.lead ?? e.lead, text: t.text ?? e.text };
    }),
    sermons: study.sermons.map((s) => {
      const t = o.sermons?.[s.id];
      return t && s.summary ? { ...s, summary: pt(s.summary, t.summary) } : s;
    }),
    verseNotes: study.verseNotes.map((n) => {
      const key = verseKey(n.verse);
      const i = noteCounters.get(key) ?? 0;
      noteCounters.set(key, i + 1);
      const text = o.verseNotes?.[key]?.[i];
      return text ? { ...n, explanation: { ...n.explanation, text } } : n;
    }),
    concepts: study.concepts.map((c) => {
      const t = o.concepts?.[c.id];
      if (!t) return c;
      return { ...c, label: t.label ?? c.label, aliases: [...c.aliases, ...(t.aliases ?? [])], answer: pt(c.answer, t.answer)! };
    }),
  };
}

export function localizeTopic(topic: CuratedTopic, overlay: TopicOverlay | undefined, locale: Locale): CuratedTopic {
  if (!overlay || locale === 'en') return topic;
  return withLocalTags(retargetScriptureCitations(localizedTopic(topic, overlay), locale), locale);
}

function localizedTopic(topic: CuratedTopic, o: TopicOverlay): CuratedTopic {
  return {
    ...topic,
    name: o.name ?? topic.name,
    aliases: [...topic.aliases, ...(o.aliases ?? [])],
    suggestedQuestions: o.suggestedQuestions ?? topic.suggestedQuestions,
    topic: {
      ...topic.topic,
      name: o.name ?? topic.topic.name,
      question: o.question ?? topic.topic.question,
      definition: pt(topic.topic.definition, o.definition)!,
      keyPassages: topic.topic.keyPassages.map((p) => {
        const t = o.keyPassages?.[p.id];
        return t ? { ...p, title: t.title ?? p.title, group: t.group ?? p.group, note: pt(p.note, t.note)! } : p;
      }),
    },
    perspectives: topic.perspectives?.map((ps) => {
      const t = o.perspectives?.[ps.id];
      if (!t) return ps;
      return {
        ...ps,
        question: t.question ?? ps.question,
        intro: t.intro ?? ps.intro,
        commonGround: t.commonGround ?? ps.commonGround,
        perspectives: ps.perspectives.map((p) => {
          const tp = t.perspectives?.[p.id];
          return tp ? { ...p, tradition: tp.tradition ?? p.tradition, label: tp.label ?? p.label, summary: tp.summary ?? p.summary } : p;
        }),
      };
    }),
  };
}

function mergeAnchors<T extends { verse: { book: string; chapter: number; verse: number }; phrases: Record<string, string | undefined> }>(
  base: T[],
  extra: T[] | undefined,
): T[] {
  if (!extra?.length) return base;
  const out = base.map((a) => ({ ...a, phrases: { ...a.phrases } }));
  for (const e of extra) {
    const same = out.find((a) => a.verse.book === e.verse.book && a.verse.chapter === e.verse.chapter && a.verse.verse === e.verse.verse);
    if (same) Object.assign(same.phrases, e.phrases);
    else out.push({ ...e, phrases: { ...e.phrases } });
  }
  return out;
}
