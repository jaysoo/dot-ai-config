# Incident Response Process — Proposed Updates

Updates to the existing [Incident Response Process & Guidelines](https://www.notion.so/nxnrwl/Incident-Response-Process-Guidelines-21569f3c23878017a562cce81c2b1b62).

**What changed:** Added cross-link to the new Security Incident Response Plan. Clarified scope is operational/availability only. Reformatted severity table. Linked to Severities Outline. No content changes.

---

# Incident Response Process

This document covers **operational and availability incidents** — outages, degraded performance, infrastructure failures. All incidents are managed through Grafana IRM.

For security incidents (data exposure, unauthorized access, access control bugs), see the [Security Incident Response Plan](link-to-new-doc).

---

## Severity Levels

See [Severities Outline](https://www.notion.so/nxnrwl/Severities-Outline-21169f3c238780b7961cc0283fef5213) for full definitions (SEV-1 through SEV-4).

| Level     | Customer Impact                                              | Business Impact                                             | Response                                         |
| --------- | ------------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------ |
| **SEV-1** | Major outage, multiple customers or complete unavailability  | Revenue-impacting, SLA breach, data loss/corruption         | All-hands, executive notification                |
| **SEV-2** | Degraded service, partial outage, single major customer down | Potential SLA impact, significant functionality unavailable | Immediate team response, management notification |
| **SEV-3** | No direct impact or minor inconvenience                      | Internal, redundancy handling load                          | Standard on-call response                        |
| **SEV-4** | None                                                         | Minimal, cosmetic, minor bugs                               | Normal business hours                            |

---

## Alert Monitoring

Grafana monitors infrastructure and automatically alerts on:

- 503 errors and service failures
- API downtime or unreachability
- Nx Cloud app availability issues
- Performance degradations

All alerts appear in `#grafana_irm` Slack.

### On-Call

- **Schedule:** https://nx.grafana.net/a/grafana-irm-app/schedules?p=1
- **Rotation:** One week per person, ~2 months between rotations
- **Team:** Infrastructure + Application team members

### On-Call Duties

- Monitor `#grafana_irm` Slack channel
- Acknowledge alerts promptly
- Create incidents in Grafana IRM
- Coordinate response efforts
- Update status page via Grafana integration

---

## Incident Response Process

### 1. Alert Acknowledgment

- [ ] Check `#grafana_irm` Slack channel
- [ ] Acknowledge the alert by replying in the message thread
- [ ] Assess severity and impact
- [ ] If an incident is suspected, declare it from the Slack alert message

### 2. Incident Creation

> Do not create incidents on Statuspage or anywhere else. **Grafana IRM is the source of truth.**

- **Automatic:** Critical alerts create incidents automatically
- **Manual:** Create from Slack or navigate to Grafana IRM → Create Incident

### 3. Statuspage Updates

Statuspage (status.nx.app) auto-creates incidents via Grafana IRM integration.

- [ ] Set affected components (Nx Cloud Web App, Nx API, etc.)
- [ ] Post updates every 30–45 min while the issue persists
- [ ] If nothing changed, repeat current status

### 4. Investigation & Resolution

Use Grafana to assess: CPU/memory, replica availability, container restarts.

**Confirm the incident if:** services are degraded, customer workflows are blocked, or data integrity is compromised.

Common resolution: restart pods. Work with Infra or App team as needed.

- [ ] Fix verified — confirm services back to normal
- [ ] Resolve in Grafana IRM
- [ ] Resolve on Statuspage — verify public status reflects resolution

---

## Single-Tenant Escalation (ClickUp SLA)

| Elapsed | Action                                                      |
| ------- | ----------------------------------------------------------- |
| 5 min   | Notify account DPE                                          |
| 30 min  | If DPE hasn't responded, notify support rotation (2 people) |
| 1 hour  | Escalate to engineering lead                                |
| 2 hours | Escalate to exec                                            |

---

## Postmortem Process

After incident resolution:

1. Create entry in [Postmortems DB](https://www.notion.so/nxnrwl/Incidents-20369f3c238780abbbbff21cd4950208)
2. Include: Timeline, root cause, action items, remediation steps
3. External communications handled by DPE/Maria/Joe
4. **Postmortem review meeting** within 5 business days for SEV-1/SEV-2

---

## Communication

- Customer team notified via email, Slack, or Teams. Updates sent hourly until resolved.
- Within 24 hours of resolution: root cause analysis and Incident Report to customer.

---

## Roles

| Role                      | Responsibility                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **On-call**               | First responder. Acknowledges alerts, creates incidents, coordinates initial response. |
| **Incident Manager**      | Owns incident end-to-end. Drives triage, delegates investigation.                      |
| **Investigators**         | Debug, diagnose, fix. Update incident channel.                                         |
| **Comms (DPE/Maria/Joe)** | External customer communications, status page messaging.                               |

---

## Quick Reference

| What               | Where                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Alert channel      | `#grafana_irm` Slack                                                                      |
| On-call schedule   | https://nx.grafana.net/a/grafana-irm-app/schedules?p=1                                    |
| Incident creation  | Grafana IRM                                                                               |
| Status page        | status.nx.app                                                                             |
| Postmortems        | [Incidents page](https://www.notion.so/nxnrwl/Incidents-20369f3c238780abbbbff21cd4950208) |
| Security incidents | [Security Incident Response Plan](link-to-new-doc)                                        |
