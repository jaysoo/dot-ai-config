# NXC-3464: CNW Templates Implementation Plan

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3464/pr-release-with-cnw-templates
**Parent Issue**: https://linear.app/nxdev/issue/NXC-3355/utilize-github-templates-for-cnw
**Branch**: `cnw_templates`
**Status**: Planning Complete - Ready for Implementation
**Started**: 2025-11-12
**Plan Approved**: 2025-11-12

---

## Executive Summary

Add `--template` flag to create-nx-workspace that accepts GitHub repo patterns like `nrwl/react-template`, clones complete workspace templates, and provides simplified Cloud connection flow with A/B tested messaging.

### Key Changes:
1. ✅ **Template flag**: `--template nrwl/react-template` (auto-prepends `https://github.com/`)
2. ✅ **URL restriction**: Only allow `nrwl/*` repos (error on untrusted sources)
3. ✅ **Replace stack prompt**: Show template selection (Empty/TypeScript/React/Angular) instead of preset prompts
4. ✅ **Preset compatibility**: If `--preset` provided, use existing flow (no template prompts)
5. ✅ **Simplified Cloud prompt**: Just "Connect to Cloud?" (yes/no), no CI provider selection
6. ✅ **A/B testing**: Use existing message variant system with meta codes for tracking

---

## CNW Architecture Analysis

### Entry Point and CLI Parsing
- **File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts`
- **Parser**: Uses `yargs` library for argument parsing
- **Command Definition**: Single default command `$0 [name] [options]`

### Current Prompt Flow (lines 299-353)
```
1. determineFolder() → Workspace name prompt
2. determineStack() → Stack selection (none/react/angular/vue/node)
3. determinePresetOptions() → Stack-specific prompts
4. determinePackageManager() → Package manager selection
5. determineAiAgents() → AI agents selection
6. determineDefaultBase() → Git default branch
7. determineNxCloud() → CI/Cloud setup
8. determineIfGitHubWillBeUsed() → GitHub integration
```

### Workspace Creation Flow
**File**: `packages/create-nx-workspace/src/create-workspace.ts`
```
1. createSandbox() → Create temp directory
2. createEmptyWorkspace() → Run `nx new` command
3. createPreset() → Install third-party preset (if applicable)
4. setupCI() → Generate CI workflow files
5. createNxCloudOnboardingUrl() → Generate connect URL
6. initializeGitRepo() → Initialize git
7. pushToGitHub() → Push to GitHub (if GitHub CI selected)
```

### Cloud Connection Generator
**Package**: `packages/nx` (core Nx package)
**Path**: `packages/nx/src/nx-cloud/generators/connect-to-nx-cloud/`

The `connectToNxCloud` generator:
- Creates an Nx Cloud workspace/org automatically
- Generates authentication token or workspace ID
- Adds token/ID to workspace's `nx.json` configuration
- Returns the token/ID for subsequent use

---

## Critical Gaps & Design Decisions

### 🔴 Must Decide Before Implementation

1. **Clone Method** → **DECISION: git clone --depth 1 + remove .git**
   - Simplest, no new dependencies
   - Remove .git after clone for fresh git history

2. **Package Manager Lockfiles** → **DECISION: Delete non-matching lockfiles**
   - Template has pnpm-lock.yaml, user wants npm
   - Delete incompatible lockfiles before install
   - Let install regenerate correct lockfile

3. **Workspace Name in package.json** → **DECISION: Replace automatically**
   - Replace with directory name programmatically
   - Update package.json `"name"` field

4. **Template nx.json Validation** → **DECISION: Silently remove Cloud config**
   - Templates should NOT have nxCloudId/nxCloudAccessToken
   - Silently remove any Cloud config (clean slate)

5. **CI Workflow Files** → **DECISION: Keep them**
   - Templates can include .github/workflows as examples
   - Don't generate additional CI files for templates

6. **Non-Interactive Mode** → **DECISION: Require explicit flags**
   - Require: `--nxCloud`, `--packageManager` for non-interactive
   - Error with helpful message if missing

---

## Implementation Phases

### Phase 1: CLI Flag & Validation

**Files**: `packages/create-nx-workspace/bin/create-nx-workspace.ts`

**Tasks**:
- Add `--template` option to yargs config (~line 228)
- Add to BaseArguments type interface (~line 37)
- Create URL validation function
- Add conflict check: template + preset → error

**Implementation**:
```typescript
// Add option after line 228
.option('template', {
  describe: chalk.dim`GitHub template (e.g., nrwl/react-template)`,
  type: 'string',
})

