# 2026-04-29 — Daily Summary

## Highlights

Diagnosed and fixed `@nx/s3-cache 5.0.3` panic affecting all s3-cache users. Root cause: 36-byte UUID-format value in `NX_POWERPACK_ENCRYPTION_KEY` GH secret (vs AES-256's required 32 bytes). 5.0.4 published clean after pulling the correct key from prod and bypassing Nx Cloud cache poisoning. Surfaced 6 follow-up hygiene issues.

Also captured Stefan Haas dictation (sandboxing/eBPF feature-request origin trail) and continued NXC-4401 e2e agentic Cloud onboarding planning.

## Completed today

### Issue #35455 — `@nx/s3-cache 5.0.3` tokio panic — FIXED, 5.0.4 published

- Issue: every `nx` command panics with `assertion left == right failed, left: 36, right: 32` at `generic-array-0.14.7/src/lib.rs:572:9` for any user with `@nx/s3-cache@5.0.3`. 9+ upvotes in 1 day. Night-shift had rejected as "not fixable from nrwl/nx" (correct — fix is in ocean repo).
- Root cause: `libs/nx-packages/nx-key/src/crypto.rs:37` calls `Aes256CbcDecryptor::new(encryption_key.as_bytes().into(), iv.into())`. `.into()` to `&GenericArray<u8, U32>` requires exactly 32 bytes. The 5.0.3 binary was compiled with `NX_POWERPACK_ENCRYPTION_KEY` = 36-byte UUID-format value (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
- Why 5.0.0–5.0.2 worked: compile-time env injection in the publish workflow is newer than the 1Password entry. Prior builds used the Rust fallback (32 bytes). Apr 23 publish happened to pick up the bad value.
- Reproduction: built nx-key with deliberate 36-byte env var, added length-print to crypto.rs, confirmed identical panic numbers.
- Resolution: pulled correct 32-byte key from prod API server env, updated GH secret, republished as 5.0.4 with `--skip-nx-cache` (first attempt 5.0.4-beta.1 still panicked due to Nx Cloud cache hit on `build-rust`).
- 5.0.4 verified safe for all existing customers via transitivity: 5.0.2 ↔ prod API ↔ 5.0.4 all encrypted/decrypt with same KEY_X.
- Plan: `dot_ai/2026-04-29/tasks/issue-35455-s3-cache-panic.md`

## In progress

### NXC-4401 — E2E agentic Cloud onboarding (plan)

- Working dir: `/Users/jack/projects/nx-worktrees/DOC-490` (branch `NXC-4401`)
- Plan: `dot_ai/2026-04-29/tasks/doc-490-agentic-cloud-onboarding.md`
- Goal: route `nx connect`, `nx init`, and CNW through `nx-cloud onboard connect-workspace --json` so Cloud setup stays terminal-only for AI agents.

### Stefan Haas sandboxing/eBPF dictation

- Captured origin trail for sandboxing feature request (Slack thread + GH discussion + Stefan's blog) for searchability.
- File: `dot_ai/2026-04-29/dictations/stefan-haas-sandboxing-ebpf-origin.md`

## Follow-up PRs identified (not yet filed)

1. `nx.json` `rust` namedInput needs `{ "env": "NX_POWERPACK_ENCRYPTION_KEY" }` to bust cache on key change
2. Native file cache invalidation bug in `@nx/key/index.js` — keyed only on version+basename, not content hash; re-published versions silently ignored
3. Workflow length-check guard for `NX_POWERPACK_ENCRYPTION_KEY` (`wc -c` integer is unmasked, safe to check)
4. `crypto.rs` const_assert + runtime guard returning `LicenseErrors::Invalid` instead of panicking
5. `docs/powerpack-key-rotation.md` runbook
6. Unify or remove server/client encryption fallback values (currently divergent: `'ThisMustHaveThirtyTwoCharacterss'` server vs `'cG4bnmydvFzs9xqgKoZEpAiw4ciDngds'` Rust)

Bonus discovery: 5.0.3 published with **deobfuscated** `index.js`/`native.js` — `NO_OBFUSCATE` env var appears to have leaked into the publish build (visible in 5.0.2 vs 5.0.3 tarball diff). Separate hygiene regression.

## Cleaned up

Active Claude Sessions in TODO.md: no removals (NXC-4401 still in progress in separate worktree, NXC-4355 investigation also still active).
