/**
 * Lutheran confessions from BookOfConcord.org, whose texts are the English of the
 * Triglot Concordia (St. Louis: Concordia, 1921):
 *  - Augsburg Confession (1530): preface, 28 articles, conclusion (long articles split at
 *    paragraph boundaries; locators give the Triglot paragraph numbers)
 *  - Formula of Concord, Epitome (1577): rule and norm + 12 articles, one document per
 *    part (Status Controversiae / Affirmative / Negative theses)
 *  - Luther's Small Catechism (1529): preface, each commandment, article, petition, and the
 *    sacraments, confession, daily prayers and table of duties
 * Skipped: the site's modern prefatory notes, its PDF page, and "Christian Questions with Their
 * Answers" (a later appendix given on the site in a modern translation, not the Triglot text).
 * Refs are the Scripture citations printed in the text ("Rom. 3:28"), parsed and validated.
 */
import { roman, type KbDocument, type Part } from '../lib/corpus.ts';
import { byClass, findAll, findFirst, oneLine, parseHtml, textOf, type El } from '../lib/html.ts';
import { fetchText } from '../lib/net.ts';
import { scanRefs, uniqueKeys } from '../lib/refs.ts';

const TRADITION = 'Lutheran';
const SITE = 'https://bookofconcord.org';
const AC_URL = `${SITE}/augsburg-confession/`;
const EP_URL = `${SITE}/epitome/`;
const SC_URL = `${SITE}/small-catechism/`;
const MAX_CHARS = 5000;

interface Block {
  kind: 'h3' | 'h4' | 'p';
  text: string;
  /** per-section page (h3 inside a link) */
  href?: string;
  /** Triglot paragraph number printed at the start of the paragraph */
  num?: number;
  /** last paragraph number inside the paragraph */
  lastNum?: number;
}

const isAnchor = (el: El) => (el.attrs.class ?? '').split(/\s+/).includes('bocanchor');

