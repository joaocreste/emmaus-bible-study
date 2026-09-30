# Inference layer — design (prototype)

> Knowledge base + inference layer: for every new question the reader asks, the app retrieves evidence from a knowledge base and Claude composes a **new study page** from that evidence — instead of routing the question to a fixed index entry.

```
reader input ──► client engine (InferenceStudyEngine)
                  │  curated study matches?  ──yes──► curated page (instant, editor-reviewed)
                  │  no
                  ▼
        POST /api/inference/compose  (local server, key stays server-side)
                  │
                  ▼
   ┌──────────── Claude (claude-opus-5, adaptive thinking) ─────────────┐
   │ 1. RESEARCH  — calls knowledge-base tools; every result is numbered │
   │               evidence  [E1] [E2] … in a per-request ledger          │
   │ 2. COMPOSE   — begin_page → add_section × N → finish_page            │
   │               every claim cites evidence ids                         │
   └──────────────────────────────┬──────────────────────────────────────┘
                                  ▼
               VALIDATOR (runtime version of the integrity rules)
     rejects uncited claims, references / names / dates / quotations
     the cited evidence does not contain, and tradition positions not
     grounded in that tradition's own texts; hydrates lexicon data
     from the lexicon (the model never types lemmas or counts)
                                  ▼
          Study (depth 'generated') streamed section by section (SSE)
                                  ▼
       dashboard renders progressively; chat shows the live pipeline
```

**The line we never cross: the model generates the page, never the evidence.** It can only arrange, connect and explain what the knowledge base returned, and every statement links to the retrieved text it rests on (`Citation.excerpt`).

## 1. Knowledge base (server/kb)

| Corpus | Evidence kind | Source id | License |
|---|---|---|---|
| BSB / KJV / WEB (public/data) | scripture | bsb / kjv / web | public domain |
| STEPBible tagged text, lexicons, concordance | original-text, lexicon, occurrences | stepbible-* | CC BY 4.0 |
| OpenBible cross-references | cross-references | openbible-xrefs | CC BY 4.0 |
| Tyndale Open Study Notes + book introductions | study-note, book-introduction | tyndale-open-study-notes | CC BY-SA 4.0 |
| Calvin, Henry (+ continuators), JFB, Keil & Delitzsch (bundled + live fetch with disk cache) | commentary | calvin-commentaries, … | public domain |
| Nave’s Topical Bible (1896), Torrey’s New Topical Textbook (1897) — NEUU bible-topics-dataset | topical-index | naves-topical-bible, torreys-topical-textbook | PD works; dataset CC BY 4.0 |
| Easton’s (1897) and Smith’s (1863) Bible Dictionaries — NEUU bible-dictionary-dataset | dictionary | eastons-bible-dictionary, smiths-bible-dictionary | PD works; dataset CC BY 4.0 |
| Creeds, confessions & catechisms (public-domain texts/translations): ecumenical creeds, Reformed, Lutheran, Anglican, Baptist, Methodist, Catholic (Trent, Roman Catechism, …) and Eastern Orthodox (Longer Catechism, Dositheus) — `kb/corpus/confessions-*.json` | confession | per document | public domain |
| The Catholic Encyclopedia (1907–14), selected articles — `kb/corpus/catholic-encyclopedia.json` | dictionary (tradition Catholic) | catholic-encyclopedia-* | public domain |
| Curated Emmaus studies & topic index (reviewed) | curated | the item’s own citations | — |

Corpora live in `kb/corpus/<id>.json` (format: `server/kb/corpus.ts`), built by `npm run kb:build` (scripts/kb). A document may carry a `tradition` ("Reformed", "Catholic", "Eastern Orthodox", …); its evidence then carries it too (`Evidence.tradition`), and confession titles are suffixed "[Reformed]" etc. The full-text index (MiniSearch/BM25) is built at server start and cached in `.kb-cache/`. Access goes through `KnowledgeBase` (`server/kb/types.ts`).

