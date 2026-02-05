# Summary - 2026-02-04

## Announcements

- **New docs IA is live on production** - The new Information Architecture for nx.dev documentation is now deployed to production.

## Completed Tasks

### 1. Agentic CNW Onboarding Specification

**Spec:** `.ai/2026-02-03/specs/agentic-cnw-onboarding.md`
**Related:** [NXC-3815](https://linear.app/nrwl/issue/NXC-3815)

Conducted a brainstorming session to design improvements to `create-nx-workspace` (CNW) for AI agent usage (Claude Code, Cursor, etc.). The goal is to enable autonomous workspace creation with minimal user interaction while ensuring Nx Cloud onboarding is completed.

**Key Decisions:**

1. **AI Detection via Environment Variables**
   - Primary: `CLAUDECODE`, `CLAUDE_CODE`, `OPENCODE`
   - Future: `CURSOR_AGENT`, `GEMINI_CLI=1`

2. **AI Mode Behavior**
   - Auto `--interactive=false`
   - Auto-enable Nx Cloud (no skip)
   - NDJSON output to stdout (no spinners)
   - Auto-generate workspace name if not provided

3. **AI-Friendly `--help`**
   - Streamlined output with recommended defaults
   - Strong emphasis on `--template` over `--preset`
   - Key options only; `--help-all` for full list

4. **JSON Output Schema**
   - Progress stages: cloning → installing → configuring → complete
   - Success: includes `nxCloudConnectUrl`, `nextSteps`, docs links
   - Error: includes `hints`, `errorLogPath` for debugging

5. **Priority Matrix**
   - P0: AI detection + JSON output, AI-friendly `--help`
   - P1: Update Nx MCP with guidance
   - P2: Auto-generate workspace name
   - Future: `nx cloud status`, Cursor/Gemini detection

**Combined with NXC-3815 Findings:**
- Added gaps table mapping investigation issues to solutions
- Added "AI can use `gh` CLI" documentation guidance
- Added `nx connect` flow for workspaces without git remote
- Added priority matrix for implementation planning

---

### 2. Agentic CNW Implementation (NXC-3628/NXC-3815)

**Spec:** `.ai/2026-02-03/specs/agentic-cnw-onboarding.md`
**Branch:** `agentic-onboarding`
**Commit:** `f79065d44a` - feat(core): add AI agent detection and NDJSON output for CNW

Implemented AI agent detection and NDJSON output mode for `create-nx-workspace` (CNW) based on the spec from 2026-02-03.

**Key Implementation:**

1. **AI Detection** (`packages/create-nx-workspace/src/utils/ai/ai-output.ts`)
   - Detects AI agents via env vars: `CLAUDECODE`, `CLAUDE_CODE`, `OPENCODE`
   - NDJSON streaming output for progress stages
   - Structured JSON results with explicit instructions

2. **Non-Interactive Mode**
   - Auto `--interactive=false` in AI mode
   - Requires explicit `--template` flag (exits with options if missing)
   - Suggests `my-nx-repo` as default workspace name
   - Defaults `nxCloud` to `'yes'`

3. **GitHub Setup Instructions**
   - AI tries `gh repo create` silently with 30s timeout
   - On failure, shows `https://github.com/new?name=...` URL to user
   - Clear `thenRunCommands` for git remote add + push

4. **Output Interfaces**
   - `TemplateRequiredResult` - when no template provided
   - `SuccessResult` - with `gitHubSetup`, `nxCloudConnectUrl`, `nextSteps`
   - `ErrorResult` - with hints and error codes

**Files Modified:**
- `packages/create-nx-workspace/src/utils/ai/ai-output.ts` (new)
- `packages/create-nx-workspace/bin/create-nx-workspace.ts`
- `packages/create-nx-workspace/src/create-workspace.ts`
- `packages/create-nx-workspace/src/utils/error-utils.ts`

---

### 3. Google Apps Script PTO Calendar: Daily "Today + Tomorrow" Feature

**Project:** `/Users/jack/projects/gcal/script.js`

**Enhancement:** Extended daily notifications to show both today's events AND tomorrow's upcoming events for better planning.

**Changes:**
1. **New filtering functions:**
   - `eventOverlapsDay(event, dayStart, dayEnd)` - Checks if event overlaps a specific day
   - `filterEventsForDay(events, dayStart)` - Filters events for a specific day

2. **New formatting functions:**
   - `formatDaySection(grouped, label)` - Formats a single day's events (Today or Tomorrow)
   - `formatDailySlackPayload(todayGrouped, tomorrowGrouped, today, tomorrow)` - Creates combined Today+Tomorrow format

3. **Updated `sendEvents_()` for daily mode:**
   - Fetches 2 days of events instead of 1
   - Separates events into today vs tomorrow using `filterEventsForDay()`
   - Groups each day separately with `groupEventsByPerson()`
   - Uses new `formatDailySlackPayload()` for output

**New Daily Output Format:**
```
📅 *PTO Update - Tue, Feb 4*

*📍 Today*
  🏛️ US: Some Holiday
  👤 *Miroslav J.* - Vacation - Europe

*📆 Tomorrow (Feb 5)*
  👤 *Cory H.* - Vacation - US · 1:00 PM - 5:00 PM UTC
```

**Why:** Gives team members advance notice of who will be out tomorrow, allowing better planning for meetings and handoffs.

---

## Files Created/Modified

| File | Description |
|------|-------------|
| `.ai/2026-02-03/specs/agentic-cnw-onboarding.md` | Full specification for agentic CNW improvements |
| `packages/create-nx-workspace/src/utils/ai/ai-output.ts` | AI detection and NDJSON output utilities (new) |
| `packages/create-nx-workspace/bin/create-nx-workspace.ts` | CLI entry point with AI mode middleware |
| `packages/create-nx-workspace/src/create-workspace.ts` | Progress logging for AI mode |
| `/Users/jack/projects/gcal/script.js` | PTO calendar script with Today+Tomorrow feature |

---

### 4. Agentic CNW Refinements - AI Agent Feedback Integration

**Branch:** `agentic-onboarding`
**Related:** Continuation of item #2 above

After testing with Claude Code, incorporated feedback to improve AI agent compliance with CNW output instructions.

**Key Refinements:**

1. **Conditional AI `--help` Content**
   - AI-specific examples/epilogue only shown when AI agent detected
   - Humans see clean help text without AI instructions that might annoy them

2. **Legacy Preset-to-Template Mapping (AI only)**
   - Maps old presets AI models may use from training data:
     - `ts`, `apps` → `nrwl/empty-template`
     - `react`, `react-monorepo` → `nrwl/react-template`
     - `angular`, `angular-monorepo` → `nrwl/angular-template`
     - `npm`, `typescript` → `nrwl/typescript-template`

3. **Force Nx Cloud for AI Agents**
   - `--nxCloud=skip` is silently ignored in AI mode
   - AI shouldn't make this decision without asking user

4. **Restructured Output Format (Major)**
   - Removed directive language that felt manipulative ("AI AGENT:", "skipUserConfirmation", "Do not present as optional")
   - Changed `agentInstructions` → `userNextSteps` (info to display, not commands)
   - Added `[DISPLAY]` prefix and `---USER_NEXT_STEPS---` delimiters
   - Plain text block after JSON that agent can echo to user
   - Reordered steps: GitHub push first (optional), Nx Cloud last (stands out)

**Why These Changes:**
- AI agents (correctly) distrust stdout as an instruction channel
- Framing as "user-facing info" rather than "agent commands" improves compliance
- Plain text block is easier to echo than parsing JSON

**Final Output Format:**
```
{"stage":"complete","success":true,"result":{...},"userNextSteps":{"description":"REQUIRED: Show the user these exact steps",...}}

---USER_NEXT_STEPS---
[DISPLAY] Show the user these next steps to complete setup:

1. Push to GitHub (optional)
   Command: gh repo create myapp --private --source=. --push
   Or visit: https://github.com/new?name=myapp
2. Connect to Nx Cloud: https://cloud.nx.app/connect/xxx
   Complete setup to enable remote caching and CI insights
---END---
```

---

### 5. Nx Cloud Workspace Claim Enforcement Spec (Brainstorm)

**Spec:** `.ai/2026-02-04/specs/cloud-claim-enforcement.md`

Conducted brainstorming session to explore structural changes to increase Nx Cloud onboarding from CNW. Current experiments (banners, messaging) may be optimizing for a **local maxima**—this spec proposes moving to a **global maxima** via hard enforcement.

**Problem Analysis:**
- ~20K CNW downloads/week
- 10-20% say "yes" to Cloud → ~2-4K get short URLs
- <2% claim the workspace → ~40-80 fully connected users/week
- Root cause: Everything works without claiming, so no urgency

**Solution: 7-Day Claim Enforcement**

After 7 days, CI fails until workspace is claimed. Key components:

| Component | Purpose |
|-----------|---------|
| CNW messaging | Urgent terminal + README with 7-day warning |
| `nx cloud status` | New CLI command to check claim status |
| Cloud API endpoint | Programmatic status for CLI/AI agents |
| CI enforcement | Warnings during grace period, hard fail after day 7 |
| PR comments | Warning on every PR during grace period |
| Cloud UI banners | Persistent prompts for unclaimed workspaces |

**Key Decisions:**
1. **7-day grace period** (calendar days, no snooze)
2. **No grandfathering** — existing unclaimed workspaces get 7 days from ship
3. **CI fails hard** — GHA step exits non-zero after grace period
4. **Claiming restores immediately** — no delay after claiming
5. **Anyone can claim** (known security gap, urgency mitigates)

**Target Metrics:**
- CNW → Says "yes": 10-20% → 50%+
- Gets URL → Claims: <2% → 5%+
- Fully connected users/week: ~40-80 → 500+

**Rollout Phases:**
1. Messaging only (measure impact)
2. Status command + API + CI warnings
3. Hard enforcement (CI failure)
4. Monitor + iterate

---

## Files Created/Modified

| File | Description |
|------|-------------|
| `.ai/2026-02-04/specs/cloud-claim-enforcement.md` | Full specification for claim enforcement system |
| `packages/create-nx-workspace/src/utils/ai/ai-output.ts` | Refined output format with userNextSteps |
| `packages/create-nx-workspace/bin/create-nx-workspace.ts` | Conditional --help, preset mapping, force nxCloud |
