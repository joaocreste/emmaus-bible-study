/**
 * The runtime integrity gate (docs/INFERENCE.md §4): one test per rule, against the
 * real bundled Scripture, tagged text and lexicon.
 */
import { describe, expect, it } from 'vitest';
import type { PassageRef } from '../../../src/domain/models';
import type { EvidenceDraft } from '../../../src/inference/protocol';
import { EvidenceLedger } from '../ledger';
import { RefChecker } from '../refs';
import { cleanSense, trimBorrowed, Validator, type PageInfo } from '../validate';
import {
  CALVIN_MAT_19_3,
  EASTON_DIVORCE,
  JFB_MAT_19_8,
  NAVES_DIVORCE,
  realProviders,
  scriptureEvidence,
  SUMMARY_ONLY_NOTE,
  TORREY_DIVORCE,
  TRENT_24_7,
  TYNDALE_MAT_19_3,
  WCF_24_5,
} from './fakes';

const providers = realProviders();
const MAT_19_3_12: PassageRef = { book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 12 };

function setup(options: ConstructorParameters<typeof EvidenceLedger>[0] = {}) {
  const ledger = new EvidenceLedger(options);
  const refs = new RefChecker(providers.scripture);
  let n = 0;
  const v = new Validator({ ledger, refs, providers }, (p) => `t:${p}:${++n}`);
  const E = (d: EvidenceDraft) => ledger.add(d).evidence.id;
  return { ledger, refs, v, E };
}

const topicPage = (passage?: PassageRef): PageInfo => ({ kind: 'topic', ...(passage ? { passage } : {}), sections: new Set(), keyWords: [] });
const passagePage = (passage: PassageRef): PageInfo => ({ kind: 'passage', passage, sections: new Set(['scripture']), keyWords: [] });

async function lexiconEvidence(strong: string): Promise<EvidenceDraft> {
  const e = (await providers.lexicon.getEntry(strong))!;
  return { kind: 'lexicon', title: `${e.strong} ${e.lemma}`, text: `${e.strong} ${e.lemma} (${e.transliteration}): ${e.gloss}\n${e.definition}`, sourceId: e.sourceId, strong: e.strong, locator: e.strong, quotable: true };
}

describe('rule 1 — every item cites evidence from this request’s ledger', () => {
  it('drops an uncited item', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    E(await scriptureEvidence('Malachi 2:14–16'));
    const r = await v.section(
      {
        section: 'key-passages',
        items: [
          { reference: 'Deuteronomy 24:1–4', title: 'The Mosaic regulation', note: 'Moses regulates divorce with a certificate.', group: 'The Law', evidence: [] },
          { reference: 'Malachi 2:14–16', title: 'God hates divorce', note: 'The prophet rebukes faithlessness to the wife of one’s youth.', group: 'The Prophets', evidence: [naves] },
        ],
      },
      topicPage(),
    );
    expect(r.accepted).toBe(1);
    expect(r.rejected).toHaveLength(1);
    expect(r.rejected[0].item).toContain('Deuteronomy 24:1');
    expect(r.rejected[0].reason).toMatch(/cites no evidence/);
    expect(r.payload?.section).toBe('key-passages');
  });

  it('rejects unknown evidence ids and ignores unknown ids next to valid ones', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    E(await scriptureEvidence('Matthew 5:31–32'));
    const r = await v.section(
      {
        section: 'key-passages',
        items: [
          { reference: 'Luke 16:18', title: 'Divorce and remarriage', note: 'A short saying.', group: 'Jesus’ teaching', evidence: ['E99'] },
          { reference: 'Matthew 5:31–32', title: 'Jesus on the certificate', note: 'Jesus addresses the certificate.', group: 'Jesus’ teaching', evidence: [naves, 'E42'] },
        ],
      },
      topicPage(),
    );
    expect(r.rejected).toHaveLength(1);
    expect(r.rejected[0].reason).toMatch(/unknown ids: E99/);
    expect(r.accepted).toBe(1);
    expect(r.warnings.join(' ')).toMatch(/ignored unknown evidence ids E42/);
  });

  it('resolves citations into Citation objects with the retrieved excerpt (source metadata from the evidence only)', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const r = await v.section(
      { section: 'historical-context', items: [{ category: 'jewish-tradition', title: 'Divorce on slight pretences', summary: 'Easton’s notes that Jews of Jesus’ day often dissolved marriages on slight pretences.', evidence: [easton] }] },
      topicPage(),
    );
    expect(r.accepted).toBe(1);
    const item = r.payload?.section === 'historical-context' ? r.payload.items[0] : null;
    expect(item?.provenance).toMatchObject({ kind: 'synthesis', verification: 'generated' });
    const c = item!.provenance.citations[0];
    expect(c).toMatchObject({ sourceId: 'eastons-bible-dictionary', locator: 's.v. Divorce', url: EASTON_DIVORCE.url });
    expect(c.excerpt).toBeTruthy();
    expect(EASTON_DIVORCE.text.replace(/\s+/g, ' ')).toContain(c.excerpt!.replace(/^…/, '').trim().slice(0, 40));
  });
});

