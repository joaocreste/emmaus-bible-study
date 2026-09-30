# Emmaus data pipeline

`npm run data:build` downloads openly licensed datasets, cleans them, and writes compact JSON
under `public/data/` (≈ 100 MB, 858 files). The app's local providers (`src/providers/local/`)
fetch these files lazily per book or per shard, so nothing from `public/data` is part of the JS bundle.

```bash
npm run data:build                               # all steps
npm run data:build -- --only=xrefs,tyndale       # selected steps (manifest.json is merged)
npm run data:build -- --only=scripture --versions=LSG,NCL   # selected Bible versions only
npm run data:build -- --offline                  # rebuild from the download cache only
npm run data:build -- --xrefs-per-verse=10 --concurrency=4 --retries=5
```

Requirements: Node ≥ 22.18 (native TypeScript type-stripping and global `fetch`; developed on Node 25).
No npm dependencies. `build-all.ts` registers a small resolve hook (`lib/resolve-ts.ts`) and then
loads `pipeline.ts`, because the app modules it reuses (`src/domain/*.ts`) import each other without
file extensions. Downloads are cached in `.data-cache/` (git-ignored; ≈ 220 MB), so a
second run takes seconds. Delete the cache to pick up upstream changes.

## Steps and sources

| Step | Source | License | Output |
|---|---|---|---|
| `scripture` | Free Use Bible API complete files of the 13 versions in `src/domain/translations.ts` (`apiId`): English [BSB](https://bible.helloao.org/api/BSB/complete.json), [KJV](https://bible.helloao.org/api/eng_kjv/complete.json), [WEB](https://bible.helloao.org/api/ENGWEBP/complete.json); Portuguese `por_blj` (BLIVRE), `por_onbv` (NBV), `por_bsl` (BPM); Spanish `spa_r09` (RVR1909), `spa_blm` (BLM), `spa_vbl` (VBL); French `fra_lsg` (LSG), `fra_jnd` (DARBY), `fra_ncl` (NCL), `fra_ost` (OST). Versification: Copenhagen Alliance / Paratext standard mappings [`eng.json`, `org.json`](https://github.com/Copenhagen-Alliance/versification-specification) (data CC BY-SA 4.0; used at build time only) | Public domain: BSB, KJV (outside the UK), WEB, BPM, RVR1909, BLM, LSG, DARBY, OST. CC BY 4.0: BLIVRE. CC BY-SA 4.0: NBV, VBL, NCL (as stated on each version's eBible.org page; attributions in the manifest) | `bible/{id lowercased}/{BOOK}.json` |
| `stepbible` | [STEPBible-Data](https://github.com/STEPBible/STEPBible-Data): TAGNT (2 files), TAHOT (4 files), TBESG, TBESH | CC BY 4.0 — “Data created by STEPBible.org based on work at Tyndale House Cambridge” | `original/{BOOK}.json`, `lexicon/{G,H}/{shard}.json`, `concordance/{G,H}/{shard}.json` |
| `xrefs` | [OpenBible.info](https://www.openbible.info/labs/cross-references/) via `bible.helloao.org/api/d/open-cross-ref/{BOOK}/{chapter}.json` (1,189 requests) | CC BY 4.0 | `xrefs/{BOOK}.json` |
| `tyndale` | [Tyndale Open Study Notes](https://tyndaleopenresources.com/) XML release (`tyndale_open-studynotes.zip`) | CC BY-SA 4.0, © Tyndale House Publishers | `commentary/tyndale/{BOOK}.json`, `intros/{BOOK}.json` |
| `commentaries` | Free Use Bible API `api/c/{john-calvin,matthew-henry,jamieson-fausset-brown,keil-delitzsch}/{BOOK}/{chapter}.json` | Public domain | `commentary/{calvin,matthew-henry,jfb,keil-delitzsch}/{BOOK}.json` |
| manifest | all of the above | — | `manifest.json` |

`manifest.json` records every dataset with its URLs, license, attribution, the SHA-256 published by
the API (`apiSha256`), the git blob SHA from GitHub (`gitSha`), a locally computed SHA-256 of each
downloaded source (`sourceSha256`), counts, output sizes, the generation date, which classic
commentary books are bundled (`bundledCommentaryBooks`) and which books each commentary covers at
all (`remoteCommentary.availableBooks`, used by the live fallback).

Classic commentaries are bundled whole for **GEN, JOB, PSA, ISA, MAT, LUK, JHN, ROM, 2CO, EPH, TIT, 1PE**
(Keil & Delitzsch: the OT ones). Other books are fetched live by the CommentaryProvider from the same
API and cleaned by the same functions (see below) unless `allowRemoteFallback: false`.

## Formats

All file shapes are TypeScript types in [`src/providers/local/formats.ts`](../../src/providers/local/formats.ts)
(tuples and short keys to keep files small). Highlights:

- **Scripture** — per book: chapters → verses `[n, text, { h?, p?, l?, f? }]`: section heading(s)
  attached to the following verse (`h`, several joined with “ — ”), paragraph/stanza start (`p`),
  poetry lines with indent level (`l`, prose parts of mixed verses at indent 0), footnotes (`f`).
  Psalm superscriptions are chapter-level (`sup`). KJV pilcrows (¶) become paragraph starts.
- **Original text** — per book: chapter → verse → words
  `[surface, transliteration, extendedStrong, morph, gloss, "A"?]` (`"A"` = Aramaic).
- **Lexicon** — shards of 100 Strong's numbers keyed by the classic number (`"H7462"`), each holding
  all STEPBible senses (`H7462A`, `H7462B`, …) sorted by frequency in the tagged text.
- **Concordance** — same shards: verse points (`bookOrder·10⁶ + chapter·10³ + verse`), word totals,
  per-verse counts when > 1, and per-sense lists when a number has several senses.
- **Cross references** — chapter → verse → `[refKey, votes][]`, best first (`refKey` as in
  `src/domain/reference.ts`, e.g. `JHN.3.18-19`).
- **Commentary** — `[startChapter, startVerse, endChapter, endVerse, text]` sections sorted by start;
  paragraphs separated by `\n\n`.
- **Intros** — `{ book, title, text, summary }` (headings such as “Setting” are their own paragraph).

### Strong's numbers

One rule, `normalizeStrong()` in [`src/providers/local/strong.ts`](../../src/providers/local/strong.ts),
is used by the pipeline and the providers: classic number without leading zeros (`G2631`, `H430`),
STEPBible's disambiguation letter kept separately (`H430G` = extended). Lexicon and concordance files are
keyed by the classic number; words and lexicon entries carry the extended tag too.

## Processing decisions

- **BSB validation**: 66 books, chapter counts equal `src/domain/books.ts`, 31,086 verses (the API
  metadata); KJV and WEB must match their API verse totals (31,102 / 31,103). Every book id must exist in `books.ts`.
- **Other languages — one versification.** Every version is stored with English (KJV/BSB) chapter and
  verse numbers, so `ROM.8.1` means the same words in every language (curated studies, anchors, cross
  references and commentaries are keyed that way). `lib/versification.ts` re-numbers each book in stages,
  and the build fails if any verse number is left outside the KJV list or a chapter count differs from `books.ts`:
  0. *Placeholders*: empty source verses (the Reina-Valera 1909 keeps the English count but prints
     some verses under Hebrew/Vulgate numbers, leaving the English number empty) are set aside.
  1. *Standard mapping* (Paratext eng↔org): a mapping group (a psalm title, or a chapter-boundary
     difference such as Joel 2:28–3:21 = Hebrew 3:1–4:21, Malachi 4 = Hebrew 3:19–24, Exodus 8:1–4 =
     7:26–29) is applied when the version's verse counts in those chapters equal the Hebrew ones
     (psalm-title groups only for versions that number titles in most psalms: LSG, Darby, néo-Crampon).
     Psalm titles counted as verse 1 (or 1–2) become the chapter superscription. A tiny table of
     *overrides* in `steps/scripture.ts` covers arrangements that cannot be inferred, each verified by
     reading (Reina-Valera 1909 Job 39:30 holds English 39:27–30 and 40:1–5).
  2. *New Testament rules*: Nestle-Aland numbering of 2 Cor 13:12–13, Rev 12:18 (→ start of 13:1),
     3 John 15 (→ end of 14); the Majority-text doxology after Rom 14:23 (→ 16:25–27).
     *Neighbouring duplicates*: a verse bridge printed under both numbers (Ostervald Acts 19:40–41) is
     kept once; a verse repeated at a chapter end and the next chapter's start (néo-Crampon Mark 8:39 = 9:1) is dropped.
  3. *Chapter boundaries*: a chapter's last verse(s) printed at the start of the next chapter (Reina-Valera
     1 Sam 23:29, Jonah 1:17, Hosea 11:12, Num 12:16, 29:40), and runs of up to four chapters whose verse
     total equals the English total (Segond's Job 38–41, Eccl 11–12) — each accepted only when it fits
     the English verse lengths better.
  4. *Alignment by wording and verse length* (Gale–Church style dynamic programming) for chapters whose
     numbers still differ from the English ones: split or merged verses (néo-Crampon Deut 5:17 = English
     5:17–20), psalm titles numbered outside the standard list, verses a source lacks. Lengths are compared
     with the KJV. Each language has a *reference version* whose numbering is closest to the English one —
     BPM (pt) and BLM (es), both translations of the World English Bible, and LSG (fr); it is built first, and
     word overlap with it guides the other versions' alignment and also reveals hidden offsets (a split and
     a merge that cancel out: Reina-Valera 1 Chr 21:15–30, 1 Kgs 22:43–53, which follow the Hebrew numbering).
  English verses without their own text are recorded per chapter (`x`: verse → host verse when its words
  are printed inside a neighbouring verse, 0 when the version lacks it); every step is listed per version
  in `manifest.json` (`datasets[].versification`: `omitted`, `repairs`, `dropped`, `combined`, `absent`, `residual`).
- **Canon**: the app's canon is the 66 books of `books.ts`. Deuterocanonical books (BLM, NCL) are left out,
  as are the Greek additions the néo-Crampon prints inside Daniel (3:24–90, chapters 13–14) and Esther
  (10:4–16:24); Daniel 3:91–100 become 3:24–33 before the standard mapping (listed under `omitted`).
- **Paragraph markers**: KJV pilcrows (¶) and the asterisks with which Darby marks new sections become
  paragraph starts. The wording of every version is otherwise unchanged (the CC BY-SA versions are only
  re-numbered; the manifest says so).
- **Greek text (TAGNT)**: words whose type contains `N/n` (the Nestle-Aland text translated by the BSB).
  The 40 verses with no NA words (e.g. Matt 17:21) keep the Textus Receptus words.
  Surface forms keep accents and punctuation; paragraph marks (¶) removed.
- **Hebrew text (TAHOT)**: Leningrad text with Qere readings (as translators follow), including restored
  (R) and LXX-based (X) words; empty Qere placeholders skipped. Morpheme separators removed; cantillation
  U+0591–U+05AF, meteg U+05BD and paseq U+05C0 stripped; vowel points, maqaf U+05BE, sof pasuq U+05C3 kept.
  Aramaic words are flagged from the grammar code prefix `A`.
- **Versification**: English/KJV numbering so keys match the BSB (TAGNT's `[KJV]` alternates, TAHOT's
  primary English reference). Psalm titles that the Hebrew counts as verse 1 are stored as verse 0.
- **Unicode**: all text NFC-normalised (TBESG uses Greek-extended “oxia” code points; NFC maps them to the
  standard accented letters so strings typed elsewhere match).
- **Lexicon markup** → plain text: `<ref>` tags rewritten from their attribute (`Rom 5:16, 18; 8:1`),
  `<br>`/`__1.` → line breaks, tags stripped, trailing source markers `(AS)`/`(ML)` removed.
- **Cross references**: top 15 per verse by votes, positive scores only (≈ 279k of 345k).
- **Tyndale**: built from the publisher XML because the API copy files Judges under `JUD` (overwriting Jude)
  and lacks the Judges introduction. The leading reference label is dropped (the range is structured),
  “•” sub-notes become paragraphs, small-caps divine names are upper-cased (“LORD”). A cross-check compares
  ~200 notes in 10 chapters with the API copy (all identical, recorded in the manifest).
- **Classic commentaries** — cleaners in [`src/providers/local/cleaners.ts`](../../src/providers/local/cleaners.ts)
  (shared with the runtime fallback; imported by the pipeline through Node type-stripping):
  - *Calvin*: drops the section heading (“Romans 8:1-4”), the English + Latin verse block (including
    harmony sections with one block per gospel and Psalms' single translation paragraph), translator footnotes
    and `[237]` markers; repairs encoding damage (`vit?` → `vitæ`, `Rosenm?ller` → `Rosenmüller`, lost
    aleph/ayin marks → `’`); Greek quotations that survive only as SPIonic font codes are replaced by
    `[Greek]`; the Latin subscription of some epistles is dropped. Headings give the exact section range.
  - *Henry / JFB / K&D*: mojibake repaired (`IRENÃ†US` → `IRENÆUS`), entities decoded, `--` → `—`,
    API reference style `Kg2 21:16` → `2Kg 21:16`, web navigation lines removed. The chapter-level
    `introduction` field is kept: Henry's chapter summary covers the whole chapter; JFB's (pericope heading +
    verse-1 notes) and K&D's (pericope introduction) run up to the first verse note.
  - Sections run from their start verse to the verse before the next section (or the chapter's last BSB verse).
  - A defect scan (`findTextDefects`) runs on every section; the current build reports none.

## Known gaps

- **Versification judgements** are recorded, not hidden, and a few single-verse decisions remain imperfect:
  Isaiah 64:1 is the end of 63:19 in the French versions (Hebrew numbering) and is listed as absent there, as
  are Reina-Valera Job 40:1–5 (inside 39:30); the Segond's Mark 9:43–46 split follows the source; where a
  version merges two verses, which neighbour holds the merged words is sometimes decided the other way round
  (Reina-Valera Num 30:9–10; the Nova Bíblia Viva paraphrase, 1 Sam 20:31–33); the néo-Crampon's Joshua 21:36–37
  (missing from its Hebrew base) are marked as printed inside 21:35, and its Hosea 6:1–3 and Revelation
  20:7–9 split verses differently for two or three verses. A same-language diagnostic (word overlap of every
  verse with the reference version at its own and neighbouring numbers) finds no other runs of offset verses;
  the remaining isolated differences are genuine verse-order differences of the sources (e.g. the Vulgate
  order of Matt 5:4–5 in the néo-Crampon, the Textus Receptus order of Phil 1:16–17 in the Ostervald).
- The Bíblia Portuguesa Mundial is published as a draft; a few untranslated English words remain in the source
  (e.g. 2 Cor 4:6 “seeing”).
- Calvin wrote no commentary on Job; Matthew Henry's Matthew 19–28, JFB Psalm 146 and K&D Job 25,
  Psalms 101, 117, 131, 133 are absent from the source API (listed in the manifest).
- A few Calvin passages keep Hebrew written in an ASCII transliteration font (e.g. `lvl'`), as in the source.
- **TBESH definitions** are based on the Abridged BDB by Online Bible (© Larry Pierce); the TBESH header calls
  them “for guidance only” and asks projects to seek permission from Online Bible before applying them.
  Review this before any production release (TBESG definitions come from public-domain Abbott-Smith).

## Tests

`npx vitest run src/providers/local` — unit tests for `normalizeStrong`, the morphology decoder and the cleaners,
plus provider tests that read the generated files through a Node fs loader.
