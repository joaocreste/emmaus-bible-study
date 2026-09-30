/**
 * Versification alignment for the scripture step: every bundled version is stored with English
 * (KJV/BSB) chapter and verse numbers, so verse keys ("ROM.8.1") mean the same words in every
 * language.
 *
 * French Bibles follow the Hebrew (Masoretic) numbering in many places (psalm titles counted as
 * verse 1, Joel 4, Malachi 3:19–24, Exodus 7:26–8:28 …); the Reina-Valera 1909 edition keeps the
 * English verse count but prints some verses under the Hebrew/Vulgate numbers, leaving empty
 * placeholders; sources also split, merge, repeat or omit verses. Each book is aligned in stages,
 * every step recorded in the build report (manifest `datasets[].versification`):
 *
 *  0. Empty source verses are placeholders and are set aside; deuterocanonical additions are
 *     removed beforehand (stripAdditions).
 *  1. Standard mapping. The Paratext / Copenhagen Alliance mapping of the English versification
 *     to the original one (eng.json / org.json, data CC BY-SA 4.0) is split into independent groups
 *     (a psalm title, a chapter-boundary difference). A group is applied when the version's verse
 *     counts in the chapters it touches equal the original counts (psalm titles: only for versions
 *     that number titles in most psalms). 1b: explicit overrides verified by reading (rare).
 *  2. Supplementary New Testament rules (Nestle-Aland 2 Cor 13:12–13, Rev 12:18, 3 John 15; the
 *     Majority-text doxology after Rom 14:23). Neighbouring verses with identical text: a verse
 *     bridge printed under both numbers is kept once; a chapter-end/next-chapter-start repeat is dropped.
 *  3. Chapter boundaries: (a) the last verse(s) of a chapter printed at the start of the next one,
 *     (b) a run of up to four chapters whose verse total equals the English total, re-chunked —
 *     each accepted only when it fits the English verse lengths better.
 *  4. Dynamic-programming alignment (Gale–Church style) of chapters whose numbers still differ
 *     from the English ones — and, when a same-language reference version is given, of chapters
 *     whose wording shows a hidden offset. Costs combine verse lengths (against the KJV), word
 *     overlap with the reference (relative to the chapter's baseline) and agreement of numbers; a
 *     version verse may cover up to four English verses ("combined"), two version verses may make
 *     one English verse, a psalm title numbered as a verse becomes the superscription, and an
 *     English verse may have no counterpart ("absent" — cheap for known textual variants).
 *
 * English verses left without text of their own are recorded per chapter (`BibleChapterData.x`):
 * verse → the verse whose words include it, or 0 when the version lacks it.
 */
import type { BibleChapterData, BibleVerseData, BibleVerseExtra } from '../../../src/providers/local/formats.ts';

/* ------------------------------------------------------------------ */
/* Reference data                                                      */
/* ------------------------------------------------------------------ */

/** Paratext standard versification files (Copenhagen Alliance repository). */
export const VERSIFICATION_URLS = {
  eng: 'https://raw.githubusercontent.com/Copenhagen-Alliance/versification-specification/master/versification-mappings/standard-mappings/eng.json',
  org: 'https://raw.githubusercontent.com/Copenhagen-Alliance/versification-specification/master/versification-mappings/standard-mappings/org.json',
} as const;

export interface VersificationFile {
  maxVerses: Record<string, string[]>;
  mappedVerses: Record<string, string>;
}

/** "BOOK c:v" key */
type Key = string;
const key = (b: string, c: number, v: number): Key => `${b} ${c}:${v}`;
function parseKey(k: Key): { b: string; c: number; v: number } {
  const m = /^(\w+) (\d+):(\d+)$/.exec(k);
  if (!m) throw new Error(`bad verse key ${k}`);
  return { b: m[1], c: +m[2], v: +m[3] };
}

/** Expand "PSA 3:0-8" → ["PSA 3:0", …, "PSA 3:8"] (null for lettered verses like "ESG 1:1a"). */
function expandRange(r: string): Key[] | null {
  const m = /^(\w+) (\d+):(\d+)(?:-(\d+))?$/.exec(r.trim());
  if (!m) return null;
  const out: Key[] = [];
  for (let v = +m[3]; v <= +(m[4] ?? m[3]); v++) out.push(key(m[1], +m[2], v));
  return out;
}

export interface MappingGroup {
  book: string;
  /** chapters touched on either side */
  chapters: number[];
  /** original (Hebrew/NA) verse → English verse */
  orgToEng: Map<Key, Key>;
  label: string;
}

/** Split the eng→org mapping into independent groups (connected by the chapters they touch). */
export function buildMappingGroups(eng: VersificationFile, books: ReadonlySet<string>): MappingGroup[] {
  const pairs: [Key, Key][] = [];
  const labels = new Map<string, string[]>();
  for (const [e, o] of Object.entries(eng.mappedVerses)) {
    const ek = expandRange(e);
    const ok = expandRange(o);
    if (!ek || !ok || ek.length !== ok.length) continue;
    const b = parseKey(ek[0]).b;
    if (!books.has(b) || parseKey(ok[0]).b !== b) continue;
    ek.forEach((x, i) => pairs.push([x, ok[i]]));
    const ch = `${b} ${parseKey(ek[0]).c}`;
    labels.set(ch, [...(labels.get(ch) ?? []), `${e}=${o.replace(/^\w+ /, '')}`]);
  }
  // union-find over "BOOK c"
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    let p = parent.get(x) ?? x;
    if (p !== x) {
      p = find(p);
      parent.set(x, p);
    }
    return p;
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };
  const chOf = (k: Key) => {
    const { b, c } = parseKey(k);
    return `${b} ${c}`;
  };
  for (const [e, o] of pairs) union(chOf(e), chOf(o));
  const groups = new Map<string, MappingGroup>();
  for (const [e, o] of pairs) {
    const root = find(chOf(e));
    let g = groups.get(root);
    if (!g) {
      g = { book: parseKey(e).b, chapters: [], orgToEng: new Map(), label: '' };
      groups.set(root, g);
    }
    for (const c of [parseKey(e).c, parseKey(o).c]) if (!g.chapters.includes(c)) g.chapters.push(c);
    g.orgToEng.set(o, e);
  }
  for (const g of groups.values()) {
    g.chapters.sort((a, b) => a - b);
    g.label = g.chapters.flatMap((c) => labels.get(`${g.book} ${c}`) ?? []).join(', ');
  }
  return [...groups.values()];
}

