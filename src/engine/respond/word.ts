/**
 * word-study: curated concept → curated key word → the word in the passage text
 * (tagged original + lexicon, from the asked verse out to the whole passage and a
 * topic's key passages) → a curated study anchored in this passage → a key word
 * of another curated study → honest decline.
 *
 * A reply names "the word behind" an English term only when a key word stands
 * for that term, or the term was aligned to a tagged word in the text itself.
 */
import type {
  Concept,
  DashboardFocus,
  KeyWord,
  LexiconEntry,
  MessageBlock,
  Occurrences,
  OriginalLanguage,
  OriginalVerse,
  OriginalWord,
  PassageRef,
  Study,
  TranslationId,
  Verse,
  VerseRef,
} from '../../domain/models';
import { getBook, tryGetBook } from '../../domain/books';
import { cite, lexical } from '../../domain/provenance';
import { chaptersOf, formatRef, refIncludesVerse, refKey, sameVerse, verseKey, verseToPassage } from '../../domain/reference';
import { versionsFor } from '../../domain/translations';
import type { Locale } from '../../i18n/locales';
import type { TopicMatchLike } from '../assemble';
import {
  bookName,
  colon,
  engineT,
  englishLabel,
  explainVerseSuggestion,
  listJoin,
  lowerFirstIn,
  mergeCitations,
  para,
  personName,
  quoted,
  tok,
  uniqueIds,
  uniqueVerses,
  verseLabel,
  verseListLabel,
  type ReplyDraft,
  psalmArticle,
} from '../compose';
import { detectTraditionalAuthor } from '../intent';
import { displayGloss, entryMatches, glossMatches, glossStems, isContentWord, isProperName, senseSummary, termStems } from '../lexicon';
import { conceptById, conceptsForKeyWord, findConcept, findKeyWord, findTermInStudies, keyWordById, keyWordsForTerm, keyWordTermScore, searchStudy } from '../search';
import { bestPhraseScore, capitalize, escapeRegExp, excerpt, fold, stem, strongBase } from '../text';
import { attempt, curatedAnchoredIn, curatedList, curatedPid, loc, nextConversation, pid, scanScope, step, studyName, tr, type ResponderEnv } from './env';
import { respondFromHit } from './hits';
import { openCurated, openSuggestion } from './open';
import { answeringPassages, keyPassagesDraft, respondFromKeyPassages } from './topic';
import { tyndaleNote } from './verse';

/* ------------------------------------------------------------------ */
/* Occurrences                                                         */
/* ------------------------------------------------------------------ */

/** "occurs 147 times in 126 verses of the Greek New Testament" — words and verses, counted as the Inspector counts them. */
export function occurrencePhrase(language: OriginalLanguage, occ: Occurrences | null, locale: Locale = 'en'): string {
  if (!occ || !occ.total) return '';
  return engineT(locale)('occ.phrase', { words: occ.wordCount ?? occ.total, verses: occ.total, language });
}

function occurrenceLine(kw: { lemma: string; language: OriginalLanguage }, occ: Occurrences | null, locale: Locale): string {
  const phrase = occurrencePhrase(kw.language, occ, locale);
  return phrase ? engineT(locale)('occ.line', { lemma: kw.lemma, phrase }) : '';
}

function occurrenceTrace(strong: string, occ: Occurrences | null, locale: Locale): string {
  const t = engineT(locale);
  if (!occ) return t('trace.occUnavailable', { strong });
  // trace counts are written as plain digits (no grouping), as the English trace always did
  return t('trace.occurrences', { strong, words: String(occ.wordCount ?? occ.total), verses: String(occ.total) });
}

async function occurrences(env: ResponderEnv, strong: string): Promise<Occurrences | null> {
  return attempt(() => env.providers.lexicon.getOccurrences(strong, 1), null);
}

/* ------------------------------------------------------------------ */
/* Author correction                                                   */
/* ------------------------------------------------------------------ */

