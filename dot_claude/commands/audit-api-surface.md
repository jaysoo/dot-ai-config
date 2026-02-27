---
description: >
  Detect drift between Nx's public API surface and its documentation.
  Finds undocumented exports, stale docs, mismatched signatures, and
  missing JSDoc. Covers Nx CLI packages and Cloud SDK. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# API Surface vs Documentation Drift

Find mismatches between what Nx exports (the actual public API) and what Nx
documents (what users see). Every mismatch is a potential user frustration,
support ticket, or silent breaking change.

## Scope

$ARGUMENTS

If no arguments: audit all packages under `packages/` that have public exports.
If running from the orchestrator, scan both **nrwl/nx** and **ocean** repos.
If arguments (e.g., "packages/nx", "@nx/devkit", "ocean only"): scope to those.

### Multi-repo support

- **nx repo** (nrwl/nx): Primary target. Packages under `packages/` with
  public barrel exports (`index.ts`). Docs under `docs/`.
- **ocean repo** (Nx Cloud): Check `@nx-cloud/*` publishable packages for
  public API surface. Ocean has its own docs that may reference APIs.
  Focus on: nx-cloud runner SDK, CLI commands (`nx-cloud` binary), and
  any publicly documented configuration options.

When scanning ocean, note that its internal APIs are intentionally not
documented — only flag drift in packages published to npm.

## File Management

Area directory: `.ai/para/areas/api-surface-audit/`

1. Current month as `YYYY-MM`.
2. If `.ai/para/areas/api-surface-audit/YYYY-MM.md` exists, read and
   **update in place**. Preserve `> NOTE:` and `<!-- manual -->` sections.
3. If not, create new. Ensure README.md exists and links the report.

### README.md structure

```markdown
# API Surface Audit

Monthly audit of drift between Nx's public API and documentation.
Catches undocumented exports, stale docs, signature mismatches, and
missing JSDoc/TSDoc before users hit them.

## Reports

- [YYYY-MM](./YYYY-MM.md) — {N undocumented, N stale, N mismatched}
```

## Step 1: Enumerate public API surface

For each package with a public API (has `index.ts` or explicit `exports` in
`package.json`):

```bash
# Find all barrel exports
find packages/ -name "index.ts" -path "*/src/*" \
  | head -50

# For each, extract exported symbols
grep -E "^export " packages/<pkg>/src/index.ts
```

Also check `package.json` `exports` field for subpath exports.

Build a list of:
- Exported functions, classes, types, interfaces, enums
- CLI commands (from `packages/nx/src/command-line/`)
- Generator schemas (`generators.json` / `schema.json` files)
- Executor schemas (`executors.json` / `schema.json` files)

## Step 2: Enumerate documented API

Check documentation sources:

```bash
# Docs directory
find docs/ -name "*.md" | head -100

# API reference pages if they exist
find docs/ -path "*api*" -name "*.md"

# Generated API docs
find docs/ -path "*generated*" -name "*.md"
```

Also check `nx.dev` published docs by fetching:
```bash
WebFetch https://nx.dev/nx-api
```

## Step 3: Find drift

### 3a. Exported but undocumented
Symbols that appear in `index.ts` exports but have no corresponding
documentation page or section. Exclude internal/private APIs (prefixed with
`_` or marked `@internal` in JSDoc).

### 3b. Documented but removed/deprecated
Doc pages or sections that reference APIs no longer exported, or that
reference old function signatures.

```bash
# Check for @deprecated tags in source
grep -rn "@deprecated" packages/*/src/ --include="*.ts" | head -50
```

Cross-reference deprecated items against docs — are they marked as
deprecated in the docs too?

### 3c. Signature mismatches
For key public functions (especially in `@nx/devkit` and `packages/nx`),
compare the actual TypeScript signature against what the docs show.
Focus on:
- Parameter names and types
- Return types
- Optional vs required parameters
- Default values

### 3d. Missing JSDoc/TSDoc
Exported public symbols that lack JSDoc entirely. These are a problem
because doc generation tools can't produce useful output from them.

```bash
# Find exports without preceding JSDoc
# This is approximate — look for export lines not preceded by */ within 3 lines
grep -B3 "^export function\|^export class\|^export interface" \
  packages/<pkg>/src/index.ts | grep -L "\*/"
```

### 3e. Generator/Executor schema vs docs
Check that every generator listed in `generators.json` has a corresponding
doc page, and that the schema properties match what the docs describe.

```bash
# List all generators across packages
find packages/ -name "generators.json" \
  | xargs jq -r 'to_entries[] | "\(.key)"' 2>/dev/null
```

## Step 4: Severity classification

| Severity | Criteria |
|----------|----------|
| 🔴 High | Public API with no docs at all, or docs describe wrong behavior |
| 🟠 Medium | Deprecated in code but not in docs, or signature mismatch |
| 🟡 Low | Missing JSDoc, minor param name differences |
| ℹ️ Info | Internal APIs that leaked into exports (should be unexported) |

## Step 5: Compare with last month

If previous report exists:
- Items that were flagged and are now fixed
- New drift introduced this month
- Long-standing issues that remain unresolved (flag for prioritization)

## Step 6: Write the report

```markdown
# API Surface Audit — {Month Year}

_Last updated: {datetime}_
_Scope: {packages audited}_

## Summary
- Packages audited: {N}
- Public exports checked: {N}
- 🔴 High: {N} ({+/-N vs last month})
- 🟠 Medium: {N}
- 🟡 Low: {N}

## Changes Since Last Month
{What's new, what got fixed}

## 🔴 High — Docs are wrong or missing

### {package}: {symbol or API}
- **Exported from**: `{file path}`
- **Issue**: {undocumented / wrong signature / describes removed API}
- **User impact**: {how this hurts someone trying to use this API}
- **Fix**: {write docs / update signature in docs / remove export}

## 🟠 Medium — Stale or mismatched

### {package}: {symbol}
- **Issue**: {deprecated without docs update / param mismatch / etc}
- **Details**: {specifics}

## 🟡 Low — Missing JSDoc
| Package | Symbol | Type |
|---------|--------|------|

## Generators/Executors Without Doc Pages
| Package | Generator | Has Schema | Has Doc Page |
|---------|-----------|-----------|-------------|

## Leaked Internal APIs
{Symbols exported that appear to be internal (prefixed _, marked @internal,
or used only in tests)}
```

Save to `.ai/para/areas/api-surface-audit/YYYY-MM.md` and update README.md.
