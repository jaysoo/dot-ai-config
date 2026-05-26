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
| 2026-05 | `2026-05.md`                   | **W22 refresh**: Turbo shipped **v2.9.14 (May 14) patching 3 security advisories** -- High: VS Code extension command injection; Low: OAuth callback CSRF/session fixation (in the v2.9.7 OAuth flow shipped May 1); Low: Yarn Berry detection LCE. **VS Code extension shipped** (v2.9.11/12). Rust panic/unwrap removal sprint (11 PRs, v2.9.15-canary.5). Cache restore symlink race hardening (3 fixes one canary). `pnpm minimum release age` default. **Bazel 8.7.0 LTS final shipped May 7**. **Gradle 9.5.1 (May 12)** patches OOM regression on 9.5.0 upgrade; **8.14.5 LTS** May 7; May 20 blog continues config-cache inner-loop marketing push. **Moon 2.2.4 + 2.2.5 bug-fix-only** -- no new AI skills since v2.2.0 `debug-task` (6 weeks). **Pants cadence resumed across 5 release tracks** (2.32.0rc1, 2.33.0.dev2, uv adoption, Depot CI runners). Earlier cycle (W19): Turbo v2.9.7/2.9.8 stable + OAuth/device-flow shipped; Gradle 9.5.0 ended 40-day silence; Moon `debug-task` AI skill noted. |

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
