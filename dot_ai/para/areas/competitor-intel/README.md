# Competitor Intelligence

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

| Month   | File                           | Key Events                                                        |
| ------- | ------------------------------ | ----------------------------------------------------------------- |
| 2026-02 | `2026-02.md`                   | Moon v2.0, Bazel 9.0, Turborepo 2.8 AI push                       |
| 2026-03 | `2026-03.md`                   | Turborepo 2.8.13 OTel + perf sprint, Gradle 9.4, Vite+ Oxfmt beta |
| 2026-03 | `viteplus-analysis-2026-03.md` | Deep-dive: Vite+ (VoidZero) competitive analysis                  |

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
