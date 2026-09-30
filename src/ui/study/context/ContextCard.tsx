import type { ContextItem } from '../../../domain/models';
import { useT } from '../../../i18n/I18nProvider';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { CONTEXT_CATEGORY_ICON } from './categories';
import styles from './ContextCard.module.css';
import { MoreDetail } from './MoreDetail';
import { RefChipRow } from './RefChipRow';
import { Paragraphs } from './SynthesisBlock';
import { StudyItemCard } from './StudyItemCard';

/** Historical & cultural context item: category eyebrow, title, summary, detail on demand, verses, provenance. */
export function ContextCard({ item }: { item: ContextItem }) {
  const t = useT('context');
  const Icon = CONTEXT_CATEGORY_ICON[item.category];
  const titleId = `ctx-title-${item.id}`;
  return (
    <StudyItemCard itemId={item.id} as="li" labelledBy={titleId} className={styles.card}>
      <p className={styles.eyebrow}>
        <Icon aria-hidden="true" className={styles.icon} />
        {t(`category.${item.category}`)}
      </p>
      <h3 id={titleId} className={styles.title}>
        <ScriptText text={item.title} />
      </h3>
      <p className={styles.summary}>
        <ScriptText text={item.summary} />
      </p>
      {item.detail && (
        <MoreDetail itemId={item.id} about={item.title}>
          <Paragraphs text={item.detail} className={styles.detail} />
        </MoreDetail>
      )}
      <RefChipRow verses={item.relatedVerses} label={t('refs.verses')} />
      <ProvenanceLine provenance={item.provenance} />
    </StudyItemCard>
  );
}