describe('rule 2 — references parse and exist', () => {
  it('rejects a verse that does not exist and text that is not a reference', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    const r = await v.section(
      {
        section: 'key-passages',
        items: [
          { reference: 'Matthew 19:40', title: 'Out of range', note: 'x', group: 'g', evidence: [naves] },
          { reference: 'Hezekiah 3:1', title: 'Not a book', note: 'x', group: 'g', evidence: [naves] },
        ],
      },
      topicPage(),
    );
    expect(r.accepted).toBe(0);
    expect(r.payload).toBeNull();
    expect(r.rejected[0].reason).toMatch(/Matthew 19 has 30 verses/);
    expect(r.rejected[1].reason).toMatch(/could not read/);
  });

  it('rejects a reference none of the cited evidence contains', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    const r = await v.section({ section: 'key-passages', items: [{ reference: 'Romans 8:1', title: 'No condemnation', note: 'x', group: 'g', evidence: [naves] }] }, topicPage());
    expect(r.rejected[0].reason).toMatch(/none of the cited evidence contains Romans 8:1/);
  });

  it('rejects prose that mentions a reference that does not exist', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const r = await v.section(
      { section: 'historical-context', items: [{ category: 'religious', title: 'A rabbinic debate', summary: 'Compare Matthew 19:44 on the question.', evidence: [easton] }] },
      topicPage(),
    );
    expect(r.rejected[0].reason).toMatch(/do not exist/);
  });

  it('drops secondary references that are not in the cited evidence (warning, item kept)', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const r = await v.section(
      {
        section: 'historical-context',
        items: [{ category: 'jewish-tradition', title: 'Divorce practice', summary: 'Easton’s describes divorce practice in Jesus’ day.', relatedVerses: ['Mark 10:2', 'John 3:16'], evidence: [easton] }],
      },
      topicPage(),
    );
    expect(r.accepted).toBe(1);
    expect(r.warnings.join(' ')).toMatch(/dropped John 3:16/);
    const item = r.payload?.section === 'historical-context' ? r.payload.items[0] : null;
    expect(item?.relatedVerses?.map((x) => `${x.book}.${x.chapter}.${x.verse}`)).toEqual(['MRK.10.2']);
  });
});

