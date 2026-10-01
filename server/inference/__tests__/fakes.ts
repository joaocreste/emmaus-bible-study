/**
 * Test doubles for the inference layer:
 *
 * - FakeModelClient replays scripted assistant turns (the seam is `ModelClient.stream`),
 *   streaming their blocks one by one (so composition calls run before the turn ends) and
 *   recording the params of every request so tests can inspect tool results and
 *   system messages the loop sent back.
 * - createFakeKb() is a KnowledgeBase whose retrieval methods return fixed fixture
 *   evidence (deterministic ledger ids), backed by the REAL bundled providers
 *   (public/data: BSB verse counts and text, tagged Greek/Hebrew, STEPBible lexicon)
 *   so validation and hydration run against real data.
 *
 * Fixture texts are verbatim excerpts of public-domain / openly licensed works
 * (Nave's, Torrey's, Easton's, Tyndale Open Study Notes, Calvin, JFB, the Westminster
 * Confession, the Council of Trent) — test data only.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { BookId, PassageRef, TranslationId } from '../../../src/domain/models';
import { formatRef, parseRefKey, refsOverlap } from '../../../src/domain/reference';
import type { EvidenceDraft, EvidenceKind } from '../../../src/inference/protocol';
import { createCuratedProvidersFrom } from '../../../src/providers/curated';
import { createLocalDatasetProviders } from '../../../src/providers/local';
import { createFsLoader } from '../../../src/providers/local/__tests__/fsLoader';
import type { ProviderRegistry } from '../../../src/providers/types';
import type { KbHoldings, KnowledgeBase, SearchOptions } from '../../kb/types';
import type { InferenceConfig } from '../config';
import { blockEndWatcher, type BetaContentBlock, type BetaMessage, type BetaRawMessageStreamEvent, type EndedBlock, type ModelClient, type ModelStream, type StreamParams } from '../modelClient';

/* ------------------------------------------------------------------ */
/* Providers                                                           */
/* ------------------------------------------------------------------ */

let providersCache: ProviderRegistry | null = null;

/** Real local dataset providers (fs loader, no network) + the source registry (no curated studies). */
export function realProviders(): ProviderRegistry {
  if (providersCache) return providersCache;
  const local = createLocalDatasetProviders({ loader: createFsLoader(), allowRemoteFallback: false } as never);
  const curated = createCuratedProvidersFrom({ studies: [], topics: [] });
  providersCache = { ...local, ...curated };
  return providersCache;
}

/**
 * Scripture as read_passage returns it (real BSB/KJV/WEB text, verse-numbered): a key
 * passage must have been read in the request, not only listed by an index.
 */
export async function scriptureEvidence(reference: string, translation: TranslationId = 'BSB'): Promise<EvidenceDraft> {
  const { parseReference } = await import('../../../src/domain/reference');
  const ref = parseReference(reference);
  if (!ref) throw new Error(`not a reference: ${reference}`);
  const p = await realProviders().scripture.getPassage(ref, translation);
  const text = p.chapters.flatMap((c) => c.verses.map((v) => `${c.chapter}:${v.ref.verse} ${v.text}`)).join('\n');
  return { kind: 'scripture', title: `${formatRef(ref)} (${translation})`, text, sourceId: translation.toLowerCase(), refs: [ref], quotable: true, locator: formatRef(ref) };
}

/* ------------------------------------------------------------------ */
/* Fixture evidence                                                    */
/* ------------------------------------------------------------------ */

const refs = (...keys: string[]): PassageRef[] => keys.map((k) => parseRefKey(k)).filter((r): r is PassageRef => r != null);

