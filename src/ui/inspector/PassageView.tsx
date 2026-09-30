import { BookOpen, MessageSquareText } from 'lucide-react';
import type { PassageRef } from '../../domain/models';
import { chaptersOf, refContains, refKey } from '../../domain/reference';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { useProviders } from '../../providers/ProvidersContext';
import { useSession } from '../../state/session';
import { RetryButton } from '../common/RetryButton';
import { SourceChip } from '../common/SourceChip';
import { usePassage } from '../hooks/data';
import { Button, ProvenanceTag } from '../primitives';
import { ReaderView } from '../study/scripture/ReaderView';
import { ScriptureSkeleton } from '../study/scripture/ScriptureSkeleton';
import { verseLabel } from '../study/scripture/ReaderView';
import { licenseName } from './licenseText';
import styles from './InspectorViews.module.css';

/** Longer passages are previewed; "Study this passage" opens them in full. */
const MAX_PREVIEW_CHAPTERS = 3;

interface PassageViewProps {
  passageRef: PassageRef;
  title?: string;
  titleId: string;
  onDone(): void;
}

function isPhone(): boolean {
  return window.matchMedia?.('(max-width: 759px)').matches ?? false;
}

/** Passage view: the full text in the reader's selected version, with the next steps. */
export function PassageView({ passageRef, title, titleId, onDone }: PassageViewProps) {
  const { settings, study, openStudy, send, setMobilePane } = useSession();
  const { scripture, sources } = useProviders();
  const t = useT('inspector');
  const ts = useT('scripture');
  const { locale, ref: refLabel } = useI18n();
  const translation = settings.translation;
  const info = scripture.listTranslations().find((x) => x.id === translation);
  const versionShort = info?.shortName ?? translation;

  const chapters = chaptersOf(passageRef);
  const capped = chapters.length > MAX_PREVIEW_CHAPTERS;
  const shownRef: PassageRef = capped
    ? { book: passageRef.book, startChapter: passageRef.startChapter, endChapter: passageRef.startChapter + MAX_PREVIEW_CHAPTERS - 1 }
    : passageRef;
  const state = usePassage(shownRef, translation);
  const source = state.data ? sources.getSource(state.data.sourceId) : undefined;

  const label = refLabel(passageRef);
  const studyPassage = study?.passage;
  const isCurrentStudy = studyPassage != null && refKey(studyPassage) === refKey(passageRef);
  const insideStudy = studyPassage != null && refContains(studyPassage, passageRef);

  const ask = () => {
    let question: string;
    if (insideStudy && passageRef.startVerse != null && (passageRef.endVerse ?? passageRef.startVerse) === passageRef.startVerse) {
      const multi = chaptersOf(studyPassage!).length > 1;
      const verse = verseLabel({ book: passageRef.book, chapter: passageRef.startChapter, verse: passageRef.startVerse }, multi, locale);
      question = ts('ask.explainVerse', { verse });
    } else if (study) {
      question = t('ask.connect', { ref: label, other: studyPassage ? refLabel(studyPassage) : study.title });
    } else {
      question = t('ask.about', { ref: label });
    }
    void send(question);
    if (isPhone()) setMobilePane('chat');
    onDone();
  };

  return (
    <div className={styles.view}>
      <div className={styles.titleBlock}>
        <h2 id={titleId} className={styles.title}>
          {label}
        </h2>
        {title && <p className={styles.subtitle}>{title}</p>}
        <p className={styles.meta}>
          <ProvenanceTag kind="scripture" />
          <span>{info?.name ?? versionShort}</span>
        </p>
      </div>

      <div aria-busy={state.status === 'loading'}>
        {state.status === 'error' ? (
          <p className={styles.muted} role="alert">
            {ts('error.title', { version: versionShort })} <RetryButton onRetry={state.retry} />
          </p>
        ) : state.data ? (
          <ReaderView
            passage={state.data}
            variant="plain"
            showVerseNumbers={settings.showVerseNumbers}
            showChapterHeadings={state.data.chapters.length > 1}
          />
        ) : (
          <ScriptureSkeleton label={ts('loading', { ref: label })} lines={6} />
        )}
        {capped && state.data && (
          <p className={styles.muted}>
            {t('passage.capped', { count: MAX_PREVIEW_CHAPTERS, ref: label })}
          </p>
        )}
      </div>

      {state.data && (
        <div className={styles.attribution}>
          <SourceChip citation={{ sourceId: state.data.sourceId }} />
          {source && <span className={styles.muted}>{licenseName(source.license, locale)}</span>}
        </div>
      )}

      <div className={styles.actions}>
        {!isCurrentStudy && (
          <Button
            variant="primary"
            size="sm"
            icon={<BookOpen aria-hidden="true" />}
            onClick={() => {
              void openStudy({ passage: passageRef });
              onDone();
            }}
          >
            {t('passage.study')}
          </Button>
        )}
        <Button variant="secondary" size="sm" icon={<MessageSquareText aria-hidden="true" />} onClick={ask}>
          {insideStudy ? t('passage.askAbout') : t('passage.askConnect')}
        </Button>
      </div>
    </div>
  );
}
