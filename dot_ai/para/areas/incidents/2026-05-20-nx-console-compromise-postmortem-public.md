# Postmortem: Nx Console v18.95.0 supply-chain compromise

_By Jack Hsu on May 20, 2026._

> **Status (2026-05-20): Contained, investigation ongoing.**
>
> - The malicious version of `Nx Console` (v18.95.0) is no longer available from any marketplace.
> - The current published version, **18.100.0**, is safe.
> - Anyone who installed v18.95.0 during the exposure window (2026-05-18, 12:30-13:09 UTC) should treat their machine as compromised and rotate credentials.
> - The compromise originated from a single contributor's developer machine, which resolved one malicious package (`@tanstack/zod-adapter@1.166.15`) during a routine `pnpm install` seven days earlier, part of the broader [TanStack `@tanstack/*` supply-chain compromise of 2026-05-11](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem).
>
> **GitHub Security Advisory:** [GHSA-c9j4-9m59-847w](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w) > **Tracking issue:** [nrwl/nx-console#3139](https://github.com/nrwl/nx-console/issues/3139)

## TL;DR

On 2026-05-18 between 12:30 and 13:09 UTC, an attacker published a malicious `Nx Console` v18.95.0 to the Visual Studio Marketplace (live ~11 minutes) and the Open VSX registry (live ~36 minutes). The attacker authenticated the publish as a legitimate Nx core contributor. A credential-stealing payload that arrived through the [TanStack supply-chain compromise](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem) had silently exfiltrated that contributor's GitHub CLI OAuth token **seven days earlier**. Between credential theft on May 11 and the marketplace publish on May 18, the attacker was active in our GitHub audit logs (including bulk-deleting CodeQL workflow run history across multiple repositories) for **seven days, undetected.**

The first 90 seconds of the attack are worth dwelling on: **50 seconds** after the credential-stealing `pnpm install` completed, the attacker pushed a malicious commit to one of our repositories from the stolen token. **74 seconds** in, they began bulk-deleting workflow-run history to cover their tracks. This is end-to-end automation. The chain from credential theft to attacker action ran at machine speed. Any maintainer team that ran an affected `pnpm install` in the upstream window should assume the same has happened to them.

The chain that produced this incident is unusually instructive because every link except the first was at least partly in our control:

1. **Upstream**: malicious `@tanstack/*` packages published to npm on 2026-05-11.
2. **Developer machine**: a `pnpm install` ran against an external project (not belonging to `nrwl`) that had `minimum-release-age=10080` (7 days) configured, a setting designed to delay newly-published packages and block exactly this class of attack. But the project's pnpm was pinned to **10.14**, and `minimumReleaseAge` was not introduced until **pnpm 10.16**. pnpm 10.14 silently ignored the unknown config key rather than warning. The safeguard was inert. pnpm resolved the malicious package and ran its `prepare` lifecycle script.
3. **Credential exposure**: the developer had authenticated `gh` CLI locally. The payload retrieved the resulting OAuth token, which carried `repo` and `workflow` scopes across every GitHub organization the user belonged to. We have not forensically established the exact retrieval path (multiple paths existed). What we have established: the malware exercised the token against GitHub's API within 74 seconds of execution.
4. **Publish pipeline**: the Nx Console publishing workflow allowed any single core contributor to release a new version. There was no two-person approval requirement and no environment gate.
5. **Marketplace publish**: the attacker used the stolen credentials to publish v18.95.0 directly. The version was live until a maintainer received the Visual Studio Marketplace's automated upload notification and unpublished it.

The Visual Studio Marketplace reports 28 installs and 14 web downloads of v18.95.0. Open VSX reports 21 unique client IPs across 41 downloads. **Our own internal analytics indicate the number of affected users may be significantly higher**, and we are working with Microsoft to reconcile the figures. Out of caution, anyone who had Nx Console with auto-update enabled during the exposure window should assume compromise.

We are responsible for the role our software played in this incident. The publish pipeline gap that allowed it to happen is fixed. The underlying lesson drives the hardening work that follows: secondary supply-chain attacks against publishing infrastructure are a foreseeable consequence of upstream credential theft, and we must defend against the second hop as carefully as we defend against the first.

## Impact

### What the malicious extension did

The payload in v18.95.0 ran on extension activation in VS Code (or any compatible fork). On execution it:

- Wrote persistence artifacts to disk:
  - macOS: `~/Library/LaunchAgents/com.user.kitty-monitor.plist` (LaunchAgent for reboot persistence)
  - `~/.local/share/kitty/cat.py` (Python harvester)
  - `/var/tmp/.gh_update_state`, `/tmp/kitty-*` (state and staging)
  - Linux: attempted modification of `/etc/sudoers` for privilege persistence
- Harvested credentials from common locations:
  - **Vault**: `~/.vault-token`, `/etc/vault/token`, Kubernetes service-account tokens, AWS IAM auth tokens
  - **npm**: `.npmrc` tokens, OIDC token exchange
  - **AWS**: IMDS / ECS metadata service, Secrets Manager, SSM Parameter Store, Web Identity tokens
  - **GitHub**: `ghp_`/`gho_`/`ghs_` tokens from `~/.config/gh/hosts.yml`, `~/.git-credentials`, environment variables, and process memory
  - **1Password**: contents of the `op` CLI session if one was active at execution time
  - **Filesystem**: SSH private keys, `.env` files, GCP application-default credentials, Docker config
- Exfiltrated via HTTPS to attacker infrastructure, the GitHub API, and DNS-based covert channels

If you installed v18.95.0, treat **anything reachable from your machine** as exposed. Rotate every credential that was either on disk or could have been minted by `op`, `gcloud`, `aws sts`, or `gh` during the exposure window.

### Versions affected

| Package                          | Affected version  | Patched version |
| -------------------------------- | ----------------- | --------------- |
| `Nx Console` (VS Code extension) | `18.95.0` exactly | `18.100.0`      |

No earlier or later versions are affected. The version number is itself a signal: `18.95.0` was published outside our normal release sequence, which had reached `18.94.0` on 2026-04-29 and resumed at `18.100.0` after the incident.

### Install numbers

We are publishing every number we have with the uncertainty attached, because we would rather over-disclose than appear to be revising downward.

| Source                                                         | Number                                                                |
| -------------------------------------------------------------- | --------------------------------------------------------------------- |
| Visual Studio Marketplace `InstallCount` (Microsoft telemetry) | 28                                                                    |
| Visual Studio Marketplace `WebDownloadCount`                   | 14                                                                    |
| Open VSX downloads in the 36-minute window                     | 41 (across 21 unique IPs)                                             |
| Nx internal analytics: VS Code activations from v18.95.0       | Significantly higher than 28. We are not yet citing a specific number |

The discrepancy between Microsoft's number (28) and our internal activation counts is the subject of ongoing reconciliation with Microsoft. Possible explanations include (a) Microsoft's `InstallCount` excluding auto-update flows or cached marketplace mirrors, (b) our analytics counting per-workspace activations rather than per-machine installs, or (c) telemetry gaps on either side. We will publish a definitive number when we have one.

**If you had Nx Console installed in VS Code with auto-update enabled at any point during the exposure window (2026-05-18 12:30-13:09 UTC), treat your machine as potentially compromised regardless of which number is accurate.**

---

## Timeline

All times UTC.

### Pre-incident: How we lost the credential

| Time                           | Event                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-05-11 19:20-19:26         | An attacker publishes 84 malicious versions across 42 `@tanstack/*` npm packages by combining a `pull_request_target` "Pwn Request", GitHub Actions cache poisoning, and OIDC token extraction. Full details in the [TanStack postmortem](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2026-05-11 19:46               | StepSecurity researcher Ashish Kurmi publicly discloses the TanStack compromise via [TanStack/router#7383](https://github.com/TanStack/router/issues/7383). The initial disclosure lists **14 of the 42 ultimately-affected packages**. `@tanstack/zod-adapter` is not in this initial list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2026-05-11 20:43:01            | A Nx core contributor runs `pnpm install` in a monorepo worktree. The repository's `.npmrc` specifies `minimum-release-age=10080` (7 days), which would have blocked the install, but the project's `packageManager` field is pinned to a pnpm version that pre-dates that feature. The config key is silently ignored. pnpm resolves the newly-published malicious `@tanstack/zod-adapter@1.166.15` and runs its `prepare` script, which fetches and executes a 2.3 MB obfuscated credential harvester. **At this moment, the broader TanStack compromise had been public for 57 minutes, but `zod-adapter` specifically would not be flagged as malicious for approximately another 15 minutes.** The minimum-release-age safeguard, had it worked, would have blocked the install regardless. |
| 2026-05-11 ~20:58              | TanStack expands the affected-package list to cover the remaining 28 packages, including `@tanstack/zod-adapter`. By this point the malware has executed on the contributor's machine.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2026-05-11 20:43:51            | **50 seconds after the install completes**, the attacker pushes the first malicious commit using the stolen credentials. The commit adds a workflow designed to exfiltrate organization-scoped GitHub secrets when triggered. The author email is spoofed to make the commit appear to come from a trusted bot (see [Commit-author UI spoofing](#5-commit-author-ui-spoofing-and-downstream-workflow-access) below).                                                                                                                                                                                                                                                                                                                                                                             |
| 2026-05-11 20:44:15            | **74 seconds after the install completes** (24 seconds after the malicious commit), the attacker begins bulk-deleting workflow-run history. The 24-second gap is consistent with an automated pipeline waiting for the malicious workflow to execute, harvest its targets, and complete before deleting the run that would have recorded it. The token's scopes (`gist, read:org, repo, workflow`) cross every GitHub organization the contributor was a member of.                                                                                                                                                                                                                                                                                                                              |
| 2026-05-11 20:44:15 - 20:45:56 | First GitHub workflow-tampering sweep: bulk deletion of `CodeQL Analysis` workflow runs across several repos. The name `CodeQL Analysis` is likely a cover to make the workflow sound legitimate, it has nothing to do with CodeQL.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-05-11 21:34, 21:36        | The malware re-runs locally as the developer's session re-invokes `pnpm install`. Second workflow deletion sweep at 21:35:38-21:37:25.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2026-05-12 00:12:49            | [GHSA-g7cv-rxg3-hmpx](https://github.com/advisories/GHSA-g7cv-rxg3-hmpx) is published, disclosing the TanStack compromise. We do not yet realize that we were affected as our internal repos were all clear.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2026-05-15 23:56:05            | The attacker returns. The same token is used, but now from a `python-httpx/0.28.1` client, different tooling than the initial node/octokit, suggesting either credential resale, automation rotation, or a second operator. Deletes a workflow run on one of our repos.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-05-16 00:04:07            | Last observed use of the stolen token in our audit logs. The attacker's dwell time on the token is approximately **5 days and 4 hours**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Incident: Publish to marketplaces

| Time             | Event                                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-18 12:30 | Visual Studio Marketplace registers Nx Console v18.95.0 extension upload, authenticated as the compromised contributor. The upload passes Microsoft's automated verification (signing checks, manifest validation, basic malware scans).                                                                                                                    |
| 2026-05-18 12:30 | Open VSX security scan begins for v18.95.0.                                                                                                                                                                                                                                                                                                                 |
| 2026-05-18 12:33 | Open VSX scan completes and v18.95.0 goes live.                                                                                                                                                                                                                                                                                                             |
| 2026-05-18 12:36 | A maintainer receives Visual Studio Marketplace's **routine publisher-notification email**, sent automatically on every extension upload. This is not a security alert and not a user-driven escalation. It is the same notification publishers get on every legitimate release. The maintainer was not expecting a release and recognized it as anomalous. |
| 2026-05-18 12:47 | Maintainer unpublishes v18.95.0 from Visual Studio Marketplace, ~11 minutes after the email arrived and ~17 minutes after the malicious upload registered.                                                                                                                                                                                                  |
| 2026-05-18 12:48 | Visual Studio Marketplace registers the unpublish.                                                                                                                                                                                                                                                                                                          |
| 2026-05-18 13:09 | Open VSX unpublishes v18.95.0, ~36 minutes after publish. Open VSX has no equivalent publisher-notification email. The maintainer only thought to check Open VSX after handling the Visual Studio Marketplace unpublish.                                                                                                                                    |

### Detection and response

| Time             | Event                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-18 12:36 | Initial detection: the publisher-notification email from Visual Studio Marketplace reaches a maintainer who was not expecting a release. Microsoft did not catch us, Open VSX did not catch us, and no internal monitoring system caught us. We got lucky that a routine notification reached someone who was paying attention.                                                                            |
| 2026-05-18 13:58 | Internal incident Slack channel opened. Engineering and leadership convene a war room over the following ~10 minutes.                                                                                                                                                                                                                                                                                      |
| 2026-05-18 17:01 | [GHSA-c9j4-9m59-847w](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w) published. Coordinated communications via X, Discord, and direct outreach to affected users begin.                                                                                                                                                                                                       |
| 2026-05-18 18:47 | Token-rotation work begins across all repositories where the compromised `gh` CLI token had access. PRs merged to enable [GitHub deployment protection rules](https://github.com/nrwl/nx-console/settings/environments/15488714950/edit) to release workflows so they require reviewer approval. This was previously done in our main repositories such as Nx CLI, but we missed repos such as Nx Console. |
| 2026-05-18 20:53 | Microsoft confirms via existing publisher contact channels that they are working on the response and provides initial install telemetry.                                                                                                                                                                                                                                                                   |
| 2026-05-19 11:14 | Nx Console publishing pipeline hardened further to require two-admin approval (the central remediation cited in the public advisory). Other publish-capable repositories migrated to npm OIDC trusted publishing with non-triggering-user approval requirements.                                                                                                                                           |
| 2026-05-20 23:46 | Public advisory updated to acknowledge that internal analytics suggest user impact may be significantly higher than Microsoft's reported install count. This postmortem published.                                                                                                                                                                                                                         |

### Response timing

All times UTC. Detection here means the publisher-notification email reaching a maintainer (12:36 UTC).

| Milestone                             | UTC time | Time from detection |
| ------------------------------------- | -------- | ------------------- |
| Visual Studio Marketplace unpublished | 12:47    | ~11 min             |
| Open VSX unpublished                  | 13:09    | ~33 min             |
| War room convened                     | ~13:58   | ~1h 22m             |
| GitHub Security Advisory published    | 17:01    | ~4h 25m             |

---

## Root cause

There are five chained factors, ordered from most upstream to most within our control. Each was necessary. Removing any one would have broken the chain.

### 1. The TanStack `@tanstack/*` compromise (upstream)

A publishing-pipeline vulnerability in TanStack's GitHub Actions setup allowed attackers to publish 84 malicious versions across 42 packages via TanStack's legitimate OIDC trusted-publisher binding. To pnpm and to any downstream consumer, those versions carried valid npm provenance and were indistinguishable from legitimate releases. **No amount of dependency scanning would have caught this within the publish window.** The only consumer-side defense is delay-based: don't install versions published in the last _N_ hours or days. Our affected contributor's project had configured exactly that defense, which leads to the next link.

### 2. A silent `minimum-release-age` no-op

The repository where the install happened had `minimum-release-age=10080` (7 days) configured in its root `.npmrc`. pnpm 10.16 and later support this setting natively. The project's `packageManager` field, however, pinned **pnpm 10.14**, which does not support `minimum-release-age`. pnpm 10.14 silently ignores the unknown config key rather than warning or failing. The safeguard exists on paper but is inert in practice.

This is the gap that mattered most for credential exfiltration. Had pnpm been on the right version and enforced the release-age check, the install would have failed and the chain would have broken before any credentials were touched. The malicious version was 77 minutes old at the time of install. Under any non-zero release-age policy it would have been blocked.

**Lesson for any team using `minimum-release-age`**: this setting is silently no-op'd by pnpm versions older than 10.16, including versions that are otherwise current and supported. Pin your `packageManager` field to >=10.16, and add a CI guard that fails the build if the pnpm version in use is below that threshold. Do not rely on a config key being honored, verify the runtime that consumes it.

### 3. The `gh` CLI's credentials were retrievable by any local process

`gh auth login` (OAuth device flow) writes its resulting token to `~/.config/gh/hosts.yml`. From there, any process running as the user can reach the token: by direct file read, by invoking `gh auth token` as a subprocess, or by scraping the memory of a running `gh` process. We have not forensically established which of these paths the malware took. We know only that the malware retrieved the token and exercised it against GitHub's API within 74 seconds of execution.

The defense against all three paths is the same: don't let the credential persist locally in retrievable form. Tools like 1Password's `gh` plugin (`op plugin run -- gh`) inject the credential at invocation time only, so there is no file to read, no long-lived `gh` daemon to scrape, and `gh auth token` is constrained to the wrapped invocation context.

We had an internal practice of wrapping `gh` through 1Password. There was no organization-wide control verifying that contributor machines were running with the wrapper. The policy existed, the enforcement did not.

**Lesson**: the `gh` CLI is one of the highest-blast-radius credentials on a developer's machine. Wrapping it through a secret manager is the right control. Better yet, our policy now disallows the use og `gh` CLI altogether. As long as `gh auth token` exists it is an attack vector.

### 4. The Nx Console publishing pipeline allowed single-actor releases

Until this incident, any core contributor could publish a new Nx Console version without a second human's approval. There was no required-reviewer rule, no `environment` gate, and no out-of-band check that the release matched a release decision. This is the gap explicitly fixed in the public advisory.

We had previously hardened other publish-capable workflows in our organization to require approval from another person who is not the one that triggered the workflow. We had not yet extended that hardening to Nx Console. There was no good reason for the inconsistency.

**Lesson**: any pipeline that can publish to a public registry must require approval gating, full stop. The cost of the friction is small. The cost of single-actor publish is what you are reading.

---

## Detection

### How we found out

A maintainer received Visual Studio Marketplace's routine publisher-notification email at 12:36 UTC, the same kind of automated email publishers receive on every extension upload, legitimate or not. The maintainer wasn't expecting a release. They recognized it as anomalous and unpublished within 11 minutes.

This is luckier than it sounds. The email was not a security alert, was not the result of any Microsoft detection, and was not user-driven. It was the routine "your extension was just updated" notification that every publisher gets every time, and we caught it only because (a) the maintainer happened to be at their computer, (b) they read the notification rather than filtering it, and (c) they remembered that no release was scheduled. If any of those three had been different (different timezone, junk-mail filter, maintainer on PTO), the window would have been hours longer.

A user did independently file [nrwl/nx-console#3139](https://github.com/nrwl/nx-console/issues/3139) on GitHub at some point during the exposure window, but we did not see it until well after the unpublish was complete. So while users were noticing on their end, our detection-and-response timing was driven entirely by the publisher email.

Active monitoring of either the audit-log for suspicious runs and deletion would have helped. The GitHub audit-log streaming to a SIEM is enterprise-tier infrastructure that most teams (including us) don't run.

The fixable gap was earlier in the chain. The publish should have required a second approver. That's the control we've added on Nx Console, with the reviewer required to be someone other than the workflow trigger. It would have stopped the May 18 publish regardless of which contributor was compromised. Detection is useful as defense-in-depth. Prevention is the actual lesson.

### If you maintain a package and ran an affected `pnpm install`

Anyone who maintains a public package and ran `pnpm install` (without `--frozen-lockfile`) or `pnpm update @tanstack/*` against any project pulling those packages between **2026-05-11 19:20 UTC and 2026-05-12 ~17:00 UTC** is in the same exposure class our contributor was. From the time-windows above, you should expect, if you were compromised, to see in your GitHub audit logs:

- A orphaned new commit pushed to one or more of your repositories within
- Bulk deletion of workflow runs on GitHub

If any of these are present in your org's audit log, treat every credential reachable from your machine at the time as exposed and rotate immediately. **Check several days of audit history**, not just the install day. Our attacker was active for over five days before we noticed.

### Indicators of compromise

If any of these are present on a machine that had Nx Console installed during the exposure window, treat it as compromised:

- **Files on disk** (any of these):
  - `~/.local/share/kitty/cat.py`
  - `~/Library/LaunchAgents/com.user.kitty-monitor.plist`
  - `/var/tmp/.gh_update_state`
  - `/tmp/kitty-*`
- **Running processes**:
  - `python` running `cat.py`
  - any process with environment variable `__DAEMONIZED=1`
- **Linux only**: unexpected entries in `/etc/sudoers` or `/etc/sudoers.d/`
- **Affected version**: Nx Console `18.95.0` exactly. `18.100.0` is the patched version.
- **Exposure window**: 2026-05-18 12:30-13:09 UTC

If you find any of the above, rotate every credential that was on disk or in your shell environment during that window: GitHub tokens, npm tokens, SSH keys, cloud-provider credentials (AWS, GCP, Azure, Kubernetes), Vault tokens, and the contents of any `.env` file. Treat the machine as potentially still persistent and consider a full rebuild after credential rotation.

### Indicators of compromise: Upstream TanStack chain

Independent of Nx Console, anyone who ran `pnpm install` (without `--frozen-lockfile`) or `pnpm update @tanstack/*` against any project pulling those packages between **2026-05-11 19:20 UTC and 2026-05-12 ~17:00 UTC** is in the same exposure class as our contributor was. Check for:

- `tanstack_runner.js` or `router_init.js` anywhere on disk (~2.3 MB obfuscated JS, SHA-256 `2ec78d556d696e208927cc503d48e4b5eb56b31abc2870c2ed2e98d6be27fc96`)
- `~/Library/pnpm/store/v10/https+++codeload.github.com+tanstack+router+tar.gz+79ac49eedf774dd4b0cfa308722bc463cfe5885c/`
- The string `79ac49eedf774dd4b0cfa308722bc463cfe5885c` in any `package.json` or lockfile
- The string `@tanstack/setup` in `optionalDependencies` of any installed `@tanstack/*` package
- Exfiltration domains in network logs: `filev2.getsession.org`, `seed{1,2,3}.getsession.org`, `litter.catbox.moe/h8nc9u.js`, `litter.catbox.moe/7rrc6l.mjs`

---

## Lessons learned

### What went well

- **A maintainer caught the publisher-notification email within minutes.** The email was a routine "your extension was updated" notification, not a security alert, and we could have missed it.
- **Rapid coordination once detected.** From the publisher email arriving to Visual Studio Marketplace unpublish was ~11 minutes. From the war-room convening to advisory publish was ~4 hours.
- **Microsoft and Open VSX cooperated quickly.** Both marketplaces removed the version promptly when contacted, and Microsoft shared telemetry without procedural delay.
- **The contributor whose machine was compromised did the forensic work to reconstruct the chain.** Without their `pnpm` store archaeology, audit-log timeline, and IOC documentation, this postmortem would not have a root-cause story.

### What could have been better

- **We did not detect this through any system we built.** Our detection was a routine publisher-notification email reaching a maintainer who happened to read it within minutes. That's not a detection system. That's luck. Active monitoring of our audit log would have caught the suspicious activites.
- **Open VSX has no publisher-notification path.** Visual Studio Marketplace's per-upload email reached us in 6 minutes. Open VSX has no equivalent. We didn't even think to check Open VSX until after we'd handled the Visual Studio Marketplace unpublish, which is why the Open VSX window was three times as long.
- **The signals sat in our audit log for a week.** The attacker was active on our contributor's account for seven days before we noticed. Again, active monitoring for workflow run deletions and other suspicious activites in the audit log would have prevented this attack. Other organizations that may have been compromised in the same upstream chain should look back at their audit logs for the same pattern.
- **The Nx Console publishing pipeline allowed single-actor releases.** We had hardened other publish-capable pipelines in our organization to require approval from another human. We had not extended that hardening to Nx Console. Inconsistent application of a known control is a control failure.
- **Our practice of vault-wrapping `gh` was not enforced.** Wrapping `gh` invocations through a secret manager (`op plugin run -- gh` or equivalent) was internal practice. We had no tooling to verify contributor machines were running that way.

---

## What we are changing

The full action plan is being tracked internally and will be reported in a follow-up post when major items land. The headlines:

- **An approval is now required to publish Nx Console and every other public package we ship.** This is enforced via GitHub Actions environments with required reviewers. The reviewer cannot be the person who triggered the workflow.
- **`gh` CLI must be removed from developer machines.** This prevents GitHub tokens from being leaked using `gh auth token` or `~/.config/gh/hosts.yml`.
- **Monitoring of our GitHub audit log** for suspicious events: e.g. workflow-run deletions
- **Pinned GitHub Action SHAs** instead of floating refs (`@v6`, `@main`) across all repositories.

Note that many of the best practices, such as `minimum-release-age` and pinning GitHub Action SHAs, were already applied to our main repos (such as Nx CLI). We failed to apply them more broadly to all of our repos.

## Acknowledgements

We thank:

- The user who filed [nrwl/nx-console#3139](https://github.com/nrwl/nx-console/issues/3139). Your report was how some of our team first learned of the compromise, and your willingness to publicly document an unexpected install helped us understand user-side experience faster than we otherwise could have.
- Microsoft's Visual Studio Marketplace security team, for prompt removal and telemetry.
- The Open VSX team, for prompt removal.
- GitHub Security, for ongoing investigation support.
- The TanStack team, for the candor and depth of their own [postmortem](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem). Their disclosure timeline and IOC documentation made it possible for us to reconstruct the chain that reached our contributor's machine.
- StepSecurity and Socket.dev, for their public analyses of the upstream attack.

## References

- **Nx security advisory:** [GHSA-c9j4-9m59-847w](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w)
- **Tracking issue:** [nrwl/nx-console#3139](https://github.com/nrwl/nx-console/issues/3139)
- **Upstream TanStack advisory:** [GHSA-g7cv-rxg3-hmpx](https://github.com/advisories/GHSA-g7cv-rxg3-hmpx) / [CVE-2026-45321](https://nvd.nist.gov/vuln/detail/CVE-2026-45321)
- **TanStack postmortem:** https://tanstack.com/blog/npm-supply-chain-compromise-postmortem
- **StepSecurity analysis:** https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem
- **Socket.dev analysis:** https://socket.dev/blog/tanstack-npm-packages-compromised-mini-shai-hulud-supply-chain-attack
- Related research on the spoofed-bot-commit pattern: GitHub Security Lab and StepSecurity have written extensively on `dependabot[bot]` and `renovate[bot]` spoofing in earlier supply-chain incidents.

## Changelog

- **2026-05-20**: Initial publication.
