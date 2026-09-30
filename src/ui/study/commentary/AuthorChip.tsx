import { localizeAuthor } from '../../../domain/attribution';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useProviders } from '../../../providers/ProvidersContext';
import { useSessionActions } from '../../../state/session';
import { AuthorMonogram } from '../../common/AuthorMonogram';
import styles from './AuthorChip.module.css';

/** Monogram + name; opens the author in the Inspector. Unknown ids are shown as such, never guessed. */
export function AuthorChip({ authorId }: { authorId: string }) {
  const { sources } = useProviders();
  const { openInspector } = useSessionActions();
  const { locale } = useI18n();
  const t = useT('commentary');
  const author = localizeAuthor(sources.getAuthor(authorId), locale);
  if (!author) {
    return <span className={styles.missing}>{t('card.unknownAuthor', { id: authorId })}</span>;
  }
  const detail = [author.lifespan, author.tradition].filter(Boolean).join(' · ');
  return (
    <button
      type="button"
      className={styles.chip}
      onClick={() => openInspector({ type: 'author', authorId })}
      title={detail ? `${author.name} — ${detail}` : author.name}
    >
      <AuthorMonogram author={author} size="sm" />
      <span className={styles.name}>{author.name}</span>
    </button>
  );
}
