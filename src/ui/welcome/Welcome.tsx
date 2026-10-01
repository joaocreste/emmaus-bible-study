import { ArrowRight, BookOpen, Compass, MessageCircleQuestionMark } from 'lucide-react';
import { useId, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import type { PassageRef, TranslationId } from '../../domain/models';
import { wholeBook } from '../../domain/reference';
import { getBibleVersion } from '../../domain/translations';
import { useI18n, useT } from '../../i18n/I18nProvider';
import type { MessageKey } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';
import { cx } from '../../lib/cx';
import { useSessionInternals } from '../../state/session';
import { useThinkingStep } from '../chat/thinkingSteps';
import { useInferenceStatus } from '../hooks/useInferenceStatus';
import { Chip, CrossDivider, CrossLoader, CrossMark } from '../primitives';
import { useStepText } from '../shell/useStepText';
import { FeaturedStudies } from './FeaturedStudies';
import styles from './Welcome.module.css';
import { WELCOME_INPUT_ID, WELCOME_TITLE_ID } from './welcomeFocus';

/** Example passages, written in the reader's language ("João 1:1", "Romanos 8", "Mateus 5–7", "Salmo 23", "Gênesis"). */
const PASSAGES: PassageRef[] = [
  { book: 'JHN', startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 1 },
  { book: 'ROM', startChapter: 8 },
  { book: 'MAT', startChapter: 5, endChapter: 7 },
  { book: 'PSA', startChapter: 23 },
  wholeBook('GEN'),
];

/** Example topics and questions: the chip SENDS its localized text, which the engine understands in every language. */
const TOPICS: MessageKey<'welcome'>[] = [
  'topic.grace',
  'topic.faith',
  'topic.forgiveness',
  'topic.suffering',
  'topic.prayer',
  'topic.salvation',
  'topic.trinity',
  'topic.holySpirit',
  'topic.marriage',
  'topic.anxiety',
  'topic.predestination',
  'topic.kingdom',
];
const QUESTIONS: MessageKey<'welcome'>[] = ['question.wealth', 'question.suffering'];

/** Luke 24:32 — where the product's name comes from. */
const EMMAUS_REF: PassageRef = { book: 'LUK', startChapter: 24, startVerse: 32, endChapter: 24, endVerse: 32 };

/**
 * The words of the two disciples in Luke 24:32, in each language's default version — exact wording
 * (the direct speech only), checked against bible.helloao.org/api/<apiId>/LUK/24.json:
 * BSB, por_blj (Bíblia Livre), spa_r09 (Reina-Valera 1909), fra_lsg (Louis Segond 1910).
 * The quotation marks are the language's own; the words are the version's.
 */
const EMMAUS_VERSE: Record<Locale, { version: TranslationId; text: string; open: string; close: string }> = {
  en: {
    version: 'BSB',
    text: 'Were not our hearts burning within us as He spoke with us on the road and opened the Scriptures to us?',
    open: '“',
    close: '”',
  },
  pt: {
    version: 'BLIVRE',
    text: 'Por acaso não estava nosso coração ardendo em nós, quando ele falava conosco pelo caminho, e quando nos desvendava as Escrituras?',
    open: '“',
    close: '”',
  },
  es: {
    version: 'RVR1909',
    text: '¿No ardía nuestro corazón en nosotros, mientras nos hablaba en el camino, y cuando nos abría las Escrituras?',
    open: '«',
    close: '»',
  },
  fr: {
    version: 'LSG',
    text: 'Notre cœur ne brûlait-il pas au-dedans de nous, lorsqu’il nous parlait en chemin et nous expliquait les Écritures?',
    open: '«\u00a0',
    close: '\u00a0»',
  },
};

/** The calm starting screen (docs/DESIGN.md §5): one question, two paths, featured studies. */
export function Welcome() {
  const { send, status, pendingText, liveSteps, messages, retryByMessage, settings } = useSessionInternals();
  const t = useT('welcome');
  const { locale, ref } = useI18n();
  const passages = useMemo(() => PASSAGES.map((p) => ref(p)), [ref]);
  const epigraph = EMMAUS_VERSE[locale];
  const epigraphVersion = safeVersionName(epigraph.version);
  const [draft, setDraft] = useState('');
  const thinking = status === 'thinking';
  const stepText = useStepText();
  const liveLines = stepText.lines(liveSteps);
  const liveStep = liveLines[liveLines.length - 1];
  const cannedStep = useThinkingStep(thinking && !liveStep, pendingText);
  const step = liveStep ?? cannedStep;
  const inference = useInferenceStatus();
  const composesLive = settings.liveComposition && inference?.available === true;
  const titleId = WELCOME_TITLE_ID;
  const inputId = WELCOME_INPUT_ID;
  const last = messages[messages.length - 1];
  const failed = !thinking && !!last && !!retryByMessage[last.id];

  const start = (text: string) => {
    if (!text.trim() || thinking) return;
    void send(text);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    start(draft);
  };

  return (
    <div className={styles.welcome}>
      <section className={cx(styles.hero, styles.reveal)} aria-labelledby={titleId}>
        <div className={styles.archway} aria-hidden="true" />
        <CrossMark size={56} className={styles.emblem} />
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h1 id={titleId} tabIndex={-1} className={cx('t-display', styles.title)}>
          {t('headline')}
        </h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>

        <form className={styles.ask} onSubmit={onSubmit} role="search" aria-label={t('form.label')}>
          <label htmlFor={inputId} className="visually-hidden">
            {t('input.label')}
          </label>
          <input
            id={inputId}
            className={styles.input}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('input.placeholder')}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            maxLength={500}
            readOnly={thinking}
            aria-describedby={`${inputId}-status`}
          />
          <button
            type="submit"
            className={styles.submit}
            aria-label={thinking ? t('submit.opening') : t('submit.start')}
            disabled={thinking || !draft.trim()}
          >
            {thinking ? <CrossLoader size={20} label={t('submit.opening')} className={styles.loader} /> : <ArrowRight aria-hidden="true" />}
          </button>
        </form>
        <p id={`${inputId}-status`} className={styles.status}>
          {thinking ? (
            <span className={styles.step} key={liveStep ? `live-${liveSteps.length}` : step} aria-hidden="true">
              {step}
            </span>
          ) : failed ? (
            <span className={styles.error} role="alert">
              {t('error')}
            </span>
          ) : (
            <span className={styles.examples}>{t('examples')}</span>
          )}
        </p>
        {composesLive && <p className={styles.liveNote}>{t('liveNote')}</p>}
      </section>

      <section className={cx(styles.paths, styles.reveal)} aria-label={t('paths.label')}>
        <PathCard icon={<BookOpen aria-hidden="true" />} title={t('path.passage.title')} description={t('path.passage.description')}>
          {passages.map((p) => (
            <li key={p}>
              <Chip className={styles.refChip} onClick={() => start(p)} disabled={thinking}>
                {p}
              </Chip>
            </li>
          ))}
        </PathCard>
        <PathCard icon={<Compass aria-hidden="true" />} title={t('path.topic.title')} description={t('path.topic.description')}>
          {TOPICS.map((key) => (
            <li key={key}>
              <Chip onClick={() => start(t(key))} disabled={thinking}>
                {t(key)}
              </Chip>
            </li>
          ))}
          {QUESTIONS.map((key) => (
            <li key={key}>
              <Chip
                className={styles.questionChip}
                icon={<MessageCircleQuestionMark aria-hidden="true" />}
                onClick={() => start(t(key))}
                disabled={thinking}
              >
                {t(key)}
              </Chip>
            </li>
          ))}
        </PathCard>
      </section>

      <div className={styles.reveal}>
        <FeaturedStudies disabled={thinking} />
      </div>

      <footer className={cx(styles.footer, styles.reveal)}>
        <CrossDivider compact />
        <figure className={styles.epigraph}>
          <blockquote className={styles.epigraphText}>
            <p>
              {epigraph.open}
              {epigraph.text}
              {epigraph.close}
            </p>
          </blockquote>
          <figcaption className={styles.epigraphRef}>
            {ref(EMMAUS_REF)} · {epigraphVersion}
          </figcaption>
        </figure>
        <p className={styles.local}>{t('footer.local')}</p>
      </footer>
    </div>
  );
}

function safeVersionName(id: TranslationId): string {
  try {
    return getBibleVersion(id).name;
  } catch {
    return id;
  }
}

function PathCard({ icon, title, description, children }: { icon: ReactNode; title: string; description: string; children: ReactNode }) {
  const id = useId();
  return (
    <div className={styles.path} role="group" aria-labelledby={id}>
      <div className={styles.pathHead}>
        <span className={styles.pathIcon}>{icon}</span>
        <div>
          <h2 id={id} className={styles.pathTitle}>
            {title}
          </h2>
          <p className={styles.pathDescription}>{description}</p>
        </div>
      </div>
      <ul className={styles.chips}>{children}</ul>
    </div>
  );
}
