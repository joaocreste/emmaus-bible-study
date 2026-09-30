import { describe, expect, it } from 'vitest';
import type { ChatMessage, Study } from '../../domain/models';
import { generatedStudy } from '../../inference/__tests__/fakes';
import { createInitialState, RELOCALIZE_NOTICE_PREFIX, sessionReducer, type InternalSessionState } from '../sessionReducer';
import { DEFAULT_SETTINGS, initialSettings, sanitizeSettings, withLocale } from '../settings';

function curated(title: string, locale: 'en' | 'pt' | 'fr' | 'es' = 'en'): Study {
  return {
    ...generatedStudy(),
    id: 'romans-8',
    depth: 'curated',
    kind: 'passage',
    title,
    passage: { book: 'ROM', startChapter: 8 },
    generation: undefined,
    layout: undefined,
    localization: locale === 'en' ? { locale } : { locale, translatedFrom: 'en' },
  };
}

const notice = (text: string): ChatMessage => ({ id: `${RELOCALIZE_NOTICE_PREFIX}1`, role: 'system', text, createdAt: 3 });

function withOpenStudy(study: Study): InternalSessionState {
  let s = createInitialState(DEFAULT_SETTINGS);
  s = sessionReducer(s, { type: 'request/start', message: { id: 'u1', role: 'user', text: 'Romans 8', createdAt: 1 }, text: 'Romans 8' });
  s = sessionReducer(s, {
    type: 'request/success',
    isPhone: false,
    result: {
      reply: { id: 'a1', role: 'assistant', text: 'Opening Romans 8.', createdAt: 2 },
      study,
      conversation: { activeVerse: { book: 'ROM', chapter: 8, verse: 28 } },
      intent: { kind: 'open-passage', confidence: 1, slots: {} },
      trace: [],
    },
  });
  return sessionReducer(s, { type: 'focus', focus: { section: 'original-languages' } });
}

describe('session — switching language mid-study', () => {
  it('swaps in the re-opened study in place: same focus, conversation and history, one notice', () => {
    const before = withOpenStudy(curated('Romans 8'));
    const pt = curated('Romanos 8', 'pt');
    const after = sessionReducer(before, { type: 'study/relocalize', study: pt, notice: notice('O estudo agora está em português.') });
    expect(after.study).toBe(pt);
    expect(after.studyTitles['romans-8']).toBe('Romanos 8');
    expect(after.studyCache['romans-8']).toBe(pt);
    expect(after.focus).toEqual(before.focus);
    expect(after.focusSeq).toBe(before.focusSeq); // no re-scroll
    expect(after.conversation).toEqual(before.conversation);
    expect(after.messages.slice(0, -1)).toEqual(before.messages); // no new assistant reply
    expect(after.messages.at(-1)).toMatchObject({ role: 'system', text: 'O estudo agora está em português.', studyId: 'romans-8' });
  });

  it('collapses consecutive language notices into the latest', () => {
    let s = withOpenStudy(curated('Romans 8'));
    s = sessionReducer(s, { type: 'study/relocalize', study: curated('Romanos 8', 'pt'), notice: notice('pt') });
    s = sessionReducer(s, { type: 'study/relocalize', study: curated('Romains 8', 'fr'), notice: notice('fr') });
    expect(s.messages.filter((m) => m.role === 'system').map((m) => m.text)).toEqual(['fr']);
    expect(s.study?.title).toBe('Romains 8');
  });

  it('ignores a stale result (the study changed or "New study" was pressed meanwhile)', () => {
    const open = withOpenStudy(curated('Romans 8'));
    const other = { ...curated('Salmo 23', 'pt'), id: 'psalm-23' };
    expect(sessionReducer(open, { type: 'study/relocalize', study: other })).toBe(open);
    const fresh = sessionReducer(open, { type: 'reset' });
    expect(sessionReducer(fresh, { type: 'study/relocalize', study: curated('Romanos 8', 'pt') })).toBe(fresh);
  });
});

describe('settings — language', () => {
  it('first visit follows the browser language, with that language’s default version', () => {
    expect(initialSettings(['pt-BR', 'en'])).toMatchObject({ locale: 'pt', translation: 'BLIVRE' });
    expect(initialSettings(['es-419'])).toMatchObject({ locale: 'es', translation: 'RVR1909' });
    expect(initialSettings(['fr-CA'])).toMatchObject({ locale: 'fr', translation: 'LSG' });
    expect(initialSettings(['de-DE'])).toMatchObject({ locale: 'en', translation: 'BSB' });
  });

  it('switching language keeps a version in that language, otherwise picks its default', () => {
    expect(withLocale({ ...DEFAULT_SETTINGS, translation: 'KJV' }, 'pt').translation).toBe('BLIVRE');
    expect(withLocale({ ...DEFAULT_SETTINGS, locale: 'fr', translation: 'DARBY' }, 'fr').translation).toBe('DARBY');
    expect(withLocale({ ...DEFAULT_SETTINGS, locale: 'es', translation: 'VBL' }, 'en').translation).toBe('BSB');
  });

  it('the locale survives storage round-trips and falls back when invalid', () => {
    expect(sanitizeSettings({ ...DEFAULT_SETTINGS, locale: 'pt', translation: 'NBV' })).toMatchObject({ locale: 'pt', translation: 'NBV' });
    expect(sanitizeSettings({ locale: 'de' }).locale).toBe('en');
  });

  it('a reducer settings update applies a language switch as one patch', () => {
    const s = createInitialState(DEFAULT_SETTINGS);
    const next = sessionReducer(s, { type: 'settings/update', patch: withLocale(s.settings, 'es') });
    expect(next.settings).toMatchObject({ locale: 'es', translation: 'RVR1909' });
  });
});
