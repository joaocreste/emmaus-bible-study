/**
 * Scripture references for the inference layer: parse what the model wrote ("Matthew
 * 19:3–12", "MAT.19.3-12"), check that the reference exists (chapter/verse counts from
 * the bundled BSB), and read single verses for anchor checks. Results are cached per
 * request.
 */
import type { PassageRef, TranslationId, VerseRef } from '../../src/domain/models';
import { findBook, tryGetBook } from '../../src/domain/books';
import { findReferences, formatRef, parseRefKey, parseReference, refContains, refsOverlap } from '../../src/domain/reference';
import type { Evidence } from '../../src/inference/protocol';
import type { Locale } from '../../src/i18n/locales';
import type { ScriptureProvider } from '../../src/providers/types';

export type RefResult = { ok: true; ref: PassageRef } | { ok: false; reason: string };

export class RefChecker {
  private readonly counts = new Map<string, Promise<number | null>>();
  private readonly verses = new Map<string, Promise<string | null>>();

  constructor(
    private readonly scripture: ScriptureProvider,
    /** the page language: its book names ("Mateo 6:25", "Jean 1:1") are read as references too */
    private readonly locale?: Locale,
  ) {}

  verseCount(book: string, chapter: number): Promise<number | null> {
    const key = `${book}.${chapter}`;
    let p = this.counts.get(key);
    if (!p) {
      p = this.scripture.getVerseCount(book, chapter).then(
        (n) => (Number.isFinite(n) && n > 0 ? n : null),
        () => null,
      );
      this.counts.set(key, p);
    }
    return p;
  }

  /** Parse one reference written by the model and check that it exists. */
  async parse(input: unknown): Promise<RefResult> {
    if (typeof input !== 'string' || !input.trim()) return { ok: false, reason: 'missing reference' };
    const raw = input.trim();
    let ref = /^[1-3]?[A-Z]{2,3}(\.\d+){0,2}(-\d+(\.\d+)?)?$/.test(raw) ? parseRefKey(raw) : null;
    ref ??= parseReference(raw, { locale: this.locale });
    if (!ref) {
      const found = findReferences(raw, { locale: this.locale });
      if (found.length > 1) return { ok: false, reason: `“${raw}” contains more than one reference — give one reference per field` };
      if (found.length === 1 && found[0].match.length >= raw.replace(/[.;,\s]+$/, '').length - 2) ref = found[0].ref;
    }
    if (!ref) {
      // "Matthew 29:1": the parser rejects chapters a book does not have — say so plainly
      const m = /^(.+?)\s*(\d{1,3})(?:\s*[:.]\s*\d{1,3})?(?:\s*[-–—]\s*[\d:.]+)?$/.exec(raw.replace(/[‐-―−]/g, '-'));
      const book = m ? findBook(m[1].trim(), this.locale) : undefined;
      if (book && Number(m![2]) > book.chapters) return { ok: false, reason: `“${raw}”: ${book.name} has ${book.chapters} chapters` };
      return { ok: false, reason: `could not read “${raw}” as a Bible reference (write e.g. “Matthew 19:3–9”)` };
    }
    const problem = await this.problem(ref);
    return problem ? { ok: false, reason: `“${raw}”: ${problem}` } : { ok: true, ref };
  }

  /** Why this reference does not exist in the bundled BSB, or null when it does. */
  async problem(ref: PassageRef): Promise<string | null> {
    const book = tryGetBook(ref.book);
    if (!book) return `unknown book ${ref.book}`;
    const c1 = ref.startChapter;
    const c2 = ref.endChapter ?? c1;
    if (c1 < 1 || c1 > book.chapters) return `${book.name} has ${book.chapters} chapters`;
    if (c2 < c1 || c2 > book.chapters) return `${book.name} has ${book.chapters} chapters`;
    if (ref.startVerse != null) {
      const n1 = await this.verseCount(ref.book, c1);
      if (n1 == null) return `could not check ${book.name} ${c1} against the Bible text`;
      if (ref.startVerse < 1 || ref.startVerse > n1) return `${book.name} ${c1} has ${n1} verses`;
    }
    if (ref.endVerse != null) {
      const n2 = await this.verseCount(ref.book, c2);
      if (n2 == null) return `could not check ${book.name} ${c2} against the Bible text`;
      if (ref.endVerse < 1 || ref.endVerse > n2) return `${book.name} ${c2} has ${n2} verses`;
      if (c2 === c1 && ref.startVerse != null && ref.endVerse < ref.startVerse) return 'the range ends before it starts';
    }
    return null;
  }

