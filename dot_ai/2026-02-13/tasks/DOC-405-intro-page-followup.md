# DOC-405: Intro Page Follow-up - Problem/Solution Structure

**Status**: Pending
**Created**: 2026-02-13
**Related**: DOC-405, `.ai/2026-02-11/tasks/DOC-405-ax-getting-started.md`

## Context

Feedback from review of the intro page changes. The current page mixes problem framing inconsistently - some "challenges" listed are actually polyrepo problems that monorepos solve, not monorepo challenges.

## Key Feedback

### 1. Problem/Solution Structure (Primary)

Follow Turborepo's approach more closely:

**Current issues with intro page:**
- Mentions challenge of monorepos, then explains what a monorepo is, then advantages
- "Code sharing complexity" is a polyrepo problem, not a monorepo headache
- "Lost context" is an advantage of monorepos, not a challenge
- Structure is inconsistent and confusing

**Turborepo's approach (to adopt):**
- **Problem**: Very concise - "thousands of tasks to run efficiently"
- **Solution**: How it solves it - "remote cache, task scheduling"
- Keep it SHORT - their intro is essentially two sentences
- Don't try to define what a monorepo is
- No mixed messaging

**Target structure:**
1. Challenge/Problem section (concise)
2. Solution section (Nx solves this by...)
3. Quick links to get started

### 2. Progressive Sidebar Structure (Secondary)

Turborepo's sidebar allows progressive learning:
- Introduction → Quick start → Installation → Start with example → etc.
- Going down = more advanced topics
- General knowledge → CI → Self-healing
- The sidebar essentially IS their tutorial
- Core concepts are separate explainer pages linked out to

**Consideration**: Could restructure our Getting Started sidebar to be more progressive/tutorial-like.

## Reference

Turborepo intro page: https://turbo.build/repo/docs

## Tasks

- [ ] Rewrite intro page problem/challenge section to be consistent (only true monorepo challenges)
- [ ] Add concise solution section immediately after problem
- [ ] Remove or relocate "what is a monorepo" explanation (link to concepts instead)
- [ ] Trim overall length - aim for Turborepo's brevity
- [ ] (Optional) Evaluate sidebar for progressive learning structure

## Notes

- Victor previously requested keeping intro short and concise
- Balance brevity with providing good overview
- Don't overwhelm new users
