import { Suspense, useEffect, type MouseEvent } from 'react';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { useSession } from '../../state/session';
import { Welcome } from '../welcome/Welcome';
import styles from './AppShell.module.css';
import { ChatPanel, PaneLoading, preloadStudyPanes, SourcesPanel, StudyWorkspace, whenIdle } from './lazyPanes';
import { MobileTabBar } from './MobileTabBar';
import { PaneErrorBoundary } from './PaneErrorBoundary';
import { StudyEmptyState } from './StudyEmptyState';
import { StudyUpdatedToast } from './StudyUpdatedToast';
import { TopBar } from './TopBar';
import { useBreakpoint, useFinePointer } from './useMediaQuery';

interface AppShellProps {
  onOpenSearch(): void;
}

/**
 * Page frame and responsive layout (docs/DESIGN.md §4):
 *   phone   < 760px     one pane at a time + bottom tabs (Chat | Study | Sources)
 *   tablet  760–1179px  chat 340px (collapsible) | study
 *   desktop ≥ 1180px    chat 400px | study
 *   wide    ≥ 1600px    chat 420px | study
 * Chat and study scroll independently inside a 100dvh frame; `<main id="study">`
 * is the study's scroll container.
 *
 * Landmarks: in the split layout the conversation is `complementary` beside the
 * study `main`. On phone only one pane is visible; the others are hidden and
 * inert, so whichever pane is showing takes the `main` role (and an H1) — the page
 * always exposes exactly one main landmark. Element types never change between
 * layouts, so rotating a phone across 760px does not remount the panes.
 */
export function AppShell({ onOpenSearch }: AppShellProps) {
  const { phase, study, mobilePane, chatCollapsed, setMobilePane } = useSession();
  const t = useT('shell');
  const breakpoint = useBreakpoint();
  const finePointer = useFinePointer();
  const isPhone = breakpoint === 'phone';
  const inStudy = phase === 'study';
  const collapsed = chatCollapsed && !isPhone;

  // The study-phase panes are separate chunks: fetch them while the reader looks at the welcome screen.
  useEffect(() => whenIdle(preloadStudyPanes), []);

  const skipToMain = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // On phone the study may be a hidden (inert) pane: show it first, then move focus once it is interactive.
    if (isPhone && inStudy && mobilePane !== 'study') setMobilePane('study');
    requestAnimationFrame(() => document.getElementById('study')?.focus({ preventScroll: true }));
  };

  return (
    <div className={styles.app} data-phase={phase} data-chat={collapsed ? 'collapsed' : 'open'}>
      <a className="skip-link" href="#study" onClick={skipToMain}>
        {inStudy ? t('skip.study') : t('skip.content')}
      </a>

      <TopBar breakpoint={breakpoint} onOpenSearch={onOpenSearch} />

      {inStudy ? (
        <div className={styles.workspace} data-layout={isPhone ? 'panes' : 'split'}>
          <section
            id="conversation"
            aria-label={t('pane.conversation')}
            role={isPhone ? (mobilePane === 'chat' ? 'main' : undefined) : 'complementary'}
            className={cx(styles.pane, styles.chatPane)}
            data-active={isPhone ? mobilePane === 'chat' : !collapsed}
            inert={isPhone ? mobilePane !== 'chat' : collapsed}
          >
            <PaneErrorBoundary pane="conversation">
              <Suspense fallback={<PaneLoading label={t('loading.conversation')} />}>
                <ChatPanel
                  autoFocusComposer={finePointer && !isPhone}
                  headingLevel={isPhone ? 1 : 2}
                  dock={isPhone ? <StudyUpdatedToast /> : undefined}
                />
              </Suspense>
            </PaneErrorBoundary>
          </section>

          <main
            id="study"
            tabIndex={-1}
            aria-label={study ? t('pane.studyNamed', { title: study.title }) : t('pane.study')}
            className={cx(styles.pane, styles.studyPane)}
            data-active={isPhone ? mobilePane === 'study' : true}
            inert={isPhone && mobilePane !== 'study'}
          >
            <PaneErrorBoundary pane="study" resetKey={study?.id}>
              <Suspense fallback={<PaneLoading label={t('loading.study')} />}>
                {study ? <StudyWorkspace /> : <StudyEmptyState />}
              </Suspense>
            </PaneErrorBoundary>
          </main>

          {isPhone && (
            <section
              id="sources"
              aria-label={t('pane.sources')}
              role={mobilePane === 'sources' ? 'main' : undefined}
              className={cx(styles.pane, styles.sourcesPane)}
              data-active={mobilePane === 'sources'}
              inert={mobilePane !== 'sources'}
            >
              <h1 className="visually-hidden">{study ? t('pane.sourcesNamed', { title: study.title }) : t('pane.sources')}</h1>
              <PaneErrorBoundary pane="sources" resetKey={study?.id}>
                <Suspense fallback={<PaneLoading label={t('loading.sources')} />}>
                  {study ? <SourcesPanel /> : <StudyEmptyState variant="sources" />}
                </Suspense>
              </PaneErrorBoundary>
            </section>
          )}
        </div>
      ) : (
        <main id="study" tabIndex={-1} className={styles.welcomePane}>
          <PaneErrorBoundary pane="welcome">
            <Welcome />
          </PaneErrorBoundary>
        </main>
      )}

      {inStudy && isPhone && <MobileTabBar />}
    </div>
  );
}
