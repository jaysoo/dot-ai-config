# Infra Sync Tracker

Tracking document for Infrastructure team sync meetings.

## Topics for Next Meeting

- Synthetic checks: How do they alert us? What's the notification flow?

## Action Items

### Linear as Source of Truth
- Ensure Linear tasks are the source of truth
- Attach relevant docs, links, PRs to issues

### Docker Layer Caching
- Follow up on project success metrics

### Hosted Redis
- Follow up on project success metrics

### ClickUp Renewal
- Address renewal concerns

---

## Meeting Notes

### 2026-01-13

- CIBC (Steven) trialing agents needs custom agents, PoV awaiting to start
- Custom images, customers (Island, ClickUp) need to use them
  - OIDC to allow pushing image from their GitHub Action
  - https://nrwl.slack.com/archives/C0976V87CF5/p1768312852392599?thread_ts=1768241206.696399&cid=C0976V87CF5
  - Joe should be involved
  - Follow-up with Steve on a list of extra features we can charge for
- Flip service died due to timeout issues
  - Pod couldn't download images within startup probe time after 5-month stable period
  - Helm chart doesn't allow probe value changes - required custom patch
  - Service now restored and working
- Enhanced infrastructure too

### 2025-12-19

**Updates:**

- Talk to Nicole for Flipped
- Planning meeting - done

### 2025-12-16

**Updates:**
- Linear tasks should be the source of truth - attach relevant docs, links, PRs
- ClickUp renewal concerns discussed
- Follow-up needed on Docker Layer Caching and Hosted Redis projects
  - How can we make sure they are successful?
- Docker: Not building in images makes a lot of headaches
  - Reference: https://github.com/jmcdo29/unteris/blob/main/apps/cli/Dockerfile
