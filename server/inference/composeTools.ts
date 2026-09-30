/**
 * Composition tools (model-facing): begin_page → add_section × N → finish_page, and
 * `reply` for follow-up answers. Every claim cites ledger ids; the validator
 * (validate.ts) decides what reaches the page. Definitions are constant (cached prefix).
 */
import { z } from 'zod';
import type {
  ConsensusLevel,
  ContextCategory,
  LiteraryFeatureType,
  RelationshipType,
  SectionId,
  TheologyCategory,
} from '../../src/domain/models';
import type { BetaTool } from './modelClient';

export const COMPOSE_TOOL_NAMES = ['begin_page', 'add_section', 'finish_page', 'reply'] as const;
export type ComposeToolName = (typeof COMPOSE_TOOL_NAMES)[number];
export function isComposeTool(name: string): name is ComposeToolName {
  return (COMPOSE_TOOL_NAMES as readonly string[]).includes(name);
}

export const PAGE_SECTIONS = [
  'key-passages',
  'cross-references',
  'original-languages',
  'historical-context',
  'literary-context',
  'theology',
  'commentary',
] as const satisfies readonly SectionId[];
export type PageSection = (typeof PAGE_SECTIONS)[number];

export const SECTION_IDS = [
  'overview',
  'scripture',
  'key-passages',
  'cross-references',
  'original-languages',
  'historical-context',
  'literary-context',
  'theology',
  'commentary',
  'sources',
] as const satisfies readonly SectionId[];

export const RELATIONSHIPS = [
  'parallel',
  'prophecy-fulfillment',
  'thematic',
  'quotation',
  'allusion',
  'same-concept',
  'contrast',
  'historical',
] as const satisfies readonly RelationshipType[];

export const CONTEXT_CATEGORIES = [
  'historical-period',
  'geography',
  'political',
  'social',
  'economic',
  'religious',
  'jewish-tradition',
  'greco-roman',
  'ancient-near-east',
  'customs',
  'audience',
  'authorship',
  'genre',
  'occasion',
] as const satisfies readonly ContextCategory[];

export const FEATURE_TYPES = [
  'repetition',
  'parallelism',
  'chiasm',
  'inclusio',
  'metaphor',
  'imagery',
  'poetry',
  'narrative-structure',
  'argument-structure',
  'transition',
  'allusion',
] as const satisfies readonly LiteraryFeatureType[];

export const THEOLOGY_CATEGORIES = [
  'theology-proper',
  'trinity',
  'christology',
  'soteriology',
  'pneumatology',
  'ecclesiology',
  'eschatology',
  'covenant',
  'creation',
  'anthropology',
  'hamartiology',
  'grace',
  'sanctification',
  'adoption',
  'providence',
  'revelation',
  'ethics',
  'worship',
] as const satisfies readonly TheologyCategory[];

export const CONSENSUS_LEVELS = ['consensus', 'denominational', 'historical-debate', 'uncertain'] as const satisfies readonly ConsensusLevel[];

/* ------------------------------------------------------------------ */
/* JSON schemas (what the model sees)                                  */
/* ------------------------------------------------------------------ */

type Json = Record<string, unknown>;

const str = (description: string): Json => ({ type: 'string', description });
const evidence: Json = {
  type: 'array',
  items: { type: 'string' },
  description: 'Ledger ids of the retrieved evidence this rests on, e.g. ["E3","E14"] (at least one).',
};
const refs = (description: string): Json => ({ type: 'array', items: { type: 'string' }, description });
const cited = (description: string): Json => ({
  type: 'object',
  properties: { text: str(description), evidence },
  required: ['text', 'evidence'],
});

const keyPassageItem: Json = {
  type: 'object',
  description: 'key-passages item',
  properties: {
    reference: str('The passage, e.g. "Deuteronomy 24:1–4". It must appear in the cited evidence (a topical-index entry or a passage you read).'),
    title: str('Short headline (≤ 8 words).'),
    note: str('How this passage bears on the question (1–2 sentences, ≤ 45 words), paraphrasing the text you read.'),
    group: str('Grouping label, e.g. "The Law and the Prophets", "Jesus’ teaching", "Paul’s counsel".'),
    evidence,
  },
  required: ['reference', 'title', 'note', 'group', 'evidence'],
};

const crossRefItem: Json = {
  type: 'object',
  description: 'cross-references item',
  properties: {
    from: str('Verse(s) inside the page passage the connection starts from.'),
    to: str('The connected passage (it must appear in the cited evidence).'),
    relationship: { type: 'string', enum: [...RELATIONSHIPS] },
    title: str('Short headline (≤ 8 words).'),
    explanation: str('Why the passages connect (≤ 50 words).'),
    evidence,
  },
  required: ['from', 'to', 'relationship', 'title', 'explanation', 'evidence'],
};

