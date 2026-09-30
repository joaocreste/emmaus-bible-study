/**
 * On-disk corpus format for the knowledge base (kb/corpus/<corpus-id>.json).
 * Corpora are normalised once by scripts/kb/* (network) and committed; the search
 * index is built from them at server start and cached in .kb-cache/.
 */
import type { EvidenceKind } from '../../src/inference/protocol';

export interface CorpusFile {
  corpus: {
    /** e.g. 'naves', 'torrey', 'easton', 'smith', 'westminster-confession', 'catholic-encyclopedia' */
    id: string;
    /** reader-facing label, e.g. "Nave’s Topical Bible (1896)" */
    label: string;
    kind: EvidenceKind;
    /** default SourceRegistry id for its documents */
    sourceId: string;
    /** where the digital text came from (for the manifest / Sources section) */
    origin: { url: string; license: string; retrieved: string };
  };
  documents: KbDocument[];
}

export interface KbDocument {
  /** stable id within the corpus, e.g. 'naves:divorce', 'wcf:24.5' */
  id: string;
  /** e.g. "DIVORCE", "Westminster Confession 24.5 — Of Marriage and Divorce" */
  title: string;
  /** full text of this chunk (plain text; paragraphs separated by blank lines) */
  text: string;
  /** overrides corpus.sourceId (e.g. one corpus holding several confessions) */
  sourceId?: string;
  authorId?: string;
  /** e.g. "ch. 24 §5", "Session 24, Canon 7", "s.v. Divorce" */
  locator?: string;
  /** deep link to this chunk when one exists */
  url?: string;
  /** Scripture referenced by the chunk, as refKey strings ("MAT.19.3-12") */
  refs?: string[];
  /** extra search terms (aliases, see-also topics, tradition names) */
  keywords?: string[];
  /** for topical-index documents: labelled groups of references */
  aspects?: { label: string; refs: string[] }[];
  /** confessional tradition this text represents, e.g. "Reformed", "Catholic", "Lutheran", "Eastern Orthodox", "Anglican", "Methodist", "Baptist" */
  tradition?: string;
}
