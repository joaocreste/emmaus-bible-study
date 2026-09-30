/**
 * Research tools (model-facing, read-only). Every result is numbered evidence in the
 * request's ledger; the model can cite only those ids. Inputs are validated with zod
 * (tool input is streamed eagerly, so the API does not validate it for us).
 */
import { z } from 'zod';
import type { PassageRef, PipelineStep, TranslationId } from '../../src/domain/models';
import { findBook, getBook } from '../../src/domain/books';
import { formatRef, parseReference } from '../../src/domain/reference';
import { BIBLE_VERSIONS } from '../../src/domain/translations';
import type { EvidenceDraft, EvidenceKind } from '../../src/inference/protocol';
import { isQuotable } from '../kb/documents';
import { familiesOf, traditionFamily } from '../kb/traditions';
import type { DocumentParts, KbHoldings, KnowledgeBase } from '../kb/types';
import type { EvidenceLedger, LedgerEntry } from './ledger';
import type { BetaTool } from './modelClient';
import type { RefChecker } from './refs';
import { strongBase } from '../../src/engine/text';

/** Every version the knowledge base holds (the same list for every request, so the tool definitions stay byte-stable for prompt caching). */
const TRANSLATION_IDS = BIBLE_VERSIONS.map((v) => v.id) as [TranslationId, ...TranslationId[]];

export const RESEARCH_TOOL_NAMES = [
  'search_knowledge',
  'find_topics',
  'read_passage',
  'original_text',
  'lexicon',
  'word_occurrences',
  'cross_references',
  'commentary',
  'book_introduction',
  'read_document',
] as const;
export type ResearchToolName = (typeof RESEARCH_TOOL_NAMES)[number];

export function isResearchTool(name: string): name is ResearchToolName {
  return (RESEARCH_TOOL_NAMES as readonly string[]).includes(name);
}

const EVIDENCE_KINDS = [
  'scripture',
  'original-text',
  'lexicon',
  'occurrences',
  'cross-references',
  'study-note',
  'book-introduction',
  'commentary',
  'topical-index',
  'dictionary',
  'confession',
  'curated',
] as const satisfies readonly EvidenceKind[];

const COMMENTARY_IDS = ['tyndale', 'calvin', 'matthew-henry', 'jfb', 'keil-delitzsch'] as const;

/* ------------------------------------------------------------------ */
/* Tool definitions (stable order and wording: they are part of the cached prefix) */
/* ------------------------------------------------------------------ */

const REFERENCE_DESC = 'A Bible reference in plain text, e.g. "Matthew 19:3–9", "Deuteronomy 24", "1 Corinthians 7:10–16".';

