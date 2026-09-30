/**
 * Step: Scripture — every version of src/domain/translations.ts (English: BSB, KJV, WEB;
 * Portuguese: BLIVRE, NBV, BPM; Spanish: RVR1909, BLM, VBL; French: LSG, DARBY, NCL, OST)
 * from the Free Use Bible API complete-translation files → public/data/bible/{id lowercased}/{BOOK}.json
 * (see src/providers/local/formats.ts).
 *
 * Preserved: section headings (attached to the following verse), paragraph starts,
 * poetry line structure with indent levels, psalm superscriptions (chapter level),
 * and translator footnotes. Dropped: audio links, red-letter flags, KJV colophons.
 *
 * Non-English versions are re-numbered into the English (KJV/BSB) versification so that a
 * verse key means the same words in every language (scripts/data/lib/versification.ts);
 * the gaps that remain are stored per chapter (`x`) and every repair is listed in the
 * manifest (`datasets[].versification`). Deuterocanonical books and the Greek additions to
 * Daniel and Esther are left out (the app's canon is the 66 books of src/domain/books.ts).
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { TranslationId } from '../../../src/domain/models.ts';
import type { BibleBookFile, BibleChapterData, BibleVerseData, BibleVerseExtra } from '../../../src/providers/local/formats.ts';
import { DATA_DIR, writeJson, type WriteStats } from '../lib/io.ts';
import { fetchCached, fetchJson, log, sha256, warn } from '../lib/net.ts';
import { BOOK_BY_ID, BOOK_IDS, HELLOAO, TRANSLATIONS, type TranslationSource } from '../lib/sources.ts';
import {
  alignBook,
  buildMappingGroups,
  emptyReport,
  stripAdditions,
  VERSIFICATION_URLS,
  type AlignmentReport,
  type MappingGroup,
  type VersificationFile,
} from '../lib/versification.ts';
import type { StepContext, StepReport } from './types.ts';

type ApiToken = string | { text?: string; poem?: number; noteId?: number; lineBreak?: boolean; descriptive?: boolean; wordsOfJesus?: boolean };
interface ApiItem {
  type: string;
  number?: number;
  content?: ApiToken[];
}
interface ApiChapter {
  chapter: { number: number; content: ApiItem[]; footnotes?: { noteId: number; text: string }[] };
}
interface ApiBook {
  id: string;
  name: string;
  numberOfChapters: number;
  chapters: ApiChapter[];
}
interface ApiTranslation {
  translation: { id: string; name: string; sha256?: string; totalNumberOfVerses?: number; licenseUrl?: string; website?: string };
  books: ApiBook[];
}

const NO_SPACE_BEFORE = /^[,.;:!?’”)\]—…]/;
const NO_SPACE_AFTER = /[“‘(\[—]$/;

/** Join text pieces the way the printed page reads (no space before closing punctuation or after an em dash). */
export function smartJoin(a: string, b: string): string {
  if (!a) return b;
  if (!b) return a;
  return NO_SPACE_BEFORE.test(b) || NO_SPACE_AFTER.test(a) ? a + b : `${a} ${b}`;
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim().normalize('NFC');

function plain(tokens: ApiToken[] | undefined): string {
  let out = '';
  for (const t of tokens ?? []) {
    if (typeof t === 'string') out = smartJoin(out, clean(t));
    else if (t.text) out = smartJoin(out, clean(t.text));
  }
  return out;
}

interface Line {
  text: string;
  indent: number;
}

/**
 * Paragraph markers printed at the start of a verse, removed and kept as a paragraph start:
 * KJV pilcrows (¶) and the asterisks with which Darby's French Bible marks new sections.
 */
const PARAGRAPH_MARKERS: Partial<Record<TranslationId, RegExp>> = { KJV: /^¶\s*/, DARBY: /^\*+\s*/ };

/** Convert one verse's content tokens into plain text, poetry lines and footnote ids. */
function convertVerse(tokens: ApiToken[], marker: RegExp | undefined) {
  const lines: Line[] = [];
  const notes: number[] = [];
  let current: Line | null = null;
  let poem = false;
  let pilcrow = false;
  const push = (text: string, indent: number, forceNew: boolean) => {
    let t = clean(text);
    if (marker && marker.test(t)) {
      pilcrow = true;
      t = t.replace(marker, '');
    }
    if (!t) return;
    if (!current || forceNew || current.indent !== indent) {
      current = { text: t, indent };
      lines.push(current);
    } else current.text = smartJoin(current.text, t);
  };
  for (const tok of tokens) {
    if (typeof tok === 'string') push(tok, 0, false);
    else if (tok.noteId != null) notes.push(tok.noteId);
    else if (tok.lineBreak) current = null;
    else if (tok.text != null) {
      if (tok.poem) {
        poem = true;
        push(tok.text, tok.poem, true);
        current = null; // each poem item is its own line
      } else push(tok.text, 0, false);
    }
  }
  const text = lines.reduce((acc, l) => smartJoin(acc, l.text), '');
  return { text, lines: poem ? lines : null, notes, pilcrow };
}

function convertChapter(api: ApiChapter, translation: TranslationId, stats: { footnotes: number; headings: number; poetry: number }): BibleChapterData {
  const ch = api.chapter;
  const footnotes = new Map((ch.footnotes ?? []).map((f) => [f.noteId, clean(f.text)]));
  const verses: BibleVerseData[] = [];
  let pendingHeadings: string[] = [];
  let paragraph = true; // a chapter starts a paragraph
  let sup = '';
  for (const item of ch.content) {
    if (item.type === 'heading') {
      const h = plain(item.content);
      if (h) pendingHeadings.push(h);
      paragraph = true;
    } else if (item.type === 'line_break') {
      paragraph = true;
    } else if (item.type === 'hebrew_subtitle') {
      const s = plain(item.content);
      if (!s) continue;
      if (verses.length === 0) sup = smartJoin(sup, s);
      else pendingHeadings.push(s);
    } else if (item.type === 'verse' && typeof item.number === 'number') {
      const v = convertVerse(item.content ?? [], PARAGRAPH_MARKERS[translation]);
      const extra: BibleVerseExtra = {};
      if (pendingHeadings.length) {
        extra.h = pendingHeadings.reduce((a, b) => (a ? (b.startsWith('(') ? `${a} ${b}` : `${a} — ${b}`) : b), '');
        stats.headings++;
      }
      if (paragraph || v.pilcrow) extra.p = 1;
      if (v.lines) {
        extra.l = v.lines.map((l) => [l.text, l.indent]);
        stats.poetry++;
      }
      const f = v.notes.map((id) => footnotes.get(id)).filter((x): x is string => !!x);
      if (f.length) {
        extra.f = f;
        stats.footnotes += f.length;
      }
      verses.push(Object.keys(extra).length ? [item.number, v.text, extra] : [item.number, v.text]);
      pendingHeadings = [];
      paragraph = false;
    }
  }
  // Trailing headings (KJV epistle colophons such as "Written to the Romans from Corinthus…") are not Scripture text; dropped.
  const out: BibleChapterData = { c: ch.number, v: verses };
  if (sup) out.sup = sup;
  return out;
}


/* ------------------------------------------------------------------ */
/* English reference (versification target)                            */
/* ------------------------------------------------------------------ */

interface EnglishReference {
  /** KJV verse numbers per chapter, by book */
  verses: Map<string, number[][]>;
  /** KJV verse text lengths per chapter, by book */
  lengths: Map<string, Map<number, number>[]>;
  /** KJV superscription length per chapter (0 = none), by book */
  sups: Map<string, number[]>;
  /** "c:v" verses in the KJV that the BSB leaves out (textual variants), by book */
  omissions: Map<string, Set<string>>;
  eng: VersificationFile;
  org: VersificationFile;
  groups: MappingGroup[];
}

async function readBook(dir: string, book: string): Promise<BibleBookFile> {
  const file = join(DATA_DIR, 'bible', dir, `${book}.json`);
  if (!existsSync(file)) throw new Error(`${file} is missing: build the English versions first (--only=scripture --versions=BSB,KJV)`);
  return JSON.parse(await readFile(file, 'utf8')) as BibleBookFile;
}

async function loadEnglishReference(): Promise<EnglishReference> {
  const eng = await fetchJson<VersificationFile>(VERSIFICATION_URLS.eng);
  const org = await fetchJson<VersificationFile>(VERSIFICATION_URLS.org);
  if (!eng || !org) throw new Error('versification mappings unavailable');
  const ref: EnglishReference = { verses: new Map(), lengths: new Map(), sups: new Map(), omissions: new Map(), eng, org, groups: buildMappingGroups(eng, new Set(BOOK_IDS)) };
  for (const book of BOOK_IDS) {
    const kjv = await readBook('kjv', book);
    const bsb = await readBook('bsb', book);
    ref.verses.set(book, kjv.chapters.map((c) => c.v.map((v) => v[0])));
    ref.lengths.set(book, kjv.chapters.map((c) => new Map(c.v.map((v) => [v[0], v[1].length]))));
    ref.sups.set(book, kjv.chapters.map((c, i) => (c.sup ?? bsb.chapters[i]?.sup ?? '').length));
    const inBsb = new Set(bsb.chapters.flatMap((c) => c.v.map((v) => `${c.c}:${v[0]}`)));
    ref.omissions.set(book, new Set(kjv.chapters.flatMap((c) => c.v.map((v) => `${c.c}:${v[0]}`)).filter((k) => !inBsb.has(k))));
  }
  return ref;
}

/** Does the version number psalm titles as verse 1 (Hebrew numbering)? Majority over the psalms with a standard title mapping. */
function psalmTitlesNumbered(chapters: BibleChapterData[], ref: EnglishReference): boolean {
  let numberedTitles = 0;
  let englishTitles = 0;
  for (const g of ref.groups) {
    if (g.book !== 'PSA' || g.chapters.length !== 1) continue;
    const c = g.chapters[0];
    const count = Math.max(0, ...(chapters[c - 1]?.v.map((v) => v[0]) ?? []));
    if (count === Number(ref.org.maxVerses.PSA?.[c - 1])) numberedTitles++;
    else if (count === Number(ref.eng.maxVerses.PSA?.[c - 1])) englishTitles++;
  }
  return numberedTitles > englishTitles;
}

/* ------------------------------------------------------------------ */
/* Step                                                                */
/* ------------------------------------------------------------------ */

/**
 * Per language, the version whose numbering is closest to the English one: its aligned text is the
 * word-overlap reference for aligning the language's other versions. The Bíblia Portuguesa Mundial
 * and the Biblia Libre para el Mundo are translations of the World English Bible and keep its
 * numbering; the Louis Segond's Hebrew-style numbering is covered by the standard mappings.
 */
const REFERENCE_VERSION: Record<string, TranslationId> = { pt: 'BPM', es: 'BLM', fr: 'LSG' };

/**
 * Arrangements the alignment cannot infer, verified by reading the source against the KJV. Each
 * maps a run of the version's verses to English numbers (the first English verse of the run).
 */
const OVERRIDES: Partial<Record<TranslationId, Record<string, { from: string; to: string; note: string }[]>>> = {
  RVR1909: {
    // RVR 39:30 holds English 39:27–30 and 40:1–5 ("A más de eso respondió Jehová á Job…"); its 40:1
    // ("ENTONCES respondió Jehová á Job desde la oscuridad") is English 40:6
    JOB: [{ from: '40:1-19', to: '40:6', note: 'English 40:1–5 are printed inside 39:30 in this version' }],
  },
};

function rank(t: TranslationSource): number {
  const order = TRANSLATIONS.indexOf(t);
  if (t.language === 'en') return order;
  return (REFERENCE_VERSION[t.language] === t.id ? 100 : 200) + order;
}

export interface ScriptureOptions {
  /** build only these versions (default: all) */
  versions?: TranslationId[];
}

function summarize(report: AlignmentReport) {
  return {
    standardMappings: report.mappedGroups.length,
    omitted: report.omitted,
    repairs: report.repairs,
    dropped: report.dropped,
    combined: report.combined,
    absent: report.absent,
    residual: report.residual,
  };
}

export type VersificationSummary = ReturnType<typeof summarize>;

export async function buildScripture(ctx: StepContext, options: ScriptureOptions = {}): Promise<StepReport> {
  const datasets: StepReport['datasets'] = [];
  const counts: Record<string, number> = {};
  const selected: TranslationSource[] = TRANSLATIONS.filter((t) => !options.versions || options.versions.includes(t.id));
  let english: EnglishReference | null = null;
  /** aligned books of each language's reference version */
  const references = new Map<string, Map<string, BibleChapterData[]>>();
  const referenceOf = (language: string) => TRANSLATIONS.find((x) => x.id === REFERENCE_VERSION[language]);
  async function referenceBook(t: TranslationSource, book: string): Promise<BibleChapterData[] | undefined> {
    const ref = referenceOf(t.language);
    if (!ref || ref.id === t.id) return undefined;
    const built = references.get(ref.id)?.get(book);
    if (built) return built;
    const file = join(DATA_DIR, 'bible', ref.dir, `${book}.json`);
    if (!existsSync(file)) return undefined;
    return (JSON.parse(await readFile(file, 'utf8')) as BibleBookFile).chapters;
  }
  // English first (the versification target), then each language's reference version before the others
  selected.sort((a, b) => rank(a) - rank(b));
  for (const t of selected) {
    const url = `${HELLOAO}/${t.apiId}/complete.json`;
    const buf = await fetchCached(url);
    if (!buf) throw new Error(`missing ${url}`);
    const api = JSON.parse(buf.toString('utf8')) as ApiTranslation;
    const stats: WriteStats = { files: 0, bytes: 0 };
    const s = { footnotes: 0, headings: 0, poetry: 0 };
    const isEnglish = t.language === 'en';
    if (!isEnglish) english ??= await loadEnglishReference();
    const report = emptyReport();
    let verses = 0;
    let chapters = 0;
    let sourceVerses = 0;
    const seen = new Set<string>();
    let titlesNumbered = false;
    const psa = api.books.find((b) => b.id === 'PSA');
    if (!isEnglish && psa) titlesNumbered = psalmTitlesNumbered(psa.chapters.map((c) => convertChapter(c, t.id, { footnotes: 0, headings: 0, poetry: 0 })), english!);
    for (const book of api.books) {
      const info = BOOK_BY_ID.get(book.id);
      if (!info) {
        if (isEnglish) throw new Error(`${t.id}: book id ${book.id} is not in src/domain/books.ts`);
        report.omitted.push(`${book.id} (${book.name}) — not in the 66-book canon`);
        continue;
      }
      seen.add(book.id);
      let chs = book.chapters.map((c) => convertChapter(c, t.id, s));
      sourceVerses += chs.reduce((n, c) => n + c.v.length, 0);
      if (!isEnglish) {
        const ref = english!;
        chs = stripAdditions(book.id, chs, report);
        chs = alignBook(
          {
            version: t.id,
            book: book.id,
            chapters: chs,
            englishVerses: ref.verses.get(book.id)!,
            englishLengths: ref.lengths.get(book.id)!,
            orgMax: ref.org.maxVerses[book.id],
            engMax: ref.eng.maxVerses[book.id],
            groups: ref.groups,
            psalmTitlesNumbered: titlesNumbered,
            omissions: ref.omissions.get(book.id)!,
            englishSups: ref.sups.get(book.id)!,
            reference: await referenceBook(t, book.id),
            overrides: OVERRIDES[t.id]?.[book.id],
          },
          report,
        ).chapters;
        if (referenceOf(t.language)?.id === t.id) {
          if (!references.has(t.id)) references.set(t.id, new Map());
          references.get(t.id)!.set(book.id, chs);
        }
      }
      if (chs.length !== info.chapters) throw new Error(`${t.id} ${book.id}: ${chs.length} chapters, books.ts says ${info.chapters}`);
      chs.forEach((c, i) => {
        if (c.c !== i + 1) throw new Error(`${t.id} ${book.id}: chapter ${c.c} at index ${i}`);
        if (!c.v.length) throw new Error(`${t.id} ${book.id} ${c.c}: no verses`);
        if (c.v[0][0] !== 1 && !(c.x && c.x['1'] != null)) warn('scripture', `${t.id} ${book.id} ${c.c} starts at verse ${c.v[0][0]}`);
        if (!isEnglish) {
          const allowed = new Set(english!.verses.get(book.id)![i]);
          for (const [n] of c.v) if (!allowed.has(n)) throw new Error(`${t.id} ${book.id} ${c.c}:${n} is not an English verse number after alignment`);
        }
      });
      verses += chs.reduce((n, c) => n + c.v.length, 0);
      chapters += chs.length;
      const file: BibleBookFile = { book: book.id, translation: t.id, chapters: chs };
      await writeJson(`bible/${t.dir}/${book.id}.json`, file, stats);
    }
    if (seen.size !== 66) throw new Error(`${t.id}: expected 66 books, got ${seen.size}`);
    const expected = api.translation.totalNumberOfVerses;
    if (isEnglish && expected != null && expected !== verses) throw new Error(`${t.id}: ${verses} verses, API metadata says ${expected}`);
    if (t.id === 'BSB' && verses !== 31086) throw new Error(`BSB: expected 31,086 verses, got ${verses}`);
    log('scripture', `${t.id}: 66 books, ${chapters} chapters, ${verses} verses, ${s.headings} headings, ${s.poetry} poetry verses, ${s.footnotes} footnotes`);
    if (!isEnglish) {
      log(
        'scripture',
        `${t.id} versification: ${report.mappedGroups.length} standard mappings, ${report.repairs.length} repairs, ${report.combined.length} combined, ${report.absent.length} absent, ${report.dropped.length} duplicates dropped, ${report.omitted.length} omissions, ${report.residual.length} residual`,
      );
      for (const r of report.residual) warn('scripture', `${t.id} ${r}`);
    }
    counts[`${t.id}.verses`] = verses;
    datasets.push({
      id: t.sourceId,
      name: api.translation.name,
      kind: 'scripture',
      urls: [url, ...(isEnglish ? [] : [VERSIFICATION_URLS.eng, VERSIFICATION_URLS.org])],
      license: t.license,
      licenseUrl: api.translation.licenseUrl,
      ...(t.attribution ? { attribution: t.attribution } : {}),
      apiSha256: api.translation.sha256,
      sourceSha256: sha256(buf),
      output: `bible/${t.dir}/`,
      files: stats.files,
      bytes: stats.bytes,
      counts: { books: 66, chapters, verses, ...(isEnglish ? {} : { sourceVerses }), headings: s.headings, poetryVerses: s.poetry, footnotes: s.footnotes },
      ...(isEnglish
        ? {}
        : {
            language: t.language,
            notes: [
              'Verse numbers aligned with the English (KJV/BSB) versification; the wording is unchanged. Every re-numbering is listed under `versification`.',
              ...(report.omitted.length ? ['Deuterocanonical books and additions are not included (66-book canon).'] : []),
            ],
            versification: summarize(report),
          }),
    });
  }
  void ctx;
  return { step: 'scripture', datasets, counts };
}
