import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'olive' | 'terracotta' | 'gold' | 'sage' | 'synthesis' | 'outline';
  icon?: ReactNode;
  className?: string;
  title?: string;
}

/** Small, non-interactive label (relationship type, license, era, consensus level…). */
export function Badge({ children, tone = 'neutral', icon, className, title }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], className)} title={title}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
}
