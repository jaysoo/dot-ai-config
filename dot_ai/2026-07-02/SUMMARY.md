# 2026-07-02 Summary

## Q-520: Sandbox dashboard toggle for add-on requests (ocean) - IMPLEMENTED, not pushed

Branch `Q-520` in `/Users/jack/projects/ocean-worktrees/Q-520` (on main @ 4b866ef098), 5 commits local:

1. `8c32c5fe0b feat(nx-api)`: member add-on feature request endpoint + admin emails (Mandrill template `nx-cloud-plan-add-on-requested`)
2. `a86d4913e5 feat(data-access-api)`: TS model + active-request query
3. `bbf23ce82c feat(feature-analytics)`: SandboxAddOnToggle UI + loader state + request action + version plan (nx-cloud: minor)
4. `11df4d4ac9 chore(testing)`: e2e spec + MSW request-feature mock + typed e2e collection
5. `5d531dac77 fix(nx-api)`: atomic cooldown (one doc per org+feature + unique index + conditional upsert) - from external review P2/P3

**Feature:** toggle at top of Sandbox violations dashboard. Admin: blue confirm dialog -> existing provision flow (always enables DEDICATED_COMPUTE_CLUSTER too - TS entitlement needs both; modal discloses $99/mo committed spend when cluster new); cancel (red, endAt = period end, "Ends <date>" + unchecked switch) and resume mirror add-ons form semantics. Member: same dialog with "Request add-on" -> Remix action -> nx-api private `POST /plan-add-on/v1/request-feature` -> persist + email all verified org admins. Requested state org-wide, 48h window (Jack: intentional, not thread's "3 days"), disabled switch + "Requested" + tooltip with requester name/timestamp; admins see it too. Hidden for: FREE/OSS/ENTERPRISE, private-enterprise, automated_add_ons off, anonymous/non-members, entitled non-admins.

**Process:** planned via 7-agent recon workflow (6 parallel readers + gap critic, ~780k tokens) which caught the 4 decision-blocking facts pre-code: cluster entitlement coupling, provision action's absent-keys-are-cancellations diff, loader max-age=3600 caching vs per-user state, no plan gating server-side in provision chain. All 4 product decisions confirmed via AskUserQuestion before build.

**Verification:** tsc -b clean; unit suites 38/41/43 green; gradle compile green (after discovering earlier "clean" was a masked pipe failure - task path is `:nx-api:compileKotlin` NOT `:apps:nx-api:...`); new Kotlin repo test 4/4 vs real Mongo; committed Playwright e2e passed twice locally (admin enable + member request cross-user); 9 UI-state screenshots via throwaway playwright spec using e2e fixtures -> `dot_ai/2026-07-02/tasks/q520-shots/`.

**Applied repo skills** (Jack pointed mid-session): `.claude/skills/altan-review` + `arrow-kt-patterns` -> restructured claim (no raise inside try, ensureNotNull), layering conforms.

**Pending:** Jack uploads Mandrill template (draft: `tasks/q-520-mandrill-template-draft.md`), then push + draft PR (base = main).

Files: `tasks/q-520-sandbox-dashboard-add-on-toggle.md` (plan), `tasks/q-520-mandrill-template-draft.md`, `tasks/q520-shots/*.png`. Polygraph session `q-520-add-on-toggle-ee2a2bed` (nx + ocean repos, description current).

## Mistakes / corrections (this session)

- **Claimed "Kotlin compiles clean" from `gradlew ... | tail` exit 0** - the pipe masked a "project 'apps' not found" BUILD FAILED. Same class as the fish `$pipestatus` trap already in CLAUDE.md; recurred via zsh + background task summary showing the pipeline's exit. Fix applied: redirect to log + check `$?` directly.
- Forgot ocean repo-local skills (`.claude/skills/altan-review`, `arrow-kt-patterns`, `nx-api-*`) until Jack pointed them out after Kotlin was written.
- Screenshots sent only as chat attachments; Jack asked "where are the screenshots" - also give a disk path.
- Pre-started `nx serve nx-cloud --configuration=e2e` before `nx run nx-cloud-e2e-playwright:e2e` - playwright boots its own server and errors on the occupied port (`reuseExistingServer: isCI`).
