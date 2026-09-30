import { useCallback, useSyncExternalStore } from 'react';

/** Live `matchMedia` subscription (false during SSR / when matchMedia is unavailable). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );
  const get = () => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false);
  return useSyncExternalStore(subscribe, get, () => false);
}

/** Layout breakpoints (docs/DESIGN.md §4). Keep in sync with the media queries in the shell CSS. */
export type Breakpoint = 'phone' | 'tablet' | 'desktop' | 'wide';

export function useBreakpoint(): Breakpoint {
  const tablet = useMediaQuery('(min-width: 760px)');
  const desktop = useMediaQuery('(min-width: 1180px)');
  const wide = useMediaQuery('(min-width: 1600px)');
  if (wide) return 'wide';
  if (desktop) return 'desktop';
  return tablet ? 'tablet' : 'phone';
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** True on devices with a precise pointer (mouse/trackpad) — used to avoid popping the soft keyboard on touch. */
export function useFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)');
}
