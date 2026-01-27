# CLI Sync Tracker

Tracking document for CLI team sync meetings.

## Topics for Next Meeting

- Review Colum's `/identify-closeable-issues` command for CLI team issues
- CNW: Users re-creating workspaces after successful creation (NPM warnings as errors)

## Action Items

### Spread Operator Implementation
- [ ] Craigory: Complete spread operator implementation by tomorrow
- [ ] Docs need updating (either in PR or task for docs team)

### Performance & Debugging
- [ ] Jack: Follow up with DPS on performance issues, coordinate customer debugging sessions
- [ ] Leosvel: Continue memory optimization investigation with plugin workers

### I/O Tracing
- [ ] Austin: Connect with Raj on I/O tracing integration timeline
- Dog fooding target: February 6th
- Full client deployment: end of February

### Content Creation
- [ ] Juri: Create .NET/Java mixed workspace content

### Nicole Onboarding
- Follow up on leftover onboarding items

### DPE Coordination
- Schedule DPEs sync to go over dotnet adoption

### AI Tooling
- Evaluate using Claude to check what GitHub issues are related to PRs

---

## Meeting Notes

### 2026-01-27

**Attendees:** Craigory, Max, Juri, Leosvel, Austin, Miro, Colum, James, Jon, Jason, Steven, Joshua, Philip, Caleb, Louie

**Error Monitoring & Performance**
- Current error rates elevated but not user-impacting
  - Mostly code lens errors in closed files
  - Console errors that don't affect user experience
- Craigory implementing spread operator support
  - Performance testing in progress
  - Should be ready by tomorrow
  - Docs need updating (either in PR or task for docs team)
- Refresh rates slightly above 3% target but not concerning

**Resource Usage Optimization**
- Plugin workers consuming significant memory/CPU
  - Leosvel investigating with heap profiles and flame graphs
  - Plan to shut down plugin workers after graph creation
  - Should reduce memory by at least 50%
- Customer impact tracking
  - Hilton reporting 21.6GB usage (won't backport fix to their version)
  - Solonis CPU issue was measurement error, not actual performance problem
  - Need customer pairing sessions for better debugging

**I/O Tracing Progress**
- CLI service collecting PIDs and input/output globs
- EBPF integration moving forward with Raj
  - Raw task tracing file generation by end of this week
  - Dog fooding target: next week (February 6th)
  - Full client deployment: end of February
- Enterprise-only, single tenant initially

**Onboarding Experiments**
- Running three variants after December 14th drop-off
  1. Full platform messaging vs remote caching prompt
  2. Remote caching focus (may be more effective for new workspace creation)
  3. No prompting at all
- Missing README short URLs may have contributed to drop
  - Non-negligible user segment used README links
  - Explains delayed onboarding patterns (up to week later)

**Backend Technology Support**
- .NET/Java licensing concerns resolved
  - No paywall plans moving forward
  - Green light for content creation and promotion
- Cross-repository dependency detection planned
  - Would link scattered microservices
  - Major selling point for backend teams
  - Paid feature as part of polygraph

**Notes link:** https://notes.granola.ai/t/38955afe-75ff-423c-972f-9bfd6f64ce4c-00demib2

---

### 2025-12-16

**Updates:**
- Discussed using Claude to check what issues are related to PRs
- Nicole onboarding leftover items need follow-up
- DPEs sync needed to go over dotnet adoption
