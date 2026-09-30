/**
 * Retrieval over a study's items — the local stand-in for a future
 * embedding/RAG index: concepts, key words, verse-linked items and a
 * best-effort keyword search across every section.
 *
 * Multilingual: a study translated by an overlay carries its concept aliases in
 * the reader's language *and* in English, key words whose `english` field is in
 * the reader's language (the English words survive in the English anchors), and
 * English tags. Matching is accent-insensitive, so "condenação", "condenacao" and
 * "condemnation" all find κατάκριμα.
 */
import type { Citation, Concept, CrossReference, CuratedStudy, KeyWord, PassageRef, SectionId, Study, TopicPassage, VerseRef } from '../domain/models';
import { tryGetBook } from '../domain/books';
import { refIncludesVerse, refsOverlap, sameVerse } from '../domain/reference';
import { englishLabel } from './compose';
import { bestPhraseScore, contentTokens, fold, normalizePhrase, normalizeTopicQuery, phraseScore, stem, STOPWORDS } from './text';

export interface Scored<T> {
  item: T;
  score: number;
}

/** Best concept for a term (label + aliases). */
export function findConcept(study: Pick<Study, 'concepts'>, term: string, min = 0.6): Scored<Concept> | undefined {
  let best: Scored<Concept> | undefined;
  for (const c of study.concepts) {
    const score = bestPhraseScore(term, [c.label, ...c.aliases]);
    if (score >= min && (!best || score > best.score)) best = { item: c, score };
  }
  return best;
}

/**
 * How well a key word stands for an asked term, 0–1: its gloss (`english`, in the
 * reader's language once translated — and each alternative in "made His dwelling
 * / dwelt"), transliteration, lemma (accents ignored) or Strong's number; an exact
 * anchor phrase in any translation ("only begotten" in the KJV, "condenação" in
 * the Bíblia Livre) counts 0.9.
 */
export function keyWordTermScore(k: KeyWord, term: string): number {
  const t = term.trim().toLowerCase();
  if (!t) return 0;
  if (fold(k.transliteration) === fold(term) || fold(k.lemma) === fold(term) || k.strong.toLowerCase() === t) return 1;
  const english = [k.english, englishLabel(k.english), ...k.english.split(/\s*[/,;]\s*|\s+(?:or|ou|o)\s+/)].filter(Boolean);
  const score = bestPhraseScore(term, [...english, k.transliteration, k.lemma]);
  const anchors = k.anchors.flatMap((a) => Object.values(a.phrases).filter((p): p is string => Boolean(p)));
  const anchorScore = bestPhraseScore(term, anchors) >= 0.95 ? 0.9 : 0;
  return Math.max(score, anchorScore);
}

/** Best key word for a term (English, transliteration, lemma — accents ignored — Strong's number, or anchor phrase). */
export function findKeyWord(study: Pick<Study, 'keyWords'>, term: string, min = 0.6): Scored<KeyWord> | undefined {
  let best: Scored<KeyWord> | undefined;
  for (const k of study.keyWords) {
    const score = keyWordTermScore(k, term);
    if (score >= min && (!best || score > best.score)) best = { item: k, score };
  }
  return best;
}

/**
 * A concept named inside free text by one of its multi-word labels or aliases
 * ("Why is Jesus called *the Lamb of God*?"), longest alias first.
 */
export function findConceptInText(study: Pick<Study, 'concepts'>, text: string): { concept: Concept; alias: string } | undefined {
  const hay = ` ${normalizePhrase(text)} `;
  let best: { concept: Concept; alias: string } | undefined;
  for (const c of study.concepts) {
    for (const a of [c.label, ...c.aliases]) {
      const n = normalizePhrase(a);
      if (!n || n.split(' ').filter((t) => !STOPWORDS.has(t)).length < 2) continue;
      if (hay.includes(` ${n} `) && (!best || n.length > best.alias.length)) best = { concept: c, alias: n };
    }
  }
  return best;
}

export function keyWordById(study: Study, id: string | undefined): KeyWord | undefined {
  return id ? study.keyWords.find((k) => k.id === id) : undefined;
}

export function conceptById(study: Study, id: string | undefined): Concept | undefined {
  return id ? study.concepts.find((c) => c.id === id) : undefined;
}

