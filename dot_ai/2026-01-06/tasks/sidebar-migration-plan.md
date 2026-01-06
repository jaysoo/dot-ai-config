# Sidebar Migration Plan: Current Pages → New Structure

**Date:** 2026-01-06
**Based on:** PR #33933 + Analytics Data + User Feedback

---

## Proposed 5-Section Structure

| Section | Purpose | User Journey |
|---------|---------|--------------|
| **Learn Nx** | First-time users, core value props | Day 1 |
| **Build with Nx** | Daily development, technologies | First month |
| **Scale with Nx** | CI optimization, team features | When repo grows |
| **Extend Nx** | Plugin development | Power users |
| **Reference** | Lookups, configs, API | All users |

---

## Key Insight: Caching in Learn, Affected in Scale

**Rationale:**
- Caching is THE hook - users should see instant builds on Day 1
- `run-many` + local caching is sufficient for most users initially
- `affected` is an optimization for when the repo gets large enough that even cached `run-many` is slow
- This matches the natural progression: "wow fast!" → "daily work" → "need to scale"

---

## Section 1: Learn Nx (Day 1)

### Goal
Get users to "wow, that's fast!" moment within 15 minutes.

### Current → New Mapping

| Current Path | New Location | Priority | Notes |
|--------------|--------------|----------|-------|
| `/getting-started/intro` | Learn Nx / Introduction | **P0** | Entry point (66K views) |
| `/getting-started/installation` | Learn Nx / Installation | **P0** | |
| `/getting-started/start-new-project` | Learn Nx / Start New Project | **P0** | 15.6% bounce |
| `/getting-started/start-with-existing-project` | Learn Nx / Add to Existing | **P0** | 11.8% bounce (best!) |
| `/quickstart` | Learn Nx / Quickstart | **P0** | |
| `/getting-started/tutorials/*` | Learn Nx / Tutorials/* | **P0** | High engagement |
| `/concepts/mental-model` | Learn Nx / Concepts / Mental Model | **P1** | |
| `/features/run-tasks` | Learn Nx / Concepts / Run Tasks | **P1** | Core concept |
| `/features/cache-task-results` | Learn Nx / Concepts / Cache Results | **P1** | **MOVE HERE** - core value prop |
| `/concepts/how-caching-works` | Learn Nx / Concepts / How Caching Works | **P1** | |
| `/features/explore-graph` | Learn Nx / Concepts / Explore Graph | **P1** | Visual - hooks users |
| `/features/generate-code` | Learn Nx / Concepts / Generate Code | **P2** | |
| `/concepts/inferred-tasks` | Learn Nx / Concepts / Inferred Tasks | **P2** | |
| `/concepts/task-pipeline-configuration` | Learn Nx / Concepts / Task Pipelines | **P2** | |
| `/concepts/nx-plugins` | Learn Nx / Concepts / Nx Plugins | **P2** | |
| `/getting-started/editor-setup` | Learn Nx / Editor Setup | **P1** | 15.4% bounce |
| `/getting-started/ai-setup` | Learn Nx / AI Setup | **P2** | 36.9% bounce - needs work |

### New Content Needed
- [ ] "Local Development" page (quick wins with watch mode, dev server)
- [ ] "Your First Cached Build" quick tutorial

### Analytics Support
- Top 6 most visited pages are all getting-started content
- Tutorials have 20-30% bounce (good engagement)
- `start-with-existing-project` has LOWEST bounce (11.8%) - users finding exactly what they need

---

## Section 2: Build with Nx (First Month)

### Goal
Daily development workflow - technologies, generators, common tasks.

### Current → New Mapping

| Current Path | New Location | Priority | Notes |
|--------------|--------------|----------|-------|
| **Features (Daily Use)** | | | |
| `/features/automate-updating-dependencies` | Build / Automate Updates | **P1** | 8.6K views |
| `/features/manage-releases` | Build / Manage Releases | **P2** | |
| `/features/enhance-ai` | Build / Enhance AI | **P2** | 39% bounce - needs work |
| `/features/maintain-typescript-monorepos` | Build / TypeScript / Guides | **P2** | |
| **Technologies** | | | |
| `/technologies/angular/*` | Build / Technologies / Angular/* | **P0** | ~60K views total |
| `/technologies/react/*` | Build / Technologies / React/* | **P0** | ~25K views |
| `/technologies/node/*` | Build / Technologies / Node/* | **P0** | ~20K views |
| `/technologies/typescript/*` | Build / Technologies / TypeScript/* | **P1** | |
| `/technologies/vue/*` | Build / Technologies / Vue/* | **P2** | |
| `/technologies/build-tools/*` | Build / Technologies / Build Tools/* | **P2** | Vite, Webpack, etc. |
| `/technologies/test-tools/*` | Build / Technologies / Test Tools/* | **P2** | Jest, Vitest, Cypress |
| `/technologies/java/*` | Build / Technologies / Java/* | **P3** | Niche |
| `/technologies/dotnet/*` | Build / Technologies / .NET/* | **P3** | Niche |
| **Guides (Daily Tasks)** | | | |
| `/guides/tasks--caching/*` | Build / Guides / Tasks & Caching/* | **P1** | Except self-hosted (→Scale) |
| `/guides/nx-release/*` | Build / Guides / Nx Release/* | **P2** | |
| `/guides/adopting-nx/*` | Build / Guides / Adopting Nx/* | **P1** | |
| `/guides/tips-n-tricks/*` | Build / Guides / Tips & Tricks/* | **P2** | |
| `/guides/ci-deployment` | Build / Guides / CI Deployment | **P2** | Basic CI setup |

### Special Cases

**Module Federation** - Split between Build and Scale:
| Page | Location | Rationale |
|------|----------|-----------|
| `/technologies/module-federation/introduction` | Build / Technologies / MF / Intro | Basic setup |
| `/technologies/module-federation/guides/*` | Build / Technologies / MF / Guides | How-to |
| `/technologies/module-federation/concepts/micro-frontend-architecture` | Scale / Module Federation | Architecture decisions |
| `/technologies/module-federation/concepts/faster-builds-with-module-federation` | Scale / Module Federation | Optimization |

**Note:** This split may cause hierarchy jumping. Consider keeping ALL MF content together in Build, with cross-links to Scale for "when to use" guidance.

### Analytics Concerns
- `/technologies/angular/generators` has 42.3% bounce despite 8K views - needs UX fix (search/filter)
- Technology pages have healthy 25-35% bounce rates overall

---

## Section 3: Scale with Nx (When Repo Grows)

### Goal
CI optimization, team collaboration, enterprise features.

### Current → New Mapping

| Current Path | New Location | Priority | Notes |
|--------------|--------------|----------|-------|
| **CI Features** | | | |
| `/features/ci-features/remote-cache` | Scale / Remote Caching | **P0** | First scale optimization |
| `/features/ci-features/affected` | Scale / Affected Commands | **P1** | **KEEP HERE** - for large repos |
| `/features/ci-features/distribute-task-execution` | Scale / Distributed Execution | **P1** | Advanced |
| `/features/ci-features/split-e2e-tasks` | Scale / Split E2E Tasks | **P2** | |
| `/features/ci-features/flaky-tasks` | Scale / Flaky Task Detection | **P2** | 47% bounce - needs rewrite |
| `/features/ci-features/self-healing-ci` | Scale / Self-Healing CI | **P2** | 46% bounce - needs rewrite |
| `/features/ci-features/dynamic-agents` | Scale / Dynamic Agents | **P2** | |
| `/features/ci-features/github-integration` | Scale / GitHub Integration | **P2** | |
| **Nx Cloud Guides** | | | |
| `/guides/nx-cloud/*` | Scale / Setup & Config/* | **P1** | |
| `/guides/tasks--caching/self-hosted-caching` | Scale / Self-Hosted Caching | **P1** | Move from Build |
| **Module Boundaries** | | | |
| `/features/enforce-module-boundaries` | Scale / Module Boundaries / Overview | **P1** | |
| `/guides/enforce-module-boundaries/*` | Scale / Module Boundaries/* | **P2** | |
| **Conformance & Owners** | | | |
| `/reference/conformance/*` | Scale / Conformance/* | **P2** | Enterprise feature |
| `/reference/owners/*` | Scale / Owners/* | **P2** | Enterprise feature |
| **Nx Console** | | | |
| `/guides/nx-console/*` | Scale / Nx Console/* | **P2** | IDE integration |
| **Enterprise** | | | |
| `/enterprise/*` | Scale / Enterprise/* | **P3** | Low traffic (expected) |

### Analytics Concerns
- CI feature pages have 30-47% bounce rates
- These pages need content fixes regardless of restructure:
  - `flaky-tasks` (47.2% bounce) - Add TL;DR, quick fix section
  - `self-healing-ci` (46.2% bounce) - Less marketing, more practical setup
  - `ci-execution-failed` troubleshooting (48.3% bounce) - Add diagnostic flow

### Recommended Content Order in Scale
1. **Remote Caching** - First optimization most teams need
2. **Affected Commands** - Second optimization for large repos
3. **Distributed Execution** - When affected isn't enough
4. **Setup & Configuration** - Detailed guides
5. **Module Boundaries** - Code organization at scale
6. **Conformance/Owners** - Team governance
7. **Enterprise** - Single tenant, etc.

---

## Section 4: Extend Nx (Power Users)

### Goal
Plugin development, customization.

### Current → New Mapping

| Current Path | New Location | Priority | Notes |
|--------------|--------------|----------|-------|
| `/extending-nx/intro` | Extend / Introduction | **P1** | |
| `/extending-nx/local-generators` | Extend / Local Generators | **P1** | |
| `/extending-nx/local-executors` | Extend / Local Executors | **P1** | |
| `/extending-nx/creating-files` | Extend / Creating Files | **P2** | |
| `/extending-nx/modifying-files` | Extend / Modifying Files | **P2** | |
| `/extending-nx/composing-generators` | Extend / Composing Generators | **P2** | |
| `/extending-nx/compose-executors` | Extend / Composing Executors | **P2** | |
| `/extending-nx/project-graph-plugins` | Extend / Project Graph Plugins | **P2** | |
| `/extending-nx/tooling-plugin` | Extend / Tooling Plugin | **P2** | |
| `/extending-nx/publish-plugin` | Extend / Publishing Plugins | **P2** | |
| `/extending-nx/migration-generators` | Extend / Migration Generators | **P2** | |
| `/extending-nx/create-preset` | Extend / Creating Presets | **P3** | |
| `/extending-nx/create-install-package` | Extend / Install Packages | **P3** | |
| `/extending-nx/create-sync-generator` | Extend / Sync Generators | **P3** | |
| `/extending-nx/organization-specific-plugin` | Extend / Org-Specific Plugins | **P3** | |

### Analytics Notes
- This section has ~8K total views - niche but engaged audience
- 25-35% bounce rates - users finding what they need

---

## Section 5: Reference (All Users)

### Goal
Quick lookups, API reference, configuration.

### Current → New Mapping

| Current Path | New Location | Priority | Notes |
|--------------|--------------|----------|-------|
| `/reference/nx-json` | Reference / nx.json | **P0** | Config lookup |
| `/reference/project-configuration` | Reference / project.json | **P0** | 8.3K views |
| `/reference/nx-commands` | Reference / CLI Commands | **P0** | 14K views |
| `/reference/environment-variables` | Reference / Environment Variables | **P1** | |
| `/reference/inputs` | Reference / Inputs | **P1** | |
| `/reference/glossary` | Reference / Glossary | **P2** | |
| `/reference/nxignore` | Reference / .nxignore | **P2** | |
| `/reference/releases` | Reference / Release Notes | **P2** | |
| `/reference/benchmarks/*` | Reference / Benchmarks/* | **P3** | |
| `/reference/deprecated/*` | Reference / Deprecated/* | **P3** | Archive/remove |
| `/reference/devkit/*` | Reference / DevKit API/* | **P2** | API reference |
| `/reference/nx-cloud-cli` | Reference / Nx Cloud CLI | **P2** | |
| `/reference/nx-console-settings` | Reference / Nx Console Settings | **P2** | |
| `/reference/remote-cache-plugins/*` | Reference / Cache Plugins/* | **P2** | |

### Moved OUT of Reference
| Current Path | New Location | Rationale |
|--------------|--------------|-----------|
| `/reference/conformance/*` | Scale / Conformance | Active feature, not reference |
| `/reference/owners/*` | Scale / Owners | Active feature, not reference |
| `/reference/nx-cloud/*` | Scale / Nx Cloud Config | Active configuration |

---

## Section 6: Troubleshooting (Keep Separate or Merge?)

### Options

**Option A: Keep Separate Section**
- Pro: Easy to find when things go wrong
- Con: Another top-level section

**Option B: Merge into Relevant Sections**
| Page | Merge Into |
|------|------------|
| `/troubleshooting/troubleshoot-nx-install-issues` | Learn / Troubleshooting |
| `/troubleshooting/troubleshoot-cache-misses` | Build / Guides / Troubleshooting |
| `/troubleshooting/ci-execution-failed` | Scale / Troubleshooting |
| `/troubleshooting/resolve-circular-dependencies` | Build / Guides / Troubleshooting |
| `/troubleshooting/unknown-local-cache` | Build / Guides / Troubleshooting |

**Recommendation:** Option B - Put troubleshooting content close to related features. Add "Troubleshooting" subsection in each major section.

### Analytics Note
- Troubleshooting pages have 35-50% bounce rates (highest in docs)
- Users arrive frustrated and often don't find solutions
- These pages need content rewrites regardless of location

---

## Concepts Section: Redistribute

The current `/concepts/*` section gets absorbed into Learn and other sections:

| Current Path | New Location | Rationale |
|--------------|--------------|-----------|
| `/concepts/mental-model` | Learn / Concepts | Foundation |
| `/concepts/how-caching-works` | Learn / Concepts | Core value prop |
| `/concepts/inferred-tasks` | Learn / Concepts | Basic understanding |
| `/concepts/task-pipeline-configuration` | Learn / Concepts | Core concept |
| `/concepts/nx-plugins` | Learn / Concepts | Basic understanding |
| `/concepts/executors-and-configurations` | Extend / Concepts | Plugin dev |
| `/concepts/sync-generators` | Extend / Concepts | Plugin dev |
| `/concepts/typescript-project-linking` | Build / TypeScript | Technology-specific |
| `/concepts/buildable-and-publishable-libraries` | Build / Guides | Practical guidance |
| `/concepts/ci-concepts/*` | Scale / Concepts | CI-specific |
| `/concepts/decisions/*` | Learn / Concepts / Decisions | Architecture decisions |
| `/concepts/common-tasks` | Reference / Common Tasks | Quick lookup |
| `/concepts/nx-daemon` | Reference / Nx Daemon | Technical detail |
| `/concepts/types-of-configuration` | Reference / Configuration Types | Technical detail |

---

## Migration Checklist

### Phase 1: Learn Nx (Highest Impact)
- [ ] Create new Learn Nx section structure
- [ ] Move getting-started pages
- [ ] Move caching pages to Learn/Concepts
- [ ] Move run-tasks, explore-graph to Learn/Concepts
- [ ] Create "Local Development" page
- [ ] Update intro page with clear user segmentation
- [ ] Set up redirects for old URLs

### Phase 2: Build with Nx
- [ ] Restructure technologies section
- [ ] Move daily-use features (automate-updates, releases)
- [ ] Move guides (tasks-caching, nx-release, adopting-nx)
- [ ] Handle Module Federation split or consolidation
- [ ] Fix Angular generators page (42% bounce)

### Phase 3: Scale with Nx
- [ ] Move CI features (keep affected here)
- [ ] Move Nx Cloud guides
- [ ] Move Module Boundaries, Conformance, Owners
- [ ] Add troubleshooting subsection
- [ ] Rewrite high-bounce CI pages (flaky, self-healing)

### Phase 4: Extend Nx & Reference
- [ ] Move extending-nx content (minimal changes)
- [ ] Clean up Reference (move conformance/owners out)
- [ ] Archive deprecated pages
- [ ] Merge troubleshooting into relevant sections

### Phase 5: Redirects & Validation
- [ ] Create comprehensive redirect map
- [ ] Test all old URLs redirect properly
- [ ] Verify search still works
- [ ] Monitor analytics for 2 weeks post-launch

---

## Summary: Key Differences from PR #33933

| Aspect | PR #33933 | This Plan |
|--------|-----------|-----------|
| Caching | In Build/Scale | **In Learn** (core value prop) |
| Affected | In Scale | In Scale ✓ (agree) |
| Module Federation | Split Build/Scale | Consider keeping together |
| Troubleshooting | Not addressed | Merge into relevant sections |
| Concepts | Absorbed into Learn | More granular redistribution |

The main improvement is putting caching front-and-center in Learn Nx so users experience the "wow" moment on Day 1, while keeping affected as a Scale optimization for when repos grow large.