const keyWordItem: Json = {
  type: 'object',
  description: 'original-languages item (lemma, transliteration, gloss, grammar and counts are filled in from the lexicon — do not supply them)',
  properties: {
    strong: str('Strong’s number found in your lexicon or original_text evidence, e.g. "G630".'),
    english: str('The English word or phrase readers see, e.g. "divorce".'),
    anchor: {
      type: 'object',
      description: 'Where to underline the word: one verse and the exact English phrase as it appears in that verse (BSB).',
      properties: {
        reference: str('One verse, e.g. "Matthew 19:3".'),
        phrase: str('Exact phrase from the BSB text of that verse.'),
        readerPhrase: str('Non-English pages only: the exact words that render this word in the reader’s version of that verse (as read_passage showed it), so it is underlined there too.'),
      },
      required: ['reference', 'phrase'],
    },
    significance: str('Why the word matters here, context first (≤ 60 words). Other uses only with their references (e.g. "Luke 10:41"): the server checks them against this word’s concordance, and you must have read them.'),
    semanticRange: { type: 'array', items: { type: 'string' }, description: 'Senses as stated in the lexicon evidence (2–4 short phrases).' },
    caution: str('Optional caution against over-reading the word — root fallacy, one sense read into every use (≤ 30 words). Never a moral verdict.'),
    evidence,
  },
  required: ['strong', 'english', 'significance', 'evidence'],
};

const contextItem: Json = {
  type: 'object',
  description: 'historical-context item',
  properties: {
    category: { type: 'string', enum: [...CONTEXT_CATEGORIES] },
    title: str('Short headline.'),
    summary: str('1–2 sentences (≤ 50 words), attributed where the sources differ.'),
    detail: str('Optional fuller explanation (≤ 120 words).'),
    relatedVerses: refs('Optional references this background illuminates.'),
    evidence,
  },
  required: ['category', 'title', 'summary', 'evidence'],
};

export const BEGIN_PAGE_TOOL: BetaTool = {
  name: 'begin_page',
  description:
    'Start the study page once your research is done: title, what the page covers and its summary. Call it exactly once, before any add_section (after sections exist a second call may only update title, subtitle, question and summary — never kind or passage). Title, subtitle and question are checked like the summary, against its evidence. The reader sees the page appear as soon as it is accepted.',
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    properties: {
      title: str('Page title (≤ 8 words), e.g. "Divorce in the Bible" or "Matthew 19:3–12".'),
      subtitle: str('Optional one-line subtitle.'),
      kind: { type: 'string', enum: ['passage', 'topic'], description: '"passage" when the reader asked about a passage; "topic" for subjects and questions.' },
      passage: str('The page passage (passage pages) or the anchor passage shown in the Scripture section (topic pages).'),
      question: str('For topic pages: the reader’s question in one line, e.g. "What does the Bible say about divorce?"'),
      summary: cited('What the page covers and the heart of the answer (2–3 sentences, ≤ 70 words).'),
    },
    required: ['title', 'kind', 'summary'],
  },
};

