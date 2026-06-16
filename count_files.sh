#!/usr/bin/env bash
# count_files.sh — Report .js file stats in a given directory (recursive).
# Usage: ./count_files.sh <directory>

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <directory>" >&2
  exit 1
fi

DIR="$1"

if [ ! -d "$DIR" ]; then
  echo "Error: '$DIR' is not a valid directory." >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 1. Number of .js files
# ---------------------------------------------------------------------------
file_count=$(find "$DIR" -type f -name '*.js' | wc -l | tr -d ' ')

# ---------------------------------------------------------------------------
# 2. Total lines of code across all .js files
# ---------------------------------------------------------------------------
total_lines=0
if [ "$file_count" -gt 0 ]; then
  total_lines=$(find "$DIR" -type f -name '*.js' -exec cat {} + | wc -l | tr -d ' ')
fi

# ---------------------------------------------------------------------------
# 3. Count of function declarations
# ---------------------------------------------------------------------------
# Matches common JS function patterns:
#   function name(            — function declarations
#   name( ) {                 — class/object method definitions
#   (...) =>                  — arrow functions
function_count=0
if [ "$file_count" -gt 0 ]; then
  function_count=$(find "$DIR" -type f -name '*.js' -exec cat {} + \
    | grep -cE '(^|[[:space:]])function[[:space:]]+|=>|[[:space:]]+[a-zA-Z_$][a-zA-Z0-9_$]*[[:space:]]*\([^)]*\)[[:space:]]*\{' || true)
fi

# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------
echo "Number of .js files:        $file_count"
echo "Total lines of code:        $total_lines"
echo "Function declarations:      $function_count"
