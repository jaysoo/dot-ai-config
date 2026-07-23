# Chau

**Team:** Red Panda
**Role:** L4 Engineer
**Manager:** Jon
**Location:** Atlanta, GA, USA (moved from O'Fallon, MO in late April 2026; ~1 hour from Altan)

## Personal

- **Partner:**
- **Children:** Brian (son) — school class full triggered the accelerated Atlanta move
- **Pets:**
- **Hobbies:**

## Preferences

- **Food:**
- **Drinks:**
- **Restaurants:**

## Professional

- **Current Focus:** Polygraph (new app), wrapping up Red Panda
- **Goals:** L5 promotion (focus on micro-strategy docs, code reviews, leveling up teammates)
- **Strengths:** Auth expertise, frontend architecture, performance optimization

## Promotion History

### L4C (2026-01 Cycle)

- **Decision:** Bumped to L4C, working towards L5

## L5 Promotion Evidence (Working Towards)

### 1. Enterprise Auth with SAML + SCIM

- Enabled SAML enterprise customers to use SCIM for provisioning/deprovisioning users
- Made the permissions framework more robust
- Addressed significant customer complaints about missing functionality
- **Impact:** Enables ClickUp, Carvana, SiriusXM, Omnicell to seamlessly manage access to their instance

### 2. Nx Graph Rework

- Introduced new graph experience with more efficient, intuitive interactions
- Made graph visualization usable for customers with huge dependency graphs (Fidelity, ClickUp, MECCA) - previous implementation was unusable
- Improved task graph performance to be actually usable
- Implemented consistent UI throughout all graph instances → more cohesive/polished branding
- Added circular dependencies feature for enterprise - surfaces areas that previously required custom tooling to assess and detangle
- **Impact:** Visible to ALL Nx users and Nx Cloud customers

### 3. Enterprise Usage Analytics

- Redesigned enterprise license model to support multiple licenses and track historical data
- Designed and implemented enterprise usage screen showing contract details across entire period or monthly
- Shows projections to highlight if customers are on track - helps DPEs/AEs understand credit needs
- **Impact:** All enterprise customers, DPEs, and AEs

### 4. Resource Usage Screen

- Designed and created Resource Usage screen to visualize Agent instance CPU/Memory usage from collected metrics
- Ensured performance with loading/rendering metrics files using workers on both Node.js and browsers
- **Spinoff:** Worker Pool abstraction can be reused for any stream-related operations (e.g., Terminal Output logs)

### 5. Auth Ownership & Bug Bounty Response

Handled almost all auth-related issues over the last couple of years, including several bug bounty investigations:

**Session Invalidation Issues:**

- Implemented DB sessions
- Invalidate sessions after password reset
- Allow users to invalidate all sessions

**Reset Password Security:**

- Implemented confirmation on reset password from within Nx Cloud UI

**Verify Email Spam:**

- Implemented verify email timestamp to prevent spamming

### 6. Error Handling Framework Rewrite

- Implemented `NxCloudError` and subclass domain-specific errors (`WorkspaceError`, `OrganizationError`)
- Implemented `createLoader` and `createAction` abstractions with built-in error handling for `NxCloudError` that plays nice with Remix
  - Ensures Rollbar errors are sent properly without spamming
- Implemented `ErrorBoundary` to work with `NxCloudError`
  - Ensures proper serialization for client-side and server-side errors

### 7. Framework/Library Stewardship

Keeps Remix/React Router/TypeScript resources up to date and educates team through technical documentation and Looms:

- All `@remix-run/*` packages
- All `remix-*` packages (remix-auth, remix-utils, etc.)
- Auth-related packages (auth0 and all strategies: SAML, GitHub, GitLab, Bitbucket)

## 1:1 Notes

### 2026-07-23

Transcript: https://notes.granola.ai/t/07db82f5-9844-4d42-b75f-ceeeb7e82c54-00demib2

- **AI-assisted work: productivity and boundaries:**
  - AI output volume high and growing; reviews becoming a bottleneck. Leo's PR merge volume cited as an example of the pace. Jack considering AI to pre-review PRs before human review.
  - Work/life boundary blurring with Claude Code remote control: easy to check in from phone, sessions run late into evenings.
  - Saturday credit reset creating a "FOMO" loop - running prompts to game the session rather than produce real value. Shared recognition this isn't sustainable, especially over summer. School schedules starting soon may act as a natural forcing function.
  - Skepticism in DMs: some teammates don't want to review 2-3k line PRs, miss writing code directly. Jack's view: AI is here to stay, team will lean harder into it. Still valuable for human-written design/pseudocode on genuinely novel areas; boilerplate/UI patterns (divs, existing components) are a clear waste to type by hand.
- **AI code quality and verification:**
  - Core tension: AI output volume outpaces the team's ability to verify it. Bottleneck is human review capacity, not generation speed. 2,000-line PRs used to be rare.
  - Consensus: need a robust verification system to trust AI output. Read the plan/flow rather than every line, but the test harness must be trustworthy. Playwright and lint tests need to be reliably runnable by the agent (currently flaky with Gradle/Playwright in some setups).
  - AI works well for tightly scoped, well-defined features; breaks down on larger tasks where assumptions shift mid-implementation. "Waterfall spec" mode doesn't work - need agile, iterative human-in-the-loop guidance. Still need to spin up the dev server to catch subtle UI issues (hover states, mobile, double borders).
  - DTE system highly distributed - only Wei and Autumn know it well. No automated verification; issues often only surface on Snapshot or staging. Load balancers and request timeouts on deployed environments can't be reproduced locally.
- **Dev setup: preview environments:**
  - Local setup is a bottleneck for end-to-end verification. Checking out branches locally to review PRs is a time sink. Netlify deploys work for static sites but no equivalent for server previews.
  - Chau flagged Autumn's sandbox/preview URL work as worth replicating - would unblock parallel workstreams currently limited by local port conflicts.
  - Jack agrees dev setup needs revisiting, but timing is the constraint against other product priorities. Partial graph execution (disable toolchains like .NET via NX vars) discussed as related improvement, likely Q4 at earliest.
- **Action Items:**
  - Explore preview environment setup for server-side PRs (eliminate need to check out branches locally; Autumn's sandbox work is a reference point).
  - Set clearer team norms around AI usage hours (address burnout risk and "just one more prompt" habit; no formal proposal yet, keep the conversation going).

### 2026-04-30

- **Personal / Relocation:**
  - Moved to Atlanta last week — house buying accelerated; son Brian couldn't get back into school (class full), forced immediate move
  - Originally planned ~1 year ago, delayed by Vietnam trip
  - Still unpacking, planning flooring work
  - ~1 hour from Altan; not close neighbors despite both being in Atlanta metro
- **Team Transitions / Orca:**
  - Mark mentioned a possible move back to Orca to Chau without official lead communication
  - Earliest June, more likely July — Victor wants Polygraph handoff complete first (2-4 weeks of follow-up after feature completion)
  - Move depends on Nicole's capacity assessment; if Nicole + Ben sufficient for Orca, may not happen
  - Current directive: stay focused on Polygraph; still considered auth domain expert
- **Polygraph:**
  - Core functionality: repository relationship mapping (repo-to-repo, not project-to-project) — indexes published packages, APIs, consumption patterns; can suggest candidate repos at session start based on changes
  - Technical pain points: CLI weak with OSS (skills not globally installed), session starts in config folder instead of repo dir, can't use `@file` for agent context
  - PLG integration: monetization considered from design phase, moving away from "talk to sales" toward self-service; ~30% feature build / 70% activation + marketing; need activation demos, guides, in-app discovery
  - Victor wants terminal graph rendering — team questioning necessity vs difficulty ("because it's cool")
- **Auth0 Migration:**
  - Nicole driving move to FusionAuth
  - Primary motivation: better onboarding flows, callback URL flexibility
  - Secondary: resolve recurring pen test issues
- **Action Items:**
  - Defer Orca transition decision to July capacity review
  - Keep Chau on Polygraph through handoff + 2-4 week tail
- **Carry-over from prep topics:**
  - Backup coverage for critical areas Chau owns (knowledge sharing concern)
  - Framework decision follow-up: did they go Remix V2 or greenfield for polygraph?

### 2026-03-19

- **Schedule:** Moving 1:1 to later time slot; next 1:1 in 6 weeks
- **Productivity & AI Tooling:**
  - Team showing increased PR commits and code changes — AI tooling having positive impact
  - Year's focus theme: prioritize important work, reduce maintenance burden
  - Proposed automations: reject poorly written bug reports, require Claude-processable descriptions, overnight automated fixes with review workflow
- **Polygraph (New App):**
  - About to kickstart new frontend application (internal codename "polygraph", external branding TBD)
  - Naming decisions pending (Yuri/Victor involvement)
  - Creating new frontend app entry in Notion
- **Framework Decision:**
  - Victor wants Remix V2 to reuse existing components/logic (VCS integration, custom workflows, Lotus logic)
  - Chau prefers avoiding Remix V2 — uncertain longevity, risk of adding more Remix dependencies
  - Estimated code overlap between apps: 5-10%, not 80% — greenfield opportunity
  - Deadline pressure: Lotus One in 2 weeks
  - Fallback option: Remix V2 with future flags
  - Chau has Claude Opus branch attempting NX Cloud migration to React Router 7 — nearly successful but blocked by NX Remix plugin React Router DOM V6 dependency
  - Jack: consider removing Remix as official NX plugin
  - Jack available for framework discussions as needed
- **Security / Pen Test:**
  - Completed pen test issue fixes: encryption/decryption for stored tokens, reused existing encryption utils, wrapped Remix's create cookie function
  - Implementation: one morning + week of monitoring
- **Red Panda:** Wrapping up to focus on polygraph
- **Action Items:**
  - Framework decision pending further evaluation
  - Jack: consider Remix plugin removal from NX

### 2026-02-05

- **Red Panda Progress:** Self-healing board, AT Gentex CLI/Monitor CI ongoing
- **MCP Tools:** Context length issues with e2e test logs; updated to return in-progress status
- **L5 Path:** John to schedule regular 1:1s; focus on micro-strategy docs, code reviews, leveling up teammates
- **Auth Transition:** Remains SME but Dylan/Nicole (Orca) handle most fixes; knowledge transfer via Looms
- **Testing Challenges:** Local testing pain points for self-healing; exploring PR environments
- **Action Items:**
  - Jack: Follow up with John on 1:1s, discuss PR environments with Steve
  - Chau: Document local testing pain points, continue MCP iteration with strategic docs focus

### 2026-01-21

- Onboarding for Red Panda for self-healing
- One page onboarding
- Put together a list of responsibilities and knowledge transfer
  - Auth and agent utilization
- "Ralph" for green PRs

## Random Notes
