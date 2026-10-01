/**
 * Evidence ledger, research-tool input handling, text helpers, cache keys.
 */
import { describe, expect, it } from 'vitest';
import { formatRef } from '../../../src/domain/reference';
import { composeCacheKey, generatedStudyId, pageCacheKey } from '../cache';
import { loadInferenceConfig, NO_CREDENTIAL_REASON } from '../config';
import { EvidenceLedger, normalizeEvidenceId } from '../ledger';
import { RefChecker } from '../refs';
import { composeUserMessage, CORE_SYSTEM_PROMPT, languageInstruction, QUESTION_INSTRUCTION } from '../prompt';
import { prepareResearchCall, RESEARCH_TOOLS } from '../research';
import { toBlocks } from '../run';
import { findExactSpan, normalizeQuery, quotedSegments } from '../text';
import { createFakeKb, EASTON_DIVORCE, NAVES_DIVORCE } from './fakes';

describe('evidence ledger', () => {
  it('numbers items E1…En per request and stores identical items once', () => {
    const ledger = new EvidenceLedger();
    const [a, b, c] = ledger.addAll([NAVES_DIVORCE, EASTON_DIVORCE, { ...NAVES_DIVORCE }]);
    expect([a.evidence.id, b.evidence.id, c.evidence.id]).toEqual(['E1', 'E2', 'E1']);
    expect([a.isNew, b.isNew, c.isNew]).toEqual([true, true, false]);
    expect(ledger.size).toBe(2);
    expect(ledger.get('[e2]')?.sourceId).toBe('eastons-bible-dictionary');
    expect(normalizeEvidenceId(' E007 ')).toBe('E7');
    expect(normalizeEvidenceId('X1')).toBeNull();
  });

  it('renders compact text blocks (header with kind · source · locator) and points back to items already shown', () => {
    const ledger = new EvidenceLedger();
    const first = ledger.render(ledger.addAll([NAVES_DIVORCE]));
    expect(first).toContain('[E1] Nave’s Topical Bible — DIVORCE (topical index · naves-topical-bible · s.v. DIVORCE)');
    expect(first).toContain('General scriptures concerning: Exodus 21:7–11');
    const again = ledger.render(ledger.addAll([NAVES_DIVORCE, EASTON_DIVORCE]));
    expect(again).toMatch(/2 items \(E1, E2\) — 1 already shown earlier/);
    expect(again).toContain('[E1] Nave’s Topical Bible — DIVORCE — already shown above');
    const summaryOnly = new EvidenceLedger();
    expect(summaryOnly.render(summaryOnly.addAll([{ ...EASTON_DIVORCE, quotable: false }]))).toContain('summary only — do not quote');
  });

  it('keeps the full retrieved text of excerpted items for quotation checks', () => {
    const ledger = new EvidenceLedger({ fullText: (d) => `${d.text} And more.` });
    const { evidence } = ledger.add(EASTON_DIVORCE);
    expect(ledger.fullText(evidence).endsWith('And more.')).toBe(true);
    expect(evidence.text).toBe(EASTON_DIVORCE.text);
  });
});

