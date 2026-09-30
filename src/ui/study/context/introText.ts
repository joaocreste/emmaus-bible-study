/**
 * Parsing of book-introduction plain text (Tyndale Open Study Notes via the
 * HistoricalContextProvider) into headings and paragraphs for display.
 * The provider returns plain text with blank-line paragraph breaks; short
 * title-like lines ("Setting", "Summary", "Date and Occasion") become headings.
 */

export type IntroBlock = { type: 'heading'; text: string } | { type: 'paragraph'; text: string };

const MAX_HEADING_CHARS = 64;
const MAX_HEADING_WORDS = 9;

/** Is this single line a section heading rather than prose? */
export function looksLikeHeading(line: string): boolean {
  const t = line.trim();
  if (!t || t.length > MAX_HEADING_CHARS) return false;
  if (/^#{1,6}\s+\S/.test(t) || /^\*\*[^*]+\*\*$/.test(t)) return true;
  if (/^[a-z0-9“"‘'(]/.test(t)) return false;
  // sentence punctuation at the end means prose (a short question may still be a heading)
  if (/[.,;:!…”’")\]]$/.test(t)) return false;
  if (t.endsWith('?') && t.length > 40) return false;
  return t.split(/\s+/).length <= MAX_HEADING_WORDS;
}

function cleanHeading(line: string): string {
  return line
    .trim()
    .replace(/^#{1,6}\s+/, '')
    .replace(/^\*\*(.+)\*\*$/, '$1')
    .trim();
}

/** Split introduction text into heading/paragraph blocks. */
export function parseIntroduction(text: string): IntroBlock[] {
  const blocks: IntroBlock[] = [];
  const paragraphs = text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  for (const p of paragraphs) {
    const lines = p
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    // A heading line glued to its first paragraph ("Setting\nPaul wrote…")
    if (lines.length > 1 && looksLikeHeading(lines[0])) {
      blocks.push({ type: 'heading', text: cleanHeading(lines[0]) });
      blocks.push({ type: 'paragraph', text: lines.slice(1).join(' ') });
      continue;
    }
    if (lines.length === 1 && looksLikeHeading(lines[0])) {
      blocks.push({ type: 'heading', text: cleanHeading(lines[0]) });
      continue;
    }
    blocks.push({ type: 'paragraph', text: lines.join(' ') });
  }
  return blocks;
}

/**
 * Split blocks into the always-visible lead (everything up to and including the
 * first paragraph) and the remainder shown on expand.
 */
export function splitIntroLead(blocks: IntroBlock[]): { lead: IntroBlock[]; rest: IntroBlock[] } {
  const first = blocks.findIndex((b) => b.type === 'paragraph');
  if (first < 0) return { lead: blocks, rest: [] };
  return { lead: blocks.slice(0, first + 1), rest: blocks.slice(first + 1) };
}
