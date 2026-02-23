# Planning Meetings

**Schedule:** Periodic (company-wide roadmap planning)

## Topics for Next Meeting

_None_

## Upcoming Sync

_None_

## Action Items

### 2026-02-17

- [ ] Steve: Follow up with Jeff on GCP GKE charging for pre-loading time
- [ ] Patrick: Lead Google implementation for image pre-loading, then AWS/Azure plan
- [ ] Jason: Escalate with Joe for DPE coordination on additional Maven clients
- [ ] Jack: Follow up to confirm multi-arch docker can be deferred
- [ ] Max: Complete Ralph migrator specification
- [ ] Caleb/Miro: Get feedback from customers on Enterprise Analytics API before more work

## Meeting Notes

### 2026-02-17 - Q1 Planning

**Attendees:** Victor, Jack, Jason, Nicole, Steve, Jon, James, Altan, Miro, Jeff

---

#### Kraken (Infra)

**GCP GKE Docker Image Pre-Loading**
- Potential to charge for time not currently being charged for
  - Steve to follow up with Jeff
- Pre-load disk with popular base images to reduce cold start time
- Target: 25% faster startup (30 seconds saved on 2-minute boot)
- Patrick leading Google implementation, then AWS/Azure plan
- Cost savings: thousands annually, network traffic reduction

**Implement Multi-Cluster Agent Setups**
- Major effort: one app cluster + multiple agent clusters globally
- Enables static IP offering for premium pricing
- Supports geographic distribution for enterprise customers
- Opens capacity and reliability improvements

**K8S Gateway API + L7 Load Balancing**
- Would have wanted this for sandboxing
- Allow secure agent-to-app cluster communication
- Reduce internet egress costs
- Enable sandboxing anomaly reporting

**Lighthouse - Enable Tenant MongoDB Connections**
- Proxy more services through Lighthouse
- Remove direct customer database access for DPEs but keep debugging flow intact

**Lighthouse: Wire up Google Auth & Remove IaP**
- Step 1 can lead to more things like ST reporting to Lighthouse
- Google SSO integration with role-based access control
- Foundation for tenant auto-registration and credit reporting

**Grafana Billing Alerts**
- Alert on spikes, goes to infra team (not #grafana-irm), loop in DPEs as needed

**Azure Hosted Redis/Valkey**
- Feature parity with GCP/AWS
- Scope could be large
- CIBC using Azure

**Bring Identity Portal into OpenTofu**
- Adding and removal instances

**Dev/Staging/Prod - Break Apart Big "nx-cloud-secrets" JSON**
- Addressing internal painpoint
- On-prem clean up

**Rename/Alias valkey_ envs**
- Prefixing so it looks better, small task

---

#### Dolphin (CLI)

**v23 Deprecations and TODOs** (1-2 weeks)
- End of April release timeline
- High priority but not fully scoped yet

**Sandboxing** (3 weeks)
- Fix our plugins (inputs/outputs): now, early March
  - Louie UI changes landing this week and will let us know what's broken
- Success = public announcement (April)
- Cannot launch with broken core plugins (blocks marketing)
- Gradle may require more work

**Plugin Schema for nx.json Options + Hook Declaration** (1 week)
- Needed for LSP, docs, AI

**Extending Target Defaults Functionality** (2 weeks)
- Enable multiple build systems without conflicts
- Critical for polyglot workspace expansion
- Ocean dogfooding shows current limitations

**Worktree Cache** (1 week)
- High priority for agent compatibility
- Turborepo parity requirement, we're already behind
- 1 week of effort, high impact

**Polyglot** (PAUSED)
- Success = artifact such as blog post published, customers using plugins successfully
- May not require much engineering work, need DPE/customer feedback
  - Feedback will generate next tasks
- Maven Support:
  - RBC can use it successfully
  - Reach out to more clients
  - Battle testing with RBC, ready for broader client adoption
  - Need DPE coordination for additional Maven clients (Jason to escalate with Joe)
- Dotnet:
  - Customer adoption, case studies

**Multi-arch Docker** (DEFERRED)
- Jack to follow up and confirm deferral is OK
- Success = Ocean, Skyscanner, Payfit can use it
- Slow and takes up disk space to build and push separately
- James: Consider programmatic API to avoid disk storage

**Nx Migrate** (DEFERRED)
- Related to agentic migration, maybe under that umbrella
- Max: Complete Ralph migrator specification

**Format** (DEFERRED)
- Victor thinks we should remove it
- Leaving it means users are stuck on Prettier
- Support Biome, OX format, language-specific formatters
- Debate: remove entirely vs make pluggable vs leave as-is
- Medium priority given other competing efforts

---

#### Red Panda (Cloud)

**Self-healing**
- Enterprise cost figured out with GTM ($11K-12K total, ClickUp is $4500)
- Move from trial to paid model (meeting with Madeline/Joe/Jeff)
- UI changes needed for billing display
- Adoption targets:
  - Enterprise: 50% usage (currently 30%)
  - Teams: 100 orgs using (currently 21 of ~500)
- Remove "experimental" labeling across platform
- Dedicated email campaign for re-engagement
- Value optimization: target 40% platform value rate
- Eliminate execution errors for fix completion
- Improve error messaging for user setup issues
- Apply recommendations feature in PR

**Polygraph**
- Add support for non-Nx workspaces (2 weeks)
- Implement billing (2 weeks)
- Simplify polygraph onboarding (1 week)
- Implement core functionality (2 weeks)
- Implement polygraph for teams and hobby (2 weeks)
- Add support for other agents (2 weeks)

**AX**
- Agentic migrations: Big feature, needs specs, marketing, etc.
- Init/cnw, skills, tech-specific changes/improvements (lots of misc tasks)

---

#### Quokka (Cloud Backend)

**Resource-based Parallel Task Assignment for Distributed Execution**
- Replace assignment rules with historical data
- Reduce DPE overhead and config management
- Win more technical deals

**Task Analytics Percentiles**
- Average not good enough
- 6 customers requesting improved task analytics

**Improve Manual Agent Metrics Upload DX in Nx Cloud**
- No UI changes, can use what's already built

**Enterprise Analytics API Cleanup (Prometheus)**
- Original work done in December
- Talk to Caleb and Miro to get feedback from customers before more work

**Nx Cloud CIPE Configuration Rework**
- Low priority, should be able to get to it
- Reduce start-ci-run complexity and move options to configuration
- Address DPE and support complaints

---

#### Orca (Cloud Frontend)

**Feature Activation**
- Separate guides for Enterprise vs SaaS features
- Contextual setup instructions

**Feature Demos**
- Dummy data storytelling for analytics, run details, CIP
- In-workspace demonstration capability

**In-progress Agent Visualization**
- Ben prototyping improved CI PE screen
- Timeline/waterfall view replacing agent list
- Better task distribution communication

**600 Workspaces Connected Target**
- Carryover from current month
- Weekly tracking through mid-March

---

#### Website/Marketing

**Framer Migration**
- Blog posts moving off Nx repo, but keep Markdown flow
- Ben's 3-week March absence impacts timeline
