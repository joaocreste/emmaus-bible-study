/**
 * Emmaus domain model.
 *
 * These types are the contract shared by the providers (data), the study engine
 * (logic) and the UI (presentation). They are deliberately framework-free so the
 * same model can later back a hosted API, an iOS/iPadOS client, or sync.
 *
 * Core principle — source grounding:
 *   claim → provenance(kind, verification) → citation(source, locator, url) → source → author/work
 * Every piece of study content carries a `Provenance` so the UI can say plainly
 * whether it is Scripture, lexical data, a verified quotation, a summary of a
 * named work, or synthesis written for the app.
 */

/* ------------------------------------------------------------------ */
/* Canon & references                                                  */
/* ------------------------------------------------------------------ */

/** USFM-style three-character book code, e.g. "GEN", "PSA", "JHN", "ROM", "1CO". */
export type BookId = string;

export type Testament = 'OT' | 'NT';

export interface VerseRef {
  book: BookId;
  chapter: number;
  verse: number;
}

/**
 * A contiguous range of Scripture. `startVerse`/`endVerse` omitted means whole
 * chapter(s). `endChapter` omitted means the range stays in `startChapter`.
 * A whole book is expressed as startChapter 1 → endChapter = last chapter.
 */
export interface PassageRef {
  book: BookId;
  startChapter: number;
  startVerse?: number;
  endChapter?: number;
  endVerse?: number;
}

/** Bible version ids; see src/domain/translations.ts for the registry (language, license, source). */
export type TranslationId =
  | 'BSB'
  | 'KJV'
  | 'WEB'
  | 'BLIVRE'
  | 'NBV'
  | 'BPM'
  | 'RVR1909'
  | 'BLM'
  | 'VBL'
  | 'LSG'
  | 'DARBY'
  | 'NCL'
  | 'OST';

/* ------------------------------------------------------------------ */
/* Provenance                                                          */
/* ------------------------------------------------------------------ */

/**
 * What kind of content a block is. The UI maps each kind to a consistent,
 * quiet label + typographic treatment (see docs/DESIGN.md).
 */
export type ContentKind =
  | 'scripture' // biblical text from a named translation
  | 'original-text' // Hebrew/Aramaic/Greek text from a tagged edition
  | 'lexical' // lexicon / grammatical data
  | 'historical' // historical, cultural, geographic information
  | 'literary' // literary-structural observation
  | 'commentary' // content of a named commentary (usually via quotation/summary)
  | 'quotation' // exact words of a named source, verified
  | 'summary' // paraphrase/summary of a specific named work
  | 'synthesis' // written for Emmaus (AI-assisted) from the cited sources
  | 'dataset'; // machine-derived from an open dataset (e.g. community-voted cross-references)

/**
 * How much trust the UI may express.
 * - verified: checked against the cited primary source (required for any quotation)
 * - source-derived: mechanically taken from a cited dataset/edition
 * - editorial: synthesis/summary written for the app; grounded in citations but not a quotation
 * - generated: composed live by the inference layer from the cited evidence; validated
 *   mechanically (citations resolve, references exist, quotations match) but not reviewed by an editor
 * - unverified: placeholder metadata; must be visibly flagged and never shown in quotation marks
 */
export type Verification = 'verified' | 'source-derived' | 'editorial' | 'generated' | 'unverified';

export interface Citation {
  /** id in the SourceRegistry */
  sourceId: string;
  /** chapter/section/page/paragraph/sermon number, e.g. "ch. 19", "Tractate 1 §13", "on Rom 8:1" */
  locator?: string;
  /** deep link when one exists (overrides the source's base URL) */
  url?: string;
  note?: string;
  /** the retrieved text this claim rests on (generated studies show it on hover / in the Inspector) */
  excerpt?: string;
}

export interface Provenance {
  kind: ContentKind;
  verification: Verification;
  citations: Citation[];
}