export const RESEARCH_TOOLS: BetaTool[] = [
  {
    name: 'search_knowledge',
    description:
      'Full-text search of the knowledge base: Tyndale study notes and book introductions, Bible dictionaries and encyclopedias, Nave’s and Torrey’s topical indexes, creeds/confessions/catechisms, curated Emmaus studies and lexicon glosses (which works and traditions it holds is listed in the system prompt). Call it early for any topic or question, and with `kinds` to find a tradition’s own texts (kinds ["confession"], ["dictionary"]) before writing perspectives — with `tradition` to search one tradition’s texts at a time — or with `reference` to find notes on a passage.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Words to search for, e.g. "divorce remarriage adultery".' },
        kinds: { type: 'array', items: { type: 'string', enum: [...EVIDENCE_KINDS] }, description: 'Restrict to these evidence kinds.' },
        reference: { type: 'string', description: `Only items about passages overlapping this reference. ${REFERENCE_DESC}` },
        tradition: { type: 'string', description: 'Only texts of this church tradition, e.g. "Lutheran", "Eastern Orthodox", "Catholic", "Baptist", "Methodist" — search each tradition of a perspectives set in turn.' },
        limit: { type: 'integer', description: 'Maximum results, 1–12 (default 8).' },
      },
      required: ['query'],
    },
  },
  {
    name: 'find_topics',
    description:
      'Look a subject up in Nave’s Topical Bible and Torrey’s New Topical Textbook (topics with their groups of references) and in the curated Emmaus topic index. Call it first for any topic or question (e.g. "divorce", "anxiety", "baptism") to find the passages the topical indexes list.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'The subject, e.g. "divorce".' } },
      required: ['query'],
    },
  },
  {
    name: 'read_passage',
    description: `Read the verse-numbered text of one or more passages (at most 8 passages and 60 verses in one call; one call counts once against the budget). Call it for every passage you will feature, explain or quote — pass them together in \`references\`. ${REFERENCE_DESC}`,
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: {
        references: { type: 'array', items: { type: 'string' }, description: `Passages to read, e.g. ["Deuteronomy 24:1–4", "Matthew 19:3–12"]. ${REFERENCE_DESC}` },
        reference: { type: 'string', description: 'One passage (alternative to `references`).' },
        translation: { type: 'string', enum: [...TRANSLATION_IDS], description: 'Default: the reader’s translation.' },
      },
    },
  },
  {
    name: 'original_text',
    description:
      'The tagged Hebrew/Aramaic/Greek words of up to 12 verses (one or several passages in one call): surface form, transliteration, Strong’s number, contextual gloss and parsing. Call it on the key verses before choosing key words; only Strong’s numbers found here or in `lexicon` results can become key words.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: {
        references: { type: 'array', items: { type: 'string' }, description: `Key verses, at most 12 verses in total, e.g. ["Deuteronomy 24:1", "Matthew 19:9"]. ${REFERENCE_DESC}` },
        reference: { type: 'string', description: 'One passage (alternative to `references`).' },
      },
    },
  },
  {
    name: 'lexicon',
    description:
      'Lexicon entries (STEPBible TBESG/TBESH) by Strong’s number ("G630", "H3748") or by English meaning ("divorce", "put away"), with occurrence counts. Call it for every word you may feature as a key word, and with the English topic word to discover the Hebrew and Greek terms.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'A Strong’s number or an English word/phrase.' } },
      required: ['query'],
    },
  },
  {
    name: 'word_occurrences',
    description: 'Where a Hebrew or Greek lemma occurs (verse count and the first references). Call it to see how a key word is used elsewhere.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: { strong: { type: 'string', description: 'Strong’s number, e.g. "G630".' } },
      required: ['strong'],
    },
  },
  {
    name: 'cross_references',
    description:
      'Community-voted cross-references for a passage (OpenBible.info, seeded from the Treasury of Scripture Knowledge), best first. They are not explained: read the targets before explaining a connection. Call it for passage studies.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: { reference: { type: 'string', description: REFERENCE_DESC } },
      required: ['reference'],
    },
  },
  {
    name: 'commentary',
    description:
      'Tyndale Open Study Notes plus public-domain commentary (Calvin, Matthew Henry and continuators, Jamieson-Fausset-Brown, Keil & Delitzsch) on a passage. Call it on the central passages; its texts are the voices for the commentary section.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: {
        reference: { type: 'string', description: REFERENCE_DESC },
        sources: {
          type: 'array',
          items: { type: 'string', enum: [...COMMENTARY_IDS] },
          description: 'Only these commentaries (default: all available for the book).',
        },
        query: { type: 'string', description: 'Optional words for the point you need (e.g. "plurality of persons Trinity"): long sections are then excerpted where they discuss it instead of from the top.' },
      },
      required: ['reference'],
    },
  },
  {
    name: 'book_introduction',
    description: 'The Tyndale introduction to a book of the Bible (author, date, setting, purpose, structure), split into sections. Call it for passage studies and for historical or literary context.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: { book: { type: 'string', description: 'Book name, e.g. "Matthew", "1 Corinthians".' } },
      required: ['book'],
    },
  },
  {
    name: 'read_document',
    description:
      'Open other parts of a long text the knowledge base holds in parts — an encyclopedia article, a sermon, a long dictionary entry (a search result’s header ends “(part 4)” and the result says how many parts it has). Give the title as the header shows it, without the part number, and either `parts` (at most 4 part numbers) or `query` (the parts that best match those words); every call also lists each part’s opening words. Use it to read the part of an article on the exact disputed point (e.g. how a tradition reads the other side’s key text).',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'The text’s title, e.g. "The Catholic Encyclopedia (1907–1914) — Divorce (in Moral Theology), 1909".' },
        parts: { type: 'array', items: { type: 'integer' }, description: 'Part numbers to open, at most 4.' },
        query: { type: 'string', description: 'Words to find the matching parts by, e.g. "Pauline privilege 1 Corinthians 7:15".' },
      },
      required: ['title'],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Input schemas                                                       */
