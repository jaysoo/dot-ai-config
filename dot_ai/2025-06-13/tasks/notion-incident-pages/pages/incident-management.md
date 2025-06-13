---
title: Incident Management
page_id: 462453a4-5463-40b8-820c-5d9d9ba74892
category: main
url: https://www.notion.so/Incident-Management-462453a4546340b8820c5d9d9ba74892
retrieved_at: 2025-06-13T18:30:00Z
---

# Incident Management

## Updating the status page

If there is either a confirmed or suspected incident, update the [status page](https://status.nx.app/) as soon as possible.

> 💬 All service status changes should be done via reports, so we can provide historical info when pointing people to the status page for the outage times.

1. Create a new status report on BetterStack: https://uptime.betterstack.com/team/86648/status-pages/153609/reports
   - ![Navigate to the status pages > status.nx.app page, then click "create status report"](image-placeholder)

2. Describe which services are affected, and what we're doing to fix it (or that we're investigating the issue)

3. Try to post updated every 30-45 minutes as the issue persist. If nothing has changed, repeat something along the lines of "The team is still investigating the issue which is impacting some customers trying to <some operation>. We will update when we have more information"

4. Update the status report to resolve all impacted services when a fix has been released

### Example

> Nx API timeouts

## Additional Resources

- [Incidents (internal only) Database](https://www.notion.so/326f8c5b6c1741cdb14ff2d680200e8a)
- [Incident Report Template](https://www.notion.so/Incident-Report-Template-1fd69f3c2387801f9006df95056ec69d)
- [Postmortems](https://www.notion.so/Postmortems-8a92d254d42546b7916f12e34c4ec251)

## Notes

**BetterStack Reference Found**: This page contains instructions to use BetterStack for status reporting. This needs to be updated to use Grafana IRM.