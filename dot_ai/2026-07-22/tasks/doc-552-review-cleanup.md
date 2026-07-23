# DOC-552 review cleanup

## Goal

Remove the temporary Knowledge Base metadata snapshots and breadcrumb overrides, while preserving featured articles and accurate last-modified dates through content frontmatter and Starlight's Git metadata.

## Plan

- Add a `featured` field to the docs schema and mark the six featured KB articles in frontmatter.
- Read KB last-modified dates from Starlight's Git metadata, which is also used by the page footer.
- Delete the KB config/date snapshots and custom last-updated middleware.
- Remove obsolete KB breadcrumb href overrides.
- Format, build, test, run pre-push validation, and amend the existing squashed commit.

## Verification

- No references remain to the deleted snapshots or middleware.
- The KB index renders six featured articles.
- KB lists sort using the newest committed file change.
- The Astro docs build and validation suite pass.
