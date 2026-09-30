import { BookOpen } from 'lucide-react';
import type { PassageRef } from '../../domain/models';
import { useI18n } from '../../i18n/I18nProvider';
import { useSessionActions } from '../../state/session';
import styles from './RefChip.module.css';

/** Clickable Scripture reference in the reader's language ("Rom 8:1", "Rm 8.1"); opens the passage in the Inspector. (Prop is `passage`, since `ref` is reserved in React.) */
export function RefChip({ passage, style = 'short', label }: { passage: PassageRef; style?: 'short' | 'long'; label?: string }) {
  const { openInspector } = useSessionActions();
  const i18n = useI18n();
  return (
    <button type="button" className={styles.chip} onClick={() => openInspector({ type: 'passage', ref: passage })}>
      <BookOpen aria-hidden="true" className={styles.icon} />
      <span>{label ?? i18n.ref(passage, style)}</span>
    </button>
  );
}
