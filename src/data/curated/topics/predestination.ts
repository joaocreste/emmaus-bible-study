import type { CuratedTopic, PassageRef } from '../../../domain/models';
import { cite, summaryOf, synthesis, text } from '../../../domain/provenance';

/** Verse range within one chapter. */
const v = (book: string, chapter: number, from: number, to: number = from): PassageRef => ({
  book,
  startChapter: chapter,
  startVerse: from,
  endChapter: chapter,
  endVerse: to,
});

const WCF_URL = 'https://www.opc.org/wcf.html';
const DORT_URL = 'https://www.crcna.org/welcome/beliefs/confessions/canons-dort';
const REMONSTRANCE_URL = 'https://archive.org/details/creedschristendo03scha';
const FORMULA_XI_URL = 'https://bookofconcord.org/epitome/election/';
const TRENT6_URL = 'https://history.hanover.edu/texts/trent/ct06.html';
const AQUINAS_Q23_URL = 'https://www.newadvent.org/summa/1023.htm';
const CE_PREDESTINATION_URL = 'https://www.newadvent.org/cathen/12378a.htm';
const DAMASCENE_II_URL = 'https://www.newadvent.org/fathers/33042.htm';
const DOSITHEUS_URL = 'https://archive.org/details/actsdecreesofsyn00orth';

