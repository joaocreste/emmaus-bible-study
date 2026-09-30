/**
 * Easton’s Bible Dictionary (1897) and Smith’s Bible Dictionary (1863) → kb/corpus/{easton,smith}.json.
 *
 * Source: the NEUU bible-dictionary-dataset (CC BY 4.0), which ships the CCEL
 * ThML editions (data/00_raw/ccel/xml). We parse that XML rather than the
 * dataset's 02_sources JSON because the JSON truncates every definition at
 * 5,000 characters (WINE, JERUSALEM, … end mid-sentence) and its
 * `scripture_refs` are merged across both dictionaries. From the XML each entry
 * keeps its complete text and exactly the references its own <scripRef> tags carry.
 *
 * One document per entry; entries longer than ~2,500 characters are split at
 * paragraph (then sentence) boundaries into "(part n)" chunks.
 */
import type { PassageRef } from '../../src/domain/models.ts';
import { findBook } from '../../src/domain/books.ts';
import { refKey } from '../../src/domain/reference.ts';
import type { CorpusFile, KbDocument } from '../../server/kb/corpus.ts';
import { log, mergeAdjacent, slugify, validateRef, type RefStats } from './lib/io.ts';
import { attr, blockText, inlineText, osisToRef, scanParentheticalRefs } from './lib/thml.ts';

export const CHUNK_CHARS = 2500;

export interface DictionaryBuildStats {
  entries: number;
  documents: number;
  chunkedEntries: number;
  emptyEntries: number;
  refs: RefStats;
}

interface RawEntry {
  term: string;
  letter: string;
  text: string;
  /** paragraphs with the references each one carries */
  paragraphs: { text: string; refs: PassageRef[] }[];
}

const APOCRYPHA = /^Bible:(Wis|PrAzar|Sir|Tob|Jdt|Bar|[1-4]Macc|[12]Esd|Sus|Bel|PrMan|AddEsth)\b/;

/**
 * @param scanText also read references written without <scripRef> tags from parenthesised
 *   lists with the book carried over (Easton keeps book names in its text; Smith's CCEL text
 *   dropped them, so its tags are the only reliable source).
 */
export function parseDictionaryXml(xml: string, stats: RefStats, scanText = false): RawEntry[] {
  const out: RawEntry[] = [];
  const re = /<term\b([^>]*)>([\s\S]*?)<\/term>\s*<def\b[^>]*>([\s\S]*?)<\/def>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const term = inlineText(m[2]);
    const letter = (attr(m[1], 'id') ?? '').split('-')[0] || term.charAt(0).toLowerCase();
    // Paragraph-level blocks (p, li) keep their own references so chunks carry the right refs.
    const blocks = m[3]
      .replace(/<li\b/gi, '\u0000<li')
      .replace(/<p\b/gi, '\u0000<p')
      .split('\u0000')
      .map((html) => {
        const refs: PassageRef[] = [];
        for (const s of html.matchAll(/<scripRef\b([^>]*)>/g)) {
          const osis = attr(s[1], 'osisRef') ?? '';
          const ref = osisToRef(osis);
          if (ref) refs.push(ref);
          else if (APOCRYPHA.test(osis)) stats.apocrypha++;
          else stats.malformed++;
        }
        const text = blockText(html);
        if (scanText) refs.push(...scanParentheticalRefs(text, (token) => findBook(token)?.id));
        return { text: /^<li/i.test(html.trim()) && text && !text.startsWith('•') ? `• ${text}` : text, refs };
      })
      .filter((b) => b.text);
    out.push({ term, letter, text: blocks.map((b) => b.text).join('\n\n'), paragraphs: blocks });
  }
  return out;
}

