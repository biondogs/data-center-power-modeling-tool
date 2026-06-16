#!/usr/bin/env python3
"""Read JSON from stdin, recursively sort all object keys, print to stdout."""

import json
import sys


def sort_json(value):
    """Recursively sort all object (dict) keys alphabetically."""
    if isinstance(value, dict):
        return {k: sort_json(v) for k, v in sorted(value.items())}
    if isinstance(value, list):
        return [sort_json(item) for item in value]
    return value


def main():
    raw = sys.stdin.read()
    data = json.loads(raw)
    sorted_data = sort_json(data)
    print(json.dumps(sorted_data, indent=2))


def run_test():
    """Self-test when run directly without piped input."""
    sample = {
        "zebra": 3,
        "alpha": {
            "two": "b",
            "one": "a"
        },
        "list": [
            {"y": 1, "x": 2},
            42
        ]
    }
    expected = {
        "alpha": {
            "one": "a",
            "two": "b"
        },
        "list": [
            {"x": 2, "y": 1},
            42
        ],
        "zebra": 3
    }
    result = sort_json(sample)
    assert result == expected, f"Mismatch:\n{json.dumps(result, indent=2)}\n!=\n{json.dumps(expected, indent=2)}"

    # Also test through the stdin/stdout path
    import subprocess
    proc = subprocess.run(
        [sys.executable, __file__],
        input=json.dumps(sample),
        capture_output=True, text=True, check=True
    )
    assert proc.stdout.strip() == json.dumps(expected, indent=2).strip(), (
        f"stdout mismatch:\n{proc.stdout}"
    )
    print("All tests passed.")


if __name__ == "__main__":
    if "--test" in sys.argv or sys.stdin.isatty():
        run_test()
    else:
        main()