describe('research tools', () => {
  const kb = createFakeKb();
  const ctx = () => ({ kb, ledger: new EvidenceLedger(), refs: new RefChecker(kb.providers.scripture), translation: 'BSB' as const });

  it('explains bad input clearly', async () => {
    const bad = async (name: Parameters<typeof prepareResearchCall>[0], input: unknown) => {
      const r = await prepareResearchCall(name, input, ctx());
      if (r.ok) throw new Error('expected an error');
      return r.error;
    };
    expect(await bad('read_passage', { reference: 'Matthew 29:1' })).toMatch(/Matthew has 28 chapters/);
    expect(await bad('read_passage', { passage: 'Matthew 19' })).toMatch(/Invalid input for read_passage/);
    expect(await bad('original_text', { reference: 'Matthew 19:1–20' })).toMatch(/at most 12 verses; Matthew 19:1–20 has 20/);
    expect(await bad('word_occurrences', { strong: 'apoluo' })).toMatch(/not a Strong’s number/);
    expect(await bad('book_introduction', { book: 'Hezekiah' })).toMatch(/Unknown book/);
    expect(await bad('cross_references', { reference: 'Matthew 5:3; John 3:16' })).toMatch(/more than one reference/);
  });

  it('describes each call for the live progress list, with the provider that serves it', async () => {
    const step = async (name: Parameters<typeof prepareResearchCall>[0], input: unknown) => {
      const r = await prepareResearchCall(name, input, ctx());
      if (!r.ok) throw new Error(r.error);
      return r.call.step;
    };
    expect(await step('commentary', { reference: 'Matt 19:3-9', sources: ['tyndale'] })).toMatchObject({ stage: 'Commentary', detail: 'Reading Tyndale’s note on Matthew 19:3–9' });
    expect(await step('search_knowledge', { query: 'divorce', kinds: ['topical-index', 'dictionary'] })).toMatchObject({
      detail: 'Searching Nave’s and Torrey’s topical indexes and the Bible dictionaries and encyclopedias for “divorce”',
      provider: 'kb:search',
    });
    expect(await step('original_text', { reference: 'Deuteronomy 24:1' })).toMatchObject({ detail: 'Reading the Hebrew text of Deuteronomy 24:1', provider: 'local:original-text' });
    expect(await step('lexicon', { query: 'g0630' })).toMatchObject({ detail: 'Looking up G630 in the lexicon' });
  });

  it('says what each call does for the reader’s study, with the passages it reads (no technical detail)', async () => {
    const reader = async (name: Parameters<typeof prepareResearchCall>[0], input: unknown) => {
      const r = await prepareResearchCall(name, input, ctx());
      if (!r.ok) throw new Error(r.error);
      return r.call.step.reader;
    };
    const mat = { book: 'MAT', startChapter: 19, startVerse: 3, endChapter: 19, endVerse: 9 };
    expect(await reader('read_passage', { references: ['Deut 24:1-4', 'Matt 19:3-9'] })).toEqual({
      kind: 'scripture',
      refs: [{ book: 'DEU', startChapter: 24, startVerse: 1, endChapter: 24, endVerse: 4 }, mat],
    });
    expect(await reader('commentary', { reference: 'Matt 19:3-9' })).toEqual({ kind: 'commentary', refs: [mat] });
    expect(await reader('original_text', { reference: 'Deuteronomy 24:1' })).toMatchObject({ kind: 'original' });
    expect(await reader('lexicon', { query: 'g0630' })).toEqual({ kind: 'words' });
    expect(await reader('search_knowledge', { query: 'divorce' })).toEqual({ kind: 'search' });
  });

  it('fetches from the knowledge base and parses references with the domain parser', async () => {
    const r = await prepareResearchCall('read_passage', { reference: 'Deut 24:1-4', translation: 'KJV' }, ctx());
    if (!r.ok) throw new Error(r.error);
    const [d] = await r.call.fetch();
    expect(d.title).toBe('Deuteronomy 24:1–4 (KJV)');
    expect(d.text).toMatch(/^24:1 When a man hath taken a wife/);
  });

  it('read_passage reads any version the knowledge base holds, defaulting to the reader’s (the tool schema is the same for every language)', async () => {
    const tool = RESEARCH_TOOLS.find((t) => t.name === 'read_passage') as { input_schema: { properties: { translation: { enum: string[] } } } };
    expect(tool.input_schema.properties.translation.enum).toEqual(expect.arrayContaining(['BSB', 'KJV', 'WEB', 'BLIVRE', 'RVR1909', 'LSG']));
    const explicit = await prepareResearchCall('read_passage', { reference: 'John 3:16', translation: 'BLIVRE' }, ctx());
    if (!explicit.ok) throw new Error(explicit.error);
    expect(explicit.call.step.detail).toBe('Reading John 3:16 (BLIVRE)');
    const byDefault = await prepareResearchCall('read_passage', { reference: 'John 3:16' }, { ...ctx(), translation: 'LSG' as const });
    if (!byDefault.ok) throw new Error(byDefault.error);
    expect(byDefault.call.step.detail).toBe('Reading John 3:16 (LSG)');
    expect((await prepareResearchCall('read_passage', { reference: 'John 3:16', translation: 'XYZ' }, ctx())).ok).toBe(false);
  });
});

