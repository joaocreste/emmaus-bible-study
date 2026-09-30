# Emmaus — Bible study & theological research

> “Were not our hearts burning within us as He spoke with us on the road and opened the Scriptures to us?” — Luke 24:32 (BSB)

Emmaus pairs a **conversational study assistant** with a **living study dashboard**. You ask; the assistant answers briefly and the dashboard reorganises itself around your question — highlighting the word in the passage, opening its Greek or Hebrew, pinning the cross-references that explain it, and surfacing the commentators who discuss it.

**Ask → Explore → Cross-reference → Understand → Go deeper.**

In **English, Português, Español and Français**, with at least three Bible versions per language. No account or database: the study library runs entirely in the browser, and an optional local inference server composes new study pages with Claude when you provide an Anthropic API key.

The name is a placeholder product name.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

The first `npm run dev` fetches and builds the STEPBible data (tagged Hebrew/Greek, lexicons, concordance) once — it needs network. STEPBible asks projects to link to their repository rather than redistribute the data, so it is not stored here.

**Live composition (optional).** Create `.env.local` (git-ignored) with `ANTHROPIC_API_KEY=…` and restart `npm run dev`. Questions that no curated study covers then produce a new study page composed by Claude from the knowledge base. Without a key everything else works and those questions open a library study instead. The key stays on the local server and is never sent to the browser.

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server + local inference API (`/api/inference/*`) |
| `npm run build` | Typecheck + production build (`dist/`) |
| `npm test` | Unit, engine, inference and **data-integrity** tests (Vitest) |
| `npm run test:e2e` | End-to-end flows in desktop + phone viewports (Playwright, uses your installed Chrome) |
| `npm run typecheck` | `tsc` strict |
| `npm run data:build` | Rebuild the open datasets in `public/data` from their sources (network required, cached in `.data-cache/`); `-- --only=stepbible` for just the STEPBible part |
| `npm run kb:build` | Rebuild the knowledge-base corpora in `kb/corpus` (the search index itself builds on first use into `.kb-cache/`) |

## What you can do

- **Study any passage** — a verse, range, chapter, several chapters or a whole book (`John 1:1`, `Romanos 8`, `Mateo 5–7`, `Genèse`, `Psalm 23`). Every passage has real text, an interlinear of the tagged Hebrew/Aramaic/Greek, a lexicon for every word, cross-references, Tyndale study notes and classic public-domain commentaries.
- **Explore a topic** — Grace, Faith, Forgiveness, Suffering, Prayer, Salvation, The Trinity, The Holy Spirit, Marriage, Anxiety, Predestination, The Kingdom of God, Wealth and more — or just ask in your own words.
- **Five curated deep studies** show the full experience: **Romans 8**, **John 1**, **Psalm 23**, **Grace** (topic) and **Suffering** (topic). They add explained cross-references, key-word studies, historical and literary context, theology, perspectives where Christians genuinely differ, and sourced voices from Augustine to Keller.
- **Ask anything else** (with live composition on): “What does the Bible say about divorce?”, “¿Qué dice la Biblia sobre la ansiedad?”, “Genèse 1” — Emmaus researches the knowledge base and composes a new page, streamed section by section, every statement linked to the evidence it rests on.
- **Follow-ups the dashboard responds to**, for example: “What does condemnation mean?”, “Show me what Tim Keller says about this”, “Onde mais Paulo fala disso?”, “Explain verse 28”, “How would the original audience have understood this?”, “Are there different theological interpretations of this passage?”, “Quel est le mot grec derrière « Parole » ?”, “How does this connect with Genesis?”.

Try asking Psalm 23 “What did Tim Keller say about this?” — there is no verified Keller source on that psalm in the library, so the assistant says so instead of inventing one.

## Languages & Bible versions

Pick a language in the top bar; the version list then shows that language’s versions. First visits follow the browser language.

| Language | Versions (default first) | References |
|---|---|---|
| English | Berean Standard Bible, King James Version, World English Bible | Romans 8:28 |
| Português (Brasil) | Bíblia Livre, Nova Bíblia Viva, Bíblia Portuguesa Mundial | Romanos 8:28 |
| Español | Reina-Valera 1909, Santa Biblia libre para el mundo, Versión Biblia Libre | Romanos 8:28 |
| Français | Louis Segond 1910, Darby, néo-Crampon Libre, Ostervald | Romains 8.28 |

The interface, the chat engine and the curated studies are translated. Open datasets that exist only in English (study notes, commentaries, lexicon definitions, dictionaries, confessions) are shown in English with an “(in English)” marker; verified quotations are never rewritten — a free translation may accompany them, labelled as unverified. Details: [docs/I18N.md](docs/I18N.md).

## Source grounding (the rule everything is built around)

Every piece of content carries provenance: **claim → source → author → work → location → link**, and the interface labels what you are reading — *Scripture*, *Original text*, *Lexicon*, *Historical context*, *Literary observation*, *Quotation*, *Summary*, *Study synthesis* (AI-assisted, written for Emmaus from the cited sources), *Open dataset* or *Generated* (a live-composed page, checked mechanically but not reviewed by a person).

