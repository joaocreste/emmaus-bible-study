/**
 * The Confession of Dositheus (Synod of Jerusalem, 1672): the eighteen decrees and four questions
 * of chapter VI of the synod's acts, in J. N. W. B. Robertson's translation (The Acts and Decrees
 * of the Synod of Jerusalem, London: Thomas Baker, 1899), with the synod's preface to the
 * confession, its closing section on the prayers of monks and fasting, and the epilogue.
 *
 * Text: the transcription "scanned and proofed" from the 1899 edition at Catholicity @ ELCore.Net
 * (2001), which prints Robertson's page numbers as <N>, his Scripture footnotes in braces in the
 * text ({Matthew 26:26}) and its own editorial notes in braces marked "ELC" (Robertson's own
 * notes, where kept, are marked "JNWBR"). Checked word by word against the OCR of the 1899 scan
 * on the Internet Archive (actsdecreesofsyn00orth): apart from OCR noise the wording is identical.
 * The editorial notes are dropped; the Scripture footnotes become refs (validated against the BSB;
 * Psalms and the books of Kingdoms are not mapped because the synod cites the Septuagint).
 *
 * One document per decree and question (long ones split at paragraph boundaries); locators give
 * the decree/question and Robertson's pages.
 */
import { roman, splitSentences, type KbDocument, type Part } from '../lib/corpus.ts';
import { findAll, isEl, parseHtml, textOf, type El } from '../lib/html.ts';
import { fetchText } from '../lib/net.ts';
import { LXX_VULGATE_RISK, scanRefs, uniqueKeys } from '../lib/refs.ts';
import type { PassageRef } from '../../../../src/domain/models.ts';

const URL = 'https://catholicity.elcore.net/ConfessionOfDositheus.html';
const SOURCE = 'confession-of-dositheus';
const AUTHOR = 'synod-of-jerusalem-1672';
const TRADITION = 'Eastern Orthodox';
const MAX_CHARS = 3000;
const KEYWORDS = ['Confession of Dositheus', 'Dositheus', 'Synod of Jerusalem', 'Council of Bethlehem', 'Eastern Orthodox', 'Orthodox Church', 'Greek Orthodox', 'Cyril Lucar', 'Calvinism'];

/** Subject keywords per decree/question (search aids, not titles). */
const TOPICS: Record<string, string[]> = {
  'Decree I': ['Trinity', 'God', 'Holy Spirit', 'procession of the Holy Spirit'],
  'Decree II': ['Scripture', 'Bible', 'interpretation of Scripture', 'Church authority', 'tradition', 'infallibility'],
  'Decree III': ['predestination', 'election', 'free will', 'grace', 'prevenient grace', 'reprobation', 'foreknowledge'],
  'Decree IV': ['creation', 'God the creator', 'angels', 'evil', 'origin of evil'],
  'Decree V': ['providence', 'evil', 'foreknowledge', 'sin'],
  'Decree VI': ['the fall', 'original sin', 'Adam', 'human nature'],
  'Decree VII': ['incarnation', 'Jesus Christ', 'virgin birth', 'Mary', 'resurrection', 'ascension', 'second coming'],
  'Decree VIII': ['mediator', 'Christ the mediator', 'intercession of saints', 'saints', 'angels', 'Mary', 'Theotokos', 'prayer to saints'],
  'Decree IX': ['faith', 'saving faith', 'faith working by love', 'justification', 'salvation'],
  'Decree X': ['church', 'bishops', 'episcopacy', 'priesthood', 'apostolic succession', 'church government'],
  'Decree XI': ['church', 'members of the church', 'sinners in the church', 'heretics'],
  'Decree XII': ['church', 'Holy Spirit', 'infallibility', 'councils', 'tradition'],
  'Decree XIII': ['justification', 'faith and works', 'good works', 'faith alone', 'merit'],
  'Decree XIV': ['free will', 'fallen man', 'grace', 'good works', 'regeneration'],
  'Decree XV': ['sacraments', 'mysteries', 'seven sacraments', 'baptism', 'confirmation', 'chrismation', 'priesthood', 'Eucharist', 'marriage', 'penance', 'confession', 'anointing of the sick', 'unction'],
  'Decree XVI': ['baptism', 'infant baptism', 'original sin', 'regeneration'],
  'Decree XVII': ['Eucharist', 'Lord’s Supper', 'Holy Communion', 'real presence', 'transubstantiation', 'sacrifice', 'Divine Liturgy'],
  'Decree XVIII': ['death', 'afterlife', 'intermediate state', 'prayer for the dead', 'purgatory', 'hell', 'heaven', 'judgment'],
  'Question I': ['Scripture', 'Bible reading', 'vernacular Bible', 'laity'],
  'Question II': ['Scripture', 'clarity of Scripture', 'perspicuity', 'interpretation of Scripture'],
  'Question III': ['canon of Scripture', 'Apocrypha', 'deuterocanonical books', 'Bible'],
  'Question IV': ['icons', 'images', 'veneration of saints', 'saints', 'Mary', 'relics', 'idolatry', 'latria', 'dulia'],
};