describe('read_document (texts held in parts)', () => {
  const PART = {
    ...EASTON_DIVORCE,
    title: 'The Catholic Encyclopedia (1907–1914) — Divorce (in Moral Theology), 1909 (part 20)',
    text: 'Non-Christian marriage can be dissolved by absolute divorce under certain circumstances in favour of the Faith. 1. The Pauline Privilege.',
    tradition: 'Catholic',
  };
  const base = createFakeKb();
  const kb = Object.assign(Object.create(base) as typeof base, {
    partsOf: (title: string) => (/\(part (\d+)\)$/.test(title) ? { title: title.replace(/ \(part \d+\)$/, ''), part: Number(/\(part (\d+)\)$/.exec(title)![1]), total: 37 } : null),
    documentParts: async (title: string, opts: { parts?: number[]; query?: string } = {}) =>
      /Divorce/.test(title)
        ? { found: true as const, title: PART.title.replace(/ \(part \d+\)$/, ''), total: 37, drafts: [PART], contents: ['part 1: The term divorce…', 'part 20: Non-Christian marriage can be dissolved…'], unknownParts: (opts.parts ?? []).filter((n) => n > 37) }
        : { found: false as const, candidates: [] },
    search: async () => [PART],
  });
  const ctx = () => ({ kb, ledger: new EvidenceLedger(), refs: new RefChecker(kb.providers.scripture), translation: 'BSB' as const });

  it('opens the parts asked for and lists every part (navigation, not evidence)', async () => {
    const r = await prepareResearchCall('read_document', { title: 'Divorce (in Moral Theology), 1909', parts: [20, 40] }, ctx());
    if (!r.ok) throw new Error(r.error);
    expect(r.call.step.detail).toMatch(/Opening parts 20, 40 of “Divorce/);
    const drafts = await r.call.fetch();
    expect(drafts).toHaveLength(1);
    const note = r.call.after?.(drafts) ?? '';
    expect(note).toMatch(/It has no part 40\./);
    expect(note).toMatch(/has 37 parts:\npart 1: /);
  });

  it('an unknown title opens nothing and says how to find the text', async () => {
    const r = await prepareResearchCall('read_document', { title: 'Something else' }, ctx());
    if (!r.ok) throw new Error(r.error);
    expect(await r.call.fetch()).toEqual([]);
    expect(r.call.after?.([]) ?? '').toMatch(/holds no text in parts titled “Something else”/);
    expect((await prepareResearchCall('read_document', { parts: [1] }, ctx())).ok).toBe(false);
  });

  it('a search result that is one part of a longer text says how many parts it has', async () => {
    const r = await prepareResearchCall('search_knowledge', { query: 'Pauline privilege' }, ctx());
    if (!r.ok) throw new Error(r.error);
    const drafts = await r.call.fetch();
    expect(r.call.after?.(drafts) ?? '').toMatch(/“The Catholic Encyclopedia \(1907–1914\) — Divorce \(in Moral Theology\), 1909” has 37 parts \(shown: part 20\)/);
  });
});

