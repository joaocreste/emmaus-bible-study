import { describe, expect, it } from 'vitest';
import type { CuratedStudy } from '../../../../domain/models';
import type { StudyOverlay } from '../types';
import { localizeStudy } from '../localize';

const studies = import.meta.glob<CuratedStudy>('../../studies/*.ts', { eager: true, import: 'default' });
const overlays = import.meta.glob<StudyOverlay>('../*/*.ts', { eager: true, import: 'default' });

function citedSources(value: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((v) => citedSources(v, out));
  else if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if (Array.isArray(o.citations)) for (const c of o.citations as { sourceId: string }[]) out.add(c.sourceId);
    Object.values(o).forEach((v) => citedSources(v, out));
  }
  return out;
}

describe('localized Scripture attribution', () => {
  it.each([
    ['fr', 'louis-segond-1910'],
    ['pt', 'biblia-livre'],
    ['es', 'reina-valera-1909'],
  ] as const)('%s: BSB citations are credited to the default version the translated prose quotes', (locale, sourceId) => {
    const romans = studies['../../studies/romans-8.ts'];
    const overlay = overlays[`../${locale}/romans-8.ts`];
    const localized = localizeStudy(romans, overlay, locale);
    const cited = citedSources(localized);
    expect(cited.has('bsb')).toBe(false);
    expect(cited.has(sourceId)).toBe(true);
    // the English study is untouched
    expect(citedSources(romans).has('bsb')).toBe(true);
  });
});
