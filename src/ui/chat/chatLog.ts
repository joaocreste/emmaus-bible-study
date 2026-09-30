import type { ChatMessage } from '../../domain/models';

export type LogItem = { type: 'message'; message: ChatMessage } | { type: 'divider'; key: string; title: string };

/**
 * Insert "New study · …" dividers wherever the conversation moves to a different study (never before the first message).
 * `untitled` names a study whose title is unknown (localized by the caller).
 */
export function withDividers(messages: ChatMessage[], titles: Record<string, string>, untitled = 'New study'): LogItem[] {
  const out: LogItem[] = [];
  let current: string | undefined;
  messages.forEach((m, i) => {
    if (m.studyId && m.studyId !== current) {
      if (i > 0) out.push({ type: 'divider', key: `divider-${m.id}`, title: titles[m.studyId] ?? untitled });
      current = m.studyId;
    }
    out.push({ type: 'message', message: m });
  });
  return out;
}
