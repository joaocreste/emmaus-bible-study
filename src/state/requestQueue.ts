/**
 * Serialises requests to the study engine (framework-free, unit-tested).
 *
 * - Each job starts only after every earlier job has settled, so a question
 *   asked while another is being answered waits its turn instead of being
 *   dropped or superseding the answer in flight.
 * - A job whose key matches one that is still waiting joins it (double clicks,
 *   the same "Explain this verse" chosen twice) rather than running twice.
 * - `clear()` ("New study") skips everything waiting; a job already running is
 *   told through `isCurrent()` so it can discard its result.
 */
export interface RequestQueue {
  enqueue<T>(key: string, job: (isCurrent: () => boolean) => Promise<T | undefined>): Promise<T | undefined>;
  clear(): void;
  /** number of jobs waiting (not counting the one running) */
  readonly waiting: number;
}

export function createRequestQueue(): RequestQueue {
  let epoch = 0;
  let tail: Promise<unknown> = Promise.resolve();
  const waiting = new Map<string, Promise<unknown>>();

  return {
    enqueue<T>(key: string, job: (isCurrent: () => boolean) => Promise<T | undefined>): Promise<T | undefined> {
      const existing = waiting.get(key);
      if (existing) return existing as Promise<T | undefined>;
      const mine = epoch;
      const isCurrent = () => mine === epoch;
      const run = tail.then(() => {
        if (waiting.get(key) === run) waiting.delete(key);
        return isCurrent() ? job(isCurrent) : undefined;
      });
      waiting.set(key, run);
      // A failing job must not stall the queue.
      tail = run.catch(() => undefined);
      return run;
    },
    clear() {
      epoch++;
      waiting.clear();
      tail = Promise.resolve();
    },
    get waiting() {
      return waiting.size;
    },
  };
}
