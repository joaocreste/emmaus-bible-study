/**
 * The Roman Catechism (Catechism of the Council of Trent for Parish Priests, issued by order of
 * Pope Pius V, 1566) in the English translation of John A. McHugh and Charles J. Callan, O.P.
 * (New York: Joseph F. Wagner, 1923; public domain in the United States).
 *
 * Text: the transcription of McHugh & Callan in the Nazareth Resource Library (cin.org, James
 * Akin, 1996), one HTML page per article of the Creed, sacrament, commandment and petition. It
 * omits the translators' footnotes and marginal Scripture references and sets the section
 * headings in title case; otherwise it reproduces the printed text. Every chunk is checked
 * mechanically against the OCR of the 1923 printing on the Internet Archive
 * (catechismofcounc0000jose): the build fails if a chunk's wording is not found there.
 *
 * One document per run of consecutive sections (the catechism's many short headed sections are
 * grouped up to ~2,400 characters within a page, never across pages; a long section is split at
 * paragraph boundaries). The headings stay in the text; the title names the part, the page and
 * the first headings of the chunk.
 * Refs: none (the transcription drops the marginal references and the text quotes Scripture in the
 * Douay-Rheims wording without citations).
 */
import { splitSentences, titleCase, type KbDocument, type Part } from '../lib/corpus.ts';
import { flowBlocks, parseHtml, type El } from '../lib/html.ts';
import { fetchText } from '../lib/net.ts';

const SOURCE = 'roman-catechism-mchugh-callan';
const TRADITION = 'Catholic';
const BASE = 'https://www.cin.org/users/james/ebooks/master/trent';
const OCR_URL = 'https://archive.org/download/catechismofcounc0000jose/catechismofcounc0000jose_djvu.txt';
const MAX_CHARS = 2400;
const KEYWORDS = ['Roman Catechism', 'Catechism of the Council of Trent', 'Catechism of Trent', 'Tridentine Catechism', 'Catechism of Pius V', 'Catholic', 'Roman Catholic', 'Catholic teaching', '1566'];

interface PageSpec {
  file: string;
  part: string;
  /** short label of the page within its part */
  label: string;
  /** everyday words for the page's subject (search keywords) */
  keywords: string[];
}

const P1 = 'Part I: The Creed';
const P2 = 'Part II: The Sacraments';
const P3 = 'Part III: The Decalogue';
const P4 = 'Part IV: The Lord’s Prayer';

