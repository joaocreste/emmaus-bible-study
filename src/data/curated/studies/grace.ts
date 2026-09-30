import type { CuratedStudy, PassageRef, VerseRef } from '../../../domain/models';
import { cite, synthesis, summaryOf, verifiedQuote, lexical, historical, literary } from '../../../domain/provenance';

/**
 * Curated topic study: Grace.
 * Anchor passage: Ephesians 2:1–10. Every quotation below was checked verbatim
 * against the linked public-domain text; modern works are summarised only.
 */

/* ------------------------------------------------------------------ */
/* Local helpers                                                       */
/* ------------------------------------------------------------------ */

/** A single verse of the anchor chapter (Ephesians 2). */
const e2 = (verse: number): VerseRef => ({ book: 'EPH', chapter: 2, verse });

/** A single verse anywhere. */
const vr = (book: string, chapter: number, verse: number): VerseRef => ({ book, chapter, verse });

/**
 * Passage reference: p('ROM', 3, 23, 24) → Rom 3:23–24; p('ROM', 3, 23) → Rom 3:23;
 * p('LUK', 15) → whole chapter.
 */
function p(book: string, chapter: number, startVerse?: number, endVerse?: number): PassageRef {
  if (startVerse == null) return { book, startChapter: chapter };
  return { book, startChapter: chapter, startVerse, endChapter: chapter, endVerse: endVerse ?? startVerse };
}

/* ------------------------------------------------------------------ */
/* Verified URLs                                                       */
/* ------------------------------------------------------------------ */

const URL = {
  calvinEph2_8: 'https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.iii.html',
  augustineGraceFreeWill: 'https://www.newadvent.org/fathers/1510.htm',
  augustineSpiritLetter: 'https://www.newadvent.org/fathers/1502.htm',
  chrysostomEphHom4: 'https://www.newadvent.org/fathers/230104.htm',
  aquinasQ110: 'https://www.newadvent.org/summa/2110.htm',
  aquinasQ111: 'https://www.newadvent.org/summa/2111.htm',
  wesleySermons: 'https://ccel.org/ccel/wesley/sermons.html',
  wesleySalvationByFaith: 'https://ccel.org/ccel/wesley/sermons/sermons.v.i.html',
  wesleyMeansOfGrace: 'https://ccel.org/ccel/wesley/sermons/sermons.v.xvi.html',
  wesleyWorkingOut: 'https://ccel.org/ccel/wesley/sermons/sermons.vi.xxxii.html',
  wesleyFreeGrace: 'https://ccel.org/ccel/wesley/sermons/sermons.viii.ii.html',
  wesleyWorksSermon1: 'https://wesleyworks.ecdsdev.org/sermons/Sermon001',
  olneyHymns: 'https://ccel.org/ccel/newton/olneyhymns.html',
  olneyHymnsText: 'https://ccel.org/ccel/n/newton/olneyhymns/cache/olneyhymns.txt',
  spurgeonAllOfGrace: 'https://ccel.org/ccel/spurgeon/grace.html',
  spurgeonAllOfGraceText: 'https://ccel.org/ccel/s/spurgeon/grace/cache/grace.txt',
  spurgeonSalvationAllOfGrace: 'https://www.spurgeon.org/sermons/salvation-all-of-grace',
  kellerGraceOfGod: 'https://gospelinlife.com/sermon/the-grace-of-god-2/',
  kellerProdigalGod: 'https://books.google.com/books/about/The_Prodigal_God.html?id=vRhP1Xd_8eAC',
  kellerProdigalGodArticle: 'https://www.crossway.org/articles/tim-keller-on-pleasing-god-self-salvation-and-two-lost-sons/',
  piperButGod: 'https://www.desiringgod.org/messages/but-god',
  piperFutureGrace: 'https://www.desiringgod.org/books/future-grace',
  packerKnowingGod: 'https://en.wikipedia.org/wiki/Knowing_God',
  bonhoefferDiscipleship: 'https://www.fortresspress.com/store/product/9781506402703/Discipleship',
  wrightJustification: 'https://denverjournal.denverseminary.edu/the-denver-journal-article/justification-gods-plan-and-pauls-vision/',
  desilvaArticle: 'https://biblicalstudies.org.uk/pdf/ashland_theological_journal/31-1_032.pdf',
  desilvaBook: 'https://www.ivpress.com/Media/Default/Downloads/Excerpts-and-Samples/A0385-excerpt.pdf',
  barclayEerdmans: 'https://www.eerdmans.com/9780802875327/paul-and-the-gift/',
  mooOnBarclay:
    'https://www.thegospelcoalition.org/themelios/article/john-barclays-paul-and-the-gift-and-the-new-perspective-on-paul/',
  losskyPublisher: 'https://www.jamesclarke.co/product/mystical-theology-of-the-eastern-church-the/',
  losskySvots: 'https://www.svots.edu/blog/mystical-theology-eastern-church',
  schaffCreeds3: 'https://ccel.org/ccel/schaff/creeds3.html',
  formulaConcordEpitome: 'https://ccel.org/ccel/schaff/creeds3/creeds3.iii.iv.html',
  augsburg: 'https://bookofconcord.org/augsburg-confession/',
  bfm2000: 'https://bfm.sbc.net/bfm2000/',
  barclayApology: 'https://www.gutenberg.org/ebooks/56487',
  trent6: 'https://history.hanover.edu/texts/trent/ct06.html',
  cccGrace: 'https://www.vatican.va/archive/ENG0015/__P6Z.HTM',
  cccMerit: 'https://www.vatican.va/archive/ENG0015/__P70.HTM',
  jddj: 'https://www.christianunity.va/content/unitacristiani/en/dialoghi/sezione-occidentale/luterani/dialogo/documenti-di-dialogo/1999-dichiarazione-congiunta-sulla-dottrina-della-giustificazion/en.html',
  lwfJddj: 'https://lutheranworld.org/what-we-do/unity-church/joint-declaration-doctrine-justification-jddj',
  lcmsJddj: 'https://files.lcms.org/dl/f/38F606C2-9BC9-4E3D-9283-EA11191EDB14',
  semipelagianism: 'https://www.newadvent.org/cathen/13703a.htm',
  carthage: 'https://www.newadvent.org/fathers/3816.htm',
  hodge2: 'https://ccel.org/ccel/hodge/theology2.html',
} as const;

/* ------------------------------------------------------------------ */
/* Study                                                               */
/* ------------------------------------------------------------------ */

