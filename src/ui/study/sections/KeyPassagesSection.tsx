import { useT } from '../../../i18n/I18nProvider';
import { useSession } from '../../../state/session';
import { EmptyState } from '../context/EmptyState';
import { SubHeading } from '../context/SubHeading';
import { SynthesisBlock } from '../context/SynthesisBlock';
import { useStudyUI } from '../StudyUIContext';
import { StudySection } from '../StudySection';
import { groupKeyPassages } from '../topic/grouping';
import { KeyPassageItem } from '../topic/KeyPassageItem';
import type { SectionProps } from '../types';
import styles from './KeyPassagesSection.module.css';

/**
 * Key passages (topic studies): the topic's orientation (synthesis), then its key
 * passages grouped as curated ("Grace in the Old Testament"…). Passages the
 * conversation prioritised are floated into a leading "For your question" group.
 */
export function KeyPassagesSection({ study, index }: SectionProps) {
  const { settings } = useSession();
  const { pinnedIds } = useStudyUI();
  const t = useT('topic');
  const topic = study.topic;

  if (!topic) {
    return (
      <StudySection id="key-passages" index={index}>
        <EmptyState size="sm" title={t('empty.noTopic.title')}>
          <p>{t('empty.noTopic.text')}</p>
        </EmptyState>
      </StudySection>
    );
  }

  const { pinned, groups } = groupKeyPassages(topic.keyPassages, pinnedIds, t('group.default'));

  return (
    <StudySection id="key-passages" index={index}>
      <div className={styles.orientation}>
        {topic.question && <p className={`t-display ${styles.question}`}>{topic.question}</p>}
        <SynthesisBlock content={topic.definition} size="lg" />
      </div>

      {pinned.length > 0 && (
        <div className={styles.group}>
          <SubHeading id="kp-group-pinned" note={t('pinned.note')}>
            {t('pinned.heading')}
          </SubHeading>
          <ul className={styles.list} aria-labelledby="kp-group-pinned">
            {pinned.map((p) => (
              <KeyPassageItem key={p.id} item={p} translation={settings.translation} showGroup />
            ))}
          </ul>
        </div>
      )}

      {groups.map((g, gi) => {
        const headingId = `kp-group-${gi}`;
        return (
          <div key={g.name} className={styles.group}>
            <SubHeading id={headingId}>{g.name}</SubHeading>
            <ul className={styles.list} aria-labelledby={headingId}>
              {g.items.map((p) => (
                <KeyPassageItem key={p.id} item={p} translation={settings.translation} />
              ))}
            </ul>
          </div>
        );
      })}

      {topic.keyPassages.length === 0 && (
        <EmptyState size="sm" title={t('empty.none.title')}>
          <p>{t('empty.none.text')}</p>
        </EmptyState>
      )}
    </StudySection>
  );
}
