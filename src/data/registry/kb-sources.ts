import type { Author, Source } from '../../domain/models';

/**
 * Sources and authors of the knowledge-base corpora used by the inference layer
 * (topical indexes and Bible dictionaries in kb/corpus, built by `npm run kb:build`).
 * Owned by the kb-core agent.
 *
 * The four reference works are public domain. Their digital text comes from the
 * Christian Classics Ethereal Library (CCEL) ThML editions as distributed in the
 * NEUU datasets, which are licensed CC BY 4.0 — hence the attribution lines.
 * All four are 19th-century works: their scholarship (archaeology, dating,
 * geography, some terminology) is dated in places, and the inference layer must
 * present them as historical reference works, not current scholarship.
 */

const NEUU_TOPICS = 'NEUU Bible Topics Dataset (https://github.com/neuu-org/bible-topics-dataset), CC BY 4.0';
const NEUU_DICTIONARY = 'NEUU Bible Dictionary Dataset (https://github.com/neuu-org/bible-dictionary-dataset), CC BY 4.0';
const CC_BY = 'https://creativecommons.org/licenses/by/4.0/';

export const KB_SOURCES: Source[] = [
  {
    id: 'naves-topical-bible',
    type: 'book',
    title: 'Nave’s Topical Bible',
    authorIds: ['orville-nave'],
    year: '1896',
    edition: 'CCEL electronic edition (ThML), structured in the NEUU Bible Topics Dataset',
    url: 'https://ccel.org/ccel/nave/bible',
    license: {
      status: 'public-domain',
      name: 'Public domain (dataset: CC BY 4.0)',
      url: CC_BY,
      usage: 'full-text',
      attribution: `Nave’s Topical Bible (1896), public domain; digitised by the Christian Classics Ethereal Library (ccel.org); from the ${NEUU_TOPICS}.`,
    },
    description:
      'Orville J. Nave’s index of Bible subjects: each topic lists the passages that bear on it, grouped under sub-headings. A 19th-century work compiled from the King James Version; its headings and emphases reflect their time.',
  },
  {
    id: 'torreys-topical-textbook',
    type: 'book',
    title: 'Torrey’s New Topical Textbook',
    authorIds: ['ra-torrey'],
    year: '1897',
    edition: 'CCEL electronic edition (ThML), structured in the NEUU Bible Topics Dataset',
    url: 'https://ccel.org/ccel/torrey/ttt',
    license: {
      status: 'public-domain',
      name: 'Public domain (dataset: CC BY 4.0)',
      url: CC_BY,
      usage: 'full-text',
      attribution: `Torrey’s New Topical Textbook (1897), public domain; digitised by the Christian Classics Ethereal Library (ccel.org); from the ${NEUU_TOPICS}.`,
    },
    description:
      'R. A. Torrey’s topical concordance of some 600 subjects, each broken into short propositions with supporting references. A 19th-century devotional reference work; its classifications are the compiler’s own.',
  },
  {
    id: 'eastons-bible-dictionary',
    type: 'dictionary',
    title: 'Easton’s Bible Dictionary',
    authorIds: ['mg-easton'],
    year: '1897',
    edition: 'Third edition (1897) of the Illustrated Bible Dictionary (first published 1893), CCEL electronic text',
    url: 'https://ccel.org/ccel/easton/ebd2',
    license: {
      status: 'public-domain',
      name: 'Public domain (dataset: CC BY 4.0)',
      url: CC_BY,
      usage: 'full-text',
      attribution: `Easton’s Bible Dictionary (1897), public domain; digitised by the Christian Classics Ethereal Library (ccel.org); from the ${NEUU_DICTIONARY}.`,
    },
    description:
      'M. G. Easton’s dictionary of biblical people, places, objects and doctrines, written from a 19th-century Scottish Presbyterian standpoint. Useful background, but its archaeology, dating and geography are dated in places.',
  },
  {
    id: 'smiths-bible-dictionary',
    type: 'dictionary',
    title: 'Smith’s Bible Dictionary',
    authorIds: ['william-smith-lexicographer'],
    year: '1863',
    edition:
      'CCEL electronic text (CCEL dates its printed source 1884), the popular one-volume form of William Smith’s Dictionary of the Bible (1860–1863)',
    url: 'https://ccel.org/ccel/smith_w/bibledict',
    license: {
      status: 'public-domain',
      name: 'Public domain (dataset: CC BY 4.0)',
      url: CC_BY,
      usage: 'full-text',
      attribution: `Smith’s Bible Dictionary, public domain; digitised by the Christian Classics Ethereal Library (ccel.org); from the ${NEUU_DICTIONARY}.`,
    },
    description:
      'The popular abridgement of the Victorian Dictionary of the Bible edited by William Smith, with entries on names, places, customs and books. Nineteenth-century scholarship: helpful on names and customs, dated on history and archaeology. In the CCEL text many references lost their book names (e.g. “(24:1-4)”).',
  },
  {
    id: 'emmaus-curated-library',
    type: 'study-notes',
    title: 'Emmaus curated study library',
    authorIds: [],
    year: '2026',
    publisher: 'Emmaus',
    license: { status: 'copyrighted', name: 'Emmaus editorial content', usage: 'summary-only' },
    description:
      'The editorially reviewed studies and topic-index entries bundled with Emmaus (src/data/curated). Each item is synthesis grounded in its own citations; generated pages may build on it but do not quote it as an authority.',
  },
];

