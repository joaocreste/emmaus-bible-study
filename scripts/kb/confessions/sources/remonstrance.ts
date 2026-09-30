/**
 * The Five Arminian Articles (the Remonstrance of 1610) from Philip Schaff, The Creeds of
 * Christendom, vol. 3 (1877), pp. 545–549, via CCEL ThML (division iv.xv). Schaff prints
 * the Dutch text (1612), Bertius's Latin and his own English translation in three
 * columns; the English column is kept, one document per article plus the closing
 * paragraph. Schaff omits the Remonstrance's preface, its five negative articles and its
 * conclusion (his note says so), and so do we.
 *
 * The Remonstrants' own statement of conditional election, universal atonement, grace
 * that can be resisted and the open question of perseverance: the text of the view the
 * Canons of Dort answer, so an Arminian position can be written from its own words.
 */
import type { KbDocument, Part } from '../lib/corpus.ts';
import { uniqueKeys } from '../lib/refs.ts';
import { SCHAFF, div, englishCells, joinCells, loadThml, scripRefs } from '../lib/thml.ts';
import type { PassageRef } from '../../../../src/domain/models.ts';

const TRADITION = 'Remonstrant';
const SOURCE_ID = 'articles-of-remonstrance';
const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const;
/** Search aids (the subject of each article, as the Canons of Dort's heads name it). */
const SUBJECTS: Record<number, string[]> = {
  1: ['election', 'predestination', 'conditional election', 'decree'],
  2: ['atonement', 'death of Christ', 'redemption', 'died for all'],
  3: ['free will', 'saving faith', 'regeneration', 'grace'],
  4: ['grace', 'resistible grace', 'conversion'],
  5: ['perseverance', 'perseverance of the saints', 'falling away'],
};

export async function buildRemonstrance(): Promise<Part> {
  const root = await loadThml(SCHAFF.vol3.xml);
  const d = div(root, 'iv.xv');
  // columns: Dutch | Latin | English
  const cells = englishCells(d, 2);
  const docs: KbDocument[] = [];
  let cur: { n: number | 'conclusion'; texts: string[]; refs: PassageRef[] } | null = null;
  const flush = () => {
    if (!cur) return;
    const text = joinCells(cur.texts);
    if (!text) throw new Error(`Remonstrance ${cur.n}: empty text`);
    const n = cur.n;
    docs.push(
      n === 'conclusion'
        ? {
            id: 'remonstrance:conclusion',
            title: 'The Five Arminian Articles (Remonstrance, 1610) — Conclusion',
            text,
            sourceId: SOURCE_ID,
            locator: 'Conclusion',
            url: SCHAFF.vol3.page('iv.xv'),
            refs: uniqueKeys(cur.refs),
            tradition: TRADITION,
            keywords: ['Articles of Remonstrance', 'Remonstrance', 'Remonstrants', 'Arminian', 'Arminianism', 'Five Arminian Articles'],
          }
        : {
            id: `remonstrance:${n}`,
            title: `The Five Arminian Articles (Remonstrance, 1610), Art. ${ROMAN[n - 1]}`,
            text,
            sourceId: SOURCE_ID,
            locator: `Art. ${ROMAN[n - 1]}`,
            url: SCHAFF.vol3.page('iv.xv'),
            refs: uniqueKeys(cur.refs),
            tradition: TRADITION,
            keywords: ['Articles of Remonstrance', 'Remonstrance', 'Remonstrants', 'Arminian', 'Arminianism', 'Five Arminian Articles', ...SUBJECTS[n]],
          },
    );
    cur = null;
  };
  for (const c of cells) {
    const t = c.text.replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const art = /^Art\.?\s*([IV]+)\.?$/.exec(t);
    if (art) {
      flush();
      const n = ROMAN.indexOf(art[1] as (typeof ROMAN)[number]) + 1;
      if (n < 1) throw new Error(`Remonstrance: unknown article ${art[1]}`);
      cur = { n, texts: [], refs: [] };
      continue;
    }
    if (/^[—–-]+$/.test(t)) {
      flush();
      cur = { n: 'conclusion', texts: [], refs: [] };
      continue;
    }
    if (!cur) continue;
    cur.texts.push(t);
    // CCEL tags “the First Epistle of John ii. 2” (Art. II) as John 2:2
    const refs = scripRefs(c.el).map((r) => (/First Epistle of John ii\. 2/.test(t) && r.book === 'JHN' && r.startChapter === 2 && r.startVerse === 2 ? { ...r, book: '1JN' as const } : r));
    cur.refs.push(...refs);
  }
  flush();
  const nums = docs.filter((x) => x.id !== 'remonstrance:conclusion').map((x) => Number(x.id.split(':')[1]));
  if (nums.join(',') !== '1,2,3,4,5') throw new Error(`Remonstrance: expected Art. I–V, got ${nums.join(',')}`);
  if (!docs.some((x) => x.id === 'remonstrance:conclusion')) throw new Error('Remonstrance: conclusion missing');
  return { name: 'The Five Arminian Articles (Schaff)', documents: docs, urls: [SCHAFF.vol3.xml] };
}
