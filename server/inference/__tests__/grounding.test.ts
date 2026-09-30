/**
 * The routes by which claims from memory could reach the page (review findings):
 * tradition positions grounded in another tradition's texts, declined answers,
 * prose references and attributions not in the cited evidence, short and
 * single-quoted quotations, bare-domain links, unchecked reader-visible fields,
 * anchors that do not translate the word, wide reference ranges, unread evidence,
 * one-word "quotations" and non-senses shown as lexicon data.
 */
import { describe, expect, it } from 'vitest';
import type { PassageRef } from '../../../src/domain/models';
import type { EvidenceDraft } from '../../../src/inference/protocol';
import { EvidenceLedger } from '../ledger';
import { knowledgeBaseNote } from '../prompt';
import { RefChecker } from '../refs';
import { containsUrl, quotedSegments } from '../text';
import { pseudoReferences, stripEvidenceMarkers, Validator, type PageInfo } from '../validate';
import { CALVIN_MAT_19_3, EASTON_DIVORCE, FAKE_HOLDINGS, NAVES_DIVORCE, realProviders, scriptureEvidence, TORREY_DIVORCE, TRENT_24_7, TYNDALE_MAT_19_3, WCF_24_5 } from './fakes';

const providers = realProviders();
const MAT_19_3_12: PassageRef = { book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 12 };

function setup() {
  const ledger = new EvidenceLedger();
  const refs = new RefChecker(providers.scripture);
  let n = 0;
  const v = new Validator({ ledger, refs, providers, holdings: FAKE_HOLDINGS }, (p) => `t:${p}:${++n}`);
  const E = (d: EvidenceDraft) => ledger.add(d).evidence.id;
  return { ledger, v, E };
}

const topicPage = (passage?: PassageRef): PageInfo => ({ kind: 'topic', ...(passage ? { passage } : {}), sections: new Set(), keyWords: [] });
const passagePage = (passage: PassageRef): PageInfo => ({ kind: 'passage', passage, sections: new Set(['scripture']), keyWords: [] });

/** A Catholic Encyclopedia article as the knowledge base returns it (tagged with its tradition). */
const CATHOLIC_ENCYCLOPEDIA_DIVORCE: EvidenceDraft = {
  kind: 'dictionary',
  title: 'The Catholic Encyclopedia (1907–1914) — Divorce (in Moral Theology) (part 1)',
  text: 'The term divorce (divortium, from divertere, divortere, "to separate") was employed in pagan Rome for the mutual separation of married people. The Church teaches that a valid and consummated Christian marriage cannot be dissolved by any human power.',
  sourceId: 'catholic-encyclopedia',
  tradition: 'Catholic',
  locator: 's.v. Divorce',
  quotable: true,
};

const MATT_19_SCRIPTURE: EvidenceDraft = {
  kind: 'scripture',
  title: 'Matthew 19:3–9 (BSB)',
  text: '19:6 So they are no longer two, but one flesh. Therefore what God has joined together, let man not separate.',
  sourceId: 'bsb',
  refs: [{ book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 9 }],
  quotable: true,
};

function perspectives(positions: unknown[], evidence: string[]) {
  return {
    section: 'theology' as const,
    perspectives: [{ question: 'May the innocent party remarry after divorce?', consensus: 'denominational', intro: 'Churches read the exception clause differently.', evidence, positions }],
  };
}

