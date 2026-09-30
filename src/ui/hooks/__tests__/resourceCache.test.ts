import { describe, expect, it, vi } from 'vitest';
import { createResourceCache } from '../resourceCache';

describe('resource cache', () => {
  it('remembers successes and shares requests in flight', async () => {
    const cache = createResourceCache();
    const loader = vi.fn(async () => 'ROM 8');
    const [a, b] = await Promise.all([cache.load('p', loader), cache.load('p', loader)]);
    expect(a).toBe('ROM 8');
    expect(b).toBe('ROM 8');
    expect(loader).toHaveBeenCalledTimes(1);
    expect(cache.get('p')).toEqual({ value: 'ROM 8' });
    await cache.load('p', loader);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('never caches a failure: the next load asks again', async () => {
    const cache = createResourceCache();
    const loader = vi.fn().mockRejectedValueOnce(new Error('503')).mockResolvedValueOnce('ok');
    await expect(cache.load('p', loader)).rejects.toThrow('503');
    expect(cache.get('p')).toBeUndefined();
    await expect(cache.load('p', loader)).resolves.toBe('ok');
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('turns a loader that throws synchronously into a rejected load', async () => {
    const cache = createResourceCache();
    await expect(
      cache.load('p', () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
    expect(cache.size).toBe(0);
  });

  it('is bounded, evicting the least recently used entry', async () => {
    const cache = createResourceCache(2);
    await cache.load('a', async () => 1);
    await cache.load('b', async () => 2);
    cache.get('a'); // a is now more recent than b
    await cache.load('c', async () => 3);
    expect(cache.size).toBe(2);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toEqual({ value: 1 });
    expect(cache.get('c')).toEqual({ value: 3 });
  });
});
