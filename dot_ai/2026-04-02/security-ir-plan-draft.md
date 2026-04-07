# Security Incident Response Plan — NEW

New page under [Incident Management](https://www.notion.so/nxnrwl/Incident-Management-462453a4546340b8820c5d9d9ba74892), alongside the existing Incident Response Process & Guidelines.

---

# Security Incident Response Plan

This document covers **security incidents** — data exposure, unauthorized access, access control failures, credential leaks. For operational/availability incidents (outages, performance degradation), see the [Incident Response Process](https://www.notion.so/nxnrwl/Incident-Response-Process-Guidelines-21569f3c23878017a562cce81c2b1b62).

---

## 1. Detection

Security incidents don't come from Grafana alerts. They surface through:

| Source                                 | What to do                                    |
| -------------------------------------- | --------------------------------------------- |
| **Engineer discovers a bug**           | Create Slack channel, notify incident manager |
| **Customer reports something wrong**   | Pylon/support escalates to engineering        |
| **Security audit or pentest**          | Assessor reports to incident manager          |
| **Dependency CVE / vendor disclosure** | Assess impact, escalate if applicable         |

---

## 2. Triage

- [ ] **Contain** — Stop the bleeding. Roll back deploy, disable feature, revoke credentials. Do this before investigating.
- [ ] **Create Slack channel** — `tmp-[description]-[MMDDYY]` (private)
- [ ] **Notify incident manager** — Altan or Steve
- [ ] **Determine scope** — What data? Which customers? What time window?

---

## 3. Investigation

- [ ] **Verify exposure** — Query access logs to confirm whether unauthorized access actually occurred
- [ ] **Identify affected customers/orgs** — Count, names, plan tier
- [ ] **Determine root cause** — What changed? When? Who authored it?
- [ ] **Document findings in Slack channel** — Timestamps, queries run, results

### Key questions to answer

1. Was customer data actually accessed by unauthorized parties? (Check access logs, `lastVisited`, API logs)
2. What is the blast radius? (Number of customers, data sensitivity)
3. Is the vulnerability still exploitable or has containment closed it?
4. Could someone who saw the exposed data still exploit it after the fix?

---

## 4. Remediation

- [ ] **Fix deployed and verified** — PR merged, smoke tested
- [ ] **Residual data cleaned up** — Purge leaked records, rotate exposed credentials
- [ ] **Regression prevention** — Test coverage, guardrails added

---

## 5. Disclosure Decision

### Step 1: Classify

| Classification         | Definition                                                    |
| ---------------------- | ------------------------------------------------------------- |
| **Confirmed breach**   | Access logs show unauthorized party viewed or downloaded data |
| **Potential exposure** | Data was accessible but logs show no unauthorized access      |
| **Near-miss**          | Vulnerability existed but no data was actually exposed        |

### Step 2: Check notification triggers (in order)

| #   | Trigger                                                                            | Action                                                                                                             |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | **Customer contract** — DPA, BAA, or MSA with breach notification terms?           | Follow contractual timeline (often 72 hours)                                                                       |
| 2   | **Regulatory** — Data type triggers breach notification law (PII, PHI, financial)? | Follow applicable law                                                                                              |
| 3   | **SOC2** — Control deficiency revealed?                                            | Document internally. Include in next SOC 2 report if controls failed. **SOC2 does not require public disclosure.** |
| 4   | **Customer trust** — Would a reasonable customer expect to be told?                | Consider proactive notification                                                                                    |

### Step 3: Decide

| Type                               | When                                                         | Who Decides             |
| ---------------------------------- | ------------------------------------------------------------ | ----------------------- |
| **No external notification**       | Near-miss, no exposure, no legal/contractual trigger         | Incident manager        |
| **Targeted customer notification** | Potential or confirmed exposure, specific customers affected | Incident manager + exec |
| **Public disclosure**              | Confirmed breach with broad impact, or legally required      | Exec + legal counsel    |

**Always document internally regardless.** SOC2 (CC7.3/CC7.4) requires that you have and follow an IR process. It does not require public disclosure. Notification obligations come from contracts and breach notification laws.

---

## 6. Postmortem

Complete within **5 business days** for confirmed breaches and potential exposures.

Create entry in [Postmortems DB](https://www.notion.so/nxnrwl/Incidents-20369f3c238780abbbbff21cd4950208). Include:

- [ ] Timeline (discovery → containment → fix → verification)
- [ ] Root cause
- [ ] Impact assessment (customers affected, data types, exposure window)
- [ ] Evidence of access or non-access (queries, logs)
- [ ] Remediation steps taken
- [ ] Disclosure decision and rationale
- [ ] Action items with owners and dates

---

## Quick Reference

| What                    | Where                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Postmortems             | [Incidents page](https://www.notion.so/nxnrwl/Incidents-20369f3c238780abbbbff21cd4950208)                                                                 |
| Operational incidents   | [Incident Response Process](https://www.notion.so/nxnrwl/Incident-Response-Process-Guidelines-21569f3c23878017a562cce81c2b1b62)                           |
| SOC2 criteria reference | [AICPA Trust Services Criteria CC7.3/CC7.4](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022) |
| Parent page             | [Incident Management](https://www.notion.so/nxnrwl/Incident-Management-462453a4546340b8820c5d9d9ba74892)                                                  |

---

---

# APPENDIX: Postmortems DB Entry for March 2026 Incident

Create in the [Postmortems DB](https://www.notion.so/21169f3c2387803590b3defc117428b7):

| Field              | Value                                      |
| ------------------ | ------------------------------------------ |
| **Page Title**     | Org Access Leakage via allowedEmailDomains |
| **Status**         | Resolved                                   |
| **Date**           | 2026-03-25                                 |
| **Instance**       | US Prod                                    |
| **Internal Only?** | true (pending disclosure decision)         |

### Summary

Access policy change caused orgs with `allowedEmailDomains` set to public TLDs (gmail.com, outlook.com) to appear on the org screen for all users with matching email domains. 18 orgs exposed for ~2.5 hours. No confirmed unauthorized access.

### Classification

Potential exposure: access control bypass, no confirmed unauthorized access.

### Timeline

- **Mar 25 ~1:13 PM ET** — Altan discovers the issue. Creates `tmp-org-access-leakage-032526`.
- **~1:15 PM** — Remix app rolled back. Exposure confirmed: ~2.5 hours.
- **~1:16 PM** — 18 orgs affected (17 private incl. 1 TEAM customer ModioHealth, 1 public).
- **~1:19 PM** — Mark confirms: orgs list should never use `allowedEmailDomains`; private-enterprise only.
- **~1:32 PM** — Mark begins fix to accessPolicies.
- **~1:46 PM** — Impact queries confirm no affected orgs were accessed (`lastVisited` check).
- **~2:00 PM** — PR nrwl/ocean#10515 opened, approved by Victor.
- **Mar 27 ~11:17 AM** — Fixes deployed. Smoke testing positive.

### Root Cause

Access policy change populated `accessPolicies` using `allowedEmailDomains`, making orgs visible to any user with a matching email domain. Only intended for private-enterprise orgs.

### Impact

- 18 orgs with public email TLDs (gmail.com, outlook.com)
- 17 private (1 TEAM: ModioHealth), 1 public
- **No confirmed unauthorized access**
- Window: ~2.5 hours

### Remediation

1. Remix app rolled back immediately
2. PR nrwl/ocean#10515: Block common domains, restrict accessPolicies to private-enterprise
3. Purge existing org-level accessPolicies records

### Action Items

- [x] Roll back remix app — Altan (Mar 25)
- [x] Fix accessPolicies population — Mark (Mar 25)
- [x] Purge org-level accessPolicies records — Mark
- [x] Verify fix — Chau (Mar 27)
- [ ] Disclosure decision — Steve/Altan (pending)
- [ ] Review ModioHealth contract for breach notification terms
- [ ] Create Security Incident Response Plan (this document)
