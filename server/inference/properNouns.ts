/**
 * Biblical proper nouns in generated prose (validator helper).
 *
 * The registry-name check (grounding.ts) covers authors and the historic people and
 * works a model cites from memory; biblical names are exempt there because they are
 * everywhere in the evidence. That left a gap: "Cornelius’s household", "Malachi
 * charges Judah", "the Philippian jailer", "the Sermon on the Mount" — true, but
 * recalled, not read. This module closes it mechanically:
 *
 *  - the candidates are the proper nouns of the BSB itself: words the translation
 *    writes capitalised mid-sentence and never in lower case (people, places,
 *    peoples, feasts) — so everyday words, divine pronouns ("He", "You") and titles
 *    that are also common nouns ("Father", "Law", "Word") are never candidates;
 *  - plus a short list of conventional labels for passages and events that the
 *    Bible text does not use ("Sermon on the Mount", "Great Commission");
 *  - a candidate in the prose must occur in the item's cited evidence, in Scripture
 *    read in this request, in the BSB text of the verses its cited evidence gives, or
 *    in the page passage — otherwise the item is sent back for repair.
 *
 * Broad group names (Jews, Gentiles, Israel …) and the traditional author of a cited
 * book ("Paul" on a Colossians text) are not treated as claims.
 */
import { BOOKS } from '../../src/domain/books';
import type { BookId, PassageRef } from '../../src/domain/models';
import type { ScriptureProvider } from '../../src/providers/types';

/** Words that are proper nouns in the BSB but name broad groups or the divine persons — not claims needing a source. */
const EXEMPT = new Set(
  [
    'God', 'Jesus', 'Christ', 'Messiah', 'Israel', 'Israelite', 'Israelites', 'Jew', 'Jews', 'Jewish', 'Gentile', 'Gentiles', 'Hebrew',
    'Hebrews', 'Greek', 'Greeks', 'Aramaic', 'Roman', 'Romans', 'Christian', 'Christians', 'Amen', 'Hallelujah', 'Selah', 'Yahweh',
    'Abba', 'Immanuel', 'Emmanuel', 'Lord', 'LORD', 'Creator', 'Almighty', 'Savior', 'Saviour', 'Redeemer',
    // words the BSB always capitalises that are titles or ordinary nouns in prose, and tradition words (checked elsewhere)
    'Scripture', 'Scriptures', 'Treatise', 'Protector', 'Repairer', 'Restorer', 'Revealer', 'Originator', 'Lowborn', 'Unsandaled',
    'Deity', 'Excellency', 'Emperor', 'Imperial', 'Northeaster', 'Forum', 'Admin', 'Latin', 'Judaism', 'Baptist', 'Baptists', 'Rabbi',
    'Alpha', 'Omega', 'Dispersion', 'Wadi',
  ],
);

/**
 * Conventional names for passages, events and periods that the Bible text itself does not
 * use: stating one is a claim about the text (where it sits, what it is called), so the
 * evidence must use it too. Matched case-insensitively as whole phrases.
 */
const CONVENTIONAL_LABELS = [
  'Sermon on the Mount', 'Sermon on the Plain', 'Olivet Discourse', 'Upper Room Discourse', 'Farewell Discourse', 'Great Commission',
  'Golden Rule', 'Beatitudes', 'Lord’s Prayer', "Lord's Prayer", 'Jerusalem Council', 'Council of Jerusalem', 'Triumphal Entry',
  'Holy Week', 'Passion Week', 'Second Temple', 'Babylonian captivity', 'Dead Sea Scrolls', 'Masoretic', 'Pastoral Epistles',
  'Prison Epistles', 'Household Code', 'Suffering Servant', 'Servant Songs', 'Fall of Jerusalem',
];

const LABEL_RES = CONVENTIONAL_LABELS.map((l) => ({ label: l, re: new RegExp(`(?<![\\p{L}])${l.replace(/[’']/g, "[’']").replace(/\s+/g, '\\s+')}(?![\\p{L}])`, 'iu') }));

const cache = new WeakMap<ScriptureProvider, Promise<ReadonlySet<string>>>();

/**
 * The BSB's proper nouns: capitalised mid-sentence (after a lower-case word) somewhere,
 * never written in lower case anywhere. Built once per scripture provider (66 books).
 */
