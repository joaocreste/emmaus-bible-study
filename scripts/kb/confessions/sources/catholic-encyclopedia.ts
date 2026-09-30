/**
 * The Catholic Encyclopedia (New York: Robert Appleton Company, 1907–1914), selected articles on
 * frequently asked doctrinal and moral subjects, from the New Advent electronic text
 * (newadvent.org/cathen). One document per section (h2) of an article, split at paragraph
 * boundaries into parts of at most ~2,600 characters.
 *
 * The articles are a century old: they state Catholic teaching and scholarship as of 1907–1914
 * (before the 1917 Code of Canon Law and Vatican II). Titles carry the year of each article
 * ("Divorce (in Moral Theology), 1909 (part 3)"), locators its volume and year.
 *
 * Kept: the article text and its section headings. Dropped: New Advent's banners and
 * advertisements, "See also" cross-links, the tables of contents some articles open with, the bibliographies ("Sources") and the page credits
 * (read only for the author, year and volume of the article).
 * Refs: the Scripture references New Advent linked in the text (link text such as "Matthew 19:9"),
 * parsed and validated; books whose Douay-Rheims/Vulgate names or numbering differ from the BSB
 * (Psalms, Samuel/Kings, Chronicles, Ezra/Nehemiah, Joel, Malachi) are left out.
 */
import { splitSentences, type KbDocument, type Part } from '../lib/corpus.ts';
import { byClass, byId, findAll, findFirst, flowBlocks, isEl, oneLine, parseHtml, textOf, type El } from '../lib/html.ts';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fetchText, ROOT } from '../lib/net.ts';
import { LXX_VULGATE_RISK, scanRefs, uniqueKeys } from '../lib/refs.ts';
import type { PassageRef } from '../../../../src/domain/models.ts';

const TRADITION = 'Catholic';
const MAX_CHARS = 2600;
const page = (file: string) => `https://www.newadvent.org/cathen/${file}.htm`;

export interface CeArticle {
  /** New Advent file id, e.g. "05054c" */
  file: string;
  /** registry source id */
  sourceId: string;
  /** search aliases (the everyday words for the subject) */
  keywords: string[];
}

/** Registry ids defined before this corpus existed are reused for the same articles. */
const a = (file: string, slug: string, keywords: string[], sourceId = `catholic-encyclopedia-${slug}`): CeArticle => ({ file, sourceId, keywords });