/* ------------------------------------------------------------------ */

const text = z.string().trim().min(1).max(300);
/** Passages per read_passage / original_text call, and verses per call. */
const MAX_PASSAGES = 8;
const MAX_PASSAGE_VERSES = 60;
const MAX_ORIGINAL_VERSES = 12;
const INPUTS = {
  search_knowledge: z.object({
    query: text,
    kinds: z.array(z.enum(EVIDENCE_KINDS)).max(12).optional(),
    reference: text.optional(),
    tradition: text.optional(),
    limit: z.number().int().min(1).max(12).optional(),
  }),
  find_topics: z.object({ query: text }),
  read_passage: z
    .object({ reference: text.optional(), references: z.array(text).min(1).max(MAX_PASSAGES).optional(), translation: z.enum(TRANSLATION_IDS).optional() })
    .refine((x) => Boolean(x.reference || x.references?.length), { message: 'give `references` (a list) or `reference`', path: ['references'] }),
  original_text: z
    .object({ reference: text.optional(), references: z.array(text).min(1).max(MAX_PASSAGES).optional() })
    .refine((x) => Boolean(x.reference || x.references?.length), { message: 'give `references` (a list) or `reference`', path: ['references'] }),
  lexicon: z.object({ query: text }),
  word_occurrences: z.object({ strong: text }),
  cross_references: z.object({ reference: text }),
  commentary: z.object({ reference: text, sources: z.array(z.enum(COMMENTARY_IDS)).max(5).optional(), query: text.optional() }),
  book_introduction: z.object({ book: text }),
  read_document: z.object({ title: text, parts: z.array(z.number().int().min(1).max(500)).max(4).optional(), query: text.optional() }),
} satisfies Record<ResearchToolName, z.ZodType>;

/* ------------------------------------------------------------------ */
/* Execution                                                           */
/* ------------------------------------------------------------------ */

export interface ResearchContext {
  kb: KnowledgeBase;
  ledger: EvidenceLedger;
  refs: RefChecker;
  translation: TranslationId;
}

export interface PreparedCall {
  step: PipelineStep;
  /** fetch from the knowledge base (may run concurrently with other calls) */
  fetch(): Promise<EvidenceDraft[]>;
  /** what to say when nothing was found */
  empty: string;
  /** a fact to add to the result either way (e.g. "the knowledge base holds no Eastern Orthodox texts") */
  note?: string;
  /** text computed from what was fetched, added to the result (navigation, not evidence: e.g. which results have more parts) */
  after?: (drafts: readonly EvidenceDraft[]) => string | null;
}

export type PrepareResult = { ok: true; call: PreparedCall } | { ok: false; error: string };

const KIND_SOURCES: Partial<Record<EvidenceKind, string>> = {
  'topical-index': 'Nave’s and Torrey’s topical indexes',
  dictionary: 'the Bible dictionaries and encyclopedias',
  confession: 'the creeds and confessions',
  'study-note': 'Tyndale’s study notes',
  'book-introduction': 'Tyndale’s book introductions',
  commentary: 'the classic commentaries',
  curated: 'the Emmaus curated studies',
  lexicon: 'the lexicons',
  scripture: 'Scripture',
};

const COMMENTARY_NAMES: Record<(typeof COMMENTARY_IDS)[number], string> = {
  tyndale: 'Tyndale’s note',
  calvin: 'Calvin',
  'matthew-henry': 'Matthew Henry',
  jfb: 'Jamieson-Fausset-Brown',
  'keil-delitzsch': 'Keil & Delitzsch',
};

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function providerId(provider: { id?: string } | undefined, fallback: string): string {
  return typeof provider?.id === 'string' ? provider.id : fallback;
}

function verseSpan(ref: PassageRef, verseCount: (c: number) => Promise<number | null>): Promise<number> {
  const c2 = ref.endChapter ?? ref.startChapter;
  return (async () => {
    let total = 0;
    for (let c = ref.startChapter; c <= c2; c++) {
      const n = (await verseCount(c)) ?? 0;
      const from = c === ref.startChapter && ref.startVerse != null ? ref.startVerse : 1;
      let to = n;
      if (c === c2 && ref.endVerse != null) to = ref.endVerse;
      else if (c === ref.startChapter && ref.startVerse != null && ref.endVerse == null && ref.endChapter == null) to = ref.startVerse;
      total += Math.max(0, to - from + 1);
    }
    return total;
  })();
}

