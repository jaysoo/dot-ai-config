# How can I create a new workspace for Gradle?

There are two main approaches to using Nx with Gradle projects: adding Nx to an existing Gradle workspace or setting up Gradle support in a new Nx workspace.

## Option 1: Add Nx to an Existing Gradle Workspace

If you already have a Gradle workspace, you can add Nx to it:

```shell
nx init
```

This command will:
- Add Nx to your existing Gradle workspace
- Install the `@nx/gradle` plugin automatically
- Configure Nx to work with your Gradle projects
- Enable Nx features like caching and task orchestration

### Running Gradle Tasks with Nx

After initialization, you can run Gradle tasks through Nx:

```shell
nx build <your gradle library>
```

## Option 2: Add Gradle to an Nx Workspace

If you already have an Nx workspace and want to add Gradle support:

```shell
nx add @nx/gradle
```

This will install the `@nx/gradle` plugin in your workspace.

## Benefits of Using Nx with Gradle

Once set up, you get:

- **Smart Caching**: Nx caches Gradle build outputs
- **Affected Commands**: Run tasks only on affected Gradle projects
- **Task Orchestration**: Run Gradle tasks across multiple projects efficiently
- **Project Graph**: Visualize dependencies between Gradle modules
- **CI Optimization**: Integrate with Nx Cloud for distributed builds and remote caching

## Running Gradle Tasks

After setup, you can use Nx commands to run Gradle tasks:

```shell
# Build a specific Gradle library
nx build my-gradle-lib

# Run tests on affected Gradle projects
nx affected -t test

# View the project graph including Gradle projects
nx graph
```

## Integration with Java/Kotlin

The `@nx/gradle` plugin works seamlessly with Java and Kotlin projects, providing modern monorepo tooling for JVM-based applications while respecting your existing Gradle configuration.

## Creating Other Workspace Types

For reference, creating workspaces with other technologies follows similar patterns:

### React Native Workspace
```shell
npx create-nx-workspace@latest your-workspace-name --preset=react-native --appName=your-app-name
```

### Express Workspace
```shell
npx create-nx-workspace --preset=express
```

### Interactive Setup
You can also run the command without arguments for interactive prompts:

```shell
npx create-nx-workspace your-workspace-name
```
