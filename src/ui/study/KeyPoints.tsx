import { ArrowDownRight } from 'lucide-react';
import type { Study } from '../../domain/models';
import { useT } from '../../i18n/I18nProvider';
import { useSessionActions } from '../../state/session';
import { ProvenanceLine } from '../common/SourceChip';
import { Button, Disclosure } from '../primitives';
import { keyPointFocus, keyPointsOf } from './keyPointFocus';
import styles from './KeyPoints.module.css';

/** "Key points": each point of the reader's question, its cited answer, and where the page holds the evidence. */
export function KeyPoints({ study }: { study: Study }) {
  const t = useT('study');
  const { focusDashboard } = useSessionActions();
  const points = keyPointsOf(study);
  if (!points.length) return null;
  const headingId = `key-points-${study.id}`;
  return (
    <section className={styles.keyPoints} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.heading}>
        {t('keyPoints.title')}
      </h2>
      <ol className={styles.list}>
        {points.map((c) => (
          <li key={c.id} className={styles.item}>
            <Disclosure summary={<span className={styles.label}>{c.label}</span>}>
              <div className={styles.answer} data-verification={c.answer.provenance.verification === 'generated' ? 'generated' : undefined}>
                <p className={styles.answerText}>{c.answer.text}</p>
                <ProvenanceLine provenance={c.answer.provenance} />
                <Button
                  variant="quiet"
                  size="sm"
                  icon={<ArrowDownRight aria-hidden="true" />}
                  onClick={() => focusDashboard(keyPointFocus(c, t('keyPoints.reason', { label: c.label })))}
                >
                  {t('keyPoints.show')}
                </Button>
              </div>
            </Disclosure>
          </li>
        ))}
      </ol>
    </section>
  );
}
