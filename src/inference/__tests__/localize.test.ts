import { describe, expect, it } from 'vitest';
import { normalizeStatus } from '../client';
import { errorText, statusReasonText } from '../localize';

describe('localised inference codes', () => {
  const down = normalizeStatus({ available: false, model: 'm', reason: 'The Claude API account behind this server has no remaining credit.', reasonCode: 'no-credit', knowledgeBase: { documents: 0, corpora: [] } })!;

  it('keeps reasonCode through normalizeStatus (and drops an unknown one)', () => {
    expect(down.reasonCode).toBe('no-credit');
    expect(normalizeStatus({ available: false, reasonCode: 'bogus' })?.reasonCode).toBeUndefined();
  });

  it('English keeps the server wording; other languages use the catalog', () => {
    expect(statusReasonText(down, 'en')).toBe(down.reason);
    expect(statusReasonText(down, 'pt')).toMatch(/sem créditos/);
    expect(statusReasonText({ ...down, reasonCode: undefined }, 'fr')).toBe(down.reason);
    expect(statusReasonText({ ...down, available: true }, 'pt')).toBeUndefined();
    expect(errorText({ code: 'rate-limited', message: 'Rate limit.' }, 'en')).toBe('Rate limit.');
    expect(errorText({ code: 'rate-limited', message: 'Rate limit.' }, 'es')).toMatch(/límite/);
  });
});
