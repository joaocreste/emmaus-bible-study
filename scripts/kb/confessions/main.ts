/**
 * Confessions knowledge-base build: runs every document builder, validates the chunks and
 * writes one CorpusFile per tradition (see scripts/kb/confessions/build.ts for usage).
 *
 * Output is deterministic for a given download cache: documents keep source order, keys are
 * written in a fixed order, and `origin.retrieved` is the date recorded in the cache sidecars.
 */
import type { EvidenceKind } from '../../../src/inference/protocol.ts';
import { validateDocuments, writeCorpus, type KbDocument, type Part } from './lib/corpus.ts';
import { latestRetrieved, netOptions } from './lib/net.ts';
/**
 * Source modules are imported lazily so one missing or broken module only fails its own corpus.
 */
type Builder = () => Promise<Part>;
const lazy = (path: string, name: string): Builder => async () => {
  const mod = (await import(path)) as Record<string, Builder>;
  const fn = mod[name];
  if (typeof fn !== 'function') throw new Error(`${path} does not export ${name}`);
  return fn();
};
const buildEcumenical = lazy('./sources/ecumenical.ts', 'buildEcumenical');
const buildWestminster = lazy('./sources/westminster.ts', 'buildWestminster');
const buildHeidelberg = lazy('./sources/reformed-schaff.ts', 'buildHeidelberg');
const buildBelgic = lazy('./sources/reformed-schaff.ts', 'buildBelgic');
const buildDort = lazy('./sources/reformed-schaff.ts', 'buildDort');
const buildRemonstrance = lazy('./sources/remonstrance.ts', 'buildRemonstrance');
const buildLutheran = lazy('./sources/lutheran.ts', 'buildLutheran');
const buildThirtyNineArticles = lazy('./sources/anglican.ts', 'buildThirtyNineArticles');
const buildTrent = lazy('./sources/trent.ts', 'buildTrent');
const buildRomanCatechism = lazy('./sources/roman-catechism.ts', 'buildRomanCatechism');
const buildPhilaret = lazy('./sources/philaret.ts', 'buildPhilaret');
const buildDositheus = lazy('./sources/dositheus.ts', 'buildDositheus');
const buildMethodist = lazy('./sources/methodist.ts', 'buildMethodist');
const buildWesleySermons = lazy('./sources/wesley.ts', 'buildWesleySermons');
const buildBaptist = lazy('./sources/baptist.ts', 'buildBaptist');
const buildCatholicEncyclopedia = lazy('./sources/catholic-encyclopedia.ts', 'buildCatholicEncyclopedia');

const PD = 'Public domain';

/**
 * Source and author ids the corpora cite, checked against the app's registry. Ids defined only
 * by curated modules (loaded by Vite, not importable here) are listed explicitly.
 */
const CURATED_IDS = new Set(['council-of-trent-session-24', 'wesley-sermons', 'catholic-encyclopedia-baptism', 'catholic-encyclopedia-confirmation', 'catholic-encyclopedia-trinity', 'philip-melanchthon']);

async function registryIds(): Promise<{ sources: Set<string>; authors: Set<string> }> {
  const mods = await Promise.all([
    import('../../../src/data/registry/base-sources.ts'),
    import('../../../src/data/registry/base-authors.ts'),
    import('../../../src/data/registry/shared-sources.ts'),
    import('../../../src/data/registry/shared-authors.ts'),
    import('../../../src/data/registry/confession-sources.ts'),
  ]);
  const sources = new Set<string>(CURATED_IDS);
  const authors = new Set<string>(CURATED_IDS);
  for (const m of mods)
    for (const [name, value] of Object.entries(m as Record<string, unknown>)) {
      if (!Array.isArray(value)) continue;
      const target = /AUTHORS$/.test(name) ? authors : /SOURCES$/.test(name) ? sources : null;
      for (const x of value as { id?: string }[]) if (target && x?.id) target.add(x.id);
    }
  return { sources, authors };
}

interface CorpusSpec {
  id: string;
  label: string;
  kind: EvidenceKind;
  /** default source id (documents normally set their own) */
  sourceId: string;
  /** landing page for the corpus as a whole */
  originUrl: string;
  license: string;
  parts: (() => Promise<Part>)[];
}

