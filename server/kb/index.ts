/**
 * The knowledge base (server side): retrieval only — every method returns
 * EvidenceDrafts cut from local data, never generated text.
 *
 *   const kb = getKnowledgeBase(root);        // process-wide singleton
 *   await kb.ready();                         // builds or loads the search index
 *   await kb.search('divorce');               // BM25 over notes, intros, dictionaries, topics, confessions, curated, lexicon
 *
 * Backing data
 *   providers   the app's own providers over public/data (Node fs loader) + the curated library;
 *               classic commentary for books that are not bundled is fetched live
 *               (Free Use Bible API) through a disk cache in .kb-cache/commentary
 *   index       MiniSearch over kb/corpus/*.json (loaded generically), Tyndale notes and
 *               introductions, lexicon senses and curated items — see ./searchIndex.ts;
 *               cached in .kb-cache/index-<hash>.json
 *
 * Text policy (see ./evidence.ts): long items are excerpted (search hits ≤ ~700 characters,
 * commentary ≤ ~900, around the query’s terms, cuts marked “[…]”); `evidenceFullText(draft)`
 * returns the complete retrieved text of any excerpted item.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { SearchResult } from 'minisearch';
import { getBook, tryGetBook } from '../../src/domain/books';
import type { BookId, Occurrences, PassageRef, TranslationId } from '../../src/domain/models';
import { compareRefs, refsOverlap, verseKey } from '../../src/domain/reference';
import { escapeRegExp, normalizeTopicQuery } from '../../src/engine/text';
import type { EvidenceDraft, EvidenceKind } from '../../src/inference/protocol';
import { createCuratedProviders, type CuratedTopicMatch } from '../../src/providers/curated';
import { createLocalDatasetProviders, LOCAL_COMMENTARIES } from '../../src/providers/local';
import { normalizeStrong } from '../../src/providers/local/strong';
import type { LocalLexiconEntry, LocalOccurrences, LocalOriginalVerse, LocalPassage } from '../../src/providers/local/types';
import type { ProviderRegistry } from '../../src/providers/types';
import { commentaryAuthorId } from './authors';
import { CURATED_SOURCE, curatedDocuments, topicEvidenceText } from './curated';
import { corpusDocuments, introSectionHeading, introTitle, lexiconDocuments, parseCorpus, readCorpusFiles, tyndaleIntroDocuments, tyndaleNoteDocuments, type KbIndexDoc } from './documents';
import {
  COMMENTARY_EXCERPT_CHARS,
  PART_EXCERPT_CHARS,
  commentaryEvidence,
  crossReferenceEvidence,
  docEvidence,
  lexiconEvidence,
  occurrencesEvidence,
  originalTextEvidence,
  parseRefs,
  passageEvidence,
  topicalEvidence,
  type XrefTarget,
} from './evidence';
import { createDiskCachedFetch, createNodeLoader } from './node';
import { buildIndex, cacheFileFor, indexHash, loadCachedIndex, writeCachedIndex, type CorpusStat, type LoadedIndex } from './searchIndex';
import { readerTermExpansions, searchTermExpansions } from './synonyms';
import { normPhrase, queryTerms, stemPhrase, termSet } from './text';
import { familiesOf, REPORTED_FAMILIES, traditionFamily } from './traditions';
import type { CorpusInfo, DocumentParts, KbHoldings, KnowledgeBase, SearchOptions, TraditionHolding } from './types';

export { evidenceFullText } from './evidence';
export type { KnowledgeBase, SearchOptions, CorpusInfo, DocumentParts, KbHoldings, TraditionHolding } from './types';

export interface KnowledgeBaseOptions {
  /** project root (absolute): kb/corpus, public/data and .kb-cache are resolved from it */
  root: string;
  /** live fallback for classic commentary on books that are not bundled (default true) */
  allowRemote?: boolean;
  /** default <root>/.kb-cache */
  cacheDir?: string;
  /** default <root>/kb/corpus */
  corpusDir?: string;
  /** default <root>/public/data */
  dataRoot?: string;
  /** read/write the serialised index in cacheDir (default true) */
  indexCache?: boolean;
  /** fetch used for the live commentary fallback (default: global fetch, 15 s timeout) — wrapped by the disk cache */
  remoteFetch?: typeof fetch;
  /** progress/timing log (default: console.log with a "[kb]" prefix) */
  log?: (message: string) => void;
}

export interface KbReadyInfo {
  source: 'cache' | 'built';
  /** index hash (corpora + indexing code + manifest + curated library): the knowledge-base version */
  hash: string;
  /** wall time of ready() */
  ms: number;
  documents: number;
  cacheFile?: string;
  cacheBytes?: number;
}

/** The KnowledgeBase contract plus a few server-side extras. */
export interface EmmausKnowledgeBase extends KnowledgeBase {
  /** how the last ready() went (null before it finished) */
  readonly readyInfo: KbReadyInfo | null;
  /** the index document behind a key ('naves:divorce', 'easton:divorce', 'tyndale:MAT.19.3', 'lex:G630H', …) */
  document(key: string): KbIndexDoc | undefined;
}

/** Files whose content shapes the index (part of the cache key). */
const INDEX_CODE = ['server/kb/documents.ts', 'server/kb/curated.ts', 'server/kb/text.ts', 'server/kb/searchIndex.ts', 'src/engine/text.ts'];

const BUILTIN_CORPORA: Record<string, string> = {
  'tyndale-notes': 'Tyndale Open Study Notes — verse notes',
  'tyndale-intros': 'Tyndale Open Study Notes — book introductions',
  lexicon: 'STEPBible lexicons (TBESG Greek, TBESH Hebrew)',
  curated: 'Emmaus curated library',
};

/** Relative weight of evidence kinds in general search (reviewed curated items first; lexicon senses have their own tool). */
const KIND_PRIOR: Partial<Record<EvidenceKind, number>> = {
  curated: 1.15,
  'book-introduction': 0.9,
  lexicon: 0.4,
};

const TYNDALE_NOTES_PER_CALL = 10;
const CLASSIC_SECTIONS_PER_CALL = 3;

function timeoutFetch(inner: typeof fetch, ms: number): typeof fetch {
  return ((input: RequestInfo | URL, init?: RequestInit) => inner(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(ms) })) as typeof fetch;
}

