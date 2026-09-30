/** Shared types for pipeline steps. */

export interface StepContext {
  /** max cross references kept per verse */
  xrefsPerVerse: number;
  /** verse counts per BSB chapter: "ROM.8" → 39 (filled by the scripture step or read back from disk) */
  lastVerse: (book: string, chapter: number) => number;
}

export interface DatasetReport {
  /** SourceRegistry id (or pseudo id for a group) */
  id: string;
  name: string;
  kind: string;
  urls: string[];
  license: string;
  licenseUrl?: string;
  attribution?: string;
  /** sha256 published by the Free Use Bible API for the whole resource */
  apiSha256?: string;
  /** git blob sha(s) published by the GitHub contents API, per source file */
  gitSha?: string | Record<string, string>;
  /** sha256 of the downloaded source file(s), computed locally */
  sourceSha256?: string | Record<string, string>;
  output: string;
  files: number;
  bytes: number;
  counts: Record<string, number>;
  notes?: string[];
  /** Bible versions: language of the version (non-English only) */
  language?: string;
  /** Bible versions (non-English): how the version's numbering was aligned with the English one */
  versification?: {
    /** standard (Paratext eng↔org) mapping groups applied */
    standardMappings: number;
    /** deuterocanonical books / additions left out */
    omitted: string[];
    /** other re-numberings, human-readable */
    repairs: string[];
    /** verses dropped as exact duplicates */
    dropped: string[];
    /** English verses inside another verse ("ACT 19:41→40") */
    combined: string[];
    /** English verses the version does not have ("MAT 17:21 (textual variant)") */
    absent: string[];
    /** anything left unaligned (should be empty) */
    residual: string[];
  };
}

export interface StepReport {
  step: string;
  datasets: DatasetReport[];
  counts?: Record<string, number>;
  extra?: Record<string, unknown>;
}
