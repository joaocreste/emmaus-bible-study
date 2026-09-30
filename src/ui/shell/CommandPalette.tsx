import { lazy, Suspense, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { whenIdle } from './lazyPanes';

const loadDialog = () => import('./PaletteDialog');
const PaletteDialog = lazy(() => loadDialog().then((m) => ({ default: m.PaletteDialog })));

interface CommandPaletteProps {
  open: boolean;
  onOpenChange(open: boolean): void;
}

/**
 * ⌘K / Ctrl-K (or "/" when not typing) search across references, curated
 * studies, topics, key words and authors. Modal dialog with a focus trap;
 * combobox + listbox semantics; arrow keys, Enter, Esc.
 *
 * Rendered in a portal on <body>, outside #root: the Inspector makes #root inert
 * while it is open, and the palette must stay usable above it (Esc returns to
 * the Inspector; the Inspector's focus trap yields to another dialog).
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!openRef.current);
        return;
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !openRef.current && !isTypingTarget(e.target)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpenChange]);

  // The dialog is its own chunk: fetch it once the page is idle, so ⌘K opens instantly.
  useEffect(() => whenIdle(() => void loadDialog().catch(() => {})), []);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <Suspense fallback={null}>
      <PaletteDialog onClose={() => onOpenChange(false)} />
    </Suspense>,
    document.body,
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}