export const CE_ARTICLES: CeArticle[] = [
  a('05054c', 'divorce-moral-theology', ['divorce', 'remarriage', 'indissolubility', 'separation', 'annulment', 'Pauline privilege', 'adultery']),
  a('05064a', 'divorce-civil-jurisprudence', ['divorce', 'civil divorce', 'divorce law', 'marriage law']),
  a('09707a', 'sacrament-of-marriage', ['marriage', 'matrimony', 'wedding', 'husband and wife', 'sacrament of matrimony']),
  a('09699a', 'marriage-moral-canonical', ['marriage', 'matrimony', 'impediments', 'canon law', 'consent']),
  a('01163a', 'adultery', ['adultery', 'unfaithfulness', 'sixth commandment']),
  a('15687b', 'woman', ['women', 'woman', 'role of women', 'position of women']),
  a('06701a', 'sanctifying-grace', ['grace', 'sanctifying grace', 'justifying grace', 'habitual grace']),
  a('06689x', 'actual-grace', ['grace', 'actual grace', 'efficacious grace', 'sufficient grace']),
  a('08573a', 'justification', ['justification', 'justified', 'faith alone', 'sola fide', 'righteousness']),
  a('10202b', 'merit', ['merit', 'good works', 'reward']),
  a('13407a', 'salvation', ['salvation', 'saved', 'outside the Church no salvation']),
  a('12378a', 'predestination', ['predestination', 'election', 'reprobation', 'Molinism', 'Thomism'], 'catholic-encyclopedia-predestination'),
  a('06259a', 'free-will', ['free will', 'freedom of the will', 'determinism', 'liberty']),
  a('12510a', 'divine-providence', ['providence', 'divine providence', 'sovereignty of God']),
  a('05649a', 'evil', ['evil', 'problem of evil', 'suffering', 'theodicy']),
  a('11312a', 'original-sin', ['original sin', 'fall', 'Adam', 'concupiscence']),
  a('14004b', 'sin', ['sin', 'mortal sin', 'venial sin']),
  a('05752c', 'faith', ['faith', 'belief', 'theological virtue']),
  a('07465b', 'hope', ['hope', 'theological virtue']),
  a('09397a', 'charity', ['charity', 'love', 'love of God', 'love of neighbour', 'theological virtue']),
  a('12345b', 'prayer', ['prayer', 'praying', 'petition']),
  a('15047a', 'trinity', ['Trinity', 'Blessed Trinity', 'three persons', 'one God'], 'catholic-encyclopedia-trinity'),
  a('07409a', 'holy-ghost', ['Holy Spirit', 'Holy Ghost', 'Paraclete', 'procession']),
  a('07706b', 'incarnation', ['Incarnation', 'hypostatic union', 'two natures', 'God made man']),
  a('02055a', 'atonement', ['atonement', 'satisfaction', 'redemption', 'cross']),
  a('03744a', 'the-church', ['Church', 'ecclesiology', 'marks of the Church', 'one holy catholic apostolic']),
  a('12260a', 'the-pope', ['pope', 'papacy', 'primacy of Peter', 'Roman pontiff', 'bishop of Rome']),
  a('07790a', 'infallibility', ['infallibility', 'papal infallibility', 'ex cathedra']),
  a('15006b', 'tradition', ['tradition', 'Scripture and tradition', 'magisterium', 'teaching authority']),
  a('03274a', 'canon-new-testament', ['canon of Scripture', 'New Testament canon', 'canon of the New Testament']),
  a('03267a', 'canon-old-testament', ['canon of Scripture', 'Old Testament canon', 'deuterocanonical', 'Apocrypha']),
  a('08045a', 'inspiration-of-the-bible', ['inspiration', 'inspiration of Scripture', 'inerrancy', 'Bible']),
  a('04171a', 'communion-of-saints', ['communion of saints', 'intercession of saints', 'saints']),
  a('15464b', 'virgin-mary', ['Mary', 'Virgin Mary', 'Blessed Virgin', 'Mother of God', 'Theotokos']),
  a('13295a', 'sacraments', ['sacraments', 'sacrament', 'seven sacraments', 'ex opere operato']),
  a('02258b', 'baptism', ['baptism', 'infant baptism', 'baptismal regeneration'], 'catholic-encyclopedia-baptism'),
  a('04215b', 'confirmation', ['confirmation', 'chrism', 'laying on of hands'], 'catholic-encyclopedia-confirmation'),
  a('05584a', 'eucharist-as-sacrament', ['Eucharist', 'Holy Communion', 'Lord’s Supper', 'communion under both kinds', 'communion under one kind', 'frequent communion', 'first communion']),
  a('05573a', 'real-presence', ['Eucharist', 'Lord’s Supper', 'Holy Communion', 'real presence', 'transubstantiation']),
  a('10006a', 'sacrifice-of-the-mass', ['Mass', 'Eucharist', 'sacrifice of the Mass', 'Lord’s Supper']),
  a('11618c', 'sacrament-of-penance', ['penance', 'confession', 'absolution', 'forgiveness of sins', 'reconciliation']),
  a('07783a', 'indulgences', ['indulgences', 'temporal punishment', 'treasury of merit']),
  a('12575a', 'purgatory', ['purgatory', 'prayer for the dead', 'intermediate state']),
  a('05716a', 'extreme-unction', ['extreme unction', 'anointing of the sick', 'last rites']),
  a('11279a', 'holy-orders', ['holy orders', 'ordination', 'priesthood', 'bishops', 'deacons']),
  a('07170a', 'heaven', ['heaven', 'beatific vision', 'eternal life']),
  a('07207a', 'hell', ['hell', 'eternal punishment', 'damnation']),
  a('12792a', 'general-resurrection', ['resurrection', 'resurrection of the body', 'resurrection of the dead']),
  a('08552a', 'general-judgment', ['last judgment', 'general judgment', 'second coming', 'judgment']),
  a('08550a', 'particular-judgment', ['death', 'particular judgment', 'judgment after death', 'soul after death', 'intermediate state', 'afterlife']),
  a('04660c', 'preparation-for-death', ['death', 'dying', 'preparation for death', 'last rites', 'viaticum', 'deathbed']),
  a('10307a', 'millennium', ['millennium', 'millenarianism', 'chiliasm', 'thousand years', 'premillennialism']),
  a('15571a', 'use-of-wealth', ['wealth', 'riches', 'money', 'poverty', 'almsgiving']),
  a('15546c', 'war', ['war', 'just war', 'military service', 'peace']),
];

