import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { useScrollStrip } from '../../hooks/useScrollStrip';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: ReactNode;
  /** secondary line under the label (e.g. a tradition's one-line position) */
  hint?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  selectedId: string;
  onSelect(id: string): void;
  /** accessible name of the tab list */
  label: string;
  renderPanel(id: string): ReactNode;
  /**
   * 'auto' selects on arrow keys (cheap panels); 'manual' only moves focus and
   * selects on Enter/Space (panels that load data).
   */
  activation?: 'auto' | 'manual';
  /** equal-width tabs (used where every option must carry the same visual weight) */
  equal?: boolean;
  className?: string;
  panelClassName?: string;
}

/**
 * WAI-ARIA tabs: role="tablist" with roving tabindex, ←/→/Home/End keys,
 * each tab controlling a labelled tabpanel. Only the selected panel's content mounts.
 */
export function Tabs({
  items,
  selectedId,
  onSelect,
  label,
  renderPanel,
  activation = 'auto',
  equal = false,
  className,
  panelClassName,
}: TabsProps) {
  const prefix = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  // With a mouse the tabs wrap onto more rows; on touch they scroll, with a fade on the edge that hides more.
  const listRef = useRef<HTMLDivElement>(null);
  const { edges } = useScrollStrip(listRef, [items.length]);
  const selectedIndex = Math.max(
    0,
    items.findIndex((t) => t.id === selectedId),
  );
  const current = items[selectedIndex]?.id;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    refs.current[next]?.focus();
    if (activation === 'auto') onSelect(items[next].id);
  };

  const tabId = (id: string) => `${prefix}-tab-${id}`;
  const panelId = (id: string) => `${prefix}-panel-${id}`;

  return (
    <div className={cx(styles.tabs, className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className={cx(styles.list, equal && styles.equal)}
        data-fade-start={edges.start || undefined}
        data-fade-end={edges.end || undefined}
      >
        {items.map((t, i) => {
          const selected = t.id === current;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(t.id)}
              aria-selected={selected}
              aria-controls={panelId(t.id)}
              tabIndex={selected ? 0 : -1}
              className={cx(styles.tab, selected && styles.selected)}
              onClick={() => onSelect(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className={styles.tabLabel}>{t.label}</span>
              {t.hint && <span className={styles.tabHint}>{t.hint}</span>}
            </button>
          );
        })}
      </div>
      {items.map((t) => {
        const selected = t.id === current;
        return (
          <div
            key={t.id}
            role="tabpanel"
            id={panelId(t.id)}
            aria-labelledby={tabId(t.id)}
            hidden={!selected}
            tabIndex={0}
            className={cx(styles.panel, panelClassName)}
          >
            {selected ? renderPanel(t.id) : null}
          </div>
        );
      })}
    </div>
  );
}
