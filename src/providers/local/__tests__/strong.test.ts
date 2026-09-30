import { describe, expect, it } from 'vitest';
import { normalizeStrong, strongBase, strongShard, strongShardPath } from '../strong';

describe('normalizeStrong', () => {
  it('drops leading zeros and upper-cases', () => {
    expect(normalizeStrong('G02631')).toMatchObject({ base: 'G2631', extended: 'G2631', suffix: undefined, language: 'G', number: 2631 });
    expect(normalizeStrong('g2631')?.base).toBe('G2631');
  });

  it('keeps the disambiguation letter separately', () => {
    expect(normalizeStrong('H0430G')).toMatchObject({ base: 'H430', suffix: 'G', extended: 'H430G' });
    expect(normalizeStrong('H7462b')).toMatchObject({ base: 'H7462', suffix: 'B', extended: 'H7462B' });
  });

  it('accepts STEPBible instance markers and root braces', () => {
    expect(normalizeStrong('G1510_A')?.extended).toBe('G1510');
    expect(normalizeStrong('{H3068G}')?.extended).toBe('H3068G');
  });

  it('rejects non-Strong strings', () => {
    expect(normalizeStrong('')).toBeNull();
    expect(normalizeStrong('X123')).toBeNull();
    expect(normalizeStrong('G0')).toBeNull();
    expect(normalizeStrong('grace')).toBeNull();
    expect(strongBase('nope')).toBeNull();
  });

  it('computes shard paths shared by lexicon and concordance', () => {
    const n = normalizeStrong('G2631')!;
    expect(strongShard(n)).toBe(26);
    expect(strongShardPath('lexicon', n)).toBe('lexicon/G/26.json');
    expect(strongShardPath('concordance', normalizeStrong('H7462B')!)).toBe('concordance/H/74.json');
  });
});
