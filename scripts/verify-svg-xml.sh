#!/usr/bin/env bash

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
svg_files="$(find "$root/assets" -type f -name '*.svg' -print | sort)"

if [[ -z "$svg_files" ]]; then
  echo "No SVG assets found." >&2
  exit 1
fi

while IFS= read -r svg_file; do
  xmllint --nonet --noout "$svg_file"
done <<< "$svg_files"

count="$(printf '%s\n' "$svg_files" | wc -l | tr -d ' ')"
echo "Validated $count SVG files."
