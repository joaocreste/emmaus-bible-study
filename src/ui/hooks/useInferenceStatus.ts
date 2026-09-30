import { useEffect, useState } from 'react';
import { translate } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';
import { inferenceClient, type InferenceClient } from '../../inference/client';
import type { InferenceStatus } from '../../inference/protocol';

/**
 * The inference layer's status (model, knowledge-base size, or why it is unavailable),
 * shared with the engine through the app-wide client and its short cache. `undefined`
 * until the first answer. Re-renders when a fresh status arrives (e.g. after the engine
 * learns the API key is missing).
 */
export function useInferenceStatus(client: InferenceClient = inferenceClient): InferenceStatus | undefined {
  const [status, setStatus] = useState<InferenceStatus | undefined>(() => client.peekStatus());
  useEffect(() => {
    let alive = true;
    const off = client.subscribe((s) => {
      if (alive) setStatus(s);
    });
    void client.getStatus().then((s) => {
      if (alive) setStatus(s);
    });
    return () => {
      alive = false;
      off();
    };
  }, [client]);
  return status;
}

/** "Claude · claude-opus-5 · 24,512 knowledge-base documents" (in the reader's language). */
export function describeAvailable(status: InferenceStatus, locale: Locale = 'en'): string {
  const parts = ['Claude'];
  if (status.model) parts.push(status.model);
  const n = status.knowledgeBase.documents;
  if (n > 0) parts.push(translate(locale, 'shell', 'live.documents', { count: n }));
  return parts.join(' · ');
}