describe('rule 5 — a position cites a text OF its tradition', () => {
  it('rejects Orthodox and Catholic positions grounded in Easton’s or a Tyndale note (the reviewer’s probe)', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const tyndale = E(TYNDALE_MAT_19_3);
    const wcf = E(WCF_24_5);
    const r = await v.section(
      perspectives(
        [
          { tradition: 'Eastern Orthodox', label: 'A second marriage by economia', summary: 'The church permits a second and third marriage by economia.', evidence: [easton] },
          { tradition: 'Catholic', label: 'The bond endures', summary: 'The marriage bond cannot be dissolved.', evidence: [tyndale] },
          { tradition: 'Reformed', label: 'Remarriage permitted', summary: 'The Westminster Confession allows the innocent party to remarry.', evidence: [wcf] },
        ],
        [wcf],
      ),
      topicPage(),
    );
    expect(r.payload).toBeNull();
    const reasons = r.rejected.map((x) => `${x.item}: ${x.reason}`).join('\n');
    expect(reasons).toMatch(/position 1 \(Eastern Orthodox\): none of the cited texts is a Eastern Orthodox text/);
    expect(reasons).toMatch(/holds no Eastern Orthodox texts: leave this position out/);
    expect(reasons).toMatch(/position 2 \(Catholic\): none of the cited texts is a Catholic text/);
    expect(reasons).toMatch(/holds Catholic texts \(Council of Trent\)/);
    expect(reasons).toMatch(/needs at least two positions/);
  });

  it('accepts texts of the tradition (tagged, by a registry author, confession titles) and names only their authors as representatives', async () => {
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const tyndale = E(TYNDALE_MAT_19_3);
    const ce = E(CATHOLIC_ENCYCLOPEDIA_DIVORCE);
    const calvin = E(CALVIN_MAT_19_3);
    const r = await v.section(
      perspectives(
        [
          { tradition: 'Reformed', label: 'Remarriage permitted', summary: 'The Westminster Confession allows the innocent party to divorce and remarry.', evidence: [wcf, tyndale] },
          { tradition: 'Roman Catholic', label: 'The bond endures', summary: 'The Church teaches that a consummated Christian marriage cannot be dissolved.', evidence: [ce] },
          { tradition: 'Calvinist', label: 'An indissoluble bond', summary: 'Calvin speaks of the sacred and indissoluble bond of marriage.', evidence: [calvin] },
        ],
        [wcf, ce],
      ),
      topicPage(),
    );
    expect(r.rejected).toEqual([]);
    if (r.payload?.section !== 'theology') throw new Error('no theology payload');
    const [reformed, catholic, calvinist] = r.payload.perspectives[0].perspectives;
    // Tyndale's note is cited too, but only the Reformed text's author represents the Reformed view
    expect(reformed.representatives).toEqual(['westminster-assembly']);
    expect(catholic.representatives).toBeUndefined();
    expect(calvinist.representatives).toEqual(['calvin']);
  });

  it('an umbrella label accepts any member tradition; a school must be named by the text; a vague label is rejected', async () => {
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const trent = E(TRENT_24_7);
    const tyndale = E(TYNDALE_MAT_19_3);
    const r = await v.section(
      perspectives(
        [
          { tradition: 'Protestant', label: 'Divorce for adultery', summary: 'The confession allows the innocent party to sue out a divorce.', evidence: [wcf] },
          { tradition: 'Catholic', label: 'No dissolution', summary: 'Trent teaches that adultery does not dissolve the bond.', evidence: [trent] },
          { tradition: 'School of Hillel', label: 'Any reason', summary: 'Tyndale’s note says Hillel allowed divorce for any reason.', evidence: [tyndale] },
          { tradition: 'Majority view', label: 'Permanence', summary: 'Marriage is permanent.', evidence: [tyndale] },
          { tradition: 'Permanence view', label: 'Permanence', summary: 'Marriage is permanent.', evidence: [tyndale] },
        ],
        [wcf, trent],
      ),
      topicPage(),
    );
    if (r.payload?.section !== 'theology') throw new Error('no theology payload');
    expect(r.payload.perspectives[0].perspectives.map((p) => p.tradition)).toEqual(['Protestant', 'Catholic', 'School of Hillel']);
    expect(r.rejected.map((x) => x.reason).join('\n')).toMatch(/“Majority view” names no tradition, school or interpreter/);
    expect(r.rejected.map((x) => x.reason).join('\n')).toMatch(/none of the cited texts names “Permanence view”/);
  });

  it('the system prompt lists which traditions the knowledge base holds texts for, and which it lacks', () => {
    const note = knowledgeBaseNote(FAKE_HOLDINGS)!;
    expect(note).toMatch(/- Reformed: Westminster Confession of Faith; Easton’s Bible Dictionary \(1897\); Calvin’s Commentaries/);
    expect(note).toMatch(/- Catholic: Council of Trent/);
    expect(note).toMatch(/No texts at all for: Eastern Orthodox, Lutheran/);
    expect(knowledgeBaseNote(null)).toBeNull();
  });
});

