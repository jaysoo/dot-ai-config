# Nx Astro Docs Staleness Audit — 2026-08-01

**Scope:** full sweep of all 478 `.mdoc` files currently under `astro-docs/src/content/docs/` (kb/, technologies/, reference/, guides/, features/, getting-started/, enterprise/, concepts/, platform-features/, technologies-tools/, troubleshooting/, and the three top-level pages). Six parallel read-only agents each scanned a directory slice for the three requested smells: (1) old Nx major version presented as current, (2) old/EOL Node or package versions presented as current, (3) documented CLI flags / generator / executor / config options that don't match `packages/*` source.

**Live baseline used this cycle** (verified from the checked-out repo, not training data):
- Nx: root git tags top out at **23.2.0-beta.4** / latest stable **23.1.1** → current major is **23**.
- Node: `mise.toml` pins the repo's own dev Node to **26.3.0**; Node 20 is EOL as of today (2026-08-01).
- React: `packages/react/package.json` peer range `>=18.0.0 <20.0.0`.
- Angular: `pnpm-workspace.yaml` catalog `angular-supported-versions` → `>=20.0.0 <23.0.0`.
- Next.js: `packages/next/package.json` peer range `>=14.0.0 <17.0.0`.

**⚠️ Structural note — docs were reorganized since the 2026-07-10 audit.** `extending-nx/` and `technologies/test-tools/storybook/Guides/` (the paths used in the 06-29/07-10 backlog) are now thin auto-generated index shells; the actual guide content — including `compose-executors.mdoc`, `overview-react.mdoc`, `overview-angular.mdoc`, the Storybook guides, etc. — now lives directly under `kb/`. **The file paths in backlog items #4, #13, #14, #15, #25 in the [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md) are stale pointers** — the underlying content issues may still be unfixed, but whoever files these in Linear should re-locate the file under `kb/` first. This audit re-confirms two of those issues at their new paths (see Confirmed C-6 / mapped to old H-5, and C-1/C-2 group mapped to old M-3) but did not attempt a full reconciliation of all 27 old items against new paths — that's worth a dedicated pass.

**Result: 0 stale Nx-major-version findings, 0 stale Node/npm/framework-version findings this cycle** (the `technologies/` and `guides/` directories, and the version-compatibility tables in `technologies/*/introduction.mdoc`, are current and accurate — Storybook, Vite, Cypress, .NET, Java, Gradle, etc. requirement tables all checked out). All findings this cycle are **option/feature drift** (smell 3) — docs describing CLI flags, generator options, or config defaults that no longer match `packages/*` source — plus one stale version-support table.

**Linear MCP unavailable again — 7th consecutive audit cycle.** See escalation note at the bottom.

---

## Summary

| Category | Confirmed | Needs Input |
|---|---|---|
| Old Nx version reference | 0 new (see structural note above re: unreconciled old backlog) | 0 |
| Old Node/npm/framework version | 0 | 0 |
| Mismatched CLI/feature vs. source (incl. 1 stale version-support table) | 15 | 1 |
| **Total** | **15** | **1** |

---

## Confirmed Findings

### C-1 — Deprecated Storybook test-import packages (2 files)
**Files:** `kb/storybook-interaction-tests.mdoc`, `kb/overview-react.mdoc`
**Category:** option-drift / old-package-version
**Issue:** Both instruct readers to `import { within, userEvent } from '@storybook/testing-library'` and `import { expect } from '@storybook/jest'`. Storybook 9+ removed these as separate packages (`packages/storybook/src/migrations/update-21-2-0/remove-addon-dependencies.ts` actively deletes them from workspaces), and the current Nx-generated story template (`packages/react/src/generators/component-story/files/tsx/__componentFileName__.stories.tsx__tmpl__`) imports `expect`/`within`/`userEvent` from `storybook/test` instead. Workspace is pinned to Storybook 10.5.0.
**Note:** conceptually the same issue as old backlog item M-3 (2026-06-29 audit), but that item's files (`technologies/test-tools/storybook/Guides/...`) no longer exist at those paths — this is the same content at its new `kb/` location, minus `overview-angular.mdoc` (not flagged this cycle — didn't check whether it still has the pattern).

