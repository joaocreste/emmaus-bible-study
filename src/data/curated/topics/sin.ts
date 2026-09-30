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
  id: 'sin',
  name: 'Sin',
  aliases: [
    'sin',
    'sins',
    'sinful',
    'sinner',
    'sinners',
    'what is sin',
    'why do we sin',
    'original sin',
    'the fall',
    'fall of man',
    'the fall of man',
    'temptation',
    'transgression',
    'iniquity',
    'sinful nature',
    'total depravity',
    'what does the bible say about sin',
    'hamartia',
  ],
  topic: {
    name: 'Sin',
    question: 'What does the Bible teach about sin?',
    definition: text(
      'Sin is failure to love and obey God—rebellion against his rightful rule that damages every relationship. Genesis 3 tells how the first humans doubted God’s word and grasped at being like God, bringing shame, hiding, blame and death, though God also promised that the serpent’s head would be crushed (Gen 3:15). Scripture describes sin as lawlessness (1 John 3:4), as a power that enslaves (John 8:34; Rom 6:12–14), and as something that springs from the heart (Mark 7:21–23; Jer 17:9). Its reach is universal: everyone has sinned and fallen short of God’s glory (Rom 3:23), and through one man sin and death spread to all (Rom 5:12). Its wages are death, but God’s gift is eternal life in Christ (Rom 6:23), the atoning sacrifice for our sins (1 John 2:2).',
      synthesis(
        cite('bsb', 'Gen 3'),
        cite('bsb', '1 John 3:4'),
        cite('bsb', 'John 8:34'),
        cite('bsb', 'Rom 6:12–14'),
        cite('bsb', 'Mark 7:21–23'),
        cite('bsb', 'Jer 17:9'),
        cite('bsb', 'Rom 3:23'),
        cite('bsb', 'Rom 5:12'),
        cite('bsb', 'Rom 6:23'),
        cite('bsb', '1 John 2:2'),
      ),
    ),
    keyPassages: [
      {
        id: 'sin:kp:1',
        ref: ch('GEN', 3),
        title: 'The fall',
        note: text(
          'Tempted to doubt God’s word and to grasp at being like God, the first couple disobey. Shame, hiding and blame follow, and death enters—yet God clothes them and promises the serpent’s defeat (3:15, 21).',
          synthesis(cite('bsb', 'Gen 3')),
        ),
        group: 'Where sin began',
        tags: ['adam and eve', 'temptation', 'serpent', 'promise'],
      },
      {
        id: 'sin:kp:2',
        ref: v('GEN', 4, 6, 8),
        title: 'Sin crouching at the door',
        note: text(
          'God warns an angry Cain that sin is crouching at his door and desires him, but that he must master it; instead he murders his brother.',
          synthesis(cite('bsb', 'Gen 4:6–8')),
        ),
        group: 'Where sin began',
        tags: ['cain and abel', 'anger', 'temptation', 'violence'],
      },
      {
        id: 'sin:kp:3',
        ref: v('GEN', 6, 5),
        title: 'Every inclination of the heart',
        note: text(
          'Before the flood, the LORD sees that human wickedness has become total, reaching every intention of the heart all the time.',
          synthesis(cite('bsb', 'Gen 6:5')),
        ),
        group: 'Where sin began',
        tags: ['flood', 'heart', 'corruption'],
      },
      {
        id: 'sin:kp:4',
        ref: v('PSA', 51, 1, 5),
        title: 'Against you only',
        note: text(
          'David confesses his sin as rebellion against God, as guilt needing to be washed away, and as a condition reaching back to his birth.',
          synthesis(cite('bsb', 'Ps 51:1–5')),
        ),
        group: 'What sin is',
        tags: ['confession', 'guilt', 'david', 'psalms'],
      },
      {
        id: 'sin:kp:5',
        ref: v('ISA', 59, 1, 2),
        title: 'Your iniquities have built barriers',
        note: text(
          'The problem is not that God is too weak to save or too deaf to hear, but that sin separates people from him.',
          synthesis(cite('bsb', 'Isa 59:1–2')),
        ),
        group: 'What sin is',
        tags: ['separation', 'prophets', 'prayer'],
      },
      {
        id: 'sin:kp:6',
        ref: v('MRK', 7, 20, 23),
        title: 'Out of the heart',
        note: text(
          'Jesus locates defilement not in foods but in the heart, from which evil thoughts and actions flow.',
          synthesis(cite('bsb', 'Mark 7:20–23')),
        ),
        group: 'What sin is',
        tags: ['heart', 'purity', 'jesus'],
      },
      {
        id: 'sin:kp:7',
        ref: v('JAS', 1, 13, 15),
        title: 'Desire conceives and gives birth to sin',
        note: text(
          'Temptation does not come from God; it is the lure of our own desires, which give birth to sin, and sin, fully grown, brings death.',
          synthesis(cite('bsb', 'Jas 1:13–15')),
        ),
        group: 'What sin is',
        tags: ['temptation', 'desire', 'death'],
      },
      {
        id: 'sin:kp:8',
        ref: v('ROM', 3, 9, 20),
        title: 'No one righteous',
        note: text(
          'Weaving together lines from the Psalms and Isaiah (e.g. Ps 14:1–3; Isa 59:7–8), Paul concludes that Jews and Gentiles alike are under sin, and that the law brings awareness of sin rather than justification.',
          synthesis(cite('bsb', 'Rom 3:9–20'), cite('bsb', 'Ps 14:1–3'), cite('bsb', 'Isa 59:7–8')),
        ),
        group: 'What sin is',
        tags: ['universality', 'law', 'paul', 'quotation'],
      },
      {
        id: 'sin:kp:9',
        ref: v('ROM', 5, 12, 21),
        title: 'Adam and Christ',
        note: text(
          'Sin and death entered the world through one man; much more, grace and the gift of righteousness reign through the one man Jesus Christ.',
          synthesis(cite('bsb', 'Rom 5:12–21')),
        ),
        group: 'Sin’s reign broken',
        tags: ['adam', 'original sin', 'grace', 'death'],
      },
      {
        id: 'sin:kp:10',
        ref: v('ROM', 6, 1, 14),
        title: 'Dead to sin, alive to God',
        note: text(
          'United with Christ in his death and resurrection, believers are no longer slaves to sin; they must not let it reign but offer themselves to God.',
          synthesis(cite('bsb', 'Rom 6:1–14')),
        ),
        group: 'Sin’s reign broken',
        tags: ['union with christ', 'baptism', 'freedom', 'sanctification'],
      },
      {
        id: 'sin:kp:11',
        ref: v('JHN', 8, 34, 36),
        title: 'The Son sets you free',
        note: text(
          'Everyone who sins is a slave to sin, but the Son can make people truly free.',
          synthesis(cite('bsb', 'John 8:34–36')),
        ),
        group: 'Sin’s reign broken',
        tags: ['slavery', 'freedom', 'jesus'],
      },
      {
        id: 'sin:kp:12',
        ref: { book: '1JN', startChapter: 1, startVerse: 8, endChapter: 2, endVerse: 2 },
        title: 'If anyone does sin',
        note: text(
          'Christians who deny their sin deceive themselves; those who confess find forgiveness, and they have an advocate with the Father, Jesus Christ, the atoning sacrifice for sins.',
          synthesis(cite('bsb', '1 John 1:8–2:2')),
        ),
        group: 'Sin’s reign broken',
        tags: ['confession', 'advocate', 'atonement', 'forgiveness'],
      },
    ],
  },
  anchor: ch('GEN', 3),
  suggestedQuestions: [
    'What happened in the fall in Genesis 3?',
    'What does Paul mean when he says all have sinned?',
    'Where does temptation come from?',
    'How does Paul connect Adam and Christ?',
    'How are Christians set free from sin?',
  ],
};

export default topic;
