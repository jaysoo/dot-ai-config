# NXC-3504: Fix Storybook Migration Hanging During nx migrate

**Linear Issue:** https://linear.app/nxdev/issue/NXC-3504/storybook-migration-hangs-during-nx-migrate
**GitHub Issue:** https://github.com/nrwl/nx/issues/32492
**Date:** 2025-11-21

## Problem Summary

When users run `nx migrate --run-migrations`, the Storybook migration to v9 hangs indefinitely because user prompts from the Storybook CLI are "swallowed" - stdin is not properly connected from the parent process to the child process.

## Three Solution Options

### 📊 Quick Comparison

| Aspect | Plan A (stdio fix) | Plan B (non-interactive) | Plan C (hybrid) ⭐ |
|--------|-------------------|-------------------------|-------------------|
| **Code changes** | 1 line | ~5 lines | ~7 lines |
| **Fixes hanging?** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Works with 100 apps?** | ❌ 100 prompts | ✅ 0 prompts | ✅ 0 prompts |
| **Works in CI?** | ❌ Needs stdin | ✅ Yes | ✅ Yes |
| **Allows prompts?** | ✅ Always | ❌ Never | ✅ When wanted |
| **Auto-installs packages?** | ✅ Yes | ❌ No | ❌ No |

### Plan A: Fix stdio to Allow User Prompts (Simple)
**Change:** `stdio: 'inherit'` → `stdio: [0, 1, 2]` (line 92)

**Best for:** Small repos with 1-5 Storybook projects

**Pros:**
- ✅ One-line fix
- ✅ Packages auto-install
- ✅ Users see what's happening

**Cons:**
- ❌ **100 Storybook apps = 100 prompts** (terrible DX)
- ❌ Doesn't work in CI (needs interactive terminal)

### Plan B: Add Non-Interactive Flags (Robust)
**Changes:** Fix stdio + add `--skip-install` flag + `CI=true` env var

**Best for:** Always forcing non-interactive mode

**Pros:**
- ✅ Great DX for large repos (0 prompts)
- ✅ Works in CI
- ✅ Fast, uninterrupted

**Cons:**
- ❌ Users can never see prompts (even when running manually)
- ⚠️ Manual `pnpm install` needed after

### Plan C: Hybrid Approach ⭐ (RECOMMENDED)
**Changes:** Fix stdio + add `--skip-install` only when `autoAcceptAllPrompts=true`

**Best for:** All scenarios - handles both migrations and manual runs

**Implementation:**
```typescript
const flags = schema.autoAcceptAllPrompts
  ? '--yes --skip-install'  // Non-interactive for migrations
  : '';                      // Interactive for manual runs

execSync(`${commandToRun} ${flags}`, {
  stdio: [0, 1, 2],  // Always fix stdio
  // ... rest
});
```

**Why Plan C wins:**
- ✅ Migrations (most common): Non-interactive, works with 100+ projects
- ✅ CI: Works perfectly (`autoAcceptAllPrompts=true` by default)
- ✅ Manual runs: Users can opt into prompts if they want
- ✅ Clear messaging: Tell users to run `pnpm install` after
- ✅ Backwards compatible: Doesn't break existing behavior

## Investigation Findings

### Current Implementation

**File:** `packages/storybook/src/generators/migrate-9/calling-storybook-cli.ts:55-118`

The `callAutomigrate` function:
- Line 81: Constructs command as `${pm.dlx} storybook automigrate --config-dir ${storybookProjectInfo.configDir}`
- Line 90: Adds `--yes` flag when `schema.autoAcceptAllPrompts` is true
- Line 92: Uses `stdio: 'inherit'` which doesn't work properly in migration context

**File:** `packages/storybook/src/migrations/update-21-1-0/update-sb-9.ts:29-33`

The migration script:
- Calls `migrate9Generator` with `autoAcceptAllPrompts: true`
- This should make the process non-interactive, but it doesn't fully work

### Root Cause

**The stdio configuration inconsistency:**

In the same file, there are two functions with different stdio configurations:
- `callUpgrade` (line 27): Uses `stdio: [0, 1, 2]` - explicitly pipes stdin, stdout, stderr
- `callAutomigrate` (line 92): Uses `stdio: 'inherit'` - inherits from parent process

**Why this matters:**

When `nx migrate --run-migrations` runs as a subprocess, `stdio: 'inherit'` doesn't properly connect the user's stdin to the child process. The explicit file descriptor approach `[0, 1, 2]` ensures:
- `0` = stdin (allows user input to flow through)
- `1` = stdout (output to terminal)
- `2` = stderr (error output)

