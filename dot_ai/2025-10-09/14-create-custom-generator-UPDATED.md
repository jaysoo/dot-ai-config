# How do I create a custom generator?

Nx allows you to create custom generators to automate your organization's specific processes and workflows. This is a powerful mechanism for standardizing development practices.

## Why Create Custom Generators?

Custom generators help you:

- **Automate** your organization's specific processes and workflows
- **Standardize** how and where projects are created in your workspace
- **Ensure** that your codebase follows your organization's best practices and coding standards

## Basic Generator Structure

At their core, generators are functions with a specific signature and input options that get invoked by Nx:

```typescript
import { Tree, formatFiles, installPackagesTask } from '@nx/devkit';

export default async function (tree: Tree, schema: any) {
  // Your implementation here
  // ...

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
```

## Getting Started

### 1. Create a Local Plugin (If Needed)

If you don't already have a local plugin:

```shell
nx add @nx/plugin
nx g @nx/plugin:plugin tools/my-plugin
```

### 2. Generate the Generator Files

Use the Nx CLI to generate the initial files:

```shell
nx generate @nx/plugin:generator tools/my-plugin/src/generators/my-generator
```

This creates:
- `generator.ts` - Entry point and implementation
- `schema.json` - Description, options, validation, and defaults
- `schema.d.ts` - TypeScript types for options
- `generator.spec.ts` - Tests for the generator

### 3. Use @nx/devkit Utilities

Nx provides the `@nx/devkit` package with utilities and helpers:

- `Tree` - Virtual file system for making changes
- `formatFiles` - Format generated files
- `installPackagesTask` - Install npm packages
- `generateFiles` - Generate files from templates
- `readProjectConfiguration` - Read project config
- `updateProjectConfiguration` - Update project config

## Creating Files with a Generator

### Define Template Files

Create a `files` folder to store static or dynamic templates:

```
happynrwl/
├── apps/
├── libs/
│   └── my-plugin
│       └── src
│           └── generators
│               └── my-generator/
│                    ├── files
│                    │   └── NOTES.md
│                    ├── index.ts
│                    └── schema.json
```

### Use EJS Syntax in Templates

Templates can use EJS syntax to substitute variables:

```markdown
Hello, my name is <%= name %>!
```

### Generate Files in Your Generator

```typescript
import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  readProjectConfiguration,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/js';

export default async function (tree: Tree, schema: any) {
  await libraryGenerator(tree, {
    name: schema.name,
    directory: `libs/${schema.name}`,
  });
  const libraryRoot = readProjectConfiguration(tree, schema.name).root;
  generateFiles(
    tree, // the virtual file system
    joinPathFragments(__dirname, './files'), // path to the file templates
    libraryRoot, // destination path of the files
    schema // config object to replace variable in file templates
  );
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
```

## Running Your Generator

Always use dry-run first to preview changes:

```shell
# Dry run to see changes without applying them
nx generate my-generator mylib --dry-run

# Actually generate
nx generate my-generator mylib
```

## Schema Configuration

The `schema.json` file defines options and validation:

```json
{
  "cli": "nx",
  "id": "test",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Library name",
      "$default": {
        "$source": "argv",
        "index": 0
      }
    }
  },
  "required": ["name"]
}
```

## Additional Generator Types

Nx also supports:

- **Sync Generators**: Keep workspace configuration in sync
- **Migration Generators**: Update code when upgrading dependencies
- **Plugin Generators**: Create reusable generators across workspaces

## Learn More

- [Local Generators Documentation](/docs/extending-nx/local-generators)
- [Creating Files with a Generator](https://nx.dev)
- Video: [Scaffold new Packages in a PNPM Workspaces Monorepo](https://www.youtube.com/embed/myqfGDWC2go)

Custom generators are one of the most powerful features of Nx for scaling development teams and maintaining consistency across large codebases.
