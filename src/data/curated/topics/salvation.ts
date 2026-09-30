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

const WCF_URL = 'https://www.opc.org/wcf.html';
const DORT_URL = 'https://www.crcna.org/welcome/beliefs/confessions/canons-dort';
const REMONSTRANCE_URL = 'https://archive.org/details/creedschristendo03scha';
const METHODIST_URL = 'https://www.umc.org/en/content/articles-of-religion';
const TRENT6_URL = 'https://history.hanover.edu/texts/trent/ct06.html';
const AUGSBURG_XII_URL = 'https://bookofconcord.org/augsburg-confession/of-repentance/';
const FORMULA_XI_URL = 'https://bookofconcord.org/epitome/election/';
const CLARKE_HEB6_URL = 'https://bible.helloao.org/api/c/adam-clarke/HEB/6.json';
const ARMINIUS_WORKS_1_URL = 'https://archive.org/details/worksofjamesarmi01armi';

const sources: Source[] = [
  {
    id: 'arminius-works-nichols-vol1',
    type: 'book',
    title: 'The Works of James Arminius, vol. 1',
    authorIds: ['jacobus-arminius'],
    year: '1853',
    publisher: 'Derby, Miller and Orton, Auburn and Buffalo',
    url: ARMINIUS_WORKS_1_URL,
    edition:
      'Trans. James Nichols (Auburn and Buffalo: Derby, Miller and Orton, 1853), vol. 1; includes the Declaration of Sentiments, delivered before the States of Holland at The Hague on 30 October 1608',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'English translation of Arminius’s writings; in the Declaration of Sentiments he sets out his own views on predestination, grace and the perseverance of the saints.',
  },
];

