/**
 * Composition root. Swap implementations here (e.g. a remote ScriptureProvider,
 * a database-backed CommentaryProvider, a retrieval-backed TopicProvider)
 * without touching the engine or the UI.
 */
import { createCuratedProviders } from './curated';
import { createLocalDatasetProviders } from './local';
import type { ProviderRegistry } from './types';

export interface ProviderRegistryOptions {
  /** base URL of the bundled open datasets (default: `${import.meta.env.BASE_URL}data`) */
  dataBaseUrl?: string;
  /** allow live fallback to the Free Use Bible API for resources not bundled locally */
  allowRemoteFallback?: boolean;
}

export function createProviderRegistry(options: ProviderRegistryOptions = {}): ProviderRegistry {
  const local = createLocalDatasetProviders(options);
  const curated = createCuratedProviders();
  return { ...local, ...curated };
}
