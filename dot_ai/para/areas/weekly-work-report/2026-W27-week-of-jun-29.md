# Weekly Work Report — Week of June 29–July 5, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-06-29 and 2026-07-05._

---

## TL;DR

Nx this week was dominated by **@leosvelperez (Leo)**, who merged 26 of the repo's 59 PRs (44%) — nearly all of it hardening the TypeScript 6, ESLint 9, and Angular 22 migrations shipped in recent betas: `.tsbuildinfo` scoping, TS6059 rootDir errors, `esModuleInterop` defaults, angular-eslint v22 breaking changes, and flat-config migrations. **@FrozenPandaz** kept the repo moving through three self-hosted beta migrations (beta.4 → beta.5 → beta.6) plus core/Gradle fixes. **@jaysoo** shipped a Windows nx.bat fix, the `create-nx-workspace` current-directory scaffold feature, and docs cleanup.

Ocean had no single dominant contributor this week but three reverts landed and were pulled within days of merging: **@rarmatei (Rares)** re-enabled the nx-api cache then reverted it; **@lourw (Lauren)** shipped a per-customer dedicated-compute minimum-spend override then reverted it (later re-landing a different version); and **@meeroslav** preserved local VCS author behavior then reverted that too. Feature work concentrated in Polygraph: **@MaxKless (Max)** rebuilt session search end-to-end, while **@JamesHenry (James)** shipped a competing session-resume picker unification in the same week — worth confirming these were coordinated. **@bcabanes (Benjamin)** continued a sustained reliability pass on the Nx Cloud run timeline and agent-logs UI.

---

## nrwl/nx

### @leosvelperez (Leo) — TS6/ESLint9/Angular22 migration hardening (26 merged)

By far the largest single body of work in either repo this week — every PR ties back to stabilizing the TypeScript 6, ESLint 9, and Angular 22 upgrades.

**TypeScript 6 build correctness:**

