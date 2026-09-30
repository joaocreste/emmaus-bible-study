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

const TRENT24_URL = 'https://history.hanover.edu/texts/trent/ct24.html';
const DOSITHEUS_URL = 'https://archive.org/details/actsdecreesofsyn00orth';
const OCA_MARRIAGE_URL = 'https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-sacraments/marriage';
const WCF_URL = 'https://www.opc.org/wcf.html';
const METHODIST_URL = 'https://www.umc.org/en/content/articles-of-religion';
const APOLOGY_XIII_URL = 'https://bookofconcord.org/defense/of-the-number-and-use-of-sacraments/';
const CLEMENTINE_EPH5_URL = 'https://bible.helloao.org/api/lat_clv/EPH/5.json';

const sources: Source[] = [
  {
    id: 'council-of-trent-session-24',
    type: 'confession',
    title: 'Council of Trent, Session XXIV: Doctrine on the Sacrament of Matrimony',
    authorIds: [],
    year: '1563',
    url: TRENT24_URL,
    edition: 'Trans. J. Waterworth (London: Dolman, 1848), via Hanover Historical Texts Project',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'The Catholic Church’s decree on marriage, celebrated on 11 November 1563, with a doctrinal preface and twelve canons.',
  },
  {
    id: 'oca-orthodox-faith-marriage',
    type: 'website',
    title: 'The Orthodox Faith, vol. II: Worship — “Marriage”',
    authorIds: ['thomas-hopko'],
    year: '1981',
    publisher: 'Orthodox Church in America',
    url: OCA_MARRIAGE_URL,
    edition:
      'Thomas Hopko, The Orthodox Faith, vol. II: Worship (Department of Religious Education, Orthodox Church in America; © 1981), as published on the OCA website',
    license: {
      status: 'copyrighted',
      name: '© 1981 Department of Religious Education, Orthodox Church in America',
      usage: 'summary-only',
    },
    description: 'A catechetical explanation of the Orthodox sacrament of marriage published by the Orthodox Church in America.',
  },
  {
    id: 'apology-augsburg-confession',
    type: 'confession',
    title: 'Apology of the Augsburg Confession',
    authorIds: ['philip-melanchthon'],
    year: '1531',
    url: 'https://bookofconcord.org/defense/',
    edition: 'English text of the Triglot Concordia (1921), via BookOfConcord.org',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'Philip Melanchthon’s defence of the Augsburg Confession against its Catholic critics; part of the Lutheran Book of Concord.',
  },
];

const authors: Author[] = [
  {
    id: 'philip-melanchthon',
    name: 'Philip Melanchthon',
    lifespan: '1497–1560',
    era: 'reformation',
    tradition: 'Lutheran',
    description: 'Wittenberg scholar and Luther’s closest colleague; author of the Augsburg Confession (1530) and its Apology (1531).',
    aliases: ['melanchthon', 'philip melanchthon', 'philipp melanchthon'],
  },
  {
    id: 'thomas-hopko',
    name: 'Thomas Hopko',
    lifespan: '1939–2015',
    era: 'contemporary',
    tradition: 'Eastern Orthodox (Orthodox Church in America)',
    description:
      'Protopresbyter of the Orthodox Church in America, professor of dogmatic theology and dean of St Vladimir’s Orthodox Theological Seminary; author of the four-volume catechetical series The Orthodox Faith.',
    aliases: ['hopko', 'thomas hopko'],
    url: 'https://www.oca.org/orthodoxy/the-orthodox-faith',
  },
];

