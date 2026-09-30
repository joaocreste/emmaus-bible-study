import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx';
import styles from './Chip.module.css';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  /** toggle chips expose aria-pressed */
  pressed?: boolean;
  icon?: ReactNode;
  tone?: 'neutral' | 'olive' | 'terracotta' | 'gold' | 'sage';
  size?: 'sm' | 'md';
}

/** Interactive pill — filters, suggestions, reference links. Always a <button>. */
export function Chip({ children, pressed, icon, tone = 'neutral', size = 'md', className, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cx(styles.chip, styles[tone], styles[size], pressed && styles.pressed, className)}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