describe('rule 3 — key words come from the lexicon', () => {
  it('rejects a Strong’s number that was never retrieved', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    const r = await v.section({ section: 'original-languages', items: [{ strong: 'G5485', english: 'grace', significance: 'Grace matters here.', evidence: [naves] }] }, topicPage());
    expect(r.accepted).toBe(0);
    expect(r.rejected[0].reason).toMatch(/G5485 is not in any lexicon or original_text evidence/);
  });

  it('hydrates lemma, transliteration, gloss, grammar and senses from the lexicon — never from the model', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G630'));
    const r = await v.section(
      {
        section: 'original-languages',
        items: [
          {
            strong: 'G630',
            english: 'divorce',
            anchor: { reference: 'Matthew 19:3', phrase: 'divorce' },
            significance: 'The verb for dismissing a wife; the Pharisees ask when a man may do it.',
            semanticRange: ['to set free, release', 'to be a ceremonial purification rite'],
            // fields the model is not allowed to supply
            lemma: 'ἀπολύειν-FAKE',
            transliteration: 'FAKE',
            evidence: [lex],
          },
        ],
      },
      topicPage(MAT_19_3_12),
    );
    expect(r.rejected).toEqual([]);
    const kw = r.payload?.section === 'original-languages' ? r.payload.items[0] : null;
    expect(kw).toBeTruthy();
    expect(kw!.lemma).toBe('ἀπολύω');
    expect(kw!.transliteration).toBe('apoluō');
    expect(kw!.language).toBe('greek');
    expect(kw!.strong).toBe('G630');
    expect(kw!.basicMeaning).toMatch(/release|divorce/);
    expect(kw!.grammar).toMatch(/aorist active infinitive/i);
    expect(kw!.anchors).toEqual([{ verse: { book: 'MAT', chapter: 19, verse: 3 }, phrases: expect.objectContaining({ BSB: 'divorce' }) }]);
    // the grounded sense is kept, the invented one is dropped
    expect(kw!.semanticRange).toContain('to set free, release');
    expect(kw!.semanticRange).not.toContain('to be a ceremonial purification rite');
    expect(kw!.provenance).toMatchObject({ kind: 'lexical', verification: 'source-derived' });
    expect(kw!.significance.provenance.verification).toBe('generated');
    expect(r.notes[0]).toMatch(/G630 ἀπολύω/);
  });

  it('drops an anchor whose phrase is not in the BSB verse, keeping the word', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G630'));
    const r = await v.section(
      {
        section: 'original-languages',
        items: [{ strong: 'G630', english: 'put away', anchor: { reference: 'Matthew 19:3', phrase: 'put away' }, significance: 'The verb for dismissing a wife.', evidence: [lex] }],
      },
      topicPage(),
    );
    expect(r.accepted).toBe(1);
    expect(r.warnings.join(' ')).toMatch(/anchor dropped — “put away” is not in the BSB text of Matthew 19:3/);
    const kw = r.payload?.section === 'original-languages' ? r.payload.items[0] : null;
    expect(kw!.anchors).toEqual([]);
    expect(kw!.lemma).toBe('ἀπολύω');
  });

  it('accepts a Strong’s number found in retrieved original-text evidence', async () => {
    const { v, E } = setup();
    const ot = E({ kind: 'original-text', title: 'Greek text of Matthew 19:9', text: '19:9 πορνείᾳ (porneia) G4202 “sexual immorality” N-DSF', sourceId: 'stepbible-tagnt', quotable: true });
    const r = await v.section({ section: 'original-languages', items: [{ strong: 'G4202', english: 'sexual immorality', significance: 'The exception clause’s term.', evidence: [ot] }] }, topicPage());
    expect(r.accepted).toBe(1);
    const kw = r.payload?.section === 'original-languages' ? r.payload.items[0] : null;
    expect(kw!.lemma).toBe('πορνεία');
  });
});

