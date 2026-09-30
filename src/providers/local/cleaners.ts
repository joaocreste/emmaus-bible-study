/**
 * Text cleaners for the public-domain commentaries distributed by the Free Use
 * Bible API (bible.helloao.org). Shared by the data pipeline (scripts/data, via
 * Node type-stripping — keep this module dependency-free) and by the runtime
 * remote fallback in the CommentaryProvider, so bundled and live text look the same.
 *
 * What the cleaners do (never rewording the authors):
 *  - Calvin: drop the section heading ("Romans 8:1-4"), the English + Latin verse
 *    block that precedes the exposition, translator footnotes and markers like
 *    "[237]"; repair the source's encoding damage ("vit?" → "vitæ", "Rosenm?ller"
 *    → "Rosenmüller"); remove Greek quotations that survive only as mangled
 *    SPIonic font codes (replaced by "[Greek]" so the omission stays visible).
 *  - All: repair UTF-8/Windows-1252 mojibake ("IRENÃ†US" → "IRENÆUS"), decode stray
 *    entities, normalise dashes and whitespace, and turn the API's compact
 *    reference style "Kg2 21:16" into "2Kg 21:16".
 *  - Output text uses "\n\n" between paragraphs.
 */

export type ClassicCommentaryId = 'calvin' | 'matthew-henry' | 'jfb' | 'keil-delitzsch';

/** Free Use Bible API id for each classic commentary bundled/fetched by Emmaus. */
export const COMMENTARY_API_IDS: Record<ClassicCommentaryId, string> = {
  calvin: 'john-calvin',
  'matthew-henry': 'matthew-henry',
  jfb: 'jamieson-fausset-brown',
  'keil-delitzsch': 'keil-delitzsch',
};

/** Minimal shape of a Free Use Bible API commentary chapter file. */
export interface ApiCommentaryChapter {
  chapter: {
    number: number;
    content: { type: string; number?: number; content?: unknown[] }[];
    /** Henry: chapter summary; JFB: pericope heading + notes on verse 1; K&D: pericope introduction */
    introduction?: string;
  };
}

/** [startChapter, startVerse, endChapter, endVerse, text] — same tuple as the bundled files. */
export type CleanSection = [number, number, number, number, string];

/* ------------------------------------------------------------------ */
/* Generic helpers                                                     */
/* ------------------------------------------------------------------ */

/** Windows-1252 code points 0x80–0x9F that differ from Latin-1. */
const CP1252_EXTRA: Record<string, number> = {
  '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87, 'ˆ': 0x88, '‰': 0x89, 'Š': 0x8a,
  '‹': 0x8b, 'Œ': 0x8c, 'Ž': 0x8e, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97,
  '˜': 0x98, '™': 0x99, 'š': 0x9a, '›': 0x9b, 'œ': 0x9c, 'ž': 0x9e, 'Ÿ': 0x9f,
};

function cp1252Byte(ch: string): number | undefined {
  if (ch in CP1252_EXTRA) return CP1252_EXTRA[ch];
  const code = ch.charCodeAt(0);
  return code >= 0xa0 && code <= 0xff ? code : undefined;
}

/**
 * Repair text that was UTF-8 encoded, then decoded as Windows-1252 ("Ã†" → "Æ",
 * "Å“" → "œ", "Â£" → "£"). Also fixes the entity-mangled variant "Ã&brvbr" (= "æ").
 */
export function fixMojibake(text: string): string {
  let t = text.replace(/Ã&brvbra?;?/g, 'æ').replace(/&brvbar?;?/g, '¦');
  t = t.replace(/[ÂÃÄÅ][ -¿ŒœŠšŸŽžƒˆ˜–-›€™]/g, (pair) => {
    const b1 = cp1252Byte(pair[0]);
    const b2 = cp1252Byte(pair[1]);
    if (b1 == null || b2 == null) return pair;
    const cp = ((b1 & 0x1f) << 6) | (b2 & 0x3f);
    return cp >= 0x80 ? String.fromCharCode(cp) : pair;
  });
  return t;
}

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', aelig: 'æ', AElig: 'Æ', oelig: 'œ', OElig: 'Œ',
};

/** Decode HTML entities (named subset + numeric). */
export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[e] ?? ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** "Kg2 21:16" → "2Kg 21:16", "Jo1 1:6-7" → "1Jo 1:6-7" (API reference style → conventional). */
export function fixNumberedBookRefs(text: string): string {
  return text.replace(/\b([A-Z][a-z]{1,2})([1-3])(?= \d+:\d)/g, '$2$1');
}

