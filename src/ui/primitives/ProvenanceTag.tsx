import { BookOpen, Database, Feather, FileText, Landmark, Languages, Layers, PenLine, Quote, ScrollText } from 'lucide-react';
import type { ContentKind, Provenance } from '../../domain/models';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import styles from './ProvenanceTag.module.css';

const ICONS: Record<ContentKind, typeof BookOpen> = {
  scripture: BookOpen,
  'original-text': Languages,
  lexical: Languages,
  historical: Landmark,
  literary: Layers,
  commentary: ScrollText,
  quotation: Quote,
  summary: FileText,
  synthesis: Feather,
  dataset: Database,
};

export interface ProvenanceTagProps {
  /** pass a full provenance, or just a kind */
  provenance?: Provenance;
  kind?: ContentKind;
  /** show verification state after the label (e.g. "Quotation · Verified against source") */
  showVerification?: boolean;
  className?: string;
}

/** Tooltip for content composed live by the inference layer (English; the UI uses 'sources' → tag.generatedExplanation). */
export const GENERATED_EXPLANATION =
  'Generated — composed live for your question from the cited sources. Checked mechanically (every statement cites what it rests on, references exist, quotations match their source), but not reviewed by an editor. Follow the citations.';

/**
 * Quiet label that tells the reader what kind of content they are looking at
 * (spec §6). Icon + text, never colour alone. Full explanation in the title tooltip
 * and in the Sources section legend. Content composed live by the inference layer
 * (verification 'generated') always reads "Generated · not reviewed", in the
 * synthesis colour — whatever its kind, the reader should know no editor has seen it.
 */
export function ProvenanceTag({ provenance, kind, showVerification = false, className }: ProvenanceTagProps) {
  const t = useT('provenance');
  const ts = useT('sources');
  const k: ContentKind = provenance?.kind ?? kind ?? 'synthesis';
  const verification = provenance?.verification;
  const label = t(`kind.${k}.label`);
  if (verification === 'generated') {
    const explanation = ts('tag.generatedExplanation');
    const title = k === 'synthesis' ? explanation : ts('tag.generatedExplanationKind', { explanation, kind: label });
    return (
      <span className={cx(styles.tag, className)} data-kind={k} data-verification="generated" title={title}>
        <PenLine aria-hidden="true" className={styles.icon} />
        <span>{ts('tag.generated')}</span>
        <span className={styles.verification}>· {ts('tag.notReviewed')}</span>
      </span>
    );
  }
  const Icon = ICONS[k];
  const description = t(`kind.${k}.description`);
  const title = verification
    ? ts('tag.titleVerified', { label, description, verification: t(`verification.${verification}`) })
    : ts('tag.title', { label, description });
  return (
    <span className={cx(styles.tag, className)} data-kind={k} title={title}>
      <Icon aria-hidden="true" className={styles.icon} />
      <span>{label}</span>
      {showVerification && verification && verification !== 'editorial' && (
        <span className={cx(styles.verification, verification === 'unverified' && styles.unverified)}>
          · {t(`verification.${verification}`)}
        </span>
      )}
    </span>
  );
}
