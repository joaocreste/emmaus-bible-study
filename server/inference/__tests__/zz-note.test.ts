import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createKnowledgeBase } from '../../kb';
import { knowledgeBaseNote } from '../prompt';
const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
it.skipIf(!process.env.NOTE_OUT)('note', async () => {
  const kb = createKnowledgeBase({ root: ROOT, allowRemote: false, log: () => {} });
  await kb.ready();
  writeFileSync(process.env.NOTE_OUT!, knowledgeBaseNote(kb.holdings()) ?? '');
}, 240000);