---

### C-2 — Deprecated Storybook addons in `addons:` config array (4 files, 5 occurrences)
**Files:** `kb/one-storybook-for-all.mdoc`, `kb/one-storybook-per-scope.mdoc`, `kb/one-storybook-with-composition.mdoc` (2 occurrences), `kb/storybook-composition-setup.mdoc`
**Category:** option-drift / old-package-version
**Issue:** All show `addons: ['@storybook/addon-essentials', '@storybook/addon-interactions']` in `.storybook/main.ts` examples. Per `packages/storybook/src/migrations/update-21-2-0/remove-addon-dependencies.ts` (comment: "no longer needed in Storybook 9+"), both addons are deprecated/removed as of Storybook 9. Workspace is pinned to Storybook 10.5.0.
**Excerpt:** `addons: ['@storybook/addon-essentials', '@storybook/addon-interactions']`

---

### C-3 — `webpack-plugins.mdoc`: `externalDependencies` default is documented backwards
**File:** `kb/webpack-plugins.mdoc`
**Category:** option-drift
**Issue:** Doc states "Default is `none`." Actual source (`packages/webpack/src/plugins/nx-webpack-plugin/nx-app-webpack-plugin-options.ts`) documents the default as `all`. This is the opposite of what's documented — a reader relying on the doc's stated default would misconfigure their build.
**Excerpt:** `##### externalDependencies ... Default is 'none'.`

---

### C-4 — `withNx`/`composePlugins` from `@nx/next` shown as current, undeprecated pattern
**File:** `kb/webpack-config-setup.mdoc`
**Category:** option-drift
**Issue:** The "Configure Webpack for Next.js Applications" section shows `const { withNx } = require('@nx/next/plugins/with-nx'); ... return withNx(nextConfig);` with no deprecation notice. This directly contradicts `kb/next-config-setup.mdoc`, which explicitly states `withNx`/`composePlugins` from `@nx/next` "are deprecated and will be removed in Nx v24" and documents the plain `next.config.js` `webpack()` callback as the replacement. Two docs give contradictory current guidance.
**Excerpt:** `const { withNx } = require('@nx/next/plugins/with-nx');`

---

### C-5 — `convert-to-inferred.mdoc`: `@nx/vite:test` executor and `testTargetName` no longer exist under `@nx/vite/plugin`
**File:** `kb/convert-to-inferred.mdoc`
**Category:** option-drift
**Issue:** Line ~65 and the nx.json example (lines ~176–188) reference the `@nx/vite:test` executor and a `testTargetName` option under `"plugin": "@nx/vite/plugin"`. `packages/vite/executors.json` no longer lists a `test` executor (only `build`, `dev-server`, `preview-server`), and Vitest config was split into a separate `@nx/vitest` plugin as of the Nx 23.0.0 migration (`packages/vite/src/migrations/update-23-0-0/ensure-vitest-package-migration.ts`). The current `VitePluginOptions` interface (`packages/vite/src/plugins/plugin.ts`) has no `testTargetName`.

---

### C-6 — `compose-executors.mdoc`: deprecated `@nx/cypress:cypress` executor, invalid `tsConfig` option, legacy config format
**File:** `kb/compose-executors.mdoc`
**Category:** option-drift
**Issue:** Example config sets `"tsConfig": "apps/myapp-e2e/tsconfig.e2e.json"` on `@nx/cypress:cypress` — that property doesn't exist in the current schema (`packages/cypress/src/executors/cypress/schema.json`), and the executor itself is marked deprecated in its own schema ("will be removed in Nx v24") with no notice in the doc. The example also uses the legacy `"builder"` key instead of `"executor"` and a `cypress.json` filename (pre-Cypress-v10 format).
**Note:** same underlying issue as old backlog item H-5 (2026-06-29 audit, filed against the now-defunct path `extending-nx/compose-executors.mdoc`) — file this at the new `kb/compose-executors.mdoc` path instead.