/** Concepts that include a key word. */
export function conceptsForKeyWord(study: Study, keyWordId: string): Concept[] {
  return study.concepts.filter((c) => c.keyWordIds.includes(keyWordId));
}

/** Key words anchored in a verse. */
export function keyWordsInVerse(study: Study, v: VerseRef): KeyWord[] {
  return study.keyWords.filter((k) => k.anchors.some((a) => sameVerse(a.verse, v)));
}

/** Curated cross-references that start from a verse. */
export function crossRefsFromVerse(study: Study, v: VerseRef): CrossReference[] {
  return study.crossReferences.filter((x) => refIncludesVerse(x.from, v));
}

/** First concept whose verses include v. */
export function conceptForVerse(study: Study, v: VerseRef): Concept | undefined {
  return study.concepts.find((c) => c.verses.some((cv) => sameVerse(cv, v)));
}

export type StudyHitType =
  | 'concept'
  | 'key-word'
  | 'cross-reference'
  | 'context'
  | 'literary'
  | 'theme'
  | 'perspective'
  | 'commentary'
  | 'key-passage'
  | 'topic';

export interface StudyHit {
  type: StudyHitType;
  id: string;
  section: SectionId;
  title: string;
  summary: string;
  score: number;
  /** the passage the item is about (cross-references, key passages) */
  ref?: PassageRef;
  citations: Citation[];
}

interface SearchItem {
  hit: Omit<StudyHit, 'score'>;
  /** short label fields (titles, aliases, tags) — phrase-matched */
  labels: string[];
  /** stemmed content tokens of labels + body */
  tokens: Set<string>;
  /** stemmed content tokens of the labels only */
  labelTokens: Set<string>;
}

// Words that say what kind of answer is wanted, or name God/Scripture in general — never enough on their own
// to decide that a question is about one particular debate or passage.
const GENERIC_QUERY_WORDS = new Set(
  [
    'bible', 'scripture', 'scriptures', 'god', 'jesus', 'christ', 'lord', 'christian', 'christians', 'teach', 'teaching', 'say', 'speak', 'new', 'old', 'testament', 'passage', 'verse', 'verses', 'book', 'mean', 'meaning', 'think', 'people', 'believe', 'have', 'wrong', 'right', 'true', 'connect', 'relate', 'fit', 'together', 'link', 'compare', 'understand', 'explain', 'happen',
    // pt / es / fr (folded)
    'biblia', 'escritura', 'escrituras', 'ecriture', 'ecritures', 'deus', 'dios', 'dieu', 'cristo', 'senhor', 'senor', 'seigneur', 'cristao', 'cristaos', 'cristiano', 'cristianos', 'chretien', 'chretiens',
    'ensina', 'ensinar', 'ensino', 'ensena', 'ensenar', 'ensenanza', 'enseigne', 'enseigner', 'enseignement', 'diz', 'dizer', 'dice', 'decir', 'dit', 'dire', 'fala', 'falar', 'habla', 'hablar', 'parle', 'parler',
    'novo', 'nuevo', 'nouveau', 'antigo', 'antiguo', 'ancien', 'testamento', 'passagem', 'pasaje', 'versiculo', 'versiculos', 'verset', 'versets', 'livro', 'libro',
    'significa', 'significado', 'signifie', 'sens', 'pensar', 'pensam', 'piensan', 'pensent', 'pessoas', 'personas', 'gens', 'acreditar', 'creer', 'croire', 'errado', 'certo', 'vrai',
    'conectar', 'relaciona', 'relacionar', 'relier', 'lien', 'comparar', 'comparer', 'entender', 'comprender', 'comprendre', 'explicar', 'expliquer', 'acontecer', 'suceder', 'arriver',
  ].map(stem),
);

// Questions that name a doctrine without its usual word: "the Son as God" asks about the deity of Christ.
// The expansion words cover the study's English tags and its translated labels.
const QUERY_EXPANSIONS: [RegExp, string[]][] = [
  [/\b(son|jesus|christ|word|messiah)\b.*\b(as|is|was|be|being)\s+(god|divine)\b|\b(divinity|deity|godhood)\b/, ['deity']],
  [
    /\b(filho|hijo|fils|jesus|cristo|christ|verbo|palabra|messias|mesias|messie)\b.*\b(como|e|es|era|foi|fue|est|etait|ser|etre)\s+(deus|dios|dieu|divino|divin)\b|\b(divindade|deidade|divinidad|deidad|divinite)\b/,
    ['deity', 'divindade', 'divinidad', 'divinite'],
  ],
];

