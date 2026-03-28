# Living Architecture Docs That Actually Stay Current

*Draft blog post - Nx CLI team perspective*

---

Every engineering team I've worked with agrees: architecture documentation matters. And every engineering team I've worked with has architecture docs that are between six months and two years out of date. The cycle is predictable. Someone writes a thorough document. It's accurate for about three weeks. Then someone refactors the module structure, someone else changes the deployment pipeline, and nobody updates the doc because updating docs is a separate task that lives outside the actual work.

We got tired of this on the Nx CLI team. We tried the usual things. Confluence pages with "last updated" timestamps that just made the staleness more visible. README files that described the project as it existed when someone set up the repo. Architecture Decision Records that captured the "why" beautifully but never captured the "what changed since then." None of it worked because all of it treated documentation as something you do *after* the work, as a separate activity with its own motivation and prioritization.

So we tried something different.

## The Pattern

We keep per-repo architecture files at `.ai/para/resources/architectures/<repo>-architecture.md`. Nothing revolutionary about the location. The difference is in how they get updated: incrementally, as part of the work session itself, not as a separate task.

After each work session, a `/reflect` command appends new findings to the architecture file. Not a rewrite. Not a review of the whole document. Just: "here's what I learned or changed in this session that future-me or a teammate would want to know." The file grows organically. It accumulates institutional knowledge the same way a codebase accumulates code — through small, frequent additions that each make sense in context.

This is the key insight, and it's embarrassingly simple: **docs stay current when updating them is part of the workflow, not a separate task.** You don't need discipline. You don't need quarterly "doc sprints." You just need the update to happen at the point where the knowledge is freshest — right after you've done the work.

## What Goes In (And What Doesn't)

Architecture docs aren't code comments. They capture a different layer of knowledge:

**Directory structure and file relationships.** Not just "here are the folders" but "here's why `packages/create-nx-workspace/` is separate from `packages/nx/` and what the boundary between them means." The kind of thing that's obvious to whoever set it up and completely opaque to everyone else.

**Design decisions and why they were made.** We chose A/B testing infrastructure for CNW (Create Nx Workspace) that uses a single `NX_CNW_FLOW_VARIANT` env var to control both flow behavior and prompt copy variants. Why not two separate env vars? Because we learned the hard way that decoupling them creates a combinatorial testing nightmare. That reasoning doesn't belong in a code comment. It belongs somewhere a new contributor will find it before they try to "improve" the design by splitting the concerns.

**Workarounds and gotchas that aren't obvious from code.** The Nx `run-commands` executor has three different code paths for process spawning: single commands go through a pseudo-terminal (PTY) via Rust native code, parallel commands use Node's `exec()` with piped stdio, and serial commands use PTY if supported. You cannot figure this out by reading the executor's entry point. We know because we tried, and it cost us hours on NXC-3505 where we assumed piped stdio but single commands were actually using PTY. That debugging session produced a paragraph in the architecture doc. That paragraph has saved multiple people multiple hours since.

**Work history: what changed recently and why.** Not a git log — those are too granular. More like "we migrated version detection to use `getDependencyVersionFromPackageJson` + `semver.coerce/major` because hardcoded versions in generators were causing upgrade pain." Enough context to understand the trajectory of the codebase.

## Auto-Loading: The Docs Actually Get Read

Here's where it gets practical. Our `CLAUDE.md` configuration instructs the AI assistant to check for an architecture file *before doing any other work* when starting a session in a repo. The instruction is explicit:

> When starting work in a repo, immediately load the architecture file before any other work. Get repo name, check for the file, read it first.

We maintain a table of known repos with architecture files — nx, ocean, console, nx-labs — but the system also searches for new ones automatically. If someone creates `foo-architecture.md` for a new repo, it gets picked up without anyone updating a config.

This means every AI-assisted interaction starts with accurate context. No one has to remember to say "by the way, here's how this codebase works." The architecture doc is the first thing loaded, every time.

## Real Examples

Our `nx-architecture.md` captures things like:

- **CNW flow variants**: How the A/B testing infrastructure works, how `PromptMessages.getPrompt(key)` selects from message option arrays, how flow variant is cached per-user for one week via tmpfile.
- **Version detection patterns**: The `getInstalledViteMajorVersion` pattern and why init generators must detect and preserve existing dependency versions rather than bumping users to latest.
- **Process spawning paths**: The PTY vs spawn vs exec distinction in `run-commands` that caused NXC-3505. This single entry has prevented the same misunderstanding at least three times.

Our `ocean-architecture.md` (Nx Cloud) captures:

- **Version plans requirement**: That feat/fix PRs need a version plan file at `.nx/version-plans/` with specific frontmatter format. Easy to forget, annoying to debug in CI.
- **E2E testing patterns**: That `--configuration=e2e` loads `.env.serve.e2e` with fake credentials, so you don't need 1Password CLI for local e2e runs.
- **The distinction between e2e mode and production mode**: Which env vars matter, which ports to use, what the fake credentials cover.

These aren't things you'd put in a README. They're too specific, too operational. But they're exactly what you need when you sit down to work on the project after two weeks away.

## Why Traditional Approaches Fail

The Confluence page fails because it lives in a different tool from the work. You finish coding, push your branch, and then you're supposed to context-switch to a browser, find the right page, figure out which section to update, and write prose about what you just did. The activation energy is too high for the payoff, especially when the payoff is invisible (someone in the future not being confused).

The README fails because it's written for onboarding, not for ongoing work. It describes how to set up the project and maybe the high-level module structure. It doesn't tell you that `pnpm-lock.yaml` rebase conflicts should never be resolved with `git checkout --theirs` because it destroys resolution metadata — you need `git checkout origin/master -- pnpm-lock.yaml && pnpm install --no-frozen-lockfile` instead.

ADRs fail because they capture decisions at a point in time but don't capture how the codebase evolves around those decisions. ADR-007 says "we chose PostgreSQL." Great. It doesn't say that three months later someone added a Redis cache layer that handles 80% of reads and that the Postgres connection pool is now tuned for write-heavy workloads.

The architecture doc pattern works because it solves all three problems: it lives next to the code, it's updated incrementally as part of the work, and it captures evolving context rather than point-in-time decisions.

## The Compound Effect

The real value isn't in any single entry. It's in the accumulation. After six months of incremental updates, our `nx-architecture.md` contains knowledge that would take a new team member weeks to discover independently. Not because any individual piece is hard to find, but because knowing *which* pieces matter — which code paths have surprising behavior, which design decisions have non-obvious rationale, which workarounds exist for third-party bugs — is the kind of tacit knowledge that usually lives only in people's heads.

We found this out the hard way with NXC-3514, where we spent hours debugging Nx lockfile parsing before discovering the real issue was Bun outputting malformed Yarn-format lockfiles. That investigation and its conclusion went into the architecture doc. The next time someone hits a lockfile parsing issue, they'll check the known third-party bugs section before going down the same rabbit hole.

## Getting Started

You don't need our exact setup. The pattern is simple:

1. Create a file that captures architecture knowledge for your repo.
2. Make updating it part of your work session — end of session, append what you learned.
3. Make loading it part of starting work — beginning of session, read what's accumulated.
4. Don't rewrite it. Append to it. Let it grow.

The format doesn't matter much. The location doesn't matter much. What matters is that the update happens at the moment of maximum knowledge and minimum friction — right when you've just finished figuring something out, as a natural closing step rather than a separate obligation.

Your architecture docs will never be stale again. Not because you've become more disciplined, but because you've removed the need for discipline entirely.