function zodMessage(error: z.ZodError): string {
  return error.issues
    .slice(0, 4)
    .map((i) => `${i.path.join('.') || 'input'}: ${i.message}`)
    .join('; ');
}

/** Validate a research call and describe it for the live progress list; nothing is fetched yet. */
export async function prepareResearchCall(name: ResearchToolName, rawInput: unknown, ctx: ResearchContext): Promise<PrepareResult> {
  const parsed = INPUTS[name].safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: `Invalid input for ${name} (${zodMessage(parsed.error)}). Input received: ${JSON.stringify(rawInput)}` };
  const { kb, refs } = ctx;
  const p = kb.providers;
  const ref = async (raw: string) => {
    const r = await refs.parse(raw);
    return r;
  };

  switch (name) {
    case 'search_knowledge': {
      const input = parsed.data as z.infer<(typeof INPUTS)['search_knowledge']>;
      let within: PassageRef | undefined;
      if (input.reference) {
        const r = await ref(input.reference);
        if (!r.ok) return { ok: false, error: r.reason };
        within = r.ref;
      }
      const where = input.kinds?.length
        ? joinNames(Array.from(new Set(input.kinds.map((k) => KIND_SOURCES[k] ?? k))))
        : 'the knowledge base';
      const holdings = safeHoldings(kb);
      const traditions = input.tradition ? familiesOf(input.tradition).filter((f) => traditionFamily(f)?.church) : [];
      if (input.tradition && !traditions.length) return { ok: false, error: `“${input.tradition}” is not a church tradition the knowledge base tags (e.g. "Lutheran", "Reformed", "Catholic", "Eastern Orthodox", "Anglican", "Baptist", "Methodist")` };
      const note = missingTraditionNote(input.tradition ? `${input.tradition} ${input.query}` : input.query, holdings);
      const label = traditions.map((f) => traditionFamily(f)?.label ?? f).join(' / ');
      return {
        ok: true,
        call: {
          step: { stage: 'Search', detail: `Searching ${label ? `${label} texts in ` : ''}${where} for “${input.query}”${within ? ` on ${formatRef(within)}` : ''}`, provider: 'kb:search' },
          fetch: () => {
            for (const f of traditions) ctx.ledger.searchedTraditions.add(f);
            return kb.search(input.query, { kinds: input.kinds, limit: input.limit ?? 8, ...(within ? { within } : {}), ...(traditions.length ? { traditions } : {}) });
          },
          empty: traditions.length
            ? `No ${label} texts${input.kinds?.length ? ` in ${input.kinds.join(', ')}` : ''} match “${input.query}”${within ? ` on ${formatRef(within)}` : ''} — try the older words those texts use, or say plainly that the knowledge base holds no ${label} text on this question.`
            : emptySearchMessage(input.query, input.kinds, within, holdings),
          ...(note ? { note } : {}),
          after: (drafts) => [morePartsNote(kb, drafts), traditions.length ? null : otherTraditionsNote(kb, input.kinds, drafts, holdings)].filter(Boolean).join('\n') || null,
        },
      };
    }
    case 'find_topics': {
      const input = parsed.data as z.infer<(typeof INPUTS)['find_topics']>;
      return {
        ok: true,
        call: {
          step: { stage: 'Topics', detail: `Looking up “${input.query}” in Nave’s Topical Bible and Torrey’s`, provider: 'kb:topics' },
          fetch: () => kb.topics(input.query, 6),
          empty: `No topical-index entry for “${input.query}”. Try a related word (e.g. a synonym or the broader subject).`,
        },
      };
    }
    case 'read_passage': {
      const input = parsed.data as z.infer<(typeof INPUTS)['read_passage']>;
      const list = await parseList(input.references ?? [input.reference!], refs);
      if (!list.ok) return { ok: false, error: list.error };
      const verses = await totalVerses(list.refs, refs);
      if (verses > MAX_PASSAGE_VERSES) {
        return { ok: false, error: `read_passage reads at most ${MAX_PASSAGE_VERSES} verses per call; ${list.refs.map((r) => formatRef(r)).join('; ')} has ${verses}. Ask for the parts you need (or split them over two calls).` };
      }
      const translation = input.translation ?? ctx.translation;
      const names = list.refs.map((r) => formatRef(r)).join('; ');
      return {
        ok: true,
        call: {
          step: { stage: 'Scripture', detail: `Reading ${names} (${translation})`, provider: providerId(p.scripture, 'local:scripture') },
          fetch: async () => {
            const drafts = await Promise.all(list.refs.map((r) => kb.passage(r, translation)));
            return drafts.filter((d): d is EvidenceDraft => d != null);
          },
          empty: `${names} ${list.refs.length === 1 ? 'is' : 'are'} not available in ${translation}.`,
        },
      };
    }
    case 'original_text': {
      const input = parsed.data as z.infer<(typeof INPUTS)['original_text']>;
      const list = await parseList(input.references ?? [input.reference!], refs);
      if (!list.ok) return { ok: false, error: list.error };
      const verses = await totalVerses(list.refs, refs);
      const names = list.refs.map((r) => formatRef(r)).join('; ');
      if (verses > MAX_ORIGINAL_VERSES) return { ok: false, error: `original_text accepts at most ${MAX_ORIGINAL_VERSES} verses; ${names} has ${verses}. Ask for the key verses only.` };
      const langs = new Set(list.refs.map((r) => (getBook(r.book).testament === 'NT' ? 'Greek' : 'Hebrew')));
      return {
        ok: true,
        call: {
          step: { stage: 'Original text', detail: `Reading the ${[...langs].join(' and ')} text of ${names}`, provider: providerId(p.originalText, 'local:original-text') },
          fetch: async () => {
            const drafts = await Promise.all(list.refs.map((r) => kb.originalText(r)));
            return drafts.filter((d): d is EvidenceDraft => d != null);
          },
          empty: `No tagged original text is available for ${names}.`,
        },
      };
    }
    case 'lexicon': {
      const input = parsed.data as z.infer<(typeof INPUTS)['lexicon']>;
      const isStrong = /^[GH]\s*0*\d{1,5}[A-Z]?$/i.test(input.query.trim());
      const query = isStrong ? strongBase(input.query) : input.query;
      return {
        ok: true,
        call: {
          step: {
            stage: 'Lexicon',
            detail: isStrong ? `Looking up ${query} in the lexicon` : `Looking up “${query}” in the Hebrew and Greek lexicons`,
            provider: providerId(p.lexicon, 'local:lexicon'),
          },
          fetch: async () => {
            const drafts = await kb.lexicon(query, 6);
            // a rare word: the verses it occurs in, so what they say can be cited rather than recalled
            const verses = isStrong && drafts.length ? await occurrenceVerses(kb, query, ctx.translation, RARE_LEXICON_VERSES) : null;
            return verses ? [...drafts, verses] : drafts;
          },
          empty: `No lexicon entry for “${query}”.`,
        },
      };
    }
    case 'word_occurrences': {
      const input = parsed.data as z.infer<(typeof INPUTS)['word_occurrences']>;
      if (!/^[GH]\s*0*\d{1,5}[A-Z]?$/i.test(input.strong.trim())) return { ok: false, error: `“${input.strong}” is not a Strong’s number (e.g. "G630", "H3748").` };
      const strong = strongBase(input.strong);
      return {
        ok: true,
        call: {
          step: { stage: 'Lexicon', detail: `Finding where ${strong} occurs`, provider: providerId(p.lexicon, 'local:lexicon') },
          fetch: async () => {
            const d = await kb.occurrences(strong, 40);
            if (!d) return [];
            const verses = await occurrenceVerses(kb, strong, ctx.translation, RARE_OCCURRENCE_VERSES);
            return verses ? [d, verses] : [d];
          },
          empty: `No occurrences found for ${strong}.`,
        },
      };
    }
    case 'cross_references': {
      const input = parsed.data as z.infer<(typeof INPUTS)['cross_references']>;
      const r = await ref(input.reference);
      if (!r.ok) return { ok: false, error: r.reason };
      return {
        ok: true,
        call: {
          step: { stage: 'Cross-references', detail: `Finding cross-references for ${formatRef(r.ref)}`, provider: providerId(p.crossReferences, 'local:xrefs') },
          fetch: () => kb.crossReferences(r.ref, 20),
          empty: `No cross-references are recorded for ${formatRef(r.ref)}.`,
        },
      };
    }
    case 'commentary': {
      const input = parsed.data as z.infer<(typeof INPUTS)['commentary']>;
      const r = await ref(input.reference);
      if (!r.ok) return { ok: false, error: r.reason };
      const who = input.sources?.length ? joinNames(input.sources.map((s) => COMMENTARY_NAMES[s])) : 'Tyndale’s notes and the classic commentaries';
      return {
        ok: true,
        call: {
          step: { stage: 'Commentary', detail: `Reading ${who} on ${formatRef(r.ref)}`, provider: providerId(p.commentary, 'local:commentary') },
          fetch: () => kb.commentary(r.ref, input.sources, input.query),
          empty: `No commentary is available on ${formatRef(r.ref)}${input.sources?.length ? ` from ${input.sources.join(', ')}` : ''}.`,
          after: (drafts) => excerptedCommentaryNote(drafts, input.query),
        },
      };
    }
    case 'book_introduction': {
      const input = parsed.data as z.infer<(typeof INPUTS)['book_introduction']>;
      const book = findBook(input.book) ?? (parseReference(input.book) ? getBook(parseReference(input.book)!.book) : undefined);
      if (!book) return { ok: false, error: `Unknown book “${input.book}”.` };
      return {
        ok: true,
        call: {
          step: { stage: 'Introduction', detail: `Reading Tyndale’s introduction to ${book.name}`, provider: providerId(p.historicalContext, 'local:intros') },
          fetch: () => kb.bookIntroduction(book.id),
          empty: `No introduction is available for ${book.name}.`,
        },
      };
    }
    case 'read_document': {
      const input = parsed.data as z.infer<(typeof INPUTS)['read_document']>;
      if (!kb.documentParts) return { ok: false, error: 'This knowledge base cannot open texts by part.' };
      let result: DocumentParts | null = null;
      const asked = input.parts?.length ? `part${input.parts.length === 1 ? '' : 's'} ${input.parts.join(', ')} of ` : '';
      return {
        ok: true,
        call: {
          step: { stage: 'Search', detail: `Opening ${asked}“${clip(input.title, 80)}”`, provider: 'kb:document' },
          fetch: async () => {
            result = await kb.documentParts!(input.title, { ...(input.parts?.length ? { parts: input.parts } : {}), ...(input.query ? { query: input.query } : {}) });
            return result.found ? result.drafts : [];
          },
          empty: `Nothing opened from “${input.title}”.`,
          after: () => documentNote(result, input.title),
        },
      };
    }
  }
}

