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
  id: 'resurrection',
  name: 'The Resurrection',
  aliases: [
    'resurrection',
    'the resurrection',
    'resurrection of jesus',
    'resurrection of christ',
    'did jesus rise from the dead',
    'he is risen',
    'risen',
    'easter',
    'empty tomb',
    'rose from the dead',
    'raised from the dead',
    'resurrection of the dead',
    'resurrection of the body',
    'bodily resurrection',
    'resurrection body',
    'life after death',
    'what happens when we die',
    'anastasis',
  ],
  topic: {
    name: 'The Resurrection',
    question: 'What does the Bible teach about the resurrection?',
    definition: text(
      'The resurrection stands at the heart of Christian hope. Paul hands on, as of first importance, that Christ died for our sins, was buried, was raised on the third day according to the Scriptures, and appeared to many witnesses (1 Cor 15:3–8). The Gospels stress an empty tomb and a bodily Jesus who could be touched and who ate (Matt 28:1–10; Luke 24:36–43). If Christ has not been raised, faith is futile; but he has been raised as the firstfruits of those who have died (1 Cor 15:14–20). The Old Testament glimpsed this hope (Isa 26:19; Dan 12:2), and Peter reads Psalm 16 as David foreseeing it (Acts 2:25–32). Believers already share Christ’s risen life (Rom 6:4–5) and await the resurrection of the body—imperishable and glorious—when death itself is defeated (1 Cor 15:42–57; Phil 3:20–21).',
      synthesis(
        cite('bsb', '1 Cor 15:3–8'),
        cite('bsb', 'Matt 28:1–10'),
        cite('bsb', 'Luke 24:36–43'),
        cite('bsb', '1 Cor 15:14–20'),
        cite('bsb', 'Isa 26:19'),
        cite('bsb', 'Dan 12:2'),
        cite('bsb', 'Acts 2:25–32'),
        cite('bsb', 'Rom 6:4–5'),
        cite('bsb', '1 Cor 15:42–57'),
        cite('bsb', 'Phil 3:20–21'),
      ),
    ),
    keyPassages: [
      {
        id: 'resurrection:kp:1',
        ref: v('ISA', 26, 19),
        title: 'Your dead will live',
        note: text(
          'In a song of trust in the LORD (Isa 26), Isaiah promises that God’s dead will live, their bodies will rise, and those who dwell in the dust will awake and sing. Interpreters differ on whether this pictures the nation’s restoration after exile or the resurrection of the body; the Tyndale study notes judge resurrection the more likely reading.',
          synthesis(
            cite('bsb', 'Isa 26:1–4, 19'),
            cite('tyndale-open-study-notes', 'note on Isa 26:19', 'https://bible.helloao.org/api/c/tyndale/ISA/26.json'),
          ),
        ),
        group: 'The hope glimpsed',
        tags: ['prophets', 'old testament', 'bodily resurrection'],
      },
      {
        id: 'resurrection:kp:2',
        ref: v('DAN', 12, 1, 3),
        title: 'Many who sleep in the dust will awake',
        note: text(
          'Daniel speaks explicitly of many who sleep in the dust awaking—some to everlasting life, others to shame and everlasting contempt—and of the wise shining like the stars.',
          synthesis(cite('bsb', 'Dan 12:1–3')),
        ),
        group: 'The hope glimpsed',
        tags: ['judgement', 'eternal life', 'daniel'],
      },
      {
        id: 'resurrection:kp:3',
        ref: v('EZK', 37, 1, 14),
        title: 'The valley of dry bones',
        note: text(
          'God’s breath brings dry bones back to life. The vision first promises Israel’s national revival after exile (the bones are identified as the whole house of Israel, 37:11), using the image of opened graves.',
          synthesis(cite('bsb', 'Ezek 37:1–14')),
        ),
        group: 'The hope glimpsed',
        tags: ['exile', 'restoration', 'spirit', 'breath'],
      },
      {
        id: 'resurrection:kp:4',
        ref: v('PSA', 16, 9, 11),
        title: 'You will not let your Holy One see decay',
        note: text(
          'David trusts that God will not abandon him to Sheol; at Pentecost Peter argues that David, who died and was buried, spoke of the resurrection of the Christ (Acts 2:25–32).',
          synthesis(cite('bsb', 'Ps 16:9–11'), cite('bsb', 'Acts 2:25–32')),
        ),
        group: 'The hope glimpsed',
        tags: ['psalms', 'prophecy', 'fulfilment', 'david'],
      },
      {
        id: 'resurrection:kp:5',
        ref: v('MAT', 28, 1, 10),
        title: 'He is not here; he has risen',
        note: text(
          'Early on the first day of the week the women witness an angel roll back the stone, hear his announcement, and meet the risen Jesus, who sends them to his brothers.',
          synthesis(cite('bsb', 'Matt 28:1–10')),
        ),
        group: 'Christ is risen',
        tags: ['empty tomb', 'women', 'witnesses', 'easter'],
      },
      {
        id: 'resurrection:kp:6',
        ref: v('LUK', 24, 36, 43),
        title: 'Touch me and see',
        note: text(
          'The risen Jesus shows his hands and feet and eats broiled fish to show the startled disciples that he is not a spirit but has flesh and bones.',
          synthesis(cite('bsb', 'Luke 24:36–43')),
        ),
        group: 'Christ is risen',
        tags: ['bodily resurrection', 'appearances', 'disciples'],
      },
      {
        id: 'resurrection:kp:7',
        ref: v('JHN', 20, 24, 29),
        title: 'My Lord and my God',
        note: text(
          'Thomas, who refused to believe without seeing, is invited to touch the wounds and responds with the Gospel’s highest confession; Jesus blesses those who believe without seeing.',
          synthesis(cite('bsb', 'John 20:24–29')),
        ),
        group: 'Christ is risen',
        tags: ['thomas', 'doubt', 'faith', 'deity of christ'],
      },
      {
        id: 'resurrection:kp:8',
        ref: v('1CO', 15, 1, 28),
        title: 'Christ the firstfruits',
        note: text(
          'Paul recites the gospel tradition he received and its many witnesses, argues that everything stands or falls with Christ’s resurrection, and presents Christ as the firstfruits of the harvest to come.',
          synthesis(cite('bsb', '1 Cor 15:1–28')),
        ),
        group: 'Christ is risen',
        tags: ['gospel', 'witnesses', 'firstfruits', 'paul'],
      },
      {
        id: 'resurrection:kp:9',
        ref: v('ACT', 2, 22, 32),
        title: 'God raised him up',
        note: text(
          'At Pentecost Peter proclaims that death could not keep its hold on Jesus, and that the apostles are witnesses that God raised him.',
          synthesis(cite('bsb', 'Acts 2:22–32')),
        ),
        group: 'Christ is risen',
        tags: ['preaching', 'witnesses', 'pentecost'],
      },
      {
        id: 'resurrection:kp:10',
        ref: v('JHN', 11, 17, 27),
        title: 'I am the resurrection and the life',
        note: text(
          'Martha believes in a resurrection at the last day; Jesus reveals that resurrection life is found in himself, before raising her brother Lazarus (11:43–44).',
          synthesis(cite('bsb', 'John 11:17–27'), cite('bsb', 'John 11:43–44')),
        ),
        group: 'Our resurrection',
        tags: ['lazarus', 'eternal life', 'faith', 'grief'],
      },
      {
        id: 'resurrection:kp:11',
        ref: v('1CO', 15, 35, 58),
        title: 'Raised imperishable',
        note: text(
          'Like a seed and the plant it becomes, the resurrection body will be continuous with the present body yet transformed—imperishable, glorious, powerful and spiritual—when death itself is finally defeated.',
          synthesis(cite('bsb', '1 Cor 15:35–58')),
        ),
        group: 'Our resurrection',
        tags: ['resurrection body', 'victory', 'transformation'],
      },
      {
        id: 'resurrection:kp:12',
        ref: v('PHP', 3, 20, 21),
        title: 'Like his glorious body',
        note: text(
          'Believers, citizens of heaven, await a Saviour from there who will transform their lowly bodies to be like his glorious body.',
          synthesis(cite('bsb', 'Phil 3:20–21')),
        ),
        group: 'Our resurrection',
        tags: ['second coming', 'transformation', 'citizenship'],
      },
    ],
  },
  anchor: v('1CO', 15, 1, 28),
  suggestedQuestions: [
    'What evidence does Paul give for the resurrection?',
    'Why does the resurrection matter for Christian faith?',
    'What will our resurrection bodies be like?',
    'Does the Old Testament teach resurrection?',
    'What does “firstfruits” mean in 1 Corinthians 15:20?',
  ],
};

export default topic;
