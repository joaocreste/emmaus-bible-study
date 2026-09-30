/**
 * Emmaus data pipeline — entry point (see pipeline.ts and scripts/data/README.md).
 *
 *   npm run data:build                                   # everything
 *   npm run data:build -- --only=xrefs,tyndale           # selected steps (manifest is merged)
 *   npm run data:build -- --only=scripture --versions=LSG,NCL   # selected Bible versions
 *   npm run data:build -- --offline                      # use the cache only
 *
 * Registers extension-less module resolution first (the app's src/ modules import each other
 * without extensions), then loads the pipeline.
 */
import { registerTsResolution } from './lib/resolve-ts.ts';

registerTsResolution();
await import('./pipeline.ts');
