import { useId, useMemo, useState } from 'react';
import type { PassageRef, Provenance, TranslationId } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { ProvenanceLine } from '../../common/SourceChip';
import { RetryButton } from '../../common/RetryButton';
import { usePassage } from '../../hooks/data';
import { Button, CrossLoader } from '../../primitives';
import styles from './HeadingOutline.module.css';
import { headingOutline } from './outline';
import { PassageOutlineList } from './PassageOutlineList';

const INITIAL = 12;

/**
 * Outline of a passage built from its translation's section headings (library
 * studies). Labelled honestly: the headings are the translators' additions.
 */
export function HeadingOutline({ passage, translation }: { passage: PassageRef; translation: TranslationId }) {
  const state = usePassage(passage, translation);
  const [showAll, setShowAll] = useState(false);
  const listId = useId();
  const i18n = useI18n();
  const t = useT('literary');
  const opening = t('headings.opening');
  const segments = useMemo(() => (state.data ? headingOutline(state.data, opening) : []), [state.data, opening]);
  const label = i18n.ref(passage);

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <div className={styles.status}>
        <CrossLoader size={18} label={t('headings.loadingLabel', { ref: label })} />
        <span aria-hidden="true">{t('headings.loading')}</span>
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <p className={styles.status}>
        {t('headings.error', { ref: label })} <RetryButton onRetry={state.retry} />
      </p>
    );
  }
  if (segments.length === 0) {
    return (
      <p className={styles.status}>{t('headings.none', { translation: state.data.translation, ref: label })}</p>
    );
  }

  const visible = showAll ? segments : segments.slice(0, INITIAL);
  const provenance: Provenance = {
    kind: 'literary',
    verification: 'source-derived',
    citations: [{ sourceId: state.data.sourceId, locator: t('headings.locator') }],
  };

  return (
    <div className={styles.wrap}>
      <p className={styles.note}>{t('headings.note', { translation: state.data.translation })}</p>
      <div id={listId}>
        <PassageOutlineList segments={visible} label={t('headings.listLabel', { ref: label, translation: state.data.translation })} />
      </div>
      {segments.length > INITIAL && (
        <Button
          variant="ghost"
          size="sm"
          className={styles.more}
          aria-expanded={showAll}
          aria-controls={listId}
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? t('headings.showFewer') : t('headings.showAll', { count: segments.length })}
        </Button>
      )}
      <ProvenanceLine provenance={provenance} />
    </div>
  );
}