/** What read_document says besides the parts it opened: the list of parts, parts that do not exist, or the titles meant. */
function documentNote(r: DocumentParts | null, asked: string): string | null {
  if (!r) return null;
  if (!r.found) {
    return r.candidates.length
      ? `Several texts held in parts match “${asked}” — call again with one of these titles: ${r.candidates.join('; ')}.`
      : `The knowledge base holds no text in parts titled “${asked}” (use the title a search result shows, without “(part N)”); search_knowledge finds the texts themselves.`;
  }
  const missing = r.unknownParts.length ? `It has no part ${r.unknownParts.join(', ')}. ` : '';
  return `${missing}“${r.title}” has ${r.total} parts:\n${r.contents.join('\n')}`;
}

function clip(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

/**
 * Search results that are one part of a longer text: say how many parts it has, so the
 * model can open the part on the exact point with read_document (navigation, not evidence).
 */
function morePartsNote(kb: KnowledgeBase, drafts: readonly EvidenceDraft[]): string | null {
  if (!kb.partsOf) return null;
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const d of drafts) {
    const p = kb.partsOf(d.title);
    if (!p || seen.has(p.title)) continue;
    seen.add(p.title);
    lines.push(`“${p.title}” has ${p.total} parts (shown: part ${p.part})`);
  }
  return lines.length ? `Longer texts in these results — open another part with read_document (title, and parts or query): ${lines.join('; ')}.` : null;
}