describe('declined answers only say what is missing', () => {
  it('rejects claims from memory in a declined answer without evidence (the reviewer’s probe)', async () => {
    const { v } = setup();
    const keller = await v.reply(
      { text: 'The knowledge base lacks this. Tim Keller argued in The Meaning of Marriage (2011) that divorce is permitted for abandonment; see Matthew 19:9.', evidence: [], declined: true },
      { readerText: 'Is divorce allowed for abandonment?' },
    );
    expect(keller.reply).toBeNull();
    expect(keller.rejected[0].reason).toMatch(/may only say what the knowledge base lacks/);
    for (const text of [
      'The knowledge base has no Orthodox text on this. See Matthew 19:9 for the exception.',
      'The knowledge base has no text on this; the practice began in 1563.',
      'The knowledge base lacks this; Augustine is the usual source.',
      'It lacks this. It has nothing on remarriage. Nor on annulment.',
    ]) {
      const r = await v.reply({ text, evidence: [], declined: true }, { readerText: 'What do the Orthodox say?' });
      expect(r.reply, text).toBeNull();
    }
  });

  it('accepts a plain decline, and may echo an author the reader named', async () => {
    const { v } = setup();
    const plain = await v.reply({ text: 'The knowledge base holds no Eastern Orthodox text on remarriage, so I cannot describe that view.', evidence: [], declined: true });
    expect(plain.reply?.declined).toBe(true);
    const named = await v.reply({ text: 'The knowledge base holds nothing by Keller, so I cannot say what he argues.', evidence: [], declined: true }, { readerText: 'What does Keller say about divorce?' });
    expect(named.reply?.declined).toBe(true);
  });
});

describe('prose is grounded in its citations', () => {
  it('rejects a reference in prose that the cited evidence does not give', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    const r = await v.section(
      { section: 'theology', themes: [{ category: 'ethics', title: 'God hates divorce', summary: 'Malachi 2:16 says God hates divorce, and Hebrews 13:4 honours marriage.', keyVerses: [], evidence: [naves] }] },
      topicPage(),
    );
    expect(r.payload).toBeNull();
    expect(r.rejected[0].reason).toMatch(/mentions Hebrews 13:4, which none of the cited evidence gives/);
    const ok = await v.section(
      { section: 'theology', themes: [{ category: 'ethics', title: 'God hates divorce', summary: 'Nave’s lists Malachi 2:14–16 among the texts on divorce.', keyVerses: ['Malachi 2:16'], evidence: [naves] }] },
      topicPage(),
    );
    expect(ok.accepted).toBe(1);
  });

  it('rejects names, works and dates the cited evidence does not contain (the reviewer’s probes)', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const cases: [string, RegExp][] = [
      ['Josephus and Philo both report that Jewish men divorced for any cause.', /names Josephus, Philo/],
      ['Augustine wrote that the bond of marriage remains after divorce.', /names Augustine/],
      ['The Westminster Confession allows remarriage.', /names Westminster/],
      ['Catholics forbid remarriage after divorce.', /speaks of Catholics/],
      ['The Mosaic law was codified around 1400 BC.', /gives the date 1400/],
    ];
    for (const [summary, reason] of cases) {
      const r = await v.section({ section: 'historical-context', items: [{ category: 'jewish-tradition', title: 'Divorce practice', summary, evidence: [easton] }] }, topicPage());
      expect(r.rejected[0]?.reason, summary).toMatch(reason);
    }
    const ok = await v.section(
      { section: 'historical-context', items: [{ category: 'jewish-tradition', title: 'Slight pretences', summary: 'Easton’s says Jews of Jesus’ day dissolved marriages on slight pretences (Matthew 5:31–32).', evidence: [easton] }] },
      topicPage(),
    );
    expect(ok.accepted).toBe(1);
  });

  it('a registry author is grounded by evidence they wrote, even when the text does not repeat the name', async () => {
    const { v, E } = setup();
    const calvin = E(CALVIN_MAT_19_3);
    const jfb = E({ kind: 'commentary', title: 'Jamieson-Fausset-Brown on Matthew 19:8', text: 'Moses—as a civil lawgiver. suffered you to put away your wives—tolerated a relaxation of the strictness of the marriage bond.', sourceId: 'jfb-commentary', quotable: true });
    const r = await v.section(
      {
        section: 'commentary',
        voices: [
          { evidence: jfb, mode: 'summary', summary: 'JFB reads Moses as a civil lawgiver who tolerated divorce.' },
          { evidence: calvin, mode: 'summary', summary: 'Calvin says the Pharisees’ malice settled the question of divorce.' },
        ],
      },
      topicPage(),
    );
    expect(r.rejected).toEqual([]);
  });
});

