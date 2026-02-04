# Colum

**Team:**
**Role:**
**Level:** L5
**Location:** UK / Ireland

## Personal

- **Partner:** (name?)
- **Children:** Daughter Molly
- **Pets:**
- **Hobbies:**

## Preferences

- **Food:**
- **Drinks:**
- **Restaurants:**

## Professional

- **Current Focus:**
- **Goals:**
- **Strengths:**

## 1:1 Notes

### Upcoming Topics

- Jason should put something in lighthouse for our metrics
- Need a way to check if the workspace is connected or not
  - CLI need a way to check
- **PR Review Goals 2026:** TTM/TTFR under 24 hours (ideally under 12 hours), encourage AI-assisted PR reviews for prioritization and summaries

### 2026-01-06

- Very against Maven plugin being gated

### 2025-12-29 - file-server SPA infinite loop fix (#33047)

**Issue:** `@nx/web:file-server` crashes when handling non-GET requests in SPA mode due to http-server's self-referential proxy causing infinite loops.

**Root cause:** http-server bug (http-party/http-server#757) - the `proxyUrl` with trailing `?` causes infinite redirect loops for PUT/POST/DELETE requests.

**Fix implemented:** Added a lightweight proxy layer that sits in front of http-server:
- http-server runs on internal port without the problematic proxy
- Our proxy rewrites 404→200 for GET requests (SPA routing works)
- Non-GET requests pass through naturally (no infinite loop)

**Branch:** `issue-33047` - ready for review

**For Nx 23:** Consider switching to `serve` package with `--single` flag as a cleaner long-term solution (breaking change).

## Random Notes
