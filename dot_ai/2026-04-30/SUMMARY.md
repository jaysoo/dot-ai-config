# Summary - 2026-04-30

## Completed Tasks

### NXC-4158: Remove vitest support from @nx/vite (target v23)
- **Branch**: `NXC-4158`
- **Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4158`
- **Commit**: `f9bbac4448` (force-pushed after rebase onto master)
- **PR**: https://github.com/nrwl/nx/pull/35517
- **Linear**: https://linear.app/nxdev/issue/NXC-4158
- **Status**: Pushed, PR open, targeting `master` (v23 dev line — `next` advice in issue was stale post `23.0.0-beta.*`)

**Scope**: Strip vitest surface from @nx/vite. Vitest fully owned by @nx/vitest in v23.

**Removed:**
- All vitest version constants from `packages/vite/src/utils/versions.ts`
- `@nx/vite:test` executor (full directory `src/executors/test/`)
- `@nx/vite:vitest` generator (full directory `src/generators/vitest/`)
- `@nx/vite/plugin` test target inference + atomization (`testTargetName`/`ciTargetName`/`ciGroupName` plugin options)
- vitest install in `@nx/vite` init
- `vitest` peer dep
- `loadVitestDynamicImport` helper

**Routed via @nx/vitest:**
- `viteConfigurationGenerator` with `includeVitest: true` now uses `ensurePackage('@nx/vitest')` + dynamic import to call @nx/vitest's `configurationGenerator`. Caller surface unchanged.

**Migration**: `packages/vite/src/migrations/update-23-0-0/ensure-vitest-package-migration.ts`
- Self-contained (no import from 22.2.0 — old migrations get removed at next major)
- Installs @nx/vitest if missing
- Swaps `@nx/vite:test` → `@nx/vitest:test` in project targets and targetDefaults (Patterns A + B)
- Splits `@nx/vite/plugin` registrations with explicit test options
- Closes 22.2.0 gap: registers `@nx/vitest` plugin alongside default-config `@nx/vite/plugin` so test inference is preserved
- 7-spec smoke test covers executor swap, plugin gap, idempotency, no-op cases

**Stats**: 45 files changed, +386/-2686

### Validation
- `nx run vite:test` — 170 pass post-rebase
- `nx run vite:lint` — clean
- `nx run vite:build-base` — clean
- `nx run-many -t test` for `js`, `web`, `vue`, `storybook`, `react-native`, `nuxt`, `nest`, `workspace`, `eslint-plugin`, `nx-dev`, `plugin`, `react`, `remix`, `expo` — all pass
- Pre-existing `nx:test` flakes (`command-line-utils.spec.ts`, `shared-options.spec.ts`, `is-tui-enabled.spec.ts`) — unrelated, verified independent of branch

## Key Decisions

- **PR target**: `master` not `next-major`. Linear issue (created 2026-03-27) said `next` because at the time master was v22 dev. By 2026-04-30 master had `23.0.0-beta.*` tags published, so master IS v23.
- **Executor + generator removal vs deprecation-only**: Issue body explicitly mentions "removed executors" → full removal. The 22.2.0 migration `migrate-vitest-to-vitest-package` already swaps usages, so safe to remove in v23.
- **Migration isolation**: New v23 migration duplicates 22.2.0 logic instead of importing it. Old migrations get removed at next major bump, so importing across major versions creates broken refs.
- **Plugin gap (v22 oversight)**: 22.2.0 migration only registered `@nx/vitest` plugin when `@nx/vite/plugin` had explicit test options. Default-config workspaces (no `testTargetName`) would silently lose test inference on v23. v23 safety-net closes this.
- **Convert-to-inferred test handler**: Removed `@nx/vite:test` from convert-to-inferred handler list. Test transformer file deleted. Users with @nx/vite:test should run 22.2.0 migration first.

## Mistakes Corrected During Session
- Initially imported from `update-22-2-0/migrate-vitest-to-vitest-package` — Jack flagged: migrations must be self-contained because old migrations get removed at next major.
- Function name `ensureVitestPluginRegisteredAlongsideVitePlugin` was too verbose — renamed to `ensureVitestPluginRegistration`.
- Migration JSDoc + inline comments were too verbose (tried twice). Caveman-lite applies to comments too — "explain why, not what". Final: 2-line comment with a couple of bullets.
- PR description initially listed full validation matrix + exact code-level changes. Trimmed per Jack: "motivation, why, basic changes" — review can read the diff.

### NXC-4401: E2E Agentic Cloud Onboarding (draft PR)
- **Branch**: `NXC-4401` (worktree path still `nx-worktrees/DOC-490`)
- **Commits**: `dc7c1ce64d` (initial wire-up), `a03516ac0a` (review fixes), `a20584ab9d` (spec cleanup)
- **PR**: https://github.com/nrwl/nx/pull/35520 (DRAFT)
- **Linear**: https://linear.app/nxdev/issue/NXC-4401

**Scope**: In agent mode (`isAiAgent()`), `nx connect` / `nx init` / CNW route Cloud setup through `nx-cloud onboard connect-workspace --json`. Streams NDJSON to the agent. Human flows untouched.

**New files:**
- `packages/nx/src/command-line/nx-cloud/onboard/agentic-onboard.ts` (translator + spawn wrapper) + spec
- `packages/create-nx-workspace/src/utils/nx/agentic-onboard.ts` (CNW dup, ~80% identical, justified by CNW self-containment) + spec

**Edited:**
- `packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts` — agent-mode pre-check (short-circuit if `nx.json` already has `nxCloudId`) + `runAgenticOnboard` dispatch
- `packages/nx/src/command-line/init/init-v2.ts` — agent-mode cloud step routes through `runAgenticOnboard`
- `packages/create-nx-workspace/src/create-workspace.ts` — template + preset flows wire to agent helper
- `packages/create-nx-workspace/src/utils/ai/ai-output.ts` — added `NeedsAuthResult` to strict union

**Translator handles ocean's actual payload shapes**:
- Object-form `actionRequired` (`{ type: 'github_oauth' | 'github_app_install', deviceCode, ... }`)
- Nested `workspace.nxCloudId` on success
- Multi-line pretty-printed JSON (was being parsed line-by-line, returning null on every fragment → UNKNOWN_PAYLOAD)
- Mixed human + JSON output (`output.note('Updating nx.json...')` polluting `--json` mode) — added `extractJsonObject` brace-balanced extractor
- 409 "Workspace already exists" → translated to needs_input pointing at `npx nx-cloud onboard status`

**Connected payload includes**: `verifyCommand: 'npx nx-cloud onboard status'` and structured `nextSteps` directing the agent to demo cache replay on an existing project.

**Ocean follow-ups filed in CNW/Init Funnel project (Nx Cloud team)**:
- CLOUD-4493 — payload shape consistency
- CLOUD-4494 — auto-poll device flow inside connect-workspace
- CLOUD-4495 — wrong help text on `nx-cloud onboard --help`
- CLOUD-4496 — `--json` mode emits human-readable text
- CLOUD-4498 — short-circuit when `nx.json` already has `nxCloudId`
- CLOUD-4501 — re-run after poll mints fresh device code (the OAuth-loop bug)

### DOC-498: Edge function rewrite-framer-urls 500s on bot probes with leading //
- **Branch**: `doc-498-edge-function-bot-probe-fix`
- **Worktree**: `/Users/jack/projects/nx-worktrees/DOC-498`
- **Commit**: `62a48ca6e7`
- **PR**: https://github.com/nrwl/nx/pull/35527
- **Linear**: https://linear.app/nxdev/issue/DOC-498

**Root cause**: WordPress vuln scanners hit nx.dev with `GET //wp/wp-includes/wlwmanifest.xml` (leading `//`). `rewrite-framer-urls.ts:205` does `new URL(pathname, framerUrl)`. JS URL constructor parses `//wp/...` as a **protocol-relative URL** — `wp` is promoted to host. Fetch fails with DNS error, function 500s. Same pattern: `//blog/...`, `//wordpress/...`, `//shop/...`, `//cms/...`, `//xmlrpc.php?rsd=`.