/** Traditional authors of books (books.ts, English) and their names in pt/es/fr — labels for key passages. */
const AUTHOR_NAMES: Record<string, string[]> = {
  paul: ['paulo', 'pablo'],
  john: ['joao', 'juan', 'jean'],
  peter: ['pedro', 'pierre'],
  james: ['tiago', 'santiago', 'jacques'],
  luke: ['lucas', 'luc'],
  matthew: ['mateus', 'mateo', 'matthieu'],
  mark: ['marcos', 'marc'],
  moses: ['moises', 'moise'],
  solomon: ['salomao', 'salomon'],
  isaiah: ['isaias', 'esaie'],
  jeremiah: ['jeremias', 'jeremie'],
  ezekiel: ['ezequiel', 'ezechiel'],
};

/** Stemmed content words of a question that can decide what it is about (not "Bible", "God", "teach"…). */
export function distinctiveStems(text: string): string[] {
  const lower = fold(text);
  const extra = QUERY_EXPANSIONS.flatMap(([re, words]) => (re.test(lower) ? words : []));
  return Array.from(new Set([...contentTokens(text), ...extra].map(stem))).filter((t) => !GENERIC_QUERY_WORDS.has(t));
}

function searchItems(study: Study): SearchItem[] {
  const items: SearchItem[] = [];
  const add = (hit: Omit<StudyHit, 'score'>, labels: string[], body: string[] = []) => {
    const labelTokens = new Set(labels.flatMap((f) => contentTokens(f)).map(stem));
    const tokens = new Set([...labelTokens, ...body.flatMap((f) => contentTokens(f)).map(stem)]);
    items.push({ hit, labels, tokens, labelTokens });
  };
  for (const c of study.concepts) {
    add({ type: 'concept', id: c.id, section: c.primarySection, title: c.label, summary: c.answer.text, citations: c.answer.provenance.citations }, [c.label, ...c.aliases]);
  }
  for (const k of study.keyWords) {
    add(
      { type: 'key-word', id: k.id, section: 'original-languages', title: `${k.lemma} (${k.english})`, summary: k.basicMeaning, citations: k.provenance.citations },
      [k.english, k.transliteration, k.lemma],
      [k.basicMeaning],
    );
  }
  for (const x of study.crossReferences) {
    add({ type: 'cross-reference', id: x.id, section: 'cross-references', title: x.title, summary: x.explanation.text, citations: x.explanation.provenance.citations, ref: x.target }, [x.title, ...x.tags]);
  }
  for (const c of study.context) {
    add({ type: 'context', id: c.id, section: 'historical-context', title: c.title, summary: c.summary, citations: c.provenance.citations }, [c.title, ...c.tags], [c.summary]);
  }
  for (const f of study.literary?.features ?? []) {
    add({ type: 'literary', id: f.id, section: 'literary-context', title: f.title, summary: f.description, citations: f.provenance.citations }, [f.title, ...f.tags], [f.description]);
  }
  for (const t of study.theology) {
    add({ type: 'theme', id: t.id, section: 'theology', title: t.title, summary: t.summary, citations: t.provenance.citations }, [t.title, ...t.tags], [t.summary]);
  }
  for (const p of study.perspectives) {
    add({ type: 'perspective', id: p.id, section: 'theology', title: p.question, summary: p.intro, citations: p.provenance.citations }, [p.question, ...p.tags], [p.intro]);
  }
  for (const c of study.commentary) {
    add({ type: 'commentary', id: c.id, section: 'commentary', title: c.lead ?? c.id, summary: c.text, citations: c.provenance.citations }, [...c.tags, ...(c.lead ? [c.lead] : [])]);
  }
  for (const k of study.topic?.keyPassages ?? []) {
    add(
      { type: 'key-passage', id: k.id, section: 'key-passages', title: k.title, summary: k.note.text, citations: k.note.provenance.citations, ref: k.ref },
      [k.title, ...k.tags, k.group],
      [k.note.text],
    );
  }
  if (study.topic) {
    const t = study.topic;
    add(
      { type: 'topic', id: `topic:${study.id}`, section: 'key-passages', title: t.question ?? t.name, summary: t.definition.text, citations: t.definition.provenance.citations },
      [t.name, ...(t.question ? [t.question] : [])],
      [t.definition.text],
    );
  }
  return items;
}