- **Version.** `stats().version` is the index hash (corpora + indexing code + manifest + curated library); `GET /status` reports it and the page cache keys on it.
- **Holdings.** `holdings()` inventories the knowledge base: documents per evidence kind, and for each Christian tradition (families in `server/kb/traditions.ts`) the works that represent it — documents tagged with the tradition, documents by an author the source registry places in it (e.g. Easton: Scottish Presbyterian → Reformed), and the classic commentaries by their authors. Traditions with no text at all are listed as missing. The inventory goes into the system prompt (see §2) and into repair hints.
- **Freshness.** The server checks `kb/corpus` (file names, sizes, mtimes; at most once a second) before each request and rebuilds the knowledge base when it changed — corpora added or regenerated while `npm run dev` runs are picked up without a restart.
- **Search.** Reader questions are reduced to their subject before BM25 ("what does the Bible say about suicide" → "suicide"); `server/kb/synonyms.ts` maps reader vocabulary to the headings Nave’s uses (anxiety → CARE, homosexuality → SODOMY) and, for full-text search, to the older words the confessions and dictionaries use for the same subject (divorce → "bond of matrimony", "desertion", "innocent party"; predestination → "election", "reprobation"), searched alongside the reader’s word at a lower weight. A hit that matched only through a stem collision (the light stemmer maps “care” to “car”, as in BETH-CAR) is pushed down; a topic reached only through a curated topic’s alias and a see-also keyword is dropped (COWARDICE for “anxiety”). A search restricted to confessions shows at most two texts per work before the rest, so several traditions surface. English lexicon lookups rank common words before names.

## 2. Research tools (model-facing)

All tools are read-only and return **numbered evidence** rendered as plain text blocks:

```
[E14] Nave’s Topical Bible — DIVORCE (topical index · naves-topical-bible · s.v. Divorce)
General scriptures concerning: Exodus 21:7–11; Deuteronomy 24:1–4; … Matthew 19:3–12; Mark 10:2; Luke 16:18; 1 Corinthians 7:10–17
Figurative: Isaiah 50:1; Isaiah 54:4; Jeremiah 3:8
```

| Tool | Input | Returns |
|---|---|---|
| `search_knowledge` | `query`, optional `kinds[]`, `reference`, `tradition`, `limit` | BM25 hits across notes, intros, dictionaries, topical index, confessions, curated items; `tradition` (“Lutheran”, “Eastern Orthodox”…) keeps only that church family’s texts (own tag or author’s registry tradition; a publisher’s house tradition never counts). A creeds search without `tradition` ends with a note naming the held traditions it did not return, so a perspectives set is researched tradition by tradition |
| `find_topics` | `query` | Nave’s/Torrey’s topics (with reference groups) + curated topics/studies |
| `read_passage` | `references[]` (≤ 8 passages, ≤ 60 verses) or `reference`, optional `translation` | verse-numbered Scripture, one item per passage |
| `original_text` | `references[]` or `reference` (≤ 12 verses in all) | tagged Hebrew/Greek words with Strong’s + gloss + parsing |
| `lexicon` | `query` = Strong’s (“G630”) or English (“divorce”) | lexicon entries (+ occurrence counts); by Strong’s number, a lemma in ≤ 6 verses also brings the text of each verse (Scripture evidence) |
| `word_occurrences` | `strong` | verses where the lemma occurs (a lemma in ≤ 12 verses: with their text) |
| `cross_references` | `reference` | OpenBible references (community-voted; not explained) |
| `commentary` | `reference`, optional `sources[]`, `query` | Tyndale note + public-domain commentary excerpts; with `query` a long section is excerpted where it discusses that point (Calvin on Gen 1:26 reaches “plurality of Persons” only there). Excerpts end “[…]”, and the result then says to call again with `query` rather than infer the rest |
| `book_introduction` | `book` | Tyndale introduction sections |
| `read_document` | `title`, `parts[]` (≤ 4) or `query` | other parts of a text the index holds in parts (a Catholic Encyclopedia article, a sermon); every call also lists each part’s opening words. Search results that are one part of a longer text say how many parts it has |

