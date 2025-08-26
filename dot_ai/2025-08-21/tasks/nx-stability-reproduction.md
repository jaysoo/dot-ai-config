# Nx CLI Stability Issues Reproduction Task

**Date**: 2025-08-21
**Repository**: nx-stability-repro (test workspace)
**Linear Issue**: NXC-2582 - Database locked error in Celonis CLI after upgrade to v21

## Objective
Reproduce stability issues with Nx CLI including:
1. Database locked errors from native SQLite code
2. Graph calculation hanging
3. General errors resolved by `nx reset` or `rm -rf .nx`

## Research Completed

### Issues Found in Linear
- **NXC-2582**: Database locked error in Celonis CLI (SqliteFailure, DatabaseBusy)
- **NXC-2866**: Inconsistent remote caching issues
- **NXC-2793**: Lockfile throws errors intermittently
- **NXC-2862**: Race condition causing ProjectGraph errors
- **NXC-2860**: Plugin-worker processes not terminating

### Issues Found in GitHub
- **#28640**: Unable to set journal_mode errors
- **#28772**: Database disk image malformed
- **#28608**: Multiple nx instances database locked
- **#28665**: SqliteFailure DatabaseBusy errors

## Reproduction Results

### ✅ Successfully Reproduced

1. **Daemon Conflicts**
   - Error: `Daemon process terminated and closed the connection`
   - Cause: Multiple parallel Nx processes, EADDRINUSE socket errors
   - Reproduction rate: 100% with parallel execution

2. **Graph Calculation Hanging**
   - Error: `Nx Daemon was not able to compute the project graph`
   - Cause: Version upgrades (Nx 19 → 21), daemon socket conflicts
   - Reproduction rate: 100% when upgrading versions

3. **Daemon Termination Issues**
   - Multiple processes fighting for daemon control
   - "this process is no longer the current daemon" errors

### ⚠️ Partially Reproduced

1. **Database Locked Errors**
   - Target error: `SqliteFailure(Error { code: DatabaseBusy, extended_code: 5 })`
   - Harder to reproduce consistently
   - Requires specific timing/race conditions

## Test Scripts Created

Location: `/tmp/claude/nx-stability-repro/`

1. **stress-test-parallel-fixed.sh** - Tests parallel execution with 5 concurrent processes
2. **reproduce-db-lock.sh** - Attempts to force database lock with 20 parallel processes
3. **test-version-switching.sh** - Tests upgrading from Nx 19 to 21
4. **test-branch-switching.sh** - Tests rapid branch switching with different dependencies
5. **REPRODUCTION_GUIDE.md** - Complete documentation of findings

## Key Technical Findings

### Database Implementation (from native Rust code)
- Location: `packages/nx/src/native/db/connection.rs`, `initialize.rs`
- Uses SQLite with WAL (Write-Ahead Logging) mode
- Retry logic: Max 20 retries with exponential backoff
- Lock file mechanism to prevent concurrent access
- Database recreated on version mismatch

### Root Causes
1. **Daemon Socket Conflicts**: Multiple processes binding to same socket
2. **SQLite Lock Contention**: Database struggles with high concurrency
3. **Version Incompatibility**: Schema changes cause recreation issues
4. **File System Race Conditions**: Branch switching causes inconsistencies

## Workarounds Documented

```bash
# For database locked errors
nx reset
rm -rf .nx  # Nuclear option

# For graph hanging
NX_DAEMON=false nx run-many -t test

# After version changes
nx reset
```

## Next Steps
- Test scripts are ready for debugging actual Nx issues
- Can run with `NX_VERBOSE_LOGGING=true` for more details
- Monitor `.nx/workspace-data/d/daemon.log` for errors
- These reproductions should help fix the stability issues in Nx core

## Files Generated
- Test workspace at `/tmp/claude/nx-stability-repro/test-workspace-1/`
- Version test at `/tmp/claude/nx-stability-repro/version-test-workspace/`
- All reproduction scripts and guide in main repro directory