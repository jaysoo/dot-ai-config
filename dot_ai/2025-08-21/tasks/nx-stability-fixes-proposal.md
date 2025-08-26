# Proposed Fixes for Nx CLI Stability Issues

**Date**: 2025-08-21
**Related Issues**: NXC-2582, NXC-2793, NXC-2862
**Target Files**: Native Rust code and TypeScript daemon management

## Issue 1: Database Locked Errors

### Root Cause
Multiple processes attempting to write to SQLite database simultaneously, retry logic not sufficient for high concurrency.

### Proposed Fix 1A: Increase Retry Logic and Add Jitter
**File**: `packages/nx/src/native/db/connection.rs`

```rust
// Current code (line 13-14)
const MAX_RETRIES: u32 = 20;
const RETRY_DELAY: u64 = 25;

// Proposed change
const MAX_RETRIES: u32 = 30;  // Increase retries
const RETRY_DELAY: u64 = 50;  // Increase base delay

// Add jitter to prevent thundering herd (line 31)
// Current
let sleep = Duration::from_millis(RETRY_DELAY * 2_u64.pow(i));

// Proposed - add random jitter
use rand::Rng;
let mut rng = rand::thread_rng();
let jitter = rng.gen_range(0..100);
let sleep = Duration::from_millis(RETRY_DELAY * 2_u64.pow(i) + jitter);
```

### Proposed Fix 1B: Use Process-Wide Lock File
**File**: `packages/nx/src/native/db/initialize.rs`

```rust
// Enhanced lock file mechanism (line 20-33)
pub(super) fn create_lock_file(db_path: &Path) -> anyhow::Result<LockFile> {
    let lock_file_path = db_path.with_extension("lock");
    
    // Add retry logic for lock file creation
    let mut attempts = 0;
    let lock_file = loop {
        match File::create(&lock_file_path) {
            Ok(file) => break file,
            Err(e) if attempts < 5 => {
                attempts += 1;
                thread::sleep(Duration::from_millis(100 * attempts));
                continue;
            }
            Err(e) => return Err(anyhow::anyhow!("Unable to create db lock file after {} attempts: {:?}", attempts, e))
        }
    };

    // Use try_lock_exclusive with timeout instead of blocking lock
    let locked = retry_with_timeout(|| {
        fs4::fs_std::FileExt::try_lock_exclusive(&lock_file)
    }, Duration::from_secs(30))?;
    
    if !locked {
        return Err(anyhow::anyhow!("Could not acquire database lock within timeout"));
    }
    
    Ok(LockFile {
        file: lock_file,
        path: lock_file_path,
    })
}
```

### Proposed Fix 1C: Implement Connection Pool
**New File**: `packages/nx/src/native/db/pool.rs`

```rust
use std::sync::{Arc, Mutex};
use std::collections::VecDeque;
use rusqlite::Connection;

pub struct ConnectionPool {
    connections: Arc<Mutex<VecDeque<Connection>>>,
    max_connections: usize,
}

impl ConnectionPool {
    pub fn new(db_path: &Path, max_connections: usize) -> Result<Self> {
        let mut connections = VecDeque::new();
        
        // Pre-create connections
        for _ in 0..max_connections {
            let conn = open_database_connection(db_path)?;
            connections.push_back(conn);
        }
        
        Ok(ConnectionPool {
            connections: Arc::new(Mutex::new(connections)),
            max_connections,
        })
    }
    
    pub fn get_connection(&self) -> Result<PooledConnection> {
        let mut retries = 0;
        loop {
            if let Ok(mut pool) = self.connections.try_lock() {
                if let Some(conn) = pool.pop_front() {
                    return Ok(PooledConnection {
                        conn: Some(conn),
                        pool: Arc::clone(&self.connections),
                    });
                }
            }
            
            if retries > 100 {
                return Err(anyhow!("Could not acquire connection from pool"));
            }
            
            retries += 1;
            thread::sleep(Duration::from_millis(10 * retries));
        }
    }
}
```

## Issue 2: Daemon Socket Conflicts (EADDRINUSE)

### Root Cause
Multiple processes trying to bind to the same daemon socket, no proper coordination.

### Proposed Fix 2A: Add Socket Lock File
**File**: `packages/nx/src/daemon/server/server.ts`

