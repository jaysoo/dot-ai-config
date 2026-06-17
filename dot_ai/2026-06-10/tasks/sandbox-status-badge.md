# Public sandbox status badge (ocean)

**Date:** 2026-06-10
**Branch:** `badge-sandbox-4c2e7734` (ocean)
**Polygraph session:** `badge-sandbox-4c2e7734`
**Status:** PUSHED, draft PR https://github.com/nrwl/ocean/pull/11878 (commit `5f87e43fb4`, 2026-06-12).

## Final behavior (simplified 2026-06-12)

Entitlement-only, two states, NO violations query:
- Green "Build integrity by Nx": org has sandboxing (`isSandboxingAvailableForOrganization` = ENTERPRISE plan or active SANDBOXING add-on)
- Red "Build not protected": otherwise
- Yellow state, getBranchViolatingTaskCount, enforcement-mode check, 7-day window: all REMOVED per Jack
- `?style=for-the-badge` renders 28px uppercase shields variant (matches nx README row)
- server.js: path-scoped CORP cross-origin override after helmet (helmet default same-origin blocks third-party embeds)

## Local demo (2026-06-10)

- `/tmp/badge-demo/{github,npmx}/index.html` — saved copies of github.com/nrwl/nx (curl) and npmx.dev/package/nx (Playwright outerHTML POSTed to local save-server; npmx.dev blocked by curl sandbox). Badge `<img>` injected after the License badge in each README badge row, `<base href>` added, npmx CSP meta + Nuxt scripts stripped (CSP blocked cross-origin styles/imgs; hydration would wipe the snapshot).
- Serve with `npx serve /tmp/badge-demo` -> /github/ and /npmx/.
- Found real bug: helmet sets `Cross-Origin-Resource-Policy: same-origin` app-wide -> browsers block the badge on third-party pages (ERR_BLOCKED_BY_RESPONSE.NotSameOrigin). Fix in commit: server.js middleware after helmet sets `cross-origin` for the badge path (loader-level header just duplicates helmet's -> invalid combined value). Needs nx-cloud serve restart to take effect.

## Goal

Public GitHub README badge reporting a workspace's cache-sandboxing status from the workspace id in the URL.

## Behavior

Route: `/workspaces/{workspaceId}/sandbox-badge.svg` (public, no auth)

- Sandboxing enforcement OFF -> red `Cache unprotected` (#ef4444)
- Enabled + 0 violations on default branch -> green `Cache protected by Nx` (#22c55e)
- Enabled + violations on default branch -> yellow `Cache unreliable` (#eab308)
- Unknown/malformed workspace id -> 404

Details:

- Label segment = org name (anti-spoofing: copied badge URL is visibly attributed to its org). XML-escaped.
- Badge links to https://nx.dev/docs/features/ci-features/sandboxing (`<a xlink:href>` in SVG; README embeds need the markdown link wrapper since camo strips links).
- Violations: `getBranchViolatingTaskCount` (data-access-api), 7-day window, latest report per task, branch = `workspace.defaultBranch ?? 'main'`.
- Enabled check: `resolveSandboxingEnforcementMode(workspace.sandboxingConfiguration) !== 'OFF'`. No org-entitlement or PostHog flag check (badge reflects workspace config; avoids flag lookups on a public endpoint).
- Colors: hex mirroring status-*-accent tokens (camo can't parse OKLCH).
- `cache-control: public, max-age=300`.
- clipPath id unique per status (inline-embed id-collision safety).

## Files

- `apps/nx-cloud/app/routes/_resource.workspaces.$workspaceId.sandbox-badge[.svg].tsx` (re-export)
- `libs/nx-cloud/feature-analytics/src/lib/sandbox-violations/sandbox-badge-loader.server.ts`
- `libs/nx-cloud/feature-analytics/src/lib/sandbox-violations/sandbox-badge-svg.ts`
- `libs/nx-cloud/feature-analytics/src/lib/sandbox-violations/sandbox-badge-loader.server.spec.ts` (8 tests)
- `libs/nx-cloud/feature-analytics/src/index.server.ts` (barrel export)
- `.nx/version-plans/2026-06-10-12-42-sandbox-status-badge.md` (nx-cloud: feat)

## Verification

- `tsc -b libs/nx-cloud/feature-analytics/tsconfig.lib.json` clean (used `--force` once to rebuild stale out-tsc; `nx` unusable due to gradle plugin sandbox issue)
- `jest --testPathPatterns sandbox-badge` 8/8 pass
- All three variants rendered + screenshotted via local http server + Playwright (use `<img>` tags, NOT inline SVG, in preview pages: duplicate clipPath ids clip wider badges)
- Docs URL curl 200

## Pending

- Push: remote `badge-sandbox-4c2e7734` has stale pre-amend commit; needs `git fetch` + `git push --force-with-lease` (polygraph push_branch pull-rebase conflicts on amends). Jack paused pushing.
- Then draft PR via polygraph create_pr + CI.