/** "What does Paul mean by flesh?" asked in John 1 → it is John who writes there. */
function authorCorrection(env: ResponderEnv, study: Study): MessageBlock | undefined {
  const locale = loc(env);
  const named = detectTraditionalAuthor(env.parsed.lower);
  const book = study.passage ? tryGetBook(study.passage.book) : undefined;
  if (!named || !book) return undefined;
  const actual = book.traditionalAuthor;
  if (!actual || /anonymous|unknown/i.test(actual)) return undefined;
  const first = (s: string) => s.split(/[\s(]/)[0].toLowerCase();
  if (first(actual) === first(named)) return undefined;
  const where = study.kind === 'topic' ? formatRef(study.passage!, 'long', locale) : study.title;
  const single = !/\b(and|or)\b|others/i.test(actual);
  const params = { where, actual: personName(actual, locale), named: personName(named, locale), book: locale === 'en' ? book.name : bookName(book.id, locale) };
  return para(tr(env)(single ? 'word.correction' : 'word.correctionAttributed', params));
}

/* ------------------------------------------------------------------ */
/* Curated concept / key word replies                                  */
/* ------------------------------------------------------------------ */

/**
 * Focus for a concept (and the key words it links). A verse named in the
 * question is highlighted only when the concept or its words are actually in it.
 */
function conceptFocus(study: Study, concept: Concept | undefined, kws: KeyWord[], verse: VerseRef | undefined, reason: string): DashboardFocus {
  const anchorVerses = kws.flatMap((k) => k.anchors.map((a) => a.verse));
  const inPassage = (v: VerseRef) => Boolean(study.passage && refIncludesVerse(study.passage, v));
  const all = uniqueVerses([...(concept?.verses ?? []), ...anchorVerses]);
  const asked = verse && all.some((v) => sameVerse(v, verse)) ? verse : undefined;
  // verses shown in the Scripture section first (the first highlighted verse drives verse-scoped panels)
  const verses = asked ? [asked] : [...all.filter(inPassage), ...all.filter((v) => !inPassage(v))].slice(0, 8);
  const linked = concept ? [concept] : kws.flatMap((k) => conceptsForKeyWord(study, k.id));
  const pinIds = uniqueIds(linked.flatMap((c) => [...c.crossReferenceIds, ...c.commentaryIds]));
  const expandIds = uniqueIds([...kws.map((k) => k.id), ...linked.flatMap((c) => [...c.themeIds, ...c.contextIds, ...c.perspectiveSetIds])]);
  const hasXrefPins = linked.some((c) => c.crossReferenceIds.length);
  const hasCommentaryPins = linked.some((c) => c.commentaryIds.length);
  return {
    section: kws.length ? 'original-languages' : (concept?.primarySection ?? 'theology'),
    ...(kws.length ? { highlightWordIds: kws.map((k) => k.id) } : {}),
    ...(verses.length ? { highlightVerses: verses } : {}),
    ...(expandIds.length ? { expandIds } : {}),
    ...(pinIds.length ? { pinIds } : {}),
    ...(hasXrefPins ? { crossReferenceFilter: {} } : {}),
    ...(hasCommentaryPins ? { commentaryAuthorIds: [] } : {}),
    reason,
  };
}

/** "“Grace” isn’t in 1:12 — it is in 1:14, 1:16 and 1:17." when the asked verse lacks the word. */
function notInVerseNote(study: Study, term: string, verse: VerseRef | undefined, verses: VerseRef[], locale: Locale): MessageBlock | undefined {
  if (!verse || verses.length === 0 || verses.some((v) => sameVerse(v, verse))) return undefined;
  const shown = verses.filter((v) => !study.passage || refIncludesVerse(study.passage, v));
  const list = shown.length ? shown : verses;
  return para(
    engineT(locale)('word.notInVerse', { term: quoted(capitalize(term), locale), verse: verseLabel(verse, study, locale), verses: verseListLabel(uniqueVerses(list), study, 3, locale) }),
  );
}

async function conceptReply(env: ResponderEnv, study: Study, concept: Concept, term: string): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  // The word behind the term: a key word of this concept that stands for it, else any key word of the study that does.
  const primary = keyWordsForTerm(study, concept.keyWordIds, term)[0] ?? findKeyWord(study, term, 0.9)?.item;
  const conceptKws = concept.keyWordIds.map((id) => keyWordById(study, id)).filter((k): k is KeyWord => Boolean(k));
  const kws = primary ? [primary, ...conceptKws.filter((k) => k.id !== primary.id)] : [];
  const verse = env.intent.slots.verse;
  const blocks: MessageBlock[] = [para(concept.answer.text)];
  const steps = [step('Concept index', `“${term}” → ${concept.label}`, curatedPid(study))];
  let citations = [...concept.answer.provenance.citations];
  let inspector: ReplyDraft['inspector'];
  let aligned: VerseRef | undefined;
  let reason = t('reason.fromQuestion', { what: t('word.focusedOn', { what: lowerFirstIn(concept.label, locale) }) });

  if (primary) {
    const occ = await occurrences(env, primary.strong);
    const occLine = occurrenceLine(primary, occ, locale);
    const alreadyNamed = fold(concept.answer.text).includes(fold(primary.lemma));
    // "The word behind “Lamb”…" when the key word renders part of a longer phrase ("the Lamb of God")
    const behind = keyWordTermScore(primary, term) >= 0.9 ? term : englishLabel(primary.english);
    const word = { word: tok.word(primary.id), translit: primary.transliteration, strong: primary.strong, section: tok.section('original-languages'), occ: occLine ? ` ${occLine}` : '' };
    blocks.push(para(alreadyNamed ? t('word.openedIn', word) : t('word.behind', { ...word, term: quoted(behind, locale) })));
    const missing = notInVerseNote(study, term, verse, primary.anchors.map((a) => a.verse), locale);
    if (missing) blocks.splice(1, 0, missing);
    steps.push(step('Lexicon', occurrenceTrace(primary.strong, occ, locale), pid(env.providers.lexicon, 'local:lexicon')));
    citations = mergeCitations(citations, primary.provenance.citations, occ ? [cite(occ.sourceId)] : []);
    reason = t('reason.fromQuestion', { what: t('word.focusedOn', { what: `${primary.lemma} (${primary.english})` }) });
  } else {
    // The concept's key words are other words (“Word”, “dwelt”): find the asked word in the text itself.
    const inPassage = concept.verses.filter((v) => !study.passage || refIncludesVerse(study.passage, v));
    const scopes = uniqueScopes([...inPassage.slice(0, 4).map(verseToPassage), ...lookupScopes(env, study)]);
    const found = await locate(env, scopes, term);
    const a = found?.located && found.located !== 'unreadable' ? found.located.aligned : undefined;
    if (a) {
      const occ = await occurrences(env, a.word.strong);
      blocks.push(para(alignedSentence(env, term, a, occ)));
      inspector = { type: 'word', strong: a.word.strong, verse: a.verse, surface: a.word.surface, gloss: a.word.gloss };
      aligned = a.verse;
      steps.push(
        step('Original text', t('trace.wordIn', { surface: a.word.surface, strong: a.word.strong, verse: verseLabel(a.verse, study, locale), via: 'gloss' }), pid(env.providers.originalText, 'local:original')),
        step('Lexicon', occurrenceTrace(a.word.strong, occ, locale), pid(env.providers.lexicon, 'local:lexicon')),
      );
      citations = mergeCitations(citations, a.entry ? [cite(a.entry.sourceId, a.entry.strong)] : [], [cite(a.sourceId, verseLabel(a.verse, null, locale))], occ ? [cite(occ.sourceId)] : []);
      reason = t('reason.fromQuestion', { what: t('word.termIn', { term: quoted(term, locale), verse: verseLabel(a.verse, study, locale) }) });
    } else {
      steps.push(step('Original text', t('trace.notAligned', { term }), pid(env.providers.originalText, 'local:original')));
    }
  }
  const correction = authorCorrection(env, study);
  if (correction) blocks.unshift(correction);
  const focus = conceptFocus(study, concept, kws, verse, reason);
  if (aligned) focus.highlightVerses = uniqueVerses([aligned, ...(focus.highlightVerses ?? [])]).slice(0, 8);
  return {
    blocks,
    focus,
    ...(inspector ? { inspector } : {}),
    conversation: nextConversation(env.ctx.conversation, {
      activeConceptId: concept.id,
      activeWordId: primary?.id,
      activeVerse: aligned ?? (verse && focus.highlightVerses?.some((v) => sameVerse(v, verse)) ? verse : focus.highlightVerses?.[0]) ?? env.ctx.conversation.activeVerse,
    }),
    citations,
    suggestions: [
      ...(concept.crossReferenceIds.length ? [t('suggest.otherPassages')] : []),
      ...(concept.commentaryIds.length ? [t('suggest.commentatorsThis')] : []),
      ...(concept.perspectiveSetIds.length ? [t('suggest.interpretationsThis')] : []),
    ],
    steps,
  };
}

