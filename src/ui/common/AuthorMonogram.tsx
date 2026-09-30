import type { Author } from '../../domain/models';
import { cx } from '../../lib/cx';
import styles from './AuthorMonogram.module.css';

/** Initials inside a small Mediterranean arch — a dignified stand-in for portraits. */
export function AuthorMonogram({ author, size = 'md', className }: { author: Author; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <span className={cx(styles.monogram, styles[size], className)} data-era={author.era} aria-hidden="true">
      {initials(author.name)}
    </span>
  );
}

export function initials(name: string): string {
  const cleaned = name.replace(/\b(of|the|and|&)\b/gi, ' ').replace(/[^\p{L}\s.]/gu, ' ');
  const parts = cleaned.split(/[\s.]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
