#!/usr/bin/env bash
# Stop: when TS/JS files changed (vs HEAD, or untracked), run the type check and ESLint.
# On failure, exit 2 so the errors are sent back to Claude to fix before finishing.

input=$(cat)

# Already continuing because of this hook: don't block again (avoids endless loops).
[ "$(echo "$input" | jq -r '.stop_hook_active')" = "true" ] && exit 0

cd "$CLAUDE_PROJECT_DIR" || exit 0

changed=$(
  {
    git diff --name-only HEAD
    git ls-files --others --exclude-standard
  } | grep -E '\.(ts|tsx|js|jsx)$'
)
[ -z "$changed" ] && exit 0

out=$(./node_modules/.bin/tsc -b 2>&1)
tsc_status=$?
lint=$(./node_modules/.bin/eslint . 2>&1)
lint_status=$?

if [ $tsc_status -ne 0 ] || [ $lint_status -ne 0 ]; then
  {
    echo "Code checks failed, fix them before finishing."
    [ $tsc_status -ne 0 ] && printf '\n## tsc -b\n%s\n' "$out"
    [ $lint_status -ne 0 ] && printf '\n## eslint .\n%s\n' "$lint"
  } >&2
  exit 2
fi
exit 0
