import { describe, expect, it } from 'vitest';
import type { ChatMessage } from '../../../domain/models';
import { withDividers } from '../chatLog';
import { PIPELINE_STEPS, stepsFor } from '../thinkingSteps';

const msg = (id: string, studyId?: string): ChatMessage => ({ id, role: id.startsWith('u') ? 'user' : 'assistant', text: id, createdAt: 0, ...(studyId ? { studyId } : {}) });

describe('withDividers', () => {
  const titles = { r8: 'Romans 8', p23: 'Psalm 23' };

  it('adds no divider before the first study of a conversation', () => {
    const items = withDividers([msg('u1', 'r8'), msg('a1', 'r8')], titles);
    expect(items.every((i) => i.type === 'message')).toBe(true);
  });

  it('adds a divider where the study changes, and after a study-less greeting', () => {
    const items = withDividers([msg('u0'), msg('a0'), msg('u1', 'r8'), msg('a1', 'r8'), msg('u2', 'p23'), msg('a2', 'p23')], titles);
    const dividers = items.filter((i) => i.type === 'divider');
    expect(dividers.map((d) => (d.type === 'divider' ? d.title : ''))).toEqual(['Romans 8', 'Psalm 23']);
    expect(items[2].type).toBe('divider');
  });
});

describe('stepsFor', () => {
  it('starts with the step that matches the question', () => {
    expect(stepsFor('What is the Greek word behind grace?')[0]).toBe('Consulting the lexicon…');
    expect(stepsFor('Where else does Paul talk about this?')[0]).toBe('Gathering cross-references…');
    expect(stepsFor('What did Calvin say about this?')[0]).toBe('Weighing commentators…');
    expect(stepsFor('Romans 8')[0]).toBe('Identifying the passage…');
    expect(stepsFor('Forgiveness')[0]).toBe('Finding the key passages…');
  });

  it('keeps every pipeline step exactly once', () => {
    const steps = stepsFor('Romans 8');
    expect(new Set(steps).size).toBe(steps.length);
    for (const s of PIPELINE_STEPS) expect(steps).toContain(s);
  });
});

describe('stepsFor — other languages', () => {
  it('labels the steps in the reader’s language', () => {
    expect(stepsFor('Qual é a palavra grega por trás de graça?', 'pt')[0]).toBe('Consultando o léxico…');
    expect(stepsFor('¿Dónde más habla Pablo de esto?', 'es')[0]).toBe('Reuniendo referencias cruzadas…');
    expect(stepsFor('Qu’a dit Calvin à ce sujet ?', 'fr')[0]).toBe('Examen des commentateurs…');
    expect(stepsFor('Perdão', 'pt')[0]).toBe('Encontrando as passagens-chave…');
  });

  it('still understands English questions in another interface language', () => {
    expect(stepsFor('What is the Greek word behind grace?', 'fr')[0]).toBe('Consultation du lexique…');
  });

  it('does not read the French “comment” (how) as a commentary request', () => {
    expect(stepsFor('Comment prier ?', 'fr')[0]).toBe('Recherche des passages clés…');
  });

  it('keeps every step exactly once in every language', () => {
    for (const locale of ['pt', 'es', 'fr'] as const) {
      const steps = stepsFor('Romanos 8', locale);
      expect(new Set(steps).size).toBe(steps.length);
      for (const s of stepsFor('', locale)) expect(steps).toContain(s); // the five pipeline steps, in that language
    }
  });
});

describe('withDividers — localized fallback title', () => {
  it('names an unknown study with the caller’s label', () => {
    const items = withDividers([msg('u0', 'x'), msg('a0', 'x'), msg('u1', 'y')], {}, 'Novo estudo');
    expect(items.find((i) => i.type === 'divider')).toMatchObject({ title: 'Novo estudo' });
  });
});
