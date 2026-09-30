import { ArrowLeft, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { refKey } from '../../domain/reference';
import type { MessageKey } from '../../i18n/catalog';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { PHONE_QUERY, useSession } from '../../state/session';
import type { InspectorTarget } from '../../state/types';
import { IconButton } from '../primitives';
import { useMediaQuery } from '../shell/useMediaQuery';
import { AuthorView } from './AuthorView';
import { latestReplyId, nextInspectorMode, openedByReply, type InspectorMode } from './inspectorMode';
import { PassageView } from './PassageView';
import { SourceView } from './SourceView';
import { useFocusTrap } from './useFocusTrap';
import { WordView } from './WordView';
import styles from './Inspector.module.css';

const EYEBROW: Record<InspectorTarget['type'], MessageKey<'inspector'>> = {
  word: 'eyebrow.word',
  passage: 'eyebrow.passage',
  source: 'eyebrow.source',
  author: 'eyebrow.author',
};

/** Pixels the phone sheet must be dragged down to dismiss. */
const DISMISS_DRAG = 110;

/** Other layers that own the keyboard while focused (Esc belongs to them). */
const OTHER_LAYERS = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]';

function targetKey(t: InspectorTarget): string {
  switch (t.type) {
    case 'word':
      return `word:${t.keyWordId ?? ''}:${t.strong ?? ''}:${t.verse ? `${t.verse.book}.${t.verse.chapter}.${t.verse.verse}` : ''}`;
    case 'passage':
      return `passage:${refKey(t.ref)}`;
    case 'source':
      return `source:${t.sourceId}:${t.locator ?? ''}:${t.excerpt ? t.excerpt.slice(0, 60) : ''}`;
    case 'author':
      return `author:${t.authorId}`;
  }
}

/**
 * Detail sheet for words, passages, sources and authors (docs/DESIGN.md §8).
 * Right side sheet from 760px, bottom sheet on phones. Keeps a small back-stack when
 * you follow links inside it.
 *
 * Opened by the reader (a key word, a chip, a source) it is modal: scrim, focus trapped,
 * the app behind inert, Esc / scrim / close button dismiss, and focus returns to whatever
 * opened it. Opened by a chat reply on tablet/desktop it is a companion sheet instead: no
 * scrim or focus trap, focus stays in the composer so follow-ups can be typed at once,
 * and Esc (outside other popups) or the close button dismiss it.
 */
export function Inspector() {
  const { inspector, messages } = useSession();

  // Remember what the reader last used outside the sheet: Safari does not focus clicked
  // buttons, so pointer targets count too, and keyboard focus is followed as it moves.
  const lastInteractive = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const remember = (el: HTMLElement | null | undefined) => {
      if (!el || el === document.body || el.closest(OTHER_LAYERS)) return;
      lastInteractive.current = el;
    };
    const onPointerDown = (e: PointerEvent) =>
      remember((e.target as HTMLElement | null)?.closest?.<HTMLElement>('button, a[href], textarea, input, select, [tabindex]'));
    const onFocusIn = (e: FocusEvent) => remember(e.target as HTMLElement | null);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('focusin', onFocusIn, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('focusin', onFocusIn, true);
    };
  }, []);

  // Was the current target set by a chat reply? (It changes in the same update that adds the reply.)
  const replyId = latestReplyId(messages);
  const [seen, setSeen] = useState({ target: inspector, replyId, byReply: false });
  let byReply = seen.byReply;
  if (seen.target !== inspector || seen.replyId !== replyId) {
    if (seen.target !== inspector) byReply = openedByReply(seen, { target: inspector, replyId });
    setSeen({ target: inspector, replyId, byReply });
  }

  if (!inspector) return null;
  return createPortal(<InspectorSheet target={inspector} byReply={byReply} lastInteractive={lastInteractive} />, document.body);
}