export const NAVES_DIVORCE: EvidenceDraft = {
  kind: 'topical-index',
  title: 'Nave’s Topical Bible — DIVORCE',
  text: 'General scriptures concerning: Exodus 21:7–11; Deuteronomy 21:10–14; Deuteronomy 24:1–4; Ezra 10:1–16; Nehemiah 13:23–30; Jeremiah 3:1; Micah 2:9; Malachi 2:14–16; Matthew 5:31–32; Matthew 19:3–12; Mark 10:2; Luke 16:18; 1 Corinthians 7:10–17\nDisobedience of the wife to the husband, a sufficient cause for, in the Persian empire: Esther 1:10–22\nFigurative: Isaiah 50:1; Isaiah 54:4; Jeremiah 3:8\nSee also: MARRIAGE',
  sourceId: 'naves-topical-bible',
  authorId: 'orville-nave',
  locator: 's.v. DIVORCE',
  url: 'https://www.ccel.org/ccel/nave/bible.d.html?term=divorce',
  refs: refs('EXO.21.7-11', 'DEU.24.1-4', 'MAL.2.14-16', 'MAT.5.31-32', 'MAT.19.3-12', 'MRK.10.2', 'LUK.16.18', '1CO.7.10-17', 'ISA.50.1', 'JER.3.8'),
  quotable: true,
};

export const TORREY_DIVORCE: EvidenceDraft = {
  kind: 'topical-index',
  title: 'Torrey’s New Topical Textbook — Divorce',
  text: 'Law of marriage against: Genesis 2:24; Matthew 19:6\nPermitted — By the Mosaic law: Deuteronomy 24:1\nPermitted — On account of hardness of heart: Matthew 19:8\nOften sought by the Jews: Micah 2:9; Malachi 2:14\nSought on slight grounds: Matthew 5:31; Matthew 19:3\nForbidden by Christ except for adultery: Matthew 5:32; Matthew 19:9',
  sourceId: 'torreys-topical-textbook',
  authorId: 'ra-torrey',
  locator: 's.v. Divorce',
  url: 'https://www.ccel.org/ccel/torrey/ttt.d.html?term=divorce',
  refs: refs('GEN.2.24', 'MAT.19.6', 'DEU.24.1', 'MAT.19.8', 'MIC.2.9', 'MAL.2.14', 'MAT.5.31', 'MAT.19.3', 'MAT.5.32', 'MAT.19.9'),
  quotable: true,
};

export const EASTON_DIVORCE: EvidenceDraft = {
  kind: 'dictionary',
  title: 'Easton’s Bible Dictionary — Divorce',
  text: 'The dissolution of the marriage tie was regulated by the Mosaic law (Deut. 24:1-4). The Jews, after the Captivity, were reguired to dismiss the foreign women they had married contrary to the law (Ezra 10:11-19). Christ limited the permission of divorce to the single case of adultery. It seems that it was not uncommon for the Jews at that time to dissolve the union on very slight pretences (Matt. 5:31, 32; 19:1-9; Mark 10:2-12; Luke 16:18). These precepts given by Christ regulate the law of divorce in the Christian Church.',
  sourceId: 'eastons-bible-dictionary',
  authorId: 'mg-easton',
  locator: 's.v. Divorce',
  url: 'https://www.ccel.org/ccel/easton/ebd2.html?term=Divorce',
  refs: refs('DEU.24.1-4', 'EZR.10.11-19', 'MAT.5.31-32', 'MAT.19.1-9', 'MRK.10.2-12', 'LUK.16.18'),
  quotable: true,
};

export const TYNDALE_MAT_19_3: EvidenceDraft = {
  kind: 'study-note',
  title: 'Tyndale note on Matthew 19:3',
  text: 'There were two divergent views on when one was allowed to divorce one’s wife. One group of Pharisees, following Rabbi Shammai, argued that divorce was allowed only in the case of adultery or other grave sin, while the other group, following Rabbi Hillel, contended that a man could divorce his wife for any reason, such as if she burned his dinner.',
  sourceId: 'tyndale-open-study-notes',
  locator: 'note on Matt 19:3',
  refs: refs('MAT.19.3'),
  quotable: true,
};

