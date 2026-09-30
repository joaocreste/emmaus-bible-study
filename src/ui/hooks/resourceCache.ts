/**
 * Keyed cache for async resources shown in the UI (passages, lexicon entries,
 * cross-reference lists…). Framework-free so its rules are unit-tested:
 *
 * - only successes are remembered: a failure (offline, a 503) is never sticky,
 *   the next request for the key — or an explicit retry — asks the provider again;
 * - concurrent requests for a key share one promise;
 * - settled entries are bounded (least recently used first out), so browsing many
 *   books and translations does not grow memory without limit.
 */
export interface ResourceCache {
  /** a remembered value, marking it recently used */
  get<T>(key: string): { value: T } | undefined;
  /** the cached value, the request in flight, or a new request made with `loader` */
  load<T>(key: string, loader: () => Promise<T>): Promise<T>;
  /** number of remembered values */
  readonly size: number;
  clear(): void;
}

export function createResourceCache(maxEntries = 300): ResourceCache {
  const values = new Map<string, unknown>();
  const inflight = new Map<string, Promise<unknown>>();

  const remember = (key: string, value: unknown) => {
    values.delete(key);
    values.set(key, value);
    while (values.size > maxEntries) {
      const oldest = values.keys().next().value as string;
      values.delete(oldest);
    }
  };

  return {
    get<T>(key: string) {
      if (!values.has(key)) return undefined;
      const value = values.get(key) as T;
      remember(key, value); // mark as recently used
      return { value };
    },
    load<T>(key: string, loader: () => Promise<T>): Promise<T> {
      if (values.has(key)) return Promise.resolve(values.get(key) as T);
      const pending = inflight.get(key) as Promise<T> | undefined;
      if (pending) return pending;
      let p: Promise<T>;
      try {
        p = loader();
      } catch (error) {
        p = Promise.reject(error);
      }
      inflight.set(key, p);
      p.then(
        (value) => {
          inflight.delete(key);
          remember(key, value);
        },
        () => inflight.delete(key),
      );
      return p;
    },
    get size() {
      return values.size;
    },
    clear() {
      values.clear();
      inflight.clear();
    },
  };
}
