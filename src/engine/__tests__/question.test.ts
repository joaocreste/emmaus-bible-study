import { describe, expect, it } from 'vitest';
import { generatedStudy } from '../../inference/__tests__/fakes';
import { asksNewQuestion, isComplexQuestion, isMultiPartQuestion, pageCoverage, questionSubstance } from '../question';
import type { Intent } from '../types';

const ABUSE_PT = 'Em um relacionamento abusivo, sem parceria, é possível o divórcio e pensar em um novo casamento?';
const unknown: Intent = { kind: 'unknown', confidence: 0.2, slots: {} };

describe('complex questions', () => {
  it('recognises questions with several parts, in the four languages', () => {
    for (const q of [
      ABUSE_PT,
      'Is divorce allowed in an abusive marriage, and can I remarry?',
      'O que a Bíblia diz sobre depressão e fé quando Deus parece distante?',
      '¿Puede un cristiano divorciarse si su cónyuge lo abandona y volver a casarse?',
      'Peut-on se remarier après un divorce causé par la violence du conjoint ?',
    ]) {
      expect(isComplexQuestion(q), q).toBe(true);
    }
  });

  it('leaves topics, short questions and questions about the open page alone', () => {
    for (const q of [
      'divorce',
      'Romans 8',
      'Is it wrong to be rich?',
      'What happens when we die?',
      'What did Tim Keller say about divorce?',
      'O que a igreja católica ensina sobre o divórcio?', // "o" is the article here, not Spanish "or"
      'How did the first readers understand this passage and its promise of rest?',
      'Divorce, remarriage, abuse, desertion and adultery', // a list of subjects, not a question
    ]) {
      expect(isComplexQuestion(q), q).toBe(false);
    }
  });

  it('drops the question frame from its substance', () => {
    expect(questionSubstance(ABUSE_PT)).toEqual(['relacionamento', 'abusivo', 'parceria', 'possivel', 'divorcio', 'pensar', 'novo', 'casamento']);
  });

  it('measures how much of a question the open page already names', () => {
    const page = generatedStudy();
    expect(pageCoverage('Is divorce allowed in an abusive marriage, and can I remarry?', page)).toBeLessThan(0.6);
    expect(pageCoverage('What does the Bible say about divorce and hardness of heart, and why?', page)).toBe(1);
  });

  it('routes a complex question to a page of its own unless it names a passage, a word or an author', () => {
    const page = generatedStudy();
    expect(asksNewQuestion(ABUSE_PT, unknown, null)).toBe(true);
    expect(asksNewQuestion(ABUSE_PT, unknown, page)).toBe(true);
    expect(asksNewQuestion(ABUSE_PT, { kind: 'open-topic', confidence: 0.5, slots: { topic: 'x' } }, page)).toBe(true);
    expect(asksNewQuestion(ABUSE_PT, { ...unknown, slots: { passage: { book: 'MAT', startChapter: 19 } } }, page)).toBe(false);
    expect(asksNewQuestion(ABUSE_PT, { kind: 'commentary', confidence: 0.8, slots: { authorId: 'keller' } }, page)).toBe(false);
    // "o que os teólogos falam…" is classified as a commentary request: still a question of its own
    const theologians = 'O que a bíblia e os teólogos falam no caso de uma separação, um divórcio quando há um relacionamento abusivo e sem parceria entre o casal, irresolvível mesmo tentando com conselheiros?';
    expect(asksNewQuestion(theologians, { kind: 'commentary', confidence: 0.7, slots: {} }, page)).toBe(true);
    expect(asksNewQuestion(ABUSE_PT, { kind: 'word-study', confidence: 0.8, slots: { term: 'divórcio' } }, page)).toBe(false);
    expect(asksNewQuestion('What about tattoos?', unknown, page)).toBe(false);
    // one detailed question about the page's subject is a follow-up, not a new page
    const ezra = 'Why did Ezra make the returned exiles send their wives away?';
    expect(isComplexQuestion(ezra)).toBe(true);
    expect(isMultiPartQuestion(ezra)).toBe(false);
    expect(asksNewQuestion(ezra, unknown, null)).toBe(true);
    expect(asksNewQuestion(ezra, unknown, page)).toBe(false);
    expect(isMultiPartQuestion('Is divorce allowed in an abusive marriage and can I remarry?')).toBe(true);
    expect(isMultiPartQuestion('Pode um cristão se divorciar se o cônjuge o abandona e posso me casar de novo?')).toBe(true);
    // a question the page itself suggests stays on the page
    const suggested = 'May a deserted believer remarry, and what do the confessions say about it?';
    expect(asksNewQuestion(suggested, unknown, page)).toBe(true);
    expect(asksNewQuestion(suggested, unknown, { ...page, suggestedQuestions: [suggested] })).toBe(false);
  });
});
