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

## Serving the App

To serve your new Angular app:

```shell
npx nx serve demo
```

The app is served at <http://localhost:4200> by default.

## Nx Command Syntax

Nx uses the following syntax to run tasks:

![Syntax for Running Tasks in Nx](/docs/_astro/run-target-syntax.ConMKi8d_Z1OJNvc.svg)

## Simple Example

Create an application named `my-app`:

```shell
nx g @nx/angular:application apps/my-app
```

## Generating Angular Libraries

You can also generate Angular libraries (not just apps):

```shell
nx g @nx/angular:lib libs/libName
```

By default, the library will be generated with:
- ESLint as the linter
- Jest as the unit test runner

Then test and lint with:

```shell
nx test libName
nx lint libName
```

## Learn More

- [Creating Libraries](/docs/concepts/decisions/project-size)
- [Library Types](/docs/concepts/decisions/project-dependency-rules)
- [Buildable and Publishable Libraries](/docs/concepts/buildable-and-publishable-libraries)
