# What Node.js versions does Nx support?

Nx officially supports the LTS (Long-Term Support) versions of Node.js, which are the actively maintained even-numbered versions.

## Node.js Compatibility Matrix

Below is a reference table that matches the most recent major versions of Nx to the versions of Node.js that they officially support and are tested against:

| Nx Version      | Node.js Versions Supported |
| --------------- | -------------------------- |
| 21.x (current)  | 24.x, ^22.12.0, ^20.19.0   |
| 20.x (previous) | 22.x, 20.x, 18.x           |
| 19.x            | 22.x, 20.x, 18.x           |
| 18.x            | 20.x, 18.x                 |

## Support Policy

### LTS Versions Only
Nx's policy is to support the LTS versions (i.e., actively maintained even-numbered versions) of Node.js. This ensures stability and long-term compatibility for production environments.

### Version Removal
Nx will only remove support for older Node.js versions in a **major version** of Nx to avoid unexpected disruption.

### Adding New Versions
Nx may add support for newer LTS versions in a **minor version** of Nx as long as it would not break existing projects.

## Important Notes

### Other Versions May Work

Other versions of Node.js **may** still work without issue for these versions of Nx. Those include:
- Versions that are already **EOL (End-of-Life)**
- **Odd version numbers** (e.g., 23) - Node.js actively discourages using these in production

However, these versions are not officially tested or supported.

### No `engines` Field

Nx intentionally does **not** include an `"engines"` field in the `package.json` file to allow for user flexibility.

**This documentation page should be considered the official compatibility matrix.**

## TypeScript Compatibility

Unlike Node.js, TypeScript doesn't follow semver conventions for breaking changes. Nx will only remove support for older TypeScript versions in a major version.

| Nx Version      | TypeScript Version |
| --------------- | ------------------ |
| 21.x (current)  | >= 5.4.2 < 5.9.0   |
| 20.x (previous) | ~5.4.2             |
| 19.x            | ~5.4.2             |
| 18.x            | ~5.4.2             |

## Supported Nx Versions

Currently supported major versions of Nx:

| Version | Support Type | Release Date |
| :-----: | :----------: | :----------: |
|   v21   |    Current   |  2025-05-05  |
|   v20   |      LTS     |  2024-10-06  |
|   v19   |      LTS     |  2024-05-06  |
|  v18\*  |      LTS     |  2024-02-03  |
|   v17   |      LTS     |  2023-10-19  |

**\*Note:** v18 is a special release and does not fit into the normal release cycle. Thus, v17 continues to be supported according to schedule.

## Best Practices

1. **Use LTS versions** - Stick to even-numbered Node.js versions (18.x, 20.x, 22.x, 24.x) for production
2. **Match your Nx version** - Ensure your Node.js version is officially supported by your Nx version
3. **Update regularly** - Keep both Nx and Node.js up to date within supported versions
4. **Test before upgrading** - When upgrading Node.js or Nx, test your workspace thoroughly

## Framework Compatibility

### Angular
The latest version of Nx supports the [actively supported versions of Angular (current and LTS versions)](https://angular.dev/reference/releases#actively-supported-versions).

**Note**: Support for multiple Angular versions was added in Nx v15.7.0, starting with Angular v14 and v15.

### Other Frameworks
Nx's Node.js version requirements apply to all frameworks and technologies it supports, including React, Vue, Next.js, Nest, and others.

## Troubleshooting

If you encounter issues with Nx, make sure you are using a supported version of Node.js and TypeScript before filing an issue. This page is updated regularly to reflect the latest supported versions.
