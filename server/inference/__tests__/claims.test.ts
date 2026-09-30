/**
 * Validator rules added after the live evaluation of the divorce, anxiety and baptism
 * pages (docs/INFERENCE.md §4, rules 7–10): claims recalled from memory that the earlier
 * checks could not see — biblical names and conventional labels, eras, debates,
 * generalisations, readings of Greek aspect, translation renderings, another
 * translation's wording, other uses of a word — and the fixes to rules that misfired
 * (absence disclosures, publisher notes as a tradition, replace-mode key words, anchors).
 */
import Anthropic from '@anthropic-ai/sdk';
import { describe, expect, it } from 'vitest';
import type { PassageRef } from '../../../src/domain/models';
import { formatRef, parseReference } from '../../../src/domain/reference';
import type { EvidenceDraft } from '../../../src/inference/protocol';
import { classifyError } from '../errors';
import { isAbsenceSentence } from '../grounding';
import { EvidenceLedger } from '../ledger';
import { RefChecker } from '../refs';
import { pseudoReferences, Validator, type PageInfo } from '../validate';
import { EASTON_DIVORCE, JFB_MAT_19_8, realProviders, TRENT_24_7, TYNDALE_MAT_19_3, WCF_24_5 } from './fakes';

const providers = realProviders();

function setup(readerText = '') {
  const ledger = new EvidenceLedger({});
  const refs = new RefChecker(providers.scripture);
  let n = 0;
  const v = new Validator({ ledger, refs, providers, ...(readerText ? { readerText } : {}) }, (p) => `t:${p}:${++n}`);
  const E = (d: EvidenceDraft) => {
    const entry = ledger.add(d);
    ledger.render([entry], 1e9);
    return entry.evidence.id;
  };
  return { ledger, v, E };
}

const topicPage = (passage?: PassageRef, keyWords: PageInfo['keyWords'] = []): PageInfo => ({ kind: 'topic', ...(passage ? { passage } : {}), sections: new Set(), keyWords });

async function scripture(reference: string, translation: 'BSB' | 'KJV' | 'WEB' = 'BSB'): Promise<EvidenceDraft> {
  const ref = parseReference(reference)!;
  const p = await providers.scripture.getPassage(ref, translation);
  const text = p.chapters.flatMap((c) => c.verses.map((v) => `${c.chapter}:${v.ref.verse} ${v.text}`)).join('\n');
  return { kind: 'scripture', title: `${formatRef(ref)} (${translation})`, text, sourceId: translation.toLowerCase(), refs: [ref], quotable: true, locator: formatRef(ref) };
}

async function lexiconEvidence(strong: string): Promise<EvidenceDraft> {
  const e = (await providers.lexicon.getEntry(strong))!;
  return { kind: 'lexicon', title: `${e.strong} ${e.lemma}`, text: `${e.strong} ${e.lemma} (${e.transliteration}): ${e.gloss}\n${e.definition}`, sourceId: e.sourceId, strong: e.strong, locator: e.strong, quotable: true };
}

const note = (title: string, text: string, refs: string[]): EvidenceDraft => ({
  kind: 'study-note',
  title,
  text,
  sourceId: 'tyndale-open-study-notes',
  authorId: 'tyndale-house-publishers',
  refs: refs.map((r) => parseReference(r)!),
  quotable: true,
});

async function keyPassage(v: Validator, reference: string, fields: { title?: string; note: string }, evidence: string[]) {
  return v.section({ section: 'key-passages', items: [{ reference, title: fields.title ?? 'A passage', note: fields.note, group: 'Acts', evidence }] }, topicPage());
}

