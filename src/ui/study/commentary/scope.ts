import type { Passage, PassageRef, VerseRef } from '../../../domain/models';
import { chapterRef, chaptersOf, formatRef, refKey, verseToPassage } from '../../../domain/reference';
import { translator } from '../../../i18n/catalog';
import { LOCALES, type Locale } from '../../../i18n/locales';

/** Passages spanning more than this many chapters are read chapter by chapter. */
export const MAX_WHOLE_PASSAGE_CHAPTERS = 3;

export interface ScopeOption {
  value: string;
  label: string;
}

export interface ScopeGroup {
  label?: string;
  options: ScopeOption[];
}

export function isLargePassage(passage: PassageRef): boolean {
  return chaptersOf(passage).length > MAX_WHOLE_PASSAGE_CHAPTERS;
}

/**
 * Default scope of the classic-commentary panel: the verse under discussion when
 * there is one, else the passage (or its first chapter when the passage is long).
 */
export function defaultScope(passage: PassageRef, activeVerse?: VerseRef): PassageRef {
  if (activeVerse) return verseToPassage(activeVerse);
  return isLargePassage(passage) ? chapterRef(passage.book, passage.startChapter) : passage;
}

/**
 * Options for the verse selector: the whole passage (when not too long), each
 * chapter of a long passage, and — once the text is loaded — every verse, grouped
 * by chapter. The current scope is always present, even if it lies outside the passage.
 * Labels are in the reader's language.
 */
export function scopeGroups(passage: PassageRef, text: Passage | undefined, current: PassageRef, locale: Locale = 'en'): ScopeGroup[] {
  const t = translator(locale, 'commentary');
  const sep = LOCALES[locale].verseSeparator;
  const groups: ScopeGroup[] = [];
  const chapters = chaptersOf(passage);
  const large = isLargePassage(passage);
  const multi = chapters.length > 1;
  const top: ScopeOption[] = [];
  if (!large) top.push({ value: refKey(passage), label: t('scope.whole', { ref: formatRef(passage, 'long', locale) }) });
  if (multi) {
    for (const c of chapters) top.push({ value: refKey(chapterRef(passage.book, c)), label: t('scope.chapter', { n: c }) });
  }
  groups.push({ options: top });

  if (text && !large) {
    for (const ch of text.chapters) {
      groups.push({
        label: multi ? t('scope.chapter', { n: ch.chapter }) : t('scope.verses'),
        options: ch.verses.map((v) => ({
          value: refKey(verseToPassage(v.ref)),
          label: multi ? `${v.ref.chapter}${sep}${v.ref.verse}` : t('scope.verse', { n: v.ref.verse }),
        })),
      });
    }
  }

  const currentKey = refKey(current);
  const present = groups.some((g) => g.options.some((o) => o.value === currentKey));
  if (!present) groups[0].options.unshift({ value: currentKey, label: t('scope.selected', { ref: formatRef(current, 'long', locale) }) });
  return groups;
}
