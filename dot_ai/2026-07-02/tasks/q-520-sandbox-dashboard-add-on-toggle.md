# Q-520: Sandbox dashboard toggle for add-on requests

**Date:** 2026-07-02 | **Repo:** ocean | **Worktree:** `/Users/jack/projects/ocean-worktrees/Q-520` (branch `Q-520`, based on main @ 4b866ef098)
**Linear:** Q-520 | **Polygraph session:** q-520-add-on-toggle-ee2a2bed

## Goal

Toggle at top of Sandbox violations dashboard. Admin: toggle -> confirm modal -> enable SANDBOXING add-on via existing provision flow (and toggle off -> pending termination, same as add-ons page). Non-admin member: toggle -> same modal but "Request add-on" -> Remix action -> private nx-api handler -> persist request + Mandrill email to all org admins. Requested state is org-wide, survives refresh, expires after 48h (request cooldown so admins don't get spammed). Show who requested + timestamp (Vercel-style disabled "Requested" + tooltip).

## Decisions (from Jack, 2026-07-02)

1. Implementation shape per Altan: Remix action -> private nx-api handler (params: feature, requester) -> Kotlin `TransactionalEmailClient` to all org admins. Template lives in Mandrill; Jack uploads, I draft content.
2. Admins can toggle OFF (active until end of billing period, existing add-ons logic). Non-admins never see the toggle once active (hidden).
3. Org-level add-on: modal copy says "for the whole org"; reuse add-ons page language.
4. Email -> all org admins.
5. Requested state org-wide; show requester name + "Requested on <date> at <time>" tooltip on disabled control. Other members see it too, no notification to them.
6. Mandrill template: I draft subject/body + merge vars as deliverable.
7. Existing gating only (`workspace_sandboxing_toggle` PostHog flag / `NX_CLOUD_SANDBOXING_TOGGLE_ENABLED` env). No new flag.
8. Cooldown: one request per 48h; expires after 48h then can request again.

## Key recon facts (verified in worktree)

- Dashboard loader `libs/nx-cloud/feature-analytics/src/lib/sandbox-violations/sandbox-violations-loader.server.ts` already calls `requireWorkspaceAccess` which returns `{organization, membership, isAdmin}` - just not destructured. Views: `preview` (non-entitled, rendered by `SandboxViolationsPreview` in feature-add-on-previews) / `disabled` (entitled, enforcement OFF) / `data`.
- TS entitlement `isSandboxingAvailableForOrganization` requires BOTH `DEDICATED_COMPUTE_CLUSTER` AND `SANDBOXING` active (multi-tenant). Add-ons form cascades (SANDBOXING in `CLUSTER_DEPENDENT_FEATURES`). So dashboard enable must submit cluster+sandboxing when cluster not active -> fires provision webhook -> `planAddOnProvisionRequests` REQUESTED row -> minutes-long pending (add-ons page polls 10s). Cluster already active -> instant reconcile, no pending row.
- Existing enable API reusable from anywhere: POST `/orgs/:orgId/add-ons/provision` (`PlanAddOnProvisionAction`, admin re-checked server-side). GOTCHA: body = complete desired state; absent keys default false and get diffed as CANCELLATIONS. Caller must echo all active features (copy `AddOnsV2Form.submit()` pattern).
- Disable: `endAt` = end of billing period; re-enable before then = `restorePendingTerminationPlanAddOn` (clears endAt). Sandboxing enable also flips effectively-OFF workspaces to WARNING (`setInactiveSandboxingToWarning`).
- NO plan gating server-side in provision chain; FREE/OSS gating (planLocked), ENTERPRISE/private-enterprise 404, and `automated_add_ons` flag gate live ONLY in add-ons page loader. Dashboard toggle must replicate.
- NO member-request infra exists at all (net-new). Closest precedent: access-requests flow (`accessRequests` collection, `getPendingAccessRequestForUserId` dedupe, batched Mandrill `nx-cloud-access-request-pending` email to `getOrganizationAdminsToEmail`, non-blocking).
- Kotlin email precedent: `PlanAddOnNotificationService.sendAddOnEmail` - `Notifier.getOrganizationUsers(org, "admin")` filter `emailVerified`, per-admin `sendTemplate`, merge vars, link `$nxCloudAppUrl/orgs/{id}/add-ons`. Templates referenced by slug only (created/published in Mandrill UI; subject set there, not in code).
- Cache gotcha: loader sets `cache-control: max-age=3600,stale-while-revalidate=60` on preview AND disabled branches. Per-user/requested state in response => must drop those (vary by cookie insufficient for 1h stale).
- UI primitives: `Switch` (`libs/ocean/ui-primitives/src/lib/switch.tsx`, base-ui, checked/onCheckedChange; the `Toggle` primitive is a segmented control - do NOT use). `ConfirmationDialog` variant 'blue'|'red' + pendingValue pattern (`edit-workspace-visibility.tsx`). Access-request button = blue dialog precedent for member request.
- e2e: `util-e2e-mocks` intercepts internal provision endpoint (writes planAddOns directly); `createTestRequestedProvisionRequest` fixture exists; Mandrill test key in e2e mode (no email sink - assert DB rows); `auth.newPageAs(persona)` for admin vs member. `.env.serve.e2e` has `NX_CLOUD_SANDBOXING_TOGGLE_ENABLED=true`, `NX_CLOUD_ADD_ONS_ENABLED=true`, `NX_CLOUD_AUTOMATED_ADD_ONS_ENABLED=true`.
- `NX_CLOUD_SANDBOXING_ANALYTICS_ENABLED` is dead (only in .env.serve.e2e, no code reads it). Live flag = `NX_CLOUD_SANDBOXING_TOGGLE_ENABLED`.
- No unreleased sandboxing version plan remains in `.nx/version-plans/` -> new `minor` plan needed.

## Data model (net-new)

Collection `planAddOnFeatureRequests`:

```
{ _id, organizationId: ObjectId, feature: 'SANDBOXING',
  requestedByUserId: ObjectId, requestedByName: string, requestedByEmail: string,
  createdAt: Date }
```

- Active request = `findOne({organizationId, feature, createdAt: {$gt: now - 48h}})` - org-wide window, newest wins.
- No status field: expiry is time-based; enablement makes it moot (view flips to entitled). No approve/deny lifecycle.
- Kotlin: `MPlanAddOnFeatureRequest` in `libs/shared/db-schema-kotlin` (writer). TS: type + collection const in `libs/nx-cloud/model-db/src/lib/plan-add-ons.ts` + read query in data-access-api (reader).
- `REQUEST_COOLDOWN_HOURS = 48` constant on both sides (Kotlin authoritative for dedupe; TS for display/disable).

## Implementation steps

### 1. Kotlin: request endpoint (nx-api)

- `MPlanAddOnFeatureRequest` schema class + collection.
- `PlanAddOnRequestHandlers`: new internal route POST `/nx-cloud/private/plan-add-on/v1/request-feature` body `{organizationId, feature, requestedByUserId}` (unprotected internal; Remix is authz boundary, same as siblings).
- Service method (new `PlanAddOnFeatureRequestService` or extend notification service):
  - Dedupe: active request within 48h -> return existing (idempotent 200, no email).
  - Insert request row.
  - Email all org admins: follow `sendAddOnEmail` pattern (`Notifier.getOrganizationUsers(org, "admin")`, filter emailVerified, per-admin `TransactionalEmailClient.sendTemplate`). Template slug `nx-cloud-plan-add-on-requested`, merge vars: `ADD_ON_NAME`, `ORGANIZATION_NAME`, `USER_NAME`, `USER_EMAIL`, `LINK` (-> `/orgs/{id}/add-ons#sandboxing`). Failures logged, non-blocking.
  - No in-app notification (email-only per spec; Kotlin Notifier add possible later).

### 2. Remix: request action

- New action-only route `apps/nx-cloud/app/routes/_auth.orgs.$orgId.add-ons.request.tsx` (mirror `add-ons.provision.tsx`), action in feature lib.
- Gates: `requireOrganizationMember` (anonymous/ALLOW_AUTHENTICATED membership===null -> 403; UI hides control), plan not FREE/OSS/ENTERPRISE, mode not private-enterprise, automated add-ons flag on (mirror add-ons loader), sandboxing flag on, org not already entitled, no active request (fast-fail; Kotlin dedupes authoritatively).
- Calls nx-api request-feature endpoint. remix-toast success/error.

### 3. Remix: loader changes

`sandbox-violations-loader.server.ts`:

- Destructure `isAdmin`, `membership` from existing `requireWorkspaceAccess` call.
- New payload on ALL view branches (preview/disabled/data): `addOnToggle: { isAdmin, canManage, isMember, sandboxingActive, clusterActive, activeFeatures: PlanAddOnFeature[], pendingTerminationEndAt: string|null, pendingProvision: 'REQUESTED'|null, activeRequest: {name, createdAt}|null }`.
  - `canManage` = plan/mode/flag gates above (admin-only mutations still re-checked server-side).
  - `activeFeatures` for full-map echo on provision POST.
  - `pendingProvision` via existing `getPendingProvisionRequestForOrganization`.
  - `activeRequest` via new `getActiveAddOnFeatureRequest` query.
- Drop `max-age=3600` cache-control on branches whose payload is now per-user (preview + disabled at minimum; use no-cache/private).

### 4. UI: toggle + modal

New `SandboxAddOnToggle` component (placement: feature lib that both views can import - likely feature-add-on-previews imports it into preview, feature-analytics into container; check dep direction, else put in a ui-* lib):

- Rendered top-right of header on: preview view (both roles), disabled + data views (admin only).
- States:
  - Admin, not entitled: Switch off -> click -> blue `ConfirmationDialog` "Enable the sandboxing add-on" - org-wide copy + pricing from add-ons page language (sandboxing metered per report; discloses Dedicated compute cluster $99/mo committed spend when cluster not yet active) -> confirm -> fetcher POST `/orgs/:orgId/add-ons/provision` with full feature map (active features + SANDBOXING + DEDICATED_COMPUTE_CLUSTER) -> if webhook path: disabled toggle + "Provisioning..." + 10s revalidator polling (add-ons form pattern); else instant revalidate (view flips).
  - Admin, not entitled, active member request: same + hint "Requested by <name> on <date>".
  - Admin, entitled: Switch on -> click -> red dialog "Disable... active until <period end>" -> POST SANDBOXING=false (cluster untouched) -> toggle shows "Ends <date>"; toggling on again before period end -> blue restore dialog -> POST SANDBOXING=true (restore).
  - Member (has membership), not entitled, no active request: Switch off -> click -> same blue dialog, body explains org admin must enable, primary CTA "Request add-on" -> POST request action -> toast + revalidate -> requested state.
  - Member, active request (any requester): Switch disabled + "Requested" chip; tooltip "Requested on <date> at <time>" (+ requester name). Cleared naturally after 48h expiry.
  - Member, entitled: toggle hidden.
  - Anonymous / membership null / FREE / OSS / ENTERPRISE / private-enterprise: toggle hidden (existing banner CTA remains for preview).
- DESIGN.md deviations to surface: confirmation modal (gate "modals are last resort") - justified by existing ConfirmationDialog precedents (access-request, visibility). Copy passes No-AI-Voice (no "unlock" etc.). Switch primitive from @ocean/ui-primitives (not legacy headlessui).

### 5. Mandrill template draft (deliverable for Jack)

Slug `nx-cloud-plan-add-on-requested`; subject + HTML/text body draft with merge vars above. Jack creates + publishes in Mandrill UI before ship.

### 6. Tests

- Loader spec: new branches (isAdmin passthrough, addOnToggle payload per plan/role/request state, cache-control dropped).
- Request action spec: membership gate, plan gates, dedupe fast-fail, nx-api call, toast. (jest.mock util-auth pattern.)
- Toggle component spec (RTL): each state above, dialog flows, fetcher submits (mock base-ui/primitives per add-ons-v2-form.spec pattern).
- Kotlin: service test for dedupe + insert + recipient filtering if conventions allow.
- e2e `e2e/analytics/sandbox-violations-toggle.spec.ts`: seed org via `createTestOrganization` (memberships admin+member), `createTestSandboxReport`; new util-e2e-mocks handler for request-feature endpoint (insert row directly, like provision mock); admin enable flow (confirmation-dialog testids -> planAddOns in Mongo); member request flow with `auth.newPageAs` (Requested state persists across reload; assert DB row, not email).

### 7. Version plan + commits

- `.nx/version-plans/2026-07-0x-xx-xx-sandbox-dashboard-add-on-toggle.md`, `nx-cloud: minor`.
- Commits (review-friendly): (1) `feat(nx-api): plan add-on feature request endpoint + email`, (2) `feat(data-access-api): add-on feature request model + queries` (+ model-db), (3) `feat(feature-analytics): sandbox dashboard add-on toggle` (loader/UI/action), (4) `chore(testing): e2e for sandbox add-on toggle`, (5) version plan. PR base = `main`. PR title conventional, no agent prefix.

## Confirmed with Jack (2026-07-02)

- (A) Cluster coupling: enable both, modal discloses cluster $99/mo committed spend; provisioning pending state + polling on dashboard. CONFIRMED.
- (B) FREE/OSS: hide toggle (keep existing banner CTA). CONFIRMED.
- (C) Cooldown org-wide: one active request per org per feature per 48h. CONFIRMED.
- (D) Email-only admin notification (no in-app). CONFIRMED.

## Verification

- `tsc -b` per touched lib + direct jest (nx may be unusable in worktree - gradle plugin).
- Local manual: `nx serve nx-cloud --configuration=e2e` (flags already in .env.serve.e2e); screenshots for PR (chrome-devtools MCP).
- e2e: `nx run nx-cloud-e2e-playwright:e2e --grep "sandbox"`.
- DESIGN.md SS7 pre-ship checklist before done.
