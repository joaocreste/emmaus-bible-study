import type { Author, CuratedTopic, PassageRef, Source } from '../../../domain/models';
import { cite, summaryOf, synthesis, text } from '../../../domain/provenance';

/** Verse range within one chapter. */
const v = (book: string, chapter: number, from: number, to: number = from): PassageRef => ({
  book,
  startChapter: chapter,
  startVerse: from,
  endChapter: chapter,
  endVerse: to,
});

const CREED_381_URL = 'https://www.newadvent.org/fathers/3808.htm';
const CITY_OF_GOD_XX_URL = 'https://www.newadvent.org/fathers/120120.htm';
const IRENAEUS_V32_URL = 'https://www.newadvent.org/fathers/0103532.htm';
const JUSTIN_80_URL = 'https://www.newadvent.org/fathers/01286.htm';
const DTS_URL = 'https://www.dts.edu/why-dts/doctrinal-statement';
const HODGE_URL = 'https://archive.org/details/systematictheo03hodg';
const CLOUSE_URL = 'https://archive.org/details/lccn_76055556';
const AUGSBURG_XVII_URL = 'https://bookofconcord.org/augsburg-confession/of-christs-return-to-judgment/';

const sources: Source[] = [
  {
    id: 'clouse-meaning-of-the-millennium',
    type: 'book',
    title: 'The Meaning of the Millennium: Four Views',
    authorIds: [],
    year: '1977',
    publisher: 'InterVarsity Press, Downers Grove',
    url: CLOUSE_URL,
    edition: 'Ed. Robert G. Clouse; essays by George Eldon Ladd, Herman A. Hoyt, Loraine Boettner and Anthony A. Hoekema',
    license: { status: 'copyrighted', name: '© 1977 InterVarsity Press', usage: 'summary-only' },
    description:
      'A debate volume in which proponents of historic premillennialism, dispensational premillennialism, postmillennialism and amillennialism each state and defend their view.',
  },
  {
    id: 'justin-dialogue-with-trypho',
    type: 'book',
    title: 'Dialogue with Trypho',
    authorIds: ['justin-martyr'],
    year: '2nd century',
    url: JUSTIN_80_URL,
    edition: 'Trans. Marcus Dods and George Reith, Ante-Nicene Fathers, vol. 1 (1885), via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'Justin’s account of a debate with a Jew named Trypho about Jesus as the Messiah foretold in the Scriptures.',
  },
  {
    id: 'dts-doctrinal-statement',
    type: 'confession',
    title: 'Doctrinal Statement',
    authorIds: [],
    publisher: 'Dallas Theological Seminary',
    url: DTS_URL,
    license: { status: 'copyrighted', name: '© Dallas Theological Seminary', usage: 'summary-only' },
    description: 'The doctrinal statement of Dallas Theological Seminary, a leading institution of dispensational theology.',
  },
  {
    id: 'hodge-systematic-theology',
    type: 'book',
    title: 'Systematic Theology, vol. 3',
    authorIds: ['charles-hodge'],
    year: '1872',
    publisher: 'Scribner, Armstrong & Co., New York',
    url: HODGE_URL,
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'The third volume of Charles Hodge’s influential Princeton systematic theology, covering soteriology and eschatology.',
  },
];

const authors: Author[] = [
  {
    id: 'justin-martyr',
    name: 'Justin Martyr',
    lifespan: 'd. c. 165',
    era: 'early-church',
    tradition: 'Early Christian apologist',
    description: 'Philosopher-convert and apologist in Rome, author of two Apologies and the Dialogue with Trypho; martyred in Rome.',
    aliases: ['justin', 'justin martyr', 'st justin'],
  },
  {
    id: 'george-eldon-ladd',
    name: 'George Eldon Ladd',
    lifespan: '1911–1982',
    era: 'contemporary',
    tradition: 'Evangelical (Baptist)',
    description: 'New Testament scholar at Fuller Theological Seminary, known for his work on the kingdom of God and for historic premillennialism.',
    aliases: ['ladd', 'george ladd', 'george eldon ladd', 'g. e. ladd'],
  },
];

