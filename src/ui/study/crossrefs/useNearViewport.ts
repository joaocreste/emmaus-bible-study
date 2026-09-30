import { useEffect, useState } from 'react';
import { scrollParentOf } from '../StudyNavigation.utils';

/**
 * Latches to `true` once the element comes within `margin` of the visible study pane,
 * so cards fetch their Scripture excerpt only when the reader approaches them.
 * The observer is created a frame after mount, once the workspace has settled which
 * element scrolls. Falls back to `true` where IntersectionObserver is unavailable.
 */
export function useNearViewport<T extends Element>(margin = '480px'): [(el: T | null) => void, boolean] {
  const [el, setEl] = useState<T | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!el || near) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    let io: IntersectionObserver | undefined;
    const raf = requestAnimationFrame(() => {
      io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setNear(true), {
        root: scrollParentOf(el),
        rootMargin: `${margin} 0px ${margin} 0px`,
      });
      io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [el, near, margin]);

  return [setEl, near];
}
