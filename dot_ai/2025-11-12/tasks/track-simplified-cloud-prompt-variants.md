# Task: Track Simplified Cloud Prompt Variants (Template Flow)

**Issue**: The template flow uses `setupNxCloudSimple` prompt with 3 A/B test variants, but the variant codes are not being tracked in either the Cloud onboarding URL or the `recordStat` telemetry.

**Goal**: Track which prompt variant users see in the template flow, so we can measure conversion rates for each variant.

---

## Current State Analysis

### How Tracking Works Today (Preset Flow)

**Flow for preset flow (existing, working)**:
```
User runs: npx create-nx-workspace

1. determineNxCloud() shows prompt
   - Variants: setupCI or setupNxCloud
   - Randomly selects variant
   - Code stored in PromptMessages.selectedMessages

2. User chooses option (yes/github/skip/etc)

3. createWorkspace() called
   - Creates Cloud token
   - Calls createNxCloudOnboardingUrl()

4. createNxCloudOnboardingUrl() builds URL
   - Gets success message variant code
   - Passes code as 3rd parameter (meta)
   - URL contains: ?meta=ci-setup-visit or ?meta=remote-cache-visit

5. recordStat() tracks telemetry
   - Calls: messages.codeOfSelectedPromptMessage('setupCI')
   - Calls: messages.codeOfSelectedPromptMessage('setupNxCloud')
   - Sends meta array to cloud.nx.app/nx-cloud/stats
```

### Current Problem (Template Flow)

**What's missing in template flow**:
```
User runs: npx create-nx-workspace (template flow)

1. determineNxCloudSimple() shows prompt ← NEW
   - Variants: simple-cloud-v1, simple-cloud-v2, simple-cloud-v3
   - Randomly selects variant
   - Code stored in PromptMessages.selectedMessages['setupNxCloudSimple']

2. User chooses option (yes/skip)

3. createWorkspace() called
   - Creates Cloud token
   - Calls createNxCloudOnboardingUrl()

4. createNxCloudOnboardingUrl() builds URL
   - Gets success message variant code only
   - ❌ MISSING: Doesn't include prompt variant code
   - URL contains: ?meta=template-cloud-connect-v1

5. recordStat() tracks telemetry
   - ❌ MISSING: Doesn't call messages.codeOfSelectedPromptMessage('setupNxCloudSimple')
   - Only tracks setupCI and setupNxCloud (preset flow codes)
```

---

## Solution Design

### Option 1: Pass Prompt Code Through Function Chain (Recommended)

**Pros**:
- Explicit and type-safe
- Easier to debug
- Clear data flow

**Cons**:
- Requires updating multiple function signatures
- More changes to code

**Implementation**:

1. **Capture prompt code after user chooses** (bin/create-nx-workspace.ts)
2. **Pass to createWorkspace** via new optional parameter
3. **Pass to createNxCloudOnboardingUrl** via new optional parameter
4. **Combine with success message code** in meta string
5. **Track in recordStat** with new code

---

## Detailed Implementation Plan

### Phase 1: Define Simplified Meta Codes

