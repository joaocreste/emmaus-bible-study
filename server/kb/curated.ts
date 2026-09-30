/**
 * Curated Emmaus content as knowledge-base documents (kind 'curated').
 *
 * Every item is editorially reviewed synthesis resting on its own citations, so
 * the evidence is attributed to the curated library ('emmaus-curated-library')
 * and lists those citations ("Grounded in: …") for the model to follow. Such items
 * are not quotable: a generated page may build on them but must not present
 * Emmaus prose as a quotation. The exception is a curated commentary entry that is
 * itself a verified quotation of a public-domain / openly licensed work: that one
 * keeps its own source, author, locator and URL and is quotable.
 */
import type { Citation, CuratedStudy, PassageRef, Provenance, VerseRef } from '../../src/domain/models';
import { formatRef, formatVerse, refKey, verseToPassage } from '../../src/domain/reference';
import type { CuratedTopicMatch } from '../../src/providers/curated';
import type { SourceRegistry } from '../../src/providers/types';
import { isQuotable, type KbIndexDoc } from './documents';

export const CURATED_SOURCE = 'emmaus-curated-library';

type Topicish = Pick<CuratedTopicMatch, 'id' | 'name' | 'aliases' | 'topic' | 'studyId' | 'anchor' | 'perspectives'>;

function sourceName(sources: SourceRegistry, id: string): string {
  return sources.getSource(id)?.title ?? id;
}

/** "Grounded in: Berean Standard Bible (Matt 6:25–34); STEPBible TBESG (G3309 …)" */
export function groundsLine(sources: SourceRegistry, citations: readonly Citation[]): string {
  const parts: string[] = [];
  const seen = new Set<string>();
  for (const c of citations) {
    const s = `${sourceName(sources, c.sourceId)}${c.locator ? ` (${c.locator})` : ''}`;
    if (seen.has(s)) continue;
    seen.add(s);
    parts.push(s);
  }
  return parts.length ? `Grounded in: ${parts.join('; ')}` : '';
}

function withGrounds(sources: SourceRegistry, text: string, provenance?: Provenance): string {
  const g = provenance ? groundsLine(sources, provenance.citations) : '';
  return g ? `${text}\n\n${g}` : text;
}

const refs = (xs: (PassageRef | undefined)[]): string[] => [...new Set(xs.filter((x): x is PassageRef => Boolean(x)).map(refKey))];
const verses = (xs: VerseRef[] | undefined): PassageRef[] => (xs ?? []).map(verseToPassage);

function doc(partial: Omit<KbIndexDoc, 'corpus' | 'kind' | 'sourceId' | 'quotable'> & Partial<Pick<KbIndexDoc, 'sourceId' | 'quotable'>>): KbIndexDoc {
  // the index reads the heading without the "(Emmaus curated …)" label, so "study" does not match every item
  const heading = partial.title.replace(/ \(Emmaus curated (?:study|topic)\)/g, '').replace(/ \(curated in [^)]*\)$/, '');
  return { corpus: 'curated', kind: 'curated', sourceId: CURATED_SOURCE, quotable: false, heading, ...partial };
}