const study: CuratedStudy = {
  id: 'grace',
  kind: 'topic',
  title: 'Grace',
  subtitle: 'God’s Unearned Favor in Christ',
  passage: { book: 'EPH', startChapter: 2, startVerse: 1, endChapter: 2, endVerse: 10 },

  match: {
    references: [{ book: 'EPH', startChapter: 2, startVerse: 1, endChapter: 2, endVerse: 10 }],
    topics: [
      'grace',
      'the grace of god',
      'god’s grace',
      "god's grace",
      'unmerited favor',
      'unmerited favour',
      'what is grace',
      'saved by grace',
      'amazing grace',
      'charis',
      'what does the bible say about grace',
    ],
  },

  /* ---------------- Topic ---------------- */
  topic: {
    name: 'Grace',
    question: 'What does the Bible mean by grace?',
    definition: {
      text:
        'In Scripture, grace is God’s free, undeserved favour toward people who have no claim on it, together with the gifts that flow from that favour. ' +
        'Israel learned its vocabulary long before Paul: chen (favour), chanan (to be gracious) and hesed (steadfast, loyal love) describe a God who revealed himself as gracious and compassionate (Exod 34:6–7) and chose Israel out of sheer love, not merit (Deut 7:7–8). ' +
        'In the New Testament the Greek charis names what God has done in Christ: sinners are justified freely by his grace (Rom 3:24) and saved by grace through faith, as a gift and not by works (Eph 2:8–9). ' +
        'Grace is also power. It trains believers for godly lives (Titus 2:11–12), sustains them in weakness (2 Cor 12:9) and shapes a new way of walking (Eph 2:10).',
      provenance: synthesis(
        cite('bsb', 'Exod 34:6–7'),
        cite('bsb', 'Deut 7:7–8'),
        cite('bsb', 'Rom 3:24'),
        cite('bsb', 'Eph 2:8–10'),
        cite('bsb', 'Titus 2:11–12'),
        cite('bsb', '2 Cor 12:9'),
        cite('stepbible-tbesg', 'G5485 χάρις'),
        cite('stepbible-tbesh', 'H2580, H2603A, H2617A'),
      ),
    },
    keyPassages: [
      /* Grace in the Old Testament */
      {
        id: 'grace:kp:gen-6-8',
        ref: p('GEN', 6, 8),
        title: 'Noah found favor',
        group: 'Grace in the Old Testament',
        note: {
          text:
            'The Bible’s first use of chen (favour). Against a backdrop of universal corruption (6:5–7), the narrator mentions the LORD’s favour toward Noah before describing Noah’s righteousness in the new section that begins at 6:9 (“This is the account of Noah”). Many readers see here a first hint that rescue begins with God’s disposition rather than human achievement, though the idiom “find favor in the eyes of” can elsewhere follow observed conduct (Gen 39:4).',
          provenance: synthesis(cite('bsb', 'Gen 6:5–9; 39:4'), cite('stepbible-tahot', 'Gen 6:8 חֵן H2580')),
        },
        tags: ['chen', 'favor', 'old testament'],
      },
      {
        id: 'grace:kp:exod-34-6',
        ref: p('EXO', 34, 6, 7),
        title: 'The LORD, gracious and compassionate',
        group: 'Grace in the Old Testament',
        note: {
          text:
            'God’s self-description to Moses after the golden calf: compassionate, gracious (channun), abounding in loving devotion (hesed) and faithfulness, forgiving iniquity—yet not ignoring guilt. This confession is echoed across the Old Testament (Ps 103:8; Jonah 4:2) and is the soil in which the New Testament language of grace grows.',
          provenance: synthesis(cite('bsb', 'Exod 34:6–7'), cite('stepbible-tahot', 'Exod 34:6 H2587, H2617A')),
        },
        tags: ['hesed', 'gracious', 'mercy', 'old testament'],
      },
      {
        id: 'grace:kp:deut-7-7',
        ref: p('DEU', 7, 7, 8),
        title: 'Chosen because he loved you',
        group: 'Grace in the Old Testament',
        note: {
          text:
            'Moses denies that Israel was chosen for its size or strength; the only reason given is that the LORD loved them and kept his oath. Election grounded in God’s love rather than the recipients’ worth is grace in all but name.',
          provenance: synthesis(cite('bsb', 'Deut 7:6–9')),
        },
        tags: ['election', 'love', 'unmerited', 'old testament'],
      },
      {
        id: 'grace:kp:ps-103-8',
        ref: p('PSA', 103, 8, 14),
        title: 'He does not treat us as our sins deserve',
        group: 'Grace in the Old Testament',
        note: {
          text:
            'David sings the Exodus 34 confession (103:8) and draws out its meaning: God has not repaid us according to our iniquities, has removed our transgressions as far as east from west, and pities us as a father pities his children, remembering that we are dust.',
          provenance: synthesis(cite('bsb', 'Ps 103:8–14')),
        },
        tags: ['forgiveness', 'hesed', 'compassion', 'old testament'],
      },
      {
        id: 'grace:kp:jonah-4-2',
        ref: p('JON', 4, 2),
        title: 'Angry at grace',
        group: 'Grace in the Old Testament',
        note: {
          text:
            'Jonah quotes the same confession—gracious, compassionate, abounding in loving devotion—as his complaint: he fled because he knew God would spare Nineveh. Grace offends when it reaches people we think undeserving, a theme Jesus presses in the parable of the elder brother (Luke 15:25–32).',
          provenance: synthesis(cite('bsb', 'Jonah 4:2'), cite('bsb', 'Luke 15:25–32')),
        },
        tags: ['gracious', 'hesed', 'resentment', 'old testament'],
      },

      /* Grace revealed in Christ */
      {
        id: 'grace:kp:john-1-14',
        ref: p('JHN', 1, 14, 17),
        title: 'Full of grace and truth',
        group: 'Grace revealed in Christ',
        note: {
          text:
            'The Word made flesh is full of grace and truth, and from his fullness we receive grace upon grace. John contrasts the law given through Moses with grace and truth that came through Jesus Christ—not setting the law aside as evil, but naming Christ as the fullest revelation of God’s favour.',
          provenance: synthesis(cite('bsb', 'John 1:14–17'), cite('stepbible-tagnt', 'John 1:16–17 χάρις')),
        },
        tags: ['incarnation', 'charis', 'law and grace'],
      },
      {
        id: 'grace:kp:2-cor-8-9',
        ref: p('2CO', 8, 9),
        title: 'He became poor for your sake',
        group: 'Grace revealed in Christ',
        note: {
          text:
            'Paul defines the grace of our Lord Jesus Christ as a costly exchange: though rich, he became poor so that we might become rich. Grace here is not an abstract attitude but a self-giving act.',
          provenance: synthesis(cite('bsb', '2 Cor 8:9')),
        },
        tags: ['incarnation', 'generosity', 'exchange'],
      },
      {
        id: 'grace:kp:luke-15',
        ref: p('LUK', 15, 11, 32),
        title: 'The father and his two sons',
        group: 'Grace revealed in Christ',
        note: {
          text:
            'Told to Pharisees who grumbled that Jesus welcomed sinners (15:1–2). The father runs to the returning younger son and also goes out to plead with the resentful older son. Grace meets both the openly rebellious and the dutiful who think they have earned their place.',
          provenance: synthesis(cite('bsb', 'Luke 15:1–2, 11–32')),
        },
        tags: ['parable', 'prodigal', 'welcome', 'self-righteousness'],
      },
      {
        id: 'grace:kp:matt-20',
        ref: p('MAT', 20, 1, 16),
        title: 'The generous landowner',
        group: 'Grace revealed in Christ',
        note: {
          text:
            'Workers hired at the last hour receive the same wage as those who worked all day. The landowner’s answer—am I not allowed to be generous with what is mine?—exposes the instinct to measure God’s gifts by our work.',
          provenance: synthesis(cite('bsb', 'Matt 20:1–16')),
        },
        tags: ['parable', 'generosity', 'wages', 'kingdom'],
      },

      /* Saved by grace */
      {
        id: 'grace:kp:eph-2-1',
        ref: p('EPH', 2, 1, 10),
        title: 'By grace you have been saved',
        group: 'Saved by grace',
        note: {
          text:
            'The anchor passage of this study. Paul moves from spiritual death (2:1–3) to God’s intervention (2:4–7), sums up salvation as by grace, through faith, God’s gift and not by works (2:8–9), and ends with the new life of good works God has prepared (2:10).',
          provenance: synthesis(cite('bsb', 'Eph 2:1–10'), cite('tyndale-open-study-notes', 'on Eph 2:1–10')),
        },
        tags: ['salvation', 'faith', 'works', 'anchor'],
      },
      {
        id: 'grace:kp:rom-3-21',
        ref: p('ROM', 3, 21, 26),
        title: 'Justified freely by his grace',
        group: 'Saved by grace',
        note: {
          text:
            'Because all have sinned (3:23), righteousness from God must come apart from the law, through faith in Jesus Christ. Believers are justified as a gift (dōrean) by his grace through the redemption in Christ, whom God presented as an atoning sacrifice.',
          provenance: synthesis(cite('bsb', 'Rom 3:21–26'), cite('stepbible-tagnt', 'Rom 3:24 δωρεὰν, χάριτι')),
        },
        tags: ['justification', 'atonement', 'dorean'],
      },
      {
        id: 'grace:kp:rom-5-15',
        ref: p('ROM', 5, 15, 21),
        title: 'Where sin increased, grace increased all the more',
        group: 'Saved by grace',
        note: {
          text:
            'Paul contrasts Adam’s trespass with Christ’s gift: the gift is not like the trespass. Grace does not merely match sin; it overflows it, so that grace reigns through righteousness to eternal life.',
          provenance: synthesis(cite('bsb', 'Rom 5:15–21')),
        },
        tags: ['adam and christ', 'gift', 'abundance'],
      },
      {
        id: 'grace:kp:rom-11-5',
        ref: p('ROM', 11, 5, 6),
        title: 'Otherwise grace would no longer be grace',
        group: 'Saved by grace',
        note: {
          text:
            'A remnant is chosen by grace, and Paul draws the logical line: if it is by grace, it is no longer by works. Mixing the two would empty grace of its meaning.',
          provenance: synthesis(cite('bsb', 'Rom 11:5–6')),
        },
        tags: ['election', 'works', 'logic of grace'],
      },
      {
        id: 'grace:kp:gal-2-21',
        ref: p('GAL', 2, 21),
        title: 'I do not set aside the grace of God',
        group: 'Saved by grace',
        note: {
          text:
            'If righteousness came through the law, Christ died for nothing (dōrean, the same word that means “as a gift” in Rom 3:24). Paul refuses any path to righteousness that would make the cross unnecessary.',
          provenance: synthesis(cite('bsb', 'Gal 2:21'), cite('stepbible-tbesg', 'G1432 δωρεάν')),
        },
        tags: ['law', 'cross', 'dorean'],
      },
      {
        id: 'grace:kp:titus-3-4',
        ref: p('TIT', 3, 4, 7),
        title: 'Not by righteous deeds, but by his mercy',
        group: 'Saved by grace',
        note: {
          text:
            'A close parallel to Ephesians 2: God’s kindness and love appeared, he saved us not because of our righteous deeds but according to his mercy, through the washing of new birth and renewal by the Holy Spirit, so that, justified by his grace, we become heirs.',
          provenance: synthesis(cite('bsb', 'Titus 3:4–7')),
        },
        tags: ['new birth', 'holy spirit', 'mercy', 'justification'],
      },

      /* Living by grace */
      {
        id: 'grace:kp:rom-6-1',
        ref: p('ROM', 6, 1, 14),
        title: 'Shall we sin so that grace may increase?',
        group: 'Living by grace',
        note: {
          text:
            'Paul anticipates the abuse of grace and rejects it: believers died to sin with Christ in baptism and now walk in newness of life. Sin will not be master, precisely because they are under grace, not under law (6:14).',
          provenance: synthesis(cite('bsb', 'Rom 6:1–14')),
        },
        tags: ['sanctification', 'license', 'baptism', 'new life'],
      },
      {
        id: 'grace:kp:titus-2-11',
        ref: p('TIT', 2, 11, 14),
        title: 'Grace that instructs',
        group: 'Living by grace',
        note: {
          text:
            'The grace of God that brings salvation also instructs believers to renounce ungodliness and live self-controlled, upright and godly lives while they await Christ’s appearing. Grace is a teacher as well as a gift, forming a people zealous for good deeds.',
          provenance: synthesis(cite('bsb', 'Titus 2:11–14')),
        },
        tags: ['sanctification', 'training', 'good works'],
      },
      {
        id: 'grace:kp:2-cor-12-9',
        ref: p('2CO', 12, 9, 10),
        title: 'My grace is sufficient for you',
        group: 'Living by grace',
        note: {
          text:
            'Denied relief from his thorn in the flesh, Paul receives a promise instead: Christ’s grace is enough, and his power is perfected in weakness. Grace is not only the start of the Christian life but its daily strength.',
          provenance: synthesis(cite('bsb', '2 Cor 12:9–10')),
        },
        tags: ['weakness', 'suffering', 'power'],
      },
      {
        id: 'grace:kp:heb-4-16',
        ref: p('HEB', 4, 16),
        title: 'The throne of grace',
        group: 'Living by grace',
        note: {
          text:
            'Because Jesus is a sympathetic high priest, believers may approach God’s throne—here called the throne of grace—with confidence, to receive mercy and find grace for help in time of need.',
          provenance: synthesis(cite('bsb', 'Heb 4:14–16')),
        },
        tags: ['prayer', 'access', 'mercy'],
      },
      {
        id: 'grace:kp:1-pet-4-10',
        ref: p('1PE', 4, 10),
        title: 'Stewards of God’s varied grace',
        group: 'Living by grace',
        note: {
          text:
            'Each believer has received a gift (charisma) and is to use it to serve others as a good steward of God’s manifold grace. Grace received becomes grace passed on.',
          provenance: synthesis(cite('bsb', '1 Pet 4:10'), cite('stepbible-tbesg', 'G5486 χάρισμα')),
        },
        tags: ['gifts', 'service', 'stewardship', 'charisma'],
      },
    ],
  },

  /* ---------------- Summary & opening ---------------- */
  summary: {
    text:
      'This study follows one of the Bible’s richest words—grace—from the Old Testament’s language of favour and steadfast love to its fullest expression in Jesus Christ. ' +
      'It is anchored in Ephesians 2:1–10, where Paul moves from humanity’s plight, through the turning point “But God”, to a salvation that comes by grace, through faith, as God’s gift rather than a wage. ' +
      'Along the way it examines the key Hebrew and Greek words, explains what charis meant in a world of patrons and benefactors, and shows how grace produces a new way of life (2:10). ' +
      'It also sets out, as fairly as possible, where Christian traditions agree about grace and where they have long differed.',
    provenance: synthesis(
      cite('bsb', 'Eph 2:1–10'),
      cite('tyndale-open-study-notes', 'Ephesians introduction'),
      cite('stepbible-tbesg', 'G5485'),
    ),
  },
  opening: {
    text:
      'Grace sits at the heart of the Christian faith, and few passages say it more clearly than Ephesians 2:1–10—I’ve opened it beside us, with the key words marked. ' +
      'I’ve also gathered the Old Testament background, the Greek behind “grace”, what the first readers would have heard, and voices from Augustine to Tim Keller. ' +
      'Would you like to start with what the word means, with Paul’s argument in these verses, or with how grace changes a life?',
    provenance: synthesis(cite('bsb', 'Eph 2:1–10')),
  },

  /* ---------------- Key words ---------------- */
  keyWords: [
    {
      id: 'grace:kw:charis',
      strong: 'G5485',
      language: 'greek',
      lemma: 'χάρις',
      transliteration: 'charis',
      pronunciation: 'KHAR-ees',
      english: 'grace',
      anchors: [
        { verse: e2(5), phrases: { BSB: 'grace', KJV: 'grace', WEB: 'grace' } },
        { verse: e2(7), phrases: { BSB: 'grace', KJV: 'grace', WEB: 'grace' } },
        { verse: e2(8), phrases: { BSB: 'grace', KJV: 'grace', WEB: 'grace' } },
      ],
      grammar: 'Noun, dative singular feminine (χάριτι, “by grace”) in 2:5 and 2:8; genitive singular (χάριτος) in 2:7',
      basicMeaning: 'grace; favour, kindness, goodwill',
      semanticRange: [
        'favour or goodwill on the part of a giver—in the New Testament especially God’s free favour',
        'a gift or concrete proof of favour',
        'thanks, gratitude (the receiver’s response)',
        'graciousness, charm (e.g. of speech)',
        'a state of grace in which believers stand',
      ],
      notableOccurrences: [
        { ref: p('JHN', 1, 16, 17), note: 'Grace upon grace from Christ’s fullness; grace and truth came through Jesus Christ.' },
        { ref: p('ROM', 3, 24), note: 'Justified freely (dōrean) by his grace (charis)—the closest parallel to Eph 2:8.' },
        { ref: p('ROM', 4, 4), note: 'Wages are credited as an obligation, not as a gift (kata charin): grace is the opposite of debt.' },
        { ref: p('ROM', 11, 6), note: 'If by grace, then no longer by works—otherwise grace would not be grace.' },
        { ref: p('ROM', 5, 2), note: 'Believers have access into “this grace in which we stand”: grace as a settled state.' },
        { ref: p('2CO', 9, 15), note: 'Charis meaning “thanks”: thanks be to God for his indescribable gift.' },
        { ref: p('2CO', 12, 9), note: 'Christ’s grace is sufficient; his power is perfected in weakness.' },
      ],
      significance: {
        text:
          'Charis occurs 155 times in the NA28 Greek New Testament (156 in the app’s concordance, which also counts Rom 16:24, a verse printed in the Textus Receptus and the Byzantine text but not in NA28), 12 of them in Ephesians and three in this passage (2:5, 7, 8). ' +
          'Here it names God’s favour as the sole source of rescue: the dead cannot contribute to their own resurrection (2:5), the riches of that favour will be displayed for ages to come (2:7), and it excludes every ground of boasting (2:8–9). ' +
          'In Paul’s world the same word could also name the gift and the thanks it called for (see Historical Context), and Paul himself moves straight from grace to the good works of 2:10—but that link comes from his argument, not from the word’s other senses.',
        provenance: synthesis(
          cite('stepbible-tagnt', 'G5485 in NA28: 155 words (Eph 1:2, 6, 7; 2:5, 7, 8; 3:2, 7, 8; 4:7, 29; 6:24); Rom 16:24 TR/Byz only'),
          cite('stepbible-tbesg', 'G5485 χάρις'),
          cite('bsb', 'Eph 2:5–10'),
        ),
      },
      caution:
        'Charis is not a technical term with one fixed meaning: in Luke 17:9 it means “thanks”, and in Col 4:6 it describes gracious speech. Its force in Ephesians 2 comes from Paul’s argument (grace set against works, 2:8–9), not from the word alone.',
      provenance: lexical(cite('stepbible-tbesg', 'G5485 χάρις'), cite('stepbible-tagnt', 'Eph 2:5, 2:7, 2:8')),
    },
    {
      id: 'grace:kw:eleos',
      strong: 'G1656',
      language: 'greek',
      lemma: 'ἔλεος',
      transliteration: 'eleos',
      pronunciation: 'EL-eh-os',
      english: 'mercy',
      anchors: [{ verse: e2(4), phrases: { BSB: 'mercy', KJV: 'mercy', WEB: 'mercy' } }],
      grammar: 'Noun, dative singular neuter (ἐλέει) after ἐν: “rich in mercy” (2:4)',
      basicMeaning: 'mercy, pity, compassion',
      semanticRange: [
        'mercy shown by people to others (Matt 9:13; Luke 10:37)',
        'God’s mercy toward the needy and undeserving',
        'the mercy of Christ (Jude 21)',
        'mercy invoked in greetings and blessings (1 Tim 1:2; 2 John 3)',
      ],
      notableOccurrences: [
        { ref: p('TIT', 3, 5), note: 'He saved us not by our righteous deeds but according to his mercy—a close parallel to Eph 2:4–9.' },
        { ref: p('MAT', 9, 13), note: 'Jesus quotes Hos 6:6 (“I desire mercy”); the Hebrew there is hesed, the Greek eleos.' },
        { ref: p('ROM', 9, 23), note: 'The “vessels of mercy” whom God prepared in advance for glory.' },
        { ref: p('LUK', 1, 50), note: 'Mary’s song: his mercy extends from generation to generation to those who fear him.' },
        { ref: p('HEB', 4, 16), note: 'At the throne of grace we receive mercy and find grace.' },
      ],
      significance: {
        text:
          'Paul roots God’s rescue in two things about God himself: he is rich in mercy, and he acts because of his great love (2:4). ' +
          'Mercy looks at the misery of 2:1–3; grace looks at the unearned gift of 2:5–8. ' +
          'In the Greek Old Testament eleos chiefly translates hesed, so “rich in mercy” stands in Israel’s long confession of a God abounding in steadfast love (Exod 34:6). Eleos occurs 27 times in NA28.',
        provenance: synthesis(
          cite('stepbible-tbesg', 'G1656 ἔλεος (“in LXX chiefly for חֶסֶד”)'),
          cite('stepbible-tagnt', 'Eph 2:4; G1656 in NA28: 27 words'),
          cite('bsb', 'Eph 2:1–8'),
        ),
      },
      caution:
        'The neat distinction “mercy withholds what we deserve, grace gives what we don’t” is a helpful summary, but biblical writers often use the words together (Titus 3:5–7; Heb 4:16) without drawing a sharp line.',
      provenance: lexical(cite('stepbible-tbesg', 'G1656 ἔλεος'), cite('stepbible-tagnt', 'Eph 2:4')),
    },
    {
      id: 'grace:kw:sozo',
      strong: 'G4982',
      language: 'greek',
      lemma: 'σῴζω',
      transliteration: 'sōzō',
      pronunciation: 'SOHD-zoh',
      english: 'saved',
      anchors: [
        { verse: e2(5), phrases: { BSB: 'you have been saved', KJV: 'ye are saved', WEB: 'you have been saved' } },
        { verse: e2(8), phrases: { BSB: 'you have been saved', KJV: 'are ye saved', WEB: 'you have been saved' } },
      ],
      grammar:
        'Perfect passive participle, nominative plural masculine (σεσῳσμένοι) with ἐστε (present, “you are”): a periphrastic perfect—“you are people who have been saved” (2:5, 2:8)',
      basicMeaning: 'to save, rescue, deliver; to heal',
      semanticRange: [
        'rescue from danger, injury or death (Matt 8:25)',
        'heal, restore to health (Mark 5:34)',
        'save from sin and its consequences—spoken of as past, present or future',
      ],
      notableOccurrences: [
        { ref: p('ROM', 8, 24), note: 'Aorist: “in this hope we were saved.”' },
        { ref: p('1CO', 1, 18), note: 'Present: “to us who are being saved” the message of the cross is God’s power.' },
        { ref: p('ROM', 5, 9, 10), note: 'Future: “how much more shall we be saved” from wrath and through his life.' },
        { ref: p('LUK', 7, 50), note: 'Perfect indicative: “Your faith has saved you”—faith linked to a completed rescue.' },
        { ref: p('TIT', 3, 5), note: 'Aorist: “He saved us … according to his mercy.”' },
      ],
      significance: {
        text:
          'Sōzō occurs 106 times in NA28 (107 in the app’s concordance, which also counts Matt 18:11, a verse found only in the Textus Receptus and the Byzantine text), but the perfect participle σεσῳσμένοι appears only here, in 2:5 and 2:8 (TAGNT). ' +
          'The perfect presents salvation as a completed act with lasting results: those who were dead are now, and remain, rescued people. ' +
          'Elsewhere Paul speaks of salvation as past, ongoing and still to come (Rom 8:24; 1 Cor 1:18; Rom 5:9–10); Ephesians stresses its settled present reality, which is why Paul can say believers are already raised and seated with Christ (2:6).',
        provenance: synthesis(
          cite('stepbible-tagnt', 'G4982 in NA28: 106 words; Matt 18:11 TR/Byz only; perfect forms: Eph 2:5, 2:8 (V-RPP-NPM), Gospels σέσωκεν ×7, Acts 4:9'),
          cite('stepbible-tbesg', 'G4982 σῴζω (past, present, future salvation)'),
          cite('bsb', 'Eph 2:5–8'),
        ),
      },
      caution:
        'The perfect tense describes the readers’ present standing as Paul sees it; it does not by itself settle later debates about assurance or perseverance, which draw on many other texts.',
      provenance: lexical(cite('stepbible-tbesg', 'G4982 σῴζω'), cite('stepbible-tagnt', 'Eph 2:5, 2:8')),
    },
    {
      id: 'grace:kw:pistis',
      strong: 'G4102',
      language: 'greek',
      lemma: 'πίστις',
      transliteration: 'pistis',
      pronunciation: 'PIS-tis',
      english: 'faith',
      anchors: [{ verse: e2(8), phrases: { BSB: 'faith', KJV: 'faith', WEB: 'faith' } }],
      grammar: 'Noun, genitive singular feminine (πίστεως) after διά: “through faith” (2:8)',
      basicMeaning: 'faith, belief, trust, confidence',
      semanticRange: [
        'faith, trust, confidence (in the New Testament, in God or Christ)',
        'belief, conviction',
        'faithfulness, fidelity (Rom 3:3; Gal 5:22)',
        'a pledge of fidelity (1 Tim 5:12)',
      ],
      notableOccurrences: [
        { ref: p('ROM', 3, 22), note: 'Righteousness from God comes through faith in Jesus Christ to all who believe.' },
        { ref: p('ROM', 5, 1, 2), note: 'Justified through faith, we have access by faith into this grace.' },
        { ref: p('GAL', 2, 20), note: 'The life I live, I live by faith in the Son of God who loved me.' },
        { ref: p('HEB', 11, 1), note: 'Faith as the assurance of what we hope for.' },
        { ref: p('JAS', 2, 14, 26), note: 'Faith without deeds is dead—James’s challenge to a merely verbal faith.' },
      ],
      significance: {
        text:
          'Paul says we are saved by grace (a plain dative: grace is what saves) through faith (διά with the genitive: the channel through which it is received), and he uses ἐκ, “from”, only to deny other sources—“not from yourselves … not from works” (2:8–9). ' +
          'Faith receives rather than earns, which is why it fits with “not by works” in 2:9 and why boasting is excluded. ' +
          'Pistis occurs 243 times in NA28—40 in Romans, 22 in Galatians, 16 in James—so the relation between faith and works is a conversation across the New Testament, not a single verse.',
        provenance: synthesis(
          cite('stepbible-tagnt', 'Eph 2:8 χάριτι (N-DSF), διὰ πίστεως, οὐκ ἐξ ὑμῶν; 2:9 οὐκ ἐξ ἔργων; G4102 in NA28: 243 words'),
          cite('stepbible-tbesg', 'G4102 πίστις'),
          cite('bsb', 'Eph 2:8–9'),
        ),
      },
      caution:
        'Scholars debate whether Paul’s phrase pistis Christou means faith in Christ or Christ’s own faithfulness (e.g. Rom 3:22); Eph 2:8 has no such phrase and simply names the believer’s trust.',
      provenance: lexical(cite('stepbible-tbesg', 'G4102G πίστις'), cite('stepbible-tagnt', 'Eph 2:8')),
    },
    {
      id: 'grace:kw:doron',
      strong: 'G1435',
      language: 'greek',
      lemma: 'δῶρον',
      transliteration: 'dōron',
      pronunciation: 'DOH-ron',
      english: 'gift',
      anchors: [{ verse: e2(8), phrases: { BSB: 'gift', KJV: 'gift', WEB: 'gift' } }],
      grammar: 'Noun, nominative singular neuter (δῶρον) in 2:8, in the phrase θεοῦ τὸ δῶρον (“of God [is] the gift”), with θεοῦ placed first for emphasis',
      basicMeaning: 'gift, present',
      semanticRange: [
        'a gift or present (Matt 2:11)',
        'an offering brought to God (Matt 5:23–24; Heb 5:1)',
        'God’s gift to people (Eph 2:8)',
      ],
      notableOccurrences: [
        { ref: p('MAT', 2, 11), note: 'The Magi’s gifts of gold, frankincense and myrrh.' },
        { ref: p('MAT', 5, 23, 24), note: 'A gift offered at the altar—dōron’s usual sense of an offering to God.' },
        { ref: p('HEB', 5, 1), note: 'The high priest offers “gifts and sacrifices” for sins.' },
        { ref: p('LUK', 21, 1, 4), note: 'The rich put their gifts (dōra) into the temple treasury—offerings to God, beside the widow’s two small coins.' },
      ],
      significance: {
        text:
          'Of dōron’s 19 occurrences in NA28, most describe offerings people bring to God; Eph 2:8 turns this around and makes God the giver. ' +
          'Paul’s different word charisma (from charis) makes a similar point in Rom 6:23: the free gift of God is eternal life. ' +
          '“This” (τοῦτο) in 2:8 is neuter and does not match the feminine nouns grace or faith, so many interpreters take it to refer to the whole event—being saved by grace through faith—as God’s gift rather than our achievement.',
        provenance: synthesis(
          cite('stepbible-tagnt', 'Eph 2:8 τοῦτο (D-NSN), χάριτι (N-DSF), πίστεως (N-GSF), δῶρον (N-NSN); G1435 in NA28: 19 words; Rom 6:23 χάρισμα (G5486)'),
          cite('stepbible-tbesg', 'G1435 δῶρον; G5486 χάρισμα'),
          cite('bsb', 'Luke 21:1–4; Rom 6:23'),
        ),
      },
      caution:
        'Whether “this” refers specifically to faith has been debated since the early church: Chrysostom and Augustine included faith in the gift, while Calvin read the gift as salvation itself. The grammar allows a reference to the whole.',
      provenance: lexical(cite('stepbible-tbesg', 'G1435 δῶρον'), cite('stepbible-tagnt', 'Eph 2:8')),
    },
    {
      id: 'grace:kw:poiema',
      strong: 'G4161',
      language: 'greek',
      lemma: 'ποίημα',
      transliteration: 'poiēma',
      pronunciation: 'POY-ay-mah',
      english: 'workmanship',
      anchors: [{ verse: e2(10), phrases: { BSB: 'workmanship', KJV: 'workmanship', WEB: 'workmanship' } }],
      grammar: 'Noun, nominative singular neuter (ποίημα), predicate of ἐσμεν—“we are [his] workmanship”—with αὐτοῦ (“his”) placed first for emphasis (2:10)',
      basicMeaning: 'that which is made or done, a work',
      semanticRange: ['a thing made, a work', 'God’s works in creation (Rom 1:20)', 'God’s new creation in Christ (Eph 2:10)'],
      notableOccurrences: [
        { ref: p('ROM', 1, 20), note: 'The only other New Testament use: God’s power is understood from “his workmanship” in creation.' },
      ],
      significance: {
        text:
          'Poiēma appears only twice in the New Testament: of creation in Rom 1:20 and of believers here. ' +
          'The pairing is suggestive—the God who made the world has made a new people, “created in Christ Jesus” (2:10), echoing Paul’s new-creation language (2 Cor 5:17). ' +
          'Good works are not the raw material of salvation but the purpose of God’s new workmanship. In the Greek Old Testament poiēma chiefly translates ma‘aseh, “work, deed”.',
        provenance: synthesis(
          cite('stepbible-tbesg', 'G4161 ποίημα (Rom 1:20; Eph 2:10; “in LXX chiefly for מַעֲשֶׂה”)'),
          cite('stepbible-tagnt', 'G4161 in NA28: 2 words'),
          cite('bsb', 'Eph 2:10; Rom 1:20; 2 Cor 5:17'),
        ),
      },
      caution:
        'Popular teaching sometimes renders poiēma “masterpiece” or “poem”. The lexicon’s sense is simply “that which is made, a work”; the dignity of the idea comes from the Maker and his purpose, not from the word itself.',
      provenance: lexical(cite('stepbible-tbesg', 'G4161 ποίημα'), cite('stepbible-tagnt', 'Eph 2:10')),
    },
    {
      id: 'grace:kw:dorean',
      strong: 'G1432',
      language: 'greek',
      lemma: 'δωρεάν',
      transliteration: 'dōrean',
      pronunciation: 'doh-reh-AHN',
      english: 'freely, as a gift',
      anchors: [],
      grammar: 'Adverb—the accusative of δωρεά (“gift”) used adverbially: “freely, as a gift” (Rom 3:24)',
      basicMeaning: 'freely, as a gift; in vain, for nothing',
      semanticRange: [
        'freely, without payment (Matt 10:8; Rev 22:17)',
        'as a gift, gratuitously (Rom 3:24)',
        'without cause (John 15:25)',
        'in vain, for nothing (Gal 2:21)',
      ],
      notableOccurrences: [
        { ref: p('ROM', 3, 24), note: 'Justified freely (dōrean) by his grace.' },
        { ref: p('GAL', 2, 21), note: 'If righteousness came through the law, Christ died for nothing (dōrean).' },
        { ref: p('MAT', 10, 8), note: 'Freely you have received; freely give.' },
        { ref: p('REV', 22, 17), note: 'Let the thirsty take the water of life freely.' },
        { ref: p('JHN', 15, 25), note: '“They hated me without reason”—the same adverb meaning “without cause”.' },
      ],
      significance: {
        text:
          'Dōrean does not occur in Ephesians 2, but it stands behind “justified freely by his grace” in Rom 3:24, the closest parallel to Eph 2:8. It appears nine times in NA28. ' +
          'Paul uses the same word in Gal 2:21 in its other sense: if righteousness came through the law, Christ died “for nothing”. Either grace is free, or the cross was pointless.',
        provenance: synthesis(
          cite('stepbible-tbesg', 'G1432 δωρεάν'),
          cite('stepbible-tagnt', 'Rom 3:24; Gal 2:21; G1432 in NA28: 9 words'),
          cite('bsb', 'Rom 3:24; Gal 2:21'),
        ),
      },
      caution:
        'The two senses (“as a gift” and “for nothing”) are different uses of one word, not a hidden double meaning in every text; context decides.',
      provenance: lexical(cite('stepbible-tbesg', 'G1432 δωρεάν'), cite('stepbible-tagnt', 'Rom 3:24')),
    },
    {
      id: 'grace:kw:chen',
      strong: 'H2580',
      language: 'hebrew',
      lemma: 'חֵן',
      transliteration: 'chen',
      pronunciation: 'khen',
      english: 'favor, grace',
      anchors: [],
      grammar: 'Noun, masculine singular absolute (Gen 6:8), in the idiom “find favor in the eyes of”',
      basicMeaning: 'favour, grace, charm',
      semanticRange: [
        'favour, acceptance in someone’s eyes (Gen 6:8; Exod 33:12–17)',
        'grace given by God (Prov 3:34; Zech 12:10)',
        'charm, elegance (Prov 31:30)',
      ],
      notableOccurrences: [
        { ref: p('GEN', 6, 8), note: 'First occurrence: Noah found favor in the eyes of the LORD.' },
        { ref: p('EXO', 33, 12, 17), note: 'Moses pleads on the basis of having found favor; chen occurs five times in Exodus 33.' },
        { ref: p('PRO', 3, 34), note: 'He gives grace to the humble—quoted in Jas 4:6 and 1 Pet 5:5 with charis.' },
        { ref: p('ZEC', 4, 7), note: 'The capstone brought out with shouts of “Grace, grace to it!”' },
        { ref: p('ZEC', 12, 10), note: 'God will pour out a spirit of grace and supplication on Jerusalem.' },
      ],
      significance: {
        text:
          'Chen occurs 69 times in the Hebrew Bible (TAHOT), 14 of them in Genesis and 13 in Proverbs, most often in the phrase “find favor in the eyes of”. ' +
          'Its first appearance is Gen 6:8, where the LORD’s favour toward Noah is mentioned before his righteousness (6:9). ' +
          'In the Greek Old Testament charis chiefly translates chen—one bridge between Israel’s vocabulary and Paul’s.',
        provenance: synthesis(
          cite('stepbible-tahot', 'H2580 חֵן: 69 words in 67 verses'),
          cite('stepbible-tbesg', 'G5485 χάρις (“in LXX chiefly for חֵן”)'),
          cite('bsb', 'Gen 6:8–9'),
        ),
      },
      caution:
        'Many uses of chen describe ordinary social favour (Gen 39:4) or charm (Prov 31:30); not every occurrence carries the theological weight of Paul’s charis.',
      provenance: lexical(cite('stepbible-tbesh', 'H2580 חֵן'), cite('stepbible-tahot', 'Gen 6:8')),
    },
    {
      id: 'grace:kw:hesed',
      strong: 'H2617A',
      language: 'hebrew',
      lemma: 'חֶסֶד',
      transliteration: 'chesed',
      pronunciation: 'KHEH-sed',
      english: 'loving devotion, steadfast love',
      anchors: [],
      grammar: 'Noun, masculine singular absolute in Exod 34:6: “abounding in loving devotion” (rav-chesed)',
      basicMeaning: 'goodness, kindness, faithfulness',
      semanticRange: [
        'kindness, goodness',
        'loyal love, faithfulness within a relationship or covenant',
        'mercy toward the undeserving (Ps 51:1; Lam 3:22)',
      ],
      notableOccurrences: [
        { ref: p('EXO', 34, 6, 7), note: 'Abounding in loving devotion, maintaining it to thousands, forgiving iniquity.' },
        { ref: p('DEU', 7, 9), note: 'The faithful God keeps his covenant of loving devotion.' },
        { ref: p('PSA', 136, 1), note: 'The refrain “his loving devotion endures forever”—hesed occurs 26 times in this psalm.' },
        { ref: p('LAM', 3, 22, 23), note: 'Because of the LORD’s loving devotion we are not consumed; his mercies are new every morning.' },
        { ref: p('HOS', 6, 6), note: '“I desire mercy, not sacrifice”—quoted by Jesus in Matt 9:13 with eleos.' },
        { ref: p('MIC', 6, 8), note: 'Act justly, love mercy (hesed), walk humbly with your God.' },
      ],
      significance: {
        text:
          'Hesed occurs about 245 times in the Hebrew Bible (TAHOT), 127 of them in the Psalms, and describes God’s committed, loyal love—above all within his covenant with Israel. ' +
          'It is not simply the Hebrew word for charis (the Greek Old Testament usually renders it eleos, “mercy”), but it supplies much of what Paul means when he calls God rich in mercy and speaks of his great love (Eph 2:4): a love that keeps faith with the unfaithful.',
        provenance: synthesis(
          cite('stepbible-tahot', 'H2617A חֶסֶד: 245 words (Psalms 127)'),
          cite('stepbible-tbesg', 'G1656 ἔλεος (“in LXX chiefly for חֶסֶד”)'),
          cite('bsb', 'Exod 34:6–7; Eph 2:4'),
        ),
      },
      caution:
        'English versions render hesed as steadfast love, lovingkindness, loving devotion or mercy. No single English word captures it, and it should be flattened neither into “grace” nor into mere “loyalty”.',
      provenance: lexical(cite('stepbible-tbesh', 'H2617A חֶסֶד'), cite('stepbible-tahot', 'Exod 34:6–7')),
    },
    {
      id: 'grace:kw:chanan',
      strong: 'H2603A',
      language: 'hebrew',
      lemma: 'חָנַן',
      transliteration: 'chanan',
      pronunciation: 'khah-NAHN',
      english: 'be gracious',
      anchors: [],
      grammar: 'Verb, Qal imperative masculine singular with 1st-person suffix in Ps 51:1 (chonneni, “be gracious to me”, BSB “have mercy on me”)',
      basicMeaning: 'to be gracious, show favour, pity',
      semanticRange: [
        'to show favour, be gracious (Qal)',
        'to be pitied, shown favour (Niphal, Hophal)',
        'to seek or implore favour (Hithpael)',
      ],
      notableOccurrences: [
        { ref: p('NUM', 6, 25), note: 'The priestly blessing: may the LORD make his face shine on you and be gracious to you.' },
        { ref: p('PSA', 51, 1), note: 'David’s plea after his sin: be gracious to me, O God, according to your hesed.' },
        {
          ref: p('EXO', 33, 19),
          note: '“I will be gracious (chanan) to whom I will be gracious” (BSB “I will have mercy on whom I have mercy”)—quoted by Paul in Rom 9:15, where the Greek renders chanan with eleeō, “have mercy”.',
        },
        { ref: p('ISA', 30, 18), note: 'The LORD longs to be gracious (chanan) to you and rises to show you compassion.' },
      ],
      significance: {
        text:
          'Chanan (77 times in TAHOT) is the verb of the priestly blessing (Num 6:25) and of the penitent’s cry (Ps 51:1). ' +
          'Its adjective channun, “gracious”, occurs 13 times and is used almost exclusively of God, often in the creed-like formula of Exod 34:6 that echoes through Ps 103:8 and Jonah 4:2. ' +
          'In Exod 33:19 God declares that he will be gracious to whom he will be gracious (BSB “have mercy”); Paul quotes it in Rom 9:15–16 to show that mercy depends on God, not on human desire or effort.',
        provenance: synthesis(
          cite('stepbible-tahot', 'H2603A חָנַן: 77 words (Exod 33:19 ×2; Isa 30:18); H2587 חַנּוּן: 13 words (Ps 103:8)'),
          cite('stepbible-tbesh', 'H2603A, H2587'),
          cite('stepbible-tagnt', 'Rom 9:15 ἐλεήσω, ἐλεῶ (G1653)'),
          cite('stepbible-tbesg', 'G1653 ἐλεέω (“in LXX … chiefly for חָנַן”)'),
          cite('bsb', 'Num 6:25; Ps 51:1; Exod 33:19; Isa 30:18; Rom 9:15–16'),
        ),
      },
      caution:
        'Words from the same root (chen, chanan, channun) share a family resemblance, but each word’s meaning is set by its use in context, not by the root alone.',
      provenance: lexical(cite('stepbible-tbesh', 'H2603A חָנַן'), cite('stepbible-tahot', 'Ps 51:1 (51:3 Heb.)')),
    },
  ],

  /* ---------------- Cross-references ---------------- */
  crossReferences: [
    {
      id: 'grace:xr:rom-3-23',
      from: p('EPH', 2, 8, 9),
      target: p('ROM', 3, 23, 24),
      relationship: 'same-concept',
      title: 'Justified freely by his grace',
      explanation: {
        text:
          'Romans states in legal terms what Ephesians states in terms of rescue. All have sinned (compare Eph 2:1–3), and all who are put right with God are justified as a gift (dōrean) by his grace (charis). Both passages locate the cause entirely in God and the means in Christ’s redemption.',
        provenance: synthesis(cite('bsb', 'Rom 3:23–24'), cite('bsb', 'Eph 2:1–9'), cite('stepbible-tagnt', 'Rom 3:24')),
      },
      tags: ['justification', 'grace', 'gift', 'pauline'],
    },
    {
      id: 'grace:xr:rom-5-6',
      from: p('EPH', 2, 4, 5),
      target: p('ROM', 5, 6, 10),
      relationship: 'thematic',
      title: 'While we were still sinners—and enemies',
      explanation: {
        text:
          'Eph 2:5 says God made us alive “even when we were dead”; Rom 5 says Christ died for us while we were powerless, sinners and enemies. Both passages insist that God’s love acted before any change in us, which is exactly what makes it grace. Romans adds the forward look: having been reconciled, how much more shall we be saved.',
        provenance: synthesis(cite('bsb', 'Rom 5:6–10'), cite('bsb', 'Eph 2:4–5')),
      },
      tags: ['love', 'enemies', 'initiative', 'pauline'],
    },
    {
      id: 'grace:xr:col-2-13',
      from: p('EPH', 2, 1, 5),
      target: p('COL', 2, 13, 14),
      relationship: 'parallel',
      title: 'Dead in trespasses, made alive with Christ',
      explanation: {
        text:
          'The closest verbal parallel in the New Testament. Colossians too describes readers as dead in trespasses and made alive with Christ, using the same rare verb συζωοποιέω, found only in Eph 2:5 and Col 2:13. Colossians adds how: God forgave all our trespasses and cancelled the record of debt by nailing it to the cross.',
        provenance: synthesis(
          cite('bsb', 'Col 2:13–14'),
          cite('stepbible-tbesg', 'G4806 συζωοποιέω (Eph 2:5; Col 2:13)'),
          cite('tyndale-open-study-notes', 'on Eph 2:1–3'),
        ),
      },
      tags: ['made alive', 'forgiveness', 'union with christ', 'pauline'],
    },
    {
      id: 'grace:xr:titus-3-4',
      from: p('EPH', 2, 4, 9),
      target: p('TIT', 3, 4, 7),
      relationship: 'parallel',
      title: 'Kindness, mercy, not by works',
      explanation: {
        text:
          'Titus 3 runs on the same tracks as Ephesians 2: God’s kindness (χρηστότης, as in Eph 2:7) and love appeared; he saved us not by works of righteousness but according to his mercy (ἔλεος, as in Eph 2:4); and we are justified by his grace. Titus adds the Spirit’s work of new birth and renewal.',
        provenance: synthesis(
          cite('bsb', 'Titus 3:4–7'),
          cite('stepbible-tbesg', 'G5544 χρηστότης (Eph 2:7; Tit 3:4)'),
          cite('stepbible-tagnt', 'Tit 3:5 ἔλεος'),
        ),
      },
      tags: ['mercy', 'kindness', 'new birth', 'pauline'],
    },
    {
      id: 'grace:xr:gal-2-20',
      from: p('EPH', 2, 8, 9),
      target: p('GAL', 2, 20, 21),
      relationship: 'same-concept',
      title: 'I do not set aside the grace of God',
      explanation: {
        text:
          'Galatians makes the personal and polemical version of Eph 2:8–9. Paul lives by faith in the Son of God who loved him and gave himself for him, and he refuses to nullify grace: if righteousness came through the law, Christ died for nothing. Adding works as a ground of acceptance would empty both grace and the cross.',
        provenance: synthesis(cite('bsb', 'Gal 2:20–21'), cite('stepbible-tagnt', 'Gal 2:21 χάριν, δωρεάν')),
      },
      tags: ['faith', 'law', 'cross', 'pauline'],
    },
    {
      id: 'grace:xr:rom-11-6',
      from: p('EPH', 2, 8, 9),
      target: p('ROM', 11, 6),
      relationship: 'same-concept',
      title: 'Grace and works cannot be mixed',
      explanation: {
        text:
          'Rom 11:6 spells out the logic behind “not by works” in Eph 2:9: if something is by grace, it is no longer by works, or grace would no longer be grace. The contrast is not between God’s gift and human obedience in general, but between two incompatible grounds for being accepted.',
        provenance: synthesis(cite('bsb', 'Rom 11:5–6'), cite('stepbible-tbesg', 'G5485 (opposite to ἔργα, Rom 11:6)')),
      },
      tags: ['works', 'logic of grace', 'pauline'],
    },
    {
      id: 'grace:xr:rom-4-4',
      from: p('EPH', 2, 8, 9),
      target: p('ROM', 4, 4, 5),
      relationship: 'same-concept',
      title: 'Wages versus gift',
      explanation: {
        text:
          'Paul contrasts two economies. A worker’s wages are owed, not given as a gift; but God justifies the ungodly person who trusts him rather than working for it. Ephesians 2:8–9 lives in the same contrast—gift, not wage; faith, not works—which is why boasting is excluded (compare Rom 4:2).',
        provenance: synthesis(cite('bsb', 'Rom 4:2–5'), cite('stepbible-tbesg', 'G5485 (opposite to ὀφείλημα, Rom 4:4)')),
      },
      tags: ['wages', 'gift', 'boasting', 'pauline'],
    },
    {
      id: 'grace:xr:jas-2-14',
      from: p('EPH', 2, 8, 10),
      target: p('JAS', 2, 14, 26),
      relationship: 'contrast',
      title: 'Faith without deeds is dead',
      explanation: {
        text:
          'James seems at first to contradict Paul: a person is justified by what he does, not by faith alone (2:24). But James targets a faith that claims belief and produces nothing, while Paul rules out works as the ground of salvation. Eph 2:10 shows how they meet: the people God saves by grace are created for good works, so a faith that never walks in them is not the faith Paul means. Christians have not always found the two easy to reconcile and still weigh them differently, but most traditions today read them as complementary.',
        provenance: synthesis(cite('bsb', 'Jas 2:14–26'), cite('bsb', 'Eph 2:8–10'), cite('tyndale-open-study-notes', 'on Eph 2:10')),
      },
      tags: ['faith and works', 'james', 'good works'],
    },
    {
      id: 'grace:xr:ezek-36-26',
      from: p('EPH', 2, 4, 10),
      target: p('EZK', 36, 26, 27),
      relationship: 'thematic',
      title: 'A new heart and a new walk',
      explanation: {
        text:
          'Ezekiel promised that God would replace a heart of stone with a heart of flesh and put his Spirit within his people, causing them to walk in his statutes. Ephesians does not quote Ezekiel, but read side by side the two texts share a pattern: in 2:1–10 the dead are made alive (2:5) and re-created so that they walk in good works (2:10), reversing the old walk of 2:2. In both texts the initiative is God’s.',
        provenance: synthesis(cite('bsb', 'Ezek 36:25–27'), cite('bsb', 'Eph 2:2, 5, 10')),
      },
      tags: ['new heart', 'holy spirit', 'regeneration', 'divine initiative'],
    },
    {
      id: 'grace:xr:deut-7-7',
      from: p('EPH', 2, 4),
      target: p('DEU', 7, 7, 8),
      relationship: 'thematic',
      title: 'Loved because he loved you',
      explanation: {
        text:
          'Israel was not chosen for being numerous or impressive; the LORD set his love on them simply because he loved them and kept his oath. Paul’s “because of his great love” (Eph 2:4) stands in the same line: God’s love is its own reason, not a response to the worth of its objects.',
        provenance: synthesis(cite('bsb', 'Deut 7:6–8'), cite('bsb', 'Eph 2:4')),
      },
      tags: ['election', 'love', 'unmerited', 'old testament'],
    },
    {
      id: 'grace:xr:exod-34-6',
      from: p('EPH', 2, 4, 7),
      target: p('EXO', 34, 6, 7),
      relationship: 'thematic',
      title: 'Israel’s foundational confession of a gracious God',
      explanation: {
        text:
          'At Sinai, after Israel’s idolatry with the golden calf, God proclaimed his name: compassionate and gracious, slow to anger, abounding in hesed and faithfulness, forgiving iniquity. This self-revelation became Israel’s creed (Ps 103:8; Jonah 4:2). When Paul calls God rich in mercy and speaks of the riches of his grace and kindness (Eph 2:4, 7), he speaks as heir to that history.',
        provenance: synthesis(cite('bsb', 'Exod 34:6–7'), cite('bsb', 'Ps 103:8; Jonah 4:2'), cite('stepbible-tahot', 'Exod 34:6')),
      },
      tags: ['hesed', 'gracious', 'sinai', 'old testament'],
    },
    {
      id: 'grace:xr:john-1-16',
      from: p('EPH', 2, 7),
      target: p('JHN', 1, 16, 17),
      relationship: 'same-concept',
      title: 'Grace upon grace',
      explanation: {
        text:
          'Paul speaks of the surpassing riches of God’s grace shown in Christ Jesus (2:7); John says that from the fullness of the incarnate Word we have received grace upon grace, and that grace and truth came through Jesus Christ. Both writers make Christ himself the place where God’s grace is fully displayed.',
        provenance: synthesis(cite('bsb', 'John 1:14–17'), cite('bsb', 'Eph 2:7')),
      },
      tags: ['christ', 'abundance', 'incarnation'],
    },
    {
      id: 'grace:xr:2-cor-5-17',
      from: p('EPH', 2, 10),
      target: p('2CO', 5, 17, 18),
      relationship: 'same-concept',
      title: 'A new creation',
      explanation: {
        text:
          '“Created in Christ Jesus” (Eph 2:10) is new-creation language. In 2 Cor 5:17 anyone in Christ is a new creation—the old has gone, the new has come—and Paul adds that all this is from God. Salvation by grace is not a repair job we contribute to, but a creative act of God.',
        provenance: synthesis(cite('bsb', '2 Cor 5:17–18'), cite('bsb', 'Eph 2:10')),
      },
      tags: ['new creation', 'workmanship', 'pauline'],
    },
    {
      id: 'grace:xr:phil-1-6',
      from: p('EPH', 2, 10),
      target: p('PHP', 1, 6),
      relationship: 'thematic',
      title: 'He who began a good work will complete it',
      explanation: {
        text:
          'Believers are God’s workmanship (Eph 2:10), and Paul’s confidence in Phil 1:6 rests on the same logic: the God who began a good work in them will carry it on to completion. Grace starts and sustains the Christian life. (How this relates to perseverance is debated; see the note on sōzō.)',
        provenance: synthesis(cite('bsb', 'Phil 1:6'), cite('bsb', 'Eph 2:10')),
      },
      tags: ['workmanship', 'sustaining grace', 'pauline'],
    },
    {
      id: 'grace:xr:luke-18-9',
      from: p('EPH', 2, 8, 9),
      target: p('LUK', 18, 9, 14),
      relationship: 'thematic',
      title: 'The Pharisee and the tax collector',
      explanation: {
        text:
          'Jesus tells this parable to people who trusted in their own righteousness. The Pharisee lists his fasting and tithing; the tax collector only asks God for mercy—and he goes home justified. It is a narrative picture of Eph 2:9: salvation is not by works, so that no one can boast.',
        provenance: synthesis(cite('bsb', 'Luke 18:9–14'), cite('bsb', 'Eph 2:9')),
      },
      tags: ['boasting', 'humility', 'parable', 'justification'],
    },
    {
      id: 'grace:xr:rom-6-1',
      from: p('EPH', 2, 8, 10),
      target: p('ROM', 6, 1, 4),
      relationship: 'thematic',
      title: 'Grace is not a licence to sin',
      explanation: {
        text:
          'Free grace invites an objection: shall we go on sinning so that grace may increase? Paul answers that those united with Christ in his death and resurrection now walk in newness of life. Eph 2:10 makes the same point positively—grace re-creates people for good works—so grace and holiness belong together.',
        provenance: synthesis(cite('bsb', 'Rom 6:1–4, 14'), cite('bsb', 'Eph 2:10')),
      },
      tags: ['sanctification', 'license', 'new life', 'pauline'],
    },
  ],

  /* ---------------- Historical & cultural context ---------------- */
  context: [
    {
      id: 'grace:ctx:authorship',
      category: 'authorship',
      title: 'Who wrote Ephesians?',
      summary:
        'The letter names Paul as its author and was traditionally received as one of his Prison Letters. Many modern scholars, however, think it was written by a later disciple of Paul.',
      detail:
        'Doubts rest on differences in vocabulary, style, setting and theological emphasis compared with Paul’s undisputed letters; some propose a disciple writing in Paul’s name or a Pauline letter reworked by an editor. Others answer that the differences can be explained by the letter’s liturgical content, Paul’s use of secretaries, development in his thought, and its character as a general letter—the Tyndale notes conclude there is no compelling reason to deny Pauline authorship. The question affects how Ephesians is placed within Paul’s development (for example, John Barclay’s major study of grace in Paul focuses on letters he regards as undisputed), but not what Eph 2:1–10 says about grace.',
      relatedVerses: [vr('EPH', 1, 1), vr('EPH', 3, 1)],
      tags: ['authorship', 'paul', 'deutero-pauline', 'prison letters'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'Ephesians introduction: Author'),
        cite('barclay-paul-and-the-gift', 'as summarised by D. J. Moo, Themelios 41.2', URL.mooOnBarclay),
      ),
    },
    {
      id: 'grace:ctx:recipients',
      category: 'audience',
      title: 'A letter for several churches in Asia',
      summary:
        'Though traditionally addressed to Ephesus, the letter may have been a general letter circulated among churches in the Roman province of Asia.',
      detail:
        'The words “in Ephesus” (1:1) are missing from many of the earliest manuscripts, and the letter has no personal greetings—surprising if Paul was writing to a church where he had spent two to three years (Acts 19:10; 20:31). Many churches in the province were founded during Paul’s Ephesian ministry, some by his converts rather than by Paul himself. The readers were largely Gentile converts, which shapes the argument of chapter 2.',
      relatedVerses: [vr('EPH', 1, 1), vr('EPH', 2, 11)],
      tags: ['audience', 'recipients', 'manuscripts', 'asia'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'Ephesians introduction: Recipients; Setting'),
        cite('tyndale-open-study-notes', 'on Eph 1:1'),
      ),
    },
    {
      id: 'grace:ctx:ephesus',
      category: 'geography',
      title: 'Ephesus and the date of the letter',
      summary:
        'Ephesus was the capital and port of the Roman province of Asia, one of the empire’s largest cities, famous for its temple of Artemis. The letter presents Paul as writing from prison (3:1; 4:1)—traditionally in Rome around AD 60–62, though some scholars propose an imprisonment in Ephesus around AD 53–56.',
      detail:
        'The Tyndale notes describe Ephesus as the fourth-largest city in the Roman empire, with a population of perhaps 500,000. After a brief first visit (Acts 18:19–21), Paul stayed two to three years (Acts 19:1–20:1) amid serious opposition. The traditional view places the Prison Letters (Ephesians, Philippians, Colossians, Philemon) in Rome late in Paul’s life; an alternative places them during an imprisonment in Ephesus, which would date them earlier.',
      relatedVerses: [vr('EPH', 3, 1), vr('EPH', 4, 1)],
      tags: ['ephesus', 'asia', 'artemis', 'date', 'prison'],
      provenance: historical('editorial', cite('tyndale-open-study-notes', 'Ephesians introduction: Setting; Date and Place of Writing')),
    },
    {
      id: 'grace:ctx:patronage',
      category: 'greco-roman',
      title: 'Charis in a world of patrons and benefactors',
      summary:
        'Paul’s readers used charis every day for the favour of a patron or benefactor, for the gift itself, and for the gratitude it called for. Grace was the language of generous giving and grateful response.',
      detail:
        'In the Greco-Roman world, people often obtained protection, office or material help through personal ties with the powerful rather than through public institutions. David deSilva shows that charis carried three linked senses: the giver’s favourable disposition, the benefit given, and the recipient’s gratitude. Moralists such as Seneca (On Benefits) insisted that favour must be answered with gratitude; Seneca illustrated the ideal with the three Graces, whose circling dance pictures a benefit passing from giver to receiver and back again. Hearing that they were saved “by grace”, the first readers would most likely have pictured God as the supreme benefactor, and would have expected such grace to call for a response of loyalty and thanks (compare 2:10).',
      relatedVerses: [e2(5), e2(7), e2(8), e2(10)],
      tags: ['patronage', 'benefaction', 'reciprocity', 'gratitude', 'original audience'],
      provenance: historical(
        'editorial',
        cite('desilva-patronage-reciprocity', 'pp. 32, 38–39', URL.desilvaArticle),
        cite('desilva-honor-patronage'),
      ),
    },
    {
      id: 'grace:ctx:surprising-grace',
      category: 'greco-roman',
      title: 'What made God’s grace surprising',
      summary:
        'Ancient benefactors gave freely in principle, but normally chose worthy recipients. The New Testament’s surprise is that God gives his greatest gift to the unworthy—even to enemies.',
      detail:
        'DeSilva notes that, for Seneca, the most generous giver might even help people who had proved ungrateful, provided he had something left over after helping the deserving. The New Testament goes much further: God gives his greatest gift to people who had set themselves against him (Rom 5:6–10; Luke 6:35), and he makes the first move to reconcile them. John Barclay’s Paul and the Gift (2015) describes this as grace given regardless of whether the recipient is worthy (what he calls its “incongruity”); in his reading Paul does not make grace free of all expected response—it is unconditioned, but it aims at a transformed life. Eph 2:1–10 fits both points: God acts toward the dead (2:5) and creates them for good works (2:10).',
      relatedVerses: [e2(1), e2(4), e2(5), e2(10)],
      tags: ['incongruity', 'enemies', 'barclay', 'desilva', 'unmerited'],
      provenance: historical(
        'editorial',
        cite('desilva-patronage-reciprocity', 'p. 53 (section “God the Benefactor and Patron”)', URL.desilvaArticle),
        cite('barclay-paul-and-the-gift', 'as summarised by D. J. Moo, Themelios 41.2', URL.mooOnBarclay),
        cite('bsb', 'Rom 5:6–10; Luke 6:35'),
      ),
    },
    {
      id: 'grace:ctx:hesed-covenant',
      category: 'jewish-tradition',
      title: 'Hesed and covenant: Israel’s grammar of grace',
      summary:
        'Paul’s vocabulary has Jewish roots. Israel’s Scriptures already confessed a God who is gracious, abounding in hesed, and who chose Israel out of love rather than merit.',
      detail:
        'The Greek Old Testament generally rendered chen (favour) with charis and hesed (loyal, covenant love) with eleos (mercy), so when Paul pairs mercy and grace in Eph 2:4–8 he draws on this inheritance. Texts such as Exod 34:6–7, Deut 7:7–9 and Ps 103 show that grace was not a Christian invention; what is new in Ephesians is its focus on Christ and its extension to Gentiles who had been strangers to the covenants of promise (2:12).',
      relatedVerses: [e2(4), e2(5), vr('EPH', 2, 12)],
      tags: ['hesed', 'covenant', 'old testament', 'jewish background'],
      provenance: historical(
        'editorial',
        cite('stepbible-tbesg', 'G5485 (“in LXX chiefly for חֵן”); G1656 (“in LXX chiefly for חֶסֶד”)'),
        cite('bsb', 'Exod 34:6–7; Deut 7:7–9; Ps 103:8–14; Eph 2:12'),
      ),
    },
    {
      id: 'grace:ctx:gentiles',
      category: 'audience',
      title: 'Gentiles “without hope and without God”',
      summary:
        'Most of the first readers were Gentiles who had been outside Israel’s covenants. Paul reminds them that they were once separated from Christ, strangers to the promises, without hope and without God in the world (2:12).',
      detail:
        'Ephesians 2:11–22 immediately applies the grace of 2:1–10 to the Jew–Gentile divide. Jews traditionally regarded Gentiles as excluded from God’s people, and a low barrier in the Jerusalem Temple marked where Gentiles could not go. The Tyndale notes suggest the emphasis may reflect tensions between Jewish and Gentile believers. For such readers, “by grace you have been saved” meant that their standing with God rested on nothing they had brought—neither ancestry nor achievement.',
      relatedVerses: [vr('EPH', 2, 11), vr('EPH', 2, 12), vr('EPH', 2, 14)],
      tags: ['gentiles', 'jews', 'covenants', 'original audience'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'on Eph 2:11–22; 2:12; 2:14'),
        cite('tyndale-open-study-notes', 'Ephesians introduction: Setting'),
      ),
    },
    {
      id: 'grace:ctx:powers',
      category: 'religious',
      title: '“The ruler of the power of the air”',
      summary:
        'Paul describes life apart from Christ as shaped by the age of this world and by the devil, “the ruler of the power of the air” (2:2). In a city known for magic, this was not an abstract idea.',
      detail:
        'The Tyndale notes read 2:2 as a reference to the devil, who rules the powers of evil and works in those who refuse to obey God (compare 6:11–12). Acts records that during Paul’s ministry in Ephesus many believers came forward to confess their practices, and a number of those who had practised magic burned their books publicly, valued at fifty thousand drachmas (Acts 19:18–19). Grace in Ephesians is therefore also liberation from spiritual powers, not only pardon.',
      relatedVerses: [e2(2), vr('EPH', 6, 12)],
      tags: ['powers', 'devil', 'magic', 'ephesus'],
      provenance: historical('editorial', cite('tyndale-open-study-notes', 'on Eph 2:2'), cite('bsb', 'Acts 19:18–19')),
    },
  ],

  /* ---------------- Literary context ---------------- */
  literary: {
    placeInBook: {
      text:
        'Ephesians falls into two halves: chapters 1–3 praise God for his grace, and chapters 4–6 describe the life that answers it. Eph 2:1–10 comes right after Paul’s prayer that readers grasp the power God used to raise Christ and seat him in the heavenly realms (1:19–20); 2:5–6 applies that same power to believers. The passage then grounds 2:11–22, where grace unites Jews and Gentiles in one new people.',
      provenance: literary(
        cite('tyndale-open-study-notes', 'on Eph 1:3–3:21; 2:11–22'),
        cite('bsb', 'Eph 1:19–2:10'),
        cite('stepbible-tagnt', 'Eph 1:20 ἐγείρας, καθίσας; 2:6 συνήγειρεν, συνεκάθισεν'),
      ),
    },
    argument: {
      text:
        'The argument moves in five steps: the plight of all humanity—dead, enslaved and under wrath (2:1–3); the turn to God’s character—rich in mercy, great in love (2:4); God’s action with Christ—made alive, raised and seated (2:5–6); God’s purpose—to display the riches of his grace for ages to come (2:7); and the explanation—saved by grace, through faith, as a gift, not by works, and created for good works (2:8–10). In Greek, 2:1–7 is one long sentence, a feature of Paul’s style in Ephesians.',
      provenance: literary(cite('bsb', 'Eph 2:1–10'), cite('tyndale-open-study-notes', 'on Eph 1:3–14 (long sentences, incl. 2:1–7)')),
    },
    placeInCanon: {
      text:
        'Ephesians 2 gathers a thread that runs through the whole Bible: the God who found favour in Noah, revealed himself as gracious at Sinai and chose Israel out of love now shows the surpassing riches of his grace in Christ. It is the most compact statement in Paul’s letters of what Romans and Galatians argue at length, and it anticipates the new-creation hope of the rest of the New Testament.',
      provenance: literary(
        cite('bsb', 'Gen 6:8; Exod 34:6–7; Deut 7:7–8; Rom 3:21–26; Gal 2:16–21'),
        cite('calvin-commentaries', 'on Eph 2:9', URL.calvinEph2_8),
      ),
    },
    bookOutline: [
      { label: 'Greeting', ref: p('EPH', 1, 1, 2) },
      { label: 'Praise for every spiritual blessing', ref: p('EPH', 1, 3, 14) },
      { label: 'Prayer for spiritual understanding', ref: p('EPH', 1, 15, 23) },
      { label: 'From death to life: saved by grace', ref: p('EPH', 2, 1, 10), current: true },
      { label: 'One new people in Christ', ref: p('EPH', 2, 11, 22) },
      { label: 'Paul, steward of God’s grace to the Gentiles', ref: p('EPH', 3, 1, 13) },
      { label: 'Prayer to know Christ’s love', ref: p('EPH', 3, 14, 21) },
      { label: 'Unity and gifts in the body', ref: p('EPH', 4, 1, 16) },
      { label: 'The new life: walking as children of light', ref: { book: 'EPH', startChapter: 4, startVerse: 17, endChapter: 5, endVerse: 20 } },
      { label: 'Christ-shaped households', ref: { book: 'EPH', startChapter: 5, startVerse: 21, endChapter: 6, endVerse: 9 } },
      { label: 'The armour of God', ref: p('EPH', 6, 10, 20) },
      { label: 'Closing words', ref: p('EPH', 6, 21, 24) },
    ],
    passageOutline: [
      { label: 'The plight: dead, enslaved, under wrath', ref: p('EPH', 2, 1, 3) },
      { label: 'The turn: “But God”, rich in mercy', ref: p('EPH', 2, 4) },
      { label: 'Made alive, raised and seated with Christ', ref: p('EPH', 2, 5, 6) },
      { label: 'The purpose: grace on display for ages', ref: p('EPH', 2, 7) },
      { label: 'By grace, through faith, a gift—not by works', ref: p('EPH', 2, 8, 9) },
      { label: 'God’s workmanship, created for good works', ref: p('EPH', 2, 10) },
    ],
    features: [
      {
        id: 'grace:lit:but-god',
        type: 'transition',
        title: 'The turning point: “But God”',
        description:
          'After three verses describing human helplessness, 2:4 opens with Ὁ δὲ θεός—“But God”. The grammatical subject of the rescue is God alone; every main verb that follows (made alive, raised, seated) has God as its subject.',
        verses: [e2(4), e2(5), e2(6)],
        tags: ['but god', 'transition', 'divine initiative'],
        provenance: literary(cite('stepbible-tagnt', 'Eph 2:4–6 (δέ; συνεζωοποίησεν, συνήγειρεν, συνεκάθισεν: V-AAI-3S)'), cite('bsb', 'Eph 2:1–6')),
      },
      {
        id: 'grace:lit:refrain',
        type: 'repetition',
        title: 'The refrain “by grace you have been saved”',
        description:
          'Paul interrupts himself in 2:5 with “by grace you have been saved” (printed in parentheses in the KJV) and then repeats and expands it in 2:8. The repetition makes it the passage’s thesis. Calvin was unsure whether the parenthesis came from Paul or a later hand, but accepted it as fitting the context and took it as a sign that Paul never felt he had said enough about God’s grace.',
        verses: [e2(5), e2(8)],
        structure: [
          { label: 'A', text: 'By grace you have been saved (interjection)', ref: p('EPH', 2, 5), level: 0 },
          { label: 'A′', text: 'By grace you have been saved, through faith … the gift of God … not by works', ref: p('EPH', 2, 8, 9), level: 0 },
        ],
        tags: ['repetition', 'thesis', 'grace'],
        provenance: literary(
          cite('stepbible-tagnt', 'Eph 2:5, 2:8 χάριτί ἐστε σεσῳσμένοι'),
          cite('calvin-commentaries', 'on Eph 2:5', 'https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.ii.html'),
        ),
      },
      {
        id: 'grace:lit:with-christ',
        type: 'parallelism',
        title: 'Three “with” verbs echoing Christ’s own story',
        description:
          'Paul uses three compound verbs beginning with syn- (“with”): made alive with, raised with, seated with (2:5–6). They mirror what God did for Christ in 1:20—raised him and seated him in the heavenly realms—so that the believer’s story is folded into Christ’s.',
        verses: [e2(5), e2(6), vr('EPH', 1, 20)],
        structure: [
          { label: 'Christ', text: 'God raised him and seated him in the heavenly realms', ref: p('EPH', 1, 20), level: 0 },
          { label: 'Believers', text: 'made alive with … raised with … seated with Christ', ref: p('EPH', 2, 5, 6), level: 1 },
        ],
        tags: ['union with christ', 'resurrection', 'syn- compounds'],
        provenance: literary(cite('stepbible-tagnt', 'Eph 1:20; 2:5–6'), cite('tyndale-open-study-notes', 'on Eph 2:5–6')),
      },
      {
        id: 'grace:lit:walk',
        type: 'inclusio',
        title: 'Two ways of walking',
        description:
          'The verb “walk” (περιπατέω) frames the passage: readers once walked in trespasses and sins (2:2), and the passage ends—its last Greek word—with the good works God prepared “that we should walk in them” (2:10, rendered “our way of life” in the BSB). Grace does not only change status; it changes the direction of a life.',
        verses: [e2(2), e2(10)],
        structure: [
          { label: 'Then', text: 'you walked in trespasses and sins, following the ways of this world', ref: p('EPH', 2, 1, 2), level: 0 },
          { label: 'Now', text: 'good works which God prepared, that we should walk in them', ref: p('EPH', 2, 10), level: 0 },
        ],
        tags: ['walk', 'inclusio', 'way of life'],
        provenance: literary(cite('stepbible-tagnt', 'Eph 2:2 περιεπατήσατε; 2:10 περιπατήσωμεν (G4043), the verse’s last word'), cite('kjv', 'Eph 2:2, 10')),
      },
      {
        id: 'grace:lit:works',
        type: 'argument-structure',
        title: '“Not by works” and “for good works”',
        description:
          'Paul uses the same noun, ἔργα (works), in consecutive verses with different prepositions: salvation is not from works (ἐξ ἔργων, 2:9), but believers are created for good works (ἐπὶ ἔργοις ἀγαθοῖς, 2:10). Works are excluded as the source of salvation and restored as its fruit.',
        verses: [e2(9), e2(10)],
        tags: ['works', 'faith and works', 'good works'],
        provenance: literary(cite('stepbible-tagnt', 'Eph 2:9 ἐξ ἔργων; 2:10 ἐπὶ ἔργοις ἀγαθοῖς (G2041)'), cite('tyndale-open-study-notes', 'on Eph 2:10')),
      },
    ],
  },

  /* ---------------- Theology ---------------- */
  theology: [
    {
      id: 'grace:th:gift',
      category: 'soteriology',
      title: 'Salvation as God’s gift',
      summary:
        'Eph 2:8–9 compresses the gospel into three contrasts: by grace, not by works; through faith, not from yourselves; God’s gift, not our boast. Salvation originates in God’s favour, is received by trust, and leaves no room for self-congratulation.',
      detail:
        'Christians of every tradition affirm that no one can earn or merit the grace of salvation. The Tyndale notes call 2:8–9 a concise summary of how a person is saved and a cardinal tenet of the gospel. Where traditions differ is in how grace relates to the human will and to the process of renewal—see the perspectives below.',
      keyVerses: [p('EPH', 2, 8, 9), p('ROM', 3, 24), p('ROM', 6, 23), p('TIT', 3, 5)],
      tags: ['salvation', 'gift', 'faith', 'works', 'boasting'],
      provenance: synthesis(cite('bsb', 'Eph 2:8–9; Rom 3:24; 6:23'), cite('tyndale-open-study-notes', 'on Eph 2:8–9')),
    },
    {
      id: 'grace:th:election',
      category: 'grace',
      title: 'Election and calling: grace before time',
      summary:
        'Ephesians places grace before the world began: God chose believers in Christ before the foundation of the world, to the praise of his glorious grace (1:4–6), and prepared good works in advance for them (2:10).',
      detail:
        'The pattern appears throughout Scripture: Israel was chosen out of love, not merit (Deut 7:7–8); a remnant is chosen by grace (Rom 11:5–6); God saved and called us by his own purpose and grace given in Christ before time began (2 Tim 1:9). Christians agree that election is gracious; they disagree about its basis. The Remonstrant Articles (1610) describe God’s eternal decree to save those who, through the grace of the Spirit, will believe and persevere; the Canons of Dort (1619) answer that election was not founded on foreseen faith but is the fountain of faith itself. The perspectives below explore the wider question.',
      keyVerses: [p('EPH', 1, 4, 6), p('EPH', 2, 10), p('DEU', 7, 7, 8), p('ROM', 11, 5, 6), p('2TI', 1, 9)],
      tags: ['election', 'predestination', 'calling', 'purpose'],
      provenance: synthesis(
        cite('bsb', 'Eph 1:4–6; 2:10; Deut 7:7–8; Rom 11:5–6; 2 Tim 1:9'),
        cite('tyndale-open-study-notes', 'on Eph 1:5'),
        cite('articles-of-remonstrance', 'Art. I', URL.schaffCreeds3),
        cite('canons-of-dort', 'First Head, Art. IX', URL.schaffCreeds3),
      ),
    },
    {
      id: 'grace:th:justification',
      category: 'soteriology',
      title: 'Grace and justification',
      summary:
        'Ephesians 2 speaks of being saved rather than justified, but the ideas meet: in Romans, Galatians and Titus believers are justified freely by God’s grace through faith, not by works of the law.',
      detail:
        'Augustine summarised the relation of law and grace this way: the law was given so that grace would be sought, and grace was given so that the law would be fulfilled. Protestant traditions stress justification as God’s declaration that sinners are righteous for Christ’s sake; Catholic teaching holds that justification also includes inner renewal. In recent decades N. T. Wright has argued that Paul’s language of justification must be read within God’s covenant plan through Israel for the world—an emphasis he finds in Eph 2:11–22 alongside the classic Reformation emphases of 2:1–10.',
      keyVerses: [p('ROM', 3, 21, 26), p('ROM', 4, 4, 5), p('GAL', 2, 16), p('TIT', 3, 7)],
      tags: ['justification', 'law and grace', 'new perspective', 'imputation'],
      provenance: synthesis(
        cite('bsb', 'Rom 3:21–26; 4:4–5; Gal 2:16; Titus 3:7'),
        cite('augustine-spirit-letter', 'ch. 34', URL.augustineSpiritLetter),
        cite('augsburg-confession', 'Art. IV', URL.augsburg),
        cite('council-of-trent-session-6', 'Session 6, ch. 7', URL.trent6),
        cite('wright-justification', 'as reviewed by C. L. Blomberg, Denver Journal', URL.wrightJustification),
      ),
    },
    {
      id: 'grace:th:sanctification',
      category: 'sanctification',
      title: 'Grace that trains: good works as fruit',
      summary:
        'Grace saves apart from works but never leaves people without them. Believers are God’s workmanship created for good works (Eph 2:10); the grace that brings salvation also trains them to live godly lives (Titus 2:11–12).',
      detail:
        'Paul rejects the idea that free grace encourages sin (Rom 6:1–2) and describes his own labour as the grace of God working with him (1 Cor 15:10). The Tyndale notes put it simply: good works are the result, not the cause, of salvation. Philippians 2:12–13 holds both sides together—work out your salvation, for it is God who works in you.',
      keyVerses: [p('EPH', 2, 10), p('TIT', 2, 11, 14), p('ROM', 6, 1, 14), p('1CO', 15, 10), p('PHP', 2, 12, 13)],
      tags: ['sanctification', 'good works', 'holiness', 'cheap grace'],
      provenance: synthesis(cite('bsb', 'Eph 2:10; Titus 2:11–14; Rom 6:1–14; 1 Cor 15:10; Phil 2:12–13'), cite('tyndale-open-study-notes', 'on Eph 2:10')),
    },
    {
      id: 'grace:th:common-grace',
      category: 'grace',
      title: 'Common grace and saving grace',
      summary:
        'Scripture speaks of God’s goodness to all people—sun and rain on the evil and the good, food and gladness for the nations—alongside the saving grace of Eph 2. Theologians have related these two in different ways; Reformed theology uses the term “common grace” for grace that does not save.',
      detail:
        'Charles Hodge, for example, defined common grace as the Holy Spirit’s influence granted in some measure to all who hear the truth, distinct from the efficacious grace that regenerates. Wesleyans speak instead of prevenient grace given to everyone, which awakens conscience and is meant to lead to salvation. Eastern Orthodox theology, as Vladimir Lossky presents it, does not picture human nature as a self-contained natural order to which grace is afterwards attached as an extra; in his account God’s gift is at work in creation from the beginning. Across these traditions, the goodness people enjoy apart from saving faith is still unearned gift.',
      keyVerses: [p('MAT', 5, 45), p('ACT', 14, 17), p('LUK', 6, 35), p('JHN', 1, 9)],
      tags: ['common grace', 'prevenient grace', 'general revelation', 'providence'],
      provenance: synthesis(
        cite('bsb', 'Matt 5:45; Acts 14:17; Luke 6:35; John 1:9'),
        cite('hodge-systematic-theology-vol2', 'pt. III, ch. XIV §3 “Common Grace”', URL.hodge2),
        cite('wesley-sermons', 'Sermon 85, On Working Out Our Own Salvation, III.4', URL.wesleyWorkingOut),
        cite('lossky-mystical-theology', 'ch. 5, “Created Being”', URL.losskyPublisher),
      ),
    },
    {
      id: 'grace:th:means',
      category: 'ecclesiology',
      title: 'The means of grace',
      summary:
        'Many Christian traditions—Catholic, Lutheran, Reformed and Methodist among them—teach that God ordinarily gives and nourishes grace through appointed means, above all the Word and the sacraments, together with prayer, though they describe those means differently. Not all Christians use this language: some free-church traditions speak of baptism and the Lord’s Supper as ordinances of obedience and remembrance, and early Quaker teaching held that the outward rites were no longer needed at all.',
      detail:
        'The Westminster Shorter Catechism (Q. 88) names the word, sacraments and prayer as the outward and ordinary means through which Christ communicates the benefits of redemption. The Augsburg Confession (Art. V) teaches that through the Word and sacraments, as through instruments, the Holy Spirit is given, who works faith. The Catechism of the Catholic Church speaks of sacramental graces proper to each sacrament and of special graces or charisms (§2003). John Wesley’s sermon The Means of Grace names prayer, searching the Scriptures and the Lord’s Supper as the chief ordinary channels by which God conveys grace. By contrast, the Southern Baptist Convention’s Baptist Faith and Message (2000, Art. VII) presents both as symbols and acts of obedience: baptism pictures the believer’s faith and new life, and the Supper recalls Christ’s death and looks ahead to his return. Robert Barclay’s Apology (1678), a defence of Quaker principles, treats true baptism and communion as inward and spiritual, and the outward rites as figures meant only for a time (Props. 12–13). The early church devoted itself to the apostles’ teaching, the breaking of bread and prayer (Acts 2:42).',
      keyVerses: [p('ACT', 2, 42), p('ROM', 10, 17), p('1PE', 4, 10)],
      tags: ['means of grace', 'sacraments', 'ordinances', 'word', 'prayer'],
      provenance: synthesis(
        cite('westminster-shorter-catechism', 'Q. 88', URL.schaffCreeds3),
        cite('augsburg-confession', 'Art. V', URL.augsburg),
        cite('catechism-catholic-church', '§2003', URL.cccGrace),
        cite('wesley-sermons', 'Sermon 16, The Means of Grace, II.1', URL.wesleyMeansOfGrace),
        cite('baptist-faith-and-message-2000', 'Art. VII', URL.bfm2000),
        cite('barclay-apology', 'Propositions 12–13', URL.barclayApology),
        cite('bsb', 'Acts 2:42; Rom 10:17'),
      ),
    },
  ],

  /* ---------------- Perspectives ---------------- */
  perspectives: [
    {
      id: 'grace:ps:grace-and-response',
      question: 'How does God’s grace relate to the human response of faith?',
      consensus: 'denominational',
      intro:
        'Every tradition below confesses that salvation is by God’s grace and cannot be earned. They differ over how grace works in the human will: whether it is by itself effectual, works conversion alone yet can be resisted, enables a free response that can be refused, heals nature and invites cooperation, or unites God’s own energies with human freedom. The debate has deep roots—in Augustine’s controversy with Pelagius, in the African council of 418 that taught grace gives not only forgiveness but the will and power to obey, and in the Council of Orange (529), which held that even the beginning of faith is a gift of grace. Eph 2:8–10 is claimed, sincerely, by all sides.',
      perspectives: [
        {
          id: 'grace:ps:grace-and-response:reformed',
          tradition: 'Reformed',
          label: 'Effectual grace: God gives the faith he calls for',
          summary:
            'The Canons of Dort (1619) teach that conversion must be wholly ascribed to God: regeneration is a new creation and a resurrection from the dead, not mere moral persuasion that leaves it in human power to be converted or not; faith is God’s gift because God actually produces both the will to believe and the act of believing. Yet grace does not treat people as lifeless objects or destroy the will—it renews it so that the person truly believes and repents. Reformed readers see this in Eph 2: the dead are made alive (2:5), and the whole of salvation is “not from yourselves” (2:8).',
          representatives: ['augustine', 'calvin', 'john-owen', 'edwards', 'spurgeon', 'ji-packer', 'rc-sproul', 'john-piper'],
          keyTexts: [p('EPH', 2, 1, 5), p('JHN', 6, 44), p('PHP', 1, 29)],
          provenance: summaryOf(
            cite('canons-of-dort', 'Third and Fourth Heads, arts. 10–16', URL.schaffCreeds3),
            cite('calvin-commentaries', 'on Eph 2:8–10', URL.calvinEph2_8),
          ),
        },
        {
          id: 'grace:ps:grace-and-response:wesleyan',
          tradition: 'Arminian / Wesleyan',
          label: 'Prevenient grace: an enabled, resistible response',
          summary:
            'The Remonstrant Articles (1610) hold that no one can think, will or do good without grace, which is the beginning, continuation and completion of all good—yet grace is not irresistible, since Scripture says many resisted the Holy Spirit (Acts 7:51). John Wesley taught that no one is left in a state of mere nature: God’s preventing (prevenient) grace awakens conscience and the first desires toward him in every person, so that people sin not for lack of grace but by not using the grace they have. In his sermon on Eph 2:8 he called grace the source and faith the condition of salvation, and in Free Grace he argued that God’s grace is free in all and for all.',
          representatives: ['wesley', 'adam-clarke'],
          keyTexts: [p('TIT', 2, 11), p('JHN', 1, 9), p('ACT', 7, 51), p('PHP', 2, 12, 13)],
          provenance: summaryOf(
            cite('articles-of-remonstrance', 'Arts. III–IV', URL.schaffCreeds3),
            cite('wesley-sermons', 'Sermon 85, On Working Out Our Own Salvation, II.1; III.4', URL.wesleyWorkingOut),
            cite('wesley-sermons', 'Sermon 1, Salvation by Faith, §3', URL.wesleySalvationByFaith),
            cite('wesley-sermons', 'Sermon 128, Free Grace, §2', URL.wesleyFreeGrace),
          ),
        },
        {
          id: 'grace:ps:grace-and-response:catholic',
          tradition: 'Catholic',
          label: 'Grace that heals and elevates, with real cooperation',
          summary:
            'The Council of Trent (Session 6, 1547) teaches that the beginning of justification comes from God’s prevenient grace, without any merit; God touches the heart, and the person, who could reject that grace, freely assents and cooperates with it, though unable to move toward God without it. We are said to be justified freely because nothing that precedes justification—neither faith nor works—merits the grace of justification itself. The Catechism describes grace as God’s free and undeserved help and a participation in his life, distinguishing habitual (sanctifying) grace from actual graces; after justification, merit is itself a gift of grace. Thomas Aquinas’s treatise on grace shapes this vocabulary.',
          representatives: ['aquinas', 'augustine'],
          keyTexts: [p('EPH', 2, 8, 10), p('ROM', 11, 6), p('2PE', 1, 4)],
          provenance: summaryOf(
            cite('council-of-trent-session-6', 'Session 6, chs. 5 and 8', URL.trent6),
            cite('catechism-catholic-church', '§§1996–2005, 2006–2011', URL.cccGrace),
            cite('aquinas-summa-theologiae', 'I–II q. 110 a. 1; q. 111 aa. 1–2', URL.aquinasQ111),
          ),
        },
        {
          id: 'grace:ps:grace-and-response:lutheran',
          tradition: 'Lutheran',
          label: 'Sola gratia: God alone converts, yet grace can be refused',
          summary:
            'The Augsburg Confession (1530, Art. IV) teaches that people cannot be justified before God by their own strength, merits or works, but are freely justified for Christ’s sake through faith, which God counts as righteousness; Article V adds that the Holy Spirit, who works faith, is given through the Word and sacraments as through instruments. The Formula of Concord (1577, Epitome Art. II) holds that conversion is the work of the Holy Spirit’s grace alone: the unconverted will contributes nothing to it, though once renewed it cooperates with the Spirit in the works that follow. Yet this grace can be resisted: according to Epitome Art. XI, those who perish do so because they despise the Word and harden their hearts, not because God was unwilling that they be saved. In the context of justification, Lutheran teaching treats grace above all as God’s unmerited favour toward sinners rather than as a quality infused into the soul. Dietrich Bonhoeffer warned that this free grace must never be turned into a principle that excuses sin.',
          representatives: ['luther', 'bonhoeffer'],
          keyTexts: [p('ROM', 3, 23, 28), p('ROM', 4, 4, 5), p('EPH', 2, 8, 9)],
          provenance: summaryOf(
            cite('augsburg-confession', 'Arts. IV–V', URL.augsburg),
            cite('formula-of-concord-schaff', 'Epitome, Arts. II and XI', URL.formulaConcordEpitome),
            cite('lcms-jddj-guide', 'Glossary: “Grace – Lutheran”', URL.lcmsJddj),
            cite('bonhoeffer-discipleship', 'ch. 1', URL.bonhoefferDiscipleship),
          ),
        },
        {
          id: 'grace:ps:grace-and-response:orthodox',
          tradition: 'Eastern Orthodox',
          label: 'Grace as God’s uncreated energies; synergy toward theosis',
          summary:
            'Following Gregory Palamas, Vladimir Lossky presents grace not as a created quality in the soul but as God’s own uncreated energy: God truly gives himself in his energies, while his essence remains unknowable. Salvation is union with God (theosis)—a real sharing in the divine nature (2 Pet 1:4) in which the human person remains a creature. That union involves synergy: the human will works together with divine grace, and in Lossky’s account grace and freedom act together rather than as rivals. Lossky observes that Eastern theology never made the relation of grace and free will the burning controversy it became in the Latin West after Augustine, and that the language of merit has little place in Eastern spiritual writing. Chrysostom, commenting on Eph 2:8, likewise says faith itself is God’s gift while Paul guards human free will.',
          representatives: ['chrysostom', 'athanasius', 'vladimir-lossky'],
          keyTexts: [p('2PE', 1, 4), p('EPH', 2, 8, 10), p('PHP', 2, 12, 13)],
          provenance: summaryOf(
            cite('lossky-mystical-theology', 'ch. 4, “Uncreated Energies”; ch. 10, “The Way of Union”', URL.losskyPublisher),
            cite('chrysostom-homilies-ephesians', 'Homily 4 (on Eph 2:8)', URL.chrysostomEphHom4),
          ),
        },
      ],
      commonGround:
        'All these traditions confess that salvation is God’s gracious initiative in Christ; that no one earns or merits the grace of salvation; that faith is enabled by grace; and that genuine grace bears fruit in a changed life, as Eph 2:10 insists.',
      tags: ['calvinism', 'arminianism', 'free will', 'predestination', 'monergism', 'synergy', 'prevenient grace', 'irresistible grace'],
      provenance: synthesis(
        cite('carthage-418-canons', 'African Code, canons 108–112 (synod against Pelagius and Celestius)', URL.carthage),
        cite('catholic-encyclopedia-semipelagianism', 'on the Second Council of Orange (529)', URL.semipelagianism),
        cite('augustine-grace-free-will', 'chs. 17, 20', URL.augustineGraceFreeWill),
      ),
    },
    {
      id: 'grace:ps:joint-declaration',
      question: 'Did the 1999 Joint Declaration settle the Reformation dispute over justification by grace?',
      consensus: 'denominational',
      intro:
        'On 31 October 1999, in Augsburg, the Lutheran World Federation and the Catholic Church signed the Joint Declaration on the Doctrine of Justification. The World Methodist Council joined it in 2006, and the Anglican and Reformed communions later affirmed it. Christians still assess its significance differently.',
      perspectives: [
        {
          id: 'grace:ps:joint-declaration:consensus',
          tradition: 'Signatory churches (Lutheran World Federation, Catholic Church, and later Methodist, Anglican and Reformed bodies)',
          label: 'A real consensus in basic truths',
          summary:
            'The Declaration says that Lutherans and Catholics can now confess together that God accepts sinners, and gives the Spirit who renews them and sets them to good works, only by grace, through faith in what Christ has done and never on the basis of human merit. It treats the differences that remain between the two churches’ accounts as differences of vocabulary, emphasis and theological development that do not undo this basic consensus. It concludes that the sixteenth-century mutual condemnations do not apply to the partner’s teaching as the Declaration sets it out.',
          keyTexts: [p('EPH', 2, 8, 10), p('ROM', 3, 23, 24)],
          provenance: summaryOf(cite('joint-declaration-justification', '§§15, 40–41', URL.jddj), cite('lwf-jddj', 'Milestones', URL.lwfJddj)),
        },
        {
          id: 'grace:ps:joint-declaration:differences',
          tradition: 'Confessional Lutheran and other critics',
          label: 'Significant differences remain',
          summary:
            'The Lutheran Church–Missouri Synod concluded that the Declaration is not a breakthrough: in its view Catholic teaching still defines justification as including inner renewal and allows the justified to merit further grace, while Lutherans hold that justification is God’s free forgiveness received by faith alone. Its study guide adds that not all Catholic scholars regard the Declaration as a break with traditional Catholic teaching either, and cites Leonardo De Chirico’s judgment that its account of justification leaves the theology of the Council of Trent essentially in place.',
          representatives: [],
          keyTexts: [p('ROM', 4, 4, 5), p('GAL', 2, 16)],
          provenance: summaryOf(cite('lcms-jddj-guide', 'sections 5–6 (with the note on “breakthrough”) and glossary', URL.lcmsJddj)),
        },
      ],
      commonGround:
        'Both assessments agree that justification is God’s gracious work in Christ, received by faith, and that honest agreement and honest disagreement both matter more than papering over differences.',
      tags: ['justification', 'ecumenism', 'catholic', 'lutheran', 'joint declaration'],
      provenance: synthesis(cite('joint-declaration-justification', '§§15, 40', URL.jddj), cite('lwf-jddj', undefined, URL.lwfJddj), cite('lcms-jddj-guide', undefined, URL.lcmsJddj)),
    },
  ],

  /* ---------------- Commentary & Christian thinkers ---------------- */
  commentary: [
    {
      id: 'grace:cm:augustine',
      authorId: 'augustine',
      sourceId: 'augustine-grace-free-will',
      kind: 'quotation',
      lead: 'On “not of works” and “created for good works” (Eph 2:9–10)',
      text: '‘Not of works’ is spoken of the works which you suppose have their origin in yourself alone; but you have to think of works for which God has moulded (that is, has formed and created) you.',
      locator: 'On Grace and Free Will, ch. 20',
      url: URL.augustineGraceFreeWill,
      relatedVerses: [e2(9), e2(10)],
      tags: ['works', 'good works', 'workmanship', 'pelagianism'],
      provenance: verifiedQuote(cite('augustine-grace-free-will', 'ch. 20', URL.augustineGraceFreeWill)),
    },
    {
      id: 'grace:cm:chrysostom',
      authorId: 'chrysostom',
      sourceId: 'chrysostom-homilies-ephesians',
      kind: 'quotation',
      lead: 'On “and this not from yourselves” (Eph 2:8)',
      text: 'Neither is faith, he means, ‘of ourselves.’ Because had He not come, had He not called us, how had we been able to believe?',
      locator: 'Homily 4 on Ephesians (on 2:8)',
      url: URL.chrysostomEphHom4,
      relatedVerses: [e2(8)],
      tags: ['faith', 'gift', 'calling', 'early church'],
      provenance: verifiedQuote(cite('chrysostom-homilies-ephesians', 'Homily 4', URL.chrysostomEphHom4)),
    },
    {
      id: 'grace:cm:aquinas',
      authorId: 'aquinas',
      sourceId: 'aquinas-summa-theologiae',
      kind: 'quotation',
      lead: 'On the ordinary meanings of “grace”',
      text:
        'According to the common manner of speech, grace is usually taken in three ways. First, for anyone’s love, as we are accustomed to say that the soldier is in the good graces of the king … Secondly, it is taken for any gift freely bestowed … Thirdly, it is taken for the recompense of a gift given ‘gratis,’ inasmuch as we are said to be ‘grateful’ for benefits.',
      locator: 'Summa Theologiae I–II q. 110 a. 1',
      url: URL.aquinasQ110,
      relatedVerses: [e2(5), e2(8)],
      tags: ['definition', 'favor', 'gift', 'gratitude', 'charis'],
      provenance: verifiedQuote(cite('aquinas-summa-theologiae', 'I–II q. 110 a. 1', URL.aquinasQ110)),
    },
    {
      id: 'grace:cm:calvin',
      authorId: 'calvin',
      sourceId: 'calvin-commentaries',
      kind: 'quotation',
      lead: 'On “by grace … through faith” (Eph 2:8)',
      text:
        'God declares, that he owes us nothing; so that salvation is not a reward or recompense, but unmixed grace. … Faith, then, brings a man empty to God, that he may be filled with the blessings of Christ.',
      locator: 'Commentary on Ephesians, on 2:8 (trans. William Pringle)',
      url: URL.calvinEph2_8,
      relatedVerses: [e2(8), e2(9)],
      tags: ['faith', 'merit', 'reformed', 'reformation'],
      provenance: verifiedQuote(cite('calvin-commentaries', 'Commentary on Ephesians, on 2:8 (trans. William Pringle, 1854)', URL.calvinEph2_8)),
    },
    {
      id: 'grace:cm:wesley',
      authorId: 'wesley',
      sourceId: 'wesley-sermons',
      kind: 'quotation',
      lead: 'Preaching on Eph 2:8 at Oxford, 1738',
      text:
        'All the blessings which God hath bestowed upon man are of his mere grace, bounty, or favour; his free, undeserved favour; favour altogether undeserved; man having no claim to the least of his mercies. … Grace is the source, faith the condition, of salvation.',
      locator: 'Sermon 1, Salvation by Faith, §§1, 3',
      url: URL.wesleySalvationByFaith,
      relatedVerses: [e2(8)],
      tags: ['faith', 'free grace', 'wesleyan', 'sermon'],
      provenance: verifiedQuote(cite('wesley-sermons', 'Sermon 1, Salvation by Faith, §§1, 3', URL.wesleySalvationByFaith)),
    },
    {
      id: 'grace:cm:newton',
      authorId: 'john-newton',
      sourceId: 'newton-olney-hymns',
      kind: 'quotation',
      lead: 'From the hymn now known as “Amazing Grace”',
      text: '’Twas grace that taught my heart to fear, / And grace my fears relieved; / How precious did that grace appear, / The hour I first believed!',
      locator: 'Olney Hymns, Book I, Hymn 41 (on 1 Chr 17:16–17), stanza 2',
      url: URL.olneyHymnsText,
      relatedVerses: [e2(8)],
      tags: ['amazing grace', 'hymn', 'conversion', 'faith'],
      provenance: verifiedQuote(cite('newton-olney-hymns', 'Book I, Hymn 41, stanza 2', URL.olneyHymnsText)),
    },
    {
      id: 'grace:cm:spurgeon',
      authorId: 'spurgeon',
      sourceId: 'spurgeon-all-of-grace',
      kind: 'quotation',
      lead: 'On grace as the fountain and faith as the channel (Eph 2:8)',
      text:
        'Faith occupies the position of a channel or conduit pipe. Grace is the fountain and the stream; faith is the aqueduct along which the flood of mercy flows down to refresh the thirsty sons of men.',
      locator: 'All of Grace, ch. “By Grace Through Faith”',
      url: URL.spurgeonAllOfGraceText,
      relatedVerses: [e2(8)],
      tags: ['faith', 'channel', 'mercy', 'baptist'],
      provenance: verifiedQuote(cite('spurgeon-all-of-grace', '“By Grace Through Faith”', URL.spurgeonAllOfGraceText)),
    },
    {
      id: 'grace:cm:bonhoeffer',
      authorId: 'bonhoeffer',
      sourceId: 'bonhoeffer-discipleship',
      kind: 'summary',
      lead: 'On “cheap grace” and “costly grace”',
      text:
        'Bonhoeffer opens Discipleship (1937) by contrasting what he called cheap grace and costly grace. Cheap grace, in his account, is forgiveness treated as if it made no claim on the one forgiven—no turning from sin and no following of Christ, so that life goes on unchanged. Costly grace is Jesus’ own summons to discipleship, which lays claim to the whole of a person’s life and at the same time freely gives new life. His warning applies Eph 2:8–10 from the other side: grace that never walks in good works has been misunderstood.',
      locator: 'Discipleship, ch. 1',
      url: URL.bonhoefferDiscipleship,
      relatedVerses: [e2(8), e2(10)],
      tags: ['cheap grace', 'costly grace', 'discipleship', 'lutheran'],
      provenance: summaryOf(
        cite('bonhoeffer-discipleship', 'ch. 1', URL.bonhoefferDiscipleship),
        cite('bonhoeffer-discipleship', 'summary of ch. 1', 'https://en.wikipedia.org/wiki/The_Cost_of_Discipleship'),
      ),
    },
    {
      id: 'grace:cm:packer',
      authorId: 'ji-packer',
      sourceId: 'packer-knowing-god',
      kind: 'summary',
      lead: 'Why grace seems unremarkable to many people',
      text:
        'In the chapter on the grace of God in Knowing God (1973), Packer argues that many who speak of grace do not find it amazing because they have not grasped four truths it presupposes: that human beings are morally guilty before God; that God is just and must punish sin; that we are powerless to restore our own relationship with him; and that God is free—under no obligation to show us favour. Only when these are felt does grace appear as the astonishing thing Eph 2:1–10 describes.',
      locator: 'Knowing God, ch. 13',
      url: URL.packerKnowingGod,
      relatedVerses: [e2(1), e2(3), e2(8)],
      tags: ['grace', 'sin', 'justice', 'sovereignty', 'reformed'],
      provenance: summaryOf(cite('packer-knowing-god', 'ch. 13, “The Grace of God”', URL.packerKnowingGod)),
    },
    {
      id: 'grace:cm:keller',
      authorId: 'tim-keller',
      sourceId: 'keller-prodigal-god',
      kind: 'summary',
      lead: 'Grace for the rebel and for the moralist',
      text:
        'In The Prodigal God (2008), Keller reads Luke 15 as a story about two sons, both alienated from their father. The younger rebels openly; the older obeys in order to put the father in his debt, and at the end he is the one who refuses to come into the feast. Keller argues that the gospel exposes both self-indulgence and self-righteous moralism as ways of trying to control God, and that grace alone brings either son home—the same logic as Eph 2:9, which excludes boasting.',
      locator: 'The Prodigal God',
      url: URL.kellerProdigalGodArticle,
      relatedVerses: [e2(8), e2(9)],
      tags: ['prodigal', 'elder brother', 'moralism', 'self-righteousness', 'reformed'],
      provenance: summaryOf(
        cite('keller-prodigal-god', undefined, URL.kellerProdigalGod),
        cite('keller-prodigal-god', 'as described in Crossway’s article on Keller’s teaching (2025)', URL.kellerProdigalGodArticle),
      ),
    },
    {
      id: 'grace:cm:piper',
      authorId: 'john-piper',
      sourceId: 'piper-future-grace',
      kind: 'summary',
      lead: 'Should we try to pay God back?',
      text:
        'In Future Grace (first published 1995; revised 2012), Piper insists that thankfulness to God is right and biblical, but warns against what he calls a “debtor’s ethic”: treating obedience as repayment for what God has done. In his view, trying to repay God would make grace into something owed rather than freely given. He argues instead that obedience is sustained by faith in God’s promised grace for the future. Later in the book he quotes Eph 2:8–10 to remind readers that they are saved for good works: patient obedience is fruit of faith and of the Spirit’s help, not the basis of their acceptance, which rests on Christ.',
      locator: 'Future Grace, ch. 1 (pp. 29–38); ch. 13 (p. 176)',
      url: URL.piperFutureGrace,
      relatedVerses: [e2(8), e2(10)],
      tags: ['gratitude', 'obedience', 'sanctification', 'reformed baptist'],
      provenance: summaryOf(cite('piper-future-grace', 'ch. 1, “The Debtor’s Ethic” (pp. 29–38); ch. 13 (p. 176), 2012 edition', URL.piperFutureGrace)),
    },
    {
      id: 'grace:cm:wright',
      authorId: 'nt-wright',
      sourceId: 'wright-justification',
      kind: 'summary',
      lead: 'Ephesians 2 and the “old” and “new” perspectives on Paul',
      text:
        'In Justification (2009), written in the debate with John Piper and others, Wright reads Paul’s language of justification within God’s single plan through Israel for the world, while affirming that sinners are declared righteous on the basis of Christ’s death and resurrection. He observes that Ephesians holds together emphases often set against each other: salvation by grace through faith, producing good works (2:1–10), and Jews and Gentiles united as one family in the Messiah (2:11–22). Critics such as Piper have questioned parts of his account of justification, but his reading shows why Eph 2:1–10 should not be read in isolation from 2:11–22.',
      locator: 'Justification: God’s Plan and Paul’s Vision',
      url: URL.wrightJustification,
      relatedVerses: [e2(8), e2(10), vr('EPH', 2, 11)],
      tags: ['justification', 'new perspective', 'jews and gentiles', 'anglican'],
      provenance: summaryOf(cite('wright-justification', 'as reviewed by C. L. Blomberg, Denver Journal', URL.wrightJustification)),
    },
  ],

  /* ---------------- Sermons ---------------- */
  sermons: [
    {
      id: 'grace:sermon:wesley-salvation-by-faith',
      authorId: 'wesley',
      title: 'Salvation by Faith',
      date: '1738-06-11',
      series: 'Sermons on Several Occasions, Sermon 1 (preached at St Mary’s, Oxford)',
      refs: [p('EPH', 2, 8)],
      topics: ['grace', 'faith', 'salvation', 'justification'],
      url: URL.wesleySalvationByFaith,
      sourceId: 'wesley-sermons',
      summary: {
        text:
          'Preached before the University of Oxford on 11 June 1738, the feast of St Barnabas (the 1746 and 1872 editions misdate it 18 June, when Wesley was in Germany), the sermon opens by grounding every blessing in God’s free, undeserved favour, then asks what saving faith is (not merely a heathen’s or a devil’s belief, but trust in Christ), what salvation through faith includes, and how to answer objections.',
        provenance: summaryOf(
          cite('wesley-sermons', 'Sermon 1', URL.wesleySalvationByFaith),
          cite('wesley-works-digital-edition', 'Sermon 1, heading, introductory comment and n. 23 (date)', URL.wesleyWorksSermon1),
        ),
      },
    },
    {
      id: 'grace:sermon:spurgeon-salvation-all-of-grace',
      authorId: 'spurgeon',
      title: 'Salvation All of Grace',
      date: '1872-08-04',
      series: 'Metropolitan Tabernacle Pulpit, vol. 18',
      refs: [p('EPH', 2, 8)],
      topics: ['grace', 'salvation', 'boasting', 'merit'],
      url: URL.spurgeonSalvationAllOfGrace,
      sourceId: 'spurgeon-salvation-all-of-grace',
      summary: {
        text:
          'Spurgeon traces grace through election, redemption, calling and justification, and suggests Paul presses the point because the human heart resists being saved by grace. Sinners come not as the innocent or the excusable but as the guilty casting themselves on mercy. He then draws out five practical consequences: the doctrine gives every sinner hope, shows how to plead with God, reconciles believers to God’s appointed ways (faith and baptism), supplies a powerful motive for holiness, and tests how each hearer responds.',
        provenance: summaryOf(cite('spurgeon-salvation-all-of-grace', undefined, URL.spurgeonSalvationAllOfGrace)),
      },
    },
    {
      id: 'grace:sermon:piper-but-god',
      authorId: 'john-piper',
      title: 'But God...',
      date: '1985-12-22',
      series: 'Bethlehem Baptist Church, Minneapolis',
      refs: [p('EPH', 2, 1, 9)],
      topics: ['but god', 'grace', 'mercy', 'union with christ'],
      url: URL.piperButGod,
      sourceId: 'piper-but-god',
      summary: {
        text:
          'A Christmas-season sermon that sets each part of the plight in 2:1–3 against God’s answer in 2:4–7: kindness in place of wrath (2:3 and 2:7), freedom and a seat with Christ in place of captivity (2:2 and 2:6), and life in place of death (2:1 and 2:5–6)—all hinging on the words “But God”.',
        provenance: summaryOf(cite('piper-but-god', undefined, URL.piperButGod)),
      },
    },
    {
      id: 'grace:sermon:keller-grace-of-god',
      authorId: 'tim-keller',
      title: 'The Grace of God',
      date: '2011-05-01',
      series: 'To Know the Living God; The God Who Makes Alive (Redeemer Presbyterian Church)',
      refs: [p('EPH', 2, 1, 10)],
      topics: ['grace', 'attributes of god', 'salvation'],
      url: URL.kellerGraceOfGod,
      sourceId: 'keller-the-grace-of-god',
      summary: {
        text:
          'Part of a series on the attributes of God. According to the sermon overview, Keller argues from Eph 2:1–10 that grace is a gift we cannot do without and one that cost God immeasurably, and that seeing both changes how grace takes hold of a life.',
        provenance: summaryOf(cite('keller-the-grace-of-god', 'sermon overview', URL.kellerGraceOfGod)),
      },
    },
  ],

  /* ---------------- Verse notes ---------------- */
  verseNotes: [
    {
      verse: e2(1),
      explanation: {
        text:
          'Paul begins with the diagnosis: his readers were dead in trespasses and sins. “Dead” pictures more than weakness—apart from God’s action they could not give themselves life—which is why the remedy in 2:5 is resurrection, not improvement. (Traditions differ on how far this inability reaches and how grace meets it; see Perspectives.) The same picture appears in Col 2:13.',
        provenance: synthesis(
          cite('bsb', 'Eph 2:1, 5; Col 2:13'),
          cite('tyndale-open-study-notes', 'on Eph 2:1–3'),
          cite('stepbible-tagnt', 'Eph 2:1 νεκρούς'),
          cite('calvin-commentaries', 'on Eph 2:1 (against the view that we are “half dead”)', 'https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.i.html'),
          cite('council-of-trent-session-6', 'Session 6, ch. 1 (free will weakened, not extinguished)', URL.trent6),
          cite('wesley-sermons', 'Sermon 85, III.4 (no one left in a state of mere nature)', URL.wesleyWorkingOut),
        ),
      },
      tags: ['dead', 'sin', 'trespasses', 'plight'],
    },
    {
      verse: e2(2),
      explanation: {
        text:
          'Life apart from Christ was a “walk” shaped by the age of this world and by “the ruler of the power of the air”—the devil, who works in those who disobey God. Sin is portrayed not only as individual choice but as bondage to outside powers. The verb “walk” returns in 2:10 with a new direction.',
        provenance: synthesis(cite('bsb', 'Eph 2:2'), cite('tyndale-open-study-notes', 'on Eph 2:2'), cite('stepbible-tagnt', 'Eph 2:2 περιεπατήσατε')),
      },
      tags: ['walk', 'powers', 'devil', 'world'],
    },
    {
      verse: e2(3),
      explanation: {
        text:
          'Paul includes himself—“all of us”—and describes life driven by the cravings of the flesh and mind. “Flesh” here refers to fallen human nature (the Tyndale notes speak of our sinful nature), not simply the physical body. “By nature children of wrath” means that, apart from grace, everyone stands under God’s just judgment on sin; Jew and Gentile share the plight.',
        provenance: synthesis(cite('bsb', 'Eph 2:3'), cite('tyndale-open-study-notes', 'on Eph 2:3'), cite('stepbible-tagnt', 'Eph 2:3 σαρκός, φύσει, ὀργῆς')),
      },
      tags: ['flesh', 'wrath', 'nature', 'plight'],
    },
    {
      verse: e2(4),
      explanation: {
        text:
          '“But God” is the hinge of the passage. Paul grounds everything that follows in God’s character—rich in mercy (eleos, the word the Greek Old Testament used for hesed) and acting from great love. Nothing in the readers prompted the rescue; the reason lies entirely in God.',
        provenance: synthesis(cite('bsb', 'Eph 2:4'), cite('stepbible-tbesg', 'G1656 ἔλεος'), cite('calvin-commentaries', 'on Eph 2:4', 'https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.ii.html')),
      },
      tags: ['but god', 'mercy', 'love', 'turning point'],
    },
    {
      verse: e2(5),
      explanation: {
        text:
          'God made us alive with Christ even when we were dead. Paul then breaks into his own sentence—“by grace you have been saved”—using a perfect participle that presents salvation as a completed rescue with lasting effect. This is the only place in the New Testament, besides 2:8, where that form appears.',
        provenance: synthesis(cite('bsb', 'Eph 2:5'), cite('stepbible-tagnt', 'Eph 2:5 συνεζωοποίησεν; σεσῳσμένοι (V-RPP-NPM)')),
      },
      tags: ['made alive', 'grace', 'saved', 'perfect tense'],
    },
    {
      verse: e2(6),
      explanation: {
        text:
          'Believers are raised with Christ and seated with him in the heavenly realms—language that echoes what God did for Christ in 1:20. Paul speaks of this as already true because believers are united with Christ; its full experience is still future, but their standing is secure in him.',
        provenance: synthesis(cite('bsb', 'Eph 1:20; 2:6'), cite('tyndale-open-study-notes', 'on Eph 2:6'), cite('calvin-commentaries', 'on Eph 2:6', 'https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.ii.html')),
      },
      tags: ['union with christ', 'raised', 'seated', 'heavenly realms'],
    },
    {
      verse: e2(7),
      explanation: {
        text:
          'God’s purpose reaches beyond the readers’ rescue: in the coming ages he will display the surpassing riches of his grace, expressed in kindness toward us in Christ. Saved people become a lasting exhibit of what God is like. The kindness (chrēstotēs) here is the same word used in Titus 3:4.',
        provenance: synthesis(cite('bsb', 'Eph 2:7; Titus 3:4'), cite('stepbible-tbesg', 'G5544 χρηστότης (Eph 2:7; Tit 3:4)')),
      },
      tags: ['purpose', 'riches', 'kindness', 'glory of god'],
    },
    {
      verse: e2(8),
      explanation: {
        text:
          'The thesis of the passage: saved by grace (what saves), through faith (how it is received), and this not from yourselves but God’s gift. Because “this” is neuter while grace and faith are feminine, many readers take it to cover the whole saving event. Christians have long discussed whether faith itself is included in the gift—Chrysostom and Augustine said yes, Calvin read the gift as salvation itself.',
        provenance: synthesis(
          cite('bsb', 'Eph 2:8'),
          cite('stepbible-tagnt', 'Eph 2:8 τοῦτο (D-NSN)'),
          cite('chrysostom-homilies-ephesians', 'Homily 4', URL.chrysostomEphHom4),
          cite('augustine-grace-free-will', 'ch. 17', URL.augustineGraceFreeWill),
          cite('calvin-commentaries', 'on Eph 2:9', URL.calvinEph2_8),
        ),
      },
      tags: ['grace', 'faith', 'gift', 'not from yourselves'],
    },
    {
      verse: e2(9),
      explanation: {
        text:
          'Not by works, so that no one can boast. If salvation were even partly earned, the saved could take some credit; grace removes every ground for pride before God (compare Rom 3:27; 1 Cor 1:29–31). The works excluded here are works as a basis for acceptance—Paul will affirm good works in the very next verse.',
        provenance: synthesis(cite('bsb', 'Eph 2:9; Rom 3:27; 1 Cor 1:29–31'), cite('tyndale-open-study-notes', 'on Eph 2:8–9')),
      },
      tags: ['works', 'boasting', 'pride', 'merit'],
    },
    {
      verse: e2(10),
      explanation: {
        text:
          'We are God’s workmanship (poiēma), created in Christ Jesus for good works that God prepared in advance for us to walk in. Good works are the result, not the cause, of salvation. The verse closes the circle begun in 2:2: the old walk in sin is replaced by a new walk in the works God has planned.',
        provenance: synthesis(cite('bsb', 'Eph 2:10'), cite('tyndale-open-study-notes', 'on Eph 2:10'), cite('stepbible-tagnt', 'Eph 2:10 ποίημα; περιπατήσωμεν')),
      },
      tags: ['workmanship', 'good works', 'new creation', 'walk'],
    },
  ],

  /* ---------------- Concepts (engine retrieval index) ---------------- */
  concepts: [
    {
      id: 'grace:concept:grace',
      label: 'Grace (charis)',
      aliases: [
        'grace',
        'graces',
        'gracious',
        'graciousness',
        'charis',
        'kharis',
        'χάρις',
        'χάριτι',
        'unmerited favor',
        'unmerited favour',
        'favor',
        'favour',
        'undeserved',
        'by grace',
        'amazing grace',
        'greek word for grace',
        'common grace',
      ],
      answer: {
        text:
          'The Greek word behind “grace” in Eph 2:5, 7 and 8 is charis—favour or goodwill on the part of a giver, and especially God’s free, undeserved favour. It could also mean the gift itself and the gratitude it calls for. In this passage Paul uses it to name the only source of salvation: God acted toward people who were spiritually dead, so salvation is his gift, not their achievement (2:8–9). Theologians also distinguish this saving grace from God’s common kindness to all people—see the Theology section.',
        provenance: synthesis(cite('stepbible-tbesg', 'G5485 χάρις'), cite('bsb', 'Eph 2:5–9')),
      },
      primarySection: 'original-languages',
      verses: [e2(5), e2(7), e2(8)],
      keyWordIds: ['grace:kw:charis', 'grace:kw:dorean', 'grace:kw:chen'],
      crossReferenceIds: ['grace:xr:rom-3-23', 'grace:xr:john-1-16', 'grace:xr:rom-11-6'],
      contextIds: ['grace:ctx:patronage'],
      themeIds: ['grace:th:gift', 'grace:th:common-grace'],
      perspectiveSetIds: [],
      commentaryIds: ['grace:cm:aquinas', 'grace:cm:packer', 'grace:cm:newton'],
    },
    {
      id: 'grace:concept:mercy',
      label: 'Mercy and love (Eph 2:4)',
      aliases: ['mercy', 'merciful', 'rich in mercy', 'eleos', 'ἔλεος', 'compassion', 'great love', 'love of god', 'kindness', 'chrestotes', 'χρηστότης'],
      answer: {
        text:
          'In 2:4 Paul grounds God’s rescue in his character: he is rich in mercy (eleos) and acts because of his great love. Mercy looks at the misery described in 2:1–3; grace looks at the undeserved gift of 2:5–8. In the Greek Old Testament eleos usually translates hesed, God’s steadfast covenant love, so Paul is echoing Israel’s confession of a God abounding in loving devotion (Exod 34:6).',
        provenance: synthesis(cite('stepbible-tbesg', 'G1656 ἔλεος'), cite('bsb', 'Eph 2:4; Exod 34:6')),
      },
      primarySection: 'original-languages',
      verses: [e2(4), e2(7)],
      keyWordIds: ['grace:kw:eleos', 'grace:kw:hesed'],
      crossReferenceIds: ['grace:xr:exod-34-6', 'grace:xr:titus-3-4', 'grace:xr:deut-7-7', 'grace:xr:rom-5-6'],
      contextIds: ['grace:ctx:hesed-covenant'],
      themeIds: ['grace:th:gift'],
      perspectiveSetIds: [],
      commentaryIds: [],
    },
    {
      id: 'grace:concept:saved',
      label: 'Saved (sōzō)',
      aliases: [
        'saved',
        'save',
        'salvation',
        'sozo',
        'sōzō',
        'σῴζω',
        'σεσῳσμένοι',
        'you have been saved',
        'have been saved',
        'perfect tense',
        'rescued',
        'rescue',
      ],
      answer: {
        text:
          'Both times Paul says “by grace you have been saved” (2:5, 8) he uses a perfect participle of sōzō, σεσῳσμένοι, with “you are”—presenting salvation as a completed rescue whose effects continue. In the whole New Testament this form appears only in these two verses. Elsewhere Paul also speaks of salvation as ongoing and still to come (1 Cor 1:18; Rom 5:9–10), so Ephesians highlights its secure present reality.',
        provenance: synthesis(cite('stepbible-tagnt', 'Eph 2:5, 2:8 (V-RPP-NPM)'), cite('stepbible-tbesg', 'G4982 σῴζω'), cite('bsb', '1 Cor 1:18; Rom 5:9–10')),
      },
      primarySection: 'original-languages',
      verses: [e2(5), e2(8)],
      keyWordIds: ['grace:kw:sozo'],
      crossReferenceIds: ['grace:xr:rom-5-6', 'grace:xr:titus-3-4'],
      contextIds: [],
      themeIds: ['grace:th:gift'],
      perspectiveSetIds: [],
      commentaryIds: ['grace:cm:wesley'],
    },
    {
      id: 'grace:concept:faith',
      label: 'Through faith',
      aliases: ['faith', 'pistis', 'πίστις', 'through faith', 'believe', 'belief', 'trust', 'faith alone', 'sola fide', 'is faith a gift'],
      answer: {
        text:
          'Paul says we are saved by grace through faith (2:8): grace is what saves, and faith is how the gift is received. Faith is not a work that earns salvation—which is why it fits with “not by works” (2:9). Spurgeon pictured grace as the fountain and faith as the aqueduct; Wesley called grace the source and faith the condition of salvation. Whether faith itself is part of the “gift” in 2:8 has been discussed since the early church.',
        provenance: synthesis(
          cite('bsb', 'Eph 2:8–9'),
          cite('stepbible-tagnt', 'Eph 2:8 διὰ πίστεως'),
          cite('spurgeon-all-of-grace', '“By Grace Through Faith”', URL.spurgeonAllOfGraceText),
          cite('wesley-sermons', 'Sermon 1, §3', URL.wesleySalvationByFaith),
        ),
      },
      primarySection: 'original-languages',
      verses: [e2(8)],
      keyWordIds: ['grace:kw:pistis'],
      crossReferenceIds: ['grace:xr:gal-2-20', 'grace:xr:rom-4-4', 'grace:xr:jas-2-14'],
      contextIds: [],
      themeIds: ['grace:th:gift', 'grace:th:justification'],
      perspectiveSetIds: ['grace:ps:grace-and-response'],
      commentaryIds: ['grace:cm:spurgeon', 'grace:cm:wesley', 'grace:cm:chrysostom', 'grace:cm:calvin'],
    },
    {
      id: 'grace:concept:gift',
      label: 'The gift of God — “not from yourselves”',
      aliases: [
        'gift',
        'gift of god',
        'doron',
        'dōron',
        'δῶρον',
        'not from yourselves',
        'not of yourselves',
        'free gift',
        'freely',
        'dorean',
        'dōrean',
        'δωρεάν',
        'this not from yourselves',
      ],
      answer: {
        text:
          'In 2:8 Paul calls salvation “the gift of God” (dōron), using a word that elsewhere usually means an offering people bring to God—here God is the giver. The “this” in “this not from yourselves” is neuter and does not match the feminine words grace and faith, so it most naturally refers to the whole event of being saved by grace through faith. Chrysostom and Augustine included faith in the gift; Calvin took the gift to be salvation itself.',
        provenance: synthesis(
          cite('stepbible-tagnt', 'Eph 2:8 τοῦτο (D-NSN); δῶρον'),
          cite('stepbible-tbesg', 'G1435 δῶρον'),
          cite('chrysostom-homilies-ephesians', 'Homily 4', URL.chrysostomEphHom4),
          cite('calvin-commentaries', 'on Eph 2:9', URL.calvinEph2_8),
        ),
      },
      primarySection: 'original-languages',
      verses: [e2(8)],
      keyWordIds: ['grace:kw:doron', 'grace:kw:dorean'],
      crossReferenceIds: ['grace:xr:rom-3-23', 'grace:xr:rom-4-4'],
      contextIds: ['grace:ctx:patronage'],
      themeIds: ['grace:th:gift'],
      perspectiveSetIds: ['grace:ps:grace-and-response'],
      commentaryIds: ['grace:cm:chrysostom', 'grace:cm:calvin'],
    },
    {
      id: 'grace:concept:works',
      label: 'Works, boasting and James',
      aliases: [
        'works',
        'not by works',
        'good works',
        'boast',
        'boasting',
        'merit',
        'earn',
        'earned',
        'earning',
        'deserve',
        'james',
        'faith and works',
        'faith without works',
        'james 2',
      ],
      answer: {
        text:
          'Paul excludes works as the ground of salvation “so that no one can boast” (2:9), then immediately says we were created for good works (2:10)—the same Greek noun, first with “from”, then with “for”. James’s warning that faith without deeds is dead (Jas 2:14–26) targets a faith that produces nothing; Paul rules out works as the basis of acceptance. Together they teach that grace saves apart from works and never leaves people without them.',
        provenance: synthesis(cite('stepbible-tagnt', 'Eph 2:9–10 (G2041)'), cite('bsb', 'Eph 2:9–10; Jas 2:14–26')),
      },
      primarySection: 'cross-references',
      verses: [e2(9), e2(10)],
      keyWordIds: ['grace:kw:pistis'],
      crossReferenceIds: ['grace:xr:jas-2-14', 'grace:xr:rom-11-6', 'grace:xr:rom-4-4', 'grace:xr:luke-18-9', 'grace:xr:gal-2-20'],
      contextIds: [],
      themeIds: ['grace:th:gift', 'grace:th:sanctification'],
      perspectiveSetIds: ['grace:ps:joint-declaration'],
      commentaryIds: ['grace:cm:augustine', 'grace:cm:keller'],
    },
    {
      id: 'grace:concept:workmanship',
      label: 'God’s workmanship (poiēma)',
      aliases: ['workmanship', 'poiema', 'poiēma', 'ποίημα', 'masterpiece', 'handiwork', 'new creation', 'created in christ', 'prepared in advance', 'verse 10'],
      answer: {
        text:
          'In 2:10 Paul calls believers God’s workmanship (poiēma), a word used only one other time in the New Testament—for creation itself in Rom 1:20. The God who made the world has made a new people, “created in Christ Jesus” for good works he prepared in advance. Good works are the purpose and fruit of salvation, not its cause, and the “walk” of 2:10 replaces the old walk of 2:2.',
        provenance: synthesis(cite('stepbible-tbesg', 'G4161 ποίημα'), cite('bsb', 'Eph 2:2, 10; Rom 1:20'), cite('tyndale-open-study-notes', 'on Eph 2:10')),
      },
      primarySection: 'original-languages',
      verses: [e2(10)],
      keyWordIds: ['grace:kw:poiema'],
      crossReferenceIds: ['grace:xr:2-cor-5-17', 'grace:xr:phil-1-6', 'grace:xr:ezek-36-26'],
      contextIds: [],
      themeIds: ['grace:th:sanctification', 'grace:th:election'],
      perspectiveSetIds: [],
      commentaryIds: ['grace:cm:augustine', 'grace:cm:piper'],
    },
    {
      id: 'grace:concept:dead-alive',
      label: 'From death to life: “But God”',
      aliases: [
        'dead',
        'dead in sin',
        'dead in trespasses',
        'trespasses',
        'made alive',
        'quickened',
        'but god',
        'flesh',
        'children of wrath',
        'wrath',
        'ruler of the power of the air',
        'raised with christ',
        'seated with christ',
        'heavenly realms',
        'union with christ',
      ],
      answer: {
        text:
          'Paul describes life apart from Christ as death (2:1), bondage to the world and the devil (2:2), and life driven by the flesh—fallen human nature—under God’s just wrath (2:3). Then comes the hinge: “But God” (2:4). The dead do not revive themselves; God made us alive, raised us and seated us with Christ (2:5–6), echoing what he did for Christ in 1:20.',
        provenance: synthesis(cite('bsb', 'Eph 1:20; 2:1–6'), cite('tyndale-open-study-notes', 'on Eph 2:1–6'), cite('stepbible-tagnt', 'Eph 2:4–6')),
      },
      primarySection: 'literary-context',
      verses: [e2(1), e2(2), e2(3), e2(4), e2(5), e2(6)],
      keyWordIds: ['grace:kw:sozo', 'grace:kw:eleos'],
      crossReferenceIds: ['grace:xr:col-2-13', 'grace:xr:rom-5-6', 'grace:xr:ezek-36-26'],
      contextIds: ['grace:ctx:powers'],
      themeIds: ['grace:th:gift'],
      perspectiveSetIds: ['grace:ps:grace-and-response'],
      commentaryIds: ['grace:cm:packer'],
    },
    {
      id: 'grace:concept:grace-and-response',
      label: 'Grace and human response: where Christians differ',
      aliases: [
        'different interpretations',
        'theological interpretations',
        'calvinism',
        'calvinist',
        'reformed',
        'arminian',
        'arminianism',
        'wesleyan',
        'catholic',
        'lutheran',
        'orthodox',
        'free will',
        'predestination',
        'election',
        'monergism',
        'synergy',
        'prevenient grace',
        'irresistible grace',
        'pelagius',
        'pelagianism',
        'theosis',
        'joint declaration',
      ],
      answer: {
        text:
          'All major traditions affirm that salvation is by God’s grace and cannot be earned; they differ on how grace works in the human will. Reformed theology teaches effectual grace that gives the faith it calls for; Arminian and Wesleyan theology teaches prevenient grace that enables a free, resistible response; Catholic teaching speaks of grace that heals and elevates with real cooperation; Lutherans confess that God alone converts through Word and sacrament, yet his grace can be resisted, and stress grace as God’s favour received by faith alone; and Orthodoxy speaks of synergy with God’s uncreated energies. The Theology section sets each out with its sources.',
        provenance: synthesis(
          cite('canons-of-dort', 'III/IV', URL.schaffCreeds3),
          cite('articles-of-remonstrance', 'III–IV', URL.schaffCreeds3),
          cite('council-of-trent-session-6', 'Session 6', URL.trent6),
          cite('augsburg-confession', 'Art. IV', URL.augsburg),
          cite('formula-of-concord-schaff', 'Epitome, Arts. II and XI', URL.formulaConcordEpitome),
          cite('lossky-mystical-theology', 'chs. 4, 10', URL.losskyPublisher),
        ),
      },
      primarySection: 'theology',
      verses: [e2(8), e2(9), e2(10)],
      keyWordIds: [],
      crossReferenceIds: [],
      contextIds: [],
      themeIds: ['grace:th:election', 'grace:th:justification', 'grace:th:common-grace'],
      perspectiveSetIds: ['grace:ps:grace-and-response', 'grace:ps:joint-declaration'],
      commentaryIds: ['grace:cm:augustine', 'grace:cm:chrysostom', 'grace:cm:aquinas', 'grace:cm:calvin', 'grace:cm:wesley'],
    },
    {
      id: 'grace:concept:original-audience',
      label: 'How the first readers heard “grace”',
      aliases: [
        'original audience',
        'first readers',
        'first audience',
        'patronage',
        'patron',
        'benefactor',
        'benefaction',
        'reciprocity',
        'gratitude',
        'roman world',
        'ephesus',
        'gentiles',
        'who wrote ephesians',
        'authorship',
      ],
      answer: {
        text:
          'Paul’s mostly Gentile readers in the province of Asia used charis for the favour of a patron or benefactor, for the gift itself, and for the gratitude it obliged. Hearing that they were saved by grace, they would most likely have pictured God as the supreme benefactor—though Paul’s God gives his greatest gift to the unworthy, even to enemies, and his gift creates a new, grateful way of life (2:10). Scholars such as David deSilva and John Barclay have explored this background.',
        provenance: synthesis(
          cite('desilva-patronage-reciprocity', 'pp. 38–39, 52–53', URL.desilvaArticle),
          cite('barclay-paul-and-the-gift', 'as summarised by D. J. Moo', URL.mooOnBarclay),
          cite('tyndale-open-study-notes', 'Ephesians introduction'),
        ),
      },
      primarySection: 'historical-context',
      verses: [e2(5), e2(8), e2(10), vr('EPH', 2, 12)],
      keyWordIds: ['grace:kw:charis'],
      crossReferenceIds: ['grace:xr:rom-5-6'],
      contextIds: ['grace:ctx:patronage', 'grace:ctx:surprising-grace', 'grace:ctx:gentiles', 'grace:ctx:recipients', 'grace:ctx:authorship', 'grace:ctx:ephesus'],
      themeIds: [],
      perspectiveSetIds: [],
      commentaryIds: ['grace:cm:piper'],
    },
    {
      id: 'grace:concept:living-by-grace',
      label: 'Living by grace: cheap grace, costly grace',
      aliases: [
        'cheap grace',
        'costly grace',
        'license',
        'licence',
        'license to sin',
        'keep sinning',
        'continue in sin',
        'sanctification',
        'holiness',
        'grace trains',
        'debtor',
        'bonhoeffer',
      ],
      answer: {
        text:
          'Because grace is free, some have treated it as permission to sin; Paul answers that those united with Christ walk in newness of life (Rom 6:1–4), and the grace that saves also trains us to live godly lives (Titus 2:11–12). Bonhoeffer called grace without discipleship “cheap grace”, contrasting it with the costly grace of Christ’s call. Eph 2:10 makes the same point: we are saved not by good works but for them.',
        provenance: synthesis(
          cite('bsb', 'Rom 6:1–4; Titus 2:11–12; Eph 2:10'),
          cite('bonhoeffer-discipleship', 'ch. 1', URL.bonhoefferDiscipleship),
        ),
      },
      primarySection: 'theology',
      verses: [e2(10)],
      keyWordIds: ['grace:kw:poiema'],
      crossReferenceIds: ['grace:xr:rom-6-1', 'grace:xr:jas-2-14', 'grace:xr:phil-1-6'],
      contextIds: [],
      themeIds: ['grace:th:sanctification', 'grace:th:means'],
      perspectiveSetIds: [],
      commentaryIds: ['grace:cm:bonhoeffer', 'grace:cm:piper'],
    },
    {
      id: 'grace:concept:means-of-grace',
      label: 'The means of grace: Word, sacraments, prayer',
      aliases: [
        'means of grace',
        'sacraments',
        'sacrament',
        'ordinances',
        'ordinance',
        'word and sacrament',
        'lord’s supper',
        "lord's supper",
        'baptism',
      ],
      answer: {
        text:
          'Many traditions—Catholic, Lutheran, Reformed and Methodist among them—teach that God ordinarily gives and nourishes grace through appointed means, above all the Word and the sacraments, together with prayer. The Westminster Shorter Catechism (Q. 88) names word, sacraments and prayer; the Augsburg Confession (Art. V) says the Spirit, who works faith, is given through Word and sacraments; and Wesley called prayer, Scripture and the Lord’s Supper the chief ordinary channels of grace. Some free-church Christians instead describe baptism and the Supper as symbolic acts of obedience, and early Quakers held that the outward rites were no longer needed. The Theology section sets these out with their sources.',
        provenance: synthesis(
          cite('westminster-shorter-catechism', 'Q. 88', URL.schaffCreeds3),
          cite('augsburg-confession', 'Art. V', URL.augsburg),
          cite('catechism-catholic-church', '§2003', URL.cccGrace),
          cite('wesley-sermons', 'Sermon 16, The Means of Grace, II.1', URL.wesleyMeansOfGrace),
          cite('baptist-faith-and-message-2000', 'Art. VII', URL.bfm2000),
          cite('barclay-apology', 'Propositions 12–13', URL.barclayApology),
        ),
      },
      primarySection: 'theology',
      verses: [e2(8)],
      keyWordIds: [],
      crossReferenceIds: [],
      contextIds: [],
      themeIds: ['grace:th:means'],
      perspectiveSetIds: [],
      commentaryIds: [],
    },
    {
      id: 'grace:concept:old-testament',
      label: 'Grace in the Old Testament',
      aliases: [
        'old testament',
        'hebrew',
        'hebrew word for grace',
        'chen',
        'חֵן',
        'hesed',
        'chesed',
        'חֶסֶד',
        'lovingkindness',
        'loving devotion',
        'steadfast love',
        'chanan',
        'חָנַן',
        'found favor',
        'found favour',
        'noah',
        'gracious and compassionate',
      ],
      answer: {
        text:
          'Grace is not a New Testament invention. The Hebrew chen means favour (Noah found favor with the LORD, Gen 6:8), the verb chanan means to be gracious (Num 6:25; Ps 51:1), and hesed is God’s steadfast, loyal love. At Sinai God revealed himself as gracious and compassionate, abounding in hesed (Exod 34:6–7), and he chose Israel out of love, not merit (Deut 7:7–8). The Greek Old Testament rendered chen with charis and hesed with eleos—the very words Paul uses in Eph 2:4–8.',
        provenance: synthesis(
          cite('stepbible-tbesh', 'H2580, H2603A, H2617A'),
          cite('stepbible-tbesg', 'G5485, G1656 (LXX equivalents)'),
          cite('bsb', 'Gen 6:8; Num 6:25; Ps 51:1; Exod 34:6–7; Deut 7:7–8'),
        ),
      },
      primarySection: 'key-passages',
      verses: [e2(4), e2(5)],
      keyWordIds: ['grace:kw:chen', 'grace:kw:hesed', 'grace:kw:chanan'],
      crossReferenceIds: ['grace:xr:exod-34-6', 'grace:xr:deut-7-7', 'grace:xr:ezek-36-26'],
      contextIds: ['grace:ctx:hesed-covenant'],
      themeIds: ['grace:th:election'],
      perspectiveSetIds: [],
      commentaryIds: [],
    },
  ],

  suggestedQuestions: [
    'What is the Greek word behind “grace”?',
    'What does Paul mean by flesh here?',
    'Explain verse 8 in more detail.',
    'How would the original audience have understood grace?',
    'Where else does Paul talk about being saved by grace?',
    'How does this connect with Romans?',
    'How does Ephesians 2:10 fit with James 2?',
    'What did Tim Keller say about grace?',
    'Are there different theological interpretations of this passage?',
  ],

  /* ---------------- Sources introduced by this study ---------------- */
  sources: [
    {
      id: 'augustine-grace-free-will',
      type: 'book',
      title: 'On Grace and Free Will (De gratia et libero arbitrio)',
      authorIds: ['augustine'],
      year: '426 or 427',
      publisher: 'Nicene and Post-Nicene Fathers, First Series, vol. 5 (Christian Literature Publishing Co., 1887)',
      url: URL.augustineGraceFreeWill,
      edition: 'trans. Peter Holmes and Robert Ernest Wallis, rev. Benjamin B. Warfield (NPNF1 5, 1887); New Advent edition',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Augustine’s late anti-Pelagian treatise arguing that grace is not given according to merit, with extended comment on Eph 2:8–10.',
    },
    {
      id: 'augustine-spirit-letter',
      type: 'book',
      title: 'On the Spirit and the Letter (De spiritu et littera)',
      authorIds: ['augustine'],
      year: '412',
      publisher: 'Nicene and Post-Nicene Fathers, First Series, vol. 5 (Christian Literature Publishing Co., 1887)',
      url: URL.augustineSpiritLetter,
      edition: 'trans. Peter Holmes and Robert Ernest Wallis, rev. Benjamin B. Warfield (NPNF1 5, 1887); New Advent edition',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Augustine’s treatise on law and grace, addressed to Marcellinus in 412, arguing that the letter kills while the Spirit gives life.',
    },
    {
      id: 'chrysostom-homilies-ephesians',
      type: 'commentary',
      title: 'Homilies on Ephesians',
      authorIds: ['chrysostom'],
      publisher: 'Nicene and Post-Nicene Fathers, First Series, vol. 13 (Christian Literature Publishing Co., 1889)',
      url: URL.chrysostomEphHom4,
      edition: 'trans. Gross Alexander (NPNF1 13, 1889); New Advent edition',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'John Chrysostom’s verse-by-verse sermons on Ephesians; Homily 4 expounds Eph 2:1–10.',
    },
    {
      id: 'wesley-sermons',
      type: 'sermon',
      title: 'Sermons on Several Occasions',
      authorIds: ['wesley'],
      url: URL.wesleySermons,
      edition: 'CCEL edition: 141 sermons in five series, text and numbering of the 1872 (Jackson) edition',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description:
        'John Wesley’s collected sermons. The sermons of his first four volumes (the “standard sermons”), together with his Explanatory Notes upon the New Testament, serve as doctrinal standards in Methodism; CCEL notes that the last three series of its collection were published without Wesley’s knowledge.',
    },
    {
      id: 'wesley-works-digital-edition',
      type: 'website',
      title: 'The Wesley Works Digital Edition: Sermons',
      authorIds: ['wesley'],
      year: '2024',
      publisher: 'Wesley Works Editorial Project (Wesley Works Digitization Project)',
      url: URL.wesleyWorksSermon1,
      edition: 'Digital text of the critical edition of Wesley’s sermons (Works, vols. 1–4), with editorial introductions and notes',
      license: { status: 'copyrighted', name: '© Wesley Works Editorial Project (editorial matter)', usage: 'summary-only' },
      description:
        'The digital branch of the Wesley Works Editorial Project, presenting all of Wesley’s sermons with the critical edition’s notes; used here for the corrected date of Sermon 1.',
    },
    {
      id: 'newton-olney-hymns',
      type: 'book',
      title: 'Olney Hymns',
      authorIds: ['john-newton'],
      year: '1779',
      publisher: 'London: W. Oliver',
      url: URL.olneyHymns,
      edition: 'CCEL text (print basis: London: W. Oliver, 1779)',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Hymns by John Newton and William Cowper, including the hymn now known as “Amazing Grace” (Book I, Hymn 41).',
    },
    {
      id: 'spurgeon-all-of-grace',
      type: 'book',
      title: 'All of Grace',
      authorIds: ['spurgeon'],
      year: '1886',
      publisher: 'London: Passmore & Alabaster',
      url: URL.spurgeonAllOfGrace,
      edition: 'CCEL edition',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Spurgeon’s short evangelistic book on salvation by grace through faith, written for enquirers.',
    },
    {
      id: 'spurgeon-salvation-all-of-grace',
      type: 'sermon',
      title: 'Salvation All of Grace',
      authorIds: ['spurgeon'],
      year: '1872',
      publisher: 'Metropolitan Tabernacle Pulpit, vol. 18',
      url: URL.spurgeonSalvationAllOfGrace,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Sermon on Eph 2:8 preached on 4 August 1872 (Metropolitan Tabernacle Pulpit, vol. 18), hosted by The Spurgeon Library.',
    },
    {
      id: 'bonhoeffer-discipleship',
      type: 'book',
      title: 'Discipleship (Nachfolge; formerly The Cost of Discipleship)',
      authorIds: ['bonhoeffer'],
      year: '1937',
      publisher: 'English edition: Fortress Press (Dietrich Bonhoeffer Works)',
      url: URL.bonhoefferDiscipleship,
      edition:
        'Reader’s Edition, ed. Victoria J. Barnett, intro. Geffrey B. Kelly (Minneapolis: Fortress Press, 2015), using the Dietrich Bonhoeffer Works translation by Barbara Green and Reinhard Krauss',
      license: { status: 'copyrighted', name: '© Fortress Press (English translation)', usage: 'summary-only' },
      description: 'Bonhoeffer’s exposition of following Christ, centred on the Sermon on the Mount and opening with the contrast of cheap and costly grace.',
    },
    // Shared id: definition kept identical to the romans-8 study so the registry merges cleanly.
    {
      id: 'keller-prodigal-god',
      type: 'book',
      title: 'The Prodigal God: Recovering the Heart of the Christian Faith',
      authorIds: ['tim-keller'],
      year: '2008',
      publisher: 'Dutton (Penguin)',
      url: URL.kellerProdigalGod,
      license: { status: 'copyrighted', name: '© Timothy Keller', usage: 'summary-only' },
      description: 'Keller’s short book on the parable of the father and his two sons (Luke 15:11–32).',
    },
    {
      id: 'keller-the-grace-of-god',
      type: 'sermon',
      title: 'The Grace of God',
      authorIds: ['tim-keller'],
      year: '2011',
      publisher: 'Gospel in Life (Redeemer Presbyterian Church)',
      url: URL.kellerGraceOfGod,
      license: { status: 'copyrighted', name: '© Gospel in Life', usage: 'summary-only' },
      description: 'Sermon on Eph 2:1–10 preached 1 May 2011 in the series To Know the Living God.',
    },
    {
      id: 'piper-future-grace',
      type: 'book',
      title: 'Future Grace: The Purifying Power of the Promises of God',
      authorIds: ['john-piper'],
      year: '1995 (rev. 2012)',
      publisher: 'Multnomah',
      url: URL.piperFutureGrace,
      edition: 'Revised edition, Multnomah Books, 2012; first published 1995 as The Purifying Power of Living by Faith in Future Grace',
      license: { status: 'copyrighted', name: '© Desiring God Foundation', usage: 'summary-only' },
      description: 'Piper’s book on sanctification by faith in God’s promises; Desiring God offers the 2012 edition as a free PDF.',
    },
    {
      id: 'piper-but-god',
      type: 'sermon',
      title: 'But God...',
      authorIds: ['john-piper'],
      year: '1985',
      publisher: 'Desiring God',
      url: URL.piperButGod,
      license: { status: 'copyrighted', name: '© Desiring God Foundation', usage: 'summary-only' },
      description: 'Sermon on Eph 2:1–9 preached 22 December 1985 at Bethlehem Baptist Church.',
    },
    {
      id: 'desilva-patronage-reciprocity',
      type: 'article',
      title: 'Patronage and Reciprocity: The Context of Grace in the New Testament',
      authorIds: ['david-desilva'],
      year: '1999',
      publisher: 'Ashland Theological Journal 31',
      url: URL.desilvaArticle,
      license: { status: 'copyrighted', name: '© Ashland Theological Journal', usage: 'summary-only' },
      description: 'DeSilva’s study of patronage, friendship and benefaction as the social context of charis in the New Testament.',
    },
    {
      id: 'desilva-honor-patronage',
      type: 'book',
      title: 'Honor, Patronage, Kinship & Purity: Unlocking New Testament Culture',
      authorIds: ['david-desilva'],
      year: '2000 (2nd ed. 2022)',
      publisher: 'InterVarsity Press',
      url: URL.desilvaBook,
      edition: '2nd ed. 2022 (linked sample: ch. 1, “Honor and Shame”)',
      license: { status: 'copyrighted', name: '© David A. deSilva', usage: 'summary-only' },
      description: 'A widely used introduction to four cultural values of the New Testament world, including patronage and grace.',
    },
    {
      id: 'barclay-paul-and-the-gift',
      type: 'book',
      title: 'Paul and the Gift',
      authorIds: ['john-barclay'],
      year: '2015',
      publisher: 'Eerdmans',
      url: URL.barclayEerdmans,
      license: { status: 'copyrighted', name: '© John M. G. Barclay', usage: 'summary-only' },
      description: 'Major study of grace in Paul against ancient gift-giving, distinguishing six “perfections” of grace (superabundance, singularity, priority, incongruity, efficacy, non-circularity).',
    },
    {
      id: 'lossky-mystical-theology',
      type: 'book',
      title: 'The Mystical Theology of the Eastern Church',
      authorIds: ['vladimir-lossky'],
      year: '1944 (English 1957)',
      publisher: 'James Clarke & Co.',
      url: URL.losskyPublisher,
      license: { status: 'copyrighted', name: '© James Clarke & Co.', usage: 'summary-only' },
      description: 'Lossky’s classic exposition of Orthodox theology, including chapters on the uncreated energies and the way of union with God.',
    },
    {
      id: 'hodge-systematic-theology-vol2',
      type: 'book',
      title: 'Systematic Theology, vol. 2',
      authorIds: ['charles-hodge'],
      year: '1871',
      publisher: 'Charles Scribner and Company',
      url: URL.hodge2,
      edition: 'Vol. II of 3 (1871–1873); CCEL text of the Eerdmans reprint (Grand Rapids, 1940)',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Charles Hodge’s standard nineteenth-century Reformed systematic theology; Part III, ch. XIV discusses common and efficacious grace.',
    },
    // Shared id: definition kept identical to the romans-8 study (same Schaff/CCEL text) so the registry merges cleanly.
    // Shared id: definition kept identical to the salvation/predestination topics so the registry merges cleanly.
    {
      id: 'westminster-shorter-catechism',
      type: 'catechism',
      title: 'Westminster Shorter Catechism',
      authorIds: [],
      year: '1647',
      publisher: 'in Philip Schaff, The Creeds of Christendom, vol. 3',
      url: URL.schaffCreeds3,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'The Westminster Assembly’s catechism, a standard of Presbyterian and many Reformed churches.',
    },
    // Shared ids: definitions kept identical to the salvation topic so the registry merges cleanly.
    {
      id: 'lcms-jddj-guide',
      type: 'article',
      title: 'Ecumenical Discussions on Justification – the Joint Declaration on the Doctrine of Justification (Participant’s Guide)',
      authorIds: [],
      year: '2018',
      publisher: 'The Lutheran Church—Missouri Synod, Commission on Theology and Church Relations',
      url: URL.lcmsJddj,
      license: { status: 'copyrighted', name: '© The Lutheran Church—Missouri Synod', usage: 'summary-only' },
      description: 'A confessional Lutheran study guide evaluating the Joint Declaration, drawing on the LCMS’s 1999 evaluation.',
    },
    {
      id: 'catholic-encyclopedia-semipelagianism',
      type: 'encyclopedia',
      title: 'Semipelagianism (Catholic Encyclopedia)',
      authorIds: [],
      year: '1912',
      publisher: 'Robert Appleton Company (The Catholic Encyclopedia, vol. 13), via New Advent',
      url: URL.semipelagianism,
      edition: 'Article by Joseph Pohle',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Encyclopedia article on the fifth- and sixth-century controversy settled at the Second Council of Orange (529).',
    },
    {
      id: 'carthage-418-canons',
      type: 'creed',
      title: 'Code of Canons of the African Church (Council of Carthage, 419), incl. the canons against Pelagius',
      authorIds: [],
      year: '418–419',
      publisher: 'Nicene and Post-Nicene Fathers, Second Series, vol. 14 (New Advent)',
      url: URL.carthage,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'The African canons, including those of the synod against the heresy of Pelagius and Celestius, affirming the necessity of grace.',
    },
    {
      id: 'baptist-faith-and-message-2000',
      type: 'confession',
      title: 'The Baptist Faith and Message (2000)',
      authorIds: [],
      year: '2000',
      publisher: 'Southern Baptist Convention',
      url: URL.bfm2000,
      license: { status: 'copyrighted', name: '© Southern Baptist Convention', usage: 'summary-only' },
      description:
        'The confessional statement of the Southern Baptist Convention; Article VII describes baptism and the Lord’s Supper as symbolic acts of obedience.',
    },
    {
      id: 'barclay-apology',
      type: 'book',
      title: 'An Apology for the True Christian Divinity',
      authorIds: ['robert-barclay'],
      year: '1676 (Latin); 1678 (English)',
      publisher: 'Birmingham: John Baskerville (eighth English edition, 1765)',
      url: URL.barclayApology,
      edition: 'Project Gutenberg eBook #56487 of the eighth English edition (1765)',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description:
        'Robert Barclay’s explanation and defence of Quaker principles; Propositions 12–13 treat baptism and the Lord’s Supper as inward and spiritual.',
    },
  ],

  /* ---------------- Authors introduced by this study ---------------- */
  authors: [
    {
      id: 'john-newton',
      name: 'John Newton',
      lifespan: '1725–1807',
      era: 'post-reformation',
      tradition: 'Anglican (evangelical)',
      description:
        'English evangelical Anglican clergyman and later opponent of the slave trade, who had earlier captained slave ships; author of the hymn now known as “Amazing Grace”.',
      aliases: ['newton', 'john newton'],
    },
    {
      id: 'vladimir-lossky',
      name: 'Vladimir Lossky',
      lifespan: '1903–1958',
      era: 'modern',
      tradition: 'Eastern Orthodox (Russian)',
      description:
        'Russian Orthodox theologian of the Paris emigration, born in Göttingen and raised in St Petersburg, who taught dogmatic theology in Paris; his Mystical Theology of the Eastern Church (1944) became a standard account of Orthodox theology.',
      aliases: ['lossky', 'vladimir lossky'],
    },
    {
      id: 'robert-barclay',
      name: 'Robert Barclay',
      lifespan: '1648–1690',
      era: 'post-reformation',
      tradition: 'Quaker (Religious Society of Friends)',
      description:
        'Scottish Quaker writer whose Apology for the True Christian Divinity (Latin 1676, English 1678) set out and defended the principles of the early Quakers.',
      aliases: ['robert barclay'],
    },
    {
      id: 'david-desilva',
      name: 'David A. deSilva',
      era: 'contemporary',
      tradition: 'New Testament scholar (Ashland Theological Seminary)',
      description: 'New Testament scholar known for work on the social and cultural world of early Christianity.',
      aliases: ['desilva', 'david desilva', 'david a. desilva'],
    },
    {
      id: 'john-barclay',
      name: 'John M. G. Barclay',
      lifespan: 'b. 1958',
      era: 'contemporary',
      tradition: 'New Testament scholar (Durham University)',
      description: 'British New Testament scholar, Lightfoot Professor of Divinity at Durham University from 2003 until 2025; author of Paul and the Gift (2015).',
      aliases: ['barclay', 'john barclay', 'j. m. g. barclay'],
    },
  ],
};

export default study;
