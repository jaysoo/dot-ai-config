# Remote Cache Deprecation Reach-outs

## Goal

Check whether any orgs reached out through Pylon/email/support or Slack about deprecated remote cache plugins and interest in Nx Cloud remote cache.

## Searches

- Pylon recent support issues from 2026-01-01 through 2026-06-17, with drill-down on cache/Nx Cloud-related issues.
- Pylon message history for relevant adjacent issues: #826, #800, #798, #797, #790, #758.
- Notion connected-source fallback for Slack/package-name terms:
  - `@nx/s3-cache`
  - `@nx/gcs-cache`
  - `@nx/azure-cache`
  - `@nx/shared-fs-cache`
  - `remote cache plugin(s) deprecated Nx Cloud`

## Result

No clear support or Slack-sourced reach-out found where an org referenced the remote cache plugin deprecation or asked to move from those plugins to Nx Cloud remote cache.

Adjacent cache/Nx Cloud threads found:

- Strike, Pylon #826: already using Nx Cloud primarily for remote caching; asked about credit usage/cost visibility.
- Mimecast, Pylon #758: Slack support thread about cache hit rate falling to 4% and credit overage/comp discussion.
- Island, Pylon #790: Slack support thread about failed cached artifact downloads; root cause looked like runner disk limits.
- CIBC, Pylon #800/#798: Nx Cloud single-tenant/Azure capacity and task retrying issues.
- PayFit, Pylon #797: asked about Nx major-release breaking changes, but not remote cache plugin deprecation.
