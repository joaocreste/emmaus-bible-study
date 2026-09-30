/** open-passage / open-topic: curated study first, then a library study, else an honest reply. */
import type { CuratedStudy, DashboardUpdate, MessageBlock, PassageRef, Study, VerseRef } from '../../domain/models';
import { getBook } from '../../domain/books';
import { formatRef, formatVerse, parseRefKey, refContains, refKey } from '../../domain/reference';
import type { Locale } from '../../i18n/locales';
import type { TopicMatchLike } from '../assemble';
import { bookName, engineT, list, listJoin, mergeCitations, para, quoted, tok, type ReplyDraft, psalmArticle } from '../compose';
import { bestPhraseScore, contentTokens, excerpt, fold, normalizeTopicQuery, stem } from '../text';
import { attempt, curatedAnchoredIn, loc, pid, step, tr, type ResponderEnv } from './env';

/** Up to `max` verses of a verse-level reference (single chapter), for highlighting. */
export function versesOf(ref: PassageRef, max = 12): VerseRef[] {
  if (ref.startVerse == null) return [];
  const endChapter = ref.endChapter ?? ref.startChapter;
  const end = endChapter === ref.startChapter ? (ref.endVerse ?? ref.startVerse) : ref.startVerse + max - 1;
  const out: VerseRef[] = [];
  for (let v = ref.startVerse; v <= end && out.length < max; v++) out.push({ book: ref.book, chapter: ref.startChapter, verse: v });
  return out;
}

/** Titles of the curated studies, for honest "what is available" lines. */
export function curatedTitles(env: ResponderEnv): string[] {
  return attemptSync(() => env.providers.studies.list(loc(env)).map((s) => s.title), []);
}

/** "Study Romans 8" / "Explore grace": a suggestion that opens a curated study, in the reader's language. */
export function openSuggestion(study: Pick<CuratedStudy, 'kind' | 'title' | 'match'>, locale: Locale = 'en'): string {
  const t = engineT(locale);
  if (study.kind !== 'topic') return t('suggest.study', { ref: study.title });
  // English topic phrases come first in `match.topics`; other languages name the (translated) title.
  return t('suggest.explore', { topic: locale === 'en' ? (study.match.topics[0] ?? study.title) : study.title, title: study.title });
}

/** A "Study <reference>" suggestion. */
export function studySuggestion(ref: PassageRef, locale: Locale = 'en'): string {
  return engineT(locale)('suggest.study', { ref: formatRef(ref, 'long', locale) });
}

