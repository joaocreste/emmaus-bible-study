/**
 * Helpers for CCEL ThML books (Philip Schaff, The Creeds of Christendom, vols. 2–3).
 * Schaff prints most documents in parallel columns (Latin/Greek/German | English);
 * these helpers pull the English column in reading order, keep the proof-text notes
 * (<note><scripRef osisRef=…>) apart from the text, and build CCEL deep links.
 */
import { byId, findAll, findFirst, isEl, parseHtml, textOf, type El, type Node } from './html.ts';
import { fetchText } from './net.ts';
import { findBook } from '../../../../src/domain/books.ts';
import { refsFromOsis, type RefPolicy } from './refs.ts';
import type { PassageRef } from '../../../../src/domain/models.ts';

export const SCHAFF = {
  vol2: { xml: 'https://ccel.org/ccel/s/schaff/creeds2.xml', page: (id: string) => `https://ccel.org/ccel/schaff/creeds2/creeds2.${id}.html` },
  vol3: { xml: 'https://ccel.org/ccel/s/schaff/creeds3.xml', page: (id: string) => `https://ccel.org/ccel/schaff/creeds3/creeds3.${id}.html` },
} as const;

const cache = new Map<string, El>();

export async function loadThml(url: string): Promise<El> {
  let root = cache.get(url);
  if (!root) {
    root = parseHtml(await fetchText(url), { xml: true });
    cache.set(url, root);
  }
  return root;
}

export function div(root: El, id: string): El {
  const el = findFirst(root, byId(id));
  if (!el) throw new Error(`ThML division not found: ${id}`);
  return el;
}

const isNote = (el: El) => el.tag === 'note' || el.tag === 'pb';

/** Text without footnotes/page breaks. */
export function cleanText(node: Node): string {
  return textOf(node, { skip: isNote });
}

/** Scripture references in the element's notes (proof texts) and inline scripRefs. */
export function scripRefs(node: El, policy: RefPolicy = {}, opts: { notesOnly?: boolean; inlineOnly?: boolean } = {}): PassageRef[] {
  const out: PassageRef[] = [];
  const rec = (el: El, inNote: boolean) => {
    for (const c of el.children) {
      if (!isEl(c)) continue;
      const note = inNote || c.tag === 'note';
      if (c.tag === 'scripref' || c.tag === 'scripRef') {
        if ((opts.notesOnly && !note) || (opts.inlineOnly && note)) continue;
        const osis = c.attrs.osisref;
        if (osis) {
          const label = textOf(c);
          for (const r of refsFromOsis(osis, policy)) if (agreesWithLabel(r, label)) out.push(r);
        }
        continue;
      }
      rec(c, note);
    }
  };
  rec(node, node.tag === 'note');
  return out;
}

const ROMAN_NUM: Record<string, number> = { i: 1, v: 5, x: 10, l: 50, c: 100 };
function romanValue(t: string): number {
  let total = 0;
  for (let i = 0; i < t.length; i++) {
    const a = ROMAN_NUM[t[i]];
    const b = ROMAN_NUM[t[i + 1]] ?? 0;
    total += a < b ? -a : a;
  }
  return total;
}

/**
 * CCEL tags references automatically and sometimes mis-parses a printed citation
 * ("vi. 23" tagged as Rom. 4:23). Keep a tagged reference only when the printed label agrees
 * with it: a book named in the label must be the same book, a chapter printed in the label
 * (Roman numeral, or "N:" / "N." before a verse) must be the reference's chapter, and when
 * the label prints verse numbers the reference's first verse must be one of them.
 */
export function agreesWithLabel(ref: PassageRef, label: string): boolean {
  const t = label.replace(/\s+/g, ' ').trim();
  const bookWord = /^((?:[1-3]|I{1,3})\s*\.?\s*)?[A-Z][a-z]+\.?/.exec(t);
  if (bookWord) {
    const info = findBook(bookWord[0].replace(/\.$/, '')) ?? findBook(bookWord[0].replace(/\./g, ''));
    if (info && info.id !== ref.book) return false;
  }
  const rest = bookWord ? t.slice(bookWord[0].length) : t;
  const chapters = new Set<number>();
  for (const m of rest.matchAll(/(?<![a-z])([ivxlc]+)\.(?![a-z])/g)) chapters.add(romanValue(m[1]));
  for (const m of rest.matchAll(/\b(\d{1,3})\s*[:.]\s*\d/g)) chapters.add(Number(m[1]));
  // "Matt 22", "Rom. 3" — a lone number right after the book name is the chapter
  const lone = /^\s*(\d{1,3})\s*$/.exec(rest);
  if (bookWord && lone) chapters.add(Number(lone[1]));
  if (chapters.size && !chapters.has(ref.startChapter)) return false;
  if (ref.startVerse != null) {
    const nums = [...rest.matchAll(/\d{1,3}/g)].map((m) => Number(m[0]));
    if (nums.length && !nums.includes(ref.startVerse)) return false;
  }
  return true;
}

/** Is most of this cell's text marked as a non-English language (lang="LA"/"DE"/"EL"/"FR"…)? */
function foreignShare(cell: El): number {
  let foreign = 0;
  let total = 0;
  const rec = (n: Node, lang: string | undefined) => {
    if (!isEl(n)) {
      const len = n.replace(/\s+/g, '').length;
      total += len;
      if (lang && !/^en/i.test(lang)) foreign += len;
      return;
    }
    if (isNote(n)) return;
    const l = n.attrs.lang ?? lang;
    for (const c of n.children) rec(c, l);
  };
  rec(cell, undefined);
  return total === 0 ? 0 : foreign / total;
}

export interface Cell {
  el: El;
  text: string;
}

/**
 * The English cells of every parallel table under `root`, in document order.
 * `col` picks a fixed column; otherwise the column with the least text marked
 * as another language is used per row.
 */
export function englishCells(root: El, col?: number): Cell[] {
  const out: Cell[] = [];
  for (const tr of findAll(root, (el) => el.tag === 'tr')) {
    const tds = tr.children.filter((c): c is El => isEl(c) && (c.tag === 'td' || c.tag === 'th'));
    if (tds.length < 2) continue;
    let pick: El | undefined;
    if (col != null) pick = tds[col];
    else {
      const shares = tds.map(foreignShare);
      const min = Math.min(...shares);
      pick = tds[shares.indexOf(min)];
      if (min > 0.5) pick = undefined;
    }
    if (!pick) continue;
    const text = cleanText(pick);
    if (text) out.push({ el: pick, text });
  }
  return out;
}

/**
 * Join cell texts that were split across printed pages: a cell that does not end a
 * sentence continues into the next one.
 */
export function joinCells(texts: string[]): string {
  let out = '';
  for (const t of texts) {
    if (!out) {
      out = t;
      continue;
    }
    const ends = /[.!?:;”"’')\]]$/.test(out.trimEnd());
    const startsLower = /^[a-z(]/.test(t);
    out += ends && !startsLower ? `\n\n${t}` : ` ${t}`;
  }
  return out.trim();
}
