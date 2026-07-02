# Nx Astro Docs Staleness Audit — 2026-07-02

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx`.
Current Nx (from `package.json` in-repo): **23.1.0-beta.4** | Node 20 EOL: **April 2026** | Node 18 EOL: **April 2025**

Linear MCP unavailable again — 6th consecutive audit with no Linear access. Queue keeps growing with nothing filed. See "Process note" at the bottom.

---

## Version baseline shifted since last scan (22.x → 23.x) — re-verify before filing

The repo moved from Nx 22.x (06-29 baseline) to 23.1.0-beta.4. This resolves several previously-queued findings. Re-verify before creating Linear issues 1–3 from the 06-29 backlog:

- **06-29 H-1 (compat tables labeling Nx 23.x "current")** — **RESOLVED.** Confirmed `technologies/node/introduction.mdoc:28`, `technologies/node/nest/introduction.mdoc:32`, `technologies/typescript/introduction.mdoc:22` all correctly show `23.x (current)` now. Drop from queue.
- **06-29 H-2/H-3/H-4, NI-1, NI-2 (v23 content framed as unreleased/future)** — likely resolved or much less severe now that 23.x is the actual current line, but 23.1.0-beta.4 is still beta, not GA. Needs a human check on `consumer-and-provider.mdoc`, `migrating-from-nx-vite.mdoc`, and the Angular Rspack getting-started page before closing — don't auto-drop.

No new findings duplicate these; not re-listed below.

---

## Summary (new findings this scan, deduped against 2026-06-11 through 2026-06-29 reports)

| Category | High | Medium | Low | Needs Input |
|---|---|---|---|---|
| Mismatched feature (plugin options / CLI docs) | 2 | 3 | 0 | 1 |
| Old Nx version reference | 0 | 1 | 5 | 1 |
| Old Node/package version | 0 | 0 | 0 | 0 |
| **Total** | **2** | **4** | **5** | **2** |

Everything else this scan's grep turned up (legacy-cache.mdoc, v1-nx-plugin-api.mdoc, as-provided-vs-derived.mdoc, access-tokens.mdoc, pass-args-to-commands.mdoc, flat-config.mdoc, nx-and-angular.mdoc, glossary.mdoc, project-configuration.mdoc, module-federation-and-nx.mdoc, inferred-tasks.mdoc, task-pipeline-configuration.mdoc, bundling-node-projects.mdoc node18 target, launch-template-examples.mdoc node21, angular.mdoc Angular 13/14) is a **re-hit of already-queued items** from the 06-29 report (H-13, M-6, M-10, M-11, M-13, M-18, M-19, M-21, L-3, L-4, L-8, L-10, L-14, H-12). Still unfixed, still queued — not re-listed here to avoid duplicate issues.

---

## HIGH Severity — NEW this scan

### H-1 — `nx generate` and `nx exec` have zero documented CLI flags anywhere
**Category:** mismatched-feature
**Issue:** The astro-docs "Nx Commands" reference page is generated at build time by introspecting the real yargs command definitions (`astro-docs/src/plugins/utils/cli-subprocess.cjs`), so most commands can't drift from code. But `cli-subprocess.cjs:143` hardcodes `const sharedCommands = ['generate', 'exec']` and skips both from generation. No static page fills the gap. Real, working flags with no documentation anywhere in astro-docs:
- `nx generate`: `--dry-run`/`-d` (default `false`), `--interactive` (default `true`), `--quiet` (conflicts with `--verbose`), `--verbose`.
- `nx exec`: full `withRunManyOptions` + `withTuiOptions` set (`--parallel`, `--projects`, `--exclude`, TUI flags).
**Evidence:** `packages/nx/src/command-line/generate/command-object.ts:20-45`, `packages/nx/src/command-line/exec/command-object.ts:1-23`, `astro-docs/src/plugins/utils/cli-subprocess.cjs:143`.

### H-2 — Four inferred-plugin option tables missing `buildDepsTargetName`/`watchDepsTargetName` (systemic)
**Files:**
- `technologies/react/next/introduction.mdoc` — also doesn't flag `serveStaticTargetName` as deprecated
- `technologies/react/remix/introduction.mdoc` — also missing `serveStaticTargetName` entirely
- `technologies/build-tools/webpack/introduction.mdoc` — has no options table at all, prose only
- `technologies/test-tools/storybook/introduction.mdoc` — prose typo `builtStorybookTargetName` (should be `buildStorybookTargetName`)

**Category:** mismatched-feature
**Issue:** `buildDepsTargetName`/`watchDepsTargetName` exist in `packages/next/src/plugins/plugin.ts`, `packages/remix/src/plugins/plugin.ts`, `packages/webpack/src/plugins/plugin.ts`, `packages/storybook/src/plugins/plugin.ts` but are undocumented across all four pages — looks like these options were added platform-wide to inferred plugins in one pass and the doc update never landed. One coordinated fix, not four separate ones.

---

## MEDIUM Severity — NEW this scan

### M-1 — `technologies/build-tools/vite/introduction.mdoc` missing `compiler` option
**Category:** mismatched-feature
**Issue:** `packages/vite/src/plugins/plugin.ts` defines a `compiler` option (`'tsc' | 'tsgo' | 'vue-tsc'`) not present in the doc's options table.

### M-2 — `guides/Tasks & Caching/self-hosted-caching.mdoc` anchors self-hosted cache server feature to Nx 20.8
**File:** `guides/Tasks & Caching/self-hosted-caching.mdoc` (lines 44, 53)
**Category:** old-nx-version
**Issue:** "Starting in Nx version 20.8, you can build your own caching server..." / `// Nx 20.8+` — 3 majors behind current 23.x on a page describing a current, actively-used feature.

