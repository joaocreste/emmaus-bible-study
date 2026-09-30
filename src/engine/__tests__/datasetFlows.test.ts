/**
 * The QA flows over the REAL curated library and the REAL bundled datasets in
 * public/data (read with the Node file-system loader). Blocks skip when the
 * curated study they need is missing, so content work in progress never breaks
 * them; lexical assertions use STEPBible data that does not change.
 */
import { describe, expect, it } from 'vitest';
import type { ConversationState, Study } from '../../domain/models';
import { refKey } from '../../domain/reference';
import { createCuratedProviders } from '../../providers/curated';
import { createLocalDatasetProviders } from '../../providers/local';
import { createFsLoader } from '../../providers/local/__tests__/fsLoader';
import type { ProviderRegistry } from '../../providers/types';
import { LocalStudyEngine } from '../LocalStudyEngine';
import type { EngineResult } from '../types';

const curated = createCuratedProviders();
const providers: ProviderRegistry = { ...createLocalDatasetProviders({ loader: createFsLoader(), allowRemoteFallback: false }), ...curated };
const has = (id: string) => Boolean(curated.studies.get(id));

/** Open a study with the first message, then ask the rest, carrying state like the session store. */
async function conversation(messages: string[]): Promise<EngineResult[]> {
  const engine = new LocalStudyEngine(providers);
  let study: Study | null = null;
  let conv: ConversationState = {};
  const out: EngineResult[] = [];
  for (const m of messages) {
    const r = await engine.respond(m, { study, history: [], conversation: conv, translation: 'BSB' });
    study = r.study ?? study;
    conv = r.conversation;
    out.push(r);
  }
  return out;
}

describe.skipIf(!has('john-1') || !has('grace') || !has('psalm-23') || !has('romans-8'))('QA: the Greek word for “flesh” (critical)', () => {
  it('John 1 names σάρξ from 1:14, not λόγος', async () => {
    const [, r] = await conversation(['John 1', 'What does the Greek word for flesh mean?']);
    expect(r.reply.text).not.toMatch(/word behind it is λόγος/);
    expect(r.reply.text).toContain('σάρξ');
    expect(r.inspector).toMatchObject({ strong: 'G4561', verse: { book: 'JHN', chapter: 1, verse: 14 } });
  });

  it('John 1 corrects “Paul” to John', async () => {
    const [, r] = await conversation(['John 1', 'What does Paul mean by flesh here?']);
    expect(r.reply.text).toContain('it is John, not Paul');
  });

  it('Grace names σάρξ in Ephesians 2:3, not σῴζω, and does not highlight “saved”', async () => {
    const [, r] = await conversation(['Grace', 'What does Paul mean by flesh here?']);
    expect(r.reply.text).not.toMatch(/word behind it is σῴζω/);
    expect(r.inspector).toMatchObject({ strong: 'G4561', verse: { book: 'EPH', chapter: 2, verse: 3 } });
    expect(r.focus?.highlightWordIds ?? []).not.toContain('grace:kw:sozo');
  });

  it('Psalm 23 points to Romans 8’s σάρξ, never to ἔλεος', async () => {
    const [, r] = await conversation(['Psalm 23', 'What does the Greek word for flesh mean?']);
    expect(r.reply.text).not.toContain('ἔλεος');
    expect(r.reply.text).toMatch(/Romans 8 — σάρξ/);
  });
});

describe('QA: occurrence counts match the Inspector (words in verses)', () => {
  it.skipIf(!has('romans-8'))('σάρξ occurs 147 times in 126 verses', async () => {
    const [, r] = await conversation(['Romans 8', 'What does Paul mean by flesh here?']);
    expect(r.reply.text).toContain('σάρξ occurs 147 times in 126 verses of the Greek New Testament');
  });
});

describe('QA: English → original alignment', () => {
  const cases: [string[], string][] = [
    [['John 3:16', 'What does the Greek word for love mean?'], 'G25'],
    [['John 3:16', 'What does "only begotten" mean here?'], 'G3439'],
    [['Genesis', 'What is the Hebrew word for "create"?'], 'H1254'],
    [['Genesis', 'Genesis 12', 'What is the Hebrew word for "create"?'], 'H1254'],
    [['Philippians 4', 'What is the Greek word behind “anxious” in Philippians 4:6?'], 'G3309'],
    [['Ephesians 1', 'What is the Greek word for “predestine”?'], 'G4309'],
  ];
  for (const [messages, strong] of cases) {
    it(`${messages.join(' → ')} → ${strong}`, async () => {
      const rs = await conversation(messages);
      const r = rs[rs.length - 1];
      expect(r.reply.declined).toBeFalsy();
      expect(r.inspector).toMatchObject({ type: 'word', strong });
    });
  }

  it('a phrase is aligned word by word ("poor in spirit")', async () => {
    const [, r] = await conversation(['Matthew 5-7', 'What does "poor in spirit" mean?']);
    expect(r.reply.text).toContain('πτωχός');
    expect(r.reply.text).toContain('πνεῦμα');
  });

  it('lexicon replies carry no apparatus and end sentences before the count', async () => {
    const [, r] = await conversation(['John 3:16', 'What does world mean?']);
    expect(r.reply.text).not.toMatch(/LXX|Hom\.|al\.;|\bcf\./);
    expect(r.reply.text).toMatch(/\. κόσμος occurs \d+ times in \d+ verses/);
  });

  it.skipIf(!has('suffering'))('a word missing from the verse asked about is found in the passage', async () => {
    const [, , r] = await conversation(['Suffering', 'Explain verse 12', 'What does grace mean in this verse?']);
    expect(r.reply.text).toContain('isn’t in 4:12');
    expect(r.inspector).toMatchObject({ strong: 'G5485', verse: { book: '2CO', chapter: 4, verse: 15 } });
  });
});

