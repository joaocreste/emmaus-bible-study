/**
 * Step: Tyndale Open Study Notes (CC BY-SA 4.0, © Tyndale House Publishers)
 * → public/data/commentary/tyndale/{BOOK}.json (study notes)
 * → public/data/intros/{BOOK}.json (book introductions + summaries)
 *
 * Source: the publisher's own XML release (tyndaleopenresources.com), which is
 * complete. The Free Use Bible API copy (api/c/tyndale) files Judges' notes under
 * "JUD" (overwriting Jude's notes) and has no Judges introduction, so it cannot
 * provide all 66 books; it is used here only as a cross-check for sample chapters.
 * No wording is changed; markup is flattened to plain text (small-caps divine
 * names upper-cased, as printed: "LORD"), and "•" sub-notes become paragraphs.
 */
import type { CommentaryBookFile, CommentarySectionData, IntroFile } from '../../../src/providers/local/formats.ts';
import { decodeEntities } from '../../../src/providers/local/cleaners.ts';
import { readZip, writeJson, type WriteStats } from '../lib/io.ts';
import { fetchCached, fetchJson, log, sha256, warn } from '../lib/net.ts';
import { BOOK_BY_ID, BOOKS, HELLOAO, TYNDALE_BOOK, TYNDALE_ZIP } from '../lib/sources.ts';
import type { StepContext, StepReport } from './types.ts';

interface XmlItem {
  name: string;
  refs: string;
  title?: string;
  body: string;
}

function parseItems(xml: string): XmlItem[] {
  const out: XmlItem[] = [];
  for (const m of xml.matchAll(/<item\b([^>]*)>([\s\S]*?)<\/item>/g)) {
    const name = /name="([^"]*)"/.exec(m[1])?.[1] ?? '';
    const inner = m[2];
    out.push({
      name,
      refs: /<refs>([^<]*)<\/refs>/.exec(inner)?.[1].trim() ?? '',
      title: /<title>([\s\S]*?)<\/title>/.exec(inner)?.[1].trim(),
      body: /<body>([\s\S]*?)<\/body>/.exec(inner)?.[1] ?? '',
    });
  }
  return out;
}

/** Inline markup → plain text. Divine-name small caps are upper-cased ("Lord" → "LORD"). */
function inlineText(html: string): string {
  const t = html
    .replace(/<span class="(?:sn-excerpt-)?divine-name(?:-ital)?">([\s\S]*?)<\/span>/g, (_m, inner: string) => inner.replace(/<[^>]+>/g, '').toUpperCase())
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '');
  return decodeEntities(t).replace(/\s+/g, ' ').trim();
}

/** <p> blocks of a body, with their class. */
function paragraphs(body: string): { cls: string; html: string }[] {
  return [...body.matchAll(/<p\b(?:[^>]*class="([^"]*)")?[^>]*>([\s\S]*?)<\/p>/g)].map((m) => ({ cls: m[1] ?? '', html: m[2] }));
}

const REF_RE = /^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)(?:-(?:(\d+)\.)?(\d+))?$/;

function parseTyndaleRef(ref: string) {
  const m = REF_RE.exec(ref.trim());
  if (!m) return null;
  const book = TYNDALE_BOOK[m[1]];
  if (!book) return null;
  const sc = Number(m[2]);
  const sv = Number(m[3]);
  const ec = m[4] ? Number(m[4]) : sc;
  const ev = m[5] ? Number(m[5]) : sv;
  return { book, sc, sv, ec, ev };
}

/** Study note body → text: drop the leading reference label, "•" sub-notes become paragraphs. */
function noteText(body: string): string {
  return paragraphs(body)
    .map((p) => inlineText(p.html.replace(/^\s*<span class="sn-ref(?:-sc)?">[\s\S]*?<\/span>/, '')))
    .flatMap((t) => t.split(/\s+•\s+/))
    .map((t) => t.replace(/^•\s*/, '').trim())
    .filter(Boolean)
    .join('\n\n');
}

function introText(body: string, skipTitle: boolean): string {
  return paragraphs(body)
    .filter((p) => !(skipTitle && p.cls === 'intro-title'))
    .map((p) => {
      const t = inlineText(p.html);
      return /intro-list/.test(p.cls) && t ? `• ${t}` : t;
    })
    .filter(Boolean)
    .join('\n\n');
}

/** Compare our notes with the Free Use Bible API copy for a few chapters (sanity check). */
async function crossCheck(notes: Map<string, CommentarySectionData[]>): Promise<{ checked: number; matched: number; details: string[] }> {
  const samples: [string, number][] = [
    ['GEN', 1], ['EXO', 40], ['PSA', 23], ['ISA', 53], ['MAT', 5], ['JHN', 1], ['JHN', 3], ['ROM', 8], ['EPH', 2], ['1PE', 1],
  ];
  const norm = (s: string) => s.toLowerCase().replace(/\s*•\s*/g, ' ').replace(/\s+/g, ' ').trim();
  let checked = 0;
  let matched = 0;
  const details: string[] = [];
  for (const [book, ch] of samples) {
    let api: { chapter: { content: { content: string[] }[] } } | null = null;
    try {
      api = await fetchJson(`${HELLOAO}/c/tyndale/${book}/${ch}.json`);
    } catch (err) {
      details.push(`${book} ${ch}: API unavailable (${(err as Error).message})`);
      continue;
    }
    if (!api) continue;
    const apiTexts = api.chapter.content.flatMap((v) => v.content).map(norm);
    const ours = (notes.get(book) ?? []).filter((s) => s[0] === ch); // the API files a note under its first chapter
    let m = 0;
    for (const s of ours) if (apiTexts.some((a) => a.endsWith(norm(s[4].replace(/\n\n/g, ' '))))) m++;
    checked += ours.length;
    matched += m;
    details.push(`${book} ${ch}: ${m}/${ours.length} notes identical to the API copy`);
  }
  // Document the API's Judges/Jude collision.
  try {
    const jud = await fetchJson<{ chapter: { content: { content: string[] }[] }; book: { numberOfChapters: number } }>(`${HELLOAO}/c/tyndale/JUD/1.json`);
    if (jud && jud.book.numberOfChapters > 1) details.push(`API "JUD" has ${jud.book.numberOfChapters} chapters (Judges notes) — Jude taken from the XML instead`);
  } catch {
    /* informational only */
  }
  return { checked, matched, details };
}

