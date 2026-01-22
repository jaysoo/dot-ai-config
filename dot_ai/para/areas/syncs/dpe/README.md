# DPE Sync Tracker

Tracking document for Developer Productivity Engineering (DPE) sync meetings.

## Topics for Next Meeting

Here are topics to discuss in the next DPE sync meeting:

- Block should be able to re-enable file watching in Console again after next release
  - https://linear.app/nxdev/issue/NXC-3132/reassess-when-we-disable-the-daemon
- ClickUp churn risk (10-25%) - IPO cost cutting pressure
- Value communication strategy - showing time/cost savings in product
  - GitHub comments, dashboard metrics, baseline comparisons
- Review #ask-* channels - any confusion in #nx?
  - Check for common questions/misunderstandings that could inform docs or DX improvements

## Active Accounts

| Account | DPE | Key Issues | Status |
|---------|-----|------------|--------|
| PowerBI | - | Blockers resolved | ✅ |
| ProductBoard | Miro, JVA | Lockfile optimizations, affected graph output slow | 🔄 |
| ClickUp | - | IPO prep, cost cutting pressure, 10-25% churn risk | ⚠️ |
| MailChimp | - | Average CIPE 2-4 minutes | 🔄 |
| Gong | - | Using Turborepo, slow Vercel + Remote Cache | 🆕 |

## Action Items

### Input Tracing (January Target)
- The opposite of unused inputs / overly declared inputs
- Track progress here

### Codspeed Integration
- Needs to be integrated for Ocean and CLI

### PR Reminders
- https://github.com/nrwl/nx/pull/33551
- https://github.com/nrwl/nx/pull/33562
- https://github.com/nrwl/nx/pull/33572

### Lockfile Performance
- Lockfile parsing has slowed down
- Consider: Conformance rules for bad performance patterns

### Turbo vs Nx Document
- Creating a comparison document for Gong
- Context: They're using Turborepo with slow Vercel + Remote Cache

---

## Meeting Notes

### 2026-01-21 (from Docs sync - Caleb)

**ClickUp Account Issues:**
- Kyle (Principal Architect) pushing for credit forgiveness after causing system outage
  - Load tested agents, found limits, crashed control plane
  - Kept retriggering failed CI jobs on test branch
  - Wants refund for $10 spent during self-caused failure
- Context: ClickUp preparing for IPO, cutting costs aggressively
  - Kyle under pressure from VPs/directors to reduce spending
  - Different expectations between Kyle and his management
- Similar to GitHub outages but Microsoft can't be pushed around
- ClickUp doubled compute usage since February 2025
  - Still using old cost projections in calculations
  - Risk of switching away from agents (10-25% chance)
  - Would revert to self-hosted GitHub runners with manual DTE

**Value Communication Strategy:**
- Show time saved and cost saved as much as possible throughout product
  - GitHub comments after CI completion
  - Dashboard metrics showing concrete savings
  - Similar to Amazon Prime, Instacart, Uber Eats value messaging
- Survey teammates on if they understand value of Nx Cloud
  - Target people without high-touch support interactions
  - Understand if non-technical stakeholders grasp the value proposition
- Challenge: People forget pre-Nx Cloud performance once it becomes normal
  - DSG doesn't remember life before Nx Cloud
  - Need constant reinforcement of baseline comparisons
- Potential features:
  - Performance comparisons week-over-week
  - Leaderboards showing CI improvements
  - Early shutdown savings tracking

### 2026-01-12

- PRs to remind (Leo):
  - Block (talk to Jason)
    - https://github.com/nrwl/nx/pull/33562
    - https://github.com/nrwl/nx/pull/33572
- Talk to Jason about logging native logs
- ProductBoard
  - Miro's lockfile PR helps, but it's still slow
  - `package.json` name and version is being checked (Craigory)
- CPU tracking, rather than combined, also show per-core
  - Talk to Leo to see if we can get some data immediate
  - UI and backend changes might be needed
- ClickUp
  - Merging configs (Juri and Craigory)
- Fidelity asking about generator analytics
  - Likely relevant to out own effort
- Island not able to get cache hits locally
  - Lockfiles, git diff changes, etc.
  - ProductBoard as well
  - People are confused with cache misses
  - nxignore vs gitignore
  - Idea: maybe a brief explanation of why a cache is missed
  - Altan usually can help, auth is Chau
- Paylocity postcss
  - Annual success plan for this week (JVA)
- 7-11
  - Conformance is slow to run (30 seconds) -- appears to do nothing
- Gong using Turborepo (Miro)
  - Raise with Victor
  - Creating a document for Turbo vs Nx
  - Slow Vercel + Remote Cache

### 2025-12-15

**Updates:**
- PowerBI blockers are gone ✅
- ProductBoard (Miro and JVA)
  - Optimizations for lockfile needed
  - Affected graph output is slow
- Codspeed needs to be integrated for Ocean and CLI
- ClickUp
  - Gradle attached to root, and always busts cache
  - Need to improve cache hit rates
- Input tracing for January
  - The opposite of unused inputs or overly declared inputs
- Lockfile parsing has slowed down
  - Consider conformance rules for bad performance patterns
- Gong using Turborepo (Miro)
  - Creating a document for Turbo vs Nx
  - Slow Vercel + Remote Cache
- MailChimp average CIPE 2-4 minutes

**PR Reminders:**
- https://github.com/nrwl/nx/pull/33551
- https://github.com/nrwl/nx/pull/33562
- https://github.com/nrwl/nx/pull/33572
