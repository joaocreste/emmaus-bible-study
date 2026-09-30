import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end checks of the principal flows. Uses the system Chrome (no browser download).
 *   npm run test:e2e
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4178',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } }, testIgnore: /mobile\.spec\.ts/ },
    { name: 'phone', use: { ...devices['iPhone 13'], browserName: 'chromium', channel: 'chrome' }, testMatch: /mobile\.spec\.ts/ },
  ],
  webServer: {
    command: 'npx vite --port 4178 --strictPort',
    // never call the paid API from the browser tests, even when .env.local holds a key
    env: { EMMAUS_LIVE: 'off' },
    url: 'http://localhost:4178',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
