/**
 * Groups a chapter's verses into reading blocks: section headings, psalm
 * superscriptions, prose paragraphs and poetry stanzas.
 */
import type { BookId, PassageChapter, Verse } from '../../../domain/models';

/**
 * Optional layout extras a ScriptureProvider may add on top of the domain contract
 * (read structurally, so the UI does not depend on a particular provider).
 */
export interface VerseLayoutExtras {
  /** indent level per poetry line: 0 = prose part of a mixed verse, 1 = first level, 2 = indented */
  poetryIndents?: number[];
}

export interface ChapterLayoutExtras {
  /** Psalm title / superscription printed before verse 1 ("A Psalm of David.") */
  superscription?: string;
}

/** A chapter's superscription, when the provider supplies one. */
export function chapterSuperscription(chapter: PassageChapter): string | undefined {
  return (chapter as PassageChapter & ChapterLayoutExtras).superscription?.trim() || undefined;
}

export type ScriptureBlock =
  | { type: 'heading'; key: string; text: string }
  | { type: 'superscription'; key: string; text: string }
  | { type: 'prose'; key: string; verses: Verse[] }
  | { type: 'poetry'; key: string; verses: Verse[] };

const SUPERSCRIPTION_RE =
  /^(?:(?:a|an)\s+(?:psalm|song|maskil|miktam|prayer|shiggaion)\b|(?:of|for|to)\s+(?:david|asaph|solomon|moses|heman|ethan|jeduthun|the\s+(?:choirmaster|director|chief|sons|music))\b|for\s+the\s+(?:choirmaster|director)|according\s+to\b|on\s+(?:the\s+)?(?:gittith|sheminith|lilies|alamoth|mahalath)\b|when\b)/i;

/** Heuristic: a psalm heading that is the ancient title ("A Psalm of David.") rather than a modern section heading. */
export function isPsalmSuperscription(book: BookId, verse: Verse, text: string): boolean {
  return book === 'PSA' && verse.ref.verse <= 2 && SUPERSCRIPTION_RE.test(text.trim());
}

function isPoetry(v: Verse): boolean {
  return Array.isArray(v.poetryLines) && v.poetryLines.length > 0;
}

/** Build reading blocks for consecutive verses of one chapter. */
export function buildBlocks(verses: readonly Verse[], book: BookId): ScriptureBlock[] {
  const blocks: ScriptureBlock[] = [];
  let current: Extract<ScriptureBlock, { type: 'prose' | 'poetry' }> | null = null;

  for (const v of verses) {
    const vk = `${v.ref.chapter}.${v.ref.verse}`;
    if (v.heading) {
      // Providers join several headings with a newline or " — " (see providers/local/formats.ts).
      const lines = v.heading
        .split(/\n| — /)
        .map((l) => l.trim())
        .filter(Boolean);
      lines.forEach((line, i) => {
        blocks.push({
          type: isPsalmSuperscription(book, v, line) ? 'superscription' : 'heading',
          key: `h-${vk}-${i}`,
          text: line,
        });
      });
      current = null;
    }
    const kind = isPoetry(v) ? 'poetry' : 'prose';
    // paragraphStart opens a new paragraph in prose and a new stanza in poetry
    const startsNew = !current || current.type !== kind || v.paragraphStart === true;
    if (startsNew || !current) {
      const block: Extract<ScriptureBlock, { type: 'prose' | 'poetry' }> = { type: kind, key: `${kind}-${vk}`, verses: [] };
      blocks.push(block);
      current = block;
    }
    current.verses.push(v);
  }
  return blocks;
}

export interface PoetryLine {
  text: string;
  /** 0 = flush, 1 = indented, 2 = doubly indented */
  indent: number;
}

/** Does this passage encode poetry indentation (provider indent levels, or leading tabs / spaces)? */
export function encodesIndentation(verses: readonly Verse[]): boolean {
  return verses.some(
    (v) => (v as Verse & VerseLayoutExtras).poetryIndents?.length || v.poetryLines?.some((l) => /^[\t ]/.test(l)),
  );
}

/**
 * Poetry lines with their indentation (0 = flush, 1 = indented, 2 = doubly indented).
 * Uses the provider's indent levels when present (level 1 → flush, 2 → indented), else
 * leading tabs / pairs of spaces. When the passage carries no indentation at all
 * (`encoded` false), a verse's first line is flush and its continuation lines are
 * indented — the common layout for Hebrew parallelism.
 */
export function poetryLayout(
  lines: readonly string[],
  encoded = lines.some((l) => /^[\t ]/.test(l)),
  indents?: readonly number[],
): PoetryLine[] {
  if (indents && indents.length === lines.length) {
    return lines.map((l, i) => ({ text: l.trim(), indent: Math.min(2, Math.max(0, indents[i] - 1)) }));
  }
  if (!encoded) return lines.map((l, i) => ({ text: l.trim(), indent: i === 0 ? 0 : 1 }));
  return lines.map((raw) => {
    const lead = /^[\t ]*/.exec(raw)?.[0] ?? '';
    const tabs = (lead.match(/\t/g) ?? []).length;
    const spaces = lead.replace(/\t/g, '').length;
    return { text: raw.trim(), indent: Math.min(2, tabs + Math.floor(spaces / 2)) };
  });
}

/** Poetry layout for one verse, honouring provider indent levels when present. */
export function versePoetryLayout(v: Verse, encoded: boolean): PoetryLine[] {
  return poetryLayout(v.poetryLines ?? [v.text], encoded, (v as Verse & VerseLayoutExtras).poetryIndents);
}

/** Plain text of a verse (poetry lines joined with spaces). */
export function verseText(v: Verse): string {
  return isPoetry(v) ? v.poetryLines!.map((l) => l.trim()).join(' ') : v.text;
}
