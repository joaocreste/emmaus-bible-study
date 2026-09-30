/**
 * Attribution grounding for generated prose (validator helpers, pure):
 *
 * - names: authors in the source registry (surnames, short names, aliases), the
 *   historic works and people models tend to cite from memory (Josephus, Philo,
 *   Hillel, the Mishnah, Westminster, Trent…) — a name in the prose must be named by,
 *   or be the author of, one of the item's cited evidence texts;
 * - dates: a year in the prose must appear in the cited evidence (or its source's
 *   metadata: publication year, author lifespan);
 * - traditions: "Catholics…", "the Reformed…" must be named by or represented in the
 *   cited evidence; a perspectives position must cite a text OF its tradition.
 *
 * These are the routes by which claims from memory would otherwise reach the page.
 */
import { BOOKS } from '../../src/domain/books';
import type { Author } from '../../src/domain/models';
import { STOPWORDS, stem, tokenize } from '../../src/engine/text';
import type { Evidence } from '../../src/inference/protocol';
import type { ProviderRegistry, SourceRegistry } from '../../src/providers/types';
import { familiesOf, TRADITION_FAMILIES } from '../kb/traditions';

/* ------------------------------------------------------------------ */
/* Authors                                                             */
/* ------------------------------------------------------------------ */

function safeSync<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

/** The author of an evidence item: its own authorId, else the source's first registered author. */
export function authorOf(e: Evidence, providers: ProviderRegistry): string | undefined {
  const sources = providers.sources;
  if (e.authorId && safeSync(() => sources.getAuthor(e.authorId!))) return e.authorId;
  const source = safeSync(() => sources.getSource(e.sourceId));
  return source?.authorIds.find((a) => Boolean(safeSync(() => sources.getAuthor(a))));
}

/* ------------------------------------------------------------------ */
/* Names                                                               */
/* ------------------------------------------------------------------ */

/** Names that are also biblical persons, books or everyday words: never treated as an attribution. */
const NOT_NAMES = new Set(
  [
    'strong', 'thomas', 'john', 'james', 'matthew', 'mark', 'luke', 'paul', 'peter', 'jude', 'simon', 'philip', 'andrew', 'stephen',
    'timothy', 'titus', 'mary', 'joseph', 'david', 'moses', 'aaron', 'abraham', 'isaac', 'jacob', 'adam', 'daniel', 'samuel',
    'saul', 'solomon', 'elijah', 'elisha', 'jesus', 'christ', 'lord', 'israel', 'judah', 'herod', 'pilate', 'caesar',
    'church', 'bible', 'testament', 'gospel', 'holy', 'spirit', 'father', 'saint', 'house', 'publishers', 'assembly', 'synod',
    'council', 'formula', 'theologians', 'continuators', 'england', 'reformers', 'fathers', 'jr', 'sr', 'and',
    // places that are also councils' or bishops' sees, and words that are traditions or common names
    'jerusalem', 'damascus', 'rome', 'antioch', 'corinth', 'ephesus', 'galilee', 'samaria', 'bethlehem', 'nazareth', 'babylon',
    'egypt', 'alexandria', 'london', 'baptist', 'baptists', 'brown', 'william', 'particular', 'confession', 'catechism',
    // capitalised function words, ordinals and tradition words (traditions have their own check)
    'the', 'a', 'an', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'general', 'great', 'sacred', 'ecumenical',
    'national', 'provincial', 'catholic', 'orthodox', 'reformed', 'lutheran', 'anglican', 'methodist', 'presbyterian', 'evangelical',
  ].concat(BOOKS.flatMap((b) => b.name.toLowerCase().split(/\s+/))),
);

/**
 * People and works a model is likely to cite from memory that are not registry authors:
 * each must be named by the cited evidence when the prose names it.
 */
