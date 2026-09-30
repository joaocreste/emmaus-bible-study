/**
 * Inference layer — end to end, against a scripted server (docs/INFERENCE.md §5–6).
 *
 * The inference API is intercepted with page.route, so no model is called and no key is
 * needed: /status is answered directly, /answer with a complete SSE body, and /compose is
 * continued to a small local SSE server the test drives event by event — so the page can be
 * checked while it is still arriving.
 *
 * The generated "divorce" page below is TEST DATA shaped like a composed page. Its evidence
 * excerpts are not invented: they are read verbatim, at test time, from the knowledge-base
 * corpora (kb/corpus) and the bundled BSB (public/data), exactly as the server would cite them.
 */
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { ChatMessage, Citation, PassageRef, ProvenancedText, Study } from '../src/domain/models';
import { encodeEvent, type AnswerRequest, type ComposeRequest, type InferenceEvent, type InferenceStatus } from '../src/inference/protocol';
import { ask, lastReply, watchErrors } from './helpers';

/* ------------------------------------------------------------------ */
/* Evidence, read from the real knowledge base and Bible data          */
/* ------------------------------------------------------------------ */

const ROOT = new URL('../', import.meta.url);

interface KbDoc {
  id: string;
  title: string;
  text: string;
  locator?: string;
  url?: string;
}

function kbDoc(corpus: string, id: string): KbDoc {
  const file = JSON.parse(readFileSync(new URL(`kb/corpus/${corpus}.json`, ROOT), 'utf8')) as { documents: KbDoc[] };
  const doc = file.documents.find((d) => d.id === id);
  if (!doc) throw new Error(`knowledge-base document ${id} not found in kb/corpus/${corpus}.json`);
  return doc;
}

function corpusSize(corpus: string): number {
  return (JSON.parse(readFileSync(new URL(`kb/corpus/${corpus}.json`, ROOT), 'utf8')) as { documents: unknown[] }).documents.length;
}

/** BSB text of chapter:from–to, verbatim from public/data. */
function bsb(book: string, chapter: number, from: number, to = from): string {
  const data = JSON.parse(readFileSync(new URL(`public/data/bible/bsb/${book}.json`, ROOT), 'utf8')) as {
    chapters: { c: number; v: [number, string, ...unknown[]][] }[];
  };
  const ch = data.chapters.find((c) => c.c === chapter);
  const verses = ch?.v.filter(([n]) => n >= from && n <= to).map(([, t]) => t) ?? [];
  if (verses.length !== to - from + 1) throw new Error(`BSB ${book} ${chapter}:${from}-${to} not found`);
  return verses.join(' ');
}

const NAVES = kbDoc('naves', 'naves:divorce');
const EASTON = kbDoc('easton', 'easton:divorce');

const cite = {
  naves: (): Citation => ({ sourceId: 'naves-topical-bible', locator: NAVES.locator, url: NAVES.url, excerpt: NAVES.text }),
  easton: (): Citation => ({ sourceId: 'eastons-bible-dictionary', locator: EASTON.locator, url: EASTON.url, excerpt: EASTON.text }),
  bsb: (label: string, book: string, chapter: number, from: number, to = from): Citation => ({
    sourceId: 'bsb',
    locator: label,
    excerpt: bsb(book, chapter, from, to),
  }),
};

const generated = (text: string, ...citations: Citation[]): ProvenancedText => ({
  text,
  provenance: { kind: 'synthesis', verification: 'generated', citations },
});

const ref = (book: string, chapter: number, from: number, to: number): PassageRef => ({
  book,
  startChapter: chapter,
  startVerse: from,
  endChapter: chapter,
  endVerse: to,
});

/* ------------------------------------------------------------------ */
/* The generated page, section by section                              */
/* ------------------------------------------------------------------ */

const STUDY_ID = 'generated-divorce-e2e';
const CREATED = Date.now();

