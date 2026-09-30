/**
 * Reformed confessions from Philip Schaff, The Creeds of Christendom, vol. 3 (1877), via CCEL ThML:
 *  - Heidelberg Catechism (1563): the English column of Schaff's German–English edition, per question
 *  - Belgic Confession (1561, revised 1619): English column, per article
 *  - Canons of Dort (1619): the English text Schaff appends (Reformed Church in America), per article.
 *    Schaff's English gives only the positive articles; the "Rejection of Errors" sections are in
 *    Latin only, so they are not included.
 * Refs are the Scripture references CCEL tagged in these English texts (inline citations).
 */
import { roman, titleCase, type KbDocument, type Part } from '../lib/corpus.ts';
import { byTag, findAll } from '../lib/html.ts';
import { uniqueKeys } from '../lib/refs.ts';
import { SCHAFF, cleanText, div, englishCells, joinCells, loadThml, scripRefs } from '../lib/thml.ts';
import type { PassageRef } from '../../../../src/domain/models.ts';

const TRADITION = 'Reformed';

/** Transcription slips in CCEL's capitalised article headings ("OP" for "OF", "PROM" for "FROM"). */
function fixHeadingTypos(h: string): string {
  return h.replace(/\bOP\b/g, 'OF').replace(/\bPROM\b/g, 'FROM').replace(/\bCHRIST' /g, "CHRIST'S ");
}

const isCaps = (t: string) => /[A-Z]/.test(t) && !/[a-z]/.test(t);

export async function buildHeidelberg(): Promise<Part> {
  const root = await loadThml(SCHAFF.vol3.xml);
  const d = div(root, 'iv.vi');
  const cells = englishCells(d, 1);
  const docs: KbDocument[] = [];
  let part = '';
  let section = '';
  let cur: { n: number; paren: boolean; q: string[]; a: string[]; refs: PassageRef[]; part: string; section: string } | null = null;
  let mode: 'q' | 'a' = 'q';
  const flush = () => {
    if (!cur) return;
    const q = joinCells(cur.q).replace(/\s+/g, ' ');
    const a = joinCells(cur.a);
    if (!q || !a) throw new Error(`Heidelberg Q. ${cur.n}: empty question or answer`);
    const where = [cur.part, cur.section].filter(Boolean);
    docs.push({
      id: `heidelberg:${cur.n}`,
      title: `Heidelberg Catechism Q. ${cur.n} — ${q}`,
      // Q. 80 (added in the second edition of 1563) is printed in parentheses
      text: `${cur.paren ? '(' : ''}Question ${cur.n}. ${q}\n\nAnswer. ${a}`,
      sourceId: 'heidelberg-catechism-schaff',
      authorId: 'ursinus-olevianus',
      locator: `Q. ${cur.n}`,
      url: SCHAFF.vol3.page('iv.vi'),
      refs: uniqueKeys(cur.refs),
      tradition: TRADITION,
      keywords: ['Heidelberg Catechism', 'Heidelberger Katechismus', 'catechism', 'Reformed', 'German Reformed', ...where],
    });
    cur = null;
  };
  for (const c of cells) {
    const t = c.text.trim();
    const qm = /^(\()?Question\s*(\d+)\.?$/.exec(t);
    if (qm) {
      flush();
      cur = { n: Number(qm[2]), paren: !!qm[1], q: [], a: [], refs: [], part, section };
      mode = 'q';
      continue;
    }
    if (/^Answer\.?$/.test(t)) {
      mode = 'a';
      continue;
    }
    if (/^[—–-]+$/.test(t)) continue;
    if (isCaps(t) && t.length < 80) {
      // part and topic headings ("THE SECOND PART." / "OF GOD THE SON.")
      if (cur && mode === 'a' && cur.a.length) flush();
      const h = titleCase(t.replace(/\.$/, ''));
      if (/^The (First|Second|Third) Part$/.test(h)) {
        part = h;
        section = '';
      } else section = h;
      continue;
    }
    if (!cur) continue; // title matter before Question 1
    (mode === 'q' ? cur.q : cur.a).push(t);
    cur.refs.push(...scripRefs(c.el));
  }
  flush();
  const nums = docs.map((x) => Number(x.locator!.slice(3)));
  if (nums.length !== 129 || nums.some((n, i) => n !== i + 1)) throw new Error(`Heidelberg: expected Q. 1–129, got ${nums.length}: ${nums.filter((n, i) => n !== i + 1).slice(0, 5)}`);
  return { name: 'Heidelberg Catechism (Schaff)', documents: docs, urls: [SCHAFF.vol3.xml] };
}

export async function buildBelgic(): Promise<Part> {
  const root = await loadThml(SCHAFF.vol3.xml);
  const d = div(root, 'iv.viii');
  const cells = englishCells(d, 1);
  const docs: KbDocument[] = [];
  let cur: { n: number; title: string; body: string[]; refs: PassageRef[] } | null = null;
  const flush = () => {
    if (!cur) return;
    const text = joinCells(cur.body);
    if (!text) throw new Error(`Belgic Art. ${cur.n}: empty`);
    docs.push({
      id: `belgic:${cur.n}`,
      title: `Belgic Confession, Art. ${cur.n} — ${cur.title}`,
      text,
      sourceId: 'belgic-confession-schaff',
      authorId: 'guido-de-bres',
      locator: `Art. ${cur.n}`,
      url: SCHAFF.vol3.page('iv.viii'),
      refs: uniqueKeys(cur.refs),
      tradition: TRADITION,
      keywords: ['Belgic Confession', 'Confessio Belgica', 'Netherlands Confession', 'Reformed', cur.title],
    });
    cur = null;
  };
  for (const c of cells) {
    const t = c.text.trim();
    const am = /^Art(?:icle)?\.\s*([IVXL]+)\.?$/.exec(t);
    if (am) {
      flush();
      cur = { n: roman(am[1])!, title: '', body: [], refs: [] };
      continue;
    }
    if (!cur) continue;
    if (!cur.title && isCaps(t)) {
      cur.title = titleCase(fixHeadingTypos(t.replace(/\.$/, '')));
      continue;
    }
    cur.body.push(t);
    cur.refs.push(...scripRefs(c.el));
  }
  flush();
  const nums = docs.map((x) => Number(x.locator!.slice(5)));
  if (nums.length !== 37 || nums.some((n, i) => n !== i + 1)) throw new Error(`Belgic: expected Art. 1–37, got ${nums.join(',')}`);
  for (const x of docs) if (/\bArt\.\s*[IVXL]+\.?$/.test(x.text)) throw new Error(`Belgic: article marker left in ${x.id}`);
  return { name: 'Belgic Confession (Schaff)', documents: docs, urls: [SCHAFF.vol3.xml] };
}

const DORT_HEADS: { re: RegExp; key: string; label: string; roman: string; articles: number }[] = [
  { re: /^FIRST HEAD OF DOCTRINE\.?$/, key: '1', label: 'First Head of Doctrine', roman: 'I', articles: 18 },
  { re: /^SECOND HEAD OF DOCTRINE\.?$/, key: '2', label: 'Second Head of Doctrine', roman: 'II', articles: 9 },
  { re: /^THIRD AND FOURTH HEADS OF DOCTRINE\.?$/, key: '3-4', label: 'Third and Fourth Heads of Doctrine', roman: 'III–IV', articles: 17 },
  { re: /^FIFTH HEAD OF DOCTRINE\.?$/, key: '5', label: 'Fifth Head of Doctrine', roman: 'V', articles: 15 },
];

export async function buildDort(): Promise<Part> {
  const root = await loadThml(SCHAFF.vol3.xml);
  const d = div(root, 'iv.xvi');
  const blocks = findAll(d, byTag('p', 'h4'));
  const start = blocks.findIndex((b) => b.tag === 'h4' && /^The Canons of the Synod of Dort,/.test(cleanText(b)));
  if (start < 0) throw new Error('Dort: English section not found');
  const docs: KbDocument[] = [];
  let head: (typeof DORT_HEADS)[number] | null = null;
  let headTitle = '';
  let cur: { n: number | 'conclusion'; paras: string[]; refs: PassageRef[] } | null = null;
  const flush = () => {
    if (!cur || !head) return;
    const text = cur.paras.join('\n\n');
    if (cur.n === 'conclusion') {
      docs.push({
        id: 'dort:conclusion',
        title: 'Canons of Dort — Conclusion',
        text,
        sourceId: 'canons-of-dort',
        authorId: 'synod-of-dort',
        locator: 'Conclusion',
        url: SCHAFF.vol3.page('iv.xvi'),
        refs: uniqueKeys(cur.refs),
        tradition: TRADITION,
        keywords: ['Canons of Dort', 'Canons of Dordt', 'Synod of Dort', 'Five Points of Calvinism', 'Remonstrants', 'Arminians', 'predestination'],
      });
    } else {
      docs.push({
        id: `dort:${head.key}.${cur.n}`,
        title: `Canons of Dort, ${head.label}, Art. ${cur.n} — ${headTitle}`,
        text,
        sourceId: 'canons-of-dort',
        authorId: 'synod-of-dort',
        locator: `Head ${head.roman}, Art. ${cur.n}`,
        url: SCHAFF.vol3.page('iv.xvi'),
        refs: uniqueKeys(cur.refs),
        tradition: TRADITION,
        keywords: ['Canons of Dort', 'Canons of Dordt', 'Synod of Dort', 'Five Points of Calvinism', 'Calvinism', headTitle],
      });
    }
    cur = null;
  };
  let expectTitle = false;
  for (const b of blocks.slice(start + 1)) {
    const t = cleanText(b).replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const h = DORT_HEADS.find((x) => x.re.test(t));
    if (h) {
      flush();
      head = h;
      expectTitle = true;
      continue;
    }
    if (expectTitle) {
      headTitle = t.replace(/\.$/, '');
      expectTitle = false;
      continue;
    }
    if (/^Conclusion\.?$/.test(t)) {
      flush();
      cur = { n: 'conclusion', paras: [], refs: [] };
      continue;
    }
    if (/^That this is our faith and decision/.test(t) || /^Here follow the names/.test(t)) break;
    const am = /^A[er]t\.\s*([IVXL]+)\.\s*/.exec(t);
    if (am && head) {
      flush();
      cur = { n: roman(am[1])!, paras: [t.slice(am[0].length)], refs: scripRefs(b) };
      continue;
    }
    if (!cur) continue; // Schaff's editorial note before the First Head
    cur.paras.push(t);
    cur.refs.push(...scripRefs(b));
  }
  flush();
  for (const h of DORT_HEADS) {
    const nums = docs.filter((x) => x.id.startsWith(`dort:${h.key}.`)).map((x) => Number(x.id.split('.')[1]));
    if (nums.length !== h.articles || nums.some((n, i) => n !== i + 1)) throw new Error(`Dort ${h.label}: expected Art. 1–${h.articles}, got ${nums.join(',')}`);
  }
  if (!docs.some((x) => x.id === 'dort:conclusion')) throw new Error('Dort: conclusion missing');
  return { name: 'Canons of Dort (Schaff)', documents: docs, urls: [SCHAFF.vol3.xml] };
}