Budgets: ≤ 16 research calls (parallel calls allowed and encouraged; a multi-passage `read_passage` / `original_text` counts once), ≤ ~120 s. Every research result ends with "Research calls used: N of M". Research stays open while composing; a `begin_page` accepted with a third or more of the budget unused reminds the model to research any unrepresented tradition or unread crux verse first. When the budget is reached the server tells the model to compose with what it has.

Each evidence header names the author when the registry knows one ("… · by John Calvin") and the tradition of tagged items ("… · Reformed"). A search that finds nothing in a kind the index holds no documents of says so plainly ("The knowledge base holds no … texts — do not search for them again"), and a query naming a tradition the knowledge base has no texts of gets the same note, so the model does not spend calls retrying. Items listed as "text not shown" (a result too long for its character budget) cannot be cited until the model has read them.

The system prompt has three blocks: the core rules and the flow's task (both with cache breakpoints), then the knowledge base's holdings — which traditions have texts (and in which works) and which have none — generated from `holdings()` and stable while the knowledge base is unchanged. A publisher's house tradition (Tyndale House Publishers, "Evangelical (publisher)") does not make its study notes a tradition's texts, in the holdings or in perspectives.

The research instructions ask, for subjects on which churches differ, for one targeted search per tradition for its own statement of the disputed point (in its older vocabulary) and for how it reads the other side's key text; commentary on the crux verses rather than whole chapters; lexicon and word_occurrences before saying where else a word is used; both what Scripture says and how it shows the faithful (and Jesus) going through an inner experience (anxiety, grief, doubt); the texts on those wronged or harmed on painful subjects; curated topics as one source rather than the outline; and using the remaining budget on unread crux verses and unrepresented traditions before composing.

## 3. Composition tools (model-facing)

References are written as plain text (“Matthew 19:3–12”) and parsed server-side; `evidence` is a list of ledger ids (`["E3","E14"]`, at least one).

- **`begin_page`** `{ title, subtitle?, kind: 'passage'|'topic', passage?: reference, question?: string, summary: {text, evidence[]} }` — `passage` becomes the Scripture section (for topics: the anchor passage, which must be read or listed in the evidence). Title, subtitle and question are checked like the summary, against its evidence. Once sections exist, a second call may only update title, subtitle, question and summary; a change of kind or passage is rejected.
- **`add_section`** — one call per section, in page order (several calls may come in one turn): `{ section, mode?, title?, intro?, … }` where `section` and its items are (title and intro are uncited framing: short, and nothing that would need evidence):
  - `key-passages` (topics): `items: [{ reference, title, note, group, evidence[] }]`
  - `cross-references`: `items: [{ from, to, relationship, title, explanation, evidence[] }]` (`from` inside the page passage)
  - `original-languages`: `items: [{ strong, english, anchor?: { reference (one verse), phrase }, significance, semanticRange?: string[], caution?, evidence[] }]` — the server fills lemma, transliteration, gloss, grammar and occurrences **from the lexicon**; `strong` must appear in a lexicon evidence item the model retrieved
  - `historical-context`: `items: [{ category, title, summary, detail?, relatedVerses?: reference[], evidence[] }]`
  - `literary-context`: `{ placeInBook?: {text, evidence[]}, argument?: {text, evidence[]}, features: [{ type, title, description, verses?: reference[], evidence[] }] }`
  - `theology`: `{ themes: [{ category, title, summary, detail?, keyVerses: reference[], evidence[] }], perspectives: [{ question, consensus, intro, commonGround?, positions: [{ tradition, label, summary, keyTexts?: reference[], evidence[] }], evidence[] }] }` — in mode `replace` a call replaces only the list(s) it brings accepted items for, so themes and perspectives may come in separate calls
  - `commentary`: `voices: [{ evidence: id, mode: 'quote'|'summary', quote?, summary?, lead? }]` — author and work come from the evidence item (it must have a recorded author: the header shows “by …”); a `quote` must be an exact span of that evidence’s text, 6–60 words
