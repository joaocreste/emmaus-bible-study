/**
 * Public-build step (GitHub Pages): remove data the public edition may not redistribute.
 *
 * STEPBible's TBESH header: "The Brief lexicon is based on Abridged BDB by Online Bible …
 * Permission should be gained from Online Bible before these definitions are applied in
 * any project." Until that permission exists, the public site keeps the Hebrew lemmas,
 * transliterations and glosses (created by Tyndale House scholars, CC BY 4.0) and drops
 * the definitions. Local development keeps everything.
 *
 * Usage (CI, after `npm run data:build -- --only=stepbible`):  node scripts/public/strip-restricted.ts
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'public', 'data', 'lexicon', 'H');
let files = 0;
let stripped = 0;
for (const name of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const path = join(dir, name);
  const shard = JSON.parse(readFileSync(path, 'utf8')) as Record<string, { d?: string }[]>;
  for (const entries of Object.values(shard)) {
    for (const entry of entries) {
      if (entry.d) {
        entry.d = '';
        stripped++;
      }
    }
  }
  writeFileSync(path, JSON.stringify(shard));
  files++;
}
console.log(`strip-restricted: removed ${stripped} Hebrew definitions from ${files} lexicon shards`);
