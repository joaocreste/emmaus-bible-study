/**
 * Download helpers for the data pipeline: an on-disk cache (.data-cache/http),
 * a concurrency-limited pool, retries with exponential backoff, and progress logs.
 * Node ≥ 22 (global fetch). No third-party dependencies.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const ROOT = new URL('../../../', import.meta.url).pathname.replace(/\/$/, '');
export const CACHE_DIR = join(ROOT, '.data-cache');
export const HTTP_CACHE = join(CACHE_DIR, 'http');

export interface NetOptions {
  /** never touch the network; missing cache entries are errors */
  offline: boolean;
  concurrency: number;
  retries: number;
}

export const net: NetOptions = { offline: false, concurrency: 8, retries: 5 };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Cache path for a URL: .data-cache/http/<host>/<path> (query folded into the name). */
export function cachePathFor(url: string): string {
  const u = new URL(url);
  let path = decodeURIComponent(u.pathname).replace(/^\/+/, '');
  if (u.search) path += '__' + createHash('sha1').update(u.search).digest('hex').slice(0, 10);
  if (path.endsWith('/') || path === '') path += 'index';
  return join(HTTP_CACHE, u.host, path.replace(/[<>:"|?*]/g, '_'));
}

export class HttpError extends Error {
  status: number;
  constructor(url: string, status: number) {
    super(`HTTP ${status} for ${url}`);
    this.status = status;
  }
}

/**
 * Fetch a URL through the cache. Resolves the body as a Buffer, or `null` for
 * a 404 (also cached, as a `.404` marker). Retries network errors, 429 and 5xx.
 */
export async function fetchCached(url: string, headers: Record<string, string> = {}): Promise<Buffer | null> {
  const file = cachePathFor(url);
  if (existsSync(file)) return readFile(file);
  if (existsSync(file + '.404')) return null;
  if (net.offline) throw new Error(`offline and not cached: ${url}`);
  let lastErr: unknown;
  for (let attempt = 0; attempt <= net.retries; attempt++) {
    if (attempt > 0) await sleep(Math.min(30_000, 500 * 2 ** (attempt - 1)) + Math.random() * 250);
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'emmaus-data-pipeline/1.0', ...headers } });
      if (res.status === 404) {
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file + '.404', '');
        return null;
      }
      if (res.status === 429 || res.status >= 500) throw new HttpError(url, res.status);
      if (!res.ok) throw Object.assign(new HttpError(url, res.status), { fatal: true });
      const body = Buffer.from(await res.arrayBuffer());
      await mkdir(dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      await writeFile(tmp, body);
      await rename(tmp, file);
      return body;
    } catch (err) {
      lastErr = err;
      if ((err as { fatal?: boolean }).fatal) break;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/** fetchCached + JSON.parse (null for 404). */
export async function fetchJson<T>(url: string, headers?: Record<string, string>): Promise<T | null> {
  const buf = await fetchCached(url, headers);
  return buf ? (JSON.parse(buf.toString('utf8')) as T) : null;
}

/** fetchCached + UTF-8 decode (BOM stripped); throws on 404. */
export async function fetchText(url: string): Promise<string> {
  const buf = await fetchCached(url);
  if (!buf) throw new Error(`Not found: ${url}`);
  return buf.toString('utf8').replace(/^﻿/, '');
}

export function sha256(buf: Buffer | string): string {
  return createHash('sha256').update(buf).digest('hex');
}

/** Run `fn` over `items` with at most `limit` in flight; results keep input order. */
export async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
  progress?: Progress,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
      progress?.tick();
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker));
  progress?.done();
  return out;
}

/** Throttled progress logger ("[xrefs] 420/1189 (35%)"). */
export class Progress {
  private count = 0;
  private last = 0;
  private readonly label: string;
  private readonly total: number;
  constructor(label: string, total: number) {
    this.label = label;
    this.total = total;
  }
  tick(n = 1) {
    this.count += n;
    const now = Date.now();
    if (now - this.last > 2000) {
      this.last = now;
      log(this.label, `${this.count}/${this.total} (${Math.round((100 * this.count) / Math.max(1, this.total))}%)`);
    }
  }
  done() {
    log(this.label, `${this.count}/${this.total} done`);
  }
}

const t0 = Date.now();
export function log(step: string, msg: string) {
  const secs = ((Date.now() - t0) / 1000).toFixed(1).padStart(6);
  console.log(`${secs}s [${step}] ${msg}`);
}

export function warn(step: string, msg: string) {
  console.warn(`        [${step}] WARNING: ${msg}`);
}
