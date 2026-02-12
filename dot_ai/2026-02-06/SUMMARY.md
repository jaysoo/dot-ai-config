# Summary - February 6, 2026

## Completed Tasks

### Google Apps Script PTO Calendar: Bug Fixes

**Project:** `/Users/jack/projects/gcal/script.js`

Fixed two bugs in the daily PTO notification system:

1. **Duplicate PTO Bug**: Jack H.'s single-day PTO (Feb 6) was incorrectly appearing in both "Today" AND "Tomorrow" sections
   - **Root cause**: The `eventOverlapsDay()` function used time-based overlap logic which failed for all-day events due to timezone offset (event ends at Feb 7 05:00 UTC, which is > Feb 7 00:00 UTC day start)
   - **Fix**: Added special handling for all-day events to use date key comparison instead of time-based overlap. Calculates which days an event actually covers based on duration in days.

2. **Friday Tomorrow Section**: The "Tomorrow" section shouldn't display on Fridays since it would show Saturday
   - **Fix**: Added `isFriday` check (`today.getUTCDay() === 5`) to:
     - Skip generating tomorrow events/grouping
     - Skip the tomorrow section in the Slack message
     - Update the title text ("today" vs "today/tomorrow")
     - Update the empty message appropriately

**Files modified:**
- `script.js` - `eventOverlapsDay()` function, `formatDailySlackPayload()`, `sendEvents_()`

## Key Learnings

- Google Calendar all-day events use exclusive end times (a Feb 6 event ends at Feb 7 00:00 local time)
- When comparing all-day events across timezones, use date keys (YYYY-MM-DD) rather than timestamp comparisons
- The script uses UTC day boundaries but events include timezone offset in their timestamps
