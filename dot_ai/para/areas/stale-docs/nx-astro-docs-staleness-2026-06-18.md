# Nx Astro-Docs Staleness Audit — 2026-06-18

**Nx version at audit time:** 23.x (confirmed via `technologies/node/introduction.mdoc` node support matrix)
**Node.js EOL context:** Node 16 EOL 2023-09; Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-30
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (499 files)
**Previous audits:**
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — deprecated cacheableOperations/tasksRunnerOptions in active feature pages, dead Nx ≤ 19.6 conditionals, stale TS 4.7 ref, "prior to Nx 18" blocks
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option removed from source, stale Nx 15.7 linkcard
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Node 20/18/16 CI configs, Nx 15–17 version notes, @nrwl scope

Items already logged in prior audits are **excluded** from this report. This audit covers new findings only.

---

## 1. Deprecated Pages Using Future Tense for Past Events (Medium Priority)

### `reference/Deprecated/as-provided-vs-derived.mdoc` — "will be" language for Nx 20 (already happened in Nx 23)

This deprecated page has `sidebar: hidden: true` but is still reachable via direct URL and the Deprecated folder. The page was written describing upcoming Nx 20 changes that have since been completed. The language remains future tense throughout, making it confusing for anyone landing on it.

Key stale passages:

| Line | Stale text |
|------|-----------|
| 10 | `"Nx will only use the new behavior in Nx version 20"` — it did; we're on 23 |
| 29 | `"Nx will prompt you when running most generators until Nx 20"` — the prompt is gone |
| 54 | `"as-provided will be the only option in Nx 20"` — it already is |
| 93 | `"The following flags are deprecated and will be removed in Nx 20: --project, --flat, --pascalCaseFiles, --pascalCaseDirectory, --fileName"` — already removed |
| 110 | `"This behavior will not be available in Nx 20"` — already unavailable |

**Fix:** Update all "will be in Nx 20" language to past tense ("was changed in Nx 20", "were removed in Nx 20"). Since this is a deprecated-feature doc, the goal is helping users understand the historical migration path, not warn about a future change.

---

### `reference/Deprecated/v1-nx-plugin-api.mdoc` — "will be removed in Nx 20" (removed 3 versions ago)

Line 11, inside a `{% aside type="caution" %}`:

> "This API has been superceded by the v2 API and **will be removed in Nx 20**. If targeting Nx version 16.7 or higher, please use the v2 API instead."

The v1 API was removed in Nx 20. We're on Nx 23. The caution should say "was removed in Nx 20" and the version floor suggestion ("Nx version 16.7 or higher") is also 7+ major versions old.

| File | Line | Issue |
|------|------|-------|
| `reference/Deprecated/v1-nx-plugin-api.mdoc` | 11 | Future-tense removal warning for something that happened 3 major versions ago |

**Fix:** Change "will be removed in Nx 20" → "was removed in Nx 20". Drop the "if targeting Nx 16.7" guidance — anyone on v1 API at this point needs to migrate unconditionally.

---

## 2. Cypress Documentation Stale by Multiple Versions (Low Priority)

### `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc` — Mismatched link text + very old version gate

Lines 9–10:

```
> Component testing requires Cypress v10 and above.
> See our [guide for more information](/docs/technologies/test-tools/cypress/guides/cypress-v11-migration) to migrate to Cypress v10.
```

