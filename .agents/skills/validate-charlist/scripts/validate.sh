#!/usr/bin/env bash
set -euo pipefail

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

HAS_FAILURE=0
HAS_WARNING=0

run_check() {
  local name="$1"
  shift
  local out_file="$TMP_DIR/${name}.log"

  echo "[validate] Running ${name}..."
  if "$@" 2>&1 | tee "$out_file"; then
    echo "[validate] ${name}: PASS"
  else
    echo "[validate] ${name}: FAIL"
    HAS_FAILURE=1
  fi
  echo
}

run_check "lint" npm run lint
run_check "typecheck" npm run typecheck
run_check "build" npm run build
run_check "test:e2e" npm run test:e2e
run_check "test:visual" npm run test:visual

BUILD_LOG="$TMP_DIR/build.log"
if [[ -f "$BUILD_LOG" ]] && rg -n "deprecated|a11y|warning" "$BUILD_LOG" >/dev/null 2>&1; then
  echo "[validate] Warnings detected in build output."
  HAS_WARNING=1
fi

VISUAL_LOG="$TMP_DIR/test:visual.log"
if [[ -f "$VISUAL_LOG" ]] && rg -n "snapshot|pixel|diff|visual" "$VISUAL_LOG" >/dev/null 2>&1; then
  echo "[validate] Visual-check output detected. Use artifacts (Playwright report/screenshots) as regression evidence."
fi

if [[ "$HAS_FAILURE" -ne 0 ]]; then
  echo "[validate] One or more checks failed."
  echo "[validate] Note: failure triage should rely on artifact evidence; committed snapshot baselines are not required by workflow policy."
  exit 1
fi

if [[ "$HAS_WARNING" -ne 0 ]]; then
  echo "[validate] Checks passed but warnings were detected."
  exit 2
fi

echo "[validate] All checks passed with no warning patterns detected."