---

### C-7 — `reference/releases.mdoc`: version-support table is out of date
**File:** `reference/releases.mdoc`
**Category:** old-nx-version / stale-table
**Issue:** Table lists `v22 | Current` with no v23 row at all, even though live tags show 23.x as current. It also still lists `v20 | LTS`, but by the doc's own stated policy (18 months of support from first release) v20 (released 2024-10-06) would have exited support around 2026-04 — before today. The whole support-window table needs a refresh.
**Excerpt:** `| v22 | Current | 2025-10-22 |` / `| v21 | LTS | 2025-05-05 |` / `| v20 | LTS | 2024-10-06 |`

---

### C-8 — `reference/nx-json.mdoc`: `preferDockerVersion` type and default documented incorrectly
**File:** `reference/nx-json.mdoc`
**Category:** option-drift
**Issue:** Doc's Release Tag configuration table says `preferDockerVersion: boolean, default false`. Actual source (`packages/nx/src/config/nx-json.ts`, `releaseTag.preferDockerVersion`, ~line 604) types it as `boolean | 'both'` with a conditional default ("true when docker configuration is present, false otherwise") — the doc omits the `'both'` value entirely and states the wrong default behavior.
**Excerpt:** `preferDockerVersion | boolean | false | Whether to prefer Docker-compatible version format in git tags`

---

### C-9 — `reference/environment-variables.mdoc`: missing `NX_MULTI_MAJOR_MODE`
**File:** `reference/environment-variables.mdoc`
**Category:** option-drift / omission
**Issue:** `reference/nx-json.mdoc`'s `migrate.multiMajorMode` row states "The `NX_MULTI_MAJOR_MODE` environment variable takes precedence over this value," implying it's documented elsewhere, but it doesn't appear anywhere in `environment-variables.mdoc`. Confirmed real and in active use: `packages/nx/src/command-line/migrate/migrate-config.ts` (`MULTI_MAJOR_MODE_ENV = 'NX_MULTI_MAJOR_MODE'`) and `packages/nx/src/command-line/migrate/multi-major.ts`.

---

### C-10 — `getting-started/Tutorials/angular-monorepo-tutorial.mdoc`: invalid `--unitTestRunner=vitest` example
**File:** `getting-started/Tutorials/angular-monorepo-tutorial.mdoc`
**Category:** option-drift
**Issue:** Line ~247: `npx nx g @nx/angular:library libs/ui --unitTestRunner=vitest`. Current `packages/angular/src/generators/library/schema.json` enum for `unitTestRunner` is `['vitest-angular', 'vitest-analog', 'jest', 'none']` — plain `vitest` isn't a valid value. A reader copy-pasting this command gets a schema validation error.

---

### C-11 — `features/CI Features/sandboxing.mdoc`: `nx show target --inputs --outputs` flags don't exist
**File:** `features/CI Features/sandboxing.mdoc`
**Category:** option-drift
**Issue:** Doc says "The `--inputs` and `--outputs` flags for `nx show target` require Nx 22.6 or later" and shows `nx show target <project>:<target> --inputs --outputs`. Actual current command (`packages/nx/src/command-line/show/command-object.ts`) implements `inputs`/`outputs` as **positional subcommands** (`nx show target inputs <project>:<target>` / `nx show target outputs <project>:<target>`), not boolean flags — no such yargs options exist. The documented invocation syntax will fail.

---

## Needs Input

### NI-1 — `kb/troubleshoot-convert-to-inferred.mdoc`: same `withNx`/`composePlugins` pattern as C-4, ambiguous intent
**File:** `kb/troubleshoot-convert-to-inferred.mdoc`
**Issue:** Under "Next.js: unable to migrate `outputPath`...", the troubleshooting example still shows `const plugins = [withNx]; module.exports = composePlugins(...plugins)(nextConfig);` to set `distDir`. Given `next-config-setup.mdoc` says this pattern is deprecated and removed in Nx v24, it's unclear whether this page is intentionally describing legacy/pre-migration executor state (troubleshooting docs sometimes need to show the "before" state) or is a stale leftover example that should be updated too. Docs team judgment call.

