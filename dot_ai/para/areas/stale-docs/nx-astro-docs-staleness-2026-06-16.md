# Nx Astro-Docs Staleness Audit — 2026-06-16

**Nx version at audit time:** 23.x (latest migration: `23-0-0-consolidate-release-tag-config`)
**Node.js EOL context:** Node 16 EOL 2023-09-11; Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-30 (now past)
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (499 files)
**Previous audits:** [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) | [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md)

This audit focuses on items **not already logged** in the June 11 and June 12 reports.

---

## 1. Old Nx Version References in Main Docs (≥ 3 versions stale)

### Nx 15.0 / 15.3 — Historical intros that are now just facts (8 versions back)

| File | Line | Stale text |
|------|------|-----------|
| `guides/Tips-n-Tricks/include-all-packagejson.mdoc` | 7 | `"As of Nx 15.0.11, we only include any package.json file that is referenced in the workspaces property..."` |
| `reference/glossary.mdoc` | 154 | `"A project that is located in a sub-folder of another project. This was made possible in Nx 15.3."` |
| `reference/glossary.mdoc` | 231 | `"A repository with a single application at the root level. This set up is made possible in Nx 15.3."` |

These are now baseline behavior, not new features. The "As of / was made possible in Nx X.Y" framing is dead weight on Nx 23.

---

### Nx 17 — "If you're using an older version" fallback patterns (6 versions back)

| File | Line | Stale text |
|------|------|-----------|
| `troubleshooting/troubleshoot-cache-misses.mdoc` | 12 | `"If you're using a version lower than Nx 17.2.0, check: the target configuration has 'cache': true set..."` |
| `technologies/angular/Guides/nx-and-angular.mdoc` | 214 | `"The command was introduced in Nx 17.3.0. If you're using an older version, you can instead run: [fallback command]"` |

No reader is on Nx 17. Both the condition and the fallback can be deleted.

---

### Nx 19 — "In/As of/From Nx 19.x" feature intros (4 versions back)

All of these describe features that are now stable, standard behavior in Nx 23. The version anchors add noise without value for current users.

| File | Line | Stale text |
|------|------|-----------|
| `concepts/sync-generators.mdoc` | 9 | `"In Nx 19.8, you can use sync generators to ensure that your repository is maintained in a correct state."` |
| `technologies/module-federation/concepts/module-federation-and-nx.mdoc` | 10 | `"As of Nx 19.5, our Module Federation support is provided by the @module-federation/enhanced package."` |
| `guides/Nx Cloud/access-tokens.mdoc` | 299 | `"From Nx 19.7 new workspaces are connected to Nx Cloud with a property called nxCloudId instead..."` |
| `guides/Nx Cloud/personal-access-tokens.mdoc` | 11 | `"From Nx 19.7 repositories are connected to Nx Cloud via a property in nx.json called nxCloudId."` |
| `guides/Adopting Nx/preserving-git-histories.mdoc` | 11 | `"In Nx 19.8 we introduced nx import which helps you import projects into your Nx workspace..."` |
| `reference/project-configuration.mdoc` | 233 | `"In Nx 19.5.0+, tasks can be configured to support parallelism or not."` |
| `reference/project-configuration.mdoc` | 457 | `"Starting from v19.5.0, wildcards can be used to define dependencies in the dependsOn field."` |
| `reference/project-configuration.mdoc` | 588 | `"Sync generators are available in Nx 19.8+."` |

---

### Nx 20 — Feature availability notes (3 versions back)

| File | Line | Stale text |
|------|------|-----------|
| `extending-nx/task-running-lifecycle.mdoc` | 12 | `"These task execution hooks are the new API that replaces the deprecated Custom Tasks Runners. This feature is available since Nx 20.4+."` |
| `guides/Tasks & Caching/self-hosted-caching.mdoc` | 53 | `// Nx 20.8+` inline code comment |
| `technologies/typescript/introduction.mdoc` | 98 | `"The --template nrwl/typescript-template uses the modern setup with workspaces and project references as of Nx 20."` |

---

## 2. Outdated Compatibility Table

### `createNodes` API Compatibility Table Incomplete (Missing Nx 23+ Column)

File: `extending-nx/createnodes-compatibility.mdoc` line 27

The **first** table (which API Nx calls per version) correctly shows Nx 23+ behavior:
> `23.x+  | Yes (v2 signature) | Yes (fallback) | Prefers createNodes; createNodesV2 is a deprecated alias`

But the **second** table ("Which Nx versions does my plugin support?") only has four columns ending at `Nx 22+`:

```
| Plugin Exports          | Nx 17-19.1 | Nx 19.2-20 | Nx 21-21.x | Nx 22+ |
```

There is no `Nx 23+` column in the plugin-author lookup table, making it inconsistent with and incomplete relative to the first table.

**Fix:** Add a `Nx 23+` column to the second table with the correct compatibility information from the first table.

---

## 3. Old Framework Version Reference

### Angular 13 Note in Migration Guide

File: `technologies/angular/Migration/angular.mdoc` line 27

```
Note: The changes will be slightly different for Angular 13 and lower.
```

Angular 13 was released November 2021. Angular 20 was released May 2025. This note is 7 major Angular versions stale and likely describes behavior that is no longer supported at all. The Nx migration tooling for Angular 13 repos may not even function correctly in Nx 23.

