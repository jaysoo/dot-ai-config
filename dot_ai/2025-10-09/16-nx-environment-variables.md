# What environment variables does Nx support?

Nx supports a wide range of environment variables to configure and control its behavior across different environments.

## Environment Variables to Control Nx Behavior

### Task Execution
- **`NX_PARALLEL`** - Number of tasks to run in parallel (overrides nx.json configuration)
- **`NX_RUNNER`** / **`NX_TASKS_RUNNER`** - Specify which task runner to use from config
- **`NX_BATCH_MODE`** - Enable batch mode for executors that support batching
- **`NX_IGNORE_CYCLES`** - Ignore circular dependency errors in task graph

### Caching
- **`NX_SKIP_NX_CACHE`** / **`NX_DISABLE_NX_CACHE`** - Rerun tasks even when results are in cache
- **`NX_SKIP_REMOTE_CACHE`** / **`NX_DISABLE_REMOTE_CACHE`** - Disable all remote caching (Nx Cloud/Powerpack)
- **`NX_CACHE_DIRECTORY`** - Custom directory for task output cache (default: `.nx/cache`)
- **`NX_MAX_CACHE_SIZE`** - Maximum size of the local task cache
- **`NX_CACHE_PROJECT_GRAPH`** - Enable/disable project graph caching (useful when developing plugins)

### Daemon & Performance
- **`NX_DAEMON`** - Enable/disable the Nx daemon process (disable to see console.log in plugins)
- **`NX_PERF_LOGGING`** - Print debug information for profiling executors and Nx
- **`NX_PROFILE`** - Generate a performance profile for Chrome DevTools (e.g., `NX_PROFILE=profile.json`)
- **`NX_VERBOSE_LOGGING`** - Enable verbose debug logging for troubleshooting

### Terminal UI
- **`NX_TUI`** - Enable/disable Terminal UI (TUI) for running tasks
- **`NX_TUI_AUTO_EXIT`** - Control TUI auto-exit: `true` (exit immediately), `false` (never exit), or number (countdown seconds)
- **`NX_TASKS_RUNNER_DYNAMIC_OUTPUT`** - Use dynamic terminal output (vs static CI-style output)

### Affected Commands
- **`NX_BASE`** - Default base branch for calculating affected projects
- **`NX_HEAD`** - Default head branch for calculating affected projects

### Plugins & Generators
- **`NX_ADD_PLUGINS`** - Enable/disable automatic plugin addition for task inference (default: true)
- **`NX_DEFAULT_PROJECT`** - Default project for commands requiring a project
- **`NX_DRY_RUN`** - Perform dry run of generators without creating files or installing packages
- **`NX_INTERACTIVE`** - Allow Nx to prompt for additional information during generators
- **`NX_GENERATE_QUIET`** - Prevent logging of file operations during generate
- **`NX_PREFER_TS_NODE`** - Use ts-node instead of @swc-node/register for local plugin execution
- **`NX_PLUGIN_NO_TIMEOUTS`** - Disable timeouts for plugin operations

### Migration
- **`NX_MIGRATE_CLI_VERSION`** - Version of Nx to use for running migrations (default: latest)
- **`NX_MIGRATE_SKIP_REGISTRY_FETCH`** - Skip fetching metadata from registry, use installation method directly

### Other Configuration
- **`NX_WORKSPACE_DATA_DIRECTORY`** - Directory for project graph cache and internal data (default: `.nx/workspace-data`)
- **`NX_NATIVE_FILE_CACHE_DIRECTORY`** - Cache directory for native `.node` files (absolute path)
- **`NX_LOAD_DOT_ENV_FILES`** - Enable/disable loading environment files like `.local.env`, `.env.local`
- **`NX_SKIP_LOG_GROUPING`** - Disable log grouping in CI environments
- **`NX_FORMAT_SORT_TSCONFIG_PATHS`** - Sort TypeScript path mappings when generators modify them
- **`NX_SKIP_VSCODE_EXTENSION_INSTALL`** - Skip automatic installation of Nx Console extension

## Environment Variables Set by Nx

Nx automatically sets these variables during task execution, making them accessible within executors and generators:

- **`NX_TASK_TARGET_PROJECT`** - The project name of the task being run
- **`NX_TASK_TARGET_TARGET`** - The target name of the task being run
- **`NX_TASK_TARGET_CONFIGURATION`** - The configuration name of the task being run
- **`NX_GRAPH_CREATION`** - Set to `true` during graph creation (allows plugins to run different code)
- **`NX_DRY_RUN`** - Set to `true` during dry runs of generators
- **`NX_INTERACTIVE`** - Set to `false` when running generators with `--interactive=false`

## Application Environment Variables

### React Applications (Webpack)
For React apps using the `@nx/web:webpack` executor or Webpack CLI:
- **`NODE_ENV`** - Included in build process
- Variables prefixed with **`NX_PUBLIC_`** - e.g., `NX_PUBLIC_API_URL` (when using NxAppWebpackPlugin or withNx plugins)

### .env File Loading Order

Nx automatically loads environment variables from these files in order (first match wins):

1. `apps/my-app/.env.[target-name].[target-configuration-name].local`
2. `apps/my-app/.env.[target-name].[target-configuration-name]`
3. `apps/my-app/.env.[target-name].local`
4. `apps/my-app/.env.[target-name]`
5. `apps/my-app/.[target-name].[target-configuration-name].local.env`
6. `apps/my-app/.[target-name].[target-configuration-name].env`
7. `apps/my-app/.[target-name].local.env`
8. `apps/my-app/.[target-name].env`
9. `apps/my-app/.env.local`
10. `apps/my-app/.local.env`
11. `apps/my-app/.env`
12. `.env.[target-name].[target-configuration-name].local`
13. `.env.[target-name].[target-configuration-name]`
14. `.env.[target-name].local`
15. `.env.[target-name]`
16. `.[target-name].[target-configuration-name].local.env`
17. `.[target-name].[target-configuration-name].env`
18. `.[target-name].local.env`
19. `.[target-name].env`
20. `.env.local`
21. `.local.env`
22. `.env`

### Important Notes on .env Loading

- Variables found first take precedence and won't be overwritten
- System-level variables (like `NODE_ENV`) cannot be accidentally overwritten
- Use `.env.local` or `.local.env` for local overrides
- Target-specific files (`.env.[target-name]`) allow different settings per target
- Nest app-specific env files in `apps/your-app/`
- Use workspace/root level env files for workspace-wide settings

### Example

If both files exist:
- `apps/my-app/.env.local` contains `NX_PUBLIC_API_URL=http://localhost:3333`
- `apps/my-app/.env` contains `NX_PUBLIC_API_URL=https://api.example.com`

Nx will load the local version first, so `NX_PUBLIC_API_URL` will be `http://localhost:3333`.

## Nx Cloud Environment Variables

For Nx Cloud-specific environment variables, see the dedicated [Nx Cloud Environment Variables documentation](/ci/reference/env-vars).
