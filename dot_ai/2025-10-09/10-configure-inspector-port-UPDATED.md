# How can I configure the inspector port for debug in serve?

When debugging Node.js applications in an Nx workspace, you can configure the inspector port that the debugger attaches to.

## Configuration Methods

There are two ways to configure the debug port for Node.js applications:

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

## Vite Applications

For Vite-based applications, you can set the port in either:

### In vite.config.ts
Configure the port directly in your Vite configuration file.

### In project.json
Set it in the serve target options:

```json
{
  "my-app": {
    "targets": {
      "serve": {
        "executor": "@nx/vite:dev-server",
        "defaultConfiguration": "development",
        "options": {
          "buildTarget": "my-app:build",
          "port": 4200
        },
        "configurations": {
          // ...
        }
      }
    }
  }
}
```

## Manual Debugging

For advanced debugging scenarios, you can manually configure the debug port by:
- Setting the port option in the `serve` target in the `project.json`
- Running the serve command with `--port <number>`

## Common Debugger Ports

- **9229** - Default Node.js inspector port
- **9230-9239** - Common alternatives when running multiple services
- **4200** - Common default for development servers

## Additional Resources

For more information on debugging Node.js applications, see the [Node.js debugging getting started guide](https://nodejs.org/en/docs/guides/debugging-getting-started/#inspector-clients).

## Debugging Workflow

Once the inspector port is configured:

1. Start your application with the serve command
2. The inspector will listen on the configured port
3. Attach your debugger (VS Code, Chrome DevTools, etc.) to that port