**File**: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`
**Lines**: 61-101 (setupNxCloudSimple variants)

**Change**: Add short meta codes for tracking

**Current**:
```typescript
setupNxCloudSimple: [
  {
    code: 'simple-cloud-v1',
    message: 'Get to green PRs faster with Nx Cloud?',
    // ...
  },
  {
    code: 'simple-cloud-v2',
    message: 'Would you like to enable remote caching with Nx Cloud?',
    // ...
  },
  {
    code: 'simple-cloud-v3',
    message: 'Speed up CI and reduce compute costs with Nx Cloud?',
    // ...
  },
]
```

**New**: Add `metaCode` field for short, meaningful tracking codes
```typescript
setupNxCloudSimple: [
  {
    code: 'simple-cloud-v1',
    metaCode: 'green-prs',  // ← NEW: Short code for tracking
    message: 'Get to green PRs faster with Nx Cloud?',
    // ...
  },
  {
    code: 'simple-cloud-v2',
    metaCode: 'remote-cache',  // ← NEW: Short code for tracking
    message: 'Would you like to enable remote caching with Nx Cloud?',
    // ...
  },
  {
    code: 'simple-cloud-v3',
    metaCode: 'fast-ci',  // ← NEW: Short code for tracking
    message: 'Speed up CI and reduce compute costs with Nx Cloud?',
    // ...
  },
]
```

**Update MessageData interface**:
```typescript
interface MessageData {
  code: string;
  metaCode?: string;  // ← NEW: Optional short code for URL meta
  message: string;
  initial: number;
  choices: Array<{ value: string; name: string }>;
  footer: string;
  hint?: string;
  fallback?: { value: string; key: MessageKey };
}
```

**Add getter method in PromptMessages class**:
```typescript
// ab-testing.ts ~line 139
metaCodeOfSelectedPromptMessage(key: MessageKey): string {
  const selected = this.selectedMessages[key];
  if (selected === undefined) {
    return '';
  } else {
    const message = messageOptions[key][selected];
    return message.metaCode || message.code;  // Fallback to code if no metaCode
  }
}
```

**Why metaCode?**
- Short, meaningful codes for URL tracking (e.g., `meta=green-prs` instead of `meta=simple-cloud-v1`)
- Easier to read in analytics dashboards
- Future-proof: can change variant codes without breaking tracking

---

### Phase 2: Capture Prompt Code in CLI

**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts`
**Lines**: 342-362 (template flow in normalizeArgsMiddleware)

**Change**: Store prompt code after user chooses

**Current**:
```typescript
if (template !== 'skip') {
  // Template flow - skip preset prompts
  argv.template = template;
  const packageManager = await determinePackageManager(argv);
  const aiAgents = await determineAiAgents(argv);
  const defaultBase = await determineDefaultBase(argv);
  const nxCloud =
    argv.skipGit === true ? 'skip' : await determineNxCloudSimple(argv);
  const useGitHub =
    nxCloud === 'skip'
      ? undefined
      : await determineIfGitHubWillBeUsed(argv);
  Object.assign(argv, {
    nxCloud,
    useGitHub,
    packageManager,
    defaultBase,
    aiAgents,
  });
}
```

**New**: Capture prompt meta code after prompt is shown
```typescript
if (template !== 'skip') {
  // Template flow - skip preset prompts
  argv.template = template;
  const packageManager = await determinePackageManager(argv);
  const aiAgents = await determineAiAgents(argv);
  const defaultBase = await determineDefaultBase(argv);
  const nxCloud =
    argv.skipGit === true ? 'skip' : await determineNxCloudSimple(argv);

  // Capture prompt variant code for tracking
  const nxCloudPromptCode =
    nxCloud === 'skip'
      ? undefined
      : messages.metaCodeOfSelectedPromptMessage('setupNxCloudSimple');  // ← NEW

  const useGitHub =
    nxCloud === 'skip'
      ? undefined
      : await determineIfGitHubWillBeUsed(argv);
  Object.assign(argv, {
    nxCloud,
    nxCloudPromptCode,  // ← NEW: Store for later use
    useGitHub,
    packageManager,
    defaultBase,
    aiAgents,
  });
}
```

**Why after prompt?**
- The variant is randomly selected when `determineNxCloudSimple` is called
- We must call the getter AFTER the prompt is shown
- Can't call it in createWorkspace because the PromptMessages state is in the CLI process

---

### Phase 3: Update TypeScript Interfaces

**File**: `packages/create-nx-workspace/src/create-workspace-options.ts`
**Lines**: 4-42

**Change**: Add `nxCloudPromptCode` property

**Current**:
```typescript
export interface CreateWorkspaceOptions {
  name: string;
  packageManager: PackageManager;
  nxCloud: NxCloud;
  useGitHub?: boolean;
  template?: string;
  interactive?: boolean;
  defaultBase?: string;
  skipGit?: boolean;
  skipGitHubPush?: boolean;
  verbose?: boolean;
  commit?: { /* ... */ };
  cliName?: string;
  aiAgents?: Agent[];
}
```