describe('research results stay short (the least-cited kinds trimmed first)', () => {
  const ctx = (kb = createFakeKb()) => ({ kb, ledger: new EvidenceLedger(), refs: new RefChecker(kb.providers.scripture), translation: 'BSB' as const });
  const prepared = async (name: Parameters<typeof prepareResearchCall>[0], input: unknown, c = ctx()) => {
    const r = await prepareResearchCall(name, input, c);
    if (!r.ok) throw new Error(r.error);
    return r.call;
  };

  it('search_knowledge returns 5 hits (8 for a tradition’s or the confessions’ texts) unless `limit` asks for more (at most 12); find_topics 3 topics', async () => {
    const c = ctx();
    await (await prepared('search_knowledge', { query: 'divorce' }, c)).fetch();
    await (await prepared('search_knowledge', { query: 'divorce', limit: 12 }, c)).fetch();
    await (await prepared('search_knowledge', { query: 'divorce', tradition: 'Lutheran' }, c)).fetch();
    await (await prepared('search_knowledge', { query: 'divorce', kinds: ['confession'] }, c)).fetch();
    await (await prepared('search_knowledge', { query: 'divorce', kinds: ['confession'], limit: 3 }, c)).fetch();
    expect(c.kb.calls.filter((x) => x.method === 'search').map((x) => (x.args[1] as { limit?: number }).limit)).toEqual([5, 12, 8, 8, 3]);
    expect((await prepareResearchCall('search_knowledge', { query: 'divorce', limit: 13 }, c)).ok).toBe(false);
    const asked: number[] = [];
    const base = createFakeKb();
    const kb = Object.assign(Object.create(base) as typeof base, { topics: async (_q: string, limit = 6) => (asked.push(limit), []) });
    await (await prepared('find_topics', { query: 'divorce' }, ctx(kb))).fetch();
    expect(asked).toEqual([3]);
  });

  it('lexicon looks up several Strong’s numbers in one call, each once; a single query still works', async () => {
    const c = ctx();
    const call = await prepared('lexicon', { strongs: ['G630', 'g0630', 'H3748'] }, c);
    expect(call.step.detail).toBe('Looking up G630, H3748 in the lexicon');
    const drafts = await call.fetch();
    expect(c.kb.calls.filter((x) => x.method === 'lexicon').map((x) => x.args[0])).toEqual(['G630', 'H3748']);
    expect(drafts.filter((d) => d.kind === 'lexicon').map((d) => d.strong)).toEqual(['G630', 'H3748']);
    const both = await prepared('lexicon', { query: 'divorce', strongs: ['G4202'] });
    expect(both.step.detail).toBe('Looking up “divorce”, G4202 in the Hebrew and Greek lexicons');
    const bad = await prepareResearchCall('lexicon', { strongs: ['G630', 'put away'] }, ctx());
    expect(!bad.ok && bad.error).toMatch(/“put away” in `strongs` is not a Strong’s number/);
    expect((await prepareResearchCall('lexicon', {}, ctx())).ok).toBe(false);
    expect((await prepareResearchCall('lexicon', { strongs: Array.from({ length: 9 }, (_, i) => `G${i + 1}`) }, ctx())).ok).toBe(false);
  });

  it('book_introduction shows the sections on author, date, setting and purpose, and lists the others for read_document', async () => {
    const heads = ['At a glance', 'Overview', 'Setting', 'Summary (1/2)', 'Summary (2/2)', 'Date, Place, and Occasion of Writing', 'Paul’s Purpose in Writing', 'Meaning and Message'];
    const sections = heads.map((h) => ({ ...EASTON_DIVORCE, kind: 'book-introduction' as const, title: `Tyndale introduction to Romans — ${h}`, sourceId: 'tyndale-open-study-notes' }));
    const base = createFakeKb();
    const kb = Object.assign(Object.create(base) as typeof base, { bookIntroduction: async () => sections });
    const call = await prepared('book_introduction', { book: 'Romans' }, ctx(kb));
    const shown = await call.fetch();
    expect(shown.map((d) => d.title.split(' — ')[1])).toEqual(['At a glance', 'Overview', 'Setting', 'Date, Place, and Occasion of Writing', 'Paul’s Purpose in Writing']);
    expect(call.after?.(shown)).toBe('Other sections of this introduction — open them with read_document (title “Tyndale introduction to Romans” and `parts`): part 4: Summary (1/2); part 5: Summary (2/2); part 8: Meaning and Message.');
  });

  it('an item is cut at 2,000 characters (a passage at 3,500), and the cut says how to read the rest', () => {
    const ledger = new EvidenceLedger();
    const long = 'The law of divorce. '.repeat(150);
    const out = ledger.render(ledger.addAll([{ ...EASTON_DIVORCE, text: long }, { ...EASTON_DIVORCE, kind: 'scripture', title: 'Deuteronomy 24 (BSB)', sourceId: 'bsb', text: long }]));
    const [dictionary, scripture] = out.split('\n\n').slice(1);
    expect(dictionary.length).toBeLessThan(2200);
    expect(dictionary).toMatch(/more characters not shown; read_document with evidence "E1" shows it\]$/);
    expect(scripture.length).toBeGreaterThan(3000);
  });

  it('read_document opens the whole text of an item already shown, by its evidence id, for quoting', async () => {
    const whole = `${EASTON_DIVORCE.text} Divorce was permitted for the hardness of their hearts.`;
    const ledger = new EvidenceLedger({ fullText: (d) => (d.title === EASTON_DIVORCE.title ? whole : d.text) });
    const c = { ...ctx(), ledger };
    ledger.render(ledger.addAll([EASTON_DIVORCE]));
    const call = await prepared('read_document', { evidence: '[e1]' }, c);
    expect(call.step.detail).toBe('Opening “Easton’s Bible Dictionary — Divorce” in full');
    expect(await call.fetch()).toEqual([]);
    const text = call.after?.([]) ?? '';
    expect(text).toMatch(/^The whole text of E1:\n\n\[E1\] Easton’s Bible Dictionary — Divorce \(dictionary/);
    expect(text).toContain('for the hardness of their hearts.');
    // a quotation taken from the opened text is checked against the same full text
    expect(findExactSpan('permitted for the hardness of their hearts', ledger.fullText(ledger.get('E1')!))).not.toBeNull();
    expect(call.after?.([])).toBe('E1 was already shown whole above; it has no more text.');
    const unknown = await prepareResearchCall('read_document', { evidence: 'E9' }, c);
    expect(!unknown.ok && unknown.error).toMatch(/“E9” is not the id of an item shown in this request/);
  });

  it('read_document by id makes an item withheld from a long result citable, and shows a very long text around `query`', async () => {
    const ledger = new EvidenceLedger();
    const filler = (i: number) => ({ ...EASTON_DIVORCE, title: `Entry ${i}`, text: `${'word '.repeat(700)}${i}` });
    const far = `${'The Mosaic law regulated it. '.repeat(300)}The Pauline privilege is a separate case. ${'Christ limited the permission. '.repeat(100)}`;
    ledger.render(ledger.addAll([filler(1), filler(2), filler(3), { ...EASTON_DIVORCE, title: 'Entry 4', text: far }]), 6000);
    expect(ledger.isWithheld('E4')).toBe(true);
    const call = await prepared('read_document', { evidence: 'E4', query: 'Pauline privilege' }, { ...ctx(), ledger });
    const text = call.after?.([]) ?? '';
    expect(ledger.isWithheld('E4')).toBe(false);
    expect(text.startsWith(`E4 is ${far.trim().length.toLocaleString('en-US')} characters long; shown: its passages on “Pauline privilege”`)).toBe(true);
    expect(text).toContain('The Pauline privilege is a separate case.');
    expect(text.length).toBeLessThan(6600);
  });
});