const topic: CuratedTopic = {
  id: 'kingdom-of-god',
  name: 'The Kingdom of God',
  aliases: [
    'kingdom of god',
    'the kingdom of god',
    'kingdom of heaven',
    'the kingdom of heaven',
    'god’s kingdom',
    "god's kingdom",
    'gods kingdom',
    'reign of god',
    'your kingdom come',
    'already and not yet',
    'millennium',
    'the millennium',
    'millennial views',
    'thousand years',
    'amillennialism',
    'premillennialism',
    'postmillennialism',
    'dispensationalism',
    'rapture',
    'what is the kingdom of god',
    'basileia',
  ],
  topic: {
    name: 'The Kingdom of God',
    question: 'What is the kingdom of God?',
    definition: text(
      'The kingdom of God is God’s reign—his rightful rule breaking into a rebellious world to set it right. The Psalms celebrate God’s everlasting kingship (Ps 145:11–13), and Daniel foresees an indestructible kingdom given to one like a son of man (Dan 2:44; 7:13–14). Jesus begins his ministry announcing that the time is fulfilled and the kingdom has come near, calling people to repent and believe (Mark 1:14–15). The Greek basileia means royal power or reign as well as a realm. The kingdom is already present in Jesus’ works (Matt 12:28), yet it grows from small beginnings (Matt 13:31–33), and disciples still pray for it to come (Matt 6:10). Believers have been brought into the kingdom of God’s Son (Col 1:13) and await its fullness, when Christ hands the kingdom to the Father (1 Cor 15:24–28).',
      synthesis(
        cite('bsb', 'Ps 145:11–13'),
        cite('bsb', 'Dan 2:44'),
        cite('bsb', 'Dan 7:13–14'),
        cite('bsb', 'Mark 1:14–15'),
        cite('bsb', 'Matt 12:28'),
        cite('bsb', 'Matt 13:31–33'),
        cite('bsb', 'Matt 6:10'),
        cite('bsb', 'Col 1:13'),
        cite('bsb', '1 Cor 15:24–28'),
        cite('stepbible-tbesg', 'G0932 βασιλεία'),
      ),
    ),
    keyPassages: [
      {
        id: 'kingdom-of-god:kp:1',
        ref: v('PSA', 145, 10, 13),
        title: 'An everlasting kingdom',
        note: text(
          'God’s people speak of the glory of his kingdom so that all may know it; his dominion endures through all generations.',
          synthesis(cite('bsb', 'Ps 145:10–13')),
        ),
        group: 'God is King',
        tags: ['psalms', 'kingship', 'praise', 'old testament'],
      },
      {
        id: 'kingdom-of-god:kp:2',
        ref: v('DAN', 7, 13, 14),
        title: 'One like a son of man',
        note: text(
          'Daniel sees one like a son of man receive everlasting dominion and kingship from the Ancient of Days. Jesus takes up this imagery when he speaks of the Son of Man coming with the clouds (Mark 14:62).',
          synthesis(cite('bsb', 'Dan 7:13–14'), cite('bsb', 'Mark 14:62')),
        ),
        group: 'God is King',
        tags: ['son of man', 'daniel', 'prophecy', 'dominion'],
      },
      {
        id: 'kingdom-of-god:kp:3',
        ref: v('ISA', 52, 7),
        title: 'Your God reigns',
        note: text(
          'The herald’s good news to Zion is that God reigns. Paul applies the verse to those who preach the gospel (Rom 10:15).',
          synthesis(cite('bsb', 'Isa 52:7'), cite('bsb', 'Rom 10:15')),
        ),
        group: 'God is King',
        tags: ['good news', 'gospel', 'prophets'],
      },
      {
        id: 'kingdom-of-god:kp:4',
        ref: v('MRK', 1, 14, 15),
        title: 'The kingdom of God is near',
        note: text(
          'Jesus’ first proclamation: God’s appointed time has arrived, his reign has drawn near, and the fitting response is to repent and believe the good news.',
          synthesis(cite('bsb', 'Mark 1:14–15')),
        ),
        group: 'Jesus proclaims the kingdom',
        tags: ['gospel', 'repentance', 'faith', 'fulfilment'],
      },
      {
        id: 'kingdom-of-god:kp:5',
        ref: v('LUK', 4, 16, 21),
        title: 'Good news to the poor',
        note: text(
          'In the synagogue at Nazareth Jesus reads Isaiah’s promise of good news for the poor, freedom for captives and sight for the blind, and announces that it is fulfilled today.',
          synthesis(cite('bsb', 'Luke 4:16–21')),
        ),
        group: 'Jesus proclaims the kingdom',
        tags: ['jubilee', 'poor', 'fulfilment', 'isaiah'],
      },
      {
        id: 'kingdom-of-god:kp:6',
        ref: v('MAT', 12, 28, 29),
        title: 'The kingdom has come upon you',
        note: text(
          'Jesus’ casting out of demons by God’s Spirit shows that God’s reign is already present: Jesus is the one who ties up the strong man and plunders his house.',
          synthesis(cite('bsb', 'Matt 12:28–29')),
        ),
        group: 'Jesus proclaims the kingdom',
        tags: ['exorcism', 'already', 'victory', 'spirit'],
      },
      {
        id: 'kingdom-of-god:kp:7',
        ref: v('MAT', 13, 31, 33),
        title: 'The mustard seed and the leaven',
        note: text(
          'Two short parables picture the kingdom’s small, hidden beginnings and its surprising, all-pervading growth.',
          synthesis(cite('bsb', 'Matt 13:31–33')),
        ),
        group: 'Jesus proclaims the kingdom',
        tags: ['parables', 'growth', 'hiddenness'],
      },
      {
        id: 'kingdom-of-god:kp:8',
        ref: v('MAT', 6, 9, 10),
        title: 'Your kingdom come',
        note: text(
          'Disciples pray for God’s reign to come and for his will to be done on earth as it is in heaven—a kingdom not yet complete.',
          synthesis(cite('bsb', 'Matt 6:9–10')),
        ),
        group: 'Jesus proclaims the kingdom',
        tags: ['lord’s prayer', 'not yet', 'will of god'],
      },
      {
        id: 'kingdom-of-god:kp:9',
        ref: v('JHN', 18, 36),
        title: 'My kingdom is not of this world',
        note: text(
          'Before Pilate, Jesus says his kingdom does not originate from this world; if it did, his servants would fight to prevent his arrest.',
          synthesis(cite('bsb', 'John 18:36')),
        ),
        group: 'Jesus proclaims the kingdom',
        tags: ['pilate', 'power', 'non-violence'],
      },
      {
        id: 'kingdom-of-god:kp:10',
        ref: v('COL', 1, 13, 14),
        title: 'Brought into the kingdom of his Son',
        note: text(
          'Believers have already been rescued from the dominion of darkness and brought into the kingdom of God’s beloved Son.',
          synthesis(cite('bsb', 'Col 1:13–14')),
        ),
        group: 'Already and not yet',
        tags: ['already', 'redemption', 'transfer'],
      },
      {
        id: 'kingdom-of-god:kp:11',
        ref: v('ROM', 14, 17),
        title: 'Righteousness, peace and joy',
        note: text(
          'The kingdom is not a matter of food rules but of righteousness, peace and joy in the Holy Spirit.',
          synthesis(cite('bsb', 'Rom 14:17')),
        ),
        group: 'Already and not yet',
        tags: ['ethics', 'holy spirit', 'church'],
      },
      {
        id: 'kingdom-of-god:kp:12',
        ref: v('1CO', 15, 24, 28),
        title: 'He must reign until',
        note: text(
          'Christ reigns until every enemy, death last of all, is destroyed; then he hands the kingdom to the Father so that God may be all in all.',
          synthesis(cite('bsb', '1 Cor 15:24–28')),
        ),
        group: 'Already and not yet',
        tags: ['not yet', 'death', 'consummation', 'resurrection'],
      },
    ],
  },
  anchor: v('MRK', 1, 14, 15),
  perspectives: [
    {
      id: 'kingdom-of-god:ps:millennium',
      question: 'How should the thousand years of Revelation 20 be understood?',
      consensus: 'denominational',
      intro:
        'Christians confess together that Christ will come again in glory to judge the living and the dead, and that his kingdom will have no end (creed of 381). They differ over the thousand years during which Satan is bound and the saints reign with Christ (Rev 20:1–6), and so over how the kingdom’s present and future stages fit together. Diversity is old: Justin Martyr, who expected a thousand-year reign, acknowledged that many true Christians thought otherwise (Dialogue 80). The main modern positions are compared in The Meaning of the Millennium: Four Views (1977).',
      perspectives: [
        {
          id: 'kingdom-of-god:ps:millennium:amillennial',
          tradition: 'Amillennial',
          label: 'The thousand years is the present age',
          summary:
            'Augustine read the binding of Satan as Christ’s binding of the strong man (Matt 12:29), which restrains the devil from seducing the nations from which the church is gathered. He offers two readings of the thousand years: the last part of the sixth millennium of history, or the whole period of this age, a number signifying completeness. The first resurrection is the soul’s passage from death to life now, and the saints already reign with Christ in the church (City of God XX.6–9). Augustine says he once held a spiritual form of the millenarian view himself. The Augsburg Confession likewise rejects the expectation that before the resurrection the godly will take over the kingdoms of the world (Art. XVII). Anthony Hoekema represents the view in Four Views.',
          representatives: ['augustine'],
          keyTexts: [v('REV', 20, 1, 6), v('MAT', 12, 28, 29), v('JHN', 5, 24, 25), v('COL', 1, 13)],
          provenance: summaryOf(
            cite('augustine-city-of-god', 'Book XX, chs. 6–9', CITY_OF_GOD_XX_URL),
            cite('augsburg-confession', 'Art. XVII', AUGSBURG_XVII_URL),
            cite('clouse-meaning-of-the-millennium', 'amillennialism (Hoekema)', CLOUSE_URL),
          ),
        },
        {
          id: 'kingdom-of-god:ps:millennium:historic-premillennial',
          tradition: 'Historic premillennial',
          label: 'Christ returns, then reigns on a renewed earth',
          summary:
            'Irenaeus taught that the righteous will first rise and reign in the inheritance God promised to the fathers, in this creation renewed, before the final judgement (Against Heresies V.32.1). Justin Martyr expected a resurrection and a thousand years in a rebuilt Jerusalem, citing Isaiah and John’s Revelation, while admitting that other true Christians disagreed (Dialogue 80–81). In the twentieth century George Eldon Ladd defended historic premillennialism in Four Views.',
          representatives: ['irenaeus', 'justin-martyr', 'george-eldon-ladd'],
          keyTexts: [v('REV', 20, 4, 6), v('ISA', 65, 17, 19), v('1CO', 15, 23, 24)],
          provenance: summaryOf(
            cite('irenaeus-against-heresies', 'V.32.1', IRENAEUS_V32_URL),
            cite('justin-dialogue-with-trypho', 'chs. 80–81', JUSTIN_80_URL),
            cite('clouse-meaning-of-the-millennium', 'historic premillennialism (Ladd)', CLOUSE_URL),
          ),
        },
        {
          id: 'kingdom-of-god:ps:millennium:dispensational',
          tradition: 'Dispensational premillennial',
          label: 'Rapture, tribulation, then a millennial kingdom',
          summary:
            'Dallas Theological Seminary’s doctrinal statement teaches that the next great prophetic event is the Lord’s coming in the air to take his people to heaven—the church’s “blessed hope.” There follows Israel’s seventieth week, the tribulation, while the church is in heaven. Christ then returns to the earth, binds Satan, lifts the curse on creation, restores Israel to her land and fulfils God’s covenant promises in the millennial age (Arts. XVIII–XX). Herman Hoyt represents the view in Four Views.',
          keyTexts: [v('1TH', 4, 13, 18), v('TIT', 2, 11, 14), v('REV', 20, 1, 3)],
          provenance: summaryOf(
            cite('dts-doctrinal-statement', 'Arts. XVIII–XX', DTS_URL),
            cite('clouse-meaning-of-the-millennium', 'dispensational premillennialism (Hoyt)', CLOUSE_URL),
          ),
        },
        {
          id: 'kingdom-of-god:ps:millennium:postmillennial',
          tradition: 'Postmillennial',
          label: 'The gospel will triumph before Christ returns',
          summary:
            'Postmillennialists expect the gospel to prevail throughout the world before Christ’s return. The nineteenth-century Presbyterian Charles Hodge described the church’s common expectation that the universal proclamation of the gospel, the national conversion of the Jews and the coming of Antichrist precede the second advent, reading the prophets to mean that true religion shall prevail over the whole earth (Systematic Theology III, pp. 792, 800–801). Loraine Boettner represents the view in Four Views.',
          representatives: ['charles-hodge'],
          keyTexts: [v('MAT', 13, 31, 33), v('MAT', 24, 14), v('ISA', 45, 22, 23)],
          provenance: summaryOf(
            cite('hodge-systematic-theology', 'Part IV, ch. 3, §§2, 4 (pp. 792, 800–801)', HODGE_URL),
            cite('clouse-meaning-of-the-millennium', 'postmillennialism (Boettner)', CLOUSE_URL),
          ),
        },
      ],
      commonGround:
        'All confess Christ’s personal return, the resurrection of the dead, the final judgement and a kingdom without end. Most interpreters across these views also read Jesus’ teaching as announcing a kingdom already present in his ministry (Matt 12:28) yet still awaited in its fullness (Matt 6:10; 1 Cor 15:24–28), though they relate the two stages differently.',
      tags: ['millennium', 'revelation 20', 'eschatology', 'second coming', 'rapture'],
      provenance: synthesis(
        cite('nicene-creed-percival', 'Creed of Constantinople (381)', CREED_381_URL),
        cite('clouse-meaning-of-the-millennium', undefined, CLOUSE_URL),
        cite('justin-dialogue-with-trypho', 'ch. 80', JUSTIN_80_URL),
        cite('augustine-city-of-god', 'Book XX', CITY_OF_GOD_XX_URL),
        cite('bsb', 'Rev 20:1–6'),
        cite('bsb', 'Matt 12:28'),
        cite('bsb', 'Matt 6:10'),
      ),
    },
  ],
  suggestedQuestions: [
    'What did Jesus mean when he said the kingdom of God is near?',
    'Is the kingdom of God present now or in the future?',
    'What is the Greek word for “kingdom”?',
    'What are the main views of the millennium?',
    'Explain the parables of the mustard seed and the leaven.',
  ],
  sources,
  authors,
};

export default topic;
