import { Info, Languages } from 'lucide-react';
import { useMemo } from 'react';
import type { KeyWord } from '../../../domain/models';
import { tryGetBook } from '../../../domain/books';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useSession } from '../../../state/session';
import { Button, CrossMark } from '../../primitives';
import { focusSectionHeading, scrollToSectionSettled } from '../StudyNavigation.utils';
import { StudySection } from '../StudySection';
import { pinnedFirst, useStudyUI } from '../StudyUIContext';
import type { SectionProps } from '../types';
import { OriginalLanguageCard } from '../words/OriginalLanguageCard';
import styles from './OriginalLanguagesSection.module.css';

function isPhone(): boolean {
  return window.matchMedia?.('(max-width: 759px)').matches ?? false;
}

/** IV. Original languages — the key Hebrew, Aramaic and Greek words behind the translation. */
export function OriginalLanguagesSection({ study, index }: SectionProps) {
  const { send, setMobilePane, openInspector, focusDashboard, updateSettings } = useSession();
  const ui = useStudyUI();
  const t = useT('words');
  const { verse: verseLabel, list } = useI18n();
  const words = useMemo(() => pinnedFirst(study.keyWords, ui.pinnedIds), [study.keyWords, ui.pinnedIds]);

  const ask = (kw: KeyWord) => {
    const anchor = kw.anchors[0]?.verse;
    void send(anchor ? t('ask.wordIn', { word: kw.english, ref: verseLabel(anchor) }) : t('ask.word', { word: kw.english }));
    if (isPhone()) setMobilePane('chat');
  };

  const showInPassage = (kw: KeyWord) =>
    focusDashboard({
      section: 'scripture',
      highlightWordIds: [kw.id],
      highlightVerses: kw.anchors.map((a) => a.verse),
    });

  const openInterlinear = () => {
    updateSettings({ scriptureMode: 'interlinear' });
    requestAnimationFrame(() => {
      scrollToSectionSettled('scripture');
      focusSectionHeading('scripture');
    });
  };

  const bookLanguage = study.passage ? tryGetBook(study.passage.book)?.language : undefined;
  // "the Greek words" / "as palavras gregas" / "les mots grecs": the language adjectives agree with "words".
  const languages = list([...new Set(words.map((w) => t(`language.${w.language}.words`)))]);
  const description =
    words.length > 0
      ? t('description.keyWords', { languages })
      : bookLanguage
        ? t('description.text', { language: bookLanguage })
        : undefined;

  return (
    <StudySection id="original-languages" index={index} description={description}>
      <p className={styles.caution} role="note">
        <Info aria-hidden="true" />
        <span>{t('caution')}</span>
      </p>

      {words.length > 0 ? (
        <ul className={styles.grid}>
          {words.map((kw) => (
            <li key={kw.id} className={styles.cell}>
              <OriginalLanguageCard
                keyWord={kw}
                highlighted={ui.highlightedWordIds.has(kw.id)}
                updated={ui.updatedIds.has(kw.id)}
                pulseKey={ui.focusSeq}
                lexiconOpen={ui.isExpanded(kw.id)}
                onLexiconOpenChange={(open) => ui.setExpanded(kw.id, open)}
                onShowInPassage={() => showInPassage(kw)}
                onAsk={() => ask(kw)}
                onMoreOccurrences={() => openInspector({ type: 'word', keyWordId: kw.id })}
              />
            </li>
          ))}
        </ul>
      ) : study.passage ? (
        <div className={styles.library}>
          <span className={styles.arch} aria-hidden="true">
            <CrossMark variant="glyph" size={20} />
          </span>
          <div className={styles.libraryText}>
            <p className={styles.libraryTitle}>{t('library.title')}</p>
            <p className={styles.libraryBody}>{t('library.body')}</p>
            <Button variant="quiet" size="sm" icon={<Languages aria-hidden="true" />} onClick={openInterlinear}>
              {t('library.open')}
            </Button>
          </div>
        </div>
      ) : (
        <p className={styles.none}>{t('none')}</p>
      )}
    </StudySection>
  );
}
