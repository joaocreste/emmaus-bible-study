import { describe, expect, it } from 'vitest';
import type { ChatMessage, Study } from '../../domain/models';
import type { EngineResult } from '../../engine/types';
import { buildSearch, readDeepLink, studyQuery } from '../deepLink';
import { createInitialState, latestUpdatedSection, nextAnchor, sessionReducer, type InternalSessionState } from '../sessionReducer';
import { DEFAULT_SETTINGS, resolveTheme, sanitizeSettings } from '../settings';

function study(id: string, title = id, extra: Partial<Study> = {}): Study {
  return {
    id,
    kind: 'passage',
    depth: 'curated',
    title,
    passage: { book: 'ROM', startChapter: 8 },
    keyWords: [],
    crossReferences: [],
    context: [],
    theology: [],
    perspectives: [],
    commentary: [],
    sermons: [],
    verseNotes: [],
    concepts: [],
    suggestedQuestions: [],
    sourceIds: [],
    ...extra,
  };
}

function userMessage(id: string, text: string): ChatMessage {
  return { id, role: 'user', text, createdAt: 1 };
}

function result(partial: Partial<EngineResult> & { replyId?: string } = {}): EngineResult {
  const { replyId = 'a1', ...rest } = partial;
  return {
    reply: { id: replyId, role: 'assistant', text: 'reply', createdAt: 2 },
    conversation: {},
    intent: { kind: 'open-passage', confidence: 1, slots: {} },
    trace: [{ stage: 'Intent', detail: 'Open passage' }],
    ...rest,
  };
}

const initial = () => createInitialState(DEFAULT_SETTINGS);

function started(state: InternalSessionState = initial(), text = 'Romans 8', id = 'u1'): InternalSessionState {
  return sessionReducer(state, { type: 'request/start', message: userMessage(id, text) });
}

