import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createKnowledgeBase } from '../../kb';
const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const OUT = process.env.KBPROBE_OUT ?? '/tmp/kbprobe.txt';
it.skipIf(!process.env.KBPROBE)('kbprobe', async () => {
  const kb = createKnowledgeBase({ root: ROOT, allowRemote: false, log: () => {} });
  await kb.ready();
  const out: string[] = [];
  const show = (label: string, list: { title: string; kind: string; tradition?: string }[]) => out.push(`## ${label}\n${list.map((e) => `- [${e.kind}${e.tradition ? '/' + e.tradition : ''}] ${e.title}`).join('\n')}`);
  const queries = JSON.parse(process.env.KBPROBE ?? '[]') as [string, string, string[]?][];
  for (const [fn, q, kinds] of queries) {
    if (fn === 'topics') show(`topics(${q})`, await kb.topics(q, 6));
    else if (fn === 'lexicon') show(`lexicon(${q})`, await kb.lexicon(q, 6));
    else if (fn === 'commentary') {
      const { parseReference } = await import('../../../src/domain/reference');
      const list = await kb.commentary(parseReference(q)!, kinds as string[] | undefined);
      out.push(`## commentary(${q})\n${list.map((e) => `--- ${e.title}\n${e.text}`).join('\n')}`);
    } else if (fn === 'holdings') out.push(JSON.stringify(kb.holdings(), null, 1).slice(0, 4000));
    else show(`search(${q}, ${kinds?.join(',') ?? ''})`, await kb.search(q, { kinds: kinds as never, limit: 8 }));
  }
  writeFileSync(OUT, out.join('\n\n'));
}, 240000);
