# What Node.js versions does Nx support?

Nx officially supports the LTS (Long-Term Support) versions of Node.js, which are the actively maintained even-numbered versions. Below is the official compatibility matrix showing which Node.js versions are supported and tested for each major version of Nx.

## Node.js Compatibility Matrix

| Nx Version      | Node.js Versions Supported |
| --------------- | -------------------------- |
| 21.x (current)  | 24.x, ^22.12.0, ^20.19.0   |
| 20.x (previous) | 22.x, 20.x, 18.x           |
| 19.x            | 22.x, 20.x, 18.x           |
| 18.x            | 20.x, 18.x                 |

## Support Policy

### LTS Versions Only
Nx's policy is to support the LTS versions (actively maintained even-numbered versions) of Node.js. This ensures stability and long-term compatibility for production environments.

### Version Removal
Nx will only remove support for older Node.js versions in a **major version** of Nx to avoid unexpected disruption to existing projects.

### Adding New Versions
Support for newer LTS versions may be added in a **minor version** of Nx, as long as it doesn't break existing projects.

## Important Notes

### Other Versions May Work
Other versions of Node.js **may** still work without issue, even if they're not officially supported. This includes:

- **EOL (End-of-Life) versions** - Older versions that are no longer maintained
- **Odd version numbers** (e.g., 23, 21, 19) - Node.js actively discourages using these in production

However, these versions are not officially tested or supported by Nx.

### No `engines` Field
Nx intentionally does **not** include an `"engines"` field in the `package.json` file to allow for user flexibility. This means npm/yarn/pnpm won't enforce Node.js version requirements.

**This documentation page should be considered the official compatibility matrix** for Nx and Node.js versions.

## Best Practices

1. **Use LTS versions** - Stick to even-numbered Node.js versions (18.x, 20.x, 22.x, 24.x) for production
2. **Match your Nx version** - Ensure your Node.js version is officially supported by your Nx version
3. **Update regularly** - Keep both Nx and Node.js up to date within supported versions
4. **Test before upgrading** - When upgrading Node.js or Nx, test your workspace thoroughly

## Framework Compatibility

### Angular
For Angular-specific version compatibility, see the [Nx and Angular Versions](/getting-started/installation#nx-and-angular-versions) documentation. Nx supports the actively supported versions of Angular (current and LTS versions).

### Other Frameworks
Nx's Node.js version requirements apply to all frameworks and technologies it supports, including React, Vue, Next.js, Nest, and others.
