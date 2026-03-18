# Nx CLI Telemetry → Cloud Endpoint

This project expands the existing telemetry such that customers can see the metrics as well. This should be primarily a **revenue-generating** project, but has a secondary benefit of ensuring existing customers are happy (retention). We can look into making it free for users that help use test it out and provide feedback.

## Context

Nx 22.6.0 added anonymous CLI telemetry using GA4 Measurement Protocol, hardcoded to Google Analytics. Enterprise customers (Fidelity, Microsoft) want visibility into how their teams use Nx plugins/generators internally but have no way to access this data. Steven (DPE) reports Fidelity has been asking for ~6 months.

This spec defines routing CLI telemetry through Nx Cloud so enterprise customers can see usage analytics in their Cloud dashboard. The existing GA4 pipeline remains for Nrwl's internal analytics.

**Motivation from Slack thread (2026-03-17):**

- Fidelity has "blind spots in how people use their plugins/generators/etc."
- Microsoft mentioned "they only have the hooks to operate off of and they don't give the whole picture"
- Post-task-execution hooks don't cover generators
- Customers want a first-party solution, not DIY workarounds

## Requirements

### CLI Changes (`packages/nx` — Rust telemetry service)

#### Configuration

`nx.json` `analytics` property accepts three values:

| Value          | GA4 | Cloud (if connected) |
| -------------- | --- | -------------------- |
| `true`         | ✅  | ✅                   |
| `false`        | ❌  | ❌                   |
| `'cloud-only'` | ❌  | ✅                   |

- **`NX_CLI_TELEMETRY=false`** env var — hard kill switch, overrides `nx.json`, disables ALL telemetry (both GA4 and Cloud)
- No changes to the existing analytics prompt (yes/no for GA4)
- No migrations needed — existing `analytics: true` workspaces with Cloud connected automatically start sending to Cloud
- `'cloud-only'` is a manual `nx.json` edit for admins who want it

#### Cloud Telemetry Behavior

- **Prerequisite:** workspace has `nxCloudId` or `nxCloudAccessToken` configured
- Same anonymous data as GA4, serialized as **JSON** (not GA4 Measurement Protocol URL-encoded format)
- **Fire-and-forget** — no retries, no response checking
- Errors logged **only** when `NX_VERBOSE_LOGGING` is enabled
- Cloud decides server-side whether to record or discard (based on workspace setting in Cloud UI)

#### Rust Service Changes (`service.rs`)

- Add second HTTP destination in the background sender thread
- Branch serialization based on destination: GA4 URL-encoded format for Google, JSON for Cloud
- Reuse existing batching infrastructure (50ms interval, max 25 events per batch)
- Authentication: same headers as other Cloud API calls (`Authorization: Bearer {token}` or `Nx-Cloud-Id` header)
- Cloud endpoint URL: `{nxCloudUrl}/nx-cloud/telemetry/events` (derived from existing `nxCloudUrl` config, defaults to `https://nx.app`)

#### Key Files to Modify

| File                                            | Change                                                                                       |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `packages/nx/src/native/telemetry/service.rs`   | Add Cloud HTTP destination, JSON serialization path                                          |
| `packages/nx/src/native/telemetry/constants.rs` | Add Cloud endpoint path constant                                                             |
| `packages/nx/src/native/telemetry/mod.rs`       | Pass Cloud config (URL, auth) to service                                                     |
| `packages/nx/src/analytics/analytics.ts`        | Read `analytics` config (support `'cloud-only'`), pass Cloud connection info to Rust service |
| `packages/nx/src/utils/nx-cloud-utils.ts`       | Possibly reuse for Cloud URL/token resolution                                                |

### Cloud API Changes (`ocean` — Ktor)

#### New Endpoint

```
POST /nx-cloud/telemetry/events
```

- **Auth:** `nxCloudAuth` (protected route) — Bearer token or Nx-Cloud-Id header
- **Predicate:** `RequireConnectedWorkspace`
- **Behavior:** Check workspace telemetry setting → if enabled, store events; if disabled, noop (200 OK either way)
- **Storage:** MongoDB (or suitable time-series storage — implementation decision)

