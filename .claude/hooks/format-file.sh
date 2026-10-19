#!/usr/bin/env bash
# PostToolUse (Edit|Write): format the edited file with the project's Prettier.
# Only code/style files are formatted; Markdown (e.g. AGENTS.md) and GLSL are left as written.

f=$(jq -r '.tool_response.filePath // .tool_input.file_path // empty')

case "$f" in
  *.ts | *.tsx | *.js | *.jsx | *.css | *.json) ;;
  *) exit 0 ;;
esac

cd "$CLAUDE_PROJECT_DIR" || exit 0
[ -f "$f" ] && ./node_modules/.bin/prettier --write --log-level warn "$f"
exit 0