const PAGES: PageSpec[] = [
  { file: 'tintro.htm', part: 'Introductory', label: 'Introduction', keywords: ['religious instruction', 'catechesis', 'preaching', 'pastors'] },
  { file: 'tcreed00.htm', part: P1, label: 'Faith and the Creed', keywords: ['faith', 'Apostles’ Creed', 'creed'] },
  { file: 'tcreed01.htm', part: P1, label: 'Article I: “I believe in God, the Father Almighty, Creator of heaven and earth”', keywords: ['God', 'Trinity', 'Father', 'creation', 'omnipotence', 'providence', 'angels'] },
  { file: 'tcreed02.htm', part: P1, label: 'Article II: “And in Jesus Christ, His only Son, our Lord”', keywords: ['Jesus Christ', 'Son of God', 'divinity of Christ', 'redemption', 'the fall', 'original sin'] },
  { file: 'tcreed03.htm', part: P1, label: 'Article III: “Who was conceived by the Holy Ghost, born of the Virgin Mary”', keywords: ['incarnation', 'virgin birth', 'Mary', 'Mother of God', 'two natures of Christ'] },
  { file: 'tcreed04.htm', part: P1, label: 'Article IV: “Suffered under Pontius Pilate, was crucified, dead, and buried”', keywords: ['passion of Christ', 'crucifixion', 'cross', 'atonement', 'satisfaction', 'death of Christ'] },
  { file: 'tcreed05.htm', part: P1, label: 'Article V: “He descended into hell, the third day He rose again from the dead”', keywords: ['descent into hell', 'harrowing of hell', 'resurrection of Christ', 'limbo of the fathers'] },
  { file: 'tcreed06.htm', part: P1, label: 'Article VI: “He ascended into heaven, sitteth at the right hand of God the Father Almighty”', keywords: ['ascension', 'right hand of God', 'session of Christ'] },
  { file: 'tcreed07.htm', part: P1, label: 'Article VII: “From thence He shall come to judge the living and the dead”', keywords: ['second coming', 'last judgment', 'general judgment', 'particular judgment', 'death'] },
  { file: 'tcreed08.htm', part: P1, label: 'Article VIII: “I believe in the Holy Ghost”', keywords: ['Holy Spirit', 'Holy Ghost', 'procession of the Holy Spirit', 'gifts of the Holy Spirit'] },
  { file: 'tcreed09.htm', part: P1, label: 'Article IX: “The Holy Catholic Church; the communion of saints”', keywords: ['church', 'marks of the church', 'one holy catholic apostolic', 'communion of saints', 'pope', 'papacy', 'heretics', 'members of the church'] },
  { file: 'tcreed10.htm', part: P1, label: 'Article X: “The forgiveness of sins”', keywords: ['forgiveness of sins', 'remission of sins', 'power of the keys', 'absolution'] },
  { file: 'tcreed11.htm', part: P1, label: 'Article XI: “The resurrection of the body”', keywords: ['resurrection of the body', 'resurrection of the dead', 'glorified body', 'death'] },
  { file: 'tcreed12.htm', part: P1, label: 'Article XII: “Life everlasting”', keywords: ['eternal life', 'heaven', 'beatific vision', 'hell', 'eternal punishment'] },
  { file: 'tsacr00.htm', part: P2, label: 'The Sacraments in General', keywords: ['sacraments', 'seven sacraments', 'sacramental character', 'matter and form', 'minister of the sacraments', 'grace'] },
  { file: 'tsacr-b.htm', part: P2, label: 'Baptism', keywords: ['baptism', 'infant baptism', 'baptismal regeneration', 'godparents', 'original sin'] },
  { file: 'tsacr-c.htm', part: P2, label: 'Confirmation', keywords: ['confirmation', 'chrism', 'laying on of hands'] },
  { file: 'tsacr-e.htm', part: P2, label: 'The Eucharist', keywords: ['Eucharist', 'Lord’s Supper', 'Holy Communion', 'real presence', 'transubstantiation', 'Mass', 'sacrifice of the Mass', 'communion under one kind'] },
  { file: 'tsacr-p.htm', part: P2, label: 'Penance', keywords: ['penance', 'confession', 'contrition', 'absolution', 'satisfaction', 'repentance', 'forgiveness of sins'] },
  { file: 'tsacr-u.htm', part: P2, label: 'Extreme Unction', keywords: ['extreme unction', 'anointing of the sick', 'last rites', 'sickness', 'death'] },
  { file: 'tsacr-o.htm', part: P2, label: 'Holy Orders', keywords: ['holy orders', 'priesthood', 'ordination', 'bishops', 'deacons', 'clergy', 'celibacy'] },
  { file: 'tsacr-m.htm', part: P2, label: 'Matrimony', keywords: ['marriage', 'matrimony', 'wedding', 'husband and wife', 'divorce', 'indissolubility', 'remarriage', 'adultery', 'separation', 'children'] },
  { file: 'tcomm00.htm', part: P3, label: 'The Decalogue', keywords: ['Ten Commandments', 'Decalogue', 'law of God', 'moral law', 'natural law'] },
  { file: 'tcomm01.htm', part: P3, label: 'The First Commandment', keywords: ['first commandment', 'idolatry', 'worship', 'invocation of saints', 'images', 'relics', 'superstition'] },
  { file: 'tcomm02.htm', part: P3, label: 'The Second Commandment', keywords: ['second commandment', 'name of God', 'oaths', 'swearing', 'blasphemy', 'vows'] },
  { file: 'tcomm03.htm', part: P3, label: 'The Third Commandment', keywords: ['third commandment', 'Sabbath', 'Lord’s Day', 'Sunday', 'holy days', 'rest'] },
  { file: 'tcomm04.htm', part: P3, label: 'The Fourth Commandment', keywords: ['fourth commandment', 'honour father and mother', 'parents', 'children', 'obedience', 'authority'] },
  { file: 'tcomm05.htm', part: P3, label: 'The Fifth Commandment', keywords: ['fifth commandment', 'murder', 'killing', 'capital punishment', 'self-defence', 'war', 'suicide', 'anger', 'forgiveness of enemies'] },
  { file: 'tcomm06.htm', part: P3, label: 'The Sixth Commandment', keywords: ['sixth commandment', 'adultery', 'fornication', 'chastity', 'purity', 'lust', 'sexual sin'] },
  { file: 'tcomm07.htm', part: P3, label: 'The Seventh Commandment', keywords: ['seventh commandment', 'stealing', 'theft', 'restitution', 'usury', 'almsgiving', 'wealth', 'riches', 'poverty'] },
  { file: 'tcomm08.htm', part: P3, label: 'The Eighth Commandment', keywords: ['eighth commandment', 'false witness', 'lying', 'truthfulness', 'slander', 'detraction'] },
  { file: 'tcom910.htm', part: P3, label: 'The Ninth and Tenth Commandments', keywords: ['ninth commandment', 'tenth commandment', 'coveting', 'covetousness', 'concupiscence', 'desire', 'riches', 'contentment'] },
  { file: 'tpray0.htm', part: P4, label: 'Prayer', keywords: ['prayer', 'praying', 'petition', 'thanksgiving', 'intercession', 'prayer for the dead'] },
  { file: 'tpray00.htm', part: P4, label: 'The Opening Words: “Our Father, who art in heaven”', keywords: ['Lord’s Prayer', 'Our Father', 'Pater Noster', 'fatherhood of God', 'guardian angels'] },
  { file: 'tpray01.htm', part: P4, label: 'The First Petition: “Hallowed be Thy name”', keywords: ['Lord’s Prayer', 'hallowed be thy name', 'holiness of God'] },
  { file: 'tpray02.htm', part: P4, label: 'The Second Petition: “Thy kingdom come”', keywords: ['Lord’s Prayer', 'kingdom of God', 'thy kingdom come'] },
  { file: 'tpray03.htm', part: P4, label: 'The Third Petition: “Thy will be done on earth as it is in heaven”', keywords: ['Lord’s Prayer', 'will of God', 'thy will be done', 'obedience'] },
  { file: 'tpray04.htm', part: P4, label: 'The Fourth Petition: “Give us this day our daily bread”', keywords: ['Lord’s Prayer', 'daily bread', 'provision', 'work', 'Eucharist'] },
  { file: 'tpray05.htm', part: P4, label: 'The Fifth Petition: “Forgive us our trespasses as we forgive those who trespass against us”', keywords: ['Lord’s Prayer', 'forgiveness', 'forgiving others', 'trespasses', 'debts'] },
  { file: 'tpray06.htm', part: P4, label: 'The Sixth Petition: “And lead us not into temptation”', keywords: ['Lord’s Prayer', 'temptation', 'lead us not into temptation', 'trials', 'the devil'] },
  { file: 'tpray07.htm', part: P4, label: 'The Seventh Petition: “But deliver us from evil”', keywords: ['Lord’s Prayer', 'deliver us from evil', 'evil', 'suffering', 'affliction', 'Satan'] },
  { file: 'tprayxx.htm', part: P4, label: 'The Conclusion: “Amen”', keywords: ['Lord’s Prayer', 'Amen', 'assurance in prayer'] },
];

