/**
 * SCRATCH (not part of the suite): replay recorded compose/answer runs through the current
 * validator and report what it now decides differently — E3 of the eval harness: every
 * configuration's logs scored under one pinned validator. Run with
 * REPLAY_LOGS=<file|dir,…> (a directory: every RunLog under it, e.g. .kb-cache/eval/<label>)
 * and REPLAY_OUT=<report.json>; `node scripts/eval/score.ts … --replay <report.json>` reads it.
 *
 * Each run is checked as it ran: in its page language and translation, against the knowledge
 * base's holdings, with the full text behind excerpts. An answer run reopens its page from
 * scripts/eval/fixtures or .kb-cache/pages by study id (REPLAY_STUDY=<page or study JSON> overrides).
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { it } from 'vitest';
import type { Study, TranslationId } from '../../../src/domain/models';
import { BIBLE_VERSIONS } from '../../../src/domain/translations';
import type { Locale } from '../../../src/i18n/locales';
import type { EvidenceDraft } from '../../../src/inference/protocol';
import { createKnowledgeBase, evidenceFullText } from '../../kb';
import { AddSectionInput } from '../composeTools';
import { EvidenceLedger } from '../ledger';
import { PageBuilder } from '../page';
import { RefChecker } from '../refs';
import { authorOf, Validator } from '../validate';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const files = (process.env.REPLAY_LOGS ?? '').split(',').filter(Boolean).flatMap(runLogs);
const out = process.env.REPLAY_OUT ?? '/tmp/replay.json';

interface ReplayRow {
  turn: number;
  tool: string;
  section?: string;
  oldAccepted?: number;
  newAccepted: number;
  newRejections: string[];
  goneRejections: string[];
  newWarnings: string[];
}

/** A RunLog file, or every RunLog under a directory (manifests and page sidecars skipped). */
function runLogs(path: string): string[] {
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path)
    .sort()
    .flatMap((name) => {
      const p = join(path, name);
      if (statSync(p).isDirectory()) return runLogs(p);
      return name.endsWith('.json') && name !== 'manifest.json' && !name.endsWith('.page.json') ? [p] : [];
    });
}

/** The page an answer run was asked about: REPLAY_STUDY, else the fixture or cached page with its id. */
function answerStudy(studyId: string | undefined): Study | null {
  const read = (file: string): Study | null => {
    try {
      const data = JSON.parse(readFileSync(file, 'utf8')) as { study?: Study } & Partial<Study>;
      return data.study ?? (data.id ? (data as Study) : null);
    } catch {
      return null;
    }
  };
  if (process.env.REPLAY_STUDY) return read(process.env.REPLAY_STUDY);
  for (const dir of [join(ROOT, 'scripts', 'eval', 'fixtures'), join(ROOT, '.kb-cache', 'pages')]) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).sort()) {
      const study = name.endsWith('.json') ? read(join(dir, name)) : null;
      if (study && study.id === studyId) return study;
    }
  }
  return null;
}

it.skipIf(!files.length)('replay', async () => {
  const kb = createKnowledgeBase({ root: ROOT, allowRemote: false, log: () => {} });
  await kb.ready();
  const providers = kb.providers;
  const holdings = kb.holdings();
  const authorName = (e: Parameters<typeof authorOf>[0]) => {
    const id = authorOf(e, providers);
    try {
      return id ? providers.sources.getAuthor(id)?.name : undefined;
    } catch {
      return undefined;
    }
  };
  const report: unknown[] = [];
  for (const file of files) {
    const log = JSON.parse(readFileSync(file, 'utf8'));
    if (log.cached || !Array.isArray(log.toolCalls)) continue;
    const translation: TranslationId = log.request?.translation ?? 'BSB';
    // answer logs before the eval harness record no locale: the translation's language is the page's
    const locale: Locale = log.eval?.locale ?? log.request?.locale ?? BIBLE_VERSIONS.find((v) => v.id === translation)?.language ?? 'en';
    const readerText = log.request?.query ?? log.request?.question ?? '';
    const study = log.flow === 'answer' ? answerStudy(log.request?.studyId) : null;
    if (log.flow === 'answer' && !study) {
      report.push({ file, locale, translation, skipped: `page ${log.request?.studyId} not found (set REPLAY_STUDY)`, rows: [] });
      continue;
    }
    const ledger = new EvidenceLedger({ fullText: evidenceFullText, authorName });
    const refs = new RefChecker(providers.scripture, locale);
    const builder = study
      ? new PageBuilder(providers, study, { begun: true, idPrefix: 'replay' })
      : new PageBuilder(providers, PageBuilder.shell('replay', { model: 'replay', query: readerText, createdAt: 0, evidenceCount: 0, retrievalCalls: 0 }), { begun: false });
    const v = new Validator({ ledger, refs, providers, ...(holdings ? { holdings } : {}), ...(readerText ? { readerText } : {}), translation, locale }, builder.nextId);
    const byId = new Map<string, EvidenceDraft>((log.ledger as (EvidenceDraft & { id: string })[]).map((e) => [e.id, e]));
    const oldDecisions = [...log.decisions];
    const rows: ReplayRow[] = [];
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
      const oldReasons = new Set<string>((old?.rejected ?? []).map((x: { item: string; reason: string }) => `${x.item}: ${x.reason}`));
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
    const summary = {
      oldAccepted: rows.reduce((n, r) => n + (r.oldAccepted ?? 0), 0),
      newAccepted: rows.reduce((n, r) => n + r.newAccepted, 0),
      newRejections: rows.reduce((n, r) => n + r.newRejections.length, 0),
    };
    report.push({ file, locale, translation, ...(study ? { study: study.id } : {}), summary, rows });
  }
  writeFileSync(out, JSON.stringify(report, null, 1));
}, 600_000);
