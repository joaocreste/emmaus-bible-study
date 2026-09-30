import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { focusableWithin } from '../../inspector/useFocusTrap';
import styles from './VerseMenu.module.css';

export interface VerseMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onSelect(): void;
}

interface VerseMenuProps {
  /** element the menu is attached to (the verse-number button); focus returns here */
  anchor: HTMLElement;
  /** accessible name, e.g. "Romans 8:1" */
  label: string;
  items: VerseMenuItem[];
  onClose(): void;
}

const MARGIN = 8;

/**
 * Small accessible action menu for a verse (role="menu"). Rendered in a portal with
 * fixed positioning so it is never clipped by the scrolling study pane.
 * Arrow keys move, Enter/Space select, Esc/outside click close; Tab / Shift+Tab close and
 * continue from the verse number, as if the menu had not been open.
 */
export function VerseMenu({ anchor, label, items, onClose }: VerseMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pos, setPos] = useState<{ top: number; left: number; placement: 'below' | 'above' } | null>(null);
  const titleId = useId();

  const place = useCallback(() => {
    const menu = menuRef.current;
    if (!menu || !anchor.isConnected) return;
    const a = anchor.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const below = a.bottom + 6;
    const fitsBelow = below + m.height <= vh - MARGIN;
    const top = fitsBelow ? below : Math.max(MARGIN, a.top - 6 - m.height);
    const left = Math.min(Math.max(MARGIN, a.left - 8), vw - m.width - MARGIN);
    setPos({ top, left, placement: fitsBelow ? 'below' : 'above' });
  }, [anchor]);

  useLayoutEffect(() => {
    place();
  }, [place]);

  // Move focus into the menu once it is placed (it is invisible while being measured).
  const focused = useRef(false);
  useEffect(() => {
    if (!pos || focused.current) return;
    focused.current = true;
    itemRefs.current[0]?.focus({ preventScroll: true });
  }, [pos]);

  useEffect(() => {
    let raf = 0;
    const reposition = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || anchor.contains(t)) return;
      onClose();
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [anchor, onClose, place]);

  const closeAndReturn = () => {
    onClose();
    anchor.focus({ preventScroll: true });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = itemRefs.current.filter((x): x is HTMLButtonElement => x != null);
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    const focusAt = (n: number) => list[(n + list.length) % list.length]?.focus();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusAt(i + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusAt(i - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusAt(0);
        break;
      case 'End':
        e.preventDefault();
        focusAt(list.length - 1);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        closeAndReturn();
        break;
      case 'Tab': {
        // The menu lives at the end of <body>: move on from the verse number, not from the menu.
        e.preventDefault();
        onClose();
        const order = focusableWithin(document.body).filter((el) => el.tabIndex >= 0 && !el.closest('[inert]'));
        const at = order.indexOf(anchor);
        const next = at < 0 ? anchor : order[at + (e.shiftKey ? -1 : 1)];
        (next ?? anchor).focus({ preventScroll: false });
        break;
      }
    }
  };

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-labelledby={titleId}
      className={styles.menu}
      data-placement={pos?.placement ?? 'below'}
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, visibility: pos ? 'visible' : 'hidden' }}
      onKeyDown={onKeyDown}
    >
      <p id={titleId} className={styles.title}>
        {label}
      </p>
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          type="button"
          role="menuitem"
          tabIndex={-1}
          className={styles.item}
          onClick={() => {
            item.onSelect();
            onClose();
            // Return focus to the verse number unless the action moved it elsewhere.
            requestAnimationFrame(() => {
              const active = document.activeElement;
              if (!active || active === document.body) anchor.focus({ preventScroll: true });
            });
          }}
        >
          {item.icon && <span className={styles.icon}>{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>,
    document.body,
  );
}
