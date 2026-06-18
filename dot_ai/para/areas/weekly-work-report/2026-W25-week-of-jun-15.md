# Weekly Work Report — W25: June 15–18, 2026

> **Note:** This is a partial-week report (Mon–Thu). Generated Thursday June 18. The prior full-week report (W24, June 8–14) is already on file at [2026-W24-week-of-jun-08.md](./2026-W24-week-of-jun-08.md).

---

## TL;DR

| | nrwl/nx | nrwl/ocean |
|---|---|---|
| Merged PRs | 32 | 74 |
| Active contributors | 9 | 13 |
| Overall theme | Angular v22 wrap-up · docs cleanup · RC.4 | Polygraph major push · CIPE timeline overhaul · DTE early-termination |

**Flags for your attention:**

1. **ESLint v8 dropped** — breaking change merged without a migration-guide PR in sight yet
2. **Array-shape targetDefaults reverted** — docs landed in W24 before the feature was stable; process gap
3. **Early termination revert in ocean** — merged and same-day reverted; DTE logic still shaky there
4. **StalkAltan silent in ocean** after an 8-PR perf spree in W24 — worth a check
5. **Ocean velocity is very high** — 74 PRs Mon–Thu, Polygraph is sprinting hard

---

## nrwl/nx — 32 PRs

### leosvelperez (Leo Svelpe) — 8 PRs · Angular v22 + ESLint

Leo is finishing the Angular v22 support wave that started in W24. Every PR this week is a targeted follow-up:

- **Angular v22 component/unit-test schema changes** (#35960) — generator schema alignment for v22
- **jest-preset-angular 16.2.0 support for Angular v22** (#36001)
- **trustProxyHeaders for SSR engines on Angular v22** (#36000)
- **Angular v22 in Analog test setup** (#36003, `@nx/vitest`)
- **Angular-rspack: surface compilation failures as build errors** (#36018) — was silently swallowing errors
- **esbuild option paths resolved relative to workspace root** (#36017) — path resolution bug
- **Drop ESLint v8 support** (#36006, `feat(linter)!`) — **breaking change**, removes the v8 code path entirely
- **Cleanup: drop sub-default timeout overrides on release e2e** (#36009)

**Pattern:** Single-feature depth; finishing Angular v22 support is the mandate and he's executing cleanly. The ESLint v8 drop is the one that needs attention (see Flags).

---

### jaysoo (Jack Hsu) — 9 PRs · Docs cleanup + minor fixes

A systematic sweep of stale documentation — mostly removing outdated version tabs, deprecated options, and old framing that accumulated since Nx 15–17.

- **Remove deprecated SVGR option from withReact and NxReactWebpackPlugin docs** (#35985, #35984)
- **Remove stale Nx 15.7 reference from Node Fly.io guide** (#35986)
- **Remove dead legacy version tabs from Nx Cloud auth docs** (#36023)
- **Remove "prior to Nx 18" framing from Node proxy guide** (#36026)
- **Drop stale version-intro framing from concept docs** (#36024)
- **Drop deprecated Nx < 17 tab from cache-task-results** (#36025)
- **Update TypeScript version references in compile-multiple-formats guide** (#36027)
- **Add sandbox badge to nx READMEs** (#36012) — cross-repo polish
- **Bump happy-dom, tmp, form-data to patched versions** (#36013) — security patch

**Pattern:** All small, targeted, independent PRs. Docs debt reduction. No single large feature — this is housekeeping at scale.

---

### FrozenPandaz (Colum Ferry) — 5 PRs · Infrastructure + rspack

- **Multi-version compliance: rspack/rsbuild** (#35682) — `@rspack/core@2` and `@rsbuild/core@2` support, the big one this week for Colum
- **Migrate to nx 23.0.0-rc.4** (#36007)
- **Fix module-federation: bound static remote proxy port check** (#35996) — prevents `nx serve --host` collisions
- **Fix: read and replay cached failures when NX_CACHE_FAILURES enabled** (#35997)
- **Cap gradle workers on CI agents** (#36034) — prevents oversubscription

**Pattern:** Mix of infra plumbing (rc.4 bump, gradle), ecosystem compliance (rspack/rsbuild), and targeted bug fixes.

---

### AgentEnder (Craigory Coppola) — 1 PR

- **Revert array-shape targetDefaults support** (#36005, `feat(core)`) — reverted "pending redesign and reapproval"

This was documented in W24 (docs PR #35991 by AgentEnder himself landed same week). The revert in W25 means docs went out before the feature was stable. See Flags.

---

### Others — 4 PRs

- **llwt** (#36019) — docs: document Nx Cloud CIPE settings snapshotting in CI
- **nixallover** (#35995) — docs: add Nx Cloud workspace tour CTA to setup-ci page
- **barbados-clemens** (#36029) — docs: clarify default node version resolution in install-node step
- **cw-alexcroteau** (#35796) — fix: avoid tsconfig path false positives for sibling project roots
- **StalkAltan** (#35988) — chore: enable continuous assignment in nx (infra, cross-repo)

---

## nrwl/ocean — 74 PRs

### MaxKless (Max Kless) — ~18 PRs · Polygraph CLI & session UI

Max is the most active contributor this week across both repos. He's driving the Polygraph CLI and session experience forward on multiple fronts simultaneously:

**Features:**
- **Richer session descriptions** (#11922) — callouts, tables, link chips in the session description renderer
- **Codex plugin via official codex plugin commands** (#11784) — install via `codex plugin add` rather than manual patching
- **Responsive session-list table, active-only default, archived repos** (#11892) — major sessions list UI rework
- **`--description` required on PR-flow `git push-branch`** (#11874) — enforces description on automated PRs
- **Deterministic parent-log capture via agent-capture mappings** (#11889) — fixes non-deterministic log attribution
- **Auth diagnostics logging to CLI** (#11921) — surfaces auth failures clearly
- **Copy-on-hover icon next to session ID** (#11910)
- **Resume command on agent exit, resolve agent IDs** (#11915)

**Fixes:**
- Resume claude from parent agent's original cwd (#11904)
- Warn before archiving CLI sessions with open PRs (#11890)
- Fail loudly when repo materialization aborts session start (#11891)
- Normalize CLI `--url` and rename `link-reference` flag (#11894)
- Responsive table layout for CLI session pickers (#11935)
- Setup script placeholder follows mode toggle (#11932)
- Return all repos from session candidates endpoint (#11906)
- Drop redundant CLI option alias/negation/camelCase fields (refactor, #11968)

**Pattern:** Max is in a sustained sprint across CLI UX, session management, and infrastructure. High PR volume but each is scoped. No single huge refactor — iterative polish and feature completion.

---

### bcabanes (Beno Caban) — ~10 PRs · CIPE timeline overhaul

Beno owns the CIPE execution timeline and this week represents a concentrated push to make it production-grade:

**Features:**
- **Motion system for CIPE execution timeline** (#11857) — animation layer for task transitions
- **Default timeline view to All tasks** (#11945) — was filtered on load, now shows everything
- **Refactor: adopt base-ui as private engine of ui-primitives** (#11854) — major underlying refactor, unblocks future primitives

**Fixes:**
- Agent drawer resources & utilization bars readable (#11943)
- Bound agent lead-in band to its first workflow step (#11917)
- Derive agent online/offline flags from Agent Nx Tasks step (#11914)
- Base agent-drawer resources on advertised resource class (#11912)
- Correct timeline mark label & explain dashed lines (#11897)
- Style: drop em dashes from CIPE timeline copy (#11896)

**Perf/chore:**
- Bundle server deps & trim eager imports (#11855)
- Remove admin analytics section (#11842)
- CI: remove bundle-size conformance rule to build once per CIPE (#11911)

**Pattern:** Focused on one surface (CIPE timeline) with depth. The base-ui adoption is the most architecturally significant PR — it's a foundational change to how ui-primitives works.

---

### lourw (Lou R.) — ~8 PRs · Early termination + billing

**Early termination (DTE):**
- Ensure early termination shuts down agents early (#11929)
- Early terminate valkey agents with unclaimable work (#11925)
- Early terminate valkey-indexed agents with no work (#11923)
- Wake agents when early termination is ready (#11946) — **later reverted same day** (#11961)

**Billing/add-ons:**
- Add admin add-on plan modifiers (#11883)
- Avoid provisioning dedicated cluster for resource-only add-ons (#11899)
- Discount add-on billing invoice line items, update descriptions (#11920)
- Refactor plan modifier helpers (#11895)

**Other:**
- Fix: include hours in run duration (#11954)
- Fix: propagate Nx Cloud 400 error details to CI (#11953)

**Pattern:** Two threads: DTE early-termination (4 PRs, one reverted — see Flags) and billing add-on infrastructure. The early-termination work is iterative and clearly mid-flight.

---

### rarmatei (Rares Matei) — ~6 PRs · Sandbox + CI infrastructure

- **Force-enable sandbox report generation via env var** (#11970) — ops escape hatch
- **Perf: log RSS and peak RSS in periodic stats** (#11973) — observability
- **Metrics service-account bootstrap script** (#11865) — infra tooling
- **Fix: strict-mode sandbox failures clear and consistent** (#11951)
- **Fix: clarify Nx Cloud branch in sandbox fix prompt and CLI** (#11950)
- **Fix: always track all chdir events** in workflow-controller (#11913)
- **Cherry-pick: 2606.02.1 sandbox fixes** (#11862)

**Pattern:** Sandbox reliability and observability. Rares is the main owner of sandbox fix quality; this week is about making sandbox failures legible and the CI pipeline more robust.

---

### nartc (Chau Tran) — ~6 PRs · Polygraph auth + UX

- **OAuth and PAT auth for CLI routes** (#11735) — significant auth feature; CLI now supports both auth modes
- **Allow disconnecting repositories** (#11805) — self-service repo management
- **Privacy policy page** (#11931)
- **Open share modal before public link** (#11924) — UX ordering fix
- **Change support email to trypolygraph.com** (#11942)
- **Shared settings guidance doc** (#11963)

**Pattern:** Auth feature (large) plus UX polish and housekeeping. The OAuth/PAT PR is the substantial one.

---

### mrl-jr (Morgan R.) — ~6 PRs · Polygraph session UI

- **Refresh PRs button & skip archived repos on auto-connect** (#11936)
- **Responsive session details screen on mobile** (#11937)
- **Split PR-not-found flag from linkFailed, surface accurately** (#11939)
- **Connect button loading state & retry repo listing once** (#11947)
- **Gate prod PostHog on polygraph app URL** (#11907)
- **Keep sidebar relative time from drifting into the future** (#11908)

**Pattern:** Polish and reliability across the Polygraph session UI. All small, targeted fixes.

---

### vsavkin (Victor Savkin) — 4 PRs · Polygraph repository descriptions

- **Always index Polygraph repository descriptions** (#11902)
- **Gate description indexing on deployment mode** (#11901)
- **Fix: avoid repository description index race** (#11919)
- **Fix: omit polygraph candidate descriptions** (#11926)

**Pattern:** One focused thread: repository description indexing. Victor shipped, found a race, fixed it, and then also trimmed what gets surfaced to candidates.

---

### Cammisuli (Carlo Ammisuli) — 5 PRs · Polygraph CLI first-run + Codex

- **Run agent/config setup on first CLI run** (#11918) — zero-config onboarding for new users
- **Add git dirs as writable roots for Codex sandbox** (#11956) — Codex sandbox compatibility fix
- **Docs: replace `polygraph config strategies` with `polygraph config`** (#11960)
- **Chore: print Atlas allow-list instructions automatically in serve-snapshot pre-flight** (#11941)
- **Fix: only show session resume hint when current multiplexer differs** (#11829)

**Pattern:** Onboarding and Codex integration polish. The first-run setup PR is user-facing and meaningful.

---

### meeroslav (Miro Krisko) — 2 PRs · Self-healing

- **Support custom format command for fixes** (#11940) — lets teams plug in their own formatter (e.g. `biome`, `deno fmt`) instead of the default
- (Also credited on W24 hash-detail logging PRs that merged Monday)

**Pattern:** Narrow self-healing feature. One clean feature PR.

---

### Others

- **nixallover** (#11928) — fix: keep PAT-authenticated VCS integrations editable
- **jaysoo** (#11900, #11927) — sandbox badge label fix; narrow storybook imports
- **FrozenPandaz** (#11903) — repo: migrate to nx 23.0.0-rc.4

---

## Flags for Your Attention

### 1. ESLint v8 dropped without visible migration guide (nx #36006)

`feat(linter)!: drop eslint v8 support` landed Monday June 16 (leosvelperez). This is a breaking change in `@nx/linter`. Users still on ESLint v8 will hit failures after upgrading. No docs PR or migration generator PR visible in the merged set this week. If the migration guide is coming in a follow-up, make sure it lands before the RC becomes stable.

### 2. Array-shape targetDefaults: docs before feature (nx #36005, #35991)

@AgentEnder documented and merged array-shape `targetDefaults` support in W24 (docs PR #35991). In W25, the feature itself was reverted (#36005, "pending redesign and reapproval"). The docs are now in the codebase pointing to a feature that doesn't exist. Track the stale docs cleanup and make sure the redesign has a clear owner and timeline.

### 3. Early termination revert in ocean (ocean #11961 reverts #11946)

lourw merged "wake agents when early termination is ready" (#11946) and reverted it same day (#11961). The three other early-termination PRs are still in. This suggests the logic is in flux — the reverted PR may have caused agents to exit incorrectly. Worth checking if the area has test coverage and whether the remaining three early-termination PRs are stable.

### 4. StalkAltan absent from ocean this week

In W24, StalkAltan had 8 PRs, all DTE/valkey/MongoDB performance optimizations. This week: zero in ocean (one minor nx chore). Either on PTO, shifting to planning, or blocked on something. The DTE work in W24 was high-impact; unclear if there's a follow-up thread that's stalled.

### 5. Ocean volume — 74 PRs in 4 days

Polygraph is clearly in a sprint. MaxKless alone has ~18 PRs Mon–Thu. That's a healthy pace but at this density it's worth asking whether reviews are deep enough, especially on architectural changes like bcabanes's base-ui adoption (#11854) and nartc's OAuth/PAT auth for CLI (#11735). Both are large-surface PRs.

---

## Contributor Summary Table

### nrwl/nx

| Contributor | PRs | Focus | Style |
|---|---|---|---|
| leosvelperez | 8 | Angular v22 completion + ESLint v8 drop | One feature, all PRs |
| jaysoo | 9 | Docs cleanup + security bump | Many small independent PRs |
| FrozenPandaz | 5 | rspack/rsbuild multi-version + RC.4 + fixes | Mixed infra + ecosystem |
| AgentEnder | 1 | Revert array-shape targetDefaults | Single revert |
| llwt | 1 | Docs: CIPE settings snapshotting | Docs |
| nixallover | 1 | Docs: workspace tour CTA | Docs |
| barbados-clemens | 1 | Docs: node version resolution | Docs |
| cw-alexcroteau | 1 | Fix: tsconfig path false positives | Community fix |
| StalkAltan | 1 | Enable continuous assignment (infra) | Infra |

### nrwl/ocean

| Contributor | PRs | Focus | Style |
|---|---|---|---|
| MaxKless | ~18 | Polygraph CLI + session UX | High-velocity, scoped PRs |
| bcabanes | ~10 | CIPE timeline overhaul | Depth on one surface |
| lourw | ~8 | Early termination + billing add-ons | Two threads in parallel |
| rarmatei | ~6 | Sandbox reliability + CI infra | Targeted fixes + ops tooling |
| nartc | ~6 | Polygraph auth (OAuth/PAT) + UX | Large auth feature + polish |
| mrl-jr | ~6 | Polygraph session UI | Polish and reliability |
| vsavkin | 4 | Repository description indexing | One focused thread |
| Cammisuli | 5 | First-run onboarding + Codex | Onboarding + compat |
| meeroslav | 2 | Self-healing custom format | One clean feature |
| nixallover | 1 | PAT VCS integrations editable | Fix |
| jaysoo | 2 | Sandbox badge + storybook | Small fixes |
| FrozenPandaz | 1 | RC.4 migration | Infra |
