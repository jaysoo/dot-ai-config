# Nx Astro Docs Staleness Audit — 2026-07-19

**Scope note:** like the 2026-07-10 pass, this was a **targeted 3-agent audit** scoped to the three requested staleness smells: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator/config options that no longer match source. It is **not** a full re-sweep of all 509 `.mdoc` files — the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog (as amended by 07-10 and this cycle) remains the authoritative running list until another exhaustive pass runs.

**Version baseline (verified live, not from training data):**
- Nx: `npm view nx version` → **23.1.0** published; repo root `package.json` devDependency → **23.2.0-beta.0**. Consistent with the 07-10 baseline (23.1.0-beta.7) — no drift.
- Node.js (via live web search, nodejs.org/endoflife.date, checked 2026-07-19): **Node 20 EOL'd April 30, 2026** (now confirmed past, was "nearing EOL" last cycle). **Node 22** = Maintenance LTS. **Node 24** = Active LTS. **Node 26** (released May 2026) = Current, enters LTS Oct 2026. Node 18 long EOL. Node 21/25 were never-LTS/EOL lines.
- These match `technologies/node/introduction.mdoc`'s compatibility table — no drift found there this cycle.

**Linear MCP unavailable again — 7th consecutive audit cycle**, and the failure symptom has changed *again*: `ListConnectors` now reports Linear as `installState: "unknown"`, **`enabledInChat: false`** — meaning the connector isn't even toggled on for this session, unlike 07-10 where it showed `enabledInChat: true` with zero tools exposed, and 06-17 where the symptom was "SSE transport removed." Three different symptoms across three consecutive cycles strongly suggests this needs direct human investigation in claude.ai connector settings rather than another automated retry next cycle. All issues below are queued for manual creation, appended to the running backlog.

---

## Summary

| Category | Confirmed (new) | Re-verified (still unfixed, known) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 2 (minor, added to existing bucket) | 6 | 0 |
| Old Node/npm/framework version | 0 new | 1 (bundling-node-projects.mdoc node18) | 1 |
| Mismatched CLI/feature vs. source | 4 (**new**) | 1 (nx-daemon.mdoc, independently re-confirmed) | 2 |
| **Total new confirmed** | **6** | — | **3** |

---

## Confirmed Findings — New This Cycle

### C-1 — `reference/nx-json.mdoc`: `maxCacheSize` default does not have a 10GB cap
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (line 1051)
**Category:** mismatched-feature
**Issue:** Doc states: "Nx defaults to a maximum size of 10% of the size of the disk where the cache is stored, **up to a maximum of 10GB**. This means that if your disk is 100GB, the maximum cache size will be 10GB." Source (`packages/nx/src/native/cache/cache.rs:471-482`, `get_default_max_cache_size`) computes `disk.total_space() * 0.1` with **no upper cap** at all, falling back to 100GB only when no matching disk can be found. On a 1TB disk the real default is 100GB, not 10GB — the doc's "up to a maximum of 10GB" clause is fabricated; the 100GB→10GB example only works by coincidence of the specific disk size chosen.
**Confidence:** high — file:line evidence on both sides.

---

### C-2 — `concepts/how-caching-works.mdoc`: default output fallback described as repo-root, actually project-relative and build-only
**File:** `astro-docs/src/content/docs/concepts/how-caching-works.mdoc` (line 126)
**Category:** mismatched-feature
**Issue:** Doc states: "If neither is defined, Nx defaults to caching `dist` and `build` **at the root of the repository**." Source (`packages/nx/src/tasks-runner/utils.ts:393-406`, `getOutputsForTargetAndConfiguration`) shows the fallback is project-relative (`dist/{node.data.root}`, `{root}/dist`, `{root}/build`, `{root}/public`) and **only applies when the target is `build` or `prepare`** — any other target with no configured outputs falls back to caching nothing. The sibling page `reference/project-configuration.mdoc` (lines 286–291) already states this correctly; the inaccuracy is isolated to this page's simplified paraphrase.
**Confidence:** high.

---