- **`finish_page`** `{ opening: {text, evidence[]}, concepts: [{ label, aliases[], answer, section, verses?: reference[], evidence[] }], suggestedQuestions: string[] }` — concepts let the fast local engine answer follow-ups.

The tool result of every composition call reports what was **accepted** and what was **rejected and why**, so the model can repair a section by calling `add_section` again for it.

Follow-ups (`/api/inference/answer`) use the same research tools plus `reply { text, evidence[], focus?: {section, verses?}, suggestions?, declined? }` and may call `add_section` to extend the page. A `declined` reply without evidence may only say what the knowledge base lacks: at most two sentences, no references, dates, quotations or links, and no authors or works the reader did not name.

## 4. Validation (runtime integrity gate)

Hard rules — an item that fails is dropped (and reported back to the model):

1. Every item cites ≥ 1 evidence id that exists in this request’s ledger and whose text the model was shown.
2. Every reference parses and exists (chapter/verse counts from the bundled BSB). A listed reference (key passage, cross-reference target, key verse, related verse, key text) must be **given** by a cited item — contained in a reference it gives, or a same-chapter range reaching at most 5 verses beyond it (an item mentioning Matthew 5:31 does not ground “Matthew 1–28”) — or lie inside the page passage. Every reference mentioned in prose must be given the same way (prose may also name a chapter the evidence or passage lies in). Chapter-and-verse citations of things that are not books (“Hezekiah 3:16”) are rejected.
3. Key words: the Strong’s number must match a retrieved lexicon/original-text item; lemma, transliteration, gloss, parsing and occurrence counts are **hydrated from the lexicon/concordance**, never taken from the model. An anchor phrase must occur verbatim in that verse’s BSB text **and translate the word** (share a content word with its tagged gloss or lexicon entry), else the anchor, not the word, is dropped with the BSB rendering as a hint. Model-written senses must be stated by the lexicon; otherwise the lexicon’s own usable senses are shown (never a lexicographer’s note such as “used alone in the same sense”; the gloss when nothing else is usable).
4. Quotations: a commentary quotation is an exact span (whitespace/quote-mark normalised) of the cited evidence text, 6–60 words, and the evidence must be `quotable`. Inside prose, every quoted run of 4+ words — “…”, "…", ‘…’, '…' (at word boundaries, so apostrophes never count), «…», „…“ — must be an exact span of the cited evidence, of Scripture read in this request, or of the page passage (BSB/KJV/WEB). 1–3-word scare quotes are allowed.
5. Perspectives: every position cites a text **of its tradition** — a document tagged with it (confessions, the Catholic Encyclopedia), a confession titled with it, a text by an author the source registry places in it, or an editor-reviewed curated item naming it (families and aliases: `server/kb/traditions.ts`; “Protestant” accepts any Protestant family). A position labelled with a school or interpreter (“Hillel”) must cite a text that names it; a label that names no one (“Majority view”) is rejected. Only the authors of the matching texts become the position’s representatives. When the knowledge base has no text of a tradition, the rejection says so, so the model leaves the position out and says so. Consensus must be one of `consensus | denominational | historical-debate | uncertain`.
6. Cross-references: `from` lies inside the page passage; `relationship` is one of the domain values. A `quotation` must share wording — a run of three words, two of them content words, in the BSB texts of both passages (“male and female”, Genesis 1:27 → Matthew 19:4) — else it is kept as an `allusion`, with a warning.
7. No invented sources or metadata: no URLs in any form (including bare domains like `ccel.org/…`), no evidence ids in reader text, and no names (registry authors, historic people and works such as Josephus, Hillel, Westminster, Trent), traditions (“Catholics…”) or dates (“1563”, “AD 70”) in prose unless a cited item names them (or wrote them). A sentence that only discloses what the knowledge base lacks (“The knowledge base holds no Eastern Orthodox or Pentecostal text on divorce, so those traditions are not represented here.”) may name the missing traditions — as long as it makes no claim about them (no contrast, no verbs of teaching, ≤ 40 words). A verse written without its book (“In 7:15 …”) is sent back with “write the book name”.
8. Biblical names and conventional labels: a proper noun of the BSB itself (a word the translation capitalises mid-sentence and never writes in lower case — Cornelius, Judah, Ethiopian, Pharisees; not divine titles, pronouns or broad groups such as Jews, Gentiles, Israel) or a conventional label the text does not use (“Sermon on the Mount”, “Great Commission”, “Second Temple”) must occur in the item’s cited evidence, in Scripture read in this request, in the BSB text of the verses its cited evidence gives, in the page passage or in the reader’s words. A gentilic is grounded by its place (“Philippian” by Philippi); the traditional author of a cited book (“Paul” on Colossians) is not a claim.
9. Claim vocabulary needs a cited text that makes the claim: an era (“post-exilic”, “intertestamental”, “first-century”); a debate (“debated”, “disputed”, “interpreters differ”) — a cited text that states the disagreement, or texts of two different traditions cited side by side; a generalisation (“normally”, “usually”, “generally”); a reading of Greek tense or aspect (“once for all”, “decisive”, “the aorist pictures…”); and how translations render a word (“translations render it pledge, appeal or answer”: every rendering must be in the cited evidence — for the KJV’s wording, the KJV text read and cited). The debate, generalisation and aspect terms are recognised in pt/es/fr too (“debatido”, “generalmente”, “une fois pour toutes”, “o aoristo indica”) and need the same English wording in the evidence.
10. Scripture is paraphrased from the BSB: a run of four words (two of them content words) that the KJV or WEB text of the item’s verses has, that the BSB text of the same verses lacks and that no retrieved text contains, is rejected when it changes a pronoun or a negation — who does what to whom (“God has called us to peace” for 1 Corinthians 7:15, whose BSB reads “called you to live in peace”). Other shared phrasing is ordinary paraphrase.
11. Key words, beyond rule 3: other uses of the word must be real and read — every verse the significance or caution mentions (besides the anchor) must contain this lemma according to its own concordance (a noun is not its cognate verb: μέριμνα G3308 is in 2 Corinthians 11:28, μεριμνάω G3309 is not), or a lemma whose lexicon entry the card cites; it must have been read in this request unless the sentence only says what the cited lexicon says; and a sentence that describes other uses without references (“the same word used of Martha’s distraction…”) must be described by the cited lexicon entry. The caution goes through every prose check and is dropped (the card stays) when it passes a moral verdict (“sinful”, “condemned”) no cited text makes. In `replace` mode duplicates are checked within the call’s list only (the list IS the section). Anchor matching ignores auxiliaries and negators (“has”, “not”) and folds irregular forms (“bound” ~ “bondage”); a phrase of function words anchors only a word whose gloss is one.
12. Perspectives, beyond rule 5: a publisher’s study notes (a registry author whose tradition is “… (publisher)”) cannot stand for a tradition, nor be a position of their own (“Tyndale Open Study Notes” beside Catholic and Reformed) — they belong in context or commentary. A joint work by authors of different churches (registry tradition “Presbyterian and Anglican”: JFB) cannot alone ground either church’s label. A common ground that speaks for every position (“all”, “each”, “both”…) is dropped, with a warning, unless each position’s own cited texts state at least half of its content words (English pages).
13. Absence claims: a sentence saying the knowledge base lacks a tradition’s texts (in any page language: “não traz texto luterano”) is rejected when the knowledge base does hold that tradition and it was neither searched with `tradition` nor represented in the ledger — the hint names the held works.

