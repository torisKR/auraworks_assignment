#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bundle_path="${1:-$project_root/artifacts/submission/auraworks_assignment.bundle}"
remote_url="https://github.com/torisKR/auraworks_assignment.git"

if [[ ! -f "$bundle_path" ]]; then
  echo "Submission bundle not found: $bundle_path" >&2
  exit 1
fi

checkout_root="$(mktemp -d "${TMPDIR:-/tmp}/auraworks-publish.XXXXXX")"
git clone --branch main "$bundle_path" "$checkout_root/repository"
cd "$checkout_root/repository"
git remote set-url origin "$remote_url"
git fetch origin

if git show-ref --verify --quiet refs/remotes/origin/main; then
  if ! git merge-base --is-ancestor origin/main HEAD; then
    # Preserve the repository's original description before merging histories.
    if git cat-file -e origin/main:README.md 2>/dev/null; then
      mkdir -p docs
      git show origin/main:README.md > docs/repository-bootstrap-readme.md
      git add docs/repository-bootstrap-readme.md
      if ! git diff --cached --quiet; then
        git commit -m "docs: preserve initial GitHub repository readme"
      fi
    fi

    if ! git merge origin/main --allow-unrelated-histories --no-commit; then
      conflicts="$(git diff --name-only --diff-filter=U)"
      if [[ "$conflicts" != "README.md" ]]; then
        echo "Unexpected merge conflicts. Resolve them in: $checkout_root/repository" >&2
        exit 1
      fi
      git checkout --ours -- README.md
      git add README.md
    fi

    if [[ -f .git/MERGE_HEAD ]]; then
      git commit -m "chore: merge initial GitHub repository history"
    fi
  fi
fi

git push --set-upstream origin main
echo "Published to https://github.com/torisKR/auraworks_assignment"
echo "Working checkout: $checkout_root/repository"