const HISTORIC_NAMES = [
  // Second Temple and rabbinic
  'Josephus', 'Philo', 'Hillel', 'Shammai', 'Gamaliel', 'Akiba', 'Akiva', 'Mishnah', 'Talmud', 'Qumran', 'Essenes',
  // fathers and medieval
  'Origen', 'Tertullian', 'Jerome', 'Ambrose', 'Cyprian', 'Eusebius', 'Ignatius', 'Polycarp', 'Clement', 'Basil', 'Anselm',
  'Pelagius', 'Marcion', 'Didache', 'Hermas', 'Lombard', 'Bernard',
  // Reformation and after
  'Erasmus', 'Zwingli', 'Beza', 'Bullinger', 'Bucer', 'Melanchthon', 'Knox', 'Cranmer', 'Hooker', 'Baxter', 'Bunyan',
  'Whitefield', 'Moody', 'Ryle', 'Maclaren', 'Bengel', 'Alford', 'Lightfoot', 'Westcott', 'Godet', 'Barnes', 'Poole', 'Kuyper',
  'Bavinck', 'Barth', 'Bultmann', 'Schleiermacher', 'Kierkegaard', 'Newman',
  // modern scholars and writers
  'Grudem', 'Schreiner', 'Keener', 'Wenham', 'Instone-Brewer', 'Hagner', 'Bruce', 'Ladd', 'Murray', 'Stott', 'Hauerwas',
  // confessions, councils and standard works
  'Westminster', 'Heidelberg', 'Augsburg', 'Dort', 'Trent', 'Chalcedon', 'Nicaea', 'Belgic', 'Concord', 'Vatican', 'Catechism',
  'Institutes', 'Summa', 'Septuagint', 'Vulgate', 'Targum',
];

/** Other spellings a text may use for a historic name ("the Septuagint" is "LXX" in the lexicons). */
const NAME_ALIASES: Record<string, string[]> = {
  Septuagint: ['LXX'],
  Akiba: ['Akiva'],
  Akiva: ['Akiba'],
  Nicaea: ['Nicene', 'Nice'],
  Dort: ['Dordt', 'Dordrecht'],
  Vulgate: ['Vulg'],
};

export interface NameEntry {
  /** the name as it appears in prose, e.g. "Calvin", "JFB", "Josephus" */
  token: string;
  re: RegExp;
  /** registry authors this name refers to */
  authorIds: Set<string>;
}

const nameIndexCache = new WeakMap<SourceRegistry, NameEntry[]>();

function titleCase(w: string): string {
  return w.length <= 3 && !/[aeiou]/.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1);
}

/** Words that make a name corporate ("Synod of Dort", "Tyndale House Publishers"): all its distinctive words name it. */
const CORPORATE_WORDS = new Set(['council', 'synod', 'assembly', 'formula', 'publishers', 'house', 'continuators', 'theologians', 'church', 'conference', 'convention']);

/**
 * The words by which prose would name an author: a person's surname ("John Calvin" →
 * Calvin; "Augustine of Hippo" → Augustine, never the place), every distinctive word of
 * a corporate author ("Synod of Dort" → Dort), and single-word aliases ("JFB", "Keller").
 */
