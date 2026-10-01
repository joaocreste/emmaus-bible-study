import type { PassageRef, PipelineStep, ReaderStep, SectionId } from '../../domain/models';
import type { MessageKey } from '../../i18n/catalog';
import type { Params } from '../../i18n/translate';

type Key = MessageKey<'shell'>;

/** References named in one line before "and N more". */
const MAX_REFS = 3;

export interface StepFormat {
  t: (key: Key, params?: Params) => string;
  /** a passage in the reader's language ("Mateus 19:3–9") */
  ref: (passage: PassageRef) => string;
  /** a book's name in the reader's language ("Deuteronômio") */
  book: (id: string) => string;
  /** a dashboard section's name in the reader's language ("Passagens-chave") */
  section: (id: SectionId) => string;
}

/**
 * What the reader sees for a live step while a study is composed: what the step does for their
 * study, in their language, with the Bible passages being read — never model names, research
 * budgets, lexicon numbers or source checks. Null for steps that carry nothing for the reader
 * (they stay in the trace and the logs).
 */
export function composeStepText(step: PipelineStep, f: StepFormat): string | null {
  const r: ReaderStep | undefined = step.reader;
  if (!r) return null;
  switch (r.kind) {
    case 'planning':
      return f.t('compose.step.planning');
    case 'topics':
      return f.t('compose.step.topics');
    case 'search':
      return f.t('compose.step.search');
    case 'sources':
      return f.t('compose.step.sources');
    case 'words':
      return f.t('compose.step.words');
    case 'scripture':
      return r.refs.length ? f.t('compose.step.scripture', { refs: refList(r.refs, f) }) : f.t('compose.step.scriptureAny');
    case 'original':
      return r.refs.length ? f.t('compose.step.original', { refs: refList(r.refs, f) }) : f.t('compose.step.words');
    case 'commentary':
      return f.t('compose.step.commentary', { refs: refList(r.refs, f) });
    case 'cross-references':
      return f.t('compose.step.crossReferences', { refs: refList(r.refs, f) });
    case 'introduction':
      return f.t('compose.step.introduction', { book: f.book(r.book) });
    case 'writing':
      return r.title ? f.t('compose.step.writingTitle', { title: r.title }) : f.t('compose.step.writing');
    case 'section':
      return f.t('compose.step.section', { section: f.section(r.section) });
    default:
      return null;
  }
}

/** The reader-facing lines of a list of steps, oldest first; consecutive repeats count once. */
export function composeStepLines(steps: readonly PipelineStep[], f: StepFormat): string[] {
  const lines: string[] = [];
  for (const s of steps) {
    const line = composeStepText(s, f);
    if (line && line !== lines[lines.length - 1]) lines.push(line);
  }
  return lines;
}

function refList(refs: readonly PassageRef[], f: StepFormat): string {
  const shown = refs.slice(0, MAX_REFS).map(f.ref).join('; ');
  return refs.length > MAX_REFS ? f.t('compose.step.andMore', { refs: shown, count: refs.length - MAX_REFS }) : shown;
}

/** "0:42", "2:05". */
export function elapsedLabel(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
