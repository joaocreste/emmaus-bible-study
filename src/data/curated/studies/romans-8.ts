import type { CuratedStudy, PassageRef, VerseRef } from '../../../domain/models';
import { cite, synthesis, summaryOf, verifiedQuote, lexical, historical, literary, text } from '../../../domain/provenance';

/**
 * Curated passage study: Romans 8 — life in the Spirit, from “no condemnation”
 * (8:1) to “no separation” (8:39). Every lexical fact and count was taken from
 * STEPBible TBESG/TAGNT, every quotation matched verbatim against the linked copy,
 * and every modern work checked against a real page (see the verification log).
 */

/* ------------------------------------------------------------------ */
/* Frequently used URLs (all opened during authoring)                  */
/* ------------------------------------------------------------------ */

const TYN_BOOKS = 'https://bible.helloao.org/api/c/tyndale/books.json';
const TYN_ROM_8 = 'https://bible.helloao.org/api/c/tyndale/ROM/8.json';
const CALVIN_JSON_ROM_8 = 'https://bible.helloao.org/api/c/john-calvin/ROM/8.json';
const CALVIN_ROM_8_1 = 'https://ccel.org/ccel/calvin/calcom38/calcom38.xii.i.html';
const CALVIN_ROM_8_34 = 'https://ccel.org/ccel/calvin/calcom38/calcom38.xii.x.html';
const HENRY_ROM_8 = 'https://ccel.org/ccel/henry/mhc6/mhc6.Rom.ix.html';
const CHRYS_HOM_13 = 'https://www.newadvent.org/fathers/210213.htm';
const CHRYS_HOM_14 = 'https://www.newadvent.org/fathers/210214.htm';
const CHRYS_HOM_15 = 'https://www.newadvent.org/fathers/210215.htm';
const LUTHER_PREFACE = 'https://ccel.org/l/luther/romans/pref_romans.html';
const OWEN_CH_1 = 'https://ccel.org/ccel/owen/mort/mort.i.iv.html';
const OWEN_CH_2 = 'https://ccel.org/ccel/owen/mort/mort.i.v.html';
const WESLEY_ROM_7 = 'https://ccel.org/ccel/wesley/notes/notes.i.vii.viii.html';
const WESLEY_ROM_8 = 'https://ccel.org/ccel/wesley/notes/notes.i.vii.ix.html';
const SPURGEON_1917 = 'https://www.spurgeon.org/sermons/in-christ-not-condemnation';
const SPURGEON_1532 = 'https://www.spurgeon.org/sermons/the-holy-spirits-intercession';
const PIPER_NO_CONDEMNATION = 'https://www.desiringgod.org/messages/no-condemnation-in-christ-jesus';
const PIPER_FOREKNOWN = 'https://www.desiringgod.org/messages/foreknown-predestined-conformed-to-christ';
const KELLER_FREEDOM = 'https://gospelinlife.com/sermon/freedom-in-the-spirit/';
const KELLER_FREEDOM_NOTES = 'https://podcast.gospelinlife.com/e/freedom-in-the-spirit/';
const KELLER_CERTAINTY = 'https://gospelinlife.com/sermon/certainty-of-the-spirit/';
const KELLER_CERTAINTY_NOTES = 'https://podcast.gospelinlife.com/e/certainty-of-the-spirit/';
const SPROUL_GOLDEN_CHAIN = 'https://learn.ligonier.org/sermons/golden-chain';
const PACKER_KNOWING_GOD = 'https://en.wikipedia.org/wiki/Knowing_God';
const WRIGHT_NEW_INHERITANCE = 'https://ntwrightpage.com/2016/04/05/the-new-inheritance-according-to-paul/';
const BARR_ABBA = 'https://doi.org/10.1093/jts/39.1.28';
const TGC_ABBA = 'https://www.thegospelcoalition.org/article/factchecker-does-abba-mean-daddy/';
const CHALLIES_ADOPTION = 'https://www.challies.com/resources/the-essential-adoption/';
const DNB_EVANS = 'https://en.wikisource.org/wiki/Dictionary_of_National_Biography,_1885-1900/Evans,_John_(1680%3F-1730)';
const WEB_HOME = 'https://worldenglish.bible/';
const SUETONIUS_CLAUDIUS = 'https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Suetonius/12Caesars/Claudius*.html';
const WCF_CH_3 = 'https://ccel.org/ccel/schaff/creeds3/creeds3.iv.xvii.ii.html';
const DORT = 'https://ccel.org/ccel/schaff/creeds3/creeds3.iv.xvi.html';
const REMONSTRANCE = 'https://ccel.org/ccel/schaff/creeds3/creeds3.iv.xv.html';
const CONCORD = 'https://ccel.org/ccel/schaff/creeds3/creeds3.iii.iv.html';
const TRENT_6 = 'https://ccel.org/ccel/schaff/creeds2/creeds2.v.i.i.iv.html';
const DAMASCENE_2_30 = 'https://www.newadvent.org/fathers/33042.htm';
const CATH_ENC_PREDESTINATION = 'https://www.newadvent.org/cathen/12378a.htm';
const LXX_GEN_22 = 'https://bible.helloao.org/api/grc_bre/GEN/22.json';
const LXX_EXO_4 = 'https://bible.helloao.org/api/grc_bre/EXO/4.json';
const LXX_LEV_23 = 'https://bible.helloao.org/api/grc_bre/LEV/23.json';
const LXX_PSA_43 = 'https://bible.helloao.org/api/grc_bre/PSA/43.json';
const LXX_ISA_50 = 'https://bible.helloao.org/api/grc_bre/ISA/50.json';
const LXX_ECC_1 = 'https://bible.helloao.org/api/grc_bre/ECC/1.json';
const BRENTON_EN_GEN_22 = 'https://bible.helloao.org/api/eng_bre/GEN/22.json';
const BRENTON_EN_ISA_50 = 'https://bible.helloao.org/api/eng_bre/ISA/50.json';

/* ------------------------------------------------------------------ */
/* Reference helpers                                                   */
/* ------------------------------------------------------------------ */

/** A verse of Romans 8. */
const v = (verse: number): VerseRef => ({ book: 'ROM', chapter: 8, verse });

/** A verse range inside one chapter (single verse when `end` is omitted). */
function vv(book: string, chapter: number, start: number, end = start): PassageRef {
  return { book, startChapter: chapter, startVerse: start, endChapter: chapter, endVerse: end };
}

/** A range spanning chapters. */
function span(book: string, c1: number, v1: number, c2: number, v2: number): PassageRef {
  return { book, startChapter: c1, startVerse: v1, endChapter: c2, endVerse: v2 };
}

/** Romans 8 verse range. */
const r8 = (start: number, end = start): PassageRef => vv('ROM', 8, start, end);

/* ------------------------------------------------------------------ */
/* Study                                                               */
/* ------------------------------------------------------------------ */