| PR | Title |
|----|-------|
| [#36037](https://github.com/nrwl/nx/pull/36037) | fix(core): support `${configDir}` in tsconfig path alias resolution |
| [#36137](https://github.com/nrwl/nx/pull/36137) | fix(js): scope incremental type-check .tsbuildinfo per project |
| [#36163](https://github.com/nrwl/nx/pull/36163) | fix(js): restore the pre-TypeScript 6 default of loading all @types |
| [#36184](https://github.com/nrwl/nx/pull/36184) | fix(js): prevent Windows TS6059 rootDir errors in tsc builds |
| [#36188](https://github.com/nrwl/nx/pull/36188) | fix(webpack): prevent TS6059 when a tsc build bundles a workspace lib |
| [#36217](https://github.com/nrwl/nx/pull/36217) | fix(bundling): prevent TS6059 when an app imports a workspace lib from source |
| [#36225](https://github.com/nrwl/nx/pull/36225) | fix(js): preserve esModuleInterop default when migrating to TypeScript 6 |
| [#36186](https://github.com/nrwl/nx/pull/36186) | fix(react): validate typecheck in the React 19 migration |

**Package/pruning correctness:**

| PR | Title |
|----|-------|
| [#36138](https://github.com/nrwl/nx/pull/36138) | fix(js): prevent doubled output paths in buildable library path mappings |
| [#36016](https://github.com/nrwl/nx/pull/36016) | fix(js): preserve npm allowScripts allowlist in pruned package.json |
| [#36040](https://github.com/nrwl/nx/pull/36040) | fix(core): exclude direct-dependency overrides from generated package.json |
| [#36020](https://github.com/nrwl/nx/pull/36020) | fix(core): prevent non-npm devEngines pin from breaking npm registry lookups |

**ESLint 9 / Angular ESLint v22 migration:**

| PR | Title |
|----|-------|
| [#36161](https://github.com/nrwl/nx/pull/36161) | fix(react): bump eslint-plugin-react below 7.35 for ESLint 9 compatibility |
| [#36168](https://github.com/nrwl/nx/pull/36168) | fix(react): stop pinning eslint-plugin-react in generated projects |
| [#36160](https://github.com/nrwl/nx/pull/36160) | fix(linter): install angular-eslint when converting Angular configs to flat config |
| [#36180](https://github.com/nrwl/nx/pull/36180) | fix(linter): run typescript-eslint v8 rule migrations for scoped-only workspaces |
| [#36200](https://github.com/nrwl/nx/pull/36200) | fix(linter): reconcile angular-eslint v22 breaking changes in flat config |
| [#36204](https://github.com/nrwl/nx/pull/36204) | fix(linter): harden the ESLint v9 flat-config migration |
| [#36202](https://github.com/nrwl/nx/pull/36202) | fix(testing): update eslint-plugin-cypress for ESLint 9 compatibility |
| [#36183](https://github.com/nrwl/nx/pull/36183) | fix(angular): make nx migrate to Angular 22 leave a buildable workspace |

**Build tooling misc:**

| PR | Title |
|----|-------|
| [#36136](https://github.com/nrwl/nx/pull/36136) | fix(rspack): use contenthash for chunkFilename to prevent stale chunks |
| [#36162](https://github.com/nrwl/nx/pull/36162) | fix(rsbuild): bump @rsbuild/plugin-sass with @rsbuild/core for the v2 migration |
| [#36193](https://github.com/nrwl/nx/pull/36193) | fix(devkit): restore prettier v2 support in formatFiles |
| [#36185](https://github.com/nrwl/nx/pull/36185) | fix(testing): disable justInTimeCompile for webpack Cypress component testing |
| [#36198](https://github.com/nrwl/nx/pull/36198) | fix(core): speed up bun lockfile parsing |
| [#36224](https://github.com/nrwl/nx/pull/36224) | cleanup(core): reduce redundant work in project graph construction |

**Work character:** This is a single, coherent migration-stabilization effort, not scattered issue triage — every PR traces back to fallout from the TS6/ESLint9/Angular22 upgrades that shipped in recent betas. Concentrating 44% of the week's Nx output in one person on the same surface is efficient in the short term but is a bus-factor risk if Leo is the only one who understands the full scope of what broke and why.

---

### @FrozenPandaz — Self-migration chores, core reliability, Gradle (11 merged)

**Self-hosted repo migration:**

| PR | Title |
|----|-------|
| [#36174](https://github.com/nrwl/nx/pull/36174) | chore(repo): build npm:public packages with parallel=4 in nx-build e2e |
| [#36178](https://github.com/nrwl/nx/pull/36178) | chore(repo): migrate to nx 23.1.0-beta.5 |
| [#36206](https://github.com/nrwl/nx/pull/36206) | chore(repo): fold beta.5-run learnings into nx-multi-repo-migrate skill |
| [#36213](https://github.com/nrwl/nx/pull/36213) | chore(repo): migrate to nx 23.1.0-beta.6 |

**Core reliability:**

| PR | Title |
|----|-------|
| [#36127](https://github.com/nrwl/nx/pull/36127) | fix(core): refine the end-of-run performance report recommendations |
| [#36177](https://github.com/nrwl/nx/pull/36177) | feat(core): re-add isCacheableTask helper |
| [#36214](https://github.com/nrwl/nx/pull/36214) | fix(core): set NX_CLI_SET in batch worker processes |
| [#36227](https://github.com/nrwl/nx/pull/36227) | fix(nx-cloud): use standard utm params on cloud prompt links |
| [#36226](https://github.com/nrwl/nx/pull/36226) | fix(core): use standard utm params on performance-report links |

**Gradle:**

| PR | Title |
|----|-------|
| [#36210](https://github.com/nrwl/nx/pull/36210) | fix(gradle): make project graph reports machine-portable |
| [#36211](https://github.com/nrwl/nx/pull/36211) | fix(gradle): derive dependent-task input extensions from the task model instead of scanning disk |

**Work character:** Dogfooding the 23.1 betas in the nx repo itself (beta.4 → beta.5 → beta.6 in one week) plus routine core/Gradle upkeep. No single feature — a stabilization-and-upkeep week.

---

### @jaysoo — Windows fix, workspace scaffold feature, docs (7 merged)

| PR | Title |
|----|-------|
| [#36048](https://github.com/nrwl/nx/pull/36048) | fix(core): run the nx.bat wrapper for dot-nx setup on windows |
| [#36122](https://github.com/nrwl/nx/pull/36122) | chore(repo): migrate to nx 23.1.0-beta.4 |
| [#36145](https://github.com/nrwl/nx/pull/36145) | fix(misc): remove duplicate nx init cloud-prompt telemetry event |
| [#36134](https://github.com/nrwl/nx/pull/36134) | feat(core): scaffold create-nx-workspace into the current directory |
| [#36209](https://github.com/nrwl/nx/pull/36209) | docs(nx-cloud): link Settings > Add-ons to cloud shortcut |
| [#36208](https://github.com/nrwl/nx/pull/36208) | docs(misc): link Docker page to dedicated compute cluster |
| [#36212](https://github.com/nrwl/nx/pull/36212) | docs(misc): redirect KB article link for configure-vite |

**Work character:** One user-facing feature (scaffolding into the current directory — a common ask for `create-nx-workspace .`-style usage) plus routine docs and telemetry cleanup.

---

### @AgentEnder (Craigory) — Target defaults, CI trust, terminal UI (4 merged)

| PR | Title |
|----|-------|
| [#36142](https://github.com/nrwl/nx/pull/36142) | fix(core): apply target defaults when project.json overrides an inferred run-commands target with different commands |
| [#36146](https://github.com/nrwl/nx/pull/36146) | fix(repo): trust wix/brew tap so macOS detox CI can install applesimutils |
| [#36049](https://github.com/nrwl/nx/pull/36049) | feat(core): support filtered targetDefaults via the nested-array shape |
| [#35868](https://github.com/nrwl/nx/pull/35868) | feat(core): add mouse support to the terminal UI |

---

### @polygraph-snapshot-app[bot] — Automated fixes (2 merged)

| PR | Title |
|----|-------|
| [#35747](https://github.com/nrwl/nx/pull/35747) | fix(core): clarify nx sync remediation messaging and surface spinner output in non-tty |
| [#35805](https://github.com/nrwl/nx/pull/35805) | fix(js): resolve catalog references in pruned package.json output |

---

### Community and single-PR contributors (9 merged)

| Contributor | PR | Title |
|---|----|-------|
| @lourw | [#36228](https://github.com/nrwl/nx/pull/36228) | chore(repo): update image tags |
| @Roozenboom | [#36201](https://github.com/nrwl/nx/pull/36201) | fix(linter): update terminal cli regex for local-dist build |
| @StalkAltan (Altan) | [#36179](https://github.com/nrwl/nx/pull/36179) | docs(nx-cloud): add agent-assisted Nx Agents setup |
| @llwt | [#36154](https://github.com/nrwl/nx/pull/36154) | fix(graph): prevent project details web view top from being clipped |
| @cyphercodes | [#36133](https://github.com/nrwl/nx/pull/36133) | fix(js): avoid import locator unicode position panic |
| @wilsonpinto | [#36125](https://github.com/nrwl/nx/pull/36125) | fix(vite): detect @vitejs/plugin-vue2 (vite:vue2) for vue-tsc typecheck |
| @titanniya542-spec | [#36070](https://github.com/nrwl/nx/pull/36070) | fix(vite): update deprecation docs link |
| @SAY-5 | [#35666](https://github.com/nrwl/nx/pull/35666) | fix(core): throw actionable error when pnpm .modules.yaml is missing |
| @shairez | [#34890](https://github.com/nrwl/nx/pull/34890) | feat(vite): add configurable ts paths build/test targets and stabilize build coordination |

**Work character:** Mostly one-off community/external fixes. @wilsonpinto, @titanniya542-spec, @SAY-5, @shairez, @cyphercodes, @Roozenboom don't map to internal roster entries — treat as external contributions merged during the week.

---

## nrwl/ocean

### @rarmatei (Rares) — io-trace daemon reliability & performance (11 merged)

**io-trace performance & reliability:**

| PR | Title |
|----|-------|
| [#12142](https://github.com/nrwl/ocean/pull/12142) | fix(io-trace): auto-derive GOMEMLIMIT from the container memory limit |
| [#12149](https://github.com/nrwl/ocean/pull/12149) | fix(io-trace): rebuild parentToChildren map during cleanup to avoid drain stalls |
| [#12157](https://github.com/nrwl/ocean/pull/12157) | fix(io-trace): stream staged report to storage instead of re-marshalling |
| [#12161](https://github.com/nrwl/ocean/pull/12161) | perf(io-trace): trim buffer entry footprint and drop pointer map |
| [#12182](https://github.com/nrwl/ocean/pull/12182) | feat(io-trace): cherry pick perf improvements |
| [#12207](https://github.com/nrwl/ocean/pull/12207) | fix(workflows): bind io-trace-daemon pprof to the pod IP |

**nx-api cache experiment (reverted same week):**

| PR | Title |
|----|-------|
| [#12148](https://github.com/nrwl/ocean/pull/12148) | chore: re-enable nx-api cache and add bundle canary to verify it |
| [#12150](https://github.com/nrwl/ocean/pull/12150) | Revert "chore: re-enable nx-api cache and add bundle canary to verify…" |

**Other:**

| PR | Title |
|----|-------|
| [#12181](https://github.com/nrwl/ocean/pull/12181) | chore(client-bundle): vendor isCacheableTask for nx 23 compat (#11505…) |
| [#12184](https://github.com/nrwl/ocean/pull/12184) | feat(nx-cloud): restore GitHub App auth option for ST/on-prem (#10973) |
| [#12160](https://github.com/nrwl/ocean/pull/12160) | fix(nx-api): stop posting CIPE comments on unrelated closed PRs |

**Work character:** A focused io-trace-daemon reliability pass (drain stalls, streaming reports, buffer footprint, pprof binding) — coherent and clearly the primary thread. The nx-api cache re-enable was reverted within a day of merging (see Needs Your Attention).

---

### @lourw (Lauren) — Dedicated-compute billing + add-on gating (9 merged)

**Dedicated-compute minimum spend (revert-and-reland):**

| PR | Title |
|----|-------|
| [#12132](https://github.com/nrwl/ocean/pull/12132) | fix(aggregator): apply credit discounts before dedicated compute minimum spend |
| [#12164](https://github.com/nrwl/ocean/pull/12164) | fix(nx-cloud): clarify dedicated compute minimum spend copy |
| [#12172](https://github.com/nrwl/ocean/pull/12172) | fix(aggregator): include add-on credits in Nx Cloud credit discount |
| [#12171](https://github.com/nrwl/ocean/pull/12171) | feat(aggregator): per-customer dedicated compute minimum spend override |
| [#12175](https://github.com/nrwl/ocean/pull/12175) | Revert "feat(aggregator): per-customer dedicated compute minimum spend override" |
| [#12176](https://github.com/nrwl/ocean/pull/12176) | fix(aggregator): plan modifier to adjust minimum dedicated compute spend |

**Add-on gating:**

| PR | Title |
|----|-------|
| [#12188](https://github.com/nrwl/ocean/pull/12188) | feat(nx-api): set workspaces to warn when sandboxing add-on is enabled |
| [#12186](https://github.com/nrwl/ocean/pull/12186) | feat(nx-api): suppress add-on enabled email and notification for enterprise orgs |
| [#12187](https://github.com/nrwl/ocean/pull/12187) | feat(nx-cloud): gate sandbox enforcement toggle behind add-ons on public deployment |

**Work character:** Revenue-impacting billing logic for dedicated compute, including a same-week revert-and-reland cycle on the per-customer override (see Needs Your Attention) — worth confirming the reland (#12176) has closed whatever gap caused #12171 to be pulled.

---

### @JamesHenry (James) — Polygraph terminal, OAuth, security, onboarding (8 merged)

| PR | Title |
|----|-------|
| [#12156](https://github.com/nrwl/ocean/pull/12156) | docs: add Cursor Cloud dev environment setup notes (Nx Cloud + Polygraph) |
| [#12136](https://github.com/nrwl/ocean/pull/12136) | fix(polygraph): advise on OAuth refresh lock timeout |
| [#12139](https://github.com/nrwl/ocean/pull/12139) | feat(polygraph): Windows Terminal multiplexer support |
| [#12158](https://github.com/nrwl/ocean/pull/12158) | feat(polygraph): unify session-resume picker into one search box |
| [#12159](https://github.com/nrwl/ocean/pull/12159) | fix(polygraph-cli): render auth refresh failures as clean errors |
| [#12162](https://github.com/nrwl/ocean/pull/12162) | fix(security): guard polygraph seed script against non-local Mongo targets (NXA-1960) |
| [#12178](https://github.com/nrwl/ocean/pull/12178) | fix(polygraph): onboarding and profile papercuts |
| [#12219](https://github.com/nrwl/ocean/pull/12219) | feat(polygraph): tear down child panes and print a farewell on parent exit |

**Work character:** Broad Polygraph UX and terminal-multiplexer work plus one tracked security fix (NXA-1960). #12158's session-resume picker unification overlaps with MaxKless's session-search rework this same week (see Needs Your Attention).

---

### @bcabanes (Benjamin) — Nx Cloud run timeline & agent-logs reliability (8 merged)

| PR | Title |
|----|-------|
| [#12144](https://github.com/nrwl/ocean/pull/12144) | fix(nx-cloud): show the selected agent's own logs in the drawer |
| [#12143](https://github.com/nrwl/ocean/pull/12143) | perf(nx-cloud): bundle the SSR server build by default |
| [#12147](https://github.com/nrwl/ocean/pull/12147) | fix(nx-cloud): guard agent log resolution against prefix mismatch |
| [#12153](https://github.com/nrwl/ocean/pull/12153) | fix(nx-cloud): correct timeline rendering of repeated non-cacheable tasks |
| [#12163](https://github.com/nrwl/ocean/pull/12163) | fix(nx-cloud): keep per-worktree NX_CLOUD_APP_URL past op-secrets |
| [#12166](https://github.com/nrwl/ocean/pull/12166) | fix(nx-cloud): stamp DTE-v2 startedAt as ISO date |
| [#12155](https://github.com/nrwl/ocean/pull/12155) | fix(nx-cloud): show each restart attempt's own logs & a lane-0 spine |
| [#12165](https://github.com/nrwl/ocean/pull/12165) | fix(nx-cloud): scope timeline bar ids by run to avoid cross-run collisions |

**Work character:** A sustained, coherent reliability push on the run timeline and agent-log surfaces — this is clearly Benjamin's ongoing project, continuing the pattern from the prior two weeks' reports.

---

### @MaxKless (Max) — Polygraph session search & resume overhaul (6 merged)

| PR | Title |
|----|-------|
| [#12101](https://github.com/nrwl/ocean/pull/12101) | feat(polygraph): add hybrid free-text session search endpoint |
| [#12100](https://github.com/nrwl/ocean/pull/12100) | feat(polygraph): rework session-resume picker into an interactive search browser |
| [#12168](https://github.com/nrwl/ocean/pull/12168) | feat(polygraph): internal session-search playground |
| [#12170](https://github.com/nrwl/ocean/pull/12170) | feat(polygraph): shared-repo boost for session relatedness (playground) |
| [#12154](https://github.com/nrwl/ocean/pull/12154) | feat(polygraph): allow switching agents when resuming local sessions |
| [#12190](https://github.com/nrwl/ocean/pull/12190) | feat(polygraph): tune session search + smarter relatedness ranking |

**Work character:** The clearest single-feature push of the week outside of Benjamin's timeline work — an end-to-end rebuild of session search and resume (endpoint, UI, ranking, playground for tuning). Directly overlaps with JamesHenry's #12158 (see Needs Your Attention).

---

### @nartc (Chau) — Demo provisioning + session graph (4 merged)

| PR | Title |
|----|-------|
| [#12134](https://github.com/nrwl/ocean/pull/12134) | fix(polygraph): harden demo provisioning backend |
| [#12135](https://github.com/nrwl/ocean/pull/12135) | fix(polygraph): handle demo provisioning retries |
| [#12193](https://github.com/nrwl/ocean/pull/12193) | feat(polygraph): add org session graph visualization |
| [#12213](https://github.com/nrwl/ocean/pull/12213) | fix(polygraph): pixi unsafe eval for CSP |

---

### @Cammisuli (Jon) — Session reliability + demo account management (4 merged)

| PR | Title |
|----|-------|
| [#12078](https://github.com/nrwl/ocean/pull/12078) | fix(polygraph): keep session clone remotes on HTTPS inside agent sandboxes |
| [#12045](https://github.com/nrwl/ocean/pull/12045) | fix(polygraph): restore CI status in session API response |
| [#12204](https://github.com/nrwl/ocean/pull/12204) | feat(polygraph): only show remove demo button with multiple accounts |
| [#12203](https://github.com/nrwl/ocean/pull/12203) | feat(polygraph): mark demo accounts as deleted instead of purging them |

_Note: last week's report attributed `@Cammisuli` to "Colum" — the personnel record for Jon (`jon.md`) states his full name is Jonathan Cammisuli, which matches the handle directly. Corrected here; worth fixing the prior report if it's referenced elsewhere._

---

### @StalkAltan (Altan) — DTE / agents reliability (4 merged)

| PR | Title |
|----|-------|
| [#12137](https://github.com/nrwl/ocean/pull/12137) | feat(nx-cloud): add Nx Agents migration prompt |
| [#11056](https://github.com/nrwl/ocean/pull/11056) | feat(nx-cloud): add idempotent output merge for DTE artifact restore |
| [#12192](https://github.com/nrwl/ocean/pull/12192) | fix(client-bundle): drain V4 tasks before terminal shutdown |
| [#12198](https://github.com/nrwl/ocean/pull/12198) | fix(nx-api): align VCS comment run status with reconciled run status |

---

### @AI-JamesHenry — Polygraph agent-mode UX (3 merged)

| PR | Title |
|----|-------|
| [#12122](https://github.com/nrwl/ocean/pull/12122) | feat(polygraph): clarify agent run mode setup |
| [#12189](https://github.com/nrwl/ocean/pull/12189) | feat(polygraph): add prompt shorthand agent mode |
| [#12200](https://github.com/nrwl/ocean/pull/12200) | fix(polygraph-cli): defer shorthand repo selection |

**Work character:** Same contributor as JamesHenry, different (AI-assisted) authoring identity — consistent with the pattern noted in prior weeks' reports.

---

### @nixallover (Nick) — Usage/billing UI (2 merged)

| PR | Title |
|----|-------|
| [#12173](https://github.com/nrwl/ocean/pull/12173) | fix(organization-usage): hide unused credit categories in usage chart |
| [#12212](https://github.com/nrwl/ocean/pull/12212) | fix(nx-cloud): scope Rewind to members, use computation time saved |

---

### @meeroslav — VCS author preservation (reverted same week) (2 merged)

| PR | Title |
|----|-------|
| [#12179](https://github.com/nrwl/ocean/pull/12179) | fix(nx-api): preserve local VCS author |
| [#12183](https://github.com/nrwl/ocean/pull/12183) | Revert "fix(nx-api): preserve local VCS author (#12179)" |

---

### @mrl-jr (Michael) — Session sync + activation tracking (2 merged)

| PR | Title |
|----|-------|
| [#12152](https://github.com/nrwl/ocean/pull/12152) | fix(polygraph): cut redundant GitHub Actions calls in session sync |
| [#12169](https://github.com/nrwl/ocean/pull/12169) | feat(polygraph): track PostHog activation funnel and PR events |

---

### @AgentEnder (Craigory) — Nx Cloud UI (2 merged)

| PR | Title |
|----|-------|
| [#12146](https://github.com/nrwl/ocean/pull/12146) | fix(nx-cloud): sync multiselect row highlight with checkbox state in anlytics |
| [#12131](https://github.com/nrwl/ocean/pull/12131) | feat(client): set a clickable TUI cloud link via the Nx setCloudLink hook |

---

### Single-PR contributors (5 merged)

| Contributor | PR | Title |
|---|----|-------|
| @FrozenPandaz | [#12209](https://github.com/nrwl/ocean/pull/12209) | chore(repo): migrate to nx 23.1.0-beta.6 |
| @llwt | [#12201](https://github.com/nrwl/ocean/pull/12201) | Fix marketing prompt overlap with Pylon |
| @barbados-clemens | [#12151](https://github.com/nrwl/ocean/pull/12151) | fix(client-bundle): tolerate FIPS OpenSSL where MD5 is unavailable |
| @pmariglia | [#12145](https://github.com/nrwl/ocean/pull/12145) | feat(nx-cloud-workflows-controller): Higher default rate limit for controller |
| @juristr (Juri) | [#12097](https://github.com/nrwl/ocean/pull/12097) | fix(polygraph): land tmux split cwd in repo, not session folder |

---

## Needs Your Attention

### 1. Three same-week reverts across three unrelated subsystems
**@rarmatei** re-enabled the nx-api cache (#12148) and reverted it (#12150) the next day. **@lourw** shipped a per-customer dedicated-compute minimum-spend override (#12171), reverted it (#12175), then re-landed a different implementation (#12176). **@meeroslav** preserved local VCS author behavior (#12179) and reverted it (#12183) with no reland yet. Three independent revert cycles in one week — infra caching, billing, and VCS integration — is a pattern worth a quick pulse check: **is there a pre-merge staging/canary gap that would have caught these before they reached main?** None of these individually look alarming, but three in one week on three different systems suggests a process gap rather than three unrelated one-off mistakes.

### 2. Possible duplicate work on the Polygraph session-resume picker
**@MaxKless** rebuilt session search and resume end-to-end this week (#12100 "rework session-resume picker into an interactive search browser", plus the search endpoint, ranking tuning, and playground). **@JamesHenry** shipped #12158 "unify session-resume picker into one search box" in the same window. Both PRs touch the same UI surface with similar framing. **Confirm these were sequenced/coordinated** (e.g., James building on Max's endpoint) rather than two people independently redesigning the same picker — worth a quick check before either piece of work gets thrown away.

### 3. Leo carried 44% of Nx's merged PRs alone, all on one migration surface
**@leosvelperez** merged 26 of 59 Nx PRs this week, entirely hardening the TS6/ESLint9/Angular22 migrations. His own 1:1 notes (`leo.md`, 2026-03-05) flag the TUI's "premature default rollout" as a cautionary example of shipping fast then spending a year fixing it. **Worth checking this migration isn't following the same pattern** — was this volume of post-release fixing anticipated when the betas shipped, and is Leo the only person who can triage this class of issue? If so, that's a bus-factor risk worth spreading before the next major migration.

### 4. Security fix merged: Polygraph seed script guard (NXA-1960)
**@JamesHenry's** [#12162](https://github.com/nrwl/ocean/pull/12162) guards the Polygraph seed script against non-local Mongo targets. It's tagged with a ticket, which is good practice — **confirm NXA-1960 is now closed and there's no broader class of similar findings still open** (worth cross-checking against the auth/security sprint nartc and MaxKless ran the prior week, per the 2026-W26 report).

### 5. Rapid beta cadence heading into 23.1
**@FrozenPandaz** and **@jaysoo** landed three separate "migrate to nx 23.1.0-beta.X" chores in nx this week (beta.4 → beta.5 → beta.6), mirrored by a beta.4/beta.6 bump in Ocean. **Confirm this is an intentional stabilization sprint ahead of the 23.1 release** rather than each beta surfacing a regression that forced the next one — three betas in five business days is a fast cadence.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-06-29 to 2026-07-05_
