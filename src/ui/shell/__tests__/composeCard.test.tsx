import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { PipelineStep } from '../../../domain/models';
import { formatRef } from '../../../domain/reference';
import { I18nProvider } from '../../../i18n/I18nProvider';
import { ComposeCardView } from '../ComposeCard';
import { composeStepLines, composeStepText, elapsedLabel, type StepFormat } from '../composeSteps';

const f: StepFormat = {
  t: (key, params) => `${key}${params ? JSON.stringify(params) : ''}`,
  ref: (p) => formatRef(p, 'long', 'pt'),
  book: (id) => `book:${id}`,
  section: (id) => `section:${id}`,
};
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const MAT19 = { book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 9 };
const DEU24 = { book: 'DEU', startChapter: 24, startVerse: 1, endChapter: 24, endVerse: 4 };

/** Steps as the server streams them: technical detail for the trace, `reader` for the reader. */
const STEPS: PipelineStep[] = [
  { stage: 'Model', detail: 'claude-opus-5 is planning the research for “…”', reader: { kind: 'planning' } },
  { stage: 'Search', detail: 'Searching the knowledge base for “divorce abuse”', reader: { kind: 'search' } },
  { stage: 'Search', detail: 'Searching Baptist texts for “divorce”', reader: { kind: 'search' } },
  { stage: 'Scripture', detail: 'Reading Deuteronomy 24:1–4; Matthew 19:3–9 (BLIVRE)', reader: { kind: 'scripture', refs: [DEU24, MAT19] } },
  { stage: 'Lexicon', detail: 'Looking up H3748 in the lexicon', reader: { kind: 'words' } },
  { stage: 'Budget', detail: 'Research budget reached (16 lookups) — composing from what was found', reader: { kind: 'writing' } },
  { stage: 'Check', detail: 'The page header did not pass the source checks — the model is repairing it' },
  { stage: 'Model', detail: 'The request was served by the fallback model (claude-sonnet-5)' },
];

describe('live steps for the reader', () => {
  it('says what each step does for the study, with the passages being read — never models, budgets, lexicon numbers or checks', () => {
    const lines = composeStepLines(STEPS, f);
    expect(lines).toEqual([
      'compose.step.planning',
      'compose.step.search', // two searches in a row count once
      'compose.step.scripture{"refs":"Deuteronômio 24:1–4; Mateus 19:3–9"}',
      'compose.step.words',
      'compose.step.writing',
    ]);
    expect(lines.join(' ')).not.toMatch(/claude|budget|lookups|H3748|check|fallback/i);
  });

  it('names the page, the section that landed and at most three passages', () => {
    expect(composeStepText({ stage: 'Compose', detail: 'Started the page “O divórcio”', reader: { kind: 'writing', title: 'O divórcio' } }, f)).toBe('compose.step.writingTitle{"title":"O divórcio"}');
    expect(composeStepText({ stage: 'Compose', detail: 'Added Key passages — 8 passages', reader: { kind: 'section', section: 'key-passages' } }, f)).toBe('compose.step.section{"section":"section:key-passages"}');
    expect(composeStepText({ stage: 'Introduction', detail: 'x', reader: { kind: 'introduction', book: 'MAL' } }, f)).toBe('compose.step.introduction{"book":"book:MAL"}');
    const four = composeStepText({ stage: 'Scripture', detail: 'x', reader: { kind: 'scripture', refs: [DEU24, MAT19, DEU24, MAT19] } }, f);
    expect(four).toBe('compose.step.scripture{"refs":"compose.step.andMore{\\"refs\\":\\"Deuteronômio 24:1–4; Mateus 19:3–9; Deuteronômio 24:1–4\\",\\"count\\":1}"}');
    expect(composeStepText({ stage: 'Cache', detail: 'Served from the page cache' }, f)).toBeNull();
  });

  it('formats the elapsed time', () => {
    expect(elapsedLabel(0)).toBe('0:00');
    expect(elapsedLabel(42_400)).toBe('0:42');
    expect(elapsedLabel(125_000)).toBe('2:05');
  });
});

describe('compose card', () => {
  it('says a study is being composed, for which question, what is happening now and what came before', () => {
    const html = renderToStaticMarkup(
      <I18nProvider locale="pt">
        <ComposeCardView question="Em um relacionamento abusivo, é possível o divórcio?" steps={STEPS} />
      </I18nProvider>,
    );
    const out = text(html);
    expect(out).toContain('Gerando o seu estudo');
    expect(out).toContain('“Em um relacionamento abusivo, é possível o divórcio?”');
    // newest first
    expect(out).toMatch(/Escrevendo o estudo….*Estudando as palavras-chave no hebraico e no grego….*Lendo Deuteronômio 24:1–4; Mateus 19:3–9/);
    expect(out).not.toMatch(/claude|budget|H3748|source checks/i);
    expect(out).toContain('0:00');
  });

  it('starts with a first step before the server sends any', () => {
    const out = text(renderToStaticMarkup(<I18nProvider locale="en"><ComposeCardView question={null} steps={[]} /></I18nProvider>));
    expect(out).toContain('Composing your study');
    expect(out).toContain('Getting ready to study your question…');
  });
});