/** The site renders some Markdown literally ("_Given_", "**Reverend"). */
function stripMarkdown(s: string): string {
  return s.replace(/\*\*/g, '').replace(/(^|[\s(“"‘'])_([^_]+?)_(?=[\s.,;:!?)”"’']|$)/g, '$1$2');
}

async function bocBlocks(url: string): Promise<Block[]> {
  const page = parseHtml(await fetchText(url));
  const main = findFirst(page, (el) => el.tag === 'main');
  if (!main) throw new Error(`${url}: <main> not found`);
  const out: Block[] = [];
  for (const el of findAll(main, (e) => e.tag === 'h3' || e.tag === 'h4' || e.tag === 'p' || (e.tag === 'li' && !findAll(e, (x) => x.tag === 'p').length))) {
    if (el.tag === 'li' && el.parent && findFirst(el.parent, (x) => x.tag === 'a' && /toc|menu/.test(x.attrs.class ?? ''))) continue;
    const text = stripMarkdown(textOf(el, { skip: isAnchor }).replace(/\s+/g, ' ').trim());
    if (!text) continue;
    if (el.tag === 'h3' || el.tag === 'h4') {
      const a = el.parent?.tag === 'a' ? el.parent.attrs.href : undefined;
      out.push({ kind: el.tag, text, href: a ? new URL(a, SITE).href : undefined });
      continue;
    }
    const nums = findAll(el, byClass('bocanchor-content'))
      .map((s) => Number(oneLine(textOf(s))))
      .filter((n) => Number.isFinite(n) && n > 0);
    out.push({ kind: 'p', text, num: nums[0], lastNum: nums[nums.length - 1] });
  }
  return out;
}

/** Paragraph range label "§§1–29" from the paragraphs' Triglot numbers. */
function paraRange(ps: Block[]): string {
  const first = ps.find((p) => p.num != null)?.num;
  const last = [...ps].reverse().find((p) => p.lastNum != null)?.lastNum;
  if (first == null) return '';
  return last != null && last !== first ? `§§${first}–${last}` : `§${first}`;
}

/** Split a long section at paragraph boundaries into parts of at most ~MAX_CHARS. */
function splitParas(ps: Block[]): Block[][] {
  const total = ps.reduce((n, p) => n + p.text.length, 0);
  if (total <= MAX_CHARS * 1.3) return [ps];
  const parts: Block[][] = [];
  const target = total / Math.ceil(total / MAX_CHARS);
  let cur: Block[] = [];
  let size = 0;
  for (const p of ps) {
    if (cur.length && size + p.text.length > target * 1.15) {
      parts.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(p);
    size += p.text.length;
  }
  if (cur.length) parts.push(cur);
  return parts;
}

const refsOf = (text: string) => uniqueKeys(scanRefs(text));

/* ---------------- Augsburg Confession ---------------- */

async function buildAugsburg(): Promise<KbDocument[]> {
  const blocks = await bocBlocks(AC_URL);
  const docs: KbDocument[] = [];
  let section: { key: string; label: string; title: string; href?: string; paras: Block[] } | null = null;
  const flush = () => {
    if (!section) return;
    const parts = splitParas(section.paras);
    parts.forEach((ps, i) => {
      const text = ps.map((p) => p.text).join('\n\n');
      const range = paraRange(ps);
      const partLabel = parts.length > 1 ? ` (part ${i + 1} of ${parts.length})` : '';
      docs.push({
        id: `ac:${section!.key}${parts.length > 1 ? `:${i + 1}` : ''}`,
        title: `Augsburg Confession, ${section!.label} — ${section!.title}${partLabel}`,
        text,
        sourceId: 'augsburg-confession',
        authorId: 'philip-melanchthon',
        locator: [section!.label, range].filter(Boolean).join(', '),
        url: section!.href ?? AC_URL,
        refs: refsOf(text),
        tradition: TRADITION,
        keywords: ['Augsburg Confession', 'Confessio Augustana', 'Book of Concord', 'Lutheran confessions', section!.title],
      });
    });
    section = null;
  };
  for (const b of blocks) {
    if (b.kind === 'h3') {
      const m = /^Article ([IVXL]+)\s*[.\-–—]\s*(.+?)\.?$/.exec(b.text);
      if (m) {
        flush();
        const n = roman(m[1])!;
        section = { key: String(n), label: `Art. ${m[1]}`, title: m[2].trim(), href: b.href, paras: [] };
      } else if (/^Preface/.test(b.text)) {
        flush();
        section = { key: 'preface', label: 'Preface', title: 'To the Emperor Charles V', href: b.href, paras: [] };
      } else if (/^Conclusion/.test(b.text)) {
        flush();
        section = { key: 'conclusion', label: 'Conclusion', title: 'Conclusion', href: b.href, paras: [] };
      } else {
        flush();
      }
      continue;
    }
    if (b.kind === 'h4') continue; // "Articles in which are reviewed the abuses…" (between XXI and XXII)
    section?.paras.push(b);
  }
  flush();
  const arts = [...new Set(docs.map((d) => d.id.split(':')[1]).filter((k) => /^\d+$/.test(k)).map(Number))];
  if (arts.length !== 28 || arts.some((n, i) => n !== i + 1)) throw new Error(`Augsburg: expected articles 1–28, got ${arts.join(',')}`);
  return docs;
}

/* ---------------- Formula of Concord, Epitome ---------------- */

function subsectionName(h: string): { key: string; label: string } | null {
  if (/^STATUS CONTROVERSIAE/i.test(h)) return { key: 'status', label: 'Status Controversiae' };
  if (/^AFFIRM?ITIVE THESES|^AFFIRMATIVE/i.test(h)) return { key: 'affirmative', label: 'Affirmative Theses' };
  if (/^NEGATIVE THESES/i.test(h)) return { key: 'negative', label: 'Negative Theses' };
  return null;
}

async function buildEpitome(): Promise<KbDocument[]> {
  const blocks = await bocBlocks(EP_URL);
  const docs: KbDocument[] = [];
  let art: { key: string; label: string; title: string; href?: string } | null = null;
  let sub: { key: string; label: string; paras: Block[] } | null = null;
  const flush = () => {
    if (!art || !sub || !sub.paras.length) {
      sub = null;
      return;
    }
    const a = art;
    const s = sub;
    const parts = splitParas(s.paras);
    parts.forEach((ps, i) => {
      const text = ps.map((p) => p.text).join('\n\n');
      const partLabel = parts.length > 1 ? ` (part ${i + 1} of ${parts.length})` : '';
      docs.push({
        id: `fc-ep:${a.key}.${s.key}${parts.length > 1 ? `:${i + 1}` : ''}`,
        title: `Formula of Concord, Epitome ${a.label} (${a.title})${s.label ? ` — ${s.label}` : ''}${partLabel}`,
        text,
        sourceId: 'formula-of-concord',
        authorId: 'formula-of-concord-theologians',
        locator: `Epitome ${a.label}${s.label ? `, ${s.label}` : ''}`,
        url: a.href ?? EP_URL,
        refs: refsOf(text),
        tradition: TRADITION,
        keywords: ['Formula of Concord', 'Epitome', 'Book of Concord', 'Lutheran confessions', a.title],
      });
    });
    sub = null;
  };
  for (const b of blocks) {
    const artMatch = b.kind === 'h3' ? /^([IVX]+)\.\s+(.+?)\.?$/.exec(b.text) : null;
    if (artMatch) {
      flush();
      art = { key: String(roman(artMatch[1])), label: `Art. ${artMatch[1]}`, title: artMatch[2].trim(), href: b.href };
      continue;
    }
    if (b.kind === 'h3' && /^Comprehensive Summary, Rule and Norm/.test(b.text)) {
      flush();
      art = { key: 'rule', label: '', title: 'Comprehensive Summary, Rule and Norm', href: b.href };
      sub = { key: 'text', label: '', paras: [] };
      continue;
    }
    // thesis-group headings are sometimes marked up as plain paragraphs (Art. V "AFFIRMATIVE THESES")
    const groupHeading = b.kind === 'h3' || b.kind === 'h4' || (b.kind === 'p' && /^(STATUS CONTROVERSIAE|AFFIRMATIVE THESES|NEGATIVE THESES)\b/.test(b.text));
    if (groupHeading) {
      const s = subsectionName(b.text);
      if (s) {
        flush();
        sub = { ...s, paras: [] };
      } else if (art && !sub) {
        // a heading that is not a thesis group (e.g. "Which are called Adiaphora…") opens the article's text
        sub = { key: 'text', label: '', paras: [] };
      }
      continue;
    }
    if (!art) continue;
    if (!sub) sub = { key: 'text', label: '', paras: [] };
    sub.paras.push(b);
  }
  flush();
  for (const d of docs) if (d.id.startsWith('fc-ep:rule')) {
    d.title = 'Formula of Concord, Epitome — Comprehensive Summary, Rule and Norm';
    d.locator = 'Epitome, Rule and Norm';
  }
  const arts = [...new Set(docs.map((d) => d.id.split(':')[1].split('.')[0]).filter((k) => /^\d+$/.test(k)).map(Number))];
  if (arts.length !== 12 || arts.some((n, i) => n !== i + 1)) throw new Error(`Epitome: expected articles 1–12, got ${arts.join(',')}`);
  return docs;
}

/* ---------------- Small Catechism ---------------- */

async function buildSmallCatechism(): Promise<KbDocument[]> {
  const blocks = await bocBlocks(SC_URL);
  const docs: KbDocument[] = [];
  const push = (key: string, part: string, item: string | null, href: string | undefined, lines: string[]) => {
    const text = lines
      .map((l) => l.replace(/^[–—-]\s*Answer:\s*/, 'Answer: '))
      .join('\n\n')
      .trim();
    if (!text) return;
    docs.push({
      id: `luther-sc:${key}`,
      title: `Luther's Small Catechism — ${part}${item ? `: ${item}` : ''}`,
      text,
      sourceId: 'luther-small-catechism-triglot',
      authorId: 'luther',
      locator: item ? `${part}, ${item}` : part,
      url: href ?? SC_URL,
      refs: refsOf(text),
      tradition: TRADITION,
      keywords: ["Luther's Small Catechism", 'Small Catechism', 'Enchiridion', 'Book of Concord', 'catechism', part],
    });
  };
  // group blocks by top-level (h3) section
  const sections: { title: string; href?: string; blocks: Block[] }[] = [];
  for (const b of blocks) {
    if (b.kind === 'h3') sections.push({ title: b.text, href: b.href, blocks: [] });
    else sections[sections.length - 1]?.blocks.push(b);
  }
  const ordinal = (w: string) => ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'].indexOf(w.toLowerCase()) + 1;
  const isHouseholdLine = (b: Block) => /^(As|How) the head of the family should teach/i.test(b.text);
  for (const s of sections) {
    const body = s.blocks.filter((b) => !isHouseholdLine(b));
    const title = s.title.replace(/^[IVX]+\.\s+/, '');
    if (/^Prefaratory Notes|PDF|^Christian Questions/i.test(s.title)) continue;
    if (/^Luther's Preface/.test(s.title)) {
      const parts = splitParas(body.filter((b) => b.kind === 'p'));
      parts.forEach((ps, i) => push(parts.length > 1 ? `preface:${i + 1}` : 'preface', "Luther's Preface", parts.length > 1 ? `part ${i + 1} of ${parts.length}` : null, s.href, ps.map((b) => b.text)));
      continue;
    }
    if (/^The Ten Commandments/.test(s.title) || /^The Creed/.test(title) || /^The Lord's Prayer/.test(title)) {
      const part = /Commandments/.test(title) ? 'The Ten Commandments' : /Creed/.test(title) ? 'The Creed' : "The Lord's Prayer";
      const starts = (b: Block) =>
        (b.kind === 'h4' && /^The (\w+) (Commandment|Article)\.$/.test(b.text)) ||
        (b.kind === 'h4' && /^What Does God Say of All These Commandments\?$/.test(b.text)) ||
        (b.kind === 'p' && /^(Introduction|The \w+ Petition\.|Conclusion)$/.test(b.text));
      let cur: { label: string; key: string; lines: string[]; words?: string } | null = null;
      const flush = () => {
        if (cur) push(cur.key, part, cur.words ? `${cur.label} (${cur.words})` : cur.label, s.href, cur.lines);
        cur = null;
      };
      for (const b of body) {
        if (starts(b)) {
          flush();
          const m = /^The (\w+) (Commandment|Article|Petition)\.$/.exec(b.text);
          if (m) {
            const n = ordinal(m[1]);
            const kind = m[2].toLowerCase();
            cur = { label: b.text.replace(/\.$/, ''), key: `${kind}-${n}`, lines: [b.text] };
          } else if (/^What Does God Say/.test(b.text)) cur = { label: 'What Does God Say of All These Commandments?', key: 'commandments-close', lines: [b.text] };
          else if (b.text === 'Introduction') cur = { label: 'Introduction', key: 'lords-prayer-introduction', lines: [] };
          else cur = { label: 'Conclusion', key: 'lords-prayer-conclusion', lines: [] };
          continue;
        }
        if (!cur) continue;
        // the words of the commandment / article / petition, or the article's theme ("Of Creation.")
        if (!cur.words && cur.key.startsWith('article-') && /^Of \w+\.?$/.test(b.text)) cur.words = b.text.replace(/\.$/, '');
        else if (!cur.words && b.kind === 'h4' && !cur.key.startsWith('article-')) cur.words = b.text.replace(/\.$/, '').replace(/\s*\[.*\]$/, '');
        cur.lines.push(b.text);
      }
      flush();
      continue;
    }
    const keyMap: [RegExp, string, string][] = [
      [/^The Sacrament of Holy Baptism/, 'baptism', 'The Sacrament of Holy Baptism'],
      [/^How Christians should be taught to Confess/, 'confession', 'Confession'],
      [/^The Sacrament of the Altar/, 'altar', 'The Sacrament of the Altar'],
      [/^Daily Prayers/, 'daily-prayers', 'Daily Prayers'],
      [/^Table of Duties/, 'table-of-duties', 'Table of Duties'],
    ];
    const hit = keyMap.find(([re]) => re.test(title));
    if (!hit) throw new Error(`Small Catechism: unexpected section "${s.title}"`);
    let lines = body.map((b) => b.text);
    if (hit[1] === 'confession') {
      // the site's own footnote on the authorship of the questions is not part of the catechism
      lines = lines.filter((l) => !/^\*\s*These questions may not have been composed by Luther/.test(l)).map((l) => l.replace(/\s*\?\*$/, '?').replace(/ \?$/, '?'));
    }
    push(hit[1], hit[2], null, s.href, lines);
  }
  const need = [...Array.from({ length: 10 }, (_, i) => `commandment-${i + 1}`), 'article-1', 'article-2', 'article-3', ...Array.from({ length: 7 }, (_, i) => `petition-${i + 1}`), 'baptism', 'altar', 'confession', 'table-of-duties'];
  for (const k of need) if (!docs.some((d) => d.id === `luther-sc:${k}`)) throw new Error(`Small Catechism: missing ${k}`);
  return docs;
}

export async function buildLutheran(): Promise<Part> {
  const ac = await buildAugsburg();
  const ep = await buildEpitome();
  const sc = await buildSmallCatechism();
  return { name: 'Book of Concord (Triglot)', documents: [...ac, ...ep, ...sc], urls: [AC_URL, EP_URL, SC_URL] };
}

