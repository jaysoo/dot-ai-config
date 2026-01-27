# Louie

**Team:**
**Role:**
**Location:** Vancouver or Toronto, Canada (?)

## Personal

- **Partner:**
- **Children:**
- **Pets:**
- **Hobbies:**

## Preferences

- **Food:**
- **Drinks:**
- **Restaurants:**

## Professional

- **Current Focus:**
- **Goals:**
- **Strengths:**

## Upcoming 1:1

-

## 1:1 Notes

### 2026-01-22

**Performance Review Feedback**
- Completed review with Nicole smoothly, no major surprises
- More relevant this cycle due to closer work with Alton (direct management of work output)
- Main actionable: stay focused on completing work (reinforcing Alton's previous feedback)

**Team Structure & Management Changes**
- Alton hasn't scheduled regular 1:1s yet (using impromptu daily sync slots)
- Jack recommends monthly cadence for non-project discussions
- Previous team structure had coordination challenges (DTE work, Alton spread thin, stalled refactors)
- New Quokka team structure showing improvements (more focused vs. backend/Red Panda split)

**Current Work: Flaky Task Detection**
- Rebuilding flaky task system with LLM integration
- Implementation straightforward, validation complex
- Building test fixtures for repeatable benchmarks/simulations (replacing ad hoc TS scripts)
- Two flakiness mechanisms:
  1. Self-healing (post-failure retry)
  2. DTE-embedded (during scheduling for reduced friction)
- Benchmarking: historical data with known flaky task hashes, categorizing false positives/negatives
- Goal: LLM outperforms current statistical model
- Cost: ~$0.60 per simulation run (basic LLM version)
- Need dashboard access from Steve for usage tracking; John provisioned dedicated API key

**Marketing Impact & Metrics**
- Potential improvements: reduced pipeline duration, cost savings
- Marketing opportunity: baseline comparisons, quantifiable metrics (false positive reduction %, duration/cost saved)
- Challenge: generalizing improvements across multiple repos

**Future Planning & Priorities**
- Next major effort: DTE structural improvements
  - Current batch scheduling creates throughput limitations
  - Single slow task (5 min) blocks entire batch of 30-second tasks
  - Goal: continuous task assignment to reduce idle time
  - Requires significant architectural changes
- Team planning improvements:
  - Better backlog management in Linear projects
  - 70% planned / 20% unplanned / 10% Java work target
  - Monthly tracking via Linear issues
  - Break large tasks into smaller components

[Meeting transcript](https://notes.granola.ai/t/87d6c86b-7ffd-4799-9709-89811347a938-00demib2)

### 2025-12-12
- Really enjoyed agent resource work and feature work in general
- Working on background/backend is a bit demoralizing

## Random Notes
