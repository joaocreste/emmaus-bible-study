/**
 * StudyAssembler — turns retrieved material into a `Study`:
 *   - curated studies (depth 'curated') with computed sourceIds;
 *   - library passage studies for any reference (depth 'library'), built on the open datasets;
 *   - library topic studies from the curated topic index.
 * A future retrieval + LLM engine would produce the same Study shape.
 */
import type { Citation, CuratedStudy, CuratedTopic, PassageRef, PerspectiveSet, Study, TopicDefinition, TranslationId } from '../domain/models';
import { getBook, tryGetBook } from '../domain/books';
import { cite, synthesis, text } from '../domain/provenance';
import { formatRef, refKey } from '../domain/reference';
import { getBibleVersion } from '../domain/translations';
import type { Locale } from '../i18n/locales';
import type { ProviderRegistry, TopicMatch } from '../providers/types';
import { bookName, engineT, PROPER_WORDS } from './compose';

/** A topic match that may carry its index entry's extras (see providers/curated/topics.ts). */
export type TopicMatchLike = TopicMatch & {
  anchor?: PassageRef;
  perspectives?: PerspectiveSet[];
  suggestedQuestions?: string[];
  entry?: CuratedTopic;
};

/**
 * A topic name inside a sentence: "The Trinity" → "the Trinity", "Anxiety & Worry" → "anxiety & worry"
 * ("A Trindade" → "a Trindade", "Ansiedade e preocupação" → "ansiedade e preocupação").
 */
