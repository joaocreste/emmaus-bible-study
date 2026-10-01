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

/** "Ready · 24,512 knowledge-base documents" (in the reader’s language). */
export function describeAvailable(status: InferenceStatus, locale: Locale = 'en'): string {
  // the reader's terms: what is ready and how much it draws on — not the model behind it
  const n = status.knowledgeBase.documents;
  return n > 0 ? translate(locale, 'shell', 'live.ready', { documents: translate(locale, 'shell', 'live.documents', { count: n }) }) : translate(locale, 'shell', 'live.readyShort');
}
