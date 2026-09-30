/**
 * Module resolution for running the pipeline with Node's native TypeScript type-stripping:
 * the app's source (src/**) imports sibling modules without a file extension (Vite /
 * `moduleResolution: bundler` style, e.g. `import { BOOK_NAMES } from './bookNames'`), which
 * Node's ESM resolver rejects. This hook retries such relative specifiers with `.ts`, `.tsx`
 * and `/index.ts`. It must be registered before the pipeline modules are imported
 * (build-all.ts imports them dynamically for that reason).
 */
import { registerHooks } from 'node:module';

const HAS_EXTENSION = /\.[cm]?[jt]sx?$|\.json$/;

export function registerTsResolution(): void {
  registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code !== 'ERR_MODULE_NOT_FOUND' || !/^\.{1,2}\//.test(specifier) || HAS_EXTENSION.test(specifier)) throw err;
        for (const suffix of ['.ts', '.tsx', '/index.ts']) {
          try {
            return nextResolve(specifier + suffix, context);
          } catch {
            /* try the next suffix */
          }
        }
        throw err;
      }
    },
  });
}
