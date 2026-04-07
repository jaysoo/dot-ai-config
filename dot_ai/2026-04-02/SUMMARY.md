# 2026-04-02 Summary

## Incident Tracking & IR Process Work

### New PARA Area: Incidents
- Created `dot_ai/para/areas/incidents/` with README and first incident entry
- **2026-03-25 Org Access Leakage** (`2026-03-25-org-access-leakage.md`): Access policy change exposed 18 orgs with `allowedEmailDomains` on public TLDs (gmail, outlook) for ~2.5 hours. No confirmed unauthorized access. Remediated via PR nrwl/ocean#10515.

### SOC2 Disclosure Analysis
- Researched SOC2 (CC7.3, CC7.4, CC2.3) disclosure requirements with citations
- **Finding:** SOC2 requires internal documentation and following your IR process. It does NOT require public disclosure. Notification obligations come from customer contracts and breach notification laws, not SOC2 itself.
- Steve's push for public disclosure is reasonable from a trust standpoint but inaccurate as a SOC2 requirement
- Analysis added to the incident doc with sources (AICPA, KFinancial, Konfirmity, Linford & Co)

### IR Process Doc Rewrite
- Reviewed existing Notion IR doc (Grafana IRM-focused, alert-triggered only) and Incidents/Postmortems DB
- Identified gaps: no security incident path, no disclosure framework, no non-alert discovery process
- **Decision:** Separate docs for operational vs security incidents (different audiences, triggers, SOC2 relevance)
- **Decision:** Dropped severity levels from security doc — disclosure classification (confirmed breach / potential exposure / near-miss) drives the process instead

### Drafts Produced
1. **`ir-process-update-draft.md`** — Minimal changes to existing IR page: scope statement, Severities Outline link, cross-link to new security doc
2. **`security-ir-plan-draft.md`** — New standalone Security Incident Response Plan: Detection → Triage → Investigation → Remediation → Disclosure Decision → Postmortem. Includes postmortem DB entry for March incident in appendix.

### Blocked
- Notion integration is read-only — can't create/edit pages via API. Manual paste required.
- Added to TODO with all links and draft file paths.

## Files Created/Modified
- `dot_ai/para/areas/incidents/README.md` (new)
- `dot_ai/para/areas/incidents/2026-03-25-org-access-leakage.md` (new)
- `dot_ai/para/areas/README.md` (updated — added Incidents area)
- `dot_ai/2026-04-02/ir-process-update-draft.md` (new)
- `dot_ai/2026-04-02/security-ir-plan-draft.md` (new)
- `dot_ai/TODO.md` (updated — added Notion IR docs task)

## Memory Saved
- Reference: Notion page IDs for IR process doc, incidents page, postmortems DB, severities outline
