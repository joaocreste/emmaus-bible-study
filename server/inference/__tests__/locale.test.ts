/**
 * Locale-aware validation (eval2 finding A): on pt/es/fr pages, references written with the
 * page language's book names ("Mateus 19:9", "Mateo 6:25", "Jean 1:1") are references — the
 * validator must check them, not reject them as "not a Bible reference".
 */
import { describe, expect, it } from 'vitest';
import type { Locale } from '../../../src/i18n/locales';
import { formatRef, parseReference } from '../../../src/domain/reference';
import type { EvidenceDraft } from '../../../src/inference/protocol';
import { EvidenceLedger } from '../ledger';
import { RefChecker } from '../refs';
import { pseudoReferences, Validator, type PageInfo } from '../validate';
import { realProviders } from './fakes';

const providers = realProviders();

function setup(locale: Locale, translation?: import('../../../src/domain/models').TranslationId) {
  const ledger = new EvidenceLedger({});
  const refs = new RefChecker(providers.scripture, locale);
  let n = 0;
  const v = new Validator({ ledger, refs, providers, locale, ...(translation ? { translation } : {}) }, (p) => `t:${p}:${++n}`);
  const E = (d: EvidenceDraft) => {
    const entry = ledger.add(d);
    ledger.render([entry], 1e9);
    return entry.evidence.id;
  };
  return { v, E, refs };
}

async function scripture(reference: string): Promise<EvidenceDraft> {
  const ref = parseReference(reference)!;
  const p = await providers.scripture.getPassage(ref, 'BSB');
  const text = p.chapters.flatMap((c) => c.verses.map((v) => `${c.chapter}:${v.ref.verse} ${v.text}`)).join('\n');
  return { kind: 'scripture', title: `${formatRef(ref)} (BSB)`, text, sourceId: 'bsb', refs: [ref], quotable: true, locator: formatRef(ref) };
}

function cited(v: Validator, id: string) {
  const c = v.cite([id]);
  if (!c.ok) throw new Error(c.reason);
  return c.evidence;
}

const page: PageInfo = { kind: 'topic', sections: new Set(), keyWords: [] };

describe('locale-aware references', () => {
  it('own-language Gospel names are not pseudo-references', () => {
    expect(pseudoReferences('Em Mateus 19:9 Jesus dá uma exceção.', 'pt')).toEqual([]);
    expect(pseudoReferences('Mateo 6:25 y Lucas 10:41 hablan de la ansiedad.', 'es')).toEqual([]);
    expect(pseudoReferences('Jean 1:1 et Marc 7:19.', 'fr')).toEqual([]);
    // still caught: a name that is no book in any language
    expect(pseudoReferences('Ezequias 3:16 diz isso.', 'pt')).toEqual(['Ezequias 3:16']);
  });

  it('prose with pt book names passes when the evidence gives the verse, and is checked when it does not', async () => {
    const { v, E } = setup('pt');
    const mt = E(await scripture('Matthew 19:3–9'));
    const ok = await v.proseProblem('Em Mateus 19:9 Jesus admite uma exceção.', cited(v, mt), 80, 'note', { page });
    expect(ok).toBeNull();
    const bad = await v.proseProblem('Em Marcos 10:11 Jesus fala do novo casamento.', cited(v, mt), 80, 'note', { page });
    expect(bad).toMatch(/Mark 10:11, which none of the cited evidence gives/);
  });

  it('a pt reference to a verse that does not exist is reported', async () => {
    const { refs } = setup('pt');
    expect(await refs.proseProblems('Veja João 3:99.')).toHaveLength(1);
  });

  it('tool input in the page language parses (read_passage("Mateo 6:25-34"))', async () => {
    const { refs } = setup('es');
    const r = await refs.parse('Mateo 6:25-34');
    expect(r.ok).toBe(true);
    const fr = await setup('fr').refs.parse('Jean 3:16');
    expect(fr.ok && fr.ref.book).toBe('JHN');
  });
});

describe('concordance evidence in a non-English version', () => {
  it('carries the version’s registered source id, not the lower-cased translation id', async () => {
    const { occurrenceVerses } = await import('../research');
    const kb = { providers } as unknown as Parameters<typeof occurrenceVerses>[0];
    const lsg = await occurrenceVerses(kb, 'G1977', 'LSG', 6);
    expect(lsg?.sourceId).toBe('louis-segond-1910');
    expect(providers.sources.getSource(lsg!.sourceId)).toBeTruthy();
  });
});

describe('key-word anchors in the reader’s version', () => {
  it('underlines the word in every version of the page language that holds the reader phrase; warns when the reader’s own version does not', async () => {
    const { v, E } = setup('fr', 'LSG');
    const e = await providers.lexicon.getEntry('G3309');
    const lex = E({ kind: 'lexicon', title: `G3309 ${e!.lemma}`, text: `G3309 ${e!.lemma}: ${e!.gloss}\n${e!.definition}`, sourceId: e!.sourceId, strong: 'G3309', locator: 'G3309', quotable: true });
    const matt = E(await scripture('Matthew 6:25–34'));
    const r = await v.section(
      { section: 'original-languages', items: [{ strong: 'G3309', english: 'worry', anchor: { reference: 'Matthew 6:25', phrase: 'worry', readerPhrase: 'inquiétez' }, significance: 'Jésus interdit l’inquiétude pour la vie.', evidence: [lex, matt] }] },
      page,
    );
    const item = r.payload?.section === 'original-languages' ? r.payload.items[0] : null;
    expect(item?.anchors[0].phrases).toMatchObject({ BSB: 'worry', LSG: 'inquiétez', NCL: 'inquiétez' });
    expect(item?.anchors[0].phrases.OST).toBeUndefined();

    const miss = await v.section(
      { section: 'original-languages', items: [{ strong: 'G3309', english: 'worry', anchor: { reference: 'Matthew 6:25', phrase: 'worry', readerPhrase: 'en souci' }, significance: 'Jésus interdit l’inquiétude pour la vie.', evidence: [lex, matt] }] },
      page,
    );
    expect(miss.warnings.join(' ')).toMatch(/not in the LSG text of Matthew 6:25/);
  });
});
