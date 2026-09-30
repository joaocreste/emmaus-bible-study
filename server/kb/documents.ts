/**
 * Everything the full-text index holds, normalised to one document shape:
 *
 *   corpus files     kb/corpus/*.json (Nave, Torrey, Easton, Smith, confessions, … — loaded generically)
 *   tyndale-notes    public/data/commentary/tyndale/*.json   (all 16,923 study notes)
 *   tyndale-intros   public/data/intros/*.json               (book introductions, split by section heading)
 *   lexicon          public/data/lexicon/{G,H}/*.json        (one document per STEPBible sense)
 *   curated          src/data/curated (see ./curated.ts)
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BOOKS } from '../../src/domain/books';
import { formatRef, refKey, wholeBook } from '../../src/domain/reference';
import type { EvidenceKind } from '../../src/inference/protocol';
import type { CommentaryBookFile, IntroFile, LexiconShardFile } from '../../src/providers/local/formats';
import { describeLexiconMorph } from '../../src/providers/local/morphology';
import { normalizeStrong } from '../../src/providers/local/strong';
import type { SourceRegistry } from '../../src/providers/types';
import type { CorpusFile } from './corpus';

/** One searchable document. `text` is the complete retrieved text (evidence excerpts are cut from it). */
export interface KbIndexDoc {
  /** stable key: 'naves:divorce', 'tyndale:MAT.19.3', 'intro:MAT:2', 'lex:G630H', 'curated:romans-8:ctx:authorship' */
  key: string;
  /** corpus id (stats, per-corpus diversity) */
  corpus: string;
  kind: EvidenceKind;
  title: string;
  text: string;
  sourceId: string;
  quotable: boolean;
  keywords?: string[];
  authorId?: string;
  locator?: string;
  url?: string;
  /** refKey strings */
  refs?: string[];
  /** base Strong's number (lexicon documents) */
  strong?: string;
  /** lexicon documents: the disambiguated sense ("G630H") and how often it is tagged in the bundled text */
  extendedStrong?: string;
  frequency?: number;
  tradition?: string;
  /** topical-index reference groups */
  aspects?: { label: string; refs: string[] }[];
  /** what the index reads instead of `text` (topical docs: labels only, so book names don't match everything) */
  searchText?: string;
  /** what the index reads as the title field (default `title`): the bare heading, without the work's name */
  heading?: string;
}

export interface CorpusMeta {
  id: string;
  label: string;
  kind: EvidenceKind;
}

/** Can the work be quoted? Public domain / open licence (full-text) or short excerpts. */
export function isQuotable(sources: SourceRegistry, sourceId: string): boolean {
  const usage = sources.getSource(sourceId)?.license.usage;
  return usage === 'full-text' || usage === 'excerpt';
}

/* ------------------------------------------------------------------ */
/* kb/corpus/*.json                                                    */
/* ------------------------------------------------------------------ */

export interface LoadedCorpus {
  file: string;
  meta: CorpusMeta;
  docs: KbIndexDoc[];
}

/** "Westminster Confession 24.5 …" → "… [Reformed]" unless the title already names the tradition. */
function withTradition(title: string, tradition: string | undefined): string {
  if (!tradition || title.toLowerCase().includes(tradition.toLowerCase())) return title;
  return `${title} [${tradition}]`;
}

/** Titles of evidence from a corpus: "Nave’s Topical Bible (1896) — DIVORCE"; confessions keep their own titles. */
function corpusTitle(file: CorpusFile, title: string): string {
  if (file.corpus.kind === 'topical-index' || file.corpus.kind === 'dictionary') return `${file.corpus.label} — ${title}`;
  return title;
}

export function corpusDocuments(file: CorpusFile, sources: SourceRegistry, warn: (msg: string) => void): KbIndexDoc[] {
  const docs: KbIndexDoc[] = [];
  const unknown = new Set<string>();
  for (const d of file.documents ?? []) {
    if (!d || typeof d.id !== 'string' || typeof d.text !== 'string' || !d.text.trim()) continue;
    const sourceId = d.sourceId ?? file.corpus.sourceId;
    if (!sources.getSource(sourceId)) unknown.add(sourceId);
    const keywords = [...(d.keywords ?? []), ...(d.tradition ? [d.tradition] : [])];
    const doc: KbIndexDoc = {
      key: d.id,
      corpus: file.corpus.id,
      kind: file.corpus.kind,
      title: withTradition(corpusTitle(file, d.title), d.tradition),
      heading: d.title.replace(/\s*\(part \d+\)$/i, ''),
      text: d.text,
      sourceId,
      quotable: isQuotable(sources, sourceId),
    };
    if (keywords.length) doc.keywords = keywords;
    if (d.authorId) doc.authorId = d.authorId;
    if (d.locator) doc.locator = d.locator;
    if (d.url) doc.url = d.url;
    if (d.refs?.length) doc.refs = d.refs;
    if (d.tradition) doc.tradition = d.tradition;
    if (d.aspects?.length) {
      doc.aspects = d.aspects;
      const see = /^See also: .*$/m.exec(d.text)?.[0] ?? '';
      doc.searchText = `${d.title}\n${d.aspects.map((a) => a.label).join('\n')}\n${see}`;
    }
    docs.push(doc);
  }
  if (unknown.size) warn(`corpus ${file.corpus.id}: source id(s) not in the SourceRegistry (evidence will not be quotable): ${[...unknown].join(', ')}`);
  return docs;
}

