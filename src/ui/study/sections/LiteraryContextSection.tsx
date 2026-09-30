import { bookDisplayName, tryGetBook } from '../../../domain/books';
import type { LiteraryContext, Study } from '../../../domain/models';
import { refKey } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useSession } from '../../../state/session';
import { EmptyState } from '../context/EmptyState';
import { SubHeading } from '../context/SubHeading';
import { SynthesisBlock } from '../context/SynthesisBlock';
import { BookOutline } from '../literary/BookOutline';
import { formatWithinBook } from '../literary/canon';
import { CanonPosition } from '../literary/CanonPosition';
import { FeatureCard } from '../literary/FeatureCard';
import { HeadingOutline } from '../literary/HeadingOutline';
import { segmentWeight } from '../literary/outline';
import { PassageOutlineList } from '../literary/PassageOutlineList';
import { pinnedFirst, useStudyUI } from '../StudyUIContext';
import { StudySection } from '../StudySection';
import type { SectionProps } from '../types';
import styles from './LiteraryContextSection.module.css';

/**
 * Literary context — "Where this sits" (book outline bar, place in the book, the
 * argument, place in the canon), the passage outline, then literary features with
 * chiasm/structure diagrams. Library studies show the computed canon position and
 * the translation's section headings instead, labelled as such.
 */
export function LiteraryContextSection({ study, index }: SectionProps) {
  const { settings } = useSession();
  const i18n = useI18n();
  const t = useT('literary');
  const passage = study.passage;

  if (study.literary) {
    return (
      <StudySection id="literary-context" index={index}>
        <CuratedLiterary study={study} literary={study.literary} />
      </StudySection>
    );
  }

  if (passage) {
    return (
      <StudySection id="literary-context" index={index}>
        <EmptyState size="sm" title={t('empty.noCurated.title')} className={styles.note}>
          <p>{t('empty.noCurated.text')}</p>
        </EmptyState>
        <SubHeading>{t('heading.whereThisSits')}</SubHeading>
        <CanonPosition book={passage.book} />
        <SubHeading note={t('note.fromHeadings', { translation: settings.translation })}>
          {t('heading.outlineOf', { ref: i18n.ref(passage) })}
        </SubHeading>
        <HeadingOutline passage={passage} translation={settings.translation} />
      </StudySection>
    );
  }

  return (
    <StudySection id="literary-context" index={index}>
      <EmptyState size="sm" title={t('empty.noPassage.title')}>
        <p>{t('empty.noPassage.text')}</p>
      </EmptyState>
    </StudySection>
  );
}

function CuratedLiterary({ study, literary }: { study: Study; literary: LiteraryContext }) {
  const { pinnedIds } = useStudyUI();
  const i18n = useI18n();
  const t = useT('literary');
  // A generated page may carry only some of the parts (no outline, no "place in the book").
  const outline = literary.bookOutline ?? [];
  const book = study.passage?.book ?? outline[0]?.ref.book;
  const bookName = book ? (tryGetBook(book) ? bookDisplayName(book, i18n.locale) : book) : undefined;
  const features = pinnedFirst(literary.features ?? [], pinnedIds);
  const current = outline.find((s) => s.current);
  const segments = outline.map((s) => ({
    key: refKey(s.ref),
    label: s.label,
    detail: formatWithinBook(s.ref, i18n.locale),
    weight: segmentWeight(s.ref),
    current: s.current,
  }));

  return (
    <>
      <SubHeading>{t('heading.whereThisSits')}</SubHeading>
      {book && tryGetBook(book) && <CanonPosition book={book} variant="line" className={styles.canonLine} />}
      {segments.length > 0 && (
        <BookOutline
          className={styles.outline}
          segments={segments}
          label={bookName ? t('outline.ofBook', { book: bookName }) : t('outline.ofTheBook')}
          currentLabel={study.passage ? i18n.ref(study.passage) : current?.label}
          currentNote={t('outline.thisPassage')}
        />
      )}

      <div className={styles.readings}>
        {literary.placeInBook?.text && <SynthesisBlock heading={t('reading.inTheBook')} headingLevel={4} content={literary.placeInBook} />}
        {literary.argument && <SynthesisBlock heading={t('reading.argument')} headingLevel={4} content={literary.argument} />}
        {literary.placeInCanon && (
          <SynthesisBlock heading={t('reading.inCanon')} headingLevel={4} content={literary.placeInCanon} />
        )}
      </div>

      {literary.passageOutline && literary.passageOutline.length > 0 && (
        <>
          <SubHeading>{t('heading.passageOutline')}</SubHeading>
          <PassageOutlineList
            segments={literary.passageOutline}
            label={study.passage ? t('heading.outlineOf', { ref: i18n.ref(study.passage) }) : t('heading.passageOutline')}
          />
        </>
      )}

      {features.length > 0 && (
        <>
          <SubHeading note={t('note.howWritten')}>{t('heading.howWritten')}</SubHeading>
          <ul className={styles.features} aria-label={t('features.list')}>
            {features.map((f) => (
              <FeatureCard key={f.id} feature={f} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