/**
 * Best-effort search across every item of a study. Phrase matches on labels,
 * aliases and tags score highest; otherwise words are weighted by rarity
 * (IDF), so the distinctive words of a question decide ("person" and "force"
 * outweigh "spirit" inside a study about the Spirit).
 */
export function searchStudy(study: Study, text: string): StudyHit[] {
  const q = Array.from(new Set(contentTokens(text).map(stem)));
  if (q.length === 0) return [];
  const items = searchItems(study);
  const n = items.length || 1;
  const df = new Map(q.map((t) => [t, items.filter((it) => it.tokens.has(t)).length]));
  const weight = (t: string) => Math.log(1 + n / Math.max(1, df.get(t) ?? 0));
  // Words found in no item cannot rank items; they only dilute the score a little.
  const total = q.reduce((sum, t) => sum + weight(t) * ((df.get(t) ?? 0) > 0 ? 1 : 0.35), 0);
  const query = normalizeTopicQuery(text) || normalizePhrase(text);
  const hits: StudyHit[] = [];
  for (const it of items) {
    // A label counts as a phrase match only when the question is not longer than it
    // ("fruit of the Spirit" matches that tag; "Can a Christian lose their salvation?" does not match "Salvation").
    let phrase = 0;
    for (const label of it.labels) {
      const l = normalizeTopicQuery(label) || normalizePhrase(label);
      const s = phraseScore(query, l);
      if (s >= 0.95 || query.length <= l.length) phrase = Math.max(phrase, s);
    }
    // A debate is the answer only when the question touches the debate itself (its question or tags), not just
    // words of its introduction: "How can God be one and three?" is not the Filioque question.
    if (it.hit.type === 'perspective' && phrase < 0.9 && !q.some((t) => it.labelTokens.has(t) && !GENERIC_QUERY_WORDS.has(t))) continue;
    const matched = q.filter((t) => it.tokens.has(t)).reduce((sum, t) => sum + weight(t), 0);
    const overlap = total > 0 ? matched / total : 0;
    // the topic definition is long and general: let specific items win near-ties
    const score = Math.max(phrase, overlap * (it.hit.type === 'topic' ? 0.7 : 0.8));
    if (score >= 0.4) hits.push({ ...it.hit, score });
  }
  const typeRank: Record<StudyHitType, number> = {
    concept: 0,
    'key-word': 1,
    theme: 2,
    context: 3,
    literary: 4,
    'key-passage': 5,
    perspective: 6,
    topic: 7,
    'cross-reference': 8,
    commentary: 9,
  };
  return hits.sort((a, b) => b.score - a.score || typeRank[a.type] - typeRank[b.type]);
}

/**
 * Curated studies (other than `exceptId`) where a term matters. A key word whose
 * English *is* the term (σάρξ "flesh" in Romans 8) outranks a concept that only
 * lists the term among its aliases (Grace's "But God" concept mentions flesh);
 * among equals the study whose topic is the term wins, then library order.
 */
export function findTermInStudies(
  studies: readonly CuratedStudy[],
  term: string,
  exceptId?: string,
): { study: CuratedStudy; concept?: Concept; keyWord?: KeyWord; score: number } | undefined {
  let best: { study: CuratedStudy; concept?: Concept; keyWord?: KeyWord; score: number } | undefined;
  for (const s of studies) {
    if (s.id === exceptId) continue;
    const topical = bestPhraseScore(term, s.match.topics) >= 0.95 ? 0.05 : 0;
    const c = findConcept(s, term, 0.9);
    const k = findKeyWord(s, term, 0.9);
    if (!c && !k) continue;
    const total = (k ? k.score + 0.1 : c!.score) + topical;
    if (!best || total > best.score) best = { study: s, ...(c ? { concept: c.item } : {}), ...(k ? { keyWord: k.item } : {}), score: total };
  }
  return best;
}

/**
 * The key words of a concept that stand for the asked term, best first: the
 * term itself (score ≥ 0.9), or a word of a longer phrase that *is* the key
 * word's English ("lamb of god" → ἀμνός "Lamb"; never "God" or "Lord" alone).
 */
