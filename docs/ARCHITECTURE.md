# Emmaus — Architecture

## Core loop

```
user message ──► StudyEngine.respond(message, ctx)
                   │  1. intent + slot extraction (passage / topic / term / author / verse)
                   │  2. retrieval from providers (scripture, lexicon, xrefs, commentary, context, curated study)
                   │  3. ranking / selection (concept index, tags, verse overlap, author filters)
                   │  4. synthesis (today: curated answers + templates; future: LLM over retrieved evidence)
                   ▼
            EngineResult { reply: ChatMessage, study?: Study, focus?: DashboardFocus, trace }
                   │
         ┌─────────┴───────────┐
         ▼                     ▼
   Chat panel            Study workspace applies DashboardFocus:
   (reply, updates,      scroll to section · expand items · highlight words/verses ·
    citations, trace)    filter cross-references · pin commentary · show reason banner
```

The engine never returns free-floating evidence: every item it surfaces already exists in a provider (dataset or curated library) and carries `Provenance`.

## Layers

| Layer | Path | Responsibility |
|---|---|---|
| Domain | `src/domain` | Models (`models.ts`), canon metadata (`books.ts`), reference parsing/formatting (`reference.ts`), provenance helpers. No React, no fetch. |
| Providers | `src/providers` | Interfaces (`types.ts`) + implementations. `local/` reads bundled open datasets from `public/data`. `curated/` exposes the curated library, source registry, sermon catalogue and topic index. `registry.ts` composes them. |
| Curated data | `src/data/curated`, `src/data/registry` | Hand-built study layers — the MVP stand-in for retrieval + synthesis. Clearly separate from production datasets. Loaded with `import.meta.glob`. |
| Engine | `src/engine` | `StudyEngine` interface; `LocalStudyEngine` (deterministic intents over the concept index); `StudyAssembler` for library studies of any passage/topic. |
| State | `src/state` | Session store (messages, study, focus, inspector, reader settings). Serializable, ready for persistence/sync. |
| UI | `src/ui` | Presentation only. Reads state via `useSession()`, data via `useProviders()` + hooks. |

## Providers (spec §8)

| Interface | Today | Tomorrow |
|---|---|---|
| `ScriptureProvider` | BSB/KJV/WEB JSON per book in `public/data/bible` | Licensed Bible API (ESV/NIV/NASB), user translation prefs |
| `OriginalTextProvider` | STEPBible TAGNT/TAHOT per book | Same data served from API/DB |
| `LexiconProvider` | TBESG/TBESH + concordance built from tagged text | BDAG/HALOT (licensed), semantic domains (Louw–Nida) |
| `CrossReferenceProvider` | OpenBible.info votes (dataset) + curated explained refs in studies | Curated graph DB with typed relationships |
| `CommentaryProvider` | Tyndale Open Study Notes (all books) + public-domain commentaries (bundled for 12 books; live Free Use Bible API fallback that reports network failure rather than “no comment”) | Licensed commentaries, sermon transcripts |
| `HistoricalContextProvider` | Tyndale book introductions | Bible dictionaries, atlases, timelines |
| `SermonProvider` | Curated sermon metadata inside studies | Sermon archives / ministry APIs |
| `TopicProvider` | Curated topic index | Topical Bible + embeddings |
| `CuratedStudyRepository` | `src/data/curated/studies/*.ts` | Generated + editorially reviewed studies cached per passage |
| `SourceRegistry` | `src/data/registry` (base → shared, edition-specific ids) + study-specific additions | Source database with licensing workflow |

## Future AI architecture (spec §21)

`LocalStudyEngine` already follows the target pipeline shape and records it in `trace` (visible in chat as “How this answer was assembled”). A future `RetrievalStudyEngine` will:

1. Extract intent/passage/topic with an LLM (or keep rules for the obvious cases).
2. Retrieve Scripture, lexical data, cross-references, commentary/sermons through the same providers (plus a vector index over licensed sources).
3. Rank sources (authority, relevance, licensing).
4. Ask the LLM to **synthesise only from retrieved evidence**, returning a structured `Study` patch + reply with citations to retrieved items (reject uncited claims).
5. Return `EngineResult` — the UI does not change.

## Multi-platform readiness (spec §16)

- `src/domain`, `src/engine` and the provider implementations are plain TypeScript with no DOM or React dependency, so they can move to a server, a React Native app or a JS bridge. Two bindings are host-specific and would be swapped: `src/providers/ProvidersContext.tsx` (the React context) and `src/providers/curated/modules.ts` (Vite’s `import.meta.glob`, which a server/native build would replace with a generated index or an API). The engine only imports *types* from `src/state`.
- UI layout is pane-based (`chat` / `study` / `sources`) — the iPhone tab model is already implemented at < 760px; iPad maps to the split layout.
- Session state is serialisable (future: persistence, accounts, sync of notes/highlights/bookmarks).
- Reader settings live in `localStorage` today; they are a natural first candidate for per-user sync.

## Quality gates

- `npm test` — unit tests for domain, providers, engine, state and UI helpers, plus `src/data/__tests__/integrity.test.ts`, which enforces the source-grounding rules over the whole curated library (resolvable citations, quotation rules, license coherence, every Scripture reference and key-word anchor checked against the bundled text, lemmas against the lexicon, one definition per shared source).
- `npm run test:e2e` — Playwright flows (desktop + phone) for the core loop.
- Content was additionally reviewed by independent adversarial verifiers (sources/quotations lens and Scripture/lexical/theology/history lens); their logs are not part of the repo.