export function topicInProse(name: string, locale: Locale = 'en'): string {
  if (/^The\s/.test(name)) return `the ${name.slice(4)}`;
  if (locale !== 'en') {
    const article = /^(O|A|Os|As|El|La|Los|Las|Le|Les)\s/u.exec(name);
    if (article) return `${article[1].toLowerCase()} ${name.slice(article[0].length)}`;
    if (/^L[’']/u.test(name)) return `l${name.slice(1)}`;
  }
  return name
    .split(/(\s+)/)
    .map((w) => (PROPER_WORDS.has(w) ? w : w.toLowerCase()))
    .join('');
}

/** Language and Bible version a library study is written for. */
export interface AssemblyOptions {
  locale?: Locale;
  translation?: TranslationId;
  /** library topics: the topic-index entry came with a translation overlay (default true outside English) */
  translated?: boolean;
}

/** Collect every `sourceId` (and every citation's sourceId) found anywhere inside a value. */
export function collectSourceIds(value: unknown, into: string[] = []): string[] {
  const seen = new Set(into);
  const visit = (v: unknown) => {
    if (Array.isArray(v)) {
      for (const x of v) visit(x);
      return;
    }
    if (!v || typeof v !== 'object') return;
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      if (k === 'sourceId' && typeof x === 'string' && !seen.has(x)) {
        seen.add(x);
        into.push(x);
      } else if (typeof x === 'object') visit(x);
    }
  };
  visit(value);
  return into;
}

/** Datasets used by every library study of a book, by testament. */
export function libraryDatasetIds(book: string): string[] {
  const nt = getBook(book).testament === 'NT';
  return ['bsb', nt ? 'stepbible-tagnt' : 'stepbible-tahot', nt ? 'stepbible-tbesg' : 'stepbible-tbesh', 'openbible-xrefs', 'tyndale-open-study-notes'];
}

export const LIBRARY_SUGGESTIONS = (ref: PassageRef, locale: Locale = 'en'): string[] => {
  const t = engineT(locale);
  return [t('suggest.explainVerse', { n: ref.startVerse ?? 1 }), t('suggest.keyWords'), t('suggest.crossRefs'), t('suggest.background'), t('suggest.classicCommentators')];
};

export class StudyAssembler {
  constructor(private readonly providers: ProviderRegistry) {}

  /** Keep only ids the source registry knows (so the Sources section never shows a dangling id). */
  private known(ids: string[]): string[] {
    return Array.from(new Set(ids)).filter((id) => {
      try {
        return Boolean(this.providers.sources.getSource(id));
      } catch {
        return true;
      }
    });
  }

  /** Commentary sources available for a testament (public-domain commentaries + Tyndale notes). */
  commentarySourceIds(book: string): string[] {
    const testament = tryGetBook(book)?.testament;
    try {
      return this.providers.commentary
        .listCommentaries()
        .filter((c) => !testament || c.testaments.includes(testament))
        .map((c) => c.sourceId);
    } catch {
      return [];
    }
  }

  /**
   * Curated module → Study (depth 'curated'), with every cited source + the BSB. The repository marks a
   * module served in another language (`localization`); a module it did not mark is English prose.
   */
  fromCurated(c: CuratedStudy, locale: Locale = 'en'): Study {
    const { match: _match, sources, authors: _authors, ...rest } = c;
    void _match;
    void _authors;
    const ids = collectSourceIds(rest, ['bsb']);
    for (const s of sources ?? []) if (!ids.includes(s.id)) ids.push(s.id);
    const localization = rest.localization ?? (locale !== 'en' ? { locale: 'en' as const } : undefined);
    return { ...rest, depth: 'curated', sourceIds: ids, ...(localization ? { localization } : {}) };
  }

  /** The Bible version a library study reads in this language: the reader's own, else the language's default, else the BSB. */
  private version(options: AssemblyOptions): { name: string; sourceId: string } {
    const locale = options.locale ?? 'en';
    try {
      const v = options.translation ? getBibleVersion(options.translation) : undefined;
      const chosen = v && v.language === locale ? v : undefined;
      if (chosen && this.knows(chosen.sourceId)) return { name: chosen.name, sourceId: chosen.sourceId };
    } catch {
      /* unknown translation id */
    }
    return { name: 'Berean Standard Bible', sourceId: 'bsb' };
  }

  private knows(id: string): boolean {
    try {
      return Boolean(this.providers.sources.getSource(id));
    } catch {
      return false;
    }
  }

  /** Library study for any passage — Scripture, tagged original text, lexicon, dataset cross-references, open study notes. */
  libraryPassage(ref: PassageRef, options: AssemblyOptions = {}): Study {
    const locale = options.locale ?? 'en';
    const t = engineT(locale);
    const info = getBook(ref.book);
    const label = formatRef(ref, 'long', locale);
    const nt = info.testament === 'NT';
    const datasets = libraryDatasetIds(ref.book);
    const version = locale === 'en' ? { name: 'Berean Standard Bible', sourceId: 'bsb' } : this.version(options);
    if (version.sourceId !== 'bsb') datasets.unshift(version.sourceId);
    const citations: Citation[] = [
      cite(version.sourceId),
      cite(nt ? 'stepbible-tagnt' : 'stepbible-tahot'),
      cite(nt ? 'stepbible-tbesg' : 'stepbible-tbesh'),
      cite('openbible-xrefs'),
      cite('tyndale-open-study-notes'),
    ];
    const summary = text(t('library.summary', { ref: label, version: version.name, testament: nt ? 'nt' : 'ot' }), synthesis(...citations));
    return {
      id: `library-${refKey(ref)}`,
      kind: 'passage',
      depth: 'library',
      title: label,
      subtitle: t('library.subtitle', { book: bookName(ref.book, locale), section: t(`canon.${info.section}` as Parameters<typeof t>[0]) }),
      passage: ref,
      summary,
      keyWords: [],
      crossReferences: [],
      context: [],
      theology: [],
      perspectives: [],
      commentary: [],
      sermons: [],
      verseNotes: [],
      concepts: [],
      suggestedQuestions: LIBRARY_SUGGESTIONS(ref, locale),
      sourceIds: this.known([...datasets, ...this.commentarySourceIds(ref.book)]),
      ...(locale !== 'en' ? { localization: { locale } } : {}),
    };
  }

  /** Library topic study from a topic-index entry (kind 'topic', depth 'library'). */
  libraryTopic(match: TopicMatchLike, options: AssemblyOptions = {}): Study {
    const locale = options.locale ?? 'en';
    const t = engineT(locale);
    const entry = match.entry;
    const topic: TopicDefinition = entry?.topic ?? match.topic;
    const anchor = entry?.anchor ?? match.anchor ?? topic.keyPassages[0]?.ref;
    const perspectives = entry?.perspectives ?? match.perspectives ?? [];
    const name = entry?.name ?? match.name;
    const n = topic.keyPassages.length;
    const summary = text(
      t('libraryTopic.summary', { topic: topicInProse(name, locale), name, count: n, debates: perspectives.length ? 'yes' : 'no' }),
      synthesis(...topic.definition.provenance.citations),
    );
    const suggestions = entry?.suggestedQuestions ?? match.suggestedQuestions ?? [
      ...(anchor ? [t('suggest.explainVerse', { n: anchor.startVerse ?? 1 })] : []),
      t('suggest.crossRefs'),
      ...(perspectives.length ? [t('suggest.interpretations')] : []),
      t('suggest.classicCommentators'),
    ];
    const ids = collectSourceIds({ topic, perspectives }, ['bsb']);
    for (const s of entry?.sources ?? []) if (!ids.includes(s.id)) ids.push(s.id);
    if (anchor) ids.push(...libraryDatasetIds(anchor.book));
    return {
      id: `topic-${match.id}`,
      kind: 'topic',
      depth: 'library',
      title: name,
      subtitle: anchor ? t('libraryTopic.subtitleAnchored', { ref: formatRef(anchor, 'long', locale) }) : t('libraryTopic.subtitle'),
      ...(anchor ? { passage: anchor } : {}),
      topic,
      summary,
      keyWords: [],
      crossReferences: [],
      context: [],
      theology: [],
      perspectives,
      commentary: [],
      sermons: [],
      verseNotes: [],
      concepts: [],
      suggestedQuestions: suggestions,
      sourceIds: Array.from(new Set(ids)),
      // assembled for the reader's language (the session re-opens it when the language changes); translated when the entry had an overlay
      ...(locale !== 'en' ? { localization: options.translated === false ? { locale } : { locale, translatedFrom: 'en' as const } } : {}),
    };
  }
}
