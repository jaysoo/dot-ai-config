# NXC-4401 — E2E Agentic Cloud Onboarding

Linear: https://linear.app/nxdev/issue/NXC-4401/e2e-agentic-cloud-onboarding (originally filed as DOC-490 by mistake — Nx CLI team, not Docs)
Milestone: 2000 CNW per day / 300 init per day
Branch: `NXC-4401` (worktree path still `nx-worktrees/DOC-490` from initial mis-filing)

## Context

`nx-cloud onboard` shipped with a JSON-mode wizard (subcommands: `connect-workspace`, `connect github`, `connect github poll`, `orgs list/create`, `repos list`, `status`) but isn't wired into the Nx CLI or CNW. Today, when an AI agent runs `nx init`, `nx connect`, or `create-nx-workspace` and the user opts into Cloud, the flow ends in a browser open — `open(connectCloudUrl)`. That breaks the terminal-only loop agents need.

Goal: in agentic mode, route Cloud setup through `nx-cloud onboard connect-workspace --json` so the whole connect flow (org pick, workspace create, GitHub link, `nx.json` write) stays in the terminal as NDJSON the agent can consume. Keep the browser flow for humans.

## Current state (verified)

- **`nx connect` handler**: `packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts:142` (`runConnectToNxCloud`). Line 208 calls `open(connectCloudUrl)` unconditionally; line 24 imports `isAiAgent` but only uses it for telemetry (line 92).
- **`nx init` agentic path**: `packages/nx/src/command-line/init/init-v2.ts:168` already detects `isAiAgent()` and emits NDJSON. Line 458 calls `initCloud('nx-init')` which delegates to `connectWorkspaceToCloud` — browser-based.
- **`initCloud` helper**: `packages/nx/src/command-line/init/implementation/utils.ts:292` — single integration point for all init flavors.
- **CNW handler**: `packages/create-nx-workspace/bin/create-nx-workspace.ts:302/399`. Cloud setup happens in `packages/create-nx-workspace/src/create-workspace.ts` at two sites:
  - Template flow line 152: `connectToNxCloudForTemplate(directory, 'create-nx-workspace', useGitHub)` → `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts:23` which dynamically `require.resolve`s `connect-to-nx-cloud` from the freshly-created workspace's `nx` package (line 29).
  - Preset flow lines 276–318: builds `connectUrl` then calls `openCloudSetupUrl(connectUrl)` at line 317 (`nx-cloud.ts:152`).
- **CNW already has agent infra**: `packages/create-nx-workspace/src/utils/ai/ai-output.ts` defines its own `isAiAgent()` (line 15), `logProgress`, `writeAiOutput`, `buildSuccessResult`. Used in `create-workspace.ts:89,93–98,278`. But neither the template nor preset cloud step branches on it for the actual connect — the browser still opens.
- **`nx-cloud` bin wrapper**: `packages/nx/bin/nx-cloud.ts:19` invokes `client.invoke(command)` against the dynamically-downloaded nx-cloud package. Subcommands and JSON contract live inside that external package.
- **`executeNxCloudCommand`**: `packages/nx/src/command-line/nx-cloud/utils.ts:28` calls `nxCloudClient.commands[name]()` with no args. Doesn't currently support passing argv to subcommands (`onboard connect-workspace --json`).
- **Reusable AI utils**: `packages/nx/src/command-line/ai/ai-output.ts` (`writeAiOutput`, `logProgress`, `buildNeedsInputResult`, `buildSuccessResult`, `buildErrorResult`, `writeErrorLog`).

## Decisions (confirmed with Jack)

- **Scope**: init + `nx connect` + CNW.
- **GitHub auth**: when `connect-workspace --json` returns `actionRequired: github_auth_needed`, surface as `needs_input` NDJSON and stop. Agent invokes `npx nx-cloud onboard connect github` itself. No inline polling.

## Proposed approach

Add a shared `runAgenticOnboard()` helper that spawns `nx-cloud onboard connect-workspace --json` as a child, streams its NDJSON, and translates terminal payloads into the existing AI-output result shapes. Wire it into the three entry points (`nx connect`, `nx init`, CNW) behind `isAiAgent()` checks. Human flows untouched.

