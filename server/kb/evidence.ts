/**
 * Evidence drafts: how each kind of retrieved item is presented to the model.
 *
 * Text policy. `EvidenceDraft.text` is what the model reads and what quotations are
 * checked against. Long items are excerpted (search hits ≤ ~700 characters, commentary
 * sections ≤ ~900, topical entries ≤ ~1,400, lexicon entries ≤ ~1,600, cut at sentence
 * boundaries around the query’s terms, the cuts marked “[…]”), so a research call stays
 * readable and cheap.
 * The complete retrieved text of every excerpted item is kept here and returned by
 * `evidenceFullText(draft)`, for a validator that wants to accept a verbatim span from
 * the whole document — the text is still retrieved, never generated — and for
 * read_document, which opens an item's whole text by its evidence id.
 */
import { getBook } from '../../src/domain/books';
import type { BookId, PassageRef, VerseRef } from '../../src/domain/models';
import { formatRef, formatVerse, parseRefKey, refKey, refsOverlap, verseToPassage } from '../../src/domain/reference';
import type { EvidenceDraft } from '../../src/inference/protocol';
import type { LocalLexiconEntry, LocalOccurrences, LocalOriginalVerse, LocalPassage } from '../../src/providers/local/types';
import type { SourceRegistry } from '../../src/providers/types';
import { isQuotable, type KbIndexDoc } from './documents';
import { excerptAround, queryTerms, trimAtSentence } from './text';

/** A lexicon entry. */
export const EXCERPT_CHARS = 1600;
/** A search hit (a dictionary article, a confession, a note…): enough to judge and cite it; read_document opens the rest. */
export const SEARCH_EXCERPT_CHARS = 700;
/** A commentary section (with `query`, the part on that point). */
export const COMMENTARY_EXCERPT_CHARS = 900;
/** A topical-index entry: its reference groups, those on the point first (the least-cited kind). */
export const TOPIC_CHARS = 1400;
/** The most of one item's text a research result shows (the ledger's cut; verse-by-verse texts keep more). */
export const ITEM_CHARS = 2000;
/**
 * An opened part of a long text or a book-introduction section: excerpted around the
 * query within ITEM_CHARS (the “[…]” marks included), so the ledger never cuts its tail.
 */
export const PART_EXCERPT_CHARS = ITEM_CHARS - 4;

/* ------------------------------------------------------------------ */
/* Full text of excerpted items                                        */
/* ------------------------------------------------------------------ */

/**
 * Full text per draft OBJECT: the ledger reads it once when it numbers the draft
 * (synchronously, in the same request), after which the draft — and its full text —
 * is garbage-collected. No process-wide cache, no cross-request coupling, and two
 * documents with the same title (e.g. Tyndale notes on one range) can never lend each
 * other their text.
 */
const FULL_TEXT = new WeakMap<EvidenceDraft, string>();

/** Record the complete text behind an excerpted draft (no-op when nothing was cut). */
export function rememberFullText(draft: EvidenceDraft, full: string): void {
  if (full === draft.text) return;
  FULL_TEXT.set(draft, full);
}

/**
 * The complete retrieved text of an evidence draft: the whole document/section when
 * the knowledge base excerpted it, otherwise the draft's own text. Pass the draft
 * object the knowledge base returned (copies — e.g. ledger `Evidence` — carry only
 * their own text; the ledger keeps the full text it read at numbering time).
 */
