# DOC-573 - KB: Monorepo CI best practices

- Linear: https://linear.app/nxdev/issue/DOC-573/kb-monorepo-ci-best-practices
- Polygraph session: https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/vivid-moose-c9937bd5
- Worktree: `/Users/jack/projects/nx-worktrees/DOC-573` (branch `DOC-573`)
- New page: `astro-docs/src/content/docs/kb/monorepo-ci-best-practices.mdoc` -> `/docs/kb/monorepo-ci-best-practices`

## Goal

Beat Buildkite's #1 SERP result for "Monorepo CI best practices". Keywords: monorepo ci (10/mo),
monorepo ci/cd (50/mo), plus GitHub Actions / pipeline / best-practices variants. AI Overview on SERP.

Go deeper than Buildkite on: path filters vs graph-based affected, computation caching, task
distribution, e2e splitting, flaky retries. Answer "how do I detect which services need rebuild
after a merge".

## Competitor structure (Buildkite)

benefits -> challenges -> selective builds -> dependency management -> access/merge approvals ->
git perf (shallow/sparse) -> trunk-based dev -> merge queues -> product pitch.

Depth is shallow: says what, defers how. No caching-correctness discussion, no distribution
scheduling, no e2e splitting, no flaky handling.

## Our structure

Diagnostic spine instead of a flat list. Four sources of CI waste stated up front, each section
kills one.

1. Understand where the time goes before optimizing (the four sources)
2. Run only the projects a change affects (path filters vs graph, comparison table, `nx affected`)
3. Choose the right base commit (the "what to rebuild after a merge" answer; last *successful*
   commit, not `HEAD~1`; `nx-set-shas`; `fetch-depth: 0` + `filter: tree:0`; sparse checkout breaks
   the graph)
4. Cache task results, not just dependencies (computation cache, remote, input completeness)
5. Parallelize on one machine before adding machines (`--parallel`)
6. Distribute work across machines dynamically (static binning failure modes -> Nx Agents via
   `.nx/ci-config.yaml` + `start-nx-agents`, dynamic changesets, assignment rules)
7. Split slow suites so one task isn't the critical path (manual shards vs file-level atomizer)
8. Treat flaky tests as pipeline state
9. Keep the default branch green (trunk-based, merge queues, why affected+cache makes queues
   affordable, self-healing CI)
10. Let architecture and ownership limit the blast radius (module boundaries, CODEOWNERS)
11. Measure the pipeline, not the runners (p50/p95, cache hit rate, agent idle, flaky rate, cost/PR)
12. Set this up with Nx (single CTA)

Plus an `llm_copy_prompt` block at the top: agent audits the reader's pipeline against the page.

## Constraints applied

- New KB page -> no `sidebar.mts` entry, no netlify redirect needed.
- `topics: ['Continuous integration']` (must match `src/data/knowledge-base-topics.json`).
- Distribution shown as `.nx/ci-config.yaml` + `nx-cloud start-nx-agents` only, never `start-ci-run`
  (they are mutually exclusive; per merged PR #36417).
- 13 unique links, no duplicates, single get-started CTA.
- Commands in shell blocks, not inline prose.
- ASCII punctuation, no em dashes.

## Status — MERGED 2026-08-06

- PR https://github.com/nrwl/nx/pull/36593 merged as `7dd949e953`. Three files: the new page, the
  `nx.json` reference `pluginsConfig` section, and the STYLE_GUIDE additions.
- Split-out fix https://github.com/nrwl/nx/pull/36588 merged as `e056ef6320`.

## Resolved during review

- Nx placement: woven through each section rather than confined to a closing one. Superseded by a
  bigger call, that Nx CLI and Nx Cloud may now be named separately and features requiring Nx Cloud
  should say so. Replaces the DOC-549 "one platform Nx" rule.
- Overlap with `kb/ci-caching.mdoc` and `concepts/CI Concepts/*` handled by linking, not restating.
- Headings shortened throughout; "Dimension" table header became "Concern" with bold row labels.
- Dynamic agent allocation (changeset sizing) cut entirely, along with the word "fleet".
- Trunk-based development became its own section, placed before the main-branch section.
- The measurement/metrics section was cut; its content moved into the agent prompt's hand-off list.

## Agent prompt, live-tested

v1 asked for wall-clock time, queue time and serial-wait share. None are derivable from a
repository, and nothing in the prompt told the agent to decline, so it invited invented numbers.
Rewritten around `Present` / `Absent` / `Needs CI access`, keyed to the page's sections, with the
run-history metrics moved to an explicit list the agent asks the user for.

Both runs used a throwaway 10-package pnpm monorepo at `/tmp/test`. The first test was contaminated
(harness told the agent to decline unanswerable steps); the second was clean and still declined.

## Follow-up worth filing

The page has no contextual inbound links from other docs pages. `setup-ci`, `ci-caching`, the
affected feature page, and the CI features landing page are the natural candidates.