interface Meta {
  title: string;
  author: string;
  year: string;
  volume: string;
}

function metaOf(root: El, file: string): Meta {
  const h1 = findFirst(root, (el) => el.tag === 'h1');
  const span = (id: string) => {
    const el = findFirst(root, byId(id));
    return el ? oneLine(textOf(el)) : '';
  };
  const title = h1 ? oneLine(textOf(h1)) : '';
  const mlaAuthor = span('mlaauthor').replace(/\.$/, '');
  // "Lehmkuhl, Augustinus" -> "Augustinus Lehmkuhl"; several authors are joined with "and"
  const author = mlaAuthor
    .split(/,?\s+and\s+/)
    .map((n) => n.replace(/^([^,]+),\s*(.+)$/, '$2 $1').trim())
    .join(' and ');
  const year = /(\d{4})/.exec(span('mlayear'))?.[1] ?? '';
  const volume = /Vol\.\s*(\d+)/.exec(span('mlavolume'))?.[1] ?? '';
  if (!title || !author || !year || !volume) throw new Error(`Catholic Encyclopedia ${file}: incomplete citation (${JSON.stringify({ title, author, year, volume })})`);
  return { title, author, year, volume };
}

/** Scripture references linked in a block of the article (New Advent's Douay-Rheims links). */
function linkedRefs(el: El): PassageRef[] {
  const out: PassageRef[] = [];
  for (const link of findAll(el, (x) => x.tag === 'a' && /^\.\.\/bible\/[a-z0-9]{3}\d{3}\.htm/.test(x.attrs.href ?? ''))) {
    out.push(...scanRefs(oneLine(textOf(link)), { exclude: LXX_VULGATE_RISK }));
  }
  return out;
}

const isFurniture = (el: El) =>
  el.tag === 'script' ||
  el.tag === 'ins' ||
  el.tag === 'form' ||
  /\b(catholicadnet|CMtag|cenotes|pub)\b|^CM|728x90|300x250/.test(el.attrs.class ?? '') ||
  /^(cathen-|div-gpt)/.test(el.attrs.id ?? '');

/** The promotional banner and the "See also" line at the top of each article. */
function isBanner(el: El): boolean {
  if (el.tag !== 'p') return false;
  if (findFirst(el, (x) => x.tag === 'a' && /gumroad\.com/.test(x.attrs.href ?? ''))) return true;
  return /^See also\b/i.test(oneLine(textOf(el)));
}

interface Section {
  heading: string;
  paras: { text: string; refs: PassageRef[] }[];
}

