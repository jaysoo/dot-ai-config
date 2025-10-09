# How do I disable Nx TUI?

The Nx Terminal UI (TUI) provides an enhanced interface for running tasks. If you prefer the traditional terminal output, you can disable it.

## Default Behavior

Starting with Nx v21, the Terminal UI is enabled by default when you run tasks with:
- `nx run`
- `nx run-many`
- `nx affected`

The TUI will automatically be disabled in CI environments.

## Disabling the TUI

There are two ways to disable the Terminal UI:

### Option 1: Environment Variable

Set the `NX_TUI` environment variable to `false`:

```shell
# Disable TUI for a single command
NX_TUI=false nx run-many -t build

# Or export it for your entire session
export NX_TUI=false
nx run-many -t build
```

### Option 2: nx.json Configuration

Add the TUI configuration to your `nx.json` file to disable it permanently:

```json
{
  "tui": {
    "enabled": false
  }
}
```

## Additional TUI Configuration

You can also configure other TUI behaviors in `nx.json`:

```json
{
  "tui": {
    "enabled": true,
    "autoExit": true
  }
}
```

### Configuration Options

- **`enabled`**: Set to `false` to disable the TUI
- **`autoExit`**: When `true`, automatically exits the TUI when tasks complete. You can also use a number to specify how many seconds to keep the TUI open after completion

## When to Disable TUI

You might want to disable the TUI if:

- You prefer traditional terminal output
- You're running Nx in a scripted environment
- You're experiencing terminal compatibility issues
- You want to pipe output to other tools

## Supported Terminals

The TUI requires a supported terminal environment. If your terminal doesn't support the TUI features, Nx will automatically fall back to the traditional output format.
