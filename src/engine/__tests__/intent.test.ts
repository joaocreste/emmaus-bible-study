import { describe, expect, it } from 'vitest';
import type { ConversationState, Study } from '../../domain/models';
import { refKey } from '../../domain/reference';
import { StudyAssembler } from '../assemble';
import { classifyMessage, type ClassifierEnv } from '../intent';
import { normalizeTopicQuery } from '../text';
import type { IntentKind } from '../types';
import { createFakeProviders } from './fixtures/providers';
import { FIXTURE_ROMANS_8 } from './fixtures/studies';

const providers = createFakeProviders();
const romans8: Study = new StudyAssembler(providers).fromCurated(FIXTURE_ROMANS_8);
const KNOWN_TOPICS = ['grace', 'faith', 'forgiveness', 'suffering', 'prayer', 'salvation', 'trinity', 'holy spirit', 'marriage', 'anxiety', 'predestination', 'kingdom of god', 'wealth'];

function env(study: Study | null, conversation: ConversationState = {}): ClassifierEnv {
  return {
    study,
    conversation,
    findAuthor: (t) => providers.sources.findAuthor(t),
    isKnownTopic: (p) => KNOWN_TOPICS.includes(p),
  };
}

describe('classifyMessage — passages (no study open)', () => {
  const cases: [string, string][] = [
    ['John 1:1', 'JHN.1.1'],
    ['Romans 8', 'ROM.8'],
    ['Matthew 5–7', 'MAT.5-7'],
    ['Genesis', 'GEN'],
    ['Psalm 23', 'PSA.23'],
    ['study John 3:16', 'JHN.3.16'],
    ["let's look at Psalm 1", 'PSA.1'],
    ['Can we study Romans 12?', 'ROM.12'],
    ['Tell me about Genesis', 'GEN'],
    ['the book of Romans', 'ROM'],
    ['Acts', 'ACT'],
  ];
  for (const [msg, key] of cases) {
    it(msg, () => {
      const p = classifyMessage(msg, env(null));
      expect(p.intent.kind).toBe('open-passage');
      expect(refKey(p.intent.slots.passage!)).toBe(key);
    });
  }
});

describe('classifyMessage — topics (no study open)', () => {
  const cases: [string, string][] = [
    ['Grace', 'grace'],
    ['Faith', 'faith'],
    ['Forgiveness', 'forgiveness'],
    ['Suffering', 'suffering'],
    ['Prayer', 'prayer'],
    ['Salvation', 'salvation'],
    ['The Trinity', 'trinity'],
    ['The Holy Spirit', 'holy spirit'],
    ['Marriage', 'marriage'],
    ['Anxiety', 'anxiety'],
    ['Predestination', 'predestination'],
    ['The Kingdom of God', 'kingdom of god'],
    ['What does the Bible say about wealth?', 'wealth'],
    ['Why does God allow suffering?', 'suffering'],
    ['what is grace', 'grace'],
    ['Tell me about forgiveness', 'forgiveness'],
  ];
  for (const [msg, topic] of cases) {
    it(msg, () => {
      const p = classifyMessage(msg, env(null));
      expect(p.intent.kind).toBe('open-topic');
      expect(p.intent.slots.topic).toBe(topic);
    });
  }
});

describe('classifyMessage — tricky negatives', () => {
  it('"what is grace" is not Isaiah', () => {
    const p = classifyMessage('what is grace', env(null));
    expect(p.intent.slots.passage).toBeUndefined();
    expect(p.references).toHaveLength(0);
  });
  it('"Acts of kindness" is not the book of Acts', () => {
    const p = classifyMessage('Acts of kindness', env(null));
    expect(p.intent.kind).not.toBe('open-passage');
    expect(p.intent.slots.passage).toBeUndefined();
    expect(p.intent.slots.topic).toBe('acts of kindness');
  });
  it('"Is God good?" is not Isaiah', () => {
    expect(classifyMessage('Is God good?', env(null)).intent.slots.passage).toBeUndefined();
  });
  it('"be strong in the Lord" does not summon James Strong', () => {
    const p = classifyMessage('What does it mean to be strong in the Lord?', env(romans8));
    expect(p.intent.kind).not.toBe('commentary');
  });
  it('"Mark my words" is not the Gospel of Mark', () => {
    expect(classifyMessage('Mark my words', env(null)).intent.kind).not.toBe('open-passage');
  });
});

