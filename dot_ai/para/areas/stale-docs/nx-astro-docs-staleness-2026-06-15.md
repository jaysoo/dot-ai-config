# Nx Astro-Docs Staleness Audit — 2026-06-15

**Nx version at audit time:** v22 (current); v20 and v21 in LTS
**Node.js EOL context:** Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-30; current LTS is Node 22
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (499 files)
**Previous audits:** [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) (full scan), [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) (code/docs mismatch focus)

This audit focuses on **new items not caught in prior scans** and follow-up on outstanding "Needs Input" items from the previous two audits.

---

## 1. New Findings

### Dead Conditional for Nx 17.2.0 in Cache Troubleshooting

`troubleshoot-cache-misses.mdoc:12` says:

> "If you're using a version lower than Nx 17.2.0, check: the target configuration in the project's `project.json` file has `"cache": true` set..."

Nx 17 is five major versions behind the current v22. The oldest supported version is v20. No reader following this doc is on Nx 17. The extra conditional step is dead weight, and if the `cache: true` check is still valid advice, it should be promoted to unconditional.

| File | Line | Issue |
|------|------|-------|
| `troubleshooting/troubleshoot-cache-misses.mdoc` | 12–15 | Dead branch: "If you're using a version lower than Nx 17.2.0" |

---

### Stale "From Nx 19.7" Framing in Nx Cloud Auth Docs

Two Nx Cloud pages open with "From Nx 19.7..." as if 19.7 was recent. It is now three major versions back. `nxCloudId` and `nx login` are the universal baseline — every workspace created in the last three major versions already uses them.

| File | Line | Issue |
|------|------|-------|
| `guides/Nx Cloud/access-tokens.mdoc` | 299 | `"From Nx 19.7 new workspaces are connected to Nx Cloud with a property called nxCloudId..."` |
| `guides/Nx Cloud/personal-access-tokens.mdoc` | 11 | `"From Nx 19.7 repositories are connected to Nx Cloud via a property in nx.json called nxCloudId."` |

---

### Plugin Compatibility Table Includes EOL Nx 17–19

The compatibility matrix at `extending-nx/createnodes-compatibility.mdoc:27` covers Nx 17–19.1, Nx 19.2–20, Nx 21–21.x, and Nx 22+. Nx 17, 18, and 19 are all past EOL/LTS. Plugin authors targeting Nx 20+ (the minimum supported) don't need those columns, and their presence may suggest those ranges are still worth targeting.

| File | Line | Issue |
|------|------|-------|
| `extending-nx/createnodes-compatibility.mdoc` | 27 | Compatibility table columns include EOL Nx 17, 18, 19 |

---

## 2. Follow-up on Prior "Needs Input" Items

### Node 16 tsconfig Reference in Plugin Dev Guides (from June 11 report)

**Question from June 11:** Is the Node 16 tsconfig claim in local-generators and local-executors accurate to what Nx actually does internally?

**Finding:** Searched `packages/nx/src/` — no active code loads `@tsconfig/node16`. The only references are in historical lock-file snapshot fixtures. The root `tsconfig.base.json` targets ES2021/ES2022. The docs claim is **stale** — Nx no longer uses the node16 tsconfig base for local plugin compilation.

| File | Line | Verdict |
|------|------|---------|
| `extending-nx/local-generators.mdoc` | 116 | Stale: "uses the recommended tsconfig for node 16" — no active code does this |
| `extending-nx/local-executors.mdoc` | 145 | Same |

**Suggested fix:** Remove the sentence, or update to reference the actual base (ES2021 target).

---

### Vite `target: 'node18'` in Bundling Guide (from June 12 report)

**Question from June 12:** What is the right target to recommend for new projects in 2026?

**Verdict:** Node 18 went EOL April 2025. The current active LTS is Node 22. Recommend changing `target: 'node18'` → `target: 'node22'` in the Vite config example.

