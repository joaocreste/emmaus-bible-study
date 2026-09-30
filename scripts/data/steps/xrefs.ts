/**
 * Step: OpenBible.info cross references (CC BY 4.0) via the Free Use Bible API
 * dataset "open-cross-ref", one request per chapter (1,189)
 * → public/data/xrefs/{BOOK}.json: chapter → verse → [[refKey, votes], …] (best first).
 *
 * Kept: the top N references per verse by vote score (N = ctx.xrefsPerVerse),
 * only with a positive score (zero/negative = readers voted the link down).
 * Targets use the refKey() format of src/domain/reference.ts ("JHN.3.18-19").
 */
import type { XrefBookFile } from '../../../src/providers/local/formats.ts';
import { writeJson, type WriteStats } from '../lib/io.ts';
import { fetchJson, log, mapLimit, net, Progress } from '../lib/net.ts';
import { BOOK_BY_ID, BOOKS, HELLOAO } from '../lib/sources.ts';
import type { StepContext, StepReport } from './types.ts';

interface ApiRef {
  book: string;
  chapter: number;
  verse: number;
  endVerse?: number;
  endChapter?: number;
  score: number;
}
interface ApiXrefChapter {
  dataset?: { sha256?: string; licenseUrl?: string; website?: string; totalNumberOfReferences?: number };
  chapter: { number: number; content: { verse: number; references: ApiRef[] }[] };
}

/** Same encoding as refKey() in src/domain/reference.ts for single verses and ranges. */
export function xrefKey(r: ApiRef): string {
  const endC = r.endChapter ?? r.chapter;
  if (endC !== r.chapter) return `${r.book}.${r.chapter}.${r.verse}-${endC}.${r.endVerse ?? 1}`;
  if (r.endVerse == null || r.endVerse === r.verse) return `${r.book}.${r.chapter}.${r.verse}`;
  return `${r.book}.${r.chapter}.${r.verse}-${r.endVerse}`;
}

export async function buildXrefs(ctx: StepContext): Promise<StepReport> {
  const jobs = BOOKS.flatMap((b) => Array.from({ length: b.chapters }, (_, i) => ({ book: b.id, chapter: i + 1 })));
  const progress = new Progress('xrefs', jobs.length);
  const results = await mapLimit(
    jobs,
    net.concurrency,
    (j) => fetchJson<ApiXrefChapter>(`${HELLOAO}/d/open-cross-ref/${j.book}/${j.chapter}.json`),
    progress,
  );
  const stats: WriteStats = { files: 0, bytes: 0 };
  let kept = 0;
  let seen = 0;
  let versesWithRefs = 0;
  let missingChapters = 0;
  let datasetSha: string | undefined;
  let total: number | undefined;
  const byBook = new Map<string, XrefBookFile>();
  results.forEach((res, i) => {
    const { book, chapter } = jobs[i];
    if (!res) {
      missingChapters++;
      return;
    }
    datasetSha ??= res.dataset?.sha256;
    total ??= res.dataset?.totalNumberOfReferences;
    const file = byBook.get(book) ?? {};
    byBook.set(book, file);
    const chap: Record<string, [string, number][]> = {};
    for (const v of res.chapter.content) {
      seen += v.references.length;
      const refs = v.references
        .filter((r) => r.score > 0 && BOOK_BY_ID.has(r.book))
        .sort((a, b) => b.score - a.score)
        .slice(0, ctx.xrefsPerVerse)
        .map((r): [string, number] => [xrefKey(r), r.score]);
      if (!refs.length) continue;
      chap[String(v.verse)] = refs;
      kept += refs.length;
      versesWithRefs++;
    }
    if (Object.keys(chap).length) file[String(chapter)] = chap;
  });
  for (const b of BOOKS) await writeJson(`xrefs/${b.id}.json`, byBook.get(b.id) ?? {}, stats);
  log('xrefs', `${kept} references kept of ${seen} (top ${ctx.xrefsPerVerse}/verse, score > 0) for ${versesWithRefs} verses; ${missingChapters} chapters without data`);
  return {
    step: 'xrefs',
    datasets: [
      {
        id: 'openbible-xrefs',
        name: 'OpenBible.info Cross References (via Free Use Bible API dataset “open-cross-ref”)',
        kind: 'dataset',
        urls: ['https://www.openbible.info/labs/cross-references/', `${HELLOAO}/d/open-cross-ref/{BOOK}/{chapter}.json`],
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
        attribution: 'Cross references from OpenBible.info (CC BY 4.0).',
        apiSha256: datasetSha,
        output: 'xrefs/',
        files: stats.files,
        bytes: stats.bytes,
        counts: { referencesInSource: total ?? seen, referencesKept: kept, versesWithReferences: versesWithRefs, perVerseLimit: ctx.xrefsPerVerse },
        notes: ['Only references with a positive vote score are kept; the best-voted first.'],
      },
    ],
  };
}
