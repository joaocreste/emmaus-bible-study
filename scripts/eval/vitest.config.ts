/**
 * Tests of the eval harness (npm run eval:test). Kept out of the main suite: they read the
 * local run logs (.kb-cache/logs, not in git) and start the runner in child processes.
 * Everything runs offline: the runner is only ever started with --dry-run or without the
 * paid opt-in (to check that it refuses).
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: fileURLToPath(new URL('../..', import.meta.url)),
  test: {
    environment: 'node',
    include: ['scripts/eval/__tests__/*.test.ts'],
    // a dry run loads the knowledge base in a fresh process (and rebuilds its index after kb code changes)
    testTimeout: 240_000,
  },
});