export const CORPORA: CorpusSpec[] = [
  {
    id: 'confessions-ecumenical',
    label: 'Ecumenical creeds',
    kind: 'confession',
    sourceId: 'nicene-creed',
    originUrl: 'https://ccel.org/ccel/schaff/creeds2',
    license: `${PD} (Schaff, The Creeds of Christendom, vol. 2, 1877; Percival, NPNF² vol. 14, 1900)`,
    parts: [buildEcumenical],
  },
  {
    id: 'confessions-reformed',
    label: 'Reformed confessions and catechisms',
    kind: 'confession',
    sourceId: 'westminster-confession',
    originUrl: 'https://www.opc.org/confessions.html',
    license: `${PD} (Westminster Standards of 1646–48 as published by the OPC; Schaff, The Creeds of Christendom, vol. 3, 1877)`,
    // the Remonstrance of 1610 (tagged Remonstrant, not Reformed) sits beside the Canons of Dort that answer it
    parts: [buildWestminster, buildHeidelberg, buildBelgic, buildDort, buildRemonstrance],
  },
  {
    id: 'confessions-lutheran',
    label: 'Lutheran confessions (Book of Concord)',
    kind: 'confession',
    sourceId: 'augsburg-confession',
    originUrl: 'https://bookofconcord.org/',
    license: `${PD} (English text of the Triglot Concordia, 1921)`,
    parts: [buildLutheran],
  },
  {
    id: 'confessions-anglican',
    label: 'Anglican formularies',
    kind: 'confession',
    sourceId: 'thirty-nine-articles',
    originUrl: 'https://ccel.org/ccel/schaff/creeds3',
    license: `${PD} (Schaff, The Creeds of Christendom, vol. 3, 1877)`,
    parts: [buildThirtyNineArticles],
  },
  {
    id: 'confessions-catholic',
    label: 'Catholic conciliar texts and catechisms',
    kind: 'confession',
    sourceId: 'council-of-trent-session-6',
    originUrl: 'https://history.hanover.edu/texts/trent.html',
    license: `${PD} (Waterworth's translation of the Council of Trent, 1848, via the Hanover Historical Texts Project; the Roman Catechism in McHugh & Callan's translation, New York 1923, public domain in the United States, via the Nazareth Resource Library)`,
    parts: [buildTrent, buildRomanCatechism],
  },
  {
    id: 'confessions-orthodox',
    label: 'Eastern Orthodox catechisms and confessions',
    kind: 'confession',
    sourceId: 'philaret-longer-catechism-schaff',
    originUrl: 'https://ccel.org/ccel/schaff/creeds2/creeds2.vi.iii.html',
    license: `${PD} (Philaret's Longer Catechism in Blackmore's translation, 1845, as printed in Schaff, The Creeds of Christendom, vol. 2, 1877; the Confession of Dositheus in Robertson's translation, 1899)`,
    parts: [buildPhilaret, buildDositheus],
  },
  {
    id: 'confessions-methodist',
    label: 'Methodist Articles of Religion and Wesley’s sermons',
    kind: 'confession',
    sourceId: 'methodist-articles-of-religion-schaff',
    originUrl: 'https://ccel.org/ccel/schaff/creeds3/creeds3.v.vi.html',
    license: `${PD} (Schaff, The Creeds of Christendom, vol. 3, 1877; Wesley's Sermons on Several Occasions, Jackson edition, 1872, via CCEL)`,
    parts: [buildMethodist, buildWesleySermons],
  },
  {
    id: 'confessions-baptist',
    label: 'Baptist confessions',
    kind: 'confession',
    sourceId: 'second-london-baptist-confession',
    originUrl: 'https://ccel.org/ccel/anonymous/bcf',
    license: `${PD} (Second London Baptist Confession, 1677/1689, original text via CCEL)`,
    parts: [buildBaptist],
  },
  {
    id: 'catholic-encyclopedia',
    label: 'The Catholic Encyclopedia (1907–1914)',
    kind: 'dictionary',
    sourceId: 'catholic-encyclopedia',
    originUrl: 'https://www.newadvent.org/cathen/',
    license: `${PD} (The Catholic Encyclopedia, Robert Appleton Company, 1907–1914; electronic text by New Advent)`,
    parts: [buildCatholicEncyclopedia],
  },
];

