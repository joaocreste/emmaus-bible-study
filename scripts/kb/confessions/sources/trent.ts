/**
 * Council of Trent (1545–1563): the doctrinal decrees and canons in J. Waterworth's translation
 * (The Canons and Decrees of the Sacred and Oecumenical Council of Trent, London: Dolman, 1848),
 * as scanned by the Hanover Historical Texts Project (history.hanover.edu/texts/trent).
 *
 * One document per chapter of a doctrinal decree, per canon, and per untitled decree (split at
 * paragraph boundaries when long). Sessions 3–7, 13–14 and 21–25 (the sessions that issued
 * doctrine) are included. Skipped: the disciplinary "Decrees on Reformation" (benefices, bishops,
 * regulars and nuns), indictions of the next session, safe-conducts, bulls and the closing acts;
 * the Session 24 "Decree on the Reformation of Marriage" (clandestine marriages, impediments) is
 * kept because it is the Council's marriage law.
 *
 * Waterworth prints Scripture without references (and in Vulgate wording), so the documents carry
 * no refs. Scan slips are corrected mechanically (l/I confusion in capitals, "lf", page-break
 * hyphenation); page numbers "[Page N]" are dropped.
 */
import { roman, titleCase, type KbDocument, type Part } from '../lib/corpus.ts';
import { flowBlocks, parseHtml, textOf, type El } from '../lib/html.ts';
import { fetchText } from '../lib/net.ts';

const TRADITION = 'Catholic';
const AUTHOR = 'council-of-trent';
const BASE = 'https://history.hanover.edu/texts/trent';
const MAX_CHARS = 3200;

interface SessionSpec {
  n: number;
  file: string;
  /** canon series expected in order: [series label, count] (a structural check) */
  canons: [string, number][];
  /** numbered paragraphs instead of canons (Session 5: original sin) */
  numbered?: number;
}

const SESSIONS: SessionSpec[] = [
  { n: 3, file: 'ct03.html', canons: [] },
  { n: 4, file: 'ct04.html', canons: [] },
  { n: 5, file: 'ct05.html', canons: [], numbered: 5 },
  { n: 6, file: 'ct06.html', canons: [['Justification', 33]] },
  { n: 7, file: 'ct07.html', canons: [['the Sacraments in General', 13], ['Baptism', 14], ['Confirmation', 3]] },
  { n: 13, file: 'ct13.html', canons: [['the Most Holy Sacrament of the Eucharist', 11]] },
  { n: 14, file: 'ct14.html', canons: [['the Most Holy Sacrament of Penance', 15], ['the Sacrament of Extreme Unction', 4]] },
  { n: 21, file: 'ct21.html', canons: [['Communion under Both Species, and on the Communion of Infants', 4]] },
  { n: 22, file: 'ct22.html', canons: [['the Sacrifice of the Mass', 9]] },
  { n: 23, file: 'ct23.html', canons: [['the Sacrament of Order', 8]] },
  { n: 24, file: 'ct24.html', canons: [['the Sacrament of Matrimony', 12]] },
  { n: 25, file: 'ct25.html', canons: [] },
];

/** Waterworth's long section titles, shortened for document titles. */
const SECTION_TITLES: [RegExp, string][] = [[/^THE TRUE AND CATHOLIC DOCTRINE, TOUCHING THE SACRAMENT OF ORDER\b/, 'Doctrine on the Sacrament of Order']];

const SESSION_YEAR: Record<number, number> = { 3: 1546, 4: 1546, 5: 1546, 6: 1547, 7: 1547, 13: 1551, 14: 1551, 21: 1562, 22: 1562, 23: 1563, 24: 1563, 25: 1563 };

/**
 * Everyday words for each session's subject, as search keywords (Waterworth's wording differs:
 * the matrimony canons speak of the bond "dissolved" and of "separation", never of "divorce").
 */
const SESSION_TOPICS: Record<number, string[]> = {
  3: ['creed', 'Nicene Creed', 'symbol of faith'],
  4: ['Scripture', 'Bible', 'canon of Scripture', 'tradition', 'Apocrypha', 'deuterocanonical books', 'Vulgate', 'interpretation of Scripture'],
  5: ['original sin', 'the fall', 'Adam', 'concupiscence', 'infant baptism'],
  6: ['justification', 'faith', 'good works', 'grace', 'merit', 'assurance', 'perseverance', 'free will', 'predestination'],
  7: ['sacraments', 'baptism', 'infant baptism', 'rebaptism', 'confirmation'],
  13: ['Eucharist', 'Lord’s Supper', 'Holy Communion', 'real presence', 'transubstantiation'],
  14: ['penance', 'confession', 'absolution', 'repentance', 'contrition', 'satisfaction', 'anointing of the sick', 'last rites'],
  21: ['Holy Communion', 'Eucharist', 'communion in both kinds', 'the cup', 'chalice', 'children'],
  22: ['Mass', 'sacrifice of the Mass', 'Eucharist', 'Lord’s Supper', 'propitiatory sacrifice'],
  23: ['holy orders', 'priesthood', 'ordination', 'bishops', 'clergy', 'hierarchy'],
  24: ['marriage', 'matrimony', 'wedding', 'clandestine marriage'],
  25: ['purgatory', 'prayer for the dead', 'saints', 'invocation of saints', 'images', 'icons', 'relics', 'indulgences', 'fasting'],
};
/** Keywords for the doctrine and canons of Session 24 (not its reform decree). */
const MATRIMONY_CANONS = ['divorce', 'remarriage', 'indissolubility', 'adultery', 'separation', 'polygamy', 'celibacy'];