/** Comparable forms of a gloss: "to put away" → ["put away"]; "depart/send" → ["depart send", "depart", "send"]. */
function glossForms(gloss: string): string[] {
  const clean = (g: string) => stemPhrase(g.replace(/_/g, ' ').replace(/^\s*(?:to|a|an|the)\s+/i, ''));
  const parts = gloss.split('/').map(clean).filter(Boolean);
  return [clean(gloss.replace(/\//g, ' ')), ...(parts.length > 1 ? parts : [])];
}

/** The local lexicon provider always reports word counts; other providers may not. */
function localOccurrences(o: Occurrences | null): LocalOccurrences | null {
  return o ? { ...o, wordCount: o.wordCount ?? o.total } : null;
}

function clampLimit(n: number | undefined, fallback: number, max = 50): number {
  if (n == null || !Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(max, Math.floor(n)));
}

class KnowledgeBaseImpl implements EmmausKnowledgeBase {
  readonly providers: ProviderRegistry;
  readyInfo: KbReadyInfo | null = null;

  private readonly root: string;
  private readonly dataRoot: string;
  private readonly corpusDir: string;
  private readonly cacheDir: string;
  private readonly useCache: boolean;
  private readonly log: (message: string) => void;
  private loading: Promise<void> | null = null;
  private loaded: LoadedIndex | null = null;
  private byKey = new Map<string, number>();
  private introsByBook = new Map<BookId, number[]>();
  private docsByBook: Map<BookId, number[]> | null = null;
  private readonly parsedRefs = new Map<number, PassageRef[]>();
  private inventory: KbHoldings | null = null;
  /** multi-part texts by normalised title (without the part number) */
  private partGroupsCache: Map<string, PartGroup> | null = null;

  constructor(options: KnowledgeBaseOptions) {
    this.root = resolve(options.root);
    this.dataRoot = options.dataRoot ?? join(this.root, 'public', 'data');
    this.corpusDir = options.corpusDir ?? join(this.root, 'kb', 'corpus');
    this.cacheDir = options.cacheDir ?? join(this.root, '.kb-cache');
    this.useCache = options.indexCache !== false;
    this.log = options.log ?? ((m) => console.log(`[kb] ${m}`));
    const remoteFetch = createDiskCachedFetch(join(this.cacheDir, 'commentary'), timeoutFetch(options.remoteFetch ?? globalThis.fetch.bind(globalThis), 15_000));
    const local = createLocalDatasetProviders({ loader: createNodeLoader(this.dataRoot), allowRemoteFallback: options.allowRemote !== false, remoteFetch });
    this.providers = { ...local, ...createCuratedProviders() };
  }

  /* ---------------------------------------------------------------- */
  /* Loading                                                           */
  /* ---------------------------------------------------------------- */

  ready(): Promise<void> {
    this.loading ??= this.load().catch((err: unknown) => {
      this.loading = null;
      throw err;
    });
    return this.loading;
  }

  private async load(): Promise<void> {
    const t0 = performance.now();
    const sources = this.providers.sources;
    const warn = (m: string) => this.log(`warning: ${m}`);
    const [corpusFiles, manifest, topics] = await Promise.all([
      readCorpusFiles(this.corpusDir, warn),
      readFile(join(this.dataRoot, 'manifest.json'), 'utf8').catch(() => null),
      this.providers.topics.listTopics(),
    ]);
    const curated = curatedDocuments(this.providers.studies.list(), topics, sources);
    const hash = await indexHash({ codeFiles: INDEX_CODE.map((f) => join(this.root, f)), corpusFiles, manifest, curated });
    const file = cacheFileFor(this.cacheDir, hash);

    let loaded = this.useCache ? await loadCachedIndex(file, hash) : null;
    if (loaded) {
      this.log(`search index loaded from cache in ${Math.round(performance.now() - t0)} ms (${loaded.docs.length} documents, ${(loaded.cacheBytes! / 1e6).toFixed(0)} MB)`);
    } else {
      const docs: KbIndexDoc[] = [];
      const corpora: CorpusStat[] = [];
      for (const { file: name, raw } of corpusFiles) {
        const parsed = parseCorpus(name, raw, warn);
        if (!parsed) continue;
        const d = corpusDocuments(parsed, sources, warn);
        docs.push(...d);
        corpora.push({ id: parsed.corpus.id, label: parsed.corpus.label, documents: d.length });
      }
      const [notes, intros, lexicon] = await Promise.all([
        tyndaleNoteDocuments(this.dataRoot, sources),
        tyndaleIntroDocuments(this.dataRoot, sources),
        lexiconDocuments(this.dataRoot, sources),
      ]);
      for (const [id, d] of [['tyndale-notes', notes], ['tyndale-intros', intros], ['lexicon', lexicon], ['curated', curated]] as const) {
        docs.push(...d);
        corpora.push({ id, label: BUILTIN_CORPORA[id], documents: d.length });
      }
      // keys must be unique across corpora (a corpus file that reuses another's ids is disambiguated)
      const seen = new Set<string>();
      for (const d of docs) {
        let key = d.key;
        for (let n = 2; seen.has(key); n++) key = `${d.key}#${n}`;
        d.key = key;
        seen.add(key);
      }
      const t1 = performance.now();
      loaded = await buildIndex(docs, corpora);
      const t2 = performance.now();
      let cacheNote = '';
      if (this.useCache) {
        try {
          const written = await writeCachedIndex(this.cacheDir, hash, loaded);
          loaded.cacheFile = written.file;
          loaded.cacheBytes = written.bytes;
          cacheNote = `, cached ${(written.bytes / 1e6).toFixed(0)} MB in ${Math.round(performance.now() - t2)} ms`;
        } catch (err) {
          warn(`could not write the index cache: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      this.log(
        `search index built: ${docs.length} documents (read ${Math.round(t1 - t0)} ms, indexed ${Math.round(t2 - t1)} ms${cacheNote}); ` +
          corpora.map((c) => `${c.id} ${c.documents}`).join(', '),
      );
    }

    this.loaded = loaded;
    this.byKey = new Map(loaded.docs.map((d, i) => [d.key, i]));
    this.introsByBook = new Map();
    loaded.docs.forEach((d, i) => {
      if (d.corpus !== 'tyndale-intros') return;
      const book = /^intro:([^:]+):/.exec(d.key)?.[1] as BookId | undefined;
      if (!book) return;
      const list = this.introsByBook.get(book);
      if (list) list.push(i);
      else this.introsByBook.set(book, [i]);
    });
    this.docsByBook = null;
    this.parsedRefs.clear();
    this.inventory = null;
    this.partGroupsCache = null;
    this.readyInfo = { source: loaded.source, hash, ms: Math.round(performance.now() - t0), documents: loaded.docs.length, cacheFile: loaded.cacheFile, cacheBytes: loaded.cacheBytes };
  }

  private get index(): LoadedIndex {
    if (!this.loaded) throw new Error('KnowledgeBase used before ready()');
    return this.loaded;
  }

  stats(): { documents: number; corpora: CorpusInfo[]; version?: string } {
    const l = this.loaded;
    return {
      documents: l?.docs.length ?? 0,
      corpora: (l?.corpora ?? []).map((c) => ({ ...c })),
      ...(this.readyInfo ? { version: this.readyInfo.hash } : {}),
    };
  }

  /**
   * What the knowledge base holds: documents per evidence kind, and for each Christian
   * tradition the statement texts that represent it — documents tagged with the
   * tradition (confessions, the Catholic Encyclopedia…), documents by an author the
   * registry places in it, and the classic commentaries (fetched per passage) by
   * their authors' traditions. Computed once per load.
   */
  holdings(): KbHoldings {
    if (this.inventory) return this.inventory;
    const docs = this.loaded?.docs ?? [];
    const sources = this.providers.sources;
    const kinds: KbHoldings['kinds'] = {};
    const byFamily = new Map<string, { documents: number; kinds: Set<EvidenceKind>; works: Map<string, number> }>();
    const authorTradition = new Map<string, string>();
    const traditionOfAuthor = (id: string | undefined): string | undefined => {
      if (!id) return undefined;
      if (!authorTradition.has(id)) {
        const t = sources.getAuthor(id)?.tradition ?? '';
        // a publisher's house tradition ("Evangelical (publisher)") does not make its notes that tradition's own texts
        authorTradition.set(id, /\(publisher\)/i.test(t) ? '' : t);
      }
      return authorTradition.get(id) || undefined;
    };
    const add = (families: string[], kind: EvidenceKind, work: string, n = 1) => {
      for (const f of families) {
        let h = byFamily.get(f);
        if (!h) byFamily.set(f, (h = { documents: 0, kinds: new Set(), works: new Map() }));
        h.documents += n;
        h.kinds.add(kind);
        h.works.set(work, (h.works.get(work) ?? 0) + n);
      }
    };
    const corpusLabel = new Map((this.loaded?.corpora ?? []).map((c) => [c.id, c.label]));
    for (const d of docs) {
      kinds[d.kind] = (kinds[d.kind] ?? 0) + 1;
      if (!STATEMENT_KINDS.has(d.kind)) continue;
      const source = sources.getSource(d.sourceId);
      const families = new Set(this.docFamilies(d));
      if (!families.size) continue;
      const work = d.kind === 'dictionary' || d.kind === 'curated' ? (corpusLabel.get(d.corpus) ?? source?.title ?? d.corpus) : (source?.title ?? corpusLabel.get(d.corpus) ?? d.corpus);
      add([...families], d.kind, datedWork(work, d.kind === 'confession' ? source?.year : undefined));
    }
    // classic commentaries are fetched per passage (not indexed): count them by author
    for (const c of LOCAL_COMMENTARIES) {
      const author = commentaryAuthorId(c.id, c.testaments.includes('OT') ? 'GEN' : 'MAT');
      add(familiesOf(traditionOfAuthor(author)).filter((f) => traditionFamily(f)?.church), c.id === 'tyndale' ? 'study-note' : 'commentary', c.name, 0);
    }
    const traditions: TraditionHolding[] = [...byFamily.entries()]
      .map(([family, h]) => ({
        family,
        label: traditionFamily(family)?.label ?? family,
        documents: h.documents,
        kinds: [...h.kinds],
        works: [...h.works.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w),
      }))
      .sort((a, b) => b.documents - a.documents || a.label.localeCompare(b.label));
    const present = new Set(traditions.map((t) => t.family));
    const missing = REPORTED_FAMILIES.filter((f) => !present.has(f)).map((f) => traditionFamily(f)?.label ?? f);
    this.inventory = { kinds, traditions, missing };
    return this.inventory;
  }

  document(key: string): KbIndexDoc | undefined {
    const i = this.byKey.get(key);
    return i == null ? undefined : this.loaded?.docs[i];
  }

  /* ---------------------------------------------------------------- */
  /* Reference filters                                                 */
  /* ---------------------------------------------------------------- */

  private refsOf(i: number): PassageRef[] {
    let refs = this.parsedRefs.get(i);
    if (!refs) {
      refs = parseRefs(this.index.docs[i].refs);
      this.parsedRefs.set(i, refs);
    }
    return refs;
  }

  private readonly familyCache = new WeakMap<KbIndexDoc, string[]>();

  /** Church-tradition families a document speaks for (its own tag, else its author's; a publisher's house tradition does not count). */
  private docFamilies(d: KbIndexDoc): string[] {
    let out = this.familyCache.get(d);
    if (!out) {
      const sources = this.providers.sources;
      const author = d.authorId ?? sources.getSource(d.sourceId)?.authorIds[0];
      let t = '';
      try {
        t = (author && sources.getAuthor(author)?.tradition) || '';
      } catch {
        t = '';
      }
      const own = /\(publisher\)/i.test(t) ? [] : familiesOf(t);
      out = [...new Set([...familiesOf(d.tradition), ...own].filter((f) => traditionFamily(f)?.church))];
      this.familyCache.set(d, out);
    }
    return out;
  }

  private docOverlaps(i: number, within: PassageRef): boolean {
    const keys = this.index.docs[i].refs;
    if (!keys?.some((k) => k.startsWith(`${within.book}.`))) return false;
    return this.refsOf(i).some((r) => r.book === within.book && refsOverlap(r, within));
  }

  private docsAbout(within: PassageRef): number[] {
    if (!this.docsByBook) {
      const map = new Map<BookId, number[]>();
      this.index.docs.forEach((d, i) => {
        const books = new Set((d.refs ?? []).map((k) => k.slice(0, k.indexOf('.')) as BookId));
        for (const b of books) {
          const list = map.get(b);
          if (list) list.push(i);
          else map.set(b, [i]);
        }
      });
      this.docsByBook = map;
    }
    return (this.docsByBook.get(within.book) ?? []).filter((i) => this.docOverlaps(i, within));
  }

  /* ---------------------------------------------------------------- */
  /* Search                                                            */
  /* ---------------------------------------------------------------- */

  async search(query: string, opts: SearchOptions = {}): Promise<EvidenceDraft[]> {
    await this.ready();
    const limit = clampLimit(opts.limit, 8);
    const kinds = opts.kinds?.length ? new Set<EvidenceKind>(opts.kinds) : null;
    const within = opts.within;
    // classic commentary is not in the index (it is fetched per passage): with a passage, search its sections too
    const wanted = opts.traditions?.length ? expandFamilies(opts.traditions) : null;
    const classic = kinds?.has('commentary') && within && !wanted ? await this.classicCommentaryMatching(query, within) : [];
    if (!classic.length) return this.searchIndex(query, limit, kinds, within, wanted);
    const onlyClassic = [...kinds!].every((k) => k === 'commentary' || k === 'scripture');
    const share = onlyClassic ? limit : Math.max(1, Math.ceil(limit / 3));
    const fromIndex = onlyClassic ? [] : await this.searchIndex(query, limit, kinds, within);
    const taken = classic.slice(0, Math.max(share, limit - fromIndex.length));
    return [...fromIndex.slice(0, limit - taken.length), ...taken];
  }

  private searchIndex(rawQuery: string, limit: number, kinds: ReadonlySet<EvidenceKind> | null, within: PassageRef | undefined, families: ReadonlySet<string> | null = null): EvidenceDraft[] {
    const { docs, index } = this.index;
    const accept = (i: number) =>
      (!kinds || kinds.has(docs[i].kind)) && (!within || this.docOverlaps(i, within)) && (!families || this.docFamilies(docs[i]).some((f) => families.has(f)));
    const query = searchQuery(rawQuery);
    const terms = queryTerms(query);

    if (!terms.length) {
      if (!within) return [];
      // no searchable words: what the knowledge base holds on the passage, notes first
      const order: Partial<Record<EvidenceKind, number>> = { 'study-note': 0, curated: 1, dictionary: 2, confession: 3, 'topical-index': 4, 'book-introduction': 5 };
      const ids = this.docsAbout(within)
        .filter((i) => !kinds || kinds.has(docs[i].kind))
        .sort((a, b) => (order[docs[a].kind] ?? 9) - (order[docs[b].kind] ?? 9) || compareRefs(this.refsOf(a)[0], this.refsOf(b)[0]))
        .slice(0, limit);
      return ids.map((i) => docEvidence(docs[i], this.providers.sources, new Set(), undefined, within));
    }

    let raw = index.search(query, { filter: (r) => accept(r.id as number) });
    // the older words a tradition's texts use for the subject ("divorce" → "put away", "bond of matrimony"), at a lower weight
    const expansions = searchTermExpansions(normPhrase(query));
    if (expansions.length) {
      const best = new Map(raw.map((r) => [r.id as number, r]));
      const top = raw[0]?.score ?? 1;
      for (const phrase of expansions) {
        const hits = index.search(phrase, { filter: (r) => accept(r.id as number), combineWith: 'AND' });
        const scale = hits[0] ? (0.6 * top) / hits[0].score : 0;
        for (const h of hits.slice(0, 60)) {
          const scored = { ...h, score: h.score * scale };
          const prev = best.get(h.id as number);
          if (!prev || prev.score < scored.score) best.set(h.id as number, prev ? { ...prev, score: Math.max(prev.score, scored.score), terms: [...new Set([...prev.terms, ...h.terms])] } : scored);
        }
      }
      raw = [...best.values()].sort((a, b) => b.score - a.score);
    }
    const ranked = this.rerank(query, raw.slice(0, 400), kinds);
    // a creeds-and-confessions search shows several works and traditions: at most 2 texts per work before the rest
    const onlyConfessions = kinds != null && [...kinds].every((k) => k === 'confession');
    const picked = diversify(ranked, limit, {
      kindOf: (h) => docs[h.id].kind,
      corpusOf: (h) => (onlyConfessions ? docs[h.id].sourceId : docs[h.id].corpus),
      sameCluster: (a, b) => this.sameCluster(a, b),
      ...(onlyConfessions ? { perCorpus: 2 } : {}),
    });
    return picked.map((h) => docEvidence(docs[h.id], this.providers.sources, new Set([...terms, ...h.terms]), undefined, within));
  }

  /** Classic commentary sections on a passage that use the query's words, most matches first (excerpted around them). */
  private async classicCommentaryMatching(query: string, within: PassageRef): Promise<EvidenceDraft[]> {
    const terms = new Set(queryTerms(query));
    const book = tryGetBook(within.book);
    if (!book) return [];
    const out: { draft: EvidenceDraft; hits: number }[] = [];
    for (const info of LOCAL_COMMENTARIES) {
      if (info.id === 'tyndale' || !info.testaments.includes(book.testament)) continue;
      const sections = await this.providers.commentary.getCommentary(info.id, within).catch(() => []);
      const authorId = commentaryAuthorId(info.id, within.book);
      for (const s of sections) {
        const hits = terms.size ? queryTerms(s.text).filter((t) => terms.has(t)).length : 1;
        if (!hits) continue;
        const draft = commentaryEvidence({ commentaryId: info.id, commentaryName: info.name, sectionRef: s.ref, requested: within, text: s.text, sourceId: s.sourceId, authorId, sources: this.providers.sources, terms });
        out.push({ draft, hits });
      }
    }
    return out.sort((a, b) => b.hits - a.hits).map((x) => x.draft);
  }

  /**
   * Re-rank BM25 hits: a document whose heading IS the query (a dictionary entry or
   * topic named “Divorce”) outranks passing mentions; kind priors; and notes on the
   * passages that the matching topic/dictionary entries list are favoured (the
   * indexes say which passages the subject rests on).
   */
  private rerank(query: string, hits: SearchResult[], kinds: ReadonlySet<EvidenceKind> | null): Hit[] {
    const { docs } = this.index;
    const q = stemPhrase(normalizeTopicQuery(query) || query);
    const words = tokenizeWords(query);
    const out = hits.map((h, rank) => {
      const d = docs[h.id as number];
      // lexicon senses and topical entries have their own tools; in a general search they support, not lead
      let score = h.score * (kinds ? 1 : (KIND_PRIOR[d.kind] ?? 1));
      // matched only through a stem collision ("care" → "car" in BETH-CAR): the document uses none of the query's words
      if (rank < 80 && words.length && !words.some((w) => usesWord(`${d.title} ${(d.keywords ?? []).join(' ')} ${d.searchText ?? d.text}`, w))) score *= 0.3;
      // a confession section that matched only through its chapter title ("Of Marriage and Divorce" over WCF 24.1–4): its own words are about something else
      else if (d.kind === 'confession' && rank < 80 && words.length && words.some((w) => usesWord(d.title, w)) && !words.some((w) => usesWord(d.text, w))) score *= 0.5;
      const heading = stemPhrase(d.heading ?? d.title);
      const exact = q !== '' && heading === q;
      if (exact) score *= 2;
      else if (d.kind === 'topical-index' && !kinds) score *= 0.6; // matched through a see-also keyword or a sub-heading only
      return { id: h.id as number, score, terms: h.terms, exact };
    });
    // passages the exactly matching topic/dictionary entries cite: the more of them cite it, the more central the passage
    const anchorDocs = out.filter((h) => h.exact && (docs[h.id].kind === 'topical-index' || docs[h.id].kind === 'dictionary')).slice(0, 5);
    if (anchorDocs.length) {
      const anchorRefs = anchorDocs.map((h) => this.refsOf(h.id));
      for (const h of out) {
        if (docs[h.id].kind !== 'study-note') continue;
        const refs = this.refsOf(h.id);
        const cited = anchorRefs.filter((list) => list.some((a) => refs.some((r) => a.book === r.book && refsOverlap(a, r)))).length;
        if (cited) h.score *= Math.min(1.6, 1 + 0.15 * cited);
      }
    }
    return out.sort((a, b) => b.score - a.score);
  }

  /** Near-duplicates that should not both take a slot: notes a few verses apart, parts of one article, senses of one word. */
  private sameCluster(a: Hit, b: Hit): boolean {
    const { docs } = this.index;
    const da = docs[a.id];
    const db = docs[b.id];
    if (da.corpus !== db.corpus) return false;
    if (da.kind === 'lexicon') return da.strong === db.strong;
    if (da.kind === 'study-note') {
      const ra = this.refsOf(a.id)[0];
      const rb = this.refsOf(b.id)[0];
      if (!ra || !rb || ra.book !== rb.book || ra.startChapter !== rb.startChapter) return false;
      const endA = ra.endChapter === ra.startChapter ? (ra.endVerse ?? 999) : 999;
      const endB = rb.endChapter === rb.startChapter ? (rb.endVerse ?? 999) : 999;
      return (rb.startVerse ?? 1) <= endA + 3 && (ra.startVerse ?? 1) <= endB + 3;
    }
    return (da.heading ?? da.title) === (db.heading ?? db.title);
  }

  /* ---------------------------------------------------------------- */
  /* Topics                                                            */
  /* ---------------------------------------------------------------- */

  async topics(query: string, limit = 6): Promise<EvidenceDraft[]> {
    await this.ready();
    const { docs, index } = this.index;
    const sources = this.providers.sources;
    const q = normalizeTopicQuery(query) || normPhrase(query);
    if (!q) return [];
    const max = clampLimit(limit, 6, 20);

    // curated topic index: exact names outrank aliases
    const curatedMatches = (await this.providers.topics.findTopics(query)) as CuratedTopicMatch[];
    const curatedScored = curatedMatches
      .map((c) => ({ c, score: Math.max(topicMatch(q, c.name), 0.9 * Math.max(0, ...c.aliases.map((a) => topicMatch(q, a)))) }))
      .filter((x) => x.score >= 0.5);

    // phrases to look up: the query, reader vocabulary → index headings, aliases of exactly matching curated topics
    const phrases = new Map<string, number>([[q, 1]]);
    for (const t of readerTermExpansions(q)) if (!phrases.has(t)) phrases.set(t, 0.85);
    for (const { c, score } of curatedScored) {
      if (score < 0.9) continue;
      for (const a of [c.name, ...c.aliases].slice(0, 12)) {
        const p = normalizeTopicQuery(a) || normPhrase(a);
        if (p && !phrases.has(p)) phrases.set(p, 0.7);
      }
    }

    const candidates = new Map<number, number>();
    for (const [phrase, weight] of phrases) {
      const res = index.search(phrase, {
        fields: ['title', 'keywords'],
        filter: (r) => docs[r.id as number].kind === 'topical-index',
        prefix: false,
        fuzzy: phrase === q ? (t: string) => (t.length >= 6 ? 1 : false) : false,
      });
      for (const r of res.slice(0, 40)) candidates.set(r.id as number, Math.max(candidates.get(r.id as number) ?? 0, r.score * weight));
    }

    const qTerms = new Set(queryTerms(q));
    const scored: { draft: () => EvidenceDraft; score: number; bm25: number; order: number }[] = [];
    for (const [id, bm25] of candidates) {
      const d = docs[id];
      const heading = d.heading ?? d.title;
      let match = 0;
      for (const [phrase, weight] of phrases) {
        match = Math.max(match, weight * topicMatch(phrase, heading));
        // keywords are aliases and see-also links: a weaker signal than the entry's own heading — and through
        // a curated topic's alias ("fear" for Anxiety & Worry) too weak on its own (it brought in COWARDICE)
        for (const k of d.keywords ?? []) match = Math.max(match, weight * (weight < 0.8 ? 0.6 : 0.75) * topicMatch(phrase, k));
      }
      if (match < 0.5) {
        // multi-word questions: keep entries whose heading/keywords carry most of the query's words
        const have = new Set(queryTerms(`${heading} ${(d.keywords ?? []).join(' ')}`));
        const covered = [...qTerms].filter((t) => have.has(t)).length;
        if (qTerms.size < 2 || covered / qTerms.size < 0.5) continue;
        match = 0.4 * (covered / qTerms.size);
      }
      scored.push({ draft: () => topicalEvidence(d, sources, new Set([...qTerms, ...[...phrases.keys()].flatMap(queryTerms)])), score: match, bm25, order: d.corpus === 'naves' ? 0 : 1 });
    }
    for (const { c, score } of curatedScored) {
      scored.push({
        draft: () => ({
          kind: 'curated',
          title: `${c.name} (Emmaus curated topic)`,
          text: topicEvidenceText(c, sources, { maxChars: 3000 }),
          sourceId: CURATED_SOURCE,
          quotable: false,
          locator: `topic index, “${c.name}”`,
          refs: [...(c.anchor ? [c.anchor] : []), ...c.topic.keyPassages.map((k) => k.ref)],
        }),
        score,
        bm25: 0,
        order: 2,
      });
    }
    return scored
      .sort((a, b) => b.score - a.score || a.order - b.order || b.bm25 - a.bm25)
      .slice(0, max)
      .map((s) => s.draft());
  }

  /* ---------------------------------------------------------------- */
  /* Scripture & original text                                         */
  /* ---------------------------------------------------------------- */

  async passage(ref: PassageRef, translation: TranslationId): Promise<EvidenceDraft | null> {
    if (!tryGetBook(ref.book)) return null;
    try {
      const p = (await this.providers.scripture.getPassage(ref, translation)) as LocalPassage;
      return passageEvidence(p, ref, this.providers.sources);
    } catch {
      return null;
    }
  }

  async originalText(ref: PassageRef): Promise<EvidenceDraft | null> {
    if (!tryGetBook(ref.book)) return null;
    try {
      const verses = (await this.providers.originalText.getOriginalText(ref)) as LocalOriginalVerse[];
      return originalTextEvidence(verses, ref, this.providers.sources);
    } catch {
      return null;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Lexicon                                                           */
  /* ---------------------------------------------------------------- */

  async lexicon(query: string, limit = 6): Promise<EvidenceDraft[]> {
    const max = clampLimit(limit, 6, 20);
    const lex = this.providers.lexicon;
    const sources = this.providers.sources;
    const strong = normalizeStrong(query.trim().toUpperCase());
    if (strong) {
      const entry = (await lex.getEntry(strong.extended)) as LocalLexiconEntry | null;
      if (!entry) return [];
      return [lexiconEvidence(entry, localOccurrences(await lex.getOccurrences(strong.base)), sources)];
    }

    await this.ready();
    const { docs, index } = this.index;
    const q = glossForms(query)[0] ?? '';
    if (!q) return [];
    const askedForName = /^\s*[A-Z]/.test(query);
    const hits = index.search(query, {
      filter: (r) => docs[r.id as number].kind === 'lexicon',
      boost: { title: 3, keywords: 0.2, text: 1 },
      prefix: false,
      fuzzy: false,
      combineWith: 'AND',
    });
    const ranked = hits.slice(0, 400).map((h) => {
      const d = docs[h.id as number];
      // STEPBible glosses: "divorce", "to love", "to release: divorce" (lemma meaning: this sense), "depart/send"
      const gloss = /— “(.*)”$/.exec(d.title)?.[1] ?? '';
      const colon = gloss.indexOf(':');
      const sense = glossForms(colon >= 0 ? gloss.slice(colon + 1) : gloss);
      const lemmaMeaning = colon >= 0 ? glossForms(gloss.slice(0, colon)) : [];
      const all = [...sense, ...lemmaMeaning];
      const tier = sense.includes(q) ? 4 : lemmaMeaning.includes(q) ? 3 : all.some((g) => ` ${g} `.includes(` ${q} `)) ? 2 : 1;
      // a person or place ("Elonbeth-hanan") matched through its meaning: after the common words
      const name = !askedForName && isProperNounGloss(gloss);
      return { d, tier, name, freq: d.frequency ?? 0, score: h.score };
    });
    ranked.sort((a, b) => Number(a.name) - Number(b.name) || b.tier - a.tier || (a.tier > 1 ? b.freq - a.freq : 0) || b.score - a.score || b.freq - a.freq);
    const seen = new Set<string>();
    const chosen: KbIndexDoc[] = [];
    for (const r of ranked) {
      if (!r.d.strong || seen.has(r.d.strong)) continue;
      seen.add(r.d.strong);
      chosen.push(r.d);
      if (chosen.length >= max) break;
    }
    const out = await Promise.all(
      chosen.map(async (d) => {
        const entry = (await lex.getEntry(d.extendedStrong ?? d.strong!)) as LocalLexiconEntry | null;
        if (!entry) return null;
        return lexiconEvidence(entry, localOccurrences(await lex.getOccurrences(entry.strong)), sources, { senseFrequency: d.frequency });
      }),
    );
    return out.filter((e): e is EvidenceDraft => e !== null);
  }

  async occurrences(strong: string, limit = 40): Promise<EvidenceDraft | null> {
    const n = normalizeStrong(strong.trim().toUpperCase());
    if (!n) return null;
    const lex = this.providers.lexicon;
    const all = localOccurrences(await lex.getOccurrences(n.suffix ? n.extended : n.base));
    if (!all || !all.total) return null;
    const entry = (await lex.getEntry(n.extended)) as LocalLexiconEntry | null;
    const senses: { extendedStrong: string; gloss: string; occ: LocalOccurrences }[] = [];
    if (!n.suffix && entry?.otherSenses?.length) {
      // a lemma with several senses/entities: where each one occurs (apoluō “release” vs “divorce”)
      const list = [{ extendedStrong: entry.extendedStrong, gloss: entry.gloss }, ...entry.otherSenses].slice(0, 6);
      for (const s of list) {
        const occ = localOccurrences(await lex.getOccurrences(s.extendedStrong));
        if (occ && occ.total && occ.total < all.total) senses.push({ extendedStrong: s.extendedStrong, gloss: s.gloss, occ });
      }
    }
    return occurrencesEvidence(n.suffix ? n.extended : n.base, entry, all, senses, clampLimit(limit, 40, 200), this.providers.sources);
  }

  /* ---------------------------------------------------------------- */
  /* Cross-references                                                  */
  /* ---------------------------------------------------------------- */

  async crossReferences(ref: PassageRef, limit = 20): Promise<EvidenceDraft[]> {
    const max = clampLimit(limit, 20, 60);
    const list = await this.providers.crossReferences.getCrossReferences(ref).catch(() => []);
    if (!list.length) return [];
    const best = new Map<string, XrefTarget>();
    for (const x of list) {
      if (x.target.book === ref.book && refsOverlap(x.target, ref)) continue;
      const key = `${x.target.book}.${x.target.startChapter}.${x.target.startVerse ?? ''}-${x.target.endChapter ?? ''}.${x.target.endVerse ?? ''}`;
      const prev = best.get(key);
      if (!prev || x.score > prev.votes) best.set(key, { from: x.from, target: x.target, votes: x.score });
    }
    const top = [...best.values()].sort((a, b) => b.votes - a.votes).slice(0, max);
    if (!top.length) return [];
    const sourceId = list[0].sourceId;
    const byVerse = new Map<string, XrefTarget[]>();
    for (const t of top) byVerse.set(verseKey(t.from), [...(byVerse.get(verseKey(t.from)) ?? []), t]);
    if (byVerse.size === 1) {
      const only = top[0].from;
      const from = ref.startVerse != null && ref.startVerse === ref.endVerse ? ref : ref.startVerse == null ? ref : { book: only.book, startChapter: only.chapter, startVerse: only.verse, endChapter: only.chapter, endVerse: only.verse };
      return [crossReferenceEvidence(from, top, sourceId, this.providers.sources)];
    }
    return [...byVerse.values()]
      .sort((a, b) => a[0].from.chapter - b[0].from.chapter || a[0].from.verse - b[0].from.verse)
      .map((targets) => {
        const v = targets[0].from;
        return crossReferenceEvidence({ book: v.book, startChapter: v.chapter, startVerse: v.verse, endChapter: v.chapter, endVerse: v.verse }, targets, sourceId, this.providers.sources);
      });
  }

  /* ---------------------------------------------------------------- */
  /* Commentary & introductions                                        */
  /* ---------------------------------------------------------------- */

  async commentary(ref: PassageRef, sources?: string[], query?: string): Promise<EvidenceDraft[]> {
    const book = tryGetBook(ref.book);
    // with a query: the part of each long section on that point (Calvin on Gen 1:26 reaches “plurality of Persons” only past the first excerpt)
    const terms = query ? termSet(query) : undefined;
    if (!book) return [];
    const wanted = sources?.length ? LOCAL_COMMENTARIES.filter((c) => sources.includes(c.id)) : LOCAL_COMMENTARIES;
    const perCommentary = await Promise.all(
      wanted
        .filter((c) => c.testaments.includes(book.testament))
        .map(async (info) => {
          let sections;
          try {
            sections = await this.providers.commentary.getCommentary(info.id, ref);
          } catch (err) {
            this.log(`commentary ${info.id} on ${ref.book} unavailable: ${err instanceof Error ? err.message : String(err)}`);
            return [];
          }
          const cap = info.id === 'tyndale' ? TYNDALE_NOTES_PER_CALL : CLASSIC_SECTIONS_PER_CALL;
          const authorId = commentaryAuthorId(info.id, ref.book);
          return pickSections(sections, ref, cap).map((s) =>
            commentaryEvidence({
              commentaryId: info.id,
              commentaryName: info.name,
              sectionRef: s.ref,
              requested: ref,
              text: focusOnVerse(s.text, s.ref, ref),
              fullText: s.text,
              sourceId: s.sourceId,
              authorId,
              sources: this.providers.sources,
              ...(terms?.size ? { terms } : {}),
            }),
          );
        }),
    );
    return perCommentary.flat();
  }

  async bookIntroduction(book: BookId): Promise<EvidenceDraft[]> {
    if (!tryGetBook(book)) return [];
    await this.ready();
    const { docs } = this.index;
    return (this.introsByBook.get(book) ?? []).map((i) => docEvidence(docs[i], this.providers.sources, new Set(), PART_EXCERPT_CHARS));
  }

  /* ---------------------------------------------------------------- */
  /* Multi-part texts                                                  */
  /* ---------------------------------------------------------------- */

  /** Texts the index holds in several parts (“… (part 4)”), keyed by their normalised title. */
  private partGroups(): Map<string, PartGroup> {
    if (this.partGroupsCache) return this.partGroupsCache;
    const { docs } = this.index;
    const groups = new Map<string, PartGroup>();
    docs.forEach((d, i) => {
      const m = PART_RE.exec(d.title);
      if (!m) return;
      const title = d.title.slice(0, m.index).trim();
      const key = normTitle(title);
      let g = groups.get(key);
      if (!g) {
        g = { title, heading: (d.heading ?? title).replace(PART_RE, '').trim(), parts: [] };
        groups.set(key, g);
      }
      g.parts.push({ part: Number(m[1]), id: i });
    });
    for (const g of groups.values()) g.parts.sort((a, b) => a.part - b.part);
    // a book's introduction, its sections numbered as bookIntroduction returns them (book_introduction shows a few and lists the rest)
    for (const [book, ids] of this.introsByBook) {
      const title = introTitle(book);
      groups.set(normTitle(title), { title, heading: `${getBook(book).name} introduction`, parts: ids.map((id, n) => ({ part: n + 1, id })), sections: true });
    }
    this.partGroupsCache = groups;
    return groups;
  }

  partsOf(title: string): { title: string; part: number; total: number } | null {
    const m = PART_RE.exec(title);
    if (!m) return null;
    const g = this.partGroups().get(normTitle(title.slice(0, m.index)));
    return g && g.parts.length > 1 ? { title: g.title, part: Number(m[1]), total: g.parts.length } : null;
  }

  async documentParts(name: string, opts: { parts?: number[]; query?: string } = {}): Promise<DocumentParts> {
    await this.ready();
    const groups = this.partGroups();
    const q = normTitle(name.replace(PART_RE, ''));
    if (!q) return { found: false, candidates: [] };
    let g = groups.get(q);
    if (!g) {
      // the heading alone (“Divorce (in Moral Theology), 1909”), or a longer or shorter form of the title
      const all = [...groups.values()];
      const byHeading = all.filter((x) => normTitle(x.heading) === q);
      const near = byHeading.length
        ? byHeading
        : all.filter((x) => {
            const t = normTitle(x.title);
            const h = normTitle(x.heading);
            return t.includes(q) || (h.length >= 6 && q.includes(h));
          });
      if (near.length !== 1) {
        return { found: false, candidates: near.slice(0, 8).map((x) => `${x.title} (${x.parts.length} parts)`) };
      }
      g = near[0];
    }
    const { docs, index } = this.index;
    const sources = this.providers.sources;
    const byPart = new Map(g.parts.map((p) => [p.part, p.id]));
    const asked = [...new Set(opts.parts ?? [])].slice(0, MAX_PARTS_PER_CALL);
    const unknownParts = asked.filter((n) => !byPart.has(n));
    let ids = asked.map((n) => byPart.get(n)).filter((i): i is number => i != null);
    const terms = new Set(opts.query ? queryTerms(opts.query) : []);
    if (!asked.length && opts.query) {
      const inGroup = new Set(g.parts.map((p) => p.id));
      const hits = index.search(searchQuery(opts.query), { filter: (r) => inGroup.has(r.id as number) });
      ids = hits.slice(0, 3).map((h) => h.id as number);
    }
    const contents = g.parts.map((p) => `part ${p.part}: ${g.sections ? introSectionHeading(docs[p.id].title) : openingWords(docs[p.id].text, 14)}`);
    const drafts = ids.map((i) => docEvidence(docs[i], sources, terms, PART_EXCERPT_CHARS));
    return { found: true, title: g.title, total: g.parts.length, drafts, contents, unknownParts };
  }
}

interface PartGroup {
  /** full title without the part number, e.g. "The Catholic Encyclopedia (1907–1914) — Divorce (in Moral Theology), 1909" */
  title: string;
  /** the bare heading, e.g. "Divorce (in Moral Theology), 1909" */
  heading: string;
  parts: { part: number; id: number }[];
  /** a book's introduction: its parts are its sections, listed by their headings */
  sections?: boolean;
}

/** “… (part 4)” at the end of a title (a tradition tag may follow: “… (part 4) [Methodist]”). */
const PART_RE = /\s*\(part (\d+)\)(?=\s*(?:\[[^\]]*\])?\s*$)/i;
const MAX_PARTS_PER_CALL = 4;

function normTitle(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** The first `n` words of a text (for a list of parts). */
function openingWords(text: string, n: number): string {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  return words.length > n ? `${words.slice(0, n).join(' ')}…` : words.join(' ');
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

interface Hit {
  id: number;
  score: number;
  terms: string[];
}

/** Kinds whose texts can state a tradition's view (confessions, reference works, commentary, curated items). */
const STATEMENT_KINDS: ReadonlySet<EvidenceKind> = new Set(['confession', 'dictionary', 'commentary', 'study-note', 'book-introduction', 'curated']);

/** Words of a reader's question that name the Bible, not the subject ("what does the Bible say about suicide" → "suicide"). */
const QUESTION_FILLER = new Set(['bible', 'bibles', 'biblical', 'biblically', 'scripture', 'scriptures', 'say', 'says', 'said', 'does', 'do', 'teach', 'teaches']);

/** The BM25 query for reader input: question phrasing and Bible-filler words removed (the input itself when nothing is left). */
export function searchQuery(query: string): string {
  const topic = normalizeTopicQuery(query);
  const words = (topic || query).split(/\s+/).filter((w) => w && !QUESTION_FILLER.has(w.toLowerCase()));
  return words.length ? words.join(' ') : query;
}

/** The query's own words (lower case, 3+ letters, not stopwords), for the stem-collision check. */
function tokenizeWords(query: string): string[] {
  return normPhrase(query)
    .split(' ')
    .filter((w) => w.length >= 3 && /^[a-z]+$/.test(w) && queryTerms(w).length > 0);
}

/**
 * Does the text use this word (or an inflection of it)? A token must start with the
 * word's stem and, when stemming shortened the word, be longer than the stem: "care"
 * (stem "car") is used by "care", "cares", "careful", "caring" — never by the "car" of
 * BETH-CAR.
 */
function usesWord(text: string, word: string): boolean {
  const s = queryTerms(word)[0] ?? word;
  const exact = s === word;
  const re = new RegExp(`(?<![a-z])${s}[a-z]*`, 'gi');
  for (const m of text.matchAll(re)) {
    const t = m[0].toLowerCase();
    if (exact || t.length > s.length) return true;
  }
  return false;
}

/** A lexicon gloss naming a person or place ("Elonbeth-hanan", "Jerusalem"). */
function isProperNounGloss(gloss: string): boolean {
  const g = gloss.replace(/^\s*(?:to|a|an|the)\s+/i, '').trim();
  return /^\p{Lu}/u.test(g);
}

/**
 * Breadth first, then relevance: the best hit of every evidence kind that is
 * reasonably relevant (≥ 10 % of the top score) — a topic entry, a dictionary
 * article, a study note, a curated item… — then the best of the rest with at most
 * ⌈limit/3⌉ (≥ 2) per corpus and no near-duplicates, then anything left. Final
 * order by score.
 */
function diversify<T extends { score: number }>(
  ranked: T[],
  limit: number,
  by: { kindOf: (h: T) => string; corpusOf: (h: T) => string; sameCluster: (a: T, b: T) => boolean; perCorpus?: number },
): T[] {
  const { kindOf, corpusOf, sameCluster } = by;
  const top = ranked[0]?.score ?? 0;
  const picked = new Set<T>();
  const counts = new Map<string, number>();
  const take = (h: T) => {
    picked.add(h);
    counts.set(corpusOf(h), (counts.get(corpusOf(h)) ?? 0) + 1);
  };
  const kinds = new Set<string>();
  for (const h of ranked) {
    if (picked.size >= limit) break;
    const k = kindOf(h);
    if (kinds.has(k)) continue;
    kinds.add(k);
    if (h.score >= top * 0.1) take(h);
  }
  const cap = by.perCorpus ?? Math.max(2, Math.ceil(limit / 3));
  for (const h of ranked) {
    if (picked.size >= limit) break;
    if (picked.has(h) || (counts.get(corpusOf(h)) ?? 0) >= cap) continue;
    if ([...picked].some((p) => sameCluster(h, p))) continue;
    take(h);
  }
  for (const h of ranked) {
    if (picked.size >= limit) break;
    if (!picked.has(h)) take(h);
  }
  return [...picked].sort((a, b) => b.score - a.score);
}

/**
 * How well a topic phrase matches an index heading or keyword, 0–1: exact (1),
 * same stems (0.95), whole-word containment (0.5–0.9 by length ratio). Stemmed
 * containment only counts for stems of 4+ letters (the light stemmer maps both
 * “care” and “car” to “car”, which must not make BETH-CAR a match for “care”).
 */
function topicMatch(phrase: string, heading: string): number {
  const p = normPhrase(phrase);
  const h = normPhrase(heading);
  if (!p || !h) return 0;
  if (p === h) return 1;
  const ps = stemPhrase(p);
  const hs = stemPhrase(h);
  if (ps === hs) return 0.95;
  const contains = (a: string, b: string) => ` ${a} `.includes(` ${b} `) || ` ${b} `.includes(` ${a} `);
  const ratio = (a: string, b: string) => Math.min(a.length, b.length) / Math.max(a.length, b.length);
  if (contains(p, h)) return 0.5 + 0.4 * ratio(p, h);
  if (contains(ps, hs) && ps.split(' ').every((t) => t.length >= 4)) return 0.5 + 0.4 * ratio(ps, hs);
  return 0;
}

/** Sections to show: the narrowest ones that contain the passage start first, then canonical order; at most `cap`. */
function pickSections<S extends { ref: PassageRef }>(sections: S[], ref: PassageRef, cap: number): S[] {
  if (sections.length <= cap) return sections;
  const span = (r: PassageRef) => ((r.endChapter ?? r.startChapter) - r.startChapter) * 200 + ((r.endVerse ?? 200) - (r.startVerse ?? 1));
  const startsInside = (s: S) => refsOverlap(s.ref, { book: ref.book, startChapter: ref.startChapter, startVerse: ref.startVerse ?? 1, endChapter: ref.startChapter, endVerse: ref.startVerse ?? 1 });
  const chosen = [...sections]
    .map((s, i) => ({ s, i }))
    .sort((a, b) => Number(startsInside(b.s)) - Number(startsInside(a.s)) || (startsInside(a.s) ? span(a.s.ref) - span(b.s.ref) : a.i - b.i))
    .slice(0, cap);
  return chosen.sort((a, b) => a.i - b.i).map((x) => x.s);
}

/**
 * A long classic section covering several verses, asked about a later verse: start
 * the text at the paragraph that takes that verse up (Calvin numbers paragraphs
 * “3. …”, Henry and JFB cite “Rom 8:3”), so the excerpt is about the verse asked for.
 */
function focusOnVerse(text: string, section: PassageRef, ref: PassageRef): string {
  if (text.length <= COMMENTARY_EXCERPT_CHARS || ref.startVerse == null) return text;
  if (section.startChapter === ref.startChapter && (section.startVerse ?? 1) >= ref.startVerse) return digestRange(text, section, ref) ?? text;
  const v = ref.startVerse;
  const c = ref.startChapter;
  // how the commentaries cite the book: "Romans 8:3", "Rom 8:3", "Rom. 8:3", "1Co 7:10"
  const book = getBook(ref.book);
  const names = [...new Set([book.name, book.abbrev, book.abbrev.replace(/\s+/g, ''), book.name.replace(/\s+/g, '').slice(0, 3)])].map(escapeRegExp).join('|');
  const patterns = [new RegExp(`(?:^|\\n\\n)${v}\\. `), new RegExp(`\\b(?:${names})\\.? ${c}:${v}\\b`), new RegExp(`\\bver(?:se|\\.)? ${v}\\b`, 'i')];
  for (const re of patterns) {
    const m = re.exec(text);
    if (!m || m.index < 200) continue;
    const para = text.lastIndexOf('\n\n', m.index + 1);
    const start = para >= 0 && m.index - para < 1200 ? para + 2 : m.index + (m[0].startsWith('\n') ? 2 : 0);
    return `[…] ${text.slice(start).trimStart()}`;
  }
  return text;
}

/** A work's name with its date when the name has none ("The Heidelberg Catechism (1563)"): texts carry their dates. */
export function datedWork(title: string, year: string | undefined): string {
  if (!year || /\b\d{3,4}\b/.test(title)) return title;
  return `${title} (${year.replace(/\s*\(([^)]*)\)/g, ', $1').trim()})`;
}

/**
 * A long section asked about as a range (“Matthew 19:3–12” over Calvin on 19:3–9): the
 * section's opening and the start of each numbered paragraph that takes up a later verse
 * of the range (Calvin and JFB number them “9. …”), within the excerpt budget, so the
 * crux verse is not cut off by the length limit. Null when the section has no such
 * paragraphs (the caller then shows it from the start).
 */
export function digestRange(text: string, section: PassageRef, ref: PassageRef, budget = COMMENTARY_EXCERPT_CHARS - 40): string | null {
  const endVerse = ref.endVerse ?? ref.startVerse;
  if (ref.startVerse == null || endVerse == null || endVerse <= ref.startVerse || (ref.endChapter ?? ref.startChapter) !== ref.startChapter) return null;
  const first = section.startChapter === ref.startChapter ? (section.startVerse ?? 1) : 1;
  const marks: number[] = [];
  let last = first;
  for (const m of text.matchAll(/(?:^|\n\n)(\d{1,3})\. /g)) {
    const v = Number(m[1]);
    if (m.index === 0 || v <= last || v < ref.startVerse || v > endVerse) continue;
    marks.push(m.index + (m[0].startsWith('\n') ? 2 : 0));
    last = v;
  }
  if (!marks.length) return null;
  // paragraphs besides the opening, about 190 characters each at worst (7 in 1,560 characters), spread over the range, the last one kept
  const keep = Math.min(marks.length, Math.max(2, Math.floor(budget / 190) - 1));
  const picked = keep === marks.length ? marks : Array.from({ length: keep }, (_, i) => marks[Math.round((i * (marks.length - 1)) / (keep - 1))]);
  const starts = [0, ...new Set(picked)];
  const share = Math.floor(budget / starts.length) - 8;
  return starts.map((at, i) => clipChunk(text.slice(at, starts[i + 1]), share)).join('\n\n[…] ');
}

/** A chunk of text cut to `max` characters at a sentence end (or a word, with “…”). */
function clipChunk(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = cut.lastIndexOf('. ');
  return at > max * 0.5 ? cut.slice(0, at + 1) : `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 0)).trimEnd()}…`;
}

/* ------------------------------------------------------------------ */
/* Factory & singleton                                                 */
/* ------------------------------------------------------------------ */

export function createKnowledgeBase(options: KnowledgeBaseOptions): EmmausKnowledgeBase {
  return new KnowledgeBaseImpl(options);
}

const instances = new Map<string, EmmausKnowledgeBase>();

/** The process-wide knowledge base for a project root (created on first use; call ready() before use). */
export function getKnowledgeBase(root: string, options: Omit<KnowledgeBaseOptions, 'root'> = {}): EmmausKnowledgeBase {
  const key = resolve(root);
  let kb = instances.get(key);
  if (!kb) {
    kb = createKnowledgeBase({ ...options, root: key });
    instances.set(key, kb);
  }
  return kb;
}

/** Forget the knowledge base of a root (e.g. after kb/corpus changed): the next getKnowledgeBase builds a fresh one. */
export function resetKnowledgeBase(root: string): void {
  instances.delete(resolve(root));
}

/**
 * A cheap fingerprint of kb/corpus (file names, sizes and modification times, no
 * reads): compare it between requests to notice corpora added, rebuilt or removed
 * while the server runs.
 */
export async function corpusFingerprint(root: string, corpusDir = join(resolve(root), 'kb', 'corpus')): Promise<string> {
  let names: string[];
  try {
    names = (await readdir(corpusDir)).filter((n) => n.endsWith('.json')).sort();
  } catch {
    return 'none';
  }
  const parts = await Promise.all(
    names.map(async (n) => {
      try {
        const st = await stat(join(corpusDir, n));
        return `${n}:${st.size}:${Math.round(st.mtimeMs)}`;
      } catch {
        return `${n}:gone`;
      }
    }),
  );
  return parts.join('|');
}

/** Tradition families asked for, with the members of a broad family ("protestant" → reformed, lutheran…). */
function expandFamilies(ids: readonly string[]): Set<string> {
  const out = new Set<string>();
  for (const id of ids) {
    out.add(id);
    for (const m of traditionFamily(id)?.members ?? []) out.add(m);
  }
  return out;
}
