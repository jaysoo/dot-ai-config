# Task: Implement Exponential Backoff for NPM API Requests

## Context
- **Related Issue**: DOC-343
- **File**: `astro-docs/src/plugins/utils/plugin-stats.ts`

## Current State
The plugin stats fetching has basic rate limiting (2000ms delay between requests) but no retry logic with exponential backoff.

## Goal
Implement exponential backoff for npm API requests:
- Start with 2000ms delay between requests
- On failure (429 rate limit or 5xx error), increase delay by 1000ms and retry
- Continue increasing: 2000ms → 3000ms → 4000ms → 5000ms → 6000ms (max)
- On success, reset delay back to 2000ms for next request

## Implementation Notes

1. Create a `fetchWithBackoff` helper function that:
   - Respects the current delay before making requests
   - On success: returns response and resets delay to base (2000ms)
   - On 429/5xx: increases delay, waits, retries once
   - On retry failure: increases delay again for next call, returns null
   - On network error: increases delay, returns null

2. Update these functions to use `fetchWithBackoff`:
   - `getNpmData()` - fetches package metadata from registry.npmjs.org
   - `getNpmDownloads()` - fetches download counts from api.npmjs.org
   - `findNxRange()` - fetches @nx/devkit metadata

3. **Watch out for**: Variable name collision in `getNpmData` - there's already a `url` variable for `data.repository.url`. Use `fetchUrl` or `registryUrl` for the fetch URL.

## Testing
- Set `NX_DOCS_PLUGIN_STATS=true` and run the astro-docs build
- Watch logs for backoff messages when rate limited
- Verify stats are populated for plugins

## Status
- [ ] Not started
