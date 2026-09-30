import type { CuratedTopic, PassageRef } from '../../../domain/models';
import { cite, synthesis, text } from '../../../domain/provenance';

/** Verse range within one chapter. */
const v = (book: string, chapter: number, from: number, to: number = from): PassageRef => ({
  book,
  startChapter: chapter,
  startVerse: from,
  endChapter: chapter,
  endVerse: to,
});

/** A whole chapter. */
const ch = (book: string, chapter: number): PassageRef => ({ book, startChapter: chapter });

const topic: CuratedTopic = {
  id: 'love',
  name: 'Love',
  aliases: [
    'love',
    'god’s love',
    "god's love",
    'gods love',
    'love of god',
    'god is love',
    'what is love',
    'loving others',
    'love one another',
    'love your neighbor',
    'love your neighbour',
    'love your enemies',
    'the greatest commandment',
    'charity',
    'loving devotion',
    'steadfast love',
    'what does the bible say about love',
    'agape',
    'agapē',
    'hesed',
    'chesed',
  ],
  topic: {
    name: 'Love',
    question: 'What does the Bible say about love?',
    definition: text(
      'Love begins with God, who reveals himself as merciful and gracious, rich in covenant love and faithfulness (Exod 34:6–7); the Hebrew ḥesed (BSB “loving devotion”) is glossed “kindness” in the STEPBible lexicon. John says that God is love and defines love by God’s action in sending his Son as an atoning sacrifice for our sins (1 John 4:8–10; Rom 5:8). Human love answers God’s: the greatest commandments are to love God wholly and one’s neighbour as oneself (Deut 6:5; Lev 19:18; Mark 12:28–34), and love fulfils the law (Rom 13:10). Jesus extends it to enemies (Matt 5:43–48) and makes his own love the measure (John 13:34). The Greek agapē (verb agapaō) is the usual word, but not in itself a special word for divine love: the same verb describes people loving the darkness (John 3:19), so context shows love’s depth.',
      synthesis(
        cite('bsb', 'Exod 34:6–7'),
        cite('bsb', '1 John 4:8–10'),
        cite('bsb', 'Rom 5:8'),
        cite('bsb', 'Deut 6:5'),
        cite('bsb', 'Lev 19:18'),
        cite('bsb', 'Mark 12:28–34'),
        cite('bsb', 'Rom 13:10'),
        cite('bsb', 'Matt 5:43–48'),
        cite('bsb', 'John 13:34'),
        cite('bsb', 'John 3:19'),
        cite('stepbible-tbesh', 'H2617A חֶסֶד'),
        cite('stepbible-tahot', 'Exod 34:6'),
        cite('stepbible-tbesg', 'G0026 ἀγάπη; G0025 ἀγαπάω'),
        cite('stepbible-tagnt', 'John 3:19 (ἠγάπησαν, G0025)'),
      ),
    ),
    keyPassages: [
      {
        id: 'love:kp:1',
        ref: v('EXO', 34, 6, 7),
        title: 'Abounding in loving devotion',
        note: text(
          'After Israel’s idolatry with the golden calf, God proclaims his name to Moses: merciful, gracious, rich in covenant love, forgiving—yet not ignoring guilt. Later Scripture echoes this self-description again and again (e.g. Ps 103:8; Joel 2:13).',
          synthesis(
            cite('bsb', 'Exod 32:1–6'),
            cite('bsb', 'Exod 34:1–7'),
            cite('bsb', 'Ps 103:8'),
            cite('bsb', 'Joel 2:13'),
          ),
        ),
        group: 'God’s love',
        tags: ['hesed', 'character of god', 'forgiveness', 'old testament'],
      },
      {
        id: 'love:kp:2',
        ref: v('1JN', 4, 7, 21),
        title: 'God is love',
        note: text(
          'John grounds Christian love in God’s nature and in his sending of the Son. Love brought to maturity leaves no room for fear, and a claim to love God that ignores a brother is a lie.',
          synthesis(cite('bsb', '1 John 4:7–21')),
        ),
        group: 'God’s love',
        tags: ['god is love', 'atonement', 'brotherly love', 'fear'],
      },
      {
        id: 'love:kp:3',
        ref: v('ROM', 5, 6, 8),
        title: 'While we were still sinners',
        note: text(
          'God proves his love in that Christ died for the ungodly—not for the deserving, but for sinners.',
          synthesis(cite('bsb', 'Rom 5:6–8')),
        ),
        group: 'God’s love',
        tags: ['cross', 'grace', 'undeserved'],
      },
      {
        id: 'love:kp:4',
        ref: v('ROM', 8, 35, 39),
        title: 'Nothing can separate us',
        note: text(
          'Paul lists every threat—hardship, persecution, death, spiritual powers—and concludes that nothing in all creation can separate believers from God’s love in Christ Jesus.',
          synthesis(cite('bsb', 'Rom 8:35–39')),
        ),
        group: 'God’s love',
        tags: ['assurance', 'suffering', 'security'],
      },
      {
        id: 'love:kp:5',
        ref: v('DEU', 6, 4, 5),
        title: 'Love the LORD your God',
        note: text(
          'Israel’s confession of the one LORD leads straight to the command to love him with all one’s heart, soul and strength.',
          synthesis(cite('bsb', 'Deut 6:4–5')),
        ),
        group: 'The great commandments',
        tags: ['shema', 'love for god', 'covenant'],
      },
      {
        id: 'love:kp:6',
        ref: v('LEV', 19, 17, 18),
        title: 'Love your neighbour as yourself',
        note: text(
          'In a chapter of practical holiness, Israel is told not to hate, take revenge or bear a grudge but to love one’s neighbour as oneself; the same chapter extends this love to the foreigner (19:34).',
          synthesis(cite('bsb', 'Lev 19:17–18'), cite('bsb', 'Lev 19:33–34')),
        ),
        group: 'The great commandments',
        tags: ['neighbour', 'holiness', 'foreigner', 'law'],
      },
      {
        id: 'love:kp:7',
        ref: v('MRK', 12, 28, 34),
        title: 'The greatest commandment',
        note: text(
          'Asked which commandment is most important, Jesus joins Deuteronomy 6:5 and Leviticus 19:18 as the first and second, and the scribe agrees they matter more than all sacrifices.',
          synthesis(cite('bsb', 'Mark 12:28–34')),
        ),
        group: 'The great commandments',
        tags: ['commandments', 'jesus', 'law'],
      },
      {
        id: 'love:kp:8',
        ref: v('ROM', 13, 8, 10),
        title: 'Love fulfils the law',
        note: text(
          'Every commandment about neighbours is summed up in the command to love, because love does no wrong to a neighbour.',
          synthesis(cite('bsb', 'Rom 13:8–10')),
        ),
        group: 'The great commandments',
        tags: ['law', 'ethics', 'paul'],
      },
      {
        id: 'love:kp:9',
        ref: ch('1CO', 13),
        title: 'The way of love',
        note: text(
          'Written to a gifted but divided church in the middle of Paul’s teaching on spiritual gifts (1 Cor 12–14), this portrait shows that without love even spectacular gifts are nothing, and that love outlasts them all.',
          synthesis(cite('bsb', '1 Cor 13'), cite('bsb', '1 Cor 12:31; 14:1')),
        ),
        group: 'Love in practice',
        tags: ['spiritual gifts', 'character', 'church', 'patience'],
      },
      {
        id: 'love:kp:10',
        ref: v('JHN', 13, 34, 35),
        title: 'As I have loved you',
        note: text(
          'Jesus gives a new commandment: love one another as he has loved you. This love is the mark by which everyone will recognise his disciples.',
          synthesis(cite('bsb', 'John 13:34–35')),
        ),
        group: 'Love in practice',
        tags: ['new commandment', 'discipleship', 'witness'],
      },
      {
        id: 'love:kp:11',
        ref: v('LUK', 10, 25, 37),
        title: 'The Good Samaritan',
        note: text(
          'Asked to define “neighbour,” Jesus tells of a despised Samaritan who showed mercy to a wounded stranger, and turns the question into who acted as a neighbour.',
          synthesis(cite('bsb', 'Luke 10:25–37')),
        ),
        group: 'Love in practice',
        tags: ['neighbour', 'mercy', 'parable', 'samaritan'],
      },
      {
        id: 'love:kp:12',
        ref: v('MAT', 5, 43, 48),
        title: 'Love your enemies',
        note: text(
          'Jesus calls his followers to love their enemies and pray for their persecutors, imitating the Father who sends sun and rain on the evil and the good.',
          synthesis(cite('bsb', 'Matt 5:43–48')),
        ),
        group: 'Love in practice',
        tags: ['enemies', 'sermon on the mount', 'perfection'],
      },
    ],
  },
  anchor: ch('1CO', 13),
  suggestedQuestions: [
    'What is the Greek word for love in 1 Corinthians 13?',
    'What does “God is love” mean?',
    'Who is my neighbour?',
    'How can I love my enemies?',
    'Explain 1 Corinthians 13 verse by verse.',
  ],
};

export default topic;
