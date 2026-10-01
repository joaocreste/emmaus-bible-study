import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties } from 'react';
import type { DashboardFocus, SectionId, Study } from '../../domain/models';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { useSession, useSessionInternals } from '../../state/session';
import { CrossDivider, CrossLoader, CrossMark } from '../primitives';
import { FocusBanner } from './FocusBanner';
import { CommentarySection } from './sections/CommentarySection';
import { CrossReferencesSection } from './sections/CrossReferencesSection';
import { HistoricalContextSection } from './sections/HistoricalContextSection';
import { KeyPassagesSection } from './sections/KeyPassagesSection';
import { LiteraryContextSection } from './sections/LiteraryContextSection';
import { OriginalLanguagesSection } from './sections/OriginalLanguagesSection';
import { ScriptureSection } from './sections/ScriptureSection';
import { SourcesSection } from './sections/SourcesSection';
import { TheologySection } from './sections/TheologySection';
import { SectionArrivalContext } from './sectionArrival';
import { visibleSections, type DashboardSectionId } from './sectionOrder';
import { KeyPoints } from './KeyPoints';
import { useStepText } from '../shell/useStepText';
import { StudyHeader } from './StudyHeader';
import { StudyNavigation } from './StudyNavigation';
import { scrollBehavior, scrollIntoViewSettled } from './StudyNavigation.utils';
import { StudyUIProvider } from './StudyUIContext';
import { verseDomId } from './scripture/ReaderView';
import { keyWordCardId } from './words/OriginalLanguageCard';
import { sectionDomId, useSectionMeta, type SectionProps } from './types';
import styles from './StudyWorkspace.module.css';

const SECTION_COMPONENTS: Record<DashboardSectionId, ComponentType<SectionProps>> = {
  scripture: ScriptureSection,
  'key-passages': KeyPassagesSection,
  'cross-references': CrossReferencesSection,
  'original-languages': OriginalLanguagesSection,
  'historical-context': HistoricalContextSection,
  'literary-context': LiteraryContextSection,
  theology: TheologySection,
  commentary: CommentarySection,
  sources: SourcesSection,
};

/**
 * Where a focus directive should land: the highlighted verse (Scripture) or word card
 * (Original languages) when it sits well below its section's heading, else the section.
 */
function focusTarget(focus: DashboardFocus): HTMLElement | null {
  if (!focus.section) return null;
  const section = document.getElementById(sectionDomId(focus.section));
  if (!section) return null;
  let precise: HTMLElement | null = null;
  if (focus.section === 'scripture' && focus.highlightVerses?.length) {
    precise = document.getElementById(verseDomId(focus.highlightVerses[0]));
  } else if (focus.section === 'original-languages' && focus.highlightWordIds?.length) {
    precise = focus.highlightWordIds.map((id) => document.getElementById(keyWordCardId(id))).find((el) => el != null) ?? null;
  }
  if (precise && precise.getBoundingClientRect().top - section.getBoundingClientRect().top > window.innerHeight * 0.4) return precise;
  return section;
}

/**
 * The study dashboard (right pane): header, sticky section navigation, focus banner
 * and the sections. `#study-main` (tabIndex -1, a skip-link target) scrolls on its own
 * unless the host pane already scrolls, in which case it flows inside it. Applies each
 * conversation focus by scrolling to its section.
 */
export function StudyWorkspace() {
  const { study, focus, focusSeq } = useSession();
  if (!study) return <EmptyWorkspace />;
  return (
    // Keyed by study: a new study starts at the top with fresh section state.
    <StudyUIProvider key={study.id} study={study} focus={focus} focusSeq={focusSeq}>
      <WorkspaceBody study={study} />
    </StudyUIProvider>
  );
}

