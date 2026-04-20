# Competitor Intelligence

**Priority: MEDIUM** | Cadence: Monthly (glance at latest scan, act if response needed)

Ongoing area for tracking competitor build tools and monorepo platforms.

## Purpose

Monthly changelog analysis of competitors to understand where they're investing, where they're converging/diverging with Nx, and what Nx should pay attention to.

## Tracked Competitors

| Tool          | Category                        | Overlap with Nx                   |
| ------------- | ------------------------------- | --------------------------------- |
| **Turborepo** | JS/TS monorepo                  | Direct competitor                 |
| **Moon**      | Polyglot monorepo               | Growing competitor                |
| **Bazel**     | Enterprise build                | Low overlap (enterprise/polyglot) |
| **Gradle**    | JVM build                       | Low overlap (Nx JVM plugin)       |
| **Pants**     | Python/Go build                 | Minimal overlap                   |
| **Vite+**     | Unified JS toolchain + monorepo | Growing competitor (entry-level)  |

## Reports

| Month   | File                           | Key Events                                                                        |
| ------- | ------------------------------ | --------------------------------------------------------------------------------- |
| 2026-02 | `2026-02.md`                   | Moon v2.0, Bazel 9.0, Turborepo 2.8 AI push                                       |
| 2026-03 | `2026-03.md`                   | Turborepo 2.8.21 (`experimentalCI` task config, query engine stable, NAPI bindings, AI doc auto-rewrite, 9 stable + 28 canaries), Moon 2.1.3 (on-demand affected perf, TS v6), Bazel 9.0.1, Gradle 9.4.1, Pants `pants-ng` |
| 2026-03 | `viteplus-analysis-2026-03.md` | Deep-dive: Vite+ (VoidZero) competitive analysis                                  |
| 2026-04 | `2026-04.md`                   | Turborepo 2.9.6 stable + canary.13 (OAuth device-flow auth, PTY shutdown fixes; cadence cooling into v2.9.7 stable cut); Moon v2.2.2 (v2.2.0 daemon + AI Skills `debug-task` now on 2 patches: async tracker +5-10%, pnpm v10 multi-doc lockfile fix, plugin-load regression); Bazel 9.0.2 stable + 9.1.0rc3 (`--rewind_lost_inputs`, remote cache chunking); **Gradle 9.5.0-RC3 (task provenance in reports, precompiled Kotlin Settings plugins, `--develocity-url` CLI)**; Pants 2.30.2 stable + 2.32.0a0 **new alpha channel**; threat HIGH |

## How to Run

Use the `/scan-competitors` command in Claude Code. It:

1. Pulls live release data via `gh release list` and `npm view`
2. Fetches blog posts via WebFetch
3. Filters to 60-day lookback window
4. Categorizes changes and analyzes Nx relevance
5. Writes monthly report to this directory

## Data Sources

- GitHub Releases API (`gh release list/view`)
- npm registry (`npm view`)
- Official blogs (turborepo.dev, moonrepo.dev, blog.gradle.org, pantsbuild.org)
- Gradle releases page (gradle.org/releases)
