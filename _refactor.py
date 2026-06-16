#!/usr/bin/env python3
"""Refactor lib/actions.ts: add ActionResult return type + try/catch wrappers.

Handles:
- Multi-line parameter types with inline {} and <>
- Existing return type annotations (Promise<...>)
- Nested braces in return types
"""
import re

filepath = '/Users/josephbiondo/NonSync/Power Modeling Tool/lib/actions.ts'

with open(filepath, 'r') as f:
    content = f.read()

# ── Step 1: Add import ──
content = content.replace(
    'import { redirect } from "next/navigation";\n',
    'import { redirect } from "next/navigation";\nimport { ActionResult } from "@/lib/useServerAction";\n',
)

# ── Step 2: Transform each function ──
funcs = [
    ('createScenario', 'rethrow'),
    ('addLineItem', 'return'),
    ('updateLineItem', 'return'),
    ('deleteLineItem', 'return'),
    ('createCatalogItem', 'return'),
    ('updateCatalogItem', 'return'),
    ('deleteCatalogItem', 'return'),
    ('deleteCatalogItems', 'return'),
    ('updateSiteSettings', 'return'),
    ('updateScenarioAssumptions', 'return'),
    ('deleteScenario', 'return'),
    ('deleteScenarios', 'return'),
]

for func_name, action_type in funcs:
    # Strategy: Find the function start, then scan character by character
    # to find the param closing paren, then skip return type, then find
    # the body opening brace.
    
    func_start = content.find(f'export async function {func_name}(')
    if func_start < 0:
        raise ValueError(f"Could not find function {func_name}")
    
    # Find the closing paren of params by tracking depth
    param_depth = 0
    in_string = None
    param_close = func_start  # Start scanning from function name
    found_open = False
    i = func_start
    while i < len(content):
        ch = content[i]
        if in_string:
            if ch == '\\':
                i += 2
                continue
            if ch == in_string:
                in_string = None
        elif ch in ('"', "'", '`'):
            in_string = ch
        elif ch == '(':
            param_depth += 1
            found_open = True
        elif ch == ')':
            param_depth -= 1
            if param_depth == 0 and found_open:
                break
        i += 1
    
    param_close = i  # Position of closing paren
    
    # Now skip past optional return type annotation to find the body brace
    j = param_close + 1
    while j < len(content) and content[j] in ' \t\n\r':
        j += 1
    
    # Check if there's a return type annotation
    sig_end = j
    if content[j:j+1] == ':':
        # Parse the return type - handle nested <> properly
        # We track angle bracket depth; {} inside <> don't count
        angle_depth = 0
        brace_depth = 0
        j += 1  # Skip ':'
        while j < len(content):
            ch = content[j]
            if ch == '<':
                angle_depth += 1
            elif ch == '>':
                angle_depth -= 1
                if angle_depth == 0:
                    break
            elif ch == '{' and angle_depth > 0:
                brace_depth += 1
            elif ch == '}' and angle_depth > 0:
                brace_depth -= 1
            j += 1
        sig_end = j + 1
    
    # Skip whitespace to find opening brace
    while sig_end < len(content) and content[sig_end] in ' \t\n\r':
        sig_end += 1
    
    if content[sig_end] != '{':
        raise ValueError(f"Expected {{ at position {sig_end} for {func_name}, found: {repr(content[sig_end:sig_end+10])}")
    
    brace_pos = sig_end
    
    # Find matching closing brace
    depth = 1
    k = brace_pos + 1
    while k < len(content) and depth > 0:
        if content[k] == '{':
            depth += 1
        elif content[k] == '}':
            depth -= 1
        k += 1
    
    if depth != 0:
        raise ValueError(f"Unmatched braces for {func_name}")
    
    body_end = k - 1
    body_text = content[brace_pos + 1:body_end]
    
    # Extract original params text
    open_paren = func_start + len(f'export async function {func_name}')
    while content[open_paren] != '(':
        open_paren += 1
    
    original_params = content[open_paren:param_close + 1]
    new_sig = f'export async function {func_name}{original_params}: Promise<ActionResult> {{'
    
    # Indent body by 4 spaces
    body_lines = body_text.split('\n')
    indented = []
    for line in body_lines:
        if line.strip():
            indented.append('    ' + line)
        else:
            indented.append(line)
    
    # Strip trailing return/throw/empty for 'return' type
    if action_type == 'return':
        while indented and (indented[-1].strip().startswith('return ') or
                            indented[-1].strip().startswith('throw ') or
                            indented[-1].strip() == ''):
            indented.pop()
        indented.append('        return { success: true };')
    
    # Build new function body
    new_body_lines = [
        '    try {',
    ] + indented + [
        '    } catch (e) {',
        '        const errMsg = e instanceof Error ? e.message : "An unexpected error occurred";',
    ]
    
    if action_type == 'return':
        new_body_lines.append('        return { success: false, error: errMsg };')
    else:
        new_body_lines.append('        throw new Error(errMsg);')
    
    new_body_lines.append('    }')      # close catch
    new_body_lines.append('}')          # close function
    
    new_text = new_sig + '\n' + '\n'.join(new_body_lines)
    
    # Replace
    old_text = content[func_start:body_end + 1]
    content = content.replace(old_text, new_text, 1)

with open(filepath, 'w') as f:
    f.write(content)

print("Done!")