This prevents prompts from being "swallowed" because stdin is explicitly connected.

## Detailed Solution Plans

### Implementation: Plan A (stdio fix only)

**File:** `packages/storybook/src/generators/migrate-9/calling-storybook-cli.ts` (line 92)

```typescript
// Current
execSync(
  `${commandToRun}  ${schema.autoAcceptAllPrompts ? '--yes' : ''}`,
  {
    stdio: 'inherit',  // ❌ Doesn't work in migration context
    windowsHide: false,
    env: {
      ...process.env,
      STORYBOOK_PROJECT_ROOT: storybookProjectInfo.configDir,
    },
  }
);

// Plan A: Simple stdio fix
execSync(
  `${commandToRun}  ${schema.autoAcceptAllPrompts ? '--yes' : ''}`,
  {
    stdio: [0, 1, 2],  // ✅ Fix stdio
    windowsHide: false,
    env: {
      ...process.env,
      STORYBOOK_PROJECT_ROOT: storybookProjectInfo.configDir,
    },
  }
);
```

### Implementation: Plan B (non-interactive flags)

**File:** `packages/storybook/src/generators/migrate-9/calling-storybook-cli.ts` (lines 89-98)

```typescript
// Plan B: Add non-interactive flags
const nonInteractiveFlags = schema.autoAcceptAllPrompts
  ? '--yes --skip-install'
  : '';

execSync(
  `${commandToRun} ${nonInteractiveFlags}`,
  {
    stdio: [0, 1, 2],  // Also fix stdio
    windowsHide: false,
    env: {
      ...process.env,
      STORYBOOK_PROJECT_ROOT: storybookProjectInfo.configDir,
      // Optional: Force non-interactive in CI
      ...(schema.autoAcceptAllPrompts && { CI: 'true' }),
    },
  }
);
```

**Note:** With `--skip-install`, users will need to run `pnpm install` after migration completes.

### Implementation: Plan C (Hybrid - RECOMMENDED)

**File:** `packages/storybook/src/generators/migrate-9/calling-storybook-cli.ts` (lines 89-98)

```typescript
// Plan C: Hybrid approach - best of both worlds
const flags = schema.autoAcceptAllPrompts
  ? '--yes --skip-install'  // Non-interactive for migrations/CI
  : '';  // Interactive prompts for manual runs

execSync(
  `${commandToRun} ${flags}`,
  {
    stdio: [0, 1, 2],  // Always fix stdio
    windowsHide: false,
    env: {
      ...process.env,
      STORYBOOK_PROJECT_ROOT: storybookProjectInfo.configDir,
    },
  }
);
```

**Update migration to remind about install:**

Also update the success message in `callAutomigrate` (line 101) to inform users:

```typescript
if (schema.autoAcceptAllPrompts) {
  output.log({
    title: 'Migration complete',
    bodyLines: [
      '✅ Storybook configuration has been migrated.',
      '📦 Run `pnpm install` to install any new dependencies.',
    ],
    color: 'green',
  });
}
```

## DX Comparison: Different Scenarios

| Scenario | Plan A | Plan B | Plan C (Hybrid) |
|----------|--------|--------|-----------------|
| **1 Storybook project** | ✅ Good - 1 prompt | ✅ Good - 0 prompts | ✅ Good - 0 prompts (migration) |
| **100 Storybook projects** | ❌ Bad - 100 prompts | ✅ Good - 0 prompts | ✅ Good - 0 prompts (migration) |
| **Manual generator run** | ✅ Good - see what's happening | ❌ No prompts, less visibility | ✅ Good - can use prompts if wanted |
| **CI environment** | ❌ Hangs without stdin | ✅ Works | ✅ Works |
| **After migration** | Packages auto-installed | Need `pnpm install` | Need `pnpm install` |

### Real-World Example

**Workspace with 50 Storybook apps:**

**Plan A:**
```
Migrating app-1... [prompt] Accept? y
Migrating app-2... [prompt] Accept? y
Migrating app-3... [prompt] Accept? y
... 47 more times ...
```
❌ Terrible DX

**Plan B & C:**
```
Migrating all Storybook projects...
✅ 50 projects migrated successfully
📦 Run `pnpm install` to install new dependencies
```
✅ Great DX

## Testing Plan

### Test Scenarios (All Plans)

