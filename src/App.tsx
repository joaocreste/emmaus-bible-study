import { useCallback, useEffect, useState } from 'react';
import styles from './App.module.css';
import { I18nProvider, useT } from './i18n/I18nProvider';
import { useSession } from './state/session';
import { Inspector } from './ui/inspector/Inspector';
import { AppShell } from './ui/shell/AppShell';
import { CommandPalette } from './ui/shell/CommandPalette';
import { PaneErrorBoundary } from './ui/shell/PaneErrorBoundary';

/**
 * Application root: the interface language (from the reader's settings), the
 * responsive shell (welcome → chat + study), the command palette (⌘K / Ctrl-K / "/"),
 * and the single app-level Inspector.
 * Expects <ProvidersProvider> and <SessionProvider> above it (see main.tsx).
 * `<html lang>` follows the locale too (applyReaderSettings in state/settings.ts).
 */
export function App() {
  const { settings } = useSession();
  return (
    <I18nProvider locale={settings.locale}>
      <AppFrame />
    </I18nProvider>
  );
}

function AppFrame() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openSearch = useCallback(() => setPaletteOpen(true), []);
  const t = useT('shell');
  const title = t('document.title');
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <div className={styles.root}>
      <AppShell onOpenSearch={openSearch} />
      <PaneErrorBoundary pane="search" silent>
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </PaneErrorBoundary>
      <InspectorBoundary />
    </div>
  );
}

/** The inspector resets its error state whenever a different target is opened. */
function InspectorBoundary() {
  const { inspector } = useSession();
  return (
    <PaneErrorBoundary pane="inspector" resetKey={inspector} silent>
      <Inspector />
    </PaneErrorBoundary>
  );
}
