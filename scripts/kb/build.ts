/**
 * Entry point for `npm run kb:build` (Node ≥ 22.18: native TypeScript type-stripping + global fetch).
 *
 * The build reuses the app's domain code (src/domain/reference.ts for refKey/formatRef),
 * whose imports are extensionless ("./books") as the bundler expects. Plain Node ESM needs
 * explicit extensions, so a resolve hook retries unresolved relative specifiers with ".ts"
 * before the build modules are loaded.
 */
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[cm]?[jt]s$/.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw err;
    }
  },
});

const { main } = await import('./main.ts');
await main(process.argv.slice(2)).catch((err: unknown) => {
  console.error(err instanceof Error ? (err.stack ?? err.message) : err);
  process.exit(1);
});
