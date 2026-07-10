# Repair Neovim Blink Fuzzy Build

## Goal

Restore Blink’s native fuzzy-matching module so Neovim starts without the `blink_cmp_fuzzy` load error.

## Plan

1. [x] Inspect the installed Blink plugin and Rust toolchain to confirm the missing release artifact.
2. [x] Reinstall Blink’s native fuzzy matcher in the active Neovim data directory.
3. [x] Start Neovim headlessly and confirm Blink’s Rust fuzzy loader succeeds.
4. [x] Record the outcome and remove the task from the in-progress tracker.

## Progress

- The startup error identifies a missing `target/release/libblink_cmp_fuzzy.dylib`.
- Blink 1.7.0’s bundled `frizbee` dependency no longer compiles on the installed stable or nightly compiler because their portable-SIMD APIs have changed.
- Removed the explicit source-build hook. Blink’s release-tag installation supports a signed prebuilt macOS binary and falls back to Lua if unavailable.
- Removed the stale build-version marker, which caused Blink to mistake the missing library for an incomplete local build. Starting Neovim downloaded the v1.7.0 prebuilt `libblink_cmp_fuzzy.dylib`; Blink’s Rust loader now succeeds headlessly.

## Expected Outcome

Neovim loads Blink completion normally, with its compiled fuzzy matcher present at the expected release path.