function WorkspaceBody({ study }: { study: Study }) {
  const { focus, focusSeq, composing, liveSteps } = useSessionInternals();
  const rootRef = useRef<HTMLDivElement>(null);
  /** the element that actually scrolls: the host pane when it already scrolls, else our own root */
  const scrollRootRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [hostScrolls, setHostScrolls] = useState(false);
  const [stickyOffset, setStickyOffset] = useState(56);
  // Stable while a generated page's snapshots keep the same sections (the scroll-spy re-observes on change).
  const sectionKey = visibleSections(study).join('|');
  const sections = useMemo(() => sectionKey.split('|') as DashboardSectionId[], [sectionKey]);

  // Sections present at first render appear with the page; any that arrive later (a page still
  // being composed) fade in as they land.
  const initialSections = useRef<ReadonlySet<SectionId> | null>(null);
  initialSections.current ??= new Set(sections);
  const arrivedLate = useCallback((id: SectionId) => !initialSections.current!.has(id), []);
  const stepLines = useStepText().lines(liveSteps);

  // Adapt to the host: if the pane we are mounted in already scrolls (the app shell's <main>),
  // flow inside it; otherwise become the scroll container ourselves.
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const parent = el.parentElement;
    const scrolls = parent != null && /(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY);
    scrollRootRef.current = scrolls ? parent : el;
    // A new study starts at its title, even though the host pane outlives it.
    if (scrolls) parent.scrollTop = 0;
    setHostScrolls(scrolls);
  }, []);

  // Measure the sticky block (nav + focus banner) so sections scroll clear of it. On short
  // viewports it is not sticky (CSS), and then nothing needs clearing.
  useLayoutEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const update = () =>
      setStickyOffset(getComputedStyle(el).position === 'sticky' ? Math.round(el.getBoundingClientRect().height) : 0);
    update();
    window.addEventListener('resize', update);
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    ro?.observe(el);
    return () => {
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, []);

  // scroll-padding on the real scroll container keeps scrolled-to and keyboard-focused content clear of the sticky bar.
  useLayoutEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;
    const previous = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = `${stickyOffset}px`;
    return () => {
      root.style.scrollPaddingTop = previous;
    };
  }, [stickyOffset, hostScrolls]);

  // Apply each new focus directive's scroll once, after the sections have rendered. The effect
  // depends on focusSeq alone and its cleanup cancels pending work, so no "already applied" guard:
  // one would swallow the scroll under StrictMode, whose simulated remount cancels the first frames.
  const latest = useRef({ focus, sections });
  latest.current = { focus, sections };
  useEffect(() => {
    const target = latest.current.focus?.section;
    if (!target) return;
    let raf2 = 0;
    let cancelSettle: (() => void) | undefined;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const visible = latest.current.sections as SectionId[];
        const directive = latest.current.focus;
        if (target === 'overview' || !visible.includes(target) || !directive) {
          scrollRootRef.current?.scrollTo({ top: 0, behavior: scrollBehavior() });
        } else {
          cancelSettle = scrollIntoViewSettled(() => focusTarget(directive));
        }
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelSettle?.();
    };
  }, [focusSeq]);

  const focusMain = () => rootRef.current?.focus({ preventScroll: true });
  const t = useT('study');

  return (
    <div
      ref={rootRef}
      id="study-main"
      tabIndex={-1}
      className={cx(styles.root, !hostScrolls && styles.selfScroll)}
      style={{ '--study-sticky-offset': `${stickyOffset}px` } as CSSProperties}
    >
      <div className={styles.column}>
        <StudyHeader study={study} />
        <KeyPoints study={study} />
      </div>

      <div ref={stickyRef} className={styles.sticky}>
        <div className={styles.column}>
          <StudyNavigation sections={sections} scrollRoot={scrollRootRef} stickyOffset={stickyOffset} />
          <FocusBanner onCleared={focusMain} />
        </div>
      </div>

      <div className={styles.column}>
        <SectionArrivalContext.Provider value={arrivedLate}>
          {sections.map((id, i) => {
            const Section = SECTION_COMPONENTS[id];
            // While a page is being composed, the next section lands just before Sources — say so there.
            return (
              <Fragment key={id}>
                {composing && id === 'sources' && <ComposingNotice detail={stepLines[stepLines.length - 1]} stepKey={stepLines.length} />}
                <Section study={study} index={i + 1} />
              </Fragment>
            );
          })}
        </SectionArrivalContext.Provider>
        <ArrivalAnnouncer study={study} sections={sections} initial={initialSections.current} />
        {!composing && (
          <footer className={styles.end}>
            <CrossDivider />
            <p className={styles.endText}>{t('workspace.end')}</p>
          </footer>
        )}
      </div>
    </div>
  );
}

/**
 * A generated page still being composed: where the next section will land (just before
 * Sources), the cross loader and the latest pipeline step. The step text is not announced
 * (it changes often); ArrivalAnnouncer announces each section as it lands instead.
 */
function ComposingNotice({ detail, stepKey }: { detail?: string; stepKey: number }) {
  const t = useT('study');
  return (
    <div className={styles.composing} data-testid="composing-notice">
      <span className={styles.composingMark}>
        <CrossLoader size={22} label={t('workspace.composingLabel')} />
      </span>
      <div className={styles.composingText} aria-hidden="true">
        <p className={styles.composingTitle}>{t('workspace.composing')}</p>
        {detail && (
          <p className={styles.composingStep} key={stepKey}>
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

/** Politely announces sections that arrive after the page opened ("Section added: Divorce in the ancient world"). */
function ArrivalAnnouncer({ study, sections, initial }: { study: Study; sections: readonly SectionId[]; initial: ReadonlySet<SectionId> | null }) {
  const t = useT('study');
  const meta = useSectionMeta();
  const arrived = sections.filter((id) => id !== 'sources' && initial && !initial.has(id));
  const last = arrived[arrived.length - 1];
  const title = last ? study.layout?.sections.find((s) => s.id === last)?.title?.trim() || meta(last).title : '';
  return (
    <p className="visually-hidden" aria-live="polite" aria-atomic="true">
      {title ? t('workspace.sectionAdded', { title }) : ''}
    </p>
  );
}

/** Calm placeholder when no study is open (the welcome screen normally covers this). */
function EmptyWorkspace() {
  const t = useT('study');
  return (
    <div id="study-main" tabIndex={-1} className={styles.empty}>
      <div className={styles.emptyInner}>
        <span className={styles.arch} aria-hidden="true">
          <CrossMark variant="glyph" size={26} />
        </span>
        <h1 className={styles.emptyTitle}>{t('empty.title')}</h1>
        <p className={styles.emptyText}>{t('empty.text')}</p>
      </div>
    </div>
  );
}
