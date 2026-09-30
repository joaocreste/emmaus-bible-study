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

const topic: CuratedTopic = {
  id: 'wealth',
  name: 'Wealth & Possessions',
  aliases: [
    'wealth',
    'money',
    'riches',
    'rich',
    'the rich',
    'possessions',
    'material possessions',
    'greed',
    'covetousness',
    'love of money',
    'generosity',
    'giving',
    'contentment',
    'poverty',
    'the poor',
    'materialism',
    'mammon',
    'is it wrong to be rich',
    'what does the bible say about wealth',
    'what does the bible say about money',
  ],
  topic: {
    name: 'Wealth & Possessions',
    question: 'What does the Bible say about wealth?',
    definition: text(
      'Scripture treats wealth as both gift and danger. Everything belongs to God, and the power to gain wealth comes from him (1 Chr 29:11–14; Deut 8:17–18); enjoying the fruit of one’s work is itself God’s gift (Eccl 5:18–19). Yet riches easily breed pride and forgetfulness of God (Deut 8:11–14), never satisfy (Eccl 5:10), and compete for the heart: Jesus warns that no one can serve both God and money and that life does not consist in possessions (Matt 6:19–24; Luke 12:15). Paul calls the love of money a root of all kinds of evil, commends contentment, and charges the rich to be generous (1 Tim 6:6–19). The Law insists on open-handed care for the poor (Deut 15:7–11), and the gospel roots generosity in Christ, who became poor for our sake (2 Cor 8:9).',
      synthesis(
        cite('bsb', '1 Chr 29:11–14'),
        cite('bsb', 'Deut 8:11–18'),
        cite('bsb', 'Eccl 5:10–20'),
        cite('bsb', 'Matt 6:19–24'),
        cite('bsb', 'Luke 12:15'),
        cite('bsb', '1 Tim 6:6–19'),
        cite('bsb', 'Deut 15:7–11'),
        cite('bsb', '2 Cor 8:9'),
      ),
    ),
    keyPassages: [
      {
        id: 'wealth:kp:1',
        ref: v('DEU', 8, 11, 18),
        title: 'Remember the LORD your God',
        note: text(
          'Moses warns that prosperity can make the heart proud and forgetful of the God who rescued Israel; the power to gain wealth is his gift, not the product of one’s own strength.',
          synthesis(cite('bsb', 'Deut 8:11–18')),
        ),
        group: 'Wealth as gift and test',
        tags: ['pride', 'gratitude', 'prosperity', 'old testament'],
      },
      {
        id: 'wealth:kp:2',
        ref: v('1CH', 29, 10, 14),
        title: 'Everything comes from you',
        note: text(
          'After the people give freely toward building God’s house, David confesses that all riches come from God, so that giving simply returns to God what is already his.',
          synthesis(cite('bsb', '1 Chr 29:1–14')),
        ),
        group: 'Wealth as gift and test',
        tags: ['stewardship', 'giving', 'worship'],
      },
      {
        id: 'wealth:kp:3',
        ref: v('PRO', 30, 7, 9),
        title: 'Neither poverty nor riches',
        note: text(
          'Agur prays for enough: not so much that he forgets God, and not so little that he steals and dishonours God’s name.',
          synthesis(cite('bsb', 'Prov 30:7–9')),
        ),
        group: 'Wealth as gift and test',
        tags: ['contentment', 'prayer', 'wisdom'],
      },
      {
        id: 'wealth:kp:4',
        ref: v('ECC', 5, 10, 20),
        title: 'The lover of money is never satisfied',
        note: text(
          'The Teacher exposes the emptiness of hoarding and the sleeplessness of the rich, yet calls the ability to enjoy one’s work and possessions a gift from God.',
          synthesis(cite('bsb', 'Eccl 5:10–20')),
        ),
        group: 'Wealth as gift and test',
        tags: ['satisfaction', 'enjoyment', 'wisdom'],
      },
      {
        id: 'wealth:kp:5',
        ref: v('MAT', 6, 19, 24),
        title: 'Treasure in heaven',
        note: text(
          'Where your treasure is, your heart will be. Jesus presents God and money as rival masters: no one can serve both.',
          synthesis(cite('bsb', 'Matt 6:19–24')),
        ),
        group: 'Jesus on money',
        tags: ['treasure', 'heart', 'masters', 'sermon on the mount'],
      },
      {
        id: 'wealth:kp:6',
        ref: v('LUK', 12, 13, 21),
        title: 'The rich fool',
        note: text(
          'Warning against every form of greed, Jesus tells of a man who built bigger barns for himself but was not rich toward God, and whose life was demanded of him that night.',
          synthesis(cite('bsb', 'Luke 12:13–21')),
        ),
        group: 'Jesus on money',
        tags: ['greed', 'parable', 'death', 'security'],
      },
      {
        id: 'wealth:kp:7',
        ref: v('MRK', 10, 17, 27),
        title: 'The rich man who ran to Jesus',
        note: text(
          'Jesus looks at a sincere rich man with love and asks him to sell everything and follow him (Matthew calls him a young man, Matt 19:20). His sad departure prompts the saying about a camel and the eye of a needle—and the assurance that with God all things are possible.',
          synthesis(cite('bsb', 'Mark 10:17–27'), cite('bsb', 'Matt 19:20–22')),
        ),
        group: 'Jesus on money',
        tags: ['discipleship', 'cost', 'salvation', 'impossibility'],
      },
      {
        id: 'wealth:kp:8',
        ref: v('LUK', 16, 19, 31),
        title: 'The rich man and Lazarus',
        note: text(
          'A parable of reversal: a rich man who ignored the beggar at his gate finds after death a great chasm fixed between them, and learns that Moses and the Prophets were warning enough.',
          synthesis(cite('bsb', 'Luke 16:19–31')),
        ),
        group: 'Jesus on money',
        tags: ['poor', 'judgement', 'parable', 'reversal'],
      },
      {
        id: 'wealth:kp:9',
        ref: v('1TI', 6, 6, 19),
        title: 'Godliness with contentment',
        note: text(
          'Paul warns that the desire to be rich ensnares and that the love of money is a root of all kinds of evil; he charges the rich not to hope in uncertain wealth but in God, and to be generous and ready to share.',
          synthesis(cite('bsb', '1 Tim 6:6–19')),
        ),
        group: 'Contentment and generosity',
        tags: ['contentment', 'love of money', 'generosity', 'hope'],
      },
      {
        id: 'wealth:kp:10',
        ref: v('DEU', 15, 7, 11),
        title: 'Open your hand',
        note: text(
          'Israel must not harden its heart or close its hand against a poor brother, but give generously and without grudging.',
          synthesis(cite('bsb', 'Deut 15:7–11')),
        ),
        group: 'Contentment and generosity',
        tags: ['poor', 'justice', 'law', 'generosity'],
      },
      {
        id: 'wealth:kp:11',
        ref: v('2CO', 9, 6, 11),
        title: 'God loves a cheerful giver',
        note: text(
          'Paul encourages generous, uncoerced giving, trusting God to supply enough for every good work and to turn generosity into thanksgiving. He grounds it in Christ, who though rich became poor for our sake (8:9).',
          synthesis(cite('bsb', '2 Cor 9:6–11'), cite('bsb', '2 Cor 8:9')),
        ),
        group: 'Contentment and generosity',
        tags: ['giving', 'grace', 'thanksgiving', 'generosity'],
      },
      {
        id: 'wealth:kp:12',
        ref: v('JAS', 5, 1, 6),
        title: 'Wages withheld',
        note: text(
          'James denounces rich people who hoarded wealth and cheated their labourers; the harvesters’ cries have reached the Lord of Hosts.',
          synthesis(cite('bsb', 'Jas 5:1–6')),
        ),
        group: 'Contentment and generosity',
        tags: ['injustice', 'workers', 'judgement'],
      },
    ],
  },
  anchor: v('1TI', 6, 6, 19),
  suggestedQuestions: [
    'Is wealth a sin?',
    'What is the Greek word behind “love of money”?',
    'What did Jesus mean by “you cannot serve both God and money”?',
    'Does the Bible say money is the root of all evil?',
    'How does the Bible teach generosity?',
    'Explain the parable of the rich fool.',
  ],
};

export default topic;
