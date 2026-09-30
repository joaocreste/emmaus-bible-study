import { ArrowUp } from 'lucide-react';
import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { withElements } from '../hooks/richText';
import { IconButton } from '../primitives';
import styles from './Composer.module.css';

const MAX_HEIGHT = 168;

interface ComposerProps {
  value: string;
  onChange(value: string): void;
  onSubmit(text: string): void;
  busy: boolean;
  placeholder: string;
  showHint?: boolean;
}

export interface ComposerHandle {
  focus(): void;
}

/** Auto-growing message box. Enter sends, Shift+Enter adds a line; sending is disabled while the engine works. */
export const Composer = forwardRef<ComposerHandle, ComposerProps>(function Composer(
  { value, onChange, onSubmit, busy, placeholder, showHint = false },
  ref,
) {
  const t = useT('chat');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hintId = useId();
  useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus({ preventScroll: true }) }), []);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';
  }, [value]);

  const canSend = !busy && value.trim().length > 0;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    onSubmit(value.trim());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form className={styles.composer} onSubmit={submit}>
      <div className={cx(styles.field, busy && styles.busy)}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          rows={1}
          value={value}
          placeholder={placeholder}
          aria-label={t('composer.label')}
          aria-describedby={showHint ? hintId : undefined}
          maxLength={2000}
          enterKeyHint="send"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <IconButton
          type="submit"
          variant="primary"
          size="md"
          label={busy ? t('composer.waiting') : t('composer.send')}
          icon={<ArrowUp />}
          disabled={!canSend}
          className={styles.send}
        />
      </div>
      {showHint && (
        <p id={hintId} className={styles.hint}>
          {withElements(t('composer.hint'), { enter: <kbd>{t('key.enter')}</kbd>, shift: <kbd>{t('key.shift')}</kbd> })}
        </p>
      )}
    </form>
  );
});