### 1. Shared agentic-onboard helper

New file: `packages/nx/src/command-line/nx-cloud/onboard/agentic-onboard.ts` (new `onboard/` sibling folder to `connect/`, `login/`, etc. — matches `nx-cloud onboard` and leaves room for future onboard-related helpers)

- Spawns `nx-cloud` bin with argv `['onboard', 'connect-workspace', '--json', '--detect-repo', '--write-config']` (plus `--org`/`--name` if provided).
- Resolves the bin via `require.resolve('nx/bin/nx-cloud.js', { paths: [workspaceDir] })` so it picks up the workspace's nx (matters for CNW where `workspaceDir` is the just-created repo).
- Pipes child stdout line-by-line; re-emits each parsed NDJSON line through `writeAiOutput` so the agent sees one unified stream.
- Returns `{ status: 'connected', nxCloudId } | { status: 'needs_input', actionRequired, hint, nextCommand } | { status: 'error', code, message }` based on the terminal payload.
- Action mapping:
  - `actionRequired: 'login_required'` → `needs_input` with `nextCommand: 'npx nx login'`.
  - `actionRequired: 'github_auth_needed'` → `needs_input` with `nextCommand: 'npx nx-cloud onboard connect github'` and a hint pointing at `connect github poll`.
  - Terminal payload with `nxCloudId` → `connected`.
  - **Unrecognized payload shape** → write the raw line to `writeErrorLog`, return `error` with code `UNKNOWN_PAYLOAD`. The `--json` contract lives in the external nx-cloud package; defensive parsing prevents silent mistranslation when it drifts.
  - **Non-zero child exit** → `error` with stderr captured into `buildErrorResult`.
- Why a child process and not `executeNxCloudCommand`? `nxCloudClient.commands[name]()` (and `client.invoke(command)`) takes zero args — it can't pass `connect-workspace --json` to onboard's internal subcommand router. The bin reads `process.argv` directly, so spawning is the contract-stable way to invoke it without rewriting `executeNxCloudCommand`'s signature for every other consumer.

Colocated unit tests `agentic-onboard.spec.ts` mock the spawned child for the three terminal payloads.

### 2. Branch `nx connect` on `isAiAgent()`

Edit `packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts`:

- In `runConnectToNxCloud` (line 142), after the existing `isNxCloudUsed` short-circuit (line 164), insert `if (isAiAgent()) return runAgenticOnboard({ source: 'nx-connect' })` before lines 192–220 (the `connectWorkspaceToCloud` + ora spinner + `open()` block).
- Skip the spinner and `open()` calls in agent mode (they corrupt NDJSON).
- Telemetry on line 92 already records `aiAgent` — no change.

### 3. Branch `init` cloud step on `isAiAgent()`

- Edit `packages/nx/src/command-line/init/init-v2.ts:458–462`: replace the single `await initCloud('nx-init')` line with a 2-line if/else that picks `runAgenticOnboard` when `aiMode` is true, `initCloud` otherwise. `aiMode` is already in scope at line 168.
- `initCloud` itself is untouched — no `aiMode` threading, no signature change.

### 4. Branch CNW on its `isAiAgent()`

CNW has its own duplicated AI utils (`packages/create-nx-workspace/src/utils/ai/ai-output.ts`) and ships independently of `nx`. **Duplicate the small spawn helper** at `packages/create-nx-workspace/src/utils/nx/agentic-onboard.ts` — same shape, but uses CNW's local `writeAiOutput` / `buildSuccessResult` / `buildNeedsInputResult`. Cross-importing from a `node_modules/nx` resolved at runtime would couple CNW's compile-time types to whatever nx version the user happens to install, which Gemini flagged as fragile. The helper is ~50 lines of spawn+parse so duplication is cheap.

Edit `packages/create-nx-workspace/src/create-workspace.ts`:

