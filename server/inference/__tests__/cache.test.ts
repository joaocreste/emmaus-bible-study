import { mkdirSync, mkdtempSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generatorVersion } from '../cache';

describe('generator version', () => {
  let root: string;
  const validate = () => join(root, 'server/inference/validate.ts');

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'emmaus-generator-'));
    mkdirSync(join(root, 'server/inference'), { recursive: true });
    writeFileSync(validate(), 'export const rule = 1;\n');
  });

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('is stable while the generator files are unchanged', () => {
    expect(generatorVersion(root)).toBe(generatorVersion(root));
  });

  it('changes when a generator file is edited while the server runs (hot reload)', () => {
    const before = generatorVersion(root);
    writeFileSync(validate(), 'export const rule = 1;\nexport const publisherNotes = true;\n');
    expect(generatorVersion(root)).not.toBe(before);
  });

  it('changes when an edit keeps the file size but moves its mtime', () => {
    const before = generatorVersion(root);
    const { mtime } = statSync(validate());
    writeFileSync(validate(), 'export const rule = 2;\n');
    utimesSync(validate(), mtime, new Date(mtime.getTime() + 5_000));
    expect(generatorVersion(root)).not.toBe(before);
  });

  it('changes when a generator file appears', () => {
    const before = generatorVersion(root);
    writeFileSync(join(root, 'server/inference/prompt.ts'), 'export const PROMPT = "";\n');
    expect(generatorVersion(root)).not.toBe(before);
  });

  it('hashes contents, not timestamps: touching a file keeps the version', () => {
    const before = generatorVersion(root);
    const { atime, mtime } = statSync(validate());
    utimesSync(validate(), atime, new Date(mtime.getTime() + 5_000));
    expect(generatorVersion(root)).toBe(before);
  });

  it('does not reread the files while their size and mtime are unchanged', () => {
    const at = new Date('2026-01-01T00:00:00Z');
    utimesSync(validate(), at, at);
    const before = generatorVersion(root);
    writeFileSync(validate(), 'export const rule = 3;\n');
    utimesSync(validate(), at, at);
    expect(generatorVersion(root)).toBe(before);
  });
});
