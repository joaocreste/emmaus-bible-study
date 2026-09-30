import { useEffect, useMemo, useState } from 'react';
import type { Era } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useProviders } from '../../../providers/ProvidersContext';
import { Button } from '../../primitives';
import { ClassicCommentaries } from '../commentary/ClassicCommentaries';
import { CommentaryCard } from '../commentary/CommentaryCard';
import { CommentaryFilters } from '../commentary/CommentaryFilters';
import { filterEntries, presentAuthors, presentEras } from '../commentary/eras';
import { SermonList } from '../commentary/SermonList';
import { EmptyState } from '../context/EmptyState';
import { SubHeading } from '../context/SubHeading';
import { pinnedFirst, useStudyUI } from '../StudyUIContext';
import { StudySection } from '../StudySection';
import type { SectionProps } from '../types';
import styles from './CommentarySection.module.css';

/**
 * Commentary & Christian thinkers — curated entries (verified quotations or clearly
 * labelled summaries) filterable by era and author, the author filter shared with the
 * conversation ("What did Tim Keller say?"); then classic public-domain commentaries
 * and open study notes, verse-scoped; then sermons.
 */
export function CommentarySection({ study, index }: SectionProps) {
  const { sources } = useProviders();
  const { commentaryAuthorIds, setCommentaryAuthorIds, pinnedIds } = useStudyUI();
  const [era, setEra] = useState<Era | 'all'>('all');
  const i18n = useI18n();
  const t = useT('commentary');
  const getAuthor = (id: string) => sources.getAuthor(id);

  const entries = study.commentary;
  const eras = useMemo(() => presentEras(entries, (id) => sources.getAuthor(id)), [entries, sources]);
  const authors = useMemo(() => presentAuthors(entries, (id) => sources.getAuthor(id)), [entries, sources]);

  // A new author filter from the conversation should not be hidden by an old era choice.
  const authorKey = commentaryAuthorIds.join('|');
  useEffect(() => {
    if (authorKey) setEra('all');
  }, [authorKey]);
  // A new study starts unfiltered.
  useEffect(() => setEra('all'), [study.id]);

  const visible = pinnedFirst(filterEntries(entries, getAuthor, era, commentaryAuthorIds), pinnedIds);
  const hasCurated = entries.length > 0;

  return (
    <StudySection id="commentary" index={index}>
      {hasCurated ? (
        <>
          <SubHeading id="commentary-voices" note={t('note.voices')}>
            {t('heading.voices')}
          </SubHeading>
          <CommentaryFilters
            eras={eras}
            era={era}
            onEraChange={setEra}
            authors={authors}
            selectedAuthorIds={commentaryAuthorIds}
            onAuthorsChange={setCommentaryAuthorIds}
            getAuthor={getAuthor}
          />
          {visible.length > 0 ? (
            <ul className={styles.list} aria-labelledby="commentary-voices">
              {visible.map((e) => (
                <CommentaryCard key={e.id} entry={e} />
              ))}
            </ul>
          ) : (
            <EmptyState
              size="sm"
              title={noMatchTitle(
                commentaryAuthorIds.map((id) => getAuthor(id)?.name ?? id),
                study.depth === 'generated',
                t,
                i18n.locale === 'en' ? (items) => items.join(' or ') : i18n.list,
              )}
              actions={
                <Button
                  size="sm"
                  onClick={() => {
                    setEra('all');
                    setCommentaryAuthorIds([]);
                  }}
                >
                  {t('filters.showAll')}
                </Button>
              }
            >
              <p>{t('empty.noMatch.text')}</p>
            </EmptyState>
          )}
        </>
      ) : (
        <EmptyState title={t('empty.none.title')}>
          <p>{t('empty.none.text')}</p>
        </EmptyState>
      )}

      {study.passage && (
        <>
          <SubHeading id="commentary-classic" note={t('note.classic')}>
            {t('heading.classic')}
          </SubHeading>
          <ClassicCommentaries passage={study.passage} study={study.id} />
        </>
      )}

      {study.sermons.length > 0 && (
        <>
          <SubHeading id="commentary-sermons">{t('heading.sermons')}</SubHeading>
          <SermonList sermons={study.sermons} priorityAuthorIds={commentaryAuthorIds} />
        </>
      )}
    </StudySection>
  );
}

function noMatchTitle(
  names: string[],
  generated: boolean,
  t: ReturnType<typeof useT<'commentary'>>,
  list: (items: string[], type?: 'conjunction' | 'disjunction') => string,
): string {
  if (names.length === 0) return t('empty.noMatch.filters');
  const joined = list(names, 'disjunction');
  // A generated page holds only what was retrieved for this question — it is not a curated selection.
  if (generated) return t('empty.noMatch.generated', { names: joined });
  return t('empty.noMatch.curated', { names: joined, count: names.length });
}
