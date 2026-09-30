import { createContext, useContext, type ReactNode } from 'react';
import type { ProviderRegistry } from './types';

const ProvidersContext = createContext<ProviderRegistry | null>(null);

export function ProvidersProvider({ registry, children }: { registry: ProviderRegistry; children: ReactNode }) {
  return <ProvidersContext.Provider value={registry}>{children}</ProvidersContext.Provider>;
}

/** Access the provider registry from any component. */
export function useProviders(): ProviderRegistry {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error('useProviders must be used inside <ProvidersProvider>');
  return ctx;
}
