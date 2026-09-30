/**
 * commentary: a named author's curated entries (verified quotations quoted,
 * summaries introduced as summaries), else their public-domain commentary from
 * the CommentaryProvider, else an honest decline. No author → voices by era.
 */
import { citationAuthorName, localizeAuthor } from '../../domain/attribution';
import type { Author, CommentaryEntry, CommentaryInfo, Era, MessageBlock, PassageRef, SermonRecord, Study, VerseRef } from '../../domain/models';
import { tryGetBook } from '../../domain/books';
import { cite } from '../../domain/provenance';
import { localizeDates, localizeLocator } from '../../domain/locator';
import { formatRef, refIncludesVerse, refsOverlap, sameVerse, verseToPassage } from '../../domain/reference';
import { explainVerseSuggestion, list, listJoin, mergeCitations, note, para, sanitizeInline, tok, verseLabel, type ReplyDraft } from '../compose';
import { bestPhraseScore, cleanMarkup, excerpt } from '../text';
import { activeConcept, attempt, curatedPid, loc, pid, step, studyName, tr, type ResponderEnv } from './env';
import { openSuggestion } from './open';

// Authors in the base registry are all men; plural entries are commentary teams. Anyone else → "their".
const HIS = new Set([
  'augustine', 'chrysostom', 'athanasius', 'aquinas', 'luther', 'calvin', 'john-owen', 'matthew-henry', 'john-gill', 'wesley',
  'edwards', 'adam-clarke', 'spurgeon', 'james-strong', 'bonhoeffer', 'cs-lewis', 'billy-graham', 'john-stott', 'ji-packer',
  'rc-sproul', 'tim-keller', 'john-piper', 'nt-wright', 'da-carson',
]);

export function possessive(authorId: string): 'his' | 'their' {
  return HIS.has(authorId) ? 'his' : 'their';
}

/** "Keller", "Augustine", "Lewis"; teams keep their full name. */
/** Compact author name for chat prose ("Spurgeon", "John of Damascus", "Keil & Delitzsch"). */
export function shortName(author: Author): string {
  return citationAuthorName(author);
}

const ERA_ORDER: Era[] = ['early-church', 'medieval', 'reformation', 'post-reformation', 'modern', 'contemporary', 'ancient'];