const topic: CuratedTopic = {
  id: 'marriage',
  name: 'Marriage',
  aliases: [
    'marriage',
    'married',
    'marry',
    'getting married',
    'husband',
    'wife',
    'husbands and wives',
    'spouse',
    'wedding',
    'one flesh',
    'divorce',
    'matrimony',
    'holy matrimony',
    'christian marriage',
    'is marriage a sacrament',
    'sacrament of marriage',
    'singleness',
    'what does the bible say about marriage',
  ],
  topic: {
    name: 'Marriage',
    question: 'What does the Bible say about marriage?',
    definition: text(
      'Scripture presents marriage as a gift from creation: a covenant union of a man and a woman in which the two become one flesh (Gen 2:18–25). The man is not meant to be alone, and the woman is made as a fitting partner. Asked about divorce, Jesus returns to this “beginning”: what God has joined, no one should separate (Matt 19:3–9). Malachi calls a wife a partner by covenant, with the LORD as witness (Mal 2:14), and Hosea uses marriage to picture God’s faithful love for unfaithful Israel (Hos 2:14–20). Paul calls husbands to love as Christ loved the church and calls the one-flesh union a profound mystery about Christ and his church (Eph 5:21–33). Marriage is to be honoured by all (Heb 13:4), yet singleness is also a gift, freeing undivided devotion to the Lord (1 Cor 7:7, 32–35).',
      synthesis(
        cite('bsb', 'Gen 2:18–25'),
        cite('bsb', 'Matt 19:3–9'),
        cite('bsb', 'Mal 2:14'),
        cite('bsb', 'Hos 2:14–20'),
        cite('bsb', 'Eph 5:21–33'),
        cite('bsb', 'Heb 13:4'),
        cite('bsb', '1 Cor 7:7, 32–35'),
      ),
    ),
    keyPassages: [
      {
        id: 'marriage:kp:1',
        ref: v('GEN', 1, 26, 28),
        title: 'Male and female in God’s image',
        note: text(
          'Humanity, male and female together, bears God’s image and receives the blessing to be fruitful and to rule the earth.',
          synthesis(cite('bsb', 'Gen 1:26–28')),
        ),
        group: 'Marriage in creation',
        tags: ['image of god', 'creation', 'male and female', 'blessing'],
      },
      {
        id: 'marriage:kp:2',
        ref: v('GEN', 2, 18, 25),
        title: 'It is not good to be alone',
        note: text(
          'God forms the woman as a suitable helper for the man; a man leaves his parents and is united to his wife, and the two become one flesh without shame.',
          synthesis(cite('bsb', 'Gen 2:18–25')),
        ),
        group: 'Marriage in creation',
        tags: ['one flesh', 'companionship', 'creation', 'leave and cleave'],
      },
      {
        id: 'marriage:kp:3',
        ref: v('MAT', 19, 3, 9),
        title: 'What God has joined together',
        note: text(
          'Asked about divorce, Jesus goes back to creation: marriage is God’s joining of two into one, and Moses’ permission to divorce reflected hardness of heart rather than God’s design.',
          synthesis(cite('bsb', 'Matt 19:3–9')),
        ),
        group: 'Marriage in creation',
        tags: ['divorce', 'jesus', 'creation', 'permanence'],
      },
      {
        id: 'marriage:kp:4',
        ref: v('MAL', 2, 13, 16),
        title: 'Your wife by covenant',
        note: text(
          'Malachi rebukes men who break faith with the wives of their youth: the LORD was witness to their marriage covenant. The Hebrew of 2:16 is difficult, and the BSB notes an alternative rendering.',
          synthesis(cite('bsb', 'Mal 2:13–16'), cite('bsb', 'Mal 2:16, footnote')),
        ),
        group: 'Marriage in creation',
        tags: ['covenant', 'faithfulness', 'divorce', 'prophets'],
      },
      {
        id: 'marriage:kp:5',
        ref: v('SNG', 8, 6, 7),
        title: 'Love as strong as death',
        note: text(
          'The Song of Songs celebrates committed love as fierce, exclusive and beyond price—waters cannot quench it and wealth cannot buy it.',
          synthesis(cite('bsb', 'Song 8:6–7')),
        ),
        group: 'Love and faithfulness',
        tags: ['love', 'poetry', 'desire', 'commitment'],
      },
      {
        id: 'marriage:kp:6',
        ref: v('PRO', 5, 15, 19),
        title: 'Rejoice in the wife of your youth',
        note: text(
          'After warning against the forbidden woman (5:1–14), the father commends delight and faithfulness within marriage.',
          synthesis(cite('bsb', 'Prov 5:1–19')),
        ),
        group: 'Love and faithfulness',
        tags: ['faithfulness', 'wisdom', 'adultery', 'delight'],
      },
      {
        id: 'marriage:kp:7',
        ref: v('1CO', 7, 1, 7),
        title: 'Mutual belonging',
        note: text(
          'Paul gives husband and wife equal claims on each other’s bodies and counsels against deprivation, while also calling singleness a gift from God.',
          synthesis(cite('bsb', '1 Cor 7:1–7')),
        ),
        group: 'Love and faithfulness',
        tags: ['sexuality', 'mutuality', 'singleness', 'paul'],
      },
      {
        id: 'marriage:kp:8',
        ref: v('HEB', 13, 4),
        title: 'Honour marriage',
        note: text(
          'Marriage is to be honoured by all and the marriage bed kept undefiled, because God will judge sexual immorality and adultery.',
          synthesis(cite('bsb', 'Heb 13:4')),
        ),
        group: 'Love and faithfulness',
        tags: ['purity', 'honour', 'adultery'],
      },
      {
        id: 'marriage:kp:9',
        ref: v('EPH', 5, 21, 33),
        title: 'Christ and the church',
        note: text(
          'After the call to submit to one another out of reverence for Christ (5:21), Paul calls wives to submit and husbands to love sacrificially as Christ loved the church, and calls the one-flesh union a great mystery about Christ and the church. Christians interpret its language of headship and submission in different ways.',
          synthesis(cite('bsb', 'Eph 5:21–33')),
        ),
        group: 'Marriage and the gospel',
        tags: ['christ and the church', 'mystery', 'headship', 'love', 'submission'],
      },
      {
        id: 'marriage:kp:10',
        ref: v('HOS', 2, 14, 20),
        title: 'I will betroth you to me forever',
        note: text(
          'God pledges to win back unfaithful Israel and to betroth her to himself in righteousness, love and faithfulness—marriage as a picture of God’s covenant.',
          synthesis(cite('bsb', 'Hos 2:14–20')),
        ),
        group: 'Marriage and the gospel',
        tags: ['covenant', 'faithfulness', 'god as husband', 'prophets'],
      },
      {
        id: 'marriage:kp:11',
        ref: v('REV', 19, 6, 9),
        title: 'The marriage supper of the Lamb',
        note: text(
          'History ends with a wedding: the church, clothed in fine linen that is the righteous acts of the saints, is the bride of the Lamb.',
          synthesis(cite('bsb', 'Rev 19:6–9')),
        ),
        group: 'Marriage and the gospel',
        tags: ['eschatology', 'bride', 'lamb', 'celebration'],
      },
    ],
  },
  anchor: v('GEN', 2, 18, 25),
  perspectives: [
    {
      id: 'marriage:ps:sacrament',
      question: 'Is marriage a sacrament?',
      consensus: 'denominational',
      intro:
        'All Christians honour marriage as instituted by God and blessed by Christ. They differ over whether it is a sacrament in the same sense as baptism and the Lord’s Supper—a rite through which God gives grace. Much turns on Ephesians 5:32, where Paul calls the one-flesh union a great mystery (Greek mystērion), rendered sacramentum in the Latin Vulgate.',
      perspectives: [
        {
          id: 'marriage:ps:sacrament:catholic',
          tradition: 'Catholic',
          label: 'One of the seven sacraments',
          summary:
            'The Council of Trent taught that Christ merited by his passion the grace that perfects natural love, confirms the indissoluble union and sanctifies the spouses, pointing to Paul’s words about Christ and the church (Eph 5:25, 32). Because marriage under the gospel excels the marriages of old in grace, the Fathers, councils and tradition have always numbered it among the sacraments; Trent condemned the view that matrimony is not truly one of the seven sacraments instituted by Christ and does not confer grace (Session XXIV, doctrine and canon 1).',
          keyTexts: [v('EPH', 5, 25, 32), v('MAT', 19, 4, 6)],
          provenance: summaryOf(cite('council-of-trent-session-24', 'doctrine; canon 1', TRENT24_URL)),
        },
        {
          id: 'marriage:ps:sacrament:orthodox',
          tradition: 'Eastern Orthodox',
          label: 'A holy mystery of the Church',
          summary:
            'The Confession of Dositheus counts marriage among the seven mysteries of the Church: Christ set his seal on it when he forbade anyone to separate those whom God has joined, and the Apostle calls it a great mystery (Decree XV; Matt 19:6; Eph 5:32). Orthodox catechesis describes the sacrament as the gift of the Holy Spirit so that a couple’s love is fulfilled in the Kingdom of God; the couple are crowned, and the rite is not a legal contract and contains no vows (Orthodox Church in America).',
          keyTexts: [v('MAT', 19, 6), v('EPH', 5, 32)],
          provenance: summaryOf(
            cite('confession-of-dositheus', 'Decree XV', DOSITHEUS_URL),
            cite('oca-orthodox-faith-marriage', undefined, OCA_MARRIAGE_URL),
          ),
        },
        {
          id: 'marriage:ps:sacrament:protestant',
          tradition: 'Protestant (Reformed, Methodist, Lutheran)',
          label: 'A holy ordinance, not a sacrament of the gospel',
          summary:
            'The Westminster Confession recognises only two sacraments ordained by Christ, baptism and the Lord’s Supper (27.4), and treats marriage as an ordinance of God for mutual help, the increase of mankind and the prevention of impurity (24.2). The Methodist Articles (from the Anglican Articles) do not count matrimony among the sacraments of the gospel, grouping it with rites that have partly grown out of a corrupt following of the apostles and are partly “states of life allowed in the Scriptures” (Art. XVI). Melanchthon’s Apology notes that marriage was instituted at creation and has God’s command and promises for this bodily life; if anyone wishes to call it a sacrament, it must still be distinguished from the signs of the New Testament (Art. XIII).',
          representatives: ['luther', 'calvin', 'philip-melanchthon'],
          keyTexts: [v('GEN', 2, 24), v('HEB', 13, 4)],
          provenance: summaryOf(
            cite('westminster-confession', 'chs. 24.2, 27.4', WCF_URL),
            cite('methodist-articles-of-religion', 'Art. XVI', METHODIST_URL),
            cite('apology-augsburg-confession', 'Art. XIII (VII)', APOLOGY_XIII_URL),
          ),
        },
      ],
      commonGround:
        'All three traditions ground marriage in God’s institution at creation and in Christ’s teaching (Gen 2:24; Matt 19:4–6), call it holy, and see in it an image of Christ’s love for the church (Eph 5:25–32).',
      tags: ['sacrament', 'mystery', 'ephesians 5', 'matrimony', 'grace'],
      provenance: synthesis(
        cite('council-of-trent-session-24', 'doctrine; canon 1', TRENT24_URL),
        cite('confession-of-dositheus', 'Decree XV', DOSITHEUS_URL),
        cite('westminster-confession', 'chs. 24, 27', WCF_URL),
        cite('apology-augsburg-confession', 'Art. XIII', APOLOGY_XIII_URL),
        cite('clementine-vulgate', 'Eph 5:32', CLEMENTINE_EPH5_URL),
        cite('stepbible-tagnt', 'Eph 5:32 (G3466 μυστήριον)'),
        cite('bsb', 'Eph 5:32'),
      ),
    },
  ],
  suggestedQuestions: [
    'What is the Hebrew word behind “helper”?',
    'What did Jesus teach about divorce?',
    'How does Paul connect marriage with Christ and the church?',
    'Is marriage a sacrament?',
    'What does the Bible say about singleness?',
  ],
  sources,
  authors,
};

export default topic;
