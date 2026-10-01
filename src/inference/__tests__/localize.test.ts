import { describe, expect, it } from 'vitest';
import { normalizeStatus } from '../client';
import { errorText, statusReasonText } from '../localize';

describe('localised inference codes', () => {
  const down = normalizeStatus({ available: false, model: 'm', reason: 'The Claude API account behind this server has no remaining credit.', reasonCode: 'no-credit', knowledgeBase: { documents: 0, corpora: [] } })!;

  it('keeps reasonCode through normalizeStatus (and drops an unknown one)', () => {
    expect(down.reasonCode).toBe('no-credit');
    expect(normalizeStatus({ available: false, reasonCode: 'bogus' })?.reasonCode).toBeUndefined();
  });

  it('speaks to the reader in every language, never with the server’s setup or model details', () => {
    expect(statusReasonText(down, 'en')).toBe('Composing new studies is paused for now. Studies from the library still open as usual.');
    expect(statusReasonText(down, 'pt')).toBe('A geração de novos estudos está pausada no momento. Os estudos da biblioteca continuam abrindo normalmente.');
    // no code: a plain reason, not the server's text
    expect(statusReasonText({ ...down, reasonCode: undefined }, 'fr')).toMatch(/^impossible de composer de nouvelles études/);
    expect(statusReasonText({ ...down, available: true }, 'pt')).toBeUndefined();
    expect(errorText({ code: 'rate-limited', message: 'Rate limit.' }, 'en')).toBe('Many studies are being composed right now — please try again in a minute.');
    expect(errorText({ code: 'rate-limited', message: 'Rate limit.' }, 'es')).toMatch(/^Se están generando muchos estudios/);
    for (const locale of ['en', 'pt', 'fr', 'es'] as const) {
      for (const code of ['no-credentials', 'no-credit', 'loading', 'kb-error', 'rejected'] as const) {
        expect(statusReasonText({ ...down, reasonCode: code }, locale)).not.toMatch(/Claude|Anthropic|API|\.env|npm|server/i);
      }
    }
  });
});

describe('composed-page summary lines in the reader’s language', () => {
  it('counts each section in the page language', async () => {
    const { translate } = await import('../../i18n/catalog');
    expect(translate('pt', 'inference', 'compose.count.key-passages', { count: 9, section: 'Passagens para cada parte da pergunta' })).toBe('Passagens para cada parte da pergunta — 9 passagens');
    expect(translate('pt', 'inference', 'compose.count.original-languages', { count: 1, section: 'Palavras-chave' })).toBe('Palavras-chave — 1 palavra-chave');
    expect(translate('es', 'inference', 'compose.count.commentary', { count: 4, section: 'Voces' })).toBe('Voces — 4 voces');
    expect(translate('fr', 'inference', 'compose.count.theology', { count: 5, section: 'Théologie' })).toBe('Théologie — 5 éléments de théologie');
    expect(translate('pt', 'inference', 'compose.stopped.interrupted', { sections: 'Passagens-chave', theology: 'no' })).toMatch(/^A geração foi interrompida.*\(tem Passagens-chave\); onde os cristãos divergem/);
  });
});