const JFB = 'tolerated a relaxation of the strictness of the marriage bond—not as approving of it, but to prevent still greater evils.';

describe('text helpers', () => {
  it('matches quotations as exact spans, normalising whitespace, quote marks, dashes and case', () => {
    const src = 'He said, “Let not man put asunder”—and they   marvelled.';
    expect(findExactSpan('"let not man put asunder" - and they marvelled', src)).toBe('Let not man put asunder”—and they   marvelled');
    expect(findExactSpan('the marriage bond — not as approving of it', JFB)).toBe('the marriage bond—not as approving of it');
    expect(findExactSpan('let no man put asunder', src)).toBeNull();
    expect(quotedSegments('He said “one two three” and “one two three four five six seven eight nine ten eleven twelve”.')).toEqual(['one two three four five six seven eight nine ten eleven twelve']);
  });

  it('turns references in chat prose into ref chips (existing references only)', async () => {
    const refs = new RefChecker(createFakeKb().providers.scripture);
    const blocks = await toBlocks('Read Matthew 19:3–9 and Deut 24:1.\n\nNot Matthew 19:40 {{word:x}}.', refs);
    expect(blocks).toEqual([
      { type: 'paragraph', text: 'Read {{ref:MAT.19.3-9|Matthew 19:3–9}} and {{ref:DEU.24.1|Deut 24:1}}.' },
      { type: 'paragraph', text: 'Not Matthew 19:40 word:x.' },
    ]);
  });

  it('normalises queries for the page cache; study ids are gen-<slug>-<hash>', () => {
    expect(normalizeQuery('  Divorce?? ')).toBe('divorce');
    expect(pageCacheKey('Divorce?', 'BSB', 'claude-opus-5')).toBe(pageCacheKey('divorce', 'BSB', 'claude-opus-5'));
    expect(pageCacheKey('divorce', 'KJV', 'claude-opus-5')).not.toBe(pageCacheKey('divorce', 'BSB', 'claude-opus-5'));
    expect(generatedStudyId('Why does God allow suffering?', 'BSB', 'claude-opus-5')).toMatch(/^gen-why-does-god-allow-suffering-[0-9a-f]{8}$/);
    expect(formatRef({ book: 'MAT', startChapter: 19 })).toBe('Matthew 19');
  });

  it('keys and identifies a compose by its language (English keeps the pre-localisation shape)', () => {
    const en = composeCacheKey({ query: 'grace', translation: 'BSB' }, 'claude-opus-5');
    const pt = composeCacheKey({ query: 'grace', translation: 'BSB', locale: 'pt' }, 'claude-opus-5');
    expect(en.key).toBe(pageCacheKey('grace', 'BSB', 'claude-opus-5'));
    expect(en.studyId).toBe(generatedStudyId('grace', 'BSB', 'claude-opus-5'));
    expect(composeCacheKey({ query: 'grace', translation: 'BSB', locale: 'en' }, 'claude-opus-5')).toEqual(en);
    expect(pt.key).not.toBe(en.key);
    expect(pt.studyId).not.toBe(en.studyId);
    expect(pt.key).toBe(pageCacheKey('grace', 'BSB', 'claude-opus-5', undefined, 'pt'));
    expect(composeCacheKey({ query: 'grace', translation: 'BSB', locale: 'pt', hint: { topic: 'Grace' } }, 'm').key).toBe('grace|BSB|m|pt|topic:grace');
  });
});

