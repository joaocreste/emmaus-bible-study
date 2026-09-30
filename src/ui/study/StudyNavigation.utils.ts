import { BookOpen, Church, Landmark, Languages, Layers, LayoutList, Library, Link2, ScrollText, Signpost, type LucideIcon } from 'lucide-react';
import type { SectionId } from '../../domain/models';
import { sectionDomId } from './types';

/** Icon per dashboard section (navigation pills, "study updated" markers). */
export const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  overview: LayoutList,
  scripture: BookOpen,
  'key-passages': Signpost,
  'cross-references': Link2,
  'original-languages': Languages,
  'historical-context': Landmark,
  'literary-context': Layers,
  theology: Church,
  commentary: ScrollText,
  sources: Library,
};

/**
 * Move keyboard focus to a section's heading without scrolling (the caller scrolls).
 * Mirrors what following an in-page link does, so keyboard and screen-reader users
 * land inside the section they asked for.
 */
export function focusSectionHeading(id: SectionId): void {
  const heading = document.getElementById(`${sectionDomId(id)}-title`);
  if (!heading) return;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

/** Scroll behaviour honouring the reader's reduced-motion preference. */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

const SETTLE_CHECKS_MS = [320, 700, 1150, 1700, 2400];
const INTERRUPT_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

/** Nearest ancestor that scrolls vertically (overflow auto/scroll), or null for the viewport. */
export function scrollParentOf(el: Element): HTMLElement | null {
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(node).overflowY)) return node;
  }
  return null;
}

/**
 * Scroll only the element's own scroll container so `el` sits at its top (after the
 * container's scroll-padding and the element's scroll-margin). Unlike scrollIntoView,
 * this never moves outer frames (an overflow-hidden app shell, the page on phones).
 */
export function scrollToElement(el: HTMLElement, block: 'start' | 'center' = 'start', behavior: ScrollBehavior = scrollBehavior()): void {
  const root = scrollParentOf(el);
  if (!root) {
    el.scrollIntoView({ behavior, block });
    return;
  }
  const rootRect = root.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  const offset = rect.top - rootRect.top;
  let top: number;
  if (block === 'center') {
    top = root.scrollTop + offset - (root.clientHeight - rect.height) / 2;
  } else {
    const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    top = root.scrollTop + offset - padding - margin;
  }
  root.scrollTo({ top: Math.max(0, Math.round(top)), behavior });
}

/**
 * Scroll the element returned by `resolve` into view, then keep re-aiming for a
 * moment: content above it may still be loading (late excerpts, lexicon data) and
 * the precise target (a verse, a word card) may only appear once its data arrives.
 * `resolve` is called on every tick. Stops as soon as the reader scrolls, taps or types.
 * Returns a cancel function.
 */
export function scrollIntoViewSettled(resolve: () => HTMLElement | null, block: 'start' | 'center' = 'start'): () => void {
  const behavior = scrollBehavior();
  let done = false;
  const timers: number[] = [];
  const aim = () => {
    const el = resolve();
    if (el?.isConnected) scrollToElement(el, block, behavior);
  };
  const stop = () => {
    if (done) return;
    done = true;
    timers.forEach((t) => window.clearTimeout(t));
    for (const type of INTERRUPT_EVENTS) window.removeEventListener(type, stop, true);
  };
  aim();
  for (const type of INTERRUPT_EVENTS) window.addEventListener(type, stop, { capture: true, passive: true });
  SETTLE_CHECKS_MS.forEach((ms, i) => {
    timers.push(
      window.setTimeout(() => {
        if (!done) aim();
        if (i === SETTLE_CHECKS_MS.length - 1) stop();
      }, ms),
    );
  });
  return stop;
}

/** Settled scroll to a dashboard section (see scrollIntoViewSettled). */
export function scrollToSectionSettled(id: SectionId): () => void {
  return scrollIntoViewSettled(() => document.getElementById(sectionDomId(id)));
}
