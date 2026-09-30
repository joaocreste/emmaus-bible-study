import { ArrowRight } from 'lucide-react';
import type { PassageRef, TranslationId, Verse } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { useSession } from '../../../state/session';
import { RetryButton } from '../../common/RetryButton';
import { usePassage } from '../../hooks/data';
import { Button, CrossLoader, ProvenanceTag } from '../../primitives';
import styles from './PassageText.module.css';

interface PassageTextProps {
  passage: PassageRef;
  translation: TranslationId;
  /** longer passages are cut here, with a link to read the rest in the Inspector */
  maxVerses?: number;
  className?: string;
}

/**
 * Scripture excerpt fetched live from the ScriptureProvider (never stored in curated data):
 * serif text, small gold verse numbers, poetry as lines, translation + provenance footer.
 */
export function PassageText({ passage, translation, maxVerses = 12, className }: PassageTextProps) {
  const state = usePassage(passage, translation);
  const { openInspector } = useSession();
  const i18n = useI18n();
  const t = useT('topic');
  const label = i18n.ref(passage);

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <div className={cx(styles.status, className)}>
        <CrossLoader size={18} label={t('text.loadingLabel', { ref: label })} />
        <span aria-hidden="true">{t('text.loading', { ref: label })}</span>
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <p className={cx(styles.status, className)}>
        {t('text.error', { ref: label, translation })} <RetryButton onRetry={state.retry} />
      </p>
    );
  }

  const data = state.data;
  const multiChapter = data.chapters.length > 1;
  const total = data.chapters.reduce((n, c) => n + c.verses.length, 0);
  const slices: { chapter: number; verses: Verse[] }[] = [];
  let remaining = maxVerses;
  for (const ch of data.chapters) {
    if (remaining <= 0) break;
    const verses = ch.verses.slice(0, remaining);
    remaining -= verses.length;
    slices.push({ chapter: ch.chapter, verses });
  }
  const shown = maxVerses - remaining;

  return (
    <figure className={cx(styles.figure, className)}>
      <blockquote className={cx('t-scripture', styles.text)}>
        {slices.map((ch) => (
          <p key={ch.chapter} className={styles.chapter}>
            {multiChapter && <span className={styles.chapterLabel}>{t('text.chapter', { n: ch.chapter })} </span>}
            {ch.verses.map((v) => (
              <VerseText key={v.ref.verse} verse={v} />
            ))}
          </p>
        ))}
      </blockquote>
      <figcaption className={styles.caption}>
        <ProvenanceTag kind="scripture" />
        <span className={styles.translation}>
          {i18n.ref(data.ref)} · {data.translation}
        </span>
        {total > shown && (
          <Button
            variant="link"
            size="sm"
            iconAfter={<ArrowRight aria-hidden="true" />}
            onClick={() => openInspector({ type: 'passage', ref: passage })}
          >
            {t('text.readAll', { count: total })}
          </Button>
        )}
      </figcaption>
    </figure>
  );
}

function VerseText({ verse }: { verse: Verse }) {
  return (
    <span className={styles.verse}>
      <sup className={styles.num}>{verse.ref.verse}</sup>
      {verse.poetryLines && verse.poetryLines.length > 0 ? (
        verse.poetryLines.map((line, i) => (
          <span key={i} className={styles.line}>
            {line}
          </span>
        ))
      ) : (
        <>{verse.text} </>
      )}
    </span>
  );
}