These checks apply to **every reader-visible string**: page title, subtitle, question and summary; item titles, notes, groups, explanations, summaries, details; perspective questions, intros, labels, traditions; voices and leads; the opening, concept labels, aliases and answers; suggested questions (dropped when they carry links, quotations or non-existent references); replies.

Provenance of generated prose: `kind 'synthesis'`, `verification 'generated'`, citations = the cited evidence (with `excerpt`: for Scripture, the verses the claim names; for a key word, the part of the tagged text around its Strong’s number; otherwise the window sharing most words with the claim). Matched quotations: `kind 'quotation'`, `verification 'verified'` (matched against the retrieved public-domain text). Listed ranges (related verses, concept verses) are kept whole, up to 40 verses (the UI compresses them back into ranges).

What the checks cannot see — whether a paraphrase says what its source says (an attribution inverted, a clause added inside “X notes that…”) — is left to the prompt: an entailment pass by a second model was considered and deferred (latency and cost per section, and its own error rate).

## 5. Transport & client

- `GET /api/inference/status` → `InferenceStatus`.
- `POST /api/inference/compose` and `/answer` → `text/event-stream` of `InferenceEvent`s (`src/inference/protocol.ts`): `progress` (live steps) → `study` snapshots (after each accepted section, `complete:false`; final `complete:true`) → `reply` → `done`. Errors: `error` then `done`.
- The client engine forwards these as `EngineStreamEvent`s through `EngineContext.onEvent`; the session store switches to the study as soon as the first snapshot arrives and re-renders as sections land.
- Page cache: identical query + translation + model + page language (+ the client’s passage/topic hint) is served from `.kb-cache/pages/` (marked `generation.cached`); “Regenerate” bypasses it. Each cached page records a fingerprint — knowledge-base version, generator version (hash of the prompt, tools and validator code plus `GENERATOR_REVISION` in `server/inference/cache.ts`), effort and research budget — and a page whose fingerprint differs from the running server’s is recomposed, never served. Only complete pages composed by the configured model are cached (not partial pages, not pages a fallback model served). An identical compose request arriving while one is in flight waits for it and opens the cached page; the cache key, the in-flight key and the generated study id all come from `composeCacheKey` (English keeps the pre-localisation key shape, other languages add `|<locale>`), so a page written in one language is never served in another.
- Requests: POST bodies must be `application/json`; cross-site requests (an Origin other than the server, or `Sec-Fetch-Site: cross-site`) get 403; at most 2 compositions/answers run at once (429 `rate-limited` otherwise).
- Failures: overloaded / `api_error` events inside an open stream and dropped connections re-issue the same turn (up to 2 retries with backoff). If they persist after sections were accepted — or the API rejects the account or the request (HTTP 400, e.g. no credit left) — the page is finalised like a deadline, with a caution note that says it is incomplete, and not cached. A refusal after the page began says the shown sections passed the checks. The reader never sees the provider’s own error text (a JSON body with a request id): errors carry a plain sentence, and the provider text goes to the debug log (`outcome.error.upstream` / `outcome.interruption`). Codes are chosen from the typed error, the HTTP status and the error body’s `type`, never from message text. After a run fails in a way retrying cannot fix (400/401/403), `GET /status` reports composition unavailable, with that plain reason, for 5 minutes or until a later run reaches the model. Fallback-served turns are detected from `usage.iterations` (a `fallback_message` entry; sticky-routed turns carry no fallback block), and usage is summed over all iterations.
- Error and status codes: every `error` event carries an `InferenceErrorCode` (`no-credit` is its own code: a `billing_error`, or a 400 whose body reports no credit), and `GET /status` adds `reasonCode` (`no-credentials` · `no-credit` · `loading` · `kb-error` · `rejected`) beside the English `reason`. The client localises codes with the catalog namespace `inference` (`status.<code>`, `error.<code>`; helpers in `src/inference/localize.ts`); English keeps the server’s own wording, which carries details the codes do not.
- Debug log per run: `.kb-cache/logs/*.json` (evidence ledger, tool calls, validator decisions, usage, retries, fallback turns, knowledge-base and generator versions, timings).

