# DOC-552: Keep the Knowledge Base validator session-local

## Status

Complete locally. The amended commit has not been force-pushed.

## Goal

Remove the one-time DOC-552 migration validator and its Nx target from the branch while retaining a runnable local audit script for this session.

## Decision

The validator checks fixed migration facts such as the 187-article inventory and 213 redirects. Those checks were useful while restructuring the Knowledge Base, but they are too specific to make every future `astro-docs:test` run own this migration indefinitely.

Keep the Netlify configuration in the build cache inputs because redirect changes must still invalidate the production build.

## Plan

- [x] Confirm how the validator is wired into the resolved `astro-docs` targets.
- [x] Move the script into session-local task notes and make it runnable from the workspace root.
- [x] Remove the `validate-kb` target and `astro-docs:test` dependency.
- [x] Run the local audit and the normal `astro-docs` validation suite.
- [x] Amend the existing draft commit locally; leave the force-push for explicit approval.
- [x] Update the Polygraph session description with the local/remote distinction.

## Result

- The committed `astro-docs/scripts/validate-knowledge-base.mjs` file and `validate-kb` Nx target are removed.
- The runnable local audit lives at `dot_ai/2026-07-20/tasks/validate-knowledge-base.mjs` and accepts the workspace root as its optional argument.
- The amended local commit is `5d1f182b40`; the draft PR still points at `040191bf88` until the branch is force-pushed.
- The local audit, `astro-docs` test/build/lint suite, cache configuration review, and repository pre-push gate pass.