**Fix** (14+/1- in `netlify/edge-functions/rewrite-framer-urls.ts`):
1. Collapse leading `/+` to `/` before `new URL(pathname, framerUrl)` — kills the protocol-relative hijack.
2. Regex short-circuit (404) for common probes: `wp-includes`, `wp-admin`, `wp-content`, `xmlrpc.php`, `wlwmanifest`, `.env`, `.git/`.

**Verification**:
- Reproduced on prod: `curl --path-as-is 'https://nx.dev//blog/wp-includes/wlwmanifest.xml'` → 500. `--path-as-is` flag is the trick — without it curl normalizes `//` → `/` and you can't repro.
- `deno check` on the edge function — clean.
- No Nx project owns the file (Deno-only), so `nx affected` had nothing to run.

**Follow-up flagged (not in this PR)**: Framer upstream flake (`connection reset`, `peer closed TLS without close_notify`, `Connection refused`) currently bubbles up as a generic platform error. Want a branded static 500/503 page instead. Separate issue when prioritized.

## Mistakes Corrected During NXC-4401 Session
- Assumed `nx login` had a workspace guard. Wrong — Jack's stale homebrew 22.5.1 had it; master removed it via #34728 (shipped 22.6.0+). Reverted `npx nx-cloud login` references back to `npx nx login`.
- Translator assumed `actionRequired` was a string. Ocean emits it as an object with `type` field. Same translator missed nested `workspace.nxCloudId`. Caught by real testing.
- Streamed line-by-line assuming NDJSON. Bin emits one pretty-printed JSON object → every fragment failed JSON.parse → UNKNOWN_PAYLOAD. Fix: accumulate full stdout, parse at close.
- Bin's success path prints `output.note(...)` to stdout in `--json` mode, polluting the buffer. Wrapper now slices JSON via brace-balanced scan.
- Auto-opened browser via `require('open')(verificationUri)` — disorients the user mid-flow. Reverted.
- Designed a 30s/3s polling loop in the github_oauth hint. Jack: "loop seems weird". Replaced with "ask user to confirm authorization, then poll once".
- Hint claimed poll command "blocks until user authorizes". Ocean source shows poll is single-shot. Fixed.
- PR description was multi-section (summary, file list, test plan). Jack: "very short. hide linear details... no test plan". Trimmed to Current/Expected + Linear ID.
- Used `toEqual` on translator results that grew `verifyCommand` + `nextSteps` fields → tests broke. Reviewer caught it. Switched to `toMatchObject` for evolving shapes.
- Spec comments restated test names. Trimmed.