export const CALVIN_MAT_19_3: EvidenceDraft = {
  kind: 'commentary',
  title: 'Calvin on Matthew 19:3–9',
  text: 'Matthew 19:3. And the Pharisees came to him, tempting him. Though the Pharisees lay snares for Christ, and cunningly endeavor to impose upon him, yet their malice proves to be highly useful to us; as the Lord knows how to turn, in a wonderful manner, to the advantage of his people all the contrivances of wicked men to overthrow sound doctrine. For, by means of this occurrence, a question arising out of the liberty of divorce was settled, and a fixed law was laid down as to the sacred and indissoluble bond of marriage.',
  sourceId: 'calvin-commentaries',
  authorId: 'calvin',
  locator: 'Harmony of the Evangelists, on Matt 19:3',
  refs: refs('MAT.19.3-9'),
  quotable: true,
};

export const JFB_MAT_19_8: EvidenceDraft = {
  kind: 'commentary',
  title: 'Jamieson-Fausset-Brown on Matthew 19:8',
  text: 'He saith unto them, Moses—as a civil lawgiver.\n\nbecause of—or "having respect to."\n\nthe hardness of your hearts—looking to your low moral state, and your inability to endure the strictness of the original law.\n\nsuffered you to put away your wives—tolerated a relaxation of the strictness of the marriage bond—not as approving of it, but to prevent still greater evils.',
  sourceId: 'jfb-commentary',
  locator: 'on Matt 19:8',
  refs: refs('MAT.19.8'),
  quotable: true,
};

export const WCF_24_5: EvidenceDraft = {
  kind: 'confession',
  title: 'Westminster Confession of Faith 24.5 — Of Marriage and Divorce',
  text: 'Adultery or fornication committed after a contract, being detected before marriage, giveth just occasion to the innocent party to dissolve that contract. In the case of adultery after marriage, it is lawful for the innocent party to sue out a divorce: and, after the divorce, to marry another, as if the offending party were dead.',
  sourceId: 'westminster-confession',
  authorId: 'westminster-assembly',
  tradition: 'Reformed',
  locator: 'ch. 24 §5',
  refs: refs('MAT.5.31-32', 'MAT.19.9'),
  quotable: true,
};

export const TRENT_24_7: EvidenceDraft = {
  kind: 'confession',
  title: 'Council of Trent, Session 24, Canon 7 (Catholic)',
  text: 'If any one saith, that the Church has erred, in that she hath taught, and doth teach, in accordance with the evangelical and apostolical doctrine, that the bond of matrimony cannot be dissolved on account of the adultery of one of the married parties; and that both, or even the innocent one who gave not occasion to the adultery, cannot contract another marriage, during the life-time of the other; let him be anathema.',
  sourceId: 'council-of-trent-session-24',
  tradition: 'Catholic',
  locator: 'Session 24, Canon 7',
  refs: [],
  quotable: true,
};

/** What the fake knowledge base holds (mirrors the shape of the real inventory). */
export const FAKE_HOLDINGS: KbHoldings = {
  kinds: { 'topical-index': 2, dictionary: 1, 'study-note': 1, confession: 2, lexicon: 3 },
  traditions: [
    { family: 'reformed', label: 'Reformed', documents: 1, kinds: ['confession', 'dictionary', 'commentary'], works: ['Westminster Confession of Faith', 'Easton’s Bible Dictionary (1897)', 'Calvin’s Commentaries'] },
    { family: 'catholic', label: 'Catholic', documents: 1, kinds: ['confession'], works: ['Council of Trent'] },
  ],
  missing: ['Eastern Orthodox', 'Lutheran', 'Anglican', 'Arminian / Methodist / Wesleyan', 'Baptist', 'Anabaptist / Mennonite', 'Pentecostal / Charismatic'],
};

