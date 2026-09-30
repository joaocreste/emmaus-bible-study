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
  id: 'hope',
  name: 'Hope',
  aliases: [
    'hope',
    'hopeful',
    'hopeless',
    'hopelessness',
    'christian hope',
    'living hope',
    'hope in god',
    'blessed hope',
    'future hope',
    'despair',
    'waiting on god',
    'wait for the lord',
    'what does the bible say about hope',
    'elpis',
  ],
  topic: {
    name: 'Hope',
    question: 'What does the Bible say about hope?',
    definition: text(
      'Biblical hope is confident expectation grounded in God’s character and promises, not wishful thinking. Amid the ruins of Jerusalem, Lamentations finds hope in the LORD’s mercies, which never fail and are renewed each morning (Lam 3:21–24), and Israel is urged to wait for the LORD and hope in his word (Ps 130:5–7). The New Testament anchors hope in Christ’s resurrection: God has given new birth into a living hope (1 Pet 1:3). Hope looks toward coming glory—the redemption of our bodies and of a groaning creation (Rom 8:18–25), Christ’s appearing (Titus 2:13), and a new creation without death or tears (Rev 21:1–5). It does not disappoint, because God’s love has been poured into our hearts by the Spirit (Rom 5:5); it steadies the soul like an anchor (Heb 6:19) and moves believers toward purity (1 John 3:3).',
      synthesis(
        cite('bsb', 'Lam 1:1–8'),
        cite('bsb', 'Lam 3:19–26'),
        cite('bsb', 'Ps 130:5–7'),
        cite('bsb', '1 Pet 1:3'),
        cite('bsb', 'Rom 8:18–25'),
        cite('bsb', 'Titus 2:13'),
        cite('bsb', 'Rev 21:1–5'),
        cite('bsb', 'Rom 5:5'),
        cite('bsb', 'Heb 6:19'),
        cite('bsb', '1 John 3:3'),
      ),
    ),
    keyPassages: [
      {
        id: 'hope:kp:1',
        ref: v('LAM', 3, 19, 26),
        title: 'His mercies never fail',
        note: text(
          'Remembering his affliction, the poet deliberately calls God’s unfailing love and faithfulness to mind—and so finds hope and learns to wait quietly for the LORD’s salvation.',
          synthesis(cite('bsb', 'Lam 3:19–26')),
        ),
        group: 'Hope in the Old Testament',
        tags: ['lament', 'faithfulness', 'waiting', 'mercy'],
      },
      {
        id: 'hope:kp:2',
        ref: ch('PSA', 130),
        title: 'Out of the depths',
        note: text(
          'Crying from the depths, the psalmist trusts a God who forgives, waits for him more than watchmen wait for morning, and calls Israel to hope in the LORD.',
          synthesis(cite('bsb', 'Ps 130')),
        ),
        group: 'Hope in the Old Testament',
        tags: ['waiting', 'forgiveness', 'psalms', 'redemption'],
      },
      {
        id: 'hope:kp:3',
        ref: v('ISA', 40, 27, 31),
        title: 'Those who wait upon the LORD',
        note: text(
          'To a people who feel ignored by God, the tireless Creator promises renewed strength to those who wait for him.',
          synthesis(cite('bsb', 'Isa 40:27–31')),
        ),
        group: 'Hope in the Old Testament',
        tags: ['strength', 'waiting', 'creator', 'weariness'],
      },
      {
        id: 'hope:kp:4',
        ref: v('JER', 29, 10, 14),
        title: 'A future and a hope',
        note: text(
          'This famous promise first belonged to a letter to the exiles in Babylon (29:1): after seventy years God will restore them, and they will seek and find him.',
          synthesis(cite('bsb', 'Jer 29:1'), cite('bsb', 'Jer 29:10–14')),
        ),
        group: 'Hope in the Old Testament',
        tags: ['exile', 'restoration', 'promise', 'context'],
      },
      {
        id: 'hope:kp:5',
        ref: v('1PE', 1, 3, 9),
        title: 'A living hope',
        note: text(
          'Peter blesses God for new birth into a living hope through Jesus’ resurrection and an inheritance kept in heaven—a hope that sustains joy even in trials.',
          synthesis(cite('bsb', '1 Pet 1:3–9')),
        ),
        group: 'A living hope in Christ',
        tags: ['resurrection', 'new birth', 'inheritance', 'joy'],
      },
      {
        id: 'hope:kp:6',
        ref: v('ROM', 5, 1, 5),
        title: 'Hope does not disappoint',
        note: text(
          'Suffering produces perseverance, character and hope—a hope that does not disappoint because God has poured his love into our hearts through the Holy Spirit.',
          synthesis(cite('bsb', 'Rom 5:1–5')),
        ),
        group: 'A living hope in Christ',
        tags: ['suffering', 'character', 'holy spirit', 'love of god'],
      },
      {
        id: 'hope:kp:7',
        ref: v('1TH', 4, 13, 18),
        title: 'Not grieving without hope',
        note: text(
          'Christians grieve, but not like those who have no hope: because Jesus died and rose, those who have died in him will rise and be with the Lord.',
          synthesis(cite('bsb', '1 Thess 4:13–18')),
        ),
        group: 'A living hope in Christ',
        tags: ['grief', 'death', 'resurrection', 'second coming'],
      },
      {
        id: 'hope:kp:8',
        ref: v('HEB', 6, 17, 20),
        title: 'An anchor for the soul',
        note: text(
          'God’s promise, confirmed by an oath, gives believers a firm hope that reaches into God’s presence, where Jesus has entered as their forerunner.',
          synthesis(cite('bsb', 'Heb 6:17–20')),
        ),
        group: 'A living hope in Christ',
        tags: ['promise', 'anchor', 'high priest', 'assurance'],
      },
      {
        id: 'hope:kp:9',
        ref: v('ROM', 8, 18, 25),
        title: 'Creation waits in eager expectation',
        note: text(
          'Present sufferings are not worth comparing with the coming glory. Creation and believers groan together, waiting in hope for the redemption of the body.',
          synthesis(cite('bsb', 'Rom 8:18–25')),
        ),
        group: 'The hope of glory',
        tags: ['creation', 'suffering', 'glory', 'redemption'],
      },
      {
        id: 'hope:kp:10',
        ref: v('TIT', 2, 11, 14),
        title: 'The blessed hope',
        note: text(
          'God’s grace trains believers to live godly lives now as they wait for the glorious appearing of Jesus Christ.',
          synthesis(cite('bsb', 'Titus 2:11–14')),
        ),
        group: 'The hope of glory',
        tags: ['second coming', 'grace', 'godliness'],
      },
      {
        id: 'hope:kp:11',
        ref: v('1JN', 3, 2, 3),
        title: 'We shall be like him',
        note: text(
          'Believers do not yet know all they will be, but when Christ appears they will be like him; everyone with this hope purifies himself.',
          synthesis(cite('bsb', '1 John 3:2–3')),
        ),
        group: 'The hope of glory',
        tags: ['transformation', 'purity', 'second coming'],
      },
      {
        id: 'hope:kp:12',
        ref: v('REV', 21, 1, 5),
        title: 'All things new',
        note: text(
          'John sees a new heaven and a new earth where God dwells with his people, wipes away every tear and ends death, mourning and pain.',
          synthesis(cite('bsb', 'Rev 21:1–5')),
        ),
        group: 'The hope of glory',
        tags: ['new creation', 'new jerusalem', 'comfort'],
      },
    ],
  },
  anchor: v('1PE', 1, 3, 9),
  suggestedQuestions: [
    'What is the difference between biblical hope and wishful thinking?',
    'What is the Greek word behind “hope”?',
    'What was the original setting of the promise of “a future and a hope”?',
    'How does hope help in suffering?',
    'What is the “blessed hope”?',
  ],
};

export default topic;
