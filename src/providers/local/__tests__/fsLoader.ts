/**
 * Node file-system DataLoader for tests: reads the generated datasets in public/data.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import type { DataLoader } from '../loader';

export const DATA_ROOT = fileURLToPath(new URL('../../../../public/data/', import.meta.url));

export function createFsLoader(root: string = DATA_ROOT): DataLoader & { reads: string[] } {
  const reads: string[] = [];
  return {
    reads,
    async json<T>(path: string): Promise<T | null> {
      reads.push(path);
      try {
        return JSON.parse(await readFile(join(root, path), 'utf8')) as T;
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
        throw err;
      }
    },
  };
}
