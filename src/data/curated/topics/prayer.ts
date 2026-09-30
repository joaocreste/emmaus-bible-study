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
  id: 'prayer',
  name: 'Prayer',
  aliases: [
    'prayer',
    'prayers',
    'pray',
    'praying',
    'how to pray',
    'how should i pray',
    'teach us to pray',
    'the lord’s prayer',
    "the lord's prayer",
    'lords prayer',
    'our father',
    'unanswered prayer',
    'does god answer prayer',
    'intercession',
    'intercede',
    'petition',
    'what does the bible say about prayer',
    'proseuche',
  ],
  topic: {
    name: 'Prayer',
    question: 'What does the Bible teach about prayer?',
    definition: text(
      'Prayer is speaking to God as Father—praising, confessing, asking and giving thanks—trusting that he hears. Jesus taught his disciples to pray privately and simply, since the Father knows their needs before they ask, and gave them a pattern that seeks God’s name, kingdom and will before daily bread, forgiveness and deliverance (Matt 6:5–13). He urged persistence (Luke 11:5–13; 18:1–8) and humility (Luke 18:9–14). The Psalms show that honest lament belongs in prayer as much as praise (Ps 13; 62:8). Christians pray with confidence because Jesus is a sympathetic high priest (Heb 4:14–16), and when they do not know what to pray, the Spirit intercedes for them (Rom 8:26–27). Paul calls believers to bring every concern to God with thanksgiving (Phil 4:6).',
      synthesis(
        cite('bsb', 'Matt 6:5–13'),
        cite('bsb', 'Luke 11:5–13'),
        cite('bsb', 'Luke 18:1–14'),
        cite('bsb', 'Ps 13'),
        cite('bsb', 'Ps 62:8'),
        cite('bsb', 'Heb 4:14–16'),
        cite('bsb', 'Rom 8:26–27'),
        cite('bsb', 'Phil 4:6'),
      ),
    ),
    keyPassages: [
      {
        id: 'prayer:kp:1',
        ref: v('MAT', 6, 5, 15),
        title: 'The Lord’s Prayer',
        note: text(
          'Jesus warns against praying for show or piling up words, then gives a prayer that begins with God’s name, kingdom and will and moves to daily bread, forgiveness and deliverance from evil.',
          synthesis(cite('bsb', 'Matt 6:5–15')),
        ),
        group: 'Jesus teaches prayer',
        tags: ['lord’s prayer', 'sermon on the mount', 'hypocrisy', 'father'],
      },
      {
        id: 'prayer:kp:2',
        ref: v('LUK', 11, 1, 13),
        title: 'Ask, seek, knock',
        note: text(
          'Luke’s shorter form of the prayer is followed by a parable of a friend at midnight and the promise that the Father gives the Holy Spirit to those who ask him.',
          synthesis(cite('bsb', 'Luke 11:1–13')),
        ),
        group: 'Jesus teaches prayer',
        tags: ['persistence', 'asking', 'holy spirit', 'father'],
      },
      {
        id: 'prayer:kp:3',
        ref: v('LUK', 18, 1, 8),
        title: 'Pray and do not lose heart',
        note: text(
          'If even an unjust judge gives in to a persistent widow, how much more will God bring justice for his people who cry to him day and night.',
          synthesis(cite('bsb', 'Luke 18:1–8')),
        ),
        group: 'Jesus teaches prayer',
        tags: ['persistence', 'justice', 'parable', 'perseverance'],
      },
      {
        id: 'prayer:kp:4',
        ref: v('LUK', 18, 9, 14),
        title: 'The Pharisee and the tax collector',
        note: text(
          'The man who went home justified was not the one who listed his virtues but the one who stood at a distance and simply begged for mercy as a sinner.',
          synthesis(cite('bsb', 'Luke 18:9–14')),
        ),
        group: 'Jesus teaches prayer',
        tags: ['humility', 'mercy', 'parable', 'justification'],
      },
      {
        id: 'prayer:kp:5',
        ref: v('MAT', 26, 36, 44),
        title: 'Not as I will, but as you will',
        note: text(
          'In Gethsemane Jesus, overwhelmed with sorrow, asks three times that the cup might pass, yet submits to the Father’s will—honest request and surrender held together.',
          synthesis(cite('bsb', 'Matt 26:36–44')),
        ),
        group: 'Jesus teaches prayer',
        tags: ['gethsemane', 'surrender', 'sorrow', 'will of god'],
      },
      {
        id: 'prayer:kp:6',
        ref: ch('PSA', 13),
        title: 'How long, O LORD?',
        note: text(
          'A lament that moves from feeling forgotten by God to renewed trust in his loving devotion. Scripture gives words for prayer when God seems absent.',
          synthesis(cite('bsb', 'Ps 13')),
        ),
        group: 'The prayers of God’s people',
        tags: ['lament', 'psalms', 'trust', 'silence of god'],
      },
      {
        id: 'prayer:kp:7',
        ref: v('NEH', 1, 4, 11),
        title: 'Confession and petition',
        note: text(
          'Hearing of Jerusalem’s ruin, Nehemiah mourns, fasts and prays: he confesses his people’s sin, pleads God’s promises to Moses, and asks for favour before the king he serves as cupbearer.',
          synthesis(cite('bsb', 'Neh 1:4–11')),
        ),
        group: 'The prayers of God’s people',
        tags: ['confession', 'fasting', 'covenant', 'intercession'],
      },
      {
        id: 'prayer:kp:8',
        ref: v('DAN', 9, 3, 19),
        title: 'Praying on the ground of God’s mercy',
        note: text(
          'Daniel confesses Israel’s sin and asks God to act, not because of his people’s righteousness but because of God’s great compassion and for the sake of his name.',
          synthesis(cite('bsb', 'Dan 9:3–19')),
        ),
        group: 'The prayers of God’s people',
        tags: ['confession', 'mercy', 'intercession', 'exile'],
      },
      {
        id: 'prayer:kp:9',
        ref: v('HEB', 4, 14, 16),
        title: 'Approach the throne of grace',
        note: text(
          'Because Jesus, our high priest, sympathises with our weakness, believers may come to God with confidence to receive mercy and help in time of need.',
          synthesis(cite('bsb', 'Heb 4:14–16')),
        ),
        group: 'Prayer in Christ and the Spirit',
        tags: ['high priest', 'confidence', 'grace', 'mercy'],
      },
      {
        id: 'prayer:kp:10',
        ref: v('ROM', 8, 26, 27),
        title: 'The Spirit intercedes',
        note: text(
          'When we do not know how we ought to pray, the Spirit himself intercedes for us with wordless groaning, and he does so according to God’s will.',
          synthesis(cite('bsb', 'Rom 8:26–27')),
        ),
        group: 'Prayer in Christ and the Spirit',
        tags: ['holy spirit', 'weakness', 'intercession'],
      },
      {
        id: 'prayer:kp:11',
        ref: v('PHP', 4, 6, 7),
        title: 'Prayer instead of anxiety',
        note: text(
          'Paul turns anxiety into prayer and petition with thanksgiving, and promises that God’s peace will guard hearts and minds in Christ Jesus.',
          synthesis(cite('bsb', 'Phil 4:6–7')),
        ),
        group: 'Prayer in Christ and the Spirit',
        tags: ['anxiety', 'peace', 'thanksgiving'],
      },
      {
        id: 'prayer:kp:12',
        ref: v('JAS', 5, 13, 18),
        title: 'The prayer offered in faith',
        note: text(
          'James commends prayer in suffering, sickness and sin, including confessing sins to one another, and points to Elijah—a man like us whose prayers God answered.',
          synthesis(cite('bsb', 'Jas 5:13–18')),
        ),
        group: 'Prayer in Christ and the Spirit',
        tags: ['healing', 'confession', 'elijah', 'faith'],
      },
    ],
  },
  anchor: v('MAT', 6, 5, 15),
  suggestedQuestions: [
    'Explain the Lord’s Prayer line by line.',
    'Why pray if God already knows what I need?',
    'What should I do when God seems silent?',
    'What does it mean that the Spirit intercedes for us?',
    'Show me prayers of lament in the Psalms.',
    'What is the Greek word behind “pray”?',
  ],
};

export default topic;
