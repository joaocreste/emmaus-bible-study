import { X } from 'lucide-react';
import { useMemo } from 'react';
import type { CrossReference, CrossReferenceFilter, PassageRef, VerseRef } from '../../../domain/models';
import { bookDisplayName, tryGetBook } from '../../../domain/books';
import { refIncludesVerse } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useSession } from '../../../state/session';
import { Button, Chip, Disclosure } from '../../primitives';
import { CrossReferenceCard } from '../crossrefs/CrossReferenceCard';
import { DatasetReferences } from '../crossrefs/DatasetReferences';
import {
  authorsPresent,
  facetCounts,
  filterCrossReferences,
  isFilterActive,
  relationshipsPresent,
  toggleAuthor,
  toggleRelationship,
} from '../crossrefs/filter';
import { RELATIONSHIP_META } from '../crossrefs/relationships';
import { StudySection } from '../StudySection';
import { pinnedFirst, useStudyUI } from '../StudyUIContext';
import { fillSlots, slot, traditionalAuthorName, type SectionProps } from '../types';
import styles from './CrossReferencesSection.module.css';

/** Verses of a (usually short) `from` range, for "show in the passage". */
function versesOf(ref: PassageRef, max = 12): VerseRef[] {
  if (ref.startVerse == null) return [];
  const sameChapter = (ref.endChapter ?? ref.startChapter) === ref.startChapter;
  const end = sameChapter && ref.endVerse != null ? ref.endVerse : ref.startVerse;
  const out: VerseRef[] = [];
  for (let v = ref.startVerse; v <= end && out.length < max; v++) out.push({ book: ref.book, chapter: ref.startChapter, verse: v });
  return out;
}

