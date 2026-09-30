import { useId, useMemo, useState } from 'react';
import type { CommentaryInfo, CommentarySection as CommentaryPart, PassageRef, Provenance } from '../../../domain/models';
import { tryGetBook } from '../../../domain/books';
import { parseRefKey, refKey, verseKey } from '../../../domain/reference';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { useProviders } from '../../../providers/ProvidersContext';
import { useSession } from '../../../state/session';
import { InEnglishMark, useEnglishLang } from '../../common/InEnglish';
import { RetryButton } from '../../common/RetryButton';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { useCommentary, usePassage } from '../../hooks/data';
import { CrossLoader } from '../../primitives';
import { LicenseLine } from '../context/LicenseLine';
import { splitParagraphs } from '../context/SynthesisBlock';
import { Tabs } from '../context/Tabs';
import { useStudyUI } from '../StudyUIContext';
import styles from './ClassicCommentaries.module.css';
import { defaultScope, isLargePassage, scopeGroups } from './scope';

/** Long sections are clamped with "Read more" beyond this many characters. */
const CLAMP_CHARS = 900;

/**
 * Classic commentaries & open study notes for the passage: tabs per commentary
 * (Tyndale Open Study Notes first), scoped to the verse under discussion with a
 * verse selector, text from the CommentaryProvider with its license line. The texts exist only
 * in English; other languages mark them "(in English)" and tag them lang="en".
 */
export function ClassicCommentaries({ passage, study }: { passage: PassageRef; study: string }) {
  const { commentary } = useProviders();
  const { activeVerse } = useStudyUI();
  const { settings } = useSession();
  const { locale } = useI18n();
  const t = useT('commentary');
  const selectId = useId();

  const testament = tryGetBook(passage.book)?.testament;
  const list = useMemo(() => orderCommentaries(safeList(() => commentary.listCommentaries()), testament), [commentary, testament]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const selectedId = selected && list.some((c) => c.id === selected) ? selected : list[0]?.id;

  // The reader's pick holds until the conversation moves to another verse (or study).
  const followKey = `${study}|${activeVerse ? verseKey(activeVerse) : ''}`;
  const [picked, setPicked] = useState<{ key: string; ref: PassageRef } | null>(null);
  const scope = picked && picked.key === followKey ? picked.ref : defaultScope(passage, activeVerse);

  // verse options need the text; long passages are offered chapter by chapter instead
  const text = usePassage(isLargePassage(passage) ? undefined : passage, settings.translation);
  const groups = scopeGroups(passage, text.data, scope, locale);

  if (list.length === 0) {
    return <p className={styles.status}>{t('classic.none')}</p>;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.scope}>
        <label htmlFor={selectId} className={styles.scopeLabel}>
          {t('classic.scopeLabel')}
        </label>
        <select
          id={selectId}
          className={styles.select}
          value={refKey(scope)}
          onChange={(e) => {
            const ref = parseRefKey(e.target.value);
            if (ref) setPicked({ key: followKey, ref });
          }}
        >
          {groups.map((g, i) =>
            g.label ? (
              <optgroup key={i} label={g.label}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              g.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))
            ),
          )}
        </select>
      </div>

      <Tabs
        items={list.map((c) => ({ id: c.id, label: c.name }))}
        selectedId={selectedId ?? ''}
        onSelect={setSelected}
        label={t('classic.tabs')}
        activation="manual"
        renderPanel={(id) => {
          const info = list.find((c) => c.id === id);
          return info ? <CommentaryText key={`${id}|${refKey(scope)}`} info={info} scope={scope} /> : null;
        }}
      />
    </div>
  );
}

function CommentaryText({ info, scope }: { info: CommentaryInfo; scope: PassageRef }) {
  const state = useCommentary(info.id, scope);
  const { sources } = useProviders();
  const i18n = useI18n();
  const t = useT('commentary');
  const source = sources.getSource(info.sourceId);
  const scopeLabel = i18n.ref(scope);

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <div className={styles.status}>
        <CrossLoader size={20} label={t('classic.consultingLabel', { name: info.name, ref: scopeLabel })} />
        <span aria-hidden="true">{t('classic.consulting', { name: info.name, ref: scopeLabel })}</span>
      </div>
    );
  }

  if (state.status === 'error' || state.data.length === 0) {
    return (
      <div className={styles.unavailable}>
        <p className={styles.unavailableTitle}>{t('classic.unavailable.title')}</p>
        <p className={styles.unavailableText}>
          {state.status === 'error'
            ? t('classic.unavailable.error', { name: info.name, ref: scopeLabel })
            : t('classic.unavailable.empty', { name: info.name, ref: scopeLabel })}
          {state.status === 'error' && <RetryButton onRetry={state.retry} />}
        </p>
      </div>
    );
  }

  const provenance: Provenance = {
    kind: 'commentary',
    verification: 'source-derived',
    citations: [{ sourceId: info.sourceId, locator: t('classic.locator', { ref: i18n.ref(scope, 'short') }) }],
  };

  return (
    <div>
      <ol className={styles.sections} aria-label={t('classic.sectionsLabel', { name: info.name, ref: scopeLabel })}>
        {state.data.map((part, i) => (
          <PartItem key={`${refKey(part.ref)}-${i}`} part={part} markEnglish={i === 0} />
        ))}
      </ol>
      <div className={styles.footer}>
        <ProvenanceLine provenance={provenance} />
        {source && <LicenseLine source={source} />}
      </div>
    </div>
  );
}

/** One comment; the first of a panel carries the "(in English)" mark in other languages. */
function PartItem({ part, markEnglish = false }: { part: CommentaryPart; markEnglish?: boolean }) {
  const i18n = useI18n();
  const t = useT('commentary');
  const englishLang = useEnglishLang();
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const paragraphs = splitParagraphs(part.text);
  const long = part.text.length > CLAMP_CHARS;
  return (
    <li className={styles.part}>
      <p className={styles.partRef}>
        {i18n.ref(part.ref, 'short')}
        {markEnglish && <InEnglishMark />}
      </p>
      <div id={bodyId} className={styles.partBody} data-clamped={long && !open ? 'true' : undefined} {...englishLang}>
        {paragraphs.map((p, i) => (
          <p key={i} className={styles.partText}>
            <ScriptText text={p} />
          </p>
        ))}
      </div>
      {long && (
        <button type="button" className={styles.readMore} aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
          {open ? t('part.showLess') : t('part.readMore')}
          <span className="visually-hidden">{t('part.readMoreHidden', { ref: i18n.ref(part.ref) })}</span>
        </button>
      )}
    </li>
  );
}

/** Concise study notes first (Tyndale), then classic commentaries in the provider's order. */
function orderCommentaries(list: CommentaryInfo[], testament: 'OT' | 'NT' | undefined): CommentaryInfo[] {
  const forBook = testament ? list.filter((c) => c.testaments.includes(testament)) : list;
  return [...forBook.filter((c) => c.style === 'notes'), ...forBook.filter((c) => c.style !== 'notes')];
}

function safeList(get: () => CommentaryInfo[]): CommentaryInfo[] {
  try {
    return get();
  } catch {
    return [];
  }
}