function attemptSync<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function openingBlocks(study: Study, locale: Locale): MessageBlock[] {
  const raw = study.opening?.text ?? study.summary?.text ?? engineT(locale)('open.fallback', { title: study.title });
  return raw
    .split(/\n{2,}/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(para);
}

/** "Study updated" lines for a freshly opened study. */
export function openUpdates(study: Study, locale: Locale = 'en'): DashboardUpdate[] {
  const t = engineT(locale);
  const u: DashboardUpdate[] = [{ section: study.passage ? 'scripture' : 'key-passages', label: t('open.update.opened', { title: study.title, depth: study.depth === 'curated' ? 'curated' : 'library' }) }];
  const n = study.topic?.keyPassages.length ?? 0;
  if (study.kind === 'topic' && n) u.push({ section: 'key-passages', label: t('open.update.keyPassages', { count: n }) });
  if (study.keyWords.length) u.push({ section: 'original-languages', label: t('open.update.keyWords', { count: study.keyWords.length }) });
  if (study.crossReferences.length) u.push({ section: 'cross-references', label: t('open.update.crossRefs', { count: study.crossReferences.length }) });
  const voices = new Set(study.commentary.map((c) => c.authorId)).size;
  if (voices) u.push({ section: 'commentary', label: t('open.update.voices', { count: voices }) });
  if (study.depth === 'library' && study.kind === 'passage') {
    u.push({ section: 'cross-references', label: t('open.update.datasetXrefs') });
    u.push({ section: 'commentary', label: t('open.update.notes') });
  }
  if (study.depth === 'library' && study.perspectives.length) u.push({ section: 'theology', label: t('open.update.questions', { count: study.perspectives.length }) });
  return u.slice(0, 4);
}

/** The topic asked about is the one already open: answer with its orientation instead of re-opening it. */
function alreadyInTopic(env: ResponderEnv, study: Study, steps: ReplyDraft['steps']): ReplyDraft {
  const t = tr(env);
  const def = study.topic!.definition;
  return {
    blocks: [para(excerpt(def.text, 85)), para(t('open.topicPassages', { section: tok.section('key-passages') }))],
    focus: { section: 'key-passages', reason: t('reason.fromQuestion', { what: study.topic!.question ?? study.title }) },
    citations: def.provenance.citations,
    suggestions: study.suggestedQuestions,
    steps: [...steps, step('Topic', t('trace.alreadyInTopic', { id: study.id }), pid(env.providers.topics, 'curated:topics'))],
    alreadyOpen: true,
  };
}

/** Open a curated study (optionally at a narrower reference). */
export function openCurated(env: ResponderEnv, curated: CuratedStudy, requested?: PassageRef): ReplyDraft {
  const locale = loc(env);
  const t = tr(env);
  const study = env.assembler.fromCurated(curated, locale);
  const narrowed = requested && study.passage && requested.startVerse != null && refContains(study.passage, requested) ? requested : undefined;
  const already = env.ctx.study?.id === study.id;
  const steps = [
    step('Library', t('trace.curatedMatches', { id: curated.id }), pid(env.providers.studies, 'curated:studies')),
    step('Assembly', t('trace.assembly', { keyWords: study.keyWords.length, crossRefs: study.crossReferences.length, sources: study.sourceIds.length }), 'engine:assembler'),
  ];
  if (already && study.kind === 'topic' && study.topic && !narrowed) return alreadyInTopic(env, study, steps);
  if (already) {
    const verses = narrowed ? versesOf(narrowed) : [];
    return {
      blocks: [para(narrowed ? t('open.alreadyHighlighted', { title: study.title, ref: tok.ref(narrowed) }) : t('open.alreadyIn', { title: study.title }))],
      ...(verses.length ? { focus: { section: 'scripture', highlightVerses: verses, reason: t('reason.fromQuestion', { what: formatRef(narrowed!, 'long', locale) }) } } : { focus: { section: 'scripture' } }),
      conversation: verses[0] ? { ...env.ctx.conversation, activeVerse: verses[0] } : env.ctx.conversation,
      suggestions: study.suggestedQuestions,
      steps,
      alreadyOpen: true,
    };
  }
  const verses = narrowed ? versesOf(narrowed) : [];
  const blocks = openingBlocks(study, locale);
  if (narrowed) {
    blocks.unshift(
      para(
        study.kind === 'topic' && study.passage
          ? t('open.anchoredAt', { ref: tok.ref(narrowed), anchor: tok.ref(study.passage), title: study.title })
          : t('open.curatedAt', { title: study.title, ref: tok.ref(narrowed) }),
      ),
    );
  }
  return {
    blocks,
    study,
    ...(verses.length ? { focus: { section: 'scripture', highlightVerses: verses, reason: t('reason.openedAt', { ref: formatRef(narrowed!, 'long', locale) }) } } : {}),
    updates: openUpdates(study, locale),
    customUpdatesOnly: true,
    conversation: verses[0] ? { activeVerse: verses[0] } : {},
    suggestions: study.suggestedQuestions,
    citations: study.opening?.provenance.citations ?? study.summary?.provenance.citations ?? [],
    ...(study.opening ? { provenance: study.opening.provenance } : {}),
    steps,
  };
}

/** Open a library study for any passage. */
export function openLibraryPassage(env: ResponderEnv, ref: PassageRef): ReplyDraft {
  const locale = loc(env);
  const t = tr(env);
  const study = env.assembler.libraryPassage(ref, { locale, translation: env.ctx.translation });
  const book = getBook(ref.book);
  const language = book.testament === 'NT' ? 'greek' : 'hebrew';
  const curated = curatedTitles(env);
  const steps = [
    step('Library', t('trace.noCuratedPassage'), pid(env.providers.studies, 'curated:studies')),
    step('Assembly', t('trace.libraryAssembly', { language }), 'engine:assembler'),
  ];
  if (env.ctx.study?.id === study.id) {
    return {
      blocks: [para(t('open.alreadyIn', { title: study.title }))],
      focus: { section: 'scripture' },
      suggestions: study.suggestedQuestions,
      steps,
      alreadyOpen: true,
    };
  }
  // A curated study anchored in (part of) this passage — e.g. Suffering in 2 Corinthians 4:7–18.
  const anchored = curatedAnchoredIn(env, ref)[0];
  const openAnchored = anchored ? openSuggestion(anchored.study, locale) : undefined;
  if (anchored) {
    steps[0] = step(
      'Library',
      t('trace.anchoredElsewhere', { ref: formatRef(ref, 'long', locale), id: anchored.study.id, anchor: formatRef(anchored.anchor, 'short', locale) }),
      pid(env.providers.studies, 'curated:studies'),
    );
  }
  // the Bible text the library study reads (the BSB in English; the reader's version when the registry knows it)
  const sourceId = study.summary?.provenance.citations[0]?.sourceId ?? 'bsb';
  const blocks = [
    para(t('library.opened', { title: study.title, source: tok.source(sourceId), language })),
    anchored
      ? para(t('library.anchored', { title: anchored.study.title, ref: tok.ref(anchored.anchor) }))
      : para(curated.length ? t('library.interlinearCurated', { studies: listJoin(curated, locale) }) : t('library.interlinear')),
  ];
  return {
    blocks,
    study,
    updates: openUpdates(study, locale),
    customUpdatesOnly: true,
    conversation: {},
    suggestions: [...(openAnchored ? [openAnchored] : []), ...study.suggestedQuestions],
    citations: study.summary?.provenance.citations ?? [],
    steps,
  };
}

export async function respondOpenPassage(env: ResponderEnv, refOverride?: PassageRef): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const missing = refOverride ? undefined : env.intent.slots.invalidChapter;
  if (missing) {
    const book = getBook(missing.book);
    const name = bookName(book.id, locale);
    const last = formatRef({ book: book.id, startChapter: book.chapters }, 'long', locale);
    return {
      blocks: [para(t('open.noSuchChapter', { book: name, chapters: book.chapters, chapter: missing.chapter }))],
      suggestions: [t('suggest.study', { ref: last }), t('suggest.study', { ref: name })],
      steps: [step('Reference', t('trace.chapterOutOfRange', { book: name, chapter: missing.chapter, chapters: book.chapters }), 'domain:books')],
    };
  }
  const ref = refOverride ?? env.intent.slots.passage;
  if (!ref) return respondOpenTopic(env);
  const current = env.ctx.study;
  const label = formatRef(ref, 'long', locale);
  const parseStep = step('Reference', t('trace.parsed', { label, key: refKey(ref) }), 'domain:reference');

  // A chapter inside the current study (e.g. "Matthew 6" inside Matthew 5–7): scroll there, don't switch.
  if (current?.passage && refContains(current.passage, ref) && refKey(ref) !== refKey(current.passage) && ref.startVerse == null) {
    const first: VerseRef = { book: ref.book, chapter: ref.startChapter, verse: 1 };
    return {
      blocks: [para(t('open.partOfStudy', { ref: tok.ref(ref) }))],
      focus: { section: 'scripture', highlightVerses: [first], reason: t('reason.fromQuestion', { what: label }) },
      conversation: { ...env.ctx.conversation, activeVerse: first },
      steps: [parseStep],
    };
  }

  // Validate verse numbers against the translation when possible.
  if (ref.startVerse != null) {
    const count = await attempt(() => env.providers.scripture.getVerseCount(ref.book, ref.startChapter), 0);
    if (count > 0 && ref.startVerse > count) {
      const chapter = formatRef({ book: ref.book, startChapter: ref.startChapter }, 'long', locale);
      const lastVerse = locale === 'en' ? `${chapter}:${count}` : formatVerse({ book: ref.book, chapter: ref.startChapter, verse: count }, 'long', locale);
      return {
        blocks: [para(t('open.noSuchVerse', { chapter: psalmArticle(chapter, locale, true), count, ref: label }))],
        suggestions: [t('suggest.study', { ref: chapter }), t('suggest.explain', { ref: lastVerse })],
        steps: [parseStep, step('Scripture', t('trace.verseCount', { chapter, count }), pid(env.providers.scripture, 'local:scripture'))],
        declined: true,
      };
    }
  }

  const curated = curatedForPassage(env, ref);
  const draft = curated ? openCurated(env, curated, ref) : openLibraryPassage(env, ref);
  draft.steps.unshift(parseStep);
  // "I want to understand the Sermon on the Mount" → say which passage the name refers to
  const named = env.parsed.namedPassage;
  if (named && draft.study) {
    const plural = /[^s]s$/.test(named.split(' ').pop() ?? '');
    const name = locale === 'en' ? titleCase(named) : named.charAt(0).toUpperCase() + named.slice(1);
    draft.blocks.unshift(para(t('open.namedPassage', { name, plural: plural ? 'yes' : 'no', ref: tok.ref(ref) })));
  }
  return draft;
}