describe('classifyMessage — greetings, help, sources', () => {
  it.each([
    ['Hi', 'greeting'],
    ['Thanks!', 'greeting'],
    ['help', 'help'],
    ['What can you do?', 'help'],
    ['Where does this come from?', 'sources'],
    ['Show me the sources', 'sources'],
  ] as [string, IntentKind][])('%s → %s', (msg, kind) => {
    expect(classifyMessage(msg, env(romans8)).intent.kind).toBe(kind);
  });
  it('a greeting prefix does not hide the request', () => {
    const p = classifyMessage('Hello, can we study Romans 8?', env(null));
    expect(p.intent.kind).toBe('open-passage');
    expect(refKey(p.intent.slots.passage!)).toBe('ROM.8');
  });
});

describe('classifyMessage — follow-ups inside Romans 8 (spec §4, §14, §20)', () => {
  const conv: ConversationState = { activeConceptId: 'concept-condemnation', activeVerse: { book: 'ROM', chapter: 8, verse: 1 } };
  const cases: [string, IntentKind, Record<string, unknown>][] = [
    ['What does Paul mean by flesh here?', 'word-study', { term: 'flesh' }],
    ['Show me other passages where this idea appears.', 'cross-references', {}],
    ["What is the Greek word behind 'grace'?", 'word-study', { term: 'grace', language: 'greek' }],
    ['What is the Greek word behind “grace”?', 'word-study', { term: 'grace', language: 'greek' }],
    ['What did Tim Keller say about this?', 'commentary', { authorId: 'tim-keller' }],
    ['Show me what Tim Keller says about this', 'commentary', { authorId: 'tim-keller' }],
    ['How would the original audience have understood this?', 'historical-context', {}],
    ['How does this connect with Romans?', 'connect', { bookFilter: 'ROM' }],
    ['Explain verse 12 in more detail.', 'explain-verse', {}],
    ['Are there different theological interpretations of this passage?', 'perspectives', {}],
    ['What does condemnation mean?', 'word-study', { term: 'condemnation' }],
    ['Where else does Paul talk about this?', 'cross-references', { traditionalAuthor: 'Paul' }],
    ['What does grace mean in this verse?', 'word-study', { term: 'grace' }],
    ['What does Calvin say?', 'commentary', { authorId: 'calvin' }],
    ['What did Matthew Henry write on this?', 'commentary', { authorId: 'matthew-henry' }],
    ['What is the structure of this passage?', 'literary-context', {}],
    ['What does this passage teach about the Spirit?', 'theology', { term: 'spirit' }],
    ['What do classic commentators say?', 'commentary', {}],
    ['What are the key words in this passage?', 'word-study', {}],
    ['Show cross-references', 'cross-references', {}],
    ['What is the historical background?', 'historical-context', {}],
    ['Where else does John talk about this?', 'cross-references', { traditionalAuthor: 'John' }],
    ['Are there quotations of this in the Old Testament?', 'cross-references', {}],
    ['Who wrote this?', 'historical-context', {}],
    ['Tell me about adoption', 'word-study', { term: 'adoption' }],
  ];
  for (const [msg, kind, slots] of cases) {
    it(msg, () => {
      const p = classifyMessage(msg, env(romans8, conv));
      expect(p.intent.kind).toBe(kind);
      expect(p.intent.slots).toMatchObject(slots);
    });
  }

  it('"What does grace mean in this verse?" carries the active verse', () => {
    const p = classifyMessage('What does grace mean in this verse?', env(romans8, conv));
    expect(p.intent.slots.verse).toEqual({ book: 'ROM', chapter: 8, verse: 1 });
  });
  it('"Explain verse 12" resolves to Romans 8:12', () => {
    expect(classifyMessage('Explain verse 12 in more detail.', env(romans8)).intent.slots.verse).toEqual({ book: 'ROM', chapter: 8, verse: 12 });
  });
  it('"v. 12" and "8:28" resolve inside the current book', () => {
    expect(classifyMessage('v. 12', env(romans8)).intent).toMatchObject({ kind: 'explain-verse', slots: { verse: { book: 'ROM', chapter: 8, verse: 12 } } });
    expect(classifyMessage('What does 8:28 mean?', env(romans8)).intent).toMatchObject({ kind: 'explain-verse', slots: { verse: { book: 'ROM', chapter: 8, verse: 28 } } });
  });
  it('"vv. 12–14" is a range', () => {
    const p = classifyMessage('Explain vv. 12–14', env(romans8));
    expect(p.intent.kind).toBe('explain-verse');
    expect(refKey(p.intent.slots.passage!)).toBe('ROM.8.12-14');
  });
  it('"the last verse" is flagged for the engine to resolve', () => {
    const p = classifyMessage('Explain the last verse', env(romans8));
    expect(p.lastVerse).toBe(true);
  });
  it('a reference inside the study explains the verse instead of opening a study', () => {
    const p = classifyMessage('Romans 8:28', env(romans8));
    expect(p.intent.kind).toBe('explain-verse');
    expect(p.intent.slots.verse).toEqual({ book: 'ROM', chapter: 8, verse: 28 });
  });
  it('a reference outside the study opens it', () => {
    const p = classifyMessage('Romans 5', env(romans8));
    expect(p.intent.kind).toBe('open-passage');
    expect(refKey(p.intent.slots.passage!)).toBe('ROM.5');
  });
  it('connect words never switch study', () => {
    const p = classifyMessage('How does this relate to Genesis 1?', env(romans8));
    expect(p.intent.kind).toBe('connect');
    expect(refKey(p.intent.slots.passage!)).toBe('GEN.1');
  });
  it('a bare curated concept stays a word study; a bare known topic opens it', () => {
    expect(classifyMessage('Flesh', env(romans8)).intent).toMatchObject({ kind: 'word-study', slots: { term: 'flesh' } });
    expect(classifyMessage('Marriage', env(romans8)).intent).toMatchObject({ kind: 'open-topic', slots: { topic: 'marriage' } });
  });
  it('explicit topic phrasing opens the topic even inside a study', () => {
    expect(classifyMessage('What does the Bible say about wealth?', env(romans8)).intent).toMatchObject({ kind: 'open-topic', slots: { topic: 'wealth' } });
  });
  it('"this word" resolves to the active key word', () => {
    const p = classifyMessage('What does this word mean?', env(romans8, { activeWordId: 'kw-sarx' }));
    expect(p.intent).toMatchObject({ kind: 'word-study', slots: { term: 'flesh' } });
  });
  it('relationship words become filters', () => {
    const p = classifyMessage('Show me prophecy fulfilment links', env(romans8));
    expect(p.intent.kind).toBe('cross-references');
    expect(p.relationships).toContain('prophecy-fulfillment');
  });
});

