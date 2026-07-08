# NXC-4606: Show "not connected" status in TUI

> UPDATE 2026-07-07 (2): v2 adversarial review (6 agents) confirmed 3 defects; 2 fixed in `3664c8d229` (Shift+C on the no-report exit dialog silently created a workspace - has_summary gate added; footer overflow past the 70-col cap - scroll hint yields to connect hint), 1 accepted (quit during in-flight connect can orphan remote workspace creation - same window as Ctrl+C during `nx connect`). 277 tests green.

> UPDATE 2026-07-07: direction revised. NEW approach (PR https://github.com/nrwl/nx/pull/36255, branch `NXC-4606-report-connect` off master): the connect flow lives in the EXISTING performance-report popup - inline "[ Enable remote cache ]" button after the remote-cache recommendation, "Enable remote cache: <shift>+c" footer hint, short URL printed centered at the bottom of the popup; connected workspaces show neither. Reuses the TS side + napi plumbing from the old branch verbatim; new Rust work is all in CountdownPopup (CloudConnectState in TuiState, sentinel href `nx-tui://enable-remote-cache` button, reserved bottom section with block/paragraph split rendering). The ORIGINAL approach below (footer status + dedicated ConnectPopup, PR #36250) stays draft for later per Jack.

- Linear: https://linear.app/nxdev/issue/NXC-4606/show-not-connected-status-in-tui
- Branch: `NXC-4606` (worktree `/Users/jack/projects/nx-worktrees/NXC-4606`)
- Polygraph session: `nxc-4606-e6f49ee0`
- Status: IMPLEMENTED + REVIEWED (2026-07-06), draft PR https://github.com/nrwl/nx/pull/36250, commits `72a049e2a1` (feature) + `9f351c2038` (review fixes)
- Adversarial review (15-agent workflow, 3 lenses + refutation-verify): 12 raw findings -> 6 real defects, all fixed in follow-up commit: (1) popup state now persisted in TuiState + rehydrated on mode switch (was: F11 stranded popup in Loading vs memoized JS promise; inline set_connect_url was a no-op), (2) focus-restore sanitizer prevents hidden-popup soft-lock (hint-over-connect Esc/Esc), (3) C retries from focused error popup, (4) q hides connect popup so exit dialog visible, (5) ?/p inert while connect popup focused, (6) C works from countdown popup in one press, (7) URL is a curated LinkRegistry link (wrapped-URL clicks open full href). Gotcha learned: `nx build nx` needed to refresh packages/nx/dist for scratch testing - build-native alone leaves stale dist binary.
- Verification: 277 Rust TUI tests green (10 new), nx build/lint/lint-native green, live tmux e2e in scratch workspace (all states incl. mid-run footer flip; staging accepted `nx-tui` onboarding source). Pre-existing machine-local `command-line-utils.spec.ts` failure (base deduced to stale SHA) fails on clean master too - not a regression. Proof PNGs: `.ai/2026-07-06/proof/tui-*.png`

## Goal

1. Footer shows Nx Cloud connection status (both states: "connected" / "not connected") when wide enough.
2. When not connected, `C` (Shift+C) opens a connect popup; shortcut listed in `?` help popup.
3. Popup runs the same logic as `nx connect` headlessly and shows the short onboarding URL; Enter opens browser, Esc dismisses. URL is clickable (existing region-snapshot link scan).

## Decisions (confirmed by Jack 2026-07-06)

- Key: **`C` (Shift+C, uppercase only)**. Lowercase `c` is copy-to-clipboard in terminal pane (terminal_pane.rs:164) and inline mode (inline_app.rs:479); `C` is bound nowhere.
- Popup UX: **URL + Enter opens browser** (no auto-open; `nx connect` auto-opens but that is jarring mid-run).
- Footer scope: **both states** - dim "Nx Cloud: connected" when connected, "Nx Cloud: not connected (press C to connect)" when not. Hidden entirely when cloud disabled (NX_NO_CLOUD / neverConnectToCloud).
- Codebase term for these overlays: **popup** (HelpPopup/CountdownPopup/HintPopup); app-level layer plumbing says "modal" (active_modal_kind etc.).

## Architecture (research summary)

Full research: `/private/tmp/claude-501/-Users-jack-projects-nx-worktrees-NXC-4606/302a422e-0d01-4201-9321-62183c048ff8/research-*.md` (footer/keys/popups/connect/bridge/cloudrefs; 6-agent workflow wf_ddd35296-56a).

- Footer = bottom rows of TasksList rect (NOT app-level). `HelpText` widget (help_text.rs) right-aligned + optional cloud slot left (`render_cloud_message`, tasks_list.rs:2683). Width logic: `BottomLayoutMode` SingleLine/TwoLine/NoCloud from constants at tasks_list.rs:49-53 (FULL_HELP_WIDTH=86 etc.).
- Cloud slot state today: `cloud_message: Option<String>` + `cloud_link: Option<(String,String)>` on TasksList + TuiState, fed from JS via napi `__setCloudMessage` / `setCloudLink` -> Action::UpdateCloudMessage/UpdateCloudLink. This is the exact pattern to copy.
- Key dispatch: hardcoded match arms in App::handle_event (app.rs:860-1398), no registry. `p`|`P` global handler at app.rs:990 is the template (guards: !interactive, !filter_mode, no popup focus). Help popup list is a hardcoded vec (help_popup.rs:163-204).
- Popup recipe (~7 app.rs touch points): new component file + Focus variant + components vec + draw order (app.rs:1724-1746) + key block + active_modal_kind/area/content_area/dismiss arms + focus_next/previous + update test `active_modal_kind_only_for_popups` (app.rs:4089).
- Rust->JS: no round-trip exists; compose two proven primitives:
  - TSFN registered from JS (mirror `registerForcedShutdownCallback`, task-orchestrator.ts:226, tui_state.rs:33).
  - JS pushes result back via napi setter (mirror `__setCloudMessage`, lifecycle.rs:726).
- Connect logic is headless-safe: `connectWorkspaceToCloud` (no prompts, writes nxCloudId via v2 create-org-and-workspace API) + `createNxCloudOnboardingURL` (never throws; long-URL fallback offline). GitHub short-circuit (generator :199-205): for `nx-connect`/`nx-console` sources with GitHub remote + !generateToken, NO workspace creation and NO nx.json write - browser GITHUB flow handles it.
- Canonical status check: `isNxCloudUsed(nxJson)` + `isNxCloudDisabled` (nx-cloud-utils.ts). NOT just nxCloudId (env tokens / legacy accessToken / custom runner count as connected).
- Mode-switch gotcha: App::with_state rehydrates exit_summary but NOT cloud_message/cloud_link - new status field must be rehydrated there.

## Implementation plan

### 1. TS: headless connect helper (additive, no refactor)

`packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts` - new exported async fn (e.g. `connectToNxCloudFromTui(): Promise<string>` returning the URL):

- readNxJson; VCS-remote gate same as runConnectToNxCloud (error message surfaces in popup Error state).
- Defensive: if already `isNxCloudUsed` -> token resolve + `createNxCloudOnboardingURL` (same as already-connected branch).
- Else `connectWorkspaceToCloud({ installationSource: 'nx-tui' })` then `createNxCloudOnboardingURL('nx-tui', token)`.
- No ora/open/sleep. recordStat telemetry mirroring connectToNxCloudCommand (distinguishable source).
- Extend the generator GitHub short-circuit list (`'nx-connect','nx-console'` -> + `'nx-tui'`) so GitHub-remote workspaces behave exactly like `nx connect` (browser flow, no premature workspace creation).
- OPEN: verify Ocean's POST /nx-cloud/onboarding accepts source `nx-tui` (url-shorten getSource passes custom sources verbatim). Failure mode is graceful (long fallback URL), but register the source server-side for analytics. Cross-repo check in ocean.

### 2. TS: status computation + wiring (run-command.ts)

In `getTerminalOutputLifeCycle` (nxJson already in scope):

- `cloudStatus = isNxCloudDisabled(nxJson) ? undefined : (isNxCloudUsed(nxJson) ? Connected : NotConnected)`.
- Pass into `AppLifeCycle` constructor (new trailing param, napi string_enum `CloudConnectionStatus`, `Option<...>` = hidden).
- Register connect callback: new napi `registerConnectToCloudCallback(cb)`; JS cb runs helper from step 1, then:
  - success: `appLifeCycle.setConnectUrl(url)`; re-check `isNxCloudUsed(readNxJson())` and push status update (new napi `setCloudConnectionStatus`) - flips footer for manual flow (nxCloudId written); GitHub flow stays not-connected until browser onboarding completes (accurate).
  - failure: `appLifeCycle.setConnectError(message)`.

### 3. Rust: state + footer

- `CloudConnectionStatus` napi string_enum (lifecycle.rs types area); field on TuiState (+ setter/getter), field on TasksList, new Action `UpdateCloudConnectionStatus`.
- Rehydrate in App::with_state (mode-switch).
- Footer render precedence in cloud slot: `cloud_link` > `cloud_message` > static status text. Status text participates in existing BottomLayoutMode width math like a plain cloud message (truncation machinery reused); connected = dim/muted, not-connected includes `(press C to connect)` hint when width allows.

### 4. Rust: keybinding + help

- App-level `Char('C')` handler modeled on `p` (app.rs:990): guards !interactive_mode, !filter_mode, no popup focused, status == NotConnected. Placed before pane forwarding so it works in all focuses.
- Opens ConnectPopup in Loading state + fires the connect TSFN.
- Help popup entry `("C", "Connect to Nx Cloud")` - conditional on NotConnected (precedent: conditional Ctrl+A block, help_popup.rs:206).
- Inline mode: OUT OF SCOPE (no cloud slot, no popups there today; `C` falls to the generic "not handled" hint).

### 5. Rust: ConnectPopup component

New `components/connect_popup.rs` modeled on hint_popup.rs (shape) + countdown_popup.rs (async content):

- States: Loading ("Generating your Nx Cloud connect URL...") -> Ready(url) | Error(message).
- Ready body: short line ("Follow the URL to finish connecting your workspace, takes about 2 minutes.") + URL + hints "enter: open in browser  esc: close". URL clickable for free via region-snapshot scan.
- Keys: Esc dismiss (restore previous_focus), Enter -> open_url_or_hint(url) (app.rs:2591), rest consumed.
- Async delivery: napi setters mutate live popup via downcast (mirror set_exit_summary, app.rs:3740) + dispatch action; popup re-renders next frame.
- Wire all app.rs touch points + update `active_modal_kind_only_for_popups` test.

### 6. Tests

- Rust (TestBackend, existing patterns in tasks_list.rs/app.rs/countdown_popup.rs tests):
  - Footer renders both statuses; hidden when None; cloud_message takes precedence; narrow-width fallback.
  - `C` opens popup only when NotConnected (ignored when Connected/None/filter/interactive).
  - Popup Loading -> Ready via setter; Esc dismiss restores focus; active_modal test updated.
- TS: unit for the headless helper (mock create-org-and-workspace + onboarding endpoints) if a spec pattern exists nearby; else rely on generator specs for the short-circuit list change.
- Build loop: `nx build-native nx --configuration local` then `nx run-many -t test,build,lint -p nx`.
- Manual: scratch workspace + `NX_TUI=true nx run-many ...`; verify not-connected footer, C popup + URL against staging (`NX_CLOUD_API`), connected workspace shows connected + C inert, NX_NO_CLOUD hides everything.

### 7. Ship

- Single squashed commit: `feat(core): show nx cloud connection status and connect popup in tui`.
- Optional 1-liner in astro-docs terminal-ui.mdoc (page currently only points at `?`); keep lean.
- Draft PR via Polygraph (`push_branch` + `create_pr`), Linear NXC-4606.

## Risks / open questions

- `nx-tui` onboarding source unknown to Ocean API -> shortener falls back to long URL (degraded, not broken). Verify/register in ocean.
- nx.json write + prettier format mid-run (same as nx connect; daemon may recompute graph - harmless).
- Uppercase-only binding is a first for the codebase (p/P matched case-insensitively); intentional since lowercase c is copy.