- Template flow line 152: when `aiMode` (already computed at line 89), skip `connectToNxCloudForTemplate` and call `runAgenticOnboard({ source: 'create-nx-workspace', cwd: directory })`.
- Preset flow lines 276–318: when `aiMode`, replace the `openCloudSetupUrl(connectUrl)` (line 317) with `runAgenticOnboard({ ... })`.
- Use CNW's existing `writeAiOutput` / `logProgress` for NDJSON; the helper's output already conforms.

### 5. Tests

**Testing philosophy**: avoid mocks where possible. If a piece of behavior can't be tested without mocking, push it to e2e/manual rather than write a mock-heavy unit test.

- **Unit (`agentic-onboard.spec.ts`)**: only the pure payload-translation function. Extract `translateOnboardPayload(rawLine: string): AgenticOnboardResult` as a standalone export — no I/O, no spawning. Feed it real JSON strings (samples copied from a manual `nx-cloud onboard connect-workspace --json` run) and assert the mapped result for `connected`, `login_required`, `github_auth_needed`, malformed input. Zero mocks.
- **E2e**: covers everything that involves spawning the bin or touching the filesystem.
  - `e2e/nx-init/` or new `e2e/nx-cloud-onboard/`: `CLAUDECODE=1 nx connect` and `CLAUDECODE=1 nx init` against a fresh repo. Assert NDJSON-only stdout, no browser opened, exit code maps correctly.
  - `e2e/create-nx-workspace/`: `CLAUDECODE=1 npx create-nx-workspace ... --nxCloud=yes` for both template and preset paths.
  - These hit the real `nx-cloud` bin (or its e2e build) and exercise the full spawn/parse/translate pipeline end-to-end. No child_process mocks.
- **Manual smoke**: a one-pager in the PR description showing `CLAUDECODE=1` invocations of all three entry points with their actual NDJSON output captured.

## Files touched

- New: `packages/nx/src/command-line/nx-cloud/onboard/agentic-onboard.ts` (+ `.spec.ts`)
- New: `packages/create-nx-workspace/src/utils/nx/agentic-onboard.ts` (+ `.spec.ts`) — duplicated thin spawn wrapper using CNW's local AI utils
- Edit: `packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts:142–223`
- Edit: `packages/nx/src/command-line/init/init-v2.ts:458–462` (only — `initCloud` itself untouched)
- Edit: `packages/create-nx-workspace/src/create-workspace.ts:152` and `:276–318`
- New e2e tests under `e2e/nx-init/` and `e2e/create-nx-workspace/`

## Out of scope

- Human-mode terminal flow (`nx connect --no-browser`) — possible follow-up.
- MCP `connect_to_nx_cloud` tool — sibling ticket.
- Auto-driving `connect github` device flow — Jack confirmed `needs_input` is the right shape.

## Auth flow — corrected understanding (2026-04-30 investigation)

Investigation in ocean repo (`libs/nx-packages/client-bundle/src/lib/core/commands/login.ts:93-170`) showed that `nx login` does NOT have a workspace-state guard. It handles three URL paths:
- URL passed as arg (`npx nx-cloud login https://...`)
- Workspace has nxCloudId → uses workspace URL
- **No workspace config → prompts user (defaults to cloud.nx.app)**

The only hard gate is a legacy `accessToken` in `nx.json` (line 99 of login.ts), which doesn't apply to fresh installs. So `nx login` works fine *within an nx workspace*, even one with no cloud config.

### Why Jack's `nx login` failed earlier (resolved)

Jack tested with his global install (`/opt/homebrew/Cellar/nx/22.5.1`) and saw:
```
NX   Nx Cloud is not enabled
This command requires a connection to the full Nx platform.
```

This is `warnNotConnectedToCloud()` from `packages/nx/src/command-line/nx-cloud/utils.ts`. Tracing the published `22.5.1`'s `login.js`, there was an `isNxCloudUsed(readNxJson())` guard at the top of `loginHandler` that bailed early.

**That guard was already removed in master via PR #34728 ("fix(core): allow nx cloud commands to run outside of a workspace") by Victor on 2026-03-05, shipped in nx 22.6.0+.** Current `packages/nx/src/command-line/nx-cloud/login/login.ts` has no guard — it just delegates to `executeNxCloudCommand('login')`, identical to `nx-cloud login`.

