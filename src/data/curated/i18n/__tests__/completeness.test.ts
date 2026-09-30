/**
 * Every curated study and topic must have a complete translation overlay in pt, es and fr,
 * and every translated key-word anchor must occur verbatim in that version's verse text.
 * (docs/I18N.md §4)
 */
import { describe, expect, it } from 'vitest';
import type { CuratedStudy, CuratedTopic, TranslationId } from '../../../../domain/models';
import { versionsFor } from '../../../../domain/translations';
import { verseKey } from '../../../../domain/reference';
import type { NonEnglishLocale } from '../../../../domain/bookNames';
import { createLocalDatasetProviders } from '../../../../providers/local';
import { createFsLoader } from '../../../../providers/local/__tests__/fsLoader';
import type { StudyOverlay, TopicOverlay } from '../types';

const studies = Object.values(import.meta.glob<CuratedStudy>('../../studies/*.ts', { eager: true, import: 'default' }));
const topics = Object.values(import.meta.glob<CuratedTopic>('../../topics/*.ts', { eager: true, import: 'default' }));
const overlays = import.meta.glob<StudyOverlay | TopicOverlay>('../*/*.ts', { eager: true, import: 'default' });

const LOCALES: NonEnglishLocale[] = ['pt', 'es', 'fr'];
const providers = createLocalDatasetProviders({ loader: createFsLoader(), allowRemoteFallback: false });

function overlayFor(locale: NonEnglishLocale, id: string) {
  return overlays[`../${locale}/${id}.ts`];
}

function missingStudyFields(s: CuratedStudy, o: StudyOverlay): string[] {
  const miss: string[] = [];
  const need = (cond: unknown, what: string) => {
    if (!cond) miss.push(what);
  };
  need(o.title, 'title');
  if (s.subtitle) need(o.subtitle, 'subtitle');
  if (s.summary) need(o.summary, 'summary');
  if (s.opening) need(o.opening, 'opening');
  need(o.suggestedQuestions?.length, 'suggestedQuestions');
  need(o.matchTopics?.length, 'matchTopics');
  if (s.topic) {
    need(o.topic?.name && o.topic.definition, 'topic');
    for (const p of s.topic.keyPassages) need(o.topicPassages?.[p.id]?.note && o.topicPassages[p.id].title, `topicPassage ${p.id}`);
  }
  for (const k of s.keyWords) need(o.keyWords?.[k.id]?.significance && o.keyWords[k.id].basicMeaning && o.keyWords[k.id].english, `keyWord ${k.id}`);
  for (const x of s.crossReferences) need(o.crossReferences?.[x.id]?.explanation && o.crossReferences[x.id].title, `crossRef ${x.id}`);
  for (const c of s.context) need(o.context?.[c.id]?.summary && o.context[c.id].title, `context ${c.id}`);
  for (const f of s.literary?.features ?? []) need(o.literary?.features?.[f.id]?.description, `literary ${f.id}`);
  if (s.literary) need(o.literary?.placeInBook, 'literary.placeInBook');
  for (const t of s.theology) need(o.theology?.[t.id]?.summary, `theme ${t.id}`);
  for (const ps of s.perspectives) {
    need(o.perspectives?.[ps.id]?.question, `perspectiveSet ${ps.id}`);
    for (const p of ps.perspectives) need(o.perspectives?.[ps.id]?.perspectives?.[p.id]?.summary, `perspective ${p.id}`);
  }
  for (const e of s.commentary) {
    if (e.kind === 'summary') need(o.commentary?.[e.id]?.text, `commentary ${e.id}`);
    else need(o.commentary?.[e.id]?.quoteTranslation, `quoteTranslation ${e.id}`);
  }
  const notesPerVerse = new Map<string, number>();
  for (const n of s.verseNotes) notesPerVerse.set(verseKey(n.verse), (notesPerVerse.get(verseKey(n.verse)) ?? 0) + 1);
  for (const [k, count] of notesPerVerse) need((o.verseNotes?.[k]?.length ?? 0) >= count, `verseNotes ${k}`);
  for (const c of s.concepts) need(o.concepts?.[c.id]?.answer && o.concepts[c.id].aliases?.length, `concept ${c.id}`);
  return miss;
}