export async function buildTyndale(_ctx: StepContext): Promise<StepReport> {
  const zipBuf = await fetchCached(TYNDALE_ZIP);
  if (!zipBuf) throw new Error(`missing ${TYNDALE_ZIP}`);
  const files = readZip(zipBuf);
  const get = (suffix: string) => {
    const entry = [...files.entries()].find(([name]) => name.endsWith(suffix));
    if (!entry) throw new Error(`Tyndale zip: ${suffix} not found`);
    return entry[1].toString('utf8');
  };

  /* ---- study notes ---- */
  const notes = new Map<string, CommentarySectionData[]>();
  let bad = 0;
  let noteCount = 0;
  for (const item of parseItems(get('StudyNotes.xml'))) {
    const ref = parseTyndaleRef(item.refs);
    if (!ref) {
      bad++;
      if (bad <= 5) warn('tyndale', `unparsed refs "${item.refs}" (${item.name})`);
      continue;
    }
    const text = noteText(item.body);
    if (!text) continue;
    const list = notes.get(ref.book) ?? [];
    notes.set(ref.book, list);
    list.push([ref.sc, ref.sv, ref.ec, ref.ev, text]);
    noteCount++;
  }
  const noteStats: WriteStats = { files: 0, bytes: 0 };
  for (const b of BOOKS) {
    const list = (notes.get(b.id) ?? []).map((s, i) => ({ s, i }));
    if (!list.length) throw new Error(`Tyndale: no study notes for ${b.id}`);
    // canonical order by start; the XML order (wider notes first) is kept for equal starts
    list.sort((a, b2) => a.s[0] - b2.s[0] || a.s[1] - b2.s[1] || a.i - b2.i);
    const file: CommentaryBookFile = { book: b.id, commentaryId: 'tyndale', s: list.map((x) => x.s) };
    await writeJson(`commentary/tyndale/${b.id}.json`, file, noteStats);
  }
  log('tyndale', `${noteCount} study notes for 66 books (${bad} unparsed)`);

  /* ---- introductions ---- */
  const summaries = new Map<string, string>();
  for (const item of parseItems(get('BookIntroSummaries.xml'))) {
    const ref = parseTyndaleRef(item.refs.split('-')[0]);
    if (ref) summaries.set(ref.book, introText(item.body, true));
  }
  const introStats: WriteStats = { files: 0, bytes: 0 };
  const introBooks = new Set<string>();
  for (const item of parseItems(get('BookIntros.xml'))) {
    const ref = parseTyndaleRef(item.refs.split('-')[0]);
    if (!ref) {
      warn('tyndale', `intro with unparsed refs "${item.refs}" (${item.name})`);
      continue;
    }
    if (introBooks.has(ref.book)) warn('tyndale', `duplicate intro for ${ref.book} (${item.name}) — keeping the first`);
    if (introBooks.has(ref.book)) continue;
    introBooks.add(ref.book);
    const file: IntroFile = { book: ref.book, title: item.title ?? BOOK_BY_ID.get(ref.book)!.name, text: introText(item.body, false) };
    const summary = summaries.get(ref.book);
    if (summary) file.summary = summary;
    await writeJson(`intros/${ref.book}.json`, file, introStats);
  }
  const missing = BOOKS.filter((b) => !introBooks.has(b.id)).map((b) => b.id);
  if (missing.length) throw new Error(`Tyndale intros missing for ${missing.join(', ')}`);
  log('tyndale', `66 book introductions (${summaries.size} with summaries)`);

  const check = await crossCheck(notes);
  for (const d of check.details) log('tyndale', `cross-check ${d}`);

  const common = {
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attribution: 'Tyndale Open Study Notes © 2022 Tyndale House Publishers, CC BY-SA 4.0. Adapted (markup flattened to plain text) from the original available free at https://tyndaleopenresources.com.',
    urls: [TYNDALE_ZIP, 'https://tyndaleopenresources.com/'],
    sourceSha256: sha256(zipBuf),
  };
  return {
    step: 'tyndale',
    datasets: [
      {
        ...common,
        id: 'tyndale-open-study-notes',
        name: 'Tyndale Open Study Notes — study notes',
        kind: 'study-notes',
        output: 'commentary/tyndale/',
        files: noteStats.files,
        bytes: noteStats.bytes,
        counts: { books: 66, notes: noteCount, crossCheckedNotes: check.checked, crossCheckIdentical: check.matched },
        notes: [
          'Built from the publisher XML (release 1.25). The Free Use Bible API copy lacks Jude’s notes and the Judges introduction (its “JUD” holds Judges).',
          ...check.details,
        ],
      },
      {
        ...common,
        id: 'tyndale-open-study-notes:intros',
        name: 'Tyndale Open Study Notes — book introductions',
        kind: 'book-introductions',
        output: 'intros/',
        files: introStats.files,
        bytes: introStats.bytes,
        counts: { books: introBooks.size, summaries: summaries.size },
      },
    ],
  };
}