async function keyWordReply(env: ResponderEnv, study: Study, kw: KeyWord, term: string): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const occ = await occurrences(env, kw.strong);
  const linked = conceptsForKeyWord(study, kw.id);
  const occLine = occurrenceLine(kw, occ, locale);
  const verse = env.intent.slots.verse;
  const blocks: MessageBlock[] = [
    para(t('word.basicMeaning', { word: tok.word(kw.id), translit: kw.transliteration, strong: kw.strong, meaning: kw.basicMeaning, occ: occLine ? ` ${occLine}` : '' })),
    para(excerpt(kw.significance.text, 70)),
  ];
  const missing = notInVerseNote(study, term, verse, kw.anchors.map((a) => a.verse), locale);
  if (missing) blocks.unshift(missing);
  const correction = authorCorrection(env, study);
  if (correction) blocks.unshift(correction);
  if (kw.caution) blocks.push(para(t('word.caution', { text: excerpt(kw.caution, 35) })));
  const focus = conceptFocus(study, undefined, [kw], verse, t('reason.fromQuestion', { what: t('word.focusedOn', { what: `${kw.lemma} (${kw.english})` }) }));
  return {
    blocks,
    focus,
    conversation: nextConversation(env.ctx.conversation, {
      activeWordId: kw.id,
      activeConceptId: linked[0]?.id,
      activeVerse: focus.highlightVerses?.[0] ?? env.ctx.conversation.activeVerse,
    }),
    citations: mergeCitations(kw.provenance.citations, kw.significance.provenance.citations, occ ? [cite(occ.sourceId)] : []),
    suggestions: [t('suggest.otherPassages'), t('suggest.whereElse', { word: kw.english })],
    steps: [
      step('Key words', `“${term}” → ${kw.lemma} (${kw.strong})`, curatedPid(study)),
      step('Lexicon', occurrenceTrace(kw.strong, occ, locale), pid(env.providers.lexicon, 'local:lexicon')),
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Locating a term in the text                                         */
/* ------------------------------------------------------------------ */

const TRANSLATIONS: TranslationId[] = ['BSB', 'KJV', 'WEB'];

/** The versions to search for the reader's word: the English ones, or those of the reader's language. */
function translationsFor(locale: Locale): TranslationId[] {
  if (locale === 'en') return TRANSLATIONS;
  const own = versionsFor(locale).map((v) => v.id);
  return own.length ? own : TRANSLATIONS;
}

/**
 * A Portuguese, Spanish or French word without its verb or noun ending, so the infinitive the
 * reader types finds the forms the Bible uses ("predestinar" → "predestin": predestinado,
 * predestinados; "perdonar" → "perdon"). Short words keep their form ("orar", "prier", "fe").
 */
function romanceStem(word: string): string {
  if (word.length < 6) return word;
  const m = /^(.{4,}?)(?:ar|er|ir|re|cion|cao|tion|ado|ada|ido|ida|ee|os|as|es|o|a|e|s)$/.exec(word);
  return m ? m[1] : word;
}

/** Does a verse contain the term (whole word; single words also match simple inflections)? */
function verseMatches(verseText: string, term: string, foreign = false): boolean {
  const t = fold(term).trim();
  if (!t) return false;
  const words = t.split(/\s+/);
  const re =
    words.length === 1 && t.length >= 4
      ? foreign
        ? new RegExp(`(?<![\\p{L}])${escapeRegExp(romanceStem(t))}\\p{L}{0,5}(?![\\p{L}])`, 'iu')
        : new RegExp(`\\b${escapeRegExp(stem(t))}[a-z]{0,4}\\b`, 'i')
      : new RegExp(`\\b${escapeRegExp(t)}\\b`, 'i');
  return re.test(fold(verseText));
}

interface Aligned {
  word: OriginalWord;
  verse: VerseRef;
  /** tagged-text source */
  sourceId: string;
  entry: LexiconEntry | null;
  /**
   * how the term was matched: the word's contextual gloss, its lexicon gloss/senses, its
   * lemma/transliteration, or — for a term in the reader's language — the one word of substance
   * that every verse containing the term shares in the tagged text
   */
  via: 'gloss' | 'lexicon' | 'lemma' | 'verses';
  /** with via 'verses': the verses that were compared */
  matchedBy?: VerseRef[];
}

interface Located {
  scope: PassageRef;
  /** verses whose English (in `translation`) contains the term */
  verses: VerseRef[];
  translation: TranslationId;
  passageSource?: string;
  aligned?: Aligned;
  /** a multi-word term aligned word by word within one verse ("poor in spirit") */
  phrase?: Aligned[];
}

async function readVerses(env: ResponderEnv, scope: PassageRef, translation: TranslationId): Promise<{ verses: Verse[]; sourceId: string } | null> {
  const passage = await attempt(() => env.providers.scripture.getPassage(scope, translation), null);
  const verses = passage?.chapters.flatMap((c) => c.verses) ?? [];
  return passage && verses.length ? { verses, sourceId: passage.sourceId } : null;
}

async function entriesFor(env: ResponderEnv, words: OriginalWord[]): Promise<Map<string, LexiconEntry>> {
  const strongs = Array.from(new Set(words.map((w) => w.strong)));
  return attempt(() => env.providers.lexicon.getEntries(strongs), new Map<string, LexiconEntry>());
}

/** A content word of these verses whose lexicon gloss (or first senses) carries the term ("anxious" → μεριμνάω, "to be anxious"). */
async function alignByLexicon(env: ResponderEnv, verses: OriginalVerse[], term: string): Promise<Aligned | undefined> {
  const words = verses.flatMap((ov) => ov.words.filter(isContentWord).map((w) => ({ w, ov })));
  const entries = await entriesFor(env, words.map((x) => x.w));
  let bySense: Aligned | undefined;
  for (const { w, ov } of words) {
    const e = entries.get(w.strong);
    if (!e) continue;
    const m = entryMatches(e, term);
    if (m === 'gloss') return { word: w, verse: ov.ref, sourceId: ov.sourceId, entry: e, via: 'lexicon' };
    if (m === 'sense' && !bySense) bySense = { word: w, verse: ov.ref, sourceId: ov.sourceId, entry: e, via: 'lexicon' };
  }
  return bySense;
}

/**
 * Very common words of substance (to come, to give, to see, to know, to hear, God, Lord…), set
 * aside with FREQUENT_LEMMAS when the verses share more than one word — never the whole answer.
 */
const FREQUENT_STRONGS = new Set([
  'G1510', 'G3004', 'G2036', 'G1096', 'G2192', 'G4160', 'G2064', 'G1325', 'G2316', 'G2962', 'G3956', 'G4183', 'G3708', 'G1492', 'G191', 'G2980', 'G3762', 'G5100', 'G3303', 'G3767',
  'H1961', 'H559', 'H3068', 'H430', 'H3605', 'H6213', 'H5414', 'H935', 'H1697', 'H3808', 'H834', 'H7200',
]);

/**
 * A looser test for the reader's word in a verse, used only to check a candidate: the verb root
 * with any ending ("orar" → oras, ora, orando, oraréis; "prier" → prie, priez, priant), else the
 * stemmed word ("predestinar" → predestinado).
 */
function looseMatcher(term: string): RegExp {
  const t = fold(term).trim();
  const root = t.length >= 4 ? t.replace(/(?:ar|er|ir|re)$/, '') : t;
  if (root !== t && root.length >= 2) {
    const tail = root.length >= 4 ? '(?:[aeiouy]\\p{L}*)?' : '[aeiouy]\\p{L}*';
    return new RegExp(`(?<![\\p{L}])${escapeRegExp(root)}${tail}(?![\\p{L}])`, 'iu');
  }
  return new RegExp(`(?<![\\p{L}])${escapeRegExp(t.length >= 6 ? romanceStem(t) : t)}\\p{L}{0,5}(?![\\p{L}])`, 'iu');
}

/** The words of substance of a tagged verse — no articles, conjunctions, particles, pronouns or prepositions (by morphology), nor names — by Strong's number. */
function substanceWords(ov: OriginalVerse): Map<string, OriginalWord> {
  const m = new Map<string, OriginalWord>();
  for (const w of ov.words) if (hasSubstance(w) && !isProperName(w) && !m.has(strongBase(w.strong))) m.set(strongBase(w.strong), w);
  return m;
}

/** A noun, verb or adjective — for Hebrew, whatever its prefixes and pronoun suffix ("HR/Ncmsc/Sp1cp", in our image). */
function hasSubstance(w: OriginalWord): boolean {
  const morph = w.morph ?? '';
  if (/^[HA][A-Z]/.test(morph) && morph.includes('/')) return morph.slice(1).split('/').some((seg) => /^(N[cg]|V|A[aco])/.test(seg));
  return isContentWord(w);
}

/**
 * The term in the reader's language, found in several verses (Portuguese "orar" in Matthew 6:5,
 * 6:6, 6:7 and 6:9): the tagged words of substance that every one of those verses contains.
 * Each candidate is then checked across the whole chapter(s): in (nearly) every verse where the
 * tagged text has it, the reader's Bible must have the term too — which sets aside a word that
 * merely travels with it ("will" beside "predestined" in Ephesians 1) or a verse where the
 * reader's Bible follows another Greek text (Reina-Valera's "reino" in Mark 1:14). One candidate
 * clearly best is the answer; anything else stays unanswered (ambiguous).
 */
async function alignByVerses(env: ResponderEnv, verses: OriginalVerse[], term: string, translation: TranslationId): Promise<Aligned | undefined> {
  const compared = verses.slice(0, 12);
  if (compared.length < 2) return undefined;
  const sets = compared.map(substanceWords);
  let common = [...sets[0].keys()].filter((k) => sets.every((set) => set.has(k)));
  if (common.length > 1) common = common.filter((k) => !FREQUENT_STRONGS.has(k) && !FREQUENT_LEMMAS.has(k));
  if (!common.length || common.length > 6) return undefined;
  // the chapters the verses belong to, in the reader's Bible and in the tagged text
  const chapters = uniqueScopes(compared.map((ov) => ({ book: ov.ref.book, startChapter: ov.ref.chapter })));
  const loose = looseMatcher(term);
  const withTerm = new Set<string>();
  const tagged: OriginalVerse[] = [];
  for (const ch of chapters.slice(0, 4)) {
    const read = await readVerses(env, ch, translation);
    for (const v of read?.verses ?? []) if (loose.test(fold(v.text))) withTerm.add(verseKey(v.ref));
    tagged.push(...(await attempt(() => env.providers.originalText.getOriginalText(ch), [] as OriginalVerse[])));
  }
  const precision = (k: string) => {
    const having = tagged.filter((ov) => substanceWords(ov).has(k));
    return having.length ? having.filter((ov) => withTerm.has(verseKey(ov.ref))).length / having.length : 0;
  };
  const ranked = common.map((k) => ({ k, p: precision(k) })).sort((a, b) => b.p - a.p);
  const best = ranked[0];
  if (best.p < 0.75 || (ranked[1] && ranked[1].p >= best.p)) return undefined;
  const word = sets[0].get(best.k)!;
  const entry = await attempt(() => env.providers.lexicon.getEntry(word.strong), null);
  return { word, verse: compared[0].ref, sourceId: compared[0].sourceId, entry, via: 'verses', matchedBy: compared.map((ov) => ov.ref) };
}

/** A word whose lexicon lemma or transliteration is the term itself ("merimnao" → μεριμνάω). */
async function alignByLemma(env: ResponderEnv, verses: OriginalVerse[], term: string): Promise<Aligned | undefined> {
  const key = (s: string) => fold(s).replace(/[.\s'’-]/g, '');
  const t = key(term);
  if (t.length < 3) return undefined;
  const words = verses.flatMap((ov) => ov.words.filter(isContentWord).map((w) => ({ w, ov })));
  const entries = await entriesFor(env, words.map((x) => x.w));
  for (const { w, ov } of words) {
    const e = entries.get(w.strong);
    if (e && (key(e.transliteration) === t || key(e.lemma) === t)) return { word: w, verse: ov.ref, sourceId: ov.sourceId, entry: e, via: 'lemma' };
  }
  return undefined;
}

/** Every content word of a phrase aligned to a word of one verse, by contextual or lexicon gloss. */
async function alignPhrase(env: ResponderEnv, ov: OriginalVerse, term: string): Promise<Aligned[] | undefined> {
  const parts = termStems(term);
  if (parts.length < 2) return undefined;
  const entries = await entriesFor(env, ov.words.filter(isContentWord));
  const picked: Aligned[] = [];
  for (const t of parts) {
    const free = ov.words.filter((w) => !picked.some((p) => p.word.index === w.index));
    const w =
      free.find((x) => glossStems(x.gloss).includes(t)) ??
      free.find((x) => isContentWord(x) && glossStems(entries.get(x.strong)?.gloss ?? '').includes(t));
    if (!w) return undefined;
    picked.push({ word: w, verse: ov.ref, sourceId: ov.sourceId, entry: entries.get(w.strong) ?? null, via: 'gloss' });
  }
  return picked.sort((a, b) => a.word.index - b.word.index);
}

/**
 * Look for the term in one passage: its English (current translation, then the
 * others), then the tagged original — by contextual gloss (stemmed), by lexicon
 * gloss, or word by word for a phrase. 'unreadable' when the text can't be loaded.
 */
async function locateIn(env: ResponderEnv, scope: PassageRef, term: string): Promise<Located | 'unreadable' | undefined> {
  const current = env.ctx.translation;
  const main = await readVerses(env, scope, current);
  if (!main) return 'unreadable';
  let translation = current;
  let passageSource = main.sourceId;
  const foreign = loc(env) !== 'en';
  let hits = main.verses.filter((v) => verseMatches(v.text, term, foreign)).map((v) => v.ref);
  if (!hits.length) {
    for (const t of translationsFor(loc(env)).filter((x) => x !== current)) {
      const other = await readVerses(env, scope, t);
      const h = other?.verses.filter((v) => verseMatches(v.text, term, foreign)).map((v) => v.ref) ?? [];
      if (h.length) {
        hits = h;
        translation = t;
        passageSource = other!.sourceId;
        break;
      }
    }
  }
  const orig = await attempt(() => env.providers.originalText.getOriginalText(scope), [] as OriginalVerse[]);
  const byVerse = new Map(orig.map((o) => [verseKey(o.ref), o]));
  const inHits = hits.map((r) => byVerse.get(verseKey(r))).filter((o): o is OriginalVerse => Boolean(o));
  const base = { scope, verses: hits, translation, passageSource };
  // 1. a word whose contextual gloss carries the term — where the English has it first, then anywhere in scope
  const elsewhere = termStems(term).length <= 2 ? orig.filter((o) => !hits.some((r) => sameVerse(r, o.ref))) : [];
  for (const ov of [...inHits, ...elsewhere]) {
    const w = ov.words.find((x) => glossMatches(x.gloss, term));
    if (!w) continue;
    const entry = await attempt(() => env.providers.lexicon.getEntry(w.strong), null);
    return { ...base, aligned: { word: w, verse: ov.ref, sourceId: ov.sourceId, entry, via: 'gloss' } };
  }
  // 1b. a transliterated or original-script lemma ("merimnaō", "μεριμνάω") in a short passage
  if (/^[\p{L}'’.-]+$/u.test(term.trim()) && orig.length <= 80) {
    const byLemma = await alignByLemma(env, orig, term);
    if (byLemma) return { ...base, aligned: byLemma };
  }
  if (!hits.length) return undefined;
  // 2. a word whose lexicon gloss or first senses carry it
  const byLexicon = await alignByLexicon(env, inHits.slice(0, 3), term);
  if (byLexicon) return { ...base, aligned: byLexicon };
  // 3. a phrase, word by word
  for (const ov of inHits.slice(0, 3)) {
    const phrase = await alignPhrase(env, ov, term);
    if (phrase) return { ...base, phrase };
  }
  // 4. a word in the reader's language: the tagged word every verse that contains it shares
  if (foreign && fold(term).trim().split(/\s+/).length === 1) {
    const byVerses = await alignByVerses(env, inHits, term, translation);
    if (byVerses) return { ...base, aligned: byVerses };
  }
  return base;
}

function uniqueScopes(scopes: PassageRef[]): PassageRef[] {
  const seen = new Set<string>();
  return scopes.filter((s) => {
    const k = refKey(s);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * Where to look, narrowest first: the verse asked about (or the chapter in view),
 * then the whole study passage, then — in a topic study — its key passages.
 * "Greek" / "Hebrew" in the question keeps the search in that testament when it can.
 */
function lookupScopes(env: ResponderEnv, study: Study): PassageRef[] {
  const first = scanScope(study, env.intent.slots.verse, env.ctx.conversation.activeVerse);
  const all = uniqueScopes([...(first ? [first] : []), ...(study.passage ? [study.passage] : []), ...(study.topic?.keyPassages.map((k) => k.ref) ?? [])]);
  const lang = env.intent.slots.language;
  if (!lang) return all.slice(0, 16);
  const testament = lang === 'greek' ? 'NT' : 'OT';
  const inLanguage = all.filter((r) => tryGetBook(r.book)?.testament === testament);
  return (inLanguage.length ? inLanguage : all).slice(0, 16);
}

/** Try each scope in turn; the first where the term is found wins. */
async function locate(env: ResponderEnv, scopes: PassageRef[], term: string): Promise<{ located?: Located | 'unreadable'; index: number; checked: boolean } | undefined> {
  let checked = false;
  for (const [index, scope] of scopes.entries()) {
    const located = await locateIn(env, scope, term);
    if (located === 'unreadable') continue;
    checked = true;
    if (located) return { located, index, checked };
  }
  return { index: -1, checked };
}

function scopeLabel(scope: PassageRef, study: Study, locale: Locale): string {
  if (scope.startVerse != null && (scope.endVerse == null || scope.endVerse === scope.startVerse) && (scope.endChapter ?? scope.startChapter) === scope.startChapter) {
    return verseLabel({ book: scope.book, chapter: scope.startChapter, verse: scope.startVerse }, study, locale);
  }
  return formatRef(scope, 'long', locale);
}

/** "In 1:14, “flesh” translates Greek **σάρξ** (*sarx*, G4561). The STEPBible lexicon glosses it *flesh* … σάρξ occurs …" */
function alignedSentence(env: ResponderEnv, term: string, a: Aligned, occ: Occurrences | null, translation?: TranslationId, englishHit = true): string {
  const locale = loc(env);
  const t = tr(env);
  const entry = a.entry;
  const lemma = entry?.lemma ?? a.word.surface;
  const translit = entry?.transliteration ?? a.word.transliteration;
  const tags = [translit ? `*${translit}*` : '', strongBase(a.word.strong)].filter(Boolean).join(', ');
  const params = { where: tok.verse(a.verse), language: a.word.language, lemma, tags, term: quoted(term, locale), translation: translation ?? '' };
  const first = a.via === 'verses' && a.matchedBy
    ? t('word.alignedByVerses', { ...params, term: quoted(capitalize(term), locale), verses: listJoin(a.matchedBy.slice(0, 4).map(tok.verse), locale) })
    : !englishHit
    ? t('word.alignedGloss', { ...params, gloss: quoted(a.word.gloss.replace(/[,.;:]+$/, ''), locale) })
    : translation && translation !== env.ctx.translation
      ? t('word.alignedOther', params)
      : t('word.aligned', params);
  const senses = entry ? senseSummary(entry) : '';
  const gloss = entry ? ` ${t('word.glosses', { source: tok.source(entry.sourceId), gloss: displayGloss(entry.gloss), senses: senses ? ` (${senses})` : '' })}` : '';
  const occLine = entry ? occurrenceLine({ lemma: entry.lemma, language: entry.language }, occ, locale) : '';
  return `${first}${gloss}${occLine ? ` ${occLine}` : ''}`;
}

interface LookupResult {
  draft?: ReplyDraft;
  /** the passage text was actually read (so "not found" is meaningful) */
  checked: boolean;
  scope?: PassageRef;
}

async function passageWordLookup(env: ResponderEnv, study: Study, term: string): Promise<LookupResult> {
  const scopes = lookupScopes(env, study);
  if (!scopes.length) return { checked: false };
  const found = await locate(env, scopes, term);
  const located = found?.located;
  if (!located || located === 'unreadable') return { checked: Boolean(found?.checked), scope: scopes[0] };
  const missedIn = found!.index > 0 ? scopes[0] : undefined;
  return { checked: true, scope: scopes[0], draft: await lookupDraft(env, study, term, located, missedIn) };
}

/** The curated study (other than this one) with this lexeme as a key word — the one whose topic is the term first — for a pointer. */
function keyWordElsewhere(env: ResponderEnv, study: Study, strong: string, term: string): { study: Study['id']; title: string; open: string } | undefined {
  const base = strongBase(strong);
  const withWord = curatedList(env).filter((s) => s.id !== study.id && s.keyWords.some((k) => strongBase(k.strong) === base));
  const s = [...withWord].sort((a, b) => bestPhraseScore(term, [b.title, ...b.match.topics]) - bestPhraseScore(term, [a.title, ...a.match.topics]))[0];
  return s ? { study: s.id, title: s.title, open: openSuggestion(s, loc(env)) } : undefined;
}

/** Does a study note speak to the phrase (at least half of its words)? */
function noteMentions(text: string, term: string): boolean {
  const t = termStems(term);
  const hay = new Set(glossStems(text));
  return t.length > 0 && t.filter((x) => hay.has(x)).length >= Math.ceil(t.length / 2);
}

/** Where a verse found outside the study passage is shown: its key passage in a topic study, else only the Inspector. */
// (reason strings are built by the caller in the reader's language)
function focusForVerse(study: Study, v: VerseRef, verses: VerseRef[], reason: string): DashboardFocus | undefined {
  if (!study.passage || refIncludesVerse(study.passage, v)) return { section: 'scripture', highlightVerses: uniqueVerses([v, ...verses]).slice(0, 6), reason };
  const kp = study.topic?.keyPassages.find((k) => refIncludesVerse(k.ref, v));
  return kp ? { section: 'key-passages', expandIds: [kp.id], pinIds: [kp.id], reason } : undefined;
}

async function lookupDraft(env: ResponderEnv, study: Study, term: string, res: Located, missedIn: PassageRef | undefined): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const verses = res.verses.slice(0, 6);
  const lead = missedIn ? t('word.notInScope', { term: quoted(capitalize(term), locale), scope: psalmArticle(scopeLabel(missedIn, study, locale), locale) }) : '';
  const steps = [
    step(
      'Scripture',
      verses.length
        ? t('trace.termFound', { term, verses: verseListLabel(verses, study, 3, locale), translation: res.translation })
        : t('trace.termNotFound', { term, ref: formatRef(res.scope, 'short', locale), translation: res.translation }),
      pid(env.providers.scripture, 'local:scripture'),
    ),
  ];
  const correction = authorCorrection(env, study);
  const prefix = correction ? [correction] : [];
  const noKeyWords = study.keyWords.length === 0;
  // "the context of Genesis 1 still decides the sense" — the chapter, not a whole book
  const contextOf = (v: VerseRef) => formatRef(chaptersOf(res.scope).length > 1 ? { book: v.book, startChapter: v.chapter } : res.scope, 'long', locale);
  const termIn = (where: string) => t('reason.fromQuestion', { what: t('word.termIn', { term: quoted(term, locale), verse: where }) });

  // One tagged word
  if (res.aligned) {
    const a = res.aligned;
    const occ = await occurrences(env, a.word.strong);
    steps.push(
      step('Original text', t('trace.wordIn', { surface: a.word.surface, strong: a.word.strong, verse: verseLabel(a.verse, study, locale), via: a.via }), pid(env.providers.originalText, 'local:original')),
      step(
        'Lexicon',
        a.entry ? `${a.entry.lemma} · ${a.entry.gloss} · ${occurrenceTrace(a.word.strong, occ, locale)}` : t('trace.noEntry', { strong: a.word.strong }),
        pid(env.providers.lexicon, 'local:lexicon'),
      ),
    );
    const elsewhere = keyWordElsewhere(env, study, a.word.strong, term);
    const englishHit = verses.some((v) => sameVerse(v, a.verse));
    const caveat = t(noKeyWords ? 'word.lexicalData' : 'word.lexicalDataNotKey', { ref: contextOf(a.verse) });
    const focus = focusForVerse(study, a.verse, verses, termIn(verseLabel(a.verse, study, locale)));
    const blocks: MessageBlock[] = [
      ...prefix,
      para(`${lead}${alignedSentence(env, term, a, occ, res.translation, englishHit)}`),
      para(`${caveat}${elsewhere ? ` ${t('word.keyWordElsewhere', { title: elsewhere.title })}` : ''} ${t('word.openedEntry')}`),
    ];
    const provCites = mergeCitations(a.entry ? [cite(a.entry.sourceId, a.entry.strong)] : [], [cite(a.sourceId)]);
    return {
      blocks,
      ...(focus ? { focus } : {}),
      inspector: { type: 'word', strong: a.word.strong, verse: a.verse, surface: a.word.surface, gloss: a.word.gloss },
      conversation: nextConversation(env.ctx.conversation, { activeVerse: a.verse, activeWordId: undefined, activeConceptId: undefined }),
      citations: mergeCitations(
        a.entry ? [cite(a.entry.sourceId, a.entry.strong)] : [],
        [cite(a.sourceId, verseLabel(a.verse, null, locale))],
        res.passageSource ? [cite(res.passageSource)] : [],
        occ ? [cite(occ.sourceId)] : [],
      ),
      provenance: lexical(...provCites),
      suggestions: [explainVerseSuggestion(a.verse, study, locale), ...(elsewhere ? [elsewhere.open] : [t('suggest.crossRefs')])],
      steps,
    };
  }

  const v = verses[0];
  const found = v ? await tyndaleNote(env, v) : undefined;
  // a note is offered for a phrase only when it speaks to that phrase
  const note = found && (termStems(term).length < 2 || noteMentions(found.text, term)) ? found : undefined;
  const noteRef = note ? formatRef(note.ref, 'short', locale) : '';
  const noteBlocks: MessageBlock[] = note ? [para(t('note.from', { source: tok.source(note.sourceId), ref: noteRef })), para(`*${excerpt(note.text, 60)}*`)] : [];
  if (note) steps.push(step('Study notes', t('trace.tyndaleOn', { ref: noteRef }), pid(env.providers.commentary, 'local:commentary')));
  const noteCites = note ? [cite(note.sourceId, t('cite.on', { ref: noteRef }))] : [];

  // A phrase, word by word
  if (res.phrase && v) {
    const parts = res.phrase.map((p) => {
      const lemma = p.entry?.lemma ?? p.word.surface;
      const translit = p.entry?.transliteration ?? p.word.transliteration;
      return `**${lemma}** (${[translit ? `*${translit}*` : '', strongBase(p.word.strong)].filter(Boolean).join(', ')}${p.entry?.gloss ? `, ${quoted(displayGloss(p.entry.gloss), locale)}` : ''})`;
    });
    steps.push(step('Original text', t('trace.phraseAligned', { verse: verseLabel(v, study, locale), strongs: res.phrase.map((p) => p.word.strong).join(', ') }), pid(env.providers.originalText, 'local:original')));
    const head = res.phrase.find((p) => isContentWord(p.word)) ?? res.phrase[0];
    const focus = focusForVerse(study, v, verses, termIn(verseLabel(v, study, locale)));
    return {
      blocks: [...prefix, para(`${lead}${t('word.phrase', { where: tok.verse(v), term: quoted(term, locale), language: res.phrase[0].word.language, parts: listJoin(parts, locale) })}`), ...noteBlocks],
      ...(focus ? { focus } : {}),
      inspector: { type: 'word', strong: head.word.strong, verse: v, surface: head.word.surface, gloss: head.word.gloss },
      conversation: nextConversation(env.ctx.conversation, { activeVerse: v, activeWordId: undefined, activeConceptId: undefined }),
      citations: mergeCitations(
        res.phrase.flatMap((p) => (p.entry ? [cite(p.entry.sourceId, p.entry.strong)] : [])),
        [cite(res.phrase[0].sourceId, verseLabel(v, null, locale))],
        noteCites,
        res.passageSource ? [cite(res.passageSource)] : [],
      ),
      suggestions: [explainVerseSuggestion(v, study, locale), t('suggest.crossRefs')],
      steps,
    };
  }

  // The English has it, but no single tagged word carries it.
  steps.push(step('Original text', t('trace.notAlignedText'), pid(env.providers.originalText, 'local:original')));
  const language = getBook((v ?? verseOf(res.scope)).book).language;
  const multi = termStems(term).length >= 2;
  const where = listJoin(verses.slice(0, 3).map(tok.verse), locale);
  const text = multi
    ? t('word.spansSeveral', { lead, term: quoted(capitalize(term), locale), where, language, note: note ? 'yes' : 'no' })
    : t('word.notSingle', { lead, term: quoted(capitalize(term), locale), where, language });
  const focus = v ? focusForVerse(study, v, verses, termIn(verseListLabel(verses, study, 3, locale))) : undefined;
  return {
    blocks: [...prefix, para(text), ...noteBlocks],
    ...(focus ? { focus } : {}),
    conversation: nextConversation(env.ctx.conversation, { activeVerse: v, activeWordId: undefined, activeConceptId: undefined }),
    citations: mergeCitations(noteCites, res.passageSource ? [cite(res.passageSource)] : []),
    ...(note ? { provenance: { kind: 'commentary' as const, verification: 'source-derived' as const, citations: noteCites } } : {}),
    suggestions: v ? [explainVerseSuggestion(v, study, locale), t('suggest.keyWords')] : [t('suggest.keyWords')],
    steps,
  };
}

function verseOf(ref: PassageRef): VerseRef {
  return { book: ref.book, chapter: ref.startChapter, verse: ref.startVerse ?? 1 };
}

/* ------------------------------------------------------------------ */
/* Key words of a passage                                              */
/* ------------------------------------------------------------------ */

// Very frequent words that say little about a passage: forms of be/say/have/do/become, all/one/none/some/other/much.
const FREQUENT_LEMMAS = new Set([
  'G1510', 'G3004', 'G2036', 'G5346', 'G2192', 'G4160', 'G1096', 'G3588', 'G2532', 'G846', 'G3956', 'G1520', 'G3762', 'G3367', 'G5100',
  'G243', 'G2087', 'G4183', 'G3745', 'G5108', 'G1438',
  'H1961', 'H559', 'H6213', 'H853', 'H3068', 'H3605', 'H834', 'H3808', 'H3588',
]);

/** "heavens." → "heavens", "Blessed [are]" → "blessed"; a long contextual gloss falls back to the lexicon's ("to worry" → "worry"). */
function questionWord(contextual: string, lexiconGloss: string | undefined): string {
  const clean = (s: string) =>
    s
      .replace(/\[[^\]]*\]|<[^>]*>/g, ' ')
      .replace(/[^\p{L}\s'-]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  const c = clean(contextual);
  if (c && c.split(' ').length <= 2) return c.toLowerCase();
  const l = clean((lexiconGloss ?? '').split(/[:/]/)[0]).replace(/^to\s+/i, '');
  return (l || c).toLowerCase();
}

/** "What are the key words in this passage?" */
async function keyWordsOverview(env: ResponderEnv, study: Study): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  if (study.keyWords.length) {
    const kws = study.keyWords.slice(0, 6);
    return {
      blocks: [
        para(t('word.curatedKeyWords', { count: study.keyWords.length })),
        { type: 'list', items: kws.map((k) => `${tok.word(k.id)} *${k.transliteration}* — ${k.english}${colon(locale)} ${k.basicMeaning}`) },
      ],
      focus: { section: 'original-languages', highlightWordIds: kws.map((k) => k.id), reason: t('reason.fromQuestion', { what: t('word.reasonKeyWords') }) },
      suggestions: [t('suggest.meaning', { word: kws[0].english }), ...(kws[1] ? [t('suggest.wordBehind', { language: kws[1].language, word: kws[1].english })] : [])],
      citations: mergeCitations(...kws.map((k) => k.provenance.citations)),
      steps: [step('Key words', t('trace.curatedKeyWords', { count: study.keyWords.length }), curatedPid(study))],
    };
  }
  // Library study: the most frequent content words of the passage (the chapter in view for long passages).
  const p = study.passage;
  const asked = env.intent.slots.verse;
  const whole = p && !asked && chaptersOf(p).length <= 5;
  const scope = whole ? p : scanScope(study, asked, env.ctx.conversation.activeVerse);
  const narrowed = Boolean(p && scope && !asked && refKey(scope) !== refKey(p));
  const orig = scope ? await attempt(() => env.providers.originalText.getOriginalText(scope), []) : [];
  const counts = new Map<string, { word: OriginalWord; n: number; first: VerseRef }>();
  for (const ov of orig) {
    for (const w of ov.words) {
      if (!isContentWord(w) || isProperName(w) || (w.morph ?? '').startsWith('ADV')) continue;
      const key = strongBase(w.strong);
      if (FREQUENT_LEMMAS.has(key)) continue;
      const cur = counts.get(key);
      if (cur) cur.n++;
      else counts.set(key, { word: w, n: 1, first: ov.ref });
    }
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1].n - a[1].n);
  const repeated = sorted.filter(([, v]) => v.n >= 2);
  const top = (repeated.length ? repeated : sorted).slice(0, 4);
  const entries = await attempt(() => env.providers.lexicon.getEntries(top.map(([k]) => k)), new Map<string, LexiconEntry>());
  const steps = [
    step(
      'Original text',
      orig.length ? t('trace.taggedScanned', { count: orig.length, scope: scope ? formatRef(scope, 'short', locale) : 'none' }) : t('trace.taggedUnavailable'),
      pid(env.providers.originalText, 'local:original'),
    ),
    step('Lexicon', t('trace.entries', { count: entries.size }), pid(env.providers.lexicon, 'local:lexicon')),
  ];
  if (top.length === 0) {
    return {
      blocks: [para(t('word.noTaggedText'))],
      focus: { section: 'scripture' },
      steps,
      declined: true,
    };
  }
  const items = top.map(([k, v]) => {
    const e = entries.get(k);
    return t('word.freqItem', { lemma: e?.lemma ?? v.word.surface, translit: e?.transliteration ? ` *${e.transliteration}*` : '', strong: k, gloss: e ? displayGloss(e.gloss) : v.word.gloss, count: v.n });
  });
  const where = scope ? (narrowed ? t('word.chapterInView', { ref: formatRef(scope, 'long', locale) }) : formatRef(scope, 'long', locale)) : study.title;
  // the lexicon's English gloss makes a follow-up only in English
  const ask = locale === 'en' ? questionWord(top[0][1].word.gloss, entries.get(top[0][0])?.gloss) : '';
  return {
    blocks: [para(t('word.recurring', { language: top[0][1].word.language, where: psalmArticle(where, loc(env)) })), { type: 'list', items }, para(t('word.frequencyPointer'))],
    focus: { section: 'scripture', highlightVerses: uniqueVerses(top.map(([, v]) => v.first)), reason: t('reason.fromQuestion', { what: t('word.reasonRecurring') }) },
    provenance: lexical(...mergeCitations([...entries.values()].map((e) => cite(e.sourceId)), orig[0] ? [cite(orig[0].sourceId)] : [])),
    citations: mergeCitations([...entries.values()].map((e) => cite(e.sourceId)), orig[0] ? [cite(orig[0].sourceId)] : []),
    suggestions: [...(ask ? [t('suggest.meaning', { word: ask })] : []), t('suggest.explainVerse', { n: 1 })],
    steps,
  };
}

/* ------------------------------------------------------------------ */
/* Other curated studies                                               */
/* ------------------------------------------------------------------ */

/**
 * A library passage inside a curated study's anchor (2 Corinthians 4 ⊃ Suffering's
 * 2 Cor 4:7–18): answer from that study's concept or key word, and point to it.
 */
function anchoredCuratedAnswer(env: ResponderEnv, study: Study, term: string): ReplyDraft | undefined {
  const locale = loc(env);
  const t = tr(env);
  if (study.depth !== 'library' || !study.passage) return undefined;
  for (const { study: s, anchor } of curatedAnchoredIn(env, study.passage)) {
    const c = findConcept(s, term, 0.9);
    const k = findKeyWord(s, term, 0.9);
    if (!c && !k) continue;
    const kw = k?.item ?? (c ? keyWordsForTerm(s, c.item.keyWordIds, term)[0] : undefined);
    const answer = c ? c.item.answer : k!.item.significance;
    const verses = (c ? c.item.verses : kw ? kw.anchors.map((a) => a.verse) : []).filter((v) => refIncludesVerse(study.passage!, v));
    const open = openSuggestion(s, locale);
    const label = c ? c.item.label : kw!.english;
    const blocks: MessageBlock[] = [para(t('word.anchoredAnswers', { title: s.title, ref: tok.ref(anchor) })), para(excerpt(answer.text, 110))];
    if (kw) blocks.push(para(t('word.anchoredKeyWord', { lemma: kw.lemma, translit: kw.transliteration, strong: kw.strong, meaning: quoted(kw.basicMeaning, locale) })));
    blocks.push(para(t('word.openCurated', { title: s.title })));
    return {
      blocks,
      ...(verses.length ? { focus: { section: 'scripture' as const, highlightVerses: uniqueVerses(verses).slice(0, 6), reason: t('reason.fromCurated', { label, title: s.title }) } } : {}),
      citations: mergeCitations(answer.provenance.citations, kw?.provenance.citations),
      suggestions: [open, t('suggest.keyWords')],
      steps: [
        step(
          'Library',
          t('trace.anchoredAnswer', { term, kind: c ? 'concept' : 'word', label: c ? c.item.label : k!.item.lemma, id: s.id, ref: formatRef(anchor, 'short', locale) }),
          pid(env.providers.studies, 'curated:studies'),
        ),
      ],
    };
  }
  return undefined;
}

/** Word study with no study open: find a curated study where the word matters, else treat it as a topic. */
async function withoutStudy(env: ResponderEnv, term: string | undefined): Promise<ReplyDraft | undefined> {
  if (!term) return undefined;
  const hit = findTermInStudies(curatedList(env), term);
  if (!hit) return undefined;
  const opened = openCurated(env, hit.study);
  const study = opened.study!;
  const concept = hit.concept && (!hit.keyWord || hit.concept.keyWordIds.includes(hit.keyWord.id)) ? conceptById(study, hit.concept.id) : undefined;
  const inner = concept ? await conceptReply(env, study, concept, term) : await keyWordReply(env, study, keyWordById(study, (hit.keyWord ?? study.keyWords[0]).id)!, term);
  return {
    ...inner,
    blocks: [para(tr(env)('word.openedWhere', { title: study.title })), ...inner.blocks],
    study,
    updates: opened.updates,
    steps: [...opened.steps, ...inner.steps],
    announcesOpen: true,
  };
}

/** "“Flesh” doesn’t appear in Psalm 23, but it is a key word in the curated study of Romans 8 — σάρξ …" */
function redirectDraft(env: ResponderEnv, study: Study, term: string, lookup: LookupResult): ReplyDraft | undefined {
  const locale = loc(env);
  const t = tr(env);
  const other = findTermInStudies(curatedList(env), term, study.id);
  if (!other) return undefined;
  // Name a lemma only for a key word that stands for the term — never a concept's unrelated first word.
  const k = other.keyWord ?? (other.concept ? keyWordsForTerm(other.study, other.concept.keyWordIds, term)[0] : undefined);
  const open = openSuggestion(other.study, locale);
  const where = lookup.scope ? formatRef(lookup.scope, 'long', locale) : locale === 'en' ? studyName(study) : study.title;
  return {
    blocks: [
      para(
        t('word.redirect', {
          checked: lookup.checked ? 'yes' : 'no',
          term: quoted(term, locale),
          Term: quoted(capitalize(term), locale),
          where,
          kw: k ? 'yes' : 'no',
          title: other.study.title,
          lemma: k?.lemma ?? '',
          translit: k?.transliteration ?? '',
          meaning: k ? quoted(k.basicMeaning, locale) : '',
          label: quoted(other.concept?.label ?? '', locale),
        }),
      ),
    ],
    suggestions: [open, t('suggest.keyWords')],
    citations: k ? k.provenance.citations : (other.concept?.answer.provenance.citations ?? []),
    steps: [
      step('Library', t('trace.redirect', { term, title: study.title, kind: k ? 'word' : 'concept', label: k ? k.lemma : other.concept!.label, id: other.study.id }), pid(env.providers.studies, 'curated:studies')),
    ],
  };
}

export async function respondWordStudy(env: ResponderEnv): Promise<ReplyDraft | undefined> {
  const study = env.study;
  let term = env.intent.slots.term?.trim();
  if (!study) return withoutStudy(env, term);
  if (env.parsed.wantsKeyWords) return keyWordsOverview(env, study);
  if (!term) {
    const active = keyWordById(study, env.ctx.conversation.activeWordId);
    if (active) return keyWordReply(env, study, active, active.english);
    const verse = env.intent.slots.verse ?? env.ctx.conversation.activeVerse;
    const inVerse = verse ? study.keyWords.find((k) => k.anchors.some((a) => sameVerse(a.verse, verse))) : undefined;
    if (inVerse) return keyWordReply(env, study, inVerse, inVerse.english);
    return keyWordsOverview(env, study);
  }
  term = term.replace(/^(the|a|an)\s+/i, '');
  if (loc(env) !== 'en') term = term.replace(/^(?:(?:o|os|as|um|uma|el|la|los|las|un|una|le|les|une)\s+|l['’]\s*)(?=\S)/iu, '');

  const concept = findConcept(study, term);
  const kw = findKeyWord(study, term);
  if (concept && (!kw || concept.score >= kw.score)) return conceptReply(env, study, concept.item, term);
  if (kw) return keyWordReply(env, study, kw.item, term);

  const anchored = anchoredCuratedAnswer(env, study, term);
  if (anchored) return anchored;

  // In a topic study, "What does “God is love” mean?" is about the passage it quotes, not one Greek word —
  // unless the question asks for the word itself ("the Greek word for…").
  const asksForWord =
    Boolean(env.intent.slots.language) ||
    /\b(word|term|greek|hebrew|aramaic|lexicon|lemma)\b/.test(env.parsed.lower) ||
    (loc(env) !== 'en' && /\b(palavra|termo|grego|hebraico|aramaico|lexico|lema|palabra|termino|griego|hebreo|arameo|mot|terme|grec|hebreu|arameen|lexique|lemme)\b/.test(fold(env.message)));
  if (study.kind === 'topic' && !asksForWord && (termStems(term).length >= 2 || env.intent.confidence <= 0.5)) {
    const best = searchStudy(study, env.message)[0];
    if (best && best.score >= 0.8 && ['key-passage', 'topic', 'theme', 'context', 'literary'].includes(best.type)) return respondFromHit(env, best);
    const top = answeringPassages(study, env.message, env.intent.slots.passage);
    if (top.length && top[0].score >= 0.9) return { ...keyPassagesDraft(study, top, [], undefined, loc(env)), intent: { kind: 'theology', confidence: 0.5, slots: { term } } };
  }

  const lookup = await passageWordLookup(env, study, term);
  if (lookup.draft) return lookup.draft;

  const redirect = redirectDraft(env, study, term, lookup);
  if (redirect) return redirect;

  // Items that explain an idea (not debates, voices or links) can answer a word question.
  const EXPLAINS = new Set(['theme', 'context', 'literary', 'key-passage', 'topic']);
  const hit = searchStudy(study, term).find((h) => EXPLAINS.has(h.type) && h.score >= 0.6);
  if (hit) return respondFromHit(env, hit);
  // "What does it mean that humans are made in God’s image?" in a topic study → the key passage on it.
  const fromPassages = respondFromKeyPassages(env);
  if (fromPassages) return { ...fromPassages, intent: { kind: 'theology', confidence: 0.5, slots: { term } } };

  const locale = loc(env);
  const t = tr(env);
  const topics = (await attempt(() => env.providers.topics.findTopics(term!, locale), [])) as TopicMatchLike[];
  const topic = topics[0] && topics[0].score >= 0.5 ? topics[0] : undefined;
  const noData = t('word.noData', { term: quoted(term, locale), name: studyName(study, locale), kind: study.kind, title: study.title });
  return {
    blocks: [para(topic ? `${noData} ${t('word.topicEntry', { topic: topic.name })}` : noData)],
    suggestions: [...(topic ? [t('suggest.explore', { topic: locale === 'en' ? topic.name.toLowerCase() : topic.name, title: topic.name })] : []), t('suggest.keyWords')],
    steps: [
      step('Lexicon', t('trace.noWordMatch', { term }), curatedPid(study)),
      step('Topic index', topic ? t('trace.relatedTopic', { name: topic.name }) : t('trace.noRelatedTopic'), pid(env.providers.topics, 'curated:topics')),
    ],
    declined: true,
  };
}
