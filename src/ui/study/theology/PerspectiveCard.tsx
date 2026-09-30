import { Columns2, Handshake, PanelsTopLeft } from 'lucide-react';
import { useState } from 'react';
import type { PerspectiveSet, TheologicalPerspective } from '../../../domain/models';
import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { Badge, Chip } from '../../primitives';
import { AuthorChip } from '../commentary/AuthorChip';
import { RefChipRow } from '../context/RefChipRow';
import { StudyItemCard } from '../context/StudyItemCard';
import { Paragraphs } from '../context/SynthesisBlock';
import { Tabs } from '../context/Tabs';
import { useStudyUI } from '../StudyUIContext';
import { CONSENSUS } from './labels';
import styles from './PerspectiveCard.module.css';

type View = 'compare' | 'tabs';

/**
 * "Where Christians differ": the question, how settled it is (consensus badge with
 * icon + words), an introduction, then every tradition's position with equal visual
 * weight — side by side, or one at a time in accessible tabs — and the common ground.
 */
export function PerspectiveCard({ set }: { set: PerspectiveSet }) {
  const { updatedIds, pinnedIds, focusSeq } = useStudyUI();
  const t = useT('theology');
  const perspectives = set.perspectives;
  const consensus = CONSENSUS[set.consensus];
  const ConsensusIcon = consensus.icon;
  const titleId = `persp-title-${set.id}`;
  const commonId = `persp-common-${set.id}`;

  const [view, setView] = useState<View>(perspectives.length <= 3 ? 'compare' : 'tabs');
  // A tradition the conversation pointed at wins until the reader picks another one.
  const focusedId = perspectives.find((p) => updatedIds.has(p.id) || pinnedIds.has(p.id))?.id;
  const [picked, setPicked] = useState<{ seq: number; id: string } | null>(null);
  const selectedId =
    picked && (picked.seq === focusSeq || !focusedId) ? picked.id : (focusedId ?? perspectives[0]?.id ?? '');

  return (
    <StudyItemCard itemId={set.id} labelledBy={titleId} className={styles.card}>
      <header className={styles.header}>
        <h4 id={titleId} className={cx('t-display', styles.question)}>
          <ScriptText text={set.question} />
        </h4>
        <p className={styles.consensus}>
          <Badge tone={consensus.tone} icon={<ConsensusIcon aria-hidden="true" />}>
            {t(`consensus.${set.consensus}.label`)}
          </Badge>
          <span className={styles.consensusText}>{t(`consensus.${set.consensus}.explanation`)}</span>
        </p>
      </header>

      <Paragraphs text={set.intro} className={styles.intro} />

      {perspectives.length > 1 && (
        <div className={styles.toolbar}>
          <p className={styles.count}>{t('perspective.count', { count: perspectives.length })}</p>
          <div className={styles.viewToggle} role="group" aria-label={t('perspective.viewGroup')}>
            <Chip size="sm" pressed={view === 'compare'} icon={<Columns2 aria-hidden="true" />} onClick={() => setView('compare')}>
              {t('perspective.sideBySide')}
            </Chip>
            <Chip size="sm" pressed={view === 'tabs'} icon={<PanelsTopLeft aria-hidden="true" />} onClick={() => setView('tabs')}>
              {t('perspective.oneAtATime')}
            </Chip>
          </div>
        </div>
      )}

      {view === 'tabs' && perspectives.length > 1 ? (
        <Tabs
          className={styles.tabs}
          items={perspectives.map((p) => ({ id: p.id, label: p.tradition, hint: p.label }))}
          selectedId={selectedId}
          onSelect={(id) => setPicked({ seq: focusSeq, id })}
          label={t('perspective.positions', { question: set.question })}
          equal
          renderPanel={(id) => {
            const p = perspectives.find((x) => x.id === id);
            return p ? <TraditionPanel perspective={p} hideName /> : null;
          }}
        />
      ) : (
        <ul className={styles.compare} aria-label={t('perspective.positions', { question: set.question })}>
          {perspectives.map((p) => (
            <li key={p.id} className={styles.compareItem}>
              <TraditionPanel perspective={p} />
            </li>
          ))}
        </ul>
      )}

      {set.commonGround && (
        // Not a landmark: every perspective set has one, and its heading already structures it.
        <div className={styles.common}>
          <h5 id={commonId} className={styles.commonTitle}>
            <Handshake aria-hidden="true" className={styles.commonIcon} />
            {t('perspective.commonGround')}
          </h5>
          <Paragraphs text={set.commonGround} className={styles.commonText} />
        </div>
      )}

      <ProvenanceLine provenance={set.provenance} />
    </StudyItemCard>
  );
}

function TraditionPanel({ perspective: p, hideName = false }: { perspective: TheologicalPerspective; hideName?: boolean }) {
  const t = useT('theology');
  return (
    <StudyItemCard itemId={p.id} as="div" variant="plain" className={styles.tradition}>
      <h5 className={cx(styles.traditionName, hideName && 'visually-hidden')}>{p.tradition}</h5>
      <p className={styles.position}>
        <ScriptText text={p.label} />
      </p>
      <Paragraphs text={p.summary} className={styles.summary} />
      {p.representatives && p.representatives.length > 0 && (
        <div className={styles.voices}>
          <span className={styles.voicesLabel}>{t('perspective.voices')}</span>
          <ul className={styles.voicesList} aria-label={t('perspective.voicesOf', { tradition: p.tradition })}>
            {p.representatives.map((id) => (
              <li key={id}>
                <AuthorChip authorId={id} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <RefChipRow refs={p.keyTexts} label={t('perspective.keyTexts')} />
      <div className={styles.provenance}>
        <ProvenanceLine provenance={p.provenance} />
      </div>
    </StudyItemCard>
  );
}
