/**
 * Minimal, dependency-free reader for the .tar.gz archives GitHub serves from
 * codeload (ustar + pax headers). Only regular files are returned; the leading
 * "<repo>-<ref>/" directory is stripped from every path.
 */
import { gunzipSync } from 'node:zlib';

export interface TarContents {
  files: Map<string, Buffer>;
  /** commit id from the pax global header GitHub writes ("comment=<sha>") */
  commit?: string;
}

function cString(buf: Buffer, start: number, length: number): string {
  const slice = buf.subarray(start, start + length);
  const nul = slice.indexOf(0);
  return (nul === -1 ? slice : slice.subarray(0, nul)).toString('utf8');
}

function octal(buf: Buffer, start: number, length: number): number {
  const s = cString(buf, start, length).trim();
  return s ? parseInt(s, 8) : 0;
}

/** Parse pax records ("<len> <key>=<value>\n"). */
function paxRecords(data: Buffer): Record<string, string> {
  const out: Record<string, string> = {};
  let p = 0;
  while (p < data.length) {
    const space = data.indexOf(0x20, p);
    if (space === -1) break;
    const len = Number(data.subarray(p, space).toString('utf8'));
    if (!Number.isFinite(len) || len <= 0) break;
    const record = data.subarray(space + 1, p + len - 1).toString('utf8');
    const eq = record.indexOf('=');
    if (eq > 0) out[record.slice(0, eq)] = record.slice(eq + 1);
    p += len;
  }
  return out;
}

/**
 * Read a gzipped tarball. `want` selects which (stripped) paths to keep, so large
 * archives are not held in memory twice.
 */
export function readTarGz(gz: Buffer, want: (path: string) => boolean = () => true): TarContents {
  const buf = gunzipSync(gz);
  const files = new Map<string, Buffer>();
  let commit: string | undefined;
  let nextPath: string | undefined;
  let p = 0;
  while (p + 512 <= buf.length) {
    const header = buf.subarray(p, p + 512);
    if (header.every((b) => b === 0)) break;
    const name = cString(header, 0, 100);
    const size = octal(header, 124, 12);
    const type = String.fromCharCode(header[156] || 0x30);
    const prefix = cString(header, 345, 155);
    const dataStart = p + 512;
    const data = buf.subarray(dataStart, dataStart + size);
    p = dataStart + Math.ceil(size / 512) * 512;

    if (type === 'g') {
      const rec = paxRecords(data);
      if (rec.comment) commit = rec.comment.trim();
      continue;
    }
    if (type === 'x') {
      const rec = paxRecords(data);
      if (rec.path) nextPath = rec.path;
      continue;
    }
    if (type === 'L') {
      nextPath = cString(data, 0, data.length);
      continue;
    }
    const fullPath = nextPath ?? (prefix ? `${prefix}/${name}` : name);
    nextPath = undefined;
    if (type !== '0' && type !== '\0' && type !== '7') continue; // regular files only
    const stripped = fullPath.replace(/^[^/]+\//, '');
    if (stripped && want(stripped)) files.set(stripped, Buffer.from(data));
  }
  return { files, commit };
}
