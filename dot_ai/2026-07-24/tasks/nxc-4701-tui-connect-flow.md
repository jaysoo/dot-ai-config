# NXC-4701: Add connect flow to the TUI

- Linear: https://linear.app/nxdev/issue/NXC-4701/add-connect-flow-to-the-tui
- Polygraph session: https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/ready-jackal-5efe8ef1
- Worktree: `/Users/jack/projects/nx-worktrees/NXC-4701` (branch `NXC-4701`)
- Draft PR: https://github.com/nrwl/nx/pull/36460

## Goal

Four items from the ticket:

1. `<shift>+c` keybinding kicks off connect
2. Popup while the connect flow is in progress
3. Keybinding listed in the help menu
4. Inline connect flow in the perf report, embeddable into other popups

## Background

NXC-4606 (canceled 2026-07-14) built two competing prototypes:

- PR #36250 (branch `NXC-4606`, still an open draft) - footer status + standalone `ConnectPopup`
- PR #36255 (branch `NXC-4606-report-connect`, closed) - connect inside the perf report popup

NXC-4701 supersedes both and wants BOTH presentations. Neither branch was
mergeable as-is: master landed a full-width `StatusBar` component (#36263) that
moved the footer out of `tasks_list.rs` and added a focus stack + `close_popup`
sanitizer + `ModalPopup` trait, so the branches' footer work and their
`restore_focus_after_popup_close` fix were both obsolete.

## Approach

First cut: `git merge --squash origin/NXC-4606`, keep master's `tasks_list.rs`
and `app.rs` wholesale, hand-port the rest, then layer PR #36255's report
presentation on a shared state type.

**Jack's correction:** the status bar is Jason's (#36263) and was never meant to
carry a connect message; and the old branches should be inspiration, not a
source of commits. A critical pass over everything inherited followed - see
below. Branch history rewritten into two commits (telemetry extraction as a
separate no-op move, then the feature) and force-pushed with lease over the
Nx Cloud self-healing retrigger commit (verified empty first).

### What the critical pass changed

- **Dropped the `CloudConnectionStatus` napi enum.** Jason's constructor already
  took `isCloudEnabled?: boolean`, which is tri-state at the boundary
  (`undefined` was simply unused). Renamed it `isConnectedToCloud` and mapped it
  to a Rust-only `CloudConnection` enum. Removes the enum from `index.d.ts` and
  restores `native-bindings.js` to zero diff.
- **Reverted `TuiState::new` to master's arity.** NXC-4606 had added a
  constructor param; Jason's shape sets it via a setter afterwards. Restoring
  that took `inline_app.rs` and `tasks_list.rs` back to zero diff (11 call sites
  of churn removed).
- **Collapsed `Option<CloudConnection>` to `CloudConnection`** - `Disabled`
  already encodes the `None`.
- **Deduplicated the connect telemetry.** The inherited `connectToNxCloudFromTui`
  copied ~45 lines of `recordStat` boilerplate from `connectToNxCloudCommand`.
  Extracted `withConnectStats` + `connectStatMeta`, used by both; the TUI entry
  is now 5 lines. Shipped as its own commit.
- **Kept, with reasons:** a separate TUI entry point rather than a flag on
  `runConnectToNxCloud` (that function is ~75 lines of interleaved `output.*`,
  an `ora` spinner and a browser `open` - a headless mode would need guards at
  five-plus sites); the four napi methods; the `ConnectPopup` render body
  (it mirrors the other popups on master).

### Shared flow module

`components/connect_flow.rs` - `ConnectFlowState` (NotStarted/Loading/Ready/Error)
plus its two renderings:

- `detail_lines()` for a popup dedicated to connecting
- `inline_line()` for embedding under another popup's content

`CONNECT_CTA_HREF` is a sentinel href registered in a `LinkRegistry` so a
clickable CTA hit-tests like a real link; `App::activate_link` intercepts it
and starts the flow instead of opening a browser.

### Files

Rust (`packages/nx/src/native/tui/`):

- `components/connect_flow.rs` (new) - shared state + renderings
- `components/connect_popup.rs` (new) - standalone popup, implements `ModalPopup`
- `components/countdown_popup.rs` - `enable remote cache: <shift>+c` footer CTA,
  divider + URL line under the report, height/width reservation
- `components/status_bar.rs` - `cloud_connection` prop replaces `cloud_enabled`;
  `○ not connected: <shift>+c` in the middle slot with a short fallback
- `components/help_popup.rs` - conditional `<shift>+c` entry
- `app.rs` - `Focus::ConnectPopup`, key handling, `open_connect_popup`,
  `start_cloud_connect`, `set_connect_flow_state`, popup draw pass
- `lifecycle.rs` - `CloudConnectionStatus` napi enum + `registerConnectToCloudCallback`,
  `setConnectUrl`, `setConnectError`, `setCloudConnectionStatus`
- `tui_state.rs` / `tui_app.rs` - flow state + callback persisted for mode switches

TypeScript:

- `command-line/nx-cloud/connect/connect-to-nx-cloud.ts` - `connectToNxCloudFromTui()`
  (headless, returns the URL, throws on failure)
- `nx-cloud/generators/connect-to-nx-cloud/connect-to-nx-cloud.ts` - `nx-tui` added
  to the GitHub short-circuit source list
- `tasks-runner/run-command.ts` - computes the initial status, registers the callback

## Gotchas hit

- `is_cloud_enabled: bool` on `TuiState` was a second source of truth for
  "connected". Replaced by `cloud_connection_status` outright rather than kept
  alongside.
- The popup draw pass in `app.rs` lists each popup by type. A new popup that is
  only added to `components` gets focus but is never drawn - every key is then
  swallowed by an invisible modal. Cost one build cycle to find.
- Master's `close_popup(Focus)` already prunes revealed-but-inactive layers, so
  NXC-4606's `restore_focus_after_popup_close` sanitizer was not needed.
- Key-gate parity: the report's `<shift>+c` arm must carry the same
  `has_summary()` gate the other report arms do, or a stray `C` on the mid-run
  exit dialog silently creates a cloud workspace (NXC-4606 shipped that bug).
- `q` must fall through from the connect popup, and `?`/`p` must be inert while
  it is focused.

## Verification

- 349 Rust TUI tests green (14 new)
- `nx test nx`: 4685 passed, 1 failed - `watch-before-scan.spec.ts` "loses a
  write that lands between a completed scan and watch()". Fails consistently
  (3/3) but the diff touches no watcher code, and the assertion is a negative
  about macOS FSEvents in an area with a run of recent flakiness fixes. Left to
  CI to settle. NOTE: an earlier run showed 18 failures - that was self-inflicted
  by running with `NX_NO_CLOUD=true`, which suppresses every cloud
  recommendation and the cloud runner selection. Do not set it when running
  `nx test nx`.
- `nx run-many -t build,lint,lint-native -p nx` green
- Live tmux e2e in a scratch workspace (`file:` dep on this worktree,
  `NX_TUI=true`, `NX_CLOUD_API=https://staging.nx.app`): footer indicator,
  help entry, connect popup error path (no git remote) and happy path,
  report CTA + inline URL, status flip to connected mid-run.
  Proof: `.ai/2026-07-24/proof/*.png`
- Staging accepted the `nx-tui` onboarding source.

## Round 2 (Jack feedback)

- **Don't block on missing VCS.** `generateConnectUrlForTui` no longer throws
  when there's no remote; it returns `{ url, needsVcsPush }`. The popup shows the
  URL plus a nudge to create a repo (https://github.com/new). Goal is to get the
  user to the browser fast; Cloud covers VCS on its side. `NX_SKIP_CHECK_REMOTE`
  gate dropped from the TUI path (still used by the CLI `nx connect`).
- **No auto-open; `o` to open.** The browser is never opened automatically. `o`
  (or a link click) opens the URL, in both the standalone popup and the report's
  inline line. Popup footers advertise `open: o`.
- **Confirmed not using OSC 8.** The URL is a `Link`/`LinkRegistry`
  mouse-hit-test widget (Craigory's #35868, Jason's #36263) — zero escape
  sequences. OSC 8 breaks ratatui layout (issue #1028); it survives only on the
  static non-TUI perf report (`terminal-link.ts`).
- napi `setConnectUrl(url)` -> `setConnectUrl(url, needsVcsPush)`. `Ready(String)`
  -> `Ready { url, needs_vcs_push }`.
- Amended into the feature commit (kept the clean 2-commit series);
  force-pushed with lease over ANOTHER empty Nx Cloud self-healing retrigger
  (verified empty first). 350 TUI tests, live e2e re-run for the no-VCS popup +
  `o` + report `open: o`.

## Round 3 (Jason + Jack: park the status bar, keep the perf report)

Slack decision (Jason found `not connected: <shift>+c` "a little loud"; both agreed to ship the perf-report part and revisit the status bar after resource-usage lands): the connect experience lives ONLY in the perf report now.

- **Removed:** status-bar indicator (reverted `status_bar.rs`/`help_popup.rs` to master), the standalone `ConnectPopup` (deleted), the global `<shift>+c` shortcut + `Focus::ConnectPopup` + help entry. `app.rs` -290 lines.
- **Kept + enriched:** the perf report inline connect. It now shows the full flow inline - URL + VCS nudge + `open: o` - so the user never leaves the TUI (the whole point: no click-to-docs-then-figure-out-onboarding).
- **Made reusable (Jack's ask - "encapsulate local state, don't bleed into the perf report").** New `ConnectFlow` component owns its lifecycle state + connection gate, exposes `body_lines()` / `footer_hint()` / `on_key() -> ConnectFlowIntent`. The report embeds one `ConnectFlow` and delegates; side effects (spawn connect, open browser) stay in the app via the returned intent. `CountdownPopup` no longer carries loose `connect_state`/`cloud_connection` fields. Any future popup embeds `ConnectFlow` without touching the report.
- The bar's pre-existing ☁ connected-icon stays (fed from `CloudConnection::Connected`); only the NEW not-connected text went.
- Folded in 2 surviving review notes: `connectToNxCloudFromTui` JSDoc accuracy (already-connected branch resolves offline), and a doc line marking `TuiState::connect_flow_state` authoritative.
- 347 Rust TUI tests green; live e2e re-run (status bar clean, report CTA -> inline URL+VCS nudge -> `open: o`). Proof: `.ai/2026-07-24/proof/report-inline-connect.png`.

## Round 4 (Jack: drop VCS, relabel)

- "No git remote yet..." line was too long. Dropped VCS detection ENTIRELY: no `getVcsRemoteInfo` in the TUI path, no `needsVcsPush`, no nudge line. The report shows only `Finish your setup: <url>`. Cloud covers VCS in the browser.
- `open: o` -> `open link: o`.
- `ConnectFlowState::Ready { url, needs_vcs_push }` -> `Ready(String)`; napi `setConnectUrl(url, needsVcsPush)` -> `setConnectUrl(url)`; `connectToNxCloudFromTui` returns `Promise<string>` again (dropped `TuiConnectResult`).
- 346 Rust TUI tests green; live e2e confirms single URL line + `open link: o`.

## Follow-ups

- The `☁️` icon on the counts renders one cell wider than ratatui reserves,
  duplicating a character in the status line. Pre-existing on master (the icon
  landed with #36263), not touched here.