/** Snapshots of the page as its sections are accepted: [key passages] → [+ context] → [+ theology, final]. */
function divorceSnapshots(): Study[] {
  const base: Study = {
    id: STUDY_ID,
    kind: 'topic',
    depth: 'generated',
    title: 'Divorce',
    subtitle: 'What the Bible says about divorce',
    passage: ref('MAT', 19, 3, 9),
    topic: {
      name: 'Divorce',
      question: 'What does the Bible say about divorce?',
      definition: generated(
        'The Law of Moses regulated divorce (Deuteronomy 24:1–4); Jesus, asked about it, pointed back to the Creator’s design and called Moses’ permission a concession to hardness of heart (Matthew 19:3–9).',
        cite.easton(),
        cite.bsb('Matthew 19:8', 'MAT', 19, 8),
      ),
      keyPassages: [
        {
          id: 'kp-mat-19',
          ref: ref('MAT', 19, 3, 9),
          title: 'Jesus answers the Pharisees',
          note: generated(
            'Asked whether a man may divorce his wife for any reason, Jesus answers from Genesis: what God has joined together, man must not separate.',
            cite.bsb('Matthew 19:6', 'MAT', 19, 6),
            cite.naves(),
          ),
          group: 'The teaching of Jesus',
          tags: ['divorce'],
        },
        {
          id: 'kp-deu-24',
          ref: ref('DEU', 24, 1, 4),
          title: 'The certificate of divorce',
          note: generated('The Law assumes divorce happens and regulates it: a written certificate, and no return to the first husband.', cite.bsb('Deuteronomy 24:1', 'DEU', 24, 1), cite.naves()),
          group: 'The Law and the Prophets',
          tags: ['law'],
        },
        {
          id: 'kp-mal-2',
          ref: ref('MAL', 2, 14, 16),
          title: 'The wife of your youth',
          note: generated('Malachi calls the wife of one’s youth a covenant partner and rebukes faithlessness toward her.', cite.bsb('Malachi 2:14', 'MAL', 2, 14), cite.naves()),
          group: 'The Law and the Prophets',
          tags: ['covenant'],
        },
      ],
    },
    summary: generated(
      'Scripture regulates divorce in the Law, grieves it in the Prophets, and in the teaching of Jesus measures it against the Creator’s design for marriage.',
      cite.naves(),
      cite.easton(),
    ),
    keyWords: [],
    crossReferences: [],
    context: [],
    theology: [],
    perspectives: [],
    commentary: [],
    sermons: [],
    verseNotes: [],
    concepts: [],
    suggestedQuestions: [],
    sourceIds: ['bsb', 'naves-topical-bible', 'eastons-bible-dictionary'],
    layout: {
      sections: [
        { id: 'key-passages', title: 'What Scripture says about divorce' },
        { id: 'historical-context', title: 'Divorce in the ancient world', intro: 'How the question was framed when Jesus was asked it.' },
        { id: 'theology', title: 'Marriage as covenant' },
      ],
    },
    generation: { model: 'claude-opus-5', query: 'divorce', createdAt: CREATED, evidenceCount: 9, retrievalCalls: 5 },
  };

  const withContext: Study = {
    ...base,
    context: [
      {
        id: 'ctx-slight-pretences',
        category: 'customs',
        title: 'Divorce in Jesus’ day',
        summary: 'Easton’s Bible Dictionary (1897) notes that divorce on slight grounds seems to have been common among Jews of the time, and that Christ limited the permission to the single case of adultery.',
        relatedVerses: [{ book: 'MAT', chapter: 19, verse: 9 }],
        tags: ['divorce'],
        provenance: { kind: 'synthesis', verification: 'generated', citations: [cite.easton()] },
      },
    ],
  };

  const final: Study = {
    ...withContext,
    theology: [
      {
        id: 'theme-covenant',
        category: 'covenant',
        title: 'Marriage is a covenant God witnesses',
        summary: 'Malachi describes the wife of one’s youth as a partner by covenant, with the LORD as witness between them.',
        keyVerses: [ref('MAL', 2, 14, 14)],
        tags: ['covenant'],
        provenance: { kind: 'synthesis', verification: 'generated', citations: [cite.bsb('Malachi 2:14', 'MAL', 2, 14)] },
      },
    ],
    opening: generated('Here is a page on divorce, composed from Nave’s Topical Bible, Easton’s Bible Dictionary and the passages they point to.', cite.naves(), cite.easton()),
    concepts: [
      {
        id: 'concept-hardness',
        label: 'hardness of heart',
        aliases: ['hardness of heart', 'hard hearts', 'hardness of your hearts'],
        answer: generated('Jesus says Moses permitted divorce because of the hardness of their hearts, but it was not this way from the beginning.', cite.bsb('Matthew 19:8', 'MAT', 19, 8)),
        primarySection: 'key-passages',
        verses: [{ book: 'MAT', chapter: 19, verse: 8 }],
        keyWordIds: [],
        crossReferenceIds: [],
        contextIds: [],
        themeIds: [],
        perspectiveSetIds: [],
        commentaryIds: [],
      },
    ],
    suggestedQuestions: ['What did Jesus mean by hardness of heart?', 'How does Malachi 2 speak about divorce?'],
  };

  return [base, withContext, final];
}

