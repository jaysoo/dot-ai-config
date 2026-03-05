# CNW Stats: Version 22.5.4

**Date pulled:** 2026-03-05
**Environment:** Production
**Version active:** Mar 4, 2026 14:43 ET - Mar 5, 2026 08:41 ET (~18 hours)

## Funnel

| Stage | Count | % of Starts |
|-------|------:|------------:|
| Starts | 1,211 | 100% |
| Precreates | 1,041 | 85.9% |
| Completes | 948 | 78.3% |
| Errors | 69 | 5.7% |
| Cancels | 0 | 0% |

Drop-off: 14.1% start->precreate (prompt abandonment), 8.9% precreate->complete.
Error rate 5.7% — below the 6.8% Jan-Mar baseline.

## Package Managers

| PM | Count | % |
|----|------:|--:|
| npm | 553 | 53.1% |
| pnpm | 457 | 43.9% |
| yarn | 20 | 1.9% |
| bun | 12 | 1.2% |

## Top Presets

| Preset | Count | % |
|--------|------:|--:|
| @contentful/nx@latest | 368 | 35.4% |
| apps | 137 | 13.2% |
| ts | 101 | 9.7% |
| angular-monorepo | 96 | 9.2% |
| (empty/unknown) | 74 | 7.1% |
| vue-monorepo | 47 | 4.5% |
| react-monorepo | 42 | 4.0% |
| angular-standalone | 38 | 3.7% |
| next | 36 | 3.5% |
| node-monorepo | 32 | 3.1% |
| nest | 16 | 1.5% |
| @schenker/workspace@e2e | 12 | 1.2% |
| react-native | 8 | 0.8% |
| @analogjs/platform@ | 7 | 0.7% |
| react-standalone | 5 | 0.5% |
| npm | 4 | 0.4% |
| nuxt | 4 | 0.4% |
| expo | 3 | 0.3% |
| @pas/nx-plugin | 2 | 0.2% |
| web-components | 2 | 0.2% |
| Other (6 presets) | 6 | 0.6% |

Note: Contentful preset dominates at 35% — likely automated/CI usage.

## AI Agent Usage

| Agent | Count | % |
|-------|------:|--:|
| Human (false) | 1,120 | 92.5% |
| AI Agent (true) | 89 | 7.4% |
| Unknown | 2 | 0.2% |

## Flow Variants

| Variant | Count | % |
|---------|------:|--:|
| 0 | 397 | 32.8% |
| 1 | 432 | 35.7% |
| 2 | 380 | 31.4% |
| unknown | 2 | 0.2% |

## VCS Push Status (of 948 completes)

| Status | Count | % |
|--------|------:|--:|
| SkippedGit | 852 | 89.9% |
| FailedToPushToVcs | 79 | 8.3% |
| OptedOutOfPushingToVcs | 12 | 1.3% |
| PushedToVcs | 7 | 0.7% |

## Nx Cloud Adoption (of 948 completes)

| Choice | Count | % |
|--------|------:|--:|
| skip | 711 | 75.0% |
| github | 106 | 11.2% |
| yes | 80 | 8.4% |
| gitlab | 29 | 3.1% |
| never | 13 | 1.4% |
| bitbucket-pipelines | 7 | 0.7% |
| azure | 3 | 0.3% |
| circleci | 1 | 0.1% |

Cloud adoption rate: 25% (237/948 chose a CI provider or "yes").

## Error Breakdown (69 total)

| Error Code | Count | % of Errors | % of Starts |
|-----------|------:|------------:|------------:|
| WORKSPACE_CREATION_FAILED | 33 | 47.8% | 2.73% |
| SANDBOX_FAILED | 13 | 18.8% | 1.07% |
| UNKNOWN | 10 | 14.5% | 0.83% |
| CI_WORKFLOW_FAILED | 7 | 10.1% | 0.58% |
| TEMPLATE_CLONE_FAILED | 4 | 5.8% | 0.33% |
| PRESET_FAILED | 2 | 2.9% | 0.17% |

### Error Details (top 15)

| Count | Code | Message (truncated) |
|------:|------|---------------------|
| 13 | SANDBOX_FAILED | Failed to install dependencies: (empty) |
| 11 | WORKSPACE_CREATION_FAILED | npm warn deprecated whatwg-encoding@2.0.0 |
| 6 | WORKSPACE_CREATION_FAILED | npm warn deprecated inflight@1.0.6 |
| 3 | WORKSPACE_CREATION_FAILED | Progress: resolved 1, reused 0, downloaded 0 (pnpm) |
| 3 | UNKNOWN | Command failed: pnpm --version (/bin/sh: 1: pnpm: not found) |
| 2 | TEMPLATE_CLONE_FAILED | /bin/sh: 1: git: not found |
| 2 | UNKNOWN | Command failed: pnpm --version (pnpm: command not found) |
| 2 | CI_WORKFLOW_FAILED | Failed to generate CI workflow (NX Generating) |
| 2 | WORKSPACE_CREATION_FAILED | npm warn ERESOLVE overriding peer dependency |
| 2 | UNKNOWN | Command failed: pnpm --version ('pnpm' not recognized) |
| 1 | UNKNOWN | (empty) |
| 1 | CI_WORKFLOW_FAILED | Failed to process project graph |
| 1 | WORKSPACE_CREATION_FAILED | npm error code ETARGET |
| 1 | WORKSPACE_CREATION_FAILED | NODE_TLS_REJECT_UNAUTHORIZED warning |
| 1 | CI_WORKFLOW_FAILED | (NX Failed) |

## Key Observations

1. **npm deprecation false positives** still #1 error source (17/33 WORKSPACE_CREATION_FAILED are `npm warn deprecated`)
2. **SANDBOX_FAILED jumped to 18.8%** (vs ~3% baseline) — all 13 have empty error messages, worth investigating
3. **pnpm not found** accounts for 7/10 UNKNOWN errors — CI environments without pnpm installed
4. **Contentful preset** is 35% of all precreates — likely automated/CI, skewing metrics
5. **Cloud adoption at 25%** — consistent with recent trends
6. **AI agent usage at 7.4%** — growing signal
7. **FailedToPushToVcs at 8.3%** of completes — not errors but worth monitoring