describe('sessionReducer — requests', () => {
  it('starts in the welcome phase, idle, with no study', () => {
    const s = initial();
    expect(s.phase).toBe('welcome');
    expect(s.status).toBe('idle');
    expect(s.study).toBeNull();
    expect(s.messages).toEqual([]);
    expect(s.mobilePane).toBe('chat');
  });

  it('request/start appends the user message and enters the thinking state', () => {
    const s = started();
    expect(s.status).toBe('thinking');
    expect(s.messages).toHaveLength(1);
    expect(s.pendingText).toBe('Romans 8');
    expect(s.pendingMessageId).toBe('u1');
  });

  it('request/start without a message (direct open) keeps the transcript', () => {
    const s = sessionReducer(initial(), { type: 'request/start', text: 'Grace' });
    expect(s.messages).toHaveLength(0);
    expect(s.status).toBe('thinking');
    expect(s.pendingText).toBe('Grace');
  });

  it('request/success opens the study, appends the reply and enters the study phase', () => {
    const rom = study('romans-8', 'Romans 8');
    const s = sessionReducer(started(), {
      type: 'request/success',
      result: result({ study: rom, focus: { section: 'scripture' } }),
      isPhone: false,
    });
    expect(s.phase).toBe('study');
    expect(s.status).toBe('idle');
    expect(s.study).toBe(rom);
    expect(s.messages.map((m) => m.role)).toEqual(['user', 'assistant']);
    expect(s.messages[1].studyId).toBe('romans-8');
    expect(s.messages[1].trace).toEqual([{ stage: 'Intent', detail: 'Open passage' }]);
    expect(s.focus).toEqual({ section: 'scripture' });
    expect(s.focusSeq).toBe(1);
    expect(s.studyTitles).toEqual({ 'romans-8': 'Romans 8' });
    expect(s.focusByMessage.a1).toEqual({ section: 'scripture' });
    expect(s.pendingText).toBeNull();
  });

  it('tags the triggering user message with the new study (chat divider sits above the question)', () => {
    let s = sessionReducer(started(), { type: 'request/success', result: result({ study: study('romans-8') }), isPhone: false });
    s = started(s, 'Psalm 23', 'u2');
    s = sessionReducer(s, { type: 'request/success', result: result({ study: study('psalm-23'), replyId: 'a2' }), isPhone: false });
    expect(s.messages.find((m) => m.id === 'u2')?.studyId).toBe('psalm-23');
    expect(s.messages.find((m) => m.id === 'u1')?.studyId).toBe('romans-8');
  });

  it('keeps the current study and focus when the reply carries neither', () => {
    let s = sessionReducer(started(), {
      type: 'request/success',
      result: result({ study: study('romans-8'), focus: { section: 'scripture' } }),
      isPhone: false,
    });
    s = started(s, 'hello', 'u2');
    s = sessionReducer(s, { type: 'request/success', result: result({ replyId: 'a2' }), isPhone: false });
    expect(s.study?.id).toBe('romans-8');
    expect(s.focus).toEqual({ section: 'scripture' });
    expect(s.focusSeq).toBe(1);
    expect(s.messages.at(-1)?.studyId).toBe('romans-8');
  });

  it('increments focusSeq on every focus, even for equal objects', () => {
    let s = sessionReducer(started(), { type: 'request/success', result: result({ focus: { section: 'theology' } }), isPhone: false });
    s = started(s, 'again', 'u2');
    s = sessionReducer(s, {
      type: 'request/success',
      result: result({ focus: { section: 'theology' }, replyId: 'a2' }),
      isPhone: false,
    });
    expect(s.focusSeq).toBe(2);
  });

  it('opens the inspector the engine asks for, and closes a stale one when the study changes', () => {
    let s = sessionReducer(initial(), { type: 'inspector/open', target: { type: 'source', sourceId: 'bsb' } });
    s = sessionReducer(started(s), { type: 'request/success', result: result({ study: study('romans-8') }), isPhone: false });
    expect(s.inspector).toBeNull();
    s = started(s, 'word', 'u2');
    s = sessionReducer(s, {
      type: 'request/success',
      result: result({ inspector: { type: 'word', strong: 'G2631' }, replyId: 'a2' }),
      isPhone: false,
    });
    expect(s.inspector).toEqual({ type: 'word', strong: 'G2631' });
  });

  it('de-duplicates reply ids so React keys stay unique', () => {
    let s = sessionReducer(started(), { type: 'request/success', result: result({ replyId: 'x' }), isPhone: false });
    s = sessionReducer(started(s, 'b', 'u2'), { type: 'request/success', result: result({ replyId: 'x' }), isPhone: false });
    const ids = s.messages.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('marks the study as updated while away only on phone, on the chat pane, when the dashboard changed', () => {
    const withStudy = result({ study: study('romans-8') });
    expect(sessionReducer(started(), { type: 'request/success', result: withStudy, isPhone: true }).studyUpdatedWhileAway).toBe(true);
    expect(sessionReducer(started(), { type: 'request/success', result: withStudy, isPhone: false }).studyUpdatedWhileAway).toBe(false);
    const onStudyPane = sessionReducer(started(), { type: 'pane/set', pane: 'study' });
    expect(sessionReducer(onStudyPane, { type: 'request/success', result: withStudy, isPhone: true }).studyUpdatedWhileAway).toBe(false);
    expect(sessionReducer(started(), { type: 'request/success', result: result(), isPhone: true }).studyUpdatedWhileAway).toBe(false);
  });

  it('request/failure appends the error message, flags error, remembers the retry text; settle returns to idle', () => {
    const err: ChatMessage = { id: 'err1', role: 'assistant', text: 'Sorry', createdAt: 3 };
    let s = sessionReducer(started(), { type: 'request/failure', message: err, retryText: 'Romans 8' });
    expect(s.status).toBe('error');
    expect(s.messages.at(-1)).toBe(err);
    expect(s.retryByMessage).toEqual({ err1: 'Romans 8' });
    expect(s.phase).toBe('welcome');
    s = sessionReducer(s, { type: 'status/settle' });
    expect(s.status).toBe('idle');
  });

  it('caches every study opened, so older messages can still resolve theirs', () => {
    const rom = study('romans-8', 'Romans 8');
    const psa = study('psalm-23', 'Psalm 23', { passage: { book: 'PSA', startChapter: 23 } });
    let s = sessionReducer(started(), { type: 'request/success', result: result({ study: rom }), isPhone: false });
    s = sessionReducer(started(s, 'Psalm 23', 'u2'), { type: 'request/success', result: result({ study: psa, replyId: 'a2' }), isPhone: false });
    expect(s.study).toBe(psa);
    expect(s.studyCache).toEqual({ 'romans-8': rom, 'psalm-23': psa });
    expect(sessionReducer(s, { type: 'reset' }).studyCache).toEqual({});
  });

  it('keeps the verse an opening query asked for as the study anchor (deep link), and clears it for the whole passage', () => {
    const rom = study('romans-8', 'Romans 8');
    const at828 = { book: 'ROM', startChapter: 8, startVerse: 28, endChapter: 8, endVerse: 28 };
    const openAt = (passage: typeof at828 | { book: string; startChapter: number }) =>
      ({ kind: 'open-passage', confidence: 1, slots: { passage } }) as const;
    let s = sessionReducer(started(initial(), 'Romans 8:28'), {
      type: 'request/success',
      result: result({ study: rom, intent: openAt(at828), focus: { section: 'scripture', highlightVerses: [{ book: 'ROM', chapter: 8, verse: 28 }] } }),
      isPhone: false,
    });
    expect(s.studyAnchor).toEqual(at828);
    // A follow-up keeps it…
    s = sessionReducer(started(s, 'What does condemnation mean?', 'u2'), {
      type: 'request/success',
      result: result({ replyId: 'a2', intent: { kind: 'word-study', confidence: 1, slots: {} } }),
      isPhone: false,
    });
    expect(s.studyAnchor).toEqual(at828);
    // …asking for the whole chapter clears it.
    s = sessionReducer(started(s, 'Romans 8', 'u3'), {
      type: 'request/success',
      result: result({ replyId: 'a3', intent: openAt({ book: 'ROM', startChapter: 8 }) }),
      isPhone: false,
    });
    expect(s.studyAnchor).toBeNull();
  });

  it('nextAnchor ignores verses outside the study, the study passage itself, and resets when the study changes', () => {
    const rom = study('romans-8', 'Romans 8');
    const kept = { book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 4 };
    const open = (passage?: object) => ({ intent: { kind: 'open-passage' as const, confidence: 1, slots: passage ? { passage: passage as never } : {} } });
    expect(nextAnchor(null, open({ book: 'JHN', startChapter: 3, startVerse: 16 }), rom, false)).toBeNull();
    const verse = study('jhn', 'John 3:16', { passage: { book: 'JHN', startChapter: 3, startVerse: 16, endChapter: 3, endVerse: 16 } });
    expect(nextAnchor(null, open({ book: 'JHN', startChapter: 3, startVerse: 16, endChapter: 3, endVerse: 16 }), verse, true)).toBeNull();
    const other = { intent: { kind: 'theology' as const, confidence: 1, slots: {} } };
    expect(nextAnchor(kept, other, rom, false)).toBe(kept);
    expect(nextAnchor(kept, other, study('psalm-23'), true)).toBeNull();
  });

  it('status/settle does not interrupt a newer request', () => {
    const s = sessionReducer(started(), { type: 'status/settle' });
    expect(s.status).toBe('thinking');
  });
});

describe('sessionReducer — navigation & UI', () => {
  it('focus increments focusSeq and can switch the phone to the study pane', () => {
    let s = { ...initial(), studyUpdatedWhileAway: true };
    s = sessionReducer(s, { type: 'focus', focus: { section: 'commentary' } });
    expect(s.focusSeq).toBe(1);
    expect(s.mobilePane).toBe('chat');
    s = sessionReducer(s, { type: 'focus', focus: { section: 'commentary' }, showStudy: true });
    expect(s.focusSeq).toBe(2);
    expect(s.mobilePane).toBe('study');
    expect(s.studyUpdatedWhileAway).toBe(false);
  });

  it('visiting the study pane clears the away flag and re-issues the pending focus', () => {
    let s: InternalSessionState = { ...initial(), focus: { section: 'theology' }, focusSeq: 4, studyUpdatedWhileAway: true };
    s = sessionReducer(s, { type: 'pane/set', pane: 'study' });
    expect(s.mobilePane).toBe('study');
    expect(s.studyUpdatedWhileAway).toBe(false);
    expect(s.focusSeq).toBe(5);
    s = sessionReducer(s, { type: 'pane/set', pane: 'sources' });
    expect(s.focusSeq).toBe(5);
  });

  it('opens and closes the inspector', () => {
    let s = sessionReducer(initial(), { type: 'inspector/open', target: { type: 'author', authorId: 'calvin' } });
    expect(s.inspector).toEqual({ type: 'author', authorId: 'calvin' });
    s = sessionReducer(s, { type: 'inspector/close' });
    expect(s.inspector).toBeNull();
  });

  it('sanitises settings patches', () => {
    let s = sessionReducer(initial(), { type: 'settings/update', patch: { fontScale: 3, theme: 'evening' } });
    expect(s.settings.fontScale).toBe(1.4);
    expect(s.settings.theme).toBe('evening');
    s = sessionReducer(s, { type: 'settings/update', patch: { translation: 'XYZ' as never } });
    expect(s.settings.translation).toBe('BSB');
  });

  it('toggles the chat, or sets it explicitly', () => {
    let s = sessionReducer(initial(), { type: 'chat/toggle' });
    expect(s.chatCollapsed).toBe(true);
    s = sessionReducer(s, { type: 'chat/toggle', collapsed: true });
    expect(s.chatCollapsed).toBe(true);
    s = sessionReducer(s, { type: 'chat/toggle' });
    expect(s.chatCollapsed).toBe(false);
  });

  it('reset returns to welcome but keeps reader settings and a monotonic focusSeq', () => {
    let s = sessionReducer(initial(), { type: 'settings/update', patch: { theme: 'evening' } });
    s = sessionReducer(started(s), {
      type: 'request/success',
      result: result({ study: study('romans-8'), focus: { section: 'scripture' } }),
      isPhone: false,
    });
    s = sessionReducer(s, { type: 'reset' });
    expect(s.phase).toBe('welcome');
    expect(s.messages).toEqual([]);
    expect(s.study).toBeNull();
    expect(s.settings.theme).toBe('evening');
    expect(s.focusSeq).toBe(1);
  });

  it('latestUpdatedSection names the section the newest reply updated', () => {
    let s = sessionReducer(started(), {
      type: 'request/success',
      result: {
        ...result({ focus: { section: 'theology' } }),
        reply: { id: 'a1', role: 'assistant', text: 'r', createdAt: 2, updates: [{ section: 'original-languages', label: 'x' }] },
      },
      isPhone: false,
    });
    expect(latestUpdatedSection(s)).toBe('original-languages');
    s = sessionReducer(started(s, 'b', 'u2'), { type: 'request/success', result: result({ replyId: 'a2' }), isPhone: false });
    expect(latestUpdatedSection(s)).toBe('theology');
  });
});

describe('settings helpers', () => {
  it('falls back to defaults field by field', () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings({ theme: 'neon', showVerseNumbers: false, scriptureMode: 'interlinear' })).toEqual({
      ...DEFAULT_SETTINGS,
      showVerseNumbers: false,
      scriptureMode: 'interlinear',
    });
    expect(sanitizeSettings({ fontScale: 0.2 }).fontScale).toBe(0.9);
    expect(sanitizeSettings({ fontScale: Number.NaN }).fontScale).toBe(1);
  });

  it('resolves the system theme from the OS preference', () => {
    expect(resolveTheme('system', true)).toBe('evening');
    expect(resolveTheme('system', false)).toBe('parchment');
    expect(resolveTheme('parchment', true)).toBe('parchment');
    expect(resolveTheme('evening', false)).toBe('evening');
  });
});

