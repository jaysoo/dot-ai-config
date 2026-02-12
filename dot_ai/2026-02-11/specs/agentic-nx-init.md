# Agentic `nx init` Specification

**Issue:** [NXA-921](https://linear.app/nxdev/issue/NXA-921/implement-agentic-nx-init)
**Date:** 2026-02-11
**Status:** Ready for Implementation

## Overview

Make `nx init` work seamlessly for AI agents (Claude Code, Cursor, OpenCode, Replit) without human input or intervention. The goal is for AI to initialize Nx in any workspace autonomously, with structured output for progress tracking and graceful handling of decisions that require user input.

## Phasing

### Phase 1 (This Task - NXA-921)
- `--help` support via yargs
- AI agent detection
- Non-interactive mode enforcement
- Default behaviors for AI mode
- NDJSON structured output
- `--plugins` flag with `needs_input` flow
- Success/error/warning result structures
- Error log file for debugging

### Phase 2 (Follow-up)
- `NEXT_STEPS.md` file generation

### Phase 3 (Orca/Cloud Board)
- Nx CLI/API for Cloud onboarding without browser
- `nx connect` improvements for agentic use

---

## Requirements

### 1. Add `--help` Support

**Problem:** `--help` does not work with `nx init` currently.

**Solution:** Add standard yargs `--help` support.

- Use yargs built-in help formatting (text-based)
- No NDJSON needed - standard help output is sufficient for both humans and AI
- Document all flags including new ones (`--plugins`, etc.)
- Include clear descriptions of what `--nxCloud` does (remote caching, CI insights)

### 2. AI Agent Detection

**Implementation:** Duplicate detection logic from CNW (`packages/create-nx-workspace/src/utils/ai/ai-output.ts`).

Create new file: `packages/nx/src/command-line/init/utils/ai-detection.ts`

```typescript
let _isAiAgent: boolean | null = null;

export function isAiAgent(): boolean {
  if (_isAiAgent === null) {
    _isAiAgent = isClaudeCode() || isOpenCode() || isReplitAi() || isCursorAi();
  }
  return _isAiAgent;
}

export function isClaudeCode(): boolean {
  return !!process.env.CLAUDECODE || !!process.env.CLAUDE_CODE;
}

export function isOpenCode(): boolean {
  return !!process.env.OPENCODE;
}

export function isReplitAi(): boolean {
  return !!process.env.REPL_ID;
}

export function isCursorAi(): boolean {
  const pagerMatches = process.env.PAGER === 'head -n 10000 | cat';
  const hasCursorTraceId = !!process.env.CURSOR_TRACE_ID;
  const hasComposerNoInteraction = !!process.env.COMPOSER_NO_INTERACTION;
  return pagerMatches && hasCursorTraceId && hasComposerNoInteraction;
}
```

**Note:** Do NOT share code with CNW. CNW is self-contained and cannot import from nx.

### 3. AI Mode Default Behaviors

When `isAiAgent()` returns `true`, automatically apply these defaults:

| Flag | AI Mode Default | Rationale |
|------|-----------------|-----------|
| `--interactive` | `false` (forced) | AI can't do interactive prompts |
| `--nxCloud` | `skip` | Avoid unprocured vendor platform issues |
| `--plugins` | exit with `needs_input` | Let AI ask user for decision |
| `--useDotNxInstallation` | auto-detect | `true` if no root `package.json` (Java, .NET, Gradle, etc.) |
| Setup mode | `minimum` | Less input required, follow-ups can expand |

**Auto-detect `.nx` installation:**
```typescript
function shouldUseDotNxInstallation(): boolean {
  const rootPackageJson = path.join(workspaceRoot, 'package.json');
  return !fs.existsSync(rootPackageJson);
}
```

### 4. NDJSON Output

When AI agent is detected, output structured NDJSON messages to stdout.

#### Progress Stages

```typescript
export type ProgressStage =
  | 'starting'
  | 'detecting'
  | 'configuring'
  | 'installing'
  | 'plugins'
  | 'complete'
  | 'error'
  | 'needs_input';
```

#### Message Types

**Progress Message:**
```typescript
interface ProgressMessage {
  stage: ProgressStage;
  message: string;
}
```

**Needs Input (Plugin Selection):**
```typescript
interface NeedsInputResult {
  stage: 'needs_input';
  success: false;
  inputType: 'plugins';
  message: string;
  detectedPlugins: Array<{
    name: string;      // e.g., '@nx/vite'
    reason: string;    // e.g., 'vite detected in package.json'
  }>;
  options: string[];   // ['--plugins=all', '--plugins=skip', '--plugins=@nx/vite,@nx/jest']
  recommendedOption: string;  // '--plugins=skip'
  recommendedReason: string;  // 'Safest option if unsure. You can always add plugins later with nx add.'
  exampleCommand: string;     // 'nx init --plugins=@nx/vite'
}
```

**Success Result:**
```typescript
interface SuccessResult {
  stage: 'complete';
  success: true;
  result: {
    nxVersion: string;
    projectsDetected: number;
    pluginsInstalled: string[];
  };
  warnings?: Array<{
    plugin: string;
    error: string;
    hint: string;
  }>;
  userNextSteps: {
    description: string;  // 'Show user these steps'
    steps: Array<{
      title: string;
      command?: string;
      url?: string;
      note?: string;
    }>;
  };
  docs: {
    gettingStarted: string;
    nxCloud: string;
  };
}
```

**Error Result:**
```typescript
interface ErrorResult {
  stage: 'error';
  success: false;
  errorCode: ErrorCode;
  error: string;
  hints: string[];
  errorLogPath?: string;
}

type ErrorCode =
  | 'ALREADY_INITIALIZED'
  | 'PACKAGE_INSTALL_ERROR'
  | 'UNCOMMITTED_CHANGES'
  | 'UNSUPPORTED_PROJECT'
  | 'PLUGIN_INIT_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';
```

#### Output Function

```typescript
export function writeAiOutput(message: AiOutputMessage): void {
  if (isAiAgent()) {
    process.stdout.write(JSON.stringify(message) + '\n');
  }
}

export function logProgress(stage: ProgressStage, message: string): void {
  writeAiOutput({ stage, message });
}
```

### 5. `--plugins` Flag

**New flag:** `--plugins=<value>`

**Accepted values:**
- `skip` - Install no plugins, proceed with init
- `all` - Install all detected plugins
- `@nx/vite,@nx/jest` - Comma-separated list of specific plugins

**Behavior:**
- If `--plugins` is provided → use specified value
- If `--plugins` is NOT provided AND `isAiAgent()` → exit with `needs_input` result
- If `--plugins` is NOT provided AND NOT AI → current interactive prompt behavior

**`needs_input` response must include:**
- List of detected plugins with reasons
- `recommendedOption: '--plugins=skip'`
- `recommendedReason: 'Safest option if unsure. You can always add plugins later with nx add.'`

### 6. Error Handling

#### Error Codes and Hints

```typescript
const errorHints: Record<ErrorCode, string[]> = {
  ALREADY_INITIALIZED: [
    'Workspace already has nx.json',
    'Remove nx.json to reinitialize',
    'Use nx add to add plugins to existing workspace'
  ],
  PACKAGE_INSTALL_ERROR: [
    'Check your package manager is installed correctly',
    'Try clearing npm/yarn/pnpm cache',
    'Check for conflicting global packages'
  ],
  UNCOMMITTED_CHANGES: [
    'Commit or stash your changes before running nx init',
    'Use --force to skip this check (not recommended)'
  ],
  UNSUPPORTED_PROJECT: [
    'Project type could not be detected',
    'Ensure you are in a valid project directory',
    'Check https://nx.dev/getting-started for supported project types'
  ],
  PLUGIN_INIT_ERROR: [
    'One or more plugin init generators failed',
    'Check the error log for details',
    'Try running nx add <plugin> manually'
  ],
  NETWORK_ERROR: [
    'Check your internet connection',
    'Try again in a few moments',
    'Check if npm registry is accessible'
  ],
  UNKNOWN: [
    'An unexpected error occurred',
    'Check the error log for details',
    'Report issues at https://github.com/nrwl/nx/issues'
  ]
};
```

#### Error Log File

Write detailed error information to a temp file for AI debugging:

```typescript
const errorLogPath = path.join(os.tmpdir(), `nx-init-error-${Date.now()}.log`);
fs.writeFileSync(errorLogPath, errorDetails);
```

Include `errorLogPath` in the error result so AI can read it for more context.

#### Partial Success (Warnings)

If init succeeds but some plugins fail, return `complete` with `warnings` array:

```json
{
  "stage": "complete",
  "success": true,
  "result": { ... },
  "warnings": [
    {
      "plugin": "@nx/jest",
      "error": "Init generator failed: missing peer dependency",
      "hint": "Run 'nx add @nx/jest' manually after installing jest"
    }
  ]
}
```

### 7. Success Output - User Next Steps

After successful init, include structured next steps for the AI to present to the user:

```typescript
const userNextSteps = {
  description: 'Show user these steps to complete setup',
  steps: [
    {
      title: 'Explore your workspace',
      command: 'nx graph',
      note: 'Visualize project dependencies'
    },
    {
      title: 'Run a task',
      command: 'nx build <project>',
      note: 'Replace <project> with a project name from nx graph'
    },
    {
      title: 'Enable Remote Caching',
      command: 'nx connect',
      note: 'Speed up CI by 30-70% with Nx Cloud'
    }
  ]
};
```

**Important:** Do not label steps as "Optional" - let user/AI decide importance.

### 8. Telemetry

Track AI agent mode in telemetry metadata, same as CNW:

```typescript
if (isAiAgent()) {
  telemetryMeta.isAiAgent = true;
}
```

No additional AI-specific telemetry required.

---

## Implementation Notes

### Files to Modify

1. **`packages/nx/src/command-line/init/command-object.ts`**
   - Add `--help` support
   - Add `--plugins` option definition

2. **`packages/nx/src/command-line/init/init-v2.ts`**
   - Import AI detection utilities
   - Apply AI mode defaults at start
   - Add NDJSON progress output throughout flow
   - Handle `--plugins` flag logic
   - Return structured results

3. **New: `packages/nx/src/command-line/init/utils/ai-detection.ts`**
   - AI agent detection functions (duplicate from CNW)

4. **New: `packages/nx/src/command-line/init/utils/ai-output.ts`**
   - NDJSON output types and functions
   - Progress logging helpers
   - Result builders (success, error, needs_input)

### Testing

**Unit Tests Required:**
- AI detection functions (each environment)
- NDJSON message formatting
- Error hints mapping
- `--plugins` flag parsing

**Manual Testing:**
- Test with Claude Code (`CLAUDECODE=1`)
- Test with Cursor (mock env vars)
- Test with actual AI agents in real workflows
- Verify non-AI users are unaffected

---

## Example Flows

### Flow 1: AI runs `nx init` without flags

```
$ CLAUDECODE=1 nx init

{"stage":"starting","message":"Analyzing workspace..."}
{"stage":"detecting","message":"Detected tools: vite, jest, eslint"}
{"stage":"needs_input","success":false,"inputType":"plugins","message":"Plugin selection required","detectedPlugins":[{"name":"@nx/vite","reason":"vite detected in package.json"},{"name":"@nx/jest","reason":"jest detected in package.json"},{"name":"@nx/eslint","reason":"eslint detected in package.json"}],"options":["--plugins=all","--plugins=skip","--plugins=@nx/vite,@nx/jest"],"recommendedOption":"--plugins=skip","recommendedReason":"Safest option if unsure. You can always add plugins later with nx add.","exampleCommand":"nx init --plugins=@nx/vite"}

(process exits, AI asks user)
```

### Flow 2: AI runs `nx init --plugins=skip`

```
$ CLAUDECODE=1 nx init --plugins=skip

{"stage":"starting","message":"Analyzing workspace..."}
{"stage":"detecting","message":"Detected tools: vite, jest, eslint"}
{"stage":"configuring","message":"Creating nx.json..."}
{"stage":"installing","message":"Installing nx packages..."}
{"stage":"complete","success":true,"result":{"nxVersion":"21.0.0","projectsDetected":3,"pluginsInstalled":[]},"userNextSteps":{"description":"Show user these steps","steps":[{"title":"Explore your workspace","command":"nx graph"},{"title":"Add plugins for detected tools","command":"nx add @nx/vite"},{"title":"Enable Remote Caching","command":"nx connect"}]},"docs":{"gettingStarted":"https://nx.dev/getting-started/intro","nxCloud":"https://nx.dev/ci/intro/why-nx-cloud"}}
```

### Flow 3: AI runs `nx init` in Java monorepo

```
$ CLAUDECODE=1 nx init --plugins=skip

{"stage":"starting","message":"Analyzing workspace..."}
{"stage":"detecting","message":"Detected: Gradle project (no package.json)"}
{"stage":"configuring","message":"Creating .nx installation..."}
{"stage":"installing","message":"Installing nx to .nx directory..."}
{"stage":"complete","success":true,"result":{"nxVersion":"21.0.0","projectsDetected":5,"pluginsInstalled":[]},...}
```

### Flow 4: Partial success with warning

```
$ CLAUDECODE=1 nx init --plugins=@nx/vite,@nx/jest

{"stage":"starting","message":"Analyzing workspace..."}
{"stage":"configuring","message":"Creating nx.json..."}
{"stage":"installing","message":"Installing nx packages..."}
{"stage":"plugins","message":"Installing @nx/vite..."}
{"stage":"plugins","message":"Installing @nx/jest..."}
{"stage":"complete","success":true,"result":{"nxVersion":"21.0.0","projectsDetected":3,"pluginsInstalled":["@nx/vite"]},"warnings":[{"plugin":"@nx/jest","error":"Init generator failed","hint":"Run 'nx add @nx/jest' manually"}],...}
```

---

## Out of Scope

- `nx connect` improvements (Phase 3 - Orca/Cloud board)
- `NEXT_STEPS.md` file generation (Phase 2)
- Documentation updates on nx.dev (separate AX pass)
- New AI agent detection beyond current list (Claude, OpenCode, Replit, Cursor)
- Explicit `--ai` or `--ndjson` flags (rely on environment detection)

---

## Acceptance Criteria

1. [ ] `nx init --help` displays help text via yargs
2. [ ] AI agents are detected via environment variables
3. [ ] AI mode forces `--interactive=false`
4. [ ] AI mode defaults `--nxCloud=skip`
5. [ ] AI mode auto-detects `.nx` installation for non-JS projects
6. [ ] AI mode defaults to minimum setup
7. [ ] NDJSON progress messages output for each stage
8. [ ] `--plugins` flag accepts `skip`, `all`, or comma-separated list
9. [ ] Missing `--plugins` in AI mode returns `needs_input` with `--plugins=skip` as recommended
10. [ ] Success result includes `userNextSteps` with Nx Cloud mention
11. [ ] Error results include `errorCode`, `hints`, and `errorLogPath`
12. [ ] Partial failures return `complete` with `warnings` array
13. [ ] Non-AI users are unaffected by changes
14. [ ] Unit tests cover AI detection and NDJSON formatting
15. [ ] Telemetry tracks `isAiAgent` in metadata
