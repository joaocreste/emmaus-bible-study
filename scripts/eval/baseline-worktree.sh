#!/usr/bin/env bash
# Baseline checkout for the paid eval (scripts/eval/README.md): a detached worktree of main
# (or another ref) next to this repository, sharing its installed packages and local data, so
# scripts/eval/run.ts --root <worktree> runs main's server code under this branch's harness.
#
#   scripts/eval/baseline-worktree.sh [dest] [ref]      (default: ../bible-app-eval-base main)
#
# Links (never copies) node_modules, the STEPBible data public/data/{original,lexicon,concordance}
# (not in git) and the .kb-cache data (index, commentary and download caches). The page cache
# (.kb-cache/pages), the run logs (.kb-cache/logs) and eval results (.kb-cache/eval) are not
# linked: the worktree's .kb-cache is its own directory, so the baseline can rebuild its search
# index there without touching this repository's.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="$(git -C "$here" rev-parse --show-toplevel)"
dest="${1:-$repo/../bible-app-eval-base}"
ref="${2:-main}"

if [ -e "$dest" ]; then
  echo "$dest already exists. Remove it first (git -C \"$repo\" worktree remove --force \"$dest\") or pass another path." >&2
  exit 1
fi

git -C "$repo" worktree add --detach "$dest" "$ref"
dest="$(cd "$dest" && pwd)"

link() {
  local rel="$1"
  if [ ! -e "$repo/$rel" ]; then
    echo "  (skipped $rel: not present in $repo)"
    return
  fi
  if [ -e "$dest/$rel" ]; then
    echo "  (skipped $rel: the worktree has its own)"
    return
  fi
  mkdir -p "$(dirname "$dest/$rel")"
  ln -s "$repo/$rel" "$dest/$rel"
  echo "  linked $rel"
}

echo "Linking shared data into $dest:"
link node_modules
for d in public/data/original public/data/lexicon public/data/concordance; do link "$d"; done
mkdir -p "$dest/.kb-cache"
if [ -d "$repo/.kb-cache" ]; then
  for entry in "$repo"/.kb-cache/*; do
    [ -e "$entry" ] || continue
    name="$(basename "$entry")"
    case "$name" in
      pages | logs | eval) continue ;;
    esac
    link ".kb-cache/$name"
  done
fi

sha="$(git -C "$dest" rev-parse --short HEAD)"
cat <<EOF

Baseline worktree ready: $dest ($ref at $sha).

Run the baseline (bills the Claude API: about \$18.4 per trial at Opus 5 high; keep --max-usd):
  cd "$repo" && EMMAUS_EVAL_RUN=1 node scripts/eval/run.ts --label base-$sha --root "$dest" --max-usd 25

Then the candidate (this branch), and compare:
  cd "$repo" && EMMAUS_EVAL_RUN=1 node scripts/eval/run.ts --label cand-\$(git rev-parse --short HEAD) --max-usd 25
  node scripts/eval/score.ts base-$sha cand-<sha>

Remove the worktree afterwards (the links go, their targets stay):
  git -C "$repo" worktree remove --force "$dest"
EOF
