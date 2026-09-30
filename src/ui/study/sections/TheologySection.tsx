import { useT } from '../../../i18n/I18nProvider';
import { EmptyState } from '../context/EmptyState';
import { SubHeading } from '../context/SubHeading';
import { pinnedFirst, useStudyUI } from '../StudyUIContext';
import { StudySection } from '../StudySection';
import { PerspectiveCard } from '../theology/PerspectiveCard';
import { ThemeCard } from '../theology/ThemeCard';
import type { SectionProps } from '../types';
import styles from './TheologySection.module.css';

/**
 * Theology — the doctrines the text raises (theme cards), then "Where Christians
 * differ": one PerspectiveCard per curated question, only where the difference is real.
 */
export function TheologySection({ study, index }: SectionProps) {
  const { pinnedIds } = useStudyUI();
  const t = useT('theology');
  const themes = pinnedFirst(study.theology, pinnedIds);
  const sets = pinnedFirst(study.perspectives, pinnedIds);

  return (
    <StudySection id="theology" index={index}>
      {themes.length === 0 && sets.length === 0 && (
        <EmptyState size="sm" title={t('empty.title')}>
          <p>{t('empty.text')}</p>
        </EmptyState>
      )}

      {themes.length > 0 && (
        <>
          <SubHeading id="theology-themes">{t('heading.doctrines')}</SubHeading>
          <ul className={styles.themes} aria-labelledby="theology-themes">
            {themes.map((t) => (
              <ThemeCard key={t.id} theme={t} />
            ))}
          </ul>
        </>
      )}

      {sets.length > 0 && (
        <>
          <SubHeading id="theology-perspectives" note={t('note.differ')}>
            {t('heading.differ')}
          </SubHeading>
          <div className={styles.perspectives}>
            {sets.map((s) => (
              <PerspectiveCard key={s.id} set={s} />
            ))}
          </div>
        </>
      )}
    </StudySection>
  );
}