describe('rule 4 — quotations are exact spans of quotable evidence', () => {
  it('accepts an exact span (whitespace and quote marks normalised) and shows the source’s own wording', async () => {
    const { v, E } = setup();
    const calvin = E(CALVIN_MAT_19_3);
    const r = await v.section(
      {
        section: 'commentary',
        voices: [{ evidence: calvin, mode: 'quote', quote: '“a fixed law was laid down as to the sacred   and indissoluble bond of marriage”', lead: 'On the Pharisees’ test' }],
      },
      topicPage(),
    );
    expect(r.rejected).toEqual([]);
    const entry = r.payload?.section === 'commentary' ? r.payload.items[0] : null;
    expect(entry).toMatchObject({ kind: 'quotation', authorId: 'calvin', sourceId: 'calvin-commentaries', text: 'a fixed law was laid down as to the sacred and indissoluble bond of marriage' });
    expect(entry!.provenance).toMatchObject({ kind: 'quotation', verification: 'verified' });
    expect(entry!.provenance.citations[0].excerpt).toBe(entry!.text);
  });

  it('rejects a quote that is not in the evidence', async () => {
    const { v, E } = setup();
    const calvin = E(CALVIN_MAT_19_3);
    const r = await v.section({ section: 'commentary', voices: [{ evidence: calvin, mode: 'quote', quote: 'marriage is a sacred and indissoluble bond' }] }, topicPage());
    expect(r.accepted).toBe(0);
    expect(r.rejected[0].reason).toMatch(/not an exact span/);
  });

  it('rejects quoting a summary-only source but accepts a summary of it', async () => {
    const { v, E } = setup();
    // an item the knowledge base marked not quotable (licence: summary only)
    const restricted = E({ ...SUMMARY_ONLY_NOTE, kind: 'commentary', authorId: 'calvin' });
    const jfb = E(JFB_MAT_19_8);
    const quoted = await v.section({ section: 'commentary', voices: [{ evidence: restricted, mode: 'quote', quote: 'divorce is a grave offense against the natural law' }] }, topicPage());
    expect(quoted.rejected[0].reason).toMatch(/may not be quoted/);
    const summarised = await v.section(
      { section: 'commentary', voices: [{ evidence: jfb, mode: 'summary', summary: 'JFB reads Moses as a civil lawgiver who tolerated divorce to prevent greater evils.' }] },
      topicPage(),
    );
    expect(summarised.accepted).toBe(1);
    const entry = summarised.payload?.section === 'commentary' ? summarised.payload.items[0] : null;
    expect(entry?.kind).toBe('summary');
    expect(entry?.provenance).toMatchObject({ kind: 'summary', verification: 'generated' });
  });

  it('checks quoted runs of 12+ words inside prose against the cited evidence', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const bad = await v.section(
      { section: 'historical-context', items: [{ category: 'jewish-tradition', title: 'Slight pretences', summary: 'Easton’s says “the rabbis allowed a man to divorce his wife for burning his dinner or for any other reason.”', evidence: [easton] }] },
      topicPage(),
    );
    expect(bad.rejected[0].reason).toMatch(/quotation marks/);
    const good = await v.section(
      {
        section: 'historical-context',
        items: [{ category: 'jewish-tradition', title: 'Slight pretences', summary: 'Easton’s says “it was not uncommon for the Jews at that time to dissolve the union on very slight pretences.”', evidence: [easton] }],
      },
      topicPage(),
    );
    expect(good.accepted).toBe(1);
  });

  it('accepts a span of the full retrieved text when the knowledge base excerpted the item', async () => {
    const full = `${TYNDALE_MAT_19_3.text} Jesus sided with neither school but went back to the Creator’s design for marriage.`;
    const { v, E } = setup({ fullText: (d) => (d.title === TYNDALE_MAT_19_3.title ? full : d.text) });
    const note = E({ ...TYNDALE_MAT_19_3, authorId: 'tyndale-house-publishers' });
    const r = await v.section({ section: 'commentary', voices: [{ evidence: note, mode: 'quote', quote: 'Jesus sided with neither school but went back to the Creator’s design for marriage.' }] }, topicPage());
    expect(r.accepted).toBe(1);
  });

  it('rejects a voice that is not a statement text or has no recorded author', async () => {
    const { v, E } = setup();
    const scripture = E({ kind: 'scripture', title: 'Matthew 19:9 (BSB)', text: '19:9 Now I tell you that whoever divorces his wife…', sourceId: 'bsb', quotable: true });
    const tyndaleNoAuthor = E(TYNDALE_MAT_19_3);
    const r = await v.section(
      {
        section: 'commentary',
        voices: [
          { evidence: scripture, mode: 'summary', summary: 'Jesus names adultery.' },
          { evidence: tyndaleNoAuthor, mode: 'summary', summary: 'Tyndale describes the Hillel and Shammai schools.' },
        ],
      },
      topicPage(),
    );
    expect(r.accepted).toBe(0);
    expect(r.rejected[0].reason).toMatch(/scripture evidence/);
    expect(r.rejected[1].reason).toMatch(/has no recorded author/);
  });
});