/** A piece of prose that carries its provenance. */
export interface ProvenancedText {
  text: string;
  provenance: Provenance;
}

/* ------------------------------------------------------------------ */
/* Sources, licensing & people                                         */
/* ------------------------------------------------------------------ */

export type SourceType =
  | 'bible-translation'
  | 'original-text'
  | 'lexicon'
  | 'dataset'
  | 'commentary'
  | 'study-notes'
  | 'book'
  | 'sermon'
  | 'article'
  | 'lecture'
  | 'creed'
  | 'confession'
  | 'catechism'
  | 'dictionary'
  | 'encyclopedia'
  | 'website';

export type LicenseStatus = 'public-domain' | 'open-license' | 'copyrighted';

/**
 * How much of a work the app may reproduce. Drives UI + integrity tests:
 * - full-text: public domain / open license — may display text
 * - excerpt: short, attributed quotation only (fair use / permission)
 * - summary-only: copyrighted — summarise + link, never reproduce wording
 * - metadata-only: cite and link only
 */
export type UsagePolicy = 'full-text' | 'excerpt' | 'summary-only' | 'metadata-only';

export interface License {
  status: LicenseStatus;
  /** e.g. "Public domain", "CC BY 4.0", "CC BY-SA 4.0", "© 2012 Timothy Keller" */
  name: string;
  url?: string;
  usage: UsagePolicy;
  /** attribution line required by the license, if any */
  attribution?: string;
}

export type Era =
  | 'ancient' // non-Christian ancient writers cited for background (Philo, Josephus, Suetonius…)
  | 'early-church' // to c. 600
  | 'medieval' // c. 600–1500
  | 'reformation' // c. 1500–1650
  | 'post-reformation' // c. 1650–1800
  | 'modern' // c. 1800–1950
  | 'contemporary'; // c. 1950–

export interface Author {
  id: string;
  name: string;
  /** name for compact citations when the default rule would be wrong ("Augustine", "Irenaeus") */
  shortName?: string;
  /** e.g. "354–430", "b. 1946", "c. 347–407" */
  lifespan?: string;
  era: Era;
  /** e.g. "Anglican", "Reformed (Presbyterian)", "Catholic", "Methodist", "Latin Church Father" */
  tradition: string;
  /** one or two sentences, factual */
  description: string;
  /** aliases the engine may match in chat, lowercase ("keller", "tim keller") */
  aliases?: string[];
  url?: string;
}

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  authorIds: string[];
  /** display year or range: "1552", "2012", "1706–1714" */
  year?: string;
  publisher?: string;
  /** canonical landing page / reading link */
  url?: string;
  license: License;
  /** one sentence: what this source is and why it is trustworthy/relevant */
  description?: string;
  /** e.g. translator/edition for historical works: "trans. John Owen (1849)" */
  edition?: string;
}

/* ------------------------------------------------------------------ */
/* Scripture                                                           */
/* ------------------------------------------------------------------ */

export interface Verse {
  ref: VerseRef;
  text: string;
  /** section heading that precedes this verse in the translation, if any */
  heading?: string;
  /** starts a new paragraph (prose) */
  paragraphStart?: boolean;
  /** poetry: the verse is broken into lines */
  poetryLines?: string[];
  /** indent level per poetry line (0 = prose part of a mixed verse, 1 = flush, 2 = indented) */
  poetryIndents?: number[];
  footnotes?: string[];
}

export interface PassageChapter {
  chapter: number;
  verses: Verse[];
  /** psalm title / superscription, e.g. "A Psalm of David." (not part of verse 1 in English Bibles) */
  superscription?: string;
}

export interface Passage {
  ref: PassageRef;
  /** human label, e.g. "Romans 8:1–4" */
  label: string;
  translation: TranslationId;
  chapters: PassageChapter[];
  /** SourceRegistry id of the translation */
  sourceId: string;
}

