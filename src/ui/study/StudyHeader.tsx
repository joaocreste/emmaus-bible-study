import { Feather, Languages, Library, PenLine, RotateCw } from 'lucide-react';
import type { ContextCategory, GenerationInfo, Study } from '../../domain/models';
import { tryGetBook } from '../../domain/books';
import { formatRef, isWholeBook } from '../../domain/reference';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { useSessionInternals } from '../../state/session';
import { ProvenanceLine } from '../common/SourceChip';
import { Badge, Button, Toggletip } from '../primitives';
import { scrollToSectionSettled } from './StudyNavigation.utils';
import { useStudyUI } from './StudyUIContext';
import { canonSectionName, genreName, traditionalAuthorName } from './types';
import styles from './StudyHeader.module.css';

/** Curated context categories that can stand in the meta row (authorship, date, occasion). */
const META_CONTEXT: ContextCategory[] = ['authorship', 'historical-period', 'occasion'];
const MAX_META_TITLE = 52;

const DEPTH_BADGE = {
  curated: { label: 'header.depth.curated', tone: 'olive', Icon: Feather },
  library: { label: 'header.depth.library', tone: 'outline', Icon: Library },
  generated: { label: 'header.depth.generated', tone: 'synthesis', Icon: PenLine },
} as const;

/** "2:14 PM" today, "Sep 27, 2:14 PM" otherwise — in the reader's language. */
function composedAt(ms: number, bcp47: string, now = Date.now()): string {
  const d = new Date(ms);
  if (!Number.isFinite(d.getTime())) return '';
  const time = d.toLocaleTimeString(bcp47, { hour: 'numeric', minute: '2-digit' });
  return new Date(now).toDateString() === d.toDateString() ? time : `${d.toLocaleDateString(bcp47, { month: 'short', day: 'numeric' })}, ${time}`;
}

/** "Composed from 12 sources · 2:14 PM · cached" + Regenerate (no model name: the reader sees study terms only). */
function GenerationLine({ study, generation }: { study: Study; generation: GenerationInfo }) {
  const { status, canRegenerate, regenerate } = useSessionInternals();
  const t = useT('study');
  const { info } = useI18n();
  const sources = study.sourceIds.length || generation.evidenceCount;
  const when = composedAt(generation.createdAt, info.bcp47);
  const details = [
    t('generation.details.retrieved', { evidence: generation.evidenceCount, calls: generation.retrievalCalls }),
    generation.rejectedItems ? t('generation.details.rejected', { count: generation.rejectedItems }) : '',
    generation.cached ? t('generation.details.cached') : '',
  ]
    .filter(Boolean)
    .join('; ');
  return (
    <div className={styles.generation}>
      <p className={styles.generationText} title={`${details}.`}>
        <span>{t('generation.sources', { count: sources })}</span>
        {when && (
          <span>
            <time dateTime={new Date(generation.createdAt).toISOString()}>{when}</time>
          </span>
        )}
        {generation.cached && <span>{t('generation.cached')}</span>}
      </p>
      {canRegenerate && (
        <Button
          variant="quiet"
          size="sm"
          icon={<RotateCw aria-hidden="true" />}
          onClick={() => void regenerate()}
          disabled={status === 'thinking'}
          title={t('generation.regenerateTitle', { query: generation.query })}
        >
          {t('generation.regenerate')}
        </Button>
      )}
    </div>
  );
}

