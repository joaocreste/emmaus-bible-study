import { describe, expect, it } from 'vitest';
import { createRequestQueue } from '../requestQueue';

/** A promise the test resolves by hand. */
function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const tick = () => new Promise((r) => setTimeout(r, 0));

describe('createRequestQueue', () => {
  it('runs a request that arrives while another is in flight after it settles (nothing is dropped)', async () => {
    const q = createRequestQueue();
    const log: string[] = [];
    const first = deferred<string>();
    const a = q.enqueue('send:what does condemnation mean?', async () => {
      log.push('question:start');
      const v = await first.promise;
      log.push('question:end');
      return v;
    });
    const b = q.enqueue('open:|ROM.7.24-25|', async () => {
      log.push('open:start');
      return 'library-ROM.7.24-25';
    });
    await tick();
    expect(log).toEqual(['question:start']);
    first.resolve('romans-8');
    await expect(a).resolves.toBe('romans-8');
    await expect(b).resolves.toBe('library-ROM.7.24-25');
    expect(log).toEqual(['question:start', 'question:end', 'open:start']);
  });

  it('merges an identical request that is still waiting', async () => {
    const q = createRequestQueue();
    const gate = deferred<void>();
    let runs = 0;
    q.enqueue('send:first', async () => {
      await gate.promise;
      return 'x';
    });
    const job = async () => {
      runs++;
      return 'explained';
    };
    const p1 = q.enqueue('send:explain romans 8:3', job);
    const p2 = q.enqueue('send:explain romans 8:3', job);
    expect(p2).toBe(p1);
    expect(q.waiting).toBe(2);
    gate.resolve();
    await p2;
    expect(runs).toBe(1);
  });

  it('runs the same request again once the earlier one has started', async () => {
    const q = createRequestQueue();
    let runs = 0;
    await q.enqueue('send:again', async () => ++runs);
    await q.enqueue('send:again', async () => ++runs);
    expect(runs).toBe(2);
  });

  it('keeps going after a failing request', async () => {
    const q = createRequestQueue();
    const failed = q.enqueue('a', async () => {
      throw new Error('engine down');
    });
    const next = q.enqueue('b', async () => 'ok');
    await expect(failed).rejects.toThrow('engine down');
    await expect(next).resolves.toBe('ok');
  });

  it('clear() skips waiting requests and tells the running one it is stale', async () => {
    const q = createRequestQueue();
    const gate = deferred<void>();
    let staleSeen: boolean | undefined;
    let skippedRan = false;
    const running = q.enqueue('a', async (isCurrent) => {
      await gate.promise;
      staleSeen = !isCurrent();
      return isCurrent() ? 'applied' : undefined;
    });
    const skipped = q.enqueue('b', async () => {
      skippedRan = true;
      return 'b';
    });
    await tick();
    q.clear();
    // A request after "New study" does not wait for the dropped one.
    const fresh = q.enqueue('c', async () => 'fresh');
    await expect(fresh).resolves.toBe('fresh');
    gate.resolve();
    await expect(running).resolves.toBeUndefined();
    await expect(skipped).resolves.toBeUndefined();
    expect(staleSeen).toBe(true);
    expect(skippedRan).toBe(false);
  });
});