/** A summary-only item (copyrighted modern work): may be summarised, never quoted. */
export const SUMMARY_ONLY_NOTE: EvidenceDraft = {
  kind: 'curated',
  title: 'Catechism of the Catholic Church on divorce (summary)',
  text: 'The Catechism teaches that divorce is a grave offense against the natural law because it claims to break the contract to which the spouses freely consented to live with each other till death.',
  sourceId: 'catechism-catholic-church',
  locator: '§2384',
  quotable: false,
};

/* ------------------------------------------------------------------ */
/* Fake knowledge base                                                 */
/* ------------------------------------------------------------------ */

export interface FakeKbOptions {
  /** override any retrieval method (or the holdings) */
  overrides?: Partial<Omit<KnowledgeBase, 'providers' | 'ready' | 'stats'>>;
  /** knowledge-base version reported by stats() */
  version?: string;
  /** ready() rejects with this */
  failReady?: Error;
}

export interface FakeKb extends KnowledgeBase {
  calls: { method: string; args: unknown[] }[];
}

/** English lexicon lookups the fake knows (Strong's lookups use the real lexicon). */
const ENGLISH_LEXICON: Record<string, string[]> = { divorce: ['G630', 'G647', 'H3748'] };

export function createFakeKb(options: FakeKbOptions = {}): FakeKb {
  const providers = realProviders();
  const calls: FakeKb['calls'] = [];
  const log = (method: string, ...args: unknown[]) => calls.push({ method, args });

  const lexiconDraft = async (strong: string): Promise<EvidenceDraft | null> => {
    const e = await providers.lexicon.getEntry(strong);
    if (!e) return null;
    const occ = await providers.lexicon.getOccurrences(strong, 1);
    return {
      kind: 'lexicon',
      title: `${e.strong} ${e.lemma} (${e.transliteration}) — ${e.gloss}`,
      text: `${e.strong} ${e.lemma} (${e.transliteration}), ${e.partOfSpeech ?? ''}: ${e.gloss}${occ ? ` — in ${occ.total} verses` : ''}\n${e.definition}`,
      sourceId: e.sourceId,
      locator: e.strong,
      strong: e.strong,
      quotable: true,
    };
  };

  const kb: FakeKb = {
    calls,
    providers,
    async ready() {
      if (options.failReady) throw options.failReady;
    },
    stats() {
      return {
        documents: 4,
        corpora: [
          { id: 'naves', label: 'Nave’s Topical Bible (1896)', documents: 1 },
          { id: 'easton', label: 'Easton’s Bible Dictionary (1897)', documents: 1 },
        ],
        ...(options.version ? { version: options.version } : {}),
      };
    },
    holdings() {
      return FAKE_HOLDINGS;
    },
    async search(query: string, opts: SearchOptions = {}) {
      log('search', query, opts);
      const kinds = opts.kinds;
      const pool: EvidenceDraft[] = [EASTON_DIVORCE, TYNDALE_MAT_19_3, WCF_24_5, TRENT_24_7, NAVES_DIVORCE];
      const wanted = (k: EvidenceKind) => !kinds?.length || kinds.includes(k);
      if (!/divorc|adulter|marri|remarr/i.test(query)) return [];
      return pool.filter((d) => wanted(d.kind)).slice(0, opts.limit ?? 8);
    },
    async topics(query: string) {
      log('topics', query);
      return /divorc/i.test(query) ? [NAVES_DIVORCE, TORREY_DIVORCE] : [];
    },
    async passage(ref: PassageRef, translation: TranslationId) {
      log('passage', ref, translation);
      const p = await providers.scripture.getPassage(ref, translation);
      const lines = p.chapters.flatMap((c) => c.verses.map((v) => `${c.chapter}:${v.ref.verse} ${v.text}`));
      return { kind: 'scripture', title: `${formatRef(ref)} (${translation})`, text: lines.join('\n'), sourceId: translation.toLowerCase(), locator: formatRef(ref), refs: [ref], quotable: true };
    },
    async originalText(ref: PassageRef) {
      log('originalText', ref);
      const verses = await providers.originalText.getOriginalText(ref);
      if (!verses.length) return null;
      const lines = verses.map((v) => `${v.ref.chapter}:${v.ref.verse} ${v.words.map((w) => `${w.surface} (${w.transliteration ?? ''}) ${w.strong} “${w.gloss}” ${w.morph ?? ''}`.trim()).join(' | ')}`);
      return {
        kind: 'original-text',
        title: `${verses[0].language === 'greek' ? 'Greek' : 'Hebrew'} text of ${formatRef(ref)}`,
        text: lines.join('\n'),
        sourceId: verses[0].sourceId,
        locator: formatRef(ref),
        refs: [ref],
        quotable: true,
      };
    },
    async lexicon(query: string) {
      log('lexicon', query);
      const q = query.trim();
      const strongs = /^[GH]\d+/i.test(q) ? [q.toUpperCase()] : (ENGLISH_LEXICON[q.toLowerCase()] ?? []);
      const out: EvidenceDraft[] = [];
      for (const s of strongs) {
        const d = await lexiconDraft(s);
        if (d) out.push(d);
      }
      return out;
    },
    async occurrences(strong: string) {
      log('occurrences', strong);
      const o = await providers.lexicon.getOccurrences(strong, 20);
      if (!o) return null;
      return {
        kind: 'occurrences',
        title: `Where ${strong} occurs`,
        text: `${strong} occurs in ${o.total} verses: ${o.refs.map((r) => formatRef({ book: r.book, startChapter: r.chapter, startVerse: r.verse })).join('; ')}`,
        sourceId: o.sourceId,
        strong,
        quotable: true,
      };
    },
    async crossReferences(ref: PassageRef) {
      log('crossReferences', ref);
      const x = await providers.crossReferences.getCrossReferences(ref);
      if (!x.length) return [];
      return [
        {
          kind: 'cross-references',
          title: `Cross-references for ${formatRef(ref)}`,
          text: x.slice(0, 12).map((c) => `${formatRef(c.target)} (${c.score} votes)`).join('; '),
          sourceId: 'openbible-xrefs',
          refs: x.slice(0, 12).map((c) => c.target),
          quotable: true,
        },
      ];
    },
    async commentary(ref: PassageRef) {
      log('commentary', ref);
      return [TYNDALE_MAT_19_3, CALVIN_MAT_19_3, JFB_MAT_19_8].filter((d) => d.refs?.some((r) => refsOverlap(r, ref)));
    },
    async bookIntroduction(book: BookId) {
      log('bookIntroduction', book);
      return [];
    },
    ...options.overrides,
  };
  return kb;
}