/** A lemma this rare comes with the text of every verse it occurs in (lexicon lookup by Strong's number / word_occurrences). */
const RARE_LEXICON_VERSES = 6;
const RARE_OCCURRENCE_VERSES = 12;

/**
 * The text of every verse a rare lemma occurs in, as one Scripture evidence item — so a
 * key word's other uses ("used of the cloaks thrown on the colt", Luke 19:35) can be
 * read and cited instead of recalled from memory. Null when the lemma occurs in more
 * than `max` verses (then word_occurrences lists the addresses and read_passage reads them).
 */
export async function occurrenceVerses(kb: KnowledgeBase, strong: string, translation: TranslationId, max: number): Promise<EvidenceDraft | null> {
  const lexicon = kb.providers.lexicon;
  const occ = await lexicon.getOccurrences(strong).catch(() => null);
  if (!occ || !occ.total || occ.refs.length > max) return null;
  const lines: string[] = [];
  const refs: PassageRef[] = [];
  let sourceId: string | undefined;
  for (const v of occ.refs) {
    const ref: PassageRef = { book: v.book, startChapter: v.chapter, startVerse: v.verse, endChapter: v.chapter, endVerse: v.verse };
    const passage = await kb.providers.scripture.getPassage(ref, translation).catch(() => null);
    const text = passage?.chapters.flatMap((c) => c.verses).find((x) => x.ref.verse === v.verse)?.text;
    if (!text) continue;
    sourceId ??= passage?.sourceId;
    lines.push(`${formatRef(ref)} ${text}`);
    refs.push(ref);
  }
  if (!lines.length) return null;
  const entry = await lexicon.getEntry(strong).catch(() => null);
  const name = entry ? `${entry.lemma} (${entry.transliteration}, ${strong})` : strong;
  return {
    kind: 'scripture',
    title: `Every verse where ${name} occurs (${translation})`,
    text: lines.join('\n'),
    // the version's own source id ("bible-lsg"…), never the lower-cased translation id, which is a registry id only for BSB/KJV/WEB
    sourceId: sourceId ?? BIBLE_VERSIONS.find((b) => b.id === translation)?.sourceId ?? translation.toLowerCase(),
    quotable: sourceId && kb.providers.sources.getSource(sourceId) ? isQuotable(kb.providers.sources, sourceId) : true,
    locator: refs.map((r) => formatRef(r, 'short')).join('; '),
    refs,
  };
}

