/**
 * How the Inspector behaves when it opens or changes target (docs/DESIGN.md §8).
 *
 * - 'modal': the reader asked for it (a key word, a chip, a source). Scrim, focus
 *   moves into the sheet and is trapped there, the app behind is inert.
 * - 'companion': a chat reply opened it (a word study, a passage to compare). On
 *   tablet/desktop it sits beside the conversation without a scrim or focus trap,
 *   so the reader can keep typing follow-ups; focus stays where it was.
 *
 * Phones always get the modal bottom sheet (it covers the composer anyway).
 * Framework-free so the rules can be unit-tested.
 */
import type { ChatMessage } from '../../domain/models';

export type InspectorMode = 'modal' | 'companion';

/** Id of the latest assistant reply, or null. */
export function latestReplyId(messages: readonly ChatMessage[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') return messages[i].id;
  }
  return null;
}

/**
 * Did a chat reply open (or retarget) the Inspector? The session applies a reply's
 * inspector directive in the same update that appends the reply, so the target and
 * the latest reply change together. Robust to batching with a queued request's start.
 */
export function openedByReply(
  prev: { target: object | null; replyId: string | null },
  next: { target: object | null; replyId: string | null },
): boolean {
  return next.target != null && next.target !== prev.target && next.replyId != null && next.replyId !== prev.replyId;
}

/**
 * Mode for a newly shown target.
 * `triggerInsideSheet` is true when the reader followed a link inside the open sheet
 * (the sheet keeps its current behaviour then).
 */
export function nextInspectorMode(opts: {
  current: InspectorMode | null;
  byReply: boolean;
  triggerInsideSheet: boolean;
  phone: boolean;
}): InspectorMode {
  if (opts.phone) return 'modal';
  if (opts.byReply) return 'companion';
  if (opts.triggerInsideSheet && opts.current) return opts.current;
  return 'modal';
}