function rankEntries(env: ResponderEnv, entries: CommentaryEntry[]): CommentaryEntry[] {
  const concept = activeConcept(env);
  const verse = env.intent.slots.verse ?? env.ctx.conversation.activeVerse;
  const term = env.intent.slots.term;
  return entries
    .map((e, i) => {
      let score = 0;
      if (concept?.commentaryIds.includes(e.id)) score += 4;
      if (concept) score += 2 * Math.max(0, ...e.tags.map((t) => bestPhraseScore(t, [concept.label, ...concept.aliases])));
      if (term) score += 2 * Math.max(0, ...e.tags.map((t) => bestPhraseScore(t, [term])));
      if (verse && e.relatedVerses?.some((v) => v.book === verse.book && v.chapter === verse.chapter && v.verse === verse.verse)) score += 1;
      return { e, i, score };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.e);
}

/** A locator without the work's title/year repeated ("Walking with God… (2013)" → ""). */
function cleanLocator(locator: string | undefined, title: string | undefined, year: string | undefined): string {
  if (!locator) return '';
  let l = locator;
  if (title) {
    l = l.replace(title, '');
    const short = title.split(/\s*[(:—–]/)[0].trim();
    if (short.length >= 6) l = l.replace(short, '');
  }
  if (year) l = l.replace(`(${year})`, '');
  // a removed quoted title leaves its quotation marks behind ("“,” 11 December 2016")
  l = l.replace(/[“"‘']\s*[,;:.]?\s*[”"’']/g, ' ').replace(/\s+/g, ' ');
  l = l.replace(/^[\s,;:–—-]+|[\s,;:–—-]+$/g, '').trim();
  return l ? `, ${l}` : '';
}

function entryBlocks(env: ResponderEnv, e: CommentaryEntry, author: Author, maxWords: number): MessageBlock[] {
  const t = tr(env);
  const src = env.providers.sources.getSource(e.sourceId);
  const year = src?.year?.replace(/\s*\(.*\)\s*/g, '').trim();
  const title = src ? `*${src.title}*${year ? ` (${year})` : ''}` : t('comm.citedWork');
  const locator = cleanLocator(localizeLocator(e.locator, loc(env)), src?.title, src?.year);
  const who = shortName(author);
  if (e.kind === 'quotation' && e.provenance.verification === 'verified') {
    return [para(t('comm.writes', { title, locator, who })), { type: 'quote', commentaryId: e.id }];
  }
  if (e.kind === 'quotation') {
    return [para(t('comm.unverified', { who, title, locator, text: excerpt(e.text, maxWords) }))];
  }
  return [para(t('comm.summary', { who, title, locator, text: excerpt(e.text, maxWords) }))];
}

async function authorSermons(env: ResponderEnv, study: Study, authorId: string): Promise<SermonRecord[]> {
  const own = study.sermons.filter((s) => s.authorId === authorId);
  const more = study.passage ? await attempt(() => env.providers.sermons.findSermons({ authorId, ref: study.passage }), []) : [];
  const seen = new Set(own.map((s) => s.id));
  return [...own, ...more.filter((s) => !seen.has(s.id))];
}

/** A registry author as the reader's language names them ("Agostinho de Hipona", "Juan Calvino"); English unchanged. */
function authorOf(env: ResponderEnv, id: string): Author | undefined {
  return localizeAuthor(env.providers.sources.getAuthor(id), loc(env));
}

/** Public-domain commentaries written by this author (via the source registry). */
function commentariesBy(env: ResponderEnv, authorId: string): CommentaryInfo[] {
  try {
    return env.providers.commentary.listCommentaries().filter((c) => env.providers.sources.getSource(c.sourceId)?.authorIds.includes(authorId));
  } catch {
    return [];
  }
}

function focusVerse(env: ResponderEnv, study: Study): VerseRef | undefined {
  const v = env.intent.slots.verse ?? env.ctx.conversation.activeVerse;
  if (v && study.passage && refIncludesVerse(study.passage, v)) return v;
  const p = study.passage;
  return p ? { book: p.book, chapter: p.startChapter, verse: p.startVerse ?? 1 } : undefined;
}

async function classicExcerpt(env: ResponderEnv, commentaryId: string, verse: VerseRef): Promise<{ text: string; ref: PassageRef; sourceId: string } | undefined> {
  const sections = await attempt(() => env.providers.commentary.getCommentary(commentaryId, verseToPassage(verse)), []);
  const hit = sections.find((s) => refIncludesVerse(s.ref, verse)) ?? sections.find((s) => refsOverlap(s.ref, verseToPassage(verse))) ?? sections[0];
  if (!hit) return undefined;
  const text = sanitizeInline(excerpt(cleanMarkup(hit.text), 80));
  return text ? { text, ref: hit.ref, sourceId: hit.sourceId } : undefined;
}

async function namedAuthor(env: ResponderEnv, study: Study, authorId: string): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const author = authorOf(env, authorId);
  const name = author?.name ?? env.intent.slots.authorName ?? authorId;
  const who = author ? shortName(author) : name;
  const entries = rankEntries(env, study.commentary.filter((e) => e.authorId === authorId));
  const sermons = await authorSermons(env, study, authorId);

  if (entries.length && author) {
    const top = entries.slice(0, 2);
    const blocks = top.flatMap((e) => entryBlocks(env, e, author, top.length === 1 ? 70 : 38));
    // asked about a verse the author's entries do not cover: say so before quoting another verse
    const asked = env.intent.slots.verse;
    const other = top[0].relatedVerses?.[0];
    if (asked && other && !top.some((e) => e.relatedVerses?.some((v) => sameVerse(v, asked)))) {
      blocks.unshift(para(t('comm.notOnVerse', { who, verse: verseLabel(asked, study, locale), other: verseLabel(other, study, locale) })));
    }
    if (sermons[0]) {
      blocks.push(para(t('comm.sermon', { pronoun: possessive(authorId), who, title: sermons[0].title, date: sermons[0].date ? ` (${localizeDates(sermons[0].date, locale)})` : '' })));
    }
    return {
      blocks,
      focus: {
        section: 'commentary',
        commentaryAuthorIds: [authorId],
        expandIds: top.map((e) => e.id),
        pinIds: entries.map((e) => e.id),
        reason: t('reason.fromQuestion', { what: t('comm.authorOn', { name, title: study.title }) }),
      },
      citations: mergeCitations(...top.map((e) => [cite(e.sourceId, e.locator, e.url), ...e.provenance.citations])),
      suggestions: [t('suggest.otherCommentators'), t('suggest.interpretationsPassage')],
      steps: [step('Commentary', t('trace.curatedEntries', { count: entries.length, name }), curatedPid(study))],
    };
  }

  // Public-domain commentary by this author (Calvin, Matthew Henry, JFB, Keil & Delitzsch…)
  const verse = focusVerse(env, study);
  for (const info of commentariesBy(env, authorId)) {
    if (!verse) break;
    const book = tryGetBook(verse.book);
    if (book && !info.testaments.includes(book.testament)) continue;
    const ex = await classicExcerpt(env, info.id, verse);
    if (!ex) continue;
    const label = formatRef(ex.ref, 'short', locale);
    const on = t('cite.on', { ref: label });
    return {
      blocks: [para(t('comm.classic', { name, pronoun: possessive(authorId), work: info.name, ref: label, source: tok.source(ex.sourceId) })), para(`*${ex.text}*`)],
      focus: { section: 'commentary', highlightVerses: [verse], reason: t('reason.fromQuestion', { what: t('comm.authorCommentaryOn', { name, ref: verseLabel(verse, study, locale) }) }) },
      provenance: { kind: 'commentary', verification: 'source-derived', citations: [cite(ex.sourceId, on)] },
      citations: [cite(ex.sourceId, on)],
      suggestions: [t('suggest.otherCommentators'), explainVerseSuggestion(verse, study, locale)],
      steps: [
        step('Commentary', t('trace.noCuratedEntryBy', { name }), curatedPid(study)),
        step('Classic commentary', t('trace.workOn', { work: info.name, ref: label }), pid(env.providers.commentary, 'local:commentary')),
      ],
    };
  }

  // Honest decline.
  const elsewhere = safeList(env).filter(
    (s) => s.id !== study.id && (s.commentary.some((e) => e.authorId === authorId) || s.sermons.some((x) => x.authorId === authorId)),
  );
  const voices = uniqueAuthors(env, study).map((a) => a.name);
  const blocks: MessageBlock[] = [para(t('comm.noSource', { name, who, title: study.title, pronoun: possessive(authorId) }))];
  if (elsewhere.length) blocks.push(para(t('comm.appearsIn', { who, studies: listJoin(elsewhere.map((s) => `**${s.title}**`), locale), count: elsewhere.length })));
  if (voices.length) {
    blocks.push(
      para(t(voices.length > 6 ? 'comm.hearFromMore' : 'comm.hearFrom', { name: studyName(study, locale), kind: study.kind, title: study.title, voices: listJoin(voices.slice(0, 6), locale) })),
    );
  }
  blocks.push(note('info', t('comm.nothingInvented')));
  return {
    blocks,
    focus: { section: 'commentary', commentaryAuthorIds: [], reason: t('reason.noSource', { name, title: study.title }) },
    suggestions: [...elsewhere.slice(0, 2).map((s) => openSuggestion(s, locale)), ...(voices[0] ? [t('suggest.authorSays', { name: voices[0] })] : [])],
    steps: [
      step('Author', `“${env.intent.slots.authorName ?? name}” → ${authorId}`, 'curated:sources'),
      step('Commentary', t('trace.noAuthorSource', { name, title: study.title }), curatedPid(study)),
    ],
    declined: true,
  };
}

function safeList(env: ResponderEnv) {
  try {
    return env.providers.studies.list(loc(env));
  } catch {
    return [];
  }
}

function uniqueAuthors(env: ResponderEnv, study: Study): Author[] {
  const ids = Array.from(new Set(study.commentary.map((c) => c.authorId)));
  return ids.map((id) => authorOf(env, id)).filter((a): a is Author => Boolean(a));
}

/** "sermon(s)", "preach…" in the four languages (folded text). */
const SERMON_RE = /\b(sermons?|preach|preached|preaching|preachers?|sermao|sermoes|pregac\w*|pregador\w*|pregou|sermones|predica\w*|predicador\w*|predicacion\w*|predication\w*|predicateur\w*|preche\w*)\b/;

async function overview(env: ResponderEnv, study: Study): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const wantsSermons = (locale === 'en' ? /\b(sermons?|preach|preached|preaching|preachers?)\b/ : SERMON_RE).test(env.parsed.lower);
  if (wantsSermons && study.sermons.length) {
    const items = study.sermons.slice(0, 4).map((s) => {
      const a = authorOf(env, s.authorId);
      return `*${s.title}* — ${a?.name ?? s.authorId}${s.date ? ` (${localizeDates(s.date, locale)})` : ''}`;
    });
    return {
      blocks: [para(t('comm.sermonsOn', { title: study.title })), list(items)],
      focus: { section: 'commentary', commentaryAuthorIds: [], reason: t('reason.fromQuestion', { what: t('reason.sermons') }) },
      citations: study.sermons.slice(0, 4).map((s) => cite(s.sourceId, undefined, s.url)),
      steps: [step('Sermons', t('trace.sermonRecords', { count: study.sermons.length }), pid(env.providers.sermons, 'curated:sermons'))],
    };
  }
  const authors = uniqueAuthors(env, study);
  if (authors.length) {
    const byEra = ERA_ORDER.map((era) => ({ era, names: authors.filter((a) => a.era === era).map((a) => a.name) })).filter((g) => g.names.length);
    const hasSummaries = study.commentary.some((c) => c.kind === 'summary');
    return {
      blocks: [
        para(t('comm.gathers', { name: studyName(study, locale), kind: study.kind, title: study.title, count: authors.length })),
        list(byEra.map((g) => `**${t(`era.${g.era}`)}** — ${listJoin(g.names, locale)}`)),
        para(t('comm.checked', { summaries: hasSummaries ? 'yes' : 'no' })),
      ],
      focus: { section: 'commentary', commentaryAuthorIds: [], reason: t('reason.fromQuestion', { what: t('section.commentary') }) },
      suggestions: authors.slice(0, 2).map((a) => t('suggest.authorSays', { name: shortName(a) })),
      steps: [step('Commentary', t('trace.curatedEntriesAuthors', { count: study.commentary.length, authors: authors.length }), curatedPid(study))],
    };
  }
  // Library study: classic commentaries + a Tyndale excerpt.
  const verse = focusVerse(env, study);
  const testament = study.passage ? tryGetBook(study.passage.book)?.testament : undefined;
  const available = (() => {
    try {
      return env.providers.commentary.listCommentaries().filter((c) => !testament || c.testaments.includes(testament));
    } catch {
      return [];
    }
  })();
  const ex = verse ? await classicExcerpt(env, 'tyndale', verse) : undefined;
  const asked = env.intent.slots.verse ?? env.ctx.conversation.activeVerse;
  const classicAuthors = available
    .filter((c) => c.style === 'classic')
    .flatMap((c) => env.providers.sources.getSource(c.sourceId)?.authorIds ?? [])
    .map((id) => authorOf(env, id))
    .filter((a): a is Author => Boolean(a));
  const blocks: MessageBlock[] = [
    para(available.length ? t('comm.noVoicesPanel', { section: tok.section('commentary'), works: listJoin(available.map((c) => c.name), locale) }) : t('comm.noVoices')),
  ];
  const exRef = ex ? formatRef(ex.ref, 'short', locale) : '';
  if (ex) blocks.push(para(t('note.from', { source: tok.source(ex.sourceId), ref: exRef })), para(`*${excerpt(ex.text, 70)}*`));
  return {
    blocks,
    focus: { section: 'commentary', ...(asked && verse ? { highlightVerses: [verse] } : {}), reason: t('reason.fromQuestion', { what: t('reason.classicCommentaries') }) },
    ...(ex ? { provenance: { kind: 'commentary' as const, verification: 'source-derived' as const, citations: [cite(ex.sourceId, t('cite.on', { ref: exRef }))] } } : {}),
    citations: ex ? [cite(ex.sourceId, t('cite.on', { ref: exRef }))] : [],
    suggestions: classicAuthors.slice(0, 2).map((a) => t('suggest.authorSays', { name: a.name })),
    steps: [
      step('Commentary', t('trace.noCuratedVoices'), curatedPid(study)),
      step('Classic commentary', ex ? t('trace.tyndaleOn', { ref: exRef }) : t('trace.noStudyNote'), pid(env.providers.commentary, 'local:commentary')),
    ],
  };
}

export async function respondCommentary(env: ResponderEnv): Promise<ReplyDraft> {
  const study = env.study!;
  const authorId = env.intent.slots.authorId;
  return authorId ? namedAuthor(env, study, authorId) : overview(env, study);
}

/** Without a study: open the curated study where the named author speaks to the topic, if any. */
export function studiesWithAuthor(env: ResponderEnv, authorId: string) {
  return safeList(env).filter((s) => s.commentary.some((e) => e.authorId === authorId));
}