describe.skipIf(!has('john-1') || !has('psalm-23'))('QA: connect, cross-references and titles', () => {
  it('“How does John 1 connect with Genesis?” targets Genesis', async () => {
    const [, r] = await conversation(['John 1', 'How does John 1 connect with Genesis?']);
    expect(r.intent).toMatchObject({ kind: 'connect', slots: { bookFilter: 'GEN' } });
    expect(r.reply.text).toContain('Genesis');
    expect(r.focus?.crossReferenceFilter).toEqual({ book: 'GEN' });
  });

  it('“Where else does the Bible call God a shepherd?” ranks by shepherd, not the earlier concept', async () => {
    const [, , r] = await conversation(['Psalm 23', 'What does “the valley of the shadow of death” mean in Hebrew?', 'Where else does the Bible call God a shepherd?']);
    expect(r.intent.slots.term).toBe('shepherd');
    expect(r.focus?.reason).toMatch(/shepherd/i);
    expect(r.focus?.reason).not.toMatch(/valley/i);
  });

  it('“Why is Jesus called the Lamb of God?” opens the Lamb of God concept and ἀμνός', async () => {
    const [, r] = await conversation(['John 1', 'Why is Jesus called the Lamb of God?']);
    expect(r.intent.kind).toBe('word-study');
    expect(r.reply.text).toContain('ἀμνός');
    expect(r.focus?.highlightWordIds?.length).toBeGreaterThan(0);
  });
});

describe('QA: passages that belong to curated studies, and named passages', () => {
  it.skipIf(!has('grace'))('a verse inside a topic study’s anchor opens that study', async () => {
    const [r] = await conversation(['Eph 2:8-9']);
    expect(r.study?.id).toBe('grace');
  });

  it.skipIf(!has('suffering'))('a chapter around a topic study’s anchor opens a library study that points to it', async () => {
    const [r] = await conversation(['2 Corinthians 4']);
    expect(r.study?.depth).toBe('library');
    expect(r.reply.text).toContain('Suffering');
    expect(r.reply.suggestions?.[0]).toMatch(/suffering/i);
  });

  it.skipIf(!has('suffering'))('a word study in that library study answers from the curated concept', async () => {
    const [, r] = await conversation(['2 Corinthians 4', 'What does Paul mean by jars of clay?']);
    expect(r.reply.declined).toBeFalsy();
    expect(r.reply.text).toContain('Suffering');
  });

  it('“I want to understand the Sermon on the Mount” opens Matthew 5–7', async () => {
    const [r] = await conversation(['I want to understand the Sermon on the Mount']);
    expect(refKey(r.study!.passage!)).toBe('MAT.5-7');
  });

  it('“Who is Jesus?” does not open an unrelated topic', async () => {
    const [r] = await conversation(['Who is Jesus?']);
    expect(r.study).toBeUndefined();
    expect(r.reply.suggestions).toContain('Study John 1');
  });
});

describe('QA: library studies answer from their introductions and notes', () => {
  it('“Who wrote this and when?” gives the author and date', async () => {
    const [, r] = await conversation(['Genesis', 'Who wrote this and when?']);
    expect(r.reply.text).toContain('Moses');
    expect(r.reply.text).toMatch(/Date/);
  });

  it('the key words of Matthew 5–7 scan all three chapters and skip function words', async () => {
    const [, r] = await conversation(['Matthew 5-7', 'What are the key words in this passage?']);
    expect(r.reply.text).toContain('Matthew 5–7');
    expect(r.reply.text).not.toMatch(/εἷς|πᾶς/);
    for (const s of r.reply.suggestions ?? []) expect(s).not.toMatch(/\w\. mean/);
  });

  it('perspectives in a library study name only sections it has', async () => {
    const [, r] = await conversation(['Matthew 5-7', 'Are there different theological interpretations of this passage?']);
    expect(r.reply.blocks?.map((b) => ('text' in b ? b.text : '')).join(' ')).not.toContain('{{section:theology}}');
  });
});

describe('QA: every topic’s suggested questions are answered from grounded content', () => {
  it('none is declined, and nearly all bring a specific item into focus', async () => {
    const engine = new LocalStudyEngine(providers);
    const topics = await curated.topics.listTopics();
    let total = 0;
    let focused = 0;
    const declined: string[] = [];
    for (const t of topics) {
      const opened = await engine.respond(t.name, { study: null, history: [], conversation: {}, translation: 'BSB' });
      const study = opened.study!;
      for (const q of study.suggestedQuestions) {
        const r = await engine.respond(q, { study, history: [], conversation: {}, translation: 'BSB' });
        total++;
        if (r.reply.declined) declined.push(`${t.name}: ${q}`);
        const f = r.focus;
        if (r.inspector || f?.expandIds?.length || f?.pinIds?.length || f?.highlightWordIds?.length || f?.highlightVerses?.length) focused++;
      }
    }
    expect(declined).toEqual([]);
    expect(focused / Math.max(1, total)).toBeGreaterThanOrEqual(0.85);
  });
});
