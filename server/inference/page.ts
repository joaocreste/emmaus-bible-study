/**
 * PageBuilder — assembles the generated Study from validated sections: header from
 * begin_page, one section per add_section (replace or append), opening/concepts from
 * finish_page. Produces snapshots for streaming (deep copies) with layout, sourceIds and
 * generation info filled in.
 */
import type { GenerationInfo, PassageRef, ProvenancedText, SectionId, Study, StudyKind, StudyLayout } from '../../src/domain/models';
import { collectSourceIds } from '../../src/engine/assemble';
import { fold, normalizePhrase } from '../../src/engine/text';
import type { ProviderRegistry } from '../../src/providers/types';
import type { PageSection } from './composeTools';
import type { BeginResult, FinishResult, PageInfo, SectionPayload } from './validate';

type SectionMeta = { title?: string; intro?: string };

const SECTION_NOUN: Record<PageSection, [string, string]> = {
  'key-passages': ['passage', 'passages'],
  'cross-references': ['cross-reference', 'cross-references'],
  'original-languages': ['key word', 'key words'],
  'historical-context': ['background note', 'background notes'],
  'literary-context': ['literary note', 'literary notes'],
  theology: ['theology item', 'theology items'],
  commentary: ['voice', 'voices'],
};

export const DEFAULT_SECTION_TITLE: Record<PageSection, string> = {
  'key-passages': 'Key passages',
  'cross-references': 'Cross-references',
  'original-languages': 'Original languages',
  'historical-context': 'Historical context',
  'literary-context': 'Literary context',
  theology: 'Theology',
  commentary: 'Voices from the tradition',
};

export class PageBuilder {
  private study: Study;
  private readonly order: PageSection[] = [];
  private readonly meta = new Map<PageSection, SectionMeta>();
  private begun: boolean;
  finished = false;
  private counter = 0;

  constructor(
    private readonly providers: ProviderRegistry,
    base: Study,
    options: { begun: boolean; idPrefix?: string } = { begun: false },
  ) {
    this.study = structuredClone(base);
    this.begun = options.begun;
    this.idPrefix = options.idPrefix ?? base.id;
    if (options.begun) this.adoptExistingSections();
  }

  private readonly idPrefix: string;

  /** New item id, unique within the page: "<study id>:<prefix>:<n>". */
  nextId = (prefix: string): string => `${this.idPrefix}:${prefix}:${++this.counter}`;

  /** An empty generated study shell (before begin_page). */
  static shell(id: string, generation: GenerationInfo): Study {
    return {
      id,
      kind: 'topic',
      depth: 'generated',
      title: generation.query,
      keyWords: [],
      crossReferences: [],
      context: [],
      theology: [],
      perspectives: [],
      commentary: [],
      sermons: [],
      verseNotes: [],
      concepts: [],
      suggestedQuestions: [],
      sourceIds: [],
      layout: { sections: [] },
      generation,
    };
  }

  get hasBegun(): boolean {
    return this.begun;
  }

  get sectionCount(): number {
    return this.order.length;
  }

  get sections(): readonly PageSection[] {
    return this.order;
  }

  info(): PageInfo {
    const present = new Set<SectionId>(this.order);
    if (this.study.passage) present.add('scripture');
    return {
      kind: this.study.kind,
      passage: this.study.passage,
      sections: present,
      keyWords: this.study.keyWords,
      voiceAuthors: new Set(this.study.commentary.map((c) => c.authorId)),
    };
  }

  begin(page: NonNullable<BeginResult['page']>): void {
    const s = this.study;
    s.kind = page.kind;
    s.title = page.title;
    if (page.subtitle) s.subtitle = page.subtitle;
    else delete s.subtitle;
    if (page.passage) s.passage = page.passage;
    else delete s.passage;
    s.summary = page.summary;
    if (page.kind === 'topic') {
      s.topic = {
        name: page.title,
        ...(page.question ? { question: page.question } : {}),
        definition: page.summary,
        keyPassages: s.topic?.keyPassages ?? [],
      };
    } else delete s.topic;
    this.begun = true;
  }

