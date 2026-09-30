/**
 * SCRATCH (not part of the suite): replay recorded compose/answer runs through the current
 * validator and report what it now decides differently. Run with REPLAY_LOGS=<file,file>.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { it } from 'vitest';
import type { Study } from '../../../src/domain/models';
import type { EvidenceDraft } from '../../../src/inference/protocol';
import { AddSectionInput } from '../composeTools';
import { EvidenceLedger } from '../ledger';
import { PageBuilder } from '../page';
import { RefChecker } from '../refs';
import { Validator } from '../validate';
import { realProviders } from './fakes';

const files = (process.env.REPLAY_LOGS ?? '').split(',').filter(Boolean);
const out = process.env.REPLAY_OUT ?? '/tmp/replay.json';

it.skipIf(!files.length)('replay', async () => {
  const providers = realProviders();
  const report: unknown[] = [];
  for (const file of files) {
    const log = JSON.parse(readFileSync(file, 'utf8'));
    const ledger = new EvidenceLedger({});
    const refs = new RefChecker(providers.scripture);
    const readerText = log.request?.query ?? log.request?.question ?? '';
    const study: Study | null = log.flow === 'answer' && process.env.REPLAY_STUDY ? JSON.parse(readFileSync(process.env.REPLAY_STUDY, 'utf8')) : null;
    const builder = study
      ? new PageBuilder(providers, study, { begun: true, idPrefix: 'replay' })
      : new PageBuilder(providers, PageBuilder.shell('replay', { model: 'replay', query: readerText, createdAt: 0, evidenceCount: 0, retrievalCalls: 0 }), { begun: false });
    const v = new Validator({ ledger, refs, providers, readerText }, builder.nextId);
    const byId = new Map<string, EvidenceDraft>((log.ledger as (EvidenceDraft & { id: string })[]).map((e) => [e.id, e]));
    const oldDecisions = [...log.decisions];
    const rows: unknown[] = [];
    for (const call of log.toolCalls) {
      if (call.evidence?.length) {
        for (const id of call.evidence) {
          const e = byId.get(id);
          if (e && !ledger.get(id)) {
            const { id: _id, ...draft } = e as EvidenceDraft & { id: string };
            const entry = ledger.add(draft as EvidenceDraft);
            ledger.render([entry], 1e9);
          }
        }
        continue;
      }
      let decision: { accepted: number; rejected: { item: string; reason: string }[]; warnings: string[] } | null = null;
      if (call.name === 'begin_page') {
        const r = await v.beginPage(call.input);
        if (r.page) builder.begin(r.page);
        decision = r;
      } else if (call.name === 'add_section') {
        const parsed = AddSectionInput.safeParse(call.input);
        if (!parsed.success) continue;
        const mode = log.flow === 'answer' ? 'append' : (parsed.data.mode ?? 'replace');
        const r = await v.section(parsed.data, builder.info(), mode);
        if (r.payload) builder.apply(r.payload, {}, mode);
        decision = r;
      } else if (call.name === 'finish_page') {
        const r = await v.finish(call.input, builder.info());
        if (r.opening) builder.finish(r, v.itemEvidence);
        decision = r;
      } else if (call.name === 'reply') {
        decision = await v.reply(call.input, { page: builder.info(), readerText });
      } else continue;
      const old = oldDecisions.find((d) => d.turn === call.turn && d.tool === call.name && (!d.section || d.section === (call.input as { section?: string }).section));
      if (old) oldDecisions.splice(oldDecisions.indexOf(old), 1);
      const oldReasons = new Set((old?.rejected ?? []).map((x: { item: string; reason: string }) => `${x.item}: ${x.reason}`));
      const oldWarn = new Set(old?.warnings ?? []);
      rows.push({
        turn: call.turn,
        tool: call.name,
        section: (call.input as { section?: string }).section,
        oldAccepted: old?.accepted,
        newAccepted: decision.accepted,
        newRejections: decision.rejected.map((x) => `${x.item}: ${x.reason}`).filter((x) => !oldReasons.has(x)),
        goneRejections: [...oldReasons].filter((x) => !decision!.rejected.some((y) => `${y.item}: ${y.reason}` === x)),
        newWarnings: decision.warnings.filter((w) => !oldWarn.has(w)),
      });
    }
    report.push({ file, rows });
  }
  writeFileSync(out, JSON.stringify(report, null, 1));
}, 300000);
