import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { PassageRef, TranslationId } from '../../../domain/models';
import { useT } from '../../../i18n/I18nProvider';
import { RetryButton } from '../../common/RetryButton';
import { usePassage } from '../../hooks/data';
import { cx } from '../../../lib/cx';
import { verseText } from '../scripture/blocks';
import styles from './PassageExcerpt.module.css';

interface PassageExcerptProps {
  passageRef: PassageRef;
  translation: TranslationId;
  /** fetch only once true (e.g. when the card nears the viewport) */
  load: boolean;
  expanded: boolean;
  onToggle(): void;
  /** longer passages are cut after this many verses (full text via "Open passage") */
  maxVerses?: number;
  className?: string;
}

/** Live Scripture excerpt for a card: serif italic, clamped to three lines with "Show more". */
export function PassageExcerpt({ passageRef, translation, load, expanded, onToggle, maxVerses = 8, className }: PassageExcerptProps) {
  const state = usePassage(load ? passageRef : undefined, translation);
  const t = useT('crossrefs');
  const textRef = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const id = useId();

  const verses = state.data ? state.data.chapters.flatMap((c) => c.verses) : [];
  const shown = verses.slice(0, maxVerses);
  const truncated = verses.length > shown.length;
  const showNumbers = verses.length > 1;

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;
    const measure = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded, state.data]);

  if (state.status === 'error') {
    return (
      <p className={cx(styles.unavailable, className)}>
        {t('excerpt.error')} <RetryButton onRetry={state.retry} />
      </p>
    );
  }
  if (!state.data) {
    return (
      <div className={cx(styles.placeholder, className)} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <div className={cx(styles.wrap, className)}>
      <p ref={textRef} id={id} className={cx(styles.text, !expanded && styles.clamped)}>
        {shown.map((v) => (
          <span key={`${v.ref.chapter}.${v.ref.verse}`}>
            {showNumbers && <sup className={styles.num}>{v.ref.verse}</sup>}
            {verseText(v)}{' '}
          </span>
        ))}
        {truncated && <span className={styles.more}>…</span>}
      </p>
      {(overflowing || expanded) && (
        <button type="button" className={styles.toggle} aria-expanded={expanded} aria-controls={id} onClick={onToggle}>
          {expanded ? t('excerpt.less') : t('excerpt.more')}
        </button>
      )}
    </div>
  );
}