const step = (stage: string, detail: string): InferenceEvent => ({ type: 'progress', step: { stage, detail, provider: 'kb:naves' } });

function reply(text: string, citations: Citation[] = []): ChatMessage {
  return {
    id: `server-${text.length}`,
    role: 'assistant',
    text,
    blocks: [{ type: 'paragraph', text }],
    citations,
    provenance: { kind: 'synthesis', verification: 'generated', citations },
    createdAt: CREATED,
  };
}

/* ------------------------------------------------------------------ */
/* Scripted inference API                                              */
/* ------------------------------------------------------------------ */

const AVAILABLE: InferenceStatus = {
  available: true,
  model: 'claude-opus-5',
  knowledgeBase: {
    documents: ['naves', 'torrey', 'easton', 'smith'].reduce((n, c) => n + corpusSize(c), 0),
    corpora: [{ id: 'naves', label: 'Nave’s Topical Bible (1896)', documents: corpusSize('naves') }],
  },
};

const NO_KEY: InferenceStatus = {
  available: false,
  model: 'claude-opus-5',
  reason: 'Add ANTHROPIC_API_KEY=… to .env.local and restart npm run dev',
  knowledgeBase: { documents: 0, corpora: [] },
};

interface LiveStream {
  send(...events: InferenceEvent[]): void;
  end(): void;
}

