# Eval harness: live inference cost vs. quality

Measures a change to the live inference (prompt, tools, budgets) against a baseline on a frozen
case set, so one approved paid run can decide to keep it or revert it. Everything except
`run.ts` without `--dry-run` is free and offline.

| File | What it does |
|---|---|
| `cases.json` | The frozen set (E1): 16 compose cases and 4 follow-up answers, with the locale, translation and hint the UI sends. Never edit a case in place; add a new id instead. |
| `fixtures/` | The pages the answer cases open (copied from `.kb-cache/pages`), so the set stays frozen. |
| `run.ts` | **Paid** runner (E5). One configuration, cases one at a time, results in `.kb-cache/eval/<label>/`. |
| `score.ts` | Free scorer (E2) and keep/revert rule (E7), for one or two result directories. |
| `baseline-worktree.sh` | Creates a worktree of `main` for the baseline run. |
| `compare-html.ts` | Blind side-by-side review page (E6), plus unblinding of the exported scores. |
| `../../server/inference/__tests__/zz-replay.test.ts` | Replays logs under the current validator (E3). Opt-in with `REPLAY_LOGS`. |

## Guards

- A real run needs **both** `EMMAUS_EVAL_RUN=1` and `--max-usd <dollars>`. Before each case, the
  runner stops if the spend so far plus that case's estimate would pass the cap. The estimate is the
  costliest run of that flow seen so far, and never less than the costliest logged Opus 5 high run
  ($1.41 per compose, $0.38 per answer).
- Every run regenerates. The page cache is never read or written (`cache: null`, and a temporary
  `cacheDir`).
- Spend is priced from each RunLog's `usage` with the table in `lib.ts` (Opus 5: $5 input, $25
  output, $0.50 cache read, $6.25 cache write per million tokens). A model with no entry there is
  refused, because its spend could not be capped. Every attempt that fails (re-issued after a
  transient error or unparseable tool input, or ending the run, even after finish_page ran early) is
  logged as a failed turn with the usage it had streamed (message_start and the last message_delta),
  so its spend counts; the output it streamed before failing is not reported, so the cost of a failed
  attempt is a lower bound. The scorer counts failed attempts apart from turns, and leaves decisions
  on calls withdrawn after a declined response out of the accepted, rejected and re-sent counts.
- The model, effort and budgets come from the environment and this checkout's `.env` /
  `.env.local`, the same way the dev server reads them (`EMMAUS_MODEL`, `EMMAUS_EFFORT`,
  `EMMAUS_MAX_RESEARCH_CALLS`, …). Defaults: `claude-opus-5`, effort `high`. The baseline and
  the candidate run must use the same environment. The manifest records what ran.
- Do not use `EMMAUS_LIVE` for evals. That switch belongs to the app and to `zz-live.test.ts`.

## Free checks

```sh
npm run eval:test                                                 # harness tests (dry runs, scorer on the local logs)
npm run eval:score -- .kb-cache/logs --since 2026-09-30T10:00:00Z # the logged baseline: 14 composes, accepted 42.5, rejected 4.1, re-sent 2.3, $1.098
npm run eval:run -- --dry-run --label dry --max-usd 5              # scripted model, real knowledge base, no network
```

## A paid comparison

Run the baseline (A) from a worktree of `main`, so that `main`'s server code runs under this
branch's harness. Then run the candidate from this branch. Run both at the same effort and with
the same environment.

```sh
scripts/eval/baseline-worktree.sh                     # ../bible-app-eval-base; prints the exact commands
EMMAUS_EVAL_RUN=1 npm run eval:run -- --label base --root ../bible-app-eval-base --max-usd 25
EMMAUS_EVAL_RUN=1 npm run eval:run -- --label cand --max-usd 25

# E3: replay the candidate's logs under this branch's validator
REPLAY_LOGS=.kb-cache/eval/cand REPLAY_OUT=.kb-cache/eval/cand-replay.json npx vitest run server/inference/__tests__/zz-replay.test.ts

npm run eval:score -- base cand --replay .kb-cache/eval/cand-replay.json

# E6: blind review (open review.html, score, export, then unblind)
node scripts/eval/compare-html.ts base cand
node scripts/eval/compare-html.ts --unblind ~/Downloads/review-scores.json --key .kb-cache/eval/review-base-vs-cand-t1-s1/review-key.json
```

Other options:

- `--trials 2` repeats the set. Use it for close calls: cost varies by about 14% between runs, and
  the same query can vary on its own (Genesis 1 gave 59 and then 45 accepted items).
- `--cases a,b` runs a subset.
- `--resume` continues an interrupted label.
- Ctrl-C aborts the current run and records it.

Each label directory holds `manifest.json` and one `t<trial>/<case>.log.json` (the RunLog, plus an
`eval` stamp) and `<case>.page.json` (the emitted page or answer) per run. The manifest records:

- the git SHA and a hash of the working-tree diff, for this checkout and for `--root`
  (RunLog's `versions.generator` goes stale inside a dev session);
- the model, effort, budgets and rates;
- the case-set hash;
- the spend, and why the run stopped.

## Cost

- Baseline, Opus 5 at effort `high`: about **$18.4 per trial** (16 × $1.10 + 4 × $0.21).
- Candidate: expected to cost less. Its estimate is whatever the round-1 levers save.
- One trial each of A and the candidate: under $37. Two trials each: under $74.
- `--max-usd 25` per trial leaves room for the conservative per-case estimate.

## Keep or revert (E7)

Runs are paired by case against the baseline. The candidate is kept only if all of these hold:

- completion is 100%: no deadline, max_turns or error;
- every completed page has the expected sections for its kind;
- accepted items are at least 90% of the baseline, per compose case;
- memory-recall rejections (names, dates, quotes, unread or lexical, claim words) are at most 1.5×
  the baseline per page. The baseline is 2.6 per page;
- tradition-tagged sources cited are at least the baseline minus 1, and distinct sources at least
  80% of the baseline, per compose case;
- E3 replay keeps at least 95% of items;
- the copyrighted-author case (`a-keller`) declines, with no quotation marks;
- the E6 blind review finds no veto, and the preference on faithfulness and balance is no worse
  than 40/60.

`score.ts` checks every rule except E6 and prints `KEEP`, `REVERT` or `INCOMPLETE` (a measurement
is missing). If the verdict is `KEEP`, compare cost per completed page, with failed runs'
spend included. Apply one lever per diff: free wins first, then effort and research budget, then
model. The thresholds come from one logged run per case, so recalibrate them after the first fresh
baseline.

## Notes

- The fixture pages quote Tyndale Open Study Notes (CC BY-SA) and STEPBible TBESH lexicon
  entries. TBESH cannot be redistributed without permission, so leave `scripts/eval/fixtures/`
  out of the public edition.
- `score.ts` counts rejection kinds from the validator's reason text as it read on 2026-09-30
  (`lib.ts` `rejectionKind`). If a reason's wording changes, update the patterns.