  /**
   * Put a validated section on the page. `replace` swaps the section's content (for
   * theology: each of themes / perspectives that the call carries); `append` adds to it.
   */
  apply(payload: SectionPayload, meta: SectionMeta, mode: 'replace' | 'append'): void {
    const s = this.study;
    const replace = mode === 'replace';
    switch (payload.section) {
      case 'key-passages': {
        const topic = s.topic ?? { name: s.title, definition: s.summary ?? emptyText(), keyPassages: [] };
        topic.keyPassages = replace ? payload.items : mergeBy(topic.keyPassages, payload.items, (x) => refId(x.ref));
        s.topic = topic;
        break;
      }
      case 'cross-references':
        s.crossReferences = replace ? payload.items : mergeBy(s.crossReferences, payload.items, (x) => `${refId(x.from)}>${refId(x.target)}`);
        break;
      case 'original-languages':
        s.keyWords = replace ? payload.items : mergeBy(s.keyWords, payload.items, (x) => x.strong);
        break;
      case 'historical-context':
        s.context = replace ? payload.items : mergeBy(s.context, payload.items, (x) => titleKey(x.title));
        break;
      case 'literary-context':
        s.literary =
          replace || !s.literary ? payload.literary : { ...s.literary, features: mergeBy(s.literary.features, payload.literary.features, (x) => titleKey(x.title)) };
        break;
      case 'theology':
        if (replace) {
          // themes and perspectives are two lists: a call replaces only the list(s) it brought
          // accepted items for, so sending themes and perspectives in separate calls keeps both
          if (payload.themes.length) s.theology = payload.themes;
          if (payload.perspectives.length) s.perspectives = payload.perspectives;
        } else {
          s.theology = mergeBy(s.theology, payload.themes, (x) => titleKey(x.title));
          s.perspectives = mergeBy(s.perspectives, payload.perspectives, (x) => titleKey(x.question));
        }
        break;
      case 'commentary':
        s.commentary = replace ? payload.items : mergeBy(s.commentary, payload.items, (x) => `${x.sourceId}|${x.locator ?? ''}|${x.text}`);
        break;
    }
    if (!this.order.includes(payload.section)) this.order.push(payload.section);
    const prev = this.meta.get(payload.section) ?? {};
    this.meta.set(payload.section, { title: meta.title || prev.title, intro: meta.intro || prev.intro });
  }

  finish(result: FinishResult, linkEvidence: Map<string, string[]>): void {
    const s = this.study;
    if (result.opening) s.opening = result.opening;
    s.concepts = result.concepts.map((c) => this.linkConcept(c, linkEvidence));
    s.suggestedQuestions = result.suggestedQuestions;
    this.finished = true;
  }

  /** Close a page that never got finish_page (budget, timeout, model stopped): the summary opens it. */
  finishWithoutOpening(): void {
    const s = this.study;
    if (!s.opening && s.summary) s.opening = s.summary;
  }

  /** Items (by id) a concept should highlight: same words, or shared evidence within its section. */
  private linkConcept(concept: Study['concepts'][number], evidenceOf: Map<string, string[]>): Study['concepts'][number] {
    const s = this.study;
    const terms = [concept.label, ...concept.aliases].map((a) => normalizePhrase(a)).filter(Boolean);
    const mine = new Set(evidenceOf.get(concept.id) ?? []);
    const matches = (text: string) => {
      const t = ` ${normalizePhrase(text)} `;
      return terms.some((term) => term.length > 2 && t.includes(` ${term} `));
    };
    const shares = (id: string) => (evidenceOf.get(id) ?? []).some((e) => mine.has(e));
    const pick = <T extends { id: string }>(items: readonly T[], text: (x: T) => string, section: SectionId): string[] =>
      items
        .filter((x) => matches(text(x)) || (concept.primarySection === section && shares(x.id)))
        .slice(0, 4)
        .map((x) => x.id);
    return {
      ...concept,
      keyWordIds: s.keyWords
        .filter((k) => terms.some((t) => [k.english, k.transliteration, k.lemma].some((w) => normalizePhrase(w) === t || fold(w) === t)) || matches(k.english))
        .map((k) => k.id),
      crossReferenceIds: pick(s.crossReferences, (x) => `${x.title} ${x.explanation.text}`, 'cross-references'),
      contextIds: pick(s.context, (x) => `${x.title} ${x.summary}`, 'historical-context'),
      themeIds: pick(s.theology, (x) => `${x.title} ${x.summary}`, 'theology'),
      perspectiveSetIds: pick(s.perspectives, (x) => `${x.question} ${x.intro}`, 'theology'),
      commentaryIds: pick(s.commentary, (x) => `${x.lead ?? ''} ${x.text}`, 'commentary'),
      literaryFeatureIds: pick(s.literary?.features ?? [], (x) => `${x.title} ${x.description}`, 'literary-context'),
    };
  }

  /** Count of items per section, for chat updates and progress. */
  itemCount(section: PageSection): number {
    const s = this.study;
    switch (section) {
      case 'key-passages':
        return s.topic?.keyPassages.length ?? 0;
      case 'cross-references':
        return s.crossReferences.length;
      case 'original-languages':
        return s.keyWords.length;
      case 'historical-context':
        return s.context.length;
      case 'literary-context':
        return s.literary ? 1 + s.literary.features.length : 0;
      case 'theology':
        return s.theology.length + s.perspectives.length;
      case 'commentary':
        return s.commentary.length;
    }
  }

