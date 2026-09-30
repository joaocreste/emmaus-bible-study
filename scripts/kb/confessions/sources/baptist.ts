/**
 * The Second London Baptist Confession of Faith (1677; adopted by the General Assembly of
 * Particular Baptists in London, 1689), in the text of the 1677/1688 printings with its Scripture
 * proofs, as published in ThML by the Christian Classics Ethereal Library (anonymous/bcf).
 *
 * One document per numbered paragraph of the 32 chapters; the preface "To the Judicious and
 * Impartial Reader" and the Appendix on baptism are split at paragraph boundaries. The CCEL
 * volume's modern study material ("Doctrine and Theology of the Confession") is not included.
 * Refs: the proof texts in the notes, kept when the printed label agrees with CCEL's tag.
 * Spelling is the original's ("more then one Wife", "Catholick").
 */
import { roman, splitSentences, titleCase, type KbDocument, type Part } from '../lib/corpus.ts';
import { isEl, type El } from '../lib/html.ts';
import { uniqueKeys } from '../lib/refs.ts';
import { cleanText, div, loadThml, scripRefs } from '../lib/thml.ts';
import type { PassageRef } from '../../../../src/domain/models.ts';

const XML = 'https://ccel.org/ccel/a/anonymous/bcf.xml';
const pageUrl = (id: string) => `https://ccel.org/ccel/anonymous/bcf/bcf.${id}.html`;
const TRADITION = 'Baptist';
const SOURCE = 'second-london-baptist-confession';
const AUTHOR = 'particular-baptist-assembly-1689';
const KEYWORDS = ['Second London Baptist Confession', '1689 Baptist Confession', 'London Baptist Confession', '1689 Confession', 'Particular Baptists', 'Reformed Baptist', 'Baptist'];
/** paragraph counts checked for a few well-known chapters (Scripture, Marriage, the Church, Baptism) */
const KNOWN: Record<number, number> = { 1: 10, 25: 4, 26: 15, 29: 4 };
const MAX_CHARS = 2600;

function paragraphs(d: El): El[] {
  return d.children.filter((c): c is El => isEl(c) && c.tag === 'p');
}

