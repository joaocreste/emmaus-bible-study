import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useT } from '../../i18n/I18nProvider';
import { CrossMark } from '../primitives';
import styles from './PaneErrorBoundary.module.css';

/** The areas a boundary protects (named in the reader's language in the fallback). */
export type PaneId = 'conversation' | 'study' | 'sources' | 'welcome' | 'search' | 'inspector';

interface Props {
  /** what failed ("the study", "the conversation") */
  pane: PaneId;
  /** changing this value clears the error (e.g. the study id) */
  resetKey?: unknown;
  children: ReactNode;
  /** render nothing on error (for overlays such as the inspector) */
  silent?: boolean;
}

interface State {
  error: Error | null;
}

/**
 * Keeps a failure in one pane from taking down the whole app: the chat keeps
 * working if the dashboard fails, and vice versa.
 */
export class PaneErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[Emmaus] The ${this.props.pane} pane failed to render:`, error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.silent) return null;
    return <PaneFallback pane={this.props.pane} onRetry={() => this.setState({ error: null })} />;
  }
}

function PaneFallback({ pane, onRetry }: { pane: PaneId; onRetry(): void }) {
  const t = useT('shell');
  const tc = useT('common');
  const title =
    pane === 'conversation' || pane === 'study' || pane === 'sources' || pane === 'welcome'
      ? t(`paneError.title.${pane}`)
      : t('paneError.title.other');
  return (
    <div className={styles.fallback} role="alert">
      <CrossMark size={36} className={styles.mark} />
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{t('paneError.text')}</p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        {tc('action.tryAgain')}
      </button>
    </div>
  );
}
