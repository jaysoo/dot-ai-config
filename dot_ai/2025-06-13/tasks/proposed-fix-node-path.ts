/**
 * Proposed fix for module resolution in VS Code Migrate UI
 *
 * The issue: Migrations fail to find packages because NODE_PATH is not set
 * The solution: Set NODE_PATH before running migrations, similar to Nx CLI
 */

import { join } from 'path';
import { platform } from 'os';

/**
 * Add a directory to NODE_PATH environment variable
 * This matches the implementation in Nx CLI (migrate.js)
 */
function addToNodePath(dir: string): void {
  // NODE_PATH is a delimited list of paths.
  // The delimiter is different for windows.
  const delimiter = platform() === 'win32' ? ';' : ':';
  const paths = process.env.NODE_PATH
    ? process.env.NODE_PATH.split(delimiter)
    : [];

  // Add the directory if not already present
  if (!paths.includes(dir)) {
    paths.push(dir);
  }

  // Update the env variable.
  process.env.NODE_PATH = paths.join(delimiter);
}

/**
 * Configure NODE_PATH for migration execution
 * Should be called before running any migrations
 */
export function configureMigrationEnvironment(workspacePath: string): void {
  // Add workspace node_modules to NODE_PATH
  addToNodePath(join(workspacePath, 'node_modules'));

  // If there's a temporary node_modules (for specific version), add it too
  // This handles cases where migrations install specific package versions
  const tmpNodeModules = process.env.NX_MIGRATE_TEMP_NODE_MODULES;
  if (tmpNodeModules) {
    addToNodePath(tmpNodeModules);
  }
}

// ===== Integration into run-migration.ts =====

// In libs/vscode/migrate/src/lib/commands/run-migration.ts
// Add this before calling migrateUiApi.runSingleMigration:

/*
import { configureMigrationEnvironment } from './migration-environment';

export async function runSingleMigration(
  migration: MigrationDetailsWithId,
  configuration: { createCommits: boolean },
) {
  const workspacePath = getNxWorkspacePath();

  await window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: `Running ${migration.name}`,
    },
    async () => {
      commands.executeCommand('nxMigrate.refreshWebview');

      // NEW: Configure NODE_PATH before running migration
      configureMigrationEnvironment(workspacePath);

      const migrateUiApi = await importMigrateUIApi(workspacePath);
      migrateUiApi.runSingleMigration(workspacePath, migration, configuration);
    },
  );
}
*/

// ===== Alternative Approach: Child Process =====

// If setting NODE_PATH in the current process doesn't work,
// we could spawn a child process with the correct NODE_PATH:

/*
import { spawn } from 'child_process';

export async function InChildProcess(
  workspacePath: string,
  migration: MigrationDetailsWithId,
  configuration: { createCommits: boolean }
): Promise<void> {
  const env = { ...process.env };

  // Set NODE_PATH for the child process
  const delimiter = platform() === 'win32' ? ';' : ':';
  const paths = [
    join(workspacePath, 'node_modules'),
    ...(env.NODE_PATH ? env.NODE_PATH.split(delimiter) : [])
  ];
  env.NODE_PATH = paths.join(delimiter);

  // Run migration in child process with proper NODE_PATH
  const child = spawn(process.execPath, [
    '-e',
    `
    const { runSingleMigration } = require('nx/src/command-line/migrate/migrate-ui-api');
    runSingleMigration(
      '${workspacePath}',
      ${JSON.stringify(migration)},
      ${JSON.stringify(configuration)}
    ).then(() => process.exit(0))
     .catch(() => process.exit(1));
    `
  ], {
    cwd: workspacePath,
    env,
    stdio: 'inherit'
  });

  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Migration failed with code ${code}`));
    });
  });
}
*/