/** Documents for one curated study (summary, key passages, context, literary, theology, perspectives, notes, commentary, key words). */
export function studyDocuments(study: CuratedStudy, sources: SourceRegistry): KbIndexDoc[] {
  const out: KbIndexDoc[] = [];
  const label = `${study.title} (Emmaus curated study)`;
  const base = `curated:${study.id}`;
  const where = (section: string) => `${study.title} study, ${section}`;

  if (study.summary) {
    out.push(doc({ key: `${base}:summary`, title: `${label} — overview`, text: withGrounds(sources, study.summary.text, study.summary.provenance), locator: where('overview'), refs: refs([study.passage]), keywords: study.match.topics }));
  }
  if (study.topic) {
    const t = study.topic;
    out.push(doc({ key: `${base}:definition`, title: `${label} — ${t.question ?? t.name}`, text: withGrounds(sources, t.definition.text, t.definition.provenance), locator: where('orientation'), refs: refs(t.keyPassages.map((k) => k.ref)), keywords: study.match.topics }));
    for (const kp of t.keyPassages) {
      out.push(doc({ key: `${base}:${kp.id}`, title: `${label} — ${kp.title} (${formatRef(kp.ref)})`, text: withGrounds(sources, kp.note.text, kp.note.provenance), locator: where(`key passage “${kp.title}”`), refs: refs([kp.ref]), keywords: [kp.group, ...kp.tags] }));
    }
  }
  for (const c of study.context) {
    out.push(doc({ key: `${base}:${c.id}`, title: `${label} — ${c.title}`, text: withGrounds(sources, [c.summary, c.detail].filter(Boolean).join('\n\n'), c.provenance), locator: where(`context: ${c.title}`), refs: refs(verses(c.relatedVerses)), keywords: [c.category, ...c.tags] }));
  }
  if (study.literary) {
    const l = study.literary;
    out.push(doc({ key: `${base}:literary:place`, title: `${label} — place in the book`, text: withGrounds(sources, l.placeInBook.text, l.placeInBook.provenance), locator: where('literary context'), refs: refs([study.passage]), keywords: ['literary context', 'structure'] }));
    if (l.argument) out.push(doc({ key: `${base}:literary:argument`, title: `${label} — flow of the argument`, text: withGrounds(sources, l.argument.text, l.argument.provenance), locator: where('literary context'), refs: refs([study.passage]), keywords: ['argument', 'structure'] }));
    for (const f of l.features) {
      out.push(doc({ key: `${base}:${f.id}`, title: `${label} — ${f.title}`, text: withGrounds(sources, f.description, f.provenance), locator: where(`literary feature: ${f.title}`), refs: refs(verses(f.verses)), keywords: [f.type, ...f.tags] }));
    }
  }
  for (const th of study.theology) {
    out.push(doc({ key: `${base}:${th.id}`, title: `${label} — ${th.title}`, text: withGrounds(sources, [th.summary, th.detail].filter(Boolean).join('\n\n'), th.provenance), locator: where(`theology: ${th.title}`), refs: refs(th.keyVerses), keywords: [th.category, ...th.tags] }));
  }
  for (const ps of study.perspectives) out.push(perspectiveDoc(`${base}:${ps.id}`, label, where(`perspectives: ${ps.question}`), ps, sources));
  for (const n of study.verseNotes) {
    out.push(doc({ key: `${base}:note:${refKey(verseToPassage(n.verse))}`, title: `${label} — note on ${formatVerse(n.verse)}`, text: withGrounds(sources, n.explanation.text, n.explanation.provenance), locator: where(`note on ${formatVerse(n.verse, 'short')}`), refs: refs([verseToPassage(n.verse)]), keywords: n.tags }));
  }
  for (const x of study.crossReferences) {
    out.push(doc({ key: `${base}:${x.id}`, title: `${label} — ${formatRef(x.from)} → ${formatRef(x.target)}: ${x.title}`, text: withGrounds(sources, x.explanation.text, x.explanation.provenance), locator: where(`cross-reference ${formatRef(x.target, 'short')}`), refs: refs([x.from, x.target]), keywords: [x.relationship, ...x.tags] }));
  }
  for (const k of study.keyWords) {
    out.push(doc({ key: `${base}:${k.id}`, title: `${label} — key word ${k.lemma} (${k.transliteration}, ${k.strong}), “${k.english}”`, text: withGrounds(sources, [k.significance.text, k.caution].filter(Boolean).join('\n\n'), k.significance.provenance), locator: where(`key word ${k.transliteration}`), strong: k.strong, refs: refs(k.anchors.map((a) => verseToPassage(a.verse))), keywords: [k.english, k.transliteration, k.basicMeaning] }));
  }
  for (const c of study.commentary) {
    const author = sources.getAuthor(c.authorId);
    const work = sources.getSource(c.sourceId);
    const who = author?.name ?? c.authorId;
    const what = work?.title ?? c.sourceId;
    const verified = c.kind === 'quotation' && c.provenance.verification === 'verified';
    const url = c.url ?? c.provenance.citations.find((x) => x.url)?.url;
    const d = doc({
      key: `${base}:${c.id}`,
      title: verified ? `${who}, ${what} — quotation (curated in ${study.title})` : `Summary of ${who}, ${what} (curated in ${study.title})`,
      text: [c.lead ? `${c.lead}:` : '', c.text].filter(Boolean).join('\n'),
      sourceId: c.sourceId,
      authorId: c.authorId,
      quotable: verified && isQuotable(sources, c.sourceId),
      refs: refs(verses(c.relatedVerses)),
      keywords: c.tags,
    });
    if (c.locator) d.locator = c.locator;
    if (url) d.url = url;
    out.push(d);
  }
  return out;
}

