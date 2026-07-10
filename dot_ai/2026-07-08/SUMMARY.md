# Summary — 2026-07-08

## Q-520: Sandbox dashboard add-on request control (ocean) — MERGED

PR #12211 merged to `main`. Closes the multi-round review loop opened 2026-07-02.

Today's work (final review rounds + merge):

- **Plannotator round**: restored the unique compound index `{organizationId, feature, requestedByUserId}` + atomic duplicate-key re-read in `PlanAddOnFeatureRequestRepository.claimActiveRequest` (the earlier non-unique version reintroduced a same-user duplicate-email race on double-click). One insert+email wins; the loser trips the index, re-reads the existing request, returns `claimed=false`, no second email. Fixed stale org-wide comments left over from the pre-per-member model.
- Trimmed the claim-fallback comment/error string ("(or lost a concurrent insert)" removed — the member simply already has an active request).
- **Graphite round**: `getActiveAddOnFeatureRequest` now takes `requestedByUserId: MongoId` and uses `convertToObjectId()` internally instead of `string` + `new ObjectId()` (Entity Reuse pattern conformance, matches sibling query files). Loader still passes a plain string, so the jsdom `TextEncoder` avoidance holds. Typecheck + prettier clean.

Feature recap (per-member model): sandbox violations dashboard shows an add-on CTA in the banner footer. Admins enable inline (confirm dialog -> existing provision flow, always pulls in DEDICATED_COMPUTE_CLUSTER, $99/mo committed spend disclosed). Non-admin members request it -> persisted one-doc-per-org+feature+member (48h window, unique index) + Mandrill email to all org admins. Pure functions (`buildSandboxAddOnCta`, `buildEnableAddOnSelection`) extracted for mock-free tests; over-mocked `*.server.spec.ts` dropped in favor of Playwright e2e.

Polygraph session `q-520-add-on-toggle-ee2a2bed` — nrwl/nx (initiator) + nrwl/ocean — https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/q-520-add-on-toggle-ee2a2bed

Files: `dot_ai/2026-07-02/tasks/q-520-sandbox-dashboard-add-on-toggle.md`, `dot_ai/2026-07-02/tasks/q-520-mandrill-template-draft.md`, `dot_ai/2026-07-02/tasks/q520-shots/`

Open item (Jack, not blocking merge): publish the Mandrill template `nx-cloud-plan-add-on-requested` before the feature ships to prod.
