/**
 * John Wesley's doctrinal sermons, in the text and numbering of the Jackson edition (1872) as
 * published by the Christian Classics Ethereal Library ("Sermons on Several Occasions", ThML).
 * Six standard sermons on salvation, justification, assurance, perfection and predestination.
 *
 * Each sermon is split at paragraph boundaries into parts of at most ~2,600 characters (Wesley's
 * own section and paragraph numbers stay in the text). Footnotes (Jackson's
 * and the CCEL editor's) are left out. Refs: the sermon text plus the Scripture references CCEL
 * tagged, kept when the printed label agrees with the tag.
 */
import { splitSentences, titleCase, type KbDocument, type Part } from '../lib/corpus.ts';
import { byTag, findAll, isEl, type El } from '../lib/html.ts';
import { refsFromOsis, uniqueKeys } from '../lib/refs.ts';
import { cleanText, div, loadThml, scripRefs } from '../lib/thml.ts';
import type { PassageRef } from '../../../../src/domain/models.ts';

const XML = 'https://ccel.org/ccel/w/wesley/sermons.xml';
const pageUrl = (id: string) => `https://ccel.org/ccel/wesley/sermons/sermons.${id}.html`;
const TRADITION = 'Methodist';
const MAX_CHARS = 2600;

const SERMONS: { id: string; keywords: string[] }[] = [
  { id: 'v.i', keywords: ['salvation by faith', 'saving faith', 'justification', 'assurance'] },
  { id: 'v.v', keywords: ['justification by faith', 'justification', 'imputed righteousness', 'pardon'] },
  { id: 'v.x', keywords: ['witness of the Spirit', 'assurance', 'testimony of the Spirit', 'adoption'] },
  { id: 'v.xl', keywords: ['Christian perfection', 'entire sanctification', 'holiness', 'perfect love', 'sinless perfection'] },
  { id: 'v.xliii', keywords: ['way of salvation', 'faith', 'repentance', 'sanctification', 'justification', 'Christian perfection'] },
  { id: 'viii.ii', keywords: ['free grace', 'predestination', 'election', 'reprobation', 'Calvinism', 'Arminianism', 'universal grace'] },
];

interface Para {
  text: string;
  refs: PassageRef[];
}

export async function buildWesleySermons(): Promise<Part> {
  const root = await loadThml(XML);
  const docs: KbDocument[] = [];
  for (const s of SERMONS) {
    const d = div(root, s.id);
    const title = (d.attrs.title ?? '').replace(/\.$/, '');
    const h2s = findAll(d, byTag('h2')).map((h) => cleanText(h).replace(/\s+/g, ' ').trim());
    const num = Number(/^Sermon (\d+)$/.exec(h2s[0] ?? '')?.[1]);
    // CCEL sets some titles in capitals ("THE WITNESS OF THE SPIRIT") or capitalises "By"
    const rawTitle = h2s[1] ?? title;
    const sermonTitle = /[a-z]/.test(rawTitle) ? rawTitle.replace(/(?<=\s)(By|Of|The|And|In|On|To)(?=\s)/g, (w) => w.toLowerCase()) : titleCase(rawTitle);
    if (!num || !sermonTitle) throw new Error(`Wesley ${s.id}: sermon number/title not found (${h2s.join(' | ')})`);
    // the sermon's text (scripCom) and its printed heading
    const com = d.children.find((c): c is El => isEl(c) && c.tag.toLowerCase() === 'scripcom');
    const textRefs = com?.attrs.osisref ? refsFromOsis(com.attrs.osisref) : [];
    const textLabel = findAll(d, (el) => el.tag === 'h3').map((h) => cleanText(h).replace(/\s+/g, ' ').replace(/\.$/, '').trim())[0] ?? '';
    const paras: Para[] = [];
    for (const el of d.children.filter((c): c is El => isEl(c) && (c.tag === 'p' || c.tag === 'blockquote'))) {
      const t = cleanText(el).replace(/[ \t]*\n[ \t]*/g, ' ').replace(/\s+/g, ' ').trim();
      if (!t) continue;
      for (const piece of splitSentences(t, MAX_CHARS)) paras.push({ text: piece, refs: scripRefs(el, {}, { inlineOnly: true }) });
    }
    if (paras.length < 10) throw new Error(`Wesley ${s.id}: only ${paras.length} paragraphs`);
    // group into parts
    const parts: Para[][] = [];
    let cur: Para[] = [];
    let size = 0;
    for (const p of paras) {
      if (cur.length && size + p.text.length > MAX_CHARS) {
        parts.push(cur);
        cur = [];
        size = 0;
      }
      cur.push(p);
      size += p.text.length;
    }
    if (cur.length) parts.push(cur);
    parts.forEach((ps, i) => {
      docs.push({
        id: `wesley-sermon:${num}${parts.length > 1 ? `:${i + 1}` : ''}`,
        title: `John Wesley, Sermon ${num}: ${sermonTitle}${parts.length > 1 ? ` (part ${i + 1})` : ''}`,
        text: ps.map((p) => p.text).join('\n\n'),
        sourceId: 'wesley-sermons',
        authorId: 'wesley',
        locator: `Sermon ${num}${textLabel ? ` (on ${textLabel})` : ''}${parts.length > 1 ? `, part ${i + 1} of ${parts.length}` : ''}`,
        url: pageUrl(s.id),
        refs: uniqueKeys([...(i === 0 ? textRefs : []), ...ps.flatMap((p) => p.refs)]),
        tradition: TRADITION,
        keywords: ['John Wesley', 'Wesley', 'sermon', 'Sermons on Several Occasions', 'Methodist', 'Wesleyan', 'Arminian', sermonTitle, ...s.keywords],
      });
    });
  }
  return { name: 'Wesley, doctrinal sermons (CCEL, Jackson numbering)', documents: docs, urls: [XML] };
}
