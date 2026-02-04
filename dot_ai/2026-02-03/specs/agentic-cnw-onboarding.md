# Agentic CNW Onboarding Specification

**Date:** 2026-02-03
**Status:** Ready for Implementation
**Scope:** Quick win - Claude Code focus, expandable to other AI agents
**Related:** [NXC-3815](https://linear.app/nrwl/issue/NXC-3815) - Investigation findings

## Overview

Enable AI agents (starting with Claude Code) to autonomously create Nx workspaces and guide users through Nx Cloud connection with minimal friction.

### Goals

1. AI agents can run `create-nx-workspace` (CNW) non-interactively with sensible defaults
2. `--help` provides AI-friendly guidance with recommended options
3. When AI is detected, CNW outputs structured JSON for easy parsing
4. Nx Cloud connection URL is prominently surfaced with clear user action required
5. No breaking changes for human users

### Non-Goals (Future Work)

- Support for Cursor, Gemini, Copilot, Codex detection (add later)
- Changes to `nx init`
- Agent config file generation (`.claude/`, `.cursor/`, etc.)

---

## Gaps Identified (from NXC-3815)

Investigation revealed these issues when AI agents use CNW:

| Gap | Impact | Solution |
|-----|--------|----------|
| Old presets suggested instead of templates | AI uses complex `--preset` flags | AI-friendly `--help` emphasizing `--template` |
| Interactive mode doesn't work | AI can't answer prompts | Auto `--interactive=false` when AI detected |
| Too many options, no clear defaults | AI asks user many questions | Streamlined `--help` with sane defaults |
| AI ignores `--template`, insists on `--preset` | Suboptimal workspace setup | Strong emphasis on `--template` in help |
| Cloud connection not emphasized | Users don't complete onboarding | Prominent `nxCloudConnectUrl` in output |
| AI skips Cloud without asking | Lost onboarding opportunity | Auto-enable Cloud for AI agents |
| AI says "I cannot push to GitHub" | User does manual work | Document that AI CAN use `gh` CLI |
| No way to check Cloud onboarding status | AI gives wrong info | Add `nx cloud status` command (future) |
| `nx connect` fails without remote | Extra manual steps | AI should use `gh repo create` first |

---

## AI Agent Detection

CNW detects AI agents via environment variables. When detected, it switches to AI-optimized output mode.

### Environment Variables (Priority Order)

| Variable | Tool | Notes |
|----------|------|-------|
| `CLAUDECODE` | Claude Code | Primary detection |
| `CLAUDE_CODE` | Claude Code | Fallback |
| `OPENCODE` | OpenAI CLI | Secondary support |

### Future Additions

| Variable | Tool | Source |
|----------|------|--------|
| `CURSOR_AGENT` | Cursor | [Cursor Terminal Docs](https://docs.cursor.com/en/agent/terminal) |
| `GEMINI_CLI=1` | Gemini CLI | [Gemini Shell Tool Docs](https://google-gemini.github.io/gemini-cli/docs/tools/shell.html) |

### Detection Logic

```typescript
function isAiAgent(): boolean {
  return !!(
    process.env.CLAUDECODE ||
    process.env.CLAUDE_CODE ||
    process.env.OPENCODE
  );
}
```

---

## AI-Friendly `--help` Output

When users run `npx create-nx-workspace@latest --help`, show a streamlined output focused on key options with clear recommendations.

### Proposed `--help` Structure

```
Create a new Nx workspace

USAGE:
  npx create-nx-workspace@latest <name> [options]

RECOMMENDED (AI AGENTS):
  npx create-nx-workspace@latest myorg --template=nrwl/empty-template --nxCloud=yes --interactive=false

  Templates are pre-configured starters. Use --template for the fastest setup.

KEY OPTIONS:
  --template <repo>       GitHub template to clone (RECOMMENDED)
                          • nrwl/empty-template        Empty monorepo
                          • nrwl/react-template        React + Express fullstack
                          • nrwl/angular-template      Angular + Express fullstack
                          • nrwl/typescript-template   NPM packages ready to publish

  --nxCloud <yes|skip>    Connect to Nx Cloud for remote caching and CI
                          Default: yes (recommended)

  --packageManager <pm>   npm | yarn | pnpm | bun
                          Default: detected from how you invoked the command

  --interactive <bool>    Enable interactive prompts (default: true)
                          Set to false for scripted/AI usage

ADVANCED OPTIONS:
  Run with --help-all to see all available options including --preset for custom configurations.
```

### Key Principles

- **Strong emphasis on `--template`** - fastest path to working workspace
- **Small list of key options** - don't overwhelm with 30+ flags
- **Clear defaults** - AI knows what to recommend
- **Hide advanced options** - available via `--help-all` for power users

---

## AI Mode Behavior

When an AI agent is detected via environment variables:

### Automatic Settings

1. **Non-interactive mode** - Skip all prompts (`--interactive=false` behavior)
2. **Nx Cloud enabled** - Auto-enable, no skip option
3. **JSON output** - All output as NDJSON to stdout
4. **No spinners** - Spinners don't work well with AI agents
5. **Auto-generate workspace name** - If no name provided, generate sensible default (e.g., `my-workspace` or `nx-workspace-{timestamp}`)

### Output Format: NDJSON (Newline-Delimited JSON)

Progress and results streamed as JSON lines to stdout:

```json
{"stage": "cloning", "message": "Cloning template nrwl/react-template..."}
{"stage": "installing", "message": "Installing dependencies with pnpm..."}
{"stage": "configuring", "message": "Configuring Nx Cloud..."}
{"stage": "complete", "success": true, ...full result object...}
```

---

## JSON Output Schema

### Success Response

```json
{
  "stage": "complete",
  "success": true,
  "title": "Nx Workspace Created Successfully",
  "description": "Your new Nx workspace 'myorg' is ready with a React application.",

  "workspacePath": "/path/to/myorg",
  "workspaceName": "myorg",
  "template": "nrwl/react-template",

  "nextSteps": [
    "Run 'cd myorg' to enter your workspace",
    "Run 'nx serve myapp' to start the development server",
    "Run 'nx graph' to visualize your project structure",
    "**IMPORTANT**: Click the Nx Cloud URL below to enable remote caching and up to 70% faster CI."
  ],

  "nxCloudConnectUrl": "https://cloud.nx.app/connect/abc123",
  "nxCloudMessage": "Remote caching and CI optimization - click to complete setup",

  "docsGettingStarted": "https://nx.dev/getting-started/intro",
  "docsNxCloud": "https://nx.dev/ci/intro/why-nx-cloud"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `stage` | string | Always `"complete"` for success |
| `success` | boolean | Always `true` for success |
| `title` | string | Human-readable title |
| `description` | string | Summary of what was created |
| `workspacePath` | string | Absolute path to workspace |
| `workspaceName` | string | Name of the workspace |
| `template` | string | Template used (e.g., `nrwl/react-template`) |
| `nextSteps` | string[] | Ordered list of next actions (dynamic based on template) |
| `nxCloudConnectUrl` | string | URL user must click to complete cloud setup |
| `nxCloudMessage` | string | Explanation of what the URL does |
| `docsGettingStarted` | string | Link to getting started docs |
| `docsNxCloud` | string | Link to Nx Cloud docs |

### `nextSteps` Dynamic Content

The `nextSteps` array is dynamic based on the template used:

**Empty template:**
```json
["Run 'cd myorg' to enter your workspace", "Run 'nx graph' to see your project structure", "...cloud step..."]
```

**React template:**
```json
["Run 'cd myorg' to enter your workspace", "Run 'nx serve myapp' to start the development server", "...cloud step..."]
```

**Nx Cloud step is always last and prominent:**
```
"**IMPORTANT**: Click the Nx Cloud URL below to enable remote caching and up to 70% faster CI."
```

---

## Error Handling

### Error Response

```json
{
  "stage": "error",
  "success": false,
  "title": "Workspace Creation Failed",
  "error": "Directory 'myorg' already exists",
  "errorCode": "DIRECTORY_EXISTS",
  "hints": [
    "Choose a different workspace name",
    "Remove the existing directory with 'rm -rf myorg'"
  ],
  "errorLogPath": "/path/to/myorg/.nx/cnw-error.log",
  "docsGettingStarted": "https://nx.dev/getting-started/intro"
}
```

### Error Fields

| Field | Type | Description |
|-------|------|-------------|
| `stage` | string | Always `"error"` |
| `success` | boolean | Always `false` |
| `title` | string | Human-readable error title |
| `error` | string | Error message |
| `errorCode` | string | Machine-readable error code |
| `hints` | string[] | Suggestions to fix the error |
| `errorLogPath` | string | Path to full error log with stack trace |
| `docsGettingStarted` | string | Link to docs |

### Error Log File

When errors occur, write full diagnostic info to `.nx/cnw-error.log`:

- Full stack trace
- Command output
- Environment info (Node version, OS, package manager)
- Timestamps

### Partial Success (Cloud Connection Failed)

```json
{
  "stage": "complete",
  "success": true,
  "title": "Nx Workspace Created Successfully",
  "description": "Your workspace is ready, but Nx Cloud connection failed.",

  "workspacePath": "/path/to/myorg",
  "workspaceName": "myorg",
  "template": "nrwl/react-template",

  "nextSteps": [
    "Run 'cd myorg' to enter your workspace",
    "Run 'nx serve myapp' to start the development server",
    "Visit the Nx Cloud setup page to manually connect your workspace"
  ],

  "nxCloudConnectUrl": "https://cloud.nx.app/get-started",
  "nxCloudMessage": "Cloud connection failed - visit this URL to set up manually",
  "nxCloudError": "Network timeout while connecting to Nx Cloud",

  "docsGettingStarted": "https://nx.dev/getting-started/intro",
  "docsNxCloud": "https://nx.dev/ci/intro/why-nx-cloud"
}
```

---

## Progress Stages

NDJSON progress messages during workspace creation:

| Stage | Message Example |
|-------|-----------------|
| `cloning` | `"Cloning template nrwl/react-template..."` |
| `installing` | `"Installing dependencies with pnpm..."` |
| `configuring` | `"Configuring Nx Cloud..."` |
| `initializing` | `"Initializing git repository..."` |
| `complete` | Final success object |
| `error` | Final error object |

### Example Stream

```json
{"stage": "cloning", "message": "Cloning template nrwl/react-template..."}
{"stage": "installing", "message": "Installing dependencies with pnpm..."}
{"stage": "configuring", "message": "Configuring Nx Cloud..."}
{"stage": "initializing", "message": "Initializing git repository..."}
{"stage": "complete", "success": true, "title": "Nx Workspace Created Successfully", "description": "Your new Nx workspace 'myorg' is ready with a React application.", "workspacePath": "/Users/jack/myorg", "workspaceName": "myorg", "template": "nrwl/react-template", "nextSteps": ["Run 'cd myorg' to enter your workspace", "Run 'nx serve myapp' to start the development server", "Run 'nx graph' to visualize your project structure", "**IMPORTANT**: Click the Nx Cloud URL below to enable remote caching and up to 70% faster CI."], "nxCloudConnectUrl": "https://cloud.nx.app/connect/abc123", "nxCloudMessage": "Remote caching and CI optimization - click to complete setup", "docsGettingStarted": "https://nx.dev/getting-started/intro", "docsNxCloud": "https://nx.dev/ci/intro/why-nx-cloud"}
```

---

## Expected AI Agent Flow

### 1. AI Reads Help

```bash
npx create-nx-workspace@latest --help
```

AI parses the help output, understands:
- `--template` is recommended
- Available templates
- `--nxCloud=yes` is default
- `--interactive=false` for scripted usage

### 2. AI Proposes to User

> "I'll create an Nx workspace called 'myorg' using the React template with Nx Cloud enabled. Does that sound good, or would you like a different setup?"

### 3. User Confirms/Customizes

User says "yes" or provides customization.

### 4. AI Runs CNW

```bash
CLAUDECODE=1 npx create-nx-workspace@latest myorg --template=nrwl/react-template --nxCloud=yes --interactive=false
```

### 5. AI Parses JSON Output

AI reads NDJSON stream, shows progress to user, then parses final result.

### 6. AI Presents Result

> **Your Nx workspace is ready!**
>
> Workspace created at `/Users/jack/myorg`
>
> **ACTION REQUIRED:** Click this link to connect to Nx Cloud for remote caching and faster CI:
> https://cloud.nx.app/connect/abc123
>
> This enables:
> - Remote caching (avoid rebuilding unchanged code)
> - Up to 70% faster CI
> - Distributed task execution
> - Self-healing CI
>
> **Next steps:**
> 1. `cd myorg`
> 2. `nx serve myapp` to start the dev server
> 3. `nx graph` to visualize your project
>
> **Learn more:** https://nx.dev/ci/intro/why-nx-cloud

---

## Implementation Checklist

### Phase 1: AI Detection & JSON Output (CNW Code Changes)

- [ ] Add `isAiAgent()` detection function checking `CLAUDECODE`, `CLAUDE_CODE`, `OPENCODE`
- [ ] Create NDJSON output utilities
- [ ] Implement progress stage logging
- [ ] Implement success JSON schema
- [ ] Implement error JSON schema with hints
- [ ] Implement error log file writing
- [ ] Handle partial success (cloud connection failure)
- [ ] Auto-generate workspace name if not provided (in AI mode)

### Phase 2: AI-Friendly Help (CNW Code Changes)

- [ ] Restructure `--help` output with recommended section
- [ ] Add `--help-all` for full option list
- [ ] Surface key options: `--template`, `--nxCloud`, `--packageManager`, `--interactive`
- [ ] Add template descriptions
- [ ] Emphasize `--template` over `--preset`

### Phase 3: Testing

- [ ] Test with `CLAUDECODE=1` env var
- [ ] Test all templates (empty, react, angular, typescript)
- [ ] Test error scenarios (directory exists, network failure, etc.)
- [ ] Test cloud connection failure fallback
- [ ] Verify no changes to human (non-AI) flow

### Phase 4: Documentation & AI Instructions (Low-Effort)

These can be done via docs/MCP updates without code changes:

- [ ] Update Nx MCP to recommend `--template` over `--preset`
- [ ] Document that AI CAN use `gh` CLI to create repos and push
- [ ] Add guidance for `nx connect` flow: use `gh repo create` if no remote
- [ ] Document that AI can open URLs with `open <url>` (macOS) or `xdg-open` (Linux)
- [ ] Add consistent Cloud messaging: "70% faster CI, remote caching, green PRs, self-healing CI"

### Phase 5: Future Expansion (More Effort)

- [ ] Add `CURSOR_AGENT` detection
- [ ] Add `GEMINI_CLI` detection
- [ ] Add Codex/Copilot detection when env vars are available
- [ ] Add `nx cloud status` command to check onboarding completion
- [ ] Prefill repo URL in Cloud connect flow
- [ ] Zero-click Cloud connect (auto-auth without browser)

---

## Priority Matrix

Quick wins ordered by impact and effort:

### Immediate (This Sprint)

| Priority | Item | Type | Effort | Impact |
|----------|------|------|--------|--------|
| **P0** | AI detection + JSON output in CNW | Code | Medium | High |
| **P0** | AI-friendly `--help` | Code | Low | High |
| **P1** | Update Nx MCP with `--template` guidance | Docs | Low | Medium |
| **P1** | Document `gh` CLI usage for AI | Docs | Low | Medium |

### Next Sprint

| Priority | Item | Type | Effort | Impact |
|----------|------|------|--------|--------|
| **P2** | Auto-generate workspace name | Code | Low | Medium |
| **P2** | `nx connect` flow guidance in MCP | Docs | Low | Medium |
| **P2** | Consistent Cloud messaging everywhere | Docs | Low | Medium |

### Future

| Priority | Item | Type | Effort | Impact |
|----------|------|------|--------|--------|
| **P3** | `nx cloud status` command | Code | Medium | Medium |
| **P3** | Cursor/Gemini detection | Code | Low | Low |
| **P4** | Prefill repo URL in connect | Code | Medium | Low |
| **P4** | Zero-click Cloud connect | Code | High | Medium |

---

## Backward Compatibility

**When AI is NOT detected:**
- CNW behaves exactly as today
- Interactive prompts work normally
- Current output format unchanged
- No breaking changes for human users

---

## Testing

Set environment variable to test AI mode:

```bash
CLAUDECODE=1 npx create-nx-workspace@latest myorg --template=nrwl/empty-template
```

---

## Additional Low-Hanging Fruits (from NXC-3815)

These items were identified in the investigation and can be addressed with minimal effort:

### Documentation/AI Instructions Only (No Code Changes)

| Item | Description | Where to Update |
|------|-------------|-----------------|
| **AI CAN use `gh` CLI** | AI incorrectly says "I cannot push". Document that it CAN use `gh repo create` and `git push`. | Nx MCP, docs |
| **`nx connect` flow** | If no git remote, AI should run `gh repo create --public <name>` then `git push -u origin main` before `nx connect` | Nx MCP, docs |
| **AI can open URLs** | AI can run `open <url>` (macOS), `xdg-open <url>` (Linux), or `start <url>` (Windows) to open Cloud connect URL | Nx MCP, docs |
| **Consistent Cloud messaging** | Always use: "70% faster CI, remote caching, green PRs, self-healing CI, distributed task execution" | Nx MCP, docs, CNW output |
| **Template preference** | Strongly instruct AI that `--template` is preferred over `--preset` for new users | Nx MCP, docs |

### Future Product Enhancements (Requires Code)

| Item | Description | Effort |
|------|-------------|--------|
| **`nx cloud status`** | New command to check if Cloud onboarding is complete (not just `nxCloudId` exists) | Medium |
| **Prefill repo URL** | Cloud connect short URL includes repo info from `git remote` | Medium |
| **Zero-click connect** | Auto-connect to Cloud without browser interaction (via token/session) | High |
| **CIPE/Trial expiry** | Surface trial expiration in CLI so AI can warn users | Medium |

---

## AI Agent Guidance for `nx connect`

When connecting an existing workspace to Nx Cloud:

### Flow When No Git Remote Exists

```bash
# 1. Check if remote exists
git remote -v

# 2. If no remote, create GitHub repo (AI CAN do this!)
gh repo create <workspace-name> --public --source=. --remote=origin

# 3. Push to remote
git push -u origin main

# 4. Now connect to Cloud
nx connect

# 5. Open the connect URL for user
open <connect-url>  # macOS
# or: xdg-open <connect-url>  # Linux
# or: start <connect-url>  # Windows
```

### Key Point for AI Agents

**AI agents CAN and SHOULD use `gh` CLI** to create repositories and push code. Do not tell users "I cannot do this for you" - just do it.

---

## References

- [NXC-3815](https://linear.app/nrwl/issue/NXC-3815) - Investigation: CNW gaps for agentic onboarding
- [Investigation Doc](https://docs.google.com/document/d/1PD8eba_q2-PXRCVQ13THy0v17MAzUifDNH7bK0Pzg5M) - Full findings
- [Cursor Terminal Docs](https://docs.cursor.com/en/agent/terminal) - `CURSOR_AGENT` env var
- [Gemini Shell Tool Docs](https://google-gemini.github.io/gemini-cli/docs/tools/shell.html) - `GEMINI_CLI=1` env var
- [Claude Code GitHub Issue #531](https://github.com/anthropics/claude-code/issues/531) - Discussion on env var detection
