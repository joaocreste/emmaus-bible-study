import { createContext, useContext } from 'react';
import type { Study } from '../../domain/models';
import { useSessionInternals } from '../../state/session';

/** Which message (and study) the inline tokens being rendered belong to. */
export interface MessageScope {
  messageId: string;
  studyId?: string;
}

export const MessageScopeContext = createContext<MessageScope>({ messageId: '' });

export function useMessageScope(): MessageScope {
  return useContext(MessageScopeContext);
}

/**
 * The study the message being rendered belongs to — the open study, or an earlier
 * one from the session's cache — and whether it is the one open now. Older messages
 * keep their key words and quotations after the conversation moves to another study.
 */
export function useMessageStudy(): { study: Study | null; live: boolean } {
  const { study: current, studyCache } = useSessionInternals();
  const { studyId } = useMessageScope();
  if (!studyId || studyId === current?.id) return { study: current, live: true };
  return { study: studyCache[studyId] ?? null, live: false };
}

/**
 * Put keyboard focus back in the conversation after a control that is about to
 * unmount was used (a suggestion chip, "Try again"). `fromKeyboard` distinguishes
 * keyboard activation (click with `detail === 0`) from a tap, so touch devices do
 * not get their soft keyboard popped open.
 */
export type RestoreChatFocus = (fromKeyboard: boolean) => void;

export const ChatFocusContext = createContext<RestoreChatFocus>(() => {});

export function useRestoreChatFocus(): RestoreChatFocus {
  return useContext(ChatFocusContext);
}

/** DOM id of a message (used to scroll a long reply into view). */
export function messageDomId(id: string): string {
  return `msg-${id.replace(/[^\w-]/g, '_')}`;
}

/** DOM id of a "New study · …" divider (the chat scrolls to it when the study changes). */
export function dividerDomId(key: string): string {
  return `chat-${key.replace(/[^\w-]/g, '_')}`;
}