/** A local SSE server: each /compose request the page makes is held open and written to by the test. */
async function sseServer() {
  const waiting: ((s: LiveStream) => void)[] = [];
  const ready: LiveStream[] = [];
  const open = new Set<ServerResponse>();
  const server = createServer((req, res) => {
    req.resume();
    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive' });
    res.write(': connected\n\n');
    open.add(res);
    res.on('close', () => open.delete(res));
    const stream: LiveStream = {
      send: (...events) => {
        for (const e of events) res.write(encodeEvent(e));
      },
      end: () => res.end(),
    };
    const waiter = waiting.shift();
    if (waiter) waiter(stream);
    else ready.push(stream);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}/compose`,
    /** the next compose stream the page opens */
    next: () => new Promise<LiveStream>((resolve) => (ready.length ? resolve(ready.shift()!) : waiting.push(resolve))),
    close: () =>
      new Promise<void>((resolve) => {
        for (const r of open) r.destroy();
        server.close(() => resolve());
      }),
  };
}

async function mockStatus(page: Page, status: InferenceStatus) {
  await page.route('**/api/inference/status', (route) => route.fulfill({ json: status }));
}

/** Route /compose to the scripted SSE server; returns the requests the page sent. */
async function routeCompose(page: Page, url: string): Promise<ComposeRequest[]> {
  const requests: ComposeRequest[] = [];
  await page.route('**/api/inference/compose', async (route) => {
    requests.push(route.request().postDataJSON() as ComposeRequest);
    await route.continue({ url });
  });
  return requests;
}

/** Answer /answer with a complete SSE body; returns the requests the page sent. */
async function routeAnswer(page: Page, events: InferenceEvent[]): Promise<AnswerRequest[]> {
  const requests: AnswerRequest[] = [];
  await page.route('**/api/inference/answer', async (route) => {
    requests.push(route.request().postDataJSON() as AnswerRequest);
    await route.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream; charset=utf-8' }, body: events.map(encodeEvent).join('') });
  });
  return requests;
}

async function startFromWelcome(page: Page, query: string) {
  const form = page.getByRole('search', { name: 'Start a study' });
  await form.getByRole('textbox').fill(query);
  await form.getByRole('textbox').press('Enter');
}

/** Stream the whole divorce page (three snapshots, the reply, done). */
function streamWholePage(s: LiveStream) {
  const [a, b, c] = divorceSnapshots();
  s.send(
    step('Research', 'Searching Nave’s Topical Bible for “divorce”'),
    { type: 'study', study: a, complete: false },
    { type: 'study', study: b, complete: false },
    { type: 'study', study: c, complete: true },
    { type: 'reply', reply: reply(c.opening!.text, c.opening!.provenance.citations), focus: { section: 'key-passages' } },
    { type: 'done' },
  );
  s.end();
}

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

test.describe('inference layer — a new page composed live for the reader’s question', () => {
  test('“divorce” composes a generated page, section by section, instead of opening Marriage', async ({ page }) => {
    const errors = watchErrors(page);
    const sse = await sseServer();
    try {
      await mockStatus(page, AVAILABLE);
      const composed = await routeCompose(page, sse.url);
      await page.goto('/');
      await expect(page.getByText('New questions are composed live from the knowledge base; every statement links to its sources.')).toBeVisible();

      await startFromWelcome(page, 'divorce');
      const s = await sse.next();
      expect(composed).toHaveLength(1);
      expect(composed[0]).toMatchObject({ query: 'divorce', translation: 'BSB' });
      expect(composed[0].regenerate).toBeUndefined();

      // Live steps show while nothing has arrived yet.
      s.send(step('Research', 'Searching Nave’s Topical Bible for “divorce”'));
      await expect(page.getByText('Searching Nave’s Topical Bible for “divorce”').first()).toBeVisible();

      const [first, second, final] = divorceSnapshots();

      // 1st snapshot: the page opens at once — Divorce, never the Marriage topic.
      s.send({ type: 'study', study: first, complete: false });
      await expect(page.getByRole('heading', { level: 1, name: 'Divorce' })).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: 'Marriage' })).toHaveCount(0);
      const study = page.locator('main#study');
      await expect(study.getByText('Generated study', { exact: true })).toBeVisible();
      await expect(page.locator('#section-key-passages')).toBeVisible();
      await expect(page.locator('#section-key-passages h2')).toHaveText('What Scripture says about divorce');
      await expect(page.locator('#section-historical-context')).toHaveCount(0);
      await expect(page.locator('#section-theology')).toHaveCount(0);
      await expect(study.getByText('Composing the next section…')).toBeVisible();
      await expect(study.getByText(/End of study/)).toHaveCount(0);
      // …placed where the next section will land: just before Sources.
      expect(await page.getByTestId('composing-notice').evaluate((el) => el.nextElementSibling?.id)).toBe('section-sources');

      // The chat shows the live pipeline (newest first) while the page is being composed.
      s.send(step('Compose', 'Historical context accepted (1 item)'));
      await expect(page.locator('[class*="liveStep"]').first()).toHaveText('Historical context accepted (1 item)');

      // 2nd snapshot: historical context lands under the layout's heading, the page keeps its place.
      s.send({ type: 'study', study: second, complete: false });
      await expect(page.locator('#section-historical-context')).toBeVisible();
      await expect(page.locator('#section-historical-context h2')).toHaveText('Divorce in the ancient world');
      await expect(page.locator('#section-historical-context')).toContainText('How the question was framed when Jesus was asked it.');
      await expect(study.locator('[aria-live="polite"]').getByText('Section added: Divorce in the ancient world')).toBeAttached();
      await expect(page.locator('#section-theology')).toHaveCount(0);

      // Final snapshot + reply: the page is complete.
      s.send(
        { type: 'study', study: final, complete: true },
        { type: 'reply', reply: reply(final.opening!.text, final.opening!.provenance.citations), focus: { section: 'key-passages' } },
        { type: 'done' },
      );
      s.end();
      await expect(page.locator('#section-theology')).toBeVisible();
      await expect(page.getByTestId('composing-notice')).toHaveCount(0);
      await expect(study.getByText(/End of study/)).toBeVisible();
      await expect(page.locator('article[aria-label="Emmaus"]').last()).toContainText('composed from Nave’s Topical Bible');

      // Sections follow the layout; empty sections are omitted (no “not curated yet” placeholders); Sources last.
      const order = await page.locator('main#study section[data-section]').evaluateAll((els) => els.map((e) => e.getAttribute('data-section')));
      expect(order).toEqual(['key-passages', 'historical-context', 'theology', 'scripture', 'sources']);
      await expect(study.getByText(/No curated/)).toHaveCount(0);

      // Header meta line from study.generation.
      await expect(study.getByText('Composed from 3 sources')).toBeVisible();
      await expect(study.getByText('claude-opus-5', { exact: true })).toBeVisible();
      await expect(study.getByRole('button', { name: 'Regenerate' })).toBeEnabled();

      expect(errors).toEqual([]);
    } finally {
      await sse.close();
    }
  });

  test('the Generated badge explains itself; citations carry the text they rest on', async ({ page }) => {
    const sse = await sseServer();
    try {
      await mockStatus(page, AVAILABLE);
      await routeCompose(page, sse.url);
      await page.goto('/');
      await startFromWelcome(page, 'divorce');
      streamWholePage(await sse.next());
      await expect(page.getByRole('heading', { level: 1, name: 'Divorce' })).toBeVisible();

      // Toggletip on the depth badge.
      await page.getByRole('button', { name: 'What is a generated study?' }).click();
      await expect(page.getByText(/composed just now from the knowledge base for your question/)).toBeVisible();
      await expect(page.getByText(/not reviewed by an editor/).first()).toBeVisible();
      await page.keyboard.press('Escape');

      // Generated prose is labelled as such.
      const passages = page.locator('#section-key-passages');
      await expect(passages.getByText('Generated', { exact: true }).first()).toBeVisible();
      await expect(passages.getByText('· not reviewed').first()).toBeVisible();

      // A citation previews its excerpt in the tooltip and opens it in the Inspector.
      const matt19v6 = bsb('MAT', 19, 6);
      const chip = passages.getByRole('button', { name: /Berean Standard Bible.*Matthew 19:6/ }).first();
      await expect(chip).toHaveAttribute('title', new RegExp(`Cited text: ${escapeRe(matt19v6.slice(0, 40))}`));
      await chip.click();
      const inspector = page.getByRole('dialog');
      await expect(inspector.getByText('Cited passage')).toBeVisible();
      await expect(inspector.getByText(matt19v6)).toBeVisible();

      // A knowledge-base source (Nave’s) opens with its entry, verbatim.
      await page.keyboard.press('Escape');
      await passages.getByRole('button', { name: /Nave’s Topical Bible/ }).first().click();
      await expect(page.getByRole('dialog').getByText('Cited passage')).toBeVisible();
      await expect(page.getByRole('dialog')).toContainText(NAVES.text.split('\n')[0].slice(0, 60));
    } finally {
      await sse.close();
    }
  });

  test('a follow-up the page cannot answer goes to the answer endpoint', async ({ page }) => {
    const sse = await sseServer();
    try {
      await mockStatus(page, AVAILABLE);
      await routeCompose(page, sse.url);
      const answerText = 'Easton’s Bible Dictionary notes that the returned exiles were required to dismiss the foreign women they had married contrary to the law (Ezra 10).';
      const answered = await routeAnswer(page, [
        step('Research', 'Searching Easton’s Bible Dictionary for “Ezra divorce”'),
        { type: 'reply', reply: reply(answerText, [cite.easton()]), focus: { section: 'historical-context' } },
        { type: 'done' },
      ]);
      await page.goto('/');
      await startFromWelcome(page, 'divorce');
      streamWholePage(await sse.next());
      await expect(page.getByRole('heading', { level: 1, name: 'Divorce' })).toBeVisible();
      await expect(page.getByText(/End of study/)).toBeVisible();

      // Answered from the page itself (a concept the page provides) — no request.
      await ask(page, 'What did Jesus mean by hardness of heart?');
      expect(await lastReply(page)).toMatch(/hardness of their hearts/);
      expect(answered).toHaveLength(0);
      // …and labelled as drawn from the generated page, not from the reviewed library.
      await expect(page.locator('article[aria-label="Emmaus"]').last()).toContainText('composed from the knowledge base');

      // Not on the page: researched in the knowledge base.
      await ask(page, 'Why did Ezra make the returned exiles send their wives away?');
      await expect(page.locator('article[aria-label="Emmaus"]').last()).toContainText('returned exiles were required to dismiss');
      expect(answered).toHaveLength(1);
      expect(answered[0].question).toBe('Why did Ezra make the returned exiles send their wives away?');
      expect(answered[0].study.id).toBe(STUDY_ID);
      await expect(page.getByRole('heading', { level: 1, name: 'Divorce' })).toBeVisible(); // still on the page
    } finally {
      await sse.close();
    }
  });

  test('Regenerate recomposes the page, bypassing the cache', async ({ page }) => {
    const sse = await sseServer();
    try {
      await mockStatus(page, AVAILABLE);
      const composed = await routeCompose(page, sse.url);
      await page.goto('/');
      await startFromWelcome(page, 'divorce');
      streamWholePage(await sse.next());
      await expect(page.getByText(/End of study/)).toBeVisible();

      await page.locator('main#study').getByRole('button', { name: 'Regenerate' }).click();
      const again = await sse.next();
      expect(composed).toHaveLength(2);
      expect(composed[1]).toMatchObject({ query: 'divorce', regenerate: true });
      streamWholePage(again);
      await expect(page.locator('article[aria-label="Emmaus"]').last()).toContainText('composed from Nave’s Topical Bible');
      await expect(page.getByRole('heading', { level: 1, name: 'Divorce' })).toBeVisible();
    } finally {
      await sse.close();
    }
  });

  test('curated studies still open instantly, without a model call', async ({ page }) => {
    await mockStatus(page, AVAILABLE);
    let composeCalls = 0;
    await page.route('**/api/inference/compose', (route) => {
      composeCalls++;
      return route.abort();
    });
    await page.goto('/');
    await startFromWelcome(page, 'Romans 8');
    await expect(page.getByRole('heading', { level: 1, name: 'Romans 8' })).toBeVisible();
    await expect(page.locator('main#study').getByText('Curated study', { exact: true })).toBeVisible();
    expect(composeCalls).toBe(0);
  });

  test('when live composition is unavailable, the library path opens with an honest note', async ({ page }) => {
    const errors = watchErrors(page);
    await mockStatus(page, NO_KEY);
    let composeCalls = 0;
    await page.route('**/api/inference/compose', (route) => {
      composeCalls++;
      return route.abort();
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /What would you like to study today\?/ })).toBeVisible();
    await expect(page.getByText(/New questions are composed live/)).toHaveCount(0);

    await startFromWelcome(page, 'divorce');
    await expect(page.getByRole('heading', { level: 1, name: 'Marriage' })).toBeVisible();
    await expect(page.locator('main#study').getByText('Library study', { exact: true })).toBeVisible();
    const replyText = await lastReply(page);
    expect(replyText).toMatch(/Live composition is unavailable — add ANTHROPIC_API_KEY=… to \.env\.local/);
    expect(replyText).toMatch(/Showing the library topic study instead/);
    expect(composeCalls).toBe(0);

    // The note is explained once, not repeated on every question.
    await ask(page, 'faith');
    await expect(page.getByRole('heading', { level: 1, name: 'Faith' })).toBeVisible();
    expect(await lastReply(page)).not.toMatch(/Live composition is unavailable/);

    // The Reader settings popover says why.
    await page.getByRole('button', { name: /Reader settings/i }).first().click();
    await expect(page.getByRole('switch', { name: 'Live composition' })).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByText(/Unavailable — Add ANTHROPIC_API_KEY/)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('turning Live composition off keeps the library path', async ({ page }) => {
    await mockStatus(page, AVAILABLE);
    let composeCalls = 0;
    await page.route('**/api/inference/compose', (route) => {
      composeCalls++;
      return route.abort();
    });
    await page.goto('/');
    await page.getByRole('button', { name: /Reader settings/i }).first().click();
    const toggle = page.getByRole('switch', { name: 'Live composition' });
    await expect(page.getByText(/Claude · claude-opus-5 · [\d,]+ knowledge-base documents/)).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await page.keyboard.press('Escape');
    await expect(page.getByText(/New questions are composed live/)).toHaveCount(0);

    await startFromWelcome(page, 'divorce');
    await expect(page.getByRole('heading', { level: 1, name: 'Marriage' })).toBeVisible();
    expect(composeCalls).toBe(0);
  });
});

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
