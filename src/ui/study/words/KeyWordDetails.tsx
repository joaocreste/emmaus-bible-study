import { Info } from 'lucide-react';
import type { KeyWord } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { RefChip } from '../../common/RefChip';
import { ScriptText } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import { Badge, Disclosure } from '../../primitives';
import { InEnglish, useEnglishLang } from './InEnglish';
import { languageName } from './language';
import { LexiconEntryView } from './LexiconEntryView';
import { Occurrences } from './Occurrences';
import { OriginalScript } from './OriginalScript';
import styles from './KeyWordDetails.module.css';

export interface KeyWordDetailsProps {
  keyWord: KeyWord;
  /** 'card' inside the Original languages grid; 'panel' inside the Inspector */
  variant?: 'card' | 'panel';
  /** id for the lemma heading (labels the surrounding card/dialog) */
  headingId?: string;
  lexiconOpen: boolean;
  onLexiconOpenChange(open: boolean): void;
  occurrenceLimit?: number;
  onMoreOccurrences?(): void;
}

/**
 * Everything curated about one key word — lemma, pronunciation, meaning, range,
 * grammar, occurrences, why it matters here, caution — plus the lexicon's own entry.
 * Presentational: expansion state lives with the caller.
 */
export function KeyWordDetails({
  keyWord: kw,
  variant = 'card',
  headingId,
  lexiconOpen,
  onLexiconOpenChange,
  occurrenceLimit = 8,
  onMoreOccurrences,
}: KeyWordDetailsProps) {
  const Heading = variant === 'card' ? 'h3' : 'p';
  const t = useT('words');
  const { locale } = useI18n();
  const englishLang = useEnglishLang();
  return (
    <div className={cx(styles.details, styles[variant])}>
      <div className={styles.hero}>
        <div className={styles.heroTop}>
          <span className={styles.language}>{languageName(kw.language, locale)}</span>
          <Badge tone="outline" title={t('details.strongTitle')}>
            <span className="visually-hidden">{t('details.strong')} </span>
            {kw.strong}
          </Badge>
        </div>
        <Heading id={headingId} className={styles.lemma}>
          <OriginalScript text={kw.lemma} language={kw.language} size="xl" />
          <span className="visually-hidden"> — {kw.english}</span>
        </Heading>
        <p className={styles.sound}>
          <span className="t-translit">{kw.transliteration}</span>
          {kw.pronunciation && (
            <span className={styles.pronunciation}>
              <span className="visually-hidden">{t('details.pronounced')} </span>
              <span lang={englishLang}>{kw.pronunciation}</span>
              {/* the respelling follows English spelling ("kree", "noh"): said so outside English */}
              {englishLang && <span> ({t('details.englishRespelling')})</span>}
            </span>
          )}
        </p>
        <p className={styles.english}>
          <span className={styles.englishLabel}>{t('details.translated')}</span>{' '}
          <span className={styles.englishWord}>{t('details.quoted', { word: kw.english })}</span>
        </p>
      </div>

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>{t('details.basicMeaning')}</dt>
          <dd>
            <ScriptText text={kw.basicMeaning} />
          </dd>
        </div>
        {kw.grammar && (
          <div className={styles.fact}>
            <dt>{t('details.grammar')}</dt>
            <dd>
              <ScriptText text={kw.grammar} />
            </dd>
          </div>
        )}
      </dl>

      {kw.semanticRange.length > 0 && (
        <div className={styles.block}>
          <p className={styles.eyebrow}>{t('details.range')}</p>
          {/* Short glosses read well as pills; explained senses read better as a list. */}
          <ul className={kw.semanticRange.some((s) => s.length > 32) ? styles.rangeList : styles.range}>
            {kw.semanticRange.map((sense) => (
              <li key={sense}>
                <ScriptText text={sense} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.block}>
        <p className={styles.eyebrow}>{t('details.occurrences')}</p>
        <Occurrences strong={kw.strong} language={kw.language} limit={occurrenceLimit} onMore={onMoreOccurrences} />
      </div>

      {kw.notableOccurrences.length > 0 && (
        <div className={styles.block}>
          <p className={styles.eyebrow}>{t('details.notable')}</p>
          <ul className={styles.notable}>
            {kw.notableOccurrences.map((o, i) => (
              <li key={i}>
                <RefChip passage={o.ref} />
                <span className={styles.note}>
                  <ScriptText text={o.note} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={cx(styles.block, styles.significance)}>
        <p className={styles.eyebrow}>{t('details.why')}</p>
        <p className="t-synthesis">
          <ScriptText text={kw.significance.text} />
        </p>
        <ProvenanceLine provenance={kw.significance.provenance} />
      </div>

      {kw.caution && (
        <p className={styles.caution}>
          <Info aria-hidden="true" />
          <span>
            <strong>{t('details.caution')} </strong>
            <ScriptText text={kw.caution} />
          </span>
        </p>
      )}

      <Disclosure
        className={styles.lexicon}
        open={lexiconOpen}
        onOpenChange={onLexiconOpenChange}
        summary={
          <span className={styles.lexiconSummary}>
            <span className={styles.lexiconTitle}>{t('details.lexicon')}</span>
            <span className={styles.lexiconMeta}>
              {t('details.lexiconMeta', { strong: kw.strong })} <InEnglish />
            </span>
          </span>
        }
      >
        {lexiconOpen && <LexiconEntryView strong={kw.strong} />}
      </Disclosure>

      <div className={styles.footer}>
        <ProvenanceLine provenance={kw.provenance} />
      </div>
    </div>
  );
}
