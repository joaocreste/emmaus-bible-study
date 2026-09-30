import { BookOpen, BookOpenText, Compass, CornerDownLeft, Languages, MessagesSquare, Search, UserRound } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { Author, CuratedStudy } from '../../domain/models';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { useProviders } from '../../providers/ProvidersContext';
import type { TopicMatch } from '../../providers/types';
import { useSession } from '../../state/session';
import { withElements } from '../hooks/richText';
import styles from './CommandPalette.module.css';
import { searchPalette, type PaletteAction, type PaletteGroupId, type PaletteItem } from './commandSearch';

const GROUP_ICON: Record<PaletteGroupId, typeof BookOpen> = {
  passage: BookOpen,
  studies: BookOpenText,
  topics: Compass,
  words: Languages,
  authors: UserRound,
  ask: MessagesSquare,
};

/**
 * The search dialog itself (loaded on first use; see CommandPalette). Modal, with a
 * focus trap; combobox + listbox semantics; arrow keys, Enter, Esc; the number of
 * results is announced once typing pauses.
 */
export function PaletteDialog({ onClose }: { onClose(): void }) {
  const providers = useProviders();
  const session = useSession();
  const { locale, ref } = useI18n();
  const t = useT('shell');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [topics, setTopics] = useState<TopicMatch[]>([]);
  const [returnTo] = useState(() => (typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null));
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const titleId = `${baseId}-title`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const studies = useMemo<CuratedStudy[]>(() => safely(() => providers.studies.list(locale), []), [providers, locale]);
  const authors = useMemo<Author[]>(() => safely(() => providers.sources.allAuthors(), []), [providers]);
  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => providers.topics.listTopics(locale))
      .then((list) => !cancelled && setTopics(list))
      .catch(() => {
        /* topics unavailable — the other groups still work */
      });
    return () => {
      cancelled = true;
    };
  }, [providers, locale]);

  const groups = useMemo(() => searchPalette(query, { studies, topics, authors }, locale), [query, studies, topics, authors, locale]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const activeIndex = Math.min(active, Math.max(0, flat.length - 1));

  // Announce how many results a query found, once typing pauses (the listbox itself is silent).
  const matches = flat.filter((item) => item.group !== 'ask').length;
  const summary = !query.trim() ? '' : matches ? t('palette.results', { count: matches }) : t('palette.noResults');
  const [announced, setAnnounced] = useState('');
  useEffect(() => {
    const t = window.setTimeout(() => setAnnounced(summary), 450);
    return () => window.clearTimeout(t);
  }, [summary]);

  // Focus the input on open; give focus back to the trigger on close.
  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      if (returnTo && document.contains(returnTo)) returnTo.focus({ preventScroll: true });
    };
  }, [returnTo]);

  useEffect(() => {
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' });
    // optionId is derived from a stable id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const execute = (action: PaletteAction) => {
    // Opening something from the palette replaces what the Inspector was showing, so its answer is not hidden
    // behind the sheet (authors and words open in the Inspector themselves).
    if (action.kind !== 'open-author' && action.kind !== 'open-word') session.closeInspector();
    switch (action.kind) {
      case 'open-passage':
        void session.openStudy({ passage: action.passage });
        break;
      case 'open-study':
        void session.openStudy({ studyId: action.studyId });
        break;
      case 'open-topic':
        void session.openStudy(action.studyId ? { studyId: action.studyId } : { topic: action.topic });
        break;
      case 'open-word': {
        const { studyId, wordId } = action;
        void (async () => {
          if (session.study?.id !== studyId) {
            // Only focus the word once its study is really open (the engine's reply explains anything else).
            const opened = await session.openStudy({ studyId });
            if (opened !== studyId) return;
          }
          session.focusDashboard({ section: 'original-languages', highlightWordIds: [wordId], expandIds: [wordId] });
          session.openInspector({ type: 'word', keyWordId: wordId });
        })();
        break;
      }
      case 'open-author':
        session.openInspector({ type: 'author', authorId: action.authorId });
        break;
      case 'ask':
        void session.send(action.text);
        break;
    }
  };

  const choose = (item: PaletteItem | undefined) => {
    if (!item) return;
    onClose();
    execute(item.action);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      case 'ArrowDown':
        e.preventDefault();
        if (flat.length) setActive((activeIndex + 1) % flat.length);
        return;
      case 'ArrowUp':
        e.preventDefault();
        if (flat.length) setActive((activeIndex - 1 + flat.length) % flat.length);
        return;
      case 'Enter':
        if (e.nativeEvent.isComposing) return;
        e.preventDefault();
        choose(flat[activeIndex]);
        return;
      case 'Tab': {
        // Focus trap: cycle between the dialog's focusable controls.
        const focusables = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('input, button, [role="listbox"]') ?? []);
        if (!focusables.length) return;
        e.preventDefault();
        const i = focusables.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey ? (i <= 0 ? focusables.length - 1 : i - 1) : (i + 1) % focusables.length;
        focusables[next].focus();
        return;
      }
    }
  };

  let index = -1;
  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.dialog} onKeyDown={onKeyDown}>
        <h2 id={titleId} className="visually-hidden">
          {t('palette.title')}
        </h2>
        <div className={styles.inputRow}>
          <Search aria-hidden="true" className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            role="combobox"
            aria-label={t('palette.inputLabel')}
            aria-expanded={flat.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={flat.length ? optionId(activeIndex) : undefined}
            placeholder={t('palette.placeholder')}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
          />
          <button type="button" className={styles.close} onClick={onClose} aria-label={t('palette.close')}>
            <kbd className={styles.escKey}>{t('palette.esc')}</kbd>
            <span className={styles.cancelText}>{t('palette.cancel')}</span>
          </button>
        </div>

        <p className="visually-hidden" role="status" aria-live="polite">
          {announced}
        </p>

        <div className={styles.results}>
          {!query && (
            <p className={styles.hint}>
              {withElements(t('palette.hint'), {
                ref: <em>{ref({ book: 'JHN', startChapter: 3, startVerse: 16, endChapter: 3, endVerse: 16 })}</em>,
                topic: <em>{t('palette.hint.topic')}</em>,
                word: <em lang="grc">λόγος</em>,
                author: <em>{t('palette.hint.author')}</em>,
              })}
            </p>
          )}
          {/* The listbox is the scroll container and is keyboard-focusable itself (arrows + Enter work there too),
              so the scrolling results are reachable without a mouse. */}
          <div
            id={listId}
            role="listbox"
            aria-label={t('palette.resultsLabel')}
            tabIndex={0}
            aria-activedescendant={flat.length ? optionId(activeIndex) : undefined}
            className={styles.listbox}
          >
          {groups.map((g) => (
            <div key={g.id} role="group" aria-labelledby={`${listId}-${g.id}`} className={styles.group}>
              <div id={`${listId}-${g.id}`} role="presentation" className={styles.groupLabel}>
                {query ? g.label : g.id === 'studies' ? t('palette.group.featured') : t('palette.group.explore')}
              </div>
              {g.items.map((item) => {
                index += 1;
                const i = index;
                const selected = i === activeIndex;
                const Icon = GROUP_ICON[item.group];
                const rtl = item.lang === 'hbo' || item.lang === 'arc';
                return (
                  <div
                    key={item.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={selected}
                    className={cx(styles.option, selected && styles.selected)}
                    onMouseMove={() => active !== i && setActive(i)}
                    onClick={() => choose(item)}
                  >
                    <span className={cx(styles.optionIcon, styles[`icon-${item.group}`])} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={styles.optionText}>
                      <span className={cx(styles.optionTitle, item.lang && styles.optionOriginal)} lang={item.lang} dir={rtl ? 'rtl' : undefined}>
                        {item.title}
                      </span>
                      {item.subtitle && <span className={styles.optionSub}>{item.subtitle}</span>}
                    </span>
                    <CornerDownLeft aria-hidden="true" className={styles.enterIcon} />
                  </div>
                );
              })}
            </div>
          ))}
          </div>
        </div>

        <footer className={styles.footer} aria-hidden="true">
          <span>
            {withElements(t('palette.footer.move'), {
              keys: (
                <>
                  <kbd>↑</kbd>
                  <kbd>↓</kbd>
                </>
              ),
            })}
          </span>
          <span>{withElements(t('palette.footer.open'), { keys: <kbd>↵</kbd> })}</span>
          <span>{withElements(t('palette.footer.close'), { keys: <kbd>{t('palette.esc')}</kbd> })}</span>
        </footer>
      </div>
    </div>
  );
}

function safely<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}
