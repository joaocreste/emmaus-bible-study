import { Fragment, useCallback, useId, useMemo, useState, type ReactNode } from 'react';
import type { BookId, KeyWord, Passage, Verse, VerseRef } from '../../../domain/models';
import { BOOK_NAMES } from '../../../domain/bookNames';
import { bookDisplayName } from '../../../domain/books';
import { verseKey } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { LOCALES, type Locale } from '../../../i18n/locales';
import { cx } from '../../../lib/cx';
import { buildBlocks, chapterSuperscription, encodesIndentation, versePoetryLayout, type ScriptureBlock } from './blocks';
import { anchoredPhrases, segmentVerseText, splitLeadingWord, type PhraseCandidate, type TextSegment } from './keyWords';
import { onRovingKeyDown, useRovingTabIndex } from './roving';
import styles from './ReaderView.module.css';

export interface ReaderViewProps {
  passage: Passage;
  /** 'study' = key words + verse menus + highlights; 'plain' = read-only text (Inspector) */
  variant?: 'study' | 'plain';
  keyWords?: readonly KeyWord[];
  showVerseNumbers?: boolean;
  /** show "Romans 8" headings between chapters (multi-chapter passages) */
  showChapterHeadings?: boolean;
  /** restrict rendering to verses inside the study passage (partial first/last chapters) */
  includeVerse?: (v: VerseRef) => boolean;
  highlightedVerseKeys?: ReadonlySet<string>;
  highlightedWordIds?: ReadonlySet<string>;
  /** id of a hidden element describing what key-word buttons do */
  keyWordHintId?: string;
  onKeyWord?(keyWordId: string, anchor: HTMLElement): void;
  onVerseNumber?(verse: Verse, anchor: HTMLElement): void;
  /** verse whose menu is open (aria-expanded on its number) */
  openVerseKey?: string;
  className?: string;
}

const NO_KEYS: ReadonlySet<string> = new Set();

/** DOM id of a verse in the study reader (used to scroll focused verses into view). */
export function verseDomId(v: VerseRef): string {
  return `verse-${verseKey(v)}`;
}

/** A book's name as it heads one of its chapters: "Psalm" (singular), "Matthew" / "Salmo", "Mateus" / "Psaume", "Matthieu". */
export function chapterBookName(book: BookId, locale: Locale = 'en'): string {
  if (book === 'PSA') return locale === 'en' ? 'Psalm' : (BOOK_NAMES[locale].PSA?.singular ?? bookDisplayName(book, locale));
  return bookDisplayName(book, locale);
}

/** Display name for a chapter heading: "Psalm 23", "Matthew 5" / "Salmo 23", "Mateus 5". */
export function chapterLabel(book: BookId, chapter: number, locale: Locale = 'en'): string {
  return `${chapterBookName(book, locale)} ${chapter}`;
}

/** A verse number as shown inside a passage: "12", or "8:12" ("8.12" in French) when the passage spans chapters. */
export function verseLabel(v: VerseRef, multiChapter: boolean, locale: Locale = 'en'): string {
  return multiChapter ? `${v.chapter}${LOCALES[locale].verseSeparator}${v.verse}` : String(v.verse);
}

/**
 * Scripture in reading layout: section headings in small caps, prose paragraphs,
 * poetry as indented lines, gold verse numerals and key words marked for study.
 */