describe('quotations of every style are verified', () => {
  it('detects ‘…’, \'…\', «…», „…“ and short “…” runs, never apostrophes', () => {
    expect(quotedSegments('He said ‘one two three four five six seven eight nine ten eleven twelve thirteen’ today')).toEqual(['one two three four five six seven eight nine ten eleven twelve thirteen']);
    expect(quotedSegments("Calvin calls it 'the sacred and indissoluble bond' here")).toEqual(['the sacred and indissoluble bond']);
    expect(quotedSegments('Luther: «marriage is a worldly thing» and „a matter for the state“ too')).toEqual(['marriage is a worldly thing', 'a matter for the state']);
    expect(quotedSegments('“four words right here” and “two words”')).toEqual(['four words right here']);
    expect(quotedSegments('Easton’s note, the Pharisees’ test, Moses\' law and don’t or can\'t — no quotations here at all')).toEqual([]);
    expect(quotedSegments('Hillel and Shammai on ‘any reason’')).toEqual([]);
  });

  it('rejects an invented single-quoted quotation; accepts Scripture read in this request or on the page passage', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const bad = await v.section(
      {
        section: 'theology',
        themes: [{ category: 'ethics', title: 'An enduring bond', summary: "Easton's describes the Mosaic law; one might say 'the bond of marriage remains even when spouses separate' in Christ's teaching.", keyVerses: [], evidence: [easton] }],
      },
      topicPage(),
    );
    expect(bad.rejected[0].reason).toMatch(/puts “the bond of marriage remains even when spouses separate” in quotation marks/);
    // Scripture the model read (the ledger's scripture items) may be quoted even if another item is cited
    E(MATT_19_SCRIPTURE);
    const read = await v.section(
      { section: 'theology', themes: [{ category: 'ethics', title: 'One flesh', summary: 'Easton’s notes that Christ regulated divorce; he says ‘what God has joined together, let man not separate’.', keyVerses: [], evidence: [easton] }] },
      topicPage(),
    );
    expect(read.rejected).toEqual([]);
    // … and so may the page passage (checked against the Bible text itself)
    const { v: v2, E: E2 } = setup();
    const wcf = E2(WCF_24_5);
    const onPage = await v2.section(
      { section: 'theology', themes: [{ category: 'ethics', title: 'One flesh', summary: 'The confession allows divorce for adultery, though Jesus says ‘let man not separate’ what God joined.', keyVerses: [], evidence: [wcf] }] },
      passagePage(MAT_19_3_12),
    );
    expect(onPage.rejected).toEqual([]);
  });

  it('on a page in another language, accepts the page passage quoted in the reader’s version', async () => {
    const blivre = (await providers.scripture.getPassage({ book: 'MAT', startChapter: 19, startVerse: 6, endChapter: 19, endVerse: 6 }, 'BLIVRE')).chapters[0].verses[0].text;
    const words = blivre.replace(/[^\p{L}\p{N}\s'’-]/gu, ' ').split(/\s+/).filter(Boolean);
    expect(words.length).toBeGreaterThan(6);
    const quote = words.slice(0, 6).join(' ');
    const summary = `A confissão permite o divórcio por adultério, embora Jesus diga ‘${quote}’ neste texto.`;
    const make = (locale?: 'pt') => {
      const ledger = new EvidenceLedger();
      const v = new Validator({ ledger, refs: new RefChecker(providers.scripture), providers, holdings: FAKE_HOLDINGS, translation: 'BLIVRE', ...(locale ? { locale } : {}) }, (p) => p);
      return { v, wcf: ledger.add(WCF_24_5).evidence.id };
    };
    const { v, wcf } = make('pt');
    const r = await v.section({ section: 'theology', themes: [{ category: 'ethics', title: 'Uma só carne', summary, keyVerses: [], evidence: [wcf] }] }, passagePage(MAT_19_3_12));
    expect(r.rejected).toEqual([]);
  });

  it('a commentary quotation must be at least a phrase (6 words)', async () => {
    const { v, E } = setup();
    const calvin = E(CALVIN_MAT_19_3);
    const r = await v.section({ section: 'commentary', voices: [{ evidence: calvin, mode: 'quote', quote: 'the' }] }, topicPage());
    expect(r.accepted).toBe(0);
    expect(r.rejected[0].reason).toMatch(/at least a phrase of 6 words/);
  });
});

describe('links, evidence ids and non-references in reader-facing text', () => {
  it('detects bare-domain links but not abbreviations or references', () => {
    expect(containsUrl('see ccel.org/ccel/calvin/calcom31')).toBe(true);
    expect(containsUrl('desiringgod.org/articles/divorce')).toBe(true);
    expect(containsUrl('See www.example.com')).toBe(true);
    for (const ok of ['e.g. Matt. 19:9', 'i.e. the law', 'Rom. 8:1 and 1 Cor. 7:10', 'Easton’s notes (s.v. Divorce).', 'St. John']) expect(containsUrl(ok), ok).toBe(false);
  });

  it('strips “(see E3)” and ranges; a bare id left in prose is rejected', async () => {
    expect(stripEvidenceMarkers({ text: 'Moses allowed it (see E3) and Christ limited it [E5]. Compare (cf. E3–E5).' }).text).toBe('Moses allowed it and Christ limited it. Compare.');
    const { v, E } = setup();
    E(NAVES_DIVORCE);
    const easton = E(EASTON_DIVORCE);
    const r = await v.reply({ text: 'E1 lists the passages and E2 says so.', evidence: [easton] });
    expect(r.reply).toBeNull();
    expect(r.rejected[0].reason).toMatch(/contains evidence ids \(E1, E2\)/);
  });

  it('flags chapter-and-verse citations of things that are not books', () => {
    expect(pseudoReferences('See Hezekiah 3:16 and Tobit 99:1, but not Matthew 19:3 or Song of Songs 2:3 or Confession 24:5.')).toEqual(['Hezekiah 3:16', 'Tobit 99:1']);
  });
});

describe('every reader-visible field is checked', () => {
  const URL = 'more at desiringgod.org/articles/divorce';
  const QUOTE = 'As Luther wrote, “marriage is a worldly thing belonging to the realm of the state”';

  it('begin_page: title, subtitle, question and summary', async () => {
    for (const field of ['title', 'subtitle', 'question'] as const) {
      for (const bad of [URL, QUOTE, 'See Hezekiah 3:16']) {
        const { v, E } = setup();
        const naves = E(NAVES_DIVORCE);
        const input = { title: 'Divorce', kind: 'topic', summary: { text: 'What the Bible says about divorce.', evidence: [naves] }, [field]: bad };
        const r = await v.beginPage(input);
        expect(r.page, `${field}: ${bad}`).toBeNull();
      }
    }
  });

  it('section items: every prose field, including group, english and tradition', async () => {
    type Case = { section: string; build: (bad: string | undefined, ev: Record<string, string>) => Record<string, unknown>; page?: PageInfo };
    /** the field set to `bad`, or left as is for the baseline run */
    const o = (f: string, bad: string | undefined) => (bad === undefined ? {} : { [f]: bad });
    const cases: Case[] = [
      ...['title', 'note', 'group'].map((f) => ({
        section: 'key-passages',
        build: (bad: string | undefined, ev: Record<string, string>) => ({ section: 'key-passages', items: [{ reference: 'Deuteronomy 24:1–4', title: 'The certificate', note: 'Moses regulates divorce.', group: 'The Law', evidence: [ev.naves], ...o(f, bad) }] }),
      })),
      ...['title', 'explanation'].map((f) => ({
        section: 'cross-references',
        page: passagePage(MAT_19_3_12),
        build: (bad: string | undefined, ev: Record<string, string>) => ({ section: 'cross-references', items: [{ from: 'Matthew 19:8', to: 'Deuteronomy 24:1', relationship: 'allusion', title: 'Moses', explanation: 'Jesus answers the Mosaic permission.', evidence: [ev.torrey], ...o(f, bad) }] }),
      })),
      ...['title', 'summary', 'detail'].map((f) => ({
        section: 'historical-context',
        build: (bad: string | undefined, ev: Record<string, string>) => ({ section: 'historical-context', items: [{ category: 'customs', title: 'Practice', summary: 'Easton’s describes the practice.', evidence: [ev.easton], ...o(f, bad) }] }),
      })),
      ...['title', 'summary', 'detail'].map((f) => ({
        section: 'theology',
        build: (bad: string | undefined, ev: Record<string, string>) => ({ section: 'theology', themes: [{ category: 'ethics', title: 'Design', summary: 'Easton’s says Christ limited divorce.', keyVerses: [], evidence: [ev.easton], ...o(f, bad) }] }),
      })),
      ...['question', 'intro', 'commonGround', 'label', 'summary', 'tradition'].map((f) => ({
        section: 'theology',
        build: (bad: string | undefined, ev: Record<string, string>) => {
          const top = ['question', 'intro', 'commonGround'].includes(f);
          const pos = (tradition: string, e: string, summary: string) => ({ tradition, label: 'A view', summary, evidence: [e], ...(!top && tradition === 'Reformed' ? o(f, bad) : {}) });
          return {
            section: 'theology',
            perspectives: [
              {
                question: 'May the innocent party remarry?',
                consensus: 'denominational',
                intro: 'Churches differ.',
                evidence: [ev.wcf, ev.trent],
                positions: [pos('Reformed', ev.wcf, 'The confession allows it.'), pos('Catholic', ev.trent, 'Trent forbids it.')],
                ...(top ? o(f, bad) : {}),
              },
            ],
          };
        },
      })),
      ...['placeInBook', 'feature'].map((f) => ({
        section: 'literary-context',
        page: passagePage(MAT_19_3_12),
        build: (bad: string | undefined, ev: Record<string, string>) => ({
          section: 'literary-context',
          placeInBook: { text: f === 'placeInBook' && bad !== undefined ? bad : 'Tyndale’s note sets the debate.', evidence: [ev.tyndale] },
          features: [{ type: 'repetition', title: 'Two schools', description: f === 'feature' && bad !== undefined ? bad : 'Tyndale’s note contrasts two schools.', evidence: [ev.tyndale] }],
        }),
      })),
      ...['summary', 'lead'].map((f) => ({
        section: 'commentary',
        build: (bad: string | undefined, ev: Record<string, string>) => ({ section: 'commentary', voices: [{ evidence: ev.calvin, mode: 'summary', summary: 'Calvin says the question was settled.', ...o(f, bad) }] }),
      })),
      ...['english', 'significance', 'caution'].map((f) => ({
        section: 'original-languages',
        build: (bad: string | undefined, ev: Record<string, string>) => ({ section: 'original-languages', items: [{ strong: 'G630', english: 'divorce', significance: 'The verb for dismissing a wife.', evidence: [ev.greek], ...o(f, bad) }] }),
      })),
    ];
    const deut24 = await scriptureEvidence('Deuteronomy 24:1–4');
    for (const c of cases) {
      for (const bad of [undefined, URL, QUOTE]) {
        const { v, E } = setup();
        const ev = {
          naves: E(NAVES_DIVORCE),
          torrey: E(TORREY_DIVORCE),
          easton: E(EASTON_DIVORCE),
          wcf: E(WCF_24_5),
          trent: E(TRENT_24_7),
          calvin: E(CALVIN_MAT_19_3),
          tyndale: E(TYNDALE_MAT_19_3),
          greek: E({ kind: 'original-text', title: 'Greek text of Matthew 19:3', text: '19:3 ἀπολῦσαι (apolusai) G0630 “to divorce” V-AAN', sourceId: 'stepbible-tagnt', quotable: true }),
          read: E(deut24),
        };
        const input = c.build(bad, ev);
        const r = await v.section(input as never, c.page ?? topicPage());
        const label = `${c.section} ${JSON.stringify(input).slice(0, 200)}`;
        if (bad === undefined) {
          // the baseline passes, so the bad value is what is refused
          expect(r.rejected, label).toEqual([]);
          continue;
        }
        const text = JSON.stringify(r.payload ?? {});
        expect(text.includes('desiringgod') || text.includes('worldly thing'), label).toBe(false);
        expect(r.rejected.length + r.warnings.filter((w) => /dropped/.test(w)).length, label).toBeGreaterThan(0);
      }
    }
  });

  it('finish_page and reply: opening, concept label and answer; suggestions with links or quotations are dropped', async () => {
    const { v, E } = setup();
    const naves = E(NAVES_DIVORCE);
    const page = topicPage();
    const r = await v.finish(
      {
        opening: { text: 'A page on divorce from the passages Nave’s lists.', evidence: [naves] },
        concepts: [
          { label: 'desiringgod.org/x', aliases: [], answer: 'Nave’s lists the texts.', section: 'overview', evidence: [naves] },
          { label: 'The exception', aliases: ['exception clause', 'see ccel.org/x'], answer: 'Nave’s lists Matthew 5:31–32.', section: 'overview', evidence: [naves] },
        ],
        suggestedQuestions: [
          'What did Moses permit?',
          'Read desiringgod.org/divorce?',
          'Why did Luther say “marriage is a worldly thing”?',
          'What does Hezekiah 3:16 add?',
          'What does ‘some indecency’ mean?',
          'Why does Nave’s list “Disobedience of the wife to the husband”?',
        ],
      },
      page,
    );
    expect(r.concepts.map((c) => c.label)).toEqual(['The exception']);
    expect(r.concepts[0].aliases).toEqual(['the exception', 'exception clause']);
    // short quoted phrases, and longer ones verbatim in the evidence, are fine
    expect(r.suggestedQuestions).toEqual(['What did Moses permit?', 'What does ‘some indecency’ mean?', 'Why does Nave’s list “Disobedience of the wife to the husband”?']);
    const bad = await v.finish({ opening: { text: QUOTE, evidence: [naves] }, concepts: [], suggestedQuestions: [] }, page);
    expect(bad.opening).toBeNull();
    const reply = await v.reply({ text: `Nave’s lists the texts; ${URL}.`, evidence: [naves] });
    expect(reply.reply).toBeNull();
  });

  it('section titles and intros are framing only: no references outside the page passage, names, dates, quotations or links', async () => {
    const { v } = setup();
    const page = passagePage(MAT_19_3_12);
    expect(await v.framingProblem('Jesus on divorce in Matthew 19:3–9', 'title', page)).toBeNull();
    for (const bad of ['Compare Romans 7:2–3', 'As Augustine taught', 'Since 1563 the rule', 'On “a worldly thing of the state”', 'See ccel.org', 'How Catholics read it']) {
      expect(await v.framingProblem(bad, 'intro', page), bad).not.toBeNull();
    }
  });
});

describe('references: containment, not overlap', () => {
  it('rejects a key passage wider than what the evidence gives, and accepts a range within a few verses of it', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    E(await scriptureEvidence('Matthew 19:3–12'));
    const r = await v.section(
      {
        section: 'key-passages',
        items: [
          { reference: 'Matthew 1–28', title: 'The whole Gospel', note: 'Easton’s mentions it.', group: 'Gospels', evidence: [easton] },
          { reference: 'Matthew 19', title: 'The chapter', note: 'Easton’s mentions it.', group: 'Gospels', evidence: [easton] },
          { reference: 'Matthew 19:3–12', title: 'Jesus and the Pharisees', note: 'Easton’s cites Matthew 19:1–9.', group: 'Gospels', evidence: [easton] },
        ],
      },
      topicPage(),
    );
    expect(r.accepted).toBe(1);
    expect(r.rejected.map((x) => x.reason)).toEqual([
      expect.stringMatching(/the cited evidence gives .*Matthew 5:31–32.*, not Matthew — use the range/),
      expect.stringMatching(/not Matthew 19 — use the range the evidence gives/),
    ]);
  });

  it('secondary references no longer pass by containing the page passage', async () => {
    const { v, E } = setup();
    const easton = E(EASTON_DIVORCE);
    const r = await v.section(
      { section: 'theology', themes: [{ category: 'ethics', title: 'Design', summary: 'Easton’s says Christ limited divorce.', keyVerses: ['Matthew 19:4', 'Matthew 18–20'], evidence: [easton] }] },
      passagePage(MAT_19_3_12),
    );
    if (r.payload?.section !== 'theology') throw new Error('no payload');
    expect(r.payload.themes[0].keyVerses.map((x) => `${x.startChapter}:${x.startVerse ?? ''}`)).toEqual(['19:4']);
    expect(r.warnings.join(' ')).toMatch(/dropped Matthew 18–20/);
  });
});

