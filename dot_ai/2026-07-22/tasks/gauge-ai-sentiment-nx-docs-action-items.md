# Gauge: AI Sentiment / Misinformation Action Items (nx.dev/docs)

**Date:** 2026-07-22
**Source:** Gauge session https://app.withgauge.com/nx/chat/bccedb11-41ef-4dc2-9269-e6e4c51e4e01
**Goal:** Address AI sentiment + misinformation problems for Nx (esp. nx.dev/docs). Collect raw Gauge notes, then produce prioritized (high/med/low) action items, each with a tracking method (positive/neutral/negative effect on goal).

## Constraints / Context

- **Tracking tools:** Gauge is primary tracker (re-query same prompts, watch drift). Side goal: this exercise decides whether to pay for Gauge. Ahrefs secondary. No direct GA/GSC access, but both integrated into Gauge + Ahrefs.
- **Scope:** nx.dev/docs primary, nx.dev/blog secondary. Skip homepage + marketing pages (graphic-heavy).

## Status

- [x] Task doc created
- [x] Raw notes collected (Entries 1-14)
- [x] Prioritized action list (high/med/low) — revised per Jack's review round 1
- [x] Tracking method per item
- [ ] Jack final sign-off

## Raw Notes (verbatim from Gauge session)

<!-- Each entry: Jack's prompt to Gauge + Gauge's response/recommendations. Appended as received. -->

### Entry 1 — Complexity vs Turborepo sentiment

**Jack's prompt:**

> What content are the highest impact to improve sentiments around Nx being viewed as more complicated than Turborepo, with a steeper learning curve? Also that users need to learn plugins and module boundaries, etc. We come with many features, but the core is just as simple as Turborepo.

**Gauge answer:**

> This page is actually already good — it does say onboarding is "zero-config or guided," and frames Nx's extra depth as opt-in power. But it's structured entirely as a feature-by-feature comparison table, which is exactly the format that gets skimmed by models into "Nx = more surface area = more complex." There's no standalone page making the specific counter-argument: **that the Nx core experience matches Turborepo's simplicity, and the advanced stuff (plugins, module boundaries) is opt-in, not required**.
>
> That gap is the highest-impact content opportunity. Here's the priority list:
>
> **1. "Getting started with Nx: the zero-config core" — a dedicated simplicity-first guide**
> This is the highest-impact piece. Every AI answer citing the complexity narrative treats Nx and Turborepo as fixed feature bundles. None frame Nx as a **minimal core with opt-in power**. A standalone guide showing `nx init` -> run tasks -> cache, with zero mention of plugins/generators/module boundaries until the very end, gives models a citable source for "Nx's basic workflow is just as simple as Turborepo." This directly rebuts the "steeper learning curve" framing at its root.
>
> **2. "Do you need Nx plugins and module boundaries? A decision guide"**
> Directly answers the "overkill for small teams" objection. Frame plugins and module boundaries as things you turn on when you hit a specific pain point (a large team, cross-team import violations, polyglot repo), not day-one requirements. This reframes "you need to learn X" into "X is there when you need it, skip it otherwise."
>
> **3. Refresh the existing Nx vs Turborepo comparison page's structure**
> It already has the right facts ("Both tools are easy to set up," zero-config `nx init`), but the giant feature-table format is what gets extracted into "Nx has more surface area." Add a prominent "Quick start: both take 2 minutes" section up top, before the deep comparison table, so models pull the simplicity framing first rather than the exhaustive feature list.
>
> **4. A "time to first cached build" benchmark/tutorial piece**
> Sentiment data shows the learning-curve claim is about setup effort, not runtime behavior. A short, timed walkthrough (stopwatch-style: "0:00 nx init, 1:40 first cached build") for both tools side by side gives models a concrete, quotable data point to counter the vague "steeper learning curve" line — numbers beat adjectives in what gets extracted.

### Entry 2 — Measuring impact of changes (e.g. Turborepo page refresh)

**Jack's prompt:**

> How can I track where changes, like (3) refresh turbo page has any impact after the change? Or worse, maybe AI now is presenting even more negative sentiments or misinformation?

**Gauge answer:**

