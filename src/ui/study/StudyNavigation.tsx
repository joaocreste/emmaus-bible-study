import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react';
import type { SectionId } from '../../domain/models';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { useScrollStrip } from '../hooks/useScrollStrip';
import { SECTION_ICONS, focusSectionHeading, scrollBehavior, scrollToSectionSettled } from './StudyNavigation.utils';
import { useStudyUI } from './StudyUIContext';
import { sectionDomId } from './types';
import styles from './StudyNavigation.module.css';

interface StudyNavigationProps {
  /** visible sections, in dashboard order */
  sections: SectionId[];
  /** the study pane's scroll container (root for the scroll-spy) */
  scrollRoot: RefObject<HTMLElement | null>;
  /** height of the sticky block (nav + focus banner), in px */
  stickyOffset: number;
}

/** How long a just-updated section must stay in view before its gold dot clears. */
const SEEN_AFTER_MS = 1200;
/** Ignore the scroll-spy while a nav click scrolls, so intermediate sections do not flicker. */
const CLICK_LOCK_MS = 900;
/** Fraction of the visible pane (below the sticky bar) where the "current section" line sits. */
const READING_LINE = 0.3;

/** Is the study pane actually in front of the reader (not hidden, inert or in a background tab)? */
function isReaderVisible(el: HTMLElement | null): boolean {
  if (!el || document.visibilityState !== 'visible' || el.getClientRects().length === 0) return false;
  return getComputedStyle(el).visibility !== 'hidden' && !el.closest('[inert]');
}

/**
 * Sticky pill bar under the study header. Scroll-spy (an IntersectionObserver line a
 * third of the way down the pane) marks the section being read with aria-current; sections updated by the conversation carry a
 * gold dot until the reader has visited them. Scrolls horizontally on narrow panes.
 */
export function StudyNavigation({ sections, scrollRoot, stickyOffset }: StudyNavigationProps) {
  const { updatedSections, markSectionSeen } = useStudyUI();
  const t = useT('study');
  const tc = useT('common');
  const [active, setActive] = useState<SectionId | undefined>(sections[0]);
  const [present, setPresent] = useState<SectionId[]>(sections);
  const lockUntil = useRef(0);
  const listRef = useRef<HTMLUListElement>(null);

  /* ---------- edges that hide more pills: fades + chevrons (mouse), wheel scrolls the strip ---------- */
  const { edges: fade, scrollByPage } = useScrollStrip(listRef, [present]);

  /* ---------- scroll-spy ---------- */
  useEffect(() => {
    const root = scrollRoot.current;
    // Only sections that actually rendered get a pill.
    const mounted = sections.filter((id) => document.getElementById(sectionDomId(id)));
    setPresent(mounted);
    if (!root || mounted.length === 0) return;
    const els = mounted.map((id) => [id, document.getElementById(sectionDomId(id))!] as const);

    // The reading line sits a third of the way down the visible pane (below the sticky bar).
    const readingLine = () => Math.round(stickyOffset + (root.clientHeight - stickyOffset) * READING_LINE);
    const compute = () => {
      if (performance.now() < lockUntil.current) return;
      // At the bottom the last section counts as read — but only once the pane actually scrolls
      // (while a study is still loading it may fit the pane, which is not "the bottom").
      if (root.scrollTop > 0 && root.scrollTop + root.clientHeight >= root.scrollHeight - 4) {
        setActive(mounted[mounted.length - 1]);
        return;
      }
      const rootTop = root.getBoundingClientRect().top;
      const line = readingLine();
      let current = mounted[0];
      for (const [id, el] of els) {
        if (el.getBoundingClientRect().top - rootTop <= line) current = id;
        else break;
      }
      setActive(current);
    };

    // A 1px IntersectionObserver band at the reading line fires whenever a section edge crosses it.
    let io: IntersectionObserver | undefined;
    const observe = () => {
      io?.disconnect();
      if (typeof IntersectionObserver === 'undefined') return;
      const line = readingLine();
      io = new IntersectionObserver(compute, {
        root,
        rootMargin: `-${line}px 0px -${Math.max(0, root.clientHeight - line - 1)}px 0px`,
        threshold: 0,
      });
      for (const [, el] of els) io.observe(el);
    };
    observe();
    compute();

    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(() => {
      observe();
      compute();
    });
    ro?.observe(root);

    // The last section may never reach the line: settle on it at the bottom (and on the first at the top).
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (root.scrollTop < 8 || root.scrollTop + root.clientHeight >= root.scrollHeight - 4) compute();
      });
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io?.disconnect();
      ro?.disconnect();
      cancelAnimationFrame(raf);
      root.removeEventListener('scroll', onScroll);
    };
  }, [sections, scrollRoot, stickyOffset]);

  /* ---------- clear the gold dot once an updated section has been read ---------- */
  useEffect(() => {
    if (!active || !updatedSections.has(active)) return;
    const timer = window.setTimeout(() => {
      // The pane may be hidden (phone: chat tab, or behind the Inspector): only count it as seen when visible.
      if (isReaderVisible(scrollRoot.current)) markSectionSeen(active);
    }, SEEN_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [active, updatedSections, markSectionSeen, scrollRoot]);

  /* ---------- keep the active pill visible in the horizontal strip ---------- */
  useEffect(() => {
    const list = listRef.current;
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    const item = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!item) return;
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: scrollBehavior() });
  }, [active]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    lockUntil.current = performance.now() + CLICK_LOCK_MS;
    setActive(id);
    scrollToSectionSettled(id);
    focusSectionHeading(id);
  };

  return (
    <nav className={styles.nav} aria-label={t('nav.label')}>
      {/* Mouse affordance only: keyboard users reach every pill with Tab (the strip follows focus). */}
      {fade.start && (
        <button type="button" className={cx(styles.edge, styles.edgeStart)} tabIndex={-1} aria-hidden="true" onClick={() => scrollByPage(-1)}>
          <ChevronLeft />
        </button>
      )}
      {fade.end && (
        <button type="button" className={cx(styles.edge, styles.edgeEnd)} tabIndex={-1} aria-hidden="true" onClick={() => scrollByPage(1)}>
          <ChevronRight />
        </button>
      )}
      <ul ref={listRef} className={styles.list} data-fade-start={fade.start || undefined} data-fade-end={fade.end || undefined}>
        {present.map((id) => {
          const Icon = SECTION_ICONS[id];
          const isActive = active === id;
          const updated = updatedSections.has(id);
          return (
            <li key={id} className={styles.item}>
              <a
                href={`#${sectionDomId(id)}`}
                data-id={id}
                className={cx(styles.pill, isActive && styles.active)}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => onClick(e, id)}
              >
                <Icon aria-hidden="true" className={styles.icon} />
                <span>{tc(`section.${id}`)}</span>
                {updated && (
                  <>
                    <span className={styles.dot} aria-hidden="true" />
                    <span className="visually-hidden"> {t('nav.updated')}</span>
                  </>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
