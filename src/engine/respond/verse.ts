/**
 * explain-verse: the curated verse note (+ key words and cross-references from
 * that verse), else the Tyndale Open Study Note as an attributed excerpt, else
 * the verse text with an honest "no note" line.
 */
import type { MessageBlock, PassageRef, VerseRef } from '../../domain/models';
import { cite } from '../../domain/provenance';
import { formatRef, formatVerse, refIncludesVerse, refsOverlap, sameVerse, verseToPassage } from '../../domain/reference';
import type { Locale } from '../../i18n/locales';
import { engineT, explainVerseSuggestion, listJoin, mergeCitations, para, quoted, sanitizeInline, startSuggestions, tok, uniqueVerses, verseLabel, type ReplyDraft, psalmArticle } from '../compose';
import { conceptForVerse, crossRefsFromVerse, keyWordsInVerse } from '../search';
import { asSentence, cleanMarkup, excerpt } from '../text';
import { attempt, curatedPid, loc, nextConversation, pid, step, tr, type ResponderEnv } from './env';
import { studySuggestion, versesOf } from './open';

async function verseText(env: ResponderEnv, v: VerseRef): Promise<{ text: string; sourceId: string } | undefined> {
  const passage = await attempt(() => env.providers.scripture.getPassage(verseToPassage(v), env.ctx.translation), null);
  const verse = passage?.chapters.flatMap((c) => c.verses).find((x) => sameVerse(x.ref, v));
  return verse && passage ? { text: verse.text, sourceId: passage.sourceId } : undefined;
}

/** Tyndale Open Study Note covering the verse (most specific section first), as a ≤ 90-word excerpt. */
export async function tyndaleNote(env: ResponderEnv, v: VerseRef): Promise<{ text: string; ref: PassageRef; sourceId: string } | undefined> {
  const sections = await attempt(() => env.providers.commentary.getCommentary('tyndale', verseToPassage(v)), []);
  const containing = sections.filter((s) => refIncludesVerse(s.ref, v));
  const pool = containing.length ? containing : sections.filter((s) => refsOverlap(s.ref, verseToPassage(v)));
  const span = (r: PassageRef) => ((r.endChapter ?? r.startChapter) - r.startChapter) * 200 + ((r.endVerse ?? r.startVerse ?? 200) - (r.startVerse ?? 0));
  const best = [...pool].sort((a, b) => span(a.ref) - span(b.ref))[0];
  if (!best) return undefined;
  // Tyndale elides quoted phrases with spaced dots (". . ."): keep them as one ellipsis so sentences aren't split there.
  const text = sanitizeInline(excerpt(cleanMarkup(best.text).replace(/\s*\.\s\.\s\.(?:\s\.)?\s*/g, ' … '), 90));
  return text ? { text, ref: best.ref, sourceId: best.sourceId } : undefined;
}

/** "2:12 is just after this study’s passage (Eph 2:1–10)." — for a verse opened beside the study. */
function whereOutside(verse: VerseRef, passage: PassageRef | undefined, locale: Locale): string | undefined {
  if (!passage || passage.book !== verse.book) return undefined;
  const t = engineT(locale);
  const label = formatVerse(verse, 'short', locale);
  const span = formatRef(passage, 'short', locale);
  const endChapter = passage.endChapter ?? passage.startChapter;
  if (passage.endVerse != null && verse.chapter === endChapter && verse.verse > passage.endVerse && verse.verse - passage.endVerse <= 3) {
    return t('verse.justAfter', { label, span });
  }
  if (passage.startVerse != null && verse.chapter === passage.startChapter && verse.verse < passage.startVerse && passage.startVerse - verse.verse <= 3) {
    return t('verse.justBefore', { label, span });
  }
  return t('verse.outside', { label, span });
}

