import type { CuratedStudy } from '../../../domain/models';
import { cite, synthesis, summaryOf, verifiedQuote, lexical, historical, literary, text } from '../../../domain/provenance';

/**
 * Curated topic study: Suffering — “Why does God allow suffering?”
 * Anchor passage: 2 Corinthians 4:7–18. Every lexical fact, count, quotation and
 * bibliographic detail was checked during authoring (see the study’s verification log).
 */

/* ------------------------------------------------------------------ */
/* Frequently used URLs (all opened during authoring)                  */
/* ------------------------------------------------------------------ */

const TYN_2CO_INTRO = 'https://bible.helloao.org/api/c/tyndale/books.json';
const TYN_2CO_1 = 'https://bible.helloao.org/api/c/tyndale/2CO/1.json';
const TYN_2CO_2 = 'https://bible.helloao.org/api/c/tyndale/2CO/2.json';
const TYN_2CO_4 = 'https://bible.helloao.org/api/c/tyndale/2CO/4.json';
const CALVIN_2CO_4 = 'https://bible.helloao.org/api/c/john-calvin/2CO/4.json';
const HENRY_2CO_4 = 'https://bible.helloao.org/api/c/matthew-henry/2CO/4.json';
const JFB_2CO_4 = 'https://bible.helloao.org/api/c/jamieson-fausset-brown/2CO/4.json';
const CHRYS_HOM_8 = 'https://www.newadvent.org/fathers/220208.htm';
const CHRYS_HOM_9 = 'https://www.newadvent.org/fathers/220209.htm';
const ENCHIRIDION = 'https://www.newadvent.org/fathers/1302.htm';
const LXX_PSA_115 = 'https://bible.helloao.org/api/grc_bre/PSA/115.json';
const LXX_PSA_87 = 'https://bible.helloao.org/api/grc_bre/PSA/87.json';
const CALVIN_COL_1 = 'https://bible.helloao.org/api/c/john-calvin/COL/1.json';
const CCC_PROVIDENCE = 'https://www.vatican.va/archive/ENG0015/__P19.HTM';
const SALVIFICI_DOLORIS =
  'https://www.vatican.va/content/john-paul-ii/en/apost_letters/1984/documents/hf_jp-ii_apl_11021984_salvifici-doloris.html';
const WESLEY_SERMON_67 = 'https://ccel.org/ccel/wesley/sermons/sermons.vi.xiv.html';
const WCF = 'https://www.opc.org/wcf.html';

