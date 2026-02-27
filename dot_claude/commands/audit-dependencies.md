---
description: >
  Audit dependency health across Nx CLI and Nx Cloud packages. Checks for
  unmaintained, deprecated, or at-risk dependencies. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Dependency Health Audit

Audit all direct external dependencies in the Nx monorepo for maintenance
health, security risk, and staleness.

## Scope

$ARGUMENTS

If no arguments: audit all `package.json` files under `packages/` in the
current repo. If running from the orchestrator, scan both **nrwl/nx** and
**ocean** (Nx Cloud) repos.

If arguments provided (e.g., "packages/nx", "@nx/vite", "cloud only",
"ocean only"): scope to those.

### Multi-repo support

This command can scan multiple repos when given paths:

- **nx repo**: Look for `packages/` directory containing `@nx/*` packages.
- **ocean repo**: Look for publishable packages (check `package.json` files
  without `"private": true`). Ocean packages include `@nx-cloud/*` and
  internal services.

When scanning ocean, focus on:
- Direct dependencies of publishable packages
- Shared internal dependencies that could affect cloud stability
- Dependencies not present in the nx repo (ocean-specific risk)

## File Management

Area directory: `.ai/para/areas/dependency-health/`

1. Determine the current month as `YYYY-MM` (e.g., `2026-02`).
2. Check if `.ai/para/areas/dependency-health/YYYY-MM.md` exists.
   - If yes: read it, then **update in place** with fresh data. Preserve any
     manual notes or annotations the user may have added (look for lines
     starting with `> NOTE:` or sections marked `<!-- manual -->`).
   - If no: create a new report.
3. Ensure `.ai/para/areas/dependency-health/README.md` exists. If not, create
   it with the structure below. If it exists, add a link to this month's
   report if not already present.

### README.md structure

```markdown
# Dependency Health

Monthly audit of external dependency health across Nx CLI and Nx Cloud.

Flags unmaintained, deprecated, or at-risk packages. Suggests alternatives
and tracks resolution over time.

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line summary: N critical, N warning}
```

## Step 1: Collect all direct dependencies

```bash
find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/tmp/*" \
  -not -path "*/.nx/*" \
  | xargs jq -r '
    .name as $pkg |
    ((.dependencies // {}) + (.devDependencies // {})) |
    to_entries[] |
    "\($pkg)\t\(.key)\t\(.value)"
  ' 2>/dev/null | sort -u -t$'\t' -k2,2
```

Deduplicate by package name. **Exclude** `@nx/*` and `@nrwl/*` packages (internal).

## Step 2: Check each dependency

For each unique external dependency:

```bash
npm view <pkg> time.modified dist-tags.latest deprecated repository.url --json 2>/dev/null
```

If repo is on GitHub:
```bash
gh api repos/<owner>/<repo> --jq '{
  archived: .archived,
  pushed_at: .pushed_at,
  open_issues_count: .open_issues_count
}' 2>/dev/null
```

Rate-limit yourself: add a short sleep between npm calls if there are >50 deps.

## Step 3: Classify risk

| Risk | Criteria |
|------|----------|
| 🔴 Critical | Archived, OR >24mo since publish, OR `deprecated` field set |
| 🟠 Warning | 12-24mo since publish, OR repo inactive 12mo+ |
| 🟡 Watch | 6-12mo since publish, OR single maintainer gone quiet |
| 🟢 Healthy | Active, recent publishes |

## Step 4: Check for alternatives (🔴 and 🟠 only)

Search for maintained forks, platform-native replacements, or popular alternatives.

## Step 5: Compare with previous month

If a previous month's report exists, diff against it:
- New 🔴/🟠 items since last month (regressions)
- Items that improved (maintainer resumed activity, new release shipped)
- Items that were flagged last month and are still unresolved

## Step 6: Write the report

```markdown
# Dependency Health — {Month Year}

_Last updated: {datetime}_
_Scope: {what was audited}_

## Summary
- Total unique external deps: {N}
- 🔴 Critical: {N} ({+/-N vs last month})
- 🟠 Warning: {N}
- 🟡 Watch: {N}
- 🟢 Healthy: {N}

## Changes Since Last Month
{What's new, what improved, what's still unresolved}

## 🔴 Critical — Action Required

### {package-name}
- **Used by**: {list of @nx/* or cloud packages that depend on it}
- **Last published**: {date} ({N months ago})
- **Repository status**: {archived / inactive / deleted / unknown}
- **Impact**: {what breaks for Nx users if this dep dies}
- **Suggested action**: {replace with X / inline / fork / drop}

## 🟠 Warning — Monitor
{Same format, briefer}

## 🟡 Watch List
| Package | Last Publish | Used By | Note |
|---------|-------------|---------|------|

## Version Pinning Issues
{Deps where we're pinned to an old major and latest has security fixes
or significant improvements}
```

Save to `.ai/para/areas/dependency-health/YYYY-MM.md` and update README.md.