describe('rule 7 — biblical names and conventional labels come from the evidence or the Scripture read', () => {
  it('rejects a name the cited verses do not contain (Cornelius on Acts 10:44–48), and accepts it once the verse naming him was read', async () => {
    const { v, E } = setup();
    const acts = E(await scripture('Acts 10:44–48'));
    const r = await keyPassage(v, 'Acts 10:44–48', { note: 'The Spirit falls on Cornelius’s household before they are baptized.' }, [acts]);
    expect(r.accepted).toBe(0);
    expect(r.rejected[0].reason).toMatch(/names “Cornelius”.*read the verses that name it/);

    E(await scripture('Acts 10:24'));
    const again = await keyPassage(v, 'Acts 10:44–48', { note: 'The Spirit falls on Cornelius’s household before they are baptized.' }, [acts]);
    expect(again.accepted).toBe(1);
  });

  it('rejects a conventional label no evidence uses (the Sermon on the Mount), even in a title', async () => {
    const { v, E } = setup();
    const matt = E(await scripture('Matthew 5:31–32'));
    const r = await keyPassage(v, 'Matthew 5:31–32', { title: 'In the Sermon on the Mount', note: 'Jesus sets his word against the certificate practice.' }, [matt]);
    expect(r.rejected[0].reason).toMatch(/“Sermon on the Mount”/);
  });

  it('accepts names in the verses the cited evidence gives, a book’s traditional author, gentilics of a named place, and names the reader used', async () => {
    const { v, E } = setup('what about Tabitha');
    const col = E(await scripture('Colossians 2:11–12'));
    expect((await keyPassage(v, 'Colossians 2:11–12', { note: 'Paul links baptism with burial and resurrection with Christ.' }, [col])).accepted).toBe(1);
    const acts16 = E(await scripture('Acts 16:12'));
    const jailer = E(await scripture('Acts 16:31–34'));
    expect((await keyPassage(v, 'Acts 16:31–34', { note: 'The Philippian jailer believes and is baptized.' }, [jailer, acts16])).accepted).toBe(1);
    const acts9 = E(await scripture('Acts 9:40'));
    expect((await keyPassage(v, 'Acts 9:40', { note: 'Tabitha is raised.' }, [acts9])).accepted).toBe(1);
  });
});

describe('rule 7 — eras, debates, generalisations and readings of the Greek need a cited text that makes them', () => {
  it('rejects an era the cited evidence does not name (post-exilic), and accepts it when it does', async () => {
    const { v, E } = setup();
    const mal = E(await scripture('Malachi 2:13–16'));
    const ctx = (title: string, evidence: string[]) =>
      v.section({ section: 'historical-context', items: [{ category: 'historical-period', title, summary: 'Malachi rebukes men who break faith with the wives of their youth.', evidence }] }, topicPage());
    expect((await ctx('Malachi’s post-exilic setting', [mal])).rejected[0].reason).toMatch(/era \(“post-exilic”\)/);
    const intro = E(note('Tyndale introduction to Malachi', 'Malachi prophesied to the community that had returned from exile in Babylon.', ['Malachi 1:1']));
    expect((await ctx('Malachi’s post-exilic setting', [mal, intro])).accepted).toBe(1);
  });

  it('rejects “debated” and “interpreters differ” unless a cited text states the disagreement or two traditions are cited side by side', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G4202'));
    const words = (significance: string, evidence: string[]) =>
      v.section({ section: 'original-languages', mode: 'append', items: [{ strong: 'G4202', english: 'sexual immorality', significance, evidence }] }, topicPage());
    expect((await words('Its precise scope in Matthew 19:9 is debated.', [lex])).rejected[0].reason).toMatch(/disagree \(“debated”\)/);
    const tyndale = E(TYNDALE_MAT_19_3);
    expect((await words('Interpreters have long debated its scope here.', [lex, tyndale])).accepted).toBe(1); // “two divergent views”
    const both = setup();
    const wcf = both.E(WCF_24_5);
    const trent = both.E(TRENT_24_7);
    const theme = await both.v.section(
      { section: 'theology', themes: [{ category: 'ethics', title: 'Remarriage', summary: 'Churches differ over whether the innocent party may remarry.', keyVerses: [], evidence: [wcf, trent] }] },
      topicPage(),
    );
    expect(theme.accepted).toBe(1);
  });

  it('rejects a generalisation from a lexicon’s list (“normally distinguished”)', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G4202'));
    const r = await v.section(
      { section: 'original-languages', items: [{ strong: 'G4202', english: 'sexual immorality', significance: 'The lexicon notes it is normally distinguished from adultery.', evidence: [lex] }] },
      topicPage(),
    );
    expect(r.rejected[0].reason).toMatch(/generalises \(“normally”\)/);
  });

  it('rejects an aspect reading (“decisive”, “once for all”) unless a cited commentary makes it', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G1977'));
    const concept = (answer: string, evidence: string[]) =>
      v.finish({ opening: { text: 'A page on anxiety.', evidence }, concepts: [{ label: 'Casting', aliases: [], answer, section: 'overview', evidence }], suggestedQuestions: [] }, topicPage());
    expect((await concept('Peter’s participle pictures a decisive handing over of the load.', [lex])).rejected[0].reason).toMatch(/tense or aspect \(“decisive”\)/);
    const jfb = E({ ...JFB_MAT_19_8, title: 'JFB on 1 Peter 5:7', text: 'Casting—once for all: so the Greek aorist.', refs: [parseReference('1 Peter 5:7')!] });
    expect((await concept('JFB takes the aorist as once for all.', [lex, jfb])).concepts).toHaveLength(1);
  });

  it('rejects renderings the cited evidence does not give (“answer” is the KJV’s, not read)', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G1906'));
    const bsb = E(await scripture('1 Peter 3:21'));
    const item = (evidence: string[]) =>
      v.section(
        { section: 'original-languages', items: [{ strong: 'G1906', english: 'pledge', significance: 'Translations render it pledge or answer.', evidence }] },
        topicPage(),
      );
    const r = await item([lex, bsb]);
    expect(r.rejected[0].reason).toMatch(/render a word \(answer\)/);
    const kjv = E(await scripture('1 Peter 3:21', 'KJV'));
    expect((await item([lex, bsb, kjv])).rejected[0]?.reason ?? '').not.toMatch(/render a word/);
  });
});

