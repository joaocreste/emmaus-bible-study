/**
 * Helpers for CCEL ThML (Theological Markup Language) sources: entity decoding,
 * tag stripping, and OSIS scripture references → canonical PassageRefs.
 */
import type { PassageRef } from '../../../src/domain/models.ts';

const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: '’', nbsp: ' ', mdash: '—', ndash: '–', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', aelig: 'æ', AElig: 'Æ', eacute: 'é', egrave: 'è', ecirc: 'ê',
  auml: 'ä', ouml: 'ö', uuml: 'ü', shy: '',
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED[e] ?? m;
  });
}

/** Inline HTML → plain text (tags removed, entities decoded, whitespace collapsed). */
export function inlineText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ''))
    .replace(/[­]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Block HTML (paragraphs, list items) → paragraphs separated by a blank line. */
export function blockText(html: string): string {
  const withBreaks = html
    .replace(/<li\b[^>]*>/gi, '\n\n• ')
    .replace(/<\/(p|li|ul|ol|div\d?|h\d)>/gi, '\n\n')
    .replace(/<(p|ul|ol|div\d?|h\d)\b[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n\n');
  return withBreaks
    .split(/\n\s*\n/)
    .map(inlineText)
    .filter(Boolean)
    .join('\n\n');
}

/** Attribute value from a start tag. */
export function attr(tag: string, name: string): string | undefined {
  const m = new RegExp(`\\b${name}="([^"]*)"`).exec(tag);
  return m ? decodeEntities(m[1]) : undefined;
}

/** OSIS book abbreviations (as used by CCEL osisRef attributes) → USFM ids. Apocrypha are absent on purpose. */
export const OSIS_BOOK: Record<string, string> = {
  Gen: 'GEN', Exod: 'EXO', Lev: 'LEV', Num: 'NUM', Deut: 'DEU', Josh: 'JOS', Judg: 'JDG', Ruth: 'RUT',
  '1Sam': '1SA', '2Sam': '2SA', '1Kgs': '1KI', '2Kgs': '2KI', '1Chr': '1CH', '2Chr': '2CH', Ezra: 'EZR', Neh: 'NEH',
  Esth: 'EST', Job: 'JOB', Ps: 'PSA', Prov: 'PRO', Eccl: 'ECC', Song: 'SNG', Isa: 'ISA', Jer: 'JER', Lam: 'LAM',
  Ezek: 'EZK', Dan: 'DAN', Hos: 'HOS', Joel: 'JOL', Amos: 'AMO', Obad: 'OBA', Jonah: 'JON', Mic: 'MIC', Nah: 'NAM',
  Hab: 'HAB', Zeph: 'ZEP', Hag: 'HAG', Zech: 'ZEC', Mal: 'MAL', Matt: 'MAT', Mark: 'MRK', Luke: 'LUK', John: 'JHN',
  Acts: 'ACT', Rom: 'ROM', '1Cor': '1CO', '2Cor': '2CO', Gal: 'GAL', Eph: 'EPH', Phil: 'PHP', Col: 'COL',
  '1Thess': '1TH', '2Thess': '2TH', '1Tim': '1TI', '2Tim': '2TI', Titus: 'TIT', Phlm: 'PHM', Heb: 'HEB', Jas: 'JAS',
  '1Pet': '1PE', '2Pet': '2PE', '1John': '1JN', '2John': '2JN', '3John': '3JN', Jude: 'JUD', Rev: 'REV',
};

const OSIS_POINT = /^([1-3]?[A-Za-z]+)\.(\d+)(?:\.(\d+))?$/;

/**
 * "Bible:Matt.19.3-Matt.19.12" → { MAT 19:3–12 }; "Bible:Ps.23" → Psalm 23.
 * Null for apocryphal books and malformed values.
 */
export function osisToRef(osisRef: string): PassageRef | null {
  const body = osisRef.replace(/^Bible:/, '').trim();
  const [a, b] = body.split('-');
  const ma = OSIS_POINT.exec(a ?? '');
  if (!ma) return null;
  const book = OSIS_BOOK[ma[1]];
  if (!book) return null;
  const c1 = Number(ma[2]);
  const v1 = ma[3] != null ? Number(ma[3]) : undefined;
  if (!b) {
    return v1 == null ? { book, startChapter: c1 } : { book, startChapter: c1, startVerse: v1, endChapter: c1, endVerse: v1 };
  }
  const mb = OSIS_POINT.exec(b.includes('.') ? b : `${ma[1]}.${b}`);
  if (!mb || OSIS_BOOK[mb[1]] !== book) return null;
  const c2 = Number(mb[2]);
  const v2 = mb[3] != null ? Number(mb[3]) : undefined;
  if (v1 == null || v2 == null) return c2 === c1 ? { book, startChapter: c1 } : { book, startChapter: c1, endChapter: c2 };
  return { book, startChapter: c1, startVerse: v1, endChapter: c2, endVerse: v2 };
}

/** Abbreviations used by 19th-century reference works that the app's book aliases do not cover. */
const EXTRA_BOOK_ALIASES: Record<string, string> = { cant: 'SNG', philem: 'PHM', ecclus: '', wisd: '', macc: '' };

/**
 * References written in running text with the book carried over, as in Easton’s
 * "(Matt. 5:31, 32; 19:1-9; Mark 10:2-12)". Scans parenthesised lists only, so
 * numbered paragraphs ("(2.)") and prose numbers are ignored.
 * `findBook` resolves a book token ("Matt.", "1 Chr.") to a USFM id.
 */
export function scanParentheticalRefs(text: string, findBook: (token: string) => string | undefined): PassageRef[] {
  const out: PassageRef[] = [];
  for (const group of text.matchAll(/\(([^()]{3,400})\)/g)) {
    let book: string | undefined;
    for (const rawSeg of group[1].split(';')) {
      const seg = rawSeg.trim().replace(/^(comp\.|cf\.|see|also)\s+/i, '');
      const m = /^(?:((?:[1-3]\s?)?[A-Z][a-z]+)\.?\s+)?(\d{1,3}):(\d{1,3})(?:\s*-\s*(\d{1,3}))?((?:\s*,\s*\d{1,3}(?:\s*-\s*\d{1,3})?)*)\s*$/.exec(seg);
      if (!m) {
        // a segment with a book but no verse ("Jer. 35") still sets the book for what follows
        const b = /^((?:[1-3]\s?)?[A-Z][a-z]+)\.?\s+\d/.exec(seg);
        book = b ? resolveBook(b[1], findBook) : undefined;
        continue;
      }
      if (m[1]) book = resolveBook(m[1], findBook);
      if (!book) continue;
      const chapter = Number(m[2]);
      const v1 = Number(m[3]);
      out.push({ book, startChapter: chapter, startVerse: v1, endChapter: chapter, endVerse: m[4] ? Number(m[4]) : v1 });
      for (const extra of (m[5] ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
        const [a, b] = extra.split('-').map((s) => Number(s.trim()));
        out.push({ book, startChapter: chapter, startVerse: a, endChapter: chapter, endVerse: b || a });
      }
    }
  }
  return out;
}

function resolveBook(token: string, findBook: (token: string) => string | undefined): string | undefined {
  const key = token.toLowerCase().replace(/[\s.]/g, '');
  if (key in EXTRA_BOOK_ALIASES) return EXTRA_BOOK_ALIASES[key] || undefined;
  return findBook(token);
}
