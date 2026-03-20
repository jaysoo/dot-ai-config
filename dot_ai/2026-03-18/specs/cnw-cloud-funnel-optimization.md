# CNW/Init Funnel & Cloud Conversion Optimization

**Date:** 2026-03-18 | **Owner:** Jack Hsu | **Status:** Draft

## Problem Statement

Since November 2025, CNW and `nx init` invocations declined ~30% despite increased npm downloads and site traffic. Root cause: docs/marketing shifted users toward Cloud's web onboarding (which creates repos via GitHub auth), bypassing the CLI entirely. Cloud opt-in within the CLI flow dropped from historically 30-50% to ~3.7%, and end-to-end conversion (CNW complete → Cloud claimed) sits at 0.4-2.5%.

## Goals

| Metric                  | Current | Target |
| ----------------------- | ------- | ------ |
| CNW completions/day     | 1,368   | 2,500  |
| Init invocations/day    | 164     | 300    |
| Cloud "yes" rate        | ~3.7%   | 50%    |
| Claimed/Completed CNW % | ~1-2.5% | 5%     |

## Scope

**In:** Docs/marketing pages, CLI prompts, Cloud onboarding UX after "yes", re-engagement nudges for "skip" users, template error fixes, experiment framework.

**Out:** Cloud's web onboarding flow. Hard-gating incomplete `nxCloudId` onboarding (future phase).

## Funnel Stages

```
[nx.dev visitors] → [Run CNW/init] → [Answer prompts] → [Complete scaffold] → [Say "yes"] → [Claim workspace]
                     Stage 1           Stage 2            Stage 3              Stage 4        Stage 5
```

### Stage 1: Awareness → Invocation

**Problem:** Homepage/intro pages replaced CNW CTAs with Cloud signup CTAs. Tutorials show Cloud-first onboarding.

**Levers:** Restore `npx create-nx-workspace` as primary CTA alongside Cloud CTA. Update intro/getting-started pages. Ensure tutorials offer both paths.

**Measurement:** Daily CNW `start` events, page analytics.

### Stage 2: Start → Precreate

**Problem:** ~15-18% drop off during prompts.

**Levers:** Reduce prompt count, smarter defaults, auto-detect package manager.

**Measurement:** `start` → `precreate` rate (currently ~82-85%).

### Stage 3: Precreate → Complete

**Problem:** ~5-8% gap between precreate and complete. Angular template at 66.7% completion (12 errors/42), nest at 50%, expo at 16.7%.

**Levers:** Fix template errors, better error reporting for silent exits, reduce install time.

**Measurement:** `precreate` → `complete` rate, error rate by template.

### Stage 4: Complete → Cloud "Yes"

**Problem:** ~85% say "skip", ~11% say "never", only ~3.7% say "yes."

**Levers:** A/B test prompt copy (lead with concrete value), improve value proposition, contextual re-engagement for "skip" users (Stage 5b).

**Measurement:** yes/skip/never rates per variant.

### Stage 5a: "Yes" → Claimed

**Problem:** Only 1-8% of "yes" users click the setup URL. It's printed in terminal and README.md — never opened in a browser.

**Levers:** Auto-open Cloud URL in browser after "yes" (skip in CI, fail gracefully in headless). Improve terminal banner.

**Measurement:** `links_clicked` rate, `claimed/completed` rate.

### Stage 5b: "Skip" Re-engagement

**Problem:** 85% say "skip" and are never re-engaged (except via niche `nx view-logs`).

**Approach:** Contextual nudges tied to moments where Cloud would have helped:

- **Cache miss:** "This task took Xs. With remote caching, it could have been instant. Run `nx connect`."
- **First build / slow workload:** One-time nudge about Cloud benefits.

**Constraints:** Show-once per nudge type. Respect `neverConnectToCloud` and `NX_NO_CLOUD`. Skip in CI.

## Experiment Framework

- **Max 1 experiment per funnel stage** at a time
- **1-week cadence**, daily monitoring
- **A/B test** messaging changes; **before/after** for structural changes
- Existing A/B infra in `packages/create-nx-workspace/src/utils/nx/ab-testing.ts` (currently locked — unlock for experiments)

### Prioritized Experiments

| Priority | Stage | Experiment                            | Effort | Impact |
| -------- | ----- | ------------------------------------- | ------ | ------ |
| P0       | 5a    | Auto-open browser on Cloud "yes"      | Small  | High   |
| P0       | 1     | Restore CNW CTA on homepage + intro   | Small  | High   |
| P1       | 4     | A/B test Cloud prompt copy            | Small  | Medium |
| P1       | 5b    | Cache miss nudge for skip users       | Medium | Medium |
| P2       | 3     | Fix angular/nest/expo template errors | Medium | Low    |
| P2       | 2     | Auto-detect package manager           | Medium | Low    |

## Technical Notes

**Key files:**

- CNW prompts & A/B testing: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`
- CNW prompt logic: `packages/create-nx-workspace/src/internal-utils/prompts.ts`
- CNW entry point: `packages/create-nx-workspace/bin/create-nx-workspace.ts`
- Init command: `packages/nx/src/command-line/init/init-v2.ts`
- Cloud connection: `packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts`
- Messages/banners: `packages/create-nx-workspace/src/utils/nx/messages.ts`

**Re-engagement implementation:** Hook into task runner output post-completion. Track shown nudges in `~/.nx/nudges.json` to enforce show-once.

**New telemetry needed:** Nudge display/action events, browser open success tracking, per-experiment variant tagging.

## Timeline

| Phase | Weeks | Work                                                  |
| ----- | ----- | ----------------------------------------------------- |
| 1     | 1-2   | P0: Auto-open browser, restore CNW CTAs on docs       |
| 2     | 3-4   | P1: A/B test prompt copy, cache miss nudge            |
| 3     | 5-6   | P2: Fix template errors, iterate on Phase 1-2         |
| 4     | 7+    | Evaluate targets, plan hard-gating phase if warranted |

## Risks

| Risk                     | Mitigation                                       |
| ------------------------ | ------------------------------------------------ |
| Auto-open feels invasive | User said "yes" — expected. Skip in CI.          |
| Nudges feel spammy       | Show-once, contextually relevant only            |
| 50% yes rate unrealistic | Aspirational; any improvement from 3.7% is a win |
| Small samples skew A/B   | Full week minimum, require minimum N             |
