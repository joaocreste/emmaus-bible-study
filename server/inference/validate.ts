/**
 * VALIDATOR + HYDRATOR — the runtime version of the content guidelines
 * (docs/INFERENCE.md §4). Everything the model composes passes through here before it
 * reaches the page:
 *
 *  1. every item cites ≥ 1 evidence id from this request's ledger (and one the model
 *     was actually shown);
 *  2. every reference parses and exists (BSB chapter/verse counts), and every
 *     reference an item lists or its prose mentions is given by its cited evidence
 *     (or lies in the page passage);
 *  3. key words: the Strong's number was retrieved; lemma, transliteration, gloss,
 *     grammar and counts come from the lexicon/tagged text, never from the model;
 *     an anchor phrase must occur verbatim in that verse's BSB text AND translate the
 *     word (it shares a word with the tagged gloss or the lexicon entry);
 *  4. quotations are exact spans of quotable evidence (6–60 words); any quoted run of
 *     4+ words inside prose (“…”, "…", ‘…’, '…', «…») must be an exact span of the
 *     cited evidence or of the Scripture read in this request;
 *  5. perspectives: each position cites a text OF its tradition (a confession or
 *     reference work tagged with it, or an author the registry places in it);
 *  6. cross-references start inside the page passage;
 *  7. no URLs (any form), and no names, works, traditions or dates in prose that the
 *     cited evidence does not contain — they come from the evidence.
 *
 * An item that fails is dropped and reported back to the model with the reason.
 */
import type {
  Citation,
  CommentaryEntry,
  Concept,
  ContextItem,
  CrossReference,
  KeyWord,
  LexiconEntry,
  LiteraryContext,
  LiteraryFeature,
  Occurrences,
  OriginalWord,
  PassageRef,
  PerspectiveSet,
  Provenance,
  ProvenancedText,
  SectionId,
  StudyKind,
  TheologicalPerspective,
  TheologyTheme,
  TopicPassage,
  TranslationId,
  VerseRef,
} from '../../src/domain/models';
import { findBook, tryGetBook } from '../../src/domain/books';
import { findReferences, formatRef, parseRefKey, refContains, refKey, refsOverlap, verseToPassage } from '../../src/domain/reference';
import { displayGloss, lexiconSenses } from '../../src/engine/lexicon';
import { fold, STOPWORDS, stem, tokenize } from '../../src/engine/text';
import type { Locale } from '../../src/i18n/locales';
import { BIBLE_VERSIONS } from '../../src/domain/translations';
import type { Evidence, EvidenceKind } from '../../src/inference/protocol';
import { normalizeStrong } from '../../src/providers/local/strong';
import type { ProviderRegistry } from '../../src/providers/types';
import { familiesOf, requiredFamilies, traditionFamily } from '../kb/traditions';
import type { KbHoldings } from '../kb/types';
import {
  BeginPageInput,
  CitedText,
  ConceptInput,
  ContextItemInput,
  CrossRefItem,
  FeatureInput,
  FinishPageInput,
  KeyPassageItem,
  KeyWordItem,
  PerspectiveInput,
  PositionInput,
  ReplyInput,
  ThemeInput,
  VoiceInput,
  zodIssues,
  type AddSectionInput,
} from './composeTools';
import {
  authorOf,
  evidenceFamilies,
  haystack,
  invertedCanon,
  isAbsenceSentence,
  isPublisherTradition,
  isPagePointerSentence,
  namesIn,
  sentencesOf,
  ungroundedClaims,
  traditionWordsIn,
  ungroundedYears,
  unnamedNames,
  unnamedTraditions,
  yearsIn,
  type ClaimProblem,
  type EvidenceView,
} from './grounding';
import { ungroundedProperNouns } from './properNouns';
import { normalizeEvidenceId, type EvidenceLedger } from './ledger';
import { evidenceGivesRef, evidenceMentionsRef, evidenceRefs, nearestEvidenceRefs, refToVerses, singleVerse, type RefChecker } from './refs';
import { bestExcerpt, containsNormalized, containsUrl, findExactSpan, quotedSegments, wordCount } from './text';
import type { z } from 'zod';

export { authorOf } from './grounding';

/* ------------------------------------------------------------------ */
/* Results                                                             */
/* ------------------------------------------------------------------ */

export interface Rejection {
  /** which item, e.g. 'key-passages item 3 (“Ezra 10:3”)' */
  item: string;
  reason: string;
}

export type SectionPayload =
  | { section: 'key-passages'; items: TopicPassage[] }
  | { section: 'cross-references'; items: CrossReference[] }
  | { section: 'original-languages'; items: KeyWord[] }
  | { section: 'historical-context'; items: ContextItem[] }
  | { section: 'literary-context'; literary: LiteraryContext }
  | { section: 'theology'; themes: TheologyTheme[]; perspectives: PerspectiveSet[] }
  | { section: 'commentary'; items: CommentaryEntry[] };

export interface Decision {
  accepted: number;
  rejected: Rejection[];
  warnings: string[];
  /** facts to tell the model about accepted items (e.g. the hydrated lemma) */
  notes: string[];
}

export interface SectionResult extends Decision {
  /** null when nothing in the call passed */
  payload: SectionPayload | null;
}

export interface BeginResult extends Decision {
  page: {
    title: string;
    subtitle?: string;
    kind: StudyKind;
    passage?: PassageRef;
    question?: string;
    summary: ProvenancedText;
  } | null;
}

export interface FinishResult extends Decision {
  opening: ProvenancedText | null;
  concepts: Concept[];
  suggestedQuestions: string[];
}

export interface ReplyResult extends Decision {
  reply: {
    text: string;
    citations: Citation[];
    evidenceIds: string[];
    provenance: Provenance;
    focus?: { section: SectionId; verses: VerseRef[] };
    suggestions: string[];
    declined: boolean;
  } | null;
}

/** What the validator needs to know about the page being composed. */
export interface PageInfo {
  kind: StudyKind;
  passage?: PassageRef;
  /** sections already on the page */
  sections: ReadonlySet<SectionId>;
  keyWords: readonly KeyWord[];
  /** authors of the commentary voices on the page */
  voiceAuthors?: ReadonlySet<string>;
}

export interface ValidatorDeps {
  ledger: EvidenceLedger;
  refs: RefChecker;
  providers: ProviderRegistry;
  /** what the knowledge base holds (tradition texts), for repair hints */
  holdings?: KbHoldings;
  /** the reader's own words for this request (names the reader used are not recalled from memory) */
  readerText?: string;
  /** the reader's version: Scripture quoted in prose may be in its words too */
  translation?: TranslationId;
  /** the page language; the English-wording checks (KJV/WEB echo) run on English pages only */
  locale?: Locale;
}

/** Context for prose checks. */
export interface ProseContext {
  page?: PageInfo;
  /** the reader's own words (a declined answer may echo names the reader used) */
  readerText?: string;
  /** a follow-up answer: authors of the voices on the page, which a sentence pointing to the page may name */
  pageAuthors?: ReadonlySet<string>;
}

/* ------------------------------------------------------------------ */
/* Limits (hard caps; the prompt asks for about half of these)         */
/* ------------------------------------------------------------------ */

const MAX_WORDS = {
  title: 16,
  subtitle: 24,
  question: 40,
  intro: 70,
  summary: 150,
  note: 100,
  group: 12,
  explanation: 110,
  significance: 130,
  caution: 60,
  contextSummary: 110,
  detail: 250,
  themeSummary: 110,
  positionSummary: 130,
  voice: 130,
  quote: 60,
  lead: 25,
  opening: 170,
  answer: 130,
  reply: 300,
  sense: 16,
  label: 20,
  /** section headings and intros are uncited framing text */
  sectionTitle: 10,
  sectionIntro: 40,
  /** a declined answer without evidence only says what is missing */
  decline: 60,
} as const;

/** Verses kept of a listed range (related verses, concept verses, focus): the whole range, up to this many (the UI compresses them back into ranges). */
const MAX_RANGE_VERSES = 40;

/** A quotation shown as a commentary voice must be at least a phrase. */
const MIN_QUOTE_WORDS = 6;
/** Quoted runs in prose this long or longer must be verbatim (1–3-word scare quotes are fine). */
const MIN_CHECKED_QUOTE_WORDS = 4;

/** Why an item first shown by a research call in the same turn cannot be cited by that turn's composition calls. */
const SAME_TURN = 'a call in this same turn first showed its text, after you had written this — cite it from your next turn on';

/** Kinds that can state a tradition's view or be a commentary voice. */
const STATEMENT_KINDS: ReadonlySet<EvidenceKind> = new Set(['confession', 'commentary', 'dictionary', 'study-note', 'curated', 'book-introduction']);

/** Words that describe a position without naming who holds it. */
const GENERIC_POSITION_WORDS = new Set([
  'view', 'views', 'position', 'positions', 'church', 'churches', 'tradition', 'traditions', 'christian', 'christians', 'reading', 'readings',
  'interpretation', 'interpreters', 'majority', 'minority', 'traditional', 'school', 'schools', 'approach', 'understanding', 'some', 'many',
  'most', 'scholars', 'modern', 'contemporary', 'historic', 'historical', 'classic', 'classical', 'conservative', 'liberal', 'mainline',
  'early', 'later', 'strict', 'broad', 'other', 'others', 'common', 'standard', 'popular', 'older', 'newer', 'lenient', 'permissive',
  'restrictive', 'moderate', 'teaching', 'camp', 'side',
]);

/* ------------------------------------------------------------------ */
/* Validator                                                           */
/* ------------------------------------------------------------------ */

type Cited = { ok: true; evidence: Evidence[]; warnings: string[] } | { ok: false; reason: string };

export class Validator {
  /** item id → ledger ids it cites (used to link concepts to items) */
  readonly itemEvidence = new Map<string, string[]>();
  private readonly passageTexts = new Map<string, Promise<string[]>>();

  constructor(
    private readonly deps: ValidatorDeps,
    private readonly nextId: (prefix: string) => string,
  ) {}

  /** reference-parser options: the page language's book names ("Mateus 19:9") are references too */
  private get loc(): { locale?: Locale } {
    return { locale: this.deps.locale };
  }

  /* ---------------- shared checks ---------------- */

  /**
   * Rule 1: resolve cited ids against the ledger. Unknown ids — and ids the model was
   * listed but never shown (a result too long to show) — are dropped with a warning;
   * none left → reject.
   */
  cite(raw: unknown, allowEmpty = false): Cited {
    const list = Array.isArray(raw) ? raw : raw == null ? [] : [raw];
    const evidence: Evidence[] = [];
    const unknown: string[] = [];
    const unread: string[] = [];
    const sameTurn: string[] = [];
    for (const r of list) {
      const id = normalizeEvidenceId(r);
      const e = id ? this.deps.ledger.get(id) : undefined;
      if (e && this.deps.ledger.isWithheld(e.id)) unread.push(e.id);
      else if (e && this.deps.ledger.firstShownThisTurn(e.id)) sameTurn.push(e.id);
      else if (e) {
        if (!evidence.includes(e)) evidence.push(e);
      } else unknown.push(String(r));
    }
    const warnings = [
      ...(unknown.length ? [`ignored unknown evidence ids ${unknown.join(', ')}`] : []),
      ...(unread.length ? [`ignored ${unread.join(', ')}: you have not read ${unread.length === 1 ? 'its' : 'their'} text (it was not shown) — open ${unread.length === 1 ? 'it' : 'each'} with read_document (\`evidence\`: its id), then cite it in a later turn`] : []),
      ...(sameTurn.length ? [`ignored ${sameTurn.join(', ')}: ${SAME_TURN}`] : []),
    ];
    if (evidence.length === 0 && !allowEmpty) {
      return {
        ok: false,
        reason: unread.length
          ? `cites only evidence you have not read (${unread.join(', ')} — the text was not shown because the result was too long); open it with read_document (\`evidence\`: its id), then cite it in a later turn`
          : sameTurn.length
            ? `cites only evidence you had not read when you wrote it (${sameTurn.join(', ')}: ${SAME_TURN})`
            : unknown.length
              ? `cites no evidence from this request’s ledger (unknown ids: ${unknown.join(', ')})`
              : 'cites no evidence — every item must cite at least one retrieved evidence id',
      };
    }
    return { ok: true, evidence, warnings };
  }

  private views(evidence: readonly Evidence[]): EvidenceView[] {
    return evidence.map((e) => ({ e, fullText: this.deps.ledger.fullText(e) }));
  }