/* ------------------------------------------------------------------ */
/* Scripted model client                                               */
/* ------------------------------------------------------------------ */

/** Streams one content block now (start, input deltas, stop); `cut` sends only part of a tool's input JSON, as max_tokens or a refusal would. */
export type StreamBlock = (block: BetaContentBlock, options?: { cut?: boolean }) => Promise<void>;

/** Token counts of a turn attempt, as TurnRecord['usage'] counts them. */
export type FakeUsage = Partial<{ input: number; output: number; cacheRead: number; cacheCreation: number }>;

/** Streams message_start (and a message_delta) with this usage: what the stream's partialMessage() reports if the turn then fails. */
export type StartMessage = (usage?: FakeUsage) => void;

export type ScriptedTurn = (params: StreamParams, info: { signal?: AbortSignal; index: number; stream: StreamBlock; start: StartMessage }) => BetaMessage | Promise<BetaMessage>;

/**
 * Replays scripted turns. Unless `streaming: false`, each turn's content blocks are streamed
 * (content_block_start / input_json_delta / content_block_stop, through the real
 * blockEndWatcher) before its final message resolves, yielding to the event loop after each
 * block; a max_tokens or refusal turn's last tool_use is streamed cut off. A turn may stream
 * its blocks itself with `info.stream` (then nothing more is streamed for it), e.g. to fail
 * or hang midway, and report what it was billed before failing with `info.start`.
 */
