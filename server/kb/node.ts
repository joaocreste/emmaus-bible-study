/**
 * Node bindings for the knowledge base: a file-system DataLoader over public/data
 * (the browser uses fetch) and a disk-cached fetch for the live commentary fallback
 * (Free Use Bible API chapters for books that are not bundled), so repeated
 * generations never refetch the same chapter.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { DataLoader } from '../../src/providers/local/loader';

/** Reads `<dataRoot>/<path>` as JSON; null when the file does not exist. */
export function createNodeLoader(dataRoot: string): DataLoader {
  return {
    async json<T>(path: string): Promise<T | null> {
      try {
        return JSON.parse(await readFile(join(dataRoot, path.replace(/^\/+/, '')), 'utf8')) as T;
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
        throw err;
      }
    },
  };
}

/** "https://bible.helloao.org/api/c/john-calvin/ACT/2.json" → "<dir>/bible.helloao.org/api/c/john-calvin/ACT/2.json" */
function cachePath(dir: string, url: string): string {
  const u = new URL(url);
  let path = decodeURIComponent(u.pathname).replace(/^\/+/, '').replace(/[<>:"|?*]/g, '_');
  if (u.search) path += `__${createHash('sha1').update(u.search).digest('hex').slice(0, 10)}`;
  return join(dir, u.host, path || 'index');
}

/**
 * A fetch that serves successful GET responses from `<dir>` when present and stores
 * new ones (404s are remembered as `.404` markers). Errors and other statuses pass
 * through uncached, so a later call can retry.
 */
export function createDiskCachedFetch(dir: string, inner: typeof fetch = globalThis.fetch.bind(globalThis)): typeof fetch {
  const cached = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if ((init?.method ?? 'GET').toUpperCase() !== 'GET') return inner(input, init);
    const file = cachePath(dir, url);
    if (existsSync(file)) return new Response(await readFile(file), { status: 200, headers: { 'content-type': 'application/json', 'x-kb-cache': 'hit' } });
    if (existsSync(`${file}.404`)) return new Response('not found', { status: 404 });
    const res = await inner(input, init);
    if (res.status === 404) {
      await mkdir(dirname(file), { recursive: true }).catch(() => {});
      await writeFile(`${file}.404`, '').catch(() => {});
      return res;
    }
    if (!res.ok) return res;
    const body = Buffer.from(await res.arrayBuffer());
    try {
      await mkdir(dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(tmp, body);
      await rename(tmp, file);
    } catch {
      /* cache write failures are not fatal */
    }
    return new Response(body, { status: res.status, headers: res.headers });
  };
  return cached as typeof fetch;
}
