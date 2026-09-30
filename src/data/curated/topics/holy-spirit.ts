import type { CuratedTopic, PassageRef, Source } from '../../../domain/models';
import { cite, synthesis, text } from '../../../domain/provenance';

/** Verse range within one chapter. */
const v = (book: string, chapter: number, from: number, to: number = from): PassageRef => ({
  book,
  startChapter: chapter,
  startVerse: from,
  endChapter: chapter,
  endVerse: to,
});

const WARFIELD_URL = 'https://archive.org/details/counterfeitmir00warf';
const FOUR_VIEWS_URL = 'https://www.logos.com/product/54033/are-miraculous-gifts-for-today-four-views';
const STOTT_URL = 'https://johnstott.org/work/baptism-and-fullness/';
const CROUCHER_STOTT_URL = 'https://www.jmm.org.au/articles/12285.htm';
const AG_URL = 'https://ag.org/-/media/AGORGV2/Beliefs/Fundamental-Truths/Statement-of-Fundamental-Truths.pdf';
const WCF_URL = 'https://www.opc.org/wcf.html';
const CE_CONFIRMATION_URL = 'https://www.newadvent.org/cathen/04215b.htm';
const CE_BAPTISM_URL = 'https://www.newadvent.org/cathen/02258b.htm';
const DOSITHEUS_URL = 'https://archive.org/details/actsdecreesofsyn00orth';

const sources: Source[] = [
  {
    id: 'warfield-counterfeit-miracles',
    type: 'book',
    title: 'Counterfeit Miracles',
    authorIds: ['bb-warfield'],
    year: '1918',
    publisher: 'Charles Scribner’s Sons, New York',
    url: WARFIELD_URL,
    edition: 'The Thomas Smyth Lectures for 1917–1918, Columbia Theological Seminary',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'Warfield’s classic case that the miraculous gifts were confined to the apostolic age, followed by critiques of later miracle claims.',
  },
  {
    id: 'miraculous-gifts-four-views',
    type: 'book',
    title: 'Are Miraculous Gifts for Today? Four Views',
    authorIds: [],
    year: '1996',
    publisher: 'Zondervan (Counterpoints series)',
    url: FOUR_VIEWS_URL,
    edition: 'Ed. Wayne A. Grudem; contributors Richard B. Gaffin Jr., Robert L. Saucy, C. Samuel Storms and Douglas A. Oss',
    license: { status: 'copyrighted', name: '© 1996 Zondervan', usage: 'summary-only' },
    description:
      'A debate volume comparing the cessationist, open-but-cautious, Third Wave and Pentecostal/charismatic views, with each author responding to the others.',
  },
  {
    id: 'stott-baptism-and-fullness',
    type: 'book',
    title: 'Baptism and Fullness: The Work of the Holy Spirit Today',
    authorIds: ['john-stott'],
    year: '1975',
    publisher: 'Inter-Varsity Press',
    url: STOTT_URL,
    edition: '2nd ed. (1975), an expanded revision of The Baptism and Fullness of the Holy Spirit (1964)',
    license: { status: 'copyrighted', name: '© John Stott / Inter-Varsity Press', usage: 'summary-only' },
    description: 'Stott’s irenic study of the promise, fullness, fruit and gifts of the Spirit, written in response to the charismatic movement.',
  },
  {
    id: 'croucher-review-stott-baptism-and-fullness',
    type: 'article',
    title: 'Baptism and Fullness (John Stott) — a book review',
    authorIds: [],
    publisher: 'John Mark Ministries (jmm.org.au)',
    url: CROUCHER_STOTT_URL,
    license: { status: 'copyrighted', name: '© Rowland Croucher / John Mark Ministries', usage: 'summary-only' },
    description:
      'Rowland Croucher’s review of the 1975 Inter-Varsity Press edition (119 pp.), which quotes Stott’s counsel on pp. 73–74 to Christians wary of the charismatic movement and to those who have had unusual experiences of the Spirit. Emmaus’s page references for Stott come from this review; the book itself was not consulted.',
  },
  {
    id: 'assemblies-of-god-fundamental-truths',
    type: 'confession',
    title: 'Statement of Fundamental Truths',
    authorIds: [],
    year: '1916 (current revision)',
    publisher: 'General Council of the Assemblies of God (USA)',
    url: AG_URL,
    license: { status: 'copyrighted', name: '© General Council of the Assemblies of God', usage: 'summary-only' },
    description:
      'The sixteen doctrinal articles of the General Council of the Assemblies of God (USA), a major classical Pentecostal denomination and a member of the World Assemblies of God Fellowship.',
  },
  {
    id: 'catholic-encyclopedia-confirmation',
    type: 'encyclopedia',
    title: 'Confirmation (The Catholic Encyclopedia, vol. 4)',
    authorIds: [],
    year: '1908',
    publisher: 'Robert Appleton Company',
    url: CE_CONFIRMATION_URL,
    edition: 'Article by T. Scannell, via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'An early-twentieth-century Catholic account of the sacrament of confirmation, its biblical basis and its Eastern and Western rites.',
  },
  {
    id: 'catholic-encyclopedia-baptism',
    type: 'encyclopedia',
    title: 'Baptism (The Catholic Encyclopedia, vol. 2)',
    authorIds: [],
    year: '1907',
    publisher: 'Robert Appleton Company',
    url: CE_BAPTISM_URL,
    edition: 'Article by William Fanning, via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'An early-twentieth-century Catholic account of baptism as the sacrament of regeneration, being born again of water and the Holy Spirit.',
  },
];

