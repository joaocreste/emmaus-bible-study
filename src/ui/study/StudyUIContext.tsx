/**
 * Study UI state — the dashboard's reaction to the conversation.
 *
 * StudyWorkspace mounts <StudyUIProvider> with the session's `focus`/`focusSeq`.
 * Every time the engine (or the user, via chat chips) issues a DashboardFocus,
 * this provider derives what should be highlighted, expanded, pinned, filtered
 * and marked as "updated from your question". Section components read it with
 * `useStudyUI()` and never interpret DashboardFocus themselves.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CrossReferenceFilter, DashboardFocus, SectionId, Study, VerseRef } from '../../domain/models';
import { verseKey } from '../../domain/reference';
import { scrollToElement } from './StudyNavigation.utils';
import { sectionDomId } from './types';

export interface StudyUIValue {
  study: Study;
  focusSeq: number;
  focusReason?: string;
  /** key word ids to mark strongly in Scripture and open in Original languages */
  highlightedWordIds: ReadonlySet<string>;
  /** verseKey()s to band-highlight in Scripture */
  highlightedVerseKeys: ReadonlySet<string>;
  /** first highlighted verse — drives verse-scoped panels (classic commentary, dataset xrefs) */
  activeVerse?: VerseRef;
  setActiveVerse(v: VerseRef | undefined): void;
  /** item ids floated to the top of their section */
  pinnedIds: ReadonlySet<string>;
  /** items changed by the latest focus (pulse + "Updated from your question") */
  updatedIds: ReadonlySet<string>;
  /** sections changed since the user last visited them (nav dots) */
  updatedSections: ReadonlySet<SectionId>;
  markSectionSeen(id: SectionId): void;
  isExpanded(id: string): boolean;
  setExpanded(id: string, open: boolean): void;
  toggleExpanded(id: string): void;
  crossRefFilter: CrossReferenceFilter;
  setCrossRefFilter(f: CrossReferenceFilter): void;
  commentaryAuthorIds: string[];
  setCommentaryAuthorIds(ids: string[]): void;
  /** clears highlight/pins/filters from the last focus (keeps user-expanded items) */
  clearFocus(): void;
  scrollToSection(id: SectionId): void;
}

const Ctx = createContext<StudyUIValue | null>(null);

interface ProviderProps {
  study: Study;
  focus: DashboardFocus | null;
  focusSeq: number;
  children: ReactNode;
}

const EMPTY = new Set<string>();

