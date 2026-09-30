import { X } from 'lucide-react';
import { useT } from '../../i18n/I18nProvider';
import { ScriptText } from '../common/ScriptText';
import { CrossMark } from '../primitives';
import { useStudyUI } from './StudyUIContext';
import styles from './FocusBanner.module.css';

/**
 * Slim notice under the section navigation explaining why the dashboard just
 * changed ("Highlighted ‘condemnation’ in 8:1 and opened its word study").
 * The live region is always mounted so each new reason is announced politely.
 */
export function FocusBanner({ onCleared }: { onCleared?(): void }) {
  const { focusReason, clearFocus, focusSeq } = useStudyUI();
  const t = useT('study');
  return (
    <div aria-live="polite" aria-atomic="true" className={styles.live}>
      {focusReason && (
        <div key={focusSeq} className={styles.banner}>
          <CrossMark variant="glyph" size={14} className={styles.cross} />
          <p className={styles.text} title={focusReason}>
            <span className="visually-hidden">{t('focus.studyUpdated')} </span>
            <ScriptText text={focusReason} />
          </p>
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              clearFocus();
              onCleared?.();
            }}
          >
            <X aria-hidden="true" />
            <span>{t('focus.clear')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
