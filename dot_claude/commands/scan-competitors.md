---
description: >
  Analyze competitor releases and changelog entries for the current month.
  Covers Turborepo, Moon, Bazel, Gradle, and Pants. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Competitor Changelog Analysis

Scan competitor build tools and monorepo platforms to understand what they
shipped, where they're investing, and what it means for Nx.

## Scope

$ARGUMENTS

If no arguments: analyze all tracked competitors for the current month.
If arguments provided (e.g., "turborepo only", "January 2026"): scope accordingly.

## File Management

Area directory: `.ai/para/areas/competitor-intel/`

1. Current month as `YYYY-MM`.
2. If `.ai/para/areas/competitor-intel/YYYY-MM.md` exists, read it and
   **update in place** — append new releases found, refresh analysis.
   Preserve lines starting with `> NOTE:` or `<!-- manual -->` sections.
3. If not, create new. Ensure README.md exists and links this report.

### README.md structure

```markdown
# Competitor Intelligence

Monthly analysis of competitor releases, positioning, and technical direction.
Used for roadmap planning and strategic positioning.

## Tracked Competitors

- **Turborepo** (Vercel) — direct competitor, JS/TS monorepo
- **Moon** (moonrepo) — Rust-based monorepo, polyglot
- **Bazel** (Google) — enterprise build system
- **Gradle** — JVM build ecosystem, overlaps with Nx polyglot story
- **Pants** (Toolchain) — Python/JVM monorepo tool

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line highlight}
```

## Competitors and Sources

### Turborepo
```bash
gh release list --repo vercel/turborepo --limit 10 --json tagName,publishedAt,body
```
Also check: `https://turbo.build/blog`

### Moon
```bash
gh release list --repo moonrepo/moon --limit 10 --json tagName,publishedAt,body
```
Also check: `https://moonrepo.dev/blog`

### Bazel
```bash
gh release list --repo bazelbuild/bazel --limit 10 --json tagName,publishedAt,body
```
Also check: `https://blog.bazel.build/`

### Gradle
WebFetch `https://gradle.org/releases/` for version info.
Also: `https://blog.gradle.org/`

### Pants
```bash
gh release list --repo pantsbuild/pants --limit 10 --json tagName,publishedAt,body
```

## For each competitor

Filter to releases within the target month. For each release:

1. Fetch the full release body
2. Categorize changes:
   - **Features** — new capabilities
   - **Performance** — speed/cache/build improvements
   - **DX** — developer experience, CLI UX, error messages
   - **Ecosystem** — new language/framework support, integrations
   - **AI** — any AI-related features (MCP, code generation, etc.)
   - **Enterprise** — RBAC, compliance, cloud features

## Analysis Framework

For each competitor, assess:

### Where are they investing?
What themes appear across multiple releases? What's getting sustained
attention vs. one-off fixes?

### Where are they converging with Nx?
Features that overlap with Nx's roadmap or current capabilities. This
validates our direction.

### Where are they diverging from Nx?
Bets they're making that we're not. Could be opportunities or distractions.

### What should we pay attention to?
Anything that could affect Nx's positioning, adoption, or technical decisions.
Be specific: "Turborepo added X which our users have been asking for" is
useful. "Bazel is still complex" is not.

### What validates our direction?
Evidence that our current roadmap is on the right track.

## Compare with last month

If previous report exists, note:
- Competitors that accelerated or slowed their release cadence
- Themes that persisted vs. faded
- Anything we flagged last month that materialized or didn't

## Write the report

```markdown
# Competitor Intel — {Month Year}

_Last updated: {datetime}_

## Executive Summary
{3-5 bullets: most important things to know this month across all competitors}

## Turborepo

### Released this month
{version list with dates}

### Key changes
{Categorized: Features / Performance / DX / Ecosystem / AI / Enterprise}

### Nx implications
{Specific: what this means for us. "Nothing actionable" is a valid answer.}

## Moon
{Same structure}

## Bazel
{Same structure}

## Gradle
{Same structure}

## Pants
{Same structure}

## Cross-Competitor Themes
{Patterns visible across multiple competitors:
e.g., "3 of 5 competitors shipped remote caching improvements this month"}

## Recommended Actions
{Specific suggestions for Nx roadmap or positioning. Each should be
actionable: "Consider X because Y" not "Keep an eye on Z"}
```

Save to `.ai/para/areas/competitor-intel/YYYY-MM.md` and update README.md.