const study: CuratedStudy = {
  id: 'suffering',
  kind: 'topic',
  title: 'Suffering',
  subtitle: 'Why Does God Allow Suffering?',
  passage: { book: '2CO', startChapter: 4, startVerse: 7, endChapter: 4, endVerse: 18 },

  match: {
    references: [{ book: '2CO', startChapter: 4, startVerse: 7, endChapter: 4, endVerse: 18 }],
    topics: [
      'suffering',
      'why does god allow suffering',
      'why does god allow evil',
      'the problem of evil',
      'problem of pain',
      'theodicy',
      'pain',
      'evil',
      'trials',
      'affliction',
      'lament',
      'grief',
      'hardship',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Topic                                                               */
  /* ------------------------------------------------------------------ */

  topic: {
    name: 'Suffering',
    question: 'Why does God allow suffering?',
    definition: text(
      'Scripture gives no single, tidy answer to why God allows suffering. It gives a set of truths to hold together. God is both good and sovereign, yet evil is real and never simply good: sin and death entered God’s good world through human rebellion, and the whole creation now groans (Gen 3; Rom 5:12; 8:20–22). Suffering is not always punishment for a particular sin (Job; John 9; Luke 13). God welcomes honest lament — the psalmist’s repeated cry of how long is itself a prayer of faith (Ps 13). God has not stayed at a distance: in Christ he entered human pain, was forsaken on the cross and rose again (Isa 53; Mark 15:34). In his hands affliction can refine faith and even work toward glory (Gen 50:20; Rom 5:3–5; 2 Cor 4:17). And the story ends with God himself wiping away every tear (Rev 21:3–5).',
      synthesis(
        cite('bsb', 'Gen 3:16–19; Rom 5:12; 8:20–22'),
        cite('bsb', 'Ps 13; John 9:1–3; Luke 13:1–5'),
        cite('bsb', 'Isa 53:3–5; Mark 15:34; 2 Cor 4:17; Rev 21:3–5'),
        cite('tyndale-open-study-notes', 'Job, Book Introduction, “Meaning and Message”', TYN_2CO_INTRO),
      ),
    ),
    keyPassages: [
      /* Suffering and the fall */
      {
        id: 'suffering:kp:gen-3-16',
        ref: { book: 'GEN', startChapter: 3, startVerse: 16, endChapter: 3, endVerse: 19 },
        title: 'Pain, toil and dust',
        group: 'Suffering and the fall',
        note: text(
          'After the first rebellion, pain enters childbirth, the ground is cursed, work becomes toil, and the man is told he will return to dust. Scripture traces the brokenness of the world — including much suffering that no individual chose — to this primal turning from God.',
          synthesis(cite('bsb', 'Gen 3:16–19')),
        ),
        tags: ['fall', 'curse', 'origin of evil', 'death'],
      },
      {
        id: 'suffering:kp:rom-8-20',
        ref: { book: 'ROM', startChapter: 8, startVerse: 20, endChapter: 8, endVerse: 22 },
        title: 'A creation groaning in hope',
        group: 'Suffering and the fall',
        note: text(
          'Paul says creation was subjected to futility and bondage to decay — but “in hope”, and he pictures its groaning as the pains of childbirth. Suffering in the natural world is real, but it is labour toward a new birth rather than a meaningless end.',
          synthesis(cite('bsb', 'Rom 8:20–22')),
        ),
        tags: ['creation', 'futility', 'hope', 'natural evil'],
      },

      /* Lament and honest faith */
      {
        id: 'suffering:kp:psa-13',
        ref: { book: 'PSA', startChapter: 13 },
        title: 'How long, O LORD?',
        group: 'Lament and honest faith',
        note: text(
          'Four times in two verses David asks how long: how long God will forget him and hide his face, how long he must wrestle with sorrow, how long his enemy will triumph. Yet the short psalm ends in trust and song. Lament is not a lapse of faith; it is faith taking its complaint to the only one who can answer.',
          synthesis(
            cite('bsb', 'Ps 13:1–6'),
            cite('tyndale-open-study-notes', 'on Ps 13:1–2', 'https://bible.helloao.org/api/c/tyndale/PSA/13.json'),
          ),
        ),
        tags: ['lament', 'how long', 'trust', 'psalms'],
      },
      {
        id: 'suffering:kp:psa-88',
        ref: { book: 'PSA', startChapter: 88 },
        title: 'A lament that ends in darkness',
        group: 'Lament and honest faith',
        note: text(
          'Psalm 88 is unusual: it closes without a turn to praise, its last word being darkness. Yet it is addressed throughout to the God of my salvation (88:1). Its place in Scripture gives sufferers permission to pray even when no relief has come.',
          synthesis(
            cite('bsb', 'Ps 88:1, 18'),
            cite('tyndale-open-study-notes', 'on Ps 88', 'https://bible.helloao.org/api/c/tyndale/PSA/88.json'),
          ),
        ),
        tags: ['lament', 'darkness', 'despair', 'psalms'],
      },
      {
        id: 'suffering:kp:lam-3-19',
        ref: { book: 'LAM', startChapter: 3, startVerse: 19, endChapter: 3, endVerse: 33 },
        title: 'New mercies in the ruins',
        group: 'Lament and honest faith',
        note: text(
          'Written in the wreckage of Jerusalem, the poet remembers his affliction, then deliberately calls to mind God’s steadfast love and mercies that are new every morning. The passage ends with a striking claim about God’s heart: he does not afflict willingly (3:33).',
          synthesis(
            cite('bsb', 'Lam 3:19–33'),
            cite('tyndale-open-study-notes', 'on Lam 3:19–33', 'https://bible.helloao.org/api/c/tyndale/LAM/3.json'),
          ),
        ),
        tags: ['lament', 'hope', 'mercy', 'affliction'],
      },
      {
        id: 'suffering:kp:hab-1-2',
        ref: { book: 'HAB', startChapter: 1, startVerse: 2, endChapter: 1, endVerse: 4 },
        title: 'Why do you tolerate wrongdoing?',
        group: 'Lament and honest faith',
        note: text(
          'Habakkuk opens with the same how-long question as Psalm 13, now about injustice in society: violence, paralysed law and perverted justice. The prophet’s complaint becomes the start of a dialogue with God rather than the end of faith.',
          synthesis(
            cite('bsb', 'Hab 1:2–4'),
            cite('tyndale-open-study-notes', 'on Hab 1:2–4', 'https://bible.helloao.org/api/c/tyndale/HAB/1.json'),
          ),
        ),
        tags: ['lament', 'injustice', 'how long', 'prophets'],
      },
      {
        id: 'suffering:kp:hab-3-17',
        ref: { book: 'HAB', startChapter: 3, startVerse: 17, endChapter: 3, endVerse: 19 },
        title: 'Joy when the fig tree fails',
        group: 'Lament and honest faith',
        note: text(
          'At the end of the book the prophet is still waiting for the day of distress (3:16), and he faces the prospect of total loss — no fruit, no crops, no flocks — yet Habakkuk resolves to rejoice in the God of his salvation. It is one of Scripture’s clearest pictures of faith that no longer depends on circumstances.',
          synthesis(cite('bsb', 'Hab 3:16–19')),
        ),
        tags: ['joy', 'trust', 'loss', 'faith'],
      },

      /* Job */
      {
        id: 'suffering:kp:job-1-20',
        ref: { book: 'JOB', startChapter: 1, startVerse: 20, endChapter: 1, endVerse: 22 },
        title: 'The LORD gave, and the LORD has taken away',
        group: 'Job: suffering and mystery',
        note: text(
          'Having lost his children and possessions, Job tears his robe, falls to the ground — and worships. The narrator adds that he did not sin or charge God with wrongdoing. Grief and worship are not opposites here; they happen in the same act.',
          synthesis(
            cite('bsb', 'Job 1:20–22'),
            cite('tyndale-open-study-notes', 'Job, Book Introduction, “Summary”', TYN_2CO_INTRO),
          ),
        ),
        tags: ['job', 'worship', 'grief', 'sovereignty'],
      },
      {
        id: 'suffering:kp:job-38-1',
        ref: { book: 'JOB', startChapter: 38, startVerse: 1, endChapter: 38, endVerse: 7 },
        title: 'The answer from the whirlwind',
        group: 'Job: suffering and mystery',
        note: text(
          'When God finally speaks, he does not explain the heavenly scene of chapters 1–2. He asks Job where he was when the earth was founded. The Tyndale notes observe that the book does not explain suffering; it shows God rejecting easy explanations while calling Job to trust his wisdom.',
          synthesis(
            cite('bsb', 'Job 38:1–7'),
            cite('tyndale-open-study-notes', 'Job, Book Introduction, “Meaning and Message”', TYN_2CO_INTRO),
          ),
        ),
        tags: ['job', 'mystery', 'creation', 'wisdom'],
      },
      {
        id: 'suffering:kp:job-42-1',
        ref: { book: 'JOB', startChapter: 42, startVerse: 1, endChapter: 42, endVerse: 6 },
        title: 'Now my eyes have seen you',
        group: 'Job: suffering and mystery',
        note: text(
          'Job receives no list of reasons, but he receives God himself: he had heard of God, and now he sees him. The book suggests that what the sufferer most needs is not an explanation but an encounter.',
          synthesis(
            cite('bsb', 'Job 42:1–6'),
            cite('tyndale-open-study-notes', 'Job, Book Introduction, “Meaning and Message”', TYN_2CO_INTRO),
          ),
        ),
        tags: ['job', 'encounter', 'repentance', 'mystery'],
      },

      /* God’s purposes in pain */
      {
        id: 'suffering:kp:gen-50-20',
        ref: { book: 'GEN', startChapter: 50, startVerse: 19, endChapter: 50, endVerse: 21 },
        title: 'You intended evil; God intended good',
        group: 'God’s purposes in pain',
        note: text(
          'Joseph names his brothers’ act as evil and, in the same sentence, says God intended it for good — to preserve many lives. The verse holds human guilt and divine purpose together without letting either cancel the other.',
          synthesis(cite('bsb', 'Gen 50:19–21')),
        ),
        tags: ['providence', 'sovereignty', 'evil', 'good'],
      },
      {
        id: 'suffering:kp:rom-5-3',
        ref: { book: 'ROM', startChapter: 5, startVerse: 3, endChapter: 5, endVerse: 5 },
        title: 'Suffering produces perseverance',
        group: 'God’s purposes in pain',
        note: text(
          'Paul traces a chain: suffering, perseverance, character, hope — and a hope that does not disappoint because God’s love has been poured into our hearts by the Spirit. The goodness lies not in the pain itself but in what God works through it.',
          synthesis(cite('bsb', 'Rom 5:3–5')),
        ),
        tags: ['perseverance', 'character', 'hope', 'refining'],
      },
      {
        id: 'suffering:kp:heb-12-5',
        ref: { book: 'HEB', startChapter: 12, startVerse: 5, endChapter: 12, endVerse: 11 },
        title: 'The discipline of a Father',
        group: 'God’s purposes in pain',
        note: text(
          'Hebrews reads some hardship as the training a loving father gives his children: painful at the time, but later yielding righteousness and peace. The passage does not say every trial is discipline for a specific fault; it frames endurance within sonship.',
          synthesis(cite('bsb', 'Heb 12:5–11')),
        ),
        tags: ['discipline', 'sonship', 'holiness', 'training'],
      },
      {
        id: 'suffering:kp:2co-12-7',
        ref: { book: '2CO', startChapter: 12, startVerse: 7, endChapter: 12, endVerse: 10 },
        title: 'Power perfected in weakness',
        group: 'God’s purposes in pain',
        note: text(
          'Three times Paul asked for his thorn in the flesh to be removed; the answer was grace sufficient for him. We do not know what the thorn was, but we know what it taught: Christ’s power rests on those who are weak.',
          synthesis(
            cite('bsb', '2 Cor 12:7–10'),
            cite('tyndale-open-study-notes', 'on 2 Cor 12:7b–10', 'https://bible.helloao.org/api/c/tyndale/2CO/12.json'),
          ),
        ),
        tags: ['weakness', 'grace', 'prayer not granted', 'thorn'],
      },

      /* Not always punishment */
      {
        id: 'suffering:kp:jhn-9-1',
        ref: { book: 'JHN', startChapter: 9, startVerse: 1, endChapter: 9, endVerse: 3 },
        title: 'Who sinned?',
        group: 'Not always punishment',
        note: text(
          'The disciples assume a man’s blindness must be someone’s fault. Jesus rejects both options and points instead to what God will display in him. Scripture refuses the simple equation that suffering always equals personal guilt.',
          synthesis(
            cite('bsb', 'John 9:1–3'),
            cite('tyndale-open-study-notes', 'on John 9:2', 'https://bible.helloao.org/api/c/tyndale/JHN/9.json'),
          ),
        ),
        tags: ['punishment', 'retribution', 'blindness', 'glory of god'],
      },
      {
        id: 'suffering:kp:luk-13-1',
        ref: { book: 'LUK', startChapter: 13, startVerse: 1, endChapter: 13, endVerse: 5 },
        title: 'The tower of Siloam',
        group: 'Not always punishment',
        note: text(
          'Told about victims of Pilate’s violence, and adding his own example of a collapsing tower, Jesus denies that they were worse sinners than others — then turns the question into a summons: all need to repent. Tragedy is not a verdict on its victims, but it is a reminder of everyone’s need of God.',
          synthesis(
            cite('bsb', 'Luke 13:1–5'),
            cite('tyndale-open-study-notes', 'on Luke 13:1–4', 'https://bible.helloao.org/api/c/tyndale/LUK/13.json'),
          ),
        ),
        tags: ['punishment', 'tragedy', 'natural evil', 'repentance'],
      },

      /* God with us in suffering: Christ */
      {
        id: 'suffering:kp:isa-53-3',
        ref: { book: 'ISA', startChapter: 53, startVerse: 3, endChapter: 53, endVerse: 5 },
        title: 'A man of sorrows',
        group: 'God with us in suffering: Christ',
        note: text(
          'The Servant is acquainted with grief, carries our sorrows and is crushed for our iniquities. The New Testament applies this song to Jesus (for example 1 Pet 2:24): the God of the Bible answers suffering not from a distance but by bearing it.',
          synthesis(cite('bsb', 'Isa 53:3–5; 1 Pet 2:24')),
        ),
        tags: ['servant', 'atonement', 'sorrows', 'christ'],
      },
      {
        id: 'suffering:kp:mrk-15-34',
        ref: { book: 'MRK', startChapter: 15, startVerse: 34, endChapter: 15, endVerse: 34 },
        title: 'My God, why have you forsaken me?',
        group: 'God with us in suffering: Christ',
        note: text(
          'On the cross Jesus prays the opening line of Psalm 22, a lament. The Son of God himself asks why. Christians have long found here both the depth of what Christ bore and permission to bring their own why to God.',
          synthesis(cite('bsb', 'Mark 15:34; Ps 22:1')),
        ),
        tags: ['cross', 'forsaken', 'lament', 'christ'],
      },
      {
        id: 'suffering:kp:heb-4-15',
        ref: { book: 'HEB', startChapter: 4, startVerse: 15, endChapter: 4, endVerse: 15 },
        title: 'A high priest who sympathizes',
        group: 'God with us in suffering: Christ',
        note: text(
          'Because Jesus was tested in every way as we are, he is able to sympathize with our weaknesses. The sufferer prays to one who knows pain from the inside.',
          synthesis(cite('bsb', 'Heb 4:15')),
        ),
        tags: ['sympathy', 'high priest', 'weakness', 'christ'],
      },

      /* Final hope */
      {
        id: 'suffering:kp:rev-21-3',
        ref: { book: 'REV', startChapter: 21, startVerse: 3, endChapter: 21, endVerse: 5 },
        title: 'No more death or mourning',
        group: 'Final hope',
        note: text(
          'The Bible’s last word on suffering is not an explanation but an ending: God dwelling with his people, every tear wiped away, death and pain gone, all things made new. Present suffering is real, but it is not permanent.',
          synthesis(cite('bsb', 'Rev 21:3–5; Isa 25:8')),
        ),
        tags: ['new creation', 'hope', 'tears', 'eschatology'],
      },
    ],
  },

  summary: text(
    'This study asks the oldest hard question of faith — why a good and powerful God allows suffering — and anchors it in 2 Corinthians 4:7–18, where Paul, pressed from every side, speaks of treasure in jars of clay and a light, momentary affliction that is producing an eternal weight of glory. Around that passage it gathers the Bible’s wider witness: the fall and a groaning creation, lament psalms and Job, the refusal to equate suffering with punishment, God entering human suffering in Christ, and the promise of a world without tears. It also sets out how Christian thinkers — from Irenaeus and Augustine to the Reformed, Catholic, Wesleyan and Orthodox traditions and modern philosophers — have answered the problem of evil, where they agree and where they differ.',
    synthesis(
      cite('bsb', '2 Cor 4:7–18'),
      cite('tyndale-open-study-notes', 'on 2 Cor 4:7', TYN_2CO_4),
      cite('tyndale-open-study-notes', 'Job, Book Introduction', TYN_2CO_INTRO),
    ),
  ),

  opening: text(
    'Few questions press harder than this one, and the Bible does not rush past it. We will anchor the study in 2 Corinthians 4, where Paul writes as a man under real pressure yet not crushed, and then follow the wider biblical answer — honest lament, the mystery of Job, the cross, and the hope of a world without tears. Ask about any verse, any word, or how Christians have wrestled with the problem of evil.',
    synthesis(cite('bsb', '2 Cor 4:7–18')),
  ),

  /* ------------------------------------------------------------------ */
  /* Key words                                                           */
  /* ------------------------------------------------------------------ */

  keyWords: [
    {
      id: 'suffering:kw:thlipsis',
      strong: 'G2347',
      language: 'greek',
      lemma: 'θλῖψις',
      transliteration: 'thlipsis',
      pronunciation: 'THLEEP-sis',
      english: 'affliction',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 17 },
          phrases: { BSB: 'affliction', KJV: 'affliction', WEB: 'affliction' },
        },
      ],
      grammar: 'Noun, genitive singular feminine',
      basicMeaning: 'pressure; (figuratively) affliction, tribulation, distress',
      semanticRange: ['pressure (literal)', 'affliction', 'tribulation', 'distress'],
      notableOccurrences: [
        {
          ref: { book: '2CO', startChapter: 1, startVerse: 4, endChapter: 1, endVerse: 4 },
          note: 'The letter opens with the God who comforts us in all our affliction — the word appears twice in this verse.',
        },
        {
          ref: { book: '2CO', startChapter: 1, startVerse: 8, endChapter: 1, endVerse: 8 },
          note: 'The affliction Paul suffered in the province of Asia, so severe that he despaired of life.',
        },
        {
          ref: { book: 'ROM', startChapter: 5, startVerse: 3, endChapter: 5, endVerse: 3 },
          note: 'Used twice: believers rejoice in afflictions because affliction produces perseverance.',
        },
        {
          ref: { book: 'JHN', startChapter: 16, startVerse: 33, endChapter: 16, endVerse: 33 },
          note: 'Jesus warns that his followers will face tribulation in the world, and assures them that he has overcome it.',
        },
        {
          ref: { book: 'COL', startChapter: 1, startVerse: 24, endChapter: 1, endVerse: 24 },
          note: 'The disputed phrase about what is lacking in Christ’s afflictions.',
        },
      ],
      significance: text(
        'By our count of the STEPBible tagged Greek New Testament, θλῖψις occurs 45 times, and 2 Corinthians has more occurrences (9) than any other book — this is a letter written from under pressure. In 4:17 Paul calls this affliction light and momentary, not because it is trivial (4:8–9 and 11:23–29 show otherwise) but because it is being weighed against an eternal weight of glory. The cognate verb θλίβω opens the list of hardships in 4:8 (hard pressed), so the hardship list opens with pressure (4:8) and the conclusion names it again (4:17).',
        synthesis(
          cite('stepbible-tbesg', 'G2347 θλῖψις; G2346 θλίβω'),
          cite('stepbible-tagnt', '2 Cor 4:8, 17; concordance count by Strong’s number'),
          cite('bsb', '2 Cor 4:8–9, 17; 11:23–29'),
        ),
      ),
      caution:
        'The lexicon’s literal sense is pressure, but that does not mean every use carries a vivid picture of crushing. In the New Testament the word is used figuratively for affliction and distress; context, not etymology, decides the nuance.',
      provenance: lexical(
        cite('stepbible-tbesg', 'G2347'),
        cite('stepbible-tagnt', '2 Cor 4:17 (N-GSF)'),
      ),
    },
    {
      id: 'suffering:kw:ostrakinos',
      strong: 'G3749',
      language: 'greek',
      lemma: 'ὀστράκινος',
      transliteration: 'ostrakinos',
      pronunciation: 'os-TRAH-kee-nos',
      english: 'jars of clay (earthen)',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 7 },
          phrases: { BSB: 'jars of clay', KJV: 'earthen vessels', WEB: 'clay vessels' },
        },
      ],
      grammar: 'Adjective, dative plural neuter (with σκεῦος, “vessel”, G4632)',
      basicMeaning: 'made of clay, earthen',
      semanticRange: ['made of clay', 'earthen, earthenware'],
      notableOccurrences: [
        {
          ref: { book: '2TI', startChapter: 2, startVerse: 20, endChapter: 2, endVerse: 20 },
          note: 'The only other New Testament use: a large house has vessels of gold and silver, and also of wood and clay.',
        },
        {
          ref: { book: 'JOB', startChapter: 2, startVerse: 8, endChapter: 2, endVerse: 8 },
          note: 'Not the same word, but its root: in the Greek Old Testament Job scrapes his sores with an ὄστρακον, a potsherd.',
        },
      ],
      significance: text(
        'The adjective comes from ὄστρακον, an earthen vessel or potsherd, and appears only twice in the New Testament (2 Cor 4:7; 2 Tim 2:20). Paul’s image sets the priceless treasure of 4:6 — the light of the knowledge of God’s glory in the face of Christ — inside something cheap and breakable: his mortal body and his battered ministry. The point is stated in the same verse: so that the surpassing power may be seen to be God’s and not ours. Weakness is not an embarrassment to the gospel; it is where God’s power becomes visible.',
        synthesis(
          cite('stepbible-tbesg', 'G3749 ὀστράκινος; G4632 σκεῦος'),
          cite('stepbible-tagnt', '2 Cor 4:7; 2 Tim 2:20'),
          cite('bsb', '2 Cor 4:6–7'),
          cite('tyndale-open-study-notes', 'on 2 Cor 4:7', TYN_2CO_4),
        ),
      ),
      caution:
        'The jar is a metaphor for human frailty and ordinariness, not a claim that the body is worthless. Paul expects the body itself to be raised (4:14).',
      provenance: lexical(
        cite('stepbible-tbesg', 'G3749'),
        cite('stepbible-tagnt', '2 Cor 4:7 (A-DPN)'),
        cite('lxx-brenton', 'Job 2:8', 'https://bible.helloao.org/api/grc_bre/JOB/2.json'),
      ),
    },
    {
      id: 'suffering:kw:exaporeo',
      strong: 'G1820',
      language: 'greek',
      lemma: 'ἐξαπορέω',
      transliteration: 'exaporeō',
      pronunciation: 'ex-ah-por-EH-oh',
      english: 'despair',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 8 },
          phrases: { BSB: 'despair', KJV: 'despair', WEB: 'despair' },
        },
      ],
      grammar: 'Verb, present middle/passive (deponent) participle, nominative plural masculine',
      basicMeaning: 'to be utterly at a loss, to be in despair',
      semanticRange: ['to be utterly at a loss', 'to be in despair'],
      notableOccurrences: [
        {
          ref: { book: '2CO', startChapter: 1, startVerse: 8, endChapter: 1, endVerse: 8 },
          note: 'The only other New Testament use: Paul admits that in Asia they despaired even of life.',
        },
        {
          ref: { book: 'PSA', startChapter: 88, startVerse: 15, endChapter: 88, endVerse: 15 },
          note: 'The Greek Old Testament uses this verb for the psalmist’s I am in despair.',
        },
      ],
      significance: text(
        'Paul plays on two related verbs in 4:8: ἀπορούμενοι (perplexed, at a loss) but not ἐξαπορούμενοι (utterly at a loss, in despair). The prefix intensifies the word, and the pun is audible in Greek. The verb appears only twice in the New Testament — here and in 1:8, where Paul admits that in Asia they did despair of life. Read together, the verses suggest that not in despair is not a claim to unbroken calm but a testimony that despair did not have the last word, because they learned to rely on the God who raises the dead (1:9).',
        synthesis(
          cite('stepbible-tbesg', 'G0639 ἀπορέω; G1820 ἐξαπορέω'),
          cite('stepbible-tagnt', '2 Cor 1:8; 4:8'),
          cite('bsb', '2 Cor 1:8–10; 4:8'),
        ),
      ),
      caution:
        'The wordplay is clear in Greek, but English translations cannot reproduce it; do not build a doctrine on the prefix alone.',
      provenance: lexical(
        cite('stepbible-tbesg', 'G1820'),
        cite('stepbible-tagnt', '2 Cor 4:8 (V-PNP-NPM)'),
        cite('lxx-brenton', 'Ps 87:16 LXX (= Ps 88:15)', LXX_PSA_87),
      ),
    },
    {
      id: 'suffering:kw:nekrosis',
      strong: 'G3500',
      language: 'greek',
      lemma: 'νέκρωσις',
      transliteration: 'nekrōsis',
      pronunciation: 'NEK-roh-sis',
      english: 'death (dying)',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 10 },
          phrases: { BSB: 'death', KJV: 'dying', WEB: 'putting to death' },
        },
      ],
      grammar: 'Noun, accusative singular feminine',
      basicMeaning: 'a putting to death; a state of death',
      semanticRange: ['a putting to death', 'a state of death, deadness'],
      notableOccurrences: [
        {
          ref: { book: 'ROM', startChapter: 4, startVerse: 19, endChapter: 4, endVerse: 19 },
          note: 'The only other New Testament use: the lifelessness (deadness) of Sarah’s womb — from which God brought life.',
        },
      ],
      significance: text(
        'Paul does not use the ordinary word for death (θάνατος) here but the rarer νέκρωσις, which the lexicon glosses as a putting to death or a state of death. It suggests a process — the daily dying of a body worn down by persecution — which Paul carries around as the mark of Jesus’ own death. The purpose clause matters as much: so that the life of Jesus may also be revealed in our body. Calvin rendered the word mortificatio, and a note in the Calvin Translation Society edition quotes Beza, who used the same rendering, explaining that here it describes not death itself but a condition exposed to death every day.',
        synthesis(
          cite('stepbible-tbesg', 'G3500 νέκρωσις'),
          cite('stepbible-tagnt', '2 Cor 4:10; Rom 4:19'),
          cite('calvin-commentaries', 'on 2 Cor 4:10, editor’s note 470', CALVIN_2CO_4),
        ),
      ),
      caution:
        'Paul is not saying his sufferings atone for sin. He shares the pattern of Christ’s death, not its unique saving work.',
      provenance: lexical(
        cite('stepbible-tbesg', 'G3500'),
        cite('stepbible-tagnt', '2 Cor 4:10 (N-ASF)'),
      ),
    },
    {
      id: 'suffering:kw:ekkakeo',
      strong: 'G1573',
      language: 'greek',
      lemma: 'ἐκκακέω',
      transliteration: 'ekkakeō',
      pronunciation: 'ek-kak-EH-oh',
      english: 'lose heart',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 16 },
          phrases: { BSB: 'lose heart', KJV: 'faint', WEB: 'faint' },
        },
      ],
      grammar:
        'Verb, present active indicative, first person plural (ἐγκακοῦμεν in the Nestle-Aland text; ἐκκακοῦμεν in the Textus Receptus)',
      basicMeaning: 'to lose heart',
      semanticRange: ['to lose heart', 'to be discouraged', 'to grow weary (in doing good)'],
      notableOccurrences: [
        {
          ref: { book: '2CO', startChapter: 4, startVerse: 1, endChapter: 4, endVerse: 1 },
          note: 'The chapter opens with the same words: we do not lose heart.',
        },
        {
          ref: { book: 'LUK', startChapter: 18, startVerse: 1, endChapter: 18, endVerse: 1 },
          note: 'Jesus tells a parable to teach persistent prayer instead of losing heart.',
        },
        {
          ref: { book: 'GAL', startChapter: 6, startVerse: 9, endChapter: 6, endVerse: 9 },
          note: 'Paul urges believers not to grow weary in doing good, because a harvest is coming.',
        },
      ],
      significance: text(
        'The verb occurs six times in the New Testament by our count, twice in this chapter (4:1, 4:16). The two uses bracket most of the chapter: Paul does not lose heart because of the mercy that gave him his ministry (4:1), and he does not lose heart because the inner self is renewed day by day (4:16). Elsewhere it describes growing weary in doing good (Gal 6:9; 2 Thess 3:13) or being discouraged by an apostle’s sufferings (Eph 3:13), and Luke 18:1 pairs it with prayer — a hint of where courage is renewed.',
        synthesis(
          cite('stepbible-tbesg', 'G1573 ἐκκακέω (see ἐνκακέω)'),
          cite('stepbible-tagnt', 'Luke 18:1; 2 Cor 4:1, 16; Gal 6:9; Eph 3:13; 2 Thess 3:13'),
          cite('bsb', '2 Cor 4:1, 16; Gal 6:9; Eph 3:13; 2 Thess 3:13; Luke 18:1'),
        ),
      ),
      caution:
        'Older lexicons connect the word with κακός (“cowardly”), but usage, not etymology, decides meaning: in the New Testament it means losing heart or growing weary, not specifically cowardice.',
      provenance: lexical(
        cite('stepbible-tbesg', 'G1573'),
        cite('stepbible-tagnt', '2 Cor 4:16 (V-PAI-1P)'),
      ),
    },
    {
      id: 'suffering:kw:baros',
      strong: 'G0922',
      language: 'greek',
      lemma: 'βάρος',
      transliteration: 'baros',
      pronunciation: 'BAH-ros',
      english: 'weight',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 17 },
          phrases: { BSB: 'weight', KJV: 'weight', WEB: 'weight' },
        },
      ],
      grammar: 'Noun, accusative singular neuter',
      basicMeaning: 'weight, burden',
      semanticRange: ['weight', 'burden', 'dignity, authority (in later Greek)'],
      notableOccurrences: [
        {
          ref: { book: 'GAL', startChapter: 6, startVerse: 2, endChapter: 6, endVerse: 2 },
          note: 'Believers are to carry one another’s burdens — here the word means a load that weighs a person down.',
        },
        {
          ref: { book: 'ACT', startChapter: 15, startVerse: 28, endChapter: 15, endVerse: 28 },
          note: 'The Jerusalem council resolves not to burden Gentile believers beyond what is essential.',
        },
      ],
      significance: text(
        'Paul sets a deliberate counterweight: ἐλαφρόν, the lightness of present affliction, against βάρος, an eternal weight of glory, and piles up the phrase καθ᾽ ὑπερβολὴν εἰς ὑπερβολήν (literally beyond measure to beyond measure). An old line of interpretation, cited in a note to the Calvin Translation Society edition from the eighteenth-century lexicographer John Parkhurst, hears a Hebrew echo: the word for glory, כָּבוֹד (kavod, H3519), is related to the verb כָּבֵד (H3513), whose range includes both to be heavy and to be honoured. The lexicon notes a Greek Old Testament passage where βάρος renders this Hebrew root (Judg 18:21). The suggestion is attractive — glory as the true heaviness of reality — but Paul does not spell it out.',
        synthesis(
          cite('stepbible-tbesg', 'G0922 βάρος; G1645 ἐλαφρός; G5236 ὑπερβολή'),
          cite('stepbible-tbesh', 'H3519 כָּבוֹד; H3513 כָּבֵד'),
          cite('stepbible-tagnt', '2 Cor 4:17'),
          cite('calvin-commentaries', 'on 2 Cor 4:17, editor’s note 500 (citing Parkhurst)', CALVIN_2CO_4),
        ),
      ),
      caution:
        'The kavod connection is a proposal, not a certainty: Paul wrote in Greek and does not signal a Hebrew wordplay. Treat it as an illuminating possibility, not the key to the verse.',
      provenance: lexical(
        cite('stepbible-tbesg', 'G0922'),
        cite('stepbible-tagnt', '2 Cor 4:17 (N-ASN)'),
      ),
    },
    {
      id: 'suffering:kw:pascho',
      strong: 'G3958',
      language: 'greek',
      lemma: 'πάσχω',
      transliteration: 'paschō',
      pronunciation: 'PAS-khoh',
      english: 'suffer',
      anchors: [
        {
          verse: { book: '1PE', chapter: 4, verse: 19 },
          phrases: { BSB: 'suffer', KJV: 'suffer', WEB: 'suffer' },
        },
      ],
      grammar: 'Verb, present active participle, nominative plural masculine (in 1 Pet 4:19)',
      basicMeaning: 'to suffer; to be acted upon',
      semanticRange: ['to suffer (misfortune, pain)', 'to experience, be acted upon'],
      notableOccurrences: [
        {
          ref: { book: 'LUK', startChapter: 24, startVerse: 26, endChapter: 24, endVerse: 26 },
          note: 'The risen Jesus explains that the Messiah had to suffer before entering his glory.',
        },
        {
          ref: { book: 'HEB', startChapter: 5, startVerse: 8, endChapter: 5, endVerse: 8 },
          note: 'Even the Son learned obedience through what he suffered.',
        },
        {
          ref: { book: 'PHP', startChapter: 1, startVerse: 29, endChapter: 1, endVerse: 29 },
          note: 'Suffering for Christ is described as something granted to believers, alongside faith itself.',
        },
        {
          ref: { book: '2CO', startChapter: 1, startVerse: 6, endChapter: 1, endVerse: 6 },
          note: 'In 2 Corinthians Paul speaks of the Corinthians enduring the same sufferings he experiences.',
        },
      ],
      significance: text(
        'The basic New Testament verb for suffering does not appear in 2 Corinthians 4, but it frames the topic. By our count it occurs 42 times, and 1 Peter uses it more than any other book (12 times) — a letter to scattered believers facing hostility. The lexicon notes its basic sense of being acted upon rather than acting: suffering is what happens to us. The Gospels use it for the necessity of the Messiah’s suffering (Luke 24:26), and 1 Peter 4:19 tells those who suffer according to God’s will to entrust themselves to a faithful Creator.',
        synthesis(
          cite('stepbible-tbesg', 'G3958 πάσχω'),
          cite('stepbible-tagnt', 'concordance count by Strong’s number; 1 Pet 4:19'),
          cite('bsb', 'Luke 24:26; 1 Pet 4:19'),
        ),
      ),
      provenance: lexical(
        cite('stepbible-tbesg', 'G3958'),
        cite('stepbible-tagnt', '1 Pet 4:19 (V-PAP-NPM)'),
      ),
    },
    {
      id: 'suffering:kw:oni',
      strong: 'H6040',
      language: 'hebrew',
      lemma: 'עֳנִי',
      transliteration: 'o.ni',
      pronunciation: 'oh-NEE',
      english: 'affliction',
      anchors: [
        {
          verse: { book: 'LAM', chapter: 3, verse: 19 },
          phrases: { BSB: 'affliction', KJV: 'affliction', WEB: 'affliction' },
        },
      ],
      grammar: 'Noun, common masculine singular construct, with first-person suffix (my affliction)',
      basicMeaning: 'affliction, poverty, misery',
      semanticRange: ['affliction', 'poverty', 'misery'],
      notableOccurrences: [
        {
          ref: { book: 'EXO', startChapter: 3, startVerse: 7, endChapter: 3, endVerse: 7 },
          note: 'At the burning bush God tells Moses he has seen the affliction of his people in Egypt.',
        },
        {
          ref: { book: 'DEU', startChapter: 16, startVerse: 3, endChapter: 16, endVerse: 3 },
          note: 'The unleavened Passover bread is called the bread of affliction, eaten in remembrance of Egypt.',
        },
        {
          ref: { book: 'ISA', startChapter: 48, startVerse: 10, endChapter: 48, endVerse: 10 },
          note: 'God speaks of testing his people in the furnace of affliction.',
        },
        {
          ref: { book: 'PSA', startChapter: 119, startVerse: 50, endChapter: 119, endVerse: 50 },
          note: 'The psalmist finds comfort in affliction in God’s life-giving promise.',
        },
        {
          ref: { book: 'JOB', startChapter: 36, startVerse: 15, endChapter: 36, endVerse: 15 },
          note: 'Elihu claims that God rescues the afflicted through their very affliction.',
        },
      ],
      significance: text(
        'By our count of the STEPBible tagged Hebrew text, עֳנִי occurs 36 times, most often in the Psalms (10), Job (6) and Lamentations (5). Its range runs from affliction to poverty and misery, and it is frequently something God sees: the story of the exodus begins with the LORD saying he has seen his people’s affliction (Exod 3:7). In Lamentations 3:19 the poet asks God to remember his affliction — and within a few verses remembers God’s mercies (3:21–23). The same word that names suffering also becomes part of Israel’s worship, in the bread of affliction at Passover.',
        synthesis(
          cite('stepbible-tbesh', 'H6040 עֳנִי'),
          cite('stepbible-tahot', 'Lam 3:19; concordance count by Strong’s number'),
          cite('bsb', 'Exod 3:7; Deut 16:3; Lam 3:19–23'),
        ),
      ),
      provenance: lexical(
        cite('stepbible-tbesh', 'H6040'),
        cite('stepbible-tahot', 'Lam 3:19 (HNcmsc/Sp1bs)'),
      ),
    },
    {
      id: 'suffering:kw:an',
      strong: 'H0575',
      language: 'hebrew',
      lemma: 'אָן',
      transliteration: 'an',
      pronunciation: 'AHN (in the phrase ad-AH-nah)',
      english: 'how long',
      anchors: [
        {
          verse: { book: 'PSA', chapter: 13, verse: 1 },
          phrases: { BSB: 'How long', KJV: 'How long', WEB: 'How long' },
        },
      ],
      grammar: 'Interrogative particle; in Ps 13:1 (Hebrew v. 2) in the phrase עַד־אָנָה (with עַד, “until”, H5704)',
      basicMeaning: 'where? whither?; (of time) when? until when? how long?',
      semanticRange: ['where? whither? (of place)', 'when? until when? how long? (of time)'],
      notableOccurrences: [
        {
          ref: { book: 'HAB', startChapter: 1, startVerse: 2, endChapter: 1, endVerse: 2 },
          note: 'The prophet’s how long about violence and injustice.',
        },
        {
          ref: { book: 'JOB', startChapter: 19, startVerse: 2, endChapter: 19, endVerse: 2 },
          note: 'Job turns the question on his friends, asking how long they will torment him.',
        },
        {
          ref: { book: 'NUM', startChapter: 14, startVerse: 11, endChapter: 14, endVerse: 11 },
          note: 'The LORD himself asks how long his people will treat him with contempt — the question runs in both directions.',
        },
      ],
      significance: text(
        'The English how long renders a two-word Hebrew idiom, עַד־אָנָה — literally until where? By our count the pairing occurs 14 times in the Hebrew Bible, four of them in the first two verses of Psalm 13, where, as the Tyndale notes observe, the repetition conveys agitation and deep anguish. Hebrew has a second how-long idiom, עַד־מָתַי (with מָתַי, H4970, when?), used for example in Psalm 6:3. Either way, the question itself is significant: it assumes God is able to act and will act. It is a complaint about timing, not a denial of God.',
        synthesis(
          cite('stepbible-tbesh', 'H0575 אָן; H5704 עַד; H4970 מָתַי'),
          cite('stepbible-tahot', 'Ps 13:1–2 (Hebrew 13:2–3); count of H5704 + H0575 by Strong’s number'),
          cite('tyndale-open-study-notes', 'on Ps 13:1–2', 'https://bible.helloao.org/api/c/tyndale/PSA/13.json'),
        ),
      ),
      caution:
        'אָן by itself usually means where?; it is the combination with עַד that yields how long. The key word card shows the interrogative, but the meaning belongs to the phrase.',
      provenance: lexical(
        cite('stepbible-tbesh', 'H0575'),
        cite('stepbible-tahot', 'Ps 13:1 [Heb 13:2] (HTi)'),
      ),
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Cross-references                                                    */
  /* ------------------------------------------------------------------ */

  crossReferences: [
    {
      id: 'suffering:xr:rom-5-3',
      from: { book: '2CO', startChapter: 4, startVerse: 17, endChapter: 4, endVerse: 17 },
      target: { book: 'ROM', startChapter: 5, startVerse: 3, endChapter: 5, endVerse: 5 },
      relationship: 'same-concept',
      title: 'Affliction that produces something',
      explanation: text(
        'Both passages say affliction produces something, and both use the same Greek verb (κατεργάζομαι, to work out, produce) with the same noun θλῖψις. In 2 Corinthians 4:17 affliction is producing an eternal weight of glory; in Romans 5:3–4 it produces perseverance, character and hope. Romans describes the change God works in the believer now; 2 Corinthians looks to the glory that will outweigh it. Together they rule out the idea that suffering is wasted in God’s hands.',
        synthesis(
          cite('stepbible-tagnt', 'Rom 5:3; 2 Cor 4:17 (G2716, G2347)'),
          cite('bsb', 'Rom 5:3–5; 2 Cor 4:17'),
        ),
      ),
      tags: ['affliction', 'perseverance', 'glory', 'purpose', 'paul'],
    },
    {
      id: 'suffering:xr:rom-8-18',
      from: { book: '2CO', startChapter: 4, startVerse: 17, endChapter: 4, endVerse: 18 },
      target: { book: 'ROM', startChapter: 8, startVerse: 18, endChapter: 8, endVerse: 18 },
      relationship: 'same-concept',
      title: 'Not worth comparing with the glory',
      explanation: text(
        'Written within a year or so of 2 Corinthians, Romans 8:18 makes the same comparison in plainer words: present sufferings are not comparable to the glory to be revealed. Paul is not minimising pain; he is setting it on a scale whose other side is so heavy that it changes how the present feels. The Romans 8 study explores this verse and the groaning creation that follows.',
        synthesis(
          cite('bsb', 'Rom 8:18; 2 Cor 4:17–18'),
          cite('tyndale-open-study-notes', '2 Corinthians Book Introduction, “Date and Occasion of Writing”', TYN_2CO_INTRO),
          cite('tyndale-open-study-notes', 'Romans Book Introduction, “Date, Place, and Occasion of Writing”', TYN_2CO_INTRO),
        ),
      ),
      tags: ['glory', 'hope', 'comparison', 'paul', 'romans'],
    },
    {
      id: 'suffering:xr:2co-1-3',
      from: { book: '2CO', startChapter: 4, startVerse: 8, endChapter: 4, endVerse: 9 },
      target: { book: '2CO', startChapter: 1, startVerse: 3, endChapter: 1, endVerse: 11 },
      relationship: 'parallel',
      title: 'The God of all comfort — and the despair in Asia',
      explanation: text(
        'The letter’s opening is the best commentary on chapter 4. God comforts us in all our affliction (θλῖψις, twice in 1:4) so that we can comfort others; and Paul recounts a crisis in Asia so severe that they despaired even of life (1:8) — the same verb he negates in 4:8. The purpose he draws from it matches chapter 4 exactly: not to rely on ourselves but on God who raises the dead (1:9; compare 4:7, 14). What exactly happened in Asia is uncertain; the Tyndale notes mention the Ephesian riot or a trial facing execution as possibilities.',
        synthesis(
          cite('bsb', '2 Cor 1:3–11; 4:7–14'),
          cite('stepbible-tagnt', '2 Cor 1:4, 8; 4:8 (G2347, G1820)'),
          cite('tyndale-open-study-notes', 'on 2 Cor 1:8–11', TYN_2CO_1),
        ),
      ),
      tags: ['comfort', 'asia', 'despair', 'resurrection', 'paul'],
    },
    {
      id: 'suffering:xr:2co-11-23',
      from: { book: '2CO', startChapter: 4, startVerse: 8, endChapter: 4, endVerse: 9 },
      target: { book: '2CO', startChapter: 11, startVerse: 23, endChapter: 11, endVerse: 30 },
      relationship: 'historical',
      title: 'What hard pressed actually meant',
      explanation: text(
        'Chapter 11 fills in the history behind 4:8–9: lashings, three beatings with rods, a stoning, three shipwrecks, danger from rivers and bandits, hunger, cold — and the daily pressure of concern for the churches. Some items can be matched in Acts (beaten with rods at Philippi, Acts 16:22–23; stoned at Lystra, Acts 14:19). Since 2 Corinthians was written before Paul’s final journey to Jerusalem and Rome, none of the three shipwrecks can be the famous one of Acts 27. Paul’s light affliction was anything but light by human measure.',
        synthesis(
          cite('bsb', '2 Cor 11:23–30; Acts 14:19; 16:22–23'),
          cite('tyndale-open-study-notes', '2 Corinthians Book Introduction, “Date and Occasion of Writing”', TYN_2CO_INTRO),
        ),
      ),
      tags: ['hardships', 'paul', 'persecution', 'history'],
    },
    {
      id: 'suffering:xr:2co-12-7',
      from: { book: '2CO', startChapter: 4, startVerse: 7, endChapter: 4, endVerse: 7 },
      target: { book: '2CO', startChapter: 12, startVerse: 7, endChapter: 12, endVerse: 10 },
      relationship: 'same-concept',
      title: 'Power made perfect in weakness',
      explanation: text(
        'Chapter 4 states the principle; chapter 12 tells the story. In 4:7 the surpassing power (δύναμις) belongs to God, not to the fragile jar. In 12:9, after Paul had asked three times for the thorn to be removed, the Lord answered by refusing the request and promising something else: his grace is sufficient, and his power (δύναμις) is perfected in weakness. John Chrysostom, commenting on 4:7, already linked the two verses. The thorn is unidentified, but the lesson is clear: weakness is the place where Christ’s power rests.',
        synthesis(
          cite('bsb', '2 Cor 4:7; 12:7–10'),
          cite('chrysostom-homilies-2-corinthians', 'Homily 8 §3, on 2 Cor 4:7', CHRYS_HOM_8),
          cite('tyndale-open-study-notes', 'on 2 Cor 12:7b–10', 'https://bible.helloao.org/api/c/tyndale/2CO/12.json'),
        ),
      ),
      tags: ['weakness', 'power', 'thorn', 'grace', 'paul'],
    },
    {
      id: 'suffering:xr:php-3-10',
      from: { book: '2CO', startChapter: 4, startVerse: 10, endChapter: 4, endVerse: 11 },
      target: { book: 'PHP', startChapter: 3, startVerse: 10, endChapter: 3, endVerse: 11 },
      relationship: 'thematic',
      title: 'The fellowship of his sufferings',
      explanation: text(
        'In Philippians Paul says he wants to know Christ — the power of his resurrection and the fellowship of his sufferings, being conformed to his death. It is the same double movement as 2 Corinthians 4:10–11: carrying the death of Jesus so that the life of Jesus is revealed. For Paul, suffering for Christ is not a detour from knowing him but one of the ways he is known.',
        synthesis(cite('bsb', 'Phil 3:10–11; 2 Cor 4:10–11')),
      ),
      tags: ['union with christ', 'resurrection', 'fellowship', 'paul'],
    },
    {
      id: 'suffering:xr:col-1-24',
      from: { book: '2CO', startChapter: 4, startVerse: 12, endChapter: 4, endVerse: 12 },
      target: { book: 'COL', startChapter: 1, startVerse: 24, endChapter: 1, endVerse: 24 },
      relationship: 'thematic',
      title: 'Suffering for the sake of the church',
      explanation: text(
        'Death at work in us, life in you (4:12) has a close cousin in Colossians 1:24, where Paul rejoices in sufferings for the church and speaks of filling up what is lacking in Christ’s afflictions. The Tyndale notes themselves link the two verses. The Colossians phrase needs care. The Tyndale note explains that Christ’s redemptive suffering is unique and finished, while Christ continues to suffer through his people in a hostile world. Christians agree that nothing can be added to Christ’s saving work, but they read the verse differently. Calvin took it to mean that Christ, having suffered once in his own person, still suffers in his members, whose afflictions strengthen the faith of the church — and he rejected any reading that made them expiatory. Catholic teaching (John Paul II, Salvifici Doloris §24, 1984) also says that no one can add anything to the redemption, yet speaks of believers, united to Christ, sharing in his redemptive suffering for the Church.',
        synthesis(
          cite('bsb', '2 Cor 4:12; Col 1:24'),
          cite('tyndale-open-study-notes', 'on 2 Cor 4:12', TYN_2CO_4),
          cite('tyndale-open-study-notes', 'on Col 1:24', 'https://bible.helloao.org/api/c/tyndale/COL/1.json'),
          cite('calvin-commentaries', 'on Col 1:24', CALVIN_COL_1),
          cite('salvifici-doloris', '§24', SALVIFICI_DOLORIS),
        ),
      ),
      tags: ['church', 'afflictions of christ', 'ministry', 'paul'],
    },
    {
      id: 'suffering:xr:1pe-1-6',
      from: { book: '2CO', startChapter: 4, startVerse: 17, endChapter: 4, endVerse: 17 },
      target: { book: '1PE', startChapter: 1, startVerse: 6, endChapter: 1, endVerse: 7 },
      relationship: 'parallel',
      title: 'For a little while — refined like gold',
      explanation: text(
        'Peter matches Paul’s momentary with his own for a little while, and adds an image: faith proven through trials like gold refined by fire, resulting in praise and glory when Christ is revealed. Peter, like Paul, describes present trials as brief and purposeful when set against the coming glory.',
        synthesis(cite('bsb', '1 Pet 1:6–7; 2 Cor 4:17')),
      ),
      tags: ['trials', 'refining', 'glory', 'peter'],
    },
    {
      id: 'suffering:xr:1pe-4-12',
      from: { book: '2CO', startChapter: 4, startVerse: 10, endChapter: 4, endVerse: 11 },
      target: { book: '1PE', startChapter: 4, startVerse: 12, endChapter: 4, endVerse: 19 },
      relationship: 'parallel',
      title: 'Sharing in the sufferings of Christ',
      explanation: text(
        'Peter tells believers not to be surprised by the fiery trial, as if something strange were happening, but to rejoice that they share in Christ’s sufferings (4:12–13) — the same union with Christ that Paul expresses as carrying the death of Jesus. Peter adds two distinctions Paul would share: suffering as a wrongdoer is not the same as suffering as a Christian (4:15–16), and those who suffer should entrust themselves to a faithful Creator and keep doing good (4:19).',
        synthesis(cite('bsb', '1 Pet 4:12–19; 2 Cor 4:10–11')),
      ),
      tags: ['persecution', 'union with christ', 'trust', 'peter'],
    },
    {
      id: 'suffering:xr:jas-1-2',
      from: { book: '2CO', startChapter: 4, startVerse: 16, endChapter: 4, endVerse: 17 },
      target: { book: 'JAS', startChapter: 1, startVerse: 2, endChapter: 1, endVerse: 4 },
      relationship: 'thematic',
      title: 'Testing that produces endurance',
      explanation: text(
        'James, like Paul, uses κατεργάζομαι (produce): the testing of faith produces perseverance, which leads to maturity. Where Paul speaks of the inner self renewed day by day, James speaks of becoming complete, lacking nothing. Neither calls trials pleasant; both call them productive.',
        synthesis(
          cite('stepbible-tagnt', 'Jas 1:3; 2 Cor 4:17 (G2716)'),
          cite('bsb', 'Jas 1:2–4; 2 Cor 4:16–17'),
        ),
      ),
      tags: ['trials', 'perseverance', 'maturity', 'james'],
    },
    {
      id: 'suffering:xr:gen-1-3',
      from: { book: '2CO', startChapter: 4, startVerse: 6, endChapter: 4, endVerse: 7 },
      target: { book: 'GEN', startChapter: 1, startVerse: 3, endChapter: 1, endVerse: 3 },
      relationship: 'allusion',
      title: 'Let light shine out of darkness',
      explanation: text(
        'The treasure of 4:7 is the light of 4:6, and Paul describes God as the one who said let light shine out of darkness and has shone in our hearts. Chrysostom heard the creation of light in Genesis 1:3 here (with the darkness of 1:2), and many later commentators follow him: Jamieson, Fausset and Brown cite Genesis 1:3, and Calvin judged this the most natural of several readings while leaving the question open. The exact Greek wording (φῶς λάμψει, light will shine) matches Isaiah 9:2 in the Septuagint rather than Genesis 1:3, so Paul may be blending creation with Isaiah’s promised dawn. Either way, the point matters for suffering: the God who made light at the beginning is making a new creation now, and he places that light in fragile jars.',
        synthesis(
          cite('bsb', 'Gen 1:2–3; Isa 9:2; 2 Cor 4:6–7'),
          cite('stepbible-tagnt', '2 Cor 4:6 (G2989 λάμψει, V-FAI-3S)'),
          cite('lxx-brenton', 'Gen 1:3 LXX', 'https://bible.helloao.org/api/grc_bre/GEN/1.json'),
          cite('lxx-brenton', 'Isa 9:1 LXX (= Isa 9:2)', 'https://bible.helloao.org/api/grc_bre/ISA/9.json'),
          cite('chrysostom-homilies-2-corinthians', 'Homily 8 §3, on 2 Cor 4:6', CHRYS_HOM_8),
          cite('calvin-commentaries', 'on 2 Cor 4:6', CALVIN_2CO_4),
          cite('jfb-commentary', 'on 2 Cor 4:6', JFB_2CO_4),
        ),
      ),
      tags: ['creation', 'light', 'new creation', 'allusion'],
    },
    {
      id: 'suffering:xr:psa-116-10',
      from: { book: '2CO', startChapter: 4, startVerse: 13, endChapter: 4, endVerse: 13 },
      target: { book: 'PSA', startChapter: 116, startVerse: 10, endChapter: 116, endVerse: 10 },
      relationship: 'quotation',
      title: 'I believed, therefore I spoke',
      explanation: text(
        'Paul quotes the Greek Old Testament word for word: ἐπίστευσα, διὸ ἐλάλησα. In the Septuagint these words open a separate psalm (Ps 115 LXX), because the Greek divides Hebrew Psalm 116 in two. Calvin noted that Paul follows the common Greek translation. The context is telling: the psalmist goes on to say he was greatly afflicted. Paul borrows the voice of a sufferer who kept believing and kept speaking — the same spirit of faith he claims for himself.',
        synthesis(
          cite('lxx-brenton', 'Ps 115:1 LXX', LXX_PSA_115),
          cite('stepbible-tagnt', '2 Cor 4:13'),
          cite('bsb', 'Ps 116:10; 2 Cor 4:13'),
          cite('calvin-commentaries', 'on 2 Cor 4:13', CALVIN_2CO_4),
        ),
      ),
      tags: ['quotation', 'faith', 'psalms', 'septuagint'],
    },
    {
      id: 'suffering:xr:isa-53-3',
      from: { book: '2CO', startChapter: 4, startVerse: 10, endChapter: 4, endVerse: 10 },
      target: { book: 'ISA', startChapter: 53, startVerse: 3, endChapter: 53, endVerse: 5 },
      relationship: 'thematic',
      title: 'The Servant who carried our sorrows',
      explanation: text(
        'The death of Jesus that Paul carries around is the death of the Servant who was despised, acquainted with grief and crushed for our iniquities. Isaiah’s song shows that the path of God’s chosen one runs through suffering to vindication; Paul’s ministry follows the same pattern at a distance — sharing the shape of Christ’s suffering, not its atoning work.',
        synthesis(cite('bsb', 'Isa 53:3–5; 2 Cor 4:10')),
      ),
      tags: ['servant', 'christ', 'suffering', 'isaiah'],
    },
    {
      id: 'suffering:xr:job-1-9',
      from: { book: '2CO', startChapter: 4, startVerse: 8, endChapter: 4, endVerse: 9 },
      target: { book: 'JOB', startChapter: 1, startVerse: 6, endChapter: 2, endVerse: 10 },
      relationship: 'thematic',
      title: 'Does Job fear God for nothing?',
      explanation: text(
        'The accuser’s claim in Job is that faith is only fair-weather: take away the blessings and the believer will curse God. Job’s worship after loss is the first refutation; Paul’s struck down, but not destroyed is another. Both show a faith that holds when the hedge of protection is gone. Both texts answer the accuser’s cynical theory with what grace actually does in sufferers.',
        synthesis(
          cite('bsb', 'Job 1:9–11, 20–22; 2:9–10; 2 Cor 4:8–9'),
          cite('tyndale-open-study-notes', 'Job, Book Introduction, “Summary”', TYN_2CO_INTRO),
        ),
      ),
      tags: ['job', 'satan', 'faith', 'integrity'],
    },
    {
      id: 'suffering:xr:rev-21-3',
      from: { book: '2CO', startChapter: 4, startVerse: 17, endChapter: 4, endVerse: 18 },
      target: { book: 'REV', startChapter: 21, startVerse: 3, endChapter: 21, endVerse: 5 },
      relationship: 'thematic',
      title: 'The unseen things made visible',
      explanation: text(
        'Paul fixes his eyes on what is unseen and eternal. Revelation 21 pictures it: God dwelling with his people, tears wiped away (echoing Isaiah 25:8’s promise that God will swallow up death and wipe away tears), and no more death, mourning, crying or pain. The eternal weight of glory is not an abstraction but a renewed creation in God’s presence.',
        synthesis(cite('bsb', 'Rev 21:3–5; Isa 25:8; 2 Cor 4:17–18')),
      ),
      tags: ['new creation', 'hope', 'glory', 'eschatology'],
    },
    {
      id: 'suffering:xr:heb-12-1',
      from: { book: '2CO', startChapter: 4, startVerse: 18, endChapter: 4, endVerse: 18 },
      target: { book: 'HEB', startChapter: 12, startVerse: 1, endChapter: 12, endVerse: 3 },
      relationship: 'thematic',
      title: 'Jesus endured the cross for the joy ahead',
      explanation: text(
        'Hebrews calls believers to run with endurance, looking to Jesus, who for the joy set before him endured the cross. It is the same logic as 2 Corinthians 4:17–18 — present suffering endured in view of what lies ahead — but applied first to Jesus himself. (The BSB renders both passages with fix our eyes, though the Greek verbs differ: σκοπέω in 2 Corinthians, ἀφοράω in Hebrews.)',
        synthesis(
          cite('bsb', 'Heb 12:1–3; 2 Cor 4:18'),
          cite('stepbible-tagnt', '2 Cor 4:18 (G4648); Heb 12:2 (G0872)'),
        ),
      ),
      tags: ['endurance', 'cross', 'joy', 'hope'],
    },
    {
      id: 'suffering:xr:mrk-15-34',
      from: { book: '2CO', startChapter: 4, startVerse: 9, endChapter: 4, endVerse: 9 },
      target: { book: 'MRK', startChapter: 15, startVerse: 34, endChapter: 15, endVerse: 34 },
      relationship: 'contrast',
      title: 'Forsaken — and not forsaken',
      explanation: text(
        'Paul says he is persecuted but not forsaken, using ἐγκαταλείπω; Mark renders Jesus’ cry from the cross, why have you forsaken me?, with the same verb. Paul is not quoting Mark, and the link is verbal and theological rather than literary. But it points to the heart of Christian hope in suffering: many Christians have seen in the forsaken Christ the pledge that God will not forsake his people — a promise Hebrews 13:5 repeats with the same verb.',
        synthesis(
          cite('stepbible-tbesg', 'G1459 ἐγκαταλείπω'),
          cite('stepbible-tagnt', '2 Cor 4:9; Mark 15:34 (G1459)'),
          cite('bsb', 'Mark 15:34; Heb 13:5; 2 Cor 4:9'),
        ),
      ),
      tags: ['forsaken', 'cross', 'presence of god', 'christ'],
    },
    {
      id: 'suffering:xr:psa-88',
      from: { book: '2CO', startChapter: 4, startVerse: 8, endChapter: 4, endVerse: 8 },
      target: { book: 'PSA', startChapter: 88 },
      relationship: 'thematic',
      title: 'Room for the prayer that ends in darkness',
      explanation: text(
        'Paul’s not in despair uses a verb that the Greek Old Testament uses in Psalm 88 for the psalmist’s I am in despair (88:15; LXX 87:16). Psalm 88 is a lament that ends without resolution, yet it is still prayer, addressed to the God of my salvation. Held together, the two texts keep Christians honest: Scripture neither denies despair nor lets it have the final word.',
        synthesis(
          cite('stepbible-tbesg', 'G1820 ἐξαπορέω (LXX Ps 88:15)'),
          cite('lxx-brenton', 'Ps 87:16 LXX', LXX_PSA_87),
          cite('bsb', 'Ps 88:1, 15, 18; 2 Cor 4:8'),
        ),
      ),
      tags: ['lament', 'despair', 'psalms', 'honesty'],
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Historical & cultural context                                       */
  /* ------------------------------------------------------------------ */

  context: [
    {
      id: 'suffering:ctx:occasion',
      category: 'occasion',
      title: 'A strained relationship with Corinth',
      summary:
        'Paul wrote 2 Corinthians around AD 56 from Macedonia, after a painful visit to Corinth, a severe letter (probably now lost), and Titus’s encouraging report. Some in the church doubted his authority precisely because he seemed weak and afflicted.',
      detail:
        'According to the Tyndale Open Study Notes, 1 Corinthians was poorly received; Paul made a personal visit from Ephesus that failed, wrote a tearful “severe letter” carried by Titus, and then, after leaving Ephesus under severe trials, met Titus in Macedonia with good news of the church’s repentance. His suffering and weakness seemed to some Corinthians to contradict his claim to be an apostle. Chapter 4 answers that objection head-on: weakness is exactly where God’s power is displayed.',
      relatedVerses: [
        { book: '2CO', chapter: 4, verse: 7 },
        { book: '2CO', chapter: 2, verse: 4 },
        { book: '2CO', chapter: 7, verse: 6 },
      ],
      tags: ['occasion', 'date', 'corinth', 'weakness'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', '2 Corinthians Book Introduction, “Date and Occasion of Writing”; “Meaning and Message”', TYN_2CO_INTRO),
      ),
    },
    {
      id: 'suffering:ctx:asia',
      category: 'historical-period',
      title: 'The crisis in Asia',
      summary:
        'Shortly before writing, Paul faced a life-threatening crisis in the Roman province of Asia (1:8–11). Its exact nature is unknown: the riot at Ephesus (Acts 19:23–41), a trial with the prospect of execution, or — less likely — a severe illness have all been suggested.',
      relatedVerses: [
        { book: '2CO', chapter: 1, verse: 8 },
        { book: '2CO', chapter: 4, verse: 8 },
      ],
      tags: ['asia', 'ephesus', 'danger', 'history'],
      provenance: historical('editorial', cite('tyndale-open-study-notes', 'on 2 Cor 1:8–11', TYN_2CO_1)),
    },
    {
      id: 'suffering:ctx:clay-jars',
      category: 'greco-roman',
      title: 'Corinthian pottery and treasure in clay jars',
      summary:
        'Corinth’s artisans made pottery and especially terra-cotta lamps that were well known across the ancient world, and older commentators note that treasures were often stored in earthenware jars. Paul’s image would have been instantly concrete: a cheap, breakable container holding something priceless.',
      detail:
        'The Tyndale introduction links Corinth’s well-known terra-cotta lamps directly to 2 Corinthians 4:7, which fits the light-and-jar imagery of 4:6–7. Jamieson, Fausset and Brown remark that the ancients often kept treasures in earthenware vessels. Some older commentators (Matthew Henry’s Commentary, in the 2 Corinthians section completed after Henry’s death by Daniel Mayo, and Jamieson, Fausset and Brown) also saw an allusion to Gideon’s soldiers, whose torches were hidden in jars (Judg 7:16–20); this remains a suggestion, since Paul does not mention Gideon.',
      relatedVerses: [{ book: '2CO', chapter: 4, verse: 7 }],
      tags: ['jars of clay', 'pottery', 'lamps', 'corinth', 'gideon'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', '2 Corinthians Book Introduction, “Setting”', TYN_2CO_INTRO),
        cite('jfb-commentary', 'on 2 Cor 4:7', JFB_2CO_4),
        { ...cite('matthew-henry-commentary', 'on 2 Cor 4:7', HENRY_2CO_4), note: '2 Corinthians section completed after Henry’s death (1714) by Daniel Mayo' },
      ),
    },
    {
      id: 'suffering:ctx:triumph',
      category: 'greco-roman',
      title: 'Led in a Roman triumph (2:14)',
      summary:
        'The section containing chapter 4 opens with the image of a Roman victory procession, in which a general led captives and incense was scattered along the route. Paul pictures himself as Christ’s captive in that procession — the setting for his talk of weakness and glory.',
      detail:
        'The Tyndale notes explain that captives in a triumphal march were on their way to the arena and death, and that the incense along the route smelled of death to them and of life to the victors (2:15–16). Paul’s self-portrait as a captive prepares for chapter 4’s carrying around of the death of Jesus.',
      relatedVerses: [
        { book: '2CO', chapter: 2, verse: 14 },
        { book: '2CO', chapter: 4, verse: 10 },
      ],
      tags: ['triumph', 'procession', 'captive', 'rome'],
      provenance: historical('editorial', cite('tyndale-open-study-notes', 'on 2 Cor 2:14–16', TYN_2CO_2)),
    },
    {
      id: 'suffering:ctx:hardship-lists',
      category: 'greco-roman',
      title: 'Catalogues of hardships',
      summary:
        'Lists of hardships were a recognised form in Greco-Roman moral philosophy, used to display the endurance of the wise man. Paul’s lists in 1 and 2 Corinthians (including 4:8–9) have been studied against that background — with the key difference that Paul credits his survival to God’s power, not his own virtue.',
      detail:
        'John T. Fitzgerald’s Cracks in an Earthen Vessel (1988) — its title taken from 2 Cor 4:7 — examines the catalogues of hardships in the Corinthian correspondence alongside the philosophical use of such lists (the Greek term is peristasis, circumstance or hardship), drawing on writers such as Epictetus and Dio Chrysostom. The contrast in 4:7 (the power is from God and not from us) is Paul’s own: the lists display not a sage’s self-sufficiency but God’s strength in a fragile vessel.',
      relatedVerses: [
        { book: '2CO', chapter: 4, verse: 8 },
        { book: '2CO', chapter: 6, verse: 4 },
        { book: '2CO', chapter: 11, verse: 23 },
      ],
      tags: ['hardship catalogue', 'peristasis', 'stoicism', 'philosophy'],
      provenance: historical(
        'editorial',
        cite('fitzgerald-cracks-in-an-earthen-vessel', 'SBL Dissertation Series 99'),
        cite('bsb', '2 Cor 4:7–9'),
      ),
    },
    {
      id: 'suffering:ctx:lament-psalms',
      category: 'genre',
      title: 'Lament as a biblical genre',
      summary:
        'Laments make up most of the psalms in Books 1–3 of the Psalter and include both individual and community laments. They typically move from complaint and petition toward trust — though Psalm 88 does not — giving Israel a sanctioned language for pain.',
      detail:
        'The Tyndale introduction to Psalms classifies most psalms in Books 1–3 as laments, subdivided into individual and community laments. Psalm 13 shows the common movement from the fourfold how long to trust and song; Psalm 88 shows that the canon also preserves a lament without resolution. Lamentations, Job and Habakkuk extend the same tradition beyond the Psalter.',
      relatedVerses: [
        { book: 'PSA', chapter: 13, verse: 1 },
        { book: 'PSA', chapter: 88, verse: 18 },
        { book: 'LAM', chapter: 3, verse: 19 },
      ],
      tags: ['lament', 'psalms', 'genre', 'worship'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'Psalms Book Introduction, “Literary Issues” (Genres of the Psalms)', TYN_2CO_INTRO),
        cite('tyndale-open-study-notes', 'on Ps 13; Ps 88', 'https://bible.helloao.org/api/c/tyndale/PSA/88.json'),
      ),
    },
    {
      id: 'suffering:ctx:ane-wisdom',
      category: 'ancient-near-east',
      title: 'Job among ancient texts on suffering',
      summary:
        'Other ancient Near Eastern texts wrestle with a righteous sufferer, notably the Babylonian works known as I Will Praise the Lord of Wisdom and the Babylonian Theodicy. Job shares the Theodicy’s dialogue form but differs sharply: it is monotheistic, and its hero never abandons his commitment to God.',
      detail:
        'The Tyndale introduction to Job, drawing on Pritchard’s Ancient Near Eastern Texts, notes that in the Babylonian “I Will Praise the Lord of Wisdom” the sufferer assumes some unknown sin and is healed through exorcisms, while the “Babylonian Theodicy” uses a dialogue much like Job’s but within a polytheistic world and with a sufferer who threatens to give up obedience. Job’s setting is patriarchal; the date of the book’s composition is uncertain.',
      tags: ['job', 'babylonian theodicy', 'wisdom literature', 'ancient near east'],
      provenance: historical('editorial', cite('tyndale-open-study-notes', 'Job, Book Introduction, “Literary Characteristics”', TYN_2CO_INTRO)),
    },
    {
      id: 'suffering:ctx:retribution',
      category: 'religious',
      title: 'Did the sufferer deserve it?',
      summary:
        'A widespread assumption in the biblical world — voiced by Job’s friends and by Jesus’ disciples — held that suffering is always the direct result of the sufferer’s sin. Scripture affirms that sin has consequences but repeatedly denies that every calamity is a verdict on its victims.',
      detail:
        'The Tyndale notes on Job describe the friends’ tight case — God is righteous, so Job’s suffering must be punishment — and show the book rejecting its quid pro quo application. In John 9:2 the disciples assume someone’s sin caused a man’s blindness, and Jesus corrects them. In Luke 13 Jesus answers a popular claim that bad things only happen to bad people; the notes add that the Galilean incident is not known from other sources, though Pilate is known from Josephus to have suppressed unrest violently.',
      relatedVerses: [
        { book: 'JHN', chapter: 9, verse: 2 },
        { book: 'LUK', chapter: 13, verse: 2 },
        { book: 'JOB', chapter: 4, verse: 7 },
      ],
      tags: ['retribution', 'punishment', 'job', 'karma'],
      provenance: historical(
        'editorial',
        cite('tyndale-open-study-notes', 'Job, Book Introduction, “Summary”; “Meaning and Message”', TYN_2CO_INTRO),
        cite('tyndale-open-study-notes', 'on John 9:2', 'https://bible.helloao.org/api/c/tyndale/JHN/9.json'),
        cite('tyndale-open-study-notes', 'on Luke 13:1–4', 'https://bible.helloao.org/api/c/tyndale/LUK/13.json'),
      ),
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Literary context                                                    */
  /* ------------------------------------------------------------------ */

  literary: {
    placeInBook: text(
      '2 Corinthians 4:7–18 sits inside a long section (2:14–7:4) in which Paul breaks off the story of looking for Titus and defends the nature of his ministry; the story resumes at 7:5. Having described the surpassing glory of the new-covenant ministry (3:1–4:6), Paul now faces the obvious objection — if the message is so glorious, why is its messenger so battered? — and turns his weakness into evidence for the gospel.',
      literary(
        cite('tyndale-open-study-notes', 'on 2 Cor 2:14–7:4', TYN_2CO_2),
        cite('tyndale-open-study-notes', '2 Corinthians Book Introduction, “Summary”', TYN_2CO_INTRO),
      ),
    ),
    argument: text(
      'The passage moves in five steps. (1) Thesis: the treasure is in clay jars so that the power will be seen as God’s (4:7). (2) Evidence: four paired contrasts — pressed but not crushed, perplexed but not despairing, persecuted but not forsaken, struck down but not destroyed (4:8–9). (3) Interpretation: this is the death of Jesus carried in the body so that his life is revealed, and it works life in the Corinthians (4:10–12). (4) Ground of confidence: the psalmist’s faith that speaks, and the certainty of resurrection (4:13–15). (5) Conclusion: therefore we do not lose heart, because present affliction is weighed against eternal glory and the unseen outlasts the seen (4:16–18).',
      literary(cite('bsb', '2 Cor 4:7–18')),
    ),
    placeInCanon: text(
      'The passage gathers up the Bible’s whole story. It echoes creation (light out of darkness, 4:6, most likely recalling Genesis 1:3), lives honestly with the fall (an outer self wasting away, 4:16), finds its centre in Christ’s death and resurrection (4:10, 14), and leans toward new creation (4:17–5:5; compare 5:17). That arc — creation, fall, redemption, new creation — is the frame in which the Bible places every question about suffering.',
      synthesis(cite('bsb', 'Gen 1:3; 3:19; 2 Cor 4:6–18; 5:17; Rev 21:3–5')),
    ),
    bookOutline: [
      { label: 'Greeting and the God of all comfort', ref: { book: '2CO', startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 11 } },
      { label: 'Changed plans and the painful letter', ref: { book: '2CO', startChapter: 1, startVerse: 12, endChapter: 2, endVerse: 13 } },
      { label: 'The glory of the new-covenant ministry', ref: { book: '2CO', startChapter: 2, startVerse: 14, endChapter: 4, endVerse: 6 } },
      {
        label: 'Treasure in clay jars: suffering and hope',
        ref: { book: '2CO', startChapter: 4, startVerse: 7, endChapter: 5, endVerse: 10 },
        current: true,
      },
      { label: 'The ministry of reconciliation', ref: { book: '2CO', startChapter: 5, startVerse: 11, endChapter: 6, endVerse: 10 } },
      { label: 'An appeal for open hearts', ref: { book: '2CO', startChapter: 6, startVerse: 11, endChapter: 7, endVerse: 4 } },
      { label: 'Titus’s report and Paul’s joy', ref: { book: '2CO', startChapter: 7, startVerse: 5, endChapter: 7, endVerse: 16 } },
      { label: 'The collection for Jerusalem', ref: { book: '2CO', startChapter: 8, startVerse: 1, endChapter: 9, endVerse: 15 } },
      { label: 'Paul defends his apostleship', ref: { book: '2CO', startChapter: 10, startVerse: 1, endChapter: 13, endVerse: 14 } },
    ],
    passageOutline: [
      { label: 'Treasure in jars of clay', ref: { book: '2CO', startChapter: 4, startVerse: 7, endChapter: 4, endVerse: 7 } },
      { label: 'Four “but not” contrasts', ref: { book: '2CO', startChapter: 4, startVerse: 8, endChapter: 4, endVerse: 9 } },
      { label: 'The death and the life of Jesus', ref: { book: '2CO', startChapter: 4, startVerse: 10, endChapter: 4, endVerse: 12 } },
      { label: 'The faith that speaks', ref: { book: '2CO', startChapter: 4, startVerse: 13, endChapter: 4, endVerse: 15 } },
      { label: 'Renewed day by day: the weight of glory', ref: { book: '2CO', startChapter: 4, startVerse: 16, endChapter: 4, endVerse: 18 } },
    ],
    features: [
      {
        id: 'suffering:lit:antitheses',
        type: 'parallelism',
        title: 'Four “but not” contrasts',
        description:
          'Verses 8–9 set out four matched pairs, each a participle of hardship followed by but not and a stronger participle. The rhythm makes the point: every blow is real, but none is final. The second contrast contains a pun in Greek — ἀπορούμενοι (at a loss) but not ἐξαπορούμενοι (utterly at a loss).',
        verses: [
          { book: '2CO', chapter: 4, verse: 8 },
          { book: '2CO', chapter: 4, verse: 9 },
        ],
        structure: [
          { label: '1', text: 'Pressed on every side — yet not crushed', level: 0 },
          { label: '2', text: 'At a loss — yet not utterly at a loss (despairing)', level: 0 },
          { label: '3', text: 'Pursued — yet not abandoned', level: 0 },
          { label: '4', text: 'Knocked down — yet not destroyed', level: 0 },
        ],
        tags: ['antithesis', 'parallelism', 'wordplay'],
        provenance: literary(cite('bsb', '2 Cor 4:8–9'), cite('stepbible-tagnt', '2 Cor 4:8–9')),
      },
      {
        id: 'suffering:lit:inclusio',
        type: 'inclusio',
        title: 'We do not lose heart (4:1, 4:16)',
        description:
          'The same clause, with the same Greek verb, opens chapter 4 and returns near its end (4:16). At 4:1 the reason is God’s mercy in giving the ministry; at 4:16 it is the daily renewal of the inner self and the coming glory. The frame shows the chapter’s purpose: to explain how a suffering minister keeps going.',
        verses: [
          { book: '2CO', chapter: 4, verse: 1 },
          { book: '2CO', chapter: 4, verse: 16 },
        ],
        tags: ['inclusio', 'lose heart', 'structure'],
        provenance: literary(cite('bsb', '2 Cor 4:1, 16'), cite('stepbible-tagnt', '2 Cor 4:1, 16 (G1573)')),
      },
      {
        id: 'suffering:lit:death-life',
        type: 'repetition',
        title: 'The death and the life of Jesus',
        description:
          'In 4:10–14 the name Jesus appears six times, and death and life alternate three times each (4:10, 11, 12). Paul’s experience is described entirely in terms of Jesus’ own story: his dying carried in the body, his life revealed in mortal flesh, his resurrection the guarantee of ours.',
        verses: [
          { book: '2CO', chapter: 4, verse: 10 },
          { book: '2CO', chapter: 4, verse: 11 },
          { book: '2CO', chapter: 4, verse: 12 },
          { book: '2CO', chapter: 4, verse: 14 },
        ],
        tags: ['repetition', 'union with christ', 'death', 'life'],
        provenance: literary(cite('bsb', '2 Cor 4:10–14'), cite('stepbible-tagnt', '2 Cor 4:10–14 (G2424, G2222, G2288, G3500)')),
      },
      {
        id: 'suffering:lit:scales',
        type: 'parallelism',
        title: 'Weighing affliction against glory',
        description:
          'Verses 17–18 are built from paired opposites: momentary and eternal, lightness and weight, affliction and glory, seen and unseen, temporary and eternal. John Chrysostom already noticed how Paul lines up present against future, brief against eternal, light against heavy, and affliction against glory — and then doubles his expression for good measure.',
        verses: [
          { book: '2CO', chapter: 4, verse: 17 },
          { book: '2CO', chapter: 4, verse: 18 },
        ],
        structure: [
          { label: 'A', text: 'Light, momentary affliction', level: 0 },
          { label: 'A′', text: 'An eternal weight of glory beyond comparison', level: 0 },
          { label: 'B', text: 'What is seen — temporary', level: 1 },
          { label: 'B′', text: 'What is unseen — eternal', level: 1 },
        ],
        tags: ['antithesis', 'glory', 'eternity'],
        provenance: literary(
          cite('bsb', '2 Cor 4:17–18'),
          cite('chrysostom-homilies-2-corinthians', 'Homily 9 §2, on 2 Cor 4:17–18', CHRYS_HOM_9),
        ),
      },
      {
        id: 'suffering:lit:jars',
        type: 'metaphor',
        title: 'Treasure in clay jars',
        description:
          'The controlling image of the passage joins 4:6 to 4:7: the light of God’s glory in the face of Christ is the treasure, and fragile human bodies and ministries are the jars. The metaphor explains the whole argument — the container’s weakness makes the contents’ power unmistakable.',
        verses: [
          { book: '2CO', chapter: 4, verse: 6 },
          { book: '2CO', chapter: 4, verse: 7 },
        ],
        tags: ['metaphor', 'jars of clay', 'treasure', 'weakness'],
        provenance: literary(cite('bsb', '2 Cor 4:6–7'), cite('tyndale-open-study-notes', 'on 2 Cor 4:7', TYN_2CO_4)),
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Theology                                                            */
  /* ------------------------------------------------------------------ */

  theology: [
    {
      id: 'suffering:th:providence',
      category: 'providence',
      title: 'A good and sovereign God in a fallen world',
      summary:
        'Scripture holds together God’s goodness, his sovereignty over all things, the reality of evil, and human responsibility — without pretending they are easy to reconcile.',
      detail:
        'Joseph can say that his brothers meant evil and God meant good in the same breath (Gen 50:20). Job’s narrator shows God permitting what Satan does while never explaining it to Job. Lamentations says God does not afflict from his heart (Lam 3:33). The historic Christian answer, stated classically by Augustine and restated in different ways in the Westminster Confession (ch. 5) and the Catechism of the Catholic Church (§§311–312), is that nothing, not even evil, falls outside God’s providence: God is never the author of sin, yet he is able to bring good out of evil. Christians differ on how to describe God’s relation to evil acts — Catholic teaching says he permits moral evil, while the Westminster Confession says he governs sin “not by a bare permission” (see the perspectives below) — but they agree that evil is neither an illusion nor outside God’s rule.',
      keyVerses: [
        { book: 'GEN', startChapter: 50, startVerse: 20, endChapter: 50, endVerse: 20 },
        { book: 'LAM', startChapter: 3, startVerse: 33, endChapter: 3, endVerse: 33 },
        { book: 'ROM', startChapter: 8, startVerse: 20, endChapter: 8, endVerse: 22 },
      ],
      tags: ['providence', 'sovereignty', 'theodicy', 'problem of evil'],
      provenance: synthesis(
        cite('bsb', 'Gen 50:20; Lam 3:33; Job 1–2'),
        cite('augustine-enchiridion', 'ch. 11; ch. 96', ENCHIRIDION),
        cite('westminster-confession', 'ch. 5 “Of Providence” §4', 'https://www.opc.org/wcf.html'),
        cite('catechism-catholic-church', '§§311–312', CCC_PROVIDENCE),
      ),
    },
    {
      id: 'suffering:th:cross',
      category: 'christology',
      title: 'The theology of the cross: God in the depths',
      summary:
        'God’s fullest answer to suffering is not an argument but an act: in Christ he entered human pain, was forsaken on the cross and rose again. Power is revealed through weakness.',
      detail:
        'Isaiah’s Servant is a man of sorrows; Jesus prays the lament of Psalm 22 from the cross; Hebrews insists he sympathizes with our weaknesses. Martin Luther’s Heidelberg theses (1518) sharpened this into a principle: God is truly known not by reasoning up to him from works and glory but in suffering and the cross. 2 Corinthians 4 applies the principle to Christian ministry — God’s power shows in a cracked jar — and John Stott, in the final chapter of The Cross of Christ, looked at the world’s suffering from Calvary, where God is seen enduring pain and injustice himself rather than watching from afar.',
      keyVerses: [
        { book: 'ISA', startChapter: 53, startVerse: 3, endChapter: 53, endVerse: 5 },
        { book: 'MRK', startChapter: 15, startVerse: 34, endChapter: 15, endVerse: 34 },
        { book: 'HEB', startChapter: 4, startVerse: 15, endChapter: 4, endVerse: 15 },
        { book: '2CO', startChapter: 4, startVerse: 7, endChapter: 4, endVerse: 7 },
      ],
      tags: ['cross', 'theology of the cross', 'god suffers', 'weakness', 'immanuel'],
      provenance: synthesis(
        cite('bsb', 'Isa 53:3–5; Mark 15:34; Heb 4:15; 2 Cor 4:7'),
        cite('luther-heidelberg-disputation', 'theses 19–21'),
        cite('stott-cross-of-christ', 'ch. “Suffering and Glory”'),
      ),
    },
    {
      id: 'suffering:th:union',
      category: 'soteriology',
      title: 'Union with Christ in suffering',
      summary:
        'Believers share Christ’s story: they carry his dying and they will share his rising. Suffering for Christ is one of the ways believers share his life, not a sign that they have been abandoned.',
      detail:
        'Paul speaks of carrying the death of Jesus so that his life is revealed (2 Cor 4:10–11), of the fellowship of his sufferings (Phil 3:10), and of suffering with Christ in order to be glorified with him (Rom 8:17). Peter tells believers to rejoice in sharing Christ’s sufferings (1 Pet 4:13). Christians agree that these texts add nothing to Christ’s unique atoning work, though traditions describe believers’ share in his sufferings differently (see Col 1:24). The texts describe the pattern of life shaped by the cross and the certainty of resurrection (2 Cor 4:14).',
      keyVerses: [
        { book: '2CO', startChapter: 4, startVerse: 10, endChapter: 4, endVerse: 11 },
        { book: 'PHP', startChapter: 3, startVerse: 10, endChapter: 3, endVerse: 11 },
        { book: 'ROM', startChapter: 8, startVerse: 17, endChapter: 8, endVerse: 17 },
        { book: '1PE', startChapter: 4, startVerse: 13, endChapter: 4, endVerse: 13 },
      ],
      tags: ['union with christ', 'fellowship', 'resurrection', 'dying'],
      provenance: synthesis(
        cite('bsb', '2 Cor 4:10–14; Phil 3:10–11; Rom 8:17; 1 Pet 4:13; Col 1:24'),
        cite('tyndale-open-study-notes', 'on Col 1:24', 'https://bible.helloao.org/api/c/tyndale/COL/1.json'),
        cite('calvin-commentaries', 'on Col 1:24', CALVIN_COL_1),
        cite('salvifici-doloris', '§§19–20, 24', SALVIFICI_DOLORIS),
      ),
    },
    {
      id: 'suffering:th:lament',
      category: 'worship',
      title: 'Lament: faith that complains to God',
      summary:
        'The Bible gives sufferers words to protest, question and grieve — addressed to God. Lament is not the opposite of faith but one of its forms.',
      detail:
        'A large share of the Psalms are laments; Job argues with God; Lamentations (traditionally attributed to Jeremiah) mourns a destroyed city; Habakkuk asks how long; Jesus himself prays a lament on the cross. The how long of Psalm 13 and the unresolved darkness of Psalm 88 show that honesty before God is not irreverence. C. S. Lewis’s A Grief Observed is a modern example of the same honest wrestling.',
      keyVerses: [
        { book: 'PSA', startChapter: 13 },
        { book: 'PSA', startChapter: 88 },
        { book: 'LAM', startChapter: 3, startVerse: 19, endChapter: 3, endVerse: 24 },
        { book: 'HAB', startChapter: 1, startVerse: 2, endChapter: 1, endVerse: 4 },
      ],
      tags: ['lament', 'how long', 'grief', 'prayer', 'psalms'],
      provenance: synthesis(
        cite('bsb', 'Ps 13; Ps 88; Lam 3; Hab 1:2–4; Mark 15:34'),
        cite('tyndale-open-study-notes', 'Psalms Book Introduction, “Literary Issues” (Genres of the Psalms)', TYN_2CO_INTRO),
        cite('tyndale-open-study-notes', 'Lamentations Book Introduction, “Authorship”', TYN_2CO_INTRO),
        cite('lewis-grief-observed'),
      ),
    },
    {
      id: 'suffering:th:refining',
      category: 'sanctification',
      title: 'Trials that refine',
      summary:
        'God uses affliction to produce endurance, character and hope, and to loosen our grip on what is passing. The good lies not in the pain but in what God works through it.',
      detail:
        'Paul, James and Peter each describe trials as producing something — perseverance, maturity, proven faith (Rom 5:3–5; Jas 1:2–4; 1 Pet 1:6–7). Hebrews frames hardship as a father’s training (Heb 12:5–11), and 2 Corinthians 4:16 speaks of the inner self renewed day by day while the outer self wastes away. Scripture does not say every trial is sent to correct a specific fault (John 9:3), nor that suffering is good in itself.',
      keyVerses: [
        { book: 'ROM', startChapter: 5, startVerse: 3, endChapter: 5, endVerse: 5 },
        { book: 'JAS', startChapter: 1, startVerse: 2, endChapter: 1, endVerse: 4 },
        { book: 'HEB', startChapter: 12, startVerse: 10, endChapter: 12, endVerse: 11 },
        { book: '2CO', startChapter: 4, startVerse: 16, endChapter: 4, endVerse: 16 },
      ],
      tags: ['sanctification', 'perseverance', 'discipline', 'refining', 'character'],
      provenance: synthesis(cite('bsb', 'Rom 5:3–5; Jas 1:2–4; 1 Pet 1:6–7; Heb 12:5–11; 2 Cor 4:16; John 9:3')),
    },
    {
      id: 'suffering:th:hope',
      category: 'eschatology',
      title: 'The weight of glory: hope beyond suffering',
      summary:
        'Christian hope does not deny present pain; it sets it on a scale against resurrection and new creation, where the glory outweighs the affliction beyond comparison.',
      detail:
        'Paul grounds endurance in the resurrection (2 Cor 4:14) and in an eternal weight of glory (4:17), continuing into the hope of a heavenly dwelling in 5:1–5. Romans 8:18 says present sufferings are not comparable to the coming glory, and Revelation 21 pictures the end: God with his people, tears wiped away, death gone. This hope is what allows Paul to call heavy suffering light.',
      keyVerses: [
        { book: '2CO', startChapter: 4, startVerse: 14, endChapter: 4, endVerse: 18 },
        { book: 'ROM', startChapter: 8, startVerse: 18, endChapter: 8, endVerse: 18 },
        { book: 'REV', startChapter: 21, startVerse: 3, endChapter: 21, endVerse: 5 },
      ],
      tags: ['hope', 'glory', 'resurrection', 'new creation', 'eschatology'],
      provenance: synthesis(cite('bsb', '2 Cor 4:14–5:5; Rom 8:18; Rev 21:3–5')),
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Perspectives                                                        */
  /* ------------------------------------------------------------------ */

  perspectives: [
    {
      id: 'suffering:ps:why-evil',
      question: 'Why does God permit evil and suffering at all?',
      consensus: 'denominational',
      intro:
        'Christians agree that God is good, that he is sovereign, and that evil is real. Several answers have been given to why such a God allows evil. Some are philosophical or pastoral emphases that Christians of many churches combine. One point, though, is a live difference between traditions: Catholic teaching says that God allows moral evil out of respect for his creatures’ freedom (CCC 311), and John Wesley argued that God could not abolish sin without destroying the liberty he gave; the Westminster Confession, by contrast, teaches that God ordains whatever comes to pass and governs even sin “not by a bare permission” (WCF 3.1; 5.4), while denying that he is its author.',
      perspectives: [
        {
          id: 'suffering:ps:why-evil:augustinian',
          tradition: 'Augustinian',
          label: 'Evil is the privation of good; God permits it because he can bring good out of it',
          summary:
            'Augustine taught that everything God made is good and that evil is not a substance but the absence or corruption of good, as disease is the absence of health. Evil entered through the misuse of created free will. God permits it only because he is powerful and good enough to bring good even out of evil; he judged it better to bring good out of evil than to allow no evil at all.',
          representatives: ['augustine'],
          keyTexts: [
            { book: 'GEN', startChapter: 1, startVerse: 31, endChapter: 1, endVerse: 31 },
            { book: 'GEN', startChapter: 50, startVerse: 20, endChapter: 50, endVerse: 20 },
            { book: 'ROM', startChapter: 8, startVerse: 28, endChapter: 8, endVerse: 28 },
          ],
          provenance: summaryOf(cite('augustine-enchiridion', 'ch. 11, 12, 27, 96', ENCHIRIDION)),
        },
        {
          id: 'suffering:ps:why-evil:irenaean',
          tradition: 'Irenaean (soul-making)',
          label: 'Humanity was created immature; the world is a place of growth toward God',
          summary:
            'Irenaeus of Lyons argued that humans could not receive perfection at the moment of creation, being like infants; they must grow, by experience of both good and evil and by free choice, toward the likeness of God (Against Heresies 4.37–39). In 1966 the philosopher John Hick developed this into a modern soul-making theodicy, contrasting it with Augustine’s. Readers should note that Hick’s version treated the fall as myth and required the eventual salvation of all people (a universalism the theologian Henri Blocher criticised), and that his later work moved to religious pluralism and a metaphorical view of the incarnation, well outside historic orthodoxy. The Irenaean emphasis on growth does not depend on those moves.',
          representatives: ['irenaeus', 'john-hick'],
          keyTexts: [
            { book: 'ROM', startChapter: 5, startVerse: 3, endChapter: 5, endVerse: 5 },
            { book: 'JAS', startChapter: 1, startVerse: 2, endChapter: 1, endVerse: 4 },
            { book: '2CO', startChapter: 4, startVerse: 16, endChapter: 4, endVerse: 16 },
          ],
          provenance: summaryOf(
            cite('irenaeus-against-heresies', 'Book 4, chs. 37–39', 'https://www.newadvent.org/fathers/0103438.htm'),
            {
              ...cite('hick-evil-and-the-god-of-love', undefined, 'https://en.wikipedia.org/wiki/Irenaean_theodicy'),
              note: 'Hick’s later pluralism and metaphorical Christology (God and the Universe of Faiths, 1973; The Metaphor of God Incarnate, 1993) are documented at https://en.wikipedia.org/wiki/John_Hick',
            },
          ),
        },
        {
          id: 'suffering:ps:why-evil:reformed',
          tradition: 'Reformed',
          label: 'God ordains all things, including evil acts, for holy ends — without being the author of sin',
          summary:
            'Reformed theology stresses that God’s providence extends to every event, including sin, not by bare permission but by wisely bounding and directing it to his holy purposes; yet sin comes only from the creature, and God is neither its author nor approver (Westminster Confession 5.4). Joseph’s words in Genesis 50:20 are the model. D. A. Carson defends this as compatibilism: God is fully sovereign and humans are fully responsible, a mystery of providence that Scripture affirms without fully explaining. John Piper’s pastoral writing applies it directly, urging believers to see even illness as purposed by God for their good.',
          representatives: ['calvin', 'da-carson', 'john-piper'],
          keyTexts: [
            { book: 'GEN', startChapter: 50, startVerse: 20, endChapter: 50, endVerse: 20 },
            { book: 'JOB', startChapter: 42, startVerse: 11, endChapter: 42, endVerse: 11 },
            { book: 'ACT', startChapter: 4, startVerse: 27, endChapter: 4, endVerse: 28 },
          ],
          provenance: summaryOf(
            cite('westminster-confession', 'ch. 3 “Of God’s Eternal Decree” §1', WCF),
            cite('westminster-confession', 'ch. 5 “Of Providence” §§1, 4, 7', WCF),
            cite('carson-how-long-o-lord', 'ch. 11 “The Mystery of Providence”'),
            cite('piper-dont-waste-your-cancer', 'point 1'),
          ),
        },
        {
          id: 'suffering:ps:why-evil:catholic',
          tradition: 'Catholic',
          label: 'God permits moral evil, respecting creaturely freedom, and draws good from it',
          summary:
            'The Catechism of the Catholic Church says that no single argument settles the question of evil; the Christian faith as a whole is the answer. God does not cause moral evil, directly or indirectly, but allows it out of respect for his creatures’ freedom, and he can bring good from it. The Catechism cites Augustine’s Enchiridion and Joseph’s words in Genesis 50:20, and points to the cross, where the worst evil ever done became the occasion of the greatest good (CCC 309–314, 324). In the apostolic letter Salvifici Doloris (1984) John Paul II adds that Christ’s redemption is complete and nothing can be added to it, yet those who suffer in union with him become sharers in his redemptive suffering (§§19, 24); he reads 2 Corinthians 4:8–11 in this light (§20).',
          representatives: ['john-paul-ii'],
          keyTexts: [
            { book: 'GEN', startChapter: 50, startVerse: 20, endChapter: 50, endVerse: 20 },
            { book: '2CO', startChapter: 4, startVerse: 8, endChapter: 4, endVerse: 11 },
            { book: 'COL', startChapter: 1, startVerse: 24, endChapter: 1, endVerse: 24 },
          ],
          provenance: summaryOf(
            cite('catechism-catholic-church', '§§309–314, 324', CCC_PROVIDENCE),
            cite('salvifici-doloris', '§§19–20, 24', SALVIFICI_DOLORIS),
          ),
        },
        {
          id: 'suffering:ps:why-evil:wesleyan',
          tradition: 'Arminian / Wesleyan',
          label: 'God governs all things but will not destroy the freedom he gave in order to abolish sin',
          summary:
            'John Wesley defended a particular as well as a general providence: God sees every creature and every suffering of his children, and cares for each (Sermon 67, “On Divine Providence”, §§12–13, 18–26). Why then does he not simply end sin and pain? Because, Wesley argued, God made humans in his image with understanding, will and liberty, without which they could be capable of neither virtue nor vice; to abolish sin by sheer power would undo his own work. So God governs people as free and intelligent beings rather than as machines, giving them every help toward good that does not override their liberty (§15).',
          representatives: ['wesley'],
          keyTexts: [
            { book: 'LUK', startChapter: 12, startVerse: 7, endChapter: 12, endVerse: 7 },
            { book: 'PSA', startChapter: 145, startVerse: 9, endChapter: 145, endVerse: 9 },
          ],
          provenance: summaryOf(cite('wesley-sermons', 'Sermon 67, On Divine Providence, §§12–15, 18–26', WESLEY_SERMON_67)),
        },
        {
          id: 'suffering:ps:why-evil:free-will-defence',
          tradition: 'Free-will defence (analytic philosophy of religion)',
          label: 'A world with genuinely free creatures may be worth its risk of evil',
          summary:
            'Alvin Plantinga’s free-will defence answers the logical form of the problem of evil (as argued by J. L. Mackie): it is not contradictory to hold that an all-powerful, all-good God exists alongside evil, because a world with creatures who have real moral freedom — and so the capacity to do wrong — may be better than a world with no free creatures, and not even God can bring it about that free creatures always freely choose the good. Plantinga presents it as a defence (showing consistency), not a full theodicy explaining every evil.',
          representatives: ['alvin-plantinga'],
          keyTexts: [
            { book: 'GEN', startChapter: 3, startVerse: 1, endChapter: 3, endVerse: 7 },
            { book: 'DEU', startChapter: 30, startVerse: 19, endChapter: 30, endVerse: 19 },
          ],
          provenance: summaryOf(cite('plantinga-god-freedom-and-evil')),
        },
        {
          id: 'suffering:ps:why-evil:orthodox',
          tradition: 'Eastern Orthodox',
          label: 'Death and corruption are enemies God has overthrown in Christ',
          summary:
            'Eastern Christian thought tends to speak less of explaining evil and more of God’s victory over it. Athanasius describes a humanity sliding into corruption and death, and God, unwilling that his handiwork should perish, taking a body like ours to conquer death and restore incorruption (On the Incarnation 6–10). The Orthodox philosopher David Bentley Hart, writing after the 2004 Indian Ocean tsunami, argued that Christians should not describe such catastrophes as expressions of God’s will, but as marks of a world held captive by hostile powers — a captivity God opposes and will finally end in his kingdom.',
          representatives: ['athanasius', 'david-bentley-hart'],
          keyTexts: [
            { book: '1CO', startChapter: 15, startVerse: 54, endChapter: 15, endVerse: 57 },
            { book: 'HEB', startChapter: 2, startVerse: 14, endChapter: 2, endVerse: 15 },
            { book: 'ROM', startChapter: 8, startVerse: 20, endChapter: 8, endVerse: 22 },
          ],
          provenance: summaryOf(
            cite('athanasius-on-the-incarnation', '§§6–10', 'https://www.newadvent.org/fathers/2802.htm'),
            cite('hart-doors-of-the-sea'),
          ),
        },
        {
          id: 'suffering:ps:why-evil:pastoral',
          tradition: 'Pastoral-biblical (across traditions)',
          label: 'Scripture offers God’s presence and a future more than a full explanation',
          summary:
            'Many writers stress that the Bible, like the book of Job, does not give sufferers a complete explanation but gives them God himself — his presence, his suffering in Christ, and his promise to put everything right. Timothy Keller combines philosophical, biblical and practical approaches and argues that God works joy by means of suffering, as the cross shows. N. T. Wright argues that the Bible tells how God deals with evil rather than explaining where it came from. Joni Eareckson Tada, writing with Steven Estes out of decades of quadriplegia, argues that God grasps our pain, allows it only for wise reasons, and is able to use it for good.',
          representatives: ['tim-keller', 'nt-wright', 'joni-eareckson-tada'],
          keyTexts: [
            { book: 'JOB', startChapter: 42, startVerse: 1, endChapter: 42, endVerse: 6 },
            { book: 'MRK', startChapter: 15, startVerse: 34, endChapter: 15, endVerse: 34 },
            { book: 'REV', startChapter: 21, startVerse: 3, endChapter: 21, endVerse: 5 },
          ],
          provenance: summaryOf(
            cite('keller-walking-with-god', undefined, 'https://timothykeller.com/books/walking-with-god-through-pain-and-suffering'),
            cite('wright-evil-and-justice-of-god', undefined, 'https://intervarsity.org/news/evil-and-the-justice-of-god'),
            cite('tada-when-god-weeps'),
            cite('tyndale-open-study-notes', 'Job, Book Introduction, “Meaning and Message”', TYN_2CO_INTRO),
          ),
        },
      ],
      commonGround:
        'In their historic Christian forms, these approaches affirm that God is good and all-powerful; that evil is real, is not good in itself, and is never God’s sin; that human rebellion has marred a good creation; that Christ’s death and resurrection are God’s decisive answer to evil; and that God will finally end suffering and death. They differ in how they relate God’s will to particular evils and in how much they think can be explained this side of the new creation.',
      tags: ['theodicy', 'problem of evil', 'free will', 'providence', 'soul-making', 'permission', 'why'],
      provenance: synthesis(
        cite('augustine-enchiridion', 'ch. 11', ENCHIRIDION),
        cite('irenaeus-against-heresies', 'Book 4, chs. 37–39', 'https://www.newadvent.org/fathers/0103438.htm'),
        cite('westminster-confession', 'ch. 3 §1; ch. 5 §4', WCF),
        cite('catechism-catholic-church', '§311', CCC_PROVIDENCE),
        cite('wesley-sermons', 'Sermon 67, On Divine Providence, §15', WESLEY_SERMON_67),
        cite('athanasius-on-the-incarnation', '§§6–10', 'https://www.newadvent.org/fathers/2802.htm'),
      ),
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Commentary & Christian thinkers                                     */
  /* ------------------------------------------------------------------ */

  commentary: [
    {
      id: 'suffering:cm:chrysostom-4-7',
      authorId: 'chrysostom',
      sourceId: 'chrysostom-homilies-2-corinthians',
      kind: 'quotation',
      lead: 'On the treasure in earthen vessels (4:7). “Vile” here means lowly or cheap.',
      text: '…this very thing is indeed the chiefest marvel and a very great example of the power of God, that an earthen vessel has been enabled to bear so great a brightness and to keep so high a treasure. … For then is the power of God chiefly conspicuous, when by vile it works mighty things.',
      locator: 'Homilies on 2 Corinthians, Homily 8 §3',
      url: CHRYS_HOM_8,
      relatedVerses: [{ book: '2CO', chapter: 4, verse: 7 }],
      tags: ['jars of clay', 'power', 'weakness', 'early church'],
      provenance: verifiedQuote(cite('chrysostom-homilies-2-corinthians', 'Homily 8 §3', CHRYS_HOM_8)),
    },
    {
      id: 'suffering:cm:augustine-enchiridion',
      authorId: 'augustine',
      sourceId: 'augustine-enchiridion',
      kind: 'quotation',
      lead: 'On why an all-good God permits evil',
      text: 'For the Almighty God, who, as even the heathen acknowledge, has supreme power over all things, being Himself supremely good, would never permit the existence of anything evil among His works, if He were not so omnipotent and good that He can bring good even out of evil. For what is that which we call evil but the absence of good?',
      locator: 'Enchiridion, ch. 11',
      url: ENCHIRIDION,
      relatedVerses: [{ book: 'GEN', chapter: 50, verse: 20 }],
      tags: ['problem of evil', 'privation', 'providence', 'early church'],
      provenance: verifiedQuote(cite('augustine-enchiridion', 'ch. 11', ENCHIRIDION)),
    },
    {
      id: 'suffering:cm:luther-heidelberg',
      authorId: 'luther',
      sourceId: 'luther-heidelberg-disputation',
      kind: 'summary',
      lead: 'On the theology of the cross (theses 19–21)',
      text: 'In theses prepared for a disputation of his Augustinian order at Heidelberg in April 1518, Luther distinguishes two kinds of theologian. The theologian of glory claims to discern God’s invisible attributes — his wisdom, justice and goodness — from created things and human works, and so values achievement over suffering, glory over the cross and strength over weakness. The true theologian understands what is visible of God through suffering and the cross. The theology of glory, Luther says, gets good and evil the wrong way round, while the theology of the cross names things truthfully.',
      locator: 'Heidelberg Disputation (1518), theses 19–21',
      url: 'https://bookofconcord.org/other-resources/sources-and-context/heidelberg-disputation/',
      relatedVerses: [
        { book: '2CO', chapter: 4, verse: 7 },
        { book: '2CO', chapter: 4, verse: 10 },
      ],
      tags: ['theology of the cross', 'weakness', 'reformation'],
      provenance: summaryOf(
        cite('luther-heidelberg-disputation', 'theses 19–21', 'https://bookofconcord.org/other-resources/sources-and-context/heidelberg-disputation/'),
      ),
    },
    {
      id: 'suffering:cm:calvin-4-17',
      authorId: 'calvin',
      sourceId: 'calvin-commentaries',
      kind: 'quotation',
      lead: 'On light and momentary affliction (4:17)',
      text: 'Paul, therefore, prescribes the best antidote against your sinking down under the pressure of afflictions, when he places in opposition to them that future blessedness which is laid up for thee in heaven. … For this comparison makes that light which previously seemed heavy, and makes that brief and momentary which seemed of boundless duration.',
      locator: 'Commentary on 2 Corinthians, on 4:17',
      url: CALVIN_2CO_4,
      relatedVerses: [{ book: '2CO', chapter: 4, verse: 17 }],
      tags: ['glory', 'comparison', 'patience', 'reformation'],
      provenance: verifiedQuote(cite('calvin-commentaries', 'on 2 Cor 4:17', CALVIN_2CO_4)),
    },
    {
      id: 'suffering:cm:mayo-4-8',
      authorId: 'daniel-mayo',
      sourceId: 'matthew-henry-commentary',
      kind: 'quotation',
      lead: 'On the four contrasts of 4:8–9. From Matthew Henry’s Commentary — the 2 Corinthians section was completed after Henry’s death by Daniel Mayo.',
      text: 'Whatever condition the children of God may be in, in this world, they have a “but not” to comfort themselves with; their case sometimes is bad, yea very bad, but not so bad as it might be.',
      locator: 'Commentary on the Whole Bible, on 2 Cor 4:8–12',
      url: HENRY_2CO_4,
      relatedVerses: [
        { book: '2CO', chapter: 4, verse: 8 },
        { book: '2CO', chapter: 4, verse: 9 },
      ],
      tags: ['but not', 'comfort', 'hardship', 'post-reformation'],
      provenance: verifiedQuote(cite('matthew-henry-commentary', 'on 2 Cor 4:8–12', HENRY_2CO_4)),
    },
    {
      id: 'suffering:cm:spurgeon-light-affliction',
      authorId: 'spurgeon',
      sourceId: 'spurgeon-our-light-affliction',
      kind: 'quotation',
      lead: 'On why Paul could call his affliction light',
      text: 'He wrote of “our light affliction” even when he was heavily afflicted, and while he acutely felt that affliction. … He felt the weight of it, and was fully conscious of the pressure of it upon his spirit…',
      locator: 'Sermon No. 3244, “Our Light Affliction” (preached 29 September 1870)',
      url: 'https://www.spurgeon.org/resource-library/sermons/our-light-affliction/',
      relatedVerses: [{ book: '2CO', chapter: 4, verse: 17 }],
      tags: ['light affliction', 'paul', 'sermon', 'modern'],
      provenance: verifiedQuote(
        cite('spurgeon-our-light-affliction', 'MTP vol. 57, No. 3244', 'https://www.spurgeon.org/resource-library/sermons/our-light-affliction/'),
      ),
    },
    {
      id: 'suffering:cm:lewis-problem-of-pain',
      authorId: 'cs-lewis',
      sourceId: 'lewis-problem-of-pain',
      kind: 'summary',
      lead: 'On God’s power, God’s love and human pain',
      text: 'Lewis argues that pain does not disprove a good and all-powerful God once those words are properly understood. Omnipotence does not include doing what is self-contradictory, and a world where free creatures can meet one another needs a stable natural order that can also hurt. Divine love is more demanding than a kindness that simply wants us comfortable; it seeks our perfection and may therefore cause pain. In the chapters on human pain he argues that, unlike pleasure or even sin, pain cannot easily be ignored, so it can wake people who are content without God to their need of him. He does not claim to explain every instance of suffering, only to show that goodness and suffering are not contradictory.',
      locator: 'The Problem of Pain (1940), chs. “Divine Omnipotence”, “Divine Goodness”, “Human Pain”',
      url: 'https://en.wikipedia.org/wiki/The_Problem_of_Pain',
      tags: ['problem of pain', 'omnipotence', 'love', 'apologetics'],
      provenance: summaryOf(cite('lewis-problem-of-pain', 'chs. 2, 3, 6–7')),
    },
    {
      id: 'suffering:cm:lewis-grief-observed',
      authorId: 'cs-lewis',
      sourceId: 'lewis-grief-observed',
      kind: 'summary',
      lead: 'On grief without tidy answers',
      text: 'Compiled from notebooks Lewis kept after his wife, Joy Davidman, died of cancer in 1960, and first published under the pseudonym N. W. Clerk, A Grief Observed records bereavement with unusual candour. Lewis voices anger and bewilderment toward God and questions of faith he had once handled with confidence, and moves only gradually toward a renewed, humbler trust and gratitude for the love he had been given. Read beside The Problem of Pain, it shows the same author living through what he had earlier reasoned about.',
      locator: 'A Grief Observed (1961)',
      url: 'https://en.wikipedia.org/wiki/A_Grief_Observed',
      tags: ['grief', 'lament', 'bereavement', 'doubt'],
      provenance: summaryOf(cite('lewis-grief-observed')),
    },
    {
      id: 'suffering:cm:stott-cross',
      authorId: 'john-stott',
      sourceId: 'stott-cross-of-christ',
      kind: 'summary',
      lead: 'On the cross and the problem of suffering',
      text: 'In the closing chapter of The Cross of Christ, “Suffering and Glory”, Stott takes up the challenge of evil and pain in God’s world. He admits that the cross leaves many questions about pain unanswered, yet he makes it the lens through which believers are to view all suffering, because there God is seen not as a remote spectator but as one who has himself entered human suffering, injustice and death.',
      locator: 'The Cross of Christ (1986), ch. “Suffering and Glory”',
      url: 'https://www.christianitytoday.com/pastors/preaching/sermon-illustrations/john-stott-on-how-cross-speaks-to-injustice-and-suffering/',
      tags: ['cross', 'suffering god', 'theology of the cross'],
      provenance: summaryOf(
        cite(
          'stott-cross-of-christ',
          'ch. “Suffering and Glory”',
          'https://www.christianitytoday.com/pastors/preaching/sermon-illustrations/john-stott-on-how-cross-speaks-to-injustice-and-suffering/',
        ),
      ),
    },
    {
      id: 'suffering:cm:keller-walking',
      authorId: 'tim-keller',
      sourceId: 'keller-walking-with-god',
      kind: 'summary',
      lead: 'On walking through suffering, not just explaining it',
      text: 'Keller’s book brings together three approaches that are often kept apart: the philosophical problem of suffering, the Bible’s teaching about it, and the practical experience of going through it. His thesis, set out in the introduction, is that across the Bible God does not merely give joy to his people after or alongside suffering but works it by means of suffering — mirroring the cross, where Jesus’ own suffering was the very way salvation came.',
      locator: 'Walking with God through Pain and Suffering (2013)',
      url: 'https://timothykeller.com/books/walking-with-god-through-pain-and-suffering',
      tags: ['keller', 'pastoral', 'joy through suffering', 'cross'],
      provenance: summaryOf(
        cite('keller-walking-with-god', 'Introduction', 'https://timothykeller.com/books/walking-with-god-through-pain-and-suffering'),
      ),
    },
    {
      id: 'suffering:cm:piper-cancer',
      authorId: 'john-piper',
      sourceId: 'piper-dont-waste-your-cancer',
      kind: 'summary',
      lead: 'On not wasting affliction',
      text: 'Written in February 2006 on the eve of his own surgery for prostate cancer, Piper’s article names ten ways a believer can squander an illness. Among them: refusing to see it as purposed by God for the believer’s good, taking comfort from survival statistics instead of from God (he cites 2 Cor 1:9), avoiding all thought of death, measuring victory by staying alive rather than by treasuring Christ, withdrawing from other people, grieving without hope, and missing the opportunity it gives to bear witness to Christ.',
      locator: '“Don’t Waste Your Cancer” (2006), points 1–10',
      url: 'https://www.ccef.org/dont-waste-your-cancer/',
      relatedVerses: [{ book: '2CO', chapter: 1, verse: 9 }],
      tags: ['piper', 'illness', 'providence', 'pastoral'],
      provenance: summaryOf(
        cite('piper-dont-waste-your-cancer', 'points 1–10', 'https://www.ccef.org/dont-waste-your-cancer/'),
        cite(
          'piper-dont-waste-your-cancer',
          'original Desiring God article, 15 February 2006 (archived copy)',
          'https://web.archive.org/web/2024/https://www.desiringgod.org/articles/dont-waste-your-cancer',
        ),
      ),
    },
    {
      id: 'suffering:cm:wright-evil',
      authorId: 'nt-wright',
      sourceId: 'wright-evil-and-justice-of-god',
      kind: 'summary',
      lead: 'On what God does about evil',
      text: 'Wright argues that modern Western culture has become naive about evil, tending to ignore it until it strikes close to home and then to react by blaming others. Rather than offering a philosophical theodicy, he traces how the Bible tells of God dealing with evil — judging it while offering grace through Israel’s story, and climactically in the death and resurrection of Jesus, where he sees God’s answer to evil reach its decisive point. He then urges Christians to pray and to work for justice now, anticipating a world freed from evil, and above all to practise forgiveness.',
      locator: 'Evil and the Justice of God (2006), chs. 1–5',
      url: 'https://intervarsity.org/news/evil-and-the-justice-of-god',
      tags: ['wright', 'evil', 'justice', 'forgiveness', 'new creation'],
      provenance: summaryOf(
        cite('wright-evil-and-justice-of-god', 'chs. 1–5', 'https://intervarsity.org/news/evil-and-the-justice-of-god'),
      ),
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Sermons                                                             */
  /* ------------------------------------------------------------------ */

  sermons: [
    {
      id: 'suffering:sm:spurgeon-3244',
      authorId: 'spurgeon',
      title: 'Our Light Affliction',
      date: '1870-09-29',
      series: 'Metropolitan Tabernacle Pulpit, vol. 57, no. 3244 (published 1911)',
      refs: [{ book: '2CO', startChapter: 4, startVerse: 17, endChapter: 4, endVerse: 17 }],
      topics: ['affliction', 'suffering', 'glory', 'christian workers'],
      url: 'https://www.spurgeon.org/resource-library/sermons/our-light-affliction/',
      sourceId: 'spurgeon-our-light-affliction',
      summary: text(
        'Preached on a Thursday evening at the Metropolitan Tabernacle, the sermon first insists that Paul was neither naive, hardened nor careless about suffering, then argues that affliction is light by comparison — with the aims and the great motive of Christian service, with the sufferings of others, with what we deserve, with the sufferings of Christ, and with the blessings believers already enjoy. He adds that it feels light as believers prove God’s sustaining grace and see the growth in grace it leads to, and finally that it is light compared with the glory soon to be revealed.',
        summaryOf(cite('spurgeon-our-light-affliction', 'No. 3244', 'https://www.spurgeon.org/resource-library/sermons/our-light-affliction/')),
      ),
    },
    {
      id: 'suffering:sm:spurgeon-35',
      authorId: 'spurgeon',
      title: 'God’s People in the Furnace',
      date: '1855-08-12',
      series: 'New Park Street Pulpit, vol. 1, no. 35',
      refs: [{ book: 'ISA', startChapter: 48, startVerse: 10, endChapter: 48, endVerse: 10 }],
      topics: ['affliction', 'furnace', 'refining', 'election'],
      url: 'https://www.spurgeon.org/resource-library/sermons/gods-people-in-the-furnace/',
      sourceId: 'spurgeon-gods-people-in-the-furnace',
      summary: text(
        'An early sermon on the furnace of affliction (KJV wording of Isa 48:10). Spurgeon stresses that God’s love does not change in the furnace, then gives reasons why believers are tried — all precious things are tested, and suffering makes them like Christ — and describes the furnace’s benefits, beginning with purification.',
        summaryOf(
          cite('spurgeon-gods-people-in-the-furnace', 'No. 35', 'https://www.spurgeon.org/resource-library/sermons/gods-people-in-the-furnace/'),
        ),
      ),
    },
    {
      id: 'suffering:sm:keller-2004',
      authorId: 'tim-keller',
      title: 'Christian Hope and Suffering',
      date: '2004-05-16',
      series: 'Living in Hope (Redeemer Presbyterian Church)',
      refs: [
        { book: '2CO', startChapter: 4, startVerse: 7, endChapter: 4, endVerse: 18 },
        { book: '2CO', startChapter: 12, startVerse: 7, endChapter: 12, endVerse: 10 },
      ],
      topics: ['hope', 'suffering', 'new creation'],
      url: 'https://gospelinlife.com/sermon/christian-hope-and-suffering/',
      sourceId: 'keller-christian-hope-and-suffering',
      summary: text(
        'Keller presents Christian hope as a firm confidence about the believer’s final future with God in the new creation, a confidence that changes how suffering and disappointment are faced. From 2 Corinthians he then makes three observations about suffering: no one escapes it, it has a pattern, and it has a future.',
        summaryOf(cite('keller-christian-hope-and-suffering', 'sermon overview', 'https://gospelinlife.com/sermon/christian-hope-and-suffering/')),
      ),
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Verse notes                                                         */
  /* ------------------------------------------------------------------ */

  verseNotes: [
    {
      verse: { book: '2CO', chapter: 4, verse: 7 },
      explanation: text(
        'This treasure is the light of 4:6 — the knowledge of God’s glory in the face of Christ. Paul says it is carried in jars of clay: fragile, ordinary human bodies and ministries. The reason is stated at once: so that the surpassing power will be seen to be God’s, not ours. Corinth was known for its terra-cotta lamps, which makes the light-in-a-jar image especially concrete.',
        synthesis(
          cite('bsb', '2 Cor 4:6–7'),
          cite('tyndale-open-study-notes', 'on 2 Cor 4:7; 2 Corinthians Book Introduction, “Setting”', TYN_2CO_4),
        ),
      ),
      tags: ['jars of clay', 'treasure', 'power', 'weakness'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 8 },
      explanation: text(
        'The first two of four contrasts: pressed from every side yet not crushed, perplexed yet not despairing. The first participle comes from θλίβω, the verb behind θλῖψις (affliction) in 4:17. The second contrast is a Greek pun — at a loss, but not utterly at a loss. Paul admits real pressure and confusion; what he denies is final defeat.',
        synthesis(cite('bsb', '2 Cor 4:8'), cite('stepbible-tagnt', '2 Cor 4:8 (G2346, G0639, G1820)')),
      ),
      tags: ['hard pressed', 'despair', 'wordplay'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 9 },
      explanation: text(
        'The last two contrasts: persecution without abandonment, being knocked down without being destroyed. The word forsaken (ἐγκαταλείπω) is the same verb Mark uses for Jesus’ cry from the cross. Paul may be abandoned by people, but not by God — a promise Hebrews 13:5 states with the same verb.',
        synthesis(cite('bsb', '2 Cor 4:9; Mark 15:34; Heb 13:5'), cite('stepbible-tbesg', 'G1459')),
      ),
      tags: ['forsaken', 'persecution', 'presence of god'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 10 },
      explanation: text(
        'Paul reads his sufferings through Jesus’ story: he always carries around the dying (νέκρωσις) of Jesus in his body so that the life of Jesus may also be revealed there. Daily exposure to danger is a kind of ongoing death; his survival and endurance display the risen Christ. This is union with Christ, not an addition to Christ’s atoning death.',
        synthesis(cite('bsb', '2 Cor 4:10'), cite('stepbible-tbesg', 'G3500')),
      ),
      tags: ['death of jesus', 'union with christ', 'life'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 11 },
      explanation: text(
        'Verse 11 restates verse 10 more plainly: though still alive, Paul and his companions are continually being handed over to death for Jesus’ sake. The purpose is the same, now with a telling adjective — Jesus’ life revealed in a mortal body. Resurrection life shows itself precisely in what is dying.',
        synthesis(cite('bsb', '2 Cor 4:11'), cite('tyndale-open-study-notes', 'on 2 Cor 4:11', TYN_2CO_4)),
      ),
      tags: ['mortal', 'death', 'life of jesus'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 12 },
      explanation: text(
        'Death works in the apostle; life works in the Corinthians. Paul’s sufferings are not private; they serve the church, because through his exposure to danger the gospel reaches and strengthens others. The Tyndale notes connect this with Colossians 1:24, where Paul speaks of suffering for the sake of Christ’s body.',
        synthesis(cite('bsb', '2 Cor 4:12; Col 1:24'), cite('tyndale-open-study-notes', 'on 2 Cor 4:12', TYN_2CO_4)),
      ),
      tags: ['death', 'life', 'church', 'ministry'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 13 },
      explanation: text(
        'Paul quotes Psalm 116:10 in its Greek form — I believed, therefore I spoke. In the psalm the speaker goes on to say he was greatly afflicted; Paul claims the same spirit of faith, which keeps believing and keeps speaking under pressure. The Tyndale notes call this faith the secret of Paul’s resilience.',
        synthesis(
          cite('bsb', 'Ps 116:10; 2 Cor 4:13'),
          cite('lxx-brenton', 'Ps 115:1 LXX', LXX_PSA_115),
          cite('tyndale-open-study-notes', 'on 2 Cor 4:13–14', TYN_2CO_4),
        ),
      ),
      tags: ['faith', 'quotation', 'psalms', 'speaking'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 14 },
      explanation: text(
        'The content of Paul’s faith: the God who raised Jesus will raise Paul too and bring him, together with the Corinthians, into his presence. Resurrection is the ground of endurance. Suffering is not the last chapter because the tomb of Jesus was not.',
        synthesis(cite('bsb', '2 Cor 4:14')),
      ),
      tags: ['resurrection', 'hope', 'faith'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 15 },
      explanation: text(
        'Paul insists that everything he endures is for the Corinthians’ benefit. His hardships serve a chain of grace: grace reaching more people, causing more thanksgiving, to the glory of God. Suffering in ministry is set within God’s purpose of spreading praise.',
        synthesis(cite('bsb', '2 Cor 4:15')),
      ),
      tags: ['grace', 'thanksgiving', 'glory of god'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 16 },
      explanation: text(
        'Paul repeats the words of 4:1 — we do not lose heart — so that they bracket most of the chapter. While the outer self wastes away through age and hardship, the inner self is renewed daily. The Tyndale notes observe that Paul was worn down physically and emotionally, yet his spirit was being revitalised by God’s power. Renewal is daily, not once for all.',
        synthesis(
          cite('bsb', '2 Cor 4:1, 16'),
          cite('stepbible-tagnt', '2 Cor 4:1, 16 (G1573)'),
          cite('tyndale-open-study-notes', 'on 2 Cor 4:16–17', TYN_2CO_4),
        ),
      ),
      tags: ['lose heart', 'renewal', 'inner self', 'endurance'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 17 },
      explanation: text(
        'Paul calls present affliction light and momentary, and says it is producing an eternal weight of glory beyond all comparison. He pairs opposites — light against weight, momentary against eternal, affliction against glory — and doubles his superlative (literally beyond measure to beyond measure). He is not calling his sufferings trivial (see 11:23–29); he is weighing them against what they are producing. Some interpreters hear a Hebrew echo, since kavod (glory) is related to a root meaning heavy, but that remains a suggestion.',
        synthesis(
          cite('bsb', '2 Cor 4:17; 11:23–29'),
          cite('stepbible-tagnt', '2 Cor 4:17'),
          cite('calvin-commentaries', 'on 2 Cor 4:17, editor’s note 500', CALVIN_2CO_4),
        ),
      ),
      tags: ['affliction', 'weight of glory', 'eternal', 'comparison'],
    },
    {
      verse: { book: '2CO', chapter: 4, verse: 18 },
      explanation: text(
        'Paul keeps his gaze on the unseen rather than the seen, because what is seen is temporary and what is unseen lasts for ever. The verb (σκοπέω) means to look attentively at, to keep one’s attention on something. The Tyndale notes put it simply: looking only at present troubles makes us faint, but seeing life in the light of eternal reality shows that the troubles will pass.',
        synthesis(
          cite('bsb', '2 Cor 4:18'),
          cite('stepbible-tagnt', '2 Cor 4:18 (G4648)'),
          cite('stepbible-tbesg', 'G4648 σκοπέω'),
          cite('tyndale-open-study-notes', 'on 2 Cor 4:18', TYN_2CO_4),
        ),
      ),
      tags: ['unseen', 'eternal', 'focus', 'hope'],
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Concepts (engine retrieval index)                                   */
  /* ------------------------------------------------------------------ */

  concepts: [
    {
      id: 'suffering:c:why-god-allows',
      label: 'Why God allows suffering',
      aliases: [
        'why does god allow suffering',
        'why does god allow evil',
        'why does god let bad things happen',
        'why do bad things happen',
        'problem of evil',
        'the problem of evil',
        'problem of pain',
        'theodicy',
        'theodicies',
        'if god is good',
        'why suffering',
        'why me',
        'free will',
        'free-will defense',
        'free will defence',
        'soul-making',
        'soul making',
        'privation',
        'does god permit evil',
        'god permits evil',
        'why does god permit evil',
        'is god the author of evil',
        'is god responsible for evil',
        'is god in control of evil',
        'sovereignty and evil',
        'bare permission',
        'catholic view of suffering',
        'wesleyan view of suffering',
        'arminian view of suffering',
        'reformed view of suffering',
        'orthodox view of suffering',
      ],
      answer: text(
        'Scripture gives no single tidy answer, but it gives firm truths: God is good and sovereign, sin and death entered his good world through human rebellion, suffering is not always punishment, and God has entered our suffering in Christ and will end it. Christians have explained why God allows evil in different ways — Augustine’s good brought out of evil, the Irenaean emphasis on growth, the Reformed stress on God’s sovereign purposes, the Catholic and Wesleyan emphasis on the freedom God gave his creatures, the free-will defence, and the Orthodox focus on Christ’s victory over death — and the Theology section sets these out side by side, including where the traditions genuinely differ.',
        synthesis(
          cite('bsb', 'Gen 3; Rom 5:12; Job 1–2; John 9:1–3; Rev 21:3–5'),
          cite('augustine-enchiridion', 'ch. 11', ENCHIRIDION),
          cite('westminster-confession', 'ch. 5', WCF),
          cite('catechism-catholic-church', '§311', CCC_PROVIDENCE),
          cite('wesley-sermons', 'Sermon 67, On Divine Providence, §15', WESLEY_SERMON_67),
        ),
      ),
      primarySection: 'theology',
      verses: [
        { book: '2CO', chapter: 4, verse: 17 },
        { book: 'GEN', chapter: 50, verse: 20 },
      ],
      keyWordIds: [],
      crossReferenceIds: ['suffering:xr:job-1-9', 'suffering:xr:rom-8-18', 'suffering:xr:mrk-15-34'],
      contextIds: ['suffering:ctx:retribution', 'suffering:ctx:ane-wisdom'],
      themeIds: ['suffering:th:providence', 'suffering:th:cross'],
      perspectiveSetIds: ['suffering:ps:why-evil'],
      commentaryIds: [
        'suffering:cm:augustine-enchiridion',
        'suffering:cm:lewis-problem-of-pain',
        'suffering:cm:wright-evil',
        'suffering:cm:stott-cross',
      ],
    },
    {
      id: 'suffering:c:affliction',
      label: 'Affliction (θλῖψις)',
      aliases: [
        'affliction',
        'afflictions',
        'afflicted',
        'tribulation',
        'tribulations',
        'trouble',
        'troubles',
        'hard pressed',
        'pressure',
        'distress',
        'light affliction',
        'momentary affliction',
        'thlipsis',
        'θλῖψις',
        'θλιψις',
        'thlibo',
        'θλίβω',
      ],
      answer: text(
        'The Greek word behind affliction in 4:17 is θλῖψις (thlipsis, Strong’s G2347), literally pressure and figuratively affliction or distress. It appears 45 times in the New Testament by our count — 9 of them in 2 Corinthians, more than in any other book — and its cognate verb opens the hardship list in 4:8 (hard pressed). Paul calls this affliction light and momentary only by weighing it against an eternal weight of glory.',
        synthesis(cite('stepbible-tbesg', 'G2347; G2346'), cite('stepbible-tagnt', 'count by Strong’s number'), cite('bsb', '2 Cor 4:8, 17')),
      ),
      primarySection: 'original-languages',
      verses: [
        { book: '2CO', chapter: 4, verse: 17 },
        { book: '2CO', chapter: 4, verse: 8 },
      ],
      keyWordIds: ['suffering:kw:thlipsis', 'suffering:kw:oni', 'suffering:kw:pascho'],
      crossReferenceIds: ['suffering:xr:rom-5-3', 'suffering:xr:2co-1-3', 'suffering:xr:2co-11-23'],
      contextIds: ['suffering:ctx:asia'],
      themeIds: ['suffering:th:refining'],
      perspectiveSetIds: [],
      commentaryIds: ['suffering:cm:spurgeon-light-affliction', 'suffering:cm:calvin-4-17'],
    },
    {
      id: 'suffering:c:jars-of-clay',
      label: 'Jars of clay',
      aliases: [
        'jars of clay',
        'jar of clay',
        'clay jars',
        'earthen vessels',
        'earthen vessel',
        'clay vessels',
        'treasure',
        'this treasure',
        'ostrakinos',
        'ὀστράκινος',
        'οστρακινος',
        'skeuos',
        'σκεῦος',
        'weakness',
        'fragile',
        'pottery',
      ],
      answer: text(
        'In 4:7 the treasure is the light of the gospel from 4:6, and the jars of clay (ὀστράκινος, earthen) are fragile human bodies and ministries. Paul says God arranged it this way so that the surpassing power would plainly be God’s and not ours. Corinth was famous for terra-cotta lamps, and treasures were often kept in earthenware, so the image was vivid; older commentators also suggested an allusion to Gideon’s jars, though Paul does not say so.',
        synthesis(
          cite('bsb', '2 Cor 4:6–7'),
          cite('stepbible-tbesg', 'G3749'),
          cite('tyndale-open-study-notes', '2 Corinthians Book Introduction, “Setting”', TYN_2CO_INTRO),
          cite('jfb-commentary', 'on 2 Cor 4:7', JFB_2CO_4),
        ),
      ),
      primarySection: 'original-languages',
      verses: [
        { book: '2CO', chapter: 4, verse: 7 },
        { book: '2CO', chapter: 4, verse: 6 },
      ],
      keyWordIds: ['suffering:kw:ostrakinos'],
      crossReferenceIds: ['suffering:xr:2co-12-7', 'suffering:xr:gen-1-3'],
      contextIds: ['suffering:ctx:clay-jars', 'suffering:ctx:hardship-lists'],
      themeIds: ['suffering:th:cross'],
      perspectiveSetIds: [],
      commentaryIds: ['suffering:cm:chrysostom-4-7', 'suffering:cm:luther-heidelberg'],
    },
    {
      id: 'suffering:c:lament',
      label: 'Lament and “how long?”',
      aliases: [
        'lament',
        'laments',
        'lamenting',
        'how long',
        'how long o lord',
        'complaint',
        'complain to god',
        'can i be angry with god',
        'angry at god',
        'psalm 13',
        'psalm 88',
        'lamentations',
        'habakkuk',
        'ad anah',
        'עַד־אָנָה',
        'אָנָה',
        'אָן',
        'grief',
        'grieving',
      ],
      answer: text(
        'Lament is prayer that brings pain, protest and questions to God. The Bible’s how long (in Hebrew עַד־אָנָה, literally until where?) appears four times in Psalm 13:1–2 alone, and Psalm 88 even ends in darkness — yet both are addressed to God. Scripture treats honest complaint as a form of faith, and Jesus himself prayed a lament from the cross.',
        synthesis(
          cite('bsb', 'Ps 13; Ps 88; Mark 15:34'),
          cite('stepbible-tbesh', 'H0575; H5704'),
          cite('tyndale-open-study-notes', 'on Ps 13:1–2', 'https://bible.helloao.org/api/c/tyndale/PSA/13.json'),
        ),
      ),
      primarySection: 'key-passages',
      verses: [
        { book: 'PSA', chapter: 13, verse: 1 },
        { book: 'PSA', chapter: 88, verse: 18 },
      ],
      keyWordIds: ['suffering:kw:an', 'suffering:kw:oni'],
      crossReferenceIds: ['suffering:xr:psa-88', 'suffering:xr:mrk-15-34'],
      contextIds: ['suffering:ctx:lament-psalms'],
      themeIds: ['suffering:th:lament'],
      perspectiveSetIds: [],
      commentaryIds: ['suffering:cm:lewis-grief-observed'],
    },
    {
      id: 'suffering:c:despair',
      label: 'Perplexed but not in despair',
      aliases: [
        'despair',
        'despairing',
        'in despair',
        'not in despair',
        'perplexed',
        'hopeless',
        'hopelessness',
        'depression',
        'crushed',
        'exaporeo',
        'ἐξαπορέω',
        'aporeo',
        'ἀπορέω',
        'despaired of life',
      ],
      answer: text(
        'In 4:8 Paul says he is perplexed (ἀπορέω, at a loss) but not in despair (ἐξαπορέω, utterly at a loss) — a Greek pun. The second verb occurs only one other time in the New Testament, in 1:8, where Paul admits that in Asia they did despair even of life. So not in despair is not a claim to constant calm; it is a testimony that despair did not have the last word, because they learned to rely on the God who raises the dead.',
        synthesis(cite('stepbible-tbesg', 'G0639; G1820'), cite('stepbible-tagnt', '2 Cor 1:8; 4:8'), cite('bsb', '2 Cor 1:8–9; 4:8')),
      ),
      primarySection: 'original-languages',
      verses: [
        { book: '2CO', chapter: 4, verse: 8 },
        { book: '2CO', chapter: 1, verse: 8 },
      ],
      keyWordIds: ['suffering:kw:exaporeo'],
      crossReferenceIds: ['suffering:xr:2co-1-3', 'suffering:xr:psa-88'],
      contextIds: ['suffering:ctx:asia'],
      themeIds: ['suffering:th:lament'],
      perspectiveSetIds: [],
      commentaryIds: ['suffering:cm:mayo-4-8'],
    },
    {
      id: 'suffering:c:lose-heart',
      label: 'Not losing heart',
      aliases: [
        'lose heart',
        'losing heart',
        'do not lose heart',
        'faint not',
        'discouraged',
        'discouragement',
        'give up',
        'giving up',
        'endurance',
        'persevere',
        'ekkakeo',
        'ἐκκακέω',
        'enkakeo',
        'ἐγκακέω',
        'renewed day by day',
        'inner self',
        'outer self',
      ],
      answer: text(
        'We do not lose heart (ἐκκακέω, G1573) brackets most of 2 Corinthians 4, appearing at 4:1 and 4:16. Paul’s reasons are God’s mercy in calling him (4:1), the daily renewal of the inner self even as the outer self wastes away (4:16), and the eternal glory that outweighs present affliction (4:17). The same verb appears in Jesus’ call to pray and not lose heart (Luke 18:1).',
        synthesis(cite('stepbible-tbesg', 'G1573'), cite('stepbible-tagnt', '2 Cor 4:1, 16; Luke 18:1'), cite('bsb', '2 Cor 4:1, 16–17')),
      ),
      primarySection: 'original-languages',
      verses: [
        { book: '2CO', chapter: 4, verse: 16 },
        { book: '2CO', chapter: 4, verse: 1 },
      ],
      keyWordIds: ['suffering:kw:ekkakeo'],
      crossReferenceIds: ['suffering:xr:jas-1-2', 'suffering:xr:heb-12-1'],
      contextIds: [],
      themeIds: ['suffering:th:refining', 'suffering:th:hope'],
      perspectiveSetIds: [],
      commentaryIds: ['suffering:cm:calvin-4-17'],
    },
    {
      id: 'suffering:c:weight-of-glory',
      label: 'The weight of glory',
      aliases: [
        'weight of glory',
        'eternal weight of glory',
        'glory',
        'weight',
        'baros',
        'βάρος',
        'βαρος',
        'kavod',
        'kabod',
        'כָּבוֹד',
        'heaven',
        'eternal',
        'unseen',
        'what is unseen',
        'fix our eyes',
      ],
      answer: text(
        'In 4:17 Paul sets the lightness of present affliction against an eternal weight (βάρος) of glory, beyond measure to beyond measure. An older line of interpretation, noted in the Calvin Translation Society edition, hears the Hebrew kavod (glory), related to a root meaning heavy — an attractive but unproven suggestion. The point is clear either way: what is unseen and eternal outweighs what is seen and temporary (4:18).',
        synthesis(
          cite('stepbible-tbesg', 'G0922'),
          cite('stepbible-tbesh', 'H3519; H3513'),
          cite('calvin-commentaries', 'on 2 Cor 4:17, editor’s note 500', CALVIN_2CO_4),
          cite('bsb', '2 Cor 4:17–18'),
        ),
      ),
      primarySection: 'original-languages',
      verses: [
        { book: '2CO', chapter: 4, verse: 17 },
        { book: '2CO', chapter: 4, verse: 18 },
      ],
      keyWordIds: ['suffering:kw:baros'],
      crossReferenceIds: ['suffering:xr:rom-8-18', 'suffering:xr:rev-21-3', 'suffering:xr:1pe-1-6'],
      contextIds: [],
      themeIds: ['suffering:th:hope'],
      perspectiveSetIds: [],
      commentaryIds: ['suffering:cm:calvin-4-17', 'suffering:cm:spurgeon-light-affliction'],
    },
    {
      id: 'suffering:c:death-and-life',
      label: 'Carrying the death of Jesus',
      aliases: [
        'death of jesus',
        'dying of jesus',
        'dying of the lord jesus',
        'life of jesus',
        'union with christ',
        'fellowship of his sufferings',
        'share in his sufferings',
        'suffer with christ',
        'nekrosis',
        'νέκρωσις',
        'νεκρωσις',
        'mortal body',
        'death is at work in us',
        'colossians 1:24',
        'what is lacking in christ’s afflictions',
        "what is lacking in christ's afflictions",
        'redemptive suffering',
        'salvifici doloris',
        'sharing in christ’s sufferings',
        "sharing in christ's sufferings",
      ],
      answer: text(
        'Paul describes his sufferings as carrying around the dying (νέκρωσις) of Jesus so that the life of Jesus may be revealed in his mortal body (4:10–11). It is union with Christ: believers share the pattern of his death and the power of his resurrection (Phil 3:10; 1 Pet 4:13). Christians agree this adds nothing to his unique atoning work — as the Tyndale notes on Colossians 1:24 put it, Christ’s redemptive suffering is unique and finished — though traditions describe believers’ share in his sufferings differently: Calvin spoke of Christ suffering in his members for the strengthening of the church, while Catholic teaching (Salvifici Doloris) speaks of believers sharing in Christ’s redemptive suffering.',
        synthesis(
          cite('bsb', '2 Cor 4:10–12; Phil 3:10; 1 Pet 4:13'),
          cite('stepbible-tbesg', 'G3500'),
          cite('tyndale-open-study-notes', 'on Col 1:24', 'https://bible.helloao.org/api/c/tyndale/COL/1.json'),
          cite('calvin-commentaries', 'on Col 1:24', CALVIN_COL_1),
          cite('salvifici-doloris', '§§19, 24', SALVIFICI_DOLORIS),
        ),
      ),
      primarySection: 'theology',
      verses: [
        { book: '2CO', chapter: 4, verse: 10 },
        { book: '2CO', chapter: 4, verse: 11 },
        { book: '2CO', chapter: 4, verse: 12 },
      ],
      keyWordIds: ['suffering:kw:nekrosis', 'suffering:kw:pascho'],
      crossReferenceIds: ['suffering:xr:php-3-10', 'suffering:xr:col-1-24', 'suffering:xr:1pe-4-12', 'suffering:xr:isa-53-3'],
      contextIds: ['suffering:ctx:triumph'],
      themeIds: ['suffering:th:union'],
      perspectiveSetIds: [],
      commentaryIds: ['suffering:cm:luther-heidelberg'],
    },
    {
      id: 'suffering:c:punishment',
      label: 'Is suffering punishment?',
      aliases: [
        'punishment',
        'punished',
        'is god punishing me',
        'did i deserve this',
        'deserve',
        'karma',
        'retribution',
        'who sinned',
        'job’s friends',
        "job's friends",
        'jobs friends',
        'tower of siloam',
        'blind from birth',
        'born blind',
        'bad things happen to good people',
      ],
      answer: text(
        'Scripture affirms that sin has consequences, but it repeatedly denies that every calamity is a verdict on its victims. Job’s friends insisted his suffering must be punishment, and the book rejects them; Jesus told his disciples that a man’s blindness was not caused by his or his parents’ sin (John 9:3), and said the victims of Pilate and of the tower of Siloam were not worse sinners than others (Luke 13:1–5).',
        synthesis(
          cite('bsb', 'John 9:1–3; Luke 13:1–5; Job 42:7'),
          cite('tyndale-open-study-notes', 'Job, Book Introduction, “Meaning and Message”', TYN_2CO_INTRO),
          cite('tyndale-open-study-notes', 'on Luke 13:1–4', 'https://bible.helloao.org/api/c/tyndale/LUK/13.json'),
        ),
      ),
      primarySection: 'key-passages',
      verses: [
        { book: 'JHN', chapter: 9, verse: 3 },
        { book: 'LUK', chapter: 13, verse: 2 },
      ],
      keyWordIds: [],
      crossReferenceIds: ['suffering:xr:job-1-9'],
      contextIds: ['suffering:ctx:retribution', 'suffering:ctx:ane-wisdom'],
      themeIds: ['suffering:th:providence'],
      perspectiveSetIds: ['suffering:ps:why-evil'],
      commentaryIds: [],
    },
    {
      id: 'suffering:c:purpose',
      label: 'God’s purposes in suffering',
      aliases: [
        'purpose',
        'purpose of suffering',
        'does suffering have a purpose',
        'what is god doing',
        'refine',
        'refining',
        'refined',
        'furnace',
        'furnace of affliction',
        'perseverance',
        'character',
        'discipline',
        'trials',
        'testing',
        'tested',
        'produces',
        'meant it for good',
        'katergazomai',
        'κατεργάζομαι',
      ],
      answer: text(
        'The New Testament repeatedly says affliction produces something. Romans 5:3, James 1:3 and 2 Corinthians 4:17 all use the same Greek verb (κατεργάζομαι): suffering produces perseverance and hope, testing produces endurance, and present affliction is producing an eternal weight of glory. Joseph’s you meant evil, God meant good (Gen 50:20) shows that God’s purpose does not make the evil good; it overrules it.',
        synthesis(cite('stepbible-tagnt', 'Rom 5:3; Jas 1:3; 2 Cor 4:17 (G2716)'), cite('bsb', 'Rom 5:3–5; Jas 1:2–4; Gen 50:20; 2 Cor 4:17')),
      ),
      primarySection: 'theology',
      verses: [
        { book: '2CO', chapter: 4, verse: 17 },
        { book: 'ROM', chapter: 5, verse: 3 },
      ],
      keyWordIds: ['suffering:kw:thlipsis'],
      crossReferenceIds: ['suffering:xr:rom-5-3', 'suffering:xr:jas-1-2', 'suffering:xr:1pe-1-6'],
      contextIds: [],
      themeIds: ['suffering:th:refining', 'suffering:th:providence'],
      perspectiveSetIds: ['suffering:ps:why-evil'],
      commentaryIds: ['suffering:cm:piper-cancer', 'suffering:cm:keller-walking'],
    },
    {
      id: 'suffering:c:suffering-god',
      label: 'God with us in suffering',
      aliases: [
        'does god suffer',
        'can god suffer',
        'god suffers',
        'suffering god',
        'impassibility',
        'is god impassible',
        'does god feel pain',
        'where is god',
        'where was god',
        'god with us',
        'immanuel',
        'emmanuel',
        'forsaken',
        'why have you forsaken me',
        'my god my god',
        'theology of the cross',
        'cross',
        'man of sorrows',
        'sympathize',
      ],
      answer: text(
        'Scripture’s deepest response to suffering is that God has entered it. Isaiah’s Servant is a man of sorrows, Jesus cries out from the cross in the words of Psalm 22, and Hebrews says he sympathizes with our weaknesses. In 4:9 Paul is persecuted but not forsaken — using the same verb as Jesus’ cry of forsakenness. Luther’s theology of the cross and John Stott’s chapter on suffering both argue that the cross is where God is truly seen. Classical Christian theology locates this suffering in the incarnate Son, who suffered in his human nature — the Westminster Confession, for example, confesses God to be “without body, parts, or passions” (2.1) — and how far one may speak of suffering in God himself is debated among theologians.',
        synthesis(
          cite('bsb', 'Isa 53:3–5; Mark 15:34; Heb 4:15; 2 Cor 4:9'),
          cite('stepbible-tbesg', 'G1459'),
          cite('luther-heidelberg-disputation', 'theses 19–21'),
          cite('stott-cross-of-christ', 'ch. “Suffering and Glory”'),
          cite('westminster-confession', 'ch. 2 “Of God, and of the Holy Trinity” §1', WCF),
        ),
      ),
      primarySection: 'theology',
      verses: [
        { book: '2CO', chapter: 4, verse: 9 },
        { book: 'MRK', chapter: 15, verse: 34 },
      ],
      keyWordIds: [],
      crossReferenceIds: ['suffering:xr:mrk-15-34', 'suffering:xr:isa-53-3', 'suffering:xr:heb-12-1'],
      contextIds: [],
      themeIds: ['suffering:th:cross'],
      perspectiveSetIds: ['suffering:ps:why-evil'],
      commentaryIds: ['suffering:cm:luther-heidelberg', 'suffering:cm:stott-cross', 'suffering:cm:keller-walking'],
    },
    {
      id: 'suffering:c:hope',
      label: 'Hope beyond suffering',
      aliases: [
        'hope',
        'no more tears',
        'wipe away every tear',
        'new creation',
        'new heavens and new earth',
        'resurrection',
        'will it end',
        'will suffering end',
        'afterlife',
        'eternal life',
        'future glory',
        'revelation 21',
      ],
      answer: text(
        'Christian hope does not deny present pain; it weighs it. Paul grounds endurance in the resurrection (2 Cor 4:14) and an eternal weight of glory (4:17), Romans 8:18 says present sufferings are not comparable to the coming glory, and Revelation 21 pictures God dwelling with his people, every tear wiped away and death gone. The Bible ends not with an explanation of suffering but with its end.',
        synthesis(cite('bsb', '2 Cor 4:14–18; Rom 8:18; Rev 21:3–5')),
      ),
      primarySection: 'theology',
      verses: [
        { book: '2CO', chapter: 4, verse: 14 },
        { book: '2CO', chapter: 4, verse: 17 },
        { book: 'REV', chapter: 21, verse: 4 },
      ],
      keyWordIds: ['suffering:kw:baros'],
      crossReferenceIds: ['suffering:xr:rev-21-3', 'suffering:xr:rom-8-18', 'suffering:xr:heb-12-1'],
      contextIds: [],
      themeIds: ['suffering:th:hope'],
      perspectiveSetIds: [],
      commentaryIds: ['suffering:cm:wright-evil', 'suffering:cm:calvin-4-17'],
    },
  ],

  suggestedQuestions: [
    'Why does God allow suffering?',
    'What does Paul mean by jars of clay?',
    'What is the Greek word behind “affliction”?',
    'What did Tim Keller say about suffering?',
    'How would the original audience have understood this?',
    'Where else does Paul talk about suffering?',
    'How does this connect with Romans?',
    'Explain verse 17 in more detail.',
    'Are there different theological interpretations of the problem of evil?',
  ],

  /* ------------------------------------------------------------------ */
  /* Study-specific sources & authors                                    */
  /* ------------------------------------------------------------------ */

  sources: [
    {
      id: 'chrysostom-homilies-2-corinthians',
      type: 'sermon',
      title: 'Homilies on the Second Epistle to the Corinthians',
      authorIds: ['chrysostom'],
      year: 'late 4th century (English trans. 1889)',
      publisher: 'Christian Literature Publishing Co. (Nicene and Post-Nicene Fathers, First Series, vol. 12)',
      url: 'https://www.newadvent.org/fathers/2202.htm',
      edition: 'trans. Talbot W. Chambers; ed. Philip Schaff (1889); revised and edited for New Advent by Kevin Knight',
      license: { status: 'public-domain', name: 'Public domain (1889 translation)', usage: 'full-text' },
      description: 'Thirty sermons by the great preacher of Antioch and Constantinople expounding 2 Corinthians verse by verse.',
    },
    {
      id: 'augustine-enchiridion',
      type: 'book',
      title: 'Enchiridion (Handbook on Faith, Hope and Love)',
      authorIds: ['augustine'],
      year: 'c. 421 (English trans. 1887)',
      publisher: 'Christian Literature Publishing Co. (Nicene and Post-Nicene Fathers, First Series, vol. 3)',
      url: ENCHIRIDION,
      edition: 'trans. J. F. Shaw; ed. Philip Schaff (1887); revised and edited for New Advent by Kevin Knight',
      license: { status: 'public-domain', name: 'Public domain (1887 translation)', usage: 'full-text' },
      description: 'Augustine’s compact summary of Christian teaching, written at the request of an otherwise unknown Laurentius (probably a layman, according to the edition’s introduction), including his classic account of evil as the privation of good.',
    },
    {
      id: 'luther-heidelberg-disputation',
      type: 'lecture',
      title: 'Heidelberg Disputation',
      authorIds: ['luther'],
      year: '1518',
      url: 'https://bookofconcord.org/other-resources/sources-and-context/heidelberg-disputation/',
      edition:
        'English text as published on BookOfConcord.org; the page names no translator, and its wording appears to follow the translation in Luther’s Works, vol. 31 (ed. Harold J. Grimm, 1957), which is copyrighted',
      license: {
        status: 'public-domain',
        name: 'Latin original public domain; standard English translations are copyrighted',
        usage: 'summary-only',
      },
      description:
        'Twenty-eight theological theses defended at a meeting of the Augustinian order in Heidelberg on 26 April 1518, where Luther first set the theology of the cross against the theology of glory.',
    },
    {
      id: 'spurgeon-our-light-affliction',
      type: 'sermon',
      title: 'Our Light Affliction (Sermon No. 3244)',
      authorIds: ['spurgeon'],
      year: '1870 (published 1911)',
      publisher: 'Metropolitan Tabernacle Pulpit, vol. 57',
      url: 'https://www.spurgeon.org/resource-library/sermons/our-light-affliction/',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'A sermon on 2 Corinthians 4:17 preached at the Metropolitan Tabernacle on 29 September 1870.',
    },
    {
      id: 'spurgeon-gods-people-in-the-furnace',
      type: 'sermon',
      title: 'God’s People in the Furnace (Sermon No. 35)',
      authorIds: ['spurgeon'],
      year: '1855',
      publisher: 'New Park Street Pulpit, vol. 1',
      url: 'https://www.spurgeon.org/resource-library/sermons/gods-people-in-the-furnace/',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'A sermon on Isaiah 48:10 preached at New Park Street Chapel on 12 August 1855.',
    },
    {
      id: 'keller-christian-hope-and-suffering',
      type: 'sermon',
      title: 'Christian Hope and Suffering',
      authorIds: ['tim-keller'],
      year: '2004',
      publisher: 'Gospel in Life (Redeemer Presbyterian Church, New York)',
      url: 'https://gospelinlife.com/sermon/christian-hope-and-suffering/',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'A sermon on 2 Corinthians 4:7–18 and 12:7–10 from the series Living in Hope, preached 16 May 2004.',
    },
    {
      id: 'lewis-problem-of-pain',
      type: 'book',
      title: 'The Problem of Pain',
      authorIds: ['cs-lewis'],
      year: '1940',
      publisher: 'The Centenary Press (current edition HarperCollins)',
      url: 'https://en.wikipedia.org/wiki/The_Problem_of_Pain',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description:
        'Lewis’s apologetic reply to the objection that pain disproves a good and all-powerful God, with chapters on divine omnipotence and goodness, human wickedness, the fall, human and animal pain, hell and heaven.',
    },
    {
      id: 'lewis-grief-observed',
      type: 'book',
      title: 'A Grief Observed',
      authorIds: ['cs-lewis'],
      year: '1961',
      publisher: 'Faber and Faber (first published under the pseudonym N. W. Clerk)',
      url: 'https://en.wikipedia.org/wiki/A_Grief_Observed',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'Lewis’s journal-like reflections after the death of his wife, Joy Davidman, in 1960.',
    },
    {
      id: 'keller-walking-with-god',
      type: 'book',
      title: 'Walking with God through Pain and Suffering',
      authorIds: ['tim-keller'],
      year: '2013',
      publisher: 'Dutton',
      url: 'https://timothykeller.com/books/walking-with-god-through-pain-and-suffering',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'Keller’s treatment of suffering from philosophical, biblical and practical angles.',
    },
    {
      id: 'stott-cross-of-christ',
      type: 'book',
      title: 'The Cross of Christ',
      authorIds: ['john-stott'],
      year: '1986',
      publisher: 'InterVarsity Press',
      url: 'https://www.booksataglance.com/book-summaries/the-cross-of-christ-by-john-stott/',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'Stott’s major theology of the cross; its final chapter, “Suffering and Glory”, addresses the problem of suffering.',
    },
    {
      id: 'carson-how-long-o-lord',
      type: 'book',
      title: 'How Long, O Lord? Reflections on Suffering and Evil',
      authorIds: ['da-carson'],
      year: '1990 (2nd ed. 2006)',
      publisher: 'Baker Academic',
      url: 'https://www.booksataglance.com/book-summaries/how-long-o-lord-reflections-on-suffering-and-evil-2nd-edition-by-d-a-carson/',
      license: { status: 'copyrighted', name: '© 1990, 2006 D. A. Carson', usage: 'summary-only' },
      description:
        'A biblical and pastoral study written chiefly to prepare Christians before tragedy strikes, including chapters on Job, the suffering of God and the mystery of providence.',
    },
    {
      id: 'piper-dont-waste-your-cancer',
      type: 'article',
      title: 'Don’t Waste Your Cancer',
      authorIds: ['john-piper'],
      year: '2006',
      publisher:
        'Desiring God (15 February 2006); also in The Journal of Biblical Counseling 24:2 (Spring 2006) with reflections by David Powlison (CCEF)',
      url: 'https://www.ccef.org/dont-waste-your-cancer/',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description:
        'An article written on the eve of Piper’s prostate-cancer surgery (13 February 2006), listing ten ways to waste — or not waste — an illness. The linked CCEF copy is the Journal of Biblical Counseling version; the original is at desiringgod.org/articles/dont-waste-your-cancer.',
    },
    {
      id: 'wright-evil-and-justice-of-god',
      type: 'book',
      title: 'Evil and the Justice of God',
      authorIds: ['nt-wright'],
      year: '2006',
      publisher: 'InterVarsity Press',
      url: 'https://intervarsity.org/news/evil-and-the-justice-of-god',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'Five chapters on how the biblical story portrays God dealing with evil, climaxing in the cross, and on forgiveness as the shape of Christian response.',
    },
    {
      id: 'tada-when-god-weeps',
      type: 'book',
      title: 'When God Weeps: Why Our Sufferings Matter to the Almighty',
      authorIds: ['joni-eareckson-tada', 'steven-estes'],
      year: '1997',
      publisher: 'Zondervan',
      url: 'https://www.wtsbooks.com/products/when-god-weeps-joni-eareckson-tada-steve-estes-9780310238355',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'Tada and Estes on God’s purposes in suffering, written out of Tada’s decades of quadriplegia.',
    },
    {
      id: 'hick-evil-and-the-god-of-love',
      type: 'book',
      title: 'Evil and the God of Love',
      authorIds: ['john-hick'],
      year: '1966',
      publisher: 'Macmillan',
      url: 'https://en.wikipedia.org/wiki/Irenaean_theodicy',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'Hick’s influential study contrasting Augustinian and Irenaean theodicies and developing a “soul-making” theodicy.',
    },
    {
      id: 'plantinga-god-freedom-and-evil',
      type: 'book',
      title: 'God, Freedom, and Evil',
      authorIds: ['alvin-plantinga'],
      year: '1974',
      publisher: 'Harper & Row (reprinted by Eerdmans, 1977)',
      url: 'https://en.wikipedia.org/wiki/Plantinga%27s_free_will_defense',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'A short work presenting the free-will defence against the logical problem of evil.',
    },
    {
      id: 'hart-doors-of-the-sea',
      type: 'book',
      title: 'The Doors of the Sea: Where Was God in the Tsunami?',
      authorIds: ['david-bentley-hart'],
      year: '2005',
      publisher: 'Eerdmans',
      url: 'https://www.eerdmans.com/9781467418447/the-doors-of-the-sea/',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'summary-only' },
      description: 'A short response to the 2004 Indian Ocean tsunami by an Eastern Orthodox philosopher, critical of theodicies that make catastrophes part of God’s will.',
    },
    {
      id: 'fitzgerald-cracks-in-an-earthen-vessel',
      type: 'book',
      title: 'Cracks in an Earthen Vessel: An Examination of the Catalogues of Hardships in the Corinthian Correspondence',
      authorIds: ['john-t-fitzgerald'],
      year: '1988',
      publisher: 'Scholars Press (SBL Dissertation Series 99)',
      url: 'https://books.google.com/books/about/Cracks_in_an_Earthen_Vessel.html?id=AWQRAQAAIAAJ',
      license: { status: 'copyrighted', name: 'Copyrighted', usage: 'metadata-only' },
      description: 'A scholarly study of Paul’s hardship lists in 1–2 Corinthians against the background of Greco-Roman moral philosophy.',
    },
    {
      id: 'salvifici-doloris',
      type: 'article',
      title: 'Salvifici Doloris: On the Christian Meaning of Human Suffering (Apostolic Letter)',
      authorIds: ['john-paul-ii'],
      year: '1984 (11 February)',
      publisher: 'Libreria Editrice Vaticana',
      url: SALVIFICI_DOLORIS,
      license: { status: 'copyrighted', name: '© 1984 Libreria Editrice Vaticana', usage: 'summary-only' },
      description:
        'John Paul II’s apostolic letter on suffering, which reads Colossians 1:24 and 2 Corinthians 4:8–11 as describing believers who, united to Christ, share in his redemptive suffering, while insisting that nothing can be added to the redemption he accomplished.',
    },
  ],

  authors: [
    {
      id: 'john-hick',
      name: 'John Hick',
      lifespan: '1922–2012',
      era: 'contemporary',
      tradition: 'Philosopher of religion (later religious pluralist)',
      description:
        'English philosopher whose Evil and the God of Love (1966) developed an Irenaean “soul-making” theodicy; his later work advocated religious pluralism.',
      aliases: ['hick', 'john hick'],
      url: 'https://en.wikipedia.org/wiki/John_Hick',
    },
    {
      id: 'alvin-plantinga',
      name: 'Alvin Plantinga',
      lifespan: 'b. 1932',
      era: 'contemporary',
      tradition: 'Reformed (Calvinist); analytic philosopher',
      description:
        'American analytic philosopher who taught at Calvin College and the University of Notre Dame; known for the free-will defence and Reformed epistemology.',
      aliases: ['plantinga', 'alvin plantinga'],
      url: 'https://en.wikipedia.org/wiki/Alvin_Plantinga',
    },
    {
      id: 'david-bentley-hart',
      name: 'David Bentley Hart',
      lifespan: 'b. 1965',
      era: 'contemporary',
      tradition: 'Eastern Orthodox',
      description:
        'American philosopher and theologian who became Eastern Orthodox at twenty-one; author of The Doors of the Sea (2005).',
      aliases: ['hart', 'david bentley hart', 'd. b. hart', 'db hart'],
      url: 'https://en.wikipedia.org/wiki/David_Bentley_Hart',
    },
    {
      id: 'joni-eareckson-tada',
      name: 'Joni Eareckson Tada',
      lifespan: 'b. 1949',
      era: 'contemporary',
      tradition: 'Evangelical',
      description:
        'American author and founder of Joni and Friends, a ministry in the disability community; quadriplegic since a diving accident in 1967.',
      aliases: ['joni', 'joni eareckson tada', 'joni tada', 'tada'],
      url: 'https://en.wikipedia.org/wiki/Joni_Eareckson_Tada',
    },
    {
      id: 'steven-estes',
      name: 'Steven Estes',
      era: 'contemporary',
      tradition: 'Evangelical',
      description:
        'Pastor of Community Evangelical Church in Elverson, Pennsylvania, and co-author with Joni Eareckson Tada of When God Weeps.',
      aliases: ['steven estes', 'steve estes', 'estes'],
    },
    {
      id: 'john-t-fitzgerald',
      name: 'John T. Fitzgerald',
      era: 'contemporary',
      tradition: 'New Testament scholar',
      description: 'American New Testament scholar; author of Cracks in an Earthen Vessel (1988), a study of Paul’s hardship catalogues.',
      aliases: ['fitzgerald', 'john fitzgerald', 'john t. fitzgerald'],
    },
    {
      id: 'john-paul-ii',
      name: 'Pope John Paul II',
      lifespan: '1920–2005',
      era: 'contemporary',
      tradition: 'Catholic',
      description:
        'Karol Wojtyła, Polish philosopher and theologian, pope from 1978 to 2005; author of the apostolic letter Salvifici Doloris (1984) on the Christian meaning of human suffering.',
      aliases: ['john paul ii', 'pope john paul ii', 'john paul 2', 'karol wojtyla', 'wojtyla'],
      url: 'https://en.wikipedia.org/wiki/Pope_John_Paul_II',
    },
  ],
};

export default study;
