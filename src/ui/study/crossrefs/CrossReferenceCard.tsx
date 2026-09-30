import { ArrowRight, CornerDownRight } from 'lucide-react';
import { useId } from 'react';
import type { CrossReference, PassageRef, TranslationId } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { Badge, Button, CrossMark } from '../../primitives';
import { PassageExcerpt } from './PassageExcerpt';
import { RELATIONSHIP_META } from './relationships';
import { useNearViewport } from './useNearViewport';
import styles from './CrossReferenceCard.module.css';

export interface CrossReferenceCardProps {
  xref: CrossReference;
  translation: TranslationId;
  excerptExpanded: boolean;
  onToggleExcerpt(): void;
  /** changed by the latest question — pulse once + micro-label */
  updated?: boolean;
  /** replays the pulse when it changes (the focus sequence) */
  pulseKey?: number;
  /** the card starts from the verse the reader selected */
  fromActiveVerse?: boolean;
  onOpenPassage(ref: PassageRef): void;
  onStudyPassage(ref: PassageRef): void;
  onShowFrom(ref: PassageRef): void;
}

/** An explained cross-reference: target, relationship, live excerpt, why it connects, and where to go next. */
export function CrossReferenceCard({
  xref,
  translation,
  excerptExpanded,
  onToggleExcerpt,
  updated = false,
  pulseKey,
  fromActiveVerse = false,
  onOpenPassage,
  onStudyPassage,
  onShowFrom,
}: CrossReferenceCardProps) {
  const titleId = useId();
  const t = useT('crossrefs');
  const { ref: refLabel } = useI18n();
  const [nearRef, near] = useNearViewport<HTMLElement>();
  const meta = RELATIONSHIP_META[xref.relationship];
  const Icon = meta.icon;
  const target = refLabel(xref.target);
  const fromShort = refLabel(xref.from, 'short');
  const isSynthesis = xref.explanation.provenance.kind === 'synthesis';

  return (
    <article ref={nearRef} className={cx(styles.card, updated && styles.updated)} aria-labelledby={titleId} data-xref={xref.id}>
      {updated && <span key={pulseKey} className={styles.pulse} aria-hidden="true" />}

      <header className={styles.head}>
        <div className={styles.headText}>
          {updated && (
            <p className={styles.updatedLabel}>
              <CrossMark variant="glyph" size={11} />
              {t('card.updated')}
            </p>
          )}
          <h3 id={titleId} className={styles.ref}>
            {target}
          </h3>
          <p className={styles.title}>
            <ScriptText text={xref.title} />
          </p>
        </div>
        <Badge tone={meta.tone} icon={<Icon aria-hidden="true" />} title={t(meta.description)} className={styles.badge}>
          {t(meta.label)}
        </Badge>
      </header>

      <PassageExcerpt
        passageRef={xref.target}
        translation={translation}
        load={near}
        expanded={excerptExpanded}
        onToggle={onToggleExcerpt}
        className={styles.excerpt}
      />

      <div className={cx(styles.why, isSynthesis && styles.whySynthesis)}>
        <p className={styles.whyLabel}>{t('card.why')}</p>
        <p className={cx('t-synthesis', styles.whyText)}>
          <ScriptText text={xref.explanation.text} />
        </p>
        <ProvenanceLine provenance={xref.explanation.provenance} />
      </div>

      <footer className={styles.actions}>
        <button
          type="button"
          className={cx(styles.from, fromActiveVerse && styles.fromActive)}
          onClick={() => onShowFrom(xref.from)}
          title={t('card.showFrom', { ref: refLabel(xref.from) })}
        >
          <CornerDownRight aria-hidden="true" />
          <span>
            <span aria-hidden="true">{t('card.from', { ref: fromShort })}</span>
            <span className="visually-hidden">{t('card.fromA11y', { ref: fromShort })}</span>
          </span>
        </button>
        <div className={styles.actionButtons}>
          <Button variant="ghost" size="sm" onClick={() => onStudyPassage(xref.target)} aria-label={t('card.studyA11y', { ref: target })}>
            {t('card.study')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            iconAfter={<ArrowRight aria-hidden="true" />}
            onClick={() => onOpenPassage(xref.target)}
            aria-label={t('card.openA11y', { ref: target })}
          >
            {t('card.open')}
          </Button>
        </div>
      </footer>
    </article>
  );
}
