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

## Follow-ups

- The `☁️` icon on the counts renders one cell wider than ratatui reserves,
  duplicating a character in the status line. Pre-existing on master (the icon
  landed with #36263), not touched here.