### C-3 — `technologies/react/next/introduction.mdoc`: supported Next.js floor overstated
**File:** `astro-docs/src/content/docs/technologies/react/next/introduction.mdoc` (line 22)
**Category:** mismatched-feature
**Issue:** Compatibility table states supported `next` versions are `>=15.0.0 <17.0.0`. Source: `packages/next/package.json:70` peerDependency `"next": ">=14.0.0 <17.0.0"`, and `packages/next/src/utils/versions.ts:5` sets `minSupportedNextVersion = '14.0.0'`. The doc's floor is one major too high — a reader running Next 14 would think they're unsupported when they aren't.
**Confidence:** high (independently re-verified by two separate sub-agent passes).

---

### C-4 — `technologies/react/next/introduction.mdoc`: `serveStaticTargetName` not flagged as deprecated
**File:** `astro-docs/src/content/docs/technologies/react/next/introduction.mdoc` (line 175)
**Category:** mismatched-feature
**Issue:** Doc lists `serveStaticTargetName` as "Name of the static export serve task" alongside `startTargetName`, with no deprecation note, implying it's a distinct, currently-recommended option. Source: `packages/next/src/plugins/plugin.ts` lines 34–36 mark it `@deprecated Use startTargetName instead`, and line 181 (`targets[options.serveStaticTargetName] = startTarget`) shows it's literally aliased to the exact same target object as `startTargetName` — not a separate "static export" task as the doc implies.
**Confidence:** high.

---

