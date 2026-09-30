/**
 * Nave’s Topical Bible (1896) and Torrey’s New Topical Textbook (1897) → kb/corpus/{naves,torrey}.json.
 *
 * Source: the NEUU bible-topics-dataset (CC BY 4.0), which ships the CCEL ThML
 * editions of both works (data/00_raw/xml). We parse that XML rather than the
 * dataset's per-topic JSON because the JSON layer loses information: aspect
 * labels are cut at the first inline reference ("Disobedience of the wife… in
 * the Persian empire" becomes "Di"), sub-headings are flattened, and "See X"
 * cross-links become junk labels ("SeeMARRIAGE"). The XML keeps every aspect
 * (<p class="indexN">), its label, its references (osisRef) and its links.
 *
 *  - one document per topic; aspects = labelled groups of refKey strings
 *  - "See X" lines → keywords (see-also); topics that are ONLY a redirect
 *    ("WEALTH — See RICHES") become aliases (keywords) of their target
 *  - references validated against the BSB versification; apocrypha dropped
 */
import type { PassageRef } from '../../src/domain/models.ts';
import { formatRef, refKey } from '../../src/domain/reference.ts';
import type { CorpusFile, KbDocument } from '../../server/kb/corpus.ts';
import { log, mergeAdjacent, sentenceCase, slugify, validateRef, type RefStats } from './lib/io.ts';
import { attr, inlineText, osisToRef } from './lib/thml.ts';

interface RawAspect {
  level: number;
  label: string;
  refs: PassageRef[];
  see: string[];
}

interface RawTopic {
  term: string;
  letter: string;
  aspects: RawAspect[];
}

export interface TopicBuildStats {
  terms: number;
  documents: number;
  redirects: number;
  unresolvedRedirects: number;
  emptyTopics: number;
  aspects: number;
  headerAspects: number;
  /** connector-only fragments ("And", "By") merged into the preceding group */
  connectorAspects: number;
  refs: RefStats;
}

const SCRIPREF = /<scripRef\b([^>]*)>([\s\S]*?)<\/scripRef>/g;

/** Single-chapter books where CCEL writes "2Jo 1:7-9" as <scripRef>2Jo 1</scripRef>:7-9. */
const SINGLE_CHAPTER = new Set(['OBA', 'PHM', '2JN', '3JN', 'JUD']);

function parseParagraph(inner: string, stats: RefStats): { labelHtml: string; refs: PassageRef[]; anchors: string[] } {
  const refs: PassageRef[] = [];
  let labelHtml = inner;
  const first = inner.search(/<scripRef\b/);
  if (first >= 0) labelHtml = inner.slice(0, first);
  SCRIPREF.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = SCRIPREF.exec(inner))) {
    const osis = attr(m[1], 'osisRef') ?? '';
    let ref = osisToRef(osis);
    if (!ref) {
      if (/^Bible:(Wis|PrAzar|Sir|Tob|Jdt|Bar|[1-4]Macc|[12]Esd|Sus|Bel|PrMan|AddEsth)\b/.test(osis)) stats.apocrypha++;
      else stats.malformed++;
      continue;
    }
    // CCEL quirk: "<scripRef>2Jo 1</scripRef>:7-9" — the verses follow the tag.
    const tail = /^:(\d+)(?:-(\d+))?/.exec(inner.slice(SCRIPREF.lastIndex));
    if (tail && SINGLE_CHAPTER.has(ref.book) && /\s1\s*$/.test(inlineText(m[2]))) {
      const v1 = Number(tail[1]);
      ref = { book: ref.book, startChapter: 1, startVerse: v1, endChapter: 1, endVerse: tail[2] ? Number(tail[2]) : v1 };
    }
    refs.push(ref);
  }
  const anchors = [...inner.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((a) => inlineText(a[1])).filter(Boolean);
  return { labelHtml, refs, anchors };
}

function cleanLabel(raw: string): string {
  return raw
    .replace(/^[\s–—\-.·]+/, '')
    .replace(/[\s—–\-:;,]+$/, '')
    .replace(/\.$/, '')
    .trim();
}

