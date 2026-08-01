# Commit Analysis — H1 2026 Reviews (2026-02-01 to 2026-08-01)

Repos analyzed: `nrwl/nx`, `nrwl/ocean`. **`nrwl/cloud-infrastructure` was not accessible in this session** — Steve and Patrick's primary repo is missing from every number below. Treat their commit counts as floors, not totals.

Method: local clones deepened to 2026-01-15, `git log --no-merges` in window, identities merged across email variants (Juri appears as both "Juri" and "Juri Strumpflohner"; both counted).

## Commits per person (no merges)

| Person | nx | ocean | Total (visible) |
|---|---:|---:|---:|
| Jason Jean | 387 | 51 | 438 |
| Altan Stalker | 8 | 207 | 215 |
| Louie Weng | 40 | 180 | 220 |
| Benjamin Cabanes | 9 | 135 | 144 |
| Craigory Coppola | 127 | 15 | 142 |
| Nicole Oliver | 2 | 111 | 113 |
| Caleb Ukle | 47 | 19 | 66 |
| Juri Strumpflohner | 26 | 16 | 42 |
| Steve Pentland | 2 | 33 | 35* |
| Patrick Mariglia | 0 | 24 | 24* |
| Heidi Grutter | 0 | 0 | 0 (expected; non-engineering role) |

\* Excludes cloud-infrastructure, their main repo. January cycle showed Steve at 40 cloud-infrastructure PRs in a comparable window, so the real numbers are much higher.

Sanity check: nx numbers match the known baseline exactly (Jason 386-387, Jack 207, Craigory 127, Caleb 47, Louie 40, Juri 26, Ben 9, Altan 8, Nicole 2, Steve 2, Patrick 0). Small drift on Jason (386 vs 387) is timezone boundary noise.

## What each person's commits are (scope distribution)

