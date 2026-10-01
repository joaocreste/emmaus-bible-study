/**
 * Server-render smoke test for the study sections owned by study-sections-b.
 * Renders each section inside the real StudyUIProvider + ProvidersProvider with a
 * mocked session, and checks the source-grounding rules in the produced HTML.
 * Fixture text is deliberately artificial — it is test data, not content.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { BASE_AUTHORS } from '../../../data/registry/base-authors';
import { BASE_SOURCES } from '../../../data/registry/base-sources';
import type { CommentaryInfo, Provenance, Source, Study } from '../../../domain/models';
import { I18nProvider } from '../../../i18n/I18nProvider';
import type { Locale } from '../../../i18n/locales';
import { ProvidersProvider } from '../../../providers/ProvidersContext';
import type { ProviderRegistry } from '../../../providers/types';
import { keyPointFocus } from '../keyPointFocus';
import { KeyPoints } from '../KeyPoints';
import { CommentarySection } from '../sections/CommentarySection';
import { HistoricalContextSection } from '../sections/HistoricalContextSection';
import { KeyPassagesSection } from '../sections/KeyPassagesSection';
import { LiteraryContextSection } from '../sections/LiteraryContextSection';
import { SourcesSection } from '../sections/SourcesSection';
import { TheologySection } from '../sections/TheologySection';
import { SourcesPanel } from '../SourcesPanel';
import { StudyUIProvider } from '../StudyUIContext';
import type { SectionProps } from '../types';

const session = vi.hoisted(() => ({ study: null as unknown }));

vi.mock('../../../state/session', () => ({
  useSession: () => ({
    study: session.study,
    settings: { translation: 'BSB', fontScale: 1, theme: 'system', showVerseNumbers: true, scriptureMode: 'reader' },
    openInspector: () => {},
    openStudy: async () => {},
    send: async () => {},
    goToSection: () => {},
  }),
  useSessionActions: () => ({
    openInspector: () => {},
    openStudy: async () => undefined,
    send: async () => {},
    goToSection: () => {},
    focusDashboard: () => {},
  }),
}));

const TEST_BOOK: Source = {
  id: 'test-copyrighted-book',
  type: 'book',
  title: 'A Copyrighted Test Book',
  authorIds: ['tim-keller'],
  year: '2000',
  url: 'https://example.org/book',
  license: { status: 'copyrighted', name: '© Test', usage: 'summary-only' },
};
const ALL_SOURCES = [...BASE_SOURCES, TEST_BOOK];

const COMMENTARIES: CommentaryInfo[] = [
  { id: 'calvin', name: 'Calvin', sourceId: 'calvin-commentaries', style: 'classic', testaments: ['OT', 'NT'] },
  { id: 'tyndale', name: 'Tyndale Study Notes', sourceId: 'tyndale-open-study-notes', style: 'notes', testaments: ['OT', 'NT'] },
  { id: 'keil-delitzsch', name: 'Keil & Delitzsch', sourceId: 'keil-delitzsch-commentary', style: 'classic', testaments: ['OT'] },
];

const pending = <T,>() => new Promise<T>(() => {});

const registry = {
  scripture: { id: 'test', listTranslations: () => [], getPassage: pending, getVerseCount: async () => 30 },
  originalText: { id: 'test', getOriginalText: pending },
  lexicon: { id: 'test', getEntry: pending, getEntries: pending, getOccurrences: pending },
  crossReferences: { id: 'test', getCrossReferences: pending },
  commentary: { id: 'test', listCommentaries: () => COMMENTARIES, getCommentary: pending },
  historicalContext: { id: 'test', getBookIntroduction: pending },
  sermons: { id: 'test', findSermons: async () => [] },
  topics: { id: 'test', findTopics: async () => [], listTopics: async () => [] },
  studies: { id: 'test', list: () => [], get: () => undefined, findByPassage: () => undefined, findByTopic: () => undefined },
  sources: {
    getSource: (id: string) => ALL_SOURCES.find((s) => s.id === id),
    getAuthor: (id: string) => BASE_AUTHORS.find((a) => a.id === id),
    allSources: () => ALL_SOURCES,
    allAuthors: () => BASE_AUTHORS,
    findAuthor: () => undefined,
  },
} as unknown as ProviderRegistry;

const syn = (...ids: string[]): Provenance => ({ kind: 'synthesis', verification: 'editorial', citations: ids.map((sourceId) => ({ sourceId })) });

const base: Study = {
  id: 'fixture',
  kind: 'passage',
  depth: 'curated',
  title: 'Fixture study',
  passage: { book: 'ROM', startChapter: 8 },
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
  sourceIds: ['bsb', 'tyndale-open-study-notes'],
};

const curated: Study = {
  ...base,
  context: [
    {
      id: 'ctx-genre',
      category: 'genre',
      title: 'Fixture genre note',
      summary: 'Fixture summary G.',
      tags: [],
      provenance: syn('tyndale-open-study-notes'),
    },
    {
      id: 'ctx-author',
      category: 'authorship',
      title: 'Fixture authorship note',
      summary: 'Fixture summary A.',
      detail: 'Fixture detail A.',
      relatedVerses: [{ book: 'ROM', chapter: 8, verse: 1 }],
      tags: [],
      provenance: { kind: 'historical', verification: 'editorial', citations: [{ sourceId: 'tyndale-open-study-notes' }] },
    },
  ],
  literary: {
    placeInBook: { text: 'Fixture place in book.', provenance: syn('bsb') },
    argument: { text: 'Fixture argument.', provenance: syn('bsb') },
    bookOutline: [
      { label: 'Fixture opening', ref: { book: 'ROM', startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 17 } },
      { label: 'Fixture middle', ref: { book: 'ROM', startChapter: 6, endChapter: 8 }, current: true },
      { label: 'Fixture end', ref: { book: 'ROM', startChapter: 9, endChapter: 16 } },
    ],
    passageOutline: [{ label: 'Fixture outline one', ref: { book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 4 } }],
    features: [
      {
        id: 'lit-chiasm',
        type: 'chiasm',
        title: 'Fixture chiasm',
        description: 'Some interpreters see a fixture.',
        structure: [
          { label: 'A', text: 'Fixture outer', level: 0 },
          { label: 'B', text: 'Fixture inner', level: 1 },
          { label: 'C', text: 'Fixture centre line', level: 2 },
          { label: 'B′', text: 'Fixture inner again', level: 1 },
          { label: 'A′', text: 'Fixture outer again', level: 0 },
        ],
        tags: [],
        provenance: { kind: 'literary', verification: 'editorial', citations: [] },
      },
    ],
  },
  theology: [
    {
      id: 'th-grace',
      category: 'grace',
      title: 'Fixture theme',
      summary: 'Fixture theme summary.',
      detail: 'Fixture theme detail.',
      keyVerses: [{ book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 1 }],
      tags: [],
      provenance: syn('calvin-commentaries'),
    },
  ],
  perspectives: [
    {
      id: 'ps-1',
      question: 'Fixture question?',
      consensus: 'denominational',
      intro: 'Fixture intro.',
      perspectives: [
        { id: 'p-a', tradition: 'Tradition A', label: 'Position A', summary: 'Fixture A.', representatives: ['calvin'], provenance: syn() },
        { id: 'p-b', tradition: 'Tradition B', label: 'Position B', summary: 'Fixture B.', representatives: ['wesley'], provenance: syn() },
      ],
      commonGround: 'Fixture common ground.',
      tags: [],
      provenance: syn(),
    },
  ],
  commentary: [
    {
      id: 'cm-quote',
      authorId: 'calvin',
      sourceId: 'calvin-commentaries',
      kind: 'quotation',
      text: 'FIXTURE VERIFIED WORDS',
      locator: 'on Rom 8:1',
      tags: [],
      provenance: { kind: 'quotation', verification: 'verified', citations: [{ sourceId: 'calvin-commentaries', locator: 'on Rom 8:1' }] },
    },
    {
      id: 'cm-summary',
      authorId: 'tim-keller',
      sourceId: 'test-copyrighted-book',
      kind: 'summary',
      text: 'FIXTURE SUMMARY TEXT',
      tags: [],
      provenance: { kind: 'summary', verification: 'editorial', citations: [{ sourceId: 'test-copyrighted-book', locator: 'ch. 1' }] },
    },
    {
      id: 'cm-unverified',
      authorId: 'spurgeon',
      sourceId: 'matthew-henry-commentary',
      kind: 'quotation',
      text: 'FIXTURE UNVERIFIED WORDS',
      tags: [],
      provenance: { kind: 'quotation', verification: 'unverified', citations: [] },
    },
    {
      id: 'cm-withheld',
      authorId: 'tim-keller',
      sourceId: 'test-copyrighted-book',
      kind: 'quotation',
      text: 'FIXTURE COPYRIGHTED WORDS',
      tags: [],
      provenance: { kind: 'quotation', verification: 'verified', citations: [{ sourceId: 'test-copyrighted-book' }] },
    },
  ],
  sermons: [{ id: 'sm-1', authorId: 'spurgeon', title: 'Fixture sermon', date: '1860', refs: [], topics: [], sourceId: 'bsb' }],
  sourceIds: ['bsb', 'tyndale-open-study-notes', 'calvin-commentaries', 'test-copyrighted-book', 'missing-source-id'],
};

const topic: Study = {
  ...base,
  kind: 'topic',
  passage: undefined,
  topic: {
    name: 'Fixture topic',
    question: 'What does the fixture say?',
    definition: { text: 'Fixture definition.', provenance: syn('bsb') },
    keyPassages: [
      { id: 'kp-1', ref: { book: 'GEN', startChapter: 1 }, title: 'Fixture KP one', note: { text: 'Note one.', provenance: syn() }, group: 'Group one', tags: [] },
      { id: 'kp-2', ref: { book: 'ROM', startChapter: 3 }, title: 'Fixture KP two', note: { text: 'Note two.', provenance: syn() }, group: 'Group two', tags: [] },
    ],
  },
};

const library: Study = { ...base, depth: 'library' };

function render(Section: (p: SectionProps) => unknown, study: Study, locale: Locale = 'en'): string {
  const S = Section as (p: SectionProps) => React.ReactElement;
  return renderToStaticMarkup(
    <I18nProvider locale={locale}>
      <ProvidersProvider registry={registry}>
        <StudyUIProvider study={study} focus={null} focusSeq={0}>
          <S study={study} index={3} />
        </StudyUIProvider>
      </ProvidersProvider>
    </I18nProvider>,
  );
}

const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('key points (server render)', () => {
  const point: Study['concepts'][number] = {
    id: 'concept-1',
    label: 'Fixture point: may the wronged spouse separate?',
    aliases: ['fixture point'],
    answer: { text: 'Fixture answer to the point.', provenance: { ...syn(), verification: 'generated' } },
    primarySection: 'theology',
    verses: [{ book: 'ROM', chapter: 3, verse: 1 }],
    keyWordIds: [],
    crossReferenceIds: ['x-1'],
    contextIds: [],
    themeIds: ['th-1'],
    perspectiveSetIds: [],
    commentaryIds: [],
  };

  it('lists the concepts of a generated page as its key points, collapsed, with their answers', () => {
    const html = renderToStaticMarkup(
      <I18nProvider locale="pt">
        <ProvidersProvider registry={registry}>
          <KeyPoints study={{ ...topic, depth: 'generated', concepts: [point] }} />
        </ProvidersProvider>
      </I18nProvider>,
    );
    expect(text(html)).toContain('Pontos-chave');
    expect(html).toMatch(/aria-expanded="false"/);
    expect(text(html)).toContain('Fixture point: may the wronged spouse separate?');
    expect(text(html)).toContain('Fixture answer to the point.');
    expect(text(html)).toContain('Mostrar no estudo');
  });

  it('shows nothing for curated and library studies', () => {
    for (const depth of ['curated', 'library'] as const) {
      expect(renderToStaticMarkup(<I18nProvider locale="en"><KeyPoints study={{ ...topic, depth, concepts: [point] }} /></I18nProvider>)).toBe('');
    }
  });

  it('focuses the section and the items a key point links', () => {
    expect(keyPointFocus(point, 'why')).toEqual({
      section: 'theology',
      highlightVerses: [{ book: 'ROM', chapter: 3, verse: 1 }],
      expandIds: ['th-1'],
      pinIds: ['x-1'],
      crossReferenceFilter: {},
      reason: 'why',
    });
  });
});

describe('study sections (server render)', () => {
  it('key passages: orientation, groups, actions', () => {
    const html = text(render(KeyPassagesSection, topic));
    expect(html).toContain('What does the fixture say?');
    expect(html).toContain('Group one');
    expect(html).toContain('Group two');
    expect(html).toContain('Genesis 1');
    expect(html).toContain('Read the passage');
    expect(html).toContain('Study this passage');
    expect(html).toContain('Study synthesis');
  });

  it('historical context: category order, details collapsed, book introduction', () => {
    const raw = render(HistoricalContextSection, curated);
    const html = text(raw);
    expect(html.indexOf('Fixture authorship note')).toBeLessThan(html.indexOf('Fixture genre note'));
    expect(html).toContain('Authorship');
    expect(html).toContain('Introduction to Romans');
    expect(raw).toMatch(/aria-expanded="false"/);
    expect(text(render(HistoricalContextSection, library))).toContain('No curated context for this passage yet');
  });

  it('literary context: outline bar, chiasm ladder with centre, canon position', () => {
    const raw = render(LiteraryContextSection, curated);
    const html = text(raw);
    expect(html).toContain('Romans is the 6th book of the New Testament, first of the thirteen Pauline letters.');
    expect(raw).toContain('aria-current="true"');
    expect(html).toContain('Fixture centre line');
    expect(html).toContain('Centre');
    expect(html).toContain('A proposed arrangement');
    const lib = text(render(LiteraryContextSection, library));
    expect(lib).toContain('No curated literary analysis for this passage yet');
    expect(lib).toContain('Book 45 of 66 (Protestant order)');
  });

  it('theology: themes, consensus badge, equal tradition panels, common ground', () => {
    const raw = render(TheologySection, curated);
    const html = text(raw);
    expect(html).toContain('Doctrines in the text');
    expect(html).toContain('Denominational difference');
    expect(html).toContain('Tradition A');
    expect(html).toContain('Tradition B');
    expect(html).toContain('Common ground');
    expect(raw).toContain('aria-pressed="true"');
    expect(html).toContain('John Calvin');
  });

  it('commentary: quotation marks only for verified, permitted words', () => {
    const raw = render(CommentarySection, curated);
    const html = text(raw);
    expect(html).toContain('“FIXTURE VERIFIED WORDS”');
    expect(html).toMatch(/— John Calvin, .*Calvin’s Commentaries.*, on Rom 8:1/);
    expect(html).toContain('Summary of A Copyrighted Test Book (2000)');
    expect(html).not.toContain('“FIXTURE SUMMARY TEXT');
    expect(html).toContain('Unverified.');
    expect(html).not.toContain('“FIXTURE UNVERIFIED WORDS');
    expect(html).not.toContain('FIXTURE COPYRIGHTED WORDS');
    expect(html).toContain('permits summaries only');
    // classic commentaries: study notes first, OT-only commentaries hidden for Romans
    expect(raw).toContain('role="tablist"');
    const tabs = [...raw.matchAll(/role="tab"[^>]*>(?:<[^>]+>)*([^<]+)/g)].map((m) => m[1]);
    expect(tabs).toEqual(['Tyndale Study Notes', 'Calvin']);
    expect(html).toContain('Fixture sermon');
    const lib = text(render(CommentarySection, library));
    expect(lib).toContain('No curated voices for this passage yet');
    expect(lib).toContain('Classic commentaries');
  });

  it('sources: grouped bibliography, licenses, usage, legend, missing ids', () => {
    const html = text(render(SourcesSection, curated));
    expect(html).toContain('Scripture &amp; original text');
    expect(html).toContain('Study notes &amp; commentaries');
    expect(html).toContain('Books');
    expect(html).toContain('Summarised only — wording not reproduced');
    expect(html).toContain('Open license · CC BY-SA 4.0');
    expect(html).toContain('Cited in 2 places — Commentary');
    expect(html).toContain('Cited in 3 places — Literary, Sermons');
    expect(html).toContain('Not found in the source registry');
    expect(html).toContain('missing-source-id');
    expect(html).toContain('How to read the labels');
    expect(html).toContain('Open dataset');
    expect(html).toMatch(/claim .*source .*author .*work .*location .*link/);
  });

  it('sources panel works outside the workspace, with and without a study', () => {
    session.study = null;
    const empty = text(renderToStaticMarkup(<ProvidersProvider registry={registry}><SourcesPanel /></ProvidersProvider>));
    expect(empty).toContain('No study open yet');
    session.study = curated;
    const full = text(renderToStaticMarkup(<ProvidersProvider registry={registry}><SourcesPanel /></ProvidersProvider>));
    expect(full).toContain('Fixture study');
    expect(full).toContain('How to read the labels');
  });
});

/** A localized edition: a verified quotation carries a free translation beneath its original words. */
const localized: Study = {
  ...curated,
  commentary: curated.commentary.map((e) => (e.id === 'cm-quote' ? { ...e, translatedText: 'PALAVRAS TRADUZIDAS DA FIXTURE' } : e)),
};

