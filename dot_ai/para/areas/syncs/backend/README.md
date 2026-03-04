# Backend Sync Tracker

Tracking document for Backend team sync meetings (Quokka).

**Attendees:** Altan, Louie, Rares

---

## Meeting Notes

### Upcoming

- We may need API endpoint to check if a workspace is connected fully or not
- Enterprise customers that need metrics
  - https://linear.app/nxdev/project/enterprise-analytics-api-cleanup-73da7b8ab2e6/overview
  - Emeria is already consuming Prometheus

### 2026-02-02

**Attendees:** Altan, Louie, Rares

#### Project Updates & Status

- **Reverse Trial Billing** - Complete pending final email template in Mandrel
  - Madeline/Heidi want different experience than originally spec'd
  - Need fake live data in environment vs. what was built
  - Likely additional backend work required for March
  - Waiting on sales/CS input for customer demo experience
- **Enterprise Audit Log** - RBC received expiry notices for temp account
  - Following up this week for call/curl testing
  - Ready to close once tested
- **Continuous Task Assignment** - DTE benchmark harness showing positive results
  - 33-minute export from NX repo recreation
  - 23-25 agents tested locally with 6% variance between benchmark/reality
  - Next: Pull DTEs from larger customers for testing

#### I/O Tracing Progress

- **Current Status** - Signal file generation working on cloud runner
  - Tracking fork events through eBPF system calls
  - Generated 2000+ file access calls for Ocean package (mostly webpack/Node modules)
  - Successfully merged PR for buffer creation and task management
- **Technical Implementation**
  - Process tracking: Parent ID captured ✓
  - Inputs: Working ✓
  - Outputs: Not yet implemented (Gregory's PR needed)
  - End-to-end testing: Docker container validation successful
- **This Week's Milestone** - NX API endpoint creation
  - Analyze files and report anomalies to NX API
  - Deploy infra changes to Ocean for testing (memory impact on NX agent pods)
  - Go-to-market planning meeting scheduled

#### Blocking Items & Capacity

- **ADP Gradle Issues** - Louie pulled off effort work for pipeline fixes
  - Batch mode bugs patched, waiting for Jason's merge
  - Most issues appear self-inflicted (manual overrides)
  - Effort milestone pushed back few days
- **Gregory's Core Work** - Due tomorrow/Wednesday
  - Need outputs functionality in PR release
  - Required for full Ocean testing on all PRs
- **Team Capacity Notes**
  - Altan off last week of February (3 weeks effort work remaining)
  - Potential Wix POV starting (repo described as "mess" but good opportunity)
  - S&P POV in review stage post-security incident

[Granola transcript](https://notes.granola.ai/t/b1c43b27-8977-4854-9dd4-8ebee170d154-00demib2)

