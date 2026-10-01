# Emmaus — Design system & interface specification

> “Were not our hearts burning within us as He spoke with us on the road and opened the Scriptures to us?” — Luke 24:32 (BSB)

The product is named after the Emmaus road: a conversation in which the Scriptures are opened. The interface should feel like **a beautiful modern theological library combined with a carefully annotated Bible** — warm, Mediterranean, scholarly, contemplative, calm and premium. It must not look like a generic SaaS dashboard or an “AI chatbot”: no gradients as decoration, no glassmorphism, no neon, no sparkle icons, no purple AI branding.

---

## 1. Visual language

**Surfaces.** Parchment background (`--color-bg`) with a faint paper grain. Content sits on slightly lighter “leaf” surfaces (`--color-surface`) with hairline warm borders (`--color-border`) and very soft shadows. Prefer whitespace and hairline rules over boxes-within-boxes. Cards: `--radius-lg`, 1px border, `--shadow-xs`; raised states use `--shadow-md`.

**Arch motif.** The Mediterranean arch (`--radius-arch`: round top, square bottom) is the secondary shape: welcome emblem, empty states, author monograms, the logo. Use it sparingly.

**Cross motif (spec §13).** The cross is the primary symbol — used with restraint:
- Logo: `<CrossMark variant="emblem">` (cross inside an arch) + “Emmaus” wordmark in `--font-display`, small caps feel.
- Loading: `<CrossLoader>` (cross traced stroke by stroke).
- Separators: `<CrossDivider>` between major groups only (e.g. before Sources, end of study) — never between every card.
- Empty states: arch + small cross.
- Tiny details: focus banner marker, “updated” notices.
Never tile or repeat crosses decoratively.

**Color.** Tokens in `src/styles/tokens.css`. Parchment/charcoal for reading; olive for primary actions/links; sage for calm secondary tags; terracotta for interactive words and highlights (always with underline); gold only for accents (verse numbers, focus rings, rules, active markers). Two themes: `parchment` (default) and `evening` (warm dark) — set `data-theme` on `<html>`; `system` follows `prefers-color-scheme`.

Contrast (WCAG AA verified): ink 13:1, ink-2 7.9:1, ink-3 5.3:1 on parchment; olive text 5.5:1; `--color-accent-ink` 6:1; `--color-gold-ink` 4.9:1. **Never use `--color-gold` or `--color-accent` for small text** — use the `-ink` variants.

## 2. Typography (spec §12)

| Role | Font | Token / class | Notes |
|---|---|---|---|
| Display headings, study title, section titles | Cormorant Garamond 600 | `--font-display`, `.t-display` | Only ≥ 22px. Never for body. |
| Scripture | Literata (opsz) | `.t-scripture` (19px × reader scale, leading 1.75) | Max measure `--reading-measure` (~70ch). |
| Quotations (verified) | Literata italic | `.t-quote` | Inside quotation marks, with attribution line below. |
| Summaries, context, commentary prose | Source Sans 3 | `.t-reading` | 17px × reader scale. |
| Study synthesis (AI-assisted) | Source Sans 3 | `.t-synthesis` | Paired with a 2px left rule in `--kind-synthesis` and a ProvenanceTag. |
| UI, chat, metadata, controls | Source Sans 3 | `--font-sans`, `.t-meta`, `.t-eyebrow` | Eyebrows: 12px caps, tracking 0.08em. |
| Greek | Gentium Book Plus | `.t-greek` / `lang="grc"` | Polytonic. |
| Hebrew / Aramaic | Noto Serif Hebrew | `.t-hebrew` / `lang="hbo"` or `lang="arc"`, `dir="rtl"` | Vowel points; strip cantillation marks for readability. |
| Transliteration | Literata italic | `.t-translit` | |

Reader text scales with `--reader-scale` (settings: 90%–140%). UI chrome does not scale with it (browser zoom still works).

## 3. Provenance (spec §6)

Every content block shows a quiet `<ProvenanceTag>` (icon + uppercase micro-label, coloured by `--kind-*`, never colour alone). Kinds: Scripture · Original text · Lexicon · Historical context · Literary observation · Commentary · Quotation · Summary · Study synthesis · Open dataset. Hover/title explains the kind; the Sources section contains a legend explaining all kinds in plain language.