function perspectiveDoc(key: string, label: string, locator: string, ps: CuratedStudy['perspectives'][number], sources: SourceRegistry): KbIndexDoc {
  const lines = [
    `${ps.question} (${ps.consensus.replace('-', ' ')})`,
    ps.intro,
    ...ps.perspectives.map((p) => `${p.tradition} — ${p.label}: ${p.summary}`),
    ...(ps.commonGround ? [`Common ground: ${ps.commonGround}`] : []),
  ];
  const citations = [...ps.provenance.citations, ...ps.perspectives.flatMap((p) => p.provenance.citations)];
  return doc({
    key,
    title: `${label} — perspectives: ${ps.question}`,
    text: withGrounds(sources, lines.join('\n\n'), { ...ps.provenance, citations }),
    locator,
    refs: refs(ps.perspectives.flatMap((p) => p.keyTexts ?? [])),
    keywords: [...ps.tags, ...ps.perspectives.map((p) => p.tradition)],
  });
}

/** Documents for a topic-index entry (orientation, key passages, perspectives). */
export function topicDocuments(entry: Topicish, sources: SourceRegistry): KbIndexDoc[] {
  const out: KbIndexDoc[] = [];
  const label = `${entry.name} (Emmaus curated topic)`;
  const base = `curated:topic:${entry.id}`;
  const where = (section: string) => `${entry.name} topic, ${section}`;
  const t = entry.topic;
  out.push(doc({ key: `${base}:definition`, title: `${label} — ${t.question ?? t.name}`, text: withGrounds(sources, t.definition.text, t.definition.provenance), locator: where('orientation'), refs: refs([entry.anchor, ...t.keyPassages.map((k) => k.ref)]), keywords: entry.aliases }));
  for (const kp of t.keyPassages) {
    out.push(doc({ key: `${base}:${kp.id}`, title: `${label} — ${kp.title} (${formatRef(kp.ref)})`, text: withGrounds(sources, kp.note.text, kp.note.provenance), locator: where(`key passage “${kp.title}”`), refs: refs([kp.ref]), keywords: [kp.group, ...kp.tags] }));
  }
  for (const ps of entry.perspectives ?? []) out.push(perspectiveDoc(`${base}:${ps.id}`, label, where(`perspectives: ${ps.question}`), ps, sources));
  return out;
}

/** The topic entry as one evidence text: orientation + key passages grouped as the editors grouped them. */
export function topicEvidenceText(entry: Topicish, sources: SourceRegistry, opts: { maxChars?: number } = {}): string {
  const full = topicText(entry, sources, true);
  // too long to read in one tool result: keep the orientation and the key passages' titles (their notes are searchable documents)
  return opts.maxChars && full.length > opts.maxChars ? topicText(entry, sources, false) : full;
}

function topicText(entry: Topicish, sources: SourceRegistry, withNotes: boolean): string {
  const t = entry.topic;
  const lines = [t.definition.text, ''];
  const groups = new Map<string, string[]>();
  for (const kp of t.keyPassages) groups.set(kp.group, [...(groups.get(kp.group) ?? []), `${formatRef(kp.ref)} — ${kp.title}${withNotes ? `: ${kp.note.text}` : ''}`]);
  for (const [g, items] of groups) lines.push(`${g}:`, ...items.map((i) => `• ${i}`), '');
  for (const ps of entry.perspectives ?? []) lines.push(`Where Christians differ — ${ps.question}: ${ps.perspectives.map((p) => `${p.tradition} (${p.label})`).join('; ')}`);
  if (entry.studyId) lines.push(`A deep curated study exists for this topic (study id “${entry.studyId}”).`);
  const g = groundsLine(sources, t.definition.provenance.citations);
  if (g) lines.push('', g);
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** All curated documents: every study + every topic-index entry not already covered by its study. */
export function curatedDocuments(studies: readonly CuratedStudy[], topics: readonly Topicish[], sources: SourceRegistry): KbIndexDoc[] {
  const out: KbIndexDoc[] = [];
  const studyIds = new Set(studies.map((s) => s.id));
  for (const s of studies) out.push(...studyDocuments(s, sources));
  for (const t of topics) {
    // entries synthesised from a topic study (id === study id) duplicate the study's own documents
    if (studyIds.has(t.id) && t.studyId === t.id && !('entry' in t && (t as CuratedTopicMatch).entry)) continue;
    out.push(...topicDocuments(t, sources));
  }
  const seen = new Map<string, number>();
  for (const d of out) {
    const n = seen.get(d.key) ?? 0;
    seen.set(d.key, n + 1);
    if (n) d.key = `${d.key}#${n + 1}`;
  }
  return out;
}
