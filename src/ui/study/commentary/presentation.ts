import type { CommentaryEntry, Provenance, Source } from '../../../domain/models';
import { cleanLocator } from '../../common/attribution';

export type EntryPresentation =
  /** exact words, verified, from a source whose license allows quoting */
  | { mode: 'quotation' }
  /** a paraphrase of a named work — never in quotation marks */
  | { mode: 'summary' }
  /** a "quotation" that is not verified: shown as a summary, flagged Unverified */
  | { mode: 'unverified-summary' }
  /** exact words from a source that only permits summaries (or is missing): wording withheld */
  | { mode: 'withheld'; reason: 'license' | 'missing-source' };

/**
 * Decide how a commentary entry may be shown (docs/CONTENT-GUIDELINES.md §2):
 * quotation marks only for verified exact words from a known source that allows
 * quotation; unverified quotations become labelled summaries; verbatim wording from a
 * summary-only / metadata-only source is never reproduced.
 */
export function presentEntry(entry: CommentaryEntry, source: Source | undefined): EntryPresentation {
  if (entry.kind === 'summary') return { mode: 'summary' };
  if (entry.provenance.verification !== 'verified') return { mode: 'unverified-summary' };
  if (!source) return { mode: 'withheld', reason: 'missing-source' };
  const usage = source.license.usage;
  if (usage !== 'full-text' && usage !== 'excerpt') return { mode: 'withheld', reason: 'license' };
  return { mode: 'quotation' };
}

/** Provenance to display: a demoted quotation is labelled as a summary, keeping its verification state. */
export function displayProvenance(entry: CommentaryEntry, p: EntryPresentation): Provenance {
  if (p.mode === 'unverified-summary') return { ...entry.provenance, kind: 'summary', verification: 'unverified' };
  return entry.provenance;
}

/** Best link for "Read source →": the entry's own deep link, a citation link, then the source's landing page. */
export function entryLink(entry: CommentaryEntry, source: Source | undefined): string | undefined {
  return (
    entry.url ??
    entry.provenance.citations.find((c) => c.sourceId === entry.sourceId && c.url)?.url ??
    entry.provenance.citations.find((c) => c.url)?.url ??
    source?.url
  );
}

/**
 * Locator for the attribution line ("ch. 19", "on Rom 8:1"). Pass the source so a locator
 * that repeats the work's title or year ("The Treasury of David, Psalm 23…") is not doubled
 * next to the title.
 */
export function entryLocator(entry: CommentaryEntry, source?: Source): string | undefined {
  const raw = entry.locator ?? entry.provenance.citations.find((c) => c.sourceId === entry.sourceId)?.locator;
  return source ? cleanLocator(raw, source) : raw;
}

/** Strip quotation marks the data may already carry, so the UI adds exactly one pair. */
export function stripOuterQuotes(text: string): string {
  const t = text.trim();
  return /^[“"]/.test(t) && /[”"]$/.test(t) ? t.slice(1, -1).trim() : t;
}
