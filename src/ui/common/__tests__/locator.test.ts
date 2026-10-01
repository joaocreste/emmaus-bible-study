import { describe, expect, it } from 'vitest';
import { localizeLocator } from '../locator';

const on = (ref: string) => `sobre ${ref}`;

describe('citation locators in the reader’s language', () => {
  it('translates a locator that is only a Bible reference, long or short', () => {
    expect(localizeLocator('Malachi 2:13–16', 'pt', on)).toBe('Malaquias 2:13–16');
    expect(localizeLocator('1 Corinthians 7:10–16', 'pt', on)).toBe('1 Coríntios 7:10–16');
    expect(localizeLocator('Psalm 11:5', 'es', on)).toMatch(/^Salmo(s)? 11:5$/);
    expect(localizeLocator('on Mal 2:16', 'pt', on)).toMatch(/^sobre Ml 2:16$/);
  });

  it('leaves English readers and every other kind of locator as the source gives it', () => {
    expect(localizeLocator('Malachi 2:13–16', 'en', on)).toBe('Malachi 2:13–16');
    for (const l of ['ch. 24 §5', 'Session 24, Canons on the Sacrament of Matrimony, can. 5', 's.v. Divorce', 'Ps 22:6 (= Ps 23:6)', 'Q. 1', 'on the whole book']) {
      expect(localizeLocator(l, 'pt', on)).toBe(l);
    }
  });
});
