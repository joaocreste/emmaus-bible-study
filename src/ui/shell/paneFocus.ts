import type { SectionId } from '../../domain/models';
import { focusSectionHeading } from '../study/StudyNavigation.utils';
import { sectionDomId } from '../study/types';

const MAX_FRAMES = 12;

/** Focus is "lost" when it sits on <body> or inside a pane that has just become inert. */
export function focusIsLost(): boolean {
  const active = document.activeElement as HTMLElement | null;
  return !active || active === document.body || !!active.closest('[inert]');
}

/**
 * On the phone layout (< 760px, also desktop at 200% zoom) a chat or toast action
 * that shows the Study pane leaves focus on a button in the now-inert chat, so it
 * falls to <body>. Once the study is interactive, move focus to the heading of
 * `section` (when it is on the page) or to the study itself — as following an
 * in-page link would. Does nothing while focus is still usable (split layouts,
 * where the chat stays interactive).
 */
export function moveFocusToStudyIfLost(section?: SectionId): void {
  if (typeof window === 'undefined') return;
  let frames = 0;
  const attempt = () => {
    if (!focusIsLost()) return;
    const pane = document.getElementById('study');
    if (!pane || pane.closest('[inert]')) {
      if (++frames < MAX_FRAMES) requestAnimationFrame(attempt);
      return;
    }
    if (section && document.getElementById(`${sectionDomId(section)}-title`)) {
      focusSectionHeading(section);
      return;
    }
    (document.getElementById('study-main') ?? pane).focus({ preventScroll: true });
  };
  requestAnimationFrame(attempt);
}
