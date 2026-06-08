# NXC-4453 - Update docs to account for agentic flow

Linear: https://linear.app/nxdev/issue/NXC-4453
Branch: feature/nxc-4453-update-docs-to-account-for-agentic-flow
Polygraph session: docs-agentic--migrate-de6a34c5
Reference: Leo's "nx migrate Nx 23 behavior reference" (Notion)

## Decisions (confirmed with Jack)

1. Console Migrate UI page: KEEP + lightly cross-link. No redirect, no deletion.
2. Lead command: `nx migrate` (no args) primary; `nx migrate latest` = pre-23 fallback.
3. Structure: Features hub (automate-updating-dependencies) holds deep content;
   advanced-update kept + cross-linked. No page deletions / redirects.

## Edits (DONE - commit dcf191a8c3, local only, not pushed)

- [x] installation.mdoc -> lead with `nx migrate`, Nx 23+ note, link to hub.
- [x] automate-updating-dependencies.mdoc (HUB) -> guided flow, multi-major + mode
      prompts under Step 1, "Run migrations with an AI agent" section, nx.json link.
- [x] advanced-update.mdoc -> crossing majors, --mode gating, --agentic/--validate,
      nx.json migrate defaults. Existing scenarios kept.
- [x] console-migrate-ui.mdoc -> AI badge, prompt-only/hybrid states, beta.19 gate.

## Verify (DONE)

- [x] prettier clean
- [x] vale 0 errors (1 pre-existing Oxford-comma suggestion untouched)
- [x] Markdoc tags balanced; all 6 new cross-link anchors verified
- [ ] astro-docs:build + validate-links -> BLOCKED in sandbox (maven/dotnet graph
      deps fail); runs in CI. Content itself compiles.

## Source of truth (Nx 23 behavior)

All claims verified by Leo against source. Agentic flow interactive-only.
Console agentic rendering needs nx 23.0.0-beta.19+ + updated Console ext.
