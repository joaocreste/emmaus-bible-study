/**
 * Integration with the real knowledge base (server/kb over kb/corpus + public/data):
 * a scripted model researches "divorce" and composes a page, citing the evidence ids
 * it finds in the tool results. Checks that real evidence passes the validator and
 * hydrates correctly. Skipped when the corpora are not present.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { InferenceEvent } from '../../../src/inference/protocol';
import { createKnowledgeBase, evidenceFullText } from '../../kb';
import type { RunLog } from '../logs';
import { runCompose } from '../run';
import { FakeModelClient, message, reply, testConfig, toolUse, type ScriptedTurn } from './fakes';
import type { StreamParams } from '../modelClient';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const HAVE_CORPORA = existsSync(join(ROOT, 'kb', 'corpus', 'naves.json')) && existsSync(join(ROOT, 'public', 'data', 'bible'));

/** The ledger id of the first evidence item (in any tool result so far) whose header matches. */
function idFor(params: StreamParams, header: RegExp): string {
  for (const m of params.messages) {
    if (m.role !== 'user' || typeof m.content === 'string') continue;
    for (const b of m.content) {
      if (b.type !== 'tool_result') continue;
      const text = typeof b.content === 'string' ? b.content : '';
      for (const line of text.split('\n')) {
        const hit = /^\[(E\d+)\] (.*)$/.exec(line);
        if (hit && header.test(hit[2])) return hit[1];
      }
    }
  }
  throw new Error(`no evidence item matching ${header}`);
}

/** An exact span of the evidence item's text as the model saw it. */
function textOf(params: StreamParams, id: string): string {
  for (const m of params.messages) {
    if (m.role !== 'user' || typeof m.content === 'string') continue;
    for (const b of m.content) {
      if (b.type !== 'tool_result' || typeof b.content !== 'string') continue;
      const at = b.content.indexOf(`[${id}] `);
      if (at >= 0) return b.content.slice(at).split('\n')[1] ?? '';
    }
  }
  return '';
}

