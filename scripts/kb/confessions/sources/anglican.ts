/**
 * The Thirty-Nine Articles of Religion (1571) in the text printed in the Book of Common Prayer
 * (the 1662 text, here in an 1863 Church of England printing), as transcribed on Wikisource.
 * One document per article, plus the Ratification. His Majesty's Declaration (1628) and the
 * table of articles are not included.
 *
 * The transcription was compared word by word with a second transcription of the 1662 text
 * (eskimo.com/~lhowell/bcp1662) and with the 1571 English in Schaff, Creeds of Christendom
 * vol. 3; the slips below (OCR splits and misreadings, a passage of Art. 26 transcribed twice)
 * are corrected where both other witnesses agree. Other differences between the witnesses are
 * spelling or printing variants and are left as printed in 1863.
 */
import { fixDropCap, removeTandemRepeat, roman, type KbDocument, type Part } from '../lib/corpus.ts';
import { byClass, findAll, findFirst, parseHtml, textOf, type El } from '../lib/html.ts';
import { fetchText } from '../lib/net.ts';
import { scanRefs, uniqueKeys } from '../lib/refs.ts';

const URL_39 = 'https://en.wikisource.org/wiki/Book_of_Common_Prayer_(1863)/Articles_of_Religion';
const TRADITION = 'Anglican';

/** [wrong, right] transcription slips (see the header comment). */
const CORRECTIONS: [string, string][] = [
  ['but also for actual sins of men', 'but also for all actual sins of men'],
  ["Man's nature; where with he ascended", "Man's nature; wherewith he ascended"],
  ['acceptable to God, with out the grace', 'acceptable to God, without the grace'],
  ['we may de part from grace given', 'we may depart from grace given'],
  ['of eternal Salvation to be to be enjoyed', 'of eternal Salvation to be enjoyed'],
  ['a Sacrament of our Eedemption', 'a Sacrament of our Redemption'],
  ['the Cup of Blessing is a par taking', 'the Cup of Blessing is a partaking'],
  ['Of the Unworthincss of the Ministers', 'Of the Unworthiness of the Ministers'],
  ['the whole Clergy the Nether-house', 'the whole Clergy of the Nether-house'],
];

const skip = (el: El) => /\b(pagenum|ws-noexport|mw-editsection|reference)\b/.test(el.attrs.class ?? '') || el.tag === 'sup';

function correct(s: string, used: Set<string>): string {
  let out = s.replace(/’/g, "'");
  for (const [wrong, right] of CORRECTIONS) {
    if (out.includes(wrong)) {
      out = out.split(wrong).join(right);
      used.add(wrong);
    }
  }
  return out;
}

export async function buildThirtyNineArticles(): Promise<Part> {
  const page = parseHtml(await fetchText(URL_39));
  const body = findFirst(page, byClass('mw-parser-output'));
  if (!body) throw new Error('39 Articles: page body not found');
  const used = new Set<string>();
  const paras = findAll(body, (el) => el.tag === 'p' || el.tag === 'li')
    .map((p) => ({ tag: p.tag, text: correct(textOf(p, { skip }).trim(), used) }))
    .filter((p) => p.text);
  const start = paras.findIndex((p) => /^Articles of Religion\.?$/.test(p.text));
  if (start < 0) throw new Error('39 Articles: "Articles of Religion" heading not found');
  const docs: KbDocument[] = [];
  const repeats: string[] = [];
  let cur: { n: number | 'ratification'; title: string; body: string[] } | null = null;
  const flush = () => {
    if (!cur) return;
    const text = cur.body
      .map((p) => {
        const r = removeTandemRepeat(p);
        if (r.removed) repeats.push(`Art. ${cur!.n}: ${r.removed.slice(0, 50)}…`);
        return fixDropCap(r.text);
      })
      .join('\n\n');
    const isArt = typeof cur.n === 'number';
    docs.push({
      id: isArt ? `39a:${cur.n}` : '39a:ratification',
      title: isArt ? `Thirty-Nine Articles, Art. ${cur.n} — ${cur.title}` : 'Thirty-Nine Articles — The Ratification',
      text,
      sourceId: 'thirty-nine-articles',
      authorId: 'church-of-england',
      locator: isArt ? `Art. ${cur.n}` : 'Ratification',
      url: URL_39,
      refs: uniqueKeys(scanRefs(text)),
      tradition: TRADITION,
      keywords: ['Thirty-Nine Articles', '39 Articles', 'Articles of Religion', 'Church of England', 'Book of Common Prayer', 'Anglican', 'Episcopal', cur.title],
    });
    cur = null;
  };
  for (const { tag, text: t } of paras.slice(start + 1)) {
    const m = tag === 'p' ? /^([IVXL]+)\.\s+(.+?)\.?$/.exec(t) : null;
    if (m && t.length < 140) {
      flush();
      cur = { n: roman(m[1])!, title: m[2].trim(), body: [] };
      continue;
    }
    if (/^The Ratification\.?$/.test(t)) {
      flush();
      cur = { n: 'ratification', title: 'The Ratification', body: [] };
      continue;
    }
    if (/^A Table of the Articles/.test(t)) break;
    if (/^OF THE NAMES AND NUMBER OF THE CANONICAL BOOKS\.?$/.test(t)) {
      cur?.body.push('Of the Names and Number of the Canonical Books.');
      continue;
    }
    if (/^OF THE NAMES OF THE HOMILIES\.?$/.test(t)) {
      cur?.body.push('Of the Names of the Homilies.');
      continue;
    }
    if (tag === 'li') {
      // the list of homilies under Art. 35: one line per title
      if (cur && cur.n === 35) {
        const last = cur.body.length - 1;
        if (/^Of the Names of the Homilies\.$/.test(cur.body[last]) || cur.body[last].includes('\n') || /^(Of|Against|For|That) /.test(cur.body[last])) {
          if (/^Of the Names of the Homilies\.$/.test(cur.body[last])) cur.body.push(fixDropCap(t));
          else cur.body[last] += `\n${t}`;
        }
      }
      continue;
    }
    cur?.body.push(t.replace(/\n/g, ', ').replace(/,\s*,/g, ','));
  }
  flush();
  const nums = docs.filter((d) => d.id !== '39a:ratification').map((d) => Number(d.id.slice(4)));
  if (nums.length !== 39 || nums.some((n, i) => n !== i + 1)) throw new Error(`39 Articles: expected 1–39, got ${nums.join(',')}`);
  const unused = CORRECTIONS.filter(([w]) => !used.has(w));
  if (unused.length) throw new Error(`39 Articles: corrections not applied (source changed?): ${unused.map(([w]) => w).join(' | ')}`);
  if (repeats.length !== 1) throw new Error(`39 Articles: expected one repeated passage (Art. 26), found ${repeats.length}: ${repeats.join('; ')}`);
  return { name: 'Thirty-Nine Articles (BCP)', documents: docs, urls: [URL_39] };
}
