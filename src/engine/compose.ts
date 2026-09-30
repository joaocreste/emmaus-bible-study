/**
 * Reply building blocks: inline tokens, message blocks, focus → "Study updated"
 * labels, suggestion filling, citation merging and the plain-text fallback.
 *
 * Every reader-facing string is written in the reader's language through the
 * 'engine' message catalog (src/i18n/messages/engine.ts); English is the default.
 */
import type {
  ChatMessage,
  Citation,
  ConversationState,
  DashboardFocus,
  DashboardUpdate,
  MessageBlock,
  OriginalLanguage,
  PassageRef,
  PipelineStep,
  Provenance,
  SectionId,
  Study,
  TranslationId,
  VerseRef,
} from '../domain/models';
import { authorNameByEnglishName } from '../data/registry/i18n';
import { bookDisplayName, tryGetBook } from '../domain/books';
import { formatRef, formatVerse, parseRefKey, refIncludesVerse, refKey, verseKey } from '../domain/reference';
import { translator, type MessageKey } from '../i18n/catalog';
import { LOCALES, type Locale } from '../i18n/locales';
import type { Params } from '../i18n/translate';
import type { SourceRegistry } from '../providers/types';
import type { InspectorTarget } from '../state/types';
import type { Intent } from './types';
import { fold, joinList, lowerFirst, normalizePhrase } from './text';

/* ------------------------------------------------------------------ */
/* Language                                                            */
/* ------------------------------------------------------------------ */

/** A translator for the engine's catalog, bound to one language. */
export type Translate = (key: MessageKey<'engine'>, params?: Params) => string;

const TRANSLATORS = new Map<Locale, Translate>();

/** `engineT('pt')('reason.fromQuestion', { what })` */
export function engineT(locale: Locale = 'en'): Translate {
  let t = TRANSLATORS.get(locale);
  if (!t) TRANSLATORS.set(locale, (t = translator(locale, 'engine')));
  return t;
}

/** Words in quotation marks, as each language writes them (“…” in English and Portuguese, «…» in Spanish, « … » in French). */
export function quoted(text: string, locale: Locale = 'en'): string {
  if (locale === 'fr') return `«\u00a0${text}\u00a0»`;
  if (locale === 'es') return `«${text}»`;
  return `“${text}”`;
}

/**
 * "A", "A and B", "A, B and C" in the reader's language (no serial comma). Spanish
 * writes "e" before an i-/hi- sound and "u" before an o-/ho- sound.
 */