describe('page language', () => {
  it('names the language in the user message only, and leaves English prompts without a language line', () => {
    const base = { query: 'grace', translation: 'BSB', maxResearchCalls: 10 };
    expect(composeUserMessage(base)).toBe(composeUserMessage({ ...base, locale: 'en' }));
    expect(composeUserMessage(base)).not.toMatch(/Language:/);
    const pt = composeUserMessage({ ...base, translation: 'BLIVRE', locale: 'pt' });
    expect(pt).toMatch(/Language: .*Brazilian Portuguese/);
    expect(pt).toMatch(/verbatim/);
    expect(languageInstruction('fr')).toMatch(/French/);
    expect(CORE_SYSTEM_PROMPT).not.toMatch(/plain English/);
  });
});

describe('complex questions', () => {
  it('asks for a page built around the key points of a question with several parts, and only then', () => {
    const base = { translation: 'BSB', maxResearchCalls: 10 };
    const asked = composeUserMessage({ ...base, query: 'Em um relacionamento abusivo, sem parceria, é possível o divórcio e pensar em um novo casamento?', locale: 'pt' });
    expect(asked).toContain(QUESTION_INSTRUCTION);
    expect(asked).toMatch(/Language: .*Brazilian Portuguese/);
    expect(QUESTION_INSTRUCTION).toMatch(/key points/);
    expect(QUESTION_INSTRUCTION).toMatch(/finish_page/);
    // a topic, a short question and a reference keep their earlier prompts
    expect(composeUserMessage({ ...base, query: 'divorce', topicHint: 'divorce' })).not.toContain(QUESTION_INSTRUCTION);
    expect(composeUserMessage({ ...base, query: 'Is it wrong to be rich?', topicHint: 'is it wrong to be rich' })).toMatch(/recognised the topic/);
    const ref = composeUserMessage({ ...base, query: 'Why does Paul say in Romans 8 that nothing can separate us, and what about suffering?', recognisedPassage: { book: 'ROM', startChapter: 8 } });
    expect(ref).not.toContain(QUESTION_INSTRUCTION);
    // the system prompt (cached prefix) does not change
    expect(CORE_SYSTEM_PROMPT).not.toContain(QUESTION_INSTRUCTION);
  });
});

describe('config', () => {
  it('reads model, effort and budgets from the environment, with documented defaults', () => {
    const c = loadInferenceConfig({ ANTHROPIC_API_KEY: 'k', EMMAUS_EFFORT: 'MEDIUM', EMMAUS_MAX_RESEARCH_CALLS: '6' }, '/r');
    expect(c).toMatchObject({ model: 'claude-opus-5', effort: 'medium', maxResearchCalls: 6, maxTokens: 64000, fallbacks: true, credential: { source: 'api-key', apiKey: 'k' }, cacheDir: '/r/.kb-cache' });
    const d = loadInferenceConfig({ EMMAUS_EFFORT: 'turbo', EMMAUS_MODEL: 'claude-opus-5-5' }, '/r');
    expect(d).toMatchObject({ model: 'claude-opus-5-5', effort: 'high', maxResearchCalls: 12, maxAnswerResearchCalls: 6, credential: { source: null } });
    expect(NO_CREDENTIAL_REASON).toMatch(/ANTHROPIC_API_KEY/);
  });

  it('EMMAUS_LIVE=off hides the credential, so nothing can call the API', () => {
    expect(loadInferenceConfig({ ANTHROPIC_API_KEY: 'k', EMMAUS_LIVE: 'OFF' }, '/r').credential).toEqual({ source: null });
    expect(loadInferenceConfig({ ANTHROPIC_API_KEY: 'k', EMMAUS_LIVE: 'on' }, '/r').credential).toMatchObject({ source: 'api-key' });
  });
});
