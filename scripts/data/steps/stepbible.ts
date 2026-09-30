/**
 * Step: STEPBible data (CC BY 4.0, STEPBible.org / Tyndale House Cambridge)
 *   TAGNT (Greek NT, 2 files) + TAHOT (Hebrew/Aramaic OT, 4 files)
 *     → public/data/original/{BOOK}.json
 *   TBESG + TBESH brief lexicons
 *     → public/data/lexicon/{G|H}/{shard}.json
 *   Concordance built from the tagged words
 *     → public/data/concordance/{G|H}/{shard}.json
 *
 * Versification: TAGNT/TAHOT references are NRSV-based with KJV alternates in
 * square brackets (TAGNT) — the KJV/English reference is used so verse keys match
 * the BSB/KJV files. TAHOT's primary reference is already the English one (the
 * Hebrew reference is in parentheses); Psalm titles are English verse 0.
 *
 * Text choice: TAGNT words are kept when their "word type" includes N/n (the
 * Nestle-Aland text translated by the BSB and most modern Bibles). Verses with no
 * such words (e.g. Mat 17:21, found only in the Textus Receptus) keep their K words
 * so KJV readers still see the Greek. TAHOT words are the Leningrad text with
 * Qere readings (as translators follow), including restored (R) and LXX-based (X) words.
 */
import type {
  ConcordanceRecord,
  ConcordanceShardFile,
  LexiconEntryData,
  LexiconShardFile,
  OriginalBookFile,
  OriginalWordData,
} from '../../../src/providers/local/formats.ts';
import { encodeVersePoint } from '../../../src/providers/local/formats.ts';
import { normalizeStrong, strongShard, type NormalizedStrong } from '../../../src/providers/local/strong.ts';
import { writeJson, type WriteStats } from '../lib/io.ts';
import { fetchCached, log, sha256, warn } from '../lib/net.ts';
import { BOOK_BY_ID, listStepDir, STEP_BOOK, stepRawUrl } from '../lib/sources.ts';
import type { DatasetReport, StepContext, StepReport } from './types.ts';

const TEXT_DIR = 'Translators Amalgamated OT+NT';
const LEX_DIR = 'Lexicons';
const STEP_LICENSE = 'CC BY 4.0';
const STEP_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';
const STEP_ATTRIBUTION = 'Data created by STEPBible.org based on work at Tyndale House Cambridge (CC BY 4.0).';

/**
 * Unicode NFC everywhere, so strings typed elsewhere in the app match the data
 * (TBESG spells accented vowels with the Greek-extended "oxia" code points, e.g.
 * U+1F71 ά, which NFC maps to the standard U+03AC).
 */
const nfc = (s: string) => s.normalize('NFC');

/* ------------------------------------------------------------------ */
/* Hebrew surface cleanup                                              */
/* ------------------------------------------------------------------ */

/**
 * Hebrew as displayed: morpheme separators removed; cantillation accents
 * (U+0591–U+05AF), meteg (U+05BD) and paseq (U+05C0, a cantillation divider)
 * stripped; vowel points, maqaf (U+05BE) and sof pasuq (U+05C3) kept.
 */