const ORDINAL = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth', 'Twenty-First', 'Twenty-Second', 'Twenty-Third', 'Twenty-Fourth', 'Twenty-Fifth'];

/** Sections that are not doctrine (see header). */
const SKIP_SECTION =
  /REFORMATION(?! OF MARRIAGE)|^ON REGULARS AND NUNS|INDICTION|^BULL|SAFE-CONDUCT|POSTPONING|PETITION FOR THE CONCESSION|CONTINUING THE SESSION|^CONTINUATION OF THE SESSION|PLACE OF AMBASSADORS|RECEIVING AND OBSERVING|RECITING, IN SESSION|CLOSE OF THE COUNCIL|ACCLAMATIONS|^PRAISE BE TO GOD|^CONFIRMATION OF THE COUNCIL|TRANFER THE COUNCIL|TRANSFER THE COUNCIL/i;

/** Session-page furniture that is not a section. */
const FURNITURE = /^(The Council of Trent\b|SESSION THE\b|Celebrated on\b|Being the \w+ under\b)/i;

/** Scan slips: "SAlNTS", "VlI", "lf any one", "ReguIars". */
function fixOcr(s: string): string {
  return s
    .replace(/\b([A-Z][A-Za-z]*)\b/g, (w) => {
      if (w.length >= 2 && /l/.test(w) && !/[a-km-z]/.test(w)) return w.replace(/l/g, 'I'); // capitals with a stray l
      if (/^[A-Z][a-z]*I[a-z]+$/.test(w)) return w.replace(/(?<=[a-z])I(?=[a-z])/g, 'l'); // lower case with a stray I
      return w;
    })
    .replace(/\blf\b/g, 'If')
    .replace(/\s*--\s*/g, '—')
    .replace(/([,;:])-(?=[A-Za-z(])/g, '$1—')
    .replace(/[ \t]{2,}/g, ' ');
}

/** "per-<b>[Page 197]</b>petual": the page mark split a word; join it before the mark is dropped. */
function joinPageBreaks(html: string): string {
  return html.replace(/([a-z])-\s*<b>\s*\[Page \d+\]\s*<\/b>\s*([a-z])/gi, '$1$2');
}

const isPageMark = (el: El) => (el.tag === 'b' || el.tag === 'strong') && /^\s*\[Page \d+\]\s*$/.test(textOf(el));

interface Unit {
  id: string;
  title: string;
  locator: string;
  paras: string[];
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/\b(most holy|sacrament of|sacraments in)\b/g, '')
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '');

function canonNumber(token: string): number | null {
  const t = token.replace(/l/g, 'I').replace(/1/g, 'I');
  return roman(t);
}

