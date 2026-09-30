/**
 * Cached downloads for the confessions knowledge-base build.
 *
 * Every response is stored under .kb-cache/downloads/confessions/<host>/<path> with a
 * sidecar `.meta.json` recording the URL and the date it was first retrieved, so a
 * rebuild from the cache is byte-for-byte deterministic (the retrieval date comes from
 * the cache, never from the clock). Node >= 22 (global fetch), no dependencies.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const ROOT = new URL('../../../../', import.meta.url).pathname.replace(/\/$/, '');
export const CACHE_DIR = join(ROOT, '.kb-cache', 'downloads', 'confessions');

export const netOptions = { offline: false, retries: 3, delayMs: 250, timeoutMs: 30_000 };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function cachePathFor(url: string): string {
  const u = new URL(url);
  let path = decodeURIComponent(u.pathname).replace(/^\/+/, '');
  if (u.search) path += '__' + createHash('sha1').update(u.search).digest('hex').slice(0, 12);
  if (path === '' || path.endsWith('/')) path += 'index';
  return join(CACHE_DIR, u.host, path.replace(/[<>:"|?*]/g, '_'));
}

interface Meta {
  url: string;
  retrieved: string;
  status: number;
}

const retrievedDates = new Map<string, string>();

/** Date (YYYY-MM-DD) a cached URL was first downloaded. */
export function retrievedOn(url: string): string | undefined {
  return retrievedDates.get(url);
}

let lastRequest = 0;

/** Fetch through the cache; resolves the raw body. Throws on 404 and other failures. */
export async function fetchBuffer(url: string): Promise<Buffer> {
  const file = cachePathFor(url);
  if (existsSync(file)) {
    const metaFile = `${file}.meta.json`;
    if (existsSync(metaFile)) {
      const meta = JSON.parse(await readFile(metaFile, 'utf8')) as Meta;
      retrievedDates.set(url, meta.retrieved);
    }
    return readFile(file);
  }
  if (netOptions.offline) throw new Error(`offline and not cached: ${url}`);
  let lastErr: unknown;
  for (let attempt = 0; attempt <= netOptions.retries; attempt++) {
    if (attempt > 0) await sleep(Math.min(8_000, 1000 * 2 ** (attempt - 1)));
    // be polite to small academic servers
    const wait = lastRequest + netOptions.delayMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequest = Date.now();
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(netOptions.timeoutMs),
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; emmaus-kb-build/1.0; public-domain text collection)',
          accept: 'text/html,application/xhtml+xml,application/xml,text/plain,application/json;q=0.9,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.9',
        },
      });
      if (res.status === 404) throw Object.assign(new Error(`HTTP 404 for ${url}`), { fatal: true });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status} for ${url}`);
      if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status} for ${url}`), { fatal: true });
      const body = Buffer.from(await res.arrayBuffer());
      await mkdir(dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      await writeFile(tmp, body);
      await rename(tmp, file);
      const meta: Meta = { url, retrieved: new Date().toISOString().slice(0, 10), status: res.status };
      await writeFile(`${file}.meta.json`, JSON.stringify(meta, null, 2));
      retrievedDates.set(url, meta.retrieved);
      return body;
    } catch (err) {
      lastErr = err;
      if ((err as { fatal?: boolean }).fatal) break;
      console.warn(`  retry ${attempt + 1}/${netOptions.retries}: ${(err as Error).message}`);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/**
 * Fetch and decode as text. `encoding` defaults to UTF-8 (BOM stripped); 'auto' decodes
 * UTF-8 when the bytes are valid UTF-8 and Windows-1252 otherwise (older sites).
 */
export async function fetchText(url: string, encoding: 'utf8' | 'latin1' | 'cp1252' | 'auto' = 'utf8'): Promise<string> {
  const buf = await fetchBuffer(url);
  if (encoding === 'utf8') return buf.toString('utf8').replace(/^\uFEFF/, '');
  if (encoding === 'latin1') return buf.toString('latin1');
  if (encoding === 'auto') {
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(buf).replace(/^\uFEFF/, '');
    } catch {
      return new TextDecoder('windows-1252').decode(buf);
    }
  }
  return new TextDecoder('windows-1252').decode(buf);
}

/** Latest retrieval date among the given URLs (for a corpus' `origin.retrieved`). */
export function latestRetrieved(urls: Iterable<string>): string {
  let best = '';
  for (const u of urls) {
    const d = retrievedDates.get(u);
    if (d && d > best) best = d;
  }
  return best || 'unknown';
}
