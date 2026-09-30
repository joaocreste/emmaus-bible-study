import type { OriginalLanguage } from '../../../domain/models';
import { cx } from '../../../lib/cx';
import { displayOriginal, isRtl, langTag } from './language';
import styles from './OriginalScript.module.css';

interface OriginalScriptProps {
  text: string;
  language: OriginalLanguage;
  /** xl = key-word hero (Greek 30px / Hebrew 32px), lg = inspector lemma, md = inline */
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

/** Greek, Hebrew or Aramaic text with the right font, `lang` and direction (cantillation stripped for Hebrew). */
export function OriginalScript({ text, language, size = 'md', className }: OriginalScriptProps) {
  return (
    <span lang={langTag(language)} dir={isRtl(language) ? 'rtl' : 'ltr'} className={cx(styles.script, styles[language], styles[size], className)}>
      {displayOriginal(text, language)}
    </span>
  );
}