/** III. Cross-references — curated, explained connections first; the open dataset after. */
export function CrossReferencesSection({ study, index }: SectionProps) {
  const { settings, openInspector, openStudy, focusDashboard } = useSession();
  const ui = useStudyUI();
  const t = useT('crossrefs');
  const { locale, ref: refLabel, verse: verseLabel } = useI18n();
  const { crossRefFilter: filter, setCrossRefFilter } = ui;
  const curated = study.crossReferences;
  const library = curated.length === 0;

  const relationships = useMemo(() => relationshipsPresent(curated), [curated]);
  const authors = useMemo(() => authorsPresent(curated), [curated]);

  const activeVerse = ui.activeVerse && study.passage && refIncludesVerse(study.passage, ui.activeVerse) ? ui.activeVerse : undefined;
  const fromActive = (x: CrossReference) => activeVerse != null && refIncludesVerse(x.from, activeVerse);

  const visible = useMemo(() => {
    const filtered = pinnedFirst(filterCrossReferences(curated, filter), ui.pinnedIds);
    if (!activeVerse) return filtered;
    // Cards that start from the reader's selected verse come next after pinned ones.
    const pinned = filtered.filter((x) => ui.pinnedIds.has(x.id));
    const rest = filtered.filter((x) => !ui.pinnedIds.has(x.id));
    const fromVerse = (x: CrossReference) => refIncludesVerse(x.from, activeVerse);
    return [...pinned, ...rest.filter(fromVerse), ...rest.filter((x) => !fromVerse(x))];
  }, [curated, filter, ui.pinnedIds, activeVerse]);

  const active = isFilterActive(filter);
  const setFilter = (f: CrossReferenceFilter) => setCrossRefFilter(f);
  // Each chip shows what pressing it would give with the other criteria kept (no dead ends).
  const facets = useMemo(() => facetCounts(curated, filter), [curated, filter]);

  // Removable chips for criteria set by the conversation (or by the author chips).
  const removable: { key: string; label: string; clear: () => void }[] = [];
  if (filter.author) {
    removable.push({ key: 'author', label: traditionalAuthorName(filter.author, locale), clear: () => setFilter({ ...filter, author: undefined }) });
  }
  if (filter.book) {
    const name = tryGetBook(filter.book) ? bookDisplayName(filter.book, locale) : filter.book;
    removable.push({ key: 'book', label: name, clear: () => setFilter({ ...filter, book: undefined }) });
  }
  for (const t of filter.tags ?? []) {
    removable.push({
      key: `tag-${t}`,
      label: t,
      clear: () => {
        const tags = (filter.tags ?? []).filter((x) => x !== t);
        setFilter({ ...filter, tags: tags.length ? tags : undefined });
      },
    });
  }

  const openPassage = (ref: PassageRef) => openInspector({ type: 'passage', ref });
  const studyPassage = (ref: PassageRef) => void openStudy({ passage: ref });
  const showFrom = (ref: PassageRef) => {
    const verses = versesOf(ref);
    focusDashboard({ section: 'scripture', highlightVerses: verses.length ? verses : undefined });
  };

  const description =
    study.kind === 'topic'
      ? t('description.topic')
      : library
        ? t('description.library')
        : t('description.curated', { subject: study.passage ? refLabel(study.passage) : study.title });

  return (
    <StudySection id="cross-references" index={index} description={description}>
      {!library && (
        <>
          <div className={styles.filters}>
            <div role="group" aria-label={t('filter.relationship')} className={styles.chipRow}>
              <Chip size="sm" pressed={!active} onClick={() => setFilter({})}>
                {t('filter.all')} <span className={styles.count}>{curated.length}</span>
              </Chip>
              {relationships.length > 1 &&
                relationships.map(({ type }) => {
                  const meta = RELATIONSHIP_META[type];
                  const Icon = meta.icon;
                  const pressed = filter.relationships?.includes(type) ?? false;
                  const count = facets.relationships.get(type) ?? 0;
                  return (
                    <Chip
                      key={type}
                      size="sm"
                      pressed={pressed}
                      disabled={!pressed && count === 0}
                      icon={<Icon aria-hidden="true" />}
                      title={t(meta.description)}
                      onClick={() => setFilter(toggleRelationship(filter, type))}
                    >
                      {t(meta.label)} <span className={styles.count}>{count}</span>
                    </Chip>
                  );
                })}
            </div>
            {authors.length > 1 && (
              <div role="group" aria-label={t('filter.author')} className={styles.chipRow}>
                <span className={styles.rowLabel} aria-hidden="true">
                  {t('filter.by')}
                </span>
                {authors.map(({ author }) => {
                  const pressed = filter.author?.toLowerCase() === author.toLowerCase();
                  const count = facets.authors.get(author.toLowerCase()) ?? 0;
                  const name = traditionalAuthorName(author, locale);
                  return (
                    <Chip
                      key={author}
                      size="sm"
                      tone="olive"
                      pressed={pressed}
                      disabled={!pressed && count === 0}
                      onClick={() => setFilter(toggleAuthor(filter, author))}
                      title={t('filter.authorTitle', { author: name })}
                    >
                      {name} <span className={styles.count}>{count}</span>
                    </Chip>
                  );
                })}
              </div>
            )}
            {relationships.length > 0 && (
              <Disclosure
                className={styles.legend}
                summary={<span className={styles.legendSummary}>{t('legend.summary')}</span>}
              >
                <dl className={styles.legendList}>
                  {relationships.map(({ type }) => {
                    const meta = RELATIONSHIP_META[type];
                    const Icon = meta.icon;
                    return (
                      <div key={type} className={styles.legendItem}>
                        <dt>
                          <Icon aria-hidden="true" />
                          {t(meta.label)}
                        </dt>
                        <dd>{t(meta.description)}</dd>
                      </div>
                    );
                  })}
                </dl>
              </Disclosure>
            )}
          </div>

          <div className={styles.statusRow}>
            <p className={styles.status} aria-live="polite">
              {active
                ? t('status.showing', { visible: visible.length, total: curated.length })
                : t('status.explained', { count: curated.length })}
            </p>
            {removable.map((r) => (
              <button key={r.key} type="button" className={styles.removable} onClick={r.clear} aria-label={t('filter.remove', { label: r.label })}>
                <span>{fillSlots(t('filter.filtered', { label: slot('label') }), { label: <strong>{r.label}</strong> })}</span>
                <X aria-hidden="true" />
              </button>
            ))}
            {activeVerse && (
              <button
                type="button"
                className={styles.removable}
                onClick={() => ui.setActiveVerse(undefined)}
                aria-label={t('activeVerse.clear', { ref: verseLabel(activeVerse) })}
              >
                <span>{fillSlots(t('activeVerse.first', { ref: slot('ref') }), { ref: <strong>{verseLabel(activeVerse, 'short')}</strong> })}</span>
                <X aria-hidden="true" />
              </button>
            )}
          </div>

          {visible.length > 0 ? (
            <ol className={styles.list}>
              {visible.map((x) => (
                <li key={x.id}>
                  <CrossReferenceCard
                    xref={x}
                    translation={settings.translation}
                    excerptExpanded={ui.isExpanded(x.id)}
                    onToggleExcerpt={() => ui.toggleExpanded(x.id)}
                    updated={ui.updatedIds.has(x.id)}
                    pulseKey={ui.focusSeq}
                    fromActiveVerse={fromActive(x)}
                    onOpenPassage={openPassage}
                    onStudyPassage={studyPassage}
                    onShowFrom={showFrom}
                  />
                </li>
              ))}
            </ol>
          ) : (
            <div className={styles.empty}>
              <p>{study.depth === 'generated' ? t('empty.generated') : t('empty.curated')}</p>
              <Button variant="secondary" size="sm" onClick={() => setFilter({})}>
                {t('empty.showAll')}
              </Button>
            </div>
          )}
        </>
      )}

      {study.passage && <DatasetReferences passageRef={study.passage} curatedTargets={curated.map((x) => x.target)} library={library} />}

      {!study.passage && library && (
        <p className={styles.emptyNote}>{t('empty.none')}</p>
      )}
    </StudySection>
  );
}