| File | Line | Verdict |
|------|------|---------|
| `technologies/node/Guides/bundling-node-projects.mdoc` | 113 | Stale: `target: 'node18'` in Vite config — change to `node22` |

---

## 3. Linear Issues to Create

**Note: Linear MCP tools unavailable** — the Linear SSE transport was deprecated and decommissioned (removal date was 2026-04-08). All tool calls return "Tool call rejected as a pre-removal deprecation signal." The following issues should be created manually for the **Docs** team, labeled **"Good for AI agents"**, kept in **Triage**, assigned to the **Linear agent** if available.

The issues below are cumulative across all three audits (June 11, 12, 15). Issues not yet filed:

---

**Issue 1 — Node 20/18 EOL: update tutorial prereqs and CI examples to Node 22+**

Node 20 went EOL 2026-04-30. Three flagship tutorials still require `v20.19 or later`. Eleven CI YAML files use `node-version: 20` or `image: node:20`. One file uses `image: node:18` (EOL 2025-04-30). All should be updated to Node 22 (active LTS).

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

---

**Issue 2 — Remove stale "since Nx 15/16" availability notices in active guides**

These asides and inline phrases reference Nx 15/16 features as if recently added. Since Nx 22 is current (and Nx 20 is the oldest supported), these are six+ major versions behind and add noise for every current user.

Affected files:
- `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc:9` — `{% aside type="tip" title="Available since Nx 16.6.0" %}`
- `technologies/typescript/Guides/define-secondary-entrypoints.mdoc:36` — `"as of Nx 16.8, you can specify..."`
- `extending-nx/create-install-package.mdoc:24` — `"Starting with Nx 16.5 you can now..."`
- `reference/glossary.mdoc:154,231` — `"This was made possible in Nx 15.3"`
- `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc:17–19` — `{% aside title="Requires Nx 15.3" %}`
- `guides/Tips-n-Tricks/include-all-packagejson.mdoc:7` — `"As of Nx 15.0.11, we only include..."`

---

**Issue 3 — Remove dead "In Nx 17 and higher" caveats in active docs**

These conditionals were written to distinguish Nx 17's new caching/config behavior from Nx <17. Every supported version (20, 21, 22) is already "17 and higher." The caveats should be collapsed into unconditional prose.

Affected files:
- `reference/nx-json.mdoc:378` — `"In Nx 17 and higher, caching is configured by specifying "cache": true..."`
- `reference/project-configuration.mdoc:212` — same caveat
- `extending-nx/project-graph-plugins.mdoc:368` — `"This functionality is available in Nx 17 or higher."`
- `troubleshooting/troubleshoot-cache-misses.mdoc:12–15` — `"If you're using a version lower than Nx 17.2.0, check:"` *(new, from this audit)*

---

**Issue 4 — Fix @nrwl/workspace:library example in nx-console-settings**

`reference/nx-console-settings.mdoc:225,244` shows `@nrwl/workspace:library` as an example in the generator allowlist / blocklist feature docs. The `@nrwl` scope was removed in Nx 18. Should be `@nx/workspace:library`.

---

**Issue 5 — Fix svgr option docs for NxReactWebpackPlugin — already removed in Nx 22**

`technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` lines 360–378 and 545–568 document an `svgr` option that was removed in Nx 22. The docs say it "will be removed in Nx 22" — it already was. Remove the option docs or update copy to say it was removed.

---

**Issue 6 — Update local-generators and local-executors Node 16 tsconfig claim**

Both `extending-nx/local-generators.mdoc:116` and `extending-nx/local-executors.mdoc:145` say Nx "uses the recommended tsconfig for node 16 for other compiler options." No active code in the Nx source uses `@tsconfig/node16` (only historical lock-file fixtures do). The sentence should be removed or replaced with the actual current behavior (ES2021 target in tsconfig.base.json).

---

**Issue 7 — Update Vite bundling example: change target from node18 to node22**