describe('rule 5 — perspectives rest on texts that state them', () => {
  it('rejects a position citing only Scripture (and a set left with one position)', async () => {
    const { v, E } = setup();
    const scripture = E({ kind: 'scripture', title: 'Matthew 19:3–9 (BSB)', text: '19:9 Now I tell you that whoever divorces his wife, except for sexual immorality, and marries another woman commits adultery.', sourceId: 'bsb', refs: [MAT_19_3_12], quotable: true });
    const wcf = E(WCF_24_5);
    const r = await v.section(
      {
        section: 'theology',
        perspectives: [
          {
            question: 'May the innocent party remarry after divorce for adultery?',
            consensus: 'denominational',
            intro: 'Churches read the exception clause differently.',
            evidence: [wcf],
            positions: [
              { tradition: 'Reformed', label: 'Remarriage permitted', summary: 'The Westminster Confession allows the innocent party to divorce and remarry.', evidence: [wcf] },
              { tradition: 'Catholic', label: 'The bond endures', summary: 'The marriage bond cannot be dissolved by adultery.', evidence: [scripture] },
            ],
          },
        ],
      },
      topicPage(),
    );
    expect(r.rejected.map((x) => x.reason).join(' | ')).toMatch(/cites only Scripture/);
    expect(r.rejected.map((x) => x.reason).join(' | ')).toMatch(/needs at least two positions/);
    expect(r.payload).toBeNull();
  });

  it('accepts positions that cite each tradition’s own text', async () => {
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const trent = E(TRENT_24_7);
    const r = await v.section(
      {
        section: 'theology',
        themes: [{ category: 'ethics', title: 'Marriage as a permanent union', summary: 'The confession treats adultery as the ground on which the innocent party may divorce.', keyVerses: ['Matthew 19:6'], evidence: [wcf] }],
        perspectives: [
          {
            question: 'May the innocent party remarry after divorce for adultery?',
            consensus: 'denominational',
            intro: 'Churches read the exception clause differently.',
            evidence: [wcf, trent],
            positions: [
              { tradition: 'Reformed', label: 'Remarriage permitted', summary: 'The Westminster Confession allows the innocent party to divorce and remarry.', keyTexts: ['Matthew 19:9'], evidence: [wcf] },
              { tradition: 'Catholic', label: 'The bond endures', summary: 'The Council of Trent teaches that adultery does not dissolve the bond of marriage.', evidence: [trent] },
            ],
          },
        ],
      },
      topicPage(),
    );
    expect(r.rejected).toEqual([]);
    expect(r.payload?.section).toBe('theology');
    if (r.payload?.section !== 'theology') return;
    expect(r.payload.perspectives[0].perspectives.map((p) => p.tradition)).toEqual(['Reformed', 'Catholic']);
    expect(r.payload.perspectives[0].perspectives[0].keyTexts).toEqual([{ book: 'MAT', startChapter: 19, startVerse: 9, endChapter: 19, endVerse: 9 }]);
    // Matthew 19:6 is not in the WCF item's refs or text → dropped from the theme with a warning
    expect(r.payload.themes[0].keyVerses).toEqual([]);
    expect(r.warnings.join(' ')).toMatch(/dropped Matthew 19:6/);
  });

  it('rejects a consensus level outside the domain values', async () => {
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const r = await v.section(
      { section: 'theology', perspectives: [{ question: 'Q?', consensus: 'contested', intro: 'x', evidence: [wcf], positions: [] }] },
      topicPage(),
    );
    expect(r.rejected[0].reason).toMatch(/malformed/);
  });
});

