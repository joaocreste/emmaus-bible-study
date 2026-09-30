import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import styles from './Disclosure.module.css';

export interface DisclosureProps {
  /** content of the toggle row (keep it short: title + meta) */
  summary: ReactNode;
  children: ReactNode;
  /** controlled open state */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** id for the panel (used by dashboard focus to expand items) */
  id?: string;
}

/** Accessible expand/collapse for progressive disclosure (spec §14). */
export function Disclosure({ summary, children, open, defaultOpen = false, onOpenChange, className, id }: DisclosureProps) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const autoId = useId();
  const panelId = id ?? `disclosure-${autoId}`;
  const toggle = () => {
    const next = !isOpen;
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return (
    <div className={cx(styles.disclosure, isOpen && styles.open, className)}>
      <button type="button" className={styles.trigger} aria-expanded={isOpen} aria-controls={panelId} onClick={toggle}>
        <span className={styles.summary}>{summary}</span>
        <ChevronDown aria-hidden="true" className={styles.chevron} />
      </button>
      <div id={panelId} className={styles.panel} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
}
