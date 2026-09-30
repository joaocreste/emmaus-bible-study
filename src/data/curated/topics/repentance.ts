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
  id: 'repentance',
  name: 'Repentance',
  aliases: [
    'repentance',
    'repent',
    'repenting',
    'repented',
    'what is repentance',
    'what does it mean to repent',
    'how to repent',
    'turn back to god',
    'turning to god',
    'return to god',
    'return to the lord',
    'confess my sins',
    'confession of sin',
    'godly sorrow',
    'contrition',
    'conversion',
    'backsliding',
    'prodigal son',
    'metanoia',
    'shuv',
  ],
  topic: {
    name: 'Repentance',
    question: 'What does the Bible mean by repentance?',
    definition: text(
      'Repentance is a wholehearted turning from sin to God. The key Hebrew verb, shuv, means to turn back or return; the prophets call Israel to return to the LORD with all their heart, trusting his mercy (Joel 2:12–13; Isa 55:6–7; Ezek 18:30–32). The New Testament’s metanoeō and metanoia can mean a change of mind, but they almost always denote turning from sin with a changed life, so their etymology should not be pressed. Jesus’ first preaching joins repentance to faith in the gospel (Mark 1:15). Repentance is more than regret: Paul distinguishes godly sorrow that leads to salvation from worldly sorrow that leads to death (2 Cor 7:10), and John the Baptist asks for fruit in keeping with repentance (Luke 3:8–14). God’s kindness leads people to repentance (Rom 2:4), and heaven rejoices over every sinner who repents (Luke 15:7, 10).',
      synthesis(
        cite('stepbible-tbesh', 'H7725 שׁוּב'),
        cite('stepbible-tahot', 'Joel 2:12–13; Ezek 18:30 (H7725G)'),
        cite('stepbible-tbesg', 'G3341 μετάνοια; G3340 μετανοέω'),
        cite('stepbible-tagnt', 'Mark 1:15; 2 Cor 7:10'),
        cite('bsb', 'Joel 2:12–13'),
        cite('bsb', 'Isa 55:6–7'),
        cite('bsb', 'Ezek 18:30–32'),
        cite('bsb', 'Mark 1:15'),
        cite('bsb', '2 Cor 7:10'),
        cite('bsb', 'Luke 3:8–14'),
        cite('bsb', 'Rom 2:4'),
        cite('bsb', 'Luke 15:7, 10'),
      ),
    ),
    keyPassages: [
      {
        id: 'repentance:kp:1',
        ref: ch('PSA', 51),
        title: 'Create in me a clean heart',
        note: text(
          'According to its heading, David prayed this psalm after Nathan confronted him over Bathsheba. It models repentance: honest confession, appeal to God’s mercy, a plea for a new heart—and the assurance that God does not despise a broken and contrite heart.',
          synthesis(cite('bsb', 'Ps 51 (heading and vv. 1–17)')),
        ),
        group: 'Returning to the LORD',
        tags: ['confession', 'david', 'new heart', 'psalms'],
      },
      {
        id: 'repentance:kp:2',
        ref: v('2SA', 12, 1, 13),
        title: 'You are the man',
        note: text(
          'Nathan’s parable of the stolen lamb exposes David’s sin against Uriah. David confesses that he has sinned against the LORD, and Nathan announces that the LORD has taken away his sin.',
          synthesis(cite('bsb', '2 Sam 12:1–13')),
        ),
        group: 'Returning to the LORD',
        tags: ['david', 'nathan', 'confrontation', 'forgiveness'],
      },
      {
        id: 'repentance:kp:3',
        ref: v('JOL', 2, 12, 13),
        title: 'Rend your hearts',
        note: text(
          'God calls his people to return to him with all their heart—tearing their hearts, not their garments—because he is gracious, compassionate and rich in loving devotion.',
          synthesis(cite('bsb', 'Joel 2:12–13')),
        ),
        group: 'Returning to the LORD',
        tags: ['return', 'heart', 'mercy', 'prophets'],
      },
      {
        id: 'repentance:kp:4',
        ref: v('EZK', 18, 30, 32),
        title: 'Repent and live',
        note: text(
          'God urges Israel to turn from all its transgressions and to get a new heart and a new spirit, because he takes no pleasure in anyone’s death.',
          synthesis(cite('bsb', 'Ezek 18:30–32')),
        ),
        group: 'Returning to the LORD',
        tags: ['new heart', 'responsibility', 'life'],
      },
      {
        id: 'repentance:kp:5',
        ref: v('JON', 3, 4, 10),
        title: 'Nineveh turns',
        note: text(
          'At Jonah’s warning the whole city, from king to commoner, fasts and turns from violence, and God relents from the disaster he had threatened.',
          synthesis(cite('bsb', 'Jonah 3:4–10')),
        ),
        group: 'Returning to the LORD',
        tags: ['nations', 'fasting', 'mercy', 'jonah'],
      },
      {
        id: 'repentance:kp:6',
        ref: v('MRK', 1, 14, 15),
        title: 'Repent and believe',
        note: text(
          'Jesus’ opening proclamation joins repentance and faith in the gospel as the response to God’s arriving kingdom.',
          synthesis(cite('bsb', 'Mark 1:14–15')),
        ),
        group: 'Repent and believe',
        tags: ['kingdom', 'gospel', 'faith'],
      },
      {
        id: 'repentance:kp:7',
        ref: v('LUK', 15, 1, 10),
        title: 'Joy in heaven',
        note: text(
          'Criticised for welcoming sinners, Jesus tells of a shepherd and a woman who search for what is lost and rejoice when they find it—as heaven rejoices over one sinner who repents.',
          synthesis(cite('bsb', 'Luke 15:1–10')),
        ),
        group: 'Repent and believe',
        tags: ['lost sheep', 'lost coin', 'joy', 'parables'],
      },
      {
        id: 'repentance:kp:8',
        ref: v('LUK', 15, 11, 32),
        title: 'The prodigal son',
        note: text(
          'A son who squandered everything comes to his senses and heads home with a rehearsed confession; his father runs to embrace him before he can speak and cuts the confession short with robe and ring, and the resentful older brother is invited to rejoice too.',
          synthesis(cite('bsb', 'Luke 15:11–32')),
        ),
        group: 'Repent and believe',
        tags: ['father', 'grace', 'return', 'parable'],
      },
      {
        id: 'repentance:kp:9',
        ref: v('ACT', 2, 37, 39),
        title: 'Repent and be baptised',
        note: text(
          'Cut to the heart by Peter’s Pentecost sermon, the crowd is told to repent and be baptised in Jesus’ name for the forgiveness of sins and to receive the gift of the Holy Spirit.',
          synthesis(cite('bsb', 'Acts 2:37–39')),
        ),
        group: 'Repent and believe',
        tags: ['baptism', 'forgiveness', 'holy spirit', 'pentecost'],
      },
      {
        id: 'repentance:kp:10',
        ref: v('ACT', 17, 30, 31),
        title: 'God commands all people everywhere to repent',
        note: text(
          'At the Areopagus in Athens, Paul announces that God now calls everyone to repent, because he has fixed a day of judgement, confirmed by raising Jesus from the dead.',
          synthesis(cite('bsb', 'Acts 17:22'), cite('bsb', 'Acts 17:30–31')),
        ),
        group: 'Repent and believe',
        tags: ['judgement', 'resurrection', 'gentiles', 'mission'],
      },
      {
        id: 'repentance:kp:11',
        ref: v('LUK', 3, 7, 14),
        title: 'Fruit in keeping with repentance',
        note: text(
          'John the Baptist asks for changed lives: share clothing and food, collect only what is due, and do not extort—concrete fruit rather than religious pedigree.',
          synthesis(cite('bsb', 'Luke 3:7–14')),
        ),
        group: 'The fruit of repentance',
        tags: ['fruit', 'justice', 'john the baptist'],
      },
      {
        id: 'repentance:kp:12',
        ref: v('2CO', 7, 9, 11),
        title: 'Godly sorrow',
        note: text(
          'Paul distinguishes sorrow that leads to repentance and salvation from worldly sorrow that leads to death, and describes the earnestness and zeal that godly sorrow produced in the Corinthians.',
          synthesis(cite('bsb', '2 Cor 7:9–11')),
        ),
        group: 'The fruit of repentance',
        tags: ['sorrow', 'change', 'church'],
      },
    ],
  },
  anchor: ch('PSA', 51),
  suggestedQuestions: [
    'What is the Hebrew word behind “return” in Psalm 51?',
    'What does metanoia mean?',
    'What is the difference between godly sorrow and worldly sorrow?',
    'What does the parable of the prodigal son teach about repentance?',
    'How does Psalm 51 model confession?',
    'What are the “fruits of repentance”?',
  ],
};

export default topic;
