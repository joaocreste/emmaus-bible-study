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

const AUGSBURG_IV_URL = 'https://bookofconcord.org/augsburg-confession/of-justification/';
const WCF_URL = 'https://www.opc.org/wcf.html';
const TRENT6_URL = 'https://history.hanover.edu/texts/trent/ct06.html';
const WRIGHT_LECTURE_URL = 'https://ntwrightpage.com/2016/07/12/new-perspectives-on-paul/';
const JDDJ_URL =
  'https://www.christianunity.va/content/unitacristiani/en/dialoghi/sezione-occidentale/luterani/dialogo/documenti-di-dialogo/1999-dichiarazione-congiunta-sulla-dottrina-della-giustificazion/en.html';
const LWF_JDDJ_URL = 'https://lutheranworld.org/what-we-do/unity-church/joint-declaration-doctrine-justification-jddj';

const sources: Source[] = [
  {
    id: 'wright-new-perspectives-on-paul',
    type: 'lecture',
    title: 'New Perspectives on Paul',
    authorIds: ['nt-wright'],
    year: '2003',
    publisher: 'Tenth Edinburgh Dogmatics Conference',
    url: WRIGHT_LECTURE_URL,
    edition:
      'Lecture delivered at the Tenth Edinburgh Dogmatics Conference, Rutherford House, Edinburgh (25–28 August 2003); printed in Bruce L. McCormack (ed.), Justification in Perspective: Historical Developments and Contemporary Challenges (Grand Rapids: Baker Academic; Edinburgh: Rutherford House, 2006); text posted on NTWrightPage, 12 July 2016',
    license: { status: 'copyrighted', name: '© N. T. Wright', usage: 'summary-only' },
    description: 'A lecture in which Wright sets out, for a Reformed audience, where he agrees and disagrees with the New Perspective and how he understands justification.',
  },
];

