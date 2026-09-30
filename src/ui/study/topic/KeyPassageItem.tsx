import { ArrowRight } from 'lucide-react';
import type { TopicPassage, TranslationId } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useSession } from '../../../state/session';
import { RefChip } from '../../common/RefChip';
import { ScriptText } from '../../common/ScriptText';
import { Button } from '../../primitives';
import { MoreDetail } from '../context/MoreDetail';
import { StudyItemCard } from '../context/StudyItemCard';
import { SynthesisBlock } from '../context/SynthesisBlock';
import styles from './KeyPassageItem.module.css';
import { PassageText } from './PassageText';

interface KeyPassageItemProps {
  item: TopicPassage;
  translation: TranslationId;
  /** show the item's group as an eyebrow (when it is floated out of its group) */
  showGroup?: boolean;
}

/** One key passage of a topic study: reference, title, why it matters, the text on demand, and a way in. */
export function KeyPassageItem({ item, translation, showGroup = false }: KeyPassageItemProps) {
  const { openStudy } = useSession();
  const i18n = useI18n();
  const t = useT('topic');
  const titleId = `kp-title-${item.id}`;
  const label = i18n.ref(item.ref);
  return (
    <StudyItemCard itemId={item.id} as="li" labelledBy={titleId} className={styles.item}>
      {showGroup && <p className={styles.group}>{item.group}</p>}
      <h4 id={titleId} className={styles.heading}>
        <span className={styles.ref}>{label}</span>
        <span className={styles.sep} aria-hidden="true">
          ·
        </span>
        <span className={styles.title}>
          <ScriptText text={item.title} />
        </span>
      </h4>

      <SynthesisBlock content={item.note} className={styles.note} />

      <MoreDetail itemId={item.id} about={label} moreLabel={t('item.readPassage')} lessLabel={t('item.hidePassage')}>
        {() => <PassageText passage={item.ref} translation={translation} />}
      </MoreDetail>

      <div className={styles.actions}>
        <RefChip passage={item.ref} label={t('item.open', { ref: i18n.ref(item.ref, 'short') })} />
        <Button
          variant="link"
          size="sm"
          iconAfter={<ArrowRight aria-hidden="true" />}
          onClick={() => void openStudy({ passage: item.ref })}
          aria-label={t('item.studyAria', { ref: label })}
        >
          {t('item.study')}
        </Button>
      </div>
    </StudyItemCard>
  );
}
