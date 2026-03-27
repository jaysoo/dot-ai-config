# CLI Sync Tracker

Tracking document for CLI team sync meetings.

## Topics for Next Meeting

- Review Colum's `/identify-closeable-issues` command for CLI team issues
- Follow up on sandbox strict mode — any violations after Friday deadline?
- Next major branch status (targeting May 10th)
- TypeScript 6 third-party compatibility status

## Upcoming Sync

## Action Items

- [ ] Jack: Ping team for PR reviews on minor onboarding tweaks
- [ ] Leo: Complete final migration spike, record Loom findings
- [ ] Craigory: Address sandbox violations before Friday strict mode deadline
- [ ] Team: Report sandbox violations immediately in dedicated channel
- [ ] Leo: Create next major branch by end of week
- [ ] Juri: Continue TypeScript 6 base URL removal, ping Jack when ready for review

### Older (from 2026-02-10)
- [ ] Leosvel: Push performance research branch and merge findings-based changes
- [ ] Colum: Split telemetry PR to command-only scope
- [ ] Jack: Follow up on legal requirements for analytics collection

---

## Meeting Notes

### 2026-03-24

**Attendees:** Craigory, Max, Juri, Leosvel, Austin, Miro, Colum, James, Jason, Steven, Joshua, Philip, Caleb, Louie

**Scorecard Updates & Analytics**
- 101 PRs total, 40 opened this month (likely AI-assisted contributions)
- High priority issues around target of 8, some relabeled for V-Day
- Onboarding metrics showing concerning trends
  - CNW invocations down despite docs traffic initially appearing up
  - Getting started pages: 1,500/day (down from 2,500/day previously)
  - All metrics trending down year-over-year, aligning with funnel reduction
  - 10% of traffic now AI-driven, doesn't visit docs unless specifically asked
  - NPM downloads up but other adoption metrics declining
- Jack taking over docs/CLI onboarding from Nicole
  - Running experiments to improve cloud acceptance rate (currently 9-12%)
  - Minor messaging tweaks planned

**Development Progress & Sandboxing**
- Local disk migration core complete, moving to dev kit
  - Should see performance improvements in different repos
  - Sandboxing progress targeting strict mode by end of week
  - Exclusions for index.js processes and plugin workers in progress
- Gradle batch processing excluded from sandboxing
  - No violations reported for batch tasks due to complexity
  - Customers can run nightly jobs without batch for violation checking
  - Documentation needed for batch task limitations
- End-to-end test violations down to just tsconfig issues
  - Builds will fail when strict mode enabled Friday
  - Team urged to report sandbox violations immediately

**Major Version & Migration Work**
- Next major branch creation delayed until local disk work complete
  - Timeline shifted from April to May 10th due to NX migrate dependencies
  - V8 Angular support PR ready, waiting for proper branch
- NX migrate revamp spikes nearly complete
  - Leo finishing final spike tomorrow, will record findings via Loom
  - Milestone tasks being created with due dates for timeline tracking
- TypeScript 6 support in progress
  - Base URL removal PR active, fixing e2e test failures
  - Third-party tool compatibility still pending (Angular, TS Query, TS Morph)
  - May require version-specific compatibility warnings

**Infrastructure & Telemetry**
- Telemetry dashboards complete
  - Generator usage generally low across board
  - Executor usage data available on request for deprecation decisions
  - Temporary event tracking possible for specific features
- Database improvements
  - Work tree support PR in review, expected completion by April 3rd
  - Shared database for work trees with local fallback
  - Database versioning changes should resolve existing table issues
- Connect feature still pending Dylan's backend changes
  - Targeting completion this week with full documentation

[Transcript](https://notes.granola.ai/t/304e9c5a-e77b-4ee2-9304-764fb22284d2-00demib2)

### 2026-02-10

**Attendees:** Craigory, Max, Juri, Leosvel, Austin, Miro, Colum, James, Jon, Jason, Steven, Joshua, Philip, Caleb, Louie

**Team Metrics & Planning Accuracy**
- Planning accuracy relies on everyone tracking work in Linear
  - Tasks treated as roughly equal size despite variations
  - Both planned and unplanned work should be captured
- Current performance decent with 2025 backfill data available
  - Last year captured <50% of work in Linear
  - Theory suggests capacity for >50% completion rate
- Focus on P1/P0 issues with healthy median response times
  - P75 metrics tracked for high-priority miscellaneous tasks
  - Medium priority items ignored until process improvements

**Performance & Resource Optimization**
- Maven support progress
  - Facilitating polygraph effort with external dependencies
  - Bug discovered during implementation, fix in progress
  - Dog fooding nearly complete, few remaining items to resolve
- Memory improvements deployed
  - Washer performance enhancement merged (significant memory reduction)
  - Craigory's deploying workers change merged (3GB memory savings post-graph computation)
- Performance research ongoing
  - 30+ optimization opportunities identified
  - Local benchmarks running, branch with commits ready
  - Prioritizing CI-affecting issues first, then daemon improvements
  - Deprioritizing TUI/plugins due to worker shutdown
- High CPU consumption investigation
  - Lonnie reporting peaks, mixed data from Josh requiring verification
  - Theories developed for potential causes in hasher
  - Additional debugging PR planned once proper logs/metrics obtained
  - Transitive dependencies workaround available but masks underlying issue

**UI & Developer Experience**
- TUI project on track for end-of-week completion
  - Two tickets moved to review yesterday
  - One needs return to progress due to missing output
  - Both tickets touch same areas, blocking individual merges
  - Leo handling remaining tickets, one long-running item concerning
- Input/output tracing issues identified
  - Run Commands tracking problems for Cloud
  - Gradle daemon execution bypassing spawned process monitoring
  - Files written by detached processes not captured
  - Similar issues possible with other tools spawning workers
  - March 13 milestone created for resolution

**Onboarding & Cloud Connection**
- Pivoting from CNW optimization after discussion with Nicole/Victor
- New approach: three-option prompt system
  1. "Yes, connect now" (current behavior)
  2. "Maybe later" (signal for future touchpoints)
  3. "Never connect" (sets nx.json setting permanently)
- Additional touchpoint opportunities beyond CNW
  - CI runs and other interactions for connection prompts
- Version 22.5 released yesterday with changes
- NX init AI integration challenges
  - Dylan investigating additional endpoints needed
  - AI models creating own plans instead of invoking tools
  - Auto-permission/YOLO mode gaps for full Cloud connection
  - Focus on normalizing AI option passing behavior

**Project Updates & Next Steps**
- .NET plugin status
  - Working version satisfying customer needs
  - .NET SDK repo still has unresolved issues
  - Considering pivot to PowerShell repo for canonical showcase
  - Microsoft projects have complex build pipelines
- Telemetry implementation
  - Analytics flushing on exit via orphaned child process
  - Serialization to JSON file in NX directory
  - Worker process handles HTTP requests
  - Legal clearance needed before analytics capture
  - Scope consideration: command data only vs. performance logging

**Notes link:** https://notes.granola.ai/t/b50ea4e4-f6d0-4f33-bcc2-7982542064cf-00demib2

---

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
