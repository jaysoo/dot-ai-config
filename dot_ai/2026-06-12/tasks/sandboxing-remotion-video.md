# Task Sandboxing Remotion video

Goal: bespoke explainer video for Nx Cloud Task Sandboxing (https://nx.dev/docs/features/ci-features/sandboxing) in remotion-projects repo.

## Approach

- New `src/sandboxing/` following `src/cve/` bespoke-explainer pattern (mode 3 in README).
- Vector UI recreation, NOT raw screenshots — screenshots have inconsistent branches (main, fix/sandbox-violations, 11839) and counts (884, 242, 75, 35). Jack requires consistent branch + numbers.
- Theme: Nx Cloud dark zinc per DESIGN.md (zinc-950 bg, borders-first, status colors only, system font stacks, tabular-nums).

## Consistent narrative

- Branch: `feat-awesome` everywhere.
- Violations arc: 12 -> 5 -> 0. End state clean (CRITICAL).
- Beats: hero -> enable add-on toggle -> push PR, CI warning banner -> dashboard (12) -> AI agent fixes (terminal) -> push, CI re-run 12->5 -> iterate 5->0 -> green "No violations found".
- Persistent top chip `feat-awesome · N violations` ticks down, red -> green.

## Files

- src/sandboxing/palette.ts, parts.tsx, Sandboxing.tsx
- Register Sandboxing-Landscape/-Square in src/Root.tsx