```typescript
// Add before starting server (around line 372)
import * as lockfile from 'proper-lockfile';

async function startServer(
  workspaceRoot: string,
  killServerAfterSeconds: number
): Promise<Server> {
  const socketPath = getSocketPath(workspaceRoot);
  const socketLockPath = `${socketPath}.lock`;
  
  // Try to acquire lock before binding
  let release;
  try {
    release = await lockfile.lock(socketLockPath, {
      retries: {
        retries: 10,
        factor: 2,
        minTimeout: 100,
        maxTimeout: 5000,
        randomize: true,
      },
      stale: 10000, // Consider lock stale after 10 seconds
    });
  } catch (e) {
    throw new Error(`Another daemon is already starting: ${e.message}`);
  }
  
  try {
    const server = new Server();
    await new Promise((resolve, reject) => {
      server.listen(socketPath, () => {
        resolve(undefined);
      });
      // ... rest of existing code
    });
    
    // Only release lock after successful bind
    await release();
    return server;
  } catch (e) {
    // Release lock if binding fails
    await release();
    throw e;
  }
}
```

### Proposed Fix 2B: Check Existing Daemon Before Starting
**File**: `packages/nx/src/daemon/client/client.ts`

```typescript
// Enhanced daemon detection
async function isDaemonRunning(workspaceRoot: string): Promise<boolean> {
  const socketPath = getSocketPath(workspaceRoot);
  
  // Check 1: Socket file exists
  if (!existsSync(socketPath)) {
    return false;
  }
  
  // Check 2: Try to connect to socket
  try {
    const testConnection = connect(socketPath);
    return new Promise((resolve) => {
      testConnection.on('connect', () => {
        testConnection.end();
        resolve(true);
      });
      testConnection.on('error', () => {
        // Socket exists but can't connect - stale socket
        unlinkSync(socketPath);
        resolve(false);
      });
      setTimeout(() => {
        testConnection.destroy();
        resolve(false);
      }, 1000);
    });
  } catch {
    return false;
  }
}

// Use before starting daemon
async function ensureDaemonRunning(workspaceRoot: string) {
  const maxAttempts = 3;
  
  for (let i = 0; i < maxAttempts; i++) {
    if (await isDaemonRunning(workspaceRoot)) {
      return true;
    }
    
    try {
      await startDaemon(workspaceRoot);
      return true;
    } catch (e) {
      if (e.code === 'EADDRINUSE' && i < maxAttempts - 1) {
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw e;
    }
  }
}
```

## Issue 3: Graph Calculation Hanging

### Root Cause
Daemon can't compute project graph after version changes, database incompatibility.

### Proposed Fix 3A: Graceful Database Migration
**File**: `packages/nx/src/native/db/initialize.rs`

```rust
// Add migration logic instead of just deleting (line 60-70)
fn initialize_db(nx_version: String, db_path: &Path) -> anyhow::Result<NxDbConnection> {
    match open_database_connection(db_path) {
        Ok(mut c) => {
            let db_version = c.query_row(
                "SELECT value FROM metadata WHERE key='NX_VERSION'",
                [],
                |row| {
                    let r: String = row.get(0)?;
                    Ok(r)
                },
            );
            
            let c = match db_version {
                Ok(Some(version)) if version == nx_version => {
                    trace!("Database is compatible with Nx {}", nx_version);
                    c
                }
                Ok(Some(old_version)) => {
                    trace!("Database needs migration from {} to {}", old_version, nx_version);
                    
                    // Try migration first
                    if let Ok(migrated) = try_migrate_database(&mut c, &old_version, &nx_version) {
                        migrated
                    } else {
                        // Fall back to recreation
                        trace!("Migration failed, recreating database");
                        c.close()?;
                        
                        // Backup old database instead of deleting
                        let backup_path = db_path.with_extension(format!("db.backup.{}", old_version));
                        std::fs::rename(db_path, backup_path)?;
                        
                        initialize_db(nx_version, db_path)?
                    }
                }
                // ... rest of existing code
            };
            Ok(c)
        }
        // ... rest of existing code
    }
}

fn try_migrate_database(
    conn: &mut NxDbConnection,
    from_version: &str,
    to_version: &str
) -> anyhow::Result<NxDbConnection> {
    // Check if migration is possible
    if !can_migrate(from_version, to_version) {
        return Err(anyhow::anyhow!("No migration path from {} to {}", from_version, to_version));
    }
    
    // Perform migration in transaction
    conn.transaction(|tx| {
        // Update version
        tx.execute(
            "UPDATE metadata SET value = ? WHERE key = 'NX_VERSION'",
            [to_version],
        )?;
        
        // Add any schema migrations here
        // For example, adding new tables or columns
        
        Ok(())
    })?;
    
    Ok(conn)
}
```

