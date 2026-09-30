import type { ReactNode } from 'react';
import type { ProvenancedText } from '../../../domain/models';
import { cx } from '../../../lib/cx';
import { renderWithScripts } from '../../common/ScriptText';
import { ProvenanceLine } from '../../common/SourceChip';
import styles from './SynthesisBlock.module.css';

interface SynthesisBlockProps {
  content: ProvenancedText;
  /** optional small heading rendered above the text */
  heading?: ReactNode;
  headingLevel?: 3 | 4;
  /** larger reading size for orientation paragraphs */
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * A provenanced paragraph (synthesis, literary or historical observation):
 * a quiet left rule in the colour of its content kind, the text in `.t-synthesis`,
 * and the standard provenance footer. Summaries are never quoted.
 */
export function SynthesisBlock({ content, heading, headingLevel = 3, size = 'md', className }: SynthesisBlockProps) {
  const H = headingLevel === 3 ? 'h3' : 'h4';
  return (
    <div
      className={cx(styles.block, styles[size], className)}
      data-kind={content.provenance.kind}
      data-verification={content.provenance.verification === 'generated' ? 'generated' : undefined}
    >
      {heading && <H className={styles.heading}>{heading}</H>}
      <Paragraphs text={content.text} className={cx('t-synthesis', styles.text)} />
      <ProvenanceLine provenance={content.provenance} />
    </div>
  );
}

/** Splits plain text on blank lines into paragraphs (Greek and Hebrew words tagged with their language). */
export function Paragraphs({ text, className }: { text: string; className?: string }) {
  const parts = splitParagraphs(text);
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className={className}>
          {renderWithScripts(p)}
        </p>
      ))}
    </>
  );
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}