1. **Single project workspace:**
   - Run `nx migrate latest`
   - Run `nx migrate --run-migrations`
   - Verify no hanging
   - Verify migration completes

2. **Multi-project workspace (5+ Storybook projects):**
   - Test with Plan A: Count number of prompts
   - Test with Plan B/C: Verify smooth experience
   - Compare DX

3. **Manual generator run:**
   - Run `nx g @nx/storybook:migrate-9` (without autoAcceptAllPrompts)
   - Plan A & C: Should allow prompts
   - Plan B: Would skip prompts (may not be desirable)

4. **CI simulation:**
   - Set `CI=true`
   - Run migration
   - Verify completes without hanging

5. **After migration:**
   - Check if packages are installed (Plan A)
   - Run `pnpm install` manually (Plan B & C)
   - Verify Storybook works

### Edge Cases to Test
- Different package managers (npm, pnpm, yarn)
- Angular projects
- React projects with Vite
- React projects with Webpack
- Mix of Storybook v7, v8, v9 projects

## Advanced Options (Future Consideration)

### Plan D: Smart Detection
Detect number of Storybook projects and choose approach automatically:

```typescript
const projectCount = Object.keys(allStorybookProjects).length;
const useNonInteractive = schema.autoAcceptAllPrompts || projectCount > 5;
const flags = useNonInteractive ? '--yes --skip-install' : '';
```

**Pros:** Best of all worlds - automatic DX optimization
**Cons:** More complex, magic behavior might surprise users

### Plan E: New Schema Option
Add a new flag: `--non-interactive` or `--skip-install-during-migration`

```json
{
  "nonInteractive": {
    "type": "boolean",
    "description": "Run Storybook automigrate without prompts and skip package installation",
    "default": false
  }
}
```

**Pros:** Explicit user control
**Cons:** More complexity, another option to document

## Decision Matrix

| Priority | What to Implement | Why |
|----------|-------------------|-----|
| **Minimum Fix** | Plan A | Fixes hang for small repos, poor DX for large repos |
| **Recommended** | Plan C ⭐ | Best DX overall, handles all scenarios |
| **Alternative** | Plan B | If we always want non-interactive |
| **Future** | Plan D/E | If we need more sophisticated control |

## Implementation Priority

1. **Required:** Fix stdio configuration (all plans need this)
2. **Recommended:** Add `--skip-install` flag (Plan B or C)
3. **Optional:** Add user-facing message about `pnpm install`
4. **Required:** Testing - verify chosen plan works

## Expected Outcomes by Plan

### Plan A Outcomes
1. ✅ **No more hanging:** stdin properly connected
2. ✅ **Packages auto-install:** No manual install needed
3. ❌ **Poor DX for large repos:** 100 projects = 100 prompts
4. ❌ **Doesn't work in CI:** Requires stdin

### Plan B Outcomes
1. ✅ **No more hanging:** Non-interactive mode
2. ✅ **Great DX for large repos:** No prompts regardless of project count
3. ✅ **Works in CI:** Fully non-interactive
4. ⚠️ **Manual install needed:** Users run `pnpm install` after
5. ⚠️ **Less visibility:** Users don't see what Storybook CLI is doing

### Plan C Outcomes (RECOMMENDED)
1. ✅ **No more hanging:** stdio fixed + non-interactive when needed
2. ✅ **Great DX for large repos:** Migrations are non-interactive by default
3. ✅ **Works in CI:** Uses `autoAcceptAllPrompts=true` by default
4. ✅ **Flexibility:** Manual runs can still prompt if user wants
5. ⚠️ **Manual install needed:** Users run `pnpm install` after (acceptable trade-off)
6. ✅ **Clear communication:** Success message tells users what to do next

## Testing Commands

```bash
# Test the specific project
nx run-many -t test,build,lint -p storybook

# Test affected projects
nx affected -t build,test,lint

# Test documentation build
nx run astro-docs:build
```

## Related Files

- `packages/storybook/src/generators/migrate-9/calling-storybook-cli.ts` (main fix - one line change on line 92)
- `packages/storybook/src/generators/migrate-9/schema.json` (schema definition - no changes needed)
- `packages/storybook/src/migrations/update-21-1-0/update-sb-9.ts` (calls the generator - no changes needed)

## References

- Storybook automigrate docs: https://storybook.js.org/docs/react/configure/upgrading#automigrate-script
- Storybook 9 migration guide: https://storybook.js.org/docs/react/migration-guide
- Nx migration guide: https://nx.dev/features/automate-updating-dependencies
