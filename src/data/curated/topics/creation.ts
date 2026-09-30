import type { CuratedTopic, PassageRef, Source } from '../../../domain/models';
import { cite, summaryOf, synthesis, text } from '../../../domain/provenance';

/** Verse range within one chapter. */
const v = (book: string, chapter: number, from: number, to: number = from): PassageRef => ({
  book,
  startChapter: chapter,
  startVerse: from,
  endChapter: chapter,
  endVerse: to,
});

const PCA_URL = 'https://www.pcahistory.org/pca/digest/studies/creation/report.html';
const WCF_URL = 'https://www.opc.org/wcf.html';

const sources: Source[] = [
  {
    id: 'pca-creation-study-report',
    type: 'article',
    title: 'Report of the Creation Study Committee',
    authorIds: [],
    year: '2000',
    publisher: 'Presbyterian Church in America (28th General Assembly)',
    url: PCA_URL,
    license: { status: 'copyrighted', name: '© Presbyterian Church in America', usage: 'summary-only' },
    description:
      'A unanimous report by a committee whose members held different views, surveying the history of interpretation and the four main Reformed readings of the Genesis days.',
  },
];

const topic: CuratedTopic = {
  id: 'creation',
  name: 'Creation',
  aliases: [
    'creation',
    'the creation',
    'creator',
    'god the creator',
    'creation story',
    'how was the world created',
    'who created the world',
    'god created',
    'creation out of nothing',
    'creatio ex nihilo',
    'days of creation',
    'six days of creation',
    'creation days',
    'age of the earth',
    'young earth',
    'old earth',
    'creation and science',
    'creation care',
    'stewardship of creation',
    'new creation',
    'bara',
  ],
  topic: {
    name: 'Creation',
    question: 'What does the Bible teach about creation?',
    definition: text(
      'Scripture opens with God creating the heavens and the earth (Gen 1:1), and the whole Bible assumes that everything besides God exists because he willed it (Rev 4:11). Genesis 1:1–2:3 presents creation as the ordered work of God’s word, declared very good, crowned by humanity made in God’s image, and completed in a seventh day of rest; its first verb is the Hebrew bārāʾ, “to create.” The Psalms and Job celebrate creation as the display of God’s wisdom and power (Ps 19:1–6; 104:24–30; Job 38:4–11). The New Testament names the Son as the one through whom all things were made and in whom they hold together (John 1:1–3; Col 1:15–17; Heb 1:2–3), and says the universe was formed at God’s command (Heb 11:3). Creation now groans under futility, yet awaits renewal (Rom 8:19–22; Rev 21:1–5).',
      synthesis(
        cite('bsb', 'Gen 1:1–2:3'),
        cite('bsb', 'Rev 4:11'),
        cite('stepbible-tahot', 'Gen 1:1 (בָּרָא, H1254A)'),
        cite('stepbible-tbesh', 'H1254A בָּרָא'),
        cite('bsb', 'Ps 19:1–6'),
        cite('bsb', 'Ps 104:24–30'),
        cite('bsb', 'Job 38:4–11'),
        cite('bsb', 'John 1:1–3'),
        cite('bsb', 'Col 1:15–17'),
        cite('bsb', 'Heb 1:2–3'),
        cite('bsb', 'Heb 11:3'),
        cite('bsb', 'Rom 8:19–22'),
        cite('bsb', 'Rev 21:1–5'),
      ),
    ),
    keyPassages: [
      {
        id: 'creation:kp:1',
        ref: { book: 'GEN', startChapter: 1, startVerse: 1, endChapter: 2, endVerse: 3 },
        title: 'In the beginning',
        note: text(
          'God speaks an ordered world into being over six days, sees all that he has made as very good, creates humanity in his image to rule it, and rests on the seventh day, which he blesses.',
          synthesis(cite('bsb', 'Gen 1:1–2:3')),
        ),
        group: 'In the beginning',
        tags: ['genesis', 'six days', 'image of god', 'sabbath'],
      },
      {
        id: 'creation:kp:2',
        ref: v('GEN', 2, 15),
        title: 'To cultivate and keep it',
        note: text(
          'The first human is placed in the garden to work it and take care of it—the root of humanity’s calling to steward creation.',
          synthesis(cite('bsb', 'Gen 2:15')),
        ),
        group: 'In the beginning',
        tags: ['stewardship', 'work', 'garden', 'creation care'],
      },
      {
        id: 'creation:kp:3',
        ref: v('PSA', 33, 6, 9),
        title: 'By the word of the LORD',
        note: text(
          'The heavens were made by God’s word and the breath of his mouth: he spoke, and it came to be.',
          synthesis(cite('bsb', 'Ps 33:6–9')),
        ),
        group: 'In the beginning',
        tags: ['word of god', 'psalms', 'power'],
      },
      {
        id: 'creation:kp:4',
        ref: v('JOB', 38, 1, 11),
        title: 'Where were you?',
        note: text(
          'God answers Job out of the whirlwind with the foundations of the earth and the boundaries of the sea, setting human understanding in its place before the Creator.',
          synthesis(cite('bsb', 'Job 38:1–11')),
        ),
        group: 'In the beginning',
        tags: ['job', 'wisdom', 'humility', 'sea'],
      },
      {
        id: 'creation:kp:5',
        ref: v('PSA', 104, 24, 30),
        title: 'In wisdom you made them all',
        note: text(
          'All creatures depend on God for food and breath, and when he sends his Spirit they are created and the face of the earth is renewed.',
          synthesis(cite('bsb', 'Ps 104:24–30')),
        ),
        group: 'In the beginning',
        tags: ['providence', 'spirit', 'creatures', 'psalms'],
      },
      {
        id: 'creation:kp:6',
        ref: v('JHN', 1, 1, 5),
        title: 'Through him all things were made',
        note: text(
          'The Word who was with God and was God is the one through whom everything came into being; in him is the life that is the light of men.',
          synthesis(cite('bsb', 'John 1:1–5')),
        ),
        group: 'Christ and creation',
        tags: ['logos', 'christ', 'light', 'life'],
      },
      {
        id: 'creation:kp:7',
        ref: v('COL', 1, 15, 20),
        title: 'In him all things hold together',
        note: text(
          'All things, visible and invisible, were created through and for the Son, who holds them together and reconciles them through the blood of his cross.',
          synthesis(cite('bsb', 'Col 1:15–20')),
        ),
        group: 'Christ and creation',
        tags: ['christ', 'reconciliation', 'supremacy'],
      },
      {
        id: 'creation:kp:8',
        ref: v('HEB', 1, 1, 3),
        title: 'Through whom he made the universe',
        note: text(
          'God’s final word is his Son, the heir of all things, through whom he made the universe and who upholds all things by his powerful word.',
          synthesis(cite('bsb', 'Heb 1:1–3')),
        ),
        group: 'Christ and creation',
        tags: ['christ', 'revelation', 'providence'],
      },
      {
        id: 'creation:kp:9',
        ref: v('HEB', 11, 3),
        title: 'Formed at God’s command',
        note: text(
          'By faith we understand that the universe was formed by God’s word, so that what is seen was not made out of what is visible.',
          synthesis(cite('bsb', 'Heb 11:3')),
        ),
        group: 'Christ and creation',
        tags: ['faith', 'ex nihilo', 'word of god'],
      },
      {
        id: 'creation:kp:10',
        ref: v('PSA', 19, 1, 6),
        title: 'The heavens declare the glory of God',
        note: text(
          'Without speech or words, the skies proclaim God’s glory to the whole earth, day after day and night after night.',
          synthesis(cite('bsb', 'Ps 19:1–6')),
        ),
        group: 'Creation’s witness and renewal',
        tags: ['general revelation', 'glory', 'psalms'],
      },
      {
        id: 'creation:kp:11',
        ref: v('ROM', 1, 19, 25),
        title: 'Clearly seen in what has been made',
        note: text(
          'God’s eternal power and divine nature are evident in creation, yet humanity exchanged the truth for a lie and worshipped created things rather than the Creator.',
          synthesis(cite('bsb', 'Rom 1:19–25')),
        ),
        group: 'Creation’s witness and renewal',
        tags: ['general revelation', 'idolatry', 'accountability'],
      },
      {
        id: 'creation:kp:12',
        ref: v('ROM', 8, 19, 22),
        title: 'Creation groans',
        note: text(
          'Creation, subjected to futility, waits in hope to be set free from its bondage to decay into the freedom of God’s children.',
          synthesis(cite('bsb', 'Rom 8:19–22')),
        ),
        group: 'Creation’s witness and renewal',
        tags: ['new creation', 'hope', 'futility'],
      },
    ],
  },
  anchor: { book: 'GEN', startChapter: 1, startVerse: 1, endChapter: 2, endVerse: 3 },
  perspectives: [
    {
      id: 'creation:ps:days',
      question: 'How long were the “days” of Genesis 1?',
      consensus: 'uncertain',
      intro:
        'Christians confess together that God made all things and that creation is good. How to read the six days is debated, especially among evangelical and Reformed Christians. Early interpreters already differed: some, like Basil, took the days as ordinary days, while Augustine favoured an instantaneous creation. In 2000 a committee of the Presbyterian Church in America, whose members held different views, set out the four most prominent readings held within that church. (Other Christians relate Genesis to evolutionary accounts of biological history; those views are not compared here.)',
      perspectives: [
        {
          id: 'creation:ps:days:calendar',
          tradition: 'Calendar-day (24-hour) view',
          label: 'Six ordinary days',
          summary:
            'The days are ordinary days marked by evening and morning. Supporters say this is the most natural reading of the text and the one its first audience would have understood, that it best preserves Scripture’s clarity and the historicity of Genesis 1–3, and that it is confirmed by the Sabbath commandment grounded in God’s six days of work (Exod 20:11). The report notes that the view is commonly, though not always, linked with a young earth, and that interpreters such as Basil, Ambrose, Bede and Calvin took the days as normal days.',
          representatives: ['calvin'],
          keyTexts: [v('GEN', 1, 5), v('EXO', 20, 8, 11)],
          provenance: summaryOf(cite('pca-creation-study-report', 'Calendar Day interpretation; historical survey', PCA_URL)),
        },
        {
          id: 'creation:ps:days:day-age',
          tradition: 'Day-age view',
          label: 'Each day a long age',
          summary:
            'The six days are sequential periods of indefinite length, as “day” (yôm) can mean elsewhere in Scripture, including Genesis 2:4. Supporters note that the seventh day has no closing “evening and morning” and continues (Heb 4:1–11). The view was held in the Old Princeton tradition and by later Reformed theologians, and it does not require rejecting conventional geology and cosmology.',
          representatives: ['charles-hodge', 'bb-warfield'],
          keyTexts: [v('GEN', 2, 4), v('HEB', 4, 1, 11)],
          provenance: summaryOf(cite('pca-creation-study-report', 'Day-Age interpretation', PCA_URL)),
        },
        {
          id: 'creation:ps:days:framework',
          tradition: 'Framework view',
          label: 'A literary framework',
          summary:
            'The week is a figurative framework: Moses arranged God’s real, historical creative acts topically rather than chronologically, with days 1–3 (the realms of creation) paralleled by days 4–6 (their rulers), so that Israel’s working week and Sabbath would mirror God’s. Supporters argue that Genesis 2:5–6 assumes God preserved plants by ordinary providence, which fits an unspecified span of time. Meredith Kline and Mark Futato are leading proponents.',
          keyTexts: [v('GEN', 2, 5, 6), { book: 'GEN', startChapter: 1, startVerse: 1, endChapter: 2, endVerse: 3 }],
          provenance: summaryOf(cite('pca-creation-study-report', 'Framework interpretation', PCA_URL)),
        },
        {
          id: 'creation:ps:days:analogical',
          tradition: 'Analogical-days view',
          label: 'God’s workdays, analogous to ours',
          summary:
            'On this view the creation days are God’s own working days: they correspond to ours by analogy rather than identity, and they model the human rhythm of work and rest. They follow one another broadly in order but are of unstated length; Genesis 1:1–2 describes creation out of nothing and the state of the earth before the first day; and the account does not aim to tell us how long creation took. The report traces this reading to W. G. T. Shedd, Franz Delitzsch and Herman Bavinck.',
          keyTexts: [v('GEN', 1, 1, 2), v('EXO', 20, 11)],
          provenance: summaryOf(cite('pca-creation-study-report', 'Analogical Days interpretation', PCA_URL)),
        },
      ],
      commonGround:
        'The committee members, while differing on the days, agreed that Genesis 1–3 is true history rather than myth; that God created the heavens and the earth out of nothing; that Adam and Eve were real persons specially created as the parents of humanity; that the fall was historical; and that naturalism cannot be reconciled with Christian faith. The report also examines the original intent of the Westminster Confession’s phrase “in the space of six days” (4.1). It notes two current readings of the Assembly’s intent, as six calendar days or as a real sequence of unspecified length, which agree that the phrase at least excludes Augustine’s instantaneous creation.',
      tags: ['genesis 1', 'creation days', 'age of the earth', 'interpretation'],
      provenance: synthesis(
        cite('pca-creation-study-report', 'Introductory Statement; Background', PCA_URL),
        cite('westminster-confession', 'ch. 4.1', WCF_URL),
        cite('bsb', 'Gen 1:1–2:3'),
        cite('bsb', 'Exod 20:11'),
      ),
    },
  ],
  suggestedQuestions: [
    'What does the creation account teach about God and the world?',
    'What is the Hebrew word behind “image”?',
    'How was Christ involved in creation?',
    'How should the six days of creation be understood?',
    'What does the Bible say about caring for creation?',
  ],
  sources,
};

export default topic;
