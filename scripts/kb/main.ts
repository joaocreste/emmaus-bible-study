/**
 * Knowledge-base corpus build (see scripts/kb/build.ts for the entry point).
 *
 *   npm run kb:build                    # download (cached) + write kb/corpus/{naves,torrey,easton,smith}.json
 *   npm run kb:build -- --offline       # use .kb-cache/downloads only
 *   npm run kb:build -- --refresh       # re-download the source archives
 *   npm run kb:build -- --only=naves,easton
 *
 * The confession/catechism corpora (kb/corpus/confessions-*.json, catholic-encyclopedia.json)
 * are produced by scripts/kb/confessions and are not touched here.
 */
import { buildDictionaryCorpus, parseDictionaryXml, type DictionarySpec } from './dictionaries.ts';
import { download, loadVerseCounts, log, newRefStats, opts, writeCorpus } from './lib/io.ts';
import { readTarGz } from './lib/tar.ts';
import { buildTopicCorpus, parseTopicXml, type TopicCorpusSpec } from './topics.ts';

const TOPICS_REPO = 'https://github.com/neuu-org/bible-topics-dataset';
const DICTIONARY_REPO = 'https://github.com/neuu-org/bible-dictionary-dataset';
const tarball = (repo: string) => `${repo.replace('https://github.com/', 'https://codeload.github.com/')}/tar.gz/refs/heads/main`;

const CORPORA = ['naves', 'torrey', 'easton', 'smith'] as const;
type CorpusId = (typeof CORPORA)[number];

function parseArgs(argv: string[]): { only: CorpusId[] } {
  let only: CorpusId[] = [...CORPORA];
  for (const arg of argv) {
    const [k, v] = arg.replace(/^--/, '').split('=');
    if (k === 'offline') opts.offline = true;
    else if (k === 'refresh') opts.refresh = true;
    else if (k === 'only' && v) {
      only = v.split(',').map((s) => s.trim()) as CorpusId[];
      for (const id of only) if (!CORPORA.includes(id)) throw new Error(`unknown corpus "${id}" (corpora: ${CORPORA.join(', ')})`);
    } else if (k === 'help' || k === 'h') {
      console.log('usage: node scripts/kb/build.ts [--only=naves,torrey,easton,smith] [--offline] [--refresh]');
      process.exit(0);
    } else throw new Error(`unknown option ${arg}`);
  }
  return { only };
}

function attributionNote(dataset: string, commit: string | undefined): string {
  return `${dataset} by NEUU (https://github.com/neuu-org), CC BY 4.0${commit ? ` (commit ${commit.slice(0, 12)})` : ''}; digitisation of the source texts: Christian Classics Ethereal Library (CCEL)`;
}

export async function main(argv: string[]): Promise<void> {
  const started = Date.now();
  const { only } = parseArgs(argv);
  const counts = await loadVerseCounts();
  const retrieved = new Date().toISOString().slice(0, 10);
  const report: Record<string, unknown> = {};

  if (only.includes('naves') || only.includes('torrey')) {
    const archive = readTarGz(await download(tarball(TOPICS_REPO), 'bible-topics-dataset-main.tar.gz'), (p) => p.startsWith('data/00_raw/xml/') || p === 'NOTICE');
    const origin = (file: string) => ({
      url: `${TOPICS_REPO}/blob/main/data/00_raw/xml/${file}`,
      license: `Public-domain work; ${attributionNote('Bible Topics Dataset', archive.commit)}`,
      retrieved,
    });
    const specs: (TopicCorpusSpec & { file: string; out: string })[] = [
      {
        id: 'naves',
        file: 'nave_bible.xml',
        out: 'naves.json',
        label: 'Nave’s Topical Bible (1896)',
        sourceId: 'naves-topical-bible',
        authorId: 'orville-nave',
        urlFor: (term, letter) => `https://www.ccel.org/ccel/nave/bible.${letter}.html?term=${encodeURIComponent(term.toLowerCase()).replace(/%20/g, '+')}`,
        origin: origin('nave_bible.xml'),
      },
      {
        id: 'torrey',
        file: 'torrey_ttt.xml',
        out: 'torrey.json',
        label: 'Torrey’s New Topical Textbook (1897)',
        sourceId: 'torreys-topical-textbook',
        authorId: 'ra-torrey',
        urlFor: (term, letter) => `https://www.ccel.org/ccel/torrey/ttt.${letter}.html?term=${encodeURIComponent(term.toLowerCase()).replace(/%20/g, '+')}`,
        origin: origin('torrey_ttt.xml'),
      },
    ];
    for (const spec of specs) {
      if (!only.includes(spec.id)) continue;
      const xml = archive.files.get(`data/00_raw/xml/${spec.file}`);
      if (!xml) throw new Error(`${spec.file} missing from the bible-topics-dataset archive`);
      const refStats = newRefStats();
      const raw = parseTopicXml(xml.toString('utf8'), refStats);
      const { corpus, stats } = buildTopicCorpus(raw, spec, counts, refStats);
      const bytes = await writeCorpus(spec.out, corpus);
      report[spec.id] = { ...stats, bytes };
      log(`wrote kb/corpus/${spec.out} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
    }
  }

  if (only.includes('easton') || only.includes('smith')) {
    const archive = readTarGz(await download(tarball(DICTIONARY_REPO), 'bible-dictionary-dataset-main.tar.gz'), (p) => p.startsWith('data/00_raw/ccel/xml/'));
    const origin = (file: string) => ({
      url: `${DICTIONARY_REPO}/blob/main/data/00_raw/ccel/xml/${file}`,
      license: `Public-domain work; ${attributionNote('Bible Dictionary Dataset', archive.commit)}`,
      retrieved,
    });
    const specs: (DictionarySpec & { file: string; out: string })[] = [
      {
        id: 'easton',
        file: 'easton_ebd2.xml',
        out: 'easton.json',
        label: 'Easton’s Bible Dictionary (1897)',
        sourceId: 'eastons-bible-dictionary',
        authorId: 'mg-easton',
        urlFor: (term) => `https://www.ccel.org/ccel/easton/ebd2.html?term=${encodeURIComponent(term)}`,
        origin: origin('easton_ebd2.xml'),
      },
      {
        id: 'smith',
        file: 'smith_bibledict.xml',
        out: 'smith.json',
        label: 'Smith’s Bible Dictionary (1863)',
        sourceId: 'smiths-bible-dictionary',
        authorId: 'william-smith-lexicographer',
        urlFor: (term, letter) => `https://www.ccel.org/ccel/smith_w/bibledict.${letter}.html?term=${encodeURIComponent(term.toLowerCase())}`,
        origin: origin('smith_bibledict.xml'),
      },
    ];
    for (const spec of specs) {
      if (!only.includes(spec.id)) continue;
      const xml = archive.files.get(`data/00_raw/ccel/xml/${spec.file}`);
      if (!xml) throw new Error(`${spec.file} missing from the bible-dictionary-dataset archive`);
      const refStats = newRefStats();
      const raw = parseDictionaryXml(xml.toString('utf8'), refStats, spec.id === 'easton');
      const { corpus, stats } = buildDictionaryCorpus(raw, spec, counts, refStats);
      const bytes = await writeCorpus(spec.out, corpus);
      report[spec.id] = { ...stats, bytes };
      log(`wrote kb/corpus/${spec.out} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
    }
  }

  log(`done in ${((Date.now() - started) / 1000).toFixed(1)} s`);
  console.log(JSON.stringify(report, null, 2));
}