  /**
   * Rules 2, 4 and 7 for a piece of generated prose: no URL, within length, no evidence
   * ids, every reference exists and is given by the cited evidence (or lies in the page
   * passage), quoted runs are verbatim, and names, traditions and dates are in the
   * cited evidence.
   */
  async proseProblem(text: string | undefined, evidence: readonly Evidence[], maxWords: number, field: string, ctx: ProseContext = {}): Promise<string | null> {
    if (!text) return null;
    if (containsUrl(text)) return `${field} contains a URL or web address — links come from the sources automatically`;
    const n = wordCount(text);
    if (n > maxWords) return `${field} is too long (${n} words; keep it under ${Math.round(maxWords / 2)})`;
    const ids = (text.match(/\bE\d{1,4}\b/g) ?? []).filter((id) => this.deps.ledger.get(id));
    if (ids.length) return `${field} contains evidence ids (${[...new Set(ids)].join(', ')}) — put them in the evidence field, never in the text the reader sees`;
    const pseudo = pseudoReferences(text, this.deps.locale);
    const bare = pseudo.filter((p) => BARE_VERSE_WORDS.has(p.split(/\s+/)[0].replace(/\.$/, '').toLowerCase()));
    if (bare.length) return `${field} gives a verse without its book (“${bare[0]}”) — write the book name with every verse reference (e.g. “1 Corinthians 7:15”), so it can be checked`;
    if (pseudo.length) return `${field} mentions ${pseudo.map((p) => `“${p}”`).join(', ')}, which ${pseudo.length === 1 ? 'is' : 'are'} not a Bible reference`;
    const bad = await this.deps.refs.proseProblems(text, this.deps.locale);
    if (bad.length) return `${field} mentions references that do not exist: ${bad.join('; ')}`;
    for (const f of findReferences(text, this.loc)) {
      if (!this.refGrounded(f.ref, evidence, ctx.page, true)) {
        const near = nearestEvidenceRefs(evidence, f.ref);
        return `${field} mentions ${formatRef(f.ref)}, which none of the cited evidence gives${near.length ? ` (it gives ${near.join('; ')})` : ''} — cite the item that lists it, or leave the reference out`;
      }
    }
    const views = this.views(evidence);
    for (const seg of quotedSegments(text, MIN_CHECKED_QUOTE_WORDS)) {
      if (!(await this.quoteVerified(seg, views, ctx.page))) {
        return `${field} puts “${seg.slice(0, 60)}${seg.length > 60 ? '…' : ''}” in quotation marks, but those words are not in the cited evidence or the Scripture you read — quote exactly or paraphrase without quotation marks`;
      }
    }
    let names = unnamedNames(text, views, this.deps.providers);
    // a follow-up answer may point to the page's own voices by their authors' names (“the page's commentary section draws on Calvin and Henry”)
    if (names.length && ctx.pageAuthors?.size) names = names.filter((t) => !this.pointsToPageVoice(t, text, ctx.pageAuthors!));
    if (names.length) {
      const hint = this.ledgerHint((v) => unnamedNames(names.join(' '), [v], this.deps.providers).length < names.length);
      return `${field} names ${names.join(', ')}, which none of the cited evidence names — attribute views only to the authors and works the evidence gives (cite the text that names them${hint}, or leave the name out)`;
    }
    const absent = this.unsearchedAbsence(text);
    if (absent) return `${field} ${absent}`;
    const traditions = unnamedTraditions(text, views, this.deps.providers);
    if (traditions.length) {
      const hint = this.ledgerHint((v) => unnamedTraditions(traditions.join(' '), [v], this.deps.providers).length < traditions.length);
      return `${field} speaks of ${traditions.join(', ')}, but none of the cited evidence names or represents ${traditions.length === 1 ? 'that tradition' : 'those traditions'} — cite a text that does${hint}, keeping the wording specific, or leave it out`;
    }
    const years = ungroundedYears(text, views, this.deps.providers);
    if (years.length) return `${field} gives the date ${years.join(', ')}, which none of the cited evidence contains — dates come from the evidence only`;
    const claims = ungroundedClaims(text, views, this.deps.providers);
    if (claims.length) return `${field} ${claimReason(claims[0])}`;
    const canon = invertedCanon(text, views);
    if (canon) {
      return `${field} says a canon anathematised or condemned a view, but the canon you cite (${canon.e.id}) anathematises anyone who says the Church ERRED in teaching it — state exactly what it condemns (“anyone who says the Church erred in teaching that…”) or quote the canon`;
    }
    const nouns = await this.ungroundedNouns(text, evidence, ctx);
    if (nouns.length) {
      return `${field} names ${nouns.map((n) => `“${n}”`).join(', ')}, which neither the cited evidence nor the Scripture you read contains — read the verses that name ${nouns.length === 1 ? 'it' : 'them'} (read_passage) and cite them, or leave ${nouns.length === 1 ? 'it' : 'them'} out`;
    }
    const echo = await this.translationEcho(text, evidence, ctx.page);
    if (echo) {
      return `${field} uses the ${echo.translation} wording “${echo.phrase}”, not the BSB’s${echo.bsb ? ` (${echo.ref}: “${echo.bsb}”)` : ''} — paraphrase the BSB text you read, keeping who does what to whom`;
    }
    return null;
  }

  /** Is every sentence naming `token` a pointer to the page's own voices, by one of their authors? */
  private pointsToPageVoice(token: string, text: string, authors: ReadonlySet<string>): boolean {
    const entry = namesIn(text, this.deps.providers.sources).find((n) => n.token === token);
    if (!entry || ![...entry.authorIds].some((a) => authors.has(a))) return false;
    const naming = sentencesOf(text).filter((x) => entry.re.test(x));
    return naming.length > 0 && naming.every(isPagePointerSentence);
  }

  /** ", e.g. E9" — retrieved items (shown to the model) that would ground the prose, for a repair hint. */
  private ledgerHint(grounds: (v: EvidenceView) => boolean): string {
    const ledger = this.deps.ledger;
    const ids = ledger
      .all()
      .filter((e) => !ledger.isWithheld(e.id) && grounds({ e, fullText: ledger.fullText(e) }))
      .slice(0, 3)
      .map((e) => e.id);
    return ids.length ? `, e.g. ${ids.join(', ')}` : '';
  }

