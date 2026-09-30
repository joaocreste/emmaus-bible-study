/**
 * Code-split study phase: the conversation, the study workspace and the phone
 * Sources pane load in their own chunks, so the welcome screen does not ship
 * them. They are prefetched as soon as the welcome screen is idle, so opening a
 * study normally finds them already loaded (the fallback is a quiet cross loader).
 */
import { lazy } from 'react';
import { CrossLoader } from '../primitives';
import styles from './AppShell.module.css';

const loadChatPanel = () => import('../chat/ChatPanel');
const loadStudyWorkspace = () => import('../study/StudyWorkspace');
const loadSourcesPanel = () => import('../study/SourcesPanel');

export const ChatPanel = lazy(() => loadChatPanel().then((m) => ({ default: m.ChatPanel })));
export const StudyWorkspace = lazy(() => loadStudyWorkspace().then((m) => ({ default: m.StudyWorkspace })));
export const SourcesPanel = lazy(() => loadSourcesPanel().then((m) => ({ default: m.SourcesPanel })));

/** Fetch the study-phase chunks ahead of need (errors are left for the real load to report). */
export function preloadStudyPanes(): void {
  void Promise.all([loadChatPanel(), loadStudyWorkspace(), loadSourcesPanel()]).catch(() => {});
}

/** Run `task` when the browser is idle (or soon, where requestIdleCallback is missing). Returns a cancel function. */
export function whenIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(task, { timeout: 3000 });
    return () => window.cancelIdleCallback(id);
  }
  const t = window.setTimeout(task, 1200);
  return () => window.clearTimeout(t);
}

/** Placeholder while a pane's chunk loads (`label`: localized by the caller). */
export function PaneLoading({ label }: { label: string }) {
  return (
    <div className={styles.paneLoading}>
      <CrossLoader size={24} label={label} />
    </div>
  );
}
