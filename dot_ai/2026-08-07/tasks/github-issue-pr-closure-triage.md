# GitHub issue + PR closure triage (nrwl/nx)

Date: 2026-08-07
Repo: nrwl/nx (read-only; nothing posted to GitHub)
Report: https://claude.ai/code/artifact/f2348ede-848e-43f7-91ee-b5367366e531
Working data: `/private/tmp/claude-501/-Users-jack-projects-nx/20c68409-.../scratchpad` (ephemeral)

## Goal

Find ~40 aging issues that can be closed. Jack's criteria: no repro/insufficient info; low
activity (<=2 reactions, <=2 non-bot comments); a workaround exists; no PR attached. Then try to
reproduce each on latest nx and mark the ones that no longer reproduce. Separately, find
low-effort PRs from first-time contributors with descriptions that do not say what they are for.

## Result

| | |
| --- | --- |
| Issues to close | 37 (32 aging backlog + 5 deprecated cache packages) |
| Unsure | 12 |
| Keep - confirmed still broken | 39 |
| PRs to close | 2 |

## Method

1. Pulled all 332 open issues + 155 open PRs via `gh ... --json`.
2. 184 issues older than 6 months. Applied the criteria -> 72 pool. Exclusions: 64 had >2
   reactions, 32 had >2 human comments, 6 an open linked PR, 5 a merged linked PR, 5 priority:high.
3. Nine agents (8 issues each) did the deep pass: full read, `git log` against master for a fix
   commit since the report, real repro on nx 23.1.1 where the toolchain allowed.
4. A tenth agent covered the 11 issues with linked PRs (Jack asked for both the open- and
   merged-PR sets after the initial exclusion).
5. Four adversarial agents then attacked the 17 weakest closures. **This changed the answer.**

## The adversarial pass is the main finding

In the first pass the same agent both ran the repro and graded it. A botched repro and a genuine
fix look identical from the inside. Handing the 17 uncorroborated "I ran it and it worked"
closures to independent agents told to *refute* them:

**13 of 17 refuted.** 8 reproduced outright on 23.1.1; 5 had a repro unfaithful to the report.
Close list went 45 -> 32.

Flipped to keep: 33974 (was 82), 34049 (76), 32098 (76), 34119 (72), 32648 (68), 32646 (62),
32381 (62), 33993 (60), 33079 (58), 33354 (62), 32595 (65). Moved to unsure: 33050, 33475.
Held or strengthened: 31228 (88->92), 33945 (84->88), 34140 (66->78), 34051 (78).

Failure modes worth remembering:
- **`CLAUDECODE=1` disables the nx TUI.** `is-tui-enabled.ts` gates on `isAiAgent()`, so a TUI
  test run from an agent session never exercises the TUI (#34049).
- **Stale cached project graph reports success.** Needs `nx reset` + `--skip-nx-cache` on the
  decisive run (#32521, #33475).
- **Wrong workspace layout.** `--preset=nest`/`--preset=ts` on 23.1.1 yields layouts where some
  bugs are structurally impossible (#32381, #34119).
- **Closing on a theory without running the build** (#32648), or **never running the repro repo
  the reporter supplied** (#32646, #33993).

## Deprecated self-hosted cache packages (Jack asked for this mid-task)

`@nx/s3-cache`, `@nx/shared-fs-cache`, `@nx/gcs-cache`, `@nx/azure-cache` and the legacy
`@nx/powerpack-*` aliases were **deprecated on npm 2026-05-21** over the CREEP cache-poisoning
vulnerability (CVE-2025-36852). nx.dev: they "will not receive updates or security patches" and
the flaw "is in the design of the packages, not in a fixable bug". No source in this repo.

Close: 35329, 34032, 34222, 33335, 32518. (34032 was keep/25 in the first pass - the deprecation
context overrode it.)

**Do not close 35424** - `@nx/key` is NOT deprecated (5.0.9 current). 9 reactions (highest in the
whole triage), priority:high, deterministic panic in a closed-source binary blocking
linux-x64-gnu. Circumstantial evidence of a hotfix: filed 2026-04-24, one day after 5.0.3;
5.0.4 shipped 2026-04-29 with two same-day betas. Needs an internal check of 5.0.4+.

Search noise: of 21 text matches across all open issues, 11 were only pasted `nx report` output
listing a licensed plugin. Not the subject.

## PRs - the ask does not apply

Only 5 open PRs predate 2026, and none fit the profile: two internal (MaxKless; the
`copilot-swe-agent` bot), three with real descriptions and multiple review rounds. Widened to all
155 open PRs and checked every author's prior merged-PR count in nrwl/nx: 44 first-time
contributors, only 2 with a thin description, and both explain their purpose. There is no
drive-by-PR backlog.

Close: **31780** (88) - author himself withdrew the approach, three change requests unaddressed.
**36102** (72) - valid complaint, wrong fix (`npm update` takes names not specs). Alive and near
mergeable: 33662, 33644. Team calls: 33412, 33389.

## Verification I did myself

Checked all 11 claimed fix commits rather than trusting the agents - every one exists and lands
in a sensible release. `2b7ba68c9e` (#36395) -> 23.1.1 matches the #30617 bisect exactly.
Corrected one error before it reached a closing comment: an agent dated the `v8-compile-cache`
removal to 17.2.0; it is 17.0.4.

## Still unverified

The 11 platform-blocked closures (Windows, EAS, dotnet, Nx-key) could not be attacked - no
toolchain on this machine. Given a 76% refutation rate on what was checkable, treat as leads.

## Incidents

Two agents mis-expanded a path variable and ran a package install from `$HOME`, creating
`~/node_modules`, `~/package.json`, `~/nx.json`, `~/.yarnrc.yml`, `~/yarn.lock`,
`~/.yarn/install-state.gz`, and **overwriting a pre-existing `~/package-lock.json` dated 2021**.
Both cleaned up; `~` verified clean and `~/.yarn/berry` (Aug 2024) intact. The 2021 lockfile is
unrecoverable. Guard added to later agent prompts: absolute `cd` + `pwd` before any install.

## Side findings worth their own tickets

- `nx add @nx/gradle` crashes on a repo without `nx.json` - `readNxJson` returns null and is
  dereferenced in `packages/gradle/src/utils/has-gradle-plugin.ts`.
- `@nx/angular-rspack-compiler` deep-imports `@angular/build/src/tools/...` without declaring
  `@angular/build`; modern `@angular/build` restricts its `exports` map, so **any** Angular+rspack
  repro repo fails to boot and reads as "not reproducible". Caused two false closures here.
- #33978's `outExtension` workaround makes `generatePackageJson` emit `"main": "./main.mjs.mjs"`.
- `kb/create-preset.mdoc` documents a CLI signature removed three years ago (cause of #34217).
- `kb/storybook-interaction-tests.mdoc` still says to install `@storybook/testing-library` and
  `@storybook/jest`, removed in Storybook 8.

## Next

Jack reviews the report and decides what to post. Nothing has been sent. Suggested order:
the 5 deprecated-cache closures first (backed by npm metadata, not a repro), then the 21 with a
verified fix commit or a survived attack, then hold the rest.
