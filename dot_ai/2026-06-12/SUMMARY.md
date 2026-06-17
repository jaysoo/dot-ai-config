# 2026-06-12 Summary

## Public sandbox status badge endpoint — PR #11878 MERGED

- New public (no-auth) resource route `/workspaces/{workspaceId}/sandbox-badge.svg` (`SandboxBadgeLoader` in nx-cloud-feature-analytics). Entitlement-only, two states: green "Build integrity by Nx" when org has sandboxing (`isSandboxingAvailableForOrganization` = ENTERPRISE or SANDBOXING add-on), red "Build not protected" otherwise. Earlier iterations (violations on default branch via `getBranchViolatingTaskCount`, yellow "Cache unreliable", enforcement-mode check) removed per Jack — no DB reads beyond workspace + org lookup.
- Shields-style SVG helper: org-name label (anti-spoofing, XML-escaped), links to Task Sandboxing docs, `?style=for-the-badge` 28px uppercase variant (matches nx README row), `text-decoration=none` (Chrome UA underlines SVG anchors), textLength-pinned text, hex colors mirroring status tokens (camo can't parse OKLCH).
- Real bug found while demoing: helmet's app-wide `Cross-Origin-Resource-Policy: same-origin` blocks third-party embeds (`ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`); fixed with path-scoped `cross-origin` middleware in server.js (loader-level header only duplicates helmet's -> invalid combined value).
- Local demo: saved github.com/nrwl/nx + npmx.dev/package/nx copies in `/tmp/badge-demo` with badge injected into README badge rows (npmx via Playwright DOM capture - curl sandbox-blocked; GitHub needed hydrated-DOM capture + script strip since React hydration dropped the injected node; npmx needed CSP meta + Nuxt script strip).
- 7/7 loader specs, tsc clean, version plan (nx-cloud: feat). Polygraph session `badge-sandbox-4c2e7734`: PR linked + MERGED, Linear CLOUD-4623 (Build API endpoints for dynamic badges, Github badges milestone) linked. A separate session reviewed the PR (`tasks/review-ocean-pr-11878.md`) - no blocking findings.
- CLOUD-4623 still Todo, assigned Benjamin - flagged to Jack that the merged PR implements at least part of it; CLOUD-4620 defines the official badge copy set, worth cross-checking final wording.
- Plan: `dot_ai/2026-06-10/tasks/sandbox-status-badge.md`

## CLOUD-4629: Rotating CIPE CTA (sandboxing + resource usage) — PR #11871 MERGED

- RotatingCipeCtaBanner replaces SandboxCipeBanner on the CIPE run view. One CTA per page load, uniform random from the eligible + non-dismissed pool. Per-CTA localStorage timestamp dismiss (`nx-cloud:cipe-cta-dismissed:<id>`), 7-day expiry; legacy boolean sandbox key ignored.
- CTAs are a typed CIPE_CTAS descriptor array inline in the component. Review arc: JSON config (original requirement) dropped after reviewer flagged the JSON/presentation-map/href-ternary split and Jack reversed; weight field dropped too (50-50 definitional with two CTAs). Pure `pickCipeCta` keeps the effect a one-liner; useMemo not viable (localStorage + Math.random during render).
- Shared `isResourceUsagePreviewEligible` extracted to model-organizations, used by CIPE details + Analysis tab loaders (+4 specs).
- No version plan: upsell/advertising work skips the public changelog (Jack rule, saved to ocean memory).
- 6 commits, 10 new specs + 35/35 lib suite, tsc clean. Linear Done, Polygraph session `cloud-4629-rotating-banner-4e18c0c2` archived (Linear ticket linked, PR auto-linked, local clones cleaned).
- Plan: `dot_ai/2026-06-12/tasks/cloud-4629-rotating-cipe-cta.md`