/** Split "In Prayer — See Prayer." into label "In Prayer" + see ["Prayer"]. */
function splitSee(label: string, anchors: string[]): { label: string; see: string[] } {
  const m = /(^|[\s—–\-.;,(])See(?:\s+also)?\b\s*(.*)$/i.exec(label);
  if (!m) return { label, see: [] };
  const rest = m[2].replace(/[.)\s]+$/, '');
  const see = anchors.length ? anchors : rest.split(/;|,\s+(?=[A-Z])/).map((s) => s.trim());
  return { label: cleanLabel(label.slice(0, m.index + m[1].length)), see: see.map((s) => s.replace(/[.\s]+$/, '')).filter(Boolean) };
}

export function parseTopicXml(xml: string, stats: RefStats): RawTopic[] {
  const out: RawTopic[] = [];
  const re = /<term\b([^>]*)>([\s\S]*?)<\/term>\s*<def\b[^>]*>([\s\S]*?)<\/def>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const term = inlineText(m[2]);
    const letter = (attr(m[1], 'id') ?? '').split('-')[0] || term.charAt(0).toLowerCase();
    const aspects: RawAspect[] = [];
    for (const p of m[3].matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)) {
      const level = Number(/index(\d)/.exec(attr(p[1], 'class') ?? '')?.[1] ?? 1);
      const { labelHtml, refs, anchors } = parseParagraph(p[2], stats);
      const split = splitSee(cleanLabel(inlineText(labelHtml)), anchors);
      aspects.push({ level, label: split.label, refs, see: split.see });
    }
    out.push({ term, letter, aspects });
  }
  return out;
}

/** Label fragments that are only connectors ("And", "By", "(", "Compare"). */
const CONNECTOR = /^(?:and|by|or|also|compare|[()\[\]])$/i;
/** See-also text that points elsewhere in the same entry ("benefits of, above", "in the printed text above"). */
const INTERNAL_POINTER = /\b(?:above|below)\b/i;

function normTerm(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}

export interface TopicCorpusSpec {
  id: 'naves' | 'torrey';
  label: string;
  sourceId: string;
  authorId: string;
  /** "https://www.ccel.org/ccel/nave/bible.{letter}.html?term={term}" */
  urlFor: (term: string, letter: string) => string;
  origin: CorpusFile['corpus']['origin'];
}