const study: CuratedStudy = {
  id: 'romans-8',
  kind: 'passage',
  title: 'Romans 8',
  subtitle: 'Life in the Spirit — from no condemnation to no separation',
  passage: { book: 'ROM', startChapter: 8 },

  match: {
    references: [{ book: 'ROM', startChapter: 8 }],
    topics: [
      'romans 8',
      'romans eight',
      'romans chapter 8',
      'life in the spirit',
      'no condemnation',
      'there is now no condemnation',
      'no separation',
      'nothing can separate us from the love of god',
      'more than conquerors',
      'all things work together for good',
      'the golden chain',
      'spirit of adoption',
      'abba father',
      'groans too deep for words',
      'firstfruits of the spirit',
    ],
  },

  summary: text(
    'Romans 8 is the summit of Paul’s argument in chapters 5–8. It opens with “no condemnation for those who are in Christ Jesus” (8:1) and closes with the certainty that nothing in all creation can “separate us from the love of God that is in Christ Jesus our Lord” (8:39). In between, Paul shows the Holy Spirit doing what the law could not: giving life, leading God’s children, prompting the cry “Abba! Father!” and interceding in our weakness — the Greek word for Spirit occurs here 21 times, more than in any other New Testament chapter. Present suffering is set inside God’s purpose to renew creation and redeem our bodies, and the chapter ends in a courtroom where no accuser can succeed, because God justifies and Christ intercedes.',
    synthesis(
      cite('bsb', 'Rom 8:1, 39'),
      cite('tyndale-open-study-notes', 'Romans introduction, “Summary”', TYN_BOOKS),
      cite('stepbible-tagnt', 'πνεῦμα (G4151) in Rom 8: 21 occurrences in the NA28 text'),
    ),
  ),

  opening: text(
    'Welcome to Romans 8 — a chapter many Christians treasure above almost any other. It begins with “no condemnation” and ends with the promise that nothing can separate us from God’s love, and in between Paul describes the Spirit’s work, our adoption as God’s children, and a hope large enough to hold present suffering. Tap a highlighted word to see the Greek behind it, or ask me about a verse, a word, or what Christians across the centuries have said about it.',
    synthesis(cite('bsb', 'Rom 8:1, 39')),
  ),

  /* ---------------------------------------------------------------- */
  /* Key words                                                         */
  /* ---------------------------------------------------------------- */

  keyWords: [
    {
      id: 'romans-8:kw:katakrima',
      strong: 'G2631',
      language: 'greek',
      lemma: 'κατάκριμα',
      transliteration: 'katakrima',
      pronunciation: 'kah-TAH-kree-mah',
      english: 'condemnation',
      anchors: [{ verse: v(1), phrases: { BSB: 'condemnation', KJV: 'condemnation', WEB: 'condemnation' } }],
      grammar: 'Noun, nominative singular neuter',
      basicMeaning: 'condemnation; the penalty that follows a sentence',
      semanticRange: [
        'condemnation — the adverse verdict pronounced against someone (so most English versions)',
        'penalty — the sentence carried out (Abbott-Smith’s gloss; RV “condemnation”)',
      ],
      notableOccurrences: [
        { ref: vv('ROM', 5, 16), note: '“The judgment that followed one sin brought condemnation” — Adam’s trespass.' },
        { ref: vv('ROM', 5, 18), note: '“One trespass brought condemnation for all men” — the verdict 8:1 reverses for those in Christ.' },
      ],
      significance: text(
        'Κατάκριμα occurs only three times in the New Testament, all in Romans: twice in 5:16–18, where Adam’s one trespass brings condemnation on all, and here. So 8:1 answers 5:18 directly — for those “in Christ Jesus” the verdict and its penalty that hung over humanity in Adam no longer stand. Paul then explains why: God “condemned sin in the flesh” of his Son (8:3), and at the end no one can condemn those whom God justifies (8:34).',
        synthesis(
          cite('stepbible-tagnt', 'G2631: Rom 5:16; 5:18; 8:1 (all NT occurrences)'),
          cite('stepbible-tbesg', 'G2631 κατάκριμα'),
          cite('bsb', 'Rom 5:16–18; 8:3, 34'),
        ),
      ),
      caution:
        '“No condemnation” is a verdict about a person’s standing before God. It does not mean that believers no longer sin or struggle — Paul still calls them to “put to death the deeds of the body” (8:13).',
      provenance: lexical(
        cite('stepbible-tbesg', 'G2631 κατάκριμα'),
        cite('stepbible-tagnt', 'Rom 8:1; occurrences counted by Strong’s number (NA28 text)'),
      ),
    },
    {
      id: 'romans-8:kw:katakrino',
      strong: 'G2632',
      language: 'greek',
      lemma: 'κατακρίνω',
      transliteration: 'katakrinō',
      pronunciation: 'kah-tah-KREE-noh',
      english: 'condemned',
      anchors: [
        { verse: v(3), phrases: { BSB: 'condemned sin', KJV: 'condemned sin', WEB: 'condemned sin' } },
        { verse: v(34), phrases: { BSB: 'condemn', KJV: 'condemneth', WEB: 'condemns' } },
      ],
      grammar:
        'Verb, aorist active indicative, 3rd person singular (8:3); participle in 8:34 — tagged present by TAGNT, though the accent of the printed form (κατακρινῶν) is that of a future participle: “who will condemn?”',
      basicMeaning: 'to condemn; to give judgment against',
      semanticRange: [
        'to give judgment against, condemn a person (Mark 14:64; John 8:10–11)',
        'passive: to be condemned (Rom 14:23; 1 Cor 11:32)',
        'figuratively, to condemn by contrast or example (Matt 12:41–42; Heb 11:7 — Abbott-Smith also files Rom 8:3 here)',
      ],
      notableOccurrences: [
        { ref: vv('MRK', 14, 64), note: 'The council “all condemned Him as deserving of death” — Jesus himself condemned.' },
        { ref: vv('JHN', 8, 10, 11), note: '“Neither do I condemn you” — Jesus to the woman caught in adultery.' },
        { ref: r8(34), note: '“Who is there to condemn us?” — the question the chapter leaves unanswerable.' },
      ],
      significance: text(
        'Paul uses the related verb (18 times in the New Testament) twice more in the chapter, echoing the noun of 8:1. In 8:3 God is the subject: sending his Son “as an offering for sin”, he “condemned sin in the flesh” — the sentence fell on sin, in Christ, rather than on those who are in him (so the Tyndale note: God condemned sin in Christ, our substitute). In 8:34 “Who is there to condemn us?” has no answer, because the one who died, was raised and now intercedes is Christ himself.',
        synthesis(
          cite('stepbible-tagnt', 'G2632: 18 occurrences (NA28); Rom 8:3, 34'),
          cite('tyndale-open-study-notes', 'note on Rom 8:3', TYN_ROM_8),
          cite('bsb', 'Rom 8:3, 34'),
        ),
      ),
      caution:
        'Abbott-Smith’s lexicon lists 8:3 under the figurative sense (condemning by contrast); most commentators read it as God’s judicial sentence executed on sin in Christ’s flesh. Context, not the dictionary entry, has to decide.',
      provenance: lexical(
        cite('stepbible-tbesg', 'G2632 κατακρίνω'),
        cite('stepbible-tagnt', 'Rom 8:3 (V-AAI-3S), 8:34 (V-PAP-NSM)'),
      ),
    },
    {
      id: 'romans-8:kw:sarx',
      strong: 'G4561',
      language: 'greek',
      lemma: 'σάρξ',
      transliteration: 'sarx',
      pronunciation: 'SARKS',
      english: 'flesh',
      anchors: [
        { verse: v(4), phrases: { BSB: 'flesh', KJV: 'flesh', WEB: 'flesh' } },
        { verse: v(13), phrases: { BSB: 'flesh', KJV: 'flesh', WEB: 'flesh' } },
      ],
      grammar: 'Noun, accusative singular feminine (κατὰ σάρκα, “according to the flesh”, 8:4)',
      basicMeaning: 'flesh',
      semanticRange: [
        'the physical substance of the body; the body itself',
        'human beings in their frailty and mortality (“all flesh”)',
        'natural descent and relationship (“according to the flesh”, Rom 1:3; 9:3, 5)',
        'in Paul’s ethical usage, humanity as the seat and vehicle of sinful desire, opposed to the Spirit (Rom 8:4–13; Gal 5:16–17)',
      ],
      notableOccurrences: [
        { ref: vv('ROM', 1, 3), note: 'Neutral sense: Jesus “a descendant of David according to the flesh”.' },
        { ref: vv('ROM', 7, 18), note: '“Nothing good lives in me, that is, in my flesh” — the struggle just before chapter 8.' },
        { ref: vv('GAL', 5, 16, 17), note: '“The flesh craves what is contrary to the Spirit” — Paul’s other great flesh/Spirit passage.' },
      ],
      significance: text(
        'Σάρξ occurs 13 times in 8:3–13 alone (147 times in the New Testament). Paul is not saying the body is evil: God condemned sin in the flesh, not the flesh itself (8:3), and the Spirit will give life to our mortal bodies (8:11). “Flesh” here is humanity as it is in Adam — weak, self-reliant, bent toward sin and “hostile to God” (8:7). “According to the flesh” and “according to the Spirit” describe two ways of existing and two sources of life, not two parts of a person.',
        synthesis(
          cite('stepbible-tagnt', 'G4561: 13× in Rom 8, 147× in NT (NA28)'),
          cite('stepbible-tbesg', 'G4561 σάρξ, sense 3(b) “in ethical sense, esp. in Pauline Epp.”'),
          cite('tyndale-open-study-notes', 'note on Rom 8:4', TYN_ROM_8),
          cite('bsb', 'Rom 8:3–13'),
        ),
      ),
      caution:
        'Do not read “flesh” in this chapter as “physical body” or “sexuality”. Some translations render it “sinful nature” (as in the NLT text used by the Tyndale notes); context decides each use — compare the neutral “according to the flesh” in Romans 1:3 and 9:5.',
      provenance: lexical(
        cite('stepbible-tbesg', 'G4561 σάρξ'),
        cite('stepbible-tagnt', 'Rom 8:4 (N-ASF); occurrences counted by Strong’s number'),
      ),
    },
    {
      id: 'romans-8:kw:pneuma',
      strong: 'G4151',
      language: 'greek',
      lemma: 'πνεῦμα',
      transliteration: 'pneuma',
      pronunciation: 'PNYOO-mah',
      english: 'Spirit',
      anchors: [
        { verse: v(2), phrases: { BSB: 'Spirit of life', KJV: 'Spirit of life', WEB: 'Spirit of life' } },
        { verse: v(16), phrases: { BSB: 'The Spirit Himself', KJV: 'The Spirit itself', WEB: 'The Spirit himself' } },
      ],
      grammar: 'Noun, genitive singular neuter (τοῦ πνεύματος τῆς ζωῆς, “of the Spirit of life”, 8:2)',
      basicMeaning: 'spirit, breath; the (Holy) Spirit',
      semanticRange: [
        'wind; breath',
        'the human spirit — “our spirit” (8:16)',
        'a disposition or frame of mind — “a spirit of slavery” (8:15)',
        'the Holy Spirit — “the Spirit of God”, “the Spirit of Christ” (8:9)',
      ],
      notableOccurrences: [
        { ref: vv('ROM', 5, 5), note: '“God has poured out His love into our hearts through the Holy Spirit” — first announced before chapter 8.' },
        { ref: vv('ROM', 7, 6), note: '“The new way of the Spirit” versus “the old way of the written code”.' },
        { ref: vv('GAL', 5, 16, 25), note: '“Walk by the Spirit” — the same ethic in Galatians.' },
      ],
      significance: text(
        'Twenty-one of Romans’ 34 uses of πνεῦμα fall in this chapter, against five in chapters 1–7; no other New Testament chapter comes close (1 Corinthians 12 is next, with 12). The Spirit is “the Spirit of God” and “the Spirit of Christ” in a single sentence (8:9). He sets free (8:2), gives life now and resurrection later (8:10–11), leads God’s children (8:14), testifies with our spirit (8:16) and intercedes for us (8:26–27).',
        synthesis(
          cite('stepbible-tagnt', 'G4151 by chapter (NA28): Rom 8 = 21; Romans = 34; 1 Cor 12 = 12'),
          cite('stepbible-tbesg', 'G4151 πνεῦμα'),
          cite('bsb', 'Rom 8:2, 9–11, 14–16, 26–27'),
        ),
      ),
      caution:
        'In a few verses translators must choose between “Spirit” and “spirit” — compare 8:10 (BSB “your spirit is alive”; KJV “the Spirit is life”) and 8:15 (“a spirit of slavery”). Capital letters are an interpretive decision; the Greek text does not mark the difference.',
      provenance: lexical(
        cite('stepbible-tbesg', 'G4151 πνεῦμα (G4151G “spirit”)'),
        cite('stepbible-tagnt', 'Rom 8:2 (N-GSN); occurrences counted by Strong’s number'),
      ),
    },
    {
      id: 'romans-8:kw:phronema',
      strong: 'G5427',
      language: 'greek',
      lemma: 'φρόνημα',
      transliteration: 'phronēma',
      pronunciation: 'FRON-ay-mah',
      english: 'mind (mind-set)',
      anchors: [{ verse: v(6), phrases: { BSB: 'mind of the flesh', KJV: 'carnally minded', WEB: 'mind of the flesh' } }],
      grammar: 'Noun, nominative singular neuter',
      basicMeaning: 'the thought; what the mind is set on, purpose',
      semanticRange: [
        'what is in the mind: thought, outlook, mind-set',
        'purpose (the STEPBible gloss)',
      ],
      notableOccurrences: [
        { ref: r8(7), note: '“The mind of the flesh is hostile to God.”' },
        { ref: r8(27), note: '“He who searches our hearts knows the mind of the Spirit” — the same word, used of the Spirit.' },
      ],
      significance: text(
        'All four New Testament uses of this noun are in Romans 8 (8:6 twice, 8:7, 8:27). Flesh and Spirit each have a “mind” — an orientation of will and desire, not just a set of ideas (the Tyndale note on the related verb in 8:5 makes the same point). That orientation issues either in death or in “life and peace” (8:6); and in 8:27 the Father knows “the mind of the Spirit” as the Spirit intercedes.',
        synthesis(
          cite('stepbible-tagnt', 'G5427: Rom 8:6 (2×), 8:7, 8:27 — all NT occurrences'),
          cite('tyndale-open-study-notes', 'note on Rom 8:5', TYN_ROM_8),
          cite('bsb', 'Rom 8:5–7, 27'),
        ),
      ),
      provenance: lexical(cite('stepbible-tbesg', 'G5427 φρόνημα'), cite('stepbible-tagnt', 'Rom 8:6 (N-NSN)')),
    },
    {
      id: 'romans-8:kw:huiothesia',
      strong: 'G5206',
      language: 'greek',
      lemma: 'υἱοθεσία',
      transliteration: 'huiothesia',
      pronunciation: 'hwee-oh-theh-SEE-ah',
      english: 'adoption',
      anchors: [
        { verse: v(15), phrases: { BSB: 'adoption', KJV: 'adoption', WEB: 'adoption' } },
        { verse: v(23), phrases: { BSB: 'adoption', KJV: 'adoption', WEB: 'adoption' } },
      ],
      grammar: 'Noun, genitive singular feminine (πνεῦμα υἱοθεσίας, “Spirit of adoption”, 8:15)',
      basicMeaning: 'adoption (as son)',
      semanticRange: [
        'adoption of a son or daughter (a legal term common in inscriptions)',
        'God’s relation with Israel (Rom 9:4)',
        'God’s relation with Christians (Rom 8:15; Gal 4:5; Eph 1:5)',
        'its future consummation (Rom 8:23)',
      ],
      notableOccurrences: [
        { ref: vv('ROM', 9, 4), note: '“Theirs is the adoption as sons” — the privilege belonged first to Israel.' },
        { ref: vv('GAL', 4, 5), note: '“That we might receive our adoption as sons” — the Son sent to redeem.' },
        { ref: vv('EPH', 1, 5), note: '“He predestined us for adoption as His sons through Jesus Christ.”' },
      ],
      significance: text(
        'Only Paul uses this word in the New Testament (5 times), and Romans 8 uses it of both present and future: the Spirit of adoption has already been received (8:15), yet we still “wait eagerly for our adoption as sons, the redemption of our bodies” (8:23). Paul borrows a Greco-Roman legal term — an adopted son received the full rights of an heir (Tyndale note on 8:15) — but fills it with Israel’s story, since “the adoption” belonged first to Israel (9:4; Exod 4:22).',
        synthesis(
          cite('stepbible-tagnt', 'G5206: Rom 8:15, 23; 9:4; Gal 4:5; Eph 1:5'),
          cite('tyndale-open-study-notes', 'notes on Rom 8:15, 8:23', TYN_ROM_8),
          cite('bsb', 'Rom 8:15, 23; 9:4'),
        ),
      ),
      caution:
        'Avoid pressing every detail of Roman adoption law onto Paul; the Tyndale notes also point to the Old Testament picture of Israel as God’s son (Exod 4:22; Hos 11:1).',
      provenance: lexical(cite('stepbible-tbesg', 'G5206 υἱοθεσία'), cite('stepbible-tagnt', 'Rom 8:15 (N-GSF), 8:23 (N-ASF)')),
    },
    {
      id: 'romans-8:kw:abba',
      strong: 'G5',
      language: 'greek',
      lemma: 'ἀββά',
      transliteration: 'abba',
      pronunciation: 'ab-BAH',
      english: 'Abba',
      anchors: [{ verse: v(15), phrases: { BSB: 'Abba', KJV: 'Abba', WEB: 'Abba' } }],
      grammar: 'Noun, vocative singular masculine — an indeclinable Aramaic word written in Greek letters',
      basicMeaning: 'father (Aramaic אַבָּא, the emphatic form of אַב)',
      semanticRange: [
        'father — the ordinary Aramaic family word, used here as a direct address',
        'always paired in the New Testament with the Greek ὁ πατήρ: “Abba, Father”',
      ],
      notableOccurrences: [
        { ref: vv('MRK', 14, 36), note: 'Jesus in Gethsemane: “Abba, Father… not what I will, but what You will.”' },
        { ref: vv('GAL', 4, 6), note: 'The Spirit of the Son in our hearts, “crying out, ‘Abba, Father!’”' },
      ],
      significance: text(
        'Paul leaves the Aramaic word untranslated in a Greek letter and adds its Greek equivalent. Its only other New Testament uses are Jesus’ prayer in Gethsemane (Mark 14:36) and Galatians 4:6, which suggests that the address Jesus used became the treasured prayer of Greek-speaking churches. For Paul it is the Spirit who enables this cry: believers pray to God as Jesus did — as children, not slaves.',
        synthesis(
          cite('stepbible-tagnt', 'G5 (ἀββά): Mark 14:36; Rom 8:15; Gal 4:6'),
          cite('stepbible-tbesg', 'G5 ἀββά'),
          cite('bsb', 'Mark 14:36; Rom 8:15; Gal 4:6'),
        ),
      ),
      caution:
        'Popular teaching often says abba means “Daddy” (some study notes, including the Tyndale note on 8:15, still say so). James Barr (1988) argued that the evidence does not support baby-talk: abba was an everyday family word, used by sons and daughters young and grown, but its nuance is “Father”, not “Daddy”.',
      provenance: lexical(cite('stepbible-tbesg', 'G5 ἀββά'), cite('stepbible-tagnt', 'Rom 8:15 (N-VSM-T)')),
    },
    {
      id: 'romans-8:kw:aparche',
      strong: 'G536',
      language: 'greek',
      lemma: 'ἀπαρχή',
      transliteration: 'aparchē',
      pronunciation: 'ap-ar-KHAY',
      english: 'firstfruits',
      anchors: [{ verse: v(23), phrases: { BSB: 'firstfruits', KJV: 'firstfruits', WEB: 'first fruits' } }],
      grammar: 'Noun, accusative singular feminine',
      basicMeaning: 'firstfruits',
      semanticRange: [
        'the first portion of a sacrifice or harvest, offered to God',
        'firstfruits of the harvest (Lev 23:10 in the Greek OT) and of dough (Rom 11:16; cf. Num 15:20)',
        'figuratively: the first converts of a region (Rom 16:5); the risen Christ (1 Cor 15:20, 23)',
      ],
      notableOccurrences: [
        { ref: vv('1CO', 15, 20), note: '“Christ has indeed been raised from the dead, the firstfruits of those who have fallen asleep.”' },
        { ref: vv('ROM', 11, 16), note: 'The firstfruits dough makes the whole batch holy.' },
      ],
      significance: text(
        'In Leviticus 23:10 the Greek Old Testament uses this very word for the first sheaf of the harvest, waved before the Lord before any of the crop could be eaten. Paul calls the Spirit the “firstfruits” believers already possess — the first installment and guarantee of the harvest still to come: full adoption and bodily resurrection (8:23). He uses the same image of Christ’s resurrection in 1 Corinthians 15:20.',
        synthesis(
          cite('lxx-brenton', 'Lev 23:10 (ἀπαρχὴν τοῦ θερισμοῦ)', LXX_LEV_23),
          cite('tyndale-open-study-notes', 'note on Rom 8:23', TYN_ROM_8),
          cite('stepbible-tagnt', 'G536: 9 NT occurrences'),
          cite('bsb', 'Lev 23:10–14; Rom 8:23; 1 Cor 15:20'),
        ),
      ),
      provenance: lexical(cite('stepbible-tbesg', 'G536 ἀπαρχή'), cite('stepbible-tagnt', 'Rom 8:23 (N-ASF)')),
    },
    {
      id: 'romans-8:kw:sunergeo',
      strong: 'G4903',
      language: 'greek',
      lemma: 'συνεργέω',
      transliteration: 'sunergeō',
      pronunciation: 'soon-er-GEH-oh',
      english: 'work together',
      anchors: [{ verse: v(28), phrases: { BSB: 'works all things together', KJV: 'work together', WEB: 'work together' } }],
      grammar: 'Verb, present active indicative, 3rd person singular',
      basicMeaning: 'to work with; to work together',
      semanticRange: [
        'to work together with, cooperate (Mark 16:20; 1 Cor 16:16; Jas 2:22)',
        'to cause to work together — a transitive sense found in Hellenistic writers, which some adopt for Rom 8:28',
      ],
      notableOccurrences: [
        { ref: vv('JAS', 2, 22), note: 'Abraham’s “faith was working with his actions”.' },
        { ref: vv('2CO', 6, 1), note: '“As God’s fellow workers” — the same verb of human cooperation with God.' },
      ],
      significance: text(
        'The Greek of 8:28 can be construed more than one way, which is why translations differ: “all things work together for good” (KJV, WEB) or “God works all things together for the good” (BSB). A small group of manuscripts makes the subject explicit by adding “God” (ὁ θεός) — a reading the Westcott–Hort edition adopted, though the other editions in the STEPBible data, including the Byzantine text, lack it. Abbott-Smith’s lexicon notes both an intransitive and a transitive sense. Either way the context makes God’s purpose decisive (8:28b–30), and 8:29 defines the “good”: being conformed to the image of his Son.',
        synthesis(
          cite('stepbible-tagnt', 'Rom 8:28 — ὁ θεός tagged as an “Other” variant, in WH only (absent from NA28, NA27, Tyndale House, SBL, Tregelles, TR, Byz)'),
          cite('stepbible-tbesg', 'G4903 συνεργέω, senses 1–2'),
          cite('bsb', 'Rom 8:28–29'),
          cite('kjv', 'Rom 8:28'),
        ),
      ),
      caution:
        'Paul does not say that every event is good, or that things turn out well for everyone. The promise is for “those who love Him, who are called according to His purpose”, and the good in view is likeness to Christ — which may come through suffering (8:17, 35–36).',
      provenance: lexical(cite('stepbible-tbesg', 'G4903 συνεργέω'), cite('stepbible-tagnt', 'Rom 8:28 (V-PAI-3S)')),
    },
    {
      id: 'romans-8:kw:proginosko',
      strong: 'G4267',
      language: 'greek',
      lemma: 'προγινώσκω',
      transliteration: 'proginōskō',
      pronunciation: 'pro-gin-OHS-koh',
      english: 'foreknew',
      anchors: [{ verse: v(29), phrases: { BSB: 'foreknew', KJV: 'foreknow', WEB: 'foreknew' } }],
      grammar: 'Verb, second aorist active indicative, 3rd person singular',
      basicMeaning: 'to know beforehand, foreknow (STEPBible gloss: “to know/choose”)',
      semanticRange: [
        'to know beforehand, of people knowing something in advance (Acts 26:5; 2 Pet 3:17)',
        'of God’s foreknowledge (Rom 8:29; 11:2; 1 Pet 1:20)',
      ],
      notableOccurrences: [
        { ref: vv('ROM', 11, 2), note: '“God did not reject His people, whom He foreknew” — the object is again people.' },
        { ref: vv('1PE', 1, 20), note: 'Christ “was known before the foundation of the world”.' },
        { ref: vv('ACT', 26, 5), note: 'Human foreknowledge: Paul’s accusers “have known me for a long time”.' },
      ],
      significance: text(
        'Everything in the chain of 8:29–30 hangs on this first verb, and its meaning is debated. Its object is people (“those”), not facts about them, and in the Old Testament “to know” can mean to choose or set one’s love on someone (Amos 3:2). Reformed readers therefore take it as “fore-loved”; others read it as God’s foreknowledge of those who would believe. The verb occurs five times in the New Testament. See the perspectives on 8:29–30 under Theology.',
        synthesis(
          cite('stepbible-tagnt', 'G4267: Acts 26:5; Rom 8:29; 11:2; 1 Pet 1:20; 2 Pet 3:17'),
          cite('stepbible-tbesg', 'G4267 προγινώσκω'),
          cite('bsb', 'Rom 8:29; 11:2; Amos 3:2'),
        ),
      ),
      caution: 'A single verb cannot settle the doctrine of election; the surrounding argument (8:28–39) and Romans 9–11 must be weighed too.',
      provenance: lexical(cite('stepbible-tbesg', 'G4267 προγινώσκω'), cite('stepbible-tagnt', 'Rom 8:29 (V-2AAI-3S)')),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Cross-references                                                  */
  /* ---------------------------------------------------------------- */

  crossReferences: [
    {
      id: 'romans-8:xr:rom-7-24',
      from: r8(1, 2),
      target: span('ROM', 7, 24, 7, 25),
      relationship: 'contrast',
      title: 'From “wretched man” to “no condemnation”',
      explanation: text(
        'Romans 7 ends with a cry — “Who will rescue me from this body of death?” — and a thanksgiving through Jesus Christ. Romans 8:1 draws the conclusion (“Therefore”): the struggle of chapter 7 is real, but it does not decide the believer’s standing. Where 7:23 spoke of “the law of sin” holding a captive, 8:2 announces that “the law of the Spirit of life” has set free. The chapter break is a later addition; Paul’s argument runs straight on.',
        synthesis(cite('bsb', 'Rom 7:23–25; 8:1–2'), cite('spurgeon-in-christ-no-condemnation', 'MTP no. 1917, introduction', SPURGEON_1917)),
      ),
      tags: ['condemnation', 'law', 'flesh', 'freedom', 'romans 7', 'struggle'],
    },
    {
      id: 'romans-8:xr:rom-5-16',
      from: r8(1),
      target: vv('ROM', 5, 16, 18),
      relationship: 'same-concept',
      title: 'Condemnation in Adam, life in Christ',
      explanation: text(
        'The only other New Testament uses of κατάκριμα are here: one trespass “brought condemnation for all men”, but one act of righteousness “brought justification and life for all men”. Romans 8:1 applies 5:18 to those who are in Christ — the verdict passed on humanity in Adam has been replaced.',
        synthesis(cite('stepbible-tagnt', 'G2631: Rom 5:16, 18; 8:1'), cite('bsb', 'Rom 5:16–18; 8:1')),
      ),
      tags: ['condemnation', 'katakrima', 'adam', 'justification'],
    },
    {
      id: 'romans-8:xr:jhn-3-17',
      from: r8(1),
      target: vv('JHN', 3, 17, 18),
      relationship: 'same-concept',
      title: 'Whoever believes is not condemned',
      explanation: text(
        'Jesus’ words to Nicodemus state the same verdict: God “did not send His Son into the world to condemn the world, but to save the world through Him”, and “whoever believes in Him is not condemned”. John uses the simpler verb κρίνω (“judge”, here in the sense of judging against), and ties freedom from condemnation to believing in the Son; Paul ties it to being “in Christ Jesus”. They are two angles on one union.',
        synthesis(cite('stepbible-tagnt', 'John 3:17–18 (G2919 κρίνω)'), cite('bsb', 'John 3:17–18; Rom 8:1')),
      ),
      tags: ['condemnation', 'faith', 'judgment'],
    },
    {
      id: 'romans-8:xr:gal-5-16',
      from: r8(4, 13),
      target: vv('GAL', 5, 16, 25),
      relationship: 'parallel',
      title: 'Flesh against Spirit',
      explanation: text(
        'Paul’s other extended treatment of flesh and Spirit. Galatians describes the conflict (“the flesh craves what is contrary to the Spirit”) and the Spirit’s fruit (5:22–23); Romans 8 grounds the same call — to walk “according to the Spirit” (Rom 8:4) or “by the Spirit” (Gal 5:16, 25) — in the Spirit’s life-giving work. Read together they show that “flesh” is a power and a way of life, not simply the body.',
        synthesis(cite('bsb', 'Gal 5:16–25; Rom 8:4–13'), cite('stepbible-tbesg', 'G4561 σάρξ, sense 3(b)')),
      ),
      tags: ['flesh', 'spirit', 'walk', 'sanctification', 'mortification'],
    },
    {
      id: 'romans-8:xr:gal-4-4',
      from: r8(14, 17),
      target: vv('GAL', 4, 4, 7),
      relationship: 'parallel',
      title: '“Abba, Father!” in Galatians',
      explanation: text(
        'The closest parallel in Paul. God sent his Son “that we might receive our adoption as sons”, and sent “the Spirit of His Son into our hearts, crying out, ‘Abba, Father!’” — “so you are no longer a slave, but a son… also an heir”. The same sequence (adoption, Spirit, Abba-cry, slave to son, heir) runs through Romans 8:14–17. In Galatians the Spirit cries; in Romans we cry by the Spirit.',
        synthesis(cite('bsb', 'Gal 4:4–7; Rom 8:14–17')),
      ),
      tags: ['adoption', 'abba', 'heirs', 'slavery', 'spirit', 'sons'],
    },
    {
      id: 'romans-8:xr:exo-4-22',
      from: r8(14, 15),
      target: vv('EXO', 4, 22, 23),
      relationship: 'thematic',
      title: 'Israel, God’s firstborn son',
      explanation: text(
        'In the exodus story God called Israel “My firstborn son” and told Pharaoh to “let My son go”. Paul’s language of sons led by the Spirit and freed from “a spirit of slavery” recalls that story (the Tyndale note on 8:14 cites Exod 4:22; N. T. Wright argues that the whole of Romans 5–8 retells the exodus). The Greek Old Testament calls Israel God’s πρωτότοκος, “firstborn” — the title Paul gives Christ “among many brothers” in 8:29.',
        synthesis(
          cite('tyndale-open-study-notes', 'note on Rom 8:14', TYN_ROM_8),
          cite('wright-new-inheritance', 'Bible Review 14.3 (1998)', WRIGHT_NEW_INHERITANCE),
          cite('lxx-brenton', 'Exod 4:22 (υἱὸς πρωτότοκός μου Ἰσραήλ)', LXX_EXO_4),
          cite('bsb', 'Exod 4:22–23; Rom 8:14–15, 29'),
        ),
      ),
      tags: ['adoption', 'sons', 'exodus', 'slavery', 'israel', 'firstborn'],
    },
    {
      id: 'romans-8:xr:gen-3-17',
      from: r8(19, 22),
      target: vv('GEN', 3, 17, 19),
      relationship: 'allusion',
      title: 'The ground cursed because of Adam',
      explanation: text(
        'After Adam’s sin God said, “cursed is the ground because of you” — thorns, toil and a return to dust. Paul’s “the creation was subjected to futility… because of the One who subjected it, in hope” most naturally recalls this judgment: John Wesley glossed “him who subjected it” as “God, Gen. iii, 17”, and the Tyndale note traces creation’s harm to Adam’s fall. Romans adds what Genesis only hints: the subjection was “in hope”, and creation will share “the glorious freedom of the children of God”.',
        synthesis(
          cite('wesley-explanatory-notes', 'on Rom 8:20', WESLEY_ROM_8),
          cite('tyndale-open-study-notes', 'note on Rom 8:19–21', TYN_ROM_8),
          cite('bsb', 'Gen 3:17–19; Rom 8:19–22'),
        ),
      ),
      tags: ['creation', 'futility', 'curse', 'adam', 'hope', 'groaning'],
    },
    {
      id: 'romans-8:xr:lev-23-10',
      from: r8(23),
      target: vv('LEV', 23, 9, 14),
      relationship: 'historical',
      title: 'The firstfruits sheaf',
      explanation: text(
        'Israel brought “a sheaf of the firstfruits” of the harvest to the priest, who waved it before the LORD; no bread or grain could be eaten “until the very day you have brought this offering”. The Greek Old Testament calls that sheaf ἀπαρχή, the word Paul uses of the Spirit in 8:23. The first sheaf both consecrated and promised the whole harvest — so the Spirit is God’s pledge of the full redemption still to come.',
        synthesis(
          cite('lxx-brenton', 'Lev 23:10', LXX_LEV_23),
          cite('tyndale-open-study-notes', 'note on Rom 8:23', TYN_ROM_8),
          cite('bsb', 'Lev 23:9–14; Rom 8:23'),
        ),
      ),
      tags: ['firstfruits', 'harvest', 'spirit', 'hope', 'redemption'],
    },
    {
      id: 'romans-8:xr:1co-15-20',
      from: r8(23),
      target: vv('1CO', 15, 20, 23),
      relationship: 'same-concept',
      title: 'Christ the firstfruits of the resurrection',
      explanation: text(
        'Paul uses the same harvest picture of Christ: raised as “the firstfruits of those who have fallen asleep”, with “those who belong to Him” to follow “at His coming”. Romans 8 names the link between the two harvests: the Spirit of him who raised Jesus will also give life to our mortal bodies (8:11), and we who have the Spirit’s firstfruits await “the redemption of our bodies” (8:23).',
        synthesis(cite('bsb', '1 Cor 15:20–23; Rom 8:11, 23'), cite('stepbible-tagnt', 'G536: 1 Cor 15:20, 23; Rom 8:23')),
      ),
      tags: ['resurrection', 'firstfruits', 'body', 'hope', 'spirit'],
    },
    {
      id: 'romans-8:xr:2co-5-2',
      from: r8(22, 23),
      target: vv('2CO', 5, 1, 5),
      relationship: 'parallel',
      title: 'Groaning in this tent',
      explanation: text(
        'Here too believers “groan” — the same verb (στενάζω) as Romans 8:23 — longing to be clothed with resurrection life, and “God… has given us the Spirit as a pledge of what is to come”. Both passages hold together present groaning and future glory, with the Spirit as the guarantee between them.',
        synthesis(cite('stepbible-tagnt', 'G4727 στενάζω: Rom 8:23; 2 Cor 5:2, 4'), cite('bsb', '2 Cor 5:1–5; Rom 8:22–23')),
      ),
      tags: ['groaning', 'hope', 'spirit', 'body', 'suffering', 'resurrection'],
    },
    {
      id: 'romans-8:xr:eph-1-13',
      from: r8(17, 23),
      target: vv('EPH', 1, 13, 14),
      relationship: 'same-concept',
      title: 'The Spirit as pledge of the inheritance',
      explanation: text(
        'Ephesians calls the Holy Spirit “the pledge of our inheritance until the redemption of those who are God’s possession” — the same logic as Romans 8:17 and 8:23: heirs now, full inheritance and redemption later, with the Spirit as the guarantee in between. The Tyndale note on 8:23 links the two passages.',
        synthesis(cite('tyndale-open-study-notes', 'note on Rom 8:23', TYN_ROM_8), cite('bsb', 'Eph 1:13–14; Rom 8:17, 23')),
      ),
      tags: ['spirit', 'inheritance', 'heirs', 'assurance', 'redemption'],
    },
    {
      id: 'romans-8:xr:ps-44-22',
      from: r8(36),
      target: vv('PSA', 44, 22),
      relationship: 'quotation',
      title: '“Sheep to be slaughtered”',
      explanation: text(
        'Paul quotes the Greek Psalm almost word for word (Psalm 43:23 in the Septuagint’s numbering). Psalm 44 is the lament of people who had “not forgotten You or betrayed Your covenant” yet suffered “for Your sake”. Quoting it shows that suffering is no sign of God’s rejection — the faithful have always suffered for him (Calvin makes the same point) — and Paul answers the psalm’s complaint at once: “in all these things we are more than conquerors” (8:37).',
        synthesis(
          cite('lxx-brenton', 'Ps 43:23 LXX', LXX_PSA_43),
          cite('stepbible-tagnt', 'Rom 8:36'),
          cite('calvin-commentaries', 'on Rom 8:36', CALVIN_JSON_ROM_8),
          cite('bsb', 'Ps 44:17–22; Rom 8:36–37'),
        ),
      ),
      tags: ['suffering', 'persecution', 'psalms', 'love', 'conquerors'],
    },
    {
      id: 'romans-8:xr:isa-50-8',
      from: r8(33, 34),
      target: vv('ISA', 50, 8, 9),
      relationship: 'allusion',
      title: '“Who is there to condemn Me?”',
      explanation: text(
        'In the third Servant Song the Servant says, “The One who vindicates Me is near… Who is there to condemn Me?” In the Greek Old Testament the first line speaks of the one who justifies (ὁ δικαιώσας με) — in Brenton’s translation, “he that has justified me draws near”. Paul’s courtroom — “It is God who justifies. Who is there to condemn us?” — echoes the Servant’s confidence and extends it to all who belong to Christ.',
        synthesis(
          cite('lxx-brenton', 'Isa 50:8 (Greek)', LXX_ISA_50),
          cite('lxx-brenton', 'Isa 50:8 (Brenton’s English translation)', BRENTON_EN_ISA_50),
          cite('stepbible-tagnt', 'Rom 8:33 (ὁ δικαιῶν)'),
          cite('bsb', 'Isa 50:8–9; Rom 8:33–34'),
        ),
      ),
      tags: ['condemnation', 'justification', 'servant', 'courtroom', 'accusation'],
    },
    {
      id: 'romans-8:xr:gen-22-12',
      from: r8(32),
      target: vv('GEN', 22, 12, 16),
      relationship: 'allusion',
      title: '“He who did not spare His own Son”',
      explanation: text(
        'Abraham was commended because “you have not withheld your only son”; the Greek Old Testament says οὐκ ἐφείσω — in Brenton’s translation, “thou hast not spared thy beloved son” — the same verb Paul uses in 8:32 (οὐκ ἐφείσατο). The Tyndale note sees Genesis 22 behind Paul’s words. The contrast is the point: Isaac was spared at the last moment; God’s own Son was not.',
        synthesis(
          cite('lxx-brenton', 'Gen 22:12, 16 (Greek)', LXX_GEN_22),
          cite('lxx-brenton', 'Gen 22:12 (Brenton’s English translation)', BRENTON_EN_GEN_22),
          cite('stepbible-tagnt', 'Rom 8:32 (G5339 φείδομαι)'),
          cite('tyndale-open-study-notes', 'note on Rom 8:32', TYN_ROM_8),
          cite('bsb', 'Gen 22:12, 16; Rom 8:32'),
        ),
      ),
      tags: ['love', 'atonement', 'abraham', 'isaac', 'sacrifice'],
    },
    {
      id: 'romans-8:xr:heb-7-25',
      from: r8(34),
      target: vv('HEB', 7, 25),
      relationship: 'same-concept',
      title: 'Christ lives to intercede',
      explanation: text(
        'Hebrews uses the same verb (ἐντυγχάνω) of the risen Christ: “He always lives to intercede for them.” Romans 8 has two intercessors — the Spirit within us (8:26–27) and Christ at God’s right hand (8:34) — and Hebrews grounds Christ’s intercession in his permanent priesthood.',
        synthesis(cite('stepbible-tagnt', 'G1793 ἐντυγχάνω: Rom 8:27, 34; Heb 7:25'), cite('bsb', 'Heb 7:25; Rom 8:26–27, 34')),
      ),
      tags: ['intercession', 'prayer', 'christ', 'assurance', 'priesthood'],
    },
    {
      id: 'romans-8:xr:ezk-36-26',
      from: r8(4),
      target: vv('EZK', 36, 26, 27),
      relationship: 'prophecy-fulfillment',
      title: 'The promised Spirit fulfils the law',
      explanation: text(
        'Ezekiel promised a new heart and “My Spirit within you”, causing God’s people “to walk in My statutes” (compare Jer 31:33, the law written on the heart). Paul does not cite Ezekiel here, but many interpreters hear that promise behind 8:4: the law’s “righteous standard” is fulfilled “in us, who do not walk according to the flesh but according to the Spirit”. What the law could not do from outside (8:3), the promised Spirit does from within.',
        synthesis(cite('bsb', 'Ezek 36:26–27; Jer 31:33; Rom 8:3–4')),
      ),
      tags: ['spirit', 'law', 'new covenant', 'prophecy', 'walk'],
    },
    {
      id: 'romans-8:xr:rev-21-1',
      from: r8(19, 21),
      target: vv('REV', 21, 1, 5),
      relationship: 'thematic',
      title: '“Behold, I make all things new”',
      explanation: text(
        'Romans 8 sees creation waiting to be “set free from its bondage to decay”; Revelation’s closing vision describes the same hope: “a new heaven and a new earth”, no more death or pain, and the One on the throne saying, “Behold, I make all things new.” The Tyndale note on 8:19–21 cites Rev 21:1–2 for creation sharing in the blessings God has promised his people. Both passages look for the renewal of the world, not escape from it.',
        synthesis(cite('tyndale-open-study-notes', 'note on Rom 8:19–21', TYN_ROM_8), cite('bsb', 'Rev 21:1–5; Rom 8:19–21')),
      ),
      tags: ['creation', 'new creation', 'hope', 'glory', 'eschatology'],
    },
    {
      id: 'romans-8:xr:2co-4-16',
      from: r8(18),
      target: vv('2CO', 4, 16, 18),
      relationship: 'thematic',
      title: 'Momentary affliction, eternal glory',
      explanation: text(
        'Paul makes the same calculation elsewhere: “our light and momentary affliction is producing for us an eternal weight of glory that is far beyond comparison.” Romans 8:18 says present sufferings are “not comparable” to the coming glory; 2 Corinthians adds that affliction is actually at work toward that glory — close to the promise of 8:28.',
        synthesis(cite('bsb', '2 Cor 4:16–18; Rom 8:18, 28')),
      ),
      tags: ['suffering', 'glory', 'hope'],
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Historical & cultural context                                     */
  /* ---------------------------------------------------------------- */

  context: [
    {
      id: 'romans-8:ctx:authorship',
      category: 'authorship',
      title: 'Paul, writing from Corinth, around AD 57',
      summary:
        'Paul most likely wrote Romans during a three-month stay in Corinth near the end of his third missionary journey (Acts 20:2–3), around AD 57. He was about to take the collection for the Jerusalem church (Rom 15:25–26) and hoped to visit Rome on the way to Spain (15:24).',
      detail:
        'The commendation of Phoebe from Cenchrea, the port next to Corinth (16:1), points to the place of writing. Paul had never been to Rome (1:13), so the letter introduces him and his gospel to a church he had not founded.',
      relatedVerses: [],
      tags: ['paul', 'date', 'corinth', 'author'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'Romans introduction, “Date, Place, and Occasion of Writing”', TYN_BOOKS),
        cite('bsb', 'Acts 20:2–3; Rom 1:13; 15:24–26; 16:1'),
      ),
    },
    {
      id: 'romans-8:ctx:occasion',
      category: 'occasion',
      title: 'Why Paul wrote Romans',
      summary:
        'The Tyndale introduction identifies three purposes: to set out Paul’s gospel as he had hammered it out over some twenty-five years, to gain the Roman church’s support for a mission to Spain, and to heal a rift between Jewish and Gentile believers over the law (14:1–15:13).',
      detail:
        'Romans 8 serves all three: it is the climax of Paul’s account of the gospel (chs. 5–8), it gives suffering missionaries and churches assurance, and its language of one family of God’s children — Jews and Gentiles alike crying “Abba! Father!” — undergirds the unity he will urge in chapters 14–15.',
      tags: ['purpose', 'occasion', 'unity', 'jews and gentiles'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'Romans introduction, “Paul’s Purpose in Writing”', TYN_BOOKS),
        cite('bsb', 'Rom 15:20–24; 14:1–15:13'),
      ),
    },
    {
      id: 'romans-8:ctx:audience',
      category: 'audience',
      title: 'A church of Jewish and Gentile believers in Rome',
      summary:
        'The Roman believers met in several house churches, perhaps first formed by Jews from Rome converted at Pentecost (Acts 2:10). After the emperor Claudius expelled Jews from Rome (usually dated AD 49; Acts 18:2), Gentile Christians probably took the lead; on a widely held reconstruction (followed by the Tyndale introduction), tensions over the law arose when Jewish believers returned.',
      detail:
        'The Roman biographer Suetonius records that Claudius “expelled them from Rome” because “the Jews constantly made disturbances at the instigation of Chrestus” (Claudius 25.4). Many historians take “Chrestus” as a garbled reference to Christ, though this is debated. For Romans 8 the mixed audience matters: “Abba, Father” joins an Aramaic and a Greek word, and Paul’s language of sonship and inheritance draws on Israel’s story for a church learning to be one family.',
      relatedVerses: [v(15)],
      tags: ['audience', 'rome', 'claudius', 'jews and gentiles', 'house churches'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'Romans introduction, “Setting”', TYN_BOOKS),
        cite('suetonius-lives-of-the-caesars', 'Claudius 25.4', SUETONIUS_CLAUDIUS),
        cite('bsb', 'Acts 2:10; 18:2'),
      ),
    },
    {
      id: 'romans-8:ctx:adoption',
      category: 'greco-roman',
      title: 'Adoption in the Roman world',
      summary:
        'Under Greco-Roman custom a man could adopt a son and confer on him all the legal rights and privileges of a natural child, including inheritance. The practice reached the imperial family: Julius Caesar adopted Octavian, who ruled as Augustus.',
      detail:
        'Paul’s readers in the capital would have known this. Yet Paul’s idea is also rooted in the Old Testament, where Israel is God’s son (Exod 4:22; Hos 11:1) and “the adoption” belongs to Israel (Rom 9:4). In Romans 8 adoption is both a present status (8:15) and a future completion — “our adoption as sons, the redemption of our bodies” (8:23).',
      relatedVerses: [v(15), v(23)],
      tags: ['adoption', 'inheritance', 'heirs', 'roman law', 'sons'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'notes on Rom 8:15, 8:23', TYN_ROM_8),
        cite('bsb', 'Exod 4:22; Hos 11:1; Rom 9:4'),
      ),
    },
    {
      id: 'romans-8:ctx:abba',
      category: 'jewish-tradition',
      title: 'Abba: the Aramaic word Jesus prayed',
      summary:
        'Abba is Aramaic for “father”, the everyday language of Jesus’ Galilee. Mark’s Gospel preserves it on Jesus’ lips in Gethsemane (Mark 14:36), and Paul twice quotes it as the cry of believers, each time with the Greek word for “Father” beside it (Rom 8:15; Gal 4:6).',
      detail:
        'That the Aramaic word survived untranslated in Greek-speaking churches suggests how highly early Christians prized praying as Jesus prayed. It was an everyday family word, used by children young and grown; James Barr (1988) argued that the evidence does not support the popular claim that it means “Daddy”. John Wesley suggested that by using both the Aramaic (“Syriac”) and Greek words “St. Paul seems to point out the joint cry both of the Jewish and gentile believers.”',
      relatedVerses: [v(15)],
      tags: ['abba', 'father', 'aramaic', 'prayer', 'adoption'],
      provenance: historical(
        'editorial',
        cite('stepbible-tbesg', 'G5 ἀββά (Aramaic אַבָּא)'),
        cite('barr-abba-isnt-daddy', 'JTS 39 (1988): 28–47', BARR_ABBA),
        cite('barr-abba-isnt-daddy', 'pp. 38, 46, as quoted in G. Stanton, “FactChecker: Does ‘Abba’ Mean ‘Daddy’?” (The Gospel Coalition, 2013)', TGC_ABBA),
        cite('wesley-explanatory-notes', 'on Rom 8:15', WESLEY_ROM_8),
        cite('bsb', 'Mark 14:36; Rom 8:15; Gal 4:6'),
      ),
    },
    {
      id: 'romans-8:ctx:exodus',
      category: 'jewish-tradition',
      title: 'From slavery to sonship: the exodus story',
      summary:
        'Paul contrasts “a spirit of slavery that returns you to fear” with “the Spirit of adoption” (8:15). Israel’s founding story makes exactly this move: God called Israel “My firstborn son” and brought it out of slavery in Egypt (Exod 4:22–23).',
      detail:
        'N. T. Wright argues that Romans 5–8 retells the exodus: sin holds humanity in bondage as Pharaoh held Israel, the Messiah’s death and resurrection bring liberation, the Spirit is given where Israel received the law at Sinai, and a journey leads toward the inheritance — now the whole renewed creation (8:17–25). Not every reader finds the pattern so pervasive, but the “slavery… sons… heirs” language of 8:14–17 clearly draws on Israel’s story (Tyndale note on 8:14).',
      relatedVerses: [v(14), v(15), v(17)],
      tags: ['exodus', 'slavery', 'sons', 'israel', 'inheritance', 'adoption'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'note on Rom 8:14', TYN_ROM_8),
        cite('wright-new-inheritance', 'Bible Review 14.3 (1998)', WRIGHT_NEW_INHERITANCE),
        cite('bsb', 'Exod 4:22–23; Rom 8:14–17'),
      ),
    },
    {
      id: 'romans-8:ctx:firstfruits',
      category: 'jewish-tradition',
      title: 'The firstfruits offering',
      summary:
        'At the start of harvest Israel brought the first sheaf of grain to the priest, who waved it before the LORD; only then could the new harvest be eaten (Lev 23:9–14; compare Exod 23:19).',
      detail:
        'The first portion was consecrated to God and served as a pledge of the full harvest. Paul applies the picture to the Spirit already given to believers (Rom 8:23) and, elsewhere, to Christ’s resurrection as the first of many (1 Cor 15:20).',
      relatedVerses: [v(23)],
      tags: ['firstfruits', 'harvest', 'festival', 'temple', 'spirit'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'note on Rom 8:23', TYN_ROM_8),
        cite('bsb', 'Exod 23:19; Lev 23:9–14; 1 Cor 15:20'),
      ),
    },
    {
      id: 'romans-8:ctx:suffering',
      category: 'social',
      title: 'Real hardships behind the list of 8:35',
      summary:
        '“Trouble or distress or persecution or famine or nakedness or danger or sword” is not a rhetorical flourish. Paul lists the same kinds of hardship from his own ministry — “hunger and thirst… cold and exposure” (2 Cor 11:27) — and he writes to a church some of whose members had already lived through expulsion from the city.',
      detail:
        'By quoting Psalm 44:22 in 8:36 Paul places such suffering in the long line of God’s faithful people who suffered “for Your sake”. The chapter’s assurance is offered to people for whom these threats were real possibilities, not to the comfortable.',
      relatedVerses: [v(35), v(36)],
      tags: ['suffering', 'persecution', 'hardship', 'sword'],
      provenance: historical(
        'editorial',
        cite('bsb', 'Rom 8:35–36; 2 Cor 11:23–27; Ps 44:22'),
        cite('tyndale-open-study-notes', 'Romans introduction, “Setting”', TYN_BOOKS),
      ),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Literary context                                                  */
  /* ---------------------------------------------------------------- */

  literary: {
    placeInBook: text(
      'Romans 8 closes the letter’s second great movement (chs. 5–8), in which Paul assures believers that the salvation God has begun will be completed. Chapter 5 announced peace with God and the reversal of Adam’s sin; chapters 6 and 7 showed that neither sin nor the law can defeat God’s purpose. Chapter 8 gathers it all up: the Spirit liberates from death (8:1–17) and assures believers that suffering will not keep them from glory (8:18–39). Chapters 9–11 then take up the question this raises — if God’s purposes cannot fail, what about Israel?',
      synthesis(cite('tyndale-open-study-notes', 'Romans introduction, “Summary”', TYN_BOOKS), cite('bsb', 'Rom 5:1–11; 8:1–39; 9:1–5')),
    ),
    argument: text(
      'Paul moves in three steps. (1) 8:1–17: because God condemned sin in Christ’s flesh, the Spirit gives the life the law could not, and those led by the Spirit are God’s children and heirs. (2) 8:18–30: heirs share Christ’s sufferings now; creation and believers groan and the Spirit intercedes “with groans too deep for words”, but hope rests on God’s purpose, which runs from foreknowledge to glory. (3) 8:31–39: a courtroom of questions — who is against us, who will accuse, who will condemn, who will separate? — ending in the certainty that nothing can separate us from God’s love in Christ.',
      literary(cite('bsb', 'Rom 8:1–39')),
    ),
    placeInCanon: text(
      'Romans 8 gathers threads from the whole Bible: the creation subjected to futility after Genesis 3 and awaiting renewal; Israel as God’s firstborn son brought out of slavery (Exod 4:22); the firstfruits of the harvest (Lev 23); the promise of God’s own Spirit within his people (Ezek 36:26–27); and the Servant’s confidence that God will vindicate him (Isa 50:8–9). It looks ahead to Revelation’s new heaven and new earth (Rev 21:1–5).',
      synthesis(cite('bsb', 'Gen 3:17–19; Exod 4:22; Lev 23:9–14; Ezek 36:26–27; Isa 50:8–9; Rev 21:1–5')),
    ),
    bookOutline: [
      { label: 'Greeting and theme: the good news of God’s righteousness', ref: span('ROM', 1, 1, 1, 17) },
      { label: 'All have sinned: Gentiles and Jews under sin', ref: span('ROM', 1, 18, 3, 20) },
      { label: 'Righteousness through faith in Christ; Abraham', ref: span('ROM', 3, 21, 4, 25) },
      { label: 'Assurance of salvation: Adam and Christ, sin, law and the Spirit', ref: span('ROM', 5, 1, 8, 39), current: true },
      { label: 'God’s faithfulness to Israel', ref: span('ROM', 9, 1, 11, 36) },
      { label: 'The transformed life and the unity of the church', ref: span('ROM', 12, 1, 15, 13) },
      { label: 'Paul’s mission plans, greetings and doxology', ref: span('ROM', 15, 14, 16, 27) },
    ],
    passageOutline: [
      { label: 'No condemnation: the Spirit does what the law could not', ref: r8(1, 4) },
      { label: 'Flesh and Spirit: two ways of life', ref: r8(5, 13) },
      { label: 'Children and heirs: the Spirit of adoption', ref: r8(14, 17) },
      { label: 'Groaning and hope: creation, believers and the Spirit', ref: r8(18, 27) },
      { label: 'God’s purpose: all things for good', ref: r8(28, 30) },
      { label: 'No separation: the courtroom of God’s love', ref: r8(31, 39) },
    ],
    features: [
      {
        id: 'romans-8:lit:inclusio',
        type: 'inclusio',
        title: 'No condemnation… no separation — “in Christ Jesus”',
        description:
          'The chapter opens and closes with the same phrase: “no condemnation for those who are in Christ Jesus” (8:1) and nothing “will be able to separate us from the love of God that is in Christ Jesus our Lord” (8:39). In Greek 8:1 closes with ἐν Χριστῷ Ἰησοῦ, and 8:39 with ἐν Χριστῷ Ἰησοῦ τῷ κυρίῳ ἡμῶν. The frame shows the chapter’s logic: union with Christ is both the ground of the verdict and the guarantee of the love.',
        verses: [v(1), v(39)],
        structure: [
          { label: '8:1', text: 'No condemnation — for those in Christ Jesus', ref: r8(1), level: 0 },
          { label: '8:2–38', text: 'The Spirit’s life, adoption, groaning and hope, God’s purpose, the courtroom', ref: r8(2, 38), level: 1 },
          { label: '8:39', text: 'No separation — from the love of God in Christ Jesus our Lord', ref: r8(39), level: 0 },
        ],
        tags: ['condemnation', 'separation', 'love', 'in christ', 'structure'],
        provenance: literary(cite('bsb', 'Rom 8:1, 39'), cite('stepbible-tagnt', 'Rom 8:1; 8:39')),
      },
      {
        id: 'romans-8:lit:spirit-repetition',
        type: 'repetition',
        title: 'The Spirit, twenty-one times',
        description:
          'The word πνεῦμα occurs 21 times in this chapter — more than in any other New Testament chapter — after only five uses in Romans 1–7. “Flesh” (σάρξ) is concentrated in the first half (13 times in 8:3–13) and then disappears, as the chapter turns from the flesh/Spirit contrast to the Spirit’s work in suffering and hope.',
        verses: [v(2), v(4), v(9), v(11), v(13), v(14), v(15), v(16), v(23), v(26), v(27)],
        tags: ['spirit', 'flesh', 'repetition', 'pneuma', 'sarx'],
        provenance: literary(cite('stepbible-tagnt', 'G4151 and G4561 counted by chapter (NA28 text)')),
      },
      {
        id: 'romans-8:lit:three-groans',
        type: 'repetition',
        title: 'Three groans',
        description:
          'Creation “has been groaning together” (8:22, συστενάζει), “we ourselves… groan inwardly” (8:23, στενάζομεν), and the Spirit intercedes “with groans too deep for words” (8:26, στεναγμοῖς). The repeated root ties the world’s frustration, the believer’s longing and the Spirit’s prayer into one movement toward redemption.',
        verses: [v(22), v(23), v(26)],
        structure: [
          { label: '8:22', text: 'Creation groans, as in childbirth', ref: r8(22), level: 0 },
          { label: '8:23', text: 'We groan, awaiting adoption and the body’s redemption', ref: r8(23), level: 1 },
          { label: '8:26', text: 'The Spirit intercedes with wordless groans', ref: r8(26), level: 2 },
        ],
        tags: ['groaning', 'creation', 'prayer', 'hope', 'spirit'],
        provenance: literary(cite('stepbible-tagnt', 'Rom 8:22 (G4959), 8:23 (G4727), 8:26 (G4726)'), cite('bsb', 'Rom 8:22–26')),
      },
      {
        id: 'romans-8:lit:golden-chain',
        type: 'argument-structure',
        title: 'The “golden chain” of 8:29–30',
        description:
          'Five verbs form a chain in which each link repeats the one before it: foreknew → predestined → called → justified → glorified. The exposition of Romans in Matthew Henry’s Commentary — written after Henry’s death (1714) by the Nonconformist minister John Evans, one of those who finished the work — calls it “a golden chain, which cannot be broken”. Strikingly, “glorified” is in the past tense although glory is still future elsewhere in the chapter (8:18, 21); the Tyndale note explains it as God’s settled decision, as certain as if already done.',
        verses: [v(29), v(30)],
        structure: [
          { label: 'foreknew', text: 'Those God foreknew…', ref: r8(29), level: 0 },
          { label: 'predestined', text: '…He also predestined to be conformed to the image of His Son', ref: r8(29), level: 1 },
          { label: 'called', text: 'Those He predestined, He also called', ref: r8(30), level: 2 },
          { label: 'justified', text: 'Those He called, He also justified', ref: r8(30), level: 3 },
          { label: 'glorified', text: 'Those He justified, He also glorified', ref: r8(30), level: 4 },
        ],
        tags: ['predestination', 'foreknowledge', 'golden chain', 'glory', 'calling', 'justification'],
        provenance: literary(
          { ...cite('matthew-henry-commentary', 'on Rom 8:29–30', HENRY_ROM_8), note: 'Romans section completed after Henry’s death (1714) by John Evans' },
          cite('dnb-1889-evans-john', 'Evans, John (1680?–1730): notes on Romans for the commentary “left unfinished by Henry”', DNB_EVANS),
          cite('tyndale-open-study-notes', 'note on Rom 8:30', TYN_ROM_8),
          cite('bsb', 'Rom 8:29–30'),
        ),
      },
      {
        id: 'romans-8:lit:courtroom',
        type: 'argument-structure',
        title: 'A courtroom in questions (8:31–39)',
        description:
          'Paul ends with a cascade of rhetorical questions — “If God is for us, who can be against us?” “Who will bring any charge…?” “Who is there to condemn us?” “Who shall separate us…?” — each answered by what God has done in Christ, the same ground on which the verdict of 8:1 rests. The lists of 8:35 and 8:38–39 give the close a rhythmic, almost hymn-like quality, though it remains argument.',
        verses: [v(31), v(33), v(34), v(35), v(38), v(39)],
        tags: ['courtroom', 'rhetorical questions', 'assurance', 'love', 'condemnation'],
        provenance: literary(cite('bsb', 'Rom 8:31–39'), cite('tyndale-open-study-notes', 'note on Rom 8:31', TYN_ROM_8)),
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Theology                                                          */
  /* ---------------------------------------------------------------- */

  theology: [
    {
      id: 'romans-8:th:no-condemnation',
      category: 'soteriology',
      title: 'No condemnation: the verdict and the new life',
      summary:
        'Because God condemned sin in the flesh of his Son, sent “as an offering for sin” (8:3), those in Christ Jesus stand under no sentence of condemnation (8:1), and at the last no charge can stand against God’s elect (8:33–34).',
      detail:
        'Christians of every tradition confess that believers are freed from condemnation through Christ’s death and resurrection. Protestants stress the courtroom verdict — Calvin on 8:34: no condemnation remains “when satisfaction is given to the laws, and the penalty is already paid” — yet Calvin also insisted that “the grace of regeneration is never disjoined from the imputation of righteousness” (on 8:2). John Chrysostom read 8:1 as freedom not only from past sins but for a new, Spirit-empowered life. The traditions still differ on how verdict and renewal relate. Protestant confessions distinguish justification — God pardoning sinners and accepting them as righteous for Christ’s sake, “not by infusing righteousness into them” (Westminster Confession 11.1) — from the sanctification that always accompanies it (ch. 13), while the Council of Trent defined justification itself as “not remission of sins merely, but also the sanctification and renewal of the inward man”. Romans 8 holds verdict and new life together; how the two are related remains a denominational difference.',
      keyVerses: [r8(1, 4), r8(33, 34)],
      tags: ['condemnation', 'justification', 'atonement', 'sin offering', 'verdict', 'sanctification'],
      provenance: synthesis(
        cite('calvin-commentaries', 'on Rom 8:34', CALVIN_ROM_8_34),
        cite('calvin-commentaries', 'on Rom 8:2', CALVIN_ROM_8_1),
        cite('westminster-confession-schaff', 'ch. 11.1 (Of Justification); ch. 13.1 (Of Sanctification)', WCF_CH_3),
        cite('council-of-trent-session-6-schaff', 'Session 6, ch. 7', TRENT_6),
        cite('chrysostom-homilies-romans', 'Homily 13, on Rom 8:1', CHRYS_HOM_13),
        cite('bsb', 'Rom 8:1–4, 33–34'),
      ),
    },
    {
      id: 'romans-8:th:spirit',
      category: 'pneumatology',
      title: 'The indwelling Spirit',
      summary:
        'The Spirit is “the Spirit of God” and “the Spirit of Christ” (8:9). He dwells in every believer, gives life now and resurrection later (8:10–11), leads God’s children (8:14), testifies with their spirit (8:16) and intercedes in their weakness (8:26–27).',
      detail:
        'Romans 8 is one of the richest Trinitarian chapters in the New Testament: the Father sends the Son (8:3), raises him (8:11) and hears the Spirit’s intercession (8:27); the Son dies, rises and intercedes (8:34); the Spirit indwells, leads and prays. The Spirit does not remove human responsibility or make sin impossible, but he is the decisive power of the Christian life (Tyndale note on 8:9).',
      keyVerses: [r8(9, 11), r8(14, 16), r8(26, 27)],
      tags: ['spirit', 'holy spirit', 'trinity', 'indwelling', 'resurrection'],
      provenance: synthesis(cite('tyndale-open-study-notes', 'notes on Rom 8:9–11', TYN_ROM_8), cite('bsb', 'Rom 8:3, 9–11, 14–16, 26–27, 34')),
    },
    {
      id: 'romans-8:th:adoption',
      category: 'adoption',
      title: 'Adoption: children and heirs',
      summary:
        'Believers have received “the Spirit of adoption”, by whom they call God “Abba! Father!”; as children they are “heirs of God and co-heirs with Christ” (8:15–17), though the full adoption — the redemption of the body — is still awaited (8:23).',
      detail:
        'J. I. Packer ranked adoption at the top of the gospel’s blessings, above even justification: justification settles our standing before God as Judge, while adoption brings us into his family as his children, and Packer urged Christians to understand their whole life in that light. The family is also a suffering one: co-heirs “suffer with Him, so that we may also be glorified with Him” (8:17).',
      keyVerses: [r8(14, 17), r8(23), r8(29)],
      tags: ['adoption', 'abba', 'heirs', 'sonship', 'children of god'],
      provenance: synthesis(
        cite('packer-knowing-god', 'ch. 19, “Sons of God”', PACKER_KNOWING_GOD),
        cite('packer-knowing-god', 'ch. 19, as quoted in T. Challies, “The Essential: Adoption” (2012)', CHALLIES_ADOPTION),
        cite('tyndale-open-study-notes', 'notes on Rom 8:15, 8:17, 8:23', TYN_ROM_8),
        cite('bsb', 'Rom 8:14–17, 23'),
      ),
    },
    {
      id: 'romans-8:th:mortification',
      category: 'sanctification',
      title: 'Putting sin to death by the Spirit',
      summary:
        '“If by the Spirit you put to death the deeds of the body, you will live” (8:13). Freedom from condemnation does not end the fight with sin; it makes the fight possible and hopeful, because it is waged by the Spirit.',
      detail:
        'John Owen’s Of the Mortification of Sin in Believers (1656) is built on this verse. His thesis: “The choicest believers, who are assuredly freed from the condemning power of sin, ought yet to make it their business all their days to mortify the indwelling power of sin.” Owen also warned that mortification by one’s own strength, for one’s own righteousness, is the essence of false religion — it is “the work of the Spirit”.',
      keyVerses: [r8(12, 13), r8(4, 9)],
      tags: ['mortification', 'sanctification', 'holiness', 'flesh', 'put to death', 'sin'],
      provenance: synthesis(
        cite('owen-mortification-of-sin', 'ch. I', OWEN_CH_1),
        cite('bsb', 'Rom 8:4–9, 12–13'),
      ),
    },
    {
      id: 'romans-8:th:new-creation',
      category: 'eschatology',
      title: 'Groaning and glory: the redemption of creation and bodies',
      summary:
        'The whole creation, “subjected to futility… in hope”, waits eagerly to be “set free from its bondage to decay” when God’s children are revealed in glory; believers too wait for “the redemption of our bodies” (8:19–23).',
      detail:
        'Christian hope in Romans 8 is not escape from the material world but its liberation, together with the resurrection of the body. The Spirit is the firstfruits of that harvest (8:23). N. T. Wright draws a practical consequence: if God’s people are to inherit the liberated creation, they should care for the created order now.',
      keyVerses: [r8(18, 25)],
      tags: ['creation', 'new creation', 'resurrection', 'hope', 'glory', 'futility'],
      provenance: synthesis(
        cite('tyndale-open-study-notes', 'notes on Rom 8:19–23', TYN_ROM_8),
        cite('wright-new-inheritance', 'Bible Review 14.3 (1998), conclusion', WRIGHT_NEW_INHERITANCE),
        cite('bsb', 'Rom 8:18–25'),
      ),
    },
    {
      id: 'romans-8:th:providence',
      category: 'providence',
      title: 'God’s purpose and the believer’s security',
      summary:
        'For those who love God and are called according to his purpose, God works all things together for good — the good of being conformed to his Son (8:28–29). Nothing in all creation can separate them from his love in Christ (8:38–39).',
      detail:
        'All Christian traditions read 8:28–39 as assurance for suffering believers. They differ on how God’s foreknowledge and predestination relate to human faith and perseverance (see the perspectives on 8:29–30), but agree that the ground of confidence is God’s love shown in not sparing his own Son (8:32).',
      keyVerses: [r8(28, 30), r8(31, 39)],
      tags: ['providence', 'predestination', 'assurance', 'love', 'all things for good', 'security'],
      provenance: synthesis(cite('bsb', 'Rom 8:28–39'), cite('chrysostom-homilies-romans', 'Homily 15', CHRYS_HOM_15)),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Perspectives                                                      */
  /* ---------------------------------------------------------------- */

  perspectives: [
    {
      id: 'romans-8:ps:foreknowledge',
      question: 'What does it mean that God “foreknew” and “predestined” (8:29–30)?',
      consensus: 'denominational',
      intro:
        'All Christian traditions affirm that salvation begins in God’s gracious purpose and that Paul wrote 8:29–30 to give assurance. They differ on how God’s foreknowledge relates to human faith, and on whether every link in the chain always holds for the same people.',
      perspectives: [
        {
          id: 'romans-8:ps:foreknowledge:reformed',
          tradition: 'Reformed',
          label: 'Foreknowledge as electing love; an unbreakable chain',
          summary:
            'God’s foreknowing is his prior, personal choice to set his love on particular people — the object of “foreknew” is persons (“those”), not their foreseen choices — and each link follows infallibly: all the predestined are called, all the called justified, all the justified glorified. The Westminster Confession (3.5, citing Rom 8:30) says God chose “without any foresight of faith or good works”; the Canons of Dort (I.9) that election “was not founded upon foreseen faith”. R. C. Sproul and John Piper defend this reading in sermons on this passage.',
          representatives: ['calvin', 'rc-sproul', 'john-piper'],
          keyTexts: [r8(29, 30), vv('ROM', 9, 11, 16), vv('EPH', 1, 4, 5)],
          provenance: synthesis(
            cite('westminster-confession-schaff', 'ch. 3.5', WCF_CH_3),
            cite('canons-of-dort', 'First Head, Art. 9–10', DORT),
            cite('sproul-golden-chain', 'sermon on Rom 8:29–30 (2006)', SPROUL_GOLDEN_CHAIN),
            cite('piper-foreknown-predestined', 'sermon on Rom 8:28–30 (2002)', PIPER_FOREKNOWN),
          ),
        },
        {
          id: 'romans-8:ps:foreknowledge:wesleyan',
          tradition: 'Arminian / Wesleyan',
          label: 'Election of those God foresaw would believe; the chain as God’s method',
          summary:
            'God, in Christ, purposed to save those who through grace would believe and persevere (Articles of Remonstrance, 1610, Art. I). Grace comes first — the Articles teach that fallen people cannot of themselves think, will or do anything truly good, saving faith included, but must be born again of God in Christ by the Holy Spirit (Art. III); that even the regenerate can do no good without “prevenient or assisting, awakening, following and cooperative grace”; and that this grace “is not irresistible” (Art. IV). John Wesley read 8:29–30 as describing “the method whereby God leads us step by step toward heaven”: Paul, he argued, does not affirm “that precisely the same number of men are called, justified, and glorified”.',
          representatives: ['wesley'],
          keyTexts: [r8(29, 30), vv('ROM', 11, 22), vv('1TI', 2, 4)],
          provenance: synthesis(
            cite('articles-of-remonstrance', 'Art. I, III, IV', REMONSTRANCE),
            cite('wesley-explanatory-notes', 'on Rom 8:28–30', WESLEY_ROM_8),
          ),
        },
        {
          id: 'romans-8:ps:foreknowledge:lutheran',
          tradition: 'Lutheran',
          label: 'Election is the cause of salvation, never of damnation — sought in Christ',
          summary:
            'The Formula of Concord (Art. XI) distinguishes God’s foreknowledge, which extends to all, from election, which “extends only to the good and beloved children of God, and this is the cause of their salvation”. Yet it rejects any predestination to damnation: Christ “earnestly wishes that all men may come to him”, and those who perish do so through their own contempt of the Word. Election is not to be searched out in God’s hidden counsel but in Christ and the gospel — and, following Paul’s order in Romans, taught after repentance and faith, for comfort. Luther’s Preface to Romans had already urged that order: fix attention first on Christ and the gospel, struggle against sin as chapters 1–8 teach, and only then, under the cross and suffering of chapter 8, learn from chapters 9–11 the comfort of God’s providence. (The Formula itself dates from 1577, three decades after Luther’s death.)',
          representatives: [],
          keyTexts: [r8(28, 30), vv('ROM', 11, 32), vv('EPH', 1, 4)],
          provenance: synthesis(
            cite('formula-of-concord-schaff', 'Epitome, Art. XI', CONCORD),
            cite('luther-preface-romans', 'on chapters 9–11', LUTHER_PREFACE),
          ),
        },
        {
          id: 'romans-8:ps:foreknowledge:catholic',
          tradition: 'Catholic',
          label: 'Gracious predestination with free cooperation',
          summary:
            'The Council of Trent teaches that justification begins with God’s prevenient grace, calling people “without any merits existing on their parts”, who are then disposed “by freely assenting to and co-operating with” that grace — and are able to reject it (Session 6, ch. 5). It warns against presuming, apart from special revelation, that one is certainly among the predestined (ch. 12), and rejects the idea that those called but not saved were “predestined unto evil” (canon 17). Within these bounds Catholic theologians differ: Thomists hold predestination to glory prior to foreseen merits, many Molinists in view of them.',
          representatives: ['aquinas'],
          keyTexts: [r8(28, 30), vv('PHP', 2, 12, 13)],
          provenance: synthesis(
            cite('council-of-trent-session-6-schaff', 'Session 6, ch. 5, 12; canon 17', TRENT_6),
            cite('catholic-encyclopedia-predestination', '“Predestination” (1911)', CATH_ENC_PREDESTINATION),
          ),
        },
        {
          id: 'romans-8:ps:foreknowledge:orthodox',
          tradition: 'Eastern Orthodox',
          label: 'Foreknowledge without compulsion; sharing the Son’s likeness by grace',
          summary:
            'Eastern tradition reads the passage in terms of God’s foreknowledge and a free human response. John Chrysostom stressed that the call “was not forced upon them, nor compulsory. All then were called, but all did not obey the call”, and John of Damascus taught that “while God knows all things beforehand, yet He does not predetermine all things.” The emphasis falls on the goal of 8:29 — in Chrysostom’s words, “what the Only-begotten was by Nature, this they also have become by grace.”',
          representatives: ['chrysostom', 'john-of-damascus'],
          keyTexts: [r8(28, 30)],
          provenance: synthesis(
            cite('chrysostom-homilies-romans', 'Homily 15, on Rom 8:28–29', CHRYS_HOM_15),
            cite('john-of-damascus-exposition', 'Book II, ch. 30', DAMASCENE_2_30),
          ),
        },
      ],
      commonGround:
        'All agree that salvation originates in God’s gracious initiative, that no one is saved apart from grace and faith in Christ, that the goal of predestination is conformity to the image of the Son, and that Paul wrote 8:28–39 to give suffering believers assurance rather than to invite speculation.',
      tags: ['predestination', 'foreknowledge', 'election', 'golden chain', 'calling', 'free will', 'perseverance'],
      provenance: synthesis(
        cite('westminster-confession-schaff', 'ch. 3', WCF_CH_3),
        cite('articles-of-remonstrance', 'Art. I–V', REMONSTRANCE),
        cite('formula-of-concord-schaff', 'Art. XI', CONCORD),
        cite('council-of-trent-session-6-schaff', 'Session 6', TRENT_6),
        cite('john-of-damascus-exposition', 'II.30', DAMASCENE_2_30),
      ),
    },
    {
      id: 'romans-8:ps:groanings',
      question: 'What are the “groans too deep for words” of 8:26?',
      consensus: 'uncertain',
      intro:
        'Careful interpreters are genuinely unsure who is groaning and whether any audible prayer is meant. The question touches how Christians understand prayer in weakness, not any core doctrine.',
      perspectives: [
        {
          id: 'romans-8:ps:groanings:spirit',
          tradition: 'Common modern reading',
          label: 'The Spirit’s own wordless intercession',
          summary:
            'The groanings belong to the Spirit, not to us: when we do not know how to pray, the Spirit himself intercedes before God in ways that cannot be put into words, and the Father, who searches hearts, understands (8:27). This is the reading of the Tyndale study note.',
          keyTexts: [r8(26, 27)],
          provenance: synthesis(cite('tyndale-open-study-notes', 'note on Rom 8:26', TYN_ROM_8)),
        },
        {
          id: 'romans-8:ps:groanings:prompted',
          tradition: 'Reformed commentary and preaching (Calvin, Spurgeon)',
          label: 'Our groans, stirred up by the Spirit',
          summary:
            'The Spirit does not literally groan; he prompts longings in believers too deep for their own words, and these are ascribed to him. Calvin: the Spirit intercedes “not because he really humbles himself to pray or to groan, but because he stirs up in our hearts those desires which we ought to entertain.” Spurgeon said the same in his sermon on these verses (1880).',
          representatives: ['calvin', 'spurgeon'],
          keyTexts: [r8(26, 27), r8(15)],
          provenance: synthesis(
            cite('calvin-commentaries', 'on Rom 8:26', CALVIN_JSON_ROM_8),
            cite('spurgeon-holy-spirits-intercession', 'MTP no. 1532', SPURGEON_1532),
          ),
        },
        {
          id: 'romans-8:ps:groanings:charism',
          tradition: 'Patristic (John Chrysostom)',
          label: 'A spiritual gift of prayer in the early church',
          summary:
            'Chrysostom explained the verse from the gifts of the apostolic church: alongside prophecy and tongues there was “a gift of prayer”, also called a spirit, given to someone who prayed for the whole church with groanings. “Spirit” here, he argued, means that grace and the spiritual person who receives it — not the Comforter directly.',
          representatives: ['chrysostom'],
          keyTexts: [r8(26, 27), vv('1CO', 14, 32)],
          provenance: synthesis(cite('chrysostom-homilies-romans', 'Homily 14, on Rom 8:26–27', CHRYS_HOM_14)),
        },
        {
          id: 'romans-8:ps:groanings:ecstatic',
          tradition: 'Some interpreters',
          label: 'Inarticulate or ecstatic prayer',
          summary:
            'Some take the phrase to describe prayer that does not take the form of human language — sounds uttered when believers do not know what to pray. The Tyndale note mentions this as a possibility while concluding that the groanings are the Spirit’s. The adjective “unutterable” makes a reference to audible speech less likely for many readers.',
          keyTexts: [r8(26)],
          provenance: synthesis(cite('tyndale-open-study-notes', 'note on Rom 8:26', TYN_ROM_8)),
        },
      ],
      commonGround:
        'All agree that the Spirit helps believers precisely when they do not know how to pray, and that God understands prayer that cannot be put into words and answers it “according to the will of God” (8:27).',
      tags: ['prayer', 'groaning', 'intercession', 'spirit', 'weakness'],
      provenance: synthesis(
        cite('tyndale-open-study-notes', 'note on Rom 8:26', TYN_ROM_8),
        cite('calvin-commentaries', 'on Rom 8:26', CALVIN_JSON_ROM_8),
        cite('chrysostom-homilies-romans', 'Homily 14', CHRYS_HOM_14),
      ),
    },
    {
      id: 'romans-8:ps:romans-7',
      question: 'Who is the struggling “I” of Romans 7:14–25, just before “no condemnation”?',
      consensus: 'historical-debate',
      intro:
        'How one reads 8:1 depends partly on who is speaking in 7:14–25: a Christian still fighting sin, a person under the law without the Spirit, or Israel under the Torah. The debate is old and still open.',
      perspectives: [
        {
          id: 'romans-8:ps:romans-7:believer',
          tradition: 'Lutheran and Reformed',
          label: 'The believer’s ongoing struggle',
          summary:
            'Paul describes his life as a believer: the regenerate still fight indwelling sin, yet — as 8:1 immediately says — they are not condemned. Luther’s Preface to Romans says that in chapter 7 “St. Paul portrays himself as still a sinner, while in chapter 8 he says that… there is nothing damnable in those who are in Christ”; Calvin opens his comment on 8:1 with “the contest which the godly have perpetually with their own flesh”; Spurgeon never knew what it was “to be out of the seventh of Romans, nor out of the eighth of Romans either”.',
          representatives: ['luther', 'calvin', 'spurgeon'],
          keyTexts: [span('ROM', 7, 14, 8, 1)],
          provenance: synthesis(
            cite('luther-preface-romans', 'on chapters 7–8', LUTHER_PREFACE),
            cite('calvin-commentaries', 'on Rom 8:1', CALVIN_ROM_8_1),
            cite('spurgeon-in-christ-no-condemnation', 'MTP no. 1917', SPURGEON_1917),
          ),
        },
        {
          id: 'romans-8:ps:romans-7:under-law',
          tradition: 'Greek Fathers and Wesleyan',
          label: 'Life under the law, before the Spirit',
          summary:
            'John Chrysostom read “I am carnal” as “a sketch now of man, as comporting himself in the Law, and before the Law” — humanity without grace — so that chapter 8 describes a real deliverance from that condition. John Wesley similarly saw in 7:7–25 “a man reasoning, groaning, striving, and escaping from the legal to the evangelical state.”',
          representatives: ['chrysostom', 'wesley'],
          keyTexts: [span('ROM', 7, 14, 8, 4)],
          provenance: synthesis(
            cite('chrysostom-homilies-romans', 'Homily 13, on Rom 7:14', CHRYS_HOM_13),
            cite('wesley-explanatory-notes', 'on Rom 7:14', WESLEY_ROM_7),
          ),
        },
        {
          id: 'romans-8:ps:romans-7:israel',
          tradition: 'Contemporary Pauline scholarship',
          label: 'Israel under the Torah',
          summary:
            'N. T. Wright argues that Paul’s “I” voices Israel’s own story under the Torah: when the law came, Israel repeated Adam’s fall and, though wanting the good, stayed “in Adam” — until God dealt with sin in the Messiah and gave the Spirit to do “what the law could not” (8:1–11).',
          representatives: ['nt-wright'],
          keyTexts: [span('ROM', 7, 7, 8, 11)],
          provenance: summaryOf(cite('wright-new-inheritance', 'Bible Review 14.3 (1998)', WRIGHT_NEW_INHERITANCE)),
        },
      ],
      commonGround:
        'All agree that 8:1 answers the cry of 7:24, that believers must still put sin to death (8:13), and that the decisive difference is union with Christ and the gift of the Spirit.',
      tags: ['romans 7', 'flesh', 'law', 'struggle', 'condemnation', 'sanctification'],
      provenance: synthesis(
        cite('tyndale-open-study-notes', 'note on Rom 7:18', 'https://bible.helloao.org/api/c/tyndale/ROM/7.json'),
        cite('bsb', 'Rom 7:14–8:4'),
      ),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Commentary & Christian thinkers                                   */
  /* ---------------------------------------------------------------- */

  commentary: [
    {
      id: 'romans-8:cm:chrysostom-8-28',
      authorId: 'chrysostom',
      sourceId: 'chrysostom-homilies-romans',
      kind: 'quotation',
      lead: 'On “all things work together for good” (8:28)',
      text: 'Now when he speaks of all things, he mentions even the things that seem painful. … And so he does not say, that them that love God, no grievance approaches, but, that it works together for good, that is to say, that He uses the grievous things themselves to make the persons so plotted against approved.',
      locator: 'Homily 15, on Rom 8:28',
      url: CHRYS_HOM_15,
      relatedVerses: [v(28)],
      tags: ['all things for good', 'providence', 'suffering', 'good'],
      provenance: verifiedQuote(cite('chrysostom-homilies-romans', 'Homily 15, on Rom 8:28', CHRYS_HOM_15)),
    },
    {
      id: 'romans-8:cm:chrysostom-8-29',
      authorId: 'chrysostom',
      sourceId: 'chrysostom-homilies-romans',
      kind: 'quotation',
      lead: 'On being “conformed to the image of His Son” (8:29)',
      text: 'For what the Only-begotten was by Nature, this they also have become by grace.',
      locator: 'Homily 15, on Rom 8:29',
      url: CHRYS_HOM_15,
      relatedVerses: [v(29)],
      tags: ['adoption', 'predestination', 'image', 'grace', 'sonship'],
      provenance: verifiedQuote(cite('chrysostom-homilies-romans', 'Homily 15, on Rom 8:29', CHRYS_HOM_15)),
    },
    {
      id: 'romans-8:cm:luther-8-1',
      authorId: 'luther',
      sourceId: 'luther-preface-romans',
      kind: 'quotation',
      lead: 'On how chapter 8 answers the struggle of chapter 7',
      text: 'In chapter 8, St. Paul comforts fighters such as these and tells them that this flesh will not bring them condemnation.',
      locator: 'Preface to Romans, on chapter 8',
      url: LUTHER_PREFACE,
      relatedVerses: [v(1)],
      tags: ['condemnation', 'flesh', 'struggle', 'romans 7', 'comfort'],
      provenance: verifiedQuote(cite('luther-preface-romans', 'on chapter 8', LUTHER_PREFACE)),
    },
    {
      id: 'romans-8:cm:calvin-8-34',
      authorId: 'calvin',
      sourceId: 'calvin-commentaries',
      kind: 'quotation',
      lead: 'On “Who is there to condemn us?” (8:34)',
      text: 'As no one by accusing can prevail, when the judge absolves; so there remains no condemnation, when satisfaction is given to the laws, and the penalty is already paid.',
      locator: 'Commentary on Romans, on 8:34',
      url: CALVIN_ROM_8_34,
      relatedVerses: [v(34), v(1)],
      tags: ['condemnation', 'justification', 'atonement', 'courtroom'],
      provenance: verifiedQuote(cite('calvin-commentaries', 'Commentary on Romans, on 8:34', CALVIN_ROM_8_34)),
    },
    {
      id: 'romans-8:cm:owen-8-13',
      authorId: 'john-owen',
      sourceId: 'owen-mortification-of-sin',
      kind: 'quotation',
      lead: 'On “put to death the deeds of the body” (8:13)',
      text: 'Do you mortify; do you make it your daily work; be always at it whilst you live; cease not a day from this work; be killing sin or it will be killing you.',
      locator: 'ch. II',
      url: OWEN_CH_2,
      relatedVerses: [v(13)],
      tags: ['mortification', 'sanctification', 'flesh', 'sin', 'put to death'],
      provenance: verifiedQuote(cite('owen-mortification-of-sin', 'ch. II', OWEN_CH_2)),
    },
    {
      id: 'romans-8:cm:wesley-8-16',
      authorId: 'wesley',
      sourceId: 'wesley-explanatory-notes',
      kind: 'quotation',
      lead: 'On “the Spirit Himself testifies with our spirit” (8:16)',
      text: 'With the spirit of every true believer, by a testimony distinct from that of his own spirit, or the testimony of a good conscience.',
      locator: 'Note on Rom 8:16',
      url: WESLEY_ROM_8,
      relatedVerses: [v(16)],
      tags: ['assurance', 'witness of the spirit', 'spirit', 'adoption'],
      provenance: verifiedQuote(cite('wesley-explanatory-notes', 'on Rom 8:16', WESLEY_ROM_8)),
    },
    {
      id: 'romans-8:cm:spurgeon-8-1',
      authorId: 'spurgeon',
      sourceId: 'spurgeon-in-christ-no-condemnation',
      kind: 'quotation',
      lead: 'On struggling and yet uncondemned (8:1)',
      text: 'The fact is, that believers are in a state of conflict, but not in a state of condemnation; and that at the very time when the conflict is hottest the believer is still justified.',
      locator: 'Sermon no. 1917 (29 August 1886)',
      url: SPURGEON_1917,
      relatedVerses: [v(1)],
      tags: ['condemnation', 'struggle', 'justification', 'romans 7', 'assurance'],
      provenance: verifiedQuote(cite('spurgeon-in-christ-no-condemnation', 'MTP vol. 32, no. 1917', SPURGEON_1917)),
    },
    {
      id: 'romans-8:cm:packer-8-15',
      authorId: 'ji-packer',
      sourceId: 'packer-knowing-god',
      kind: 'summary',
      lead: 'On adoption as the gospel’s greatest blessing (8:14–17)',
      text: 'Packer places adoption at the very top of the gospel’s blessings, ranking it even above justification. Justification settles our standing before God as Judge; adoption makes us members of his family, with God as our Father and ourselves as his children and heirs. Packer goes on to argue that the whole Christian life should be understood, and lived, in the light of being God’s child.',
      locator: 'ch. 19, “Sons of God”',
      url: PACKER_KNOWING_GOD,
      relatedVerses: [v(15), v(16), v(17)],
      tags: ['adoption', 'sonship', 'justification', 'father', 'abba'],
      provenance: summaryOf(
        cite('packer-knowing-god', 'ch. 19, “Sons of God”', PACKER_KNOWING_GOD),
        cite('packer-knowing-god', 'ch. 19, as quoted in T. Challies, “The Essential: Adoption” (2012)', CHALLIES_ADOPTION),
      ),
    },
    {
      id: 'romans-8:cm:wright-8-17',
      authorId: 'nt-wright',
      sourceId: 'wright-new-inheritance',
      kind: 'summary',
      lead: 'On Romans 8 as a new exodus (8:12–25)',
      text: 'Wright reads Romans 5–8 as a retelling of the exodus: sin enslaves as Egypt did, the Messiah’s death and resurrection liberate, the Spirit takes the place the Torah had at Sinai, and God’s children must not turn back to slavery (8:12–17). Their inheritance is no longer one land but the whole creation, freed from slavery — so Romans 8 fulfils the promise of Romans 4:13 that Abraham’s family would inherit the world.',
      locator: 'Bible Review 14.3 (June 1998)',
      url: WRIGHT_NEW_INHERITANCE,
      relatedVerses: [v(15), v(17), v(21)],
      tags: ['exodus', 'inheritance', 'creation', 'adoption', 'slavery', 'new creation'],
      provenance: summaryOf(cite('wright-new-inheritance', 'Bible Review 14.3 (1998)', WRIGHT_NEW_INHERITANCE)),
    },
    {
      id: 'romans-8:cm:piper-8-1',
      authorId: 'john-piper',
      sourceId: 'piper-no-condemnation-in-christ-jesus',
      kind: 'summary',
      lead: 'On the “now” of “no condemnation” (8:1)',
      text: 'Piper hears two senses in Paul’s word now. It is now at last: at the cross God condemned sin in Christ’s flesh (8:3), so that the Son bore the sentence sinners had incurred. And it is now already: though the final judgment is still to come, those in Christ can know its outcome ahead of time (8:33–34). The gift belongs to those who are in Christ, and all are invited to come to him.',
      locator: 'Sermon on Rom 8:1 (9 September 2001)',
      url: PIPER_NO_CONDEMNATION,
      relatedVerses: [v(1), v(3), v(34)],
      tags: ['condemnation', 'justification', 'atonement', 'judgment', 'in christ'],
      provenance: summaryOf(cite('piper-no-condemnation-in-christ-jesus', 'sermon, 9 Sept 2001', PIPER_NO_CONDEMNATION)),
    },
    {
      id: 'romans-8:cm:keller-8-1',
      authorId: 'tim-keller',
      sourceId: 'keller-freedom-in-the-spirit',
      kind: 'summary',
      lead: 'On experiencing God through the Spirit (8:1–4)',
      text: 'Keller asks how believers can know God’s presence in their own experience, and his answer is the work of the Holy Spirit. In his reading of Romans 8 the Spirit binds us to Christ and all he has accomplished, and so assures us that nothing can separate us from the love of God (8:39). From 8:1–4 he draws two truths to hold together: the fight with sin goes on in the Christian life, and yet there is no condemnation (8:1).',
      locator: 'sermon on Rom 8:1–4, series “Lessons in Drawing Near”',
      url: KELLER_FREEDOM,
      relatedVerses: [v(1), v(2), v(3), v(4)],
      tags: ['condemnation', 'spirit', 'assurance', 'struggle', 'experience of god'],
      provenance: summaryOf(
        cite('keller-freedom-in-the-spirit', 'sermon, 9 March 1997', KELLER_FREEDOM),
        cite('keller-freedom-in-the-spirit', 'episode description', KELLER_FREEDOM_NOTES),
      ),
    },
    {
      id: 'romans-8:cm:sproul-8-29',
      authorId: 'rc-sproul',
      sourceId: 'sproul-golden-chain',
      kind: 'summary',
      lead: 'On the “golden chain” of 8:29–30',
      text: 'Sproul argues that nothing in the text makes predestination depend on foreknowledge; that conclusion is drawn only from which verb comes first. God foreknew people, not their decisions, in the personal, loving sense of “know”, and the chain holds without a broken link. He sets this against the prescient view (election based on foreseen faith), which he traces to Melanchthon’s modification of Luther and regards as the majority position among modern evangelicals.',
      locator: 'Sermon on Rom 8:29–30 (30 July 2006)',
      url: SPROUL_GOLDEN_CHAIN,
      relatedVerses: [v(29), v(30)],
      tags: ['predestination', 'foreknowledge', 'golden chain', 'election', 'calling'],
      provenance: summaryOf(cite('sproul-golden-chain', 'sermon transcript, 30 July 2006', SPROUL_GOLDEN_CHAIN)),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Sermons                                                           */
  /* ---------------------------------------------------------------- */

  sermons: [
    {
      id: 'romans-8:sermon:spurgeon-1917',
      authorId: 'spurgeon',
      title: 'In Christ No Condemnation',
      date: '1886-08-29',
      series: 'Metropolitan Tabernacle Pulpit, vol. 32, no. 1917',
      refs: [r8(1)],
      topics: ['condemnation', 'justification', 'romans 7', 'assurance'],
      url: SPURGEON_1917,
      sourceId: 'spurgeon-in-christ-no-condemnation',
      summary: text(
        'Spurgeon refuses to separate Romans 7 from Romans 8: the believer lives in both at once, fighting inward sin while fully justified — “in a state of conflict, but not in a state of condemnation”. He warns against a message of no condemnation that denies the law’s threats, describes the believer’s position “in Christ Jesus”, notes that the clause about walking “not after the flesh” in 8:1 is not original (the Revised Version omits it), and ends with the believer’s absolution.',
        summaryOf(cite('spurgeon-in-christ-no-condemnation', 'MTP no. 1917', SPURGEON_1917)),
      ),
    },
    {
      id: 'romans-8:sermon:spurgeon-1532',
      authorId: 'spurgeon',
      title: 'The Holy Spirit’s Intercession',
      date: '1880-04-11',
      series: 'Metropolitan Tabernacle Pulpit, vol. 26, no. 1532',
      refs: [r8(26, 27)],
      topics: ['prayer', 'intercession', 'holy spirit', 'weakness', 'groaning'],
      url: SPURGEON_1532,
      sourceId: 'spurgeon-holy-spirits-intercession',
      summary: text(
        'A sermon in three parts: the help the Holy Spirit gives, the prayer he inspires, and the sure success of such prayers. Spurgeon teaches that the Spirit guides believers’ petitions and “maketh intercession” not by groaning himself but by stirring up intense desires and unutterable groanings in them, which are ascribed to him — and that such prayers are heard, because they are according to the will of God.',
        summaryOf(cite('spurgeon-holy-spirits-intercession', 'MTP no. 1532', SPURGEON_1532)),
      ),
    },
    {
      id: 'romans-8:sermon:piper-2001',
      authorId: 'john-piper',
      title: 'No Condemnation in Christ Jesus',
      date: '2001-09-09',
      series: 'Romans: The Greatest Letter Ever Written (Bethlehem Baptist Church)',
      refs: [r8(1, 4)],
      topics: ['condemnation', 'justification', 'atonement'],
      url: PIPER_NO_CONDEMNATION,
      sourceId: 'piper-no-condemnation-in-christ-jesus',
      summary: text(
        'Piper treats 8:1 as central to the Christian message and explains its “now” in two ways: the waiting is over, because God condemned sin in Christ’s flesh (8:3); and the outcome of the final judgment is settled ahead of time for those in Christ (8:33–34).',
        summaryOf(cite('piper-no-condemnation-in-christ-jesus', 'sermon, 9 Sept 2001', PIPER_NO_CONDEMNATION)),
      ),
    },
    {
      id: 'romans-8:sermon:keller-1997',
      authorId: 'tim-keller',
      title: 'Certainty of the Spirit',
      date: '1997-04-13',
      series: 'Lessons in Drawing Near (Redeemer Presbyterian Church)',
      refs: [r8(31, 39)],
      topics: ['assurance', 'holy spirit', 'love of god', 'separation'],
      url: KELLER_CERTAINTY,
      sourceId: 'keller-certainty-of-the-spirit',
      summary: text(
        'Keller reads the close of Romans 8 as the climax of the Spirit’s work: giving believers settled confidence that nothing can separate them from God’s love. What believers lack, he suggests, is conviction of this, and the Spirit supplies it against doubts that come both from within us and from outside us.',
        summaryOf(cite('keller-certainty-of-the-spirit', 'episode description', KELLER_CERTAINTY_NOTES)),
      ),
    },
    {
      id: 'romans-8:sermon:sproul-2006',
      authorId: 'rc-sproul',
      title: 'The Golden Chain',
      date: '2006-07-30',
      series: 'Sermon series through Romans (Ligonier Ministries)',
      refs: [r8(29, 30)],
      topics: ['predestination', 'foreknowledge', 'election', 'golden chain'],
      url: SPROUL_GOLDEN_CHAIN,
      sourceId: 'sproul-golden-chain',
      summary: text(
        'Sproul places 8:29–30 in the history of the debate from the Remonstrants and the Synod of Dort onward, and argues for unconditional election: foreknowledge in this text means God’s personal, loving knowledge of people, not his foresight of their choices.',
        summaryOf(cite('sproul-golden-chain', 'sermon transcript', SPROUL_GOLDEN_CHAIN)),
      ),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Verse notes (chat-ready)                                          */
  /* ---------------------------------------------------------------- */

  verseNotes: [
    {
      verse: v(1),
      explanation: text(
        '“Therefore” draws the conclusion from chapters 5–7: for those “in Christ Jesus” there is now no condemnation — no adverse verdict and no penalty (κατάκριμα, a word Paul uses only here and in 5:16–18). The verse follows straight on from the struggle of 7:14–25, which is why Spurgeon could say believers are “in a state of conflict, but not in a state of condemnation”. The KJV’s extra words “who walk not after the flesh, but after the Spirit” are found only in the later, Byzantine manuscript tradition (the Textus Receptus behind the KJV) and are absent from the most ancient manuscripts. Most modern translations, including the BSB, have that phrase only in 8:4; the WEB, whose New Testament follows the Greek Majority Text, keeps it in 8:1 with a footnote.',
        synthesis(
          cite('stepbible-tagnt', 'Rom 8:1 — additional words in TR/Byzantine only'),
          cite('spurgeon-in-christ-no-condemnation', 'MTP no. 1917', SPURGEON_1917),
          cite('tyndale-open-study-notes', 'note on Rom 8:1', TYN_ROM_8),
          cite('kjv', 'Rom 8:1'),
          cite('bsb', 'Rom 8:1 and footnote (“BYZ and TR…”)'),
          cite('web', 'Rom 8:1 and footnote (“NU omits…”); NT text basis stated at worldenglish.bible', WEB_HOME),
        ),
      ),
      tags: ['condemnation', 'in christ', 'romans 7', 'textual variant'],
    },
    {
      verse: v(3),
      explanation: text(
        'The law could not free us — not because it was bad, but because it was “weakened by the flesh”: it could command but not empower. So God sent “His own Son in the likeness of sinful man” (literally “of sinful flesh”): truly human, yet without sin. “As an offering for sin” uses the Greek Old Testament’s phrase for the sin offering (Tyndale). On the cross God “condemned sin in the flesh” — the sentence fell on sin in Christ, so that it need not fall on those who are in him.',
        synthesis(
          cite('tyndale-open-study-notes', 'note on Rom 8:3', TYN_ROM_8),
          cite('stepbible-tagnt', 'Rom 8:3 (ἐν ὁμοιώματι σαρκὸς ἁμαρτίας)'),
          cite('bsb', 'Rom 8:1–3'),
        ),
      ),
      tags: ['condemnation', 'law', 'flesh', 'atonement', 'incarnation'],
    },
    {
      verse: v(9),
      explanation: text(
        'Paul assumes every believer has the Spirit: “if anyone does not have the Spirit of Christ, he does not belong to Christ.” In one sentence the same Spirit is “the Spirit of God” and “the Spirit of Christ”. “Controlled… by the Spirit” is literally “in the Spirit” — not a higher class of Christian but the new realm every believer lives in. The Spirit does not remove responsibility or make sin impossible, but he is the strongest power in the believer’s life (Tyndale).',
        synthesis(cite('tyndale-open-study-notes', 'note on Rom 8:9', TYN_ROM_8), cite('stepbible-tagnt', 'Rom 8:9 (ἐν σαρκὶ… ἐν πνεύματι)'), cite('bsb', 'Rom 8:9')),
      ),
      tags: ['spirit', 'indwelling', 'belonging', 'trinity'],
    },
    {
      verse: v(12),
      explanation: text(
        '“We have an obligation” is literally “we are debtors” (ὀφειλέται, as the KJV has it). Paul starts to say what we owe but states only the negative: we owe the flesh nothing. John Chrysostom noticed that Paul words this more strikingly than a bare command not to live by the flesh: the implied creditor is the Spirit. Having been given life by the Spirit (8:11), believers have no obligation to live on the flesh’s terms; 8:13 spells out what that means.',
        synthesis(
          cite('stepbible-tbesg', 'G3781 ὀφειλέτης “debtor”'),
          cite('chrysostom-homilies-romans', 'Homily 14, on Rom 8:12–13', CHRYS_HOM_14),
          cite('kjv', 'Rom 8:12'),
          cite('bsb', 'Rom 8:11–13'),
        ),
      ),
      tags: ['obligation', 'flesh', 'debt', 'sanctification'],
    },
    {
      verse: v(13),
      explanation: text(
        '“If by the Spirit you put to death the deeds of the body, you will live.” Two things are held together: believers must act — the verb is present tense, an ongoing putting-to-death — and they can do it only “by the Spirit”. John Owen built his classic Of the Mortification of Sin in Believers (1656) on this verse: those freed from condemnation must still make killing sin their lifelong business — “be killing sin or it will be killing you.”',
        synthesis(
          cite('stepbible-tagnt', 'Rom 8:13 θανατοῦτε (V-PAI-2P)'),
          cite('owen-mortification-of-sin', 'ch. I–II', OWEN_CH_2),
          cite('bsb', 'Rom 8:13'),
        ),
      ),
      tags: ['mortification', 'sanctification', 'flesh', 'spirit', 'put to death'],
    },
    {
      verse: v(15),
      explanation: text(
        'Paul contrasts two “spirits”: a spirit of slavery that leads back into fear, and the Spirit of adoption, by whom we cry “Abba! Father!” The verb (κράζω) means to call out aloud — a heartfelt cry, not a formula. Adoption gave a son full rights as heir in the Roman world (Tyndale), and Israel was God’s son long before (Exod 4:22); Paul uses both to say that believers belong to God’s family and pray with Jesus’ own word for Father (Mark 14:36).',
        synthesis(
          cite('stepbible-tbesg', 'G2896 κράζω; G5 ἀββά'),
          cite('tyndale-open-study-notes', 'notes on Rom 8:14–15', TYN_ROM_8),
          cite('bsb', 'Rom 8:15; Exod 4:22; Mark 14:36'),
        ),
      ),
      tags: ['adoption', 'abba', 'slavery', 'fear', 'prayer'],
    },
    {
      verse: v(16),
      explanation: text(
        'The Spirit “testifies with our spirit” — the verb (συμμαρτυρέω) means to bear witness together: our own spirit, and God’s Spirit confirming it, that we are God’s children. Christians have understood this witness differently: John Wesley taught a direct inner testimony of the Spirit “distinct from that of his own spirit”, while Calvin tied it to the confidence that opens our mouths to call God Father in prayer. Both treat assurance as God’s gift, not self-persuasion.',
        synthesis(
          cite('stepbible-tbesg', 'G4828 συμμαρτυρέω “to bear witness with”'),
          cite('wesley-explanatory-notes', 'on Rom 8:16', WESLEY_ROM_8),
          cite('calvin-commentaries', 'on Rom 8:16', CALVIN_JSON_ROM_8),
        ),
      ),
      tags: ['assurance', 'witness of the spirit', 'adoption', 'prayer'],
    },
    {
      verse: v(18),
      explanation: text(
        '“I consider” (λογίζομαι) expresses a settled judgment: Paul has weighed present sufferings against the glory to be revealed in us and concludes they are simply “not comparable”. He is not minimising pain — the list in 8:35 is real — but weighing it on a scale where the coming glory outweighs it. 2 Corinthians 4:17 makes the same calculation: “light and momentary affliction” against “an eternal weight of glory”.',
        synthesis(
          cite('stepbible-tagnt', 'Rom 8:18 (G3049)'),
          cite('stepbible-tbesg', 'G3049 λογίζομαι — Rom 8:18 under “to suppose, judge, deem”'),
          cite('bsb', 'Rom 8:18, 35; 2 Cor 4:17'),
        ),
      ),
      tags: ['suffering', 'glory', 'hope'],
    },
    {
      verse: v(20),
      explanation: text(
        'Creation “was subjected to futility” — ματαιότης, the word the Greek Old Testament uses throughout Ecclesiastes (“Futility of futilities… Everything is futile!”, Eccl 1:2). The One who subjected it is best taken as God, pronouncing the curse on the ground after Adam’s sin (Gen 3:17; so John Wesley). But it was “in hope”: creation will be set free from its bondage to decay and share “the glorious freedom of the children of God” (8:21).',
        synthesis(
          cite('stepbible-tbesg', 'G3153 ματαιότης (LXX for הֶבֶל, nearly 40 times in Ecclesiastes)'),
          cite('lxx-brenton', 'Eccl 1:2', LXX_ECC_1),
          cite('wesley-explanatory-notes', 'on Rom 8:20', WESLEY_ROM_8),
          cite('bsb', 'Gen 3:17–19; Eccl 1:2; Rom 8:20–21'),
        ),
      ),
      tags: ['creation', 'futility', 'hope', 'curse', 'new creation'],
    },
    {
      verse: v(23),
      explanation: text(
        'Believers “have the firstfruits of the Spirit” — the first sheaf that consecrated and guaranteed the whole harvest (Lev 23:10, where the Greek Old Testament uses the same word, ἀπαρχή). Yet “we ourselves… groan inwardly as we wait eagerly for our adoption as sons, the redemption of our bodies.” Adoption is already ours (8:15) and not yet complete: Christians live between the “already” of redemption and the “not yet” of glory (Tyndale).',
        synthesis(
          cite('lxx-brenton', 'Lev 23:10', LXX_LEV_23),
          cite('tyndale-open-study-notes', 'note on Rom 8:23', TYN_ROM_8),
          cite('bsb', 'Rom 8:15, 23'),
        ),
      ),
      tags: ['firstfruits', 'adoption', 'resurrection', 'body', 'hope', 'groaning'],
    },
    {
      verse: v(26),
      explanation: text(
        '“In the same way” links the Spirit to the groaning of creation and of believers. The Spirit “helps us in our weakness” — Calvin notes that the verb (συναντιλαμβάνομαι) pictures someone taking hold of a burden together with us. When we do not know what to pray, “the Spirit Himself intercedes for us with groans too deep for words.” Interpreters differ on whether these are the Spirit’s own groans or our sighs prompted by him, but all agree that God understands them (8:27).',
        synthesis(
          cite('stepbible-tbesg', 'G4878 συναντιλαμβάνομαι “to take hold with… help in bearing”'),
          cite('calvin-commentaries', 'on Rom 8:26', CALVIN_JSON_ROM_8),
          cite('bsb', 'Rom 8:26–27'),
        ),
      ),
      tags: ['prayer', 'intercession', 'weakness', 'groaning', 'spirit'],
    },
    {
      verse: v(28),
      explanation: text(
        'Paul does not say that everything is good, but that for “those who love Him, who are called according to His purpose”, God works all things together “for the good”. The Greek can be read “all things work together” (KJV) or “God works all things together” (BSB; some manuscripts add “God” as the subject, the reading printed by Westcott and Hort), but either way God’s purpose is the reason. The next verse defines the good: being “conformed to the image of His Son”, which may come through suffering (8:17, 35–36). John Chrysostom saw it: “all things” includes “even the things that seem painful”.',
        synthesis(
          cite('stepbible-tagnt', 'Rom 8:28 (ὁ θεός variant, WH)'),
          cite('chrysostom-homilies-romans', 'Homily 15, on Rom 8:28', CHRYS_HOM_15),
          cite('bsb', 'Rom 8:28–29'),
          cite('kjv', 'Rom 8:28'),
        ),
      ),
      tags: ['all things for good', 'providence', 'suffering', 'purpose', 'calling'],
    },
    {
      verse: v(29),
      explanation: text(
        '“Those God foreknew, He also predestined to be conformed to the image of His Son.” The goal of God’s purpose is family likeness: that the Son be “the firstborn among many brothers” — firstborn (πρωτότοκος) being the title the Greek Old Testament gives Israel as God’s son (Exod 4:22). What “foreknew” means is debated between traditions, but the aim is not: God means to make his children like Christ, in character now and in bodily glory at the resurrection (Phil 3:21).',
        synthesis(
          cite('stepbible-tagnt', 'Rom 8:29 (G4416 πρωτότοκος; G1504 εἰκών)'),
          cite('lxx-brenton', 'Exod 4:22', LXX_EXO_4),
          cite('bsb', 'Rom 8:29; Phil 3:21'),
        ),
      ),
      tags: ['predestination', 'foreknowledge', 'image', 'firstborn', 'glory'],
    },
    {
      verse: v(34),
      explanation: text(
        '“Who is there to condemn us?” Paul answers with four facts about Christ: he died; more than that, he was raised; he is at the right hand of God; and he is interceding for us. The question echoes the Servant’s confidence in Isaiah 50:9, and Calvin draws out the logic: “there remains no condemnation, when satisfaction is given to the laws, and the penalty is already paid.” The chapter that opened with “no condemnation” returns to it as a question no accuser can answer.',
        synthesis(
          cite('calvin-commentaries', 'on Rom 8:34', CALVIN_ROM_8_34),
          cite('bsb', 'Rom 8:1, 33–34; Isa 50:8–9'),
        ),
      ),
      tags: ['condemnation', 'intercession', 'resurrection', 'courtroom', 'assurance'],
    },
    {
      verse: v(39),
      explanation: text(
        'Paul’s list sweeps across every category he can name — death and life, angels and rulers, present and future, powers, height and depth, “anything else in all creation” — and none “will be able to separate us from the love of God that is in Christ Jesus our Lord.” The chapter began with “no condemnation for those who are in Christ Jesus” (8:1) and ends with no separation in Christ Jesus: union with Christ grounds both the verdict and the love.',
        synthesis(cite('bsb', 'Rom 8:1, 38–39'), cite('stepbible-tagnt', 'Rom 8:1, 39 (ἐν Χριστῷ Ἰησοῦ)')),
      ),
      tags: ['love', 'separation', 'assurance', 'in christ'],
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Concepts (engine retrieval index)                                 */
  /* ---------------------------------------------------------------- */

  concepts: [
    {
      id: 'romans-8:concept:condemnation',
      label: 'Condemnation',
      aliases: [
        'condemnation',
        'no condemnation',
        'condemn',
        'condemns',
        'condemned',
        'condemning',
        'condemneth',
        'katakrima',
        'κατάκριμα',
        'katakrino',
        'katakrinō',
        'κατακρίνω',
        'verdict',
        'guilty',
        'guilt',
        'accusation',
        'accuse',
      ],
      answer: text(
        'Κατάκριμα (katakrima, 8:1) is a courtroom word: the adverse verdict and the penalty that follows it. Paul uses it only here and in 5:16–18, where Adam’s trespass brought “condemnation for all”. “No condemnation” means that for those in Christ Jesus that sentence no longer stands — because God “condemned sin in the flesh” of his Son (8:3), and no one can condemn those whom God justifies (8:34). It does not mean believers no longer struggle with sin (7:14–25; 8:13).',
        synthesis(
          cite('stepbible-tbesg', 'G2631 κατάκριμα; G2632 κατακρίνω'),
          cite('stepbible-tagnt', 'G2631: Rom 5:16, 18; 8:1'),
          cite('bsb', 'Rom 5:18; 8:1, 3, 34'),
        ),
      ),
      primarySection: 'original-languages',
      verses: [v(1), v(3), v(34)],
      keyWordIds: ['romans-8:kw:katakrima', 'romans-8:kw:katakrino'],
      crossReferenceIds: ['romans-8:xr:rom-5-16', 'romans-8:xr:rom-7-24', 'romans-8:xr:jhn-3-17', 'romans-8:xr:isa-50-8'],
      contextIds: [],
      themeIds: ['romans-8:th:no-condemnation'],
      perspectiveSetIds: ['romans-8:ps:romans-7'],
      commentaryIds: [
        'romans-8:cm:calvin-8-34',
        'romans-8:cm:luther-8-1',
        'romans-8:cm:spurgeon-8-1',
        'romans-8:cm:piper-8-1',
        'romans-8:cm:keller-8-1',
      ],
    },
    {
      id: 'romans-8:concept:flesh',
      label: 'Flesh',
      aliases: [
        'flesh',
        'the flesh',
        'sarx',
        'σάρξ',
        'sinful nature',
        'sinful flesh',
        'carnal',
        'carnally minded',
        'carnal mind',
        'according to the flesh',
        'mind of the flesh',
        'mind-set',
        'mindset',
        'phronema',
        'φρόνημα',
      ],
      answer: text(
        'In Romans 8 “flesh” (σάρξ, 13 times in 8:3–13) is not the body as such but human life as it is in Adam — weak, self-reliant, bent toward sin and “hostile to God” (8:7). To live “according to the flesh” is to draw life and direction from that source; to live “according to the Spirit” is to be led by God’s Spirit. Each has its own “mind-set” (φρόνημα), issuing in death or in life and peace (8:6). The contrast is between two powers and ways of life, not body and soul — the Spirit will give life even to our mortal bodies (8:11).',
        synthesis(
          cite('stepbible-tbesg', 'G4561 σάρξ, sense 3(b); G5427 φρόνημα'),
          cite('stepbible-tagnt', 'G4561 in Rom 8'),
          cite('tyndale-open-study-notes', 'note on Rom 8:4', TYN_ROM_8),
          cite('bsb', 'Rom 8:3–13'),
        ),
      ),
      primarySection: 'original-languages',
      verses: [v(3), v(4), v(5), v(6), v(7), v(8), v(9), v(12), v(13)],
      keyWordIds: ['romans-8:kw:sarx', 'romans-8:kw:phronema'],
      crossReferenceIds: ['romans-8:xr:gal-5-16', 'romans-8:xr:rom-7-24'],
      contextIds: [],
      themeIds: ['romans-8:th:mortification'],
      perspectiveSetIds: ['romans-8:ps:romans-7'],
      commentaryIds: ['romans-8:cm:owen-8-13', 'romans-8:cm:luther-8-1'],
    },
    {
      id: 'romans-8:concept:spirit',
      label: 'The Holy Spirit',
      aliases: [
        'spirit',
        'the spirit',
        'holy spirit',
        'holy ghost',
        'pneuma',
        'πνεῦμα',
        'spirit of god',
        'spirit of christ',
        'spirit of life',
        'indwelling',
        'led by the spirit',
        'life in the spirit',
        'walk by the spirit',
        'according to the spirit',
      ],
      answer: text(
        'The Holy Spirit dominates Romans 8: πνεῦμα occurs 21 times here — most, though not all, of God’s Spirit (compare “a spirit of slavery”, 8:15, and “our spirit”, 8:16) — more than in any other New Testament chapter. The Spirit is both “the Spirit of God” and “the Spirit of Christ” (8:9). He sets free from the law of sin and death (8:2), fulfils the law’s righteous requirement in those who walk by him (8:4), gives life now and resurrection later (8:11), leads God’s children and assures them of sonship (8:14–16), and intercedes in their weakness (8:26–27).',
        synthesis(cite('stepbible-tagnt', 'G4151 counted by chapter (NA28)'), cite('bsb', 'Rom 8:2, 4, 9, 11, 14–16, 26–27')),
      ),
      primarySection: 'theology',
      verses: [v(2), v(4), v(9), v(11), v(14), v(16), v(26)],
      keyWordIds: ['romans-8:kw:pneuma'],
      crossReferenceIds: ['romans-8:xr:ezk-36-26', 'romans-8:xr:gal-5-16', 'romans-8:xr:eph-1-13'],
      contextIds: [],
      themeIds: ['romans-8:th:spirit'],
      perspectiveSetIds: [],
      commentaryIds: ['romans-8:cm:wesley-8-16', 'romans-8:cm:keller-8-1'],
    },
    {
      id: 'romans-8:concept:adoption',
      label: 'Adoption',
      aliases: [
        'adoption',
        'adopted',
        'adopt',
        'adoption as sons',
        'sonship',
        'sons of god',
        'children of god',
        'huiothesia',
        'υἱοθεσία',
        'heirs',
        'heir',
        'co-heirs',
        'joint-heirs',
        'joint heirs',
        'inheritance',
        'spirit of adoption',
        'spirit of slavery',
        'spirit of bondage',
      ],
      answer: text(
        'Adoption (υἱοθεσία) is a word only Paul uses in the New Testament. In the Roman world an adopted son received the full rights of an heir; in the Old Testament Israel was God’s son (Exod 4:22; Rom 9:4). Paul joins both: believers have received “the Spirit of adoption” and cry “Abba! Father!”, and as children they are “heirs of God and co-heirs with Christ” (8:15–17). Yet the adoption is also future — “the redemption of our bodies” (8:23). J. I. Packer ranked adoption above even justification among the gospel’s blessings.',
        synthesis(
          cite('stepbible-tbesg', 'G5206 υἱοθεσία'),
          cite('tyndale-open-study-notes', 'notes on Rom 8:15, 8:23', TYN_ROM_8),
          cite('packer-knowing-god', 'ch. 19, “Sons of God”', PACKER_KNOWING_GOD),
          cite('packer-knowing-god', 'ch. 19, as quoted in T. Challies, “The Essential: Adoption” (2012)', CHALLIES_ADOPTION),
          cite('bsb', 'Rom 8:15–17, 23; Exod 4:22'),
        ),
      ),
      primarySection: 'theology',
      verses: [v(14), v(15), v(16), v(17), v(23)],
      keyWordIds: ['romans-8:kw:huiothesia', 'romans-8:kw:abba'],
      crossReferenceIds: ['romans-8:xr:gal-4-4', 'romans-8:xr:exo-4-22', 'romans-8:xr:eph-1-13'],
      contextIds: ['romans-8:ctx:adoption', 'romans-8:ctx:exodus', 'romans-8:ctx:abba'],
      themeIds: ['romans-8:th:adoption'],
      perspectiveSetIds: [],
      commentaryIds: ['romans-8:cm:packer-8-15', 'romans-8:cm:wright-8-17', 'romans-8:cm:chrysostom-8-29', 'romans-8:cm:wesley-8-16'],
    },
    {
      id: 'romans-8:concept:abba',
      label: 'Abba, Father',
      aliases: ['abba', 'abba father', 'ἀββά', 'αββα', 'daddy', 'aramaic', 'father god', 'cry abba'],
      answer: text(
        'Abba is the Aramaic word for “father”, the language Jesus spoke; he prayed it in Gethsemane (Mark 14:36). Paul keeps it untranslated in a Greek letter and adds the Greek word for Father (8:15; Gal 4:6): by the Spirit, believers pray to God as Jesus did. It was an everyday family word used by children young and grown — James Barr argued that the popular rendering “Daddy” is not supported by the evidence — and John Wesley saw in the pairing “the joint cry both of the Jewish and gentile believers.”',
        synthesis(
          cite('stepbible-tbesg', 'G5 ἀββά'),
          cite('barr-abba-isnt-daddy', 'JTS 39 (1988)', BARR_ABBA),
          cite('barr-abba-isnt-daddy', 'pp. 38, 46, as quoted in G. Stanton, “FactChecker: Does ‘Abba’ Mean ‘Daddy’?” (The Gospel Coalition, 2013)', TGC_ABBA),
          cite('wesley-explanatory-notes', 'on Rom 8:15', WESLEY_ROM_8),
          cite('bsb', 'Mark 14:36; Rom 8:15; Gal 4:6'),
        ),
      ),
      primarySection: 'original-languages',
      verses: [v(15)],
      keyWordIds: ['romans-8:kw:abba'],
      crossReferenceIds: ['romans-8:xr:gal-4-4'],
      contextIds: ['romans-8:ctx:abba', 'romans-8:ctx:audience'],
      themeIds: ['romans-8:th:adoption'],
      perspectiveSetIds: [],
      commentaryIds: ['romans-8:cm:packer-8-15'],
    },
    {
      id: 'romans-8:concept:creation',
      label: 'Creation’s groaning and hope',
      aliases: [
        'creation',
        'whole creation',
        'creation groaning',
        'groaning',
        'groan',
        'groans',
        'childbirth',
        'futility',
        'vanity',
        'mataiotes',
        'ματαιότης',
        'bondage to decay',
        'corruption',
        'new creation',
        'redemption of our bodies',
        'eager expectation',
        'apokaradokia',
        'ἀποκαραδοκία',
      ],
      answer: text(
        'Paul pictures the whole creation “subjected to futility” — the word the Greek Old Testament uses throughout Ecclesiastes — most likely because of God’s judgment after Adam’s sin (Gen 3:17), yet “in hope”. Creation waits with “eager expectation” (ἀποκαραδοκία, a vivid compound that Abbott-Smith explains from watching with outstretched head, though in use it simply means eager, anxious expectation) and groans like a woman in labour, longing to be freed from decay when God’s children are revealed. Believers groan too, awaiting the redemption of their bodies (8:19–23). The Christian hope is a renewed creation (Rev 21:1–5), not an escape from it.',
        synthesis(
          cite('stepbible-tbesg', 'G603 ἀποκαραδοκία (gloss “eager expectation”); G3153 ματαιότης (LXX for הֶבֶל, nearly 40 times in Ecclesiastes)'),
          cite('tyndale-open-study-notes', 'notes on Rom 8:19–23', TYN_ROM_8),
          cite('wesley-explanatory-notes', 'on Rom 8:20', WESLEY_ROM_8),
          cite('bsb', 'Rom 8:19–23; Gen 3:17; Rev 21:1–5'),
        ),
      ),
      primarySection: 'theology',
      verses: [v(19), v(20), v(21), v(22), v(23)],
      keyWordIds: [],
      crossReferenceIds: ['romans-8:xr:gen-3-17', 'romans-8:xr:rev-21-1', 'romans-8:xr:2co-5-2'],
      contextIds: [],
      themeIds: ['romans-8:th:new-creation'],
      perspectiveSetIds: [],
      commentaryIds: ['romans-8:cm:wright-8-17'],
    },
    {
      id: 'romans-8:concept:firstfruits',
      label: 'Firstfruits of the Spirit',
      aliases: ['firstfruits', 'first fruits', 'firstfruits of the spirit', 'aparche', 'aparchē', 'ἀπαρχή', 'first harvest', 'pledge', 'guarantee', 'down payment'],
      answer: text(
        'Firstfruits (ἀπαρχή) was the first sheaf of the harvest, waved before the LORD before any of the crop could be eaten (Lev 23:9–14); the Greek Old Testament uses the same word there. Paul says believers “have the firstfruits of the Spirit” (8:23): the Spirit is the first installment and guarantee of the harvest still to come — full adoption and the redemption of our bodies. He uses the same image for Christ’s resurrection (1 Cor 15:20).',
        synthesis(
          cite('lxx-brenton', 'Lev 23:10', LXX_LEV_23),
          cite('stepbible-tbesg', 'G536 ἀπαρχή'),
          cite('tyndale-open-study-notes', 'note on Rom 8:23', TYN_ROM_8),
          cite('bsb', 'Lev 23:9–14; Rom 8:23; 1 Cor 15:20'),
        ),
      ),
      primarySection: 'original-languages',
      verses: [v(23)],
      keyWordIds: ['romans-8:kw:aparche'],
      crossReferenceIds: ['romans-8:xr:lev-23-10', 'romans-8:xr:1co-15-20', 'romans-8:xr:eph-1-13'],
      contextIds: ['romans-8:ctx:firstfruits'],
      themeIds: ['romans-8:th:new-creation'],
      perspectiveSetIds: [],
      commentaryIds: [],
    },
    {
      id: 'romans-8:concept:all-things-for-good',
      label: 'All things work together for good',
      aliases: [
        'all things work together for good',
        'work together for good',
        'all things for good',
        'work together',
        'works all things together',
        'for good',
        'the good',
        'sunergeo',
        'sunergeō',
        'συνεργέω',
        'called according to his purpose',
        'his purpose',
        'providence',
      ],
      answer: text(
        'Romans 8:28 does not say everything is good, nor that all things turn out well for everyone. It promises that for “those who love Him, who are called according to His purpose”, God works all things together “for the good” — and 8:29 defines that good as being conformed to the image of his Son. The Greek can be read “all things work together” or “God works all things together”; either way God’s purpose is decisive. John Chrysostom noted that “all things” includes “even the things that seem painful”.',
        synthesis(
          cite('stepbible-tbesg', 'G4903 συνεργέω'),
          cite('stepbible-tagnt', 'Rom 8:28'),
          cite('chrysostom-homilies-romans', 'Homily 15', CHRYS_HOM_15),
          cite('bsb', 'Rom 8:28–29'),
        ),
      ),
      primarySection: 'theology',
      verses: [v(28), v(29)],
      keyWordIds: ['romans-8:kw:sunergeo'],
      crossReferenceIds: ['romans-8:xr:2co-4-16'],
      contextIds: [],
      themeIds: ['romans-8:th:providence'],
      perspectiveSetIds: ['romans-8:ps:foreknowledge'],
      commentaryIds: ['romans-8:cm:chrysostom-8-28'],
    },
    {
      id: 'romans-8:concept:predestination',
      label: 'Foreknowledge and predestination',
      aliases: [
        'predestination',
        'predestined',
        'predestinate',
        'predestine',
        'foreknowledge',
        'foreknew',
        'foreknow',
        'foreknown',
        'proginosko',
        'proginōskō',
        'προγινώσκω',
        'election',
        'elect',
        'chosen',
        'golden chain',
        'called',
        'calling',
        'justified',
        'glorified',
        'conformed to the image',
      ],
      answer: text(
        'Romans 8:29–30 is a chain of five verbs: God foreknew, predestined, called, justified and glorified. Christians agree that salvation begins in God’s gracious purpose and aims at likeness to Christ. They differ on “foreknew”: Reformed readers take it as God’s electing love for particular people; Arminian and Wesleyan readers as his foreknowledge of those who would believe; Lutheran, Catholic and Orthodox traditions each frame it differently again. The Perspectives panel sets these out. “Glorified” is in the past tense although glory is still future (8:18): the Tyndale note explains it as God’s settled decision, as certain as if already done, while John Wesley heard Paul speaking “as one looking back from the goal”.',
        synthesis(
          cite('stepbible-tbesg', 'G4267 προγινώσκω; G4309 προορίζω'),
          cite('tyndale-open-study-notes', 'note on Rom 8:30', TYN_ROM_8),
          cite('wesley-explanatory-notes', 'on Rom 8:30', WESLEY_ROM_8),
          cite('bsb', 'Rom 8:29–30'),
        ),
      ),
      primarySection: 'theology',
      verses: [v(29), v(30), v(33)],
      keyWordIds: ['romans-8:kw:proginosko'],
      crossReferenceIds: [],
      contextIds: [],
      themeIds: ['romans-8:th:providence'],
      perspectiveSetIds: ['romans-8:ps:foreknowledge'],
      commentaryIds: ['romans-8:cm:sproul-8-29', 'romans-8:cm:chrysostom-8-29'],
    },
    {
      id: 'romans-8:concept:mortification',
      label: 'Putting sin to death',
      aliases: [
        'put to death',
        'putting to death',
        'mortify',
        'mortification',
        'deeds of the body',
        'killing sin',
        'kill sin',
        'debtors',
        'obligation',
        'sanctification',
        'holiness',
        'thanatoo',
        'θανατόω',
      ],
      answer: text(
        '“If by the Spirit you put to death the deeds of the body, you will live” (8:13). Believers owe the flesh nothing (8:12), so they are to keep killing sin — the verb is present tense, an ongoing action — but only “by the Spirit”, not by their own strength. John Owen’s Of the Mortification of Sin in Believers (1656), built on this verse, insists that those freed from condemnation must make this their lifelong business: “be killing sin or it will be killing you.”',
        synthesis(
          cite('stepbible-tagnt', 'Rom 8:13 θανατοῦτε (V-PAI-2P)'),
          cite('owen-mortification-of-sin', 'ch. I–II', OWEN_CH_2),
          cite('bsb', 'Rom 8:12–13'),
        ),
      ),
      primarySection: 'theology',
      verses: [v(12), v(13)],
      keyWordIds: ['romans-8:kw:sarx'],
      crossReferenceIds: ['romans-8:xr:gal-5-16'],
      contextIds: [],
      themeIds: ['romans-8:th:mortification'],
      perspectiveSetIds: ['romans-8:ps:romans-7'],
      commentaryIds: ['romans-8:cm:owen-8-13'],
    },
    {
      id: 'romans-8:concept:intercession',
      label: 'The Spirit’s help in prayer',
      aliases: [
        'intercession',
        'intercede',
        'intercedes',
        'intercedes for us',
        'prayer',
        'pray',
        'praying',
        'groans too deep for words',
        'groanings',
        'groanings which cannot be uttered',
        'weakness',
        'infirmities',
        'stenagmos',
        'στεναγμός',
        'entynchano',
        'ἐντυγχάνω',
      ],
      answer: text(
        'When “we do not know how we ought to pray”, the Spirit “helps us in our weakness” — the verb pictures taking hold of a burden with someone — and “intercedes for us with groans too deep for words” (8:26). God, who searches hearts, knows the mind of the Spirit, who prays according to God’s will (8:27). Meanwhile Christ intercedes at God’s right hand (8:34). Whether these groans are the Spirit’s own or ours prompted by him is debated; see Perspectives.',
        synthesis(
          cite('stepbible-tbesg', 'G4878 συναντιλαμβάνομαι; G4726 στεναγμός'),
          cite('stepbible-tagnt', 'G1793 ἐντυγχάνω: Rom 8:27, 34'),
          cite('bsb', 'Rom 8:26–27, 34'),
        ),
      ),
      primarySection: 'theology',
      verses: [v(26), v(27), v(34)],
      keyWordIds: [],
      crossReferenceIds: ['romans-8:xr:heb-7-25'],
      contextIds: [],
      themeIds: ['romans-8:th:spirit'],
      perspectiveSetIds: ['romans-8:ps:groanings'],
      commentaryIds: [],
    },
    {
      id: 'romans-8:concept:separation',
      label: 'Nothing can separate us',
      aliases: [
        'separate',
        'separation',
        'no separation',
        'love of god',
        'love of christ',
        'more than conquerors',
        'conquerors',
        'hupernikao',
        'hupernikaō',
        'ὑπερνικάω',
        'if god is for us',
        'who can be against us',
        'assurance',
        'security',
        'persecution',
        'sheep to be slaughtered',
      ],
      answer: text(
        'The chapter ends in a courtroom of questions: if God is for us, who can be against us? Who will accuse God’s elect, when God justifies? Who will condemn, when Christ died, rose and intercedes? Who will separate us from Christ’s love? Paul quotes Psalm 44:22 to show that suffering is no sign of rejection, then says “we are more than conquerors” — ὑπερνικάω, a word found only here in the New Testament. Nothing in all creation can separate us from God’s love in Christ Jesus (8:31–39).',
        synthesis(
          cite('stepbible-tbesg', 'G5245 ὑπερνικάω “to be more than conqueror”'),
          cite('stepbible-tagnt', 'G5245: Rom 8:37 only'),
          cite('bsb', 'Rom 8:31–39; Ps 44:22'),
        ),
      ),
      primarySection: 'theology',
      verses: [v(31), v(32), v(35), v(36), v(37), v(38), v(39)],
      keyWordIds: [],
      crossReferenceIds: ['romans-8:xr:ps-44-22', 'romans-8:xr:gen-22-12', 'romans-8:xr:isa-50-8'],
      contextIds: ['romans-8:ctx:suffering'],
      themeIds: ['romans-8:th:providence'],
      perspectiveSetIds: [],
      commentaryIds: ['romans-8:cm:calvin-8-34'],
    },
  ],

  suggestedQuestions: [
    'What does condemnation mean in verse 1?',
    'What does Paul mean by flesh here?',
    'What is the Greek word behind “adoption”?',
    'What did Tim Keller say about this?',
    'How would the original audience have understood “Abba, Father”?',
    'Where else does Paul talk about this?',
    'Explain verse 28 in more detail.',
    'Are there different theological interpretations of verses 29–30?',
    'How does this chapter connect with the rest of Romans?',
    'Does “Abba” mean “Daddy”?',
  ],

  /* ---------------------------------------------------------------- */
  /* Study-specific sources & authors                                  */
  /* ---------------------------------------------------------------- */

  sources: [
    {
      id: 'chrysostom-homilies-romans',
      type: 'sermon',
      title: 'Homilies on the Epistle to the Romans',
      authorIds: ['chrysostom'],
      url: 'https://www.newadvent.org/fathers/2102.htm',
      edition: 'Trans. J. Walker, J. Sheppard and H. Browne, rev. George B. Stevens; Nicene and Post-Nicene Fathers, 1st series, vol. 11 (1889), as edited for New Advent',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Thirty-two expository sermons on Romans by the greatest preacher of the Greek church; Homilies 13–15 cover Romans 7:14–8:39.',
    },
    {
      id: 'luther-preface-romans',
      type: 'article',
      title: 'Preface to the Letter of St. Paul to the Romans',
      authorIds: ['luther'],
      year: '1522 (text of the 1545 German Bible)',
      url: LUTHER_PREFACE,
      edition: 'Trans. Bro. Andrew Thornton, OSB (1983), from the 1545 edition',
      license: {
        status: 'open-license',
        name: 'Translation © 1983 Saint Anselm Abbey; may be used freely with proper attribution',
        usage: 'excerpt',
        attribution: 'Translated by Bro. Andrew Thornton, OSB, for the Saint Anselm College Humanities Program. © 1983 Saint Anselm Abbey.',
      },
      description: 'Luther’s short guide to reading Romans, printed in his German Bible; it explains Paul’s key terms and summarises each chapter.',
    },
    {
      id: 'owen-mortification-of-sin',
      type: 'book',
      title: 'Of the Mortification of Sin in Believers',
      authorIds: ['john-owen'],
      year: '1656',
      url: 'https://ccel.org/ccel/owen/mort',
      edition: 'CCEL electronic text (print basis: Banner of Truth Trust, 1967)',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Owen’s classic treatise on Romans 8:13, published while he was Vice-Chancellor of Oxford and based on sermons he had preached, on the necessity, nature and means of putting sin to death by the Spirit.',
    },
    {
      id: 'wesley-explanatory-notes',
      type: 'commentary',
      title: 'Explanatory Notes upon the New Testament',
      authorIds: ['wesley'],
      year: '1755',
      url: 'https://ccel.org/ccel/wesley/notes',
      edition:
        'Text as reproduced in CCEL’s “Wesley’s Notes on the Bible” (its New Testament portion is the Explanatory Notes upon the New Testament, first published 1755)',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'John Wesley’s concise verse-by-verse notes on the New Testament, drawing on J. A. Bengel and other earlier commentators but written from his own Arminian convictions.',
    },
    {
      id: 'spurgeon-in-christ-no-condemnation',
      type: 'sermon',
      title: 'In Christ No Condemnation (Sermon No. 1917)',
      authorIds: ['spurgeon'],
      year: '1886',
      publisher: 'Metropolitan Tabernacle Pulpit, vol. 32',
      url: SPURGEON_1917,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Spurgeon’s sermon on Romans 8:1, preached on 29 August 1886 at the Metropolitan Tabernacle, London.',
    },
    {
      id: 'spurgeon-holy-spirits-intercession',
      type: 'sermon',
      title: 'The Holy Spirit’s Intercession (Sermon No. 1532)',
      authorIds: ['spurgeon'],
      year: '1880',
      publisher: 'Metropolitan Tabernacle Pulpit, vol. 26',
      url: SPURGEON_1532,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Spurgeon’s sermon on Romans 8:26–27, preached on 11 April 1880.',
    },
    {
      id: 'wright-new-inheritance',
      type: 'article',
      title: 'The New Inheritance According to Paul',
      authorIds: ['nt-wright'],
      year: '1998',
      publisher: 'Bible Review 14.3 (June 1998); reproduced on NTWrightPage',
      url: WRIGHT_NEW_INHERITANCE,
      license: { status: 'copyrighted', name: '© N. T. Wright', usage: 'summary-only' },
      description: 'A short article arguing that Romans 5–8 retells the exodus story for all peoples, from slavery to the inheritance of a renewed creation.',
    },
    {
      id: 'piper-no-condemnation-in-christ-jesus',
      type: 'sermon',
      title: 'No Condemnation in Christ Jesus',
      authorIds: ['john-piper'],
      year: '2001',
      publisher: 'Desiring God (Bethlehem Baptist Church, Minneapolis)',
      url: PIPER_NO_CONDEMNATION,
      license: { status: 'copyrighted', name: '© Desiring God', usage: 'summary-only' },
      description: 'Piper’s sermon on Romans 8:1, preached on 9 September 2001 in his series “Romans: The Greatest Letter Ever Written”.',
    },
    {
      id: 'piper-foreknown-predestined',
      type: 'sermon',
      title: 'Foreknown, Predestined, Conformed to Christ',
      authorIds: ['john-piper'],
      year: '2002',
      publisher: 'Desiring God (Bethlehem Baptist Church, Minneapolis)',
      url: PIPER_FOREKNOWN,
      license: { status: 'copyrighted', name: '© Desiring God', usage: 'summary-only' },
      description: 'Piper’s sermon on Romans 8:28–30 (4 August 2002), arguing that “foreknew” means God’s electing love.',
    },
    {
      id: 'keller-freedom-in-the-spirit',
      type: 'sermon',
      title: 'Freedom in the Spirit',
      authorIds: ['tim-keller'],
      year: '1997',
      publisher: 'Gospel in Life (Redeemer Presbyterian Church, New York)',
      url: KELLER_FREEDOM,
      license: { status: 'copyrighted', name: '© Gospel in Life', usage: 'summary-only' },
      description: 'Keller’s sermon on Romans 8:1–4, preached on 9 March 1997 in the series “Lessons in Drawing Near”.',
    },
    {
      id: 'keller-certainty-of-the-spirit',
      type: 'sermon',
      title: 'Certainty of the Spirit',
      authorIds: ['tim-keller'],
      year: '1997',
      publisher: 'Gospel in Life (Redeemer Presbyterian Church, New York)',
      url: KELLER_CERTAINTY,
      license: { status: 'copyrighted', name: '© Gospel in Life', usage: 'summary-only' },
      description: 'Keller’s sermon on Romans 8:31–39, preached on 13 April 1997 in the series “Lessons in Drawing Near”.',
    },
    {
      id: 'sproul-golden-chain',
      type: 'sermon',
      title: 'The Golden Chain',
      authorIds: ['rc-sproul'],
      year: '2006',
      publisher: 'Ligonier Ministries',
      url: SPROUL_GOLDEN_CHAIN,
      license: { status: 'copyrighted', name: '© Ligonier Ministries', usage: 'summary-only' },
      description: 'Sproul’s sermon on Romans 8:29–30 (30 July 2006) from his series through Romans; audio and transcript on Ligonier.org.',
    },
    {
      id: 'barr-abba-isnt-daddy',
      type: 'article',
      title: 'Abbā Isn’t “Daddy”',
      authorIds: ['james-barr'],
      year: '1988',
      publisher: 'The Journal of Theological Studies 39 (1988): 28–47',
      url: BARR_ABBA,
      license: { status: 'copyrighted', name: '© Oxford University Press', usage: 'summary-only' },
      description: 'A philological study showing that the evidence does not support rendering abba as the child’s word “Daddy”.',
    },
    {
      id: 'suetonius-lives-of-the-caesars',
      type: 'book',
      title: 'The Lives of the Caesars',
      authorIds: ['suetonius'],
      url: SUETONIUS_CLAUDIUS,
      edition: 'Loeb Classical Library English translation (1914), as reproduced on LacusCurtius',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Suetonius’s biographies of the emperors from Julius Caesar to Domitian; the Life of Claudius mentions the expulsion of the Jews from Rome.',
    },
    {
      id: 'dnb-1889-evans-john',
      type: 'dictionary',
      title: 'Evans, John (1680?–1730)',
      authorIds: [],
      year: '1889',
      publisher: 'Dictionary of National Biography, 1885–1900, vol. 18 (London: Smith, Elder & Co.)',
      url: DNB_EVANS,
      edition: 'Article by Alsager Richard Vian; transcribed on Wikisource',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description:
        'Dictionary of National Biography entry on the Nonconformist minister John Evans, which records that he wrote the notes on Romans for the New Testament commentary left unfinished by Matthew Henry.',
    },
  ],

  authors: [
    {
      id: 'james-barr',
      name: 'James Barr',
      lifespan: '1924–2006',
      era: 'contemporary',
      tradition: 'Church of Scotland',
      description: 'Scottish Old Testament scholar and Regius Professor of Hebrew at Oxford (1978–1989), known for his work on biblical semantics.',
      aliases: ['james barr', 'barr'],
    },
    {
      id: 'suetonius',
      name: 'Suetonius',
      lifespan: 'c. 69 – after 122',
      era: 'ancient',
      tradition: 'Roman historian (not a Christian writer)',
      description: 'Gaius Suetonius Tranquillus, Roman biographer and imperial secretary, author of The Lives of the Caesars.',
      aliases: ['suetonius'],
    },
  ],
};

export default study;
