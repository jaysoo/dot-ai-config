# What environment variables does Nx support?

Nx supports a comprehensive set of environment variables to configure and control its behavior across different environments.

## Nx Environment Variables

The following environment variables control Nx behavior:

### Task Execution
- **`NX_PARALLEL`** (number) - Number of tasks to run in parallel (overrides nx.json)
- **`NX_RUNNER`** (string) - Task runner name (not read if `NX_TASKS_RUNNER` is set)
- **`NX_TASKS_RUNNER`** (string) - Task runner name (preferred over `NX_RUNNER`)
- **`NX_BATCH_MODE`** (boolean) - Run tasks in batches for supporting executors
- **`NX_IGNORE_CYCLES`** (boolean) - Ignore task graph circular dependency errors
- **`NX_TASKS_RUNNER_DYNAMIC_OUTPUT`** (boolean) - Use dynamic vs static terminal output

### Caching
- **`NX_SKIP_NX_CACHE`** / **`NX_DISABLE_NX_CACHE`** (boolean) - Disable local caching
- **`NX_SKIP_REMOTE_CACHE`** / **`NX_DISABLE_REMOTE_CACHE`** (boolean) - Disable remote caching (Nx Cloud/Powerpack)
- **`NX_CACHE_DIRECTORY`** (string) - Custom cache directory (default: `.nx/cache`)
- **`NX_MAX_CACHE_SIZE`** (string) - Maximum local task cache size
- **`NX_CACHE_PROJECT_GRAPH`** (boolean) - Enable/disable project graph caching

### Daemon & Performance
- **`NX_DAEMON`** (boolean) - Enable/disable Nx daemon (disable to see console.log in plugins)
- **`NX_PERF_LOGGING`** (boolean) - Print performance debug information
- **`NX_PROFILE`** (string) - Generate Chrome DevTools performance profile (e.g., `NX_PROFILE=profile.json`)
- **`NX_VERBOSE_LOGGING`** (boolean) - Enable verbose debug logging

### Terminal UI
- **`NX_TUI`** (boolean) - Enable/disable Terminal UI for running tasks
- **`NX_TUI_AUTO_EXIT`** (boolean/number) - Control TUI auto-exit (true=immediate, false=never, number=countdown seconds)

### Affected Commands
- **`NX_BASE`** (string) - Default base branch for affected calculations
- **`NX_HEAD`** (string) - Default head branch for affected calculations

### Plugins & Generators
- **`NX_ADD_PLUGINS`** (boolean) - Enable/disable automatic plugin inference (default: true)
- **`NX_DEFAULT_PROJECT`** (string) - Default project for commands requiring a project
- **`NX_DRY_RUN`** (boolean) - Perform dry run without creating files/installing packages
- **`NX_INTERACTIVE`** (boolean) - Allow interactive prompts during generators
- **`NX_GENERATE_QUIET`** (boolean) - Suppress file operation logging
- **`NX_PREFER_TS_NODE`** (boolean) - Use ts-node instead of @swc-node/register
- **`NX_PLUGIN_NO_TIMEOUTS`** (boolean) - Disable plugin operation timeouts

### Migration
- **`NX_MIGRATE_CLI_VERSION`** (string) - Nx version for migrations (default: latest)
- **`NX_MIGRATE_SKIP_REGISTRY_FETCH`** (boolean) - Skip registry metadata fetch

### Other Configuration
- **`NX_WORKSPACE_DATA_DIRECTORY`** (string) - Workspace data directory (default: `.nx/workspace-data`)
- **`NX_NATIVE_FILE_CACHE_DIRECTORY`** (string) - Cache directory for native `.node` files
- **`NX_LOAD_DOT_ENV_FILES`** (boolean) - Enable/disable loading .env files
- **`NX_SKIP_LOG_GROUPING`** (boolean) - Disable log grouping in CI
- **`NX_FORMAT_SORT_TSCONFIG_PATHS`** (boolean) - Sort TypeScript path mappings
- **`NX_SKIP_VSCODE_EXTENSION_INSTALL`** (boolean) - Skip auto-install of Nx Console

## Environment Variables Set by Nx

Nx automatically sets these during task execution:

- **`NX_TASK_TARGET_PROJECT`** (string) - Current project name
- **`NX_TASK_TARGET_TARGET`** (string) - Current target name
- **`NX_TASK_TARGET_CONFIGURATION`** (string) - Current configuration name
- **`NX_GRAPH_CREATION`** (boolean) - Set during graph creation (allows different plugin behavior)
- **`NX_DRY_RUN`** (boolean) - Set during generator dry runs
- **`NX_INTERACTIVE`** (boolean) - Set when running with `--interactive=false`

## Nx Cloud Environment Variables

Nx Cloud-specific variables:

- **`NX_BRANCH`** (string) - Current branch name (auto-detected for most CI providers)
- **`NX_CI_EXECUTION_ID`** (string) - Unique CI run identifier
- **`NX_CI_EXECUTION_ENV`** (string) - Environment name for multiple main jobs
- **`NX_AGENT_LAUNCH_TEMPLATE`** (string) - Launch template for Manual DTE agents
- **`NX_CLOUD_ACCESS_TOKEN`** (string) - Nx Cloud access token (takes precedence over nx.json)
- **`NX_CLOUD_ENCRYPTION_KEY`** (string) - Enable end-to-end artifact encryption
- **`NX_CLOUD_NO_TIMEOUTS`** (boolean) - Disable 10-second timeout for Nx Cloud requests
- **`NX_VERBOSE_LOGGING`** (boolean) - Debug info for agent communication

## Environment Variables in Cache Hash

You can include environment variable values in the computation hash:

```json
{
  "inputs": [
    { "env": "API_KEY" }
  ]
}
```

This invalidates the cache when the environment variable value changes.

## Learn More

For comprehensive documentation:
- [Environment Variables Reference](/docs/reference/environment-variables)
- [Nx Cloud Environment Variables](/docs/reference/nx-cloud-cli)
