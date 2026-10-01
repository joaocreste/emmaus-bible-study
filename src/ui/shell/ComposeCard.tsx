import { useEffect, useState } from 'react';
import type { PipelineStep } from '../../domain/models';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { useSessionInternals } from '../../state/session';
import { CrossLoader } from '../primitives';
import { elapsedLabel } from './composeSteps';
import { useStepText } from './useStepText';
import styles from './ComposeCard.module.css';

/** Steps listed under the current one (fading). */
const PAST_STEPS = 2;

/**
 * A new study is being composed and none of it has arrived yet (the research phase takes
 * a minute or more): a card in the middle of the page with the cross loader, the question,
 * what the model is doing now and how long it has been working. It gives way to the page
 * as soon as the first sections land (the workspace's composing notice takes over).
 */
export function ComposeCard() {
  const { status, livePhase, composing, liveSteps, pendingText } = useSessionInternals();
  if (status !== 'thinking' || livePhase !== 'compose' || composing) return null;
  return <ComposeCardView question={pendingText} steps={liveSteps} />;
}

export function ComposeCardView({ question, steps, startedAt }: { question: string | null; steps: readonly PipelineStep[]; startedAt?: number }) {
  const t = useT('shell');
  const stepText = useStepText();
  const elapsed = useElapsed(startedAt);
  const lines = stepText.lines(steps);
  const current = lines[lines.length - 1] ?? t('compose.step.starting');
  const past = lines.slice(-1 - PAST_STEPS, -1).reverse();
  return (
    <div className={styles.overlay} data-testid="compose-card">
      <section className={styles.card} aria-labelledby="compose-card-title" aria-describedby="compose-card-hint">
        <span className={styles.mark}>
          <CrossLoader size={46} label={t('compose.label')} />
        </span>
        <p className={styles.eyebrow}>{t('compose.eyebrow')}</p>
        <h2 id="compose-card-title" className={styles.title}>
          {t('compose.title')}
        </h2>
        {question && <p className={styles.question}>{t('compose.question', { question })}</p>}
        <ol className={styles.steps} aria-hidden="true">
          <li className={cx(styles.step, styles.current)} key={`${lines.length}-${current}`}>
            {current}
          </li>
          {past.map((line, i) => (
            <li className={cx(styles.step, styles.past)} key={`${lines.length - 2 - i}-${line}`}>
              {line}
            </li>
          ))}
        </ol>
        <p id="compose-card-hint" className={styles.hint}>
          <span className={styles.elapsed} aria-hidden="true">
            {elapsedLabel(elapsed)}
          </span>
          <span>{t('compose.hint')}</span>
        </p>
      </section>
    </div>
  );
}

/** Milliseconds since the card appeared (or since `startedAt`), ticking every second. */
function useElapsed(startedAt?: number): number {
  const [start] = useState(() => startedAt ?? Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now - start;
}