## 5a. Page language (pt · es · fr)

Requests carry `locale` (body field, else `Accept-Language`, else `en`). The language is stated only in the per-request **user** message (`languageInstruction` in `server/inference/prompt.ts`), never in the system prompt or tool definitions, so the cached prompt prefix is byte-identical for every language; English requests carry no language line at all.
- The model writes every reader-facing field in the page language and keeps every quotation verbatim in its source’s language: Scripture in the reader’s version, commentaries, confessions and lexicon glosses as retrieved (the knowledge base is English apart from Scripture). It calls the research tools with English terms; `read_passage` accepts every version the knowledge base holds (the same enum for every request) and defaults to the reader’s.
- Scripture quoted in prose is verified against the evidence, Scripture read in the request, and the page passage in BSB, KJV, WEB **and the reader’s version**.
- Key-word anchors: `anchor.phrase` is always the exact **BSB English** wording of the verse (the language instruction says so) and is validated against BSB and the lemma’s glosses as before; the page carries its BSB/KJV/WEB renderings. On pt/es/fr pages the model may add `anchor.readerPhrase` — the word’s rendering in the reader’s version of that verse — and it is kept for every version of the page language whose verse holds it verbatim (a warning when the reader’s own version does not); nothing is inferred when it is absent.
- References: the validator and the reference checker parse the page language’s book names (“Mateus 19:9”, “Mateo 6:25”, “Jean 1:1”) — in prose and in tool inputs — so the model never has to fall back to English book names (eval2: pt/es pages leaked “Matthew”, “Deuteronomy”). Tradition words and absence disclosures are recognised in pt/es/fr too (`traditionWordsIn`, `isAbsenceSentence`; family patterns in `server/kb/traditions.ts`); ambiguous words (“ortodoxo”, “reformado”, “Batista” in “João Batista”) count only capitalised or not after a name.
- Follow-up answers: the focus reason and update chips (“Adicionado: 2 notas de contexto em …”) are formatted on the server from the `inference` catalogue (`answer.*`) in the request language; section titles are the model’s own or the `study` catalogue’s.
- English-only checks: the KJV/WEB translation-echo check is skipped on non-English pages (it compares English prose with English versions), and the proper-noun grounding check (`properNouns.ts`) matches English (BSB-derived) names and labels, so on pt/es/fr pages it does not catch invented names written in those languages (“Moisés”, “Moïse”). Building its name set from the reader’s version is future work; every other check (citations, quotations, references, word claims) is language-independent.