  /** Do the BSB texts of two passages share a run of QUOTATION_RUN words (true when either text is unavailable)? */
  private async sharesWording(a: PassageRef, b: PassageRef): Promise<boolean> {
    const [ta, tb] = await Promise.all([this.deps.refs.rangeText(a, 'BSB'), this.deps.refs.rangeText(b, 'BSB')]);
    if (!ta || !tb) return true;
    const words = (t: string) => t.toLowerCase().replace(/[’']/g, '').split(/[^\p{L}]+/u).filter(Boolean);
    const wa = words(ta.text);
    const grams = new Set<string>();
    for (let i = 0; i + QUOTATION_RUN <= wa.length; i++) grams.add(wa.slice(i, i + QUOTATION_RUN).join(' '));
    const wb = words(tb.text);
    for (let i = 0; i + QUOTATION_RUN <= wb.length; i++) {
      const g = wb.slice(i, i + QUOTATION_RUN);
      if (grams.has(g.join(' ')) && g.filter((w) => !STOPWORDS.has(w)).length >= 2) return true;
    }
    return false;
  }

  /** Full texts of the Scripture read in this request (any translation). */
  private scriptureTexts(): string[] {
    const ledger = this.deps.ledger;
    return ledger
      .all()
      .filter((e) => e.kind === 'scripture')
      .map((e) => ledger.fullText(e));
  }

  /**
   * Biblical proper nouns and conventional labels ("Cornelius", "Judah", "the Sermon on
   * the Mount") that the item's grounds do not contain: its cited evidence, the Scripture
   * read in this request, the page passage, the BSB text of the verses its cited evidence
   * gives, or the reader's own words.
   */
  private async ungroundedNouns(text: string, evidence: readonly Evidence[], ctx: ProseContext): Promise<string[]> {
    const scripture = this.deps.providers.scripture;
    const views = this.views(evidence);
    const citedRefs = evidence.flatMap((e) => evidenceRefs(e));
    const books = new Set([...citedRefs.map((r) => r.book), ...findReferences(text, this.loc).map((f) => f.ref.book), ...(ctx.page?.passage ? [ctx.page.passage.book] : [])]);
    const texts = [
      ...views.map((v) => haystack(v, this.deps.providers)),
      ...this.scriptureTexts(),
      this.deps.readerText ?? '',
      ctx.readerText ?? '',
      ...(ctx.page?.passage ? await this.passageText(ctx.page.passage) : []),
    ];
    let missing = await ungroundedProperNouns(text, scripture, { texts, books });
    if (!missing.length) return missing;
    // the verses the cited evidence gives (a topical index lists them; a note is on them)
    const verseTexts = await this.refTexts([...citedRefs, ...findReferences(text, this.loc).map((f) => f.ref)], 'BSB', 160);
    missing = await ungroundedProperNouns(text, scripture, { texts: [...texts, ...verseTexts.map((t) => t.text)], books });
    return missing;
  }

  /** Texts of references in a translation, in order (at most `maxVerses` verses in all; ranges over more than two chapters are skipped). */
  private async refTexts(refs: readonly PassageRef[], translation: TranslationId, maxVerses: number): Promise<{ key: string; label: string; text: string }[]> {
    const out: { key: string; label: string; text: string }[] = [];
    let verses = 0;
    const seen = new Set<string>();
    for (const r of refs) {
      const key = refKey(r);
      if (seen.has(key)) continue;
      seen.add(key);
      if ((r.endChapter ?? r.startChapter) - r.startChapter > 1) continue;
      const t = await this.deps.refs.rangeText(r, translation);
      if (!t) continue;
      verses += t.verses;
      if (verses > maxVerses) break;
      out.push({ key, label: formatRef(r), text: t.text });
    }
    return out;
  }

  /**
   * Scripture paraphrased in another translation's words: a run of 4+ words (with at least
   * two content words) that the KJV or WEB text of the item's verses has, the BSB text of
   * the same verses does not, and no retrieved evidence contains ("God has called us to
   * peace" for 1 Corinthians 7:15, whose BSB reads "called you to live in peace").
   */
  private async translationEcho(text: string, evidence: readonly Evidence[], page: PageInfo | undefined): Promise<{ translation: string; phrase: string; ref?: string; bsb?: string } | null> {
    // compares English prose with English versions: meaningless on a page written in another language
    if (this.deps.locale && this.deps.locale !== 'en') return null;
    const prose = normalizeWords(text.replace(/“[^”]*”|"[^"]*"/g, ' '));
    if (prose.length < 4) return null;
    const refs = [...evidence.flatMap((e) => evidenceRefs(e)), ...findReferences(text, this.loc).map((f) => f.ref)];
    if (page?.passage && !refs.length) refs.push(page.passage);
    if (!refs.length) return null;
    const [bsb, kjv, web] = await Promise.all((['BSB', 'KJV', 'WEB'] as const).map((t) => this.refTexts(refs, t, 60)));
    const bsbText = ` ${normalizeWords(bsb.map((t) => t.text).join(' ')).join(' ')} `;
    const ledgerText = this.ledgerWords();
    for (const [name, texts] of [['KJV', kjv], ['WEB', web]] as const) {
      const other = ` ${normalizeWords(texts.map((t) => t.text).join(' ')).join(' ')} `;
      for (let i = 0; i + 4 <= prose.length; i++) {
        const gram = prose.slice(i, i + 4);
        if (gram.filter((w) => !STOPWORDS.has(w) && !ECHO_FILLER.has(w)).length < 2) continue;
        const g = ` ${gram.join(' ')} `;
        if (!other.includes(g) || bsbText.includes(g) || ledgerText.includes(g)) continue;
        // Only wording that changes who does what to whom (a pronoun) or the polarity (a negation)
        // counts: other shared phrasing is ordinary paraphrase. Compare verse by verse.
        const hit = await this.echoVerse(gram, texts, name);
        if (hit) return { translation: name, phrase: gram.join(' '), ref: hit.ref, bsb: clipWords(hit.bsb, 24) };
      }
    }
    return null;
  }

  /** The verse whose KJV/WEB text has this 4-word run with a pronoun or negation its BSB text lacks. */
  private async echoVerse(gram: readonly string[], texts: readonly { key: string; label: string; text: string }[], translation: 'KJV' | 'WEB'): Promise<{ ref: string; bsb: string } | null> {
    const g = ` ${gram.join(' ')} `;
    for (const t of texts) {
      if (!` ${normalizeWords(t.text).join(' ')} `.includes(g)) continue;
      const ref = parseRefKey(t.key);
      if (!ref) continue;
      for (const v of refToVerses(ref, 60)) {
        const other = await this.deps.refs.verseText(v, translation);
        if (!other || !` ${normalizeWords(other).join(' ')} `.includes(g)) continue;
        const bsb = (await this.deps.refs.verseText(v, 'BSB')) ?? '';
        const bsbWords = new Set(normalizeWords(bsb));
        if (gram.some((w) => ROLE_WORDS.has(w) && !bsbWords.has(w))) return { ref: formatRef(verseToPassage(v)), bsb };
      }
    }
    return null;
  }

  private ledgerWordsCache: { size: number; text: string } | null = null;

  /** Every retrieved text, normalised to words (for "is this wording in the evidence?"). */
  private ledgerWords(): string {
    const ledger = this.deps.ledger;
    if (this.ledgerWordsCache?.size === ledger.size) return this.ledgerWordsCache.text;
    const text = ` ${ledger
      .all()
      .map((e) => normalizeWords(ledger.fullText(e)).join(' '))
      .join(' | ')} `;
    this.ledgerWordsCache = { size: ledger.size, text };
    return text;
  }

  /** Is this reference on the page passage or given by the cited evidence? Prose may also name a chapter the evidence or passage lies in. */
  private refGrounded(ref: PassageRef, evidence: readonly Evidence[], page: PageInfo | undefined, prose: boolean): boolean {
    if (page?.passage && refContains(page.passage, ref)) return true;
    if (evidence.some((e) => evidenceGivesRef(e, ref))) return true;
    if (prose && ref.startVerse == null) {
      if (page?.passage && refsOverlap(page.passage, ref)) return true;
      if (evidence.some((e) => evidenceMentionsRef(e, ref))) return true;
    }
    return false;
  }

  /** A quoted run is verbatim in the cited evidence, in Scripture retrieved in this request, or in the page passage. */
  private async quoteVerified(seg: string, views: readonly EvidenceView[], page: PageInfo | undefined): Promise<boolean> {
    if (views.some((v) => findExactSpan(seg, v.fullText))) return true;
    if (this.deps.ledger.all().some((e) => e.kind === 'scripture' && findExactSpan(seg, this.deps.ledger.fullText(e)))) return true;
    if (page?.passage) {
      for (const t of await this.passageText(page.passage)) if (findExactSpan(seg, t)) return true;
    }
    return false;
  }

  /** The page passage in BSB, KJV, WEB and the reader's version (for Scripture quoted in prose). */
  private passageText(passage: PassageRef): Promise<string[]> {
    const key = refKey(passage);
    let p = this.passageTexts.get(key);
    if (!p) {
      const scripture = this.deps.providers.scripture;
      const span = (passage.endChapter ?? passage.startChapter) - passage.startChapter;
      p =
        span > 2
          ? Promise.resolve([])
          : Promise.all(
              [...new Set<TranslationId>(['BSB', 'KJV', 'WEB', ...(this.deps.translation ? [this.deps.translation] : [])])].map((t) =>
                scripture.getPassage(passage, t).then(
                  (x) => x.chapters.flatMap((c) => c.verses.map((v) => v.text)).join(' '),
                  () => '',
                ),
              ),
            );
      this.passageTexts.set(key, p);
    }
    return p;
  }

  /** Generated prose provenance: synthesis, verification 'generated', citations with excerpts. */
  provenance(evidence: readonly Evidence[], claim: string): Provenance {
    return { kind: 'synthesis', verification: 'generated', citations: evidence.map((e) => toCitation(e, claim, this.deps.locale)) };
  }

  private text(text: string, evidence: readonly Evidence[]): ProvenancedText {
    return { text, provenance: this.provenance(evidence, text) };
  }

  /**
   * Secondary reference lists (key verses, related verses, key texts): references that do
   * not exist, or that no cited evidence gives (nor the page passage contains), are
   * dropped with a warning.
   */
  private async groundedRefs(raw: readonly string[] | undefined, evidence: readonly Evidence[], page: PageInfo | undefined, label: string, warnings: string[]): Promise<PassageRef[]> {
    const out: PassageRef[] = [];
    for (const r of raw ?? []) {
      const parsed = await this.deps.refs.parse(r);
      if (!parsed.ok) {
        warnings.push(`${label}: dropped reference ${parsed.reason}`);
        continue;
      }
      if (!this.refGrounded(parsed.ref, evidence, page, false)) {
        const near = nearestEvidenceRefs(evidence, parsed.ref);
        // the retrieved item that does give it, so a repair can cite it and keep the reference
        const giver = this.deps.ledger.all().find((e) => !this.deps.ledger.isWithheld(e.id) && evidenceGivesRef(e, parsed.ref));
        warnings.push(
          `${label}: dropped ${formatRef(parsed.ref)} (not in the cited evidence${near.length ? `, which gives ${near.join('; ')}` : ''}${giver ? `; ${giver.id} gives it — add ${giver.id} to this item's evidence to keep it` : ''})`,
        );
        continue;
      }
      if (!out.some((x) => formatRef(x) === formatRef(parsed.ref))) out.push(parsed.ref);
    }
    return out;
  }

  private remember(id: string, evidence: readonly Evidence[]): void {
    this.itemEvidence.set(
      id,
      evidence.map((e) => e.id),
    );
  }

  private parse<T extends z.ZodType>(schema: T, raw: unknown): { ok: true; data: z.infer<T> } | { ok: false; reason: string } {
    const r = schema.safeParse(raw);
    return r.success ? { ok: true, data: r.data } : { ok: false, reason: `malformed (${zodIssues(r.error)})` };
  }

  /** The first problem among several prose fields (checked in order). */
  private async firstProblem(checks: readonly (readonly [string | undefined, number, string])[], evidence: readonly Evidence[], ctx: ProseContext): Promise<string | null> {
    for (const [text, max, field] of checks) {
      const p = await this.proseProblem(text, evidence, max, field, ctx);
      if (p) return p;
    }
    return null;
  }

  /* ---------------- begin_page ---------------- */

  async beginPage(raw: unknown): Promise<BeginResult> {
    const d = emptyDecision();
    const p = this.parse(BeginPageInput, stripEvidenceMarkers(raw));
    if (!p.ok) return { ...d, page: null, rejected: [{ item: 'begin_page', reason: p.reason }] };
    const input = p.data;
    const c = this.cite(input.summary.evidence);
    if (!c.ok) return { ...d, page: null, rejected: [{ item: 'begin_page summary', reason: c.reason }] };
    d.warnings.push(...c.warnings);

    let passage: PassageRef | undefined;
    if (input.passage) {
      const r = await this.deps.refs.parse(input.passage);
      if (!r.ok) {
        if (input.kind === 'passage') return { ...d, page: null, rejected: [{ item: 'begin_page passage', reason: r.reason }] };
        d.warnings.push(`anchor passage dropped: ${r.reason}`);
      } else if (input.kind === 'topic' && !this.deps.ledger.all().some((e) => evidenceGivesRef(e, r.ref))) {
        d.warnings.push(`anchor passage ${formatRef(r.ref)} dropped: read it (read_passage) or cite evidence that lists it first`);
      } else passage = r.ref;
    } else if (input.kind === 'passage') {
      return { ...d, page: null, rejected: [{ item: 'begin_page', reason: 'a passage page needs `passage`' }] };
    }

    // title, subtitle and question are reader-facing too: same checks as the summary, against its evidence
    const page: PageInfo = { kind: input.kind, ...(passage ? { passage } : {}), sections: new Set(), keyWords: [] };
    const problem = await this.firstProblem(
      [
        [input.title, MAX_WORDS.title, 'title'],
        [input.subtitle, MAX_WORDS.subtitle, 'subtitle'],
        [input.question, MAX_WORDS.question, 'question'],
        [input.summary.text, MAX_WORDS.summary, 'summary'],
      ],
      c.evidence,
      { page },
    );
    if (problem) return { ...d, page: null, rejected: [{ item: 'begin_page', reason: problem }] };

    d.accepted = 1;
    return {
      ...d,
      page: {
        title: input.title,
        ...(input.subtitle ? { subtitle: input.subtitle } : {}),
        kind: input.kind,
        ...(passage ? { passage } : {}),
        ...(input.question ? { question: input.question } : {}),
        summary: this.text(input.summary.text, c.evidence),
      },
    };
  }

  /* ---------------- add_section ---------------- */

  async section(raw: z.infer<typeof AddSectionInput>, page: PageInfo, mode: 'replace' | 'append' = raw.mode ?? 'replace'): Promise<SectionResult> {
    const input = stripEvidenceMarkers(raw);
    switch (input.section) {
      case 'key-passages':
        return this.keyPassages(input.items ?? [], page);
      case 'cross-references':
        return this.crossReferences(input.items ?? [], page);
      case 'original-languages':
        return this.keyWords(input.items ?? [], page, mode);
      case 'historical-context':
        return this.context(input.items ?? [], page);
      case 'literary-context':
        return this.literary(input, page);
      case 'theology':
        return this.theology(input.themes ?? [], input.perspectives ?? [], page);
      case 'commentary':
        return this.commentary(input.voices ?? [], page);
    }
  }

  /**
   * A section heading or intro: uncited framing text, so short and free of anything
   * that would need evidence (references outside the page passage, quotations, names,
   * traditions, dates, URLs).
   */
  async framingProblem(text: string, kind: 'title' | 'intro', page: PageInfo): Promise<string | null> {
    return this.proseProblem(text, [], kind === 'title' ? MAX_WORDS.sectionTitle : MAX_WORDS.sectionIntro, `section ${kind}`, { page });
  }

  private async keyPassages(items: readonly unknown[], page: PageInfo): Promise<SectionResult> {
    const d = emptyDecision();
    if (page.kind !== 'topic') return { ...d, payload: null, rejected: [{ item: 'key-passages', reason: 'key-passages belong on topic pages; use cross-references on a passage page' }] };
    const out: TopicPassage[] = [];
    for (let i = 0; i < items.length; i++) {
      const base = `key-passages item ${i + 1}`;
      const p = this.parse(KeyPassageItem, items[i]);
      if (!p.ok) {
        d.rejected.push({ item: base, reason: p.reason });
        continue;
      }
      const it = p.data;
      const label = `${base} (“${it.reference}”)`;
      const c = this.cite(it.evidence);
      if (!c.ok) {
        d.rejected.push({ item: label, reason: c.reason });
        continue;
      }
      const r = await this.deps.refs.parse(it.reference);
      if (!r.ok) {
        d.rejected.push({ item: label, reason: r.reason });
        continue;
      }
      if (!c.evidence.some((e) => evidenceGivesRef(e, r.ref))) {
        const near = nearestEvidenceRefs(c.evidence, r.ref);
        d.rejected.push({
          item: label,
          reason: near.length
            ? `the cited evidence gives ${near.join('; ')}, not ${formatRef(r.ref)} — use the range the evidence gives`
            : `none of the cited evidence contains ${formatRef(r.ref)} — cite the item that lists it (a topical-index entry, a note, or the passage you read)`,
        });
        continue;
      }
      if (out.some((x) => formatRef(x.ref) === formatRef(r.ref))) {
        d.warnings.push(`${label}: duplicate passage skipped`);
        continue;
      }
      // the note paraphrases the passage: it must have been read, not only listed by an index
      if (!this.passageRead(r.ref)) {
        d.rejected.push({
          item: label,
          reason: `you have not read ${formatRef(r.ref)} in this request (an index or a note gives only its address, not what it says) — read it with read_passage, then add it again with a note on what it says, or leave it out`,
        });
        continue;
      }
      const problem = await this.firstProblem(
        [
          [it.title, MAX_WORDS.title, 'title'],
          [it.note, MAX_WORDS.note, 'note'],
          [it.group, MAX_WORDS.group, 'group'],
        ],
        c.evidence,
        { page },
      );
      if (problem) {
        d.rejected.push({ item: label, reason: problem });
        continue;
      }
      d.warnings.push(...c.warnings.map((w) => `${label}: ${w}`));
      const id = this.nextId('kp');
      this.remember(id, c.evidence);
      out.push({ id, ref: r.ref, title: it.title, note: this.text(it.note, c.evidence), group: it.group, tags: [] });
    }
    d.accepted = out.length;
    return { ...d, payload: out.length ? { section: 'key-passages', items: out } : null };
  }

  /**
   * Was the passage read in this request — Scripture (or tagged original text) retrieved
   * and shown, covering at least half its verses? A whole chapter, or a range across
   * chapters, needs some of it read.
   */
  private passageRead(ref: PassageRef): boolean {
    const ledger = this.deps.ledger;
    const read = ledger
      .all()
      .filter((e) => (e.kind === 'scripture' || e.kind === 'original-text') && !ledger.isWithheld(e.id))
      .flatMap((e) => evidenceRefs(e))
      .filter((r) => r.book === ref.book);
    if (!read.length) return false;
    if (ref.startVerse == null || (ref.endChapter ?? ref.startChapter) !== ref.startChapter) return read.some((r) => refsOverlap(r, ref));
    const verses = refToVerses(ref, 400);
    const covered = verses.filter((v) => read.some((r) => refContains(r, verseToPassage(v)))).length;
    return covered * 2 >= verses.length;
  }

  private async crossReferences(items: readonly unknown[], page: PageInfo): Promise<SectionResult> {
    const d = emptyDecision();
    if (!page.passage) return { ...d, payload: null, rejected: [{ item: 'cross-references', reason: 'the page has no passage to connect from' }] };
    const out: CrossReference[] = [];
    for (let i = 0; i < items.length; i++) {
      const base = `cross-references item ${i + 1}`;
      const p = this.parse(CrossRefItem, items[i]);
      if (!p.ok) {
        d.rejected.push({ item: base, reason: p.reason });
        continue;
      }
      const it = p.data;
      const label = `${base} (“${it.to}”)`;
      const c = this.cite(it.evidence);
      if (!c.ok) {
        d.rejected.push({ item: label, reason: c.reason });
        continue;
      }
      const from = await this.deps.refs.parse(it.from);
      if (!from.ok) {
        d.rejected.push({ item: label, reason: `from: ${from.reason}` });
        continue;
      }
      if (!refContains(page.passage, from.ref)) {
        d.rejected.push({ item: label, reason: `from (${formatRef(from.ref)}) must lie inside the page passage (${formatRef(page.passage)})` });
        continue;
      }
      const to = await this.deps.refs.parse(it.to);
      if (!to.ok) {
        d.rejected.push({ item: label, reason: `to: ${to.reason}` });
        continue;
      }
      if (!c.evidence.some((e) => evidenceGivesRef(e, to.ref))) {
        const near = nearestEvidenceRefs(c.evidence, to.ref);
        d.rejected.push({
          item: label,
          reason: near.length
            ? `the cited evidence gives ${near.join('; ')}, not ${formatRef(to.ref)} — use the range the evidence gives`
            : `none of the cited evidence contains ${formatRef(to.ref)} — cite the cross-reference list or the passage you read`,
        });
        continue;
      }
      const problem = await this.firstProblem(
        [
          [it.title, MAX_WORDS.title, 'title'],
          [it.explanation, MAX_WORDS.explanation, 'explanation'],
        ],
        c.evidence,
        { page },
      );
      if (problem) {
        d.rejected.push({ item: label, reason: problem });
        continue;
      }
      d.warnings.push(...c.warnings.map((w) => `${label}: ${w}`));
      // "quotation" is a claim about wording: the two BSB texts must share a run of words (eval2: Exodus 20:11 labelled a quotation of Genesis 1:26–31)
      let relationship = it.relationship;
      if (relationship === 'quotation' && !(await this.sharesWording(from.ref, to.ref))) {
        relationship = 'allusion';
        d.warnings.push(`${label}: relationship changed from quotation to allusion — the BSB texts of ${formatRef(from.ref)} and ${formatRef(to.ref)} share no run of ${QUOTATION_RUN} words`);
      }
      const id = this.nextId('xr');
      this.remember(id, c.evidence);
      out.push({ id, from: from.ref, target: to.ref, relationship, title: it.title, explanation: this.text(it.explanation, c.evidence), tags: [] });
    }
    d.accepted = out.length;
    return { ...d, payload: out.length ? { section: 'cross-references', items: out } : null };
  }

  /** Was this Strong's number retrieved (lexicon / concordance / tagged original text)? */
  private retrievedStrong(base: string): boolean {
    return this.deps.ledger.all().some((e) => {
      if ((e.kind === 'lexicon' || e.kind === 'occurrences') && e.strong && normalizeStrong(e.strong)?.base === base) return true;
      if (e.kind === 'lexicon' || e.kind === 'original-text' || e.kind === 'occurrences') {
        const tags = e.text.match(/\b[GH]\d{1,5}[A-Z]?\b/g) ?? [];
        return tags.some((t) => normalizeStrong(t)?.base === base);
      }
      return false;
    });
  }

  private async keyWords(items: readonly unknown[], page: PageInfo, mode: 'replace' | 'append' = 'replace'): Promise<SectionResult> {
    const d = emptyDecision();
    const out: KeyWord[] = [];
    const { providers, refs } = this.deps;
    for (let i = 0; i < items.length; i++) {
      const base = `original-languages item ${i + 1}`;
      const p = this.parse(KeyWordItem, items[i]);
      if (!p.ok) {
        d.rejected.push({ item: base, reason: p.reason });
        continue;
      }
      const it = p.data;
      const label = `${base} (${it.strong} “${it.english}”)`;
      const c = this.cite(it.evidence);
      if (!c.ok) {
        d.rejected.push({ item: label, reason: c.reason });
        continue;
      }
      const n = normalizeStrong(it.strong);
      if (!n) {
        d.rejected.push({ item: label, reason: `“${it.strong}” is not a Strong’s number` });
        continue;
      }
      if (!this.retrievedStrong(n.base)) {
        d.rejected.push({ item: label, reason: `${n.base} is not in any lexicon or original_text evidence you retrieved — look it up first` });
        continue;
      }
      // in replace mode the call's list IS the section: only duplicates within it are skipped
      if (out.some((k) => k.strong === n.base)) {
        d.warnings.push(`${label}: ${n.base} is already in this list — skipped`);
        continue;
      }
      if (mode === 'append' && page.keyWords.some((k) => k.strong === n.base)) {
        d.warnings.push(`${label}: ${n.base} is already on the page — skipped`);
        continue;
      }
      if (wordCount(it.english) > 6 || containsUrl(it.english) || /["“”«»]/.test(it.english)) {
        d.rejected.push({ item: label, reason: 'english should be the word or short phrase readers see (≤ 6 words, no quotation marks or links)' });
        continue;
      }
      const baseEntry = await safe(() => providers.lexicon.getEntry(n.base));

      // Anchor: the phrase must be in the BSB verse, the verse must contain the lemma, and the phrase must translate it.
      const anchors: WordAnchor[] = [];
      let grammar: string | undefined;
      let extended: string | undefined;
      /** the verse (and the word in it) the card is about: the anchor, else the word's first use in the page passage */
      let wordIn: { verse: VerseRef; word: OriginalWord; bsb: string } | null = null;
      if (it.anchor) {
        const r = await refs.parse(it.anchor.reference);
        const v = r.ok ? singleVerse(r.ref) : null;
        if (!r.ok) d.warnings.push(`${label}: anchor dropped — ${r.reason}`);
        else if (!v) d.warnings.push(`${label}: anchor dropped — it must be a single verse`);
        else {
          const word = await this.originalWord(v, n.base);
          const bsb = await refs.verseText(v, 'BSB');
          if (word && bsb) wordIn = { verse: v, word, bsb };
          let phrase: string | null = it.anchor.phrase;
          if (!bsb || !containsNormalized(bsb, phrase)) {
            d.warnings.push(`${label}: anchor dropped — “${phrase}” is not in the BSB text of ${formatRef(r.ref)}`);
            phrase = null;
          } else if (!word) {
            d.warnings.push(`${label}: anchor dropped — ${n.base} does not occur in the original text of ${formatRef(r.ref)}`);
            phrase = null;
          } else if (!phraseTranslatesWord(phrase, word, baseEntry)) {
            const hint = suggestPhrase(bsb, word.gloss);
            d.warnings.push(`${label}: anchor dropped — “${phrase}” does not translate ${n.base} (its gloss in ${formatRef(r.ref)} is “${word.gloss}”)${hint ? `; the BSB renders it “${hint}”` : ''}`);
            phrase = null;
          } else {
            // a phrase that also takes in a neighbouring word ("certificate of divorce" for כְּרִיתֻת, whose neighbour סֵפֶר is the certificate) is narrowed to this word's own rendering
            const borrowed = await this.borrowedWords(phrase, v, word, baseEntry);
            if (borrowed) {
              // this word's own rendering inside the phrase: the gloss's words, else the phrase without the neighbours' words at its edges
              const trimmed = trimBorrowed(phrase, borrowed.words, word, baseEntry);
              const suggested = suggestPhrase(bsb, word.gloss);
              const own =
                suggested && containsNormalized(phrase, suggested)
                  ? suggested
                  : trimmed && containsNormalized(bsb, trimmed) && phraseTranslatesWord(trimmed, word, baseEntry)
                    ? trimmed
                    : suggested;
              const why = `“${borrowed.words.join(' ')}” translates ${borrowed.from.join(', ')}, a neighbouring word, not ${n.base}`;
              if (own && containsNormalized(phrase, own)) {
                d.warnings.push(`${label}: anchor narrowed from “${phrase}” to “${own}” — ${why}`);
                phrase = own;
              } else {
                d.warnings.push(`${label}: anchor dropped — ${why}${own ? `; the BSB renders ${n.base} “${own}”` : ''}`);
                phrase = null;
              }
            }
          }
          if (phrase && word && bsb) {
            const phrases: Partial<Record<TranslationId, string>> = { BSB: exactPhrase(bsb, phrase) };
            for (const t of ['KJV', 'WEB'] as const) {
              const other = await refs.verseText(v, t);
              if (other && containsNormalized(other, phrase)) phrases[t] = exactPhrase(other, phrase);
            }
            // the reader's language: underline the word in every version of that language whose verse holds the model's phrase verbatim
            const readerPhrase = it.anchor.readerPhrase;
            const lang = this.deps.locale && this.deps.locale !== 'en' ? this.deps.locale : null;
            if (lang && readerPhrase) {
              const missing: string[] = [];
              for (const b of BIBLE_VERSIONS.filter((x) => x.language === lang)) {
                const other = await refs.verseText(v, b.id);
                if (other && containsNormalized(other, readerPhrase)) phrases[b.id] = exactPhrase(other, readerPhrase);
                else if (b.id === this.deps.translation) missing.push(b.shortName);
              }
              if (missing.length) d.warnings.push(`${label}: “${readerPhrase}” is not in the ${missing.join(', ')} text of ${formatRef(r.ref)} — not underlined there`);
            }
            anchors.push({ verse: v, phrases });
            grammar = word.morphDescription ?? word.morph;
            if (grammar) grammar = `${grammar} (${formatRef(verseToPassage(v), 'short')})`;
            extended = word.extendedStrong;
          }
        }
      }
      if (!grammar && page.passage) {
        const found = await this.firstInPassage(page.passage, n.base);
        if (found) {
          grammar = `${found.word.morphDescription ?? found.word.morph ?? ''}`.trim();
          if (grammar) grammar = `${grammar} (${formatRef(verseToPassage(found.verse), 'short')})`;
          extended ??= found.word.extendedStrong;
          if (!wordIn) {
            const bsb = await refs.verseText(found.verse, 'BSB');
            if (bsb) wordIn = { verse: found.verse, word: found.word, bsb };
          }
        }
      }
      // the label readers see names this word, not its neighbour ("certificate of divorce" for כְּרִיתֻת “divorce”)
      let english = it.english;
      if (wordIn) {
        const borrowed = await this.borrowedWords(english, wordIn.verse, wordIn.word, baseEntry);
        if (borrowed) {
          const trimmed = trimBorrowed(english, borrowed.words, wordIn.word, baseEntry);
          const own =
            (trimmed && phraseTranslatesWord(trimmed, wordIn.word, baseEntry) ? trimmed : null) ?? suggestPhrase(wordIn.bsb, wordIn.word.gloss) ?? displayGloss(wordIn.word.gloss);
          d.warnings.push(`${label}: english shown as “${own}” — “${borrowed.words.join(' ')}” translates ${borrowed.from.join(', ')}, a neighbouring word, not ${n.base}`);
          english = own;
        }
      }

      // Hydrate lexical data from the lexicon (never from the model).
      let entry = extended ? await safe(() => providers.lexicon.getEntry(extended!)) : null;
      entry ??= baseEntry;
      if (!entry) {
        d.rejected.push({ item: label, reason: `${n.base} is not in the lexicon` });
        continue;
      }
      const occurrences = await safe(() => providers.lexicon.getOccurrences(n.base, 1));

      const problem =
        (await this.proseProblem(it.significance, c.evidence, MAX_WORDS.significance, 'significance', { page })) ??
        (await this.otherUsesProblem(it.significance, n.base, anchors[0]?.verse, c.evidence, it.english));
      if (problem) {
        d.rejected.push({ item: label, reason: problem });
        continue;
      }
      // the caution is shown on the card as lexical guidance: it must pass the same checks, say
      // nothing about other uses that the concordance does not show, and pass no moral verdict
      // the cited texts do not make — otherwise it is dropped (the card stays)
      let caution = it.caution;
      if (caution) {
        const why =
          (await this.proseProblem(caution, c.evidence, MAX_WORDS.caution, 'caution', { page })) ??
          (await this.otherUsesProblem(caution, n.base, anchors[0]?.verse, c.evidence, it.english)) ??
          this.verdictProblem(caution, c.evidence);
        if (why) {
          d.warnings.push(`${label}: caution dropped — ${why}`);
          caution = undefined;
        }
      }

      const lexText = `${entry.gloss}\n${entry.definition}\n${c.evidence.filter((e) => e.kind === 'lexicon').map((e) => e.text).join('\n')}`;
      const senses = (it.semanticRange ?? []).map((s) => s.trim()).filter(Boolean);
      const grounded = senses.filter((s) => wordCount(s) <= MAX_WORDS.sense && usableSense(s) && senseGrounded(s, lexText));
      // a sense the lexicon states in other words ("of divorce: to put away a wife"): keep the lexicon's own gloss for it ("divorce")
      for (const s of senses) {
        if (grounded.includes(s)) continue;
        const own = glossParts(baseEntry ?? entry).find((g) => contentStems(g).some((x) => contentStems(s).includes(x)));
        if (own && !grounded.some((g) => contentStems(g).join(' ') === contentStems(own).join(' '))) grounded.push(own);
      }
      if (grounded.length < senses.length || grounded.some((g) => !senses.includes(g))) d.warnings.push(`${label}: sense(s) not stated by the lexicon were replaced by the lexicon’s own wording`);
      const semanticRange = (grounded.length ? grounded : lexiconFallbackSenses(entry)).map(cleanSense);

      d.warnings.push(...c.warnings.map((w) => `${label}: ${w}`));
      const id = this.nextId('kw');
      this.remember(id, c.evidence);
      const lexSource = entry.sourceId;
      const textSource = n.language === 'G' ? 'stepbible-tagnt' : 'stepbible-tahot';
      const kw: KeyWord = {
        id,
        strong: n.base,
        language: entry.language,
        lemma: entry.lemma,
        transliteration: entry.transliteration,
        ...(entry.pronunciation ? { pronunciation: entry.pronunciation } : {}),
        english,
        anchors,
        ...(grammar ? { grammar } : {}),
        basicMeaning: basicMeaning(entry.gloss),
        semanticRange,
        notableOccurrences: [],
        // excerpts centred on this word (its Strong's number in tagged text, its English)
        significance: { text: it.significance, provenance: this.provenance(c.evidence, `${it.significance} ${n.base} ${n.base} ${it.english}`) },
        ...(caution ? { caution } : {}),
        provenance: {
          kind: 'lexical',
          verification: 'source-derived',
          citations: [
            { sourceId: lexSource, locator: `${n.base} ${entry.lemma}` },
            ...(anchors.length ? [{ sourceId: textSource, locator: formatRef(verseToPassage(anchors[0].verse), 'short') }] : []),
          ],
        },
      };
      out.push(kw);
      d.notes.push(
        `${n.base} ${entry.lemma} (${entry.transliteration}, “${kw.basicMeaning}”)${occurrences ? ` — in ${occurrences.total} verses` : ''}${anchors.length ? `, underlined in ${formatRef(verseToPassage(anchors[0].verse))}` : ''}`,
      );
    }
    d.accepted = out.length;
    return { ...d, payload: out.length ? { section: 'original-languages', items: out } : null };
  }

  /**
   * Other uses of a word, stated in key-word prose, must be real and read: every verse the
   * prose mentions (besides the anchor) must contain this lemma — per the concordance — or
   * a lemma whose lexicon entry the card cites (a noun is not its cognate verb), and must
   * have been read in this request (a lexicon entry gives only the address, not what the
   * verse says). Prose that describes other uses ("the same word…", "also used…") must
   * say where.
   */
  private async otherUsesProblem(text: string | undefined, base: string, anchor: VerseRef | undefined, evidence: readonly Evidence[], english = ''): Promise<string | null> {
    if (!text) return null;
    const lexicon = this.deps.providers.lexicon;
    const occ = await safe(() => lexicon.getOccurrences(base));
    const citedLemmas = evidence.filter((e) => e.kind === 'lexicon' && e.strong).map((e) => normalizeStrong(e.strong!)?.base).filter((x): x is string => Boolean(x) && x !== base);
    const citedText = this.views(evidence)
      .map((v) => v.fullText)
      .join('\n');
    const own = new Set(tokenize(english).map(prefixStem));
    const occursIn = async (strong: string, r: PassageRef, known?: Occurrences | null): Promise<boolean> => {
      const o = known ?? (await safe(() => lexicon.getOccurrences(strong)));
      if (!o) return true; // no concordance to check against
      const c2 = r.endChapter ?? r.startChapter;
      if (r.startVerse == null) return o.refs.some((x) => x.book === r.book && x.chapter >= r.startChapter && x.chapter <= c2);
      const verses = refToVerses(r, 200);
      return verses.some((v) => o.refs.some((x) => x.book === v.book && x.chapter === v.chapter && x.verse === v.verse));
    };
    for (const sentence of text.split(/(?<=[.!?;])\s+/)) {
      const mentioned = findReferences(sentence, this.loc).map((f) => f.ref);
      const others = mentioned.filter((r) => !(anchor && r.book === anchor.book && singleVerse(r) && refContains(r, verseToPassage(anchor))));
      // "…is the same word used of Martha’s distraction": what it says about other uses must come from the cited lexicon, or name the verses
      const trigger = OTHER_USES_RE.exec(sentence);
      const clause = trigger ? sentence.slice(trigger.index) : '';
      if (trigger && !findReferences(clause, this.loc).length && !describedByEvidence(clause, citedText, own)) {
        return `describes other uses of ${base} (“${clipWords(clause, 12)}”) that the cited lexicon entry does not describe — name each verse (e.g. “Luke 10:41”; it is checked against the concordance) and read it before saying what it says, or leave the other uses out`;
      }
      const citedLexicon = evidence.filter((e) => e.kind === 'lexicon' && e.strong && normalizeStrong(e.strong)?.base === base);
      const lemmaTestament = base.startsWith('G') ? 'NT' : 'OT';
      for (const r of others) {
        // "always echoing Deuteronomy 24" for a Greek word, or an LXX use the lexicon itself lists: an allusion, not a use in the tagged text
        const crossTestament = tryGetBook(r.book)?.testament !== lemmaTestament;
        if (!crossTestament && !citedLexicon.some((e) => evidenceMentionsRef(e, r)) && !(await occursIn(base, r, occ))) {
          let other = false;
          for (const lemma of citedLemmas) if (await occursIn(lemma, r)) other = true;
          if (!other) {
            return `mentions ${formatRef(r)}, but ${base} does not occur there (the concordance says so) — a related noun or verb is a different word; say where THIS word occurs, or cite the other word’s lexicon entry and name it`;
          }
        }
        const read = this.deps.ledger.all().some((e) => e.kind === 'scripture' && (r.startVerse == null ? evidenceMentionsRef(e, r) : evidenceGivesRef(e, r)));
        if (!read && !crossTestament && !describedByEvidence(sentence, citedText, own)) {
          return `describes ${formatRef(r)}, which you have not read in this request — a lexicon or index entry gives only the address; read it (read_passage) before saying what it says, or leave it out`;
        }
      }
    }
    return null;
  }

  /** A moral or theological verdict ("sinful", "condemned") in lexical guidance, which no cited text states. */
  private verdictProblem(text: string, evidence: readonly Evidence[]): string | null {
    const m = VERDICT_RE.exec(text);
    if (!m) return null;
    const family = VERDICT_FAMILIES.find((f) => f.test(m[0]));
    const hay = this.views(evidence)
      .map((v) => v.fullText)
      .join('\n');
    if (family?.test(hay)) return null;
    return `it passes a moral verdict (“${m[0]}”) that none of the cited texts states — a caution warns against over-reading the word (root fallacy, one sense read into every use), not about sin`;
  }

  /**
   * Content words of a label or anchor phrase that translate a neighbouring tagged word,
   * not this one: “certificate” in “certificate of divorce” for כְּרִיתֻת (H3748, “divorce”)
   * belongs to סֵפֶר (H5612, “a document of”; its lexicon: “certificate of divorce”), the
   * word before it. A word counts only when this word's gloss and lexicon entry lack it
   * and a word within three places of it has it.
   */
  private async borrowedWords(text: string, v: VerseRef, word: OriginalWord, entry: LexiconEntry | null): Promise<{ words: string[]; from: string[] } | null> {
    const other = (entry as { otherSenses?: { gloss?: string }[] } | null)?.otherSenses?.map((s) => s.gloss ?? '').join(' ') ?? '';
    const own = new Set(anchorStems(`${word.gloss} ${entry?.gloss ?? ''} ${other} ${entry?.definition ?? ''}`));
    const candidates = anchorTokens(text).filter((t) => !own.has(t.stem));
    if (!candidates.length) return null;
    const verses = await safe(() => this.deps.providers.originalText.getOriginalText(verseToPassage(v)));
    const words = verses?.find((x) => x.ref.chapter === v.chapter && x.ref.verse === v.verse)?.words ?? [];
    const at = words.findIndex((w) => w.index === word.index);
    if (at < 0) return null;
    const base = normalizeStrong(word.strong)?.base;
    const found: string[] = [];
    const from = new Set<string>();
    for (let i = Math.max(0, at - 3); i <= Math.min(words.length - 1, at + 3); i++) {
      const nb = words[i];
      const nbBase = normalizeStrong(nb.strong)?.base;
      if (i === at || !nbBase || nbBase === base) continue;
      const nbEntry = (nb.extendedStrong ? await safe(() => this.deps.providers.lexicon.getEntry(nb.extendedStrong!)) : null) ?? (await safe(() => this.deps.providers.lexicon.getEntry(nbBase)));
      const have = new Set(anchorStems(`${nb.gloss} ${nbEntry?.gloss ?? ''} ${nbEntry?.definition ?? ''}`));
      for (const c of candidates) {
        if (!have.has(c.stem) || found.includes(c.word)) continue;
        found.push(c.word);
        from.add(`${nbBase} (“${nb.gloss}”)`);
      }
    }
    return found.length ? { words: found, from: [...from] } : null;
  }

  private async originalWord(v: VerseRef, base: string): Promise<OriginalWord | null> {
    const verses = await safe(() => this.deps.providers.originalText.getOriginalText(verseToPassage(v)));
    const words = verses?.find((x) => x.ref.chapter === v.chapter && x.ref.verse === v.verse)?.words ?? [];
    return words.find((w) => normalizeStrong(w.strong)?.base === base) ?? null;
  }

  private async firstInPassage(passage: PassageRef, base: string) {
    const verses = refToVerses(passage, 40);
    if (passage.startVerse == null) return null;
    const original = await safe(() =>
      this.deps.providers.originalText.getOriginalText({
        book: passage.book,
        startChapter: verses[0].chapter,
        startVerse: verses[0].verse,
        endChapter: verses[verses.length - 1].chapter,
        endVerse: verses[verses.length - 1].verse,
      }),
    );
    for (const ov of original ?? []) {
      const word = ov.words.find((w) => normalizeStrong(w.strong)?.base === base);
      if (word) return { verse: ov.ref, word };
    }
    return null;
  }

  private async context(items: readonly unknown[], page: PageInfo): Promise<SectionResult> {
    const d = emptyDecision();
    const out: ContextItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const base = `historical-context item ${i + 1}`;
      const p = this.parse(ContextItemInput, items[i]);
      if (!p.ok) {
        d.rejected.push({ item: base, reason: p.reason });
        continue;
      }
      const it = p.data;
      const label = `${base} (“${it.title}”)`;
      const c = this.cite(it.evidence);
      if (!c.ok) {
        d.rejected.push({ item: label, reason: c.reason });
        continue;
      }
      const problem = await this.firstProblem(
        [
          [it.title, MAX_WORDS.title, 'title'],
          [it.summary, MAX_WORDS.contextSummary, 'summary'],
          [it.detail, MAX_WORDS.detail, 'detail'],
        ],
        c.evidence,
        { page },
      );
      if (problem) {
        d.rejected.push({ item: label, reason: problem });
        continue;
      }
      const related = await this.groundedRefs(it.relatedVerses, c.evidence, page, label, d.warnings);
      d.warnings.push(...c.warnings.map((w) => `${label}: ${w}`));
      const id = this.nextId('cx');
      this.remember(id, c.evidence);
      const verses = related.flatMap((r) => refToVerses(r, MAX_RANGE_VERSES));
      out.push({
        id,
        category: it.category,
        title: it.title,
        summary: it.summary,
        ...(it.detail ? { detail: it.detail } : {}),
        ...(verses.length ? { relatedVerses: verses } : {}),
        tags: [],
        provenance: this.provenance(c.evidence, `${it.summary} ${it.detail ?? ''}`),
      });
    }
    d.accepted = out.length;
    return { ...d, payload: out.length ? { section: 'historical-context', items: out } : null };
  }

  private async citedField(raw: unknown, field: string, maxWords: number, d: Decision, ctx: ProseContext): Promise<ProvenancedText | undefined> {
    if (raw == null) return undefined;
    const p = this.parse(CitedText, raw);
    if (!p.ok) {
      d.rejected.push({ item: field, reason: p.reason });
      return undefined;
    }
    const c = this.cite(p.data.evidence);
    if (!c.ok) {
      d.rejected.push({ item: field, reason: c.reason });
      return undefined;
    }
    const problem = await this.proseProblem(p.data.text, c.evidence, maxWords, field, ctx);
    if (problem) {
      d.rejected.push({ item: field, reason: problem });
      return undefined;
    }
    d.warnings.push(...c.warnings.map((w) => `${field}: ${w}`));
    return this.text(p.data.text, c.evidence);
  }

  private async literary(input: z.infer<typeof AddSectionInput>, page: PageInfo): Promise<SectionResult> {
    const d = emptyDecision();
    let placeInBook = await this.citedField(input.placeInBook, 'placeInBook', MAX_WORDS.explanation, d, { page });
    let argument = await this.citedField(input.argument, 'argument', MAX_WORDS.explanation, d, { page });
    const features: LiteraryFeature[] = [];
    const raw = input.features ?? [];
    for (let i = 0; i < raw.length; i++) {
      const base = `literary feature ${i + 1}`;
      const p = this.parse(FeatureInput, raw[i]);
      if (!p.ok) {
        d.rejected.push({ item: base, reason: p.reason });
        continue;
      }
      const it = p.data;
      const label = `${base} (“${it.title}”)`;
      const c = this.cite(it.evidence);
      if (!c.ok) {
        d.rejected.push({ item: label, reason: c.reason });
        continue;
      }
      const problem = await this.firstProblem(
        [
          [it.title, MAX_WORDS.title, 'title'],
          [it.description, MAX_WORDS.explanation, 'description'],
        ],
        c.evidence,
        { page },
      );
      if (problem) {
        d.rejected.push({ item: label, reason: problem });
        continue;
      }
      const verses = (await this.groundedRefs(it.verses, c.evidence, page, label, d.warnings)).flatMap((r) => refToVerses(r, MAX_RANGE_VERSES));
      d.warnings.push(...c.warnings.map((w) => `${label}: ${w}`));
      const id = this.nextId('lf');
      this.remember(id, c.evidence);
      features.push({ id, type: it.type, title: it.title, description: it.description, ...(verses.length ? { verses } : {}), tags: [], provenance: this.provenance(c.evidence, it.description) });
    }
    if (!placeInBook && argument) {
      placeInBook = argument;
      argument = undefined;
    }
    if (!placeInBook) {
      d.rejected.push({ item: 'literary-context', reason: 'needs placeInBook or argument (with evidence) to anchor the section' });
      return { ...d, payload: null };
    }
    d.accepted = 1 + features.length;
    return { ...d, payload: { section: 'literary-context', literary: { placeInBook, ...(argument ? { argument } : {}), bookOutline: [], features } } };
  }

  private async theology(rawThemes: readonly unknown[], rawSets: readonly unknown[], page: PageInfo): Promise<SectionResult> {
    const d = emptyDecision();
    const themes: TheologyTheme[] = [];
    for (let i = 0; i < rawThemes.length; i++) {
      const base = `theme ${i + 1}`;
      const p = this.parse(ThemeInput, rawThemes[i]);
      if (!p.ok) {
        d.rejected.push({ item: base, reason: p.reason });
        continue;
      }
      const it = p.data;
      const label = `${base} (“${it.title}”)`;
      const c = this.cite(it.evidence);
      if (!c.ok) {
        d.rejected.push({ item: label, reason: c.reason });
        continue;
      }
      const problem = await this.firstProblem(
        [
          [it.title, MAX_WORDS.title, 'title'],
          [it.summary, MAX_WORDS.themeSummary, 'summary'],
          [it.detail, MAX_WORDS.detail, 'detail'],
        ],
        c.evidence,
        { page },
      );
      if (problem) {
        d.rejected.push({ item: label, reason: problem });
        continue;
      }
      const keyVerses = await this.groundedRefs(it.keyVerses, c.evidence, page, label, d.warnings);
      d.warnings.push(...c.warnings.map((w) => `${label}: ${w}`));
      const id = this.nextId('th');
      this.remember(id, c.evidence);
      themes.push({
        id,
        category: it.category,
        title: it.title,
        summary: it.summary,
        ...(it.detail ? { detail: it.detail } : {}),
        keyVerses,
        tags: [],
        provenance: this.provenance(c.evidence, `${it.summary} ${it.detail ?? ''}`),
      });
    }

    const sets: PerspectiveSet[] = [];
    for (let i = 0; i < rawSets.length; i++) {
      const base = `perspectives ${i + 1}`;
      const p = this.parse(PerspectiveInput, rawSets[i]);
      if (!p.ok) {
        d.rejected.push({ item: base, reason: p.reason });
        continue;
      }
      const set = p.data;
      const label = `${base} (“${set.question}”)`;
      const c = this.cite(set.evidence);
      if (!c.ok) {
        d.rejected.push({ item: label, reason: c.reason });
        continue;
      }
      const problem = await this.firstProblem(
        [
          [set.question, MAX_WORDS.question, 'question'],
          [set.intro, MAX_WORDS.intro, 'intro'],
          [set.commonGround, MAX_WORDS.intro, 'commonGround'],
        ],
        c.evidence,
        { page },
      );
      if (problem) {
        d.rejected.push({ item: label, reason: problem });
        continue;
      }
      const positions: TheologicalPerspective[] = [];
      for (let j = 0; j < set.positions.length; j++) {
        const pBase = `${base} position ${j + 1}`;
        const pp = this.parse(PositionInput, set.positions[j]);
        if (!pp.ok) {
          d.rejected.push({ item: pBase, reason: pp.reason });
          continue;
        }
        const pos = pp.data;
        const pLabel = `${pBase} (${pos.tradition})`;
        const pc = this.cite(pos.evidence);
        if (!pc.ok) {
          d.rejected.push({ item: pLabel, reason: pc.reason });
          continue;
        }
        const statements = pc.evidence.filter((e) => STATEMENT_KINDS.has(e.kind));
        if (statements.length === 0) {
          d.rejected.push({
            item: pLabel,
            reason: 'cites only Scripture, lexical or index data — a tradition’s view must rest on a text of that tradition that states it (its confession or catechism, a reference work of that tradition, or one of its authors); search_knowledge with kinds ["confession"] or ["dictionary"] first, or say the knowledge base lacks it',
          });
          continue;
        }
        if (containsUrl(pos.tradition) || wordCount(pos.tradition) > 6) {
          d.rejected.push({ item: pLabel, reason: 'tradition should be the tradition’s name (≤ 6 words), e.g. "Reformed", "Catholic"' });
          continue;
        }
        const grounding = this.positionGrounding(pos.tradition, statements);
        if (!grounding.ok) {
          d.rejected.push({ item: pLabel, reason: grounding.reason });
          continue;
        }
        const pProblem = await this.firstProblem(
          [
            [pos.label, MAX_WORDS.label, 'label'],
            [pos.summary, MAX_WORDS.positionSummary, 'summary'],
          ],
          pc.evidence,
          { page },
        );
        if (pProblem) {
          d.rejected.push({ item: pLabel, reason: pProblem });
          continue;
        }
        const keyTexts = await this.groundedRefs(pos.keyTexts, pc.evidence, page, pLabel, d.warnings);
        d.warnings.push(...pc.warnings.map((w) => `${pLabel}: ${w}`));
        // representatives: only the authors of the texts that represent this tradition
        const representatives = Array.from(new Set(grounding.matched.map((e) => authorOf(e, this.deps.providers)).filter((a): a is string => Boolean(a))));
        const id = this.nextId('pp');
        this.remember(id, pc.evidence);
        positions.push({
          id,
          tradition: pos.tradition,
          label: pos.label,
          summary: pos.summary,
          ...(representatives.length ? { representatives } : {}),
          ...(keyTexts.length ? { keyTexts } : {}),
          provenance: this.provenance(pc.evidence, pos.summary),
        });
      }
      if (positions.length < 2 && set.consensus !== 'consensus') {
        d.rejected.push({ item: label, reason: `needs at least two positions that pass validation (${positions.length} did)` });
        continue;
      }
      if (positions.length === 0) {
        d.rejected.push({ item: label, reason: 'no position passed validation' });
        continue;
      }
      d.warnings.push(...c.warnings.map((w) => `${label}: ${w}`));
      // "Every position holds that …": each position's own texts must say it (eval2: common ground generalised from memory)
      let commonGround = set.commonGround;
      if (commonGround && (!this.deps.locale || this.deps.locale === 'en') && UNIVERSAL_RE.test(commonGround)) {
        const silent = positions.filter((x) => {
          const texts = (this.itemEvidence.get(x.id) ?? []).map((eid) => this.deps.ledger.get(eid)).filter((e): e is Evidence => Boolean(e));
          return !commonGroundStated(commonGround!, texts.map((e) => this.deps.ledger.fullText(e)).join('\n'));
        });
        if (silent.length) {
          d.warnings.push(`${label}: commonGround dropped — it says every position holds it, but the texts cited for ${silent.map((x) => x.tradition).join(', ')} do not state it; write only what each position’s own texts say`);
          commonGround = undefined;
        }
      }
      const id = this.nextId('ps');
      this.remember(id, [...c.evidence, ...positions.flatMap((x) => (this.itemEvidence.get(x.id) ?? []).map((eid) => this.deps.ledger.get(eid)!))]);
      sets.push({
        id,
        question: set.question,
        consensus: set.consensus,
        intro: set.intro,
        perspectives: positions,
        ...(commonGround ? { commonGround } : {}),
        tags: [],
        provenance: this.provenance(c.evidence, `${set.intro} ${commonGround ?? ''}`),
      });
    }
    d.accepted = themes.length + sets.length;
    return { ...d, payload: themes.length || sets.length ? { section: 'theology', themes, perspectives: sets } : null };
  }

  /**
   * Rule 5: a position labelled with a church tradition must cite a text OF that
   * tradition (tagged with it, a confession titled with it, by an author the registry
   * places in it, or an editor-reviewed curated item naming it). A position labelled
   * with a school or interpreter ("Hillel", "Erasmus") must cite a text that names it.
   * Returns the texts that represent the position (their authors become its representatives).
   */
  private positionGrounding(tradition: string, statements: readonly Evidence[]): { ok: true; matched: Evidence[] } | { ok: false; reason: string } {
    const providers = this.deps.providers;
    const authorTradition = (e: Evidence) => {
      const id = authorOf(e, providers);
      return id ? safeSync(() => providers.sources.getAuthor(id))?.tradition : undefined;
    };
    // a publisher's study notes speak for no tradition: never a position of their own ("Tyndale Open Study Notes" beside Catholic and Reformed)
    if (statements.every((e) => isPublisherTradition(authorTradition(e)))) {
      return { ok: false, reason: 'rests only on a publisher’s study notes, which are a source, not a tradition — a perspectives set gives traditions’ own texts (a confession, catechism or one of their authors); use the notes in the context or commentary sections, or leave the position out' };
    }
    // a joint work by authors of different churches ("Presbyterian and Anglican") speaks for neither church alone
    const joint = statements.filter((e) => isJointTradition(authorTradition(e)));
    if (joint.length && familiesOf(tradition).some((f) => traditionFamily(f)?.church)) {
      const alone = statements.filter((e) => !joint.includes(e));
      const fams = alone.flatMap((e) => evidenceFamilies(e, providers, { representative: true }));
      if (!familiesOf(tradition).some((f) => fams.includes(f))) {
        const who = joint.map((e) => safeSync(() => providers.sources.getAuthor(authorOf(e, providers)!))?.name).find(Boolean) ?? 'the cited commentary';
        return { ok: false, reason: `${who} is a joint work by authors of different churches (${authorTradition(joint[0])}), so it cannot stand for “${tradition}” alone — cite that tradition’s own text (its confession, catechism or one of its authors), or label the position by the reading it gives` };
      }
    }
    const named = familiesOf(tradition).filter((f) => traditionFamily(f)?.church);
    if (named.length) {
      const { required, accepted } = requiredFamilies(tradition);
      const need = required.filter((f) => traditionFamily(f)?.church);
      const fams = new Map(statements.map((e) => [e, evidenceFamilies(e, providers, { representative: true })]));
      if (need.length) {
        const missing = need.filter((f) => !statements.some((e) => fams.get(e)!.includes(f)));
        if (missing.length) {
          const publisherOnly = missing.every((f) => statements.some((e) => evidenceFamilies(e, providers).includes(f)));
          if (publisherOnly) {
            return { ok: false, reason: `the cited texts are a publisher’s study notes, which speak for their writers, not for the ${missing.map((f) => traditionFamily(f)?.label ?? f).join(' / ')} tradition — cite that tradition’s own texts (a confession, catechism or one of its authors), or leave the position out (study notes belong in the context or commentary sections, not in a perspectives set)` };
          }
          return { ok: false, reason: this.traditionReason(tradition, missing) };
        }
        return { ok: true, matched: statements.filter((e) => fams.get(e)!.some((f) => need.includes(f))) };
      }
      const matched = statements.filter((e) => fams.get(e)!.some((f) => accepted.includes(f)));
      if (!matched.length && statements.some((e) => evidenceFamilies(e, providers).some((f) => accepted.includes(f)))) {
        return { ok: false, reason: `the cited texts are a publisher’s study notes, which speak for their writers, not for the ${named.map((f) => traditionFamily(f)?.label ?? f).join(' / ')} tradition — cite that tradition’s own texts (a confession, catechism or one of its authors), or leave the position out (study notes belong in the context or commentary sections, not in a perspectives set)` };
      }
      return matched.length ? { ok: true, matched } : { ok: false, reason: this.traditionReason(tradition, named) };
    }
    // a school, an interpreter or a descriptive label: the cited text must name it
    const words = tokenize(tradition).filter((w) => w.length > 3 && !GENERIC_POSITION_WORDS.has(w) && !STOPWORDS.has(w));
    if (words.length === 0) {
      return { ok: false, reason: `“${tradition}” names no tradition, school or interpreter — label the position with the tradition or author whose text states it` };
    }
    const stems = words.map(stem);
    const matched = statements.filter((e) => {
      const have = new Set(tokenize(haystack({ e, fullText: this.deps.ledger.fullText(e) }, providers)).map(stem));
      return stems.some((s) => have.has(s));
    });
    return matched.length
      ? { ok: true, matched }
      : { ok: false, reason: `none of the cited texts names “${tradition}” — label the position with the tradition or author whose text states it, and cite that text` };
  }

  /**
   * "The knowledge base holds no Lutheran or Baptist text on divorce": only after looking.
   * A tradition the knowledge base does hold texts of must have been searched on its own
   * (search_knowledge with `tradition`) or be among the retrieved evidence (eval2: absence
   * claims about held traditions nobody had searched).
   */
  private unsearchedAbsence(text: string): string | null {
    const h = this.deps.holdings;
    if (!h) return null;
    const ledger = this.deps.ledger;
    for (const sentence of sentencesOf(text)) {
      if (!isAbsenceSentence(sentence)) continue;
      const named = [...new Set(traditionWordsIn(sentence).flatMap((w) => familiesOf(w)))].filter((f) => traditionFamily(f)?.church && !traditionFamily(f)?.members);
      const unsearched = h.traditions.filter(
        (t) =>
          named.includes(t.family) &&
          !ledger.searchedTraditions.has(t.family) &&
          !ledger.all().some((e) => evidenceFamilies(e, this.deps.providers, { representative: true }).includes(t.family)),
      );
      if (!unsearched.length) continue;
      const labels = unsearched.map((t) => t.label).join(', ');
      const works = unsearched.flatMap((t) => t.works).slice(0, 4);
      return `says the knowledge base lacks ${labels} texts, but it holds them${works.length ? ` (${works.join('; ')})` : ''} and none has been searched here — search_knowledge with tradition "${unsearched[0].label}" (kinds ["confession"]) first; if nothing on this question comes up, say that no ${labels} text on it came up`;
    }
    return null;
  }

  private traditionReason(tradition: string, families: readonly string[]): string {
    const labels = families.map((f) => traditionFamily(f)?.label ?? f);
    const which = labels.join(' / ');
    const base = `none of the cited texts is a ${which} text — “${tradition}” must rest on that tradition’s own texts (its confession or catechism, a reference work of that tradition, or one of its authors), not on another tradition’s or a general reference work`;
    const h = this.deps.holdings;
    if (!h) return base;
    const held = h.traditions.filter((t) => families.includes(t.family));
    if (!held.length) return `${base}. The knowledge base holds no ${which} texts: leave this position out and say plainly (e.g. in the intro) that the knowledge base lacks them`;
    const works = held.flatMap((t) => t.works).slice(0, 4);
    return `${base}. The knowledge base holds ${which} texts${works.length ? ` (${works.join('; ')})` : ''} — search for them (search_knowledge kinds ["confession"] or ["dictionary"]) and cite one`;
  }

  private async commentary(voices: readonly unknown[], page: PageInfo): Promise<SectionResult> {
    const d = emptyDecision();
    const out: CommentaryEntry[] = [];
    const used = new Set<string>();
    /** passages each accepted voice comments on (parallel to `out`) */
    const voiceRefs: PassageRef[][] = [];
    const { providers } = this.deps;
    for (let i = 0; i < voices.length; i++) {
      const base = `voice ${i + 1}`;
      const p = this.parse(VoiceInput, voices[i]);
      if (!p.ok) {
        d.rejected.push({ item: base, reason: p.reason });
        continue;
      }
      const v = p.data;
      const id0 = normalizeEvidenceId(v.evidence);
      const e = id0 ? this.deps.ledger.get(id0) : undefined;
      const label = `${base} (${v.evidence})`;
      if (!e) {
        d.rejected.push({ item: label, reason: `${v.evidence} is not in this request’s ledger` });
        continue;
      }
      if (this.deps.ledger.isWithheld(e.id)) {
        d.rejected.push({ item: label, reason: `you have not read ${e.id} (its text was not shown) — open it with read_document (\`evidence\`: "${e.id}"), then cite it in a later turn` });
        continue;
      }
      if (this.deps.ledger.firstShownThisTurn(e.id)) {
        d.rejected.push({ item: label, reason: `you had not read ${e.id} when you wrote this: ${SAME_TURN}` });
        continue;
      }
      if (!STATEMENT_KINDS.has(e.kind)) {
        d.rejected.push({ item: label, reason: `${e.id} is ${e.kind} evidence; a voice must be a commentary, study note, confession or dictionary text` });
        continue;
      }
      if (used.has(e.id)) {
        d.warnings.push(`${label}: ${e.id} is already a voice — skipped`);
        continue;
      }
      const authorId = authorOf(e, providers);
      if (!authorId) {
        d.rejected.push({ item: label, reason: `${e.id} has no recorded author (${e.sourceId}), so it cannot be a voice — voices need an item whose header shows “by …”; use this text in a theme, context item or perspectives position instead` });
        continue;
      }
      const source = safeSync(() => providers.sources.getSource(e.sourceId));
      let entryText: string;
      let prov: Provenance;
      let kind: CommentaryEntry['kind'];
      if (v.mode === 'quote') {
        if (!v.quote) {
          d.rejected.push({ item: label, reason: 'mode quote needs `quote`' });
          continue;
        }
        if (!e.quotable || (source && (source.license.usage === 'summary-only' || source.license.usage === 'metadata-only'))) {
          d.rejected.push({ item: label, reason: `${e.id} may not be quoted (its license allows summary only) — use mode summary` });
          continue;
        }
        const n = wordCount(v.quote);
        if (n > MAX_WORDS.quote) {
          d.rejected.push({ item: label, reason: `the quote is ${n} words; quote at most 60` });
          continue;
        }
        if (n < MIN_QUOTE_WORDS) {
          d.rejected.push({ item: label, reason: `the quote is ${n} word${n === 1 ? '' : 's'}; a quotation must be at least a phrase of ${MIN_QUOTE_WORDS} words — quote a full phrase or sentence, or use mode summary` });
          continue;
        }
        const span = findExactSpan(v.quote, this.deps.ledger.fullText(e));
        if (!span) {
          d.rejected.push({ item: label, reason: `the quote is not an exact span of ${e.id} — copy the words exactly or use mode summary` });
          continue;
        }
        entryText = span;
        kind = 'quotation';
        prov = { kind: 'quotation', verification: 'verified', citations: [{ ...toCitation(e, span, this.deps.locale), excerpt: span }] };
      } else {
        if (!v.summary) {
          d.rejected.push({ item: label, reason: 'mode summary needs `summary`' });
          continue;
        }
        const problem = await this.proseProblem(v.summary, [e], MAX_WORDS.voice, 'summary', { page });
        if (problem) {
          d.rejected.push({ item: label, reason: problem });
          continue;
        }
        entryText = v.summary;
        kind = 'summary';
        prov = { kind: 'summary', verification: 'generated', citations: [toCitation(e, v.summary, this.deps.locale)] };
      }
      if (v.lead) {
        const problem = await this.proseProblem(v.lead, [e], MAX_WORDS.lead, 'lead', { page });
        if (problem) {
          d.rejected.push({ item: label, reason: problem });
          continue;
        }
      }
      used.add(e.id);
      const id = this.nextId('cm');
      this.remember(id, [e]);
      const related = (e.refs ?? []).slice(0, 2).flatMap((r) => refToVerses(r, MAX_RANGE_VERSES));
      const shared = voiceRefs.findIndex((refs) => refs.some((a) => (e.refs ?? []).some((b) => refsOverlap(a, b))));
      if (shared >= 0) {
        d.warnings.push(`${label}: another voice (${out[shared].locator ?? out[shared].sourceId}) already comments on this passage — prefer one voice per passage, and a voice on another debated verse`);
      }
      voiceRefs.push([...(e.refs ?? [])]);
      out.push({
        id,
        authorId,
        sourceId: e.sourceId,
        kind,
        text: entryText,
        ...(v.lead ? { lead: v.lead } : {}),
        ...(e.locator ? { locator: e.locator } : {}),
        ...(e.url ? { url: e.url } : {}),
        ...(related.length ? { relatedVerses: related } : {}),
        tags: [],
        provenance: prov,
      });
    }
    d.accepted = out.length;
    return { ...d, payload: out.length ? { section: 'commentary', items: out } : null };
  }

  /* ---------------- finish_page ---------------- */

  async finish(raw: unknown, page: PageInfo): Promise<FinishResult> {
    const d = emptyDecision();
    const p = this.parse(FinishPageInput, stripEvidenceMarkers(raw));
    if (!p.ok) return { ...d, opening: null, concepts: [], suggestedQuestions: [], rejected: [{ item: 'finish_page', reason: p.reason }] };
    const opening = await this.citedField(p.data.opening, 'opening', MAX_WORDS.opening, d, { page });
    if (!opening) return { ...d, opening: null, concepts: [], suggestedQuestions: [] };
    const concepts: Concept[] = [];
    const raws = p.data.concepts ?? [];
    for (let i = 0; i < raws.length; i++) {
      const base = `concept ${i + 1}`;
      const cp = this.parse(ConceptInput, raws[i]);
      if (!cp.ok) {
        d.rejected.push({ item: base, reason: cp.reason });
        continue;
      }
      const it = cp.data;
      const label = `${base} (“${it.label}”)`;
      const c = this.cite(it.evidence);
      if (!c.ok) {
        d.rejected.push({ item: label, reason: c.reason });
        continue;
      }
      const problem = await this.firstProblem(
        [
          [it.label, MAX_WORDS.label, 'label'],
          [it.answer, MAX_WORDS.answer, 'answer'],
        ],
        c.evidence,
        { page },
      );
      if (problem) {
        d.rejected.push({ item: label, reason: problem });
        continue;
      }
      let section: SectionId = it.section;
      if (!['overview', 'scripture', 'sources'].includes(section) && !page.sections.has(section)) {
        d.warnings.push(`${label}: section ${section} is not on the page — using overview`);
        section = 'overview';
      }
      const verses = (await this.groundedRefs(it.verses, c.evidence, page, label, d.warnings)).flatMap((r) => refToVerses(r, MAX_RANGE_VERSES));
      const aliases = Array.from(
        new Set([it.label, ...it.aliases].map((a) => fold(a).trim()).filter((a) => a && a.length <= 60 && !containsUrl(a) && !/["“”«»]/.test(a))),
      );
      const id = this.nextId('cn');
      this.remember(id, c.evidence);
      concepts.push({
        id,
        label: it.label,
        aliases,
        answer: this.text(it.answer, c.evidence),
        primarySection: section,
        verses,
        keyWordIds: [],
        crossReferenceIds: [],
        contextIds: [],
        themeIds: [],
        perspectiveSetIds: [],
        commentaryIds: [],
        literaryFeatureIds: [],
      });
    }
    const suggestedQuestions: string[] = [];
    for (const q of (p.data.suggestedQuestions ?? []).filter((x): x is string => typeof x === 'string').map((x) => x.trim())) {
      const why = await this.questionProblem(q);
      if (why) d.warnings.push(`suggested question dropped (“${q.slice(0, 60)}”): ${why}`);
      else if (suggestedQuestions.length < 6) suggestedQuestions.push(q);
    }
    d.accepted = 1 + concepts.length;
    return { ...d, opening, concepts, suggestedQuestions };
  }

  /**
   * A suggested follow-up question: short, no links, no evidence ids, only references
   * that exist, and a quoted phrase of 4+ words only when it is verbatim in retrieved
   * evidence ("What does 'some indecency' mean?" is fine).
   */
  private async questionProblem(q: string): Promise<string | null> {
    if (!q || q.length > 140) return 'empty or longer than 140 characters';
    if (containsUrl(q)) return 'contains a web address';
    if (/\bE\d{1,4}\b/.test(q)) return 'contains an evidence id';
    const ledger = this.deps.ledger;
    for (const seg of quotedSegments(q, MIN_CHECKED_QUOTE_WORDS)) {
      if (!ledger.all().some((e) => findExactSpan(seg, ledger.fullText(e)))) return 'contains a quotation that is not in the retrieved evidence';
    }
    if (pseudoReferences(q, this.deps.locale).length || (await this.deps.refs.proseProblems(q, this.deps.locale)).length) return 'mentions a reference that does not exist';
    return null;
  }

  /* ---------------- reply (follow-up answers) ---------------- */

  async reply(raw: unknown, ctx: ProseContext = {}): Promise<ReplyResult> {
    const d = emptyDecision();
    const p = this.parse(ReplyInput, stripEvidenceMarkers(raw));
    if (!p.ok) return { ...d, reply: null, rejected: [{ item: 'reply', reason: p.reason }] };
    const input = p.data;
    const declined = input.declined === true;
    const c = this.cite(input.evidence ?? [], declined);
    if (!c.ok) return { ...d, reply: null, rejected: [{ item: 'reply', reason: `${c.reason} (set declined: true if the knowledge base cannot answer)` }] };
    d.warnings.push(...c.warnings);
    const problem =
      declined && c.evidence.length === 0
        ? this.declineProblem(input.text, ctx.readerText ?? '')
        : await this.proseProblem(input.text, c.evidence, MAX_WORDS.reply, 'text', { ...ctx, ...(ctx.page?.voiceAuthors ? { pageAuthors: ctx.page.voiceAuthors } : {}) });
    if (problem) return { ...d, reply: null, rejected: [{ item: 'reply', reason: problem }] };
    let focus: { section: SectionId; verses: VerseRef[] } | undefined;
    if (input.focus) {
      const verses: VerseRef[] = [];
      for (const r of input.focus.verses ?? []) {
        const parsed = await this.deps.refs.parse(r);
        if (parsed.ok) verses.push(...refToVerses(parsed.ref, MAX_RANGE_VERSES));
        else d.warnings.push(`focus: dropped ${parsed.reason}`);
      }
      focus = { section: input.focus.section, verses };
    }
    const suggestions: string[] = [];
    for (const s of (input.suggestions ?? []).map((x) => x.trim())) {
      const why = await this.questionProblem(s);
      if (why) d.warnings.push(`suggestion dropped (“${s.slice(0, 60)}”): ${why}`);
      else if (suggestions.length < 4) suggestions.push(s);
    }
    d.accepted = 1;
    return {
      ...d,
      reply: {
        text: input.text,
        citations: c.evidence.map((e) => toCitation(e, input.text, this.deps.locale)),
        evidenceIds: c.evidence.map((e) => e.id),
        provenance: this.provenance(c.evidence, input.text),
        ...(focus ? { focus } : {}),
        suggestions,
        declined,
      },
    };
  }

  /**
   * A declined answer without evidence may only say what the knowledge base lacks: at
   * most two sentences, no Bible references, no dates, no quotations, no links, and no
   * authors or works the reader did not name themselves.
   */
  private declineProblem(text: string, readerText: string): string | null {
    const how = 'a declined answer without evidence may only say what the knowledge base lacks (≤ 2 sentences); to add what it does hold, cite evidence ids';
    const words = wordCount(text);
    const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => /\p{L}/u.test(s)).length;
    if (words > MAX_WORDS.decline || sentences > 2) return `${how} (this one has ${sentences} sentences, ${words} words)`;
    if (containsUrl(text)) return `${how} — no links`;
    if (/\bE\d{1,4}\b/.test(text)) return `${how} — no evidence ids`;
    if (findReferences(text, this.loc).length || pseudoReferences(text, this.deps.locale).length) return `${how} — no Bible references`;
    if (yearsIn(text).length) return `${how} — no dates`;
    if (quotedSegments(text, 2).length) return `${how} — no quotations`;
    const names = namesIn(text, this.deps.providers.sources)
      .map((n) => n.token)
      .filter((t) => !new RegExp(`(?<![\\p{L}])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'iu').test(readerText));
    if (names.length) return `${how} — do not name authors or works the reader did not ask about (${names.join(', ')})`;
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type WordAnchor = KeyWord['anchors'][number];

/**
 * Evidence-id markers the model put in reader-facing text: "[E3]", "[E3, E14]", "(E7)",
 * "(see E3)", "(cf. E3–E5)".
 */
const EVIDENCE_MARKER = /\s*[[(]\s*(?:(?:[Ss]ee|[Cc]f\.?|[Pp]er|[Ff]rom)\s+)?E\d{1,4}(?:\s*(?:[,;–—-]|and|&)\s*E?\d{1,4})*\s*[\])]/g;

/**
 * Evidence ids belong in the `evidence` fields, not in what the reader sees: remove
 * bracketed markers ("[E3]", "(see E3)", "(E3–E5)") from every string of a tool input
 * (except the evidence fields themselves). Returns a copy. Bare ids left in prose
 * ("E4 says…") are rejected by the prose checks.
 */
export function stripEvidenceMarkers<T>(value: T): T {
  const walk = (v: unknown, key?: string): unknown => {
    if (typeof v === 'string') {
      if (key === 'evidence' || v.search(EVIDENCE_MARKER) < 0) return v;
      // only where a marker was removed: "slight pretences [E1]; Tyndale…" → "slight pretences; Tyndale…"
      return v.replace(EVIDENCE_MARKER, (m, offset: number, all: string) => (/[.,;:!?)]/.test(all[offset + m.length] ?? '') ? '' : ' ')).replace(/ {2,}/g, ' ').trim();
    }
    if (Array.isArray(v)) return key === 'evidence' ? v : v.map((x) => walk(x));
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v)) out[k] = walk(x, k);
      return out;
    }
    return v;
  };
  return walk(value) as T;
}

/** Prose that says a word is used elsewhere ("the same word", "also used of …"): it must say where. */
const OTHER_USES_RE = /\b(?:the same (?:word|verb|noun|term|root|lemma)|also used|used elsewhere|elsewhere (?:in|it|the)|other uses|also (?:describes|appears|occurs))\b/i;

/** Words that frame a statement about a word's uses without saying anything about them. */
const USE_FILLER = new Set([
  'used', 'use', 'uses', 'word', 'verb', 'noun', 'term', 'root', 'lemma', 'same', 'also', 'elsewhere', 'other', 'describes', 'describe', 'appears',
  'occurs', 'sense', 'senses', 'meaning', 'greek', 'hebrew', 'here', 'there', 'where', 'both', 'either', 'lexicon', 'lexicons', 'lists', 'list',
  'listed', 'notes', 'note', 'gives', 'entry', 'shows', 'like', 'such',
]);

/** A 4-letter prefix stem: "washings" ~ "wash", "cares" ~ "care" (loose on purpose — this only asks whether the evidence talks about it). */
function prefixStem(w: string): string {
  const s = stem(w.toLowerCase());
  return s.length > 4 ? s.slice(0, 4) : s;
}

/** Words two passages must share in a row for one to be called a quotation of the other. */
const QUOTATION_RUN = 3;

/** A claim about every position of a set ("All sides read…", "Each tradition cited holds…", "Both…"). */
const UNIVERSAL_RE = /\b(?:all|every|each|both|none|neither)\b/i;
/** Words that frame a common-ground sentence rather than state its content. */
const COMMON_FRAME = new Set(['all', 'every', 'each', 'both', 'none', 'neither', 'position', 'positions', 'tradition', 'traditions', 'text', 'texts', 'side', 'sides', 'cited', 'hold', 'holds', 'agree', 'agrees', 'affirm', 'affirms', 'teach', 'teaches', 'read', 'reads', 'say', 'says', 'church', 'churches', 'christian', 'christians', 'view', 'views', 'share', 'shares', 'common', 'ground']);

/** Does a position's own text state (at least half the content words of) the common ground? */
function commonGroundStated(commonGround: string, evidenceText: string): boolean {
  const words = tokenize(commonGround).filter((t) => /^[a-z]+$/.test(t) && t.length > 2 && !STOPWORDS.has(t) && !COMMON_FRAME.has(t) && !familiesOf(t).length);
  const content = [...new Set(words.map(prefixStem))];
  if (content.length < 2) return true;
  const have = new Set(tokenize(evidenceText).map(prefixStem));
  return content.filter((w) => have.has(w)).length / content.length >= 0.5;
}

/** Does the cited evidence describe what this clause says (at least half its content words appear there)? */
function describedByEvidence(clause: string, evidenceText: string, own: ReadonlySet<string>): boolean {
  const words = tokenize(clause).filter((t) => /^[a-z]+$/.test(t) && t.length > 2 && !STOPWORDS.has(t) && !USE_FILLER.has(t) && !findBook(t));
  const content = words.map(prefixStem).filter((w) => !own.has(w));
  if (!content.length) return true;
  const have = new Set(tokenize(evidenceText).map(prefixStem));
  return content.filter((w) => have.has(w)).length / content.length >= 0.5;
}

/** Moral or theological verdicts that do not belong in lexical guidance unless a cited text makes them. */
const VERDICT_RE = /\b(?:sin|sins|sinful|sinning|condemn(?:s|ed|ation)?|forbid(?:s|den)?|wicked(?:ness)?|guilt(?:y)?|disobedien(?:t|ce)|unbelie(?:f|ving))\b/i;

/** Word families of VERDICT_RE: the cited texts must use the same family for the verdict to stand. */
const VERDICT_FAMILIES = [/\bsin(?:s|ful|fulness|ned|ning|ner|ners)?\b/i, /\bcondemn/i, /\bforb[ia]d/i, /\bwicked/i, /\bguilt/i, /\bdisobe/i, /\bunbelie/i];

/** Capitalised function words before a bare chapter:verse ("In 7:15 …"): a verse without its book. */
const BARE_VERSE_WORDS = new Set(['in', 'at', 'from', 'see', 'cf', 'compare', 'unlike', 'and', 'but', 'both', 'by', 'on', 'of', 'with', 'after', 'before', 'until', 'as', 'like', 'here', 'there', 'then', 'verse', 'verses', 'v', 'vv']);

/** Words before "24:5" that number a document, not a book ("Confession 24:5", "Session 24:7"). */
const DOCUMENT_WORDS = new Set(['confession', 'catechism', 'article', 'articles', 'canon', 'canons', 'session', 'chapter', 'question', 'section', 'part', 'book', 'vol', 'volume', 'answer', 'day', 'lecture', 'sermon', 'homily', 'letter', 'epistle', 'q', 'ch', 'art', 'sess']);

/**
 * Chapter-and-verse citations of something that is not a book of the Bible
 * ("Hezekiah 3:16", "Tobit 99:1") — the reference parser ignores them, so prose could
 * otherwise carry them.
 */
export function pseudoReferences(text: string, locale?: Locale): string[] {
  const s = text.replace(/[‐-―−]/g, '-').replace(/\s+/g, ' ').trim();
  const real = findReferences(s, { locale }).map((f) => [f.index, f.index + f.match.length] as const);
  const out: string[] = [];
  for (const m of s.matchAll(/(?<![\p{L}\d])((?:[1-3]\s?)?\p{Lu}[\p{L}]+\.?)\s+(\d{1,3}):(\d{1,3})/gu)) {
    const at = m.index ?? 0;
    if (real.some(([a, b]) => at < b && a < at + m[0].length)) continue;
    const name = m[1].replace(/\.$/, '');
    if (DOCUMENT_WORDS.has(name.toLowerCase()) || findBook(name, locale)) continue;
    out.push(m[0].trim());
  }
  return out;
}

/** Words of a text for wording comparisons: lower case, curly quotes folded, punctuation dropped. */
function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/'s\b/g, '')
    .split(/[^a-z0-9']+/)
    .map((w) => w.replace(/^'+|'+$/g, ''))
    .filter(Boolean);
}

/** Pronouns and negations: wording that decides who does what to whom, and whether it happens. */
const ROLE_WORDS = new Set(['i', 'me', 'my', 'we', 'us', 'our', 'you', 'your', 'ye', 'thou', 'thee', 'thy', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'it', 'its', 'not', 'no', 'never', 'nor']);

/** Words that do not make a 4-word run distinctive (on top of STOPWORDS). */
const ECHO_FILLER = new Set(['not', 'no', 'has', 'have', 'had', 'hath', 'unto', 'shall', 'will', 'one', 'man', 'thing', 'things', 'thee', 'thou', 'thy', 'ye']);

function clipWords(text: string, max: number): string {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  return words.length <= max ? words.join(' ') : `${words.slice(0, max).join(' ')}…`;
}

/** The repair message for a claim word the cited evidence does not support. */
function claimReason(p: ClaimProblem): string {
  switch (p.kind) {
    case 'era':
      return `places the text in an era (“${p.term}”) that none of the cited evidence names — dates and periods come from the evidence only (cite the item that says it, or leave it out)`;
    case 'debate':
      return `says interpreters or traditions disagree (“${p.term}”), but none of the cited evidence states that disagreement — cite the texts that show it (a note that says it is debated, or the differing texts themselves), or leave it out`;
    case 'generalisation':
      return `generalises (“${p.term}”) beyond the cited evidence — say what the evidence says (e.g. the passages a lexicon lists), or cite an item that makes the generalisation`;
    case 'aspect':
      return `reads meaning into the Greek tense or aspect (“${p.term}”), which none of the cited evidence says — if a commentary makes that reading, cite it and attribute it (“JFB takes the aorist as…”), otherwise leave it out`;
    case 'rendering':
      return `says how translations render a word (${p.term}), but those renderings are not in the cited evidence or the Scripture you read — read the verse in that translation (read_passage with translation) or cite the item that gives them`;
  }
}

function emptyDecision(): Decision {
  return { accepted: 0, rejected: [], warnings: [], notes: [] };
}

/** Citation built from an evidence item: source, locator and URL come from the evidence only. */
export function toCitation(e: Evidence, claim: string, locale?: Locale): Citation {
  return {
    sourceId: e.sourceId,
    ...(e.locator ? { locator: e.locator } : {}),
    ...(e.url ? { url: e.url } : {}),
    note: e.title,
    excerpt: (e.kind === 'scripture' ? namedVerses(e, claim, locale) : null) ?? bestExcerpt(e.text, claim),
  };
}

/**
 * For Scripture evidence: the verses the claim names ("… in 1 Corinthians 7:15"), as they
 * appear in the evidence (verse-numbered lines), so the citation shows the verse the
 * claim is about rather than the best word overlap. Null when the claim names none of them.
 */
function namedVerses(e: Evidence, claim: string, locale?: Locale): string | null {
  const books = new Set((e.refs ?? []).map((r) => r.book));
  const wanted = new Set<string>();
  for (const f of findReferences(claim, { locale })) {
    if (!books.has(f.ref.book) || f.ref.startVerse == null) continue;
    for (const v of refToVerses(f.ref, 12)) wanted.add(`${v.chapter}:${v.verse}`);
  }
  if (!wanted.size) return null;
  // "7:15 But if…" (a passage) or "1 Corinthians 7:15 But if…" (verses of a rare word)
  const lines = e.text.split('\n').filter((l) => wanted.has(/^(?:[1-3]?\s?\p{L}[\p{L} ]*\s)?(\d+:\d+)\s/u.exec(l)?.[1] ?? ''));
  if (!lines.length) return null;
  const words = lines.join(' ').split(/\s+/);
  return words.length > 80 ? `${words.slice(0, 80).join(' ')}…` : words.join(' ');
}

async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return (await fn()) ?? null;
  } catch {
    return null;
  }
}

function safeSync<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

/** "to release: divorce" → "to release; divorce" */
function basicMeaning(gloss: string): string {
  const parts = gloss
    .split(':')
    .map((p) => p.trim())
    .filter(Boolean);
  const unique = parts.filter((p, i) => parts.findIndex((q) => q.toLowerCase() === p.toLowerCase()) === i);
  return unique.length ? unique.join('; ') : displayGloss(gloss);
}

function contentStems(text: string): string[] {
  return tokenize(text)
    .filter((t) => /^[a-z]+$/.test(t) && t.length > 2 && !STOPWORDS.has(t))
    .map(stem);
}

/** Is a sense the model wrote actually stated by the lexicon (most of its content words appear there)? */
function senseGrounded(sense: string, lexiconText: string): boolean {
  const words = tokenize(sense).filter((t) => !STOPWORDS.has(t) && t.length > 2);
  if (words.length === 0) return false;
  const lex = new Set(tokenize(lexiconText).map(stem));
  const hits = words.filter((w) => lex.has(stem(w))).length;
  return hits / words.length >= 0.6;
}

/** A sense line a reader can use: English, a gloss-like phrase — not a lexicographer's note ("used alone in the same sense", "only in phrase …"). */
function usableSense(s: string): boolean {
  if (/[Ͱ-Ͽἀ-῿֐-׿]/.test(s)) return false;
  if (/\b(?:used|same sense|see|cf|compare|in phrase|only in|in cl|lxx|metaphorically of|with ref)\b/i.test(s)) return false;
  return contentStems(s).length > 0 && wordCount(s) <= MAX_WORDS.sense;
}

/** The parts of a lexicon entry's glosses, its other senses' included ("to release: divorce" → "to release", "divorce"). */
function glossParts(entry: LexiconEntry): string[] {
  const other = (entry as { otherSenses?: { gloss?: string }[] }).otherSenses?.map((s) => s.gloss ?? '') ?? [];
  const out: string[] = [];
  for (const gloss of [entry.gloss, ...other]) {
    for (const raw of gloss.split(/[:;/,]/)) {
      const part = raw.replace(/_/g, ' ').trim();
      if (part && usableSense(part) && !out.includes(part)) out.push(part);
    }
  }
  return out;
}

/** The lexicon's own senses when the model's are not grounded: usable definition lines, else the gloss split into its parts. */
/**
 * Known scanning slips in the lexicon's senses, fixed for display (the lexicon data itself
 * is regenerated upstream): “a question, au inquiry” (Abbott-Smith, G1906) → “an inquiry”.
 */
export function cleanSense(sense: string): string {
  return sense.replace(/\bau (?=[aeiou])/gi, (m) => (m[0] === 'A' ? 'An ' : 'an '));
}

function lexiconFallbackSenses(entry: LexiconEntry): string[] {
  const fromDefinition = lexiconSenses(entry.definition, 6).filter(usableSense).slice(0, 4);
  if (fromDefinition.length) return fromDefinition;
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const raw of entry.gloss.split(/[:;/,]/)) {
    const part = raw.replace(/_/g, ' ').trim();
    const key = contentStems(part).join(' ');
    if (!part || !key || seen.has(key) || !usableSense(part)) continue;
    seen.add(key);
    parts.push(part);
  }
  return parts;
}

/**
 * Does an anchor phrase translate the word? It must share a content word (by stem) with
 * the word's contextual gloss in that verse or with its lexicon entry (gloss, other
 * senses, definition). A phrase of function words only ("you", "him") is accepted.
 */
export function phraseTranslatesWord(phrase: string, word: OriginalWord, entry: LexiconEntry | null): boolean {
  const wanted = anchorStems(phrase);
  // a phrase of function words only ("you", "him") anchors a word whose gloss is one too — never an auxiliary for a verb ("has" for “has bee under bondage”)
  if (wanted.length === 0) return anchorStems(word.gloss).length === 0;
  const other = (entry as { otherSenses?: { gloss?: string }[] } | null)?.otherSenses?.map((s) => s.gloss ?? '').join(' ') ?? '';
  const have = new Set(anchorStems(`${word.gloss} ${entry?.gloss ?? ''} ${other} ${entry?.definition ?? ''}`));
  // derivational variants of one English word ("formless" for the gloss “formlessness”): a shared start of 6+ letters
  return wanted.some((s) => have.has(s) || (s.length >= 6 && [...have].some((h) => h.length >= 6 && (h.startsWith(s) || s.startsWith(h)))));
}

/**
 * Auxiliaries and negators carry no meaning of their own in an anchor phrase or a gloss
 * ("has bee under bondage", "is not bound"): matching on them would let "has" pass as a
 * rendering and would reject "is not bound".
 */
const ANCHOR_STOP = new Set(['has', 'have', 'had', 'hath', 'not', 'no', 'bee', 'been', 'being', 'shall', 'will', 'would', 'should', 'let', 'make', 'made', 'thing', 'one']);

/** Irregular English forms a lexicon gloss and the BSB may use for the same word ("bound" ~ "bondage"). */
const IRREGULAR: Record<string, string> = Object.fromEntries(
  (
    'bind:bound,bond,bondage,binding,binds;loose:loosed,loosen,loosing;give:gave,given,gift;take:took,taken;bear:bore,borne,born;' +
    'speak:spoke,spoken,speech;hide:hid,hidden;rise:rose,risen;seek:sought;teach:taught;buy:bought;sell:sold;tell:told;fall:fell,fallen;' +
    'eat:ate,eaten;write:wrote,written;choose:chose,chosen;know:knew,known;go:went,gone;see:saw,seen;begin:began,begun;drink:drank,drunk;' +
    'flee:fled;lead:led;feed:fed;hold:held;stand:stood;send:sent;keep:kept;leave:left;sleep:slept;weep:wept;strike:struck;' +
    'forsake:forsook,forsaken;bring:brought;think:thought;fight:fought;catch:caught;dwell:dwelt;slay:slew,slain;die:dead,death,dying;' +
    'live:life,living,alive;free:freedom,freed;slave:enslave,enslaved,slavery,servitude;marry:married,marriage;divorce:divorced,divorces;' +
    'forgive:forgave,forgiven,forgiveness;believe:belief,faith;judge:judgment,judgement;save:salvation,saved;love:loved,beloved'
  )
    .split(';')
    .flatMap((group) => {
      const [base, forms] = group.split(':');
      return [[base, stem(base)], ...forms.split(',').map((f) => [f, stem(base)])];
    }),
);

/** Content stems of a phrase for anchor matching: no stopwords or auxiliaries; irregular forms folded to one key. */
function anchorStems(text: string): string[] {
  return anchorTokens(text).map((t) => t.stem);
}

/** The content words of a phrase with their anchor-matching stems. */
function anchorTokens(text: string): { word: string; stem: string }[] {
  return tokenize(text)
    .filter((t) => /^[a-z]+$/.test(t) && t.length > 2 && !STOPWORDS.has(t) && !ANCHOR_STOP.has(t))
    .map((t) => ({ word: t, stem: IRREGULAR[t] ?? stem(t) }));
}

/** The BSB words that render a contextual gloss ("to divorce" → "divorce"), for a repair hint (never an auxiliary). */
export function suggestPhrase(bsb: string, gloss: string): string | null {
  const wanted = new Set(anchorStems(gloss));
  if (!wanted.size) return null;
  const words = bsb.match(/[\p{L}’'-]+/gu) ?? [];
  const hit = words.filter((w) => {
    const t = w.toLowerCase();
    return /^[a-z]+$/.test(t) && !STOPWORDS.has(t) && !ANCHOR_STOP.has(t) && wanted.has(IRREGULAR[t] ?? stem(t));
  });
  return hit.length ? hit.slice(0, 3).join(' ') : null;
}

/**
 * The part of an anchor phrase that renders the word itself: from its first to its last
 * word that shares a stem with the word's gloss or lexicon entry ("worry about your life" →
 * "worry" when "life" renders ψυχή; "the pledge of a clear conscience" → "pledge"). Null
 * when none does, or when a neighbour's word sits inside what is left.
 */
export function trimBorrowed(phrase: string, borrowed: readonly string[], word: OriginalWord, entry: LexiconEntry | null): string | null {
  const other = (entry as { otherSenses?: { gloss?: string }[] } | null)?.otherSenses?.map((s) => s.gloss ?? '').join(' ') ?? '';
  const own = new Set(anchorStems(`${word.gloss} ${entry?.gloss ?? ''} ${other} ${entry?.definition ?? ''}`));
  const drop = new Set(borrowed.map((w) => w.toLowerCase()));
  const tokens = phrase.trim().split(/\s+/);
  const isOwn = (t: string) => anchorStems(t).some((x) => own.has(x));
  const a = tokens.findIndex(isOwn);
  if (a < 0) return null;
  let z = tokens.length;
  while (z > a && !isOwn(tokens[z - 1])) z--;
  const kept = tokens.slice(a, z);
  if (kept.some((t) => drop.has(t.toLowerCase().replace(/[^\p{L}’'-]/gu, '')))) return null;
  return kept.join(' ').replace(/[.,;:!?]+$/, '');
}

/** The phrase as written in the verse (keeps the verse's own casing and punctuation). */
function exactPhrase(verse: string, phrase: string): string {
  return findExactSpan(phrase, verse) ?? phrase;
}

/** A registry tradition naming the different churches of a joint work's authors ("Presbyterian and Anglican"). */
export function isJointTradition(tradition: string | undefined | null): boolean {
  return Boolean(tradition && /\band\b|&/.test(tradition) && familiesOf(tradition).filter((f) => traditionFamily(f)?.church).length >= 2);
}