export const ADD_SECTION_TOOL: BetaTool = {
  name: 'add_section',
  description:
    'Add one section to the page (one call per section; several calls may be sent in one turn, in page order). Fields by section: key-passages → items (topic pages); cross-references → items (from must lie inside the page passage); original-languages → items; historical-context → items; literary-context → placeInBook/argument/features; theology → themes and/or perspectives; commentary → voices. The result lists what was accepted and what was rejected and why; to repair, call add_section again for the same section with the complete corrected list (mode "replace", the default, replaces the section — for theology, only the list(s) the call carries: themes, perspectives or both; "append" adds to it).',
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    properties: {
      section: { type: 'string', enum: [...PAGE_SECTIONS] },
      mode: { type: 'string', enum: ['replace', 'append'], description: 'Default "replace".' },
      title: str('Optional section heading chosen for this reader’s question.'),
      intro: str('Optional one-sentence introduction (≤ 30 words). Uncited framing: no references outside the page passage, names, traditions, dates or quotations.'),
      items: {
        type: 'array',
        description: 'key-passages, cross-references, original-languages and historical-context: the items (shape per section).',
        items: { anyOf: [keyPassageItem, crossRefItem, keyWordItem, contextItem] },
      },
      placeInBook: cited('literary-context: where the passage sits in the book’s flow (≤ 60 words).'),
      argument: cited('literary-context: how the passage’s argument or story moves (≤ 60 words).'),
      features: {
        type: 'array',
        description: 'literary-context: observable features of the text.',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: [...FEATURE_TYPES] },
            title: str('Short headline.'),
            description: str('What the feature is and why it matters (≤ 60 words); present contested proposals as “some interpreters see…”.'),
            verses: refs('Optional verses where it occurs.'),
            evidence,
          },
          required: ['type', 'title', 'description', 'evidence'],
        },
      },
      themes: {
        type: 'array',
        description: 'theology: what the passages teach.',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: [...THEOLOGY_CATEGORIES] },
            title: str('Short headline.'),
            summary: str('≤ 50 words.'),
            detail: str('Optional (≤ 100 words).'),
            keyVerses: refs('Key references (each must appear in the cited evidence or the page passage).'),
            evidence,
          },
          required: ['category', 'title', 'summary', 'keyVerses', 'evidence'],
        },
      },
      perspectives: {
        type: 'array',
        description: 'theology: only where Christians genuinely differ. Each position cites a text of its own tradition that states the view (a publisher’s study notes are labelled by the work, e.g. "Tyndale Open Study Notes", not as a tradition); leave out traditions the knowledge base has no texts for and say so in the intro ("The knowledge base holds no Eastern Orthodox text on this.").',
        items: {
          type: 'object',
          properties: {
            question: str('The question on which Christians differ.'),
            consensus: { type: 'string', enum: [...CONSENSUS_LEVELS] },
            intro: str('One or two neutral sentences (≤ 45 words).'),
            commonGround: str('Optional: what all positions affirm (≤ 40 words).'),
            positions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tradition: str('The tradition whose view this is, e.g. "Catholic", "Reformed", "Lutheran", "Anglican". The position must cite a text OF this tradition (its confession or catechism, a reference work of that tradition, or one of its authors).'),
                  label: str('One-line position label.'),
                  summary: str('The view as its own representatives would state it (≤ 60 words).'),
                  keyTexts: refs('Optional references the tradition appeals to.'),
                  evidence,
                },
                required: ['tradition', 'label', 'summary', 'evidence'],
              },
            },
            evidence,
          },
          required: ['question', 'consensus', 'intro', 'positions', 'evidence'],
        },
      },
      voices: {
        type: 'array',
        description: 'commentary: voices from retrieved texts that have an author — the evidence header shows “by …” (commentaries, study notes, and confessions or reference works with a recorded author). Author and work come from the evidence item. A text without an author belongs in a theme, context item or perspectives position instead.',
        items: {
          type: 'object',
          properties: {
            evidence: { type: 'string', description: 'ONE ledger id, e.g. "E21".' },
            mode: { type: 'string', enum: ['quote', 'summary'], description: '"quote" only for items not marked summary-only.' },
            quote: str('mode quote: an exact span copied from that evidence text (a phrase or sentence of 6–60 words).'),
            summary: str('mode summary: what the author says, in your words (≤ 60 words), no quotation marks.'),
            lead: str('Optional one-line framing, e.g. "On Moses’ concession (19:8)".'),
          },
          required: ['evidence', 'mode'],
        },
      },
    },
    required: ['section'],
  },
};

export const FINISH_PAGE_TOOL: BetaTool = {
  name: 'finish_page',
  description:
    'Finish the page after its sections: the opening chat message, concepts for quick follow-ups and suggested questions. Call it last; the page is complete when it is accepted.',
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    properties: {
      opening: cited('The chat message that introduces the page to the reader (2–4 sentences, ≤ 80 words).'),
      concepts: {
        type: 'array',
        description: '3–6 concepts a reader may ask about next; each answer is shown when they do.',
        items: {
          type: 'object',
          properties: {
            label: str('e.g. "The exception clause".'),
            aliases: { type: 'array', items: { type: 'string' }, description: 'Lower-case phrases a reader might type.' },
            answer: str('2–3 sentences (≤ 60 words).'),
            section: { type: 'string', enum: [...SECTION_IDS], description: 'Section to open when this concept comes up.' },
            verses: refs('Optional verses to highlight.'),
            evidence,
          },
          required: ['label', 'aliases', 'answer', 'section', 'evidence'],
        },
      },
      suggestedQuestions: { type: 'array', items: { type: 'string' }, description: '3–5 short follow-up questions.' },
    },
    required: ['opening', 'concepts', 'suggestedQuestions'],
  },
};

