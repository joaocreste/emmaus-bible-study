import { useEffect, useId, useLayoutEffect, useMemo, useState } from 'react';
import type { PassageRef, VerseRef } from '../../../domain/models';
import { chaptersOf, refIncludesVerse, refsOverlap, verseToPassage } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useProviders } from '../../../providers/ProvidersContext';
import { RefChip } from '../../common/RefChip';
import { RetryButton } from '../../common/RetryButton';
import { SourceChip } from '../../common/SourceChip';
import { useDatasetCrossRefs } from '../../hooks/data';
import { useResource } from '../../hooks/useResource';
import { Check } from 'lucide-react';
import { CrossLoader, Disclosure, ProvenanceTag } from '../../primitives';
import { chapterBookName, verseLabel } from '../scripture/ReaderView';
import { useStudyUI } from '../StudyUIContext';
import { DATASET_PANEL_ID } from './ids';
import styles from './DatasetReferences.module.css';

interface DatasetReferencesProps {
  passageRef: PassageRef;
  /** curated targets, so dataset rows that are already explained can say so */
  curatedTargets: readonly PassageRef[];
  /** library study: no curated references — open by default with an honest note */
  library: boolean;
}

/** Fallback registry id for the OpenBible.info dataset when no rows have loaded yet. */
const OPENBIBLE_SOURCE_ID = 'openbible-xrefs';

function passageBounds(ref: PassageRef) {
  const endChapter = ref.endChapter ?? ref.startChapter;
  const singleVerse = ref.startVerse != null && ref.endVerse == null && ref.endChapter == null;
  return {
    startChapter: ref.startChapter,
    startVerse: ref.startVerse ?? 1,
    endChapter,
    endVerse: singleVerse ? ref.startVerse : ref.endVerse,
  };
}

/**
 * "More references" — uncurated, community-voted cross-references from OpenBible.info
 * for one verse of the passage. Clearly labelled as an open dataset whose
 * relationships are not explained or individually reviewed.
 */
