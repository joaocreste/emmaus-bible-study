import type { PipelineStep } from '../../domain/models';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { CrossLoader } from '../primitives';
import styles from './ThinkingIndicator.module.css';
import { useStepText } from '../shell/useStepText';
import { useThinkingStep } from './thinkingSteps';

/** How many live steps stay visible (newest first). */
const VISIBLE_STEPS = 3;

/**
 * Cross loader + what the engine is doing. With live steps (the inference layer streams
 * its retrieval and composition pipeline) it lists the latest few, newest first; otherwise
 * it rotates the local engine's pipeline labels. The step text itself is not announced.
 */
export function ThinkingIndicator({ text, steps = [] }: { text: string | null; steps?: readonly PipelineStep[] }) {
  const t = useT('chat');
  const live = steps.length > 0;
  const step = useThinkingStep(!live, text);
  const stepText = useStepText();
  const ts = useT('shell');
  if (!live) {
    return (
      <div className={styles.thinking}>
        <span className={styles.avatar}>
          <CrossLoader size={20} label={t('thinking.label')} />
        </span>
        <span className={styles.step} key={step} aria-hidden="true">
          {step}
        </span>
      </div>
    );
  }
  const lines = stepText.lines(steps);
  const recent = (lines.length ? lines : [ts('compose.step.starting')]).slice(-VISIBLE_STEPS).reverse();
  return (
    <div className={cx(styles.thinking, styles.live)}>
      <span className={styles.avatar}>
        <CrossLoader size={20} label={t('thinking.liveLabel')} />
      </span>
      <ol className={styles.steps} aria-hidden="true">
        {recent.map((line, i) => (
          <li key={`${lines.length - 1 - i}-${line}`} className={cx(styles.liveStep, i === 0 ? styles.current : styles.past)}>
            {line}
          </li>
        ))}
      </ol>
    </div>
  );
}