async function buildSession(spec: SessionSpec): Promise<{ docs: KbDocument[]; url: string }> {
  const url = `${BASE}/${spec.file}`;
  const html = joinPageBreaks(await fetchText(url, 'auto'));
  const root = parseHtml(html);
  const blocks = flowBlocks(root, { isHeading: (el) => el.tag === 'center', skip: (el) => isPageMark(el) || el.tag === 'img' || el.tag === 'title' });
  const sessionLabel = `Session ${spec.n}`;
  const sourceId = `council-of-trent-session-${spec.n}`;
  const units: Unit[] = [];
  let section: { title: string; key: string; skip: boolean } | null = null;
  let chapter: Unit | null = null;
  let canonSeries = -1;
  let canonCount = 0;
  let lastCanon = 0;
  let current: Unit | null = null;
  let sessionDate = '';
  const seriesSeen: { label: string; count: number }[] = [];
  const sectionKeys = new Map<string, number>();

  const open = (u: Unit) => {
    units.push(u);
    current = u;
  };
  const sectionKey = (title: string) => {
    const base = title
      .toLowerCase()
      .replace(/^(decree|doctrine)\s+(concerning|on|touching)\s+(the\s+)?/, '')
      .replace(/^the true and catholic doctrine,? touching the\s+/, '')
      .replace(/^on\s+(the\s+)?/, '')
      .replace(/[^a-z]+/g, '-')
      .replace(/^-|-$/g, '')
      .split('-')
      .slice(0, 4)
      .join('-');
    const n = (sectionKeys.get(base) ?? 0) + 1;
    sectionKeys.set(base, n);
    return n > 1 ? `${base}-${n}` : base;
  };

  for (const b of blocks) {
    const text = fixOcr(b.text).trim();
    if (!text) continue;
    // a section title set as a plain paragraph ("DECREE ON REFORMATION" in Session 13)
    const capsHeading = !b.heading && text.length < 160 && !/[a-z]/.test(text) && /^(DECREE|DOCTRINE|ON THE)\b/.test(text);
    if (b.heading || capsHeading) {
      if (FURNITURE.test(text)) {
        if (/^Celebrated on\b/i.test(text)) sessionDate = text;
        continue;
      }
      const ch = /^CHAPTER\s+([IVXLl]+)\b\.?\s*(.*)$/i.exec(text);
      if (ch) {
        if (!section || section.skip) continue;
        const num = roman(ch[1].replace(/l/g, 'I'))!;
        const title = ch[2].trim().replace(/\.$/, '');
        chapter = {
          id: `trent:${spec.n}.${section.key}.ch${num}`,
          title: `Council of Trent, ${sessionLabel}, ${section.title}, Chapter ${num}${title ? ` — ${title}` : ''}`,
          locator: `${sessionLabel}, ${section.title}, ch. ${num}`,
          paras: [],
        };
        open(chapter);
        continue;
      }
      if (/^Proem\.?$/i.test(text)) {
        if (!section || section.skip) continue;
        open({ id: `trent:${spec.n}.${section.key}.proem`, title: `Council of Trent, ${sessionLabel}, ${section.title} — Proem`, locator: `${sessionLabel}, ${section.title}, proem`, paras: [] });
        continue;
      }
      if (/^Doctrine on the Sacrament of Penance\.?$/i.test(text)) continue; // sub-title under the Session 14 decree
      // a new section
      const clean = text
        .replace(/^\[(.+?)\]\s*Note:.*$/s, '$1') // editorial title supplied by the Hanover transcribers (Session 21)
        .replace(/\s+/g, ' ')
        .replace(/[.,]$/, '');
      const skip = SKIP_SECTION.test(clean);
      const title = SECTION_TITLES.find(([re]) => re.test(clean))?.[1] ?? (/[a-z]/.test(clean) ? clean : titleCase(clean));
      section = { title, key: skip ? 'skip' : sectionKey(title.toUpperCase()), skip };
      chapter = null;
      current = null;
      if (!skip) open({ id: `trent:${spec.n}.${section.key}`, title: `Council of Trent, ${sessionLabel} — ${title}`, locator: `${sessionLabel}, ${title}`, paras: [] });
      continue;
    }
    if (!section) {
      if (/^(Being the|Celebrated)\b/i.test(text)) sessionDate = text;
      continue;
    }
    if (section.skip) continue;
    const canon = /^CANON\s+([IVXLl1]+)\s*\.?\s*[-—–]+\s*/.exec(text);
    if (canon) {
      const n = canonNumber(canon[1]);
      if (lastCanon === 0 || n === 1) {
        canonSeries++;
        canonCount = 0;
        const label = spec.canons[canonSeries]?.[0] ?? section.title.replace(/^On /, '');
        seriesSeen.push({ label, count: 0 });
      }
      canonCount++;
      const expected = canonCount;
      if (n !== expected) console.warn(`  Trent ${sessionLabel}: canon printed as "${canon[1]}" read as ${expected}`);
      lastCanon = expected;
      seriesSeen[seriesSeen.length - 1].count = expected;
      const label = seriesSeen[seriesSeen.length - 1].label;
      const seriesKey = spec.canons.length > 1 ? `.${slug(label)}` : '';
      open({
        id: `trent:${spec.n}.canon${seriesKey}.${expected}`,
        title: `Council of Trent, ${sessionLabel}, Canon ${expected} on ${label}`,
        locator: `${sessionLabel}, Canons on ${label}, can. ${expected}`,
        paras: [text.slice(canon[0].length).replace(/^if any one/, 'If any one')],
      });
      continue;
    }
    if (spec.numbered) {
      const m = /^(\d)\.\s+(If any one\b[\s\S]*)$/.exec(text);
      if (m && section.key.startsWith('original')) {
        const k = Number(m[1]);
        open({ id: `trent:${spec.n}.original-sin.${k}`, title: `Council of Trent, ${sessionLabel}, Decree concerning Original Sin, §${k}`, locator: `${sessionLabel}, Decree concerning Original Sin, §${k}`, paras: [m[2]] });
        continue;
      }
      if (/^This same holy Synod doth nevertheless declare/.test(text)) {
        open({ id: `trent:${spec.n}.original-sin.virgin`, title: `Council of Trent, ${sessionLabel}, Decree concerning Original Sin — on the Blessed Virgin Mary`, locator: `${sessionLabel}, Decree concerning Original Sin, closing declaration`, paras: [text] });
        continue;
      }
    }
    (current as Unit | null)?.paras.push(text);
  }

  // structural checks
  const expect = spec.canons.map(([, c]) => c);
  const got = seriesSeen.map((s) => s.count);
  if (JSON.stringify(expect) !== JSON.stringify(got)) throw new Error(`Trent ${sessionLabel}: canon series ${JSON.stringify(got)}, expected ${JSON.stringify(expect)}`);
  if (spec.numbered) {
    const nums = units.filter((u) => /\.original-sin\.\d$/.test(u.id)).length;
    if (nums !== spec.numbered) throw new Error(`Trent ${sessionLabel}: ${nums} numbered paragraphs, expected ${spec.numbered}`);
  }

  const docs: KbDocument[] = [];
  const dateNote = sessionDate.replace(/^Being the .*?,\s*(celebrated)/i, 'Celebrated').replace(/\.$/, '');
  for (const u of units) {
    const paras = u.paras.map((p) => p.trim()).filter(Boolean);
    if (!paras.length) continue;
    const total = paras.join('\n\n');
    if (total.length < 60 && !/Canon/.test(u.title)) continue; // headings without text
    const parts = splitParas(paras);
    parts.forEach((ps, i) => {
      const multi = parts.length > 1;
      docs.push({
        id: multi ? `${u.id}:${i + 1}` : u.id,
        title: multi ? `${u.title} (part ${i + 1})` : u.title,
        text: ps.join('\n\n'),
        sourceId,
        authorId: AUTHOR,
        locator: multi ? `${u.locator} (part ${i + 1} of ${parts.length})` : u.locator,
        url,
        tradition: TRADITION,
        keywords: [
          'Council of Trent',
          'Tridentine',
          'Trent',
          'Catholic',
          'Roman Catholic',
          'canons and decrees',
          `${ORDINAL[spec.n]} Session`,
          String(SESSION_YEAR[spec.n]),
          ...(dateNote ? [dateNote] : []),
          ...(SESSION_TOPICS[spec.n] ?? []),
          ...(spec.n === 24 && !u.id.includes('reformation') ? MATRIMONY_CANONS : []),
        ],
      });
    });
  }
  return { docs, url };
}

