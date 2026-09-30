import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import styles from './SegmentedControl.module.css';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: ReactNode;
  /** accessible name when `label` is visual only */
  ariaLabel?: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string | number> {
  /** accessible group name */
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange(value: T): void;
  className?: string;
}

/** Radio group styled as a segmented control; roving tabindex, arrow keys move the selection. */
export function SegmentedControl<T extends string | number>({ label, options, value, onChange, className }: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    let next = -1;
    if (delta) next = (selected + delta + options.length) % options.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = options.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={cx(styles.group, className)} onKeyDown={onKeyDown}>
      {options.map((o, i) => {
        const checked = i === selected;
        return (
          <button
            key={String(o.value)}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={o.ariaLabel}
            tabIndex={checked ? 0 : -1}
            className={cx(styles.option, checked && styles.checked)}
            onClick={() => onChange(o.value)}
          >
            {o.icon && <span className={styles.icon}>{o.icon}</span>}
            <span className={styles.label}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