describe.each(LOCALES)('curated translations — %s', (locale) => {
  it('every curated study has a complete overlay', () => {
    const problems: string[] = [];
    for (const s of studies) {
      const o = overlayFor(locale, s.id) as StudyOverlay | undefined;
      if (!o) {
        problems.push(`${s.id}: no overlay`);
        continue;
      }
      if (o.studyId !== s.id || o.locale !== locale) problems.push(`${s.id}: wrong studyId/locale`);
      const miss = missingStudyFields(s, o);
      if (miss.length) problems.push(`${s.id}: missing ${miss.slice(0, 12).join(', ')}${miss.length > 12 ? ` (+${miss.length - 12})` : ''}`);
    }
    expect(problems).toEqual([]);
  });

  it('every topic has a complete overlay', () => {
    const problems: string[] = [];
    for (const t of topics) {
      const o = overlayFor(locale, t.id) as TopicOverlay | undefined;
      if (!o) {
        problems.push(`${t.id}: no overlay`);
        continue;
      }
      if (!o.name || !o.definition || !o.aliases?.length || !o.question) problems.push(`${t.id}: missing name/definition/aliases/question`);
      for (const p of t.topic.keyPassages) if (!o.keyPassages?.[p.id]?.note) problems.push(`${t.id}: keyPassage ${p.id}`);
      for (const ps of t.perspectives ?? []) {
        if (!o.perspectives?.[ps.id]?.question) problems.push(`${t.id}: perspectiveSet ${ps.id}`);
        for (const p of ps.perspectives) if (!o.perspectives?.[ps.id]?.perspectives?.[p.id]?.summary) problems.push(`${t.id}: perspective ${p.id}`);
      }
      if (o.aliases?.some((a) => a !== a.toLowerCase())) problems.push(`${t.id}: aliases must be lowercase`);
    }
    expect(problems).toEqual([]);
  });

  it('translated anchors occur verbatim in their version’s verse text, and the default version is anchored', async () => {
    const versions = versionsFor(locale).map((v) => v.id);
    const problems: string[] = [];
    const cache = new Map<string, Map<number, string>>();
    const text = async (t: TranslationId, book: string, ch: number, v: number) => {
      const key = `${t}:${book}.${ch}`;
      if (!cache.has(key)) {
        const p = await providers.scripture.getPassage({ book, startChapter: ch }, t).catch(() => null);
        const m = new Map<number, string>();
        for (const c of p?.chapters ?? []) for (const verse of c.verses) m.set(verse.ref.verse, verse.poetryLines?.join(' ') ?? verse.text);
        cache.set(key, m);
      }
      return cache.get(key)!.get(v);
    };
    for (const s of studies) {
      const o = overlayFor(locale, s.id) as StudyOverlay | undefined;
      if (!o) continue;
      for (const k of s.keyWords) {
        const anchors = o.keyWords?.[k.id]?.anchors ?? [];
        const englishAnchored = k.anchors.some((a) => Object.keys(a.phrases).length > 0);
        if (englishAnchored && !anchors.some((a) => a.phrases[versions[0]])) problems.push(`${s.id} ${k.id}: no anchor for ${versions[0]}`);
        for (const a of anchors)
          for (const [t, phrase] of Object.entries(a.phrases)) {
            if (!versions.includes(t as TranslationId)) problems.push(`${s.id} ${k.id}: anchor for ${t} is not a ${locale} version`);
            const verse = await text(t as TranslationId, a.verse.book, a.verse.chapter, a.verse.verse);
            if (!verse) problems.push(`${s.id} ${k.id}: ${t} ${verseKey(a.verse)} missing`);
            else if (!verse.toLowerCase().includes(String(phrase).toLowerCase())) problems.push(`${s.id} ${k.id}: “${phrase}” not in ${t} ${verseKey(a.verse)}`);
          }
      }
    }
    expect(problems).toEqual([]);
  }, 120_000);
});
