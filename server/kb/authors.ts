/**
 * Who wrote a given commentary section. Most commentaries have one author (or one
 * named team); Matthew Henry’s Commentary does not: Henry died in 1714 having
 * reached the end of Acts, and Romans–Revelation were written by Nonconformist
 * continuators (see src/data/registry/shared-authors.ts). Where the registry names
 * the continuator of a book we attribute it; otherwise the section is attributed
 * to the continuators collectively — never to Henry.
 */
import { getBook } from '../../src/domain/books';
import type { BookId } from '../../src/domain/models';

const SINGLE_AUTHOR: Record<string, string> = {
  tyndale: 'tyndale-house-publishers',
  calvin: 'calvin',
  jfb: 'jamieson-fausset-brown',
  'keil-delitzsch': 'keil-delitzsch',
};

/** Continuators named in shared-authors.ts (J. B. Williams’s list, preface to vol. 6, CCEL mhc6). */
const HENRY_CONTINUATORS: Record<BookId, string> = {
  ROM: 'john-evans',
  '2CO': 'daniel-mayo',
  '1TH': 'daniel-mayo',
  '2TH': 'daniel-mayo',
};

const ACTS_ORDER = getBook('ACT').order;

export function commentaryAuthorId(commentaryId: string, book: BookId): string | undefined {
  if (commentaryId === 'matthew-henry') {
    if (getBook(book).order <= ACTS_ORDER) return 'matthew-henry';
    return HENRY_CONTINUATORS[book] ?? 'henry-continuators';
  }
  return SINGLE_AUTHOR[commentaryId];
}
