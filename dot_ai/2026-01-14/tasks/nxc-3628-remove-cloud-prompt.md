# NXC-3628: Remove Cloud Prompt from CNW for Variant 1

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3628
**Branch**: NXC-3628

## Summary

For CNW A/B testing **variant 1**, remove the cloud prompt and always show the platform link. This means:
1. No more "Try the full Nx platform?" question
2. Skip `connectToNxCloudForTemplate()` - no nxCloudId in nx.json
3. Always generate onboarding URL using GitHub flow (no token needed)
4. Show github.com/new link when user hasn't pushed
5. Track GH CLI availability in telemetry

**Variant 0** = current behavior (with cloud prompt) - unchanged.
**Variant 1** = new behavior (skip cloud prompt, always show link).

Note: Both variants now use the template flow (preset flow was removed). The variant only controls whether the cloud prompt is shown.

## Key Insight

The `createNxCloudOnboardingURL()` function in `url-shorten.ts:38` sends `accessToken: null` when using GitHub flow. This means we can generate a valid onboarding URL without calling `connectToNxCloudForTemplate()`.

## Token Flow Comparison

### Variant 0 - Current Behavior (cloud prompt shown)
```
1. determineNxCloudV2() → User sees "Try the full Nx platform?" → picks 'yes'
2. connectToNxCloudForTemplate() → Generates nxCloudId in nx.json
3. readNxCloudToken() → Shows spinner, reads nxCloudId from nx.json
4. createNxCloudOnboardingUrl(token) → Passes token to API
5. API returns short URL with token embedded
```

### Variant 1 - New Behavior (no cloud prompt)
```
1. Skip prompt → nxCloud = 'yes' (always, unless --nxCloud=skip)
2. Skip connectToNxCloudForTemplate() → No nxCloudId in nx.json
3. Skip readNxCloudToken() → No misleading spinner, no token to read
4. createNxCloudOnboardingUrl(undefined) → Passes undefined token
5. url-shorten.ts:38 → usesGithub=true → accessToken: null
6. API returns short URL based on GitHub repo (from git remote)
```

---

## Implementation Steps

### 1. Add GH CLI Detection Utility

**File**: `packages/create-nx-workspace/src/utils/git/git.ts`

Add a new function after `isGitAvailable()` (~line 44):

```typescript
export function isGhCliAvailable(): boolean {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
```

---

### 2. Modify Template Flow in CLI Entry Point

**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts`
**Lines**: 455-487

Add conditional logic based on variant. Variant 0 = current behavior, Variant 1 = skip prompt.

**Before** (lines 459-464):
```typescript
const nxCloud =
  argv.skipGit === true ? 'skip' : await determineNxCloudV2(argv);
const completionMessageKey =
  nxCloud === 'skip'
    ? undefined
    : messages.completionMessageOfSelectedPrompt('setupNxCloudV2');
```

**After**:
```typescript
// Track GH CLI availability for telemetry
const ghAvailable = isGhCliAvailable();

let nxCloud: string;
let completionMessageKey: CompletionMessageKey | undefined;

if (argv.skipGit === true) {
  nxCloud = 'skip';
  completionMessageKey = undefined;
} else if (getFlowVariant() === '1') {
  // Variant 1: Skip cloud prompt, always show platform link
  // Respect --nxCloud=skip if explicitly provided
  nxCloud = argv.nxCloud === 'skip' ? 'skip' : 'yes';
  completionMessageKey = nxCloud === 'skip' ? undefined : 'platform-setup';
} else {
  // Variant 0: Current behavior - show cloud prompt
  nxCloud = await determineNxCloudV2(argv);
  completionMessageKey = nxCloud === 'skip'
    ? undefined
    : messages.completionMessageOfSelectedPrompt('setupNxCloudV2');
}
```

**Update Object.assign** (line 466-473):
```typescript
Object.assign(argv, {
  nxCloud,
  useGitHub: nxCloud !== 'skip',
  completionMessageKey,
  packageManager,
  defaultBase: 'main',
  aiAgents,
  ghAvailable,  // Add for telemetry
});
```

**Add import** at top of file:
```typescript
import { isGhCliAvailable } from '../src/utils/git/git';
```

---

### 3. Update Telemetry Interfaces

**File**: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`

Add `ghAvailable` to the precreate interface (~line 35):

```typescript
export interface RecordStatMetaPrecreate {
  type: 'precreate';
  flowVariant: string;
  template: string;
  preset: string;
  nodeVersion: string;
  packageManager: string;
  ghAvailable?: string;  // Add this
}
```

