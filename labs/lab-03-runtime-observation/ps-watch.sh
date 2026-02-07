#!/usr/bin/env bash
set -euo pipefail

OUT="ps-watch.log"
rm -f "$OUT"

while true; do
  echo "### $(date -u +%s)"
  ps -eo pid,ppid,user,cmd --no-headers
  sleep 2
done >> "$OUT"