/**
 * The Longer Catechism of the Orthodox, Catholic, Eastern Church (Philaret of Moscow; approved by
 * the Holy Synod, 1830/1839), in R. W. Blackmore's English translation (Aberdeen, 1845) as printed
 * in Philip Schaff, The Creeds of Christendom, vol. 2 (1877), via CCEL ThML.
 *
 * One document per question (Schaff numbers them; the answers follow in one or more paragraphs).
 * Section headings ("On the Ninth Article", "On Matrimony") go into the title and keywords.
 * Refs: the Scripture references CCEL tagged in the answers, kept only when the printed label
 * agrees with the tag. Blackmore cites the English Bible (e.g. "Psalm xci. 11"), so no book needs
 * to be excluded for Septuagint numbering.
 */
import { titleCase, type KbDocument, type Part } from '../lib/corpus.ts';
import { isEl, type El } from '../lib/html.ts';
import { uniqueKeys } from '../lib/refs.ts';
import { SCHAFF, cleanText, div, loadThml, scripRefs } from '../lib/thml.ts';
import type { PassageRef } from '../../../../src/domain/models.ts';

const TRADITION = 'Eastern Orthodox';

/** The divisions of the catechism and the CCEL page each lives on. */
const PARTS: { id: string; label: string }[] = [
  { id: 'vi.iii.i', label: 'Introduction' },
  { id: 'vi.iii.ii', label: 'Part I: On Faith' },
  { id: 'vi.iii.iii', label: 'Part II: On Hope' },
  { id: 'vi.iii.iv', label: 'Part III: On Love' },
  { id: 'vi.iii.v', label: 'Conclusion' },
];

const isCentered = (el: El) => el.tag === 'p' && /text-align:\s*center/.test(el.attrs.style ?? '');

export async function buildPhilaret(): Promise<Part> {
  const root = await loadThml(SCHAFF.vol2.xml);
  const docs: KbDocument[] = [];
  for (const part of PARTS) {
    const d = div(root, part.id);
    let section = '';
    let cur: { n: number; q: string; a: string[]; refs: PassageRef[]; section: string } | null = null;
    const flush = () => {
      if (!cur) return;
      // a few answers are printed in the question's paragraph ("…pure in heart? That they shall see God.")
      if (!cur.a.length) {
        const m = /^(.+?\?)\s+(.+)$/.exec(cur.q);
        if (m) {
          cur.q = m[1];
          cur.a.push(m[2]);
        }
      }
      const answer = cur.a.join('\n\n').trim();
      if (!answer) throw new Error(`Philaret Q. ${cur.n}: empty answer`);
      const where = [part.label, cur.section].filter(Boolean).join(', ');
      docs.push({
        id: `philaret:${cur.n}`,
        title: `Longer Catechism of the Orthodox Church (Philaret) Q. ${cur.n} — ${cur.q}`,
        text: `${cur.n}. ${cur.q}\n\n${answer}`,
        sourceId: 'philaret-longer-catechism-schaff',
        authorId: 'philaret-of-moscow',
        locator: `Q. ${cur.n} (${where})`,
        url: SCHAFF.vol2.page(part.id),
        refs: uniqueKeys(cur.refs),
        tradition: TRADITION,
        keywords: ['Longer Catechism', 'Orthodox Catechism', 'Philaret', 'Philaret of Moscow', 'Russian Orthodox', 'Eastern Orthodox', 'Orthodox Church', part.label.replace(/^Part [IV]+: /, ''), ...(cur.section ? [cur.section] : [])],
      });
      cur = null;
    };
    const paras = d.children.filter((c): c is El => isEl(c) && (c.tag === 'p' || c.tag === 'h4'));
    for (const p of paras) {
      const text = cleanText(p).replace(/\s+/g, ' ').trim();
      if (!text) continue;
      if (p.tag === 'h4') continue; // part title
      if (isCentered(p)) {
        flush();
        section = /[a-z]/.test(text) ? text.replace(/\.$/, '') : titleCase(text.replace(/\.$/, ''));
        continue;
      }
      const q = /^(\d+)\.\s*(.+)$/.exec(text);
      // the question number is set in bold (<b> or a bold <span>) at the start of the paragraph
      const first = p.children.find((c): c is El => isEl(c));
      const lead = p.children.slice(0, first ? p.children.indexOf(first) : 0).join('').trim();
      const boldNumber = !!first && !lead && (first.tag === 'b' || /font-weight:\s*bold/.test(first.attrs.style ?? '')) && /^\d+\.?$/.test(cleanText(first).trim());
      if (q && boldNumber) {
        flush();
        cur = { n: Number(q[1]), q: q[2].trim(), a: [], refs: [], section };
        continue;
      }
      if (!cur) continue;
      cur.a.push(cleanText(p));
      cur.refs.push(...scripRefs(p));
    }
    flush();
  }
  const nums = docs.map((x) => Number(x.id.split(':')[1]));
  const breaks = nums.filter((n, i) => n !== i + 1);
  if (breaks.length) throw new Error(`Philaret: question numbering broken (${nums.length} questions; first break at ${breaks[0]})`);
  if (nums.length < 600) throw new Error(`Philaret: only ${nums.length} questions`);
  const marriage = docs.find((x) => /Matrimony/.test(x.locator ?? ''));
  if (!marriage) throw new Error('Philaret: section "On Matrimony" not found');
  return { name: 'Longer Catechism of the Orthodox Church (Philaret; Schaff)', documents: docs, urls: [SCHAFF.vol2.xml] };
}