/* ------------------------------------------------------------------ */
/* Working representation                                              */
/* ------------------------------------------------------------------ */

interface Item {
  /** position in the version (source numbering) */
  srcC: number;
  srcV: number;
  data: BibleVerseData;
}

export interface AlignmentReport {
  /** standard groups applied ("PSA 3:0-8=3:1-9") */
  mappedGroups: string[];
  /** other repairs, human-readable */
  repairs: string[];
  /** chapters still differing from the English verse list after alignment ("MRK 9: …") */
  residual: string[];
  /** English verses whose text is inside another verse ("PSA 13:6→5") */
  combined: string[];
  /** English verses with no text in this version ("ACT 8:37") */
  absent: string[];
  /** verses dropped as exact duplicates of a neighbouring verse */
  dropped: string[];
  /** deuterocanonical additions left out (not part of the 66-book canon / English versification) */
  omitted: string[];
}

export function emptyReport(): AlignmentReport {
  return { mappedGroups: [], repairs: [], residual: [], combined: [], absent: [], dropped: [], omitted: [] };
}

export interface AlignInput {
  version: string;
  book: string;
  /** chapters as converted from the API, in the version's own numbering */
  chapters: BibleChapterData[];
  /** English verse numbers per chapter (KJV list; index = chapter - 1) */
  englishVerses: number[][];
  /** English verse lengths per chapter (text length; for the DP stage) */
  englishLengths: Map<number, number>[];
  /** original-versification max verse per chapter (org.json) */
  orgMax: number[] | undefined;
  engMax: number[] | undefined;
  groups: MappingGroup[];
  /** majority decision for ambiguous psalm-title groups (true = the version numbers titles) */
  psalmTitlesNumbered: boolean;
  /**
   * English verses ("c:v") that modern critical texts omit (in the KJV, not in the BSB, e.g.
   * "17:21" in Matthew): when a version lacks one, it is absent rather than combined.
   */
  omissions: ReadonlySet<string>;
  /** length of the English superscription per chapter (0 = none; index = chapter - 1) */
  englishSups: number[];
  /**
   * The same book in another version of the same language, already aligned (the language's
   * default version, whose numbering matches the English one best). Word overlap with it makes
   * the length-based alignment far more precise (lists of names, reordered clauses).
   */
  reference?: BibleChapterData[];
  /**
   * Explicit re-numberings for arrangements that cannot be inferred (verified by reading the text),
   * applied after the standard mapping: source "c:v1-v2" → English "c:v" (first verse of the run).
   */
  overrides?: { from: string; to: string; note: string }[];
}

/** Content words of a verse (accents folded, ≥ 4 letters, or numbers) for same-language similarity. */
export function contentWords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4 || /^\d+$/.test(w));
  return new Set(words);
}

/**
 * Word-overlap F-measure between version verses and reference verses. When several verses sit
 * on one side, recall (precision) is the lowest over the reference (version) verses that have
 * at least two content words — a version verse said to cover three reference verses must share
 * words with each of them.
 */
export function overlapScore(versionVerses: ReadonlySet<string>[], refVerses: ReadonlySet<string>[]): number {
  const frac = (a: ReadonlySet<string>, b: ReadonlySet<string>) => {
    if (!a.size) return 0;
    let k = 0;
    for (const w of a) if (b.has(w)) k++;
    return k / a.size;
  };
  const worst = (parts: ReadonlySet<string>[], other: ReadonlySet<string>) => {
    const scored = parts.filter((p) => p.size >= 2);
    const list = scored.length ? scored : parts;
    return list.length ? Math.min(...list.map((p) => frac(p, other))) : 0;
  };
  const recall = worst(refVerses, union(...versionVerses));
  const precision = worst(versionVerses, union(...refVerses));
  return recall + precision ? (2 * recall * precision) / (recall + precision) : 0;
}

/** Drop words frequent in a chapter (function words) from every set. */
export function dropFrequent(groups: (Set<string> | null)[][]): void {
  const df = new Map<string, number>();
  let count = 0;
  for (const g of groups)
    for (const s of g) {
      if (!s) continue;
      count++;
      for (const w of s) df.set(w, (df.get(w) ?? 0) + 1);
    }
  const limit = Math.max(3, count * 0.12);
  for (const g of groups) for (const s of g) if (s) for (const w of [...s]) if ((df.get(w) ?? 0) > limit) s.delete(w);
}

function union(...sets: (ReadonlySet<string> | null | undefined)[]): Set<string> {
  const out = new Set<string>();
  for (const s of sets) if (s) for (const w of s) out.add(w);
  return out;
}

