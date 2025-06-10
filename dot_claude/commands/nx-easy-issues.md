# Nx: Easy Issues

This command helps find GitHub issues that are easy to resolve and close for the current repo.

The ideal candidates are stale issues that can be closed without code changes.

You can use the `gh` CLI command to find **open** issues. Note, do not care about closed issues (i.e. state is closed).

_I'll_ provide _YOU_ with a date range to check and you should convert it to `yyyy-mm-dd..yyyy-mm-dd` so `gh` can filter from it. If I do not provide a date range, then assume it is for the past year.

## Criteria for "easiness" of issues

An issue is easy if it fits the following criteria:

Resolution Readiness:

- There is a reproduction linked in the description or one of the comments (a repro must be a link to a public GitHub repo).
- Issues that only require updating dependencies
- Issues with consensus on the solution approach
- Issues that are duplicates of already-fixed problems
- Issues with workarounds already posted
- Issues resolved by recent commits but not yet closed

Technical Complexity:
- Documentation-only fixes (typos, broken links, outdated examples)
- Issues with clear error messages or stack traces
- Configuration or setup issues with known solutions
- Issues affecting only examples or demo projects
- Single-line or small code changes (< 10 lines)
- Issues already diagnosed with root cause identified

User Impact:
- Edge case issues affecting very few users
- Issues only occurring in outdated versions

Staleness:
- The issue is older than 6 months old (this is less important, but generally older issues may be stale).
- There are not much engagements in terms of reactions or comments (less than 5 reactions and less than 5 comments). 
- There is an open pull-request attached to the issue.

## CRITICAL:

Store a file `.ai/yyyy-mm-dd/tasks/nx-easy-issues-[theme].md` where `yyyy-mm-dd` is today's datestamp. You can use `dot_ai` if `.ai` is not a folder under current repo root. Replace `[theme]` with the general them, like `react-issues`, `stale-issues`, or whatever you can come up with. If you cannot find a theme, just leave it off. ALSO, keep ALL files under teh same tasks folder so we don't pollute the repo.
