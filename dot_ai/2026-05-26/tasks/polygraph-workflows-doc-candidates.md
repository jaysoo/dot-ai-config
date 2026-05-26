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

**Persona**: maintainer of a popular library. Bug report shows up with a link to a reproduction repo. Today you clone two repos, link them by hand, run `npm pack` in a loop, and copy the tarball back and forth until the bug is reproduced and the fix is verified.

**Problem we're solving**:

- Reproduction repos live outside your account, so any traditional "multi-repo dashboard" tool doesn't help.
- The maintainer never wants to ask the contributor to install anything — the contributor's job ends when the bug report lands.
- The feedback loop between "change in library" and "does the repro still break" is the whole job, and it's manual.

**What Polygraph gives you here**:

- One session that contains both your library and the contributor's public repro repo, even though only one of them belongs to your account.
- A built-in `pack-and-copy` step that builds your library, packs it, and installs the tarball into the repro — automatically, every time the agent makes a change.
- A shareable session link you can hand back to the contributor as the answer ("here is the investigation, the fix, the PR, and the green repro all in one place").

### The flow

1. **Start a session against your library.**

   ```bash
   npx polygraph session start
   # pick or paste the library repo (e.g. github.com/nrwl/nx)
   ```

   First run downloads the CLI bundle from your Polygraph host and caches it under `~/.polygraph/`. Subsequent runs are instant.

2. **Add the contributor's repro repo.**

   You have two options depending on what the contributor sent you.

   - **They sent a repo URL** — just paste it into the agent: _"Add `github.com/some-user/nx-bug-repro` to this session."_ The agent calls `add_repo` and Polygraph indexes it on demand (no prior account setup required, because it's public).
   - **They sent a Polygraph shared-session link** — paste the link: _"Look at this session and add its repos to mine."_ The agent walks the shared session and pulls the relevant repos into yours.

3. **Investigate and fix inside the session.**

   Hand the agent a GitHub issue URL or the bug description directly. The agent has access to both repos in the same workspace, can read the repro, edit the library, and run scripts in either tree.

4. **Validate the fix with `pack-and-copy`.**

   ```
   pack and copy nx into the repro
   ```

   This builds and packs the library, copies the tarball into the consumer's `node_modules`, and reruns the failing command. The point of this step is the part you've been doing by hand for years: it makes "did my fix work end-to-end" a single agent turn instead of a multi-terminal dance.

5. **Open the PR — and share the session.**

   ```
   open a pr against the library
   ```

   The session's full history (commands, files touched, branches, the repro itself) gets attached to the PR via a share link. Reviewers and the original reporter get the _why_, not just the diff.

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

6. **Open linked PRs on a shared branch.**

   ```
   open prs for all repos in this session
   ```

   Each PR carries the session link, the plan, and pointers to the sibling PRs. Merge order is documented; reviewers see the full cross-repo context.

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