Rules the UI enforces:
- `quotation` → render inside curly quotes, `.t-quote`, with “— Author, *Work*, locator” and a “Read source →” link. If `verification !== 'verified'`, **do not** render quotes; render as summary and show “Unverified” in `--color-danger`.
- `summary` → never in quotation marks; lead with “Summary of *Work*”.
- `synthesis` → left rule in `--kind-synthesis`; label “Study synthesis”; citations as source chips.
- `dataset` → label “Open dataset”, plus “not individually reviewed”.
- Citations render as **source chips** (`SourceChip`): short title + locator; click → Inspector(source).

## 4. Layout & breakpoints (spec §15–16)

```
phone   < 760px      single pane + bottom tab bar:  Chat | Study | Sources
tablet  760–1179px   split: chat 340px (collapsible) | study; inspector = overlay sheet (right)
desktop ≥ 1180px     split: chat 400px | study (flex, content max ~62rem); inspector = side sheet 440px
wide    ≥ 1600px     chat 420px; study content centred
```

- **Top bar** (60px, surface, hairline bottom): CrossMark + “Emmaus” wordmark (click → welcome, with confirm if a study is open? no — just return; history is session-only); current study title (tablet+); **Search** button that opens the command palette (⌘K / Ctrl-K; label “Search passages, topics, words…”); translation select (BSB/KJV/WEB); reader settings popover (Aa: text size slider/steps, theme: System/Parchment/Evening, verse numbers toggle); chat collapse toggle (tablet/desktop) = full-screen reading mode.
- **Chat panel** (left): header “Conversation” + current study chip; message list (scrolls independently, `aria-live="polite"` for new assistant replies); composer pinned at bottom; suggestion chips above the composer.
- **Study workspace** (right, more space): independent scroll container.
- **Phone**: bottom tab bar (64px + safe-area) with icons + labels; when the engine updates the study while the user is on Chat, the Study tab shows a gold dot and a toast “Study updated · Original languages — View”.
- iPad landscape = split; iPad portrait = split with narrower chat or collapsible; touch targets ≥ 44px.

## 5. Welcome (spec §3)

Calm, centred, lots of air. From top: emblem (arch + cross, 56px), small eyebrow “Emmaus · Bible study”, headline **“What would you like to study today?”** (Cormorant, 44–60px), one-line subtitle (“Open a passage or explore a topic. Every quotation is sourced; every synthesis is labelled.”).

A large input (serif placeholder, 56px tall, rounded, olive submit arrow) accepting anything — reference, topic or question — with two path tabs/cards beneath:
- **Study a passage** — example chips: John 1:1 · Romans 8 · Matthew 5–7 · Psalm 23 · Genesis
- **Explore a topic** — example chips: Grace · Faith · Forgiveness · Suffering · Prayer · Salvation · The Trinity · The Holy Spirit · Marriage · Anxiety · Predestination · The Kingdom of God · “What does the Bible say about wealth?” · “Why does God allow suffering?”

Then **Featured studies** (curated): cards with arch-topped header band (olive/sage/terracotta/sand tint), title in display serif, subtitle, a short verse excerpt, and “Curated study” badge. Footer: Luke 24:32 (BSB) in italic serif with reference, and a quiet line “Local preview · no account · nothing leaves your device”.

Transition into the study: fade/slide (220ms), the chat shows the user’s first message and the assistant’s opening message.

## 6. Chat (spec §4A, §14)

- User messages: right-aligned, `--color-surface-sunken` bubble, sans 15–16px.
- Assistant messages: left, no bubble, small CrossMark glyph avatar; paragraphs in sans; inline chips from tokens (`{{ref:…}}` → reference chip opens Inspector(passage); `{{word:id}}` → word chip (original script) opens the word; `{{section:id}}` → section link; `{{source:id}}` → source chip).
- Under each assistant reply: **“Study updated”** list (from `message.updates`): small gold cross marker + label, each clickable → focuses that section. Then citations row (source chips). Then a disclosure **“How this answer was assembled”** listing `trace` steps (Intent → Scripture → Lexicon → … → Synthesis) with provider ids — this previews the future RAG pipeline honestly.
- Provenance line for the reply: “Study synthesis from the local library” (or “Could not find a verified source — nothing invented” when the engine declines).
- Thinking state: CrossLoader + rotating pipeline step labels (“Identifying the passage…”, “Consulting the lexicon…”).
- Composing a new study (live composition, before its first section arrives — usually a minute or more): a centred card over the reading area (`src/ui/shell/ComposeCard.tsx`) — the cross loader on a large sage disc, “Composing your study”, the question, the current step with the two before it fading, and the elapsed time with what to expect. The top bar stays usable (“New study” stops it) and, on tablet/desktop, so does the conversation. It gives way to the page as soon as sections land; the workspace’s composing notice takes over. Live steps everywhere (this card, the chat, the welcome status line, the composing notice) speak in study terms in the reader’s language, naming the Bible passages being read (“Lendo Mateus 19:3–9…”), from each step’s `reader` field (`composeSteps.ts`); model names, research budgets, lexicon numbers and source checks are never shown to the reader (they stay in the trace and the logs). The study header does not name the model either.
- No technical text for the reader, anywhere: no model names, providers, scores, budgets, checks, API keys or setup commands. Under each reply, “What this answer drew on” lists the kinds of sources consulted (and the Bible passages a live answer read) and says whether it was written with AI from them or assembled without generative AI (`src/ui/chat/readerTrace.ts`); the step-by-step pipeline stays in `message.trace` and the server logs. Unavailability and errors use the catalog's reader wording in every language (`src/inference/localize.ts`), never the server's own text.
- Composer: auto-growing textarea, Enter to send, Shift+Enter newline, send button (olive), disabled while thinking. Placeholder adapts: “Ask about Romans 8…”.
- Suggestions: 3–4 chips from `message.suggestions` / `study.suggestedQuestions`.
- New study mid-conversation → centred divider “New study · Psalm 23”.

