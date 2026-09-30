/**
 * Scripture references for confession chunks.
 *
 * Every reference is validated against the bundled BSB (book, chapter and verse must
 * exist) before it is stored as a refKey ("MAT.19.3-12"); anything that does not parse
 * cleanly is dropped rather than guessed. Sources that number the Psalms after the
 * Septuagint/Vulgate or call Samuel/Kings "1–4 Kings" (Catholic and Orthodox texts)
 * are restricted with `policy` so no reference is silently mis-mapped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PassageRef } from '../../../../src/domain/models.ts';
import { findBook, getBook, BOOKS } from '../../../../src/domain/books.ts';
import { refKey } from '../../../../src/domain/reference.ts';
import { ROOT } from './net.ts';

/* ---------------- verse counts from the bundled BSB ---------------- */

const maxVerse = new Map<string, number[]>();

function versesOf(book: string): number[] {
  let v = maxVerse.get(book);
  if (v) return v;
  const file = join(ROOT, 'public', 'data', 'bible', 'bsb', `${book}.json`);
  const data = JSON.parse(readFileSync(file, 'utf8')) as { chapters: { c: number; v: [number, ...unknown[]][] }[] };
  v = [];
  for (const ch of data.chapters) v[ch.c] = ch.v.reduce((m, verse) => Math.max(m, verse[0]), 0);
  maxVerse.set(book, v);
  return v;
}

const NT = new Set(BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id));

export interface RefPolicy {
  /** keep New Testament references only */
  ntOnly?: boolean;
  /** drop these books (e.g. PSA for Septuagint/Vulgate numbering) */
  exclude?: string[];
}

/** Books whose names or numbering differ in Septuagint/Vulgate-based Catholic and Orthodox texts. */
export const LXX_VULGATE_RISK = ['PSA', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'MAL', 'JOL'];

/** A validated PassageRef, or null when the book/chapter/verse does not exist in the BSB. */
export function makeRef(book: string, c1: number, v1?: number, c2?: number, v2?: number, policy: RefPolicy = {}): PassageRef | null {
  let info;
  try {
    info = getBook(book);
  } catch {
    return null;
  }
  if (policy.ntOnly && !NT.has(book)) return null;
  if (policy.exclude?.includes(book)) return null;
  const counts = versesOf(book);
  if (!Number.isInteger(c1) || c1 < 1 || c1 > info.chapters) return null;
  const endC = c2 ?? c1;
  if (endC < c1 || endC > info.chapters) return null;
  if (v1 == null) {
    return endC === c1 ? { book, startChapter: c1 } : { book, startChapter: c1, endChapter: endC };
  }
  if (v1 < 1 || v1 > (counts[c1] ?? 0)) return null;
  const endV = v2 ?? (c2 == null ? v1 : undefined);
  if (endV == null) return null;
  if (endV < 1 || endV > (counts[endC] ?? 0)) return null;
  if (endC === c1 && endV < v1) return null;
  return { book, startChapter: c1, startVerse: v1, endChapter: endC, endVerse: endV };
}

export function keyOf(ref: PassageRef): string {
  return refKey(ref);
}

/** Deduplicate refKeys preserving order. */
export function uniqueKeys(refs: (PassageRef | null | undefined)[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const r of refs) {
    if (!r) continue;
    const k = refKey(r);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }
  return out;
}

/* ---------------- OSIS (CCEL ThML scripRef/@osisRef) ---------------- */

const OSIS: Record<string, string> = {
  Gen: 'GEN', Exod: 'EXO', Lev: 'LEV', Num: 'NUM', Deut: 'DEU', Josh: 'JOS', Judg: 'JDG', Ruth: 'RUT', '1Sam': '1SA', '2Sam': '2SA',
  '1Kgs': '1KI', '2Kgs': '2KI', '1Chr': '1CH', '2Chr': '2CH', Ezra: 'EZR', Neh: 'NEH', Esth: 'EST', Job: 'JOB', Ps: 'PSA', Prov: 'PRO',
  Eccl: 'ECC', Song: 'SNG', Isa: 'ISA', Jer: 'JER', Lam: 'LAM', Ezek: 'EZK', Dan: 'DAN', Hos: 'HOS', Joel: 'JOL', Amos: 'AMO',
  Obad: 'OBA', Jonah: 'JON', Mic: 'MIC', Nah: 'NAM', Hab: 'HAB', Zeph: 'ZEP', Hag: 'HAG', Zech: 'ZEC', Mal: 'MAL',
  Matt: 'MAT', Mark: 'MRK', Luke: 'LUK', John: 'JHN', Acts: 'ACT', Rom: 'ROM', '1Cor': '1CO', '2Cor': '2CO', Gal: 'GAL', Eph: 'EPH',
  Phil: 'PHP', Col: 'COL', '1Thess': '1TH', '2Thess': '2TH', '1Tim': '1TI', '2Tim': '2TI', Titus: 'TIT', Phlm: 'PHM', Heb: 'HEB',
  Jas: 'JAS', '1Pet': '1PE', '2Pet': '2PE', '1John': '1JN', '2John': '2JN', '3John': '3JN', Jude: 'JUD', Rev: 'REV',
};

