# Infra Sync Tracker

Tracking document for Infrastructure team sync meetings.

## Topics for Next Meeting

- Synthetic checks: How do they alert us? What's the notification flow?
- GitHub integration automation - follow up with Red Panda team

## Upcoming Sync

## Action Items

### Metrics Endpoint
- Patrick to complete service account setup for remaining environments
- Szymon to deploy metrics endpoint to staging

### Key Container Registry
- Ask Thomas to add Steve to vendor card for Key registry billing (~$150/mo)
- Investigate billing discrepancy (shows 24/24 but plan should be 50+)

### GitHub Integration
- Jack to discuss GitHub integration automation with Red Panda team
- Steve granted GitHub org admin access to reduce coordination overhead

### Password Visibility
- Fix SSR password visibility security gap (passwords visible in server-rendered source)

### Code Architecture
- Plan workflow controller refactoring - separate shared components into libraries (~1 week effort)

### Linear as Source of Truth
- Ensure Linear tasks are the source of truth
- Attach relevant docs, links, PRs to issues

### Docker Layer Caching
- Follow up on project success metrics

### Hosted Redis
- Follow up on project success metrics

---

## Meeting Notes

### 2026-02-24

**Attendees:** Patrick, Steve, Altan, Szymon, Louie

**Infrastructure Updates & Service Accounts**
- Metrics endpoint setup 80% complete for single tenants
  - Service accounts configured for dev environment
  - Patrick handling remaining environments after Steve's initial setup
  - Changed bucket permissions to single-path write access only for security
  - Should be ready for staging deployment this week
- Key container registry status
  - Currently at 24/50 private repositories (billing discrepancy - shows 24/24 used)
  - Plan upgraded twice previously (from 50 limit to current 200)
  - Monthly cost ~$150, needs migration from Szymon's personal card to company vendor card

**Security & Audit Improvements**
- Penetration testing started yesterday on staging environment
- Lighthouse audit logs now live
  - Login/logout tracking implemented
  - Session restore events visible for team members
  - Planning to add page access tracking and password copy detection
- Password visibility issue identified
  - Passwords masked in UI but visible in server-side rendered source
  - Fix planned to address security gap

**Infrastructure Challenges & Solutions**
- EKS node group balancing issue resolved
  - Auto-scaling was killing agent nodes when rebalancing across zones
  - Solution: Create separate managed node groups per availability zone
  - Prevents unwanted node termination and improves spot instance reliability
- Podman investigation completed
  - Alternative to Docker for multi-tenant environments
  - Works with caveats - networking complications with container composition
  - Notes: https://notion.so/nxnrwl/Running-Rootless-Podman-in-Kubernetes-30c69f3c238780b5b40eca4716fa7b96#30c69f3c238780e4b052c4866bee841e
  - Could offer as limited alternative but Docker remains standard

**Code Architecture & Technical Debt**
- Workflow controller refactoring blocked
  - Direct bucket access removal failed due to shared dependencies
  - IO daemon still requires direct access, conflicts with signed URL storage
  - Highlights broader code organization issues across controller/executor/trace daemon
- Proposed solution: Separate shared components into libraries
  - Would enable independent changes without cross-component conflicts
  - Estimated 1 week effort, planned for future cycle

**GitHub Integration Pain Points**
- Callback URL limits causing deployment delays (10 per GitHub app)
- Currently using multiple apps, approaching limits again
- Cloudinary deployment blocked today due to this issue
- Three teams involved: Infrastructure, DPE, and app owners
- Potential solutions discussed:
  1. Automated app generation per tenant
  2. Centralized auth architecture (major change)
  3. Remove GitHub login for single tenants, use SAML instead
- Steve granted GitHub org admin access to reduce coordination overhead

[Meeting transcript](https://notes.granola.ai/t/2b47686e-b469-4a46-820e-789418d6db51-00demib2)

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