describe('rule 7 — Scripture is paraphrased from the BSB, keeping who does what to whom', () => {
  it('rejects the KJV’s “called us to peace” for 1 Corinthians 7:15 (BSB: “called you to live in peace”), not ordinary paraphrase', async () => {
    const { v, E } = setup();
    const cor = E(await scripture('1 Corinthians 7:12–16'));
    const bad = await keyPassage(v, '1 Corinthians 7:12–16', { note: 'If the unbeliever leaves, the believer is not bound, for God has called us to peace.' }, [cor]);
    expect(bad.rejected[0].reason).toMatch(/KJV wording “called us to peace”.*1 Corinthians 7:15/);
    const good = await keyPassage(v, '1 Corinthians 7:12–16', { note: 'If the unbeliever leaves, the believer is not bound: God has called you to live in peace.' }, [cor]);
    expect(good.accepted).toBe(1);
    const mark = E(await scripture('Mark 1:4–8'));
    expect((await keyPassage(v, 'Mark 1:4–8', { note: 'John preaches a baptism of repentance for forgiveness of sins.' }, [mark])).accepted).toBe(1);
  });
});

describe('rule 5 — perspectives', () => {
  it('a sentence that only discloses what the knowledge base lacks may name the missing traditions; a claim about them may not', async () => {
    expect(isAbsenceSentence('The knowledge base holds no Eastern Orthodox, Anabaptist or Pentecostal text on divorce, so those traditions are not represented here.')).toBe(true);
    expect(isAbsenceSentence('The knowledge base holds no Orthodox text, but Orthodox churches permit a second marriage.')).toBe(false);
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const trent = E(TRENT_24_7);
    const set = (intro: string) =>
      v.section(
        {
          section: 'theology',
          perspectives: [
            {
              question: 'May the innocent party remarry?',
              consensus: 'denominational',
              intro,
              evidence: [wcf, trent],
              positions: [
                { tradition: 'Reformed', label: 'Yes, after divorce for adultery', summary: 'The Westminster Confession allows the innocent party to marry another.', evidence: [wcf] },
                { tradition: 'Catholic', label: 'The bond remains', summary: 'Trent condemns saying the Church erred in teaching that adultery does not dissolve the bond.', evidence: [trent] },
              ],
            },
          ],
        },
        topicPage(),
      );
    expect((await set('The knowledge base holds no Eastern Orthodox or Pentecostal text on divorce, so those traditions are not represented here.')).accepted).toBe(1);
    expect((await set('Unlike Pentecostal churches, both texts treat adultery gravely.')).rejected[0].reason).toMatch(/speaks of Pentecostal/);
  });

  it('a publisher’s study notes cannot stand for a tradition, nor be a position of their own', async () => {
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const tyndale = E({ ...TYNDALE_MAT_19_3, authorId: 'tyndale-house-publishers' });
    const withPosition = (tradition: string) =>
      v.section(
        {
          section: 'theology',
          perspectives: [
            {
              question: 'On what grounds may a marriage end?',
              consensus: 'denominational',
              intro: 'Two readings of the exception.',
              evidence: [wcf, tyndale],
              positions: [
                { tradition: 'Reformed', label: 'Adultery and desertion', summary: 'The Westminster Confession allows the innocent party to divorce and remarry.', evidence: [wcf] },
                { tradition, label: 'Two schools', summary: 'The note describes the schools of Shammai and Hillel.', evidence: [tyndale] },
              ],
            },
          ],
        },
        topicPage(),
      );
    const r = await withPosition('Evangelical');
    expect(r.rejected[0].reason).toMatch(/publisher’s study notes/);
    // eval2: a study-note publisher is a source, not a tradition — never a position of its own
    expect((await withPosition('Tyndale Open Study Notes')).rejected[0].reason).toMatch(/a source, not a tradition/);
  });
});