describe('normalizeTopicQuery', () => {
  it.each([
    ['What does the Bible say about wealth?', 'wealth'],
    ['Why does God allow suffering?', 'suffering'],
    ['Tell me about the Kingdom of God', 'kingdom of god'],
    ['study prayer', 'prayer'],
    ["What's the biblical view of marriage?", 'marriage'],
    ['explore The Holy Spirit', 'holy spirit'],
  ])('%s → %s', (q, out) => {
    expect(normalizeTopicQuery(q)).toBe(out);
  });
});

describe('classifyMessage — more edge cases', () => {
  it('"What does John 3:16 mean?" explains the verse (not a word study)', () => {
    const p = classifyMessage('What does John 3:16 mean?', env(null));
    expect(p.intent.kind).toBe('explain-verse');
    expect(p.intent.slots.verse).toEqual({ book: 'JHN', chapter: 3, verse: 16 });
  });
  it('"What does Romans 8:28 mean?" inside Romans 8 stays in the study', () => {
    expect(classifyMessage('What does Romans 8:28 mean?', env(romans8)).intent).toMatchObject({ kind: 'explain-verse', slots: { verse: { book: 'ROM', chapter: 8, verse: 28 } } });
  });
  it('"Explain this" explains the active verse', () => {
    const p = classifyMessage('Explain this', env(romans8, { activeVerse: { book: 'ROM', chapter: 8, verse: 15 } }));
    expect(p.intent).toMatchObject({ kind: 'explain-verse', slots: { verse: { book: 'ROM', chapter: 8, verse: 15 } } });
  });
  it('"Who wrote Romans?" with no study is a question about the book', () => {
    const p = classifyMessage('Who wrote Romans?', env(null));
    expect(p.intent.kind).toBe('historical-context');
    expect(refKey(p.intent.slots.passage!)).toBe('ROM');
  });
  it('"Where else does John talk about this?" inside a study never treats John as a passage', () => {
    const p = classifyMessage('Where else does John talk about this?', env(romans8));
    expect(p.references).toHaveLength(0);
    expect(p.intent.slots.passage).toBeUndefined();
  });
});

describe('classifyMessage — phrasing around references', () => {
  it('"What does the Bible say about Romans 8?" opens the passage', () => {
    expect(classifyMessage('What does the Bible say about Romans 8?', env(null)).intent).toMatchObject({ kind: 'open-passage' });
  });
  it('"How does this differ from Galatians 5?" is a connect question', () => {
    expect(classifyMessage('How does this differ from Galatians 5?', env(romans8)).intent).toMatchObject({ kind: 'connect', slots: { bookFilter: 'GAL' } });
  });
  it('"How do Reformed and Arminian readers differ here?" stays a perspectives question', () => {
    expect(classifyMessage('How do Reformed and Arminian readers differ here?', env(romans8)).intent.kind).toBe('perspectives');
  });
});