## 7. Study workspace (spec §5)

**Header**: eyebrow (“Passage study · Pauline Letters” / “Topic study”), title (Cormorant 48px), subtitle (serif italic), meta row (traditional author · approximate date · genre · canon section — from curated context or book info), depth badge (**Curated study** / **Library study** with tooltip explaining), summary paragraph (synthesis).

**Section navigation**: sticky pill bar under the header (icons + labels): Overview? no — Scripture · (Key passages) · Cross-references · Original languages · Context · Literary · Theology · Commentary · Sources. Scroll-spy highlights the active pill; pills whose section was just updated by chat show a small gold dot until visited. On phone it scrolls horizontally.

**Focus banner**: when the engine sends `focus.reason`, a slim banner under the nav: gold left rule + small cross + reason text + “Clear focus”. Items updated by focus get a one-time gold pulse (`emmaus-pulse`) and an “Updated from your question” micro-label.

**Sections** — each is `<section id="section-{id}" aria-labelledby>` with a `StudySection` header: roman-numeral eyebrow (I, II, III…), display title, one-line description, optional toolbar (filters/toggles). Empty/unavailable sections either hide (if genuinely irrelevant) or show an honest arch empty state (“No curated commentary for this passage yet — here are public-domain commentaries instead”).

1. **Scripture** — translation label + ProvenanceTag(Scripture) + toggles: Reader | Interlinear. Verse numbers: small gold superscript numerals in sans (`font-variant-numeric: oldstyle-nums` not needed), not selectable. BSB section headings in small caps olive. Poetry (Psalms) rendered as indented lines. Key words: dotted terracotta underline (2px offset) + hover background; click/Enter → Inspector(word). Focused words: solid terracotta underline + `--color-word-highlight` background. Focused verses: `--color-highlight` band with gold left rule. Clicking a verse number opens a small verse menu: “Explain this verse” (sends chat), “Cross-references for this verse”, “Copy”. Interlinear mode: each verse shows the English line then a flowing row of original-language word “stacks” (original script / transliteration / gloss / Strong’s), each clickable → Inspector(word with strong). Multi-chapter passages show chapter headings; whole-book studies show one chapter at a time with a chapter stepper.
2. **Key passages** (topic studies) — grouped list; each item: reference (serif bold) + title + note (synthesis) + expandable BSB text + “Study this passage →”.
3. **Cross-references** — filter chips by relationship (All · Parallel · Quotation · Allusion · Prophecy/Fulfilment · Thematic · Same concept · Contrast · Historical) and by author (e.g. Paul, John, OT). Cards: target reference (serif 18px) + relationship Badge (icon + text) + “from v. N” + excerpt (BSB text fetched live, italic serif, clamp 3 lines) + **Why it’s connected** (explanation) + actions “Open passage →” (Inspector passage) / “Study this passage”. Below: collapsed **“More references (OpenBible.info)”** listing dataset references for the focused verse or passage, labelled Open dataset, with vote scores — explicitly “not explained”.
4. **Original languages** — intro line + caution (“Context determines meaning; a lexicon shows the range of possibilities.”). Key word cards (grid 2-up desktop, 1-up mobile): large original word (Greek 30px / Hebrew 32px), transliteration, pronunciation, Strong’s badge, English rendering, basic meaning, semantic range (chips), grammar, occurrences (count from the tagged text via LexiconProvider + notable list), **Why it matters here** (synthesis), caution. Expanded state shows the lexicon entry (TBESG/TBESH text) with its ProvenanceTag. Library studies: show the interlinear hint + most significant words by frequency? (simple: prompt the reader to click any word in Interlinear mode).
5. **Historical & cultural context** — items grouped by category (only those present), each as a Disclosure card with category eyebrow + icon, summary visible, detail on expand, source chips. For every study also offer **Book introduction** (Tyndale Open Study Notes via HistoricalContextProvider) as an expandable “Introduction to Romans” with its source line.
6. **Literary context** — “Where this sits”: horizontal **book outline bar** (segments proportional to chapters, current highlighted in terracotta, labels below; vertical list on phone), place in book / argument / place in canon paragraphs, passage outline, then feature cards (repetition, parallelism, chiasm, metaphor…). **Chiasm diagram**: indented ladder (A, B, C, B′, A′) with connecting hairlines, centre highlighted.
7. **Theology** — theme cards (category eyebrow, title, summary, key verses chips, expandable detail). Then **Perspectives** (`PerspectiveCard` per set): the question, a consensus badge (Broad Christian consensus · Denominational difference · Historical debate · Interpretive uncertainty — each with icon + short explanation), intro, then tabs or stacked panels for each tradition (tradition name, label, summary, representative voices as author chips, key texts), then “Common ground”. Make it even-handed: equal visual weight per tradition.
8. **Commentary & Christian thinkers** — filter by era (Early church · Medieval · Reformation · Post-Reformation · Modern · Contemporary) and by author. Entry cards: author monogram (initials in an arch shape, no photos), name, lifespan, tradition; lead line; then quotation (serif italic in quotes) or summary (sans, “Summary of *Work*”); work title + year + locator; “Read source →”. Below: **Classic commentaries** panel — tabs for Tyndale Study Notes (default) / Calvin / Matthew Henry / Jamieson-Fausset-Brown (and Keil & Delitzsch for OT), verse-scoped to the focused verse or the passage start, text from CommentaryProvider with its license line. **Sermons** list (title, preacher, date, link) when available.
9. **Sources** — bibliography grouped by type (Scripture & original text · Lexicons & datasets · Commentaries · Books · Sermons & articles · Creeds & confessions), each `SourceCard`: title, author(s), year, publisher/edition, license badge (Public domain / Open license / Copyrighted — summaries only), usage note, link. Plus the **provenance legend** explaining every content kind and the principle: *claim → source → author → work → location → link*.