/**
 * The transcription's soft hyphens (0xAD, from its scan conversion): doubled they stand for an em
 * dash; single ones join compounds ("hand-maid"), but a few stand for a lost space or a line-end
 * hyphen, listed here (checked against the 1923 printing).
 */
const SPACE_PAIRS = new Set([
  'of cases', 'he swears', 'or parent', 'Every sin', 'Persons the', 'Scriptures often', 'may be', 'the Church', 'misery of', 'and condition',
  'God already', 'is also', 'shall not', 'willingness to', 'This interpretation', 'this point', 'He might', 'communicate an', 'that marriage',
  'them to', 'things an', 'When ordaining', 'no other', 'a way', 'away all', 'every day',
]);
const JOIN_PAIRS = new Set(['en forces', 'be ginning', 'there fore']);
const DASH_PAIRS = new Set(['God that']);

function fixSoftHyphens(s: string): string {
  return s
    .replace(/­­/g, '—')
    .replace(/\s*—\s*/g, '—')
    .replace(/(\S*?)­(\s*)(\S*)/g, (m, a: string, sp: string, b: string) => {
      const left = /[\w,.;]+$/.exec(a)?.[0] ?? '';
      const right = /^[\w']*/.exec(b)?.[0] ?? '';
      const pair = `${left} ${right}`;
      if (!a) return `${sp}${b}`; // "the ­spirit"
      if (pair === 'instruct on') return `${a}ion${b.slice(2)}`; // "instruct­on" = "instruction"
      if (JOIN_PAIRS.has(pair)) return `${a}${b}`;
      if (DASH_PAIRS.has(pair)) return `${a}—${b}`;
      if (sp || SPACE_PAIRS.has(pair) || /[,.;:]$/.test(a)) return `${a} ${b}`;
      return `${a}-${b}`;
    });
}

/** Footnote marks left in the transcription ("such; ° whom", "Augustine · testify"). */
const stripMarks = (s: string) => s.replace(/\s*['’]?°\s*/g, (m) => (m.includes("'") || m.includes('’') ? "' " : ' ')).replace(/\s·\s/g, ' ');

/** "&quot;I BELIEVE&quot;" headings and the transcription's title case -> the corpus' title case. */
function heading(s: string): string {
  const t = s
    .replace(/\s+/g, ' ')
    .replace(/\s*:\s*$/, '')
    .replace(/\s+([:,])/g, '$1')
    .replace(/'"|"'/g, '"')
    .replace(/,?\s*--\s*/g, '—')
    .replace(/\bCod(?=['’]s\b)/g, 'God')
    .replace(/,\s*$/, '')
    .replace(/^"\s*/, '“')
    .replace(/\s*"$/, '”')
    .replace(/"([^"]*)"/g, '“$1”')
    .replace(/(^|\s)"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/'/g, '’')
    .trim();
  return titleCase(t)
    .replace(/\b(Article|Part) ([IVXL][ivxl]*)\b/g, (_m, w: string, n: string) => `${w} ${n.toUpperCase()}`)
    .replace(/([“‘])(\w)/g, (_m, q: string, c: string) => `${q}${c.toUpperCase()}`).replace(/\bThy\b/gi, 'Thy').replace(/\bSt\. (\w)/g, (_m, c: string) => `St. ${c.toUpperCase()}`);
}

const quotes = (s: string) =>
  s
    .replace(/\s*--\s*/g, '—')
    .replace(/\bCod(?=['’]s\b)/g, 'God')
    .replace(/(^|[\s(—])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/(^|[\s(—])'/g, '$1‘')
    .replace(/'/g, '’');

interface Section {
  heading: string;
  paras: string[];
  /** the page's own title ("ARTICLE VIII : I BELIEVE…", "THE SACRAMENT OF MATRIMONY"): kept in the text, not in titles */
  pageTitle?: boolean;
}

function sectionsOf(html: string): Section[] {
  const root = parseHtml(html);
  const isHeading = (el: El) => /^h[1-6]$/.test(el.tag);
  const skip = (el: El) => el.tag === 'title' || el.tag === 'head' || el.tag === 'meta' || el.tag === 'img';
  const blocks = flowBlocks(root, { isHeading, skip });
  const out: Section[] = [];
  let started = false;
  for (const b of blocks) {
    if (b.heading) {
      const tag = b.el?.tag;
      if (tag === 'h1' || tag === 'h2' || /^CATECHISM OF THE COUNCIL/i.test(b.text)) continue; // site title, part title
      out.push({ heading: heading(b.text), paras: [], pageTitle: !started && /^[^a-z]{8,}/.test(b.text) });
      started = true;
      continue;
    }
    if (!started) continue;
    if (/^Return to |^Copyright \(c\)/i.test(b.text)) continue;
    const t = quotes(stripMarks(b.text)).replace(/\s+/g, ' ').trim();
    if (t) out[out.length - 1].paras.push(t);
  }
  return out;
}

/* ---------------- check against the 1923 printing ---------------- */

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/-\s*\n\s*/g, '')
    .replace(/[^a-z]+/g, ' ')
    .trim();

function coverage(text: string, ocr: string): number {
  const words = norm(text).split(' ');
  if (words.length < 8) return 1;
  let hit = 0;
  let total = 0;
  for (let i = 0; i + 5 <= words.length; i += 5) {
    total++;
    if (ocr.includes(words.slice(i, i + 5).join(' '))) hit++;
  }
  return total ? hit / total : 1;
}

export async function buildRomanCatechism(): Promise<Part> {
  const urls: string[] = [];
  const docs: KbDocument[] = [];
  const ocr = norm(await fetchText(OCR_URL));
  urls.push(OCR_URL);
  const low: string[] = [];
  let sum = 0;
  for (const page of PAGES) {
    const url = `${BASE}/${page.file}`;
    urls.push(url);
    const html = fixSoftHyphens(await fetchText(url, 'cp1252'));
    const sections = sectionsOf(html).filter((s) => s.paras.length || s.heading);
    if (!sections.length) throw new Error(`Roman Catechism ${page.file}: no sections`);
    // group sections into chunks of ≤ MAX_CHARS (a long section is split at paragraph boundaries);
    // a heading with no text of its own ("“I Believe in the Holy Ghost”") opens the next chunk
    type Chunk = { headings: string[]; blocks: string[]; size: number };
    const chunks: Chunk[] = [];
    let cur: Chunk | null = null;
    let pending: string[] = [];
    const pageTitles = new Set(sections.filter((s) => s.pageTitle).map((s) => s.heading));
    for (const s of sections) {
      if (!s.paras.length) {
        pending.push(s.heading);
        continue;
      }
      const heads = [...pending, s.heading];
      pending = [];
      const paras = s.paras.flatMap((p) => splitSentences(p, MAX_CHARS));
      const size = paras.reduce((n, p) => n + p.length, 0) + heads.join(' ').length;
      if (cur && cur.size + size > MAX_CHARS) {
        chunks.push(cur);
        cur = null;
      }
      if (size > MAX_CHARS * 1.2) {
        // own chunk(s), split at paragraph boundaries
        let part: Chunk = { headings: heads, blocks: [...heads], size: 0 };
        for (const p of paras) {
          if (part.size && part.size + p.length > MAX_CHARS) {
            chunks.push(part);
            part = { headings: [`${s.heading} (cont.)`], blocks: [`${s.heading} (continued)`], size: 0 };
          }
          part.blocks.push(p);
          part.size += p.length;
        }
        chunks.push(part);
        continue;
      }
      cur ??= { headings: [], blocks: [], size: 0 };
      cur.headings.push(...heads);
      cur.blocks.push(...heads, ...paras);
      cur.size += size;
    }
    if (cur) chunks.push(cur);
    // a short closing section ("Admonition") joins the chunk before it
    const last = chunks[chunks.length - 1];
    const prev = chunks[chunks.length - 2];
    if (prev && last && last.size < 500 && prev.size + last.size <= MAX_CHARS * 1.3) {
      prev.headings.push(...last.headings);
      prev.blocks.push(...last.blocks);
      prev.size += last.size;
      chunks.pop();
    }
    const slug = page.file.replace(/\.htm$/, '');
    chunks.forEach((c, i) => {
      const text = c.blocks.filter(Boolean).join('\n\n');
      const cov = coverage(text, ocr);
      sum += cov;
      if (cov < 0.6) low.push(`${slug}:${i + 1} (${Math.round(cov * 100)}%)`);
      const titled = c.headings.filter((h) => !pageTitles.has(h));
      const heads = titled.filter((h) => !/^(The )?Importance of\b/i.test(h) || titled.length === 1);
      const shown = heads.length ? heads.slice(0, 3).join('; ') + (heads.length > 3 ? '; …' : '') : page.label;
      const where = page.part === 'Introductory' ? 'Introductory' : `${page.part.replace(/:.*$/, '')}, ${page.label}`;
      docs.push({
        id: `roman-catechism:${slug}:${i + 1}`,
        title: `Roman Catechism (Council of Trent, 1566), ${where} — ${shown}`,
        text,
        sourceId: SOURCE,
        authorId: 'council-of-trent',
        locator: `${page.part === 'Introductory' ? 'Introductory' : `${page.part}, ${page.label}`}, ${titled.length > 1 ? '§§' : '§'} ${(titled.length ? titled : c.headings).join('; ')}`,
        url,
        tradition: TRADITION,
        keywords: [...KEYWORDS, page.part.replace(/^Part [IV]+: /, ''), ...page.keywords],
      });
    });
  }
  const avg = sum / docs.length;
  if (low.length > docs.length * 0.05 || avg < 0.8) throw new Error(`Roman Catechism: transcription does not match the 1923 printing (average ${Math.round(avg * 100)}%; low: ${low.join(', ')})`);
  if (low.length) console.warn(`  Roman Catechism: chunks with low agreement with the 1923 OCR: ${low.join(', ')}`);
  console.log(`  Roman Catechism: average agreement with the 1923 OCR (5-word shingles) ${Math.round(avg * 100)}%`);
  const matrimony = docs.filter((d) => d.id.startsWith('roman-catechism:tsacr-m'));
  if (!matrimony.some((d) => /indissolub|cannot be dissolved|divorce/i.test(d.text))) throw new Error('Roman Catechism: Matrimony section on the marriage bond not found');
  return { name: 'Roman Catechism (McHugh & Callan 1923)', documents: docs, urls };
}
