/**
 * The Methodist Articles of Religion (1784): the twenty-five articles John Wesley abridged from the
 * Thirty-Nine Articles for the American Methodists, in the text of The Doctrines and Discipline of
 * the Methodist Episcopal Church (1872) as printed in Philip Schaff, The Creeds of Christendom,
 * vol. 3 (1877), via CCEL ThML. One document per article.
 */
import { roman, titleCase, type KbDocument, type Part } from '../lib/corpus.ts';
import { isEl, type El } from '../lib/html.ts';
import { scanRefs, uniqueKeys } from '../lib/refs.ts';
import { SCHAFF, cleanText, div, loadThml } from '../lib/thml.ts';

const TRADITION = 'Methodist';

const isHeading = (el: El) => el.tag === 'p' && /text-align:\s*center/.test(el.attrs.style ?? '');

export async function buildMethodist(): Promise<Part> {
  const root = await loadThml(SCHAFF.vol3.xml);
  const d = div(root, 'v.vi');
  const docs: KbDocument[] = [];
  let cur: { n: number; title: string; body: string[] } | null = null;
  const flush = () => {
    if (!cur) return;
    const text = cur.body.join('\n\n');
    if (!text) throw new Error(`Methodist Articles: Art. ${cur.n} is empty`);
    docs.push({
      id: `methodist-articles:${cur.n}`,
      title: `Methodist Articles of Religion, Art. ${cur.n} — ${cur.title}`,
      text,
      sourceId: 'methodist-articles-of-religion-schaff',
      authorId: 'wesley',
      locator: `Art. ${cur.n}`,
      url: SCHAFF.vol3.page('v.vi'),
      refs: uniqueKeys(scanRefs(text)),
      tradition: TRADITION,
      keywords: ['Methodist Articles of Religion', 'Articles of Religion', 'Twenty-Five Articles', 'Methodist Episcopal Church', 'United Methodist', 'Methodist', 'Wesleyan', cur.title],
    });
    cur = null;
  };
  // the articles follow Schaff's bracketed introduction (inside a <div>) as <p> siblings
  for (const el of d.children.filter((c): c is El => isEl(c) && c.tag === 'p')) {
    const t = cleanText(el).replace(/\s+/g, ' ').trim();
    if (!t) continue;
    if (isHeading(el)) {
      const m = /^([IVXL]+)\.\s+(.+?)\.?$/.exec(t);
      if (!m) throw new Error(`Methodist Articles: unexpected heading "${t}"`);
      flush();
      cur = { n: roman(m[1])!, title: titleCase(m[2]).replace(/\bLord's Supper\b/i, "Lord's Supper"), body: [] };
      continue;
    }
    cur?.body.push(t);
  }
  flush();
  const nums = docs.map((x) => Number(x.locator!.slice(5)));
  if (nums.length !== 25 || nums.some((n, i) => n !== i + 1)) throw new Error(`Methodist Articles: expected Art. 1–25, got ${nums.join(',')}`);
  return { name: 'Methodist Articles of Religion (Schaff)', documents: docs, urls: [SCHAFF.vol3.xml] };
}