**New**: Add tracking field
```typescript
export interface CreateWorkspaceOptions {
  name: string;
  packageManager: PackageManager;
  nxCloud: NxCloud;
  useGitHub?: boolean;
  template?: string;
  nxCloudPromptCode?: string;  // ← NEW: Prompt variant meta code for tracking
  interactive?: boolean;
  defaultBase?: string;
  skipGit?: boolean;
  skipGitHubPush?: boolean;
  verbose?: boolean;
  commit?: { /* ... */ };
  cliName?: string;
  aiAgents?: Agent[];
}
```

---

### Phase 4: Pass Through to createNxCloudOnboardingUrl

**File**: `packages/create-nx-workspace/src/create-workspace.ts`
**Lines**: 100-106

**Change**: Pass prompt code to URL generator

**Current**:
```typescript
connectUrl = await createNxCloudOnboardingUrl(
  nxCloud,
  token,
  directory,
  useGitHub,
  isTemplate
);
```

**New**: Add prompt code parameter
```typescript
connectUrl = await createNxCloudOnboardingUrl(
  nxCloud,
  token,
  directory,
  useGitHub,
  isTemplate,
  options.nxCloudPromptCode  // ← NEW: Pass prompt variant code
);
```

---

### Phase 5: Update createNxCloudOnboardingUrl Function

**File**: `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts`
**Lines**: 45-71

**Change**: Combine prompt code with success message code in meta

**Current**:
```typescript
export async function createNxCloudOnboardingUrl(
  nxCloud: NxCloud,
  token: string,
  directory: string,
  useGitHub?: boolean,
  isTemplate?: boolean
) {
  const { createNxCloudOnboardingURL } = require(require.resolve(
    'nx/src/nx-cloud/utilities/url-shorten',
    { paths: [directory] }
  )) as any;

  const source = getCloudMessageSource(!!isTemplate, nxCloud);
  const { code } = getMessageFactory(source);
  return await createNxCloudOnboardingURL(
    source,
    token,
    code,  // ← Currently only success message variant
    false,
    useGitHub ?? (nxCloud === 'yes' || nxCloud === 'github' || nxCloud === 'circleci')
  );
}
```

**New**: Build combined meta code
```typescript
export async function createNxCloudOnboardingUrl(
  nxCloud: NxCloud,
  token: string,
  directory: string,
  useGitHub?: boolean,
  isTemplate?: boolean,
  promptCode?: string  // ← NEW: Prompt variant meta code
) {
  const { createNxCloudOnboardingURL } = require(require.resolve(
    'nx/src/nx-cloud/utilities/url-shorten',
    { paths: [directory] }
  )) as any;

  const source = getCloudMessageSource(!!isTemplate, nxCloud);
  const { code: successMessageCode } = getMessageFactory(source);

  // Combine prompt code with success message code
  // Format: "prompt-code:success-code" or just "success-code" if no prompt
  const meta = promptCode
    ? `${promptCode}:${successMessageCode}`
    : successMessageCode;

  return await createNxCloudOnboardingURL(
    source,
    token,
    meta,  // ← NEW: Combined meta code
    false,
    useGitHub ?? (nxCloud === 'yes' || nxCloud === 'github' || nxCloud === 'circleci')
  );
}
```

**Meta format examples**:
- Template flow with prompt: `meta=green-prs:template-cloud-connect-v2`
- Template flow without prompt (--nxCloud flag): `meta=template-cloud-connect-v2`
- Preset flow (no change): `meta=ci-setup-visit`

**Why combine?**
- Single meta field preserves compatibility with existing infrastructure
- Colon separator is clear and easy to parse
- Can still track both prompt AND success message variants

---

### Phase 6: Update getNxCloudInfo

**File**: `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts`
**Lines**: 73-93

**Change**: Pass prompt code through (for consistency, not used in this function)

