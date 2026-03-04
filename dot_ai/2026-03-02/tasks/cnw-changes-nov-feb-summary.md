# CNW (Create Nx Workspace) Changes: Nov 2025 - Feb 2026

## 1. Template-Based Onboarding (Nov 2025)

**Motivation:** Replace the old preset-based flow with GitHub template repos for faster, more maintainable onboarding.

- **NXC-3355 / NXC-3464**: Shipped `--template` flag for CNW, cloning from `nrwl/*` GitHub repos (empty, typescript, react, angular). Templates include CI config, README, and Nx Cloud setup out of the box. Preset flow was kept as fallback for custom presets.
- PR review rounds with Victor and Nicole on messaging, error handling, and UX polish (Nov 21, Dec 2-3).
- Merged Dec 3, 2025.

## 2. A/B Testing & Flow Variants

**Motivation:** Optimize Cloud adoption rates by testing different flows, prompt copy, and success messages.

The `flowVariant` system went through two phases, testing progressively bigger questions. Each variant was cached to disk with expiry so users get a consistent experience across runs.

### Phase 1: Template vs Preset Flow (Nov-Dec 2025)

The question: **should CNW clone a GitHub template repo or run the traditional preset-based scaffolding?**

| Variant | Flow | What Happens |
|---------|------|-------------|
| 0 | Preset (legacy) | Runs generators locally. User picks a preset (react, angular, etc.), Nx scaffolds files in-process. |
| 1 | Template (new) | Clones a pre-built GitHub repo (`nrwl/react-template`, etc.). Faster, includes CI config and README out of the box. |

50/50 split. **Template flow won and was locked in** - preset flow removed as the default path.

Within each flow, there were also independently randomized **micro-level A/B tests** on the specific wording shown to users:

- **Prompt copy** (3 variants in `setupNxCloudSimple`): "Get to green PRs faster...", "Enable remote caching...", "Speed up CI and reduce compute..."
- **Success message** (3 variants in `messages.ts`): "Connect to Nx Cloud to complete setup", "One more step: activate remote caching", "Almost done! Finish Nx Cloud setup"

A user could get flow variant 0 + prompt copy v2 + success message v3 - giving a full matrix. Prompt variant tracked via `recordStat()`, success message variant tracked via Cloud short URL meta property.

### Phase 2: Cloud Prompt Behavior (Jan-Feb 2026)

Once templates became the default, `flowVariant` was repurposed to test **how (or whether) to prompt for Nx Cloud**. The question: **does asking fewer questions drive more Cloud connections?**

| Variant | Cloud Prompt | What User Sees | Completion Message | Cloud Config |
|---------|-------------|----------------|-------------------|-------------|
| 0 | "Try the full Nx platform?" | Yes/No prompt | `platform-setup`: "Connect to Nx Cloud to complete setup" | `nxCloudId` written to nx.json if yes |
| 1 | "Would you like remote caching to make your build faster?" | Yes/No prompt (different copy) | `cache-setup`: "One more step: activate remote caching" | `nxCloudId` written to nx.json if yes |
| 2 | No prompt at all | Nothing - skips to workspace creation | `platform-promo`: "Want faster builds?" with promo text | No `nxCloudId` - just a short URL link |

33/33/33 split. Key insight for variant 2: you can generate a valid Cloud onboarding URL without calling `connectToNxCloudForTemplate()` - the GitHub flow sends `accessToken: null` and the API returns a short URL based on the git remote.

**Variant 2 was explicitly locked in on Feb 12** (`#34416`) - removed all A/B randomization logic, `getFlowVariant()` hardcoded to return `'2'`, `shouldShowCloudPrompt()` always returns `false`. All users get deferred connection with no prompt.

### Phase 3: Yes / Maybe Later / Never (Feb 23-25)

After locking in the no-prompt approach, the Cloud prompt was **reintroduced** as a 3-way choice giving users explicit control over their Cloud relationship:

| Choice | `--nxCloud` value | What Happens |
|--------|------------------|-------------|
| **Yes** | `yes` (or omit) | Connect now - write `nxCloudId` to nx.json, strong completion message |
| **Maybe later** | `skip` | Deferred connection - no `nxCloudId`, still show short URL and update README |
| **Never** | `never` | Full opt-out - set `neverConnectToCloud: true` in nx.json, no URL, no README update, no cloud messaging |

Non-interactive/CI defaults to "maybe later" (`skip`). This replaced the binary yes/no that existed before the experiments.

### Implementation Issues

- **NXC-3628**: Variant 1 implementation - skip cloud prompt, always show platform link, no `nxCloudId` in nx.json. Fixed expired cache file bug in variant randomization.
- **CLOUD-4189**: Added variant 2 - no prompt at all, auto-connect with "Want faster builds?" promo message.
- **#34416** (Feb 12): Locked in variant 2, removed A/B randomization.
- **#34580** (Feb 25): Added explicit cloud opt-out with yes/maybe later/never prompt.
- **#34616** (Feb 25): Fixed `--nxCloud=skip` being ignored in non-interactive mode.
- **NXC-3886**: No-prompt experiment should NOT add Cloud config unexpectedly (still open).
- **NXC-3753**: `nx record` and `nx fix-ci` noop with warning when no `nxCloudId` (instead of erroring).
- **NXC-3784**: Templates updated to use `nx record` in CI and README comment markers for Cloud short links.
- **NXC-3783**: Dynamic per-workspace Cloud connect link injected into template README.

## 3. Telemetry & Error Reduction (Jan-Feb 2026)

- **NXC-3879**: Added Nx version to short link metadata so experiment results aren't approximated by "latest" timing.
- **NXC-3811**: Addressed top 5 common CNW errors (empty preset failures across all flow variants, 90 hits).
- **Feb 20 (cnw_custom_fix)**: Prevented `nxCloudId` from being generated for new workspaces - use short URL instead.
- **NXC-3736**: Updated privacy policy and CLI prompts for analytics capture (legal approved).
- **NXC-3732**: Analytics prompt during CNW + Nx invocation if property missing from nx.json.
- **NXC-3618**: Better stats recording - JSON with `{type: start|complete|error}` instead of flat value lists.

## 4. Agentic CNW (Feb 2026)

**Motivation:** AI agents (Claude Code, Cursor, etc.) should be able to run `create-nx-workspace` autonomously.

- **NXC-3815**: Gap analysis - identified where agents get stuck (interactive prompts, `nx sync` failures, `--no-interactive` not respected).
- **NXC-3830**: CNW benchmarks for CLI agentic experience (AX project).
- **Feb 2026 (22.5.0)**: AI agent detection + NDJSON output for CNW (machine-readable output for agents).
- **NXC-3774**: Fixed `--no-interactive` flag handling - was being forwarded to tools like `tsc`/`eslint` that don't support it.
- **NXC-3920**: Fixed leftover AI agent files (Gemini settings, outdated CLAUDE.md/AGENTS.md) being installed without prompting.
- **Agentic CNW spec** (Feb 3): Full specification for autonomous workspace creation by AI agents.

---

**Key Metrics Being Tracked:**
- Flow variant (0/1/2) per workspace creation
- Cloud prompt acceptance rate per variant
- Short URL click-through rate per variant
- Error type distribution (precreate, create, postcreate)
- GH CLI availability, Node version, package manager
- Nx version in short link meta (since Feb 2026)