describe('rule 3 — key words', () => {
  it('replace mode: the list is the section (duplicates checked within it, not against the words it replaces)', async () => {
    const { v, E } = setup();
    const ids = await Promise.all(['G630', 'G4202', 'G5563', 'G3429'].map(async (s) => E(await lexiconEvidence(s))));
    const item = (strong: string, i: number) => ({ strong, english: 'word', significance: 'It matters in this passage.', evidence: [ids[i]] });
    const first = await v.section({ section: 'original-languages', items: ['G630', 'G4202', 'G5563'].map(item) }, topicPage());
    const onPage = first.payload?.section === 'original-languages' ? first.payload.items : [];
    expect(onPage).toHaveLength(3);
    const replace = await v.section({ section: 'original-languages', mode: 'replace', items: ['G630', 'G4202', 'G5563', 'G3429'].map(item) }, topicPage(undefined, onPage));
    expect(replace.payload?.section === 'original-languages' ? replace.payload.items.map((k) => k.strong) : []).toEqual(['G630', 'G4202', 'G5563', 'G3429']);
    const append = await v.section({ section: 'original-languages', mode: 'append', items: ['G630'].map(item) }, topicPage(undefined, onPage));
    expect(append.accepted).toBe(0);
    expect(append.warnings.join(' ')).toMatch(/already on the page/);
  });

  it('other uses must be where the concordance puts THIS lemma, and described from the lexicon or a verse that was read', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G3309'));
    const matt = E(await scripture('Matthew 6:25–34'));
    const word = (significance: string) =>
      v.section({ section: 'original-languages', items: [{ strong: 'G3309', english: 'worry', anchor: { reference: 'Matthew 6:25', phrase: 'worry' }, significance, evidence: [lex, matt] }] }, topicPage());
    expect((await word('Jesus forbids it in Matthew 6, and it is the same word used of Martha’s distraction and of Paul’s care for the churches.')).rejected[0].reason).toMatch(
      /describes other uses of G3309 .* the cited lexicon entry does not describe/,
    );
    const paul = E(note('Tyndale note on 2 Corinthians 11:28', 'Paul’s daily concern for all the churches weighed on him.', ['2 Corinthians 11:28']));
    const noun = (significance: string) =>
      v.section({ section: 'original-languages', items: [{ strong: 'G3309', english: 'worry', significance, evidence: [lex, matt, paul] }] }, topicPage());
    expect((await noun('It is also used of Paul’s daily concern for the churches in 2 Corinthians 11:28.')).rejected[0].reason).toMatch(/G3309 does not occur there .* a related noun or verb is a different word/);
    expect((await word('It is also used of Martha in Luke 10:41.')).rejected[0].reason).toMatch(/which you have not read/);
    E(await scripture('Luke 10:41'));
    expect((await word('It is also used of Martha in Luke 10:41.')).accepted).toBe(1);
    expect((await word('The lexicon also lists the sense to care for, as in Philippians 2:20.')).accepted).toBe(1);
  });

  it('a caution that passes a moral verdict no cited text makes is dropped; the card stays', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G3309'));
    const r = await v.section(
      { section: 'original-languages', items: [{ strong: 'G3309', english: 'worry', significance: 'The verb Jesus uses for anxious care.', caution: 'The word itself is neutral; only its object and spirit make it sinful.', evidence: [lex] }] },
      topicPage(),
    );
    expect(r.accepted).toBe(1);
    expect(r.warnings.join(' ')).toMatch(/caution dropped — it passes a moral verdict \(“sinful”\)/);
    expect(r.payload?.section === 'original-languages' ? r.payload.items[0].caution : 'x').toBeUndefined();
  });

  it('anchors: “is not bound” translates δουλόω in 1 Corinthians 7:15; an auxiliary never does, and the hint never offers one', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G1402'));
    const anchored = (phrase: string) =>
      v.section({ section: 'original-languages', items: [{ strong: 'G1402', english: 'bound', anchor: { reference: '1 Corinthians 7:15', phrase }, significance: 'Paul says the believer is not enslaved.', evidence: [lex] }] }, topicPage());
    const ok = await anchored('is not bound');
    expect(ok.warnings.join(' ')).not.toMatch(/anchor dropped/);
    expect(ok.payload?.section === 'original-languages' ? ok.payload.items[0].anchors : []).toHaveLength(1);
    const bad = await anchored('has');
    expect(bad.warnings.join(' ')).toMatch(/anchor dropped — “has” does not translate G1402/);
    expect(bad.warnings.join(' ')).not.toMatch(/renders it “has”/);
  });

  it('a sense the lexicon states in other words is kept in the lexicon’s own wording (the divorce sense of ἀπολύω)', async () => {
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G630'));
    const r = await v.section(
      {
        section: 'original-languages',
        items: [{ strong: 'G630', english: 'divorces', significance: 'The verb for sending a wife away.', semanticRange: ['to set free, release', 'of divorce: to put away a wife'], evidence: [lex] }],
      },
      topicPage(),
    );
    const range = r.payload?.section === 'original-languages' ? r.payload.items[0].semanticRange : [];
    expect(range).toContain('to set free, release');
    expect(range.some((x) => /divorce/.test(x))).toBe(true);
    expect(range).not.toContain('of divorce: to put away a wife');
  });

  it('a verse without its book gets a hint to write the book name, not “not a Bible reference”', async () => {
    expect(pseudoReferences('In 7:15 it describes the unbeliever leaving.')).toEqual(['In 7:15']);
    const { v, E } = setup();
    const lex = E(await lexiconEvidence('G5563'));
    const r = await v.section({ section: 'original-languages', items: [{ strong: 'G5563', english: 'separate', significance: 'In 7:15 it describes the unbeliever leaving.', evidence: [lex] }] }, topicPage());
    expect(r.rejected[0].reason).toMatch(/verse without its book \(“In 7:15”\) — write the book name/);
  });
});