`technologies/node/Guides/bundling-node-projects.mdoc:113` uses `target: 'node18'` in a Vite config example. Node 18 went EOL April 2025. Should be `node22`.

---

**Issue 8 — Remove/rephrase "From Nx 19.7" intro framing in Nx Cloud auth docs**

`guides/Nx Cloud/access-tokens.mdoc:299` and `guides/Nx Cloud/personal-access-tokens.mdoc:11` both open sections with "From Nx 19.7 new workspaces are connected to Nx Cloud via nxCloudId..." This phrasing implies a recent change; it is now three major versions old. Should be rewritten as baseline behavior.

---

**Issue 9 — Trim createnodes-compatibility table to remove EOL Nx 17–19 columns**

`extending-nx/createnodes-compatibility.mdoc:27` shows a compatibility matrix spanning Nx 17–19.1, 19.2–20, 21, 22+. Nx 17, 18, and 19 are all EOL. The table could be trimmed to Nx 20, 21, 22+ to reduce confusion about whether plugin authors still need to support those versions.

---

**Issue 10 — Update minimum Nx version in convert-to-inferred guide**

`guides/Tasks & Caching/convert-to-inferred.mdoc:20` recommends `"At minimum, you should be on Nx version 19.6."` The minimum supported version is now Nx 20. Should say 20 (or just "the latest LTS").

---

**Issue 11 — Extremely old package versions in nx migrate --to example**

`guides/Tips-n-Tricks/advanced-update.mdoc:201` shows `nx migrate --to="jest@22.0.0,cypress@3.4.0"` as an example. Jest 22 is from 2017; Cypress 3.4 is from 2019. Line 207 shows `@nx/jest@12.0.0`. These are illustrative examples, but readers may copy them verbatim. Current versions: Jest ~30, Cypress ~14.

---

## 4. Needs Input

1. **Angular Module Federation page** — the page `technologies/module-federation/consumer-and-provider.mdoc` still documents Angular + Module Federation with an inline note saying Angular MF is unsupported and users should use `@angular-architects/native-federation`. Should this page be archived/redirected, or does the note suffice?

2. **"In Nx 19.X" historical context in concepts pages** — `sync-generators.mdoc:9`, `project-configuration.mdoc:233,588`, `guides/Nx Cloud/personal-access-tokens.mdoc`, and `module-federation-and-nx.mdoc:10` all have "As of Nx 19.X..." phrases. These are a lower priority than Nx 15/16 refs, but worth a cleanup pass once Nx 24 drops Nx 20 from LTS (removing these would imply the feature is now universal).

3. **launch-templates.mdoc changelog** — the file contains a version history of image names (ubuntu22.04-node20.x-v*). Are these historical records intentional, or should the docs only show the current default image?

---

## 5. Summary

| Priority | Issue | Source |
|----------|-------|--------|
| High | Node 20 (EOL) in 3 tutorials + 11+ CI files | June 11 |
| High | svgr option documented but removed in Nx 22 | June 12 |
| Medium | Node 16 tsconfig claim — not in active Nx source | June 11 + verified June 15 |
| Medium | Dead "If using Nx < 17.2.0" conditional in cache troubleshooting | **New, June 15** |
| Medium | Vite target: node18 (EOL) in bundling example | June 12 + verdict June 15 |
| Medium | Minimum version "Nx 19.6" in convert-to-inferred guide | June 11 |
| Low | "since Nx 15/16" asides in 6 active guides | June 11 |
| Low | "In Nx 17 and higher" caveats in 3 active docs | June 11 |
| Low | @nrwl/workspace in nx-console-settings example | June 11 |
| Low | "From Nx 19.7" framing in 2 auth docs | **New, June 15** |
| Low | createnodes-compatibility table includes EOL Nx 17–19 | **New, June 15** |
| Low | jest@22 / cypress@3.4 ancient versions in nx migrate example | June 11 |