export function listJoin(items: readonly string[], locale: Locale = 'en', conj: 'and' | 'or' = 'and'): string {
  if (locale === 'en') return joinList(items, conj);
  if (items.length <= 1) return items[0] ?? '';
  const last = items[items.length - 1];
  const bare = last.replace(/^[*_“"«\s]+/, '').toLowerCase();
  let word: string;
  if (locale === 'pt') word = conj === 'and' ? 'e' : 'ou';
  else if (locale === 'fr') word = conj === 'and' ? 'et' : 'ou';
  else if (conj === 'and') word = /^h?i(?![aeouáéó])/.test(bare) ? 'e' : 'y';
  else word = /^h?o/.test(bare) ? 'u' : 'o';
  return `${items.slice(0, -1).join(', ')} ${word} ${last}`;
}

/**
 * A single psalm named in Spanish running prose takes the article: "El Salmo 23 tiene 6
 * versículos", "se repiten en el Salmo 51". Other labels and languages are unchanged.
 */
export function psalmArticle(label: string, locale: Locale, initial = false): string {
  if (locale !== 'es' || !/^Salmo \d/.test(label)) return label;
  return `${initial ? 'El' : 'el'} ${label}`;
}

/** The colon of a label ("**Title**: text"); French sets it off with a no-break space. */
export function colon(locale: Locale = 'en'): string {
  return locale === 'fr' ? '\u00a0:' : ':';
}

/** A title or label used mid-sentence: "Condenação" → "condenação"; names and "Espírito Santo" keep their capitals. */
export function lowerFirstIn(s: string, locale: Locale = 'en'): string {
  if (locale === 'en') return lowerFirst(s);
  if (/^(O|A|Os|As|El|La|Los|Las|Le|Les|Un|Una|Une|Um|Uma)\s/u.test(s)) return s[0].toLowerCase() + s.slice(1);
  if (/^L[’']/u.test(s)) return `l${s.slice(1)}`;
  if (/^\p{Lu}\p{Ll}+\s+(?:\p{Ll}{1,3}\s+)?\p{Lu}/u.test(s)) return s; // "Espírito Santo", "Filho do Homem"
  if (/^\p{Lu}\p{Ll}+-\p{Lu}/u.test(s)) return s; // "Jean-Baptiste et le témoignage"
  if (PROPER_WORDS.has(s.split(/\s/)[0]) || PERSON_NAMES.has(s.split(/\s/)[0])) return s;
  return /^\p{Lu}\p{Ll}/u.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
}

/** Biblical people's names that may open a label ("Jean et le témoignage", "Abraão e a fé"). */
const PERSON_NAMES: ReadonlySet<string> = new Set([
  'Jean', 'João', 'Juan', 'Paul', 'Paulo', 'Pablo', 'Pierre', 'Pedro', 'Abraham', 'Abraão', 'Moïse', 'Moisés', 'David', 'Davi', 'Adam', 'Adão', 'Adán', 'Marie', 'Maria', 'María',
]);

/** Words that keep their capital mid-sentence, in the four languages. */
export const PROPER_WORDS: ReadonlySet<string> = new Set([
  'God', 'Jesus', 'Christ', 'Lord', 'LORD', 'Spirit', 'Holy', 'Trinity', 'Father', 'Son', 'Bible', 'Scripture', 'Israel', 'Kingdom',
  'Deus', 'Cristo', 'Senhor', 'SENHOR', 'Espírito', 'Santo', 'Trindade', 'Pai', 'Filho', 'Bíblia', 'Escritura', 'Reino',
  'Dios', 'Jesús', 'Señor', 'SEÑOR', 'Espíritu', 'Trinidad', 'Padre', 'Hijo', 'Biblia',
  'Dieu', 'Jésus', 'Seigneur', 'SEIGNEUR', 'Éternel', 'Esprit', 'Saint', 'Trinité', 'Père', 'Fils', 'Écriture', 'Royaume',
]);

/** The reader's language for this context (English by default). */
export function localeOf(ctx: { locale?: Locale } | undefined): Locale {
  return ctx?.locale ?? 'en';
}

/* ------------------------------------------------------------------ */
/* Draft                                                               */
/* ------------------------------------------------------------------ */

/** What a responder produces; the engine turns it into an EngineResult. */
export interface ReplyDraft {
  blocks: MessageBlock[];
  citations?: Citation[];
  /** extra "Study updated" lines (focus-derived lines are added automatically) */
  updates?: DashboardUpdate[];
  suggestions?: string[];
  focus?: DashboardFocus;
  /** a study to open */
  study?: Study;
  /** next conversation state (defaults to the previous one) */
  conversation?: ConversationState;
  inspector?: InspectorTarget;
  /** retrieval steps (Intent and Synthesis steps are added by the engine) */
  steps: PipelineStep[];
  /** defaults to synthesis citing `citations` */
  provenance?: Provenance;
  /** replaces the classified intent (e.g. unknown resolved to a word study) */
  intent?: Intent;
  /** the reply declines for lack of a verified source */
  declined?: boolean;
  /** skip focus-derived "Study updated" lines (the responder wrote them all) */
  customUpdatesOnly?: boolean;
  /** the requested study is the one already open (nothing was opened) */
  alreadyOpen?: boolean;
  /** the first block already says which study was opened ("I’ve opened the curated study of …") */
  announcesOpen?: boolean;
}

/* ------------------------------------------------------------------ */
/* Tokens & blocks                                                     */
/* ------------------------------------------------------------------ */

export const tok = {
  ref: (r: PassageRef): string => `{{ref:${refKey(r)}}}`,
  verse: (v: VerseRef): string => `{{ref:${verseKey(v)}}}`,
  word: (id: string): string => `{{word:${id}}}`,
  section: (id: SectionId): string => `{{section:${id}}}`,
  source: (id: string): string => `{{source:${id}}}`,
};

export const para = (text: string): MessageBlock => ({ type: 'paragraph', text });
export const list = (items: string[]): MessageBlock => ({ type: 'list', items });
export const note = (tone: 'info' | 'caution', text: string): MessageBlock => ({ type: 'note', tone, text });

/** Remove characters that would break inline markup inside quoted source text. */
export function sanitizeInline(text: string): string {
  return text.replace(/\*/g, '').replace(/\{\{|\}\}/g, '').trim();
}

/** English section labels (kept for callers that have no locale). */
export const SECTION_LABEL: Record<SectionId, string> = {
  overview: 'Overview',
  scripture: 'Scripture',
  'key-passages': 'Key passages',
  'cross-references': 'Cross-references',
  'original-languages': 'Original languages',
  'historical-context': 'Historical & cultural context',
  'literary-context': 'Literary context',
  theology: 'Theology',
  commentary: 'Commentary & Christian thinkers',
  sources: 'Sources',
};

/** A dashboard section's full name in the reader's language. */
export function sectionLabel(id: SectionId, locale: Locale = 'en'): string {
  if (locale === 'en') return SECTION_LABEL[id];
  return engineT(locale)(`section.${id}` as MessageKey<'engine'>);
}

/** "8:28" inside the study's book, otherwise "Rom 8:28" (French: "8.28", "Rm 8.28"). */
export function verseLabel(v: VerseRef, study: Study | null, locale: Locale = 'en'): string {
  if (study?.passage && study.passage.book === v.book) {
    const info = tryGetBook(v.book);
    if (info && info.chapters === 1) return `v. ${v.verse}`;
    return `${v.chapter}${LOCALES[locale].verseSeparator}${v.verse}`;
  }
  return formatVerse(v, 'short', locale);
}

export function verseListLabel(verses: VerseRef[], study: Study | null, max = 3, locale: Locale = 'en'): string {
  const labels = verses.slice(0, max).map((v) => verseLabel(v, study, locale));
  if (verses.length > max) return engineT(locale)('list.andMore', { items: labels.join(', '), count: verses.length - max });
  return listJoin(labels, locale);
}

/**
 * "Explain 8:29": a follow-up about one verse. Other languages say "Explique o versículo 29" inside the
 * chapter in view and name the full reference otherwise, so the classifier resolves it unambiguously.
 */
export function explainVerseSuggestion(v: VerseRef, study: Study | null, locale: Locale = 'en'): string {
  const t = engineT(locale);
  if (locale === 'en') return t('suggest.explain', { ref: verseLabel(v, study) });
  const p = study?.passage;
  const sameChapter = Boolean(p && p.book === v.book && p.startChapter === v.chapter && (p.endChapter ?? p.startChapter) === v.chapter);
  return sameChapter ? t('suggest.explainVerse', { n: v.verse }) : t('suggest.explain', { ref: formatVerse(v, 'long', locale) });
}

/** The concordance's corpus, worded as the Inspector's occurrence line ("the Greek New Testament"). */
export function corpusName(language: OriginalLanguage, locale: Locale = 'en'): string {
  return engineT(locale)('corpus', { language });
}

/** A key word's English without its gloss in parentheses: "mind (mind-set)" → "mind". */
export function englishLabel(english: string): string {
  return english.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim() || english;
}

/** "Greek", "Hebrew", "Aramaic" (as a noun: "grego", "griego", "grec"). */
export function languageName(language: OriginalLanguage, locale: Locale = 'en'): string {
  return engineT(locale)('language', { language });
}

/**
 * A person's name in the reader's language: a biblical book's traditional author ("Paul" →
 * "Paulo", "Pablo", "Paul") from the engine catalog, else a registry author by their English
 * registry name ("John Calvin" → "João Calvino"), else the name as given.
 */
export function personName(name: string, locale: Locale = 'en'): string {
  if (locale === 'en') return name;
  const key = `person.${name}` as MessageKey<'engine'>;
  const t = engineT(locale)(key);
  return t === key ? (authorNameByEnglishName(name, locale) ?? name) : t;
}

/** A book's name in the reader's language. */
export function bookName(book: string, locale: Locale = 'en'): string {
  try {
    return bookDisplayName(book, locale);
  } catch {
    return book;
  }
}

/** Deduplicate citations by source + locator, keeping order. */
export function mergeCitations(...groups: (Citation[] | undefined)[]): Citation[] {
  const out: Citation[] = [];
  const seen = new Set<string>();
  for (const g of groups) {
    for (const c of g ?? []) {
      const key = `${c.sourceId}|${c.locator ?? ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(c);
    }
  }
  return out;
}

export function uniqueVerses(verses: VerseRef[]): VerseRef[] {
  const seen = new Set<string>();
  return verses.filter((v) => {
    const k = verseKey(v);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function uniqueIds(ids: (string | undefined)[]): string[] {
  return Array.from(new Set(ids.filter((x): x is string => Boolean(x))));
}

/* ------------------------------------------------------------------ */
/* Focus → "Study updated"                                             */
/* ------------------------------------------------------------------ */

type Noun = 'keyWord' | 'crossReference' | 'contextNote' | 'literaryFeature' | 'theme' | 'perspectiveSet' | 'commentaryEntry' | 'keyPassage' | 'bookIntroduction';

interface ItemInfo {
  section: SectionId;
  noun: Noun;
  label: string;
}

/** Map every addressable study item id to its section and a readable label. */
export function studyItemIndex(study: Study, sources?: SourceRegistry, locale: Locale = 'en'): Map<string, ItemInfo> {
  const t = engineT(locale);
  const m = new Map<string, ItemInfo>();
  for (const k of study.keyWords) m.set(k.id, { section: 'original-languages', noun: 'keyWord', label: `${k.lemma} (${englishLabel(k.english)})` });
  for (const x of study.crossReferences) m.set(x.id, { section: 'cross-references', noun: 'crossReference', label: formatRef(x.target, 'short', locale) });
  for (const c of study.context) m.set(c.id, { section: 'historical-context', noun: 'contextNote', label: c.title });
  for (const f of study.literary?.features ?? []) m.set(f.id, { section: 'literary-context', noun: 'literaryFeature', label: f.title });
  for (const th of study.theology) m.set(th.id, { section: 'theology', noun: 'theme', label: th.title });
  for (const p of study.perspectives) m.set(p.id, { section: 'theology', noun: 'perspectiveSet', label: p.question });
  for (const c of study.commentary) {
    const author = sources?.getAuthor(c.authorId)?.name;
    m.set(c.id, { section: 'commentary', noun: 'commentaryEntry', label: author ? t('item.authorEntry', { author }) : (c.lead ?? t('item.commentaryEntry')) });
  }
  for (const p of study.topic?.keyPassages ?? []) m.set(p.id, { section: 'key-passages', noun: 'keyPassage', label: formatRef(p.ref, 'short', locale) });
  return m;
}

function countLabel(n: number, noun: Noun, locale: Locale): string {
  return engineT(locale)(`noun.${noun}` as MessageKey<'engine'>, { count: n });
}

function describeFilter(f: NonNullable<DashboardFocus['crossReferenceFilter']>, locale: Locale): string | undefined {
  const t = engineT(locale);
  const parts: string[] = [];
  if (f.author) parts.push(t('filter.author', { author: personName(f.author, locale) }));
  if (f.book) parts.push(t('filter.book', { book: tryGetBook(f.book) ? bookName(f.book, locale) : f.book }));
  if (f.relationships?.length) parts.push(f.relationships.map((r) => t(`rel.filter.${r}` as MessageKey<'engine'>)).join(', '));
  if (f.tags?.length) parts.push(t('filter.tagged', { tags: f.tags.join(', ') }));
  return parts.length ? parts.join(' · ') : undefined;
}

/** The "Brought … into view" line for a section (the engine drops it when a responder wrote its own line there). */
export function broughtIntoView(section: SectionId, locale: Locale = 'en'): string {
  return engineT(locale)('focus.brought', { section: sectionLabel(section, locale) });
}

/**
 * Human-readable list of what a focus directive does to the dashboard.
 * Every line corresponds to something the workspace will visibly change.
 */
export function describeFocus(
  focus: DashboardFocus | undefined,
  study: Study | null,
  sources?: SourceRegistry,
  translation: TranslationId = 'BSB',
  locale: Locale = 'en',
): DashboardUpdate[] {
  if (!focus || !study) return [];
  const t = engineT(locale);
  const out: DashboardUpdate[] = [];
  const index = studyItemIndex(study, sources, locale);
  const words = focus.highlightWordIds ?? [];
  const wordSet = new Set(words);

  // Only verses inside the displayed passage are visibly highlighted.
  const shown = (v: VerseRef) => !study.passage || refIncludesVerse(study.passage, v);
  const kws = words.map((id) => study.keyWords.find((k) => k.id === id)).filter((k): k is NonNullable<typeof k> => Boolean(k));
  // A focused key word is underlined wherever it is anchored in the passage in the current translation.
  const rendered = (kw: (typeof kws)[number]) => kw.anchors.filter((a) => shown(a.verse) && a.phrases[translation]?.trim());
  const phrasesOf = (kw: (typeof kws)[number]) => Array.from(new Set(rendered(kw).map((a) => a.phrases[translation]!.trim().toLowerCase())));
  const visible = kws.filter((k) => rendered(k).length);
  if (visible.length && visible.length <= 2) {
    for (const kw of visible) {
      const verses = uniqueVerses(rendered(kw).map((a) => a.verse));
      const phrases = phrasesOf(kw).slice(0, 2).map((p) => quoted(p, locale));
      out.push({ section: 'scripture', label: t('focus.highlightedPhrases', { phrases: listJoin(phrases, locale), verses: verseListLabel(verses, study, 2, locale) }) });
    }
  } else if (visible.length) {
    const verses = uniqueVerses(visible.flatMap((k) => rendered(k).map((a) => a.verse)));
    const phrases = Array.from(new Set(visible.flatMap(phrasesOf))).map((p) => quoted(p, locale));
    out.push({
      section: 'scripture',
      label: t(phrases.length > 4 ? 'focus.highlightedPhrasesMore' : 'focus.highlightedPhrases', {
        phrases: listJoin(phrases.slice(0, 4), locale),
        verses: verseListLabel(verses, study, 2, locale),
      }),
    });
  }
  if (kws.length && kws.length <= 2) {
    for (const kw of kws) out.push({ section: 'original-languages', label: t('focus.openedWord', { lemma: kw.lemma, english: englishLabel(kw.english) }) });
  } else if (kws.length) {
    const lemmas = listJoin(kws.slice(0, 4).map((k) => k.lemma), locale);
    out.push({ section: 'original-languages', label: kws.length > 4 ? t('focus.openedWordsMore', { lemmas, count: kws.length - 4 }) : t('focus.openedWords', { lemmas }) });
  }
  const shownVerses = (focus.highlightVerses ?? []).filter(shown);
  if (!words.length && shownVerses.length) {
    out.push({ section: 'scripture', label: t('focus.highlightedVerses', { verses: verseListLabel(shownVerses, study, 3, locale) }) });
  }
  if (focus.crossReferenceFilter) {
    const d = describeFilter(focus.crossReferenceFilter, locale);
    if (d) out.push({ section: 'cross-references', label: t('focus.filtered', { filter: d }) });
  }
  if (focus.commentaryAuthorIds?.length) {
    const names = focus.commentaryAuthorIds.map((id) => sources?.getAuthor(id)?.name ?? id);
    out.push({ section: 'commentary', label: t('focus.showing', { names: listJoin(names, locale) }) });
  }

  const expanded = (focus.expandIds ?? []).filter((id) => !wordSet.has(id));
  const expandedSet = new Set(expanded);
  const pinned = (focus.pinIds ?? []).filter((id) => !wordSet.has(id) && !expandedSet.has(id));
  // one line per section + kind of item ("Opened “Justification”", "Prioritised 3 cross-references")
  const group = (ids: string[]) => {
    const groups = new Map<string, { section: SectionId; noun: Noun; labels: string[] }>();
    for (const id of ids) {
      const info =
        index.get(id) ?? (id.startsWith('book-intro-') ? { section: 'historical-context' as SectionId, noun: 'bookIntroduction' as Noun, label: t('item.bookIntroduction') } : undefined);
      if (!info) continue;
      const key = `${info.section}|${info.noun}`;
      const g = groups.get(key) ?? { section: info.section, noun: info.noun, labels: [] };
      g.labels.push(info.label);
      groups.set(key, g);
    }
    return [...groups.values()];
  };
  for (const g of group(pinned)) {
    out.push({
      section: g.section,
      label: g.labels.length === 1 ? t('focus.prioritisedOne', { label: g.labels[0] }) : t('focus.prioritisedMany', { items: countLabel(g.labels.length, g.noun, locale) }),
    });
  }
  for (const g of group(expanded)) {
    out.push({
      section: g.section,
      label: g.labels.length === 1 ? t('focus.openedOne', { label: g.labels[0] }) : t('focus.openedMany', { items: countLabel(g.labels.length, g.noun, locale) }),
    });
  }
  if (focus.section && !out.some((u) => u.section === focus.section)) {
    out.unshift({ section: focus.section, label: broughtIntoView(focus.section, locale) });
  } else if (focus.section) {
    // keep the focused section's lines first
    out.sort((a, b) => Number(b.section === focus.section) - Number(a.section === focus.section));
  }
  const seen = new Set<string>();
  return out.filter((u) => {
    const k = `${u.section}|${u.label}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Suggestions                                                         */
/* ------------------------------------------------------------------ */

/** Generic follow-ups for any open study, in the reader's language (phrased so the classifier understands them). */
export function genericStudySuggestions(locale: Locale = 'en'): string[] {
  const t = engineT(locale);
  return [t('suggest.keyWords'), t('suggest.crossRefs'), t('suggest.background'), t('suggest.classicCommentators')];
}

/** Passages and a topic to start from ("Romans 8", "John 1:1", "Psalm 23", "Grace") in the reader's language. */
export function startSuggestions(locale: Locale = 'en'): string[] {
  const t = engineT(locale);
  return [
    formatRef({ book: 'ROM', startChapter: 8 }, 'long', locale),
    formatRef({ book: 'JHN', startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 1 }, 'long', locale),
    formatRef({ book: 'PSA', startChapter: 23 }, 'long', locale),
    t('suggest.grace'),
  ];
}

/** 2–4 distinct suggestions: the responder's first, then the study's, then generic — never what was just asked. */
/** "What is the Greek word behind «X»?" in any wording or language → one key per language and term. */
function wordQuestionKey(text: string): string | undefined {
  const quote = /[“«"]\s*([^”»"]+?)\s*[”»"]/.exec(text);
  if (!quote) return undefined;
  const f = fold(text);
  const language = /\b(?:greek|grega?o?|griega?o?|grecq?u?e?)\b/.test(f) ? 'greek' : /\b(?:hebrew|hebraic[oa]|hebre[ao]|hebreu|hebraique)\b/.test(f) ? 'hebrew' : undefined;
  return language ? `word:${language}:${normalizePhrase(quote[1])}` : undefined;
}

export function fillSuggestions(
  primary: string[] | undefined,
  study: Study | null,
  history: ChatMessage[],
  message: string,
  fallback: string[] = [],
  locale: Locale = 'en',
): string[] {
  const askedTexts = [message, ...history.filter((m) => m.role === 'user').map((m) => m.text)];
  const asked = new Set([...askedTexts.map((t) => normalizePhrase(t)), ...askedTexts.map(wordQuestionKey).filter((k): k is string => Boolean(k))]);
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (s: string) => {
    const k = normalizePhrase(s);
    // two wordings of "the Greek word behind «X»" are one question
    const w = wordQuestionKey(s);
    if (!k || seen.has(k) || asked.has(k) || (w && (seen.has(w) || asked.has(w))) || out.length >= 4) return;
    seen.add(k);
    if (w) seen.add(w);
    out.push(s);
  };
  for (const s of primary ?? []) push(s);
  if (out.length < 3) for (const s of study?.suggestedQuestions ?? []) push(s);
  if (out.length < 2) for (const s of study ? genericStudySuggestions(locale) : fallback) push(s);
  if (out.length < 2) for (const s of fallback) push(s);
  return out.slice(0, 4);
}

/* ------------------------------------------------------------------ */
/* Plain text                                                          */
/* ------------------------------------------------------------------ */

/** Plain-text rendering of a reply (tokens → readable labels, markdown stripped). */
export function blocksToPlainText(blocks: MessageBlock[], study: Study | null, sources: SourceRegistry, locale: Locale = 'en'): string {
  const t = engineT(locale);
  const inline = (s: string) =>
    s
      .replace(/\{\{(ref|word|section|source):([^}|]+)(?:\|([^}]*))?\}\}/g, (_m, kind: string, value: string, label?: string) => {
        if (label) return label;
        if (kind === 'ref') {
          const r = parseRefKey(value.trim());
          return r ? formatRef(r, 'long', locale) : value;
        }
        if (kind === 'word') {
          const kw = study?.keyWords.find((k) => k.id === value.trim());
          return kw ? kw.lemma : value;
        }
        if (kind === 'section') return SECTION_LABEL[value.trim() as SectionId] ? sectionLabel(value.trim() as SectionId, locale) : value;
        return sources.getSource(value.trim())?.title ?? value;
      })
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1');
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === 'paragraph') parts.push(inline(b.text));
    else if (b.type === 'list') parts.push(b.items.map((i) => `• ${inline(i)}`).join('\n'));
    else if (b.type === 'note') parts.push(inline(b.text));
    else if (b.type === 'scripture') parts.push(`${formatRef(b.ref, 'long', locale)} (${b.translation})${colon(locale)} ${b.text}`);
    else if (b.type === 'quote') {
      const entry = study?.commentary.find((c) => c.id === b.commentaryId);
      if (!entry) continue;
      const name = sources.getAuthor(entry.authorId)?.name ?? entry.authorId;
      const verified = entry.kind === 'quotation' && entry.provenance.verification === 'verified';
      parts.push(verified ? `“${entry.text}” — ${name}` : t('plain.summary', { name, text: entry.text }));
    }
  }
  return parts.join('\n\n');
}
