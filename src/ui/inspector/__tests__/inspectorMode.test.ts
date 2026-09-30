import { describe, expect, it } from 'vitest';
import type { ChatMessage } from '../../../domain/models';
import { latestReplyId, nextInspectorMode, openedByReply } from '../inspectorMode';

const msg = (id: string, role: ChatMessage['role']): ChatMessage => ({ id, role, text: '', createdAt: 0 });

describe('Inspector mode', () => {
  it('finds the latest assistant reply', () => {
    expect(latestReplyId([])).toBeNull();
    expect(latestReplyId([msg('u1', 'user'), msg('a1', 'assistant'), msg('u2', 'user')])).toBe('a1');
  });

  it('attributes a target to a reply only when both change together', () => {
    const a = { type: 'word' };
    const b = { type: 'passage' };
    // reply opened it
    expect(openedByReply({ target: null, replyId: 'r1' }, { target: a, replyId: 'r2' })).toBe(true);
    // reply retargeted an open sheet
    expect(openedByReply({ target: a, replyId: 'r1' }, { target: b, replyId: 'r2' })).toBe(true);
    // the reader opened it (no new reply)
    expect(openedByReply({ target: null, replyId: 'r1' }, { target: a, replyId: 'r1' })).toBe(false);
    // a reply arrived but the sheet closed / stayed the same
    expect(openedByReply({ target: a, replyId: 'r1' }, { target: null, replyId: 'r2' })).toBe(false);
    expect(openedByReply({ target: a, replyId: 'r1' }, { target: a, replyId: 'r2' })).toBe(false);
  });

  it('opens reply targets as a companion sheet, reader targets as a modal', () => {
    expect(nextInspectorMode({ current: null, byReply: true, triggerInsideSheet: false, phone: false })).toBe('companion');
    expect(nextInspectorMode({ current: null, byReply: false, triggerInsideSheet: false, phone: false })).toBe('modal');
    // a key word clicked in the study while a companion sheet is open
    expect(nextInspectorMode({ current: 'companion', byReply: false, triggerInsideSheet: false, phone: false })).toBe('modal');
  });

  it('keeps the mode for links followed inside the sheet', () => {
    expect(nextInspectorMode({ current: 'companion', byReply: false, triggerInsideSheet: true, phone: false })).toBe('companion');
    expect(nextInspectorMode({ current: 'modal', byReply: false, triggerInsideSheet: true, phone: false })).toBe('modal');
  });

  it('is always modal on phones (the bottom sheet covers the composer)', () => {
    expect(nextInspectorMode({ current: null, byReply: true, triggerInsideSheet: false, phone: true })).toBe('modal');
  });
});
