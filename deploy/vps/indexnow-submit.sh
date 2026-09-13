#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

exec docker run --rm \
  -v "$ROOT_DIR:/app" \
  -w /app \
  node:24-alpine \
  node scripts/submit-indexnow.mjs "$@"
