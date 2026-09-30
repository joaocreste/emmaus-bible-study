import { describe, expect, it } from 'vitest';
import type { ChatMessage, Study } from '../../domain/models';
import type { EngineResult } from '../../engine/types';
import { generatedStudy } from '../../inference/__tests__/fakes';
import { withDividers } from '../../ui/chat/chatLog';
import { studyQuery } from '../deepLink';
import { createInitialState, isComposing, sessionReducer, type InternalSessionState } from '../sessionReducer';
import { DEFAULT_SETTINGS, sanitizeSettings } from '../settings';

const user = (id: string, text: string, studyId?: string): ChatMessage => ({ id, role: 'user', text, createdAt: 1, ...(studyId ? { studyId } : {}) });

function curated(id = 'romans-8'): Study {
  return { ...generatedStudy(), id, depth: 'curated', kind: 'passage', title: 'Romans 8', passage: { book: 'ROM', startChapter: 8 }, generation: undefined, layout: undefined };
}

function success(study: Study | undefined, extra: Partial<EngineResult> = {}): EngineResult {
  return {
    reply: { id: 'a-gen', role: 'assistant', text: 'Opening.', createdAt: 2 },
    conversation: { activeConceptId: 'c' },
    intent: { kind: 'open-topic', confidence: 0.8, slots: { topic: 'divorce' } },
    trace: [{ stage: 'Intent', detail: 'open-topic' }],
    ...(study ? { study } : {}),
    ...extra,
  };
}

const start = (s: InternalSessionState, id = 'u1', text = 'divorce') => sessionReducer(s, { type: 'request/start', message: user(id, text, s.study?.id), text });
const snapshot = (s: InternalSessionState, study: Study, complete = false, isPhone = false) => sessionReducer(s, { type: 'stream/study', study, complete, isPhone });