async function buildArticle(art: CeArticle): Promise<{ docs: KbDocument[]; meta: Meta; url: string }> {
  const url = page(art.file);
  const root = parseHtml(await fetchText(url, 'auto'));
  const meta = metaOf(root, art.file);
  const body = findFirst(root, byId('springfield2'));
  if (!body) throw new Error(`Catholic Encyclopedia ${art.file}: article body not found`);
  // flatten the body into paragraphs with their linked references
  const sections: Section[] = [{ heading: '', paras: [] }];
  const blocks: El[] = [];
  const collect = (el: El) => {
    for (const c of el.children) {
      if (!isEl(c) || isFurniture(c)) continue;
      if (c.tag === 'h1' || isBanner(c)) continue;
      if (['p', 'h2', 'h3', 'li', 'blockquote', 'table'].includes(c.tag)) blocks.push(c);
      else collect(c);
    }
  };
  collect(body);
  for (const b of blocks) {
    if (b.tag === 'h2' || b.tag === 'h3') {
      const heading = oneLine(textOf(b));
      if (b.tag === 'h2') sections.push({ heading, paras: [] });
      else sections[sections.length - 1].paras.push({ text: heading, refs: [] });
      continue;
    }
    const parts = flowBlocks(b, { isHeading: () => false, skip: isFurniture }).map((x) => x.text);
    const refs = linkedRefs(b);
    const pieces = parts.flatMap((t) => splitSentences(t, MAX_CHARS));
    pieces.forEach((text, i) => {
      // a split paragraph keeps its references on every piece that prints them
      const own = pieces.length > 1 ? refs.filter((r) => text.includes(`${r.startChapter}:${r.startVerse ?? ''}`)) : refs;
      if (text) sections[sections.length - 1].paras.push({ text, refs: pieces.length > 1 ? own : i === 0 ? refs : [] });
    });
  }
  // New Advent opens some articles with a table of contents (the h2 headings as a list): drop it
  const key = (t: string) => t.toLowerCase().replace(/[^a-z]+/g, ' ').trim();
  const headings = new Set(blocks.filter((b) => b.tag === 'h2' || b.tag === 'h3').map((b) => key(oneLine(textOf(b)))));
  const intro = sections[0];
  const before = intro.paras.length;
  // entries: the headings themselves, or numbered lines ("I. Meaning\nII. Principal Adversaries…", "IV. Protestant Views…;")
  const numbered = (t: string) => t.split('\n').every((l) => /^[IVX]+\.\s.{0,90}$/.test(l.trim()));
  // …but a list the article announces as its teaching ("may be summed up in the following propositions:") is content,
  // even when each proposition is later repeated as a section heading (Divorce, in Moral Theology)
  const announcesTeaching = intro.paras.some((p) => /\b(?:propositions?|theses|summed up)\b[^.;!?]*:$/i.test(p.text));
  const proposition = (t: string) => announcesTeaching && t.length >= 80 && /[;.]$/.test(t);
  intro.paras = intro.paras.filter((p) => proposition(p.text) || (!headings.has(key(p.text)) && !numbered(p.text)));
  if (intro.paras.length < before - 2 || (before > intro.paras.length && intro.paras.some((p) => /(heads|headings|as follows):$/.test(p.text)))) {
    // …and the sentence announcing it ("The subject will be treated under the following headings:")
    // (the list's other entries are worded a little differently from the headings: short, unpunctuated lines)
    intro.paras = intro.paras
      .filter((p) => p.text.length >= 60 || /[.?!:"”]$/.test(p.text))
      .map((p) => ({ ...p, text: p.text.replace(/\s*(?:^|(?<=[.;!?]\s))[^.;!?]*(?:heads|headings|as follows|divided|treated under)[^.;!?]*:$/i, '').trim() }))
      .filter((p) => p.text);
  }
  const docs: KbDocument[] = [];
  const nonEmpty = sections.filter((s) => s.paras.length);
  // chunk: parts of ≤ MAX_CHARS within each section; numbered across the article
  const chunks: { section: string; paras: Section['paras']; lead?: Section['paras'] }[] = [];
  for (const s of nonEmpty) for (const ps of splitParas(s.paras)) chunks.push({ section: s.heading, paras: ps });
  // a chunk holding only a subheading (or a one-line gloss) before a long paragraph joins the next chunk
  for (let i = chunks.length - 2; i >= 0; i--) {
    const c = chunks[i];
    const n = chunks[i + 1];
    if (c.paras.reduce((k, p) => k + p.text.length, 0) >= 200 || c.paras.some((p) => p.text.length >= 120)) continue;
    if (c.section === n.section) n.paras = [...c.paras, ...n.paras];
    else if (c.section === '') n.lead = c.paras;
    else continue;
    chunks.splice(i, 1);
  }
  const multi = chunks.length > 1;
  chunks.forEach((c, i) => {
    const section = c.section.length > 110 ? `${c.section.slice(0, c.section.lastIndexOf(' ', 105))} …` : c.section;
    const opensSection = c.section !== '' && (i === 0 || chunks[i - 1].section !== c.section);
    const text = [...(c.lead ?? []).map((p) => p.text), ...(opensSection ? [c.section] : []), ...c.paras.map((p) => p.text)].join('\n\n');
    docs.push({
      id: `ce:${art.file}${multi ? `:${i + 1}` : ''}`,
      // the date stays visible: these articles state Catholic teaching and scholarship of 1907–1914
      // (the KB prefixes the corpus label, "The Catholic Encyclopedia (1907–1914) — …", and groups parts by the " (part N)" suffix)
      title: `${meta.title}, ${meta.year}${multi ? ` (part ${i + 1})` : ''}`,
      text,
      sourceId: art.sourceId,
      locator: `vol. ${meta.volume} (${meta.year}), s.v. “${meta.title}”${section ? `, § ${section.replace(/\.$/, '')}` : ''}${multi ? ` (part ${i + 1} of ${chunks.length})` : ''}`,
      url,
      refs: uniqueKeys([...(c.lead ?? []), ...c.paras].flatMap((p) => p.refs)),
      tradition: TRADITION,
      keywords: ['Catholic Encyclopedia', `Catholic Encyclopedia ${meta.year}`, meta.author, meta.title, ...art.keywords],
    });
  });
  return { docs, meta, url };
}

function splitParas<T extends { text: string }>(ps: T[]): T[][] {
  const total = ps.reduce((n, p) => n + p.text.length, 0);
  if (total <= MAX_CHARS * 1.2) return [ps];
  const target = total / Math.ceil(total / MAX_CHARS);
  const out: T[][] = [];
  let cur: T[] = [];
  let size = 0;
  for (const p of ps) {
    if (cur.length && size + p.text.length > target * 1.15) {
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

/** Article metadata (for the registry): file → title, author, year, volume. */
export const ceMetadata = new Map<string, Meta & { sourceId: string; url: string }>();

export async function buildCatholicEncyclopedia(): Promise<Part> {
  const docs: KbDocument[] = [];
  const urls: string[] = [];
  for (const art of CE_ARTICLES) {
    const r = await buildArticle(art);
    docs.push(...r.docs);
    urls.push(r.url);
    ceMetadata.set(art.file, { ...r.meta, sourceId: art.sourceId, url: r.url });
  }
  // article metadata for the registry (src/data/registry/confession-sources.ts is checked against it)
  await mkdir(join(ROOT, '.kb-cache'), { recursive: true });
  await writeFile(join(ROOT, '.kb-cache', 'confessions-ce-metadata.json'), JSON.stringify(Object.fromEntries(ceMetadata), null, 1));
  const div = docs.filter((d) => d.sourceId === 'catholic-encyclopedia-divorce-moral-theology');
  if (!div.length || !div.some((d) => /indissolub/.test(d.text))) throw new Error('Catholic Encyclopedia: Divorce (in Moral Theology) missing or empty');
  return { name: 'The Catholic Encyclopedia (New Advent)', documents: docs, urls };
}
