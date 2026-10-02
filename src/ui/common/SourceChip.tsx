import { ArrowUpRight } from 'lucide-react';
import type { Citation, Provenance } from '../../domain/models';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { useProviders } from '../../providers/ProvidersContext';
import { useSessionActions } from '../../state/session';
import { ProvenanceTag } from '../primitives';
import { citationAuthorName, localizeAuthor } from './attribution';
import { localizeLocator, readerLocator } from './locator';
import { ScriptText } from './ScriptText';
import styles from './SourceChip.module.css';

/** Longest excerpt shown in a chip's tooltip (the Inspector shows it in full). */
const TOOLTIP_EXCERPT = 280;

/**
 * Short, clickable citation. Opens the source in the Inspector — with the retrieved
 * text the statement rests on (`citation.excerpt`, generated studies), shown there as
 * "Cited passage" and previewed in the tooltip.
 */
export function SourceChip({ citation }: { citation: Citation }) {
  const { sources } = useProviders();
  const { openInspector } = useSessionActions();
  const { locale } = useI18n();
  const t = useT('sources');
  const source = sources.getSource(citation.sourceId);
  const author = source?.authorIds[0] ? localizeAuthor(sources.getAuthor(source.authorIds[0]), locale) : undefined;
  const title = source ? source.title : t('chip.unknownSource', { id: citation.sourceId });
  const who = author && source?.type !== 'bible-translation' ? `${citationAuthorName(author)}, ` : '';
  const label = `${who}${shorten(title)}`;
  // in the reader's terms: a lexicon entry by its word rather than its Strong's number, references and structural words in their language
  const raw = readerLocator(citation.locator, citation.note);
  const locator = raw ? localizeLocator(raw, locale, t) : undefined;
  // The chip truncates visually; its accessible name keeps the whole citation (it starts with the visible label).
  const full = `${who}${title}${locator ? `, ${locator}` : ''}`;
  const excerpt = citation.excerpt?.trim() || undefined;
  return (
    <button
      type="button"
      className={styles.chip}
      data-missing={source ? undefined : 'true'}
      onClick={() =>
        openInspector({
          type: 'source',
          sourceId: citation.sourceId,
          ...(excerpt ? { excerpt } : {}),
          ...(excerpt && locator ? { locator } : {}),
        })
      }
      aria-label={full}
      title={[[author?.name, title, locator].filter(Boolean).join(' · '), excerpt ? t('chip.citedText', { excerpt: clip(excerpt, TOOLTIP_EXCERPT) }) : ''].filter(Boolean).join('\n')}
      data-excerpt={excerpt ? 'true' : undefined}
    >
      <span className={styles.label}>{label}</span>
      {locator && (
        <span className={styles.locator}>
          <ScriptText text={locator} />
        </span>
      )}
      <ArrowUpRight aria-hidden="true" className={styles.icon} />
    </button>
  );
}

/** Row of citations; dedupes identical source+locator pairs (the first excerpt is kept). Default label: "Sources" (localized). */
export function CitationList({ citations, label }: { citations: Citation[]; label?: string }) {
  const t = useT('sources');
  const seen = new Set<string>();
  const unique = citations.filter((c) => {
    const k = citationKey(c);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (unique.length === 0) return null;
  return (
    <div className={styles.list}>
      <span className={styles.listLabel}>{label ?? t('chip.sources')}</span>
      {unique.map((c) => (
        <SourceChip key={citationKey(c)} citation={c} />
      ))}
    </div>
  );
}

function citationKey(c: Citation): string {
  return `${c.sourceId}|${c.locator ?? ''}`;
}

/** ProvenanceTag + citations on one quiet line — the standard footer of a content block. */
export function ProvenanceLine({ provenance, showVerification = true }: { provenance: Provenance; showVerification?: boolean }) {
  return (
    <div className={styles.provenanceLine}>
      <ProvenanceTag provenance={provenance} showVerification={showVerification} />
      <CitationList citations={provenance.citations} label="" />
    </div>
  );
}

function clip(t: string, max: number): string {
  const flat = t.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

function shorten(t: string, max = 38): string {
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}
