/**
 * Runs before `npm run dev`: STEPBible's tagged Hebrew/Greek text, lexicons and concordance are
 * not stored in this repository (STEPBible asks projects to point to their repository rather than
 * redistribute the data), so a fresh clone fetches and builds them once from github.com/STEPBible.
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();
const needed = ['public/data/original/GEN.json', 'public/data/original/REV.json', 'public/data/lexicon/G/0.json', 'public/data/lexicon/H/0.json', 'public/data/concordance/G/0.json'];
const missing = needed.filter((p) => !existsSync(join(root, p)));
if (missing.length === 0) process.exit(0);

console.log('Emmaus: fetching STEPBible data (tagged Hebrew/Greek, lexicons, concordance) — one time, needs network…');
const r = spawnSync(process.execPath, ['scripts/data/build-all.ts', '--only=stepbible'], { stdio: 'inherit', cwd: root });
if (r.status !== 0) {
  console.error('Emmaus: could not build the STEPBible data. The app will run, but interlinear text and lexicon lookups will be unavailable. Retry with: npm run data:build -- --only=stepbible');
}