describe('deep links', () => {
  it('reads ?q= and ?study=', () => {
    expect(readDeepLink('?q=Romans+8')).toEqual({ q: 'Romans 8' });
    expect(readDeepLink('?study=romans-8')).toEqual({ studyId: 'romans-8' });
    expect(readDeepLink('?q=%20%20')).toEqual({});
    expect(readDeepLink('')).toEqual({});
  });

  it('uses the passage reference for passage studies and the topic name otherwise', () => {
    expect(studyQuery(study('r', 'Life in the Spirit'))).toBe('Romans 8');
    const grace = study('grace', 'Grace', {
      kind: 'topic',
      passage: undefined,
      topic: { name: 'Grace', definition: { text: 'x', provenance: { kind: 'synthesis', verification: 'editorial', citations: [] } }, keyPassages: [] },
    });
    expect(studyQuery(grace)).toBe('Grace');
  });

  it('keeps the verse the study was opened at, when it lies inside the passage', () => {
    const at828 = { book: 'ROM', startChapter: 8, startVerse: 28, endChapter: 8, endVerse: 28 };
    expect(studyQuery(study('r'), at828)).toBe('Romans 8:28');
    expect(buildSearch('?q=Romans+8%3A28', study('r'), at828)).toBe('?q=Romans+8%3A28');
    expect(studyQuery(study('r'), { book: 'JHN', startChapter: 3, startVerse: 16 })).toBe('Romans 8');
  });

  it('builds the search string, preserving unrelated params', () => {
    expect(buildSearch('', study('r'))).toBe('?q=Romans+8');
    expect(buildSearch('?debug=1&q=old', study('r'))).toBe('?debug=1&q=Romans+8');
    expect(buildSearch('?q=Romans+8&study=x', null)).toBe('');
  });
});
