# Emmaus — Bible study & theological research (local web MVP)

React 19 + TypeScript 7 (strict) + Vite 8, CSS Modules + CSS variables. No backend, no auth, no DB.

## Commands
- `npm run dev` — dev server (port 5173)
- `npm run typecheck` — `tsc -p tsconfig.json` (must pass)
- `npm test` — vitest (domain, engine, data-integrity tests)
- `npm run build` — typecheck + production build
- `npm run data:build` — regenerate bundled open datasets into `public/data/` (network required)

## Architecture (read docs/ARCHITECTURE.md for detail)
- `src/domain/` — framework-free models (`models.ts` is THE contract), canon (`books.ts`), references (`reference.ts`), provenance helpers.
- `src/providers/` — provider interfaces (`types.ts`) and implementations: `local/` (bundled open datasets under `public/data`), `curated/` (curated library, sources registry, topics, sermons). `registry.ts` is the composition root.
- `src/engine/` — `StudyEngine` contract + `LocalStudyEngine` (deterministic intent rules → reply + `DashboardFocus`). Future: retrieval + LLM engine behind the same interface.
- `src/data/curated/` — curated study layers (the MVP's mock/curated data, clearly separated from `public/data`).
- `src/state/` — session store (`types.ts` contract, `session.tsx` implementation).
- `src/ui/` — `primitives/` (shared), `shell/`, `welcome/`, `chat/`, `study/`, `inspector/`, `hooks/`.
- `src/styles/` — `tokens.css` (design tokens, two themes), `base.css` (typographic roles), `fonts.ts`.

## Non-negotiable content rules (docs/CONTENT-GUIDELINES.md)
- Never invent sources, quotations, historical claims, lexical data, or Bible references.
- Quotation marks only for exact words verified against a real, cited source (`kind: 'quotation'`, `verification: 'verified'`, with locator + URL). Otherwise write a clearly labelled summary.
- Copyrighted modern works (Keller, Piper, Stott, Packer, Sproul, Wright, Carson, Lewis, Graham…) → `summary` only, with accurate bibliographic metadata and a real link. Never reproduce their wording.
- Every content item carries `Provenance` (kind + verification + citations). AI-written prose is `synthesis`.
- Scripture text is never stored in curated files — it is fetched from the ScriptureProvider (BSB/KJV/WEB, public domain).

## UI rules (docs/DESIGN.md)
- Use design tokens only (no raw hex in components). Gold = accents only. Never convey meaning by colour alone.
- Scripture/quotes in `--font-serif`; UI/chat/metadata in `--font-sans`; headings in `--font-display`; Greek `--font-greek` (`lang="grc"`), Hebrew/Aramaic `--font-hebrew` (`lang="hbo"`, `dir="rtl"`).
- Semantic HTML, keyboard reachable, visible focus, `aria-*` on custom controls, respects `prefers-reduced-motion`.
- Co-locate styles as `Component.module.css`. Reuse `src/ui/primitives` (Button, IconButton, Chip, Badge, ProvenanceTag, Disclosure, CrossMark, CrossDivider, CrossLoader).