export function cleanHebrewSurface(s: string): string {
  return s
    .replace(/[/\\]/g, '')
    .replace(/[֑-ֽ֯׀]/g, '')
    .replace(/͏/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ------------------------------------------------------------------ */
/* Tagged text parsing                                                 */
/* ------------------------------------------------------------------ */

interface TaggedWord {
  book: string;
  chapter: number;
  verse: number;
  data: OriginalWordData;
  strong: NormalizedStrong | null;
  /** TAGNT word type contains N/n (NA text) */
  modern: boolean;
}

const BOOK_CODE = String.raw`(?:[1-3][A-Z][a-z]|[A-Z][a-z]{2})`;
const LINE_RE = new RegExp(`^${BOOK_CODE}\\.\\d`);
const REF_RE = /^((?:[1-3][A-Z][a-z]|[A-Z][a-z]{2}))\.(\d+)\.(\d+)((?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})*)#(\d+)=(\S+)$/;

function parseRefField(field: string) {
  const f = field.replace(/[\s​-‏ ]+/g, '');
  const m = REF_RE.exec(f);
  if (!m) return null;
  const book = STEP_BOOK[m[1]];
  if (!book) return null;
  let chapter = Number(m[2]);
  let verse = Number(m[3]);
  // KJV alternate versification in square brackets: "Mat.17.15[17.14]"
  const kjv = /\[(\d+)\.(\d+)\]/.exec(m[4]);
  if (kjv) {
    chapter = Number(kjv[1]);
    verse = Number(kjv[2]);
  }
  return { book, chapter, verse, type: m[6] };
}

function parseTagnt(text: string, out: TaggedWord[], problems: string[]) {
  for (const line of text.split('\n')) {
    if (!LINE_RE.test(line)) continue;
    const f = line.split('\t');
    const ref = parseRefField(f[0]);
    if (!ref) {
      problems.push(`TAGNT ref: ${f[0]}`);
      continue;
    }
    const greek = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(f[1] ?? '');
    // "¶" marks a paragraph in TAGNT; it is not part of the word
    const surface = (greek ? greek[1] : (f[1] ?? '')).replace(/¶/g, '').trim();
    const translit = greek ? greek[2].trim() : '';
    const [strongRaw, ...morphParts] = (f[3] ?? '').split('=');
    const strong = normalizeStrong(strongRaw);
    if (!strong) problems.push(`TAGNT strong: ${f[0]} ${f[3]}`);
    // crasis words carry two tags: "G2532=CONJ + G1437=COND" → morph "CONJ + COND"
    const morph = morphParts.join('=').replace(/\b[GH]\d+[A-Za-z]?=/g, '').trim();
    const gloss = (f[2] ?? '').trim();
    out.push({
      book: ref.book,
      chapter: ref.chapter,
      verse: ref.verse,
      strong,
      modern: /n/i.test(ref.type),
      data: [nfc(surface), nfc(translit), strong?.extended ?? strongRaw.trim(), morph, nfc(gloss)],
    });
  }
}

function parseTahot(text: string, out: TaggedWord[], problems: string[]) {
  for (const line of text.split('\n')) {
    if (!LINE_RE.test(line)) continue;
    const f = line.split('\t');
    const ref = parseRefField(f[0]);
    if (!ref) {
      problems.push(`TAHOT ref: ${f[0]}`);
      continue;
    }
    const surface = cleanHebrewSurface(f[1] ?? '');
    // Qere "not read" placeholders (the Ketiv word is only a variant) have no text
    if (!surface) continue;
    const translit = (f[2] ?? '').replace(/[/\\]/g, '').trim();
    const gloss = (f[3] ?? '').trim();
    const tags = f[4] ?? '';
    const morph = (f[5] ?? '').trim();
    const root = /\{([HG]\d+[A-Za-z]?)\}/.exec(tags)?.[1] ?? (f[8] ?? '').split('_')[0] ?? /([HG]\d+[A-Za-z]?)/.exec(tags)?.[1] ?? '';
    const strong = normalizeStrong(root);
    if (!strong) problems.push(`TAHOT strong: ${f[0]} ${tags}`);
    const data: OriginalWordData = morph.startsWith('A')
      ? [nfc(surface), nfc(translit), strong?.extended ?? root, morph, nfc(gloss), 'A']
      : [nfc(surface), nfc(translit), strong?.extended ?? root, morph, nfc(gloss)];
    out.push({ book: ref.book, chapter: ref.chapter, verse: ref.verse, strong, modern: true, data });
  }
}

/* ------------------------------------------------------------------ */
/* Lexicon parsing                                                     */
/* ------------------------------------------------------------------ */

/** "Rom.5.16, 18; 8.1" → "Rom 5:16, 18; 8:1" */
function formatStepRef(ref: string): string {
  return ref
    .replace(/\b([1-3]?[A-Z][a-z]+)\.(\d+)\.(\d+)/g, '$1 $2:$3')
    .replace(/\b([1-3]?[A-Z][a-z]+)\.(\d+)\b/g, '$1 $2')
    .replace(/(^|;\s*)(\d+)\.(\d+)/g, '$1$2:$3')
    .trim();
}

const HTML_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** Convert the lexicons' HTML-ish markup into plain text lines separated by "\n". */
export function lexiconMarkupToText(html: string): string {
  let t = html
    .replace(/<ref='([^']*)'>(.*?)<\/ref>/gi, (_m, attr: string, inner: string) => {
      const formatted = formatStepRef(attr);
      return /\d/.test(formatted) ? formatted : inner;
    })
    .replace(/<note>(.*?)<\/note>/gi, ' ($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&([a-z]+);/gi, (m, e: string) => HTML_ENTITIES[e.toLowerCase()] ?? m)
    .replace(/&#(\d+);/g, (_m, n: string) => String.fromCodePoint(Number(n)));
  // "__1." / "__(a)" enumerations begin new lines
  t = t.replace(/\s*__\s*/g, '\n');
  t = t
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim())
    .filter(Boolean)
    .join('\n');
  // trailing source markers "(AS)" (Abbott-Smith) / "(ML)" (Middle Liddell)
  return t.replace(/\s*\((?:AS|ML)\)\s*$/, '').trim();
}

