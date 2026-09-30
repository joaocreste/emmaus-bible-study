/**
 * The Westminster Standards as published online by the Orthodox Presbyterian Church:
 *  - Westminster Confession of Faith (1646; American revisions), one document per section
 *  - Westminster Shorter Catechism (1647), one document per question
 *  - Westminster Larger Catechism (1648), one document per question
 * The OPC's web text prints no proof texts, so these documents carry no `refs`.
 */
import type { KbDocument, Part } from '../lib/corpus.ts';
import { byTag, findAll, flowBlocks, isEl, parseHtml, type El } from '../lib/html.ts';
import { fetchText } from '../lib/net.ts';

const TRADITION = 'Reformed';
const AUTHOR = 'westminster-assembly';
const WCF_URL = 'https://www.opc.org/wcf.html';
const WSC_URL = 'https://www.opc.org/sc.html';
const WLC_URL = 'https://www.opc.org/lc.html';

/**
 * Sections per chapter (index = chapter): the 1647 structure, except ch. 31 with four sections
 * (the American revision of 1788 removed the magistrate's power to call synods). Checked so a
 * markup change cannot drop a section silently.
 */
const WCF_SECTIONS = [0, 10, 3, 8, 2, 7, 6, 6, 8, 5, 4, 6, 1, 3, 3, 6, 7, 3, 4, 7, 4, 8, 7, 4, 6, 6, 3, 5, 7, 8, 4, 4, 3, 3];

/**
 * Replace each book-list table (WCF 1.2) with one paragraph in reading order (column by column).
 * Indented cells continue the entry above them ("The Gospels" / "according to" / "Matthew" …).
 */
function flattenBookTables(root: El): void {
  for (const table of findAll(root, byTag('table'))) {
    const grid = findAll(table, byTag('tr')).map((tr) => tr.children.filter((c): c is El => isEl(c) && c.tag === 'td'));
    const cols = Math.max(...grid.map((r) => r.length));
    const groups: string[][] = [];
    for (let c = 0; c < cols; c++)
      for (const r of grid) {
        const td = r[c];
        if (!td) continue;
        const raw = rawText(td);
        const text = raw.replace(/\s+/g, ' ').trim();
        if (!text) continue;
        if (/^\u00a0/.test(raw) && groups.length) groups[groups.length - 1].push(text);
        else groups.push([text]);
      }
    const entry = (g: string[]) => g.reduce((acc, item) => (/(?:\bto|\bof|\bthe|\band|,|Epistles?)$/.test(acc) || acc === g[0] ? `${acc} ${item}` : `${acc}, ${item}`));
    const multi = groups.some((g) => g.length > 1);
    const p: El = { tag: 'p', attrs: {}, children: [groups.map(entry).join(multi ? '; ' : ', ')], parent: table.parent };
    const siblings = table.parent!.children;
    siblings.splice(siblings.indexOf(table), 1, p);
  }
}

/** Raw text of an element (entities decoded, whitespace untouched). */
function rawText(el: El): string {
  const parts: string[] = [];
  const rec = (n: El) => {
    for (const c of n.children) {
      if (isEl(c)) rec(c);
      else parts.push(c);
    }
  };
  rec(el);
  return parts.join('');
}

