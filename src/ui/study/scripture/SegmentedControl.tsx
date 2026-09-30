import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import styles from './SegmentedControl.module.css';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  /** accessible name of the group, e.g. "Scripture view" */
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange(value: T): void;
  className?: string;
}

/** Two-to-four mutually exclusive view toggles (toggle buttons with aria-pressed). */
export function SegmentedControl<T extends string>({ label, value, options, onChange, className }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className={cx(styles.group, className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            className={cx(styles.option, active && styles.active)}
            onClick={() => !active && onChange(o.value)}
          >
            {o.icon && <span className={styles.icon}>{o.icon}</span>}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