function chunked(paras: string[]): string[][] {
  const pieces = paras.flatMap((p) => splitSentences(p, MAX_CHARS));
  const out: string[][] = [];
  let cur: string[] = [];
  let size = 0;
  for (const p of pieces) {
    if (cur.length && size + p.length > MAX_CHARS) {
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

export async function buildBaptist(): Promise<Part> {
  const root = await loadThml(XML);
  const docs: KbDocument[] = [];

  // preface
  {
    const d = div(root, 'ii.i');
    const texts = paragraphs(d)
      .map((p) => cleanText(p).replace(/\s+/g, ' ').trim())
      .filter((t) => t && !/^(Judicious and Impartial|Courteous Reader,?)$/.test(t));
    const parts = chunked(texts);
    parts.forEach((ps, i) => {
      docs.push({
        id: `lbc1689:preface${parts.length > 1 ? `:${i + 1}` : ''}`,
        title: `Second London Baptist Confession — To the Judicious and Impartial Reader${parts.length > 1 ? ` (part ${i + 1})` : ''}`,
        text: ps.join('\n\n'),
        sourceId: SOURCE,
        authorId: AUTHOR,
        locator: `Preface${parts.length > 1 ? ` (part ${i + 1} of ${parts.length})` : ''}`,
        url: pageUrl('ii.i'),
        tradition: TRADITION,
        keywords: [...KEYWORDS, 'preface'],
      });
    });
  }

  // chapters I–XXXII
  for (let ch = 1; ch <= 32; ch++) {
    const id = `ii.${romanLower(ch + 1)}`;
    const d = div(root, id);
    const h3 = d.children.find((c): c is El => isEl(c) && c.tag === 'h3');
    const h2 = d.children.find((c): c is El => isEl(c) && c.tag === 'h2');
    const printed = h3 ? /CHAP\.\s*([IVXL]+)/.exec(cleanText(h3))?.[1] : undefined;
    if (!printed || roman(printed) !== ch) throw new Error(`1689 Confession: ${id} is not chapter ${ch} (${printed})`);
    const chapterTitle = titleCase(cleanText(h2!).replace(/\s+/g, ' ').replace(/\.$/, '')).replace(/\bLords\b/, "Lord's");
    let cur: { n: number; text: string[]; refs: PassageRef[] } | null = null;
    const found: number[] = [];
    const flush = () => {
      if (!cur) return;
      docs.push({
        id: `lbc1689:${ch}.${cur.n}`,
        title: `Second London Baptist Confession ${ch}.${cur.n} — ${chapterTitle}`,
        text: cur.text.join('\n\n'),
        sourceId: SOURCE,
        authorId: AUTHOR,
        locator: `ch. ${ch} §${cur.n}`,
        url: pageUrl(id),
        refs: uniqueKeys(cur.refs),
        tradition: TRADITION,
        keywords: [...KEYWORDS, chapterTitle],
      });
      found.push(cur.n);
      cur = null;
    };
    for (const p of paragraphs(d)) {
      const t = cleanText(p).replace(/\s+/g, ' ').trim();
      if (!t) continue;
      const m = /^(\d+)\.\s*(.*)$/.exec(t);
      if (m) {
        flush();
        cur = { n: Number(m[1]), text: [m[2]], refs: scripRefs(p) };
      } else if (cur) {
        cur.text.push(t);
        cur.refs.push(...scripRefs(p));
      } else {
        // a chapter printed without paragraph numbers (a single paragraph)
        cur = { n: 1, text: [t], refs: scripRefs(p) };
      }
    }
    flush();
    if (!found.length || found.some((n, i) => n !== i + 1)) throw new Error(`1689 Confession ch. ${ch}: paragraphs ${found.join(',')}`);
    if (KNOWN[ch] != null && found.length !== KNOWN[ch]) throw new Error(`1689 Confession ch. ${ch}: ${found.length} paragraphs, expected ${KNOWN[ch]}`);
  }

  // appendix on baptism
  {
    const d = div(root, 'ii.xxxiv');
    const els = paragraphs(d);
    const texts: string[] = [];
    const refs: PassageRef[] = [];
    for (const p of els) {
      const t = cleanText(p).replace(/\s+/g, ' ').trim();
      if (t) texts.push(t);
      refs.push(...scripRefs(p));
    }
    const parts = chunked(texts);
    parts.forEach((ps, i) => {
      docs.push({
        id: `lbc1689:appendix${parts.length > 1 ? `:${i + 1}` : ''}`,
        title: `Second London Baptist Confession — Appendix on Baptism${parts.length > 1 ? ` (part ${i + 1})` : ''}`,
        text: ps.join('\n\n'),
        sourceId: SOURCE,
        authorId: AUTHOR,
        locator: `Appendix${parts.length > 1 ? ` (part ${i + 1} of ${parts.length})` : ''}`,
        url: pageUrl('ii.xxxiv'),
        tradition: TRADITION,
        keywords: [...KEYWORDS, 'baptism', 'infant baptism', 'believers’ baptism', 'paedobaptism'],
      });
    });
  }
  const marriage = docs.filter((x) => x.id.startsWith('lbc1689:25.'));
  if (marriage.length !== 4) throw new Error(`1689 Confession ch. 25 (Of Marriage): ${marriage.length} paragraphs`);
  return { name: 'Second London Baptist Confession (CCEL)', documents: docs, urls: [XML] };
}

function romanLower(n: number): string {
  const table: [number, string][] = [[40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
  let out = '';
  for (const [v, s] of table)
    while (n >= v) {
      out += s;
      n -= v;
    }
  return out;
}
