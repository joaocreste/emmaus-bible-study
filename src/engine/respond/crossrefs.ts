/**
 * cross-references and connect: curated, explained references first (ranked by
 * the active concept, term and verse; filtered by traditional author, book or
 * relationship), then OpenBible.info dataset references labelled honestly.
 */
import type {
  Concept,
  CrossReference,
  CrossReferenceFilter,
  DatasetCrossReference,
  PassageRef,
  RelationshipType,
  Study,
  Testament,
  VerseRef,
} from '../../domain/models';
import { tryGetBook } from '../../domain/books';
import { fromDataset } from '../../domain/provenance';
import { formatRef, refIncludesVerse, refKey, refsOverlap, verseToPassage } from '../../domain/reference';
import type { MessageKey } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';
import { bookName, colon, engineT, list, listJoin, lowerFirstIn, mergeCitations, para, personName, quoted, tok, verseLabel, type ReplyDraft, psalmArticle } from '../compose';
import { findConcept, searchStudy } from '../search';
import { bestPhraseScore, excerpt, fold } from '../text';
import { respondPerspectives } from './context';
import { activeConcept, attempt, curatedPid, loc, pid, scanScope, step, tr, type ResponderEnv } from './env';
import { respondFromHit } from './hits';
import { studySuggestion } from './open';
import { answeringPassages, keyPassagesDraft } from './topic';

/** Singular badge-style name, matching the dashboard's relationship badges ("prophecy → fulfilment"). */
function relBadge(r: RelationshipType, locale: Locale): string {
  return engineT(locale)(`rel.badge.${r}` as MessageKey<'engine'>);
}

/** Plural description of a relationship ("prophecy and fulfilment links"). */
function relLabel(r: RelationshipType, locale: Locale): string {
  return engineT(locale)(`rel.label.${r}` as MessageKey<'engine'>);
}

/** Same rule as the dashboard's filter: exact (case-insensitive) traditional author of the target book. */
function matchesAuthor(ref: PassageRef, author: string | undefined): boolean {
  if (!author) return true;
  return (tryGetBook(ref.book)?.traditionalAuthor ?? '').toLowerCase() === author.trim().toLowerCase();
}

function matchesFilter(x: { target: PassageRef; relationship?: RelationshipType }, f: CrossReferenceFilter, testament?: Testament): boolean {
  if (!matchesAuthor(x.target, f.author)) return false;
  if (f.book && x.target.book !== f.book) return false;
  if (f.relationships?.length && x.relationship && !f.relationships.includes(x.relationship)) return false;
  if (testament && tryGetBook(x.target.book)?.testament !== testament) return false;
  return true;
}

interface RankSignals {
  concept?: Concept;
  term?: string;
  verse?: VerseRef;
  relationships: RelationshipType[];
}

