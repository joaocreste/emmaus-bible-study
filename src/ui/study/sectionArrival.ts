import { createContext, useContext } from 'react';
import type { SectionId } from '../../domain/models';

/**
 * Did this section arrive after the page first rendered (a generated page still being
 * composed)? StudyWorkspace provides it; StudySection fades such sections in.
 */
export const SectionArrivalContext = createContext<(id: SectionId) => boolean>(() => false);

export function useArrivedLate(id: SectionId): boolean {
  return useContext(SectionArrivalContext)(id);
}
