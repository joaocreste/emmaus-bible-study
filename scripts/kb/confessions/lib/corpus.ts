/**
 * Corpus assembly, validation and deterministic output (kb/corpus/<id>.json).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { CorpusFile, KbDocument } from '../../../../server/kb/corpus.ts';
import { ROOT } from './net.ts';

export type { CorpusFile, KbDocument };

export const CORPUS_DIR = join(ROOT, 'kb', 'corpus');

/** A document builder's output: documents plus the URLs they were read from. */
export interface Part {
  /** short label for logs and the report */
  name: string;
  documents: KbDocument[];
  /** every URL downloaded for this part (for origin / retrieval date) */
  urls: string[];
}

const MOJIBAKE = /\u00e2\u20ac|\u00c3[\u0080-\u00bf]|\u00c2[\u00a0-\u00bf]|[\u00ce\u00cf][\u0080-\u00bf]|\ufffd|&[a-z]+;|&#\d+;/;
const TAG = /<\/?[a-zA-Z][^>]*>/;

/** Throws when a document is malformed; returns warnings for soft issues. */
export function validateDocuments(corpusId: string, docs: KbDocument[]): string[] {
  const warnings: string[] = [];
  const ids = new Set<string>();
  for (const d of docs) {
    const where = `${corpusId}/${d.id}`;
    if (!d.id || ids.has(d.id)) throw new Error(`${where}: missing or duplicate id`);
    ids.add(d.id);
    if (!d.title?.trim()) throw new Error(`${where}: empty title`);
    if (!d.text?.trim()) throw new Error(`${where}: empty text`);
    for (const [field, value] of [['title', d.title], ['text', d.text], ['locator', d.locator ?? '']] as const) {
      if (MOJIBAKE.test(value)) throw new Error(`${where}: suspicious encoding in ${field}: ${JSON.stringify(value.match(MOJIBAKE)?.[0])}`);
      if (TAG.test(value)) throw new Error(`${where}: HTML tag left in ${field}: ${JSON.stringify(value.match(TAG)?.[0])}`);
    }
    if (d.url && !/^https:\/\/[^\s]+$/.test(d.url)) throw new Error(`${where}: url must be https: ${d.url}`);
    if (d.text.length < 20) warnings.push(`${where}: very short text (${d.text.length} chars)`);
  }
  return warnings;
}

/** Stable key order for every document, so rebuilds diff cleanly. */
function orderDoc(d: KbDocument): KbDocument {
  const out: KbDocument = { id: d.id, title: d.title, text: d.text };
  if (d.sourceId) out.sourceId = d.sourceId;
  if (d.authorId) out.authorId = d.authorId;
  if (d.locator) out.locator = d.locator;
  if (d.url) out.url = d.url;
  if (d.tradition) out.tradition = d.tradition;
  if (d.refs?.length) out.refs = d.refs;
  if (d.keywords?.length) out.keywords = [...new Set(d.keywords)];
  if (d.aspects?.length) out.aspects = d.aspects;
  return out;
}

export async function writeCorpus(file: CorpusFile): Promise<{ path: string; bytes: number }> {
  await mkdir(CORPUS_DIR, { recursive: true });
  const path = join(CORPUS_DIR, `${file.corpus.id}.json`);
  const body = JSON.stringify({ corpus: file.corpus, documents: file.documents.map(orderDoc) }, null, 1) + '\n';
  await writeFile(path, body);
  return { path, bytes: Buffer.byteLength(body) };
}

/** Title-case helper for ALL-CAPS headings ("OF MARRIAGE AND DIVORCE" -> "Of Marriage and Divorce"). */
export function titleCase(s: string): string {
  const small = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'the', 'to', 'unto', 'upon', 'with']);
  return s
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('')
    .replace(/\b(god|christ|jesus|holy ghost|holy spirit|lord)\b/gi, (w) => w.replace(/\b\w/g, (c) => c.toUpperCase()));
}

/** Roman numeral (upper or lower case) to integer, or null. */
export function roman(s: string): number | null {
  const map: Record<string, number> = { i: 1, v: 5, x: 10, l: 50, c: 100 };
  const t = s.trim().toLowerCase().replace(/\.$/, '');
  if (!/^[ivxlc]+$/.test(t)) return null;
  let total = 0;
  for (let i = 0; i < t.length; i++) {
    const a = map[t[i]];
    const b = map[t[i + 1]] ?? 0;
    total += a < b ? -a : a;
  }
  return total;
}

/**
 * Printers set the first word of a section in capitals ("THERE is but one living…").
 * Lower-case that typographic opener (keeping a leading capital) when the rest is in normal case.
 */
export function fixDropCap(s: string): string {
  if (!/[a-z]/.test(s)) return s;
  return s.replace(/^([A-Z][A-Z’']+)(?=[\s,;:.])/, (w) => (w.length > 1 && w !== 'GOD' ? w[0] + w.slice(1).toLowerCase() : w));
}

/**
 * Remove an accidental tandem repeat (a passage transcribed twice in a row, as happens where a
 * transcription joins two page scans). Returns the text and the removed passage, if any.
 */
export function removeTandemRepeat(s: string, minLength = 60): { text: string; removed?: string } {
  for (let len = Math.floor(s.length / 2); len >= minLength; len--) {
    for (let i = 0; i + 2 * len <= s.length; i++) {
      if (s.charCodeAt(i) !== s.charCodeAt(i + len)) continue;
      if (s.slice(i, i + len) === s.slice(i + len, i + 2 * len)) return { text: s.slice(0, i + len) + s.slice(i + 2 * len), removed: s.slice(i, i + len) };
    }
  }
  return { text: s };
}

/**
 * Break a paragraph longer than `max` characters at sentence ends into pieces of roughly equal
 * size (some printed paragraphs run to several pages). Shorter paragraphs are returned as is.
 */
export function splitSentences(p: string, max: number): string[] {
  if (p.length <= max * 1.2) return [p];
  const sentences = p.split(/(?<=[.;:?!][”"’')\]]?)\s+(?=[A-Z“"‘(])/);
  const n = Math.ceil(p.length / max);
  const target = p.length / n;
  const out: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if (cur && cur.length + s.length > target * 1.1) {
      out.push(cur);
      cur = '';
    }
    cur = cur ? `${cur} ${s}` : s;
  }
  if (cur) out.push(cur);
  return out;
}
