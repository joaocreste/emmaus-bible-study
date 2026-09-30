import { X } from 'lucide-react';
import { localizeAuthor } from '../../../domain/attribution';
import type { Author, Era } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { AuthorMonogram } from '../../common/AuthorMonogram';
import { Button, Chip } from '../../primitives';
import styles from './CommentaryFilters.module.css';

interface CommentaryFiltersProps {
  eras: Era[];
  era: Era | 'all';
  onEraChange(era: Era | 'all'): void;
  authors: Author[];
  /** selected author ids (shared with the conversation via StudyUI) */
  selectedAuthorIds: readonly string[];
  onAuthorsChange(ids: string[]): void;
  /** resolves selected ids that have no entries here (the conversation may ask for anyone) */
  getAuthor(id: string): Author | undefined;
}

/**
 * Filters for the commentary list: era chips (only eras present) and author chips.
 * A removable "Showing: …" line makes an author filter set by the conversation visible.
 */
export function CommentaryFilters({
  eras,
  era,
  onEraChange,
  authors,
  selectedAuthorIds,
  onAuthorsChange,
  getAuthor,
}: CommentaryFiltersProps) {
  const { locale } = useI18n();
  const t = useT('commentary');
  const toggleAuthor = (id: string) =>
    onAuthorsChange(selectedAuthorIds.includes(id) ? selectedAuthorIds.filter((x) => x !== id) : [...selectedAuthorIds, id]);

  return (
    <div className={styles.filters}>
      {selectedAuthorIds.length > 0 && (
        <div className={styles.showing} role="status">
          <span className={styles.showingLabel}>{t('filters.showing')}</span>
          <ul className={styles.showingList}>
            {selectedAuthorIds.map((id) => {
              const name = localizeAuthor(getAuthor(id), locale)?.name ?? id;
              return (
                <li key={id} className={styles.showingChip}>
                  <span>{name}</span>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={t('filters.stopShowing', { name })}
                    title={t('filters.removeFilter')}
                    onClick={() => onAuthorsChange(selectedAuthorIds.filter((x) => x !== id))}
                  >
                    <X aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
          <Button variant="link" size="sm" onClick={() => onAuthorsChange([])}>
            {t('filters.showAll')}
          </Button>
        </div>
      )}

      {eras.length > 1 && (
        <div className={styles.row} role="group" aria-label={t('filters.byEra')}>
          <span className={styles.rowLabel} aria-hidden="true">
            {t('filters.era')}
          </span>
          <Chip size="sm" pressed={era === 'all'} onClick={() => onEraChange('all')}>
            {t('filters.allEras')}
          </Chip>
          {eras.map((e) => (
            <Chip key={e} size="sm" pressed={era === e} title={t(`era.${e}.span`)} onClick={() => onEraChange(era === e ? 'all' : e)}>
              {t(`era.${e}.label`)}
            </Chip>
          ))}
        </div>
      )}

      {authors.length > 1 && (
        <div className={styles.row} role="group" aria-label={t('filters.byAuthor')}>
          <span className={styles.rowLabel} aria-hidden="true">
            {t('filters.voices')}
          </span>
          {authors.map((raw) => {
            const a = localizeAuthor(raw, locale);
            const pressed = selectedAuthorIds.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={pressed}
                className={styles.author}
                onClick={() => toggleAuthor(a.id)}
                title={[a.lifespan, a.tradition].filter(Boolean).join(' · ')}
              >
                <AuthorMonogram author={a} size="sm" className={styles.authorMonogram} />
                <span>{a.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