**Fix:** Verify if Nx 23 still supports migrating Angular 13 repos; if not, remove or archive this note. If yes, consider updating to reference the minimum supported Angular version instead.

---

## Linear Issues to File

> **Note:** The Linear MCP SSE transport is deprecated and fully blocked (removal date was 2026-04-08). All calls return `"Tool call rejected as a pre-removal deprecation signal."` Issues below need to be manually created via Linear UI or the updated MCP endpoint (`https://mcp.linear.app/mcp`).

The following issues should be created for the **Docs** team, in **Triage** state, labeled `Good for AI agents`, assigned to the Linear agent:

### Issue A — Strip Nx 15 historical version anchors from main docs

**Title:** `Docs: Remove stale "As of / made possible in Nx 15.x" framing`
**Files:**
- `guides/Tips-n-Tricks/include-all-packagejson.mdoc:7`
- `reference/glossary.mdoc:154, 231`

These describe baseline behavior as if it were a new feature from 8 major versions ago. Remove or rephrase without the version anchor.

---

### Issue B — Remove Nx 17 fallback patterns

**Title:** `Docs: Remove "if you're on Nx 17 or older" fallback instructions`
**Files:**
- `troubleshooting/troubleshoot-cache-misses.mdoc:12`
- `technologies/angular/Guides/nx-and-angular.mdoc:214`

No supported user is on Nx 17 (released 2023). Delete the conditions and the fallback command blocks entirely.

---

### Issue C — Remove Nx 19 "In/As of/From Nx 19.x" feature intro anchors

**Title:** `Docs: Remove "As of Nx 19.x / From Nx 19.7" intro text from current feature docs`
**Files:**
- `concepts/sync-generators.mdoc:9`
- `technologies/module-federation/concepts/module-federation-and-nx.mdoc:10`
- `guides/Nx Cloud/access-tokens.mdoc:299`
- `guides/Nx Cloud/personal-access-tokens.mdoc:11`
- `guides/Adopting Nx/preserving-git-histories.mdoc:11`
- `reference/project-configuration.mdoc:233, 457, 588`

These features (sync generators, Module Federation via enhanced, nxCloudId, nx import, parallelism, wildcards in dependsOn) are now standard. Remove the "In Nx 19.x, you can…" framing and write as current behavior.

---

### Issue D — Remove Nx 20 availability notes

**Title:** `Docs: Remove "available since Nx 20.x" version anchors from feature docs`
**Files:**
- `extending-nx/task-running-lifecycle.mdoc:12`
- `guides/Tasks & Caching/self-hosted-caching.mdoc:53`
- `technologies/typescript/introduction.mdoc:98`

Task hooks, self-hosted caching API, and the nrwl/typescript-template modern setup are baseline in Nx 23.

---

### Issue E — Fix createNodes compatibility table (missing Nx 23+ column)

**Title:** `Docs: createNodes compatibility table missing Nx 23+ column`
**File:** `extending-nx/createnodes-compatibility.mdoc:27`

The first table correctly documents Nx 23+ behavior, but the second "plugin author lookup" table only goes to `Nx 22+`. Add a `Nx 23+` column consistent with the first table.

---

### Issue F — Review Angular 13 migration note

**Title:** `Docs: Verify and update Angular 13-and-lower note in migration guide`
**File:** `technologies/angular/Migration/angular.mdoc:27`

Angular 13 is 7 major versions behind current (Angular 20). Verify if Nx 23 even supports migrating from Angular 13 repos; if not, remove the note entirely.

---

## Needs Input

1. **`reference/project-configuration.mdoc:233`** — The `"In Nx 19.5.0+"` note for `parallelism: false` could arguably be kept as context for readers migrating from older configs where this option didn't exist. Worth checking with the team whether "In Nx X.Y+" notes are ever intentionally kept for reference config pages vs. always being clean-text.

2. **`technologies/angular/Migration/angular.mdoc:27`** — Before removing, confirm: does the Nx 23 `@nx/angular:migrate` generator still produce correct output for Angular 13 workspaces? If yes, the note is a useful cross-version hint and only needs rewording (e.g., "For repos using Angular 13 or earlier…"). If no, remove.

3. **`extending-nx/task-running-lifecycle.mdoc:12`** — The phrase "This feature is available since Nx 20.4+" appears right next to a note about migrating from "Custom Tasks Runners." This is useful context for people doing a late migration from Nx 19.x. If a significant portion of the user base is still migrating, the version anchor is not entirely dead weight. Consider keeping the migration cross-link while removing the specific version.

4. **Linear MCP connectivity** — The SSE transport (`/sse`) is past its removal date (2026-04-08). If the workspace is still using the SSE-based MCP config, it needs to be updated to `https://mcp.linear.app/mcp` per the Linear migration guide. Until fixed, no automated issue creation via Claude Code is possible.

---

## Summary by Priority

| Priority | Count | Items |
|----------|-------|-------|
| High | 3 | Nx 17 fallback patterns (no user is on Nx 17); createNodes table missing Nx 23+ |
| Medium | 8 | Nx 19.x "In/As of/From" anchors in project-configuration, access-tokens, personal-access-tokens, sync-generators, module-federation, preserving-git-histories |
| Low | 3 | Nx 15 historical framing in glossary/include-all-packagejson |
| Low | 3 | Nx 20 availability notes in task-running-lifecycle, self-hosted-caching, typescript/introduction |
| Needs input | 1 | Angular 13 note — verify Nx 23 support before removing |