describe('study sections in other languages (server render)', () => {
  it('commentary (pt): verified words stay verbatim, the free translation is labelled, labels are Portuguese', () => {
    const raw = render(CommentarySection, localized, 'pt');
    const html = text(raw);
    expect(html).toContain('“FIXTURE VERIFIED WORDS”');
    expect(html).toContain('Tradução livre — não verificada');
    expect(html).toContain('PALAVRAS TRADUZIDAS DA FIXTURE');
    expect(html).not.toContain('“PALAVRAS TRADUZIDAS');
    expect(raw).toMatch(/<blockquote[^>]*lang="en"/);
    expect(html).toContain('Resumo de A Copyrighted Test Book (2000)');
    expect(html).toContain('Não verificado.');
    expect(html).toContain('só permite resumos');
    expect(html).toContain('Vozes da tradição');
    expect(html).toContain('Comentários clássicos');
    for (const english of ['Read source', 'Summary of', 'Unverified.', 'Classic commentaries', 'Voices from the tradition']) {
      expect(html).not.toContain(english);
    }
  });

  it('the free translation is shown only for a verified quotation, and English pages are unchanged', () => {
    expect(text(render(CommentarySection, localized, 'en'))).toContain('Free translation — not verified');
    expect(text(render(CommentarySection, curated, 'pt'))).not.toContain('Tradução livre');
  });

  it('sources (pt): licenses, usage, legend and the "in English" explanation', () => {
    const html = text(render(SourcesSection, curated, 'pt'));
    expect(html).toContain('Escritura e texto original');
    expect(html).toContain('Licença aberta · CC BY-SA 4.0');
    expect(html).toContain('Apenas resumida — o texto não é reproduzido');
    expect(html).toContain('Citada em 2 lugares — Comentários');
    expect(html).toContain('Não encontradas no registro de fontes');
    expect(html).toContain('Como ler os rótulos');
    expect(html).toContain('Base de dados aberta');
    expect(html).toContain('(em inglês)');
    expect(html).toContain('tradução livre');
    expect(html).not.toContain('How to read the labels');
  });

  it('literary (fr): canon sentence, chiasm and outline labels in French', () => {
    const html = text(render(LiteraryContextSection, curated, 'fr'));
    expect(html).toMatch(/ est le 6e livre du Nouveau Testament, la première des treize épîtres pauliniennes\./);
    expect(html).toContain('Une disposition proposée');
    expect(html).toContain('Chiasme');
    expect(html).toContain('Ce passage');
    expect(html).toContain('Chap. 6–8');
    const lib = text(render(LiteraryContextSection, library, 'fr'));
    expect(lib).toContain('Livre 45 sur 66 (ordre protestant)');
    expect(lib).toContain('Traditionnellement attribué à Paul');
  });

  it('theology (es) and key passages (es)', () => {
    const th = text(render(TheologySection, curated, 'es'));
    expect(th).toContain('Doctrinas en el texto');
    expect(th).toContain('Diferencia confesional');
    expect(th).toContain('Gracia');
    expect(th).toContain('Terreno común');
    expect(th).toContain('2 posturas, cada una con sus propias palabras');
    const kp = text(render(KeyPassagesSection, topic, 'es'));
    expect(kp).toContain('Leer el pasaje');
    expect(kp).toContain('Estudiar este pasaje');
    expect(kp).toContain('Síntesis del estudio');
  });

  it('historical context (fr): categories, and the Tyndale introduction marked as English', () => {
    const html = text(render(HistoricalContextSection, curated, 'fr'));
    expect(html).toContain('Auteur');
    expect(html).toContain('Introduction au livre');
    expect(html).toContain('(en anglais)');
    expect(html).toContain('Versets');
    expect(html).toContain('Lire la suite');
  });
});

