/**
 * Build the creeds/confessions/catechisms corpora and the Catholic Encyclopedia corpus
 * of the Emmaus knowledge base (kb/corpus/confessions-*.json, kb/corpus/catholic-encyclopedia.json).
 *
 *   node scripts/kb/confessions/build.ts                 # everything (downloads are cached)
 *   node scripts/kb/confessions/build.ts --only=reformed,lutheran
 *   node scripts/kb/confessions/build.ts --offline       # rebuild from .kb-cache only
 *
 * Only public-domain texts and translations are used; each module in sources/ documents its
 * edition, the site the text was read from and what was kept or dropped.
 * Node >= 22.18 (type stripping). The resolve hook below lets these scripts import the
 * app's framework-free domain modules (src/domain/*.ts use extensionless imports).
 */
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if ((specifier.startsWith('.') || specifier.startsWith('/')) && !/\.[cm]?[jt]s$/.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw err;
    }
  },
});

const { main } = await import('./main.ts');
await main(process.argv.slice(2));