function parseArgs(argv: string[]): { only: string[] } {
  const ids = CORPORA.map((c) => c.id);
  let only = ids;
  for (const arg of argv) {
    const [k, v] = arg.replace(/^--/, '').split('=');
    if (k === 'offline') netOptions.offline = true;
    else if (k === 'only' && v) {
      only = v.split(',').map((s) => {
        const t = s.trim();
        const id = ids.includes(t) ? t : ids.find((x) => x === `confessions-${t}`);
        if (!id) throw new Error(`unknown corpus "${t}" (corpora: ${ids.join(', ')})`);
        return id;
      });
    } else if (k === 'help' || k === 'h') {
      console.log(`usage: node scripts/kb/confessions/build.ts [--only=${ids.map((i) => i.replace(/^confessions-/, '')).join(',')}] [--offline]`);
      process.exit(0);
    } else throw new Error(`unknown option ${arg}`);
  }
  return { only };
}

export async function main(argv: string[]): Promise<void> {
  const started = Date.now();
  const { only } = parseArgs(argv);
  const report: Record<string, unknown> = {};
  let failed = false;
  for (const spec of CORPORA) {
    if (!only.includes(spec.id)) continue;
    console.log(`\n== ${spec.id}`);
    const documents: KbDocument[] = [];
    const urls: string[] = [];
    const parts: Record<string, number> = {};
    let partFailed = false;
    for (const build of spec.parts) {
      try {
        const part = await build();
        documents.push(...part.documents);
        urls.push(...part.urls);
        parts[part.name] = part.documents.length;
        console.log(`  ${part.name}: ${part.documents.length} documents`);
      } catch (err) {
        partFailed = true;
        console.error(`  FAILED part: ${(err as Error).stack ?? err}`);
      }
    }
    if (partFailed) failed = true;
    if (!documents.length) {
      console.error(`  nothing to write for ${spec.id}`);
      continue;
    }
    let warnings: string[];
    try {
      warnings = validateDocuments(spec.id, documents);
    } catch (err) {
      failed = true;
      console.error(`  INVALID: ${(err as Error).message}`);
      continue;
    }
    const registry = await registryIds();
    const unknownSources = [...new Set(documents.map((d) => d.sourceId ?? spec.sourceId).filter((id) => !registry.sources.has(id)))];
    const unknownAuthors = [...new Set(documents.map((d) => d.authorId).filter((id): id is string => !!id && !registry.authors.has(id)))];
    if (!registry.sources.has(spec.sourceId)) unknownSources.push(`${spec.sourceId} (corpus default)`);
    if (unknownSources.length) warnings.push(`source ids not in the registry (evidence will not be quotable): ${unknownSources.join(', ')}`);
    if (unknownAuthors.length) warnings.push(`author ids not in the registry: ${unknownAuthors.join(', ')}`);
    for (const w of warnings) console.warn(`  warning: ${w}`);
    const bySource: Record<string, number> = {};
    for (const d of documents) {
      const s = d.sourceId ?? spec.sourceId;
      bySource[s] = (bySource[s] ?? 0) + 1;
    }
    const { path, bytes } = await writeCorpus({
      corpus: {
        id: spec.id,
        label: spec.label,
        kind: spec.kind,
        sourceId: spec.sourceId,
        origin: { url: spec.originUrl, license: spec.license, retrieved: latestRetrieved(urls) },
      },
      documents,
    });
    const withRefs = documents.filter((d) => d.refs?.length).length;
    report[spec.id] = { documents: documents.length, withRefs, bytes, parts, bySource };
    console.log(`  wrote ${path.replace(/^.*\/kb\//, 'kb/')} (${documents.length} documents, ${withRefs} with refs, ${(bytes / 1024).toFixed(0)} KB)`);
  }
  console.log(`\ndone in ${((Date.now() - started) / 1000).toFixed(1)} s`);
  console.log(JSON.stringify(report, null, 2));
  if (failed) process.exitCode = 1;
}
