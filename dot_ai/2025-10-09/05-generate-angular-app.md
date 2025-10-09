# How do I generate an Angular app?

Generating an Angular application in an Nx workspace is straightforward using the `@nx/angular` plugin.

## Basic Command

```shell
nx g @nx/angular:app apps/appName
```

Replace `appName` with your desired application name.

## Default Configuration

By default, the application will be generated with:

- **ESLint** as the linter
- **Jest** as the unit test runner
- **Cypress** as the E2E test runner

## Common Tasks

Once your Angular application is generated, you can run these commands:

```shell
# Serve the application in development mode
nx serve appName

# Build the application for production
nx build appName

# Run unit tests
nx test appName

# Run linting
nx lint appName

# Run end-to-end tests
nx e2e appName
```

## Prerequisites

Make sure you have the `@nx/angular` plugin installed in your workspace. If not, you can add it:

```shell
nx add @nx/angular
```

## Additional Options

The Angular app generator supports various options to customize your application:

- Routing configuration
- Styling options (CSS, SCSS, Less, etc.)
- Standalone components
- And many more

To see all available options, run:

```shell
nx g @nx/angular:app --help
```

## Example

```shell
# Generate an Angular app named "my-store" in the apps directory
nx generate @nx/angular:app apps/my-store
```

This will create a fully configured Angular application ready for development, complete with testing and linting setup.