---

### 4. Track GH Availability in Telemetry

**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts`
**Lines**: 475-487

Update the recordStat call for template flow:

```typescript
await recordStat({
  nxVersion,
  command: 'create-nx-workspace',
  useCloud: nxCloud !== 'skip',
  meta: {
    type: 'precreate',
    flowVariant: getFlowVariant(),
    template: chosenTemplate,
    preset: '',
    nodeVersion: process.versions.node ?? '',
    packageManager,
    ghAvailable: ghAvailable ? 'true' : 'false',  // Add this
  },
});
```

---

### 5. Skip Cloud Connection for Variant 1

**File**: `packages/create-nx-workspace/src/create-workspace.ts`
**Lines**: 110-117

Need to pass the variant to `createWorkspace()` or check a flag to know whether to skip connection.

**Option A**: Pass a new `skipCloudConnect` option from CLI entry point
**Option B**: Check if we're in variant 1 using `getFlowVariant()`

Using Option A (cleaner separation of concerns):

**Before**:
```typescript
// Connect to Nx Cloud for template flow
if (nxCloud !== 'skip') {
  await connectToNxCloudForTemplate(
    directory,
    'create-nx-workspace',
    useGitHub
  );
}
```

**After**:
```typescript
// Connect to Nx Cloud for template flow
// For variant 1 (NXC-3628): Skip connection, use GitHub flow for URL generation
if (nxCloud !== 'skip' && !options.skipCloudConnect) {
  await connectToNxCloudForTemplate(
    directory,
    'create-nx-workspace',
    useGitHub
  );
}
```

**Also update CLI entry point** to pass the flag:
```typescript
// In bin/create-nx-workspace.ts, Object.assign:
Object.assign(argv, {
  nxCloud,
  useGitHub: nxCloud !== 'skip',
  completionMessageKey,
  packageManager,
  defaultBase: 'main',
  aiAgents,
  ghAvailable,
  skipCloudConnect: getFlowVariant() === '1',  // Add for variant 1
});
```

---

### 6. Handle URL Generation Without Token

**File**: `packages/create-nx-workspace/src/create-workspace.ts`
**Lines**: 192-200

For variant 1:
- **Skip `readNxCloudToken()`** - it shows "Checking Nx Cloud setup" spinner which would be misleading
- Pass `undefined` directly to `createNxCloudOnboardingUrl()`
- The GitHub flow sends `accessToken: null` to the API (see url-shorten.ts:38)

**Before**:
```typescript
if (nxCloud !== 'skip') {
  const token = readNxCloudToken(directory) as string;

  connectUrl = await createNxCloudOnboardingUrl(
    nxCloud,
    token,
    directory,
    useGitHub
  );
```

**After**:
```typescript
if (nxCloud !== 'skip') {
  // For variant 1 (skipCloudConnect=true): Skip readNxCloudToken() entirely
  // - We didn't call connectToNxCloudForTemplate(), so no token exists
  // - The spinner message "Checking Nx Cloud setup" would be misleading
  // - createNxCloudOnboardingUrl() uses GitHub flow which sends accessToken: null
  //
  // For variant 0: Read the token as before (cloud was connected)
  const token = options.skipCloudConnect ? undefined : readNxCloudToken(directory);

  connectUrl = await createNxCloudOnboardingUrl(
    nxCloud,
    token,  // undefined for variant 1
    directory,
    useGitHub
  );
```

---

### 7. Update CreateWorkspaceOptions Interface

**File**: `packages/create-nx-workspace/src/create-workspace-options.ts`

Add `skipCloudConnect` and `ghAvailable` to the interface:

```typescript
export interface CreateWorkspaceOptions {
  // ... existing options
  skipCloudConnect?: boolean;  // For variant 1: skip cloud connection
  ghAvailable?: boolean;       // For telemetry tracking
}
```

---

### 8. Update createNxCloudOnboardingUrl Signature

**File**: `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts`
**Lines**: 75-109

Change `token: string` to `token?: string`:

```typescript
export async function createNxCloudOnboardingUrl(
  nxCloud: NxCloud,
  token: string | undefined,  // Allow undefined for variant 1
  directory: string,
  useGitHub?: boolean
): Promise<string> {
```

---

### 9. Update Completion Message with github.com/new Link

**File**: `packages/create-nx-workspace/src/utils/nx/messages.ts`

Find the `getSetupMessage` or equivalent function and update to include github.com/new hint when push failed.

Locate where the completion message is built and add:
```typescript
// When user hasn't pushed, include github.com/new link
if (pushedToVcs !== VcsPushStatus.PushedToVcs) {
  // Include: "Push your repo (https://github.com/new), then go to Nx Cloud..."
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `packages/create-nx-workspace/src/utils/git/git.ts` | Add `isGhCliAvailable()` function |
| `packages/create-nx-workspace/bin/create-nx-workspace.ts` | Conditional logic for variant 1 (skip cloud prompt), add GH tracking |
| `packages/create-nx-workspace/src/utils/nx/ab-testing.ts` | Add `ghAvailable` to telemetry interface |
| `packages/create-nx-workspace/src/create-workspace.ts` | Conditionally skip `connectToNxCloudForTemplate()` and `readNxCloudToken()` |
| `packages/create-nx-workspace/src/create-workspace-options.ts` | Add `skipCloudConnect?: boolean` and `ghAvailable?: boolean` |
| `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts` | Make `token` parameter optional |
| `packages/create-nx-workspace/src/utils/nx/messages.ts` | Add github.com/new hint to completion message |

---

## Edge Cases

1. **`--skipGit` flag**: Sets `nxCloud = 'skip'`, no cloud output (unchanged behavior)
2. **`--nxCloud=skip` explicit**: Respect user's choice to skip cloud
3. **Non-interactive mode**: No prompt shown anyway, behavior unchanged
4. **GH CLI not installed**: Track in telemetry, github.com/new link still shown

---

## Verification

1. **Test variant 1 (new behavior - no cloud prompt)**:
   ```bash
   NX_CNW_FLOW_VARIANT=1 npx create-nx-workspace@local test-ws
   ```
   - Verify NO cloud prompt is shown
   - Verify URL is generated and displayed
   - Verify NO `nxCloudId` in `nx.json`
   - Verify github.com/new link shown if not pushed

2. **Test variant 0 (current behavior)** - regression test:
   ```bash
   NX_CNW_FLOW_VARIANT=0 npx create-nx-workspace@local test-ws
   ```
   - Verify cloud prompt IS shown (unchanged behavior)
   - Verify nxCloudId IS in nx.json

3. **Run tests**:
   ```bash
   nx run-many -t test,build,lint -p create-nx-workspace
   nx affected -t e2e-local
   ```

---

## Implementation Status ✅

All steps completed on 2026-01-14.

### Additional Changes Made

#### 10. Fix Expired Cache File Bug

**File**: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`

Fixed bug where expired cache files were not deleted, causing 50-50 randomization on every run after expiry instead of locking to a new variant.

```typescript
function readCachedFlowVariant(): string | null {
  try {
    if (!existsSync(FLOW_VARIANT_CACHE_FILE)) return null;
    const stats = statSync(FLOW_VARIANT_CACHE_FILE);
    if (Date.now() - stats.mtimeMs > FLOW_VARIANT_EXPIRY_MS) {
      // Delete expired file so a new variant can be written
      try {
        unlinkSync(FLOW_VARIANT_CACHE_FILE);
      } catch {
        // Ignore delete errors
      }
      return null;
    }
    // ... rest of function
  }
}
```

#### 11. Add Flow Variant to Short URL Meta

**File**: `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts`

Pass flow variant in meta property for cloud analytics tracking:

```typescript
const meta = `variant-${getFlowVariant()}`;
```

This allows cloud analytics to distinguish between variant-0 and variant-1 users.

#### 12. Update Snapshot Tests

**File**: `packages/create-nx-workspace/src/utils/nx/messages.spec.ts`

Updated 8 inline snapshots to include the new `(https://github.com/new)` text in push messages.

---

## Follow-up Tasks

### ASCII Banner A/B Testing (Future)

When implementing A/B testing for the final Nx Cloud completion message format (ASCII banner vs bordered/highlighted message), we need to:

1. **Include message format in short URL meta** - The meta property should indicate which message format was shown:
   - `variant-0-banner` or `variant-0-bordered`
   - `variant-1-banner` or `variant-1-bordered`

2. **Track in cloud analytics** - This allows us to correlate:
   - Which message format users saw
   - Whether they clicked through to complete setup
   - Conversion rates per format

3. **Implementation approach**:
   ```typescript
   // Example: include both flow variant and message format
   const messageFormat = useAsciiBanner ? 'banner' : 'bordered';
   const meta = `variant-${getFlowVariant()}-${messageFormat}`;
   ```

**Linear Issue**: TBD - Create follow-up issue for ASCII banner A/B testing
