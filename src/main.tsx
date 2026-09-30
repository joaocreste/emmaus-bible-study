/**
 * Composition root: providers (data) → engine (logic) → session (state) → UI.
 * The registry and engine are created once; swapping in a remote provider or a
 * different engine happens here, without touching the UI.
 *
 * The engine is the InferenceStudyEngine (docs/INFERENCE.md): curated studies open
 * locally; anything else is composed live from the knowledge base by the local
 * inference server when it is available and the reader has "Live composition" on,
 * and falls back to the LocalStudyEngine's library path otherwise.
 *
 * The engine is loaded on demand (its own chunk), prefetched once the welcome
 * screen is idle, so the first paint does not wait for it.
 *
 * Language (docs/I18N.md): <App> mounts the <I18nProvider> for the reader's locale
 * (settings, first visit = browser language); the session passes it to every engine call.
 */
import './styles/fonts';
import './styles/tokens.css';
import './styles/base.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { I18nProvider } from './i18n/I18nProvider';
import type { StudyRegenerator } from './engine/InferenceStudyEngine';
import type { StudyEngine } from './engine/types';
import { inferenceClient } from './inference/client';
import { ProvidersProvider } from './providers/ProvidersContext';
import { createProviderRegistry } from './providers/registry';
import type { ProviderRegistry } from './providers/types';
import { SessionProvider } from './state/session';
import { applyReaderSettings, currentSettings, loadSettings } from './state/settings';
import { BootError } from './ui/shell/BootError';
import { whenIdle } from './ui/shell/lazyPanes';

// Paint the saved theme, reading scale and language before the first render (no flash of the wrong theme).
const saved = loadSettings();
applyReaderSettings(saved);

const container = document.getElementById('root');
if (!container) throw new Error('Emmaus: #root element missing from index.html');
const root = createRoot(container);

try {
  const registry = createProviderRegistry();
  const engine = lazyEngine(registry);
  whenIdle(() => engine.preload());
  root.render(
    <StrictMode>
      <ProvidersProvider registry={registry}>
        <SessionProvider engine={engine}>
          <App />
        </SessionProvider>
      </ProvidersProvider>
    </StrictMode>,
  );
} catch (error) {
  console.error('[Emmaus] Failed to start:', error);
  root.render(
    <StrictMode>
      <I18nProvider locale={saved.locale}>
        <BootError error={error} />
      </I18nProvider>
    </StrictMode>,
  );
}

/**
 * A StudyEngine that loads the InferenceStudyEngine (and the LocalStudyEngine it wraps)
 * on first use. A failed chunk load is not cached: the session shows its gentle error,
 * and "Try again" loads afresh.
 */
function lazyEngine(registry: ProviderRegistry): StudyEngine & StudyRegenerator & { preload(): void } {
  type Engine = StudyEngine & StudyRegenerator;
  let loading: Promise<Engine> | undefined;
  const load = () =>
    (loading ??= import('./engine/InferenceStudyEngine')
      .then(
        (m): Engine =>
          new m.InferenceStudyEngine(registry, {
            client: inferenceClient,
            isEnabled: () => currentSettings().liveComposition,
          }),
      )
      .catch((error: unknown) => {
        loading = undefined;
        throw error;
      }));
  return {
    respond: (message, ctx) => load().then((e) => e.respond(message, ctx)),
    openStudy: (query, ctx) => load().then((e) => e.openStudy(query, ctx)),
    regenerate: (study, ctx) => load().then((e) => e.regenerate(study, ctx)),
    preload: () => void load().catch(() => {}),
  };
}