/** Study title block: eyebrow, display title, subtitle, meta row, depth badge and summary. */
export function StudyHeader({ study }: { study: Study }) {
  const ui = useStudyUI();
  const t = useT('study');
  const tp = useT('provenance');
  const { locale, ref } = useI18n();
  const book = study.passage ? tryGetBook(study.passage.book) : undefined;
  const isTopic = study.kind === 'topic';

  const eyebrow = isTopic
    ? t('header.eyebrow.topic')
    : book
      ? t('header.eyebrow.passageIn', { section: canonSectionName(book.section, locale) })
      : t('header.eyebrow.passage');
  const subtitle = study.subtitle ?? (isTopic ? study.topic?.question : undefined);

  const meta: { key: string; label: string; value: string; note?: { label: string; text: string } }[] = [];
  if (!isTopic && book) {
    meta.push({
      key: 'author',
      label: t('header.meta.author'),
      value: traditionalAuthorName(book.traditionalAuthor, locale),
      note: {
        label: t('header.authorNote.label'),
        text: t('header.authorNote.text'),
      },
    });
    meta.push({ key: 'genre', label: t('header.meta.genre'), value: genreName(book.genre, locale) });
    meta.push({ key: 'testament', label: t('header.meta.testament'), value: t(book.testament === 'OT' ? 'testament.OT' : 'testament.NT') });
    // The title usually names the passage already ("Romans 8" / "Romanos 8").
    if (study.passage && !isWholeBook(study.passage) && ref(study.passage) !== study.title && formatRef(study.passage) !== study.title) {
      meta.push({ key: 'passage', label: t('header.meta.passage'), value: ref(study.passage) });
    }
  }
  if (isTopic) {
    const count = study.topic?.keyPassages.length ?? 0;
    if (count > 0) meta.push({ key: 'passages', label: t('header.meta.keyPassages'), value: t('header.meta.keyPassageCount', { count }) });
    if (study.passage) meta.push({ key: 'anchor', label: t('header.meta.anchor'), value: t('header.meta.anchoredIn', { ref: ref(study.passage) }) });
  }

  const contextItem = study.context.find((c) => META_CONTEXT.includes(c.category) && c.title.length <= MAX_META_TITLE);
  const openContext = () => {
    if (!contextItem) return;
    ui.setExpanded(contextItem.id, true);
    scrollToSectionSettled('historical-context');
  };

  const curated = study.depth === 'curated';
  const generated = study.depth === 'generated';
  const badge = DEPTH_BADGE[study.depth] ?? DEPTH_BADGE.library;
  const translated = study.localization?.translatedFrom === 'en' && locale !== 'en';

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <span className={styles.depthRow}>
          {translated && (
            <span className={styles.translated} title={t('header.translatedTitle')}>
              <Languages aria-hidden="true" />
              {tp('translatedFrom.en')}
            </span>
          )}
          <Badge tone={badge.tone} icon={<badge.Icon aria-hidden="true" />} className={styles.depth}>
            {t(badge.label)}
          </Badge>
          {curated && <Toggletip label={t('header.depth.curatedQuestion')}>{t('header.depth.curatedText')}</Toggletip>}
          {generated && <Toggletip label={t('header.depth.generatedQuestion')}>{t('header.depth.generatedText')}</Toggletip>}
        </span>
      </div>

      <h1 className={styles.title}>{study.title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {(meta.length > 0 || contextItem) && (
        <div className={styles.metaWrap}>
          <ul className={styles.meta} aria-label={t('header.meta.label')}>
            {meta.map((m) => (
              <li key={m.key}>
                <span className="visually-hidden">{m.label}: </span>
                {m.value}
                {m.note && (
                  <Toggletip label={m.note.label} className={styles.metaNote}>
                    {m.note.text}
                  </Toggletip>
                )}
              </li>
            ))}
            {contextItem && (
              <li>
                <button type="button" className={styles.contextLink} onClick={openContext} title={t('header.contextLink')}>
                  {contextItem.title}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {study.summary && (
        <div className={styles.summary} data-verification={study.summary.provenance.verification === 'generated' ? 'generated' : undefined}>
          <p className={styles.summaryText}>{study.summary.text}</p>
          <ProvenanceLine provenance={study.summary.provenance} />
        </div>
      )}

      {generated && study.generation && <GenerationLine study={study} generation={study.generation} />}
      {study.depth === 'library' && <p className={styles.libraryNote}>{t('header.depth.libraryText')}</p>}
    </header>
  );
}
