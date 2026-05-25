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
| 2026-04 | `2026-04.md`                   | **Turborepo 2.9 shipped** (`turbo query` stable, "96% faster", `--affected`+`--filter` combinable, incremental task caching, 256KB cache upload chunks, Rayon-parallel boundaries, OAuth/device-flow auth in canary, **3.0 deprecations signaled**). 8 stable in 13 days then 18-day stable silence; canary frozen 12 days at v2.9.7-canary.13. **Threat HIGH (idle).** Moon v2.2 minor (async graph 100-170% faster, async affected 100-150%, unstable daemon -- opposite bet from Turbo's daemon removal); threat upgraded to **Medium**. Bazel 9.1.0 (`--rewind_lost_inputs`, remote cache chunking) + 8.7.0rc1 (Apr 27, placeholder notes). Gradle 9.4.1 unchanged. Pants 2.30.2 + 2.32.0a0 alpha. |
| 2026-05 | `2026-05.md`                   | _Updated 2026-05-25._ **Turbo security sprint**: 5 stable releases May 4-14 (v2.9.9-v2.9.14), 3 CVEs patched (High: VSCode cmd injection), VSCode/LSP investment (turbo.jsonc, $TURBO_EXTENDS$), cache filesystem boundary enforcement. **Bazel 8.7.0 final** (May 7). **Gradle 9.5.1 + 8.14.5 + 9.6.0-m2** (3 releases in 5 days). **Moon v2.2.4+v2.2.5** bug-fix stabilization; proto v0.57 OCI plugin distribution. **Pants `pants_ng`** Rust-rewrite mode now testable in 2.33 dev builds. AI-debug gap (Moon `debug-task`) still unmatched. |

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