/** Split into trimmed, non-empty paragraphs on any line break. */
export function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r/g, '')
    .split(/\n+/)
    .map((p) => p.replace(/[ \t ]+/g, ' ').trim())
    .filter(Boolean);
}

/** Normalise dashes: "free--rather" → "free—rather", "this, -- That" → "this, — That". */
export function normalizeDashes(text: string): string {
  return text.replace(/\s+-{2,3}\s+/g, ' — ').replace(/-{2,3}/g, '—');
}

function tidy(paragraph: string): string {
  return paragraph
    .replace(/[ \t ]+/g, ' ')
    .replace(/\s+([,.;:!?])(?=\s|$)/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();
}

/** Clean-up shared by every classic commentary. Returns cleaned paragraphs. */
export function basicClean(text: string): string[] {
  const t = fixNumberedBookRefs(normalizeDashes(decodeEntities(fixMojibake(text))));
  return splitParagraphs(t)
    .filter((p) => !/^(?:Next|Previous): [A-Z0-9]/.test(p)) // web navigation left in the source
    .map(tidy)
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Calvin                                                              */
/* ------------------------------------------------------------------ */

/** "Romans 8:1-4", "Psalm 23:1-4", "1 Peter 1:1-2", "Mark 4:21", "Song of Solomon 2:1" */
const HEADING_RE =
  /^((?:[1-3] )?[A-Z][a-z]+(?: (?:of )?[A-Z][a-z]+)*) (\d+):\s?(\d+)(?:\s*[-–]\s*(?:(\d+):)?(\d+))?((?:\s*[,;:]\s*(?:(?:[1-3] )?[A-Z][a-z]+(?: [A-Z][a-z]+)* )?\d[\d:.,;\s–-]*)*)\.?$/;

export interface CalvinHeading {
  bookName: string;
  chapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
}

export function parseCalvinHeading(paragraph: string): CalvinHeading | null {
  const p = paragraph.trim();
  if (p.length > 60) return null;
  const m = HEADING_RE.exec(p);
  if (!m) return null;
  const chapter = Number(m[2]);
  const startVerse = Number(m[3]);
  const endChapter = m[4] ? Number(m[4]) : chapter;
  const endVerse = m[5] ? Number(m[5]) : startVerse;
  return { bookName: m[1], chapter, startVerse, endChapter, endVerse };
}

const LATIN_WORDS = new Set(
  (
    'et est enim sed qui quae quod quia nam atque ac etiam quoque nec neque sicut tamen ergo igitur autem vero ' +
    'sunt eius ejus eorum illis hoc haec esse fuit erat erit omnes omnia mihi tibi nobis vobis suum suo sua eum eam eos ' +
    'deus dei deo deum dominus domini domino christus christi christo iesu jesu iesus jesus spiritus spiritu legis legi lex ' +
    'fratres filii filius patris patri super cum ut ad ab ex de per pro quam quem cujus cuius non si nisi ne quoniam ' +
    'vos nos ego tu ille illa illud ipse ipsa quidem inquam quis quid ubi inter apud propter secundum adversus ' +
    'gratia gratiam pax vita vitam mortis mortem peccati peccatum carnem carnis caro fide fidem fidei ' +
    'ipsum ipsi ipsis vel aut sive tanquam quasi omnis omni omnibus sint sit esset essent autem salutate'
  ).split(' '),
);
const ENGLISH_WORDS = new Set(
  'the and of that to is he his which for be it with they this we you ye hath shall unto them by are was who but as have had not their from'.split(
    ' ',
  ),
);

/** Share of common English function words among the paragraph's words (0–1). */
function englishRatio(words: string[]): number {
  let english = 0;
  for (const w of words) if (ENGLISH_WORDS.has(w)) english++;
  return words.length ? english / words.length : 0;
}

function wordsOf(paragraph: string): string[] {
  return paragraph
    .toLowerCase()
    .replace(/[^a-z?\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Heuristic: is this paragraph Latin (Calvin's Latin verse text)? Latin paragraphs
 * contain Latin function words or inflections and almost no English function words.
 */
export function isLatinParagraph(paragraph: string): boolean {
  const words = wordsOf(paragraph);
  if (words.length < 3) return false;
  let latin = 0;
  for (const w of words) {
    const x = w.replace(/\?/g, 'ae');
    if (LATIN_WORDS.has(x) || /(?:orum|arum|ibus|ntur|tur|mus|atis|itis|ionem|itatem|ique|ae)$/.test(x)) latin++;
  }
  const en = englishRatio(words);
  const la = latin / words.length;
  return (la >= 0.15 && en < 0.1) || (la >= 0.3 && en < 0.15) || (words.length >= 5 && en < 0.04);
}

/** Leading verse numbers of a translation paragraph: "1. …", "20. … 21. …" */
function translationVerseNumbers(paragraph: string): number[] {
  const nums: number[] = [];
  for (const m of paragraph.matchAll(/(?:^|[\s.;:?!"'’”)\]])(\d{1,3})\.\s+(?=[A-Z(“"‘'[])/g)) nums.push(Number(m[1]));
  return nums;
}

/** Known words whose non-ASCII letters were replaced by "?" in the source. */
const DAMAGED_WORDS: Record<string, string> = {
  'rosenm?ller': 'Rosenmüller',
  'rosem?ller': 'Rosenmüller',
  'm?ller': 'Müller',
  'gr?co': 'Græco',
  'gr?ce': 'Græce',
  'gr?cis': 'Græcis',
  'qu?d': 'quòd',
  'qu?m': 'quàm',
  '?s': 'ès',
  'fa?ons': 'façons',
  'fa?on': 'façon',
  'commen?a': 'commença',
  'commen?ant': 'commençant',
  're?oit': 'reçoit',
  'volont?s': 'volontés',
  'volont?': 'volonté',
  'ais?ment': 'aisément',
  'commun?ment': 'communément',
  'nomm?ment': 'nommément',
  'destin?e': 'destinée',
  'pri?re': 'prière',
  'po?tes': 'poëtes',
  'effect?s': 'effectûs',
  'laschet?': 'lascheté',
  'lul?': 'lulê',
  'ts?dh?': 'tsadhe',
};

/**
 * Repair Calvin's "?" encoding damage (the source replaced non-ASCII letters by "?"):
 *  1. known words (dictionary above);
 *  2. word-initial "?" before a Latin/Greek-derived stem is "Æ"/"æ" (Æthiopic, æterna);
 *  3. mid-word "?" after the Latin stems pr-, qu-, h-, Iud-, Gr-, l-, C- is "æ" (præputium, hæredes, lætabimur);
 *  4. any other mid-word "?" was a transliteration mark for aleph/ayin → "’" (ba’lil);
 *  5. word-final "?" after a Latin stem and before a lower-case word is "æ" ("vit? in" → "vitæ in").
 * Genuine question marks (after a word, before space/punctuation/capital) are left alone.
 */
export function repairCalvinEncoding(text: string): string {
  const t = text.replace(/[A-Za-z]*\?[A-Za-z][A-Za-z?]*|[A-Za-z]+\?(?=[,.;:])/g, (tok) => {
    const known = DAMAGED_WORDS[tok.toLowerCase()];
    if (known) return /^[A-Z]/.test(tok) ? known[0].toUpperCase() + known.slice(1) : known;
    if (!/\?[A-Za-z]/.test(tok)) return tok;
    let out = tok;
    if (/^\?[A-Za-z]/.test(out)) {
      if (/^\?(?:thiop|neid|schyl|gypt|thiopi)/i.test(out)) out = 'Æ' + out.slice(1);
      else out = 'æ' + out.slice(1);
    }
    out = out.replace(/(pr|Pr|qu|Qu|h|H|Iud|iud|Gr|gr|l|C)\?(?=[a-z])/g, '$1æ');
    return out.replace(/([A-Za-z])\?(?=[A-Za-z])/g, '$1’');
  });
  return t.replace(/\b(vit|qu|h|pr|su|tu|me|ill|ist|ips|ecclesi|Ecclesi|glori|grati|terr|anim|mort|fid|justiti|destinat|impens|mutu)\?(?=[ ,.;:])/g, '$1æ');
}

/** A token that is unmistakably SPIonic-encoded Greek ("de<", "pe>leiv", "ka}n", "%Os"). */
function isSpionicToken(word: string): boolean {
  if (/^[(\[]?<[A-Za-z]+>[)\],.;:]*$/.test(word)) return false; // an ordinary bracketed word
  return /[A-Za-z][<>}]|^%[A-Za-z]/.test(word);
}

/**
 * Greek quotations in Calvin's source survive only as SPIonic font codes, e.g.
 * "Ti>v su< pe>leiv kai< Cristo<v". They are unreadable, so each run of such
 * tokens is replaced by "[Greek]" (the omission stays visible; nothing is invented).
 */
export function removeMangledGreek(text: string): string {
  if (!/[<>{}%]/.test(text)) return text;
  const words = text.split(' ');
  const out: string[] = [];
  for (let i = 0; i < words.length; i++) {
    if (!isSpionicToken(words[i])) {
      out.push(words[i]);
      continue;
    }
    // extend the run while marked tokens keep appearing within the next 3 words
    let last = i;
    for (let j = i + 1; j < words.length && j <= last + 3; j++) {
      if (isSpionicToken(words[j])) last = j;
      else if (!/^[A-Za-z]{1,12}[,.;:]?$/.test(words[j])) break;
    }
    const trailing = /([,.;:])$/.exec(words[last])?.[1] ?? '';
    out.push('[Greek]' + trailing);
    i = last;
  }
  return out.join(' ');
}

/**
 * Clean one Calvin section: remove heading(s), the English/Latin verse block,
 * footnotes and markers; repair encoding. Returns cleaned paragraphs and any
 * headings found (the first matching heading gives the section's exact range).
 */
export function cleanCalvinSection(raw: string): { paragraphs: string[]; headings: CalvinHeading[] } {
  const paras = splitParagraphs(fixMojibake(decodeEntities(raw)));
  const headings: CalvinHeading[] = [];
  const out: string[] = [];
  // Header zone = heading(s) + the translation block(s) (+ Latin) before the exposition.
  // A harmony section (Matthew/Mark/Luke) has one heading and one translation block per gospel.
  let headerZone = false;
  let groupHeadings = new Set<string>();
  let blocks = 0;
  let consumed = new Set<number>();
  let lastTranslated = -1;
  let footnotes = false;
  paras.forEach((p, i) => {
    // translator footnotes close the section
    if (footnotes || /^Footnotes:?$/i.test(p)) {
      footnotes = true;
      return;
    }
    if (/^\{Bogus footnote\}/i.test(p)) return;
    const heading = parseCalvinHeading(p);
    if (heading) {
      headings.push(heading);
      if (!headerZone || blocks > 0) {
        groupHeadings = new Set();
        blocks = 0;
        consumed = new Set();
      }
      groupHeadings.add(p.trim());
      headerZone = true;
      return;
    }
    if (headerZone) {
      if (isLatinParagraph(p)) return;
      // "1. Paul…", "59 He spoke…", "l. Now…" (OCR), "129. ph Thy…" (Hebrew letter), "17. — And…"
      let lead = /^\s*(?:\S{1,2}\s+)?(\d{1,3}|l)(\.?)\s+(?:(?:—|–|-{1,3})\s*)?(?:[a-z]{1,2}\s?)?(?=[A-Z(“"‘'])/.exec(p);
      // without the dot ("59 He spoke…") it is a translation only when more verses follow inline
      if (lead && !lead[2] && !translationVerseNumbers(p).some((n) => n > Number(lead![1]))) lead = null;
      const next = paras[i + 1] ?? '';
      if (!lead) {
        // a short title line ("A Psalm of David.", a Hebrew letter name) right before the translation
        if (p.length <= 100 && /^\s*(?:\S{1,2}\s+)?\d{1,3}\.\s/.test(next) && !/^\d/.test(p)) return;
        headerZone = false;
      } else {
        const first = lead[1] === 'l' ? 1 : Number(lead[1]);
        const nums = [first, ...translationVerseNumbers(p).filter((n) => n !== first)];
        // the Latin twin of the English verse just given (little or no English in it)
        if (first === lastTranslated && englishRatio(wordsOf(p)) < 0.1) return;
        if (!consumed.has(first)) {
          if (blocks === 0) blocks = 1;
          for (const n of nums) consumed.add(n);
          lastTranslated = nums[nums.length - 1];
          return;
        }
        if (blocks < Math.max(1, groupHeadings.size)) {
          blocks++;
          consumed = new Set(nums);
          lastTranslated = nums[nums.length - 1];
          return;
        }
        headerZone = false;
      }
    }
    out.push(p);
  });
  // the Latin subscription some epistles end with ("Ad Titum, qui primus…")
  while (out.length && /^Ad [A-Z]/.test(out[out.length - 1]) && isLatinParagraph(out[out.length - 1])) out.pop();
  const paragraphs = out
    .map((p) => p.replace(/\s*\[\d+\]/g, '').replace(/\{Bogus footnote\}/gi, ''))
    .map((p) => removeMangledGreek(repairCalvinEncoding(p)))
    .map((p) => tidy(fixNumberedBookRefs(normalizeDashes(p))))
    .filter(Boolean);
  return { paragraphs, headings };
}

/* ------------------------------------------------------------------ */
/* Chapter → sections                                                  */
/* ------------------------------------------------------------------ */

function sameBook(headingBook: string, bookName: string | undefined): boolean {
  if (!bookName) return true;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '');
  return norm(headingBook) === norm(bookName) || norm(headingBook).startsWith(norm(bookName)) || norm(bookName).startsWith(norm(headingBook));
}

/**
 * Convert a Free Use Bible API commentary chapter into cleaned sections.
 *
 * Each API item is anchored at a start verse; it covers verses up to the next
 * item's start − 1 (or `lastVerse`, the chapter's final verse). For Calvin, the
 * section heading ("Romans 8:1-4") gives the exact range when present.
 *
 * @param id        classic commentary id
 * @param chapter   the API chapter JSON
 * @param lastVerse number of the chapter's last verse (English versification)
 * @param bookName  English book name, used to match Calvin's headings ("Romans", "Psalms")
 */
export function commentaryChapterToSections(
  id: ClassicCommentaryId,
  chapter: ApiCommentaryChapter,
  lastVerse: number,
  bookName?: string,
): CleanSection[] {
  const c = chapter.chapter.number;
  const items = chapter.chapter.content
    .filter((it) => it.type === 'verse' && typeof it.number === 'number' && Array.isArray(it.content))
    .map((it) => ({ start: it.number as number, text: (it.content as unknown[]).filter((x) => typeof x === 'string').join('\n\n') }))
    .sort((a, b) => a.start - b.start);
  const sections: CleanSection[] = [];
  items.forEach((item, i) => {
    const nextStart = items[i + 1]?.start;
    let end = Math.max(item.start, nextStart != null ? nextStart - 1 : Math.max(lastVerse, item.start));
    let endChapter = c;
    let paragraphs: string[];
    if (id === 'calvin') {
      const cleaned = cleanCalvinSection(item.text);
      paragraphs = cleaned.paragraphs;
      const h = cleaned.headings.find((x) => x.chapter === c && x.startVerse === item.start && sameBook(x.bookName, bookName));
      if (h) {
        endChapter = h.endChapter;
        end = h.endChapter === c ? Math.max(item.start, Math.min(h.endVerse, Math.max(lastVerse, item.start))) : h.endVerse;
      }
    } else {
      paragraphs = basicClean(item.text);
    }
    const text = paragraphs.join('\n\n').trim();
    if (text) sections.push([c, item.start, endChapter, end, text]);
  });
  // Chapter-level text outside the verse items: Henry's chapter summary covers the whole
  // chapter; JFB's (heading + verse 1 notes) and K&D's (pericope introduction) run up to
  // the first verse item.
  const intro = typeof chapter.chapter.introduction === 'string' ? basicClean(chapter.chapter.introduction).join('\n\n') : '';
  if (intro && id !== 'calvin') {
    const firstStart = items[0]?.start ?? Math.max(lastVerse, 1) + 1;
    const end = id === 'matthew-henry' ? Math.max(lastVerse, 1) : Math.max(1, firstStart - 1);
    sections.unshift([c, 1, c, end, intro]);
  }
  return sections;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

/**
 * Suspicious leftovers after cleaning (used by the pipeline's quality report and tests).
 * `footnoteMarkers` flags "[237]"-style markers — only meaningful for Calvin, since
 * other commentaries legitimately write alternate verse numbers as "Isa 9:9 [10]".
 */
export function findTextDefects(text: string, opts: { footnoteMarkers?: boolean } = {}): string[] {
  const defects: string[] = [];
  const checks: [RegExp, string][] = [
    [/[A-Za-z]\?[A-Za-z]/, 'question mark inside a word (encoding damage)'],
    [/[ÃÅÂ][\u0080-\u00bf†‡“”‘’•–—˜™]/, 'mojibake'],
    [/\uFFFD/, 'replacement character'],
    [/&[a-z]+;|&#\d+;/i, 'HTML entity'],
    [/<\/?[a-z][^>]*>/i, 'HTML tag'],
    [/[a-z][<>}][a-z ]/i, 'SPIonic Greek'],
  ];
  if (opts.footnoteMarkers) checks.push([/\[\d+\]/, 'footnote marker']);
  for (const [re, label] of checks) if (re.test(text)) defects.push(label);
  return defects;
}