export const KB_AUTHORS: Author[] = [
  {
    id: 'orville-nave',
    name: 'Orville J. Nave',
    lifespan: '1841–1917',
    era: 'modern',
    tradition: 'Methodist',
    description: 'American Methodist minister and U.S. Army chaplain, best known for compiling Nave’s Topical Bible (1896).',
    aliases: ['nave', 'orville nave', 'orville j. nave'],
    url: 'https://en.wikipedia.org/wiki/Orville_Nave',
  },
  {
    id: 'ra-torrey',
    name: 'R. A. Torrey',
    lifespan: '1856–1928',
    era: 'modern',
    tradition: 'Evangelical (Congregationalist)',
    description: 'American evangelist, Congregational pastor, educator and writer; compiler of the New Topical Textbook (1897).',
    aliases: ['torrey', 'r. a. torrey', 'r a torrey', 'reuben torrey', 'reuben archer torrey'],
    url: 'https://en.wikipedia.org/wiki/R._A._Torrey',
  },
  {
    id: 'mg-easton',
    name: 'M. G. Easton',
    lifespan: '1823–1894',
    era: 'modern',
    tradition: 'Scottish Presbyterian',
    description:
      'Matthew George Easton, Scottish Presbyterian minister and writer whose Illustrated Bible Dictionary (1893) is known in its later editions as Easton’s Bible Dictionary.',
    aliases: ['easton', 'm. g. easton', 'matthew george easton'],
    url: 'https://en.wikipedia.org/wiki/Matthew_George_Easton',
  },
  {
    id: 'william-smith-lexicographer',
    name: 'William Smith',
    shortName: 'William Smith',
    lifespan: '1813–1893',
    era: 'modern',
    tradition: 'English classical scholar and lexicographer',
    description:
      'Sir William Smith, English lexicographer and editor of classical and biblical reference works, including the Dictionary of the Bible (1860–1863) from which Smith’s Bible Dictionary derives.',
    aliases: ['william smith', 'sir william smith'],
    url: 'https://en.wikipedia.org/wiki/William_Smith_(lexicographer)',
  },
  {
    id: 'tyndale-house-publishers',
    name: 'Tyndale House Publishers',
    shortName: 'Tyndale',
    lifespan: 'founded 1962',
    era: 'contemporary',
    tradition: 'Evangelical (publisher)',
    description:
      'Christian publisher in Carol Stream, Illinois, founded in 1962 by Kenneth N. Taylor; it released the Tyndale Open Study Notes, written by evangelical scholars, under CC BY-SA 4.0.',
    aliases: ['tyndale house', 'tyndale house publishers'],
    url: 'https://en.wikipedia.org/wiki/Tyndale_House',
  },
  {
    id: 'henry-continuators',
    name: 'Continuators of Matthew Henry',
    shortName: 'Henry’s continuators',
    lifespan: 'fl. 1714–1721',
    era: 'post-reformation',
    tradition: 'English Nonconformist',
    description:
      'The Nonconformist ministers who completed Matthew Henry’s Commentary on the Whole Bible (Romans–Revelation) after his death in 1714, working partly from his notes. Used where Emmaus does not record which of them wrote a given book.',
  },
];