describe('session — live composition', () => {
  it('opens the page on the first snapshot, while the request is still in flight', () => {
    let s = start(createInitialState(DEFAULT_SETTINGS));
    s = sessionReducer(s, { type: 'stream/progress', step: { stage: 'Research', detail: 'Searching Nave’s' } });
    expect(s.phase).toBe('welcome');
    expect(s.liveSteps).toHaveLength(1);

    const partial = { ...generatedStudy(), commentary: [] };
    s = snapshot(s, partial);
    expect(s.phase).toBe('study');
    expect(s.status).toBe('thinking');
    expect(s.study).toBe(partial);
    expect(isComposing(s)).toBe(true);
    expect(s.messages[0].studyId).toBe(partial.id); // the question belongs to the new page
    expect(s.studyTitles[partial.id]).toBe('Divorce');
    expect(s.studyCache[partial.id]).toBe(partial);
    expect(s.liveSteps).toHaveLength(1); // steps keep accumulating for the thinking indicator
  });

  it('updates the page in place on later snapshots, keeping focus and the inspector', () => {
    let s = snapshot(start(createInitialState(DEFAULT_SETTINGS)), generatedStudy());
    s = sessionReducer(s, { type: 'focus', focus: { section: 'key-passages' } });
    s = sessionReducer(s, { type: 'inspector/open', target: { type: 'source', sourceId: 'bsb', excerpt: 'x' } });
    const seq = s.focusSeq;
    const fuller = { ...generatedStudy(), suggestedQuestions: ['q'] };
    s = snapshot(s, fuller, true);
    expect(s.study).toBe(fuller);
    expect(s.focus).toEqual({ section: 'key-passages' });
    expect(s.focusSeq).toBe(seq);
    expect(s.inspector).toEqual({ type: 'source', sourceId: 'bsb', excerpt: 'x' });
    expect(isComposing(s)).toBe(false); // the final snapshot arrived
    expect(s.status).toBe('thinking'); // …but the reply has not
  });

  it('applies the final reply without re-opening the page, and clears the live state', () => {
    let s = snapshot(start(createInitialState(DEFAULT_SETTINGS)), generatedStudy());
    s = sessionReducer(s, { type: 'stream/progress', step: { stage: 'Compose', detail: 'Key passages accepted' } });
    const final = generatedStudy();
    s = sessionReducer(s, { type: 'request/success', result: success(final, { focus: { section: 'key-passages' } }), isPhone: false });
    expect(s.status).toBe('idle');
    expect(s.study).toBe(final);
    expect(s.liveSteps).toEqual([]);
    expect(isComposing(s)).toBe(false);
    expect(s.messages.map((m) => [m.role, m.studyId])).toEqual([
      ['user', final.id],
      ['assistant', final.id],
    ]);
    expect(s.conversation).toEqual({ activeConceptId: 'c' });
    expect(s.focus).toEqual({ section: 'key-passages' });
  });

  it('puts the "New study" divider above the question as soon as a second page starts arriving', () => {
    let s = start(createInitialState(DEFAULT_SETTINGS), 'u1', 'Romans 8');
    s = sessionReducer(s, { type: 'request/success', result: success(curated(), { intent: { kind: 'open-passage', confidence: 1, slots: {} } }), isPhone: false });
    s = sessionReducer(s, { type: 'focus', focus: { section: 'theology' } });
    s = start(s, 'u2', 'divorce');
    expect(s.messages[2].studyId).toBe('romans-8');
    s = snapshot(s, generatedStudy());
    expect(s.study?.id).toBe('generated-divorce-1');
    expect(s.focus).toBeNull(); // a new page starts fresh
    expect(s.studyAnchor).toBeNull();
    const log = withDividers(s.messages, s.studyTitles);
    expect(log.map((i) => (i.type === 'divider' ? `— ${i.title}` : i.message.id))).toEqual(['u1', 'a-gen', '— Divorce', 'u2']);
  });

  it('marks the study as updated on phone while the reader is on the chat pane', () => {
    const s = snapshot(start(createInitialState(DEFAULT_SETTINGS)), generatedStudy(), false, true);
    expect(s.studyUpdatedWhileAway).toBe(true);
  });

  it('ignores stream events that arrive when no request is in flight (after "New study")', () => {
    let s = snapshot(start(createInitialState(DEFAULT_SETTINGS)), generatedStudy());
    s = sessionReducer(s, { type: 'reset' });
    const after = snapshot(s, generatedStudy());
    expect(after).toBe(s);
    expect(sessionReducer(s, { type: 'stream/progress', step: { stage: 'x', detail: 'y' } })).toBe(s);
    expect(s.phase).toBe('welcome');
    expect(isComposing(s)).toBe(false);
  });

  it('clears the composing state when the request fails', () => {
    let s = snapshot(start(createInitialState(DEFAULT_SETTINGS)), generatedStudy());
    s = sessionReducer(s, { type: 'request/failure', message: { id: 'err', role: 'assistant', text: 'x', createdAt: 3 } });
    expect(isComposing(s)).toBe(false);
    expect(s.liveSteps).toEqual([]);
    expect(s.study?.id).toBe('generated-divorce-1'); // the finished sections stay
  });

  it('starts every request with an empty step list', () => {
    let s = start(createInitialState(DEFAULT_SETTINGS));
    s = sessionReducer(s, { type: 'stream/progress', step: { stage: 'a', detail: 'b' } });
    s = sessionReducer(s, { type: 'request/success', result: success(undefined), isPhone: false });
    s = start(s, 'u2', 'more');
    expect(s.liveSteps).toEqual([]);
  });
});

describe('settings & deep links for live composition', () => {
  it('defaults live composition on, and keeps a stored choice', () => {
    expect(DEFAULT_SETTINGS.liveComposition).toBe(true);
    expect(sanitizeSettings({ liveComposition: false }).liveComposition).toBe(false);
    expect(sanitizeSettings({ liveComposition: 'no' }).liveComposition).toBe(true);
  });

  it('links a generated page by the reader’s question', () => {
    expect(studyQuery(generatedStudy())).toBe('divorce');
    expect(studyQuery(curated())).toBe('Romans 8');
  });
});
