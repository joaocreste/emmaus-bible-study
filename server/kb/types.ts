/**
 * Knowledge base — everything the inference layer may draw on. Retrieval only:
 * every method returns EvidenceDrafts (text + source + locator) from local data,
 * never generated text. The inference layer numbers them into its evidence ledger.
 *
 * Backed by: the bundled open datasets (public/data, via the existing local providers
 * with a Node fs loader), the curated library (src/data/curated), and the KB corpora
 * in kb/corpus (Nave's & Torrey's topics, Easton's & Smith's dictionaries, creeds and
 * confessions) indexed for full-text search.
 */
import type { BookId, PassageRef, TranslationId } from '../../src/domain/models';
import type { EvidenceDraft, EvidenceKind } from '../../src/inference/protocol';
import type { ProviderRegistry } from '../../src/providers/types';

export interface CorpusInfo {
  id: string;
  label: string;
  documents: number;
}

/** What the knowledge base holds for one Christian tradition (see ./traditions.ts). */
export interface TraditionHolding {
  /** family id ('catholic', 'reformed', …) */
  family: string;
  /** reader-facing name, e.g. "Catholic" */
  label: string;
  /** statement documents of this tradition (confessions, reference works, commentary, curated items) */
  documents: number;
  /** evidence kinds they come in (commentary: the classic commentaries fetched per passage) */
  kinds: EvidenceKind[];
  /** the works, e.g. "Council of Trent (Waterworth, 1848)", "The Catholic Encyclopedia (1907–1914)", "Calvin’s Commentaries" */
  works: string[];
}

/** An inventory of the knowledge base: document counts per evidence kind and the traditions its texts represent. */
export interface KbHoldings {
  /** documents per evidence kind in the search index (commentary and Scripture are served per passage, not indexed) */
  kinds: Partial<Record<EvidenceKind, number>>;
  /** traditions with at least one text, most documents first */
  traditions: TraditionHolding[];
  /** reported church traditions with no text at all (e.g. "Eastern Orthodox") */
  missing: string[];
}

export interface SearchOptions {
  /** restrict to these evidence kinds */
  kinds?: EvidenceKind[];
  /** max results (default 8) */
  limit?: number;
  /** restrict to passages overlapping this reference (notes, commentary, dictionary refs) */
  within?: PassageRef;
  /** restrict to texts of these church-tradition families ("lutheran", "orthodox"; members of a broad family count) */
  traditions?: string[];
}

/**
 * A long text split into parts in the index (a Catholic Encyclopedia article, a Wesley
 * sermon, a long dictionary entry), opened by its title: the requested parts as evidence,
 * and the parts' opening words so the model can choose among them.
 */
export type DocumentParts =
  | {
      found: true;
      /** the text's full title without the part number, as evidence headers show it */
      title: string;
      total: number;
      /** the parts asked for (or those best matching the query), as evidence */
      drafts: EvidenceDraft[];
      /** "part 6: The clause in Matthew …" for every part (navigation only, not evidence) */
      contents: string[];
      /** part numbers asked for that the text does not have */
      unknownParts: number[];
    }
  | { found: false; candidates: string[] };

export interface KnowledgeBase {
  /** load corpora + build/load the search index (idempotent; call before use) */
  ready(): Promise<void>;
  /** documents, corpora and a version (hash of the corpora + indexing code; changes when the knowledge base does) */
  stats(): { documents: number; corpora: CorpusInfo[]; version?: string };
  /** what kinds of text and which traditions the knowledge base holds (after ready()) */
  holdings(): KbHoldings;

  /** full-text (BM25) search over notes, introductions, dictionaries, topical index, confessions, curated items, lexicon glosses */
  search(query: string, opts?: SearchOptions): Promise<EvidenceDraft[]>;
  /** topical index: Nave's/Torrey's topics + curated topics/studies whose subject matches */
  topics(query: string, limit?: number): Promise<EvidenceDraft[]>;
  /** Scripture text of a passage (verse-numbered), capped at ~60 verses */
  passage(ref: PassageRef, translation: TranslationId): Promise<EvidenceDraft | null>;
  /** tagged original-language words of a passage (surface, transliteration, Strong's, gloss, parsing) */
  originalText(ref: PassageRef): Promise<EvidenceDraft | null>;
  /** lexicon entries by Strong's number ("G630") or by English meaning ("divorce", "put away") */
  lexicon(query: string, limit?: number): Promise<EvidenceDraft[]>;
  /** where a lemma occurs (counts + first refs) */
  occurrences(strong: string, limit?: number): Promise<EvidenceDraft | null>;
  /** community-voted cross-references for a passage (OpenBible), best first */
  crossReferences(ref: PassageRef, limit?: number): Promise<EvidenceDraft[]>;
  /** study notes + public-domain commentary on a passage; `sources` filters by commentary id ('tyndale','calvin','matthew-henry','jfb','keil-delitzsch') */
  /** classic commentary and Tyndale notes on a passage; with `query`, long sections are excerpted around its words */
  commentary(ref: PassageRef, sources?: string[], query?: string): Promise<EvidenceDraft[]>;
  /** a book's introduction (Tyndale), split into its sections */
  bookIntroduction(book: BookId): Promise<EvidenceDraft[]>;
  /** parts of a multi-part text by its title (`parts`: part numbers; `query`: the parts that best match) */
  documentParts?(title: string, opts?: { parts?: number[]; query?: string }): Promise<DocumentParts>;
  /** for the title of a part of a multi-part text: the text's title and how many parts it has (after ready()) */
  partsOf?(title: string): { title: string; part: number; total: number } | null;

  /** the underlying providers (Scripture/lexicon/xrefs/commentary/sources) for validation & hydration */
  readonly providers: ProviderRegistry;
}