describe('text helpers', () => {
  it('lowerFirst keeps names and acronyms', async () => {
    const { lowerFirst, asSentence } = await import('../text');
    expect(lowerFirst('The LORD as shepherd')).toBe('the LORD as shepherd');
    expect(lowerFirst('Condemnation')).toBe('condemnation');
    expect(lowerFirst('Holy Spirit')).toBe('Holy Spirit');
    expect(lowerFirst('LORD')).toBe('LORD');
    expect(asSentence('Who wrote it?')).toBe('Who wrote it?');
    expect(asSentence('Courtroom language')).toBe('Courtroom language.');
  });
});

/** A minimal John 1 passage study (fixture: no content, only what the classifier reads). */
const john1: Study = {
  ...romans8,
  id: 'fixture-john-1',
  title: 'John 1',
  passage: { book: 'JHN', startChapter: 1 },
  keyWords: [],
  concepts: [
    { ...romans8.concepts[0], id: 'concept-lamb', label: 'The Lamb of God', aliases: ['lamb', 'lamb of god', 'amnos'], keyWordIds: [] },
    { ...romans8.concepts[0], id: 'concept-shepherd', label: 'The good shepherd', aliases: ['good shepherd'], keyWordIds: [] },
  ],
  crossReferences: [],
};

describe('classifyMessage — connect names the other book (QA: "How does John 1 connect with Genesis?")', () => {
  it('the study’s own reference is not the target; the other book is', () => {
    const p = classifyMessage('How does John 1 connect with Genesis?', env(john1));
    expect(p.intent.kind).toBe('connect');
    expect(p.intent.slots.bookFilter).toBe('GEN');
    expect(p.connect).toEqual({ book: 'GEN' });
  });
  it('the order of the books does not matter', () => {
    expect(classifyMessage('How does Genesis relate to John 1?', env(john1)).intent.slots.bookFilter).toBe('GEN');
  });
  it('the study’s own book alone still means "the rest of the book"', () => {
    expect(classifyMessage('How does this connect with Romans?', env(romans8)).connect).toEqual({ book: 'ROM' });
  });
});

describe('classifyMessage — named passages', () => {
  const cases: [string, string, string][] = [
    ['I want to understand the Sermon on the Mount', 'MAT.5-7', 'sermon on the mount'],
    ['Sermon on the Mount', 'MAT.5-7', 'sermon on the mount'],
    ['the Beatitudes', 'MAT.5.3-12', 'beatitudes'],
    ["the Lord's Prayer", 'MAT.6.9-13', "lord's prayer"],
    ['Tell me about the prodigal son', 'LUK.15.11-32', 'prodigal son'],
    ['the Ten Commandments', 'EXO.20.1-17', 'ten commandments'],
  ];
  for (const [msg, key, name] of cases) {
    it(`${msg} → ${key}`, () => {
      const p = classifyMessage(msg, env(null));
      expect(p.intent.kind).toBe('open-passage');
      expect(refKey(p.intent.slots.passage!)).toBe(key);
      expect(p.namedPassage).toBe(name);
    });
  }
  it('a topic of the index keeps its name ("prayer" is a topic, "the Lord’s Prayer" is not)', () => {
    expect(classifyMessage('prayer', env(null)).intent.kind).toBe('open-topic');
  });
  it('a phrase the open study knows as its own idea stays a word study', () => {
    const p = classifyMessage('What does good shepherd mean?', env(john1));
    expect(p.intent).toMatchObject({ kind: 'word-study', slots: { term: 'good shepherd' } });
    expect(p.namedPassage).toBeUndefined();
  });
});

describe('classifyMessage — the subject of a question', () => {
  it('"Why is Jesus called the Lamb of God?" is a word study of the title', () => {
    expect(classifyMessage('Why is Jesus called the Lamb of God?', env(john1)).intent).toMatchObject({ kind: 'word-study', slots: { term: 'lamb of god' } });
  });
  it('a cross-reference question keeps the word it asks about when the study knows it', () => {
    const p = classifyMessage('Where else does the Bible talk about adoption?', env(romans8));
    expect(p.intent).toMatchObject({ kind: 'cross-references', slots: { term: 'adoption' } });
  });
  it('…but not God, the Bible or the request itself', () => {
    const p = classifyMessage('Show me other passages where this idea appears', env(romans8));
    expect(p.intent.kind).toBe('cross-references');
    expect(p.intent.slots.term).toBeUndefined();
  });
});