describe('rule 6 — cross-references', () => {
  it('requires `from` inside the page passage and a domain relationship', async () => {
    const { v, E } = setup();
    const torrey = E(TORREY_DIVORCE);
    const r = await v.section(
      {
        section: 'cross-references',
        items: [
          { from: 'Matthew 19:4', to: 'Genesis 2:24', relationship: 'quotation', title: 'One flesh', explanation: 'Jesus quotes the creation account.', evidence: [torrey] },
          { from: 'Matthew 5:32', to: 'Deuteronomy 24:1', relationship: 'allusion', title: 'Outside', explanation: 'x', evidence: [torrey] },
          { from: 'Matthew 19:8', to: 'Deuteronomy 24:1', relationship: 'fulfils', title: 'Bad relationship', explanation: 'x', evidence: [torrey] },
        ],
      },
      passagePage(MAT_19_3_12),
    );
    expect(r.accepted).toBe(1);
    expect(r.rejected[0].reason).toMatch(/must lie inside the page passage/);
    expect(r.rejected[1].reason).toMatch(/malformed/);
  });
});

describe('rule 7 — no URLs or invented source metadata', () => {
  it('rejects prose with a URL', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const r = await v.section(
      { section: 'historical-context', items: [{ category: 'religious', title: 'Background', summary: 'See https://example.com/divorce for more.', evidence: [easton] }] },
      topicPage(),
    );
    expect(r.rejected[0].reason).toMatch(/URL/);
  });
});

describe('begin_page, finish_page, reply', () => {
  it('begin_page: a passage page needs its passage; a topic anchor must be in the evidence', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    const noPassage = await v.beginPage({ title: 'Matthew 19', kind: 'passage', summary: { text: 'Jesus on divorce.', evidence: [naves] } });
    expect(noPassage.page).toBeNull();
    const anchored = await v.beginPage({ title: 'Divorce in the Bible', kind: 'topic', passage: 'Matthew 19:3–12', question: 'What does the Bible say about divorce?', summary: { text: 'What the Bible says about divorce.', evidence: [naves] } });
    expect(anchored.page?.passage).toEqual(MAT_19_3_12);
    const unanchored = await v.beginPage({ title: 'Divorce', kind: 'topic', passage: 'Romans 8:1', summary: { text: 'x', evidence: [naves] } });
    expect(unanchored.page?.passage).toBeUndefined();
    expect(unanchored.warnings.join(' ')).toMatch(/anchor passage Romans 8:1 dropped/);
    const uncited = await v.beginPage({ title: 'Divorce', kind: 'topic', summary: { text: 'x', evidence: [] } });
    expect(uncited.page).toBeNull();
  });

  it('finish_page: uncited opening is rejected; concepts point at sections on the page', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    const bad = await v.finish({ opening: { text: 'Welcome.', evidence: [] }, concepts: [], suggestedQuestions: [] }, topicPage());
    expect(bad.opening).toBeNull();
    const ok = await v.finish(
      {
        opening: { text: 'This page gathers what Scripture says about divorce.', evidence: [naves] },
        concepts: [{ label: 'The exception clause', aliases: ['exception clause', 'except for sexual immorality'], answer: 'Matthew records an exception.', section: 'commentary', evidence: [naves] }],
        suggestedQuestions: ['What did Moses permit?', 'https://spam.example'],
      },
      { kind: 'topic', sections: new Set(['key-passages']), keyWords: [] },
    );
    expect(ok.opening?.text).toMatch(/divorce/);
    expect(ok.concepts[0].primarySection).toBe('overview');
    expect(ok.concepts[0].aliases).toContain('the exception clause');
    expect(ok.suggestedQuestions).toEqual(['What did Moses permit?']);
  });

  it('reply: must cite evidence unless it declines', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    expect((await v.reply({ text: 'An answer.', evidence: [] })).reply).toBeNull();
    const declined = await v.reply({ text: 'The knowledge base holds no Orthodox text on this.', evidence: [], declined: true });
    expect(declined.reply?.declined).toBe(true);
    const ok = await v.reply({ text: 'Nave’s lists Malachi 2:14–16.', evidence: [naves], focus: { section: 'key-passages', verses: ['Malachi 2:16'] } });
    expect(ok.reply?.citations[0].sourceId).toBe('naves-topical-bible');
    expect(ok.reply?.focus).toEqual({ section: 'key-passages', verses: [{ book: 'MAL', chapter: 2, verse: 16 }] });
  });
});