interface Para {
  text: string;
  refs: PassageRef[];
  /** Robertson's page on which the paragraph starts and ends */
  from: number;
  to: number;
}

interface Section {
  key: string; // 'preface' | 'address' | 'Decree XV' | 'Question II' | 'monks' | 'epilogue'
  anchor: string;
  question?: string;
  paras: Para[];
}

const PAGE = /⁣(\d+)⁣/g;

export async function buildDositheus(): Promise<Part> {
  let html = await fetchText(URL, 'auto');
  // Robertson's page numbers: "<small>&lt;112&gt;</small>" (and a few bare "<153>") -> sentinel
  html = html.replace(/<small>\s*&lt;(\d{2,3})&gt;\s*<\/small>/g, '⁣$1⁣').replace(/<(\d{2,3})>/g, '⁣$1⁣');
  // one footnote is printed without its <small> wrapper ("emptied Himself, {cf. Philippians 2:7}")
  html = html.replace(/(?<!<small>)\{([^{}<]*(?:<em>[^{}<]*<\/em>[^{}<]*)*)\}/g, '<small>{$1}</small>');
  const root = parseHtml(html);

  // notes in braces: Scripture footnotes (kept as refs) and editorial notes (dropped)
  const refsOf = new Map<El, PassageRef[]>();
  for (const small of findAll(root, (el) => el.tag === 'small')) {
    const t = textOf(small).replace(/\s+/g, ' ').trim();
    if (!t.startsWith('{')) continue;
    if (!t.endsWith('}')) throw new Error(`Dositheus: unbalanced note ${JSON.stringify(t)}`);
    const body = t.slice(1, -1).trim();
    const block = enclosingBlock(small);
    if (!/\b(ELC|JNWBR)$/.test(body) && block) {
      const refs = scanRefs(body.replace(/^cf\.\s*/i, ''), { exclude: LXX_VULGATE_RISK });
      refsOf.set(block, [...(refsOf.get(block) ?? []), ...refs]);
    }
    const parent = small.parent!;
    parent.children.splice(parent.children.indexOf(small), 1);
  }

  const sections: Section[] = [];
  let cur: Section | null = null;
  let page = 109; // the preface begins on p. 109 (the first marker in it is <110>)
  let started = false;
  let done = false;
  walkBlocks(root, (el) => {
    if (done) return;
    if (el.tag === 'a' && el.attrs.name) {
      const name = el.attrs.name;
      const m = /^(Decree|Question)([IVX]+)$/.exec(name);
      if (m) {
        cur = { key: `${m[1]} ${m[2]}`, anchor: name, paras: [] };
        sections.push(cur);
      } else if (name === 'Epilogue') {
        cur = { key: 'epilogue', anchor: name, paras: [] };
        sections.push(cur);
      }
      return;
    }
    if (el.tag !== 'p') return;
    const raw = textOf(el).replace(/\s+/g, ' ').trim();
    if (!raw) return;
    if (!started) {
      if (!/^To the candid and lovers of truth/.test(raw)) return;
      started = true;
      cur = { key: 'preface', anchor: 'Confession', paras: [] };
      sections.push(cur);
    }
    if (/^\{?Chapter VI\. concludes/.test(raw) || /^Scanned and proofed/.test(raw)) {
      done = true;
      return;
    }
    if (!cur) return;
    // the address "Dositheus, by the mercy of God…" opens the confession proper
    if (cur.key === 'preface' && /^Dositheus, by the mercy of God/.test(raw.replace(PAGE, ''))) {
      cur = { key: 'address', anchor: 'Confession', paras: [] };
      sections.push(cur);
    }
    // after Question IV the synod turns to Cyril's remaining charges (prayers of monks, fasts)
    if (cur.key === 'Question IV' && /^And so much as to the Chapters and Questions of Cyril/.test(raw)) {
      cur = { key: 'monks', anchor: 'QuestionIV', paras: [] };
      sections.push(cur);
    }
    const from = raw.search(/\S/) === raw.search(PAGE) && raw.search(PAGE) === 0 ? Number(/^⁣(\d+)/.exec(raw)![1]) : page;
    for (const m of raw.matchAll(PAGE)) page = Number(m[1]);
    const text = tidy(raw.replace(PAGE, ' '));
    if (!text) return;
    // a question is printed in italics as its own paragraph
    if (cur.key.startsWith('Question') && !cur.question && !cur.paras.length && /\?$/.test(text)) {
      cur.question = text;
      return;
    }
    cur.paras.push({ text, refs: refsOf.get(el) ?? [], from, to: page });
  });

  // structure checks
  const decrees = sections.filter((s) => s.key.startsWith('Decree ')).map((s) => roman(s.key.slice(7)));
  const questions = sections.filter((s) => s.key.startsWith('Question ')).map((s) => roman(s.key.slice(9)));
  if (decrees.length !== 18 || decrees.some((n, i) => n !== i + 1)) throw new Error(`Dositheus: expected Decrees I–XVIII, got ${decrees.join(',')}`);
  if (questions.length !== 4 || questions.some((n, i) => n !== i + 1)) throw new Error(`Dositheus: expected Questions I–IV, got ${questions.join(',')}`);
  for (const s of sections) {
    if (!s.paras.length) throw new Error(`Dositheus: ${s.key} is empty`);
    if (s.key.startsWith('Question') && !s.question) throw new Error(`Dositheus: ${s.key} has no question`);
    for (const p of s.paras) if (/[{}<>⁣]/.test(p.text)) throw new Error(`Dositheus: stray note or page mark in ${s.key}: ${p.text.slice(0, 80)}`);
  }
  if (!sections.find((s) => s.key === 'Decree XV')?.paras.some((p) => /Marriage/.test(p.text))) throw new Error('Dositheus: Decree XV does not name marriage');
  if (!/Body Itself and the Blood of the Lord/.test(sections.find((s) => s.key === 'Decree XVII')!.paras.map((p) => p.text).join(' '))) throw new Error('Dositheus: Decree XVII text not recognised');

  const docs: KbDocument[] = [];
  for (const s of sections) {
    const chunks = chunk(s.paras);
    chunks.forEach((ps, i) => {
      const part = chunks.length > 1 ? ` (part ${i + 1} of ${chunks.length})` : '';
      const pages = pageRange(ps);
      const label = LABEL[s.key] ?? s.key;
      const lead = s.question ?? firstWords(ps[0].text, 12);
      const text = (s.question && i === 0 ? `${s.question}\n\n` : '') + ps.map((p) => p.text).join('\n\n');
      docs.push({
        id: `dositheus:${slug(s.key)}${chunks.length > 1 ? `:${i + 1}` : ''}`,
        title: `Confession of Dositheus (Synod of Jerusalem, 1672), ${label}${part} — ${lead}`,
        text,
        sourceId: SOURCE,
        authorId: AUTHOR,
        locator: `${label}${part} (Robertson, ${pages})`,
        url: `${URL}#${s.anchor}`,
        refs: uniqueKeys(ps.flatMap((p) => p.refs)),
        tradition: TRADITION,
        keywords: [...KEYWORDS, ...(TOPICS[s.key] ?? []), ...(s.key === 'monks' ? ['prayer', 'monks', 'monasticism', 'fasting', 'hymns'] : [])],
      });
    });
  }
  return { name: 'Confession of Dositheus (Robertson 1899)', documents: docs, urls: [URL] };
}

const LABEL: Record<string, string> = {
  preface: 'Preface (ch. VI of the Acts)',
  address: 'Opening address',
  monks: 'After Question IV: on the prayers of monks and on fasts',
  epilogue: 'Epilogue',
};

/** Pre-order walk over elements (anchors and paragraphs are siblings in the page). */
function walkBlocks(node: El, visit: (el: El) => void): void {
  for (const c of node.children) {
    if (!isEl(c)) continue;
    visit(c);
    if (c.tag !== 'p') walkBlocks(c, visit);
  }
}

function enclosingBlock(el: El): El | undefined {
  let p = el.parent;
  while (p && p.tag !== 'p') p = p.parent;
  return p;
}

function tidy(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .replace(/\s+([,;:.?!)\]’”])/g, '$1')
    .replace(/([(\[“‘])\s+/g, '$1')
    .replace(/\s*—\s*/g, ' — ')
    .trim();
}

function chunk(paras: Para[]): Para[][] {
  const pieces: Para[] = paras.flatMap((p) => {
    const parts = splitSentences(p.text, MAX_CHARS);
    return parts.length === 1 ? [p] : parts.map((t, i) => ({ ...p, text: t, refs: i === 0 ? p.refs : [] }));
  });
  const out: Para[][] = [];
  let cur: Para[] = [];
  let size = 0;
  for (const p of pieces) {
    if (cur.length && size + p.text.length > MAX_CHARS) {
      out.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(p);
    size += p.text.length;
  }
  if (cur.length) out.push(cur);
  return out;
}

function pageRange(ps: Para[]): string {
  const a = Math.min(...ps.map((p) => p.from));
  const b = Math.max(...ps.map((p) => p.to));
  return a === b ? `p. ${a}` : `pp. ${a}–${b}`;
}

function firstWords(s: string, n: number): string {
  const words = s.split(/\s+/);
  const head = words.slice(0, n).join(' ').replace(/[,;:—-]+$/, '');
  return words.length > n ? `${head}…` : head;
}

function slug(key: string): string {
  const m = /^(Decree|Question) ([IVX]+)$/.exec(key);
  if (m) return `${m[1] === 'Decree' ? 'decree' : 'q'}-${roman(m[2])}`;
  return key;
}