const topic: CuratedTopic = {
  id: 'predestination',
  name: 'Predestination & Election',
  aliases: [
    'predestination',
    'predestined',
    'predestinate',
    'election',
    'the elect',
    'elect',
    'chosen by god',
    'god’s choice',
    'unconditional election',
    'conditional election',
    'foreknowledge',
    'foreordained',
    'calvinism',
    'arminianism',
    'calvinism vs arminianism',
    'free will',
    'sovereignty and free will',
    'does god choose who is saved',
    'is everything predestined',
    'proorizo',
    'eklektos',
  ],
  topic: {
    name: 'Predestination & Election',
    question: 'What does the Bible teach about predestination?',
    definition: text(
      'Predestination is the biblical teaching that God, before the foundation of the world, chose and destined people for salvation in Christ. Paul praises the God who chose us in Christ and predestined us for adoption according to the purpose of his will (Eph 1:4–5, 11), and links foreknowledge, predestination, calling, justification and glory in one chain (Rom 8:29–30). The Greek proorizō means to predetermine or foreordain. Israel’s election rested on God’s love and his oath to the patriarchs, not on its size (Deut 7:6–8), and it received the land not for its righteousness (Deut 9:4–6). Yet Scripture also says God wants all people to be saved (1 Tim 2:4), takes no pleasure in the death of the wicked (Ezek 18:23), and grieves over those who are unwilling (Matt 23:37). Christians agree that election is gracious; they differ over its ground.',
      synthesis(
        cite('bsb', 'Eph 1:4–5, 11'),
        cite('bsb', 'Rom 8:29–30'),
        cite('bsb', 'Deut 7:6–8'),
        cite('bsb', 'Deut 9:4–6'),
        cite('bsb', '1 Tim 2:4'),
        cite('bsb', 'Ezek 18:23'),
        cite('bsb', 'Matt 23:37'),
        cite('stepbible-tbesg', 'G4309 προορίζω'),
      ),
    ),
    keyPassages: [
      {
        id: 'predestination:kp:1',
        ref: v('DEU', 7, 6, 8),
        title: 'Chosen because loved',
        note: text(
          'Israel is God’s treasured possession, chosen not because it was numerous—it was the fewest of peoples—but because the LORD loved it and kept his oath to the patriarchs.',
          synthesis(cite('bsb', 'Deut 7:6–8')),
        ),
        group: 'God’s choosing',
        tags: ['israel', 'election', 'love', 'covenant'],
      },
      {
        id: 'predestination:kp:2',
        ref: v('ROM', 9, 10, 24),
        title: 'God’s purpose in election',
        note: text(
          'Paul points to Jacob and Esau, chosen before birth, to show that God’s purpose rests on his mercy rather than on human effort, and answers the objections that this makes God unjust or removes human responsibility. The chapter is central to every tradition’s account of election.',
          synthesis(cite('bsb', 'Rom 9:10–24')),
        ),
        group: 'God’s choosing',
        tags: ['jacob and esau', 'mercy', 'sovereignty', 'romans 9'],
      },
      {
        id: 'predestination:kp:3',
        ref: v('EPH', 1, 3, 14),
        title: 'Chosen in him before the foundation of the world',
        note: text(
          'Paul praises the Father who chose believers in Christ, predestined them for adoption and sealed them with the Spirit—all to the praise of his glorious grace.',
          synthesis(cite('bsb', 'Eph 1:3–14')),
        ),
        group: 'Chosen in Christ',
        tags: ['in christ', 'adoption', 'grace', 'praise'],
      },
      {
        id: 'predestination:kp:4',
        ref: v('ROM', 8, 28, 30),
        title: 'Foreknown, predestined, called, justified, glorified',
        note: text(
          'Paul assures believers that God’s purpose runs unbroken from his foreknowledge through calling and justification to final glory, so that all things work together for their good.',
          synthesis(cite('bsb', 'Rom 8:28–30')),
        ),
        group: 'Chosen in Christ',
        tags: ['foreknowledge', 'calling', 'assurance', 'glory'],
      },
      {
        id: 'predestination:kp:5',
        ref: v('JHN', 6, 37, 44),
        title: 'All that the Father gives me will come',
        note: text(
          'Jesus says that everyone the Father gives him will come and none will be lost, and that no one can come unless the Father draws him—alongside the promise that whoever looks to the Son and believes has eternal life (6:40).',
          synthesis(cite('bsb', 'John 6:37–44')),
        ),
        group: 'Chosen in Christ',
        tags: ['drawing', 'eternal life', 'believe', 'security'],
      },
      {
        id: 'predestination:kp:6',
        ref: v('ACT', 13, 48),
        title: 'Appointed for eternal life',
        note: text(
          'When Gentiles in Pisidian Antioch hear the gospel, they rejoice, and all who were appointed for eternal life believe.',
          synthesis(cite('bsb', 'Acts 13:48'), cite('bsb', 'Acts 13:14')),
        ),
        group: 'Chosen in Christ',
        tags: ['gentiles', 'mission', 'faith'],
      },
      {
        id: 'predestination:kp:7',
        ref: v('2TH', 2, 13, 14),
        title: 'Chosen to be saved',
        note: text(
          'Paul thanks God for choosing the Thessalonians to be saved through the Spirit’s sanctifying work and their belief in the truth, and for calling them through the gospel.',
          synthesis(cite('bsb', '2 Thess 2:13–14')),
        ),
        group: 'Chosen in Christ',
        tags: ['sanctification', 'gospel', 'calling'],
      },
      {
        id: 'predestination:kp:8',
        ref: v('1PE', 1, 1, 2),
        title: 'Elect exiles',
        note: text(
          'Peter addresses scattered believers as chosen according to the foreknowledge of God the Father, through the Spirit’s sanctifying work, for obedience to Jesus Christ.',
          synthesis(cite('bsb', '1 Pet 1:1–2')),
        ),
        group: 'Chosen in Christ',
        tags: ['foreknowledge', 'exiles', 'trinity'],
      },
      {
        id: 'predestination:kp:9',
        ref: v('1TI', 2, 3, 6),
        title: 'God wants everyone to be saved',
        note: text(
          'God our Saviour desires all people to be saved and to come to the knowledge of the truth, and Christ gave himself as a ransom for all.',
          synthesis(cite('bsb', '1 Tim 2:3–6')),
        ),
        group: 'God’s desire for all',
        tags: ['universal offer', 'ransom', 'mediator'],
      },
      {
        id: 'predestination:kp:10',
        ref: v('2PE', 3, 9),
        title: 'Not wanting anyone to perish',
        note: text(
          'The Lord’s apparent delay is patience, because he does not want anyone to perish but everyone to come to repentance.',
          synthesis(cite('bsb', '2 Pet 3:9')),
        ),
        group: 'God’s desire for all',
        tags: ['patience', 'repentance', 'second coming'],
      },
      {
        id: 'predestination:kp:11',
        ref: v('EZK', 18, 23, 32),
        title: 'Turn and live',
        note: text(
          'God takes no pleasure in the death of the wicked; he answers the charge that his ways are unjust by calling Israel to turn from its transgressions and live.',
          synthesis(cite('bsb', 'Ezek 18:23–32')),
        ),
        group: 'God’s desire for all',
        tags: ['repentance', 'responsibility', 'justice of god'],
      },
      {
        id: 'predestination:kp:12',
        ref: v('MAT', 23, 37),
        title: 'You were unwilling',
        note: text(
          'Jesus grieves over Jerusalem: he longed to gather its children as a hen gathers her chicks, but they were unwilling.',
          synthesis(cite('bsb', 'Matt 23:37')),
        ),
        group: 'God’s desire for all',
        tags: ['lament', 'human will', 'jerusalem'],
      },
    ],
  },
  anchor: v('EPH', 1, 3, 14),
  perspectives: [
    {
      id: 'predestination:ps:election',
      question: 'On what basis does God choose people for salvation?',
      consensus: 'denominational',
      intro:
        'Every major tradition teaches predestination in some form, because the word is in Scripture (Rom 8:29–30; Eph 1:5, 11). The debate concerns its ground and scope: is God’s choice unconditional, or does it take account of foreseen faith? Is there a corresponding decree concerning the lost? And how does election fit with God’s desire that all be saved (1 Tim 2:4)?',
      perspectives: [
        {
          id: 'predestination:ps:election:reformed',
          tradition: 'Reformed',
          label: 'Unconditional election',
          summary:
            'Before the foundation of the world God chose particular people in Christ to everlasting glory out of his mere free grace, not because he foresaw faith, good works or perseverance in them (Westminster 3.5; Dort I.7, 9–10). Faith and holiness are the fruits of election, not its conditions (Dort I.9). The rest of mankind God was pleased to pass by and ordain to dishonour and wrath for their sin (Westminster 3.7). God is not the author of sin, and the liberty of creatures is established rather than removed (3.1). The doctrine is to be handled with special prudence, for humility and comfort, and assurance comes from seeing the fruits of election, not from prying into God’s secrets (Westminster 3.8; Dort I.12).',
          representatives: ['calvin', 'edwards', 'rc-sproul'],
          keyTexts: [v('EPH', 1, 4, 5), v('ROM', 9, 11, 16), v('JHN', 6, 37, 44), v('ACT', 13, 48)],
          provenance: summaryOf(
            cite('westminster-confession', 'ch. 3', WCF_URL),
            cite('canons-of-dort-crcna-2011', 'First Main Point, arts. 7, 9–10, 12', DORT_URL),
          ),
        },
        {
          id: 'predestination:ps:election:arminian',
          tradition: 'Arminian / Wesleyan',
          label: 'Election of believers in Christ',
          summary:
            'The Remonstrants taught that God, by an eternal and unchangeable purpose in Christ, determined to save those who through the grace of the Holy Spirit believe in his Son and persevere, and to leave the unbelieving in sin (Art. 1). Christ died for all people, though only believers enjoy forgiveness (Art. 2). No one can do any good without grace, but grace is not irresistible, since many have resisted the Holy Spirit (Art. 4; Acts 7:51). Election is thus conditioned on faith in Christ.',
          representatives: ['jacobus-arminius', 'wesley'],
          keyTexts: [v('ROM', 8, 29), v('1PE', 1, 1, 2), v('1TI', 2, 3, 6), v('ACT', 7, 51)],
          provenance: summaryOf(cite('articles-of-remonstrance', 'Arts. 1–4', REMONSTRANCE_URL)),
        },
        {
          id: 'predestination:ps:election:lutheran',
          tradition: 'Lutheran',
          label: 'Election to salvation, with no decree of reprobation',
          summary:
            'The Formula of Concord distinguishes God’s foreknowledge, which extends to all, from predestination, which concerns only God’s children and is a cause of their salvation. Election is to be sought in Christ and the gospel, not in God’s secret counsel, and God earnestly wills that all should come to him. The Formula rejects the teaching that some are ordained to condemnation without regard to their sins, and equally that anything in us is a cause of our election; those who perish do so through their own fault (Epitome XI).',
          keyTexts: [v('EPH', 1, 4), v('ROM', 8, 29, 30), v('2PE', 3, 9), v('JHN', 10, 27, 28)],
          provenance: summaryOf(cite('formula-of-concord', 'Epitome, Art. XI', FORMULA_XI_URL)),
        },
        {
          id: 'predestination:ps:election:catholic',
          tradition: 'Catholic',
          label: 'Predestination within God’s universal saving will',
          summary:
            'The Council of Trent warned that no one should presume to know for certain that he is among the predestined without special revelation, and condemned the idea that justifying grace is given only to the predestined while others are predestined to evil (Session VI, ch. 12; canons 15–17). Within these limits Catholic theologians differ: Thomists, following Aquinas, hold that God’s predestination is not caused by foreseen merits (Summa I q.23 a.5), while many Molinists hold that predestination to glory follows God’s foreknowledge of merits (Catholic Encyclopedia).',
          representatives: ['aquinas'],
          keyTexts: [v('1TI', 2, 4), v('ROM', 8, 29, 30), v('MAT', 25, 34)],
          provenance: summaryOf(
            cite('council-of-trent-session-6', 'ch. 12; canons 15–17', TRENT6_URL),
            cite('aquinas-summa-theologiae', 'I, q. 23, a. 5', AQUINAS_Q23_URL),
            cite('catholic-encyclopedia-predestination', 'Theological controversies', CE_PREDESTINATION_URL),
          ),
        },
        {
          id: 'predestination:ps:election:orthodox',
          tradition: 'Eastern Orthodox',
          label: 'Predestination according to foreknowledge',
          summary:
            'John of Damascus teaches that God knows all things beforehand but does not predetermine all: he foreknows what lies in our power without predetermining it, since he neither wills wickedness nor compels virtue (Exposition II.30). The Confession of Dositheus holds that God predestined to glory those he foreknew would rightly use their free will by co-operating with the grace offered to all, and consigned to condemnation those who would refuse; it rejects as blasphemous any teaching that makes God the cause of anyone’s condemnation without regard to their works (Decree III).',
          representatives: ['john-of-damascus'],
          keyTexts: [v('ROM', 8, 29), v('1TI', 2, 4), v('JAS', 1, 13)],
          provenance: summaryOf(
            cite('john-of-damascus-exposition', 'Book II, ch. 30', DAMASCENE_II_URL),
            cite('confession-of-dositheus', 'Decree III', DOSITHEUS_URL),
          ),
        },
      ],
      commonGround:
        'All confess that salvation is God’s gracious gift rather than a human achievement, and that God is not the author of sin. Each tradition also guards the doctrine against misuse—whether presumption, despair, or blaming God for human ruin.',
      tags: ['election', 'predestination', 'foreknowledge', 'free will', 'calvinism', 'arminianism'],
      provenance: synthesis(
        cite('westminster-confession', 'ch. 3', WCF_URL),
        cite('canons-of-dort-crcna-2011', 'First Main Point', DORT_URL),
        cite('articles-of-remonstrance', 'Arts. 1–4', REMONSTRANCE_URL),
        cite('formula-of-concord', 'Epitome, Art. XI', FORMULA_XI_URL),
        cite('council-of-trent-session-6', 'ch. 12; canon 6', TRENT6_URL),
        cite('confession-of-dositheus', 'Decree III', DOSITHEUS_URL),
        cite('bsb', 'Rom 8:29–30'),
        cite('bsb', 'Eph 1:3–14'),
      ),
    },
  ],
  suggestedQuestions: [
    'What does “predestined” mean?',
    'How do Calvinists and Arminians differ on election?',
    'If God chooses, why does Scripture say he wants everyone to be saved?',
    'What is the Greek word for “predestine”?',
    'Are there different theological interpretations of election?',
  ],
};

export default topic;