export function keyWordsForTerm(study: Pick<Study, 'keyWords'>, ids: readonly string[], term: string): KeyWord[] {
  const kws = ids.map((id) => study.keyWords.find((k) => k.id === id)).filter((k): k is KeyWord => Boolean(k));
  const whole = kws
    .map((k) => ({ k, s: keyWordTermScore(k, term) }))
    .filter((x) => x.s >= 0.9)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.k);
  if (whole.length) return whole;
  const hay = ` ${normalizePhrase(term)} `;
  return kws.filter((k) => {
    const english = normalizePhrase(englishLabel(k.english));
    return Boolean(english) && contentTokens(english).some((t) => !GENERIC_QUERY_WORDS.has(stem(t))) && hay.includes(` ${english} `) && english !== hay.trim();
  });
}

/**
 * Key passages of a topic study ranked for a question: words of the question in
 * a passage's title or tags count fully, in its note half; rarer words weigh
 * more; a passage the question names outright scores at least 0.9. Words that
 * only say "Bible", "God" or "teach" are ignored.
 */
export function rankKeyPassages(study: Pick<Study, 'topic'>, text: string, named?: PassageRef): (Scored<TopicPassage> & { labelHits: number })[] {
  const kps = study.topic?.keyPassages ?? [];
  if (!kps.length) return [];
  // The topic's own name ("resurrection" in the Resurrection topic) is what every passage is about: it decides
  // nothing while the question names something else.
  const own = new Set(contentTokens(study.topic!.name).map(stem));
  const all = distinctiveStems(text);
  const q = all.some((t) => !own.has(t)) ? all.filter((t) => !own.has(t)) : all;
  // "Does the Old Testament teach…" keeps to that testament (in any of the four languages).
  const lower = fold(text);
  const testament = /\b(old testament|hebrew bible|hebrew scriptures|antigo testamento|antiguo testamento|ancien testament)\b/.test(lower)
    ? 'OT'
    : /\b(new testament|novo testamento|nuevo testamento|nouveau testament)\b/.test(lower)
      ? 'NT'
      : undefined;
  const inTestament = kps.filter((k) => !testament || tryGetBook(k.ref.book)?.testament === testament);
  // A passage is also "labelled" by its book's traditional author ("Paul and James" → Romans, James; "Paulo e Tiago" too).
  const author = (ref: PassageRef) => {
    const key = (tryGetBook(ref.book)?.traditionalAuthor ?? '').split(/[\s(]/)[0].toLowerCase();
    return [key, ...(AUTHOR_NAMES[key] ?? [])].join(' ');
  };
  const fields = (inTestament.length ? inTestament : kps).map((k) => ({
    k,
    label: new Set([k.title, ...k.tags, author(k.ref)].flatMap((f) => contentTokens(f)).map(stem)),
    note: new Set(contentTokens(k.note.text).map(stem)),
  }));
  const n = kps.length;
  // A word in few titles/tags marks what those passages are *about* ("Adam and Christ"), even if many notes mention it.
  // Words found nowhere cannot rank passages. A full score needs the words in a title or tag; a note alone counts 0.4.
  const anyDf = new Map(q.map((t) => [t, fields.filter((f) => f.label.has(t) || f.note.has(t)).length]));
  const labelWeight = new Map(
    q.map((t) => {
      const df = fields.filter((f) => f.label.has(t)).length;
      return [t, anyDf.get(t) ? Math.log(1 + n / Math.max(1, df)) : 0];
    }),
  );
  const noteWeight = new Map(q.map((t) => [t, anyDf.get(t) ? 0.4 * Math.log(1 + n / anyDf.get(t)!) : 0]));
  const total = q.reduce((sum, t) => sum + (labelWeight.get(t) ?? 0), 0);
  return fields
    .map((f) => {
      let hit = 0;
      let labelHits = 0;
      for (const t of q) {
        if (f.label.has(t)) {
          hit += labelWeight.get(t) ?? 0;
          labelHits++;
        } else if (f.note.has(t)) hit += Math.min(noteWeight.get(t) ?? 0, labelWeight.get(t) ?? 0);
      }
      let score = total > 0 ? hit / total : 0;
      if (named && refsOverlap(f.k.ref, named)) score = Math.max(score, 0.9);
      return { item: f.k, score, labelHits };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.labelHits - a.labelHits);
}