export function StudyUIProvider({ study, focus, focusSeq, children }: ProviderProps) {
  const [highlightedWordIds, setHighlightedWordIds] = useState<ReadonlySet<string>>(EMPTY);
  const [highlightedVerseKeys, setHighlightedVerseKeys] = useState<ReadonlySet<string>>(EMPTY);
  const [activeVerse, setActiveVerse] = useState<VerseRef | undefined>();
  const [pinnedIds, setPinnedIds] = useState<ReadonlySet<string>>(EMPTY);
  const [updatedIds, setUpdatedIds] = useState<ReadonlySet<string>>(EMPTY);
  const [updatedSections, setUpdatedSections] = useState<ReadonlySet<SectionId>>(new Set());
  const [expanded, setExpandedSet] = useState<ReadonlySet<string>>(EMPTY);
  const [crossRefFilter, setCrossRefFilter] = useState<CrossReferenceFilter>({});
  const [commentaryAuthorIds, setCommentaryAuthorIds] = useState<string[]>([]);
  const [focusReason, setFocusReason] = useState<string | undefined>();

  // Reset everything when the study changes.
  const studyId = study.id;
  const lastStudy = useRef(studyId);
  useEffect(() => {
    if (lastStudy.current === studyId) return;
    lastStudy.current = studyId;
    setHighlightedWordIds(EMPTY);
    setHighlightedVerseKeys(EMPTY);
    setActiveVerse(undefined);
    setPinnedIds(EMPTY);
    setUpdatedIds(EMPTY);
    setUpdatedSections(new Set());
    setExpandedSet(EMPTY);
    setCrossRefFilter({});
    setCommentaryAuthorIds([]);
    setFocusReason(undefined);
  }, [studyId]);

  // Apply each new focus directive exactly once (focusSeq changes even for equal objects).
  const appliedSeq = useRef(-1);
  useEffect(() => {
    if (!focus || appliedSeq.current === focusSeq) return;
    appliedSeq.current = focusSeq;
    const words = new Set(focus.highlightWordIds ?? []);
    const verses = focus.highlightVerses ?? [];
    setHighlightedWordIds(words);
    setHighlightedVerseKeys(new Set(verses.map(verseKey)));
    setActiveVerse(verses[0]);
    setPinnedIds(new Set(focus.pinIds ?? []));
    setExpandedSet((prev) => new Set([...prev, ...(focus.expandIds ?? []), ...words]));
    setUpdatedIds(new Set([...(focus.expandIds ?? []), ...(focus.pinIds ?? []), ...words]));
    if (focus.section) setUpdatedSections((prev) => new Set([...prev, focus.section!]));
    if (focus.crossReferenceFilter) setCrossRefFilter(focus.crossReferenceFilter);
    if (focus.commentaryAuthorIds) setCommentaryAuthorIds(focus.commentaryAuthorIds);
    setFocusReason(focus.reason);
  }, [focus, focusSeq]);

  const isExpanded = useCallback((id: string) => expanded.has(id), [expanded]);
  const setExpanded = useCallback((id: string, open: boolean) => {
    setExpandedSet((prev) => {
      if (prev.has(id) === open) return prev;
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);
  const toggleExpanded = useCallback((id: string) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const markSectionSeen = useCallback((id: SectionId) => {
    setUpdatedSections((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);
  const clearFocus = useCallback(() => {
    setHighlightedWordIds(EMPTY);
    setHighlightedVerseKeys(EMPTY);
    setPinnedIds(EMPTY);
    setUpdatedIds(EMPTY);
    setCrossRefFilter({});
    setCommentaryAuthorIds([]);
    setFocusReason(undefined);
  }, []);
  const scrollToSection = useCallback((id: SectionId) => {
    const el = document.getElementById(sectionDomId(id));
    // scroll only the nearest scrolling ancestor (never overflow-hidden app frames)
    if (el) scrollToElement(el);
  }, []);

  const value = useMemo<StudyUIValue>(
    () => ({
      study,
      focusSeq,
      focusReason,
      highlightedWordIds,
      highlightedVerseKeys,
      activeVerse,
      setActiveVerse,
      pinnedIds,
      updatedIds,
      updatedSections,
      markSectionSeen,
      isExpanded,
      setExpanded,
      toggleExpanded,
      crossRefFilter,
      setCrossRefFilter,
      commentaryAuthorIds,
      setCommentaryAuthorIds,
      clearFocus,
      scrollToSection,
    }),
    [
      study,
      focusSeq,
      focusReason,
      highlightedWordIds,
      highlightedVerseKeys,
      activeVerse,
      pinnedIds,
      updatedIds,
      updatedSections,
      markSectionSeen,
      isExpanded,
      setExpanded,
      toggleExpanded,
      crossRefFilter,
      commentaryAuthorIds,
      clearFocus,
      scrollToSection,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** The study UI state when inside a <StudyUIProvider>, else null (for components also used outside the dashboard). */
export function useOptionalStudyUI(): StudyUIValue | null {
  return useContext(Ctx);
}

export function useStudyUI(): StudyUIValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStudyUI must be used inside <StudyUIProvider>');
  return v;
}

/** Sort helper: pinned items first, original order otherwise. */
export function pinnedFirst<T extends { id: string }>(items: T[], pinned: ReadonlySet<string>): T[] {
  if (pinned.size === 0) return items;
  return [...items].sort((a, b) => Number(pinned.has(b.id)) - Number(pinned.has(a.id)));
}