So `nextCommand: 'npx nx login'` is correct for nx 22.6+. Users on 22.5.x or earlier need to use `npx nx-cloud login`, but that's a stale-version problem, not a wrapper-design problem.

**Real flow (works today):**
```
nx connect (agent)
├─ authed? (nxcloud.ini has PAT for target Nx Cloud URL)
│  ├─ yes → nx-cloud onboard connect-workspace --json
│  └─ no  → emit needs_input { run npx nx-cloud login first }
│           → user runs nx login → OAuth → PAT lands in nxcloud.ini
│           → user re-runs nx connect → onboard flow
```

PAT lookup canonical reference: `NxCloudGlobalConfig#getPersonalAccessTokenFromNxCloudUrl(url)` in `libs/nx-packages/client-bundle/src/lib/utilities/nx-cloud-global-config.ts:14-107`. Status check is also exposed: `npx nx-cloud login --status` exits 0 if authed.

## Follow-ups (file in ocean / sibling tickets after this ships)

- **(RESOLVED — already shipped in nx 22.6.0)** ~~`nx login` should run in any directory, not just inside an nx workspace.~~ PR #34728 (2026-03-05) added `login` to `isNxCloudCommand()` in `packages/nx/bin/nx.ts:225` and removed the `isNxCloudUsed` guard from `login.ts`. As of 22.6+, `nx login` works in any directory and matches Netlify-CLI parity. Users still on 22.5.x see the stale guard.
- **Known gap (do NOT fix in this pass):** `nx login` opens a `localhost:<port>` callback server. Fails in Docker / SSH / any env where the user's browser can't reach the CLI's localhost. Acknowledged as edge case. Future fix: paste-code fallback in `_auth.profile.login.tsx` (display opaque code instead of redirecting; CLI prompts user to paste).
- **Filed in ocean (CNW/Init Funnel project, Nx Cloud team):**
  - **CLOUD-4493** — `connect-workspace --json` payload shape inconsistencies: `actionRequired` is a heterogeneous object with nested `type` discriminator instead of a top-level enum; success payload nests `nxCloudId` under `workspace`. Both broke the wrapper translator until fixed defensively.
  - **CLOUD-4494** — `connect-workspace --json` should auto-poll the GitHub device flow internally instead of requiring the agent to chain mint → poll → connect-workspace across three processes. Each fresh `connect-workspace` call mints a new device code, orphaning prior auth.
  - **CLOUD-4495** — `npx nx-cloud onboard --help` prints `convert-to-nx-cloud-id` usage instead of the onboard subcommands. Discoverability footgun.
- **MCP tool surface for connect.** Once the JSON contract stabilizes (CLOUD-4493/4494), expose a `connect_to_nx_cloud` MCP tool so agents don't have to shell out at all.

## Testing notes

- `nx login` PAT is stored in `~/.config/nxcloud/nxcloud.ini` (sections per API URL: staging, prod). Per-workspace encryption keys live in `~/.config/nxcloud/<workspace-hash>/key.ini` separately.
- To force the `github_auth_needed` flow: needs a *fresh Nx Cloud user* (not just a fresh GitHub account). Sign up a fresh GitHub in a separate browser profile, then `nx login` from there → creates a brand-new Nx Cloud user with zero orgs and the GitHub App not yet authorized.
- To swap Nx Cloud users without nuking the existing PAT, back up `nxcloud.ini` and re-run `nx login`.

## Verification

1. **AI `nx connect`**: `CLAUDECODE=1 nx connect` in a fresh repo → stdout is NDJSON only, no browser, terminal payload includes `nxCloudId` (already authed) or `actionRequired` for login/github.
2. **AI `nx init`**: `CLAUDECODE=1 nx init --nxCloud=true` → same NDJSON contract at the cloud step.
3. **AI CNW**: `CLAUDECODE=1 npx create-nx-workspace foo --nxCloud=yes` → NDJSON only, no browser.
4. **Human mode**: each command run without `CLAUDECODE` → unchanged (browser opens, spinner shows).
5. `nx affected -t build,test,lint` clean.
6. New unit tests pass; e2es green; existing connect/init/CNW e2es still green.
