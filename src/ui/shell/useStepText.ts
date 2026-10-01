import { useMemo } from 'react';
import { bookDisplayName } from '../../domain/books';
import type { BookId, PipelineStep } from '../../domain/models';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { composeStepLines, composeStepText, type StepFormat } from './composeSteps';

/** Live pipeline steps as the reader sees them, in their language (see composeStepText). */
export function useStepText(): { text: (step: PipelineStep) => string | null; lines: (steps: readonly PipelineStep[]) => string[] } {
  const t = useT('shell');
  const ts = useT('study');
  const { locale, ref } = useI18n();
  return useMemo(() => {
    const f: StepFormat = {
      t,
      ref: (p) => ref(p),
      book: (id) => bookDisplayName(id as BookId, locale),
      section: (id) => ts(`section.${id}.title` as Parameters<typeof ts>[0]),
    };
    return { text: (step) => composeStepText(step, f), lines: (steps) => composeStepLines(steps, f) };
  }, [t, ts, locale, ref]);
}