export interface TranslationInfo {
  id: TranslationId;
  /** interface/study language this version belongs to */
  language?: 'en' | 'pt' | 'fr' | 'es';
  name: string;
  shortName: string;
  sourceId: string;
  year?: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Original languages                                                  */
/* ------------------------------------------------------------------ */

export type OriginalLanguage = 'greek' | 'hebrew' | 'aramaic';

/** One word of the original-language text (from a tagged edition, e.g. STEPBible TAGNT/TAHOT). */
export interface OriginalWord {
  /** position within the verse, 0-based */
  index: number;
  /** word as it appears in the text (with accents/vowel points) */
  surface: string;
  transliteration?: string;
  /** classic Strong's number, normalised: "G2631", "H7462" */
  strong: string;
  /** STEPBible extended Strong's tag disambiguating senses, e.g. "H7462B" */
  extendedStrong?: string;
  /** morphology code from the source edition, e.g. "N-NSN" */
  morph?: string;
  /** human-readable parsing, e.g. "Noun, nominative singular neuter" */
  morphDescription?: string;
  /** contextual English gloss */
  gloss: string;
  language: OriginalLanguage;
}

export interface OriginalVerse {
  ref: VerseRef;
  language: OriginalLanguage;
  words: OriginalWord[];
  sourceId: string;
}

export interface LexiconEntry {
  strong: string;
  extendedStrong?: string;
  language: OriginalLanguage;
  lemma: string;
  transliteration: string;
  pronunciation?: string;
  /** short gloss, e.g. "condemnation" */
  gloss: string;
  /** fuller definition as given by the lexicon source */
  definition: string;
  partOfSpeech?: string;
  sourceId: string;
}

export interface Occurrences {
  strong: string;
  /** number of VERSES containing the lemma */
  total: number;
  /** number of word occurrences (a verse may contain the lemma more than once) */
  wordCount?: number;
  /** all (or first N) occurrences in canonical order */
  refs: VerseRef[];
  sourceId: string;
}

/**
 * A curated "key word" for a study: the bridge between the English passage,
 * the original-language lexeme, and the study's argument.
 */
export interface KeyWord {
  id: string;
  strong: string;
  language: OriginalLanguage;
  /** dictionary form in original script, e.g. "κατάκριμα", "רָעָה" */
  lemma: string;
  transliteration: string;
  /** e.g. "kat-AK-ree-mah" */
  pronunciation?: string;
  /** the English word/phrase readers see, e.g. "condemnation" */
  english: string;
  /** where to underline it in the passage, per translation (phrase must occur verbatim in that verse) */
  anchors: WordAnchor[];
  /** e.g. "Noun, nominative singular neuter" — for the form in the key verse */
  grammar?: string;
  /** short gloss (should agree with the lexicon source) */
  basicMeaning: string;
  /** senses attested across usage, most relevant first */
  semanticRange: string[];
  /** notable other biblical occurrences with a short note each */
  notableOccurrences: { ref: PassageRef; note: string }[];
  /** why the word matters in THIS passage — synthesis, context first */
  significance: ProvenancedText;
  /** optional caution against over-reading a word study */
  caution?: string;
  provenance: Provenance;
}

export interface WordAnchor {
  verse: VerseRef;
  /** exact phrase in each translation's verse text (case-insensitive match); omit a translation if absent */
  phrases: Partial<Record<TranslationId, string>>;
}

/* ------------------------------------------------------------------ */
/* Cross-references                                                    */
/* ------------------------------------------------------------------ */

export type RelationshipType =
  | 'parallel'
  | 'prophecy-fulfillment'
  | 'thematic'
  | 'quotation'
  | 'allusion'
  | 'same-concept'
  | 'contrast'
  | 'historical';

/** Curated, explained cross-reference. */
export interface CrossReference {
  id: string;
  /** verse(s) of the primary passage this connects from */
  from: PassageRef;
  /** the connected passage */
  target: PassageRef;
  relationship: RelationshipType;
  /** short headline, e.g. "Adoption as sons" */
  title: string;
  /** why the passage is relevant and how it relates — the heart of the card */
  explanation: ProvenancedText;
  /** concept tags used by the engine to prioritise ("flesh", "adoption", "suffering") */
  tags: string[];
}

/** Uncurated reference from an open dataset (e.g. OpenBible.info votes). */
export interface DatasetCrossReference {
  from: VerseRef;
  target: PassageRef;
  /** dataset relevance score (e.g. vote count) */
  score: number;
  sourceId: string;
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

export type ContextCategory =
  | 'historical-period'
  | 'geography'
  | 'political'
  | 'social'
  | 'economic'
  | 'religious'
  | 'jewish-tradition'
  | 'greco-roman'
  | 'ancient-near-east'
  | 'customs'
  | 'audience'
  | 'authorship'
  | 'genre'
  | 'occasion';

export interface ContextItem {
  id: string;
  category: ContextCategory;
  title: string;
  /** 1–3 sentences shown collapsed */
  summary: string;
  /** optional longer explanation shown expanded */
  detail?: string;
  relatedVerses?: VerseRef[];
  tags: string[];
  provenance: Provenance;
}

export interface BookIntroduction {
  book: BookId;
  title?: string;
  /** short "Purpose / Author / Date / Setting" digest when the source provides one */
  summary?: string;
  /** plain text with paragraph breaks ("\n\n") */
  text: string;
  sourceId: string;
}

/* ------------------------------------------------------------------ */
/* Literary context                                                    */
/* ------------------------------------------------------------------ */

export type LiteraryFeatureType =
  | 'repetition'
  | 'parallelism'
  | 'chiasm'
  | 'inclusio'
  | 'metaphor'
  | 'imagery'
  | 'poetry'
  | 'narrative-structure'
  | 'argument-structure'
  | 'transition'
  | 'allusion';

export interface LiteraryFeature {
  id: string;
  type: LiteraryFeatureType;
  title: string;
  description: string;
  verses?: VerseRef[];
  /** optional structure lines (for chiasm/outline diagrams): level 0 = outermost */
  structure?: { label: string; text: string; ref?: PassageRef; level: number }[];
  tags: string[];
  provenance: Provenance;
}

export interface OutlineSegment {
  label: string;
  ref: PassageRef;
  /** true for the segment that contains the study passage */
  current?: boolean;
}

export interface LiteraryContext {
  /** where the passage sits in the book's flow */
  placeInBook: ProvenancedText;
  /** how the passage flows internally / the author's argument */
  argument?: ProvenancedText;
  /** where it sits in the broader biblical story */
  placeInCanon?: ProvenancedText;
  /** book outline with the current segment marked */
  bookOutline: OutlineSegment[];
  /** internal outline of the passage */
  passageOutline?: OutlineSegment[];
  features: LiteraryFeature[];
}

/* ------------------------------------------------------------------ */
/* Theology & perspectives                                             */
/* ------------------------------------------------------------------ */

export type TheologyCategory =
  | 'theology-proper'
  | 'trinity'
  | 'christology'
  | 'soteriology'
  | 'pneumatology'
  | 'ecclesiology'
  | 'eschatology'
  | 'covenant'
  | 'creation'
  | 'anthropology'
  | 'hamartiology'
  | 'grace'
  | 'sanctification'
  | 'adoption'
  | 'providence'
  | 'revelation'
  | 'ethics'
  | 'worship';

export interface TheologyTheme {
  id: string;
  category: TheologyCategory;
  title: string;
  summary: string;
  detail?: string;
  keyVerses: PassageRef[];
  tags: string[];
  provenance: Provenance;
}

/**
 * - consensus: broad historic Christian agreement (e.g. Nicene Christology)
 * - denominational: live difference between traditions
 * - historical-debate: a debate with a notable history (may be largely settled)
 * - uncertain: exegetical question where careful interpreters are unsure
 */
export type ConsensusLevel = 'consensus' | 'denominational' | 'historical-debate' | 'uncertain';

export interface TheologicalPerspective {
  id: string;
  /** e.g. "Reformed", "Arminian / Wesleyan", "Catholic", "Lutheran", "Eastern Orthodox" */
  tradition: string;
  /** one-line position label */
  label: string;
  summary: string;
  /** author ids of representative voices */
  representatives?: string[];
  keyTexts?: PassageRef[];
  provenance: Provenance;
}

export interface PerspectiveSet {
  id: string;
  /** the question on which Christians differ */
  question: string;
  consensus: ConsensusLevel;
  intro: string;
  perspectives: TheologicalPerspective[];
  /** what all perspectives affirm */
  commonGround?: string;
  tags: string[];
  provenance: Provenance;
}

/* ------------------------------------------------------------------ */
/* Commentary & sermons                                                */
/* ------------------------------------------------------------------ */

/**
 * A voice from the Christian tradition on the passage/topic.
 * kind 'quotation' → exact words, MUST be verification 'verified', source usage
 *   must allow it (full-text or excerpt), and must carry a locator.
 * kind 'summary' → paraphrase of a specific named work; never rendered in quotation marks.
 */
export interface CommentaryEntry {
  id: string;
  authorId: string;
  sourceId: string;
  kind: 'quotation' | 'summary';
  text: string;
  /**
   * Localized editions only: a free translation of a verified quotation, shown beneath the
   * original words and labelled as an unverified translation (the quotation itself stays verbatim).
   */
  translatedText?: string;
  /** optional one-line framing shown above the text, e.g. "On the 'no condemnation' of 8:1" */
  lead?: string;
  locator?: string;
  url?: string;
  relatedVerses?: VerseRef[];
  tags: string[];
  provenance: Provenance;
}

/** A public-domain commentary / study note section returned by a CommentaryProvider. */
export interface CommentarySection {
  commentaryId: string;
  /** passage the section comments on */
  ref: PassageRef;
  text: string;
  sourceId: string;
}

export interface CommentaryInfo {
  id: string;
  name: string;
  sourceId: string;
  /** 'notes' for concise study notes (Tyndale), 'classic' for historic commentaries */
  style: 'notes' | 'classic';
  testaments: Testament[];
}

export interface SermonRecord {
  id: string;
  authorId: string;
  title: string;
  date?: string;
  /** e.g. "Metropolitan Tabernacle Pulpit, vol. 12, no. 693" */
  series?: string;
  refs: PassageRef[];
  topics: string[];
  url?: string;
  sourceId: string;
  summary?: ProvenancedText;
}

/* ------------------------------------------------------------------ */
/* Verse notes & concepts (engine retrieval index)                     */
/* ------------------------------------------------------------------ */

export interface VerseNote {
  verse: VerseRef;
  /** chat-ready explanation (2–5 sentences) */
  explanation: ProvenancedText;
  tags: string[];
}

/**
 * A concept is the unit the local engine retrieves on. When the user asks about
 * a concept, the engine answers with `answer` and focuses/highlights every linked
 * item across the dashboard. In the future this becomes an embedding/RAG index.
 */
export interface Concept {
  id: string;
  label: string;
  /** lowercase match terms, incl. English, transliteration, original script */
  aliases: string[];
  /** 2–4 sentence chat answer (synthesis with citations) */
  answer: ProvenancedText;
  primarySection: SectionId;
  verses: VerseRef[];
  keyWordIds: string[];
  crossReferenceIds: string[];
  contextIds: string[];
  themeIds: string[];
  perspectiveSetIds: string[];
  commentaryIds: string[];
  literaryFeatureIds?: string[];
}

/* ------------------------------------------------------------------ */
/* Topic studies                                                       */
/* ------------------------------------------------------------------ */

export interface TopicPassage {
  id: string;
  ref: PassageRef;
  title: string;
  /** how this passage contributes to the topic */
  note: ProvenancedText;
  /** grouping label, e.g. "Grace in the Old Testament" */
  group: string;
  tags: string[];
}

export interface TopicDefinition {
  name: string;
  /** e.g. "What does the Bible say about grace?" */
  question?: string;
  definition: ProvenancedText;
  keyPassages: TopicPassage[];
}

/**
 * Entry of the curated topical index (src/data/curated/topics). Lighter than a
 * full curated study: an orientation, key passages, and — only where Christians
 * genuinely differ — perspectives. `studyId` links to a deep curated study.
 */
export interface CuratedTopic {
  id: string;
  name: string;
  /** lowercase phrases that select this topic ("anxiety", "worry", "fear", "be anxious") */
  aliases: string[];
  topic: TopicDefinition;
  /** passage shown in the Scripture section when the topic opens */
  anchor?: PassageRef;
  perspectives?: PerspectiveSet[];
  suggestedQuestions?: string[];
  /** id of a deep curated study for this topic, if any */
  studyId?: string;
  sources?: Source[];
  authors?: Author[];
}

/* ------------------------------------------------------------------ */
/* Study                                                               */
/* ------------------------------------------------------------------ */

export type SectionId =
  | 'overview'
  | 'scripture'
  | 'key-passages'
  | 'cross-references'
  | 'original-languages'
  | 'historical-context'
  | 'literary-context'
  | 'theology'
  | 'commentary'
  | 'sources';

export type StudyKind = 'passage' | 'topic';

/**
 * - curated: hand-built, editorially reviewed study layers
 * - library: assembled automatically from the open datasets for any passage/topic (no synthesis)
 * - generated: composed live by the inference layer from the knowledge base for the reader's question
 */
export type StudyDepth = 'curated' | 'library' | 'generated';

/** Page composition chosen by the inference layer: section order, headings and short intros. */
export interface StudyLayout {
  sections: { id: SectionId; title?: string; intro?: string }[];
}

/** How a generated study was produced (shown in the header and Sources). */
export interface GenerationInfo {
  model: string;
  /** the reader's input the page answers */
  query: string;
  createdAt: number;
  /** evidence items retrieved from the knowledge base */
  evidenceCount: number;
  /** tool calls made against the knowledge base */
  retrievalCalls: number;
  /** served from the page cache instead of generated now */
  cached?: boolean;
  /** items the validator removed (uncited claims, bad references, unverifiable quotations) */
  rejectedItems?: number;
}

export interface Study {
  id: string;
  kind: StudyKind;
  depth: StudyDepth;
  title: string;
  subtitle?: string;
  /** primary passage (passage studies; optional anchor passage for topic studies) */
  passage?: PassageRef;
  topic?: TopicDefinition;
  summary?: ProvenancedText;
  keyWords: KeyWord[];
  crossReferences: CrossReference[];
  context: ContextItem[];
  literary?: LiteraryContext;
  theology: TheologyTheme[];
  perspectives: PerspectiveSet[];
  commentary: CommentaryEntry[];
  sermons: SermonRecord[];
  verseNotes: VerseNote[];
  concepts: Concept[];
  /** follow-up prompts offered in chat */
  suggestedQuestions: string[];
  /** assistant's opening chat message when the study opens (synthesis) */
  opening?: ProvenancedText;
  /** ids of every source cited anywhere in the study (computed or curated) */
  sourceIds: string[];
  /** generated studies: section order / headings chosen for this reader's question */
  layout?: StudyLayout;
  /** language of the study's prose; `translatedFrom` marks curated content translated from English */
  localization?: { locale: 'en' | 'pt' | 'fr' | 'es'; translatedFrom?: 'en' };
  generation?: GenerationInfo;
}

/**
 * What curated study modules export. Identical to Study but also declares the
 * study-specific sources/authors it introduces and how queries match it.
 */
export interface CuratedStudy extends Omit<Study, 'depth' | 'sourceIds'> {
  match: {
    /** passages that should open this study (a query inside any of them matches) */
    references: PassageRef[];
    /** topic phrases, lowercase ("grace", "unmerited favor") */
    topics: string[];
  };
  sources: Source[];
  authors: Author[];
}

/* ------------------------------------------------------------------ */
/* Conversation                                                        */
/* ------------------------------------------------------------------ */

export type ChatRole = 'user' | 'assistant' | 'system';

/**
 * Inline tokens allowed inside chat paragraph text (rendered as interactive chips):
 *   {{ref:ROM.8.1}} or {{ref:ROM.8.1-4}} or {{ref:ROM.8}}   → Scripture reference chip
 *   {{word:<keyWordId>}}                                   → key word chip (opens word)
 *   {{section:<SectionId>}}                                → jump to a dashboard section
 *   {{source:<sourceId>}}                                  → source chip
 *   **bold** and *italic*
 */
export type MessageBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'scripture'; ref: PassageRef; text: string; translation: TranslationId }
  | { type: 'quote'; commentaryId: string }
  | { type: 'note'; tone: 'info' | 'caution'; text: string }
  | { type: 'list'; items: string[] };

/** Visible record of what the dashboard did in response to a message. */
export interface DashboardUpdate {
  section: SectionId;
  /** e.g. "Highlighted “condemnation” in 8:1" */
  label: string;
}

/** One step of the (simulated) retrieval pipeline, shown in "How this was assembled". */
export interface PipelineStep {
  /** e.g. "Intent", "Scripture", "Lexicon", "Cross-references", "Commentary", "Synthesis" */
  stage: string;
  detail: string;
  /** provider id that served it, e.g. "local:bsb", "curated:romans-8" */
  provider?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** user text, or plain-text fallback for assistant */
  text: string;
  blocks?: MessageBlock[];
  citations?: Citation[];
  updates?: DashboardUpdate[];
  suggestions?: string[];
  trace?: PipelineStep[];
  /** provenance of the assistant reply as a whole */
  provenance?: Provenance;
  /** study this message belongs to (a new study inserts a divider in chat) */
  studyId?: string;
  /** the engine declined to answer because no grounded source exists (nothing was invented) */
  declined?: boolean;
  createdAt: number;
}

/* ------------------------------------------------------------------ */
/* Dashboard focus (engine → UI directive)                             */
/* ------------------------------------------------------------------ */

export interface CrossReferenceFilter {
  relationships?: RelationshipType[];
  /** traditional author of the target book, e.g. "Paul", "John" */
  author?: string;
  book?: BookId;
  tags?: string[];
}

/**
 * The engine's instruction to the dashboard. The UI applies it by scrolling to
 * `section`, opening/expanding the listed items, highlighting words/verses and
 * applying filters — then briefly marks what changed.
 */
export interface DashboardFocus {
  section?: SectionId;
  /** key word ids to underline strongly in the passage + open in Original Languages */
  highlightWordIds?: string[];
  highlightVerses?: VerseRef[];
  /** ids of any items (cross-refs, context, themes, perspectives, commentary) to expand */
  expandIds?: string[];
  /** ids to float to the top of their section ("prioritised for your question") */
  pinIds?: string[];
  crossReferenceFilter?: CrossReferenceFilter;
  commentaryAuthorIds?: string[];
  /** short banner explaining why the dashboard changed */
  reason?: string;
}

export interface ConversationState {
  /** concept the user is currently discussing ("this" resolution) */
  activeConceptId?: string;
  /** last verse explicitly discussed */
  activeVerse?: VerseRef;
  /** last word discussed */
  activeWordId?: string;
}
