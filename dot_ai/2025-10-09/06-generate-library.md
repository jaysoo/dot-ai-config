# How can I generate a lib?

Generating libraries in an Nx workspace allows you to create shared code that can be used across multiple applications. The command varies slightly depending on the technology stack you're using.

## General Pattern

```shell
nx g @nx/[plugin]:lib libs/your-lib-name
```

Replace `[plugin]` with the appropriate plugin for your technology stack.

## Examples by Technology

### React Native Library
```shell
nx g @nx/react-native:lib libs/your-lib-name
```

### Expo Library
```shell
nx g @nx/expo:lib libs/your-lib-name
```

### Angular Library
```shell
nx g @nx/angular:library libs/mylibrary
```

### React Library
```shell
nx g @nx/react:library libs/mylibrary
```

### Node Library
```shell
nx g @nx/node:library libs/mylibrary
```

## Why Create Libraries?

Libraries are useful for:

- **Code Sharing**: Share common code between multiple applications
- **Organization**: Better organize your codebase by separating concerns
- **Reusability**: Create reusable components, utilities, and services
- **Testability**: Libraries can be tested independently
- **Dependency Management**: Nx tracks dependencies between libraries and applications

## Additional Options

Most library generators support various options such as:

- Directory structure
- Testing setup
- Linting configuration
- Build options

To see all available options for a specific library generator:

```shell
nx g @nx/[plugin]:lib --help
```

## Example

```shell
# Generate a React library for shared UI components
nx generate @nx/react:library libs/shared-ui

# Generate a Node library for shared utilities
nx generate @nx/node:library libs/shared-utils
```

Once created, you can import from these libraries using the TypeScript path aliases that Nx automatically configures in `tsconfig.base.json`.
