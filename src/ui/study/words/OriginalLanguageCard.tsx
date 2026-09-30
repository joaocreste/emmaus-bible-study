import { BookOpen, MessageSquareText } from 'lucide-react';
import { useId } from 'react';
import type { KeyWord } from '../../../domain/models';
import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { Button, CrossMark } from '../../primitives';
import { KeyWordDetails } from './KeyWordDetails';
import styles from './OriginalLanguageCard.module.css';

export interface OriginalLanguageCardProps {
  keyWord: KeyWord;
  /** strongly marked by the conversation (also marked in the passage) */
  highlighted?: boolean;
  /** changed by the latest question — pulse once + micro-label */
  updated?: boolean;
  pulseKey?: number;
  lexiconOpen: boolean;
  onLexiconOpenChange(open: boolean): void;
  onShowInPassage(): void;
  onAsk(): void;
  onMoreOccurrences(): void;
}

/** DOM id of a key word's card (scroll target). */
export function keyWordCardId(keyWordId: string): string {
  return `word-card-${keyWordId}`;
}

/** A key word in the original language, as a card in the Original languages grid. */
export function OriginalLanguageCard({
  keyWord,
  highlighted = false,
  updated = false,
  pulseKey,
  lexiconOpen,
  onLexiconOpenChange,
  onShowInPassage,
  onAsk,
  onMoreOccurrences,
}: OriginalLanguageCardProps) {
  const headingId = useId();
  const t = useT('words');
  return (
    <article
      id={keyWordCardId(keyWord.id)}
      className={cx(styles.card, highlighted && styles.highlighted, updated && styles.updated)}
      aria-labelledby={headingId}
    >
      {updated && <span key={pulseKey} className={styles.pulse} aria-hidden="true" />}
      {updated && (
        <p className={styles.updatedLabel}>
          <CrossMark variant="glyph" size={11} />
          {t('card.updated')}
        </p>
      )}
      <KeyWordDetails
        keyWord={keyWord}
        variant="card"
        headingId={headingId}
        lexiconOpen={lexiconOpen}
        onLexiconOpenChange={onLexiconOpenChange}
        onMoreOccurrences={onMoreOccurrences}
      />
      <footer className={styles.actions}>
        <Button variant="ghost" size="sm" icon={<BookOpen aria-hidden="true" />} onClick={onShowInPassage}>
          {t('card.showInPassage')}
        </Button>
        <Button variant="ghost" size="sm" icon={<MessageSquareText aria-hidden="true" />} onClick={onAsk}>
          {t('card.ask')}
        </Button>
      </footer>
    </article>
  );
}