/** "sermon on the mount" → "Sermon on the Mount", "lord's prayer" → "Lord's Prayer". */
function titleCase(name: string): string {
  const small = new Set(['on', 'the', 'of', 'and', 'at', 'to', 'in', 'a', 'an', 'with', 'for']);
  return name
    .split(' ')
    .map((w, i) => (i > 0 && small.has(w) ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

/**
 * The curated study for a reference: a passage study that covers it, else — for a
 * verse-level reference — a topic study whose anchor passage contains it
 * ("Eph 2:8–9" → Grace, anchored in Ephesians 2:1–10).
 */
export function curatedForPassage(env: Pick<ResponderEnv, 'providers'> & { ctx?: Pick<ResponderEnv['ctx'], 'locale'> }, ref: PassageRef): CuratedStudy | undefined {
  const byPassage = attemptSync(() => env.providers.studies.findByPassage(ref, loc(env)), undefined);
  if (byPassage) return byPassage;
  if (ref.startVerse == null) return undefined;
  return curatedAnchoredIn(env, ref).find((a) => a.contains && a.study.kind === 'topic')?.study;
}

// Words too general to decide a topic on their own when a query only partly matches an alias.
const GENERIC_TOPIC_WORDS = new Set(['god', 'jesus', 'christ', 'lord', 'bible', 'scripture', 'christian', 'christians', 'people', 'life', 'man', 'world', 'who', 'is'].map(stem));

/** Does a partial topic match share a distinctive word with the query ("the kingdom" ~ "kingdom of god": yes; "jesus" ~ "faith in jesus": no)? */
function sharesDistinctiveWord(query: string, match: Pick<TopicMatchLike, 'name' | 'aliases'>): boolean {
  const q = new Set(contentTokens(query).map(stem));
  return [match.name, ...match.aliases].some((a) => contentTokens(a).map(stem).some((t) => q.has(t) && !GENERIC_TOPIC_WORDS.has(t)));
}

/** "Who is Jesus?", "Is Jesus God?", "Jesus Christ" (also "Quem é Jesus?", "¿Quién es Jesús?", "Qui est Jésus ?"). */
function isAboutChrist(topic: string): boolean {
  const t = normalizeTopicQuery(topic);
  if (/^(?:(?:who|what) (?:is|was) )?(?:jesus|christ|jesus christ|the christ|the messiah|messiah)(?: (?:really|really god|god|divine|human|the son of god|son of god))?$/.test(t) || /^(?:is|was) (?:jesus|christ) (?:god|divine|human|the son of god|the messiah)$/.test(t)) {
    return true;
  }
  const f = fold(topic).replace(/[^\p{L}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  const who = '(?:quem (?:e|era|foi)|quien (?:es|era|fue)|qui (?:est|etait))';
  const christ = '(?:(?:o |el |le )?(?:jesus|cristo|christ|jesus cristo|jesucristo|jesus christ|messias|mesias|messie))';
  const what = '(?:deus|dios|dieu|divino|divin|humano|humain|o filho de deus|el hijo de dios|le fils de dieu|filho de deus|hijo de dios|fils de dieu|realmente deus|realmente dios|vraiment dieu)';
  return new RegExp(`^(?:${who} )?${christ}(?: ${what})?$`).test(f) || new RegExp(`^${christ} (?:e|es|est|era|etait) ${what}$`).test(f);
}

/** Point questions about who Jesus is to the studies that answer them, rather than opening an unrelated topic. */
async function christologyReply(env: ResponderEnv, topic: string): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const john = attemptSync(() => env.providers.studies.get('john-1', locale), undefined);
  const topics = (await attempt(() => env.providers.topics.listTopics(locale), [])) as TopicMatchLike[];
  const trinity = topics.find((x) => /trinit/i.test(x.name) || x.id === 'trinity');
  const john1 = formatRef({ book: 'JHN', startChapter: 1 }, 'long', locale);
  const options = [
    ...(john ? [t('christ.john', { ref: john1 })] : []),
    ...(trinity ? [t('christ.trinity', { name: trinity.name })] : []),
  ];
  if (options.length === 0) {
    return {
      blocks: [para(t('topic.none', { topic }))],
      steps: [step('Topic index', t('trace.christNone', { topic }), pid(env.providers.topics, 'curated:topics'))],
      declined: true,
    };
  }
  return {
    blocks: [
      para(t('christ.intro', { count: options.length })),
      list(options.map((o) => `${o[0].toUpperCase()}${o.slice(1)}`)),
      para(t('christ.which')),
    ],
    suggestions: [...(john ? [t('suggest.study', { ref: john1 })] : []), ...(trinity ? [trinity.name] : [])],
    steps: [
      step('Topic index', t('trace.christPointed', { topic, targets: listJoin([john ? john1 : '', trinity?.name ?? ''].filter(Boolean), locale) }), pid(env.providers.topics, 'curated:topics')),
    ],
  };
}

/** Did the topic-index entry come translated (an overlay changed its prose)? */
async function topicTranslated(env: ResponderEnv, match: TopicMatchLike): Promise<boolean> {
  if (loc(env) === 'en') return false;
  const english = ((await attempt(() => env.providers.topics.listTopics('en'), [])) as TopicMatchLike[]).find((x) => x.id === match.id);
  if (!english) return true;
  const def = (m: TopicMatchLike) => (m.entry?.topic ?? m.topic).definition.text;
  return english.name !== match.name || def(english) !== def(match);
}

async function openLibraryTopic(env: ResponderEnv, match: TopicMatchLike): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.assembler.libraryTopic(match, { locale, translation: env.ctx.translation, translated: await topicTranslated(env, match) });
  const steps = [
    step('Topic index', t('trace.topicMatched', { name: match.name, score: match.score.toFixed(2) }), pid(env.providers.topics, 'curated:topics')),
    step('Assembly', t('trace.libraryTopic', { count: study.topic?.keyPassages.length ?? 0 }), 'engine:assembler'),
  ];
  if (env.ctx.study?.id === study.id) return alreadyInTopic(env, study, steps);
  const def = study.topic!.definition;
  const n = study.topic!.keyPassages.length;
  const blocks = [
    para(excerpt(def.text, 60)),
    para(
      t('libraryTopic.opened', {
        count: n,
        anchor: study.passage ? tok.ref(study.passage) : 'none',
        debates: study.perspectives.length ? 'yes' : 'no',
      }),
    ),
  ];
  return {
    blocks,
    study,
    updates: openUpdates(study, locale),
    customUpdatesOnly: true,
    conversation: {},
    suggestions: study.suggestedQuestions,
    citations: mergeCitations(def.provenance.citations),
    steps,
  };
}

export async function respondOpenTopic(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const topic = env.intent.slots.topic ?? normalizeTopicQuery(env.message);
  const matches = topic ? ((await attempt(() => env.providers.topics.findTopics(topic, locale), [])) as TopicMatchLike[]) : [];
  // An exact alias hit in the topic index outranks a loose match on a curated study's topics;
  // among exact hits, entries backed by a curated study come first.
  const exact = matches.filter((m) => m.score >= 0.9).sort((a, b) => Number(Boolean(b.studyId)) - Number(Boolean(a.studyId)))[0];
  const exactStudy = exact?.studyId ? attemptSync(() => env.providers.studies.get(exact.studyId!, locale), undefined) : undefined;
  const loose = topic ? attemptSync(() => env.providers.studies.findByTopic(topic, locale), undefined) : undefined;
  const looseScore = loose ? bestPhraseScore(topic, loose.match.topics.map((x) => normalizeTopicQuery(x) || x)) : 0;
  const indexScore = (exact ?? matches[0])?.score ?? 0;
  // A curated study wins unless the topic index matches clearly better.
  const curated = exactStudy ?? (loose && looseScore >= indexScore ? loose : undefined);
  if (curated) {
    const draft = openCurated(env, curated);
    draft.steps.unshift(step('Topic', t('trace.topicToCurated', { topic, id: curated.id }), pid(env.providers.studies, 'curated:studies')));
    return draft;
  }
  const best = exact ?? matches[0];
  // "Who is Jesus?" is not the Faith topic because its alias "faith in Jesus" mentions him.
  if (!exact && isAboutChrist(topic)) return christologyReply(env, topic);
  if (best && best.score >= 0.45 && (best.score >= 0.9 || sharesDistinctiveWord(topic, best))) {
    const linked = best.studyId ? attemptSync(() => env.providers.studies.get(best.studyId!, locale), undefined) : undefined;
    if (linked) return openCurated(env, linked);
    return openLibraryTopic(env, best);
  }

  const all = (await attempt(() => env.providers.topics.listTopics(locale), [])) as TopicMatchLike[];
  const names = all.map((x) => x.name);
  const passages = attemptSync(() => env.providers.studies.list(locale).filter((s) => s.kind === 'passage').map((s) => s.title), []);
  const blocks = [para(t('topic.none', { topic: topic || env.message.trim() }))];
  if (names.length) blocks.push(para(t(names.length > 12 ? 'topic.canOpenMore' : 'topic.canOpen', { topics: listJoin(names.slice(0, 12), locale) })));
  if (passages.length) {
    const example = formatRef({ book: 'JHN', startChapter: 3, startVerse: 16, endChapter: 3, endVerse: 16 }, 'long', locale);
    blocks.push(para(t('topic.orPassage', { passages: listJoin(passages, locale), example: quoted(example, locale) })));
  }
  return {
    blocks,
    suggestions: [...names.slice(0, 3), ...passages.slice(0, 1)],
    steps: [step('Topic index', t('trace.noTopic', { topic }), pid(env.providers.topics, 'curated:topics'))],
    declined: true,
  };
}

/** Open by id: a curated study id, "library-<refKey>", "topic-<topicId>" or a topic-index id. */
export async function openById(env: ResponderEnv, id: string): Promise<ReplyDraft | undefined> {
  const locale = loc(env);
  const curated = attemptSync(() => env.providers.studies.get(id, locale), undefined);
  if (curated) return openCurated(env, curated);
  if (id.startsWith('library-')) {
    const ref = parseRefKey(id.slice('library-'.length));
    if (ref) return respondOpenPassage(env, ref);
  }
  const topicId = id.startsWith('topic-') ? id.slice('topic-'.length) : id;
  const all = (await attempt(() => env.providers.topics.listTopics(locale), [])) as TopicMatchLike[];
  const match = all.find((x) => x.id === topicId);
  if (match) {
    const linked = match.studyId ? attemptSync(() => env.providers.studies.get(match.studyId!, locale), undefined) : undefined;
    return linked ? openCurated(env, linked) : openLibraryTopic(env, match);
  }
  return undefined;
}