## 8. Inspector (side sheet / bottom sheet)

Opens over the study (desktop: right sheet 440px with subtle scrim; phone: bottom sheet 88vh with drag handle). Focus is trapped while open; Esc closes; focus returns to the trigger. Types:
- **Word**: curated key word (full card) or lexicon entry for any Strong’s number (from interlinear) — lemma, transliteration, gloss, definition, occurrences (first 20 refs as chips + total), verse-in-context line; actions: “Ask about this word” (sends chat).
- **Passage**: reference title, BSB text (translation follows settings), “Study this passage”, “Ask how this connects”.
- **Source**: full metadata, license, usage policy explanation, link, and list of places it is cited in the current study.
- **Author**: monogram, lifespan, tradition, description, entries in this study, link.

**Companion mode.** When the *engine* opens the Inspector as part of a reply (e.g. an uncurated word's lexicon entry, or a passage named in a “connect” question), it opens as a non-modal companion so the conversation stays usable; when the *reader* opens it, it is a modal dialog with a focus trap.

## 9. Motion

Subtle and purposeful: 140–420ms, `--ease-out`. Fade-up for new messages/cards; gold pulse for items updated by the conversation; smooth scroll to focused section (instant under reduced motion). No bouncing, no parallax.

## 10. Accessibility (spec §23)

Touch targets on phones use the global `.touch-target` utility (≥ 44px). Landmarks (`header`, `main`, `nav`, `aside` for chat, `complementary` for inspector), a skip link (“Skip to study”), headings in order, every icon button labelled, `aria-pressed` on toggle chips, `aria-expanded` on disclosures, `aria-current` on active nav pill, `role="dialog"` + `aria-modal` + focus trap for inspector/palette, `aria-live` for chat and study updates, key words are `<button>`s inside the text, visible focus rings (gold), contrast AA, meaning never by colour alone, reader text scale control, respects reduced motion, `lang` attributes on original-language text.
