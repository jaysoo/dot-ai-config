# Nx Cloud Workspace Claim Enforcement

**Date:** 2026-02-04
**Status:** Draft
**Author:** Jack Hsu (brainstorm with Claude)

## Problem Statement

Current onboarding funnel from Create-Nx-Workspace (CNW) to Nx Cloud has severe drop-off:

| Stage | Volume | Conversion |
|-------|--------|------------|
| CNW downloads (weekly) | ~20,000 | - |
| Say "yes" to Cloud prompt | ~2,000-4,000 | 10-20% |
| Claim workspace (fully connect) | ~40-80 | <2% of those who get URL |

**Root cause:** Users who say "yes" receive a short URL but have no urgency to complete setup. Everything works (remote caching, CIPEs) without claiming, so they never follow through.

Current optimizations (banners, messaging tweaks) are likely optimizing for a **local maxima**. This spec proposes a structural change to create a **forcing function** that drives completion.

## Solution Overview

**Enforce workspace claiming with a 7-day grace period. After 7 days, CI fails until the workspace is claimed.**

### Key Principles

1. **Urgency from day 1** — Messaging makes clear this is required, not optional
2. **Visible countdown** — Warnings in CI logs and PR comments during grace period
3. **Hard enforcement** — CI fails after 7 days (GitHub Action step exits non-zero)
4. **Instant recovery** — Claiming immediately restores CI functionality
5. **No grandfathering** — All existing unclaimed workspaces get 7-day countdown from ship date

### Success Metrics

- **Target:** 50% of CNW users say "yes" to Cloud → 10,000 users/week get short URL
- **Target:** 5% of those claim → 500 fully connected users/week
- Current: ~40-80/week → Target: 500/week (6-12x improvement)

## Component Specifications

### 1. CNW Terminal Messaging

**Location:** End of CNW output (last thing user sees)

**Current state:** Short URL displayed with soft "finish setup" language and visual banner.

**New messaging:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ⚠️  ACTION REQUIRED WITHIN 7 DAYS                                  │
│                                                                     │
│  Claim your workspace to keep CI running.                          │
│  After 7 days, CI pipelines will FAIL until you complete setup.    │
│                                                                     │
│  👉 Claim now: https://nx.app/connect/XXXXXXXX                      │
│                                                                     │
│  Check status anytime: npx nx cloud status                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Requirements:**
- [ ] Update terminal output with urgency messaging
- [ ] Include `nx cloud status` command reference
- [ ] Visually prominent (box, colors if terminal supports)

---

### 2. CNW README Changes

**Location:** Top of generated README.md

**Current state:**
```markdown
## Finish your Nx platform setup

🚀 [Finish setting up your workspace](https://nx.app/connect/XXXXXXXX) to get faster builds...
```

**New messaging:**
```markdown
## ⚠️ Action Required: Claim Your Workspace

**CI will stop working in 7 days** unless you complete setup.

👉 **[Claim your workspace now](https://nx.app/connect/XXXXXXXX)** (takes <5 minutes)

Once claimed, you can:
- Manage workspace settings and access
- Invite team members
- Ensure uninterrupted CI pipelines

Check status: `npx nx cloud status`

---
```

**Requirements:**
- [ ] Update README template with urgency messaging
- [ ] Include consequences (CI will fail)
- [ ] Include time estimate (<5 minutes)
- [ ] Reference `nx cloud status` command

---

### 3. New Command: `nx cloud status`

**Purpose:** Allow developers (and AI agents) to check workspace claim status locally.

**Usage:**
```bash
npx nx cloud status
```

**Output (unclaimed, within grace period):**
```
Nx Cloud Workspace Status
─────────────────────────
Workspace ID:  abc123
Status:        ⚠️  UNCLAIMED
Grace Period:  5 days remaining (expires 2026-02-11)

CI pipelines will FAIL after the grace period unless you claim this workspace.

👉 Claim now: https://nx.app/connect/XXXXXXXX
```

**Output (unclaimed, grace period expired):**
```
Nx Cloud Workspace Status
─────────────────────────
Workspace ID:  abc123
Status:        ❌ UNCLAIMED (EXPIRED)
Grace Period:  Expired on 2026-02-11

CI pipelines are currently FAILING. Claim your workspace to restore CI.

👉 Claim now: https://nx.app/connect/XXXXXXXX
```

**Output (claimed):**
```
Nx Cloud Workspace Status
─────────────────────────
Workspace ID:  abc123
Status:        ✅ CLAIMED
Claimed by:    user@example.com
Claimed on:    2026-02-05

Your workspace is fully configured.

Dashboard: https://nx.app/orgs/your-org/workspaces/abc123
```

**Requirements:**
- [ ] New `nx cloud status` command in Nx CLI
- [ ] Calls Cloud API endpoint to get status
- [ ] Clear visual formatting with status indicators
- [ ] Shows claim URL for unclaimed workspaces
- [ ] Shows dashboard URL for claimed workspaces
- [ ] Exit code: 0 (claimed), 1 (unclaimed/expired) — useful for CI/scripts

