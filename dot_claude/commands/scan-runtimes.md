---
description: >
  Track Node.js, V8, TC39, Bun, and Deno releases and proposals that
  could affect Nx CLI or Nx Cloud. Flags compat risks, new APIs to
  leverage, and deprecations to handle. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Node.js & Runtime Tracking

Monitor JavaScript runtime ecosystem changes that could affect Nx CLI
and Nx Cloud. The Node 24 compatibility issues (memory problems, test
timeouts) are exactly what this command is meant to catch early.

## Scope

$ARGUMENTS

Default: all tracked runtimes. Can scope to "node only", "tc39 only", etc.

## File Management

Area directory: `.ai/para/areas/runtime-tracking/`

1. Current month as `YYYY-MM`.
2. If report exists, **update in place**. Preserve `> NOTE:` / `<!-- manual -->`.
3. If not, create new. Ensure README.md links it.

### README.md structure

```markdown
# Runtime Tracking

Monthly tracking of Node.js, V8, TC39, Bun, and Deno changes that affect
Nx CLI and Nx Cloud. Catches compatibility risks before they hit users.

## Nx Runtime Support Matrix

| Runtime | Minimum Supported | Recommended | Notes |
|---------|-------------------|-------------|-------|
| Node.js | {fill from engines field} | {current LTS} | |
| Bun | Experimental | — | |
| Deno | Not supported | — | |

_Update this table when support policy changes._

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line: key risk or highlight}
```

## Sources

### Node.js

```bash
# Recent releases
WebFetch https://nodejs.org/en/blog

# Changelog for current major
gh release list --repo nodejs/node --limit 15 --json tagName,publishedAt,body
```

Focus on:
- New LTS releases or LTS schedule changes
- Deprecation warnings in new versions
- Changes to module resolution (ESM/CJS), `--experimental-*` flags graduating
- V8 engine version bumps and what they bring
- `process`, `fs`, `child_process`, `worker_threads` API changes (Nx uses all of these heavily)
- Memory management changes (relevant to Node 24 OOM issues)
- Changes to `--strip-types` or TypeScript support

### TC39 Proposals

```bash
WebFetch https://github.com/tc39/proposals/blob/main/README.md
```

Filter for proposals that advanced stage this month. Focus on:
- Stage 3 → 4 (shipping in engines soon, may need polyfill review)
- Stage 2 → 3 (start planning, check if any Nx code patterns conflict)
- Anything related to: modules, import assertions, decorators, async patterns,
  structured clone, type annotations

### Bun

```bash
gh release list --repo oven-sh/bun --limit 10 --json tagName,publishedAt
```

Check `https://bun.sh/blog` for release posts. Focus on:
- Node.js API compatibility improvements (affects whether Nx works on Bun)
- Package manager changes
- Workspaces support changes

### Deno

```bash
gh release list --repo denoland/deno --limit 10 --json tagName,publishedAt
```

Check `https://deno.com/blog`. Focus on:
- Node compatibility layer changes
- npm specifier support
- Workspace/monorepo support (competitive signal)

## Analysis for each runtime

### Compatibility risks for Nx
- APIs we use that are deprecated or changing behavior
- Default flag changes that affect our test suite or CLI behavior
- Memory/performance characteristics that changed
- Module resolution changes that could break plugin loading

### Opportunities for Nx
- New APIs that could replace polyfills or workarounds we use
- Performance improvements we can leverage (e.g., new `fs` APIs)
- Features that simplify our codebase

### Impact on Nx users
- What version ranges should we support?
- Do our `engines` fields need updating?
- Are there migration steps users need?

## Compare with last month

- Risks flagged last month: resolved or still open?
- New risks introduced
- TC39 proposals that advanced

## Write the report

```markdown
# Runtime Tracking — {Month Year}

_Last updated: {datetime}_

## ⚡ Action Items
{Top 1-3 things that need attention NOW. If nothing, say "None this month."}

## Node.js

### Releases this month
| Version | Date | Type | Key Changes |
|---------|------|------|-------------|

### Risks for Nx
{Specific: "Node 24.x changed X which breaks our Y because Z"}

### Opportunities
{Specific: "New fs.glob() API could replace our glob dependency"}

## TC39 Proposals

### Stage changes this month
| Proposal | From | To | Nx Impact |
|----------|------|----|-----------|

## Bun
### Releases: {versions}
### Nx compat status: {what works, what doesn't}

## Deno
### Releases: {versions}
### Nx compat status: {what works, what doesn't}

## Nx `engines` Field Review
Current: {what package.json says}
Recommended: {any changes needed based on this month's findings}
```

Save to `.ai/para/areas/runtime-tracking/YYYY-MM.md` and update README.md.