describe('evidence the model never read cannot be cited', () => {
  it('items listed as “text not shown” are refused until shown', () => {
    const ledger = new EvidenceLedger();
    const long = (i: number): EvidenceDraft => ({ kind: 'dictionary', title: `Entry ${i}`, text: `${'word '.repeat(700)}${i}`, sourceId: 'eastons-bible-dictionary', quotable: true });
    const entries = ledger.addAll([long(1), long(2), long(3), long(4)]);
    const rendered = ledger.render(entries, 8000);
    expect(rendered).toMatch(/\[E4\] Entry 4 — text not shown .* cannot be cited until you read it/);
    const v = new Validator({ ledger, refs: new RefChecker(providers.scripture), providers }, (p) => p);
    const c = v.cite(['E4']);
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.reason).toMatch(/not read \(E4/);
    const mixed = v.cite(['E1', 'E4']);
    expect(mixed.ok && mixed.evidence.map((e) => e.id)).toEqual(['E1']);
    // shown in a later result → citable
    ledger.render(ledger.addAll([long(4)]), 28000);
    expect(v.cite(['E4']).ok).toBe(true);
  });

  it('the evidence header names the author and tradition so the model knows who can be a voice', () => {
    const ledger = new EvidenceLedger({ authorName: (e) => (e.authorId === 'westminster-assembly' ? 'Westminster Assembly' : undefined) });
    const out = ledger.render(ledger.addAll([WCF_24_5]));
    expect(out).toContain('[E1] Westminster Confession of Faith 24.5 — Of Marriage and Divorce (confession · westminster-confession · ch. 24 §5 · by Westminster Assembly · Reformed)');
  });
});

