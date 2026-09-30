/**
 * Strong's number normalisation — the ONE rule shared by the data pipeline
 * (scripts/data), the original-text files, the lexicon shards and the
 * concordance shards. Keep this file dependency-free: the Node build script
 * imports it directly through native TypeScript type-stripping.
 *
 * Canonical forms
 *   base      "G2631", "H7462", "H430"   — language letter + number, no leading zeros
 *   suffix    "B", "G"                   — STEPBible disambiguation letter (extended /
 *                                          "dStrong" tag), upper-case, optional
 *   extended  "H7462B", "H430G", "G2631" — base + suffix (equals base when no suffix)
 *
 * Accepted input spellings: "G2631", "g02631", "H0430G", "H7462b", "G1510_A"
 * (instance markers after "_" are dropped), "{H5046}" (braces from TAHOT root tags).
 *
 * Why keep the suffix separately: STEPBible splits some Strong's numbers into
 * distinct words or senses (H7462A "House of Shepherds" vs H7462B "to pasture"),
 * while the classic Strong's number is still the key most tools and users know.
 * Lexicon and concordance files are therefore keyed by `base`, and hold the
 * per-suffix detail inside the record.
 */

export type StrongLanguage = 'G' | 'H';

export interface NormalizedStrong {
  language: StrongLanguage;
  /** numeric part, e.g. 2631 */
  number: number;
  /** "G2631" */
  base: string;
  /** disambiguation letter, e.g. "B" (undefined when absent) */
  suffix?: string;
  /** base + suffix, e.g. "H7462B" */
  extended: string;
}

const STRONG_RE = /^\{?\s*([GH])\s*0*(\d{1,5})\s*([A-Z])?\s*\}?$/;

/** Parse any Strong's spelling into its canonical parts, or null when it is not a Strong's tag. */
export function normalizeStrong(raw: string): NormalizedStrong | null {
  if (!raw) return null;
  const cleaned = raw.trim().toUpperCase().split('_')[0];
  const m = STRONG_RE.exec(cleaned);
  if (!m) return null;
  const language = m[1] as StrongLanguage;
  const number = Number(m[2]);
  if (!Number.isFinite(number) || number <= 0) return null;
  const base = `${language}${number}`;
  const suffix = m[3] || undefined;
  return { language, number, base, suffix, extended: suffix ? base + suffix : base };
}

/** Canonical base form ("H0430G" → "H430"), or null. */
export function strongBase(raw: string): string | null {
  return normalizeStrong(raw)?.base ?? null;
}

/** Numbers per shard file for lexicon/concordance ("G2631" → shard 26). */
export const STRONG_SHARD_SIZE = 100;

/** Shard index of a Strong's number: floor(number / STRONG_SHARD_SIZE). */
export function strongShard(n: NormalizedStrong): number {
  return Math.floor(n.number / STRONG_SHARD_SIZE);
}

/** Relative data path of the shard holding this Strong's number, e.g. "lexicon/G/26.json". */
export function strongShardPath(kind: 'lexicon' | 'concordance', n: NormalizedStrong): string {
  return `${kind}/${n.language}/${strongShard(n)}.json`;
}
