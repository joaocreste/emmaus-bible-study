/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { emmausInference } from './server/vitePlugin';

export default defineConfig({
  // GitHub Pages serves the site under /<repository>/ (set by .github/workflows/pages.yml)
  base: process.env.GITHUB_PAGES_BASE ?? '/',
  plugins: [react(), emmausInference()],
  server: { port: 5173 },
  build: {
    // The curated library (study content, ~850 kB) is data, split into its own chunk;
    // a hosted version would serve it from an API/CDN instead of bundling it.
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        // Keep the framework and the curated library in their own long-lived chunks.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 20 },
            { name: 'curated-library', test: /src[\\/]data[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'server/**/*.test.ts'],
  },
});
