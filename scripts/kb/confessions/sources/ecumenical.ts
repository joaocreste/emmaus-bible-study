/**
 * Ecumenical creeds:
 *  - Apostles' Creed, Chalcedonian Definition, Athanasian Creed, and the Nicene Creed in
 *    the received text of the Western churches: Philip Schaff, The Creeds of Christendom,
 *    vol. 2 (1877), via CCEL ThML.
 *  - The creed of Nicaea (325) and the Nicene-Constantinopolitan Creed (381): Henry R.
 *    Percival, NPNF² vol. 14 (1900), via New Advent.
 */
import type { KbDocument, Part } from '../lib/corpus.ts';
import { byTag, findAll, findFirst, parseHtml, textOf, type El } from '../lib/html.ts';
import { fetchText } from '../lib/net.ts';
import { uniqueKeys } from '../lib/refs.ts';
import { SCHAFF, cleanText, div, englishCells, joinCells, loadThml, scripRefs } from '../lib/thml.ts';

const TRADITION = 'Ecumenical';

export async function buildEcumenical(): Promise<Part> {
  const root = await loadThml(SCHAFF.vol2.xml);
  const docs: KbDocument[] = [];
  const urls = [SCHAFF.vol2.xml];

  /* ---- Apostles' Creed (received form): the English follows the Latin/Greek table ---- */
  {
    const d = div(root, 'iv.i.i.i');
    const heads = findAll(d, byTag('h3'));
    const english = heads.find((h) => /THE APOSTLES' CREED/i.test(cleanText(h)));
    if (!english) throw new Error("Apostles' Creed: English heading not found");
    const parent = english.parent as El;
    const after = parent.children.slice(parent.children.indexOf(english) + 1);
    const paras: string[] = [];
    for (const n of after) {
      if (typeof n === 'string') continue;
      if (n.tag === 'h3' || n.tag === 'table') break;
      if (n.tag === 'p') {
        const t = cleanText(n);
        if (t) paras.push(t);
      }
    }
    const text = paras.join('\n\n');
    if (!/^I believe in God the Father Almighty/.test(text) || !/life everlasting\. Amen\.$/.test(text)) throw new Error(`Apostles' Creed: unexpected text: ${text.slice(0, 80)}`);
    docs.push({
      id: 'apostles-creed',
      title: "The Apostles' Creed (received form)",
      text,
      sourceId: 'apostles-creed',
      locator: 'received form (forma recepta)',
      url: SCHAFF.vol2.page('iv.i.i.i'),
      tradition: TRADITION,
      keywords: ["Apostles' Creed", 'Symbolum Apostolicum', 'creed', 'ecumenical creed', 'descended into hell', 'communion of saints'],
    });
  }

  /* ---- Nicene Creed, received text of the Western churches (Schaff: "Protestant Churches" column) ---- */
  {
    const d = div(root, 'iv.i.ii.ii');
    const cells = englishCells(d, 1).map((c) => c.text);
    const text = joinCells(cells.filter((t) => !/^The Received Text/i.test(t)));
    if (!/^I believe in one God the Father Almighty/.test(text) || !/world to come\. Amen\.$/.test(text)) throw new Error(`Nicene (Western): unexpected text: ${text.slice(0, 80)} … ${text.slice(-60)}`);
    if (!text.includes('[and the Son]')) throw new Error('Nicene (Western): filioque clause missing');
    docs.push({
      id: 'nicene-creed-western',
      title: 'The Nicene Creed — received text of the Western churches',
      text,
      sourceId: 'nicene-creed',
      locator: 'Forma recepta Ecclesiae Occidentalis (English)',
      url: SCHAFF.vol2.page('iv.i.ii.ii'),
      tradition: TRADITION,
      keywords: ['Nicene Creed', 'Niceno-Constantinopolitan Creed', 'filioque', 'and the Son', 'Western', 'creed', 'ecumenical creed', 'homoousios', 'one substance'],
    });
  }

  /* ---- Chalcedonian Definition (451) ---- */
  {
    const d = div(root, 'iv.i.iii');
    const tables = findAll(d, byTag('table'));
    const cells: string[] = [];
    for (const t of tables) for (const c of englishCells(t, 1)) cells.push(c.text);
    const text = joinCells(cells);
    if (!/^We, then, following the holy Fathers/.test(text) || !/handed down to us\.$/.test(text)) throw new Error(`Chalcedon: unexpected text: ${text.slice(0, 80)} … ${text.slice(-60)}`);
    docs.push({
      id: 'chalcedon-definition',
      title: 'The Definition of Chalcedon (451)',
      text,
      sourceId: 'chalcedonian-definition',
      authorId: 'council-of-chalcedon',
      locator: 'Symbol of Chalcedon, Oct. 22, 451',
      url: SCHAFF.vol2.page('iv.i.iii'),
      refs: uniqueKeys(scripRefs(d, { ntOnly: true })),
      tradition: TRADITION,
      keywords: ['Chalcedon', 'Chalcedonian Definition', 'two natures', 'hypostatic union', 'one person', 'Theotokos', 'Mother of God', 'Christology', 'truly God and truly man'],
    });
  }

  /* ---- Athanasian Creed (Quicunque vult), numbered clauses 1–44 ---- */
  {
    const d = div(root, 'iv.i.iv');
    const clauses = englishCells(d, 1)
      .map((c) => c.text)
      .filter((t) => /^\d+\.\s/.test(t));
    const nums = clauses.map((t) => Number(/^(\d+)\./.exec(t)![1]));
    for (let i = 0; i < nums.length; i++) if (nums[i] !== i + 1) throw new Error(`Athanasian Creed: clause numbering broken at ${i + 1} (got ${nums[i]})`);
    if (nums.length !== 44) throw new Error(`Athanasian Creed: expected 44 clauses, got ${nums.length}`);
    // The creed's own division: the Trinity (1–28), the Incarnation ("Furthermore it is necessary…", 29–44)
    const split = clauses.findIndex((t) => /^\d+\. Furthermore/.test(t));
    if (split < 0) throw new Error('Athanasian Creed: "Furthermore" clause not found');
    const parts = [
      { id: 'athanasian-creed:1', from: 0, to: split, title: 'The Athanasian Creed, 1–' + split + ' — the Trinity', topic: ['Trinity', 'three Persons', 'one God', 'unity in Trinity'] },
      { id: 'athanasian-creed:2', from: split, to: clauses.length, title: `The Athanasian Creed, ${split + 1}–${clauses.length} — the Incarnation`, topic: ['Incarnation', 'two natures', 'judgment', 'resurrection'] },
    ];
    for (const p of parts) {
      docs.push({
        id: p.id,
        title: p.title,
        text: clauses.slice(p.from, p.to).join('\n'),
        sourceId: 'athanasian-creed',
        locator: `vv. ${p.from + 1}–${p.to}`,
        url: SCHAFF.vol2.page('iv.i.iv'),
        tradition: TRADITION,
        keywords: ['Athanasian Creed', 'Quicunque vult', 'creed', 'ecumenical creed', ...p.topic],
      });
    }
  }

  /* ---- Percival, NPNF² 14: the creed of Nicaea (325) and of Constantinople (381) ---- */
  for (const spec of [
    { url: 'https://www.newadvent.org/fathers/3801.htm', id: 'nicaea-325', start: /^We believe in one God/, end: /anathematizes them\.$/, title: 'The Creed of Nicaea (325)', sourceId: 'creed-of-nicaea-percival', authorId: 'council-of-nicaea', locator: 'First Council of Nicaea, The Nicene Creed', kw: ['Nicaea', 'Council of Nicaea', 'Arius', 'Arianism', 'homoousios', 'of one substance', 'creed of 325'] },
    { url: 'https://www.newadvent.org/fathers/3808.htm', id: 'constantinople-381', start: /^We believe in one God/, end: /world to come\. Amen\.$/, title: 'The Nicene-Constantinopolitan Creed (381)', sourceId: 'nicene-creed-percival', authorId: 'council-of-constantinople-381', locator: 'First Council of Constantinople, Creed', kw: ['Nicene Creed', 'Niceno-Constantinopolitan Creed', 'Constantinople', 'proceeds from the Father', 'filioque', 'Holy Ghost', 'one holy catholic and apostolic Church', 'creed of 381'] },
  ]) {
    urls.push(spec.url);
    const page = parseHtml(await fetchText(spec.url, 'auto'));
    // New Advent shows Percival's footnotes inline as <span class="fisk|stiki">: not part of the creed
    const skip = (el: El) => el.tag === 'sup' || /\b(fisk|stiki)\b/.test(el.attrs.class ?? '');
    const paras = findAll(page, byTag('p')).map((p) => textOf(p, { skip }));
    const first = paras.findIndex((t) => spec.start.test(t));
    if (first < 0) throw new Error(`${spec.id}: creed text not found`);
    const collected: string[] = [];
    for (let i = first; i < paras.length; i++) {
      // Percival's editorial markers "(I)", "(II)" point to his own notes
      collected.push(paras[i].replace(/\s*\((?:I|II|III|IV)\)(?=[\s.,;]|$)/g, ''));
      if (spec.end.test(paras[i])) break;
    }
    const text = collected.join('\n\n');
    if (!spec.end.test(text)) throw new Error(`${spec.id}: end of creed not found`);
    const h = findFirst(page, byTag('h1'));
    if (!h) throw new Error(`${spec.id}: page heading missing`);
    docs.push({
      id: spec.id,
      title: spec.title,
      text,
      sourceId: spec.sourceId,
      authorId: spec.authorId,
      locator: spec.locator,
      url: spec.url,
      tradition: TRADITION,
      keywords: ['creed', 'ecumenical council', ...spec.kw],
    });
  }

  return { name: 'ecumenical creeds', documents: docs, urls };
}
