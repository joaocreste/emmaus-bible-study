import { PanelLeftClose, PanelLeftOpen, Search, SquarePen } from 'lucide-react';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { useSession } from '../../state/session';
import { CrossMark, IconButton } from '../primitives';
import { focusWelcomeStart } from '../welcome/welcomeFocus';
import { LanguageMenu } from './LanguageMenu';
import { ReaderSettings } from './ReaderSettings';
import styles from './TopBar.module.css';
import { TranslationSelect } from './TranslationSelect';
import type { Breakpoint } from './useMediaQuery';

interface TopBarProps {
  breakpoint: Breakpoint;
  onOpenSearch(): void;
}

/** 60px application bar: emblem + wordmark, current study, search, language, translation, reader settings, layout toggles. */
export function TopBar({ breakpoint, onOpenSearch }: TopBarProps) {
  const { phase, study, chatCollapsed, toggleChat, reset } = useSession();
  const t = useT('shell');
  const isPhone = breakpoint === 'phone';
  const inStudy = phase === 'study';
  const aligned = inStudy && !isPhone && !chatCollapsed;
  // "New study" unmounts with the study: move focus to the welcome question (the brand button stays mounted).
  const startNew = () => {
    reset();
    focusWelcomeStart();
  };

  return (
    <header className={cx(styles.bar, aligned && styles.aligned)}>
      <div className={styles.lead}>
        <button type="button" className={styles.brand} onClick={reset} aria-label={t('brand.home')}>
          <CrossMark size={30} className={styles.emblem} />
          <span className={styles.wordmark} aria-hidden="true">
            Emmaus
          </span>
        </button>
      </div>

      <div className={styles.middle}>
        {inStudy && study && !isPhone && (
          <p className={styles.study} title={study.title}>
            <span className={styles.studyEyebrow}>{t('studying')}</span>
            <span className={styles.studyTitle}>{study.title}</span>
          </p>
        )}
      </div>

      <div className={styles.actions}>
        {isPhone ? (
          <IconButton label={t('search.label')} icon={<Search />} onClick={onOpenSearch} />
        ) : (
          <button
            type="button"
            className={cx(styles.search, (!inStudy || breakpoint === 'desktop' || breakpoint === 'wide') && styles.searchWide)}
            onClick={onOpenSearch}
            aria-label={t('search.label')}
            aria-keyshortcuts="Meta+K Control+K /"
            title={t('search.title', { shortcut: isApple() ? '⌘K' : 'Ctrl+K' })}
          >
            <Search aria-hidden="true" className={styles.searchIcon} />
            <span className={styles.searchLabel}>
              <span className={styles.searchShort}>{t('search.short')}</span>
              <span className={styles.searchLong}>{t('search.long')}</span>
            </span>
            <kbd className={styles.kbd} aria-hidden="true">
              {isApple() ? '⌘' : 'Ctrl'} K
            </kbd>
          </button>
        )}

        <LanguageMenu />
        {!isPhone && <TranslationSelect />}
        <ReaderSettings showTranslation={isPhone} />

        {inStudy && !isPhone && (
          <IconButton
            label={chatCollapsed ? t('chat.show') : t('chat.hide')}
            icon={chatCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            aria-expanded={!chatCollapsed}
            aria-controls="conversation"
            onClick={() => toggleChat()}
          />
        )}

        {inStudy &&
          (breakpoint === 'desktop' || breakpoint === 'wide' ? (
            <button type="button" className={styles.newStudy} onClick={startNew}>
              <SquarePen aria-hidden="true" />
              <span>{t('newStudy')}</span>
            </button>
          ) : (
            <IconButton label={t('newStudy')} icon={<SquarePen />} onClick={startNew} />
          ))}
      </div>
    </header>
  );
}

function isApple(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
}