interface RawLexEntry {
  n: NormalizedStrong;
  entry: LexiconEntryData;
}

function parseLexicon(text: string, lang: 'G' | 'H', problems: string[]): RawLexEntry[] {
  const out: RawLexEntry[] = [];
  const seen = new Set<string>();
  for (const line of text.split('\n')) {
    if (!new RegExp(`^${lang}\\d{4,5}[A-Za-z]?\\t`).test(line)) continue;
    const f = line.split('\t');
    const dStrong = (f[1] ?? '').trim().split(/\s+/)[0];
    const n = normalizeStrong(dStrong) ?? normalizeStrong(f[0]);
    if (!n) {
      problems.push(`${lang} lexicon strong: ${f[0]} ${f[1]}`);
      continue;
    }
    if (seen.has(n.extended)) continue;
    seen.add(n.extended);
    const entry: LexiconEntryData = {
      e: n.extended,
      l: nfc(lang === 'H' ? cleanHebrewSurface(f[3] ?? '') : (f[3] ?? '').trim()),
      t: nfc((f[4] ?? '').trim()),
      g: nfc((f[6] ?? '').trim()),
      d: nfc(lexiconMarkupToText(f[7] ?? '')),
    };
    const morph = (f[5] ?? '').trim();
    if (morph) entry.m = morph;
    out.push({ n, entry });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Step                                                                */
/* ------------------------------------------------------------------ */

export async function buildStepBible(_ctx: StepContext): Promise<StepReport> {
  const problems: string[] = [];
  const textFiles = (await listStepDir(TEXT_DIR)).filter((f) => /^(TAGNT|TAHOT) /.test(f.name));
  const lexFiles = (await listStepDir(LEX_DIR)).filter((f) => /^(TBESG|TBESH) /.test(f.name));
  if (textFiles.filter((f) => f.name.startsWith('TAGNT')).length !== 2) throw new Error('expected 2 TAGNT files');
  if (textFiles.filter((f) => f.name.startsWith('TAHOT')).length !== 4) throw new Error('expected 4 TAHOT files');
  if (lexFiles.length !== 2) throw new Error('expected TBESG and TBESH');

  const words: TaggedWord[] = [];
  const sourceSha: Record<string, string> = {};
  const gitSha: Record<string, string> = {};
  for (const f of textFiles) {
    const url = stepRawUrl(TEXT_DIR, f.name);
    const buf = await fetchCached(url);
    if (!buf) throw new Error(`missing ${url}`);
    sourceSha[f.name] = sha256(buf);
    if (f.sha) gitSha[f.name] = f.sha;
    const text = buf.toString('utf8').replace(/^﻿/, '');
    const before = words.length;
    if (f.name.startsWith('TAGNT')) parseTagnt(text, words, problems);
    else parseTahot(text, words, problems);
    log('stepbible', `${f.name.slice(0, 13)}: ${words.length - before} words`);
  }

  /* ---- group per book/chapter/verse, choose TAGNT text form ---- */
  type VerseWords = TaggedWord[];
  const byBook = new Map<string, Map<number, Map<number, VerseWords>>>();
  for (const w of words) {
    let chs = byBook.get(w.book);
    if (!chs) byBook.set(w.book, (chs = new Map()));
    let vs = chs.get(w.chapter);
    if (!vs) chs.set(w.chapter, (vs = new Map()));
    let list = vs.get(w.verse);
    if (!list) vs.set(w.verse, (list = []));
    list.push(w);
  }

  const originalStats: WriteStats = { files: 0, bytes: 0 };
  const freq = new Map<string, number>(); // extended strong → word count
  const conc = new Map<string, { n: NormalizedStrong; points: Map<number, number>; ext: Map<string, Set<number>> }>();
  let keptWords = 0;
  let aramaicWords = 0;
  let krOnlyVerses = 0;
  const bookIds = [...byBook.keys()].sort((a, b) => BOOK_BY_ID.get(a)!.order - BOOK_BY_ID.get(b)!.order);
  for (const book of bookIds) {
    const info = BOOK_BY_ID.get(book)!;
    const nt = info.testament === 'NT';
    const file: OriginalBookFile = {
      book,
      language: nt ? 'greek' : 'hebrew',
      sourceId: nt ? 'stepbible-tagnt' : 'stepbible-tahot',
      c: {},
    };
    const chs = byBook.get(book)!;
    for (const chapter of [...chs.keys()].sort((a, b) => a - b)) {
      const out: Record<string, OriginalWordData[]> = {};
      const vs = chs.get(chapter)!;
      for (const verse of [...vs.keys()].sort((a, b) => a - b)) {
        const all = vs.get(verse)!;
        let chosen = all;
        if (nt) {
          const modern = all.filter((w) => w.modern);
          if (modern.length) chosen = modern;
          else krOnlyVerses++;
        }
        out[String(verse)] = chosen.map((w) => w.data);
        keptWords += chosen.length;
        const point = encodeVersePoint(info.order, chapter, verse);
        for (const w of chosen) {
          if (w.data[5] === 'A') aramaicWords++;
          if (!w.strong) continue;
          freq.set(w.strong.extended, (freq.get(w.strong.extended) ?? 0) + 1);
          if (verse === 0) continue; // psalm titles are not counted as verse occurrences
          let rec = conc.get(w.strong.base);
          if (!rec) conc.set(w.strong.base, (rec = { n: w.strong, points: new Map(), ext: new Map() }));
          rec.points.set(point, (rec.points.get(point) ?? 0) + 1);
          const suffix = w.strong.suffix ?? '';
          let set = rec.ext.get(suffix);
          if (!set) rec.ext.set(suffix, (set = new Set()));
          set.add(point);
        }
      }
      file.c[String(chapter)] = out;
    }
    const expectedChapters = info.chapters;
    const got = Object.keys(file.c).length;
    if (got !== expectedChapters) warn('stepbible', `${book}: ${got} chapters in tagged text, books.ts says ${expectedChapters}`);
    await writeJson(`original/${book}.json`, file, originalStats);
  }
  if (bookIds.length !== 66) throw new Error(`original text: expected 66 books, got ${bookIds.length}`);
  log('stepbible', `original: ${bookIds.length} books, ${keptWords} words (${aramaicWords} Aramaic), ${krOnlyVerses} NT verses only in TR/KJV text`);

  /* ---- lexicons ---- */
  const lexStats: WriteStats = { files: 0, bytes: 0 };
  const lexCounts: Record<string, number> = {};
  const lexSha: Record<string, string> = {};
  for (const f of lexFiles) {
    const lang = f.name.startsWith('TBESG') ? 'G' : 'H';
    const url = stepRawUrl(LEX_DIR, f.name);
    const buf = await fetchCached(url);
    if (!buf) throw new Error(`missing ${url}`);
    lexSha[f.name] = sha256(buf);
    if (f.sha) gitSha[f.name] = f.sha;
    const entries = parseLexicon(buf.toString('utf8').replace(/^﻿/, ''), lang, problems);
    const shards = new Map<number, LexiconShardFile>();
    for (const { n, entry } of entries) {
      const count = freq.get(n.extended);
      if (count) entry.n = count;
      const shard = strongShard(n);
      let file = shards.get(shard);
      if (!file) shards.set(shard, (file = {}));
      (file[n.base] ??= []).push(entry);
    }
    for (const file of shards.values())
      for (const list of Object.values(file)) list.sort((a, b) => (b.n ?? 0) - (a.n ?? 0) || a.e.localeCompare(b.e));
    for (const [shard, file] of shards) await writeJson(`lexicon/${lang}/${shard}.json`, file, lexStats);
    lexCounts[lang] = entries.length;
    log('stepbible', `lexicon ${lang}: ${entries.length} entries in ${shards.size} shards`);
  }

  /* ---- concordance ---- */
  const concStats: WriteStats = { files: 0, bytes: 0 };
  const concShards = new Map<string, ConcordanceShardFile>();
  for (const [base, rec] of conc) {
    const points = [...rec.points.keys()].sort((a, b) => a - b);
    const counts = points.map((p) => rec.points.get(p)!);
    const record: ConcordanceRecord = { v: points, w: counts.reduce((a, b) => a + b, 0) };
    if (counts.some((c) => c > 1)) record.k = counts;
    if (rec.ext.size > 1) {
      record.x = {};
      for (const [suffix, set] of rec.ext) record.x[suffix || '-'] = [...set].sort((a, b) => a - b);
    }
    const key = `${rec.n.language}/${strongShard(rec.n)}`;
    let file = concShards.get(key);
    if (!file) concShards.set(key, (file = {}));
    file[base] = record;
  }
  for (const [key, file] of concShards) await writeJson(`concordance/${key}.json`, file, concStats);
  log('stepbible', `concordance: ${conc.size} Strong's numbers in ${concShards.size} shards`);

  if (problems.length) {
    warn('stepbible', `${problems.length} unparsed lines (first 10 below)`);
    for (const p of problems.slice(0, 10)) warn('stepbible', `  ${p}`);
  }

  const textUrls = textFiles.map((f) => stepRawUrl(TEXT_DIR, f.name));
  const pick = (all: Record<string, string>, names: string[]) => {
    const out = Object.fromEntries(names.filter((n) => all[n]).map((n) => [n, all[n]]));
    return Object.keys(out).length ? out : undefined;
  };
  const base: Omit<DatasetReport, 'id' | 'name' | 'urls' | 'output' | 'files' | 'bytes' | 'counts'> = {
    kind: 'original-text',
    license: STEP_LICENSE,
    licenseUrl: STEP_LICENSE_URL,
    attribution: STEP_ATTRIBUTION,
  };
  const datasets: DatasetReport[] = [
    {
      ...base,
      id: 'stepbible-tagnt+tahot',
      name: 'STEPBible Translators Amalgamated Greek NT (TAGNT) + Hebrew OT (TAHOT)',
      urls: textUrls,
      gitSha: pick(gitSha, textFiles.map((f) => f.name)),
      sourceSha256: sourceSha,
      output: 'original/',
      files: originalStats.files,
      bytes: originalStats.bytes,
      counts: { books: bookIds.length, words: keptWords, aramaicWords, parsedWords: words.length, ntVersesOnlyInTR: krOnlyVerses },
      notes: [
        'NT: words from the Nestle-Aland text (word type N/n); verses absent from NA keep the TR (K) words.',
        'Versification mapped to English/KJV references (TAGNT square-bracket alternates); Psalm titles are verse 0.',
        'Hebrew: cantillation (U+0591–U+05AF), meteg and paseq removed; vowel points, maqaf and sof pasuq kept.',
      ],
    },
    {
      ...base,
      kind: 'lexicon',
      id: 'stepbible-tbesg+tbesh',
      name: 'STEPBible Translators Brief lexicons of Extended Strongs (TBESG Greek, TBESH Hebrew)',
      urls: lexFiles.map((f) => stepRawUrl(LEX_DIR, f.name)),
      gitSha: pick(gitSha, lexFiles.map((f) => f.name)),
      sourceSha256: lexSha,
      output: 'lexicon/',
      files: lexStats.files,
      bytes: lexStats.bytes,
      counts: { greekEntries: lexCounts.G ?? 0, hebrewEntries: lexCounts.H ?? 0 },
      notes: [
        'TBESG definitions: Abbott-Smith, Manual Greek Lexicon of the NT (public domain), edited by Tyndale House.',
        'TBESH definitions: based on the Abridged BDB by Online Bible (© Larry Pierce); the TBESH header says they are “for guidance only” and asks projects to seek permission from Online Bible before applying them. Review before any production release.',
      ],
    },
    {
      ...base,
      kind: 'concordance',
      id: 'stepbible-concordance',
      name: 'Concordance derived from TAGNT/TAHOT tagging',
      urls: textUrls,
      output: 'concordance/',
      files: concStats.files,
      bytes: concStats.bytes,
      counts: { strongs: conc.size },
    },
  ];
  return { step: 'stepbible', datasets };
}
