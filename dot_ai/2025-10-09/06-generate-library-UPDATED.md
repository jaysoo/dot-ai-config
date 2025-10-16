# How can I generate a lib?

Generating libraries in an Nx workspace allows you to create shared code that can be used across multiple applications. Nx provides generators to create libraries for different technology stacks.

## Why Generate Libraries?

Nx allows you to create libraries with just one command. Reasons to create a library include:

- **Share code between applications** - Reuse common functionality
- **Publish a package** to be used outside the monorepo
- **Better visualize the architecture** using `nx graph`
- **Improve organization** by separating concerns

## General Pattern

The command varies depending on the technology stack:

```shell
nx g @nx/[plugin]:lib libs/your-lib-name
```

Replace `[plugin]` with the appropriate plugin for your technology.

## Examples by Technology

### Next.js Library
```shell
nx g @nx/next:lib libs/my-new-lib
```

### React Native Library
```shell
nx g @nx/react-native:lib libs/<your-lib-name>
```

### Expo Library
```shell
npx nx g @nx/expo:lib libs/your-lib-name
```

### TypeScript/JavaScript Library
```shell
npx nx g @nx/js:lib libs/mylib
```

The `@nx/js:lib` generator creates a library configured according to the options you provide.

## Buildable Libraries

By default, many libraries are generated as buildable libraries. For example, the `@nx/js:lib` generator creates a buildable library using the `@nx/js:tsc` executor.

### Configuring the Build Tool

You can configure the tools to build your library using the `--bundler` flag:

- **`tsc`** or **`swc`**: Creates a buildable library using the specified compiler
- **`rollup`** or **`vite`**: Creates a buildable library using the specified bundler (rollup defaults to tsc compiler)
- **`esbuild`**: Allows configuration via `esbuildOptions` in `project.json` to specify bundling behavior

## Additional Options

Most library generators support various configuration options such as:
- Directory structure
- Testing setup
- Linting configuration
- Build options

To see all available options:

```shell
nx g @nx/[plugin]:lib --help
```

## Using Generated Libraries

Once created, you can import from these libraries using the TypeScript path aliases that Nx automatically configures in `tsconfig.base.json`.