export class FakeModelClient implements ModelClient {
  /** deep copies of the params of every request, in order */
  readonly requests: StreamParams[] = [];
  private index = 0;
  private readonly streaming: boolean;

  constructor(
    private readonly turns: ScriptedTurn[],
    options: { streaming?: boolean } = {},
  ) {
    this.streaming = options.streaming ?? true;
  }

  get calls(): number {
    return this.requests.length;
  }

  stream(params: StreamParams, options: { signal?: AbortSignal }): ModelStream {
    this.requests.push(structuredClone(params));
    const i = this.index++;
    const turn = this.turns[i];
    const signal = options.signal;
    const listeners: ((block: EndedBlock) => void)[] = [];
    const watch = blockEndWatcher((block) => listeners.forEach((l) => l(block)));
    let next = 0;
    let streamedByTurn = false;
    let partial: BetaMessage | null = null;
    const start: StartMessage = (u = {}) => {
      partial = { ...message([], null), usage: { input_tokens: u.input ?? 0, output_tokens: u.output ?? 0, cache_read_input_tokens: u.cacheRead ?? 0, cache_creation_input_tokens: u.cacheCreation ?? 0 } } as BetaMessage;
    };
    const send = async (block: BetaContentBlock, cut = false) => {
      if (signal?.aborted) throw new Anthropic.APIUserAbortError();
      for (const event of blockEvents(block, next++, cut)) watch(event);
      // like the SDK's currentMessage, what partialMessage() reports holds the blocks streamed so far
      if (partial) partial = { ...partial, content: [...partial.content, block] };
      await new Promise((resolve) => setTimeout(resolve, 0));
    };
    const stream: StreamBlock = (block, o = {}) => {
      streamedByTurn = true;
      return send(block, o.cut);
    };
    const run = async (): Promise<BetaMessage> => {
      await Promise.resolve(); // the loop registers its listener right after stream() returns
      if (signal?.aborted) throw new Anthropic.APIUserAbortError();
      if (!turn) throw new Error(`FakeModelClient: no scripted turn #${i + 1}`);
      const m = await turn(params, { signal, index: i, stream, start });
      if (this.streaming && !streamedByTurn) {
        const cutAt = m.stop_reason === 'max_tokens' || m.stop_reason === 'refusal' ? m.content.findLastIndex((b) => b.type === 'tool_use') : -1;
        for (const [k, block] of m.content.entries()) await send(block, k === cutAt);
      }
      return m;
    };
    const promise = run();
    promise.catch(() => {});
    return {
      finalMessage: () => promise,
      abort: () => {},
      partialMessage: () => partial,
      ...(this.streaming ? { onBlockEnd: (listener: (block: EndedBlock) => void) => void listeners.push(listener) } : {}),
    };
  }
}

/** The raw stream events of one content block; a tool's input JSON arrives in chunks (only its first half when `cut`). */
function blockEvents(block: BetaContentBlock, index: number, cut: boolean): BetaRawMessageStreamEvent[] {
  if (block.type !== 'tool_use') {
    return [{ type: 'content_block_start', index, content_block: block } as BetaRawMessageStreamEvent, { type: 'content_block_stop', index }];
  }
  const full = JSON.stringify(block.input) ?? '';
  const json = cut ? full.slice(0, Math.floor(full.length / 2)) : full;
  const deltas: BetaRawMessageStreamEvent[] = [];
  for (let at = 0; at < json.length; at += 64) deltas.push({ type: 'content_block_delta', index, delta: { type: 'input_json_delta', partial_json: json.slice(at, at + 64) } });
  return [
    { type: 'content_block_start', index, content_block: { type: 'tool_use', id: block.id, name: block.name, input: {} } } as BetaRawMessageStreamEvent,
    ...deltas,
    { type: 'content_block_stop', index },
  ];
}

let blockSeq = 0;

export function toolUse(name: string, input: unknown, id?: string): BetaContentBlock {
  return { type: 'tool_use', id: id ?? `toolu_${++blockSeq}`, name, input } as unknown as BetaContentBlock;
}

