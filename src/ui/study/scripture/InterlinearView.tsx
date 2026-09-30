import { Fragment, useId, useMemo, type ReactNode } from 'react';
import type { KeyWord, OriginalVerse, OriginalWord, Passage, Verse, VerseRef } from '../../../domain/models';
import { verseKey } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { RetryButton } from '../../common/RetryButton';
import type { Resource } from '../../hooks/useResource';
import { displayOriginal, isRtl, langTag, normalizeStrong } from '../words/language';
import { verseText } from './blocks';
import { displayTransliteration, glossParts } from './interlinearText';
import { anchoredPhrases, segmentVerseText } from './keyWords';
import { chapterLabel, verseDomId, verseLabel } from './ReaderView';
import { onRovingKeyDown, useRovingTabIndex } from './roving';
import styles from './InterlinearView.module.css';

interface InterlinearViewProps {
  passage: Passage;
  original: Resource<OriginalVerse[]>;
  keyWords: readonly KeyWord[];
  showVerseNumbers: boolean;
  showChapterHeadings: boolean;
  includeVerse?: (v: VerseRef) => boolean;
  highlightedVerseKeys: ReadonlySet<string>;
  highlightedWordIds: ReadonlySet<string>;
  keyWordHintId?: string;
  onKeyWord(keyWordId: string, anchor: HTMLElement): void;
  onWord(word: OriginalWord, verse: VerseRef, anchor: HTMLElement): void;
  onVerseNumber(verse: Verse, anchor: HTMLElement): void;
  openVerseKey?: string;
}

/**
 * The translation's line + the original-language words beneath it, each a stack of
 * script / transliteration / gloss / Strong's number. Every word opens its lexicon entry.
 * Glosses come from an English dataset: outside English they carry lang="en".
 */