**Current**:
```typescript
export async function getNxCloudInfo(
  nxCloud: NxCloud,
  connectCloudUrl: string,
  pushedToVcs: VcsPushStatus,
  rawNxCloud?: NxCloud,
  isTemplate?: boolean
) {
  // ...
}
```

**New**: Add parameter (not used in function body, but keeps signature consistent)
```typescript
export async function getNxCloudInfo(
  nxCloud: NxCloud,
  connectCloudUrl: string,
  pushedToVcs: VcsPushStatus,
  rawNxCloud?: NxCloud,
  isTemplate?: boolean,
  promptCode?: string  // ← NEW: For consistency
) {
  // Function body unchanged - promptCode not needed here
  // It's already in the connectCloudUrl
}
```

---

### Phase 7: Update Call in createWorkspace

**File**: `packages/create-nx-workspace/src/create-workspace.ts`
**Lines**: 136-144

**Change**: Pass prompt code to getNxCloudInfo

**Current**:
```typescript
if (connectUrl) {
  nxCloudInfo = await getNxCloudInfo(
    nxCloud,
    connectUrl,
    pushedToVcs,
    rawArgs?.nxCloud,
    isTemplate
  );
}
```

**New**: Add prompt code parameter
```typescript
if (connectUrl) {
  nxCloudInfo = await getNxCloudInfo(
    nxCloud,
    connectUrl,
    pushedToVcs,
    rawArgs?.nxCloud,
    isTemplate,
    options.nxCloudPromptCode  // ← NEW
  );
}
```

---

### Phase 8: Track in recordStat

**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts`
**Lines**: 274-285

**Change**: Add setupNxCloudSimple code to meta array

**Current**:
```typescript
await recordStat({
  nxVersion,
  command: 'create-nx-workspace',
  useCloud: parsedArgs.nxCloud !== 'skip',
  meta: [
    messages.codeOfSelectedPromptMessage('setupCI'),
    messages.codeOfSelectedPromptMessage('setupNxCloud'),
    parsedArgs.nxCloud,
    rawArgs.nxCloud,
    workspaceInfo.pushedToVcs,
  ],
});
```

**New**: Include template prompt code
```typescript
await recordStat({
  nxVersion,
  command: 'create-nx-workspace',
  useCloud: parsedArgs.nxCloud !== 'skip',
  meta: [
    messages.codeOfSelectedPromptMessage('setupCI'),           // Preset: CI provider prompt
    messages.codeOfSelectedPromptMessage('setupNxCloud'),      // Preset: yes/no prompt
    messages.codeOfSelectedPromptMessage('setupNxCloudSimple'), // ← NEW: Template prompt
    parsedArgs.nxCloud,
    rawArgs.nxCloud,
    workspaceInfo.pushedToVcs,
  ],
});
```

**Why add to meta array?**
- Sends prompt variant to cloud.nx.app/nx-cloud/stats endpoint
- Separate from URL meta (different tracking mechanism)
- Allows cross-analysis: recordStat tracks overall usage, URL meta tracks conversion

---

## Testing Plan

### Unit Tests to Add

**File**: `packages/create-nx-workspace/src/utils/nx/ab-testing.spec.ts` (if exists) or create new

```typescript
describe('PromptMessages', () => {
  describe('metaCodeOfSelectedPromptMessage', () => {
    it('should return metaCode when available', () => {
      const messages = new PromptMessages();
      messages.getPrompt('setupNxCloudSimple'); // Triggers selection
      const metaCode = messages.metaCodeOfSelectedPromptMessage('setupNxCloudSimple');
      expect(['green-prs', 'remote-cache', 'fast-ci']).toContain(metaCode);
    });

    it('should return empty string when prompt not shown', () => {
      const messages = new PromptMessages();
      const metaCode = messages.metaCodeOfSelectedPromptMessage('setupNxCloudSimple');
      expect(metaCode).toBe('');
    });

    it('should fallback to code when metaCode not defined', () => {
      // Test with prompt that doesn't have metaCode
      const messages = new PromptMessages();
      messages.getPrompt('setupCI');
      const code = messages.metaCodeOfSelectedPromptMessage('setupCI');
      expect(code).toBeTruthy();
    });
  });
});
```

### Integration Tests

**Manual testing script**:
```bash
# Test 1: Template flow with Cloud
cd /tmp
npx create-nx-workspace@local test-template-1
# Choose: React template
# Choose: Yes, set up Nx Cloud
# Verify: Console shows URL with meta containing both codes
# Example: ?meta=green-prs:template-cloud-connect-v2

