# Stale Docs

Ongoing tracking of documentation staleness across repos (primarily `nrwl/nx`).

Docs can go stale in three ways:
1. **Old version numbers** — minimum Nx, Node, or package versions that are now EOL or far behind current
2. **Old code examples** — CI YAML snippets, Docker images, install commands referencing outdated versions
3. **Feature drift** — options or flags documented that no longer exist (or exist differently) in the codebase

## Audits

| Date | Repo | File | Notes |
|------|------|------|-------|
| 2026-07-04 | nrwl/nx | [nx-astro-docs-staleness-2026-07-04.md](./nx-astro-docs-staleness-2026-07-04.md) | Fifth full scan; 8 parallel agents (one re-verified every 06-29 item against live source). **Confirmed Nx 23.0.1 is genuinely `latest` via `npm view nx dist-tags`** — retracted 5 false positives from 06-29 that flagged correct "Nx 23 current" content as stale (the 06-29 report itself had the wrong baseline, 22 vs actual 23). New high-value findings: 11 Module Federation guides (Angular+React) never mention the real v23 deprecation of host/remote/federate-module generators; nx-json.mdoc "Task options" table lists properties that don't actually work at nx.json's root; dead `NX_RUNNER` env var still documented; Storybook deprecated-package issue expanded from 3 to 10 files; webpack-plugins.mdoc has a removed option, a backwards default, and 6 undocumented options. 35 Linear issues queued — MCP still unavailable (6th run in a row). |
| 2026-06-29 | nrwl/nx | [nx-astro-docs-staleness-2026-06-29.md](./nx-astro-docs-staleness-2026-06-29.md) | Full scan of all 503 mdoc files (new coverage: technologies/, extending-nx/, reference/, guides/, getting-started/). Key findings: broken Rust crates guide, Windows TUI stale, Storybook deprecated packages, compose-executors using "builder" not "executor". Note: scan used wrong Nx baseline (22 vs actual 23) and wrong GH Actions versions — several findings were false positives. Agent verification rules added to this README. 26 Linear issues queued — MCP still unavailable. |
| 2026-06-24 | nrwl/nx | [nx-astro-docs-staleness-2026-06-24.md](./nx-astro-docs-staleness-2026-06-24.md) | Fourth scan; 2 new issues (dead Nx < 17.2 cache troubleshooting step, stale "Nx 20+" label in explore-graph); all prior open issues re-aggregated into one table. Linear MCP still unavailable — 18 total issues queued for manual creation. |
| 2026-06-17 | nrwl/nx | [nx-astro-docs-staleness-2026-06-17.md](./nx-astro-docs-staleness-2026-06-17.md) | Third scan; deprecated cacheableOperations/tasksRunnerOptions in active feature pages, dead Nx ≤ 19.6 conditionals in cloud docs, stale TS 4.7 ref, "prior to Nx 18" blocks. Linear MCP broken (SSE transport removed) — 8 issues queued for manual creation. |
| 2026-06-12 | nrwl/nx | [nx-astro-docs-staleness-2026-06-12.md](./nx-astro-docs-staleness-2026-06-12.md) | Follow-up scan; svgr option documented but removed from source in Nx 22, stale Nx 15.7 linkcard, composePlugins/withReact removal in Nx 24 to monitor |
| 2026-06-11 | nrwl/nx | [nx-astro-docs-staleness-2026-06-11.md](./nx-astro-docs-staleness-2026-06-11.md) | Full scan of 501 mdoc files; Node 20 EOL, Nx 15–19 version refs, @nrwl/ package names |

## Recurring Checks to Run

- After each Nx major release: grep for `Nx {prev_major}` caveats in non-deprecated docs
- Annually (April/October): grep `node-version:`, `node:XX`, `Node.js.*vXX` against Node.js release schedule EOL dates
- When a package is deprecated: grep for `@nrwl/` scope if any `@nx/` migration happened

## Agent Instructions — Preventing False Positives

**Never assert an external version is stale without verifying from the live source.** Agents have training-data knowledge cutoffs and will confidently cite wrong version numbers. Always fetch before flagging.

### Required pre-scan checks

Run these at the start of every scan and pass the results into agent prompts — do not hardcode version assumptions:

```bash
# Current Nx version
npm view nx version

# Current Node.js LTS and Current release lines
# Cross-reference: https://nodejs.org/en/about/releases/ (check EOL dates)
npm view node dist-tags

# GitHub Actions — check the actual latest major for each action used in docs
gh api repos/actions/checkout/releases/latest --jq '.tag_name'
gh api repos/actions/setup-node/releases/latest --jq '.tag_name'
```

### Rules for version claims in findings

| Claim type | How to verify |
|---|---|
| "Nx X.x is current/stale" | `npm view nx version` — use the live result, not training data |
| "Node X is EOL/current" | nodejs.org release schedule (EOL dates shift; Node 20 went EOL April 2026) |
| "actions/checkout@vN doesn't exist" | `gh api repos/actions/checkout/releases` — actions release new majors frequently |
| "package@version is old" | `npm view <package> dist-tags.latest` |
| "This flag/option doesn't exist" | Read the actual schema file in the repo — do not rely on memory |

### When in doubt, use `needs-input`

If live verification is not possible (network blocked, private registry, ambiguous), mark the finding as `needs-input` rather than asserting it as a confirmed bug. A false positive wastes more time than an honest "I couldn't verify this."