> Interesting — this "Competitor Comparisons" topic doesn't actually target Turborepo directly (it's Lerna/Bazel/Rush Stack). The Turborepo citations are likely coming from the broader visibility topics (Build System Optimization, Monorepo Architecture Governance, etc.) where Turborepo comes up as a natural alternative. That's fine — it confirms the tracking needs to span multiple topics, not one narrow prompt set.
>
> Here's the concrete measurement plan:
>
> **1. Citation rate on the specific URL — the leading indicator**
> Baseline today: `/docs/guides/adopting-nx/nx-vs-turborepo` sits at **8.6%** citation rate (up from 7.85% -> 9.82% recently). After publishing, re-run the same page lookup (https://app.withgauge.com/nx/monorepo-development-tools/citations) filtered to `nx.dev` weekly. Watch for:
>
> - Citation rate climbing further (content getting pulled more).
> - **Also resolve the duplicate-URL issue first** — `/docs/guides/comparisons/nx-vs-turborepo` is a second live URL already climbing fast (0% -> 12.4%). If both exist, citations may be splitting or one may be stale/redirected. Worth checking before you attribute any post-refresh change.
>
> **2. Sentiment on the same prompt set — the actual thing you're worried about**
> This is the "is it now worse" check. Pull a fresh `ask_sentiment_analyst` read scoped to the same complexity/learning-curve question, 2-3 weeks after publishing, and diff it against today's baseline (steeper learning curve / overkill for small teams / plugin setup burden — the three themes surfaced above). If new negative language shows up that wasn't there before, that's the misinformation-risk signal.
>
> **3. Spot-check actual answer text for factual drift**
> Since AI models paraphrase rather than quote, use `get_answer` on a handful of answers from the topics above (Build System Optimization, Monorepo Architecture Governance) before and after, specifically wherever nx.dev is cited. This catches if a model misreads a restructured page and invents a wrong claim — something aggregate metrics won't show but individual answer text will.
>
> **4. Visibility on the branded comparison prompts as a lagging check**
> The Competitor Comparisons topic (https://app.withgauge.com/nx/monorepo-development-tools/topics/competitor-comparisons) is already at 76% visibility, so it's a stable baseline. Not the primary signal since the refresh targets sentiment/framing more than raw mention rate, but worth a monthly glance for regressions.
>
> **Suggested cadence:** re-check citation rate weekly for 4 weeks, run the sentiment diff at the 2-3 week mark, and spot-check answers whenever the citation rate moves more than a couple points either direction.
>
> Offered: add follow-up check w/ due date to Gauge Action Center.

### Entry 3 — Gauge Action Center (screenshot observations)

Action Center = built-in task tracker + automated evaluation, centered on AI citations. Lifecycle: Proposed by Gauge -> Completed -> Evaluated, with pass/FAILURE verdict per action.

Example action observed: "Write content: Create monorepo CI/CD best practices guide for Nx" (proposed 2026-06-25, completed 06-26, evaluated 06-29) -> **FAILURE**:

- Expected to improve: CITATION RATE (projected +5% lift for CI/CD Pipeline Design topic)
- Reasoning: guide was never actually published — action's linked_outputs empty, site:nx.dev web search found no new guide, no new nx.dev URL in post-completion citation rankings. Overall nx.dev citation rate moved 19.62% -> 18.96% (-0.66%), opposite of projection.
- Metrics eval (topic cicd-pipeline-design, all models): avg citation rate before 18.41% -> after 14.93% (**-3.48%**), with citation-rate-over-time chart marking completion date.
- Findings: 0 of 2 criteria met. (1) New guide published on nx.dev — not found. (2) AI answers for CI/CD prompts cite a new Nx-owned guide — sampled ChatGPT answer (2026-06-26) still cites `/docs/guides/adopting-nx/nx-vs-turborepo`.
- Produced content exists ("CI/CD for Monorepos: A Practical Guide" ARTICLE) but never shipped — Gauge drafted it, publish step fell through.
- UI features: Dig Deeper, Re-Evaluate, Slice By Topic/Model, Plan Next Steps. Sidebar modules: Ranking, Dashboard, Sentiment, AI Traffic, Prompts, Citations, ChatGPT Ads, Reddit, YouTube.
- Currently on trial ("Activate Subscription" button visible).

Implication: Gauge can serve as the per-action tracking mechanism (define expected metric + criteria, auto-evaluate before/after with timeline). Caveat from this example: evaluation window was only ~3 days post-completion — too short for content indexing; and unpublished drafts get scored as failures against topic-level noise.

### Entry 4 — Auto-generated action: build system ROI guide (screenshot + notes)

**Gauge auto-generated action:**

> Working on: Create build system ROI guide to win Build System Optimization citations
>
> nx.dev's citation rate in Build System Optimization (18.6%) trails sourcegraph.com (42%) and aviator.co (37.4%) by a wide margin, and prompts around ROI justification and cost show Nx visibility at only 41.7%. A standalone guide making the ROI case for monorepo build system investment would fill this gap.

**Jack's note:** could use KB (Knowledge Base) articles on nx.dev docs to show ROI / why users need Nx.

Screenshot details (Gauge content-generation flow for this action):

- Draft article: "The ROI of a Modern Monorepo Build System: How to Justify the Cost to Leadership" — freeform article, slug `/monorepo-build-system-roi`, tracked in Action Center as Write content.
- Summary of planned content: business-case guide for engineering leaders justifying paid monorepo build platform. Compounding cost of naive builds at scale (eng time + CI compute); concrete ROI example (200 packages, 50 engineers, 45-min builds); four ROI levers (local caching, remote caching, affected task detection, distributed task execution); Bazel vs Turborepo vs Nx trade-offs; "how to pitch to leadership" w/ cost-savings formula. Positions Nx + Nx Cloud as Google-scale build intelligence for JS/TS without Bazel complexity. Targets CFO-justification, ROI, Google-build-system-alternative, build-speed-comparison queries.
- Pipeline stages: Brief (done) -> Research -> Outline -> Article. Gauge said external research unneeded; ROI math + comparison table fill in at outline/write.
- Trial quota: 2/18 articles generated, resets Jul 23 2026. Gauge has persistent memory across chats.

### Entry 5 — Nx Cloud platform competitors (Blacksmith, Depot, Buildkite)

**Jack's prompt:**

> Where are we losing to competitors of Nx Cloud, like Blacksmith, Depot, Buildkite, etc. Not just Nx CLI, but the platform.

**Gauge answer (flagged portion):**

> One more thing worth flagging: Blacksmith and Depot aren't tracked as competitor brands in Gauge yet, so there's no visibility/citation data on them specifically — only Buildkite and CircleCI are in the tracked set right now. If runner-speed competitors matter to the platform story, worth adding them so future tracking catches this gap directly.

Gap: Gauge competitor set covers CI incumbents (Buildkite, CircleCI) but not runner-speed challengers (Blacksmith, Depot). Action candidate: add them to tracked brands so platform-side losses become measurable.

### Entry 6 — Gauge brief: Nx Cloud vs CI platforms (Buildkite/CircleCI) comparison

**Jack's direction:** don't write NEW content from this brief — fold suggestions into EXISTING comparison pages.

**Gauge brief (verbatim):**

> This is a head-to-head comparison page built to break a specific framing problem: buyers and AI models alike keep treating "which build tool" (Nx, Turborepo, Bazel) and "which CI platform" (Buildkite, CircleCI, GitHub Actions) as two separate, unrelated decisions, with Nx Cloud getting mentioned only as a remote-caching add-on bolted onto whatever CI platform a team already picked.
>
> The page's job is to collapse that false separation for monorepo workloads specifically. The core argument is that once affected-project detection, distributed task execution, and remote caching are in place, most of what a heavyweight CI platform like Buildkite or CircleCI is doing (agent orchestration, parallelization logic, queue management) is redundant work Nx Cloud already does natively, at the task level rather than the job level. Buildkite and CircleCI still run the pipeline, but for monorepos the actual bottleneck and cost driver is which tasks run and how they're distributed, not which platform triggers them. That is Nx Cloud's job, and it is CI-platform agnostic (works on top of GitHub Actions, GitLab CI, Buildkite, or CircleCI itself).
>
> Open by naming the framing problem directly: teams are told to pick a build tool and separately pick a CI platform, and that split understates what Nx Cloud does. Then define terms plainly: task distribution vs. job/agent orchestration, affected-project detection vs. full pipeline re-runs, remote caching vs. artifact caching. Make the case with concrete mechanics, not adjectives: how Nx Cloud's distributed task execution reduces wall-clock CI time on monorepo builds, how affected detection cuts redundant work at the PR level, and how this changes the cost equation compared to paying for more Buildkite/CircleCI compute-minutes or self-hosted agents to brute-force the same problem.
>
> Include the comparison table specified: task distribution model, caching approach, pricing model, setup complexity, and language/ecosystem support, scoped to Buildkite and CircleCI specifically (both is important, since Buildkite is self-hosted-agent-oriented and CircleCI is more turnkey SaaS, and Nx Cloud's pitch differs slightly against each). Be editorially honest: Buildkite and CircleCI are real CI platforms with mature agent orchestration, security, and compliance tooling that Nx Cloud does not replace wholesale for non-monorepo or polyglot-heavy workloads; the claim is narrower and stronger than "replace your CI platform" — it's "stop paying CI platform prices to solve a task-distribution problem."
>
> Close with clear guidance on when to keep Buildkite/CircleCI as the trigger/orchestration layer and run Nx Cloud on top (the common case), versus when Nx Cloud's own CI integration reduces the need for a separate heavyweight platform. Target reader: SRE and platform engineering leads evaluating CI spend and pipeline speed for a JS/TS-centric monorepo, who are currently being pointed to Buildkite or CircleCI as if that were the whole answer.

### Entry 7 — Existing content idea: monorepo CI/CD best practices KB article (same action as Entry 3)

Confirms Entry 3's FAILURE root cause: no action taken on our side — guide never published. Content idea itself stands: standalone monorepo CI/CD best practices guide (KB article) on nx.dev, projected +5% citation lift for CI/CD Pipeline Design topic.

Findings detail (0 of 2 criteria met):

1. **New monorepo CI/CD best practices guide published on nx.dev** — FAIL. Evidence: action linked_outputs empty (no artifact/URL recorded); `site:nx.dev monorepo CI/CD best practices` web search found no new guide (top results = existing docs pages); no new nx.dev URL in post-completion CI/CD topic citation rankings.
2. **AI answers for CI/CD prompts cite a new Nx-owned guide** — FAIL. Sampled post-completion answers for "Best monorepo CI/CD tools" still cite `/docs/guides/adopting-nx/nx-vs-turborepo`. ChatGPT answer 2026-06-26 cites that page, no new guide.

Baseline for CI/CD Pipeline Design topic: nx.dev overall citation moved 19.62% -> 18.96% over eval window (noise, since nothing shipped). AI answers currently lean on the nx-vs-turborepo page for CI/CD prompts — a topic mismatch worth fixing with dedicated content.

### Entry 8 — Gauge-generated draft: "CI/CD for Monorepos: A Practical Guide"

**Jack's note:** needs review + lots of adjustments, but good starting point. (This is the unpublished artifact from Entry 3/7's failed action.)

**Draft (verbatim):**

> ## TL;DR
>
> - Naive CI builds and tests everything on every change, which wrecks build times, hides dependency relationships, and floods you with noisy failures.
> - Five practices fix it: affected builds, remote caching, distributed task execution, pipeline parallelization, and merge queues.
> - Graph-aware affected detection beats path filtering, and distributed remote caching beats local agent caching.
> - Most tools cover one or two of these. Nx Cloud combines all five in one platform.
>
> ## Why Monorepo CI/CD Is Harder Than It Looks
>
> Standard CI assumes one project per repository, so it builds and tests everything on every commit. A monorepo holds dozens or hundreds of projects in one tree, and the "build everything, always" model breaks down in three distinct ways.
>
> Build times explode because the work scales with the size of the repository, not the size of the change. A one-line fix to a single library triggers a full rebuild and test run across every project, so a developer waits twenty minutes to validate a typo correction. The cost grows every time someone adds a new package, and it never comes back down.
>
> Dependency graphs go opaque because CI has no model of what actually depends on what. When a developer changes a shared utility, the pipeline either rebuilds everything to stay safe or guesses with file-path rules that miss projects two or three hops downstream. Both options fail. One wastes hours, and the other ships a broken transitive dependent.
>
> Pipelines turn noisy because a single push fans out into hundreds of jobs, and one flaky test buries the real failure. Reviewers stop reading the status checks, and a red build stops meaning anything. The signal that CI exists to provide gets lost in volume.
>
> Each problem has its own cause, so each needs its own fix. The five practices below address them directly.
>
> ## Affected Builds: Build Only What Changed
>
> An affected build runs only the projects touched by a change, and the smart version of it works by traversing your dependency graph rather than matching file paths. When you edit a file, a graph-aware tool starts at that file and walks upstream to find every project that depends on it, directly or transitively. A shared utility library might feed forty applications. Change one function in it, and the graph tells you exactly which forty need to rebuild and retest.
>
> Path-based filtering, the kind GitHub Actions offers through its `paths` trigger, asks a simpler question. It checks whether a changed file matches a glob pattern, then runs the jobs you wired to that pattern. The filter knows nothing about what imports what. You define the relationships by hand in YAML, and you keep them current as the codebase moves.
>
> The distinction matters for correctness, not just speed. Path filters miss transitive dependents. If `app-a` imports `lib-x`, and `lib-x` imports `lib-y`, a change to `lib-y` should trigger `app-a`. A path filter scoped to `lib-y/**` will never know `app-a` exists unless you encoded that chain yourself, which means a broken build can land on a green checkmark. The filter did its job. The job was wrong.
>
> Graph-aware affected detection avoids that failure because the dependency graph is computed from your actual imports and project boundaries, not declared in a config file someone forgets to update. Tools like [Nx](https://nx.dev) and Turborepo build this graph automatically and expose it to your CI. You get the speedup of skipping untouched projects, and you get it without the silent gaps that make path filtering risky at scale.
>
> ## Remote Caching: Share Build Artifacts Across Every Machine
>
> A remote cache stores the output of every task in a shared store that every machine on your team can read and write. Most CI setups confuse this with the artifact cache that lives on a single build agent. The distinction decides whether work computed once gets reused everywhere or recomputed from scratch on every agent that touches the same code.
>
> Each task in a monorepo produces a deterministic output for a given set of inputs. A cache key, sometimes called an input hash, captures those inputs. The hash covers the source files of the project, the source of every project it depends on, the relevant configuration, and the version of the tool running the task. When two runs produce the same hash, they produce the same output, so the second run can pull the result from the cache instead of executing the task.
>
> Without a shared store, that reuse stops at the boundary of a single machine. A developer builds a library locally and caches the result on their laptop. The CI agent that picks up the pull request has never seen that output, so it rebuilds the library. The next agent in the pipeline rebuilds it again. Across a busy repository, your fleet burns hours recomputing identical work because no agent can see what another already finished.
>
> A remote cache closes that gap by making the store team-wide. When CI builds a project on one branch, every later run that shares the same inputs reads the result instead of rerunning the task. [Nx Cloud](https://nx.dev) ties this to the same input-hash model that drives affected detection, so cache hits compound as more of your team and pipeline reuse the same artifacts.
>
> ## Distributed Task Execution: Parallelize Across Agents Intelligently
>
> Distributed task execution assigns each task to an agent based on where it sits in the dependency graph, so the scheduler knows which tasks can run now and which must wait for their dependencies to finish. A naive parallel setup splits tasks evenly across machines and ignores the relationships between them. Graph-aware scheduling reads the same dependency graph that drives affected detection, then dispatches tasks the moment their inputs are ready.
>
> The difference shows up when you compare it to spinning up more agents and hoping throughput improves. Add ten agents to a pipeline that doesn't understand task order, and several of them sit idle waiting on an upstream build that hasn't finished, while two others race to compile the same shared library because nobody told them it was already done. You pay for the extra agents and get a fraction of the speedup the raw core count promises.
>
> A graph-aware orchestrator prevents both failures. It serializes tasks that depend on each other and runs independent ones in parallel, so an agent never waits on work that could have started earlier and never repeats work another agent already finished. When a downstream test needs a library build, the scheduler holds that test until the build lands on an agent, then hands the test the cached output instead of rebuilding from scratch.
>
> Distributed task execution pairs naturally with remote caching, because the cache lets any agent reuse a result computed elsewhere in the run. The orchestrator decides which agent does what, and the cache makes sure no result is computed twice. [Nx Cloud](https://nx.dev) builds both into one layer, which is why its distribution scales close to linearly as you add agents rather than flattening out.
>
> ## Pipeline Parallelization and Fan-Out Strategies
>
> Distributed task execution decides which tasks run where, but you still need to split individual tasks across agents to use those machines fully. Matrix builds are the most common pattern. You define a set of variables, such as Node versions or browser targets, and your CI provider fans out one job per combination. GitHub Actions, CircleCI, and Buildkite all support matrices natively, and they work well for testing a single project against many environments.
>
> Splitting test suites attacks a different bottleneck. A single project with a thousand tests runs serially on one agent unless you shard it. Most runners can divide tests into balanced groups by historical timing, so eight agents each run an eighth of the suite and finish in roughly an eighth of the time. Pair this with DTE rather than treating it as a replacement, because DTE distributes whole tasks across the graph while sharding parallelizes the work inside one slow task.
>
> Resource-aware concurrency limits keep this fan-out from overwhelming shared infrastructure. Set a cap on simultaneous jobs so a hundred-way matrix does not starve every other pipeline of agents.
>
> Per-agent setup time often dwarfs the actual work once you have many agents. Shallow clones fetch only recent history, and sparse checkouts pull only the directories an agent needs. Both cut clone time on large monorepos, which matters more the more agents you run.
>
> ## Merge Queues: Keep Main Green at Scale
>
> Optimistic merging assumes a PR that passes CI against the current main will still pass after it lands, and that assumption fails as soon as two PRs touch overlapping parts of a monorepo. Each PR validates against the main it branched from, not the main it actually merges into. Two changes that each pass alone can break the build once both land, and you discover the failure on a now-red main that blocks everyone.
>
> A merge queue closes that window. It serializes pending PRs and validates each one against the projected future state of main, with the changes ahead of it in the queue already applied. A PR only lands once it passes that combined check, so main stays green by construction. GitHub and GitLab both ship native merge queues, and Aviator adds smarter batching and prioritization for high-throughput teams.
>
> Queue validation should run on affected projects, not the whole graph. Revalidating every project for every queued PR reintroduces the build-time problem the queue was meant to contain. Compute the affected set for each candidate against its projected base, and run only those tasks. That keeps the queue fast enough to stay short, which is the only way it actually protects main at scale.
>
> ## Approaches and Tools Compared
>
> Each tool covers a different slice of the five practices, so picking one means knowing which gaps you'll fill with glue code. Nx and Turborepo operate at the task-graph layer, while GitHub Actions, Buildkite, and CircleCI provide the execution infrastructure those graphs run on. The table below maps each tool against the capabilities discussed above.
>
> | Capability                     | Nx                          | Turborepo            | GitHub Actions             | Buildkite                    | CircleCI                    |
> | ------------------------------ | --------------------------- | -------------------- | -------------------------- | ---------------------------- | --------------------------- |
> | Graph-aware affected detection | Yes: true dependency graph  | Yes: task graph      | Partial: path filters only | Partial: path/branch filters | Partial: path filters only  |
> | Distributed remote caching     | Yes: Nx Cloud, shared       | Yes: Remote Cache    | No: local artifact cache   | No: agent-local cache        | Partial: layer/dep cache    |
> | Distributed task execution     | Yes: Nx Agents, graph-aware | No                   | No: matrix only            | Partial: manual fan-out      | Partial: parallelism splits |
> | Merge queue support            | Partial: via CI host        | Partial: via CI host | Yes: native                | Partial: third-party         | Partial: third-party        |
> | Ecosystem fit                  | JS/TS, polyglot             | JS/TS focused        | Any, GitHub-native         | Any, self-hosted             | Any, cloud-hosted           |
>
> The execution platforms handle merge queues and raw parallelism well, and they leave graph-aware affected detection, distributed caching, and intelligent task distribution to a separate layer. Pairing a task runner like Nx or Turborepo with a CI host like GitHub Actions covers the full set, at the cost of integrating two systems.
>
> ## Putting It Together with Nx Cloud
>
> Most teams reach the five practices in this guide piece by piece. You add path filtering, then bolt on a caching layer, then write scheduling logic to spread tasks across agents, and each layer needs its own configuration and its own failure modes. [Nx Cloud](https://nx.dev) collapses that work into one platform, because it already understands your dependency graph and uses the same graph for affected detection, remote caching, and distributed task execution.
>
> The integration argument carries the weight here. Nx computes which projects are affected by traversing the graph, hashes each task's inputs to decide cache hits, and distributes the remaining tasks across agents based on that same graph. You configure the graph once, and all three capabilities draw from it. Stitching GitHub Actions filters, a separate cache backend, and a custom sharding script gives you the same outcomes with three sources of drift to maintain.
>
> Nx Cloud fits teams running JavaScript and TypeScript monorepos who want these capabilities working together rather than assembled by hand. If you already run Bazel or have a Buildkite setup tuned to your infrastructure, the migration cost may not pay off. For teams starting from npm or yarn workspaces and feeling the build-time pain, the consolidated path is usually faster to stand up.
>
> Compare it against the table above, then [try it on your own repo](https://nx.dev).
>
> ## Conclusion
>
> Exploding build times, opaque dependency graphs, and noisy pipelines all trace back to one bad assumption that CI must rebuild and retest everything on every change. Affected builds, remote caching, distributed execution, parallelization, and merge queues each replace that assumption with something the monorepo can actually scale on. The teams that mature fastest stop treating CI as a fixed cost and start treating it as a graph problem worth solving.

(Note: original draft table used emoji ✅/⚠️/❌; transcribed as Yes/Partial/No per ASCII-in-committed-markdown rule.)

### Entry 9 — Gauge answer-level citation view (Bazel-migration prompt, screenshot)

**Jack's note (for Gauge eval):** citation view across queries is useful — e.g. Bazel-to-Nx migration prompt shows our new comparison pages already being cited.

Screenshot details:

- Prompt (Competitor Comparisons topic, BRANDED, answered 2026-07-22): "We're migrating from Bazel to a more developer-friendly monorepo tool. Nx is on our list... 50-engineer organization. How does Nx compare to alternatives for ease of adoption and maintenance costs?"
- Visibility: 90.7% avg (30d), 100% current. Per-model tabs: ChatGPT, Google AI Overview, Gemini, Perplexity, Microsoft Copilot, Google AI Mode.
- Mentions + sentiment in this answer: Nx POSITIVE, Bazel NEGATIVE, Turborepo POSITIVE, Moon NEUTRAL, Rush NEUTRAL (+6 incidental).
- ChatGPT answer substance: recommends Nx for growing repo wanting one platform (task running, generators, CI optimization, arch governance); Turborepo for straightforward JS/TS. Maintenance-cost stars: Turborepo lowest, moonrepo 2, Nx 2-3 ("more features, but many replace custom tooling"), Rush 3, Bazel 5. Nuance: Nx maintenance often offset by eliminating homegrown scripts — possibly LESS total operational burden.
- Citations include 5+ nx.dev pages: Nx vs Bazel, Migrating from Turborepo to Nx, Nx vs Turborepo (x4). Third-party: trybuildpilot.com, monorepovspolyrepo.com, monorepo.tools/compare, moonrepo.dev, daily.dev, codeables.dev, digitalapplied.com, and a Reddit thread `r/node "how_nx_pulled_the_rug_on_us_a_potent..."` (negative-sentiment source in the citation mix).
- ChatGPT answer carried a sponsored Greptile ad inline (Gauge tracks ads too).

Takeaways: (a) answer-level drill-down = per-URL citation attribution across models — strong Gauge eval point; (b) DOC-549-era comparison pages already pulling citations; (c) the rug-pull Reddit thread circulating in citations = misinformation/negative source to counter or monitor.

### Entry 10 — Competitor Comparisons prompt set: Rush Stack + Lerna gaps (screenshot)

**Jack's takeaway:** need comparison pages for Rush Stack and Lerna.

Screenshot: Competitor Comparisons topic, 25 branded prompts, columns = Nx visibility (avg 30d / current) + Turborepo visibility (avg / current). Prompt mix is heavy on Lerna (~7 prompts) and Rush Stack (~6 prompts) — the two competitors with NO dedicated nx.dev comparison page.

Sample rows (Nx avg/current vs Turborepo avg/current):

- "Migrating from Lerna to faster tool. Is Nx better than Rush Stack for 50+ projects?" — 86.8/100 vs 37.7/60
- "Nx vs Rush Stack: dependency mapping, Google-like build system" — 86.8/66.7 vs 30.2/16.7
- "Compare Nx and Rush Stack for enterprise monorepos" — 64.8/83.3 vs 24.1/16.7
- "Nx compared to Rush Stack for CI/CD" — 72.2/66.7 vs 7.4/0.0
- "How does Nx compare to Rush Stack for CI/CD pipelines" — 90.7/100 vs 16.7/0.0
- "Nx vs Lerna for monorepo build tools" — 87.0/100 vs 46.3/50
- "Nx vs Lerna build speed" — 79.6/83.3 vs 53.7/50
- "Switching from Lerna to Nx: migration path, dep mgmt, build speed, task distribution" — 83.3/66.7 vs 16.7/16.7
- "Nx vs Bazel microservices, hundreds of projects" — 68.5/50 vs 25.9/0.0
- "Is Nx better than Bazel for scaling development teams" — 66.7/50 vs 24.1/0.0
- "Best Nx alternative for managing large codebases" — 51.9/33.3 vs 38.9/33.3 (weakest Nx row)

Observations: Nx visibility already decent-to-strong on most of these (66-100%), Turborepo much lower — but visibility is not citation ownership; without our own Lerna/Rush Stack pages, answers source from third parties (trybuildpilot, monorepovspolyrepo.com, etc. per Entry 9). Weakest rows: "Best Nx alternative" (51.9%) and Bazel-scaling prompts (~66%).

Context link: DOC-549 had an nx-vs-lerna page DRAFTED but SHELVED for positioning rethink (draft in `dot_ai/2026-07-11/tasks/`). This data = case to revive it. Rush Stack page would be net-new.

### Entry 11 — 30-day SEO + AI SEO overview, page-level citation breakdown

**Jack's prompt 1:** Analyze my SEO data and AI SEO performance data. Provide an overview of the most important changes over the last 30 days.

**Gauge answer 1:**

> **What's likely driving the SEO dip:** the Nx Console incident postmortem was a temporary traffic spike from last period (support/troubleshooting search demand) that naturally decayed — not a ranking loss for core pages. Head terms like "nx", "nx monorepo", and "nx cloud" held steady or grew impressions, so the core organic base looks stable.
>
> **What's driving the AI citation gain:** nx.dev's own citation rate improved noticeably, meaning AI models are pulling directly from Nx's own docs/pages more often rather than third-party sources like Medium or Reddit. Worth digging into which specific nx.dev pages are behind that jump if useful.

**Jack's prompt 2:** yes, let's pull the page level breakdown

**Gauge answer 2:**

> ## Comparison pages are the whole story
>
> The nx.dev citation gain is concentrated almost entirely in **new "Nx vs X" comparison pages** — several went from zero citations to meaningfully cited within the period:
>
> | Page                                                    | Citation rate now | Change         |
> | ------------------------------------------------------- | ----------------- | -------------- |
> | Nx vs Turborepo (`/comparisons/nx-vs-turborepo`)        | 12.4%             | +12.4pts (new) |
> | Nx vs Bazel (`/comparisons/nx-vs-bazel`)                | 8.8%              | +8.8pts (new)  |
> | Nx vs Depot (`/comparisons/nx-vs-depot`)                | 3.5%              | +3.5pts (new)  |
> | What is Nx? (`/getting-started/intro`)                  | 3.5%              | +2.9pts        |
> | Nx vs Turborepo (older, `/adopting-nx/nx-vs-turborepo`) | 9.8%              | +2.0pts        |
>
> That's two things happening at once:
>
> 1. **A newer `/docs/guides/comparisons/` cluster launched** (Nx vs Turborepo, Nx vs Bazel, Nx vs Depot) and immediately started getting cited — these didn't exist in the prior period at all.
> 2. There's now **duplicate "Nx vs Turborepo" content** at two URLs (`/guides/comparisons/nx-vs-turborepo` and `/guides/adopting-nx/nx-vs-turborepo`), both getting cited independently.
>
> **Why this matters:** comparison/listicle-style pages are exactly the format AI models pull from most readily for "vs" and evaluation-style prompts. This cluster is now nx.dev's strongest citation driver, ahead of legacy docs pages.
>
> **One flag worth resolving:** having two live Nx-vs-Turborepo pages splits authority and could confuse AI models on which is canonical. Worth checking whether one should redirect/canonicalize to the other, or whether they're intentionally differentiated (e.g., migration-guide angle vs. feature comparison angle).
>
> Offered follow-ups: per-model citation detail on comparison prompts; cannibalization check between the two Turborepo URLs.

Takeaways: comparison cluster = proven highest-leverage format (0 -> cited within weeks); duplicate nx-vs-turborepo URL issue now confirmed twice (Entry 2 + here) — canonicalize/redirect decision is a concrete action item; SEO dip explained as postmortem-traffic decay, core head terms stable.

### Entry 12 — Weak unbranded prompts (screenshot)

**Jack's prompt:**

> What unbranded queries and prompts are in my category? Especially ones that don't perform well in.

**Gauge answer:**

Category has ~180 unbranded prompts across 5 topics (Migration Planning, Architecture Governance, CI/CD Pipeline Design, Build System Optimization, Dependency Management). Overall visibility decent (58-71% by topic), but clear weak spots.

Worst-performing unbranded prompts (Nx visibility):

| Prompt                                                                     | Topic                     | Visibility |
| -------------------------------------------------------------------------- | ------------------------- | ---------- |
| "Best CI/CD platforms for large codebases"                                 | CI/CD Pipeline Design     | 14.8%      |
| "Build me a list of Google Build System alternatives"                      | Build System Optimization | 14.8%      |
| "Build me a list of monorepo CI/CD providers"                              | CI/CD Pipeline Design     | 37.0%      |
| "Cheapest monorepo CI/CD platforms for startups"                           | CI/CD Pipeline Design     | 33.3%      |
| "Build caching tools for large repositories"                               | Build System Optimization | 35.9%      |
| "Our engineering org is evaluating build system optimization solutions..." | Build System Optimization | 33.3%      |
| "Top continuous integration platforms for monorepos"                       | CI/CD Pipeline Design     | 40.7%      |
| "Best monorepo CI/CD platforms"                                            | CI/CD Pipeline Design     | 40.7%      |
| "Which CI/CD platforms work best for monorepos"                            | CI/CD Pipeline Design     | 40.7%      |
| "Google build system alternatives for monorepos"                           | Build System Optimization | 42.6%      |

**Pattern — two distinct failure modes:**

1. **"Google build system" framing kills visibility** — prompts referencing Google's internal build system (Bazel's home turf) sit at 14.8-42.6%. Nx not surfaced when frame is "Google-style" build systems.
2. **Generic short-tail "best/top platforms" queries underperform** vs longer scenario-based prompts. "Best monorepo CI/CD platforms" (40.7%) vs "Best monorepo CI/CD tools" (74.1%) — nearly identical phrasing, huge gap. Cost-framed queries ("cheapest", "cost per build") consistently lag (33-48%) — CircleCI/Buildkite dominate pricing narrative.

Domain analysis: for these low-visibility prompts, third-party discussion sites (Reddit, YouTube, Medium, GitHub) dominate citations rather than vendor docs; **Buildkite winning branded citation share (19.9%, up sharply)**. Cost/pricing-framed + "Google-style build system" queries push models toward community forums and competitor pricing pages instead of Nx content.

**Bottom line (Gauge):** underperforming unbranded prompts cluster around two angles — pricing/cost comparisons and "Google-style build system" framing. Suggested content play: cost-of-ownership page + Bazel-alternative comparison page. Offered to draft briefs for both.

### Entry 13 — Malware incidents: no AI sentiment damage (concern invalidated)

**Jack's note:** Gauge also good for invalidating concerns.

**Jack's prompt:**

> Has there been any negative sentiments towards Nx due to malware? Like the august 2025 incident and the recent nx console one. Anyone moving off or not choosing Nx due to those?

**Gauge answer:**

> **No meaningful negative sentiment traced to the malware incidents.** Across the tracked answer set, the August 2025 "s1ngularity" npm compromise showed up in exactly **one** answer out of ~2,164 scanned — and even there, it was just a buried citation link, not something the model actually discussed or weighed into its response.
>
> **Zero switching/distrust narrative.**
>
> - Negative Nx sentiment that _does_ exist is about other things entirely: opinionated complexity for small teams, weaker non-JS plugin support, Nx Cloud pricing/licensing changes, and scale limits for very large orgs.
> - No answers reference "malware," "supply chain," "compromised package," "s1ngularity," "breach," or an "nx console" incident as a reason to avoid or leave Nx.
> - The one answer citing a Hacker News article on the breach (https://app.withgauge.com/nx/monorepo-development-tools/prompts/581281/overview) stayed entirely focused on CI/CD features — the model didn't editorialize on security at all.
>
> **Read on this:** the incidents simply aren't part of the vocabulary AI models use when discussing Nx right now in the prompts being tracked. That could change if new coverage cycles through search indexes, so worth a periodic recheck — but as of today, there's no detectable dent in AI-driven brand perception from either incident.
>
> Offered: recurring tracked prompt around Nx security/trust for automatic monitoring.

Takeaways: (a) malware incidents = non-issue in AI answers today (1/~2164 answers, citation-only) — no content action needed, just periodic monitoring; (b) canonical negative-sentiment themes confirmed: complexity for small teams, weaker non-JS plugin support, Nx Cloud pricing/licensing changes, scale limits for very large orgs — these are the real targets; (c) low-cost action: add tracked security/trust prompt in Gauge as early-warning.

### Entry 14 — Content gap analysis vs competitors (built-in prompt, screenshot)

**Jack's prompt (Gauge built-in):**

> Analyze my existing content topics and my competitors' content. Identify content gaps — topics that my competitors cover but I have not written about yet — and suggest what I should write next to maximize my citation rate. Focus on content that is cited well but where I have not written a competitive piece yet.

**Gauge analysis:**

Core gap: **nobody owns a neutral "monorepo tools compared" page**. `monorepo.tools/compare` cited in **21%** of Build System Optimization answers — bare comparison matrix, no prose, no brand-first framing. Nx has nothing in this format. Closest owned pages are one-to-one battles (nx-vs-turborepo, nx-vs-bazel) capping at 8-9% because they only get pulled when the prompt names both tools.

Where competitors win citations Nx has no answer for:

| Page                                                    | Citation rate | Format                                   | Nx equivalent?                                    |
| ------------------------------------------------------- | ------------- | ---------------------------------------- | ------------------------------------------------- |
| sourcegraph.com/blog/monorepo-build-tools               | 45.6%         | Listicle, ranks 5 tools incl. Nx         | None                                              |
| monorepo.tools/compare                                  | 21.2%         | Neutral comparison matrix                | None                                              |
| aviator.co/blog/monorepo-tools                          | 36.1%         | "Top 5 Monorepo Tools for 2026" listicle | None                                              |
| buildkite.com/resources/blog/monorepo-ci-best-practices | 16.8%         | Tool-agnostic CI best-practices guide    | None (Nx CI content is all Nx Cloud feature docs) |
| buildkite.com/.../continuous-integration-for-monorepos  | 16.2%         | Educational, tool-agnostic               | None                                              |

Maps to two weakest topics: Build System Optimization (59% visibility, Sourcegraph/Aviator lead citations) and CI/CD Pipeline Design (59% visibility, Buildkite leads).

**Why (Gauge):** Nx citation strength concentrated in named-competitor comparison docs — only surfaced when prompt names both tools. Generic non-branded prompts ("best monorepo build tools", "how to structure CI for a monorepo") pull from listicles and tool-agnostic guides — a format Nx doesn't publish in its own voice.

**What to write next (Gauge's 3):**

1. "Best Monorepo Build Tools" listicle — ranks Nx, Bazel, Turborepo, Lerna, Rush against build caching, task orchestration, CI integration. Competes with Sourcegraph/Aviator listicles pulling 36-45%.
2. Standalone monorepo tool comparison matrix page — feature-by-feature table (caching, distributed execution, affected-graph, language support, CI integration) as extractable as monorepo.tools/compare, but Nx-first.
3. Tool-agnostic "Monorepo CI/CD Best Practices" guide — affected builds, remote caching, DTE, merge queues without leading with Nx Cloud pitch; positions Nx Cloud as natural solution once problem established. Targets Buildkite gap directly. (= Entry 7/8's guide.)

**Gauge's pick:** comparison matrix = fastest win (format gap, zero existing competition); listicle = highest ceiling (Sourcegraph at 45.6%).

## Prioritized Action Items (PROPOSED — pending Jack's review)

**Global tracking protocol (applies to every item):**

1. Before shipping: create/attach a Gauge Action Center action with expected metric + explicit pass criteria (Entry 3 shows this works — but set eval window to 2-3+ weeks post-publish, not the default ~3 days).
2. Weekly x4: URL citation rate on the changed/new page (Gauge citations view).
3. At 2-3 weeks: sentiment diff on the relevant theme (re-ask same Gauge prompt, diff against baseline recorded in this doc).
4. Spot-check answer text (`get_answer`) whenever citation rate moves >2pts either direction — catches misinformation/factual drift that aggregates hide.
5. Monthly: topic visibility glance (lagging).

**Verdict rubric per item:** Positive = pass criteria met AND citation/visibility up vs baseline. Neutral = no material move after 4 weeks. Negative = citation down >2pts sustained OR new negative/incorrect language in sampled answers.

**Side goal:** every item doubles as a Gauge trial eval data point (pay/no-pay decision, ties to Joe follow-up due 2026-07-24; trial article quota 18/mo, resets Jul 23).

### High

- **H1. Resolve duplicate nx-vs-turborepo URLs** (`/docs/guides/comparisons/nx-vs-turborepo` 12.4% vs `/docs/guides/adopting-nx/nx-vs-turborepo` 9.8%) — canonicalize/redirect one; while touching survivor, add "Quick start: both take 2 minutes" section above the feature table (Entry 1 rec #3). Flagged twice (Entries 2, 11); blocks clean attribution for everything else. Cheapest, do first.
  - Tracking: canonical URL citation rate vs combined baseline (~12.4% + 9.8% split today). Positive = single URL exceeds today's max (12.4%) within 4 wks. Negative = combined citation drops below ~10%.
- **H2. Publish monorepo CI/CD best practices guide** (KB article; rework Gauge draft from Entry 8 — needs style pass, deep links, table claim verification). Weakest topic (CI/CD Pipeline Design, Buildkite leads), draft exists, Action Center action + pass criteria ALREADY defined (Entry 7) — re-evaluate after real publish = free before/after.
  - Tracking: existing Action Center criteria (new nx.dev URL appears in CI/CD topic citations; sampled CI/CD answers cite it instead of nx-vs-turborepo). Baselines: topic citation ~18.6-19%, Buildkite branded share 19.9%. Positive = both criteria met. Negative = Buildkite share keeps climbing + no Nx URL appears.
- **H3. Comparison cluster expansion** — revive nx-vs-lerna (draft shelved from DOC-549, in `dot_ai/2026-07-11/tasks/`) + net-new nx-vs-rush-stack (~13 tracked branded prompts, Entry 10; cluster = proven top citation driver, Entry 11). Include nx-vs-bazel update so it owns "Google build system alternative" framing — those prompts sit at 14.8% visibility (Entry 12).
  - Tracking: per-prompt visibility on Lerna/Rush rows (Entry 10 baselines; Rush CI/CD prompts 72-91% visibility but citations go to third parties) + the two "Google build system" prompts (14.8%). Positive = new/updated pages enter those prompts' citations; Bazel-framing prompts +10pts.
- **H4. Cost/ROI angle: update EXISTING comparison + Nx Cloud pages with cost-of-ownership framing** (no new page from Entry 6 brief) — fold "stop paying CI platform prices for a task-distribution problem" + task-level vs job-level framing into existing pages; addresses cost-framed query weakness (33-48% visibility, Entry 12) + ROI prompts at 41.7% (Entry 4).
  - Tracking: visibility on cost-framed prompts ("Cheapest monorepo CI/CD platforms" 33.3%, ROI/cost prompts 41.7% baseline). Positive = +10pts on those prompts in 4-6 wks. Watch: Buildkite branded share (19.9%, rising).
- **H5. Gauge measurement setup (enabler, ~30 min in Gauge UI, no content)** — three config tasks inside Gauge so H1-H4 are measurable: (a) add Blacksmith + Depot as tracked competitor brands (Entry 5 — currently only Buildkite/CircleCI tracked, so runner-speed competitor losses are invisible); (b) create an Action Center action for each H1-H4 item BEFORE it ships, with expected metric + pass criteria + 2-3wk eval window (Entry 3 shows what happens otherwise: auto-eval at 3 days scored noise); (c) add a tracked security/trust prompt as early-warning (Entry 13).
  - Tracking: n/a (this is what makes tracking of everything else work).

### Medium

- **M1. "Zero-config core" simplicity-first getting-started guide** — `nx init` -> run -> cache, plugins/boundaries mentioned only at end (Entry 1 rec #1). Attacks #1 confirmed negative theme (complexity/steeper-learning-curve, re-confirmed Entry 13).
  - Tracking: sentiment diff on complexity/learning-curve prompt set at 2-3 wks (baseline themes: steeper learning curve / overkill for small teams / plugin setup burden). Positive = complexity theme frequency drops or answers cite the guide. Negative = new negative phrasing in sampled answers.
- **M2. Leverage monorepo.tools/compare (we own it)** — Gauge treated it as a competitor, but it's Nx-owned and already cited in 21.2% of Build System Optimization answers. Verify Nx is represented accurately/currently there; refresh matrix data. Decide whether a light comparison table on nx.dev adds anything or is just duplicate content (default: skip nx.dev version, invest in monorepo.tools).
  - Tracking: monorepo.tools/compare citation rate (21.2% baseline) + spot-check what models extract from it about Nx (misinformation check).
- **M3. Third-party listicle outreach (instead of writing our own "best tools" article)** — Nx-authored "best" lists lack credibility (bias). Audit the high-citation third-party articles for misinformation/outdated claims and contact authors/orgs: sourcegraph.com/blog/monorepo-build-tools (45.6%), aviator.co/blog/monorepo-tools (36.1%), plus daily.dev, codeables.dev, trybuildpilot.com, digitalapplied.com, monorepovspolyrepo.com (Entry 9 citation mix).
  - Tracking: spot-check sampled answers citing those articles for corrected claims; log which orgs respond/update.
- **M4. Standing Gauge monitors (if we continue with Gauge)** — quarterly malware/security sentiment recheck (Entry 13: 1/~2164 answers today); watch r/node "rug pull" Reddit thread in citation mixes (Entry 9); periodic duplicate-content sweep.
  - Tracking: the security prompt from H5(c); flag if incident vocabulary enters answers or the Reddit thread's citation frequency grows.
- **M5. Plugins article — scope TBD** — Gauge's "Do you need plugins and module boundaries?" framing too confusing. Candidate scope: "Do you need plugins?" only. Underlying issue is partly PRODUCT (users who don't need them shouldn't encounter them; users who do should discover them naturally) — decide written-content scope vs product fix before committing.
  - Tracking: "overkill for small teams" theme in sentiment diff (same prompt set as M1).

### Low

- **L1. Update existing getting-started tutorial with timed benchmark elements** (Entry 1 rec #4 rescoped — likely NOT a new page; we already have a tutorial). Add quotable stopwatch numbers ("0:00 nx init, 1:40 first cached build") — numbers beat adjectives in what models extract.
  - Tracking: spot-check whether sampled answers quote the numbers.
- **L2. Polyglot/non-JS support content refresh** — "weaker non-JS plugin support" is a confirmed negative theme (Entry 13) no other item touches. Refresh Gradle/Java/Go/Rust positioning on docs intros.
  - Tracking: sentiment diff on non-JS/polyglot theme; re-ask Entry 13-style sentiment prompt quarterly.
- **L3. "Platform" vs "tool" terminology positioning** — near-identical prompts split 74.1% ("tools") vs 40.7% ("platforms") visibility (Entry 12): models classify Nx as tool, not platform. Audit docs/Cloud pages so "platform" phrasing appears where legitimate (Nx Cloud especially — ties to Entry 6 framing).
  - Tracking: visibility gap between "platforms"-phrased and "tools"-phrased prompt pairs (40.7 vs 74.1 baseline); positive = gap narrows.

### Explicitly NOT doing

- New standalone "Nx Cloud vs Buildkite/CircleCI" page from Entry 6 brief (update existing pages instead — H4).
- Nx-authored "best/top monorepo tools" listicle — bias kills credibility; outreach to third-party authors instead (M3).
- New nx.dev comparison-matrix page by default — we own monorepo.tools/compare already (M2 decides).
- Publishing Gauge's generated drafts as-is (Entry 8 needs full rework: bare nx.dev links, unverified table claims, style pass).
- Any homepage/marketing page work (out of scope).
