import type { LiteraryFeature } from '../../../domain/models';
import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { RefChipRow } from '../context/RefChipRow';
import { StudyItemCard } from '../context/StudyItemCard';
import { Paragraphs } from '../context/SynthesisBlock';
import { drawAsChiasm } from './chiasm';
import { ChiasmDiagram, StructureList } from './ChiasmDiagram';
import styles from './FeatureCard.module.css';
import { FEATURE_ICON } from './featureTypes';

/** A literary feature (repetition, parallelism, chiasm…) with its structure diagram when one is given. */
export function FeatureCard({ feature }: { feature: LiteraryFeature }) {
  const t = useT('literary');
  const Icon = FEATURE_ICON[feature.type];
  const titleId = `lit-title-${feature.id}`;
  const structure = feature.structure ?? [];
  const mirrored = drawAsChiasm(feature.type, structure);
  return (
    <StudyItemCard
      itemId={feature.id}
      as="li"
      labelledBy={titleId}
      className={cx(styles.card, structure.length > 0 && styles.wide)}
    >
      <p className={styles.eyebrow} title={t(`feature.${feature.type}.explanation`)}>
        <Icon aria-hidden="true" className={styles.icon} />
        {t(`feature.${feature.type}.label`)}
      </p>
      <h4 id={titleId} className={styles.title}>
        <ScriptText text={feature.title} />
      </h4>
      <Paragraphs text={feature.description} className={styles.description} />
      {structure.length > 0 &&
        (mirrored ? (
          <ChiasmDiagram lines={structure} label={t('feature.proposedStructure', { title: feature.title })} />
        ) : (
          <StructureList lines={structure} label={t('feature.structure', { title: feature.title })} />
        ))}
      <RefChipRow verses={feature.verses} label={t('refs.verses')} />
      <ProvenanceLine provenance={feature.provenance} />
    </StudyItemCard>
  );
}