### C-5 — `technologies/react/Guides/adding-assets-react.mdoc`: SVGR/Rspack removal has now actually happened (escalation of backlog item #11)
**File:** `astro-docs/src/content/docs/technologies/react/Guides/adding-assets-react.mdoc` (line 48)
**Category:** old-nx-version / mismatched-feature
**Issue:** Doc says the `svgr` option is "deprecated for Rspack (**will be removed in Nx 23**)." This was previously flagged in the 06-29 audit (item #11, "v23/v24 deprecation framing... confusing forward-looking framing since v23 wasn't released yet"). **Nx 23 has since shipped** (current is 23.1.0/23.2.0-beta.0) and `packages/rspack/src/migrations/update-23-0-0/add-svgr-to-rspack-config.ts` confirms the `svgr` option was actually migrated out of `withReact`/`NxReactRspackPlugin` as part of the 23.0.0 migration — no `svgr` option remains anywhere under `packages/rspack/src/plugins` or `src/utils`. The doc's future tense ("will be removed") is now definitively wrong, not just confusingly early — the removal is done and the doc still describes it as pending, with no working example for the current (SVGR-less) setup.
**Confidence:** medium (removal evidenced by the migration script; didn't independently re-confirm every current published version number beyond the npm registry check above).

---

### C-6 — Two more "Nx 20+" version anchors to fold into the existing "low-value version qualifiers" cleanup (backlog item #26)
**Files:**
- `astro-docs/src/content/docs/guides/ci-deployment.mdoc` (line 8) — "the default in Nx 20+"
- `astro-docs/src/content/docs/technologies/node/Guides/deploying-node-projects.mdoc` (line 3, frontmatter description: "Replaces the deprecated generatePackageJson option in Nx 20+"; line 195: "If you're upgrading to Nx 20+ with TS Solution Setup (the default for new workspaces)")

**Category:** old-nx-version
**Issue:** Same pattern as the existing item #26 bucket — describing long-since-default behavior with a version anchor 3 majors behind current (23.x). Not urgent individually; folding into the existing cleanup issue rather than filing separately.

---

## Re-verified — Still Unfixed (known, no change needed to backlog)

Sampled and independently re-confirmed still open this cycle:
- `reference/Deprecated/v1-nx-plugin-api.mdoc` — future tense "will be removed in Nx 20" (backlog #10 / prior C-1)
- `reference/Deprecated/as-provided-vs-derived.mdoc` — same future-tense pattern, 3 separate lines (backlog #10)
- `reference/Deprecated/rescope.mdoc` — "Starting in version 20... will no longer be published" (backlog #26)
- `technologies/module-federation/concepts/module-federation-and-nx.mdoc` — "As of Nx 19.5" framing (backlog #20)
- `guides/Tips-n-Tricks/include-all-packagejson.mdoc` — "As of Nx 15.0.11" (backlog #26)
- `guides/Nx Cloud/access-tokens.mdoc` + `personal-access-tokens.mdoc` — "authentication is changing" / "From Nx 19.7" (backlog #24)
- `reference/project-configuration.mdoc` lines 233, 533 — "In Nx 19.5.0+" / "version 16 or greater" (backlog #26)
- `technologies/node/Guides/bundling-node-projects.mdoc` — `target: 'node18'` esbuild/Vite target (backlog #16)
- `concepts/nx-daemon.mdoc` — `useDaemonProcess` documented as nested under "runners options"; independently re-confirmed via a 3rd source read this cycle, which also found the exact migration that moved it (`packages/nx/src/migrations/update-20-0-0/move-use-daemon-process.ts`) — strong confirmation this is a real, currently-unfixed bug (backlog #22)

---

## Needs Input

### NI-1 — Nx Cloud launch template images still list Node 20 base images (re-verified, = prior H-11/H-12, backlog #9)
`reference/Nx Cloud/launch-templates.mdoc` and `launch-template-examples.mdoc` list `ubuntu22.04-node20.x-vY` images in what reads as a historical per-release changelog format, making it hard to tell if any *current* recommendation still points at a Node 20 base image (which is now confirmed EOL as of this cycle's live check). Needs a docs-team read to confirm whether the changelog format is purely historical or whether a currently-steered path still recommends Node 20.

### NI-2 — `reference/nx-json.mdoc`: `preferDockerVersion` default description omits a conditional
Doc states flat `Default: false`; source comment at `packages/nx/src/config/nx-json.ts:596-599` indicates it's `true` when Docker release config is present, `false` otherwise. Minor nuance — judgment call on whether it's worth a doc fix or too pedantic to bother with.

### NI-3 — Angular version floor claims in `use-environment-variables-in-angular.mdoc` (lines 14, 116) aren't verifiable from this repo
Claims like "requires Angular 17.2.0" describe upstream Angular's own version history, not something gated in Nx source — no version-check logic found in Nx code for these specific claims. Can't confirm/deny without checking Angular's own changelog.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Items 1–27 carried forward unchanged from the [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) and [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) audits (still unfixed — see re-verification section above for the sampled subset). Items 28–33 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 28 | Fix nx-json.mdoc: `maxCacheSize` doc claims a hard 10GB cap that doesn't exist in source (actual: 10% of disk, uncapped, 100GB fallback) | High | 1 file |
| 29 | Fix how-caching-works.mdoc: default output fallback is project-relative and build/prepare-target-only, not "dist and build at the root of the repository" | Medium | 1 file |
| 30 | Fix next/introduction.mdoc: supported Next.js floor is 14.0.0 per source, doc says 15.0.0 | Medium | 1 file |
| 31 | Fix next/introduction.mdoc: mark `serveStaticTargetName` as deprecated (it's aliased to `startTargetName`, not a distinct option) | Low | 1 file |
| 32 | Fix adding-assets-react.mdoc: SVGR/Rspack removal already shipped in Nx 23 — update future tense and add a working SVGR-less example (escalation of item #11, this file specifically) | Medium | 1 file |
| 33 | Add 2 more files to the low-value version qualifier cleanup (item #26): ci-deployment.mdoc "the default in Nx 20+", deploying-node-projects.mdoc "Nx 20+" ×2 | Low | 2 files |

---

## Linear MCP Status — Escalation (now 3rd distinct symptom in 3 cycles)

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-19) unable to create Linear issues programmatically. The specific symptom has now changed for the third time running:
- 06-17: "SSE transport removed"
- 07-10: `ListConnectors` showed `enabledInChat: true`, but `ToolSearch` returned zero Linear tools for any query
- **07-19 (this cycle):** `ListConnectors` now shows Linear `enabledInChat: false` — the connector isn't even toggled on for this session

A rotating set of distinct failure modes over a month-plus, rather than one consistent error, points away from a transient blip and toward something worth checking directly in claude.ai's connector settings (re-auth, re-toggle "enabled in chat" for this project/session, or check whether the Linear workspace connection itself needs re-linking). Recommend this get looked at directly rather than deferred to cycle 8.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
