# ci-observability qualitative verdict (GitHub / forums)

Test: does each term have >=3 independent evidence items (distinct issues/discussions,
created after 2025-08-06) where people use that vocabulary or describe that problem?

## Method and quality filter

Sources: `gh search issues` across nrwl/nx, nrwl/nx-console, vercel/turborepo, moonrepo/moon,
bazelbuild/bazel, actions/runner, actions/runner-images, actions/cache, gradle/gradle,
pytorch/pytorch, vllm-project/vllm, camunda/camunda, elastic/elasticsearch, apache/iceberg;
GraphQL discussion search over `community/community`; targeted web search of the GitHub
Community forum. ~70 distinct queries.

**Critical caveat that changed the scoring.** Unfiltered global GitHub issue search for these
terms is now dominated by AI-generated task tickets in one-person repos (`commitpulse`,
`Odyssey`, `heretek-swarm`, `vllm-ci-dashboard` bot posts, etc.). For "ci observability" and
"ci analytics", roughly 23 of 25 top hits were of this kind. Those are not demand signals - a
model wrote the phrase, not a practitioner. Every item counted below is from an established
project or a human-authored GitHub Community discussion. Applying no filter would have passed
all 17 terms and been worthless.

## Verdict table

| # | Term | Evidence count | Verdict | Note |
|---|------|----------------|---------|------|
| 1 | ci observability | 0 | **FAIL** | Zero hits in any tracked repo; all global hits are AI-authored tickets in personal repos. Nobody in this ecosystem writes this phrase. |
| 2 | ci analytics | 0 | **FAIL** | Same as above. The only recurring "CI analytics" text is one AI-slop repo and a bot posting daily reports. |
| 3 | ci metrics dashboard | 1 | **FAIL** | Only vllm #26110 uses it. The other candidates are the same GitHub-native-metrics signal counted under #9 - counting them here would be double-dipping. |
| 4 | ci build time trends | 3 | **PASS** (weak) | Real but thin: one high-engagement build-time regression thread (runner-images #13096, 26 comments) plus two small-repo feature requests for duration trend charts. |
| 5 | build observability platform | 4 (as "build observability") | **PASS** (retarget) | buck2, maven-support-and-care, tuist all use "build observability"/"build insights". The word **"platform"** appears in zero practitioner items - retarget the tracked term to `build observability`. |
| 6 | monorepo ci metrics | 0 | **FAIL** | Zero results, exact or loose, in any repo or the forum. Pure marketing coinage. |
| 7 | ci pipeline bottleneck | 1 | **FAIL** | Exact-phrase search returned 1 item in 12 months. "Bottleneck" in the forum resolves to LLM/RAG threads, not CI. |
| 8 | github actions slow workflow | 5+ | **PASS** | Strongest slowness term. Caveat: most of the volume is **queue/scheduling delay** (#196910 drift, #202066 3h delay), not build duration. Content that only addresses build speed will mismatch intent. |
| 9 | github actions job duration metrics | 3 | **PASS** | Anchored by community #191140, which asks verbatim for "average job duration, percentiles, trends" (12 upvotes). Plus #181231 Actions Metric API and #188189. This is one coherent demand signal: GitHub has no native CI metrics API and people keep asking. |
| 10 | github actions build time analytics | 0 net-new | **FAIL** | Same three items as #9, and none of them says "analytics". Merge into #9 rather than track separately. |
| 11 | github actions runner out of memory | 3 | **PASS** (weak) | Exact-phrase search returns 0 in-window. The problem is real but lives in **self-hosted / ARC** (actions-runner-controller #4436 OOMKilling, runner #4587, community #198986 "Show CPU and Memory utilization for Jobs"), not GitHub-hosted runners. |
| 12 | circleci build insights alternative | 0 | **FAIL** | "circleci alternative" returned 1 result in 12 months; "build insights" returns only unrelated product-dashboard tickets. No evidence anyone shops for a CircleCI Insights replacement on GitHub. |
| 13 | develocity build scan alternative | 3 (wrong intent) | **FAIL** | People are **evaluating and adopting** Develocity (iceberg "will Develocity speed up CI?", meshtastic, grails, kestra), not seeking an alternative to it. Retarget to `develocity build scan` / `does develocity speed up ci` if kept at all. |
| 14 | why is my ci slow | 3 (rephrased) | **PASS** (retarget) | The problem is real; the phrasing is not. Practitioners write "How can I speed up my GitHub Actions CI pipeline?" (#204070) and "will Develocity speed up CI?". Merge into #15. |
| 15 | ci caching | 6+ | **PASS** | Highest-frequency term in the cluster. Cache invalidation, isolation (#194493, 22 upvotes/18 comments), rate limits, and silent cache misses (turborepo #13430) all recur. |
| 16 | speed up ci | 4 | **PASS** | Both the beginner framing (#204070) and the engineering framing (vllm test-target determination, camunda gating expensive jobs, iceberg on Develocity). |
| 17 | ci compute cost | 8+ | **PASS** (strongest) | By far the highest engagement in the whole cluster: the Dec 2025 Actions pricing change drew 101 upvotes/64 comments (#182186) and 71 upvotes (#182089), with knock-on threads through mid-2026. camunda runs a recurring "Weekly CI Cost Impact Analysis". Cost is the live nerve, not observability. |

## Summary

- **PASS: 8** - ci build time trends, build observability platform (retarget), github actions
  slow workflow, github actions job duration metrics, github actions runner out of memory,
  why is my ci slow (retarget/merge), ci caching, speed up ci, ci compute cost.
  (9 rows marked PASS; #14 is a merge candidate into #16, so 8 distinct survivors.)
- **FAIL: 9** - ci observability, ci analytics, ci metrics dashboard, monorepo ci metrics,
  ci pipeline bottleneck, github actions build time analytics, circleci build insights
  alternative, develocity build scan alternative.

## The finding that matters

The abstract, vendor-shaped half of the cluster is dead. **"ci observability", "ci analytics",
"monorepo ci metrics", "build observability platform", "ci metrics dashboard"** are words
vendors use; practitioners do not write them anywhere on GitHub. Ahrefs having no record is
not a coverage gap - it is correct.

What practitioners actually write, in descending order of intensity: **cost** (pricing shock,
minutes, self-hosted charges), **caching** (invalidation, isolation, silent misses),
**speed** ("how do I speed up my CI pipeline"), and a specific, repeated, unmet ask for
**native job-duration metrics from GitHub** (`#191140`, `#181231`, `#188189`). That last one
is the only genuine "observability" demand in the dataset, and it is phrased as
*"average job duration, percentiles, trends"* - not as observability.

Recommendation: keep 8, cut 9, and rewrite the survivors to the cost/caching/speed vocabulary.
