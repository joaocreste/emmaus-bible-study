/**
 * TEST FIXTURES — in-memory dataset providers for engine tests. Verse texts are
 * Berean Standard Bible (public domain); commentary/introduction texts are
 * placeholders marked "[fixture]".
 */
import type {
  BookIntroduction,
  CommentaryInfo,
  CommentarySection,
  CuratedStudy,
  CuratedTopic,
  DatasetCrossReference,
  LexiconEntry,
  Occurrences,
  OriginalVerse,
  Passage,
  PassageRef,
  TranslationId,
  Verse,
} from '../../../domain/models';
import { formatRef, refIncludesVerse, refsOverlap } from '../../../domain/reference';
import { createCuratedProvidersFrom } from '../../../providers/curated';
import type { ProviderRegistry } from '../../../providers/types';
import { FIXTURE_STUDIES, FIXTURE_TOPICS } from './studies';

const v = (book: string, chapter: number, verse: number, text: string): Verse => ({ ref: { book, chapter, verse }, text });

export const VERSES: Verse[] = [
  v('ROM', 8, 1, 'Therefore, there is now no condemnation for those who are in Christ Jesus.'),
  v('ROM', 8, 2, 'For in Christ Jesus the law of the Spirit of life set you free from the law of sin and death.'),
  v('ROM', 8, 3, 'For what the law was powerless to do in that it was weakened by the flesh, God did by sending His own Son in the likeness of sinful man, as an offering for sin. He thereby condemned sin in the flesh,'),
  v('ROM', 8, 4, 'so that the righteous standard of the law might be fully satisfied in us, who do not walk according to the flesh but according to the Spirit.'),
  v('ROM', 8, 12, 'Therefore, brothers, we have an obligation, but it is not to the flesh, to live according to it.'),
  v('ROM', 8, 15, 'For you did not receive a spirit of slavery that returns you to fear, but you received the Spirit of sonship, by whom we cry, “Abba! Father!”'),
  v('ROM', 8, 28, 'And we know that God works all things together for the good of those who love Him, who are called according to His purpose.'),
  v('MAT', 5, 3, 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.'),
  v('MAT', 5, 4, 'Blessed are those who mourn, for they will be comforted.'),
];

const ORIGINAL: OriginalVerse[] = [
  {
    ref: { book: 'ROM', chapter: 8, verse: 1 },
    language: 'greek',
    sourceId: 'stepbible-tagnt',
    words: [
      { index: 0, surface: 'Οὐδὲν', strong: 'G3762', gloss: 'no', morph: 'A-NSN', language: 'greek' },
      { index: 1, surface: 'ἄρα', strong: 'G686', gloss: 'therefore', morph: 'PRT', language: 'greek' },
      { index: 2, surface: 'νῦν', strong: 'G3568', gloss: 'now', morph: 'ADV', language: 'greek' },
      { index: 3, surface: 'κατάκριμα', strong: 'G2631', gloss: 'condemnation', morph: 'N-NSN', language: 'greek' },
    ],
  },
  {
    ref: { book: 'ROM', chapter: 8, verse: 2 },
    language: 'greek',
    sourceId: 'stepbible-tagnt',
    words: [
      { index: 0, surface: 'ὁ', strong: 'G3588', gloss: 'the', morph: 'T-NSM', language: 'greek' },
      { index: 1, surface: 'νόμος', strong: 'G3551', gloss: 'law', morph: 'N-NSM', transliteration: 'nomos', language: 'greek' },
      { index: 2, surface: 'πνεύματος', strong: 'G4151', gloss: 'of Spirit', morph: 'N-GSN', language: 'greek' },
    ],
  },
  {
    ref: { book: 'ROM', chapter: 8, verse: 3 },
    language: 'greek',
    sourceId: 'stepbible-tagnt',
    words: [{ index: 0, surface: 'σαρκός', strong: 'G4561', gloss: 'flesh', morph: 'N-GSF', language: 'greek' }],
  },
];

const LEXICON: LexiconEntry[] = [
  { strong: 'G2631', language: 'greek', lemma: 'κατάκριμα', transliteration: 'katakrima', gloss: 'condemnation', definition: '[fixture] condemnation, punishment following sentence', sourceId: 'stepbible-tbesg' },
  { strong: 'G3551', language: 'greek', lemma: 'νόμος', transliteration: 'nomos', gloss: 'law', definition: '[fixture] <b>law</b>, custom; <br/>the Mosaic law', sourceId: 'stepbible-tbesg' },
  { strong: 'G4561', language: 'greek', lemma: 'σάρξ', transliteration: 'sarx', gloss: 'flesh', definition: '[fixture] flesh', sourceId: 'stepbible-tbesg' },
];

const OCCURRENCES: Record<string, number> = { G2631: 3, G3551: 194, G4561: 147 };

const XREFS: DatasetCrossReference[] = [
  { from: { book: 'ROM', chapter: 8, verse: 1 }, target: { book: 'ROM', startChapter: 5, startVerse: 1, endChapter: 5, endVerse: 1 }, score: 55, sourceId: 'openbible-xrefs' },
  { from: { book: 'ROM', chapter: 8, verse: 28 }, target: { book: 'GEN', startChapter: 50, startVerse: 20, endChapter: 50, endVerse: 20 }, score: 80, sourceId: 'openbible-xrefs' },
  { from: { book: 'ROM', chapter: 8, verse: 28 }, target: { book: 'EPH', startChapter: 1, startVerse: 11, endChapter: 1, endVerse: 11 }, score: 60, sourceId: 'openbible-xrefs' },
  { from: { book: 'MAT', chapter: 5, verse: 3 }, target: { book: 'LUK', startChapter: 6, startVerse: 20, endChapter: 6, endVerse: 20 }, score: 90, sourceId: 'openbible-xrefs' },
  { from: { book: 'MAT', chapter: 5, verse: 3 }, target: { book: 'ISA', startChapter: 57, startVerse: 15, endChapter: 57, endVerse: 15 }, score: 40, sourceId: 'openbible-xrefs' },
  { from: { book: 'MAT', chapter: 5, verse: 4 }, target: { book: 'ISA', startChapter: 61, startVerse: 2, endChapter: 61, endVerse: 3 }, score: 70, sourceId: 'openbible-xrefs' },
];

const COMMENTARIES: CommentaryInfo[] = [
  { id: 'tyndale', name: 'Tyndale Open Study Notes', sourceId: 'tyndale-open-study-notes', style: 'notes', testaments: ['OT', 'NT'] },
  { id: 'calvin', name: 'Calvin’s Commentaries', sourceId: 'calvin-commentaries', style: 'classic', testaments: ['OT', 'NT'] },
  { id: 'matthew-henry', name: 'Matthew Henry’s Commentary', sourceId: 'matthew-henry-commentary', style: 'classic', testaments: ['OT', 'NT'] },
];

const SECTIONS: CommentarySection[] = [
  { commentaryId: 'tyndale', ref: { book: 'ROM', startChapter: 8, startVerse: 12, endChapter: 8, endVerse: 13 }, text: '[fixture] Tyndale note on Romans 8:12–13. Believers owe nothing to the flesh.', sourceId: 'tyndale-open-study-notes' },
  { commentaryId: 'tyndale', ref: { book: 'MAT', startChapter: 5, startVerse: 3, endChapter: 5, endVerse: 3 }, text: '[fixture] Tyndale note on Matthew 5:3.', sourceId: 'tyndale-open-study-notes' },
  { commentaryId: 'matthew-henry', ref: { book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 4 }, text: '[fixture] Matthew Henry on Romans 8:1–4.', sourceId: 'matthew-henry-commentary' },
];

const INTROS: BookIntroduction[] = [
  { book: 'ROM', text: '[fixture] First paragraph of the introduction to Romans, long enough to be a paragraph.\n\nSecond paragraph.', sourceId: 'tyndale-open-study-notes' },
  { book: 'MAT', text: '[fixture] First paragraph of the introduction to Matthew, long enough to be a paragraph.', sourceId: 'tyndale-open-study-notes' },
];

const VERSE_COUNTS: Record<string, number> = { 'ROM.8': 39, 'ROM.5': 21, 'MAT.5': 48, 'MAT.6': 34, 'MAT.7': 29, 'JHN.3': 36, 'PHP.4': 23 };

function passageOf(ref: PassageRef, translation: TranslationId): Passage {
  const verses = VERSES.filter((x) => refIncludesVerse(ref, x.ref));
  const chapters = Array.from(new Set(verses.map((x) => x.ref.chapter))).map((chapter) => ({ chapter, verses: verses.filter((x) => x.ref.chapter === chapter) }));
  return { ref, label: formatRef(ref), translation, chapters, sourceId: translation.toLowerCase() };
}

export interface FakeOptions {
  studies?: CuratedStudy[];
  topics?: CuratedTopic[];
  /** make every dataset provider throw (to test resilience) */
  failing?: boolean;
}

/** A complete ProviderRegistry over the fixtures. */
export function createFakeProviders(opts: FakeOptions = {}): ProviderRegistry {
  const fail = () => {
    if (opts.failing) throw new Error('dataset unavailable');
  };
  const curated = createCuratedProvidersFrom({ studies: opts.studies ?? FIXTURE_STUDIES, topics: opts.topics ?? FIXTURE_TOPICS });
  return {
    ...curated,
    scripture: {
      id: 'fake:scripture',
      listTranslations: () => [],
      getPassage: async (ref, translation) => (fail(), passageOf(ref, translation)),
      getVerseCount: async (book, chapter) => (fail(), VERSE_COUNTS[`${book}.${chapter}`] ?? 30),
    },
    originalText: {
      id: 'fake:original',
      getOriginalText: async (ref) => (fail(), ORIGINAL.filter((o) => refIncludesVerse(ref, o.ref))),
    },
    lexicon: {
      id: 'fake:lexicon',
      getEntry: async (strong) => (fail(), LEXICON.find((e) => e.strong === strong.toUpperCase()) ?? null),
      getEntries: async (strongs) => (fail(), new Map(LEXICON.filter((e) => strongs.includes(e.strong)).map((e) => [e.strong, e]))),
      getOccurrences: async (strong): Promise<Occurrences | null> =>
        (fail(), OCCURRENCES[strong] != null ? { strong, total: OCCURRENCES[strong], refs: [], sourceId: 'stepbible-tagnt' } : null),
    },
    crossReferences: {
      id: 'fake:xrefs',
      getCrossReferences: async (ref) => (fail(), XREFS.filter((x) => refIncludesVerse(ref, x.from))),
    },
    commentary: {
      id: 'fake:commentary',
      listCommentaries: () => COMMENTARIES,
      getCommentary: async (id, ref) => (fail(), SECTIONS.filter((s) => s.commentaryId === id && refsOverlap(s.ref, ref))),
    },
    historicalContext: {
      id: 'fake:context',
      getBookIntroduction: async (book) => (fail(), INTROS.find((i) => i.book === book) ?? null),
    },
  };
}

/** Dataset providers that return nothing — for tests over the real curated library. */
export function createEmptyDatasetProviders(): Omit<ProviderRegistry, 'studies' | 'sources' | 'sermons' | 'topics'> {
  return {
    scripture: { id: 'empty:scripture', listTranslations: () => [], getPassage: async (ref, translation) => ({ ref, label: formatRef(ref), translation, chapters: [], sourceId: 'bsb' }), getVerseCount: async () => 0 },
    originalText: { id: 'empty:original', getOriginalText: async () => [] },
    lexicon: { id: 'empty:lexicon', getEntry: async () => null, getEntries: async () => new Map(), getOccurrences: async () => null },
    crossReferences: { id: 'empty:xrefs', getCrossReferences: async () => [] },
    commentary: { id: 'empty:commentary', listCommentaries: () => [], getCommentary: async () => [] },
    historicalContext: { id: 'empty:context', getBookIntroduction: async () => null },
  };
}
