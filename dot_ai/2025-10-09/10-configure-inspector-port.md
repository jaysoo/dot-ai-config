# How can I configure the inspector port for debug in serve?

When debugging Node.js applications in an Nx workspace, you can configure the inspector port for the debugger to attach to.

## Default Behavior

By default, Nx sets debugging to use a random available port on the system when you run the serve command with the inspect flag.

## Configuration Options

There are two ways to configure the debug port:

### Option 1: Set in project.json

You can set the port option in the `serve` target in your `project.json` file:

```json
{
  "targets": {
    "serve": {
      "executor": "@nx/node:execute",
      "options": {
        "port": 9229
      }
    }
  }
}
```

### Option 2: Pass as Command Line Argument

You can specify the port when running the serve command:

```shell
nx serve your-app --port 9229
```

Replace `your-app` with your project name and `9229` with your desired port number.

## Debugging Workflow

Once the inspector port is configured:

1. Start your application with the serve command
2. The inspector will listen on the configured port
3. Attach your debugger (VS Code, Chrome DevTools, etc.) to that port

## Common Debugger Ports

- **9229** - Default Node.js inspector port
- **9230-9239** - Common alternatives when running multiple services

## Additional Resources

For more information on debugging Node.js applications, see the [Node.js debugging getting started guide](https://nodejs.org/en/docs/guides/debugging-getting-started/#inspector-clients).

## Framework-Specific Notes

### Nest.js Applications

Nest applications also have the `inspect` flag set by default, allowing you to attach your debugger to the running instance. The same port configuration options apply.

### Manual Debugging

For advanced debugging scenarios, you can manually configure additional debugging options in your `project.json` or use environment variables to control the Node.js inspector behavior.