describe('ranges are kept whole', () => {
  it('related verses keep the verse the item is about (Malachi 2:10–16 keeps 2:16)', async () => {
    const { v, E } = setup();
    const easton = E({ ...EASTON_DIVORCE, text: `${EASTON_DIVORCE.text} Malachi rebukes this (Malachi 2:10–16).`, refs: [...(EASTON_DIVORCE.refs ?? []), parseReference('Malachi 2:10–16')!] });
    const r = await v.section(
      { section: 'historical-context', items: [{ category: 'religious', title: 'Faithless divorce', summary: 'Easton’s notes the practice.', relatedVerses: ['Malachi 2:10–16'], evidence: [easton] }] },
      topicPage(),
    );
    const verses = r.payload?.section === 'historical-context' ? (r.payload.items[0].relatedVerses ?? []) : [];
    expect(verses.map((x) => x.verse)).toEqual([10, 11, 12, 13, 14, 15, 16]);
  });
});

describe('API errors reach the reader as plain words', () => {
  it('a 400 “credit balance” rejection is persistent, sanitised (no JSON, no request id) and keeps the provider text for the log', () => {
    const body = { type: 'error', error: { type: 'invalid_request_error', message: 'Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits.' }, request_id: 'req_011Test' };
    const err = new Anthropic.BadRequestError(400, body, JSON.stringify(body), new Headers());
    const e = classifyError(err);
    expect(e.code).toBe('no-credit');
    expect(e.persistent).toBe(true);
    expect(e.message).toMatch(/no remaining credit/);
    expect(e.message).not.toMatch(/request_id|req_011|\{/);
    expect(e.upstream).toMatch(/invalid_request_error.*credit balance.*req_011Test/);
  });

  it('a billing_error body is the no-credit code too (the client localises it)', () => {
    const body = { type: 'error', error: { type: 'billing_error', message: 'This account cannot make requests.' } };
    const e = classifyError(new Anthropic.APIError(402, body, JSON.stringify(body), new Headers()));
    expect(e.code).toBe('no-credit');
    expect(e.persistent).toBe(true);
    expect(e.message).toMatch(/no remaining credit/);
  });

  it('any other 400 gets a plain message too; a rate limit stays retryable', () => {
    const body = { type: 'error', error: { type: 'invalid_request_error', message: 'messages: roles must alternate' } };
    const e = classifyError(new Anthropic.BadRequestError(400, body, JSON.stringify(body), new Headers()));
    expect(e.message).toMatch(/rejected the request \(400 invalid request\)/);
    expect(e.message).not.toMatch(/roles must alternate/);
    const rl = classifyError(new Anthropic.RateLimitError(429, { type: 'error', error: { type: 'rate_limit_error', message: 'slow down' } }, 'slow down', new Headers()));
    expect(rl.code).toBe('rate-limited');
    expect(rl.persistent).toBe(false);
  });
});

describe('evidence rendering for rare words and cited verses', () => {
  it('a rare lemma comes with the text of every verse it occurs in (Scripture evidence the model can cite); a common one does not', async () => {
    const { occurrenceVerses } = await import('../research');
    const kb = { providers } as unknown as Parameters<typeof occurrenceVerses>[0];
    const rare = await occurrenceVerses(kb, 'G1977', 'BSB', 6);
    expect(rare?.kind).toBe('scripture');
    expect(rare?.refs?.map((r) => formatRef(r))).toEqual(['Luke 19:35', '1 Peter 5:7']);
    expect(rare?.text).toMatch(/cloaks/);
    expect(await occurrenceVerses(kb, 'G3309', 'BSB', 6)).toBeNull();
  });

  it('a citation of Scripture shows the verse the claim names, not the best word overlap', async () => {
    const { v, E } = setup();
    const cor = E(await scripture('1 Corinthians 7:10–16'));
    const r = await keyPassage(v, '1 Corinthians 7:10–16', { note: 'In 1 Corinthians 7:15 the believer is not bound if the unbeliever leaves.' }, [cor]);
    const item = r.payload?.section === 'key-passages' ? r.payload.items[0] : null;
    expect(item?.note.provenance.citations[0].excerpt).toMatch(/^7:15 But if the unbeliever leaves/);
  });
});
