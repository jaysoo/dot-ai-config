# Nx Astro-Docs Staleness Audit — 2026-06-12

**Nx version at audit time:** 23.x (migrations confirm 23.0.0 entries)
**Node.js EOL context:** Node 20 EOL 2026-04-25; Node 18 EOL 2025-04-30; Node 16 EOL 2023-09-11
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (498 files)
**Relation to prior audit:** [2026-06-11 audit](./nx-astro-docs-staleness-2026-06-11.md) found most of these; this run confirms all prior findings are still unfixed and adds 2 net-new findings (#9 and #10 below).

---

## Confirmed Still-Unfixed (from 2026-06-11 audit)

All findings from the prior audit remain present. See that file for full details. Summary:

| # | Issue | Files affected |
|---|-------|---------------|
| 1 | Tutorial prereqs require Node.js v20.19 (EOL) | 3 tutorial files |
| 2 | CI YAML examples use `node-version: 20` / `image: node:20` / `image: node:18` | 9+ files |
| 3 | Plugin dev guides say Nx uses "node 16 tsconfig bases" | `local-generators.mdoc`, `local-executors.mdoc` |
| 4 | `bundling-node-projects.mdoc` uses `target: 'node18'` in vite config | 1 file |
| 5 | `jest@22.0.0, cypress@3.4.0` in advanced-update example | 1 file |
| 6 | `convert-to-inferred.mdoc` says min Nx 19.6 (we're on 23) | 1 file |
| 7 | "Requires Nx 15.3" / "as of Nx 15.0.11" asides in active guides | 2 files |
| 8 | "Available since Nx 16.x" and "In Nx 17 and higher" notices in active guides | 6 files |
| 9 (new) | Nx 15.7 link card in `node-server-fly-io.mdoc` | 1 file |
| 10 (new) | Angular 13 migration guidance still active | 1 file |

---

## Net-New Findings (not in 2026-06-11 report)

### #9 — Nx 15.7 YouTube Link Card in node-server-fly-io Guide

**File:** `technologies/node/Guides/node-server-fly-io.mdoc:25`

```
{% linkcard title="Build Node backends - The Easy Way!"
  description="Starting with Nx 15.7 we now have first-class support for building Node backend applications"
  href="https://youtu.be/K4f-fMuAoRY" /%}
```

We're on Nx 23; this "starting with Nx 15.7" framing is 8 major versions stale. The linkcard is pointing to a 2022 YouTube video which likely shows outdated UI and workflows. Should either be removed or replaced with a current resource.

---

### #10 — Angular 13 Migration Guidance Still Active

**File:** `technologies/angular/Migration/angular.mdoc:27`

```
**Note:** The changes will be slightly different for Angular 13 and lower.
```

Angular 13 was released in November 2021. Any workspace still on Angular 13 would also be on a very old Nx version and would not be following these migration docs. The callout adds noise for all current readers and should be removed. The surrounding context at line 25 also mentions "Angular 14+" which is several major versions old (current Angular is 19).

---

## Linear Issue Creation

**Status: FAILED** — The Linear MCP server is running on the deprecated SSE transport (removal date was 2026-04-08, now past). All `mcp__Linear__*` tool calls are rejected with:
> "Tool call rejected as a pre-removal deprecation signal. DEPRECATED TRANSPORT — REMOVAL DATE 2026-04-08 (past)."

The new endpoint is `https://mcp.linear.app/mcp`. Linear issues could not be created in this session. The issues to create are documented below for manual creation or a session with the updated MCP transport.

---

## Linear Issues to Create (pending transport fix)

The following issues should be opened against the **Docs** team, in **Triage** state, labeled **"Good for AI agents"**, and delegated to the **Linear** agent.

### Issue 1: CI examples and tutorials reference EOL Node.js 20 and 18

Covers: findings #1, #2, #4 above.

All three flagship tutorials require "Node.js v20.19 or later" (Node 20 EOL 2026-04-25). Dozens of CI YAML snippets across 9+ guides use `node-version: 20`, `image: node:20`, and `image: node:18`. The vite config example in `bundling-node-projects.mdoc` uses `target: 'node18'`.

**Fix:** Update tutorial prereqs to Node 22+; replace `node-version: 20` with `node-version: 22` in GitHub Actions examples; replace `image: node:20`/`node:18` with `image: node:22`; update vite target to `node22`.

Affected files:
- `getting-started/Tutorials/react-monorepo-tutorial.mdoc:21`
- `getting-started/Tutorials/angular-monorepo-tutorial.mdoc:21`
- `getting-started/Tutorials/typescript-packages-tutorial.mdoc:21`
- `features/CI Features/split-e2e-tasks.mdoc:464`
- `features/CI Features/distribute-task-execution.mdoc:66`
- `reference/Nx Cloud/assignment-rules.mdoc:371,399`
- `guides/Nx Release/publish-in-ci-cd.mdoc:157,235,391`
- `guides/Adopting Nx/adding-to-monorepo.mdoc:390`
- `guides/Adopting Nx/adding-to-existing-project.mdoc:372`
- `guides/Nx Cloud/setup-ci.mdoc:63,143,324`
- `guides/Nx Cloud/bring-your-own-compute.mdoc:56,98,297,354`
- `technologies/node/Guides/bundling-node-projects.mdoc:113`

---

### Issue 2: Plugin authoring docs reference "node 16 tsconfig bases" (EOL 2023)

Covers: finding #3 above.

Both plugin development guides state: "Nx uses the recommended tsconfig for node 16 for other compiler options." Node 16 EOL'd September 2023. Should reference at minimum node20 or node22 tsconfig bases.

Affected files:
- `extending-nx/local-generators.mdoc:116`
- `extending-nx/local-executors.mdoc:145`

**Needs verification:** Confirm whether Nx's internal tsconfig actually still targets node16 (`packages/nx/tsconfig*.json`). If it does, this is also a code issue, not just a docs issue.

---

### Issue 3: Stale Nx 15–17 "as of" / "requires" version callouts in active guides

Covers: findings #6, #7, #8, #9 above. Nx is on 23; these callouts are dead weight for all current readers.

Affected files and snippets:

| File | Stale text |
|------|-----------|
| `guides/Tasks & Caching/convert-to-inferred.mdoc:20` | "At minimum, you should be on Nx version 19.6" |
| `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc:17` | `{% aside ... title="Requires Nx 15.3" %}` |
| `guides/Tips-n-Tricks/include-all-packagejson.mdoc:7` | "As of Nx 15.0.11, we only include..." |
| `technologies/node/Guides/node-server-fly-io.mdoc:25` | Link card: "Starting with Nx 15.7 we now have first-class support..." |
| `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc:9` | `{% aside ... title="Available since Nx 16.6.0" %}` |
| `technologies/typescript/Guides/define-secondary-entrypoints.mdoc:36` | "as of Nx 16.8, you can specify additionalEntryPoints..." |
| `extending-nx/create-install-package.mdoc:24` | "Starting with Nx 16.5 you can now have such a create-{x} package" |
| `reference/nx-json.mdoc:378` | "In Nx 17 and higher, caching is configured by..." |
| `reference/project-configuration.mdoc:212` | Same "In Nx 17 and higher" caveat |
| `extending-nx/project-graph-plugins.mdoc:368` | "This functionality is available in Nx 17 or higher." |

**Fix:** Remove or rewrite each callout to present the behavior as current default, without the historical version gate.

---

### Issue 4: `@nrwl/workspace:library` example in nx-console-settings docs

Covers: finding from 2026-06-11 audit.

The `@nrwl` scope was deprecated in Nx 16 and removed in Nx 18+. The nx-console-settings docs still show it as a valid example.

Affected file:
- `reference/nx-console-settings.mdoc:225,244` — `"@nrwl/workspace:library"` should be `"@nx/workspace:library"`

---

### Issue 5: Angular migration guide references Angular 13 as a live concern

Covers: finding #10 above.

The Angular migration guide has an active note: "The changes will be slightly different for Angular 13 and lower." Angular 13 is from 2021 and unsupported; the surrounding guidance also targets "Angular 14+" which is several major versions old (current: Angular 19). The Angular 13 callout should be removed; the "Angular 14+" framing should be updated or removed.

Affected file:
- `technologies/angular/Migration/angular.mdoc:25,27`

---

### Issue 6: Very old package versions in CLI migration example

Covers: finding #5 from 2026-06-11 audit.

`guides/Tips-n-Tricks/advanced-update.mdoc:201` shows: `nx migrate --to="jest@22.0.0,cypress@3.4.0"`. Jest 22 is from 2017; Cypress 3.4.0 is from 2019. Even as illustrative examples, these dates are jarring.

**Fix:** Update to current major versions (jest@29 or 30, cypress@13 or 14), or make the example obviously illustrative (e.g., `jest@latest`).

---

## Needs Input

1. **`extending-nx/local-generators.mdoc` + `local-executors.mdoc`** — The "node 16 tsconfig" claim may be technically accurate if Nx's internal tsconfig hasn't been updated. Check `packages/nx/tsconfig*.json` before updating the docs text.

2. **`technologies/angular/Guides/nx-and-angular.mdoc:214`** — `"The command was introduced in Nx 17.3.0. If you're using an older version, you can instead run:"` — the fallback command is historical dead weight on Nx 23, but verify the fallback command was actually removed before stripping the note.

3. **`reference/Nx Cloud/launch-templates.mdoc:97–109`** — Contains a full changelog of image versions including many `node20.*` entries. These are historical changelog records, not current recommendations. Are they meant to be preserved long-term or pruned to current image only?

4. **`technologies/angular/Guides/angular-nx-version-matrix.mdoc`** — The matrix includes entries for Angular 13 through 16 mapped to old Nx versions. These are compatibility records, not active guidance. Should old rows be archived or left in place for users on legacy versions?