## 6. Routing (client)

1. Curated deep study matches (passage study or topic study) → curated page, no model call.
2. Otherwise, if the inference layer is available and enabled → compose.
3. Otherwise → the existing library study / topic-index path, with a note that live composition is unavailable.
4. Follow-ups: local engine first (instant, uses the page’s concepts); if it declines or cannot classify, → `/answer`.

## 7. Model configuration (server env / `.env.local`)

| Variable | Default | |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | required (or `ANTHROPIC_AUTH_TOKEN`, or an `ant auth login` profile) |
| `EMMAUS_MODEL` | `claude-opus-5` | |
| `EMMAUS_EFFORT` | `high` | `low`…`max`; the main latency/cost lever |
| `EMMAUS_MAX_TOKENS` | `64000` | per turn (4096–128000) |
| `EMMAUS_MAX_RESEARCH_CALLS` | `16` | per composition (1–60) |
| `EMMAUS_MAX_ANSWER_RESEARCH_CALLS` | `8` | per follow-up answer (0–30) |
| `EMMAUS_RESEARCH_SECONDS` | `120` | research phase before “compose now” (10–900) |
| `EMMAUS_TIMEOUT_SECONDS` | `480` | whole request; a page with sections is then finalised (30–3600) |
| `EMMAUS_MAX_TURNS` | `40` | model turns per request (4–120) |
| `EMMAUS_FALLBACKS` | on | `off` disables server-side refusal fallbacks |
| `EMMAUS_DEBUG_LOGS` | on | `off` disables `.kb-cache/logs` |
| `EMMAUS_LIVE` | on | `off` makes the server report live composition unavailable, as without a key — the e2e tests set it so they never call the API |

Requests use streaming, adaptive thinking, prompt caching of the (stable) system prompt + tools, and server-side refusal fallbacks (`fallbacks: "default"`, beta `server-side-fallback-2026-07-01`). The API is mounted on the Vite dev server (`npm run dev`) only; `vite preview` serves the static build without it.
