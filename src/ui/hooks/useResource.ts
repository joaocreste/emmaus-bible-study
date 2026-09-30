import { useCallback, useEffect, useMemo, useState } from 'react';
import { createResourceCache } from './resourceCache';

export type ResourceState<T> =
  | { status: 'idle'; data: undefined; error: undefined }
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: undefined; error: Error };

/** A resource state plus `retry()`, which asks the provider again (for "Try again" buttons). */
export type Resource<T> = ResourceState<T> & { retry(): void };

/** Module-level: revisiting a passage or lexeme renders instantly. Failures are never cached. */
const cache = createResourceCache(300);

/**
 * Load an async resource keyed by a stable string. `key === null` means "nothing to load".
 * The state always belongs to the current key: while a new key loads, the previous key's
 * data is never returned.
 */
export function useResource<T>(key: string | null, loader: () => Promise<T>): Resource<T> {
  const [attempt, setAttempt] = useState(0);
  const [stored, setStored] = useState<{ key: string | null; state: ResourceState<T> }>(() => ({ key, state: initial<T>(key) }));

  useEffect(() => {
    if (key == null) {
      setStored({ key, state: idle() });
      return;
    }
    const hit = cache.get<T>(key);
    if (hit) {
      setStored({ key, state: success(hit.value) });
      return;
    }
    setStored({ key, state: loading() });
    let cancelled = false;
    cache.load(key, loader).then(
      (value) => !cancelled && setStored({ key, state: success(value) }),
      (error: unknown) => !cancelled && setStored({ key, state: failure(error) }),
    );
    return () => {
      cancelled = true;
    };
    // loader intentionally excluded: the key fully identifies the resource
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const state = stored.key === key ? stored.state : initial<T>(key);
  return useMemo(() => ({ ...state, retry }), [state, retry]);
}

function initial<T>(key: string | null): ResourceState<T> {
  if (key == null) return idle();
  const hit = cache.get<T>(key);
  return hit ? success(hit.value) : loading();
}

function idle<T>(): ResourceState<T> {
  return { status: 'idle', data: undefined, error: undefined };
}

function loading<T>(): ResourceState<T> {
  return { status: 'loading', data: undefined, error: undefined };
}

function success<T>(data: T): ResourceState<T> {
  return { status: 'success', data, error: undefined };
}

function failure<T>(error: unknown): ResourceState<T> {
  return { status: 'error', data: undefined, error: error instanceof Error ? error : new Error(String(error)) };
}