### M-3 — `technologies/node/Guides/deploying-node-projects.mdoc` gates default TS Solution Setup behavior on "Nx 20+"
**File:** `technologies/node/Guides/deploying-node-projects.mdoc` (lines 3, 195)
**Category:** old-nx-version
**Issue:** "Replaces the deprecated `generatePackageJson` option in Nx 20+" / "If you're upgrading to Nx 20+ with TS Solution Setup (the default for new workspaces)..." — TS Solution Setup has been the default for 3 majors now; the "20+" qualifier reads like a recent caveat rather than baseline behavior.

### M-4 — `reference/nx-json.mdoc` missing top-level properties `defaultProject`, `useDaemonProcess`, `useInferencePlugins`
**File:** `reference/nx-json.mdoc`
**Category:** mismatched-feature
**Issue:** All three are top-level `NxJsonConfiguration` properties (`packages/nx/schemas/nx-schema.json:119-154`) absent from the nx.json reference page's property tables. `useDaemonProcess`/`useInferencePlugins` get partial coverage elsewhere (`concepts/nx-daemon.mdoc`, `concepts/inferred-tasks.mdoc`) but not in the page that bills itself as the nx.json reference; `defaultProject` isn't documented anywhere in astro-docs.

---

## LOW Severity — NEW this scan

### L-1 — `reference/Deprecated/workspace-generators.mdoc` anchors migration guidance to Nx 16
**File:** `reference/Deprecated/workspace-generators.mdoc` (line 19)
**Category:** old-nx-version
**Issue:** "When migrating to Nx 16, a new workspace plugin is automatically generated..." — 7 majors behind current 23.x, virtually no one is migrating from pre-16 today.

### L-2 — `extending-nx/task-running-lifecycle.mdoc` anchors feature to Nx 20.4+
**File:** `extending-nx/task-running-lifecycle.mdoc` (line 12)
**Category:** old-nx-version
**Issue:** "This feature is available since Nx 20.4+" on a current extending-Nx reference page, 3 majors behind current.

### L-3 — `technologies/typescript/introduction.mdoc` gates "modern setup" description on Nx 20
**File:** `technologies/typescript/introduction.mdoc` (line 98)
**Category:** old-nx-version
**Issue:** "...uses the modern setup with workspaces and project references as of Nx 20" — 3 majors behind, reads as a recent change rather than the long-standing default.

### L-4 — `guides/ci-deployment.mdoc` gates TS project references default on "Nx 20+"
**File:** `guides/ci-deployment.mdoc` (line 8)
**Category:** old-nx-version
**Issue:** "If your workspace uses TS project references (the default in Nx 20+), use the prune workflow instead" — same pattern as M-3, stale version qualifier on now-baseline behavior.