/** Parse a list of references (each must exist); duplicates are dropped. */
async function parseList(raw: readonly string[], refs: RefChecker): Promise<{ ok: true; refs: PassageRef[] } | { ok: false; error: string }> {
  const out: PassageRef[] = [];
  for (const r of raw) {
    const parsed = await refs.parse(r);
    if (!parsed.ok) return { ok: false, error: parsed.reason };
    if (!out.some((x) => formatRef(x) === formatRef(parsed.ref))) out.push(parsed.ref);
  }
  return { ok: true, refs: out };
}

async function totalVerses(list: readonly PassageRef[], refs: RefChecker): Promise<number> {
  let n = 0;
  for (const r of list) n += await verseSpan(r, (c) => refs.verseCount(r.book, c));
  return n;
}

/**
 * After a creeds-and-confessions search: the church traditions the knowledge base holds
 * texts of that did not come up — so a perspectives set is researched tradition by
 * tradition instead of from whichever works ranked first (eval2: Lutheran, Orthodox and
 * Baptist texts the KB holds were missed, then said to be absent).
 */
export function otherTraditionsNote(kb: KnowledgeBase, kinds: readonly EvidenceKind[] | undefined, drafts: readonly EvidenceDraft[], holdings: KbHoldings | null): string | null {
  if (!holdings || !kinds?.includes('confession') || !drafts.length) return null;
  const found = new Set<string>();
  for (const d of drafts) {
    for (const f of familiesOf(d.tradition)) found.add(f);
    const author = d.authorId ?? safeSync(() => kb.providers.sources.getSource(d.sourceId))?.authorIds[0];
    const t = author ? safeSync(() => kb.providers.sources.getAuthor(author))?.tradition : undefined;
    if (t && !/\(publisher\)/i.test(t)) for (const f of familiesOf(t)) found.add(f);
  }
  const others = holdings.traditions.filter((t) => traditionFamily(t.family)?.church && !traditionFamily(t.family)?.members && !found.has(t.family) && t.kinds.includes('confession'));
  if (!others.length) return null;
  return `Traditions whose confessional texts the knowledge base holds but that are not in these results: ${others.map((t) => t.label).join(', ')}. Before a perspectives set states or omits their view, search them one at a time (the same query with \`tradition\`); say the knowledge base lacks a tradition’s view only after that search finds nothing.`;
}

