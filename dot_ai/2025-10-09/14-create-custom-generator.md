# How do I create a custom generator?

Nx allows you to create custom generators to automate your organization's specific processes and workflows. This is a powerful mechanism for standardizing how projects are created and maintained.

## Why Create Custom Generators?

Custom generators help you:

- **Automate** your organization's specific processes and workflows
- **Standardize** how and where projects are created in your workspace
- **Ensure** that your codebase follows your organization's best practices and coding standards
- **Scaffold** consistent project structures across your monorepo

## Basic Generator Structure

At their core, generators are functions with a specific signature and input options:

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

### 1. Create a Generator

You can create a new generator using the built-in generator from the `@nx/plugin` package:

```shell
nx g @nx/plugin:generator my-generator
```

### 2. Use @nx/devkit

Nx provides the `@nx/devkit` package containing utilities and helpers for building generators:

- `Tree` - Virtual file system for making changes
- `formatFiles` - Format generated files
- `installPackagesTask` - Install npm packages
- Many more utilities for common tasks

### 3. Example Generator

Here's an example generator that updates executor names across projects:

```typescript
import { getProjects, Tree, updateProjectConfiguration } from '@nx/devkit';

export function changeExecutorNameToNewName(tree: Tree) {
  const projects = getProjects(tree);

  for (const [name, project] of projects) {
    if (
      project.targets?.build?.executor === '@myorg/pluginName:oldExecutorName'
    ) {
      project.targets.build.executor = '@myorg/pluginName:newExecutorName';
      updateProjectConfiguration(tree, name, project);
    }
  }
}

export default changeExecutorNameToNewName;
```

## Learning Resources

Watch this video tutorial on creating generators:
- [Scaffold new Packages in a PNPM Workspaces Monorepo](https://www.youtube.com/embed/myqfGDWC2go)

## Additional Generator Types

Nx also supports:

- **Sync Generators**: For keeping workspace configuration in sync
- **Migration Generators**: For updating code when upgrading dependencies
- **Plugin Generators**: For creating reusable generators across workspaces

## Next Steps

1. Read the [full documentation on local generators](/extending-nx/recipes/local-generators)
2. Explore existing generators in Nx plugins for inspiration
3. Create a generator for your team's common workflows
4. Share generators across workspaces using Nx plugins

Custom generators are one of the most powerful features of Nx for scaling development teams and maintaining consistency across large codebases.