describe.skipIf(!HAVE_CORPORA)('real knowledge base', () => {
  it('a scripted "divorce" composition over real evidence passes the validator', async () => {
    const kb = createKnowledgeBase({ root: ROOT, allowRemote: false, log: () => {} });

    const compose: ScriptedTurn = (params) => {
      const naves = idFor(params, /^Nave’s .*DIVORCE/);
      const matt = idFor(params, /^Matthew 19:3–9 \(BSB\)/);
      const deut = idFor(params, /^Deuteronomy 24:1–4 \(BSB\)/);
      const lexG630 = idFor(params, /G630/);
      const greek = idFor(params, /^Greek text of Matthew 19:3–9/);
      const tyndale = idFor(params, /^Tyndale note on Matthew 19:3 /);
      const calvin = idFor(params, /Calvin/);
      const calvinText = textOf(params, calvin);
      const span = /a question arising out of the liberty of divorce was settled/.exec(calvinText)?.[0] ?? calvinText.split(/[.;]/)[1]?.trim() ?? '';
      return message([
        toolUse('begin_page', {
          title: 'Divorce in the Bible',
          kind: 'topic',
          passage: 'Matthew 19:3–9',
          question: 'What does the Bible say about divorce?',
          summary: { text: 'The Law regulates divorce, and Jesus answers the Pharisees from the Creator’s design.', evidence: [naves, matt, deut] },
        }),
        toolUse('add_section', {
          section: 'key-passages',
          items: [
            { reference: 'Deuteronomy 24:1–4', title: 'The certificate of divorce', note: 'Moses regulates an existing practice.', group: 'The Law', evidence: [naves, deut] },
            { reference: 'Matthew 19:3–9', title: 'Jesus and the Pharisees', note: 'Jesus answers from Genesis.', group: 'Jesus’ teaching', evidence: [naves, matt] },
            { reference: 'Malachi 2:14–16', title: 'The wife of your youth', note: 'Malachi rebukes faithlessness.', group: 'The Prophets', evidence: [naves] },
          ],
        }),
        toolUse('add_section', {
          section: 'original-languages',
          items: [
            { strong: 'G630', english: 'divorce', anchor: { reference: 'Matthew 19:3', phrase: 'divorce' }, significance: 'The verb for dismissing a wife.', evidence: [lexG630] },
            { strong: 'G4202', english: 'sexual immorality', anchor: { reference: 'Matthew 19:9', phrase: 'sexual immorality' }, significance: 'The term of the exception.', evidence: [greek] },
          ],
        }),
        toolUse('add_section', {
          section: 'historical-context',
          items: [{ category: 'jewish-tradition', title: 'Hillel and Shammai', summary: 'Tyndale’s note describes two Pharisaic schools on divorce.', relatedVerses: ['Matthew 19:3'], evidence: [tyndale] }],
        }),
        toolUse('add_section', {
          section: 'commentary',
          voices: [
            { evidence: tyndale, mode: 'summary', summary: 'Tyndale’s note sets the question against the Hillel–Shammai debate.' },
            { evidence: calvin, mode: 'quote', quote: span },
          ],
        }),
      ]);
    };
    const finish: ScriptedTurn = (params) => {
      const naves = idFor(params, /^Nave’s .*DIVORCE/);
      return message([toolUse('finish_page', { opening: { text: 'A page on divorce from the passages Nave’s lists.', evidence: [naves] }, concepts: [], suggestedQuestions: ['What did Moses permit?'] })]);
    };
    const client = new FakeModelClient([
      reply([toolUse('find_topics', { query: 'divorce' }), toolUse('lexicon', { query: 'divorce' }), toolUse('search_knowledge', { query: 'divorce', kinds: ['dictionary'] })]),
      reply([
        toolUse('read_passage', { reference: 'Matthew 19:3–9' }),
        toolUse('read_passage', { reference: 'Deuteronomy 24:1–4' }),
        toolUse('read_passage', { reference: 'Malachi 2:14–16' }),
        toolUse('commentary', { reference: 'Matthew 19:3–9' }),
        toolUse('original_text', { reference: 'Matthew 19:3–9' }),
      ]),
      compose,
      finish,
    ]);

    const events: InferenceEvent[] = [];
    const logs: RunLog[] = [];
    await runCompose(
      { query: 'divorce', translation: 'BSB' },
      { kb, client, config: testConfig(), fullText: evidenceFullText, writeLog: async (l) => (logs.push(l), null) },
      (e) => events.push(e),
      new AbortController().signal,
    );

    expect(events.filter((e) => e.type === 'error')).toEqual([]);
    const rejected = logs[0].decisions.flatMap((d) => d.rejected.map((r) => `${d.section ?? d.tool}: ${r.item} — ${r.reason}`));
    expect(rejected).toEqual([]);
    const final = events.filter((e) => e.type === 'study').at(-1);
    if (final?.type !== 'study') throw new Error('no study');
    expect(final.complete).toBe(true);
    const study = final.study;
    expect(study.topic?.keyPassages).toHaveLength(3);
    expect(study.keyWords.map((k) => [k.strong, k.lemma])).toEqual([
      ['G630', 'ἀπολύω'],
      ['G4202', 'πορνεία'],
    ]);
    expect(study.keyWords[0].anchors[0].phrases.BSB).toBe('divorce');
    expect(study.commentary.map((c) => [c.authorId, c.kind])).toEqual([
      ['tyndale-house-publishers', 'summary'],
      ['calvin', 'quotation'],
    ]);
    expect(study.commentary[1].provenance.verification).toBe('verified');
    expect(study.sourceIds).toEqual(expect.arrayContaining(['naves-topical-bible', 'bsb', 'tyndale-open-study-notes', 'calvin-commentaries', 'stepbible-tbesg']));
  }, 180_000);
});