describe('key words: anchors translate the word; lexicon senses are senses', () => {
  it('drops an anchor phrase that is not the word’s translation (the reviewer’s probe), with the BSB rendering as a hint', async () => {
    const { v, E } = setup();
    const lex = E({ kind: 'lexicon', title: 'G630 ἀπολύω', text: 'G630 ἀπολύω (apoluō): to release', sourceId: 'stepbible-tbesg', strong: 'G630', quotable: true });
    const r = await v.section(
      { section: 'original-languages', items: [{ strong: 'G630', english: 'divorce', anchor: { reference: 'Matthew 19:8', phrase: 'hardness of heart' }, significance: 'The verb for dismissing a wife.', evidence: [lex] }] },
      topicPage(),
    );
    expect(r.accepted).toBe(1);
    const kw = r.payload?.section === 'original-languages' ? r.payload.items[0] : null;
    expect(kw?.anchors).toEqual([]);
    expect(r.warnings.join(' ')).toMatch(/“hardness of heart” does not translate G630 \(its gloss in Matthew 19:8 is “to divorce”\); the BSB renders it “divorce”/);
  });

  it('falls back to usable senses: never a lexicographer’s note, never empty when the gloss has one', async () => {
    const { v, E } = setup();
    const ot = E({ kind: 'original-text', title: 'Greek text of Matthew 19:7–9', text: '19:7 ἀποστάσιον G0647 “of divorce” | 19:9 πορνείᾳ G4202 “sexual immorality”', sourceId: 'stepbible-tagnt', quotable: true });
    const r = await v.section(
      {
        section: 'original-languages',
        items: [
          { strong: 'G647', english: 'certificate of divorce', anchor: { reference: 'Matthew 19:7', phrase: 'certificate of divorce' }, significance: 'The written dismissal Moses required.', semanticRange: ['used alone in the same sense'], evidence: [ot] },
          { strong: 'G4202', english: 'sexual immorality', anchor: { reference: 'Matthew 19:9', phrase: 'sexual immorality' }, significance: 'The term of the exception clause.', evidence: [ot] },
        ],
      },
      topicPage(),
    );
    const [g647, g4202] = r.payload?.section === 'original-languages' ? r.payload.items : [];
    expect(g647.anchors).toHaveLength(1);
    expect(g647.semanticRange).toEqual(['divorce']);
    expect(g4202.anchors).toHaveLength(1);
    expect(g4202.semanticRange).toEqual(['sexual sin']);
  });
});

describe('commentary voices need a recorded author', () => {
  it('a confession with a corporate author can be a voice; an anonymous creed cannot (and the reason says where to use it)', async () => {
    const { v, E } = setup();
    const wcf = E(WCF_24_5);
    const creed = E({ kind: 'confession', title: 'The Apostles’ Creed (received form)', text: 'I believe in God the Father Almighty; Maker of heaven and earth.', sourceId: 'apostles-creed', tradition: 'Ecumenical', quotable: true });
    const r = await v.section(
      {
        section: 'commentary',
        voices: [
          { evidence: wcf, mode: 'summary', summary: 'The Westminster Confession lets the innocent party divorce after adultery and marry another.' },
          { evidence: creed, mode: 'summary', summary: 'The creed confesses God the Father as Maker of heaven and earth.' },
        ],
      },
      topicPage(),
    );
    expect(r.payload?.section === 'commentary' ? r.payload.items.map((c) => c.authorId) : []).toEqual(['westminster-assembly']);
    expect(r.rejected[0].reason).toMatch(/has no recorded author .* header shows “by …”; use this text in a theme, context item or perspectives position instead/);
  });
});
