/**
 * Step: public-domain classic commentaries from the Free Use Bible API
 * (Calvin, Matthew Henry, Jamieson-Fausset-Brown, Keil & Delitzsch — OT only),
 * bundled whole for the books in BUNDLED_COMMENTARY_BOOKS
 * → public/data/commentary/{calvin|matthew-henry|jfb|keil-delitzsch}/{BOOK}.json
 *
 * Cleaning is done by src/providers/local/cleaners.ts — the same functions the
 * runtime uses when it fetches a non-bundled chapter live.
 */
import type { CommentaryBookFile } from '../../../src/providers/local/formats.ts';
import { commentaryChapterToSections, findTextDefects, type ApiCommentaryChapter } from '../../../src/providers/local/cleaners.ts';
import { writeJson, type WriteStats } from '../lib/io.ts';
import { fetchJson, log, mapLimit, net, Progress, warn } from '../lib/net.ts';
import { BOOK_BY_ID, BUNDLED_COMMENTARY_BOOKS, CLASSIC_COMMENTARIES, HELLOAO } from '../lib/sources.ts';
import type { DatasetReport, StepContext, StepReport } from './types.ts';

interface AvailableCommentaries {
  commentaries: { id: string; name: string; sha256?: string; licenseUrl?: string; licenseNotes?: string | null; website?: string }[];
}

export async function buildCommentaries(ctx: StepContext): Promise<StepReport> {
  const available = await fetchJson<AvailableCommentaries>(`${HELLOAO}/available_commentaries.json`);
  const datasets: DatasetReport[] = [];
  const bundled: Record<string, string[]> = {};
  const availableBooks: Record<string, string[]> = {};
  for (const c of CLASSIC_COMMENTARIES) {
    const meta = available?.commentaries.find((x) => x.id === c.apiId);
    // which books the source covers at all (lets the runtime skip hopeless remote requests)
    const list = await fetchJson<{ books: { id: string }[] }>(`${HELLOAO}/c/${c.apiId}/books.json`);
    availableBooks[c.id] = (list?.books ?? []).map((b) => b.id).filter((id) => BOOK_BY_ID.has(id));
    const books = BUNDLED_COMMENTARY_BOOKS.filter((b) => !c.otOnly || BOOK_BY_ID.get(b)!.testament === 'OT');
    const jobs = books.flatMap((book) => Array.from({ length: BOOK_BY_ID.get(book)!.chapters }, (_, i) => ({ book, chapter: i + 1 })));
    const results = await mapLimit(
      jobs,
      net.concurrency,
      (j) => fetchJson<ApiCommentaryChapter>(`${HELLOAO}/c/${c.apiId}/${j.book}/${j.chapter}.json`),
      new Progress(`commentary:${c.id}`, jobs.length),
    );
    const stats: WriteStats = { files: 0, bytes: 0 };
    const missing: string[] = [];
    const defects = new Map<string, number>();
    let sections = 0;
    bundled[c.id] = [];
    for (const book of books) {
      const info = BOOK_BY_ID.get(book)!;
      const file: CommentaryBookFile = { book, commentaryId: c.id, s: [] };
      jobs.forEach((j, i) => {
        if (j.book !== book) return;
        const res = results[i];
        if (!res) {
          missing.push(`${book} ${j.chapter}`);
          return;
        }
        const secs = commentaryChapterToSections(c.id, res, ctx.lastVerse(book, j.chapter), info.name);
        for (const s of secs) {
          for (const d of findTextDefects(s[4], { footnoteMarkers: c.id === 'calvin' })) defects.set(d, (defects.get(d) ?? 0) + 1);
          file.s.push(s);
        }
      });
      file.s.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      if (!file.s.length) {
        warn('commentaries', `${c.id} ${book}: no sections (not in the source)`);
        continue;
      }
      sections += file.s.length;
      bundled[c.id].push(book);
      await writeJson(`commentary/${c.id}/${book}.json`, file, stats);
    }
    const defectSummary = [...defects].map(([k, v]) => `${k}: ${v}`);
    log('commentaries', `${c.id}: ${sections} sections in ${bundled[c.id].length} books; ${missing.length} chapters absent from the source${defectSummary.length ? `; residual defects ${defectSummary.join(', ')}` : ''}`);
    datasets.push({
      id: c.sourceId,
      name: `${c.name} (via Free Use Bible API “${c.apiId}”)`,
      kind: 'commentary',
      urls: [`${HELLOAO}/c/${c.apiId}/{BOOK}/{chapter}.json`, ...(meta?.website ? [meta.website] : [])],
      license: 'Public domain',
      licenseUrl: meta?.licenseUrl ?? 'https://creativecommons.org/publicdomain/mark/1.0/',
      apiSha256: meta?.sha256,
      output: `commentary/${c.id}/`,
      files: stats.files,
      bytes: stats.bytes,
      counts: { books: bundled[c.id].length, sections, chaptersAbsentInSource: missing.length },
      notes: [
        ...(missing.length ? [`Chapters absent from the source: ${compressRanges(missing)}`] : []),
        ...(defectSummary.length ? [`Residual text defects after cleaning: ${defectSummary.join(', ')}`] : []),
      ],
    });
  }
  return { step: 'commentaries', datasets, extra: { bundledCommentaryBooks: bundled, availableBooks } };
}

/** ["MAT 19", "MAT 20", "MAT 21"] → "MAT 19–21" */
function compressRanges(items: string[]): string {
  const out: string[] = [];
  let i = 0;
  while (i < items.length) {
    const [book, ch] = items[i].split(' ');
    let j = i;
    while (j + 1 < items.length && items[j + 1].split(' ')[0] === book && Number(items[j + 1].split(' ')[1]) === Number(items[j].split(' ')[1]) + 1) j++;
    out.push(j > i ? `${book} ${ch}–${items[j].split(' ')[1]}` : items[i]);
    i = j + 1;
  }
  return out.join(', ');
}
