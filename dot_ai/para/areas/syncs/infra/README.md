# Infra Sync Tracker

Tracking document for Infrastructure team sync meetings.

## Topics for Next Meeting

- Follow up on pentest retest confirmation
- Sandboxing/Prometheus rollout progress — which clients onboarded?
- ClickUp GitHub rate limiting — Altan's spam reduction solution
- Private link research status (Hilton use case)
- Multi-cluster controller facade — dev deployment feedback
- Istio implementation timeline

## Upcoming Sync

## Action Items

- [ ] Altan: Investigate ClickUp GitHub rate limiting / spam reduction
- [ ] Backend team: Test Prometheus metrics on dev environments (AWS/Azure)
- [ ] Frontend team: Coordinate URL structure for public vs private endpoints (GH app consolidation)
- [ ] Steve: Continue private link research for enterprise customers
- [ ] Team: Await pentest retest confirmation

### Older
- [ ] Patrick: Complete service account setup for remaining environments
- [ ] Ask Thomas to add Steve to vendor card for Key registry billing (~$150/mo)

### Reference
- GH app consolidation project: https://linear.app/nxdev/project/infra-take-control-of-gh-app-for-tenants-do-central-callback-10b97b2cec45/overview

---

## Meeting Notes

### 2026-03-24

**Attendees:** Patrick, Steve, Altan, Szymon, Louie

**Security & Infrastructure Issues**
- Microsoft false positive flagging client bundle as malware
  - Glass worm Trojan detection in virus scanner
  - Only Microsoft flagging, other scanners clean
  - Microsoft confirmed false positive and removed detection
  - Caused customer concerns and support tickets

**Feature Rollout Status**
- Sandboxing and Prometheus metrics ready for deployment
  - GCP tenants fully supported with internal routing
  - AWS and Azure support requires additional work
    - Can expose single route on public ingress for testing
    - Backend team needs to test on dev environments first
  - Rollout will be gradual with initial 1-3 clients for feedback
- ClickUp GitHub rate limiting ongoing
  - Altan investigating spam reduction solutions

**Multi-Cloud Infrastructure Planning**
- Private link research for enterprise customers
  - Hilton previously requested VPN-only access
  - Would require additional networking costs and complexity
  - Support team access challenges with private-only setup
  - Research phase only, not immediate implementation
- Multi-cluster deployment progress
  - Controller facade ready for dev deployment
  - Will enable workload distribution across clusters
  - Single API interface maintained

**Security & Email System Improvements**
- Penetration test findings addressed
  - Critical and high findings resolved
  - Awaiting retest confirmation
- Email system vulnerability fixes
  - Preventing malicious org names in URLs
  - Proposed sending limits based on account tier
    - Free: 5 invites at a time
    - Paid: higher limits
    - Enterprise: unrestricted
- Istio implementation planned for traffic control and billing visibility

**GitHub App Consolidation**
- New polygraph feature requires separate GitHub app initially
- Centralized login solution in development
  - Single callback URL for all environments
  - Route users based on context variables
  - Will eliminate multiple app requirements
- Frontend team coordination needed for URL structure
  - Require proper prefixes for public vs private endpoints
  - Avoid exposing internal metrics/debugging endpoints

[Transcript](https://notes.granola.ai/t/46b1fb61-d735-4007-b564-faf891d27726-00demib2)

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
