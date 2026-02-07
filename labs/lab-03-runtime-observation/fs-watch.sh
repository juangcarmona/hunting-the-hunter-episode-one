#!/usr/bin/env bash
set -euo pipefail

HOME_DIR="${HOME:?HOME not set}"
LOGFILE="$HOME_DIR/fs-watch.log"

# Remove previous log to avoid noise
rm -f "$LOGFILE"

# Watch HOME but exclude the log file itself
inotifywait -m -r \
  --exclude "$(basename "$LOGFILE")$" \
  -e create \
  -e move \
  -e delete \
  -e close_write \
  --format '%T %e %w%f' \
  --timefmt '%s' \
  "$HOME_DIR" \
  > "$LOGFILE"