---

### 4. Cloud API Endpoint

**Purpose:** Provide claim status for CLI, AI agents, and internal use.

**Endpoint:** `GET /api/workspaces/:workspaceId/claim-status`

**Response (unclaimed):**
```json
{
  "workspaceId": "abc123",
  "claimed": false,
  "claimUrl": "https://nx.app/connect/XXXXXXXX",
  "gracePeriod": {
    "startDate": "2026-02-04T00:00:00Z",
    "endDate": "2026-02-11T00:00:00Z",
    "daysRemaining": 5,
    "expired": false
  }
}
```

**Response (claimed):**
```json
{
  "workspaceId": "abc123",
  "claimed": true,
  "claimedBy": "user@example.com",
  "claimedAt": "2026-02-05T14:30:00Z",
  "dashboardUrl": "https://nx.app/orgs/your-org/workspaces/abc123"
}
```

**Response (expired):**
```json
{
  "workspaceId": "abc123",
  "claimed": false,
  "claimUrl": "https://nx.app/connect/XXXXXXXX",
  "gracePeriod": {
    "startDate": "2026-02-04T00:00:00Z",
    "endDate": "2026-02-11T00:00:00Z",
    "daysRemaining": 0,
    "expired": true
  }
}
```

**Requirements:**
- [ ] New API endpoint
- [ ] Track workspace creation date for grace period calculation
- [ ] 7-day grace period (calendar days from creation)
- [ ] No authentication required (workspace ID is the secret)

---

### 5. CI Enforcement

**Location:** Nx Cloud agent / task runner

#### During Grace Period (Days 1-7)

**Behavior:** CI passes, but warning logged.

**Log output:**
```
───────────────────────────────────────────────────────────────────────
⚠️  WORKSPACE UNCLAIMED — 5 days remaining

Your CI pipelines will FAIL on 2026-02-11 unless you claim this workspace.
Claim now: https://nx.app/connect/XXXXXXXX
───────────────────────────────────────────────────────────────────────
```

#### After Grace Period (Day 8+)

**Behavior:** CI fails (exit code non-zero).

**Log output:**
```
───────────────────────────────────────────────────────────────────────
❌ CI FAILED: WORKSPACE UNCLAIMED

Your 7-day grace period has expired. CI is disabled until you claim this workspace.

To restore CI:
1. Visit: https://nx.app/connect/XXXXXXXX
2. Authorize the GitHub App
3. Re-run this pipeline

This takes less than 5 minutes.

Questions? Contact support: https://nx.app/support
───────────────────────────────────────────────────────────────────────
```

**Requirements:**
- [ ] Check claim status before/after CI run
- [ ] Log warning during grace period
- [ ] Fail with clear error after grace period
- [ ] Include claim URL in all messages
- [ ] GitHub Action step must exit non-zero to fail the workflow

---

### 6. GitHub PR Comments

**Location:** Nx Cloud bot comments on PRs

#### During Grace Period

**Trigger:** Every PR that runs CI

**Comment:**
```markdown
## ⚠️ Workspace Setup Required

This workspace has **5 days remaining** to complete setup before CI stops working.

**If you created this workspace:** [Claim it now](https://nx.app/connect/XXXXXXXX) (takes <5 minutes)

**If someone else created it:** Please contact them or your workspace admin to complete setup.

---
<sub>Posted by Nx Cloud • [Learn more](https://nx.dev/ci/intro/why-nx-cloud)</sub>
```

**Tone:** Informative, not alarming. Acknowledge that the PR author may not be the person who needs to act.

#### After Grace Period

**Trigger:** Every PR that runs CI (CI will have failed)

**Comment:**
```markdown
## ❌ CI Failed: Workspace Unclaimed

This workspace's 7-day setup period has expired. CI is disabled until the workspace is claimed.

**To restore CI:**
1. [Claim this workspace](https://nx.app/connect/XXXXXXXX) (takes <5 minutes)
2. Re-run this pipeline

**If you didn't create this workspace:** Contact your workspace admin to complete setup.

---
<sub>Posted by Nx Cloud • [Need help?](https://nx.app/support)</sub>
```

**Requirements:**
- [ ] Comment on every PR during grace period (with countdown)
- [ ] Comment on every failed PR after grace period
- [ ] Messaging acknowledges reader may not have control
- [ ] Not obnoxious — informative tone

---

### 7. Cloud UI Banners

**Location:** Nx Cloud dashboard

#### For Unclaimed Workspaces (During Grace Period)

**Banner (top of page, persistent):**
```
⚠️ Complete your workspace setup — 5 days remaining before CI stops working. [Complete setup →]
```

**Full-page prompt (on first visit):**
- Modal or interstitial explaining the requirement
- Clear CTA to complete setup
- Option to dismiss (but banner remains)

#### For Unclaimed Workspaces (After Grace Period)

**Banner (top of page, cannot dismiss):**
```
❌ CI is disabled. Complete workspace setup to restore CI functionality. [Complete setup →]
```

