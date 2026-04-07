# Org Access Leakage via allowedEmailDomains

**Date discovered:** 2026-03-25
**Slack channel:** tmp-org-access-leakage-032526
**Severity:** Medium (data exposure potential, no confirmed unauthorized access)
**Status:** Remediated, disclosure pending

## Summary

A change to organization access policies caused organizations with `allowedEmailDomains` configured to appear on the main organization screen for ALL users matching that email domain. Orgs using common public TLDs (gmail.com, outlook.com, etc.) became visible to any user with that email domain, allowing them to view customer data for those orgs.

## Timeline

- **Mar 25 ~1:13 PM** - Altan discovers the issue, creates tmp channel. Remix app rolled back.
- **Mar 25 ~1:15 PM** - Altan confirms: orgs with common email TLDs (gmail.com, outlook.com) were exposed for ~2.5 hours. Anyone with a matching domain could view those orgs' customer data.
- **Mar 25 ~1:16 PM** - At least one impacted org is a Team customer. ~18 orgs affected (17 private, 1 public).
- **Mar 25 ~1:19 PM** - Mark confirms: orgs list was never meant to use `allowedEmailDomains`; should only apply on private-enterprise.
- **Mar 25 ~1:32 PM** - Mark starts fix: stop writing to accessPolicies for email domains except on private-enterprise.
- **Mar 25 ~1:38 PM** - Mark notes existing accessPolicies records at org level need to be purged (can't distinguish email-domain-created ones).
- **Mar 25 ~1:46 PM** - Altan runs impact queries. Confirms no orgs with public email TLDs had `visitors.lastVisited` after 2026-03-25 - **none were actually accessed**.
- **Mar 25 ~2:00 PM** - Mark opens PR (nrwl/ocean/pull/10515) to block adding big domains and prevent populating access policies for email domain access except on private-enterprise. Victor approves.
- **Mar 25 ~4:12 PM** - Chau notes the access policies check change was related/enabling cause.

## Mar 27 Follow-up

- **11:17 AM** - Altan confirms fixes rolled out, smoke testing positive. Leakage from org settings resolved.
- **11:19 AM** - Steve: SOC2 requires public disclosure even if no one was impacted. Non-disclosure is a compliance risk.
- **11:21 AM** - Steve proposes framing disclosure narrowly: outline possible effects, clarify the setting should not have been set, no data exposure occurred.
- **11:27 AM** - Altan questions whether this qualifies as "data exposure" since the orgs had explicitly allowed those email domains, and current state still allows anyone who saw org IDs to access them.
- **11:33 AM** - Steve: data exposure is "possibility not actual impact" - disclosure should say "no user data impacted" but still must happen for compliance.

## Impact Assessment

- **18 orgs** had `allowedEmailDomains` with public TLDs (gmail.com, outlook.com)
- **17 private** (including 1 TEAM customer: ModioHealth 60c3a89141e8a900053b925b)
- **1 public**
- **No confirmed unauthorized access** - `lastVisited` query showed no matches after incident start
- Exposure window: ~2.5 hours

## Root Cause

Organization access policy change inadvertently populated `accessPolicies` using `allowedEmailDomains`, causing orgs to appear in the organization list for users with matching email domains. This was only intended for private-enterprise orgs.

## Remediation

1. Remix app rolled back immediately
2. PR nrwl/ocean/pull/10515: Block common email domains, restrict accessPolicies population to private-enterprise only
3. Purge existing accessPolicies records at org level (can't distinguish email-domain-created ones)

## Disclosure

- **Steve's position:** SOC2 requires public disclosure; frame as "discovered issue, possible but not actual data exposure, no user data impacted"
- **Altan's position:** Grey area since orgs had explicitly set allowedEmailDomains; questions whether it's technically "data exposure" if access paths haven't changed
- **Current status:** No public disclosure yet as of 2026-04-02. Steve pushing for it.

### SOC2 Disclosure Analysis (2026-04-02)

**Bottom line: SOC2 does not require public disclosure.** Steve's instinct to disclose is reasonable from a trust standpoint, but framing it as a SOC2 requirement is inaccurate.

**What SOC2 actually requires (CC7.3, CC7.4, CC2.3):**
1. Evaluate the event and classify it (event vs. incident) — done
2. Follow your own documented incident response process
3. Remediate the root cause — done (PR nrwl/ocean/pull/10515 + accessPolicies purge)
4. Communicate with affected parties **as appropriate to your service commitments**
5. Include in next SOC 2 report if it reveals a control deficiency

**What SOC2 does NOT require:**
- Public blog post or public disclosure
- Customer notification when no unauthorized access occurred (unless your own IR policy or contracts mandate it)
- Specific notification timelines (SOC2 is an attestation standard, not a law)

**What actually drives notification obligations:**
- Your own IR classification policy — does it classify "potential but unconfirmed exposure" as reportable?
- Customer contracts — check ModioHealth's terms (TEAM customer, possible DPA/BAA)
- State breach notification laws — many define "breach" to include unauthorized access OR exposure; these have mandatory timelines independent of SOC2

**Key nuance from AICPA:** Incidents go in the SOC 2 report (shared under NDA with customers who request it), not in a public announcement. AICPA explicitly states disclosures "should not be at a detailed level, which might increase the likelihood that a hostile party could exploit a security vulnerability."

**Sources:**
- [AICPA Trust Services Criteria (2017, revised 2022)](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022) — Official CC7.3/CC7.4/CC2.3 criteria text
- [KFinancial: When to Disclose a Security Incident in a SOC 2 Report](https://kfinancial.com/when-to-disclose-a-security-incident-in-a-soc-2-report/) — SOC 2 report disclosure vs. public disclosure distinction
- [Konfirmity: SOC 2 Breach Notification Guide](https://www.konfirmity.com/blog/soc-2-breach-notification-guide) — "SOC 2 is an attestation standard, not a law"
- [Linford & Co: SOC Cyber Incident Reporting](https://linfordco.com/blog/soc-2-reporting-criteria-cyber-information-security-incidents/) — Audit firm guidance on SOC 2 incident reporting criteria
