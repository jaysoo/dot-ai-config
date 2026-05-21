# Postmortem: Nx Console v18.95.0 supply-chain compromise

_By Jack Hsu on May 20, 2026._

> **Status (2026-05-20): Contained, investigation ongoing.**
>
> - The malicious version of `Nx Console` (v18.95.0) is no longer available from any marketplace.
> - The current published version, **18.100.0**, is safe.
> - Anyone who installed v18.95.0 during the exposure window (2026-05-18, 12:30–13:09 UTC) should treat their machine as compromised and rotate credentials.
> - The compromise originated from a single contributor's developer machine, which resolved one malicious package (`@tanstack/zod-adapter@1.166.15`) during a routine `pnpm install` seven days earlier — part of the broader [TanStack `@tanstack/*` supply-chain compromise of 2026-05-11](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem).
>
> **GitHub Security Advisory:** [GHSA-c9j4-9m59-847w](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w) > **Tracking issue:** [nrwl/nx-console#3139](https://github.com/nrwl/nx-console/issues/3139)

## TL;DR

On 2026-05-18 between 12:30 and 13:09 UTC, an attacker published a malicious `Nx Console` v18.95.0 to the Visual Studio Marketplace (live ~11 minutes) and the Open VSX registry (live ~36 minutes). The publish was authenticated as a legitimate Nx core contributor whose GitHub CLI OAuth token had been silently exfiltrated **seven days earlier** by a credential-stealing payload that arrived through the [TanStack supply-chain compromise](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem). Between credential theft on May 11 and the marketplace publish on May 18, the attacker was active in our GitHub audit logs — including bulk-deleting CodeQL workflow run history across multiple repositories — for **seven days, undetected.**

The first 90 seconds of the attack are worth dwelling on: **50 seconds** after the credential-stealing `pnpm install` completed, the attacker pushed a malicious commit to one of our repositories from the stolen token. **74 seconds** in, they began bulk-deleting workflow-run history to cover their tracks. This is end-to-end automation; the chain from credential theft to attacker action ran at machine speed. Any maintainer team that ran an affected `pnpm install` in the upstream window should assume the same has happened to them.

The chain that produced this incident is unusually instructive because every link except the first was at least partly in our control:

1. **Upstream**: malicious `@tanstack/*` packages published to npm on 2026-05-11.
2. **Developer machine**: a `pnpm install` ran against a project that had `minimum-release-age=10080` (7 days) configured — a setting designed to delay newly-published packages and block exactly this class of attack. But the developer's local pnpm was on version **10.14**, and `minimumReleaseAge` was not introduced until **pnpm 10.16**. pnpm 10.14 silently ignored the unknown config key rather than warning. The safeguard was inert. The malicious package was resolved and its `prepare` lifecycle script ran.
3. **Credential exposure**: the developer's `gh` CLI had been authenticated locally, and the resulting OAuth token — with `repo` and `workflow` scopes crossing every GitHub organization the user belonged to — was retrieved by the payload. The exact retrieval path is not forensically established (multiple paths existed); what is established is that the token was exercised against GitHub's API within 74 seconds of malware execution.
4. **Publish pipeline**: the Nx Console publishing workflow allowed any single core contributor to release a new version. There was no two-person approval requirement and no environment gate.
5. **Marketplace publish**: the attacker used the stolen credentials to publish v18.95.0 directly. The version was live until a maintainer received the Visual Studio Marketplace's automated upload notification and unpublished it.

The Visual Studio Marketplace reports 28 installs and 14 web downloads of v18.95.0; Open VSX reports 21 unique client IPs across 41 downloads. **Our own internal analytics indicate the number of affected users may be significantly higher**, and we are working with Microsoft to reconcile the figures. Out of caution, anyone who had Nx Console with auto-update enabled during the exposure window should assume compromise.

We are responsible for the role our software played in this incident. The publish pipeline gap that allowed it to happen is fixed; the underlying lesson — that secondary supply-chain attacks against publishing infrastructure are a foreseeable consequence of upstream credential theft, and we must defend against the second hop as carefully as we defend against the first — is the focus of the hardening work that follows.

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
| Nx internal analytics — VS Code activations from v18.95.0      | Significantly higher than 28; we are not yet citing a specific number |

The discrepancy between Microsoft's number (28) and our internal activation counts is the subject of ongoing reconciliation with Microsoft. Possible explanations include (a) Microsoft's `InstallCount` excluding auto-update flows or cached marketplace mirrors, (b) our analytics counting per-workspace activations rather than per-machine installs, or (c) telemetry gaps on either side. We will publish a definitive number when we have one.

**If you had Nx Console installed in VS Code with auto-update enabled at any point during the exposure window (2026-05-18 12:30–13:09 UTC), treat your machine as potentially compromised regardless of which number is accurate.**

---

## Timeline

All times UTC.

### Pre-incident: how the credential was stolen

| Time                           | Event                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-11 19:20–19:26         | An attacker publishes 84 malicious versions across 42 `@tanstack/*` npm packages by combining a `pull_request_target` "Pwn Request", GitHub Actions cache poisoning, and OIDC token extraction. Full details in the [TanStack postmortem](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 2026-05-11 19:46               | StepSecurity researcher Ashish Kurmi publicly discloses the TanStack compromise via [TanStack/router#7383](https://github.com/TanStack/router/issues/7383). The initial disclosure lists **14 of the 42 ultimately-affected packages**. `@tanstack/zod-adapter` is not in this initial list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 2026-05-11 20:43:01            | A Nx core contributor runs `pnpm install` in a monorepo worktree. The repository's `.npmrc` specifies `minimum-release-age=10080` (7 days), which would have blocked the install — but the project's `packageManager` field is pinned to a pnpm version that pre-dates that feature. The config key is silently ignored. pnpm resolves the newly-published malicious `@tanstack/zod-adapter@1.166.15` and runs its `prepare` script, which fetches and executes a 2.3 MB obfuscated credential harvester. **At this moment, the broader TanStack compromise had been public for 57 minutes, but `zod-adapter` specifically would not be flagged as malicious for approximately another 15 minutes.** The minimum-release-age safeguard, had it worked, would have blocked the install regardless. |
| 2026-05-11 ~20:58              | TanStack expands the affected-package list to cover the remaining 28 packages, including `@tanstack/zod-adapter`. By this point the malware has executed on the contributor's machine.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2026-05-11 20:43:51            | **50 seconds after the install completes**, the attacker pushes the first malicious commit using the stolen credentials. The commit adds a workflow designed to exfiltrate organization-scoped GitHub secrets when triggered. The author email is spoofed to make the commit appear to come from a trusted bot (see [Commit-author UI spoofing](#5-commit-author-ui-spoofing-and-downstream-workflow-access) below).                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-05-11 20:44:15            | **74 seconds after the install completes** (24 seconds after the malicious commit), the attacker begins bulk-deleting workflow-run history. The 24-second gap is consistent with an automated pipeline waiting for the malicious workflow to execute, harvest its targets, and complete before deleting the run that would have recorded it. The token's scopes (`gist, read:org, repo, workflow`) cross every GitHub organization the contributor was a member of.                                                                                                                                                                                                                                                                                                                               |
| 2026-05-11 20:44:15 – 20:45:56 | First audit-log-tampering sweep: bulk deletion of `CodeQL Analysis` workflow runs across 21 repositories in 4 GitHub organizations, completed in 101 seconds. The target set — security-scanning workflow run history specifically — is consistent with destroying the evidence trail that would otherwise correlate the malicious dependency to specific commits when GHSA-g7cv-rxg3-hmpx was eventually published.                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-05-11 21:34, 21:36        | The malware re-runs locally as the developer's session re-invokes `pnpm install`. Second deletion sweep at 21:35:38–21:37:25 (22 events in 107 seconds, slightly expanded target set).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2026-05-12 00:12:49            | [GHSA-g7cv-rxg3-hmpx](https://github.com/advisories/GHSA-g7cv-rxg3-hmpx) is published, disclosing the TanStack compromise. We do not yet realize we are personally affected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 2026-05-15 23:56:05            | The attacker returns. The same token is used, but now from a `python-httpx/0.28.1` client — different tooling than the initial node/octokit, suggesting either credential resale, automation rotation, or a second operator. Deletes a workflow run on one of our repos.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-05-16 00:04:07            | Last observed use of the stolen token in our audit logs. The attacker's dwell time on the token is approximately **5 days and 4 hours**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Incident: publish to marketplaces

| Time             | Event                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-18 12:30 | Visual Studio Marketplace registers Nx Console v18.95.0 extension upload, authenticated as the compromised contributor. The upload passes Microsoft's automated verification (signing checks, manifest validation, basic malware scans).                                                                                                                      |
| 2026-05-18 12:30 | Open VSX security scan begins for v18.95.0.                                                                                                                                                                                                                                                                                                                   |
| 2026-05-18 12:33 | Open VSX scan completes; v18.95.0 is live.                                                                                                                                                                                                                                                                                                                    |
| 2026-05-18 12:36 | A maintainer receives Visual Studio Marketplace's **routine publisher-notification email**, sent automatically on every extension upload. This is not a security alert and not a user-driven escalation — it is the same notification publishers get on every legitimate release. The maintainer was not expecting a release, and recognized it as anomalous. |
| 2026-05-18 12:47 | Maintainer unpublishes v18.95.0 from Visual Studio Marketplace, ~11 minutes after the email arrived and ~17 minutes after the malicious upload registered.                                                                                                                                                                                                    |
| 2026-05-18 12:48 | Visual Studio Marketplace registers the unpublish.                                                                                                                                                                                                                                                                                                            |
| 2026-05-18 13:09 | Open VSX unpublishes v18.95.0, ~36 minutes after publish. Open VSX has no equivalent publisher-notification email; the maintainer only thought to check Open VSX after handling the Visual Studio Marketplace unpublish.                                                                                                                                      |

### Detection and response

| Time               | Event                                                                                                                                                                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-18 12:36   | Initial detection: the publisher-notification email from Visual Studio Marketplace reaches a maintainer who was not expecting a release. We were not detected by Microsoft, by Open VSX, or by an internal monitoring system — we got lucky that a routine notification reached someone who was paying attention. |
| 2026-05-18 ~13:58  | Internal incident channel (`#tmp-github-breach`) opened; engineering and leadership convene a war room over the following ~10 minutes.                                                                                                                                                                            |
| 2026-05-18 17:01   | [GHSA-c9j4-9m59-847w](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w) published; coordinated communications via X, Discord, and direct outreach to affected users begin.                                                                                                              |
| 2026-05-18 ~20:53  | Microsoft confirms via existing publisher contact channels that they are working on the response and provides initial install telemetry.                                                                                                                                                                          |
| 2026-05-18 evening | Token-rotation work begins across all repositories where the compromised `gh` CLI token had access. Multiple PRs merged to introduce required-approval environments, environment secrets, pinned third-party action SHAs, and read-only default `GITHUB_TOKEN` permissions.                                       |
| 2026-05-19         | Nx Console publishing pipeline hardened to require two-admin approval (the central remediation cited in the public advisory). Other publish-capable repositories migrated to npm OIDC trusted publishing with non-triggering-user approval requirements.                                                          |
| 2026-05-20         | Public advisory updated to acknowledge that internal analytics suggest user impact may be significantly higher than Microsoft's reported install count. This postmortem published.                                                                                                                                |

### Response timing

All times UTC. Detection here means the publisher-notification email reaching a maintainer (12:36 UTC).

| Milestone                             | UTC time | Δ from detection |
| ------------------------------------- | -------- | ---------------- |
| Visual Studio Marketplace unpublished | 12:47    | ~11 min          |
| Open VSX unpublished                  | 13:09    | ~33 min          |
| War room convened                     | ~13:58   | ~1h 22m          |
| GitHub Security Advisory published    | 17:01    | ~4h 25m          |

The ~4h 25m advisory gap stretches because Max worked the unpublish alone for the first ~80 minutes before the broader team was looped in. From war-room convene to advisory was ~3 hours.

---

## Root cause

There are five chained factors, ordered from most upstream to most within our control. Each was necessary; removing any one would have broken the chain.

### 1. The TanStack `@tanstack/*` compromise (upstream)

A publishing-pipeline vulnerability in TanStack's GitHub Actions setup allowed attackers to publish 84 malicious versions across 42 packages via TanStack's legitimate OIDC trusted-publisher binding. To pnpm and to any downstream consumer, those versions carried valid npm provenance and were indistinguishable from legitimate releases. **No amount of dependency scanning would have caught this within the publish window.** The only consumer-side defense is delay-based: don't install versions published in the last _N_ hours or days. Our affected contributor's project had configured exactly that defense, which leads to the next link.

### 2. A silent `minimum-release-age` no-op (the gap that mattered)

The repository where the install happened had `minimum-release-age=10080` (7 days) configured in its root `.npmrc`. This setting is supported natively by pnpm 10.16 and later. The project's `packageManager` field, however, was pinned to **pnpm 10.14** — a version that the pnpm team [still considers fully supported](https://pnpm.io) and that introduced major features of its own. It is not outdated, it is not EOL, and "stay current on pnpm" was not a meaningful preventative here. The problem is more subtle: `minimum-release-age` was added in a later minor release of the same major version, and pnpm 10.14 silently ignores the unknown config key rather than warning or failing. The safeguard was on paper but inert in practice.

This is the gap that mattered most for credential exfiltration. Had pnpm enforced the release-age check, the install would have failed and the chain would have broken before any credentials were touched. The malicious version was 77 minutes old at the time of install; under any non-zero release-age policy it would have been blocked.

**Lesson for any team using `minimum-release-age`**: this setting is silently no-op'd by pnpm versions older than 10.16, including versions that are otherwise current and supported. Pin your `packageManager` field to ≥10.16, and add a CI guard that fails the build if the pnpm version in use is below that threshold. Do not rely on a config key being honored — verify the runtime that consumes it.

**Suggestion for the pnpm team**: pnpm deliberately does not warn on unknown `.npmrc` keys, because `.npmrc` is shared with npm and yarn and warning on every cross-tool key would produce excessive noise. That's a reasonable design choice and [a PR to add general unknown-key warnings was rejected on those grounds](https://github.com/pnpm/pnpm/pull/3074). What would address this specific class of failure without the noise problem is a narrower check: **detect keys that are known pnpm settings in a newer version than the one currently executing**, and warn that the running pnpm is too old to honor them. This is a forward-compat regression detector, not a general unknown-key warning. It would have produced exactly one diagnostic for the install that compromised our contributor, with no noise on any other project. We will be opening a discussion upstream to propose this.

### 3. The `gh` CLI's credentials were retrievable by any local process

`gh auth login` (OAuth device flow) writes its resulting token to `~/.config/gh/hosts.yml`. From there, the token is accessible to any process running as the user — by direct file read, by invoking `gh auth token` as a subprocess, or by scraping the memory of a running `gh` process. We have not forensically established which of these paths the malware took; we know only that the token was retrieved and used against GitHub's API within 74 seconds of malware execution.

The defense against all three paths is the same: don't let the credential persist locally in retrievable form. Tools like 1Password's `gh` plugin (`op plugin run -- gh`) inject the credential at invocation time only, so there is no file to read, no long-lived `gh` daemon to scrape, and `gh auth token` is constrained to the wrapped invocation context.

We had an internal practice of wrapping `gh` through such a tool. We did not enforce it. There was no CI check, no shell guard, and no organization-wide control verifying that contributor machines were running with the wrap. Whether the affected contributor was using the wrap at the time of the incident is still being investigated. Either way, the broader gap is the same: the policy existed, the enforcement did not.

**Lesson**: the `gh` CLI is one of the highest-blast-radius credentials on a developer's machine. Wrapping it through a secret manager is the right control. Having that as informal practice rather than enforced policy means the control is only as strong as the contributor's adherence.

### 4. The Nx Console publishing pipeline allowed single-actor releases

Until this incident, any core contributor could publish a new Nx Console version without a second human's approval. There was no required-reviewer rule, no `environment` gate, and no out-of-band check that the release matched a release decision. This is the gap explicitly fixed in the public advisory.

We had previously hardened other publish-capable workflows in our organization to require two-person approval. We had not yet extended that hardening to Nx Console. There was no good reason for the inconsistency.

**Lesson**: any pipeline that can publish to a public registry should require two-person approval, full stop. The cost of the friction is small; the cost of single-actor publish is what you are reading.

### 5. Commit-author UI spoofing and downstream workflow access

During the response we investigated whether the attacker had pushed commits that appeared more trustworthy than they were. They had. The mechanism — already documented from earlier supply-chain incidents involving `dependabot[bot]` and `renovate[bot]` spoofing — is:

1. The attacker pushes a regular, unsigned commit using their stolen token's `repo` scope.
2. They set the commit's `author/committer` email to `<bot-name>[bot]@users.noreply.github.com` — a string field that git does not enforce ownership over.
3. GitHub's UI looks up any commit whose author email matches the noreply pattern for a known bot, and renders that commit with the bot's avatar and a blue "bot" badge. **This is UI behavior, not a cryptographic claim.** The commit's actual signature is `verified: false`, but the verification reason is not surfaced in the standard commit-list view.
4. Most reviewers see the bot badge and skip the commit.

We had no policy requiring signed commits on protected branches across our organizations. We do now. This is a class of attack any maintainer team should expect and defend against.

---

## Detection

### How we found out

A maintainer received Visual Studio Marketplace's routine publisher-notification email at 12:36 UTC — the same kind of automated email publishers receive on every extension upload, legitimate or not. The maintainer wasn't expecting a release. They recognized it as anomalous and unpublished within 11 minutes.

This is luckier than it sounds. The email was not a security alert, was not the result of any Microsoft detection, and was not user-driven. It was the routine "your extension was just updated" notification that every publisher gets every time, and we caught it only because (a) the maintainer happened to be at their computer, (b) they read the notification rather than filtering it, and (c) they remembered that no release was scheduled. If any of those three had been different — different timezone, a junk-mail filter, a maintainer on PTO — the window would have been hours longer.

A user did independently file [nrwl/nx-console#3139](https://github.com/nrwl/nx-console/issues/3139) on GitHub at some point during the exposure window, but we did not see it until well after the unpublish was complete. So while users were noticing on their end, our detection-and-response timing was driven entirely by the publisher email.

**We have no internal monitoring on either (a) our own published artifacts or (b) destructive activity in our GitHub audit logs.** The attacker's deletion of 21 workflow runs in 101 seconds on May 11 was loud and trivially detectable with a real-time audit-log alert — we had none. The May 18 publish was equally detectable with a publish-monitoring webhook — we had none, and were saved only by Visual Studio Marketplace's per-publish email reaching a maintainer who happened to be alert.

This is the lesson that generalizes furthest beyond our specific incident. **Maintainers must monitor their own publishing surface actively, not rely on platform notifications.** If you ship a package to npm, the VS Code Marketplace, Open VSX, Chrome Web Store, or any other public distribution channel, you need an alert when a new version goes out that you didn't expect — one that does not depend on a human reading email in the first ten minutes.

### If you maintain a package and ran an affected `pnpm install`

Anyone who maintains a public package and ran `pnpm install` (without `--frozen-lockfile`) or `pnpm update @tanstack/*` against any project pulling those packages between **2026-05-11 19:20 UTC and 2026-05-12 ~17:00 UTC** is in the same exposure class our contributor was. From the time-windows above, you should expect — if you were compromised — to see in your GitHub audit logs:

- A new commit pushed to one or more of your repositories within ~1 minute of your install (likely adding a workflow file, often with a spoofed bot author email).
- Bulk deletion of workflow runs (often targeting `CodeQL Analysis` or similar security workflows) within ~2 minutes of your install.
- Subsequent token use from `user_agent: node` (octokit) clients in your audit log, possibly followed days later by `user_agent: python-httpx/*`.

If any of these are present, treat every credential reachable from your machine at the time as exposed and rotate immediately. **Check several days of audit history**, not just the install day — our attacker was active for over five days before we noticed.

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
- **Exposure window**: 2026-05-18 12:30–13:09 UTC

If you find any of the above, rotate every credential that was on disk or in your shell environment during that window: GitHub tokens, npm tokens, SSH keys, cloud-provider credentials (AWS, GCP, Azure, Kubernetes), Vault tokens, and the contents of any `.env` file. Treat the machine as potentially still persistent and consider a full rebuild after credential rotation.

### Indicators of compromise — upstream TanStack chain

Independent of Nx Console, anyone who ran `pnpm install` (without `--frozen-lockfile`) or `pnpm update @tanstack/*` against any project pulling those packages between **2026-05-11 19:20 UTC and 2026-05-12 ~17:00 UTC** is in the same exposure class as our contributor was. Check for:

- `tanstack_runner.js` or `router_init.js` anywhere on disk (~2.3 MB obfuscated JS, SHA-256 `2ec78d556d696e208927cc503d48e4b5eb56b31abc2870c2ed2e98d6be27fc96`)
- `~/Library/pnpm/store/v10/https+++codeload.github.com+tanstack+router+tar.gz+79ac49eedf774dd4b0cfa308722bc463cfe5885c/`
- The string `79ac49eedf774dd4b0cfa308722bc463cfe5885c` in any `package.json` or lockfile
- The string `@tanstack/setup` in `optionalDependencies` of any installed `@tanstack/*` package
- Exfiltration domains in network logs: `filev2.getsession.org`, `seed{1,2,3}.getsession.org`, `litter.catbox.moe/h8nc9u.js`, `litter.catbox.moe/7rrc6l.mjs`

---

## Lessons learned

### What went well

- **A maintainer caught the publisher-notification email within minutes.** The email was a routine "your extension was updated" notification, not a security alert, and it could easily have been missed. The fact that it wasn't reduced the Visual Studio Marketplace exposure window from "hours or days" to ~11 minutes. We were lucky, and we should not be lucky next time.
- **Rapid coordination once detected.** From the publisher email arriving to Visual Studio Marketplace unpublish was ~11 minutes. From the war-room convening to advisory publish was ~4 hours.
- **Microsoft and Open VSX cooperated quickly.** Both marketplaces removed the version promptly when contacted, and Microsoft shared telemetry without procedural delay.
- **The contributor whose machine was compromised did the forensic work to reconstruct the chain.** Without their `pnpm` store archaeology, audit-log timeline, and IOC documentation, this postmortem would not have a root-cause story.
- **Honest external communication.** Our CEO's public statement set the right tone for the response. We did not minimize the incident, we did not blame the upstream compromise, and we took responsibility for the role our software played.

### What could have been better

- **We did not detect this through any system we built.** Our detection was a routine publisher-notification email reaching a maintainer who happened to read it within minutes. That's not a detection system — that's luck. We had no real-time monitoring on either our GitHub audit log or our marketplace publish surface. Active monitoring on either would have caught the attack independent of who was reading email when. The bulk-deletion of 21 workflow runs in 101 seconds on May 11 was loud and detectable from either side — by us with audit-log monitoring (which we did not have), or by GitHub through pattern detection on destructive actions (which they do not surface to org admins). GitHub already alerts on exposed secrets and impossible-travel logins; an analogous alert on bulk workflow-run deletion would have surfaced the May 11 attack within minutes.
- **Open VSX has no publisher-notification path.** Visual Studio Marketplace's per-upload email reached us in 6 minutes. Open VSX has no equivalent. We didn't even think to check Open VSX until after we'd handled the Visual Studio Marketplace unpublish, which is why the Open VSX window was three times as long.
- **The signals were in our audit log for a week.** The attacker was active on our contributor's account for seven days before we noticed. In hindsight, the activity pattern — a flurry of bulk workflow-run deletions, then a quiet period, then a second spike from a different user-agent days later — is recognizable and would have been alertable with even a modest baseline of expected behavior. We did not have that baseline. Other organizations that may have been compromised in the same upstream chain should look back at their audit logs for the same pattern.
- **The Nx Console publishing pipeline allowed single-actor releases.** We had hardened other publish-capable pipelines in our organization to require two-person approval. We had not extended that hardening to Nx Console. Inconsistent application of a known control is a control failure.
- **Our practice of vault-wrapping `gh` was not enforced.** Wrapping `gh` invocations through a secret manager (`op plugin run -- gh` or equivalent) was internal practice. We had no tooling to verify contributor machines were running that way — no CI check, no shell guard, no audit. Whether the affected contributor was using the wrap at the time of the incident is still being confirmed. The broader gap stands regardless: a high-leverage credential-handling control was left to adherence, not enforcement.
- **Workflow `GITHUB_TOKEN` permission defaults were too broad.** Several repositories had `write-all` defaults and "Allow GitHub Actions to create and approve pull requests" enabled. These were residual defaults, not deliberate choices. We have rolled out a read-only default across all our organizations.
- **The install-number discrepancy.** Microsoft reports 28 installs; our analytics suggest the affected population is significantly larger. We are still reconciling. We should have published with explicit uncertainty in our first advisory rather than letting a precise-sounding small number set the public framing.

### What we got lucky on

- **Microsoft's upload-notification email arrived within six minutes.** If it had been delayed, or if the attacker had published outside of working hours for our maintainer team, the exposure window would have been hours rather than minutes.
- **The attacker's audit-log tampering was loud.** Deleting 21 workflow runs in 101 seconds is detectable from an audit log even days later. A more careful attacker could have deleted runs at a rate-limited pace that would have been substantially harder to reconstruct.
- **The attacker chose to publish a marketplace extension rather than push poisoned commits to our main branches.** They had `repo`-scope access for five days. The choice to use it for a single noisy publish rather than a slow-rolling code injection was the attacker's, not ours. We benefited from that choice; we should not count on it next time.

---

## What we are changing

The full action plan is being tracked internally and will be reported in a follow-up post when major items land. The headlines:

- **Two-person approval is now required to publish Nx Console and every other public package we ship.** This is enforced via GitHub Actions environments with required reviewers; the reviewer cannot be the person who triggered the workflow.
- **`gh` CLI is migrating to 1Password (or equivalent secret-manager) integration across all maintainer machines.** No long-lived OAuth tokens in cleartext on disk.
- **Required signed commits on protected branches** across all our public organizations, with bot commits verified via `verified: true` rather than email-pattern matching.
- **Real-time alerting on our GitHub audit log** for high-risk events: bulk workflow-run deletion, unexpected secret access, off-hours pushes to protected branches.
- **Real-time alerting on our marketplace publishes** for every package we ship publicly, cross-referenced against internal release decisions.
- **`minimum-release-age` policy enforced via CI** in all our internal monorepos, with the consuming pnpm version held to ≥10.16 by a CI guard that fails the build otherwise.
- **Read-only `GITHUB_TOKEN` defaults** confirmed across every repository in every organization we own; per-job elevation only where justified.
- **Pinned third-party Action SHAs** instead of floating refs (`@v6`, `@main`) across all repositories.

We will also be advocating, externally, for three things we cannot fix alone:

1. **Marketplace publish-notification parity.** Visual Studio Marketplace sends publishers a routine email on every extension upload. That email is what saved us — not because it's a security feature, but because it's the one signal that reaches a human in real time when something is published in their name. Open VSX has no equivalent notification, which is why our Open VSX exposure window was three times as long. Every extension marketplace should send publishers an automated upload-confirmation email by default. This is a low-cost change with outsized detection value, and we hope Open VSX (and any other marketplace publishing-platform) adopts it.
2. **End-to-end provenance for VS Code extensions.** Both Visual Studio Marketplace and Open VSX should support publisher-attested provenance attestations that survive the marketplace's signing layer. Today, an extension's provenance ends at the publisher's machine; the marketplace re-signs and re-distributes. A user has no cryptographic way to verify that the bytes they install were the bytes the maintainer published.
3. **Restrict GitHub workflow run deletion to opt-in.** GitHub currently allows any user with write access to delete workflow runs. The deletion is recorded in the audit log, but the action itself is permitted, unalerted, irreversible, and removes the deleted run from the Actions UI entirely. The attacker deleted 21 workflow runs in 101 seconds across 21 of our repositories; we discovered this six days later, only because we went looking.

   This matters more than it sounds, because **the Actions UI is one of the few places a maintainer might have noticed something was wrong**. An unexpected `CodeQL Analysis` workflow run from an unfamiliar commit, sitting in our Actions feed for five days, might have caught the eye of someone scanning the feed during a normal workday — or it might not have. We can't know. What we do know is that deletion removed any possibility of noticing. Retention behind an audit-log lookup is not a substitute: nobody routinely reads the audit log, and nobody knew to look.

   The legitimate use cases for workflow-run deletion are narrow — accidentally logged secrets (which [GitHub's own guidance](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) says to handle by rotation, not deletion), GDPR/privacy requests, occasional cleanup of obviously broken runs from forks. These are real but uncommon and could be served by an explicit opt-in. The illegitimate use case — destroying evidence after a credential compromise — is exactly what we experienced, and what every other organization affected by the upstream `@tanstack/*` chain is at risk of experiencing.

   We are asking GitHub for three changes, in priority order:

   (a) **Workflow-run deletion should be disabled by default**, configurable as an org-level setting (with repo-level override). Teams that have a real need can opt in explicitly. The setting change itself should produce a high-visibility audit log entry. The current default — anyone with write access can delete, no questions asked — inverts the safe choice.

   (b) **Real-time alerts to org admins** on workflow-run deletion events (where deletion is enabled at all), and on the setting being toggled on, the same way GitHub already alerts on exposed secrets and impossible-travel logins.

   (c) **Bulk-deletion detection** as an additional layer: a single deletion may be legitimate, but 21 deletions across 21 repos in 101 seconds is not, regardless of who initiated it. This pattern should be alerted regardless of the per-repo setting.

   This is one of the most impactful platform-level changes we can think of for the class of attack we experienced, and we believe it would help any organization caught in the same pattern.

## Open questions

These remain under investigation. We will update this postmortem as we learn more.

- **What is the true affected-user count?** Microsoft's `InstallCount` and our internal analytics disagree by approximately two orders of magnitude. We are working with Microsoft to reconcile. Until then, the conservative answer is "treat any machine that had Nx Console with auto-update enabled in the exposure window as potentially affected."
- **Did any cached marketplace mirror or enterprise proxy serve v18.95.0 after our unpublish?** Some Visual Studio Marketplace mirrors and corporate proxies cache extension downloads. We do not know whether any served the malicious version after we unpublished it.
- **What did the attacker `read` during the five-day dwell window?** GitHub audit logs capture destructive actions but not reads. Anything the stolen token's scopes (`repo, workflow, read:org, gist`) granted access to must be assumed potentially read.
- **Was credential resale involved?** The tooling shift mid-dwell (`node`/octokit → `python-httpx/0.28.1`) suggests either the same operator changed tools, the token was sold, or multiple operators shared it. We cannot distinguish from our logs alone.
- **How many other maintainer teams were affected by the same upstream chain?** The TanStack compromise was broad. The contributor whose machine was compromised in this incident is unlikely to have been the only maintainer of a published package who ran a `pnpm install` in the 77-minute window before the upstream advisory. If you maintain a public package and ran a non-frozen `pnpm install` against any `@tanstack/*`-using project between 2026-05-11 19:20 UTC and 2026-05-12 17:00 UTC, please check your audit logs for unfamiliar activity on credentials that were on disk at that time.

## Acknowledgements

We thank:

- The user who filed [nrwl/nx-console#3139](https://github.com/nrwl/nx-console/issues/3139) — your report was how some of our team first learned of the compromise, and your willingness to publicly document an unexpected install helped us understand user-side experience faster than we otherwise could have.
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

- **2026-05-20** — Initial publication.