const topic: CuratedTopic = {
  id: 'holy-spirit',
  name: 'The Holy Spirit',
  aliases: [
    'holy spirit',
    'the holy spirit',
    'holy ghost',
    'the holy ghost',
    'spirit of god',
    'who is the holy spirit',
    'what does the holy spirit do',
    'pneumatology',
    'gifts of the spirit',
    'spiritual gifts',
    'fruit of the spirit',
    'baptism in the spirit',
    'baptism in the holy spirit',
    'baptism of the holy spirit',
    'filled with the spirit',
    'speaking in tongues',
    'tongues',
    'prophecy today',
    'cessationism',
    'continuationism',
    'pentecost',
    'pentecostal',
    'charismatic',
    'advocate',
    'comforter',
    'paraclete',
    'pneuma',
    'ruach',
  ],
  topic: {
    name: 'The Holy Spirit',
    question: 'Who is the Holy Spirit, and what does he do?',
    definition: text(
      'The Holy Spirit is God present and at work. The Spirit hovers over creation (Gen 1:2), and the prophets promise a day when God will put his Spirit within his people and pour him out on all people (Ezek 36:26–27; Joel 2:28–29). The Hebrew rûach and Greek pneuma can mean wind, breath or spirit, and Jesus plays on that range (John 3:8). Jesus speaks of the Spirit personally, as another Advocate who teaches, reminds and testifies about him (John 14:16–17, 26; 15:26; 16:13–15). At Pentecost the promised Spirit is poured out (Acts 2:1–21). The Spirit gives new life, assures believers that they are God’s children, produces the fruit of love, joy and peace, and distributes gifts for the common good (Rom 8:9–17; Gal 5:22–23; 1 Cor 12:4–11).',
      synthesis(
        cite('bsb', 'Gen 1:2'),
        cite('bsb', 'Ezek 36:26–27'),
        cite('bsb', 'Joel 2:28–29'),
        cite('bsb', 'John 3:8'),
        cite('bsb', 'John 14:16–17, 26'),
        cite('bsb', 'John 15:26'),
        cite('bsb', 'John 16:13–15'),
        cite('bsb', 'Acts 2:1–21'),
        cite('bsb', 'Rom 8:9–17'),
        cite('bsb', 'Gal 5:22–23'),
        cite('bsb', '1 Cor 12:4–11'),
        cite('stepbible-tbesh', 'H7307 רוּחַ'),
        cite('stepbible-tbesg', 'G4151 πνεῦμα'),
        cite('stepbible-tagnt', 'John 3:8'),
      ),
    ),
    keyPassages: [
      {
        id: 'holy-spirit:kp:1',
        ref: v('GEN', 1, 1, 2),
        title: 'Hovering over the waters',
        note: text(
          'Before the first word of creation is spoken, the Spirit of God is present over the formless, dark deep.',
          synthesis(cite('bsb', 'Gen 1:1–2')),
        ),
        group: 'The Spirit promised',
        tags: ['creation', 'old testament', 'presence'],
      },
      {
        id: 'holy-spirit:kp:2',
        ref: v('EZK', 36, 26, 27),
        title: 'A new heart and my Spirit within you',
        note: text(
          'God promises to replace a heart of stone with a heart of flesh and to put his own Spirit within his people, enabling them to walk in his ways.',
          synthesis(cite('bsb', 'Ezek 36:26–27')),
        ),
        group: 'The Spirit promised',
        tags: ['new covenant', 'new heart', 'obedience', 'prophets'],
      },
      {
        id: 'holy-spirit:kp:3',
        ref: v('JOL', 2, 28, 29),
        title: 'On all people',
        note: text(
          'Joel foresees the Spirit poured out without distinction of age, sex or status. Peter quotes the passage to explain Pentecost (Acts 2:16–21).',
          synthesis(cite('bsb', 'Joel 2:28–29'), cite('bsb', 'Acts 2:16–21')),
        ),
        group: 'The Spirit promised',
        tags: ['prophecy', 'pentecost', 'fulfilment'],
      },
      {
        id: 'holy-spirit:kp:4',
        ref: v('JHN', 14, 15, 27),
        title: 'Another Advocate',
        note: text(
          'Jesus promises the Spirit of truth to be with his disciples forever, to teach them and remind them of his words, as the Father and the Son make their home with those who love him.',
          synthesis(cite('bsb', 'John 14:15–27')),
        ),
        group: 'Jesus and the Advocate',
        tags: ['advocate', 'indwelling', 'teaching', 'peace'],
      },
      {
        id: 'holy-spirit:kp:5',
        ref: v('JHN', 16, 7, 15),
        title: 'He will guide you into all truth',
        note: text(
          'The Spirit convicts the world concerning sin, righteousness and judgement, and glorifies Christ by making known to the disciples what belongs to him.',
          synthesis(cite('bsb', 'John 16:7–15')),
        ),
        group: 'Jesus and the Advocate',
        tags: ['conviction', 'truth', 'revelation'],
      },
      {
        id: 'holy-spirit:kp:6',
        ref: v('ACT', 1, 4, 8),
        title: 'You will receive power',
        note: text(
          'The risen Jesus tells the disciples to wait in Jerusalem for the Father’s promise—baptism with the Holy Spirit—which will give them power to be his witnesses to the ends of the earth.',
          synthesis(cite('bsb', 'Acts 1:4–8')),
        ),
        group: 'Jesus and the Advocate',
        tags: ['power', 'witness', 'spirit baptism', 'mission'],
      },
      {
        id: 'holy-spirit:kp:7',
        ref: v('ACT', 2, 1, 21),
        title: 'Pentecost',
        note: text(
          'The Spirit comes with the sound of wind and tongues like fire; the disciples declare God’s wonders in the languages of many nations, and Peter explains it as the fulfilment of Joel.',
          synthesis(cite('bsb', 'Acts 2:1–21')),
        ),
        group: 'Jesus and the Advocate',
        tags: ['pentecost', 'tongues', 'fulfilment', 'church'],
      },
      {
        id: 'holy-spirit:kp:8',
        ref: v('ACT', 8, 14, 17),
        title: 'Samaria receives the Spirit',
        note: text(
          'Baptised believers in Samaria receive the Spirit only when Peter and John pray and lay hands on them—an episode central to debates about whether Spirit-baptism can follow conversion.',
          synthesis(cite('bsb', 'Acts 8:14–17')),
        ),
        group: 'Life in the Spirit',
        tags: ['spirit baptism', 'laying on of hands', 'samaria'],
      },
      {
        id: 'holy-spirit:kp:9',
        ref: v('ROM', 8, 9, 17),
        title: 'The Spirit of adoption',
        note: text(
          'Everyone who belongs to Christ has his Spirit, who gives life to mortal bodies, leads God’s children, and bears witness with their spirit that they are God’s children and heirs.',
          synthesis(cite('bsb', 'Rom 8:9–17')),
        ),
        group: 'Life in the Spirit',
        tags: ['adoption', 'assurance', 'new life', 'indwelling'],
      },
      {
        id: 'holy-spirit:kp:10',
        ref: v('GAL', 5, 16, 25),
        title: 'The fruit of the Spirit',
        note: text(
          'Walking by the Spirit opposes the desires of the flesh. The Spirit’s fruit, beginning with love, joy and peace, is the transformed character he produces in believers.',
          synthesis(cite('bsb', 'Gal 5:16–25')),
        ),
        group: 'Life in the Spirit',
        tags: ['fruit', 'flesh', 'sanctification', 'character'],
      },
      {
        id: 'holy-spirit:kp:11',
        ref: v('1CO', 12, 4, 13),
        title: 'Many gifts, one Spirit',
        note: text(
          'Different gifts, ministries and workings all come from the same Spirit for the common good, and all believers were baptised by one Spirit into one body (12:13).',
          synthesis(cite('bsb', '1 Cor 12:4–13')),
        ),
        group: 'Life in the Spirit',
        tags: ['gifts', 'body of christ', 'unity', 'spirit baptism'],
      },
      {
        id: 'holy-spirit:kp:12',
        ref: v('EPH', 1, 13, 14),
        title: 'Sealed with the promised Spirit',
        note: text(
          'Those who heard and believed the gospel were sealed with the promised Holy Spirit, the pledge of their inheritance until God’s final redemption.',
          synthesis(cite('bsb', 'Eph 1:13–14')),
        ),
        group: 'Life in the Spirit',
        tags: ['seal', 'assurance', 'inheritance'],
      },
    ],
  },
  anchor: v('JHN', 14, 15, 27),
  perspectives: [
    {
      id: 'holy-spirit:ps:gifts',
      question: 'Do miraculous gifts such as prophecy, tongues and healing continue today?',
      consensus: 'denominational',
      intro:
        'Christians agree that the Spirit gives every believer gifts for the common good (1 Cor 12:7) and that he is still at work in the church. They differ over whether the more extraordinary gifts described in Acts and 1 Corinthians—prophecy, tongues and healings—belonged to the apostolic founding of the church or continue today. The standard comparison, Are Miraculous Gifts for Today? Four Views (1996), sets out cessationist, open-but-cautious, Third Wave and Pentecostal/charismatic positions.',
      perspectives: [
        {
          id: 'holy-spirit:ps:gifts:cessationist',
          tradition: 'Cessationist',
          label: 'The sign gifts ceased with the apostles',
          summary:
            'B. B. Warfield argued that the miraculous gifts were not the possession of every early Christian but the credentials of the apostles as God’s authoritative agents in founding the church, so that they passed away with the apostolic age (Counterfeit Miracles, 1918, pp. 5–6). Cessationists connect this with the church being built on the foundation of the apostles and prophets (Eph 2:20), with signs that confirmed the apostolic message (Heb 2:3–4; 2 Cor 12:12), and with the completion of Scripture: the Westminster Confession says God’s former ways of revealing his will to his people have now ceased (1.1).',
          representatives: ['bb-warfield'],
          keyTexts: [v('EPH', 2, 19, 20), v('HEB', 2, 3, 4), v('2CO', 12, 12)],
          provenance: synthesis(
            cite('warfield-counterfeit-miracles', 'Lecture I, “The Cessation of the Charismata,” pp. 5–6', WARFIELD_URL),
            cite('westminster-confession', 'ch. 1.1', WCF_URL),
            cite('miraculous-gifts-four-views', 'cessationist view (Gaffin)', FOUR_VIEWS_URL),
          ),
        },
        {
          id: 'holy-spirit:ps:gifts:open',
          tradition: 'Open but cautious',
          label: 'Possible, but not the norm for every Christian',
          summary:
            'Many evangelicals answer “maybe” (Four Views): open to the Spirit giving unusual gifts today, but wary of treating them as the norm for all believers. John Stott counselled restraint on both sides. Those wary of the charismatic movement should be ready to recognise an unusual work of the Spirit in others, provided the experience does not contradict Scripture and does the believer and the church good. Those who have had such experiences should not make them a pattern for everyone, because what every Christian should share is the Spirit’s work in character, not any particular gift or experience (Baptism and Fullness, pp. 73–74). Supporters of this view appeal to Paul’s counsel: do not quench the Spirit or despise prophecy, but test everything (1 Thess 5:19–21).',
          representatives: ['john-stott'],
          keyTexts: [v('1TH', 5, 19, 21), v('1CO', 12, 7, 11)],
          provenance: synthesis(
            cite('miraculous-gifts-four-views', 'open-but-cautious view (Saucy)', FOUR_VIEWS_URL),
            cite('stott-baptism-and-fullness', 'pp. 73–74 (page reference from R. Croucher’s review)', STOTT_URL),
            cite('croucher-review-stott-baptism-and-fullness', 'on pp. 73–74', CROUCHER_STOTT_URL),
            cite('bsb', '1 Thess 5:19–21'),
          ),
        },
        {
          id: 'holy-spirit:ps:gifts:continuationist',
          tradition: 'Pentecostal, charismatic and Third Wave',
          label: 'All the gifts continue until Christ returns',
          summary:
            'Pentecostal and Third Wave Christians answer yes: the gifts described in Acts and 1 Corinthians remain available to the church (Four Views). The Assemblies of God, for example, teach that Spirit-baptism equips believers with power to live and serve and brings the gifts of the Spirit for ministry (Statement of Fundamental Truths, art. 7). Continuationists point to Paul’s instruction to eagerly desire spiritual gifts, especially prophecy (1 Cor 14:1), and note that he expects prophecy and tongues to pass away “when the perfect comes,” when believers see face to face (1 Cor 13:8–12).',
          keyTexts: [v('1CO', 14, 1, 5), v('1CO', 13, 8, 12), v('ACT', 2, 17, 18)],
          provenance: synthesis(
            cite('miraculous-gifts-four-views', 'Third Wave (Storms) and Pentecostal/charismatic (Oss) views', FOUR_VIEWS_URL),
            cite('assemblies-of-god-fundamental-truths', 'art. 7', AG_URL),
            cite('bsb', '1 Cor 13:8–12'),
            cite('bsb', '1 Cor 14:1–5'),
          ),
        },
      ],
      commonGround:
        'All agree that the Spirit indwells every believer and gives gifts to build up the church, and all treat Scripture as the standard by which any claimed spiritual experience is tested (1 Thess 5:21).',
      tags: ['spiritual gifts', 'cessationism', 'continuationism', 'tongues', 'prophecy', 'healing'],
      provenance: synthesis(
        cite('miraculous-gifts-four-views', undefined, FOUR_VIEWS_URL),
        cite('warfield-counterfeit-miracles', 'pp. 5–6', WARFIELD_URL),
        cite('stott-baptism-and-fullness', 'pp. 73–74 (page reference from R. Croucher’s review)', STOTT_URL),
        cite('assemblies-of-god-fundamental-truths', 'arts. 1, 7–8', AG_URL),
        cite('westminster-confession', 'ch. 1.10', WCF_URL),
        cite('bsb', '1 Cor 12:7'),
        cite('bsb', '1 Thess 5:19–21'),
      ),
    },
    {
      id: 'holy-spirit:ps:spirit-baptism',
      question: 'Is “baptism in the Spirit” a second experience after conversion?',
      consensus: 'denominational',
      intro:
        'Jesus promised his disciples that they would be baptised with the Holy Spirit (Acts 1:5), and Paul says that anyone who does not have the Spirit of Christ does not belong to him (Rom 8:9). Christians differ over whether Spirit-baptism is part of becoming a Christian or a distinct empowering that may follow it, as Pentecostals read the episodes in Samaria and Ephesus (Acts 8:14–17; 19:1–7).',
      perspectives: [
        {
          id: 'holy-spirit:ps:spirit-baptism:pentecostal',
          tradition: 'Classical Pentecostal',
          label: 'A distinct empowering after the new birth',
          summary:
            'The Assemblies of God teach that every believer should expect and seek the baptism in the Holy Spirit, which they regard as the common experience of the first Christians. It equips believers with power to live and serve, and it is a separate experience that follows the new birth, as in Acts 8, 10, 11 and 15 (Statement of Fundamental Truths, art. 7). Its first outward sign is speaking in other tongues as the Spirit enables, as at Pentecost (art. 8; Acts 2:4).',
          keyTexts: [v('ACT', 2, 1, 4), v('ACT', 8, 14, 17), v('ACT', 10, 44, 46), v('ACT', 19, 1, 7)],
          provenance: synthesis(cite('assemblies-of-god-fundamental-truths', 'arts. 7–8', AG_URL)),
        },
        {
          id: 'holy-spirit:ps:spirit-baptism:evangelical',
          tradition: 'Evangelical (non-Pentecostal)',
          label: 'Received by every believer at conversion',
          summary:
            'John Stott argued that the baptism of the Spirit is received by every believer at conversion—in one Spirit we were all baptised into one body (1 Cor 12:13)—while being filled with the Spirit is an ongoing need to be pursued (Eph 5:18). He therefore asked those who had received unusual spiritual experiences not to urge others to seek Spirit-baptism as a second stage after conversion, since in his judgement Scripture does not establish it (Baptism and Fullness, pp. 73–74).',
          representatives: ['john-stott'],
          keyTexts: [v('1CO', 12, 13), v('EPH', 5, 18), v('ROM', 8, 9)],
          provenance: synthesis(
            cite('stott-baptism-and-fullness', 'on 1 Cor 12:13 and Eph 5:18; pp. 73–74 (page reference from R. Croucher’s review)', STOTT_URL),
            cite('croucher-review-stott-baptism-and-fullness', 'on pp. 73–74', CROUCHER_STOTT_URL),
          ),
        },
        {
          id: 'holy-spirit:ps:spirit-baptism:sacramental',
          tradition: 'Catholic and Eastern Orthodox',
          label: 'Given in the sacraments of initiation',
          summary:
            'In Catholic and Orthodox teaching the Spirit is given within Christian initiation, not in a later, separate experience. Baptism is the new birth of water and the Holy Spirit (John 3:5), and it is completed by confirmation (in the East, chrismation), which the Catholic Encyclopedia describes as the sacrament in which the Holy Spirit is given to the baptised to make them strong and mature Christians, a perfecting of baptism; it reads the Samaritan and Ephesian episodes as apostolic examples of this rite (Acts 8:14–17; 19:1–6). The Confession of Dositheus counts chrism among the seven mysteries and links it with Jesus’ promise that the disciples would be clothed with power from on high (Decree XV; Luke 24:49).',
          keyTexts: [v('JHN', 3, 5), v('ACT', 8, 14, 17), v('ACT', 19, 1, 6), v('LUK', 24, 49)],
          provenance: synthesis(
            cite('catholic-encyclopedia-baptism', 'Definition', CE_BAPTISM_URL),
            cite('catholic-encyclopedia-confirmation', undefined, CE_CONFIRMATION_URL),
            cite('confession-of-dositheus', 'Decree XV', DOSITHEUS_URL),
          ),
        },
      ],
      commonGround:
        'All agree that every Christian has the Spirit of Christ (Rom 8:9), that believers are to go on being filled with the Spirit (Eph 5:18), and that the Spirit’s power is given for witness and service (Acts 1:8).',
      tags: ['spirit baptism', 'subsequence', 'tongues', 'confirmation', 'initiation'],
      provenance: synthesis(
        cite('assemblies-of-god-fundamental-truths', 'arts. 7–8', AG_URL),
        cite('stott-baptism-and-fullness', 'pp. 73–74 (page reference from R. Croucher’s review)', STOTT_URL),
        cite('catholic-encyclopedia-confirmation', undefined, CE_CONFIRMATION_URL),
        cite('bsb', 'Acts 1:5'),
        cite('bsb', 'Rom 8:9'),
        cite('bsb', 'Acts 8:14–17'),
        cite('bsb', 'Acts 19:1–7'),
      ),
    },
  ],
  suggestedQuestions: [
    'Is the Holy Spirit a person or a force?',
    'What happened at Pentecost?',
    'What is the fruit of the Spirit?',
    'Do spiritual gifts like tongues and prophecy continue today?',
    'What is the baptism in the Holy Spirit?',
    'What is the Hebrew and Greek word for “spirit”?',
  ],
  sources,
};

export default topic;