export function DatasetReferences({ passageRef, curatedTargets, library }: DatasetReferencesProps) {
  const ui = useStudyUI();
  const t = useT('crossrefs');
  const { locale, ref: refLabel, verse: verseRefLabel } = useI18n();
  const { scripture } = useProviders();
  const chapterSelectId = useId();
  const verseSelectId = useId();
  const open = ui.isExpanded(DATASET_PANEL_ID);
  const { setExpanded } = ui;

  useLayoutEffect(() => {
    if (library) setExpanded(DATASET_PANEL_ID, true);
  }, [library, setExpanded]);

  const book = passageRef.book;
  const bounds = passageBounds(passageRef);
  const chapters = useMemo(() => chaptersOf(passageRef), [passageRef]);
  const firstVerse: VerseRef = { book, chapter: bounds.startChapter, verse: bounds.startVerse };
  const inPassage = (v: VerseRef | undefined): v is VerseRef => v != null && refIncludesVerse(passageRef, v);

  const [selected, setSelected] = useState<VerseRef>(() => (inPassage(ui.activeVerse) ? ui.activeVerse : firstVerse));
  const activeVerse = ui.activeVerse;
  useEffect(() => {
    if (activeVerse && refIncludesVerse(passageRef, activeVerse)) setSelected(activeVerse);
  }, [activeVerse, passageRef]);

  const verseCount = useResource(open ? `versecount:${book}.${selected.chapter}` : null, () =>
    scripture.getVerseCount(book, selected.chapter),
  );
  const minVerse = selected.chapter === bounds.startChapter ? bounds.startVerse : 1;
  const maxVerse =
    selected.chapter === bounds.endChapter && bounds.endVerse != null ? bounds.endVerse : (verseCount.data ?? selected.verse);
  const verseOptions: number[] = [];
  for (let v = minVerse; v <= Math.max(minVerse, maxVerse); v++) verseOptions.push(v);

  const state = useDatasetCrossRefs(open ? verseToPassage(selected) : undefined, 24);
  const sorted = useMemo(() => [...(state.data ?? [])].sort((a, b) => b.score - a.score), [state.data]);
  // References the study already explains are named once instead of repeated in the list.
  const explained = sorted.filter((x) => curatedTargets.some((t) => refsOverlap(t, x.target)));
  const rows = sorted.filter((x) => !explained.includes(x));
  const sourceId = sorted[0]?.sourceId ?? OPENBIBLE_SOURCE_ID;

  const chapterName = chapterBookName(book, locale);
  const selectedLabel = verseRefLabel(selected);

  const summary = (
    <span className={styles.summary}>
      <span className={styles.summaryTitle}>{t('dataset.title')}</span>
      <span className={styles.summaryMeta}>{t('dataset.meta', { ref: selectedLabel })}</span>
    </span>
  );

  return (
    <Disclosure
      className={styles.panel}
      open={open}
      onOpenChange={(o) => setExpanded(DATASET_PANEL_ID, o)}
      summary={summary}
      id={`${DATASET_PANEL_ID}-panel`}
    >
      <div className={styles.body}>
        {library && (
          <p className={styles.note}>{t('dataset.libraryNote')}</p>
        )}

        <div className={styles.controls}>
          <div className={styles.label}>
            <ProvenanceTag kind="dataset" />
            <span className={styles.labelText}>{t('dataset.label')}</span>
          </div>
          <div className={styles.selectors}>
            {chapters.length > 1 && (
              <span className={styles.selectGroup}>
                <label htmlFor={chapterSelectId}>{t('dataset.chapter')}</label>
                <select
                  id={chapterSelectId}
                  className={styles.select}
                  value={selected.chapter}
                  onChange={(e) => {
                    const chapter = Number(e.target.value);
                    const verse = chapter === bounds.startChapter ? bounds.startVerse : 1;
                    setSelected({ book, chapter, verse });
                  }}
                >
                  {chapters.map((c) => (
                    <option key={c} value={c}>
                      {chapterName} {c}
                    </option>
                  ))}
                </select>
              </span>
            )}
            <span className={styles.selectGroup}>
              <label htmlFor={verseSelectId}>{t('dataset.verse')}</label>
              <select
                id={verseSelectId}
                className={styles.select}
                value={selected.verse}
                onChange={(e) => setSelected({ book, chapter: selected.chapter, verse: Number(e.target.value) })}
              >
                {verseOptions.map((v) => (
                  <option key={v} value={v}>
                    {verseLabel({ book, chapter: selected.chapter, verse: v }, chapters.length > 1, locale)}
                  </option>
                ))}
              </select>
            </span>
          </div>
        </div>

        <div aria-busy={state.status === 'loading'}>
          {/* Only the short status line is announced, never the whole list. */}
          <p className={styles.status} role="status">
            {state.status === 'loading' && (
              <>
                <span aria-hidden="true">
                  <CrossLoader size={18} label="" />
                </span>
                <span>{t('dataset.loading', { ref: selectedLabel })}</span>
              </>
            )}
            {state.status === 'error' && (
              <>
                {t('dataset.error')} <RetryButton onRetry={state.retry} />
              </>
            )}
            {state.status === 'success' &&
              (sorted.length === 0 ? (
                t('dataset.none', { ref: selectedLabel })
              ) : (
                <span className="visually-hidden">{t('dataset.count', { count: sorted.length, ref: selectedLabel })}</span>
              ))}
          </p>
          {explained.length > 0 && (
            <p className={styles.explainedNote}>
              <Check aria-hidden="true" />
              <span>{t('dataset.explained', { refs: explained.map((x) => refLabel(x.target, 'short')).join(', ') })}</span>
            </p>
          )}
          {rows.length > 0 && (
            <ol className={styles.list} aria-label={t('dataset.listLabel', { ref: selectedLabel })}>
              {rows.map((x, i) => (
                <li key={`${x.target.book}.${x.target.startChapter}.${x.target.startVerse ?? 0}.${i}`} className={styles.row}>
                  <RefChip passage={x.target} style="long" />
                  <span className={styles.score} title={t('dataset.votesTitle')}>
                    {t('dataset.votes', { count: x.score })}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className={styles.source}>
          <span className={styles.sourceLabel}>{t('dataset.source')}</span>
          <SourceChip citation={{ sourceId }} />
          <span className={styles.sourceNote}>{t('dataset.sourceNote')}</span>
        </div>
      </div>
    </Disclosure>
  );
}
