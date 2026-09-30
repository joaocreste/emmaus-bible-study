/**
 * Data hooks over the provider registry. Components never call fetch directly —
 * they ask for domain objects, so providers can be swapped (local → API) freely.
 */
import type { BookId, PassageRef, TranslationId } from '../../domain/models';
import { refKey } from '../../domain/reference';
import { useProviders } from '../../providers/ProvidersContext';
import { useResource } from './useResource';

export function usePassage(ref: PassageRef | undefined, translation: TranslationId) {
  const { scripture } = useProviders();
  return useResource(ref ? `passage:${translation}:${refKey(ref)}` : null, () => scripture.getPassage(ref!, translation));
}

export function useOriginalText(ref: PassageRef | undefined) {
  const { originalText } = useProviders();
  return useResource(ref ? `original:${refKey(ref)}` : null, () => originalText.getOriginalText(ref!));
}

export function useLexiconEntry(strong: string | undefined) {
  const { lexicon } = useProviders();
  return useResource(strong ? `lexicon:${strong}` : null, () => lexicon.getEntry(strong!));
}

export function useOccurrences(strong: string | undefined, limit = 60) {
  const { lexicon } = useProviders();
  return useResource(strong ? `occ:${strong}:${limit}` : null, () => lexicon.getOccurrences(strong!, limit));
}

export function useDatasetCrossRefs(ref: PassageRef | undefined, limitPerVerse = 8) {
  const { crossReferences } = useProviders();
  return useResource(ref ? `xrefs:${refKey(ref)}:${limitPerVerse}` : null, () =>
    crossReferences.getCrossReferences(ref!, { limitPerVerse }),
  );
}

export function useCommentary(commentaryId: string | undefined, ref: PassageRef | undefined) {
  const { commentary } = useProviders();
  return useResource(commentaryId && ref ? `commentary:${commentaryId}:${refKey(ref)}` : null, () =>
    commentary.getCommentary(commentaryId!, ref!),
  );
}

export function useBookIntroduction(book: BookId | undefined) {
  const { historicalContext } = useProviders();
  return useResource(book ? `intro:${book}` : null, () => historicalContext.getBookIntroduction(book!));
}