**Requirements:**
- [ ] Persistent banner for unclaimed workspaces
- [ ] Countdown during grace period
- [ ] More urgent styling after expiration
- [ ] Cannot dismiss after expiration

---

## Data Model Changes

### Workspace Table

Add fields:
- `created_at` — Timestamp of workspace creation (may already exist)
- `claimed_at` — Timestamp when workspace was claimed (null if unclaimed)
- `claimed_by` — User ID who claimed the workspace (null if unclaimed)
- `grace_period_end` — Computed: `created_at + 7 days`

### Migration for Existing Workspaces

For existing unclaimed workspaces at ship time:
- Set `grace_period_end` = `ship_date + 7 days`
- No grandfathering — everyone gets 7 days from ship

---

## Claiming Flow (Existing)

For reference, the current claiming flow is:

1. User clicks short URL (e.g., `https://nx.app/connect/XXXXXXXX`)
2. User sees form to enter workspace URL
3. User authorizes GitHub App on their account
4. If `nxCloudId` present in workspace (from CNW), setup is complete

**Time to complete:** <5 minutes

**No changes needed** to the claiming flow itself — it's already simple enough.

---

## Security Considerations

### Known Gap: Anyone with URL can claim

The short URL is stored in the README, which means anyone with repo access can claim the workspace. This is acknowledged but not addressed in this spec.

**Mitigations:**
- Urgency messaging encourages original creator to claim immediately
- After claiming, workspace is secured (only claimed owner can manage)

**Future consideration:** Require proof of repo ownership (e.g., must be repo admin, or verify via GitHub App permissions)

---

## Rollout Plan

### Phase 1: Messaging (No Enforcement)

Ship updated messaging in CNW and README without enforcement. Measure if improved messaging alone increases claim rate.

- [ ] Update CNW terminal output
- [ ] Update README template
- [ ] Deploy Cloud UI banners (warning only)

### Phase 2: Status Command + API

Ship tooling for checking status.

- [ ] `nx cloud status` command
- [ ] Cloud API endpoint
- [ ] CI warnings (no failure yet)
- [ ] PR comments (warning only)

### Phase 3: Enforcement

Enable hard enforcement (CI failure after 7 days).

- [ ] CI failure after grace period
- [ ] PR comments for failed CI
- [ ] Cloud UI enforcement banners

### Phase 4: Monitor + Iterate

- Track claim rates at each funnel stage
- Gather feedback from users hitting enforcement
- Adjust messaging/timing if needed

---

## Open Questions

1. **PR comment frequency:** Currently spec says every PR. Could become noisy for repos with many PRs. Consider rate limiting (e.g., once per day per repo)?

2. **Grace period length:** 7 days chosen as balance. Should we A/B test different periods (3 days, 14 days)?

3. **Email notifications:** Should we email the user who ran CNW? Requires capturing email during CNW or from Git config.

4. **Team notifications:** For unclaimed workspaces in orgs, should org admins be notified?

5. **Extend via support:** Manual DB extension for support escalations is noted. Need runbook for support team.

---

## Success Criteria

| Metric | Current | Target |
|--------|---------|--------|
| CNW → Says "yes" to Cloud | 10-20% | 50%+ |
| Gets URL → Claims | <2% | 5%+ |
| Fully connected users/week | ~40-80 | 500+ |

---

## Appendix: Message Copy

### Terminal Output (CNW)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ⚠️  ACTION REQUIRED WITHIN 7 DAYS                                  │
│                                                                     │
│  Claim your workspace to keep CI running.                          │
│  After 7 days, CI pipelines will FAIL until you complete setup.    │
│                                                                     │
│  👉 Claim now: https://nx.app/connect/XXXXXXXX                      │
│                                                                     │
│  Check status anytime: npx nx cloud status                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### README Section
```markdown
## ⚠️ Action Required: Claim Your Workspace

**CI will stop working in 7 days** unless you complete setup.

👉 **[Claim your workspace now](https://nx.app/connect/XXXXXXXX)** (takes <5 minutes)

Once claimed, you can:
- Manage workspace settings and access
- Invite team members
- Ensure uninterrupted CI pipelines

Check status: `npx nx cloud status`

---
```

### CI Warning (Grace Period)
```
───────────────────────────────────────────────────────────────────────
⚠️  WORKSPACE UNCLAIMED — X days remaining

Your CI pipelines will FAIL on YYYY-MM-DD unless you claim this workspace.
Claim now: https://nx.app/connect/XXXXXXXX
───────────────────────────────────────────────────────────────────────
```

### CI Error (Expired)
```
───────────────────────────────────────────────────────────────────────
❌ CI FAILED: WORKSPACE UNCLAIMED

Your 7-day grace period has expired. CI is disabled until you claim this workspace.

To restore CI:
1. Visit: https://nx.app/connect/XXXXXXXX
2. Authorize the GitHub App
3. Re-run this pipeline

This takes less than 5 minutes.

Questions? Contact support: https://nx.app/support
───────────────────────────────────────────────────────────────────────
```