export async function respondExplainVerse(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study;
  const verse = env.intent.slots.verse ?? (env.parsed.lastVerse ? undefined : env.ctx.conversation.activeVerse);
  if (study && !verse && env.parsed.lastVerse) {
    return {
      blocks: [para(t('verse.noCount', { what: study.passage ? formatRef(study.passage, 'long', locale) : study.title }))],
      suggestions: [t('suggest.explainVerse', { n: 1 })],
      steps: [step('Scripture', t('trace.noVerseCount'), pid(env.providers.scripture, 'local:scripture'))],
      declined: true,
    };
  }
  if (!study || !verse) {
    const example = formatRef({ book: 'ROM', startChapter: 8, startVerse: 28, endChapter: 8, endVerse: 28 }, 'long', locale);
    const [romans8, john11, psalm23] = startSuggestions(locale);
    return {
      blocks: [para(study ? t('verse.which') : t('verse.whichPassage', { example: quoted(example, locale) }))],
      suggestions: study ? [t('suggest.explainVerse', { n: 1 }), t('suggest.explainLast')] : [romans8, john11, psalm23],
      steps: [step('Verse', t('trace.noVerse'), 'engine:intent')],
    };
  }
  const range = env.intent.slots.passage && env.intent.slots.passage.startVerse != null ? env.intent.slots.passage : undefined;
  const label = verseLabel(verse, study, locale);
  const steps = [];

  const count = await attempt(() => env.providers.scripture.getVerseCount(verse.book, verse.chapter), 0);
  if (count > 0 && verse.verse > count) {
    const chapter = formatRef({ book: verse.book, startChapter: verse.chapter }, 'long', locale);
    return {
      blocks: [para(t('verse.noSuchVerse', { chapter: psalmArticle(chapter, locale, true), count, verse: verse.verse }))],
      suggestions: [t('suggest.explainVerse', { n: count }), t('suggest.explainVerse', { n: 1 })],
      steps: [step('Scripture', t('trace.verseCount', { chapter, count }), pid(env.providers.scripture, 'local:scripture'))],
      declined: true,
    };
  }

  // the next verse — never past the chapter's last verse (Psalm 23 has six)
  const nextVerse = count > 0 && verse.verse >= count ? t('suggest.restOfScripture') : explainVerseSuggestion({ ...verse, verse: verse.verse + 1 }, study, locale);
  const inStudy = Boolean(study.passage && refIncludesVerse(study.passage, verse));
  const highlight = range ? uniqueVerses(versesOf(range)) : [verse];
  const kws = inStudy ? keyWordsInVerse(study, verse) : [];
  const xrefs = inStudy ? crossRefsFromVerse(study, verse) : [];
  const concept = inStudy ? conceptForVerse(study, verse) : undefined;
  const noteEntry = inStudy ? study.verseNotes.find((n) => sameVerse(n.verse, verse)) ?? (range ? study.verseNotes.find((n) => refIncludesVerse(range, n.verse)) : undefined) : undefined;
  const conversation = nextConversation(env.ctx.conversation, {
    activeVerse: verse,
    activeWordId: kws.length === 1 ? kws[0].id : undefined,
    activeConceptId: concept?.id,
  });
  const extras: MessageBlock[] = [];
  if (kws.length) extras.push(para(t('verse.keyWordsHere', { count: kws.length, words: kws.map((k) => `${tok.word(k.id)} (${k.english})`).join(', ') })));
  if (xrefs.length) extras.push(para(t('verse.compare', { refs: listJoin(xrefs.slice(0, 2).map((x) => `${tok.ref(x.target)} (${x.title})`), locale) })));
  const focusBase = {
    section: 'scripture' as const,
    highlightVerses: highlight,
    ...(kws.length ? { highlightWordIds: kws.map((k) => k.id) } : {}),
    ...(xrefs.length ? { pinIds: xrefs.slice(0, 4).map((x) => x.id) } : {}),
    reason: t('reason.fromQuestion', { what: range ? formatRef(range, 'short', locale) : formatVerse(verse, 'short', locale) }),
  };

  if (noteEntry) {
    steps.push(step('Verse notes', t('trace.curatedNote', { label }), curatedPid(study)));
    return {
      blocks: [para(`**${label}** — ${noteEntry.explanation.text}`), ...extras],
      focus: focusBase,
      conversation,
      citations: mergeCitations(noteEntry.explanation.provenance.citations, ...xrefs.slice(0, 2).map((x) => x.explanation.provenance.citations)),
      suggestions: [nextVerse, ...(kws[0] ? [t('suggest.meaning', { word: kws[0].english })] : [t('suggest.crossRefs')])],
      steps,
    };
  }

  const [vt, tn] = await Promise.all([verseText(env, verse), tyndaleNote(env, verse)]);
  const tnOn = tn ? t('cite.on', { ref: formatRef(tn.ref, 'short', locale) }) : '';
  steps.push(step('Scripture', vt ? `${formatVerse(verse, 'short', locale)} (${env.ctx.translation})` : t('trace.noVerseText'), pid(env.providers.scripture, 'local:scripture')));
  steps.push(step('Study notes', tn ? t('trace.tyndaleOn', { ref: formatRef(tn.ref, 'short', locale) }) : t('trace.noStudyNote'), pid(env.providers.commentary, 'local:commentary')));
  const blocks: MessageBlock[] = [];
  if (vt) blocks.push({ type: 'scripture', ref: verseToPassage(verse), text: vt.text, translation: env.ctx.translation });

  // A verse inside one of a topic study's key passages: answer with that passage's note, without leaving the topic.
  const kp = study.topic?.keyPassages.find((k) => refIncludesVerse(k.ref, verse));
  if (kp) {
    steps.push(step('Key passages', t('trace.inKeyPassage', { verse: formatVerse(verse, 'short', locale), title: kp.title, ref: formatRef(kp.ref, 'short', locale) }), curatedPid(study)));
    blocks.push(para(`**${tok.ref(kp.ref)} — ${asSentence(kp.title)}** ${excerpt(kp.note.text, 60)}`));
    if (tn) blocks.push(para(t('note.fromInline', { source: tok.source(tn.sourceId), ref: formatRef(tn.ref, 'short', locale), text: excerpt(tn.text, 45) })));
    return {
      blocks,
      focus: inStudy
        ? { ...focusBase, expandIds: [kp.id], pinIds: [...(focusBase.pinIds ?? []), kp.id] }
        : { section: 'key-passages', expandIds: [kp.id], pinIds: [kp.id], reason: t('reason.fromQuestion', { what: formatVerse(verse, 'short', locale) }) },
      ...(inStudy ? {} : { inspector: { type: 'passage' as const, ref: verseToPassage(verse), title: formatVerse(verse, 'long', locale) } }),
      conversation: nextConversation(env.ctx.conversation, { activeVerse: verse, activeWordId: undefined, activeConceptId: undefined }),
      citations: mergeCitations(kp.note.provenance.citations, tn ? [cite(tn.sourceId, tnOn)] : [], vt ? [cite(vt.sourceId)] : []),
      suggestions: [studySuggestion(kp.ref, locale), t('suggest.crossRefs')],
      steps,
    };
  }
  const outside = !inStudy;
  const inspector = outside ? { inspector: { type: 'passage' as const, ref: verseToPassage(verse), title: formatVerse(verse, 'long', locale) } } : {};
  const outsideSuggestion = outside ? [studySuggestion({ book: verse.book, startChapter: verse.chapter }, locale)] : [];
  // A verse outside the study passage opens beside it: say where it lies, and record that in the dashboard.
  const outsideNote = outside ? whereOutside(verse, study.passage, locale) : undefined;
  if (outsideNote) blocks.unshift(para(outsideNote));
  const short = formatVerse(verse, 'short', locale);
  const outsideFocus = outside
    ? { focus: { reason: t('reason.besideStudy', { ref: short }) }, updates: [{ section: 'scripture' as const, label: t('verse.openedBeside', { ref: short }) }] }
    : {};
  if (tn) {
    blocks.push(para(t('note.from', { source: tok.source(tn.sourceId), ref: formatRef(tn.ref, 'short', locale) })), para(`*${tn.text}*`), ...extras);
    return {
      blocks,
      ...(outside ? outsideFocus : { focus: focusBase }),
      ...inspector,
      conversation: outside ? env.ctx.conversation : conversation,
      provenance: { kind: 'commentary', verification: 'source-derived', citations: [cite(tn.sourceId, tnOn)] },
      citations: mergeCitations([cite(tn.sourceId, tnOn)], vt ? [cite(vt.sourceId)] : []),
      suggestions: [...outsideSuggestion, t('suggest.classicCommentators'), t('suggest.crossRefs')],
      steps,
    };
  }
  blocks.push(para(t('verse.noNote', { ref: formatVerse(verse, 'long', locale) })), ...extras);
  return {
    blocks,
    ...(outside ? outsideFocus : { focus: focusBase }),
    ...inspector,
    conversation: outside ? env.ctx.conversation : conversation,
    citations: vt ? [cite(vt.sourceId)] : [],
    suggestions: [...outsideSuggestion, t('suggest.crossRefs'), t('suggest.background')],
    steps,
    declined: true,
  };
}