#### JSON Payload Schema

Mirrors GA4 data, clean JSON format:

```json
{
  "events": [
    {
      "type": "page_view",
      "name": "command_run",
      "params": {
        "nx_command": "build",
        "generator_name": null,
        "package_name": null,
        "package_version": null,
        "duration": 1234,
        "task_count": 5,
        "project_count": 3,
        "cached_task_count": 2,
        "is_ci": false,
        "is_ai_agent": false
      }
    }
  ],
  "environment": {
    "os": "darwin",
    "arch": "arm64",
    "node_version": "20.11.0",
    "nx_version": "22.6.0",
    "package_manager": "pnpm",
    "package_manager_version": "9.1.0"
  },
  "session_id": "uuid",
  "user_id": "machine-id-hash",
  "timestamp": 1710700000
}
```

**Notes:**

- `user_id` is machine-based hash (anonymous), not a Cloud user
- `session_id` reuses GA4 session logic (30-minute window)
- Null fields can be omitted
- Cloud already knows workspace from auth — no need to include workspace ID

#### Key Files to Create/Modify (Ocean)

| File                                                        | Change                   |
| ----------------------------------------------------------- | ------------------------ |
| `apps/nx-api/src/main/kotlin/handlers/TelemetryHandlers.kt` | New handler file         |
| `apps/nx-api/src/main/kotlin/Main.kt`                       | Register telemetry route |
| New data classes for request deserialization                |                          |
| New MongoDB collection + repository for telemetry events    |                          |

### Cloud UI Changes

#### Dashboard (Workspace-Level)

- Visible to **all workspace members**
- Time windows: **7-day** and **30-day** views
- **Top 10 commands** by frequency
- **Top 10 generators** by frequency
- **CSV export**: raw events for selected date range

#### Settings

- Toggle to **enable/disable** telemetry recording for the workspace
- When disabled, Cloud endpoint still accepts requests but discards data (noop)
- Location of toggle: TBD (see open questions)

## Open Questions

1. **Org-level vs workspace-level toggle?** Should the telemetry enable/disable setting live at the org level (affects all workspaces) or workspace level (granular control)? Workspace-level is more flexible but more settings to manage.

2. **Single endpoint architecture?** Could Cloud become the sole telemetry destination, forwarding to GA4 server-side? This would simplify the CLI (one destination, one serialization format) but adds Cloud-side complexity and couples GA4 availability to Cloud. Not a hard requirement — just worth evaluating.

3. **Data retention policy?** How long should Cloud retain telemetry events? 90 days? 1 year? Configurable per workspace/org?

4. **Rate limiting?** Should the Cloud endpoint enforce any rate limits per workspace to prevent abuse or runaway CI pipelines flooding events?

5. **Pricing?** This shoudn't be a free feature, but we need to figure out how to charge for it.

## Future Scope (Potentially)

- Custom/BYO telemetry endpoints for enterprise users
- Richer data (project names, per-task breakdowns, plugin/executor usage)
- Changes to the CLI analytics prompt
- On-prem/single-tenant Cloud support (uses same endpoint pattern but not in initial scope)

## Target

- No public timeline commitment — "strong possibility but not a guarantee"

## Ownership

- **CLI team (Dolphin)** owns end-to-end implementation
- Cloud API and UI changes are minimal — a CLI team member can make those changes directly
- No DPE or external communication until feature is ready

## Appendix: Current Implementation Reference

| File                                            | Purpose                                            |
| ----------------------------------------------- | -------------------------------------------------- |
| `packages/nx/src/analytics/analytics.ts`        | TS API, nx.json config check, service init         |
| `packages/nx/src/native/telemetry/mod.rs`       | NAPI exports, session mgmt, global instance        |
| `packages/nx/src/native/telemetry/service.rs`   | Background sender, batching, HTTP, sanitization    |
| `packages/nx/src/native/telemetry/constants.rs` | GA4 config, param limits, dimension names          |
| `packages/nx/src/utils/analytics-prompt.ts`     | User prompt, preference saving                     |
| `packages/nx/bin/nx.ts`                         | CLI entry point — starts analytics (lines 106-110) |
