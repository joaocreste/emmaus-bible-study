import type { TheologyTheme } from '../../../domain/models';
import { useT } from '../../../i18n/I18nProvider';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { MoreDetail } from '../context/MoreDetail';
import { RefChipRow } from '../context/RefChipRow';
import { StudyItemCard } from '../context/StudyItemCard';
import { Paragraphs } from '../context/SynthesisBlock';
import { THEOLOGY_CATEGORY } from './labels';
import styles from './ThemeCard.module.css';

/** A doctrinal theme the passage raises: category eyebrow, title, summary, key verses, detail on demand. */
export function ThemeCard({ theme }: { theme: TheologyTheme }) {
  const t = useT('theology');
  const meta = THEOLOGY_CATEGORY[theme.category];
  const Icon = meta.icon;
  const titleId = `theme-title-${theme.id}`;
  return (
    <StudyItemCard itemId={theme.id} as="li" labelledBy={titleId} className={styles.card}>
      <p className={styles.eyebrow} title={t(`category.${theme.category}.gloss`)}>
        <Icon aria-hidden="true" className={styles.icon} />
        {t(`category.${theme.category}.label`)}
      </p>
      <h4 id={titleId} className={styles.title}>
        <ScriptText text={theme.title} />
      </h4>
      <p className={styles.summary}>
        <ScriptText text={theme.summary} />
      </p>
      {theme.detail && (
        <MoreDetail itemId={theme.id} about={theme.title}>
          <Paragraphs text={theme.detail} className={styles.detail} />
        </MoreDetail>
      )}
      <RefChipRow refs={theme.keyVerses} label={t('theme.keyVerses')} />
      <ProvenanceLine provenance={theme.provenance} />
    </StudyItemCard>
  );
}
