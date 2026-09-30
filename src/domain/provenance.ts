import type { Citation, ContentKind, Provenance, ProvenancedText, Verification } from './models';

/** Shorthand for a citation: cite('calvin-romans', 'on Rom 8:1', 'https://…') */
export function cite(sourceId: string, locator?: string, url?: string): Citation {
  return { sourceId, ...(locator ? { locator } : {}), ...(url ? { url } : {}) };
}

export function provenance(kind: ContentKind, verification: Verification, ...citations: Citation[]): Provenance {
  return { kind, verification, citations };
}

/** Synthesis written for Emmaus from the cited sources (AI-assisted, editorially grounded). */
export const synthesis = (...citations: Citation[]): Provenance => provenance('synthesis', 'editorial', ...citations);

/** Summary/paraphrase of a specific named work. Never rendered in quotation marks. */
export const summaryOf = (...citations: Citation[]): Provenance => provenance('summary', 'editorial', ...citations);

/** Exact words of a named source, checked against that source. */
export const verifiedQuote = (...citations: Citation[]): Provenance => provenance('quotation', 'verified', ...citations);

export const lexical = (...citations: Citation[]): Provenance => provenance('lexical', 'source-derived', ...citations);

export const historical = (verification: Verification, ...citations: Citation[]): Provenance =>
  provenance('historical', verification, ...citations);

export const literary = (...citations: Citation[]): Provenance => provenance('literary', 'editorial', ...citations);

export const fromDataset = (...citations: Citation[]): Provenance => provenance('dataset', 'source-derived', ...citations);

export function text(t: string, p: Provenance): ProvenancedText {
  return { text: t, provenance: p };
}

/** Every content kind, in legend order. */
export const CONTENT_KINDS: readonly ContentKind[] = [
  'scripture',
  'original-text',
  'lexical',
  'historical',
  'literary',
  'commentary',
  'quotation',
  'summary',
  'synthesis',
  'dataset',
];

/** Every verification state, in legend order. */
export const VERIFICATIONS: readonly Verification[] = ['verified', 'source-derived', 'editorial', 'generated', 'unverified'];

/**
 * English labels — a non-UI fallback (engine, server, logs). The interface shows the localized
 * labels of the 'provenance' message namespace (src/i18n/messages/provenance.ts:
 * kind.<kind>.label / .description, verification.<state>). Keep in sync with docs/DESIGN.md → Provenance.
 */
export const CONTENT_KIND_LABEL: Record<ContentKind, string> = {
  scripture: 'Scripture',
  'original-text': 'Original text',
  lexical: 'Lexicon',
  historical: 'Historical context',
  literary: 'Literary observation',
  commentary: 'Commentary',
  quotation: 'Quotation',
  summary: 'Summary',
  synthesis: 'Study synthesis',
  dataset: 'Open dataset',
};

export const CONTENT_KIND_DESCRIPTION: Record<ContentKind, string> = {
  scripture: 'Biblical text from a named public-domain or openly licensed translation.',
  'original-text': 'Hebrew, Aramaic or Greek text from a tagged scholarly edition.',
  lexical: 'Dictionary and grammatical data from a named lexicon.',
  historical: 'Historical or cultural background, with its source.',
  literary: 'An observation about the passage’s structure or style.',
  commentary: 'Material from a named commentary.',
  quotation: 'The exact words of a named author, checked against the source.',
  summary: 'A paraphrase of a named work — not the author’s own words.',
  synthesis:
    'Written for Emmaus with AI assistance from the cited sources. Helpful orientation, not an authority — follow the citations.',
  dataset: 'Derived automatically from an open dataset; not individually reviewed.',
};

/** English fallback; the UI uses the 'provenance' namespace (verification.<state>). */
export const VERIFICATION_LABEL: Record<Verification, string> = {
  verified: 'Verified against source',
  'source-derived': 'Taken from source data',
  editorial: 'Editorial',
  generated: 'Generated from cited sources — not reviewed',
  unverified: 'Unverified',
};
