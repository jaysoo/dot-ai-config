# CLOUD-4629: Rotating CIPE CTA (sandboxing + resource usage), per-type dismiss

Linear: https://linear.app/nxdev/issue/CLOUD-4629
Branch: CLOUD-4629 (ocean worktree /Users/jack/projects/ocean-worktrees/CLOUD-4629)
Polygraph session: cloud-4629-rotating-banner-4e18c0c2 (ocean only; nx repo unused)

## Decisions (Jack, 2026-06-12)

- ~~JSON config~~ REVERSED after review: descriptors (copy, weights, icons, docs urls, posthog names) inline in component as typed CIPE_CTAS array. Eligibility logic can't live in JSON; no config DSL. Reviewer blocker #1 effectively accepted via Jack's change of mind.
- No version plan: upsell/advertising work skips public changelog (Jack). Memory saved.
- Review #2 accepted: shared isResourceUsagePreviewEligible in model-organizations, both loaders use it.
- Review #3 declined: per-CTA PostHog viewed names kept for dashboard continuity.
- Rotation = weighted random per page load (50-50 now), client-side pick (no SSR random).
- Analysis tab resource-usage banner stays as-is.
- Dismiss = localStorage timestamp per CTA id, 7-day expiry. Old boolean key ignored.
- One CTA dismissed/ineligible -> other shows 100%. Both gone -> nothing.
- PostHog viewed names keep continuity: sandbox-cipe-banner, resource-usage-cipe-banner. Dismiss capture carries cta id.

## Files

Create (libs/nx-cloud/feature-add-on-previews/src/lib/cipe-cta/):
- cipe-cta-config.json
- rotating-cipe-cta-banner.tsx (+spec)

Modify:
- feature-add-on-previews: index.ts, tsconfig.lib.json + tsconfig.spec.json (resolveJsonModule)
- delete sandbox/sandbox-cipe-banner.tsx (+spec) - subsumed
- data-access-ci-pipeline-execution details loader: add isResourceUsagePreviewEligible (same 3-condition gate as analysis layout loader)
- feature-ci-pipeline-executions: details layout (pass through), outlet context type, details container (render RotatingCipeCtaBanner)

## Verify

- nx test nx-cloud-feature-add-on-previews
- tsc -b touched libs (gradle fallback if nx graph broken)
- version plan: check unreleased sandbox CTA plan first
