import { RotateCcw } from 'lucide-react';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import styles from './RetryButton.module.css';

/**
 * "Try again" for a resource that failed to load (offline, a server hiccup). Failures are
 * never cached (src/ui/hooks/resourceCache.ts), so this simply asks the provider again.
 */
export function RetryButton({ onRetry, label, className }: { onRetry(): void; label?: string; className?: string }) {
  const t = useT('common');
  return (
    <button type="button" className={cx(styles.retry, className)} onClick={onRetry}>
      <RotateCcw aria-hidden="true" />
      <span>{label ?? t('action.tryAgain')}</span>
    </button>
  );
}
