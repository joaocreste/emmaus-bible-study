import type { ReactNode } from 'react';
import type { LexiconEntry } from '../../../domain/models';
import { useT } from '../../../i18n/I18nProvider';
import { RetryButton } from '../../common/RetryButton';
import { ScriptText } from '../../common/ScriptText';
import { SourceChip } from '../../common/SourceChip';
import { useLexiconEntry } from '../../hooks/data';
import { CrossLoader, ProvenanceTag } from '../../primitives';
import { InEnglish, useEnglishLang } from './InEnglish';
import { plainDefinition } from './language';
import styles from './LexiconEntryView.module.css';

interface LexiconEntryViewProps {
  strong: string;
  /** render the fetched entry's lemma/gloss block (the Inspector's strong-only view does this itself) */
  children?: (entry: LexiconEntry) => ReactNode;
}

/**
 * The lexicon's own definition for a Strong's number (STEPBible TBESG/TBESH), shown
 * as source text with its provenance — never paraphrased (nor translated: outside English
 * it is marked "(em inglês)" and carries lang="en").
 */
export function LexiconEntryView({ strong, children }: LexiconEntryViewProps) {
  const state = useLexiconEntry(strong);
  const t = useT('words');
  const lang = useEnglishLang();

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <p className={styles.muted}>
        <CrossLoader size={16} label={t('lex.loading')} />
        <span aria-hidden="true">{t('lex.loading')}…</span>
      </p>
    );
  }
  if (state.status === 'error') {
    return (
      <p className={styles.muted}>
        {t('lex.error')} <RetryButton onRetry={state.retry} />
      </p>
    );
  }
  if (!state.data) return <p className={styles.muted}>{t('lex.notFound', { strong })}</p>;

  const entry = state.data;
  const paragraphs = plainDefinition(entry.definition);

  return (
    <div className={styles.entry}>
      {children?.(entry)}
      <div className={styles.definition}>
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <p key={i} lang={lang}>
              <ScriptText text={p} />
            </p>
          ))
        ) : (
          <p className={styles.muted}>{t('lex.glossOnly', { gloss: entry.gloss })}</p>
        )}
      </div>
      <div className={styles.provenance}>
        <ProvenanceTag kind="lexical" />
        <SourceChip citation={{ sourceId: entry.sourceId, locator: entry.strong }} />
        <InEnglish />
      </div>
    </div>
  );
}