export function InterlinearView({
  passage,
  original,
  keyWords,
  showVerseNumbers,
  showChapterHeadings,
  includeVerse,
  highlightedVerseKeys,
  highlightedWordIds,
  keyWordHintId,
  onKeyWord,
  onWord,
  onVerseNumber,
  openVerseKey,
}: InterlinearViewProps) {
  const t = useT('scripture');
  const { locale } = useI18n();
  /** the dataset's glosses are English; mark them so screen readers switch voice */
  const glossLang = locale === 'en' ? undefined : 'en';
  const byVerse = useMemo(() => {
    const map = new Map<string, OriginalVerse>();
    for (const ov of original.data ?? []) map.set(verseKey(ov.ref), ov);
    return map;
  }, [original.data]);

  // Strong's numbers of highlighted key words, per anchor verse — to mark the matching original word.
  const focusedStrongs = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const kw of keyWords) {
      if (!highlightedWordIds.has(kw.id)) continue;
      for (const a of kw.anchors) {
        const k = verseKey(a.verse);
        if (!map.has(k)) map.set(k, new Set());
        map.get(k)!.add(normalizeStrong(kw.strong));
      }
    }
    return map;
  }, [keyWords, highlightedWordIds]);

  // verse → Strong's → curated key word anchored there (those stacks open the full key-word study)
  const keyStrongs = useMemo(() => {
    const map = new Map<string, Map<string, string>>();
    for (const kw of keyWords) {
      for (const a of kw.anchors) {
        const k = verseKey(a.verse);
        if (!map.has(k)) map.set(k, new Map());
        map.get(k)!.set(normalizeStrong(kw.strong), kw.id);
      }
    }
    return map;
  }, [keyWords]);

  const multiChapter = passage.chapters.length > 1;
  const shownVerses = useMemo(
    () => passage.chapters.flatMap((ch) => (includeVerse ? ch.verses.filter((v) => includeVerse(v.ref)) : ch.verses)),
    [passage, includeVerse],
  );

  // Verse numbers and word stacks are one Tab stop each; the arrow keys move within them.
  const numberKeys = useMemo(() => shownVerses.map((v) => verseKey(v.ref)), [shownVerses]);
  const wordKeys = useMemo(
    () => shownVerses.flatMap((v) => (byVerse.get(verseKey(v.ref))?.words ?? []).map((w) => `${verseKey(v.ref)}:${w.index}`)),
    [shownVerses, byVerse],
  );
  const numbers = useRovingTabIndex(numberKeys);
  const words = useRovingTabIndex(wordKeys);
  const numHintId = useId();
  const wordHintId = useId();

  const renderEnglish = (v: Verse): ReactNode => {
    const segments = segmentVerseText(verseText(v), anchoredPhrases(keyWords, v.ref, passage.translation));
    return segments.map((s, i) =>
      s.keyWordId ? (
        <button
          key={i}
          type="button"
          className={cx(styles.keyWord, highlightedWordIds.has(s.keyWordId) && styles.keyWordFocused)}
          aria-describedby={keyWordHintId}
          onClick={(e) => onKeyWord(s.keyWordId!, e.currentTarget)}
        >
          {s.text}
          {highlightedWordIds.has(s.keyWordId) && <span className="visually-hidden"> {t('highlighted.suffix')}</span>}
        </button>
      ) : (
        <Fragment key={i}>{s.text}</Fragment>
      ),
    );
  };

  const renderWords = (v: Verse): ReactNode => {
    const key = verseKey(v.ref);
    if (original.status === 'loading' || original.status === 'idle') {
      return (
        <div className={styles.wordsLoading} aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={styles.stackSkeleton} />
          ))}
        </div>
      );
    }
    const ov = byVerse.get(key);
    if (!ov || ov.words.length === 0) {
      return original.status === 'success' ? <p className={styles.missing}>{t('interlinear.noOriginal')}</p> : null;
    }
    const rtl = isRtl(ov.language);
    const lang = langTag(ov.language);
    const focused = focusedStrongs.get(key);
    const keyed = keyStrongs.get(key);
    return (
      <ul className={styles.words} dir={rtl ? 'rtl' : 'ltr'} aria-label={t('interlinear.words', { language: ov.language })}>
        {ov.words.map((w) => {
          const strong = normalizeStrong(w.strong);
          const isFocused = focused?.has(strong) ?? false;
          const keyWordId = keyed?.get(strong);
          const wordKey = `${key}:${w.index}`;
          const translit = w.transliteration ? displayTransliteration(w.transliteration, ov.language) : undefined;
          const describedBy = [keyWordId ? keyWordHintId : undefined, wordHintId].filter(Boolean).join(' ') || undefined;
          return (
            <li key={w.index}>
              <button
                type="button"
                className={cx(styles.stack, keyWordId && styles.stackKey, isFocused && styles.stackFocused)}
                title={w.morphDescription ?? w.morph}
                aria-describedby={describedBy}
                data-roving="word"
                tabIndex={words.tabIndexFor(wordKey)}
                onFocus={() => words.setActive(wordKey)}
                onKeyDown={(e) => onRovingKeyDown(e, 'word')}
                onClick={(e) => (keyWordId ? onKeyWord(keyWordId, e.currentTarget) : onWord(w, v.ref, e.currentTarget))}
              >
                <span lang={lang} dir={rtl ? 'rtl' : 'ltr'} className={cx(styles.orig, rtl ? styles.origHebrew : styles.origGreek)}>
                  {displayOriginal(w.surface, ov.language)}
                </span>
                {translit && (
                  <span dir="ltr" className={styles.translit}>
                    {translit.before}
                    {translit.stressed && <span className={styles.stress}>{translit.stressed}</span>}
                    {translit.after}
                  </span>
                )}
                <span dir="ltr" lang={w.gloss ? glossLang : undefined} className={styles.gloss}>
                  {w.gloss ? <Gloss text={w.gloss} /> : '—'}
                </span>
                {isFocused && <span className="visually-hidden"> {t('highlighted.suffix')}</span>}
                <span dir="ltr" className={styles.strong}>
                  <span className="visually-hidden">{t('interlinear.strong')} </span>
                  {w.strong}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={styles.interlinear} data-roving-root="">
      <span id={numHintId} hidden>
        {t('verse.hint')}
      </span>
      <span id={wordHintId} hidden>
        {t('interlinear.wordHint')}
      </span>
      {passage.chapters.map((ch) => {
        const verses = includeVerse ? ch.verses.filter((v) => includeVerse(v.ref)) : ch.verses;
        if (verses.length === 0) return null;
        return (
          <div key={ch.chapter} className={styles.chapter}>
            {showChapterHeadings && <h3 className={styles.chapterHeading}>{chapterLabel(passage.ref.book, ch.chapter, locale)}</h3>}
            {verses.map((v) => {
              const key = verseKey(v.ref);
              const hl = highlightedVerseKeys.has(key);
              const label = verseLabel(v.ref, multiChapter, locale);
              return (
                <div key={key} id={verseDomId(v.ref)} className={cx(styles.verse, hl && styles.verseHl)} data-verse={key}>
                  <p className={styles.english}>
                    {hl && <span className="visually-hidden">{t('highlighted.prefix')} </span>}
                    {showVerseNumbers && (
                      <button
                        type="button"
                        className={styles.numBtn}
                        aria-label={t('verse.options', { verse: label })}
                        aria-describedby={numHintId}
                        aria-haspopup="menu"
                        aria-expanded={openVerseKey === key}
                        data-roving="verse-number"
                        tabIndex={numbers.tabIndexFor(key)}
                        onFocus={() => numbers.setActive(key)}
                        onKeyDown={(e) => onRovingKeyDown(e, 'verse-number')}
                        onClick={(e) => onVerseNumber(v, e.currentTarget)}
                      >
                        {v.ref.verse}
                      </button>
                    )}
                    {renderEnglish(v)}
                  </p>
                  {renderWords(v)}
                </div>
              );
            })}
          </div>
        );
      })}
      {original.status === 'error' && (
        <p className={styles.error} role="status">
          {t('interlinear.error')}{' '}
          <RetryButton onRetry={original.retry} />
        </p>
      )}
    </div>
  );
}

/** A gloss with the dataset's markup shown typographically (see interlinearText.ts). */
function Gloss({ text }: { text: string }) {
  return (
    <>
      {glossParts(text).map((p, i) =>
        p.kind === 'join' ? (
          <Fragment key={i}>
            <span className={styles.join} aria-hidden="true">
              {' · '}
            </span>
            <span className="visually-hidden"> </span>
          </Fragment>
        ) : p.kind === 'implied' ? (
          <span key={i} className={styles.implied}>
            {p.text}
          </span>
        ) : p.kind === 'added' ? (
          <span key={i} className={styles.added}>
            {p.text}
          </span>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </>
  );
}
