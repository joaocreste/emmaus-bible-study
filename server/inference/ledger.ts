/**
 * Evidence ledger — the per-request numbered list of everything the knowledge base
 * returned (E1…En). Identical items are stored once. The model reads items as compact
 * text blocks; the full text is kept for quotation checks and citation excerpts.
 */
import type { Evidence, EvidenceDraft, EvidenceKind } from '../../src/inference/protocol';
import { clip } from './text';

export const KIND_LABEL: Record<EvidenceKind, string> = {
  scripture: 'Scripture',
  'original-text': 'original text',
  lexicon: 'lexicon',
  occurrences: 'concordance',
  'cross-references': 'cross-references',
  'study-note': 'study note',
  'book-introduction': 'book introduction',
  commentary: 'commentary',
  'topical-index': 'topical index',
  dictionary: 'dictionary',
  confession: 'confession',
  curated: 'Emmaus curated',
};

export interface LedgerEntry {
  evidence: Evidence;
  /** false when an identical item was already in the ledger */
  isNew: boolean;
}

/** "E3", "e3", "[E3]", " E3 " → "E3"; anything else → null. */
export function normalizeEvidenceId(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const m = /^\[?\s*E\s*0*(\d{1,4})\s*\]?$/i.exec(raw.trim());
  return m ? `E${Number(m[1])}` : null;
}

function dedupeKey(d: EvidenceDraft): string {
  return [d.kind, d.sourceId, d.locator ?? '', d.title, d.strong ?? '', d.text].join('␟');
}

export interface LedgerOptions {
  /**
   * The complete retrieved text behind an item the knowledge base excerpted
   * (server/kb `evidenceFullText`); quotations may be any exact span of it.
   * Default: the item's own text.
   */
  fullText?: (draft: EvidenceDraft) => string;
  /** the author's display name for an item (registry lookup), shown in its header so the model knows who wrote it */
  authorName?: (e: Evidence) => string | undefined;
}

export class EvidenceLedger {
  private readonly items: Evidence[] = [];
  private readonly byKey = new Map<string, Evidence>();
  private readonly byId = new Map<string, Evidence>();
  private readonly full = new Map<string, string>();
  /** ids whose text the model has been shown in full (or clipped) at least once */
  private readonly shown = new Set<string>();
  /** ids listed with "text not shown" (result too long) and not shown since: the model has not read them */
  private readonly withheld = new Set<string>();

  /** church-tradition families searched on their own (search_knowledge with `tradition`) in this request */
  readonly searchedTraditions = new Set<string>();

  constructor(private readonly options: LedgerOptions = {}) {}

  get size(): number {
    return this.items.length;
  }

  add(draft: EvidenceDraft): LedgerEntry {
    const key = dedupeKey(draft);
    const existing = this.byKey.get(key);
    if (existing) return { evidence: existing, isNew: false };
    const evidence: Evidence = { ...draft, id: `E${this.items.length + 1}` };
    this.items.push(evidence);
    this.byKey.set(key, evidence);
    this.byId.set(evidence.id, evidence);
    let full = draft.text;
    try {
      full = this.options.fullText?.(draft) || draft.text;
    } catch {
      /* the item's own text */
    }
    if (full !== draft.text) this.full.set(evidence.id, full);
    return { evidence, isNew: true };
  }

  /** Complete retrieved text of an item (≥ what the model was shown): the basis for quotation checks. */
  fullText(e: Evidence): string {
    return this.full.get(e.id) ?? e.text;
  }

  addAll(drafts: readonly EvidenceDraft[]): LedgerEntry[] {
    return drafts.map((d) => this.add(d));
  }

  get(id: string): Evidence | undefined {
    const n = normalizeEvidenceId(id);
    return n ? this.byId.get(n) : undefined;
  }

  all(): Evidence[] {
    return [...this.items];
  }

  markShown(id: string): void {
    this.shown.add(id);
  }

  wasShown(id: string): boolean {
    return this.shown.has(id);
  }

  /** Was this item listed without its text (and never shown since)? Such items cannot be cited until read. */
  isWithheld(id: string): boolean {
    return this.withheld.has(id);
  }

  /** A research tool result: items not yet shown in full, repeats as one-line pointers. */
  render(entries: readonly LedgerEntry[], budgetChars = 28000): string {
    if (entries.length === 0) return '';
    const ids = entries.map((e) => e.evidence.id);
    const repeats = entries.filter((e) => this.shown.has(e.evidence.id)).length;
    const lines: string[] = [
      `${entries.length} item${entries.length === 1 ? '' : 's'} (${ids.join(', ')})${repeats ? ` — ${repeats} already shown earlier` : ''}:`,
    ];
    let used = lines[0].length;
    for (const { evidence } of entries) {
      if (this.shown.has(evidence.id)) {
        lines.push(`[${evidence.id}] ${evidence.title} — already shown above`);
        continue;
      }
      const remaining = budgetChars - used;
      if (remaining <= 600) {
        this.withheld.add(evidence.id);
        lines.push(`[${evidence.id}] ${evidence.title} — text not shown (this result was too long); it cannot be cited until you read it — request it again on its own`);
        continue;
      }
      const block = renderEvidence(evidence, Math.min(3500, remaining - 300), this.options.authorName?.(evidence));
      this.shown.add(evidence.id);
      this.withheld.delete(evidence.id);
      lines.push(block);
      used += block.length;
    }
    return lines.join('\n\n');
  }
}

/** One evidence item as the model reads it: "[E3] Title (kind · source · locator · by Author · Reformed) — flags". */
export function renderEvidence(e: Evidence, maxChars = 3500, author?: string): string {
  const meta = [KIND_LABEL[e.kind], e.sourceId, e.locator, author ? `by ${author}` : '', e.tradition && !e.title.includes(e.tradition) ? e.tradition : ''].filter(Boolean).join(' · ');
  const flags = [e.strong ? `Strong’s ${e.strong}` : '', e.quotable ? '' : 'summary only — do not quote'].filter(Boolean).join('; ');
  const header = `[${e.id}] ${e.title} (${meta})${flags ? ` — ${flags}` : ''}`;
  return `${header}\n${clip(e.text.trim(), maxChars)}`;
}