  /** References mentioned inside prose that do not exist ("Matthew 19:40"). */
  async proseProblems(text: string, locale: Locale | undefined = this.locale): Promise<string[]> {
    const out: string[] = [];
    for (const f of findReferences(text, { locale })) {
      const problem = await this.problem(f.ref);
      if (problem) out.push(`“${f.match}” (${problem})`);
    }
    return out;
  }

  private readonly ranges = new Map<string, Promise<{ text: string; verses: number } | null>>();

  /** Text of a passage in a translation, verses joined (null when unavailable). */
  rangeText(ref: PassageRef, translation: TranslationId): Promise<{ text: string; verses: number } | null> {
    const key = `${translation}:${ref.book}.${ref.startChapter}.${ref.startVerse ?? ''}-${ref.endChapter ?? ''}.${ref.endVerse ?? ''}`;
    let p = this.ranges.get(key);
    if (!p) {
      p = this.scripture.getPassage(ref, translation).then(
        (passage) => {
          const verses = passage.chapters.flatMap((c) => c.verses);
          return verses.length ? { text: verses.map((v) => v.text).join(' '), verses: verses.length } : null;
        },
        () => null,
      );
      this.ranges.set(key, p);
    }
    return p;
  }

  /** Text of one verse in a translation (null when unavailable). */
  verseText(v: VerseRef, translation: TranslationId): Promise<string | null> {
    const key = `${translation}:${v.book}.${v.chapter}.${v.verse}`;
    let p = this.verses.get(key);
    if (!p) {
      p = this.scripture
        .getPassage({ book: v.book, startChapter: v.chapter, startVerse: v.verse, endChapter: v.chapter, endVerse: v.verse }, translation)
        .then(
          (passage) => {
            const verse = passage.chapters.flatMap((c) => c.verses).find((x) => x.ref.chapter === v.chapter && x.ref.verse === v.verse);
            return verse ? verse.text : null;
          },
          () => null,
        );
      this.verses.set(key, p);
    }
    return p;
  }
}

/** A single-verse reference as a VerseRef, else null. */
export function singleVerse(ref: PassageRef): VerseRef | null {
  if (ref.startVerse == null) return null;
  if ((ref.endChapter ?? ref.startChapter) !== ref.startChapter) return null;
  if (ref.endVerse != null && ref.endVerse !== ref.startVerse) return null;
  return { book: ref.book, chapter: ref.startChapter, verse: ref.startVerse };
}

/** Verses of a reference (first `max`), for relatedVerses / concept verses. Whole chapters give their first verse only. */
export function refToVerses(ref: PassageRef, max = 8): VerseRef[] {
  if (ref.startVerse == null) return [{ book: ref.book, chapter: ref.startChapter, verse: 1 }];
  const c2 = ref.endChapter ?? ref.startChapter;
  const out: VerseRef[] = [];
  if (c2 !== ref.startChapter) return [{ book: ref.book, chapter: ref.startChapter, verse: ref.startVerse }];
  const end = ref.endVerse ?? ref.startVerse;
  for (let v = ref.startVerse; v <= end && out.length < max; v++) out.push({ book: ref.book, chapter: ref.startChapter, verse: v });
  return out;
}

const textRefCache = new WeakMap<Evidence, PassageRef[]>();

/**
 * References written in a text, including the continuations index-style texts use
 * ("Matthew 5:31, 32; 19:3–9" → Matt 5:31, 5:32, 19:3–9).
 */
