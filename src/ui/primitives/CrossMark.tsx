import { cx } from '../../lib/cx';
import styles from './CrossMark.module.css';

interface CrossMarkProps {
  /** pixel size of the emblem's height */
  size?: number;
  /** 'emblem' = Mediterranean arch framing a cross (logo); 'glyph' = plain Latin cross */
  variant?: 'emblem' | 'glyph';
  /** accessible title; omit for decorative use */
  title?: string;
  className?: string;
}

/**
 * The Emmaus mark: a Latin cross inside a Mediterranean arch (a doorway / window).
 * Drawn with strokes so it inherits `currentColor` and stays crisp at every size.
 */
export function CrossMark({ size = 28, variant = 'emblem', title, className }: CrossMarkProps) {
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true as const };
  if (variant === 'glyph') {
    return (
      <svg className={cx(styles.mark, className)} width={size * 0.64} height={size} viewBox="0 0 16 25" fill="none" {...a11y}>
        <path d="M8 1.5v22M2.5 7.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={cx(styles.mark, className)} width={size * 0.8} height={size} viewBox="0 0 32 40" fill="none" {...a11y}>
      <path d="M3 38.5V16a13 13 0 0 1 26 0v22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1.5 38.5h29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 9.5v25M10 16.5h12" stroke="var(--color-gold, currentColor)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
