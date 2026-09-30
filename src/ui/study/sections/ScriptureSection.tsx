import { BookOpen, Copy, Languages, Link2, MessageSquareText } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import type { OriginalWord, Passage, PassageRef, Verse, VerseRef } from '../../../domain/models';
import { getBook } from '../../../domain/books';
import { chapterRef, chaptersOf, isWholeBook, parseVerseKey, refIncludesVerse, refKey, verseKey } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useProviders } from '../../../providers/ProvidersContext';
import { useSession } from '../../../state/session';
import { RetryButton } from '../../common/RetryButton';
import { SourceChip } from '../../common/SourceChip';
import { useOriginalText, usePassage } from '../../hooks/data';
import { licenseName } from '../../inspector/licenseText';
import { ProvenanceTag } from '../../primitives';
import { DATASET_PANEL_ID } from '../crossrefs/ids';
import { verseText } from '../scripture/blocks';
import { ChapterStepper } from '../scripture/ChapterStepper';
import { InterlinearView } from '../scripture/InterlinearView';
import { chapterBookName, ReaderView, verseLabel } from '../scripture/ReaderView';
import { ScriptureSkeleton } from '../scripture/ScriptureSkeleton';
import { SegmentedControl } from '../scripture/SegmentedControl';
import { VerseMenu, type VerseMenuItem } from '../scripture/VerseMenu';
import { focusSectionHeading, scrollToSectionSettled } from '../StudyNavigation.utils';
import { StudySection } from '../StudySection';
import { useStudyUI } from '../StudyUIContext';
import type { SectionProps } from '../types';
import styles from './ScriptureSection.module.css';

/** Longer ranges (and whole books) are read one chapter at a time. */
const MAX_CONTINUOUS_CHAPTERS = 5;

/** I. Scripture — the passage as an annotated reading text (Reader) or with the original words (Interlinear). */
export function ScriptureSection({ study, index }: SectionProps) {
  if (!study.passage) return null;
  return <ScriptureSectionBody study={study} index={index} passageRef={study.passage} />;
}

function isPhone(): boolean {
  return window.matchMedia?.('(max-width: 759px)').matches ?? false;
}