/** Split a long paragraph at sentence boundaries into pieces of at most `max` characters. */
function splitSentences(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const sentences = text.match(/[^.!?]+(?:[.!?]+["”’)]*|$)\s*/g) ?? [text];
  const out: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if (cur && cur.length + s.length > max) {
      out.push(cur.trim());
      cur = '';
    }
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function chunkEntry(entry: RawEntry, max: number): { text: string; refs: PassageRef[] }[] {
  if (entry.text.length <= max) return [{ text: entry.text, refs: entry.paragraphs.flatMap((p) => p.refs) }];
  const pieces: { text: string; refs: PassageRef[] }[] = [];
  for (const p of entry.paragraphs) {
    const parts = splitSentences(p.text, max);
    parts.forEach((t, i) => pieces.push({ text: t, refs: i === 0 ? p.refs : [] }));
  }
  const chunks: { text: string; refs: PassageRef[] }[] = [];
  let cur: { text: string; refs: PassageRef[] } | null = null;
  for (const piece of pieces) {
    if (cur && cur.text.length + 2 + piece.text.length > max) {
      chunks.push(cur);
      cur = null;
    }
    cur = cur ? { text: `${cur.text}\n\n${piece.text}`, refs: [...cur.refs, ...piece.refs] } : { ...piece };
  }
  if (cur) chunks.push(cur);
  return chunks;
}

export interface DictionarySpec {
  id: 'easton' | 'smith';
  label: string;
  sourceId: string;
  authorId: string;
  urlFor: (term: string, letter: string) => string;
  origin: CorpusFile['corpus']['origin'];
}

export function buildDictionaryCorpus(raw: RawEntry[], spec: DictionarySpec, counts: Map<string, number>, refStats: RefStats): { corpus: CorpusFile; stats: DictionaryBuildStats } {
  const stats: DictionaryBuildStats = { entries: raw.length, documents: 0, chunkedEntries: 0, emptyEntries: 0, refs: refStats };
  const documents: KbDocument[] = [];
  const usedIds = new Set<string>();
  for (const entry of raw) {
    if (!entry.text.trim()) {
      stats.emptyEntries++;
      continue;
    }
    const chunks = chunkEntry(entry, CHUNK_CHARS);
    if (chunks.length > 1) stats.chunkedEntries++;
    let base = `${spec.id}:${slugify(entry.term) || 'entry'}`;
    for (let n = 2; usedIds.has(base) || usedIds.has(`${base}#1`); n++) base = `${spec.id}:${slugify(entry.term)}-${n}`;
    chunks.forEach((chunk, i) => {
      const multi = chunks.length > 1;
      const id = multi ? `${base}#${i + 1}` : base;
      usedIds.add(id);
      const valid = chunk.refs.map((r) => validateRef(r, counts, refStats)).filter((r): r is PassageRef => r !== null);
      const refs = [...new Set(mergeAdjacent(dedupeRefs(valid)).map(refKey))];
      documents.push({
        id,
        title: multi ? `${entry.term} (part ${i + 1})` : entry.term,
        text: chunk.text,
        authorId: spec.authorId,
        locator: multi ? `s.v. ${entry.term}, part ${i + 1} of ${chunks.length}` : `s.v. ${entry.term}`,
        url: spec.urlFor(entry.term, entry.letter),
        ...(refs.length ? { refs } : {}),
      });
    });
  }
  stats.documents = documents.length;
  log(
    `${spec.id}: ${stats.entries} entries → ${stats.documents} documents (${stats.chunkedEntries} entries chunked, ${stats.emptyEntries} empty);` +
      ` refs kept ${refStats.kept}, clamped ${refStats.clamped}, dropped: apocrypha ${refStats.apocrypha}, malformed ${refStats.malformed}, out of range ${refStats.outOfRange}`,
  );
  return {
    corpus: { corpus: { id: spec.id, label: spec.label, kind: 'dictionary', sourceId: spec.sourceId, origin: spec.origin }, documents },
    stats,
  };
}

/** Drop exact duplicates and refs contained in an earlier one (tags + text scan overlap). */
function dedupeRefs(refs: PassageRef[]): PassageRef[] {
  const seen = new Set<string>();
  const out: PassageRef[] = [];
  for (const r of refs) {
    const k = refKey(r);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}
