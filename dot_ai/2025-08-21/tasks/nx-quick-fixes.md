# Quick Fixes for Immediate Relief

## 1. Immediate Hotfix for Database Busy (5 min fix)

**File**: `packages/nx/src/native/db/connection.rs`

```diff
- const MAX_RETRIES: u32 = 20;
- const RETRY_DELAY: u64 = 25;
+ const MAX_RETRIES: u32 = 40;  // Double retries
+ const RETRY_DELAY: u64 = 100; // 4x delay

// Line 31 - Add randomization to prevent thundering herd
- let sleep = Duration::from_millis(RETRY_DELAY * 2_u64.pow(i));
+ let jitter = (i * 17) % 50; // Simple pseudo-random jitter
+ let sleep = Duration::from_millis(RETRY_DELAY * 2_u64.pow(i) + jitter);
```

## 2. Quick Daemon Fix (10 min fix)

**File**: `packages/nx/src/daemon/client/client.ts`

```typescript
// Add at top of file
const MAX_DAEMON_START_ATTEMPTS = 3;
const DAEMON_START_DELAY = 2000;

// Replace existing daemon start logic
export async function startInBackground(workspaceRoot: string): Promise<void> {
  for (let attempt = 1; attempt <= MAX_DAEMON_START_ATTEMPTS; attempt++) {
    try {
      // Check if daemon already running
      if (await isDaemonRunning(workspaceRoot)) {
        return;
      }
      
      await doStartInBackground(workspaceRoot);
      return;
    } catch (e) {
      if (e.code === 'EADDRINUSE') {
        if (attempt < MAX_DAEMON_START_ATTEMPTS) {
          // Wait with exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, DAEMON_START_DELAY * attempt)
          );
          continue;
        }
      }
      
      // Final attempt failed
      console.warn('Could not start daemon after ' + attempt + ' attempts');
      console.warn('Running without daemon. Use NX_DAEMON=false to suppress this warning.');
      process.env.NX_DAEMON = 'false';
      return;
    }
  }
}

// Add helper function
async function isDaemonRunning(workspaceRoot: string): Promise<boolean> {
  const socketPath = getSocketPath(workspaceRoot);
  if (!existsSync(socketPath)) return false;
  
  try {
    // Try to connect
    const client = connect(socketPath);
    return new Promise((resolve) => {
      client.on('connect', () => {
        client.end();
        resolve(true);
      });
      client.on('error', () => resolve(false));
      setTimeout(() => {
        client.destroy();
        resolve(false);
      }, 500);
    });
  } catch {
    return false;
  }
}
```

## 3. Graph Timeout Protection (5 min fix)

**File**: `packages/nx/src/project-graph/project-graph.ts`

```typescript
// Wrap existing createProjectGraphAsync
const originalCreateProjectGraphAsync = createProjectGraphAsync;

export async function createProjectGraphAsync(
  opts: CreateProjectGraphOptions = {}
): Promise<ProjectGraph> {
  const timeoutMs = process.env.NX_GRAPH_TIMEOUT 
    ? parseInt(process.env.NX_GRAPH_TIMEOUT) 
    : 30000;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(
        `Project graph calculation timed out after ${timeoutMs}ms. ` +
        `Try running with NX_DAEMON=false or increase timeout with NX_GRAPH_TIMEOUT env var.`
      ));
    }, timeoutMs);
  });
  
  try {
    return await Promise.race([
      originalCreateProjectGraphAsync(opts),
      timeoutPromise
    ]);
  } catch (e) {
    if (e.message.includes('timed out')) {
      // Clear cache and retry once without daemon
      execSync('nx reset', { stdio: 'ignore' });
      process.env.NX_DAEMON = 'false';
      const result = await originalCreateProjectGraphAsync(opts);
      delete process.env.NX_DAEMON;
      return result;
    }
    throw e;
  }
}
```

## 4. SQLite Busy Handler Fix (10 min fix)

**File**: `packages/nx/src/native/db/initialize.rs`

```rust
// In configure_database function (line 123)
fn configure_database(connection: &NxDbConnection) -> anyhow::Result<()> {
    connection
        .pragma_update(None, "journal_mode", "WAL")
        .map_err(|e| anyhow::anyhow!("Unable to set journal_mode: {:?}", e))?;
    connection
        .pragma_update(None, "synchronous", "NORMAL")
        .map_err(|e| anyhow::anyhow!("Unable to set synchronous: {:?}", e))?;
+   
+   // Add busy timeout (5 seconds)
+   connection
+       .pragma_update(None, "busy_timeout", 5000)
+       .map_err(|e| anyhow::anyhow!("Unable to set busy_timeout: {:?}", e))?;
+   
+   // Increase WAL autocheckpoint for better concurrency
+   connection
+       .pragma_update(None, "wal_autocheckpoint", 1000)
+       .map_err(|e| anyhow::anyhow!("Unable to set wal_autocheckpoint: {:?}", e))?;
    
-   connection
-       .busy_handler(Some(|tries| tries <= 12))
-       .map_err(|e| anyhow::anyhow!("Unable to set busy handler: {:?}", e))?;
+   // Use built-in busy timeout instead of custom handler
+   // The busy_timeout pragma is more reliable
    
    Ok(())
}
```

## 5. Emergency Kill Switch Environment Variables

Add support for these environment variables as escape hatches:

```typescript
// In packages/nx/src/utils/nx-init.ts
export function initializeNx() {
  // Emergency overrides
  if (process.env.NX_FORCE_NO_DAEMON === 'true') {
    process.env.NX_DAEMON = 'false';
  }
  
  if (process.env.NX_RESET_ON_START === 'true') {
    execSync('nx reset', { stdio: 'ignore' });
  }
  
  if (process.env.NX_SQLITE_BUSY_TIMEOUT) {
    // Pass to Rust via env var
    process.env.RUST_SQLITE_BUSY_TIMEOUT = process.env.NX_SQLITE_BUSY_TIMEOUT;
  }
  
  if (process.env.NX_MAX_PARALLEL) {
    // Limit parallelism to reduce contention
    process.env.NX_PARALLEL = process.env.NX_MAX_PARALLEL;
  }
}
```

## Deployment Strategy

1. **Phase 1** (Immediate): Deploy fixes 1, 4, and 5
   - These are low-risk changes that add resilience

2. **Phase 2** (After testing): Deploy fixes 2 and 3
   - These change daemon behavior and need more testing

3. **User Communication**:
   ```bash
   # Temporary workarounds for users experiencing issues:
   
   # For database locked errors
   NX_FORCE_NO_DAEMON=true nx run-many -t build
   
   # For graph hanging
   NX_GRAPH_TIMEOUT=60000 nx affected -t test
   
   # For severe issues
   NX_RESET_ON_START=true nx run-many -t test
   ```

## Monitoring

Add telemetry to track:
- Retry counts for database operations
- Daemon start failures
- Graph calculation timeouts
- Database busy errors

This will help validate the fixes are working.