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

/** A whole chapter (or psalm). */
const ch = (book: string, chapter: number): PassageRef => ({ book, startChapter: chapter });

const topic: CuratedTopic = {
  id: 'anxiety',
  name: 'Anxiety & Worry',
  aliases: [
    'anxiety',
    'anxious',
    'be anxious',
    'worry',
    'worried',
    'worrying',
    'do not worry',
    'don’t worry',
    "don't worry",
    'dont worry',
    'fear',
    'afraid',
    'fearful',
    'stress',
    'stressed',
    'panic',
    'nervous',
    'overwhelmed',
    'cast your cares',
    'peace of mind',
    'what does the bible say about anxiety',
    'what does the bible say about worry',
    'merimna',
    'merimnao',
  ],
  topic: {
    name: 'Anxiety & Worry',
    question: 'What does the Bible say about anxiety?',
    definition: text(
      'The Bible speaks often, and gently, to anxious people. Jesus tells his followers not to worry about food, clothing or tomorrow—not because their needs are unreal, but because the Father knows them and cares even for birds and flowers (Matt 6:25–34). Paul turns anxiety into prayer with thanksgiving and promises God’s guarding peace (Phil 4:6–7); Peter says to cast every anxiety on God because he cares (1 Pet 5:7). The Greek words behind “worry” (merimnaō, merimna) can also mean proper care: Paul uses them of his concern for the churches and of Timothy’s care for the Philippians (2 Cor 11:28; Phil 2:20). So Scripture targets anxious distrust, not care itself, and it gives words for despair and fear (Ps 42; 56:3–4). It even notes that anxiety weighs down the heart and a good word lifts it (Prov 12:25).',
      synthesis(
        cite('bsb', 'Matt 6:25–34'),
        cite('bsb', 'Phil 4:6–7'),
        cite('bsb', '1 Pet 5:7'),
        cite('bsb', '2 Cor 11:28'),
        cite('bsb', 'Phil 2:20'),
        cite('bsb', 'Ps 42'),
        cite('bsb', 'Ps 56:3–4'),
        cite('bsb', 'Prov 12:25'),
        cite('stepbible-tbesg', 'G3309 μεριμνάω; G3308 μέριμνα'),
        cite('stepbible-tagnt', 'Matt 6:25; Phil 4:6; Phil 2:20; 2 Cor 11:28; 1 Pet 5:7'),
      ),
    ),
    keyPassages: [
      {
        id: 'anxiety:kp:1',
        ref: v('MAT', 6, 25, 34),
        title: 'Do not worry about tomorrow',
        note: text(
          'Pointing to birds and wildflowers, Jesus reasons from God’s care for small things to his care for his children, and redirects the heart to seek first God’s kingdom and righteousness.',
          synthesis(cite('bsb', 'Matt 6:25–34')),
        ),
        group: 'Jesus on worry',
        tags: ['sermon on the mount', 'provision', 'kingdom', 'tomorrow'],
      },
      {
        id: 'anxiety:kp:2',
        ref: v('LUK', 10, 38, 42),
        title: 'Martha, Martha',
        note: text(
          'Jesus gently tells a busy, distracted host that she is worried and upset about many things, while only one thing is needed—Mary has chosen to sit at his feet and listen.',
          synthesis(cite('bsb', 'Luke 10:38–42')),
        ),
        group: 'Jesus on worry',
        tags: ['distraction', 'busyness', 'listening', 'priorities'],
      },
      {
        id: 'anxiety:kp:3',
        ref: v('JHN', 14, 25, 27),
        title: 'My peace I give to you',
        note: text(
          'On the night before his death, Jesus promises the Spirit and gives his disciples his own peace, unlike the world’s, telling them not to let their hearts be troubled or afraid.',
          synthesis(cite('bsb', 'John 14:25–27')),
        ),
        group: 'Jesus on worry',
        tags: ['peace', 'holy spirit', 'fear', 'troubled heart'],
      },
      {
        id: 'anxiety:kp:4',
        ref: v('MAT', 11, 28, 30),
        title: 'Come to me and I will give you rest',
        note: text(
          'Jesus invites the weary and burdened to take his gentle yoke and learn from him, promising rest for their souls.',
          synthesis(cite('bsb', 'Matt 11:28–30')),
        ),
        group: 'Jesus on worry',
        tags: ['rest', 'weariness', 'invitation', 'gentleness'],
      },
      {
        id: 'anxiety:kp:5',
        ref: v('PHP', 4, 4, 9),
        title: 'Be anxious for nothing',
        note: text(
          'Writing in chains (1:13), Paul pairs rejoicing with prayer and thanksgiving, promises the peace of God to guard hearts and minds, and directs thought toward whatever is true, honourable and good.',
          synthesis(cite('bsb', 'Phil 4:4–9'), cite('bsb', 'Phil 1:13')),
        ),
        group: 'Casting cares on God',
        tags: ['prayer', 'peace', 'thanksgiving', 'thought life'],
      },
      {
        id: 'anxiety:kp:6',
        ref: v('1PE', 5, 6, 7),
        title: 'Cast all your anxiety on him',
        note: text(
          'Humbling oneself under God’s mighty hand includes throwing one’s anxieties onto him, because he cares.',
          synthesis(cite('bsb', '1 Pet 5:6–7')),
        ),
        group: 'Casting cares on God',
        tags: ['humility', 'trust', 'care of god'],
      },
      {
        id: 'anxiety:kp:7',
        ref: v('PSA', 55, 22),
        title: 'Cast your burden on the LORD',
        note: text(
          'In a psalm of betrayal by a close friend (55:12–14), the singer urges casting one’s burden on the LORD, who sustains the righteous.',
          synthesis(cite('bsb', 'Ps 55:12–14, 22')),
        ),
        group: 'Casting cares on God',
        tags: ['psalms', 'burden', 'betrayal', 'trust'],
      },
      {
        id: 'anxiety:kp:8',
        ref: v('PSA', 94, 19),
        title: 'When anxiety overwhelms me',
        note: text(
          'The psalmist admits that anxiety overwhelms him, and finds that God’s consolation brings delight to his soul.',
          synthesis(cite('bsb', 'Ps 94:19')),
        ),
        group: 'Casting cares on God',
        tags: ['psalms', 'comfort', 'honesty'],
      },
      {
        id: 'anxiety:kp:9',
        ref: ch('PSA', 42),
        title: 'Why are you downcast, O my soul?',
        note: text(
          'A psalm of longing and discouragement that argues with itself: the singer, thirsting for God and taunted by others, names his despair honestly and keeps telling his soul to hope in God.',
          synthesis(cite('bsb', 'Ps 42')),
        ),
        group: 'Honest fear and God’s presence',
        tags: ['lament', 'depression', 'hope', 'psalms'],
      },
      {
        id: 'anxiety:kp:10',
        ref: v('PSA', 56, 3, 4),
        title: 'When I am afraid',
        note: text(
          'Fear and trust coexist: when he is afraid, the psalmist chooses to put his trust in God and his word.',
          synthesis(cite('bsb', 'Ps 56:3–4')),
        ),
        group: 'Honest fear and God’s presence',
        tags: ['fear', 'trust', 'psalms'],
      },
      {
        id: 'anxiety:kp:11',
        ref: v('ISA', 41, 10),
        title: 'Do not fear, for I am with you',
        note: text(
          'God’s command not to fear rests on his presence and his promise to strengthen, help and uphold his people.',
          synthesis(cite('bsb', 'Isa 41:10')),
        ),
        group: 'Honest fear and God’s presence',
        tags: ['fear', 'presence of god', 'strength'],
      },
      {
        id: 'anxiety:kp:12',
        ref: v('1KI', 19, 1, 8),
        title: 'Elijah under the broom tree',
        note: text(
          'Threatened by Jezebel, a frightened and exhausted Elijah runs and asks to die. He falls asleep, and an angel wakes him with a touch and gives him food and water, twice, before he goes on strengthened for the journey.',
          synthesis(cite('bsb', '1 Kgs 19:1–8')),
        ),
        group: 'Honest fear and God’s presence',
        tags: ['exhaustion', 'despair', 'rest', 'elijah'],
      },
    ],
  },
  anchor: v('PHP', 4, 4, 9),
  suggestedQuestions: [
    'What does the Greek word merimnaō mean?',
    'Is worry a sin?',
    'What did Jesus mean by “do not worry about tomorrow”?',
    'How can I pray when I feel anxious?',
    'Show me psalms for times of fear.',
  ],
};

export default topic;