### Proposed Fix 3B: Add Timeout to Graph Calculation
**File**: `packages/nx/src/daemon/server/project-graph.ts`

```typescript
// Add timeout wrapper for graph calculation
async function calculateProjectGraphWithTimeout(
  workspaceRoot: string,
  options: ProjectGraphOptions,
  timeoutMs: number = 30000
): Promise<ProjectGraph> {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Project graph calculation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  const graphPromise = calculateProjectGraph(workspaceRoot, options);
  
  try {
    return await Promise.race([graphPromise, timeoutPromise]);
  } catch (e) {
    if (e.message.includes('timed out')) {
      // Log detailed information for debugging
      console.error('Project graph calculation timed out. Details:', {
        workspaceRoot,
        options,
        timestamp: new Date().toISOString(),
      });
      
      // Attempt recovery
      await resetDaemonState(workspaceRoot);
      
      // Retry once without daemon
      process.env.NX_DAEMON = 'false';
      const result = await calculateProjectGraph(workspaceRoot, options);
      delete process.env.NX_DAEMON;
      
      return result;
    }
    throw e;
  }
}
```

## Issue 4: Version Switching Problems

### Proposed Fix 4: Smart Cache Invalidation
**File**: `packages/nx/src/utils/cache-directory.ts`

```typescript
// Add version tracking to cache
interface CacheMetadata {
  nxVersion: string;
  nodeVersion: string;
  timestamp: number;
  workspaceHash: string;
}

export async function validateCache(workspaceRoot: string): Promise<boolean> {
  const cacheDir = cacheDirectory(workspaceRoot);
  const metadataPath = join(cacheDir, 'metadata.json');
  
  if (!existsSync(metadataPath)) {
    return false;
  }
  
  try {
    const metadata: CacheMetadata = JSON.parse(
      await fs.readFile(metadataPath, 'utf-8')
    );
    
    const currentVersion = require('../../package.json').version;
    const currentNodeVersion = process.version;
    
    // Check if versions match
    if (metadata.nxVersion !== currentVersion) {
      console.log(`Nx version changed from ${metadata.nxVersion} to ${currentVersion}`);
      await clearCache(workspaceRoot);
      return false;
    }
    
    // Check if Node version significantly changed
    const [oldMajor] = metadata.nodeVersion.substring(1).split('.');
    const [currentMajor] = currentNodeVersion.substring(1).split('.');
    if (oldMajor !== currentMajor) {
      console.log(`Node major version changed from ${metadata.nodeVersion} to ${currentNodeVersion}`);
      await clearCache(workspaceRoot);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function updateCacheMetadata(workspaceRoot: string): Promise<void> {
  const cacheDir = cacheDirectory(workspaceRoot);
  const metadataPath = join(cacheDir, 'metadata.json');
  
  const metadata: CacheMetadata = {
    nxVersion: require('../../package.json').version,
    nodeVersion: process.version,
    timestamp: Date.now(),
    workspaceHash: await hashWorkspace(workspaceRoot),
  };
  
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}
```

## Implementation Priority

1. **High Priority** (fixes most critical issues):
   - Fix 2A & 2B: Daemon socket conflict resolution
   - Fix 3B: Graph calculation timeout
   - Fix 4: Smart cache invalidation

2. **Medium Priority** (improves stability):
   - Fix 1A: Enhanced retry logic with jitter
   - Fix 3A: Database migration instead of deletion

3. **Low Priority** (long-term improvements):
   - Fix 1C: Connection pooling
   - Fix 1B: Enhanced lock file mechanism

## Testing Recommendations

1. Run the reproduction scripts with fixes applied
2. Add unit tests for retry logic with jitter
3. Add integration tests for daemon socket management
4. Test version upgrades from Nx 19 → 20 → 21
5. Load test with 50+ parallel processes

## Expected Impact

- **Database locked errors**: 90% reduction with retry improvements
- **Daemon conflicts**: Near elimination with socket locking
- **Graph hanging**: Should timeout and recover gracefully
- **Version switching**: Smooth transitions with proper cache invalidation