async function buildConfession(): Promise<KbDocument[]> {
  const page = parseHtml(await fetchText(WCF_URL));
  const headings = findAll(page, (el) => el.tag === 'h3' && findAll(el, (a) => a.tag === 'a' && /^Chapter_\d+$/.test(a.attrs.name ?? '')).length > 0);
  if (headings.length !== 33) throw new Error(`WCF: expected 33 chapter headings, found ${headings.length}`);
  const container = headings[0].parent!;
  for (const h of headings) if (h.parent !== container) throw new Error('WCF: chapter headings are not siblings');
  flattenBookTables(container);
  const blocks = flowBlocks(container, { isHeading: (el) => el.tag === 'h3' || el.tag === 'ol' });
  const docs: KbDocument[] = [];
  let chapter = 0;
  let chapterTitle = '';
  let current: { n: number; paras: string[] } | null = null;
  const flush = () => {
    if (!current) return;
    const text = current.paras.join('\n\n').replace(/^\d+\.\s+/, '');
    docs.push({
      id: `wcf:${chapter}.${current.n}`,
      title: `Westminster Confession of Faith ${chapter}.${current.n} — ${chapterTitle}`,
      text,
      sourceId: 'westminster-confession',
      authorId: AUTHOR,
      locator: `ch. ${chapter} §${current.n}`,
      url: `${WCF_URL}#Chapter_${String(chapter).padStart(2, '0')}`,
      tradition: TRADITION,
      keywords: ['Westminster Confession of Faith', 'Westminster Confession', 'WCF', 'Presbyterian', chapterTitle],
    });
    current = null;
  };
  for (const b of blocks) {
    if (b.heading) {
      const m = /^CHAPTER (\d+)\s+(.+)$/.exec(b.text);
      if (!m) {
        if (chapter === 0) continue; // the table of contents list
        throw new Error(`WCF: unexpected heading ${b.text}`);
      }
      flush();
      chapter = Number(m[1]);
      chapterTitle = m[2].trim().replace(/\.$/, '');
      continue;
    }
    if (chapter === 0) continue;
    const m = /^(\d+)\.\s/.exec(b.text);
    if (m) {
      flush();
      current = { n: Number(m[1]), paras: [b.text] };
    } else if (current) {
      current.paras.push(b.text);
    } else throw new Error(`WCF ch. ${chapter}: text before the first section: ${b.text.slice(0, 60)}`);
  }
  flush();
  // numbering check against the known shape of the confession
  for (let c = 1; c <= 33; c++) {
    const secs = docs.filter((d) => d.id.startsWith(`wcf:${c}.`)).map((d) => Number(d.id.split('.')[1]));
    const expected = WCF_SECTIONS[c];
    if (secs.length !== expected || secs.some((n, i) => n !== i + 1)) throw new Error(`WCF ch. ${c}: sections ${secs.join(',')} (expected 1–${expected})`);
  }
  return docs;
}

async function buildCatechism(spec: { url: string; prefix: string; name: string; short: string; sourceId: string; count: number; kw: string[] }): Promise<KbDocument[]> {
  const page = parseHtml(await fetchText(spec.url));
  const firstQ = findAll(page, (el) => el.tag === 'p' && /^\s*Q\.\s*1\.\s/.test(rawText(el)))[0];
  if (!firstQ) throw new Error(`${spec.short}: Q. 1 not found`);
  const blocks = flowBlocks(firstQ.parent!, { isHeading: () => false });
  const docs: KbDocument[] = [];
  let cur: { n: number; q: string; a: string[] } | null = null;
  const flush = () => {
    if (!cur) return;
    const answer = cur.a.join('\n\n').replace(/^A\.\s*/, '');
    if (!answer) throw new Error(`${spec.short} Q. ${cur.n}: empty answer`);
    docs.push({
      id: `${spec.prefix}:${cur.n}`,
      title: `${spec.name} Q. ${cur.n} — ${cur.q}`,
      text: `Q. ${cur.n}. ${cur.q}\n\nA. ${answer}`,
      sourceId: spec.sourceId,
      authorId: AUTHOR,
      locator: `Q. ${cur.n}`,
      url: spec.url,
      tradition: TRADITION,
      keywords: [spec.name, spec.short, 'Westminster Standards', 'Presbyterian', 'catechism', ...spec.kw],
    });
    cur = null;
  };
  let started = false;
  for (const b of blocks) {
    const m = /^Q\.\s*(\d+)\.\s+([\s\S]+?)\n(A\.[\s\S]*)$/.exec(b.text);
    if (m) {
      started = true;
      flush();
      cur = { n: Number(m[1]), q: m[2].replace(/\s+/g, ' ').trim(), a: [m[3].trim()] };
      continue;
    }
    if (!started) continue;
    if (/^Q\.\s*\d+\./.test(b.text)) throw new Error(`${spec.short}: malformed question block: ${b.text.slice(0, 80)}`);
    if (cur) cur.a.push(b.text);
  }
  flush();
  const nums = docs.map((d) => Number(d.locator!.slice(3)));
  if (nums.length !== spec.count || nums.some((n, i) => n !== i + 1)) throw new Error(`${spec.short}: expected questions 1–${spec.count}, got ${nums.length} (${nums.slice(0, 5).join(',')}…)`);
  return docs;
}

export async function buildWestminster(): Promise<Part> {
  const wcf = await buildConfession();
  const wsc = await buildCatechism({ url: WSC_URL, prefix: 'wsc', name: 'Westminster Shorter Catechism', short: 'WSC', sourceId: 'westminster-shorter-catechism-opc', count: 107, kw: ['Shorter Catechism'] });
  const wlc = await buildCatechism({ url: WLC_URL, prefix: 'wlc', name: 'Westminster Larger Catechism', short: 'WLC', sourceId: 'westminster-larger-catechism-opc', count: 196, kw: ['Larger Catechism'] });
  return { name: 'Westminster Standards (OPC)', documents: [...wcf, ...wsc, ...wlc], urls: [WCF_URL, WSC_URL, WLC_URL] };
}
