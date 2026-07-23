# DOC-552: Investigate preserving Knowledge Base last-modified dates

## Goal

Show the last commit that changed each article before the bulk move into `astro-docs/src/content/docs/kb`, while allowing future KB edits to become the new last-modified date.

## Plan

- [x] Confirm Git rename detection can follow representative KB files to their prior locations.
- [x] Prototype a build-time Git helper that ignores only the commit introducing a file into `docs/kb`.
- [x] Verify representative dates, formatting, build, links, Vale, and prepush validation in the full local clone.
- [x] Test the helper in a depth-one clone matching the deploy environment.
- [x] Remove the prototype after confirming it cannot recover pre-move history in the deploy checkout.
- [x] Push the reviewed DOC-552 commit without the unsafe prototype and record the limitation in Polygraph.

## Decision

Do not use filesystem mtimes. Git does not persist them across clones or deploys. A full local clone can follow rename records and recover the original dates, but Netlify's shallow checkout cannot. Preserving pre-move dates requires a separate decision between durable article metadata and fetching deeper Git history during the build.