// Validation function
function validateAndExpandTemplate(template: string): string {
  // Pattern: nrwl/repo-name
  const pattern = /^nrwl\/[a-zA-Z0-9-]+$/;

  if (!pattern.test(template)) {
    throw new Error(
      'Template must be in format: nrwl/repo-name (e.g., nrwl/react-template)\n' +
      'Only templates from the nrwl organization are supported.'
    );
  }

  return `https://github.com/${template}`;
}

// Conflict check in middleware (~line 310)
if (argv.template && argv.preset) {
  throw new Error('Cannot use both --template and --preset. Choose one.');
}

if (argv.template) {
  argv.template = validateAndExpandTemplate(argv.template);
}
```

**Edge Cases**:
- `--template nrwl/repo.git` → Strip .git suffix
- `--template https://github.com/nrwl/repo` → Error (use short form)
- `--template other-org/repo` → Error (only nrwl)

**Estimated Time**: 2-3 hours

---

### Phase 2: Replace Stack Prompt with Template Prompt

**Files**:
- `packages/create-nx-workspace/src/internal-utils/prompts.ts`
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` (middleware)
- `packages/create-nx-workspace/src/utils/nx/ab-testing.ts` (messages)

**Tasks**:
1. Create `determineTemplate()` function in prompts.ts
2. Update middleware to call determineTemplate instead of determineStack
3. Skip preset prompts if template chosen
4. Maintain preset flow if 'skip' selected

**Implementation**:
```typescript
// prompts.ts - NEW function
export async function determineTemplate(
  parsedArgs: yargs.Arguments<{ template?: string; preset?: string }>
): Promise<string | 'skip'> {
  // Already provided via flag
  if (parsedArgs.template) return parsedArgs.template;

  // Using preset flow instead
  if (parsedArgs.preset) return 'skip';

  // Show template selection prompt
  const { template } = await enquirer.prompt<{ template: string }>({
    type: 'autocomplete',
    name: 'template',
    message: 'Which template would you like to use?',
    choices: [
      {
        name: 'Empty',
        value: 'https://github.com/nrwl/empty-template',
        message: 'Empty                  (minimal Nx workspace)'
      },
      {
        name: 'TypeScript',
        value: 'https://github.com/nrwl/typescript-template',
        message: 'TypeScript             (Node.js with TypeScript)'
      },
      {
        name: 'React',
        value: 'https://github.com/nrwl/react-template',
        message: 'React                  (React app with Vite)'
      },
      {
        name: 'Angular',
        value: 'https://github.com/nrwl/angular-template',
        message: 'Angular                (Angular app)'
      },
      {
        name: 'Use presets instead',
        value: 'skip',
        message: '──────────────────────\nUse presets instead    (advanced configuration)'
      },
    ],
  });

  return template;
}

// create-nx-workspace.ts middleware (~line 313)
const template = await determineTemplate(argv);