const topic: CuratedTopic = {
  id: 'salvation',
  name: 'Salvation',
  aliases: [
    'salvation',
    'saved',
    'be saved',
    'being saved',
    'how to be saved',
    'how can i be saved',
    'what must i do to be saved',
    'savior',
    'saviour',
    'redemption',
    'soteriology',
    'can you lose your salvation',
    'can salvation be lost',
    'losing salvation',
    'once saved always saved',
    'eternal security',
    'perseverance of the saints',
    'falling away',
    'apostasy',
    'soteria',
  ],
  topic: {
    name: 'Salvation',
    question: 'What does the Bible say about salvation?',
    definition: text(
      'Salvation in Scripture is God’s rescue of his people—from enemies, from sin and its judgement, and finally from death. The Old Testament celebrates the LORD as the one who saves, as at the Red Sea (Exod 14:13, 30), and the prophets declare that salvation belongs to him and is offered to all the ends of the earth (Jonah 2:9; Isa 45:22). The New Testament centres it on Jesus: there is salvation in no other name (Acts 4:12), and whoever confesses him as Lord and believes God raised him will be saved (Rom 10:9–13). God saves by mercy, not because of our righteous deeds (Titus 3:4–7). Salvation also has tenses: believers have been saved, are being saved, and await a salvation ready to be revealed (Eph 2:8; 1 Cor 1:18; 1 Pet 1:5).',
      synthesis(
        cite('bsb', 'Exod 14:13–31'),
        cite('bsb', 'Jonah 2:9'),
        cite('bsb', 'Isa 45:22'),
        cite('bsb', 'Acts 4:12'),
        cite('bsb', 'Rom 10:9–13'),
        cite('bsb', 'Titus 3:4–7'),
        cite('bsb', 'Eph 2:8'),
        cite('bsb', '1 Cor 1:18'),
        cite('bsb', '1 Pet 1:3–5'),
      ),
    ),
    keyPassages: [
      {
        id: 'salvation:kp:1',
        ref: v('EXO', 14, 13, 31),
        title: 'Salvation at the sea',
        note: text(
          'Trapped at the Red Sea, Israel is told to stand firm and see the LORD’s salvation. God fights for them and brings them through on dry ground, and the people fear the LORD and believe.',
          synthesis(cite('bsb', 'Exod 14:13–31')),
        ),
        group: 'The God who saves',
        tags: ['exodus', 'deliverance', 'old testament', 'faith'],
      },
      {
        id: 'salvation:kp:2',
        ref: v('ISA', 45, 22),
        title: 'Turn to me and be saved',
        note: text(
          'The one true God calls all the ends of the earth to turn to him and be saved, because there is no other God.',
          synthesis(cite('bsb', 'Isa 45:22')),
        ),
        group: 'The God who saves',
        tags: ['nations', 'invitation', 'monotheism'],
      },
      {
        id: 'salvation:kp:3',
        ref: v('JON', 2, 9),
        title: 'Salvation is from the LORD',
        note: text(
          'From inside the great fish, Jonah ends his prayer by confessing that rescue belongs to God alone.',
          synthesis(cite('bsb', 'Jonah 2:9')),
        ),
        group: 'The God who saves',
        tags: ['jonah', 'grace', 'prayer'],
      },
      {
        id: 'salvation:kp:4',
        ref: v('ISA', 53, 4, 6),
        title: 'Pierced for our transgressions',
        note: text(
          'The Servant bears the sins of a people who have wandered like sheep, and his wounds bring their healing. The New Testament reads this chapter of Jesus (Acts 8:32–35; 1 Pet 2:24–25).',
          synthesis(cite('bsb', 'Isa 53:4–6'), cite('bsb', 'Acts 8:32–35'), cite('bsb', '1 Pet 2:24–25')),
        ),
        group: 'The God who saves',
        tags: ['servant', 'atonement', 'prophecy', 'substitution'],
      },
      {
        id: 'salvation:kp:5',
        ref: v('ROM', 10, 9, 13),
        title: 'Confess and believe',
        note: text(
          'Paul’s summary: confess Jesus as Lord and believe that God raised him, and you will be saved. The promise is for Jew and Greek alike, because everyone who calls on the Lord’s name will be saved (quoting Joel 2:32).',
          synthesis(cite('bsb', 'Rom 10:9–13'), cite('bsb', 'Joel 2:32')),
        ),
        group: 'Saved through Christ',
        tags: ['confession', 'resurrection', 'lordship', 'gentiles'],
      },
      {
        id: 'salvation:kp:6',
        ref: v('ACT', 4, 12),
        title: 'No other name',
        note: text(
          'Questioned by Jerusalem’s rulers, elders and scribes, with the high priest and his family (Acts 4:5–8), Peter declares that salvation is found in no one else but Jesus.',
          synthesis(cite('bsb', 'Acts 4:5–12')),
        ),
        group: 'Saved through Christ',
        tags: ['exclusivity', 'name of jesus', 'apostles'],
      },
      {
        id: 'salvation:kp:7',
        ref: v('ACT', 16, 30, 31),
        title: 'What must I do to be saved?',
        note: text(
          'A shaken jailer’s question receives a simple answer from Paul and Silas: believe in the Lord Jesus.',
          synthesis(cite('bsb', 'Acts 16:30–31')),
        ),
        group: 'Saved through Christ',
        tags: ['faith', 'conversion', 'household'],
      },
      {
        id: 'salvation:kp:8',
        ref: v('TIT', 3, 4, 7),
        title: 'Not by works but by mercy',
        note: text(
          'God our Saviour saved us not because of righteous deeds we had done but by his mercy, through new birth and renewal by the Holy Spirit, so that, justified by grace, we become heirs of eternal life.',
          synthesis(cite('bsb', 'Titus 3:4–7')),
        ),
        group: 'Saved through Christ',
        tags: ['mercy', 'new birth', 'holy spirit', 'justification'],
      },
      {
        id: 'salvation:kp:9',
        ref: v('JHN', 3, 16, 17),
        title: 'God sent his Son to save',
        note: text(
          'God’s love gives his Son so that believers have eternal life; the Son came not to condemn the world but to save it.',
          synthesis(cite('bsb', 'John 3:16–17')),
        ),
        group: 'Saved through Christ',
        tags: ['love of god', 'eternal life', 'believe'],
      },
      {
        id: 'salvation:kp:10',
        ref: v('PHP', 2, 12, 13),
        title: 'Work out your salvation',
        note: text(
          'Believers are to work out their salvation with fear and trembling precisely because God is at work in them, giving both the will and the power to do his good pleasure.',
          synthesis(cite('bsb', 'Phil 2:12–13')),
        ),
        group: 'Saved, being saved, awaiting salvation',
        tags: ['sanctification', 'grace', 'effort', 'perseverance'],
      },
      {
        id: 'salvation:kp:11',
        ref: v('1PE', 1, 3, 5),
        title: 'Kept for a salvation ready to be revealed',
        note: text(
          'God has given new birth into a living hope and guards believers through faith for a salvation that will be revealed at the last time.',
          synthesis(cite('bsb', '1 Pet 1:3–5')),
        ),
        group: 'Saved, being saved, awaiting salvation',
        tags: ['hope', 'inheritance', 'perseverance', 'future'],
      },
      {
        id: 'salvation:kp:12',
        ref: v('ROM', 5, 8, 10),
        title: 'Saved through his life',
        note: text(
          'Paul argues from the greater to the lesser: if Christ died for us while we were sinners and enemies, how much more will we, now reconciled, be saved from wrath through him.',
          synthesis(cite('bsb', 'Rom 5:8–10')),
        ),
        group: 'Saved, being saved, awaiting salvation',
        tags: ['reconciliation', 'wrath', 'assurance'],
      },
    ],
  },
  anchor: v('ROM', 10, 9, 13),
  perspectives: [
    {
      id: 'salvation:ps:perseverance',
      question: 'Can someone who is truly saved lose their salvation?',
      consensus: 'denominational',
      intro:
        'All the traditions below confess that salvation is God’s gracious work in Christ and that believers must continue in faith. They differ on whether someone truly justified can finally fall away, and on how Scripture’s warnings (Heb 6:4–6; 10:26–29) relate to its promises that God keeps his people (John 10:27–29; Phil 1:6).',
      perspectives: [
        {
          id: 'salvation:ps:perseverance:reformed',
          tradition: 'Reformed',
          label: 'The perseverance of the saints',
          summary:
            'Those whom God has effectually called and sanctified can neither totally nor finally fall from grace; they will certainly persevere to the end. This rests not on their free will but on God’s unchangeable election, Christ’s merit and intercession, and the abiding Spirit (Westminster 17.1–2). True believers may fall into serious sin for a time, grieve the Spirit and lose the sense of grace, but God renews them to repentance and does not let them forfeit adoption and justification (Westminster 17.3; Dort V.4–8). God preserves his people through means, including the Word’s exhortations, threats and promises (Dort V.14).',
          representatives: ['calvin', 'john-owen'],
          keyTexts: [v('JHN', 10, 27, 29), v('ROM', 8, 29, 30), v('PHP', 1, 6), v('1PE', 1, 5)],
          provenance: summaryOf(
            cite('westminster-confession', 'ch. 17', WCF_URL),
            cite('canons-of-dort-crcna-2011', 'Fifth Main Point, arts. 4–8, 14', DORT_URL),
          ),
        },
        {
          id: 'salvation:ps:perseverance:wesleyan',
          tradition: 'Arminian / Wesleyan',
          label: 'Believers can fall away',
          summary:
            'Grace can be resisted (Remonstrance, Art. 4), and Wesleyans hold that it can also be forfeited. The Remonstrants of 1610 affirmed that Christ keeps from falling those who are ready for the conflict and seek his help, but left open whether believers could, through negligence, forsake their life in Christ (Art. 5). Arminius himself had said that he never taught that a true believer can totally or finally fall away, though some passages of Scripture seemed to him to point that way (Declaration of Sentiments, 1608). The Methodist Articles of Religion teach that after receiving the Holy Spirit we may depart from grace given and fall into sin, and by God’s grace rise again (Art. XII). The Methodist commentator Adam Clarke read Hebrews 6 as showing that apostasy is possible even from the highest degrees of grace, so the warnings are real—while insisting that backsliders who still trust Christ are not in view.',
          representatives: ['wesley', 'adam-clarke'],
          keyTexts: [v('HEB', 6, 4, 6), v('HEB', 10, 26, 29), v('COL', 1, 21, 23), v('2PE', 2, 20, 22)],
          provenance: summaryOf(
            cite('articles-of-remonstrance', 'Arts. 4–5', REMONSTRANCE_URL),
            cite('arminius-works-nichols-vol1', 'Declaration of Sentiments (1608), §V “The Perseverance of the Saints”, p. 254', ARMINIUS_WORKS_1_URL),
            cite('methodist-articles-of-religion', 'Art. XII', METHODIST_URL),
            cite('adam-clarke-commentary', 'on Heb 6:4–6', CLARKE_HEB6_URL),
          ),
        },
        {
          id: 'salvation:ps:perseverance:catholic',
          tradition: 'Catholic',
          label: 'Grace is lost by mortal sin and restored by penance',
          summary:
            'The grace of justification is lost not only by unbelief but by any mortal sin, even when faith itself remains (Trent VI, ch. 15). Those who fall can be justified again through the sacrament of penance, which the Fathers called a second plank after the shipwreck of grace (ch. 14). No one should promise himself final perseverance with absolute certainty apart from special revelation, yet all should place a most firm hope in God, who will complete the good work he began unless people fail his grace (ch. 13; canons 16, 23).',
          keyTexts: [v('PHP', 2, 12, 13), v('1CO', 6, 9, 10), v('1CO', 10, 12)],
          provenance: summaryOf(cite('council-of-trent-session-6', 'chs. 13–15; canons 16, 23', TRENT6_URL)),
        },
        {
          id: 'salvation:ps:perseverance:lutheran',
          tradition: 'Lutheran',
          label: 'The Spirit can be lost; the penitent are restored',
          summary:
            'The Augsburg Confession condemns those who deny that people once justified can lose the Holy Spirit, and teaches that whoever falls after baptism receives forgiveness whenever they return in repentance (Art. XII). At the same time the Formula of Concord presents election in Christ as a firm comfort: no one can pluck God’s elect out of Christ’s hand, and believers should look for assurance in the gospel and the sacraments rather than in God’s hidden counsel (Epitome XI).',
          representatives: ['luther'],
          keyTexts: [v('JHN', 10, 28), v('1CO', 10, 12)],
          provenance: summaryOf(
            cite('augsburg-confession', 'Art. XII', AUGSBURG_XII_URL),
            cite('formula-of-concord', 'Epitome, Art. XI', FORMULA_XI_URL),
          ),
        },
      ],
      commonGround:
        'All agree that salvation is God’s gift in Christ, that believers must continue in faith, that serious sin wounds the believer and grieves the Spirit, and that those who have fallen may be restored through repentance.',
      tags: ['perseverance', 'assurance', 'apostasy', 'eternal security', 'warning passages'],
      provenance: synthesis(
        cite('westminster-confession', 'ch. 17', WCF_URL),
        cite('canons-of-dort-crcna-2011', 'Fifth Main Point', DORT_URL),
        cite('articles-of-remonstrance', 'Art. 5', REMONSTRANCE_URL),
        cite('methodist-articles-of-religion', 'Art. XII', METHODIST_URL),
        cite('council-of-trent-session-6', 'chs. 13–15', TRENT6_URL),
        cite('augsburg-confession', 'Art. XII', AUGSBURG_XII_URL),
        cite('bsb', 'Heb 6:4–6'),
        cite('bsb', 'John 10:27–29'),
      ),
    },
  ],
  suggestedQuestions: [
    'What must I do to be saved?',
    'Can a Christian lose their salvation?',
    'How do the warning passages fit with God’s promise to keep his people?',
    'What does it mean to “work out your salvation”?',
    'Is salvation past, present or future?',
    'What is the Greek word behind “saved”?',
  ],
  sources,
};

export default topic;
