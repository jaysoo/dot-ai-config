# Summary - 2026-06-09

## Disable Add-ons settings page for OSS orgs (Nx Cloud / ocean) — draft PR #11730 marked ready

**Goal:** OSS orgs should see the Add-ons settings page visible-but-locked with an upgrade prompt, identical to Hobby (FREE) plan. Hiding it loses the chance to advertise paid features.

**What was found (read-only investigation in ocean):**
- Add-ons page: route `apps/nx-cloud/app/routes/_auth.orgs.$orgId.add-ons.tsx` -> loader `libs/nx-cloud/feature-organization-add-ons/src/lib/organization-add-ons-container-loader.server.ts` + component `organization-add-ons-container.tsx`. Gated on `NX_CLOUD_ADD_ONS_ENABLED`.
- Plan enum in `libs/nx-cloud/model-db/src/lib/organizations.ts`: `FREE` (Hobby), `OSS`, `TEAM`, etc.
- Locked state already existed for `FREE` only: loader returns `planLocked: true` (skips all add-on DB reads, every add-on unavailable); component renders the "Add-ons are available on paid plans / View plans ->" callout with disabled buttons.
- OSS bug: OSS fell through the FREE check into the full paid path -> fully functional add-ons page (same as Team). Nav was already correct (only ENTERPRISE excluded).

**Change (minimal, 2 files in `feature-organization-add-ons`):**
- Loader line 63: `if (organization.plan === 'FREE')` -> `if (organization.plan === 'FREE' || organization.plan === 'OSS')`. Routes OSS into the existing `planLocked` branch. No nav/component changes.
- Added loader spec `returns planLocked:true for OSS with NO pending-request reads`, mirroring the FREE test.
- `nx test feature-organization-add-ons`: 28/28 pass. Prettier applied. Single commit `0b27ff1`.
- No version plan: unreleased `2026-05-26-15-03-add-ons-page-revamp.md` (`nx-cloud: feat`) already covers this add-ons cycle.

**Delivery:** Coordinated via Polygraph session `disable-oss-addons-1b747745` (initiator nrwl/nx, added nrwl/ocean). All ocean work delegated to child agents (investigation + implementation). nrwl/nx untouched — purely Nx Cloud. Branch pushed, draft PR opened, then marked ready.
- PR: https://github.com/nrwl/ocean/pull/11730
- Session: https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/disable-oss-addons-1b747745