function nameTokens(a: Author): string[] {
  const out = new Set<string>();
  const words = (s: string) => s.split(/[\s,()]+/).map((w) => w.replace(/[’']s$/, '').replace(/[^\p{L}-]/gu, '')).filter(Boolean);
  const distinctive = (w: string) => /^\p{Lu}/u.test(w) && !/^\p{Lu}$/u.test(w) && !NOT_NAMES.has(w.toLowerCase());
  for (const label of [a.name, a.shortName ?? '']) {
    const ws = words(label);
    if (!ws.length) continue;
    if (ws.some((w) => CORPORATE_WORDS.has(w.toLowerCase()))) {
      for (const w of ws) if (distinctive(w)) out.add(w);
      continue;
    }
    // a person: the surname, never the place in "X of Y"
    const of = ws.findIndex((w) => w.toLowerCase() === 'of');
    const person = (of > 0 ? ws.slice(0, of) : ws).filter((w) => !/^\p{Lu}$/u.test(w));
    const last = person[person.length - 1];
    if (last && distinctive(last)) out.add(last);
  }
  for (const alias of a.aliases ?? []) {
    const parts = alias.trim().split(/\s+/);
    if (parts.length === 1 && !NOT_NAMES.has(parts[0])) out.add(titleCase(parts[0]));
  }
  return [...out].filter((t) => t.length >= 3 && !NOT_NAMES.has(t.toLowerCase()));
}

/** Names the validator checks, built once per source registry. */
export function nameIndex(sources: SourceRegistry): NameEntry[] {
  const cached = nameIndexCache.get(sources);
  if (cached) return cached;
  const byToken = new Map<string, NameEntry>();
  const add = (token: string, authorId?: string) => {
    let entry = byToken.get(token);
    if (!entry) {
      const esc = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      entry = { token, re: new RegExp(`(?<![\\p{L}-])${esc}(?![\\p{L}-])`, 'u'), authorIds: new Set() };
      byToken.set(token, entry);
    }
    if (authorId) entry.authorIds.add(authorId);
  };
  for (const a of safeSync(() => sources.allAuthors()) ?? []) for (const t of nameTokens(a)) add(t, a.id);
  for (const t of HISTORIC_NAMES) add(t);
  const list = [...byToken.values()];
  nameIndexCache.set(sources, list);
  return list;
}

/** Names (registry authors, historic people and works) the text mentions. */
export function namesIn(text: string, sources: SourceRegistry): NameEntry[] {
  return nameIndex(sources).filter((n) => n.re.test(text));
}

/* ------------------------------------------------------------------ */
/* Evidence haystacks                                                  */
/* ------------------------------------------------------------------ */

export interface EvidenceView {
  e: Evidence;
  /** full retrieved text */
  fullText: string;
}

const haystackCache = new WeakMap<Evidence, string>();

/** Everything an evidence item says about itself: title, full text, locator, tradition, author (name, aliases, tradition, lifespan), source title and year. */
export function haystack(v: EvidenceView, providers: ProviderRegistry): string {
  const hit = haystackCache.get(v.e);
  if (hit) return hit;
  const sources = providers.sources;
  const authorId = authorOf(v.e, providers);
  const author = authorId ? safeSync(() => sources.getAuthor(authorId)) : undefined;
  const source = safeSync(() => sources.getSource(v.e.sourceId));
  const text = [
    v.e.title,
    v.fullText,
    v.e.locator ?? '',
    v.e.tradition ?? '',
    author ? `${author.name} ${author.shortName ?? ''} ${(author.aliases ?? []).join(' ')} ${author.tradition} ${author.lifespan ?? ''}` : '',
    source ? `${source.title} ${source.year ?? ''} ${source.edition ?? ''}` : '',
  ].join('\n');
  haystackCache.set(v.e, text);
  return text;
}

function wordIn(hay: string, word: string): boolean {
  const esc = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${esc}(?![\\p{L}])`, 'iu').test(hay);
}

/** Names in the text that none of the cited evidence names or is written by. */
export function unnamedNames(text: string, cited: readonly EvidenceView[], providers: ProviderRegistry): string[] {
  const out: string[] = [];
  for (const n of namesIn(text, providers.sources)) {
    const ok = cited.some((v) => {
      const author = authorOf(v.e, providers);
      if (author && n.authorIds.has(author)) return true;
      const hay = haystack(v, providers);
      return [n.token, ...(NAME_ALIASES[n.token] ?? [])].some((t) => wordIn(hay, t));
    });
    if (!ok) out.push(n.token);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

const YEAR_RE = /\b(?:AD|A\.D\.|BC|B\.C\.|BCE|CE)\s*(\d{1,4})\b|\b(\d{1,4})\s*(?:AD|A\.D\.|BC|B\.C\.|BCE|CE)\b|(?<![\d:.,–-])\b(1\d{3}|20\d{2})\b(?![\d:])/g;

/** Years written in the text ("1646", "AD 70", "586 BC"). */
export function yearsIn(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(YEAR_RE)) {
    const y = m[1] ?? m[2] ?? m[3];
    if (y && !out.includes(y)) out.push(y);
  }
  return out;
}

/** Years in the text that no cited evidence (text or source metadata) contains. */
export function ungroundedYears(text: string, cited: readonly EvidenceView[], providers: ProviderRegistry): string[] {
  return yearsIn(text).filter((y) => !cited.some((v) => new RegExp(`(?<!\\d)${y}(?!\\d)`).test(haystack(v, providers))));
}

/* ------------------------------------------------------------------ */
/* Traditions                                                          */
/* ------------------------------------------------------------------ */

/** Tradition words as prose uses them (capitalised): "Catholics", "the Reformed", "Lutheran", "Protestants". */
const TRADITION_WORD_RE =
  /(?<![\p{L}-])(Roman Catholic(?:s|ism)?|Catholic(?:s|ism)?|(?:Eastern )?Orthodox(?: Church)?|Lutheran(?:s|ism)?|Reformed|Anglican(?:s|ism)?|Episcopalian(?:s)?|Methodist(?:s|m)?|Wesleyan(?:s)?|Arminian(?:s|ism)?|Baptist(?:s)?|Anabaptist(?:s)?|Mennonite(?:s)?|Pentecostal(?:s|ism)?|Presbyterian(?:s|ism)?|Calvinist(?:s)?|Calvinism|Puritan(?:s)?|Protestant(?:s|ism)?|Evangelical(?:s|ism)?)(?![\p{L}-])/gu;

/**
 * The same in Portuguese, Spanish and French pages. Words that are also common adjectives
 * ("ortodoxo", "reformado", "evangélico", "católico" — universal) or names ("João Batista")
 * count only capitalised; the church-only words ("luterano", "anglicane") in any case.
 */
const TRADITION_WORD_RE_ROMANCE =
  /(?<![\p{L}-])((?:Igreja |Iglesia |Église )?Cat[oó]lic(?:[oa]s?|ismo)(?: Romana)?|Catholiques?|Catholicisme|Ortodox[oa]s?|Orthodoxes?|Reformad[oa]s?|Réformée?s?|Evang[eé]lic[oa]s?|Évangéliques?|Protestant(?:e|es|ismo|isme)|[Ll]uteran(?:[oa]s?|ismo)|[Ll]uth[eé]rien(?:ne)?s?|[Aa]nglican[oa]s?|[Aa]nglicai?n(?:e|s|es)?|[Mm]etodistas?|[Mm][eé]thodistes?|[Ww]esleyan[oa]s?|[Aa]rminian[oa]s?|[Aa]rminien(?:ne)?s?|(?<!(?:Jo[aã]o|Juan|Jean|o|el|le)[\s-])(?:batistas?|bautistas?|baptistes?|Batistas|Bautistas|Baptistes)|[Aa]nabatistas?|[Aa]nabaptistes?|[Mm]enonitas?|[Pp]entec[oô]tistes?|[Pp]resbiterian[oa]s?|[Pp]resbyt[eé]rien(?:ne)?s?|[Cc]alvinistas?|[Cc]alvinistes?|[Pp]uritan[oa]s?|[Pp]uritain(?:e)?s?)(?![\p{L}-])/gu;

export function traditionWordsIn(text: string): string[] {
  return [...new Set([...text.matchAll(TRADITION_WORD_RE), ...text.matchAll(TRADITION_WORD_RE_ROMANCE)].map((m) => m[1]))];
}

/** Families mentioned (capitalised) in a curated text: editor-reviewed perspectives list their traditions by name. */
function familiesNamedIn(text: string): string[] {
  const out: string[] = [];
  for (const w of traditionWordsIn(text)) for (const f of familiesOf(w)) if (!out.includes(f)) out.push(f);
  return out;
}

/**
 * The traditions an evidence item is a text OF: its own tradition tag, a confession's
 * title ("… [Reformed]", "Augsburg Confession …"), its author's registry tradition,
 * or — for editor-reviewed curated items — the traditions it names.
 */
export function evidenceFamilies(e: Evidence, providers: ProviderRegistry, opts: { representative?: boolean } = {}): string[] {
  const out = new Set<string>(familiesOf(e.tradition));
  if (!e.tradition) {
    // untagged items: a confession's title says whose it is ("… [Reformed]", "Augsburg Confession …");
    // a tagged item's title is not read ("Belgic Confession, Art. 27 — The Catholic Christian Church" is Reformed)
    const bracket = /\[([^\]]+)\]\s*$/.exec(e.title)?.[1];
    for (const f of familiesOf(bracket)) out.add(f);
    if (e.kind === 'confession') for (const f of familiesOf(e.title)) out.add(f);
  }
  const author = authorOf(e, providers);
  const tradition = author ? safeSync(() => providers.sources.getAuthor(author))?.tradition : undefined;
  // a publisher's notes ("Evangelical (publisher)") are not a tradition's own statement of its view
  if (!(opts.representative && isPublisherTradition(tradition))) for (const f of familiesOf(tradition)) out.add(f);
  if (e.kind === 'curated') for (const f of familiesNamedIn(e.text)) out.add(f);
  return [...out];
}

/** A registry tradition that describes a publisher's house ("Evangelical (publisher)"), not an author or church of that tradition. */
export function isPublisherTradition(tradition: string | undefined | null): boolean {
  return Boolean(tradition && /\(publisher\)/i.test(tradition));
}

const stemCache = new WeakMap<Evidence, Set<string>>();

function haystackStems(v: EvidenceView, providers: ProviderRegistry): Set<string> {
  let set = stemCache.get(v.e);
  if (!set) {
    set = new Set(tokenize(haystack(v, providers)).map(stem));
    stemCache.set(v.e, set);
  }
  return set;
}

const TRADITION_QUALIFIERS = new Set(['roman', 'eastern', 'church']);

// the same disclosure on pt/es/fr pages ("A base não traz texto luterano sobre o divórcio.")
const ABOUT_HOLDINGS_ROMANCE = /(?<![\p{L}])(?:base de (?:conhecimento|conocimiento|connaissances?)|biblioteca|biblioth[eè]que|(?:estas|as|las|ces|les) fontes|(?:estas|las) fuentes|(?:ces|les) sources|nela|nele|en ella|textos? (?:dispon[ií]ve(?:l|is)|disponibles?|aqui|aqu[ií])|textes? (?:disponibles?|ici))(?![\p{L}])/iu;
const ABSENCE_ROMANCE = /(?<![\p{L}])(?:n[aã]o (?:h[aá]|tem|traz|cont[eé]m|inclui|possui)|nenhum[a]?|faltam?|no (?:hay|tiene|trae|contiene|incluye)|ning[uú]n[a]?|carece|(?:n['’]|ne )(?:y a|a|contient|comprend|inclut|contiennent)(?: pas| aucun)|aucun[e]?|manque(?:nt)?|sem (?:textos?|fontes?)|sin (?:textos?|fuentes?)|sans (?:textes?|sources?))(?![\p{L}])/iu;
const CLAIMS_ROMANCE = /(?<![\p{L}])(?:mas|embora|enquanto|ensina(?:m)?|ensinou|afirma(?:m)?|nega(?:m)?|defende(?:m)?|permite(?:m)?|pro[ií]be(?:m)?|pero|aunque|mientras|ense[nñ]a(?:n)?|niega(?:n)?|sostiene(?:n)?|mais|bien que|alors que|tandis que|enseigne(?:nt)?|affirme(?:nt)?|nie(?:nt)?|permet(?:tent)?|interdit|posi[cç][aã]o|posici[oó]n|que ensina|qui enseigne)(?![\p{L}])/iu;

/**
 * A sentence that only says what the knowledge base lacks ("The knowledge base holds no
 * Eastern Orthodox or Pentecostal text on divorce, so those traditions are not
 * represented here."): the disclosure the prompt asks for. It names traditions without
 * saying anything about them, so the tradition check does not apply to it — as long as
 * it makes no other claim (no contrast, no verbs of teaching, short).
 */
export function isAbsenceSentence(sentence: string): boolean {
  const s = sentence.trim();
  if (!s || s.split(/\s+/).length > 40) return false;
  const aboutHoldings = /\b(?:knowledge base|library|(?:these|the) sources|retrieved (?:texts|evidence)|texts? (?:here|available)|evidence (?:here|available))\b/i.test(s) || ABOUT_HOLDINGS_ROMANCE.test(s);
  const absence = /\b(?:holds? no|has no|have no|contains? no|includes? no|lacks?|no (?:[\p{L}-]+ ){0,4}(?:texts?|sources?|confessions?|statements?)|not represented|cannot be represented|could not be represented|nothing (?:from|by|of))\b/iu.test(s) || ABSENCE_ROMANCE.test(s);
  const claims = /\b(?:but|though|although|whereas|while|which|who|teach(?:es|ing)?|taught|holds? that|believe[sd]?|permits?|allows?|forbids?|rejects?|affirms?|denies|deny|insists?|argues?|says?|said|view|position)\b/i.test(s) || CLAIMS_ROMANCE.test(s);
  return aboutHoldings && absence && !claims;
}

/**
 * A sentence that only points to the page's own content ("For divorce, the page's
 * commentary section draws on Calvin, Keil & Delitzsch and Matthew Henry."): in a
 * follow-up answer it may name the authors of voices already on the page, as long as it
 * says nothing about what they teach.
 */
export function isPagePointerSentence(sentence: string): boolean {
  const s = sentence.trim();
  if (!s || s.split(/\s+/).length > 50) return false;
  const aboutPage = /\b(?:th(?:is|e) page|page['’]s|the section|voices?)\b/i.test(s);
  const claims = /\b(?:but|though|although|whereas|while|teach(?:es|ing)?|taught|holds? that|believe[sd]?|permits?|allows?|forbids?|rejects?|affirms?|denies|deny|insists?|argues?|says?|said|writes?|wrote|notes?|explains?|reads?|takes?|sees?|calls?|thinks?|maintains?|view|position|because)\b/i.test(s);
  return aboutPage && !claims;
}

/** Sentences of a text (split after . ! ? ; and at line breaks). */
export function sentencesOf(text: string): string[] {
  return text.split(/(?<=[.!?;])\s+|\n+/).filter((x) => x.trim());
}

/**
 * Conciliar canons of the form "If any one saith, that the Church has erred, in that she
 * hath taught … X …; let him be anathema" condemn the claim that the Church ERRED in
 * teaching X — not a view opposed to X. Prose citing such a canon that says it
 * anathematised or condemned something, without saying the Church "erred" (or quoting
 * the canon), turns the canon's object around. Returns the canon's evidence view.
 */
const INDIRECT_CANON_RE = /\bif any (?:one|man) (?:saith|shall say|says),? that the (?:holy |catholic )?church (?:has|hath) erred\b/i;
const CONDEMNS_RE = /\banathemati[sz](?:e|es|ed|ing)\b|\banathemas?\b|\bcondemn(?:s|ed|ing)?\b/i;
export function invertedCanon(text: string, cited: readonly EvidenceView[]): EvidenceView | null {
  if (!CONDEMNS_RE.test(text) || /\berr(?:ed|s|ing|or|ors)?\b/i.test(text)) return null;
  return cited.find((v) => INDIRECT_CANON_RE.test(v.fullText)) ?? null;
}

function withoutAbsenceSentences(text: string): string {
  return text
    .split(/(?<=[.!?;])\s+/)
    .filter((s) => !isAbsenceSentence(s))
    .join(' ');
}

/** Tradition words in the text that no cited evidence names or represents (sentences that only disclose what the knowledge base lacks are exempt). */
export function unnamedTraditions(text: string, cited: readonly EvidenceView[], providers: ProviderRegistry): string[] {
  const out: string[] = [];
  for (const w of traditionWordsIn(withoutAbsenceSentences(text))) {
    const accepted = new Set(acceptedFamilies(w));
    const stems = tokenize(w)
      .filter((t) => !TRADITION_QUALIFIERS.has(t))
      .map(stem);
    const ok = cited.some((v) => {
      if (evidenceFamilies(v.e, providers).some((f) => accepted.has(f))) return true;
      const have = haystackStems(v, providers);
      return stems.length > 0 && stems.every((s) => have.has(s));
    });
    if (!ok) out.push(w);
  }
  return out;
}

/** Families that represent a label: the families it names, or for an umbrella ("Protestant") also its members. */
export function acceptedFamilies(label: string): string[] {
  const named = familiesOf(label);
  const out = new Set(named);
  for (const id of named) for (const m of TRADITION_FAMILIES.find((f) => f.id === id)?.members ?? []) out.add(m);
  return [...out];
}

/* ------------------------------------------------------------------ */
/* Claim vocabulary                                                    */
/* ------------------------------------------------------------------ */

/**
 * Words that turn a sentence into a claim the evidence must make: an era ("post-exilic",
 * "Second Temple", "first-century"), a scholarly debate ("debated", "interpreters
 * differ"), a generalisation ("normally", "usually"), a reading of Greek tense or aspect
 * ("once for all", "decisive", "the aorist pictures") or a statement about how
 * translations render a word. Each is allowed only when a cited item says so too.
 */
interface ClaimTerm {
  kind: 'era' | 'debate' | 'generalisation' | 'aspect';
  re: RegExp;
  /** what a cited text must contain for the term to be grounded (from the match) */
  needs: (match: string) => RegExp;
}

const ORDINAL_WORDS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
const ORDINAL_NUMS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const ORDINALS = [...ORDINAL_WORDS, ...ORDINAL_NUMS].join('|');

const CLAIM_TERMS: readonly ClaimTerm[] = [
  { kind: 'era', re: /\b(?:post|pre)[- ]?exilic\b|\bexilic\b/i, needs: () => /exil|captivity|return(?:ed)? from babylon|after the return/i },
  { kind: 'era', re: /\binter-?testamental\b/i, needs: () => /inter-?testament|between the (?:old and new )?testaments/i },
  { kind: 'era', re: /\bsecond[- ]temple\b/i, needs: () => /second[- ]temple/i },
  { kind: 'era', re: /\bhellenistic\b/i, needs: () => /hellen/i },
  { kind: 'era', re: /\bmaccabean\b/i, needs: () => /maccab/i },
  { kind: 'era', re: /\bpersian period\b/i, needs: () => /persia/i },
  {
    kind: 'era',
    re: new RegExp(`\\b(?:${ORDINALS})[- ]century\\b`, 'i'),
    needs: (m) => {
      const o = m.replace(/[- ]century$/i, '').toLowerCase();
      const i = ORDINAL_WORDS.indexOf(o) >= 0 ? ORDINAL_WORDS.indexOf(o) : ORDINAL_NUMS.indexOf(o);
      return new RegExp(`\\b(?:${ORDINAL_WORDS[i] ?? o}|${ORDINAL_NUMS[i] ?? o})[- ]century\\b`, 'i');
    },
  },
  {
    kind: 'debate',
    re: /\b(?:debated|much[- ]debated|disputed|contested|controversial|controverted|a matter of debate|in dispute)\b/i,
    needs: () => DEBATE_EVIDENCE,
  },
  {
    kind: 'debate',
    re: /\b(?:scholars|interpreters|commentators|theologians|christians|churches|traditions|exegetes)\s+(?:have\s+|are\s+|often\s+|long\s+|still\s+|also\s+)?(?:differ(?:ed)?|disagree(?:d)?|divide(?:d)?|debate(?:d)?|dispute(?:d)?)\b/i,
    needs: () => DEBATE_EVIDENCE,
  },
  { kind: 'generalisation', re: /\b(?:normally|usually|generally|typically|ordinarily|commonly|most often)\b/i, needs: (m) => new RegExp(`\\b${generalisationStem(m)}`, 'i') },
  { kind: 'aspect', re: /\bonce[- ]for[- ]all\b/i, needs: () => /once[- ]for[- ]all/i },
  { kind: 'aspect', re: /\bdecisive(?:ly)?\b/i, needs: () => /decisiv/i },
  { kind: 'aspect', re: /\bpunctiliar\b/i, needs: () => /punctiliar/i },
  {
    kind: 'aspect',
    re: /\b(?:aorist|present tense|perfect tense|imperfect)\s+(?:tense\s+)?(?:pictures|portrays|shows|signals|indicates|stresses|implies|emphasi[sz]es|denotes|points to)\b/i,
    needs: (m) => new RegExp(m.split(/\s+/)[0], 'i'),
  },
  // the same claims on pt/es/fr pages (the evidence is English, so they need the English words)
  {
    kind: 'debate',
    re: /(?<![\p{L}])(?:debatid[oa]s?|discutid[oa]s?|controvers[oa]s?|controvertid[oa]s?|contestad[oa]s?|d[ée]battue?s?|discut[ée]e?s?|controvers[ée]e?s?|contest[ée]e?s?|(?:int[ée]rpretes|estudiosos|comentaristas|te[óo]logos|tradi[çc][õo]es|igrejas|iglesias|interpr[èe]tes|commentateurs|th[ée]ologiens|[ée]glises) (?:divergem|discordam|divergen|discrepan|divergent|sont divis[ée]s))(?![\p{L}])/iu,
    needs: () => DEBATE_EVIDENCE,
  },
  {
    kind: 'generalisation',
    re: /(?<![\p{L}])(?:normalmente|geralmente|generalmente|usualmente|comumente|com[úu]nmente|habitualmente|normalement|g[ée]n[ée]ralement|habituellement|d['’]ordinaire|em geral|por lo general|en g[ée]n[ée]ral|tipicamente|t[íi]picamente|typiquement)(?![\p{L}])/iu,
    needs: (m) => ROMANCE_GENERALISATION.find(([re]) => re.test(m))?.[1] ?? /\b(?:normal|usual|general|typical|ordinar|common|often)/i,
  },
  { kind: 'aspect', re: /(?<![\p{L}])(?:de uma vez por todas|de una vez por todas|une fois pour toutes)(?![\p{L}])/iu, needs: () => /once[- ]for[- ]all/i },
  { kind: 'aspect', re: /(?<![\p{L}])(?:decisiv[oa]s?|decisivamente|d[ée]cisi(?:f|ve|fs|ves)|d[ée]cisivement)(?![\p{L}])/iu, needs: () => /decisiv/i },
  {
    kind: 'aspect',
    re: /(?<![\p{L}])(?:o aoristo|el aoristo|l['’]aoriste|aoristo|aoriste)\s+(?:indica|mostra|retrata|enfatiza|sublinha|muestra|subraya|se[ñn]ala|indique|montre|souligne|d[ée]peint|marque)(?![\p{L}])/iu,
    needs: () => /aorist/i,
  },
];

const ROMANCE_GENERALISATION: [RegExp, RegExp][] = [
  [/normal/i, /\bnormal/i],
  [/g[ée]n[ée]ral|geral/i, /\bgeneral/i],
  [/usual|habitu/i, /\b(?:usual|habitual)/i],
  [/com[úu]n|comum/i, /\bcommon/i],
  [/ordinaire/i, /\bordinar/i],
  [/t[íi]pic|typiq/i, /\btypical/i],
];

/** A cited text that states a disagreement. */
const DEBATE_EVIDENCE = /debat|disput|contest|controver|differ|disagree|diverg|divided|dissent|no consensus|not agreed|made a case|argue[sd]?\b|case for\b|some (?:hold|think|say|take|understand|interpret|argue|maintain)|others (?:hold|think|say|take|understand|interpret|argue|maintain)|opinions?\b|question(?:ed|able)?\b|uncertain|doubtful/i;

function generalisationStem(m: string): string {
  const w = m.toLowerCase().replace(/^most /, '');
  return (
    {
      normally: 'normal',
      usually: 'usual',
      generally: 'general',
      typically: 'typical',
      ordinarily: 'ordinar',
      commonly: 'common',
      often: 'often',
    } as Record<string, string>
  )[w] ?? w;
}

export interface ClaimProblem {
  kind: ClaimTerm['kind'] | 'rendering';
  term: string;
}

/** Translation claims: "translations render it …", "is rendered …", "translated as …". */
const RENDERING_RE = /\b(?:(?:translations?|versions|english bibles?|older versions|modern versions|the bsb|the kjv|the web)\s+(?:render|renders|translate|translates|have|give|read)|(?:is|are|was|were|often|usually|variously|commonly)\s+(?:rendered|translated)|renders?\s+it|translates?\s+it|rendered\s+as|translated\s+as)\b([^.;:!?—–()]*)/gi;

/** Connective and framing words that may follow a rendering claim without being part of it. */
const RENDERING_FILLER = new Set([
  'as', 'it', 'its', 'word', 'term', 'here', 'there', 'variously', 'either', 'both', 'or', 'and', 'but', 'which', 'while', 'whereas',
  'english', 'versions', 'translations', 'translation', 'version', 'older', 'modern', 'most', 'some', 'other', 'others', 'bsb', 'kjv',
  'web', 'phrase', 'verb', 'noun', 'sense', 'senses', 'usually', 'often', 'sometimes', 'like', 'such', 'instead', 'rather', 'than',
  'literally', 'lit', 'not', 'no', 'one', 'two', 'three', 'reading', 'readings', 'wording', 'words', 'context', 'verse', 'passage',
  'contexts', 'uses', 'use', 'used', 'places', 'elsewhere', 'where', 'while',
]);

/**
 * Claim vocabulary in `text` that none of the grounding texts supports. `cited` are the
 * item's cited evidence; `groundTexts` adds Scripture read in this request (for how a
 * translation renders a verse); `citedFamilies` counts the traditions the cited texts
 * represent (two different traditions cited side by side show that they differ).
 */
export function ungroundedClaims(text: string, cited: readonly EvidenceView[], providers: ProviderRegistry, groundTexts: readonly string[] = []): ClaimProblem[] {
  const hay = cited.map((v) => haystack(v, providers)).join('\n');
  const out: ClaimProblem[] = [];
  const families = new Set(cited.flatMap((v) => evidenceFamilies(v.e, providers)));
  for (const t of CLAIM_TERMS) {
    const m = t.re.exec(text);
    if (!m) continue;
    if (t.needs(m[0]).test(hay)) continue;
    if (t.kind === 'debate' && families.size >= 2) continue;
    out.push({ kind: t.kind, term: m[0] });
  }
  // renderings: each content word of the rendering list must be in the cited evidence or the Scripture read
  const renderHay = `${hay}\n${groundTexts.join('\n')}`.toLowerCase();
  for (const m of text.matchAll(RENDERING_RE)) {
    // the list of renderings ends where a new clause begins ("…, and Tyndale’s note weighs…")
    const list = (m[1] ?? '').split(/,\s*(?:and|but|while|which|whereas|though|so|yet|with|where|when|as|in|for|to|from|by|because)\b|\s(?:and|but)\s+(?=\p{Lu})/u)[0];
    const words = (list.match(/[\p{L}’'-]+/gu) ?? [])
      .map((w) => w.toLowerCase().replace(/[’']s$/, '').replace(/^[’'-]+|[’'-]+$/g, ''))
      .filter((w) => w.length > 2 && !RENDERING_FILLER.has(w) && !STOPWORDS.has(w) && /^[a-z-]+$/.test(w));
    const missing = words.filter((w) => !new RegExp(`(?<![a-z])${stem(w).replace(/-/g, '\\-')}`).test(renderHay));
    if (missing.length) out.push({ kind: 'rendering', term: missing.join(', ') });
  }
  return out;
}
