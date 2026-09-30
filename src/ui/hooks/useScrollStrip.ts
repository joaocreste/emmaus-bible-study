import { useCallback, useEffect, useState, type RefObject } from 'react';

export interface StripEdges {
  /** more items are hidden before the visible part */
  start: boolean;
  /** more items are hidden after it */
  end: boolean;
}

/**
 * A horizontally scrolling strip of pills or tabs, made usable with a mouse:
 * - reports which edges hide more items (for edge fades and chevron buttons);
 * - maps a vertical wheel to horizontal scrolling while the strip can still move that
 *   way (at either end the wheel scrolls the page as usual);
 * - `scrollByPage(±1)` moves the strip by most of its width.
 * `deps` re-measure when the items change.
 */
export function useScrollStrip(ref: RefObject<HTMLElement | null>, deps: readonly unknown[] = []) {
  const [edges, setEdges] = useState<StripEdges>({ start: false, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      const next = { start: max > 1 && el.scrollLeft > 1, end: max > 1 && el.scrollLeft < max - 1 };
      setEdges((e) => (e.start === next.start && e.end === next.end ? e : next));
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return;
      const canMove = e.deltaY > 0 ? el.scrollLeft < max - 1 : el.scrollLeft > 1;
      if (!canMove) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      el.removeEventListener('wheel', onWheel);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);

  const scrollByPage = useCallback(
    (direction: 1 | -1) => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
    },
    [ref],
  );

  return { edges, scrollByPage };
}