- **Jason (nx)**: 100 fix(core), 102 chore(repo), 25 fix(repo), 16 fix(gradle), 13 feat(core). Half his volume is repo/release infrastructure and CI upkeep; the fix(core) volume is real product hardening (lockfile parsing, migrate behavior, TUI, daemon). Also ~51 ocean commits, mostly repo maintenance (nx version bumps) plus a handful of sharp cross-repo fixes (Node 26 rmdirSync removal in DTE lock release, V4 worker EPIPE teardown).
- **Altan (ocean)**: 50 fix(nx-api), 28 fix(nx-cloud), 15 feat(nx-cloud), 13 feat(nx-api). Owns the agent-scheduling core: scheduling constraints (#12579), critical-path capacity reservation (#12347), O(n^2) scheduling sweep elimination (#12649), fleet starvation fix (#12672), task duration distribution analytics (#12529), Stripe/credit plan modifiers.
- **Louie (ocean + nx)**: resource-usage add-on end to end (collection, billing integration, workspace toggles, dedicated page, default-on flag rollout: #12227, #12472, #12515, #12548), ci-config YAML schema + static serving; in nx, ~34 of 40 commits are gradle plugin (atomizer correctness, input inference, batch executor).
- **Ben (ocean)**: 58 fix(nx-cloud) + 28 feat + 31 refactor — the app-shell/navigation overhaul (workspace selector in sidebar #12477, flattened settings nav #12455, CIPE/Run nav alignment #12454) and timeline/task-identity correctness (batch-aware task identity #11840, attempt attribution #12574). High volume of small, disciplined UI fixes.
- **Nicole (ocean)**: onboarding and growth surface: workspace setup guide (#11158, #12343), onboarding survey (#12551), one-page manual connect graduation (#12622), Nx Cloud Rewind (#12084), plan cancellation survey (#12553), plus a run of CVE/dependency remediations (#12630, #12631, #12629, #12575).
- **Craigory (nx)**: 60 fix(core), 19 feat(core). TUI mouse support (#35868) and a stream of TUI robustness fixes, targetDefaults redesign (see reverts), createNodesV2→createNodes rename + migrations (#35893, #35386), @nx/dotnet graduation (#35895), multi-version compliance for jest/vue/nuxt. In ocean: sandboxing exclusion fixes for .NET.
- **Caleb (nx + ocean)**: nx-dev docs platform (search ranking, SEO, redirects, sidebar topics reorg #34265, clickjacking headers #34893); in ocean H2 of the window he shifted to product: workspace data API (#12082, #12659, #12576), docker container resource-usage charting (#12328), CIPE filter performance (#12304).
- **Juri (nx + ocean)**: nx docs/AI-agent rules (CLAUDE.md generation #34304, configure-ai-agents Ctrl+C), courses page; in ocean, polygraph demo tour overhaul (#11495) and session-UX fixes. Commit volume is intentionally light; his output is content (see dossier).
- **Steve (ocean)**: workflow-controller: conditional feature enablement (#11275), facade streaming timeout fix (#10941), controller id/checkin wiring (#10490), nil routing key handling (#11095).
- **Patrick (ocean)**: workflow-controller feature work: capability vocabulary + facade capability routing (#12229, #12257, #12277), leader-election re-entry after lease loss (#11794), dedicated compute tolerations (#11313), configurable docker cache registry (#11273), rate limits, buildkit conditional mounts.

## Reverts

Formal reverts in window: nx 9 (in ~5,000+ commits), ocean 25 (in ~2,500). Both are sub-1% base rates; in squash-merge repos most quality issues surface as fix-forward, so treat reverts as process events unless they form a pattern. Verdict up front: **no revert in either repo evidences a quality problem for any of the 11 reviewees.**

### Reverts touching reviewees, resolved

| Date | Reverter | Original author | Gap | What / read |
|---|---|---|---|---|
| nx 03-17 | Jason | Miroslav Jonaš | 0d | deps-sync generator (#34888 reverts #34407). Jason doing same-day trunk protection. |
| nx 03-16 | Jason | Leosvel | 0d | postTasksExecution SIGINT fix (#34869). Same-day trunk protection. |
| nx 03-12 | Jason | Leosvel | 23d | tui-logger NX_TUI gate (#34797 reverts #34426, landed 02-17). Late discovery; the cost of a 23-day-latent regression argues for more TUI test coverage, not against either author. |
| nx 06-15 | Craigory | Craigory (self) | — | array-shape targetDefaults reverted "pending redesign and reapplication" (#36005), redesigned version re-landed 06-29 (#36049). Deliberate design iteration, executed cleanly. |
| nx 06-26 | Caleb | Caleb (self) | 1d | Product Hunt banner (#36129 reverts #36112). Planned removal — the banner came down after launch day. Not a quality signal. |
| ocean 04-21 | James Henry | Jason | 1d | "chore(repo): update nx to 22.7.0-beta.15" (#10860). Dependency-bump rollback, routine. |
| ocean 02-17 | Nicole | Mark Lindsey | 8d | GitHub combined install/authorize flow (#10063). Nicole caught and rolled back a teammate's integration regression — points in her favor. |
| ocean 04-21 ×2 | Altan | Altan (self) | 0d | client-bundle terminal streaming + tar extraction (#10877, #10861). Same-day self-rollback; trunk discipline. |
| ocean Feb-Jul ×7 | Louie | Louie (self) | 0d each | gradle target-prefix enablement ×3 (02-26 ×2, 03-12), early-termination wakeups ×2 (06-17, 06-19), aggregator spend override (06-30), go toolchain pin (07-15). All self-reverts, all same-day by subject match. |

Caveat on the ocean table: originals were resolved by quoted-subject match because squash merges drop the `This reverts commit` body line; where an original predates the shallow-history boundary the match may hit a re-land instead (one known case: #10689's "original" matched an 04-28 re-land). Gaps for the self-revert rows are reliable; treat cross-person gaps as approximate.

### Per-person revert exposure (commits reverted by someone else)

Jason 1 (routine dep bump), everyone else 0. Louie's 7 and Altan's 2 are self-reverts; Craigory's and Caleb's are planned removals. Nobody's product work was reverted by another person for correctness in either repo.

### Reads worth keeping

- **Louie's revert cluster is the flip side of his rollout style**: land behind a flag, revert fast when the canary disagrees, re-land. The gradle target-prefix change took three attempts over two weeks (02-26 → 03-12) before sticking — that's the only place iteration count is notable, and it's a chore-level repo config, not product code.
- **Jason is the reverter, not the reverted** — all three nx reverts of others' work were performed by him, two same-day. Consistent with the release-steward role his chore(repo) volume shows.

## PRs authored/merged and reviews given

Collected via GitHub search API. "Reviewed" = PRs by others they reviewed, using PR `updated:` date (GitHub can't filter by review date), so treat as approximate review load. Usernames verified: Altan = StalkAltan, Nicole = nixallover, Patrick = pmariglia.

| Person | nx merged | nx reviewed | ocean merged | ocean reviewed |
|---|---:|---:|---:|---:|
| Jason Jean (FrozenPandaz) | 393 | **553** | 51 | 18 |
| Craigory Coppola (AgentEnder) | 137 | **414** | 15 | 17 |
| Caleb Ukle (barbados-clemens) | 47 | 121 | 19 | **178** |
| Louie Weng (lourw) | 40 | 43 | 191 | 166 |
| Benjamin Cabanes (bcabanes) | 9 | 27 | 136 | 114 |
| Steve Pentland (stevepentland) | 2 | 1 | 33 | 42 |
| Juri Strumpflohner (juristr) | 27 | 12 | 16 | 28 |
| Altan Stalker (StalkAltan) | 8 | 3 | 221 | **510** |
| Nicole Oliver (nixallover) | 2 | 0 | 111 | 167 |
| Patrick Mariglia (pmariglia) | 0 | 0 | 25 | 47 |

Review load is the number commit counts hide, and it is striking:
- **Altan reviewed 510 ocean PRs while authoring 221** — he is simultaneously the top author and the top reviewer in the repo. That is the strongest single "unblocking others" data point in this analysis.
- **Jason reviewed 553 nx PRs on top of 393 authored** — same dual role in nx.
- **Craigory 414 nx reviews** — second gatekeeper on nx core.
- **Caleb's 178 ocean reviews against only 19 authored** — his review footprint in ocean is 9x his authoring footprint; he's a reviewer/enabler there (data API, DPE-adjacent), which his commit count alone would completely miss.
- Nicole (167) and Louie (166) both review more ocean PRs than most people author anywhere.

Notable high-interaction merged PRs per person are in the working notes (scratchpad `github-pr-stats.md`); highlights already cited inline above.

## Should any of this change a rating or a Q3 answer?

- **No rating changes from revert data.** Base rates are noise-level and every reviewee-adjacent revert resolves to self-revert, planned removal, or routine rollback.
- **Jason**: commit mix (50%+ repo/release chores) supports framing him as the person keeping the trains running in addition to fix volume — that is a Q2 (contribution) point, not a demerit.
- **Steve/Patrick**: do not let the low visible counts anchor their ratings — the missing cloud-infrastructure repo is where their work lives. Flagged in review-summary.md as a must-verify.
- **Craigory**: the targetDefaults revert-redesign-reland arc is a positive Q1 example (recognizing a shipped design was wrong and fixing it before users depended on it).
- **Nicole**: her 8-day revert of the GitHub connection-flow regression is a small but concrete guardianship example for Q4.
- **Altan**: 510 ocean reviews + 221 merged PRs is a rating-relevant fact — it substantiates "unblocking others" for the manager review better than any anecdote.
- **Caleb**: the 178 ocean reviews vs 19 authored reframes his ocean contribution from "small" to "reviewer/enabler" — worth a sentence in Q2.