export function biblicalProperNouns(scripture: ScriptureProvider): Promise<ReadonlySet<string>> {
  let p = cache.get(scripture);
  if (!p) {
    p = (async () => {
      const capitalised = new Set<string>();
      const lower = new Set<string>();
      for (const book of BOOKS) {
        let text: string;
        try {
          const passage = await scripture.getPassage({ book: book.id, startChapter: 1, endChapter: book.chapters }, 'BSB');
          text = passage.chapters.flatMap((c) => c.verses.map((v) => v.text)).join('\n');
        } catch {
          continue;
        }
        for (const m of text.matchAll(/[\p{L}’'-]+/gu)) {
          const w = m[0].replace(/[’']s$/u, '').replace(/^[’'-]+|[’'-]+$/gu, '');
          if (!w) continue;
          if (/^\p{Ll}/u.test(w)) lower.add(w.toLowerCase());
        }
        // mid-sentence capitals: after a lower-case letter, comma or semicolon and a space
        for (const m of text.matchAll(/(?<=[\p{Ll},;]\s)(\p{Lu}\p{Ll}+(?:-\p{Lu}?\p{Ll}+)*)/gu)) capitalised.add(m[1].replace(/[’']s$/u, ''));
      }
      const out = new Set<string>();
      for (const w of capitalised) if (!lower.has(w.toLowerCase()) && !EXEMPT.has(w) && w.length > 2) out.add(w);
      return out;
    })();
    cache.set(scripture, p);
  }
  return p;
}

/** A traditional author or book name that a cited book makes unremarkable ("Paul" on Colossians, "Malachi" on Malachi). */
function bookNames(books: ReadonlySet<BookId>): Set<string> {
  const out = new Set<string>();
  for (const b of BOOKS) {
    if (!books.has(b.id)) continue;
    for (const w of `${b.name} ${b.traditionalAuthor}`.split(/[^\p{L}]+/u)) if (w) out.add(w);
  }
  return out;
}

/** The place a letter's name comes from ("Corinthians" → "Corinth…", "Romans" → "Rom…", "Philippians" → "Philipp…"). */
function letterPlaces(books: ReadonlySet<BookId>): string[] {
  const out: string[] = [];
  for (const b of BOOKS) {
    if (!books.has(b.id) || b.genre !== 'letter') continue;
    const w = b.name.split(/\s+/).pop() ?? '';
    const m = /^(\p{Lu}\p{Ll}{2,}?)(?:ians|ans)$/u.exec(w);
    if (m) out.push(m[1]);
  }
  return out;
}

function wordRe(word: string): RegExp {
  return new RegExp(`(?<![\\p{L}])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'u');
}

/** A gentilic is grounded by its place name ("Philippian" by "Philippi", "Ethiopian" by "Ethiopia"): a shared stem of ≥ 5 letters. */
function gentilicStem(word: string): string | null {
  const m = /^(\p{Lu}\p{Ll}{3,}?)(?:ians?|ites?|ans?|ines?|enes?|ese)$/u.exec(word);
  return m && m[1].length >= 5 ? m[1] : null;
}

export interface ProperNounContext {
  /** texts that may name people and places: cited evidence (with metadata), Scripture read in this request, the page passage, the reader's words */
  texts: readonly string[];
  /** books of the Scripture the item rests on (their names and traditional authors are not claims) */
  books: ReadonlySet<BookId>;
}

/**
 * Biblical proper nouns and conventional labels in `text` that none of the grounding
 * texts contains. Returns them as written (first occurrence).
 */
export async function ungroundedProperNouns(text: string, scripture: ScriptureProvider, ctx: ProperNounContext): Promise<string[]> {
  const nouns = await biblicalProperNouns(scripture);
  const hay = ctx.texts.join('\n');
  const out: string[] = [];
  for (const { label, re } of LABEL_RES) {
    if (re.test(text) && !re.test(hay)) out.push(label);
  }
  const exempt = bookNames(ctx.books);
  const places = letterPlaces(ctx.books);
  const seen = new Set<string>();
  for (const m of text.matchAll(/(?<![\p{L}])(\p{Lu}\p{Ll}+(?:-\p{Lu}?\p{Ll}+)*)(?:[’']s)?(?![\p{L}])/gu)) {
    const w = m[1];
    if (seen.has(w)) continue;
    seen.add(w);
    if (!nouns.has(w) || exempt.has(w) || places.some((p) => w.startsWith(p))) continue;
    if (wordRe(w).test(hay)) continue;
    const g = gentilicStem(w);
    if (g && new RegExp(`(?<![\\p{L}])${g}`, 'u').test(hay)) continue;
    out.push(w);
  }
  return out;
}

/** Books of a list of references. */
export function booksOf(refs: readonly PassageRef[]): Set<BookId> {
  return new Set(refs.map((r) => r.book));
}
