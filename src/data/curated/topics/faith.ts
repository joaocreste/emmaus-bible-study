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
  id: 'faith',
  name: 'Faith',
  aliases: [
    'faith',
    'believe',
    'believing',
    'belief',
    'what is faith',
    'faith in god',
    'faith in jesus',
    'trust in god',
    'trusting god',
    'saving faith',
    'faith and works',
    'doubt',
    'doubts',
    'having doubts',
    'what does the bible say about faith',
    'pistis',
    'emunah',
  ],
  topic: {
    name: 'Faith',
    question: 'What does the Bible say about faith?',
    definition: text(
      'Faith is trust in God that takes him at his word. Hebrews describes it as confidence about what is hoped for and conviction about what is unseen, without which no one can please God (Heb 11:1, 6). Abraham is the pattern: he trusted God’s promise, and God counted it to him as righteousness (Gen 15:6; Rom 4:18–22). The Greek pistis means belief, trust or confidence, and can also mean faithfulness; in Habakkuk 2:4 the Hebrew ʾemunah means faithfulness or steadfastness, a steady loyalty rather than a passing assent. In the New Testament faith rests on Jesus as the Christ and receives salvation as God’s gift (John 20:31; Eph 2:8–9). It comes by hearing the message about Christ (Rom 10:17) and is never idle: it works through love and shows itself in deeds (Gal 5:6; Jas 2:17).',
      synthesis(
        cite('bsb', 'Heb 11:1–6'),
        cite('bsb', 'Gen 15:6'),
        cite('bsb', 'Rom 4:18–22'),
        cite('bsb', 'Hab 2:4'),
        cite('bsb', 'John 20:31'),
        cite('bsb', 'Eph 2:8–9'),
        cite('bsb', 'Rom 10:17'),
        cite('bsb', 'Gal 5:6'),
        cite('bsb', 'Jas 2:17'),
        cite('stepbible-tbesg', 'G4102 πίστις (G4102G faith; G4102H faithfulness)'),
        cite('stepbible-tbesh', 'H0530 אֱמוּנָה'),
        cite('stepbible-tahot', 'Hab 2:4 (be’emunato, H0530)'),
      ),
    ),
    keyPassages: [
      {
        id: 'faith:kp:1',
        ref: v('HEB', 11, 1, 6),
        title: 'Faith defined',
        note: text(
          'Hebrews describes faith as confidence in what is hoped for and unseen, then shows it at work in Abel and Enoch. Without such trust no one can please God, because coming to him means believing he is there and that he rewards those who seek him (11:6).',
          synthesis(cite('bsb', 'Heb 11:1–6')),
        ),
        group: 'Faith defined and modelled',
        tags: ['definition', 'hebrews', 'hope', 'pleasing god'],
      },
      {
        id: 'faith:kp:2',
        ref: v('GEN', 15, 1, 6),
        title: 'Abram believes the promise',
        note: text(
          'Childless and ageing, Abram is told to count the stars; he trusts God’s promise, and the LORD counts his faith as righteousness. Paul and James both build on this verse (Rom 4:3; Jas 2:23).',
          synthesis(cite('bsb', 'Gen 15:1–6'), cite('bsb', 'Rom 4:3'), cite('bsb', 'Jas 2:23')),
        ),
        group: 'Faith defined and modelled',
        tags: ['abraham', 'promise', 'righteousness', 'old testament'],
      },
      {
        id: 'faith:kp:3',
        ref: v('HEB', 11, 8, 19),
        title: 'Abraham’s obedient faith',
        note: text(
          'Faith sets out without knowing the destination, lives as a stranger while looking for God’s city, and even reasons that God could raise the dead (11:19).',
          synthesis(cite('bsb', 'Heb 11:8–19')),
        ),
        group: 'Faith defined and modelled',
        tags: ['abraham', 'obedience', 'pilgrimage', 'resurrection'],
      },
      {
        id: 'faith:kp:4',
        ref: v('HAB', 2, 4),
        title: 'The righteous will live by faith',
        note: text(
          'In a time of crisis the prophet is told that the righteous one will live by his faithfulness (Hebrew ʾemunah). Paul quotes the line as a keynote of the gospel, and Hebrews applies it to endurance (Rom 1:17; Gal 3:11; Heb 10:38).',
          synthesis(
            cite('bsb', 'Hab 2:4'),
            cite('bsb', 'Rom 1:17'),
            cite('bsb', 'Gal 3:11'),
            cite('bsb', 'Heb 10:38'),
            cite('stepbible-tahot', 'Hab 2:4'),
          ),
        ),
        group: 'Faith defined and modelled',
        tags: ['habakkuk', 'faithfulness', 'righteousness', 'quotation'],
      },
      {
        id: 'faith:kp:5',
        ref: v('JHN', 20, 30, 31),
        title: 'Written so that you may believe',
        note: text(
          'John states the purpose of his Gospel: that readers may believe Jesus is the Christ, the Son of God, and by believing have life in his name.',
          synthesis(cite('bsb', 'John 20:30–31')),
        ),
        group: 'Believing in Christ',
        tags: ['john', 'believe', 'life', 'christ'],
      },
      {
        id: 'faith:kp:6',
        ref: v('JHN', 3, 16, 18),
        title: 'Whoever believes in him',
        note: text(
          'God’s gift of his Son is received by believing: in these verses the dividing line is believing or not believing in God’s one and only Son (3:18), and the verses that follow link unbelief with loving the darkness (3:19–21).',
          synthesis(cite('bsb', 'John 3:16–21')),
        ),
        group: 'Believing in Christ',
        tags: ['love of god', 'eternal life', 'believe', 'condemnation'],
      },
      {
        id: 'faith:kp:7',
        ref: v('ROM', 10, 14, 17),
        title: 'Faith comes by hearing',
        note: text(
          'Paul traces faith back to proclamation: people call on the one they believe in, believe what they have heard, and hear because someone is sent with the message of Christ.',
          synthesis(cite('bsb', 'Rom 10:14–17')),
        ),
        group: 'Believing in Christ',
        tags: ['preaching', 'hearing', 'word of christ', 'mission'],
      },
      {
        id: 'faith:kp:8',
        ref: v('EPH', 2, 8, 9),
        title: 'Saved through faith',
        note: text(
          'Salvation is by grace through faith and not by works, so that no one can boast. Faith receives what God gives rather than earning it.',
          synthesis(cite('bsb', 'Eph 2:8–9')),
        ),
        group: 'Believing in Christ',
        tags: ['grace', 'salvation', 'gift', 'works'],
      },
      {
        id: 'faith:kp:9',
        ref: v('JAS', 2, 14, 26),
        title: 'Faith without deeds is dead',
        note: text(
          'James rejects a bare profession that leaves the hungry unfed. Living faith, like Abraham’s and Rahab’s, shows itself in action (2:17, 21–25).',
          synthesis(cite('bsb', 'Jas 2:14–26')),
        ),
        group: 'Faith that works and endures',
        tags: ['works', 'deeds', 'james', 'abraham', 'rahab'],
      },
      {
        id: 'faith:kp:10',
        ref: v('GAL', 5, 6),
        title: 'Faith working through love',
        note: text(
          'In Christ what counts is neither circumcision nor its absence but faith that expresses itself in love.',
          synthesis(cite('bsb', 'Gal 5:6')),
        ),
        group: 'Faith that works and endures',
        tags: ['love', 'paul', 'works', 'circumcision'],
      },
      {
        id: 'faith:kp:11',
        ref: v('MRK', 9, 21, 27),
        title: 'Help my unbelief',
        note: text(
          'A desperate father confesses belief and unbelief in the same breath, and Jesus answers his mixed faith by healing his son. Faith can be real while it is still weak.',
          synthesis(cite('bsb', 'Mark 9:21–27')),
        ),
        group: 'Faith that works and endures',
        tags: ['doubt', 'weak faith', 'healing', 'prayer'],
      },
      {
        id: 'faith:kp:12',
        ref: v('1PE', 1, 6, 9),
        title: 'Faith tested by fire',
        note: text(
          'Trials prove faith as fire refines gold. Believers love and trust a Christ they have not seen and are receiving the salvation that is faith’s goal.',
          synthesis(cite('bsb', '1 Pet 1:6–9')),
        ),
        group: 'Faith that works and endures',
        tags: ['trials', 'suffering', 'joy', 'unseen'],
      },
    ],
  },
  anchor: v('HEB', 11, 1, 6),
  suggestedQuestions: [
    'What is the Greek word for faith?',
    'How do Paul and James fit together on faith and works?',
    'Why is Abraham the model of faith?',
    'What does Hebrews 11:1 mean?',
    'Is it wrong to have doubts?',
  ],
};

export default topic;
