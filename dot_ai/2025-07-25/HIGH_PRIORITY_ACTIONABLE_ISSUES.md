# High Priority Actionable Issues - Nx Repository

Generated: 2025-07-25

## Executive Summary

Found **66 HIGH actionability** issues out of 89 total high priority issues. Many are stale (30+ days) and have clear reproduction cases, making them excellent candidates for work.

## Key Statistics

- **Total High Priority Issues**: 89 (all assigned)
- **HIGH Actionability**: 66 (74%)
- **MEDIUM Actionability**: 23 (26%)
- **Stale (30+ days)**: 55 (62%)
- **With Reproduction**: 89 (100%)

## Top Categories

1. **Linting/ESLint** (57 issues, 57 HIGH actionability)
   - Many permission errors, daemon issues
   - Clear error messages and reproductions

2. **Migration** (24 issues, 1 HIGH, 23 MEDIUM)
   - Complex version updates
   - Need careful testing

3. **Create Workspace** (8 issues, 8 HIGH actionability)
   - Critical onboarding blocker
   - Module resolution issues

## Top 5 Most Actionable Issues

### 1. 🔥 Issue #29813: Running multiple nx targets causes daemon shutdown
- **URL**: https://github.com/nrwl/nx/issues/29813
- **Assigned**: AgentEnder (stale 31 days)
- **Error**: `Error: This socket has been ended by the other party`
- **Action**: Implement file lock mechanism for daemon client
- **Note**: Core team suggested fix in beta, needs verification

### 2. 🔥 Issue #30005: EPERM: operation not permitted on Windows
- **URL**: https://github.com/nrwl/nx/issues/30005
- **Assigned**: MaxKless (stale 31 days)
- **Error**: `EPERM: operation not permitted, lstat 'daemon.log'`
- **Action**: Fix Windows file permission handling
- **Repro**: Clear steps provided

### 3. Issue #31648: No cached ProjectGraph available
- **URL**: https://github.com/nrwl/nx/issues/31648
- **Assigned**: AgentEnder (23 days old)
- **Error**: `Cannot determine the version of bun`
- **Action**: Fix Bun version detection in project graph

### 4. Issue #31834: Cannot find module 'nx/bin/nx'
- **URL**: https://github.com/nrwl/nx/issues/31834
- **Assigned**: ndcunningham (updated yesterday)
- **Error**: `Cannot find module 'nx/bin/nx'`
- **Action**: Fix module resolution in create-nx-workspace
- **Critical**: Blocks new user onboarding

### 5. Issue #31468: ERROR: No cached ProjectGraph
- **URL**: https://github.com/nrwl/nx/issues/31468
- **Assigned**: AgentEnder (stale 48 days)
- **Action**: Investigate cache generation failure
- **Has**: Clear reproduction steps

## Specific Action Plan

### Immediate Actions (Stale + Clear Fix)

1. **Daemon/Permission Issues**
   ```bash
   # Issues: #29813, #30005, #31300
   # Fix file locking and Windows permissions
   # Test with: NX_DAEMON=false vs true
   ```

2. **Create Workspace Failures**
   ```bash
   # Issues: #31834, #31908, #31863
   # Fix module resolution order
   # Test matrix: different package managers, directories
   ```

3. **Project Graph Cache**
   ```bash
   # Issues: #31648, #31468, #30603
   # Fix cache generation and validation
   # Add better error messages
   ```

### Testing Strategy

```bash
# For each issue:
1. Clone reproduction repo
2. Verify issue exists
3. Implement fix
4. Test across:
   - Windows/Mac/Linux
   - npm/yarn/pnpm/bun
   - Different Node versions
5. Run: nx prepush
```

## Recommended Workflow

1. **Start with stale issues** - Less likely to conflict with active work
2. **Focus on clear errors** - Easier to verify fixes
3. **Prioritize onboarding blockers** - create-nx-workspace issues
4. **Batch similar fixes** - Many permission/daemon issues share root cause

## Issue Selection Criteria

✅ **Work on these:**
- Stale 30+ days with repro
- Clear error messages
- Core team provided guidance
- Blocking new users

❌ **Avoid these:**
- Recently updated (< 7 days)
- Architecture changes
- Need design decisions
- Upstream dependencies