export const REPLY_TOOL: BetaTool = {
  name: 'reply',
  description:
    'Answer the reader’s follow-up question (follow-up answers only; never while composing a page). Call it once, after any research and add_section calls.',
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    properties: {
      text: str('The answer (2–6 sentences, ≤ 140 words; paragraphs separated by a blank line).'),
      evidence,
      focus: {
        type: 'object',
        description: 'Where the page should scroll and what to highlight.',
        properties: { section: { type: 'string', enum: [...SECTION_IDS] }, verses: refs('Optional verses to highlight.') },
        required: ['section'],
      },
      suggestions: { type: 'array', items: { type: 'string' }, description: 'Optional 2–3 next questions.' },
      declined: { type: 'boolean', description: 'true when the knowledge base cannot answer. With no evidence, text may only say what is missing (≤ 2 sentences; no references, names, dates or quotations); to add what the knowledge base does hold, cite its evidence ids.' },
    },
    required: ['text', 'evidence'],
  },
};

export const COMPOSE_TOOLS: BetaTool[] = [BEGIN_PAGE_TOOL, ADD_SECTION_TOOL, FINISH_PAGE_TOOL, REPLY_TOOL];

/* ------------------------------------------------------------------ */
/* Zod schemas (runtime validation of the streamed input)              */
/* ------------------------------------------------------------------ */

const s = z.string().trim().min(1);
const ids = z.array(z.string()).max(24);
const refList = z.array(z.string()).max(24);
const citedText = z.object({ text: s, evidence: ids });

export const BeginPageInput = z.object({
  title: s,
  subtitle: z.string().trim().optional(),
  kind: z.enum(['passage', 'topic']),
  passage: z.string().trim().optional(),
  question: z.string().trim().optional(),
  summary: citedText,
});

export const AddSectionInput = z.object({
  section: z.enum(PAGE_SECTIONS),
  mode: z.enum(['replace', 'append']).optional(),
  title: z.string().trim().optional(),
  intro: z.string().trim().optional(),
  items: z.array(z.unknown()).max(40).optional(),
  placeInBook: z.unknown().optional(),
  argument: z.unknown().optional(),
  features: z.array(z.unknown()).max(20).optional(),
  themes: z.array(z.unknown()).max(20).optional(),
  perspectives: z.array(z.unknown()).max(10).optional(),
  voices: z.array(z.unknown()).max(20).optional(),
});

export const FinishPageInput = z.object({
  opening: z.unknown(),
  concepts: z.array(z.unknown()).max(20).optional(),
  suggestedQuestions: z.array(z.unknown()).max(12).optional(),
});

export const ReplyInput = z.object({
  text: s,
  evidence: z.array(z.string()).max(24).optional(),
  focus: z
    .object({ section: z.enum(SECTION_IDS), verses: refList.optional() })
    .optional(),
  suggestions: z.array(z.string()).max(6).optional(),
  declined: z.boolean().optional(),
});

export const CitedText = citedText;

export const KeyPassageItem = z.object({ reference: s, title: s, note: s, group: s, evidence: ids });
export const CrossRefItem = z.object({ from: s, to: s, relationship: z.enum(RELATIONSHIPS), title: s, explanation: s, evidence: ids });
export const KeyWordItem = z.object({
  strong: s,
  english: s,
  anchor: z.object({ reference: s, phrase: s, readerPhrase: z.string().trim().optional() }).optional(),
  significance: s,
  semanticRange: z.array(z.string()).max(8).optional(),
  caution: z.string().trim().optional(),
  evidence: ids,
});
export const ContextItemInput = z.object({
  category: z.enum(CONTEXT_CATEGORIES),
  title: s,
  summary: s,
  detail: z.string().trim().optional(),
  relatedVerses: refList.optional(),
  evidence: ids,
});
export const FeatureInput = z.object({ type: z.enum(FEATURE_TYPES), title: s, description: s, verses: refList.optional(), evidence: ids });
export const ThemeInput = z.object({
  category: z.enum(THEOLOGY_CATEGORIES),
  title: s,
  summary: s,
  detail: z.string().trim().optional(),
  keyVerses: refList.default([]),
  evidence: ids,
});
export const PositionInput = z.object({ tradition: s, label: s, summary: s, keyTexts: refList.optional(), evidence: ids });
export const PerspectiveInput = z.object({
  question: s,
  consensus: z.enum(CONSENSUS_LEVELS),
  intro: s,
  commonGround: z.string().trim().optional(),
  positions: z.array(z.unknown()).max(10),
  evidence: ids,
});
export const VoiceInput = z.object({
  evidence: s,
  mode: z.enum(['quote', 'summary']),
  quote: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  lead: z.string().trim().optional(),
});
export const ConceptInput = z.object({
  label: s,
  aliases: z.array(z.string()).max(20).default([]),
  answer: s,
  section: z.enum(SECTION_IDS),
  verses: refList.optional(),
  evidence: ids,
});

export function zodIssues(error: z.ZodError): string {
  return error.issues
    .slice(0, 4)
    .map((i) => `${i.path.join('.') || 'input'}: ${i.message}`)
    .join('; ');
}
