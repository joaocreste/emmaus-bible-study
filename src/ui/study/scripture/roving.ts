import { useCallback, useState, type KeyboardEvent } from 'react';

/**
 * Roving tabindex for long runs of similar controls inside Scripture (verse numbers,
 * interlinear word stacks): the run is a single Tab stop, and the arrow keys, Home
 * and End move within it. Keyboard users no longer need ~90 Tab presses to get past
 * a chapter (WAI-ARIA APG, "roving tabindex").
 */
export function useRovingTabIndex(keys: readonly string[]) {
  const [active, setActive] = useState<string | undefined>();
  const current = active !== undefined && keys.includes(active) ? active : keys[0];
  const tabIndexFor = useCallback((key: string) => (key === current ? 0 : -1), [current]);
  return { tabIndexFor, setActive };
}

/**
 * Arrow-key handler for one member of a roving group. Members carry `data-roving={group}`;
 * the group is looked up inside the nearest `[data-roving-root]`. In right-to-left runs
 * (Hebrew), ArrowLeft moves forward.
 */
export function onRovingKeyDown(e: KeyboardEvent<HTMLElement>, group: string): void {
  const el = e.currentTarget;
  const root = el.closest('[data-roving-root]') ?? document;
  const items = Array.from(root.querySelectorAll<HTMLElement>(`[data-roving="${group}"]`));
  const i = items.indexOf(el);
  if (i < 0) return;
  const rtl = getComputedStyle(el).direction === 'rtl';
  let next = -1;
  switch (e.key) {
    case 'ArrowDown':
      next = i + 1;
      break;
    case 'ArrowUp':
      next = i - 1;
      break;
    case 'ArrowRight':
      next = rtl ? i - 1 : i + 1;
      break;
    case 'ArrowLeft':
      next = rtl ? i + 1 : i - 1;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = items.length - 1;
      break;
    default:
      return;
  }
  e.preventDefault();
  items[Math.max(0, Math.min(items.length - 1, next))]?.focus();
}
