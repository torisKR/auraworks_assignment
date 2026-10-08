#!/usr/bin/env bash
set -euo pipefail

# Reconnect the original checkout without deleting any local files.
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

expected_remote="https://github.com/torisKR/auraworks_assignment.git"
if [[ "$(git remote get-url origin)" != "$expected_remote" ]]; then
  printf 'Unexpected origin. No files were changed.\n' >&2
  exit 1
fi
if ! git diff --cached --quiet; then
  printf 'Commit or unstage existing staged changes before running this script.\n' >&2
  exit 1
fi

git fetch origin main
mkdir -p "$project_dir/artifacts"
history_ref="origin/main"
feature_bundle="$project_dir/artifacts/submission/site-features.bundle"
if ! git rev-parse --verify HEAD >/dev/null 2>&1 && [[ -f "$feature_bundle" ]]; then
  git fetch "$feature_bundle" main:refs/remotes/submission/main
  if git merge-base --is-ancestor origin/main refs/remotes/submission/main; then
    history_ref="refs/remotes/submission/main"
  fi
fi
backup_dir="$(mktemp -d "$project_dir/artifacts/checkout-backup.XXXXXX")"
manifest="$backup_dir/source-files.txt"
git ls-tree -r --name-only "$history_ref" > "$manifest"
while IFS= read -r source_file; do
  if [[ ! -f "$source_file" ]]; then
    printf 'Missing local source file: %s. Stopping to preserve your work.\n' "$source_file" >&2
    exit 1
  fi
  mkdir -p "$backup_dir/files/$(dirname "$source_file")"
  cp -p "$source_file" "$backup_dir/files/$source_file"
done < "$manifest"

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  # --mixed writes Git history/index only; all working-tree files remain intact.
  git reset --mixed "$history_ref"
fi
git pull --ff-only origin main

# Stage explicit project scopes; keep secrets, assets, dependencies and artifacts ignored.
git add -- README.md docs
git diff --cached --check
if ! git diff --cached --quiet; then
  git commit -m "docs: document feature expansion and page walkthroughs"
fi

git add -- src package.json
git diff --cached --check
if ! git diff --cached --quiet; then
  git commit -m "feat(site): add carousel linked pages and throttled catalog search"
fi

while IFS= read -r source_file; do
  git add -- "$source_file"
done < "$manifest"
git add -- scripts/sync-checkout.sh
git diff --cached --check
if ! git diff --cached --quiet; then
  git commit -m "chore(repo): synchronize local checkout with published history"
fi
git push -u origin main
printf '\nSource backup: %s\n' "$backup_dir"
git status --short --branch