function ScriptureSectionBody({ study, index, passageRef }: SectionProps & { passageRef: PassageRef }) {
  const { settings, updateSettings, openInspector, send, setMobilePane, focusDashboard } = useSession();
  const ui = useStudyUI();
  const { scripture, sources } = useProviders();
  const t = useT('scripture');
  const tp = useT('provenance');
  const { locale, ref, verse: verseRefLabel } = useI18n();
  const translation = settings.translation;
  const mode = settings.scriptureMode;
  const hintId = useId();

  /* ---------- which chapter(s) to show ---------- */
  const chapters = useMemo(() => chaptersOf(passageRef), [passageRef]);
  const paged = isWholeBook(passageRef) || chapters.length > MAX_CONTINUOUS_CHAPTERS;
  const [chapter, setChapter] = useState(chapters[0]);
  const displayRef = useMemo<PassageRef>(() => (paged ? chapterRef(passageRef.book, chapter) : passageRef), [paged, passageRef, chapter]);
  const includeVerse = useMemo(() => (paged ? (v: VerseRef) => refIncludesVerse(passageRef, v) : undefined), [paged, passageRef]);

  const passageState = usePassage(displayRef, translation);
  const originalState = useOriginalText(mode === 'interlinear' ? displayRef : undefined);
  const translationInfo = scripture.listTranslations().find((x) => x.id === translation);
  /** the version's own abbreviation ("BSB", "LSG", "Darby") */
  const versionShort = translationInfo?.shortName ?? translation;
  const versionSource = translationInfo ? sources.getSource(translationInfo.sourceId) : undefined;

  // Keep the previous rendering on screen (dimmed) while only the translation changes.
  const [stale, setStale] = useState<Passage | undefined>();
  useEffect(() => {
    if (passageState.status === 'success') setStale(passageState.data);
  }, [passageState]);
  const passage: Passage | undefined =
    passageState.status === 'success'
      ? passageState.data
      : passageState.status === 'loading' && stale && refKey(stale.ref) === refKey(displayRef)
        ? stale
        : undefined;
  const isStale = passage != null && passageState.status !== 'success';

  /* ---------- follow the conversation: jump to the highlighted verse ---------- */
  const firstHighlighted = useMemo(() => {
    for (const k of ui.highlightedVerseKeys) return parseVerseKey(k);
    return null;
  }, [ui.highlightedVerseKeys]);

  useEffect(() => {
    if (!paged || !firstHighlighted || firstHighlighted.book !== passageRef.book) return;
    if (chapters.includes(firstHighlighted.chapter)) setChapter(firstHighlighted.chapter);
  }, [paged, firstHighlighted, chapters, passageRef.book]);

  /* ---------- verse menu ---------- */
  const [menu, setMenu] = useState<{ verse: Verse; anchor: HTMLElement } | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  // The menu's anchor is replaced when the view changes underneath it.
  useEffect(() => setMenu(null), [mode, translation, chapter]);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(''), 2800);
    return () => window.clearTimeout(timer);
  }, [status]);

  const multiChapter = chapters.length > 1;

  const menuItems = (v: Verse): VerseMenuItem[] => [
    {
      id: 'explain',
      label: t('menu.explain'),
      icon: <MessageSquareText />,
      onSelect: () => {
        void send(t('ask.explainVerse', { verse: verseLabel(v.ref, multiChapter, locale) }));
        if (isPhone()) setMobilePane('chat');
      },
    },
    {
      id: 'xrefs',
      label: t('menu.xrefs'),
      icon: <Link2 />,
      onSelect: () => {
        ui.setExpanded(DATASET_PANEL_ID, true);
        // A new focus: this verse becomes the one highlighted, named in the banner and put first in
        // Cross-references (the previous focus — banner, highlights, pins — is replaced, not left behind).
        focusDashboard({
          section: 'cross-references',
          highlightVerses: [v.ref],
          crossReferenceFilter: {},
          reason: t('reason.xrefs', { ref: verseRefLabel(v.ref) }),
        });
        requestAnimationFrame(() => focusSectionHeading('cross-references'));
      },
    },
    {
      id: 'copy',
      label: t('menu.copy'),
      icon: <Copy />,
      onSelect: () => {
        const text = `${verseText(v)}\n— ${verseRefLabel(v.ref)} (${versionShort})`;
        const done = () => setStatus(t('copy.done', { ref: verseRefLabel(v.ref), version: versionShort }));
        const failed = () => setStatus(t('copy.failed'));
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, failed);
        else failed();
      },
    },
  ];

  /* ---------- word actions ---------- */
  const openKeyWord = useCallback((keyWordId: string) => openInspector({ type: 'word', keyWordId }), [openInspector]);
  const openOriginalWord = useCallback(
    (w: OriginalWord, verse: VerseRef) => openInspector({ type: 'word', strong: w.strong, verse, surface: w.surface, gloss: w.gloss }),
    [openInspector],
  );
  const onVerseNumber = useCallback((verse: Verse, anchor: HTMLElement) => {
    setMenu((m) => (m && verseKey(m.verse.ref) === verseKey(verse.ref) ? null : { verse, anchor }));
  }, []);

  const changeChapter = (c: number, scrollToTop: boolean) => {
    setChapter(c);
    closeMenu();
    if (scrollToTop) requestAnimationFrame(() => scrollToSectionSettled('scripture'));
  };

  /* ---------- rendering ---------- */
  const book = getBook(passageRef.book);
  const bookName = chapterBookName(passageRef.book, locale);
  const source = passage ? sources.getSource(passage.sourceId) : undefined;
  const originalSourceId = originalState.data?.[0]?.sourceId;
  const originalSource = originalSourceId ? sources.getSource(originalSourceId) : undefined;
  const hasAnchoredWords = study.keyWords.some((kw) => kw.anchors.some((a) => a.phrases[translation]));
  const hebrew = book.language === 'hebrew';
  // "Bíblia Livre — CC BY 4.0": the version's own name and its license in the reader's language.
  const versionTitle = translationInfo
    ? versionSource
      ? t('version.label', { name: translationInfo.name, license: licenseName(versionSource.license, locale) })
      : translationInfo.name
    : undefined;

  const toolbar = (
    <>
      <span className={styles.translation} title={versionTitle}>
        <BookOpen aria-hidden="true" />
        <span>{versionShort}</span>
        <span className="visually-hidden">{versionTitle ? ` — ${versionTitle}` : ''}</span>
      </span>
      <SegmentedControl
        label={t('view.label')}
        value={mode}
        onChange={(scriptureMode) => updateSettings({ scriptureMode })}
        options={[
          { value: 'reader', label: t('view.reader'), icon: <BookOpen aria-hidden="true" /> },
          { value: 'interlinear', label: t('view.interlinear'), icon: <Languages aria-hidden="true" /> },
        ]}
      />
    </>
  );

  const shared = {
    keyWords: study.keyWords,
    showVerseNumbers: settings.showVerseNumbers,
    showChapterHeadings: !paged && multiChapter,
    includeVerse,
    highlightedVerseKeys: ui.highlightedVerseKeys,
    highlightedWordIds: ui.highlightedWordIds,
    keyWordHintId: hintId,
    onVerseNumber,
    openVerseKey: menu ? verseKey(menu.verse.ref) : undefined,
  };

  return (
    <StudySection
      id="scripture"
      index={index}
      toolbar={toolbar}
      description={study.keyWords.length > 0 ? undefined : t('description.noKeyWords')}
    >
      <span id={hintId} hidden>
        {t('keyWord.hint')}
      </span>

      <div className={styles.meta}>
        <div className={styles.metaLabel}>
          <ProvenanceTag kind={mode === 'interlinear' ? 'original-text' : 'scripture'} />
          <span className={styles.passageLabel}>{ref(paged ? displayRef : passageRef)}</span>
          {translationInfo && <span className={styles.translationName}>· {translationInfo.name}</span>}
        </div>
        {paged && (
          <ChapterStepper bookName={bookName} chapters={chapters} value={chapter} onChange={(c) => changeChapter(c, false)} />
        )}
      </div>

      {mode === 'interlinear' && (
        <p className={styles.glossKey}>
          {locale !== 'en' && <span className={styles.glossKeyItem}>{t('glossKey.glosses', { inEnglish: tp('inEnglish') })}</span>}
          <span className={styles.glossKeyItem}>
            <span className={styles.glossImplied}>{t('glossKey.implied.sample')}</span> {t('glossKey.implied.text')}
          </span>
          <span className={styles.glossKeyItem}>
            <span className={styles.glossAdded}>[ ]</span> {t('glossKey.added.text')}
          </span>
          {hebrew && (
            <>
              <span className={styles.glossKeyItem}>
                <span className={styles.glossAdded} aria-hidden="true">
                  ·
                </span>
                <span className="visually-hidden">{t('glossKey.join.sample')}</span> {t('glossKey.join.text')}
              </span>
              <span className={styles.glossKeyItem}>
                <span className={styles.glossStress}>{t('glossKey.stress.sample')}</span>
                {t('glossKey.stress.rest')}
              </span>
            </>
          )}
        </p>
      )}

      <div className={styles.text} aria-busy={isStale || passageState.status === 'loading'} data-stale={isStale || undefined}>
        {passageState.status === 'error' && !passage ? (
          <div className={styles.error} role="alert">
            <p className={styles.errorTitle}>{t('error.title', { version: versionShort })}</p>
            <p className={styles.errorDetail}>{t('error.detail')}</p>
            <RetryButton onRetry={passageState.retry} className={styles.errorRetry} />
          </div>
        ) : !passage ? (
          <ScriptureSkeleton label={t('loading', { ref: ref(displayRef) })} />
        ) : mode === 'interlinear' ? (
          <InterlinearView
            {...shared}
            passage={passage}
            original={originalState}
            onKeyWord={openKeyWord}
            onWord={openOriginalWord}
          />
        ) : (
          <ReaderView {...shared} passage={passage} variant="study" onKeyWord={openKeyWord} />
        )}
      </div>

      {paged && passage && (
        <ChapterStepper variant="footer" bookName={bookName} chapters={chapters} value={chapter} onChange={(c) => changeChapter(c, true)} />
      )}

      {passage && (
        <footer className={styles.footer}>
          {mode === 'reader' && hasAnchoredWords && (
            <p className={styles.legend}>
              <span className={styles.legendSample} aria-hidden="true">
                {t('legend.sample')}
              </span>
              {t('legend.reader')}
            </p>
          )}
          {mode === 'interlinear' && (
            <p className={styles.legend}>
              {t('legend.interlinear', { anchored: hasAnchoredWords ? 'yes' : 'no' })}
              {hebrew ? ` ${t('legend.rtl')}` : ''}
            </p>
          )}
          <div className={styles.attribution}>
            <span className={styles.attributionLabel}>{t('attribution.text')}</span>
            <SourceChip citation={{ sourceId: passage.sourceId }} />
            {source && <span className={styles.license}>{licenseName(source.license, locale)}</span>}
            {mode === 'interlinear' && originalSourceId && (
              <>
                <span className={styles.attributionLabel}>{t('attribution.original')}</span>
                <SourceChip citation={{ sourceId: originalSourceId }} />
                {originalSource && <span className={styles.license}>{licenseName(originalSource.license, locale)}</span>}
              </>
            )}
          </div>
        </footer>
      )}

      <div className={styles.statusSlot}>
        <p role="status" className={styles.status} data-visible={status ? 'true' : undefined}>
          {status}
        </p>
      </div>

      {menu && menu.anchor.isConnected && (
        <VerseMenu anchor={menu.anchor} label={verseRefLabel(menu.verse.ref)} items={menuItems(menu.verse)} onClose={closeMenu} />
      )}
    </StudySection>
  );
}
