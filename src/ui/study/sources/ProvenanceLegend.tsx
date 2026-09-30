import { ArrowRight } from 'lucide-react';
import { useId } from 'react';
import { CONTENT_KINDS, VERIFICATIONS } from '../../../domain/provenance';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { rich } from '../../common/rich';
import { ProvenanceTag } from '../../primitives';
import styles from './ProvenanceLegend.module.css';

const CHAIN = ['claim', 'source', 'author', 'work', 'location', 'link'] as const;

interface ProvenanceLegendProps {
  /** heading level of the legend's title (its sub-headings are one level deeper) */
  headingLevel?: 3 | 4;
  className?: string;
}

/**
 * "How to read the labels": every content kind with its tag and plain-language
 * description, the verification states, how each is set on the page, and the
 * principle claim → source → author → work → location → link.
 */
export function ProvenanceLegend({ headingLevel = 3, className }: ProvenanceLegendProps) {
  const H = headingLevel === 3 ? 'h3' : 'h4';
  const H2 = headingLevel === 3 ? 'h4' : 'h5';
  const titleId = useId();
  const { locale } = useI18n();
  const t = useT('sources');
  const tp = useT('provenance');
  return (
    <section className={cx(styles.legend, className)} aria-labelledby={titleId}>
      <H id={titleId} className={cx('t-display', styles.title)}>
        {t('legend.title')}
      </H>
      <p className={styles.intro}>{t('legend.intro')}</p>

      <ol className={styles.chain} aria-label={t('legend.chainLabel')}>
        {CHAIN.map((step, i) => (
          <li key={step} className={styles.step}>
            <span className={styles.stepText}>{t(`legend.chain.${step}`)}</span>
            {i < CHAIN.length - 1 && <ArrowRight aria-hidden="true" className={styles.arrow} />}
          </li>
        ))}
      </ol>

      <div className={styles.columns}>
        <div>
          <H2 className={styles.subTitle}>{t('legend.kinds')}</H2>
          <dl className={styles.list}>
            {CONTENT_KINDS.map((k) => (
              <div key={k} className={styles.row}>
                <dt className={styles.term}>
                  <ProvenanceTag kind={k} />
                </dt>
                <dd className={styles.desc}>{tp(`kind.${k}.description`)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <H2 className={styles.subTitle}>{t('legend.verification')}</H2>
          <dl className={styles.list}>
            {VERIFICATIONS.map((v) => (
              <div key={v} className={styles.row}>
                <dt className={cx(styles.term, styles.verification, v === 'unverified' && styles.unverified)}>{tp(`verification.${v}`)}</dt>
                <dd className={styles.desc}>{t(`legend.verification.${v}`)}</dd>
              </div>
            ))}
          </dl>

          <H2 className={styles.subTitle}>{t('legend.onThePage')}</H2>
          <ul className={styles.samples}>
            <li>{rich(t('legend.sample.serif'), { serif: (w) => <span className={styles.sampleSerif}>{w}</span> })}</li>
            <li>{rich(t('legend.sample.quote'), { quote: (w) => <span className={styles.sampleQuote}>{w}</span> })}</li>
            <li>
              {rich(t('legend.sample.summary'), {
                summary: (w) => <span className={styles.sampleSummary}>{w}</span>,
                i: (w) => <i>{w}</i>,
              })}
            </li>
            <li>{rich(t('legend.sample.synthesis'), { synthesis: (w) => <span className={styles.sampleSynthesis}>{w}</span> })}</li>
            <li>{rich(t('legend.sample.generated'), { generated: (w) => <span className={styles.sampleGenerated}>{w}</span> })}</li>
            {locale !== 'en' && (
              <>
                <li>{rich(t('legend.sample.inEnglish'), { mark: (w) => <span className={styles.sampleEnglish}>{w}</span> })}</li>
                <li>{rich(t('legend.sample.freeTranslation'), { mark: (w) => <span className={styles.sampleFree}>{w}</span> })}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
