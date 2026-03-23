# 2026-03-23 Summary

## CNW Telemetry Deep Dive

Ran comprehensive CNW stats analysis spanning March 2025 – March 2026. Key outcomes:

### Reports Generated
- **Monthly stats report**: `dot_ai/2026-03-23/tasks/cnw-monthly-stats-sep2025-mar2026.md` — 13-month trend analysis covering funnel, cloud adoption, AI vs non-AI, Nx versions
- **Raw data export**: `~/Downloads/cnw-all-events-mar2025-mar2026.tar.gz` (19MB compressed, 770K records)

### Key Findings

1. **INVALID_WORKSPACE_NAME errors**: 87% are `"."` — users trying to init in current dir. Added TODO to suggest `nx init` instead.

2. **Push to GitHub has 96.3% failure rate**: 16,426 failures vs 632 successes YTD. No timeout on the push (`spawnAndWait()` hangs indefinitely). Updated Linear issue DOC-453 with full data and code pointers.

3. **Cloud adoption timeline**:
   - Mar–Nov 2025: Stable 41-46% (CI provider prompts)
   - Dec 2025–Jan 2026: Dropped to 30-34% (CI prompts removed)
   - 22.5.4 (Mar 5-17): Restored to 43% (CI prompts brought back)
   - 22.6.x (Mar 18+): Dropped again to ~10% (`never` surged)

4. **AI agent CNW usage**: Growing from 7% (Feb) → 13% (Mar) of starts. 80%+ cloud opt-in rate vs 10-50% for humans.

5. **`yes`-only cloud rate**: ~8.5% in current 22.6.x flow — the CI provider prompt was the primary driver of cloud adoption, not the generic "yes" option.

### Linear Updates
- **DOC-453**: Updated description with full data supporting removal of push-to-github prompt
- **TODO added**: CNW hint for `nx init` when workspace name is `.`

### Data Corrections During Session
- November 2025 completions were undercounted (17K → 23.6K) due to version-prefixed CSV rows not matching `^which-ci-provider,` regex
- Legacy months (Mar–Oct 2025) only have completion events, no start/precreate/error — each CNW invocation produced exactly one event
- First `start` event appeared Nov 13, 2025
