import { fileURLToPath } from 'node:url';
import { it } from 'vitest';
import { loadEnv } from 'vite';
import { getKnowledgeBase, evidenceFullText } from '../../kb';
import { loadInferenceConfig } from '../config';
import { createAnthropicModelClient } from '../modelClient';
import { runCompose } from '../run';
import { createRunLogWriter, type RunLog } from '../logs';
import type { InferenceEvent } from '../../../src/inference/protocol';

/** the repository root (this file is server/inference/__tests__) */
const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
/** This test bills the API: it runs only when EMMAUS_LIVE is set to something other than "off" and a credential is found. */
const LIVE = (process.env.EMMAUS_LIVE ?? '').trim().toLowerCase();
const liveConfig =
  LIVE && LIVE !== 'off' ? loadInferenceConfig({ ...loadEnv('development', ROOT, ''), EMMAUS_EFFORT: 'medium', EMMAUS_MAX_RESEARCH_CALLS: '6' }, ROOT) : null;

it.skipIf(!liveConfig?.credential.source)('live compose smoke test', async () => {
  const config = liveConfig!;
  console.log('credential source:', config.credential.source, 'model:', config.model, 'effort:', config.effort);
  const kb = getKnowledgeBase(ROOT, { log: () => {} });
  await kb.ready();
  const events: InferenceEvent[] = [];
  const logs: RunLog[] = [];
  const write = createRunLogWriter(`${ROOT}/.kb-cache/logs`);
  const t0 = Date.now();
  await runCompose({ query: 'Philippians 4:6-7', translation: 'BSB', regenerate: true }, { kb, client: createAnthropicModelClient(config), config, fullText: evidenceFullText, writeLog: async (l) => { logs.push(l); return write(l); } }, (e) => {
    events.push(e);
    const at = ((Date.now() - t0) / 1000).toFixed(1);
    if (e.type === 'progress') console.log(at, 'progress', e.step.stage, '|', e.step.detail);
    else if (e.type === 'study') console.log(at, 'study', e.complete, e.study.layout?.sections.map((s) => s.id).join(','));
    else if (e.type === 'error') console.log(at, 'ERROR', e.code, e.message);
    else console.log(at, e.type);
  }, new AbortController().signal);
  const log = logs[0];
  console.log('end', JSON.stringify(log.outcome), 'turns', log.turns.length, 'usage', JSON.stringify(log.usage));
  for (const t of log.turns) console.log(' turn', t.turn, t.stopReason, t.model, JSON.stringify(t.usage), t.toolUses.map((u) => u.name).join(','), t.durationMs, 'ms');
  for (const d of log.decisions) console.log(' decision', d.tool, d.section ?? '', 'accepted', d.accepted, 'rejected', JSON.stringify(d.rejected), 'warnings', JSON.stringify(d.warnings).slice(0, 600));
  const final = events.filter((e) => e.type === 'study').at(-1);
  if (final?.type === 'study') {
    const s = final.study;
    console.log('STUDY', s.id, s.kind, s.title, JSON.stringify(s.passage), 'xrefs', s.crossReferences.length, 'kw', s.keyWords.map((k) => `${k.strong} ${k.lemma} ${k.anchors.length}`).join('; '), 'ctx', s.context.length, 'lit', !!s.literary, 'th', s.theology.length, 'persp', s.perspectives.length, 'voices', s.commentary.map((c) => `${c.authorId}:${c.kind}`).join(','), 'concepts', s.concepts.length);
    console.log('OPENING', s.opening?.text);
    console.log('XREFS', JSON.stringify(s.crossReferences.map((x) => [x.title, x.relationship, x.explanation.text])));
  }
  const r = events.find((e) => e.type === 'reply');
  if (r?.type === 'reply') console.log('REPLY', JSON.stringify(r.reply.blocks));
}, 600_000);