function InspectorSheet({
  target,
  byReply,
  lastInteractive,
}: {
  target: InspectorTarget;
  byReply: boolean;
  lastInteractive: RefObject<HTMLElement | null>;
}) {
  const { closeInspector, openInspector } = useSession();
  const t = useT('inspector');
  const tc = useT('common');
  const phone = useMediaQuery(PHONE_QUERY);
  const sheetRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [history, setHistory] = useState<InspectorTarget[]>([]);
  const previous = useRef<InspectorTarget | null>(null);
  const goingBack = useRef(false);

  const [mode, setMode] = useState<InspectorMode>(() =>
    nextInspectorMode({ current: null, byReply, triggerInsideSheet: false, phone }),
  );
  const modal = mode === 'modal' || phone;

  /* ---------- where the reader last acted: inside the sheet (in-sheet links keep its mode) or outside ---------- */
  const actedInside = useRef(false);
  useEffect(() => {
    const note = (e: Event) => {
      actedInside.current = !!sheetRef.current?.contains(e.target as Node);
    };
    document.addEventListener('pointerdown', note, true);
    document.addEventListener('keydown', note, true);
    return () => {
      document.removeEventListener('pointerdown', note, true);
      document.removeEventListener('keydown', note, true);
    };
  }, []);

  /* ---------- the trigger: captured once per opening (StrictMode re-runs effects), restored on close ---------- */
  const trigger = useRef<HTMLElement | null | undefined>(undefined);
  useLayoutEffect(() => {
    if (trigger.current === undefined) {
      const active = document.activeElement as HTMLElement | null;
      trigger.current =
        active && active !== document.body && !sheetRef.current?.contains(active) ? active : lastInteractive.current;
    }
    const sheet = sheetRef.current;
    return () => {
      requestAnimationFrame(() => {
        // Still in the document: a StrictMode re-mount, not a real close.
        if (sheet?.isConnected) return;
        // Only restore when focus was in the sheet (it is now lost); a companion sheet leaves focus where it is.
        const active = document.activeElement;
        if (active && active !== document.body) return;
        const back = trigger.current;
        if (back && back.isConnected && !back.closest('[inert]')) back.focus({ preventScroll: true });
        else document.getElementById('study-main')?.focus({ preventScroll: true });
      });
    };
  }, [lastInteractive]);

  /* ---------- modal: the app behind is inert ---------- */
  useLayoutEffect(() => {
    if (!modal) return;
    const appRoot = document.getElementById('root');
    const wasInert = appRoot?.hasAttribute('inert') ?? false;
    if (appRoot && !wasInert) appRoot.setAttribute('inert', '');
    return () => {
      if (appRoot && !wasInert) appRoot.removeAttribute('inert');
    };
  }, [modal]);

  /* ---------- navigation inside the sheet: back-stack, mode, focus and scroll reset ---------- */
  const key = targetKey(target);
  useLayoutEffect(() => {
    const prev = previous.current;
    const changed = prev != null && targetKey(prev) !== key;
    let nextMode = mode;
    if (changed) {
      if (goingBack.current) goingBack.current = false;
      else setHistory((h) => [...h, prev]);
      nextMode = nextInspectorMode({ current: mode, byReply, triggerInsideSheet: actedInside.current, phone });
      if (nextMode !== mode) setMode(nextMode);
      // Opened again from outside the sheet (a key word in the study, a chip in chat): that is where focus returns.
      if (!actedInside.current) {
        const active = document.activeElement as HTMLElement | null;
        trigger.current =
          active && active !== document.body && !sheetRef.current?.contains(active) ? active : lastInteractive.current;
      }
    }
    previous.current = target;
    bodyRef.current?.scrollTo({ top: 0 });
    // A reply's companion sheet leaves focus where the reader is typing; anything the reader opened takes focus.
    const takeFocus = nextMode === 'modal' || phone || (changed && actedInside.current);
    if (takeFocus) sheetRef.current?.focus({ preventScroll: true });
    // `target`, `byReply` and `mode` are read for this key only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useFocusTrap(sheetRef, modal);

  /* ---------- companion: Esc closes it from anywhere outside other popups ---------- */
  useEffect(() => {
    if (modal) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t && !sheetRef.current?.contains(t) && t.closest(OTHER_LAYERS)) return;
      closeInspector();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [modal, closeInspector]);

  const goBack = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    goingBack.current = true;
    setHistory((h) => h.slice(0, -1));
    openInspector(prev);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      closeInspector();
    }
  };

  /* ---------- phone: drag the handle down to dismiss ---------- */
  const drag = useRef<{ startY: number; dy: number } | null>(null);
  const [dragY, setDragY] = useState(0);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!phone || (e.target as HTMLElement).closest('button, a')) return;
    drag.current = { startY: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dy = Math.max(0, e.clientY - drag.current.startY);
    drag.current.dy = dy;
    setDragY(dy);
  };
  const endDrag = useCallback(() => {
    if (!drag.current) return;
    const { dy } = drag.current;
    drag.current = null;
    setDragY(0);
    if (dy > DISMISS_DRAG) closeInspector();
  }, [closeInspector]);

  const view = (() => {
    switch (target.type) {
      case 'word':
        return <WordView target={target} titleId={titleId} onDone={closeInspector} />;
      case 'passage':
        return <PassageView passageRef={target.ref} title={target.title} titleId={titleId} onDone={closeInspector} />;
      case 'source':
        return <SourceView sourceId={target.sourceId} excerpt={target.excerpt} locator={target.locator} titleId={titleId} onDone={closeInspector} />;
      case 'author':
        return <AuthorView authorId={target.authorId} titleId={titleId} onDone={closeInspector} />;
    }
  })();

  return (
    <div className={styles.layer} data-mode={modal ? 'modal' : 'companion'}>
      {modal && <div className={styles.scrim} onClick={closeInspector} aria-hidden="true" />}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal={modal}
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(styles.sheet, !modal && styles.companion, dragY > 0 && styles.dragging)}
        style={dragY > 0 ? { transform: `translateY(${dragY}px)` } : undefined}
        onKeyDown={onKeyDown}
      >
        <div
          className={styles.bar}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className={styles.handle} aria-hidden="true" />
          <div className={styles.barRow}>
            {history.length > 0 ? (
              <IconButton label={t('back')} icon={<ArrowLeft />} size="sm" onClick={goBack} className={styles.barButton} />
            ) : (
              <span className={styles.barSpacer} aria-hidden="true" />
            )}
            <p className={styles.eyebrow}>{t(EYEBROW[target.type])}</p>
            <IconButton label={tc('action.close')} icon={<X />} size="sm" onClick={closeInspector} className={cx(styles.barButton, styles.close)} />
          </div>
        </div>
        <div ref={bodyRef} className={styles.body} key={key}>
          {view}
        </div>
      </div>
    </div>
  );
}
