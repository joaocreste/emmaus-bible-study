/**
 * Output helpers: compact JSON writer under public/data, size accounting, and a
 * dependency-free ZIP reader (Node zlib) for the Tyndale Open Study Notes archive.
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { inflateRawSync } from 'node:zlib';
import { ROOT } from './net.ts';

export const DATA_DIR = join(ROOT, 'public', 'data');

export interface WriteStats {
  files: number;
  bytes: number;
}

/** Write compact JSON to public/data/<rel>. Returns the byte size. */
export async function writeJson(rel: string, data: unknown, stats?: WriteStats): Promise<number> {
  const file = join(DATA_DIR, rel);
  await mkdir(dirname(file), { recursive: true });
  const body = JSON.stringify(data);
  await writeFile(file, body);
  const bytes = Buffer.byteLength(body);
  if (stats) {
    stats.files++;
    stats.bytes += bytes;
  }
  return bytes;
}

/** Total size (bytes) and file count of a directory tree. */
export async function dirSize(dir: string): Promise<WriteStats> {
  const out: WriteStats = { files: 0, bytes: 0 };
  async function walk(d: string) {
    let entries: import('node:fs').Dirent[];
    try {
      entries = await readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else {
        out.files++;
        out.bytes += (await stat(p)).size;
      }
    }
  }
  await walk(dir);
  return out;
}

export function mb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Read every file of a ZIP archive (stored or deflated entries). */
export function readZip(buf: Buffer): Map<string, Buffer> {
  const files = new Map<string, Buffer>();
  // End of central directory record: signature 0x06054b50, searched from the end.
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65_557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('ZIP: end of central directory not found');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('ZIP: bad central directory entry');
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nameLen).toString('utf8');
    p += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith('/')) continue;
    const lNameLen = buf.readUInt16LE(localOffset + 26);
    const lExtraLen = buf.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + lNameLen + lExtraLen;
    const data = buf.subarray(start, start + compSize);
    if (method === 0) files.set(name, Buffer.from(data));
    else if (method === 8) files.set(name, inflateRawSync(data));
    else throw new Error(`ZIP: unsupported compression method ${method} for ${name}`);
  }
  return files;
}