  describe(section: PageSection): string {
    const n = this.itemCount(section);
    const [one, many] = SECTION_NOUN[section];
    return `${this.sectionTitle(section)} — ${n} ${n === 1 ? one : many}`;
  }

  /** The title the model gave a section (in the page language), if any. */
  customTitle(section: PageSection): string | undefined {
    return this.meta.get(section)?.title || undefined;
  }

  sectionTitle(section: PageSection): string {
    return this.meta.get(section)?.title || DEFAULT_SECTION_TITLE[section];
  }

  layout(): StudyLayout {
    const sections: StudyLayout['sections'] = [];
    const push = (id: SectionId, m: SectionMeta = {}) => sections.push({ id, ...(m.title ? { title: m.title } : {}), ...(m.intro ? { intro: m.intro } : {}) });
    const topicFirst = this.study.kind === 'topic' && this.order[0] === 'key-passages';
    if (this.study.passage && !topicFirst) push('scripture');
    for (const id of this.order) {
      push(id, this.meta.get(id));
      if (id === 'key-passages' && topicFirst && this.study.passage) push('scripture');
    }
    push('sources');
    return { sections };
  }

  /** Deep copy of the page as it stands, with layout, sourceIds and generation info. */
  snapshot(generation?: Partial<GenerationInfo>): Study {
    const s = structuredClone(this.study);
    s.layout = this.layout();
    if (generation && s.generation) s.generation = { ...s.generation, ...generation };
    s.sourceIds = this.sourceIds(s);
    return s;
  }

  /** Every source cited anywhere in the page (+ the translations and datasets it rests on), known to the registry. */
  private sourceIds(s: Study): string[] {
    const { sourceIds: _prev, generation: _gen, ...rest } = s;
    void _prev;
    void _gen;
    const ids = collectSourceIds(rest, s.passage ? ['bsb'] : []);
    for (const k of s.keyWords) {
      const nt = k.strong.startsWith('G');
      for (const id of nt ? ['stepbible-tagnt', 'stepbible-tbesg'] : ['stepbible-tahot', 'stepbible-tbesh']) if (!ids.includes(id)) ids.push(id);
    }
    return ids.filter((id) => {
      try {
        return Boolean(this.providers.sources.getSource(id));
      } catch {
        return false;
      }
    });
  }

  /** Answer flow: sections already on an existing study count as present (append targets). */
  private adoptExistingSections(): void {
    const s = this.study;
    const has: [PageSection, boolean][] = [
      ['key-passages', (s.topic?.keyPassages.length ?? 0) > 0],
      ['cross-references', s.crossReferences.length > 0],
      ['original-languages', s.keyWords.length > 0],
      ['historical-context', s.context.length > 0],
      ['literary-context', Boolean(s.literary)],
      ['theology', s.theology.length > 0 || s.perspectives.length > 0],
      ['commentary', s.commentary.length > 0],
    ];
    const fromLayout = (s.layout?.sections ?? []).map((x) => x.id).filter((id): id is PageSection => has.some(([p]) => p === id));
    for (const id of fromLayout) if (!this.order.includes(id)) this.order.push(id);
    for (const [id, present] of has) if (present && !this.order.includes(id)) this.order.push(id);
    for (const m of s.layout?.sections ?? []) {
      if ((this.order as SectionId[]).includes(m.id)) this.meta.set(m.id as PageSection, { title: m.title, intro: m.intro });
    }
  }

  get kind(): StudyKind {
    return this.study.kind;
  }

  get passage(): PassageRef | undefined {
    return this.study.passage;
  }

  get summary(): ProvenancedText | undefined {
    return this.study.summary;
  }

  get opening(): ProvenancedText | undefined {
    return this.study.opening;
  }

  get id(): string {
    return this.study.id;
  }
}

function refId(r: PassageRef): string {
  return `${r.book}.${r.startChapter}.${r.startVerse ?? ''}-${r.endChapter ?? ''}.${r.endVerse ?? ''}`;
}

function titleKey(title: string): string {
  return normalizePhrase(title);
}

function mergeBy<T>(existing: readonly T[], incoming: readonly T[], key: (x: T) => string): T[] {
  const seen = new Set(existing.map(key));
  return [...existing, ...incoming.filter((x) => !seen.has(key(x)))];
}

function emptyText(): ProvenancedText {
  return { text: '', provenance: { kind: 'synthesis', verification: 'generated', citations: [] } };
}