describe('evidence ids stay out of reader-facing text', () => {
  it('strips [E#] / (E#) markers from prose, keeping the evidence fields', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    const r = await v.reply({ text: 'Nave lists the Mosaic regulation [E1]; it also lists Malachi (E1, E1). See [E1] above.', evidence: [naves] });
    expect(r.reply?.text).toBe('Nave lists the Mosaic regulation; it also lists Malachi. See above.');
    expect(r.reply?.evidenceIds).toEqual(['E1']);
    E(await scriptureEvidence('Malachi 2:14–16'));
    const s = await v.section(
      { section: 'key-passages', items: [{ reference: 'Malachi 2:14–16', title: 'Faithfulness [E1]', note: 'The prophet rebukes faithlessness (E1).', group: 'The Prophets', evidence: [naves] }] },
      topicPage(),
    );
    const item = s.payload?.section === 'key-passages' ? s.payload.items[0] : null;
    expect(item?.title).toBe('Faithfulness');
    expect(item?.note.text).toBe('The prophet rebukes faithlessness.');
  });
});

describe('lexicon senses shown to readers', () => {
  it('fixes the known scanning slip “au” → “an” before a vowel, and nothing else', () => {
    expect(cleanSense('a question, au inquiry')).toBe('a question, an inquiry');
    expect(cleanSense('Au inquiry')).toBe('An inquiry');
    expect(cleanSense('a demand')).toBe('a demand');
    expect(cleanSense('au pair')).toBe('au pair');
  });
});

describe('anchor phrases that take in a neighbouring word', () => {
  const w = (gloss: string) => ({ index: 0, text: '', strong: 'G1', gloss }) as unknown as Parameters<typeof trimBorrowed>[2];
  const e = (gloss: string, definition = '') => ({ gloss, definition }) as unknown as Parameters<typeof trimBorrowed>[3];
  it('keeps only the stretch that renders the word itself', () => {
    expect(trimBorrowed('do not worry about your life', ['life'], w('do be anxious'), e('to worry, be anxious'))).toBe('worry');
    expect(trimBorrowed('a certificate of divorce', ['certificate'], w('divorce'), e('divorce, dismissal'))).toBe('divorce');
    expect(trimBorrowed('the pledge of a clear conscience toward God', ['conscience', 'god', 'toward'], w('[the] demand'), e('pledge', 'a question, an inquiry; a demand'))).toBe('pledge');
    expect(trimBorrowed('the washing of new birth', ['new', 'birth'], w('[the] washing'), e('washing'))).toBe('washing');
    expect(trimBorrowed('Cast all your anxiety on Him', ['cast'], w('anxiety'), e('care, anxiety'))).toBe('anxiety');
    expect(trimBorrowed('your life', ['life'], w('do be anxious'), e('to worry'))).toBeNull(); // nothing of its own
  });
});