Two issues:
1. **Link text says "migrate to Cypress v10"** but the link targets the "Migrating to Cypress V11" guide — a user clicking the link expecting a v10 migration guide will land on v11 content.
2. **Cypress is now on v14**. The "v10 and above" statement is accurate (v14 is above v10) but misleading — a user reading this in 2026 is almost certainly on v13 or v14, not v8/v9 needing a v10 migration guide.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc` | 9–10 | Link text says "v10" but links to v11 migration guide; Cypress is now v14 |

**Fix:** Remove or reword the migration note. If kept, fix the link text to match the actual destination (v11 migration), and add a note that current Cypress is v14.

---

### `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` — Migration guide 3 major versions behind

This guide covers migrating from Cypress v8/v9 → v11. Current Cypress is v14. The generator `nx g @nx/cypress:migrate-to-cypress-11` still exists in the `@nx/cypress` package (confirmed in `packages/cypress/generators.json`), so the guide is technically functional. But the context is very dated: anyone still on v8/v9 is 3 minor generations behind the current v10 → v11 migration and needs to do further upgrades (v12, v13, v14) that aren't covered.

The introduction text says "Cypress v10 introduce new features... Nx can help you migrate from v8 or v9 of Cypress to v10 and then to v11." — all of this predates v12, v13, v14.

| File | Issue |
|------|-------|
| `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` | Migration guide targets Cypress v11; current is v14. No mention of v12–v14 upgrade path. |

**Fix:** Either (a) add a banner noting this covers v11 migration only and link to further Cypress upgrade docs, or (b) add a parallel guide for the v11→v14 path, or (c) archive the guide and redirect to the Cypress official migration docs.

---

## 3. Old Version Reference in Tips Guide (Low Priority)

### `guides/Tips-n-Tricks/include-all-packagejson.mdoc` — "As of Nx 15.0.11"

Line 7:

> "As of Nx 15.0.11, we only include any `package.json` file that is referenced in the `workspaces` property of the root `package.json` file in the graph."

Nx 15.0.11 was released ~3 years ago. This behavior is long-established baseline. The "As of" qualifier adds no value for users on Nx 23 and suggests the feature might be new or limited.

| File | Line | Issue |
|------|------|-------|
| `guides/Tips-n-Tricks/include-all-packagejson.mdoc` | 7 | "As of Nx 15.0.11" — 8 major versions old |

**Fix:** Remove the "As of Nx 15.0.11" qualifier. Keep the behavior description as-is.

---

## 4. Monitor: `composePlugins`/`withNx`/`withReact` Deprecation Notice

June 12 audit flagged this as "will be removed in Nx v24 — monitor when Nx 24 ships." Current Nx is 23.x, so these helpers are still present in source (`packages/webpack/src/utils/config.ts` still exports `composePlugins`). The webpack-plugins.mdoc deprecation notice is currently accurate ("still work in v23, using them logs a deprecation warning").

**Action needed when Nx 24 ships:** Update webpack-plugins.mdoc lines 374+, 411+, and related examples to say "was removed in Nx 24" and strip out the `composePlugins`/`withNx`/`withReact` code examples.

---

## Items Investigated and Cleared (Not Stale / In Scope for Other Pages)

| Pattern | Outcome |
|---------|---------|
| `reference/Nx Cloud/launch-templates.mdoc` node20.11–node20.19 changelog entries | Historical changelog entries, not recommendations. Already flagged as "needs input" in June 11 audit. |
| Angular Nx version matrix rows for Angular 14–16 | Reference table intentionally includes old pairings for users on old Angular. Already cleared in June 17 audit. |
| `extending-nx/createnodes-compatibility.mdoc` Nx 17-20 rows | Plugin compatibility matrix for authors supporting old Nx. Already cleared in June 17 audit. |
| `reference/project-configuration.mdoc:553` "In Nx 21+" continuous tasks | Within 2 major versions; recent enough. |
| `guides/Tasks & Caching/self-hosted-caching.mdoc` "Nx 20.8+" | Within 2 major versions. |
| Node 20 in tutorials / CI YAML | Already documented in June 11 audit as high-priority. |
| Node 16 tsconfig in local-executors/local-generators | Already documented in June 11 audit as medium-priority (also "Needs Input" item 3 there: verify internally). |
| `technologies/node/introduction.mdoc` Node 26 support note | Accurate — Nx currently supports Node 26 on the current release track. |

---

## Needs Input

1. **`technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc`** — The `migrate-to-cypress-11` generator still exists in source. Should it be kept as-is for the (rare) user still on v8/v9, supplemented with a newer v11→v14 guide, or archived? If the generator is also planned for removal, the docs should follow.

2. **`reference/Deprecated/as-provided-vs-derived.mdoc`** — This page is hidden from sidebar (`sidebar: hidden: true`) but still accessible via URL. Given all its "future Nx 20" content has already happened, is the page still serving any useful purpose? It may be a candidate for full removal or consolidation into a short "how we got here" note on the relevant concept pages.

---

## Linear Issue Status

**⚠️ Linear MCP unavailable:** All Linear tool calls during this session fail with:
> `Tool call rejected as a pre-removal deprecation signal. DEPRECATED TRANSPORT — REMOVAL DATE 2026-04-08 (past).`

The Linear MCP server in this environment uses the old SSE transport (removed 2026-04-08). Issues need manual creation or MCP config update to `https://mcp.linear.app/mcp`.

### Issues to Create (Docs Team / Triage / Label: "Good for AI agents")

| # | Title | Priority | Files |
|---|-------|----------|-------|
| 1 | Fix future-tense Nx 20 language in as-provided-vs-derived deprecated doc | Medium | `reference/Deprecated/as-provided-vs-derived.mdoc` |
| 2 | Update v1-nx-plugin-api deprecated doc: "will be removed" → "was removed in Nx 20" | Medium | `reference/Deprecated/v1-nx-plugin-api.mdoc` |
| 3 | Fix mismatched link text in cypress-component-testing: says "v10" but links to v11 guide | Low | `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc` |
| 4 | Update cypress-v11-migration guide: add banner noting Cypress is now v14, guide covers v11 only | Low | `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` |
| 5 | Remove "As of Nx 15.0.11" qualifier from include-all-packagejson guide | Low | `guides/Tips-n-Tricks/include-all-packagejson.mdoc` |

---

## Summary by Priority

| Priority | Count | Description |
|----------|-------|-------------|
| Medium | 2 | Deprecated pages use future tense for Nx 20 events (already happened in Nx 23) |
| Low | 2 | Cypress docs: mismatched v10/v11 link text, v11 guide 3 versions behind current v14 |
| Low | 1 | "As of Nx 15.0.11" qualifier in tips guide |
| Monitor | 1 | `composePlugins`/`withNx`/`withReact` deprecation notice needs update when Nx 24 ships |