/** Long commentary sections come as excerpts ending “[…]”: say so, and how to read the part on the point at issue. */
export function excerptedCommentaryNote(drafts: readonly EvidenceDraft[], query: string | undefined): string | null {
  const cut = drafts.filter((d) => (d.kind === 'commentary' || d.kind === 'study-note') && /\[…\]\s*$/.test(d.text));
  if (!cut.length) return null;
  const names = [...new Set(cut.map((d) => d.title))].slice(0, 3).join('; ');
  return `Excerpts only (the section continues past “[…]”): ${names}. Before saying what ${cut.length === 1 ? 'this author concludes' : 'these authors conclude'} on a disputed point, call commentary again on the same reference with \`query\` naming that point${query ? ' (different words than before)' : ''} — never infer the rest of a section.`;
}

function safeSync<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

function safeHoldings(kb: KnowledgeBase): KbHoldings | null {
  try {
    return kb.holdings();
  } catch {
    return null;
  }
}

/** Kinds served per passage by their own tools, not by the search index. */
const PER_PASSAGE_KINDS: ReadonlySet<EvidenceKind> = new Set(['commentary', 'scripture', 'original-text', 'cross-references', 'occurrences']);

const KIND_NOUN: Partial<Record<EvidenceKind, string>> = {
  confession: 'creed, confession or catechism',
  dictionary: 'dictionary or encyclopedia',
  'topical-index': 'topical-index',
  'study-note': 'study-note',
  'book-introduction': 'book-introduction',
  curated: 'curated',
  lexicon: 'lexicon',
};

/** What to tell the model when a search found nothing — plainly when the knowledge base holds no texts of that kind or tradition, so it does not retry. */
export function emptySearchMessage(query: string, kinds: readonly EvidenceKind[] | undefined, within: PassageRef | undefined, holdings: KbHoldings | null): string {
  const base = `No results for “${query}”${kinds?.length ? ` in ${kinds.join(', ')}` : ''}${within ? ` on ${formatRef(within)}` : ''}.`;
  if (kinds?.length && holdings) {
    const perPassage = kinds.filter((k) => PER_PASSAGE_KINDS.has(k));
    const indexed = kinds.filter((k) => !PER_PASSAGE_KINDS.has(k));
    const held = indexed.filter((k) => (holdings.kinds[k] ?? 0) > 0);
    if (!held.length) {
      const parts: string[] = [];
      if (indexed.length) parts.push(`The knowledge base holds no ${indexed.map((k) => KIND_NOUN[k] ?? k).join(' or ')} texts — do not search for them again; if the page needs them, say plainly that the knowledge base lacks them.`);
      if (perPassage.length) parts.push(`${perPassage.join(', ')} ${perPassage.length === 1 ? 'is' : 'are'} not in the search index: use the commentary, read_passage, original_text or cross_references tools with a reference.`);
      return `${base} ${parts.join(' ')}`;
    }
  }
  const missing = missingTraditionNote(query, holdings);
  if (missing) return `${base} ${missing}`;
  return `${base} Try other words (for example the subject’s older English name) or fewer restrictions.`;
}

/** "The knowledge base holds no Eastern Orthodox texts…" when the query names a tradition it has no text of. */
export function missingTraditionNote(query: string, holdings: KbHoldings | null): string | null {
  if (!holdings) return null;
  const present = new Set(holdings.traditions.map((t) => t.family));
  const absent = familiesOf(query).filter((f) => traditionFamily(f)?.church && !present.has(f) && !traditionFamily(f)?.members);
  if (!absent.length) return null;
  const labels = absent.map((f) => traditionFamily(f)?.label ?? f).join(' / ');
  return `Note: the knowledge base holds no ${labels} texts, so it cannot state that tradition’s view — do not search for them again; say plainly that the knowledge base lacks them.`;
}

/** Tool-result text for a completed call. */
export function renderResearchResult(call: PreparedCall, entries: readonly LedgerEntry[], ledger: EvidenceLedger): string {
  if (entries.length === 0) return call.empty;
  return ledger.render(entries);
}
