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
const CE_TRINITY_URL = 'https://www.newadvent.org/cathen/15047a.htm';
const CE_FILIOQUE_URL = 'https://www.newadvent.org/cathen/06073a.htm';
const AUTOLYCUS_URL = 'https://www.newadvent.org/fathers/02042.htm';
const DE_TRINITATE_XV_URL = 'https://www.newadvent.org/fathers/130115.htm';
const DAMASCENE_I_URL = 'https://www.newadvent.org/fathers/33041.htm';
const AQUINAS_Q36_URL = 'https://www.newadvent.org/summa/1036.htm';
const WCF_URL = 'https://www.opc.org/wcf.html';
const METHODIST_URL = 'https://www.umc.org/en/content/articles-of-religion';
const DOSITHEUS_URL = 'https://archive.org/details/actsdecreesofsyn00orth';

const sources: Source[] = [
  {
    id: 'catholic-encyclopedia-trinity',
    type: 'encyclopedia',
    title: 'The Blessed Trinity (The Catholic Encyclopedia, vol. 15)',
    authorIds: [],
    year: '1912',
    publisher: 'Robert Appleton Company',
    url: CE_TRINITY_URL,
    edition: 'Article by G. H. Joyce, via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'A detailed early-twentieth-century Catholic survey of the doctrine of the Trinity and its history.',
  },
  {
    id: 'catholic-encyclopedia-filioque',
    type: 'encyclopedia',
    title: 'Filioque (The Catholic Encyclopedia, vol. 6)',
    authorIds: [],
    year: '1909',
    publisher: 'Robert Appleton Company',
    url: CE_FILIOQUE_URL,
    edition: 'Article by A. Maas, via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'A Catholic account (written from a Western standpoint) of the doctrine and history of the Filioque, including its insertion into the creed.',
  },
  {
    id: 'theophilus-to-autolycus',
    type: 'book',
    title: 'To Autolycus',
    authorIds: ['theophilus-of-antioch'],
    year: '2nd century',
    url: AUTOLYCUS_URL,
    edition: 'Trans. Marcus Dods, Ante-Nicene Fathers, vol. 2, via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'An apology for the Christian faith addressed to a pagan friend; Book II contains the earliest surviving use of trias (“Trinity”) for God.',
  },
  {
    id: 'augustine-de-trinitate',
    type: 'book',
    title: 'On the Trinity (De Trinitate)',
    authorIds: ['augustine'],
    year: 'c. 400–420',
    url: DE_TRINITATE_XV_URL,
    edition: 'Trans. Arthur West Haddan, Nicene and Post-Nicene Fathers, 1st series, vol. 3 (1887), via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'Augustine’s fifteen-book study of the Trinity, the most influential Western treatment of the doctrine.',
  },
];

const authors: Author[] = [
  {
    id: 'theophilus-of-antioch',
    name: 'Theophilus of Antioch',
    era: 'early-church',
    tradition: 'Greek Church Father',
    description: 'Second-century bishop of Antioch and apologist, author of the three books To Autolycus.',
    aliases: ['theophilus', 'theophilus of antioch'],
  },
  {
    id: 'photius',
    name: 'Photius I of Constantinople',
    lifespan: 'c. 815–893',
    era: 'medieval',
    tradition: 'Eastern Orthodox',
    description:
      'Patriarch of Constantinople and scholar who rejected the Western teaching that the Spirit proceeds from the Son and opposed adding the Filioque to the creed.',
    aliases: ['photius', 'photios', 'st photius'],
  },
];

