# Module Federation Dynamic Manifest and Static Fallback Issues

## Overview

There are multiple issues with the Webpack Module Federation implementation related to dynamic remotes and manifests, specifically around URL property handling and static server fallbacks.

## Issues Identified

### 1. URL Property in Dynamic Manifests
The URL property needs to be inserted as a string in the dynamic manifest configuration. This is currently not being handled correctly.

### 2. Static Fallback Not Working
The fallback mechanism to serve static versions of remotes is not functioning as expected. When dynamic remotes are unavailable, the system should fall back to static servers, but this fallback is failing.

### 3. Potential Root Cause
Both issues might be related to the same underlying problem - incorrect matching logic in the module federation configuration.

## Action Items

1. **Create Example Repository**: Build a minimal reproduction example that demonstrates both issues
   - Dynamic manifest with URL property as string
   - Static fallback scenario when dynamic remote is unavailable

2. **Communication**: Notify Colm when he's back online today about these issues

3. **Review Session**: Schedule a review for tomorrow (Friday) to investigate and resolve these issues together

## Technical Details to Investigate

- How the URL property is currently being parsed/inserted in dynamic manifests
- The matching logic that determines when to use static vs dynamic remotes
- The fallback mechanism implementation and why it's not triggering properly

## Next Steps

- Document the current behavior vs expected behavior
- Create the reproduction repository with clear test cases
- Prepare debugging approach for Friday's session

---

**Note**: This relates to Nx's Module Federation support, which is a critical feature for micro-frontend architectures using Webpack 5's Module Federation plugin.