/** "Bible:Gen.2.24", "Bible:Mark.10.6-Mark.10.9", "Bible:Lev.18", space-separated lists. */
export function refsFromOsis(osisRef: string, policy: RefPolicy = {}): PassageRef[] {
  const out: PassageRef[] = [];
  for (const part of osisRef.trim().split(/\s+/)) {
    const m = /^(?:Bible[^:]*:)?([1-3]?[A-Za-z]+)\.(\d+)(?:\.(\d+))?(?:-(?:([1-3]?[A-Za-z]+)\.)?(\d+)(?:\.(\d+))?)?$/.exec(part);
    if (!m) continue;
    const [, b1, c1s, v1s, b2, x, y] = m;
    const book = OSIS[b1];
    if (!book || (b2 && OSIS[b2] !== book)) continue;
    const c1 = Number(c1s);
    let ref: PassageRef | null = null;
    if (v1s == null) {
      ref = makeRef(book, c1, undefined, x != null ? Number(x) : undefined, undefined, policy);
    } else if (x == null) {
      ref = makeRef(book, c1, Number(v1s), undefined, undefined, policy);
    } else if (y != null) {
      ref = makeRef(book, c1, Number(v1s), Number(x), Number(y), policy);
    } else {
      // "Mark.10.6-9" style (verse range in the same chapter)
      ref = makeRef(book, c1, Number(v1s), c1, Number(x), policy);
    }
    if (ref) out.push(ref);
  }
  return out;
}

/* ---------------- free-text scanning ---------------- */

const ROMAN: Record<string, number> = { i: 1, v: 5, x: 10, l: 50, c: 100 };
function romanToInt(s: string): number | null {
  const t = s.toLowerCase();
  if (!/^[ivxlc]+$/.test(t)) return null;
  let total = 0;
  for (let i = 0; i < t.length; i++) {
    const a = ROMAN[t[i]];
    const b = ROMAN[t[i + 1]] ?? 0;
    total += a < b ? -a : a;
  }
  return total > 0 && total <= 150 ? total : null;
}

function num(s: string): number | null {
  if (/^\d+$/.test(s)) return Number(s);
  return romanToInt(s);
}

export interface ScanOptions extends RefPolicy {
  /**
   * 'standard': "Rom. 3:28", "Rom. iii. 28", "Matt. 19:5, 6" (comma continues verses)
   * 'triglot':  "Rom. 3, 28" (comma separates chapter and verse), "Rom. 3 and 4"
   */
  style?: 'standard' | 'triglot';
}

// Longest names first so "1 John" wins over "John" and "Song of Solomon" over "Song".
const BOOK_WORD = String.raw`(?<![A-Za-z0-9])(?:(?:[1-3]|I{1,3}|First|Second|Third)\s*\.?\s*)?[A-Z][a-z]+\.?(?:\s+of\s+[A-Z][a-z]+)?`;
// chapter: Arabic, or lower-case Roman as printed in 19th-century editions ("Matt. xix. 6")
const CH = String.raw`(\d{1,3}|[ivxlc]{1,8})`;

/**
 * Find Scripture references in running text (proof-text lists, parenthetical citations).
 * Only "Book chapter[sep verse]" patterns with a recognised book name are accepted;
 * continuation items ("; 14:3", ", 12") inherit the book (and chapter) of the item before.
 */
