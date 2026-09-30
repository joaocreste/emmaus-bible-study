/** Regression tests for the eval2 findings (docs/INFERENCE.md, "Tuning log"). */
import { describe, expect, it } from 'vitest';
import type { OriginalWord } from '../../../src/domain/models';
import type { EvidenceDraft } from '../../../src/inference/protocol';
import type { KbHoldings } from '../../kb/types';
import { EvidenceLedger } from '../ledger';
import { otherTraditionsNote } from '../research';
import { RefChecker } from '../refs';
import { isJointTradition, phraseTranslatesWord, Validator, type PageInfo } from '../validate';
import { JFB_MAT_19_8, realProviders, WCF_24_5 } from './fakes';

const providers = realProviders();

const holdings: KbHoldings = {
  kinds: { confession: 10 },
  traditions: [
    { family: 'lutheran', label: 'Lutheran', documents: 5, kinds: ['confession'], works: ['Augsburg Confession (1530)'] },
    { family: 'reformed', label: 'Reformed', documents: 9, kinds: ['confession'], works: ['Westminster Confession of Faith (1646)'] },
  ],
  missing: ['Eastern Orthodox'],
} as KbHoldings;

function setup(locale?: 'pt') {
  const ledger = new EvidenceLedger({});
  let n = 0;
  const v = new Validator({ ledger, refs: new RefChecker(providers.scripture, locale), providers, holdings, ...(locale ? { locale } : {}) }, (p) => `t:${p}:${++n}`);
  const E = (d: EvidenceDraft) => {
    const entry = ledger.add(d);
    ledger.render([entry], 1e9);
    return entry.evidence.id;
  };
  return { v, E, ledger };
}
const page: PageInfo = { kind: 'topic', sections: new Set(), keyWords: [] };

describe('key-word anchors', () => {
  it('a derivational variant of the gloss translates the word ("formless" for “formlessness”, Gen 1:2)', () => {
    const w = { gloss: 'formlessness' } as OriginalWord;
    expect(phraseTranslatesWord('formless', w, null)).toBe(true);
    expect(phraseTranslatesWord('void', w, null)).toBe(false);
  });
});

describe('perspective traditions', () => {
  it('JFB (Presbyterian and Anglican authors) cannot stand for “Anglican” or “Presbyterian” alone', async () => {
    expect(isJointTradition('Presbyterian and Anglican')).toBe(true);
    expect(isJointTradition('Reformed')).toBe(false);
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const jfb = E(JFB_MAT_19_8);
    const withPosition = (tradition: string) =>
      v.section(
        {
          section: 'theology',
          perspectives: [
            {
              question: 'On what grounds may a marriage end?',
              consensus: 'denominational',
              intro: 'Two readings of the concession.',
              evidence: [wcf, jfb],
              positions: [
                { tradition: 'Reformed', label: 'Adultery and desertion', summary: 'The Westminster Confession allows the innocent party to divorce and remarry.', evidence: [wcf] },
                { tradition, label: 'A civil concession', summary: 'Moses tolerated divorce as a civil lawgiver, because of hard hearts.', evidence: [jfb] },
              ],
            },
          ],
        },
        page,
      );
    expect((await withPosition('Anglican')).rejected[0]?.reason).toMatch(/joint work by authors of different churches/);
  });
});

describe('absence claims about traditions the knowledge base holds', () => {
  it('“holds no Lutheran text” is rejected until a Lutheran search has run; a tradition it lacks may be named freely', async () => {
    const { v, E, ledger } = setup();
    const wcf = E(WCF_24_5);
    const ev = () => {
      const c = v.cite([wcf]);
      if (!c.ok) throw new Error(c.reason);
      return c.evidence;
    };
    const en = 'The knowledge base holds no Lutheran text on divorce.';
    expect(await v.proseProblem(en, ev(), 80, 'intro', { page })).toMatch(/holds them \(Augsburg Confession \(1530\)\) and none has been searched/);
    expect(await v.proseProblem('The knowledge base holds no Eastern Orthodox text on divorce.', ev(), 80, 'intro', { page })).toBeNull();
    ledger.searchedTraditions.add('lutheran');
    expect(await v.proseProblem(en, ev(), 80, 'intro', { page })).toBeNull();
  });

  it('works on a Portuguese page too (“não traz texto luterano”)', async () => {
    const { v, E } = setup('pt');
    const wcf = E(WCF_24_5);
    const c = v.cite([wcf]);
    if (!c.ok) throw new Error(c.reason);
    expect(await v.proseProblem('A base de conhecimento não traz texto luterano sobre o divórcio.', c.evidence, 80, 'intro', { page })).toMatch(/lacks Lutheran texts/);
  });

  it('a creeds search that returns one tradition lists the held traditions it did not return', () => {
    const kb = { providers } as unknown as Parameters<typeof otherTraditionsNote>[0];
    const note = otherTraditionsNote(kb, ['confession'], [{ ...WCF_24_5, tradition: 'Reformed' }], holdings);
    expect(note).toMatch(/not in these results: Lutheran\./);
    expect(otherTraditionsNote(kb, ['dictionary'], [WCF_24_5], holdings)).toBeNull();
  });
});

