import { Info } from 'lucide-react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';
import styles from './Toggletip.module.css';

export interface ToggletipProps {
  /** accessible name of the button, e.g. "What is a curated study?" */
  label: string;
  children: ReactNode;
  className?: string;
}

const MARGIN = 8;

/**
 * An explanation behind a small "i" button — for what would otherwise live only in a
 * `title` tooltip, which keyboard and touch users cannot open. Click / Enter toggles it;
 * Esc or a click elsewhere closes it. The text is placed in a live region when
 * it opens, so screen readers announce it (the toggletip pattern). The bubble is portalled
 * to <body> and positioned fixed, so clipping or containing ancestors never displace it.
 */
export function Toggletip({ label, children, className }: ToggletipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  const place = useCallback(() => {
    const b = buttonRef.current?.getBoundingClientRect();
    const bubble = bubbleRef.current?.getBoundingClientRect();
    if (!b || !bubble) return;
    // Starts under the button, shifted left only as far as the viewport requires.
    const left = Math.max(MARGIN, Math.min(b.left - 10, window.innerWidth - bubble.width - MARGIN));
    const below = b.bottom + 6;
    const top = below + bubble.height <= window.innerHeight - MARGIN ? below : Math.max(MARGIN, b.top - 6 - bubble.height);
    setPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    let raf = 0;
    const follow = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (buttonRef.current?.contains(t) || bubbleRef.current?.contains(t)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      close();
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', follow, true);
    window.addEventListener('resize', follow);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', follow, true);
      window.removeEventListener('resize', follow);
    };
  }, [open, place]);

  const bubble = (
    <span
      ref={bubbleRef}
      id={id}
      role="status"
      className={styles.bubble}
      data-open={open || undefined}
      style={open ? { top: pos?.top ?? -9999, left: pos?.left ?? -9999, visibility: pos ? 'visible' : 'hidden' } : undefined}
    >
      {open ? children : null}
    </span>
  );

  return (
    <span className={cx(styles.toggletip, className)}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setPos(null);
          setOpen((o) => !o);
        }}
      >
        <Info aria-hidden="true" />
      </button>
      {typeof document === 'undefined' ? bubble : createPortal(bubble, document.body)}
    </span>
  );
}