const NO_SPACE_BEFORE = /^[,.;:!?’”)\]—…]/;
const NO_SPACE_AFTER = /[“‘(\[—]$/;
function join(a: string, b: string): string {
  if (!a) return b;
  if (!b) return a;
  return NO_SPACE_BEFORE.test(b) || NO_SPACE_AFTER.test(a) ? a + b : `${a} ${b}`;
}

/** Merge verse b into verse a (text joined, poetry lines concatenated, footnotes kept). */
export function mergeVerse(a: BibleVerseData, b: BibleVerseData): BibleVerseData {
  const ea: BibleVerseExtra = a[2] ?? {};
  const eb: BibleVerseExtra = b[2] ?? {};
  const out: BibleVerseExtra = {};
  const h = ea.h ?? eb.h;
  if (h) out.h = h;
  if (ea.p) out.p = 1;
  if (ea.l || eb.l) out.l = [...(ea.l ?? (a[1] ? [[a[1], 0] as [string, number]] : [])), ...(eb.l ?? (b[1] ? [[b[1], 0] as [string, number]] : []))];
  const f = [...(ea.f ?? []), ...(eb.f ?? [])];
  if (f.length) out.f = f;
  const text = join(a[1], b[1]);
  return Object.keys(out).length ? [a[0], text, out] : [a[0], text];
}

function textOf(d: BibleVerseData): string {
  return d[1];
}

/* ------------------------------------------------------------------ */
/* Deuterocanonical additions                                          */
/* ------------------------------------------------------------------ */

const maxVerse = (c: BibleChapterData | undefined) => (c ? Math.max(0, ...c.v.map((v) => v[0])) : 0);

/**
 * Leave out the Greek additions that Catholic-derived versions (néo-Crampon) print inside
 * Daniel and Esther in the Vulgate arrangement. They are not part of the 66-book canon of
 * src/domain/books.ts and have no English verse numbers: Dan 3:24–90 (Prayer of Azariah, Song of
 * the Three Young Men), Dan 13 (Susanna), Dan 14 (Bel and the Dragon), Esth 10:4–16:24.
 * Dan 3:91–100 become 3:24–33 (the Hebrew numbering; the standard mapping then gives English
 * 3:24–30 and 4:1–3).
 */
export function stripAdditions(book: string, chapters: BibleChapterData[], report: AlignmentReport): BibleChapterData[] {
  if (book === 'DAN') {
    let out = chapters;
    if (out.length > 12) {
      report.omitted.push(`DAN 13–${out.length} (Susanna; Bel and the Dragon)`);
      out = out.slice(0, 12);
    }
    const c3 = out[2];
    const last = maxVerse(c3);
    if (c3 && last >= 97 && c3.v.some((v) => v[0] === 91)) {
      const kept = c3.v
        .filter((v) => v[0] < 24 || v[0] >= 91)
        .map((v) => (v[0] >= 91 ? ((v[2] ? [v[0] - 67, v[1], v[2]] : [v[0] - 67, v[1]]) as BibleVerseData) : v));
      report.omitted.push(`DAN 3:24–90 (Prayer of Azariah and Song of the Three Young Men); 3:91–${last} renumbered 3:24–${last - 67}`);
      out = [...out.slice(0, 2), { ...c3, v: kept }, ...out.slice(3)];
    }
    return out;
  }
  if (book === 'EST' && chapters.length > 10) {
    report.omitted.push(`EST 10:4–${chapters.length}:${maxVerse(chapters[chapters.length - 1])} (Greek additions to Esther)`);
    return [...chapters.slice(0, 9), { ...chapters[9], v: chapters[9].v.filter((v) => v[0] <= 3) }];
  }
  return chapters;
}

/* ------------------------------------------------------------------ */
/* Alignment                                                           */
/* ------------------------------------------------------------------ */

export interface AlignResult {
  chapters: BibleChapterData[];
}

/**
 * Re-number one book into English versification. Returns chapters 1…N (N = English chapter
 * count) whose verse numbers are a subset of the English ones, plus a report.
 */
export function alignBook(input: AlignInput, report: AlignmentReport): AlignResult {
  const { book } = input;
  const engChapters = input.englishVerses.length;
  const items: Item[] = [];
  const sups = new Map<number, string>();
  for (const ch of input.chapters) {
    if (ch.sup) sups.set(ch.c, ch.sup);
    for (const v of ch.v) items.push({ srcC: ch.c, srcV: v[0], data: v });
  }
  const srcCount = (c: number) => items.filter((i) => i.srcC === c).reduce((m, i) => Math.max(m, i.srcV), 0);

  // current target position of every item (v = 0: superscription, v < 0: dropped)
  const target = new Map<Item, { c: number; v: number }>(items.map((i) => [i, { c: i.srcC, v: i.srcV }]));
  // empty verses are placeholders (the words are printed under a neighbouring number, or the verse is a textual variant the version leaves out)
  const empties = items.filter((i) => !textOf(i.data).trim());
  for (const it of empties) target.set(it, { c: it.srcC, v: -1 });
  if (empties.length) report.dropped.push(...empties.map((i) => `${book} ${i.srcC}:${i.srcV} (empty in the source)`));
  /** English verses ("c:v") whose words are inside the preceding verse, or missing from the version */
  const combinedKeys = new Set<string>();
  const absentKeys = new Set<string>();
  const maxEng = (c: number) => Math.max(0, ...(input.englishVerses[c - 1] ?? []));
  const engSet = (c: number) => new Set(input.englishVerses[c - 1] ?? []);

  /** English chapters re-numbered by a standard mapping group */
  const mappedChapters = new Set<number>();

  /* ---- 1. standard groups ---- */
  for (const g of input.groups) {
    if (g.book !== book) continue;
    const orgMatch = g.chapters.every((c) => srcCount(c) === Number(input.orgMax?.[c - 1] ?? 0));
    const engMatch = g.chapters.every((c) => srcCount(c) === Number(input.engMax?.[c - 1] ?? 0));
    const isPsalmTitle = book === 'PSA' && [...g.orgToEng.values()].some((k) => parseKey(k).v === 0);
    // a psalm-title mapping only for versions that number the titles in most psalms (a version that
    // does not — Ostervald — may still match the Hebrew count by splitting a verse: Ps 30:12–13)
    const apply = isPsalmTitle ? orgMatch && input.psalmTitlesNumbered : orgMatch && !engMatch;
    if (!apply) continue;
    // lowest mapped original verse per chapter (psalm titles spanning two verses: 51:1–2)
    const firstMapped = new Map<number, number>();
    for (const k of g.orgToEng.keys()) {
      const { c, v } = parseKey(k);
      firstMapped.set(c, Math.min(firstMapped.get(c) ?? Infinity, v));
    }
    for (const it of items) {
      if (!g.chapters.includes(it.srcC)) continue;
      const to = g.orgToEng.get(key(book, it.srcC, it.srcV));
      if (to) {
        const { c, v } = parseKey(to);
        target.set(it, { c, v });
      } else if (isPsalmTitle && it.srcV < (firstMapped.get(it.srcC) ?? 0)) {
        const first = g.orgToEng.get(key(book, it.srcC, firstMapped.get(it.srcC)!));
        if (first && parseKey(first).v === 0) target.set(it, { c: it.srcC, v: 0 });
      }
    }
    for (const c of g.chapters) mappedChapters.add(c);
    for (const k of g.orgToEng.values()) mappedChapters.add(parseKey(k).c);
    report.mappedGroups.push(g.label);
  }

  /* ---- 1b. explicit overrides ---- */
  for (const o of input.overrides ?? []) {
    const f = /^(\d+):(\d+)(?:-(\d+))?$/.exec(o.from);
    const t = /^(\d+):(\d+)$/.exec(o.to);
    if (!f || !t) throw new Error(`${book}: bad override ${o.from} → ${o.to}`);
    const [c, v1, v2] = [+f[1], +f[2], +(f[3] ?? f[2])];
    for (const it of items) {
      if (it.srcC !== c || it.srcV < v1 || it.srcV > v2 || target.get(it)!.v < 0) continue;
      target.set(it, { c: +t[1], v: +t[2] + it.srcV - v1 });
    }
    mappedChapters.add(c);
    mappedChapters.add(+t[1]);
    report.repairs.push(`${book} ${o.from} → ${o.to}${v2 > v1 ? `–${+t[2] + v2 - v1}` : ''} (${o.note})`);
  }

  /* ---- 2. supplementary New Testament rules ---- */
  const countAt = (c: number) => items.filter((i) => target.get(i)!.c === c).reduce((m, i) => Math.max(m, target.get(i)!.v), 0);
  if (book === '2CO' && countAt(13) === 13 && maxEng(13) === 14) {
    // Nestle-Aland 13:12 = English 13:12–13; NA 13:13 = English 13:14
    for (const it of items) if (target.get(it)!.c === 13 && target.get(it)!.v === 13) target.set(it, { c: 13, v: 14 });
    combinedKeys.add('13:13');
    report.repairs.push('2CO 13:13 (Nestle-Aland numbering) → 13:14; English 13:13 is inside 13:12');
  }
  if (book === 'ROM' && countAt(14) === 26 && maxEng(14) === 23 && countAt(16) <= 25) {
    // Majority-text placement of the doxology (Rom 16:25–27) after 14:23
    for (const it of items) {
      const t = target.get(it)!;
      if (t.c === 14 && t.v >= 24) target.set(it, { c: 16, v: t.v + 1 });
      else if (t.c === 16 && t.v === 25 && !textOf(it.data)) target.set(it, { c: 16, v: -1 });
    }
    report.repairs.push('ROM 14:24–26 (doxology placed after 14:23, as in the Majority text) → ROM 16:25–27');
  }
  if (book === 'REV' && countAt(12) === 18 && maxEng(12) === 17) {
    // NA 12:18 ("and he stood on the sand of the sea") opens English 13:1
    for (const it of items) if (target.get(it)!.c === 12 && target.get(it)!.v === 18) target.set(it, { c: 13, v: 1 });
    report.repairs.push('REV 12:18 (Nestle-Aland numbering) → start of 13:1');
  }
  if (book === '3JN' && countAt(1) === 15 && maxEng(1) === 14) {
    // NA 14–15 = English 14
    for (const it of items) if (target.get(it)!.v === 15) target.set(it, { c: 1, v: 14 });
    report.repairs.push('3JN 1:15 (Nestle-Aland numbering) → end of 1:14');
  }

  /* ---- the same text under neighbouring numbers ---- */
  // runs of consecutive source verses with identical text (formulas repeated elsewhere in a book are legitimate)
  const runs: Item[][] = [];
  for (let i = 1; i < items.length; i++) {
    const a = items[i - 1];
    const b = items[i];
    const t = textOf(b.data);
    if (t.length < 20 || t !== textOf(a.data) || target.get(a)!.v < 0 || target.get(b)!.v < 0) continue;
    const last = runs[runs.length - 1];
    if (last && last[last.length - 1] === a) last.push(b);
    else runs.push([a, b]);
  }
  for (const list of runs) {
    const bridge = list.every((it, i) => it.srcC === list[0].srcC && (i === 0 || it.srcV === list[i - 1].srcV + 1));
    if (bridge) {
      // a verse bridge ("40–41") printed under each number: keep it once, at the first number
      const first = target.get(list[0])!;
      for (const it of list.slice(1)) {
        const t = target.get(it)!;
        combinedKeys.add(`${t.c}:${t.v}`);
        target.set(it, { c: t.c, v: -1 });
      }
      report.repairs.push(`${book} ${first.c}:${first.v}–${first.v + list.length - 1}: one text printed under each verse number → kept once at ${first.c}:${first.v}`);
      continue;
    }
    // the same verse at a chapter end and the next chapter's start (e.g. Mark 8:39 = 9:1): keep the copy at an English position
    const valid = list.filter((it) => engSet(target.get(it)!.c).has(target.get(it)!.v));
    const keep = valid.length ? valid[valid.length - 1] : list[list.length - 1];
    for (const it of list) {
      if (it === keep) continue;
      const t = target.get(it)!;
      report.dropped.push(`${book} ${it.srcC}:${it.srcV} (same text as ${keep.srcC}:${keep.srcV})`);
      target.set(it, { c: t.c, v: -1 });
    }
  }

  /* ---- group by target chapter ---- */
  const byChapter = (): Map<number, Item[]> => {
    const m = new Map<number, Item[]>();
    for (const it of items) {
      const t = target.get(it)!;
      if (t.v < 0) continue;
      m.set(t.c, [...(m.get(t.c) ?? []), it]);
    }
    for (const list of m.values()) list.sort((a, b) => target.get(a)!.v - target.get(b)!.v || a.srcC - b.srcC || a.srcV - b.srcV);
    return m;
  };
  const numbered = (list: Item[] | undefined) => [...new Set((list ?? []).map((i) => target.get(i)!.v).filter((v) => v > 0))];

  /* ---- 3a. the last verse(s) of a chapter printed at the start of the next one ---- */
  // (Reina-Valera 1909: 1 Sam 23:29 is its 24:1, Jonah 1:17 its 2:1, Num 12:16 its 13:1 — the English
  // numbers are kept as empty placeholders). Accepted only when it fits the English verse lengths better.
  {
    let m = byChapter();
    const lengthOf = (list: Item[], v: number) => list.filter((i) => target.get(i)!.v === v).reduce((n, i) => n + textOf(i.data).length, 0);
    for (let c = 1; c < engChapters; c++) {
      const eng = input.englishVerses[c - 1];
      const present = new Set(numbered(m.get(c)));
      let k = 0;
      for (let i = eng.length - 1; i >= 0; i--) {
        const k2 = `${c}:${eng[i]}`;
        if (present.has(eng[i]) || input.omissions.has(k2) || combinedKeys.has(k2)) break;
        k++;
      }
      if (!k || k > 5) continue;
      const cur = m.get(c) ?? [];
      const nextList = m.get(c + 1) ?? [];
      const next = numbered(nextList).sort((a, b) => a - b);
      if (next.length <= k || next[0] !== 1) continue;
      const lenC = new Map(numbered(cur).map((v) => [v, lengthOf(cur, v)]));
      const lenN = new Map(next.map((v) => [v, lengthOf(nextList, v)]));
      const el = (ch: number, v: number) => input.englishLengths[ch - 1]?.get(v);
      const totalV = [...lenC.values(), ...lenN.values()].reduce((a, b) => a + b, 0);
      const totalE = [...eng, ...input.englishVerses[c]].reduce((a, v, i) => a + (el(i < eng.length ? c : c + 1, v) ?? 0), 0);
      const ratio = totalV / Math.max(1, totalE);
      const cost = (len: number, ch: number, v: number) => {
        const e = el(ch, v);
        return e == null ? 4 : Math.abs(Math.log((len + 20) / (e * ratio + 20))) * 4;
      };
      let before = 0;
      let after = 0;
      for (const [v, len] of lenC) {
        before += cost(len, c, v);
        after += cost(len, c, v);
      }
      const firstMoved = eng[eng.length - k];
      for (const [v, len] of lenN) {
        before += cost(len, c + 1, v);
        after += v <= k ? cost(len, c, firstMoved + v - 1) : cost(len, c + 1, v - k);
      }
      if (after >= before - 2) continue;
      for (const it of nextList) {
        const t = target.get(it)!;
        if (t.v <= 0) continue;
        target.set(it, t.v <= k ? { c, v: firstMoved + t.v - 1 } : { c: c + 1, v: t.v - k });
      }
      report.repairs.push(`${book} ${c + 1}:1${k > 1 ? `–${k}` : ''} → ${c}:${firstMoved}${k > 1 ? `–${firstMoved + k - 1}` : ''} (chapter ${c + 1} starts earlier in this version)`);
      m = byChapter();
    }
  }

  /* ---- 3. chapter boundaries: a run of up to four chapters whose verse total equals the English total ---- */
  // (e.g. Segond's Job 38–41: 38 + 38 + 28 + 25 verses = English 41 + 30 + 24 + 34); the run is re-chunked
  // in order when that fits the English verse lengths better than the version's own numbering.
  {
    let m = byChapter();
    const count = (c: number) => numbered(m.get(c)).length;
    const engCount = (c: number) => input.englishVerses[c - 1]?.length ?? 0;
    for (let c = 1; c < engChapters; c++) {
      if (count(c) === engCount(c) && numbered(m.get(c)).every((v) => engSet(c).has(v))) continue;
      for (let e = c + 1; e <= Math.min(c + 3, engChapters); e++) {
        let have = 0;
        let want = 0;
        for (let q = c; q <= e; q++) {
          have += count(q);
          want += engCount(q);
        }
        if (have !== want) continue;
        // units in reading order, and the English positions of the run
        const units: { v: number; c: number; items: Item[]; len: number }[] = [];
        for (let q = c; q <= e; q++) {
          for (const v of numbered(m.get(q)).sort((x, y) => x - y)) {
            const its = m.get(q)!.filter((i) => target.get(i)!.v === v);
            units.push({ c: q, v, items: its, len: its.reduce((n, i) => n + textOf(i.data).length, 0) });
          }
        }
        const slots: { c: number; v: number }[] = [];
        for (let q = c; q <= e; q++) for (const v of input.englishVerses[q - 1]) slots.push({ c: q, v });
        const engLen = (x: { c: number; v: number }) => input.englishLengths[x.c - 1]?.get(x.v);
        const ratio = units.reduce((n, u) => n + u.len, 0) / Math.max(1, slots.reduce((n, x) => n + (engLen(x) ?? 0), 0));
        const cost = (len: number, x: { c: number; v: number }) => {
          const el = engLen(x);
          return el == null ? 4 : Math.abs(Math.log((len + 20) / (el * ratio + 20))) * 4;
        };
        const before = units.reduce((n, u) => n + cost(u.len, u), 0);
        const after = units.reduce((n, u, i) => n + cost(u.len, slots[i]), 0);
        if (after >= before - 1) break;
        units.forEach((u, i) => {
          for (const it of u.items) target.set(it, { c: slots[i].c, v: slots[i].v });
        });
        const moved = units.filter((u, i) => u.c !== slots[i].c);
        const range = (list: { c: number; v: number }[]) => (list.length ? `${list[0].c}:${list[0].v}–${list[list.length - 1].c}:${list[list.length - 1].v}` : '');
        report.repairs.push(
          `${book} ${c}–${e}: chapter boundaries follow the English Bible (${moved.length} verses move chapter; ${range(units)} → ${range(slots)})`,
        );
        m = byChapter();
        c = e;
        break;
      }
    }
  }

  /**
   * Wording evidence that a chapter numbered like the English one is offset against it: at least two
   * consecutive verses (or three in the chapter) share clearly more words with a neighbouring verse of
   * the same-language reference than with the verse of the same number.
   */
  function hiddenOffset(c: number, list: Item[]): boolean {
    const ref = input.reference?.[c - 1];
    if (!ref) return false;
    const nums = numbered(list).sort((a, b) => a - b);
    const mine = nums.map((v) => contentWords(list.filter((i) => target.get(i)!.v === v).map((i) => textOf(i.data)).join(' ')));
    const theirs = ref.v.map((x) => contentWords(x[1]));
    dropFrequent([mine, theirs]);
    const at = new Map(ref.v.map((x, i) => [x[0], i]));
    // version verse index → direction of the better-matching reference verse (swapped verses point both ways)
    const flagged = new Map<number, number>();
    nums.forEach((v, k) => {
      const i = at.get(v);
      if (i == null || mine[k].size < 3) return;
      const same = overlapScore([mine[k]], [theirs[i]]);
      if (same >= 0.25) return;
      for (const d of [-1, 1, -2, 2]) {
        const other = theirs[i + d];
        if (other && other.size >= 3 && overlapScore([mine[k]], [other]) > same + 0.25) {
          flagged.set(k, d);
          return;
        }
      }
    });
    for (const d of [-2, -1, 1, 2]) {
      const ks = [...flagged].filter(([, dir]) => dir === d).map(([k]) => k);
      if (ks.length >= 3 || ks.some((k) => ks.includes(k + 1))) return true;
    }
    return false;
  }

  /** Does the version's verse `host` also hold English verse `v` (the verses between are missing too)? */
  function hostCovers(c: number, host: number, v: number): boolean {
    const m = byChapter();
    const list = m.get(c) ?? [];
    const text = list.filter((i) => target.get(i)!.v === host).map((i) => textOf(i.data)).join(' ');
    const el = input.englishLengths[c - 1];
    const eng = input.englishVerses[c - 1];
    const present = numbered(list);
    const ratio =
      present.reduce((n, x) => n + list.filter((i) => target.get(i)!.v === x).reduce((a, i) => a + textOf(i.data).length, 0), 0) /
      Math.max(1, present.reduce((n, x) => n + (el.get(x) ?? 0), 0));
    const span = eng.filter((x) => x > host && x <= v);
    const alone = (el.get(host) ?? 0) * ratio;
    const withSpan = alone + span.reduce((n, x) => n + (el.get(x) ?? 0) * ratio, 0);
    const lc = (a: number, b: number) => Math.abs(Math.log((a + 20) / (b + 20)));
    const ref = input.reference?.[c - 1];
    if (ref) {
      const refSpan = ref.v.filter((x) => span.includes(x[0]));
      if (refSpan.length) {
        const words = contentWords(text);
        const spanWords = refSpan.map((x) => contentWords(x[1]));
        const others = ref.v.filter((x) => !span.includes(x[0])).map((x) => contentWords(x[1]));
        dropFrequent([[words], spanWords, others]);
        // the host holds the missing verse when it contains a good part of that verse's words
        const scored = spanWords.filter((w) => w.size >= 2);
        if (!scored.length) return lc(text.length, withSpan) <= lc(text.length, alone) + 0.15;
        const coverage = scored.reduce((n, w) => n + [...w].filter((x) => words.has(x)).length / w.size, 0) / scored.length;
        return coverage >= 0.3;
      }
    }
    return lc(text.length, withSpan) <= lc(text.length, alone) + 0.15;
  }

  /* ---- 4. per-chapter alignment by verse length for what is left ---- */
  {
    const m = byChapter();
    for (const [c, list] of m) {
      if (c > engChapters) continue;
      const eng = input.englishVerses[c - 1];
      const set = engSet(c);
      const nums = numbered(list);
      const present = new Set(nums);
      const extra = nums.filter((v) => !set.has(v));
      const missing = eng.filter((v) => !present.has(v) && !combinedKeys.has(`${c}:${v}`));
      // chapters whose numbers differ from the English ones — and, with a same-language reference,
      // chapters whose wording shows a hidden offset (a split and a merge that cancel out)
      const offset = !extra.length && missing.every((v) => input.omissions.has(`${c}:${v}`)) && hiddenOffset(c, list);
      if (!offset && !extra.length && missing.every((v) => input.omissions.has(`${c}:${v}`))) continue;
      if (!offset && !extra.length && mappedChapters.has(c)) {
        // the standard mapping placed every verse; an English verse left without text shares a verse
        // of the original numbering with its neighbour (Ps 13:5–6 = Hebrew 13:6) — or, at the start of
        // a chapter, belongs to the previous chapter's last verse (Isa 64:1 = Hebrew 63:19b)
        for (const v of missing) {
          if (input.omissions.has(`${c}:${v}`)) continue;
          const host = nums.filter((n) => n < v).pop();
          if (host != null) {
            if (hostCovers(c, host, v)) combinedKeys.add(`${c}:${v}`);
            else absentKeys.add(`${c}:${v}`);
          } else {
            absentKeys.add(`${c}:${v}`);
            report.repairs.push(`${book} ${c}:${v} is part of the last verse of chapter ${c - 1} in this version`);
          }
        }
        continue;
      }
      // units: the version's verses at their current numbers (several items may already share one)
      const units = nums.sort((a, b) => a - b);
      const unitLen = units.map((v) => list.filter((i) => target.get(i)!.v === v).reduce((n, i) => n + textOf(i.data).length, 0));
      const omitted = new Set(eng.filter((v) => input.omissions.has(`${c}:${v}`)));
      const refChapter = input.reference?.[c - 1];
      const unitWords = units.map((v) => contentWords(list.filter((i) => target.get(i)!.v === v).map((i) => textOf(i.data)).join(' ')));
      const refWords = refChapter
        ? eng.map((v) => {
            const r = refChapter.v.find((x) => x[0] === v);
            return r ? contentWords(r[1]) : null;
          })
        : [];
      const refSupWords = refChapter?.sup ? contentWords(refChapter.sup) : null;
      if (refChapter) dropFrequent([unitWords, refWords, [refSupWords]]);
      const res = dpAlign(unitLen, units, eng, input.englishLengths[c - 1], {
        omitted,
        supLen: input.englishSups[c - 1] ?? 0,
        ...(refChapter ? { unitWords, refWords, refSupWords, refGaps: refChapter.x ?? {} } : {}),
        // the source itself leaves verses of this chapter empty: some English verses have no text here
        cheapAbsent: empties.some((i) => i.srcC === c || target.get(i)!.c === c),
      });
      if (!res) {
        report.residual.push(`${book} ${c}: version ${nums.length} verses (max ${Math.max(0, ...nums)}), English ${eng.length} — left as numbered`);
        continue;
      }
      const moved: string[] = [];
      const newNumber = new Map(units.map((v, i) => [v, res.assign[i]]));
      for (const it of list) {
        const t = target.get(it)!;
        if (t.v <= 0) continue;
        const after = newNumber.get(t.v)!;
        if (after !== t.v && !moved.includes(`${t.v}→${after}`)) moved.push(`${t.v}→${after}`);
        target.set(it, { c, v: after });
      }
      for (const v of res.combined) combinedKeys.add(`${c}:${v}`);
      for (const v of res.absent) {
        // an English verse left without text whose words are in the preceding verse is combined into it
        const host = res.assign.filter((n) => n > 0 && n < v).pop();
        const between = eng.filter((n) => host != null && n > host && n < v);
        if (input.reference?.[c - 1] && host != null && !omitted.has(v) && between.every((n) => res.absent.includes(n)) && hostCovers(c, host, v)) {
          combinedKeys.add(`${c}:${v}`);
          res.combined.push(v);
        } else absentKeys.add(`${c}:${v}`);
      }
      res.absent = res.absent.filter((v) => !res.combined.includes(v));
      const notes = [
        ...(moved.length ? [`renumbered ${compactMoves(moved)}`] : []),
        ...(res.combined.length ? [`${res.combined.join(', ')} inside the preceding verse`] : []),
        ...(res.absent.filter((v) => !omitted.has(v)).length ? [`${res.absent.filter((v) => !omitted.has(v)).join(', ')} not in this version`] : []),
      ];
      if (notes.length) report.repairs.push(`${book} ${c}: aligned by ${input.reference ? 'wording and verse length' : 'verse length'} (${notes.join('; ')})`);
    }
    // chapters beyond the English count (should have been mapped away)
    for (const c of m.keys()) if (c > engChapters) report.residual.push(`${book} ${c}: chapter not in the English versification — dropped`);
  }

  /* ---- build output ---- */
  const final = byChapter();
  const out: BibleChapterData[] = [];
  for (let c = 1; c <= engChapters; c++) {
    const list = final.get(c) ?? [];
    const verses = new Map<number, BibleVerseData>();
    let sup = sups.get(c) ?? '';
    for (const it of list) {
      const { v } = target.get(it)!;
      if (v === 0) {
        sup = join(sup, textOf(it.data));
        continue;
      }
      const prev = verses.get(v);
      const data: BibleVerseData = it.data[2] ? [v, it.data[1], it.data[2]] : [v, it.data[1]];
      verses.set(v, prev ? mergeVerse(prev, data) : data);
    }
    const nums = [...verses.keys()].sort((a, b) => a - b);
    for (const n of nums) if (!engSet(c).has(n)) report.residual.push(`${book} ${c}:${n} is not an English verse number`);
    const chapter: BibleChapterData = { c, v: nums.map((n) => verses.get(n)!) };
    if (sup) chapter.sup = sup;
    // English verses without their own text: combined into the preceding verse, or absent (0)
    const x: Record<string, number> = {};
    for (const ev of input.englishVerses[c - 1] ?? []) {
      if (verses.has(ev)) continue;
      const k = `${c}:${ev}`;
      const host = nums.filter((n) => n < ev).pop();
      x[ev] = combinedKeys.has(k) && !absentKeys.has(k) && host != null ? host : 0;
    }
    if (Object.keys(x).length) {
      chapter.x = x;
      for (const [ev, host] of Object.entries(x)) {
        if (host) report.combined.push(`${book} ${c}:${ev}→${host}`);
        else if (!input.omissions.has(`${c}:${ev}`)) report.absent.push(`${book} ${c}:${ev}`);
        else report.absent.push(`${book} ${c}:${ev} (textual variant)`);
      }
    }
    out.push(chapter);
  }
  return { chapters: out };
}

function compactMoves(moves: string[]): string {
  return moves.length > 6 ? `${moves.slice(0, 3).join(', ')} … ${moves.slice(-2).join(', ')}; ${moves.length} verses` : moves.join(', ');
}

export interface DpResult {
  /** English verse number for each version verse (0 = superscription) */
  assign: number[];
  /** English verses whose words are inside the preceding version verse */
  combined: number[];
  /** English verses with no counterpart */
  absent: number[];
}

export interface DpOptions {
  /** English verses that modern critical texts omit: cheap to leave without counterpart */
  omitted?: ReadonlySet<number>;
  /** length of the English superscription (psalm title), 0 = none */
  supLen?: number;
  /** content words of each version verse, and of the same-language reference verse for each English verse */
  unitWords?: Set<string>[];
  refWords?: (Set<string> | null)[];
  refSupWords?: Set<string> | null;
  /** the reference's own gaps (its `x`): English verse → host (0 = the reference lacks it too) */
  refGaps?: Record<string, number>;
  /** the source prints empty placeholder verses in this chapter: leaving English verses without text is cheap */
  cheapAbsent?: boolean;
}

/**
 * Align version verses (lengths `vl`, current numbers `vn`) to English verses `eng` (numbers)
 * with lengths `el`, Gale–Church style. Moves: 1–1; 2–1 (two version verses make one English
 * verse); 1–k, k = 2…4 (one version verse covers k English verses, e.g. the four commandments
 * of Deut 5:17–20 printed as one verse); 1–0 and 2–0 at the start (a psalm title numbered as one
 * or two verses); 0–1 (an English verse the version lacks — cheap for known textual variants).
 * Keeping the version's own number costs little, so only the anomalous stretch moves. With a
 * same-language reference, word overlap weighs more than length.
 */
export function dpAlign(vl: number[], vn: number[], eng: number[], el: Map<number, number> | undefined, opts: DpOptions = {}): DpResult | null {
  const n = vl.length;
  const m = eng.length;
  if (!n || !m || !el) return null;
  const omitted = opts.omitted ?? new Set<number>();
  const totalV = vl.reduce((a, b) => a + b, 0);
  const totalE = eng.reduce((a, e) => a + (el.get(e) ?? 0), 0);
  if (!totalV || !totalE) return null;
  const ratio = totalV / totalE;
  const len = (e: number) => Math.max(1, (el.get(e) ?? 0) * ratio);
  const lc = (a: number, b: number) => Math.abs(Math.log((a + 20) / (b + 20))) * 4;
  // similarity baseline: each version verse's best overlap with the reference verses near its
  // position (a paraphrase shares fewer words with the reference than a literal version); similarity
  // costs are relative to it
  let baseline = 0;
  if (opts.unitWords && opts.refWords) {
    const scores: number[] = [];
    for (let i = 0; i < n; i++) {
      if (!opts.unitWords[i].size) continue;
      const centre = Math.round((i * (m - 1)) / Math.max(1, n - 1));
      let best = 0;
      for (let j = Math.max(0, centre - 2); j <= Math.min(m - 1, centre + 2); j++) {
        const r = opts.refWords[j];
        if (r?.size) best = Math.max(best, overlapScore([opts.unitWords[i]], [r]));
      }
      scores.push(best);
    }
    if (scores.length >= 3) baseline = Math.min(0.8, scores.reduce((a, b) => a + b, 0) / scores.length);
  }
  const withRef = baseline >= 0.12;
  const lenWeight = withRef ? 0.5 : 1;
  const relSim = (score: number) => Math.max(0, Math.min(6, 6 * (1 - score / baseline)));
  /** similarity cost of version units [i0, i1) against English verses [j0, j1) (0 when no reference) */
  const simCost = (i0: number, i1: number, j0: number, j1: number): number => {
    if (!withRef) return 0;
    const refs = opts.refWords!.slice(j0, j1).filter((r): r is Set<string> => !!r?.size);
    const units = opts.unitWords!.slice(i0, i1);
    if (!refs.length || units.every((u) => !u.size)) return 1.5;
    return relSim(overlapScore(units, refs));
  };
  const supLen = (opts.supLen ?? 0) * ratio;
  const titleCost = (i0: number, i1: number): number => {
    const l = vl.slice(i0, i1).reduce((a, b) => a + b, 0);
    if (withRef && opts.refSupWords?.size) return lc(l, supLen) * 0.5 + relSim(overlapScore(opts.unitWords!.slice(i0, i1), [opts.refSupWords])) + 0.5 * (i1 - i0);
    if (supLen > 0) return lc(l, supLen) + 1 + 0.5 * (i1 - i0);
    return 3 + (vn[i0] === 1 ? 0 : 2) + 3 * (i1 - i0 - 1);
  };
  const INF = 1e18;
  const cost: Float64Array[] = Array.from({ length: n + 1 }, () => new Float64Array(m + 1).fill(INF));
  // move codes: 0 = 1–1, 1 = 2–1, 2..4 = 1–k, 5 = 1–0, 6 = 0–1, 7 = 2–0
  const back: Int8Array[] = Array.from({ length: n + 1 }, () => new Int8Array(m + 1).fill(-1));
  cost[0][0] = 0;
  // the version's own numbering is a strong hint; in a psalm with a title, numbers shifted by the
  // title (Hebrew numbering) agree as well
  const offsets = (opts.supLen ?? 0) > 0 ? [0, 1, 2] : [0];
  const numPenalty = (i: number, j: number) => (offsets.includes(vn[i] - eng[j]) ? 0 : 1.2);
  const absentCost = (e: number) => {
    const gap = opts.refGaps?.[e];
    if (omitted.has(e) || gap === 0) return 1; // a textual variant, or the reference lacks it too
    if (gap != null) return 8; // the reference prints it inside a neighbouring verse
    if (opts.cheapAbsent) return 1.5;
    return withRef ? 4.5 : 6;
  };
  function relax(i: number, j: number, c: number, move: number) {
    if (c < cost[i][j]) {
      cost[i][j] = c;
      back[i][j] = move;
    }
  }
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      const base = cost[i][j];
      if (base >= INF) continue;
      if (i < n && j < m) relax(i + 1, j + 1, base + lc(vl[i], len(eng[j])) * lenWeight + simCost(i, i + 1, j, j + 1) + numPenalty(i, j), 0);
      if (i + 1 < n && j < m) relax(i + 2, j + 1, base + lc(vl[i] + vl[i + 1], len(eng[j])) * lenWeight + simCost(i, i + 2, j, j + 1) + 2.5 + numPenalty(i, j) * 0.5, 1);
      for (let k = 2; k <= 4; k++) {
        if (i >= n || j + k > m) break;
        let sum = 0;
        for (let q = 0; q < k; q++) sum += len(eng[j + q]);
        relax(i + 1, j + k, base + lc(vl[i], sum) * lenWeight + simCost(i, i + 1, j, j + k) + 2.5 + 1.5 * (k - 2) + numPenalty(i, j) * 0.5, k);
      }
      if (j === 0 && i < n && i < 2) relax(i + 1, 0, base + titleCost(i, i + 1), 5);
      if (j === 0 && i === 0 && n > 1) relax(2, 0, base + titleCost(0, 2), 7);
      if (j < m) relax(i, j + 1, base + absentCost(eng[j]), 6);
    }
  }
  if (cost[n][m] >= INF) return null;
  const assign = new Array<number>(n).fill(0);
  const combined: number[] = [];
  const absent: number[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const mv = back[i][j];
    if (mv === 0) {
      assign[i - 1] = eng[j - 1];
      i--;
      j--;
    } else if (mv === 1) {
      assign[i - 1] = eng[j - 1];
      assign[i - 2] = eng[j - 1];
      i -= 2;
      j--;
    } else if (mv >= 2 && mv <= 4) {
      assign[i - 1] = eng[j - mv];
      for (let q = j - mv + 1; q < j; q++) combined.push(eng[q]);
      i--;
      j -= mv;
    } else if (mv === 5) {
      assign[i - 1] = 0;
      i--;
    } else if (mv === 7) {
      assign[i - 1] = 0;
      assign[i - 2] = 0;
      i -= 2;
    } else if (mv === 6) {
      absent.push(eng[j - 1]);
      j--;
    } else return null;
  }
  return { assign, combined: combined.sort((a, b) => a - b), absent: absent.sort((a, b) => a - b) };
}