/** Build the corpus: aspects with hierarchy, see-also keywords, redirects folded into their targets. */
export function buildTopicCorpus(raw: RawTopic[], spec: TopicCorpusSpec, counts: Map<string, number>, refStats: RefStats): { corpus: CorpusFile; stats: TopicBuildStats } {
  const stats: TopicBuildStats = {
    terms: raw.length,
    documents: 0,
    redirects: 0,
    unresolvedRedirects: 0,
    emptyTopics: 0,
    aspects: 0,
    headerAspects: 0,
    connectorAspects: 0,
    refs: refStats,
  };

  interface Built {
    term: string;
    letter: string;
    aspects: { label: string; refs: PassageRef[] }[];
    see: string[];
    aliases: string[];
  }
  const byTerm = new Map<string, Built>();
  const redirects: { from: string; to: string[] }[] = [];

  for (const t of raw) {
    const aspects: Built['aspects'] = [];
    const see: string[] = [];
    // Hierarchy: a label-only paragraph ("INSTANCES OF", "Exemplified") heads the deeper ones after it.
    const heads: { level: number; label: string }[] = [];
    for (let i = 0; i < t.aspects.length; i++) {
      const a = t.aspects[i];
      see.push(...a.see);
      while (heads.length && heads[heads.length - 1].level >= a.level) heads.pop();
      const valid = a.refs.map((r) => validateRef(r, counts, refStats)).filter((r): r is PassageRef => r !== null);
      const next = t.aspects[i + 1];
      if (!valid.length) {
        if (a.label && !a.see.length && next && next.level > a.level) {
          heads.push({ level: a.level, label: sentenceCase(a.label) });
          stats.headerAspects++;
        }
        continue;
      }
      // A bare connector left over from the source layout ("And", "By", "(") continues the previous group.
      if (CONNECTOR.test(a.label) && aspects.length) {
        const prev = aspects[aspects.length - 1];
        prev.refs = mergeAdjacent([...prev.refs, ...valid]);
        stats.connectorAspects++;
        continue;
      }
      const own = (CONNECTOR.test(a.label) ? '' : sentenceCase(a.label)) || 'References';
      const label = heads.length ? `${heads.map((h) => h.label).join(' — ')} — ${own}` : own;
      aspects.push({ label, refs: mergeAdjacent(valid) });
    }
    const key = normTerm(t.term);
    if (!aspects.length) {
      if (see.length) redirects.push({ from: t.term, to: see });
      else stats.emptyTopics++;
      continue;
    }
    const existing = byTerm.get(key);
    if (existing) {
      existing.aspects.push(...aspects);
      existing.see.push(...see);
    } else {
      byTerm.set(key, { term: t.term, letter: t.letter, aspects, see, aliases: [] });
    }
  }

  // Redirect-only topics ("WEALTH — See RICHES") become aliases of their targets. Targets that
  // name a sub-topic ("GOD, MERCY OF", "JESUS, DIVINITY OF") resolve to the head topic when
  // it has an aspect with that label.
  const byHead = new Map<string, Built[]>();
  for (const t of byTerm.values()) {
    const head = normTerm(t.term.split(',')[0]);
    byHead.set(head, [...(byHead.get(head) ?? []), t]);
  }
  const resolve = (target: string): Built | undefined => {
    const exact = byTerm.get(normTerm(target));
    if (exact) return exact;
    const [head, ...rest] = target.split(',');
    const sub = normTerm(rest.join(' ')).toLowerCase();
    const candidates = byHead.get(normTerm(head)) ?? [];
    if (!sub || candidates.length !== 1) return undefined;
    const words = sub.split(' ').filter((w) => w.length > 2 && w !== 'of' && w !== 'the');
    const hasAspect = candidates[0].aspects.some((a) => words.every((w) => a.label.toLowerCase().includes(w)));
    return hasAspect ? candidates[0] : undefined;
  };
  for (const r of redirects) {
    let resolved = false;
    for (const target of r.to) {
      const hit = resolve(target);
      if (hit) {
        hit.aliases.push(r.from);
        resolved = true;
      }
    }
    if (resolved) stats.redirects++;
    else stats.unresolvedRedirects++;
  }

  const documents: KbDocument[] = [];
  const usedIds = new Set<string>();
  for (const t of byTerm.values()) {
    let id = `${spec.id}:${slugify(t.term)}`;
    for (let n = 2; usedIds.has(id); n++) id = `${spec.id}:${slugify(t.term)}-${n}`;
    usedIds.add(id);
    const aspects = t.aspects.map((a) => ({ label: a.label, refs: a.refs.map(refKey) }));
    stats.aspects += aspects.length;
    const lines = t.aspects.map((a) => `${a.label}: ${a.refs.map((r) => formatRef(r)).join('; ')}`);
    // "See Benefits of, above" points inside the same topic: not a see-also topic, not an alias.
    const seeAlso = unique(t.see.map((s) => s.trim())).filter((s) => normTerm(s) !== normTerm(t.term) && !INTERNAL_POINTER.test(s));
    if (seeAlso.length) lines.push(`See also: ${seeAlso.join('; ')}`);
    const keywords = unique([...t.aliases, ...seeAlso].map((k) => k.toLowerCase()));
    const refs = unique(aspects.flatMap((a) => a.refs));
    const doc: KbDocument = {
      id,
      title: t.term,
      text: lines.join('\n'),
      authorId: spec.authorId,
      locator: `s.v. ${t.term}`,
      url: spec.urlFor(t.term, t.letter),
      refs,
      ...(keywords.length ? { keywords } : {}),
      aspects,
    };
    documents.push(doc);
  }
  documents.sort((a, b) => a.title.localeCompare(b.title));
  stats.documents = documents.length;
  log(
    `${spec.id}: ${stats.terms} terms → ${stats.documents} topics (${stats.aspects} aspects), ${stats.redirects} redirects folded into aliases` +
      ` (${stats.unresolvedRedirects} unresolved), ${stats.emptyTopics} empty; refs kept ${refStats.kept}, clamped ${refStats.clamped},` +
      ` dropped: apocrypha ${refStats.apocrypha}, malformed ${refStats.malformed}, out of range ${refStats.outOfRange}`,
  );
  return {
    corpus: {
      corpus: { id: spec.id, label: spec.label, kind: 'topical-index', sourceId: spec.sourceId, origin: spec.origin },
      documents,
    },
    stats,
  };
}

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
