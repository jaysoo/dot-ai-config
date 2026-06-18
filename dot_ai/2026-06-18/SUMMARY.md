# 2026-06-18 Summary

## NXC-4548 - Post-v23 Next/React upgrade paths (DRAFT PR #36031)

Branch `NXC-4548`, commit `fd55b5acbd` (single squash). Work spanned 2026-06-17..18.

### Done
- Planned the post-v23 Next/React upgrade work; posted the plan as a comment on NXC-4548.
- Implemented `@nx/next` 14->15 and `@nx/react` 18->19 upgrade paths: a `packageJsonUpdate` (gated by `requires`) + a prompt-only AI-instructions migration each, target `23.1.0-beta.0`. Caveman-lite prompts.
- Ran a thermonuclear sub-agent review of own work; cleared the prompt-migration timing concern, dropped inert `"cli": "nx"`, declined an over-defensive React `<20` bound.
- Reviewed jaysoo's PR #36028 (CLOUD-4642 UTM tracking) - the relayed review was stale; left as-is per Jack.
- Confirmed eslint-config-next@14 (v8-era) is already not generated - Leo's #36006 repointed `eslintConfigNext14Version` to `^15.5.18`.
- **Empirically tested the migration prompts** via a Workflow (8 broken fixtures, migrate-by-prompt-only offline, Next15/React19 expert judges). 7/8 correct end-state but mostly via agent's own knowledge; surfaced real gaps.
- Applied must-fix prompt edits: React propTypes-scoping error, react-test-renderer, unmountComponentAtNode/hydrateRoot arg order, provider-side legacy context; Next Pages-Router exemption, next.config renames, NextRequest.geo/.ip.
- Removed `x-prompt` from both `packageJsonUpdates` per Leo (deprecated, superseded by `--include`).

### Open
- PR #36031 still DRAFT; deferred medium/low prompt nits (useFormState->useActionState, generateMetadata, element.ref, forwardRef wording).
- Possible follow-up cleanup: collapse the now-redundant `eslintConfigNext14Version` alias + `isNext14` eslint branch in `@nx/next`.

### Notes / gotchas
- nx-cloud[bot] empty `[Self-Healing CI Rerun]` commits kept landing on the remote branch -> `--force-with-lease` stale-info; fetch + force over (collapses into squash).
- fish `$status` after a pipe reports the last pipe stage (e.g. `tail`), masking a failed `git push`; use `$pipestatus[1]`.
- `node_modules/nx` vanished mid-session; relied on JSON-parse + prettier + CI (change is non-executable).

Plan doc: `.ai/2026-06-17/tasks/nxc-4548-plan-post-v23-next-react-upgrade.md`

## Q-503 - Improve CIPE upsell CTAs across key pages (ocean, draft PR #11962)

Branch `Q-503`, commits `40efd83fa0`/`876777a966`/`1748fc51aa`/`53d8dcacfc` (+ self-healing `d83e3001e7`). Work spanned 2026-06-17..18. Polygraph session `cloud-ctas-update-8c3cbeb1`. Full detail in the architecture doc Personal Work History (2026-06-17).

### Done
- Gated sandboxing/resource-usage add-on upsell CTAs across surfaces (all hidden once entitled): bigger CIPE rotating banner with per-CTA sample graphic + "Remind me later" 1-day snooze + × dismiss, moved above Managed agents; "Protect cache integrity with sandboxing" sub-label link on the overview Cache hit rate tile and the `/runs/:runId` Cache hits tile; non-clickable Sandboxing badge on the workspaces list; "FIX WITH AI" SUI on the sandbox dashboard preview; all preview modals wrapped in `PosthogCaptureOnViewed`.
- Replaced the thin Analysis-tab resource-usage banner with `AgentResourceUsageSample` - a locked sample of the real agent table (5 linux-medium-js agents, first row -> sample charts modal, rows 2-5 blurred under a "See per-agent resource charts" prompt), rendered under Agent utilization. Data matches the modal (OOM agent over 4 GB cap) for one coherent story.
- Authored adversarial pre-PR review Workflows (correctness/DESIGN/copy/hygiene + verify) - caught a spec-coverage gap and the banned "Unlock" copy (-> "See per-agent resource charts").

### Open
- PR #11962 still DRAFT against `main`. CI running after the self-healing fix.

### Notes / gotchas
- **PR base must be `main`, not `master`** - opened against `master` first (wrong harness gitStatus hint) -> 2919 commits / 3000+ files. Fixed via GitHub UI base edit. Memory: `feedback-ocean-pr-base-is-main`.
- feature-runs can't import feature-add-on-previews (reverse dep exists) -> inline the CTA; same reason the locked sample table copies the real row markup (lib README documents this).
- Locked-row blur uses `filter: blur()` (content), not the banned `backdrop-filter`; contrast scrim is a token-based horizontal gradient (opaque center, transparent edges).
- `git add` listing already-`git rm`'d paths aborts the whole staging (fatal pathspec) - one commit captured only deletions; fixed with `--amend`.
- fish does not word-split variables: `npx prettier $FILES` passes the whole string as one arg - pass paths explicitly or use a fish list.
