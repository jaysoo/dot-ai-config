# Polygraph Workflow Docs — Candidates

Draft of two workflow docs for the Polygraph docs site. Goal: convince a dev to install the CLI and try the product. One workflow per audience.

- **Workflow A**: OSS maintainer / small team — fix a cross-repo bug from a contributor's repro.
- **Workflow B**: Platform team / enterprise — ship a feature that spans multiple repos with shared CI credentials.

Both lean on capabilities already shipped in the standalone Polygraph app + CLI as of 2026-05-26 (shared sessions #11399, fork support #11401, org pipeline secrets #11420, `pack-and-copy`, child agents, PR association).

Source material:

- Victor's two Looms (Case 1 OSS, Case 2 fork-based contributor PR)
- Juri's 8 use-case list (1/3/4 marked for demo flow)
- The current MCP tool surface and CLI verb list

---

## Workflow A — Fix an OSS bug across repos in one session

For a large JavaScript library, the value proposition is being able to do work across repos seamlessly. This workflow is the cheapest demonstration of that: a maintainer, a public library, a contributor's repro repo, one session.

**Persona**: maintainer of a popular library. Bug report shows up with a link to a reproduction repo. Today you clone two repos, link them by hand, run `npm pack` in a loop, and copy the tarball back and forth until the bug is reproduced and the fix is verified.

**Problem we're solving**:

- Reproduction repos live outside your account, so any traditional "multi-repo dashboard" tool doesn't help.
- The maintainer never wants to ask the contributor to install anything — the contributor's job ends when the bug report lands.
- The feedback loop between "change in library" and "does the repro still break" is the whole job, and it's manual.

**What Polygraph gives you here**:

- One session that contains both your library and the contributor's public repro repo, even though only one of them belongs to your account. Polygraph indexes public repos **on demand**, so the repro never has to be pre-registered with your account.
- A built-in `pack-and-copy` step that builds your library, packs it, and installs the tarball into the repro — automatically, every time the agent makes a change.
- A shareable session link you can hand back to the contributor as the answer ("here is the investigation, the fix, the PR, and the green repro all in one place").

### The flow

1. **Start a session against your library.**

   ```bash
   # Default: Polygraph clones your library fresh into the session.
   npx polygraph session start
   # pick or paste the library repo (e.g. github.com/nrwl/nx)
   ```

   First run downloads the CLI bundle from your Polygraph host and caches it under `~/.polygraph/`. Subsequent runs are instant.

   **Advanced: start from a clone you already have.** For a big repo like Nx, a fresh clone is slow. If you already have the library checked out, `cd` into it first and run `polygraph session start` from there — the session uses your existing working copy instead of cloning a new one. (Worktrees work too, but for very large repos a plain clone is often faster than worktree setup.)

2. **Add the contributor's repro repo.**

   You have two options depending on what the contributor sent you.

   - **They sent a repo URL** — just paste it into the agent: _"Add `github.com/some-user/nx-bug-repro` to this session."_ The agent calls `add_repo`, and because the repo is public Polygraph indexes it on demand — the contributor never has to register it, you never have to add it to your org first.
   - **They sent a Polygraph shared-session link** — paste the link: _"Look at this session and add its repos to mine."_ The agent walks the shared session and pulls the relevant repos into yours.

   The repro shows up in the session UI tagged **External OSS · read-only**. That tag is about PR direction, not file access — Polygraph will never try to push a branch or open a PR against the repro (the repro is throwaway, nobody wants PRs against it). Local writes inside the session's working copy of the repro — including `pack-and-copy` dropping a tarball into `.polygraph-packages/` and rewriting `package.json` — still work normally. The fix gets PR'd against your library, the repro just stays around as the proof.

3. **Investigate and fix inside the session.**

   Drop in the bug description (or a GitHub issue URL — the agent will fetch it like any other URL; there's no special Polygraph-side issue parser yet). The agent has access to both repos in the same workspace: it can read the repro, edit the library, and run scripts in either tree.

4. **Validate the fix with `pack-and-copy`.**

   ```
   pack and copy nx into the repro
   ```

   The point of this step is the part you've been doing by hand for years: it makes "did my fix work end-to-end" a single agent turn instead of a multi-terminal dance.

   > **What `pack-and-copy` actually does**
   >
   > You don't run a CLI flag — the agent calls Polygraph's `pack_and_copy` MCP tool with the publisher repo, the consumer repo, and the current session. For each pair, it:
   >
   > 1. **Refuses paths outside session repos.** Anything that doesn't resolve into a cloned session repo is rejected before any filesystem write. A `--pair=~/.ssh=...` can't happen.
   > 2. **Runs `npm pack` in the publisher.** Lifecycle scripts (`prepack`/`prepare`/`postpack`) are **off by default** — lifecycle scripts on a freshly cloned repo are de-facto RCE. Opt in with `--run-scripts` only when you trust the publisher.
   > 3. **Bumps the publisher's version** to `<orig>-pg.<sessionId>.<timestamp>` so consumers always resolve a strictly-greater version and reruns within a session don't collide.
   > 4. **Drops the tarball** into `<consumer>/.polygraph-packages/` (not `node_modules`, not a global cache — it lives in-tree).
   > 5. **Rewrites the consumer's `package.json`** to point the dependency at the local tarball, in whichever of `dependencies` / `devDependencies` / `peerDependencies` / `optionalDependencies` it already lives.
   > 6. **Reports both sides** (published + consumed packages) to the Polygraph session API, keyed by session repo IDs, so the session UI shows the wiring.
   >
   > After that, the agent reruns whatever command was failing in the consumer — `npm test`, `nx e2e`, whatever the repro README says.

5. **Open the PR — against your library, not the repro.**

   ```
   open a pr against the library
   ```

   The PR always lands on the upstream library (your repo). The contributor's repro stays read-only on Polygraph's side; it lives in the session as the proof your fix works, not as another PR target. The session's full history (commands, files touched, branches, repro output) gets attached to the PR via a share link, so reviewers and the original reporter get the _why_, not just the diff.

### End-to-end: a real session

Concrete walkthrough you can copy-paste. Replace the issue / repo URLs with your own.

```bash
# 1. Install nothing globally — npx will fetch the thin shell on first run.
#    Run from anywhere for a fresh clone, OR cd into an existing checkout
#    of your library first to skip the clone step.
npx polygraph session start
# Interactive prompts:
#   - Account?           pick your personal or org account
#   - Primary repo?      paste github.com/nrwl/nx   (or pick from the list,
#                        or accept the detected repo if you cd'd in)
#   - Spawn agent?       yes -> Claude   (or Codex / OpenCode)
```

Then, inside the spawned agent's chat window:

```text
> Fetch https://github.com/nrwl/nx/issues/30421 and read the report.
> The reporter has a reproduction at https://github.com/some-user/nx-bug-repro.
> Add that repro repo to this session.
```

```text
> Read the issue and the repro's README. Run the failing command in the repro
> and confirm you can reproduce the bug before changing anything in nx.
```

```text
> Now look in nx for the code path responsible. Make the smallest fix you can
> justify. Don't run tests in nx yet — I want to validate end-to-end first.
```

```text
> Pack and copy nx into the repro, then rerun the repro's failing command.
> If it still fails, iterate on the fix. If it passes, run the relevant nx
> unit tests for the files you changed.
```

```text
> Open a pull request against nrwl/nx with the fix. Title:
> "fix(core): <one-line summary>". Body should link the issue and the repro.
> Then share this session and paste the share link so I can post it on the issue.
```

That's the whole loop: one CLI install, one `session start`, five chat turns.

### Why this is the doc lead

Every step here works against public repos with no per-contributor onboarding. It's the cheapest possible first session: open-source maintainer, public repos, one CLI install, one `session start`. Victor's first Loom is exactly this flow and it's the use case marked "this should always work, please dogfood".

### CLI / MCP surface used

- `polygraph session start`, `polygraph session add-repo`
- `polygraph agent spawn` (implicit when you `session start` interactively)
- `pack-and-copy`
- `polygraph create-pr` / `polygraph associate-pr`
- MCP equivalents: `mcp__plugin_polygraph_polygraph-mcp__start_session`, `add_repo`, `pack_and_copy`, `create_pr`, `associate_pr`, `link_reference`

---

## Workflow B — Ship a coordinated change across repos

**Persona**: platform team or product team in a company that already has multiple repos (e.g. a Next.js app + a Node API + a shared design system, or two services that need to migrate together). The change spans repo boundaries and the API contract is the thing that has to stay in sync.

**Problem we're solving**:

- Today's options are "one giant manual PR-pair" or "merge them in order and pray". Both leak time.
- The CI for each consumer has to validate against the unreleased version of the library — which means somebody copies a tarball into a private S3 bucket, or publishes a `0.0.0-pr-1234` package, or skips the validation entirely.
- Per-repo CI secrets, deploy tokens, and registry credentials are scattered across N CI providers. Adding a new repo to the coordination means rotating N more secrets.

**What Polygraph gives you here**:

- One plan, written once, with all the relevant repos loaded into the same agent context. Scope locked up front, before any code is written.
- Per-repo subagents that execute the plan against each repo — the DTO/contract decision made in the planning step gets enforced everywhere.
- `pack-and-copy` for the design-system / shared-lib case: the unmerged library version is built and installed into every consumer's CI before any version of the library is published.
- **Org pipeline secrets** (shipped 2026-05-25): one place to store the CI tokens and registry credentials the agents need across all repos in the organization, with the secrets surfaced to each session without you wiring them up per repo.

### The flow

1. **Pick the org and start the session with all repos at once.**

   ```bash
   npx polygraph session start
   # select org
   # select primary repo
   # add additional repos (Polygraph remembers org-scoped repos)
   ```

2. **Configure org pipeline secrets (one-time per org).**

   In the Polygraph web UI, under your org → **Pipeline Secrets**, add the credentials each repo's CI needs: npm publish tokens, deploy keys, registry auth. Sessions in this org get those secrets injected at the right step; you don't paste tokens into chat.

3. **Plan once with both repos in scope.**

   Describe the change as a single feature: _"Add a `tags[]` field to the `Cart` API and surface it as a chip row in the cart UI."_ The agent sees both repos in the same workspace and writes a plan that names the DTO shape, the migration order, and which repo gets which commit.

4. **Let Polygraph spawn per-repo subagents.**

   ```
   spawn a child agent in the backend repo to implement the API change
   spawn a child agent in the frontend repo to consume it
   ```

   Each subagent inherits the plan and only writes to its own repo. The parent session can read each subagent's output and reconcile (e.g. when the backend's actual DTO shape differs from the planned one, the frontend subagent picks up the corrected shape).

5. **Validate with `pack-and-copy` before any publish.**

   For shared libraries / design systems: `pack-and-copy` the unmerged library into every consumer repo and let each consumer's CI run against it. This is the step that lets you ship a breaking change to a shared lib without a "release candidate → consumer upgrade" merry-go-round.

   > **What CI sees**
   >
   > `pack-and-copy` rewrites each consumer's `package.json` to depend on a tarball at `.polygraph-packages/<pkg>-<orig>-pg.<sessionId>.<timestamp>.tgz`, then reports the wiring back to the Polygraph session. The consumer's CI installs from that tarball exactly the way it would install from npm — no registry override, no separate `npm publish`, no `0.0.0-pr-1234` packages clogging up your real registry. The publisher's `npm pack` runs **without** lifecycle scripts by default (security), so if your shared lib relies on a `prepack` build step, either opt in with `--run-scripts` once you trust the publisher, or have the agent run the build before the pack step.
   >
   > See Workflow A's "What `pack-and-copy` actually does" callout for the full 6-step mechanics.

6. **Open linked PRs on a shared branch.**

   ```
   open prs for all repos in this session
   ```

   Each PR carries the session link, the plan, and pointers to the sibling PRs. Merge order is documented; reviewers see the full cross-repo context.

### End-to-end: a real session

Concrete walkthrough for the "add `tags[]` to Cart" example. Two repos: `acme/api` (backend) and `acme/web` (frontend) — adjust to your stack.

**One-time, in the Polygraph web UI** (`/orgs/<your-org-id>/pipeline-secrets`):

| Secret name      | Used by                | Example value         |
| ---------------- | ---------------------- | --------------------- |
| `NPM_TOKEN`      | publish step in `api`  | `npm_xxx...`          |
| `VERCEL_TOKEN`   | deploy step in `web`   | `vrcl_xxx...`         |
| `GH_APP_TOKEN`   | PR creation, both repos| `ghs_xxx...`          |

These get injected into the right step at the right time — you never paste them into chat.

**Then in your terminal:**

```bash
npx polygraph session start
# Interactive prompts:
#   - Account?            pick the acme org
#   - Primary repo?       acme/api
#   - Add another repo?   yes -> acme/web
#   - Spawn agent?        yes -> Claude
```

Inside the agent chat:

```text
> Don't write any code yet. Write a plan for this change:
> "Add a tags[] field on Cart, returned from GET /carts/:id, and surface
>  it as a chip row above the cart line items in the web app."
>
> The plan must include:
>   - the exact DTO shape (TS type for the field on Cart)
>   - the migration order (which repo lands first, what the contract
>     looks like before/after each step)
>   - which repo gets which commit
> When the plan is ready, stop and let me review it.
```

```text
> Plan approved. Spawn a child agent in acme/api to implement the backend
> change per the plan. Tell it to also update the OpenAPI / TS contract
> package that acme/web consumes.
```

```text
> Now spawn a child agent in acme/web to consume the new field.
> The api subagent updated the contract package — pack and copy
> @acme/api-client into acme/web, then have the web subagent build
> against that local tarball.
```

```text
> Both subagents look done. In acme/web, run typecheck and the cart e2e
> against the packed @acme/api-client to confirm the contract matches.
```

```text
> Push branches in both repos and open linked pull requests on the shared
> branch "feat/cart-tags". The api PR description must call out that the
> web PR depends on it; the web PR must link the api PR.
```

That's the loop. One plan, two subagents, one shared branch, two PRs that already know about each other.

### Why this is the enterprise-lead doc

The thing that's new here isn't "multi-repo PRs" (lots of tools claim that). It's that the plan, the per-repo agents, the inter-repo contract validation, and the CI credentials all live in the same session. The two pieces that were missing for the enterprise story landed this week:

- Org pipeline secrets (#11420) closed the "where do CI tokens live" gap.
- Fork PR target support (#11401) closed the "what if one of my repos is a fork" gap, which matters for design systems consumed by repos in adjacent orgs.

### CLI / MCP surface used

- `polygraph session start` with multi-repo selection
- `polygraph agent spawn` per repo
- `polygraph pack-and-copy`
- `polygraph create-pr`, `polygraph mark-pr-ready`, `polygraph push-branch`
- Org pipeline secrets configured via the web UI under `/orgs/:orgId/pipeline-secrets`
- MCP equivalents: same as Workflow A plus `spawn_agent`, `show_agent`, `mark_pr_ready`, `push_branch`

---

## Cross-cutting capabilities to mention in both docs

Both workflows quietly rely on a few primitives that are worth a short sidebar in each doc (or a shared "features that show up in every session" page):

| Primitive                                                                                                                                                                                   | Where it shows up                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Session resume** — `polygraph session resume` restores the full agent context (files, plan, decisions) in your local Claude / Codex. Kills the "re-prime the agent from scratch" problem. | OSS: come back tomorrow to finish a fix. Enterprise: hand the session to the next engineer on the rotation.                 |
| **Shared sessions** — public or org-scoped share link, read-only.                                                                                                                           | OSS: link the session in the issue thread. Enterprise: link the session in the PR description as a "prompt request" record. |
| **Reference linking** — `link_reference` attaches GitHub issues, PRs, or other sessions.                                                                                                    | Both: every PR knows the issue that triggered it and the session that produced it.                                          |
| **CI log fetching** — `get_ci_logs` pulls failing GitHub Actions logs into the session so the agent can debug without you copy-pasting.                                                     | Both: especially valuable in the enterprise flow where N repos means N CI dashboards.                                       |

---

## Notes for review (not for the published doc)

Things I want a second pair of eyes on before this turns into real docs:

1. **Is `pack-and-copy` against nx itself solid yet?** Victor flagged this as the one thing in Workflow A that might not work out of the box because Nx has a complex build setup. If it's still flaky on the demo repo, Workflow A should pick a simpler library for its narrative (or we lead with `pack-and-copy` against a small package and treat Nx as the "advanced" example).
2. **OSS public-share UX**: the shared-session import flow currently tries to link the shared session as if it were in the same account and errors. The MCP fix is queued but not released. Worth a callout in the doc or a "minimum version" note.
3. **Org pipeline secrets is hours old.** Before Workflow B's secrets section ships, confirm the UI route, the secret-injection step, and the docs example match what actually landed in #11420.
4. **Fork support landed yesterday.** Workflow B's "if one of your repos is a fork" line depends on #11401 — worth a sanity check that the contributor → maintainer fork flow from Victor's second Loom now works without manual fixups.
5. **Should there be a third workflow doc** specifically for "API change impact analysis" (Juri's #5)? It's a different value prop (read-only graph walk → coordinated change) and might pull a different segment. Left out of this draft to keep the two-workflow scope tight, but flagging.

---

## Suggested doc-site placement

```
docs/
  polygraph-local-development.md          (exists, internal)
  workflows/
    fix-an-oss-bug.md                     (Workflow A)
    ship-a-coordinated-change.md          (Workflow B)
    _index.md                              (one-paragraph intro + links to both)
```

Each workflow doc is a recipe, not a reference. Reference (every CLI verb, every MCP tool) lives elsewhere; these two docs exist to get a first session running in under 15 minutes.

---

## Use-case coverage plan (added 2026-05-27)

Fresh pass on what the docs need to cover. Workflows A/B above are starting points; the framing below is how the doc set should be organized.

### Concepts to land first (intro / "how to think about Polygraph")

1. **Your repos are already in the graph.** Anything you have access to is part of a bigger graph. Polygraph isn't "set up a monorepo" — your repos are already nodes.
2. **Break down cross-repo boundaries (synthetic monorepo).** Frictionless work between repos, just like a monorepo. No vendoring, no submodules, no copy-paste.
3. **Resumability and memory.** Resume sessions, reference other sessions. Sessions are durable context across days, people, and cycles.

### Use cases (each = a doc or a section)

1. **Web dev: one change across multiple repos** — "prompt once, land everywhere". Microservices, backend + frontend pairs. Just-like-a-monorepo framing.
2. **Published-artifact author** — design system, client lib, SDK. Change once, open PRs to all downstream repos. `pack-and-copy` is the engine.
3. **Informational / read-only**
   - a. Look at backend changes, reflect into frontend
   - b. Copy what's done in another repo into mine
   - c. Look at OSS repo for changes and find why my stuff is broken
4. **Platform / security eng** — update compromised version of a package across all repos I own.
5. **Hand-off / continuity**
   - a. Resume a session from another engineer (backend → me doing frontend)
   - b. Reference a prior session, start a new one from it
   - c. Cycle/sprint continuity — work doesn't reset on Monday

### OSS gets its own pages (separate from the above)

These are OSS-specific and shouldn't be muddled with the enterprise / multi-repo-team docs:

1. **OSS triage with repro** — single doc, the Workflow A flow above.
2. **OSS ecosystem and compat** — separate doc, broader "watch what other repos in the ecosystem are doing".

### Open questions

- Do (3a/b/c) collapse into one "read-only / informational" doc, or split?
- Where does (5) live — its own page or a sidebar on every use-case doc?
- Concept page vs. landing page: are the three concepts above the intro to the docs site, or a separate "concepts" page linked from every use-case doc?
