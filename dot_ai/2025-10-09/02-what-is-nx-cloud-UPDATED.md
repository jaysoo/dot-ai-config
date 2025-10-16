# What is Nx Cloud?

Nx Cloud is the umbrella term for all CI-related products that Nx provides. It's a companion service that extends Nx's capabilities to provide enhanced performance and collaboration features for continuous integration.

## Configuration

Nx Cloud is configured in your `nx.json` file. You connect to the Nx Cloud service using an `nxCloudId`:

```json
{
  "nxCloudId": "SOMEID"
}
```

## Core Capabilities

### Remote Caching
Nx Cloud enables distributed task execution and remote caching, allowing teams to:
- Share computation results across the entire team and CI
- Avoid redundant builds and test runs
- Dramatically improve CI performance

### Distributed Task Execution
Run tasks across multiple machines while maintaining a consolidated view as if everything ran locally.

## Benefits

- **Faster CI Builds**: Distribute tasks across multiple machines for better performance
- **Shared Cache**: Team members and CI agents can share computation results
- **Better DX**: Improved developer experience with enhanced visibility into builds
- **E2E Test Deflaking**: Advanced features for more reliable end-to-end tests

## Learn More

For detailed configuration options, see the [Nx Cloud Configuration Options page](/docs/reference/nx-cloud-cli).

To set up Nx Cloud for your project, visit the [CI with Nx guide](/docs/guides/nx-cloud/setup-ci).
