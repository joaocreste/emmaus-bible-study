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
  id: 'forgiveness',
  name: 'Forgiveness',
  aliases: [
    'forgiveness',
    'forgive',
    'forgiving',
    'forgiven',
    'pardon',
    'how to forgive',
    'forgiving others',
    'forgive others',
    'forgive my enemies',
    'unforgiveness',
    'bitterness',
    'grudge',
    'holding a grudge',
    'does god forgive',
    'forgiveness of sins',
    'how many times should i forgive',
    'seventy times seven',
    'what does the bible say about forgiveness',
    'aphesis',
    'aphiemi',
  ],
  topic: {
    name: 'Forgiveness',
    question: 'What does the Bible say about forgiveness?',
    definition: text(
      'Forgiveness in Scripture is first something God does: he pardons iniquity, removes transgressions and does not deal with his people as their sins deserve (Ps 103:10–12; Mic 7:18–19). The Greek verb most used for it, aphiēmi, means to release or let go, and is used both for cancelling a debt and for forgiving sins (Matt 18:27; 1 John 1:9). The New Testament places this pardon in Christ, through whom God cancels the debt that stood against us (Eph 1:7; Col 2:13–14). The forgiven are then to forgive: Jesus ties receiving mercy to showing it (Matt 6:12–15; 18:21–35), and Paul models it on how God in Christ forgave us (Eph 4:32). Forgiveness does not pretend nothing happened; it names the wrong and releases the debt (Luke 17:3–4; Gen 50:15–21).',
      synthesis(
        cite('bsb', 'Ps 103:10–12'),
        cite('bsb', 'Mic 7:18–19'),
        cite('bsb', 'Matt 18:27'),
        cite('bsb', '1 John 1:9'),
        cite('bsb', 'Eph 1:7'),
        cite('bsb', 'Col 2:13–14'),
        cite('bsb', 'Matt 6:12–15'),
        cite('bsb', 'Matt 18:21–35'),
        cite('bsb', 'Eph 4:32'),
        cite('bsb', 'Luke 17:3–4'),
        cite('bsb', 'Gen 50:15–21'),
        cite('stepbible-tbesg', 'G0863 ἀφίημι'),
      ),
    ),
    keyPassages: [
      {
        id: 'forgiveness:kp:1',
        ref: v('PSA', 32, 1, 5),
        title: 'The blessing of being forgiven',
        note: text(
          'David contrasts the wasting misery of hidden sin with the relief of confession: when he acknowledged his sin, God forgave its guilt. Paul quotes the opening lines in Romans 4:7–8.',
          synthesis(cite('bsb', 'Ps 32:1–5'), cite('bsb', 'Rom 4:7–8')),
        ),
        group: 'The God who forgives',
        tags: ['confession', 'psalms', 'guilt', 'david'],
      },
      {
        id: 'forgiveness:kp:2',
        ref: v('PSA', 103, 8, 14),
        title: 'As far as the east is from the west',
        note: text(
          'God does not repay people according to their sins. His loving devotion removes transgressions completely, and he pities frail human beings as a father pities his children.',
          synthesis(cite('bsb', 'Ps 103:8–14')),
        ),
        group: 'The God who forgives',
        tags: ['mercy', 'compassion', 'psalms', 'loving devotion'],
      },
      {
        id: 'forgiveness:kp:3',
        ref: v('MIC', 7, 18, 19),
        title: 'Who is a God like you?',
        note: text(
          'Micah closes his book in wonder at a God who pardons iniquity, delights in loving devotion and throws his people’s sins into the depths of the sea.',
          synthesis(cite('bsb', 'Mic 7:18–19')),
        ),
        group: 'The God who forgives',
        tags: ['prophets', 'pardon', 'mercy'],
      },
      {
        id: 'forgiveness:kp:4',
        ref: v('ISA', 1, 18),
        title: 'Scarlet made white',
        note: text(
          'Speaking to a rebellious nation, the LORD invites it to reason with him: sins stained deep red can be made white as snow.',
          synthesis(cite('bsb', 'Isa 1:18')),
        ),
        group: 'The God who forgives',
        tags: ['prophets', 'cleansing', 'invitation'],
      },
      {
        id: 'forgiveness:kp:5',
        ref: v('LUK', 7, 36, 50),
        title: 'Forgiven much, loves much',
        note: text(
          'Jesus declares a sinful woman’s sins forgiven and uses a parable of two debtors to show that great forgiveness produces great love. The dinner guests are left asking who this is who forgives sins (7:49).',
          synthesis(cite('bsb', 'Luke 7:36–50')),
        ),
        group: 'Forgiveness through Christ',
        tags: ['jesus', 'debt', 'love', 'authority to forgive'],
      },
      {
        id: 'forgiveness:kp:6',
        ref: v('LUK', 23, 33, 34),
        title: 'Father, forgive them',
        note: text(
          'On the cross Jesus prays for the forgiveness of those crucifying him, embodying the enemy-love he taught. (A BSB footnote notes that some manuscripts do not include this prayer.)',
          synthesis(cite('bsb', 'Luke 23:33–34'), cite('bsb', 'Luke 23:34, footnote')),
        ),
        group: 'Forgiveness through Christ',
        tags: ['cross', 'enemies', 'prayer', 'textual note'],
      },
      {
        id: 'forgiveness:kp:7',
        ref: v('COL', 2, 13, 14),
        title: 'The debt cancelled',
        note: text(
          'God made the spiritually dead alive with Christ, forgave all their trespasses, and cancelled the record of debt against them by nailing it to the cross.',
          synthesis(cite('bsb', 'Col 2:13–14')),
        ),
        group: 'Forgiveness through Christ',
        tags: ['cross', 'debt', 'new life', 'paul'],
      },
      {
        id: 'forgiveness:kp:8',
        ref: v('1JN', 1, 8, 9),
        title: 'If we confess our sins',
        note: text(
          'Christians still sin. The remedy is not denial but confession to a God who is faithful and just to forgive and cleanse.',
          synthesis(cite('bsb', '1 John 1:8–9')),
        ),
        group: 'Forgiveness through Christ',
        tags: ['confession', 'cleansing', 'assurance'],
      },
      {
        id: 'forgiveness:kp:9',
        ref: v('MAT', 18, 21, 35),
        title: 'The unforgiving servant',
        note: text(
          'Asked how often to forgive, Jesus answers “seventy-seven times” and tells of a servant released from an unpayable debt who will not release a small one. The forgiven must forgive from the heart.',
          synthesis(cite('bsb', 'Matt 18:21–35')),
        ),
        group: 'Forgiving one another',
        tags: ['parable', 'debt', 'mercy', 'peter'],
      },
      {
        id: 'forgiveness:kp:10',
        ref: v('MAT', 6, 12, 15),
        title: 'Forgive us as we forgive',
        note: text(
          'The Lord’s Prayer asks forgiveness of our debts as we forgive our debtors, and Jesus adds a sober warning about refusing to forgive others.',
          synthesis(cite('bsb', 'Matt 6:12–15')),
        ),
        group: 'Forgiving one another',
        tags: ['lord’s prayer', 'prayer', 'debts'],
      },
      {
        id: 'forgiveness:kp:11',
        ref: v('EPH', 4, 31, 32),
        title: 'As God in Christ forgave you',
        note: text(
          'Paul tells believers to put away bitterness, rage and malice and to be kind and tender-hearted, forgiving one another as God in Christ forgave them.',
          synthesis(cite('bsb', 'Eph 4:31–32')),
        ),
        group: 'Forgiving one another',
        tags: ['bitterness', 'kindness', 'paul', 'church'],
      },
      {
        id: 'forgiveness:kp:12',
        ref: v('GEN', 50, 15, 21),
        title: 'Joseph forgives his brothers',
        note: text(
          'Joseph refuses to take God’s place as avenger, recognises that God meant their evil for good, and reassures his fearful brothers with kindness and provision.',
          synthesis(cite('bsb', 'Gen 50:15–21')),
        ),
        group: 'Forgiving one another',
        tags: ['joseph', 'reconciliation', 'providence', 'family'],
      },
    ],
  },
  anchor: v('MAT', 18, 21, 35),
  suggestedQuestions: [
    'How many times should I forgive someone?',
    'What does the Greek word for “forgive” mean?',
    'Why does Jesus link God’s forgiveness to forgiving others?',
    'Explain the parable of the unforgiving servant.',
    'How did Joseph forgive his brothers?',
  ],
};

export default topic;