export function scanRefs(text: string, opts: ScanOptions = {}): PassageRef[] {
  const style = opts.style ?? 'standard';
  const out: PassageRef[] = [];
  const re = new RegExp(String.raw`(${BOOK_WORD})\s*` + CH + String.raw`(?![a-z])`, 'g');
  let m: RegExpExecArray | null;
  const s = text.replace(/[‐-―−]/g, '-');
  while ((m = re.exec(s))) {
    const bookToken = m[1].replace(/\s+of\s+/i, ' of ').replace(/\.$/, '');
    const info = findBook(bookToken) ?? findBook(bookToken.replace(/\./g, ''));
    // not a book ("Gospel. 1 Cor. 9:14"): resume right after the word so a following reference is still found
    const resume = () => (re.lastIndex = m!.index + m![1].length);
    if (!info) {
      resume();
      continue;
    }
    // reject bare words that happen to be book abbreviations in prose unless followed by a number pattern we trust
    // (a Roman-numeral chapter must then be followed by a verse: "Mark x. 9")
    if (/^(?:Is|Am|Job|Acts|Song|Mark|Jude|Numbers|Judges|Lamentations|Kings)$/.test(bookToken) && !/\d/.test(m[2]) && !/^\s*\.\s*\d/.test(s.slice(re.lastIndex))) {
      resume();
      continue;
    }
    const book = info.id;
    let chapter = num(m[2]);
    if (chapter == null) continue;
    let pos = re.lastIndex;
    // first item
    const first = matchItem(s, pos, style, true);
    let lastChapter = chapter;
    let hasVerse = false;
    if (first) {
      pos = first.end;
      const r = buildItem(book, chapter, first, opts);
      if (r) out.push(r);
      if (first.verse != null) hasVerse = true;
      if (first.chapter2 != null) lastChapter = first.chapter2;
    } else {
      const r = makeRef(book, chapter, undefined, undefined, undefined, opts);
      if (r) out.push(r);
    }
    // continuation items: ", 6" / "; 14:3" / " and 4"
    for (;;) {
      const cont = /^\s*([,;]|and|&)\s*/.exec(s.slice(pos));
      if (!cont) break;
      const after = pos + cont[0].length;
      // a new book name starts a new match
      const nb = new RegExp('^(' + BOOK_WORD + String.raw`)\s*(?:\d|[ivxlc]+\.)`).exec(s.slice(after));
      if (nb) {
        const tok = nb[1].replace(/\s+of\s+/i, ' of ').replace(/\.$/, '');
        if (findBook(tok) ?? findBook(tok.replace(/\./g, ''))) break;
      }
      const sep = cont[1];
      const cv = new RegExp(String.raw`^` + CH + String.raw`\s*[:.]\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?(?![\d:]|\.\d)`).exec(s.slice(after));
      if (cv && (style === 'standard' || sep === ';')) {
        const c = num(cv[1]);
        if (c == null) break;
        chapter = c;
        const r = makeRef(book, c, Number(cv[2]), cv[3] ? c : undefined, cv[3] ? Number(cv[3]) : undefined, opts);
        if (r) out.push(r);
        hasVerse = true;
        lastChapter = c;
        pos = after + cv[0].length;
        continue;
      }
      const single = /^(\d{1,3})(?:\s*-\s*(\d{1,3}))?(?!\d|\s*[:.]\s*\d)/.exec(s.slice(after));
      if (!single) break;
      const n1 = Number(single[1]);
      const n2 = single[2] ? Number(single[2]) : undefined;
      if (style === 'standard' && sep === ',' && hasVerse) {
        const r = makeRef(book, lastChapter, n1, n2 != null ? lastChapter : undefined, n2, opts);
        if (r) out.push(r);
      } else if (style === 'triglot' && sep === ',' && !hasVerse) {
        // "Rom. 3, 28": chapter, verse
        const r = makeRef(book, lastChapter, n1, n2 != null ? lastChapter : undefined, n2, opts);
        if (r) {
          // replace the whole-chapter ref pushed for the first item
          const prev = out[out.length - 1];
          if (prev && prev.book === book && prev.startChapter === lastChapter && prev.startVerse == null) out.pop();
          out.push(r);
        }
        hasVerse = true;
      } else if (style === 'triglot' && sep === ',' && hasVerse) {
        const r = makeRef(book, lastChapter, n1, n2 != null ? lastChapter : undefined, n2, opts);
        if (r) out.push(r);
      } else {
        // "; 4" or "and 4": another chapter
        const r = makeRef(book, n1, undefined, n2, undefined, opts);
        if (r) out.push(r);
        lastChapter = n2 ?? n1;
        hasVerse = false;
      }
      pos = after + single[0].length;
    }
    re.lastIndex = Math.max(re.lastIndex, pos);
  }
  return out;
}

interface Item {
  verse?: number;
  chapter2?: number;
  verse2?: number;
  end: number;
}

/** After "Book chapter": optional ":verse", "-verse", "-chapter:verse". */
function matchItem(s: string, pos: number, style: 'standard' | 'triglot', _first: boolean): Item | null {
  const rest = s.slice(pos);
  let m = /^\s*[:.]\s*(\d{1,3})\s*-\s*(\d{1,3})\s*[:.]\s*(\d{1,3})/.exec(rest);
  if (m) return { verse: Number(m[1]), chapter2: Number(m[2]), verse2: Number(m[3]), end: pos + m[0].length };
  m = /^\s*[:.]\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?/.exec(rest);
  if (m && (style === 'standard' || rest.trimStart()[0] === ':')) return { verse: Number(m[1]), verse2: m[2] ? Number(m[2]) : undefined, end: pos + m[0].length };
  m = /^\s*-\s*(\d{1,3})(?![\d:.])/.exec(rest);
  if (m) return { chapter2: Number(m[1]), end: pos + m[0].length };
  return null;
}

function buildItem(book: string, chapter: number, it: Item, policy: RefPolicy): PassageRef | null {
  if (it.verse == null) return makeRef(book, chapter, undefined, it.chapter2, undefined, policy);
  if (it.chapter2 != null && it.verse2 != null) return makeRef(book, chapter, it.verse, it.chapter2, it.verse2, policy);
  if (it.verse2 != null) return makeRef(book, chapter, it.verse, chapter, it.verse2, policy);
  return makeRef(book, chapter, it.verse, undefined, undefined, policy);
}