### L-5 — `extending-nx/createnodes-compatibility.mdoc` centers plugin-author guidance on Nx 17–20 support range
**File:** `extending-nx/createnodes-compatibility.mdoc` (lines 27, 85, 87, 124)
**Category:** old-nx-version
**Issue:** "Plugin support for Nx 17 through Nx 20" / "If you need to support Nx versions 17-20..." is foregrounded as the primary compatibility scenario; 3–6 majors behind current 23.x. See Needs Input below — may be intentional for plugin authors targeting older LTS, needs a maintainer call rather than a blind edit.

---

## Needs Input

### NI-1 — `createnodes-compatibility.mdoc`: is Nx 17–20 still the intended plugin-author support floor?
**File:** `extending-nx/createnodes-compatibility.mdoc`
**Question:** Unlike most stale version anchors in this audit (which are just forgotten prose), this page's whole structure is organized around supporting Nx 17–20. Is that still the floor first-party/community plugin authors should target, or has it moved forward (e.g. to 20+ or 21+) since this was written? If the floor moved, the whole page needs restructuring, not a one-line edit — flagging for a docs/DevEx decision rather than a mechanical fix.

### NI-2 — `reference/nx-json.mdoc`: should `defaultProject`, `useDaemonProcess`, `useInferencePlugins` be added, or are they intentionally covered elsewhere?
**File:** `reference/nx-json.mdoc`
**Question:** `nxCloudEncryptionKey`/`neverConnectToCloud` are deliberately documented on the Nx Cloud config page instead of here (per the 06-29 report), suggesting some top-level nx.json properties are intentionally split out by topic. Is the same true for these three, or are they genuine gaps? If intentional, `nx-json.mdoc` should at least link out to where they live.

---

## Linear Issues to Create (queued — MCP unavailable, again)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**. Written caveman-lite per `dot_claude/skills/linear-issue-style` so they're paste-ready once Linear access exists.

| # | Title | Severity | Files |
|---|---|---|---|
| 27 | Document `nx generate` and `nx exec` flags — excluded from generated CLI reference | High | 2 files (cli-subprocess.cjs generator config + new doc content) |
| 28 | Add `buildDepsTargetName`/`watchDepsTargetName` to next/remix/webpack/storybook plugin option tables; fix storybook typo `builtStorybookTargetName` | High | 4 files |
| 29 | Add `compiler` option to vite plugin introduction options table | Medium | 1 file |
| 30 | Update self-hosted-caching.mdoc: drop "Nx 20.8+" framing, feature is baseline now | Medium | 1 file |
| 31 | Update deploying-node-projects.mdoc: drop "Nx 20+" framing for default TS Solution Setup behavior | Medium | 1 file |
| 32 | Add defaultProject/useDaemonProcess/useInferencePlugins to nx-json.mdoc reference (or link out) | Medium | 1 file |
| 33 | Clean up remaining low-value "Nx 16/17-20/20.4" version anchors (workspace-generators, task-running-lifecycle, typescript intro, ci-deployment) | Low | 4 files |
| — | Re-verify and likely close 06-29 issues #1–3 (v23 "current"/"unreleased" framing) — Nx repo is now on 23.1.0-beta.4 | Follow-up | 3 files, see version-baseline section above |

Sample caveman-lite description for issue #27 (to paste into Linear once access exists):

> ## Summary
> `nx generate` and `nx exec` are hardcoded out of the auto-generated CLI reference (`cli-subprocess.cjs:143`). No static page covers them either. Their real flags — `--dry-run`, `--interactive`, `--quiet` for generate; the full run-many + TUI flag set for exec — are undocumented anywhere in astro-docs.
>
> ## Current code
> `astro-docs/src/plugins/utils/cli-subprocess.cjs:143` — `const sharedCommands = ['generate', 'exec']`, skipped during generation.
>
> ## Proposed behavior
> Either stop excluding these two commands from the generator, or add a hand-written reference page covering their flags from `packages/nx/src/command-line/generate/command-object.ts` and `packages/nx/src/command-line/exec/command-object.ts`.

---

## Process note — Linear MCP has been unavailable for 6 straight audits

Every run since 2026-06-17 has queued issues instead of filing them (8 → 18 → 26 → now 33+, plus 3 follow-ups to re-verify). Nothing from this backlog has been confirmed created in Linear. Continuing to accumulate an ever-growing markdown queue has diminishing value — worth deciding whether to:
1. Get Linear MCP actually connected to this environment/session type, or
2. Have a human bulk-create the ~33 queued issues from these five reports in one pass, or
3. Stop running this audit until (1) is fixed, since the "file in Linear" step is the actual point of the routine.