---

## Linear Issues to Create (queued — MCP unavailable, see escalation below)

Group into these for the **Docs** team, **triage**, labeled **"Good for AI agents"**, unassigned (Linear agent assignment attempted, connector unreachable — see below).

| # | Title | Severity | Files |
|---|---|---|---|
| 28 | Replace deprecated `@storybook/testing-library`/`@storybook/jest` imports with `storybook/test` (kb/ paths — supersedes stale-pathed old #13) | Medium | 2 files (C-1) |
| 29 | Remove deprecated `@storybook/addon-essentials`/`@storybook/addon-interactions` from `.storybook/main.ts` examples | Medium | 4 files, 5 occurrences (C-2) |
| 30 | Fix `webpack-plugins.mdoc`: `externalDependencies` default is documented as `none`, actually `all` | High | 1 file (C-3) |
| 31 | Reconcile `webpack-config-setup.mdoc` vs `next-config-setup.mdoc`: remove undeprecated `withNx`/`composePlugins` example or add deprecation notice | Medium | 1 file, +1 needs-input (C-4, NI-1) |
| 32 | Fix `convert-to-inferred.mdoc`: remove `@nx/vite:test`/`testTargetName`, point to `@nx/vitest` plugin | High | 1 file (C-5) |
| 33 | Fix `compose-executors.mdoc`: use `executor` not `builder`, drop invalid `tsConfig`, note `@nx/cypress:cypress` deprecation (new path for old #4/H-5) | High | 1 file (C-6) |
| 34 | Refresh `reference/releases.mdoc` version-support table (add v23, correct v20 EOL status) | High | 1 file (C-7) |
| 35 | Fix `nx-json.mdoc`: `preferDockerVersion` type/default (missing `'both'`, wrong default) | Medium | 1 file (C-8) |
| 36 | Add missing `NX_MULTI_MAJOR_MODE` entry to `environment-variables.mdoc` | Low | 1 file (C-9) |
| 37 | Fix `angular-monorepo-tutorial.mdoc`: invalid `--unitTestRunner=vitest`, use `vitest-angular` | High | 1 file (C-10) |
| 38 | Fix `sandboxing.mdoc`: `nx show target --inputs/--outputs` are positional subcommands, not flags | High | 1 file (C-11) |
| — | **Meta-issue:** reconcile old backlog (#1–27 from 2026-07-10) against the astro-docs reorg — `extending-nx/` and `technologies/test-tools/storybook/Guides/` content moved into `kb/`; old file paths are stale pointers | Medium | repo-wide |

Items 1–27 carried forward from prior audits are **not repeated here** — see the [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md) for that list, but note the path-reorg caveat above before filing them.

---

## Linear MCP Status — Escalation

**This is the 7th consecutive audit cycle** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 08-01) where Linear issue creation could not be completed programmatically — a different symptom nearly every time:
- 06-17: "SSE transport removed"
- 07-10: `ListConnectors` showed `enabledInChat: true` but `ToolSearch` returned zero Linear tools
- **08-01 (today):** `ListConnectors` shows Linear installed org-wide (`installState: "unknown"`, `enabledInChat: false`) — the connector is authenticated/known but explicitly toggled **off** for this chat session, and `ToolSearch` finds no Linear tools to call.

Per the 07-10 audit's own recommendation, this has now failed enough times with varying symptoms that it looks like a persistent connector/auth configuration issue rather than a transient one. **Recommend Jack check the Linear connector's per-chat enablement in claude.ai connector settings directly**, rather than this routine continuing to retry every cycle. All 12 items above (28–38 + meta-issue) are queued for manual creation in the meantime, on top of the unreconciled 1–27 from prior cycles.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