const topic: CuratedTopic = {
  id: 'justification',
  name: 'Justification',
  aliases: [
    'justification',
    'justified',
    'justify',
    'justification by faith',
    'justified by faith',
    'justification by faith alone',
    'faith alone',
    'sola fide',
    'imputed righteousness',
    'imputation',
    'declared righteous',
    'righteousness of god',
    'right with god',
    'how can i be right with god',
    'new perspective on paul',
    'new perspective',
    'dikaioo',
    'dikaiosyne',
  ],
  topic: {
    name: 'Justification',
    question: 'What does the Bible mean by justification?',
    definition: text(
      'Justification is God’s act of putting a person in the right with himself. In the New Testament the Greek verb dikaioō chiefly means to declare or pronounce righteous, as a judge does. The Old Testament roots are Abraham, whose trust God counted as righteousness (Gen 15:6), and the prophetic word that the righteous will live by faith (Hab 2:4). Paul’s central statement is Romans 3:21–26: God’s righteousness is revealed apart from the law through faith in Jesus Christ; sinners are justified freely by grace through the redemption in Christ, whom God presented as an atoning sacrifice, so that God is both just and the one who justifies. Justification brings peace with God (Rom 5:1), and James insists that justifying faith is never barren (Jas 2:14–26). Christians differ over whether justification is this verdict alone or also includes inner renewal.',
      synthesis(
        cite('stepbible-tbesg', 'G1344 δικαιόω'),
        cite('stepbible-tagnt', 'Rom 3:24, 26'),
        cite('bsb', 'Gen 15:6'),
        cite('bsb', 'Hab 2:4'),
        cite('bsb', 'Rom 3:21–26'),
        cite('bsb', 'Rom 5:1'),
        cite('bsb', 'Jas 2:14–26'),
      ),
    ),
    keyPassages: [
      {
        id: 'justification:kp:1',
        ref: v('GEN', 15, 6),
        title: 'Abram believed the LORD',
        note: text(
          'Abram’s trust in God’s promise is counted to him as righteousness—the verse Paul makes the pattern of justification (Rom 4:3; Gal 3:6).',
          synthesis(cite('bsb', 'Gen 15:6'), cite('bsb', 'Rom 4:3'), cite('bsb', 'Gal 3:6')),
        ),
        group: 'Counted righteous',
        tags: ['abraham', 'faith', 'reckoning', 'old testament'],
      },
      {
        id: 'justification:kp:2',
        ref: v('PSA', 32, 1, 2),
        title: 'Sin not counted',
        note: text(
          'David’s blessing on those whose sins are forgiven and whose iniquity the LORD does not count against them is Paul’s second witness for justification apart from works (Rom 4:6–8).',
          synthesis(cite('bsb', 'Ps 32:1–2'), cite('bsb', 'Rom 4:6–8')),
        ),
        group: 'Counted righteous',
        tags: ['forgiveness', 'david', 'psalms', 'reckoning'],
      },
      {
        id: 'justification:kp:3',
        ref: v('HAB', 2, 4),
        title: 'The righteous will live by faith',
        note: text(
          'Habakkuk contrasts the proud with the righteous one who lives by faithfulness; Paul quotes the line in Romans 1:17 and Galatians 3:11.',
          synthesis(cite('bsb', 'Hab 2:4'), cite('bsb', 'Rom 1:17'), cite('bsb', 'Gal 3:11')),
        ),
        group: 'Counted righteous',
        tags: ['faith', 'prophets', 'quotation'],
      },
      {
        id: 'justification:kp:4',
        ref: v('ZEC', 3, 1, 5),
        title: 'Filthy garments removed',
        note: text(
          'In Zechariah’s vision the LORD rebukes the accuser, strips the high priest of his filthy clothes and dresses him in splendid robes, saying that he has taken away his iniquity—a vivid picture of guilt removed by God.',
          synthesis(cite('bsb', 'Zech 3:1–5')),
        ),
        group: 'Counted righteous',
        tags: ['vision', 'accuser', 'clothing', 'forgiveness'],
      },
      {
        id: 'justification:kp:5',
        ref: v('ROM', 3, 21, 28),
        title: 'God’s righteousness revealed',
        note: text(
          'Apart from the law, God’s righteousness comes through faith in Jesus Christ to all who believe. Sinners are justified freely by grace through Christ’s atoning sacrifice, which shows God to be both just and the one who justifies, and leaves no room for boasting.',
          synthesis(cite('bsb', 'Rom 3:21–28')),
        ),
        group: 'Justified by faith in Christ',
        tags: ['righteousness of god', 'atonement', 'grace', 'faith'],
      },
      {
        id: 'justification:kp:6',
        ref: v('ROM', 4, 1, 8),
        title: 'Abraham and David',
        note: text(
          'Paul argues that Abraham was not justified by works and that God justifies the ungodly who trust him, crediting righteousness apart from works.',
          synthesis(cite('bsb', 'Rom 4:1–8')),
        ),
        group: 'Justified by faith in Christ',
        tags: ['abraham', 'works', 'ungodly', 'credit'],
      },
      {
        id: 'justification:kp:7',
        ref: v('ROM', 5, 1, 11),
        title: 'Peace with God',
        note: text(
          'Justified through faith, believers have peace with God, access to grace and hope of glory; having been justified by Christ’s blood, they will be saved from wrath through him.',
          synthesis(cite('bsb', 'Rom 5:1–11')),
        ),
        group: 'Justified by faith in Christ',
        tags: ['peace', 'reconciliation', 'hope', 'assurance'],
      },
      {
        id: 'justification:kp:8',
        ref: v('GAL', 2, 15, 21),
        title: 'Not by works of the law',
        note: text(
          'After confronting Peter for withdrawing from table fellowship with Gentiles (2:11–14), Paul insists that Jews and Gentiles alike are justified by faith in Christ, not by works of the law.',
          synthesis(cite('bsb', 'Gal 2:11–21')),
        ),
        group: 'Justified by faith in Christ',
        tags: ['works of the law', 'gentiles', 'table fellowship', 'peter'],
      },
      {
        id: 'justification:kp:9',
        ref: v('PHP', 3, 7, 11),
        title: 'A righteousness not my own',
        note: text(
          'Paul counts his former credentials as loss in order to be found in Christ, not with a righteousness of his own from the law but with the righteousness from God that comes through faith.',
          synthesis(cite('bsb', 'Phil 3:7–11')),
        ),
        group: 'Justified by faith in Christ',
        tags: ['righteousness', 'union with christ', 'paul'],
      },
      {
        id: 'justification:kp:10',
        ref: v('2CO', 5, 17, 21),
        title: 'The righteousness of God in him',
        note: text(
          'God reconciled the world to himself in Christ, not counting people’s trespasses against them, and made the sinless one to be sin for us so that in him we might become the righteousness of God.',
          synthesis(cite('bsb', '2 Cor 5:17–21')),
        ),
        group: 'Justified by faith in Christ',
        tags: ['reconciliation', 'exchange', 'new creation'],
      },
      {
        id: 'justification:kp:11',
        ref: v('JAS', 2, 14, 26),
        title: 'Faith and works',
        note: text(
          'James opposes a dead, merely verbal faith: Abraham’s faith worked with his actions and was completed by them. Christians reconcile James and Paul in different ways, but both describe a faith that lives.',
          synthesis(cite('bsb', 'Jas 2:14–26')),
        ),
        group: 'Faith that is never alone',
        tags: ['works', 'james', 'abraham', 'living faith'],
      },
      {
        id: 'justification:kp:12',
        ref: v('LUK', 18, 9, 14),
        title: 'The tax collector went home justified',
        note: text(
          'Jesus declares justified not the self-assured Pharisee but the tax collector who beat his breast and pleaded for mercy.',
          synthesis(cite('bsb', 'Luke 18:9–14')),
        ),
        group: 'Faith that is never alone',
        tags: ['humility', 'mercy', 'parable', 'prayer'],
      },
    ],
  },
  anchor: v('ROM', 3, 21, 26),
  perspectives: [
    {
      id: 'justification:ps:nature',
      question: 'What happens when God justifies a sinner—a declared status, an inner renewal, or recognition as a member of God’s people?',
      consensus: 'denominational',
      intro:
        'Justification was a central dispute of the Reformation. Catholics and Protestants alike teach that justification is God’s gracious work in Christ, received by faith and never earned, but they differ on its nature. Since the late twentieth century the “New Perspective on Paul,” associated with E. P. Sanders and J. D. G. Dunn, has reframed the discussion; N. T. Wright is a prominent voice in it, though he says he disagrees with most who share the label. In 1999 the Lutheran World Federation and the Catholic Church signed a Joint Declaration recording a consensus on basic truths while acknowledging remaining differences.',
      perspectives: [
        {
          id: 'justification:ps:nature:reformation',
          tradition: 'Lutheran and Reformed',
          label: 'Righteousness imputed through faith alone',
          summary:
            'People cannot be justified before God by their own strength, merits or works, but are freely justified for Christ’s sake through faith, when they believe that their sins are forgiven for his sake; this faith God counts as righteousness (Augsburg Confession, Art. IV). The Westminster Confession spells out that what is imputed is not faith itself, the act of believing, but Christ’s obedience and satisfaction, which faith receives: God justifies not by infusing righteousness into sinners but by pardoning their sins and accepting them as righteous for Christ’s sake alone. Faith is the only instrument of justification, yet it is never alone in the justified person but works by love (Westminster 11.1–2).',
          representatives: ['luther', 'calvin', 'john-owen'],
          keyTexts: [v('ROM', 3, 21, 28), v('ROM', 4, 1, 8), v('2CO', 5, 21), v('PHP', 3, 9)],
          provenance: summaryOf(
            cite('augsburg-confession', 'Art. IV', AUGSBURG_IV_URL),
            cite('westminster-confession', 'ch. 11.1–2', WCF_URL),
          ),
        },
        {
          id: 'justification:ps:nature:catholic',
          tradition: 'Catholic',
          label: 'Justification includes inner renewal',
          summary:
            'Justification is not the remission of sins merely but also the sanctification and renewal of the inner person through the voluntary reception of grace. Christ’s passion is its meritorious cause; its formal cause is the justice of God by which he makes us just, so that we are not only reckoned but truly are just, as charity is poured into our hearts by the Holy Spirit (Trent VI, ch. 7). Trent therefore rejected justification by the sole imputation of Christ’s justice to the exclusion of inherent grace and charity (canon 11), and taught that the justice received is increased through good works (canon 24).',
          representatives: ['aquinas'],
          keyTexts: [v('ROM', 5, 5), v('TIT', 3, 5, 7), v('GAL', 5, 6), v('JAS', 2, 24)],
          provenance: summaryOf(cite('council-of-trent-session-6', 'ch. 7; canons 11, 24', TRENT6_URL)),
        },
        {
          id: 'justification:ps:nature:new-perspective',
          tradition: 'New Perspective on Paul (N. T. Wright)',
          label: 'God’s verdict that a person belongs to his covenant family',
          summary:
            'Wright reads “the righteousness of God” as God’s own covenant faithfulness. Justification is God’s declaration that a person is in the right—that their sins are forgiven and that they belong to the single family promised to Abraham. The present verdict, given to those who believe that Jesus is Lord and that God raised him, anticipates the future verdict, which Wright says will be given on the basis of the whole life lived in the power of the Spirit. Wright accepts that God reckons righteousness to believers but denies that this is Christ’s own righteousness; union with Christ does the work traditionally assigned to imputation. Because justification concerns who belongs, Wright calls it an ecumenical doctrine: in Galatians 2 it is about Jewish and Gentile believers sharing one table (Gal 2:11–21; Rom 3:29).',
          representatives: ['nt-wright'],
          keyTexts: [v('GAL', 2, 11, 21), v('ROM', 3, 29, 30), v('ROM', 2, 13), v('ROM', 4, 16, 17)],
          provenance: summaryOf(cite('wright-new-perspectives-on-paul', undefined, WRIGHT_LECTURE_URL)),
        },
      ],
      commonGround:
        'In the 1999 Joint Declaration, the Lutheran World Federation and the Catholic Church confessed together that justification is the work of the triune God: sinners are accepted not for any merit of their own but by grace, through faith in what Christ has done, and receive the renewing Holy Spirit, who leads them into good works (§15). They judged that the Lutheran teaching it presents does not fall under Trent’s condemnations, nor the Catholic teaching under the Lutheran ones (§41), while naming questions that still need clarification (§43). The Methodist (2006), Anglican (2016) and Reformed (2017) world communions later affirmed it; Lutheran and Reformed churches outside these communions are not parties to it.',
      tags: ['justification', 'imputation', 'faith alone', 'new perspective', 'reformation', 'ecumenism'],
      provenance: synthesis(
        cite('joint-declaration-justification', '§§15, 40–41, 43', JDDJ_URL),
        cite('lwf-jddj', 'Milestones', LWF_JDDJ_URL),
        cite('augsburg-confession', 'Art. IV', AUGSBURG_IV_URL),
        cite('council-of-trent-session-6', 'ch. 7', TRENT6_URL),
        cite('wright-new-perspectives-on-paul', undefined, WRIGHT_LECTURE_URL),
      ),
    },
  ],
  suggestedQuestions: [
    'What is the Greek word behind “justified”?',
    'How do Paul and James fit together on justification?',
    'What is imputed righteousness?',
    'What is the New Perspective on Paul?',
    'Are there different theological interpretations of justification?',
  ],
  sources,
};

export default topic;