export function ReaderView({
  passage,
  variant = 'study',
  keyWords = [],
  showVerseNumbers = true,
  showChapterHeadings = false,
  includeVerse,
  highlightedVerseKeys = NO_KEYS,
  highlightedWordIds = NO_KEYS,
  keyWordHintId,
  onKeyWord,
  onVerseNumber,
  openVerseKey,
  className,
}: ReaderViewProps) {
  const interactive = variant === 'study';
  const t = useT('scripture');
  const { locale } = useI18n();
  const book = passage.ref.book;
  const multiChapter = passage.chapters.length > 1;

  const chapters = useMemo(
    () =>
      passage.chapters
        .map((ch) => {
          const verses = includeVerse ? ch.verses.filter((v) => includeVerse(v.ref)) : ch.verses;
          const blocks = buildBlocks(verses, book);
          const sup = verses.some((v) => v.ref.verse === 1) ? chapterSuperscription(ch) : undefined;
          // A provider-supplied psalm title goes after the section heading(s) and before verse 1.
          if (sup && !blocks.some((b) => b.type === 'superscription')) {
            const at = blocks.findIndex((b) => b.type !== 'heading');
            blocks.splice(at < 0 ? blocks.length : at, 0, { type: 'superscription', key: `sup-${ch.chapter}`, text: sup });
          }
          return { chapter: ch.chapter, blocks };
        })
        .filter((c) => c.blocks.length > 0),
    [passage, includeVerse, book],
  );

  const headingTag = showChapterHeadings ? 'h4' : 'h3';
  const indentEncoded = useMemo(() => encodesIndentation(passage.chapters.flatMap((c) => c.verses)), [passage]);

  // Verse numbers are one Tab stop; the arrow keys move between them.
  const numberKeys = useMemo(
    () =>
      chapters.flatMap((c) =>
        c.blocks.flatMap((b) => (b.type === 'prose' || b.type === 'poetry' ? b.verses.map((v) => verseKey(v.ref)) : [])),
      ),
    [chapters],
  );
  const roving = useRovingTabIndex(numberKeys);
  const numHintId = useId();

  // Translation footnotes (e.g. textual variants) open inline under a small dagger.
  const noteIdBase = useId();
  const [openNotes, setOpenNotes] = useState<ReadonlySet<string>>(() => new Set());
  const toggleNote = useCallback((key: string) => {
    setOpenNotes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const footnotes = (v: Verse): ReactNode => {
    if (!interactive || !v.footnotes?.length) return null;
    const key = verseKey(v.ref);
    const open = openNotes.has(key);
    const id = `${noteIdBase}-${key}`;
    const label = verseLabel(v.ref, multiChapter, locale);
    return (
      <>
        <button
          type="button"
          className={styles.noteBtn}
          aria-expanded={open}
          aria-controls={id}
          aria-label={t('note.label', { count: v.footnotes.length, verse: label })}
          onClick={() => toggleNote(key)}
        >
          †
        </button>
        <span id={id} className={styles.noteText} role="note" hidden={!open}>
          {v.footnotes.join(' · ')}
        </span>
      </>
    );
  };

  const renderSegments = (segments: TextSegment[], verse: Verse): ReactNode =>
    segments.map((s, i) => {
      if (!s.keyWordId || !interactive || !onKeyWord) return <Fragment key={i}>{s.text}</Fragment>;
      const id = s.keyWordId;
      const focused = highlightedWordIds.has(id);
      return (
        <button
          key={i}
          type="button"
          className={cx(styles.keyWord, focused && styles.keyWordFocused)}
          data-keyword={id}
          data-verse={verseKey(verse.ref)}
          aria-describedby={keyWordHintId}
          onClick={(e) => onKeyWord(id, e.currentTarget)}
        >
          {s.text}
          {focused && <span className="visually-hidden"> {t('highlighted.suffix')}</span>}
        </button>
      );
    });

  const verseNumber = (v: Verse): ReactNode => {
    if (!showVerseNumbers) return null;
    const n = v.ref.verse;
    const label = verseLabel(v.ref, multiChapter, locale);
    if (!interactive || !onVerseNumber) {
      return (
        <sup className={styles.num}>
          {n}
          <span className="visually-hidden">&nbsp;</span>
        </sup>
      );
    }
    const key = verseKey(v.ref);
    return (
      <button
        type="button"
        className={styles.numBtn}
        aria-label={t('verse.options', { verse: label })}
        aria-describedby={numHintId}
        aria-haspopup="menu"
        aria-expanded={openVerseKey === key}
        data-roving="verse-number"
        tabIndex={roving.tabIndexFor(key)}
        onFocus={() => roving.setActive(key)}
        onKeyDown={(e) => onRovingKeyDown(e, 'verse-number')}
        onClick={(e) => onVerseNumber(v, e.currentTarget)}
      >
        {n}
      </button>
    );
  };

  const candidatesFor = (v: Verse): PhraseCandidate[] =>
    interactive && keyWords.length ? anchoredPhrases(keyWords, v.ref, passage.translation) : [];

  /** Screen readers hear which verses the conversation highlighted (the band alone is visual). */
  const highlightCue = (hl: boolean): ReactNode =>
    hl && interactive ? <span className="visually-hidden">{t('highlighted.prefix')} </span> : null;

  const renderProseVerse = (v: Verse) => {
    const key = verseKey(v.ref);
    const hl = highlightedVerseKeys.has(key);
    // The number stays on the line of the verse's first word (never stranded at a line end).
    const { lead, rest } = splitLeadingWord(segmentVerseText(v.text, candidatesFor(v)));
    return (
      <Fragment key={key}>
        <span
          id={interactive ? verseDomId(v.ref) : undefined}
          data-verse={key}
          className={cx(styles.verse, hl && styles.verseHl)}
        >
          {highlightCue(hl)}
          <span className={styles.verseStart}>
            {verseNumber(v)}
            {renderSegments(lead, v)}
          </span>
          {renderSegments(rest, v)}
          {footnotes(v)}
        </span>{' '}
      </Fragment>
    );
  };

  const renderPoetryVerse = (v: Verse) => {
    const key = verseKey(v.ref);
    const hl = highlightedVerseKeys.has(key);
    const candidates = candidatesFor(v);
    const taken = new Set<string>();
    return (
      <span
        key={key}
        id={interactive ? verseDomId(v.ref) : undefined}
        data-verse={key}
        className={cx(styles.poetryVerse, hl && styles.verseHlBlock)}
      >
        {versePoetryLayout(v, indentEncoded).map((line, i, lines) => (
          <span
            key={i}
            className={cx(
              styles.line,
              line.indent === 1 && styles.indent1,
              line.indent >= 2 && styles.indent2,
              i === 0 && showVerseNumbers && styles.lineNumbered,
            )}
          >
            {i === 0 && highlightCue(hl)}
            {i === 0 && verseNumber(v)}
            <span className={cx(hl && styles.verseHl)}>{renderSegments(segmentVerseText(line.text, candidates, taken), v)}</span>
            {i === lines.length - 1 && footnotes(v)}
          </span>
        ))}
      </span>
    );
  };

  const hasHighlight = (block: ScriptureBlock): boolean =>
    (block.type === 'prose' || block.type === 'poetry') && block.verses.some((v) => highlightedVerseKeys.has(verseKey(v.ref)));

  const renderBlock = (block: ScriptureBlock) => {
    switch (block.type) {
      case 'heading': {
        const H = headingTag;
        return (
          <H key={block.key} className={styles.heading}>
            {block.text}
          </H>
        );
      }
      case 'superscription':
        return (
          <p key={block.key} className={styles.superscription}>
            {block.text}
          </p>
        );
      case 'prose':
        return (
          <p key={block.key} className={cx(styles.para, hasHighlight(block) && styles.marked)}>
            {block.verses.map(renderProseVerse)}
          </p>
        );
      case 'poetry':
        return (
          <div key={block.key} className={cx(styles.poetry, hasHighlight(block) && styles.marked)}>
            {block.verses.map(renderPoetryVerse)}
          </div>
        );
    }
  };

  return (
    <div className={cx(styles.reader, !interactive && styles.plain, className)} data-roving-root="">
      {interactive && onVerseNumber && showVerseNumbers && (
        <span id={numHintId} hidden>
          {t('verse.hint')}
        </span>
      )}
      {chapters.map((c) => (
        <div key={c.chapter} className={styles.chapter}>
          {showChapterHeadings && <h3 className={styles.chapterHeading}>{chapterLabel(book, c.chapter, locale)}</h3>}
          {c.blocks.map(renderBlock)}
        </div>
      ))}
    </div>
  );
}
