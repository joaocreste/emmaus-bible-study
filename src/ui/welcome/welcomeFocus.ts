/** Stable ids on the welcome screen (focus targets after "New study"). */
export const WELCOME_INPUT_ID = 'welcome-query';
export const WELCOME_TITLE_ID = 'welcome-title';

/**
 * After "New study" the button that was pressed unmounts with the study. Put focus
 * on the welcome question once it is on screen: the input with a mouse or trackpad,
 * the heading on touch screens (so no soft keyboard pops up).
 */
export function focusWelcomeStart(): void {
  if (typeof window === 'undefined') return;
  let frames = 0;
  const attempt = () => {
    let fine = false;
    try {
      fine = window.matchMedia('(pointer: fine)').matches;
    } catch {
      /* no matchMedia: prefer the heading */
    }
    const target = document.getElementById(fine ? WELCOME_INPUT_ID : WELCOME_TITLE_ID);
    if (target) target.focus({ preventScroll: true });
    else if (++frames < 10) requestAnimationFrame(attempt);
  };
  requestAnimationFrame(attempt);
}