export function extractRefs(text: string): PassageRef[] {
  const out: PassageRef[] = [];
  // same normalisation as findReferences, so its match indices line up with `s`
  const s = text.replace(/[‐-―−]/g, '-').replace(/\s+/g, ' ').trim();
  for (const f of findReferences(s)) {
    out.push(f.ref);
    let chapter = f.ref.endChapter ?? f.ref.startChapter;
    let rest = s.slice(f.index + f.match.length);
    for (let guard = 0; guard < 40; guard++) {
      let m = /^\s*,\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?(?![\d:.]|\s*[A-Z])/.exec(rest);
      if (m && f.ref.startVerse != null) {
        const v1 = Number(m[1]);
        const v2 = m[2] ? Number(m[2]) : v1;
        out.push({ book: f.ref.book, startChapter: chapter, startVerse: v1, endChapter: chapter, endVerse: Math.max(v1, v2) });
        rest = rest.slice(m[0].length);
        continue;
      }
      m = /^\s*[;,]\s*(\d{1,3})\s*:\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?/.exec(rest);
      if (m) {
        chapter = Number(m[1]);
        const v1 = Number(m[2]);
        const v2 = m[3] ? Number(m[3]) : v1;
        out.push({ book: f.ref.book, startChapter: chapter, startVerse: v1, endChapter: chapter, endVerse: Math.max(v1, v2) });
        rest = rest.slice(m[0].length);
        continue;
      }
      break;
    }
  }
  return out;
}

/** References an evidence item gives: its `refs` plus those written in its title and text. */
export function evidenceRefs(e: Evidence): PassageRef[] {
  let found = textRefCache.get(e);
  if (!found) {
    found = [...(e.refs ?? []), ...extractRefs(`${e.title}\n${e.text}`)];
    textRefCache.set(e, found);
  }
  return found;
}

/** Does this evidence item mention the reference at all (overlap)? */
export function evidenceMentionsRef(e: Evidence, ref: PassageRef): boolean {
  return evidenceRefs(e).some((r) => r.book === ref.book && refsOverlap(r, ref));
}

/** Verses a slack-covered reference may reach beyond what the evidence gives ("Matt 19:1–9" covers 19:3–12). */
export const REF_SLACK_VERSES = 5;

/**
 * Does the evidence item give this reference — contain it, or cover a verse range
 * within the same chapter up to REF_SLACK_VERSES beyond what it gives? A mere overlap
 * is not enough: an item mentioning Matthew 5:31 does not ground "Matthew 1–28", and
 * one listing Matthew 19:3–12 does not ground the whole of Matthew 19.
 */
export function evidenceGivesRef(e: Evidence, ref: PassageRef): boolean {
  return evidenceRefs(e).some((r) => refCovers(r, ref));
}

/** Is `ref` inside `given`, or a same-chapter verse range reaching at most REF_SLACK_VERSES past it? */
export function refCovers(given: PassageRef, ref: PassageRef): boolean {
  if (given.book !== ref.book) return false;
  if (refContains(given, ref)) return true;
  if (!refsOverlap(given, ref)) return false;
  const chapter = ref.startChapter;
  if ((ref.endChapter ?? chapter) !== chapter || ref.startVerse == null) return false;
  if (given.startVerse == null || (given.endChapter ?? given.startChapter) !== given.startChapter || given.startChapter !== chapter) return false;
  const gEnd = given.endVerse ?? given.startVerse;
  const rEnd = ref.endVerse ?? ref.startVerse;
  return ref.startVerse >= given.startVerse - REF_SLACK_VERSES && rEnd <= gEnd + REF_SLACK_VERSES;
}

/** The references an item's evidence gives in the same book (for repair hints), formatted. */
export function nearestEvidenceRefs(evidence: readonly Evidence[], ref: PassageRef, max = 3): string[] {
  const out: string[] = [];
  for (const e of evidence) {
    for (const r of evidenceRefs(e)) {
      if (r.book !== ref.book || !refsOverlap(r, ref)) continue;
      const f = formatRef(r);
      if (!out.includes(f)) out.push(f);
      if (out.length >= max) return out;
    }
  }
  return out;
}

export { formatRef };
