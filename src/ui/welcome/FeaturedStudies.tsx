import { ArrowRight } from 'lucide-react';
import { useId, useMemo } from 'react';
import type { CuratedStudy, Passage, PassageRef } from '../../domain/models';
import { localizedBookName } from '../../domain/bookNames';
import { bookDisplayName, tryGetBook } from '../../domain/books';
import { useI18n, useT } from '../../i18n/I18nProvider';
import type { Locale } from '../../i18n/locales';
import { cx } from '../../lib/cx';
import { useProviders } from '../../providers/ProvidersContext';
import { useSession } from '../../state/session';
import { usePassage } from '../hooks/data';
import { Badge } from '../primitives';
import styles from './FeaturedStudies.module.css';
import { cardSpans } from './featuredLayout';

const TINTS = ['olive', 'terracotta', 'sage', 'sand'] as const;
type Tint = (typeof TINTS)[number];

/** Curated studies in the reader's language, as cards (arch-topped tinted band, title, subtitle, opening verse). */
export function FeaturedStudies({ disabled = false }: { disabled?: boolean }) {
  const { studies } = useProviders();
  const { locale } = useI18n();
  const t = useT('welcome');
  const headingId = useId();
  const list = useMemo<CuratedStudy[]>(() => {
    try {
      return studies.list(locale);
    } catch {
      return [];
    }
  }, [studies, locale]);

  const spans = useMemo(() => cardSpans(list.length), [list.length]);

  if (!list.length) return null;

  return (
    <section className={styles.featured} aria-labelledby={headingId}>
      <header className={styles.head}>
        <h2 id={headingId} className={styles.heading}>
          {t('featured.heading')}
        </h2>
        <p className={styles.sub}>{t('featured.sub')}</p>
      </header>
      <ul className={styles.grid} data-odd={list.length % 2 === 1 || undefined}>
        {list.map((study, i) => (
          <li key={study.id} className={styles.cell} data-span={spans[i]}>
            <StudyCard study={study} tint={TINTS[i % TINTS.length]} disabled={disabled} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function StudyCard({ study, tint, disabled }: { study: CuratedStudy; tint: Tint; disabled: boolean }) {
  const { openStudy, settings } = useSession();
  const { locale, ref } = useI18n();
  const t = useT('welcome');
  const titleId = useId();
  const verse = useMemo(() => openingVerse(study), [study]);
  const passage = usePassage(verse ?? undefined, settings.translation);
  const verseText = passage.status === 'success' ? firstVerseText(passage.data) : undefined;
  const mark = archMark(study, locale, { book: t('arch.book'), topic: t('arch.topic') });

  return (
    <article className={cx(styles.card, styles[tint])} aria-labelledby={titleId}>
      <div className={styles.band} aria-hidden="true">
        <span className={styles.arch}>
          <span className={styles.archTop}>{mark.top}</span>
          <span className={styles.archMain}>{mark.main}</span>
        </span>
      </div>
      <div className={styles.body}>
        <p className={styles.kind}>{study.kind === 'passage' ? t('featured.kind.passage') : t('featured.kind.topic')}</p>
        <h3 id={titleId} className={styles.title}>
          <button type="button" className={styles.open} onClick={() => void openStudy({ studyId: study.id })} disabled={disabled}>
            {study.title}
          </button>
        </h3>
        {study.subtitle && <p className={styles.subtitle}>{study.subtitle}</p>}
        {verse && (
          <figure className={styles.excerpt}>
            {verseText ? (
              <blockquote className={styles.verse}>
                <p>{verseText}</p>
              </blockquote>
            ) : (
              <div className={styles.versePlaceholder} aria-hidden="true">
                <span />
                <span />
              </div>
            )}
            <figcaption className={styles.verseRef}>
              {ref(verse)} · {passage.status === 'success' ? passage.data.translation : settings.translation}
            </figcaption>
          </figure>
        )}
        <div className={styles.foot}>
          <Badge tone="olive" title={t('featured.badgeTitle')}>
            {t('featured.badge')}
          </Badge>
          <span className={styles.cta} aria-hidden="true">
            {t('featured.open')}
            <ArrowRight />
          </span>
        </div>
      </div>
    </article>
  );
}

/** First verse of the study passage (or of the topic's first key passage) — a short excerpt fetched from the ScriptureProvider. */
function openingVerse(study: CuratedStudy): PassageRef | null {
  const ref = study.passage ?? study.topic?.keyPassages[0]?.ref;
  if (!ref || !tryGetBook(ref.book)) return null;
  const v = ref.startVerse ?? 1;
  return { book: ref.book, startChapter: ref.startChapter, startVerse: v, endChapter: ref.startChapter, endVerse: v };
}

function firstVerseText(p: Passage): string | undefined {
  const v = p.chapters[0]?.verses[0];
  if (!v) return undefined;
  return v.poetryLines?.length ? v.poetryLines.join(' ') : v.text;
}

/** A leading article in any of the four languages ("The Trinity", "A Trindade", "La Trinidad", "L’Esprit"). */
const LEADING_ARTICLE = /^(?:(?:the|o|a|os|as|el|la|los|las|le|les)\s+|l['’]\s*)/i;

/**
 * What sits inside the arch, in the reader's language: book + chapter for passages ("ROMANOS / 8",
 * "SALMO / 23"), an initial for topics ("TEMA / G").
 */
function archMark(study: CuratedStudy, locale: Locale, labels: { book: string; topic: string }): { top: string; main: string } {
  const ref = study.passage;
  const book = ref ? tryGetBook(ref.book) : undefined;
  if (study.kind === 'passage' && ref && book) {
    const end = ref.endChapter ?? ref.startChapter;
    const wholeBook = ref.startChapter === 1 && end === book.chapters && ref.startVerse == null;
    const name = bookDisplayName(book.id, locale);
    if (wholeBook) return { top: labels.book, main: name.replace(/^\d\s*/, '').charAt(0) };
    const psalm = locale === 'en' ? 'Psalm' : (localizedBookName('PSA', locale)?.singular ?? name);
    return {
      top: book.id === 'PSA' ? psalm : name,
      main: end !== ref.startChapter ? `${ref.startChapter}–${end}` : String(ref.startChapter),
    };
  }
  const name = study.topic?.name ?? study.title;
  return { top: labels.topic, main: name.replace(LEADING_ARTICLE, '').charAt(0).toUpperCase() };
}