/** Rank curated cross-references by the conversation's signals (stable for ties). */
export function rankCrossRefs(items: CrossReference[], s: RankSignals): CrossReference[] {
  const conceptTerms = s.concept ? [s.concept.label, ...s.concept.aliases] : [];
  const scored = items.map((x, i) => {
    let score = 0;
    if (s.concept?.crossReferenceIds.includes(x.id)) score += 5;
    if (conceptTerms.length) score += 2 * Math.max(0, ...x.tags.map((t) => bestPhraseScore(t, conceptTerms)));
    if (s.term) score += 3 * bestPhraseScore(s.term, [x.title, ...x.tags]);
    if (s.verse && refIncludesVerse(x.from, s.verse)) score += 2;
    if (s.relationships.includes(x.relationship)) score += 1;
    return { x, i, score };
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.x);
}

/** Relationships close enough to offer when the asked-for one has no curated card. */
const NEARBY_RELATIONSHIPS: Partial<Record<RelationshipType, RelationshipType[]>> = {
  'prophecy-fulfillment': ['same-concept', 'allusion', 'quotation', 'thematic'],
  quotation: ['allusion', 'parallel'],
  allusion: ['quotation', 'thematic', 'same-concept'],
  parallel: ['same-concept', 'thematic'],
  contrast: ['thematic'],
  historical: ['thematic', 'allusion'],
};

function filterFromSlots(env: ResponderEnv): CrossReferenceFilter {
  const f: CrossReferenceFilter = {};
  if (env.intent.slots.traditionalAuthor) f.author = env.intent.slots.traditionalAuthor;
  if (env.intent.slots.bookFilter) f.book = env.intent.slots.bookFilter;
  if (env.parsed.relationships.length) f.relationships = env.parsed.relationships;
  return f;
}

function filterPhrase(f: CrossReferenceFilter, locale: Locale, testament?: Testament): string {
  const t = engineT(locale);
  const parts: string[] = [];
  if (f.relationships?.length) {
    // English names the links ("prophecy and fulfilment links"); other languages name the badge ("do tipo “profecia → cumprimento”")
    parts.push(
      locale === 'en'
        ? listJoin(f.relationships.map((r) => relLabel(r, locale)), locale)
        : t('xref.ofType', { types: listJoin(f.relationships.map((r) => quoted(relBadge(r, locale), locale)), locale, 'or') }),
    );
  }
  if (f.author) parts.push(f.author === 'Paul' ? t('xref.inPaul') : t('xref.inAuthor', { author: personName(f.author, locale) }));
  if (f.book) parts.push(t('xref.inBook', { book: tryGetBook(f.book) ? bookName(f.book, locale) : f.book }));
  if (testament) parts.push(t(testament === 'OT' ? 'xref.inOT' : 'xref.inNT'));
  return parts.join(' ');
}

function curatedItem(x: CrossReference, locale: Locale = 'en'): string {
  return `${tok.ref(x.target)} — **${x.title}**${colon(locale)} ${excerpt(x.explanation.text, 26)}`;
}

/** Dataset references for the scope, filtered, best-voted first, one per target. */
async function datasetRefs(env: ResponderEnv, scope: PassageRef, f: CrossReferenceFilter, testament?: Testament, target?: PassageRef): Promise<DatasetCrossReference[]> {
  const all = await attempt(() => env.providers.crossReferences.getCrossReferences(scope, { limitPerVerse: 15 }), []);
  const seen = new Set<string>();
  return all
    .filter((d) => matchesFilter({ target: d.target }, { author: f.author, book: f.book }, testament))
    .filter((d) => !target || refsOverlap(d.target, target))
    .filter((d) => !env.study?.passage || !refsOverlap(d.target, env.study.passage))
    .sort((a, b) => b.score - a.score)
    .filter((d) => {
      const k = refKey(d.target);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
}

function datasetItem(d: DatasetCrossReference, study: Study | null, locale: Locale): string {
  return engineT(locale)('xref.datasetItem', { ref: tok.ref(d.target), from: verseLabel(d.from, study, locale) });
}

/** "Jesus", "Christ", "Messiah" named in the question (any of the four languages). */
const ABOUT_CHRIST = /\b(jesus|christ|messiah|messianic|cristo|messias|messianic[oa]s?|jesucristo|mesias|mesianic[oa]s?|messie|messianique)\b/;

export async function respondCrossReferences(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study!;
  const f = filterFromSlots(env);
  // The subject named in the question ("…call God a shepherd?") outranks the concept discussed earlier;
  // the conversation's concept applies when the question points back ("this idea") or names nothing.
  const term = env.intent.slots.term;
  const termConcept = term ? findConcept(study, term, 0.9)?.item : undefined;
  const concept = termConcept ?? (env.parsed.refersToContext || !term ? activeConcept(env) : undefined);
  const verse = env.intent.slots.verse ?? (env.parsed.refersToContext && !concept ? env.ctx.conversation.activeVerse : undefined);
  const phrase = filterPhrase(f, locale);
  const hasFilter = Boolean(f.author || f.book || f.relationships?.length);

  const candidates = study.crossReferences.filter((x) => matchesFilter(x, f));
  const ranked = rankCrossRefs(candidates, { concept, term: env.intent.slots.term, verse, relationships: env.parsed.relationships });
  const about = concept ? lowerFirstIn(concept.label, locale) : verse ? verseLabel(verse, study, locale) : study.title;

  if (ranked.length) {
    const top = ranked.slice(0, 3);
    const conceptTerms = concept ? [concept.label, ...concept.aliases] : [];
    const related = (x: CrossReference) =>
      Boolean(concept && (concept.crossReferenceIds.includes(x.id) || x.tags.some((tag) => bestPhraseScore(tag, conceptTerms) >= 0.9)));
    const relatedCount = top.filter(related).length;
    const filtered = hasFilter ? 'yes' : 'no';
    const intro = !concept
      ? hasFilter
        ? t('xref.intro.filtered', { phrase })
        : t('xref.intro.about', { about })
      : relatedCount === top.length
        ? hasFilter
          ? t('xref.intro.idea', { about, phrase })
          : t('xref.intro.about', { about })
        : relatedCount > 0
          ? t('xref.intro.closest', { filtered, phrase, about })
          : t('xref.intro.nothing', { filtered, phrase, about, where: phrase || t('xref.elsewhere') });
    const blocks = [para(intro), list(top.map((x) => curatedItem(x, locale)))];
    const pinned = ranked.slice(0, 6);
    const morePinned = pinned.length - top.length;
    const rest = ranked.length - pinned.length;
    if (morePinned > 0 || rest > 0) {
      const section = tok.section('cross-references');
      blocks.push(
        para(
          morePinned > 0 && rest > 0
            ? t('xref.pinnedAndRest', { pinned: morePinned, rest, section })
            : morePinned > 0
              ? t('xref.pinned', { pinned: morePinned, section })
              : t('xref.rest', { rest, section }),
        ),
      );
    }
    const paulHere = f.author !== 'Paul' && study.crossReferences.some((x) => matchesAuthor(x.target, 'Paul'));
    return {
      blocks,
      focus: {
        section: 'cross-references',
        crossReferenceFilter: f,
        pinIds: pinned.map((x) => x.id),
        expandIds: [top[0].id],
        ...(verse ? { highlightVerses: [verse] } : {}),
        reason: hasFilter ? t('reason.fromQuestion', { what: t('xref.reasonFiltered', { phrase }) }) : t('reason.fromQuestion', { what: t('xref.reasonFor', { about }) }),
      },
      citations: mergeCitations(...top.map((x) => x.explanation.provenance.citations)),
      suggestions: [...(paulHere ? [t('suggest.wherePaul')] : []), t('suggest.audience')],
      steps: [
        step('Cross-references', t('trace.xrefMatch', { count: candidates.length, by: concept ? concept.label : term ?? 'none' }), curatedPid(study)),
      ],
    };
  }

  // A topic study's own key passages ("How does Paul connect Adam and Christ?" → Romans 5:12–21), filtered like the references —
  // or, for a question without a filter, whatever item of the study answers it squarely (a debate, a key passage).
  if (study.topic?.keyPassages.length) {
    const best = !hasFilter ? searchStudy(study, env.message)[0] : undefined;
    if (best && best.score >= 0.6 && best.type !== 'cross-reference') return respondFromHit(env, best);
    const top = answeringPassages(study, env.message, env.intent.slots.passage, (ref) => matchesFilter({ target: ref }, { author: f.author, book: f.book }));
    if (top.length) {
      const draft = keyPassagesDraft(study, top, [], phrase ? t('xref.amongKeyPassagesFiltered', { phrase }) : t('xref.amongKeyPassages'), locale);
      return { ...draft, steps: [step('Cross-references', t('trace.xrefFromKeyPassages'), curatedPid(study)), ...draft.steps] };
    }
  }

  // Nothing curated carries the requested relationship ("Is Psalm 23 a prophecy about Jesus?"):
  // offer the nearest explained connections instead, labelled as such — never relabelled.
  if (f.relationships?.length && !f.author && !f.book) {
    const nearby = new Set(f.relationships.flatMap((r) => NEARBY_RELATIONSHIPS[r] ?? []));
    // a question about Jesus looks first to the New Testament connections
    const aboutChrist = locale === 'en' ? /\b(jesus|christ|messiah|messianic)\b/i.test(env.message) : ABOUT_CHRIST.test(fold(env.message));
    const near = rankCrossRefs(
      study.crossReferences.filter((x) => nearby.has(x.relationship)),
      { concept, term: env.intent.slots.term, verse, relationships: [] },
    )
      .map((x, i) => ({ x, i, nt: aboutChrist && tryGetBook(x.target.book)?.testament === 'NT' ? 0 : 1 }))
      .sort((a, b) => a.nt - b.nt || a.i - b.i)
      .map((e) => e.x)
      .slice(0, 3);
    if (near.length) {
      const asked = listJoin(f.relationships.map((r) => quoted(relBadge(r, locale), locale)), locale, 'or');
      return {
        blocks: [para(t('xref.noneClassified', { asked })), list(near.map((x) => `${curatedItem(x, locale)} *(${relBadge(x.relationship, locale)})*`))],
        focus: {
          section: 'cross-references',
          crossReferenceFilter: {},
          pinIds: near.map((x) => x.id),
          expandIds: [near[0].id],
          reason: t('reason.fromQuestion', { what: t('xref.reasonClosest') }),
        },
        citations: mergeCitations(...near.map((x) => x.explanation.provenance.citations)),
        suggestions: [t('suggest.interpretationsTheological'), t('suggest.crossRefs')],
        steps: [step('Cross-references', t('trace.xrefNearest', { asked, count: near.length }), curatedPid(study))],
      };
    }
  }

  // Dataset fallback (always for library studies).
  const scope = verse
    ? verseToPassage(verse)
    : concept?.verses[0]
      ? verseToPassage(concept.verses[0])
      : scanScope(study, undefined, env.ctx.conversation.activeVerse);
  const refs = scope ? (await datasetRefs(env, scope, f)).slice(0, 5) : [];
  const steps = [
    step('Cross-references', study.depth === 'curated' ? t('trace.xrefNoCurated', { phrase: phrase || t('xref.matches') }) : t('trace.xrefLibrary'), curatedPid(study)),
    step('Dataset', t('trace.datasetRefs', { count: refs.length, scope: scope ? formatRef(scope, 'short', locale) : 'none' }), pid(env.providers.crossReferences, 'local:xrefs')),
  ];
  if (refs.length) {
    const lead =
      study.depth === 'curated'
        ? t('xref.datasetCurated', { phrase: phrase || t('xref.forThis') })
        : phrase
          ? t('xref.datasetLibraryFiltered', { phrase })
          : t('xref.datasetLibrary');
    return {
      blocks: [para(lead), list(refs.map((d) => datasetItem(d, study, locale)))],
      focus: {
        section: 'cross-references',
        crossReferenceFilter: f,
        ...(scope?.startVerse != null ? { highlightVerses: [{ book: scope.book, chapter: scope.startChapter, verse: scope.startVerse }] } : {}),
        reason: t('reason.fromQuestion', { what: phrase ? t('xref.reasonDatasetFiltered', { phrase }) : t('xref.reasonDataset') }),
      },
      provenance: fromDataset({ sourceId: 'openbible-xrefs' }),
      citations: [{ sourceId: 'openbible-xrefs' }],
      suggestions: [t('suggest.explainVerse', { n: 1 }), t('suggest.background')],
      steps,
    };
  }
  return {
    blocks: [para(t('xref.noneAtAll', { phrase: phrase || t('xref.forThis') }))],
    focus: { section: 'cross-references', crossReferenceFilter: {} },
    suggestions: [t('suggest.crossRefs'), t('suggest.background')],
    steps,
    declined: true,
  };
}

/* ------------------------------------------------------------------ */
/* Connect                                                             */
/* ------------------------------------------------------------------ */

export async function respondConnect(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study!;
  const target = env.parsed.connect ?? {};
  const concept = activeConcept(env);
  const rels = env.parsed.relationships;

  // "How does this connect with Romans?" inside a Romans study → the rest of the book.
  if (target.book && !target.ref && study.passage?.book === target.book) return restOfBook(env, study, target.book);

  const testament = target.testament;
  const f: CrossReferenceFilter = target.book ? { book: target.book } : {};
  const targetRef = target.ref;
  const targetLabel = targetRef
    ? formatRef(targetRef, 'long', locale)
    : target.book
      ? tryGetBook(target.book)
        ? bookName(target.book, locale)
        : target.book
      : t(testament === 'OT' ? 'xref.theOT' : 'xref.theNT');
  const curated = rankCrossRefs(
    study.crossReferences.filter((x) => matchesFilter(x, f, testament) && (!targetRef || refsOverlap(x.target, targetRef))),
    { concept, relationships: rels },
  );
  const inspector = targetRef ? { inspector: { type: 'passage' as const, ref: targetRef, title: formatRef(targetRef, 'long', locale) } } : {};
  const studySuggestions = targetRef ? [studySuggestion(targetRef, locale)] : target.book ? [t('suggest.study', { ref: targetLabel })] : [];

  if (curated.length) {
    const top = curated.slice(0, 3);
    return {
      blocks: [
        para(t('connect.ways', { title: psalmArticle(study.title, loc(env), true), target: targetLabel, count: curated.length })),
        list(top.map((x) => curatedItem(x, locale))),
        ...(targetRef ? [para(t('connect.opened', { ref: tok.ref(targetRef) }))] : []),
      ],
      focus: {
        section: 'cross-references',
        crossReferenceFilter: f,
        pinIds: curated.slice(0, 6).map((x) => x.id),
        expandIds: [top[0].id],
        reason: t('reason.fromQuestion', { what: t('connect.reason', { target: targetLabel }) }),
      },
      ...inspector,
      citations: mergeCitations(...top.map((x) => x.explanation.provenance.citations)),
      suggestions: studySuggestions,
      steps: [step('Cross-references', t('trace.connectCurated', { count: curated.length, target: targetLabel }), curatedPid(study))],
    };
  }

  // Texts that Christians read together on a debated question (a perspective's key texts).
  const debated = targetRef ? study.perspectives.find((ps) => ps.perspectives.some((p) => p.keyTexts?.some((k) => refsOverlap(k, targetRef)))) : undefined;
  if (debated) {
    const intent = { kind: 'perspectives' as const, confidence: 0.6, slots: { term: debated.question } };
    const d = await respondPerspectives({ ...env, intent });
    return {
      ...d,
      blocks: [para(t('connect.debated', { ref: tok.ref(targetRef!) })), ...d.blocks],
      ...inspector,
      suggestions: [...studySuggestions, ...(d.suggestions ?? [])],
      intent: env.intent,
    };
  }

  const scope = scanScope(study, undefined, env.ctx.conversation.activeVerse);
  const refs = scope ? (await datasetRefs(env, scope, f, testament, targetRef)).slice(0, 5) : [];
  const steps = [
    step('Cross-references', t('trace.connectNone', { target: targetLabel }), curatedPid(study)),
    step('Dataset', t('trace.connectDataset', { count: refs.length, target: targetLabel }), pid(env.providers.crossReferences, 'local:xrefs')),
  ];
  if (refs.length) {
    return {
      blocks: [para(t('connect.dataset', { target: targetLabel })), list(refs.map((d) => datasetItem(d, study, locale)))],
      focus: { section: 'cross-references', crossReferenceFilter: f, reason: t('reason.fromQuestion', { what: t('connect.reasonDataset', { target: targetLabel }) }) },
      ...inspector,
      provenance: fromDataset({ sourceId: 'openbible-xrefs' }),
      citations: [{ sourceId: 'openbible-xrefs' }],
      suggestions: studySuggestions,
      steps,
    };
  }
  return {
    blocks: [para(targetRef ? t('connect.noneOpened', { title: study.title, target: targetLabel, ref: tok.ref(targetRef) }) : t('connect.none', { title: study.title, target: targetLabel }))],
    ...inspector,
    suggestions: [...studySuggestions, t('suggest.crossRefs')],
    steps,
    declined: true,
  };
}

/** The passage within its own book: outline + placeInBook + within-book cross-references. */
function restOfBook(env: ResponderEnv, study: Study, book: string): ReplyDraft {
  const t = tr(env);
  const name = tryGetBook(book) ? bookName(book, loc(env)) : book;
  const lit = study.literary;
  const within = rankCrossRefs(
    study.crossReferences.filter((x) => x.target.book === book && !(study.passage && refsOverlap(x.target, study.passage))),
    { concept: activeConcept(env), relationships: [] },
  );
  const outline = lit?.bookOutline ?? [];
  const i = outline.findIndex((s) => s.current || (study.passage && refsOverlap(s.ref, study.passage)));
  const blocks = [];
  if (i >= 0) {
    const prev = outline[i - 1];
    const next = outline[i + 1];
    blocks.push(
      para(
        t('connect.flow', {
          book: name,
          title: study.title,
          label: outline[i].label,
          ref: tok.ref(outline[i].ref),
          prev: prev ? prev.label : 'none',
          next: next ? next.label : 'none',
        }),
      ),
    );
  }
  if (lit?.placeInBook) blocks.push(para(excerpt(lit.placeInBook.text, 55)));
  if (within.length) blocks.push(para(t('connect.within', { book: name, refs: within.slice(0, 2).map((x) => `${tok.ref(x.target)} (${x.title})`).join('; ') })));
  if (blocks.length === 0) {
    blocks.push(para(t('connect.noTrace', { title: study.title, book: name })));
  }
  return {
    blocks,
    focus: {
      section: lit ? 'literary-context' : 'cross-references',
      crossReferenceFilter: { book },
      ...(within.length ? { pinIds: within.slice(0, 6).map((x) => x.id) } : {}),
      reason: t('reason.fromQuestion', { what: t('connect.reasonWithin', { title: study.title, book: name }) }),
    },
    updates: i >= 0 ? [{ section: 'literary-context', label: t('connect.marked', { title: study.title, book: name }) }] : [],
    citations: mergeCitations(lit?.placeInBook.provenance.citations, ...within.slice(0, 2).map((x) => x.explanation.provenance.citations)),
    suggestions: [t('suggest.structure'), t('suggest.crossRefs')],
    steps: [
      step('Literary context', lit ? t('trace.bookOutline', { count: outline.length }) : t('trace.noOutline'), curatedPid(study)),
      step('Cross-references', t('trace.withinBook', { count: within.length, book: name }), curatedPid(study)),
    ],
    ...(blocks.length === 1 && !lit && !within.length ? { declined: true } : {}),
  };
}
