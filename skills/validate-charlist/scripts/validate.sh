#!/usr/bin/env bash
set -euo pipefail

TMP_OUT="$(mktemp)"
trap 'rm -f "$TMP_OUT"' EXIT

echo "[validate] Running production build..."
npm run build 2>&1 | tee "$TMP_OUT"

echo
if rg -n "deprecated|a11y|warning" "$TMP_OUT" >/dev/null 2>&1; then
  echo "[validate] Warnings detected in build output."
  echo "[validate] Review the log above and report findings in validator output."
  exit 2
fi

echo "[validate] Build completed with no warning patterns detected."