/** Break a paragraph longer than the chunk size at sentence ends (Waterworth prints some chapters as one paragraph). */
function sentences(p: string): string[] {
  if (p.length <= MAX_CHARS * 1.25) return [p];
  const parts = p.split(/(?<=[.;:?!])\s+(?=[A-Z])/);
  const n = Math.ceil(p.length / MAX_CHARS);
  const target = p.length / n;
  const out: string[] = [];
  let cur = '';
  for (const s of parts) {
    if (cur && cur.length + s.length > target * 1.1) {
      out.push(cur);
      cur = '';
    }
    cur = cur ? `${cur} ${s}` : s;
  }
  if (cur) out.push(cur);
  return out;
}

function splitParas(input: string[]): string[][] {
  const ps = input.flatMap(sentences);
  const total = ps.reduce((n, p) => n + p.length, 0);
  if (total <= MAX_CHARS * 1.25) return [ps];
  const target = total / Math.ceil(total / MAX_CHARS);
  const out: string[][] = [];
  let cur: string[] = [];
  let size = 0;
  for (const p of ps) {
    if (cur.length && size + p.length > target * 1.15) {
      out.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(p);
    size += p.length;
  }
  if (cur.length) out.push(cur);
  return out;
}

export async function buildTrent(): Promise<Part> {
  const docs: KbDocument[] = [];
  const urls: string[] = [];
  for (const s of SESSIONS) {
    const r = await buildSession(s);
    docs.push(...r.docs);
    urls.push(r.url);
  }
  // spot checks
  const s24 = docs.filter((d) => /^trent:24\.canon\.\d+$/.test(d.id));
  if (s24.length !== 12) throw new Error(`Trent Session 24: ${s24.length} canons on matrimony, expected 12`);
  if (!docs.find((d) => d.id === 'trent:24.canon.7')?.text.includes('adultery')) throw new Error('Trent Session 24, canon 7 (adultery) not found');
  return { name: 'Council of Trent (Waterworth 1848)', documents: docs, urls };
}