const topic: CuratedTopic = {
  id: 'trinity',
  name: 'The Trinity',
  aliases: [
    'trinity',
    'the trinity',
    'holy trinity',
    'the holy trinity',
    'triune god',
    'triune',
    'three in one',
    'god in three persons',
    'father son and holy spirit',
    'father, son and holy spirit',
    'what is the trinity',
    'doctrine of the trinity',
    'is the trinity in the bible',
    'filioque',
    'procession of the holy spirit',
    'trias',
  ],
  topic: {
    name: 'The Trinity',
    question: 'What does the Bible teach about the Trinity?',
    definition: text(
      'The doctrine of the Trinity confesses one God who exists eternally as Father, Son and Holy Spirit. The word itself is not in the Bible—the Greek trias first appears in surviving writings around AD 180, in Theophilus of Antioch—but it names a pattern Scripture sets out. Israel confessed that the LORD is one (Deut 6:4), and the New Testament keeps that confession (1 Cor 8:4–6). Yet it speaks of the Word who was with God and was God (John 1:1), of the Spirit as another Advocate sent from the Father (John 14:16–17, 26), and of baptism into the one name of the Father, the Son and the Holy Spirit (Matt 28:19). At Jesus’ baptism the Father speaks and the Spirit descends (Matt 3:16–17). The creed of 381 gave this faith its classic confession.',
      synthesis(
        cite('bsb', 'Deut 6:4'),
        cite('bsb', '1 Cor 8:4–6'),
        cite('bsb', 'John 1:1'),
        cite('bsb', 'John 14:16–17, 26'),
        cite('bsb', 'Matt 28:19'),
        cite('bsb', 'Matt 3:16–17'),
        cite('catholic-encyclopedia-trinity', 'on the term trias', CE_TRINITY_URL),
        cite('theophilus-to-autolycus', 'Book II, ch. 15', AUTOLYCUS_URL),
        cite('nicene-creed-percival', 'Creed of Constantinople (381)', CREED_381_URL),
      ),
    ),
    keyPassages: [
      {
        id: 'trinity:kp:1',
        ref: v('DEU', 6, 4, 5),
        title: 'The LORD is one',
        note: text(
          'Israel’s daily confession of the one LORD remains the starting point of Christian teaching about God; Jesus himself calls it the most important commandment (Mark 12:29–30).',
          synthesis(cite('bsb', 'Deut 6:4–5'), cite('bsb', 'Mark 12:29–30')),
        ),
        group: 'One God',
        tags: ['shema', 'monotheism', 'old testament'],
      },
      {
        id: 'trinity:kp:2',
        ref: v('ISA', 44, 6),
        title: 'I am the first and the last',
        note: text(
          'The LORD declares that there is no God besides him. Revelation later puts the title “the First and the Last” on the lips of the risen Christ (Rev 1:17; 22:13).',
          synthesis(cite('bsb', 'Isa 44:6'), cite('bsb', 'Rev 1:17'), cite('bsb', 'Rev 22:13')),
        ),
        group: 'One God',
        tags: ['monotheism', 'divine titles', 'christ'],
      },
      {
        id: 'trinity:kp:3',
        ref: v('1CO', 8, 4, 6),
        title: 'One God, the Father, and one Lord, Jesus Christ',
        note: text(
          'Paul restates Israel’s confession of one God around Father and Son: one God, the Father, from whom are all things, and one Lord, Jesus Christ, through whom are all things.',
          synthesis(cite('bsb', '1 Cor 8:4–6')),
        ),
        group: 'One God',
        tags: ['monotheism', 'christology', 'creation', 'paul'],
      },
      {
        id: 'trinity:kp:4',
        ref: v('MAT', 3, 16, 17),
        title: 'The baptism of Jesus',
        note: text(
          'At the Jordan the Son is baptised, the Spirit descends on him like a dove, and the Father’s voice declares his love—a scene the church has long read as a revelation of the three persons.',
          synthesis(cite('bsb', 'Matt 3:16–17')),
        ),
        group: 'Father, Son and Spirit revealed',
        tags: ['baptism', 'father', 'son', 'spirit'],
      },
      {
        id: 'trinity:kp:5',
        ref: v('JHN', 1, 1, 3),
        title: 'The Word was God',
        note: text(
          'The Word is both with God and is God, the one through whom all things were made; this Word became flesh (1:14).',
          synthesis(cite('bsb', 'John 1:1–3'), cite('bsb', 'John 1:14')),
        ),
        group: 'Father, Son and Spirit revealed',
        tags: ['logos', 'deity of christ', 'creation'],
      },
      {
        id: 'trinity:kp:6',
        ref: v('JHN', 14, 15, 26),
        title: 'Another Advocate',
        note: text(
          'Jesus promises another Advocate, the Spirit of truth, whom the Father will send in his name; Father and Son will make their home with those who love him (14:23).',
          synthesis(cite('bsb', 'John 14:15–26')),
        ),
        group: 'Father, Son and Spirit revealed',
        tags: ['holy spirit', 'advocate', 'indwelling'],
      },
      {
        id: 'trinity:kp:7',
        ref: v('JHN', 15, 26),
        title: 'Who proceeds from the Father',
        note: text(
          'Jesus will send the Spirit of truth from the Father, and the Spirit proceeds from the Father. The verse lies at the centre of the later East–West debate over the Filioque.',
          synthesis(cite('bsb', 'John 15:26'), cite('catholic-encyclopedia-filioque', 'on John 15:26', CE_FILIOQUE_URL)),
        ),
        group: 'Father, Son and Spirit revealed',
        tags: ['procession', 'filioque', 'holy spirit'],
      },
      {
        id: 'trinity:kp:8',
        ref: v('PHP', 2, 5, 11),
        title: 'In the form of God',
        note: text(
          'Christ, existing in the form of God, humbled himself to the cross. God then gives him the name above every name, and the scene of every knee bowing echoes the LORD’s own words in Isaiah 45:23.',
          synthesis(cite('bsb', 'Phil 2:5–11'), cite('bsb', 'Isa 45:23')),
        ),
        group: 'Father, Son and Spirit revealed',
        tags: ['christology', 'incarnation', 'exaltation', 'lordship'],
      },
      {
        id: 'trinity:kp:9',
        ref: v('MAT', 28, 18, 20),
        title: 'Baptised into one name',
        note: text(
          'The risen Jesus sends his disciples to make disciples of all nations, baptising them in the name—singular—of the Father and of the Son and of the Holy Spirit.',
          synthesis(cite('bsb', 'Matt 28:18–20')),
        ),
        group: 'Trinitarian life and worship',
        tags: ['great commission', 'baptism', 'name'],
      },
      {
        id: 'trinity:kp:10',
        ref: v('2CO', 13, 14),
        title: 'Grace, love and fellowship',
        note: text(
          'Paul’s closing blessing joins the grace of the Lord Jesus Christ, the love of God and the fellowship of the Holy Spirit.',
          synthesis(cite('bsb', '2 Cor 13:14')),
        ),
        group: 'Trinitarian life and worship',
        tags: ['benediction', 'worship', 'paul'],
      },
      {
        id: 'trinity:kp:11',
        ref: v('GAL', 4, 4, 6),
        title: 'God sent his Son … and the Spirit of his Son',
        note: text(
          'The Father sends the Son to redeem and then sends the Spirit of his Son into believers’ hearts, so that they call God “Abba, Father.”',
          synthesis(cite('bsb', 'Gal 4:4–6')),
        ),
        group: 'Trinitarian life and worship',
        tags: ['adoption', 'redemption', 'spirit of the son'],
      },
      {
        id: 'trinity:kp:12',
        ref: v('1PE', 1, 1, 2),
        title: 'Chosen, sanctified, sprinkled',
        note: text(
          'Peter describes salvation as the work of the Father’s foreknowledge, the Spirit’s sanctifying and obedience to Jesus Christ and sprinkling with his blood.',
          synthesis(cite('bsb', '1 Pet 1:1–2')),
        ),
        group: 'Trinitarian life and worship',
        tags: ['election', 'sanctification', 'salvation'],
      },
    ],
  },
  anchor: v('MAT', 28, 18, 20),
  perspectives: [
    {
      id: 'trinity:ps:filioque',
      question: 'Does the Holy Spirit proceed from the Father alone, or from the Father and the Son (the Filioque)?',
      consensus: 'denominational',
      intro:
        'Faith in one God in three persons is shared by Orthodox, Catholic and historic Protestant churches, and all confess the creed of 381, which in its original form says that the Spirit proceeds from the Father. Western churches later added “and the Son” (Latin filioque): it appears first to have been sung in Spain after the Third Council of Toledo (589); after the Council of Aachen (809) Pope Leo III approved the doctrine but advised leaving the word out of the creed; and most scholars date its adoption at Rome to the early eleventh century. It became a lasting point of division between East and West, and the reunion attempted at Florence (1439) did not hold.',
      perspectives: [
        {
          id: 'trinity:ps:filioque:western',
          tradition: 'Catholic and Western Protestant',
          label: 'From the Father and the Son',
          summary:
            'Augustine taught that the Spirit proceeds principally from the Father, who in begetting the Son gave him that the Spirit should proceed from him too; so the Spirit is the Spirit of both (De Trinitate XV.17.29; XV.26.47). Aquinas argued that unless the Spirit is from the Son, the two could not be personally distinguished (Summa I q.36 a.2). Western theology points to texts in which the Spirit is called the Spirit of the Son and is sent by the Son (Gal 4:6; John 15:26; 16:14–15). The Catholic Church defined the doctrine at Lyons (1274) and Florence (1439), and Protestant confessions such as the Westminster Confession (2.3) and the Methodist Articles (Art. IV) retained it.',
          representatives: ['augustine', 'aquinas'],
          keyTexts: [v('GAL', 4, 6), v('JHN', 16, 13, 15), v('ROM', 8, 9)],
          provenance: summaryOf(
            cite('augustine-de-trinitate', 'XV.17.29; XV.26.47', DE_TRINITATE_XV_URL),
            cite('aquinas-summa-theologiae', 'I, q. 36, a. 2', AQUINAS_Q36_URL),
            cite('catholic-encyclopedia-filioque', 'dogmatic meaning', CE_FILIOQUE_URL),
            cite('westminster-confession', 'ch. 2.3', WCF_URL),
            cite('methodist-articles-of-religion', 'Art. IV', METHODIST_URL),
          ),
        },
        {
          id: 'trinity:ps:filioque:orthodox',
          tradition: 'Eastern Orthodox',
          label: 'From the Father alone, given through the Son',
          summary:
            'The Father alone is the cause and source within the Godhead: the Son is begotten of him and the Spirit proceeds from him, as John 15:26 and the creed of 381 say. John of Damascus will not say that the Spirit is from the Son, yet he calls him the Spirit of the Son, revealed and imparted to us through the Son, and speaks of the Spirit as proceeding from the Father through the Son (Exposition I.8, I.12). In the ninth century Patriarch Photius rejected the procession from the Son and opposed inserting the word into the creed, and Eastern critics objected that adding to the shared creed disregarded the councils’ ban on composing another creed (Ephesus, 431). The Confession of Dositheus (1672) confesses the Spirit as proceeding from the Father.',
          representatives: ['john-of-damascus', 'photius'],
          keyTexts: [v('JHN', 15, 26), v('JHN', 14, 26)],
          provenance: summaryOf(
            cite('john-of-damascus-exposition', 'Book I, chs. 8 and 12', DAMASCENE_I_URL),
            cite('catholic-encyclopedia-filioque', 'historical importance', CE_FILIOQUE_URL),
            cite('confession-of-dositheus', 'Decree I', DOSITHEUS_URL),
            cite('nicene-creed-percival', 'Creed of Constantinople (381)', CREED_381_URL),
          ),
        },
      ],
      commonGround:
        'Both sides confess one God in three co-equal, co-eternal persons, both acknowledge the Father as the source of the Son and the Spirit, and both confess the creed of 381 (the West with the added clause). The dispute concerns how the Spirit’s eternal origin relates to the Son, and who may change a creed the whole church shares.',
      tags: ['filioque', 'procession', 'holy spirit', 'east and west', 'nicene creed'],
      provenance: synthesis(
        cite('nicene-creed-percival', 'Creed of Constantinople (381)', CREED_381_URL),
        cite('catholic-encyclopedia-filioque', undefined, CE_FILIOQUE_URL),
        cite('augustine-de-trinitate', 'XV.26.47', DE_TRINITATE_XV_URL),
        cite('john-of-damascus-exposition', 'Book I, ch. 8', DAMASCENE_I_URL),
        cite('bsb', 'John 15:26'),
      ),
    },
  ],
  suggestedQuestions: [
    'Is the Trinity taught in the Bible?',
    'Where do we see Father, Son and Spirit together in Scripture?',
    'What is the Filioque controversy?',
    'How can God be one and three?',
    'How does the New Testament speak of the Son as God?',
  ],
  sources,
  authors,
};

export default topic;
