#!/usr/bin/env bash

set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

count=0
failures=0
while IFS= read -r -d '' svg_file; do
  count=$((count + 1))
  if ! xmllint --nonet --noout "$svg_file"; then
    failures=$((failures + 1))
    echo "Invalid SVG: ${svg_file#"$root"/}" >&2
  fi
done < <(find "$root/assets" -type f -name '*.svg' -print0 | sort -z)

if [[ "$count" -eq 0 ]]; then
  echo "No SVG assets found." >&2
  exit 1
fi

if [[ "$failures" -gt 0 ]]; then
  echo "$failures of $count SVG files failed XML validation." >&2
  exit 1
fi

echo "Validated $count SVG files."