if (template !== 'skip') {
  // Template flow - skip preset prompts
  argv.template = template;
  // Still ask: package manager, git branch, AI agents
  argv.packageManager = await determinePackageManager(argv);
  argv.defaultBase = await determineDefaultBase(argv);
  argv.aiAgents = await determineAiAgents(argv);
} else {
  // Existing preset flow
  if (!argv.preset || isKnownPreset(argv.preset)) {
    argv.stack = await determineStack(argv);
    const presetOptions = await determinePresetOptions(argv);
    Object.assign(argv, presetOptions);
  }
  argv.packageManager = await determinePackageManager(argv);
  argv.defaultBase = await determineDefaultBase(argv);
  argv.aiAgents = await determineAiAgents(argv);
}
```

**What we DON'T ask for templates**:
- ❌ Stack selection (template defines this)
- ❌ App name (template has it)
- ❌ Style/bundler/framework (template configured)
- ❌ CI provider (simplified to yes/no Cloud question)

**What we STILL ask**:
- ✅ Package manager (for install)
- ✅ Git default branch (for repo init)
- ✅ AI agents (optional enhancement)
- ✅ Cloud connection (simplified prompt)

**Estimated Time**: 3-4 hours

---

### Phase 3: Clone Template & Setup

**Files**:
- `packages/create-nx-workspace/src/utils/template/clone-template.ts` (NEW)
- `packages/create-nx-workspace/src/create-workspace.ts`

**Tasks**:
1. Create template cloning utility
2. Clone with shallow history
3. Remove .git directory
4. Update workspace name in package.json
5. Remove Cloud config from nx.json
6. Clean up incompatible lockfiles
7. Install dependencies
8. Integrate into createWorkspace flow

**Implementation**:
```typescript
// NEW FILE: clone-template.ts
import { execAndWait } from '../child-process-utils';
import { existsSync } from 'fs';
import { rm, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function cloneTemplate(
  templateUrl: string,
  targetDirectory: string,
  workspaceName: string
): Promise<void> {
  // 1. Clone with shallow history
  await execAndWait(
    `git clone --depth 1 ${templateUrl} "${targetDirectory}"`
  );

  // 2. Remove git history (start fresh)
  const gitDir = join(targetDirectory, '.git');
  if (existsSync(gitDir)) {
    await rm(gitDir, { recursive: true, force: true });
  }

  // 3. Update workspace name in package.json
  const pkgPath = join(targetDirectory, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
  pkg.name = workspaceName;
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // 4. Remove any Cloud config from template's nx.json
  const nxJsonPath = join(targetDirectory, 'nx.json');
  if (existsSync(nxJsonPath)) {
    const nxJson = JSON.parse(await readFile(nxJsonPath, 'utf-8'));
    delete nxJson.nxCloudId;
    delete nxJson.nxCloudAccessToken;
    await writeFile(nxJsonPath, JSON.stringify(nxJson, null, 2));
  }
}

export async function cleanupLockfiles(
  targetDirectory: string,
  packageManager: string
): Promise<void> {
  const lockfiles = {
    npm: 'package-lock.json',
    yarn: 'yarn.lock',
    pnpm: 'pnpm-lock.yaml',
    bun: 'bun.lockb',
  };

  // Remove lockfiles that don't match selected package manager
  for (const [pm, lockfile] of Object.entries(lockfiles)) {
    if (pm !== packageManager) {
      const lockPath = join(targetDirectory, lockfile);
      if (existsSync(lockPath)) {
        await rm(lockPath, { force: true });
      }
    }
  }
}

// create-workspace.ts - modify createWorkspace function
export async function createWorkspace(...) {
  // ...existing setup...

  if (options.template) {
    // Template flow
    await cloneTemplate(
      options.template,
      directory,
      options.name
    );

    await cleanupLockfiles(directory, packageManager);

    // Install dependencies
    await execAndWait(
      `${pmc.install}`,
      directory
    );
  } else {
    // Existing preset flow
    await createEmptyWorkspace(...);
    if (thirdPartyPreset) {
      await createPreset(...);
    }
  }

  // ...rest stays the same...
}
```

**Error Handling**:
- Git clone fails (404, network) → Clear error message
- Template missing nx.json → Error "Invalid template"
- Template missing package.json → Error "Invalid template"

**Estimated Time**: 4-5 hours

---

### Phase 4: Simplified Cloud Prompt (Template Flow Only)

**Files**:
- `packages/create-nx-workspace/src/internal-utils/prompts.ts`
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` (middleware)
- `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`

**Tasks**:
1. Add new simplified Cloud prompt config (no CI options)
2. Create `determineNxCloudSimple()` function for template flow
3. Update middleware to use correct prompt based on flow
4. Keep existing CI prompt for preset flow

**Implementation**:
```typescript
// ab-testing.ts - Add new prompt config
const messageOptions = {
  // ...existing...

  setupNxCloudSimple: [
    {
      code: 'simple-cloud-v1',
      message: 'Would you like to enable remote caching with Nx Cloud?',
      choices: [
        {
          value: 'yes',
          name: 'Yes, enable caching',
        },
        {
          value: 'skip',
          name: 'No, configure it later',
        },
      ],
    },
  ],
};

// prompts.ts - NEW function for template flow
export async function determineNxCloudSimple(
  parsedArgs: yargs.Arguments<{ nxCloud?: string }>
): Promise<'yes' | 'skip'> {
  // Provided via flag
  if (parsedArgs.nxCloud) {
    return parsedArgs.nxCloud === 'skip' ? 'skip' : 'yes';
  }

  const prompt = messages.getPrompt('setupNxCloudSimple');

  const { nxCloud } = await enquirer.prompt<{ nxCloud: 'yes' | 'skip' }>({
    type: 'autocomplete',
    name: 'nxCloud',
    message: prompt.message,
    choices: prompt.choices,
  });

  return nxCloud;
}

// create-nx-workspace.ts middleware - update Cloud prompt section
if (template !== 'skip') {
  // Template flow - simple Cloud prompt
  argv.nxCloud = await determineNxCloudSimple(argv);
  argv.useGitHub = argv.nxCloud === 'yes'
    ? await determineIfGitHubWillBeUsed(argv)
    : undefined;
} else {
  // Preset flow - existing CI-based prompt
  argv.nxCloud = await determineNxCloud(argv);
  argv.useGitHub = await determineIfGitHubWillBeUsed(argv);
}
```

**Key Differences**:
- Template: "Enable caching?" (yes/skip)
- Preset: "Which CI provider?" (github/gitlab/azure/circleci/skip)
- Template: No CI workflow generation
- Preset: Generates CI workflow files

**Estimated Time**: 2-3 hours

---

### Phase 5: Cloud Connection with A/B Testing

**Files**:
- `packages/create-nx-workspace/src/utils/nx/messages.ts`
- `packages/create-nx-workspace/src/create-workspace.ts`

**Tasks**:
1. Add new A/B test message variants for template Cloud connection
2. Update Cloud connection flow to use appropriate message source
3. Pass message variant code as meta for tracking
4. Ensure template flow uses same URL generation

**Implementation**:
```typescript
// messages.ts - Add A/B test variants
const outputMessages = {
  // ...existing...

  'create-nx-workspace-template-cloud': [
    {
      code: 'template-cloud-connect-v1',
      createMessage: (url: string | null) => ({
        title: 'Connect to Nx Cloud to complete setup',
        type: 'success',
        bodyLines: [
          url || 'Run: nx connect',
          '',
          'Nx Cloud provides:',
          '  • Remote caching across your team',
          '  • Distributed task execution',
          '  • Real-time build insights',
        ],
      }),
    },
    {
      code: 'template-cloud-connect-v2',
      createMessage: (url: string | null) => ({
        title: 'One more step: activate remote caching',
        type: 'success',
        bodyLines: [
          'Visit the link below to connect your workspace:',
          url || '',
          '',
          'This enables 10x faster builds by sharing cache across your team.',
        ],
      }),
    },
    {
      code: 'template-cloud-connect-v3',
      createMessage: (url: string | null) => ({
        title: 'Almost done! Finish Nx Cloud setup',
        type: 'success',
        bodyLines: [
          url || 'Run: nx connect',
          '',
          'Takes 30 seconds. Makes your builds 10x faster.',
        ],
      }),
    },
  ],
};

// create-workspace.ts - Update Cloud connection section
if (nxCloud !== 'skip') {
  const token = readNxCloudToken(directory);

  // Only generate CI for preset flow (not template)
  if (!options.template && nxCloud !== 'yes') {
    await setupCI(directory, nxCloud, packageManager);
  }

  // Determine message source
  const messageSource = options.template
    ? 'create-nx-workspace-template-cloud'
    : 'create-nx-workspace-success-ci-setup';

  // Get message variant
  const messageFactory = messages.getSuccessMessage(messageSource);

  // Generate URL with variant code as meta
  connectUrl = await createNxCloudOnboardingUrl(
    nxCloud === 'yes' ? 'yes' : nxCloud,
    token,
    directory,
    messageFactory.code, // Tracks which message variant shown
    useGitHub
  );

  // Display message
  const message = messageFactory.createMessage(connectUrl, pushedToVcs);
  output.log({
    title: message.title,
    bodyLines: message.bodyLines,
  });
}
```

**A/B Testing Flow**:
1. User runs CNW with template
2. Random variant selected (v1, v2, or v3)
3. Variant code sent to Nx Cloud as `meta` in URL generation
4. Nx Cloud tracks: Which variant → Did user connect?
5. Analytics reveal which message copy drives highest connection rate

**Estimated Time**: 2-3 hours

---

### Phase 6: Testing & Validation

**Manual Testing Scenarios**:
1. **Template with Cloud**:
   ```bash
   npx create-nx-workspace --template nrwl/react-template
   # Choose: Yes, connect to Cloud
   ```

2. **Template without Cloud**:
   ```bash
   npx create-nx-workspace myapp --template nrwl/angular-template --nxCloud skip
   ```

3. **Template via prompt**:
   ```bash
   npx create-nx-workspace
   # Choose template from list
   ```

4. **Invalid URL**:
   ```bash
   npx create-nx-workspace --template other-org/template
   # Should error: "Untrusted source"
   ```

5. **Preset flow still works**:
   ```bash
   npx create-nx-workspace --preset react-standalone
   # Should use existing flow, not templates
   ```

6. **Conflict handling**:
   ```bash
   npx create-nx-workspace --template nrwl/react --preset react
   # Should error
   ```

7. **Non-interactive template**:
   ```bash
   npx create-nx-workspace myapp --template nrwl/react --nxCloud skip --packageManager pnpm --non-interactive
   ```

**E2E Tests to Add**:
- Template cloning successful
- URL validation rejects non-nrwl
- Cloud connection works with templates
- A/B testing codes properly tracked
- Preset flow unaffected
- Package manager lockfile handling
- Workspace name replacement
- Cloud config removal from nx.json

**Unit Tests**:
```typescript
// URL validation
expect(() => validateAndExpandTemplate('nrwl/react')).not.toThrow();
expect(() => validateAndExpandTemplate('other/react')).toThrow();
expect(() => validateAndExpandTemplate('nrwl/repo-name')).not.toThrow();

// Template vs preset conflict
expect(() => normalizeArgs({ template: 'nrwl/react', preset: 'react' })).toThrow();

// Lockfile cleanup
// Mock fs, verify non-matching lockfiles removed
```

**Estimated Time**: 4-6 hours

---

### Phase 7: Edge Cases & Error Handling

**Edge Cases to Handle**:

1. **Template repo doesn't exist (404)**:
   ```
   Error: Template repository 'nrwl/nonexistent' not found.
   Visit https://github.com/nrwl to see available templates.
   ```

2. **Network error during clone**:
   ```
   Error: Failed to clone template. Check your internet connection.
   ```

3. **Template missing nx.json**:
   ```
   Error: Invalid template - missing nx.json file.
   ```

4. **Non-interactive without required flags**:
   ```
   Error: Non-interactive mode requires: --nxCloud, --packageManager
   Example: npx create-nx-workspace myapp --template nrwl/react --nxCloud skip --packageManager npm --non-interactive
   ```

5. **Directory already exists**:
   ```
   Error: Directory 'myapp' already exists. Choose a different name.
   ```

**Cleanup on Error**:
- If clone fails, remove partial directory
- If install fails, show error but keep directory (user might want to debug)

**Estimated Time**: 2-3 hours

---

## Implementation Order & Timeline

### Sequential Phases:
1. **Phase 1** (2-3 hours): CLI flag, validation, conflict checks
2. **Phase 2** (3-4 hours): Prompt replacement, template selection
3. **Phase 3** (4-5 hours): Clone logic, cleanup, error handling
4. **Phase 4** (2-3 hours): Simplified Cloud prompt
5. **Phase 5** (2-3 hours): A/B testing integration
6. **Phase 6** (4-6 hours): Testing (unit + e2e + manual)
7. **Phase 7** (2-3 hours): Edge cases, error messages, docs

**Total Estimated Time**: 20-27 hours (2.5-3.5 days)

### Parallel Opportunities:
- Phase 4 can start while Phase 3 in progress
- Documentation drafts can start early

---

## Risk Assessment

### High Risk:
- **Git clone in production**: May fail due to network, auth, rate limits
  - Mitigation: Clear error messages, retry logic, timeout handling
- **Package manager lockfile conflicts**: Could break installs
  - Mitigation: Delete non-matching lockfiles before install
- **Nx version mismatches**: Could cause runtime errors
  - Mitigation: Document in templates, consider validation warning

### Medium Risk:
- **Template repo 404**: Need good error handling
  - Mitigation: Catch clone errors, provide helpful message
- **Malformed templates**: Need validation
  - Mitigation: Check for nx.json and package.json existence
- **Workspace name replacement**: Could break imports
  - Mitigation: Only replace package.json name field (safe)

### Low Risk:
- **A/B testing**: Infrastructure exists and is proven
- **URL validation**: Straightforward regex pattern matching
- **Prompt changes**: Well-understood patterns in codebase

---

## Open Questions & Future Enhancements

1. **Template versioning**: Should we support `nrwl/react-template#v1.0.0` later?
2. **Template discovery**: Add `nx list-templates` command?
3. **Telemetry**: Track which templates are most popular?
4. **Template badges**: Show "New! ✨" during rollout?
5. **Custom templates**: Allow users to create their own templates?
6. **Template testing**: CI to validate templates are always working?

---

## Success Criteria

### Feature Complete:
- [ ] Users can run `npx create-nx-workspace --template nrwl/react-template`
- [ ] Template prompt shows 4 options + "use presets" fallback
- [ ] Only nrwl org templates allowed (security)
- [ ] Simplified Cloud prompt (yes/no only, no CI selection)
- [ ] A/B testing variants deployed and tracked
- [ ] Preset flow completely unaffected
- [ ] All tests passing (unit + e2e)
- [ ] Error messages clear and helpful

### Quality Metrics:
- [ ] No regression in preset flow performance
- [ ] Template cloning completes in <30 seconds
- [ ] Cloud connection rate >= current rate
- [ ] Zero breaking changes to existing flags/options

---

## Next Steps

1. Implement Phase 1 (CLI flag & validation)
2. Create PR with Phase 1 for early review
3. Continue with Phases 2-5 sequentially
4. Add comprehensive tests in Phase 6
5. Polish edge cases in Phase 7
6. Final PR review and merge
7. Monitor A/B test results post-launch