/** Read every kb/corpus/*.json. A file that fails to parse (e.g. being rewritten) is skipped with a warning. */
export async function readCorpusFiles(dir: string, warn: (msg: string) => void): Promise<{ file: string; raw: string }[]> {
  let names: string[] = [];
  try {
    names = (await readdir(dir)).filter((n) => n.endsWith('.json')).sort();
  } catch {
    warn(`no corpus directory at ${dir}`);
    return [];
  }
  const out: { file: string; raw: string }[] = [];
  for (const name of names) out.push({ file: name, raw: await readFile(join(dir, name), 'utf8') });
  return out;
}

export function parseCorpus(file: string, raw: string, warn: (msg: string) => void): CorpusFile | null {
  try {
    const parsed = JSON.parse(raw) as CorpusFile;
    if (!parsed?.corpus?.id || !parsed.corpus.kind || !Array.isArray(parsed.documents)) {
      warn(`skipped kb/corpus/${file}: not a CorpusFile`);
      return null;
    }
    return parsed;
  } catch (err) {
    warn(`skipped kb/corpus/${file}: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Tyndale study notes                                                 */
/* ------------------------------------------------------------------ */

export const TYNDALE_SOURCE = 'tyndale-open-study-notes';
export const TYNDALE_AUTHOR = 'tyndale-house-publishers';

export async function tyndaleNoteDocuments(dataRoot: string, sources: SourceRegistry): Promise<KbIndexDoc[]> {
  const quotable = isQuotable(sources, TYNDALE_SOURCE);
  const docs: KbIndexDoc[] = [];
  for (const book of BOOKS) {
    let file: CommentaryBookFile;
    try {
      file = JSON.parse(await readFile(join(dataRoot, 'commentary', 'tyndale', `${book.id}.json`), 'utf8')) as CommentaryBookFile;
    } catch {
      continue;
    }
    for (const [c1, v1, c2, v2, text] of file.s) {
      const ref = { book: book.id, startChapter: c1, startVerse: v1, endChapter: c2, endVerse: v2 };
      docs.push({
        key: `tyndale:${refKey(ref)}`,
        corpus: 'tyndale-notes',
        kind: 'study-note',
        title: `Tyndale note on ${formatRef(ref)}`,
        text,
        sourceId: TYNDALE_SOURCE,
        quotable,
        authorId: TYNDALE_AUTHOR,
        locator: `note on ${formatRef(ref, 'short')}`,
        refs: [refKey(ref)],
        heading: '',
        // the book name is searchable but weighs like any word of the note (a keyword boost would flood "John")
        searchText: `${text}\n${book.name}`,
      });
    }
  }
  // Same verse range noted twice (rare): keep keys unique.
  const seen = new Map<string, number>();
  for (const d of docs) {
    const n = seen.get(d.key) ?? 0;
    seen.set(d.key, n + 1);
    if (n) d.key = `${d.key}#${n + 1}`;
  }
  return docs;
}

/* ------------------------------------------------------------------ */
/* Tyndale book introductions                                          */
/* ------------------------------------------------------------------ */

const SECTION_CHARS = 2400;

function isHeading(p: string, next: string | undefined): boolean {
  const s = p.trim();
  return (
    s.length > 0 &&
    s.length <= 70 &&
    /^[A-Z0-9“"‘']/.test(s) &&
    !/[.!?:;,”"’)]$/.test(s) &&
    s.split(/\s+/).length <= 10 &&
    next != null &&
    next.trim().length > s.length
  );
}

/** Split an introduction into sections at its headings; long sections are chunked at paragraph boundaries. */
export function splitIntroduction(text: string): { heading: string; text: string }[] {
  const paras = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const sections: { heading: string; paras: string[] }[] = [{ heading: 'Overview', paras: [] }];
  paras.forEach((p, i) => {
    if (isHeading(p, paras[i + 1])) sections.push({ heading: p, paras: [] });
    else sections[sections.length - 1].paras.push(p);
  });
  const out: { heading: string; text: string }[] = [];
  for (const s of sections) {
    if (!s.paras.length) continue;
    const chunks: string[][] = [[]];
    let size = 0;
    for (const p of s.paras) {
      if (size && size + p.length > SECTION_CHARS) {
        chunks.push([]);
        size = 0;
      }
      chunks[chunks.length - 1].push(p);
      size += p.length + 2;
    }
    chunks.forEach((c, i) => out.push({ heading: chunks.length > 1 ? `${s.heading} (${i + 1}/${chunks.length})` : s.heading, text: c.join('\n\n') }));
  }
  return out;
}

/** "Purpose\n\nTo outline…\n\nAuthor\n\nPaul" → "Purpose: To outline…\nAuthor: Paul" */
function digest(summary: string): string {
  const paras = summary.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const lines: string[] = [];
  for (let i = 0; i < paras.length; i++) {
    if (isHeading(paras[i], paras[i + 1]) && paras[i + 1] && !isHeading(paras[i + 1], paras[i + 2])) {
      lines.push(`${paras[i]}: ${paras[i + 1]}`);
      i++;
    } else lines.push(paras[i]);
  }
  return lines.join('\n');
}

export async function tyndaleIntroDocuments(dataRoot: string, sources: SourceRegistry): Promise<KbIndexDoc[]> {
  const quotable = isQuotable(sources, TYNDALE_SOURCE);
  const docs: KbIndexDoc[] = [];
  for (const book of BOOKS) {
    let file: IntroFile;
    try {
      file = JSON.parse(await readFile(join(dataRoot, 'intros', `${book.id}.json`), 'utf8')) as IntroFile;
    } catch {
      continue;
    }
    const name = file.title || book.name;
    const ref = refKey(wholeBook(book.id));
    const sections = [...(file.summary ? [{ heading: 'At a glance', text: digest(file.summary) }] : []), ...splitIntroduction(file.text)];
    sections.forEach((s, i) => {
      docs.push({
        key: `intro:${book.id}:${i}`,
        corpus: 'tyndale-intros',
        kind: 'book-introduction',
        title: `Tyndale introduction to ${name} — ${s.heading}`,
        text: s.text,
        sourceId: TYNDALE_SOURCE,
        quotable,
        authorId: TYNDALE_AUTHOR,
        locator: `Introduction to ${name}, “${s.heading.replace(/ \(\d+\/\d+\)$/, '')}”`,
        refs: [ref],
        heading: `${book.name} introduction ${s.heading.replace(/ \(\d+\/\d+\)$/, '')}`,
      });
    });
  }
  return docs;
}

/* ------------------------------------------------------------------ */
/* Lexicon senses                                                      */
/* ------------------------------------------------------------------ */

const LEXICON_SOURCE = { G: 'stepbible-tbesg', H: 'stepbible-tbesh' } as const;

export async function lexiconDocuments(dataRoot: string, sources: SourceRegistry): Promise<KbIndexDoc[]> {
  const docs: KbIndexDoc[] = [];
  for (const lang of ['G', 'H'] as const) {
    const dir = join(dataRoot, 'lexicon', lang);
    let names: string[] = [];
    try {
      names = (await readdir(dir)).filter((n) => n.endsWith('.json'));
    } catch {
      continue;
    }
    names.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    const sourceId = LEXICON_SOURCE[lang];
    const quotable = isQuotable(sources, sourceId);
    for (const name of names) {
      const shard = JSON.parse(await readFile(join(dir, name), 'utf8')) as LexiconShardFile;
      for (const [base, entries] of Object.entries(shard)) {
        const n = normalizeStrong(base);
        if (!n) continue;
        for (const e of entries) {
          const pos = describeLexiconMorph(e.m);
          docs.push({
            key: `lex:${e.e}`,
            corpus: 'lexicon',
            kind: 'lexicon',
            title: `${e.l} (${e.t}, ${n.base}) — “${e.g}”`,
            text: e.d,
            sourceId,
            quotable,
            strong: n.base,
            locator: e.e !== n.base ? `${n.base} (sense ${e.e})` : n.base,
            heading: `${e.g.replace(/[:_/]/g, ' ')} ${e.t} ${e.l}`,
            keywords: [n.base, e.e, ...(pos ? [pos] : [])],
            ...(e.n ? { frequency: e.n } : {}),
            extendedStrong: e.e,
          });
        }
      }
    }
  }
  return docs;
}