- **Quotations** appear in quotation marks only when the exact wording was verified against a real, linked, public-domain (or openly licensed) edition, with a locator.
- **Modern copyrighted works** (Keller, Piper, Stott, Packer, Sproul, Wright, Carson, Lewis, Graham…) are **summarised**, never quoted, with accurate bibliographic data and links.
- **Scripture text is never typed by hand** — it is read from the bundled translations.
- `src/data/__tests__/integrity.test.ts` enforces these rules mechanically: every citation resolves, quotations are verified/located/linked and only from sources whose license allows it, every Scripture reference exists, every key-word anchor occurs in the translation text, and every lemma agrees with the lexicon.
- **Live-composed pages obey the same rules at runtime:** the model may only arrange and explain evidence the knowledge base returned; a validator rejects uncited claims and any reference, name, date or quotation the cited evidence does not contain, and fills lexical data from the lexicon itself. See [docs/INFERENCE.md](docs/INFERENCE.md).

See [docs/CONTENT-GUIDELINES.md](docs/CONTENT-GUIDELINES.md).

## Architecture

```
src/
  domain/      framework-free models (the contract), canon, references in four languages, provenance
  i18n/        locales, message catalogs (TypeScript-enforced completeness), formatting
  providers/   Scripture · OriginalText · Lexicon · CrossReference · Commentary · HistoricalContext
               · Sermon · Topic · CuratedStudy · SourceRegistry  (interfaces + implementations)
    local/     bundled open datasets (public/data), with live fallback for non-bundled commentary
    curated/   curated library (+ pt/es/fr overlays), source registry, topics, sermons
  engine/      StudyEngine contract: LocalStudyEngine (intent → retrieval → focus → reply)
               and InferenceStudyEngine (curated first, otherwise live composition)
  inference/   client + wire protocol for the inference server (SSE)
  data/        curated study layers + source/author registry
  state/       serialisable session store (messages, study, focus, inspector, reader settings)
  ui/          primitives, shell, welcome, chat, study workspace, inspector
server/
  kb/          knowledge base: ~59k documents (study notes, lexicon, topical indexes, dictionaries,
               creeds & confessions, Catholic Encyclopedia) in a BM25 index
  inference/   research tools → page composition (Claude) → validator → streamed Study
```

The UI talks only to provider interfaces and the `StudyEngine` interface; the chat shows each answer’s pipeline under “How this answer was assembled”. Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Design system: [docs/DESIGN.md](docs/DESIGN.md). Original brief: [docs/PRODUCT-SPEC.md](docs/PRODUCT-SPEC.md).

**Responsive by design:** phone (< 760px) uses a Chat | Study | Sources tab model; tablets get a split view with a collapsible chat (full-width reading); desktop gives the study panel most of the space.

## Public edition (GitHub Pages)

`.github/workflows/pages.yml` builds a static edition on every push to `main`. It has no inference server — curated and library studies work, live composition needs a local install with your own key. STEPBible data is fetched at build time, and the Hebrew lexicon’s definitions are omitted there until permission is granted (see below).

## Data & licenses

| Data | Source | License |
|---|---|---|
| Berean Standard Bible, King James Version, World English Bible | Free Use Bible API (bible.helloao.org) | Public domain (KJV: Crown patent in the UK) |
| Portuguese, Spanish and French versions | eBible.org | Public domain; Bíblia Livre CC BY; Nova Bíblia Viva, Versión Biblia Libre, néo-Crampon Libre CC BY-SA |
| Tagged Hebrew/Aramaic & Greek (TAHOT/TAGNT), brief lexicons (TBESH/TBESG) | STEPBible.org · Tyndale House Cambridge — fetched, not redistributed | CC BY 4.0 (TBESH definitions derive from Online Bible’s abridged BDB — seek permission before a production release) |
| Cross-references | OpenBible.info | CC BY 4.0 |
| Tyndale Open Study Notes & book introductions | Tyndale House Publishers | CC BY-SA 4.0 |
| Calvin, Matthew Henry (and continuators), Jamieson-Fausset-Brown, Keil & Delitzsch | Free Use Bible API | Public domain |
| Nave’s, Torrey’s, Easton’s, Smith’s | CCEL (via the NEUU Bible Topics Dataset) | Public domain (dataset CC BY 4.0) |
| Creeds, confessions and catechisms; Catholic Encyclopedia (1913) | CCEL (Schaff), OPC, New Advent and others — see the source registry | Public domain |

`public/data` (per-book JSON, loaded lazily) is generated by `npm run data:build`; see [scripts/data/README.md](scripts/data/README.md). Commentary for books not bundled locally is fetched live from the Free Use Bible API when online.

## Not built yet (by design)

Authentication, accounts, persistence/sync of notes and highlights, payments, native iOS/iPadOS apps, a hosted inference service, admin tooling. The session state and domain model are serialisable and framework-free so these can be added without redesign.
