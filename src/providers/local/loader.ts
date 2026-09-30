/**
 * DataLoader — how the local providers read the bundled datasets under
 * `public/data`. The browser implementation fetches lazily (per book / per shard)
 * with an in-memory promise cache, so concurrent requests for the same file share
 * one network request and nothing from public/data enters the JS bundle.
 * Tests inject a Node fs loader instead (see __tests__/fsLoader.ts).
 */

export interface DataLoader {
  /** Parsed JSON at `path` (relative to the data root, e.g. "bible/bsb/ROM.json"), or null when the file does not exist. */
  json<T>(path: string): Promise<T | null>;
}

/** `${import.meta.env.BASE_URL}data`, guarded so Node (vitest, scripts) never trips on a missing `env`. */
export function defaultDataBaseUrl(): string {
  let base = '/';
  try {
    const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env;
    if (env && typeof env.BASE_URL === 'string') base = env.BASE_URL;
  } catch {
    /* not running under Vite */
  }
  return `${base.endsWith('/') ? base : `${base}/`}data`;
}

/**
 * Files kept in memory. Per-book files reach ~1.4 MB (Jeremiah's tagged Hebrew), so the
 * cache is bounded; evicted files are re-read from the browser's HTTP cache when needed.
 */
const DEFAULT_MAX_ENTRIES = 64;

/** Minimal least-recently-used map (Map preserves insertion order). */
class LruMap<K, V> {
  private readonly map = new Map<K, V>();
  constructor(private readonly max: number) {}
  get(key: K): V | undefined {
    const v = this.map.get(key);
    if (v !== undefined) {
      this.map.delete(key);
      this.map.set(key, v);
    }
    return v;
  }
  set(key: K, value: V): void {
    this.map.delete(key);
    this.map.set(key, value);
    while (this.map.size > this.max) this.map.delete(this.map.keys().next().value as K);
  }
  delete(key: K): void {
    this.map.delete(key);
  }
}

/**
 * Browser loader: fetch + JSON with a promise cache. A 404 (or the HTML page a
 * dev server returns for unknown paths) resolves to null; network errors reject
 * and are evicted from the cache so a later call can retry.
 */
export function createFetchLoader(baseUrl: string = defaultDataBaseUrl(), fetchImpl?: typeof fetch, maxEntries = DEFAULT_MAX_ENTRIES): DataLoader {
  const cache = new LruMap<string, Promise<unknown>>(maxEntries);
  const root = baseUrl.replace(/\/+$/, '');
  return {
    json<T>(path: string): Promise<T | null> {
      const key = path.replace(/^\/+/, '');
      let pending = cache.get(key) as Promise<T | null> | undefined;
      if (!pending) {
        const doFetch = fetchImpl ?? globalThis.fetch.bind(globalThis);
        pending = doFetch(`${root}/${key}`).then(async (res) => {
          if (res.status === 404) return null;
          if (!res.ok) throw new Error(`Failed to load ${key}: HTTP ${res.status}`);
          const type = res.headers.get('content-type') ?? '';
          if (type.includes('text/html')) return null;
          return (await res.json()) as T;
        });
        cache.set(key, pending);
        pending.catch(() => cache.delete(key));
      }
      return pending;
    },
  };
}

/** Wrap any loader with the same promise cache (useful for custom loaders). */
export function cachedLoader(inner: DataLoader, maxEntries = DEFAULT_MAX_ENTRIES): DataLoader {
  const cache = new LruMap<string, Promise<unknown>>(maxEntries);
  return {
    json<T>(path: string): Promise<T | null> {
      let pending = cache.get(path) as Promise<T | null> | undefined;
      if (!pending) {
        pending = inner.json<T>(path);
        cache.set(path, pending);
        pending.catch(() => cache.delete(path));
      }
      return pending;
    },
  };
}