describe('common ground', () => {
  const run = async (commonGround: string) => {
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const jfb = E(JFB_MAT_19_8);
    return v.section(
      {
        section: 'theology',
        perspectives: [
          {
            question: 'On what grounds may a marriage end?',
            consensus: 'denominational',
            intro: 'Two readings of the concession.',
            commonGround,
            evidence: [wcf, jfb],
            positions: [
              { tradition: 'Reformed', label: 'Adultery', summary: 'The Westminster Confession allows the innocent party to divorce after adultery.', evidence: [wcf] },
              { tradition: 'Hardness of heart', label: 'A civil concession', summary: 'Moses tolerated divorce as a civil lawgiver, because of hard hearts.', evidence: [jfb] },
            ],
          },
        ],
      },
      page,
    );
  };
  const cg = (r: Awaited<ReturnType<typeof run>>) => (r.payload?.section === 'theology' ? r.payload.perspectives[0]?.commonGround : 'no set');

  it('“both hold X” is dropped when one position’s own text does not say X', async () => {
    const r = await run('Both hold that the innocent party may remarry after adultery.');
    expect(cg(r)).toBeUndefined();
    expect(r.warnings.join(' ')).toMatch(/commonGround dropped .* Hardness of heart/);
  });

  it('kept when each position’s text states it', async () => {
    const r = await run('Both concern marriage.');
    expect([cg(r), r.rejected, r.warnings]).toEqual(['Both concern marriage.', [], expect.anything()]);
  });
});

describe('cross-reference relationships', () => {
  const xr = async (from: string, to: string) => {
    const { v, E } = setup();
    const { parseReference, formatRef } = await import('../../../src/domain/reference');
    const ref = parseReference(to)!;
    const p = await providers.scripture.getPassage(ref, 'BSB');
    const text = p.chapters.flatMap((c) => c.verses.map((x) => `${c.chapter}:${x.ref.verse} ${x.text}`)).join('\n');
    const e = E({ kind: 'scripture', title: `${formatRef(ref)} (BSB)`, text, sourceId: 'bsb', refs: [ref], quotable: true, locator: formatRef(ref) });
    const passage = parseReference('Genesis 1:1–31')!;
    return v.section({ section: 'cross-references', items: [{ from, to, relationship: 'quotation', title: 'Six days', explanation: 'The same creation.', evidence: [e] }] }, { kind: 'passage', passage, sections: new Set(), keyWords: [] });
  };
  const rel = (r: Awaited<ReturnType<typeof xr>>) => (r.payload?.section === 'cross-references' ? r.payload.items[0]?.relationship : r.rejected[0]?.reason);

  it('a “quotation” whose BSB texts share no wording becomes an allusion (Exodus 20:11 is not a quotation of Genesis 1:26–31)', async () => {
    expect(rel(await xr('Genesis 1:26–31', 'Exodus 20:11'))).toBe('allusion');
  });

  it('a real quotation stays one (Matthew 19:4 quotes Genesis 1:27, “male and female”)', async () => {
    expect(rel(await xr('Genesis 1:27', 'Matthew 19:4'))).toBe('quotation');
  });
});

describe('claim vocabulary on pt/es/fr pages', () => {
  it('“debatido”, “generalmente”, “une fois pour toutes” need a cited text that makes the claim', async () => {
    const { ungroundedClaims } = await import('../grounding');
    const views = [{ e: { ...WCF_24_5, id: 'E1' } as never, fullText: WCF_24_5.text }];
    expect(ungroundedClaims('O sentido é debatido.', views, providers).map((p) => p.kind)).toEqual(['debate']);
    expect(ungroundedClaims('Generalmente se entiende así.', views, providers).map((p) => p.kind)).toEqual(['generalisation']);
    expect(ungroundedClaims('Le Christ s’offre une fois pour toutes.', views, providers).map((p) => p.kind)).toEqual(['aspect']);
    expect(ungroundedClaims('A parte inocente pode pedir o divórcio.', views, providers)).toEqual([]);
  });
});