# Test 2: Template flow via CLI flag
npx create-nx-workspace@local test-template-2 --template nrwl/react-template
# Should skip prompt, no prompt code in meta
# Verify: URL meta contains only success message code

# Test 3: Preset flow (regression test)
npx create-nx-workspace@local test-preset-1 --preset react-standalone
# Should use old flow, no template prompt code
# Verify: Works as before, no regression

# Test 4: Template flow without Cloud
npx create-nx-workspace@local test-template-3 --template nrwl/react-template --nxCloud skip
# Should not create URL
# Verify: No URL generated, no errors
```

### E2E Test Scenarios

**File**: `e2e/create-nx-workspace-template/create-nx-workspace-template.test.ts` (or similar)

```typescript
it('should include prompt code in Cloud URL for template flow', async () => {
  const projectName = uniq('template-cloud-tracking');

  // Run with template
  runCreateWorkspace(projectName, {
    template: 'nrwl/react-template',
    nxCloud: 'yes',
  });

  // Read the output
  const output = getCLIOutput();

  // Extract URL from output
  const urlMatch = output.match(/https:\/\/[^\s]+\/connect\/[^\s]+/);
  expect(urlMatch).toBeDefined();

  const url = urlMatch[0];
  const urlObj = new URL(url);

  // Check meta parameter format
  const meta = urlObj.searchParams.get('meta') || '';

  // Should have format: "prompt-code:success-code"
  expect(meta).toMatch(/^(green-prs|remote-cache|fast-ci):/);
  expect(meta).toContain('template-cloud-connect');
});
```

---

## Implementation Checklist

### Before Starting
- [ ] Read through entire plan to understand flow
- [ ] Check if any Nx core changes needed (createNxCloudOnboardingURL signature)
- [ ] Verify current tests pass: `nx run create-nx-workspace:test`

### Phase 1: Add metaCode to variants
- [ ] Update MessageData interface with `metaCode?: string`
- [ ] Add metaCode to all 3 setupNxCloudSimple variants
- [ ] Add `metaCodeOfSelectedPromptMessage()` method to PromptMessages class
- [ ] Format code with prettier
- [ ] Verify types: `nx run create-nx-workspace:typecheck`

### Phase 2: Capture in CLI
- [ ] Update normalizeArgsMiddleware to capture prompt code
- [ ] Store in argv.nxCloudPromptCode
- [ ] Test manually: console.log the captured code

### Phase 3: Update interfaces
- [ ] Add nxCloudPromptCode to CreateWorkspaceOptions
- [ ] Verify types: `nx run create-nx-workspace:typecheck`

### Phase 4-7: Pass through chain
- [ ] Update createWorkspace call site (pass promptCode)
- [ ] Update createNxCloudOnboardingUrl signature
- [ ] Update createNxCloudOnboardingUrl implementation (combine codes)
- [ ] Update getNxCloudInfo signature
- [ ] Update getNxCloudInfo call site
- [ ] Format code with prettier
- [ ] Verify types: `nx run create-nx-workspace:typecheck`

### Phase 8: Track in recordStat
- [ ] Add setupNxCloudSimple to meta array
- [ ] Format code with prettier

### Testing
- [ ] Run unit tests: `nx run create-nx-workspace:test`
- [ ] Run manual tests (all 4 scenarios above)
- [ ] Check URL format in browser/console
- [ ] Verify meta parameter includes prompt code
- [ ] Test preset flow (regression test)

### Final
- [ ] Update task markdown with completion status
- [ ] Run prepush: `nx prepush`
- [ ] Create commit with descriptive message
- [ ] Update .ai/TODO.md

---

## Success Criteria

### Must Have
- ✅ Template prompt variant code appears in Cloud URL meta parameter
- ✅ Format: `meta=green-prs:template-cloud-connect-v2` (or similar)
- ✅ recordStat includes setupNxCloudSimple code
- ✅ All tests passing
- ✅ Preset flow unchanged (no regression)

### Should Have
- ✅ E2E test verifying URL format
- ✅ Manual testing of all 4 scenarios passes
- ✅ Code follows existing patterns

### Nice to Have
- Unit tests for metaCodeOfSelectedPromptMessage
- Documentation of meta format in code comments

---

## Potential Issues & Solutions

### Issue 1: PromptMessages state not accessible in createWorkspace

**Problem**: The PromptMessages instance is in the CLI process, createWorkspace runs in a different context

**Solution**: ✅ Capture the code in normalizeArgsMiddleware (before createWorkspace) and pass it through

### Issue 2: Meta format breaks existing parsing

**Problem**: Nx Cloud expects specific meta format

**Solution**: Use colon separator which is unlikely to conflict. Nx Cloud can easily parse "prompt:success" format.

### Issue 3: Missing prompt code when --nxCloud flag used

**Problem**: When user provides --nxCloud flag, prompt is skipped, no code selected

**Solution**: ✅ Check if nxCloud === 'skip', only set promptCode if prompt was actually shown

### Issue 4: Breaking changes to function signatures

**Problem**: Adding parameters to exported functions may break consumers

**Solution**: ✅ All new parameters are optional (promptCode?: string), backward compatible

---

## Rollback Plan

If issues discovered after merge:

1. **Quick fix**: Remove promptCode from meta, just track in recordStat
   ```typescript
   // In createNxCloudOnboardingUrl
   const meta = successMessageCode;  // Remove prompt code
   ```

2. **Full rollback**: Revert commit
   ```bash
   git revert <commit-hash>
   ```

3. **Feature flag**: Add environment variable to disable
   ```typescript
   const includePromptCode = process.env.NX_TRACK_PROMPT_CODE !== 'false';
   ```

---

## Timeline Estimate

| Phase | Time | Notes |
|-------|------|-------|
| Phase 1: Add metaCode | 30 min | Define codes, update interface |
| Phase 2: Capture in CLI | 15 min | Simple getter call |
| Phase 3: Update interfaces | 10 min | Add one property |
| Phases 4-7: Pass through | 45 min | Update 4 functions |
| Phase 8: recordStat | 10 min | Add one line |
| Testing | 1 hour | Manual + verify |
| **Total** | **2.5 hours** | Can split across sessions |

---

## Context for Continuation

**If you need to continue this task later, here's what you need to know:**

### What We're Doing
Adding tracking for template prompt variants so Nx Cloud can measure which prompt message drives the most connections.

### Key Files
1. `ab-testing.ts` - Define metaCode for variants
2. `create-nx-workspace.ts` (bin) - Capture code after prompt
3. `create-workspace-options.ts` - Add interface property
4. `create-workspace.ts` - Pass code through
5. `nx-cloud.ts` - Combine codes in meta parameter

### Critical Points
- Must capture code AFTER prompt is shown (in normalizeArgsMiddleware)
- Must pass through entire function chain
- Meta format: `prompt-code:success-code`
- Optional parameter (backward compatible)
- Track in both URL meta AND recordStat

### How to Resume
1. Read "Current State Analysis" section
2. Pick up at next unchecked box in Implementation Checklist
3. Reference "Detailed Implementation Plan" for exact code changes
4. Test each phase before moving to next

### Questions to Ask if Stuck
- Is PromptMessages.selectedMessages populated? (Check after determineNxCloudSimple)
- Is promptCode being passed through all functions? (Add console.logs)
- Is meta format correct in URL? (Check browser dev tools)
- Are tests still passing? (Run nx run create-nx-workspace:test)
