import { BookOpenText, Library, MessagesSquare } from 'lucide-react';
import { useT } from '../../i18n/I18nProvider';
import type { MobilePane } from '../../state/types';
import { useSession } from '../../state/session';
import styles from './MobileTabBar.module.css';

const TABS: { pane: MobilePane; label: 'tabs.chat' | 'tabs.study' | 'tabs.sources'; icon: typeof BookOpenText; controls: string }[] = [
  { pane: 'chat', label: 'tabs.chat', icon: MessagesSquare, controls: 'conversation' },
  { pane: 'study', label: 'tabs.study', icon: BookOpenText, controls: 'study' },
  { pane: 'sources', label: 'tabs.sources', icon: Library, controls: 'sources' },
];

/** iPhone-style pane switcher (Chat | Study | Sources), safe-area aware. */
export function MobileTabBar() {
  const { mobilePane, setMobilePane, studyUpdatedWhileAway } = useSession();
  const t = useT('shell');
  return (
    <nav className={styles.bar} aria-label={t('tabs.label')}>
      <ul className={styles.list}>
        {TABS.map(({ pane, label, icon: Icon, controls }) => {
          const active = mobilePane === pane;
          const dot = pane === 'study' && studyUpdatedWhileAway;
          return (
            <li key={pane} className={styles.item}>
              <button
                type="button"
                className={styles.tab}
                aria-current={active ? 'page' : undefined}
                aria-controls={controls}
                onClick={() => setMobilePane(pane)}
              >
                <span className={styles.iconWrap}>
                  <Icon aria-hidden="true" className={styles.icon} />
                  {dot && <span className={styles.dot} aria-hidden="true" />}
                </span>
                <span className={styles.label}>
                  {t(label)}
                  {dot && <span className="visually-hidden"> {t('tabs.updated')}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