export function textBlock(text: string): BetaContentBlock {
  return { type: 'text', text, citations: null } as unknown as BetaContentBlock;
}

/** A mid-output server-side fallback boundary: the blocks before it came from a model that declined. */
export function fallbackBlock(to = 'claude-sonnet-5'): BetaContentBlock {
  return { type: 'fallback', from: { model: 'claude-opus-5' }, to: { model: to }, trigger: { type: 'refusal' } } as unknown as BetaContentBlock;
}

export function message(content: BetaContentBlock[], stop_reason: BetaMessage['stop_reason'] = 'tool_use', extra: Partial<{ model: string; cacheRead: number }> = {}): BetaMessage {
  return {
    id: `msg_${++blockSeq}`,
    type: 'message',
    role: 'assistant',
    model: extra.model ?? 'claude-opus-5',
    content,
    stop_reason,
    stop_sequence: null,
    usage: { input_tokens: 1200, output_tokens: 300, cache_read_input_tokens: extra.cacheRead ?? 5000, cache_creation_input_tokens: 0 },
  } as unknown as BetaMessage;
}

/** A turn that returns this message. */
export const reply =
  (content: BetaContentBlock[], stop: BetaMessage['stop_reason'] = 'tool_use', extra?: Partial<{ model: string; cacheRead: number }>): ScriptedTurn =>
  () =>
    message(content, stop, extra);

/** A turn that waits until the request is aborted, then rejects like the SDK does. */
export const hang: ScriptedTurn = (_params, { signal }) =>
  new Promise<BetaMessage>((_resolve, reject) => {
    if (signal?.aborted) return reject(new Anthropic.APIUserAbortError());
    signal?.addEventListener('abort', () => reject(new Anthropic.APIUserAbortError()), { once: true });
  });

/** A turn that throws (after message_start with `usage`, when given). */
export const fail =
  (err: Error, usage?: FakeUsage): ScriptedTurn =>
  (_params, { start }) => {
    if (usage) start(usage);
    throw err;
  };

export function rateLimitError(): Error {
  return new Anthropic.RateLimitError(429, { type: 'error', error: { type: 'rate_limit_error', message: 'Number of request tokens has exceeded your per-minute rate limit' } }, 'rate limited', new Headers());
}

export function overloadedError(): Error {
  return new Anthropic.InternalServerError(529, { type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } }, 'Overloaded', new Headers());
}

export function authError(): Error {
  return new Anthropic.AuthenticationError(401, { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } }, 'invalid x-api-key', new Headers());
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

export function testConfig(overrides: Partial<InferenceConfig> = {}): InferenceConfig {
  return {
    model: 'claude-opus-5',
    effort: 'high',
    maxTokens: 64000,
    maxResearchCalls: 16,
    maxAnswerResearchCalls: 8,
    researchMs: 120_000,
    totalMs: 480_000,
    maxTurns: 40,
    fallbacks: true,
    credential: { source: 'api-key', apiKey: 'test-key-not-real' },
    root: '/nonexistent',
    cacheDir: '/nonexistent/.kb-cache',
    debugLogs: false,
    ...overrides,
  };
}

/** Text of every tool_result in a request's last user message, keyed by tool_use_id. */
export function toolResults(params: StreamParams): Map<string, { content: string; isError: boolean }> {
  const out = new Map<string, { content: string; isError: boolean }>();
  const msgs = params.messages;
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    if (m.role !== 'user' || typeof m.content === 'string') continue;
    let found = false;
    for (const b of m.content) {
      if (b.type === 'tool_result') {
        found = true;
        const content = typeof b.content === 'string' ? b.content : (b.content ?? []).map((c) => ('text' in c ? c.text : '')).join('');
        out.set(b.tool_use_id, { content, isError: b.is_error === true });
      }
    }
    if (found) break;
  }
  return out;
}