export function evidenceFullText(e: Pick<EvidenceDraft, 'text'>): string {
  return FULL_TEXT.get(e as EvidenceDraft) ?? e.text;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function parseRefs(keys: readonly string[] | undefined): PassageRef[] {
  const out: PassageRef[] = [];
  for (const k of keys ?? []) {
    const r = parseRefKey(k);
    if (r) out.push(r);
  }
  return out;
}

function assign(d: EvidenceDraft, extra: Partial<Pick<EvidenceDraft, 'locator' | 'url' | 'authorId' | 'strong' | 'tradition'>> & { refs?: PassageRef[] }): EvidenceDraft {
  if (extra.locator) d.locator = extra.locator;
  if (extra.tradition) d.tradition = extra.tradition;
  if (extra.url) d.url = extra.url;
  if (extra.authorId) d.authorId = extra.authorId;
  if (extra.strong) d.strong = extra.strong;
  if (extra.refs?.length) d.refs = extra.refs;
  return d;
}

/** Quotable by licence: public-domain / openly licensed works (full-text or excerpt usage); curated items keep their own flag. */
export function docQuotable(doc: KbIndexDoc, sources: SourceRegistry): boolean {
  return doc.corpus === 'curated' ? doc.quotable : isQuotable(sources, doc.sourceId);
}

/* ------------------------------------------------------------------ */
/* Index documents                                                     */
/* ------------------------------------------------------------------ */

/** A search hit as evidence: long texts excerpted around the query terms; topical entries via topicalEvidence. */
export function docEvidence(doc: KbIndexDoc, sources: SourceRegistry, terms: ReadonlySet<string>, max = SEARCH_EXCERPT_CHARS, focus?: PassageRef): EvidenceDraft {
  if (doc.aspects?.length) return topicalEvidence(doc, sources, terms, TOPIC_CHARS, focus);
  const cut = excerptAround(doc.text, terms, max);
  const draft = assign(
    { kind: doc.kind, title: doc.title, text: cut.text, sourceId: doc.sourceId, quotable: docQuotable(doc, sources) },
    { locator: doc.locator, url: doc.url, authorId: doc.authorId, strong: doc.strong, tradition: doc.tradition, refs: parseRefs(doc.refs) },
  );
  if (cut.trimmed) rememberFullText(draft, doc.text);
  return draft;
}

/** The first `max` references of a group, always including those that cite the focus passage (source order kept). */
function groupRefs(refs: PassageRef[], max: number, focus?: PassageRef): PassageRef[] {
  if (refs.length <= max) return refs;
  if (!focus) return refs.slice(0, max);
  const hit = new Set(refs.filter((r) => r.book === focus.book && refsOverlap(r, focus)).slice(0, max));
  const keep = new Set(hit);
  for (const r of refs) {
    if (keep.size >= max) break;
    keep.add(r);
  }
  return refs.filter((r) => keep.has(r));
}

function aspectLine(label: string, refs: PassageRef[], maxRefs = 40, focus?: PassageRef): string {
  const shown = groupRefs(refs, maxRefs, focus).map((r) => formatRef(r));
  const more = refs.length > shown.length ? `; … (${refs.length - shown.length} more)` : '';
  return `${label}: ${shown.join('; ')}${more}`;
}

/**
 * A topical-index entry: its labelled reference groups. When the entry is too long
 * to show whole (Nave’s JESUS, THE CHRIST runs to 80,000 characters), the groups
 * citing the `focus` passage come first, then those whose labels match the query,
 * then the largest groups; the labels of the groups left out are listed so the
 * model can ask for them. `refs` lists only the references shown.
 */
export function topicalEvidence(doc: KbIndexDoc, sources: SourceRegistry, terms: ReadonlySet<string>, max = TOPIC_CHARS, focus?: PassageRef): EvidenceDraft {
  const aspects = (doc.aspects ?? []).map((a, i) => ({ i, label: a.label, refs: parseRefs(a.refs) }));
  const seeAlsoFull = /^See also: .*$/m.exec(doc.text)?.[0];
  const seeAlso = seeAlsoFull && seeAlsoFull.length > 400 ? `${seeAlsoFull.slice(0, seeAlsoFull.lastIndexOf(';', 400))}; …` : seeAlsoFull;
  let text: string;
  let shownRefs: PassageRef[];
  if (doc.text.length <= max) {
    text = doc.text;
    shownRefs = aspects.flatMap((a) => a.refs);
  } else {
    // query words that name the entry itself ("prayer" in PRAYER) say nothing about which group matters
    const own = new Set(queryTerms(doc.heading ?? doc.title));
    const wanted = [...terms].filter((t) => !own.has(t));
    const matches = (label: string) => {
      let n = 0;
      for (const w of label.toLowerCase().split(/[^\p{L}\p{N}]+/u)) if (w && wanted.some((t) => w.startsWith(t))) n++;
      return n;
    };
    const cites = (refs: PassageRef[]) => (focus && refs.some((r) => r.book === focus.book && refsOverlap(r, focus)) ? 1 : 0);
    const priority = (a: (typeof aspects)[number]) => cites(a.refs) * 2 + (matches(a.label) ? 1 : 0);
    const ranked = [...aspects].sort((a, b) => priority(b) - priority(a) || b.refs.length - a.refs.length || a.i - b.i);
    const chosen: typeof aspects = [];
    // room for the list of omitted groups and the see-also line
    let size = 450 + (seeAlso?.length ?? 0);
    for (const a of ranked) {
      const line = aspectLine(a.label, a.refs, 25, focus);
      if (size + line.length > max && chosen.length) continue;
      chosen.push(a);
      size += line.length + 1;
    }
    // prioritised groups first, the rest in the entry's own order
    chosen.sort((a, b) => priority(b) - priority(a) || a.i - b.i);
    const picked = new Set(chosen);
    const omitted = aspects.filter((a) => !picked.has(a));
    let others = '';
    if (omitted.length) {
      const labels = [...new Set(omitted.map((a) => a.label))];
      let list = '';
      for (const l of labels) {
        if (list.length + l.length > 380) {
          list += '; …';
          break;
        }
        list += `${list ? '; ' : ''}${l}`;
      }
      others = `[${omitted.length} further group${omitted.length === 1 ? '' : 's'} not shown: ${list}]`;
    }
    text = [...chosen.map((a) => aspectLine(a.label, a.refs, 25, focus)), ...(others ? [others] : []), ...(seeAlso ? [seeAlso] : [])].join('\n');
    shownRefs = chosen.flatMap((a) => groupRefs(a.refs, 25, focus));
  }
  const draft = assign(
    { kind: doc.kind, title: doc.title, text, sourceId: doc.sourceId, quotable: docQuotable(doc, sources) },
    { locator: doc.locator, url: doc.url, authorId: doc.authorId, refs: dedupeRefs(shownRefs) },
  );
  rememberFullText(draft, doc.text);
  return draft;
}

function dedupeRefs(refs: PassageRef[]): PassageRef[] {
  const seen = new Set<string>();
  return refs.filter((r) => {
    const k = refKey(r);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Scripture                                                           */
/* ------------------------------------------------------------------ */

export const MAX_PASSAGE_VERSES = 60;

/** Verse-numbered text ("19:3 Some Pharisees came…"), one verse per line, section headings as "§ …" lines. */
export function passageEvidence(passage: LocalPassage, requested: PassageRef, sources: SourceRegistry): EvidenceDraft | null {
  const lines: string[] = [];
  let count = 0;
  let first: VerseRef | null = null;
  let last: VerseRef | null = null;
  let total = 0;
  for (const ch of passage.chapters) total += ch.verses.length;
  outer: for (const ch of passage.chapters) {
    if (ch.superscription && count < MAX_PASSAGE_VERSES) lines.push(`${ch.chapter}:0 (title) ${ch.superscription}`);
    for (const v of ch.verses) {
      if (count >= MAX_PASSAGE_VERSES) break outer;
      if (v.heading) lines.push(`§ ${v.heading}`);
      lines.push(`${v.ref.chapter}:${v.ref.verse} ${v.text}`);
      first ??= v.ref;
      last = v.ref;
      count++;
    }
  }
  if (!first || !last) return null;
  const shown: PassageRef = { book: requested.book, startChapter: first.chapter, startVerse: first.verse, endChapter: last.chapter, endVerse: last.verse };
  if (total > count) lines.push(`[Only the first ${MAX_PASSAGE_VERSES} of ${total} verses are shown (${formatRef(shown)}); request a later range to read on.]`);
  const source = sources.getSource(passage.sourceId);
  return assign(
    {
      kind: 'scripture',
      title: `${formatRef(total > count ? shown : requested)} (${passage.translation})`,
      text: lines.join('\n'),
      sourceId: passage.sourceId,
      quotable: source ? isQuotable(sources, passage.sourceId) : true,
    },
    { locator: formatRef(total > count ? shown : requested), refs: [total > count ? shown : requested] },
  );
}

export const MAX_ORIGINAL_VERSES = 12;

/**
 * Tagged words, one verse per line, compact enough for a dozen verses:
 *   ἀπολύσῃ (apolusē G630 “may divorce” V-AAS-3S)
 * The parsing is the edition's morphology code (Robinson-style for Greek, ETCBC-style
 * for Hebrew); the validator hydrates full lexical data from the lexicon anyway.
 */
export function originalTextEvidence(verses: LocalOriginalVerse[], requested: PassageRef, sources: SourceRegistry): EvidenceDraft | null {
  if (!verses.length) return null;
  const shownVerses = verses.slice(0, MAX_ORIGINAL_VERSES);
  const language = shownVerses.some((v) => v.language === 'greek') ? 'Greek' : shownVerses.every((v) => v.language === 'aramaic') ? 'Aramaic' : 'Hebrew';
  const lines = [`Each word: surface (transliteration, Strong’s number, “contextual gloss”, morphology code)`];
  for (const v of shownVerses) {
    const words = v.words.map((w) => `${w.surface} (${[w.transliteration, w.strong, `“${w.gloss}”`, w.morph].filter(Boolean).join(' ')})`);
    lines.push(`${formatVerse(v.ref, 'short')}${v.language === 'aramaic' && language !== 'Aramaic' ? ' [Aramaic]' : ''}: ${words.join(' ')}`);
  }
  const firstRef = shownVerses[0].ref;
  const lastRef = shownVerses[shownVerses.length - 1].ref;
  const shown: PassageRef = { book: firstRef.book, startChapter: firstRef.chapter, startVerse: firstRef.verse, endChapter: lastRef.chapter, endVerse: lastRef.verse };
  if (verses.length > shownVerses.length) lines.push(`[Only the first ${MAX_ORIGINAL_VERSES} of ${verses.length} verses are shown.]`);
  const sourceId = shownVerses[0].sourceId;
  const refLabel = verses.length > shownVerses.length ? shown : requested;
  return assign(
    {
      kind: 'original-text',
      title: `${language} text of ${formatRef(refLabel)} (${sources.getSource(sourceId)?.title ?? sourceId})`,
      text: lines.join('\n'),
      sourceId,
      quotable: isQuotable(sources, sourceId),
    },
    { locator: formatRef(refLabel), refs: [refLabel] },
  );
}

/* ------------------------------------------------------------------ */
/* Lexicon & concordance                                               */
/* ------------------------------------------------------------------ */

function occurrenceSummary(occ: LocalOccurrences | null): string | null {
  if (!occ) return null;
  return `Occurs in ${occ.total} verse${occ.total === 1 ? '' : 's'} (${occ.wordCount} word${occ.wordCount === 1 ? '' : 's'}) of the tagged text.`;
}

/** "to release: divorce" → "divorce"; "divorce" → "divorce" (the sense STEPBible distinguishes). */
export function senseGloss(gloss: string): string {
  const i = gloss.indexOf(':');
  return (i >= 0 ? gloss.slice(i + 1) : gloss).replace(/_/g, ' ').trim();
}

/** One lexicon entry (a sense of a Strong’s number) with its frequency and the other senses. */
export function lexiconEvidence(entry: LocalLexiconEntry, occ: LocalOccurrences | null, sources: SourceRegistry, extra?: { senseFrequency?: number }): EvidenceDraft {
  const pos = entry.partOfSpeech ? ` · ${entry.partOfSpeech}` : '';
  const lines = [
    `${entry.lemma} (${entry.transliteration}), ${entry.strong}${entry.extendedStrong && entry.extendedStrong !== entry.strong ? ` — sense ${entry.extendedStrong}` : ''}: “${entry.gloss}”${pos}`,
  ];
  const freq = extra?.senseFrequency ?? entry.frequency;
  const occLine = occurrenceSummary(occ);
  if (occLine || freq) {
    lines.push(`Frequency: ${[occLine, freq && entry.otherSenses?.length ? `this sense is tagged ${freq}×.` : null].filter(Boolean).join(' ')}`);
  }
  if (entry.otherSenses?.length) lines.push(`Other senses: ${entry.otherSenses.map((o) => `${o.extendedStrong} “${o.gloss}”`).join('; ')}`);
  lines.push('', entry.definition.trim());
  const text = lines.join('\n');
  const cut = trimAtSentence(text, EXCERPT_CHARS);
  const title = `${entry.lemma} (${entry.transliteration}, ${entry.strong}) — “${senseGloss(entry.gloss)}”`;
  const draft = assign(
    { kind: 'lexicon', title, text: cut.text, sourceId: entry.sourceId, quotable: isQuotable(sources, entry.sourceId) },
    { locator: entry.extendedStrong && entry.extendedStrong !== entry.strong ? `${entry.strong} (sense ${entry.extendedStrong})` : entry.strong, strong: entry.strong },
  );
  if (cut.trimmed) rememberFullText(draft, text);
  return draft;
}

function refsByBook(refs: VerseRef[]): string {
  const counts = new Map<BookId, number>();
  for (const r of refs) counts.set(r.book, (counts.get(r.book) ?? 0) + 1);
  return [...counts].map(([b, n]) => `${getBook(b).name} ${n}`).join(', ');
}

/** Where a lemma occurs: totals, spread by book, the first verses, and per-sense verses when the lemma has several senses. */
export function occurrencesEvidence(
  strong: string,
  entry: LocalLexiconEntry | null,
  all: LocalOccurrences,
  senses: { extendedStrong: string; gloss: string; occ: LocalOccurrences }[],
  limit: number,
  sources: SourceRegistry,
): EvidenceDraft {
  const name = entry ? `${entry.lemma} (${entry.transliteration}, ${strong})` : strong;
  const lines = [
    `${name} occurs in ${all.total} verse${all.total === 1 ? '' : 's'} (${all.wordCount} word${all.wordCount === 1 ? '' : 's'}) of the tagged text.`,
    `By book: ${refsByBook(all.refs)}`,
    `${all.refs.length > limit ? `First ${limit}` : 'Verses'}: ${all.refs.slice(0, limit).map((r) => formatVerse(r, 'short')).join('; ')}${all.refs.length > limit ? '; …' : ''}`,
  ];
  for (const s of senses) {
    lines.push(`Sense ${s.extendedStrong} “${s.gloss}” (${s.occ.total} verse${s.occ.total === 1 ? '' : 's'}): ${s.occ.refs.slice(0, 15).map((r) => formatVerse(r, 'short')).join('; ')}${s.occ.refs.length > 15 ? '; …' : ''}`);
  }
  const shown = all.refs.slice(0, limit).map(verseToPassage);
  return assign(
    { kind: 'occurrences', title: `Occurrences of ${name}`, text: lines.join('\n'), sourceId: all.sourceId, quotable: isQuotable(sources, all.sourceId) },
    { locator: strong, strong, refs: shown },
  );
}

/* ------------------------------------------------------------------ */
/* Cross-references                                                    */
/* ------------------------------------------------------------------ */

export interface XrefTarget {
  from: VerseRef;
  target: PassageRef;
  votes: number;
}

export function crossReferenceEvidence(from: PassageRef, targets: XrefTarget[], sourceId: string, sources: SourceRegistry): EvidenceDraft {
  const text = [
    `Cross-references for ${formatRef(from)} (OpenBible.info community votes; the dataset lists related passages but does not explain them), best first:`,
    targets.map((t) => `${formatRef(t.target)} (${t.votes} vote${t.votes === 1 ? '' : 's'})`).join('; '),
  ].join('\n');
  const q = encodeURIComponent(formatRef(from, 'short').replace(/–/g, '-')).replace(/%20/g, '+');
  return assign(
    { kind: 'cross-references', title: `Cross-references for ${formatRef(from)} (OpenBible.info)`, text, sourceId, quotable: isQuotable(sources, sourceId) },
    { locator: formatRef(from), url: `https://www.openbible.info/labs/cross-references/search?q=${q}`, refs: [from, ...targets.map((t) => t.target)] },
  );
}

/* ------------------------------------------------------------------ */
/* Commentary                                                          */
/* ------------------------------------------------------------------ */

export function commentaryEvidence(input: {
  commentaryId: string;
  commentaryName: string;
  sectionRef: PassageRef;
  requested: PassageRef;
  text: string;
  sourceId: string;
  authorId?: string;
  sources: SourceRegistry;
  max?: number;
  /** excerpt around these processed query terms instead of from the top */
  terms?: ReadonlySet<string>;
  /** the whole section when `text` is already a part of it */
  fullText?: string;
}): EvidenceDraft {
  const { sources } = input;
  const author = input.authorId ? sources.getAuthor(input.authorId) : undefined;
  const isTyndale = input.commentaryId === 'tyndale';
  let name = input.commentaryName;
  if (input.commentaryId === 'matthew-henry' && input.authorId && input.authorId !== 'matthew-henry') {
    const book = getBook(input.sectionRef.book).name;
    name = input.authorId === 'henry-continuators' ? `${name} (${book} completed by Henry’s continuators)` : `${name} (${book} by ${author?.name ?? input.authorId})`;
  }
  const title = isTyndale ? `Tyndale note on ${formatRef(input.sectionRef)}` : `${name} on ${formatRef(input.sectionRef)}`;
  const max = input.max ?? COMMENTARY_EXCERPT_CHARS;
  const cut = input.terms?.size ? excerptAround(input.text, input.terms, max) : input.text.length > max ? trimAtSentence(input.text, max) : { text: input.text, trimmed: false };
  const draft = assign(
    { kind: isTyndale ? 'study-note' : 'commentary', title, text: cut.text, sourceId: input.sourceId, quotable: isQuotable(sources, input.sourceId) },
    { locator: `on ${formatRef(input.sectionRef, 'short')}`, authorId: input.authorId, refs: [input.sectionRef] },
  );
  const full = input.fullText ?? input.text;
  if (cut.trimmed || full !== cut.text) rememberFullText(draft, full);
  return draft;
}

/** Does a section's passage overlap the requested one (same book)? */
export function overlaps(a: PassageRef, b: PassageRef): boolean {
  return a.book === b.book && refsOverlap(a, b);
}
